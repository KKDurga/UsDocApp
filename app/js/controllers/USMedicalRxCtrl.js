eHnoteWebApp.controller("USMedicalRxCtrl", ["$scope", "$rootScope", "$uibModalInstance", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", "eHnoteConditionsDataService", "ScreenType", "CreateRxObj", "cache", function ($scope, $rootScope, $uibModalInstance, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate, eHnoteConditionsDataService, ScreenType, CreateRxObj, cache) {

    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.cacheStorageItem = cache;
    $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.RoleId = $scope.userLoginDetails.RoleID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
   

    $scope.patientid = $scope.cacheStorageItem.PatientID || 0;
    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();


    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
    $scope.ScreenType = ScreenType;

    if (doctorinfo !== undefined) {
        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {
                $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            }
        }
    }
    $scope.CreateRxObj = CreateRxObj;
    $scope.ActivePrescriptionsArray = angular.copy($scope.CreateRxObj.ActivePrescriptionsArray) || [];

    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };
    $scope.PaitentDetails = {
        "FullName": $scope.selectedPatientData.Patient[0].FullName || "",
        "PatientDisplayId": $scope.selectedPatientData.Patient[0].PatientDisplayId || "",
        "MobileNo": $scope.selectedPatientData.Patient[0].MobileNo || 0,
        "DOB": $scope.selectedPatientData.Patient[0].DOB || "",
        "AgeInYears": $scope.selectedPatientData.Patient[0].AgeInYears || 0,
        "AgeInMonths": $scope.selectedPatientData.Patient[0].AgeInMonths || 0,
        "S3URL": $scope.selectedPatientData.Patient[0].S3URL || '',
        "SocialSecurityNo": $scope.selectedPatientData.Patient[0].SocialSecurityNo || '',
        "BloodGroupName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || '',
        "MaritalStatusName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || '',
        "ExternalComanagerName": $scope.selectedPatientData.Patient[0].ExternalComanagerName || '',
        "InternalComanagerName": $scope.selectedPatientData.Patient[0].InternalComanagerName || '',
        "PCPDoctorName": $scope.selectedPatientData.Patient[0].PCPDoctorName || '',
        "RefferalName": $scope.selectedPatientData.Patient[0].ReferralName || '',
        "ContactInfo": {
            "EmailID": $scope.selectedPatientData.Patient[0].EmailId || '',
        }
    }

    $scope.PostalAddressSummaryObj = {
        "AddressId": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
        "AddressLine1": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
        "AddressLine2": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
        "ZipCode": $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
        "CountyId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
        "CountyName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
        "CityName": $scope.selectedPatientData.PatientAddress.PostalAddress.CityName || "",
        "CityId": $scope.selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
        "StateName": $scope.selectedPatientData.PatientAddress.PostalAddress.StateName || "",
        "StateId": $scope.selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
        "CountryName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
        "CountryId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
    }

    $scope.PermanentAddressSummaryObj = {
        "AddressId": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
        "AddressLine1": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
        "AddressLine2": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
        "ZipCode": $scope.selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
        "CountyId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
        "CountyName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
        "CityName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
        "CityId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
        "StateName": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
        "StateId": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
        "CountryName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
        "CountryId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
    }

    $scope.DemographicSummaryObj = {
        "LanguageName": $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
        "Proficiency": $scope.selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
        "SexualOrientation": $scope.selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
        "GenderIdentityStatus": $scope.selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
    }

    $scope.PatientMNumber = $scope.selectedPatientData.Patient[0].Altareacode + $scope.selectedPatientData.Patient[0].PatientHomeNumber;

    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
    $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

    $scope.PatientOfficeNumber = $scope.selectedPatientData.Patient[0].OfficeAreaCode + $scope.selectedPatientData.Patient[0].PatientOfficeNumber;

    var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
    $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;



    $scope.ApptRcopiaUserInfo = {
        "RcopiaProviderUserName": "",
        "RcopiaProviderUserExternalId": "",
        "RcopiaProviderPassword": "",
        "RcopiaPreparerUserName": "",
        "RcopiaPreparerExternalId": "",
    }
    var RcopiaUserInfo = datapersistanceFactory.getItem('IsRcopiaUserDataInfo');
    RcopiaUserInfo = RcopiaUserInfo || [];
    if (RcopiaUserInfo.length > 0) {
        $scope.ApptRcopiaUserInfo.RcopiaProviderUserName = RcopiaUserInfo[0].RcopiaProviderUserName;
        $scope.ApptRcopiaUserInfo.RcopiaProviderUserExternalId = RcopiaUserInfo[0].RcopiaProviderUserExternalId;
        $scope.ApptRcopiaUserInfo.RcopiaProviderPassword = RcopiaUserInfo[0].RcopiaProviderPassword;
        $scope.ApptRcopiaUserInfo.RcopiaPreparerUserName = RcopiaUserInfo[0].RcopiaPreparerUserName;
        $scope.ApptRcopiaUserInfo.RcopiaPreparerExternalId = RcopiaUserInfo[0].RcopiaPreparerExternalId;
    }

    function getnewRcopiaPatientObj() {
        var obj = {
            "FirstName": "",
            "LastName": "",
            "ExternalID": "",
            "DeleteInd": "n",
            "MiddleName": "",
            "RcopiaPatientId": $scope.selectedPatientData.Patient[0].RcopiaPatientId || 0,
            "DOB": "",
            "Sex": "",
            "HomePhone": "",
            "Address1": "",
            "Address2": "",
            "City": "",
            "State": "",
            "Zip": "",
            "Suffix": "",
            "Prefix": "",
            "EmailId": "",
            "Race": "",
            "Ethnicity": "",
            "MobilePhone": ""
        };
        return obj;
    }
    $scope.RcopiaPatientObj = getnewRcopiaPatientObj();

    function getEmptyPrescriptionObj() {

        var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

        var previousDate = new Date()
        previousDate.setDate(previousDate.getDate() - 1)
        var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

        $scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
        if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
            var LastUpdateDateFormate = $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate;
        } else {
            var LastUpdateDateFormate = PreviousDate;
        }

        var obj = {
            //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
            "VisitId": $scope.cacheStorageItem.PatientVisitId,
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "PatientId": $scope.appointmentInfo.PatientID,
            "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
            "PatientPrescriptionId": 0,
            "AppointmentId": $scope.appointmentInfo.AppointmentID,
            "LastUpdateDate": LastUpdateDateFormate,
            "DeleteInd": "N",
            "PrescriptionDetails": [],
        };
        return obj;
    };

    $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

    function getnewMedicalRXPrescriptionObj() {
        var obj = {
            "UserId": $scope.UserId,
            "DoctorId": $scope.appointmentInfo.DoctorID || $scope.UserId,
            "PatientId": $scope.appointmentInfo.PatientID,
            "OrganizationId": $scope.HospitalID,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "ConsultationId": $scope.cacheStorageItem.PatientVisitId,
            "PatientRcopiaId": $scope.selectedPatientData.Patient[0].RcopiaPatientId,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": $scope.ApptRcopiaUserInfo.RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": $scope.ApptRcopiaUserInfo.RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": $scope.ApptRcopiaUserInfo.RcopiaProviderPassword,
            "PatientPrescriptionId": 0,
            "PrescribedDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "LastUpdateDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "RcopiaPrescriptionId": "",
            "EncounterDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "EncounterActionTaken": "created",
            "EncounterExternalId": doctorinfo.doctordata.UserAddress[0].RcopiaProviderUserExternalId,
            "EncounterUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "EncounterUserRcopiaId": null,
            "EncounterUserExternalId": doctorinfo.doctordata.UserAddress[0].RcopiaProviderUserExternalId,
            "ProviderRcopiaId": null,
            "ProviderUserName": null,
            "ProviderExternalId": null,
            "PreparerRcopiaId": null,
            "PreparerUserName": $scope.ApptRcopiaUserInfo.RcopiaPreparerUserName || null,
            "PreparerExternalId": $scope.ApptRcopiaUserInfo.RcopiaPreparerExternalId || null,
            "PharmacyNCPDPID": null,
            "PharmacyRcopiaId": null,
            "PharmacyExternalId": "",
            "PrescriptionList": []
        }

        return obj;
    }

    $scope.AddNewMedicalRxPrescriptionObj = getnewMedicalRXPrescriptionObj();

    $scope.DiagnosisTemplatesArray = [];
    $scope.GetUserConsultationTemplateDetails = function () {
        var params = {
            "UserId": $scope.UserId,
            "SearchText": "",
            "PageSize": 1000,
            "PageNumber": 1,
            "OrganizationId": $scope.HospitalId,
            "IsFavoriteInd": 0
        }
        eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
                $scope.ActionsTakenlist = resp.data.ConsultationActionsTaken || [];
                $scope.DoctorNoteslist = resp.data.DoctorNotes || [];
                $scope.PatientInstructionslist = resp.data.PatientInstructions || [];
                $scope.AssessmentsNoteslist = resp.data.AssessmentsNotesTemplates || [];
                $scope.PlanofDiscussionTemplateslist = resp.data.DiscussionTemplates || [];


                $scope.AnteriorTemplatesArray = resp.data.ExaminationTemplatesArray || [];

                /*$scope.DiagnosisTemplatesArray = $scope.DiagnosisTemplatesArray.concat($scope.MultipleAssessmentsPlanArray);*/
                if ($scope.DiagnosisTemplatesArray.length > 0) {
                    angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
                        mitem.IsEdit = false;
                        mitem.IsActiveTemplate = false;
                        //item.IsDescriptionEdit = false;
                        mitem.ChiefComplaintsArray = mitem.ChiefComplaintsArray || [];
                        mitem.InvestigationsArray = mitem.InvestigationsArray || [];
                        mitem.ProceduresArray = mitem.ProceduresArray || [];
                        mitem.SurgeryArray = mitem.SurgeryArray || [];
                        mitem.ReferralArray = mitem.ReferralArray || [];
                    });
                    $scope.DiagnosisTemplatesArray[0].IsEdit = true;
                    $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
                }

                if ($scope.AnteriorTemplatesArray.length > 0) {
                    angular.forEach($scope.AnteriorTemplatesArray, function (mitem) {
                        mitem.IsEdit = false;
                        //item.IsDescriptionEdit = false;
                    });
                    $scope.AnteriorTemplatesArray[0].IsEdit = true;
                }
                $scope.CopyDiagnosisTemplate = angular.copy($scope.DiagnosisTemplatesArray) || [];;
            } else {
                $scope.DiagnosisTemplatesArray = [];

                $scope.ActionsTakenlist = [];
                $scope.DoctorNoteslist = [];
                $scope.PatientInstructionslist = [];
                $scope.AssessmentsNoteslist = [];
                $scope.PlanofDiscussionTemplateslist = [];
                // $scope.MultipleAssessmentsPlanArray = []
                $scope.AnteriorTemplatesArray = [];
                $scope.CopyDiagnosisTemplate = [];
            }

        }, function (err) {

        });
    }
    $scope.GetUserConsultationTemplateDetails();

    //Stop Medication Start //

    $scope.StopMedication = function (item) {

        var dosesupplytest = "";
        if (item.DaysSupply !== '') {
            dosesupplytest = " for " + item.DaysSupplyDescription;
        }

        item.Sig = item.Action + " " + item.Dose + " " + item.DoseUnit + " " + item.Route + " " + item.Frequency + " " + item.DoseOther + "" + dosesupplytest;

        if (item.Sig == '') {
            alertify.error("Please Select Sig ");
            return false;
        }
        $scope.mInstanceShow = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/StopMedication.html",
            "backdrop": "static",
            "scope": $scope,
            "size": "md",
            "keyboard": false,
            "resolve": {
                "cache": function () { return angular.copy($scope.cacheStorageItem); },
                "PrescriptionDetails": function () { return angular.copy(item); }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, cache, PrescriptionDetails) {

                $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
                $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                var hospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

                function getnewRcopiaPatientObj() {
                    var obj = {
                        "FirstName": "",
                        "LastName": "",
                        "ExternalID": "",
                        "DeleteInd": "n",
                        "MiddleName": "",
                        "RcopiaPatientId": $scope.selectedPatientData.Patient[0].RcopiaPatientId || 0,
                        "DOB": "",
                        "Sex": "",
                        "HomePhone": "",
                        "Address1": "",
                        "Address2": "",
                        "City": "",
                        "State": "",
                        "Zip": "",
                        "Suffix": "",
                        "Prefix": "",
                        "EmailId": "",
                        "Race": "",
                        "Ethnicity": "",
                        "MobilePhone": ""
                    };
                    return obj;
                }
                $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
                $scope.RcopiaPatientObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || "";

                $scope.cacheStorageItem = cache;
                $scope.PrescriptionArrayDetails = [];
                $scope.PrescriptionArrayDetails.push(PrescriptionDetails);

                if ($scope.PrescriptionArrayDetails.length > 0) {

                    $scope.PrescriptionArrayDetails[0].StopDate = $scope.PrescriptionArrayDetails[0].StopDate || null;

                    if ($scope.PrescriptionArrayDetails[0].StopDate == null) {
                        var TodayDate = new window.Date();
                        $scope.StopDate = $filter('date')(TodayDate, "MM/dd/yyyy");
                    } else {
                        $scope.StopDate = $filter('date')($scope.PrescriptionArrayDetails[0].StopDate, "MM/dd/yyyy");
                    }
                }

                $scope.closeStopmedicationPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.StopMedication = {
                    "StopDate": $filter('date')($scope.StopDate, "MM/dd/yyyy") || null,
                    "StopReason": "",
                    "StopReasonId": "",
                    "StopMedicationNotes": ""
                }
                $scope.getMasterFieldDosageData = function () {
                    eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {

                        $scope.doseArray = resp.data.doseArray || [];
                        $scope.doseOtherArray = resp.data.doseOtherArray || [];
                        $scope.frequencyArray = resp.data.frequencyArray || [];
                        $scope.refillsArray = resp.data.refillsArray || [];
                        $scope.durationArray = resp.data.durationArray || [];
                        $scope.actionArray = resp.data.actionArray || [];
                        $scope.routeArray = resp.data.routeArray || [];
                        $scope.doseUnitArray = resp.data.doseUnitArray || [];
                        $scope.quantityUnitArray = resp.data.quantityUnitArray || [];
                        $scope.MedicationStopReasons = resp.data.MedicationStopReasons || [];

                    }, function (err) {
                        alertify.error("Failed");
                        console.log(err);
                    });
                };

                $scope.getMasterFieldDosageData();

                function getEmptyPrescriptionObj() {

                    var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    var previousDate = new Date()
                    previousDate.setDate(previousDate.getDate() - 1)
                    var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

                    if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                        var LastUpdateDateFormate = $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate;
                    } else {
                        var LastUpdateDateFormate = PreviousDate;
                    }

                    var obj = {
                        "UserId": $scope.UserId,
                        "OrganizationId": hospitalID,
                        "PatientId": $scope.appointmentInfo.PatientID,
                        "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
                        "PatientPrescriptionId": 0,
                        "AppointmentId": $scope.appointmentInfo.AppointmentID,
                        "ProviderId": $scope.appointmentInfo.DoctorID,
                        "PrescribedDate": TodayDate,
                        "RcopiaPrescriptionId": "",
                        "LastUpdateDate": LastUpdateDateFormate,
                        "PharmacyId": 0,
                        "RcopiaPharmacyId": "",
                        "PrescriberOrderNumber": "",
                        "RxReferenceNumber": "",
                        "PrescriptionAction": "",
                        "CompletedDate": null,
                        "SignedDate": null,
                        "StopDate": null,
                        "LastModifiedBy": $scope.UserId,
                        "LastModifiedDate": TodayDate,
                        "CompleteAction": "Created",
                        "PrescriptionSentMethod": "",
                        "PrescriptionStatus": "",
                        "DeleteInd": "N",
                        "RcopiaDeleted": "n",
                        "PrescriptionDetails": []
                    };
                    return obj;
                };

                $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

                function getNewPrescriptionDetailObj() {
                    var obj = {
                        "PatientPrescriptionDetailId": 0,
                        "PatientPrescriptionId": 0,
                        "PatientId": $scope.appointmentInfo.PatientID,
                        "MedicationId": 0,
                        "RcopiaDrugId": "",
                        "RcopiaMedicationId": "",
                        "RcopiaPrescriptionId": "",
                        "MedicationName": "",
                        "DrugNDCID": "",
                        "DrugFirstDataBankMedID": "",
                        "DrugGenericId": "",
                        "DrugBrandName": "",
                        "DrugGenericName": "",
                        "DrugForm": "",
                        "DrugStrength": "",
                        "DrugSchedule": "1",
                        "DrugSupply": "",
                        "DrugCompound": "",
                        "MedicationTypeId": "",
                        "MedicationTypeName": "",
                        "Sig": "",
                        "SigId": 0,
                        "SigObj": "",
                        "ActionId": "",
                        "Action": "",
                        "DoseId": "",
                        "Dose": "",
                        "DoseUnitId": "",
                        "DoseUnit": "",
                        "RouteId": "",
                        "Route": "",
                        "FrequencyId": "",
                        "Frequency": "",
                        "DoseOtherId": "",
                        "DoseOther": "",
                        "DaysSupplyId": "",
                        "DaysSupply": "",
                        "Quantity": "",
                        "QuantityUnitId": "",
                        "QuantityUnit": "",
                        "RefillId": "",
                        "Refills": "",
                        "SubstitutionPermitted": "y",
                        "HasScheduledDrug": "n",
                        "PatientInstructions": "",
                        "DeleteInd": "N",
                        "OtherNotes": "",
                        "Remarks": "",
                        "StartDate": $scope.CurrentDateMMFormat,
                        "FillDate": $scope.CurrentDateMMFormat,
                        "RcopiaMedicationStatus": "",
                        "IsEditMode": true,
                        "IsAllSig": false,
                        "Type": "",
                        "MedicineObj": "",
                        "StopDate": "",
                        "StopReason": "",
                        "StopReasonId": "",
                        "IsMedicationStopped": false,
                    }
                    return obj;
                };


                $scope.changeStopMedication = function (item) {

                    if (item != null) {
                        var ListArray = $filter("filter")($scope.MedicationStopReasons, { "StopReasonId": item }, true);

                        if (ListArray.length > 0) {

                            $scope.StopMedication.StopMedicationNotes = ListArray[0].StopReason;
                        }
                    }
                    else {
                        $scope.StopMedication.StopMedicationNotes = "";
                    }
                }


                $scope.StopmedicatioSave = function () {


                    if ($scope.StopMedication.StopDate == '') {
                        alertify.error("Please Select Stop Date");
                        return false;
                    }
                    if ($scope.StopMedication.StopReasonId == '' || $scope.StopMedication.StopReasonId == null) {
                        alertify.error("Please Select Stop Reaon");
                        return false;
                    }


                    var dateComponents = $scope.StopMedication.StopDate.split('-');
                    var convertedDate = dateComponents.join('/');
                    $scope.convertedDate = convertedDate;


                    //var startdate = $filter('date')(item.StartDate, "MM/dd/yyyy");
                    //   var dateWithoutTime = startdate.split(' ')[0];
                    //   $scope.StartDate = dateWithoutTime;


                    var CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");
                    if ($scope.convertedDate == CurrentDate) {
                        $scope.IsMedicationStopped = true;
                    }

                    if ($scope.convertedDate > CurrentDate) {
                        $scope.IsMedicationStopped = false;
                    }

                    if ($scope.PrescriptionArrayDetails.length > 0) {
                        angular.forEach($scope.PrescriptionArrayDetails, function (item) {

                            var StopDate = $filter('date')($scope.StopMedication.StopDate, "MM/dd/yyyy HH:mm:ss");
                            var StartDate = $filter('date')(item.StartDate, "MM/dd/yyyy HH:mm:ss");

                            var newmedicationobj = getNewPrescriptionDetailObj();
                            newmedicationobj.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
                            newmedicationobj.PatientPrescriptionId = item.PatientPrescriptionId;
                            newmedicationobj.MedicationId = item.MedicationId;
                            newmedicationobj.RcopiaDrugId = item.RcopiaDrugId || '';
                            newmedicationobj.RcopiaMedicationId = item.RcopiaMedicationId || "";
                            newmedicationobj.MedicationName = item.MedicationName || 0;
                            newmedicationobj.DrugNDCID = item.DrugNDCID || "";
                            newmedicationobj.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
                            newmedicationobj.DrugGenericId = item.GenericId || "";
                            newmedicationobj.DrugBrandName = item.MedicineName || "";
                            newmedicationobj.DrugGenericName = item.DrugGenericName || "";
                            newmedicationobj.DrugForm = item.DrugForm || "";
                            newmedicationobj.DrugStrength = item.DrugStrength || "";
                            newmedicationobj.DrugSchedule = item.ScheduleType || null;
                            newmedicationobj.DrugSupply = item.DrugSupply || "";
                            newmedicationobj.DrugCompound = item.DrugSupply || "";
                            newmedicationobj.MedicationTypeId = "";
                            newmedicationobj.MedicationTypeName = "";
                            newmedicationobj.Sig = item.Sig || "";
                            newmedicationobj.SigId = item.SigId || "";
                            newmedicationobj.ActionId = item.ActionId || "";
                            newmedicationobj.Action = item.Action || "";
                            newmedicationobj.DoseId = item.DoseId || "";
                            newmedicationobj.Dose = item.Dose || "";
                            newmedicationobj.DoseUnitId = item.DoseUnitId || "";
                            newmedicationobj.DoseUnit = item.DoseUnit || "";
                            newmedicationobj.RouteId = item.RouteId || "";
                            newmedicationobj.Route = item.Route || "";
                            newmedicationobj.FrequencyId = item.FrequencyId || "";
                            newmedicationobj.Frequency = item.Frequency || "";
                            newmedicationobj.DoseOtherId = item.DoseOtherId || "";
                            newmedicationobj.DoseOther = item.DoseOther || "";
                            newmedicationobj.DaysSupplyId = item.DaysSupplyId || "";
                            newmedicationobj.DaysSupply = item.DaysSupply || "";
                            newmedicationobj.Quantity = item.Quantity || null;
                            newmedicationobj.QuantityUnitId = item.QuantityUnitId || "";
                            newmedicationobj.QuantityUnit = item.QuantityUnit || "";
                            newmedicationobj.RefillId = item.RefillId || "";
                            newmedicationobj.Refills = item.Refills || "";
                            newmedicationobj.SubstitutionPermitted = item.SubstitutionPermitted || "";
                            newmedicationobj.PatientInstructions = item.PatientInstructions || "";
                            newmedicationobj.DeleteInd = "N";
                            newmedicationobj.OtherNotes = "";
                            newmedicationobj.Remarks = "";
                            newmedicationobj.StartDate = StartDate;
                            newmedicationobj.FillDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
                            newmedicationobj.StopReason = "";
                            newmedicationobj.RcopiaMedicationStatus = '';
                            newmedicationobj.IsEditMode = true;
                            newmedicationobj.IsEditMode = true;
                            newmedicationobj.SigfieldsShows = true;
                            newmedicationobj.Type = item.Type;
                            newmedicationobj.StopDate = StopDate;
                            newmedicationobj.StopReason = $scope.StopMedication.StopMedicationNotes;
                            newmedicationobj.StopReasonId = $scope.StopMedication.StopReasonId;
                            newmedicationobj.IsMedicationStopped = $scope.IsMedicationStopped;  //true

                            $scope.PrescriptionMainAddObj.PrescriptionDetails.push(newmedicationobj);

                        })
                    }


                    eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObj, OnAddSigSuccess, OnAddSigError);
                    function OnAddSigSuccess(response) {
                        alertify.success("Medication Stopped  Successfully");
                        console.log(response);
                        $uibModalInstance.close(response);

                    }
                    function OnAddSigError() {
                        alertify.error("Creating  Failed");
                    }
                };
            }
        });

        $scope.mInstanceShow.result.then(function (resp) {
            $scope.EmptyArray = [];
            $scope.EmptyArray = angular.copy(resp.PrescriptionDetails) || [];
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (iitem) {
                    angular.forEach($scope.EmptyArray, function (Nitem) {
                        if (iitem.MedicationId == Nitem.MedicationId) {
                            iitem.IsMedicationStopped = Nitem.IsMedicationStopped;
                            iitem.PatientPrescriptionDetailId = Nitem.PatientPrescriptionDetailId;
                            iitem.PatientPrescriptionId = Nitem.PatientPrescriptionId;
                            iitem.AppointmentId = Nitem.AppointmentId;
                            iitem.StopDate = $filter('date')(Nitem.StopDate, "MM-dd-yyyy");
                            iitem.StopReason = Nitem.StopReason;
                            iitem.StopReasonId = Nitem.StopReasonId;

                        }
                    })
                })
            }
            $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.PrescriptionMainAddObj.PrescriptionDetails || [];
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {

                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    item.SigfieldsShows = true;

                });
            }
            $scope.GetPatientPrescriptionDetails();
        }, function (cancel) {
        });
    }
    //Stop Medication End//

    $scope.init = function () {
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var params = {
            "PatientId": $scope.cacheStorageItem.patientid,
            "CurrentDate": currentdate,
            "ParentOrganizationId": $scope.ParentHospitalId
        }     
        $q.all([
            eHnotePatientDataService.GetLatestErxAppointmentMedications(params),
            
        ]).then(function (resp) {
            if (resp[0].data.PatientPrescriptionDetails.length > 0) {
                let itm = resp[0].data.PatientPrescriptionDetails[0];  
      
                    $scope.cacheStorageItem.appointmentid = itm.AppointmentId || 0;
                    $scope.cacheStorageItem.ConsultationID = itm.ConsultationId || 0;
                    $scope.cacheStorageItem.VisitId = itm.ConsultationID || 0;

                    $scope.AddToCache();
                $scope.LatestErxAppointmentMedications = resp[0].data.PatientPrescriptionDetails || [];
            } else {
                $scope.LatestErxAppointmentMedications = [];
            }
            runCreateRXFlow();
        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });

    };
    $scope.init();
    $scope.MedicalRxTemplateObj = {
        "UserId": "",
        "OrganizationId": "",
        "TemplateId": "",
        "TemplateName": "",
        "DeleteInd": "",
        "MedicalRXTemplateArray": "",
        "SelectedTemplateInd": false
    }
    $scope.PrescriptionType = {
        "Tab": 'Prescriptions'
    }

    $scope.SwichPrescriptionTab = function (item) {
        $scope.PrescriptionType.Tab = item;
    }

    $scope.medicineGetObj = {
        "MedicineObject": ""
    }

    $scope.SigSearch = {
        "Shows": false
    }
    $scope.ShowSigSearch = function () {
        $scope.SigSearch.Shows = !$scope.SigSearch.Shows;
    }

    function getPrescriptionFrequentData() {
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1
        };
        eHnoteDiagnosisDataServices.GetPrescriptionTemplates(params).then(function (response) {
            $scope.PrescriptionTemplates = response.data.rows;
            $scope.PrescriptionTemplatesCount = response.data.count;
            $scope.masterMedicineTemplatesArray = angular.copy(response.data.rows);
        });
    };
    getPrescriptionFrequentData();

    $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

    // 19-12-23 


    $scope.CurrentEyeSystemPrescriptionDetails = [];


    $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = $scope.cacheStorageItem.CurrentSystemicMedicationsHistory || [];
    if ($scope.cacheStorageItem.CurrentSystemicMedicationsHistory.length > 0) {
        angular.forEach($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, function (item) {

            item.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
            item.PatientPrescriptionId = item.PatientPrescriptionId;
            item.MedicationId = item.MedicineId;
            item.RcopiaDrugId = item.RcopiaDrugId || 0;
            item.RcopiaMedicationId = item.RcopiaMedicationId || "";
            item.MedicationName = item.MedicineName || 0;
            item.DrugNDCID = item.DrugNDCID || "";
            item.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
            item.DrugGenericId = item.DrugGenericId || "";
            item.DrugBrandName = item.DrugBrandName || "";
            item.DrugGenericName = item.DrugGenericName || "";
            item.DrugForm = item.DrugForm || "";
            item.DrugStrength = item.DrugStrength || "";
            item.DrugSchedule = item.DrugSchedule || "";
            item.DrugSupply = item.DrugSupply || "";
            item.DrugCompound = item.DrugSupply || "";
            item.MedicationTypeId = item.MedicationTypeId || "";
            item.MedicationTypeName = item.MedicationTypeName || "";
            item.Sig = item.Sig || "";
            item.SigId = item.SigId || "";
            item.ActionId = item.ActionId || "";
            item.Action = item.Action || "";
            item.DoseId = item.DoseId || "";
            item.Dose = item.Dose || "";
            item.DoseUnitId = item.DoseUnitId || "";
            item.DoseUnit = item.DoseUnit || "";
            item.RouteId = item.RouteId || "";
            item.Route = item.Route || "";
            item.FrequencyId = item.FrequencyId || "";
            item.Frequency = item.Frequency || "";
            item.DoseOtherId = item.DoseOtherId || "";
            item.DoseOther = item.DoseOther || "";
            item.DaysSupplyId = item.DaysSupplyId || "";
            item.DaysSupply = item.DaysSupply || "";
            item.Quantity = item.Quantity || null;
            item.QuantityUnitId = item.QuantityUnitId || "";
            item.QuantityUnit = item.QuantityUnit || "";
            item.RefillId = item.RefillId || "";
            item.Refills = item.Refills || "";
            item.SubstitutionPermitted = item.SubstitutionPermitted || "";
            item.PatientInstructions = item.PatientInstructions || "";
            item.DeleteInd = "N";
            item.OtherNotes = "";
            item.Remarks = "";
            item.IsEditMode = true;
            item.SigfieldsShows = true;
            item.SelectedMedicationHistory = "CurrentSystemicMedication";
            //item.StartDate = null;
            //item.iscopied = false;                         
            item.StartDate = $filter('date')(item.StartDate, "MM/dd/yyyy");
            item.MedicineObj = item.Sig;
            item.StopDate = $filter('date')(item.StopDate, "MM/dd/yyyy");

        })
    }

    $scope.GotoMedorders = function (item) {
        item.StartDate = '';
        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {

            var filteredArray = $filter("filter")($scope.PrescriptionMainAddObj.PrescriptionDetails, function (assitem, index) { return assitem.MedicationId === item.MedicineId }, true) || [];
            if (filteredArray.length > 0) {
                alertify.error("Already Added");
                return false;
            }

        }

        $scope.PrescriptionMainAddObj.PrescriptionDetails.push(item) || [];

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (Pitem) {

                Pitem.Type = 'MedicineOrders';
                Pitem.DeleteInd = "N";

                if (Pitem.MedicationId === item.MedicationId) {
                    Pitem.iscopied = true;
                }

            });

            alertify.success("Moved To Medicine Orders");
        }

    }



    function runCreateRXFlow() {
        if ($scope.ScreenType == "CreateRX") {
            function getEmptyPrescriptionObj() {

                var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

                var previousDate = new Date()
                previousDate.setDate(previousDate.getDate() - 1)
                var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

                $scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    var LastUpdateDateFormate = $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate;
                } else {
                    var LastUpdateDateFormate = PreviousDate;
                }

                var obj = {
                    "VisitId": 0,
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "PatientId": $scope.appointmentInfo.PatientID,
                    "RcopiaPatientId": 0,
                    "PatientPrescriptionId": 0,
                    "AppointmentId": 0,
                    "LastUpdateDate": LastUpdateDateFormate,
                    "DeleteInd": "N",
                    "PrescriptionDetails": [],
                };
                return obj;
            };

            $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

            $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.ActivePrescriptionsArray || [];



            $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.PrescriptionMainAddObj.PrescriptionDetails || [];
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {

                    item.PatientPrescriptionDetailId = 0;
                    item.MedicationId = item.MedicationId;
                    item.RcopiaDrugId = item.RcopiaDrugId || 0;
                    item.RcopiaMedicationId = item.RcopiaMedicationId || "";
                    item.MedicationName = item.MedicationName || 0;
                    item.DrugNDCID = item.DrugNDCID || "";
                    item.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
                    item.DrugGenericId = item.DrugGenericId || "";
                    item.DrugBrandName = item.DrugBrandName || "";
                    item.DrugGenericName = item.DrugGenericName || "";
                    item.DrugForm = item.DrugForm || "";
                    item.DrugStrength = item.DrugStrength || "";
                    item.DrugSchedule = item.DrugSchedule || "";
                    item.DrugSupply = item.DrugSupply || "";
                    item.DrugCompound = item.DrugSupply || "";
                    item.MedicationTypeId = item.MedicationTypeId || "";
                    item.MedicationTypeName = item.MedicationTypeName || "";
                    item.Sig = item.Sig || "";
                    item.SigId = item.SigId || "";
                    item.ActionId = item.ActionId || "";
                    item.Action = item.Action || "";
                    item.DoseId = item.DoseId || "";
                    item.Dose = item.Dose || "";
                    item.DoseUnitId = item.DoseUnitId || "";
                    item.DoseUnit = item.DoseUnit || "";
                    item.RouteId = item.RouteId || "";
                    item.Route = item.Route || "";
                    item.FrequencyId = item.FrequencyId || "";
                    item.Frequency = item.Frequency || "";
                    item.DoseOtherId = item.DoseOtherId || "";
                    item.DoseOther = item.DoseOther || "";
                    item.DaysSupplyId = item.DaysSupplyId || "";
                    item.DaysSupply = item.DaysSupply || "";
                    item.Quantity = item.Quantity || null;
                    item.QuantityUnitId = item.QuantityUnitId || "";
                    item.QuantityUnit = item.QuantityUnit || "";
                    item.RefillId = item.RefillId || "";
                    item.Refills = item.Refills || "";
                    item.SubstitutionPermitted = item.SubstitutionPermitted || "";
                    item.PatientInstructions = "";  //item.PatientInstructions 
                    item.DeleteInd = "N";
                    item.OtherNotes = "";
                    item.Remarks = "";
                    item.IsEditMode = true;
                    item.SigfieldsShows = true;
                    item.StartDate = $filter('date')(item.StartDate, "MM/dd/yyyy");
                    item.StopDate = $filter('date')(item.StopDate, "MM/dd/yyyy");
                    item.Type = 'MedicineOrders';
                    item.SigObj = item.Sig || "";

                })
            }
            // Current --LatestErxAppointmentMedications 
            $scope.LatestErxAppointmentMedications = $scope.LatestErxAppointmentMedications || [];

            if ($scope.LatestErxAppointmentMedications.length > 0) {

                $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.LatestErxAppointmentMedications[0].PrescriptionDetails || [];
                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                        item.RcopiaPrescriptionId = item.RcopiaPrescriptionId || "";
                        item.IsEditMode = true;
                        item.Type = 'MedicineOrders';
                        item.PatientInstructions = "";
                        item.SigObj = item.Sig || "";
                        if (item.RefillId == null) {
                            item.RefillId = 64;
                            item.RefillsId = "0";
                        }
                        item.StartDate = item.StartDate || null;

                        if (item.StartDate != null) {
                            item.StartDate = $filter('date')(item.StartDate, "MM-dd-yyyy");
                            //item.StopDate = $filter('date')(item.StopDate, "MM-dd-yyyy");
                        }

                        item.StopDate = item.StopDate || null;

                        if (item.StopDate != null) {
                            item.StopDate = $filter('date')(item.StopDate, "MM-dd-yyyy");
                        }

                    })
                }
            }

        } else {
            if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {




                $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails || [];

                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                        item.RcopiaPrescriptionId = item.RcopiaPrescriptionId || "";
                        item.IsEditMode = true;
                        item.SigObj = item.Sig || "";
                        if (item.RefillId == null) {
                            item.RefillId = 64;
                            item.RefillsId = "0";
                        }
                        item.StartDate = item.StartDate || null;

                        if (item.StartDate != null) {
                            item.StartDate = $filter('date')(item.StartDate, "MM-dd-yyyy");
                            //item.StopDate = $filter('date')(item.StopDate, "MM-dd-yyyy");
                        }

                        item.StopDate = item.StopDate || null;

                        if (item.StopDate != null) {
                            item.StopDate = $filter('date')(item.StopDate, "MM-dd-yyyy");
                        }

                    })
                }
                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                        $scope.CurrentEyeSystemPrescriptionDetails = $filter("filter")($scope.CurrentEyeSystemPrescriptionDetails, function (assitem, index) { return assitem.MedicationId !== item.MedicationId }, true);
                    });
                }

            }
        }
    }

    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
            item.SigfieldsShows = false;
        })
    }

    // Sig Related Data
    $scope.doseArray = [];
    $scope.doseOtherArray = [];
    $scope.frequencyArray = [];
    $scope.refillsArray = [];
    $scope.durationArray = [];
    $scope.actionArray = [];
    $scope.routeArray = [];
    $scope.doseUnitArray = [];
    $scope.quantityUnitArray = [];

    $scope.getMasterFieldDosageData = function () {
        eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {

            $scope.doseArray = resp.data.doseArray || [];
            $scope.doseOtherArray = resp.data.doseOtherArray || [];
            $scope.frequencyArray = resp.data.frequencyArray || [];
            $scope.refillsArray = resp.data.refillsArray || [];
            $scope.durationArray = resp.data.durationArray || [];
            $scope.actionArray = resp.data.actionArray || [];
            $scope.routeArray = resp.data.routeArray || [];
            $scope.doseUnitArray = resp.data.doseUnitArray || [];
            $scope.quantityUnitArray = resp.data.quantityUnitArray || [];
            $scope.MedicationStopReasons = resp.data.MedicationStopReasons || [];


        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };

    $scope.getMasterFieldDosageData();
    $scope.changePrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };



    $scope.changePrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {
            mainobj.DaysSupply = filteredArray[0].Code;
            var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + (parseInt(mainobj.DaysSupply) * 24 * 60 * 60 * 1000));
            mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
        }
        var Datecode = filteredArray[0].Code
        var currentDate = new Date();
        var futureDate = new Date(currentDate.getTime() + (parseInt(Datecode) * 24 * 60 * 60 * 1000));
        /*  mainobj.DaysSupply = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
        mainobj.DaysSupply = parseInt(Datecode);
    };



    $scope.addSIgNameDynamicallyAdded = function () {

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {

                initem.Action = initem.Action || "";
                initem.Dose = initem.Dose || "";
                initem.DoseUnit = initem.DoseUnit || "";
                initem.Route = initem.Route || "";
                initem.Frequency = initem.Frequency || "";
                initem.DoseOther = initem.DoseOther || "";
                //var dosesupplytest = "";
                //if (initem.DaysSupply !== '') {
                //    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true) || [];
                //    if (filteredArray.length > 0) {
                //        initem.DaysSupply = filteredArray[0].Code;
                //        initem.DaysSupplyDescription = filteredArray[0].Description;
                //    };

                //    dosesupplytest = " for " + initem.DaysSupplyDescription;
                //}
                initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther;
                initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther;

            });
        }
    }


    $scope.changePrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };

    $scope.changePrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };



    $scope.Clearmedicalrx = function () {
        var responsedata = {
            "status": "",
            "Type": "Close",
            "response": "",
            "cache": $scope.cacheStorageItem
        };

        $uibModalInstance.close(responsedata);
    }


    $scope.ClearMedicineItem = function (mainitem) {
        mainitem.ActionId = "";
        mainitem.Action = "";
        mainitem.Dose = "";
        mainitem.DoseUnit = "";
        mainitem.Route = "";
        mainitem.Frequency = "";
        mainitem.DoseOther = "";
        mainitem.DaysSupply = "";
        mainitem.QuantityUnit = "";
        mainitem.DoseId = "";
        mainitem.DoseUnitId = "";
        mainitem.RouteId = "";
        mainitem.FrequencyId = "";
        mainitem.DoseOtherId = "";
        mainitem.DaysSupplyId = "";
        mainitem.Quantity = "";
        mainitem.QuantityUnitId = "";
        mainitem.RefillId = "";
        mainitem.Refills = "";
        mainitem.PatientInstructions = "";
        mainitem.SigObj = "";
        mainitem.MedicineObj = ""
    }


    $scope.ClearStopDate = function (item, type) {
        if (type == 'Medication') {
            item.StopDate = null;
        }
        if (type == 'CurrentEye') {
            item.StopDate = null;
        }
        if (type == 'CurrentSystemic') {
            item.StopDate = null;
        }
    }
    $scope.ChangeMedicalRxTemplate = function (item, Value) {
        // $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
        if (Value) {
            if ($scope.MedicalRxTemplateArrayDetails != '') {
                // $scope.PrescriptionMainAddObj = angular.copy(item.MedicalRXTemplateArray) || [];
                angular.forEach(item.MedicalRXTemplateArray.PrescriptionDetails, function (mitem) {
                    var List = $filter("filter")($scope.PrescriptionMainAddObj.PrescriptionDetails, function (Aitem, index) { return Aitem.MedicationId == mitem.MedicationId && Aitem.DeleteInd == "N" }) || [];
                    if (List.length == 0) {
                        if (mitem.PatientInstructions) {
                            mitem.addMedicalInstructions = true;
                        }
                        mitem.PatientId = $scope.appointmentInfo.PatientID || 0;
                        mitem.PatientPrescriptionDetailId =  0;
                        mitem.PatientPrescriptionId = 0;
                        mitem.DeleteInd = 'N';
                        mitem.StartDate = $scope.CurrentDateMMFormat;
                        mitem.FillDate = $scope.CurrentDateMMFormat;
                        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mitem.DaysSupplyId }, true);
                        if (filteredArray.length > 0) {
                            mitem.DaysSupply = filteredArray[0].Code;
                            var currentDate = new Date();
                            var futureDate = new Date(currentDate.getTime() + (parseInt(mitem.DaysSupply) * 24 * 60 * 60 * 1000));
                            mitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
                        }
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.push(mitem);
                    }
                    mitem.MedicineObj = "";
                    mitem.IsAllSig = false;
                    mitem.SigObj = mitem.Sig;
                });
                // $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(item.MedicalRXTemplateArray.PrescriptionDetails) || [];
            }
        }
        else {
            $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
        }
    }


    $scope.AddUpdateMedicalRxTemplate = function () {

        if ($scope.MedicalRxTemplateObj.TemplateName == '') {
            alertify.error('Please enter Template Name');
            return false;
        }
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length == 0) {
                alertify.error('Please enter Atleast One Prescription');
                return false;
            }
        }
        $scope.Templatesearch.IsTemplatePopover = false;
        $scope.Templatesearch.IsCreatenewTemplatesave = false;
        var Reqobj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "TemplateId": 0,
            "TemplateName": $scope.MedicalRxTemplateObj.TemplateName || "",
            "MedicalRXTemplateArray": $scope.PrescriptionMainAddObj || [],
            "DeleteInd": "N",
            "IsTemplateFavorites": false
        }
        eHnotePatientDataService.AddUpdatePatientMedicalRxTemplate(Reqobj).then(function (resp) {
            if (resp.data.Status == "Success") {
                alertify.success("Template Added  Successfully");
                $scope.MedicalRxTemplateObj.TemplateName = '';
                $scope.Templatesearch.IsTemplatePopover = false;
                $scope.Templatesearch.IsCreatenewTemplatesave = false;
            } else {
                alertify.error(resp.data.Message);
            }
            //function OnAddSigSuccess(response) {
            //    alertify.success("Template Added  Successfully");
            //    $scope.MedicalRxTemplateObj.TemplateName = '';
            //}
            //function OnAddSigError() {
            //    alertify.error("Creating  Failed");
            //}
        });
      
    }
    $scope.MedicalRxTemplatesShow = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/templatesMedicalRxView.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            //"size": "md",
            "windowClass": "offcanves-right modal__width--70",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.GetMedicalRxTemplateDetails();
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }
    $scope.GetMedicalRxTemplateDetails = function () {
        var obj = {
            "UserId": $scope.UserId,
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        }
        eHnotePatientDataService.GetPatientMedicalRxTemplateDetails(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.MedicalRxTemplateArrayDetails = [];
                $scope.MedicalRxTemplateArrayDetails = resp.data.rows || [];
            }
        }, function (err) {
        });
    }

    $scope.MedicalRxInActiveList = function () {
        var obj = {
            "PatientId": $scope.appointmentInfo.PatientID,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "Type": 1 //'MedicineOrders'
        }


        eHnotePatientDataService.GetPatientPrescriptionInactiveDetails(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.InactivePrescriptionDetails = resp.data.rows || [];
                $scope.mInstanceShow = $uibModal.open({
                    "templateUrl": "templates/UsNewConsultation/uibpopup/InActiveMedication.html",
                    "backdrop": "static",
                    "scope": $scope,
                    //"size": "lg",
                    "windowClass": "modal__sixty--",
                    "keyboard": false,
                    "controller": function ($scope, $uibModal, $uibModalInstance) {
                        $scope.closeInactivemedicationPopup = function () {
                            $uibModalInstance.dismiss("cancel");
                        }
                    }
                });
            }
        }, function (err) {
        });
    }
    $scope.CurrentEyeInActiveList = function () {
        var obj = {
            "PatientId": $scope.appointmentInfo.PatientID,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "Type": 2  //'CurrentEyeMedications'
        }


        eHnotePatientDataService.GetPatientPrescriptionInactiveDetails(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.InactivePrescriptionDetails = resp.data.rows || [];
                $scope.mInstanceShow = $uibModal.open({
                    "templateUrl": "templates/UsNewConsultation/uibpopup/InActiveMedication.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "size": "lg",
                    "windowClass": "modal__sixty--",
                    "keyboard": false,
                    "controller": function ($scope, $uibModal, $uibModalInstance) {
                        $scope.closeInactivemedicationPopup = function () {
                            $uibModalInstance.dismiss("cancel");
                        }
                    }
                });
            }
        }, function (err) {
        });
    }
    $scope.CurrentSystemicInActiveList = function () {
        var obj = {
            "PatientId": $scope.appointmentInfo.PatientID,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "Type": 3  //'CurrentSystemicMedications'
        }


        eHnotePatientDataService.GetPatientPrescriptionInactiveDetails(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.InactivePrescriptionDetails = resp.data.rows || [];
                $scope.mInstanceShow = $uibModal.open({
                    "templateUrl": "templates/UsNewConsultation/uibpopup/InActiveMedication.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "size": "lg",
                    "windowClass": "modal__sixty--",
                    "keyboard": false,
                    "controller": function ($scope, $uibModal, $uibModalInstance) {
                        $scope.closeInactivemedicationPopup = function () {
                            $uibModalInstance.dismiss("cancel");
                        }
                    }
                });
            }
        }, function (err) {
        });
    }

    $scope.$watch("PrescriptionMainAddObj.PrescriptionDetails", function (newVal, oldVal) {
        let array = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { "DeleteInd": "N" }, true);
        console.log(array);
    }, true);


    function getNewPrescriptionDetailObj() {
        var obj = {
            "PatientPrescriptionDetailId": 0,
            "PatientPrescriptionId": 0,
            "PatientId": $scope.appointmentInfo.PatientID,
            "MedicationId": 0,
            "RcopiaDrugId": "",
            "RcopiaMedicationId": "",
            "RcopiaPrescriptionId": "",
            "MedicationName": "",
            "DrugNDCID": "",
            "DrugFirstDataBankMedID": "",
            "DrugGenericId": "",
            "DrugBrandName": "",
            "DrugGenericName": "",
            "DrugForm": "",
            "DrugStrength": "",
            "DrugSchedule": "1",
            "DrugSupply": "",
            "DrugCompound": "",
            "MedicationTypeId": "",
            "MedicationTypeName": "",
            "Sig": "",
            "SigId": 0,
            "SigObj": "",
            "ActionId": "",
            "Action": "",
            "DoseId": "",
            "Dose": "",
            "DoseUnitId": "",
            "DoseUnit": "",
            "RouteId": "",
            "Route": "",
            "FrequencyId": "",
            "Frequency": "",
            "DoseOtherId": "",
            "DoseOther": "",
            "DaysSupplyId": "",
            "DaysSupply": "",
            "Quantity": null,
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "SubstitutionPermitted": "y",
            "HasScheduledDrug": "n",
            "PatientInstructions": "",
            "DeleteInd": "N",
            "OtherNotes": "",
            "Remarks": "",
            "StartDate": $scope.CurrentDateMMFormat,
            "FillDate": $scope.CurrentDateMMFormat,
            "RcopiaMedicationStatus": "",
            "IsEditMode": true,
            "IsAllSig": false,
            "Type": "",
            "MedicineObj": "",
            "StopDate": "",
            "StopReason": "",
            "StopReasonId": "",
            "IsMedicationStopped": false,
        }
        return obj;
    };
    var newmedicationobj = getNewPrescriptionDetailObj();
    $scope.pushPrescriptionMedicationDetails1 = function (obj, type, type1) {

        $scope.SigSearch.Shows = false;
        obj.SigfieldsShows = false;
        var newmedicationobj = getNewPrescriptionDetailObj();


        if (type === 'Rcopia') {
            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId;
            newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID;
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID;
            newmedicationobj.DrugGenericId = obj.GenericID;
            newmedicationobj.DrugBrandName = obj.BrandName;
            newmedicationobj.DrugGenericName = obj.GenericName;
            newmedicationobj.DrugForm = obj.Form;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.MedicationName = obj.BrandName + " " + obj.Strength;
            newmedicationobj.DrugSchedule = obj.Schedule;
            newmedicationobj.DrugSupply = obj.RouteCode;
            newmedicationobj.DrugCompound = "";
            newmedicationobj.Type = type1;
            newmedicationobj.IsMedicationStopped = false;
            newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
            newmedicationobj.FastSig = false;


            var mparams = {
                "UserId": $scope.UserId,
                "MedicineId": 0,
                "RcopiaDrugId": obj.RcopiaDrugId,
                "DrugNDCID": obj.RcopiaDrugNDCID,
                "FirstDataBankMedID": obj.FirstDataBankMedID,
                "DrugGenericID": obj.GenericID,
                "DrugName": obj.BrandName,
                "GenericName": obj.GenericName,
                "MedicineType": obj.Form,
                "Strength": obj.Strength,
                "Schedule": obj.Schedule,
                "RouteCode": obj.RouteCode,
                "RxNormList": []
            }

            if (obj.RxNormList.length > 0) {
                var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a' }, true) || [];
                if (filteredRxNorm.length > 0) {
                    newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                    var rxNormObj = {
                        "MedicineRxNormsId": 0,
                        "RxnormID": filteredRxNorm[0].RxnormID,
                        "RxnormIDType": filteredRxNorm[0].RxnormIDType,
                        "Status": "a",
                        "Representative": "y"
                    }

                    mparams.RxNormList.push(rxNormObj)
                }
            }

            console.log(mparams);


            eHnoteDiagnosisDataServices.UpdateFirstBankMasterDrugDetails(mparams).then(function (response) {


                if (response.data.status === 'Success') {
                    newmedicationobj.MedicationId = response.data.MedicineId;

                    if (response.data.RxNormList.length > 0) {
                        var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                        if (filteredRxNorm.length > 0) {
                            newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                        }
                    }

                    var medi = 0;
                    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                medi++;
                            }
                        });
                    }


                    if (medi > 0) {
                        alertify.error('You have already entered this Drug');
                        $scope.medicineGetObj.MedicineObject = "";
                    } else {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                        $scope.medicineGetObj.MedicineObject = "";
                    }

                }
            });


        }
        else {
            newmedicationobj.MedicationId = obj.MedicineId;
            newmedicationobj.DrugBrandName = obj.MedicineName;
            newmedicationobj.MedicationName = obj.MedicineName;
            newmedicationobj.DrugSchedule = obj.ScheduleType;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.DrugGenericName = obj.GenericName;

            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
            newmedicationobj.DrugNDCID = obj.DrugNDCID || "";
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
            newmedicationobj.DrugGenericId = obj.GenericID || "";
            newmedicationobj.Type = type1;
            newmedicationobj.IsMedicationStopped = false;
            newmedicationobj.RxNormList = obj.RxNormList || [];
            newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
            newmedicationobj.PackSize = obj.PackSize||null;
            newmedicationobj.PackDescription = obj.PackDescription || null;
            newmedicationobj.FastSig = false;

            if (obj.RxNormList.length > 0) {
                var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
            }
            var medi = 0;
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    if (item.MedicationId == newmedicationobj.MedicationId) {
                        medi++;
                    }
                });
            }


            if (medi > 0) {
                alertify.error('You have already entered this Drug');
                $scope.medicineGetObj.MedicineObject = "";
            } else {
                $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                $scope.medicineGetObj.MedicineObject = "";
            }
        }

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            $scope.PrescriptionMainAddObj.IsNKMSelected = false;
        }
    };


    $scope.RemovePrescriptionDetailObj = function (index, item) {
        item.DeleteInd = 'Y';

        item.RcopiaMedicationId = item.RcopiaMedicationId || "";


        console.log(item.RcopiaMedicationId + "__RcopiaMedicationId");



        $scope.PrescriptionMainAddObjFOrDelete = getEmptyPrescriptionObj();
        $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId = item.PatientPrescriptionId;

        var newmedicationobj = getNewPrescriptionDetailObj();
        newmedicationobj.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
        newmedicationobj.PatientPrescriptionId = item.PatientPrescriptionId;
        newmedicationobj.MedicationId = item.MedicationId;
        newmedicationobj.RcopiaDrugId = item.RcopiaDrugId || 0;
        newmedicationobj.RcopiaMedicationId = item.RcopiaMedicationId || "";
        newmedicationobj.MedicationName = item.MedicationName || 0;
        newmedicationobj.DrugNDCID = item.DrugNDCID || "";
        newmedicationobj.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
        newmedicationobj.DrugGenericId = item.DrugGenericId || "";
        newmedicationobj.DrugBrandName = item.DrugBrandName || "";
        newmedicationobj.DrugGenericName = item.DrugGenericName || "";
        newmedicationobj.DrugForm = item.DrugForm || "";
        newmedicationobj.DrugStrength = item.DrugStrength || "";
        newmedicationobj.DrugSchedule = item.DrugSchedule || "";
        newmedicationobj.DrugSupply = item.DrugSupply || "";
        newmedicationobj.DrugCompound = item.DrugSupply || "";
        newmedicationobj.MedicationTypeId = item.MedicationTypeId || "";
        newmedicationobj.MedicationTypeName = item.MedicationTypeName || "";
        newmedicationobj.Sig = item.Sig || "";
        newmedicationobj.SigId = item.SigId || "";
        newmedicationobj.ActionId = item.ActionId || "";
        newmedicationobj.Action = item.Action || "";
        newmedicationobj.DoseId = item.DoseId || "";
        newmedicationobj.Dose = item.Dose || "";
        newmedicationobj.DoseUnitId = item.DoseUnitId || "";
        newmedicationobj.DoseUnit = item.DoseUnit || "";
        newmedicationobj.RouteId = item.RouteId || "";
        newmedicationobj.Route = item.Route || "";
        newmedicationobj.FrequencyId = item.FrequencyId || "";
        newmedicationobj.Frequency = item.Frequency || "";
        newmedicationobj.DoseOtherId = item.DoseOtherId || "";
        newmedicationobj.DoseOther = item.DoseOther || "";
        newmedicationobj.DaysSupplyId = item.DaysSupplyId || "";
        newmedicationobj.DaysSupply = item.DaysSupply || "";
        newmedicationobj.Quantity = item.Quantity || null;
        newmedicationobj.QuantityUnitId = item.QuantityUnitId || "";
        newmedicationobj.QuantityUnit = item.QuantityUnit || "";
        newmedicationobj.RefillId = item.RefillId || "";
        newmedicationobj.Refills = item.Refills || "";
        newmedicationobj.SubstitutionPermitted = item.SubstitutionPermitted || "";
        newmedicationobj.PatientInstructions = item.PatientInstructions || "";
        newmedicationobj.DeleteInd = "Y";
        newmedicationobj.OtherNotes = "";
        newmedicationobj.Remarks = "";
        newmedicationobj.StartDate = "";
        newmedicationobj.StopDate = "";
        newmedicationobj.FillDate = "";
        newmedicationobj.StopReason = "";
        newmedicationobj.RcopiaMedicationStatus = 0;
        newmedicationobj.IsEditMode = false;
        $scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails.push(newmedicationobj);




        eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObjFOrDelete, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {
            if (response.status === "Success") {
                alertify.success("Medication Deleted  Successfully");
                $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    $scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails || [];
                    if ($scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails.length > 0) {
                        angular.forEach($scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails, function (psitem) {
                            if (psitem.MedicationId === item.MedicationId) {
                                psitem.DeleteInd = 'Y';
                            }
                        });
                    }
                }

                $scope.AddNewMedicalRxPrescriptionObj = getnewMedicalRXPrescriptionObj();

                $scope.AddNewMedicalRxPrescriptionObj.PatientPrescriptionId = $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId || 0;

                angular.forEach($scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails, function (pitem) {

                    var scheduletype = "unknown";
                    if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                        scheduletype = "unknown";
                    } else {
                        scheduletype = pitem.DrugSchedule;
                    }

                    if (pitem.DrugSchedule === "3" || pitem.DrugSchedule === "2" || pitem.DrugSchedule === "4" || pitem.DrugSchedule === "5" || pitem.DrugSchedule === "scheduled") {
                        pitem.HasScheduledDrug = "y";
                    }

                    var obj = {
                        "PatientPrescriptionDetailId": pitem.PatientPrescriptionDetailId,
                        "IsDischargePrescription": "y",

                        "Deleted": "y",
                        "RcopiaPrescriptionId": pitem.RcopiaPrescriptionId || "",
                        "MedicationId": pitem.MedicationId,
                        //"DrugRocipaId": pitem.RcopiaDrugId,
                        //"DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                        "DrugNDCID": pitem.DrugNDCID,
                        "DrugRxNormId": pitem.DrugRxNormId,
                        "DrugBrandName": pitem.DrugBrandName,
                        "GenericName": pitem.DrugGenericName,
                        "Form": pitem.DrugForm,
                        "Schedule": scheduletype,
                        "Strength": pitem.DrugStrength,
                        "Supply": "n",
                        "Compound": "n",
                        "Action": pitem.DrugAction,
                        "Dose": pitem.DrugDose,
                        "Route": pitem.DoseRoute,
                        "DoseUnit": pitem.DoseUnit,
                        "DoseTiming": pitem.DoseTiming,
                        "DoseOther": pitem.DoseOther,
                        "Duration": pitem.DoseDuration,
                        "Quantity": pitem.DoseQuantity,
                        "QuantityUnit": pitem.QuantityUnit,
                        "Refills": pitem.Refills,
                        "SubstitutionPermitted": pitem.SubstitutionPermitted,
                        "OtherNotes": pitem.OtherNotes,
                        "PatientNotes": pitem.PatientNotes,
                        "Comments": "",
                        "DeleteInd": pitem.DeleteInd,
                        "DiagnosisList": []
                    };

                    $scope.AddNewMedicalRxPrescriptionObj.PrescriptionList.push(obj);

                });


                eHnoteDiagnosisDataServices.AddPatientPrescriptionDetailsToRcopia($scope.AddNewMedicalRxPrescriptionObj).then(function (response) {
                    if (response.status === 'Success') {

                    }
                });
            }
        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };


    $scope.CurrentRemovePrescriptionDetailObj = function (index, item, type) {
        if (type == 'CurrentSystemicMedications') {
            var index = $scope.cacheStorageItem.CurrentSystemicMedicationsHistory.indexOf(item);
            item.CurrentSystemicMedicationId = item.CurrentSystemicMedicationId || null;
            if (item.CurrentSystemicMedicationId === null) {
                if (index > -1) {
                    $scope.cacheStorageItem.CurrentSystemicMedicationsHistory.splice(index, 1);
                }
            } else {
                $scope.cacheStorageItem.CurrentSystemicMedicationsHistory[index].DeleteInd = 'Y';
            }
        }

        if (type == 'CurrentEyeMedications') {
            var index = $scope.cacheStorageItem.CurrentSystemicMedicationsHistory.indexOf(item);
            item.CurrentSystemicMedicationId = item.CurrentSystemicMedicationId || null;
            if (item.CurrentSystemicMedicationId === null) {
                if (index > -1) {
                    $scope.cacheStorageItem.CurrentEyeMedications.splice(index, 1);
                }
            } else {
                $scope.cacheStorageItem.CurrentEyeMedications[index].DeleteInd = 'Y';
            }

        }
    }

    $scope.changeSigForMedicine = function (item) {
        item.Sig = "";
        item.SigId = 0;
    };
    $scope.ONSigDetails = function (item, mainitem) {
        console.log(item);
        console.log(mainitem);
        mainitem.SigfieldsShows = true;

        mainitem.ActionId = item.ActionId || null;
        mainitem.Action = item.Action || '';
        mainitem.Dose = item.Dose || '';
        mainitem.DoseUnit = item.DoseUnit || '';
        mainitem.Route = item.Route || '';
        mainitem.Frequency = item.Frequency || '';
        mainitem.DoseOther = item.DoseOther || '';
        mainitem.DaysSupply = item.DaysSupply || '';
        mainitem.QuantityUnit = item.QuantityUnit || null;
        mainitem.DoseId = item.DoseId || null;
        mainitem.DoseUnitId = item.DoseUnitId || null;
        mainitem.RouteId = item.RouteId || null;
        mainitem.FrequencyId = item.FrequencyId || null;
        mainitem.DoseOtherId = item.DoseOtherId || null;
        mainitem.DaysSupplyId = item.DaysSupplyId || null;
        mainitem.Quantity = item.Quantity || null;
        mainitem.QuantityUnitId = item.QuantityUnitId || null;
        mainitem.RefillId = item.RefillId || null;
        mainitem.Refills = item.Refills || null;
        mainitem.Sig = item.Sig;
        mainitem.SigId = item.OrganizationSigTemplateId;
        mainitem.MedicineObj = ''



        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
            }
        }
    };

    $scope.ONSigDetailsSig = function (item, mainitem) {
        console.log(item);
        console.log(mainitem);
        mainitem.SigfieldsShows = true;

        mainitem.ActionId = item.ActionId || null;
        mainitem.Action = item.Action || '';
        mainitem.Dose = item.Dose || '';
        mainitem.DoseUnit = item.DoseUnit || '';
        mainitem.Route = item.Route || '';
        mainitem.Frequency = item.Frequency || '';
        mainitem.DoseOther = item.DoseOther || '';
        mainitem.DaysSupply = item.DaysSupply || '';
        mainitem.QuantityUnit = item.QuantityUnit || '';
        mainitem.DoseId = item.DoseId || null;
        mainitem.DoseUnitId = item.DoseUnitId || null;
        mainitem.RouteId = item.RouteId || null;
        mainitem.FrequencyId = item.FrequencyId || null;
        mainitem.DoseOtherId = item.DoseOtherId || null;
        mainitem.DaysSupplyId = item.DaysSupplyId || null;
        mainitem.Quantity = item.Quantity || null;
        mainitem.QuantityUnitId = item.QuantityUnitId || null;
        mainitem.RefillId = item.RefillId || null;
        mainitem.Refills = item.Refills || null;
        mainitem.Sig = item.Sig;
        mainitem.SigId = item.OrganizationSigTemplateId;

        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
            }
        }
    };

    $scope.Templatesearch = {
        "ConsulTemplate": "",
        "DiagnosisTemplate": "",
        "Viewtemplate": true,
        "SelectedDiagnosisTemaplte": "",
        "IsCreatenewTemplatesave": false,
        "TemplateName": "",
        "TemplateId": 0,
        "IsFavorite": false,
        "IsTemplatePopover": false,
    }
    $scope.Addtotemplatepopup = function () {
        let mInstanceShow = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/Addtotemplatepopup.html",
            "backdrop": "static",
            "scope": $scope,
            //"size": "lg",
            "windowClass": "offcanves-right",
            "keyboard": false,

            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.Templatesearch.IsTemplatePopover = false;
                $scope.Templatesearch.IsCreatenewTemplatesave = false;
                $scope.Uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                }

            }
        });
    }

    $scope.AddasTemplateclick = function () {
        $scope.Templatesearch.IsTemplatePopover = !$scope.Templatesearch.IsTemplatePopover || false;
        $scope.Templatesearch.IsCreatenewTemplatesave = false;
    }
    $scope.SelectAssmtTemplate = function (item) {
        if ($scope.DiagnosisTemplatesArray.length > 0) {
            angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
                ditem.IsActiveTemplate = false;
            });
            item.IsActiveTemplate = true;
        }
    };
    $scope.changeDiagnosisSearch = function (searchitem) {



        if (searchitem != "") {
            var filtertemplate = $filter("filter")($scope.CopyDiagnosisTemplate, { "TemplateName": searchitem });
            $scope.DiagnosisTemplatesArray = angular.copy(filtertemplate);
            if ($scope.DiagnosisTemplatesArray.length === 0) {

            }
        } else {
            $scope.DiagnosisTemplatesArray = angular.copy($scope.CopyDiagnosisTemplate);
        }
        if ($scope.DiagnosisTemplatesArray.length > 0) {
            angular.forEach($scope.DiagnosisTemplatesArray, function (ditem) {
                ditem.IsActiveTemplate = false;
            });
            $scope.DiagnosisTemplatesArray[0].IsActiveTemplate = true;
        }
    }
    $scope.EditDiagnosisTemplate = function (templatedetails) {
        $scope.Templatesearch.TemplateName = templatedetails.TemplateName;
        $scope.Templatesearch.TemplateId = templatedetails.TemplateId;
        $scope.Templatesearch.IsFavorite = templatedetails.IsTemplateFavorites || false;
        $scope.DiagnosisTemplateId = templatedetails.TemplateId;
        $scope.ConsultationTemplatepop = false;
        $scope.AllCheifcomplaints = [];
        $scope.MedicineObjArray = [];
        $scope.OrderInvestigation = [];
        $scope.OrderProceduresArray = [];
        $scope.OrderSurgeryArray = [];
        $scope.OrderReferalArray = [];
        $scope.TempPrescriptionDetails = [];
        $scope.TempAnteriorArray = [];
        $scope.TempPosteriorArray = [];

        $scope.submitDiagnosis = templatedetails.DiagnosisArray || [];
        $scope.ActualAnteriorValuesArray = templatedetails.AnteriorValuesArray || [];
        $scope.ActualPosteriorValuesArray = templatedetails.PosteriorValuesArray || [];
        $scope.ActualExternalExaminationsValuesArray = templatedetails.ExternalExaminationsValuesArray || [];
        $scope.OrderInvestigationArray = templatedetails.InvestigationsArray || [];
        $scope.OrderProceduresArray = templatedetails.ProceduresArray || [];
        $scope.OrderSurgeryArray = templatedetails.SurgeryArray || [];
        $scope.OrderReferalArray = templatedetails.ReferralArray || [];
        $scope.TempAnteriorArray = templatedetails.AnteriorValuesArray || [];
        $scope.TempPosteriorArray = templatedetails.PosteriorValuesArray || [];






        if (templatedetails.ChiefComplaintsArray.length > 0) {
            $scope.AllCheifcomplaints = angular.copy(templatedetails.ChiefComplaintsArray);
        }

        $scope.TempPrescriptionDetails = templatedetails.MedicationsArray || [];

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {

            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (miditem) {
                var filetrarray = $filter("filter")($scope.TempPrescriptionDetails, function (iterator, ind) { return iterator.MedicationId == miditem.MedicationId }) || [];
                if (filetrarray.length == 0) {
                    var tempmedobj = {
                        "MedicationTemplateId": 0,
                        "PatientPrescriptionDetailId": miditem.PatientPrescriptionDetailId || null,
                        "PatientPrescriptionId": miditem.PatientPrescriptionId || null,
                        "PatientId": miditem.PatientId || null,
                        "MedicationId": miditem.MedicationId || null,
                        "RcopiaDrugId": miditem.RcopiaDrugId || "",
                        "RcopiaMedicationId": miditem.RcopiaMedicationId || "",
                        "RcopiaPrescriptionId": miditem.RcopiaPrescriptionId || null,
                        "MedicationName": miditem.MedicationName || "",
                        "DrugNDCID": miditem.DrugNDCID || "",
                        "DrugFirstDataBankMedID": miditem.DrugFirstDataBankMedID || "",
                        "DrugGenericId": miditem.DrugGenericId || "",
                        "DrugBrandName": miditem.DrugBrandName || "",
                        "DrugGenericName": miditem.DrugGenericName || "",
                        "DrugForm": miditem.DrugForm || "",
                        "DrugStrength": miditem.DrugStrength || "",
                        "DrugSchedule": miditem.DrugSchedule || "",
                        "DrugSupply": miditem.DrugSupply || "",
                        "DrugCompound": miditem.DrugCompound || "",
                        "MedicationTypeId": miditem.MedicationTypeId || "",
                        "MedicationTypeName": miditem.MedicationTypeName || "",
                        "Sig": miditem.Sig || "",
                        "SigId": miditem.SigId || 0,
                        "ActionId": miditem.ActionId || "",
                        "Action": miditem.Action || "",
                        "DoseId": miditem.DoseId || "",
                        "Dose": miditem.Dose || "",
                        "DoseUnitId": miditem.DoseUnitId || "",
                        "DoseUnit": miditem.DoseUnit || "",
                        "RouteId": miditem.RouteId || "",
                        "Route": miditem.Route || "",
                        "FrequencyId": miditem.FrequencyId || "",
                        "Frequency": miditem.Frequency || "",
                        "DoseOtherId": miditem.DoseOtherId || "",
                        "DoseOther": miditem.DoseOther || "",
                        "DaysSupplyId": miditem.DaysSupplyId || "",
                        "DaysSupply": miditem.DaysSupply || "",
                        "Quantity": miditem.Quantity || null,
                        "QuantityUnitId": miditem.QuantityUnitId || "",
                        "QuantityUnit": miditem.QuantityUnit || "",
                        "RefillId": miditem.RefillId || "",
                        "Refills": miditem.Refills || "",
                        "SubstitutionPermitted": miditem.SubstitutionPermitted || "",
                        "PatientInstructions": miditem.PatientInstructions || "",
                        "DeleteInd": "N",
                        "OtherNotes": miditem.OtherNotes || "",
                        "Remarks": miditem.Remarks || "",
                        "StartDate": miditem.StartDate || "",
                        "StopDate": miditem.StopDate || "",
                        "FillDate": miditem.FillDate || "",
                        "StopReason": miditem.StopReason || "",
                        "RcopiaMedicationStatus": miditem.RcopiaMedicationStatus || "",
                        "IsEditMode": miditem.IsEditMode || false,
                        "DiagnosisId": miditem.DiagnosisId || null,
                        "DiagnosisName": miditem.DiagnosisName || "",
                        "ICD10CODE": miditem.ICD10CODE || "",
                        "Type": miditem.Type || "",
                        "StopReasonId": miditem.StopReasonId || null,
                        "IsMedicationStopped": miditem.IsMedicationStopped || false,
                        "SelectedMedicationHistory": miditem.SelectedMedicationHistory || ""
                    }
                    $scope.TempPrescriptionDetails.push(tempmedobj);
                }
            });

        }
        angular.forEach($scope.TempPrescriptionDetails, function (miditem) {
            miditem.SigObj = miditem.Sig;

        });

        var params = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.HospitalID,
            "TemplateId": $scope.Templatesearch.TemplateId || 0,
            "TemplateName": $scope.Templatesearch.TemplateName || '',
            "DiagnosisArray": $scope.submitDiagnosis || [],
            "MedicationsArray": $scope.TempPrescriptionDetails || [],
            "AnteriorSegmentArrayNew": $scope.TempAnteriorArray || [],
            "PoteriorSegmentArrayNew": $scope.TempPosteriorArray || [],
            "ExternalExaminationsValuesArray": $scope.ActualExternalExaminationsValuesArray,
            "DeleteInd": 0,
            "IsTemplateFavorites": $scope.Templatesearch.IsFavorite || false,
            "IsDiagnosisMultiple": false,
            "SetasTemplate": false,
            "InvestigationsArray": $scope.OrderInvestigationArray,
            "ProceduresArray": $scope.OrderProceduresArray,
            "SurgeryArray": $scope.OrderSurgeryArray,
            "ReferralArray": $scope.OrderReferalArray,
            "ChiefComplaintsArray": $scope.AllCheifcomplaints || [],
        }

        eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
            if (resp.data.Status === "Failure") {
                $scope.message = [];
                $scope.message = resp.data.Message.split(':');
                if ($scope.message.length > 0) {
                    alertify.error($scope.message[1]);
                } else {
                    alertify.error(resp.data.Message);
                }
            } else {
                $scope.GetUserConsultationTemplateDetails();


                if ($scope.DiagnosisTemplateId === 0) {
                    alertify.success("Save successfully");
                } else {
                    alertify.success("Update successfully");
                }
            }
        }, function (err) {

        });
    };
    $scope.GetPatientPrescriptionDetails = function () {
        var params = {
            "PatientId": $scope.cacheStorageItem.patientid,
            "AppointmentId": $scope.appointmentInfo.AppointmentID,
            "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": $scope.HospitalID
        }
        eHnotePatientDataService.GetPatientPrescriptionDetails(params).then(function (resp) {

            if (resp.data.rows.length > 0) {
                $scope.cacheStorageItem.PrescriptionDetails = resp.data.rows || [];
                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails, function (bitem) {
                        bitem.CompleteAction = bitem.CompleteAction || null; 
                        bitem.PatientInstructions = bitem.PatientInstructions || "";
                    });
                }
            } else {
                $scope.cacheStorageItem.PrescriptionDetails = [];
            }

        });
    }

    // Search 
    $scope.previousSearchText = "";
    $scope.filteredMedicationList = [];

    $scope.GetDrugDataListFromRcopia = function (val) {
        if (!val || val.trim().length === 0) {
            // Reset previous search text and filtered list if the search box is cleared
            $scope.previousSearchText = "";
            $scope.filteredMedicationList = [];
            return [];
        }
        var req = {
            "VendorName": "Appolo Pharmacy",
            "VendorPassword": "abc123",
            "searchText": val,
            "Maximum": 20,
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "SearchType": "search_drug_detail",
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
        }

        if (!val || val.length < 3) {
            $scope.previousSearchText = "";
            $scope.filteredMedicationList = [];
            return [];
        }
        else {

            if ($scope.previousSearchText == "" && $scope.filteredMedicationList.length == 0) {
                return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                    resp.data.DrugDetailsList = resp.data.DrugDetailsList || [];
                    if (resp.data.DrugDetailsList !== undefined) {
                        if (resp.data.DrugDetailsList.length < 200) {
                            $scope.previousSearchText = val;
                            $scope.filteredMedicationList = resp.data.DrugDetailsList;
                            return resp.data.DrugDetailsList.map(function (item) {
                                return item;
                            });
                        } else {
                            $scope.previousSearchText = "";
                            $scope.filteredMedicationList = [];
                            alertify.error('More Records Available ! ');
                            return resp.data.DrugDetailsList.map(function (item) {
                                return item;
                            });
                        }
                    }
                });
            } else {
                if (val.toLowerCase().startsWith($scope.previousSearchText.toLowerCase()) && $scope.filteredMedicationList.length < 200) {
                    return $scope.filteredMedicationList.filter(function (item) {
                        return (
                            item.BrandName &&
                            item.BrandName.toLowerCase().includes(val.toLowerCase()) // Case-insensitive comparison
                        );
                    });
                } else {
                    $scope.previousSearchText = "";
                    $scope.filteredMedicationList = [];
                    return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                        resp.data.DrugDetailsList = resp.data.DrugDetailsList || [];
                        if (resp.data.DrugDetailsList !== undefined) {
                            if (resp.data.DrugDetailsList.length < 200) {
                                $scope.previousSearchText = val;
                                $scope.filteredMedicationList = resp.data.DrugDetailsList;
                                return resp.data.DrugDetailsList.map(function (item) {
                                    return item;
                                });
                            } else {
                                $scope.previousSearchText = "";
                                $scope.filteredMedicationList = [];
                                alertify.error('More Records Available ! ');
                                return resp.data.DrugDetailsList.map(function (item) {
                                    return item;
                                });
                            }
                        }
                    });
                }
            }
        }
    }
    $scope.GetOrganizationMedicationlist = function (val) {

        var req = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 10,
            "SearchText": val || '',
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParentHospitalId || null
        };
        if (req.SearchKey == "") {
            req.IsFrequent = "Y";
        }

        return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
            if (resp.data.count !== 0) {

                if (resp.data.MedicineList !== undefined) {
                    return resp.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    function getValidatePatientAddress() {
        var result = false;
        $scope.RcopiaPatientObj.City = $scope.selectedPatientData.PatientAddress.PostalAddress.CityName;
        $scope.RcopiaPatientObj.State = $scope.selectedPatientData.PatientAddress.PostalAddress.StateName;
        $scope.RcopiaPatientObj.Zip = $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode;
        var zipcode = $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode || "";
        if (zipcode == "") {
            result = false;
        } else {
            result = true;
        }
        return result;
    }
    $scope.IsClickSaveMedRxBtn = false;
    // Normal Save
    $scope.medicalRxdirectSave = function () {
        var count = 0;
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
                    pitem.Quantity = pitem.Quantity ||'';
                    if (pitem.Quantity == '') {
                        count = count + 1;
                    }
                });
                if (count > 0) {
                    alertify.error("Please Enter Quantity");
                    return false;
                }
            }
        }

        var countQty = 0;
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
                    pitem.QuantityUnitId = pitem.QuantityUnitId || '';
                    if (pitem.QuantityUnitId == '') {
                        countQty = countQty + 1;
                    }
                });
                if (countQty > 0) {
                    alertify.error("Please Enter Quantity Unit");
                    return false;
                }
            }
        }
        $scope.IsClickSaveMedRxBtn = true;
        eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObj, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {
            alertify.success("Medications Added  Successfully");
            var responsedata = {
                "status": "",
                "Type": "NormalSave",
                "response": response,
            };
            console.log(response);
            $scope.IsClickSaveMedRxBtn = false;
            $uibModalInstance.close(responsedata);

        }
        function OnAddSigError() {
            $scope.IsClickSaveMedRxBtn = false;
            alertify.error("Creating  Failed");
        }

    };
  
    // Eprescription and Save
    $scope.newmedicalrxEprescribeandSave = function () {
        var count = 0;
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
                    if (pitem.Quantity == '') {
                        count = count + 1;
                    }
                });
                if (count > 0) {
                    alertify.error("Please Enter Quantity");
                    return false;
                }
            }
        }

        var countQty = 0;
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
                    pitem.QuantityUnitId = pitem.QuantityUnitId || '';
                    if (pitem.QuantityUnitId == '') {
                        countQty = countQty + 1;
                    }
                });
                if (countQty > 0) {
                    alertify.error("Please Enter Quantity Unit");
                    return false;
                }
            }
        }
       
        if (getValidatePatientAddress()) {
            eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObj, OnAddSigSuccess, OnAddSigError);
            function OnAddSigSuccess(response) {
               // $scope.AddNewPrescriptionObj.MedicationsList = [];
                if (response.status === "Success") {
                    alertify.success("Medications Added  Successfully");
                    if (response.PrescriptionDetails.length > 0) {
                        var responsedata = {
                            "status": "Success",
                            "Eprescription": true,
                           
                        };
                        $uibModalInstance.close(responsedata);
                    }                  
                } else {                  
                    alertify.error("some error occured");
                }
            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
        } else {
            alertify.error("Please Add Patient Address to Proceed to Electronic Prescription");
            return false;
        }

    };

    $scope.addnewOrganizationSig = function (item) {


        var Obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "doseArray": $scope.doseArray,
            "actionArray": $scope.actionArray,
            "refillsArray": $scope.refillsArray,
            "doseOtherArray": $scope.doseOtherArray,
            "frequencyArray": $scope.frequencyArray,
            "durationArray": $scope.durationArray,
            "routeArray": $scope.routeArray,
            "doseUnitArray": $scope.doseUnitArray,
            "quantityUnitArray": $scope.quantityUnitArray,
            "MedicineId": item.MedicationId
        }
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/AddMedicationSigPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "windowClass": "modal__eighty--",
            "keyboard": false,
            //"size": "lg",
            "resolve": {
                "ParentObject": Obj
            },
            "controller": function ($scope, $uibModalInstance, eHnoteSettingsDataService, eHnotePatientDataService, ParentObject, alertify) {


                $scope.doseArray = [];
                $scope.doseOtherArray = [];
                $scope.frequencyArray = [];
                $scope.refillsArray = [];
                $scope.durationArray = [];
                $scope.actionArray = [];
                $scope.routeArray = [];
                $scope.doseUnitArray = [];
                $scope.quantityUnitArray = [];

                $scope.getMasterFieldDosageData = function () {
                    eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {

                        $scope.doseArray = resp.data.doseArray || [];
                        $scope.doseOtherArray = resp.data.doseOtherArray || [];
                        $scope.frequencyArray = resp.data.frequencyArray || [];
                        $scope.refillsArray = resp.data.refillsArray || [];
                        $scope.durationArray = resp.data.durationArray || [];
                        $scope.actionArray = resp.data.actionArray || [];
                        $scope.routeArray = resp.data.routeArray || [];
                        $scope.doseUnitArray = resp.data.doseUnitArray || [];
                        $scope.quantityUnitArray = resp.data.quantityUnitArray || [];
                    }, function (err) {
                        alertify.error("Failed");
                        console.log(err);
                    });
                };

                $scope.getMasterFieldDosageData();



                $scope.closeSigPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };


                function getnewOrganizationSigObj() {
                    var obj = {
                        "UserId": $scope.UserId,
                        "OrganizationSigTemplateId": 0,
                        "OrganizationId": ParentObject.HospitalId,
                        "Sig": "",
                        "ActionId": "",
                        "Action": "",
                        "DoseId": "",
                        "Dose": "",
                        "DoseUnitId": "",
                        "DoseUnit": "",
                        "RouteId": "",
                        "Route": "",
                        "FrequencyId": "",
                        "Frequency": "",
                        "DoseOtherId": "",
                        "DoseOther": "",
                        "DaysSupplyId": "",
                        "DaysSupply": "",
                        "DaysSupplyDescription": "",
                        "Quantity": null,
                        "QuantityUnitId": "",
                        "QuantityUnit": "",
                        "RefillId": "",
                        "Refills": "",
                        "DeleteInd": "N",
                        "IsFrequent": "N",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "MedicineId": ParentObject.MedicineId,
                    };

                    return obj;
                }


                $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();






                $scope.changePopupPrescAction = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.Action = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePopupPrescDose = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.Dose = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePopupPrescDoseUnit = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.DoseUnit = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePopupPrescRoute = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.Route = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePopupPrescFrequency = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.Frequency = filteredArray[0].Description;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePopupPrescDoseOther = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.DoseOther = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePopupPrescDaysSupply = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {

                        mainobj.DaysSupply = filteredArray[0].Code;
                        mainobj.DaysSupplyDescription = filteredArray[0].Description;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.addSIgNameDynamically = function () {
                    var dosesupplytest = "";
                    if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
                        dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupplyDescription;
                    }
                    $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
                }


                $scope.changePopupPrescQuantityUnit = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.QuantityUnit = filteredArray[0].Code;
                    };
                };

                $scope.changePopupPrescRefill = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.Refills = filteredArray[0].Code;
                    };
                };
                $scope.changePrescDaysSupply = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {
                        mainobj.DaysSupply = filteredArray[0].Code;
                        var currentDate = new Date();
                        var futureDate = new Date(currentDate.getTime() + (parseInt(mainobj.DaysSupply) * 24 * 60 * 60 * 1000));
                        mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');
                    }
                    var Datecode = filteredArray[0].Code
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + (parseInt(Datecode) * 24 * 60 * 60 * 1000));
                    /*  mainobj.DaysSupply = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
                    mainobj.DaysSupply = parseInt(Datecode);
                };


                $scope.SaveOrganizationSig = function (type) {
                    console.log($scope.addNewOrganizationSigObj);
                    if ($scope.addNewOrganizationSigObj.Sig == '') {
                        alertify.error("Please Enter Sig");
                        return false;
                    }
                    if ($scope.addNewOrganizationSigObj.Quantity == '') {
                        alertify.error("Please Enter Quantity");
                        return false;
                    }

                    if ($scope.addNewOrganizationSigObj.IsFrequent == true) {
                        $scope.addNewOrganizationSigObj.IsFrequent = "Y";
                    }

                    eHnotePatientDataService.AddUpdateOrganizationMedicationSig($scope.addNewOrganizationSigObj, OnAddSigSuccess, OnAddSigError);
                    function OnAddSigSuccess(response) {
                        alertify.success("Sig Added  Successfully");
                        $scope.savedSigs.push($scope.addNewOrganizationSigObj);
                        if (type == 'Close') {

                            //$scope.$emit("MidSigPopup", $scope.addNewOrganizationSigObj);
                            $uibModalInstance.close($scope.addNewOrganizationSigObj);
                        }
                        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
                        //    $uibModalInstance.close('save');

                        $scope.toggleAddSigFields();
                        $scope.getOrganizationMedicationSig();


                    }
                    function OnAddSigError() {
                        alertify.error("Creating  Failed");
                    }
                };

                $scope.totalSigCount = 0;
                $scope.getOrganizationMedicationSig = function (text) {
                    text = text || '';
                    var params = {
                        "OrganizationId": $scope.HospitalId,
                        "SearchText": text || '',
                        "PageSize": $scope.addNewOrganizationSigObj.PageSize,
                        "PageNumber": $scope.addNewOrganizationSigObj.PageNumber
                    };

                    eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
                        console.log(resp);
                        if (resp.data.Status == "Success") {
                            $scope.GetOrganizationMedicationSigArrayList = [];
                            $scope.GetOrganizationMedicationSigArrayList = resp.data.rows;
                            $scope.totalSigCount = resp.data.Count;
                        }
                        else if (resp.data.Status == "Failure") {
                            alertify.error("Data Updating Failed");
                        }
                        //if (resp.data.rows.length  > 0) {

                        //}
                    });
                };
                $scope.getOrganizationMedicationSig();
                $scope.clearSigPopup = function () {
                    $uibModalInstance.close('clear');
                };
                $scope.DeleteSig = function (item) {
                    item = item || "";
                    item.DeleteInd = "Y";

                    var obj = {
                        "OrganizationSigTemplateId": item.OrganizationSigTemplateId || 0,
                        "OrganizationId": $scope.HospitalID,
                        "UserId": $scope.UserId,
                        "Sig": item.Sig,
                        "ActionId": item.ActionId,
                        "Action": item.Action,
                        "DoseId": item.DoseId,
                        "Dose": item.Dose,
                        "DoseUnitId": item.DoseUnitId,
                        "DoseUnit": item.DoseUnit,
                        "RouteId": item.RouteId,
                        "Route": item.Route,
                        "FrequencyId": item.FrequencyId,
                        "Frequency": item.Frequency,
                        "DoseOtherId": item.DoseOtherId,
                        "DoseOther": item.DoseOther,
                        "DaysSupplyId": item.DaysSupplyId,
                        "DaysSupply": item.DaysSupply,
                        "Quantity": item.Quantity,
                        "QuantityUnitId": item.QuantityUnitId,
                        "QuantityUnit": item.QuantityUnit,
                        "RefillId": item.RefillId,
                        "Refills": item.Refills,
                        "DeleteInd": "Y",
                        "IsFrequent": item.IsFrequent,
                        "MedicineId": item.MedicineId


                    }
                    /*   $scope.GetOrganizationMedicationSigArrayList = $scope.GetOrganizationMedicationSigArrayList || [];*/
                    /* $scope.addNewOrganizationSigObj.push(obj);*/

                    eHnotePatientDataService.AddUpdateOrganizationMedicationSig(obj, OnAddSigSuccess, OnAddSigError);
                    function OnAddSigSuccess(response) {
                        alertify.success("Sig Deleted  Successfully");
                        $scope.getOrganizationMedicationSig();
                    }
                    function OnAddSigError() {
                        alertify.error("Deletion  Failed");
                    }
                };



                $scope.showAddSigFields = false;
                $scope.showAddSigButton = true;
                $scope.savedSigs = [];
                $scope.clearOrganizationSiginput = function () {
                    $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
                };
                $scope.toggleAddSigFields = function () {

                    $scope.showAddSigFields = !$scope.showAddSigFields;

                    $scope.showAddSigButton = !$scope.showAddSigButton;
                };

                $scope.allSigPagechanged = function (pagenumber) {

                    $scope.addNewOrganizationSigObj.PageNumber = pagenumber;
                    $scope.getOrganizationMedicationSig();
                };
            }

        });

        modalInstance.result.then(function (result) {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (mitem) {
                    if (mitem.MedicationId == result.MedicineId) {
                        mitem.SigObj = result.Sig || '';
                        $scope.ONSigDetails(result, mitem);
                    }
                });
            }
        }, function (cancel) {
        });

    }



    $scope.getOrganizationMedicationSigitems = function (text) {
        text = text || '';
        var params = {
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "IsFrequent": "Y",
            "PageSize": 10,
            "PageNumber": 1

        };
        if (text != "") {
            params.IsFrequent = "N";
        }
        return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            if (resp.data.rows.length !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        });

    };
    $scope.getParticularSigMedicationitems = function (text, item) {
        text = text || '';
        var params = {
            "MedicineId": item.MedicationId,
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "IsFrequent": "N",
            "PageSize": 10,
            "PageNumber": 1
        };
        if (text != "") {
            params.IsFrequent = "N";
        }
        return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            if (resp.data.rows.length !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        });

    };


    // Create RX Add

    $scope.CreateRXPrescription = function () {

        //if ($scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode == null || $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode == '') {
        //    alertify.error("Please Add Patient Address to Proceed to Electronic Prescription");
        //    return false;
        //}

       
            $scope.addUpdatePatientToRcopiaReqObj = {
                "UserId": $scope.UserId,
                "AppointmentId": 0,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaProviderUserName": $scope.ApptRcopiaUserInfo.RcopiaProviderUserName,
                "RcopiaProviderUserExternalId": $scope.ApptRcopiaUserInfo.RcopiaProviderUserExternalId,
                "RcopiaProviderPassword": $scope.ApptRcopiaUserInfo.RcopiaProviderPassword,
                "PatientList": []
            };

            $scope.addUpdatePatientToRcopiaReqObj.PatientList = [];
            $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
            $scope.RcopiaPatientObj.FirstName = $scope.selectedPatientData.Patient[0].FirstName;
            $scope.RcopiaPatientObj.LastName = $scope.selectedPatientData.Patient[0].LastName || "";
            $scope.RcopiaPatientObj.MiddleName = $scope.selectedPatientData.Patient[0].MiddleName || "";
            $scope.RcopiaPatientObj.ExternalID = $scope.selectedPatientData.Patient[0].PatientID;
            $scope.RcopiaPatientObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || "";
            $scope.RcopiaPatientObj.EmailId = $scope.selectedPatientData.Patient[0].EmailId;
            $scope.RcopiaPatientObj.DOB = $filter('date')($scope.selectedPatientData.Patient[0].DOB, "MM/dd/yyyy");
            var cGender = "M";
            if ($scope.selectedPatientData.Patient[0].Gender == 'Female') {
                cGender = "F";
            };
            if ($scope.selectedPatientData.Patient[0].Gender == "Unknown" || $scope.selectedPatientData.Patient[0].Gender == "Prefer not to tell") {
                cGender = "U";
            };


            if ($scope.selectedPatientData.Patient[0].IsDiseased) {
                $scope.RcopiaPatientObj.DeleteInd = "y";
            } else {
                $scope.RcopiaPatientObj.DeleteInd = "n";
            }

            $scope.RcopiaPatientObj.Sex = cGender;

            $scope.RcopiaPatientObj.MobilePhone = $scope.selectedPatientData.Patient[0].MobileNo;          

            if ($scope.selectedPatientData.Patient[0].ContactNo.length > 3) {
                $scope.RcopiaPatientObj.HomePhone = $scope.selectedPatientData.Patient[0].ContactNo;
            } else {
                $scope.RcopiaPatientObj.HomePhone = "";
            }

            if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == '' && $scope.PatientAddressInfo.PostalAddress.AddressLine2 == '') {
                $scope.RcopiaPatientObj.Address1 = "Unknown";
            } else {
                $scope.RcopiaPatientObj.Address1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1;
                $scope.RcopiaPatientObj.Address2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2;
            }

            $scope.RcopiaPatientObj.City = $scope.selectedPatientData.PatientAddress.PostalAddress.CityName;
            $scope.RcopiaPatientObj.State = $scope.selectedPatientData.PatientAddress.PostalAddress.StateCode; /*StateName*/
            $scope.RcopiaPatientObj.Zip = $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode;

            if ($scope.selectedPatientData.Patient[0].AdditionalInfo != undefined) {
                $scope.RcopiaPatientObj.Ethnicity = $scope.selectedPatientData.Patient[0].AdditionalInfo.EthnicityName;
                $scope.RcopiaPatientObj.Race = $scope.selectedPatientData.Patient[0].AdditionalInfo.RaceName;
                $scope.RcopiaPatientObj.PreferredLanguage = $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName;
            }
            $scope.addUpdatePatientToRcopiaReqObj.PatientList.push($scope.RcopiaPatientObj);
            eHnoteDiagnosisDataServices.addPatientToRcopia($scope.addUpdatePatientToRcopiaReqObj).then(function (response) {

                if (response.data.status === 'Success') {
                    if (response.data.rows.length > 0) {
                        $scope.RcopiaPatientObj.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.selectedPatientData.Patient[0].RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.cacheStorageItem.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.AddToCache();
                    }

                    $scope.CreateAddedRXPrescription();
                };
            });
        
    }
    $scope.CreateAddedRXPrescription = function () {
      
        var count = 0;
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
                    pitem.Quantity = pitem.Quantity || "";
                    if (pitem.Quantity == '') {
                        count = count + 1;
                    }
                });
                if (count > 0) {
                    alertify.error("Please Enter Quantity");
                    return false;
                }
            }
        }

        var countQty = 0;
        if ($scope.PrescriptionMainAddObj != '') {
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
                    pitem.QuantityUnitId = pitem.QuantityUnitId || '';
                    if (pitem.QuantityUnitId == '') {
                        countQty = countQty + 1;
                    }
                });
                if (countQty > 0) {
                    alertify.error("Please Enter Quantity Unit");
                    return false;
                }
            }
        }


        var CurrentTime = $filter("date")(new Date(), "HH:mm");
        let apptdate = new Date();
        apptdate.setMinutes(apptdate.getMinutes() + parseInt("15"));
        var EndTime = $filter('date')(apptdate, "HH:mm");

        $scope.PrescriptionMainAddObj.VisitId = $scope.cacheStorageItem.ConsultationID || 0
        $scope.PrescriptionMainAddObj.AppointmentId = $scope.cacheStorageItem.appointmentid || 0;

        //$scope.PrescriptionMainAddObj.VisitId =  0
        //$scope.PrescriptionMainAddObj.AppointmentId =  0;
        $scope.PrescriptionMainAddObj.DoctorId = $scope.UserId;
        $scope.PrescriptionMainAddObj.AppointmentTypeId = 9;
        $scope.PrescriptionMainAddObj.AppointmentType = 'Rx Appointment';
        $scope.PrescriptionMainAddObj.RcopiaPatientId = ""; 
        $scope.PrescriptionMainAddObj.PatientId = $scope.CreateRxObj.PatientId ;

        $scope.PrescriptionMainAddObj.StartTime = CurrentTime;
        $scope.PrescriptionMainAddObj.EndTime = EndTime;

        //if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
        //    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (pitem) {
        //        pitem.PatientPrescriptionDetailId = 0;
        //    });
          
        //}



            eHnotePatientDataService.AddUpdateCreateNewRXPrescriptionDetails($scope.PrescriptionMainAddObj, OnAddSigSuccess, OnAddSigError);
            function OnAddSigSuccess(response) {
               
                if (response.status === "Success") {
                    alertify.success("Medications Added  Successfully");
                    if (response.PrescriptionDetails.length > 0) {
                        var Createresponsedata = {
                            "status": "Success",
                            "CreateRX": true,
                            "Type": "CreateErxsave",
                            "AppointmentId": response.AppointmentId,
                            "ConsultationID": response.ConsultationID,
                            "PatientId": response.PatientId, 
                            "RcopiaPatientId": $scope.cacheStorageItem.RcopiaPatientId,
                        };
                        $uibModalInstance.close(Createresponsedata);
                    }
                } else {
                    alertify.error("Appointment already booked !");
                }
            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
    };
    $scope.Clickallsig = function (item) {
        item.SigObj = '';
    }




 

}]);
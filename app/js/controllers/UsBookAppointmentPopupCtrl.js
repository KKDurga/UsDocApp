"use strict";
eHnoteWebApp.controller("UsBookAppointmentPopupCtrl", ["$scope", "$log", "$timeout", 'eHnoteMasterDataService', 'eHnoteLoginStatusService', 'eHnotePatientDataService', 'eHnoteOrgReferralDataServices', 'eHnotePatientAddressDataServices', '$filter', 'eHnoteUserAppointmentDataService', 'alertify', 'eHnoteCacheStorageService', 'eHnotePatientVisitReasonServices', '$location', "$rootScope", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteAuditServices", "localStorageFactory", "eHnoteDbStaticDataService", "eHnoteMainAppointmentService", "eHnoteInsuranceService", "eHnotePrintService", "eHnoteUserDataService", "eHnoteSettingsDataService", "$uibModal", "eHnoteLabService", "eHnoteMainAdminServices", "eHnoteSurgeryService", function ($scope, $log, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnotePatientDataService, eHnoteOrgReferralDataServices, eHnotePatientAddressDataServices, $filter, eHnoteUserAppointmentDataService, alertify, eHnoteCacheStorageService, eHnotePatientVisitReasonServices, $location, $rootScope, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteAuditServices, localStorageFactory, eHnoteDbStaticDataService, eHnoteMainAppointmentService, eHnoteInsuranceService, eHnotePrintService, eHnoteUserDataService, eHnoteSettingsDataService, $uibModal, eHnoteLabService, eHnoteMainAdminServices, eHnoteSurgeryService) {

    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var AppointmentDetailsCache = datapersistanceFactory.getItem("AppointmentDetailsCache");
    $scope.isPatientExist = AppointmentDetailsCache.ispatientExistsval || false;
    $scope.dateVal = AppointmentDetailsCache.calenderDate;
    $scope.pagename = AppointmentDetailsCache.PageName;
    $scope.appCondate = AppointmentDetailsCache.AppDate;

    $scope.Appointmentscreen = {
        "Tab": 1
    }
    $scope.MultipleAppointmentList = [];
    $scope.AllPatientAppointmentList = [];
    $scope.IsPatientToBookApptInd = false;
    if ($scope.pagename === "reschedule") {
        $scope.IsPatientToBookApptInd = true;
    }

    $scope.IsApptTypeChangeEvent = false;
    $scope.UnblockSlots = false;
    console.log($scope.dateVal);
    $scope.AllowWalkinCheckBox = false;
    $scope.IsApptReqPopUp = false;
    let ScreenObj = datapersistanceFactory.getItem("AppointmentRequestScreen");
    if (angular.isObject(ScreenObj) && !angular.isArray(ScreenObj)) {
        $scope.AllowWalkinCheckBox = ScreenObj.IsOnlineRequest;
        $scope.IsApptReqPopUp = true;
    }

    $rootScope.AppointmentPatient_type = $rootScope.AppointmentPatient_type || "";
    if ($rootScope.AppointmentPatient_type === '') {
        $scope.AppointmentPatientTypeId = '';
    } else {
        $scope.AppointmentPatientTypeId = $rootScope.AppointmentPatient_type;
    }

    var consultationtype = $rootScope.IsTeleMedicineSlot || false;
    consultationtype = $rootScope.Consulatation_type || false;

    $scope.AdmissionId = "";
    $scope.isSurgery = false;
    $scope.IsSubmitDisabled = false;
    $scope.IsConsultationFollowUp = false;
    $scope.selectedHospitalobj = [];
    $scope.BindStartAppTime = "";
    $scope.othervisitrsn = "";
    $scope.visitrsnId = null;
    $scope.Selectedsurgeryobj = "";
    $scope.IsMaximumAppointmentsPerDay = false;
    $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = false;
    $scope.patientAppointmentID = 0;
    $scope.patientBillingId = 0;
    $scope.PaidFollowup = false;
    $scope.ShowAgediv = false;
    $scope.IsfromRegisterPatient = false;
    $scope.isAppValiddities = {
        "PaidFollowup": false,
        "ISFastTrackAppointment": false,
        "isENableVisitType": false,
        "isEnableAlertType": false,
        "isValidOptionSelected": true,
        "UserScheduleId": 0,
        "VisitTypes": []
    }

    $scope.PhoneType = "Mobile";
    $scope.PatientTitlesArray = eHnoteDbStaticDataService.GetPatientTitlesArray();
    $scope.IsComingFromFollowupDoctor = cacheStorageItem.IsComingFromFollowupDoctor;
    $scope.IsTreatmentFollowupAppointment = cacheStorageItem.IsTreatmentFollowupAppointment ? cacheStorageItem.IsTreatmentFollowupAppointment : false;

    $scope.SurgeriesList = [];
    $scope.patinet_consultationTime = "";
    $scope.IsFutureDateInd = false;
    $scope.slot = {
        //"SlotTypeId": 1,
        //"SlotAppointmentTypeId": 1,
        "patient_appEndTime": "",
        "patinet_appStarttime": ""
    }
    $scope.AppointmentRescheduleObj = {
        "StartTime": "",
        "IsCalendarBookAppt": false,
        "StartDateforActivecalendar": ""
    };
    function GetRescheduleSlotsObj() {
        var obj = {
            "IsStartandEndInd": false,
            "StartTimeSlot": "",
            "EndTimeSlot": "",
            "DurationTime": "",
            "originalSlot": ""
        }
        return obj;
    };
    $scope.RescheduleSlotsObj = GetRescheduleSlotsObj();
    $scope.IsReschduleSlotIND = false;


    $scope.Doctorcalendarobj = datapersistanceFactory.getItem("SingleDoctorcalendar");
    if ($scope.Doctorcalendarobj != '') {
        $scope.Doctorcalendarobj.VisitTypes = [];
    }
    console.log($scope.Doctorcalendarobj);

    function parseDateTime(dt) {
        var date = false;
        if (dt) {
            var c_date = new Date(dt);
            var hrs = c_date.getHours();
            var min = c_date.getMinutes();
            if (isNaN(hrs) || isNaN(min) || c_date === "Invalid Date") {
                return null;
            }
            var type = (hrs <= 12) ? " AM" : " PM";
            date = ((+hrs % 12) || hrs) + ":" + min + type;
        }
        return date;
    }

    $scope.calendarStartTime = "";
    $scope.IsComingFrom = "";
    if ($scope.Doctorcalendarobj.IsComingFrom !== '') {
        $scope.IsComingFrom = $scope.Doctorcalendarobj.IsComingFrom || '';
        if ($scope.IsComingFrom == 'Doctorcalendar') {
            $scope.calendarStartTime = parseDateTime($scope.Doctorcalendarobj.Starttime);
            console.log($scope.calendarStartTime);
        }
    }
    else {
        $scope.IsComingFrom = "";
    }
    //if ($scope.IsComingFrom == 'Doctorcalendar') {
    //    $scope.IsPatientToBookApptInd = true;
    //}


    $scope.reloadCalendarTimeSlots = function () {

        $scope.isSurgery = false;

        $scope.SurgeriesList = $scope.SurgeriesList || [];
        $scope.followUpObj.OrganizationSurgeryId = "";
        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
        var params = {
            "DoctorId": $scope.SelectedBranchDocId,
            "UserBranchId": $scope.selectedDocObject.selectedPerson.UserBranchId,
            "Date": appointmentDate
        }




        // eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);
        eHnoteMainAppointmentService.GetDoctorAvaiableSlotByDate(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                angular.forEach(response.NormalSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);

                    item.seqStartTime = item.StartTime.replace(":", "");
                    item.seqEndTime = item.EndTime.replace(":", "");
                });
                angular.forEach(response.TeleSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);
                });

                $scope.IsMaximumAppointmentsPerDay = false;
                if (response.UserConsultationNew.length > 0) {
                    if (response.UserConsultationNew[0].IsMaximumAppointmentsPerDay == true) {
                        if (response.DoctorAppointmentCount > response.UserConsultationNew[0].MaximumAppointmentsPerDay || response.DoctorAppointmentCount == response.UserConsultationNew[0].MaximumAppointmentsPerDay) {
                            //alertify.error(".Please choose another doctor");
                            $scope.IsMaximumAppointmentsPerDay = true;
                            alertify.error("Maximum Appointments Reached for is Doctor. Please choose another doctor");
                            return false;

                        }
                    }
                }
                newreStructureDoctorSelectedSlots(response);
            }

        }
        function OnGetError(response) {
            var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
            if ($scope.appDate) {
                $scope.setValue = [];
                if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                    bindDoctorSlots(MinPerCaseval, 'current');
                } else {
                    bindDoctorSlots(MinPerCaseval, 'all');
                }
            }
        }
        $scope.isAppValiddities.isValidOptionSelected = true;
    }



    $scope.reloadCalendarStartTime = function () {
        console.log($scope.Doctorcalendarobj);

        $scope.Showaddnotes = true;
        $scope.isAppValiddities.isValidOptionSelected = true;
        $scope.UnblockSlots = true;
    }

    $scope.appointment_type = {
        "AppointmentTypeId": "3"
    }
    $scope.SelectedUserRoles = {
        "Value": "4"
    };
    $scope.patient_appEndTime = "";

    if ($scope.bookApptType === "FollowUp") {
        $scope.appointment_type.AppointmentTypeId = "3";
    }
    else if ($scope.bookApptType === "New") {
        $scope.appointment_type.AppointmentTypeId = "1";
    }

    cacheStorageItem.bookApptType = cacheStorageItem.bookApptType || '';
    if (cacheStorageItem.bookApptType == 'EditAppointment') {
        $scope.appointment_type.AppointmentTypeId = $rootScope.appointment_type || "1";
    }
    $scope.dynamicPopover = {
        templateUrl: "myPopoverTemplate.html",
        title: "Files Uploaded"
    };
    $scope.AppointmentType = "New";
    $scope.IsPatientRegistrationShow = false;

    $scope.SelectedDummyAppointment = "";
    $scope.Source = "0";
    $scope.SelectedParentAppt = { "AppointmentId": 0 };
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var inputData = eHnoteMasterDataService.getcalenderInfo();
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = userLoginDetails.RoleID;
    $scope.DocotrName = userLoginDetails.displayName;
    $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    console.log($scope.appointmentInfo);
    $scope.showTeleBookingAccess = false;
    $scope.showNormalBookingAccess = false;
    $scope.Showaddnotes = false;
    if ($scope.appointmentInfo.showTeleBookingAccess === undefined) {
        $scope.appointmentInfo.showTeleBookingAccess = true;
    }
    if ($scope.appointmentInfo.showNormalBookingAccess === undefined) {
        $scope.appointmentInfo.showNormalBookingAccess = true;
    }
    $scope.showTeleBookingAccess = $scope.appointmentInfo.showTeleBookingAccess;
    $scope.showNormalBookingAccess = $scope.appointmentInfo.showNormalBookingAccess;
    $scope.appointmentInfo.BillingId = $scope.appointmentInfo.BillingId || 0;
    $scope.appointmentInfo.IsPaymentPending = $scope.appointmentInfo.IsPaymentPending || false;

    $scope.appointmentInfo.showAllHospitalsinAppList = $scope.appointmentInfo.showAllHospitalsinAppList || true;
    if ($scope.appointmentInfo.PaidFollowup !== undefined) {
        $scope.isAppValiddities.PaidFollowup = $scope.appointmentInfo.PaidFollowup;
    }

    if ($scope.appointmentInfo.ISFastTrackAppointment !== undefined) {
        $scope.isAppValiddities.ISFastTrackAppointment = $scope.appointmentInfo.ISFastTrackAppointment;
    }
    $scope.changeFFastTrack = function (item) {
        $scope.isAppValiddities.ISFastTrackAppointment = item;
    }
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.AppointmentCheckInDynamicStatus = 0;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            $scope.AppointmentCheckInDynamicStatus = $scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus;
        }
    }

    $scope.paymentTypeObj = {
        "PaymentTypeId": "1",
        "OrgInsuranceTpaId": 0,
        "SelectPatientInsuranceObj": "",
        "AppointmentNote": "",
        "SelectPatientPrimaryInsuranceObj": "",
        "SelectPatientSecondaryInsuranceObj": "",
        "BillingCategoryType": "Bill Patient",
        "AppointmentNotesList": [],
        "PatientInsuranceList": [],
        "GETPatientInsuranceList": [],
        "IsPaymentTypeInd": true
    };
    console.log($scope.appointmentInfo.PaymentTypeId);
    if ($scope.appointmentInfo.PaymentTypeId == 2 || $scope.appointmentInfo.PaymentTypeId == 3) {
        $scope.paymentTypeObj.PaymentTypeId = $scope.appointmentInfo.PaymentTypeId.toString();
        $scope.paymentTypeObj.IsPaymentTypeInd = false;
        $scope.paymentTypeObj.OrgInsuranceTpaId = $scope.appointmentInfo.OrgInsuranceTpaId;

        $scope.paymentTypeObj.GETPatientInsuranceList = $scope.appointmentInfo.PatientInsuranceList || [];
        if ($scope.paymentTypeObj.GETPatientInsuranceList.length > 0) {
            angular.forEach($scope.paymentTypeObj.GETPatientInsuranceList, function (gitem) {
                gitem.DeleteInd = "N";
            });
        }
    }

    $scope.paymentTypeObj.PaymentTypeId = $scope.appointmentInfo.PaymentTypeId ? $scope.appointmentInfo.PaymentTypeId.toString() : "1";
    $scope.paymentTypeObj.IsPaymentTypeInd = $scope.paymentTypeObj.PaymentTypeId == "1" ? true : false;

    $scope.IsBillPaid = false;

    console.log($scope.appointmentInfo.BillingId);
    if ($scope.appointmentInfo.BillingId !== 0) {
        $scope.IsBillPaid = true;
    }

    $scope.iseditApptinCredit = false;
    if ($scope.appointmentInfo.BillingId !== 0 && ($scope.appointmentInfo.OrgInsuranceTpaId !== 0 && $scope.appointmentInfo.OrgInsuranceTpaId !== '')) {
        $scope.iseditApptinCredit = true;
    }
    $scope.RootAppointmentId = 0;
    var object = {};
    $scope.OrgTOSCODESArray = [];

    $scope.selectedTosCodesArray = [];
    var tosCodeObject = {
        "AppointmentTOSCodeId": 0,
        "TOSCodeId": 0,
        "TOSCode": "",
        "TOSCodeObject": "",
        "DeleteInd": "N"
    };
    //  $scope.selectedTosCodesArray.push(tosCodeObject);
    $scope.TOSCodeObject = "";
    if (cacheStorageItem.bookApptType == 'EditAppointment') {
        $scope.appointmentInfo.AppointmentTOSCodes = $scope.appointmentInfo.AppointmentTOSCodes || [];
        if ($scope.appointmentInfo.AppointmentTOSCodes.length > 0) {
            $scope.selectedTosCodesArray = angular.copy($scope.appointmentInfo.AppointmentTOSCodes);
            angular.forEach($scope.selectedTosCodesArray, function (item) {
                item.DeleteInd = "N";
            });
        }
    }

    $scope.AppListdoctoraddress = [];
    $scope.InvestigationList = [];
    var selectedHospitalinAppList = eHnoteMasterDataService.getSelectedHospitalinAppList();
    var selectedDoctorinAppList = eHnoteMasterDataService.getSelectedDoctorinAppList();

    console.log(selectedHospitalinAppList);
    $scope.UserSettingObject = datapersistanceFactory.getItem("UserSettingsData");
    $scope.CommunicationdetailsArray = $scope.UserSettingObject.CommunicationsSettings;
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    console.log($scope.SpecializationId + "__SpecializationId");

    $scope.showAppointmentDoctors = inputData.showAppointmentDoctors;
    $scope.SearchByPatients = "Y";
    // $scope.appDate = $filter("date")(new Date(), "dd-MMM-yyyy");
    $scope.appDate = $filter("date")(new Date(), "MM-dd-yyyy");
    if ($scope.Doctorcalendarobj.GetDate != undefined) {
        $scope.appDate = $filter("date")($scope.Doctorcalendarobj.GetDate, "MM-dd-yyyy");

        var dateToday = $filter("date")(new Date(), "MM-dd-yyyy");
        if ($scope.appDate > dateToday) {
            $scope.IsFutureDateInd = true;
        } else {
            $scope.IsFutureDateInd = false;
        }
    } else {
        $scope.appDate = $filter("date")(new Date(), "MM-dd-yyyy");
        $scope.IsFutureDateInd = false;
    }
    $scope.isregisterBtn = false;
    $scope.buttonName = "Book Appointment";
    $scope.ConsultationEntry = {
        "IsConsultationEntryFormPrint": false,
        "IsTeleMedicineSlot": false,
        "IsNavToBill": false
    };
    $scope.sendDocSms = false;
    $scope.sendDocEmail = false;
    $scope.sendPatientSms = false;
    $scope.sendPatientEmail = false;
    $scope.ParenthospitalId = 0;
    $scope.patients = [];
    $scope.selectedSpecialization = {
        "SpecializationName": "All Specialities",
        "SpecializationId": 0
    };
    $scope.searchtxtSpc = { "txt1": "", "txt2": "" };
    $scope.followUpObj = {
        "OrganizationSurgeryId": ""
    };


    $scope.selectedOptometristObject = {
        "optom": ""
    };
    $scope.SelectedOptometristId = 0;
    $scope.selectedArObject = "";
    $scope.SelectedArId = 0;

    $scope.ConsultationType = {
        "typename": ""
    };
    $scope.selectBookingType = {
        "selectedBookAppo": "",
        "IsWalkInSlot": false,
        "IsAppointmentConfirmed": false,
        "IsPatientMissedAppointment": false,
        "IsInsuranceEligibilityVerify": false
    };

    $scope.selectBookingType.IsAppointmentConfirmed = cacheStorageItem.IsAppointmentConfirmed || false;

    var AppointmentDetailsById = datapersistanceFactory.getItem("OpAppointmentDetailsById");
    $scope.selectedDocObject = {
        "selectedPerson": ""
    };
    $scope.BookingType = 1;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }
    if ($scope.pagename === "reschedule") {
        $scope.masterQuestionsList = cacheStorageItem.masterQuestions || [];

        $scope.selectBookingType.IsInsuranceEligibilityVerify = AppointmentDetailsById.IsInsuranceEligibilityVerify || false;
        $scope.selectBookingType.IsPatientMissedAppointment = AppointmentDetailsById.IsPatientMissedAppointment || false;
        $scope.visitremarks = cacheStorageItem.VisitRemarks;
    }
    else {
        $scope.masterQuestionsList = datapersistanceFactory.getItem("masterQuestions") || [];
    }
    $scope.FinalCovidQuestionArray = [];
    if ($scope.masterQuestionsList.length > 0) {
        angular.forEach($scope.masterQuestionsList, function (kitem) {
            kitem.RowId = kitem.QuestionId;
            if (kitem.QuestionId === 1 || kitem.QuestionId === 2 || kitem.QuestionId === 3 || kitem.QuestionId === 5 || kitem.QuestionId === 7 || kitem.QuestionId === 8) {
                $scope.FinalCovidQuestionArray.push(kitem);
            }
            if (kitem.QuestionId === 3 && kitem.IsActive === true) {
                var selectedarray = $filter("filter")($scope.FinalCovidQuestionArray, { "QuestionId": 4 }, true) || [];
                if (selectedarray.length === 0) {
                    $scope.FinalCovidQuestionArray.push($scope.masterQuestionsList[3]);
                }
            }
            if (kitem.QuestionId === 5 && kitem.IsActive === true) {
                var selectedarray1 = $filter("filter")($scope.FinalCovidQuestionArray, { "QuestionId": 6 }, true) || [];
                if (selectedarray1.length === 0) {
                    $scope.FinalCovidQuestionArray.push($scope.masterQuestionsList[5]);
                }
            }
        });

    }


    $scope.ShowChildQuestion = function (item, index) {
        if (item.QuestionId === 3 && item.IsActive === true) {
            var selectedarray = $filter("filter")($scope.FinalCovidQuestionArray, { "QuestionId": 4 }, true) || [];
            if (selectedarray.length === 0) {
                $scope.FinalCovidQuestionArray.push($scope.masterQuestionsList[3]);
            }
        }
        if (item.QuestionId === 3 && item.IsActive === false) {
            for (var i = $scope.FinalCovidQuestionArray.length - 1; i >= 0; i--) {
                if ($scope.FinalCovidQuestionArray[i].QuestionId === 4) {
                    $scope.FinalCovidQuestionArray.splice(i, 1);
                }
            }
        }

        if (item.QuestionId === 5 && item.IsActive === true) {
            var selectedarray1 = $filter("filter")($scope.FinalCovidQuestionArray, { "QuestionId": 6 }, true) || [];
            if (selectedarray1.length === 0) {
                $scope.FinalCovidQuestionArray.push($scope.masterQuestionsList[5]);
            }
        }
        if (item.QuestionId === 5 && item.IsActive === false) {
            for (var i = $scope.FinalCovidQuestionArray.length - 1; i >= 0; i--) {
                if ($scope.FinalCovidQuestionArray[i].QuestionId === 6) {
                    $scope.FinalCovidQuestionArray.splice(i, 1);
                }
            }
        }
    }

    if ($scope.pagename === "directFollowup") {
        $scope.bookApptType = "FollowUp";
        $rootScope.appointment_type = "3";
        $scope.appointment_type.AppointmentTypeId = "3";
        cacheStorageItem.FollowUpDate = cacheStorageItem.FollowUpDate || "";
        if (cacheStorageItem.FollowUpDate != '') {
            $scope.appDate = $filter("date")(cacheStorageItem.FollowUpDate, "dd-MMM-yyyy");
        }
    } else {
        $scope.bookApptType = "New";
        $scope.appointment_type.AppointmentTypeId = "1";
    }

    $scope.IsCheckIn = 1;
    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
    $scope.ShowDefaultButtons = false;
    $scope.RegistrationTab = 1;
    $scope.switchRegistrationTab = function (tab) {
        $scope.RegistrationTab = tab;
    }

    $scope.ShowAddNew = false;
    $scope.ShowSearchAndClear = true;
    $scope.mobilenumber = "";
    $scope.DefaultShowDetails = false;
    $scope.showpaynBookApptbtn = false;
    $scope.EndStarttimechange = function (starttime) {
        $scope.patinet_appStarttime = starttime.StartTime;
    }

    $scope.ShowAddNewInsurance = false;

    $scope.HospitalEquipmentList = [];
    $scope.selectedHospitalEquipment = "";

    $scope.HospitalEquipmentId = "";
    $scope.ChangeHospitalEquipment = function (item) {
        item = item || "";
        $scope.HospitalEquipmentId = item || "";
    }

    $scope.ChangePatientSearch = function (type) {
        $scope.selectedPatientObj = {
            "PatientName": "",
            "PatientDisplayId": "",
            "OldPatientDisplayId": "",
            "NewpatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
            "FollwuppatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
            "PatientId": 0,
            "PatientDOB": "",
            "PatientAge": "",
            "PatientAgeInYears": "",
            "PatientAgeInMonths": "",
            "PatientAgeInDays": "",
            "PatientRefferal": "",
            "PatientMobile": "",
            "CountryCode": "91",
            "PatientGender": 'Male',
            "IsNewPatient": 'Old',
            "AgeInYears": "",
            "AgeInMonths": "",
            "AgeInDays": "",
            "DOB": "",
            "ReferralSourceId": 0,
            "ReferralSource": "",
            "ReferralSourceName": "",
            "DisplayID": "",
            "PatientTitle": "Mr",
            "referralSource": "",
            "PatientTypeName": "General",
            "PatientType": 1,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "MasterReferralSourceId": "",
            "MasterReferralSourceName": "",
            "BSMSind": false,
            "ContactNo": "",
            "emgymobilenumber": "",
            "emgyname": "",
            "emgyrelationship": "",
            "AttenderName": "",
            "ReferralMobileNo": "",
            "ReferralContactNo": "",
            "ReferralPhoneType": 'Mobile',
            "AlternateLandLine": "",
            "AlternatePhoneNo": "",
            "AltCountryCode": "+91",
            "Altareacode": "",
            "DOBSearch":"",
        };

        $scope.selectedPatientObj.NewpatSearchType = type;
        $scope.selectedPatientObj.FollwuppatSearchType = type;
        $scope.patients = [];
        $scope.IsPatientRegistrationShow = false;

        $scope.ConsultationType.typename = consultationtype ? 'VideoConsultation' : 'PhysicalConsultation';
        if ($scope.ConsultationType.typename === 'VideoConsultation') {
            $scope.BookingType = 3;
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 3 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = "3";
                    $scope.selectBookingType.IsWalkInSlot = false;
                }
            }
        } else {
            $scope.BookingType = 1;
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 1 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = List[0] || "";
                    $scope.selectBookingType.selectedBookAppo = "1";
                    $scope.selectBookingType.IsWalkInSlot = true;
                }
            }
        }
        $scope.AppointmentPatientTypeId = '';
        $scope.IsNumberaddPatient = false;
        $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.IsNoPatienthere = false;

        $scope.changeAppointmentDoctor($scope.SelectedBranchDocId);
    };

    $scope.UserId = eHnoteMasterDataService.getLoginId() || "";
    $scope.SelectedNotesobj = {
        "IsEdit": false,
        "index": null,
        "AppointmentNoteId": null
    };



    $scope.formatPhoneNumber = function (phoneNumberString) {

        if (phoneNumberString.length == 3) {
            //reformat and return phone number
            return phoneNumberString.replace(/(\d{3})$/, "($1)");
        }
        else if (phoneNumberString.length < 6) {
            //reformat and return phone number
            return phoneNumberString.replace(/(\d{3})(\d{3})$/, "($1) $2");
        }
        else if (phoneNumberString.length == 10) {
            //reformat and return phone number
            return phoneNumberString.replace(/(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
        }

    }
    $scope.formatUSNumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.PatientDetailsForRegisterObj.DisplayNumber = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.PatientDetailsForRegisterObj.HomeAreaCode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.PatientDetailsForRegisterObj.HomeNumber = contact;
            }
        } else {
            $scope.PatientDetailsForRegisterObj.DisplayNumber = "";
            $scope.PatientDetailsForRegisterObj.HomeAreaCode = "";
            $scope.PatientDetailsForRegisterObj.HomeNumber = "";
        }
    }

    function GetPatientDetailsForRegister() {
        var obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientID": 0,
            "PatientTagId": 0,
            "Title": "Mr",
            "TitleId": 1,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "SecondLastName": "",
            "SecondLastNameInd": true,
            "DOB": "",
            "SocialSecurityNo": "",
            "Gender": "Male",
            "MaritalStatusID": "",
            "BloodGroupId": 0,
            "EmailID": "",
            "HomeCountryCode": "+1",
            "HomeAreaCode": "",
            "HomeNumber": "",
            "DisplayNumber": "",
            "PatientDisplayId": "",
            "OfficeCountryCode": "+1",
            "OfficeAreaCode": "",
            "OfficeNumber": "",
            "DisplayOfficeNumber": "",
            "S3URL": "",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "ageinYears": "",
            "ageinMonths": "",
            "ageinDays": "",
            "AuthorizationId": "",
            "IsPatientSmsInd": false,
            "IsPatientEmailInd": false,
            "OccupationId": "",
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "Emergency": "",
            "EmergencyMobile": "",
            "FaxNumber": "",
            "Faxcountrycode": "",
            "FaxAreacode": "",
            "FaxHomeNumber": "",
        };

        if (doctorinfo.doctordata.User.length > 0) {
            obj.HomeCountryCode = doctorinfo.doctordata.User[0].CommunicationCountryCode;
            obj.OfficeCountryCode = doctorinfo.doctordata.User[0].CommunicationCountryCode;
        }
        return obj;
    }
    $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
    $scope.IsDefaultPatientRegister = true;
    $scope.GetPatientRelatedMasterData = function () {
        eHnoteSettingsDataService.GetPatientRelatedMasterData().then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.TitleArray.length != 0) {
                    $scope.TitlesList = resp.data.TitleArray;
                }
                $scope.InsuranceCoverageList = resp.data.CoverageArray;
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });

    };
    $scope.GetPatientRelatedMasterData();
    function GetInsuranceObj() {
        var obj = {
            "CoverageId": 0,
            "PatientInsuranceDetailId": 0,
            "PatientAppointmentInsuranceDetailId": 0,
            "PlanId": 0,
            "PlanObj": "",
            "Payor": "",
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "PayorObj": "",
            "PlanTypeId": 0,
            "PolicyId": "",
            "GroupId": "",
            "GroupName": "",
            "RelationShipId": 1,
            "InsuranceRelationShipObj": "",
            "PolicyHolder": "",
            "PolicyHolderName": "",
            "Employer": "",
            "Coinsurance": "",
            "VisitCopay": "",
            "EffectiveDate": "",
            "ExpiryDate": "",
            "ScanDate": "",
            "VerifiedDate": "",
            "DeleteInd": false,
            "AcceptAssign": "",
            "AssignBenifits": "",
            "ReleaseInfo": "",
            "LaboratoryId": 0,
            "StatusId": 1,
            "IsVerified": false,
            "Comments": "",
            "MSPTrailerTypeId": 0,
            "Staff": "",
            "PatientDocumentDetails": [],
            "MsnTyp": "",
            "IsAcceptAssign": 0,
            "IsAcceptAssignBenifits": 0,
            "IsReleaseInfo": 0,
            "PatientBillingTypeId": 0,
            "TempInsuranceImagesArray": [],
            "InsuredPersonFirstName": "",
            "InsuredPersonDOB": "",
            "InsuredPersonGenderID": "",
            "InsuredPersonSSN": "",
            "IdentifierId": 2,
            "setprimary": false,
            "InsuredPersonMiddleName": "",
            "InsuredPersonLastName": "",
            "PatientFirstName": "",
            "PatientLastName": "",
            "PatientDOB": "",
            "PatientSSN": "",
            "PatientMiddleName": "",
            "PatientSecondLastName": ""
        }
        return obj;
    }
    $scope.PatientInsuranceObj = GetInsuranceObj();
    $scope.SurgeryList = [];
    $scope.IsNumberaddPatient = false;
    $scope.IsDoctorcalendarDate = false;
    $scope.IsNoPatienthere = false;


    var SetupPopUp;
    $scope.AppoitmentRegisterPatient = function () {
        $scope.RegisterClosePopup();
    }
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.IsEmergencyContactMandatory = false;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.PatientRegistration !== undefined) {
            if ($scope.OrganizationSettingsData.PatientRegistration.IsEmergencyContactMandatory === 1) {
                $scope.IsEmergencyContactMandatory = true;
            }
        }
    }
    if ($scope.pagename === "FollowUpAppointmentList") {
        $scope.appDate = $filter("date")(cacheStorageItem.FollowUpDate, "dd-MMM-yyyy");
    }

    $scope.listval = [];
    var clinicAddress = [];
    //Newly Added By Durga 05-02-2019
    $scope.patSearchType = "2";   // '1' for Mr.No /mobile ,'2' for Name search
    $scope.FollowupAppointments = [];
    $scope.FollowupappointmentID = "";
    $scope.ShowbasicdetailsData = 1;
    $scope.PrevSlide = function (ShowbasicdetailsData) {

        $scope.ShowbasicdetailsData = ShowbasicdetailsData - 1;
        if ($scope.ShowbasicdetailsData === 0) {
            $scope.ShowbasicdetailsData = 5;
        }
    };
    $scope.NextSlide = function (ShowbasicdetailsData) {
        if (ShowbasicdetailsData === 5) {
            $scope.ShowbasicdetailsData = 1;
        } else {
            $scope.ShowbasicdetailsData = ShowbasicdetailsData + 1;
        }

    };
    $scope.SelectedSource = "";


    $scope.switchApptshowTab = function (type) {
        $scope.bookApptType = type;
    };

    $scope.switchApptTab = function (type) {

        // $scope.SpecializationId == 2// dentist

        if ($scope.pagename !== "directFollowup" || $scope.SpecializationId === 2) {
            $scope.bookApptType = type;
            if ($scope.bookApptType === "FollowUp") {
                $rootScope.appointment_type = "3";
                $scope.IsPatientRegistrationShow = false;
                $scope.appointment_type.AppointmentTypeId = "3";
                $scope.IsConsultationFollowUp = true;
            }
            $scope.appDate = $filter('date')(new Date(), "dd-MMM-yyyy");
            if (!$scope.isPatientExist) {
                $scope.selectedPatientObj = {
                    "PatientName": "",
                    "PatientDisplayId": "",
                    "OldPatientDisplayId": "",
                    "NewpatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
                    "FollwuppatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
                    "PatientId": 0,
                    "PatientDOB": "",
                    "PatientAge": "",
                    "PatientAgeInYears": "",
                    "PatientAgeInMonths": "",
                    "PatientAgeInDays": "",
                    "PatientRefferal": "",
                    "PatientMobile": "",
                    "AltPhone": "",
                    "AltLandline": "",
                    "CountryCode": "91",
                    "PatientGender": 'Male',
                    "IsNewPatient": "Old",
                    "AgeInYears": "",
                    "AgeInMonths": "",
                    "AgeInDays": "",
                    "DOB": "",
                    "ReferralSourceId": 0,
                    "ReferralSource": "",
                    "ReferralSourceName": "",
                    "DisplayID": "",
                    "PatientEmail": "",
                    "PatientTitle": "Mr",
                    "PatientType": 1,
                    "PatientTypeName": "General",
                    "FirstName": "",
                    "LastName": "",
                    "MasterReferralSourceId": "",
                    "MasterReferralSourceName": "",
                    "BSMSind": false,
                    "ContactNo": "",
                    "emgymobilenumber": "",
                    "emgyname": "",
                    "emgyrelationship": "",
                    "DOBSearch": "",

                };
            }
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 1 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = List[0] || "";
                    $scope.selectBookingType.selectedBookAppo = "1";
                    $scope.selectBookingType.IsWalkInSlot = true;
                }
            }
            $scope.BookingType = 1;
        }
    };
    if ($scope.pagename === 'withoutConsultationFollowup') {
        $scope.IsConsultationFollowUp = true;
    }
    else if ($scope.pagename === 'reschedule') {
        $scope.IsConsultationFollowUp = $rootScope.rescheduleConsultationFollowUp;
        // $scope.BookingType = $rootScope.BookingType || 1;
    }
    angular.forEach($scope.CommunicationdetailsArray, function (item, index) {
        if (item.Mode === "doctor") {
            $scope.sendDocSms = item.SmsSettingsObj.Appointment;
            $scope.sendDocEmail = item.EmailSettingObj.Appointment;
        }
        if (item.Mode === "patient") {
            $scope.sendPatientSms = item.SmsSettingsObj.Appointment;
            $scope.sendPatientEmail = item.EmailSettingObj.Appointment;
        }
    });
    $scope.IsappointmentModeEdit = false;
    if ($scope.pagename === "FollowUp") {
        $scope.HeaderName = "Follow-up Appointment";
    } else if ($scope.pagename === "reschedule") {
        $scope.HeaderName = "Re-schedule Appointment";
    } else if ($scope.pagename === "rebook") {
        $scope.HeaderName = "Re-Book Appointment";
    } else {
        $scope.HeaderName = "Book Appointment";
    }
    if ($scope.pagename === "reschedule") {
        $scope.buttonName = "Update";
    } else {
        $scope.buttonName = "Book Appointment";
    }

    if ($scope.appCondate) {
        if ($scope.appCondate[2] === 0 || $scope.appCondate[2] === undefined || $scope.appCondate[2] === null || $scope.appCondate[2] === "") {
            $scope.IsappointmentModeEdit = false;
        } else {
            $scope.IsappointmentModeEdit = true;
        }
    }

    if ($scope.dateVal) {
        var d = $filter("date")($scope.dateVal, "dd-MMM-yyyy");
        $scope.appDate = moment(d).format("MM-DD-YYYY");

        var dateToday = $filter("date")(new Date(), "MM-dd-yyyy");
        if ($scope.appDate > dateToday) {
            $scope.IsFutureDateInd = true;
        } else {
            $scope.IsFutureDateInd = false;
        }
    }
    cacheStorageItem.PreviousAppointmentDate = angular.copy($scope.appDate);
    function bindDoctorSlots(MinPerCaseval, type) {
        var currenttimewithZero = 0;
        if ($scope.selectedDocObject !== "") {
            $scope.setValue = [];
            $scope.setEndValues = [];
            if (type === "current") {
                var count = 0;
                var hourStartCount = type === "current" ? moment().format("HH") : 0;
                var minutesStartCount = type === "current" ? moment().format("mm") : 0;
                hourStartCount = parseInt(hourStartCount);
                minutesStartCount = parseInt(minutesStartCount);
                for (var i = hourStartCount; i <= 23; i++) {
                    count = 0;
                    var hr = i < 10 ? "0" + i : i;
                    if (parseInt(MinPerCaseval) != 0) {
                        var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
                    }
                    else {
                        var minutesCount = 0;
                    }

                    if (minutesStartCount > 0 && i === hourStartCount) {
                    } else {
                        var endtime = '';
                        endtime = hr + ":" + MinPerCaseval;
                        $scope.setValue.push({ StartTime: hr + ":00", EndTime: endtime });
                        $scope.setEndValues.push({ StartTime: hr + ":00", EndTime: endtime });
                        currenttimewithZero++;
                    }
                    if (minutesStartCount > parseInt(MinPerCaseval)) {
                        minutesStartCount = minutesStartCount - parseInt(MinPerCaseval);
                    } else if (minutesStartCount <= parseInt(MinPerCaseval)) {
                        minutesStartCount = 0;
                        if (currenttimewithZero === 0) {
                            var endtime = '';
                            endtime = hr + ":" + MinPerCaseval;
                            $scope.setValue.push({ StartTime: hr + ":00", EndTime: endtime });
                            $scope.setEndValues.push({ StartTime: hr + ":00", EndTime: endtime });
                            currenttimewithZero++;
                        }
                    }
                    for (var j = 0; j <= minutesCount; j++) {
                        count = count + MinPerCaseval;
                        if (count < 60 && count > minutesStartCount) {
                            var minute = count < 10 ? "0" + count : count;

                            var endtime = '';
                            if ((minute + MinPerCaseval) < 60) {
                                endtime = hr + ":" + (minute + MinPerCaseval);
                            } else if ((minute + MinPerCaseval) === 60) {
                                if (parseInt(hr) < 23) {
                                    if (parseInt(hr) < 10) {
                                        endtime = "0" + (parseInt(hr) + 1) + ":" + "00";
                                    } else {
                                        endtime = (parseInt(hr) + 1) + ":" + "00";
                                    }
                                } else {
                                    endtime = "00" + ":" + "00";
                                }
                            } else {
                                //  endtime = "00" + ":" + "00";
                            }

                            $scope.setValue.push({ StartTime: hr + ':' + minute, EndTime: endtime });
                            $scope.setEndValues.push({ StartTime: hr + ':' + minute, EndTime: endtime });
                        }
                    }
                }
                if ($scope.dateVal) {
                    $scope.patinet_appStarttime = _.where($scope.setValue, { StartTime: moment($scope.dateVal).format("HH:mm") })[0];
                    //$scope.dateVal = '';
                    $scope.slot.patient_appEndTime = $scope.setEndValues[0].EndTime;
                } else {
                    $scope.patinet_appStarttime = $scope.setValue[0];
                    $scope.slot.patient_appEndTime = $scope.setEndValues[0].EndTime;
                }
            } else {
                var count = 0;
                for (var i = 0; i <= 23; i++) {
                    count = 0;
                    var hr = i < 10 ? "0" + i : i;
                    var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
                    var endtime = '';
                    endtime = hr + ":" + MinPerCaseval;
                    $scope.setValue.push({ StartTime: hr + ":00", EndTime: endtime });
                    $scope.setEndValues.push({ StartTime: hr + ":00", EndTime: endtime });

                    for (var j = 0; j <= minutesCount; j++) {
                        count = count + MinPerCaseval;
                        if (count < 60) {
                            var minute = count < 10 ? "0" + count : count;

                            var endtime = '';
                            if ((minute + MinPerCaseval) < 60) {
                                endtime = hr + ":" + (minute + MinPerCaseval);
                            } else if ((minute + MinPerCaseval) === 60) {
                                if (parseInt(hr) < 23) {
                                    if (parseInt(hr) < 10) {
                                        endtime = "0" + (parseInt(hr) + 1) + ":" + "00";
                                    } else {
                                        endtime = (parseInt(hr) + 1) + ":" + "00";
                                    }
                                } else {
                                    endtime = "00" + ":" + "00";
                                }
                            } else {
                                //  endtime = "00" + ":" + "00";
                            }

                            $scope.setValue.push({ StartTime: hr + ':' + minute, EndTime: endtime });
                            $scope.setEndValues.push({ StartTime: hr + ':' + minute, EndTime: endtime });
                        }
                    }
                }
                if ($scope.dateVal) {
                    $scope.patinet_appStarttime = _.where($scope.setValue, { StartTime: moment($scope.dateVal).format("HH:mm") })[0];
                    $scope.patient_appEndTime = $scope.setEndValues[0].EndTime;
                }
            }
            if ($scope.appCondate) {
                if ($scope.BindStartAppTime !== undefined) {
                    if ($scope.setValue[0].StartTime > $scope.BindStartAppTime) {
                        $scope.patinet_appStarttime = null;
                    } else {
                        $scope.FindTime = $filter("filter")($scope.setValue, { "StartTime": $scope.BindStartAppTime }, true);
                        if ($scope.FindTime.length > 0) {
                            $scope.patinet_appStarttime = $scope.FindTime[0];
                        }
                    }
                }

            }
        }

        console.log($scope.setValue);

        angular.forEach($scope.setValue, function (sitem) {
            var date_T = $filter("date")(new Date(), "yyyy-MM-dd");
            var datetime = date_T + "T" + sitem.StartTime;
            sitem.NewStartTime = "";
            sitem.NewStartTime = $filter('date')(datetime, "hh:mm a");
            console.log(sitem.NewStartTime);
        });

        console.log("init called");

        if ($scope.IsComingFrom == 'Doctorcalendar') {




            if ($scope.Doctorcalendarobj.MinPerCaseval === 15) {
                $scope.patinet_consultationTime = '15m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 30) {
                $scope.patinet_consultationTime = '30m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 45) {
                $scope.patinet_consultationTime = '45m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 60) {
                $scope.patinet_consultationTime = '1h';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 75) {
                $scope.patinet_consultationTime = '1:15m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 90) {
                $scope.patinet_consultationTime = '1:30m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 120) {
                $scope.patinet_consultationTime = '2h';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 180) {
                $scope.patinet_consultationTime = '3h';
            }
            var time1 = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
            $scope.patinet_appStarttime.StartTime = time1;
            // $scope.appDate = $filter("date")(new Date(), "MM-dd-yyyy");
            if ($scope.Doctorcalendarobj.GetDate != undefined) {
                $scope.appDate = $filter("date")($scope.Doctorcalendarobj.GetDate, "dd-MMM-yyyy");
            } else {
                $scope.appDate = $filter("date")(new Date(), "MM-dd-yyyy");
            }


        }
        $scope.InvestigationsTimeValue = $scope.setValue || [];
    }

    function bindDoctorRestrictedSolts(selectedDocObject) {

        if (selectedDocObject !== "") {
            $scope.setValue = [];
            var data_param = {
                'DoctorID': selectedDocObject.DoctorID,
                'startDate': $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
                'endDate': $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
                'UserBranchId': selectedDocObject.UserBranchId,
                'HospitalID': $scope.SelectedBranchId
            };
            eHnoteMainAppointmentService.getDoctorAppoitmentInfo(OnGetAppointmentSuccess, OnGetAppointmentError, data_param);
            function OnGetAppointmentSuccess(data) {
                var booked = data;
                $scope.timings = [];
                $scope.minPerCase = 0;
                booked.calendarList = booked.calendarList || [];
                if ($scope.ConsultationType.typename == 'PhysicalConsultation') {
                    if (booked.calendarList.length > 0) {
                        for (var j = 0; j < booked.calendarList.length; j++) {
                            if (booked.calendarList[j].SlotLst !== undefined) {
                                angular.forEach(booked.calendarList[j].SlotLst, function (item) {
                                    angular.forEach(item.SlotLst, function (item1) {
                                        if (item1.Available === 'Y') {
                                            var res = item1.StartTime.split(":");
                                            item1.StartTime = res[0] + ":" + res[1];
                                            $scope.timings.push(item1);
                                        }
                                    });


                                });
                                //for (var k = 0; k < booked.calendarList[j].SlotLst.length; k++) {

                                //      }
                            } else {
                                console.log("abc1");
                                alertify.error("Doctor is not available.Please choose another doctor");

                                $scope.setValue = [];
                                $scope.patinet_appStarttime = "";
                                $scope.EndtimeVAlue = "";
                                return;
                            }
                        }
                        var curdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
                        var referredappointmentdate = $filter('date')(new Date($scope.appDate), "dd-MMMM-yyyy");
                        if (referredappointmentdate === curdate) {
                            var curtime = $filter('date')(new Date(), 'HH:mm');
                            var curSplitTime = curtime.slice(0, 2) + curtime.slice(3, 5);
                            $scope.setValue = $scope.timings;
                            $scope.setFirsrValue = [];
                            for (var i = 0; i < $scope.setValue.length; i++) {
                                if (curSplitTime < $scope.setValue[i].Sequence) {
                                    $scope.setFirsrValue.push($scope.setValue[i]);
                                }
                            }
                            $scope.setValue = $scope.setFirsrValue;

                            $scope.patinet_appStarttime = $scope.setValue[0];
                        } else {
                            $scope.setValue = $scope.timings;
                            $scope.patinet_appStarttime = $scope.setValue[0];
                        }
                    } else {
                        $scope.setValue = [];
                        $scope.patinet_appStarttime = "";
                    }
                }
                else {
                    if (booked.calendarList.length > 0) {
                        for (var j = 0; j < booked.calendarList.length; j++) {
                            if (booked.calendarList[j].TeleSlotLst !== undefined) {
                                angular.forEach(booked.calendarList[j].TeleSlotLst, function (item) {
                                    angular.forEach(item.SlotLst, function (item1) {
                                        if (item1.Available === 'Y') {
                                            var res = item1.StartTime.split(":");
                                            item1.StartTime = res[0] + ":" + res[1];
                                            $scope.timings.push(item1);
                                        }
                                    });


                                });
                                //for (var k = 0; k < booked.calendarList[j].SlotLst.length; k++) {

                                //      }
                            } else {
                                console.log("abc2");
                                alertify.error("Doctor is not available.Please choose another doctor");
                                console.log("bharath1");
                                $scope.setValue = [];
                                $scope.patinet_appStarttime = "";
                                $scope.EndtimeVAlue = "";
                                return;
                            }
                        }
                        var curdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
                        var referredappointmentdate = $filter('date')(new Date($scope.appDate), "dd-MMMM-yyyy");
                        if (referredappointmentdate === curdate) {
                            var curtime = $filter('date')(new Date(), 'HH:mm');
                            var curSplitTime = curtime.slice(0, 2) + curtime.slice(3, 5);
                            $scope.TelesetValue = $scope.timings;
                            $scope.setFirsrValue = [];
                            for (var i = 0; i < $scope.setValue.length; i++) {
                                if (curSplitTime < $scope.setValue[i].Sequence) {
                                    $scope.setFirsrValue.push($scope.setValue[i]);
                                }
                            }
                            $scope.TelesetValue = $scope.setFirsrValue;

                            $scope.patinet_appStarttime = $scope.TelesetValue[0];
                        } else {
                            $scope.TelesetValue = $scope.timings;
                            $scope.patinet_appStarttime = $scope.TelesetValue[0];
                        }
                    } else {
                        $scope.TelesetValue = [];
                        $scope.patinet_appStarttime = "";
                    }
                }

            }
            function OnGetAppointmentError(data) {
                eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
            }
        }
    }

    function getCompletedSlot(starttime, endtime) {
        var filtervalue = $filter("filter")($scope.setValue, { "StartTime": starttime }, true) || [];
        if (filtervalue.length == 0) {
            var slotObj = {
                "StartTime": starttime,
                "EndTime": endtime,
                "TokenNumber": 0,
                "Available": "Y"
            }
            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");
            var t = $filter("date")(new Date(), "yyyy-MM-dd");
            var datetime = t + "T" + slotObj.StartTime;
            slotObj.NewStartTime = "";
            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
            $scope.setValue.unshift(slotObj);
        }
    }
    $scope.GetVisitReasonforcalender = function () {
        var appointmentDate = "";
        var SlotTime = "";
        SlotTime = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
        if ($scope.appDate == 'Invalid date') {
            if ($scope.IsComingFrom == 'Doctorcalendar') {
                if ($scope.Doctorcalendarobj.GetDate !== 'Invalid date' && $scope.Doctorcalendarobj.GetDate !== '') {
                    appointmentDate = $filter('date')(new Date($scope.Doctorcalendarobj.GetDate), "yyyy-MM-dd");
                } else {
                    appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                }
            } else {
                appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
        } else {
            appointmentDate = $filter('date')($scope.appDate, "yyyy-MM-dd");
        }
        var inputParams = {
            "Date": appointmentDate,
            "SlotTime": SlotTime,
            "UserScheduleId": $scope.isAppValiddities.UserScheduleId || 0,
            "DoctorId": $scope.selectedDocObject.selectedPerson.DoctorID,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        eHnoteDiagnosisDataServices.getParticualrTimeSlotDetailsById(inputParams).then(function (resp1) {
            console.log(resp1);
            if (resp1.data.Status === "Success") {
                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.isValidOptionSelected = true;
                $scope.isAppValiddities.VisitTypes = resp1.data.rows || [];
                if ($scope.isAppValiddities.VisitTypes.length > 0) {
                    $scope.defaultDoctorVisit = $scope.isAppValiddities.VisitTypes[0];
                    $scope.othervisitrsn = $scope.defaultDoctorVisit.VisitReasonName || "";
                    $scope.visitrsnId = $scope.defaultDoctorVisit.VisitReasonId || 0;
                    $scope.visitremarks = $scope.defaultDoctorVisit.VisitRemarks || "";
                    $scope.appointment_type.AppointmentTypeId = $scope.defaultDoctorVisit.VisitTypeId.toString();
                    Doctorcalendar($scope.MaxSlotsAppointmentCheckArray);
                } else {
                    Doctorcalendar($scope.MaxSlotsAppointmentCheckArray);
                }
            }
        });
    }

    function newreStructureDoctorSelectedSlots(resp) {


        $scope.isAppValiddities.UserScheduleId = 0;
        $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = false;
        $scope.MaxSlotsAppointmentCheckArray = angular.copy(resp);
        if (resp.UserScheduleSlots.length > 0) {               // && $scope.IsNoPatienthere == true
            var consul_date = "";
            if ($scope.pagename === "reschedule") {
                var d = $filter("date")($scope.dateVal, "dd-MMM-yyyy");
                consul_date = moment(d).format("MM-DD-YYYY");
            }
            var Appt_typeid = "";
            if ($scope.appointmentInfo != undefined) {
                if ($scope.appointmentInfo.DoctorVisitRsnID != undefined) {
                    Appt_typeid = $scope.appointmentInfo.DoctorVisitRsnID.toString() || "";
                }
            }
            $scope.isAppValiddities.UserScheduleId = resp.UserScheduleSlots[0].UserScheduleId;

            if (($scope.pagename === "book" && $scope.IsNoPatienthere == true) || ($scope.pagename === "reschedule" && selectedDoctorinAppList.DoctorID != $scope.selectedDocObject.selectedPerson.DoctorID) || (consul_date != $scope.appDate) ||
                ($scope.pagename === "reschedule" && $scope.appointment_type.AppointmentTypeId !== Appt_typeid)) {
                var apptTypeId = parseInt($scope.appointment_type.AppointmentTypeId);
                resp.UserScheduleSlots[0].NewAppointmentMaxSlots = resp.UserScheduleSlots[0].NewAppointmentMaxSlots || 0;
                resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || 0;
                resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || 0;
                resp.UserScheduleSlots[0].ASCAppointmentMaxSlots = resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || 0;
                if (apptTypeId == 1) {
                    if (resp.UserScheduleSlots[0].NewAppointmentMaxSlots != 0) {
                        if (resp.DoctorNewAppointmentCount > resp.UserScheduleSlots[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserScheduleSlots[0].NewAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_consultationTime = resp.UserScheduleSlots[0].MinPerCase + 'm' || "";
                            // return false;
                        }
                    }
                }
                else if (apptTypeId == 2) {
                    if (resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots != 0) {
                        //if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                        if (resp.DoctorClinicFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorClinicFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum Clinic followup appointments are reached for this doctor. Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_consultationTime = resp.UserScheduleSlots[0].MinPerCase + 'm' || "";
                            // return false;
                        }
                    }
                }
                else if (apptTypeId == 3) {
                    if (resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots != 0) {
                        //if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                        if (resp.DoctorPostOpFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorPostOpFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum Post-Op followup appointments are reached for this doctor. Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_consultationTime = resp.UserScheduleSlots[0].MinPerCase + 'm' || "";
                            // return false;
                        }
                    }
                }
                else if (apptTypeId == 4 || apptTypeId == 14) {
                    if (resp.UserScheduleSlots[0].ASCAppointmentMaxSlots != 0) {
                        if (resp.DoctorAscAppointmentCount > resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserScheduleSlots[0].ASCAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_consultationTime = resp.UserScheduleSlots[0].MinPerCase + 'm' || "";
                            // return false;
                        }
                    }
                }
            }
        }


        if (resp.UserScheduleSlots.length > 0) {

            $scope.timeslots = [];
            $scope.availableSlots = [];
            var GivenDate = resp.UserScheduleSlots[0].SlotDate;
            // var CurrentDate = new Date();
            var CurrentDate = $filter('date')(new Date(), 'MM-dd-yyyy');
            // GivenDate = new Date(GivenDate);
            GivenDate = $filter('date')(GivenDate, 'MM-dd-yyyy');
            $scope.iscurrentDate = false;


            if (GivenDate > CurrentDate) {
                $scope.iscurrentDate = false;
            } else {
                $scope.iscurrentDate = true;
            }
            $scope.time = $filter('date')(new Date(), 'HH:mm');
            console.log($scope.time);
            var NormalslotMinPerCase = "";

            if ($scope.ConsultationType.typename === 'PhysicalConsultation') {

                angular.forEach(resp.UserScheduleSlots, function (item) {
                    item.ScheduleVisitTypeDetails = item.ScheduleVisitTypeDetails || [];
                    $scope.Breaktimeslots = [];
                    if (item.UserDayBreakSlots.length > 0) {
                        angular.forEach(item.UserDayBreakSlots, function (Bitem) {
                            var arr = Bitem.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);
                            var arr2 = Bitem.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);



                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "Available": "Y"
                                }
                                token++;
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                                console.log(slotObj.NewStartTime + "" + datetime);
                                $scope.Breaktimeslots.push(slotObj);


                            }
                        });
                    }
                    if (item.ScheduleVisitTypeDetails.length > 0) {

                        var arr = item.StartTime.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);
                        var arr2 = item.EndTime.split(':')
                        var ehour = $.trim(arr2[0]);
                        var emin = $.trim(arr2[1]);
                        var startingTime = moment().hours(shour).minutes(smin);
                        var endingTime = moment().hours(ehour).minutes(emin);

                        var currentStartTime = angular.copy(startingTime);
                        var token = 1;
                        while (currentStartTime < endingTime) {

                            var slotObj = {
                                "StartTime": currentStartTime.format("HH:mm"),
                                "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                "TokenNumber": token,
                                "Available": "N"
                            }
                            token++;
                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                            slotObj.NewStartTime = "";
                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                            console.log(slotObj.NewStartTime + "" + datetime);
                            $scope.timeslots.push(slotObj);

                        }


                        if ($scope.iscurrentDate === true) {
                            $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                        }


                        console.log($scope.timeslots);

                        //angular.forEach($scope.timeslots, function (mtitem) {
                        //     var ApptTesTypeId = parseInt($scope.appointment_type.AppointmentTypeId);
                        //    if (ApptTesTypeId == 1 || ApptTesTypeId == 2 || ApptTesTypeId == 3 || ApptTesTypeId == 4) {
                        //        var list1 = $filter("filter")(item.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == ApptTesTypeId });
                        //        if (list1.length  > 0) {
                        //            var filteredArray = $filter('filter')(list1, { "StartTime": mtitem.StartTime }, true);
                        //            if (filteredArray.length > 0) {
                        //                mtitem.Available = "Y";
                        //            }
                        //        }
                        //    }
                        //});


                        //angular.forEach(list1, function (Aitem) {
                        //    if (Aitem.VisitTypeId == ApptTesTypeId) {
                        //        var currentStartTime = angular.copy(Aitem.StartTime);
                        //        angular.forEach($scope.timeslots, function (titem) {
                        //            if (titem.StartTime === currentStartTime) {
                        //                titem.Available = "Y";
                        //            }
                        //        });
                        //    }
                        //});


                        //Enabled by Durga




                        var ApptTesTypeId = parseInt($scope.appointment_type.AppointmentTypeId);
                        if (ApptTesTypeId == 1 || ApptTesTypeId == 2 || ApptTesTypeId == 3 || ApptTesTypeId == 4) {

                            var list1 = $filter("filter")(item.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == ApptTesTypeId });
                            if (list1.length > 0) {
                                item.IsAdvancedSchedule = item.IsAdvancedSchedule || false;

                                console.log(item.IsAdvancedSchedule + "__item.IsAdvancedSchedule");

                                if (item.IsAdvancedSchedule) {



                                    angular.forEach(list1, function (Aitem) {
                                        if (Aitem.VisitTypeId == ApptTesTypeId) {
                                            var currentStartTime = angular.copy(Aitem.StartTime);
                                            var currentEndTime = angular.copy(Aitem.EndTime);
                                            var token = 1;

                                            var slotObj = {
                                                "StartTime": currentStartTime,
                                                "EndTime": currentEndTime,
                                                "TokenNumber": token,
                                                "Available": "Y"
                                            }
                                            token++;
                                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                            slotObj.NewStartTime = "";
                                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                            $scope.availableSlots.push(slotObj);

                                            if ($scope.iscurrentDate === true) {
                                                $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                            }
                                        }
                                    });
                                }
                                else {




                                    angular.forEach(list1, function (Aitem) {
                                        if (Aitem.VisitTypeId == ApptTesTypeId) {
                                            var arr = Aitem.StartTime.split(':');
                                            var shour = $.trim(arr[0]);
                                            var smin = $.trim(arr[1]);


                                            var arr2 = Aitem.EndTime.split(':')
                                            var ehour = $.trim(arr2[0]);
                                            var emin = $.trim(arr2[1]);
                                            var startingTime = moment().hours(shour).minutes(smin);
                                            var endingTime = moment().hours(ehour).minutes(emin);



                                            var currentStartTime = angular.copy(startingTime);
                                            var token = 1;
                                            while (currentStartTime < endingTime) {

                                                var slotObj = {
                                                    "StartTime": currentStartTime.format("HH:mm"),
                                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                                    "TokenNumber": token,
                                                    "Available": "Y"
                                                }
                                                token++;
                                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                                slotObj.NewStartTime = "";
                                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                                $scope.availableSlots.push(slotObj);


                                            }


                                            if ($scope.iscurrentDate === true) {
                                                $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                            }
                                        }
                                    });
                                }

                            }
                            else {
                                var arr = item.StartTime.split(':');
                                var shour = $.trim(arr[0]);
                                var smin = $.trim(arr[1]);

                                var arr2 = item.EndTime.split(':')
                                var ehour = $.trim(arr2[0]);
                                var emin = $.trim(arr2[1]);
                                var startingTime = moment().hours(shour).minutes(smin);
                                var endingTime = moment().hours(ehour).minutes(emin);

                                var currentStartTime = angular.copy(startingTime);
                                var token = 1;
                                while (currentStartTime < endingTime) {

                                    var slotObj = {
                                        "StartTime": currentStartTime.format("HH:mm"),
                                        "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                        "TokenNumber": token,
                                        "Available": "Y"
                                    }
                                    token++;
                                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                    var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                    slotObj.NewStartTime = "";
                                    slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                    $scope.availableSlots.push(slotObj);


                                }
                                //if ($scope.availableSlots.length > 0 && $scope.Breaktimeslots.length > 0) {
                                //    angular.forEach($scope.Breaktimeslots, function (titem) {
                                //        angular.forEach($scope.timeslots, function (bitem, index) {
                                //            if (titem.StartTime == bitem.StartTime) {
                                //                $scope.availableSlots.splice(index, 1);
                                //            }
                                //        });
                                //    });
                                //}
                                if ($scope.iscurrentDate === true) {
                                    $scope.availableSlots = $filter("filter")($scope.availableSlots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                }
                            }

                        }
                        else {
                            console.log("ccffgg");
                            var arr = item.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);

                            var arr2 = item.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);

                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "Available": "Y"
                                }
                                token++;
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                $scope.timeslots.push(slotObj);
                            }

                            if ($scope.iscurrentDate === true) {
                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                            }

                        }

                        //if ($scope.availableSlots.length > 0 && $scope.Breaktimeslots.length > 0) {
                        //    angular.forEach($scope.Breaktimeslots, function (titem) {
                        //        angular.forEach($scope.availableSlots, function (bitem, index) {
                        //            if (titem.StartTime == bitem.StartTime) {
                        //                $scope.availableSlots.splice(index, 1);
                        //            }
                        //        });
                        //    });
                        //}

                    }
                    else {
                        var arr = item.StartTime.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);
                        var arr2 = item.EndTime.split(':')
                        var ehour = $.trim(arr2[0]);
                        var emin = $.trim(arr2[1]);
                        var startingTime = moment().hours(shour).minutes(smin);
                        var endingTime = moment().hours(ehour).minutes(emin);

                        var currentStartTime = angular.copy(startingTime);
                        var token = 1;
                        while (currentStartTime < endingTime) {

                            var slotObj = {
                                "StartTime": currentStartTime.format("HH:mm"),
                                "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                "TokenNumber": token,
                                "Available": "Y"
                            }
                            token++;
                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                            slotObj.NewStartTime = "";
                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                            console.log(slotObj.NewStartTime + "" + datetime);
                            $scope.timeslots.push(slotObj);


                        }

                        if ($scope.timeslots.length > 0 && $scope.Breaktimeslots.length > 0) {
                            angular.forEach($scope.Breaktimeslots, function (titem) {
                                angular.forEach($scope.timeslots, function (bitem, index) {
                                    if (titem.StartTime == bitem.StartTime) {
                                        $scope.timeslots.splice(index, 1);
                                    }
                                });
                            });
                        }
                        if ($scope.iscurrentDate === true) {
                            $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                        }
                    }

                });
                var Currenttime = '';
                if ($scope.iscurrentDate === true) {
                    Currenttime = $scope.time;
                } else {
                    if ($scope.timeslots.length > 0) {
                        Currenttime = $scope.timeslots[0].StartTime;
                    }

                }
                //angular.forEach(resp.UserScheduleSlots, function (item) {
                //    if (item.ScheduleVisitTypeDetails.length > 0) {
                //        angular.forEach(item.ScheduleVisitTypeDetails, function (kitem) {
                //            let startTime = kitem.StartTime.replace(":", "");
                //            let endTime = kitem.EndTime.replace(":", "");
                //            let startTime1 = Currenttime;

                //            startTime1 = startTime1.replace(":", "");

                //            if (startTime1 >= startTime && startTime1 < endTime) {
                //                $scope.appointment_type.AppointmentTypeId = kitem.VisitTypeId.toString();
                //            }
                //        });
                //    }
                //});

                if (resp.UserScheduleSlots.length > 0) {
                    NormalslotMinPerCase = resp.UserScheduleSlots[0].MinPerCase || "";
                }


            }

            var dummayslots = [];
            var dummayNormalSlots = angular.copy(resp.NormalSlots) || [];
            if ($scope.iscurrentDate === true) {
                dummayNormalSlots = $filter("filter")(dummayNormalSlots, function (kitem, index) { return kitem.StartTime > $scope.time }) || [];
            }
            if (NormalslotMinPerCase !== '') {
                if (dummayNormalSlots.length > 0) {
                    angular.forEach(dummayNormalSlots, function (nitem) {
                        var narr = nitem.StartTime.split(':');
                        var nshour = $.trim(narr[0]);
                        var nsec = "00";
                        var nsmin = $.trim(narr[1]);

                        var narr2 = nitem.EndTime.split(':')
                        var nehour = $.trim(narr2[0]);
                        var nemin = $.trim(narr2[1]);
                        var nesec = "00";

                        var nstarting = moment().hours(nshour).minutes(nsmin).seconds(nsec);
                        var checkstartTime = moment().hours(nshour).minutes(nsmin).seconds(nsec);
                        var nending = moment().hours(nehour).minutes(nemin).seconds(nesec);

                        var StartTime = nstarting.format("HH:mm");
                        var EndTime = checkstartTime.add(NormalslotMinPerCase, "minute").format("HH:mm");

                        if ((nitem.StartTime == StartTime) && (nitem.EndTime == EndTime)) {

                        } else {
                            var Count = 1;
                            nstarting.add(NormalslotMinPerCase, "minute").format("HH:mm");

                            while (nstarting < nending) {
                                if (nstarting.format("HH:mm") != nending.format("HH:mm")) {
                                    var obj = {
                                        "StartTime": nstarting.format("HH:mm"),
                                        "EndTime": nstarting.add(NormalslotMinPerCase, "minute").format("HH:mm"),
                                        "Count": Count
                                    }
                                    Count++;
                                    dummayslots.push(obj);
                                } else {
                                    nstarting.add(NormalslotMinPerCase, "minute").format("HH:mm");
                                }
                            }

                        }

                    });
                }
            }

            if (dummayslots.length > 0) {
                angular.forEach(dummayslots, function (ditem) {
                    resp.NormalSlots.push(ditem);
                });
            }


            //angular.forEach($scope.timeslots, function (item) {
            //    angular.forEach(resp.NormalSlots, function (item1) {
            //        if (item.StartTime == item1.StartTime) {
            //            item.Available = 'N';
            //        }
            //    });
            //});


            $scope.setValue = [];
            $scope.setEndValues = [];
            if ($scope.timeslots.length > 0) {
                angular.forEach($scope.timeslots, function (item1) {

                    var filteredArray = $filter('filter')($scope.availableSlots, { "StartTime": item1.StartTime }, true);
                    if (filteredArray.length > 0) {
                        item1.Available = "Y";
                    }

                    //  if (item1.Available === 'Y') {
                    var res = item1.StartTime.split(":");
                    item1.StartTime = res[0] + ":" + res[1];
                    $scope.setValue.push(item1);
                    $scope.setEndValues.push(item1);
                    // }
                });


                if ($scope.IsComingFrom == 'Doctorcalendar') {

                }
                else {
                    //$scope.slot.patinet_appStarttime = $scope.setValue[0] || "";
                    $scope.slot.patinet_appStarttime = "";
                    if ($scope.slot.patinet_appStarttime.StartTime != "" && $scope.slot.patinet_appStarttime.StartTime != undefined) {
                        var Index2 = $scope.setValue.findIndex(record => record.StartTime === $scope.slot.patinet_appStarttime.StartTime);
                        if (Index2 > -1) {
                            $scope.slot.patinet_appStarttime = $scope.setValue[Index2];
                        }
                    }

                }
                // $scope.slot.patient_appEndTime = $scope.setEndValues[0].EndTime;


                if ($scope.pagename === "reschedule") {
                    //$scope.slot.patinet_appStarttime = "";
                    $scope.slot.patient_appEndTime = "";

                    $scope.RescheduleSlotsObj = GetRescheduleSlotsObj();
                    if ($scope.IsReschduleSlotIND === false) {
                        $scope.RescheduleSlotsObj.IsStartandEndInd = true;
                        /*$scope.appointment_type.AppointmentTypeId = $scope.appointmentInfo.AppointmentTypeId.toString();*/
                        if ($scope.appointmentInfo.AppointmentTypeId !== undefined) {
                            $scope.appointment_type.AppointmentTypeId = $scope.appointmentInfo.AppointmentTypeId.toString();
                        } else {
                            $scope.appointment_type.AppointmentTypeId = "1";
                        }
                        if ($scope.IsComingFrom !== 'Doctorcalendar') {
                            var arr = $scope.appointmentInfo.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);
                            var arr2 = $scope.appointmentInfo.EndTime.split(':')
                            var endHour = $.trim(arr2[0]);
                            var endmin = $.trim(arr2[1]);

                            var Date_1 = $filter('date')(new Date(), "yyyy-MM-dd");
                            var DateTime_1 = Date_1 + "T" + shour + ":" + smin;

                            // $scope.RescheduleSlotsObj.StartTimeSlot = shour + ":" + smin || '';
                            $scope.RescheduleSlotsObj.originalSlot = shour + ":" + smin || '';
                            $scope.RescheduleSlotsObj.StartTimeSlot = $filter('date')(DateTime_1, "hh:mm a");
                            $scope.AppointmentRescheduleObj.StartTime = $filter('date')(DateTime_1, "hh:mm a");
                            $scope.RescheduleSlotsObj.EndTimeSlot = endHour + ":" + endmin || '';


                            var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                            var startDate1 = currentDt + " " + $scope.appointmentInfo.StartTime;
                            // var endDate1 = currentDt + " " + $scope.appointmentInfo.EndTime;
                            var originalend = $scope.appointmentInfo.EndTime == "00:00:00" ? "24:00" : $scope.appointmentInfo.EndTime
                            var endDate1 = currentDt + " " + originalend;
                            var starttime = new Date(startDate1);
                            var endtime = new Date(endDate1);
                            function getMinutesBetweenDates(startDate, endDate) {
                                var diff = endDate.getTime() - startDate.getTime();
                                return (diff / 60000);
                            }
                            var minutes = getMinutesBetweenDates(starttime, endtime);
                            $scope.patinet_consultationTime = minutes + "m";
                            $scope.RescheduleSlotsObj.DurationTime = minutes;

                            $scope.IsReschduleSlotIND = true;

                            getCompletedSlot($scope.RescheduleSlotsObj.originalSlot, $scope.RescheduleSlotsObj.EndTimeSlot);
                        }
                    } else {
                        $scope.patinet_consultationTime = $scope.selectedDocObject.selectedPerson.MinPerCase + 'm';
                    }
                }
            }
            else {

                //alertify.error("Doctor is not available.Please choose another doctor");
                if ($scope.Doctorcalendarobj.OutOfBusinessTime == undefined) {
                    if ($scope.Doctorcalendarobj == "") {
                        $scope.Doctorcalendarobj = { "OutOfBusinessTime": false };
                    } else {
                        $scope.Doctorcalendarobj.OutOfBusinessTime = false;
                    }
                }
                $scope.Doctorcalendarobj.OutOfBusinessTime = $scope.Doctorcalendarobj.OutOfBusinessTime || false;

                console.log($scope.IsNoPatienthere, "reload changes");
                if ($scope.IsNoPatienthere && $scope.Doctorcalendarobj.OutOfBusinessTime == false && $scope.pagename !== "reschedule") {
                    alertify.error("Doctor is not available.Please choose another doctor");
                } else if ($scope.IsNoPatienthere && $scope.Doctorcalendarobj.OutOfBusinessTime == false && $scope.pagename === "reschedule" && $scope.IsApptTypeChangeEvent) {
                    alertify.error("Doctor is not available.Please choose another doctor");
                }
                $scope.IsApptTypeChangeEvent = false;
                $scope.setValue = [];
                $scope.slot.patinet_appStarttime = "";
                $scope.EndtimeVAlue = "";
                $scope.slot.patient_appEndTime = "";
                if ($scope.IsComingFrom == 'Doctorcalendar' && $scope.Doctorcalendarobj.OutOfBusinessTime == true && $scope.pagename != "reschedule") {
                    Doctorcalendar(resp);
                }
                if ($scope.IsComingFrom == 'Doctorcalendar' && $scope.Doctorcalendarobj.OutOfBusinessTime == false && $scope.pagename != "reschedule") {
                    Doctorcalendar(resp);
                }
                if ($scope.IsComingFrom == 'Doctorcalendar' && $scope.pagename === "reschedule") {
                    Doctorcalendar(resp);
                }

                if ($scope.pagename === "reschedule" && $scope.IsComingFrom !== 'Doctorcalendar') {
                    $scope.slot.patinet_appStarttime = "";
                    $scope.slot.patient_appEndTime = "";

                    $scope.RescheduleSlotsObj = GetRescheduleSlotsObj();
                    if ($scope.IsReschduleSlotIND === false) {
                        $scope.RescheduleSlotsObj.IsStartandEndInd = true;
                        var arr = $scope.appointmentInfo.StartTime.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);
                        var arr2 = $scope.appointmentInfo.EndTime.split(':')
                        var endHour = $.trim(arr2[0]);
                        var endmin = $.trim(arr2[1]);
                        var Date_1 = $filter('date')(new Date(), "yyyy-MM-dd");
                        var DateTime_1 = Date_1 + "T" + shour + ":" + smin;
                        //  $scope.RescheduleSlotsObj.StartTimeSlot = shour + ":" + smin || '';
                        $scope.RescheduleSlotsObj.originalSlot = shour + ":" + smin || '';
                        $scope.RescheduleSlotsObj.StartTimeSlot = $filter('date')(DateTime_1, "hh:mm a");
                        $scope.AppointmentRescheduleObj.StartTime = $filter('date')(DateTime_1, "hh:mm a");
                        $scope.RescheduleSlotsObj.EndTimeSlot = endHour + ":" + endmin || '';


                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                        var startDate1 = currentDt + " " + $scope.appointmentInfo.StartTime;
                        var originalend = $scope.appointmentInfo.EndTime == "00:00:00" ? "24:00" : $scope.appointmentInfo.EndTime
                        var endDate1 = currentDt + " " + originalend;
                        var starttime = new Date(startDate1);
                        var endtime = new Date(endDate1);
                        function getMinutesBetweenDates(startDate, endDate) {
                            var diff = endDate.getTime() - startDate.getTime();
                            return (diff / 60000);
                        }
                        var minutes = getMinutesBetweenDates(starttime, endtime);
                        $scope.patinet_consultationTime = minutes + "m";
                        $scope.RescheduleSlotsObj.DurationTime = minutes;

                        $scope.IsReschduleSlotIND = true;
                        getCompletedSlot($scope.RescheduleSlotsObj.originalSlot, $scope.RescheduleSlotsObj.EndTimeSlot);
                    } else {
                        $scope.patinet_consultationTime = $scope.selectedDocObject.selectedPerson.MinPerCase + 'm';
                    }
                }

                return;
            }

            console.log($scope.setValue);
            console.log("setvalue");




            if ($scope.IsComingFrom == 'Doctorcalendar') {
                Doctorcalendar(resp);
            }

        }
        else {
            if ($scope.IsNoPatienthere == true) {
                // alertify.error("Doctor is on Leave.Please choose another doctor");
                alertify.error("Doctor is not available.Please choose another doctor");
            }
            $scope.setValue = [];
            $scope.slot.patinet_appStarttime = "";
            $scope.EndtimeVAlue = "";
            $scope.slot.patient_appEndTime = "";
            $scope.patinet_consultationTime = "";
            return false;
        }
    }

    function Doctorcalendar(resp) {
        if ($scope.IsComingFrom == 'Doctorcalendar') {
            $scope.timeslots = [];
            if (resp.UserScheduleSlots.length > 0) {
                $scope.UserScheduleSlots = angular.copy(resp.UserScheduleSlots) || [];
                angular.forEach(resp.UserScheduleSlots, function (item) {
                    item.ScheduleVisitTypeDetails = item.ScheduleVisitTypeDetails || [];
                    $scope.Breaktimeslots = [];
                    if (item.UserDayBreakSlots.length > 0) {
                        angular.forEach(item.UserDayBreakSlots, function (Bitem) {
                            var arr = Bitem.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);
                            var arr2 = Bitem.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);



                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "Available": "Y"
                                }
                                token++;
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                                console.log(slotObj.NewStartTime + "" + datetime);
                                $scope.Breaktimeslots.push(slotObj);


                            }
                        });
                    }
                    if (item.ScheduleVisitTypeDetails.length > 0) {

                        /* var arr = item.StartTime.split(':');
                         var shour = $.trim(arr[0]);
                         var smin = $.trim(arr[1]);
                         var arr2 = item.EndTime.split(':')
                         var ehour = $.trim(arr2[0]);
                         var emin = $.trim(arr2[1]);
                         var startingTime = moment().hours(shour).minutes(smin);
                         var endingTime = moment().hours(ehour).minutes(emin);

                         var currentStartTime = angular.copy(startingTime);
                         var token = 1;
                         while (currentStartTime < endingTime) {

                             var slotObj = {
                                 "StartTime": currentStartTime.format("HH:mm"),
                                 "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                 "TokenNumber": token,
                                 "Available": "Y"
                             }
                             token++;
                             slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                             slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                             var datetime = item.SlotDate + "T" + slotObj.StartTime;
                             slotObj.NewStartTime = "";
                             slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                             console.log(slotObj.NewStartTime + "" + datetime);
                             $scope.timeslots.push(slotObj);

                         }

                         if ($scope.iscurrentDate === true) {
                             $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                         }*/

                        var ApptTesTypeId = parseInt($scope.appointment_type.AppointmentTypeId);
                        if (ApptTesTypeId == 1 || ApptTesTypeId == 2 || ApptTesTypeId == 3 || ApptTesTypeId == 4) {

                            var list1 = $filter("filter")(item.ScheduleVisitTypeDetails, function (kitem, index) { return kitem.VisitTypeId == ApptTesTypeId });
                            if (list1.length > 0) {
                                item.IsAdvancedSchedule = item.IsAdvancedSchedule || false;
                                if (item.IsAdvancedSchedule) {
                                    angular.forEach(list1, function (Aitem) {
                                        if (Aitem.VisitTypeId == ApptTesTypeId) {
                                            var currentStartTime = angular.copy(Aitem.StartTime);
                                            var currentEndTime = angular.copy(Aitem.EndTime);
                                            var token = 1;

                                            var slotObj = {
                                                "StartTime": currentStartTime,
                                                "EndTime": currentEndTime,
                                                "TokenNumber": token,
                                                "Available": "Y"
                                            }
                                            token++;
                                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                            slotObj.NewStartTime = "";
                                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                            $scope.timeslots.push(slotObj);

                                            if ($scope.iscurrentDate === true) {
                                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                            }
                                        }
                                    });
                                }
                                else {
                                    angular.forEach(list1, function (Aitem) {
                                        if (Aitem.VisitTypeId == ApptTesTypeId) {
                                            var arr = Aitem.StartTime.split(':');
                                            var shour = $.trim(arr[0]);
                                            var smin = $.trim(arr[1]);


                                            var arr2 = Aitem.EndTime.split(':')
                                            var ehour = $.trim(arr2[0]);
                                            var emin = $.trim(arr2[1]);
                                            var startingTime = moment().hours(shour).minutes(smin);
                                            var endingTime = moment().hours(ehour).minutes(emin);



                                            var currentStartTime = angular.copy(startingTime);
                                            var token = 1;
                                            while (currentStartTime < endingTime) {

                                                var slotObj = {
                                                    "StartTime": currentStartTime.format("HH:mm"),
                                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                                    "TokenNumber": token,
                                                    "Available": "Y"
                                                }
                                                token++;
                                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                                slotObj.NewStartTime = "";
                                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                                $scope.timeslots.push(slotObj);


                                            }


                                            if ($scope.iscurrentDate === true) {
                                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                            }
                                        }
                                    });
                                }

                            }
                            else {
                                var arr = item.StartTime.split(':');
                                var shour = $.trim(arr[0]);
                                var smin = $.trim(arr[1]);

                                var arr2 = item.EndTime.split(':')
                                var ehour = $.trim(arr2[0]);
                                var emin = $.trim(arr2[1]);
                                var startingTime = moment().hours(shour).minutes(smin);
                                var endingTime = moment().hours(ehour).minutes(emin);

                                var currentStartTime = angular.copy(startingTime);
                                var token = 1;
                                while (currentStartTime < endingTime) {

                                    var slotObj = {
                                        "StartTime": currentStartTime.format("HH:mm"),
                                        "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                        "TokenNumber": token,
                                        "Available": "Y"
                                    }
                                    token++;
                                    slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                    slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                    var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                    slotObj.NewStartTime = "";
                                    slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                    $scope.timeslots.push(slotObj);


                                }
                                if ($scope.timeslots.length > 0 && $scope.Breaktimeslots.length > 0) {
                                    angular.forEach($scope.Breaktimeslots, function (titem) {
                                        angular.forEach($scope.timeslots, function (bitem, index) {
                                            if (titem.StartTime == bitem.StartTime) {
                                                $scope.timeslots.splice(index, 1);
                                            }
                                        });
                                    });
                                }
                                if ($scope.iscurrentDate === true) {
                                    $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                }
                            }

                        }
                        else {
                            var arr = item.StartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);

                            var arr2 = item.EndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);

                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "Available": "Y"
                                }
                                token++;
                                slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                                slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                                var datetime = item.SlotDate + "T" + slotObj.StartTime;
                                slotObj.NewStartTime = "";
                                slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");

                                $scope.timeslots.push(slotObj);
                            }

                            if ($scope.iscurrentDate === true) {
                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                            }

                        }

                        if ($scope.timeslots.length > 0 && $scope.Breaktimeslots.length > 0) {
                            angular.forEach($scope.Breaktimeslots, function (titem) {
                                angular.forEach($scope.timeslots, function (bitem, index) {
                                    if (titem.StartTime == bitem.StartTime) {
                                        $scope.timeslots.splice(index, 1);
                                    }
                                });
                            });
                        }
                    }
                    else {
                        var arr = item.StartTime.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);
                        var arr2 = item.EndTime.split(':')
                        var ehour = $.trim(arr2[0]);
                        var emin = $.trim(arr2[1]);
                        var startingTime = moment().hours(shour).minutes(smin);
                        var endingTime = moment().hours(ehour).minutes(emin);



                        var currentStartTime = angular.copy(startingTime);
                        var token = 1;
                        while (currentStartTime < endingTime) {

                            var slotObj = {
                                "StartTime": currentStartTime.format("HH:mm"),
                                "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                "TokenNumber": token,
                                "Available": "Y"
                            }
                            token++;
                            slotObj.seqStartTime = slotObj.StartTime.replace(":", "");
                            slotObj.seqEndTime = slotObj.EndTime.replace(":", "");

                            var datetime = item.SlotDate + "T" + slotObj.StartTime;
                            slotObj.NewStartTime = "";
                            slotObj.NewStartTime = $filter('date')(datetime, "hh:mm a");
                            console.log(slotObj.NewStartTime + "" + datetime);
                            $scope.timeslots.push(slotObj);


                        }

                        if ($scope.timeslots.length > 0 && $scope.Breaktimeslots.length > 0) {
                            angular.forEach($scope.Breaktimeslots, function (titem) {
                                angular.forEach($scope.timeslots, function (bitem, index) {
                                    if (titem.StartTime == bitem.StartTime) {
                                        $scope.timeslots.splice(index, 1);
                                    }
                                });
                            });
                        }
                        if ($scope.iscurrentDate === true) {
                            $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                        }
                    }

                });
                var Currenttime = '';
                if ($scope.iscurrentDate === true) {
                    Currenttime = $scope.time;
                } else {
                    if ($scope.timeslots.length > 0) {
                        Currenttime = $scope.timeslots[0].StartTime;
                    }

                }
                //angular.forEach(resp.UserScheduleSlots, function (item) {
                //    if (item.ScheduleVisitTypeDetails.length > 0) {
                //        angular.forEach(item.ScheduleVisitTypeDetails, function (kitem) {
                //            let startTime = kitem.StartTime.replace(":", "");
                //            let endTime = kitem.EndTime.replace(":", "");
                //            let startTime1 = Currenttime;

                //            startTime1 = startTime1.replace(":", "");

                //            if (startTime1 >= startTime && startTime1 < endTime) {
                //                $scope.appointment_type.AppointmentTypeId = kitem.VisitTypeId.toString();
                //            }
                //        });
                //    }
                //});

            }

            $scope.setValue = [];

            if ($scope.timeslots.length > 0) {
                angular.forEach($scope.timeslots, function (item1) {
                    if (item1.Available === 'Y') {
                        var res = item1.StartTime.split(":");
                        item1.StartTime = res[0] + ":" + res[1];
                        $scope.setValue.push(item1);
                    }
                });
                $scope.slot.patinet_appStarttime = $scope.setValue[0];
            }

            console.log($scope.setValue);
            console.log("setvalue");

            if ($scope.Doctorcalendarobj.MinPerCaseval === 15) {
                $scope.patinet_consultationTime = '15m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 30) {
                $scope.patinet_consultationTime = '30m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 45) {
                $scope.patinet_consultationTime = '45m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 60) {
                $scope.patinet_consultationTime = '1h';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 75) {
                $scope.patinet_consultationTime = '1:15m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 90) {
                $scope.patinet_consultationTime = '1:30m';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 120) {
                $scope.patinet_consultationTime = '2h';
            }
            if ($scope.Doctorcalendarobj.MinPerCaseval === 180) {
                $scope.patinet_consultationTime = '3h';
            }
            var time1 = $filter('date')(new Date($scope.Doctorcalendarobj.Starttime), 'HH:mm');
            //  $scope.patinet_appStarttime.StartTime = time1;
            var NormalslotMinPerCase = "";
            if (resp.UserConsultationNew.length > 0) {
                NormalslotMinPerCase = resp.UserConsultationNew[0].MinPerCase || "";
            } else {
                NormalslotMinPerCase = $scope.Doctorcalendarobj.MinPerCaseval || 15;
            }

            var temptime1 = time1.replace(":", "");
            var selectedstarttime = false;
            if ($scope.setValue.length > 0 && $scope.pagename !== "reschedule") {
                angular.forEach($scope.setValue, function (titem2, index) {
                    var tempstarttime = titem2.StartTime.replace(":", "");
                    var tempendtime = titem2.EndTime.replace(":", "");
                    if (parseInt(tempstarttime) === parseInt(temptime1)) {

                        $scope.slot.patinet_appStarttime = $scope.setValue[index];
                        $scope.slot.patient_appEndTime = $scope.slot.patinet_appStarttime.EndTime || "";
                        selectedstarttime = true;

                    }
                    //else if ((parseInt(tempstarttime) <= parseInt(temptime1)) && (parseInt(temptime1) <= parseInt(tempendtime))) {

                    //    $scope.slot.patinet_appStarttime = $scope.setValue[index];
                    //    $scope.slot.patient_appEndTime = $scope.slot.patinet_appStarttime.EndTime || "";
                    //    selectedstarttime = true;

                    //}
                    else if ((parseInt(temptime1) < parseInt(tempstarttime)) || ((parseInt(tempstarttime) < parseInt(temptime1)) && (parseInt(temptime1) < parseInt(tempendtime)))) {
                        if (selectedstarttime == false) {
                            $scope.slot.patinet_appStarttime = $scope.setValue[index];
                            $scope.slot.patient_appEndTime = $scope.slot.patinet_appStarttime.EndTime || "";
                            selectedstarttime = true;
                        }
                    }
                });

                if (selectedstarttime === false) {
                    $scope.slot.patinet_appStarttime = "";
                    $scope.slot.patient_appEndTime = "";

                    angular.forEach($scope.setValue, function (titem3, index) {
                        if (selectedstarttime == false) {
                            if (parseInt(titem3.seqstarttime1) < parseInt(temptime1)) {
                                $scope.slot.patinet_appStarttime = $scope.setValue[index];
                                $scope.slot.patient_appEndTime = $scope.slot.patinet_appStarttime.EndTime || "";
                            } else if (parseInt(titem3.seqstarttime1) > parseInt(temptime1)) {
                                selectedstarttime = true;
                                if ($scope.slot.patinet_appStarttime == "") {
                                    $scope.slot.patinet_appStarttime = $scope.setValue[index];
                                    $scope.slot.patient_appEndTime = $scope.slot.patinet_appStarttime.EndTime || "";
                                }
                            }
                        }
                    });

                } else {
                    var Index2 = $scope.setValue.findIndex(record => record.StartTime === $scope.slot.patinet_appStarttime.StartTime);
                    if (Index2 > -1) {
                        $scope.slot.patinet_appStarttime = $scope.setValue[Index2];
                    }
                }

                if ($scope.Doctorcalendarobj.OutOfBusinessTime == true) {
                    var dummysetValue = angular.copy($scope.setValue) || [];
                    if (dummysetValue.length > 0) {
                        var tempstarttime = dummysetValue[0].StartTime.replace(":", "");

                        var arr = time1.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);
                        var startingTime = moment().hours(shour).minutes(smin);

                        var temp1endtime = dummysetValue[dummysetValue.length - 1].EndTime.replace(":", "");
                        if (parseInt(tempstarttime) > parseInt(temptime1)) {
                            var Obj1 = {
                                "StartTime": startingTime.format("HH:mm"),
                                "EndTime": startingTime.add(NormalslotMinPerCase, "minute").format("HH:mm"),
                                "TokenNumber": 0,
                                "Available": "Y"
                            };
                            var date_T = $filter("date")(new Date(), "yyyy-MM-dd");
                            var datetime = date_T + "T" + Obj1.StartTime;
                            Obj1.NewStartTime = "";
                            Obj1.NewStartTime = $filter('date')(datetime, "hh:mm a");
                            console.log(slotObj.NewStartTime + "" + datetime);
                            $scope.setValue.unshift(Obj1);
                            $scope.slot.patinet_appStarttime = $scope.setValue[0];
                        }
                        else if (parseInt(temp1endtime) <= parseInt(temptime1)) {
                            var Obj1 = {
                                "StartTime": startingTime.format("HH:mm"),
                                "EndTime": startingTime.add(NormalslotMinPerCase, "minute").format("HH:mm"),
                                "TokenNumber": 0,
                                "Available": "Y"
                            };
                            var date_T = $filter("date")(new Date(), "yyyy-MM-dd");
                            var datetime = date_T + "T" + Obj1.StartTime;
                            Obj1.NewStartTime = "";
                            Obj1.NewStartTime = $filter('date')(datetime, "hh:mm a");
                            console.log(slotObj.NewStartTime + "" + datetime);
                            $scope.setValue.push(Obj1);
                            $scope.slot.patinet_appStarttime = $scope.setValue[dummysetValue.length];
                        }
                    }
                }

                var t = $filter("date")(new Date(), "yyyy-MM-dd");
                var datetime = t + "T" + time1;
                $scope.AppointmentRescheduleObj.StartTime = $filter('date')(datetime, "hh:mm a");

            }
            else if ($scope.setValue.length === 0 && $scope.pagename == "book" && $scope.Doctorcalendarobj.OutOfBusinessTime == true) {
                var arr = time1.split(':');
                var shour = $.trim(arr[0]);
                var smin = $.trim(arr[1]);
                var startingTime = moment().hours(shour).minutes(smin);
                var Obj1 = {
                    "StartTime": startingTime.format("HH:mm"),
                    "EndTime": startingTime.add(NormalslotMinPerCase, "minute").format("HH:mm"),
                    "TokenNumber": 0,
                    "Available": "Y"
                };
                var date_T = $filter("date")(new Date(), "yyyy-MM-dd");
                var datetime = date_T + "T" + Obj1.StartTime;
                Obj1.NewStartTime = "";
                Obj1.NewStartTime = $filter('date')(datetime, "hh:mm a");
                console.log(slotObj.NewStartTime + "" + datetime);
                $scope.setValue.push(Obj1);
                $scope.slot.patinet_appStarttime = $scope.setValue[0];
            }
            else {
                $scope.slot.patinet_appStarttime = "";
                $scope.slot.patient_appEndTime = "";

                if ($scope.pagename == "reschedule") {
                    $scope.RescheduleSlotsObj = GetRescheduleSlotsObj();
                    if ($scope.IsReschduleSlotIND === false) {
                        $scope.RescheduleSlotsObj.IsStartandEndInd = true;

                        if ($scope.IsComingFrom === 'Doctorcalendar') {
                            var arr = $scope.appointmentInfo.startTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);
                            var arr2 = $scope.appointmentInfo.endTime.split(':')
                            var endHour = $.trim(arr2[0]);
                            var endmin = $.trim(arr2[1]);
                            var Date_1 = $filter('date')(new Date(), "yyyy-MM-dd");
                            var DateTime_1 = Date_1 + "T" + shour + ":" + smin;
                            // $scope.RescheduleSlotsObj.StartTimeSlot = shour + ":" + smin || '';
                            $scope.RescheduleSlotsObj.originalSlot = shour + ":" + smin || '';
                            $scope.RescheduleSlotsObj.StartTimeSlot = $filter('date')(DateTime_1, "hh:mm a");
                            $scope.AppointmentRescheduleObj.StartTime = $filter('date')(DateTime_1, "hh:mm a");
                            $scope.RescheduleSlotsObj.EndTimeSlot = endHour + ":" + endmin || '';

                            var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                            var startDate1 = currentDt + " " + $scope.appointmentInfo.startTime;
                            // var endDate1 = currentDt + " " + $scope.appointmentInfo.endTime;
                            var originalend = $scope.appointmentInfo.endTime == "00:00:00" ? "24:00" : $scope.appointmentInfo.endTime
                            var endDate1 = currentDt + " " + originalend;
                            var starttime = new Date(startDate1);
                            var endtime = new Date(endDate1);
                            function getMinutesBetweenDates(startDate, endDate) {
                                var diff = endDate.getTime() - startDate.getTime();
                                return (diff / 60000);
                            }
                            var minutes = getMinutesBetweenDates(starttime, endtime);
                            $scope.patinet_consultationTime = minutes + "m";
                            $scope.RescheduleSlotsObj.DurationTime = minutes;
                            $scope.IsReschduleSlotIND = true;

                            getCompletedSlot($scope.RescheduleSlotsObj.originalSlot, $scope.RescheduleSlotsObj.EndTimeSlot);
                        }

                    } else {
                        $scope.patinet_consultationTime = $scope.selectedDocObject.selectedPerson.MinPerCase + 'm';
                    }
                }
            }

            if ($scope.IsDoctorcalendarDate == false) {
                if ($scope.Doctorcalendarobj.GetDate != undefined) {
                    $scope.appDate = $filter("date")(new Date($scope.Doctorcalendarobj.GetDate), "MM-dd-yyyy");
                } else {
                    $scope.appDate = $filter("date")(new Date(), "MM-dd-yyyy");
                }
            }

            console.log($scope.setValue);
            console.log("setvalue");
        }
    }

    $scope.newobj = {
        "OrganId": null,
        "NurseId": null,
        "AnesthesistId": null,

    }

    $scope.changeSlotType = function (item) {
        console.log(item);
        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
        var params = {
            "DoctorId": $scope.SelectedBranchDocId,
            "UserBranchId": $scope.selectedDocObject.selectedPerson.UserBranchId,
            "Date": appointmentDate
        }
        console.log(params);
        // eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);
        eHnoteMainAppointmentService.GetDoctorAvaiableSlotByDate(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                angular.forEach(response.NormalSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);

                    item.seqStartTime = item.StartTime.replace(":", "");
                    item.seqEndTime = item.EndTime.replace(":", "");
                });
                angular.forEach(response.TeleSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);
                });

                $scope.IsMaximumAppointmentsPerDay = false;
                if (response.UserConsultationNew.length > 0) {
                    if (response.UserConsultationNew[0].IsMaximumAppointmentsPerDay == true) {
                        if (response.DoctorAppointmentCount > response.UserConsultationNew[0].MaximumAppointmentsPerDay || response.DoctorAppointmentCount == response.UserConsultationNew[0].MaximumAppointmentsPerDay) {
                            //alertify.error(".Please choose another doctor");
                            $scope.IsMaximumAppointmentsPerDay = true;
                            alertify.error("Maximum Appointments Reached for is Doctor. Please choose another doctor");
                            return false;

                        }
                    }
                }

                newreStructureDoctorSelectedSlots(response);
            }

        }
        function OnGetError(response) {
            var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
            if ($scope.appDate) {
                $scope.setValue = [];
                if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                    bindDoctorSlots(MinPerCaseval, 'current');
                } else {
                    bindDoctorSlots(MinPerCaseval, 'all');
                }
            }
        }
    }
    $scope.changeSlotAppointmentType = function (item) {
        console.log(item);
    }

    function checkSlots(array, bookedarray) {


        angular.forEach(bookedarray, function (item) {
            for (var i = array.length - 1; i >= 0; i--) {
                if (item.StartTime === array[i].StartTime) {
                    array.splice(i, 1);
                }
            }
        });



        return array;
    }


    $scope.onclickstartTime = function () {
        console.log("starttime : 00:--");
        $scope.RescheduleSlotsObj.IsStartandEndInd = false;

        if ($scope.selectedDocObject.selectedPerson.MinPerCase !== undefined) {
            $scope.patinet_consultationTime = $scope.selectedDocObject.selectedPerson.MinPerCase + 'm';
        } else {
            $scope.patinet_consultationTime = "";
        }
    };

    $scope.changeAppointmentDoctor1 = function (SelectedDoctorId, type, onclick) {
        SelectedDoctorId = parseInt(SelectedDoctorId);

        $scope.SelectedBranchDocId = SelectedDoctorId;
        $scope.selectedDocObject.selectedPerson = "";
        if (SelectedDoctorId != 0) {
            var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === SelectedDoctorId);
        }
        if (Index > -1) {
            $scope.selectedDocObject.selectedPerson = $scope.clinicDoctorList[Index];
        }
        console.log($scope.selectedDocObject.selectedPerson);
        $scope.setValue = [];
        $scope.patinet_appStarttime = '';
        $scope.slot.patinet_appStarttime = '';
        $scope.patient_appEndTime = '';
        $scope.slot.patient_appEndTime = '';
        $scope.AppointmentRescheduleObj.StartTime = "";
        $scope.doctorName = $scope.selectedDocObject.selectedPerson.FullName;
        $scope.DoctorEmailId = $scope.selectedDocObject.selectedPerson.EmailId;
        $scope.CountryCode = $scope.selectedDocObject.selectedPerson.CountryCode;
        $scope.MobileNo = $scope.selectedDocObject.selectedPerson.MobileNo;

        $scope.CommunicationEmailId = $scope.selectedDocObject.selectedPerson.CommunicationEmailId;
        $scope.CommunicationCountryCode = $scope.selectedDocObject.selectedPerson.CommunicationCountryCode;
        $scope.CommunicationMobileNo = $scope.selectedDocObject.selectedPerson.CommunicationMobileNo;

        if (type !== 'PageLaod' && $scope.selectedDocObject.selectedPerson.MinPerCase !== undefined) {
            if ($scope.patinet_consultationTime === 60) {
                $scope.patinet_consultationTime = '1h';
            } else {
                $scope.patinet_consultationTime = $scope.selectedDocObject.selectedPerson.MinPerCase + 'm';
            }
        }
        if (onclick == 'onclick') {
            $scope.othervisitrsn = "";
            $scope.visitrsnId = "";
            $scope.visitremarks = "";
            $scope.appointment_type.AppointmentTypeId = "";
            $scope.isAppValiddities.isEnableAlertType = false;
            $scope.paymentTypeObj.AppointmentNote = "";
            $scope.Showaddnotes = false;
        }

        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
        console.log(MinPerCaseval);


        $scope.restrictDoctorSlots = false;

        if ($scope.selectedBranchobj !== undefined) {
            if ($scope.selectedBranchobj.IsRestrictAppointmentSlot) {
                $scope.restrictDoctorSlots = true;
            }
        }


        if ($scope.selectedBranchobj !== undefined) {
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID === $scope.selectedBranchobj.BranchId) {
                if ($scope.selectedBranchobj.IsEnableBillinAppointment) {
                    $scope.showpaynBookApptbtn = true;
                }
            }
        }



        if ($scope.restrictDoctorSlots && SelectedDoctorId !== 0) {//writen by bharath
            //bindDoctorRestrictedSolts($scope.selectedDocObject);
            console.log("chota");
            if ($scope.pagename === "reschedule" || $scope.IsComingFrom == 'Doctorcalendar') {
                $scope.getUserBranchslots(SelectedDoctorId);
            }
        } else {

            console.log("Bada");
            if ($scope.appDate) {
                $scope.setValue = [];
                if (SelectedDoctorId !== 0) {
                    if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                        bindDoctorSlots(MinPerCaseval, 'current');
                    } else {
                        bindDoctorSlots(MinPerCaseval, 'all');
                    }
                } else {
                    $scope.setEndValues = [];
                    $scope.slot.patinet_appStarttime = "";
                    $scope.slot.patient_appEndTime = "";
                    $scope.patinet_consultationTime = "";
                }
            }
        }

        $scope.onclickstartTime();
        if ($scope.pagename === "book") {
            if (!$scope.IsApptReqPopUp) {
                console.log("Default Reason 1");
                //   $scope.GetDefaultReasonForDoctors();
            }

        }
        if ($scope.pagename === "reschedule") {
            if (selectedDoctorinAppList.DoctorID == $scope.selectedDocObject.selectedPerson.DoctorID && $scope.visitrsnId == $scope.appCondate[5]) {

            } else {
                if (!$scope.IsApptReqPopUp) {
                    console.log("Default Reason 2");
                    $scope.GetDefaultReasonForDoctors();
                }
            }
        }
    };

    $scope.changeAppointmentDoctor = function (SelectedDoctorId, type, onclick) {
        $scope.setValue = [];
        $scope.patinet_appStarttime = '';
        $scope.slot.patinet_appStarttime = '';
        $scope.patient_appEndTime = '';
        $scope.slot.patient_appEndTime = '';
        $scope.AppointmentRescheduleObj.StartTime = "";
        if (onclick == 'onclick') {
            $scope.othervisitrsn = "";
            $scope.visitrsnId = "";
            $scope.visitremarks = "";
            $scope.appointment_type.AppointmentTypeId = "";
            $scope.isAppValiddities.isEnableAlertType = false;
            $scope.paymentTypeObj.AppointmentNote = "";
            $scope.Showaddnotes = false;
        }
    }


    $scope.UserTimeSlots = {
        "ExistingSlots": "",
        "AvailableSlots": ""
    };

    $scope.getUserBranchslots = function (SelectedDoctorId) {
        SelectedDoctorId = parseInt(SelectedDoctorId);
        $scope.SelectedBranchDocId = SelectedDoctorId;
        $scope.selectedDocObject.selectedPerson = "";

        var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === SelectedDoctorId);
        if (Index > -1) {
            $scope.selectedDocObject.selectedPerson = $scope.clinicDoctorList[Index];
        }
        console.log($scope.selectedDocObject.selectedPerson);

        $scope.patinet_appStarttime = '';
        $scope.slot.patinet_appStarttime = '';
        $scope.patient_appEndTime = '';
        $scope.slot.patient_appEndTime = '';
        $scope.doctorName = $scope.selectedDocObject.selectedPerson.FullName;
        $scope.DoctorEmailId = $scope.selectedDocObject.EmailId;
        $scope.CountryCode = $scope.selectedDocObject.CountryCode;
        $scope.MobileNo = $scope.selectedDocObject.selectedPerson.Mobile;
        $scope.CommunicationEmailId = $scope.selectedDocObject.selectedPerson.CommunicationEmailId;
        $scope.CommunicationCountryCode = $scope.selectedDocObject.selectedPerson.CommunicationCountryCode;
        $scope.CommunicationMobileNo = $scope.selectedDocObject.selectedPerson.CommunicationMobileNo;


        console.log($scope.selectedBranchobj.IsRestrictAppointmentSlot);
        $scope.selectedDocObject.selectedPerson = $scope.selectedDocObject.selectedPerson || "";

        if ($scope.ConsultationType.typename === 'PhysicalConsultation') {
            var doctorTeleMinpercaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
            if ($scope.appCondate === undefined || $scope.appCondate === '') {
                if (doctorTeleMinpercaseval === 60) {
                    $scope.patinet_consultationTime = '1h';
                    $scope.patinet_consultationTimeDisplay = '1 hr(s)';
                } else {
                    $scope.patinet_consultationTime = doctorTeleMinpercaseval + 'm';
                    $scope.patinet_consultationTimeDisplay = doctorTeleMinpercaseval + ' mins';
                }
            }
            if ($scope.selectedBranchobj.IsRestrictAppointmentSlot && $scope.selectedDocObject.selectedPerson !== "") {
                if ($scope.appDate == 'Invalid date') {
                    if ($scope.IsComingFrom == 'Doctorcalendar') {
                        if ($scope.Doctorcalendarobj.GetDate !== 'Invalid date' && $scope.Doctorcalendarobj.GetDate !== '') {
                            var appointmentDate = $filter('date')(new Date($scope.Doctorcalendarobj.GetDate), "yyyy-MM-dd");
                        } else {
                            var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                        }
                    } else {
                        var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    }
                }
                else if ($scope.IsComingFrom == 'Doctorcalendar') {
                    if ($scope.Doctorcalendarobj.GetDate !== 'Invalid date' && $scope.Doctorcalendarobj.GetDate !== '') {
                        var appointmentDate = $filter('date')(new Date($scope.Doctorcalendarobj.GetDate), "yyyy-MM-dd");
                    } else {
                        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
                    }
                }
                else {
                    var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
                }

                var params = {
                    "DoctorId": SelectedDoctorId,
                    "UserBranchId": $scope.selectedDocObject.selectedPerson.UserBranchId,
                    "Date": appointmentDate
                }
                console.log(params);
                if ($scope.UnblockSlots) {
                    return;
                }
                //  eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);
                eHnoteMainAppointmentService.GetDoctorAvaiableSlotByDate(params, OnGetSuccess, OnGetError);

                function OnGetSuccess(response) {
                    console.log(JSON.stringify(response));
                    if (response.status === 'Success') {
                        response.IsBranchHoliday = response.IsBranchHoliday || false;
                        if (response.IsBranchHoliday) {
                            alertify.error("It's a holiday, please choose another date.");
                            //$scope.appDate = $filter('date')(new Date(),"MM-dd-yyyy");
                            $scope.setValue = [];
                            return;
                        }
                        if (response.IsLeave) {
                            alertify.error("Doctor is on leave on the selected date!");
                            //$scope.appDate = $filter('date')(new Date(),"MM-dd-yyyy");
                            $scope.setValue = [];
                            return;
                        }


                        angular.forEach(response.NormalSlots, function (item) {
                            item.StartTime = item.StartTime.substring(0, 5);
                            item.EndTime = item.EndTime.substring(0, 5);

                            item.seqStartTime = item.StartTime.replace(":", "");
                            item.seqEndTime = item.EndTime.replace(":", "");
                        });
                        angular.forEach(response.TeleSlots, function (item) {
                            item.StartTime = item.StartTime.substring(0, 5);
                            item.EndTime = item.EndTime.substring(0, 5);
                        });
                        $scope.IsMaximumAppointmentsPerDay = false;
                        if (response.UserConsultationNew.length > 0) {
                            if (response.UserConsultationNew[0].IsMaximumAppointmentsPerDay == true) {
                                if (response.DoctorAppointmentCount > response.UserConsultationNew[0].MaximumAppointmentsPerDay || response.DoctorAppointmentCount == response.UserConsultationNew[0].MaximumAppointmentsPerDay) {
                                    //alertify.error(".Please choose another doctor");
                                    $scope.IsMaximumAppointmentsPerDay = true;
                                    alertify.error("Maximum Appointments Reached for is Doctor. Please choose another doctor");
                                    return false;

                                }
                            }
                        }



                        $scope.UserTimeSlots.AvailableSlots = response.UserConsultationNew;
                        $scope.UserTimeSlots.ExistingSlots = response.NormalSlots;

                        console.log($scope.UserTimeSlots);

                        newreStructureDoctorSelectedSlots(response);
                    }

                }
                function OnGetError(response) {
                    var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
                    if ($scope.appDate) {
                        $scope.setValue = [];
                        if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                            bindDoctorSlots(MinPerCaseval, 'current');
                        } else {
                            bindDoctorSlots(MinPerCaseval, 'all');
                        }
                    }
                }
            } else {
                var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
                if ($scope.appDate) {
                    $scope.setValue = [];
                    if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                        bindDoctorSlots(MinPerCaseval, 'current');
                    } else {
                        bindDoctorSlots(MinPerCaseval, 'all');
                    }
                }

            }
        }
        else {
            var doctorTeleMinpercaseval = $scope.selectedDocObject.selectedPerson.TeleMinPerCase;
            if ($scope.appCondate === undefined || $scope.appCondate === '') {
                if (doctorTeleMinpercaseval === 60) {
                    $scope.patinet_consultationTime = '1h';
                    $scope.patinet_consultationTimeDisplay = '1 hr(s)';
                } else {
                    $scope.patinet_consultationTime = doctorTeleMinpercaseval + 'm';
                    $scope.patinet_consultationTimeDisplay = doctorTeleMinpercaseval + ' mins';
                }
            }
            var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
            var params = {
                "DoctorId": SelectedDoctorId,
                "UserBranchId": $scope.selectedDocObject.selectedPerson.UserBranchId,
                "Date": appointmentDate
            }
            console.log(params);
            // eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);
            eHnoteMainAppointmentService.GetDoctorAvaiableSlotByDate(params, OnGetSuccess, OnGetError);

            function OnGetSuccess(response) {
                console.log(JSON.stringify(response));
                if (response.status === 'Success') {

                    angular.forEach(response.NormalSlots, function (item) {
                        item.StartTime = item.StartTime.substring(0, 5);
                    });
                    angular.forEach(response.TeleSlots, function (item) {
                        item.StartTime = item.StartTime.substring(0, 5);
                    });
                    $scope.IsMaximumAppointmentsPerDay = false;
                    if (response.UserConsultation.length > 0) {
                        if (response.UserConsultation[0].IsMaximumAppointmentsPerDay == true) {
                            if (response.DoctorAppointmentCount > response.UserConsultation[0].MaximumAppointmentsPerDay || response.DoctorAppointmentCount == response.UserConsultation[0].MaximumAppointmentsPerDay) {
                                //alertify.error(".Please choose another doctor");
                                $scope.IsMaximumAppointmentsPerDay = true;
                                alertify.error("Maximum Appointments Reached for is Doctor. Please choose another doctor");
                                return false;

                            }
                        }
                    }
                    newreStructureDoctorSelectedSlots(response);
                }

            }
            function OnGetError(response) {
                var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
                $scope.setValue = [];
            }
        }








    };



    if ($scope.pagename === 'FollowUp') {
        $scope.DoctorName = $scope.appointmentInfo.DoctorFullName;
        $scope.SelectedBranchDocId = $scope.appointmentInfo.DoctorID;
    }
    var patientIDcache = 0;
    $scope.ChangeRefferalSource = function () {
        $scope.selectedPatientObj.ReferralSource = "";
        $scope.selectedPatientObj.ReferralSourceName = "";
        if ($scope.selectedPatientObj.referralSource !== "") {
            if ($scope.selectedPatientObj.referralSource.ShowType === 'D') {
                getSourceListing("");
            }
        }
    };
    $scope.SearchByReferralSource = function () {
        if ($scope.selectedPatientObj.referralSource !== "") {
            $scope.Refferalserachname = $scope.selectedPatientObj.ReferralSourceName;
            if ($scope.Refferalserachname === "" || $scope.Refferalserachname.length < 2) {
                $scope.ShowRefferallist = false;
                $scope.selectedPatientObj.ReferralSourceId = 0;
                return false;
            } else {


                $scope.ShowRefferallist = true;
                getSourceListing($scope.Refferalserachname);
            }

        } else {
            alertify.error("Please Choose Referral");
            return false;
        }
    };
    //var json = eHnoteMasterDataService.getDocAvailConsultTimeInfo();
    //$scope.setValue = json;
    function getSourceListing(Searchtext) {
        var getParams = {
            "DoctorID": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "SearchText": Searchtext,
            "PageSize": 1000,
            "PageNumber": 1,
            "USRId": doctorinfo.doctorid,
            "MasterReferralSourceId": $scope.selectedPatientObj.referralSource.MasterReferralSourceId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
        } else {
            var hospid = undefined;
            eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
        }

        function onreadSuccess(data) {
            $scope.ReferralList = data[0].rows;


            if ($scope.IsbindindData) {
                var selectedReferral = $filter("filter")($scope.ReferralList, function (item) {
                    return item.ReferralTitle === $scope.referralTitle;
                });
                if (selectedReferral.length > 0) {
                    $scope.selectedReferral = selectedReferral[0];
                    $scope.selectedPatientObj.ReferralSource = $scope.selectedReferral;
                    //$scope.patientinfo.othDetailreferralsource = $scope.selectedReferral.ReferralID;
                    $scope.selectedPatientObj.ReferralSourceId = $scope.selectedReferral.ReferralID;
                    $scope.selectedPatientObj.ReferralSourceName = $scope.selectedReferral.ReferralTitle;
                    $scope.IsbindindData = false;
                    $scope.ShowRefferallist = false;
                    $scope.referralTitle = "";
                }
            }



        }

        function onreadFailed(err) {
            console.log(err);
        }
    }

    $scope.category = function (item) {
        $scope.selectedPatientObj.PatientType = item.patienttypeId;
        $scope.selectedPatientObj.PatientTypeName = item.PatientType;

    };


    //eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
    //function onTypesSuccess(data) {
    //    $scope.appointmentTypes = data;

    //    $scope.appointmentTypes = $scope.appointmentTypes.filter(x => x.Id !== 9);

    //    if ($scope.pagename === "FollowUp") {
    //        $rootScope.appointment_type = "3";
    //        $scope.appointment_type.AppointmentTypeId = "3";
    //    } else if ($scope.pagename === "surgery" || $scope.pagename === "surgeryFileUpload") {
    //        $scope.appointment_type.AppointmentTypeId = "8";
    //    }
    //    if ($scope.appCondate && $scope.appCondate.length > 0 && $scope.appCondate[4]) {
    //        $scope.Source = $scope.appCondate[4].toString();
    //    }
    //}
    //function onTypesFailed(err) {
    //    console.log(err);
    //}
    $scope.MasterReferralSource = function () {
        eHnoteOrgReferralDataServices.GetMasterReferralSource(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (response) {
            $scope.ReferralSouceMaster = response.data.rows;
        });
    };
    $scope.GetAllRelationshipTypes = function () {
        eHnoteInsuranceService.GetAllRelationshipTypes().then(function (resp) {
            $scope.RelationShipTypeList = resp.data.RelationTypes;
        }, function (err) {
            console.log(err);
            alertify.error("Getting RelationTypes Failed");
        });
    };


    $scope.Changevisitreason = function (item) {
        console.log(item);
        $scope.othervisitrsn = item;
        $scope.visitrsnId = null;
    };
    $scope.Changesurgery = function (item) {
        console.log(item);
        $scope.Selectedsurgeryobj = item;
    };

    $scope.onsurgeryitem = function (item) {
        console.log(item);
        $scope.SurgeryList = [];
        var obj = {
            "OrgSurgeryId": item.OrgSurgeryId || 0,
            "SurgeryId": item.SurgeryId || 0,
            "AppointmentSurgeryId": 0,
            "DeleteInd": "N",

        }
        $scope.SurgeryList.push(obj);
    }


    $scope.onothervisitrsn = function (item, Mainitem) {

        console.log($scope.appointmentInfo);
        item = item || "";
        if (item.ReasonId !== "") {
            Mainitem.OtherVisitRsn = item.Reason;
            $scope.visitrsnId = item.ReasonId;
            Mainitem.visitremarks = item.Remarks || '';

            if (item.VisitTypeId !== undefined) {
                if ($scope.appointment_type.AppointmentTypeId !== item.VisitTypeId.toString()) {
                    $scope.paymentTypeObj.AppointmentNote = "";
                    $scope.Showaddnotes = false;
                }
            }

            $scope.appointment_type.AppointmentTypeId = item.VisitTypeId.toString();
            Mainitem.AppointmentTypeId = item.VisitTypeId.toString();
           





            if ($scope.appointmentInfo.AppointmentID !== 0) {
                if ($scope.Doctorcalendarobj == '') {
                    $scope.Doctorcalendarobj = {
                        "AppointmentTypeId": $scope.appointmentInfo.DoctorVisitRsnID.toString()
                    }
                } else {
                    $scope.Doctorcalendarobj.AppointmentTypeId = $scope.appointmentInfo.DoctorVisitRsnID.toString();
                }

            }

            if (item.VisitTypeId != 5 && item.VisitTypeId != 6 && item.VisitTypeId != 7) {
                if ($scope.IsComingFrom == 'Doctorcalendar') {
                    var DoctorcalendarApptTypeId = parseFloat($scope.Doctorcalendarobj.AppointmentTypeId);
                    $scope.Doctorcalendarobj.VisitTypes = [];
                    var obj = {
                        "AppointmentTypeId": $scope.Doctorcalendarobj.AppointmentTypeId
                    }
                    $scope.Doctorcalendarobj.VisitTypes.push(obj);

                    if (DoctorcalendarApptTypeId !== item.VisitTypeId) {
                        if ($scope.IsComingFrom == 'Doctorcalendar') {
                            //$scope.isAppValiddities.isEnableAlertType = true;
                            //$scope.isAppValiddities.isValidOptionSelected = false
                            var list = $filter("filter")($scope.isAppValiddities.VisitTypes, function (Kitem, index) { return Kitem.VisitTypeId === item.VisitTypeId });

                            if (list.length == 0) {
                                $scope.isAppValiddities.isEnableAlertType = true;
                                $scope.isAppValiddities.isValidOptionSelected = false;
                            } else {
                                $scope.isAppValiddities.isEnableAlertType = false;
                                $scope.isAppValiddities.isValidOptionSelected = true;
                            }
                        }
                    } else {
                        $scope.isAppValiddities.isEnableAlertType = false;
                        $scope.isAppValiddities.isValidOptionSelected = true;
                    }
                } else {
                    if ($scope.isAppValiddities.VisitTypes.length > 0) {
                        $scope.Doctorcalendarobj.VisitTypes = [];
                        angular.forEach($scope.isAppValiddities.VisitTypes, function (item) {
                            var obj = {
                                "AppointmentTypeId": item.VisitTypeId
                            }
                            $scope.Doctorcalendarobj.VisitTypes.push(obj);
                        })

                        var list = $filter("filter")($scope.isAppValiddities.VisitTypes, function (Kitem, index) { return Kitem.VisitTypeId === item.VisitTypeId });

                        if (list.length == 0) {
                            $scope.isAppValiddities.isEnableAlertType = true;
                            $scope.isAppValiddities.isValidOptionSelected = false;
                        } else {
                            $scope.isAppValiddities.isEnableAlertType = false;
                            $scope.isAppValiddities.isValidOptionSelected = true;
                        }
                    } else {
                        $scope.isAppValiddities.isEnableAlertType = false;
                        $scope.isAppValiddities.isValidOptionSelected = true;
                    }
                }
            } else {
                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.isValidOptionSelected = true;
            }


            if ($scope.bookApptType === "New" && (item.VisitTypeId === 7 || item.VisitTypeId === 4 || item.VisitTypeId === 14)) {
                let req = {
                    "PatientId": $scope.selectedPatientObj.PatientId || 0,
                    "SpecializationId": $scope.SpecializationId,
                    "DoctorId": $scope.selectedDocObject.selectedPerson.DoctorID,
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "AppointmentTypeId": $scope.appointment_type.AppointmentTypeId || null
                };
                $scope.ApprovedSurgeryAppointments = [];
                $scope.SelectedApprovedParentAppt = "";
                eHnoteDiagnosisDataServices.GetApprovedSurgeryAppointments(req).then(function (resp) {
                    if (resp.data !== undefined) {
                        if (resp.data.rows.length > 0) {
                            $scope.SelectedParentAppt = "";
                            $scope.ApprovedSurgeryAppointments = [];
                            angular.forEach(resp.data.rows, function (item) {
                                let obj = {
                                    "SurgeryListId": 0,
                                    "OrgSurgeryId": item.OrganizationSurgeryId,
                                    "SurgeryId": item.SurgeryId,
                                    "PatientSurgeryId": item.PatientSurgeryId,
                                    "AppointmentId": item.AppointmentId,
                                    "OrganizationSurgeryName": item.OrganizationSurgeryName,
                                    "DeleteInd": false,
                                    "IsChecked": false,
                                    "SurgerySuggestedDate": $filter('date')(new Date(item.SurgerySuggestedDate), "MM-dd-yyyy")
                                };
                                $scope.ApprovedSurgeryAppointments.push(obj);
                            });

                        } else {
                            alertify.error("This patient doesn't have any advised surgeries!");
                            $scope.IsSubmitDisabled = true;
                            return false;
                        }
                    } else {
                        $scope.IsSubmitDisabled = true;
                        return false;
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Fetching Data Failed!");
                });

            }

            // $scope.apptypechange($scope.appointment_type.AppointmentTypeId);
            // ChangeSlotstoMaxAppointment($scope.MaxSlotsAppointmentCheckArray); // after select visit reason
            $scope.getUserBranchslots($scope.SelectedBranchDocId);
            $scope.GetActiveDates();
        }
        Mainitem.searchtext.visitreason = "";
        $scope.AppointmentRescheduleObj.StartTime = "";
        $scope.RescheduleSlotsObj.IsStartandEndInd = false;
    };

    $scope.GetAllBookingTypes = function () {
        eHnoteOrgReferralDataServices.GetAllBookingTypes().then(function (resp) {
            $scope.BookingTypeList = resp.data || [];

            $scope.BookingTypeList = $filter("filter")($scope.BookingTypeList, function (item, index) {
                return item.Id != 2;
            });
            //$scope.selectBookingType.selectedBookAppo = $scope.BookingTypeList[0] || "";
            $scope.selectBookingType.selectedBookAppo = "3";
            $scope.selectBookingType.IsWalkInSlot = false;



            $scope.selectBookingType.selectedBookAppo = $scope.appointmentInfo.BookingTypeId ? $scope.appointmentInfo.BookingTypeId.toString() : "3";

            $scope.BookingType = parseInt($scope.selectBookingType.selectedBookAppo);

            $scope.selectBookingType.IsWalkInSlot = parseInt($scope.selectBookingType.selectedBookAppo) == 1 ? true : false;

        }, function (err) {
            console.log(err);
            alertify.error("Getting RelationTypes Failed");
        });
    };

    $scope.GetAllHospitalEquipments = function () {
        //var obj = {
        //    "ParentOrganizationId": $scope.ParenthospitalId
        //}
        $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
        eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.HospitalEquipmentList = resp.data.rows;
                $scope.HospitalEquipmentList = $scope.HospitalEquipmentList || [];

                cacheStorageItem.HospitalEquipmentId = cacheStorageItem.HospitalEquipmentId || "";
                if (cacheStorageItem.HospitalEquipmentId !== "") {
                    //  $scope.selectedHospitalEquipment = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": cacheStorageItem.HospitalEquipmentId }, true)[0];
                    //$scope.HospitalEquipmentId = $scope.selectedHospitalEquipment.HospitalEquipmentId;
                    $scope.HospitalEquipmentId = cacheStorageItem.HospitalEquipmentId || "";
                }
            }
            $scope.FunctionName();
        });
    };
    $scope.GetAllHospitalEquipments();

    /*  $scope.getOrganizationTOSCodes = function () {

          eHnotePatientAddressDataServices.GetOrganizationTOSCodes($scope.ParenthospitalId).then(function (resp) {

              console.log(resp);
              if (resp.data.rows.length > 0) {
                  $scope.OrgTOSCODESArray = resp.data.rows || [];


                  if (cacheStorageItem.bookApptType == 'EditAppointment') {
                      $scope.TOSCodeObject = "";
                      if ($scope.selectedTosCodesArray.length === 1) {

                          $scope.TOSCodeObject = $filter("filter")($scope.OrgTOSCODESArray, function (Nitem) {
                              return Nitem.MedicalServicesId === $scope.selectedTosCodesArray[0].TOSCodeId;
                          })[0] || "";
                      }
                  }
              }
          });
      };*/

    $scope.changeTOSCOde = function (obj, item) {
        //item.TOSCodeId = obj.MedicalServicesId;
        //item.TOSCodeName = obj.ServiceName;
        //item.TOSCode = obj.Code;
        obj = obj || "";
        if (obj != "") {
            $scope.TOSCodeObject = obj;
        } else {
            $scope.TOSCodeObject = "";
        }
    };
    $scope.addMoreTosCodes = function (sitem) {
        if (sitem.TOSCodeId === 0) {
            alertify.error("Please Select Service");
            return false;
        } else {
            var tosCodeObject = {
                "PatientTOSCodeId": 0,
                "TOSCodeId": 0,
                "TOSCode": "",
                "TOSCodeObject": "",
                "DeleteInd": "N"
            };
            $scope.selectedTosCodesArray.push(tosCodeObject);
        }
    };

    $scope.removeTosCodes = function (index) {
        $scope.selectedTosCodesArray.splice(index, 1);
    };

    $scope.getBranchAppointmentTypes = function (hospitalId) {

        eHnoteMainAppointmentService.getBranchAppointmentTypes(hospitalId).then(function (resp) {
            console.log(resp);
            $scope.appointmentTypes = [];
            if (resp.data.rows != undefined) {
                $scope.appointmentTypes = resp.data.rows;
                $scope.appointmentTypes = $scope.appointmentTypes.filter(x => x.AppointmentTypeId !== 9);
                angular.forEach($scope.appointmentTypes, function (item) {
                    item.AppointmentTypeId = item.AppointmentTypeId.toString();
                });
                /*$scope.appointment_type.AppointmentTypeId = "1";*/
                $scope.appointment_type.AppointmentTypeId = "";
                if ($scope.pagename === "FollowUp") {
                    $rootScope.appointment_type = "3";
                    $scope.appointment_type.AppointmentTypeId = "3";
                }
                else if ($scope.pagename === "surgery" || $scope.pagename === "surgeryFileUpload") {
                    $scope.appointment_type.AppointmentTypeId = "8";
                }
                else if ($scope.pagename === "reschedule") {
                    $scope.appointment_type.AppointmentTypeId = $rootScope.appointment_type || "1";
                }
                if (cacheStorageItem.bookApptType == 'ApptFromCalendar') {
                    $scope.appointment_type.AppointmentTypeId = $rootScope.appointment_type || "1";
                }

                if ($scope.appCondate !== undefined) {
                    if ($scope.appCondate && $scope.appCondate.length > 0 && $scope.appCondate[4]) {
                        $scope.Source = $scope.appCondate[4].toString();
                    }
                }

            }
        });

    };

    $scope.GetVisitReasonArray = [];
    $scope.AllVisitReasons = [];
    $scope.searchtext = {
        "visitreason": ""
    };
    $scope.GetVisitReasonNew = function () {
        var getParams = {
            "OrganizationId": $scope.SelectedBranchId,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.status == "Success") {
                    console.log(resp.data.rows);
                    console.log("DURGA");
                    $scope.GetVisitReasonArray = angular.copy(resp.data.rows) || [];

                    if ($scope.GetVisitReasonArray.length > 0) {
                        $scope.GetVisitReasonArray = $filter("filter")($scope.GetVisitReasonArray, function (item) {
                            return item.ActiveIND === 'Y';
                        });
                    }
                    $scope.AllVisitReasons = angular.copy($scope.GetVisitReasonArray);

                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    var calendarContainers = "";
    var $calendar = "";
    $scope.FunctionName = function () {
        calendarContainers = $(".calendar-container").simpleCalendar({
            displayEvent: true,
            fixedStartDay: true,
            displayYear: false,
            months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
            days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            disableEventDetails: false,
            disableEmptyDetails: true,
            events: [],
            onMonthChange: function (month, year) {
                console.log(month, year);
                let tdate = new Date();
                let tmonth = tdate.getMonth() + 1;
                if (tmonth <= month + 1) {
                    var t = new Date();
                    var startDate = new Date(t.getFullYear(), month, 1);
                    var endDate = new Date(t.getFullYear(), month + 1, 0);
                    $scope.DocAvailableDates = [];
                    if (startDate.getMonth() === t.getMonth()) {
                        startDate = new Date();
                    }
                    $scope.AppointmentRescheduleObj.StartDateforActivecalendar = startDate;
                    $scope.GetActiveDates(startDate, endDate);
                } else {
                    return;
                }
            },
            onDateSelect: function (date, events) {
                $scope.appDate = date;
                $scope.visitrsnId = $scope.visitrsnId || 0;
                if ($scope.visitrsnId == 0) {
                    alertify.error("Please select Visit reason");
                    return;
                }
                $scope.chgAppDt($scope.appDate);
            }
        });

        $calendar = calendarContainers.data('plugin_simpleCalendar');
    }

    $scope.init = function () {



        $scope.listval = [];
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];

        $scope.checkval = doctorinfo.doctordata.UserParentBranch;
        angular.forEach($scope.checkval, function (item) {
            $scope.listval.push(item.OrganizationId);
        });

        if ($scope.RoleId === 1 || $scope.RoleId === 3 || $scope.RoleId === 4 || $scope.RoleId === 43 || $scope.RoleId === 16 || $scope.RoleId === 56 || $scope.RoleId === 57) {
            var doctorMinpercaseval = doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase;
            var doctorTeleMinpercaseval = doctorinfo.doctordata.UserAddress[0].ExtDetails.TeleMinPerCase;
            if ($scope.appCondate === undefined || $scope.appCondate === '') {
                if (doctorMinpercaseval === 60) {
                    $scope.patinet_consultationTime = '1h';
                    $scope.patinet_consultationTimeDisplay = '1 hr(s)';
                } else {
                    $scope.patinet_consultationTime = doctorMinpercaseval + 'm';
                    $scope.patinet_consultationTimeDisplay = doctorMinpercaseval + ' mins';
                }
            }
        }

        getHospitalAndDocterList();

        if ($scope.appCondate) {

            $scope.BindStartAppTime = $scope.appCondate[0];
            cacheStorageItem.PreviousAppointmentTime = angular.copy($scope.BindStartAppTime);
            $scope.BindEndAppTime = $scope.appCondate[1];
            $scope.patientAppointmentID = $scope.appCondate[2];
            $scope.othervisitrsn = $scope.appCondate[3];
            $scope.visitrsnId = $scope.appCondate[5];
            $scope.visitremarks = $scope.appCondate[6];
            var AppstartTime = moment($scope.BindStartAppTime, "HH:mm");
            var AppendTime = moment($scope.BindEndAppTime, "HH:mm");

            var mins = moment.utc(moment(AppendTime, "HH:mm").diff(moment(AppstartTime, "HH:mm"))).format("m");
            var hrs = AppendTime.diff(AppstartTime, 'h');
            var finaltime = AppendTime.diff(AppstartTime, 'h') + " Hrs and " + mins + " Mns";
            $scope.appTimeinMins = mins + "m";
            $scope.appTimeinHrs = hrs + "h";

            if (mins && parseInt(mins) > 0) {
                $scope.patinet_consultationTime = $scope.appTimeinMins;
                $scope.patinet_consultationTimeDisplay = mins + ' mins';
            } else if (hrs && parseInt(hrs) > 0) {
                $scope.patinet_consultationTime = $scope.appTimeinHrs;
                $scope.patinet_consultationTimeDisplay = hrs + ' hr(s)';
            }
        } else {
            $scope.BindStartAppTime = '';
            $scope.BindEndAppTime = '';
        }

        $scope.MasterReferralSource();
        $scope.GetAllRelationshipTypes();
        $scope.GetAllBookingTypes();
        // $scope.getOrganizationTOSCodes();
        $scope.getBranchAppointmentTypes(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
        $scope.GetVisitReasonNew();
    };

    $scope.ConsultationType.typename = consultationtype ? 'VideoConsultation' : 'PhysicalConsultation';

    $scope.ChangeGenderByTitle = function (item) {
        if (item === "Mr" || item === "Master") {
            $scope.selectedPatientObj.PatientGender = 'Male';
        }
        else if (item === "Mrs" || item === "Miss" || item === "Baby" || item === "Ms") {
            $scope.selectedPatientObj.PatientGender = 'Female';
        }
        else {
            $scope.selectedPatientObj.PatientGender = "";
        }
    };

    eHnotePatientAddressDataServices.getPatientType(getPatientTypeSuccess, getPatientTypeFailed);
    function getPatientTypeSuccess(data) {
        $scope.patientTypeDetails = data;
        //angular.forEach($scope.patientTypeDetails, function (item) {
        //    var array_list = ['#2196F3', '#4CAF50', '#E53935', '#FB8C00'];
        //    // var val = array_list[Math.floor(Math.random() * array_list.length)];
        //    //item.colors = val;
        //    if (item.patienttypeId === 1) {
        //        item.color = array_list[0];
        //    }
        //    else if (item.patienttypeId === 2) {
        //        item.color = array_list[1];
        //    }
        //    else if (item.patienttypeId === 3) {
        //        item.color = array_list[2];
        //    }
        //    else if (item.patienttypeId === 4) {
        //        item.color = array_list[3];
        //    }
        //});

        $scope.selectedPatientObj.PatientType = $scope.patientTypeDetails[0].patienttypeId;
        $scope.selectedPatientObj.PatientTypeName = $scope.patientTypeDetails[0].PatientType;
    }
    function getPatientTypeFailed(data) {
    }

    $scope.getType = function (item) {
        $scope.altertype = item;
    }


    $scope.changeReferral = function (selectedReferral) {
        selectedReferral = selectedReferral || "";
        $scope.ShowRefferallist = false;
        if (selectedReferral === null) {
            $scope.selectedPatientObj.ReferralSource = "";
            $scope.selectedPatientObj.ReferralSourceId = "";
            $scope.selectedPatientObj.ReferralSourceName = "";
        } else {
            $scope.selectedPatientObj.ReferralSource = selectedReferral;
            $scope.selectedPatientObj.ReferralSourceId = selectedReferral.ReferralID;
            $scope.selectedPatientObj.ReferralSourceName = selectedReferral.ReferralTitle;
        }


    };
    $scope.selectedPatientObj = {
        "PatientName": "",
        "PatientDisplayId": "",
        "OldPatientDisplayId": "",
        "NewpatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
        "FollwuppatSearchType": "2",   // '1' for Mr.No /mobile ,'2' for Name search"
        "PatientId": 0,
        "PatientDOB": "",
        "PatientAge": "",
        "PatientAgeInYears": "",
        "PatientAgeInMonths": "",
        "PatientAgeInDays": "",
        "PatientRefferal": "",
        "PatientMobile": "",
        "CountryCode": "91",
        "PatientGender": 'Male',
        "IsNewPatient": "Old",
        "AgeInYears": "",
        "AgeInMonths": "",
        "AgeInDays": "",
        "DOB": "",
        "ReferralSourceId": 0,
        "ReferralSource": "",
        "ReferralSourceName": "",
        "PatientTitle": "Mr",
        "PatientType": 1,
        "referralSource": "",
        "PatientTypeName": "General",
        "FirstName": "",
        "MiddleName": "",
        "LastName": "",
        "MasterReferralSourceId": "",
        "MasterReferralSourceName": "",
        "BSMSind": false,
        "ContactNo": "",
        "emgymobilenumber": "",
        "emgyname": "",
        "emgyrelationship": "",
        "AttenderName": "",
        "DOBSearch": "",
    };

    //$scope.prevSurgeriesList = [];
    //$scope.PrevSurgeriesByPatientId();
    //$scope.PrevSurgeriesByPatientId = function () {  $scope.selectedPatientObj.PatientId || 0  '160242'
    var inputParams = {
        "PatientId": $scope.selectedPatientObj.PatientId || 0,
        "DoctorId": doctorinfo.doctorid,
        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
    };
    if (inputParams.PatientId !== 0) {
        eHnoteDiagnosisDataServices.GetFollowupSurgeries(inputParams).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.SurgeriesList = resp.data.rows;
                    $scope.AdmissionId = resp.data.rows[0].AdmissionId;
                }
            }

            console.log($scope.appointmentInfo.PreviouslyDoneSurgeryId);
            if ($scope.appointment_type.AppointmentTypeId == 11) {
                $scope.followUpObj.OrganizationSurgeryId = $scope.appointmentInfo.PreviouslyDoneSurgeryId || "";
                $scope.isSurgery = true;
            }
        });
    }

    $scope.clinicDoctorList = [];
    $scope.clinicOptometristsList = [];
    $scope.clinicARAssistantList = [];

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
        }];
    };
    $scope.GetOrganNameList = angular.copy($scope.GetOrganName()) || [];
    $scope.OrganObj = {
        "SelectOrganName": ""
    }
    // $scope.SelectOrganName = "";
    if ($scope.pagename === "rebook" || $scope.pagename === "reschedule") {
        if ($scope.appointmentInfo.DoctorVisitRsnID === undefined) {
            $scope.appointment_type.AppointmentTypeId = $rootScope.appointment_type;
        } else {
            $scope.appointment_type.AppointmentTypeId = $scope.appointmentInfo.DoctorVisitRsnID;
        }
        //$scope.InvestigationList = $scope.appointmentInfo.InvestigationList || [];
        // eHnoteMainAppointmentService.GetAdvisedInvestigationsByAppointmentId($scope.appointmentInfo.AppointmentID).then(function (resp) {
        eHnoteMainAppointmentService.GetAdvisedInvestigationsByAppointmentId($scope.appCondate[2]).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    $scope.InvestigationList = resp.data.rows || [];
                    if ($scope.InvestigationList.length > 0) {
                        angular.forEach($scope.InvestigationList, function (mitem) {
                            //  mitem.PatientInvestigationId = 0;
                            mitem.SelectOrganName = mitem.OrganId.toString();
                            //var List = $filter("filter")($scope.GetOrganNameList, { "OrganId": mitem.OrganId }, true)[0];
                            //mitem.SelectOrganName = List;
                            //$scope.OrganObj.SelectOrganName = List;
                        });
                    }
                }
            }
        }, function (err) { console.log(err); alertify.error("Getting  Investigations Failed"); });
        // eHnoteMainAppointmentService.GetAppointmentNoteByAppointmentId($scope.appointmentInfo.AppointmentID).then(function (resp) {
        /* eHnoteMainAppointmentService.GetAppointmentNoteByAppointmentId($scope.appCondate[2]).then(function (resp) {
             if (resp.data.Status === 'Success') {
                 if (resp.data.rows.length > 0) {
                     $scope.paymentTypeObj.AppointmentNotesList = resp.data.rows || [];
                 }
             }
         }, function (err) { console.log(err); alertify.error("Getting  AppointmentNote Failed"); });*/
        $scope.paymentTypeObj.AppointmentNotesList = [];
        $scope.paymentTypeObj.AppointmentNotesList = AppointmentDetailsById.AppointmentNotes || [];

        angular.forEach($scope.paymentTypeObj.AppointmentNotesList, function (appointitem) {
            appointitem.CreatedDt = $filter('date')(appointitem.CreatedDt, "MM-dd-yyyy,hh:mm a");
        });

        eHnoteMainAppointmentService.GetAppointmentSurgeryListByAppointmentId($scope.appCondate[2]).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    $scope.SurgeryList = [];
                    $scope.SurgeryList = resp.data.rows || [];
                    $scope.Selectedsurgeryobj = $scope.SurgeryList[0].SurgeryName;
                }
            }
        }, function (err) { console.log(err); alertify.error("Getting  AppointmentNote Failed"); });


        if ($scope.InvestigationList.length > 0) {
            angular.forEach($scope.InvestigationList, function (mitem) {
                mitem.PatientInvestigationId = 0;
                mitem.SelectOrganName = mitem.OrganId.toString();
                //var List = $filter("filter")($scope.GetOrganNameList, { "OrganId": mitem.OrganId }, true)[0];
                //mitem.SelectOrganName = List;
                //$scope.OrganObj.SelectOrganName = List;
            });
        }
    } else if ($scope.pagename === "surgery" || $scope.pagename === "surgeryFileUpload") {
        $scope.appointment_type.AppointmentTypeId = "8";
    } else {
        $scope.appointment_type.AppointmentTypeId = $rootScope.appointment_type;
    }
    //eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
    //function onspecsuccess(data) {
    //    $scope.specialitylist = data;
    //    var specAll = { "Id": 0, "Name": "All" };
    //    $scope.specialitylist.unshift(specAll);
    //    $scope.selectedSpecialization = $scope.specialitylist[0];
    //}

    //function onspecfailure(data) {
    //}


    $scope.patientInsuranceTpasArray = [];
    $scope.init();
    $scope.NoOfFollowUpDays = 0;

    $scope.GetVisitReason = function (val) {
        if (val.length > 0) {
            var getParams = {
                // "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "OrganizationId": $scope.SelectedBranchId,
                "ReasonTypeId": 1,
                "SearchText": val,
                "VisitTypeId": $scope.appointment_type.AppointmentTypeId || null
            };
            return eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
                if (resp.data !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        }
    };

    $scope.getOrgDiagSurgeries = function (text, Type) {
        if (Type === 2) {
            var params = {
                "HospitalId": $scope.SelectedBranchId,
                "AllBranchInd": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": '',
                "CPTSearchText": text,
                "SurgeryCategoryId": null,
                "Type": '',
                "UserId": $scope.UserId
            };
        } else {
            var params = {
                "HospitalId": $scope.SelectedBranchId,
                "AllBranchInd": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": text,
                "SurgeryCategoryId": null,
                "Type": '',
                "UserId": $scope.UserId,
                "CPTSearchText": ""
            };
        }
        if (text === "") {
            params.Type = 'C';
        } else {
            params.Type = 'O';
        }
        return eHnoteSurgeryService.GetOrganizationSurgeries(params, "Get").then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    if (text === "") {
                        var obj = {
                            "SurgeryId": "",
                            "SurgeryName": "Frequently Added"
                        };
                        response.data.rows.unshift(obj);
                    }
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    function getAllClinics() {
    }

    $scope.selectedPatientObj.AltCountrycode = "+91";
    $scope.isSearchedPatientNotAvailable = false;
    $scope.SearchByText = function (text, type) {

        $scope.patients = [];
        $scope.isregisterBtn = false;
        $scope.isSearchedPatientNotAvailable = false;

        $scope.ConsultationType.typename = consultationtype ? 'VideoConsultation' : 'PhysicalConsultation';

        if ($scope.ConsultationType.typename === 'VideoConsultation') {
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 3 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = List[0] || "";
                    $scope.selectBookingType.selectedBookAppo = 3;
                    $scope.selectBookingType.IsWalkInSlot = false;
                }
            }
            $scope.BookingType = 3;
        } else {
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 3 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = List[0] || "";
                    $scope.selectBookingType.selectedBookAppo = "3";
                    $scope.selectBookingType.IsWalkInSlot = false;
                }
            }
            $scope.BookingType = 3;
            $scope.IsCheckIn = 1;
        }




        if (type === 'Name') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = text;
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
        }
        else if (type === 'OldDisplayId') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = text;
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
        }
        else if (type === 'DOBSearch') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            text = text + " 00:00:00";
            //text = $filter('date')(new Date(text), "yyyy-MM-dd");
            //$scope.selectedPatientObj.DOBSearch = text;
            var parsedDate = new Date(text);
            if (!isNaN(parsedDate.getTime())) {
                text = $filter('date')(parsedDate, "yyyy-MM-dd");
                $scope.selectedPatientObj.DOBSearch = text;
            } else {
                // Log an error or handle the invalid date case
                alertify.error("Invalid date format:", text);
                // Return false or handle the error in another way
                text = "";
                return false;
            }
        }
        else {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientDisplayId = text;
            $scope.selectedPatientObj.PatientMobile = "";
        }

        $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.IsNoPatienthere = false;

        var name = $scope.selectedPatientObj.PatientName;
        var patDispId = "";
        patDispId = $scope.selectedPatientObj.PatientDisplayId ? $scope.selectedPatientObj.PatientDisplayId : "";
        var patOldDispId = "";
        patOldDispId = $scope.selectedPatientObj.OldPatientDisplayId ? $scope.selectedPatientObj.OldPatientDisplayId : "";
        var patMobile = "";
        patMobile = $scope.selectedPatientObj.PatientMobile ? $scope.selectedPatientObj.PatientMobile : "";


        if ($scope.pagename === "FollowUp") {
            $scope.appointment_type.AppointmentTypeId = "3";
        } else {
            $scope.appointment_type.AppointmentTypeId = "1";
        }

        if ((name === "" || name.length < 3) && (patDispId === "") && (patOldDispId === "") && (patMobile === "")) {

            if ($scope.pagename === "FollowUp") {
                $scope.appointment_type.AppointmentTypeId = "3";
            }
            if ($scope.selectedPatientObj.DisplayID !== "" && $scope.selectedPatientObj.DisplayID !== undefined) {
                $scope.appointment_type.AppointmentTypeId = "5";
            }
            else {
                $scope.appointment_type.AppointmentTypeId = "1";
            }
            $scope.IsNumberaddPatient = false;
            return;
        } else {
            if ($scope.selectedPatientObj.PatientName.length >= 3 || $scope.selectedPatientObj.PatientDisplayId.length >= 10 || $scope.selectedPatientObj.OldPatientDisplayId.length >= 2 || $scope.selectedPatientObj.PatientMobile.length >= 10) {
                var param = {
                    "PageSize": 30,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "SearchText": $scope.selectedPatientObj.PatientName,
                    "PatientDisplayId": $scope.selectedPatientObj.PatientDisplayId,
                    "OldPatientMRNO": $scope.selectedPatientObj.OldPatientDisplayId,
                    "PageNumber": 1,
                    "StartAge": 0,
                    "PhoneNumber": "",
                    "EndAge": 0,
                    "IncludeCommDetails": "Y",
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "SearchMobile": 0
                };
                if (name !== "") {
                    if (!isNaN(name)) {


                        if (name.length < 10) {
                            $scope.IsNumberaddPatient = false;
                            return;
                        }


                        param.PhoneNumber = name;
                        param.hasparam = true;
                        if (name.length === 10) {
                            $scope.IsNumberaddPatient = true;
                        } else {
                            $scope.IsNumberaddPatient = false;
                        }
                    } else {
                        param.SearchText = name;
                        param.hasparam = true;
                        $scope.IsNumberaddPatient = false;
                    }
                }
                if (patMobile !== "") {
                    param.SearchText = parseInt(patMobile);
                    param.PhoneNumber = "";
                    // param.SearchText = "";
                }
                var loginfo = eHnoteLoginStatusService.getUserLoginDetails();
                if (loginfo.RoleID === 1) {
                    param.HospitalIDLst = [doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID];

                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                    eHnoteMasterDataService.addPatientSearchInfo(param);
                    InitialiseSearchParam();
                    $scope.morepatientdata = false;
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText || "",
                    }
                    if (object.SearchText === '') {
                        if (param.PatientDisplayId !== '') {
                            object.SearchText = param.PatientDisplayId;
                        } else {
                            object.SearchText = param.OldPatientMRNO;
                        }

                    }
                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                    // eHnotePatientDataService.SearchAllPatientData(object, OnGetSearchPatientSuccess, OnGetPatientError);
                } else {

                    if ($scope.listval.length > 0) {
                        param.HospitalIDLst = $scope.listval;
                    } else {
                        //$scope.listval.push(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);
                        $scope.listval.push(doctorinfo.doctordata.UserParentBranch[0].OrganizationId);
                    }
                    param.HospitalIDLst = $scope.listval;
                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                    eHnoteMasterDataService.addPatientSearchInfo(param);
                    InitialiseSearchParam();
                    $scope.morepatientdata = false;
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText,
                    }
                    if (object.SearchText === '') {
                        if (param.PatientDisplayId !== '') {
                            object.SearchText = param.PatientDisplayId;
                        } else {
                            object.SearchText = param.OldPatientMRNO;
                        }

                    }
                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                    //eHnotePatientDataService.SearchAllPatientData(object, OnGetSearchPatientSuccess, OnGetPatientError);
                }
            } else {
                $scope.IsNumberaddPatient = false;
            }
        }
    };
    function OnGetSearchPatientSuccess(data) {



        if (data.rows !== undefined) {
            var chkSearchParam = eHnoteMasterDataService.getPatientSearchInfo();
            patientIDcache = cacheStorageItem.patientid;
            $scope.showRegisterPatient = false;
            $scope.patients = angular.copy(data.rows);
            console.log($scope.patients);


            $scope.IsPatientRegistrationShow = false;
            angular.forEach($scope.patients, function (item) {
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var value = array_list[Math.floor(Math.random() * array_list.length)];
                item.colors = value;

                var PhoneNumber = item.PhoneNumber || 0;
                PhoneNumber = PhoneNumber.toString();
                if (PhoneNumber.length > 0) {
                    var number = PhoneNumber;
                    item.HomeNumber = item.HomeNumber || "";
                    if (item.HomeNumber != '') {
                        number = item.AltCountryCode + '-' + item.HomeAreaCode + '-' + item.HomeNumber;
                    } else {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                    }
                    item.TempPhNumber = number;
                } else {
                    item.TempPhNumber = "";
                }

            });
            $scope.isregisterBtn = false;

            $scope.IsNumberaddPatient = false;

            if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
                $scope.IsNumberaddPatient = true;
            }

        } else {
            $scope.patients = [];
            $scope.isregisterBtn = true;
            $scope.isSearchedPatientNotAvailable = true;

            if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
                $scope.IsNumberaddPatient = true;
                if (!isNaN($scope.selectedPatientObj.PatientName)) {
                    if ($scope.selectedPatientObj.PatientName.length > 10) {
                        $scope.IsNumberaddPatient = false;
                    }
                }
            } else {
                $scope.IsNumberaddPatient = true;
            }
        }
    }
    function OnGetPatientError(err) {
        console.log(err);
    }
    $scope.changeMasterMobileNumber = function (mobilenumber) {
        if (mobilenumber !== undefined) {
            if (mobilenumber.length === 10) {
                var param = {
                    "PageSize": 30,
                    "PageNumber": 1,
                    "PhoneNumber": mobilenumber,
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
                };
                eHnotePatientDataService.SearchMasterPatient(param, OnGetPatientSuccess, OnGetPatientError1);

            } else {
                $scope.patients = [];
                $scope.selectedPatientObj.PatientMobile = "";
                $scope.ShowAddNew = false;
                $scope.DefaultShowDetails = false;
                $scope.ShowSearchAndClear = true;
                $scope.ShowDefaultButtons = true;

            }
        }

    };
    function OnGetPatientSuccess(data) {
        $scope.showloading = false;
        if (data.count > 0) {
            $scope.patients = data.rows;
            $scope.ShowAddNew = true;

        } else {
            if ($scope.patients.length === 0) {
                // $scope.patientinfo.patientPhone[0].PhNumber = $scope.mobilenumber || "";
                $scope.ShowAddNew = true;
            } else {
                $scope.selectedPatientObj.PatientMobile = "";
            }
        }


    }
    function OnGetPatientError1(data) {
        $scope.showloading = false;
        alertify.log("Error");
    }

    $scope.AddNewPatientfromRegistration = function (mobilenumber) {
        $scope.ShowAddNew = false;
        $scope.DefaultShowDetails = true;
        $scope.selectedPatientObj.PatientMobile = mobilenumber;
        $scope.selectedPatientObj.IsNewPatient = 'New';
        $scope.isPatientExist = false;
        $scope.ShowSearchAndClear = false;
        $scope.ShowDefaultButtons = false;
    }

    $scope.getaltMobType = function (item) {
        $scope.alterMobtype = item;
        $scope.countrycode = "+91";
    }

    $scope.selectedPatientFromGlobal = function (patientitem, type, mobilenumber) {
        $scope.DefaultShowDetails = true;
        $scope.ShowDefaultButtons = false;
        if (type === 1) {
            $scope.selectedPatientObj.PatientId = patientitem.Patient[0].PatientId;
            $scope.selectedPatientObj.FirstName = patientitem.Patient[0].FirstName;
            $scope.selectedPatientObj.MiddleName = patientitem.Patient[0].MiddleName;
            $scope.selectedPatientObj.LastName = patientitem.Patient[0].LastName;
            $scope.selectedPatientObj.PatientTitle = patientitem.Patient[0].Title;
            $scope.selectedPatientObj.S3URL = patientitem.Patient[0].S3URL || "";
            $scope.selectedPatientObj.PatientName = patientitem.Patient[0].FullName;
            $scope.selectedPatientObj.PatientDisplayId = patientitem.Patient[0].PatientDisPlayID;
            $scope.selectedPatientObj.PatientType = patientitem.Patient[0].PatientTypeId;
            $scope.selectedPatientObj.PatientTypeName = patientitem.Patient[0].PatientTypeName;
            $scope.selectedPatientObj.AgeInYears = patientitem.Patient[0].AgeInYears;
            $scope.selectedPatientObj.AgeInMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
            $scope.selectedPatientObj.AgeInDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
            $scope.selectedPatientObj.PatientGender = patientitem.Patient[0].Gender;
            $scope.selectedPatientObj.DOB = patientitem.Patient[0].DOB;
            $scope.selectedPatientObj.AlternatePhoneNo = patientitem.Patient[0].AlternatePhoneNo;
            $scope.selectedPatientObj.AlternateLandLine = patientitem.Patient[0].AlternateLandLine;
            $scope.selectedPatientObj.AltCountrycode = patientitem.Patient[0].AltCountryCode;
            $scope.selectedPatientObj.AltareaCode = patientitem.Patient[0].Altareacode;
            patientitem.PatientPhone[0].PhNumber = patientitem.PatientPhone[0] ? patientitem.PatientPhone[0].PhNumber === 0 ? '' : patientitem.PatientPhone[0].PhNumber : "";
            if (patientitem.PatientPhone[1]) {
                patientitem.PatientPhone[1].PhNumber = patientitem.PatientPhone[1] ? patientitem.PatientPhone[1].PhNumber === 0 ? '' : patientitem.PatientPhone[1].PhNumber : "";
            } else {
                var obj = {
                    "PhCntryCD": "91",
                    "PhAreaCD": "546564",
                    "PhNumber": "",
                    "PhType": "M"
                }
                patientitem.PatientPhone.push(obj);
            }
            $scope.selectedPatientObj.PatientMobile = patientitem.PatientPhone[0] ? patientitem.PatientPhone[0].PhNumber === 0 ? '' : patientitem.PatientPhone[0].PhNumber : "";
            $scope.selectedPatientObj.ContactNo = patientitem.PatientPhone[1] ? patientitem.PatientPhone[1].PhNumber === 0 ? '' : patientitem.PatientPhone[1].PhNumber : "";
            $scope.selectedPatientObj.CreatedDt = patientitem.Patient[0].CreatedDt;
            $scope.ShowSearchAndClear = false;
        }
        else if (type === 2) {
            $scope.selectedPatientObj.PatientMobile = mobilenumber;
            $scope.selectedPatientObj.IsNewPatient = 'New';
            $scope.isPatientExist = false;
            $scope.ShowSearchAndClear = false;
        }
        $scope.ShowAddNew = false;
    }

    $scope.PreviousTab = function () {
        $scope.RegistrationTab = 1;
        $scope.ShowSearchAndClear = false;
        $scope.IsPatientRegistrationShow = true;
    }

    $scope.NextTab = function () {
        if ($scope.selectedPatientObj.IsNewPatient === "New") {
            if (!$scope.isPatientExist) {
                if ($scope.selectedPatientObj.FirstName.length < 1 || $scope.selectedPatientObj.FirstName === undefined) {
                    alertify.error("First Name Is Mandatory");
                    return false;
                }


                if ($scope.selectedPatientObj.DOB === "" && $scope.selectedPatientObj.AgeInYears === "" && $scope.selectedPatientObj.AgeInMonths === "" && $scope.selectedPatientObj.AgeInDays === "") {
                    alertify.error("DOB / Age Is Mandatory");
                    return false;
                }
                else if ($scope.selectedPatientObj.DOB !== "") {
                    var today = $filter("date")(new Date(), "dd-MMM-yyyy");
                    if ($scope.selectedPatientObj.DOB === today) {
                        alertify.error("Future Dates Not Allowed");
                        return false;
                    }
                }
                $scope.selectedPatientObj.PatientMobile = $scope.selectedPatientObj.PatientMobile || "";
                if ($scope.IsMobileNoManadatory) {

                    if ($scope.selectedPatientObj.PatientMobile === "") {
                        alertify.error("Mobile Number Is Mandatory");
                        return false;
                    }
                }

                //if ($scope.selectedPatientObj.PatientMobile === "") {
                //    alertify.error("Mobile Number Is Mandatory");
                //    return false;
                //}
            }

            if ($scope.SpecializationId === 2) {//dental 

                if ($scope.selectedPatientObj.FirstName === "") {
                    alertify.error("First Name Is Mandatory");
                    return false;
                }
                if ($scope.selectedPatientObj.DOB === "" && $scope.selectedPatientObj.AgeInYears === "" && $scope.selectedPatientObj.AgeInMonths === "") {
                    alertify.error("DOB / Age Is Mandatory");
                    return false;
                }
                $scope.selectedPatientObj.PatientMobile = $scope.selectedPatientObj.PatientMobile || "";
                if ($scope.selectedPatientObj.PatientMobile === "") {
                    alertify.error("Mobile Number Is Mandatory");
                    return false;
                }
                $scope.selectedPatientObj.PatientEmail = $scope.selectedPatientObj.PatientEmail || '';
                if ($scope.selectedPatientObj.PatientEmail === "") {
                    alertify.error("Email Id Is Mandatory");
                    return false;
                }

                if ($scope.selectedPatientObj.ReferralSourceId === 0) {
                    alertify.error("Referral Is Mandatory");
                    return false;
                }
                if ($scope.IsEmergencyContactMandatory) {
                    $scope.selectedPatientObj.emgymobilenumber = $scope.selectedPatientObj.emgymobilenumber || "";
                    if ($scope.selectedPatientObj.emgymobilenumber === "") {
                        alertify.error("Emergency Contact Is Mandatory");
                        return false;
                    }
                }
            } else {
                if ($scope.selectedPatientObj.FirstName === "") {
                    alertify.error("First Name Is Mandatory");
                    return false;
                }
                if ($scope.selectedPatientObj.DOB === "" && $scope.selectedPatientObj.AgeInYears === "" && $scope.selectedPatientObj.AgeInMonths === "") {
                    alertify.error("DOB / Age Is Mandatory");
                    return false;
                }
                if ($scope.IsEmergencyContactMandatory && $scope.IsPatientRegistrationShow) {
                    $scope.selectedPatientObj.emgymobilenumber = $scope.selectedPatientObj.emgymobilenumber || "";
                    if ($scope.selectedPatientObj.emgymobilenumber === "") {
                        alertify.error("Emergency Contact Is Mandatory");
                        return false;
                    }
                }
            }
        }
        $scope.selectedPatientObj.PatientName = $scope.selectedPatientObj.FirstName + $scope.selectedPatientObj.LastName;
        $scope.isPatientExist = true;

        $scope.IsPatientRegistrationShow = false;
        $scope.ShowSearchAndClear = true;
        $scope.RegistrationTab = 2;
    }




    $scope.referralTitle = "";

    $scope.dynamicPopover = {
        "RefferalTemplateUrl": "AddRefferalTemplate.html",
        "Templatetitle": "Add Refferal",
        "isRefferalPopOverOpen": false
    };

    $scope.addRefferelPopup = false;
    $scope.openRefferalAddpopUpList = function () {
        $scope.referralTitle = $scope.selectedPatientObj.ReferralSourceName;
        $scope.ShowRefferallist = false;
        $scope.addRefferelPopup = true;
    };
    $scope.addReferral = function (ref) {
        $scope.referralTitle = ref;

        if ($scope.referralTitle === undefined || $scope.referralTitle === "") {
            alertify.error("Please Enter Referral Source");
            return;
        }
        $scope.selectedPatientObj.referralSource = $scope.selectedPatientObj.referralSource || "";

        if ($scope.selectedPatientObj.referralSource === "") {
            alertify.error("Please Choose Referral");
            $scope.addRefferelPopup = false;
            return;
        }
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "ReferralDesc": "Referral Description",
            "PageSize": 1000,
            "PageNumber": 1,
            "ActiveIND": "Y",
            "USRId": doctorinfo.doctorid,
            "ReferralTitle": $scope.referralTitle,
            "MasterReferralSourceId": $scope.selectedPatientObj.referralSource.MasterReferralSourceId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };

        eHnoteOrgReferralDataServices.AddUpdateReferralServicesList(params, onSuccess, onFailed);
        function onSuccess(data) {
            if (data.status === "Failure") {
                alertify.error("Referral Source already exist");
                $scope.referralTitle = "";
            } else {
                alertify.success('Added Successfully');
                if (data[0].rows.length > 0) {
                    $scope.addRefferelPopup = false;
                    $scope.IsbindindData = true;
                    $scope.dynamicPopover.isRefferalPopOverOpen = false;
                    getSourceListing("");

                }

            }
        }
        function onFailed(err) {
            console.log(err);
            alertify.error("Referral Source already exist");
        }
    };
    $scope.closeAddRefpopup = function () {
        $scope.addRefferelPopup = false;
        $scope.referralTitle = "";
    };

    $scope.RoomTypeList = [];
    eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
        $scope.RoomTypeList1 = resp.data;
        $scope.RoomTypeList = $filter("filter")($scope.RoomTypeList1, function (item, index) { return item.Id !== 3 && item.Id !== 4 && item.Id !== 5 && item.Id !== 6 && item.Id !== 7 && item.Id !== 8 });

        if ($scope.BookingType === 1) {
            if ($scope.RoomTypeList.length > 0) {
                var List1 = $filter("filter")($scope.RoomTypeList, { "Id": 10 }, true) || [];
                if (List1.length > 0) {
                    $scope.RoomSearchObj.RoomTypeobj = List1[0];
                    $scope.RoomSearchObj.RoomTypeId = List1[0].Id;

                    var params = {
                        "HospitalId": $scope.SelectedBranchId,
                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                        "SearchText": "",
                        "PageNumber": 1,
                        "PageSize": 100
                    }
                    eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                        if (data.Status === "Success") {
                            $scope.RoomListarray = data.rows || [];
                            if ($scope.RoomListarray.length > 0) {
                                $scope.RoomSearchObj.Roomobj = $scope.RoomListarray[0];
                                $scope.RoomSearchObj.RoomId = $scope.RoomListarray[0].RoomId;
                            }
                        } else {
                            $scope.RoomListarray = [];
                        }


                    }).error(function (error) {

                    });

                }
            }
        }

    }, function (err) {
        console.log(err);
        alertify.error("Getting Failed");
    });
    function bindInvestigationSlots(MinPerCaseval, type) {
        var currenttimewithZero = 0;

        //        var splitStrings = MinPerCaseval(':');
        //$scope.splitStrings1 = splitStrings[1].split(':');
        //console.log(splitStrings);
        //  console.log(document.getElementById('snapShot'));

        var str = MinPerCaseval.StartTime;
        var res = str.split(":");

        console.log(res);
        // MinPerCaseval = $scope.selectedDocObject.MinPerCase;
        if ($scope.selectedDocObject.selectedPerson !== "") {
            var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
            $scope.InvestigationsTimeValue = [];
            if (type === "current") {
                var count = 0;
                //var hourStartCount = type === "current" ? moment().format("HH") : 0;
                //var minutesStartCount = type === "current" ? moment().format("mm") : 0;
                var hourStartCount = res[0] || 0;
                var minutesStartCount = res[1] || 0;
                hourStartCount = parseInt(hourStartCount);
                minutesStartCount = parseInt(minutesStartCount);
                for (var i = hourStartCount; i <= 23; i++) {
                    count = 0;
                    var hr = i < 10 ? "0" + i : i;
                    var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
                    if (minutesStartCount > 0 && i === hourStartCount) {
                    } else {
                        $scope.InvestigationsTimeValue.push({ StartTime: hr + ":00" });
                        currenttimewithZero++;
                    }
                    if (minutesStartCount > parseInt(MinPerCaseval)) {
                        minutesStartCount = minutesStartCount - parseInt(MinPerCaseval);
                    } else if (minutesStartCount <= parseInt(MinPerCaseval)) {
                        minutesStartCount = 0;
                        if (currenttimewithZero === 0)
                            $scope.InvestigationsTimeValue.push({ StartTime: hr + ":00" });
                        currenttimewithZero++;
                    }
                    for (var j = 0; j <= minutesCount; j++) {
                        count = count + MinPerCaseval;
                        if (count < 60 && count > minutesStartCount) {
                            var minute = count < 10 ? "0" + count : count;
                            $scope.InvestigationsTimeValue.push({ StartTime: hr + ':' + minute });
                        }
                    }
                }
                //if ($scope.dateVal) {
                //    $scope.patinet_appStarttime = _.where($scope.setValue, { StartTime: moment($scope.dateVal).format("HH:mm") })[0];
                //    //$scope.dateVal = '';
                //} else {
                //    $scope.patinet_appStarttime = $scope.setValue[0];
                //}
            } else {
                var count = 0;
                for (var i = 0; i <= 23; i++) {
                    count = 0;
                    var hr = i < 10 ? "0" + i : i;
                    var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
                    $scope.InvestigationsTimeValue.push({ StartTime: hr + ":00" });
                    for (var j = 0; j <= minutesCount; j++) {
                        count = count + MinPerCaseval;
                        if (count < 60) {
                            var minute = count < 10 ? "0" + count : count;
                            $scope.InvestigationsTimeValue.push({ StartTime: hr + ':' + minute });
                        }
                    }
                }
                //if ($scope.dateVal) {
                //    $scope.patinet_appStarttime = _.where($scope.InvestigationsTimeValue, { StartTime: moment($scope.dateVal).format("HH:mm") })[0];
                //}
            }
            //if ($scope.appCondate) {
            //    if ($scope.InvestigationsTimeValue[0].StartTime > $scope.BindStartAppTime) {
            //        $scope.patinet_appStarttime = null;
            //    } else {
            //        $scope.FindTime = $filter("filter")($scope.InvestigationsTimeValue, { "StartTime": $scope.BindStartAppTime }, true);
            //        if ($scope.FindTime.length > 0) {
            //            $scope.patinet_appStarttime = $scope.FindTime[0];
            //        }
            //    }
            //}
        }
    }

    function ChangeSlotstoMaxAppointment(resp) {
        $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = false;
        if (resp.UserScheduleSlots.length > 0 && $scope.IsNoPatienthere == true) {
            var consul_date = "";
            if ($scope.pagename === "reschedule") {
                var d = $filter("date")($scope.dateVal, "dd-MMM-yyyy");
                consul_date = moment(d).format("MM-DD-YYYY");
            }
            var Appt_typeid = "";
            if ($scope.appointmentInfo != undefined) {
                if ($scope.appointmentInfo.DoctorVisitRsnID != undefined) {
                    Appt_typeid = $scope.appointmentInfo.DoctorVisitRsnID.toString() || "";
                }
            }

            if (($scope.pagename === "book" && $scope.IsNoPatienthere == true) || ($scope.pagename === "reschedule" && selectedDoctorinAppList.DoctorID != $scope.selectedDocObject.selectedPerson.DoctorID) || (consul_date != $scope.appDate) ||
                ($scope.pagename === "reschedule" && $scope.appointment_type.AppointmentTypeId !== Appt_typeid)) {
                var apptTypeId = parseInt($scope.appointment_type.AppointmentTypeId);
                resp.UserScheduleSlots[0].NewAppointmentMaxSlots = resp.UserScheduleSlots[0].NewAppointmentMaxSlots || 0;
                resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || 0;
                resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || 0;
                resp.UserScheduleSlots[0].ASCAppointmentMaxSlots = resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || 0;
                if (apptTypeId == 1) {
                    if (resp.UserScheduleSlots[0].NewAppointmentMaxSlots != 0) {
                        if (resp.DoctorNewAppointmentCount > resp.UserScheduleSlots[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserScheduleSlots[0].NewAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                            return false;
                        }
                    }
                }
                else if (apptTypeId == 2) {
                    if (resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots != 0) {
                        if (resp.DoctorClinicFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorClinicFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum Clinic followup appointments are reached for this doctor. Please choose another doctor");
                            return false;
                        }
                    }
                }
                else if (apptTypeId == 3) {
                    if (resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots != 0) {
                        if (resp.DoctorPostOpFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorPostOpFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum Post-Op followup appointments are reached for this doctor. Please choose another doctor");
                            return false;
                        }
                    }
                }
                else if (apptTypeId == 4 || apptTypeId == 14) {
                    if (resp.UserScheduleSlots[0].ASCAppointmentMaxSlots != 0) {
                        if (resp.DoctorAscAppointmentCount > resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserScheduleSlots[0].ASCAppointmentMaxSlots) {
                            $scope.IsMaxSlotsAppointmentRestrictionForDoctorInd = true;
                            alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                            return false;
                        }
                    }
                }
            }
        }
    }

    $scope.Endtimechange1 = function (starttime, Mainitem) {

        console.log(starttime.Available + "__Available");
        if (starttime.Available == "N") {
            alertify.error("Slot is not available ,unblock slot and continue");
            return false;
        }


        $scope.slot.patinet_appStarttime = starttime;

        if ($scope.slot.patinet_appStarttime === null) {
            $scope.slot.patient_appEndTime = "";
        }
        Mainitem.patinet_appStarttime = starttime.StartTime;
        $scope.AppointmentRescheduleObj.StartTime = $scope.slot.patinet_appStarttime.NewStartTime || "";
        $scope.RescheduleSlotsObj.IsStartandEndInd = false;

        $scope.setEndValues = [];
        var Index = $scope.setValue.findIndex(record => record.StartTime === $scope.slot.patinet_appStarttime.StartTime);
        if (Index > -1) {
            angular.forEach($scope.setValue, function (sitem, index1) {
                if (index1 >= Index) {
                    $scope.setEndValues.push(sitem);
                }
            });
        }
        //$scope.patient_appEndTime = $scope.patinet_appStarttime.EndTime || "";
        $scope.slot.patient_appEndTime = $scope.setEndValues[0].EndTime.toString();
        Mainitem.patient_appEndTime = $scope.setEndValues[0].EndTime.toString();
        console.log($scope.setEndValues[0]);


        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
        var inputParams = {
            "Date": appointmentDate,
            "SlotTime": starttime.StartTime,
            "UserScheduleId": $scope.isAppValiddities.UserScheduleId || 0,
            "DoctorId": $scope.selectedDocObject.selectedPerson.DoctorID,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        console.log(inputParams);


        eHnoteDiagnosisDataServices.getParticualrTimeSlotDetailsById(inputParams).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                $scope.isAppValiddities.isEnableAlertType = false;
                $scope.isAppValiddities.isValidOptionSelected = true;
                $scope.isAppValiddities.VisitTypes = resp.data.rows || [];
                if ($scope.isAppValiddities.VisitTypes.length > 0) {
                    $scope.defaultDoctorVisit = $scope.isAppValiddities.VisitTypes[0];
                    $scope.othervisitrsn = $scope.defaultDoctorVisit.VisitReasonName;
                    $scope.visitrsnId = $scope.defaultDoctorVisit.VisitReasonId;
                    $scope.appointment_type.AppointmentTypeId = $scope.defaultDoctorVisit.VisitTypeId.toString();
                    $scope.visitremarks = $scope.defaultDoctorVisit.VisitRemarks || "";

                    ChangeSlotstoMaxAppointment($scope.MaxSlotsAppointmentCheckArray);
                } else {
                    //$scope.appointment_type.AppointmentTypeId = '';
                    //$scope.searchtext.visitreason = '';
                    //$scope.othervisitrsn = '';
                }
            }
        });
    }



    if ($scope.isPatientExist) {
        patientIDcache = cacheStorageItem.patientid;
        $scope.DisbledPatient = patientIDcache !== 0 ? true : false;
        var PatientName = cacheStorageItem.PatientName;
        $scope.selectedPatientObj.AttenderName = cacheStorageItem.AttenderName || "";
        var patientobj = {
            "PatientId": cacheStorageItem.patientid,
            "FullName": cacheStorageItem.PatientName,
            "PhoneNumber": cacheStorageItem.PhoneNumber,
            "CountryCode": cacheStorageItem.CountryCode,
            "EmailID": cacheStorageItem.EmailID,
            "PatientID": cacheStorageItem.patientid
        };
        var patientid = "";
        cacheStorageItem.patientid = cacheStorageItem.patientid || 0;
        if (cacheStorageItem.patientid != 0) {
            patientid = cacheStorageItem.patientid;
        } else {
            patientid = $scope.appointmentInfo.PatientID;
        }

        eHnoteAuditServices.getPatientDetailsById(patientid, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                if (data.Patient !== undefined) {
                    if (data.Patient.length > 0) {
                        $scope.selectedPatientObj.PatientId = data.Patient[0].PatientID;
                        $scope.selectedPatientObj.DisplayID = data.Patient[0].ClinicPreference.PatientDisPlayID;
                        $scope.selectedPatientObj.PatientName = data.Patient[0].FullName;
                        $scope.selectedPatientObj.S3URL = data.Patient[0].S3URL || "";
                        $scope.selectedPatientObj.PatientMobile = data.Patient[0].MobileNo;
                        $scope.selectedPatientObj.PatientGender = data.Patient[0].Gender;
                        $scope.selectedPatientObj.PatientAge = data.Patient[0].Age;
                        $scope.selectedPatientObj.CountryCode = data.Patient[0].PatientHomeCode || '+1';
                        $scope.selectedPatientObj.AgeInYears = data.Patient[0].AgeInYears;
                        $scope.selectedPatientObj.AgeInMonths = data.Patient[0].AgeInMonths;
                        $scope.selectedPatientObj.AgeInDays = data.Patient[0].AgeInDays;
                        $scope.selectedPatientObj.DOB = data.Patient[0].DOB;
                        $scope.selectedPatientObj.ReferralSourceId = data.Patient[0].PatientOtherDetails[0].ReferralID;
                        $scope.selectedPatientObj.ReferralSourceName = data.Patient[0].PatientOtherDetails[0].ReferralName;
                        $scope.selectedPatientObj.PatientTitle = data.Patient[0].Title;
                        $scope.selectedPatientObj.PatientEmail = data.Patient[0].EmailId;
                        $scope.selectedPatientObj.NewpatSearchType = "2";
                        $scope.selectedPatientObj.FollwuppatSearchType = "2";
                        $scope.selectedPatientObj.CreatedDt = data.Patient[0].CreatedDt;
                        $scope.selectedPatientObj.FirstName = data.Patient[0].FirstName;
                        $scope.selectedPatientObj.MiddleName = data.Patient[0].MiddleName;
                        $scope.selectedPatientObj.LastName = data.Patient[0].LastName;
                        $scope.selectedPatientObj.IsVIPInd = data.Patient[0].IsVIPInd;
                        $scope.selectedPatientObj.IsHighRiskInd = data.Patient[0].IsHighRiskInd;
                        $scope.selectedPatientObj.AlternateLandLine = data.Patient[0].AlternateLandLine;
                        $scope.selectedPatientObj.AlternatePhoneNo = data.Patient[0].AlternatePhoneNo;
                        $scope.selectedPatientObj.AltCountryCode = data.Patient[0].AltCountryCode;
                        $scope.selectedPatientObj.Altareacode = data.Patient[0].Altareacode;
                        $scope.selectedPatientObj.SSN = data.Patient[0].SocialSecurityNo || "";
                        $scope.selectedPatientObj.PatientMobile = data.Patient[0].PatientHomeNumber || "";
                        //$scope.selectedPatientObj.PatientTagId = data.Patient[0].PatientTagId || "";
                        $scope.HospitalEquipmentId = data.Patient[0].PatientTagId || "";

                        $scope.selectedPatientObj.AlternatePhoneNo = data.Patient[0].PatientOfficeNumber || 0;
                        $scope.selectedPatientObj.IsNoChargePatient = data.Patient[0].IsNoChargePatient;
                        $scope.GetSelectedPatientDetails(data.Patient[0], "Edit");
                        $scope.IsNoPatienthere = true;

                        cacheStorageItem.EmeregecyContactNo = data.Patient[0].EmeregecyContactNo;
                        cacheStorageItem.EmergencyContactName = data.Patient[0].EmergencyContactName;
                        cacheStorageItem.EmployerPhoneNo = data.Patient[0].EmployerPhoneNo;
                        cacheStorageItem.OccupationDescription = data.Patient[0].OccupationDescription;
                        cacheStorageItem.OccupationId = data.Patient[0].OccupationId;

                    }

                    var SSN = $scope.selectedPatientObj.SSN;
                    SSN = SSN || "";
                    SSN = $scope.selectedPatientObj.SSN.toString();
                    if (SSN.length > 0) {
                        var SSNnumber = SSN;
                        SSNnumber = SSNnumber.slice(0, 3) + '-' + SSNnumber.slice(3, 5) + '-' + SSNnumber.substring(5, 10);;
                        $scope.selectedPatientObj.TempSSNnumber = SSNnumber;
                    } else {
                        $scope.selectedPatientObj.TempSSNnumber = "";
                    }

                    //if ($scope.bookApptType === "FollowUp" && $scope.pagename === "directFollowup") {
                    if ($scope.bookApptType === "FollowUp") {


                        $rootScope.appointment_type = "3";
                        $scope.appointment_type.AppointmentTypeId = "3";
                        $scope.FollowupAppointments = [];
                        $scope.SelectedParentAppt = "";
                        $scope.RootAppointmentId = 0;
                        eHnoteDiagnosisDataServices.GetPatientFollowupAppointments($scope.selectedPatientObj.PatientId, $scope.SpecializationId).then(function (resp) {
                            if (resp.data !== undefined) {
                                if (resp.data.length > 0) {

                                    $scope.FollowupAppointments = resp.data;

                                    if (cacheStorageItem.IsTreatmentFollowupAppointment) {
                                        $scope.FollowupAppointments = $filter("filter")($scope.FollowupAppointments, function (item, index) {
                                            return (item.ChildAppointmentId === 0 || (item.ChildAppointmentId !== 0 && item.ChildAppointmentStatus === "C") || (item.ChildAppointmentId !== 0 && item.ChildAppointmentStatus === "B"));
                                        });
                                    } else {
                                        $scope.FollowupAppointments = $filter("filter")($scope.FollowupAppointments, function (item, index) {
                                            return (item.ChildAppointmentId === 0 || (item.ChildAppointmentId !== 0 && item.ChildAppointmentStatus === "C"));
                                        });
                                    }


                                    if ($scope.FollowupAppointments.length > 0) {

                                        if ($scope.patientAppointmentID === 0) {
                                            var assigneddoctorobj = $scope.FollowupAppointments;
                                            $scope.SelectedParentAppt = $scope.FollowupAppointments[0];
                                            $scope.RootAppointmentId = assigneddoctorobj[0].RootAppointmentId;
                                            if ($scope.RootAppointmentId === 0) {
                                                $scope.RootAppointmentId = assigneddoctorobj[0].AppointmentId;
                                            }
                                        } else {
                                            var assigneddoctorobj = $filter("filter")($scope.FollowupAppointments, { "AppointmentId": $scope.patientAppointmentID }, true);
                                            $scope.SelectedParentAppt = assigneddoctorobj[0];
                                            $scope.RootAppointmentId = assigneddoctorobj[0].RootAppointmentId;
                                            if ($scope.RootAppointmentId === 0) {
                                                $scope.RootAppointmentId = assigneddoctorobj[0].AppointmentId;
                                            }
                                        }
                                    }


                                }
                            }

                        });
                    }

                    if ($scope.bookApptType === "New" && $scope.appointment_type.AppointmentTypeId == 3) {

                        $rootScope.appointment_type = "3";
                        $scope.appointment_type.AppointmentTypeId = "3";
                        $scope.FollowupAppointments = [];
                        $scope.SelectedParentAppt = "";
                        $scope.RootAppointmentId = 0;
                        eHnoteDiagnosisDataServices.GetPatientFollowupAppointments($scope.selectedPatientObj.PatientId, $scope.SpecializationId).then(function (resp) {
                            if (resp.data !== undefined) {
                                if (resp.data.length > 0) {

                                    $scope.FollowupAppointments = resp.data;



                                    if ($scope.FollowupAppointments.length > 0) {
                                        $scope.IsnewFollowUp = true;
                                        if ($rootScope.appointmentParentId === 0) {
                                            //var assigneddoctorobj = $scope.FollowupAppointments;
                                            //$scope.SelectedParentAppt = $scope.FollowupAppointments[0];
                                            //$scope.RootAppointmentId = assigneddoctorobj[0].RootAppointmentId;
                                            //if ($scope.RootAppointmentId === 0) {
                                            //    $scope.RootAppointmentId = assigneddoctorobj[0].AppointmentId;
                                            //}
                                        } else {
                                            var assigneddoctorobj = $filter("filter")($scope.FollowupAppointments, { "AppointmentId": $rootScope.appointmentParentId }, true);
                                            $scope.SelectedParentAppt = assigneddoctorobj[0];
                                            $scope.RootAppointmentId = assigneddoctorobj[0].RootAppointmentId;
                                            if ($scope.RootAppointmentId === 0) {
                                                $scope.RootAppointmentId = assigneddoctorobj[0].AppointmentId;
                                            }
                                        }
                                    }


                                }
                            }

                        });
                    }
                }
            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }

        $scope.selectedPatInfo = patientobj;

        var patientid = "";
        cacheStorageItem.patientid = cacheStorageItem.patientid || 0;
        if (cacheStorageItem.patientid != 0) {
            patientid = cacheStorageItem.patientid;
        } else {
            patientid = $scope.appointmentInfo.PatientID;
        }

        eHnoteInsuranceService.getPatientInsuranceDtls(patientid).then(function (response) {
            console.log(response);
            $scope.mainOrgInsTpaArray = [];
            if (response.data !== undefined) {
                if (response.data.rows !== undefined) {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                        bitem.isCorporateType = false;
                        if (bitem.BillingCategoryTypeId === 15) {
                            bitem.isCorporateType = true;
                        }
                    });
                    $scope.PatientInsuranceObj = GetInsuranceObj();

                    $scope.paymentTypeObj.GETPatientInsuranceList = $scope.paymentTypeObj.GETPatientInsuranceList || [];
                    if ($scope.paymentTypeObj.GETPatientInsuranceList.length > 0) {
                        $scope.paymentTypeObj.PatientInsuranceList = angular.copy($scope.paymentTypeObj.GETPatientInsuranceList);

                        if ($scope.patientInsuranceTpasArray.length > 0) {
                            //$scope.paymentTypeObj.PatientInsuranceList = [];
                            angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {

                                angular.forEach($scope.paymentTypeObj.GETPatientInsuranceList, function (gitem, index) {
                                    var IdentifierId = "";
                                    if (bitem.PatientInsuranceDetailId == gitem.PatientInsuranceDetailId) {
                                        if (index == 0) {
                                            IdentifierId = 1;
                                            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = bitem;
                                            // $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.IdentifierId = 1;
                                            //IdentifierId = 1;
                                        } else if (index == 1) {
                                            IdentifierId = 2;
                                            $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = bitem;
                                            //$scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.IdentifierId = 2;
                                            // IdentifierId = 2;
                                        }

                                        $scope.PatientInsuranceObj = angular.copy(bitem);

                                        $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                                        $scope.PatientInsuranceObj.OrganizationPayorId = angular.copy($scope.PatientInsuranceObj.OrganizationPayorId);

                                        $scope.PatientInsuranceObj.PlanCode = angular.copy($scope.PatientInsuranceObj.PlanCode);
                                        $scope.PatientInsuranceObj.PlanName = angular.copy($scope.PatientInsuranceObj.PlanName);
                                        $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanCode);
                                        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = bitem.AppointmentInsuranceDetailId;

                                        if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                                            $scope.PatientInsuranceObj.setprimary = true;
                                        } else {
                                            $scope.PatientInsuranceObj.setprimary = false;
                                        }
                                    }
                                });
                            });
                        }
                    } else {
                        //  if ($scope.patientInsuranceTpasArray.length === 1) {
                        // $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                        //  }
                    }

                    if ($scope.pagename === "book") {
                        if ($scope.patientInsuranceTpasArray.length > 0) {
                            if ($scope.patientInsuranceTpasArray.length === 1) {
                                $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);


                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;

                                $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                            }
                            else if ($scope.patientInsuranceTpasArray.length > 1) {
                                var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                                if (filter1.length > 0) {
                                    $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                    $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                                    $scope.PatientInsuranceObj.setprimary = true;
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filter1[0];
                                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                    //  $scope.paymentTypeObj.PaymentTypeId = "2";
                                } else {
                                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                    $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                }

                                $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = filter1.AppointmentInsuranceDetailId;
                            }

                            $scope.paymentTypeObj.PaymentTypeId = "2";
                            $scope.paymentTypeObj.IsPaymentTypeInd = false;

                            if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                                $scope.PatientInsuranceObj.setprimary = true;
                            } else {
                                $scope.PatientInsuranceObj.setprimary = false;
                            }
                        } else {
                            $scope.PatientInsuranceObj.IdentifierId = 1;
                            $scope.PatientInsuranceObj.setprimary = true;
                        }
                    }
                    //else {
                    //  $scope.PatientInsuranceObj = GetInsuranceObj();
                    //}

                }
            }
        });

    }

    function InitialiseSearchParam() {
        $scope.patients = [];
        $scope.morepatientdata = true;
        var prevpagno = 0;
        var pageno = 0;
        $scope.pageno = 1;
    }

    $scope.visitTypeObj = {
        "Type": false
    };

    $scope.chgAppDt = function (dt) {

        /*$scope.appDate = moment(dt).format("DD-MMM-YYYY");*/
        $scope.appStartDate = $filter("date")(new Date(dt), "MMM d, yyyy");
        if (new Date(dt).valueOf() < new Date().setHours(0, 0, 0, 0)) {
            $scope.showAppNotification = false;
            $scope.notifySMS = false;
            $scope.notifyMAIL = false;
        } else {
            $scope.showAppNotification = true;
            $scope.notifySMS = true;
            $scope.notifyMAIL = false;
        }
        if ($scope.pagename !== "FollowUp") {

            if ($scope.IsComingFrom == 'Doctorcalendar') {
                $scope.Doctorcalendarobj.GetDate = $scope.appDate;
            }
            // $scope.changeAppointmentDoctor($scope.SelectedBranchDocId);
            $scope.getUserBranchslots($scope.SelectedBranchDocId);
        }
        if ($scope.pagename === "FollowUp") {
            var selectedAppointmentdate = $filter("date")(new Date(dt), "yyyy-MM-dd");
            var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
            var a = new Date(currentdate);
            var b = new Date(selectedAppointmentdate);
            a = moment(a);
            b = moment(b);
            cacheStorageItem.FollowUpDuration = b.diff(a, 'days');
            eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);

        }
        if ($scope.bookApptType === 'FollowUp') {
            $scope.AppDay = new Date(dt).getDay();
            if ($scope.AppDay === 0) {
                alertify.error("Your giving a FollowUp on Sunday");
            }
        }
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
        $scope.visitTypeObj.Type = false;
        if (appointmentDate > currentdate) {
            // $scope.IsCheckIn = false;
            //$scope.visitTypeObj.Type = true; // 02-09-2022
            $scope.IsCheckIn = 1;
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 3 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = List[0] || "";
                    $scope.selectBookingType.selectedBookAppo = "3";
                    $scope.selectBookingType.IsWalkInSlot = false;
                }
            }
            /*  if ($scope.BookingTypeList.length > 0) {
                  var List = $filter("filter")($scope.BookingTypeList, { "Id": 1 }, true);
                  if (List.length > 0) {
                      $scope.selectBookingType.selectedBookAppo = List[0] || "";
                      $scope.selectBookingType.selectedBookAppo = "1";
                  }
              }*/

            $scope.BookingType = 3;   //02-09-2022
            // $scope.BookingType = 1;   

            $scope.selectBookingType.IsAppointmentConfirmed = false;
            $scope.IsFutureDateInd = true;
        }
        else {
            $scope.IsCheckIn = 1; //2;
            if ($scope.BookingTypeList.length > 0) {
                var List = $filter("filter")($scope.BookingTypeList, { "Id": 3 }, true);
                if (List.length > 0) {
                    $scope.selectBookingType.selectedBookAppo = List[0] || "";
                    $scope.selectBookingType.selectedBookAppo = "3";
                    $scope.selectBookingType.IsWalkInSlot = false;
                }
            }
            $scope.BookingType = 3; //1;

            if ($scope.BookingType === 1) {
                $scope.selectBookingType.IsAppointmentConfirmed = true;
            } else {
                $scope.selectBookingType.IsAppointmentConfirmed = false;
            }
            $scope.IsFutureDateInd = false;
        }

        $scope.IsDoctorcalendarDate = true;
        $scope.IsReschduleSlotIND = true;
        $scope.AppointmentRescheduleObj.StartTime = "";
        $scope.RescheduleSlotsObj.IsStartandEndInd = false;
    };

    $scope.obj = {
        "SelectedInvestigationItem": ""
    };


    $scope.ChangeOrgan = function (aitem, item) {
        item.OrganId = aitem.toString();
        if (item.OrganId === "1") {
            item.OrganName = "OD";
        }
        else if (item.OrganId === "2") {
            item.OrganName = "OS";
        }
        else if (item.OrganId === "3") {
            item.OrganName = "OU";
        }
        else if (item.OrganId === "4") {
            item.OrganName = "General";
        }
        //item.OrganId = aitem.OrganId;
        // item.OrganName = aitem.OrganName;
    };
    $scope.ChangeEndtime = function (titem, item) {
        item.Time = titem.StartTime;
    };
    // $scope.GetOrganNameList = angular.copy($scope.GetOrganName()) || [];
    $scope.getNewOrgInvestigations = function (SearchText) {
        var params = {
            "InvSpecialityId": 0,
            "HospitalId": $scope.selectedBranchobj.ClinicId || doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "GetAllIndicator": 0,
            "GetAllSpecialityInd": 1,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": SearchText || "",
        };
        return eHnoteLabService.getOrganizationInvestigationData(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                //  $scope.obj.AddInvestigation = false;
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
            else {
                $scope.obj.AddInvestigation = true;
            }
        });
    };
    $scope.onselectOrgInvestigation = function (item) {
        console.log(item);
        var obj = {
            "PatientInvestigationId": 0,
            "InvestigationId": item.InvestigationId,
            "InvestigationName": item.InvestigationName,
            "OrgInvestigationId": item.OrgInvestigationId,
            "InvSpecialityId": item.InvSpecialityId,
            //"InvGroupName": item.InvGroupName,
            // "InvGroupId": item.InvGroupId,
            //  "SelectOrganName": "",
            "OrganId": "",
            "OrganName": "",
            "Time": "",
            "DeleteInd": false,
            "SelectOrganName": ""
        }

        var i = 0;
        if ($scope.InvestigationList.length > 0) {
            angular.forEach($scope.InvestigationList, function (item) {
                if (item.InvestigationId === obj.InvestigationId && item.DeleteInd === false) {
                    alertify.error('You already entered this Investigation');
                    i++;
                    return false;
                }
            });
        }
        if (i === 0) {
            $scope.InvestigationList.push(obj);
        }

        //$scope.obj = {
        //    "SelectedInvestigationItem": ""
        //}; 
        $scope.obj.SelectedInvestigationItem = "";

    };

    $scope.removeInvestigation = function (item, index) {
        item.DeleteInd = true;
        //   $scope.InvestigationList.splice(index, 1);
    }

    $scope.IsnewFollowUp = false;


    $scope.OnSelectApprovedAppt = function (item) {
        $scope.SelectedParentAppt = angular.copy(item);
    };

    $scope.apptypechange = function (appointment_type) {

        $scope.IsApptTypeChangeEvent = true;
        $scope.SurgeryList = [];
        if ($scope.SpecializationId === 3) {
            if (appointment_type === '10') {
                $scope.RoomTypeList = $filter("filter")($scope.RoomTypeList1, function (item, index) { return item.Id !== 6 && item.Id !== 7 });
            } else {
                $scope.RoomTypeList = $filter("filter")($scope.RoomTypeList1, function (item, index) { return item.Id !== 5 && item.Id !== 6 && item.Id !== 7 });
            }
        }
        if (appointment_type === '11' || appointment_type === '14') {

            var inputParams = {
                "PatientId": $scope.selectedPatientObj.PatientId || 0,
                "DoctorId": doctorinfo.doctorid,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
            };
            if (inputParams.PatientId !== 0) {
                eHnoteDiagnosisDataServices.GetFollowupSurgeries(inputParams).then(function (resp) {
                    if (resp.data !== undefined) {
                        if (resp.data.rows.length > 0) {
                            $scope.SurgeriesList = resp.data.rows;
                            $scope.AdmissionId = resp.data.rows[0].AdmissionId;
                        } else {
                            alertify.error("No Previous Surgeries Added For this Patient");
                            return false;
                        }
                    }
                    $scope.followUpObj.OrganizationSurgeryId = $scope.appointmentInfo.PreviouslyDoneSurgeryId || "";
                    $scope.isSurgery = true;
                });

            }
        };

        $scope.selectedPatientObj.PatientId = $scope.selectedPatientObj.PatientId || 0;


        $scope.appointment_type.AppointmentTypeId = appointment_type;

        if ($scope.bookApptType === "New" && (appointment_type === '3' || appointment_type === '13')) {


            eHnoteDiagnosisDataServices.GetPatientFollowupAppointments($scope.selectedPatientObj.PatientId, $scope.SpecializationId).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.length > 0) {

                        $scope.FollowupAppointments = [];
                        $scope.SelectedParentAppt = "";
                        $scope.RootAppointmentId = 0;
                        $scope.FollowupAppointments = resp.data;
                        //$scope.SelectedParentAppt = $scope.FollowupAppointments[0];
                        //$scope.RootAppointmentId = $scope.SelectedParentAppt.RootAppointmentId;
                        //if ($scope.RootAppointmentId === 0) {
                        //    $scope.RootAppointmentId = $scope.SelectedParentAppt.AppointmentId;
                        //}
                        $scope.IsnewFollowUp = true;
                    } else {
                        //alertify.error("This patient dosent have any previous appointments");
                        $scope.IsSubmitDisabled = true;
                        return false;
                    }
                } else {
                    //alertify.error("This patient dosent have any Previous appointments");
                    $scope.IsSubmitDisabled = true;
                    return false;
                }
            }, function (err) { console.log(err); alertify.error("Getting Followup Appointments Failed"); });

        } else {
            $scope.IsnewFollowUp = false;
        };

        if ($scope.bookApptType === "New" && (appointment_type === '7' || appointment_type === '4' || appointment_type === '14')) {
            let req = {
                "PatientId": $scope.selectedPatientObj.PatientId || 0,
                "SpecializationId": $scope.SpecializationId,
                "DoctorId": $scope.selectedDocObject.selectedPerson.DoctorID,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "AppointmentTypeId": $scope.appointment_type.AppointmentTypeId || null
            };
            $scope.ApprovedSurgeryAppointments = [];
            $scope.SelectedApprovedParentAppt = "";
            eHnoteDiagnosisDataServices.GetApprovedSurgeryAppointments(req).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.rows.length > 0) {
                        $scope.SelectedParentAppt = "";
                        $scope.ApprovedSurgeryAppointments = [];
                        angular.forEach(resp.data.rows, function (item) {
                            let obj = {
                                "SurgeryListId": 0,
                                "OrgSurgeryId": item.OrganizationSurgeryId,
                                "SurgeryId": item.SurgeryId,
                                "PatientSurgeryId": item.PatientSurgeryId,
                                "AppointmentId": item.AppointmentId,
                                "OrganizationSurgeryName": item.OrganizationSurgeryName,
                                "DeleteInd": false,
                                "IsChecked": false,
                                "SurgerySuggestedDate": $filter('date')(new Date(item.SurgerySuggestedDate), "MM-dd-yyyy")
                            };
                            $scope.ApprovedSurgeryAppointments.push(obj);
                        });

                    } else {
                        alertify.error("This patient doesn't have any advised surgeries!");
                        $scope.IsSubmitDisabled = true;
                        return false;
                    }
                } else {
                    $scope.IsSubmitDisabled = true;
                    return false;
                }
            }, function (err) {
                console.log(err);
                alertify.error("Fetching Data Failed!");
            });

        }

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        };

        $scope.PreAdmissionApptObj = {
            "AllSurgiesCheck": false
        };



        if ($scope.selectedBranchobj !== undefined) {
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID === $scope.selectedBranchobj.BranchId) {
                if ($scope.selectedBranchobj.IsEnableBillinAppointment) {
                    $scope.showpaynBookApptbtn = true;
                }
            }
        }

        if (appointment_type === '13') {
            $scope.showpaynBookApptbtn = false;
        }

        $scope.isSurgery = false;

        $scope.SurgeriesList = $scope.SurgeriesList || [];
        $scope.followUpObj.OrganizationSurgeryId = "";
        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");


        console.log($scope.UnblockSlots);

        if ($scope.UnblockSlots) {

            $scope.GetVisitReasonNew();
            $scope.othervisitrsn = "";
            $scope.visitrsnId = null;
            $scope.GetDefaultReasonForDoctors();
            return;
        }


        if ($scope.IsComingFrom == 'Doctorcalendar') {
            return;
        }


        var params = {
            "DoctorId": $scope.SelectedBranchDocId,
            "UserBranchId": $scope.selectedDocObject.selectedPerson.UserBranchId,
            "Date": appointmentDate
        }




        // eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);
        eHnoteMainAppointmentService.GetDoctorAvaiableSlotByDate(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                angular.forEach(response.NormalSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);

                    item.seqStartTime = item.StartTime.replace(":", "");
                    item.seqEndTime = item.EndTime.replace(":", "");
                });
                angular.forEach(response.TeleSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                    item.EndTime = item.EndTime.substring(0, 5);
                });

                $scope.IsMaximumAppointmentsPerDay = false;
                if (response.UserConsultationNew.length > 0) {
                    if (response.UserConsultationNew[0].IsMaximumAppointmentsPerDay == true) {
                        if (response.DoctorAppointmentCount > response.UserConsultationNew[0].MaximumAppointmentsPerDay || response.DoctorAppointmentCount == response.UserConsultationNew[0].MaximumAppointmentsPerDay) {
                            //alertify.error(".Please choose another doctor");
                            $scope.IsMaximumAppointmentsPerDay = true;
                            alertify.error("Maximum Appointments Reached for is Doctor. Please choose another doctor");
                            return false;

                        }
                    }
                }
                newreStructureDoctorSelectedSlots(response);
            }

        }
        function OnGetError(response) {
            var MinPerCaseval = $scope.selectedDocObject.selectedPerson.MinPerCase;
            if ($scope.appDate) {
                $scope.setValue = [];
                if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                    bindDoctorSlots(MinPerCaseval, 'current');
                } else {
                    bindDoctorSlots(MinPerCaseval, 'all');
                }
            }
        }

        $scope.WalkinBasedApptType = false;
        if (appointment_type === '4' || appointment_type === '14' || appointment_type === '5' || appointment_type === '6') {
            $scope.WalkinBasedApptType = true;
        }
        else {
            $scope.WalkinBasedApptType = false;
        }

        //$scope.GetVisitReasonNew();
        //$scope.othervisitrsn = "";
        //$scope.visitrsnId = null;
        // $scope.GetDefaultReasonForDoctors();
    };

    $scope.checkAllSurgeriesforPreAdm = function () {
        if ($scope.PreAdmissionApptObj.AllSurgiesCheck) {
            angular.forEach($scope.ApprovedSurgeryAppointments, function (item) {
                item.IsChecked = true;
            });
            $scope.PreAdmSurgeryType = "All";
        } else {
            angular.forEach($scope.ApprovedSurgeryAppointments, function (item) {
                item.IsChecked = false;
            });
            $scope.PreAdmSurgeryType = "Select Surgery";
        }
    };

    $scope.PreAdmSurgeryType = "Select Surgery";

    $scope.PreAdmSurgeryToggle = function (obj) {
        let counter = 0;
        angular.forEach($scope.ApprovedSurgeryAppointments, function (item) {
            if (item.IsChecked) {
                counter++;
            }
        });
        if (counter == $scope.ApprovedSurgeryAppointments.length) {
            $scope.PreAdmissionApptObj.AllSurgiesCheck = true;
            $scope.PreAdmSurgeryType = "All";
        } else if (counter == 0) {
            $scope.PreAdmSurgeryType = "Select Surgery";
            $scope.PreAdmissionApptObj.AllSurgiesCheck = false;
        } else {
            $scope.PreAdmissionApptObj.AllSurgiesCheck = false;
            $scope.PreAdmSurgeryType = "Selected";
        }
    };

    $scope.AddPatient = function (name) {
        var patientinfo = eHnoteMasterDataService.getNewPatientInfo();
        patientinfo.hasphone = false;
        patientinfo.patType = true;
        patientinfo.firstname = name;
        patientinfo.doctorid = eHnoteMasterDataService.getLoginId();
        eHnoteMasterDataService.Addpatientvalconsult('Start Consultation');
        eHnoteMasterDataService.addNewPatientInfo(patientinfo);
        eHnoteMasterDataService.addAddPatientwithoutConsult(false);
        var url = "/registerPatient";
        $location.url(url);
    };

    $scope.ResetpatientObj = function (value) {

        $scope.selectedPatientObj = {
            "PatientName": "",
            "PatientDisplayId": "",
            "OldPatientDisplayId": "",
            "NewpatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
            "FollwuppatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
            "PatientId": 0,
            "PatientDOB": "",
            "PatientAge": "",
            "PatientAgeInYears": "",
            "PatientAgeInMonths": "",
            "PatientAgeInDays": "",
            "PatientRefferal": "",
            "PatientMobile": "",
            "CountryCode": "91",
            "PatientGender": 'Male',
            "IsNewPatient": value,
            "AgeInYears": "",
            "AgeInMonths": "",
            "AgeInDays": "",
            "DOB": "",
            "ReferralSourceId": 0,
            "ReferralSource": "",
            "ReferralSourceName": "",
            "DisplayID": "",
            "PatientTitle": "Mr",
            "referralSource": "",
            "PatientTypeName": "General",
            "PatientType": 1,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "MasterReferralSourceId": "",
            "MasterReferralSourceName": "",
            "BSMSind": false,
            "ContactNo": "",
            "emgymobilenumber": "",
            "emgyname": "",
            "emgyrelationship": "",
            "AttenderName": "",
            "AlternatePhoneNo": "",
            "AlternateLandLine": "",
            "AltCountryCode": "+91",
            "Altareacode": "",
            "DOBSearch": "",
        };
        if ($scope.selectedPatientObj.IsNewPatient === 'New') {
            $scope.appointment_type.AppointmentTypeId = "1";
        }
        $scope.patientAppointmentID = 0;
    };

    $scope.preSelectPatient = function (patientitem, type) {
        $scope.selectedPatientObj.PatientName = "";
        console.log(patientitem.PatientId);

        eHnoteAuditServices.getParticularPatientDetailsById(patientitem.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(response) {
            console.log(response);
            if (response.count > 0) {
                patientitem = response.rows[0];
                patientitem.PatientID = patientitem.PatientId;



                if (type === "AfterRegister" || $scope.pagename === "book") {
                    $scope.selectPatientdetails1(patientitem)
                } else {
                    $scope.selectedPatient(patientitem);
                }
                $scope.IsNoPatienthere = true;
                $scope.ShowAddNewInsurance = false;
                $scope.paymentTypeObj.PaymentTypeId = "2"; //"1";
                $scope.paymentTypeObj.IsPaymentTypeInd = false;  // true;

                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";

                $scope.GetSelectedPatientDetails(patientitem);

                console.log($scope.AppListdoctoraddress);
                console.log("ArrayB");
                console.log(selectedHospitalinAppList.ClinicId);
                if ($scope.AppListdoctoraddress.length > 0) {
                    if (selectedHospitalinAppList !== "" && selectedHospitalinAppList !== undefined) {
                        if (selectedHospitalinAppList.ClinicId !== undefined) {



                            var filterHospitallist = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': selectedHospitalinAppList.ClinicId }, true);
                            $scope.selectedBranchobj = filterHospitallist[0];

                            console.log($scope.selectedBranchobj);
                            console.log("ArrayB1");

                            $scope.SelectedBranchId = selectedHospitalinAppList.ClinicId.toString();

                            $scope.selectBookingType.selectedBookAppo = "3";
                            $scope.selectBookingType.IsWalkInSlot = false;

                            console.log($scope.IsComingFrom + "__Doctorcalendar");



                            if ($scope.IsComingFrom == 'Doctorcalendar') {
                                $scope.selectBookingType.selectedBookAppo = $scope.Doctorcalendarobj.AppointmentTypeId.toString();


                                $scope.isAppValiddities.isENableVisitType = true;

                                if ($scope.selectBookingType.selectedBookAppo === "1") {
                                    $scope.IsCheckIn = 2;
                                    $scope.BookingType = 1;
                                    $scope.selectBookingType.IsWalkInSlot = true;
                                }
                                else if ($scope.selectBookingType.selectedBookAppo === "3") {
                                    $scope.IsCheckIn = 1;
                                    $scope.BookingType = 3;
                                    $scope.selectBookingType.IsWalkInSlot = false;
                                }


                            }
                            $scope.selectedBranchobj.ClinicName = $scope.selectedBranchobj.ClinicName || "";
                            $scope.chnageApptBranch($scope.selectedBranchobj);



                        }

                    }
                }

                eHnoteInsuranceService.getPatientInsuranceDtls(patientitem.PatientID).then(function (response) {
                    console.log(response);
                    $scope.mainOrgInsTpaArray = [];
                    if (response.data !== undefined) {
                        if (response.data.rows !== undefined) {
                            $scope.patientInsuranceTpasArray = response.data.rows;
                            angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                                bitem.isCorporateType = false;
                                if (bitem.BillingCategoryTypeId === 15) {
                                    bitem.isCorporateType = true;
                                }
                            });
                            $scope.PatientInsuranceObj = GetInsuranceObj();

                            $scope.paymentTypeObj.GETPatientInsuranceList = $scope.paymentTypeObj.GETPatientInsuranceList || [];
                            if ($scope.paymentTypeObj.GETPatientInsuranceList.length > 0) {
                                $scope.paymentTypeObj.PatientInsuranceList = angular.copy($scope.paymentTypeObj.GETPatientInsuranceList);

                                if ($scope.patientInsuranceTpasArray.length > 0) {
                                    //$scope.paymentTypeObj.PatientInsuranceList = [];
                                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {

                                        angular.forEach($scope.paymentTypeObj.GETPatientInsuranceList, function (gitem, index) {
                                            var IdentifierId = "";
                                            if (bitem.PatientInsuranceDetailId == gitem.PatientInsuranceDetailId) {
                                                if (index == 0) {
                                                    IdentifierId = 1;
                                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = bitem;
                                                    //$scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.IdentifierId = 1;
                                                    //IdentifierId = 1;
                                                } else if (index == 1) {
                                                    IdentifierId = 2;
                                                    $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = bitem;
                                                    // $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.IdentifierId = 2;
                                                    // IdentifierId = 2;
                                                }

                                                $scope.PatientInsuranceObj = angular.copy(bitem);
                                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                                $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = bitem.AppointmentInsuranceDetailId;
                                                if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                                                    $scope.PatientInsuranceObj.setprimary = true;
                                                } else {
                                                    $scope.PatientInsuranceObj.setprimary = false;
                                                }
                                            }
                                        });
                                    });
                                }
                            }

                            if ($scope.pagename === "book") {
                                if ($scope.patientInsuranceTpasArray.length > 0) {
                                    if ($scope.patientInsuranceTpasArray.length === 1) {
                                        $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                        $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                                        $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                                    }
                                    else if ($scope.patientInsuranceTpasArray.length > 1) {
                                        var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                                        if (filter1.length > 0) {
                                            $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                            $scope.PatientInsuranceObj.setprimary = true;
                                            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filter1[0];
                                            //  $scope.paymentTypeObj.PaymentTypeId = "2";
                                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                        } else {
                                            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                                        }
                                    }

                                    $scope.paymentTypeObj.PaymentTypeId = "2";
                                    $scope.paymentTypeObj.IsPaymentTypeInd = false;

                                    if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                                        $scope.PatientInsuranceObj.setprimary = true;
                                    } else {
                                        $scope.PatientInsuranceObj.setprimary = false;
                                    }
                                } else {
                                    $scope.PatientInsuranceObj.IdentifierId = 1;
                                    $scope.PatientInsuranceObj.setprimary = true;
                                }
                            }
                            //else {
                            //  $scope.PatientInsuranceObj = GetInsuranceObj();
                            //}
                        }
                    }
                });


            }

        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }

    $scope.changeUnblock = function (val, appttypeid) {

        $scope.UnblockSlots = val;
        //if (val && $scope.IsComingFrom == 'Doctorcalendar') {
        //    $scope.isAppValiddities.isENableVisitType = false;
        //}

        if (val) {

        }
        //if (val) {
        //    $scope.Showaddnotes = true;
        //    $scope.GetVisitReasonArray = [];
        //$scope.GetVisitReasonArray = $filter("filter")($scope.AllVisitReasons, { "AppointmentTypeId": appttypeid }, true) || [];
        //} else {
        //    $scope.Showaddnotes = false;
        //    $scope.GetVisitReasonArray = [];
        //    $scope.GetVisitReasonArray = angular.copy($scope.AllVisitReasons) || [];
        //}
    }


    $scope.selectedPatient = function (patientitem) {
        console.log(patientitem);
        cacheStorageItem.PatientDetails = {};
        $scope.patientAppointmentID = 0;
        $scope.patientBillingId = 0;
        $scope.isregisterBtn = false;
        $scope.selectedPatInfo = patientitem;
        $scope.selectedPatInfo.ReferralSourceId = $scope.selectedPatInfo.ReferralSourceId || "0";
        $scope.Source = $scope.selectedPatInfo.ReferralSourceId.toString();
        $scope.patients = [];
        $scope.isPatientSelected = true;
        eHnoteMainAppointmentService.GetAdvisedInvestigationsByAppointmentId(patientitem.AppointmentId).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    $scope.InvestigationList = resp.data.rows || [];

                    if ($scope.InvestigationList.length > 0) {
                        angular.forEach($scope.InvestigationList, function (mitem) {
                            mitem.PatientInvestigationId = 0;
                            var List = $filter("filter")($scope.GetOrganNameList, { "OrganId": mitem.OrganId }, true)[0];
                            mitem.SelectOrganName = mitem.OrganId.toString();
                            //var List = $filter("filter")($scope.GetOrganNameList, { "OrganId": mitem.OrganId }, true)[0];
                            //mitem.SelectOrganName = List;
                            //$scope.OrganObj.SelectOrganName = List;
                        });
                    }
                }
            }
        }, function (err) { console.log(err); alertify.error("Getting  Investigations Failed"); });

        $scope.paymentTypeObj.AppointmentNotesList = [];
        if ($scope.pagename === "reschedule") {
            $scope.paymentTypeObj.AppointmentNotesList = AppointmentDetailsById.AppointmentNotes || [];
        }

        $scope.AppointmentPatientTypeId = patientitem.AppointmentPatientTypeId; //Added by durga as on 04-03-2020
        $scope.visitedDays = $scope.getLastVistedDate(patientitem.LastVisited);
        if ($scope.SearchByPatients === "Y") {
            //$scope.selectedPatientObj = patientitem;
            $scope.selectedPatientObj.PatientId = patientitem.PatientId;
            $scope.selectedPatientObj.S3URL = patientitem.S3URL || "";
            $scope.selectedPatientObj.SSN = patientitem.SSN || "";
            $scope.selectedPatientObj.DisplayID = patientitem.DisplayID;
            $scope.selectedPatientObj.PatientName = patientitem.FullName;
            $scope.selectedPatientObj.FullName = patientitem.FullName;
            $scope.selectedPatientObj.PatientMobile = patientitem.PhoneNumber || 0;
            $scope.selectedPatientObj.PatientGender = patientitem.Gender;
            $scope.selectedPatientObj.PatientAge = patientitem.Age;
            $scope.selectedPatientObj.CountryCode = patientitem.CountryCode;
            $scope.selectedPatientObj.AgeInYears = patientitem.AgeInYears;
            $scope.selectedPatientObj.AgeInDays = patientitem.AgeInDays;
            $scope.selectedPatientObj.AgeInMonths = patientitem.AgeInMonths;
            $scope.selectedPatientObj.AgeInDays = patientitem.AgeInDays;
            $scope.selectedPatientObj.DOB = patientitem.DOB;
            $scope.selectedPatientObj.ReferralSourceId = patientitem.ReferralSourceId;
            $scope.selectedPatientObj.PatientTitle = patientitem.Title;
            $scope.selectedPatientObj.CreatedDt = patientitem.CreatedDt;
            $scope.selectedPatientObj.LastPaid = patientitem.LastPaid || "";
            $scope.selectedPatientObj.FirstName = patientitem.FirstName;
            $scope.selectedPatientObj.LastName = patientitem.LastName;
            $scope.selectedPatientObj.ReferralSourceName = patientitem.ReferalSource || "";
            $scope.selectedPatientObj.ReferalSource = patientitem.ReferalSource || "";
            $scope.selectedPatientObj.MasterReferralSourceId = patientitem.MasterReferralSourceId || "";
            $scope.selectedPatientObj.MasterReferralSourceName = patientitem.MasterReferralSourceName || "";
            $scope.selectedPatientObj.HomeCountryCode = patientitem.HomeCountryCode;
            $scope.selectedPatientObj.HomeAreaCode = patientitem.HomeAreaCode;
            $scope.selectedPatientObj.HomeNumber = patientitem.HomeNumber;


            var SSN = $scope.selectedPatientObj.SSN;
            var PhoneNumber = $scope.selectedPatientObj.PatientMobile;
            PhoneNumber = $scope.selectedPatientObj.PatientMobile.toString();
            if (PhoneNumber.length > 0) {
                var number = PhoneNumber;
                if (patientitem.HomeNumber != '') {
                    number = patientitem.HomeCountryCode + '-' + patientitem.HomeAreaCode + '-' + patientitem.HomeNumber;
                } else {
                    number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                }
                //number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                $scope.selectedPatientObj.TempPhNumber = number;
            } else {
                $scope.selectedPatientObj.TempPhNumber = "";
            }
            SSN = SSN || "";
            SSN = $scope.selectedPatientObj.SSN.toString();
            if (SSN.length > 0) {
                var SSNnumber = SSN;
                SSNnumber = SSNnumber.slice(0, 3) + '-' + SSNnumber.slice(3, 5) + '-' + SSNnumber.substring(5, 10);;
                $scope.selectedPatientObj.TempSSNnumber = SSNnumber;
            } else {
                $scope.selectedPatientObj.TempSSNnumber = "";
            }

            $scope.selectedPatientObj.PatientType = patientitem.PatientType || "";
            $scope.selectedPatientObj.CityName = patientitem.CityName || "";
            $scope.selectedPatientObj.Occupation = patientitem.Occupation || "";
            $scope.selectedPatientObj.Location = patientitem.Area || "";//Location
            $scope.selectedPatientObj.Title = patientitem.Title || "";
            $scope.selectedPatientObj.StateName = patientitem.StateName || "";

            $scope.selectedPatientObj.IsVIPInd = patientitem.IsVIPInd || false;
            $scope.selectedPatientObj.IsResearchInd = patientitem.IsResearchInd || false;
            $scope.selectedPatientObj.IsHighRiskInd = patientitem.IsHighRiskInd || false;

            $scope.selectedPatientTitle = patientitem.Title;
            $scope.selectedPatientAge = "";
            if (patientitem.CurrentAge !== undefined) {
                $scope.selectedPatientAge = patientitem.CurrentAge.year + "y " + (patientitem.CurrentAge.month !== "0" ? (patientitem.CurrentAge.month + "m") : "");
            }
            $scope.selectedPatientGender = patientitem.Gender;
            $scope.selectedPatientNumber = patientitem.PhoneNumber !== 0 ? patientitem.PhoneNumber : "";
            $scope.selectedPatientImage = "";
            $scope.selectedPatInfo.PatientID = patientitem.PatientId;
            $scope.SelectedCountryCode = patientitem.CountryCode;
            $scope.selectedPatientObj.OccupationNotes = patientitem.OccupationNotes || "";
            $scope.selectedPatientObj.AlternatePhoneNo = patientitem.AlternatePhoneNo;
            $scope.selectedPatientObj.AlternateLandLine = patientitem.AlternateLandLine;
            $scope.selectedPatientObj.AltCountrycode = patientitem.AltCountryCode;
            $scope.selectedPatientObj.AltareaCode = patientitem.Altareacode;

        }
        else {
            $scope.selectedPatInfo.PatientID = patientitem.Patient[0].PatientID;

            $scope.selectedPatientTitle = patientitem.Patient[0].Title;
            $scope.selectedPatientAge = patientitem.Patient[0].CurrentAge.year + "y " + (patientitem.Patient[0].CurrentAge.month !== "0" ? (patientitem.Patient[0].CurrentAge.month + "m") : "");
            $scope.selectedPatientGender = patientitem.Patient[0].Gender;
            $scope.selectedPatientNumber = (patientitem.PatientPhone[0] !== undefined && patientitem.PatientPhone[0].PhNumber !== 0) ? patientitem.PatientPhone[0].PhNumber : '';
            $scope.selectedPatientImage = "";
        }

        var inputParams = {
            "PatientId": $scope.selectedPatientObj.PatientId || 0,
            "DoctorId": doctorinfo.doctorid,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };
        if (inputParams.PatientId !== 0) {
            eHnoteDiagnosisDataServices.GetFollowupSurgeries(inputParams).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.rows.length > 0) {
                        $scope.SurgeriesList = resp.data.rows;
                        $scope.AdmissionId = resp.data.rows[0].AdmissionId;
                    }
                }


            });
        }
        if ($scope.bookApptType === "FollowUp") {

            eHnoteDiagnosisDataServices.GetPatientFollowupAppointments($scope.selectedPatientObj.PatientId, $scope.SpecializationId).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.length > 0) {
                        $rootScope.appointment_type = "3";
                        $scope.appointment_type.AppointmentTypeId = "3";
                        $scope.FollowupAppointments = [];
                        $scope.SelectedParentAppt = "";
                        $scope.RootAppointmentId = 0;
                        $scope.FollowupAppointments = resp.data;
                        $scope.SelectedParentAppt = $scope.FollowupAppointments[0];
                        $scope.RootAppointmentId = $scope.SelectedParentAppt.RootAppointmentId;
                        if ($scope.RootAppointmentId === 0) {
                            $scope.RootAppointmentId = $scope.SelectedParentAppt.AppointmentId;
                        }
                        if ($scope.pagename === 'withoutConsultationFollowup') {
                            cacheStorageItem.appointmentid = $scope.SelectedParentAppt.AppointmentId;
                        }
                    } else {
                        $scope.IsSubmitDisabled = true;
                        return false;
                    }
                } else {
                    $scope.IsSubmitDisabled = true;
                    return false;
                }
            }, function (err) { console.log(err); alertify.error("Getting Followup Appointments Failed"); });
        } else {
            eHnotePatientDataService.GetPatientBillingAppointments($scope.selectedPatientObj.PatientId).then(function (resp) {
                if (resp.data.Status === 1) {
                    if (resp.data.data.length > 0) {

                        $scope.SelectedDummyAppointment = resp.data.data[0];


                        $scope.patientAppointmentID = $scope.SelectedDummyAppointment.AppointmentId;

                        var DoctorArray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": $scope.SelectedDummyAppointment.DoctorId }, true);

                        if (DoctorArray.length > 0) {
                            $scope.selectedDocObject.selectedPerson = DoctorArray[0];
                        }


                    }
                }
            }, function (err) { console.log(err); alertify.error("Getting Billing Appointments Failed"); });
        }

        $scope.selectedPatientObj.DisplayID = $scope.selectedPatientObj.DisplayID || "";

        if ($scope.selectedPatientObj.DisplayID !== "" && $scope.bookApptType !== "FollowUp") {
            $scope.appointment_type.AppointmentTypeId = "1";
        }



        eHnoteInsuranceService.getPatientInsuranceDtls(patientitem.PatientId).then(function (response) {
            console.log(response);
            $scope.mainOrgInsTpaArray = [];
            if (response.data !== undefined) {
                if (response.data.rows !== undefined) {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                        bitem.isCorporateType = false;
                        if (bitem.BillingCategoryTypeId === 15) {
                            bitem.isCorporateType = true;
                        }
                    });
                    $scope.PatientInsuranceObj = GetInsuranceObj();

                    if ($scope.pagename === "book") {
                        if ($scope.patientInsuranceTpasArray.length > 0) {
                            if ($scope.patientInsuranceTpasArray.length === 1) {
                                $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;

                                $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                            }
                            else if ($scope.patientInsuranceTpasArray.length > 1) {
                                var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                                if (filter1.length > 0) {
                                    $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                    $scope.PatientInsuranceObj.setprimary = true;
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filter1[0];
                                    // $scope.paymentTypeObj.PaymentTypeId = "2";
                                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                } else {
                                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
                                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                                }
                            }

                            $scope.paymentTypeObj.PaymentTypeId = "2";
                            $scope.paymentTypeObj.IsPaymentTypeInd = false;

                            if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                                $scope.PatientInsuranceObj.setprimary = true;
                            } else {
                                $scope.PatientInsuranceObj.setprimary = false;
                            }
                        } else {
                            $scope.PatientInsuranceObj.IdentifierId = 1;
                            $scope.PatientInsuranceObj.setprimary = true;
                        }
                    }
                    //else {
                    //  $scope.PatientInsuranceObj = GetInsuranceObj();
                    //}

                }
            }
        });
    };

    $scope.Addinsurance = function () {
        $scope.ShowAddNewInsurance = true;
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
        $scope.paymentTypeObj.PaymentTypeId = "2";
        $scope.paymentTypeObj.IsPaymentTypeInd = false;
    }

    $scope.checkPatientInsuranceAvailInBranch = function (insId, tpaId) {
        var param = {
            "BranchId": $scope.SelectedBranchId,
            "InsuranceId": insId,
            "TPAId": tpaId
        }
        eHnotePatientDataService.checkInsuranceTpaForPatient(param, OnCheckSuccess, OnCheckError);


        function OnCheckSuccess(response) {
            console.log(JSON.stringify(response));
        }
        function OnCheckError(data) {

        }

    };
    $scope.changepaymentType = function (type) {

        $scope.paymentTypeObj.OrgInsuranceTpaId = 0;
        $scope.paymentTypeObj.BillingCategoryType = "Bill Patient";
        if (type === '1') {
            $scope.paymentTypeObj.PatientInsuranceList = [];
            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = '';
            $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = '';

            $scope.ShowAddNewInsurance = false;
            $scope.PatientInsuranceObj = GetInsuranceObj();
        }
        else if (type === '2') {
            if ($scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj != "") {
                var filterList = $filter("filter")($scope.paymentTypeObj.PatientInsuranceList, function (item, index) { return item.PatientInsuranceDetailId === $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.PatientInsuranceDetailId }, true) || [];

                if (filterList.length > 0) {
                    var index = $scope.paymentTypeObj.PatientInsuranceList.indexOf(filterList[0]);
                    if (index > -1) {
                        $scope.paymentTypeObj.PatientInsuranceList.splice(index, 1);
                    }
                }
                $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = '';
            }

            if ($scope.patientInsuranceTpasArray.length == 0) {
                $scope.ShowAddNewInsurance = true;
                $scope.PatientInsuranceObj = GetInsuranceObj();
            }
            else if ($scope.patientInsuranceTpasArray.length === 1) {
                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
            }
        }
    };

    //$scope.changePatientInsurance = function (item) {
    //    if ($scope.paymentTypeObj.PaymentTypeId === '2') {
    //        item.SelectPatientInsuranceObj = item.SelectPatientInsuranceObj || [];
    //        if (item.SelectPatientInsuranceObj.length > 2) {
    //            item.SelectPatientInsuranceObj.splice(0, 1);
    //            return false;
    //        }
    //        $scope.paymentTypeObj.PatientInsuranceList = item.SelectPatientInsuranceObj;
    //    }
    //};

    /*  $scope.changePatientInsurance = function (item, type) {
 
          var IdentifierId = 1;
          if (type == 'Secondary') {
              IdentifierId = 2;
 
              $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj =$scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj || "";
              if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj === "") {
                  $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = '';
                  alertify.error('Please Select Primary Insurance ');
                  return false;
              }
          } 
 
          var obj = {
              "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
              "PayorId": item.PayorId,
              "PlanId": item.PlanId,
              "CoverageId": item.CoverageId,
              "IdentifierId": IdentifierId,
              "PayorName": item.PayorName
          }
 
 
          $scope.paymentTypeObj.PatientInsuranceList = $scope.paymentTypeObj.PatientInsuranceList || [];
          if ($scope.paymentTypeObj.PatientInsuranceList.length != 0) {
              var List = $filter("filter")($scope.paymentTypeObj.PatientInsuranceList, function (kitem, index) { return kitem.PatientInsuranceDetailId === obj.PatientInsuranceDetailId });
              if (List.length > 0) {
                  alertify.error('You have already Selected this Insurance');
 
                  if (type == 'Secondary') {
                      $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = '';
                  } else {
                      $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = '';
                  }
              
 
                
                  return;
              }
          }
 
 
          $scope.paymentTypeObj.PatientInsuranceList.push(obj);
         
          if ($scope.paymentTypeObj.PaymentTypeId !== '1') {
           
 
 
 
          } else {
              $scope.paymentTypeObj.PatientInsuranceList = [];
          }
      }*/

    $scope.changePatientInsurance = function (item, type, Ind) {

        if (Ind == 'PrimaryCheck') {
            if ($scope.patientInsuranceTpasArray.length > 1) {
                var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                if (filter1.length > 0) {
                    $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                    $scope.PatientInsuranceObj.setprimary = true;
                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = filter1[0];
                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                } else {
                    $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                    $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                    $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.patientInsuranceTpasArray[0];
                    $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                }
            }
        }



        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj || "";
        if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj == "") {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;

            $scope.PatientInsuranceObj = GetInsuranceObj();
            return false;
        } else {
            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;
        }

        var IdentifierId = 1;
        if (type == 'Secondary') {
            IdentifierId = 2;

            $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj || "";
            if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj === "") {
                $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = '';
                alertify.error('Please Select Primary Insurance ');
                return false;
            }
        }
        if (type == "Primary") {
            // $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.IdentifierId = 0;
            //$scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.IdentifierId = IdentifierId;
            if ($scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj != "") {
                if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.PatientInsuranceDetailId === $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.PatientInsuranceDetailId) {

                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                    alertify.error('You have already Selected this Insurance');
                }

            }

            $scope.PatientInsuranceObj = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj;
            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
            $scope.PatientInsuranceObj.PayorObj = angular.copy($scope.PatientInsuranceObj.PayorCode);
            $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.AppointmentInsuranceDetailId;
            if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                $scope.PatientInsuranceObj.setprimary = true;
            } else {
                $scope.PatientInsuranceObj.setprimary = false;
            }
        }
        if (type == "Secondary") {
            $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.IdentifierId = 0;
            $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.IdentifierId = IdentifierId;
            if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj != "") {
                if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj.PatientInsuranceDetailId === $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj.PatientInsuranceDetailId) {

                    $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj = "";
                    alertify.error('You have already Selected this Insurance');
                }
            }
        }

        //  $scope.paymentTypeObj.PatientInsuranceList = [];
    }


    $scope.changePatientInsuranceTpa = function (OrgInsuranceTpaId) {

        $scope.defaultbranch = $filter("filter")($scope.patientInsuranceTpasArray, function (item) {
            return item.OrgInsuranceTpaId === OrgInsuranceTpaId;
        });


        var param = {
            "BranchId": $scope.SelectedBranchId,
            "InsuranceId": $scope.defaultbranch[0].InsuranceCompanyId,
            "TPAId": $scope.defaultbranch[0].TPAId
        }

        eHnotePatientDataService.checkInsuranceTpaForPatient(param, OnCheckSuccess, OnCheckError);


        function OnCheckSuccess(response) {
            console.log(JSON.stringify(response));
            if (response.Status === 'Success') {
                $scope.paymentTypeObj.OrgInsuranceTpaId = OrgInsuranceTpaId;
            } else {
                $scope.paymentTypeObj.OrgInsuranceTpaId = "";
                alertify.error("Selected InsuranceTpa Not Available in Selected Branch");
            }

        }
        function OnCheckError(data) {

        }

    }



    $scope.getLastVistedDate = function (Visitedate) {
        var thedate = $filter('date')(new Date(Visitedate), "yyyy-MM-dd");
        var currdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var date1 = new Date(thedate);
        var date2 = new Date(currdate);
        var m = moment(date2);
        var years = m.diff(date1, 'years');
        m.add(-years, 'years');
        var months = m.diff(date1, 'months');
        m.add(-months, 'months');
        var days = m.diff(date1, 'days');
        var daysago;
        if (months <= 0) {
            daysago = days.toString() + " Days ago ";
        } else {
            if (months > 1) {
                daysago = months.toString() + " Months " + days.toString() + " Days " + " Ago ";
            } else {
                daysago = months.toString() + " Month " + days.toString() + " Days" + " Ago ";
            }
        }
        return daysago;
    };
    function validateAppoitntmentfields() {
        return true;
        var StartTimeHour = $scope.StartTimeHour;
        var StartTimeMin = $scope.StartTimeMin;
        var EndTimeHour = $scope.EndTimeHour;
        var EndTimeMin = $scope.EndTimeMin;
        var selectedAppointmentHospital = $scope.SelectedBranchId;
        var selectedAppointmentDoctor = $scope.SelectedBranchDocId;
        var appointment_type = $scope.appointment_type.AppointmentTypeId;
        if (appointment_type === "") {
            alertify.error("Select Appoitnment Type");
            return;
        }
        if (selectedAppointmentHospital === "" || selectedAppointmentHospital === undefined) {
            alertify.error("Select Branch");
            return;
        }
        if ($scope.appDate && $scope.appointmentInfo.AppointmentStatus !== "O") {
            var curdate = parseInt($filter('date')(new Date(), "yyyyMMdd"));
            var controlDate = parseInt($filter('date')(new Date($scope.appDate), "yyyyMMdd"));
            if (controlDate < curdate) {
                alertify.error("Select current or future date");
                return;
            }
        }
        if (selectedAppointmentDoctor === "" || selectedAppointmentDoctor === undefined || selectedAppointmentDoctor === 0) {
            alertify.error("Select Doctor");
            return;
        }
        if ($scope.slot.patinet_appStarttime === "" || $scope.slot.patinet_appStarttime === undefined || $scope.slot.patinet_appStarttime === null) {
            alertify.error("Select Proper Start Time");
            return;
        }
        //if ($scope.patinet_consultationTime === "" || $scope.patinet_consultationTime === undefined) {
        //    alertify.error("Select Consultation Duration");
        //    return;
        //}
        //$scope.patient_appEndTime = $scope.patient_appEndTime || "";
        //if ($scope.patient_appEndTime === "") {
        //    alertify.error("Select End Time");
        //    return;
        //}

        /*  $scope.slot.patient_appEndTime = $scope.slot.patient_appEndTime || "";
          if ($scope.slot.patient_appEndTime === "") {
              alertify.error("Select End Time");
              return;
          }*/

        return true;
    }
    function getHospitalAndDocterList() {

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList);
    }
    function OnGetDoctorSuccess(data) {
        clinicAddress = [];
        if (data.length !== 0) {

            clinicAddress = eHnoteUserAppointmentDataService.RestructureBranches($scope.appointmentInfo.showAllHospitalsinAppList, data, doctorinfo) || [];


            if ($scope.pagename === "FollowUp") {
                $scope.AppListdoctoraddress = [];
                var DoctorId = $scope.appointmentInfo.DoctorID || $scope.appointmentInfo.DoctorId;
                angular.forEach(clinicAddress, function (item) {
                    if (item.Doctors && item.Doctors.length > 0) {
                        var i = 0;
                        angular.forEach(item.Doctors, function (initem) {
                            if (initem.DoctorID === DoctorId) {
                                i++;
                            }
                        });
                        if (i > 0) {
                            $scope.AppListdoctoraddress.push(item);
                        }
                    }
                });
            } else {
                $scope.AppListdoctoraddress = clinicAddress;
            }

 

            if (selectedHospitalinAppList !== "" && selectedHospitalinAppList !== undefined) {
                if (selectedHospitalinAppList.ClinicId !== undefined) {
                    var filterHospitallist = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': selectedHospitalinAppList.ClinicId }, true);
                    $scope.selectedBranchobj = filterHospitallist[0];

                    console.log($scope.selectedBranchobj);
                    $scope.SelectedBranchId = selectedHospitalinAppList.ClinicId.toString();
                }
                ///comment by bharath 03-01-2019

                if ($scope.pagename === "FollowUp") {
                    if (selectedHospitalinAppList !== undefined && selectedHospitalinAppList.BranchId !== undefined) {
                        var filterHospitallist = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': selectedHospitalinAppList.BranchId }, true);
                        $scope.selectedBranchobj = filterHospitallist[0];
                        $scope.SelectedBranchId = selectedHospitalinAppList.BranchId.toString();
                    }
                }
            }
            if ($scope.SelectedBranchId !== "" && $scope.SelectedBranchId !== undefined) {
                InitializeDoctors($scope.SelectedBranchId, "PageLaod");
            }
        }
    }



    function InitializeBranches(data) {
        clinicAddress = [];
        if (data.length !== 0) {




            if ($scope.ConsultationType.typename === 'PhysicalConsultation') {
                clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
            } else {
                clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.TeleAPPListAllBranchesAppointments, data, doctorinfo) || [];
            }


            console.log("Lmpae");
            $scope.AppListdoctoraddress = clinicAddress;

            console.log(selectedHospitalinAppList);

            if (selectedHospitalinAppList !== "" && selectedHospitalinAppList !== undefined) {
                if (selectedHospitalinAppList.ClinicId !== undefined) {
                    var filterHospitallist = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': selectedHospitalinAppList.ClinicId }, true);
                    $scope.selectedBranchobj = filterHospitallist[0];
                    $scope.SelectedBranchId = selectedHospitalinAppList.ClinicId.toString();
                }


                if ($scope.pagename === "FollowUp") {
                    if (selectedHospitalinAppList !== undefined && selectedHospitalinAppList.BranchId !== undefined) {
                        var filterHospitallist = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': selectedHospitalinAppList.BranchId }, true);
                        $scope.selectedBranchobj = filterHospitallist[0];
                        $scope.SelectedBranchId = selectedHospitalinAppList.BranchId.toString();
                    }
                }
            }

            if ($scope.SelectedBranchId !== "" && $scope.SelectedBranchId !== undefined) {
                //InitializeDoctors($scope.SelectedBranchId, "PageLaod");
                console.log($scope.selectedBranchobj);
                getBranchSpecializations($scope.selectedBranchobj.SubOrganizationId, $scope.selectedBranchobj.BranchId);
                initializaeSubSpecializations($scope.selectedBranchobj);
            }
        }
    }


    $scope.allSubSpecializationsArray = [];
    function initializaeSubSpecializations(selectedBranchobj) {
        console.log(selectedBranchobj);


        eHnoteMainAppointmentService.getBranchSubSpecializationsById(selectedBranchobj.SubOrganizationId, selectedBranchobj.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                if ($scope.selectedSpecialization != undefined) {
                    if ($scope.selectedSpecialization.SpecializationId !== 0) {
                        $scope.allSubSpecializationsArray = $filter("filter")($scope.allSubSpecializationsArray, { "SpecializationId": $scope.selectedSpecialization.SpecializationId }, true);
                    }
                }

                $scope.selectedDeptObj = "";
                if ($scope.appointmentInfo.AppointmentID === 0) {
                    $scope.selectedDeptObj = "";
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                } else {
                    if ($scope.appointmentInfo.SubSpecializationId) {
                        angular.forEach($scope.allSubSpecializationsArray, function (item) {
                            item.isChecked = false;
                        });
                        angular.forEach($scope.allSubSpecializationsArray, function (item) {
                            if (item.SubSpecializationId === $scope.appointmentInfo.SubSpecializationId) {
                                item.isChecked = true;
                                $scope.selectedDeptObj = item;
                            }
                        });
                    }
                }

                getDoctorsbySubSpecializations(selectedBranchobj, $scope.allSubSpecializationsArray);
            } else {

                $scope.allSubSpecializationsArray = [];
                $scope.selectedDeptObj = "";
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDocObject.selectedPerson = "";
                alertify.error("No Departments Found in this branch");
            }



        });
    }


    $scope.OrgSpecialitiesArray = [];
    function getBranchSpecializations(SubOrganizationId, BranchId) {
        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);



                    if ($scope.appointmentInfo.AppointmentID === 0) {

                    } else {
                        if ($scope.appointmentInfo.SpecializationId) {
                            angular.forEach($scope.OrgSpecialitiesArray, function (item) {
                                if (item.SpecializationId === $scope.appointmentInfo.SpecializationId) {
                                    $scope.selectedSpecialization = item;
                                }
                            });
                        }
                    }
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);



                    if ($scope.appointmentInfo.AppointmentID === 0) {

                    } else {
                        if ($scope.appointmentInfo.SpecializationId) {
                            angular.forEach($scope.OrgSpecialitiesArray, function (item) {
                                if (item.SpecializationId === $scope.appointmentInfo.SpecializationId) {
                                    $scope.selectedSpecialization = item;
                                }
                            });
                        }
                    }
                }

            });
        }
        console.log($scope.OrgSpecialitiesArray);
    }

    $scope.changeHospitalSpecialization = function (item) {
        $scope.selectedSpecialization = item;
        $scope.allSubSpecializationsArray = [];
        eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.selectedBranchobj.SubOrganizationId, $scope.selectedBranchobj.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;

                if (item.SpecializationId !== 0) {
                    $scope.allSubSpecializationsArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SpecializationId === item.SpecializationId; });
                }



                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                console.log($scope.allSubSpecializationsArray);
                getDoctorsbySubSpecializations($scope.selectedBranchobj, $scope.allSubSpecializationsArray);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    }

    function getDoctorsbySubSpecializations(selectedBranchobj, splArray) {


        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDocObject.selectedPerson = "";
        $scope.clinicDoctorAllList = [];



        $scope.clinicDoctorList = [];
        $scope.AllCounsollerList = [];
        $scope.AllDilationList = [];
        $scope.AllTechnicianList = [];
        $scope.AllOpthaList = [];
        $scope.AllArList = [];
        $scope.clinicOptometristsList = [];
        $scope.clinicARAssistantList = [];
        $scope.AllBillingList = [];

        if (selectedBranchobj.BranchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId === selectedBranchobj.BranchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }




        var listSubSplArray = $filter("filter")(splArray, function (iterator, ind) { return iterator.isChecked === true; });

        if (listSubSplArray.length > 0) {
            var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
        } else {
            var subSplArray = _.pluck(splArray, "SubSpecializationId").join(",");
        }


        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }


        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            console.log(resp);
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                $scope.clinicDoctorList = [];
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllArList = angular.copy($scope.allUserList);
                $scope.AllBillingList = angular.copy($scope.allUserList);
                $scope.clinicOptometristsList = [];
                $scope.clinicARAssistantList = [];
                $scope.AllAnesthesistsList = [];
                $scope.AllNursesList = [];
                console.log($scope.AllOpthaList);



                $scope.AllNursesList = angular.copy($scope.allUserList);
                $scope.AllNursesList = _.uniq($scope.AllNursesList, false, function (p) { return p.DoctorID; });
                $scope.AllNursesList = $filter("filter")($scope.AllNursesList, function (item) {
                    return item.RoleId === 8;
                });

                $scope.AllAnesthesistsList = angular.copy($scope.allUserList);
                $scope.AllAnesthesistsList = _.uniq($scope.AllAnesthesistsList, false, function (p) { return p.DoctorID; });
                $scope.AllAnesthesistsList = $filter("filter")($scope.AllAnesthesistsList, function (item) {
                    return item.RoleId === 30;
                });
                $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                    return item.RoleId === 10;
                });
                $scope.AllArList = _.uniq($scope.AllArList, false, function (p) { return p.DoctorID; });
                $scope.AllArList = $filter("filter")($scope.AllArList, function (item) {
                    return item.RoleId === 61;
                });

                $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                    return item.RoleId === 18;
                });
                $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
                $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                    return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
                });
                $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                    return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                });
                $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                    return item.RoleId === 2 || item.RoleId === 10;
                });

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 10) {
                        $scope.clinicOptometristsList.push(Aitem);
                    }
                });
                $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });


                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {

                    if (Aitem.RoleId === 61) {
                        $scope.clinicARAssistantList.push(Aitem);
                    }

                });
                $scope.clinicARAssistantList = _.uniq($scope.clinicARAssistantList, false, function (p) { return p.DoctorID; });


                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57 || Aitem.RoleId === 10 || Aitem.RoleId === 18) {
                        if (selectedBranchobj.ClinicId === 0) {
                            $scope.clinicDoctorList.push(Aitem);
                        } else {
                            $scope.clinicDoctorList.push(Aitem);
                        }
                    }
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

                InitializeBranchDoctors($scope.clinicDoctorList, selectedBranchobj, "PageLaod");

            } else {
                alertify.error("No Users Found");
            }


        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.selectedDeptObj = "";
    $scope.changeSubSpecialization = function (selectedDeptObj) {
        console.log(selectedDeptObj);
        console.log($scope.selectedBranchobj);
        var array = [];
        array.push(selectedDeptObj);


        // if (selectedDeptObj.SubSpecializationId === 11) {
        if (selectedDeptObj === '' || selectedDeptObj === null) {

            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = true;

            });
            getDoctorsbySubSpecializations($scope.selectedBranchobj, $scope.allSubSpecializationsArray);
        } else {
            getDoctorsbySubSpecializations($scope.selectedBranchobj, array);
        }

    };
    $scope.changeappointmentHospital = function (val) {
        $scope.selectedBranchobj = val;
        $scope.SelectedBranchId = val.ClinicId.toString();
        $scope.setValue = [];
        $scope.slot.patinet_appStarttime = "";
        InitializeDoctors(val.ClinicId, "ChangeEvent");
    };
    $scope.changeSpeciality = function (val) {
        $scope.selectedSpecialization = val;
        //   $scope.spearray = $filter("filter")($scope.allBranchesArray, { "HospitalInfo": { "HospitalDetails": { "BranchId": $scope.SelectedBranchId } } }, true); 
        $scope.allSubSpecializationsArray = $filter("filter")($scope.spearray[0].SubSpecialities, { "SpecializationId": val.SpecializationId }, true);

    };
    $scope.allBranchesSpecialitylistArray = [];
    $scope.chnageApptBranch = function (item) {
        $scope.SelectedBranchId = item.ClinicId;
        $scope.paymentTypeObj.OrgInsuranceTpaId = "";
        console.log(item);
        $scope.getBranchAppointmentTypes(item.ClinicId);

        $scope.RoomSearchObj = {
            "RoomTypeId": 0,
            "RoomId": 0,
            "RoomTypeobj": "",
            "Opthamobj": "",
            "AssignedUserId": null,
            "ARobj": "",
            "OptomId": null,
            "ARId": null,
            "Technicianobj": "",
            "TechnicianId": null,
            "Counsellorobj": "",
            "CounsellorId": null,
            "DilationAssistantobj": "",
            "DilationAssistantId": null,
            "DoctorId": null,
            "Roomobj": "",
            "Billingobj": "",
            "NewApptStartTime": ""

        }

        $scope.selectedBranchobj = item;
        $scope.InvestigationList = [];
        getBranchSpecializations($scope.selectedBranchobj.SubOrganizationId, $scope.selectedBranchobj.BranchId);
        initializaeSubSpecializations($scope.selectedBranchobj);


        if ($scope.IsNoPatienthere == true) {
            if ($scope.RoomTypeList.length > 0) {
                var List1 = $filter("filter")($scope.RoomTypeList, { "Id": 10 }, true) || [];
                if (List1.length > 0) {
                    $scope.RoomSearchObj.RoomTypeobj = List1[0];
                    $scope.RoomSearchObj.RoomTypeId = List1[0].Id;
                }
            }
        }

        $scope.onclickstartTime();
    }
    $scope.changeOptimetrist = function (val) {
        $scope.selectedOptometristObject.optom = val;
        $scope.SelectedOptometristId = parseInt(val.DoctorID);
    };

    $scope.changeAR = function (val) {
        console.log(val);
        $scope.selectedArObject = val;
        $scope.SelectedArId = parseInt(val.DoctorID);
    };

    $scope.changeOptimetristFollowUp = function (val) {
        $scope.SelectedOptometristId = parseInt(val);
    };
    $scope.changeFollowapointment = function (SelectedParentAppt) {
        $scope.SelectedParentAppt = angular.copy(SelectedParentAppt);
        $scope.RootAppointmentId = SelectedParentAppt.RootAppointmentId;
        if ($scope.RootAppointmentId === 0) {
            $scope.RootAppointmentId = SelectedParentAppt.AppointmentId;
        }
        if ($scope.pagename === 'withoutConsultationFollowup') {
            cacheStorageItem.appointmentid = SelectedParentAppt.AppointmentId;
        }
    };
    function InitializeDoctors(HospId, FromType) {

        $scope.selectedHospitalobj = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': parseInt(HospId) }, true);
        if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
            if ($scope.pagename !== "FollowUp") {
                if ($scope.selectedHospitalobj.length > 0) {
                    $scope.clinicDoctorList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                    });

                    $scope.clinicOptometristsList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (item) {
                        return item.RoleId === 10;
                    });

                    $scope.clinicARAssistantList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (item) {
                        return item.RoleId === 61;
                    });
                }
            } else if (FromType === "PageLaod" && $scope.pagename === "FollowUp") {
                if ($scope.selectedHospitalobj.length > 0) {
                    $scope.clinicDoctorList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || $scope.RoleId === 4 || $scope.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                    });
                    $scope.clinicOptometristsList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (item) {
                        return item.RoleId === 10;
                    });

                    $scope.clinicARAssistantList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (item) {
                        return item.RoleId === 61;
                    });
                }
            }
            if (FromType === "ChangeEvent") {
                if ($scope.pagename !== 'FollowUp') {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.SelectedBranchDocId = "";
                        $scope.selectedDocObject.selectedPerson = "";
                    }
                }
            } else {
                if ($scope.pagename === "directFollowup") {
                    $scope.SelectedBranchDocId = "";
                    $scope.selectedDocObject.selectedPerson = "";
                    $scope.IsConsultationFollowUp = true;
                } else {
                    if (selectedDoctorinAppList !== "" && selectedDoctorinAppList !== undefined) {
                        $scope.SelectedBranchDocId = selectedDoctorinAppList.DoctorID;
                        $scope.selectedDocObject.selectedPerson = selectedDoctorinAppList;

                        console.log($scope.selectedDocObject.selectedPerson);
                        if (selectedDoctorinAppList.OptometristId !== "" && selectedDoctorinAppList.OptometristId !== undefined) {
                            //$scope.selectedOptometristObject = selectedDoctorinAppList;
                            $scope.selectedOptometristObject.optom = $filter('filter')($scope.clinicOptometristsList, { 'DoctorID': parseInt(selectedDoctorinAppList.OptometristId) }, true)[0];
                            $scope.SelectedOptometristId = selectedDoctorinAppList.OptometristId;
                        }

                        if (selectedDoctorinAppList.ARassistantId !== "" && selectedDoctorinAppList.ARassistantId !== undefined) {
                            //$scope.selectedOptometristObject = selectedDoctorinAppList;
                            $scope.selectedArObject = $filter('filter')($scope.clinicARAssistantList, { 'DoctorID': parseInt(selectedDoctorinAppList.ARassistantId) }, true)[0];

                            $scope.SelectedArId = selectedDoctorinAppList.ARassistantId;
                        }
                    }
                    $scope.changeAppointmentDoctor($scope.SelectedBranchDocId, FromType);
                    // $scope.getUserBranchslots($scope.SelectedBranchDocId);
                }
            }
        }
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            if (FromType === "PageLaod") {

                $scope.RestrictMultiAppointments = false;
                if (doctorinfo.doctordata.UserAddress[0].UserSlotInfo !== undefined) {
                    if (doctorinfo.doctordata.UserAddress[0].UserSlotInfo.MultiSlotEnable) {
                        $scope.RestrictMultiAppointments = true;
                    }
                }
                var CommunicationCountryCode = ""; var CommunicationMobileNo = "";
                if (doctorinfo.doctordata.UserCommunicationPhone !== undefined) {
                    CommunicationCountryCode = doctorinfo.doctordata.UserCommunicationPhone[0].PhCntryCD;
                    CommunicationMobileNo = doctorinfo.doctordata.UserCommunicationPhone[0].PhNumber;
                }
                $scope.clinicDoctorList.push({
                    "FullName": doctorinfo.doctordata.User[0].FullName,
                    "DoctorID": doctorinfo.doctordata.User[0].DoctorID,
                    "EmailId": doctorinfo.doctordata.UserEmail[0].EmailID,
                    "MobileNo": $scope.selectedHospitalobj[0].MobileNo,
                    "CountryCode": doctorinfo.doctordata.UserPhone[0].PhCntryCD,
                    "RestrictMultipleSlotsonSameSlot": $scope.RestrictMultiAppointments,
                    "Gender": doctorinfo.doctordata.User[0].Gender,
                    "UserBranchId": $scope.selectedHospitalobj[0].UserBranchId,
                    "Active": "Y",
                    "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
                    "MinPerCase": $scope.selectedHospitalobj[0].ExtDetails.MinPerCase,
                    "RoleId": doctorinfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                    "ClinicName": $scope.selectedHospitalobj[0].ClinicName,
                    "BranchEmail": $scope.selectedHospitalobj[0].BranchEmail,
                    "CommunicationEmailId": doctorinfo.doctordata.User[0].CommunicationEmailId || "",
                    "CommunicationCountryCode": CommunicationCountryCode,
                    "CommunicationMobileNo": CommunicationMobileNo
                });
            }

            $scope.SelectedBranchDocId = $scope.clinicDoctorList[0].DoctorID;
            $scope.selectedDocObject.selectedPerson = $scope.clinicDoctorList[0];
            $scope.changeAppointmentDoctor($scope.SelectedBranchDocId, FromType);
        }
    }

    function InitializeBranchDoctors(allUsersList, SelectedBranch, FromType) {



        $scope.selectedHospitalobj = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': parseInt(SelectedBranch.BranchId) }, true);
        if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
            if ($scope.pagename !== "FollowUp") {
                if ($scope.selectedHospitalobj.length > 0) {
                    //$scope.clinicDoctorList = $filter("filter")(allUsersList, function (item) {
                    //    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                    //});
                    $scope.clinicDoctorList = [];
                    angular.forEach($scope.clinicDoctorAllList, function (Aitem) {

                        if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57 || Aitem.RoleId === 10 || Aitem.RoleId === 18) {
                            if (SelectedBranch.ClinicId === 0) {
                                $scope.clinicDoctorList.push(Aitem);
                            } else {

                                $scope.clinicDoctorList.push(Aitem);

                            }
                        }


                    });

                    //$scope.clinicOptometristsList = $filter("filter")(allUsersList, function (item) {
                    //    return item.RoleId === 10;
                    //});
                }
            } else if (FromType === "PageLaod" && $scope.pagename === "FollowUp") {
                if ($scope.selectedHospitalobj.length > 0) {
                    $scope.clinicDoctorList = [];
                    angular.forEach($scope.clinicDoctorAllList, function (Aitem) {

                        if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                            if (SelectedBranch.ClinicId === 0) {
                                $scope.clinicDoctorList.push(Aitem);
                            } else {
                                if (item.BranchId === SelectedBranch.ClinicId) {
                                    $scope.clinicDoctorList.push(Aitem);
                                }
                            }
                        }


                    });
                    $scope.clinicOptometristsList = $filter("filter")(allUsersList, function (item) {
                        return item.RoleId === 10;
                    });

                    $scope.clinicARAssistantList = $filter("filter")(allUsersList, function (item) {
                        return item.RoleId === 61;
                    });
                }
            }
            if (FromType === "ChangeEvent") {
                if ($scope.pagename !== 'FollowUp') {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.SelectedBranchDocId = "";
                        $scope.selectedDocObject.selectedPerson = "";
                    }
                }
            } else {
                if ($scope.pagename === "directFollowup") {
                    $scope.SelectedBranchDocId = "";
                    $scope.selectedDocObject.selectedPerson = "";
                    $scope.IsConsultationFollowUp = true;
                } else {
                    if (selectedDoctorinAppList !== "" && selectedDoctorinAppList !== undefined) {
                        $scope.SelectedBranchDocId = selectedDoctorinAppList.DoctorID;
                        $scope.selectedDocObject.selectedPerson = selectedDoctorinAppList;

                        console.log($scope.selectedDocObject.selectedPerson);
                        if (selectedDoctorinAppList.OptometristId !== "") {
                            //$scope.selectedOptometristObject = selectedDoctorinAppList;
                            $scope.selectedOptometristObject.optom = $filter('filter')($scope.clinicOptometristsList, { 'DoctorID': parseInt(selectedDoctorinAppList.OptometristId) }, true)[0];
                            $scope.SelectedOptometristId = selectedDoctorinAppList.OptometristId;
                        }

                        if (selectedDoctorinAppList.ARassistantId !== "") {
                            //$scope.selectedOptometristObject = selectedDoctorinAppList;
                            $scope.selectedArObject = $filter('filter')($scope.clinicARAssistantList, { 'DoctorID': parseInt(selectedDoctorinAppList.ARassistantId) }, true)[0];
                            $scope.SelectedArId = selectedDoctorinAppList.ARassistantId;
                        }
                    }
                    //  $scope.changeAppointmentDoctor($scope.SelectedBranchDocId, FromType);
                    // $scope.getUserBranchslots($scope.SelectedBranchDocId);
                }
            }
        }
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            console.log(FromType);
            // if (FromType === "PageLaod") {

            $scope.RestrictMultiAppointments = false;
            if (doctorinfo.doctordata.UserAddress[0].UserSlotInfo !== undefined) {
                if (doctorinfo.doctordata.UserAddress[0].UserSlotInfo.MultiSlotEnable) {
                    $scope.RestrictMultiAppointments = true;
                }
            }
            var CommunicationCountryCode = ""; var CommunicationMobileNo = "";
            if (doctorinfo.doctordata.UserCommunicationPhone !== undefined) {
                CommunicationCountryCode = doctorinfo.doctordata.UserCommunicationPhone[0].PhCntryCD;
                CommunicationMobileNo = doctorinfo.doctordata.UserCommunicationPhone[0].PhNumber;
            }

            $scope.clinicDoctorList = [];

            angular.forEach(allUsersList, function (Aitem) {
                if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                    if (SelectedBranch.ClinicId === 0) {
                        $scope.clinicDoctorList.push(Aitem);
                    } else {
                        $scope.clinicDoctorList.push(Aitem);

                    }
                }
            });

            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
            //}
            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
            $scope.SelectedBranchDocId = $scope.clinicDoctorList[0].DoctorID;
            $scope.selectedDocObject.selectedPerson = $scope.clinicDoctorList[0];

            if ($scope.RoleId === 1) {
                if (doctorinfo.doctordata.User.length != 0) {
                    if (doctorinfo.doctordata.User[0].DoctorID != undefined) {
                        var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID }, true);
                        if (clinicdoctorfilter.length != 0) {
                            $scope.SelectedBranchDocId = clinicdoctorfilter[0].DoctorID;
                            $scope.selectedDocObject.selectedPerson = clinicdoctorfilter[0];
                        }
                    }
                }
            }

            console.log($scope.IsComingFrom);

            if ($scope.IsComingFrom == 'Doctorcalendar') {
                if (selectedDoctorinAppList != undefined) {
                    if (selectedDoctorinAppList.DoctorID !== doctorinfo.doctordata.User[0].DoctorID) {
                        if ($scope.clinicDoctorList.length > 0) {
                            var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": selectedDoctorinAppList.DoctorID }, true);
                            if (clinicdoctorfilter.length != 0) {
                                $scope.SelectedBranchDocId = clinicdoctorfilter[0].DoctorID;
                                $scope.selectedDocObject.selectedPerson = clinicdoctorfilter[0];
                            }
                        }
                    }
                }
            }

            $scope.changeAppointmentDoctor($scope.SelectedBranchDocId, FromType);
        }
    }
    $scope.showHide = false;

    $scope.ChangeBookingType1 = function (type) {

        $scope.selectBookingType.IsWalkInSlot = type;
        if ($scope.selectBookingType.IsWalkInSlot == true) {
            $scope.selectBookingType.IsAppointmentConfirmed = true;
        } else {
            $scope.selectBookingType.IsAppointmentConfirmed = false;
        }
        $scope.selectBookingType.selectedBookAppo = ($scope.selectBookingType.IsWalkInSlot == true) ? "1" : "3";
        if ($scope.selectBookingType.IsWalkInSlot) {
            $scope.appointmentInfo.CheckinStatusId = 2;
            eHnoteMasterDataService.addAppointmentInfo($scope.appointmentInfo);
        }

        //$scope.BookingType = type;
        $scope.BookingType = $scope.selectBookingType.selectedBookAppo;
        //$scope.BookingType = type.Id;
        $scope.RoomSearchObj = {
            "RoomTypeId": 0,
            "RoomId": 0,
            "RoomTypeobj": "",
            "Opthamobj": "",
            "AssignedUserId": null,
            "ARobj": "",
            "OptomId": null,
            "ARId": null,
            "Technicianobj": "",
            "TechnicianId": null,
            "Counsellorobj": "",
            "CounsellorId": null,
            "DilationAssistantobj": "",
            "DilationAssistantId": null,
            "DoctorId": null,
            "Roomobj": "",
            "Billingobj": "",
            "NewApptStartTime": ""

        }
        if ($scope.BookingType === 1 || $scope.BookingType === "1") {
            //  $scope.IsCheckIn = true;
            $scope.IsCheckIn = 2;
            if ($scope.RoomTypeList.length > 0) {
                var List1 = $filter("filter")($scope.RoomTypeList, { "Id": 10 }, true) || [];
                if (List1.length > 0) {
                    $scope.RoomSearchObj.RoomTypeobj = List1[0];
                    $scope.RoomSearchObj.RoomTypeId = List1[0].Id;
                }
            }
        }
        if ($scope.BookingType === 3 || $scope.BookingType === "3") {
            //  $scope.IsCheckIn = false;
            $scope.IsCheckIn = 1;
        }

        $scope.IsReschduleSlotIND = true;
        // $scope.changeAppointmentDoctor($scope.SelectedBranchDocId);


        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
        if ($scope.BookingType === 1 || $scope.BookingType === "1") {
            if (appointmentDate > currentdate) {
                $scope.selectBookingType.IsAppointmentConfirmed = false;
            }
            else {
                $scope.selectBookingType.IsAppointmentConfirmed = true;
            }
        } else {
            $scope.selectBookingType.IsAppointmentConfirmed = false;
        }

    }



    $scope.RoomSearchObj = {
        "RoomTypeId": 0,
        "RoomId": 0,
        "RoomTypeobj": "",
        "Opthamobj": "",
        "AssignedUserId": null,
        "ARobj": "",
        "OptomId": null,
        "ARId": null,
        "Technicianobj": "",
        "TechnicianId": null,
        "Counsellorobj": "",
        "CounsellorId": null,
        "DilationAssistantobj": "",
        "DilationAssistantId": null,
        "DoctorId": null,
        "Roomobj": "",
        "Billingobj": "",
        "NewApptStartTime": ""
    }

    $scope.closeAvaliableSlots = function () {
        $scope.modalInstance.dismiss("cancel");
    };


    $scope.addAppointmentFormDataSubmit = function (userFormpatient, isPaymentLinkInd, isNavtoBill, Mainitem, Subtype) {
        $scope.ConsultationEntry.IsNavToBill = isNavtoBill;

        if ($scope.selectedPatientObj.FirstName !== "") {
            $scope.isregisterBtn = false;
        }
        else {
            alertify.error("Select a patient to book an appointment");
            return false;
        }
        var PaymentTypeId = parseInt($scope.paymentTypeObj.PaymentTypeId);

        if ($scope.SelectedBranchId === "" || $scope.SelectedBranchId === undefined) {
            alertify.error("Please Select a Branch");
            return false;
        }
        if ($scope.SelectedBranchDocId === "" || $scope.SelectedBranchDocId === undefined || $scope.SelectedBranchDocId === 0) {
            alertify.error("Please Select a Doctor");
            return false;
        }
        if ($scope.pagename === "reschedule") {   // reschedule time slot binding Divya(12 oct 2022)
            if ($scope.RescheduleSlotsObj.IsStartandEndInd === true) {
                $scope.RescheduleSlotsObj.StartTimeSlot = $scope.RescheduleSlotsObj.StartTimeSlot || "";
                if ($scope.RescheduleSlotsObj.StartTimeSlot != '') {
                    $scope.slot.patinet_appStarttime = {
                        "StartTime": $scope.RescheduleSlotsObj.originalSlot
                    };
                } else {
                    $scope.slot.patinet_appStarttime = "";
                }
                $scope.RescheduleSlotsObj.EndTimeSlot = $scope.RescheduleSlotsObj.EndTimeSlot || "";
                if ($scope.RescheduleSlotsObj.EndTimeSlot != '') {
                    $scope.slot.patient_appEndTime = $scope.RescheduleSlotsObj.EndTimeSlot;
                } else {
                    $scope.slot.patient_appEndTime = "";
                }
            }
        }
        if ($scope.slot.patinet_appStarttime === "" || $scope.slot.patinet_appStarttime === undefined || $scope.slot.patinet_appStarttime === null) {
            alertify.error(" Please Select Proper Start Time");
            return false;
        }
        Mainitem.OtherVisitRsn = Mainitem.OtherVisitRsn || "";
        if (Mainitem.OtherVisitRsn == "") {
            alertify.error("Please Enter Visit Reason");
            return false;
        }
        if ($scope.IsMaxSlotsAppointmentRestrictionForDoctorInd == true) {
            var apptTypeId = parseInt($scope.appointment_type.AppointmentTypeId);
            if (apptTypeId == 1) {
                alertify.error("Maximum New Appointments Reached for is Doctor. Please choose another doctor");
                return false;
            } else if (apptTypeId == 2) {
                alertify.error("Maximum Clinic followup appointments are reached for this doctor. Please choose another doctor");
                return false;
            } else if (apptTypeId == 3) {
                alertify.error("Maximum  Post-Op followup appointments are reached for this doctor. Please choose another doctor");
                return false;
            }
            else if (apptTypeId == 4 || apptTypeId == 14) {
                alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                return false;
            }
        }
        //if ($scope.isSurgery) {
        //    if ($scope.followUpObj.OrganizationSurgeryId === "") {
        //        alertify.error("Please Select Previous Surgery");
        //        return false;
        //    }
        //}
        $scope.SurgeryList = $scope.SurgeryList || [];
        if (!$scope.isAppValiddities.isValidOptionSelected) {
            alertify.error("Please Unblock the Slot or Choose Another Slot to continue");
            return false;
        }
        console.log($scope.UnblockSlots);
        console.log($scope.paymentTypeObj.AppointmentNote);
        if ($scope.UnblockSlots) {
            if ($scope.paymentTypeObj.AppointmentNote == '') {
                alertify.error("Please Enter Notes");
                return false;
            }
        }

        var visitreasonlist = $filter("filter")($scope.GetVisitReasonArray, function (kitem, index) { return kitem.Remarks !== '' });
        $scope.visitremarks = $scope.visitremarks || "";
        visitreasonlist = visitreasonlist || [];

        if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj != "") {
            var bitem = {};
            bitem = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj;
            var objectins = {
                "PatientAppointmentInsuranceDetailId": 0,
                "PatientInsuranceDetailId": bitem.PatientInsuranceDetailId,
                "PayorId": bitem.PayorId,
                "OrganizationPayorId": bitem.OrganizationPayorId,
                "PlanId": bitem.PlanId,
                "CoverageId": bitem.CoverageId,
                "IdentifierId": bitem.IdentifierId,
                "PayorName": bitem.PayorName,
                "DeleteInd": "N"
            }
            if ($scope.paymentTypeObj.PatientInsuranceList.length > 0) {
                var filter1 = $filter("filter")($scope.paymentTypeObj.PatientInsuranceList, function (Nitem) {
                    return Nitem.PatientInsuranceDetailId === objectins.PatientInsuranceDetailId;
                }) || [];
                if (filter1.length == 0) {
                    angular.forEach($scope.paymentTypeObj.PatientInsuranceList, function (item) {
                        item.DeleteInd = "Y";
                    });
                    $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
                }
            } else {
                $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
            }
        }
        if ($scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj != "") {
            var bitem = {};
            bitem = $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj;
            var objectins = {
                "PatientAppointmentInsuranceDetailId": 0,
                "PatientInsuranceDetailId": bitem.PatientInsuranceDetailId,
                "PayorId": bitem.PayorId,
                "PlanId": bitem.PlanId,
                "CoverageId": bitem.CoverageId,
                "IdentifierId": bitem.IdentifierId,
                "PayorName": bitem.PayorName,
                "DeleteInd": "N"
            }
            $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
        }


        if ($scope.isregisterBtn) {
            $scope.selectedPatInfo = "";
            $scope.selectedPatInfo.PatientID = 0;
            $scope.selectedPatInfo.PatientID = undefined;
            // alertify.error("Register a patient for  book an appointment");
        }
        else {
            if (validateAppoitntmentfields()) {
                /*if ($scope.SelectedBranchId === "" || $scope.SelectedBranchId === undefined) {
                    alertify.error("Please Select a Branch");
                    return false;
                }*/
                if ($scope.SelectedBranchDocId === "" || $scope.SelectedBranchDocId === undefined || $scope.SelectedBranchDocId === 0) {
                    alertify.error("Please Select a Doctor");
                    return false;
                }
                if ($scope.slot.patinet_appStarttime === "" || $scope.slot.patinet_appStarttime === undefined || $scope.slot.patinet_appStarttime === null) {
                    alertify.error(" Please Select Proper Start Time");
                    return;
                }
                //if ($scope.selectedPatientObj.PatientName !== "") {
                if ($scope.selectedPatientObj.FirstName !== "") {
                    $scope.blnChkPatient = false;
                    /* if ($scope.appointment_type.AppointmentTypeId === "" || $scope.appointment_type.AppointmentTypeId === undefined || $scope.appointment_type.AppointmentTypeId === null) {
                         alertify.error("Select AppointmentType");
                         return false;
                     }*/


                    for (var i = 0; i < $scope.setValue.length; i++) {
                        if ($scope.setValue[i].startTime === eHnoteMasterDataService.getSelectedAppointStartTime()) {
                            var consultIDAlert = $scope.setValue[i].consultID;
                        }
                    }
                    var daycd = $filter("date")(new Date($scope.appDate), "EEE").toUpperCase();
                    var patient_appStartTime = $scope.slot.patinet_appStarttime.StartTime;

                    var patient_appEndTime = 0;
                    var consultationTime = $scope.patinet_consultationTime;
                    if (consultationTime != undefined) {
                        var strtTime = moment(patient_appStartTime, "HH:mm");
                        var endTime = consultationTime.slice(0, -1);
                        if ($scope.patinet_consultationTime && patient_appStartTime) {
                            if ($scope.patinet_consultationTime.indexOf("m") !== -1) {
                                strtTime.add(endTime, "m");
                                patient_appEndTime = strtTime.format("HH:mm");
                            } else if ($scope.patinet_consultationTime.indexOf("h") !== -1) {
                                strtTime.add(endTime, "h");
                                patient_appEndTime = strtTime.format("HH:mm");
                            }
                        }
                    }
                    // patient_appEndTime = $scope.patient_appEndTime || "";
                    patient_appEndTime = patient_appEndTime || "";

                    var recurringAppointment = "";
                    if ($scope.isRepeat === "Y") {
                        if (new Date($scope.appDate).getTime() > new Date($scope.repeatEndDate).getTime()) {
                            alertify.error("Repeat End Date cannot be lesser than Start Date");
                            return false;
                        }
                        var recurringAppointment = {
                            "RecurringAppointment": {
                                "Mode": $scope.repeatType,
                                "Interval": $scope.repeatInterval,
                                "StartDate": $filter("date")(new Date($scope.appDate), "yyyy-MM-dd"),
                                "EndDate": $filter("date")(new Date($scope.repeatEndDate), "yyyy-MM-dd")
                            }
                        };
                    }
                    var patient_appDate = $filter("date")(new Date($scope.appDate), "yyyy-MM-dd");

                    var todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
                    if (patient_appDate > todaydate) {
                        console.log("future appointment");
                        $scope.IsCheckIn = 1;
                    } else {
                        console.log("Current date appointment");
                        if ($scope.pagename === 'book') {
                            if ($scope.BookingType == 1) {
                                $scope.IsCheckIn = 2;
                            } else if ($scope.BookingType == 3) {
                                $scope.IsCheckIn = 1;
                            }
                        } else {
                            $scope.IsCheckIn = $scope.appointmentInfo.CheckinStatusId == 2 ? $scope.appointmentInfo.CheckinStatusId : 1;
                        }
                    }


                    var patient_id = $scope.selectedPatientObj.PatientId;
                    if (patient_appStartTime === "Select Slot") {
                        alertify.error("Select Starttime");
                        return;
                    }
                    var DoctorID = $scope.SelectedBranchDocId;
                    var Final_StartTime = patient_appStartTime;

                    if (angular.isObject($scope.othervisitrsn)) {
                        var visitreason = $scope.othervisitrsn.Reason;
                    } else {
                        var visitreason = $scope.othervisitrsn;
                    }
                    var sendSms = ($scope.showAppNotification && $scope.notifySMS) ? "Y" : "N";
                    var sendMail = ($scope.showAppNotification && $scope.notifyMAIL) ? "Y" : "N";
                    var date = $filter("date")(new Date(), "yyyy-MM-dd");
                    var time = $filter("date")(new Date(), "HH:mm");
                    eHnoteMasterDataService.addDocPatientID($scope.selectedPatientObj.PatientId);
                    $scope.SubSource = 2;
                    $scope.Source = parseFloat($scope.Source) || 0;
                    var object = {
                        "PatientId": patient_id,
                        "AppointmentDate": $scope.appDate,
                        "HospitalId": $scope.SelectedBranchId,
                        "DoctorId": $scope.SelectedBranchDocId,
                        "VisitTypeId": parseInt($scope.appointment_type.AppointmentTypeId),
                    };

                    if ($scope.PatientDetailsForRegisterObj.PatientID != 0) {
                        eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
                            if (resp.data.Status) {
                                if ($scope.patientAppointmentID === resp.data.AppointmentID) {
                                    continuetobookAppointment($scope.appDate, Final_StartTime, patient_appEndTime, DoctorID, daycd, patient_appDate, patient_id, $scope.selectedDocObject.selectedPerson.UserBranchId, visitreason, $scope.appointment_type.AppointmentTypeId, $scope.appointment_type.AppointmentTypeId, $scope.followUpObj.OrganizationSurgeryId, $scope.AdmissionId, sendSms, sendMail, recurringAppointment, $scope.BookingType, isPaymentLinkInd, Subtype);

                                } else {
                                    alertify.error("This patient has an existing appointment scheduled for the same date");
                                    return false;
                                }
                            } else {
                                var param = {
                                    "PatientId": patient_id,
                                    "AppointmentDate": $scope.appDate,
                                    "HospitalId": $scope.SelectedBranchId,
                                    "DoctorId": 0,
                                    "VisitTypeId": parseInt($scope.appointment_type.AppointmentTypeId),
                                };
                                eHnotePatientDataService.CheckAppointmentStatus(param).then(function (response) {

                                    if (response.data.DummyBillingAppointmentId !== 0 && (parseInt($scope.SelectedBranchId) === response.data.DummyBranchId)) {
                                        $scope.patientAppointmentID = response.data.DummyBillingAppointmentId;
                                        $scope.patientBillingId = response.data.DummyBillId;


                                    } else {


                                        console.log($scope.pagename + "__$scope.pagename");

                                        if ($scope.pagename === 'book') {
                                            $scope.patientAppointmentID = response.data.AppointmentID;
                                        }

                                    }
                                    continuetobookAppointment($scope.appDate, Final_StartTime, patient_appEndTime, DoctorID, daycd, patient_appDate, patient_id, $scope.selectedDocObject.selectedPerson.UserBranchId, visitreason, $scope.appointment_type.AppointmentTypeId, $scope.appointment_type.AppointmentTypeId, $scope.followUpObj.OrganizationSurgeryId, $scope.AdmissionId, sendSms, sendMail, recurringAppointment, $scope.BookingType, isPaymentLinkInd, Subtype);

                                }, function (err) {
                                    console.log(err);
                                });
                            }
                        }, function (err) {
                            console.log(err);
                        });

                    } else {
                        continuetobookAppointment($scope.appDate, Final_StartTime, patient_appEndTime, DoctorID, daycd, patient_appDate, patient_id, $scope.selectedDocObject.selectedPerson.UserBranchId, visitreason, $scope.appointment_type.AppointmentTypeId, $scope.appointment_type.AppointmentTypeId, $scope.followUpObj.OrganizationSurgeryId, $scope.AdmissionId, sendSms, sendMail, recurringAppointment, $scope.BookingType, isPaymentLinkInd, Subtype);
                    }
                } else {
                    $scope.blnChkPatient = true;
                    alertify.error("Search for a patient to book an appointment");
                    return false;
                }
            }
        }


    };
    function continuetobookAppointment(apstdate, Final_StartTime, patient_appEndTime, DoctorID, daycd, patient_appDate, patient_id, Final_AddressId, visitreason, VisitRsnType, visit_usr_typeid, SurgeryOrgid, AdmissionId, sendSms, sendMail, recurringAppointment, bookingType, isPaymentLinkInd, Subtype) {
        $scope.Subtype = Subtype;
        $scope.IsSubmitDisabled = true;
        var date = $filter("date")(new Date(), "yyyy-MM-dd");
        //var chkblnLapsed = chkLapsedTime(patient_appEndTime);
        var time = $filter("date")(new Date(), "HH:mm");
        apstdate = $filter("date")(new Date(apstdate), "yyyy-MM-dd");
        //   $scope.PhNumber = $scope.selectedPatientObj.CountryCode + "" + $scope.selectedPatientObj.PatientMobile;
        $scope.PhNumber = $scope.selectedPatientObj.PatientMobile;
        // $scope.DocPHnumber = $scope.CountryCode + "" + $scope.MobileNo;
        $scope.DocPHnumber = $scope.MobileNo;
        //$scope.DocCommunicationPhnumber = $scope.CommunicationCountryCode + "" + $scope.CommunicationMobileNo;
        $scope.DocCommunicationPhnumber = $scope.CommunicationMobileNo;
        if ($scope.selectedPatInfo === undefined) {
            $scope.EmailId = "";
        } else {
            if ($scope.selectedPatInfo.EmailID === undefined) {
                $scope.EmailId = "";
            } else {
                //$scope.EmailId = $scope.selectedPatInfo.EmailID;
                $scope.selectedPatientObj.PatientEmail = $scope.selectedPatInfo.EmailID;
            }
        }

        $scope.Source = $scope.selectedPatientObj.ReferralSourceId || $scope.Source;
        //if ($scope.pagename === "directFollowup") {
        //    $scope.patientAppointmentID = 0;
        //    $scope.patientBillingId = 0;
        //}

        $scope.SelectedParentAppt = $scope.SelectedParentAppt || null;



        $scope.isPaymentLinkInd = false;
        $scope.isPaymentPending = false;

        if (isPaymentLinkInd) {
            $scope.isPaymentLinkInd = true;
            $scope.isPaymentPending = true;
        }

        if ($scope.appointmentInfo.IsPaymentPending && $scope.patientAppointmentID !== 0) {
            $scope.isPaymentLinkInd = true;
            $scope.isPaymentPending = true;
        }
        if ($scope.FinalCovidQuestionArray.length > 0) {
            angular.forEach($scope.FinalCovidQuestionArray, function (mitem) {
                angular.forEach($scope.masterQuestionsList, function (nitem) {
                    if (mitem.QuestionId === nitem.QuestionId) {
                        nitem.IsActive = nitem.IsActive;
                    }
                });
            });
        }
        if ($scope.selectedDeptObj === '' || $scope.selectedDeptObj === null) {
            if (DoctorID !== "") {
                if ($scope.clinicDoctorList.length > 0) {
                    angular.forEach($scope.clinicDoctorList, function (kitem) {
                        if (kitem.DoctorID === DoctorID) {
                            if (kitem.UserSubSpecialization.length > 0) {
                                angular.forEach(kitem.UserSubSpecialization, function (mitem) {
                                    if (mitem.IsPrimarySubSpecialization === true) {
                                        var obj = {
                                            "SubSpecializationId": mitem.SubSpecializationId,
                                            "BranchSubSpecializationId": mitem.BranchSubSpecializationId
                                        }
                                        $scope.selectedDeptObj = obj;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
        if ($scope.paymentTypeObj.AppointmentNotesList.length == 0) {
            if ($scope.paymentTypeObj.AppointmentNote != '') {
                var obj = {
                    "AppointmentNoteId": 0,
                    "Notes": $scope.paymentTypeObj.AppointmentNote || "",
                    "DeleteInd": "N",
                }
                $scope.paymentTypeObj.AppointmentNotesList.push(obj);
            }
        }

        var appointmenttypename = "";

        if ($scope.appointmentTypes.length > 0) {
            var ApptName = $filter("filter")($scope.appointmentTypes, function (item, index) { return item.AppointmentTypeId === $scope.appointment_type.AppointmentTypeId }, true);
            if (ApptName.length > 0) {
                var appointmenttypename = ApptName[0].AppointmentTypeName;
            }
        }
        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
        $scope.SurgeryList = $filter('filter')($scope.ApprovedSurgeryAppointments, { 'IsChecked': true }, true) || [];
        var Appparams = {
            "PatientName": $scope.selectedPatientObj.PatientName || ($scope.selectedPatientObj.FirstName + ' ' + $scope.selectedPatientObj.LastName),
            "PatientMobile": parseInt($scope.selectedPatientObj.PatientMobile),
            "PatientGender": $scope.selectedPatientObj.PatientGender,
            "PatientDOB": $scope.selectedPatientObj.DOB,
            "BloodGroup": $scope.selectedPatientObj.BloodGroup,
            "PatientAge": $scope.selectedPatientObj.PatientAge,
            "AppointmentID": $scope.patientAppointmentID ? $scope.patientAppointmentID : 0,
            "ParentAppointmentId": $scope.SelectedParentAppt !== null ? $scope.SelectedParentAppt.AppointmentId : 0,
            "RootAppointmentId": $scope.RootAppointmentId,
            "OrganId": $scope.newobj.OrganId || null,
            "NurseId": $scope.newobj.NurseId || null,
            "AnesthesistId": $scope.newobj.AnesthesistId || null,
            "AppointmentStatus": "B",
            "CurrentTime": $scope.CurrentTime,
            "StartTime": Final_StartTime,
            //"SlotTypeId": $scope.slot.SlotTypeId || 1,
            // "SlotAppointmentTypeId": $scope.slot.SlotAppointmentTypeId||1,
            "EndTime": patient_appEndTime,   // $scope.slot.patient_appEndTime,
            "DoctorID": parseInt(DoctorID),
            "RoomId": null,
            "RoomTypeId": null,
            "AssignedUserId": null,
            "DayCD": daycd,
            "VisitUserTypeID": visit_usr_typeid,
            "OrganizationSurgeryId": SurgeryOrgid,
            "AdmissionId": AdmissionId,
            "OtherVisitRsn": visitreason,
            "ConsultationDt": patient_appDate,
            "UserBranchId": Final_AddressId,
            //"OptometristId":parseInt($scope.SelectedOptometristId),
            "PatientID": patient_id,
            //"UserId": parseInt(DoctorID),
            "UserId": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": parseInt(VisitRsnType),
            "AppointmentPatientTypeId": parseInt($scope.AppointmentPatientTypeId) || 1,
            "ISFastTrackAppointment": $scope.isAppValiddities.ISFastTrackAppointment,
            "IsTeleMedicineSlot": $scope.ConsultationType.typename == 'VideoConsultation' ? true : false,
            "SubSpecializationId": $scope.selectedDeptObj.SubSpecializationId,
            "BranchSubSpecializationId": $scope.selectedDeptObj.BranchSubSpecializationId,
            "HospitalDetails": {
                "HospitalID": parseInt($scope.SelectedBranchId),
                "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "ReferralSourceDtls": {
                "ReferralID": 0,
                "SubReferralID": 2
            },
            "CommunicationDetails": {
                "PatientName": $scope.selectedPatientObj.PatientName || ($scope.selectedPatientObj.FirstName + ' ' + $scope.selectedPatientObj.LastName),
                "PatientMobile": $scope.PhNumber && $scope.PhNumber !== "" ? $scope.PhNumber : "",
                "DoctorMobile": $scope.DocPHnumber ? $scope.DocPHnumber : "",
                "HospitalName": $scope.selectedDocObject.selectedPerson.ClinicName,
                "DoctorName": $scope.selectedDocObject.selectedPerson.FullName,
                "AppDate": $scope.appDate,
                "AppTime": $scope.slot.patinet_appStarttime.StartTime,
                "AppClinic": $scope.selectedDocObject.selectedPerson.ClinicName,
                "AppToken": 0,
                // "PatientEmail": $scope.EmailId,
                "PatientEmail": $scope.selectedPatientObj.PatientEmail,
                "BranchEmail": $scope.selectedHospitalobj[0].BranchEmail,
                "DoctorEmail": $scope.DoctorEmailId,
                "HospitalContact": $scope.selectedDocObject.selectedPerson.MobileNo,
                "BrnachAddress": {
                    "Address1": $scope.selectedHospitalobj[0].Address1,
                    "Address2": $scope.selectedHospitalobj[0].Address2,
                    "Location": $scope.selectedHospitalobj[0].Location,
                    "StateId": $scope.selectedHospitalobj[0].StateId,
                    "PinCode": $scope.selectedHospitalobj[0].PinCode,
                    "CountryId": $scope.selectedHospitalobj[0].CountryId,
                    "CityId": $scope.selectedHospitalobj[0].CityId,
                    "DistrictRegion": $scope.selectedHospitalobj[0].DistrictRegion,
                    "Latitude": $scope.selectedHospitalobj[0].Latitude,
                    "Longitude": $scope.selectedHospitalobj[0].Longitude
                },
                "CommunicationEmailId": $scope.CommunicationEmailId,
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber ? $scope.DocCommunicationPhnumber : "",
                "DisplayNumber": $scope.PatientDetailsForRegisterObj.DisplayNumber
            },
            "PreviousAppointmentDate": cacheStorageItem.PreviousAppointmentDate,
            "PreviousAppointmentTime": cacheStorageItem.PreviousAppointmentTime,
            "IsFollowUp": ($scope.pagename === "FollowUp" ? true : false),
            "SendDocSms": $scope.sendDocSms,
            "SendDocEmail": $scope.sendDocEmail,
            "SendPatientEmail": $scope.sendPatientEmail,
            "SendPatientSms": $scope.sendPatientSms,
            "PatientEmail": $scope.selectedPatientObj.PatientEmail,
            //"PatientTypeId": $scope.PatientTypeId ? $scope.PatientTypeId : 1,
            "PatientTypeId": $scope.selectedPatientObj.PatientType ? $scope.selectedPatientObj.PatientType : 1,
            "PatientTitle": $scope.selectedPatientObj.PatientTitle,
            "PaidFollowup": $scope.isAppValiddities.PaidFollowup,
            "FirstName": $scope.selectedPatientObj.FirstName,
            "LastName": $scope.selectedPatientObj.LastName,
            "BSMSind": $scope.selectedPatientObj.BSMSind,
            "ContactNo": $scope.selectedPatientObj.ContactNo,
            "EmgyMobileNumber": $scope.selectedPatientObj.emgymobilenumber,
            "EmgyName": $scope.selectedPatientObj.emgyname,
            "EmgyRelationshipId": $scope.selectedPatientObj.emgyrelationship,
            "BookingTypeId": bookingType,
            "IsConsultationFollowUp": $scope.IsConsultationFollowUp || false,
            "IsCheckedIn": $scope.IsCheckIn || 1,
            "masterQuestions": $scope.masterQuestionsList || [],
            "InvestigationList": $scope.InvestigationList || [],
            "SurgeryList": $scope.SurgeryList || [],
            "PatientInsuranceList": $scope.paymentTypeObj.PatientInsuranceList || [],
            "AppointmentNotes": $scope.paymentTypeObj.AppointmentNotesList || [],
            "AttenderName": $scope.selectedPatientObj.AttenderName || "",
            "IsPaymentLinkInd": $scope.isPaymentLinkInd,
            "IsPaymentPending": $scope.isPaymentPending,
            "HospitalEquipmentId": $scope.HospitalEquipmentId || null,
            "PaymentTypeId": parseFloat($scope.paymentTypeObj.PaymentTypeId) || 0,
            "OrgInsuranceTpaId": parseFloat($scope.paymentTypeObj.OrgInsuranceTpaId) || 0,
            "DeviceEntityTypeId": 2,
            "IsConfirmedAppointment": $scope.selectBookingType.IsAppointmentConfirmed || false,
            "VisitTypeId": $scope.visitrsnId || null,
            // "IsPatientMissedAppointment": $scope.selectBookingType.IsPatientMissedAppointment || false,
            "IsInsuranceEligibilityVerify": $scope.selectBookingType.IsInsuranceEligibilityVerify || false,
            "IsPatientSmsInd": $scope.sendPatientSms || false,
            "IsPatientEmailInd": $scope.sendPatientEmail || false,
            "AppointmentTypeName": appointmenttypename,
            "DisplayNumber": $scope.PatientDetailsForRegisterObj.DisplayNumber,
            "VisitRemarks": $scope.visitremarks,
        };

        if (Appparams.DoctorVisitRsnID !== 10) {
            Appparams.InvestigationList = [];
        }

        if (parseInt(Appparams.BookingTypeId) === 1 && $scope.AppointmentCheckInDynamicStatus === 1 && $scope.IsCheckIn == 2) {
            Appparams.RoomId = $scope.RoomSearchObj.RoomId;
            Appparams.RoomTypeId = $scope.RoomSearchObj.RoomTypeId;
            Appparams.AssignedUserId = $scope.RoomSearchObj.AssignedUserId || Appparams.DoctorID;

        }
        console.log($scope.paymentTypeObj);
        if ($scope.appointmentInfo.AppointmentStatus === "O" && $scope.patientAppointmentID !== 0) {
            Appparams.AppointmentStatus = "O";
        }
        if ($scope.SpecializationId === 2) {
            if ($scope.pagename === "withoutConsultationFollowup") {
                Appparams.ParentAppointmentId = cacheStorageItem.appointmentid;
                Appparams.RootAppointmentId = cacheStorageItem.RootAppointmentId ? cacheStorageItem.RootAppointmentId : 0;
            }
        } else {
            if ($scope.pagename === "withoutConsultationFollowup" || $scope.pagename === "directFollowup" || $scope.pagename === "FollowUpAppointmentList") {
                Appparams.ParentAppointmentId = cacheStorageItem.appointmentid;
                Appparams.RootAppointmentId = cacheStorageItem.RootAppointmentId ? cacheStorageItem.RootAppointmentId : 0;
            }
            if ($scope.pagename === "directFollowup") {
                Appparams.ParentAppointmentId = cacheStorageItem.appointmentid;
                Appparams.RootAppointmentId = $scope.RootAppointmentId || Appparams.ParentAppointmentId ? $scope.RootAppointmentId : 0;
            }
        }
        $scope.SelectedOptometristId = $scope.SelectedOptometristId ? $scope.SelectedOptometristId : "";
        if ($scope.SelectedOptometristId !== "" && $scope.SelectedOptometristId !== undefined && $scope.SelectedOptometristId !== null) {
            Appparams.OptometristId = $scope.SelectedOptometristId;
        }

        Appparams.ARassistantId = 0;
        $scope.SelectedArId = $scope.SelectedArId || 0;
        if ($scope.SelectedArId !== 0) {
            Appparams.ARassistantId = $scope.SelectedArId;
        }


        Appparams.AppointmentTOSCodes = [];
        if ($scope.selectedTosCodesArray.length > 0) {
            Appparams.AppointmentTOSCodes = $scope.selectedTosCodesArray || [];
        }

        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(Appparams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {

            $scope.ApointmentAdded = false;
            $scope.patients = [];
            $scope.notifySMS = false;
            $scope.notifyMAIL = false;
            $scope.showHide = true;
            $scope.sendDocSms = false;
            $scope.sendDocEmail = false;
            $scope.sendPatientSms = false;
            $scope.sendPatientEmail = false;

            $rootScope.appointmentRootId = 0;
            $rootScope.appointmentParentId = 0;
            $rootScope.appointment_type = "";
            $rootScope.AppointmentPatient_type = "";
            $rootScope.FastTrackAppointment = false;


            if (data.status === "success") {

                if (parseInt(VisitRsnType) == 7 || parseInt(VisitRsnType) == 4) {
                    let SurgeryStatusUpdateObj = {
                        "AppointmentId": data.response.AppointmentID || 0,
                        "AppointmentTypeId": parseInt(VisitRsnType),
                        "SurgeriesList": $scope.SurgeryList || []
                    };

                    console.log(JSON.stringify(SurgeryStatusUpdateObj));

                    eHnoteSurgeryService.UpdateSurgeryStatusForPreAdmBooking(SurgeryStatusUpdateObj).then(function (resp) {

                    }, function (err) {
                        console.log(err);
                    });
                }

                let ScreenObj = datapersistanceFactory.getItem("AppointmentRequestScreen");
                if (ScreenObj.IsComingFrom === "AppointmentRequestScreen") {
                    let params = {
                        "PluginAppoitmentRequestId": ScreenObj.PluginAppoitmentRequestId || 0,
                        "PatientId": data.response.PatientID,
                        "MasterPatientId": ScreenObj.MasterPatientId,
                        "AppointmentId": data.response.AppointmentID,
                        "BranchId": data.response.BranchId,
                        "PreferredDate": $filter('date')(new Date(ScreenObj.PreferredDate), "yyyy-MM-dd"),
                        "RequestedDate": ScreenObj.RequestedDate,
                        "AppointmentRequestReasonId": ScreenObj.AppointmentRequestReasonId,
                        "Remarks": ScreenObj.Remarks,
                        "StatusId": 3,
                        "Status": "",
                        "DeleteInd": "N"
                    }
                    eHnoteUserAppointmentDataService.AddUpdatePluginAppointmentRequest(params).then(function (resp) {

                    }, function (err) {
                        console.log(err);
                    });
                }

                if ($scope.IsAutoEligibiltyCheckEnabled) {
                    $scope.ConsultationEntry.IsCheckInsuranceEligibility = true;
                }

                if ($scope.ConsultationEntry.IsCheckInsuranceEligibility) {


                    var AppointmentInsuranceDetailId = data.response.AppointmentInsuranceDetailId;
                    console.log(AppointmentInsuranceDetailId);

                    var sobj = {
                        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "HospitalId": data.response.HospitalID,
                        "DoctorId": data.response.DoctorID,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "PatientId": 0,
                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId
                    }


                    eHnoteInsuranceService.GetAppointmentInsuranceListDetails(sobj).then(function (resp) {

                        console.log(resp);


                        if (resp.data.status === "Success") {


                            var sitem = resp.data.rows[0];


                            eHnoteInsuranceService.checkPatientInsuranceEligibilityById(sitem, onSuccess, onError);
                            function onSuccess(resp) {
                                console.log(resp);

                                resp.errors = resp.errors || [];
                                if (resp.errors.length > 0) {
                                    var eparams = {
                                        "UserId": doctorinfo.doctorid,
                                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId,
                                        "InsuranceEligibilityErrorStatusId": 0,
                                        "ErrorDetails": [],
                                        "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
                                    }
                                    angular.forEach(resp.errors, function (eitem) {
                                        var eobj = {
                                            "Field": eitem.field,
                                            "Description": eitem.description
                                        }
                                        eparams.ErrorDetails.push(eobj);
                                    });



                                    eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
                                        if (response.data.status === 'Success') {

                                        }

                                    });
                                }
                                else {

                                    var PlanStatusCode = "", PlanStatus = "", ResponseJson = "";

                                    if (resp.planStatus.length > 0) {
                                        PlanStatusCode = resp.planStatus[0].statusCode;
                                        PlanStatus = resp.planStatus[0].status;
                                        ResponseJson = JSON.stringify(resp);
                                    }


                                    var obj = {
                                        "UserId": doctorinfo.doctorid,
                                        "PatientId": patient_id,
                                        "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId,
                                        "PlanStatusCode": PlanStatusCode,
                                        "PlanStatus": PlanStatus,
                                        "PatientCoPayAmount": 0,
                                        "PatientCoPayPercentage": 0,
                                        //  "benifitInformation": [],
                                        "BenifitCoveragesList": [],
                                        "BenifitCoverageDetailsList": []
                                    }
                                    resp.benefitsInformation = resp.benefitsInformation || [];
                                    resp.planStatus = resp.planStatus || [];


                                    if (resp.planStatus.length > 0) {
                                        angular.forEach(resp.planStatus, function (psitem) {
                                            angular.forEach(psitem.serviceTypeCodes, function (subitem) {
                                                var sobj = {
                                                    "PatientEligibilityBenifitId": 0,
                                                    "ServiceTypeCode": subitem || 0,
                                                    "Status": psitem.status,
                                                    "IsCopayIdentified": false,
                                                    "DeleteInd": false,
                                                }

                                                obj.BenifitCoveragesList.push(sobj);
                                            });

                                        });
                                    }

                                    if (resp.benefitsInformation.length > 0) {
                                        angular.forEach(resp.benefitsInformation, function (bitem) {
                                            angular.forEach(bitem.serviceTypeCodes, function (subitem) {
                                                bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                                                var BenifitDateInformation = '';
                                                if (bitem.benefitsDateInformation != '') {
                                                    bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                                                    bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                                                    BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                                                }

                                                var sobj = {
                                                    "PatientEligibilityBenifitDetailId": 0,
                                                    "ServiceTypeCode": subitem || 0,
                                                    "BenifitTypeName": bitem.name,
                                                    "BenifitAmount": bitem.benefitAmount || 0,
                                                    "BenifitPercentage": bitem.benefitPercent || 0,
                                                    "BenifitDateInformation": BenifitDateInformation || "",
                                                    "TimeQualifier": bitem.timeQualifier || '',
                                                    "CoverageLevel": bitem.coverageLevel || '',
                                                    "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                                                    "DeleteInd": false,
                                                }

                                                obj.BenifitCoverageDetailsList.push(sobj);
                                            });

                                        });
                                    }
                                    



                                    eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                                        console.log(response);
                                        if (response.data.status === 'Success') {

                                        }

                                    });
                                }

                            }
                            function onError(reponse) {
                            }

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });

                }

                if (data.response.DoctorID !== 0) {
                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    appoint_info.DoctorID = data.response.DoctorID;
                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                }



                if (!$scope.ConsultationEntry.IsNavToBill) {

                    if ($scope.IsTreatmentFollowupAppointment) {
                        alertify.success('Appointment Created Successfully');
                        $scope.$emit('treatmentFollowupSuccess', data.response);
                    }
                    else if ($scope.pagename === "surgery") {
                        alertify.success('Surgery Appointment Created Successfully');
                        $scope.$emit('surgeryAppointmentsuccess', data);
                    }
                    else if ($scope.pagename === "surgeryFileUpload") {
                        alertify.success('Surgery Appointment Created Successfully');
                        $scope.$emit('surgeryFileUploadAppointmentsuccess', data);
                    }
                    else {
                        if ($scope.patientAppointmentID && !$filter("isObject")($scope.SelectedDummyAppointment)) {
                            alertify.success('Appointment has been Re-Scheduled Successfully');
                            $scope.$emit("bookapptreshedulesuccessMethod", data);
                        } else {
                            alertify.success('Appointment Created Successfully');

                            if ($scope.Subtype == 'multipleAppt') {
                                $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();
                                if ($scope.SelectedBranchDocId != 0) {
                                    var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === $scope.SelectedBranchDocId);
                                }
                                if (Index > -1) {
                                    $scope.AppointmentDetailsInfo.selectedDocObject.selectedPerson = $scope.clinicDoctorList[Index];
                                }
                                if ($scope.MultipleAppointmentList.length > 0) {
                                    angular.forEach($scope.MultipleAppointmentList, function (item) {
                                        item.IsEdit = false;
                                    });
                                }
                                $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);
                                $scope.appointment_type.AppointmentTypeId = '';
                                $scope.patinet_appStarttime = '';
                                $scope.slot.patinet_appStarttime = '';
                                $scope.patient_appEndTime = '';
                                $scope.slot.patient_appEndTime = '';
                                $scope.AppointmentRescheduleObj.StartTime = "";

                            } else {
                                $scope.$emit('BookApptsuccessMethod', data);
                            }

                        }
                    }
                }
                else {
                    alertify.success('Appointment Created Successfully');

                    $scope.appointmentInfo.PatientDetails = $scope.selectedPatientObj;
                    $scope.appointmentInfo.AppointmentID = data.response.AppointmentID;
                    $scope.appointmentInfo.PatientDetails.PatientDisplayId = $scope.appointmentInfo.PatientDetails.DisplayID;
                    $scope.appointmentInfo.PatientDetails.FullName = $scope.appointmentInfo.PatientDetails.PatientName;
                    $scope.appointmentInfo.PatientDetails.PatientID = data.response.PatientID;
                    $scope.appointmentInfo.PatientDetails.Gender = $scope.selectedPatientObj.PatientGender;
                    $scope.appointmentInfo.PatientDetails.MobileNo = $scope.selectedPatientObj.PatientMobile;
                    $scope.appointmentInfo.DoctorID = data.response.DoctorID;
                    $scope.appointmentInfo.DoctorFullName = data.response.DoctorName;
                    $scope.appointmentInfo.DoctorSpecialization = data.response.DoctorSpecialization;
                    $scope.appointmentInfo.DoctorEmail = data.response.DoctorEmailId;
                    $scope.appointmentInfo.DoctorDesignation = data.response.Designation;
                    $scope.appointmentInfo.BillingCategoryType = data.response.BillingCategoryType;
                    $scope.appointmentInfo.BillingCategoryTypeId = data.response.BillingCategoryTypeId;
                    $scope.appointmentInfo.ConsultationDt = data.response.ConsultationDt;
                    $scope.appointmentInfo.BranchId = data.response.BranchId;
                    $scope.appointmentInfo.DoctorVisitRsnID = data.response.DoctorVisitRsnID;
                    $scope.appointmentInfo.CaptureBillingFrom = "AppointmentPopup";

                    console.log($scope.paymentTypeObj.PaymentTypeId + "__PaymentTypeId");
                    $scope.appointmentInfo.PaymentTypeId = $scope.paymentTypeObj.PaymentTypeId;
                    $scope.appointmentInfo.ConsultationId = 0;
                    $scope.appointmentInfo.PatientID = data.response.PatientID;
                    $scope.appointmentInfo.Gender = $scope.selectedPatientObj.PatientGender;
                    $scope.appointmentInfo.MobileNo = $scope.selectedPatientObj.PatientMobile;
                    $scope.appointmentInfo.TreatmentPlanId = 0;
                    $scope.appointmentInfo.OrgInsuranceTpaId = data.response.OrgInsuranceTpaId;
                    $scope.appointmentInfo.BillingCategoryTypeId = data.response.BillingCategoryTypeId;
                    $scope.appointmentInfo.BillingCategoryType = data.response.BillingCategoryType;
                    $scope.appointmentInfo.IsTeleMedicineSlot = $scope.ConsultationType.typename == 'VideoConsultation' ? true : false;
                    $scope.appointmentInfo.DoctorSpecializationId = $scope.SpecializationId;
                    $scope.appointmentInfo.ISFastTrackAppointment = $scope.isAppValiddities.ISFastTrackAppointment;
                    if ($scope.selectedDocObject.selectedPerson !== undefined) {
                        if ($scope.selectedDocObject.selectedPerson.SpecialityCD.SpecializationId) {
                            $scope.appointmentInfo.DoctorSpecializationId = $scope.selectedDocObject.selectedPerson.SpecialityCD.SpecializationId;
                        }
                    }


                    console.log(JSON.stringify($scope.appointmentInfo));


                    eHnoteMasterDataService.addAppointmentInfo($scope.appointmentInfo);

                    $location.url("/appointmentbilling");

                }


                if ($scope.ConsultationEntry.IsConsultationEntryFormPrint) {

                    cacheStorageItem.PatientDetails = cacheStorageItem.PatientDetails || {};

                    if (!angular.equals(cacheStorageItem.PatientDetails, {})) {

                        object = {
                            "PatientDetails": {
                                "FullName": cacheStorageItem.PatientDetails.FullName,
                                "PatientDisplayId": cacheStorageItem.PatientDetails.PatientDisplayId,
                                "Gender": cacheStorageItem.PatientDetails.Gender,
                                "MobileNo": cacheStorageItem.PatientDetails.MobileNo,
                                "AgeInMonths": cacheStorageItem.PatientDetails.AgeInMonths,
                                "AgeInYears": cacheStorageItem.PatientDetails.AgeInYears,
                                "AgeInDays": cacheStorageItem.PatientDetails.AgeInDays,
                                "Title": cacheStorageItem.PatientDetails.Title,
                                "Location": cacheStorageItem.PatientDetails.Location,
                                "Occupation": cacheStorageItem.PatientDetails.Occupation,
                                "CityName": cacheStorageItem.PatientDetails.CityName,
                                "StateName": cacheStorageItem.PatientDetails.StateName,
                                "PatientType": cacheStorageItem.PatientDetails.PatientType,
                                "OccupationNotes": cacheStorageItem.PatientDetails.OccupationNotes,
                                "ReferralSourceName": $scope.selectedPatientObj.ReferalSource,
                                "AlternatePhoneNo": $scope.selectedPatientObj.AltPhone,
                                "AlternateLandline": $scope.selectedPatientObj.AltLandline,
                                "AltCountryCode": $scope.countrycode,
                                "Altareacode": $scope.selectedPatientObj.AltareaCode
                            },
                            "DoctorFullName": $scope.selectedDocObject.selectedPerson.FullName,
                            "IsPrefix": $scope.selectedDocObject.selectedPerson.IsPrefix,
                            "ConsultationDt": moment($scope.appDate, "DD-MMM-YYYY").format("YYYY-MM-DD"),
                            "StartTime": $scope.slot.patinet_appStarttime.StartTime
                        };

                    }
                    else {
                        object = {
                            "PatientDetails": {
                                "FullName": $scope.selectedPatientObj.PatientName || $scope.selectedPatientObj.FullName,
                                "PatientDisplayId": $scope.selectedPatientObj.DisplayID,
                                "Gender": $scope.selectedPatientObj.PatientGender || $scope.selectedPatientObj.Gender,
                                "MobileNo": $scope.selectedPatientObj.PatientMobile || $scope.selectedPatientObj.PhoneNumber,

                                "AgeInMonths": $scope.selectedPatientObj.AgeInMonths,
                                "AgeInYears": $scope.selectedPatientObj.AgeInYears,
                                "AgeInDays": $scope.selectedPatientObj.AgeInDays,
                                "Title": $scope.selectedPatientObj.Title,
                                "Location": $scope.selectedPatientObj.Location || $scope.selectedPatientObj.Area,
                                "Occupation": $scope.selectedPatientObj.Occupation,
                                "OccupationNotes": $scope.selectedPatientObj.OccupationNotes,
                                "CityName": $scope.selectedPatientObj.CityName,
                                "StateName": $scope.selectedPatientObj.StateName,
                                "PatientType": $scope.selectedPatientObj.PatientType,
                                "ReferralSourceName": $scope.selectedPatientObj.ReferalSource
                            },
                            "DoctorFullName": $scope.selectedDocObject.selectedPerson.FullName,
                            "IsPrefix": $scope.selectedDocObject.selectedPerson.IsPrefix,
                            "ConsultationDt": moment($scope.appDate, "DD-MMM-YYYY").format("YYYY-MM-DD"),
                            "StartTime": $scope.slot.patinet_appStarttime.StartTime
                        };

                    }



                    eHnotePrintService.GenerateConsultationEntryPrint(object);



                }






            } else {
                alertify.error("Appointment creation failed");
                $scope.$emit("BookApptsuccessMethod", data);
            }
            $scope.IsSubmitDisabled = false;

            if (data.response.TokenNumber === "0") {
                $scope.Token = "";
            } else {
                $scope.Token = data.response.TokenNumber;
            }
            $scope.TIME = $scope.slot.patinet_appStarttime.StartTime;
            $scope.date = $filter("date")(new Date(), "dd-MM-yyyy");

        }
        function OnCaseSaveError(err) {
            alertify.error("Error in Creating Appointment");
            $scope.IsSubmitDisabled = false;
        }
    }

    $scope.AddupdateAppointment = function (Mainitem, Subtype) {
        $scope.Subtype = Subtype;
        if ($scope.SelectedBranchId === "" || $scope.SelectedBranchId === undefined) {
            alertify.error("Please Select a Branch");
            return false;
        }
        $scope.SelectedBranchDocId = $scope.SelectedBranchDocId || "";
        $scope.slot.patinet_appStarttime = $scope.slot.patinet_appStarttime || "";
        if ($scope.SelectedBranchDocId === "") {
            alertify.error("Please Select a Doctor");
            return false;
        }
        if ($scope.slot.patinet_appStarttime === "") {
            alertify.error(" Please Select Proper Start Time");
            return false;
        }
        Mainitem.OtherVisitRsn = Mainitem.OtherVisitRsn || "";
        Mainitem.AppointmentTypeId = Mainitem.AppointmentTypeId || "";
        if (Mainitem.OtherVisitRsn == "") {
            alertify.error("Please Enter Visit Reason");
            return false;
        }
        if ($scope.IsMaxSlotsAppointmentRestrictionForDoctorInd == true) {
            var apptTypeId = parseInt(Mainitem.AppointmentTypeId);
            if (apptTypeId == 1) {
                alertify.error("Maximum New Appointments Reached for is Doctor. Please choose another doctor");
                return false;
            } else if (apptTypeId == 2) {
                alertify.error("Maximum Clinic followup appointments are reached for this doctor. Please choose another doctor");
                return false;
            } else if (apptTypeId == 3) {
                alertify.error("Maximum  Post-Op followup appointments are reached for this doctor. Please choose another doctor");
                return false;
            }
            else if (apptTypeId == 4 || apptTypeId == 14) {
                alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                return false;
            }
        }


        var patient_id = $scope.selectedPatientObj.PatientId;
        var object = {
            "PatientId": patient_id,
            "AppointmentDate": $scope.appDate,
            "HospitalId": $scope.SelectedBranchId,
            "DoctorId": $scope.SelectedBranchDocId,
            "VisitTypeId": parseInt($scope.appointment_type.AppointmentTypeId),
        };
        eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
            if (resp.data.Status) {
                if ($scope.patientAppointmentID === resp.data.AppointmentID) {
                    continuetonewbookAppointment(Mainitem, Subtype);

                } else {
                    alertify.error("This patient has an existing appointment scheduled for the same date");
                    return false;
                }
            } else {
                var param = {
                    "PatientId": patient_id,
                    "AppointmentDate": $scope.appDate,
                    "HospitalId": $scope.SelectedBranchId,
                    "DoctorId": 0,
                    "VisitTypeId": parseInt($scope.appointment_type.AppointmentTypeId),
                };
                eHnotePatientDataService.CheckAppointmentStatus(param).then(function (response) {

                    if (response.data.DummyBillingAppointmentId !== 0 && (parseInt($scope.SelectedBranchId) === response.data.DummyBranchId)) {
                        $scope.patientAppointmentID = response.data.DummyBillingAppointmentId;
                        $scope.patientBillingId = response.data.DummyBillId;


                    } else {
                        if ($scope.pagename === 'book') {
                            $scope.patientAppointmentID = response.data.AppointmentID;
                        }

                    }
                    continuetonewbookAppointment(Mainitem, Subtype);
                }, function (err) {
                    console.log(err);
                });
            }

        }, function (err) {
            console.log(err);
        });
    }

    function continuetonewbookAppointment(Mainitem, Subtype) {
        if ($scope.selectedDeptObj === '' || $scope.selectedDeptObj === null) {
            if (Mainitem.selectedDocObject.selectedPerson.DoctorID !== "") {
                if ($scope.clinicDoctorList.length > 0) {
                    angular.forEach($scope.clinicDoctorList, function (kitem) {
                        if (kitem.DoctorID === Mainitem.selectedDocObject.selectedPerson.DoctorID) {
                            if (kitem.UserSubSpecialization.length > 0) {
                                angular.forEach(kitem.UserSubSpecialization, function (mitem) {
                                    if (mitem.IsPrimarySubSpecialization === true) {
                                        var obj = {
                                            "SubSpecializationId": mitem.SubSpecializationId,
                                            "BranchSubSpecializationId": mitem.BranchSubSpecializationId
                                        }
                                        $scope.selectedDeptObj = obj;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
        Mainitem.AppointmentNotesList = Mainitem.AppointmentNotesList || [];
        if (Mainitem.AppointmentNotesList.length == 0) {
            if (Mainitem.SelectedNotesobj.AppointmentNote != '') {
                var obj = {
                    "AppointmentNoteId": 0,
                    "Notes": Mainitem.SelectedNotesobj.AppointmentNote || "",
                    "DeleteInd": "N",
                }
                Mainitem.AppointmentNotesList.push(obj);
            }
        }

        if ($scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj != "") {
            var bitem = {};
            bitem = $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj;
            var objectins = {
                "PatientAppointmentInsuranceDetailId": 0,
                "PatientInsuranceDetailId": bitem.PatientInsuranceDetailId,
                "PayorId": bitem.PayorId,
                "OrganizationPayorId": bitem.OrganizationPayorId,
                "PlanId": bitem.PlanId,
                "CoverageId": bitem.CoverageId,
                "IdentifierId": bitem.IdentifierId,
                "PayorName": bitem.PayorName,
                "DeleteInd": "N"
            }
            if ($scope.paymentTypeObj.PatientInsuranceList.length > 0) {
                var filter1 = $filter("filter")($scope.paymentTypeObj.PatientInsuranceList, function (Nitem) {
                    return Nitem.PatientInsuranceDetailId === objectins.PatientInsuranceDetailId;
                }) || [];
                if (filter1.length == 0) {
                    angular.forEach($scope.paymentTypeObj.PatientInsuranceList, function (item) {
                        item.DeleteInd = "Y";
                    });
                    $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
                }
            } else {
                $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
            }
        }
        if ($scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj != "") {
            var bitem = {};
            bitem = $scope.paymentTypeObj.SelectPatientSecondaryInsuranceObj;
            var objectins = {
                "PatientAppointmentInsuranceDetailId": 0,
                "PatientInsuranceDetailId": bitem.PatientInsuranceDetailId,
                "PayorId": bitem.PayorId,
                "PlanId": bitem.PlanId,
                "CoverageId": bitem.CoverageId,
                "IdentifierId": bitem.IdentifierId,
                "PayorName": bitem.PayorName,
                "DeleteInd": "N"
            }
            $scope.paymentTypeObj.PatientInsuranceList.push(objectins);
        }


        var patient_appDate = $filter("date")(new Date(Mainitem.appDate), "yyyy-MM-dd");

        var todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (patient_appDate > todaydate) {
            console.log("future appointment");
            $scope.IsCheckIn = 1;
        } else {
            console.log("Current date appointment");
            if ($scope.pagename === 'book') {
                if (Mainitem.BookingType == 1) {
                    $scope.IsCheckIn = 2;
                } else if (Mainitem.BookingType == 3) {
                    $scope.IsCheckIn = 1;
                }
            } else {
                $scope.IsCheckIn = $scope.appointmentInfo.CheckinStatusId == 2 ? $scope.appointmentInfo.CheckinStatusId : 1;
            }
        }

        var appointmenttypename = "";
        if ($scope.appointmentTypes.length > 0) {
            var ApptName = $filter("filter")($scope.appointmentTypes, function (item, index) { return item.AppointmentTypeId === $scope.appointment_type.AppointmentTypeId }, true);
            if (ApptName.length > 0) {
                var appointmenttypename = ApptName[0].AppointmentTypeName;
            }
        }

        var daycd = $filter("date")(new Date(Mainitem.appDate), "EEE").toUpperCase();
        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
        $scope.SurgeryList = $filter('filter')($scope.ApprovedSurgeryAppointments, { 'IsChecked': true }, true) || [];
        var Appparams = {
            "PatientID": patient_id,
            "PatientName": $scope.selectedPatientObj.PatientName || ($scope.selectedPatientObj.FirstName + ' ' + $scope.selectedPatientObj.LastName),
            "PatientMobile": parseInt($scope.selectedPatientObj.PatientMobile),
            "PatientGender": $scope.selectedPatientObj.PatientGender,
            "PatientDOB": $scope.selectedPatientObj.DOB,
            "BloodGroup": $scope.selectedPatientObj.BloodGroup,
            "PatientAge": $scope.selectedPatientObj.PatientAge,
            "AppointmentID": $scope.patientAppointmentID ? $scope.patientAppointmentID : 0,
            "ParentAppointmentId": 0,
            "RootAppointmentId": null,
            "OrganId": null,
            "NurseId": null,
            "AnesthesistId": null,
            "AppointmentStatus": "B",
            "CurrentTime": $scope.CurrentTime,
            "StartTime": Final_StartTime,
            "EndTime": Mainitem.patient_appEndTime,   // $scope.slot.patient_appEndTime,
            "DoctorID": parseInt(DoctorID),
            "RoomId": null,
            "RoomTypeId": null,
            "AssignedUserId": null,
            "AdmissionId": null,
            "DayCD": daycd,
            "VisitUserTypeID": visit_usr_typeid,
            "OrganizationSurgeryId": SurgeryOrgid,
            "PatientInsuranceList": $scope.paymentTypeObj.PatientInsuranceList || [],
            "AppointmentNotes": Mainitem.AppointmentNotesList || [],
            "OtherVisitRsn": Mainitem.visitreason,
            "VisitRemarks": Mainitem.visitremarks,
            "BookingTypeId": Mainitem.BookingType,
            "IsConfirmedAppointment": Mainitem.selectBookingType.IsAppointmentConfirmed || false,
            "ConsultationDt": patient_appDate,
            "UserBranchId": Final_AddressId,
            "UserId": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": parseInt(VisitRsnType),
            "AppointmentPatientTypeId": parseInt($scope.AppointmentPatientTypeId) || 1,
            "ISFastTrackAppointment": false,
            "IsTeleMedicineSlot": false,
            "SubSpecializationId": $scope.selectedDeptObj.SubSpecializationId,
            "BranchSubSpecializationId": $scope.selectedDeptObj.BranchSubSpecializationId,
            "HospitalDetails": {
                "HospitalID": parseInt($scope.SelectedBranchId),
                "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "ReferralSourceDtls": {
                "ReferralID": parseInt($scope.Source),
                "SubReferralID": 2
            },
            "CommunicationDetails": {
                "PatientName": $scope.selectedPatientObj.PatientName || ($scope.selectedPatientObj.FirstName + ' ' + $scope.selectedPatientObj.LastName),
                "PatientMobile": $scope.PhNumber && $scope.PhNumber !== "" ? $scope.PhNumber : "",
                "DoctorMobile": $scope.DocPHnumber ? $scope.DocPHnumber : "",
                "HospitalName": $scope.selectedDocObject.selectedPerson.ClinicName,
                "DoctorName": $scope.selectedDocObject.selectedPerson.FullName,
                "AppDate": $scope.appDate,
                "AppTime": $scope.slot.patinet_appStarttime.StartTime,
                "AppClinic": $scope.selectedDocObject.selectedPerson.ClinicName,
                "AppToken": 0,
                // "PatientEmail": $scope.EmailId,
                "PatientEmail": $scope.selectedPatientObj.PatientEmail,
                "BranchEmail": $scope.selectedHospitalobj[0].BranchEmail,
                "DoctorEmail": $scope.DoctorEmailId,
                "HospitalContact": $scope.selectedDocObject.selectedPerson.MobileNo,
                "BrnachAddress": {
                    "Address1": $scope.selectedHospitalobj[0].Address1,
                    "Address2": $scope.selectedHospitalobj[0].Address2,
                    "Location": $scope.selectedHospitalobj[0].Location,
                    "StateId": $scope.selectedHospitalobj[0].StateId,
                    "PinCode": $scope.selectedHospitalobj[0].PinCode,
                    "CountryId": $scope.selectedHospitalobj[0].CountryId,
                    "CityId": $scope.selectedHospitalobj[0].CityId,
                    "DistrictRegion": $scope.selectedHospitalobj[0].DistrictRegion,
                    "Latitude": $scope.selectedHospitalobj[0].Latitude,
                    "Longitude": $scope.selectedHospitalobj[0].Longitude
                },
                "CommunicationEmailId": $scope.CommunicationEmailId,
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber ? $scope.DocCommunicationPhnumber : "",
                "DisplayNumber": $scope.PatientDetailsForRegisterObj.DisplayNumber
            },
            "PreviousAppointmentDate": $scope.appDate,
            "PreviousAppointmentTime": "",
            "IsFollowUp": false,
            "SendDocSms": Mainitem.SendDocSms,
            "SendDocEmail": Mainitem.SendDocEmail,
            "SendPatientEmail": Mainitem.SendPatientEmail,
            "SendPatientSms": Mainitem.SendPatientSms,
            "IsPatientSmsInd": Mainitem.SendPatientSms || false,
            "IsPatientEmailInd": Mainitem.SendPatientEmail || false,


            "PatientEmail": $scope.selectedPatientObj.PatientEmail,
            //"PatientTypeId": $scope.PatientTypeId ? $scope.PatientTypeId : 1,
            "PatientTypeId": $scope.selectedPatientObj.PatientType ? $scope.selectedPatientObj.PatientType : 1,
            "PatientTitle": $scope.selectedPatientObj.PatientTitle,
            "PaidFollowup": $scope.isAppValiddities.PaidFollowup,
            "FirstName": $scope.selectedPatientObj.FirstName,
            "LastName": $scope.selectedPatientObj.LastName,
            "BSMSind": $scope.selectedPatientObj.BSMSind,
            "ContactNo": $scope.selectedPatientObj.ContactNo,
            "EmgyMobileNumber": $scope.selectedPatientObj.emgymobilenumber,
            "EmgyName": $scope.selectedPatientObj.emgyname,
            "EmgyRelationshipId": $scope.selectedPatientObj.emgyrelationship,

            "IsConsultationFollowUp": false,
            "IsCheckedIn": $scope.IsCheckIn || 1,
            "masterQuestions": [],
            "InvestigationList": [],
            "SurgeryList": $scope.SurgeryList || [],

            "AttenderName": $scope.selectedPatientObj.AttenderName || "",
            "IsPaymentLinkInd": false,
            "IsPaymentPending": false,
            "HospitalEquipmentId": null,
            "PaymentTypeId": parseFloat($scope.paymentTypeObj.PaymentTypeId) || 0,
            "OrgInsuranceTpaId": 0,
            "DeviceEntityTypeId": 2,

            "VisitTypeId": $scope.visitrsnId || null,
            "IsInsuranceEligibilityVerify": $scope.selectBookingType.IsInsuranceEligibilityVerify || false,

            "AppointmentTypeName": appointmenttypename,
            "DisplayNumber": $scope.PatientDetailsForRegisterObj.DisplayNumber,

        };

        if (parseInt(Appparams.BookingTypeId) === 1 && $scope.AppointmentCheckInDynamicStatus === 1 && $scope.IsCheckIn == 2) {
            Appparams.RoomId = $scope.RoomSearchObj.RoomId;
            Appparams.RoomTypeId = $scope.RoomSearchObj.RoomTypeId;
            Appparams.AssignedUserId = $scope.RoomSearchObj.AssignedUserId || Appparams.DoctorID;

        }
        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(Appparams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {

            $scope.ApointmentAdded = false;
            $scope.patients = [];
            $scope.notifySMS = false;
            $scope.notifyMAIL = false;
            $scope.showHide = true;
            $scope.sendDocSms = false;
            $scope.sendDocEmail = false;
            $scope.sendPatientSms = false;
            $scope.sendPatientEmail = false;

            $rootScope.appointmentRootId = 0;
            $rootScope.appointmentParentId = 0;
            $rootScope.appointment_type = "";
            $rootScope.AppointmentPatient_type = "";
            $rootScope.FastTrackAppointment = false;


            if (data.status === "success") {

                if (parseInt(VisitRsnType) == 7 || parseInt(VisitRsnType) == 4) {
                    let SurgeryStatusUpdateObj = {
                        "AppointmentId": data.response.AppointmentID || 0,
                        "AppointmentTypeId": parseInt(VisitRsnType),
                        "SurgeriesList": $scope.SurgeryList || []
                    };

                    console.log(JSON.stringify(SurgeryStatusUpdateObj));

                    eHnoteSurgeryService.UpdateSurgeryStatusForPreAdmBooking(SurgeryStatusUpdateObj).then(function (resp) {

                    }, function (err) {
                        console.log(err);
                    });
                }

                let ScreenObj = datapersistanceFactory.getItem("AppointmentRequestScreen");
                if (ScreenObj.IsComingFrom === "AppointmentRequestScreen") {
                    let params = {
                        "PluginAppoitmentRequestId": ScreenObj.PluginAppoitmentRequestId || 0,
                        "PatientId": data.response.PatientID,
                        "MasterPatientId": ScreenObj.MasterPatientId,
                        "AppointmentId": data.response.AppointmentID,
                        "BranchId": data.response.BranchId,
                        "PreferredDate": $filter('date')(new Date(ScreenObj.PreferredDate), "yyyy-MM-dd"),
                        "RequestedDate": ScreenObj.RequestedDate,
                        "AppointmentRequestReasonId": ScreenObj.AppointmentRequestReasonId,
                        "Remarks": ScreenObj.Remarks,
                        "StatusId": 3,
                        "Status": "",
                        "DeleteInd": "N"
                    }
                    eHnoteUserAppointmentDataService.AddUpdatePluginAppointmentRequest(params).then(function (resp) {

                    }, function (err) {
                        console.log(err);
                    });
                }

                if ($scope.IsAutoEligibiltyCheckEnabled) {
                    $scope.ConsultationEntry.IsCheckInsuranceEligibility = true;
                }

                if ($scope.ConsultationEntry.IsCheckInsuranceEligibility) {


                    var AppointmentInsuranceDetailId = data.response.AppointmentInsuranceDetailId;
                    console.log(AppointmentInsuranceDetailId);

                    var sobj = {
                        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "HospitalId": data.response.HospitalID,
                        "DoctorId": data.response.DoctorID,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "PatientId": 0,
                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId
                    }


                    eHnoteInsuranceService.GetAppointmentInsuranceListDetails(sobj).then(function (resp) {

                        console.log(resp);


                        if (resp.data.status === "Success") {


                            var sitem = resp.data.rows[0];


                            eHnoteInsuranceService.checkPatientInsuranceEligibilityById(sitem, onSuccess, onError);
                            function onSuccess(resp) {
                                console.log(resp);

                                resp.errors = resp.errors || [];
                                if (resp.errors.length > 0) {
                                    var eparams = {
                                        "UserId": doctorinfo.doctorid,
                                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId,
                                        "InsuranceEligibilityErrorStatusId": 0,
                                        "ErrorDetails": [],
                                        "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
                                    }
                                    angular.forEach(resp.errors, function (eitem) {
                                        var eobj = {
                                            "Field": eitem.field,
                                            "Description": eitem.description
                                        }
                                        eparams.ErrorDetails.push(eobj);
                                    });



                                    eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
                                        if (response.data.status === 'Success') {

                                        }

                                    });
                                }
                                else {

                                    var PlanStatusCode = "", PlanStatus = "", ResponseJson = "";

                                    if (resp.planStatus.length > 0) {
                                        PlanStatusCode = resp.planStatus[0].statusCode;
                                        PlanStatus = resp.planStatus[0].status;
                                        ResponseJson = JSON.stringify(resp);
                                    }


                                    var obj = {
                                        "UserId": doctorinfo.doctorid,
                                        "PatientId": patient_id,
                                        "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "AppointmentInsuranceDetailId": data.response.AppointmentInsuranceDetailId,
                                        "PlanStatusCode": PlanStatusCode,
                                        "PlanStatus": PlanStatus,
                                        "PatientCoPayAmount": 0,
                                        "PatientCoPayPercentage": 0,
                                        //  "benifitInformation": [],
                                        "BenifitCoveragesList": [],
                                        "BenifitCoverageDetailsList": []
                                    }
                                    resp.benefitsInformation = resp.benefitsInformation || [];
                                    resp.planStatus = resp.planStatus || [];


                                    if (resp.planStatus.length > 0) {
                                        angular.forEach(resp.planStatus, function (psitem) {
                                            angular.forEach(psitem.serviceTypeCodes, function (subitem) {
                                                var sobj = {
                                                    "PatientEligibilityBenifitId": 0,
                                                    "ServiceTypeCode": subitem || 0,
                                                    "Status": psitem.status,
                                                    "IsCopayIdentified": false,
                                                    "DeleteInd": false,
                                                }

                                                obj.BenifitCoveragesList.push(sobj);
                                            });

                                        });
                                    }

                                    if (resp.benefitsInformation.length > 0) {
                                        angular.forEach(resp.benefitsInformation, function (bitem) {
                                            angular.forEach(bitem.serviceTypeCodes, function (subitem) {
                                                bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                                                var BenifitDateInformation = '';
                                                if (bitem.benefitsDateInformation != '') {
                                                    bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                                                    bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                                                    BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                                                }

                                                var sobj = {
                                                    "PatientEligibilityBenifitDetailId": 0,
                                                    "ServiceTypeCode": subitem || 0,
                                                    "BenifitTypeName": bitem.name,
                                                    "BenifitAmount": bitem.benefitAmount || 0,
                                                    "BenifitPercentage": bitem.benefitPercent || 0,
                                                    "BenifitDateInformation": BenifitDateInformation || "",
                                                    "TimeQualifier": bitem.timeQualifier || '',
                                                    "CoverageLevel": bitem.coverageLevel || '',
                                                    "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                                                    "DeleteInd": false,
                                                }

                                                obj.BenifitCoverageDetailsList.push(sobj);
                                            });

                                        });
                                    }



                                    eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                                        console.log(response);
                                        if (response.data.status === 'Success') {

                                        }

                                    });
                                }

                            }
                            function onError(reponse) {
                            }

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });

                }

                if (data.response.DoctorID !== 0) {
                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    appoint_info.DoctorID = data.response.DoctorID;
                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                }




                if ($scope.IsTreatmentFollowupAppointment) {
                    alertify.success('Appointment Created Successfully');
                    $scope.$emit('treatmentFollowupSuccess', data.response);
                }
                else if ($scope.pagename === "surgery") {
                    alertify.success('Surgery Appointment Created Successfully');
                    $scope.$emit('surgeryAppointmentsuccess', data);
                }
                else if ($scope.pagename === "surgeryFileUpload") {
                    alertify.success('Surgery Appointment Created Successfully');
                    $scope.$emit('surgeryFileUploadAppointmentsuccess', data);
                }
                else {
                    if ($scope.patientAppointmentID && !$filter("isObject")($scope.SelectedDummyAppointment)) {
                        alertify.success('Appointment has been Re-Scheduled Successfully');
                        $scope.$emit("bookapptreshedulesuccessMethod", data);
                    } else {
                        alertify.success('Appointment Created Successfully');

                        if ($scope.Subtype == 'multipleAppt') {
                            $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();
                            if ($scope.SelectedBranchDocId != 0) {
                                var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === $scope.SelectedBranchDocId);
                            }
                            if (Index > -1) {
                                $scope.AppointmentDetailsInfo.selectedDocObject.selectedPerson = $scope.clinicDoctorList[Index];
                            }
                            if ($scope.MultipleAppointmentList.length > 0) {
                                angular.forEach($scope.MultipleAppointmentList, function (item) {
                                    item.IsEdit = false;
                                });
                            }
                            $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);
                            $scope.appointment_type.AppointmentTypeId = '';
                            $scope.patinet_appStarttime = '';
                            $scope.slot.patinet_appStarttime = '';
                            $scope.patient_appEndTime = '';
                            $scope.slot.patient_appEndTime = '';
                            $scope.AppointmentRescheduleObj.StartTime = "";

                        } else {
                            $scope.$emit('BookApptsuccessMethod', data);
                        }

                    }
                }










            } else {
                alertify.error("Appointment creation failed");
                $scope.$emit("BookApptsuccessMethod", data);
            }
            $scope.IsSubmitDisabled = false;

            if (data.response.TokenNumber === "0") {
                $scope.Token = "";
            } else {
                $scope.Token = data.response.TokenNumber;
            }
            $scope.TIME = $scope.slot.patinet_appStarttime.StartTime;
            $scope.date = $filter("date")(new Date(), "dd-MM-yyyy");

        }
        function OnCaseSaveError(err) {
            alertify.error("Error in Creating Appointment");
            $scope.IsSubmitDisabled = false;
        }

    }

    function chkLapsedTime(chkTime) {
        minPerCase = eHnoteMasterDataService.getavgConsultationTimeInfo();
        var check_todaydate = chkTime.substring(0, 10);
        var momentObj = moment(new Date());
        var momment_currentdate = momentObj.format("YYYY-MM-DD");
        var timeNow_Splits = momentObj.format("HH:mm").split(":");
        var timenow_Hour = parseInt(timeNow_Splits[0]);
        var timenow_Minute = parseInt(timeNow_Splits[1]);
        var selectedmomentObj = moment(chkTime);
        var selected_Splits = selectedmomentObj.format("HH:mm").split(":");
        var selected_Hour = parseInt(selected_Splits[0]);
        var selected_Minute = parseInt(selected_Splits[1]);
        var blnLapsed = false;
        if (check_todaydate === momment_currentdate) {
            if (selected_Hour < timenow_Hour) {
                blnLapsed = true;
            } else if (selected_Hour === timenow_Hour) {
                if (selected_Minute < timenow_Minute || (minPerCase + selected_Minute - 1) < timenow_Minute) {
                    blnLapsed = true;
                }
            }
        } else if (check_todaydate < momment_currentdate) {
            blnLapsed = true;
        }
        return blnLapsed;
    }

    $scope.openErrorPopup = function (errorsArray) {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PatientInsuranceVerifyError.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            "resolve": {
                "ErrorArray": function () { return errorsArray; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, ErrorArray) {
                $scope.closeadvisedItems = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.ErrorsList = ErrorArray || [];

                $scope.discardProcedures = function () {
                    $scope.selectedProcedures = [];
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
    }

    $scope.ClosePopup = function () {
        $scope.sendDocSms = false;
        $scope.sendDocEmail = false;
        $scope.sendPatientSms = false;
        $scope.sendPatientEmail = false;
        $rootScope.appointmentRootId = 0;
        $rootScope.appointmentParentId = 0;
        $rootScope.appointment_type = "";
        $rootScope.AppointmentPatient_type = "";
        if ($scope.IsappointmentModeEdit && !cacheStorageItem.IsTreatmentFollowupAppointment) {
            $scope.$emit("bookapptreshedulesuccessMethod");
        } else {
            $scope.$emit("BookapptclosePopup");
        }
    };

    $scope.RegisterClosePopup = function () {
        $scope.sendDocSms = false;
        $scope.sendDocEmail = false;
        $scope.sendPatientSms = false;
        $scope.sendPatientEmail = false;
        $rootScope.appointmentRootId = 0;
        $rootScope.appointmentParentId = 0;
        $rootScope.appointment_type = "";
        $rootScope.AppointmentPatient_type = "";
        $scope.$emit("registerclosePopup");
    };
    $scope.ChangeGender = function (type) {
        $scope.selectedPatientObj.PatientGender = type;
    };
    $scope.getDate = function (Tmpfromdate) {
        if (Tmpfromdate !== "") {
            $scope.selectedPatientObj.BSMSind = true;
        }
        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0) {
            fromdate.setMonth(m[1] + 1, 0);
            ddiff = fromdate.getDate() - d[1] + d[0];
            --mdiff;
        }
        if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
        if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
        if (age.length > 1) age.splice(age.length - 1, 0, ' and ');

        //$scope.selectedPatientObj.AgeInYears = ydiff.toString();
        //$scope.selectedPatientObj.AgeInMonths = mdiff.toString();
        //if ($scope.selectedPatientObj.AgeInMonths === "-1") {
        //    $scope.selectedPatientObj.AgeInMonths = "";
        //}
        //$scope.selectedPatientObj.AgeInDays = ddiff.toString();
        //var curAge = $scope.selectedPatientObj.AgeInYears + '.' + $scope.selectedPatientObj.AgeInMonths;
        //$scope.selectedPatientObj.PatientAge = curAge;

        $scope.PatientDetailsForRegisterObj.ageinYears = ydiff.toString();
        $scope.PatientDetailsForRegisterObj.ageinMonths = mdiff.toString();
        if ($scope.PatientDetailsForRegisterObj.ageinMonths === "-1") {
            $scope.PatientDetailsForRegisterObj.ageinMonths = "";
        }
        $scope.PatientDetailsForRegisterObj.ageinDays = ddiff.toString();
        var curAge = $scope.PatientDetailsForRegisterObj.ageinYears + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
        $scope.PatientDetailsForRegisterObj.Age = curAge;
    };
    /*  $scope.setAgeandMonth = function (ageinYears, ageinMonths, ageinDays) {
          var curAge = $scope.selectedPatientObj.AgeInYears + '.' + $scope.selectedPatientObj.AgeInMonths;
          $scope.selectedPatientObj.PatientAge = curAge;
          // $scope.patientinfo.dob = $scope.getDateOfBirth($scope.ageinYears, $scope.ageinMonths);
          var dob = $scope.getDateOfBirth($scope.selectedPatientObj.AgeInYears, $scope.selectedPatientObj.AgeInMonths, $scope.selectedPatientObj.AgeInDays);
          $scope.selectedPatientObj.DOB = moment(dob).format("DD-MMM-YYYY");
          daysInMonth(ageinMonths, ageinYears);
      };*/
    $scope.setAgeandMonth = function (ageinYears, ageinMonths, ageinDays) {
        var curAge = $scope.PatientDetailsForRegisterObj.ageinYears + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
        $scope.PatientDetailsForRegisterObj.PatientAge = curAge;
        var dob = $scope.getDateOfBirth($scope.PatientDetailsForRegisterObj.ageinYears, $scope.PatientDetailsForRegisterObj.ageinMonths, $scope.PatientDetailsForRegisterObj.ageinDays);
        $scope.PatientDetailsForRegisterObj.DOB = moment(dob).format("MM-DD-YYYY");
        daysInMonth(ageinMonths, ageinYears);
    };

    $scope.getDateOfBirth = function (year, month, day) {
        year = parseInt(year) || 0;
        month = parseInt(month) || 0;
        day = parseInt(day) || 0;
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dateNow = today.getDate();
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }

        if (dateNow >= day)
            var dateAge = dateNow - day;
        else {
            dobmonth--;
            dateAge = 30 + dateNow - day;

            if (dobmonth < 0) {
                dobmonth = 11;
                dobyear--;
            }
        }
        dobmonth = dobmonth < 10 ? "0" + dobmonth : dobmonth;
        dateAge = dateAge < 10 ? "0" + dateAge : dateAge;
        if (dateAge === "00") {
            dateAge = dateNow.toString();

        }

        return dobmonth + "/" + dateAge + "/" + dobyear;
    };

    $scope.AddpatientfromAppointment = function (item, type) {
        //$scope.isPatientExist = false; // added by sabarish to enable the followup appointment tab click

        $scope.selectedPatientObj = {
            "PatientName": "",
            "PatientDisplayId": "",
            "OldPatientDisplayId": "",
            "NewpatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
            "FollwuppatSearchType": "1",   // '1' for Mr.No /mobile ,'2' for Name search"
            "PatientId": 0,
            "PatientDOB": "",
            "PatientAge": "",
            "PatientAgeInYears": "",
            "PatientAgeInMonths": "",
            "PatientAgeInDays": "",
            "PatientRefferal": "",
            "PatientMobile": "",
            "CountryCode": "91",
            "PatientGender": 'Male',
            "IsNewPatient": "Old",
            "AgeInYears": "",
            "AgeInMonths": "",
            "DOB": "",
            "ReferralSourceId": 0,
            "ReferralSource": "",
            "ReferralSourceName": "",
            "DisplayID": "",
            "referralSource": "",
            "PatientEmail": "",
            "PatientTitle": "Mr",
            "PatientType": 1,
            "PatientTypeName": "General",
            "FirstName": "",
            "LastName": "",
            "MasterReferralSourceId": "",
            "MasterReferralSourceName": "",
            "BSMSind": false,
            "ContactNo": "",
            "emgymobilenumber": "",
            "emgyname": "",
            "emgyrelationship": "",
            "AttenderName": "",
            "ReferralMobileNo": "",
            "ReferralContactNo": "",
            "ReferralPhoneType": 'Mobile',
            'AlternateType': 'Mobile',
            "DOBSearch": "",
        };




        if (type === "FollowUp") {
            $scope.bookApptType = "New";
        }

        if (isNaN(item)) {
            $scope.selectedPatientObj.PatientName = item;
        } else {
            $scope.selectedPatientObj.PatientMobile = item;
        }
        $scope.selectedPatientObj.IsNewPatient = "New";
        if ($scope.selectedPatientObj.IsNewPatient === 'New') {
            $scope.appointment_type.AppointmentTypeId = "1";
        }
        $scope.patientAppointmentID = 0;
    };

    $scope.loadSpecializationAppointments = function (item) {
        $scope.selectedSpecialization = item;
        $scope.TempDoctorArray = [];
        if (item.Id != 0) {

            if ($scope.selectedHospitalobj.length > 0) {
                angular.forEach($scope.selectedHospitalobj[0].Doctors, function (mitem) {
                    if (mitem.SpecializationId === item.Id) {
                        $scope.TempDoctorArray.push(mitem);
                    }
                });
                $scope.clinicDoctorList = $scope.TempDoctorArray;
                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (Nitem) {
                    return Nitem.RoleId === 1 || Nitem.RoleId === 3 || Nitem.RoleId === 43 || Nitem.RoleId === 16 || Nitem.RoleId === 56 || Nitem.RoleId === 57;
                });
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "UserBranchId": 0, "MinPerCase": 15 };
                $scope.clinicDoctorList.unshift(docAll);
            }
        }
        else {
            if ($scope.selectedHospitalobj.length > 0) {
                $scope.clinicDoctorList = $filter("filter")($scope.selectedHospitalobj[0].Doctors, function (kitem) {
                    return kitem.RoleId === 1 || kitem.RoleId === 3 || kitem.RoleId === 43 || kitem.RoleId === 16 || kitem.RoleId === 56 || kitem.RoleId === 57;
                });
            }
        }
    }



    function getdateslist(d) {
        if (d === 31) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        }
        else if (d === 30) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
        }
        else if (d === 28) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
        }
        else if (d === 29) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin29daysArray();
        }
        else {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        }


    };
    function daysInMonth(month, year) {
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }
        var d = new Date(dobyear, dobmonth, 0).getDate();
        getdateslist(d);
        return d;

    }

    $scope.ChangeAppointmentRoles = function (Roleid) {
        $scope.SelectedUserRoles.Value = Roleid;

        $scope.SelectedBranchDocId = 0;
        $scope.selectedDocObject.selectedPerson = "";

        if ($scope.SelectedUserRoles.Value === "10") {
            if ($scope.allUserList.length > 0) {
                $scope.AllOpthaList = [];
                $scope.AllOpthaList = _.uniq($scope.allUserList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.allUserList, function (item) {
                    return item.RoleId === 10;
                });

                if (doctorinfo.doctordata.User.length != 0) {
                    if (doctorinfo.doctordata.User[0].DoctorID != undefined) {
                        var clinicdoctorfilter = $filter("filter")($scope.AllOpthaList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID }, true);
                        if (clinicdoctorfilter.length != 0) {
                            $scope.SelectedBranchDocId = clinicdoctorfilter[0].DoctorID;
                            $scope.selectedDocObject.selectedPerson = clinicdoctorfilter[0];
                        }
                    }
                }
            }
        } else if ($scope.SelectedUserRoles.Value === '4') {
            if (doctorinfo.doctordata.User.length != 0) {
                if (doctorinfo.doctordata.User[0].DoctorID != undefined) {
                    var clinicdoctorfilter = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorinfo.doctordata.User[0].DoctorID }, true);
                    if (clinicdoctorfilter.length != 0) {
                        $scope.SelectedBranchDocId = clinicdoctorfilter[0].DoctorID;
                        $scope.selectedDocObject.selectedPerson = clinicdoctorfilter[0];
                    }
                }
            }
        }

        $scope.changeAppointmentDoctor($scope.SelectedBranchDocId);

    };

    $scope.changeEndTime1 = function (endtime) {

        if (endtime == null) {
            // $scope.patient_appEndTime = $scope.patinet_appStarttime.EndTime || "";
            $scope.slot.patient_appEndTime = $scope.setEndValues[0].EndTime.toString();
            console.log($scope.setEndValues[0]);
            return false;
        }

        $scope.slot.patient_appEndTime = endtime || "";
    }


    $scope.AllCountryCodeList = [];
    $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
    function getcountriesSuccess(data) {
        $scope.Allcountries = data;

        $scope.AllCountryCodeList = [];
        angular.forEach($scope.Allcountries, function (citem) {
            citem.InternationalDialing = citem.InternationalDialing || "";
            if (citem.InternationalDialing != '') {
                $scope.AllCountryCodeList.push(citem);
            }
        });
        $scope.AllCountryCodeList = _.uniq($scope.AllCountryCodeList, false, function (p) { return p.InternationalDialing; });
    }
    function getcountriesFailed(data) {
    }

    $scope.addNewPatientRegister = function (patientnumber) {
        $scope.GetVisitReasonNew();
        $scope.IsNumberaddPatient = false;
        $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();

        if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
            if (!isNaN($scope.selectedPatientObj.PatientName)) {
                var MobileNumber = patientnumber.toString() || "";
                if (MobileNumber != '') {
                    var number = MobileNumber;
                    var Area = number.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.HomeAreaCode = Area;
                    var contact = number.substring(3, (MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.HomeNumber = contact;

                    var phoneNumberString = $scope.PatientDetailsForRegisterObj.HomeAreaCode + $scope.PatientDetailsForRegisterObj.HomeNumber;
                    $scope.formatUSNumber(phoneNumberString);
                }
            } else {
                $scope.PatientDetailsForRegisterObj.FirstName = $scope.selectedPatientObj.PatientName;
            }
        }
        $scope.selectedPatientObj.IsNewPatient = 'New';
        $scope.selectedPatientObj.PatientName = "";
        $scope.IsNoPatienthere = true;
        $scope.ShowAddNewInsurance = true;
        $scope.patientInsuranceTpasArray = [];
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
        $scope.paymentTypeObj.PaymentTypeId = "2";
        $scope.paymentTypeObj.IsPaymentTypeInd = false;


        if ($scope.AppListdoctoraddress.length > 0) {
            if (selectedHospitalinAppList !== "" && selectedHospitalinAppList !== undefined) {
                if (selectedHospitalinAppList.ClinicId !== undefined) {
                    var filterHospitallist = $filter('filter')($scope.AppListdoctoraddress, { 'ClinicId': selectedHospitalinAppList.ClinicId }, true);
                    $scope.selectedBranchobj = filterHospitallist[0];
                    $scope.SelectedBranchId = selectedHospitalinAppList.ClinicId.toString();

                    $scope.selectBookingType.selectedBookAppo = "3";
                    $scope.selectBookingType.IsWalkInSlot = false;
                    if ($scope.IsComingFrom == 'Doctorcalendar') {
                        $scope.selectBookingType.selectedBookAppo = $scope.Doctorcalendarobj.AppointmentTypeId.toString();
                        if ($scope.selectBookingType.selectedBookAppo === "1") {
                            $scope.IsCheckIn = 2;
                            $scope.BookingType = 1;
                            $scope.selectBookingType.IsWalkInSlot = true;
                        }
                        else if ($scope.selectBookingType.selectedBookAppo === "3") {
                            $scope.IsCheckIn = 1;
                            $scope.BookingType = 3;
                            $scope.selectBookingType.IsWalkInSlot = false;
                        }
                    }
                    $scope.selectedBranchobj.ClinicName = $scope.selectedBranchobj.ClinicName || "";
                    $scope.chnageApptBranch($scope.selectedBranchobj);
                }

            }
        }

        $scope.PatientInsuranceObj.IdentifierId = 1;
        $scope.PatientInsuranceObj.setprimary = true;





        //console.log($scope.AllVisitReasons);
        //console.log($scope.appointment_type.AppointmentTypeId + "__$scope.appointment_type.AppointmentTypeId");
        //$scope.GetVisitReasonArray = [];
        //$scope.GetVisitReasonArray = $filter("filter")($scope.AllVisitReasons, { "AppointmentTypeId": $scope.appointment_type.AppointmentTypeId }, true) || [];


    };
    $scope.GetSelectedPatientDetails = function (patientitem, edit) {
        if (edit === "Edit") {
            $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
            $scope.PatientDetailsForRegisterObj.PatientID = patientitem.PatientID;
            $scope.PatientDetailsForRegisterObj.PatientId = patientitem.PatientID;
            $scope.PatientDetailsForRegisterObj.PatientTagId = patientitem.PatientTypeId || 0;
            $scope.PatientDetailsForRegisterObj.Title = patientitem.Title;
            $scope.PatientDetailsForRegisterObj.TitleId = patientitem.TitleId;
            $scope.PatientDetailsForRegisterObj.FirstName = patientitem.FirstName;
            $scope.PatientDetailsForRegisterObj.MiddleName = patientitem.MiddleName;
            $scope.PatientDetailsForRegisterObj.LastName = patientitem.LastName;
            $scope.PatientDetailsForRegisterObj.SecondLastName = patientitem.SecondLastName;
            $scope.PatientDetailsForRegisterObj.DOB = $filter("date")(patientitem.DOB, "MM-dd-yyyy");
            $scope.PatientDetailsForRegisterObj.ageinYears = patientitem.AgeInYears;
            $scope.PatientDetailsForRegisterObj.ageinMonths = patientitem.AgeInMonths.toString() || "";
            $scope.PatientDetailsForRegisterObj.ageinDays = patientitem.AgeInDays.toString() || "";
            $scope.PatientDetailsForRegisterObj.Age = $scope.PatientDetailsForRegisterObj.ageinYears + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
            $scope.PatientDetailsForRegisterObj.Gender = patientitem.Gender;
            $scope.PatientDetailsForRegisterObj.SocialSecurityNo = patientitem.SocialSecurityNo || "";
            $scope.PatientDetailsForRegisterObj.MaritalStatusID = patientitem.PatientOtherDetails[0].MaritalStatusId || "";
            $scope.PatientDetailsForRegisterObj.BloodGroupId = patientitem.PatientOtherDetails[0].BloodGroupId || 0;
            $scope.PatientDetailsForRegisterObj.EmailID = patientitem.EmailId || "";
            $scope.PatientDetailsForRegisterObj.PatientDisplayID = patientitem.ClinicPreference.PatientDisPlayID;
            $scope.PatientDetailsForRegisterObj.HomeCountryCode = patientitem.PatientHomeCode || "";
            $scope.PatientDetailsForRegisterObj.HomeAreaCode = patientitem.Altareacode || "";
            $scope.PatientDetailsForRegisterObj.HomeNumber = patientitem.PatientHomeNumber || "";
            $scope.PatientDetailsForRegisterObj.OfficeCountryCode = patientitem.OfficeCountryCode || "";
            $scope.PatientDetailsForRegisterObj.OfficeAreaCode = patientitem.PatientOfficeCode || "";
            $scope.PatientDetailsForRegisterObj.OfficeNumber = patientitem.PatientOfficeNumber || "";
            $scope.PatientDetailsForRegisterObj.Fullname = patientitem.FullName || "";
            $scope.PatientDetailsForRegisterObj.S3URL = patientitem.S3URL || "";
            $scope.PatientDetailsForRegisterObj.PatientTagId = patientitem.PatientTagId || "";
            $scope.PatientDetailsForRegisterObj.PatientTagName = patientitem.PatientTagName || "";

            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = patientitem.IsPatientSmsInd || false;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = patientitem.IsPatientEmailInd || false;
            $scope.PatientDetailsForRegisterObj.AuthorizationId = "";
            $scope.sendPatientSms = patientitem.IsPatientSmsInd || false;
            $scope.sendPatientEmail = patientitem.IsPatientEmailInd || false;

            if ($scope.PatientDetailsForRegisterObj.IsPatientSmsInd && !$scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 1;
            }
            else if (!$scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 2;
            }
            else if ($scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 3;
            }
            else if (!$scope.PatientDetailsForRegisterObj.IsPatientSmsInd && !$scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 4;
            }

            var phoneNumberString = $scope.PatientDetailsForRegisterObj.HomeAreaCode + $scope.PatientDetailsForRegisterObj.HomeNumber;
            $scope.formatUSNumber(phoneNumberString);

            if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != "" && $scope.PatientDetailsForRegisterObj.OfficeNumber != "") {
                var officeNumberString = $scope.PatientDetailsForRegisterObj.OfficeAreaCode + $scope.PatientDetailsForRegisterObj.OfficeNumber;
                $scope.changeOfficeNumber(officeNumberString);
            }

            $scope.GetVisitReasonNew();
        } else {
            $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
            $scope.PatientDetailsForRegisterObj.PatientID = patientitem.PatientId;
            $scope.PatientDetailsForRegisterObj.PatientId = patientitem.PatientId;
            $scope.PatientDetailsForRegisterObj.PatientTagId = patientitem.PatientTypeId || 0;
            $scope.PatientDetailsForRegisterObj.Title = patientitem.Title;
            $scope.PatientDetailsForRegisterObj.TitleId = patientitem.TitleId;
            $scope.PatientDetailsForRegisterObj.FirstName = patientitem.FirstName;
            $scope.PatientDetailsForRegisterObj.MiddleName = patientitem.MiddleName || '';
            $scope.PatientDetailsForRegisterObj.LastName = patientitem.LastName;
            $scope.PatientDetailsForRegisterObj.SecondLastName = patientitem.SecondLastName;
            $scope.PatientDetailsForRegisterObj.DOB = $filter("date")(patientitem.DOB, "MM-dd-yyyy");
            $scope.PatientDetailsForRegisterObj.ageinYears = patientitem.AgeInYears;
            $scope.PatientDetailsForRegisterObj.ageinMonths = patientitem.AgeInMonths.toString() || "";
            $scope.PatientDetailsForRegisterObj.ageinDays = patientitem.AgeInDays.toString() || "";
            $scope.PatientDetailsForRegisterObj.Age = $scope.PatientDetailsForRegisterObj.ageinYears + '.' + $scope.PatientDetailsForRegisterObj.ageinMonths;
            $scope.PatientDetailsForRegisterObj.Gender = patientitem.Gender;
            $scope.PatientDetailsForRegisterObj.SocialSecurityNo = patientitem.SocialSecurityNo || "";
            $scope.PatientDetailsForRegisterObj.MaritalStatusID = patientitem.MaritalStatusId || "";
            $scope.PatientDetailsForRegisterObj.BloodGroupId = patientitem.BloodGroupId || 0;
            $scope.PatientDetailsForRegisterObj.EmailID = patientitem.EmailID || "";
            $scope.PatientDetailsForRegisterObj.PatientDisplayID = patientitem.DisplayID;
            $scope.PatientDetailsForRegisterObj.HomeCountryCode = patientitem.HomeCountryCode || "";
            $scope.PatientDetailsForRegisterObj.HomeAreaCode = patientitem.HomeAreaCode || "";
            $scope.PatientDetailsForRegisterObj.HomeNumber = patientitem.HomeNumber || "";
            $scope.PatientDetailsForRegisterObj.OfficeCountryCode = patientitem.OfficeCountryCode || "";
            $scope.PatientDetailsForRegisterObj.OfficeAreaCode = patientitem.OfficeAreaCode || "";
            $scope.PatientDetailsForRegisterObj.OfficeNumber = patientitem.OfficeNumber || "";
            $scope.PatientDetailsForRegisterObj.Fullname = patientitem.Fullname || "";
            $scope.PatientDetailsForRegisterObj.S3URL = patientitem.S3URL || "";
            $scope.PatientDetailsForRegisterObj.PatientTagId = patientitem.PatientTagId || "";
            $scope.PatientDetailsForRegisterObj.PatientTagName = patientitem.PatientTagName || "";

            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = patientitem.IsPatientSmsInd || false;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = patientitem.IsPatientEmailInd || false;
            $scope.PatientDetailsForRegisterObj.AuthorizationId = "";
            $scope.sendPatientSms = patientitem.IsPatientSmsInd || false;
            $scope.sendPatientEmail = patientitem.IsPatientEmailInd || false;

            if ($scope.PatientDetailsForRegisterObj.IsPatientSmsInd && !$scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 1;
            }
            else if (!$scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 2;
            }
            else if ($scope.PatientDetailsForRegisterObj.IsPatientSmsInd && $scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 3;
            }
            else if (!$scope.PatientDetailsForRegisterObj.IsPatientSmsInd && !$scope.PatientDetailsForRegisterObj.IsPatientEmailInd) {
                $scope.PatientDetailsForRegisterObj.AuthorizationId = 4;
            }

            $scope.IsNumberaddPatient = false;

            var phoneNumberString = $scope.PatientDetailsForRegisterObj.HomeAreaCode + $scope.PatientDetailsForRegisterObj.HomeNumber;
            $scope.formatUSNumber(phoneNumberString);

            if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != "" && $scope.PatientDetailsForRegisterObj.OfficeNumber != "") {
                var officeNumberString = $scope.PatientDetailsForRegisterObj.OfficeAreaCode + $scope.PatientDetailsForRegisterObj.OfficeNumber;
                $scope.changeOfficeNumber(officeNumberString);
            }

            $scope.GetVisitReasonNew();
            $scope.othervisitrsn = "";
            $scope.visitrsnId = null;
        }


    };
    $scope.selectPatientdetails1 = function (patientitem) {
        cacheStorageItem.PatientDetails = {};
        //$scope.patientAppointmentID = 0;
        //$scope.patientBillingId = 0;
        $scope.isregisterBtn = false;
        $scope.selectedPatInfo = patientitem;
        $scope.selectedPatInfo.ReferralSourceId = $scope.selectedPatInfo.ReferralSourceId || "0";
        $scope.Source = $scope.selectedPatInfo.ReferralSourceId.toString();
        $scope.patients = [];
        $scope.isPatientSelected = true;
        $scope.AppointmentPatientTypeId = patientitem.AppointmentPatientTypeId; //Added by durga as on 04-03-2020
        $scope.visitedDays = $scope.getLastVistedDate(patientitem.LastVisited);
        if ($scope.SearchByPatients === "Y") {
            //$scope.selectedPatientObj = patientitem;
            $scope.selectedPatientObj.PatientId = patientitem.PatientId;
            $scope.selectedPatientObj.S3URL = patientitem.S3URL || "";
            $scope.selectedPatientObj.SSN = patientitem.SSN || "";
            $scope.selectedPatientObj.DisplayID = patientitem.DisplayID;
            //$scope.selectedPatientObj.PatientName = patientitem.FullName;
            $scope.selectedPatientObj.FullName = patientitem.FullName;
            $scope.selectedPatientObj.PatientMobile = patientitem.PhoneNumber || 0;
            $scope.selectedPatientObj.PatientGender = patientitem.Gender;
            $scope.selectedPatientObj.PatientAge = patientitem.Age;
            $scope.selectedPatientObj.CountryCode = patientitem.CountryCode;
            $scope.selectedPatientObj.AgeInYears = patientitem.AgeInYears;
            $scope.selectedPatientObj.AgeInDays = patientitem.AgeInDays;
            $scope.selectedPatientObj.AgeInMonths = patientitem.AgeInMonths;
            $scope.selectedPatientObj.AgeInDays = patientitem.AgeInDays;
            $scope.selectedPatientObj.DOB = patientitem.DOB;
            $scope.selectedPatientObj.ReferralSourceId = patientitem.ReferralSourceId;
            $scope.selectedPatientObj.PatientTitle = patientitem.Title;
            $scope.selectedPatientObj.CreatedDt = patientitem.CreatedDt;
            $scope.selectedPatientObj.LastPaid = patientitem.LastPaid || "";
            $scope.selectedPatientObj.FirstName = patientitem.FirstName;
            $scope.selectedPatientObj.MiddleName = patientitem.MiddleName || "";
            $scope.selectedPatientObj.LastName = patientitem.LastName;
            $scope.selectedPatientObj.SecondLastName = patientitem.SecondLastName;
            $scope.selectedPatientObj.ReferralSourceName = patientitem.ReferalSource || "";
            $scope.selectedPatientObj.ReferalSource = patientitem.ReferalSource || "";
            $scope.selectedPatientObj.MasterReferralSourceId = patientitem.MasterReferralSourceId || "";
            $scope.selectedPatientObj.MasterReferralSourceName = patientitem.MasterReferralSourceName || "";
            $scope.selectedPatientObj.HomeCountryCode = patientitem.HomeCountryCode;
            $scope.selectedPatientObj.HomeAreaCode = patientitem.HomeAreaCode;
            $scope.selectedPatientObj.HomeNumber = patientitem.HomeNumber;
            $scope.selectedPatientObj.IsNoChargePatient = patientitem.IsNoChargePatient || false;
            $scope.HospitalEquipmentId = patientitem.PatientTagId || "";


            var SSN = $scope.selectedPatientObj.SSN;
            var PhoneNumber = $scope.selectedPatientObj.PatientMobile;
            PhoneNumber = $scope.selectedPatientObj.PatientMobile.toString();
            if (PhoneNumber.length > 0) {
                var number = PhoneNumber;
                if (patientitem.HomeNumber != '') {
                    number = patientitem.HomeCountryCode + '-' + patientitem.HomeAreaCode + '-' + patientitem.HomeNumber;
                } else {
                    number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                }
                //number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                $scope.selectedPatientObj.TempPhNumber = number;
            } else {
                $scope.selectedPatientObj.TempPhNumber = "";
            }
            SSN = SSN || "";
            SSN = $scope.selectedPatientObj.SSN.toString();
            if (SSN.length > 0) {
                var SSNnumber = SSN;
                SSNnumber = SSNnumber.slice(0, 3) + '-' + SSNnumber.slice(3, 5) + '-' + SSNnumber.substring(5, 10);;
                $scope.selectedPatientObj.TempSSNnumber = SSNnumber;
            } else {
                $scope.selectedPatientObj.TempSSNnumber = "";
            }

            $scope.selectedPatientObj.PatientType = patientitem.PatientType || "";
            $scope.selectedPatientObj.CityName = patientitem.CityName || "";
            $scope.selectedPatientObj.Occupation = patientitem.Occupation || "";
            $scope.selectedPatientObj.Location = patientitem.Area || "";//Location
            $scope.selectedPatientObj.Title = patientitem.Title || "";
            $scope.selectedPatientObj.StateName = patientitem.StateName || "";

            $scope.selectedPatientObj.IsVIPInd = patientitem.IsVIPInd || false;
            $scope.selectedPatientObj.IsResearchInd = patientitem.IsResearchInd || false;
            $scope.selectedPatientObj.IsHighRiskInd = patientitem.IsHighRiskInd || false;

            $scope.selectedPatientTitle = patientitem.Title;
            $scope.selectedPatientAge = "";
            if (patientitem.CurrentAge !== undefined) {
                $scope.selectedPatientAge = patientitem.CurrentAge.year + "y " + (patientitem.CurrentAge.month !== "0" ? (patientitem.CurrentAge.month + "m") : "");
            }
            $scope.selectedPatientGender = patientitem.Gender;
            $scope.selectedPatientNumber = patientitem.PhoneNumber !== 0 ? patientitem.PhoneNumber : "";
            $scope.selectedPatientImage = "";
            $scope.selectedPatInfo.PatientID = patientitem.PatientId;
            $scope.SelectedCountryCode = patientitem.CountryCode;
            $scope.selectedPatientObj.OccupationNotes = patientitem.OccupationNotes || "";
            $scope.selectedPatientObj.AlternatePhoneNo = patientitem.AlternatePhoneNo;
            $scope.selectedPatientObj.AlternateLandLine = patientitem.AlternateLandLine;
            $scope.selectedPatientObj.AltCountrycode = patientitem.AltCountryCode;
            $scope.selectedPatientObj.AltareaCode = patientitem.Altareacode;

        }
        else {
            $scope.selectedPatInfo.PatientID = patientitem.Patient[0].PatientID;

            $scope.selectedPatientTitle = patientitem.Patient[0].Title;
            $scope.selectedPatientAge = patientitem.Patient[0].CurrentAge.year + "y " + (patientitem.Patient[0].CurrentAge.month !== "0" ? (patientitem.Patient[0].CurrentAge.month + "m") : "");
            $scope.selectedPatientGender = patientitem.Patient[0].Gender;
            $scope.selectedPatientNumber = (patientitem.PatientPhone[0] !== undefined && patientitem.PatientPhone[0].PhNumber !== 0) ? patientitem.PatientPhone[0].PhNumber : '';
            $scope.selectedPatientImage = "";
        }

    };


    $scope.GetOrganizationNewPayorAllList = function (val) {
        var param = {
            "SearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": 0,
            "PayorTypeId": 0
        }
        return eHnoteInsuranceService.GetOrganizationPayorsList(param).then(function (response) {
            if (response.data.rows !== undefined) {
                return response.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };
    $scope.GetOrganizationPayorPlansList = function (obj, mainitem) {
        mainitem.PayorId = mainitem.PayorId || 0;

        mainitem.payorPlansListArray = [];
        mainitem.PayorId = mainitem.PayorObj.PayorId || 0;
        var param = {
            "SearchText": obj || "",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "OrganizationPayorId": mainitem.OrganizationPayorId,
            "GetAllIndicator": 0,
            "Status": 1
        }
        return eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (response) {
            if (response.data.rows !== undefined) {
                return response.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };



    $scope.SearchPayorListByText = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0
        };
        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.ChangeInsurancePayor = function (obj, mainitem) {
        $scope.PatientInsuranceObj.payorPlansListArray = [];
        $scope.PatientInsuranceObj.PayorId = obj.PayorId;
        $scope.PatientInsuranceObj.PayorName = obj.PayorName;
        $scope.PatientInsuranceObj.PayorCode = obj.PayorCode;
        $scope.PatientInsuranceObj.OrganizationPayorId = obj.OrganizationPayorId;
        $scope.PatientInsuranceObj.PayorObj = mainitem.PayorCode;
        $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = obj.AppointmentInsuranceDetailId;


        //var param = {
        //    "SearchText": "",
        //    "PageSize": 10,
        //    "PageNumber": 1,
        //    "UserId": $scope.UserId,
        //    "SpecializationId": $scope.SpecializationId,
        //    "OrganizationId": $scope.HospitalId,
        //    "ParentOrganizationId": $scope.ParentHospitalID,
        //    "GetAllIndicator": 0,
        //    "PayorId": obj.PayorId
        //}
        //eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {
        //    mainitem.payorPlansListArray = [];
        //    if (resp.data.Status === "Success") {
        //        mainitem.payorPlansListArray = resp.data.rows || [];

        //        if (GetMode === "GetPlan") {
        //            if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != null) {
        //                $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanObj = $filter("filter")(mainitem.payorPlansListArray, { "PlanId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId })[0];
        //            }
        //        }
        //    }
        //}, function (error) {
        //    console.log(error);
        //});

    };

    $scope.ChangePayorPlan = function (mainitem) {
        if (mainitem.PlanObj == null || mainitem.PlanObj == "") {
            mainitem.PlanId = 0;
            return false;
        }
        mainitem.PayorId = mainitem.PlanObj.PayorId;
        mainitem.PayorName = mainitem.PlanObj.PayorName;
        mainitem.PlanId = mainitem.PlanObj.PlanId;
        mainitem.PlanCode = mainitem.PlanObj.PlanCode;
        mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
        mainitem.CoverageId = mainitem.PlanObj.PayorTypeId;
        //mainitem.PlanObj = mainitem.PlanCode;
        mainitem.PlanCode = mainitem.PlanCode;
        mainitem.OrganizationPayorId = mainitem.PlanObj.OrganizationPayorId;
        var obj = {
            "PayorId": mainitem.PlanObj.PayorId,
            "PayorName": mainitem.PlanObj.PayorName,
            "PayorCode": mainitem.PlanObj.PayorCode,
            "OrganizationPayorId": mainitem.PlanObj.OrganizationPayorId,
            "OrganizationPayorName": mainitem.PlanObj.OrganizationPayorName,
        }

        mainitem.PayorObj = obj;


    };
    $scope.chnagespayor = function (item, mainitem) {
        item = item || "";

        mainitem.PlanObj = '';
        mainitem.PlanTypeId = '';
        mainitem.PlanId = '';
        mainitem.PayorId = '';
    };

    $scope.ChangeInsuranceStatus = function (item) {

        if (item != "") {
            $scope.PatientInsuranceObj.PlanObj = "";
            $scope.PatientInsuranceObj.PolicyId = "";
            $scope.PatientInsuranceObj.GroupId = "";
            $scope.PatientInsuranceObj.PlanId = 0;
            $scope.PatientInsuranceObj.PayorId = 0;

        }
    }

    $scope.changeplan = function (item) {
        item = item || "";
        if (item == "") {
            $scope.PatientInsuranceObj.PolicyId = "";
            $scope.PatientInsuranceObj.GroupId = "";
        }
        $scope.PatientInsuranceObj.CoverageId = 0;
        $scope.PatientInsuranceOb.PayorId = 0;
        $scope.PatientInsuranceOb.PlanId = 0;
        $scope.PatientInsuranceOb.PlanTypeId = 0;
    }

    $scope.PatientInsuranceDetailsSave = function (patientid, fullname) {
        var TempInsuarance = $scope.PatientInsuranceObj;

        TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;
        if (TempInsuarance.CoverageId === null) {
            alertify.error("Please Select Insurance Type");
            return false;
        }
        TempInsuarance.PayorId = TempInsuarance.PayorId || null;
        if (TempInsuarance.PayorId === null) {
            alertify.error("Please Select Patient Payor");
            return false;
        }
        TempInsuarance.PlanId === TempInsuarance.PlanId || '';
        if (TempInsuarance.PlanId === '') {
            alertify.error("Please Select Patient Plan");
            return false;
        }
        //TempInsuarance.PolicyId = TempInsuarance.PolicyId || null;
        //if (TempInsuarance.PolicyId === null) {
        //    alertify.error("Please Enter Patient Policy ID");
        //    return false;
        //}


        if (TempInsuarance.ExpiryDate != "") {
            TempInsuarance.ExpiryDate = $filter('date')(TempInsuarance.ExpiryDate, 'yyyy-MM-dd');
        }
        if (TempInsuarance.EffectiveDate != "") {
            TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, 'yyyy-MM-dd');
        }
        if (TempInsuarance.ScanDate != "") {
            TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate, 'yyyy-MM-dd');
        }
        if (TempInsuarance.VerifiedDate != "") {
            TempInsuarance.VerifiedDate = $filter('date')(TempInsuarance.VerifiedDate, 'yyyy-MM-dd');
        }
        var param = {
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID,
            "FullName": $scope.PatientDetailsForRegisterObj.Fullname,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientInsuranceDetails": []
        }
        param.PatientInsuranceDetails.push(TempInsuarance);

        eHnotePatientDataService.SavePatientInsuranceDetailsById(param, OnAddPatientSuccess, OnAddPatientError);
        function OnAddPatientSuccess(resp) {
            if (resp.Status === "Success") {
                $scope.IsDefaultPatientRegister = false;
                $scope.preSelectPatient($scope.PatientDetailsForRegisterObj, "AfterRegister");
                $scope.patientInsuranceTpasArray = resp.PatientInsuranceDetails || [];
            }
        }
        function OnAddPatientError() {
            alertify.error("Creating  Failed");
        }
    };
    $scope.BackPatientRegister = function () {
        $scope.IsDefaultPatientRegister = true;
    };
    $scope.changeTitle = function (Titleid) {
        if (Titleid != null) {
            var filtertitle = $filter("filter")($scope.TitlesList, { "Id": Titleid }, true) || [];
            if (filtertitle.length > 0) {
                $scope.PatientDetailsForRegisterObj.Title = filtertitle[0].Name;
                $scope.PatientDetailsForRegisterObj.TitleId = filtertitle[0].Id;
            }

            if ($scope.PatientDetailsForRegisterObj.Title === "Mr" || $scope.PatientDetailsForRegisterObj.Title === "Master" || $scope.PatientDetailsForRegisterObj.Title === "Baby Of" || $scope.PatientDetailsForRegisterObj.Title === "Dr") {
                $scope.PatientDetailsForRegisterObj.Gender = 'Male';
            }
            else if ($scope.PatientDetailsForRegisterObj.Title === "Mrs" || $scope.PatientDetailsForRegisterObj.Title === "Miss" || $scope.PatientDetailsForRegisterObj.Title === 'Ms' || $scope.PatientDetailsForRegisterObj.Title === "Baby") {
                $scope.PatientDetailsForRegisterObj.Gender = 'Female';
            }
            else {
                $scope.PatientDetailsForRegisterObj.Gender = "";
            }
        } else {
            $scope.PatientDetailsForRegisterObj.Gender = 'Male';
        }
    };

    $scope.AddupdatePatientDetailsToContinue = function () {

        if ($scope.PatientDetailsForRegisterObj.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.FirstName.length < 3) {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName || "";
        if ($scope.PatientDetailsForRegisterObj.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.SecondLastName = $scope.PatientDetailsForRegisterObj.SecondLastName || "";
        if ($scope.PatientDetailsForRegisterObj.SecondLastName === "") {
            alertify.error("Please Enter Patient Second Last Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.EmailID === undefined) {
            alertify.error("Please Enter Valid Email ID");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.HomeAreaCode = $scope.PatientDetailsForRegisterObj.HomeAreaCode || '';
        if ($scope.PatientDetailsForRegisterObj.HomeAreaCode == '' || ($scope.PatientDetailsForRegisterObj.HomeAreaCode.toString()).length < 2) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var HomeAreaCode = angular.copy($scope.PatientDetailsForRegisterObj.HomeAreaCode) || "";
        if ((HomeAreaCode.toString()).length < 3) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var MobileNumber = angular.copy($scope.PatientDetailsForRegisterObj.HomeNumber) || "";
        if ((MobileNumber.toString()).length != 7) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }

        $scope.PatientDetailsForRegisterObj.OfficeAreaCode = $scope.PatientDetailsForRegisterObj.OfficeAreaCode || '';
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if (($scope.PatientDetailsForRegisterObj.OfficeAreaCode.toString()).length < 2) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var Contactnumber = angular.copy($scope.PatientDetailsForRegisterObj.OfficeNumber) || "";
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if ((Contactnumber.toString()).length != 7) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var SSNno = angular.copy($scope.PatientDetailsForRegisterObj.SocialSecurityNo) || "";
        SSNno = SSNno.toString();
        if (SSNno != "" && SSNno.length !== "" && SSNno.length < 4) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Valid SSN Number");
            return false;
        }

        var PatientandInsuranceDetails = {};
        var patientRegister = {
            "UserId": $scope.PatientDetailsForRegisterObj.UserId,
            "HospitalId": $scope.PatientDetailsForRegisterObj.HospitalId,
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "TitleId": $scope.PatientDetailsForRegisterObj.TitleId,
            "FirstName": $scope.PatientDetailsForRegisterObj.FirstName,
            "MiddleName": $scope.PatientDetailsForRegisterObj.MiddleName || '',
            "LastName": $scope.PatientDetailsForRegisterObj.LastName,
            "SecondLastName": $scope.PatientDetailsForRegisterObj.SecondLastName,
            "DOB": $filter("date")(new Date($scope.PatientDetailsForRegisterObj.DOB), "yyyy-MM-dd") || "",
            "Age": $scope.PatientDetailsForRegisterObj.ageinYears,
            "SSN": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "Gender": $scope.PatientDetailsForRegisterObj.Gender,
            "PatientTagId": $scope.HospitalEquipmentId || null,
            "MaritalStatusId": $scope.PatientDetailsForRegisterObj.MaritalStatusID || null,
            "BloodGroupId": $scope.PatientDetailsForRegisterObj.BloodGroupId || null,
            "LeadSourceInd": "N",
            "PatientS3Url": $scope.PatientDetailsForRegisterObj.S3URL || "",
            "EmailID": $scope.PatientDetailsForRegisterObj.EmailID,
            "FullName": $scope.PatientDetailsForRegisterObj.FirstName + $scope.PatientDetailsForRegisterObj.LastName || "",
            "DeviceEntityTypeId": 2,
            "HomeCountryCode": $scope.PatientDetailsForRegisterObj.HomeCountryCode || "",
            "HomeAreaCode": $scope.PatientDetailsForRegisterObj.HomeAreaCode || "",
            "HomeNumber": $scope.PatientDetailsForRegisterObj.HomeNumber || "",
            "FaxNumber": $scope.PatientDetailsForRegisterObj.FaxNumber || "",
            "Faxcountrycode": $scope.PatientDetailsForRegisterObj.Faxcountrycode || "",
            "FaxAreacode": $scope.PatientDetailsForRegisterObj.FaxAreacode || "",
            "FaxHomeNumber": $scope.PatientDetailsForRegisterObj.FaxHomeNumber || "",
            "OfficeCountryCode": $scope.PatientDetailsForRegisterObj.OfficeCountryCode || "",
            "OfficeAreaCode": $scope.PatientDetailsForRegisterObj.OfficeAreaCode || "",
            "OfficeNumber": $scope.PatientDetailsForRegisterObj.OfficeNumber || "",
            "IsPatientSmsInd": $scope.PatientDetailsForRegisterObj.IsPatientSmsInd,
            "IsPatientEmailInd": $scope.PatientDetailsForRegisterObj.IsPatientEmailInd,
            "IsAllowAiAutomatedCalls": $scope.PatientDetailsForRegisterObj.IsAllowAiAutomatedCalls || false,
            "IsNoMR": false,
            "OccupationId": cacheStorageItem.OccupationId || null,
            "OccupationDescription": $scope.PatientDetailsForRegisterObj.OccupationDescription || "",
            "EmployerPhoneNo": cacheStorageItem.EmployerPhoneNo,
            "EmergencyContactName": cacheStorageItem.EmergencyContactName,
            "EmeregecyContactNo": cacheStorageItem.EmeregecyContactNo
        };
        if (patientRegister.PatientId == 0) {
            patientRegister.IsNoMR = true;
        }
        PatientandInsuranceDetails.PatientDeatils = patientRegister;

        var insuranceObj = {
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "FullName": $scope.PatientDetailsForRegisterObj.Fullname || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientInsuranceDetails": []
        }

        $scope.PatientInsuranceObj.PayorId = $scope.PatientInsuranceObj.PayorId || 0;
        $scope.PatientInsuranceObj.CoverageId = $scope.PatientInsuranceObj.CoverageId || 0;
        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || 0;
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || "";
        $scope.IsCheckOldInsurance = false;
        if ($scope.PatientInsuranceObj.PayorId != 0 || $scope.PatientInsuranceObj.CoverageId != 0 || $scope.PatientInsuranceObj.PlanId != 0 || $scope.PatientInsuranceObj.PolicyId != "") {  // || (parseInt($scope.paymentTypeObj.PaymentTypeId) == 2 && $scope.patientInsuranceTpasArray.length == 0)

            $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientInsuranceObj.PatientFirstName || "";
            if ($scope.PatientInsuranceObj.PatientFirstName === "") {
                alertify.error("Please Patient First Name");
                return false;
            }
            $scope.PatientInsuranceObj.PatientLastName = $scope.PatientInsuranceObj.PatientLastName || "";
            if ($scope.PatientDetailsForRegisterObj.PatientLastName === "") {
                alertify.error("Please Patient Last Name");
                return false;
            }
            $scope.PatientInsuranceObj.PatientSecondLastName = $scope.PatientInsuranceObj.PatientSecondLastName || "";
            if ($scope.PatientDetailsForRegisterObj.PatientSecondLastName === "") {
                alertify.error("Please Patient Second Last Name");
                return false;
            }

            var TempInsuarance = $scope.PatientInsuranceObj;

            TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;

            TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            TempInsuarance.PlanId = TempInsuarance.PlanId || null;
            TempInsuarance.OrganizationPayorId = TempInsuarance.OrganizationPayorId || null;

            if (TempInsuarance.ExpiryDate != "") {
                TempInsuarance.ExpiryDate = $filter('date')(TempInsuarance.ExpiryDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.EffectiveDate != "") {
                TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.ScanDate != "") {
                TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.VerifiedDate != "") {
                TempInsuarance.VerifiedDate = $filter('date')(TempInsuarance.VerifiedDate, 'yyyy-MM-dd');
            }

            if (TempInsuarance.RelationShipId == 1 && TempInsuarance.PatientInsuranceDetailId == 0) {
                TempInsuarance.InsuredPersonFirstName = patientRegister.FirstName;
                TempInsuarance.InsuredPersonGenderID = patientRegister.Gender == "Male" ? 'M' : 'F';
                TempInsuarance.InsuredPersonDOB = patientRegister.DOB;
                TempInsuarance.InsuredPersonSSN = "";
                TempInsuarance.InsuredPersonMiddleName = patientRegister.MiddleName;
                TempInsuarance.InsuredPersonLastName = patientRegister.LastName;
            }
            if (TempInsuarance.PatientInsuranceDetailId == 0) {
                TempInsuarance.PatientFirstName = patientRegister.FirstName;
                TempInsuarance.PatientLastName = patientRegister.LastName;
                TempInsuarance.PatientDOB = patientRegister.DOB;
                TempInsuarance.PatientSSN = patientRegister.SSN;
            }

            insuranceObj.PatientInsuranceDetails.push(TempInsuarance);
            //  PatientandInsuranceDetails.PatientInsuranceList = angular.copy(insuranceObj);

            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;

            if ($scope.PatientInsuranceObj.PatientInsuranceDetailId != 0) {
                $scope.IsCheckOldInsurance = true;
            } else {
                $scope.IsCheckOldInsurance = false;
            }
        } else {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;
        }
        PatientandInsuranceDetails.PatientInsuranceList = angular.copy(insuranceObj);


        eHnoteUserAppointmentDataService.AddUpdatePatientRegisterandInsuarnceDeatils(PatientandInsuranceDetails).then(function (response) {
            if (response != undefined) {
                if (response.data != undefined) {
                    if (response.data.PatientDeatils.status == "success") {
                        var PatientDetails1 = response.data.PatientDeatils;
                        var insuranceDetails1 = response.data.InsuranceDetails || "";

                        if (PatientDetails1 != undefined && PatientDetails1 != null) {

                            $scope.selectedPatientObj.PatientId = PatientDetails1.PatientId;
                            $scope.selectedPatientObj.FullName = PatientDetails1.FullName;
                            $scope.selectedPatientObj.PatientName = PatientDetails1.FullName;
                            $scope.selectedPatientObj.FirstName = PatientDetails1.FirstName;
                            $scope.selectedPatientObj.LastName = PatientDetails1.LastName;
                            $scope.selectedPatientObj.PatientMobile = PatientDetails1.MobileNumber || 0;
                            $scope.selectedPatientObj.DOB = PatientDetails1.DOB;
                            $scope.selectedPatientObj.PatientGender = PatientDetails1.Gender;
                            $scope.selectedPatientObj.PatientEmail = PatientDetails1.EmailId;
                            $scope.selectedPatientObj.PatientTitle = PatientDetails1.TitleId;

                            $scope.selectedPatientObj.EmeregecyContactNo = PatientDetails1.EmeregecyContactNo;
                            $scope.selectedPatientObj.EmergencyContactName = PatientDetails1.EmergencyContactName;
                            $scope.selectedPatientObj.EmployerPhoneNo = PatientDetails1.EmployerPhoneNo;
                            $scope.selectedPatientObj.OccupationDescription = PatientDetails1.OccupationDescription;
                            $scope.selectedPatientObj.OccupationId = PatientDetails1.OccupationId;

                            if ($scope.selectedPatInfo == undefined) {
                                $scope.selectedPatInfo = {
                                    "EmailID": PatientDetails1.EmailId || ""
                                };
                            } else {
                                $scope.selectedPatInfo.EmailID = PatientDetails1.EmailId || "";
                            }

                        }
                        if (insuranceDetails1 != "" && insuranceDetails1 != undefined) {
                            if (insuranceDetails1.PatientInsuranceDetails.length > 0 && $scope.IsCheckOldInsurance == false) {

                                $scope.patientInsuranceTpasArray = angular.copy(insuranceDetails1.PatientInsuranceDetails);

                                $scope.PatientInsuranceObj.PatientInsuranceDetailId = insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceDetailId;

                                if ($scope.paymentTypeObj.PaymentTypeId == 2 || $scope.paymentTypeObj.PaymentTypeId == "2") {
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = insuranceDetails1.PatientInsuranceDetails[0];
                                } else {
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                                }

                            } else if (insuranceDetails1.PatientInsuranceDetails.length > 0 && $scope.IsCheckOldInsurance == true) {
                                console.log("Patient already have insurance");
                            } else {
                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                            }
                        }

                        //$scope.addAppointmentFormDataSubmit('', false, false);
                        $scope.IsPatientToBookApptInd = true;
                        $scope.MultipleAppointmentList = [];
                        $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();



                        if ($scope.SelectedBranchDocId != 0) {
                            var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === $scope.SelectedBranchDocId);
                        }
                        if (Index > -1) {
                            $scope.AppointmentDetailsInfo.selectedDocObject.selectedPerson = $scope.clinicDoctorList[Index];
                        }

                        $scope.MultipleAppointmentList.push($scope.AppointmentDetailsInfo);
                        $scope.GetAllHospitalEquipments();
                    }
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.HomeNumberFocus = false;
    $scope.homeareacode = function () {
        if ($scope.PatientDetailsForRegisterObj.HomeAreaCode.toString().length === 3) {
            $scope.HomeNumberFocus = true;
        }
        else {
            $scope.HomeNumberFocus = false;
        }
    };


    $scope.Patientauthorized = [
        { "Id": 1, "Name": "SMS" },
        { "Id": 2, "Name": "Email" },
        { "Id": 3, "Name": "SMS & Email" },
        { "Id": 4, "Name": "Not Authorized " }
    ];
    $scope.changePatientAuthorization = function (AuthorizationId) {
        if (AuthorizationId === null) {
            $scope.PatientDetailsForRegisterObj.AuthorizationId = "";
            return false;
        }

        $scope.PatientDetailsForRegisterObj.AuthorizationId = AuthorizationId || "";
        if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 1) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = true;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = false;

            $scope.sendPatientSms = true;
            $scope.sendPatientEmail = false;
        }
        else if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 2) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = false;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = true;

            $scope.sendPatientEmail = true;
            $scope.sendPatientSms = false;
        }
        else if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 3) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = true;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = true;

            $scope.sendPatientSms = true;
            $scope.sendPatientEmail = true;
        }
        else if ($scope.PatientDetailsForRegisterObj.AuthorizationId == 4) {
            $scope.PatientDetailsForRegisterObj.IsPatientSmsInd = false;
            $scope.PatientDetailsForRegisterObj.IsPatientEmailInd = false;

            $scope.sendPatientEmail = false;
            $scope.sendPatientSms = false;
        }

    };

    $scope.Durationchange = function (duration) {
        $scope.patinet_consultationTime = duration;
    };
    $scope.ChangeSetprimary = function (checked) {
        if (checked == true) {
            $scope.PatientInsuranceObj.IdentifierId = 1;
            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;
            if ($scope.patientInsuranceTpasArray.length > 1) {
                $scope.changePatientInsurance("", 'Primary', 'PrimaryCheck')
            }
        } else {
            $scope.PatientInsuranceObj.IdentifierId = 2;
        }
    };


    $scope.changeOfficeNumber = function (item) {
        item = item.toString() || "";
        if (item != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            if (obj != undefined) {
                if (obj.MobileNumber.length > 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.OfficeAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.OfficeNumber = contact;
                }
                else if (obj.MobileNumber.length <= 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.OfficeAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.OfficeNumber = contact;
                }
                $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber = obj.UsFormatMobileNumber || "";
            }
        } else {
            $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber = "";
            $scope.PatientDetailsForRegisterObj.OfficeAreaCode = "";
            $scope.PatientDetailsForRegisterObj.OfficeNumber = "";
        }
    };

    $scope.CheckVerifyEligibity = function () {
        if ($scope.PatientDetailsForRegisterObj.PatientID === 0 || $scope.PatientInsuranceObj.PatientInsuranceDetailId === 0) {
            $scope.addDirectpatientandInsuranceforEligibility();
        } else {
            $scope.continuetoCheckInsuranceEligibility();
        }
    }

    $scope.addDirectpatientandInsuranceforEligibility = function () {

        if ($scope.PatientDetailsForRegisterObj.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.FirstName.length < 3) {
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName || "";
        if ($scope.PatientDetailsForRegisterObj.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return false;
        }
        if ($scope.PatientDetailsForRegisterObj.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return false;
        }

        if ($scope.PatientDetailsForRegisterObj.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return false;
        }

        $scope.PatientDetailsForRegisterObj.HomeAreaCode = $scope.PatientDetailsForRegisterObj.HomeAreaCode || '';

        if ($scope.PatientDetailsForRegisterObj.HomeAreaCode == '' || ($scope.PatientDetailsForRegisterObj.HomeAreaCode.toString()).length < 2) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var HomeAreaCode = angular.copy($scope.PatientDetailsForRegisterObj.HomeAreaCode) || "";
        if ((HomeAreaCode.toString()).length < 3) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        var MobileNumber = angular.copy($scope.PatientDetailsForRegisterObj.HomeNumber) || "";
        if ((MobileNumber.toString()).length != 7) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }

        $scope.PatientDetailsForRegisterObj.OfficeAreaCode = $scope.PatientDetailsForRegisterObj.OfficeAreaCode || '';
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if (($scope.PatientDetailsForRegisterObj.OfficeAreaCode.toString()).length < 2) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var Contactnumber = angular.copy($scope.PatientDetailsForRegisterObj.OfficeNumber) || "";
        if ($scope.PatientDetailsForRegisterObj.OfficeAreaCode != '' || $scope.PatientDetailsForRegisterObj.OfficeNumber != '') {
            if ((Contactnumber.toString()).length != 7) {
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }


        $scope.PatientDetailsForRegisterObj.SocialSecurityNo = $scope.PatientDetailsForRegisterObj.SocialSecurityNo || null;
        if ($scope.PatientDetailsForRegisterObj.SocialSecurityNo === null) {
            alertify.error("Please Enter SSN Number");
            return;
        }

        var SSNno = angular.copy($scope.PatientDetailsForRegisterObj.SocialSecurityNo) || "";
        SSNno = SSNno.toString();
        if (SSNno != "" && SSNno.length !== "" && SSNno.length < 9) {
            alertify.error("Please Enter Valid SSN Number");
            return false;
        }

        $scope.PatientInsuranceObj.PayorId = $scope.PatientInsuranceObj.PayorId || null;
        if ($scope.PatientInsuranceObj.PayorId === null) {
            alertify.error("Please Select Payor");
            return;
        }
        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || null;
        if ($scope.PatientInsuranceObj.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || null;
        if ($scope.PatientInsuranceObj.PolicyId === null) {
            alertify.error("Please Enter Member ID");
            return;
        }
        $scope.PatientInsuranceObj.GroupId = $scope.PatientInsuranceObj.GroupId || null;
        if ($scope.PatientInsuranceObj.GroupId === null) {
            alertify.error("Please Enter Group");
            return;
        }

        var PatientandInsuranceDetails = {};
        var patientRegister = {
            "UserId": $scope.PatientDetailsForRegisterObj.UserId,
            "HospitalId": $scope.PatientDetailsForRegisterObj.HospitalId,
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "TitleId": $scope.PatientDetailsForRegisterObj.TitleId,
            "FirstName": $scope.PatientDetailsForRegisterObj.FirstName,
            "MiddleName": $scope.PatientDetailsForRegisterObj.MiddleName || '',
            "LastName": $scope.PatientDetailsForRegisterObj.LastName,
            "SecondLastName": $scope.PatientDetailsForRegisterObj.SecondLastName,
            "DOB": $filter("date")(new Date($scope.PatientDetailsForRegisterObj.DOB), "yyyy-MM-dd") || "",
            "Age": $scope.PatientDetailsForRegisterObj.ageinYears,
            "SSN": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "Gender": $scope.PatientDetailsForRegisterObj.Gender,
            "PatientTagId": $scope.PatientDetailsForRegisterObj.PatientTagId || null,
            "MaritalStatusId": $scope.PatientDetailsForRegisterObj.MaritalStatusID || null,
            "BloodGroupId": $scope.PatientDetailsForRegisterObj.BloodGroupId || null,
            "LeadSourceInd": "N",
            "PatientS3Url": $scope.PatientDetailsForRegisterObj.S3URL || "",
            "EmailID": $scope.PatientDetailsForRegisterObj.EmailID,
            "FullName": $scope.PatientDetailsForRegisterObj.FirstName + $scope.PatientDetailsForRegisterObj.LastName || "",
            "DeviceEntityTypeId": 2,
            "HomeCountryCode": $scope.PatientDetailsForRegisterObj.HomeCountryCode || "",
            "HomeAreaCode": $scope.PatientDetailsForRegisterObj.HomeAreaCode || "",
            "HomeNumber": $scope.PatientDetailsForRegisterObj.HomeNumber || "",
            "OfficeCountryCode": $scope.PatientDetailsForRegisterObj.OfficeCountryCode || "",
            "OfficeAreaCode": $scope.PatientDetailsForRegisterObj.OfficeAreaCode || "",
            "OfficeNumber": $scope.PatientDetailsForRegisterObj.OfficeNumber || "",
            "IsPatientSmsInd": $scope.PatientDetailsForRegisterObj.IsPatientSmsInd,
            "IsPatientEmailInd": $scope.PatientDetailsForRegisterObj.IsPatientEmailInd,
            "IsAllowAiAutomatedCalls": $scope.PatientDetailsForRegisterObj.IsAllowAiAutomatedCalls || false,
            "OccupationId": cacheStorageItem.OccupationId || null,
            "OccupationDescription": $scope.PatientDetailsForRegisterObj.OccupationDescription || "",
            "EmployerPhoneNo": cacheStorageItem.EmployerPhoneNo,
            "EmergencyContactName": cacheStorageItem.EmergencyContactName,
            "EmeregecyContactNo": cacheStorageItem.EmeregecyContactNo
        };
        PatientandInsuranceDetails.PatientDeatils = patientRegister;

        var insuranceObj = {
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID || 0,
            "FullName": $scope.PatientDetailsForRegisterObj.Fullname || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientInsuranceDetails": []
        }
        $scope.PatientInsuranceObj.PatientInsuranceDetailId = $scope.PatientInsuranceObj.PatientInsuranceDetailId || 0;
        $scope.PatientInsuranceObj.PayorId = $scope.PatientInsuranceObj.PayorId || 0;
        $scope.PatientInsuranceObj.CoverageId = $scope.PatientInsuranceObj.CoverageId || 0;
        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || 0;
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || "";
        $scope.IsCheckOldInsurance = false;
        if ($scope.PatientInsuranceObj.PayorId != 0 || $scope.PatientInsuranceObj.CoverageId != 0 || $scope.PatientInsuranceObj.PlanId != 0 || $scope.PatientInsuranceObj.PolicyId != "") {
            var TempInsuarance = $scope.PatientInsuranceObj;

            TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;

            TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            TempInsuarance.PlanId = TempInsuarance.PlanId || null;
            TempInsuarance.OrganizationPayorId = TempInsuarance.OrganizationPayorId || null;

            if (TempInsuarance.ExpiryDate != "") {
                TempInsuarance.ExpiryDate = $filter('date')(TempInsuarance.ExpiryDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.EffectiveDate != "") {
                TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.ScanDate != "") {
                TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.VerifiedDate != "") {
                TempInsuarance.VerifiedDate = $filter('date')(TempInsuarance.VerifiedDate, 'yyyy-MM-dd');
            }

            if (TempInsuarance.RelationShipId == 1) {
                TempInsuarance.InsuredPersonFirstName = patientRegister.FirstName + patientRegister.MiddleName + patientRegister.LastName;
                TempInsuarance.InsuredPersonGenderID = patientRegister.Gender == "Male" ? 'M' : 'F';
            }

            insuranceObj.PatientInsuranceDetails.push(TempInsuarance);


            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;

            if ($scope.PatientInsuranceObj.PatientInsuranceDetailId != 0) {
                $scope.IsCheckOldInsurance = true;
            } else {
                $scope.IsCheckOldInsurance = false;
            }
        } else {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;
        }
        PatientandInsuranceDetails.PatientInsuranceList = angular.copy(insuranceObj);




        if ($scope.SelectedBranchId === "" || $scope.SelectedBranchId === undefined) {
            alertify.error("Please Select a Branch");
            return false;
        }

        if ($scope.SelectedBranchDocId === "" || $scope.SelectedBranchDocId === undefined || $scope.SelectedBranchDocId === 0) {
            alertify.error("Please Select a Doctor");
            return false;
        }




        eHnoteUserAppointmentDataService.AddUpdatePatientRegisterandInsuarnceDeatils(PatientandInsuranceDetails).then(function (response) {

            console.log(JSON.stringify(response));

            if (response != undefined) {
                if (response.data != undefined) {
                    if (response.data.PatientDeatils.status == "success") {
                        var PatientDetails1 = response.data.PatientDeatils;
                        var insuranceDetails1 = response.data.InsuranceDetails || "";


                        if (PatientDetails1 != undefined && PatientDetails1 != null) {
                            $scope.PatientDetailsForRegisterObj.PatientID = PatientDetails1.PatientId;
                            $scope.PatientDetailsForRegisterObj.SocialSecurityNo = PatientDetails1.SSN;
                            $scope.PatientDetailsForRegisterObj.PatientDisplayId = PatientDetails1.PatientDisplayId;
                            $scope.selectedPatientObj.PatientId = PatientDetails1.PatientId;
                            $scope.selectedPatientObj.FullName = PatientDetails1.FullName;
                            $scope.selectedPatientObj.PatientName = PatientDetails1.FullName;
                            $scope.selectedPatientObj.FirstName = PatientDetails1.FirstName;
                            $scope.selectedPatientObj.LastName = PatientDetails1.LastName;
                            $scope.selectedPatientObj.PatientMobile = PatientDetails1.MobileNumber || 0;
                            $scope.selectedPatientObj.DOB = PatientDetails1.DOB;
                            $scope.selectedPatientObj.PatientGender = PatientDetails1.Gender;
                            $scope.selectedPatientObj.PatientEmail = PatientDetails1.EmailId;
                            $scope.selectedPatientObj.PatientTitle = PatientDetails1.TitleId;

                            if ($scope.selectedPatInfo == undefined) {
                                $scope.selectedPatInfo = {
                                    "EmailID": PatientDetails1.EmailId || ""
                                };
                            } else {
                                $scope.selectedPatInfo.EmailID = PatientDetails1.EmailId || "";
                            }

                        }
                        if (insuranceDetails1 != "" && insuranceDetails1 != undefined) {
                            if (insuranceDetails1.PatientInsuranceDetails.length > 0 && $scope.IsCheckOldInsurance == false) {

                                $scope.patientInsuranceTpasArray = angular.copy(insuranceDetails1.PatientInsuranceDetails);

                                $scope.PatientInsuranceObj.PatientInsuranceDetailId = insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceDetailId;

                                $scope.PatientInsuranceObj.PatientInsuranceControlNumber = insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceControlNumber;

                                console.log(insuranceDetails1.PatientInsuranceDetails[0].PatientInsuranceControlNumber + "__PatientInsuranceControlNumber");


                                if ($scope.paymentTypeObj.PaymentTypeId == 2 || $scope.paymentTypeObj.PaymentTypeId == "2") {
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = insuranceDetails1.PatientInsuranceDetails[0];
                                } else {
                                    $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                                }

                            } else if (insuranceDetails1.PatientInsuranceDetails.length > 0 && $scope.IsCheckOldInsurance == true) {
                                console.log("Patient already have insurance");
                            } else {
                                $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
                            }
                        }

                        $scope.continuetoCheckInsuranceEligibility();

                    }
                }
            }
        }, function (error) {
            console.log(error);
        });

    }


    $scope.continuetoCheckInsuranceEligibility = function () {
        if ($scope.PatientDetailsForRegisterObj.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return;
        }
        if ($scope.PatientDetailsForRegisterObj.FirstName.length < 3) {
            alertify.error("Please Enter Patient First Name");
            return;
        }
        $scope.PatientDetailsForRegisterObj.LastName = $scope.PatientDetailsForRegisterObj.LastName || "";
        if ($scope.PatientDetailsForRegisterObj.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return;
        }
        if ($scope.PatientDetailsForRegisterObj.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return;
        }

        if ($scope.PatientDetailsForRegisterObj.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return;
        }



        $scope.PatientDetailsForRegisterObj.SocialSecurityNo = $scope.PatientDetailsForRegisterObj.SocialSecurityNo || null;
        if ($scope.PatientDetailsForRegisterObj.SocialSecurityNo === null) {
            alertify.error("Please Enter Valid SSN Number");
            return;
        }


        var SSNno = angular.copy($scope.PatientDetailsForRegisterObj.SocialSecurityNo) || "";
        SSNno = SSNno.toString();
        if ((SSNno == "") || (SSNno != "" && SSNno.length !== "" && SSNno.length < 9)) {
            alertify.error("Please Enter Valid SSN Number");
            return;
        }

        $scope.PatientInsuranceObj.PlanId = $scope.PatientInsuranceObj.PlanId || null;
        if ($scope.PatientInsuranceObj.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        $scope.PatientInsuranceObj.PolicyId = $scope.PatientInsuranceObj.PolicyId || null;
        if ($scope.PatientInsuranceObj.PolicyId === null) {
            alertify.error("Please Enter Member ID");
            return;
        }
        $scope.PatientInsuranceObj.GroupId = $scope.PatientInsuranceObj.GroupId || null;
        if ($scope.PatientInsuranceObj.GroupId === null) {
            alertify.error("Please Enter Group");
            return;
        }
        //$scope.selectedDocObject.selectedPerson.EmployerId = $scope.selectedDocObject.selectedPerson.EmployerId || "";
        //if ($scope.selectedDocObject.selectedPerson.EmployerId === "") {
        //    alertify.error("This Doctor dont have ProviderId ,Please Add User ProviderId to Continue");
        //    return;
        //}







        var params = {
            "SNO": 1,
            "PatientAppointmentInsuranceDetailId": 0,
            "AppointmentId": 0,
            "AppointmentDate": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "AppointmentInsuranceNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
            "DoctorName": $scope.selectedDocObject.selectedPerson.FullName,
            "UserProviderId": $scope.selectedDocObject.selectedPerson.EmployeeId,
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "AppointmentTOSCodes": [],
            "NPI": $scope.selectedDocObject.selectedPerson.NPI,
            "TaxId": $scope.selectedDocObject.selectedPerson.TaxId,
            "ProviderCode": "H",
            "serviceProviderNumber": $scope.selectedDocObject.selectedPerson.serviceProviderNumber,
            "HospitalName": $scope.selectedBranchobj.ClinicName,
            "AppointmentTime": $scope.slot.patinet_appStarttime.StartTime,
            "AppointmentPatientTypeId": 1,
            "AppointmentPatientType": "New Patient",
            "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId,
            "PatientId": $scope.PatientDetailsForRegisterObj.PatientID,
            "PatientMrNo": $scope.PatientDetailsForRegisterObj.PatientDisplayId,
            "Gender": $scope.PatientDetailsForRegisterObj.Gender,
            "DOB": $scope.PatientDetailsForRegisterObj.DOB,
            "FirstName": $scope.PatientDetailsForRegisterObj.FirstName,
            "LastName": $scope.PatientDetailsForRegisterObj.LastName,
            "SecondLastName": $scope.PatientDetailsForRegisterObj.SecondLastName,
            "TitleId": 1,
            "Title": "Mr",
            "PatientName": $scope.PatientDetailsForRegisterObj.FirstName + "" + $scope.PatientDetailsForRegisterObj.LastName,
            "PatientMobile": $scope.PatientDetailsForRegisterObj.DisplayNumber,
            "PatientContact": $scope.PatientDetailsForRegisterObj.HomeCountryCode,
            "HomeNumber": $scope.PatientDetailsForRegisterObj.HomeNumber,
            "HomeAreaCode": $scope.PatientDetailsForRegisterObj.HomeAreaCode,
            "HomeCountryCode": $scope.PatientDetailsForRegisterObj.DisplayOfficeNumber,
            "OfficeNumber": $scope.PatientDetailsForRegisterObj.OfficeNumber,
            "OfficeAreaCode": $scope.PatientDetailsForRegisterObj.OfficeAreaCode,
            "OfficeCountryCode": $scope.PatientDetailsForRegisterObj.OfficeCountryCode,
            "PatientGender": $scope.PatientDetailsForRegisterObj.Gender,
            "PatientSSN": $scope.PatientDetailsForRegisterObj.PatientSSN,
            "PayorId": $scope.PatientInsuranceObj.PayorId,
            "PayorName": $scope.PatientInsuranceObj.PayorName,
            "PlanName": $scope.PatientInsuranceObj.PlanName,
            "PlanTypeId": $scope.PatientInsuranceObj.PlanTypeId,
            "PlanTypeName": $scope.PatientInsuranceObj.PlanTypeName,
            "PlanId": $scope.PatientInsuranceObj.PlanId,
            "InsuranceEffectiveDate": $scope.PatientInsuranceObj.EffectiveDate,
            "InsuranceExpiryDate": $scope.PatientInsuranceObj.ExpiryDate,
            "RelationShipId": $scope.PatientInsuranceObj.RelationShipId,
            "RelationName": $scope.PatientInsuranceObj.RelationShipName,
            "VerifiedDate": "",
            "Coinsurance": null,
            "VisitCopay": null,
            "CoverageId": 1,
            "InsuredPersonSSN": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "PolicyHolder": "",
            "InsuranceStatusId": 1,
            "InsuredPersonFirstName": $scope.PatientDetailsForRegisterObj.InsuredPersonFirstName,
            "InsuredPersonDOB": $scope.PatientDetailsForRegisterObj.InsuredPersonDOB,
            "InsuredPersonGenderID": $scope.PatientDetailsForRegisterObj.InsuredPersonGenderID,
            "InsuranceStatusName": "Active",
            "PolicyHolderName": "",
            "GroupName": "",
            "StatusId": 1,
            "StatusName": "Not Verified",
            "MasterPayorId": $scope.PatientInsuranceObj.GlobalPayorId,
            "OrgEligibilityClaimNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
            "PatientCoPayAmount": null,
            "PatientCoPayPercentage": null,
            "SocialSecurityNo": $scope.PatientDetailsForRegisterObj.SocialSecurityNo,
            "AddressId": null,
            "CityName": null,
            "StateName": null,
            "Pin": null,
            "PlanBeginDate": null,
            "PlanEndDate": null,
            "PolicyId": $scope.PatientInsuranceObj.PolicyId,
            "GroupId": $scope.PatientInsuranceObj.GroupId,
            "PlanNumber": $scope.PatientInsuranceObj.PlanCode,
            "isSelected": false,
            "isVerified": false,
            "IsShowEligibility": false,
            "ProviderID": $scope.PatientDetailsForRegisterObj.BranchNPI,
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "ServiceTo": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "MemberId": $scope.PatientInsuranceObj.PolicyId,
            "OrganizationId": $scope.selectedBranchobj.ClinicId,
            "serviceTypeCodes": [

            ]
        };



        eHnoteInsuranceService.checkPatientInsuranceEligibilityById(params, onSuccess, onError);
        function onSuccess(resp) {
            console.log(resp);

            resp.errors = resp.errors || [];
            if (resp.errors.length > 0) {

                var eparams = {
                    "UserId": $scope.UserId,
                    "AppointmentInsuranceDetailId": 0,
                    "InsuranceEligibilityErrorStatusId": 0,
                    "ErrorDetails": [],
                    "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
                }
                angular.forEach(resp.errors, function (eitem) {
                    var eobj = {
                        "Field": eitem.field,
                        "Description": eitem.description
                    }
                    eparams.ErrorDetails.push(eobj);
                });



                eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
                    if (response.data.status === 'Success') {

                    }
                });

            }
            else {

                var PlanStatusCode = "", PlanStatus = "", ResponseJson = "";

                if (resp.planStatus.length > 0) {
                    PlanStatusCode = resp.planStatus[0].statusCode;
                    PlanStatus = resp.planStatus[0].status;
                    ResponseJson = JSON.stringify(resp);
                }


                var obj = {
                    "UserId": $scope.UserId,
                    "PatientId": $scope.PatientDetailsForRegisterObj.PatientID,
                    "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                    "AppointmentInsuranceDetailId": 0,
                    "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId,
                    "StatusId": 2,
                    "OrgEligibilityClaimNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
                    "PlanStatusCode": PlanStatusCode,
                    "IdentifierId": $scope.PatientInsuranceObj.IdentifierId,
                    "PlanStatus": PlanStatus,
                    "PatientCoPayAmount": 250,
                    "PatientCoPayPercentage": 0,
                    "BenifitCoveragesList": [],
                    "BenifitCoverageDetailsList": []
                }
                resp.benefitsInformation = resp.benefitsInformation || [];
                resp.planStatus = resp.planStatus || [];


                if (resp.planStatus.length > 0) {
                    angular.forEach(resp.planStatus, function (psitem) {
                        angular.forEach(psitem.serviceTypeCodes, function (subitem) {
                            var sobj = {
                                "PatientEligibilityBenifitId": 0,
                                "ServiceTypeCode": subitem || 0,
                                "Status": psitem.status,
                                "IsCopayIdentified": false,
                                "DeleteInd": false,
                            }

                            obj.BenifitCoveragesList.push(sobj);
                        });

                    });
                }

                if (resp.benefitsInformation.length > 0) {
                    angular.forEach(resp.benefitsInformation, function (bitem) {
                        angular.forEach(bitem.serviceTypeCodes, function (subitem) {
                            bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                            var BenifitDateInformation = '';
                            if (bitem.benefitsDateInformation != '') {
                                bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                                bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                                BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                            }

                            var sobj = {
                                "PatientEligibilityBenifitDetailId": 0,
                                "ServiceTypeCode": subitem || 0,
                                "BenifitTypeName": bitem.name,
                                "BenifitAmount": bitem.benefitAmount || 0,
                                "BenifitPercentage": bitem.benefitPercent || 0,
                                "BenifitDateInformation": BenifitDateInformation || "",
                                "TimeQualifier": bitem.timeQualifier || '',
                                "CoverageLevel": bitem.coverageLevel || '',
                                "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                                "DeleteInd": false,
                            }

                            obj.BenifitCoverageDetailsList.push(sobj);
                        });

                    });
                }

                console.log(JSON.stringify(obj));

                eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                    console.log(response);
                    if (response.data.status === 'Success') {


                    }
                    $scope.PatientInsuranceObj.IsVerified = true;

                    $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId = response.data.AppointmentInsuranceDetailId || 0;

                });
            }

        }
        function onError(reponse) {
        }

    }



    $scope.showEligibilityinPopup = function () {
        $scope.obj = {
            "AppointmentInsuranceDetailId": $scope.PatientInsuranceObj.PatientAppointmentInsuranceDetailId || 0,
            "PatientInsuranceDetailId": $scope.PatientInsuranceObj.PatientInsuranceDetailId
        }


        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
            "size": "lg",
            "backdrop": "static",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "keyboard": false,
            "windowClass": "inventory-full-popup",
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj) {


                $scope.selectedObj = Selectobj;
                $scope.MainBenifitEligibilityCoverageList = [];
                $scope.BenifitEligibilityCoverageList1 = [];
                $scope.ChangePatientsInsuranceList = function () {
                    $scope.BenifitCoverageDetailListobj = 1;
                    $scope.Id = Selectobj.AppointmentInsuranceDetailId;
                    $scope.InsuranceEligibility = [];
                    $scope.selectedid = Selectobj.PatientInsuranceDetailId;
                    eHnoteInsuranceService.GetCheckInsuranceEligibilityById($scope.selectedid).then(function (resp) {
                        $scope.MainBenifitEligibilityCoverageList = [];
                        $scope.BenifitEligibilityCoverageList1 = [];
                        if (resp.data.status == "Success") {
                            resp.data.rows = resp.data.rows || [];

                            if (resp.data.rows.length > 0) {
                                resp.data.rows[0].BenifitCoverageDetailsList = resp.data.rows[0].BenifitCoverageDetailsList || [];
                                resp.data.rows[0].BenifitCoveragesList = resp.data.rows[0].BenifitCoveragesList || [];
                                if (resp.data.rows[0].BenifitCoverageDetailsList.length > 0) {

                                    angular.forEach(resp.data.rows[0].BenifitCoveragesList, function (hitem) {
                                        var temarray = $filter("filter")(resp.data.rows[0].BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeCode === hitem.ServiceTypeCode }, true);
                                        if (temarray.length !== 0) {
                                            var obj = {
                                                "ServiceTypeCode": hitem.ServiceTypeCode,
                                                "ServiceTypeName": hitem.ServiceTypeName,
                                                "Status": hitem.Status,
                                                "BenifitCoverageDetailsList": temarray || [],
                                            }
                                            $scope.MainBenifitEligibilityCoverageList.push(obj);

                                        }
                                    });
                                    $scope.BenifitEligibilityCoverageList1 = angular.copy($scope.MainBenifitEligibilityCoverageList);


                                }
                            }
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    }, function (error) {
                    });
                }

                $scope.BenifitCoverageDetailListobj = 1;
                $scope.ChangePatientsInsuranceList();
                $scope.CheckInsEligibility = function (val) {

                    if (val == '1') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeName == hitem.ServiceTypeName }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '2') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Co-Payment' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '3') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Co-Insurance' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '4') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Deductible' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '5') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Out of Pocket (Stop Loss)' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }

                    if (val == '6') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Limitations' }, true);
                            $scope.TempInsuarance = [];
                            if (temarray.length !== 0) {
                                var obj = {
                                    "ServiceTypeCode": hitem.ServiceTypeCode,
                                    "ServiceTypeName": hitem.ServiceTypeName,
                                    "Status": hitem.Status,
                                    "IsShowEligibility": true,
                                    "BenifitCoverageDetailsList": temarray || [],
                                }
                                $scope.BenifitEligibilityCoverageList1.push(obj);

                            }

                        });
                    }


                }

                $scope.CheckInsuranceEligibility1 = function (item) {
                    item.IsShowEligibility = !item.IsShowEligibility;
                }

                $scope.ClosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }


    $scope.changePaymentTypeNew = function (checked) {
        if (checked == true) {
            $scope.paymentTypeObj.PaymentTypeId = "1";
            $scope.paymentTypeObj.IsPaymentTypeInd = true;
        } else {
            $scope.paymentTypeObj.PaymentTypeId = "2";
            $scope.paymentTypeObj.IsPaymentTypeInd = false;
        }
        $scope.ShowAddNewInsurance = true;
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
    }

    $scope.ChangeTitleBasedGender = function (Gender) {
        if (Gender === "Female") {
            $scope.PatientDetailsForRegisterObj.TitleId = 3;
        } else {
            $scope.PatientDetailsForRegisterObj.TitleId = 1;
        }
    };

    $scope.defaultDoctorVisit = "";
    $scope.GetDefaultReasonForDoctors = function () {
        if ($scope.selectedDocObject.selectedPerson.DoctorID == 0 || $scope.selectedDocObject.selectedPerson.DoctorID == undefined) {
            return;
        }
        var obj = {
            "DoctorId": $scope.selectedDocObject.selectedPerson.DoctorID,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "VisitTypeId": parseInt($scope.appointment_type.AppointmentTypeId),
            "PageNumber": 1,
            "PageSize": 10,
            "Status": 1
        };
        eHnoteMainAppointmentService.GetDefaultReasonsForDoctors(obj, GetVisitreasonsbackSuccess, GetVisitreasonsbackError);
        function GetVisitreasonsbackSuccess(resp) {
            if (resp.Status == "Success") {
                $scope.defaultDoctorVisit = "";
                if (resp.rows.length > 0) {
                    $scope.defaultDoctorVisit = resp.rows[0];
                    $scope.othervisitrsn = $scope.defaultDoctorVisit.VisitReasonName;
                    $scope.visitrsnId = $scope.defaultDoctorVisit.VisitReasonId;

                } else {
                    $scope.defaultDoctorVisit = "";
                    $scope.othervisitrsn = "";
                    $scope.visitrsnId = "";
                }
            }
        }
        function GetVisitreasonsbackError(error) {
        }
    };

    $scope.ChangeSecondLastNameInd = function (SecondLastNameInd) {
        SecondLastNameInd = !SecondLastNameInd;
    };


    $scope.Backpopup = function () {
        $scope.IsPatientToBookApptInd = false;
    }
    $scope.GetUpcomingAppointments = function (patientId) {
        if ($scope.AllPatientAppointmentList.length > 0) {
            return false;
        }

        var PHospitID = null;
        var HospitID = null;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            PHospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            HospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        eHnoteUserAppointmentDataService.GetPatientUpcomingAppointments(patientId, PHospitID).then(function (response) {
            console.log(response);
            if (response.data.Status == "Success") {
                $scope.AllPatientAppointmentList = response.data.AllAppointments || [];
            } else {
                alertify.error(Message);
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.GetActiveDates = function (start_date, end_date) {
        var t = "";
        if ($scope.AppointmentRescheduleObj.StartDateforActivecalendar == '') {
            t = new Date();
        } else {
            t = start_date;
        }
        var endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0);

        var params = {
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "DoctorId": $scope.SelectedBranchDocId,
            "UserBranchId": $scope.selectedDocObject.selectedPerson.UserBranchId,
            "StartDate": $filter('date')(t, "yyyy-MM-dd"),
            "EndDate": $filter('date')(endDate, "yyyy-MM-dd"),
            "VisitReasonId": $scope.visitrsnId,
            "VisitTypeId": $scope.appointment_type.AppointmentTypeId
        };
        eHnoteMainAppointmentService.GetDoctorSlotsByVisitReasons(params, OnGetSuccess, OnGetError);

        function OnGetSuccess(resp) {
            if (resp.Status === "Success") {
                $scope.DocAvailableDates = [];
                angular.forEach(resp.rows, function (kitem) {
                    var obj = {
                        startDate: new Date(kitem.SlotDate + ' ' + "00:00:00"),
                        endDate: new Date(kitem.SlotDate + ' ' + "23:59:59"),
                        summary: 'Slot Available'
                    };
                    $scope.DocAvailableDates.push(obj);
                });
                $calendar.setEvents($scope.DocAvailableDates);
            }

        }
        function OnGetError(response) {

        }
    }

    $scope.BlurPatientFirstName = function () {
        $scope.PatientInsuranceObj.PatientFirstName = angular.copy($scope.PatientDetailsForRegisterObj.FirstName) || "";
    }
    $scope.BlurPatientLastName = function () {
        $scope.PatientInsuranceObj.PatientLastName = angular.copy($scope.PatientDetailsForRegisterObj.LastName) || "";
    }
    $scope.BlurPatientSecondLastName = function () {
        $scope.PatientInsuranceObj.PatientSecondLastName = angular.copy($scope.PatientDetailsForRegisterObj.SecondLastName) || "";
    }
    $scope.BlurPatientMiddleName = function () {
        $scope.PatientInsuranceObj.PatientMiddleName = angular.copy($scope.PatientDetailsForRegisterObj.MiddleName) || "";
    }


    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
    $scope.selectedCalendarDate = new Date();
    $scope.jscalendaroptions = {
        customClass: getDayClass,
        minDate: new Date(),
        // maxDate: myFutureDate,
        showWeeks: false
    };



    /*   start BookAppt*/

    function GetAppointmentDetailsInfo() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "Tab": 1,
            "IsEdit": true,
            "AppointmentID": 0,
            "ParentAppointmentId": 0,
            "RootAppointmentId": 0,
            "OrganId": null,
            "NurseId": null,
            "AnesthesistId": null,
            "AppointmentStatus": "B",
            "CurrentTime": "",
            "StartTime": "",
            "EndTime": "",
            "AppointmentTypeId": "",
            "visitremarks": "",
            "BookingType": "",
            "selectBookingType": {
                "selectedBookAppo": "",
                "IsWalkInSlot": false,
                "IsAppointmentConfirmed": false,
                "IsPatientMissedAppointment": false,
                "IsInsuranceEligibilityVerify": false
            },
            "SelectedNotesobj": {
                "IsEdit": false,
                "index": null,
                "AppointmentNoteId": null,
                "AppointmentNote": "",
            },
            "selectedDocObject": {
                "selectedPerson": ""
            },
            "patient_appEndTime": "",
            "patinet_appStarttime": "",
            "searchtext": {
                "visitreason": ""
            },
            "appDate": $filter("date")(new Date(), "MM-dd-yyyy"),
            "DoctorID": null,
            "RoomId": null,
            "RoomTypeId": null,

            "DayCD": "",
            "VisitUserTypeID": "",
            "OtherVisitRsn": "",
            "ConsultationDt": "",
            "UserBranchId": null,
            "PatientID": null,
            "USRType": "DOCTOR",
            "PreviousAppointmentDate": "",

            "SendDocSms": false,
            "SendDocEmail": false,
            "SendPatientEmail": false,
            "SendPatientSms": false,
            "PatientEmail": "",
            "PatientTypeId": null,
            "BookingTypeId": null,

            "IsCheckedIn": null,
            "PatientInsuranceList": [],
            "AppointmentNotes": [],
            "HospitalEquipmentId": null,
            "PaymentTypeId": null,

            "IsConfirmedAppointment": false,
            "VisitTypeId": null,
            "IsInsuranceEligibilityVerify": false,
            "IsPatientSmsInd": false,
            "IsPatientEmailInd": false,
            "AppointmentTypeName": "",
            "DisplayNumber": "",
            "VisitRemarks": "",

        }
        return obj;
    }
    $scope.AppointmentDetailsInfo = GetAppointmentDetailsInfo();


    $scope.Changeaddnotes1 = function (item) {
        if (item.SelectedNotesobj.AppointmentNote == '') {
            alertify.error("Please Enter Notes");
            return false;
        }
        item.AppointmentNotesList = item.AppointmentNotesList || [];
        var obj = {
            "AppointmentNoteId": 0,
            "Notes": item.SelectedNotesobj.AppointmentNote || "",
            "DeleteInd": "N",
            "CreatedBy": $scope.DocotrName || "",
            "UserId": eHnoteMasterDataService.getLoginId() || "",
            "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
        }
        if ($scope.index !== "") {
            item.AppointmentNotesList.splice($scope.index, 1);
        }

        item.AppointmentNotesList.push(obj);
        item.SelectedNotesobj.AppointmentNote = "";
        $scope.Showaddnotes = false;
        $scope.UnblockSlots = false;

        $scope.index = "";
    }
    $scope.index = "";
    $scope.EditNodes = function (Nitem, index) {
        $scope.UserId = eHnoteMasterDataService.getLoginId()
        $scope.index = index;
        if ($scope.UserId == Nitem.UserId) {
            if ($scope.paymentTypeObj.AppointmentNotesList.length != 0) {
                $scope.paymentTypeObj.AppointmentNote = Nitem.Notes;
                //$scope.paymentTypeObj.AppointmentNotesList.splice(index, 1);
            }
            $scope.Showaddnotes = true;
            $scope.SelectedNotesobj.IsEdit = true;
            $scope.SelectedNotesobj.index = index;
            $scope.SelectedNotesobj.AppointmentNoteId = Nitem.AppointmentNoteId || 0;
        }

    }

    $scope.ChangeUpdateNotes = function (item) {
        if (item.SelectedNotesobj.AppointmentNote == '') {
            alertify.error("Please Enter Notes");
            return false;
        }

        item.AppointmentNotesList = item.AppointmentNotesList || [];
        if (item.SelectedNotesobj.AppointmentNoteId != 0) {
            angular.forEach(item.AppointmentNotesList, function (sitem) {
                if (sitem.AppointmentNoteId === item.SelectedNotesobj.AppointmentNoteId) {
                    sitem.Notes = item.SelectedNotesobj.AppointmentNote;
                    sitem.Date = $filter("date")(new Date(), "MM-dd-yyyy");
                    sitem.Time = $filter('date')(new Date(), 'HH:mm') || "";
                }
            });

            item.SelectedNotesobj.IsEdit = false;
            item.SelectedNotesobj.index = null;
            item.SelectedNotesobj.AppointmentNoteId = null;
            item.SelectedNotesobj.AppointmentNote = "";
            $scope.Showaddnotes = false;
        } else {
            var index = item.SelectedNotesobj.index;
            item.AppointmentNotesList[index].Notes = item.SelectedNotesobj.AppointmentNote;
            item.AppointmentNotesList[index].Date = $filter("date")(new Date(), "MM-dd-yyyy");
            item.AppointmentNotesList[index].Time = $filter('date')(new Date(), 'HH:mm') || "";

            item.SelectedNotesobj.IsEdit = false;
            item.SelectedNotesobj.index = null;
            item.SelectedNotesobj.AppointmentNoteId = null;
            item.SelectedNotesobj.AppointmentNote = "";
            $scope.Showaddnotes = false;
        }
        $scope.index = "";
    }

    $scope.DeleteApptNote = function (item, index) {
        $scope.UserId = eHnoteMasterDataService.getLoginId()
        if ($scope.UserId == item.UserId) {
            if (item.AppointmentNoteId == 0) {
                $scope.paymentTypeObj.AppointmentNotesList.splice(index, 1);
            } else {
                angular.forEach($scope.paymentTypeObj.AppointmentNotesList, function (Aitem) {
                    if (Aitem.AppointmentNoteId == item.AppointmentNoteId) {
                        Aitem.DeleteInd = "Y";
                    }
                });
            }
        }
    }

    $scope.ChangeBookingType = function (type, Mainitem) {

        Mainitem.selectBookingType.IsWalkInSlot = type;
        if (Mainitem.selectBookingType.IsWalkInSlot == true) {
            Mainitem.selectBookingType.IsAppointmentConfirmed = true;
        }
        else {
            Mainitem.selectBookingType.IsAppointmentConfirmed = false;
        }
        $scope.BookingType = (Mainitem.selectBookingType.IsWalkInSlot == true) ? "1" : "3";
        if ($scope.selectBookingType.IsWalkInSlot) {
            $scope.appointmentInfo.CheckinStatusId = 2;
            eHnoteMasterDataService.addAppointmentInfo($scope.appointmentInfo);
        }

        $scope.RoomSearchObj = {
            "RoomTypeId": 0,
            "RoomId": 0,
            "RoomTypeobj": "",
            "Opthamobj": "",
            "AssignedUserId": null,
            "ARobj": "",
            "OptomId": null,
            "ARId": null,
            "Technicianobj": "",
            "TechnicianId": null,
            "Counsellorobj": "",
            "CounsellorId": null,
            "DilationAssistantobj": "",
            "DilationAssistantId": null,
            "DoctorId": null,
            "Roomobj": "",
            "Billingobj": "",
            "NewApptStartTime": ""

        }
        if ($scope.BookingType === 1 || $scope.BookingType === "1") {
            $scope.IsCheckIn = 2;
            if ($scope.RoomTypeList.length > 0) {
                var List1 = $filter("filter")($scope.RoomTypeList, { "Id": 10 }, true) || [];
                if (List1.length > 0) {
                    $scope.RoomSearchObj.RoomTypeobj = List1[0];
                    $scope.RoomSearchObj.RoomTypeId = List1[0].Id;
                }
            }
        }

        if ($scope.BookingType === 1 || $scope.BookingType === "1") {
            $scope.IsCheckIn = 2;
        }
        if ($scope.BookingType === 3 || $scope.BookingType === "3") {
            $scope.IsCheckIn = 1;
        }
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
        if ($scope.BookingType === 1 || $scope.BookingType === "1") {
            if (appointmentDate > currentdate) {
                Mainitem.selectBookingType.IsAppointmentConfirmed = false;
            }
            else {
                Mainitem.selectBookingType.IsAppointmentConfirmed = true;
            }
        } else {
            Mainitem.selectBookingType.IsAppointmentConfirmed = false;
        }
        Mainitem.BookingType = $scope.BookingType;

    }

    $scope.ChangeAppointmentConfirmed = function (type, Mainitem) {
        Mainitem.selectBookingType.IsAppointmentConfirmed = type;
    }

    /*   End BookAppt*/
}]);
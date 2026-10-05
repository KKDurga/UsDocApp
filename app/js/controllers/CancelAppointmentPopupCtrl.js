
"use strict";
eHnoteWebApp.controller("CancelAppointmentPopupCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteMasterDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "$q", "eHnoteMainAppointmentService", "eHnotePatientVisitReasonServices", "mainObject", "$uibModalInstance", "eHnoteUserDataService", "eHnoteAuditServices", "datapersistanceFactory", function ($scope, $rootScope, $location, $filter, eHnoteMasterDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, $q, eHnoteMainAppointmentService, eHnotePatientVisitReasonServices, mainObject, $uibModalInstance, eHnoteUserDataService, eHnoteAuditServices, datapersistanceFactory) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    
    

    $scope.ParentObj = {
        'IsIOJParentOrganization': false
    };

    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }


    $scope.CancelAppointmentobj = {
        "Ispopup": false,
        "CancelAppReason": [],
        "sendDocSms": false,
        "sendPatientSms": false,
        "sendDocEmail": false,
        "sendPatientEmail": false,
        "CancelReason": "",
        "CancelReasonId": 0,
        "NoShowReasonRemarks": "",
        "OtherCancelReason": "",
        "SmsLanguageId": "",
        "IsSmsLanguageIdInd": false,
        "PatientDisplayId": "",
        "PatientName": "",
        "S3URL": "",
        "PatientID": 0,
        "AppointmentID":0,
        "Doctor_Name":"",
        "AppointmentDate_Time": "",
        "ConsultationDt": "",
        "AppointmentStatusId":0,
        "CancelStTime": "",
        "CancelEdTime": "",
        "DoctorID": 0,
        "DoctorVisitRsnID": 0,
        "EmailId": "",
        "MobileNumber": null,
        "CommunicationEmailId": "",
        "DisplayNumber": null,
        "IsTeleMedicineSlot": false,
        "SubSpecializationId": 0,
        "BranchSubSpecializationId": 0,
        "VisitTypeId": null,
        "CheckinStatusId": null,
        "AppointmentPatientTypeId": null,
        "PaymentTypeId": 0,
        "BookingStatusId": null,
        "BookingTypeId": null,
        "OtherProviderDoctorID": 0,
        "SurgeryReferralDoctorId":0,
        "ReasonTypeId": 0,
        "DoctorEmail": '',
        "cancelHospitalId": 0,
        "LanguageID":0,
    };
    
    

    console.log(JSON.stringify(mainObject));

    $scope.mainObject = mainObject || '';

    


    $scope.ChnageCancelReasion = function (id) {
        id = id || 0;
        var TempReasion = $filter("filter")($scope.CancelAppointmentobj.CancelAppReason, function (item, index) { return item.CancelVisitReasonId == id; }) || [];
        $scope.CancelAppointmentobj.CancelReason = TempReasion[0].CancelReason || '';

    };


    $scope.CancelclosePopup = function () {
        $uibModalInstance.dismiss("cancel");
    };


    $scope.init = function () {

        $scope.CancelAppointmentobj.PatientDisplayId = $scope.mainObject.PatientDisplayId || '';
        $scope.CancelAppointmentobj.PatientName = $scope.mainObject.PatientName || '';
        $scope.CancelAppointmentobj.S3URL = $scope.mainObject.S3URL || "";
        $scope.CancelAppointmentobj.AppointmentID = $scope.mainObject.AppointmentID || 0;
        $scope.CancelAppointmentobj.PatientID = $scope.mainObject.PatientID || 0;
        $scope.CancelAppointmentobj.Doctor_Name = $scope.mainObject.DoctorFullName || '';
        $scope.CancelAppointmentobj.AppointmentDate_Time = $scope.mainObject.AppointmentDateTime || "";
        $scope.CancelAppointmentobj.ConsultationDt = $scope.mainObject.ConsultationDt || "";
        $scope.CancelAppointmentobj.AppointmentStatusId = $scope.mainObject.AppointmentStatusId || 0;
        $scope.CancelAppointmentobj.CancelStTime = $scope.mainObject.CancelStTime || '';
        $scope.CancelAppointmentobj.CancelEdTime = $scope.mainObject.CancelEdTime || '';
        $scope.CancelAppointmentobj.sendPatientSms = $scope.mainObject.sendPatientSms || false;
        $scope.CancelAppointmentobj.sendPatientEmail = $scope.mainObject.sendPatientEmail || false;
        $scope.CancelAppointmentobj.DoctorID = $scope.mainObject.DoctorID || 0;
        $scope.CancelAppointmentobj.DoctorVisitRsnID = $scope.mainObject.DoctorVisitRsnID || 0;
        $scope.Patientname = $scope.mainObject.PatientFullName || "";
        $scope.CancelAppointmentobj.MobileNumber = $scope.mainObject.MobileNumber || null;
        $scope.CancelAppointmentobj.EmailId = $scope.mainObject.EmailId || "";
        $scope.CancelAppointmentobj.CommunicationEmailId = $scope.mainObject.CommunicationEmailId || "";
        $scope.CancelAppointmentobj.DisplayNumber = $scope.mainObject.DisplayNumber || null;
        $scope.CancelAppointmentobj.IsTeleMedicineSlot = $scope.mainObject.IsTeleMedicineSlot || false;
        $scope.CancelAppointmentobj.SubSpecializationId = $scope.mainObject.SubSpecializationId || 0;
        $scope.CancelAppointmentobj.BranchSubSpecializationId = $scope.mainObject.BranchSubSpecializationId || 0;
        $scope.CancelAppointmentobj.VisitTypeId = $scope.mainObject.VisitTypeId || null;
        $scope.CancelAppointmentobj.CheckinStatusId = $scope.mainObject.CheckinStatusId || null;
        $scope.CancelAppointmentobj.AppointmentPatientTypeId = $scope.mainObject.AppointmentPatientTypeId || null;
        $scope.CancelAppointmentobj.PaymentTypeId = $scope.mainObject.PaymentTypeId || 0;
        $scope.CancelAppointmentobj.BookingStatusId = $scope.mainObject.BookingStatusId || null;
        $scope.CancelAppointmentobj.BookingTypeId = $scope.mainObject.BookingTypeId || null;
        $scope.CancelAppointmentobj.OtherProviderDoctorID = $scope.mainObject.OtherProviderDoctorID || 0;
        $scope.CancelAppointmentobj.SurgeryReferralDoctorId = $scope.mainObject.SurgeryReferralDoctorId || 0;
        $scope.CancelAppointmentobj.ReasonTypeId = $scope.mainObject.ReasonTypeId || 0;
        $scope.CancelAppointmentobj.DoctorEmail = $scope.mainObject.DoctorEmail || '';
        $scope.CancelAppointmentobj.cancelHospitalId = $scope.mainObject.cancelHospitalId || 0;
        $scope.CancelAppointmentobj.LanguageID = $scope.mainObject.LanguageID || 0;
        

        var getParams = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 100,
            "PageNumber": 1
        };

        var param = {
            "AppointmentId": 0,
            "PatientId": $scope.CancelAppointmentobj.PatientID || 0,
            "IsHistory": false
        }

        $q.all([
            eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams),
            eHnoteMainAppointmentService.GetSetReminderDetails(param)
            
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                if (resp[0].data.rows.length > 0) {
                    $scope.CancelAppointmentobj.CancelAppReason = $filter("filter")(resp[0].data.rows, { "ActiveInd": "Y" }, true);
                   
                }
            };
            if (resp[1].data.status == "Success") {
                $scope.SetReminderArray = angular.copy(resp[1].data.rows);
                if ($scope.SetReminderArray.length > 0) {
                    var List = $filter("filter")($scope.SetReminderArray, { "TypeId": 3, "AppointmentId": $scope.CancelAppointmentobj.AppointmentID }, true) || [];
                    if (List.length > 0) {
                        if (List[0].AppointmentId == $scope.CancelAppointmentobj.AppointmentID) {
                            $scope.ReminderDate = List[0].Date || '';
                        }
                    } else {
                        $scope.ReminderDate = '';
                    }
                } else {
                    $scope.ReminderDate = '';
                }
            }
           
           
        });

    }
   
    $scope.init();

    $scope.patiendetilsopen = function () {
        let patientId = $scope.CancelAppointmentobj.PatientID || 0;
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var selectedPatientData = data;
                $scope.CancelAppointmentobj.S3URL = selectedPatientData.Patient[0].S3URL || "";
                $scope.CancelAppointmentobj.PatientName = selectedPatientData.Patient[0].FullName || "";
                $scope.CancelAppointmentobj.PatientDisplayId = selectedPatientData.Patient[0].PatientDisplayId || "";
                $scope.Patientname = selectedPatientData.Patient[0].FullName || "";
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

    $scope.getCurrentDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return today = yyyy + '-' + mm + '-' + dd;
    };

    $scope.GetSetReminderId = function (Id) {
        $scope.PatientId = Id || 0;
        $scope.SetReminderArray = [];
        var param = {
            "AppointmentId": 0,
            "PatientId": $scope.PatientId || 0,
            "IsHistory": false
        }

        eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.SetReminderArray = angular.copy(resp.data.rows);
                if ($scope.SetReminderArray.length > 0) {
                    var List = $filter("filter")($scope.SetReminderArray, { "TypeId": 3, "AppointmentId": $scope.CancelAppointmentobj.AppointmentID }, true) || [];
                    if (List.length > 0) {
                        //   angular.forEach(List, function (item) {
                        if (List[0].AppointmentId == $scope.CancelAppointmentobj.AppointmentID) {
                            $scope.ReminderDate = List[0].Date || '';
                        }
                        // });
                    } else {
                        $scope.ReminderDate = '';
                    }
                } else {
                    $scope.ReminderDate = '';
                }
            }
        }, function (err) {
            alertify.error("Getting Failed");
        });
    }

    $scope.ClickRemindersPopup = function (RemainderItem, type, item) {
        $scope.IsAddtoRecall = false;
        RemainderItem = RemainderItem || '';
        item = item || '';
        type = type || 1;
        var Reminderobj = {
            "TypeId": 3,
            "appointmentid": $scope.CancelAppointmentobj.AppointmentID || 0,
            "PatientID": $scope.CancelAppointmentobj.PatientID || 0,
            "IsFrom": "",
        }

        if (RemainderItem != '' && $scope.SetReminderArray.length > 0) {
            var filteredItem = $filter("filter")($scope.SetReminderArray, { "TypeId": 3, "AppointmentId": $scope.CancelAppointmentobj.AppointmentID }, true);
            RemainderItem = filteredItem.length > 0 ? filteredItem[0] : '';
        }
       

        let getParams = {
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.GetVisitReasonsArray = [];
                    $scope.GetVisitReasonsArray = $filter("filter")(resp.data.rows, function (kitem) {
                        return kitem.ActiveIND == "Y";
                    });

                    $scope.reminderModalInstance = $uibModal.open({
                        "templateUrl": "templates/uibpopups/SetReminderPopover.html",
                        "controller": "UsRemindersPopupCtrl",
                        "backdrop": "static",
                        "scope": $scope,
                        "keyboard": false,
                        "size": "lg",
                        "resolve": {
                            "Reminderobj": function () { return Reminderobj; },
                            "RemainderItem": function () { return RemainderItem; },
                            "ReminderTab": function () { return type; },
                            "ReturntoofficeItem": function () { return item; },
                        },


                    });
                    $scope.reminderModalInstance.result.then(function (resp) {
                        $scope.IsAddtoRecall = false;
                        $scope.GetSetReminderId($scope.CancelAppointmentobj.PatientID);

                    }, function () {

                    });

                }

            }
        });


    };

    $scope.UpdateAppt = function (Cancelform, CancelReasonId, OtherCancelReason) {
       
        var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();

        if ($scope.ParentObj.IsIOJParentOrganization) {
            if (CancelReasonId !== 0) {
                if ($scope.CancelAppointmentobj.OtherCancelReason === '') {
                    alertify.error('Please Enter Reason for Cancel');
                    return false;
                }
            }
        } else {
            if (CancelReasonId == 1) {
                if ($scope.CancelAppointmentobj.OtherCancelReason === '') {
                    alertify.error('Please Enter Reason for Cancel');
                    return false;
                }
            }
        }
        if (CancelReasonId === 0) {
            alertify.error('Please Select Reason For Cancellation');
            return false;
        }

        var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");



        var CurrentDate = $filter("date")(new Date(), "yyyy-MM-dd");
        if ($scope.CancelAppointmentobj.ConsultationDt === CurrentDate) {
            if ($scope.CancelAppointmentobj.AppointmentStatusId == 1) {
                $scope.CancelAppointmentobj.AppointmentStatusId = 7;  // last min cancel
            } else if ($scope.CancelAppointmentobj.AppointmentStatusId == 2) {
                $scope.CancelAppointmentobj.AppointmentStatusId = 6;   //check-in cancel
            }
        } else {
            $scope.CancelAppointmentobj.AppointmentStatusId = 5;   //planed cancel
        }

        
        var AppmntParams = {
            "AppointmentID": $scope.CancelAppointmentobj.AppointmentID || null,
            "AppointmentStatus": "C",
            "StartTime": $scope.CancelAppointmentobj.CancelStTime,
            "EndTime": $scope.CancelAppointmentobj.CancelEdTime,
            "IsFollowUp": false,
            "DoctorID": $scope.CancelAppointmentobj.DoctorID,
            "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
            "DayCD": currentdaycode,
            "VisitUserTypeID": "OPATIENT",
            "OtherVisitRsn": "",
            "ConsultationDt": $scope.CancelAppointmentobj.ConsultationDt,
            "PatientID": $scope.CancelAppointmentobj.PatientID,
            "UserId": $scope.UserId,
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": $scope.CancelAppointmentobj.DoctorVisitRsnID,
            "HospitalDetails": {
                "HospitalID": $scope.CancelAppointmentobj.cancelHospitalId || 0,
                "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "CommunicationDetails": {
                "PatientName": $scope.Patientname,
                "PatientMobile": $scope.CancelAppointmentobj.MobileNumber,
                //"DoctorMobile": $scope.DocPHnumber,
                "DoctorMobile": 0,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.CancelAppointmentobj.Doctor_Name,
                "AppDate": $scope.CancelAppointmentobj.ConsultationDt,
                "AppTime": $scope.CancelAppointmentobj.CancelStTime,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.CancelAppointmentobj.EmailId,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail || "",
                //"DoctorEmail": $scope.DoctorEmail,
                "DoctorEmail": $scope.CancelAppointmentobj.DoctorEmail || '',
                "HospitalContact": doctorinfo.doctordata.UserAddress[0].MobileNo,
                "BrnachAddress": {
                    "Address1": doctorinfo.doctordata.UserAddress[0].Address1,
                    "Address2": doctorinfo.doctordata.UserAddress[0].Address2,
                    "Location": doctorinfo.doctordata.UserAddress[0].Location,
                    "StateId": doctorinfo.doctordata.UserAddress[0].StateId,
                    "PinCode": doctorinfo.doctordata.UserAddress[0].PinCode,
                    "CountryId": doctorinfo.doctordata.UserAddress[0].CountryId,
                    "CityId": doctorinfo.doctordata.UserAddress[0].CityId,
                    "DistrictRegion": doctorinfo.doctordata.UserAddress[0].DistrictRegion,
                    "Latitude": doctorinfo.doctordata.UserAddress[0].Latitude,
                    "Longitude": doctorinfo.doctordata.UserAddress[0].Longitude
                },
                "CommunicationEmailId": $scope.CancelAppointmentobj.CommunicationEmailId || "",
                // "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
                "CommunicationMobileNo": "",
                "DisplayNumber": $scope.CancelAppointmentobj.DisplayNumber,
            },
            "PreviousAppointmentTime": "",
            "SendDocSms": $scope.CancelAppointmentobj.sendDocSms,
            "SendDocEmail": $scope.CancelAppointmentobj.sendDocEmail,
            "SendPatientEmail": $scope.CancelAppointmentobj.sendPatientEmail,
            "SendPatientSms": $scope.CancelAppointmentobj.sendPatientSms,
            "StatusDescription": OtherCancelReason,   // Cancelinfo.CancelReason,
            "PaidFollowup": false,
            "IsTeleMedicineSlot": $scope.CancelAppointmentobj.IsTeleMedicineSlot,
            "SubSpecializationId": $scope.CancelAppointmentobj.SubSpecializationId,
            "BranchSubSpecializationId": $scope.CancelAppointmentobj.BranchSubSpecializationId,
            "CurrentTime": CurrentCheckOutTime || null,
            "IsCheckedIn": $scope.CancelAppointmentobj.CheckinStatusId || 1,
            "VisitTypeId": $scope.CancelAppointmentobj.VisitTypeId || null,
            "AppointmentPatientTypeId": $scope.CancelAppointmentobj.AppointmentPatientTypeId,
            "CancelReasonId": CancelReasonId,
            //"VisitRemarks": $scope.CancelAppointmentobj.VisitRemarks || "",
            "PaymentTypeId": $scope.CancelAppointmentobj.PaymentTypeId || 0,
            "IsNoShowAppointment": false,
            "BookingStatusId": $scope.CancelAppointmentobj.BookingStatusId,
            "AppointmentStatusId": $scope.CancelAppointmentobj.AppointmentStatusId,
            "BookingTypeId": $scope.CancelAppointmentobj.BookingTypeId,
            "OtherProviderDoctorID": $scope.CancelAppointmentobj.OtherProviderDoctorID || 0,
            "SurgeryReferralDoctorId": $scope.CancelAppointmentobj.SurgeryReferralDoctorId || 0,
            "ReasonTypeId": $scope.CancelAppointmentobj.ReasonTypeId || 0,
            "SmsLanguageId": $scope.CancelAppointmentobj.SmsLanguageId || "",
            "ParentAppointmentVisitReasonId": $scope.CancelAppointmentobj.VisitTypeId || null,
            "EmailCommunicationProviderId": doctorinfo.doctordata.UserAddress[0].EmailCommunicationProviderId || 0,
            "EmailCommunicationEnabled": doctorinfo.doctordata.UserAddress[0].EmailCommunicationEnabled || false
        };

        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        AppmntParams.SmsLanguageId = 123; // english
        var selectedPatientLanguageId = $scope.CancelAppointmentobj.LanguageID || 0;
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
            // language selection 
            AppmntParams.SmsLanguageId = selectedPatientLanguageId === 123 ? 123 : 401;  // spanish
            if (AppmntParams.DoctorVisitRsnID == "4" || AppmntParams.DoctorVisitRsnID == "7" || AppmntParams.DoctorID == 3 || AppmntParams.DoctorID == 4 ||
                AppmntParams.VisitTypeId == 8 || AppmntParams.VisitTypeId == 9 || AppmntParams.VisitTypeId == 10 || AppmntParams.VisitTypeId == 11 || AppmntParams.VisitTypeId == 28 || AppmntParams.VisitTypeId == 29) {
                AppmntParams.SendDocSms = false;
                AppmntParams.SendPatientSms = false;
                AppmntParams.IsOnboadringUrlInd = false;
                AppmntParams.SendPatientEmail = false;
            }
        } else if (CurrentEnvironment == "https://portal.ehnote.com" || CurrentEnvironment == "https://stage.ehnote.com") {
            if (selectedPatientLanguageId !== 0) {  // selected Language by Patient
                AppmntParams.SmsLanguageId = selectedPatientLanguageId;
            }
            if (AppmntParams.DoctorVisitRsnID == "4" || AppmntParams.DoctorVisitRsnID == "7") {  // Only for Tec
                AppmntParams.IsOnboadringUrlInd = false;
                AppmntParams.SendDocSms = false;
                AppmntParams.SendPatientSms = false;
                AppmntParams.SendPatientEmail = false;
            }
        }

        $scope.FinalAppointmentCancel(AppmntParams);

    };

    $scope.FinalAppointmentCancel = function (AppmntParams) {
        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {
            alertify.success("Appointment Cancelled Successfully");

            $scope.cancelAppPopup = false;
            $scope.showEditAppointmentID = true;
           
            $scope.CancelAppointmentobj.sendPatientEmail = false;
            $scope.CancelAppointmentobj.sendDocSms = false;
            $scope.CancelAppointmentobj.sendPatientSms = false;
            $scope.CancelAppointmentobj.sendDocEmail = false;

            $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
            $scope.CommunicationdetailsArray = $scope.UserSettingObject.CommunicationsSettings;

            if ($scope.CommunicationdetailsArray !== undefined && $scope.CommunicationdetailsArray.length > 0) {
                angular.forEach($scope.CommunicationdetailsArray, function (item, index) {
                    if (item.Mode === 'doctor') {
                        $scope.CancelAppointmentobj.sendDocSms = item.SmsSettingsObj.Appointment;
                        $scope.CancelAppointmentobj.sendDocEmail = item.EmailSettingObj.Appointment;
                    }
                    if (item.Mode === 'patient') {
                        $scope.CancelAppointmentobj.sendPatientSms = item.SmsSettingsObj.Appointment;
                        $scope.CancelAppointmentobj.sendPatientEmail = item.EmailSettingObj.Appointment;
                    }
                });
            }
            //if (data.response.TokenNumber) {
            //    $scope.Token = data.response.TokenNumber;
            //}
            $uibModalInstance.close(data);
        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Cancelling Appointment");
        }
    }
}]);
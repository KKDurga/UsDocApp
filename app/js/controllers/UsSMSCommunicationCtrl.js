"use strict";
eHnoteWebApp.controller("UsSMSCommunicationCtrl", ["$scope", "localStorageFactory", "CmsUtilites", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteMainAppointmentService", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserDataService", "$filter", "eHnoteInsuranceService", "$uibModal", "$rootScope", "$timeout", "$window", "eHnotePatientVisitReasonServices", "eHnoteUserAppointmentDataService", "alertify", 'eHnoteAdminDepartmentService', 'eHnoteAuditServices', 'eHnoteSettingsDataService', function ($scope, localStorageFactory, CmsUtilites, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteMainAppointmentService, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserDataService, $filter, eHnoteInsuranceService, $uibModal, $rootScope, $timeout, $window, eHnotePatientVisitReasonServices, eHnoteUserAppointmentDataService, alertify, eHnoteAdminDepartmentService, eHnoteAuditServices, eHnoteSettingsDataService) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = '';
    $scope.ParentHospitalId = '';
    $scope.PreviousUrl = "/op";
    $scope.AgentStatusId = 0;
    if (doctorInfo !== undefined) {
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId || 0;
        }
    }
    $scope.GetSMSCommunicationObj = function () {
        return {
            "FromDate": "",
            "ToDate": "",
            "OrganizationId": "",
            "HideFromDateInd": false,
            "HideToDateInd": false
        }
    }

    $scope.SMSCommunicationObj = $scope.GetSMSCommunicationObj();
    $scope.GetSMSCommunicationListObj = function () {
        return {
            "AllAppointmentCount": 0,
            "ConfirmAppointmentCount": 0,
            "RescheduledAppointmentCount": 0,
            "CancelledAppointmentCount": 0,
            "NeedAssistanceAppointmentCount": 0,
            "AppointmentList": [],
            "FrontendAppointmentList": []
        }
    }
    $scope.GetSearchObj = function () {
        return {
            "SearchByName": "",
            "SearchByMobileNo": "",
            "SearchByMrNo": ""
        }
    }
    $scope.SearchObj = $scope.GetSearchObj();
    $scope.SMSCommunicationListObj = $scope.GetSMSCommunicationListObj();
    $scope.GetPatientObj = function () {
        return {
            "PatientName": "",
            "PatientID": "",
            "PatientMrno": "",
            "patientAge": "",
            "PatientGender": "",
            "AppointmentId": "",
            "ApptDate": "",
            "MobileNo": "",
            "Age": "",
            "DoctorId": "",
            "DoctorName": "",
            "Sex": "",
            "VisitReason": "",
            "ApptTime": "",
            "VisitTypeId": "",
            "BookingStatusId": 0,
            "BookingTypeId": 0,
            "AppointmentTypeId": 0,
            "AppointmentStatusId": 0,
            "OrganizationId": $scope.HospitalId,
            "LanguageID": 0,
            "PatientFullName": "",
            "EndTime": "",
            "IsPatientEmailInd": false,
            "IsPatientSmsInd": false,
            "IsTeleMedicineSlot":false,
            "EmailId": "",
            "CommunicationEmailId": "",
            "SubSpecializationId": 0,
            "BranchSubSpecializationId": 0,
            "CheckinStatusId": 0,
            "DoctorEmail": "",
            "AppointmentPatientTypeId": null,
            "PaymentTypeId": null,
            "HospitalId":0,
        }
    }
    $scope.PatientObj = $scope.GetPatientObj();
    $scope.CancelAppointmentobj = {
        "Ispopup": false,
        "CancelAppReason": [],
        "sendDocSms": false,
        "sendPatientSms": false,
        "sendDocEmail": false,
        "sendPatientEmail": false,
        "CancelReason": "",
        "CancelReasonId": 0,
        "OtherCancelReason": "",
        "IsSmsLanguageIdInd": false,
        "SmsLanguageId": ""
    };
    function getnewFollowUpObj() {
        var obj = {
            "PatientReminderId": 0,
            "ReminderDate": "",
            "Type": "Date",
            "DurationType": "D",
            "Duration": "",
            "ReminderRemarks": "",
            "DoctorId": null,
            "VisitTypeId": null,
            "DocObj": "",
            "SearchText": "",
            "VisitReasonName": "",
            "VisitReasonId": null,
            "IsFollowUp": false,
            "ReminderStatusId": 1,
            "ReminderStatus": "To be Worked",
            "IsNotInterestedInd": false,
            "PriorityId": 0,
            "PriorityName": '',
            "IsFromCRMSmsTabInd":true
        };
        return obj;
    }
    $scope.FollowUpObj = getnewFollowUpObj();
    $scope.MultiselectUserlist = [];
    $scope.MultiselectDoctorlist = [];
    $scope.ApptObj = {
        "HospitalEquipmentId": 0, "VisitTypeId": 0,
        "AppointmentTypeId": 1
    };
    $scope.searchHospital = {
        "visitRsnName": "",
        "apptTypename": "",
        "PatientStatusName": "",
        "AgentStatusName": "",
        "UserFullName": ""
    };
    $scope.AllstatusListCheck = {
        "AllVisitReasonsCheck": "",
        "AllPatientStatusCheck": "",
        "AllAgentstatusCheck": "",
        "Alluserscheck": "",
        "AllDoctorscheck": ""
    }
    $scope.SmsFacilityObj = {
        "SelectStatusString": "All",
        "Name": "",
        "AllStatusCheck": true
    };
    $scope.selectedVisitReason = 'All Visit Reasons';
    $scope.selectedPatientstatus = 'All Patient Status';
    $scope.selectedAgentstatus = 'All Agent Status';
    $scope.selectedUserName = 'All Users';
    $scope.selectedDoctorName = 'All Doctors';
    $scope.PatientReponcestatusList = [
        {
            "statusid": 1,
            "statusname": "Confirmed",
            "isChecked": false
        },
        {
            "statusid": 2,
            "statusname": "Reschedule",
            "isChecked": false
        },
        {
            "statusid": 3,
            "statusname": "Cancelled",
            "isChecked": false
        },
        {
            "statusid": 4,
            "statusname": "Need Assistance",
            "isChecked": false
        },
        {
            "statusid": 5,
            "statusname": "Not Respond",
            "isChecked": false
        },
    ]
    $scope.AgentstatusList = [
        {
            "statusid": 1,
            "statusname": "To be Worked",
            "isChecked": false
        },
        {
            "statusid": 2,
            "statusname": "Not Interested",
            "isChecked": false
        },
        {
            "statusid": 3,
            "statusname": "Booked",
            "isChecked": false
        },
        {
            "statusid": 4,
            "statusname": "Cancelled",
            "isChecked": false
        },
        {
            "statusid": 5,
            "statusname": "Follow-up",
            "isChecked": false
        },
        {
            "statusid": 6,
            "statusname": "Rescheduled",
            "isChecked": false
        },
    ]
    $scope.ChangeAllvalues = function () {
        if ($scope.PatientReponcestatusList.length > 0) {
            angular.forEach($scope.PatientReponcestatusList, function (item) {
                item.isChecked = true;
            })
        }
        if ($scope.AgentstatusList.length > 0) {
            angular.forEach($scope.AgentstatusList, function (item) {
                item.isChecked = true;
            })
        }
        if ($scope.Visitreasons.length > 0) {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            })
        }

        let checkedArray1 = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllstatusListCheck.AllVisitReasonsCheck = checkedArray1.length > 0 && $scope.Visitreasons.length === checkedArray1.length ? true : false;
        let checkedArray2 = _.where($scope.AgentstatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllAgentstatusCheck = checkedArray2.length > 0 && $scope.AgentstatusList.length === checkedArray2.length ? true : false;
        let checkedArray3 = _.where($scope.PatientReponcestatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllPatientStatusCheck = checkedArray3.length > 0 && $scope.PatientReponcestatusList.length === checkedArray3.length ? true : false;

    }
    $scope.Visitreasons = [];

    $scope.GetVisitReasons = function (id) {
        id = id || 0;
        var Org_id = 0;
        if (id == 0) {
            Org_id = $scope.HospitalId;
        } else {
            Org_id = id;
        }
        var getParams = {
            "OrganizationId": Org_id,
            "UserId": $scope.UserId || 0,
            "VisitTypeId": 0,
            "visitReasonSearch": "",
            "PageNumber": 1,
            "PageSize": 1000,
            "IsFrequent": "N"
        };
        //eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
        eHnotePatientVisitReasonServices.GetOrganizationActiveAndInActiveApptVisitReasons(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    //$scope.GetVisitReasonsArray = resp.data.rows || [];
                    $scope.GetVisitReasonsArray = [];
                    $scope.GetVisitReasonsArray = resp.data.rows;
                    $scope.Visitreasons = angular.copy($scope.GetVisitReasonsArray);
                    angular.forEach($scope.Visitreasons, function (item) {
                        item.isChecked = true;
                    });
                }
            }
        });
    };

    $scope.IsdiasibleActionsInd = false;
    $scope.FollowUpApptList = [];
    $scope.GetFollowuplist = function (item) {
        var req = {
            "AppointmentId": item.AppointmentId || 0,
            "PatientId": item.PatientId || 0,
            "OrganizationId": $scope.HospitalId || 0,
            "ReminderTypeId": 3
        }
        eHnoteMainAppointmentService.GetSMSFollowuplist(req).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.FollowUpApptList = resp.data.rows || [];
                if ($scope.FollowUpApptList.length > 0) {
                    $scope.FollowupCount = 0;
                    $scope.IsdiasibleActionsInd = true;
                    //angular.forEach($scope.FollowUpApptList, function (item) {
                    //    if (item.ReminderStatusId == 4) {
                    //        $scope.FollowupCount++;
                    //    }
                    //    if (item.ReminderStatusId == 5 || item.ReminderStatusId == 3) {
                    //        $scope.IsdiasibleActionsInd = true;
                    //    }
                    //});
                    //if ($scope.FollowupCount >= 3) {
                    //    $scope.IsdiasibleActionsInd = true;
                    //}
                }
                else {
                    $scope.IsdiasibleActionsInd = false;
                }
            }
        });
    }
    $scope.crmrescheduledpopup = function (PatientItem) {
        $scope.modalpopup1 = $uibModal.open({
            "templateUrl": "templates/uibpopups/crmcommunicationsrescheduledpopup.html",
            // "size": "lg",
            "scope": $scope,
            "windowClass": "modal__eighty--",
            "backdrop": "static",
            "keyboard": false,
        });
        console.log($scope.PatientObj);
        $scope.PatientObj.PatientName = PatientItem.PatientName || "";
        $scope.PatientObj.S3URL = PatientItem.S3URL || "";
        $scope.PatientObj.patientAge = "";
        $scope.PatientObj.PatientMrno = PatientItem.MrNo || "";
        $scope.PatientObj.AppointmentId = PatientItem.AppointmentId || "";
        $scope.PatientObj.ApptDate = PatientItem.ApptDate || "";
        $scope.PatientObj.MobileNo = PatientItem.MobileNo || "";
        $scope.PatientObj.PatientId = PatientItem.PatientId || "";
        $scope.PatientObj.Age = PatientItem.AgeInYears + 'Y ' + PatientItem.AgeInMonths + 'M';
        $scope.PatientObj.DOB = PatientItem.DOB || "";
        $scope.PatientObj.DoctorId = PatientItem.DoctorId || "";
        $scope.PatientObj.DoctorName = PatientItem.DoctorName || "";
        $scope.PatientObj.Sex = PatientItem.Sex || "";
        $scope.PatientObj.VisitReason = PatientItem.VisitReason || "";
        $scope.PatientObj.ApptTime = PatientItem.StartTime || "";
        $scope.PatientObj.SMSRespondingData = PatientItem.ReplyText || "";
        $scope.PatientObj.VisitTypeId = PatientItem.VisitTypeId || 0;
        $scope.PatientObj.BookingTypeId = PatientItem.BookingTypeId || 0;
        $scope.PatientObj.BookingStatusId = PatientItem.BookingStatusId || 0;
        $scope.PatientObj.AppointmentTypeId = PatientItem.AppointmentTypeId || 0;
        $scope.PatientObj.AppointmentStatusId = PatientItem.AppointmentStatusId || 0;
        $scope.PatientObj.DoctorId = PatientItem.DoctorId || 0;
        $scope.PatientObj.PatientDisplayId = PatientItem.PatientDisplayId || '';
        $scope.PatientObj.LanguageID = PatientItem.LanguageID || 0;
        $scope.PatientObj.PatientFullName = PatientItem.FullName || "";
        $scope.PatientObj.EndTime = PatientItem.EndTime || "";
        $scope.PatientObj.IsPatientEmailInd = PatientItem.IsPatientEmailInd || false;
        $scope.PatientObj.IsPatientSmsInd = PatientItem.IsPatientSmsInd || false;
        $scope.PatientObj.IsTeleMedicineSlot = PatientItem.IsTeleMedicineSlot || false;
        $scope.PatientObj.EmailId = PatientItem.EmailId || "";
        $scope.PatientObj.CommunicationEmailId = PatientItem.CommunicationEmailId || "";
        $scope.PatientObj.SubSpecializationId = PatientItem.SubSpecializationId || 0;
        $scope.PatientObj.BranchSubSpecializationId = PatientItem.BranchSubSpecializationId || 0;
        $scope.PatientObj.CheckinStatusId = PatientItem.CheckinStatusId || 0;
        $scope.PatientObj.DoctorEmail = PatientItem.DoctorEmail || "";
        $scope.PatientObj.AppointmentPatientTypeId = PatientItem.AppointmentPatientTypeId || null;
        $scope.PatientObj.PaymentTypeId = PatientItem.PaymentTypeId || null;
        $scope.PatientObj.HospitalId = PatientItem.HospitalId || 0;

        $scope.IsdiasibleActionsInd = false;
        // $scope.PatientObj.SMSRespondingData = PatientItem.SMSRespondingData || "";
        $scope.GetFollowuplist($scope.PatientObj);
        $scope.AgentStatusId = 0;
        $scope.FollowUpObj = getnewFollowUpObj();
        $scope.FollowUpObj.PriorityId = 1;
        $scope.FollowUpObj.PriorityName = "HIGH";

        $scope.patiendetilsopen = function () {
            let patientId = $scope.PatientObj.PatientId || 0;
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
    }
    $scope.changeReminderType1 = function () {
        $scope.FollowUpObj.DurationType = 'D';
        $scope.FollowUpObj.Duration = '';
        $scope.FollowUpObj.ReminderRemarks = '';
        $scope.FollowUpObj.ReminderDate = '';
    }

    $scope.uibclose = function () {
        $scope.modalpopup1.dismiss("cancel");
    }
    $scope.uibclose2 = function () {
        $scope.modalpopup2.dismiss("cancel");
    }
    $scope.RespondingData = 0;
    $scope.GetSMSAppointCountwithList = function (RespondingID) {
        let FromDate = $filter('date')(new Date($scope.SMSCommunicationObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.SMSCommunicationObj.ToDate), "yyyy-MM-dd");
        $scope.RespondingData = RespondingID || 0;
        var newlist1 = "";
        for (var i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }
        var newlist2 = "";
        for (var i in $scope.PatientReponcestatusList) {
            if ($scope.PatientReponcestatusList[i].isChecked) {
                newlist2 += "," + $scope.PatientReponcestatusList[i].statusid;
            }
        }
        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }
        var newlist3 = "";
        for (var i in $scope.AgentstatusList) {
            if ($scope.AgentstatusList[i].isChecked) {
                newlist3 += "," + $scope.AgentstatusList[i].statusid;
            }
        }
        if (newlist3.charAt(0) === ",") {
            newlist3 = newlist3.slice(1);
        }
        var newlist4 = "";
        for (var i in $scope.MultiselectUserlist) {
            if ($scope.MultiselectUserlist[i].isChecked) {
                newlist4 += "," + $scope.MultiselectUserlist[i].DoctorID;
            }
        }
        if (newlist4.charAt(0) === ",") {
            newlist4 = newlist4.slice(1);
        }
        var newlist5 = "";
        for (var i in $scope.MultiselectDoctorlist) {
            if ($scope.MultiselectDoctorlist[i].isChecked) {
                newlist5 += "," + $scope.MultiselectDoctorlist[i].DoctorID;
            }
        }
        if (newlist5.charAt(0) === ",") {
            newlist5 = newlist5.slice(1);
        }

        //var newlist12 = "";
        //for (var i in $scope.FacilityList) {
        //    if ($scope.FacilityList[i].IsChecked) {
        //        newlist12 += "," + $scope.FacilityList[i].OrganizationFacilityId;
        //    }
        //}
        //if (newlist12.charAt(0) === ",") {
        //    newlist12 = newlist12.slice(1);
        //}

        var Locationids = '';
        if ($scope.GetAllIndicator == 1 || $scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            Locationids = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            Locationids = $scope.AppListselectedclinic.ClinicId;
        }

        var req = {
            "FromDate": FromDate || "",
            "ToDate": ToDate || "",
            "OrganizationId": $scope.HospitalId || 0,
            "SMSRespondingData": $scope.RespondingData,
            "VisitReasonIdList": newlist1 || "",
            "SMSRespondingIdList": newlist2 || "",
            "ReminderStatusIdList": newlist3 || "",
            // "UsersList": newlist4||"",
            "DoctorList": newlist5 || "",
            "Locationids": Locationids || '',
            /*"FacilityListIds": ''*/
        }
        eHnoteMainAppointmentService.GetSMSAppointCountwithList(req).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.SMSCommunicationListObj.AllAppointmentCount = resp.data.AllAppointmentCount || 0;
                $scope.SMSCommunicationListObj.ConfirmAppointmentCount = resp.data.ConfirmAppointmentCount || 0;
                $scope.SMSCommunicationListObj.RescheduledAppointmentCount = resp.data.RescheduledAppointmentCount || 0;
                $scope.SMSCommunicationListObj.CancelledAppointmentCount = resp.data.CancelledAppointmentCount || 0;
                $scope.SMSCommunicationListObj.NeedAssistanceAppointmentCount = resp.data.NeedAssistanceAppointmentCount || 0;
                $scope.SMSCommunicationListObj.NotRespondAppointmentCount = resp.data.NotRespondAppointmentCount || 0;
                $scope.SMSCommunicationListObj.AppointmentList = resp.data.rows || [];
                $scope.SMSCommunicationListObj.FrontendAppointmentList = resp.data.rows || [];
                if ($scope.SMSCommunicationListObj.FrontendAppointmentList.length > 0) {
                    angular.forEach($scope.SMSCommunicationListObj.FrontendAppointmentList, function (item) {
                        if (item.MobileNo != '') {
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.MobileNo);
                            item.FormatedMobileNo = obj.UsFormatMobileNumber;
                        }
                    })
                }
            }
        });
    }
    $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
    $scope.GetTodayDate = function (type) {
        var todaydate = $filter('date')(new Date(), "MM-dd-yyyy");
        if (type == 1) {
            $scope.SMSCommunicationObj.FromDate = todaydate;
            $scope.SMSCommunicationObj.HideFromDateInd = false;
        }
        if (type == 2) {
            $scope.SMSCommunicationObj.ToDate = todaydate;
            $scope.SMSCommunicationObj.HideToDateInd = false;
        }
        $scope.GetSMSAppointCountwithList();
    }
    function InitializeBranches(data, pagetype) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
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
        $scope.BranchesListArray = clinicAddress;
        $scope.AppListdoctoraddress = clinicAddress;
        $scope.AppListselectedclinic = $scope.BranchesListArray[0];
        
        $scope.clinicDoctorList = [];

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];
        $scope.AppListselectedclinic = $scope.defaultbranch[0];
    }
    $scope.GetAllIndicator = 0;
    
    $scope.init = function () {
        $scope.SMSCommunicationObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.SMSCommunicationObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        let SubOrganizationId = $scope.SubOrganizationId || 0;
        let HospitalId = $scope.HospitalId || 0;
        GetBranchSubSpecializations(SubOrganizationId, HospitalId, '');
        getallusers($scope.HospitalId);
        $scope.GetVisitReasons();
        $scope.ChangeAllvalues();
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
       
        $timeout(function () {
            $scope.GetSMSAppointCountwithList();
            $scope.GetMasterData();
        }, 500);
    }
    $scope.init();
    $scope.GetMasterData = function () {
        eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.MasterPriority.length > 0) {
                    $scope.MasterPriority = resp.data.MasterPriority || [];
                }
            }
        });
    }
    $scope.OnChangePrority = function (item) {
        $scope.FollowUpObj.PriorityId = item.PriorityId || 0;
        $scope.FollowUpObj.PriorityName = item.PriorityName || '';
    }
    $scope.openAppointmentPopup = function (openBookAppt, ttype) {
        $scope.PageName = "book";
        $rootScope.appointment_type = "1";
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.AppDate = "";
        $scope.ispatientExistsval = false;
        $scope.calenderDate = undefined;
        var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid
        };

        if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorInfo.RoleID === 1 || doctorInfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);

            var doctorID1 = {
                "DoctorID": 0
            };
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID1);
        }

        datapersistanceFactory.set('appointmentinfo', "");
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentStatus = "B";
        appointmentInfo.BillingId = 0;
        appointmentInfo.showAllHospitalsinAppList = false;
        appointmentInfo.showTeleBookingAccess = false;
        appointmentInfo.showNormalBookingAccess = true;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);


        if ($scope.SpecializationId === 2) {
            $scope.PageName = "directFollowup";
        }
        if ($scope.Tab === 'teleappointments') {
            $rootScope.Consulatation_type = true;
        }
        if ($scope.Tab === 'appointments') {
            $rootScope.Consulatation_type = false;
        }
        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": undefined,
            "AppointmentId": null,
            "type": '',
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        // openAppPopup();
        if (ttype == 2) {
            BookApptPopupOpenedv2(openBookAppt);
        } else {
            BookApptPopupOpened(openBookAppt);
        }
    };
    function BookApptPopupOpened(openBookAppt) {
        var openBookAppt = openBookAppt || "";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopupv3.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": "UsBookAppointmentPopupv2",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; },
                "BranchList": function () { return $scope.BranchesListArray || []; }
            }
        });
        $scope.bookapptSetupPopUp.result.then(function (resp) {
            resp.response = resp.response || "";
            resp.response.VisitReasonId = resp.VisitReasonId || 0;
            resp.response.VisitReasonName = resp.VisitReasonName || 0;
            $scope.AgentStatusUpdate(resp.response);
        }, function () { });
        /*   $scope.uibclose();*/
    }

    function BookApptPopupOpenedv2(openBookAppt) {
        var openBookAppt = openBookAppt || "";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopupv3.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": "UsBookAppointmentPopupv2",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; },
                "BranchList": function () { return $scope.BranchesListArray || []; }
            }
        });
        $scope.bookapptSetupPopUp.result.then(function (resp) {
            var getresp = eHnoteMasterDataService.getSMSBookAppt();
               console.log(getresp);
            if (Object.keys(getresp).length > 0) {
                getresp.response = getresp.response || {};
                getresp.response.VisitReasonId = getresp.VisitReasonId || 0;
                getresp.response.VisitReasonName = getresp.VisitReasonName || 0;
                $scope.AgentStatusUpdate(getresp.response);
            } else {
                console.log("Agent doesn't do any action");
            }
        }, function () { });
    }
    $scope.AddFollowUp = function () {
        var ReminderStatusId = 0;
        var ReminderStatus = "";
        var Remarks = "";
        if ($scope.FollowUpObj.IsFollowUp) {
            var SelectedDate = $filter("date")($scope.FollowUpObj.ReminderDate, "yyyy-MM-dd") || null;
            var SelectedDurationToDate = $filter("date")($scope.FollowUpObj.DurationDate, "yyyy-MM-dd") || null;

            if ($scope.FollowUpObj.ReminderDate == "" && $scope.FollowUpObj.Duration == "") {
                alertify.error("Please Select Reminder Date or Duration ");
                return;
            }

            if ($scope.FollowUpObj.DoctorId == null) {
                alertify.error("Please Select Doctor!");
                return;
            }

            if ($scope.FollowUpObj.VisitTypeId == null) {
                alertify.error("Please Select visit reason!");
                return;
            }

            if ($scope.FollowUpObj.ReminderRemarks == "") {
                alertify.error("Please enter remarks!");
                return;
            }
            var ReminderStatusId = 5;
            var ReminderStatus = "Follow-up";
            Remarks = $scope.FollowUpObj.ReminderRemarks;
        }
        if ($scope.FollowUpObj.IsNotInterestedInd) {
            if ($scope.FollowUpObj.NotInterestedRemarks == "") {
                alertify.error("Please Select Reminder Remarks");
                return;
            }
            ReminderStatusId = 5;
            ReminderStatus = "Not Interested";
            Remarks = angular.copy($scope.FollowUpObj.NotInterestedRemarks);
            var SelectedDate = $filter("date")(new Date(), "yyyy-MM-dd") || null;
        }
        let obj = {
            "UserId": $scope.UserId,
            "PatientAppointmentReminderId": 0,
            "HospitalId": $scope.HospitalId,
            "PatientId": $scope.PatientObj.PatientId || 0,
            "AppointmentId": $scope.PatientObj.AppointmentId || 0,
            "Type": $scope.FollowUpObj.Type,
            "Date": SelectedDate || SelectedDurationToDate || null,
            "DurationType": $scope.FollowUpObj.DurationType,
            "Duration": null,
            "Remarks": Remarks,
            "DoctorId": $scope.FollowUpObj.DoctorId || null,
            "VisitTypeId": $scope.FollowUpObj.VisitTypeId || null,
            "ReminderTypeID": 3,
            "ReminderType": "SMS Remainder",
            "ReminderStatusId": ReminderStatusId,
            "ReminderStatus": ReminderStatus,
            "DeleteInd": "N",
            "IsFrom": "CRM"
        }
        eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                alertify.success("FollowUp added successfully!");
                $scope.GetSMSAppointCountwithList();
                $scope.uibclose();
            }
        }, function (err) {
            alertify.error("Getting Failed");
        });
    };
    // agent status 
    $scope.AgentStatusUpdate = function (item) {
        var AgentStatus = "";
        var Remarks = "";
        var SelectedDate = "";
        var SelectedDurationToDate = "";
        if ($scope.AgentStatusId == 2) {    //not interested
            if ($scope.FollowUpObj.IsNotInterestedInd) {
                if ($scope.FollowUpObj.NotInterestedRemarks == "") {
                    alertify.error("Please Select Reminder Remarks");
                    return;
                }
                AgentStatus = "Not Interested";
                Remarks = angular.copy($scope.FollowUpObj.NotInterestedRemarks);
                //var SelectedDate = $filter("date")(new Date(), "yyyy-MM-dd") || null;
                var SelectedDate = "";
                $scope.FollowUpObj.VisitTypeId = $scope.PatientObj.VisitTypeId || "";
            }
        }
        if ($scope.AgentStatusId == 3) {    // booking
            AgentStatus = "Booked";
            $scope.PatientObj.DoctorId = item.DoctorID;
            $scope.FollowUpObj.VisitTypeId = item.VisitReasonId;
            SelectedDate = $filter("date")(item.ConsultationDt, "yyyy-MM-dd") || null;
        }
     
        if ($scope.AgentStatusId == 4) {    // cancel
            AgentStatus = "Cancel";
            Remarks = item.CancelReason + "," + item.OtherCancelReason;
            $scope.FollowUpObj.VisitTypeId = item.VisitReasonId;
            // $scope.PatientObj.DoctorId = item.DoctorID;
            // SelectedDate = $filter("date")(item.ConsultationDt, "yyyy-MM-dd") || null;
        }
        if ($scope.AgentStatusId == 5) {    // follow up
            if ($scope.FollowUpObj.IsFollowUp) {
                SelectedDurationToDate = $filter("date")($scope.FollowUpObj.DurationDate, "yyyy-MM-dd") || null;
                if ($scope.FollowUpObj.ReminderDate == "" && $scope.FollowUpObj.Duration == "") {
                    alertify.error("Please Select Reminder Date or Duration ");
                    return;
                }
                if ($scope.FollowUpObj.DoctorId == null) {
                    alertify.error("Please Select Doctor!");
                    return;
                }
                if ($scope.FollowUpObj.VisitTypeId == null) {
                    alertify.error("Please Select visit reason!");
                    return;
                }
                if ($scope.FollowUpObj.ReminderRemarks == "") {
                    alertify.error("Please enter remarks!");
                    return;
                }
                if ($scope.FollowUpObj.PriorityId == 0) {
                    alertify.error("Please enter remarks!");
                    return;
                }
                AgentStatus = "Follow-up";
                if ($scope.FollowUpObj.Duration != '') {
                    var presentDay = new Date(); // Get current date
                    if ($scope.FollowUpObj.DurationType === 'D') {
                        let Dayvalue = ($scope.FollowUpObj.Duration * 1)
                        presentDay.setDate(presentDay.getDate() + Dayvalue); // Add 1 day
                    } else if ($scope.FollowUpObj.DurationType === 'W') {
                        let Weekvalue = ($scope.FollowUpObj.Duration * 7)
                        presentDay.setDate(presentDay.getDate() + Weekvalue); // Add 7 days (1 week)
                    } else if ($scope.FollowUpObj.DurationType === 'M') {
                        let Monthvalue = ($scope.FollowUpObj.Duration * 1)
                        presentDay.setMonth(presentDay.getMonth() + Monthvalue); // Add 1 month
                    } else if ($scope.FollowUpObj.DurationType === 'Y') {
                        let Yearvalue = ($scope.FollowUpObj.Duration * 1);
                        presentDay.setFullYear(presentDay.getFullYear() + Yearvalue); // Add years
                    }
                    var futureDate = presentDay.toISOString().slice(0, 10);
                    $scope.futureDate = angular.copy(futureDate);
                    if ($scope.futureDate != "") {
                        SelectedDate = $filter("date")($scope.futureDate, "yyyy-MM-dd") || null;
                    }
                }

                if ($scope.FollowUpObj.ReminderDate != "") {
                    SelectedDate = $filter("date")($scope.FollowUpObj.ReminderDate, "yyyy-MM-dd") || null;
                }
                Remarks = $scope.FollowUpObj.ReminderRemarks;
            }
        }
        if ($scope.AgentStatusId == 6) {    // reschedule
            AgentStatus = "Rescheduled";
            $scope.PatientObj.DoctorId = item.DoctorID;
            $scope.FollowUpObj.VisitTypeId = item.VisitReasonId;
            SelectedDate = $filter("date")(item.ConsultationDt, "yyyy-MM-dd") || null;
        }
        let req = {
            "UserId": $scope.UserId,
            "PatientAppointmentReminderId": 0,
            "HospitalId": $scope.HospitalId,
            "PatientId": $scope.PatientObj.PatientId || 0,
            "AppointmentId": $scope.PatientObj.AppointmentId || 0,
            "Type": 'Date',
            "Date": SelectedDate || null,
            "DurationType": $scope.FollowUpObj.DurationType || "",
            "Duration": SelectedDurationToDate || null,
            "Remarks": Remarks || "",
            "DoctorId": $scope.PatientObj.DoctorId || null,
            "VisitTypeId": $scope.FollowUpObj.VisitTypeId || "",
            "ReminderTypeID": 3,
            "ReminderType": "SMS Remainder",
            "ReminderStatusId": $scope.AgentStatusId,
            "ReminderStatus": AgentStatus,
            "DeleteInd": "N",
            "IsFrom": "CRM",
            "PriorityId": $scope.FollowUpObj.PriorityId,
            "PriorityName": $scope.FollowUpObj.PriorityName,
        }
        eHnoteMainAppointmentService.AddSetRemainderDetails(req).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                $scope.GetSMSAppointCountwithList(0);
                $scope.uibclose();
            }
        }, function (err) {
            alertify.error("Getting Failed");
        });
    }
    $scope.ClearDuration1 = function () {
        //  $scope.FollowUpObj.Duration = "";
        console.log('clearing info ');
    };
    // serach functionality start
    $scope.changePatientApptSearchText = function (text, type) {
        $timeout(function () {
            if (type == 1) {
                if (text === "" || text === undefined) {
                    $scope.SMSCommunicationListObj.FrontendAppointmentList = angular.copy($scope.SMSCommunicationListObj.AppointmentList);
                } else {
                    $scope.SMSCommunicationListObj.FrontendAppointmentList = $filter("filter")($scope.SMSCommunicationListObj.AppointmentList, { "PatientName": text }) || [];
                }
            }
            if (type == 2) {
                if (text === "" || text === undefined) {
                    $scope.SMSCommunicationListObj.FrontendAppointmentList = angular.copy($scope.SMSCommunicationListObj.AppointmentList);
                } else {
                    $scope.SMSCommunicationListObj.FrontendAppointmentList = $filter("filter")($scope.SMSCommunicationListObj.AppointmentList, { "MobileNo": text }) || [];
                }
            }
            if (type == 3) {
                if (text === "" || text === undefined) {
                    $scope.SMSCommunicationListObj.FrontendAppointmentList = angular.copy($scope.SMSCommunicationListObj.AppointmentList);
                } else {
                    $scope.SMSCommunicationListObj.FrontendAppointmentList = $filter("filter")($scope.SMSCommunicationListObj.AppointmentList, { "MrNo": text }) || [];
                }
            }
        }, 50);
    };
    $scope.onChangeSearchAppt = function (text, type) {
        text = text || "";
        if (text === "") {
            $scope.SMSCommunicationListObj.FrontendAppointmentList = angular.copy($scope.SMSCommunicationListObj.AppointmentList);
        }
    }
    $scope.patSearchType = 1;
    $scope.changeradiobtn = function (item, type) {
        $scope.patSearchType = type;
        if (type == "1") {
            $scope.SearchObj.SearchByName = $scope.SearchObj.SearchByName || "";
            $scope.SearchObj.SearchByMobileNo == '';
            $scope.SearchObj.SearchByMrNo == '';
        }
        if (type == "2") {
            $scope.SearchObj.SearchByName = "";
            $scope.SearchObj.SearchByMobileNo == $scope.SearchObj.SearchByMobileNo || '';
            $scope.SearchObj.SearchByMrNo == '';
        }
        if (type == "3") {
            $scope.SearchObj.SearchByName = "";
            $scope.SearchObj.SearchByMobileNo == '';
            $scope.SearchObj.SearchByMrNo == $scope.SearchObj.SearchByMrNo || '';
        }
    }
    // search functionality end 
    $scope.clearvalue = function () {
        $scope.SearchObj.SearchByName = '';
        $scope.SearchObj.SearchByMobileNo = '';
        $scope.SearchObj.SearchByMrNo = '';
        $scope.GetSMSAppointCountwithList();
    }

    // popup events 
    $scope.CancleAppt = function (item) {
        // $scope.uibclose();
        $scope.Patientname = $scope.PatientObj.PatientName || "";
        //$scope.AppointmentDate_Time = $scope.PatientObj.ApptDate || "";
        $scope.DoctorFullName = $scope.PatientObj.DoctorName || "";
        $scope.appDate = $scope.PatientObj.ApptDate;
        $scope.MobileNumber = $scope.PatientObj.MobileNo;
        $scope.ApptStartTime = $scope.PatientObj.ApptTime;
        let combinedDateTime = new Date($scope.appDate + "T" + $scope.ApptStartTime);
        $scope.AppointmentDate_Time = combinedDateTime.toISOString();
        $scope.cancelAppPopup = true;
        $scope.Cancelappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Cancelappointmentinfo.AppointmentID = $scope.PatientObj.AppointmentId;
        $scope.Cancelappointmentinfo.VisitTypeId = $scope.PatientObj.VisitTypeId || "";
        $scope.Cancelappointmentinfo.VisitTypeId = $scope.PatientObj.VisitTypeId || "";
        $scope.CancelAppointmentobj.AppointmentStatusId = $scope.PatientObj.AppointmentStatusId || 0;
        $scope.CancelAppointmentobj.Ispopup = true;
        $scope.CancelAppointmentobj.sendDocSms = false;
        $scope.CancelAppointmentobj.sendPatientSms = false;
        $scope.CancelAppointmentobj.sendDocEmail = false;
        $scope.CancelAppointmentobj.sendPatientEmail = false;
        $scope.CancelAppointmentobj.CancelReason = "";
        $scope.CancelAppointmentobj.OtherCancelReason = "";
        $scope.Cancelappointmentinfo.PatientID = $scope.PatientObj.PatientId || "";
        $scope.GetSetReminderId($scope.Cancelappointmentinfo.PatientID);
        var getParams = {
            //  "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            "PageSize": 100,
            "PageNumber": 1
            //"ReasonTypeId": 2
        };
        $scope.CancelAppointmentobj.CancelAppReason = [];
        //return eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
        return eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {
            if (resp.data !== undefined) {

                if (resp.data.rows.length > 0) {
                    //$scope.CancelAppointmentobj.CancelAppReason = resp.data.rows;
                    $scope.CancelAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                }

                $scope.CancelReasonValue = $scope.CancelAppointmentobj.CancelAppReason;
                //var obj = {
                //    "ReasonId": 1,
                //    "CancelReason": "Others"
                //};
                //$scope.CancelAppointmentobj.CancelAppReason.push(obj);
                $scope.mInstanceEdit = $uibModal.open({
                    "templateUrl": "templates/uibpopups/cancelAppModal.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "md"
                });
            }
        });

    };
    $scope.formatUSNumber = function () {
        if ($scope.MobileNumber != "") {
            var phoneNumberString = $scope.MobileNumber;
            console.log($scope.MobileNumber);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''

            $scope.DisplayNumber = part1 + part2 + part3;

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
    
    $scope.UpdateAppt = function (Cancelform, CancelReasonId, OtherCancelReason) {
        $scope.formatUSNumber();
        var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();

        //var Cancelinfo = CancelReason === "Others" ? OtherCancelReason : CancelReason;
        ////  Cancelinfo = Cancelinfo || "";

        //if (Cancelinfo === '') {
        //    alertify.error('Please Select Reason For Cancellation');
        //    return false;
        //}
        //if (Cancelinfo !== "") {
        //    if (OtherCancelReason === '' || OtherCancelReason == undefined) {
        //        alertify.error('Please Enter Reason for Cancel');
        //        return false;
        //    }
        //}
        if (CancelReasonId !== 0) {
            if ($scope.CancelAppointmentobj.OtherCancelReason === '') {
                alertify.error('Please Enter Reason for Cancel');
                return false;
            }
        }
        if (CancelReasonId == 0) {
            alertify.error('Please Select Reason For Cancellation');
            return false;
        }
        $scope.CancelAppointmentobj.smsCancelReason = $scope.CancelAppointmentobj.CancelReason || "";
        $scope.CancelAppointmentobj.smsOtherCancelReason = OtherCancelReason || "";
        $scope.CanceltmpConsultationDt = $scope.PatientObj.ApptDate || "";

       /* $scope.cancelAppPopup = true;*/
        var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");
        $scope.CancelAppointmentobj.SmsLanguageId = 152;
        if ($scope.CancelAppointmentobj.IsSmsLanguageIdInd == true) {
            $scope.CancelAppointmentobj.SmsLanguageId = 45;
        } else {
            $scope.CancelAppointmentobj.SmsLanguageId = 152;
        }
        var CurrentDate = $filter("date")(new Date(), "yyyy-MM-dd");
        if ($scope.CanceltmpConsultationDt === CurrentDate) {
            if ($scope.CancelAppointmentobj.AppointmentStatusId == 1) {
                $scope.CancelAppointmentobj.AppointmentStatusId = 7;  // Same Day cancel
            } else if ($scope.CancelAppointmentobj.AppointmentStatusId == 2) {
                $scope.CancelAppointmentobj.AppointmentStatusId = 6;   //check-in cancel
            }
        } else {
            $scope.CancelAppointmentobj.AppointmentStatusId = 5;   //planed cancel
        }
        $scope.Cancelappointmentinfo.BookingStatusId = $scope.PatientObj.BookingStatusId || 0;
        $scope.Cancelappointmentinfo.BookingTypeId = $scope.PatientObj.BookingTypeId || 0;
        $scope.Cancelappointmentinfo.AppointmentTypeId = $scope.PatientObj.AppointmentTypeId || 1;
        $scope.Cancelappointmentinfo.PatientID = $scope.PatientObj.PatientId || 0;
        var apptDoctorID = $scope.PatientObj.DoctorId;
        //var AppmntParams = {
        //    "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
        //    "AppointmentStatus": "C",
        //    "StartTime": $scope.CancelStTime,
        //    "EndTime": $scope.CancelEdTime,
        //    "IsFollowUp": false,
        //    "DoctorID": apptDoctorID || 0,
        //    "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
        //    "DayCD": currentdaycode,
        //    "VisitUserTypeID": "OPATIENT",
        //    "OtherVisitRsn": "",
        //    "ConsultationDt": $scope.CanceltmpConsultationDt,
        //    "PatientID": $scope.Cancelappointmentinfo.PatientID,
        //    "UserId": eHnoteMasterDataService.getLoginId(),
        //    "USRType": "DOCTOR",
        //    "DoctorVisitRsnID": $scope.CancelVisitRsnType,
        //    "HospitalDetails": {
        //        "HospitalID": $scope.HospitalId,
        //        "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
        //        "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
        //        "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
        //        "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
        //    },
        //    "CommunicationDetails": {
        //        "PatientName": $scope.Patientname,
        //        "PatientMobile": $scope.MobileNumber,
        //        "DoctorMobile": $scope.DocPHnumber,
        //        "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
        //        "DoctorName": $scope.DoctorFullName,
        //        "AppDate": $scope.appDate,
        //        "AppTime": $scope.TIME,
        //        "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
        //        "AppToken": 0,
        //        "PatientEmail": $scope.EmailId,
        //        "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail || "",
        //        "DoctorEmail": $scope.DoctorEmail,
        //        "HospitalContact": doctorinfo.doctordata.UserAddress[0].MobileNo,
        //        "BrnachAddress": {
        //            "Address1": doctorinfo.doctordata.UserAddress[0].Address1,
        //            "Address2": doctorinfo.doctordata.UserAddress[0].Address2,
        //            "Location": doctorinfo.doctordata.UserAddress[0].Location,
        //            "StateId": doctorinfo.doctordata.UserAddress[0].StateId,
        //            "PinCode": doctorinfo.doctordata.UserAddress[0].PinCode,
        //            "CountryId": doctorinfo.doctordata.UserAddress[0].CountryId,
        //            "CityId": doctorinfo.doctordata.UserAddress[0].CityId,
        //            "DistrictRegion": doctorinfo.doctordata.UserAddress[0].DistrictRegion,
        //            "Latitude": doctorinfo.doctordata.UserAddress[0].Latitude,
        //            "Longitude": doctorinfo.doctordata.UserAddress[0].Longitude
        //        },
        //        "CommunicationEmailId": $scope.DoctorEmail || "", //  $scope.CommunicationEmailId || "",
        //        "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
        //        "DisplayNumber": $scope.DisplayNumber,
        //    },
        //    "PreviousAppointmentTime": "",
        //    "SendDocSms": $scope.CancelAppointmentobj.sendDocSms,
        //    "SendDocEmail": $scope.CancelAppointmentobj.sendDocEmail,
        //    "SendPatientEmail": $scope.CancelAppointmentobj.sendPatientEmail,
        //    "SendPatientSms": $scope.CancelAppointmentobj.sendPatientSms,
        //    "StatusDescription": Cancelinfo.CancelReason,
        //    "PaidFollowup": false,
        //    "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot,
        //    "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
        //    "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
        //    "CurrentTime": CurrentCheckOutTime || null,
        //    "IsCheckedIn": $scope.Cancelappointmentinfo.CheckinStatusId || 1,
        //    "VisitTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null,
        //    "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.AppointmentPatientTypeId || 1,
        //    "CancelReasonId": CancelReason.CancelVisitReasonId,
        //    "PatientSmsLanguageId": 152,
        //    "SmsLanguageId": $scope.CancelAppointmentobj.SmsLanguageId || "",
        //    "BookingStatusId": $scope.Cancelappointmentinfo.BookingStatusId,
        //    "AppointmentStatusId": $scope.CancelAppointmentobj.AppointmentStatusId,
        //    "BookingTypeId": $scope.Cancelappointmentinfo.BookingTypeId,
        //    "DoctorVisitRsnID": $scope.Cancelappointmentinfo.AppointmentTypeId || 1,
        //};
        var AppmntParams =
        {
            "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
            "AppointmentStatus": "C",
            "StartTime": $scope.CancelStTime,
            "EndTime": $scope.CancelEdTime,
            "IsFollowUp": false,
            "DoctorID": apptDoctorID||0,
            "UserBranchId": doctorInfo.doctordata.UserAddress[0].UserBranchId,
            "DayCD": currentdaycode,
            "VisitUserTypeID": "OPATIENT",
            "OtherVisitRsn": "",
            "ConsultationDt": $scope.CanceltmpConsultationDt,
            "PatientID": $scope.Cancelappointmentinfo.PatientID,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": $scope.Cancelappointmentinfo.AppointmentTypeId || 1,
            "HospitalDetails": {
                "HospitalID": $scope.HospitalId,
                "LoginHospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                "ParentHospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
                "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
            },
            "CommunicationDetails": {
                "PatientName": $scope.Patientname,
                "PatientMobile": $scope.MobileNumber,
                "DoctorMobile": $scope.DocPHnumber,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorName": $scope.DoctorFullName,
                "AppDate": $scope.appDate,
                "AppTime": $scope.TIME,
                "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppToken": 0,
                "PatientEmail": $scope.EmailId,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail || "",
                "DoctorEmail": $scope.DoctorEmail,
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
                //"CommunicationEmailId": $scope.DoctorEmail || "", // $scope.CommunicationEmailId || "",
                "CommunicationEmailId": $scope.DoctorEmail,
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
                "DisplayNumber": $scope.DisplayNumber,
            },
            "PreviousAppointmentTime": "",
            "SendDocSms": $scope.CancelAppointmentobj.sendDocSms,
            "SendDocEmail": $scope.CancelAppointmentobj.sendDocEmail,
            "SendPatientEmail": $scope.CancelAppointmentobj.sendPatientEmail,
            "SendPatientSms": $scope.CancelAppointmentobj.sendPatientSms,
            "StatusDescription": OtherCancelReason,
            "PaidFollowup": false,
            "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot,
            "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
            "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
            "CurrentTime": CurrentCheckOutTime || null,
            "IsCheckedIn": $scope.Cancelappointmentinfo.CheckinStatusId || 1,
            "VisitTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null,
            "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.AppointmentPatientTypeId || 1,
            /*"CancelReasonId": CancelReason.CancelVisitReasonId*/
            "CancelReasonId": CancelReasonId,
            "VisitRemarks": $scope.Cancelappointmentinfo.VisitRemarks || "",
            "PaymentTypeId": $scope.Cancelappointmentinfo.PaymentTypeId || 0,
            "IsNoShowAppointment": false,
            "IsConfirmedAppointment": $scope.Cancelappointmentinfo.IsConfirmedAppointment,
            "BookingStatusId": $scope.Cancelappointmentinfo.BookingStatusId,
            "AppointmentStatusId": $scope.CancelAppointmentobj.AppointmentStatusId,
            "BookingTypeId": $scope.Cancelappointmentinfo.BookingTypeId,
            "OtherProviderDoctorID": $scope.Cancelappointmentinfo.OtherProviderDoctorID || 0,
            "SurgeryReferralDoctorId": $scope.Cancelappointmentinfo.SurgeryReferralDoctorId || 0,
            "ReasonTypeId": $scope.Cancelappointmentinfo.ReasonTypeId || 0,
            "PatientSmsLanguageId": $scope.CancelAppointmentobj.LanguageID || 0,
            "SmsLanguageId": $scope.CancelAppointmentobj.SmsLanguageId || 0,
            "ParentAppointmentVisitReasonId": $scope.Cancelappointmentinfo.VisitTypeId || null
        }
        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        Appparams.SmsLanguageId = 123; // english
        var selectedPatientLanguageId = $scope.Cancelappointmentinfo.PatientDetails?.LanguageID || 0;
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
                Appparams.SmsLanguageId = selectedPatientLanguageId;
            }
            if (AppmntParams.DoctorVisitRsnID == "4" || AppmntParams.DoctorVisitRsnID == "7") {  // Only for Tec
                AppmntParams.IsOnboadringUrlInd = false;
                AppmntParams.SendDocSms = false;
                AppmntParams.SendPatientSms = false;
                AppmntParams.SendPatientEmail = false;
            }
        }
        // for testing purpose in stage enviroment 
        //if (AppmntParams.UserId != 322) {
        //    AppmntParams.SendDocSms = false;
        //    AppmntParams.SendPatientSms = false;
        //}
        console.log(AppmntParams);
        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {
            alertify.success("Appointment Cancelled Successfully");
            $scope.cancelAppPopup = false;
            $scope.mInstanceAdd.dismiss("cancel");
            $scope.CancelAppointmentobj.sendDocSms = false;
            $scope.CancelAppointmentobj.sendPatientSms = false;
            $scope.CancelAppointmentobj.sendDocEmail = false;
            $scope.CancelAppointmentobj.sendPatientEmail = false;
            $scope.AgentStatusId = 4;
            var smsCancelReason = $scope.CancelAppointmentobj.smsCancelReason || "";
            var smsOtherCancelReason = $scope.CancelAppointmentobj.smsOtherCancelReason || "";
            var ConsultationDt = data.response.ConsultationDt || "";
            var DoctorID = data.response.DoctorID || "";
            var VisitReasonId = data.VisitReasonId || "";
            var obj = {
                "CancelReason": smsCancelReason,
                "OtherCancelReason": smsOtherCancelReason,
                "ConsultationDt": ConsultationDt,
                "VisitReasonId": VisitReasonId,

            }
            $scope.AgentStatusUpdate(obj);
            $scope.mInstanceAdd.dismiss("cancel");

        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Cancelling Appointment");
        }
    };
    $scope.closeCancelPopup = function () {
        $scope.cancelAppPopup = false;
        $scope.CancelAppointmentobj.Ispopup = false;
        $scope.mInstanceEdit.dismiss('cancel');
    };


    // book appt event 
    $scope.allUserList = [];
    $scope.AllDoctorlist = [];
    function GetBranchSubSpecializations(SubOrganizationId, BranchId, pagetype) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.allUserList = [];
            }
        });
    };

    function getallusers(id) {
        var HospitalId = 0;
        id = id || 0;
        if (id == 0) {
            //HospitalId = $scope.HospitalId;
            var TempArray = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var HospitalId = _.pluck(TempArray, "BranchId").join(",");
        } else {
            HospitalId = id;
        }

        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
        var reqObj = {
            "BranchId": HospitalId,
            "SubSpecializationIdArray": subSplArray
        }
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            $scope.allUserList = [];
            $scope.AllDoctorlist = [];
            $scope.MultiselectDoctorlist = [];
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                $scope.allUserList = _.uniq($scope.allUserList, false, function (p) { return p.DoctorID; });
                if ($scope.allUserList.length > 0) {
                    angular.forEach($scope.allUserList, function (Aitem) {
                        if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                            $scope.AllDoctorlist.push(Aitem);
                            $scope.MultiselectDoctorlist.push(Aitem);
                        }
                    });
                    $scope.MultiselectUserlist = [];
                    angular.forEach($scope.allUserList, function (ritem) {
                        if (ritem.RoleId === 2 || ritem.RoleId === 17 || ritem.RoleId === 62 || ritem.RoleId === 63 || ritem.RoleId === 64 || ritem.RoleId === 65 || ritem.RoleId === 66 || ritem.RoleId === 67 || ritem.RoleId === 68 || ritem.RoleId === 69 || ritem.RoleId === 70 || ritem.RoleId === 71 || ritem.RoleId === 20) {
                            $scope.MultiselectUserlist.push(ritem);
                        }
                    });
                    if ($scope.MultiselectUserlist.length > 0) {
                        angular.forEach($scope.MultiselectUserlist, function (item) {
                            item.isChecked = true;
                        })
                    }
                    if ($scope.MultiselectDoctorlist.length > 0) {
                        angular.forEach($scope.MultiselectDoctorlist, function (item) {
                            item.isChecked = true;
                        })
                    }
                    let checkedArray4 = _.where($scope.MultiselectUserlist, { isChecked: true });
                    $scope.AllstatusListCheck.Alluserscheck = checkedArray4.length > 0 && $scope.MultiselectUserlist.length === checkedArray4.length ? true : false;
                    let checkedArray5 = _.where($scope.MultiselectDoctorlist, { isChecked: true });
                    $scope.AllstatusListCheck.AllDoctorscheck = checkedArray5.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray5.length ? true : false;
                }

            } else {
                alertify.error("No Users Found in Selected Departments");
            }
        }
        function onGetUsersFailure(data) {
        }
    }

    $scope.bookAppointment = function (ttype) {
        $scope.AgentStatusId = 3;
        $scope.ShowPatientListDrop = false;
        $scope.PatientDepositsPopup = "3";
        $scope.PageName = "book";
        $rootScope.appointment_type = "1";

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddress = {
            "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID
        };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid
        };
        if (doctorinfo.RoleID === 43) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);

            var doctorID1 = {
                "DoctorID": 0
            };
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID1);
        }
        $scope.cacheStorageItem.VisitRemarks = $scope.cacheStorageItem.VisitRemarks || "";
        if ($scope.cacheStorageItem.VisitRemarks != "") {
            $scope.cacheStorageItem.VisitRemarks = "";
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        else {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }

        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": undefined,
            "AppointmentId": null,
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
            "PatientId": $scope.PatientObj.PatientId || null,
            'IsComingFrom': 'PatientProfile',
            /* 'type': $scope.PreviousUrl === "/op" ? 'op' : ''    //$scope.cacheStorageItem.type*/
            'type': $scope.PreviousUrl === "/op" ? 'op' : $scope.PreviousUrl === "ASC" ? 'ASC' : ''

        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        var opencallcenterpopup = "";
        if (($scope.userLoginDetails.RoleID === 20 || $scope.userLoginDetails.RoleID === 70) && $scope.PreviousUrl === "/crm") {
            opencallcenterpopup = "crm";
        }
        if (ttype == 2) {
            BookApptPopupOpenedv2(opencallcenterpopup);
        } else {
            BookApptPopupOpened(opencallcenterpopup);
        }
    };
    $scope.RescheduleAppointment = function (item) {

        $scope.PageName = "reschedule";
        $scope.AgentStatusId = 6;

        var Obj = {
            "PageName": "reschedule",
            "AppDate": $scope.AppDate,
            "ispatientExistsval": true,
            "calenderDate": $scope.calenderDate,
            "AppointmentDate": $scope.PatientObj.ApptDate,
            "AppointmentId": $scope.PatientObj.AppointmentId || null,
            "PatientId": $scope.PatientObj.PatientId || null,
            'IsComingFrom': '',
            "DoctorId": null,
            "StartTime": "",
            "EndTime": "",
            'type': 'op',
            "SurgeryList": []
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        /*BookApptPopupOpened();*/
        BookApptPopupOpenedv2();
    };
    $scope.ClearDuration1 = function () {
        $scope.FollowUpObj.Duration = "";
    };
    $scope.ChangeDurationstep1 = function () {
        $scope.BindfollowUpData1($scope.FollowUpObj.DurationType, 'click');
    }

    $scope.OnReminderDocSelect1 = function (obj) {
        $scope.FollowUpObj.DoctorId = obj.DoctorID;
    };


    $scope.onSelectReminderVisitReason1 = function (item) {
        item = item || "";
        if (item.ReasonId !== "") {
            $scope.FollowUpObj.VisitReasonName = item.Reason;
            $scope.FollowUpObj.VisitReasonId = item.ReasonId || 0;
            $scope.FollowUpObj.VisitTypeId = item.ReasonId; // in DB visittypeid means VisitReasonId
        }
    };
    // followUp
    $scope.FollowUpAppt = function (type) {
        if (type == 1) {
            $scope.FollowUpObj.IsNotInterestedInd = false;
            $scope.FollowUpObj.IsFollowUp = true;
            $scope.AgentStatusId = 5;
        }
        if (type == 2) {
            $scope.FollowUpObj.IsNotInterestedInd = true;
            $scope.FollowUpObj.IsFollowUp = false;
            $scope.AgentStatusId = 2;
        }
    }
    //filters


    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.checkAllVisitReasons = function (val) {
        if (val) {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });

            $scope.selectedVisitReason = 'All Visit Reasons';
        } else {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = false;
            });

            $scope.selectedVisitReason = 'All Visit Reasons';
        }
        var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllstatusListCheck.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;
    };

    $scope.VisitRsnToggle = function (item) {
        var checkedArray1 = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllstatusListCheck.AllVisitReasonsCheck = checkedArray1.length > 0 && $scope.Visitreasons.length === checkedArray1.length ? true : false;
        if (checkedArray1.length == 0) {
            $scope.selectedVisitReason = 'All Visit Reasons';
        } else {
            if (checkedArray1.length === 1) {
                $scope.selectedVisitReason = checkedArray1[0].Reason;
            } else {
                $scope.selectedVisitReason = 'All Visit Reasons';
            }
        }
    };

    $scope.PatientstatusnToggle = function (item) {
        var checkedArray1 = _.where($scope.PatientReponcestatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllPatientStatusCheck = checkedArray1.length > 0 && $scope.PatientReponcestatusList.length === checkedArray1.length ? true : false;
        if (checkedArray1.length == 0) {
            $scope.selectedPatientstatus = 'All Patient Status';
        } else {
            if (checkedArray1.length === 1) {
                $scope.selectedPatientstatus = checkedArray1[0].statusname;
            } else {
                $scope.selectedPatientstatus = 'All Patient Status';
            }
        }
    };
    $scope.AgentstatusToggle = function (item) {
        var checkedArray1 = _.where($scope.AgentstatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllAgentstatusCheck = checkedArray1.length > 0 && $scope.AgentstatusList.length === checkedArray1.length ? true : false;
        if (checkedArray1.length == 0) {
            $scope.selectedAgentstatus = 'All Patient Status';
        } else {
            if (checkedArray1.length === 1) {
                $scope.selectedAgentstatus = checkedArray1[0].statusname;
            } else {
                $scope.selectedAgentstatus = 'All Patient Status';
            }
        }
    };
    $scope.checkAgentstatus = function (val) {
        if (val) {
            angular.forEach($scope.AgentstatusList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedAgentstatus = 'All Agent Status';
        } else {
            angular.forEach($scope.AgentstatusList, function (item) {
                item.isChecked = false;
            });

            $scope.selectedAgentstatus = 'All Agent Status';
        }
        var checkedArray = _.where($scope.AgentstatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllAgentstatusCheck = checkedArray.length > 0 && $scope.AgentstatusList.length === checkedArray.length ? true : false;
    };
    $scope.checkPatienttatus = function (val) {
        if (val) {
            angular.forEach($scope.PatientReponcestatusList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedPatientstatus = 'All Patient Status';
        } else {
            angular.forEach($scope.PatientReponcestatusList, function (item) {
                item.isChecked = false;
            });

            $scope.selectedPatientstatus = 'All Patient Status';
        }
        var checkedArray = _.where($scope.PatientReponcestatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllPatientStatusCheck = checkedArray.length > 0 && $scope.PatientReponcestatusList.length === checkedArray.length ? true : false;
    };
    $scope.checkAllUsers = function (val) {
        if (val) {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = true;
            });

            $scope.selectedUserName = 'All Users';
        } else {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = false;
            });

            $scope.selectedUserName = 'All Users';
        }
        var checkedArray = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.AllstatusListCheck.Alluserscheck = checkedArray.length > 0 && $scope.MultiselectUserlist.length === checkedArray.length ? true : false;
    };
    $scope.UsersToggle = function (item) {
        var checkedArray1 = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.AllstatusListCheck.Alluserscheck = checkedArray1.length > 0 && $scope.MultiselectUserlist.length === checkedArray1.length ? true : false;
        if (checkedArray1.length == 0) {
            $scope.selectedUserName = 'All Users';
        } else {
            if (checkedArray1.length === 1) {
                $scope.selectedUserName = checkedArray1[0].UserFullName;
            } else {
                $scope.selectedUserName = 'All Users';
            }
        }
    };
    $scope.checkAllDoctorList = function (val) {
        if (val) {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctorName = 'All Doctors';
        } else {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = false;
            });

            $scope.selectedDoctorName = 'All Doctors';
        }
        var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllstatusListCheck.AllDoctorscheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;
    };
    $scope.DoctorToggle = function (item) {
        var checkedArray1 = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllstatusListCheck.AllDoctorscheck = checkedArray1.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray1.length ? true : false;
        if (checkedArray1.length == 0) {
            $scope.selectedDoctorName = 'All Doctors';
        } else {
            if (checkedArray1.length === 1) {
                $scope.selectedDoctorName = checkedArray1[0].UserFullName;
            } else {
                $scope.selectedDoctorName = 'All Doctors';
            }
        }
    };
    $scope.RefreshInfo = function () {
        if ($scope.PatientReponcestatusList.length > 0) {
            angular.forEach($scope.PatientReponcestatusList, function (item) {
                item.isChecked = true;
            })
        }
        if ($scope.AgentstatusList.length > 0) {
            angular.forEach($scope.AgentstatusList, function (item) {
                item.isChecked = true;
            })
        }
        if ($scope.Visitreasons.length > 0) {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            })
        }
        if ($scope.MultiselectUserlist.length > 0) {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = true;
            })
        }
        if ($scope.MultiselectDoctorlist.length > 0) {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = true;
            })
        }
        let checkedArray1 = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllstatusListCheck.AllVisitReasonsCheck = checkedArray1.length > 0 && $scope.Visitreasons.length === checkedArray1.length ? true : false;
        let checkedArray2 = _.where($scope.AgentstatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllAgentstatusCheck = checkedArray2.length > 0 && $scope.AgentstatusList.length === checkedArray2.length ? true : false;
        let checkedArray3 = _.where($scope.PatientReponcestatusList, { isChecked: true });
        $scope.AllstatusListCheck.AllPatientStatusCheck = checkedArray3.length > 0 && $scope.PatientReponcestatusList.length === checkedArray3.length ? true : false;
        let checkedArray4 = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.AllstatusListCheck.Alluserscheck = checkedArray4.length > 0 && $scope.MultiselectUserlist.length === checkedArray4.length ? true : false;
        let checkedArray5 = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllstatusListCheck.AllDoctorscheck = checkedArray5.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray5.length ? true : false;
        $scope.SMSCommunicationObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.SMSCommunicationObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.selectedVisitReason = 'All Visit Reasons';
        $scope.selectedPatientstatus = 'All Patient Status';
        $scope.selectedAgentstatus = 'All Agent Status';
        $scope.selectedUserName = 'All Users';
        $scope.selectedDoctorName = 'All Doctors';
        $scope.GetSMSAppointCountwithList();
    }
    $scope.ChatHistoryInfo = [];
    $scope.ChatHistory = function (PatientItem) {
        $scope.modalpopup2 = $uibModal.open({
            "templateUrl": "templates/uibpopups/UsSMSChatHistory.html",
            //"size": "md",
            "scope": $scope,
            "windowClass": "modal__eighty--",
            "backdrop": "static",
            "keyboard": false,
        });
        $scope.ChatHistoryInfo = [];
        $scope.PatientObj.PatientName = PatientItem.PatientName || "";
        $scope.PatientObj.patientAge = "";
        $scope.PatientObj.PatientMrno = PatientItem.MrNo || "";
        $scope.PatientObj.AppointmentId = PatientItem.AppointmentId || "";
        $scope.PatientObj.ApptDate = PatientItem.ApptDate || "";
        $scope.PatientObj.MobileNo = PatientItem.MobileNo || "";
        $scope.PatientObj.PatientId = PatientItem.PatientId || "";
        $scope.PatientObj.Age = PatientItem.Age || "";
        $scope.PatientObj.DoctorName = PatientItem.DoctorName || "";
        $scope.PatientObj.Sex = PatientItem.Sex || "";
        $scope.PatientObj.PatientImageS3URL = PatientItem.S3URL || "";
        $scope.PatientObj.PatientDisplayId = PatientItem.PatientDisplayId || "";
        $scope.PatientObj.OrganizationId = PatientItem.OrganizationId || "";


        $scope.patiendetilsopen = function () {
            let patientId = $scope.PatientObj.PatientId  || 0;
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

        var reqobj = {
            "OrganizationId": $scope.PatientObj.OrganizationId  || 0,
            "PatientId": $scope.PatientObj.PatientId || 0,
            "AppointmentId": $scope.PatientObj.AppointmentId || 0,
        }
        eHnoteMainAppointmentService.GetSMSCommunicationHistorybyId(reqobj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.ChatHistoryInfo = resp.data.rows || [];
            }
        });
    }
    $scope.agentSmsLogHistory = {
        templateUrl: 'agentSmsLogHistory.html',
        "scope": $scope
    };
    $scope.ReminderArray = [];
    $scope.CrmAgentWorkHistory = function (item) {
        $scope.ReminderArray = item.ReminderArray || [];
    }
    $scope.UpdateToday = function (type) {

        var todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (type == 1) {
            var date = $filter('date')(new Date($scope.SMSCommunicationObj.FromDate), "yyyy-MM-dd");
            if (date == todaydate) {
                $scope.SMSCommunicationObj.HideFromDateInd = false;
            } else {
                $scope.SMSCommunicationObj.HideFromDateInd = true;
            }
        } else if (type == 2) {
            var date1 = $filter('date')($scope.SMSCommunicationObj.ToDate, "yyyy-MM-dd");
            if (date1 == todaydate) {
                $scope.SMSCommunicationObj.HideToDateInd = false;
            } else {
                $scope.SMSCommunicationObj.HideToDateInd = true;
            }
        }
        if (!eHnoteMainAppointmentService.Is14DaysCount($scope.SMSCommunicationObj.FromDate, $scope.SMSCommunicationObj.ToDate)) {
            alertify.log("More than 14 days not allowed");
            return;
        }

    }
   

    $scope.CancelAppointment = function (item) {

        var MobileNumber = $scope.PatientObj.MobileNo;

        var mobileno = eHnoteUserDataService.UsMobileFormatChange(MobileNumber);
        $scope.DisplayNumber = mobileno.UsFormatMobileNumber;
        var datetime = $scope.PatientObj.ApptDate + "T" + $scope.PatientObj.ApptTime;

        let Obj = {
            "PatientDisplayId": $scope.PatientObj.PatientDisplayId || '',
            "PatientName": $scope.PatientObj.PatientName || '',
            "S3URL": $scope.PatientObj.S3URL  || '',
            "PatientID": $scope.PatientObj.PatientId || 0,
            "AppointmentID": $scope.PatientObj.AppointmentId || 0,
            "AppointmentDateTime": datetime || '',
            "ConsultationDt": $scope.PatientObj.ApptDate || '',
            "DoctorFullName": $scope.PatientObj.DoctorName || '',
            "PatientFullName": $scope.PatientObj.PatientFullName || '',
            "AppointmentStatusId": $scope.PatientObj.AppointmentStatusId || 0,
            "CancelStTime": $scope.PatientObj.ApptTime || '',
            "CancelEdTime": $scope.PatientObj.EndTime || '',
            "sendPatientSms": $scope.PatientObj.IsPatientSmsInd || false,
            "sendPatientEmail": $scope.PatientObj.IsPatientEmailInd || false,
            "DoctorID": $scope.PatientObj.DoctorId || 0,
            "DoctorVisitRsnID": $scope.PatientObj.AppointmentTypeId || 0,
            "MobileNumber": MobileNumber || 0,
            "EmailId": $scope.PatientObj.EmailId || "",
            "CommunicationEmailId": $scope.PatientObj.CommunicationEmailId || "",
            "DisplayNumber": $scope.DisplayNumber || 0,
            "IsTeleMedicineSlot": $scope.PatientObj.IsTeleMedicineSlot || false,
            "SubSpecializationId": $scope.PatientObj.SubSpecializationId || 0,
            "BranchSubSpecializationId": $scope.PatientObj.BranchSubSpecializationId || 0,
            "CheckinStatusId": $scope.PatientObj.CheckinStatusId || 1,
            "VisitTypeId": $scope.PatientObj.VisitTypeId || null,
            "AppointmentPatientTypeId": $scope.PatientObj.AppointmentPatientTypeId || null,
            "PaymentTypeId": $scope.PatientObj.PaymentTypeId || null,
            "BookingStatusId": $scope.PatientObj.BookingStatusId|| null,
            "BookingTypeId": $scope.PatientObj.BookingTypeId || null,
            "OtherProviderDoctorID": 0,
            "SurgeryReferralDoctorId": 0,
            "ReasonTypeId": 0,
            "DoctorEmail": $scope.PatientObj.DoctorEmail || '',
            "cancelHospitalId": $scope.PatientObj.HospitalId  || 0,
            "LanguageID": $scope.PatientObj.LanguageID || 0,
        }


        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/CancelAppointmentPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "resolve": {
                "mainObject": function () { return Obj; }
            },
            "controller": "CancelAppointmentPopupCtrl",
            
        });
        $scope.mInstanceAdd.result.then(function (data) {
          
            $scope.AgentStatusId = 4;
            var smsCancelReason = $scope.CancelAppointmentobj.smsCancelReason || "";
            var smsOtherCancelReason = $scope.CancelAppointmentobj.smsOtherCancelReason || "";
            var ConsultationDt = data.response.ConsultationDt || "";
            var VisitReasonId = data.VisitReasonId || "";
            var obj = {
                "CancelReason": smsCancelReason,
                "OtherCancelReason": smsOtherCancelReason,
                "ConsultationDt": ConsultationDt,
                "VisitReasonId": VisitReasonId,

            }
            $scope.AgentStatusUpdate(obj);
        }, function () {

        });
    }

    $scope.ChangeApptBranch = function (item) {
        $scope.GetAllIndicator = 0;
        if (item.ClinicId == 0) {
            $scope.GetAllIndicator = 1;
        }
        $scope.AppListselectedclinic = item || {};
         

        getallusers(item.ClinicId);
        $scope.GetVisitReasons(item.ClinicId);
    }
    $scope.CheckAllFacilityType = function (val) {
        if (val) {
            angular.forEach($scope.FacilityList, function (item) {
                item.IsChecked = true;
            });

            $scope.SmsFacilityObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.FacilityList, function (item) {
                item.IsChecked = false;
            });

            $scope.SmsFacilityObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.FacilityTypeToggle = function () {
        var checkedArray = _.where($scope.FacilityList, { IsChecked: true });
        $scope.SmsFacilityObj.AllStatusCheck = checkedArray.length > 0 && $scope.FacilityList.length === checkedArray.length ? true : false;
        if ($scope.SmsFacilityObj.AllStatusCheck) {
            $scope.SmsFacilityObj.SelectStatusString = 'All';
        }

        if (!$scope.SmsFacilityObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.SmsFacilityObj.SelectStatusString = 'Selected';
        }
    };
    $scope.ReminderDate = '';
    $scope.GetSetReminderId = function (Id) {
        $scope.PatientId = Id || 0;
        $scope.SetReminderArray = [];
        var param = {
            /*"AppointmentId": $scope.appointmentid || 0,*/
            "AppointmentId": 0,
            "PatientId": $scope.PatientId || 0,
            "IsHistory": false
        }

        eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.SetReminderArray = angular.copy(resp.data.rows);
                //$scope.mInstanceAdd.close($scope.SetReminderArray);
                if ($scope.SetReminderArray.length > 0) {
                    var List = $filter("filter")($scope.SetReminderArray, { "TypeId": 3, "AppointmentId": $scope.Cancelappointmentinfo.AppointmentID }, true) || [];
                    if (List.length > 0) {
                        //   angular.forEach(List, function (item) {
                        if (List[0].AppointmentId == $scope.Cancelappointmentinfo.AppointmentID) {
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
            "appointmentid": $scope.Cancelappointmentinfo.AppointmentID || 0,
            "PatientID": $scope.Cancelappointmentinfo.PatientID || 0,
            "IsFrom": "",
        }
        if (RemainderItem != '' && $scope.SetReminderArray.length > 0) {
            var filteredItem = $filter("filter")($scope.SetReminderArray, { "TypeId": 3, "AppointmentId": $scope.Cancelappointmentinfo.AppointmentID }, true);
            RemainderItem = filteredItem.length > 0 ? filteredItem[0] : '';
        }

  
        let getParams = {
            "OrganizationId": $scope.HospitalId,
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
                            //"UserId": function () { return $scope.UserId; },
                            //"HospitalId": function () { return doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID; },

                            "Reminderobj": function () { return Reminderobj; },
                            "RemainderItem": function () { return RemainderItem; },
                            "ReminderTab": function () { return type; },
                            "ReturntoofficeItem": function () { return item; },
                        },


                    });
                    $scope.reminderModalInstance.result.then(function (resp) {
                        $scope.IsAddtoRecall = false;
                        //$scope.SetReminderArray = resp || [];
                        $scope.GetSetReminderId($scope.Cancelappointmentinfo.PatientID);

                    }, function () {

                    });

                }

            }
        });


    };


}]);
"use strict";
eHnoteWebApp.controller("UsAppointmentRequestCtrl", ["$scope", "$http", "$log", "$rootScope", "$compile", "$q", "$location", "$ocLazyLoad", "$uibModal", "$routeParams", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteProcedureDataService", "alertify", "eHnoteCacheStorageService", "eHnoteAuditServices", "eHnoteDbStaticDataService", "eHnoteUserAppointmentDataService", "eHnoteUserDataService", "localStorageFactory", "eHnoteMainAdminServices", "eHnoteAdminDepartmentService", function ($scope, $http, $log, $rootScope, $compile, $q, $location, $ocLazyLoad, $uibModal, $routeParams, $filter, $timeout, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnoteMasterDataService, eHnotePatientDataService, eHnoteProcedureDataService, alertify, eHnoteCacheStorageService, eHnoteAuditServices, eHnoteDbStaticDataService, eHnoteUserAppointmentDataService, eHnoteUserDataService, localStorageFactory, eHnoteMainAdminServices, eHnoteAdminDepartmentService) {


    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    };
    $scope.StatusFilter = "";
    var SetupPopUp = "";
    $scope.GetAllIndicator = 0;
    $scope.AppointmentstatusArray = [
        { "Id": 0, "Name": "All" },{ "Id": 1, "Name": "Pending" }, { "Id": 2, "Name": "Booked" }
    ];
    $scope.RequestTypeArray = [
        { "Id": 0, "Name": "All" }, { "Id": 1, "Name": "Request CallBack" }, { "Id": 2, "Name": "Early Appt" }, { "Id": 3, "Name": "CRM Appointments" }, { "Id": 4, "Name": "Need Assistance" }, { "Id": 5, "Name": "Reschedule Request" }, { "Id": 6, "Name": "Online Appointment Request" }, { "Id": 7, "Name": "External Referral" },{ "Id": 8, "Name": "Cancellation Request" }
    ];
    $scope.ConfirmStatusArray = [
        { "Id": 0, "Name": "All" }, { "Id": 1, "Name": "Confirm" }, { "Id": 2, "Name": "Not Confirm" }
    ];
    function GetAppointmentRequest() {
        return {
            "HospitalId": $scope.HospitalId,
            "FromDate": moment().format("MM-DD-YYYY"),
            "ToDate": moment().format("MM-DD-YYYY"),
            "AppointmentStatus": 0,
            "RequestTypeId": 0,
            "ConfirmedAppointment": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "TotalCount" : 0
        }
    };
    $scope.AppointmentRequest = GetAppointmentRequest();




    $scope.allUserList = [];
    function BookApptPopupOpened() {
        var openBookAppt = "";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopup.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup",
            "controller": "UsNewBookAppointmentPopupCtrl",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; }
            }
        });

        $scope.bookapptSetupPopUp.result.then(function (resp) {
            datapersistanceFactory.remove("AppointmentRequestScreen");
            $scope.GetAppointmentRequestsList();

        }, function () { });

    }

    function BookApptPopupOpenedv2() {
        var openBookAppt = "";
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
            datapersistanceFactory.remove("AppointmentRequestScreen");
            $scope.GetAppointmentRequestsList();

        }, function () { });

    }

    $scope.EditAppointmentPopup = function (item, type) {

        var Sarray = item.AppointmentDetails[0].StartTime.split(":");
        var stime = Sarray[0] + ":" + Sarray[1];
        var date = moment(item.AppointmentDetails[0].ConsultationDt).format();
        var earray = item.AppointmentDetails[0].EndTime.split(":");
        var etime = earray[0] + ":" + earray[1];
        var apptime = item.AppointmentDetails[0].AppointmentID;
        var VisitTypeId = item.AppointmentDetails[0].VisitTypeId || "";
        VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
        if (VisitTypeId == 0) {
            item.AppointmentDetails[0].VisitReason = "";
        } else {
            item.AppointmentDetails[0].VisitReason = item.AppointmentDetails[0].VisitReason || "";
        }
        $scope.AppDate = [stime, etime, apptime, item.AppointmentDetails[0].VisitReason, item.AppointmentDetails[0].ReferralSourceId ? item.AppointmentDetails[0].ReferralSourceId : "", VisitTypeId];
        $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);

        let obj = {
            'IsComingFrom': 'AppointmentRequestScreen',
            "PluginAppoitmentRequestId": item.PluginAppoitmentRequestId,
            "MasterPatientId": item.MasterPatientId || 0,
            "Remarks": item.Remarks,
            "PreferredDate": item.PreferredDate,
            "RequestedDate": item.RequestedDate,
            "AppointmentRequestReasonId": item.AppointmentRequestReasonId,
            "StatusId": item.StatusId,
            "IsOnlineRequest": true,
            "AppointmentId": item.AppointmentDetails[0].AppointmentID
        };
        datapersistanceFactory.set("AppointmentRequestScreen", obj);


        $scope.PageName = "reschedule";

        var Obj = {
            "PageName": "reschedule",
            "AppDate": $scope.AppDate,
            "ispatientExistsval": true,
            "calenderDate": $scope.calenderDate,
            "AppointmentDate": item.AppointmentDetails[0].ConsultationDt,
            "AppointmentId": item.AppointmentDetails[0].AppointmentID || null,
            "PatientId": item.AppointmentDetails[0].PatientID || null,
            "type": '',
            "DoctorId": item.AppointmentDetails[0].DoctorID,
            "StartTime": stime,
            "EndTime": etime,
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        if (type == 2) {
            BookApptPopupOpenedv2();
        }

    };



    $scope.BookApptfromRequest = function (Object, ttype) {
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        if (Object.AppointmentId !== 0) {
            var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            cacheStorageItem.patientid = Object.PatientId;
            cacheStorageItem.InvestigationList = [];
            cacheStorageItem.PatientName = Object.Patient.FullName;
            cacheStorageItem.EmailID = Object.Patient.EmailId ? Object.Patient.EmailId : "";
            cacheStorageItem.CountryCode = Object.Patient.PhCntryCD ? Object.Patient.PhCntryCD : "";
            cacheStorageItem.PhoneNumber = Object.Patient.PatientMobileNo ? Object.Patient.PatientMobileNo : "";
            cacheStorageItem.PatientDisplayId = Object.Patient.PatientDisplayId ? Object.Patient.PatientDisplayId : "";

            cacheStorageItem.AppointmentPatientTypeId = Object.AppointmentDetails[0].AppointmentPatientTypeId || 0;
            cacheStorageItem.AppointmentType = Object.AppointmentDetails[0].AppointmentType || "";
            cacheStorageItem.PatientDetails = Object.AppointmentDetails[0].PatientDetails;
            cacheStorageItem.AttenderName = Object.AppointmentDetails[0].AttenderName ? Object.AppointmentDetails[0].AttenderName : "";
            cacheStorageItem.HospitalEquipmentId = Object.AppointmentDetails[0].HospitalEquipmentId || "";
            cacheStorageItem.HospitalEquipmentName = Object.AppointmentDetails[0].HospitalEquipmentName || "";
            cacheStorageItem.bookApptType = 'EditAppointment';
            cacheStorageItem.IsAppointmentConfirmed = Object.AppointmentDetails[0].IsConfirmedAppointment || false;

            eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
            $scope.ispatientExistsval = true;
            var Sarray = Object.AppointmentDetails[0].StartTime.split(":");
            var stime = Sarray[0] + ":" + Sarray[1];
            var date = moment(Object.AppointmentDetails[0].ConsultationDt).format();
            // var date = moment(item.AppointmentDate).format();
            var earray = Object.AppointmentDetails[0].EndTime.split(":");
            var etime = earray[0] + ":" + earray[1];
            var apptime = Object.AppointmentDetails[0].AppointmentID;
            var VisitTypeId = Object.AppointmentDetails[0].VisitTypeId || "";
            VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
            if (VisitTypeId == 0) {
                Object.AppointmentDetails[0].VisitReason = "";
            } else {
                Object.AppointmentDetails[0].VisitReason = Object.AppointmentDetails[0].VisitReason || "";
            }
            $scope.AppDate = [stime, etime, apptime, Object.AppointmentDetails[0].VisitReason, Object.AppointmentDetails[0].ReferralSourceId ? Object.AppointmentDetails[0].ReferralSourceId : "", VisitTypeId];

            $rootScope.appointmentRootId = 0;
            $rootScope.appointmentParentId = 0;

            $rootScope.appointment_type = Object.AppointmentDetails[0].AppointmentTypeId.toString();
            $rootScope.AppointmentPatient_type = Object.AppointmentDetails[0].AppointmentPatientTypeId;
            $rootScope.FastTrackAppointment = Object.AppointmentDetails[0].ISFastTrackAppointment || false;
            $rootScope.IsTeleMedicineSlot = Object.AppointmentDetails[0].IsTeleMedicineSlot || false;
            $rootScope.IsBillPaid = Object.AppointmentDetails[0].BillingId || 0;

            
            var doctorID = {
                "DoctorID": Object.AppointmentDetails[0].DoctorID   //doctorinfo.doctorid
            };
            if (doctorID.DoctorID != 0) {
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            }
            //if (doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
            //    eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            //}
            let obj = {
                'IsComingFrom': 'AppointmentRequestScreen',
                "PluginAppoitmentRequestId": Object.PluginAppoitmentRequestId,
                "MasterPatientId": Object.MasterPatientId || 0,
                "Remarks": Object.Remarks,
                "PreferredDate": Object.PreferredDate,
                "RequestedDate": Object.RequestedDate,
                "AppointmentRequestReasonId": Object.AppointmentRequestReasonId,
                "StatusId": Object.StatusId,
                "IsOnlineRequest": true
            };
            //datapersistanceFactory.set("AppointmentRequestScreen", { "IsComingFrom":"AppointmentRequestScreen","IsOnlineRequest":true});
            datapersistanceFactory.set("AppointmentRequestScreen", obj);
            var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
            appoint_info.StartTime = Object.AppointmentDetails[0].StartTime;
            appoint_info.EndTime = Object.AppointmentDetails[0].EndTime;
            appoint_info.BookingTypeId = Object.AppointmentDetails[0].BookingTypeId;
            eHnoteMasterDataService.addAppointmentInfo(appoint_info);

            var clinicAddressId = { "ClinicId": Object.AppointmentDetails[0].BranchId };
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);

            $scope.PageName = "reschedule";
            $rootScope.rescheduleConsultationFollowUp = Object.AppointmentDetails[0].IsConsultationFollowUp || false;
     
            $rootScope.Consulatation_type = false;
            var Obj = {
                "PageName": "reschedule",
                "AppDate": $scope.AppDate,
                "ispatientExistsval": true,
                "calenderDate": $scope.calenderDate,
                "AppointmentId": Object.AppointmentId || null,
                "PatientId": Object.PatientId || null,
                'IsComingFrom': '',
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);
       
        } 
        else {
            $scope.PageName = "book";
            $scope.cacheStorageItem.bookApptType = "";
            $scope.AppDate = "";
            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            var clinicAddress = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
            var doctorID = {
                "DoctorID": Object.DoctorId   //doctorinfo.doctorid
            };

            //if (doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
            //    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            //    eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            //}
            //else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            //    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            //} else {
            //    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            //}
            clinicAddress.ClinicId = clinicAddress.ClinicId || 0;
            doctorID.DoctorID = doctorID.DoctorID || 0;
            if (clinicAddress.ClinicId != 0) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            }
            if (doctorID.DoctorID != 0) {
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            }

            var obj = {
                'IsComingFrom': 'AppointmentRequestScreen',
                "PluginAppoitmentRequestId": Object.PluginAppoitmentRequestId,
                "MasterPatientId": Object.MasterPatientId || 0,
                "Remarks": Object.Remarks,
                "PreferredDate": Object.PreferredDate,
                "RequestedDate": Object.RequestedDate,
                "AppointmentRequestReasonId": Object.AppointmentRequestReasonId,
                "StatusId": Object.StatusId,
                "IsOnlineRequest": true,
                'ReasonTypeId': Object.ReasonTypeId || null,
                'ReasonTypeName': Object.ReasonTypeName || null
            };
            datapersistanceFactory.set("AppointmentRequestScreen", obj);
            //$scope.AppDate = Object.PreferredDate;

            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": false,
                "calenderDate": undefined,
                "AppointmentId": null,
                "PatientId": Object.PatientId||null,
                'IsComingFrom': 'AppointmentRequest',
                'ReasonTypeId': Object.ReasonTypeId||null,
                'ReasonTypeName': Object.ReasonTypeName || null
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            var date = moment(Object.PreferredDate).format();
            $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + "00:00");

            $scope.cacheStorageItem.patientid = Object.PatientId;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        //SetupPopUp = $uibModal.open({
        //    "templateUrl": 'appointMentPopupId.html',
        //    "scope": $scope,
        //    "keyboard": false,
        //    "backdrop": "static",
        //    "windowClass": "appointment-full-popup",

        //});
        if (ttype == 2) {
            BookApptPopupOpenedv2();
        } else {
            BookApptPopupOpened();
        }
        
    };
    $scope.$on("closePopup", function (event) {
        SetupPopUp.dismiss('cancel');
        datapersistanceFactory.remove("AppointmentRequestScreen");
    });
    $scope.$on("successMethod", function (event) {
        SetupPopUp.dismiss('cancel');
        datapersistanceFactory.remove("AppointmentRequestScreen");
        $scope.GetAppointmentRequestsList();
    });
    $scope.$on("reshedulesuccessMethod", function (event, data) {
        SetupPopUp.dismiss('cancel');
        datapersistanceFactory.remove("AppointmentRequestScreen");
        $scope.GetAppointmentRequestsList();
    });

    $scope.$on("AppointmentRescheduledSuccess", function (event, data) {
        datapersistanceFactory.remove("AppointmentRequestScreen");
        $scope.GetAppointmentRequestsList();
    });
    $scope.GetAppointmentRequestsList = function (pagenumber) {
        if (pagenumber != undefined) {
            $scope.AppointmentRequest.PageNumber = pagenumber;
        } else {
            $scope.AppointmentRequest.PageNumber = 1;
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
      //  eHnoteUserAppointmentDataService.GetAppointmentRequestsList($scope.HospitalId).then(function (resp) {
        var params = {
            "AppointmentStatusId": $scope.AppointmentRequest.AppointmentStatus || 0,
            "ConfirmedAppointmentId": $scope.AppointmentRequest.ConfirmedAppointment || 0,
            "FromDate": $filter('date')(new Date($scope.AppointmentRequest.FromDate), "yyyy-MM-dd"),
            "HospitalId": $scope.AppointmentRequest.HospitalId,
            "RequestTypeId": $scope.AppointmentRequest.RequestTypeId || 0,
            "ToDate": $filter('date')(new Date($scope.AppointmentRequest.ToDate), "yyyy-MM-dd"),
            "PageSize": $scope.AppointmentRequest.PageSize || 10,
            "PageNumber": $scope.AppointmentRequest.PageNumber || 1,
            "Locationids": Locationids || '',
            "FacilityListIds": ''
        }
        eHnoteUserAppointmentDataService.GetAppointmentRequestsList(params).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.AppointmentRequestsList = resp.data.rows;
                $scope.AppointmentRequest.TotalCount = resp.data.count;
                angular.forEach($scope.AppointmentRequestsList, function (item) {
                    item.isFutureOrTodayAppointment = false;
                    item.showEditAppointment = false;
                    item.ApptStatus = "";
                    item.SecondUserFullName = "";
                    var phnnumber = eHnoteUserDataService.UsMobileFormatChange(item.Patient.PhAreaCD + item.Patient.HomeNumber);
                    item.Patient.UsFormateMobile = phnnumber.UsFormatMobileNumber;
                    if (item.AppointmentDetails.length > 0) {
                        let d = item.AppointmentDetails[0].ConsultationDt + " " + item.AppointmentDetails[0].StartTime;
                        item.AppointmentBookedTime = new Date(d);
                        if (item.AppointmentDetails[0].AppointmentStatus == 'C' || item.RequestStatusId == 3) {
                            item.ApptStatus = "C";

                        }
                        item.SecondUserFullName = item.AppointmentDetails[0].SecondUserFullName || '';

                        if (item.SecondUserFullName !== "") {
                            item.DoctorName = item.AppointmentDetails[0].SecondUserFullName || "";
                        }
                       
                        item.VisitReason = item.AppointmentDetails[0].VisitReason || "";
                        item.AppointmentType = item.AppointmentDetails[0].AppointmentType || "";
                        item.AppointmentStatus = item.AppointmentDetails[0].AppointmentStatus || "";
                        item.AppointmentStatusId = item.AppointmentDetails[0].AppointmentStatusId || "";
                        item.AppointmentStatusName = item.AppointmentDetails[0].AppointmentStatusName || "";
                        item.ConsultationDt = item.AppointmentDetails[0].ConsultationDt || "";
                        

                        let today = moment().format('YYYY-MM-DD');
                        let appointmentDt = moment(item.ConsultationDt).format('YYYY-MM-DD');

                        if (appointmentDt >= today) {
                            item.isFutureOrTodayAppointment = true;
                        }

                        if (item.isFutureOrTodayAppointment && item.AppointmentStatus != 'C' && item.AppointmentStatus != 'R' && item.AppointmentStatusId != 11) {
                            item.showEditAppointment = true;
                        }

                    }
                    else {
                        if (!item.IsVoiceAIRequest) {
                            item.DoctorName = '';
                            item.VisitReason = '';
                        }
                    }
                    item.Date = $filter("date")(new Date(item.ModifiedDt), "MM-dd-yyyy") || "";
                    item.Time = $filter("date")(new Date(item.ModifiedDt), "hh:mm a") || "";
                    item.DateandTime = item.Date + ',' + item.Time

                    // Schedule column: booked date/time for a normal request, preferred date/time
                    // for a Voice AI request (or any request that is not booked yet).
                    item.ScheduleLabel = "";
                    item.ScheduleDate = "";
                    item.ScheduleTime = "";
                    if (item.AppointmentBookedTime && !isNaN(item.AppointmentBookedTime.getTime())) {
                        item.ScheduleLabel = "Booked";
                        item.ScheduleDate = moment(item.AppointmentBookedTime).format("MM-DD-YYYY");
                        item.ScheduleTime = moment(item.AppointmentBookedTime).format("hh:mm A");
                    } else if (item.PreferredDate) {
                        item.ScheduleLabel = "Preferred";
                        item.ScheduleDate = moment(item.PreferredDate, "YYYY-MM-DD").format("MM-DD-YYYY");
                        item.ScheduleTime = item.PreferredTime ? moment(item.PreferredTime, "HH:mm:ss").format("hh:mm A") : "";
                    }
                });
            } else {
                alertify.error("Getting Failed");
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.OpenNewPopUp = function (item) {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/AppointmentReqRemarksPopUp.html",
            //"backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "sm",
            //"windowClass": "newassessmentspopupuib",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.Remarks = item.Remarks;
                $scope.RequestStatusId = item.RequestStatusId || 0;
                if (item.AppointmentDetails.length > 0) {
                    $scope.RequestStatusList = [
                        {
                            "Id": 0,
                            "Name": "Select"
                        },
                        {
                            "Id": 1,
                            "Name": "Not Reachable"
                        },
                        {
                            "Id": 2,
                            "Name": "Slot Not Available"
                        },
                        {
                            "Id": 3,
                            "Name": "Cancel Appointment"
                        }
                    ];
                } else {
                    $scope.RequestStatusList = [
                        {
                            "Id": 0,
                            "Name": "Select"
                        },
                        {
                            "Id": 1,
                            "Name": "Not Reachable"
                        },
                        {
                            "Id": 2,
                            "Name": "Slot Not Available"
                        }
                    ];
                }

                $scope.AddUpdateAppointmentRequest = function () {
                    if ($scope.RequestStatusId == 0) {
                        alertify.error("Please Select Status");
                        return false;
                    }
                    $scope.RequestStatus = $filter('filter')($scope.RequestStatusList, { 'Id': $scope.RequestStatusId }, true)[0];
                    let params = {
                        "PluginAppoitmentRequestId": item.PluginAppoitmentRequestId,
                        "PatientId": item.PatientId || 0,
                        "MasterPatientId": item.MasterPatientId || 0,
                        "AppointmentId": item.AppointmentId,
                        //"BranchId": item.HospitalID,
                        "DoctorId": item.DoctorId,
                        "PreferredDate": item.PreferredDate,  //$filter('date')(new Date(item.PreferredDate), "yyyy-MM-dd"),
                        "RequestedDate": item.RequestedDate,  //$filter('date')(new Date(item.RequestedDate), "yyyy-MM-dd"),
                        "AppointmentRequestReasonId": item.AppointmentRequestReasonId,
                        "Remarks": $scope.Remarks || "",
                        "StatusId": item.StatusId,
                        "Status": item.Status,
                        "RequestStatusId": $scope.RequestStatusId,
                        "RequestStatus": $scope.RequestStatus.Name,
                        "DeleteInd": "N"
                    }
                   
                    eHnoteUserAppointmentDataService.AddUpdatePluginAppointmentRequest(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            if ($scope.RequestStatusId == 3) {
                                $scope.UpdateCancelAppointment(item);
                            }
                            $scope.GetAppointmentRequestsList();
                            $scope.closeuib();
                        }
                    }, function (err) {
                        console.log(err);
                    });
                };

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
                $scope.UpdateCancelAppointment = function (obj) {
                    $scope.Cancelappointmentinfo = obj.AppointmentDetails[0];
                    var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();
                    $scope.CommunicationEmailId = obj.AppointmentDetails[0].CommunicationEmailId || "";
                    $scope.DocCommunicationPhnumber = obj.AppointmentDetails[0].CommunicationCountryCode + "" + obj.AppointmentDetails[0].CommunicationMobileNo;
                    var patientDetails = obj.Patient;
                    $scope.DisplayNumber = "";
                    if (patientDetails.PhAreaCD != '' && patientDetails.HomeNumber != '') {
                        var mobilenumber = patientDetails.PhAreaCD + patientDetails.HomeNumber;
                        var obj = eHnoteUserDataService.UsMobileFormatChange(mobilenumber);
                        $scope.DisplayNumber = obj.UsFormatMobileNumber;
                    }

                    var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");
                    var AppmntParams = {
                        "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
                        "AppointmentStatus": "C",
                        "StartTime": $scope.Cancelappointmentinfo.StartTime,
                        "EndTime": $scope.Cancelappointmentinfo.EndTime,
                        "IsFollowUp": false,
                        "DoctorID": $scope.Cancelappointmentinfo.DoctorID,
                        "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                        "DayCD": currentdaycode, 
                        "VisitUserTypeID": "OPATIENT",
                        "OtherVisitRsn": "",
                        "ConsultationDt": $scope.Cancelappointmentinfo.ConsultationDt,
                        "PatientID": $scope.Cancelappointmentinfo.PatientID,
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "USRType": "DOCTOR",
                        "DoctorVisitRsnID": $scope.Cancelappointmentinfo.AppointmentTypeId,
                        "HospitalDetails": {
                             "HospitalID": $scope.HospitalId,
                            "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                            "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
                            "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                            "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
                        },
                        "CommunicationDetails": {
                            "PatientName": patientDetails.FullName,
                            "PatientMobile": patientDetails.PatientMobileNo,
                            "DoctorMobile": $scope.Cancelappointmentinfo.DoctorMobile,
                            "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                            "DoctorName": $scope.Cancelappointmentinfo.DoctorFullName,
                            "AppDate": $scope.Cancelappointmentinfo.ConsultationDt,
                            "AppTime": $scope.Cancelappointmentinfo.StartTime,
                            "AppClinic": doctorinfo.doctordata.UserAddress[0].ClinicName,
                            "AppToken": 0,
                            "PatientEmail": patientDetails.EmailId,
                            "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail || "",
                            "DoctorEmail": $scope.Cancelappointmentinfo.DoctorEmail,
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
                            "CommunicationEmailId": $scope.CommunicationEmailId || "",
                            "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
                            "DisplayNumber": $scope.DisplayNumber,
                        },
                        "PreviousAppointmentTime": "",
                        "SendDocSms": false,
                        "SendDocEmail": false,
                        "SendPatientEmail": false,
                        "SendPatientSms": false,
                        "StatusDescription": $scope.Remarks || "",
                        "PaidFollowup": false,
                        "IsTeleMedicineSlot": $scope.Cancelappointmentinfo.IsTeleMedicineSlot,
                        "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
                        "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
                        "CurrentTime": CurrentCheckOutTime || null,
                        "IsCheckedIn": $scope.Cancelappointmentinfo.CheckinStatusId || 1,
                        "VisitTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null,
                        "ParentAppointmentVisitReasonId": $scope.Cancelappointmentinfo.VisitTypeId || null,
                        "IsPatientSmsInd": false,
                        "IsPatientEmailInd": false,
                        "CancelReasonId": 5,
                        "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null
                    };

                    eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);
                    function OnAddApointmentSuccess(data) {
                        alertify.success("Appointment Cancelled Successfully");
                    }
                    function OnCaseSaveError(data) {
                        alertify.error("Error in Cancelling Appointment");
                    }
                }
                $scope.ChangeRequestStatus = function () {
                    $scope.Remarks = '';
                };
            }
        });
    };

    $scope.allUserList = [];
    $scope.getDoctorsbySubSpecializations = function (branchId, pagetype) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
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

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.clinicDoctorList = [];
                $scope.Calendardoctorlist1 = [];
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;

            } else {
                alertify.error("No Users Found in Selected Departments");       
            }
        }

        function onGetUsersFailure(data) {
        }

    }

    function GetBranchSubSpecializations(SubOrganizationId, BranchId, pagetype) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;

                if (pagetype === 'PageLoad') {
                    $scope.newAllSubSpecializationsArray = angular.copy(resp.data.row);
                }


                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations(BranchId, pagetype);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.newAllSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    };
    $scope.OrgSpecialitiesArray = [];
    function getBranchSpecializations(SubOrganizationId, BranchId, pagetype) {
        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }

            });
        }
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
        $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

        var RoleID = $scope.userLoginDetails.RoleID;

        $scope.clinicDoctorList = [];

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];
        $scope.AppListselectedclinic = $scope.defaultbranch[0];
        if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
            angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                if (item.ClinicName !== "All Locations") {
                    if (item.ClinicId === $scope.hospid) {
                        $scope.selectedBranch = item;
                        $scope.AppListselectedclinic = item;
                        eHnoteMasterDataService.addSelectedHospitalinAppList(item);
                    }
                }
            });
        }
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);
    };
    //$scope.GetOrganizationFacilityData = function (id) {
    //    if ($scope.GetAllIndicator == 0) {
    //        var HospitalId = 0;
    //        id = id || 0;
    //        if (id == 0) {
    //            HospitalId = $scope.HospitalId;
    //        } else {
    //            HospitalId = id;
    //        }
    //    } else {
    //        $scope.AppListdoctoraddress = _.uniq($scope.AppListdoctoraddress, false, function (p) { return p.ClinicId; }) || [];
    //        var TempAddressArray = $filter("filter")($scope.AppListdoctoraddress, function (item, index) { return item.ClinicId !== 0; }) || [];
    //        var HospitalId = "";
    //        for (var i in TempAddressArray) {
    //            if (TempAddressArray[i].ClinicId) {
    //                HospitalId += "," + TempAddressArray[i].ClinicId;
    //            }
    //        }
    //        if (HospitalId.charAt(0) === ",") {
    //            HospitalId = HospitalId.slice(1);
    //        }
    //    }
    //    var obj = {
    //        "OrganizationId": HospitalId,
    //        "FacilityName": ""
    //    }
    //    eHnoteAdminDepartmentService.GetOrganizationFacilityData(obj).then(function (resp) {
    //        if (resp.data.status === "Success") {
    //            $scope.FacilityList = resp.data.rows || [];
    //        }
    //        if ($scope.FacilityList.length > 0) {
    //            angular.forEach($scope.FacilityList, function (kitem) {
    //                kitem.IsChecked = true;
    //            });
    //            $scope.ApptReqFacilityObj.AllStatusCheck = true;
    //            $scope.ApptReqFacilityObj.SelectStatusString = 'All';
    //        }
    //    }, function (err) {
    //        alertify.error("Getting Data Failed");
    //    });

    //};
    $scope.init = function () {
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
       // $scope.GetOrganizationFacilityData();
        $scope.GetAppointmentRequestsList();
    };
    $scope.init();
    $scope.ClickToAppinfo = {
        templateUrl: 'Appinfo.html',
        DoctorName: '',
        RequestedDate: ''
    };
    $scope.Getapptinfo = function (item) {
        $scope.ClickToAppinfo.DoctorName = item.SecondUserFullName || '';
        $scope.ClickToAppinfo.RequestedDate = item.DateandTime || '';
        $scope.ClickToAppinfo.CreatedBy = item.CreatedBy || "";
        $scope.ClickToAppinfo.CreatedDt = item.CreatedDt || "";
        $scope.ClickToAppinfo.ModifiedBy = "";
        $scope.ClickToAppinfo.ModifiedDt = "";
        if (item.AppointmentDetails.length>0) {
            $scope.ClickToAppinfo.CreatedDt = item.AppointmentDetails[0].CreatedDt || '';
            $scope.ClickToAppinfo.ModifiedDt = item.AppointmentDetails[0].ModifiedDt || '';
            $scope.ClickToAppinfo.CreatedBy = item.AppointmentDetails[0].CreatedBy || '';
            $scope.ClickToAppinfo.ModifiedBy = item.AppointmentDetails[0].ModifiedBy || '';
        }
      
    }

    $scope.ApptReqFacilityObj = {
        "SelectStatusString": "All",
        "Name": "",
        "AllStatusCheck": true
    };

    $scope.ChangeApptBranch = function (item) {
        $scope.GetAllIndicator = 0;
        if (item.ClinicId == 0) {
            $scope.GetAllIndicator = 1;
        }
        $scope.AppListselectedclinic = item || {};
       // $scope.GetOrganizationFacilityData(item.ClinicId);
    }
    $scope.CheckAllFacilityType = function (val) {
        if (val) {
            angular.forEach($scope.FacilityList, function (item) {
                item.IsChecked = true;
            });

            $scope.ApptReqFacilityObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.FacilityList, function (item) {
                item.IsChecked = false;
            });

            $scope.ApptReqFacilityObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.FacilityTypeToggle = function () {
        var checkedArray = _.where($scope.FacilityList, { IsChecked: true });
        $scope.ApptReqFacilityObj.AllStatusCheck = checkedArray.length > 0 && $scope.FacilityList.length === checkedArray.length ? true : false;
        if ($scope.ApptReqFacilityObj.AllStatusCheck) {
            $scope.ApptReqFacilityObj.SelectStatusString = 'All';
        }

        if (!$scope.ApptReqFacilityObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.ApptReqFacilityObj.SelectStatusString = 'Selected';
        }
    };

}]);

/*
 * Sets the given expression to true when the clamped element actually overflows its
 * visible lines, so the caller can show/hide a "view full text" affordance.
 * Usage: <label class="apptreq__remarks--" us-clamp-overflow="item.IsRemarksClamped"
 *               us-clamp-text="{{item.Remarks}}">{{item.Remarks}}</label>
 */
eHnoteWebApp.directive("usClampOverflow", ["$parse", "$timeout", "$window", function ($parse, $timeout, $window) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var getter = $parse(attrs.usClampOverflow);
            var setter = getter.assign;
            if (!setter) {
                return;
            }
            var resizeTimer = null;

            var evaluate = function () {
                var el = element[0];
                var isOverflowing = (el.scrollHeight - el.clientHeight) > 1;
                if (getter(scope) !== isOverflowing) {
                    setter(scope, isOverflowing);
                    scope.$applyAsync();
                }
            };

            var scheduleEvaluate = function () {
                $timeout(evaluate, 0, false);
            };

            // Re-measure whenever the bound text changes and once after the row renders.
            attrs.$observe("usClampText", scheduleEvaluate);
            scheduleEvaluate();

            var onResize = function () {
                if (resizeTimer) {
                    $timeout.cancel(resizeTimer);
                }
                resizeTimer = $timeout(evaluate, 150, false);
            };
            angular.element($window).on("resize", onResize);
            scope.$on("$destroy", function () {
                angular.element($window).off("resize", onResize);
                if (resizeTimer) {
                    $timeout.cancel(resizeTimer);
                }
            });
        }
    };
}]);
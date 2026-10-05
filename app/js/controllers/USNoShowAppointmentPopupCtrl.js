"use strict";
eHnoteWebApp.controller("USNoShowAppointmentPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "ApptObject", "eHnoteMasterDataService", "eHnotePatientVisitReasonServices", "eHnoteUserAppointmentDataService", "$uibModal", "allUserList", "datapersistanceFactory", "eHnoteMainAppointmentService", "eHnotePatientDataService", 'localStorageFactory', 'eHnoteAuditServices', 'eHnoteUserDataService','eHnoteSettingsDataService',
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, ApptObject, eHnoteMasterDataService, eHnotePatientVisitReasonServices, eHnoteUserAppointmentDataService, $uibModal, allUserList, datapersistanceFactory, eHnoteMainAppointmentService, eHnotePatientDataService, localStorageFactory, eHnoteAuditServices, eHnoteUserDataService, eHnoteSettingsDataService) {


        $scope.UserId = eHnoteMasterDataService.getLoginId();

        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {

            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

        }

        $scope.CloseNoshowapptpopup = function () {
           // $uibModalInstance.dismiss("close");
            $uibModalInstance.close();
        }
        $scope.NoShowAppointmentobj = {
            "Ispopup": false,
            "CancelAppReason": [],
            "sendDocSms": false,
            "sendPatientSms": false,
            "sendDocEmail": false,
            "sendPatientEmail": false,
            "CancelReason": "",
            "NoShowReasonRemarks": "",
            "OtherCancelReason": "",
            "PatientFullName": "",
            "AppointmentDate": "",
            "AppointmentStartTime": "",
            "Doctor_Name": "",
            "UserId": null,
            "AppointmentId": null,
            "HospitalID": null,
            "IsNoShowAppointment": false,
            "NoShowReasonRemarks": ApptObject.NoShowReasonRemarks || "",
            "NoShowReasonId": ApptObject.NoShowReasonId || null,
            "NoShowReasonName": "",
        };

        var getParams = {
            //  "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            "PageSize": 100,
            "PageNumber": 1
            //"ReasonTypeId": 2
        };
        $scope.NoShowAppointmentobj.CancelAppReason = [];
        eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.NoShowAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                }
                //var obj = {
                //    "ReasonId": 1,
                //    "CancelReason": "Others"
                //};
                //$scope.NoShowAppointmentobj.CancelAppReason.push(obj);

            }
        });
        datapersistanceFactory.set('AppointmentDetailsCache', "");

        $scope.NoShowAppointmentobj.sendPatientSms = false;
        $scope.NoShowAppointmentobj.sendPatientEmail = false;
        $scope.NoShowAppointmentobj.PatientFullName = ApptObject.PatientName;
        var datetime = ApptObject.AppointmentDate + "T" + ApptObject.AppointmentStartTime;
        $scope.NoShowAppointmentobj.AppointmentStartTime = datetime;
        $scope.NoShowAppointmentobj.AppointmentDate = ApptObject.AppointmentDate;
        $scope.NoShowAppointmentobj.Doctor_Name = ApptObject.DoctorName;
        $scope.NoShowAppointmentobj.AppointmentId = ApptObject.AppointmentId;
        $scope.NoShowAppointmentobj.PatientID = ApptObject.PatientId;
        $scope.NoShowAppointmentobj.PatientDisplayId = ApptObject.PatientDisplayId;
        $scope.NoShowAppointmentobj.S3URL = ApptObject.S3URL || '';

        $scope.ChangeReason = function (id) {
            var ReasonList = $filter("filter")($scope.NoShowAppointmentobj.CancelAppReason, function (iterator) { return iterator.CancelVisitReasonId === id; });
            if (ReasonList.length > 0) {
                $scope.NoShowAppointmentobj.NoShowReasonName = ReasonList[0].CancelReason || '';
            }

        }


        $scope.UpdateNoshowappt = function (Type, ttype) {
            $scope.NoShowAppointmentobj.NoShowReasonId = $scope.NoShowAppointmentobj.NoShowReasonId || null;

            if ($scope.NoShowAppointmentobj.NoShowReasonId == null) {
                alertify.error('Please Select Reason For No Show');
                return false;
            } 

            if ($scope.NoShowAppointmentobj.NoShowReasonRemarks == "") {
                alertify.error('Please Enter No Show Remarks');
                return false;
            }

            var NoShowStatusId = 1;
            if (Type == "Save") {
                NoShowStatusId = 2;
            }
            if (Type == "SaveAndBookAppt") {
                NoShowStatusId = 3;
            }
            if (Type == "SaveAndSetReminder") {
                NoShowStatusId = 4;
            }

            var Description = $scope.NoShowAppointmentobj.NoShowReasonName + '/' + $scope.NoShowAppointmentobj.NoShowReasonRemarks;
            let params = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.NoShowAppointmentobj.AppointmentId,
                "HospitalID": $scope.HospitalId,
                // "IsNoShowAppointment": ApptObject.IsNoShowAppointment,
                "NoShowReasonRemarks": $scope.NoShowAppointmentobj.NoShowReasonRemarks,
                "NoShowReasonId": $scope.NoShowAppointmentobj.NoShowReasonId,
                "StatusDescription": Description,
                "NoShowStatusId": 2,
            }
            eHnoteUserAppointmentDataService.UpdateAppointmentDetails(params).then(function (resp) {
         
                if (Type == "Save") {
                    $uibModalInstance.close(Type);
                }
                if (Type == "SaveAndBookAppt") {
                    var Obj = {
                        "PageName": "reschedule",
                        "AppDate": ApptObject.AppDate,
                        "ispatientExistsval": true,
                        "calenderDate": ApptObject.calenderDate,
                        "AppointmentDate": ApptObject.AppointmentDate,
                        "AppointmentId": ApptObject.AppointmentId || null,
                        "PatientId": ApptObject.PatientId || null,
                        'IsComingFrom': 'NoShow',
                        "DoctorId": ApptObject.DoctorId,
                        "StartTime": ApptObject.StartTime || "",
                        "EndTime": ApptObject.EndTime,
                        'type': 'op',
                        "SurgeryList": ApptObject.SurgeryList || []
                    };
                    datapersistanceFactory.set('AppointmentDetailsCache', Obj);
                    if (ttype == 2) {
                        BookApptPopupOpenedv2();
                    } else {
                        BookApptPopupOpened();
                    }
                }
                if (Type == "SaveAndSetReminder") {
                    var RemainderItem = "";
                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/uibpopups/SetReminderPopover.html",
                        "backdrop": "static",
                        "keyboard": false,
                        "size": "lg",
                        "resolve": {
                            "UserId": function () { return $scope.UserId; },
                            "HospitalId": function () { return $scope.HospitalId; },
                            "appointmentid": function () { return $scope.NoShowAppointmentobj.AppointmentId; },
                            "PatientID": function () { return ApptObject.PatientId|| 0; },
                            "RemainderItem": function () { return RemainderItem; },
                        },
                        "controller": function ($scope, $uibModal, $uibModalInstance, UserId, HospitalId, appointmentid, PatientID, RemainderItem) {

                            $scope.UserId = UserId || 0;
                            $scope.HospitalId = HospitalId || 0;
                            $scope.appointmentid = appointmentid || 0;
                            $scope.PatientID = PatientID || 0;

                            function getnewReminderObj() {
                                var obj = {
                                    "PatientReminderId": 0,
                                    "ReminderDate": "",
                                    "Type": "Date",
                                    "DurationType": "",
                                    "Duration": "",
                                    "ReminderRemarks": "",
                                    "DoctorId": ApptObject.DoctorId || null,
                                    "VisitTypeId": null,
                                    "DocObj": "",
                                    "SearchText": "",
                                    "VisitReasonName": ApptObject.VisitReason || "",
                                    "VisitReasonId": null,
                                    "ReminderStatusId": 1,
                                    "ReminderStatus": "To be Worked",
                                    "PriorityId": 0,
                                    "PriorityName": "",
                                };
                                return obj;
                            }
                            $scope.ReminderObj = getnewReminderObj();

                            $scope.allUserList = allUserList;
                            $scope.clinicDoctorList = [];
                            angular.forEach($scope.allUserList, function (item) {
                                if (item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 18) {
                                    $scope.clinicDoctorList.push(item);
                                }
                            });

                            $scope.ReminderTab = 2;

                            var filteredarray = $filter("filter")($scope.clinicDoctorList, { "DoctorID": ApptObject.DoctorId }, true);
                            if (filteredarray.length > 0) {
                                $scope.ReminderObj.DocObj = angular.copy(filteredarray[0]);
                            }
                            $scope.switchReminderTab = function (val) {
                                $scope.ReminderObj = getnewReminderObj();
                                $scope.ReminderTab = val;
                            };


                            $scope.GetVisitReasonServicesList = function () {
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
                                        };
                                    };
                                });
                            }
                            $scope.GetVisitReasonServicesList();
                            $scope.GetMasterData = function () {
                                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId).then(function (resp) {
                                    if (resp.data.status == "Success") {
                                        if (resp.data.MasterPriority.length > 0) {
                                            $scope.MasterPriority = resp.data.MasterPriority || [];
                                        }
                                    }
                                });
                            }
                            $scope.GetMasterData();
                            $scope.ChangePrioritylist = function (PriorityList) {
                                $scope.ReminderObj.PriorityId = PriorityList.PriorityId || 0;
                                $scope.ReminderObj.PriorityName = PriorityList.PriorityName || "";
                            }

                            $scope.onSelectReminderVisitReason = function (item) {
                                item = item || "";
                                if (item.ReasonId !== "") {
                                    $scope.ReminderObj.VisitReasonName = item.Reason;
                                    $scope.ReminderObj.VisitReasonId = item.ReasonId || 0;
                                    $scope.ReminderObj.VisitTypeId = item.ReasonId; // in DB visittypeid means VisitReasonId
                                }
                            };

                            $scope.OnReminderDocSelect = function (obj) {
                                $scope.ReminderObj.DoctorId = obj.DoctorID;
                            };
                            RemainderItem = RemainderItem || "";

                            if (RemainderItem !== "") {

                                if (RemainderItem.Date == null) {
                                    var RemDate = $filter("date")(RemainderItem.Duration, "yyyy-MM-dd") || '';
                                } else {
                                    var RemDate = $filter("date")(RemainderItem.Date, "yyyy-MM-dd") || '';
                                }

                                $scope.ReminderObj.ReminderDate = $filter("date")(RemDate, "MM-dd-yyyy");
                                $scope.ReminderObj.Type = 'Date';
                                $scope.ReminderObj.ReminderRemarks = RemainderItem.Remarks || '';
                                $scope.ReminderObj.VisitTypeId = RemainderItem.ReminderVisitReasonId || null;
                                $scope.ReminderObj.VisitReasonName = RemainderItem.ReminderVisitReasonName || null;
                                $scope.ReminderObj.DoctorId = RemainderItem.ReminderDoctorId || null;
                                $scope.ReminderObj.ReminderStatusId = RemainderItem.ReminderStatusId || null;
                                $scope.ReminderObj.ReminderStatus = RemainderItem.ReminderStatus || "";


                                let tempArray = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.ReminderObj.DoctorId }, true);
                                if (tempArray.length > 0) {
                                    $scope.ReminderObj.DocObj = angular.copy(tempArray[0]);
                                }
                                $scope.ReminderTab = RemainderItem.ReminderTypeID;

                            }

                            $scope.navtoClearReminderObj = function () {
                                $uibModalInstance.close();
                            }

                            $scope.navtoSaveReminder = function () {

                                var SelectedDate = $filter("date")($scope.ReminderObj.ReminderDate, "yyyy-MM-dd") || null;
                                var SelectedDurationToDate = $filter("date")($scope.ReminderObj.DurationDate, "yyyy-MM-dd") || null;


                                if ($scope.ReminderObj.ReminderDate == "" && $scope.ReminderObj.Duration == "") {
                                    alertify.error("Please Select Reminder Date or Duration ");
                                    return;
                                }

                                if ($scope.ReminderTab == 2 && $scope.ReminderObj.DoctorId == null) {
                                    alertify.error("Please Select Doctor!");
                                    return;
                                }

                                if ($scope.ReminderTab == 2 && $scope.ReminderObj.VisitReasonName == "") {
                                    alertify.error("Please Select visit reason!");
                                    return;
                                }


                                var obj = {

                                    "UserId": $scope.UserId,
                                    "PatientAppointmentReminderId": 0,
                                    "HospitalId": $scope.HospitalId,
                                    "PatientId": $scope.PatientID || 0,
                                    "AppointmentId": $scope.appointmentid || 0,
                                    "Type": $scope.ReminderObj.Type,
                                    "Date": SelectedDate || SelectedDurationToDate || null,
                                    "DurationType": $scope.ReminderObj.DurationType,
                                    "Duration": null,
                                    "Remarks": $scope.ReminderObj.ReminderRemarks,
                                    "DoctorId": $scope.ReminderObj.DoctorId || null,
                                    "VisitTypeId": $scope.ReminderObj.VisitTypeId || null,
                                    "ReminderTypeID": ($scope.ReminderTab == 1) ? 1 : 2,
                                    "ReminderType": ($scope.ReminderTab == 1) ? "General Reminder" : "Appointment Reminder",
                                    "ReminderStatusId": 1,
                                    "NoShowStatusId": 4,
                                    "ReminderStatus": "To be Worked",
                                    "DeleteInd": "N",
                                    "IsFrom": "CRM",
                                    "PriorityId": $scope.ReminderObj.PriorityId ||0,
                                    "PriorityName": $scope.ReminderObj.PriorityName ||0,

                                }
                                if (RemainderItem !== "") {
                                    obj.PatientAppointmentReminderId = RemainderItem.PatientAppointmentReminderId || 0;
                                    if (obj.PatientAppointmentReminderId != 0) {
                                        obj.ReminderStatusId = $scope.ReminderObj.ReminderStatusId;
                                        obj.ReminderStatus = $scope.ReminderObj.ReminderStatus;
                                        obj.IsFrom = "OP";
                                    }
                                }
                                eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
                                    console.log(resp);
                                    if (resp.data.status == "Success") {
                                        alertify.success("Reminder Added Successfully");
                                        $uibModalInstance.close('Save');
                                        $scope.ReminderObj = getnewReminderObj();
                                    }
                                }, function (err) {
                                    alertify.error("Getting Failed");
                                });
                            }

                            $scope.GetSetReminderId = function () {

                                var param = {
                                    "AppointmentId": 0,
                                    "PatientId": $scope.PatientID || 0,
                                    "IsHistory": false
                                }

                                eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
                                    if (resp.data.status == "Success") {
                                        $scope.SetReminderArray = angular.copy(resp.data.rows);
                                    }
                                }, function (err) {
                                    alertify.error("Getting Failed");
                                });
                            }

                            $scope.ChangeDurationstep = function () {
                                $scope.BindfollowUpData($scope.ReminderObj.DurationType, 'click');
                            }

                            $scope.ClearDuration = function () {
                                $scope.ReminderObj.Duration = "";
                            };

                            $scope.BindfollowUpData = function (val, type) {
                                var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");
                                var FollowUpDuration = parseFloat($scope.ReminderObj.Duration) || 0;
                               // $scope.cacheStorageItem.FollowUpDurationType = val;
                               // $scope.cacheStorageItem.FollowUpDurationTypeName = val === "Y" ? "Year(s)" : (val === "C" ? "To Be continued" : (val === "M" ? "Month(s)" : (val === "D" ? "Day(s)" : (val === "W" ? "Week(s)" : (val === "L" ? "Life Time" : "")))));
                                var TempFollowUpObj = eHnotePatientDataService.GetFollowUpDate(FollowUpDuration, val, TodayDate);
                                $scope.ReminderObj.DurationDate = $filter('date')(new Date(TempFollowUpObj.FollowUpDate), "yyyy-MM-dd");
                            };
                            $scope.changeReminderType = function () {
                                $scope.ReminderObj.DurationType = 'D';
                                $scope.ReminderObj.Duration = '';
                                $scope.ReminderObj.ReminderRemarks = '';
                                $scope.ReminderObj.ReminderRemarks = '';
                                $scope.ReminderObj.ReminderDate = '';
                            }
                        }
                    });
                    $scope.mInstanceAdd.result.then(function (resp) {
                        if (resp == 'Save') {
                            var Description = $scope.NoShowAppointmentobj.NoShowReasonName + '/' + $scope.NoShowAppointmentobj.NoShowReasonRemarks;
                            let params = {
                                "UserId": $scope.UserId,
                                "AppointmentId": $scope.NoShowAppointmentobj.AppointmentId,
                                "HospitalID": $scope.HospitalId,
                                // "IsNoShowAppointment": ApptObject.IsNoShowAppointment,
                                "NoShowReasonRemarks": $scope.NoShowAppointmentobj.NoShowReasonRemarks,
                                "NoShowReasonId": $scope.NoShowAppointmentobj.NoShowReasonId,
                                "StatusDescription": Description,
                                "NoShowStatusId": 4,
                            }
                            eHnoteUserAppointmentDataService.UpdateAppointmentDetails(params).then(function (resp) {

                                $uibModalInstance.close();
                            }, function (err) {
                                console.log(err);
                                alertify.error("Getting Failed");
                            });
                        } else {
                            $uibModalInstance.close();
                        }
                  
                    }, function () { });
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }

        function BookApptPopupOpened() {
            var openBookAppt = "";
            var modalROSInstance = $uibModal.open({
                "templateUrl": "templates/appointment/BookAppointmentPopup.html",
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "appointment-full-popup",
                "controller": "UsNewBookAppointmentPopupCtrl",
                "resolve": {
                    "allUserList": function () { return angular.copy(allUserList); },
                    "openBookAppt": function () { return openBookAppt; }
                }
            });

            modalROSInstance.result.then(function (resp) {
                if (resp != 'cancel') {
                    var Description = $scope.NoShowAppointmentobj.NoShowReasonName + '/' + $scope.NoShowAppointmentobj.NoShowReasonRemarks;
                    let params = {
                        "UserId": $scope.UserId,
                        "AppointmentId": $scope.NoShowAppointmentobj.AppointmentId,
                        "HospitalID": $scope.HospitalId,
                        // "IsNoShowAppointment": ApptObject.IsNoShowAppointment,
                        "NoShowReasonRemarks": $scope.NoShowAppointmentobj.NoShowReasonRemarks,
                        "NoShowReasonId": $scope.NoShowAppointmentobj.NoShowReasonId,
                        "StatusDescription": Description,
                        "NoShowStatusId": 3,
                    }
                    eHnoteUserAppointmentDataService.UpdateAppointmentDetails(params).then(function (resp) {

                        $uibModalInstance.close();
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });
                } else {
                    $uibModalInstance.close();
                }

          
            }, function () {
               
            });

        };

        function BookApptPopupOpenedv2() {
            var openBookAppt = "";
            var modalROSInstance = $uibModal.open({
                "templateUrl": "templates/appointment/BookAppointmentPopupv3.html",
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "controller": "UsBookAppointmentPopupv2",
                "resolve": {
                    "allUserList": function () { return angular.copy(allUserList); },
                    "openBookAppt": function () { return openBookAppt; },
                    "BranchList": function () { return $scope.BranchesListArray || []; }
                }
            });

            modalROSInstance.result.then(function (resp) {
                if (resp != 'cancel') {
                    var Description = $scope.NoShowAppointmentobj.NoShowReasonName + '/' + $scope.NoShowAppointmentobj.NoShowReasonRemarks;
                    let params = {
                        "UserId": $scope.UserId,
                        "AppointmentId": $scope.NoShowAppointmentobj.AppointmentId,
                        "HospitalID": $scope.HospitalId,
                        // "IsNoShowAppointment": ApptObject.IsNoShowAppointment,
                        "NoShowReasonRemarks": $scope.NoShowAppointmentobj.NoShowReasonRemarks,
                        "NoShowReasonId": $scope.NoShowAppointmentobj.NoShowReasonId,
                        "StatusDescription": Description,
                        "NoShowStatusId": 3,
                    }
                    eHnoteUserAppointmentDataService.UpdateAppointmentDetails(params).then(function (resp) {

                        $uibModalInstance.close();
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });
                } else {
                    $uibModalInstance.close();
                }


            }, function () {

            });

        };

        function InitializeBranches(data, pagetype) {
            var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
            $scope.BranchesListArray = clinicAddress;

        }

        $scope.init = function () {

            var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
            InitializeBranches(NewBranchList, "PageLoad");
        };
        $scope.init();


        $scope.NoShowAppointmentobj.PatientFullName = $scope.NoShowAppointmentobj.PatientFullName || '';
        $scope.NoShowAppointmentobj.PatientDisplayId = $scope.NoShowAppointmentobj.PatientDisplayId || '';
        $scope.NoShowAppointmentobj.PatientID = $scope.NoShowAppointmentobj.PatientID || 0;
        $scope.NoShowAppointmentobj.PatientImageS3URL = $scope.NoShowAppointmentobj.S3URL || '';

        $scope.patiendetilsopen = function () {
            let patientId = $scope.NoShowAppointmentobj.PatientID || 0;
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



    }]);
"use strict";
eHnoteWebApp.controller("UsRemindersPopupCtrl", ["$scope", "$rootScope", "$location", "$filter", "RemainderItem", "ReminderTab", "ReturntoofficeItem","Reminderobj", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSurgeryService", "$q", "$timeout", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "USPrintService", "eHnoteAuditServices", "eHnoteConditionsDataService", "$uibModalInstance", "eHnoteUserDataService",
    function ($scope, $rootScope, $location, $filter, RemainderItem, ReminderTab, ReturntoofficeItem, Reminderobj, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSurgeryService, $q, $timeout, eHnoteMainAdminServices, eHnoteMainAppointmentService, USPrintService, eHnoteAuditServices, eHnoteConditionsDataService, $uibModalInstance, eHnoteUserDataService,) {
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        console.log($scope.UserAccessRights);
        console.log($scope.allUserList);

        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 18;
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        };
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };

        $scope.RoleId = userLoginDetails.RoleID;

        $scope.HeaderLogo = '';
        $scope.initOrgLogo = function () {
            var printobj = datapersistanceFactory.getItem("printSettingData");
            console.log(printobj);
            printobj.PrintHeaderImgUrl = printobj.PrintHeaderImgUrl || "";
            if (printobj.PrintHeaderImgUrl !== "") {
                $scope.toDataURL(printobj.PrintHeaderImgUrl, function (dataURL) {
                    $scope.HeaderLogo = dataURL;
                });
            }
        }
        Reminderobj = Reminderobj||''
        $scope.PatientID = Reminderobj.PatientID || 0;
        $scope.TypeId = Reminderobj.TypeId || 0;
        $scope.appointmentid = Reminderobj.appointmentid || 0;
        $scope.IsFrom = Reminderobj.IsFrom || '';

        ReminderTab = ReminderTab || 1;
        RemainderItem = RemainderItem || '';
        ReturntoofficeItem = ReturntoofficeItem || '';
        $scope.ReminderTab = ReminderTab;
        function OnloadAlluserlist() {
            $scope.allUserList = $scope.allUserList || [];
            if ($scope.allUserList.length > 0) {
                $scope.clinicDoctorList = [];
                if ($scope.allUserList.length > 0) {
                    angular.forEach($scope.allUserList, function (Aitem) {
                        /*if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {*/
                        if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                            $scope.clinicDoctorList.push(Aitem);
                        }
                    });
                }
                console.log("user list alredy loaded");
            } else {
                $q.all([
                    eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.SubOrganizationId, $scope.HospitalId),
                ]).then(function (resp) {
                    if (resp[0].data.status === "Success") {
                        if (resp[0].data.row.length > 0) {
                            $scope.allSubSpecializationsArray = resp[0].data.row;
                            $scope.listSubSplArray = angular.copy(resp[0].data.row);
                            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                                item.isChecked = true;
                            });
                        }
                        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
                        var reqObj = {
                            "BranchId": $scope.HospitalId,
                            "SubSpecializationIdArray": subSplArray
                        }

                        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                        function onGetUsersSuccess(response) {
                            if (response.rows.length > 0) {
                                $scope.allUserList = response.rows || [];



                                $scope.clinicDoctorList = [];
                                if ($scope.allUserList.length > 0) {
                                    angular.forEach($scope.allUserList, function (Aitem) {
                                        /*if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {*/
                                        if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                                            $scope.clinicDoctorList.push(Aitem);
                                        }
                                    });
                                }
                                if ($scope.clinicDoctorList.length > 0 && $scope.ReminderObj.DoctorId!=null) {
                                    let tempArray = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.ReminderObj.DoctorId }, true);
                                    if (tempArray.length > 0) {
                                        $scope.ReminderObj.DocObj = angular.copy(tempArray[0]);
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
            }
        };


        $scope.init = function () {
            OnloadAlluserlist();
        }
        $scope.init();
        $scope.switchReminderTab = function (val) {
            $scope.ReminderObj = getnewReminderObj();
            $scope.LogObj = {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.appointmentid || null,
                "PatientId": $scope.PatientID || null,
                "LogArray": [],
                "PerminantAddressLine1": "",
                "PerminantAddressLine2": "",
                "PerminantZipCode": "",
                "PerminantCountyName": "",
                "PerminantCityId": 0,
                "PerminantStateName": "",
                "PerminantCityName": "",
                "PerminantStateId": 0,
                "PerminantCountryName": "",
                "PerminantCountryId": 0,
                "PerminantCountyCodeObj": "",
                "PerminantZipCodeArray": [],

                "PostalAddressId": 0,
                "PostalAddressLine1": "",
                "PostalAddressLine2": "",
                "PostalZipCode": "",
                "PostalCountyName": "",
                "PostalCountyId": 0,
                "PostalCityName": "",
                "PostalCityId": 0,
                "PostalStateName": "",
                "PostalStateId": 0,
                "PostalCountryName": "",
                "PostalCountryId": 0,
                "PostalCountyCodeObj": "",
                "PostalZipCodeArray": [],
                "FamilyArray": [],
                "PatientNotes": "",
                "GenRemindersArray": [],

                "ReminderDate": "",
                //  "Type": "Date",
                "DurationType": "D",
                "Duration": "",
                "ReminderRemarks": "",
                "DoctorId": null,
                "VisitTypeId": null,
                //"DocObj": "",
                //"SearchText": "",
                //"VisitReasonName": "",
                "VisitReasonId": null,
                "ReminderStatusId": 1,
                //"ReminderStatus": "To be Worked"
            }

            $scope.ReminderTab = val;
        };

        function getnewReminderObj() {
            var obj = {
                "PatientReminderId": 0,
                "ReminderDate": "",
                "Type": "Date",
                "DurationType": "",
                "Duration": "",
                "ReminderRemarks": "",
                "DoctorId": null,
                "VisitTypeId": null,
                "DocObj": "",
                "SearchText": "",
                "VisitReasonName": "",
                "VisitReasonId": null,
                "ReminderStatusId": 1,
                "ReminderStatus": "To be Worked",
                "ReminderAppointmentDate": "",
                "IsAddtoRecall": false,
                "TypeId": null,
                "PriorityId": 0,
                "PriorityName": "",
            };
            return obj;
        }
        $scope.ReminderObj = getnewReminderObj();

        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.appointmentid || null,
            "PatientId": $scope.PatientID || null,
            "LogArray": [],
            "PerminantAddressLine1": "",
            "PerminantAddressLine2": "",
            "PerminantZipCode": "",
            "PerminantCountyName": "",
            "PerminantCityId": 0,
            "PerminantStateName": "",
            "PerminantCityName": "",
            "PerminantStateId": 0,
            "PerminantCountryName": "",
            "PerminantCountryId": 0,
            "PerminantCountyCodeObj": "",
            "PerminantZipCodeArray": [],

            "PostalAddressId": 0,
            "PostalAddressLine1": "",
            "PostalAddressLine2": "",
            "PostalZipCode": "",
            "PostalCountyName": "",
            "PostalCountyId": 0,
            "PostalCityName": "",
            "PostalCityId": 0,
            "PostalStateName": "",
            "PostalStateId": 0,
            "PostalCountryName": "",
            "PostalCountryId": 0,
            "PostalCountyCodeObj": "",
            "PostalZipCodeArray": [],
            "FamilyArray": [],
            "PatientNotes": "",
            "GenRemindersArray": [],

            "ReminderDate": "",
            "ReminderAppointmentDate": "",
            //  "Type": "Date",
            "DurationType": "D",
            "Duration": "",
            "ReminderRemarks": "",
            "DoctorId": null,
            "VisitTypeId": null,
            //"DocObj": "",
            //"SearchText": "",
            //"VisitReasonName": "",
            "VisitReasonId": null,
            "ReminderStatusId": 1,
            //"ReminderStatus": "To be Worked"
        }


        $scope.BindReminderData = function (val, type) {
            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");
            var FollowUpDuration = parseFloat(ReturntoofficeItem.FollowUpDuration) || 0;
            $scope.cacheStorageItem.FollowUpDurationType = val;
            $scope.cacheStorageItem.FollowUpDurationTypeName = val === "Y" ? "Year(s)" : (val === "C" ? "To Be continued" : (val === "M" ? "Month(s)" : (val === "D" ? "Day(s)" : (val === "W" ? "Week(s)" : (val === "L" ? "Life Time" : "")))));
            var TempFollowUpObj = eHnotePatientDataService.GetFollowUpDate(FollowUpDuration, $scope.cacheStorageItem.FollowUpDurationType, TodayDate);
            /*$scope.ReminderObj.DurationDate = TempFollowUpObj.FollowUpDate;*/
            $scope.ReminderObj.ReminderAppointmentDate = $filter('date')(new Date(TempFollowUpObj.FollowUpDate), "MM-dd-yyyy");
        };
        function getReminderDate(reminderAppointmentDateStr) {
            // Input format: MM-DD-YYYY
            var [month, day, year] = reminderAppointmentDateStr.split('-');
            var appointmentDate = new Date(year, month - 1, day);

            // Validate: If month rollover occurs, input was invalid
            if (appointmentDate.getMonth() !== (parseInt(month) - 1) || appointmentDate.getDate() !== parseInt(day)) {
                return "Invalid Date"; // or handle fallback
            }

            var today = new Date();
            today.setHours(0, 0, 0, 0);
            appointmentDate.setHours(0, 0, 0, 0);

            var diffInMs = appointmentDate - today;
            var diffDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

            let reminderDate;
            if (diffDays >= 30) {
                // Subtract 30 days
                reminderDate = new Date(appointmentDate);
                reminderDate.setDate(reminderDate.getDate() - 30);
            } else {
                // Less than 30 days, use same date
                reminderDate = '';
            }

            // Format: MM-DD-YYYY
            if (reminderDate != '') {
                var mm = String(reminderDate.getMonth() + 1).padStart(2, '0');
                var dd = String(reminderDate.getDate()).padStart(2, '0');
                var yyyy = reminderDate.getFullYear();

                return mm + '-' + dd + '-' + yyyy;
            }
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

        if (RemainderItem != '') {

            if (RemainderItem.Date == null) {
                var RemDate = $filter("date")(RemainderItem.Duration, "yyyy-MM-dd") || '';
            } else {
                var RemDate = $filter("date")(RemainderItem.Date, "yyyy-MM-dd") || '';
            }
            if (RemainderItem.ReminderAppointmentDate != null) {
                var apptDate = $filter("date")(RemainderItem.ReminderAppointmentDate, "yyyy-MM-dd") || '';
            }

            /*$scope.ReminderObj.ReminderDate = RemDate || '';*/
            $scope.ReminderObj.ReminderDate = $filter("date")(RemDate, "MM-dd-yyyy");
            $scope.LogObj.ReminderDate = $filter("date")(RemDate, "MM-dd-yyyy");
            $scope.ReminderObj.Type = 'Date';
            $scope.LogObj.Type = 'Date';
            $scope.ReminderObj.ReminderRemarks = RemainderItem.Remarks || '';
            $scope.LogObj.ReminderRemarks = RemainderItem.Remarks || '';
            $scope.ReminderObj.VisitTypeId = RemainderItem.ReminderVisitReasonId || null;
            $scope.LogObj.VisitTypeId = RemainderItem.ReminderVisitReasonId || null;
            $scope.ReminderObj.VisitReasonName = RemainderItem.ReminderVisitReasonName || null;
            $scope.ReminderObj.DoctorId = RemainderItem.ReminderDoctorId || null;
            $scope.LogObj.DoctorId = RemainderItem.ReminderDoctorId || null;
            $scope.ReminderObj.ReminderStatusId = RemainderItem.ReminderStatusId || null;
            $scope.LogObj.ReminderStatusId = RemainderItem.ReminderStatusId || null;
            $scope.ReminderObj.ReminderStatus = RemainderItem.ReminderStatus || "";
            $scope.LogObj.ReminderAppointmentDate = $filter("date")(apptDate, "MM-dd-yyyy");
            $scope.ReminderObj.ReminderAppointmentDate = $filter("date")(apptDate, "MM-dd-yyyy");

            let tempArray = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.ReminderObj.DoctorId }, true);
            if (tempArray.length > 0) {
                $scope.ReminderObj.DocObj = angular.copy(tempArray[0]);
            }
            $scope.ReminderTab = RemainderItem.ReminderTypeID;
            $scope.ReminderObj.PriorityName = RemainderItem.PriorityName;
        }

        if (ReturntoofficeItem != '') {
            ReturntoofficeItem.FollowUpDate = ReturntoofficeItem.FollowUpDate || "";
            ReturntoofficeItem.FollowUpDuration = ReturntoofficeItem.FollowUpDuration || "";

            $scope.ReminderObj.VisitReasonName = ReturntoofficeItem.FollowUpVisitReasonName;
            $scope.ReminderObj.VisitReasonId = ReturntoofficeItem.FollowUpVisitreasonId || 0;
            $scope.ReminderObj.VisitTypeId = ReturntoofficeItem.FollowUpVisitreasonId;

            if (ReturntoofficeItem.FollowUpDate != '' && ReturntoofficeItem.FollowUpDuration == '') {
                $scope.ReminderObj.ReminderAppointmentDate = ReturntoofficeItem.FollowUpDate || '';
                $scope.ReminderObj.ReminderDate = getReminderDate($scope.ReminderObj.ReminderAppointmentDate);

            } else if (ReturntoofficeItem.FollowUpDate == '' && ReturntoofficeItem.FollowUpDuration !== '') {
                if (ReturntoofficeItem.FollowUpDuration !== '' && ReturntoofficeItem.FollowUpDurationType != '') {
                    $scope.BindReminderData(ReturntoofficeItem.FollowUpDurationType, 'click');
                }
                $scope.ReminderObj.ReminderDate = getReminderDate($scope.ReminderObj.ReminderAppointmentDate);
            }
        }

        $scope.IsAddtoRecall = true;
        $scope.navtoClearReminderObj = function () {
            //$uibModalInstance.dismiss("cancel");
            $uibModalInstance.close();
        }

        $scope.navtoSaveReminder = function () {
            $scope.LogObj.LogArray = [];

            var SelectedDate = $filter("date")($scope.ReminderObj.ReminderDate, "yyyy-MM-dd") || null;
            var SelectedDurationToDate = $filter("date")($scope.ReminderObj.DurationDate, "yyyy-MM-dd") || null;


            if ($scope.ReminderTab == 2 && $scope.ReminderObj.DoctorId == null) {
                alertify.error("Please Select Doctor!");
                return;
            }

            if ($scope.ReminderTab == 2 && $scope.ReminderObj.VisitTypeId == null) {
                alertify.error("Please Select Visit Reason!");
                return;
            }


            if ($scope.ReminderObj.ReminderDate == "" && $scope.ReminderObj.Duration == "") {
                alertify.error("Please Select Reminder Date or Duration ");
                return;
            }
            if ($scope.ReminderObj.PriorityName == "" && $scope.ReminderObj.PriorityName == "") {
                alertify.error("Please Select Reminder Priority ");
                return;
            }
            var ReminderType = '';
            if ($scope.ReminderTab == 1) {
                ReminderType = 'General Reminder';
            } else if ($scope.ReminderTab == 2) {
                ReminderType = 'Appointment Reminder'
            } else if($scope.ReminderTab == 5) {
                ReminderType = 'Glass Reminder';
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
                //"Duration": SelectedDurationToDate || null,
                "Duration": $scope.ReminderObj.Duration || "",
                "Remarks": $scope.ReminderObj.ReminderRemarks,
                "DoctorId": $scope.ReminderObj.DoctorId || null,
                "VisitTypeId": $scope.ReminderObj.VisitTypeId || null,
                "ReminderTypeID": $scope.ReminderTab,
                "ReminderType": ReminderType,
                "ReminderStatusId": 1,
                "ReminderStatus": "To be Worked",
                "DeleteInd": "N",
                "ReminderAppointmentDate": $scope.ReminderObj.ReminderAppointmentDate || null,
                "IsAddtoRecall": $scope.IsAddtoRecall || false,
                "FollowUpId": ReturntoofficeItem.FollowUpId || RemainderItem.FollowUpId|| 0,
                "TypeId": $scope.TypeId || 0,
                "IsFrom": "CRM",
                "Logs": {},
                "PriorityId": $scope.ReminderObj.PriorityId || RemainderItem.PriorityId,
                "PriorityName": $scope.ReminderObj.PriorityName || RemainderItem.PriorityName,
            }
            RemainderItem = RemainderItem || '';
            if (RemainderItem !== '') {
                obj.PatientAppointmentReminderId = RemainderItem.PatientAppointmentReminderId || 0;
                if (obj.PatientAppointmentReminderId != 0) {
                    obj.ReminderStatusId = $scope.ReminderObj.ReminderStatusId;
                    obj.ReminderStatus = $scope.ReminderObj.ReminderStatus;
                  //  obj.IsFrom = "OP";
                }
            }

            let ActionType = '', ScreenType = '', count = 0

            if ($scope.appointmentinfo.AppointmentType == 'ASC') {
                ScreenType = 'ASC List';
            }
            else {
                ScreenType = 'Pre-Admission';
            }

            if ($scope.LogObj.ReminderDate == "" && $scope.LogObj.Duration == "" && $scope.LogObj.ReminderRemarks == '' && $scope.LogObj.VisitTypeId == null && $scope.LogObj.DoctorId == null && $scope.LogObj.ReminderStatusId == 1) {

                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }
            if (($scope.ReminderObj.DurationType != $scope.LogObj.DurationType) || ($scope.ReminderObj.ReminderRemarks != $scope.LogObj.ReminderRemarks) || ($scope.ReminderObj.DoctorId != $scope.LogObj.DoctorId) || ($scope.ReminderObj.VisitTypeId != $scope.LogObj.VisitTypeId) || ($scope.ReminderObj.Duration != $scope.LogObj.Duration) || ($scope.ReminderObj.ReminderDate != $scope.LogObj.ReminderDate) || ($scope.ReminderObj.ReminderStatusId != $scope.LogObj.ReminderStatusId)) {
                count++
            }
            if (count != 0) {
                if ($scope.ReminderTab == 1) {
                    let logobj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 10,
                        "SubModuleName": "Profile",
                        "ScreenType": ScreenType,
                        "ActionType": ActionType,
                        //"ActionDescription": "General Reminder in profile screen from " + ScreenType,
                        "ActionDescription": `General Reminder in profile screen from  ${ScreenType}  For Appointment ID: ${$scope.appointmentinfo.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(logobj);
                }
                else if ($scope.ReminderTab == 2) {
                    let logobj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 10,
                        "SubModuleName": "Profile",
                        "ScreenType": ScreenType,
                        "ActionType": ActionType,
                        // "ActionDescription": "Appointment Reminder in profile screen from " + ScreenType,
                        "ActionDescription": `Appointment Reminder in profile screen from  ${ScreenType}  For Appointment ID: ${$scope.appointmentinfo.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(logobj);
                } else {
                    let logobj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 10,
                        "SubModuleName": "Profile",
                        "ScreenType": ScreenType,
                        "ActionType": ActionType,
                        "ActionDescription": `Glass Reminder in profile screen from  ${ScreenType}  For Appointment ID: ${$scope.appointmentinfo.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(logobj);
                }

            }
            if ($scope.LogObj.LogArray.length > 0) {
                obj.Logs = $scope.LogObj || {};
            }
            eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.status == "Success") {
                    alertify.success("Reminder Added Successfully");
                    //$scope.GetSetReminderId();
                    $scope.ReminderObj = getnewReminderObj();
                    if ($scope.IsFrom !=='Profile') {
                        $uibModalInstance.close($scope.PatientID);
                    }
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }

        $scope.GetSetReminderId = function () {

            var param = {
                /*"AppointmentId": $scope.appointmentid || 0,*/
                "AppointmentId": 0,
                "PatientId": $scope.PatientID || 0,
                "IsHistory": false
            }

            eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.SetReminderArray = angular.copy(resp.data.rows);
                    //$scope.mInstanceAdd.close($scope.SetReminderArray);
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
            $scope.cacheStorageItem.FollowUpDurationType = val;
            $scope.cacheStorageItem.FollowUpDurationTypeName = val === "Y" ? "Year(s)" : (val === "C" ? "To Be continued" : (val === "M" ? "Month(s)" : (val === "D" ? "Day(s)" : (val === "W" ? "Week(s)" : (val === "L" ? "Life Time" : "")))));
            var TempFollowUpObj = eHnotePatientDataService.GetFollowUpDate(FollowUpDuration, $scope.cacheStorageItem.FollowUpDurationType, TodayDate);
            /*$scope.ReminderObj.DurationDate = TempFollowUpObj.FollowUpDate;*/
            $scope.ReminderObj.DurationDate = $filter('date')(new Date(TempFollowUpObj.FollowUpDate), "yyyy-MM-dd");

            var TempDate = $filter('date')(new Date(TempFollowUpObj.FollowUpDate), "MM-dd-yyyy");
            $scope.minAppointmentDate = angular.copy(TempDate);
        };
        $scope.changeReminderType = function () {
            $scope.ReminderObj.DurationType = 'D';
            $scope.LogObj.DurationType = 'D';
            $scope.ReminderObj.Duration = '';
            $scope.LogObj.Duration = '';
            // $scope.ReminderObj.ReminderRemarks = '';
            // $scope.LogObj.ReminderRemarks = '';
            //$scope.ReminderObj.ReminderRemarks = '';
            $scope.ReminderObj.ReminderDate = '';
            $scope.LogObj.ReminderDate = '';

        }


        $scope.uibclose = function () {
            $uibModalInstance.close("cancel");
        };


        $scope.minAppointmentDate = new Date();
        $scope.onReminderDateChange = function () {
            if ($scope.ReminderObj.ReminderDate) {
                $scope.minAppointmentDate = $scope.ReminderObj.ReminderDate;
            }
        };
        $scope.GetAllMasterClaimsData = function () {
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.MasterPriority.length > 0) {
                        $scope.MasterPriority = resp.data.MasterPriority || [];
                    }
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }
        $scope.GetAllMasterClaimsData();
        $scope.ChangePrioritylist = function (PriorityList) {
            $scope.ReminderObj.PriorityId = PriorityList.PriorityId || 0;
            $scope.ReminderObj.PriorityName = PriorityList.PriorityName || "";
        }
    }]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 10);
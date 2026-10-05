eHnoteWebApp.controller("UsParentProfileMainCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", "eHnoteUserAppointmentDataService", function ($scope, $rootScope, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate, eHnoteUserAppointmentDataService) {

    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.DrFullName = doctorinfo.doctordata.UserAddress[0].FullName;
    $scope.RoleId = $scope.userLoginDetails.RoleID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.patientid = 0;
    $scope.patientid = $scope.mainPatientProfileObj.PatientId || 0;
   
    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
    $scope.defaultBillingProviderId = 0;
    if (doctorinfo !== undefined) {
        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {
                $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                $scope.defaultBillingProviderId = doctorinfo.doctordata.UserAddress[0].DefaultBillingProviderId || 0;
            }
        }
    }
    console.log($scope.mainPatientProfileObj);
    $scope.PatientAlerts = [];
    console.log($scope.mainPatientProfileObj.PatientDetailSummary);
    console.log($scope.PatientAddressSummary);
    $scope.PatientDetailSummary = angular.copy($scope.PatientDetailsInfo);
    $scope.LogObj = {
        "UserId": $scope.UserId || null,
        "OrganizationId": $scope.HospitalId || null,
        "AppointmentId": $scope.appointmentinfo.AppointmentID || null,
        "PatientId": $scope.appointmentinfo.PatientID || null,
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

    function GetRegisterPatientNotes() {
        var obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
           // "AppointmentId": $scope.appointmentinfo.AppointmentID,
            "PatientNotesId": 0,
            "PatientNotes": "",
            "UserId": $scope.UserId,
            "DeleteInd": "N",
            "NoteType": "Profile",
            "NoteTypeId": 1,
            "Logs": {},
        };
        return obj;
    }
    $scope.RegisterPatientNotes = GetRegisterPatientNotes();
    //$scope.RegisterPatientNotesArray = [];
    $scope.IsEditPatientNotes = false;

    $scope.ConfirmboxObj = {
        "IsWorkOffline": false
    }

    $scope.GetPatientNotesAlertsById = function () {
        $scope.PatientAlertsList = [];
        let obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": $scope.HospitalId,
            "StatusId": 1
        }
        eHnoteInsuranceService.GetPatientAlertsNew(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                if (resp.data.rows.length > 0) {
                    //$scope.PatientAlertsList = angular.copy(resp.data.rows) || [];
                    $scope.PatientAlertsList = $filter('filter')(resp.data.rows, function (item) {
                        return item.NoteTypeId != 6;
                    }) || [];
                    $scope.PatientAlerts = [];

                  $timeout(() => {
                        if($scope.PatientAlertsList.length > 0) {
                        angular.forEach($scope.PatientAlertsList, function (item) {
                            var counter = 0;
                            if (item.AlertData !== null) {
                                if (item.AlertData.AlertTypesList.length > 0) {
                                    angular.forEach(item.AlertData.AlertTypesList, function (Bitem) {
                                        if (Bitem.AlertTypeId == 5) {
                                            counter++;
                                        }
                                    })
                                }
                            }
                            if (counter !== 0) {
                                $scope.PatientAlerts.push(item);
                            }
                        });
                    }
                    },0)
                }
            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.init = function () {
        var NumberOfAppointments = 3;
        $scope.SetReminderArray = [];
        $scope.RegisterPatientNotesArray = [];
        $scope.patientid = $scope.mainPatientProfileObj.PatientId || 0;
        var param = {
            /*"AppointmentId": $scope.Appointmentid || 0,*/
            "AppointmentId": 0,
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "IsHistory": false
        }
        var reqobj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "NoteTypeId": 1
        }
        let PatientAlertobj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": $scope.HospitalId,
            "StatusId": 1
        }
        $q.all([
            //eHnoteUserAppointmentDataService.GetPatientAllNewandOldAppointmentsList($scope.appointmentinfo.PatientID, $scope.ParentHospitalId, NumberOfAppointments),
            eHnoteMainAppointmentService.GetSetReminderDetails(param),
            eHnoteInsuranceService.getPatientInsuranceDtls($scope.mainPatientProfileObj.PatientId, 0, true),
            eHnoteSettingsDataService.GetPatientNotesById(reqobj),
            eHnoteInsuranceService.GetPatientAlertsNew(PatientAlertobj),

        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                $scope.SetReminderArray = resp[0].data.rows || [];
            }
            if (resp[1].data.Status === "Success") {
                // here i am filtering the insurance those are in active only , if any one need all insurace list i have mention the expire list also .pavan1616
                let ActiveInsuranceList = [];
                if (resp[1].data.rows.length > 0) {
                   // ActiveInsuranceList = $filter('filter')(resp[1].data.rows, { 'StatusId': 1 }, true) || [];
                        ActiveInsuranceList = $filter('filter')(resp[1].data.rows, function (item) {
                        return item.StatusId === 1 || item.StatusId === 5;
                       }) || [];
                }
                $scope.PatientInsuranceSummary = ActiveInsuranceList;
                $scope.ExpiredPatientInsuranceList = resp[1].data.ExpiredPatientInsuranceList || [];
            }
            if (resp[2].data.Status === "Success") {
                $scope.RegisterPatientNotesArray = resp[2].data.rows || [];
                $scope.RegisterPatientNotes = GetRegisterPatientNotes();
                $scope.IsEditPatientNotes = false;
            }
            if (resp[3].data.Status == "Success") {
                if (resp[3].data.rows.length > 0) {
                    /*$scope.PatientAlertsList = resp[3].data.rows || [];*/
                    $scope.PatientAlertsList = $filter('filter')(resp[3].data.rows, function (item) {
                        return item.NoteTypeId != 6;
                    }) || [];
                    $scope.PatientAlerts = [];

                    if ($scope.PatientAlertsList.length > 0) {
                        angular.forEach($scope.PatientAlertsList, function (item) {
                            var counter = 0;
                            if (item.AlertData !== null) {
                                if (item.AlertData.AlertTypesList.length > 0) {
                                    angular.forEach(item.AlertData.AlertTypesList, function (Bitem) {
                                        if (Bitem.AlertTypeId == 5) {
                                            counter++;
                                        }
                                    })
                                }
                            }
                            if (counter !== 0) {
                                $scope.PatientAlerts.push(item);
                            }
                        });


                    }

                    //$scope.PatientAlertsList = $scope.PatientAlertsList.filter(function (item) {
                    //    if (item.AlertData !== null) {
                    //        item.AlertData.AlertTypesList = item.AlertData.AlertTypesList.filter(function (aitem) {
                    //            return aitem.AlertTypeId == 5;
                    //        });
                    //        return item.AlertData.AlertTypesList.length > 0;
                    //    };
                    //});
                } else {
                    $scope.PatientAlertsList = [];
                }
            }
        }, function (err) {
            alertify.error("Getting Data Failed");
        });
        //$scope.GetPatientNotesAlertsById();
        $scope.getPatientDepositAmountById();

    }
    $scope.init();

    $scope.Technishionsend = function (type, mainitem) {
        $scope.type = type || "";
        $scope.selectedoutPatient = mainitem || "";
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        if (appointmentinfo.CheckinStatusId != undefined) {
            if (appointmentinfo.CheckinStatusId === 1 && type != "NotCheckIN") {
                alertify.error("Please make sure patient is checked-in");
                return false;
            }
        }
        $scope.IsShowCheckinDeatilsInd = false;
        var PatientObj = {
            "PatientName": $scope.PatientDetailsInfo.FullName,
            "PatientId": $scope.PatientDetailsInfo.PatientID,
            "PhAreaCD": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '',
            "PhCntryCD": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode || '',
            "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber || '',
            "MobileNo": $scope.PatientDetailsInfo.MobileNo || '',
            "DOB": $scope.PatientDetailsInfo.DOB || '',
            "OldMRNo": $scope.PatientDetailsInfo.OldMrno || '',
            "PatientDisplayId": $scope.PatientDetailsInfo.PatientDisplayID || '',
            "CheckInBy": "",
            "BookingStatusId": null,

        };

        PatientObj.CheckInBy = "";
        $scope.DynamicStatusInstanceAdd = $uibModal.open({
            templateUrl: "sendToPatientTemplate.html",
            "windowClass": "modal__ninety--",
            "resolve": {
                "HospitalId": function () { return $scope.HospitalId; },
                "subSplArray": function () { return $scope.allSubSpecializationsArray; },
                "allUserList": function () { return $scope.allUserList; },
                "DoctorFullName": function () { return $scope.DoctorFullName; },
                "appointmentid": function () { return $scope.cacheStorageItem.appointmentid; },
                "AppointmentDoctorID": function () { return $scope.cacheStorageItem.AppointmentDoctorID; },
                "patientid": function () { return $scope.patientid; },
                "roleId": function () { return $scope.userLoginDetails.RoleID; },
                "Type": function () { return $scope.type; },
                "PatientprofileStatusDetails": function () { return $scope.PatientprofileStatusDetails; },
                "HospitalEquipmentList": function () { return $scope.HospitalEquipmentList; },
                "AppointmentObj": function () { return appointmentinfo; },
                "ProfileStatusMasterId": function () { return $scope.cacheStorageItem.ProfileStatusMasterId; },
                "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; },
                "selectedoutPatient": function () { return angular.copy($scope.selectedoutPatient); },
                "PatientObj": function () { return PatientObj || {}; }

            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, Type, PatientprofileStatusDetails, HospitalEquipmentList, AppointmentObj, ProfileStatusMasterId, PatientDetailsInfo, selectedoutPatient, PatientObj) {
                $scope.PatientDetailsInfo = PatientDetailsInfo || "";
                $scope.RoleId = roleId;
                $scope.Type = Type;
                $scope.HospitalId = HospitalId;
                $scope.DoctorFullName = DoctorFullName;
                $scope.allUserList = allUserList;
                $scope.allSubSpecializationsArray = subSplArray;
                $scope.appointmentid = appointmentid;
                $scope.AppointmentDoctorID = AppointmentDoctorID;
                $scope.patientid = patientid;
                $scope.PatientprofileStatusDetails = PatientprofileStatusDetails || {};
                $scope.HospitalEquipmentList = HospitalEquipmentList || [];
                $scope.AppointmentObj = AppointmentObj || {};
                $scope.IsShowCheckinDeatilsInd = true;
                $scope.ProfileStatusMasterId = ProfileStatusMasterId || 3;
                $scope.PatientObj = PatientObj || {};

                $scope.RoomType = {
                    "IsSelectedCheckout": false,
                    "IsSelectedExpressCheckout": false
                };

                let selectedPatientTagList = $scope.PatientDetailsInfo.PatientTagList || [];
                $scope.SelectedPatientTagList = angular.copy($scope.HospitalEquipmentList);

                angular.forEach(selectedPatientTagList, function (item) {
                    angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                        if (kitem.HospitalEquipmentId === item.HospitalEquipmentId) {
                            kitem.IsChecked = true;
                        }
                    });
                });

                $scope.TagPatientObj = {
                    "SelectTag": "Select Tag Patient",
                    "PatientTag": "",
                    "AllPatientTagsCheck": false,
                };

                $scope.checkAllPatientTags = function (val) {
                    if (val) {
                        angular.forEach($scope.SelectedPatientTagList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.TagPatientObj.SelectTag = 'All';
                    }
                    else {
                        angular.forEach($scope.SelectedPatientTagList, function (item) {
                            item.IsChecked = false;
                        });

                        $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
                    }

                };

                $scope.PatientTagToggle = function (item) {
                    var checkedArray = _.where($scope.SelectedPatientTagList, { IsChecked: true });
                    $scope.TagPatientObj.AllPatientTagsCheck = checkedArray.length > 0 && $scope.SelectedPatientTagList.length === checkedArray.length ? true : false;
                    if ($scope.TagPatientObj.AllPatientTagsCheck) {
                        $scope.TagPatientObj.SelectTag = 'All';
                    }

                    if (!$scope.TagPatientObj.AllPatientTagsCheck && checkedArray.length > 0) {
                        $scope.TagPatientObj.SelectTag = 'Selected';
                    }
                    if (checkedArray.length > 4) {
                        item.IsChecked = false;
                        alertify.error("Patient Tag Limit is Reached");
                        return false;
                    }
                };

                $scope.stopClosingDropDown = function (event) {
                    event.stopPropagation();
                }

                $scope.selectedoutPatient = selectedoutPatient || {};
                if ($scope.Type == 'NotCheckIN') {
                    $scope.ApptObj = {
                        "VisitTypeId": $scope.selectedoutPatient.VisitTypeId || 0,
                        "HospitalEquipmentId": $scope.selectedoutPatient.PatientTagId || "",
                        "Type": Type || "",
                        "SerachText": "",
                        "VisitReasonName": $scope.selectedoutPatient.VisitReason,
                        "AppointmentStatusId": $scope.selectedoutPatient.AppointmentStatusId || null,
                        "BookingStatusId": $scope.selectedoutPatient.BookingStatusId || 2,



                    };
                } else {
                    $scope.ApptObj = {
                        "VisitTypeId": $scope.AppointmentObj.VisitTypeId || 0,
                        "HospitalEquipmentId": $scope.AppointmentObj.PatientTagId || "",
                        "Type": Type || "",
                        "SerachText": "",
                        "VisitReasonName": $scope.AppointmentObj.VisitReason,
                        "AppointmentStatusId": $scope.AppointmentObj.AppointmentStatusId || null,
                        "BookingStatusId": $scope.AppointmentObj.BookingStatusId || 2,
                    };
                }

                $scope.onSelectVisitReason = function (item) {
                    item = item || "";
                    if (item.ReasonId !== "") {
                        $scope.ApptObj.VisitReasonName = item.Reason;
                        $scope.ApptObj.VisitReasonId = item.ReasonId || 0;
                        $scope.ApptObj.VisitTypeId = item.ReasonId;
                    }
                }

                if ($scope.allUserList.length !== 0) {
                    //$scope.clinicDoctorList = [];
                    $scope.Calendardoctorlist1 = [];

                    $scope.AllCounsollerList = angular.copy($scope.allUserList);

                    $scope.AllTechnicianList = angular.copy($scope.allUserList);

                    $scope.AllDoctorList = angular.copy($scope.allUserList);

                    $scope.AllBillingList = angular.copy($scope.allUserList);
                    $scope.AllReceptionList = angular.copy($scope.allUserList);
                    $scope.AllOpthaList = angular.copy($scope.allUserList);

                    $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                        return (item.RoleId === 1 && item.SuffixId === 10) || (item.RoleId === 43 && item.SuffixId === 10);
                    });

                    $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                    $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                        return item.RoleId === 18;
                    });

                    $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                    $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                        return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                    });

                    $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                    $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                        return item.RoleId === 2 || item.RoleId === 19;
                    });

                    $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
                    $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                        return item.RoleId === 2;
                    });

                    $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                    $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                        return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13);
                    });

                }
                $scope.searchfilterforRoom = {
                    "txt1": "",
                    "txt2": "",
                    "txt3": "",
                    "txt4": "",
                    "txt5": "",
                    "txt8": "",
                    "txt9": "",
                    "txt10": "",
                    "txt11": "",
                };
                $scope.popup_value = 1;
                eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                    $scope.RoomTypeList = resp.data;
                    $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });

                    if ($scope.Type == 'NotCheckIN') {
                        $scope.RoomTypeList = $filter("filter")($scope.RoomTypeList, function (item, index) { return item.Id !== 7 });
                    }

                }, function (err) {
                    console.log(err);
                    alertify.error("Getting  Failed");
                });
                $scope.switchtonexttab = function (val) {
                    $scope.popup_value = val;
                };

                $scope.GetVisitReasonfunction = function (val) {
                    var AppointmentTypeId = "";
                    if ($scope.Type == 'NotCheckIN') {
                        AppointmentTypeId = $scope.selectedoutPatient.AppointmentTypeId;
                    } else {
                        AppointmentTypeId = $scope.AppointmentObj.AppointmentTypeId;
                    }

                    var getParams = {
                        "OrganizationId": $scope.HospitalId,
                        "ReasonTypeId": 1,
                        "SearchText": val || "",
                        "VisitTypeId": $scope.selectedoutPatient.AppointmentTypeId || null
                    };
                    eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
                        if (resp.data !== undefined) {
                            if (resp.data.rows.length > 0) {
                                $scope.GetVisitReasonsArray = [];
                                $scope.GetVisitReasonsArray = $filter("filter")(resp.data.rows, function (kitem) {
                                    return kitem.ActiveIND == "Y";
                                });
                            }

                        }
                    });
                }
                if ($scope.Type == 'NotCheckIN') {
                    $scope.GetVisitReasonfunction();
                }
                $scope.GetVisitReasonfunction();

                $scope.RoomSearchObj = {
                    "RoomTypeId": 0,
                    "RoomId": 0,
                    "RoomTypeobj": "",
                    "Opthamobj": "",
                    "OptomId": null,
                    "Technicianobj": "",
                    "TechnicianId": null,
                    "Counsellorobj": "",
                    "CounsellorId": null,
                    "DilationAssistantobj": "",
                    "DilationAssistantId": null,
                    "DoctorId": null,
                    "sendtoDoctorRoleId": null,
                    "Roomobj": "",
                    "Remarks": "",
                    "SelectDoctor": "",
                    "sendtoDoctorId": "",
                    "TransferUserId": eHnoteMasterDataService.getLoginId(),
                    "otherDocInd": false,
                    "SubSpecialityObj": "",
                    "SubSpecialityId": "",
                    "NewApptEndTime": "",
                    "NewApptStartTime": ""
                }

                $scope.ChangesSendToUser = function (item) {
                    $scope.RoomSearchObj.TransferUserId = item.DoctorID;
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                }

                $scope.ChangesRoomType = function (item) {
                    $scope.RoomSearchObj.NewApptStartTime = "";
                    $scope.RoomSearchObj.NewApptEndTime = "";
                    $scope.RoomSearchObj.otherDocInd = "N";
                    $scope.RoomSearchObj.RoomTypeId = item;
                    $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "", "txt9": "", "txt10": "", "txt11": "" };
                    $scope.RoomSearchObj.SelectDoctor = "";
                    $scope.RoomSearchObj.TransferUserId = "";

                    if (item != 7) {
                        $scope.RoomType.IsSelectedCheckout = false;
                        $scope.RoomType.IsSelectedExpressCheckout = false;
                    }

                    if ($scope.RoomSearchObj.RoomTypeId === 1) {
                        $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                        $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;
                        $scope.RoomSearchObj.TransferUserId = $scope.SelectDoctor.DoctorID || null;


                    }

                    var params = {
                        "HospitalId": $scope.HospitalId,
                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                        "SearchText": "",
                        "PageNumber": 1,
                        "PageSize": 100
                    }
                    eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                        if (data.Status === "Success") {
                            $scope.RoomListarray = data.rows || [];
                        } else {
                            $scope.RoomListarray = [];
                        }

                    }).error(function (error) {

                    });


                }

                $scope.closeRoom = function (item) {
                    $uibModalInstance.dismiss("cancel");
                };


                $scope.ChangesRoom = function (item) {
                    item = item || null;
                    if (item !== null) {
                        $scope.RoomSearchObj.RoomId = item.RoomId || 0;
                        $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability || 0;
                        $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity || 0;
                    } else {
                        $scope.RoomSearchObj.RoomId = 0;
                        $scope.RoomSearchObj.RoomAvailability = 0;
                        $scope.RoomSearchObj.RoomCapacity = 0;
                    }

                };

                $scope.ChangesOptham = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.OptomId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.RoomSearchObj.BillingUserId = null;
                    $scope.searchfilterforRoom.txt2 = "";
                };

                $scope.ChangesBillingUser = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.BillingUserId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt9 = "";
                };

                $scope.ChangesReceptionUser = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.RoomSearchObj.ReceptionId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.searchfilterforRoom.txt10 = "";
                };

                function reStructureDoctorSelectedSlots(resp) {
                    if (resp.IsLeave) {
                        alertify.error("Doctor is on Leave.Please choose another doctor");
                        return false;
                    }
                    if (resp.UserConsultationNew.length > 0) {
                        var apptTypeId = parseInt(appointmentinfo.AppointmentTypeId);
                        resp.UserConsultationNew[0].NewAppointmentMaxSlots = resp.UserConsultationNew[0].NewAppointmentMaxSlots || 0;
                        resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots = resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || 0;
                        resp.UserConsultationNew[0].OTAppointmentMaxSlots = resp.UserConsultationNew[0].OTAppointmentMaxSlots || 0;
                        if (apptTypeId == 1) {
                            if (resp.UserConsultationNew[0].NewAppointmentMaxSlots != 0) {
                                if (resp.DoctorNewAppointmentCount > resp.UserConsultationNew[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserConsultationNew[0].NewAppointmentMaxSlots) {
                                    alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                    return false;
                                }
                            }
                        } else if (apptTypeId == 2 || apptTypeId == 3) {
                            if (resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots != 0) {
                                if (resp.DoctorFollowUpAppointmentCount > resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots) {
                                    alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                    return false;
                                }
                            }
                        } else if (apptTypeId == 4 || apptTypeId == 14) {
                            if (resp.UserConsultationNew[0].OTAppointmentMaxSlots != 0) {
                                if (resp.DoctorAscAppointmentCount > resp.UserConsultationNew[0].OTAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserConsultationNew[0].OTAppointmentMaxSlots) {
                                    alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                                    return false;
                                }
                            }
                        }
                    }

                    $scope.timeslots = [];
                    var GivenDate = resp.Date;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);

                    $scope.iscurrentDate = false;


                    if (GivenDate > CurrentDate) {
                        $scope.iscurrentDate = false;
                    } else {
                        $scope.iscurrentDate = true;
                    }
                    $scope.time = $filter('date')(new Date(), 'HH:mm');
                    angular.forEach(resp.UserConsultationNew, function (item) {

                        var arr = item.SlotStartTime.split(':');
                        var shour = $.trim(arr[0]);
                        var smin = $.trim(arr[1]);


                        var arr2 = item.SlotEndTime.split(':')
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
                            $scope.timeslots.push(slotObj);


                        }
                        if ($scope.iscurrentDate === true) {
                            $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                        }
                    });

                    angular.forEach($scope.timeslots, function (item) {
                        angular.forEach(resp.NormalSlots, function (item1) {
                            if (item.StartTime == item1.StartTime) {
                                item.Available = 'N';
                            }
                        });
                    });

                    $scope.setValue = [];
                    if ($scope.timeslots.length > 0) {
                        angular.forEach($scope.timeslots, function (item1) {
                            if (item1.Available === 'Y') {
                                var res = item1.StartTime.split(":");
                                item1.StartTime = res[0] + ":" + res[1];
                                $scope.setValue.push(item1);
                            }
                        });
                        if ($scope.setValue.length > 0) {
                            $scope.patinet_appStarttime = $scope.setValue[0];
                            $scope.RoomSearchObj.NewApptStartTime = $scope.patinet_appStarttime.StartTime;
                            $scope.RoomSearchObj.NewApptEndTime = $scope.patinet_appStarttime.EndTime;
                            $scope.RoomSearchObj.otherDocInd = "Y";
                        } else {
                            alertify.error("Doctor Slot is not available.Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_appStarttime = "";
                            $scope.RoomSearchObj.sendtoDoctorId = null;
                            $scope.RoomSearchObj.NewApptStartTime = "";
                            $scope.RoomSearchObj.NewApptEndTime = "";
                            $scope.RoomSearchObj.otherDocInd = "N";

                        }


                    } else {
                        alertify.error("Doctor is not available.Please choose another doctor");
                        $scope.setValue = [];
                        $scope.patinet_appStarttime = "";
                        $scope.EndtimeVAlue = "";
                        $scope.RoomSearchObj.NewApptStartTime = "";
                        $scope.RoomSearchObj.NewApptEndTime = "";
                        $scope.RoomSearchObj.otherDocInd = "N";
                        $scope.RoomSearchObj.sendtoDoctorId = null;
                        return;
                    }
                }
                $scope.getUserBranchslots = function (item) {
                    var SelectedDoctorId = parseInt(item.DoctorID);
                    var SelectedUserBranchId = parseInt(item.UserBranchId);


                    var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    var params = {
                        "DoctorId": SelectedDoctorId,
                        "UserBranchId": SelectedUserBranchId,
                        "Date": appointmentDate
                    }
                    console.log(params);
                    eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);

                    function OnGetSuccess(response) {
                        console.log(JSON.stringify(response));
                        if (response.status === 'Success') {


                            angular.forEach(response.NormalSlots, function (item) {
                                item.StartTime = item.StartTime.substring(0, 5);
                            });
                            angular.forEach(response.TeleSlots, function (item) {
                                item.StartTime = item.StartTime.substring(0, 5);
                            });

                            reStructureDoctorSelectedSlots(response);
                        }

                    }
                    function OnGetError(response) {
                        var MinPerCaseval = SelectedDoctorObj.MinPerCase || 5;
                        bindDoctorSlots(MinPerCaseval, 'current');
                    }








                };
                $scope.ChangesRoomDoctor = function (item) {

                    if ($scope.AppointmentDoctorID == item.DoctorID) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.DoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.OptomId = null;
                        $scope.RoomSearchObj.CounsellorId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.TechnicianId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.searchfilterforRoom.txt1 = "";
                        $scope.RoomSearchObj.BillingUserId = null;
                    } else {

                        $scope.getUserBranchslots(item);
                        $scope.RoomSearchObj.DoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    }
                };

                $scope.ChangesCounsellor = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.CounsellorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt4 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.ChangesTechnician = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.TechnicianId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt5 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.ChangeOpthaUser = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = item.DoctorID;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt11 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.ChangesCheckItem = function (item, checkoutItem) {
                    if (checkoutItem === true) {
                        $scope.RoomSearchObj.sendtoDoctorId = null;
                        $scope.RoomSearchObj.RoomTypeobj = "";
                        $scope.submitbutton = "Save";
                        $scope.ChangesRoomType(item);
                    } else {
                        $scope.RoomSearchObj.RoomTypeobj = "";
                        $scope.submitbutton = "Send";
                    }
                };



                $scope.SendToRoom = function (item) {
                    if ($scope.Type == 'NotCheckIN') {
                        if ($scope.GetVisitReasonsArray.length > 0) {
                            var filterVisitReasons = $filter('filter')($scope.GetVisitReasonsArray, { "ReasonId": $scope.ApptObj.VisitTypeId }, true);
                            if (filterVisitReasons.length == 0) {
                                alertify.error("Please Select visit Reason");
                                return false;
                            }
                        }
                    }
                    $scope.ApptObj.AppointmentStatusId = $scope.ApptObj.AppointmentStatusId || null;
                    $scope.RoomSearchObj.Remarks = $scope.RoomSearchObj.Remarks || '';
                    if ($scope.ApptObj.AppointmentStatusId == 1 && $scope.ApptObj.BookingStatusId == 2 && $scope.RoomSearchObj.Remarks == '') {
                        alertify.error("Please Enter Remarks");
                        return false;
                    }

                    $scope.RoomSearchObj.RoomTypeId = $scope.RoomSearchObj.RoomTypeId || 0;
                    if ($scope.RoomSearchObj.RoomTypeId === 0) {
                        alertify.error("Select Room Type");
                        return false;
                    }



                    if ($scope.RoomSearchObj.RoomTypeId == 1 && $scope.RoomSearchObj.otherDocInd === "Y") {
                        $scope.RoomSearchObj.sendtoDoctorId = $scope.RoomSearchObj.sendtoDoctorId || 0;
                        if ($scope.RoomSearchObj.sendtoDoctorId === 0) {
                            alertify.error("Select Doctor");
                            return false;
                        }
                    }
                    if ($scope.RoomSearchObj.otherDocInd === "Y") {
                        if ($scope.RoomSearchObj.NewApptStartTime === "") {
                            alertify.error("Doctor is not available.Please choose another doctor");
                            return false;
                        }
                    }

                    $scope.PatientTagList = [];
                    let selectedPatientTagList = $filter('filter')($scope.SelectedPatientTagList, { "IsChecked": true }, true);
                    $scope.PatientTagList = angular.copy(selectedPatientTagList);
                    if ($scope.RoomType.IsAppointmentConfirmed == true) {
                        $scope.ApptObj.BookingStatusId = 1
                    }

                    $scope.Time = $filter("date")(new Date(), "HH:mm");
                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                    var params = "";
                    if ($scope.Type == 'NotCheckIN') {
                        params = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "TransferUserId": $scope.RoomSearchObj.TransferUserId,
                            "HospitalId": $scope.HospitalId,
                            "AppointmentId": $scope.selectedoutPatient.AppointmentID,
                            "AppointmentTrackerDetailId": 0,
                            "RoleId": $scope.RoleId,
                            "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                            "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                            "RoomId": $scope.RoomSearchObj.RoomId,
                            "IsSendTo": "N",
                            "IsRollBack": "N",
                            "IsCheckedIn": "Y",
                            "Remarks": $scope.RoomSearchObj.Remarks || '',
                            "CurrentTime": $scope.CurrentTime,
                            "IsCheckedOut": "N",
                            "IsReCheckIn": "N",
                            "IsReCheckOut": "N",
                            "IsExpressCheckedOut": "N",
                            "VisitTypeId": $scope.ApptObj.VisitTypeId,
                            "BookingStatusId": $scope.ApptObj.BookingStatusId || null,
                            "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                            "PatientTagList": $scope.PatientTagList || []
                        };
                    } else {
                        params = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "TransferUserId": $scope.RoomSearchObj.TransferUserId,
                            "HospitalId": $scope.HospitalId,
                            "AppointmentId": $scope.appointmentid,
                            "AppointmentTrackerDetailId": 0,
                            "RoleId": $scope.RoleId,
                            "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                            "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                            "RoomId": $scope.RoomSearchObj.RoomId,
                            "Remarks": $scope.RoomSearchObj.Remarks || '',
                            "IsSendTo": "Y",
                            "IsRollBack": "N",
                            "IsCheckedIn": "N",
                            "CurrentTime": $scope.CurrentTime,
                            "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                            "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                            "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                            "IsCheckedOut": "N",
                            "IsReCheckIn": "N",
                            "IsReCheckOut": "N",
                            "IsExpressCheckedOut": "N",
                            "VisitTypeId": $scope.ApptObj.VisitTypeId,
                            "BookingStatusId": $scope.ApptObj.BookingStatusId || null,
                            "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                            "PatientTagList": $scope.PatientTagList || []
                        };
                    }

                    if (params.RoomTypeId === 7 && !$scope.RoomType.IsSelectedExpressCheckout) {
                        params.RoomId = null;
                        params.IsCheckedOut = "Y";
                        params.Status = 'Completed';
                    } else if (params.RoomTypeId === 7 && $scope.RoomType.IsSelectedExpressCheckout) {
                        params.RoomId = null;
                        params.IsExpressCheckedOut = "Y";
                        params.Status = 'Completed';
                    }
                    eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                        if (resp.data.Status == "Success") {

                        } else {
                            alertify.error("Patient is Active at Another User,You Can't Send Patient");
                        }
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });
                    $uibModalInstance.close();


                }

            },

        });
        $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
            if ($scope.type == 'OutPatient') {
                $scope.SelectPatient($scope.selectedoutPatient.PatientId);
                $scope.parentProfileTab.MainTab = 1;
                $scope.showpatientsummary = false;

                $scope.IsConsultationCompleted = false;
                $scope.resetAllConsultationArea();
                $scope.ClickPatientProfile($scope.selectedoutPatient);
                $scope.ConsultationObj.SummaryView = false;
                $scope.SaveTypeObj.TypeName = "";
            } else if ($scope.type == 'BacktoOP') {
                $location.url($scope.PreviousUrl);
            }
            else if ($scope.type == "NotCheckIN") {

                if ($scope.selectedoutPatient.AppointmentID == appointmentinfo.AppointmentID) {
                    $scope.IsSendtopopupshow = true;
                }
                $scope.init();
            }
            else {
                $location.url($scope.PreviousUrl);
            }
        }, function (cancel) {
        });

    }

    $scope.navtoCheckInPopup = function (Mainitem) {

        if (Mainitem.BookingTypeId == 2) {
            alertify.error("Patient is in waiting status! Please make sure patient has confirmed appointment. ");
            return false;
        }

        var todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
        var futureDate = false;
        if (Mainitem.ConsultationDt > todaydate) {
            futureDate = true;
        }

        if (futureDate) {
            alertify.error("for future appointment Checkin/Checkout not allowed");
            return;
        }
        $scope.Technishionsend("NotCheckIN", Mainitem);
    };

    $scope.CancelAppointmentList = function (item) {
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        item.PatientDetails = appointmentinfo.PatientDetails;
        $scope.Patientname = item.PatientDetails.FullName || item.PatientDetails.fullName;
        $scope.EmailId = item.PatientDetails.EmailId;
        $scope.CancelAppointmentobj.Doctor_Name = item.DoctorFullName;
        $scope.DoctorFullName = item.DoctorFullName;
        $scope.DoctorEmail = item.DoctorEmail;
        $scope.appDate = item.ConsultationDt;
        $scope.TIME = item.StartTime;
        $scope.TokenNumber = item.TokenNumber;
        $scope.MobileNumber = item.PatientDetails.MobileNo;
        $scope.MobileNumber1 = item.PatientDetails.PhCntryCD + "" + item.PatientDetails.PhAreaCD + "" + item.PatientDetails.HomeNumber;
        item.CountryCode = item.CountryCode || "";
        if (item.CountryCode != "") {
            $scope.DocPHnumber = item.DoctorMobile;
        } else {
            $scope.DocPHnumber = item.CountryCode + "" + item.DoctorMobile;
        }
        $scope.cancelHospitalId = item.BranchId || 0;
        $scope.CancelReasonId = "";
        $scope.Cancelappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Cancelappointmentinfo.AppointmentID = item.AppointmentID;
        $scope.Cancelappointmentinfo.AppointmentStatusId = item.AppointmentStatusId;
        $scope.Cancelappointmentinfo.BookingTypeId = item.BookingTypeId;
        $scope.Cancelappointmentinfo.BookingStatusId = item.BookingStatusId;

        $scope.Cancelappointmentinfo.PatientID = item.PatientId;
        $scope.Cancelappointmentinfo.PatientDetails = item.PatientDetails;
        $scope.Canceldoctorid = item.DoctorId;
        $scope.CancelStTime = item.StartTime;
        $scope.CancelEdTime = item.EndTime;
        $scope.CanceltmpConsultationDt = item.ConsultationDt;
        $scope.currentshowloading = true;
        $scope.CancelVisitRsnType = item.AppointmentTypeId;

        $scope.IsTeleMedicineSlot = item.IsTeleMedicineSlot;
        $scope.CommunicationEmailId = item.CommunicationEmailId || "";
        $scope.DocCommunicationPhnumber = item.CommunicationCountryCode + "" + item.CommunicationMobileNo;
        $scope.Cancelappointmentinfo.BranchSubSpecializationId = item.BranchSubSpecializationId;
        $scope.Cancelappointmentinfo.SubSpecializationId = item.SubSpecializationId;

        $scope.sendPatientEmail = $scope.PatientDetailSummary.ContactInfo.IsPatientEmailInd || false;
        $scope.sendPatientSms = $scope.PatientDetailSummary.ContactInfo.IsPatientSmsInd || false;
        $scope.Cancelappointmentinfo.CheckinStatusId = item.CheckinStatusId || 1;
        $scope.Cancelappointmentinfo.VisitTypeId = item.VisitTypeId || null;
        $scope.Cancelappointmentinfo.IsNoShowAppointment = item.IsNoShowAppointment;
        $scope.Cancelappointmentinfo.OtherCancelReason = "";

        $scope.CancelAppointmentobj.S3URL = item.PatientDetails.S3URL || "";

        var datetime = $scope.appDate + "T" + $scope.TIME
        $scope.CancelAppointmentobj.AppointmentDate_Time = datetime;
        $scope.CancelAppointmentobj.CancelReasonId = 0;
        $scope.CancelAppointmentobj.OtherCancelReason = '';
        $scope.CancelAppointmentobj.sendPatientSms = false;
        $scope.CancelAppointmentobj.IsSmsLanguageIdInd = false;
        $scope.CancelAppointmentobj.sendDocSms = false;
        $scope.CancelAppointmentobj.sendDocEmail = false;
        $scope.CancelAppointmentobj.sendPatientEmail = false;
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/CancelAppointmentPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",

            "controller": function ($scope, $uibModalInstance) {

                $scope.CancelclosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.ChnageCancelReasion = function (id) {
                    id = id || 0;
                    var TempReasion = $filter("filter")($scope.CancelAppointmentobj.CancelAppReason, function (item, index) { return item.CancelVisitReasonId == id; }) || [];
                    $scope.CancelAppointmentobj.CancelReason = TempReasion[0].CancelReason || '';
                };

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
                        $scope.PatientDetailsInfo.DisplayMobileNumber = part1 + part2 + part3;

                        if ($scope.USnumberString.length > 9) {
                            var Area = $scope.USnumberString.slice(0, 3);
                            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = Area;
                            var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                            $scope.PatientDetailsInfo.ContactInfo.HomeNumber = contact;
                        }
                    } else {
                        $scope.PatientDetailsInfo.DisplayMobileNumber = "";
                        $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = "";
                        $scope.PatientDetailsInfo.ContactInfo.HomeNumber = "";
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

                    var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");



                    var CurrentDate = $filter("date")(new Date(), "yyyy-MM-dd");
                    if ($scope.CanceltmpConsultationDt === CurrentDate) {
                        if ($scope.Cancelappointmentinfo.AppointmentStatusId == 1) {
                            $scope.Cancelappointmentinfo.AppointmentStatusId = 7;  // last min cancel
                        } else if ($scope.Cancelappointmentinfo.AppointmentStatusId == 2) {
                            $scope.Cancelappointmentinfo.AppointmentStatusId = 6;   //check-in cancel
                        }
                    } else {
                        $scope.Cancelappointmentinfo.AppointmentStatusId = 5;   //planed cancel
                    }

                    $scope.CancelAppointmentobj.SmsLanguageId = 152;
                    if ($scope.CancelAppointmentobj.IsSmsLanguageIdInd == true) {
                        $scope.CancelAppointmentobj.SmsLanguageId = 45;
                    } else {
                        $scope.CancelAppointmentobj.SmsLanguageId = 152;
                    }
                    var CancelVisitReId = 0;
                    if (CancelReasonId != undefined) {
                        CancelVisitReId = CancelReasonId.CancelVisitReasonId;
                    }
                    if ($scope.CancelAppointmentobj != undefined) {
                        $scope.sendDocSms = $scope.CancelAppointmentobj.sendDocSms || false;
                        $scope.sendPatientSms = $scope.CancelAppointmentobj.sendPatientSms || false;
                    }
                    else {
                        $scope.sendDocSms = false;
                        $scope.sendPatientSms = false;
                    }
                    var AppmntParams = {
                        "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
                        "AppointmentStatus": "C",
                        "StartTime": $scope.CancelStTime,
                        "EndTime": $scope.CancelEdTime,
                        "IsFollowUp": false,
                        "DoctorID": $scope.Canceldoctorid,
                        "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                        "DayCD": currentdaycode,
                        "VisitUserTypeID": "OPATIENT",
                        "OtherVisitRsn": "",
                        "ConsultationDt": $scope.CanceltmpConsultationDt,
                        "PatientID": $scope.Cancelappointmentinfo.PatientID,
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "USRType": "DOCTOR",
                        "DoctorVisitRsnID": $scope.CancelVisitRsnType,
                        "HospitalDetails": {
                            "HospitalID": $scope.cancelHospitalId,
                            "LoginHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,//For sms Purpose added by sabarish
                            "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,//For sms Purpose added by sabarish
                            "SenderId": doctorinfo.doctordata.UserAddress[0].SMSSenderId,
                            "IsSMSInd": doctorinfo.doctordata.UserAddress[0].IsSMSInd
                        },
                        "CommunicationDetails": {
                            "PatientName": $scope.Patientname,
                            "PatientMobile": $scope.MobileNumber1,
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
                            "CommunicationEmailId": $scope.CommunicationEmailId || "",
                            "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
                            "DisplayNumber": $scope.DisplayNumber,
                        },
                        "PreviousAppointmentTime": "",
                        "SendDocSms": $scope.sendDocSms,
                        "SendDocEmail": $scope.sendDocEmail,
                        "SendPatientEmail": $scope.sendPatientEmail,
                        "SendPatientSms": $scope.sendPatientSms,
                        "StatusDescription": OtherCancelReason,   // Cancelinfo.CancelReason,
                        "PaidFollowup": false,
                        "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot,
                        "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
                        "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
                        "CurrentTime": CurrentCheckOutTime || null,
                        "IsCheckedIn": $scope.Cancelappointmentinfo.CheckinStatusId || 1,
                        "VisitTypeId": $scope.Cancelappointmentinfo.VisitTypeId || null,
                        "IsPatientSmsInd": $scope.sendPatientSms || false,
                        "IsPatientEmailInd": $scope.sendPatientEmail || false,
                        "CancelReasonId": CancelVisitReId,
                        "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.AppointmentPatientTypeId,
                        "PatientSmsLanguageId": 152,
                        "IsNoShowAppointment": $scope.Cancelappointmentinfo.IsNoShowAppointment || false,
                        "BookingStatusId": $scope.Cancelappointmentinfo.BookingStatusId,
                        "AppointmentStatusId": $scope.Cancelappointmentinfo.AppointmentStatusId,
                        "BookingTypeId": $scope.Cancelappointmentinfo.BookingTypeId,

                        "OtherProviderDoctorID": 0,
                        "SurgeryReferralDoctorId": 0,
                        "ReasonTypeId": 0,
                        "SmsLanguageId": $scope.CancelAppointmentobj.SmsLanguageId,
                        "ParentAppointmentVisitReasonId": $scope.Cancelappointmentinfo.VisitTypeId || null
                    };

                    var currenturl = $location.absUrl().split('?')[0];
                    var CurrentEnvironment = currenturl.split('/#')[0];
                    AppmntParams.SmsLanguageId = 123; // english
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
                        $scope.sendDocSms = false;
                        $scope.sendDocEmail = false;
                        $scope.sendPatientSms = false;
                        $scope.sendPatientEmail = false;

                        if ($scope.CommunicationdetailsArray !== undefined && $scope.CommunicationdetailsArray.length > 0) {
                            angular.forEach($scope.CommunicationdetailsArray, function (item, index) {
                                if (item.Mode === 'doctor') {
                                    $scope.sendDocSms = item.SmsSettingsObj.Appointment;
                                    $scope.sendDocEmail = item.EmailSettingObj.Appointment;
                                }
                                if (item.Mode === 'patient') {
                                    $scope.sendPatientSms = item.SmsSettingsObj.Appointment;
                                    $scope.sendPatientEmail = item.EmailSettingObj.Appointment;
                                }
                            });
                        }
                        if (data.response.TokenNumber) {
                            $scope.Token = data.response.TokenNumber;
                        }
                        //$scope.mInstanceAdd.dismiss("cancel");
                        $scope.mInstanceAdd.close();
                    }
                    function OnCaseSaveError(data) {
                        alertify.error("Error in Cancelling Appointment");
                    }
                }

                var getParams = {
                    "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "PageSize": 100,
                    "PageNumber": 1
                };

                return eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {

                    if (resp.data !== undefined) {
                        if (resp.data.rows.length > 0) {
                            $scope.CancelAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                        }
                        //var obj = {
                        //    "ReasonId": 1,
                        //    "CancelReason": "Others"
                        //};
                        //$scope.CancelAppointmentobj.CancelAppReason.push(obj);
                    }
                });

            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            $scope.init();
        }, function () {

        });
    };

    $scope.CancelAppointmentPatient = function (item) {
        if (item.DoctorVisitRsnID === 8) {
            return;
        }
        $scope.CancelAppointmentList(item);
    };

    $scope.updateCheckInStatus = function (othervisitrsn, Status, row, name) {

        $scope.checkInObj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "RoleId": $scope.userLoginDetails.RoleID,
            "AppointmentId": "",
            "CheckInStatus": 2,
            "VisitReason": "",
            "AttenderName": ""
        };
        $scope.CheckforCheckInStatus = "";
        $scope.CancelOtherReasonText = "";

        if (Status === 1) {

            $scope.checkInObj.AppointmentId = row.AppointmentID;

        }

        $scope.checkInObj.CheckInStatus = Status;

        $scope.checkInObj.VisitReason = othervisitrsn;
        $scope.checkInObj.AttenderName = name || "";
        $scope.checkInObj.HospitalID = row.BranchId;

        $scope.CheckforCheckInStatus = row.CheckinStatusId;
        $scope.CancelAppointmentPatient(row);

    };

    function BookApptPopupOpenedV2(item) {
        var openBookAppt = item || "";
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
            $scope.init();
        }, function () {

        });

    }

    $scope.EditAppointmentPopup1 = function (item) {

        var Sarray = item.StartTime.split(":");
        var stime = Sarray[0] + ":" + Sarray[1];
        var earray = item.EndTime.split(":");
        var etime = earray[0] + ":" + earray[1];

        let surgeryList = [];
        if (item.AppointmentTypeId == 7) {
            surgeryList = angular.copy(item.PreAdmSurgeryList);

        } else if (item.AppointmentTypeId == 4 || item.AppointmentTypeId == 14) {
            surgeryList = angular.copy(item.SurgeryList);
        }

        var Obj = {
            "PageName": "reschedule",
            "AppDate": $scope.AppDate,
            "ispatientExistsval": true,
            "calenderDate": $scope.calenderDate,
            "AppointmentId": item.AppointmentID || null,
            "AppointmentDate": item.ConsultationDt,
            "PatientId": item.PatientId || null,
            'IsComingFrom': '',
            "DoctorId": item.DoctorId,
            "StartTime": stime,
            "EndTime": etime,
            "SurgeryList": surgeryList || []

        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        var opencallcenterpopup = "";
        if (($scope.userLoginDetails.RoleID === 20 || $scope.userLoginDetails.RoleID === 70) && $scope.PreviousUrl === "/crm") {
            opencallcenterpopup = "crm";
        }

        BookApptPopupOpenedV2(opencallcenterpopup);

    };
    $scope.GetSetReminderId = function (Array) {

        angular.forEach(Array, function (item) {
            $scope.Appointmentid = item.AppointmentID;
        });

        var param = {
            /*"AppointmentId": $scope.Appointmentid || 0,*/
            "AppointmentId": 0,
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "IsHistory": false
        }

        eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                $scope.SetReminderArray = resp.data.rows;
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }

    
    $scope.ClickRemindersPopup = function (RemainderItem,type,item) {
        RemainderItem = RemainderItem || '';
        item = item||''
        type = type || 1;
        var Reminderobj = {
            "TypeId":1,
            "appointmentid": $scope.appointmentinfo.AppointmentId||0,
            "PatientID": $scope.cacheStorageItem.PatientID || $scope.cacheStorageItem.patientid || 0,
            "IsFrom": "Profile",
        }
        if (RemainderItem !='') {
            if (RemainderItem.CreatedById != $scope.UserId) {
                alertify.error("User doesn't have access to edit reminder!");
                return;
            }
        }

        //$scope.clinicDoctorList = [];
        //if ($scope.mainPatientProfileObj.AllUsersList.length > 0) {
        //    angular.forEach($scope.mainPatientProfileObj.AllUsersList, function (Aitem) {
        //        /*if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {*/
        //        if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
        //            $scope.clinicDoctorList.push(Aitem);
        //        }
        //    });
        //}

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
                        /*"windowClass": "modal-full",*/
                        "resolve": {
                            //"UserId": function () { return $scope.UserId; },
                            //"HospitalId": function () { return doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID; },
                            //"appointmentid": function () { return $scope.appointmentinfo.AppointmentId;},
                            "Reminderobj": function () { return Reminderobj; },
                            "RemainderItem": function () { return RemainderItem; },
                           /* "clinicDoctorList": function () { return $scope.clinicDoctorList; },*/
                            "ReminderTab": function () { return type; },
                            "ReturntoofficeItem": function () { return item; },
                        },
                    });
                    $scope.reminderModalInstance.result.then(function (resp) {
                        //$scope.SetReminderArray = resp || [];
                        $scope.GetSetReminderId();

                    }, function () {

                    });

                }

            }
        });


    };


    $scope.ProfileAdditionalinfoPopover = {
        templateUrl: 'templates/uibpopups/ProfileAdditionalinfoPopover.html',
    };

    $scope.AddUpdatePrintlog = function (string) {
        var obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "BranchId": $scope.HospitalId,
            "PrintName": string,
            "ScreenTypeName": "Profile",
            "CurrentTime": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss")
        };
        eHnotePatientDataService.AddUpdatePrintLogInfo(obj).then(function (resp) {

        });
    };

    $scope.ConsultationEntryFormPrint1 = function (item, string) {

        eHnoteMainAppointmentService.getAdditionalApptDetailsById(item.AppointmentID).then(function (resp) {
            resp.data = resp.data || [];
            if (resp.data.length > 0) {

                item.PatientInsuranceList = resp.data[0].PatientInsuranceList;

                var ConsultationDt = '';
                ConsultationDt = $filter("date")((item.ConsultationDt), "MM-dd-yyyy");
                var DOB = $filter("date")(($scope.PatientDetailsInfo.DOB), "MM-dd-yyyy");
                item.PatientInsuranceList = item.PatientInsuranceList || [];
                $scope.PayorName = '';
                if (item.PatientInsuranceList.length > 0) {
                    angular.forEach(item.PatientInsuranceList, function (Sitem) {
                        $scope.PayorName += Sitem.PayorName + ',';
                    });
                }
                var mobile = eHnoteUserDataService.UsMobileFormatChange($scope.PatientDetailsInfo.ContactInfo.MobileNumber);
                var WalkInTime = '';
                if (item.CheckinStatusId == 2) {
                    WalkInTime = $filter('date')(item.WalkInTime, "hh:mm a");
                }
                var datetime = item.ConsultationDt + "T" + item.StartTime;
                var ConvertDateStartTime = $filter('date')(datetime, "hh:mm a");
                item.ConvertDateStartTime = ConvertDateStartTime;
                var CreatedByName = "";
                if (doctorinfo.doctordata.User.length > 0) {
                    CreatedByName = doctorinfo.doctordata.User[0].SecondUserFullName || "";
                }
                var ReferralName = resp.data[0].Patient.PCPDoctorName || "";
                var PcpNPI = resp.data[0].Patient.PcpNPI || "";
                var Othernotes = resp.data[0].AppointmentDetails[0].OtherNotes || "";

                let PreAuthorizationNumber = '';
                resp.data[0].AppointmentPreAuthDetails = resp.data[0].AppointmentPreAuthDetails || [];
                if (resp.data[0].AppointmentPreAuthDetails.length > 0) {
                    let AppointmentPreAuthDetails = resp.data[0].AppointmentPreAuthDetails || [];
                    let count = 0;
                    angular.forEach(AppointmentPreAuthDetails, function (item) {
                        item.PreAuthorizationNumber = item.PreAuthorizationNumber || '';
                        if (count > 0) {
                            PreAuthorizationNumber += ', ';
                        }
                        PreAuthorizationNumber += item.PreAuthorizationNumber;
                        count++;
                    });
                }

                var printobj = {
                    "PatientName": $scope.PatientDetailsInfo.FullName || "",
                    "MRNo": $scope.PatientDetailsInfo.PatientDisplayID || "",
                    "MobileNo": mobile.UsFormatMobileNumber || "",
                    "Date": ConsultationDt || "",
                    "StartTime": item.ConvertDateStartTime || "",
                    "DoctorFullName": item.DoctorFullName || "",
                    "VisitReason": item.VisitReason || "",
                    "MedicalPlan": $scope.PayorName || "",
                    "PatientInsuranceList": item.PatientInsuranceList || [],
                    "PatientOldMrNo": $scope.PatientDetailsInfo.OldMrno,
                    "WalkInTime": WalkInTime,
                    "DOB": DOB,
                    "PCPReferenceNumber": resp.data[0].Patient.PCPReferenceNumber || "",
                    "PCPSecondReferenceNumber": resp.data[0].Patient.PCPSecondReferenceNumber || "",
                    "ReferralName": ReferralName || "",
                    "PcpNPI": PcpNPI || "",
                    "Authorization": PreAuthorizationNumber || "",
                    "CreatedBy": CreatedByName,
                    "PreAuthorizationCode": resp.data[0].AppointmentDetails[0].PreAuthorizationCode,
                    "OtherNotes": Othernotes || ""
                }
                USPrintService.generateConsultationEntryForm5(printobj);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });
        $scope.AddUpdatePrintlog(string);
    }

    $scope.PatientDemographicPrint = function (string, item) {

        $scope.PatientApptInsuInfo = item.PatientInsuranceList || [];
        let InsurenceItemPrint = [];
        // those are in active state insurance
        if ($scope.PatientApptInsuInfo.length > 0) {
            angular.forEach($scope.PatientApptInsuInfo, function (item) {
                let PrintPatientInsuranceDetailId = $filter("filter")($scope.PatientInsuranceSummary, function (fitem) {
                    return fitem.PatientInsuranceDetailId === item.PatientInsuranceDetailId;
                });
                if (PrintPatientInsuranceDetailId.length > 0) {
                    InsurenceItemPrint.push(PrintPatientInsuranceDetailId[0]);
                }

            });
        }
        // those are in other state of insurance 
        if ($scope.ExpiredPatientInsuranceList.length > 0) {
            angular.forEach($scope.PatientApptInsuInfo, function (pitem) {
                let PrintPatientInsuranceDetailId = $filter("filter")($scope.ExpiredPatientInsuranceList, function (fitem) {
                    return fitem.PatientInsuranceDetailId === pitem.PatientInsuranceDetailId;
                });
                if (PrintPatientInsuranceDetailId.length > 0) {
                    InsurenceItemPrint.push(PrintPatientInsuranceDetailId[0]);
                }
            });
        }
        var Obj = {
            "PatientBaseInfo": angular.copy($scope.PatientDetailsInfo),
            "Addressinfo": $scope.PatientAddressSummary,
            "DesignationInfo": $scope.PatientApptPCPInfo || "",
            "Demographicinfo": $scope.DemographicSummary || "",
            "insuranceinfo": angular.copy(InsurenceItemPrint) || [],
            "PatientImg": $scope.PatientProfileImageBase64 || "",
            "PatientNotes": angular.copy($scope.RegisterPatientNotesArray) || []
        };
        Obj.PatientBaseInfo.PatientMobileNumber = $scope.PatientMobileNumber || "";
        Obj.PatientBaseInfo.PatientOfficeNumber = $scope.PatientOfficeNumber || "";
        Obj.PatientBaseInfo.EmailID = Obj.PatientBaseInfo.ContactInfo.EmailID || "";
        if (Obj.insuranceinfo.length > 0) {
            angular.forEach(Obj.insuranceinfo, function (item) {
                item.EligibilityStatusName = "";
                item.frontbase64 = "";
                var filter = $filter("filter")($scope.InsuranceStatusList1, { "StatusId": item.EligibilityStatusId }) || [];
                if (filter.length > 0) {
                    item.EligibilityStatusName = filter[0].StatusName;
                }

                if (item.PatientDocumentDetails.length > 0) {
                    angular.forEach(item.PatientDocumentDetails, function (subitem) {
                        if (subitem.IsBackSidefile == false) {
                            var filter1 = $filter("filter")($scope.PatientInsurancebase64, { "Documentid": subitem.DocumentId }) || [];
                            if (filter1.length > 0) {
                                item.frontbase64 = filter1[0].frontbase64;
                            }
                        }
                    });
                }
            });
        }

        USPrintService.generatePatientDemograpicPrint(Obj);
        $scope.AddUpdatePrintlog(string);
    }

    $scope.getPatientInsuranceDetailsOfPatient = function () {
        var includeInactive = true;
        eHnoteInsuranceService.getPatientInsuranceDtls($scope.appointmentinfo.PatientID, 0, includeInactive).then(function (response) {

            if (response.data !== undefined) {
                $scope.ExpiredPatientInsuranceList = response.data.ExpiredPatientInsuranceList || [];
                if (response.data.rows.length > 0) {

                    let ActiveInsuranceList = [];
                    if (response.data.rows.length > 0) {
                       // ActiveInsuranceList = $filter('filter')(response.data.rows, { 'StatusId': 1 }, true) || [];
                        ActiveInsuranceList = $filter('filter')(response.data.rows, function (item) {
                            return item.StatusId === 1 || item.StatusId === 5;
                        }) || [];
                    }
                    $scope.PatientInsuranceSummary = ActiveInsuranceList;
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                        bitem.isCorporateType = false;
                        if (bitem.BillingCategoryTypeId === 15) {
                            bitem.isCorporateType = true;
                        }
                    });
                    //$scope.PatientInsuranceObj = GetInsuranceObj();
                    if ($scope.patientInsuranceTpasArray.length > 0) {
                        if ($scope.patientInsuranceTpasArray.length === 1) {
                            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                        }
                        else if ($scope.patientInsuranceTpasArray.length > 1) {
                            var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.setprimary = true;
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            } else {
                                $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            }
                        }

                        $scope.patientInsuranceTpasArray = $filter('filter')($scope.patientInsuranceTpasArray, { 'StatusId': 1 }, true) || [];
                        if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                            $scope.PatientInsuranceObj.setprimary = true;
                        } else {
                            $scope.PatientInsuranceObj.setprimary = false;
                        }
                    }
                    else {
                        $scope.PatientInsuranceObj.IdentifierId = 1;
                        $scope.PatientInsuranceObj.setprimary = true;
                    }


                }
                else {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                }
            }
        });
    }
   
    $scope.continuetoCheckInsuranceEligibility = function (item) {
        if ($scope.PatientDetailsInfo.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return;
        }
        //if ($scope.PatientDetailsInfo.FirstName.length < 3) {
        //    alertify.error("Please Enter Patient First Name");
        //    return;
        //}
        $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName || "";
        if ($scope.PatientDetailsInfo.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return;
        }
        if ($scope.PatientDetailsInfo.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return;
        }

        if ($scope.PatientDetailsInfo.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return;
        }
        $scope.PatientDetailsInfo.SocialSecurityNo = $scope.PatientDetailsInfo.SocialSecurityNo || null;
        //if ($scope.PatientDetailsInfo.SocialSecurityNo === null) {
        //    alertify.error("Please Enter Valid SSN Number");
        //    return;
        //}


        //var SSNno = angular.copy($scope.PatientDetailsInfo.SocialSecurityNo) || "";
        //SSNno = SSNno.toString();
        //if ((SSNno == "") || (SSNno != "" && SSNno.length !== "" && SSNno.length < 9)) {
        //    alertify.error("Please Enter Valid SSN Number");
        //    return;
        //}

        item.PlanId = item.PlanId || null;
        if (item.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        item.PolicyId = item.PolicyId || null;
        if (item.PolicyId === null) {
            alertify.error("Please Enter Policy ID");
            return;
        }
        //item.GroupId = item.GroupId || null;
        //if (item.GroupId === null) {
        //    alertify.error("Please Enter Group");
        //    return;
        //};
        if (item.RelationShipId != 1) {
            if (item.InsuredPersonFirstName === "") {
                alertify.error("Please Enter Insured Person First Name");
                return;
            }
            if (item.InsuredPersonFirstName.length < 3) {
                alertify.error("Please Enter Insured Person First Name");
                return;
            }
            item.InsuredPersonLastName = item.InsuredPersonLastName || "";
            if (item.InsuredPersonLastName === "") {
                alertify.error("Please Enter Insured Person Last Name");
                return;
            }
            if (item.EligibleInsuredPersonDOB === "") {
                alertify.error("Please Enter Insured Person DOB");
                return;
            }

            if (!item.InsuredPersonGenderID) {
                alertify.error("Please Enter Insured Person Gender");
                return;
            }
        }
        if (item.EligibilityPayorId === null || item.EligibilityPayorId === undefined || item.EligibilityPayorId === "") {
            alertify.error("Invalid Payer ID. Please check and try again.");
            return;
        }
        const isEligible = !!item?.SubmitInsuranceEligibilityElectronically;
        if (!isEligible) {
            alertify.error("Real-Time Eligibility is not supported by this payer.");
            return;
        }
        
       

        var params = {
            "UserId": $scope.UserId,
            "SNO": 1,
            "PatientAppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId || 0,
            "AppointmentId": 0,
            "AppointmentDate": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "AppointmentInsuranceNumber": 0,
            "DoctorName": $scope.DrFullName,
            "UserProviderId": doctorinfo.doctordata.User[0].UserProviderId,
            "HospitalId": $scope.HospitalId,
            "AppointmentTOSCodes": [

            ],
            "NPI": doctorinfo.doctordata.User[0].NPI,
            "TaxId": doctorinfo.doctordata.User[0].UserTaxId,
            "ProviderCode": "H",
            //"serviceProviderNumber": $scope.selectedDocObject.selectedPerson.serviceProviderNumber,
            "serviceProviderNumber": 0,
            "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "AppointmentTime": $filter("date")(new Date(), "HH:mm"),
            "AppointmentPatientTypeId": 1,
            "AppointmentPatientType": "New Patient",
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
            "PatientId": item.PatientId,
            "PatientMrNo": $scope.PatientDisplayID,
            "Gender": $scope.PatientDetailsInfo.Gender,
            "DOB": $scope.PatientDetailsInfo.DOB,
            "FirstName": $scope.PatientDetailsInfo.FirstName,
            "LastName": $scope.PatientDetailsInfo.LastName,
            "TitleId": 1,
            "Title": "Mr",
            "PatientFirstName": $scope.PatientDetailsInfo.FirstName,
            "PatientLastName": $scope.PatientDetailsInfo.LastName,
            "PatientMobile": $scope.PatientDetailsInfo.DisplayNumber,
            "PatientContact": $scope.PatientDetailsInfo.HomeCountryCode,
            "HomeNumber": $scope.PatientDetailsInfo.HomeNumber,
            "HomeAreaCode": $scope.PatientDetailsInfo.HomeAreaCode,
            "HomeCountryCode": $scope.PatientDetailsInfo.DisplayOfficeNumber,
            "OfficeNumber": $scope.PatientDetailsInfo.OfficeNumber,
            "OfficeAreaCode": $scope.PatientDetailsInfo.OfficeAreaCode,
            "OfficeCountryCode": $scope.PatientDetailsInfo.OfficeCountryCode,
            "PatientGender": $scope.PatientDetailsInfo.Gender,
            "PatientSSN": $scope.PatientDetailsInfo.SocialSecurityNo,
            "PayorId": item.PayorId,
            "PayorName": item.PayorName,
            "PlanName": item.PlanName,
            "PlanTypeId": item.PlanTypeId,
            "PlanTypeName": item.PlanTypeName || "",
            "PlanId": item.PlanId,
            "InsuranceEffectiveDate": item.EffectiveDate || "",
            "InsuranceExpiryDate": item.ExpiryDate || "",
            "RelationShipId": item.RelationShipId,
            "RelationName": item.RelationName,
            "VerifiedDate": item.VerifiedDate || "",
            "Coinsurance": item.Coinsurance || null,
            "VisitCopay": item.VisitCopay || null,
            "CoverageId": item.CoverageId || 1,
            "InsuredPersonSSN": item.InsuredPersonSSN,
            "PolicyHolder": item.PolicyHolder || "",
            "InsuranceStatusId": 1,
            "InsuredPersonFirstName": item.InsuredPersonFirstName,
            "InsuredPersonLastName": item.InsuredPersonLastName,
            "InsuredPersonDOB": item.EligibleInsuredPersonDOB,
            "InsuredPersonGenderID": item.InsuredPersonGenderID,
            "InsuranceStatusName": "Active",
            "PolicyHolderName": item.PolicyHolderName || "",
            "GroupName": item.GroupName || "",
            "StatusId": item.StatusId || 1,
            "StatusName": "Not Verified",
            "MasterPayorId": item.GlobalPayorId,
            "OrgEligibilityClaimNumber": item.PatientInsuranceControlNumber,
            "PatientCoPayAmount": null,
            "PatientCoPayPercentage": null,
            "SocialSecurityNo": $scope.PatientDetailsInfo.SocialSecurityNo,
            "AddressId": null,
            "CityName": null,
            "StateName": null,
            "Pin": null,
            "PlanBeginDate": null,
            "PlanEndDate": null,
            "PolicyId": item.PolicyId,
            "GroupId": item.GroupId,
            "PlanNumber": null,
            "isSelected": false,
            "isVerified": false,
            "IsShowEligibility": false,
            "ProviderID": doctorinfo.doctordata.User[0].UserProviderId,
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "ServiceTo": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "MemberId": "",
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "serviceTypeCodes": [

            ],
            "BillingProviderDetails": {
                "BillingProviderName": "",
                "BillingProviderId": "",
                "BillingProviderNPI": "",
                "BillingProviderTaxId": "",
                "BillingProviderContactPersonName": "",
                "BillingProviderContactPhoneNumber": ""
            },
            "ClearingHouseId": 1,
            "ClearingHouseName": "",
            "MasterClearingHouseId": "",
            "ClearingHouseType": "",
            "CHUserName": "",
            "CHPassword": "",
            "CHSubmitterId": "",
            "CHReceiverId": "",
            "CHEligiibilityUrl":"",
            "FTPAddress": "",
            "FTPUserName": "",
            "FTPpassword": "",
            "FTPpath": "",
            "FTPFolder": "",
            "FTPPort": "",
            "EligiBatchSubmitterID": "",
            "EligiBatchReceiverID": "",
            "PatientsList": [],

        };
        var traceNumber = $filter('date')(new Date(), 'yyyyMMddHHmmssfff');
        var traceEntityIdentifier = item.PatientInsuranceDetailId.toString().padStart(10, '0');
        let isSelf = item.RelationShipId == 1;

        let obj = {
            "PatientFirstName": item.InsuredPersonFirstName,
            "PatientLastName": item.InsuredPersonLastName,
            "Gender": item.InsuredPersonGenderID || ($scope.PatientDetailsInfo.Gender == "Male" ? "M" : "F") || '',
            "InsuredPersonDOB": item.EligibleInsuredPersonDOB,
            "PolicyNo": item.PolicyId,
            "PayorName": item.PayorName,
            "PayorId": item.PayorId,
            "GlobalPayorId": item.EligibilityPayorId,
            "ServiceTypeCode": "98",
            "TraceEntityIdentifier": traceEntityIdentifier,
            "EntityType": "1",
            "DeleteInd": "N",
            "EligibilityStatusId": "5",
            "EligibilityStatusName": "Verification Sent",
            "traceNumber": traceNumber + "_" + item.PatientInsuranceDetailId,
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
            "PatientId": item.PatientId,
            "GroupId": item.GroupId,
            "PatientMrNo": $scope.PatientDisplayID,
            "PatientDOB": moment(item.InsuredPersonDOB).format("YYYYMMDD"),
            "PatientContact": $scope.PatientDetailsInfo.HomeCountryCode,
        }

        params.PatientsList.push(obj);

        if ($scope.OrganizationBillingProviderList.length > 0) {

            var OrganizationBillingProviderObj = "";
            var filteredList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": $scope.defaultBillingProviderId }, true) || [];
            if (filteredList.length > 0) {
                OrganizationBillingProviderObj = filteredList[0];
            } else {
                OrganizationBillingProviderObj = $scope.OrganizationBillingProviderList[0];
            }
            
            params.BillingProviderDetails.BillingProviderName = OrganizationBillingProviderObj.BillingProviderName;
            params.BillingProviderDetails.BillingProviderId = OrganizationBillingProviderObj.OrganizationBillingProviderId;
            params.BillingProviderDetails.BillingProviderNPI = OrganizationBillingProviderObj.NPI;
            params.BillingProviderDetails.BillingProviderTaxId = OrganizationBillingProviderObj.TaxId;
            params.BillingProviderDetails.BillingProviderContactPersonName = OrganizationBillingProviderObj.ContactPersonName;
            params.BillingProviderDetails.BillingProviderContactPhoneNumber = OrganizationBillingProviderObj.ContactMobileNumber;
        };
       
        if ($scope.OrganizationClearingHouseDetails.length > 0) {
            params.ClearingHouseId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseID;
            params.ClearingHouseName = $scope.OrganizationClearingHouseDetails[0].Name;
            params.MasterClearingHouseId = $scope.OrganizationClearingHouseDetails[0].MasterClearingHouseId;
            params.ClearingHouseType = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPType;

            params.FTPAddress = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPHostName || "";
            params.FTPUserName = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPUserName || "";
            params.FTPpassword = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPassword || "";
            params.FTPpath = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
            params.FTPFolder = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
            params.FTPPort = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPortNumber || "";
            params.EligiBatchSubmitterID = $scope.OrganizationClearingHouseDetails[0].SubmitterID || "";
            params.EligiBatchReceiverID = $scope.OrganizationClearingHouseDetails[0].ReceiverID || "";
            params.CHUserName = $scope.OrganizationClearingHouseDetails[0].AuthUserName || "";
            params.CHPassword = $scope.OrganizationClearingHouseDetails[0].AuthPassword || "";
            params.CHSubmitterId = $scope.OrganizationClearingHouseDetails[0].SubmitterID || "";
            params.CHReceiverId = $scope.OrganizationClearingHouseDetails[0].ReceiverID || "";
            params.CHEligiibilityUrl = $scope.OrganizationClearingHouseDetails[0].EligibilityURL || "";
            params.UsageIndicator = $scope.OrganizationClearingHouseDetails[0].UsageIndicator || "";
            
            var ClearingHouseTypeId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseTypeId || 0;


            if (ClearingHouseTypeId == 2) {
                if (params.FTPAddress === "" && params.FTPUserName == "" && params.FTPpassword == "" && params.FTPpath == "") {
                    alertify.error("FTP details are missing for the Clearing House please ");
                    return false;
                }
            }

        }
        $scope.appointmentinfo.PatientID = item.PatientId;
        eHnoteInsuranceService.CheckPatientRealtimeInsuranceEligibility(params, onSuccess, onError);
        function onSuccess(resp) {

            

            console.log(JSON.stringify(resp));

            if (resp.Status == 'Success') {
                item.IsVerified = true;
                alertify.success("Insurance Eligibility Verified Successfully");
                $scope.getPatientInsuranceDetailsOfPatient();            
            }
            else if (resp.Status == 'Skipped') {
                alertify.success("Eligibility request already submitted. Please try again later.");
                $scope.getPatientInsuranceDetailsOfPatient();
            }
            else {
                alertify.error("Insurance Eligibility Verification Failed");
                $scope.getPatientInsuranceDetailsOfPatient();              
            }         
        }
        function onError(reponse) {
        }

    }
    $scope.CheckVerifyEligibity = function (item) {
        if ($scope.patientid === 0) {

        } else {
            $scope.continuetoCheckInsuranceEligibility(item);
        }
    }

    $scope.showEligibilityinPopup = function (item) {
        $scope.obj = {
            "AppointmentInsuranceDetailId": item.AppointmentInsuranceDetailId || 0,
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId
        }

        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
            "backdrop": "static",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "keyboard": false,
            "windowClass": "offcanves-right  ",
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj) {

                $scope.selectedObj = Selectobj;
                $scope.MainBenifitEligibilityCoverageList = [];
                $scope.BenifitEligibilityCoverageList1 = [];
                $scope.ChangePatientsInsuranceList = function () {
                    $scope.BenifitCoverageDetailListobj = 1;
                    $scope.Id = Selectobj.AppointmentInsuranceDetailId;
                    $scope.InsuranceEligibility = [];
                    $scope.selectedid = Selectobj.PatientInsuranceDetailId;
                    $scope.InsuranceEligibilitySubscriberData = [];
                    eHnoteInsuranceService.GetPatientBenfitCovergesByPatientInsuranceId($scope.selectedid).then(function (resp) {
                        $scope.MainBenifitEligibilityCoverageList = [];
                        $scope.BenifitEligibilityCoverageList1 = [];
                        if (resp.data.status == "Success") {
                            resp.data.rows = resp.data.rows || [];
                            $scope.InsuranceEligibilitySubscriberData = resp.data.rows || [];
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
    $scope.showEligibilityinPopup1 = function (item) {
        $scope.obj = {
            "AppointmentInsuranceDetailId": item.AppointmentInsuranceDetailId || 0,
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId
        }
        $scope.reverifyitem = item;
        $scope.PatientDetailsInfo = angular.copy($scope.PatientDetailsInfo);
        $scope.appointmentinfo.PatientID = item.PatientId;

        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
            "backdrop": "static",
            "controller": "UsPatientEligibilityResponseDetailsPopUpCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
                "ReverifyItem": function () { return $scope.reverifyitem; },
                "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; }
            },
            "keyboard": false,
            "windowClass": "offcanves-right  ",
        })

        $scope.modalpayorInstance.result.then(function (resp) {
        }, function () {
            $scope.getPatientInsuranceDetailsOfPatient();

        });

    };

    $scope.showEligibilityErrors = function (item) {



        eHnoteInsuranceService.GetPatientInsuranceEligibilityErrorDetails(item.PatientInsuranceDetailId).then(function (response) {
            console.log(JSON.stringify(response));

            //if (response.data.ErrorDetails.length > 0) {
            $scope.openErrorPopup(response.data.ErrorDetails);
            //}




        });



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
    //"windowClass": "offcanves-right  ",
    $scope.ToChangeInsAccodianView = function (item) {
        if (item.ToShowInsAccodianView) {
            item.ToShowInsAccodianView = false;
        } else {
            angular.forEach($scope.PatientInsuranceSummary, function (iitem) {
                iitem.ToShowInsAccodianView = false;
            });
            item.ToShowInsAccodianView = true;
        }
    }

    $scope.onEligibilityChange = function (item) {
        item.IsShowEligibiltySave = true;
    };
    function isSameInsurance(a, b) {
        return a.PayorId === b.PayorId &&
            a.PlanId === b.PlanId &&
            a.PolicyId === b.PolicyId &&
            a.StatusId === b.StatusId &&
            a.StatusName === b.StatusName &&
            a.IdentifierId === b.IdentifierId &&
            (a.GroupId || '') === (b.GroupId || '') &&
            $filter('date')(a.EffectiveDate || '', 'yyyy-MM-dd') === $filter('date')(b.EffectiveDate || '', 'yyyy-MM-dd') &&
            $filter('date')(a.ExpiryDate || '', 'yyyy-MM-dd') === $filter('date')(b.ExpiryDate || '', 'yyyy-MM-dd');
    }
    $scope.PatientInsuranceDetailsSave = function (type, EditMode) {
        
        var TempInsuarance = $scope.PatientInsuranceObj;

        TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;
        TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;
        TempInsuarance.PayorId = TempInsuarance.PayorId || null;
        TempInsuarance.PlanId === TempInsuarance.PlanId || 0;
        TempInsuarance.PolicyId = TempInsuarance.PolicyId || "";
        TempInsuarance.GroupId = TempInsuarance.GroupId || "";
        TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || "";
        TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || "";
        TempInsuarance.Staff = TempInsuarance.Staff || "";
        TempInsuarance.AcceptAssign = TempInsuarance.AcceptAssign || "";
        TempInsuarance.AssignBenifits = TempInsuarance.AssignBenifits || "";
        TempInsuarance.Comments = TempInsuarance.Comments || "";
        TempInsuarance.TempInsuranceImagesArray = TempInsuarance.TempInsuranceImagesArray || [];

        if ($scope.PatientInsuranceObj.IsAddnewInsuranceInd == true) {
            if (TempInsuarance.PolicyId == $scope.TempInsuranceObj.PolicyId && TempInsuarance.GroupId == $scope.TempInsuranceObj.GroupId && TempInsuarance.PlanId == $scope.TempInsuranceObj.PlanId && TempInsuarance.PayorId == $scope.TempInsuranceObj.PayorId) {
                TempInsuarance.PatientInsuranceDetailId = TempInsuarance.PatientInsuranceDetailId;
            } else {
                TempInsuarance.InsuranceDeactiveDetailId = TempInsuarance.PatientInsuranceDetailId;
                TempInsuarance.IsConnectToFutureAppointment = false;
                TempInsuarance.PatientInsuranceDetailId = 0;
            }
        }
        if (TempInsuarance.PatientInsuranceDetailId === 0 && TempInsuarance.CoverageId == null && TempInsuarance.PayorId == null && TempInsuarance.IdentifierId == null && TempInsuarance.PlanId == 0 &&
            TempInsuarance.PolicyId == '' && TempInsuarance.GroupId == '' && TempInsuarance.ExpiryDate == '' && TempInsuarance.ExpiryDate == '' && TempInsuarance.Staff == '' &&
            TempInsuarance.AcceptAssign == '' && TempInsuarance.AssignBenifits == '' && TempInsuarance.Comments == '' && TempInsuarance.TempInsuranceImagesArray.length == 0) {
            if (type === "Final") {
                $scope.Registeraddpopup = true;
                $scope.CloseEditPatientPopUp();
            }
            return false;
        }

        if (TempInsuarance.PayorId !== null || TempInsuarance.PlanId !== 0 || TempInsuarance.GroupId !== null || TempInsuarance.PolicyId !== null) {
            TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;

            if (TempInsuarance.PatientFirstName == "") {
                alertify.error("Please Enter Patient First Name");
                return false;
            }
            if (TempInsuarance.PatientLastName == "") {
                alertify.error("Please Enter Patient Last Name");
                return false;
            }
        }
        TempInsuarance.PolicyId = TempInsuarance.PolicyId || null;
        if (TempInsuarance.PolicyId === null) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Patient Policy ID");
            $scope.Headers.InsuranceHeader = true;
            return false;
        }

        TempInsuarance.PayorId = TempInsuarance.PayorId || null;
        if (TempInsuarance.PayorId === null) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Select Patient Payor");
            return false;
        }
        TempInsuarance.PlanId === TempInsuarance.PlanId || 0;
        if (TempInsuarance.PlanId === 0) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Select Patient Plan");
            return false;
        }
        //TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || null;
        //if (TempInsuarance.EffectiveDate === null) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Select Patient Effective Date");
        //    return false;
        //}
        //TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || null;
        //if (TempInsuarance.ExpiryDate === null) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Select Patient Expire Date");
        //    return false;
        //}
        var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");
        TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, "MM-dd-yyyy");
        if ($scope.PatientInsuranceSummary.length === 0) {
            // No insurance added yet
            if (TempInsuarance.IdentifierId != 1) {
                alertify.error('You must add Primary Insurance first.');
                return false;
            }
            var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
            if (newRecordEffDate && currentdate < newRecordEffDate) {
                TempInsuarance.StatusId = 1; // User confirmed
                TempInsuarance.InactiveActiveInsurance = false;
                TempInsuarance.ConnectCurrentInsuranceInd = false;
                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                proceedToSaveInsurance(TempInsuarance);
            }
            else {
                TempInsuarance.StatusId = 1; // No existing primary, so proceed directly
                TempInsuarance.InactiveActiveInsurance = false;
                TempInsuarance.ConnectCurrentInsuranceInd = true;
                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                proceedToSaveInsurance(TempInsuarance);
            }
        }
        else {
            
            let PrimaryInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
                return (resp.IdentifierId == 1 && resp.StatusId == 1 && resp.DeleteInd == 'N' && resp.StatusName == 'Active');
            });
            let secondaryInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
                return (resp.IdentifierId == 2 && resp.StatusId == 1 && resp.DeleteInd == 'N' && resp.StatusName == 'Active');
            });
            let OtherInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
                return ((resp.IdentifierId == 3 || resp.IdentifierId == 5) && resp.StatusId == 1 && resp.DeleteInd == 'N' && resp.StatusName == 'Active');
            });
            //if (TempInsuarance.IdentifierId == 2 && PrimaryInsurance.length == 0) {
            //    alertify.error('Please add Primary Insurance before adding Secondary.');
            //    return false;
            //}
            //if (TempInsuarance.IdentifierId == 3) {
            //    if (PrimaryInsurance.length == 0) {
            //        alertify.error('Please add Primary Insurance before adding Tertiary.');
            //        return false;
            //    }
            //    if (secondaryInsurance.length == 0) {
            //        alertify.error('Please add Secondary Insurance before adding Tertiary.');
            //        return false;
            //    }
            //}
            if (TempInsuarance.StatusId == 5 || TempInsuarance.StatusId == 4 || TempInsuarance.StatusId == 3 || TempInsuarance.StatusId == 2)
            {
                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                proceedToSaveInsurance(TempInsuarance);
            }
            else if (PrimaryInsurance.length > 0 && TempInsuarance.IdentifierId == 1) {

                var existing = PrimaryInsurance[0];
                if (isSameInsurance(existing, TempInsuarance)) {
                    
                    return;
                }
                var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                if (newRecordEffDate != null && newRecordEffDate != "" && currentdate < newRecordEffDate && TempInsuarance.PatientInsuranceDetailId == 0) {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>The Efeective Date in Future. Do you want to add the current insurance as active?</h4>",
                        function () {
                            TempInsuarance.StatusId = 1; // User confirmed
                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            proceedToSaveInsurance(TempInsuarance);
                            $scope.$apply();
                        },
                        function () {

                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            TempInsuarance.StatusId = 5; // User cancelled
                            proceedToSaveInsurance(TempInsuarance);


                            $scope.$apply();
                        }
                    );
                }

                else if (TempInsuarance.PatientInsuranceDetailId !== 0) {
                    var existing = PrimaryInsurance[0];
                    var existingStatusId = existing.StatusId;
                    var newStatusId = TempInsuarance.StatusId;

                    // Case 4: Re-activating an inactive insurance while another one is already active
                    if (
                        existingStatusId === 1 &&
                        newStatusId === 1 &&
                        (
                            TempInsuarance.PatientInsuranceDetailId === 0 ||
                            (existing.PatientInsuranceDetailId !== TempInsuarance.PatientInsuranceDetailId && existing.StatusId === 1)
                        )
                    ) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active primary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                            function () {
                                TempInsuarance.StatusId = 1;
                                TempInsuarance.InactiveActiveInsurance = true;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                    ? TempInsuarance.EffectiveDate
                                    : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                    ? TempInsuarance.EffectiveDate
                                    : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5;
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            }
                        );
                    }

                    // Case 1 & 2: Updating fields or changing status
                    else if (!isSameInsurance(existing, TempInsuarance) || existingStatusId !== newStatusId) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                            function () {
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                $scope.init();
                                $scope.$apply();
                            }
                        );
                    }

                    // Case 0: No changes at all
                    else {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                            function () {
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                $scope.init();
                                $scope.$apply();
                            }
                        );
                        return;
                    }
                }


                else {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active primary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                        function () {

                            TempInsuarance.StatusId = 1; // User confirmed
                            TempInsuarance.InactiveActiveInsurance = true;
                            TempInsuarance.ConnectCurrentInsuranceInd = true;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            proceedToSaveInsurance(TempInsuarance);
                            $scope.$apply();
                        },
                        function () {

                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            TempInsuarance.StatusId = 5; // User cancelled
                            proceedToSaveInsurance(TempInsuarance);

                            $scope.$apply();
                        }
                    );
                }

            }
            else if (secondaryInsurance.length > 0 && TempInsuarance.IdentifierId == 2) {

                var existing = secondaryInsurance[0];
                if (isSameInsurance(existing, TempInsuarance)) {
                   
                    return;
                }
                var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                if (newRecordEffDate != null && newRecordEffDate != "" && currentdate < newRecordEffDate && TempInsuarance.PatientInsuranceDetailId == 0) {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>The Efeective Date in Future. Do you want to add the current insurance as active?</h4>",
                        function () {
                            TempInsuarance.StatusId = 1; // User confirmed
                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            proceedToSaveInsurance(TempInsuarance);
                            $scope.$apply();
                        },
                        function () {

                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            TempInsuarance.StatusId = 5; // User cancelled
                            proceedToSaveInsurance(TempInsuarance);


                            $scope.$apply();
                        }
                    );
                }

                else if (TempInsuarance.PatientInsuranceDetailId !== 0) {
                    var existing = secondaryInsurance[0];
                    var existingStatusId = existing.StatusId;
                    var newStatusId = TempInsuarance.StatusId;

                    // Case 4: Re-activating an inactive insurance while another one is already active
                    if (
                        existingStatusId === 1 &&
                        newStatusId === 1 &&
                        (
                            TempInsuarance.PatientInsuranceDetailId === 0 ||
                            (existing.PatientInsuranceDetailId !== TempInsuarance.PatientInsuranceDetailId && existing.StatusId === 1)
                        )
                    ) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active secondry insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                            function () {
                                TempInsuarance.StatusId = 1;
                                TempInsuarance.InactiveActiveInsurance = true;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                    ? TempInsuarance.EffectiveDate
                                    : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                    ? TempInsuarance.EffectiveDate
                                    : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5;
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            }
                        );
                    }

                    // Case 1 & 2: Updating fields or changing status
                    else if (!isSameInsurance(existing, TempInsuarance) || existingStatusId !== newStatusId) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                            function () {
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                $scope.init();
                                $scope.$apply();
                            }
                        );
                    }

                    // Case 0: No changes at all
                    else {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                            function () {
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                $scope.init();
                                $scope.$apply();
                            }
                        );
                        return;
                    }
                }


                else {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active secondary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                        function () {

                            TempInsuarance.StatusId = 1; // User confirmed
                            TempInsuarance.InactiveActiveInsurance = true;
                            TempInsuarance.ConnectCurrentInsuranceInd = true;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            proceedToSaveInsurance(TempInsuarance);
                            $scope.$apply();
                        },
                        function () {

                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            TempInsuarance.StatusId = 5; // User cancelled
                            proceedToSaveInsurance(TempInsuarance);

                            $scope.$apply();
                        }
                    );
                }

            }
            else if (OtherInsurance.length > 0 && TempInsuarance.IdentifierId == 3) {

                var existing = OtherInsurance[0];
                if (isSameInsurance(existing, TempInsuarance)) {
                   
                    return;
                }
                var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                if (newRecordEffDate != null && newRecordEffDate != "" && currentdate < newRecordEffDate && TempInsuarance.PatientInsuranceDetailId == 0) {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>The Efeective Date in Future. Do you want to add the current insurance as active?</h4>",
                        function () {
                            TempInsuarance.StatusId = 1; // User confirmed
                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            proceedToSaveInsurance(TempInsuarance);
                            $scope.$apply();
                        },
                        function () {

                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            TempInsuarance.StatusId = 5; // User cancelled
                            proceedToSaveInsurance(TempInsuarance);


                            $scope.$apply();
                        }
                    );
                }

                else if (TempInsuarance.PatientInsuranceDetailId !== 0) {
                    var existing = OtherInsurance[0];
                    var existingStatusId = existing.StatusId;
                    var newStatusId = TempInsuarance.StatusId;

                    // Case 4: Re-activating an inactive insurance while another one is already active
                    if (
                        existingStatusId === 1 &&
                        newStatusId === 1 &&
                        (
                            TempInsuarance.PatientInsuranceDetailId === 0 ||
                            (existing.PatientInsuranceDetailId !== TempInsuarance.PatientInsuranceDetailId && existing.StatusId === 1)
                        )
                    ) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active tertiary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                            function () {
                                TempInsuarance.StatusId = 1;
                                TempInsuarance.InactiveActiveInsurance = true;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                    ? TempInsuarance.EffectiveDate
                                    : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                    ? TempInsuarance.EffectiveDate
                                    : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5;
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            }
                        );
                    }

                    // Case 1 & 2: Updating fields or changing status
                    else if (!isSameInsurance(existing, TempInsuarance) || existingStatusId !== newStatusId) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                            function () {
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                $scope.init();
                                $scope.$apply();
                            }
                        );
                    }

                    // Case 0: No changes at all
                    else {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                            function () {
                                proceedToSaveInsurance(TempInsuarance);
                                $scope.$apply();
                            },
                            function () {
                                $scope.init();
                                $scope.$apply();
                            }
                        );
                        return;
                    }
                }


                else {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active tertiary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                        function () {

                            TempInsuarance.StatusId = 1; // User confirmed
                            TempInsuarance.InactiveActiveInsurance = true;
                            TempInsuarance.ConnectCurrentInsuranceInd = true;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            proceedToSaveInsurance(TempInsuarance);
                            $scope.$apply();
                        },
                        function () {

                            TempInsuarance.InactiveActiveInsurance = false;
                            TempInsuarance.ConnectCurrentInsuranceInd = false;
                            TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                            TempInsuarance.StatusId = 5; // User cancelled
                            proceedToSaveInsurance(TempInsuarance);

                            $scope.$apply();
                        }
                    );
                }

            }
            else {
                //TempInsuarance.StatusId = 1;
                //TempInsuarance.InactiveActiveInsurance = false;
                //TempInsuarance.ConnectCurrentInsuranceInd = true;
                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                proceedToSaveInsurance(TempInsuarance);
            }

        }
       
    };
    function proceedToSaveInsurance(TempInsuarance) {
        $scope.Ffile = $scope.Ffile || '';
        $scope.Bfile = $scope.Bfile || '';
        $scope.frontS3Url = $scope.frontS3Url || '';
        $scope.backS3Url = $scope.backS3Url || '';

        let scannedFilesArray = [];
        angular.forEach(TempInsuarance.PatientDocumentDetails, function (item) {
            item.DocumentId = item.DocumentId || 0;
            if (item.DocumentId !== 0 && $scope.PatientInsuranceObj.IsAddnewInsuranceInd) {
                var object = {
                    "DocumentTypeId": 4,
                    "DocumentName": item.DocumentName,
                    "DocumentExt": item.DocumentExt,
                    "S3URL": item.S3URL,
                    "file": "",
                    "DeleteInd": "N",
                    "DocumentId": item.DocumentId,
                    "IsBackSidefile": item.IsBackSidefile
                };
                scannedFilesArray.push(object);
            } else {
                if (item.DisplayName === "front" || item.DisplayName === "back") {
                    item.PatientImageDocumentId = item.PatientImageDocumentId || 0;
                    item.S3URL = item.S3URL || "";
                    if (item.PatientImageDocumentId === 0) {
                        var isfront = false;
                        if (item.DisplayName === "back") { isfront = true; };
                        var object = {
                            "DocumentTypeId": 4,
                            "DocumentName": item.DocumentName,
                            "DocumentExt": item.FileExt,
                            "S3URL": item.S3URL,
                            "file": item.file || "",
                            "DeleteInd": "N",
                            "DocumentId": item.PatientImageDocumentId,
                            "IsBackSidefile": isfront
                        };
                        scannedFilesArray.push(object);
                    }
                }
            }


        });
        TempInsuarance.PatientDocumentDetails = [];
        TempInsuarance.PatientDocumentDetails = angular.copy(scannedFilesArray);
        TempInsuarance.DeleteInd = TempInsuarance.DeleteInd || false;
        angular.forEach(TempInsuarance.TempInsuranceImagesArray, function (item) {
            item.DocumentId = item.DocumentId || 0;
            item.S3URL = item.S3URL || "";
            if (item.DocumentId === 0) {

                var isfront = false;
                if (item.DisplayName === "Back") { isfront = true; };
                var object = {
                    "DocumentTypeId": 4,
                    "DocumentName": item.DocumentName,
                    "DocumentExt": item.DocumentExt,
                    "S3URL": item.S3URL,
                    "file": item.file,
                    "DeleteInd": item.DeleteInd,
                    "DocumentId": item.DocumentId,
                    "IsBackSidefile": isfront
                };
                TempInsuarance.PatientDocumentDetails.push(object);
            }

        });


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
        if (TempInsuarance.InsuredPersonDOB != "") {
            TempInsuarance.InsuredPersonDOB = $filter('date')(TempInsuarance.InsuredPersonDOB, 'yyyy-MM-dd');
        }


        TempInsuarance.InsuredPersonSecondLastName = TempInsuarance.InsuredPersonSecondLastName || "";
        TempInsuarance.InsuredPersonSuffix = TempInsuarance.InsuredPersonSuffix || "";
        TempInsuarance.PatientSecondLastName = TempInsuarance.PatientSecondLastName || "";
        TempInsuarance.PatientSuffix = TempInsuarance.PatientSuffix || "";

        var param = {
            "PatientId": $scope.patientid,
            "FullName": $scope.PatientFullName,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "IsConnectToFutureAppointment": TempInsuarance.IsConnectToFutureAppointment || false,
            "PatientInsuranceDetails": []
        }
        param.PatientInsuranceDetails.push(TempInsuarance);

        eHnotePatientDataService.SavePatientInsuranceDetailsById(param, OnAddPatientSuccess, OnAddPatientError);
        function OnAddPatientSuccess(resp) {
            if (resp.Status === "Success") {

                $scope.IsShowEligibiltySave = false;
                $scope.Registeraddpopup = true;
                if (resp.PatientInsuranceDetails.length > 0) {
                    $scope.PatientInsuranceSummary = resp.PatientInsuranceDetails;
                    $scope.PatientInsuranceSummary = $scope.PatientInsuranceSummary.map(item => ({
                        ...item,
                        IsShowEligibiltySave: false
                    }));
                }

                if ($scope.PatientInsuranceSummary.length > 0) {
                    angular.forEach($scope.PatientInsuranceSummary, function (insitem, index) {
                        insitem.EffectiveDate = insitem.EffectiveDate || "";
                        if (insitem.EffectiveDate != "") {
                            insitem.EffectiveDate = $filter("date")(insitem.EffectiveDate, "MM-dd-yyyy") || "";
                        }
                        insitem.ExpiryDate = insitem.ExpiryDate || "";
                        if (insitem.ExpiryDate != "") {
                            insitem.ExpiryDate = $filter("date")(insitem.ExpiryDate, "MM-dd-yyyy") || "";
                        }
                        insitem.ScanDate = insitem.ScanDate || "";
                        if (insitem.ScanDate != "") {
                            insitem.ScanDate = $filter("date")(insitem.ScanDate, "MM-dd-yyyy") || "";
                        }
                        insitem.VerifiedDate = insitem.VerifiedDate || "";
                        if (insitem.VerifiedDate != "") {
                            insitem.VerifiedDate = $filter("date")(insitem.VerifiedDate, "MM-dd-yyyy") || "";
                        }

                        insitem.InsuredPersonDOB = insitem.InsuredPersonDOB || "";
                        if (insitem.InsuredPersonDOB != "") {
                            insitem.InsuredPersonDOB = $filter("date")(insitem.InsuredPersonDOB, "MM-dd-yyyy") || "";
                        }

                    });
                }

                if (resp.PatientInsuranceDetails.length > 0) {
                    angular.forEach(resp.PatientInsuranceDetails, function (insitem, index) {
                        if (insitem.MovetoBilling === true) {
                            $rootScope.$broadcast("PatientINsuranceEdittobiller");
                        }
                    });
                }
                $scope.init();

                $scope.PatientInsurancebase64 = [];
                angular.forEach($scope.PatientInsuranceSummary, function (item) {
                    if (item.PatientDocumentDetails.length > 0) {
                        angular.forEach(item.PatientDocumentDetails, function (subitem) {
                            if (subitem.IsBackSidefile == false && subitem.S3URL != '') {
                                var obj = {
                                    "Documentid": subitem.DocumentId,
                                    "frontbase64": ""
                                };
                                $scope.toDataURL(subitem.S3URL, function (dataURL) {
                                    obj.frontbase64 = dataURL;
                                    $scope.PatientInsurancebase64.push(obj);
                                });
                            }
                        });
                    }
                });

            }
        }
        function OnAddPatientError() {
            alertify.error("Creating  Failed");
        }
    }
    $scope.RegisterPatientSave = function (type, EditMode) {

        if ($scope.SaveTypeObj.TypeName === "PatientDetails") {
            $scope.Finalsubmit = "";
            $scope.ValidateIndictor = false;
            $scope.PatientSave(type);
        }
        else if ($scope.SaveTypeObj.TypeName === "AddressDetails") {
            $scope.ValidateIndictor = false;
            $scope.PatientAddressSave(type);
        }
        else if ($scope.SaveTypeObj.TypeName === "DemographicsDetails") {
            $scope.ValidateIndictor = false;
            $scope.PatientDemographicsSave(type);
        }
        else if ($scope.SaveTypeObj.TypeName === "FamilyDetails") {
            $scope.ValidateIndictor = false;
            $scope.PatientFamilySave(type);
        }
        else if ($scope.SaveTypeObj.TypeName === "DesignatedDetails") {
            $scope.ValidateIndictor = false;
            $scope.PatientDesignatedSave(type);
        }
        else if ($scope.SaveTypeObj.TypeName === "InsuranceDetails") {
            $scope.ValidateIndictor = false;
            $scope.PatientInsuranceDetailsSave(type, EditMode);
        }
        else {
            $scope.ValidateIndictor = false;
        }

    }

    $scope.InsRegisterPatientSave = function (Type, item) {
        $scope.SaveTypeObj.TypeName = "InsuranceDetails";
        //$scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.ShowInsuranceAddnew = false;
        $scope.frontItemUpload = false;
        $scope.Ffile = null;
        $scope.Bfile = null;
        $scope.frontItemS3Url = false;
        $scope.backItemUpload = false;
        $scope.backItemS3Url = false;
        $scope.Showeditpatient = true;

        $scope.PatientInsuranceObj.InsuredPersonFirstName = $scope.PatientDetailSummary.FirstName;
        $scope.PatientInsuranceObj.InsuredPersonGenderID = $scope.PatientDetailSummary.Gender == "Male" ? 'M' : 'F';
        $scope.PatientInsuranceObj.InsuredPersonDOB = $scope.PatientDetailSummary.DOB;
        $scope.PatientInsuranceObj.InsuredPersonSSN = "";
        $scope.PatientInsuranceObj.InsuredPersonMiddleName = $scope.PatientDetailSummary.MiddleName;
        $scope.PatientInsuranceObj.InsuredPersonLastName = $scope.PatientDetailSummary.LastName;
        $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientDetailSummary.FirstName;
        $scope.PatientInsuranceObj.PatientLastName = $scope.PatientDetailSummary.LastName;
        $scope.PatientInsuranceObj.PatientDOB = $scope.PatientDetailSummary.DOB;
        $scope.PatientInsuranceObj.PatientSSN = $scope.PatientDetailSummary.SocialSecurityNo;
        $scope.PatientInsuranceObj.IsIdentifier = false;

        if (item !== undefined) {
            $scope.PatientInsuranceObj.IdentifierId = item.IdentifierId;
            $scope.PatientInsuranceObj.CoverageId = item.CoverageId;
            $scope.PatientInsuranceObj.CoverageName = item.CoverageName;
            $scope.PatientInsuranceObj.GroupId = item.GroupId || "";
            $scope.PatientInsuranceObj.GroupName = item.GroupName;
            $scope.PatientInsuranceObj.InsuranceRelationShipObj = item.InsuranceRelationShipObj;
            $scope.PatientInsuranceObj.InsuredPersonDOB = item.InsuredPersonDOB;
            $scope.PatientInsuranceObj.InsuredPersonFirstName = item.InsuredPersonFirstName;
            $scope.PatientInsuranceObj.InsuredPersonGenderID = item.InsuredPersonGenderID;
            $scope.PatientInsuranceObj.InsuredPersonSSN = item.InsuredPersonSSN;
            $scope.PatientInsuranceObj.PatientInsuranceDetailId = item.PatientInsuranceDetailId;
            $scope.PatientInsuranceObj.PayorId = item.PayorId;
            $scope.PatientInsuranceObj.PayorName = item.PayorName;
            $scope.PatientInsuranceObj.PayorObj = item.OrganizationPayorName;
            $scope.PatientInsuranceObj.PlanId = item.PlanId;
            $scope.PatientInsuranceObj.PlanName = item.PlanName;
            $scope.PatientInsuranceObj.PlanObj = item.PlanName;
            $scope.PatientInsuranceObj.PlanTypeId = item.PlanTypeId;
            $scope.PatientInsuranceObj.PolicyHolder = item.PolicyHolder;
            $scope.PatientInsuranceObj.PolicyHolderName = item.PolicyHolderName;
            $scope.PatientInsuranceObj.PolicyId = item.PolicyId;
            $scope.PatientInsuranceObj.RelationName = item.RelationName;
            $scope.PatientInsuranceObj.RelationShipId = item.RelationShipId;
            $scope.PatientInsuranceObj.ReleaseInfo = item.ReleaseInfo;
            $scope.PatientInsuranceObj.StatusId = item.StatusId;
            $scope.PatientInsuranceObj.Staff = item.Staff;
            $scope.PatientInsuranceObj.AcceptAssign = item.AcceptAssign;
            $scope.PatientInsuranceObj.AssignBenifits = item.AssignBenifits;
            $scope.PatientInsuranceObj.Comments = item.Comments;
            $scope.PatientInsuranceObj.IsDefaultBillingIns = item.IsDefaultBillingIns;
            $scope.PatientInsuranceObj.PCP = item.PCP;
            $scope.PatientInsuranceObj.IPA = item.IPA;
            $scope.PatientInsuranceObj.OrganizationPayorId = item.OrganizationPayorId;
            $scope.PatientInsuranceObj.OrganizationPayorName = item.OrganizationPayorName;
            $scope.PatientInsuranceObj.IsVerified = item.IsVerified || false;
            $scope.PatientInsuranceObj.AppointmentInsuranceDetailId = item.AppointmentInsuranceDetailId || 0;
            $scope.PatientInsuranceObj.InsuredPersonMiddleName = item.InsuredPersonMiddleName;
            $scope.PatientInsuranceObj.InsuredPersonLastName = item.InsuredPersonLastName;
            $scope.PatientInsuranceObj.PatientFirstName = item.PatientFirstName;
            $scope.PatientInsuranceObj.PatientLastName = item.PatientLastName;
            $scope.PatientInsuranceObj.PatientDOB = item.PatientDOB;
            $scope.PatientInsuranceObj.PatientSSN = item.PatientSSN;
            $scope.PatientInsuranceObj.IsIdentifier = false;
            $scope.PatientInsuranceObj.EligibilityStatusId = item.EligibilityStatusId;
            $scope.PatientInsuranceObj.StatusId = item.StatusId;
            $scope.PatientInsuranceObj.VerifiedBy = item.VerifiedBy;
            $scope.PatientInsuranceObj.InsuredPersonSecondLastName = item.InsuredPersonSecondLastName;
            $scope.PatientInsuranceObj.InsuredPersonSuffix = item.InsuredPersonSuffix;
            $scope.PatientInsuranceObj.PatientSecondLastName = item.PatientSecondLastName;
            $scope.PatientInsuranceObj.PatientMiddleName = item.PatientMiddleName;
            $scope.PatientInsuranceObj.PatientSuffix = item.PatientSuffix;

            if (item.PatientDocumentDetails.length > 0) {
                angular.forEach(item.PatientDocumentDetails, function (billitem) {
                    if (!billitem.IsBackSidefile) {
                        $scope.frontItemUpload = false;
                        $scope.frontItemS3Url = true;
                        $scope.frontS3Url = billitem.S3URL;
                    }
                    if (billitem.IsBackSidefile) {
                        $scope.backItemUpload = false;
                        $scope.backItemS3Url = true;
                        $scope.backS3Url = billitem.S3URL;
                    }
                });
                $scope.PatientInsuranceObj.PatientDocumentDetails = [];
                $scope.PatientInsuranceObj.PatientDocumentDetails = item.PatientDocumentDetails;

            }

            item.EffectiveDate = item.EffectiveDate || "";
            if (item.EffectiveDate != "") {
                $scope.PatientInsuranceObj.EffectiveDate = $filter("date")(new Date(item.EffectiveDate), "MM-dd-yyyy") || "";
            }
            item.ExpiryDate = item.ExpiryDate || "";
            if (item.ExpiryDate != "") {
                $scope.PatientInsuranceObj.ExpiryDate = $filter("date")(new Date(item.ExpiryDate), "MM-dd-yyyy") || "";
            }
            item.ScanDate = item.ScanDate || "";
            if (item.ScanDate != "") {
                $scope.PatientInsuranceObj.ScanDate = $filter("date")(new Date(item.ScanDate), "MM-dd-yyyy") || "";
            }
            item.VerifiedDate = item.VerifiedDate || "";
            if (item.VerifiedDate != "") {
                $scope.PatientInsuranceObj.VerifiedDate = $filter("date")(new Date(item.VerifiedDate), "MM-dd-yyyy") || "";
            }
        }
        $scope.RegisterPatientSave(Type);
    };

    $scope.ExpiredInsuranceList = {
        templateUrl: 'templates/uibpopups/ExpiredInsuranceList.html',
    };

    $scope.ExpireInsurancelist = function () {
        if ($scope.InsuranceStatusList1.length > 0) {
            var subList = "";
            for (var i = 0; i < $scope.InsuranceStatusList1.length; i++) {
                if ($scope.InsuranceStatusList1[i].StatusId != 1) {
                    subList += "," + $scope.InsuranceStatusList1[i].StatusId;
                }
            }
            if (subList.charAt(0) === ",") {
                subList = subList.slice(1);
            }
        } else {
            subList = '2,3,4,5'
        }
        var obj = {
            "StatusIds": subList,
            "PatientId": $scope.patientid,
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        eHnoteUserAppointmentDataService.GetPatientInsuranceDetailsByStatusId(obj).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.ExpiredPatientInsuranceList = resp.data.rows || [];
            }
        }, function (error) {
            console.log(error);
        });
    }
    $scope.IsEditInsuranceInd = false;
    $scope.EditInsuracebyId = function (InsuranceEditItem){
        $scope.IsEditInsuranceInd = true;
        $scope.navtoEditPatientProfilePopup(3, InsuranceEditItem);
    }

    $scope.updateAppointmentPatientTrackerstatus = function () {
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.RoomTypeId = null;
        if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
            var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
            $scope.RoomTypeId = 1;
            if (SuffixId == 13) { //optha
                $scope.RoomTypeId = 12;
            }
            if (SuffixId == 10) { //doctor
                $scope.RoomTypeId = 1;
            }

        } else if ($scope.userLoginDetails.RoleID == 10) {
            $scope.RoomTypeId = 2;
        }
        else if ($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63 || $scope.userLoginDetails.RoleID === 64 || $scope.userLoginDetails.RoleID === 65 || $scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67 || $scope.userLoginDetails.RoleID === 68 || $scope.userLoginDetails.RoleID === 69) {
            $scope.RoomTypeId = 10;
        }
        else if ($scope.userLoginDetails.RoleID == 19) {
            $scope.RoomTypeId = 9;
        } else if ($scope.userLoginDetails.RoleID == 18) {
            $scope.RoomTypeId = 4;
        } else {
            $scope.RoomTypeId = null;
        }

        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "TransferUserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": $scope.HospitalId,
            "AppointmentId": appointmentinfo.AppointmentID,
            "AppointmentTrackerDetailId": 0,
            "RoleId": $scope.userLoginDetails.RoleID,
            "DoctorId": null,
            "DoctorRoleId": null,
            "RoomTypeId": $scope.RoomTypeId,
            "RoomId": null,
            "CurrentTime": $scope.CurrentTime,
            "IsSendTo": $scope.IsRoomActive ? "Y" : "N",
            "IsRollBack": "N",
            "IsCheckedIn": "N",
            "IsCheckedOut": "N",
            "IsReCheckIn": "N",
            "IsReCheckOut": "N",
            "IsExpressCheckedOut": "N",
            "VisitTypeId": appointmentinfo.VisitTypeId,
            "BookingStatusId": appointmentinfo.BookingStatusId,
            "HospitalEquipmentId": appointmentinfo.HospitalEquipmentId || null
        }
        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
            if (!$scope.IsRoomActive) {
                $scope.IsCompleteandSend = true;
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };

   
    $scope.navtoEditPatientProfilePopup = function (Type, InsuranceEditItem) {
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        if (Type == 1) {
            $scope.ShowInsuranceAddnew = true;
        }
        if (Type == 3) {
            $scope.ShowInsuranceAddnew = false;
            if ($scope.IsEditInsuranceInd == true) {
                InsuranceEditItem = InsuranceEditItem;
            } else {
                InsuranceEditItem = {};
            }
        }
        if ($scope.IsDynamicCheckInMandatory == true && $scope.PreviousUrl !== "/crm" && $scope.PreviousUrl !== "ASC") {
            if (($scope.userLoginDetails.RoleID === 2 || $scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63 || $scope.userLoginDetails.RoleID === 64 || $scope.userLoginDetails.RoleID === 65 || $scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67 || $scope.userLoginDetails.RoleID === 68 || $scope.userLoginDetails.RoleID === 69) && appointmentinfo.AppointmentStatusId == 2) {

                var params = {
                    "AppointmentId": appointmentinfo.AppointmentID || 0,
                };
                eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                    if (resp.data.Status === 'Success') {
                        var DynamicStatusarray = resp.data.rows[0];
                        //$scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                        if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63 || $scope.userLoginDetails.RoleID === 64 || $scope.userLoginDetails.RoleID === 65 || $scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67 || $scope.userLoginDetails.RoleID === 68 || $scope.userLoginDetails.RoleID === 69) && DynamicStatusarray.RoomTypeId == 10 && DynamicStatusarray.Status == 'Waiting') {
                            $scope.IsReceptionistactive = true;
                            $scope.IsRoomActive = false;
                            $scope.updateAppointmentPatientTrackerstatus();
                        }
                        else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63 || $scope.userLoginDetails.RoleID === 64 || $scope.userLoginDetails.RoleID === 65 || $scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67 || $scope.userLoginDetails.RoleID === 68 || $scope.userLoginDetails.RoleID === 69) && (DynamicStatusarray.RoomTypeId !== 10) && DynamicStatusarray.Status == 'Waiting') {

                            if ($scope.ConfirmboxObj.IsWorkOffline == true) {
                                return false;
                            }

                            // $scope.ShowConfirmString = "Patient is  " + DynamicStatusarray.Status + " at " + DynamicStatusarray.RoomType + ", Do you want to move patient to your active Room or work offline ?";
                            $scope.ShowConfirmString = "Patient is " + DynamicStatusarray.Status + " with the " + DynamicStatusarray.RoomType + ", would you like to take the patient to your active room or work offline ?";

                            $scope.mInstanceAdd2 = $uibModal.open({
                                "templateUrl": "ConfirmBox.html",
                                "backdrop": "static",
                                "scope": $scope,
                                "keyboard": false,
                                "size": "md",
                                "controller": function ($scope, $uibModal, $uibModalInstance) {
                                    $scope.onClickSelectedOffline = function () {
                                        $scope.ConfirmboxObj.IsWorkOffline = true;
                                        $uibModalInstance.dismiss("cancel");
                                    }
                                    $scope.onClickSelectedActiveRoom = function () {
                                        $scope.updateAppointmentPatientTrackerstatus();
                                        $uibModalInstance.close("Active");
                                    }
                                    $scope.ConfirmClosepopup = function () {
                                        $uibModalInstance.close("close");
                                        // $location.url("/op");
                                    }
                                }
                            });
                            $scope.mInstanceAdd2.result.then(function (resp) {
                                if (resp == "Active") {
                                    $scope.IsRoomActive = false;
                                    $scope.IsReceptionistactive = true;
                                    $scope.ConfirmboxObj.IsWorkOffline = false;
                                } else if (resp == "close") {
                                    $scope.Showeditpatient = false;
                                    /*$scope.EditPopoverInstance.dismiss("cancel");*/
                                }
                            }, function (cancel) {
                            });

                        }

                    }


                }, function (err) {
                    console.log(err);
                    alertify.error("Getting Failed");
                });


            }
        }

        var obj = {
            "Tab": Type,
            "PatientDetails": $scope.PatientDetailsInfo,
            "HospitalEquipmentList":$scope.HospitalEquipmentList,
            "PatientAddress":$scope.PatientAddressSummary,
            "PatientInsuranceSummary": $scope.PatientInsuranceSummary || [],
            "ShowInsuranceAddnew": $scope.ShowInsuranceAddnew,
            "InsuranceStatusList": $scope.InsuranceStatusList || [],
            "InsuranceEditItem": InsuranceEditItem,
            "AllMasterData": $scope.mainPatientProfileObj.AllMasterData || {},
            "FamilySummary": $scope.mainPatientProfileObj.FamilySummary || [],
            "TitlesList": $scope.mainPatientProfileObj.TitlesList || [],
            "CoverageList": $scope.mainPatientProfileObj.CoverageList || [],
            "AllUsersList": $scope.mainPatientProfileObj.AllUsersList || [],
            "AddEdit": "Edit"
        };
        $scope.mainPatientProfileObj = $scope.mainPatientProfileObj || "";
        if ($scope.mainPatientProfileObj !== "") {
            $scope.mainPatientProfileObj.PatientDetailSummary = $scope.mainPatientProfileObj.PatientDetailSummary || "";
            if ($scope.mainPatientProfileObj.PatientDetailSummary != "") {
                obj.PatientDetails.ExternalComanagerId = $scope.mainPatientProfileObj.PatientDetailSummary.ExternalComanagerId || "";
                obj.PatientDetails.ExternalComanagerName = $scope.mainPatientProfileObj.PatientDetailSummary.ExternalComanagerName || "";
                obj.PatientDetails.InternalComanagerId = $scope.mainPatientProfileObj.PatientDetailSummary.InternalComanagerId || "";
                obj.PatientDetails.InternalComanagerName = $scope.mainPatientProfileObj.PatientDetailSummary.InternalComanagerName || "";
            }
        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/UsEditPatientProfilev2.html",
            "backdrop": "static",
             "windowClass": "modal__ninety--",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return obj; }
            },
            "controller": "UsEditPatientProfileCtrlv2",
        });
        $scope.mInstanceAdd.result.then(function (type) {
            $scope.init();
            $scope.SelectPatient($scope.PatientDetailsInfo.PatientID,type);
        }, function (cancel) {
        });

    }
    $scope.DeleteRemainder = function (Data) {

        if (Data.CreatedById != $scope.UserId) {
            alertify.error("User doesn't have access to delete reminder!");
            return;
        }

        var obj = {

            "UserId": Data.DoctorID,
            "PatientAppointmentReminderId": Data.PatientAppointmentReminderId || 0,
            "HospitalId": Data.HospitalId,
            "PatientId": Data.PatientId || 0,
            "AppointmentId": Data.AppointmentId || 0,
            "Type": Data.Type,
            "Date": Data.Date || "",
            "DurationType": Data.DurationType,
            "Duration": Data.Duration || "",
            "Remarks": Data.Remarks,
            "DeleteInd": "Y"

        }
        eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status == "Success") {
                alertify.success("Reminder Deleted Successfully");
                $scope.GetSetReminderId($scope.UpcomingAppointmentArray);
            }
        }, function (err) {
            alertify.error("Getting Failed");
        });
    };


    //$scope.clinicDoctorList = [];
    //angular.forEach($scope.mainPatientProfileObj.AllUsersList, function (Aitem) {
    //    if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {
    //        $scope.clinicDoctorList.push(Aitem);
    //    }
    //});

    $scope.SaveRegisterPatientNotes = function () {
        $scope.LogObj.LogArray = []
        $scope.RegisterPatientNotes.PatientNotes = $scope.RegisterPatientNotes.PatientNotes || "";
        if ($scope.RegisterPatientNotes.PatientNotes == "") {
            alertify.error("Please Enter Notes");
            return;
        }

        if ($scope.RegisterPatientNotes.PatientNotes != '') {
            let ActionType = '', count = 0, ScreenType = '';
            if ($scope.appointmentinfo.AppointmentTypeId == 4 || $scope.appointmentinfo.AppointmentTypeId == 14) {
                ScreenType = 'ASC List';
            }
            else {
                ScreenType = 'Pre-Admission';
            }
            if ($scope.LogObj.PatientNotes == '') {
                ActionType = 'Added';
            }
            else {
                ActionType = 'Edited';
            }
            if ($scope.RegisterPatientNotes.PatientNotes != $scope.LogObj.PatientNotes) {
                count++
            }
            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 10,
                    "SubModuleName": "Profile",
                    "ScreenType": ScreenType,
                    "ActionType": ActionType,
                    //"ActionDescription": "Patient notes in profile screen from " + ScreenType,
                    "ActionDescription": `Patient notes in profile screen from ${ScreenType}  For Appointment ID: ${$scope.appointmentinfo.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        if ($scope.LogObj.LogArray.length > 0) {
            $scope.RegisterPatientNotes.Logs = $scope.LogObj || {};
        }
        eHnotePatientDataService.AddUpdatePatientNotes($scope.RegisterPatientNotes).then(function (response) {
            console.log(response);
            if (response.data.Status == "Success") {
                $scope.GetPatientNotesById();
                //$scope.RegisterPatientNotesArray = [];
                //$scope.RegisterPatientNotesArray = response.data.PatientNotesArray || [];

                ////if (response.data.PatientLatestNotesArray.length > 0) {
                ////    angular.forEach(response.data.PatientLatestNotesArray, function (ritem) {
                ////        if (ritem.NoteTypeId == 1) {
                ////            $scope.RegisterPatientNotesArray.push(ritem) || [];
                ////        }
                ////    });
                ////}
                
                ////if ($scope.RegisterPatientNotesArray.length > 0) {
                ////    angular.forEach($scope.RegisterPatientNotesArray, function (ritem) {
                ////        $scope.LogObj.PatientNotes = ritem.PatientNotes;
                ////    });
                ////}
                //// $scope.RegisterPatientNotesArray = response.data.PatientLatestNotesArray || [];
                //$scope.RegisterPatientNotes = GetRegisterPatientNotes();
                //$scope.IsEditPatientNotes = false;

            } else {
                alertify.error(response.data.Message);
            }
        }, function (error) {
            console.log(error);
        });

    };

    $scope.closePatientNotes = function () {
        $scope.RegisterPatientNotes.PatientNotes = "";
    }
    $scope.OnChangePatientNotes = function (item) {
        $scope.RegisterPatientNotes = GetRegisterPatientNotes();
        $scope.RegisterPatientNotes.PatientId = item.PatientId;
        $scope.RegisterPatientNotes.PatientNotesId = item.PatientNotesId;
        $scope.RegisterPatientNotes.PatientNotes = item.PatientNotes;
        $scope.RegisterPatientNotes.UserId = $scope.UserId;
        $scope.RegisterPatientNotes.DeleteInd = "N";
        $scope.RegisterPatientNotes.NoteType = "Profile";
        $scope.RegisterPatientNotes.NoteTypeId = 1;


        $scope.IsEditPatientNotes = true;
        // $scope.ChangeActiveTrackDetails();
    };


    $scope.DeletePatientNotes = function (item) {
        $scope.RegisterPatientNotes = GetRegisterPatientNotes();
        $scope.RegisterPatientNotes.PatientId = item.PatientId;
        $scope.RegisterPatientNotes.PatientNotesId = item.PatientNotesId;
        $scope.RegisterPatientNotes.PatientNotes = item.PatientNotes;
        $scope.RegisterPatientNotes.UserId = $scope.UserId;
        $scope.RegisterPatientNotes.DeleteInd = "Y";

        $scope.SaveRegisterPatientNotes();

    };

    $scope.navtocreatecaim = function (item) {
        item = item || {};
        let obj = {
            "PatientId": $scope.patientid ||0,
            "StatusId": 2,
            "AlertNoteTypeId": 3,
            "MasterPriority": $scope.MasterPriority,
            "MasterAlertTypes": $scope.MasterAlertTypes,
            "MasterAlertTag": $scope.MasterAlertTag,
            "MasterAlertNoteType": $scope.MasterAlertNoteType,
            "IsdesiableNotesTypeInd": true,
            "AlertItem": item,
            "PatientFullName": $scope.PatientDetailsInfo.FullName ||'',
            "PatientDisplayID": $scope.PatientDetailsInfo.PatientDisplayID || ''

        }

        $scope.mInstanceAddalert = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdatePatientAlerts.html",
            "controller": "USPatientAlertsCtrl",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__sixty-- ",
            "resolve": {
                "PatientAlertsobj": function () { return obj; },
            },
        });     
        $scope.mInstanceAddalert.result.then(function () {
            console.log("Modal closed successfully");
            //$scope.GetPatientNotesById();
            $scope.GetPatientNotesAlertsById();
        }, function () {
            console.log("Modal dismissed");
            //$scope.GetPatientNotesById();
            $scope.GetPatientNotesAlertsById();
        });
    };
    //$scope.ReslovePatientAlert = function (item) {
    //    $scope.navtocreatecaim(item);
    //}
    $scope.AddNewNotes = function () {
        $scope.IsEditPatientNotes = true;
        $scope.RegisterPatientNotes = GetRegisterPatientNotes();
        // $scope.ChangeActiveTrackDetails();   // 25-11-2022 don't want tracker
    }
    $scope.onEligibilityChange = function (item) {
        item.IsShowEligibiltySave = true;
    };
    $scope.DeletePatientInsurance = function (InsItem) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> This insurance will be inactive. Are you want to delete this insurance? </h4>", function () {
            var TempInsuarance = angular.copy(InsItem);
            TempInsuarance.DeleteInd = "Y";
            TempInsuarance.StatusId = 5; // when the insurance is deleted then the status of th
            var param = {
                "PatientId": $scope.patientid,
                "FullName": $scope.PatientFullName,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "IsConnectToFutureAppointment": false,
                "PatientInsuranceDetails": []
            }
            TempInsuarance.ScanDate = TempInsuarance.ScanDate || "";

            if (TempInsuarance.ScanDate != "") {
                //   TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate + " " + "00:00:00", "yyyy-MM-dd") || null;
                TempInsuarance.ScanDate = $filter("dateFormatter")(TempInsuarance.ScanDate, "-");
            }
            TempInsuarance.VerifiedDate = TempInsuarance.VerifiedDate || '';
            if (TempInsuarance.VerifiedDate != "") {
                //  TempInsuarance.VerifiedDate = $filter('date')(new Date(TempInsuarance.VerifiedDate), 'yyyy-MM-dd');
                TempInsuarance.VerifiedDate = $filter("dateFormatter")(TempInsuarance.VerifiedDate, "-");
            }

            TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || "";
            if (TempInsuarance.EffectiveDate != "") {
                TempInsuarance.EffectiveDate = moment(TempInsuarance.EffectiveDate).format('YYYY-MM-DD');
            }
            TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || "";
            if (TempInsuarance.ExpiryDate != "") {
                TempInsuarance.ExpiryDate = moment(TempInsuarance.ExpiryDate).format('YYYY-MM-DD');
            }
            param.PatientInsuranceDetails.push(TempInsuarance);

            eHnotePatientDataService.SavePatientInsuranceDetailsById(param, OnAddPatientSuccess, OnAddPatientError);
            function OnAddPatientSuccess(resp) {
                if (resp.Status === "Success") {
                    console.log("Delete Insurance in patient level");
                    $scope.PatientInsuranceSummary = angular.copy(resp.PatientInsuranceDetails);
                    $scope.getPatientInsuranceDetailsOfPatient();
                    if ($scope.PatientInsuranceSummary.length > 0) {
                        angular.forEach($scope.PatientInsuranceSummary, function (insitem, index) {
                            insitem.EffectiveDate = insitem.EffectiveDate || "";
                            if (insitem.EffectiveDate != "") {
                                insitem.EffectiveDate = $filter("date")(insitem.EffectiveDate, "MM-dd-yyyy") || "";
                            }
                            insitem.ExpiryDate = insitem.ExpiryDate || "";
                            if (insitem.ExpiryDate != "") {
                                insitem.ExpiryDate = $filter("date")(insitem.ExpiryDate, "MM-dd-yyyy") || "";
                            }
                            insitem.ScanDate = insitem.ScanDate || "";
                            if (insitem.ScanDate != "") {
                                insitem.ScanDate = $filter("date")(insitem.ScanDate, "MM-dd-yyyy") || "";
                            }
                            insitem.VerifiedDate = insitem.VerifiedDate || "";
                            if (insitem.VerifiedDate != "") {
                                insitem.VerifiedDate = $filter("date")(insitem.VerifiedDate, "MM-dd-yyyy") || "";
                            }
                        });
                    }
                }
            }
            function OnAddPatientError() {
                alertify.error("Creating  Failed");
            }

        }, function () {
            return;
        });
    };
    $scope.navtoOpenAddDepositAmount = function (type, Incomingfrom, ID) {
       var PatientObj = {
            "PatientFullName": $scope.PatientDetailsInfo.FullName,
            "FirstName": $scope.PatientDetailsInfo.FirstName,
            "LastName": $scope.PatientDetailsInfo.LastName,
            "MiddleName": $scope.PatientDetailsInfo.MiddleName,
            "EmailId": $scope.PatientDetailsInfo.EmailId,
            "Gender": $scope.mainPatientProfileObj.PatientDetailSummary.Gender,
            "PatientId": $scope.PatientDetailsInfo.PatientID,
            "PhAreaCD": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '',
            "PhCntryCD": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode || '',
            "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber || '',
            "MobileNo": $scope.PatientDetailsInfo.ContactInfo.MobileNumber || '',
            "DOB": $scope.PatientDetailsInfo.DOB || '',
            "OldMRNo": $scope.PatientDetailsInfo.OldMrno || '',
            "PatientDisplayId": $scope.PatientDetailsInfo.PatientDisplayID || '',
            "S3URL": $scope.mainPatientProfileObj.PatientDetailSummary.S3URL || '',
            "AgeInYears": $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears || 0,
            "AgeInMonths": $scope.mainPatientProfileObj.PatientDetailSummary.AgeInMonths || 0,
            "CheckInBy": "",
           "BookingStatusId": null,
           "Address1": $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.AddressLine1 || '',
           "Address2": $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.AddressLine2 || '',
           "CityName": $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.CityName || '',
           "StateName": $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.StateName || '',
           "StateCode": $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.StateCode || '',
           "ZipCode": $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.ZipCode || '',

       };

        $scope.obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "ScreenType": type || '',
            "Incomingfrom": Incomingfrom || '',
            "Type": '',
            "UsersList": $scope.mainPatientProfileObj.AllUsersList,
            "Patientobj": PatientObj,
            "OrganizationFacilityList": $scope.mainPatientProfileObj.OrganizationFacilityList,
            "DepositTypes": $scope.mainPatientProfileObj.DepositTypes,
            "WriteOffReasons": $scope.mainPatientProfileObj.WriteOffReasons,
            "BillingProviderName": "",
            "FacilityName": "",
            "TotalPatientBalance": 0,
            "AllBranchesList": $scope.mainPatientProfileObj.AllBranchesList || [],
            "HospitalId": $scope.HospitalId || null,
            "CardTypesData": $scope.mainPatientProfileObj.CardTypesData || [],
            "DoctorName": $scope.mainPatientProfileObj.PatientDetailSummary.CreatedBy || "",
            "ID": ID || 2,
        }

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
            "controller": "UsAddPatientDepositsCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__popup--1   "

        });
        modalInstance.result.then(function () {
            //$scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());
            /*$scope.SearchPatientDepositslist("pageLoad");*/
            $scope.getPatientDepositAmountById();
        }, function () { });
    }

    $scope.getPatientDepositAmountById = function (pageno, type) {
        //$scope.PatientDepositsObj.PageNumber = pageno || 1;
        //var type = (type === undefined || type === '') ? 'All' : type;
        var obj = {
            "DepositFrom": "",
            "DepositTo": "",
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PaymentModeId": 0,
            "PageSize": 20,
            "PageNumber": 1,
            "TransactionNumber": "",
            "SortBy": "Asc",
            "SearchType": "Deposit"
        };

        obj.PaymentModeId = parseInt(obj.PaymentModeId);


        if (obj.DepositFrom != "") {
            obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
        }
        if (obj.DepositTo != "") {
            obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
        }


        eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.PatientDepositsListArray = resp.data.rows || [];

                if ($scope.PatientDepositsListArray.length > 0) {
                    angular.forEach($scope.PatientDepositsListArray, function (pitem) {
                        pitem.IsselectedDeposit = false;
                    })

                }
                if ($scope.PatientDepositsListArray.length > 0) {
                    $scope.IsShowDepositScreen = false;
                } else {
                    $scope.IsShowDepositScreen = true;
                }
               // $scope.PatientDepositsObj.Count = resp.data.count || 0;
                $scope.DepositDetails = resp.data;
            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.RefreshProfile = function () {
        $scope.init();
    }

    $scope.EditProfileStatusPopup = function (profilestausdetails, type) {
        $scope.ShowPatientListDrop = false;
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/ProfileStatusPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "controller": function ($scope, $uibModalInstance) {
                $scope.ProfilestatusArray = [];
                $scope.PatientAllHistoryArray = [];
                $scope.Profilestatus = profilestausdetails.ProfileStatusMasterId || 3;
                $scope.ProfileStatusType = type;
                var StatusDetailslist = [];

                $scope.StatusObj = {
                    "PatientProfileStatusId": 0,
                    "PatientId": $scope.patientid,
                    "UserId": $scope.UserId,
                    "ProfileStatusMasterId": $scope.Profilestatus,
                    "StatusDetails": "",
                    "Remarks": "",
                    "OrganizationId": $scope.HospitalId
                };
                $scope.Statuslist = [{ "Id": 1, "Name": "Complete" },
                { "Id": 2, "Name": "InComplete" },
                { "Id": 3, "Name": "Not Work" }];

                profilestausdetails = profilestausdetails || "";
                if (profilestausdetails != "") {
                    if (profilestausdetails.PatientProfileStatusId != undefined && profilestausdetails.PatientProfileStatusId != 0) {
                        $scope.StatusObj.PatientProfileStatusId = profilestausdetails.PatientProfileStatusId;
                        $scope.StatusObj.Remarks = profilestausdetails.Remarks || "";
                        $scope.StatusObj.StatusDetails = profilestausdetails.StatusDetails || "";
                        if (profilestausdetails.ProfileStatusMasterId == 2) {
                            if ($scope.StatusObj.StatusDetails != '') {
                                StatusDetailslist = JSON.parse($scope.StatusObj.StatusDetails);
                            }
                        }
                    }
                }


                $scope.GetIncompletestatus = function () {
                    eHnoteSettingsDataService.GetMasterProfileStatusInCompleteDetails($scope.ParenthospitalId).then(function (resp) {

                        if (resp.data.status == "Success") {
                            $scope.InCompleteDetailsList = [];
                            if (resp.data.rows.length > 0) {
                                $scope.InCompleteDetailsList = resp.data.rows || [];
                                
                                angular.forEach($scope.InCompleteDetailsList, function (item) {
                                    item.isChecked = false;
                                    if (item.IncompleteStatusId == 1) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.ScanID;
                                    } else if (item.IncompleteStatusId == 2) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.ReferralLetter;
                                    } else if (item.IncompleteStatusId == 6) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.BasicInfo;
                                    } else if (item.IncompleteStatusId == 7) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.DemographicInfo;
                                    } else if (item.IncompleteStatusId == 8) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.InsuranceInfo;
                                    } else if (item.IncompleteStatusId == 9) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.VerifyEligibility;
                                    } else if (item.IncompleteStatusId == 10) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.Addressinfo;
                                    } else if (item.IncompleteStatusId == 11) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.AddressID;
                                    } else if (item.IncompleteStatusId == 12) {
                                        item.isChecked = $scope.ProfileStatusUpdatedObj.Consultationentryfrom;
                                    }
                                });

                                var incompletefilter = $filter('filter')($scope.InCompleteDetailsList, { "isChecked": false }, true) || [];
                                if (incompletefilter.length === $scope.InCompleteDetailsList.length) {
                                    $scope.StatusObj.ProfileStatusMasterId = 1;
                                } else {
                                    $scope.StatusObj.ProfileStatusMasterId = 2;
                                }


                            }
                        } else {
                            alertify.error("Failed");
                        }
                    }, function (error) {
                        alertify.error(error);
                    });
                };
                $scope.GetProfileStatusView = function () {
                    var param = {
                        "PatientId": $scope.patientid
                    };
                    eHnotePatientDataService.GetPatientProfileStatus(param).then(function (resp) {
                        if (resp.data.status == "Success") {
                            $scope.ProfilestatusArray = [];
                            if (resp.data.rows.length > 0) {
                                $scope.ProfilestatusArray = resp.data.rows || [];
                                angular.forEach($scope.ProfilestatusArray, function (pitem) {
                                    if (pitem.StatusDetails != '') {
                                        pitem.StatusDetails = JSON.parse(pitem.StatusDetails);
                                    }
                                });
                            }
                        } else {

                        }
                    }, function (error) {

                    });
                };
                $scope.GetAllHistoryforPatient = function () {                  
                    eHnotePatientDataService.GetPatientAllHistoryDetails($scope.patientid).then(function (resp) {
                        if (resp.data.status == "Success") {
                            $scope.PatientAllHistoryArray = [];
                            if (resp.data != undefined) {
                                var patienthistories = resp.data;
                                $scope.AllHistoryDetails = [];
                                if (patienthistories.PatientBasicInfo.length > 0) {
                                    angular.forEach(patienthistories.PatientBasicInfo, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Basic Info"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }
                                if (patienthistories.DemographicsInfo.length > 0) {
                                    angular.forEach(patienthistories.DemographicsInfo, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Demographic Info"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }
                                if (patienthistories.DesignatedInfo.length > 0) {
                                    angular.forEach(patienthistories.DesignatedInfo, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Designate Info"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }
                                if (patienthistories.InsuranceListLog.length > 0) {
                                    angular.forEach(patienthistories.InsuranceListLog, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Insurance Info"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }
                                if (patienthistories.PatientAddress.length > 0) {
                                    angular.forEach(patienthistories.PatientAddress, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Address Info"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }
                                if (patienthistories.FamilyInfoLog.length > 0) {
                                    angular.forEach(patienthistories.FamilyInfoLog, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Family Info"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }
                                if (patienthistories.ProfileStatusRemarksArray.length > 0) {
                                    angular.forEach(patienthistories.ProfileStatusRemarksArray, function (sitem) {
                                        var obj = {
                                            "ModifiedDt": sitem.ModifiedDt,
                                            "ModifiedDateTime": sitem.ModifiedDateTime,
                                            "ModifiedByName": sitem.ModifiedByName,
                                            "logName": "Profile Remarks"
                                        };
                                        $scope.AllHistoryDetails.push(obj);
                                    });
                                }

                                var uniqApptsList = _.uniq($scope.AllHistoryDetails, function (x) {
                                    return x.ModifiedDt;
                                });
                                if (uniqApptsList.length > 0) {
                                    angular.forEach(uniqApptsList, function (item) {
                                        var List = $filter('filter')($scope.AllHistoryDetails, { "ModifiedDt": item.ModifiedDt }, true) || [];
                                        if (List.length > 0) {
                                            var obj = {
                                                "Date": item.ModifiedDt,
                                                "ArrayList": angular.copy(List) || [],
                                                "IsShow": false
                                            };
                                            $scope.PatientAllHistoryArray.push(obj);
                                        }
                                    });

                                    if ($scope.PatientAllHistoryArray.length > 0) {
                                        $scope.PatientAllHistoryArray[0].IsShow = true;
                                    }
                                }

                            }
                        } else {

                        }
                    }, function (error) {

                    });
                }

                if ($scope.ProfileStatusType == "View") {
                    $scope.GetProfileStatusView();
                } else if ($scope.ProfileStatusType == "AllHistory") {
                    $scope.GetAllHistoryforPatient();
                } else {
                    $scope.GetIncompletestatus();
                }
                function GetProfileStatusUpdatedObj() {
                    return {
                        "BasicInfo": true,
                        "DemographicInfo": true,
                        "InsuranceInfo": true,
                        "ScanID": true,
                        "VerifyEligibility": true,
                        "ReferralLetter": true,
                        "Addressinfo": true,
                        "AddressID": true,
                        "Consultationentryfrom": true
                    }
                };
                $scope.ProfileStatusUpdatedObj = GetProfileStatusUpdatedObj();
                $scope.GetProfilestatusIncompleteDetails = function () {
                    $scope.ProfileStatusUpdatedObj = GetProfileStatusUpdatedObj();

                    if ($scope.PatientDetailSummary != undefined) {
                        if ($scope.PatientDetailSummary.FirstName != "" && $scope.PatientDetailSummary.LastName != "" && $scope.PatientDetailSummary.DOB != "" && $scope.PatientDetailSummary.Gender != "" &&
                            $scope.PatientDetailSummary.ContactInfo.MobileNumber != "") {
                            $scope.ProfileStatusUpdatedObj.BasicInfo = false;
                        }
                    }
                    if ($scope.DemographicSummary != undefined) {
                        if ($scope.DemographicSummary.LanguageID != 0 || $scope.DemographicSummary.RaceID != 0 || $scope.DemographicSummary.EthnicityID != 0 || $scope.DemographicSummary.ExpressionId != 0 || $scope.DemographicSummary.ProficiencyId != 0 ||
                            $scope.DemographicSummary.MultipleBirth != '' || $scope.DemographicSummary.LGuardianFirstName != '' || $scope.DemographicSummary.LGuardianMiddleName != '' || $scope.DemographicSummary.LGuardianLastName != '' || $scope.DemographicSummary.PatFatherFirstName != '' || $scope.DemographicSummary.MothersMiddleName != '' ||
                            $scope.DemographicSummary.SexualOrientationId != 0 || $scope.DemographicSummary.GenderIdentityStatusId != '') {
                            $scope.ProfileStatusUpdatedObj.DemographicInfo = false;
                        }
                    }

                    if ($scope.PatientInsuranceSummary.length > 0) {
                        $scope.ProfileStatusUpdatedObj.InsuranceInfo = false;
                        angular.forEach($scope.PatientInsuranceSummary, function (pitem) {
                            if (pitem.IsVerified == true) {
                                $scope.ProfileStatusUpdatedObj.VerifyEligibility = false;
                            }
                            if (pitem.PatientDocumentDetails.length > 0) {
                                $scope.ProfileStatusUpdatedObj.ScanID = false;
                            }
                        });
                    }

                    if ($scope.PatientDesignatedSummary != undefined) {
                        $scope.PatientDesignatedSummary.PatientPCPDocuments = $scope.PatientDesignatedSummary.PatientPCPDocuments || [];
                        if ($scope.PatientDesignatedSummary.PatientPCPDocuments.length > 0) {
                            $scope.ProfileStatusUpdatedObj.ReferralLetter = false;
                        }
                    }
                    if ($scope.PatientAddressSummary != undefined) {
                        $scope.PatientAddressSummary.PostalAddress.CityId = $scope.PatientAddressSummary.PostalAddress.CityId || 0;
                        $scope.PatientAddressSummary.PermanentAddress.CityId = $scope.PatientAddressSummary.PermanentAddress.CityId || 0;

                        if ($scope.PatientAddressSummary.PostalAddress.AddressLine1 != '' || $scope.PatientAddressSummary.PostalAddress.AddressLine2 != '' || $scope.PatientAddressSummary.PostalAddress.CountyId != 0 || $scope.PatientAddressSummary.PostalAddress.CityId != 0 ||
                            $scope.PatientAddressSummary.PostalAddress.StateId != 0 || $scope.PatientAddressSummary.PostalAddress.CountryId != 0) {
                            $scope.ProfileStatusUpdatedObj.Addressinfo = false;
                        }
                        if ($scope.PatientAddressSummary.PermanentAddress.AddressLine1 != '' || $scope.PatientAddressSummary.PermanentAddress.AddressLine2 != '' || $scope.PatientAddressSummary.PermanentAddress.CountyId != 0 || $scope.PatientAddressSummary.PermanentAddress.CityId != 0 ||
                            $scope.PatientAddressSummary.PermanentAddress.StateId != 0 || $scope.PatientAddressSummary.PermanentAddress.CountryId != 0) {
                            $scope.ProfileStatusUpdatedObj.Addressinfo = false;
                        }
                        $scope.PatientAddressSummary.PatientAddressDocuments = $scope.PatientAddressSummary.PatientAddressDocuments || [];
                        if ($scope.PatientAddressSummary.PatientAddressDocuments.length > 0) {
                            $scope.ProfileStatusUpdatedObj.AddressID = false;
                        }
                    }

                }
                $scope.GetProfilestatusIncompleteDetails();

                $scope.ClearDetails = function () {
                    if ($scope.InCompleteDetailsList.length > 0) {
                        angular.forEach($scope.InCompleteDetailsList, function (item) {
                            item.isChecked = false;
                        });
                    }
                    $scope.StatusObj.Remarks = "";

                }
                $scope.ChangeProfilestatus = function (obj) {
                    if ($scope.InCompleteDetailsList.length > 0) {
                        angular.forEach($scope.InCompleteDetailsList, function (item) {
                            item.isChecked = false;
                        });
                    }
                    $scope.StatusObj.Remarks = "";
                }
                $scope.SaveProfiledetails = function () {
                    var StatusDetails = [];
                    $scope.StatusObj.StatusDetails = "";
                    if ($scope.StatusObj.ProfileStatusMasterId == 2) {
                        angular.forEach($scope.InCompleteDetailsList, function (item) {
                            if (item.isChecked == true) {
                                var obj = {
                                    "IncompleteStatusId": item.IncompleteStatusId,
                                    "IncompleteStatusName": item.IncompleteStatusName,
                                }
                                StatusDetails.push(obj);
                            }
                        });
                        if (StatusDetails.length > 0) {
                            $scope.StatusObj.StatusDetails = JSON.stringify(StatusDetails) || "";
                        } else {
                            $scope.StatusObj.StatusDetails = "";
                        }
                    }
                    eHnotePatientDataService.AddUpdatePatientProfileStatus($scope.StatusObj).then(function (resp) {
                        if (resp.data.status == "Success") {
                            var Profilestatus = resp.data.rows[0];
                            if ($scope.StatusObj.PatientProfileStatusId == 0) {
                                alertify.success("Save Successfully");
                            } else {
                                alertify.success("Updated Successfully");
                            }
                            $uibModalInstance.close(Profilestatus);
                        } else {

                        }
                    }, function (error) {

                    });
                }

                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            $scope.PatientProfileStatusId = resp.ProfileStatusMasterId;
            $scope.PatientprofileStatusDetails = resp;
        }, function (cancel) {
        });
    };

    $scope.$on("RefreshBookedProfileAppts", function () {

        $scope.init();
    });
    $scope.ExpireInsurancelistpopupnew = function () {
        $scope.getPatientInsuranceDetailsOfPatient();
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/ExpireInsurancelistpopupnew.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__eighty--",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };


    $scope.GetPatientNotesById = function () {
        var obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "NoteTypeId": 1
        }
        eHnoteSettingsDataService.GetPatientNotesById(obj).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.RegisterPatientNotesArray = resp.data.rows || [];
                $scope.RegisterPatientNotes = GetRegisterPatientNotes();
                $scope.IsEditPatientNotes = false;
            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.GetRemindersHistory = function () {

        let param = {
            "AppointmentId": 0,
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "IsHistory": true
        }

        eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
            if (resp.data.status == "Success") {
                let RemindersArray = angular.copy(resp.data.rows);

                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/RemindersHistoryPopup.html",
                    //"backdrop": "static",
                    "keyboard": false,
                    /*"size": "lg",*/
                    "windowClass": "modal__eighty--",
                    "resolve": {
                        "RemindersArray": function () { return RemindersArray; },
                    },
                    "controller": function ($scope, $uibModalInstance, RemindersArray) {
                        $scope.RemindersArray = angular.copy(RemindersArray);
                        $scope.Uibclose = function () {
                            $uibModalInstance.close();
                        }

                    }
                });

            }
        }, function (err) {
            alertify.error("Getting Failed");
        });


    };

    $scope.editPatientNotes = function (sitem) {
        sitem = sitem || {};
        $scope.navtocreatecaim(sitem);
    }
    //$scope.DeletePatientAlert = function (item) {

    //    item = item || null;

    //    var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
    //        var obj = {

    //            "AlertId": item.AlertId,
    //            "PatientId": item.PatientId,
    //            "AlertTypeId": item.AlertTypeId,
    //            "AlertType": item.AlertType,
    //            "AlertMessage": item.AlertMessage,
    //            "StatusId": item.StatusId,
    //            "Status": item.Status,
    //            "PriorityId": item.PriorityId,
    //            "PriorityName": item.PriorityName,
    //            "StartDate": $filter('date')(new Date(), "yyyy-MM-dd"),
    //            "EndDate": $filter('date')(new Date(), "yyyy-MM-dd"),
    //            "AlertTagId": item.AlertTagId,
    //            "AlertTagName": item.AlertTagName,
    //            "AlertTypesList": item.AlertTypesList || [],
    //            "DeleteInd": 'Y',
    //            "UserId": eHnoteMasterDataService.getLoginId(),
    //            "IsfromscreenInd": true
    //        }
    //        eHnoteInsuranceService.AddUpdatePatientAlerts(obj).then(function (resp) {

    //            if (resp.data.status == "Success") {
    //                alertify.success("Deleted successfully");
    //            } else {
    //                alertify.error("Failed to delete the patient alert.");
    //            }
    //            $scope.GetPatientNotesAlertsById();
    //            $scope.GetPatientNotesById();
    //        }, function onerror(err) {
    //            console.log(err);
    //        });

    //    },
    //        function () {
    //            $scope.$digest();
    //            r = "You pressed Cancel!";
    //        });

    //}


    $scope.DeletePatientAlert = function (item) {

        item = item || null;

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
            var obj = {
                UserId: $scope.UserId,
                OrganizationId: $scope.HospitalId,
                PatientNoteId: item.PatientNoteId || 0,
                AppointmentNoteId: item.AppointmentNoteId || 0,
                NoteTypeId: item.NoteTypeId,
                NoteTypeName: item.NoteType,
                PatientId: item.PatientId,
                AppointmentId: item.AppointmentId,
                DeleteInd: "Y",
                Notes: item.PatientNotes,
                CreateAlert: 1,
                AlertData: null
            };

            // Check if CreateAlert is enabled and AlertData exists
            if (item.AlertData !== null) {
                obj.AlertData = {
                    AlertId: item.AlertData.AlertId,
                    StartDate: item.AlertData.StartDate,
                    EndDate: item.AlertData.EndDate || null,
                    PriorityId: item.AlertData.PriorityId,
                    PriorityName: item.AlertData.PriorityName,
                    AlertTagId: item.AlertData.AlertTagId,
                    AlertTagName: item.AlertData.AlertTagName,
                    AlertMessage: item.AlertData.AlertMessage,
                    StatusId: item.AlertData.StatusId,
                    Status: item.AlertData.Status,
                    DeleteInd: "Y",
                    AlertTypesList: item.AlertData.AlertTypesList || []
                };
                angular.forEach(item.AlertData.AlertTypesList, function (pitem) {
                    pitem.IsChecked = false;
                    pitem.DeleteInd = 'Y';
                });
            }

            eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {

                if (resp.data.status == "Success") {
                    alertify.success("Deleted successfully");
                } else {
                    alertify.error("Failed to delete the patient alert.");
                }
                $scope.GetPatientNotesAlertsById();
              
            }, function onerror(err) {
                console.log(err);
            });

        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });

    }

    $scope.SelectedPatientNotesPopover = function (item) {
        $scope.PatientNotesLogArray = item || [];
     
    }
    $scope.PatientNotesAdditionalinfo = {
        templateUrl: 'PatientNotesAdditionalinfo.html',
    };

    $scope.ReslovePatientAlert = function (item) {

        item = item || null;
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
            var obj = {
                UserId: $scope.UserId,
                OrganizationId: $scope.HospitalId,
                PatientNoteId: item.PatientNoteId || 0,
                AppointmentNoteId: item.AppointmentNoteId || 0,
                NoteTypeId: item.NoteTypeId,
                NoteTypeName: item.NoteType,
                PatientId: item.PatientId,
                AppointmentId: item.AppointmentId,
                DeleteInd: item.DeleteInd,
                Notes: item.PatientNotes,
                CreateAlert: 1,
                AlertData: null
            };

            if (item.AlertData !== null) {
                obj.AlertData = {
                    AlertId: item.AlertData.AlertId,
                    StartDate: item.AlertData.StartDate,
                    EndDate: item.AlertData.EndDate || null,
                    PriorityId: item.AlertData.PriorityId,
                    PriorityName: item.AlertData.PriorityName,
                    AlertTagId: item.AlertData.AlertTagId,
                    AlertTagName: item.AlertData.AlertTagName,
                    AlertMessage: item.AlertData.AlertMessage,
                    StatusId: item.AlertData.StatusId,
                    Status: item.AlertData.Status,
                    DeleteInd: "Y",
                    AlertTypesList: item.AlertData.AlertTypesList || []
                };
                angular.forEach(item.AlertData.AlertTypesList, function (pitem) {
                    pitem.IsChecked = false;
                    pitem.DeleteInd = 'Y';
                });
            }        
           
            eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Patient alert resolved successfully!");
                    $scope.GetPatientNotesAlertsById();                  
                }
            }, function onerror(err) {
                console.log(err);
            });

        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
    };


    $scope.EligibilityHistorypopup = function () {
        $scope.getPatientInsuranceDetailsOfPatient()
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "InsuranceEligibility.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            /* "size": "lg"*/
            // "windowClass": "inventory-full-popup"
            "windowClass": "modal__ninety--",
            "controller": function ($scope, $uibModalInstance) {
                $scope.closeverify = function () {
                    $uibModalInstance.dismiss("cancel"); // Close the modal properly

                };
            }
        });
    };

    $scope.showEligibilityinPopup2 = function () {
        eHnoteAuditServices.getPatientDetailsById($scope.patientid , ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;
                console.log(JSON.stringify(patientitem));
                $scope.PatientDetailsInfo.FirstName = patientitem.Patient[0].FirstName
                $scope.PatientDetailsInfo.LastName = patientitem.Patient[0].LastName
                $scope.PatientDetailsInfo.DisplayNumber = patientitem.Patient[0].DisplayNumber
                $scope.PatientDetailsInfo.HomeCountryCode = patientitem.Patient[0].HomeCountryCode
                $scope.PatientDetailsInfo.HomeNumber = patientitem.Patient[0].HomeNumber
                $scope.PatientDetailsInfo.HomeAreaCode = patientitem.Patient[0].HomeAreaCode
                $scope.PatientDetailsInfo.DisplayOfficeNumber = patientitem.Patient[0].DisplayOfficeNumber
                $scope.PatientDetailsInfo.OfficeNumber = patientitem.Patient[0].OfficeNumber
                $scope.PatientDetailsInfo.OfficeAreaCode = patientitem.Patient[0].OfficeAreaCode
                $scope.PatientDetailsInfo.OfficeCountryCode = patientitem.Patient[0].OfficeCountryCode
                $scope.PatientDetailsInfo.Age = patientitem.Patient[0].Age || 0;
                $scope.PatientDetailsInfo.PatientDisplayID = patientitem.Patient[0].PatientDisplayId || "";
                $scope.PatientDetailsInfo.OldMrno = patientitem.Patient[0].OldMrno || "";
                $scope.PatientDetailsInfo.FullName = patientitem.Patient[0].FullName;
                $scope.PatientDetailsInfo.S3URL = patientitem.Patient[0].S3URL || "";
                $scope.PatientDetailsInfo.Gender = patientitem.Patient[0].Gender;
                $scope.PatientDetailsInfo.PatientID = patientitem.Patient[0].PatientID;

                $scope.PatientDetailsInfo.AgeInDays = patientitem.Patient[0].AgeInDays;
                $scope.PatientDetailsInfo.AgeInMonths = patientitem.Patient[0].AgeInMonths;
                $scope.PatientDetailsInfo.AgeInYears = patientitem.Patient[0].AgeInYears;

                $scope.PatientDetailsInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;
                $scope.PatientDetailsInfo.IsDiseased = patientitem.Patient[0].IsDiseased || false;
                $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls = patientitem.Patient[0].IsAllowAiAutomatedCalls || false;
                $scope.PatientDetailsInfo.PatientTagList = [];
                if (patientitem.Patient[0].PatientTagList.length > 0) {
                    $scope.PatientDetailsInfo.PatientTagList = angular.copy(patientitem.Patient[0].PatientTagList);
                }

                if (patientitem.Patient[0].DOB != "") {
                    $scope.PatientDetailsInfo.DOB = $filter('date')(patientitem.Patient[0].DOB, "MM-dd-yyyy");
                }

                $scope.ageinYears = patientitem.Patient[0].AgeInYears;
                $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
                $scope.ageinDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
                $scope.PatientDetailsInfo.SocialSecurityNo = patientitem.Patient[0].SocialSecurityNo || "";
                if ($scope.PatientDetailsInfo.SocialSecurityNo == 0 || $scope.PatientDetailsInfo.SocialSecurityNo == "0") {
                    $scope.PatientDetailsInfo.SocialSecurityNo = "";
                }

                $scope.PatientOfficeumber = patientitem.Patient[0].OfficeAreaCode + patientitem.Patient[0].PatientOfficeNumber;
                $scope.PatientDetailsInfo.BloodGroupName = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupName;

                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeumber);
                $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.ContactInfo.EmailID = patientitem.Patient[0].EmailId || "";
                $scope.PatientDetailsInfo.MaritalStatusName = patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus || "";

                $scope.PatientMNumber = patientitem.Patient[0].Altareacode + patientitem.Patient[0].PatientHomeNumber;
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.EmployerPhoneNo = patientitem.Patient[0].EmployerPhoneNo;

                $scope.PatientDetailsInfo.FatherName = patientitem.Patient[0].FatherName;
                $scope.PatientDetailsInfo.MotherName = patientitem.Patient[0].MotherName;
                $scope.PatientDetailsInfo.Guardian = patientitem.Patient[0].Guardian;
                $scope.PatientDetailsInfo.Employer = patientitem.Patient[0].Employer;
            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }

        var InsObj =
        {
            "AppointmentId": $scope.appointmentinfo.AppointmentId,
            "PatientId": $scope.patientid ,
            "SendPlanDetailsInd": 1
        }


      
        var includeInactive = true;
        eHnoteInsuranceService.getPatientInsuranceDtls($scope.patientid , 0, includeInactive).then(function (response) {

            if (response.data !== undefined) {
                $scope.ExpiredPatientInsuranceList = response.data.ExpiredPatientInsuranceList || [];
                if (response.data.rows.length > 0) {

                    let ActiveInsuranceList = [];
                    if (response.data.rows.length > 0) {
                        // ActiveInsuranceList = $filter('filter')(response.data.rows, { 'StatusId': 1 }, true) || [];
                        ActiveInsuranceList = $filter('filter')(response.data.rows, function (item) {
                            return item.StatusId === 1 || item.StatusId === 5;
                        }) || [];
                    }

                    $scope.reverifyitem = ActiveInsuranceList.length > 0
                        ? ActiveInsuranceList[0]
                        : {};

                  

                    if (ActiveInsuranceList.length > 0) {
                        $scope.obj = {
                            "AppointmentInsuranceDetailId": ActiveInsuranceList[0].AppointmentInsuranceDetailId || 0,
                            "PatientInsuranceDetailId": ActiveInsuranceList[0].PatientInsuranceDetailId
                        }
                    }
                    $scope.PatientDetailsInfo = angular.copy($scope.PatientDetailsInfo);
                    $scope.modalpayorInstance = $uibModal.open({
                        "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
                        "backdrop": "static",
                        "controller": "UsPatientEligibilityResponseDetailsPopUpCtrl",
                        "resolve": {
                            "Selectobj": function () { return $scope.obj; },
                            "ReverifyItem": function () { return $scope.reverifyitem; },
                            "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; }
                        },
                        "keyboard": false,
                        "windowClass": "offcanves-right",
                    })

                    $scope.modalpayorInstance.result.then(function (resp) {
                    }, function () {
                        //$scope.getPatientInsuranceDetailsOfPatient();

                    });
                }
            }
        }, function (err) {
            alertify.error("Getting Insurance Data Failed");
        });

    };

    $scope.EditPatientNotesAccess =
        $scope.PreviousUrl == "/crm"
            ? $scope.UserAccessRights.AllAccessRights.CRMEditPatientNotesAccess
            : $scope.UserAccessRights.AllAccessRights.OPEditPatientNotesAccess;

    $scope.DeletePatientNotesAccess =
        $scope.PreviousUrl == "/crm"
            ? $scope.UserAccessRights.AllAccessRights.CRMDeletePatientNotesAccess
            : $scope.UserAccessRights.AllAccessRights.OPDeletePatientNotesAccess;
    
}]);



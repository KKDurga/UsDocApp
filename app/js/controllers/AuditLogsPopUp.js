"use strict";
eHnoteWebApp.controller("AuditLogsPopUp", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnoteSurgeryService", "$q", "eHnoteDiagnosisDataServices", "allUserList", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteMainAdminServices", "obj", "$uibModal", "datapersistanceFactory","eHnoteAuditServices",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteCacheStorageService, eHnoteSurgeryService, $q, eHnoteDiagnosisDataServices, allUserList, eHnoteUserDataService, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteMainAdminServices, obj, $uibModal, datapersistanceFactory, eHnoteAuditServices) {
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.allUserList = allUserList || [];
        $scope.AppointmentId = obj.AppointmentId || 0;
        $scope.PatientId = obj.PatientId || 0;
        $scope.ModuleTypeId = obj.ModuleTypeId || 0;
        $scope.Type = obj.Type || '';
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };

        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.patSearchType = 2;
        $scope.maxSize = 200;
        $scope.AssescurrentPage = 1;
        $scope.AssespageChanged = function (AssescurrentPage) {
            $scope.AssescurrentPage = AssescurrentPage;
            $scope.searchMainReports();
        }
        $scope.searchUserInLogstab = { "txt1": "", "txt2": "" };
        $scope.searcActionNameTab = { "txt1": "", "txt2": "" };
        $scope.searcActionName = 'All';
        $scope.PatLogSearchType = 1;
        $scope.MainTainLogsObj = {
            "FromDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
            "ToDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
            "UserName": "",
            "Action": "",
            "AllDoctorCheck": "",
            "UserIds": "",
        }
        $scope.SeachByPatientObj = {
            "searchPatientTxt": "",
            "searchPatientIdTxt": "",
            "searchPatientOldMR": "",
        }
        $scope.LogMaintainAllUsersList = [];
        $scope.LogMaintainAllUsersList = angular.copy($scope.allUserList) || [];
        if ($scope.LogMaintainAllUsersList.length > 0) {
            angular.forEach($scope.LogMaintainAllUsersList, function (item) {
                item.isChecked = true;
                $scope.MainTainLogsObj.AllUsersCheck = true;
            });
        }

        $scope.LogsCheckAllUsers = function (val) {
            if (val) {
                angular.forEach($scope.LogMaintainAllUsersList, function (item) {
                    item.isChecked = true;
                });

                $scope.searchUserInLogs = 'All';
            } else {
                angular.forEach($scope.LogMaintainAllUsersList, function (item) {
                    item.isChecked = false;
                });
                $scope.searchUserInLogs = 'Select Users';
            }
            var checkedArray = _.where($scope.LogMaintainAllUsersList, { isChecked: true });
            $scope.MainTainLogsObj.AllUsersCheck = checkedArray.length > 0 && $scope.LogMaintainAllUsersList.length === checkedArray.length ? true : false;
        }

        $scope.searchUserInLogs = 'All';
       
        $scope.LogsMaintainToggle = function () {
            var checkedArray = _.where($scope.LogMaintainAllUsersList, { isChecked: true });
            $scope.MainTainLogsObj.AllUsersCheck = checkedArray.length > 0 && $scope.LogMaintainAllUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.searchUserInLogs = "Select Users";
            } else {
                if (checkedArray.length === 1) {
                    //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                    $scope.searchUserInLogs = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.searchUserInLogs = "Selected Users";
                }
            }
        }
        $scope.MainLogActionObj = [
            {
                "ActionLogsId": 1,
                "ActionLogName": "Accessed",
                "isChecked": true
            },
            {
                "ActionLogsId": 2,
                "ActionLogName": "Added",
                "isChecked": true
            },

            {
                "ActionLogsId": 3,
                "ActionLogName": "Exported",
                "isChecked": true
            },
            {
                "ActionLogsId": 4,
                "ActionLogName": "Deleted",
                "isChecked": true
            },
            {
                "ActionLogsId": 5,
                "ActionLogName": "Edited",
                "isChecked": true
            },
            {
                "ActionLogsId": 6,
                "ActionLogName": "Imported",
                "isChecked": true
            },
            {
                "ActionLogsId": 7,
                "ActionLogName": "Login",
                "isChecked": true
            },
            {
                "ActionLogsId": 8,
                "ActionLogName": "Logout",
                "isChecked": true
            },
            {
                "ActionLogsId": 9,
                "ActionLogName": "Overwrite",
                "isChecked": true
            },
            {
                "ActionLogsId": 9,
                "ActionLogName": "Printed",
                "isChecked": true
            },
            {
                "ActionLogsId": 9,
                "ActionLogName": "Authorization",
                "isChecked": true
            },
            {
                "ActionLogsId": 10,
                "ActionLogName": "Signed off",
                "isChecked": true
            },
            {
                "ActionLogsId": 11,
                "ActionLogName": "unsigned",
                "isChecked": true
            },
        ]
        $scope.MainLogActionObj.AllUsersActionCheck = true;

        $scope.MaintainingLogsDataArray = [];
        $scope.searchMainReports = function () {

            var UserCheckLists = [];
            UserCheckLists = $filter("filter")($scope.LogMaintainAllUsersList, function (iterator, ind) { return iterator.isChecked == true; });
            if (UserCheckLists.length == 0) {
                alertify.error("Please Select User");
                return false;
            }
            var UserActionCheckList = [];
            UserActionCheckList = $filter("filter")($scope.MainLogActionObj, function (iterator, ind) { return iterator.isChecked == true; });

            if (UserActionCheckList.length == 0) {
                alertify.error("Please Select Action");
                return false;
            }

            var UserIdlist = "";
            for (var i in $scope.LogMaintainAllUsersList) {
                if ($scope.LogMaintainAllUsersList[i].isChecked) {
                    UserIdlist += "," + $scope.LogMaintainAllUsersList[i].DoctorID;
                }
            }
            if (UserIdlist.charAt(0) === ",") {
                UserIdlist = UserIdlist.slice(1);
            }
            var UserActionIdlist = "";
            for (var i in $scope.MainLogActionObj) {
                if ($scope.MainLogActionObj[i].isChecked) {
                    UserActionIdlist += "," + $scope.MainLogActionObj[i].ActionLogName;
                }
            }
            if (UserActionIdlist.charAt(0) === ",") {
                UserActionIdlist = UserActionIdlist.slice(1);
            }
            var FromDate = $scope.MainTainLogsObj.FromDate || "";
            var ToDate = $scope.MainTainLogsObj.ToDate || "";
            var Action = $scope.MainTainLogsObj.Action.ActionLogName || "";

            var obj = {
                "FromDate": FromDate || "",
                "ToDate": ToDate || "",
                "BranchId": $scope.HospitalId,
                "Action": UserActionIdlist || "",
                "UserIds": UserIdlist || 0,
                "ModuleId": $scope.ModuleTypeId,
                "PageSize": 200,
                "PageNumber": $scope.AssescurrentPage || 1,
            }
            eHnoteMainAdminServices.GetAllUsersMaintainLogsListById(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status === 'Success') {
                    $scope.MaintainingLogsDataArray = resp.data.rows;
                }
                $scope.totalItems = resp.data.Count||0;
            }, function (err) {
                console.log(err);
            });

        }
        $scope.LogUibclose = function () {
            $uibModalInstance.dismiss("cancel");
        }
        //$scope.AuditLogsPopUpForASC = function (Type) {
        //    let obj = {
        //        "Screen": "PreOp",
        //        "Type": Type,
        //        "ModuleTypeId": 4,
        //        "AppointmentId": $scope.cacheStorageItem.AppointmentId,
        //        "PatientId": $scope.cacheStorageItem.PatientID,

        //    };
        //    let mInstanceAdd = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/AuditLogsPopUpForASC.html",
        //        //"size": "lg",
        //        "scope": $scope,

        //        "backdrop": "static",
        //        "keyboard": false,
        //        "resolve": {
        //            "allUserList": function () { return angular.copy($scope.allUserList); },
        //            "obj": function () { return obj; },
        //        },
        //        "windowClass": "inventory-full-popup",
        //        "controller": function ($scope, $uibModal, $uibModalInstance) {


        //            $scope.LogUibclose = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            }

        //        }

        //    });
        //};
        $scope.RefreshMainReports = function () {
            $scope.MainTainLogsObj.FromDate = $filter('date')(new Date(), 'MM-dd-yyyy')
            $scope.MainTainLogsObj.ToDate = $filter('date')(new Date(), 'MM-dd-yyyy')


            angular.forEach($scope.MainLogActionObj, function (item) {
                item.isChecked = true;
            });
            var ActioncheckedArray = _.where($scope.MainLogActionObj, { isChecked: true });
            $scope.MainLogActionObj.AllUsersActionCheck = ActioncheckedArray.length > 0 && $scope.MainLogActionObj.length === ActioncheckedArray.length ? true : false;
            angular.forEach($scope.LogMaintainAllUsersList, function (item) {
                item.isChecked = true;
            });
            var checkedArray = _.where($scope.LogMaintainAllUsersList, { isChecked: true });
            $scope.MainTainLogsObj.AllUsersCheck = checkedArray.length > 0 && $scope.LogMaintainAllUsersList.length === checkedArray.length ? true : false;
            $scope.searchUserInLogs = 'All';
            $scope.searcActionName = 'All';
            $scope.SeachByPatientObj.searchPatientTxt = "";
            $scope.SeachByPatientObj.searchPatientIdTxt = "";
            $scope.SeachByPatientObj.searchPatientOldMR = "";
            $scope.searchMainReports();
        }
        $scope.checkclick = function (text, type) {
            if (type == 1) {
                if (text === "" || text === undefined) {
                    $scope.MaintainingLogsDataArray = angular.copy($scope.MaintainingLogsDataArray);
                } else {
                    $scope.MaintainingLogsDataArray = $filter("filter")($scope.MaintainingLogsDataArray, { "PatientFullName": text }) || [];
                }
            }
            if (type == 2) {
                if (text === "" || text === undefined) {
                    $scope.MaintainingLogsDataArray = angular.copy($scope.MaintainingLogsDataArray);
                } else {
                    $scope.MaintainingLogsDataArray = $filter("filter")($scope.MaintainingLogsDataArray, { "MRNo": text }) || [];
                }
            }
            if (type == 3) {
                if (text === "" || text === undefined) {
                    $scope.MaintainingLogsDataArray = angular.copy($scope.MaintainingLogsDataArray);
                } else {
                    $scope.MaintainingLogsDataArray = $filter("filter")($scope.MaintainingLogsDataArray, { "OldMrno": text }) || [];
                }
            }
        }
        $scope.stopClosingDropDown = function () {
            event.stopPropagation();
        }
        $scope.LogsCheckAllUsersActions = function (val) {
            if (val) {
                angular.forEach($scope.MainLogActionObj, function (item) {
                    item.isChecked = true;
                });

                $scope.searcActionName = 'All';
            } else {
                angular.forEach($scope.MainLogActionObj, function (item) {
                    item.isChecked = false;
                });
                $scope.searcActionName = 'Select Actions';
            }
            var checkedArray = _.where($scope.MainLogActionObj, { isChecked: true });
            $scope.MainLogActionObj.AllUsersActionCheck = checkedArray.length > 0 && $scope.MainLogActionObj.length === checkedArray.length ? true : false;
        }
        $scope.LogsMaintainActionToggle = function () {
            var checkedArray = _.where($scope.MainLogActionObj, { isChecked: true });
            $scope.MainLogActionObj.AllUsersActionCheck = checkedArray.length > 0 && $scope.MainLogActionObj.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.searcActionName = "Select Actions";
            } else {
                if (checkedArray.length === 1) {
                    //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                    $scope.searcActionName = checkedArray[0].ActionLogName;
                } else {
                    $scope.searcActionName = "Selected Actions";
                }
            }
        }
        $scope.newclearPatientApptSearchinCal = function () {
            $scope.SeachByPatientObj.searchPatientTxt = "";
            $scope.SeachByPatientObj.searchPatientIdTxt = "";
            $scope.SeachByPatientObj.searchPatientOldMR = "";
            $scope.searchMainReports();
        }


        $scope.openCheckInPopup = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "logsHistroy.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                //"scope": $scope,
                "windowClass": "modal__ninety--",
                "resolve": {
                    "LogItem": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, LogItem) {

                    $scope.LogItem = LogItem;

                    if ($scope.LogItem && $scope.LogItem.NewActionDescription) {
                        $scope.LogItem.NewActionDescription = $scope.LogItem.NewActionDescription.replaceAll("|", "\n");
                    }
                    if ($scope.LogItem && $scope.LogItem.OldActionDescription) {
                        $scope.LogItem.OldActionDescription = $scope.LogItem.OldActionDescription.replaceAll("|", "\n");
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.navtoQuicksummarypopupprofile = function (item) {
            $scope.cacheStorageItem = $scope.cacheStorageItem || {};
            if (Array.isArray($scope.cacheStorageItem)) {
                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
            }
            $scope.cacheStorageItem.AppointmentId = item.AppointmentId || 0;
            $scope.cacheStorageItem.AscAppointmentId = item.AppointmentId || 0;
            $scope.cacheStorageItem.PatientID = item.PatientId || 0;
            $scope.cacheStorageItem.AppointmentTypeId = item.AppointmentTypeId || 0;
            $scope.cacheStorageItem.ConsultationID = item.ConsultationId || 0;
            $scope.cacheStorageItem.PatientVisitId = item.ConsultationId || 0;
            $scope.cacheStorageItem.FullName = item.PatientFullName || '';
            $scope.cacheStorageItem.PatientDisplayId = item.MRNo || '';
            $scope.cacheStorageItem.PatientImageS3URL = item.S3URL || '';
            $scope.cacheStorageItem.PatientName = item.PatientFullName || '';
            $scope.cacheStorageItem.Gender = item.Sex || '';
            $scope.cacheStorageItem.PatientDOB = item.DOB || '';
            $scope.cacheStorageItem.AppointmentDate = item.AppointmentDate || ''
            $scope.AddToCache();

            let Obj = {
                "SubModuleName": item.SubModuleName || '',
                "SubModuleId": item.SubModuleId || 0,
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/MainQuicksummarypopup.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "offcanves-right  ",
                "resolve": {
                    "selectedApptObj": function () { return Obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, selectedApptObj, eHnoteCacheStorageService) {

                    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                    $scope.selectedApptObj = selectedApptObj || {};
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
                    let SubTab = 7;
                    let NurseAnesthesiaTab = 1;

                    const appointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId;
                    const selectedModuleId = $scope.selectedApptObj.SubModuleId;
                    const selectedModuleName = $scope.selectedApptObj.SubModuleName;

                    if (appointmentTypeId === 4 || appointmentTypeId === 14) {
                        switch (selectedModuleId) {
                            case 9: // Pre-Op
                                SubTab = 3;
                                NurseAnesthesiaTab = (selectedModuleName === 'Pre-Op Nurse') ? 1 : 2;
                                break;
                            case 10: // Intra-Op
                                SubTab = 4;
                                NurseAnesthesiaTab = (selectedModuleName === 'Intra-Op Nurse') ? 1 : 2;
                                break;
                            case 11: // Post-Op
                                SubTab = 5;
                                NurseAnesthesiaTab = (selectedModuleName === 'Post-Op Nurse') ? 1 : 2;
                                break;
                            case 37: // Yag Template
                                SubTab = 14;
                                break;
                            case 3: // Facesheet
                                SubTab = 3;
                                NurseAnesthesiaTab = 3;
                                break;
                            case 5: // Operative Notes
                                SubTab = 7;
                                break;
                            case 4: // Discharge Summary
                                SubTab = 6;
                                break;
                        }
                    }
                    if (appointmentTypeId == 7) {
                        SubTab = 2;
                    }
                    let obj = {
                        "SubTab": SubTab,
                        "NurseAnesthesiaTab": NurseAnesthesiaTab,
                        "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
                        "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                        "AscAppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                        "IscomingFromInd": true,
                        "PatientID": $scope.cacheStorageItem.PatientID || 0,

                    }
                    console.log("ASCAllvisits called7");
                    $scope.$broadcast("ASCAllvisits", obj);

                    datapersistanceFactory.set('ASCPastvisits', obj);

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                }

            });
        };

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };
    }]);
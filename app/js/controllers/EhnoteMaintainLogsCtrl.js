"use strict";

eHnoteWebApp.controller("EhnoteMaintainLogsCtrl", ["$scope", "$rootScope", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "$location", "eHnoteMainDashboardDataServices", "$timeout", "alertify", "eHnoteUserAppointmentDataService", "localStorageFactory", "datapersistanceFactory", "eHnoteAccountUserServices", "$interval", "OpticalService", "InventoryService", "ReportUtilites", "eHnoteSurgeryService", "$sce", "$window", "eHnoteMainAppointmentService", "eHnotePatientDataService", "USPrintService", "$uibModal", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnoteCacheStorageService", "eHnoteAuditServices", function ($scope, $rootScope, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, $location, eHnoteMainDashboardDataServices, $timeout, alertify, eHnoteUserAppointmentDataService, localStorageFactory, datapersistanceFactory, eHnoteAccountUserServices, $interval, OpticalService, InventoryService, ReportUtilites, eHnoteSurgeryService, $sce, $window, eHnoteMainAppointmentService, eHnotePatientDataService, USPrintService, $uibModal, eHnoteMainAdminServices, eHnoteUserDataService, eHnoteCacheStorageService, eHnoteAuditServices) {


    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
    $scope.UserBranchId = doctorInfo.doctordata.UserAddress[0].UserBranchId;
    $scope.allUserList = [];
    $scope.searchUserInLogstab = { "txt1": "", "txt2": "" };
    $scope.searcActionNameTab = { "txt1": "", "txt2": "" };
    $scope.drpWebOpen = false;
    $scope.showFilter = false;
    $scope.filterSearch = {};
    
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

    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    };
   
    GetBranchSubSpecializations($scope.SubOrganizationId, $scope.UserBranchId);
    $scope.MainTainLogsObj = {
        "FromDate": $filter('date')(new Date(),'MM-dd-yyyy'),
        "ToDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
        "UserName": "",
        "Action": "",
        "AllDoctorCheck": "",
        "UserIds": "",
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
    $scope.switchTab = function () {
        $scope.searchMainReports();
    }
   
    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

    var reqObj = {
        "BranchId": $scope.HospitalId||"",
        "SubSpecializationIdArray": subSplArray||"",
    }
 
    $scope.LogMaintainAllUsersList = [];
    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
    function onGetUsersSuccess(resp) {
        if (resp.rows.length > 0) {
            $scope.allUserList = resp.rows;
            $scope.LogMaintainAllUsersList = resp.rows;
            angular.forEach($scope.LogMaintainAllUsersList, function (item) {
                item.isChecked = true;
                $scope.MainTainLogsObj.AllUsersCheck = true;
            });
        }
    }
    function onGetUsersFailure(data) {
    }

    $scope.searchUserInLogs = 'All';
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
    $scope.stopClosingDropDown = function () {
        event.stopPropagation();
    }
    $scope.ChangeSelectedAction = function (item) {
        console.log(item);
    }
    $scope.AssescurrentPage = 1;
    $scope.AssespageChanged = function (AssescurrentPage) {
        $scope.AssescurrentPage = AssescurrentPage;
        $scope.searchMainReports();
    }
    $scope.maxSize = 100000;
    $scope.MaintainingLogsDataArray = [];
    $scope.searchMainReports = function () {

        var UserCheckLists = [];
        UserCheckLists = $filter("filter")($scope.LogMaintainAllUsersList || [], function (iterator, ind) { return iterator.isChecked == true; });
            if (UserCheckLists.length == 0) {
                alertify.error("Please Select User");
                return false;
            }
        var UserActionCheckList = [];
        UserActionCheckList= $filter("filter")($scope.MainLogActionObj, function (iterator, ind) { return iterator.isChecked == true; });
    
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
        var FromDate = formatLogsDate($scope.MainTainLogsObj.FromDate);
        var ToDate = formatLogsDate($scope.MainTainLogsObj.ToDate);
        if (FromDate == "" || ToDate == "") {
            alertify.error("Please Select From Date and To Date");
            return false;
        }
        var Action = $scope.MainTainLogsObj.Action.ActionLogName || "";
       
        var obj = {
            "FromDate": FromDate||"",
            "ToDate": ToDate||"",
            "BranchId": $scope.HospitalId,
            "Action": UserActionIdlist || "",
            "UserIds": UserIdlist || 0,
            "PageSize": 100000,
            "PageNumber": $scope.AssescurrentPage || 1,
        }
        eHnoteMainAdminServices.GetAllUsersMaintainLogsListById(obj).then(function (resp)  {
            console.log(resp);
            if (resp.data.Status === 'Success') {
                $scope.MaintainingLogsDataArray = resp.data.rows;
                $scope.SeachByPatientObj.searchPatientTxt = "";
                $scope.SeachByPatientObj.searchPatientIdTxt = "";
                $scope.SeachByPatientObj.searchPatientOldMR = "";
                $scope.totalItems = resp.data.Count || 0;
                $scope.LogsPager.currentPage = 1;
            }
        }, function (err) {
            console.log(err);
        });
       
    }

    $scope.Tab = 'ModifyLogs';
    $scope.switchTab = function (tab) {
        $scope.Tab = tab;
    };
    $scope.searcActionName = 'All';
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
                $scope.searcActionName = checkedArray[0].ActionLogName ;
            } else {
                $scope.searcActionName = "Selected Actions";
            }
        }
    }
    $scope.SeachByPatientObj = {
        "searchPatientTxt": "",
        "searchPatientIdTxt": "",
        "searchPatientOldMR": "",
    }
    $scope.checkclick = function (text,type) {
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
        $scope.LogsPager.currentPage = 1;
    }
    $scope.newclearPatientApptSearchinCal = function () {
        $scope.SeachByPatientObj.searchPatientTxt = "";
        $scope.SeachByPatientObj.searchPatientIdTxt = "";
        $scope.SeachByPatientObj.searchPatientOldMR = "";
        $scope.searchMainReports();
    }
    $scope.PatLogSearchType = 1;

    // New logs design: single search input bound to the SeachByPatientObj field of the selected search type
    $scope.LogsSearchKeys = { 1: "searchPatientTxt", 2: "searchPatientIdTxt", 3: "searchPatientOldMR" };
    $scope.LogsSearchPlaceholders = { 1: "Search by Name", 2: "Search by MR No", 3: "Search by Old MR No" };

    // New logs design: client-side pagination over the already loaded rows (API is called with PageSize 100000)
    $scope.LogsPager = { "currentPage": 1, "pageSize": 50 };
    $scope.LogsPageChange = function (step, total) {
        var lastPage = Math.max(1, Math.ceil((total || 0) / $scope.LogsPager.pageSize));
        $scope.LogsPager.currentPage = Math.min(lastPage, Math.max(1, $scope.LogsPager.currentPage + step));
    }

    // fromToDatePicker (web) writes Date objects; the API and the tab datepicker use MM-dd-yyyy strings
    function formatLogsDate(value) {
        return angular.isDate(value) ? $filter('date')(value, 'MM-dd-yyyy') : (value || "");
    }
    $scope.$watchGroup(['MainTainLogsObj.FromDate', 'MainTainLogsObj.ToDate'], function () {
        if (angular.isDate($scope.MainTainLogsObj.FromDate)) {
            $scope.MainTainLogsObj.FromDate = formatLogsDate($scope.MainTainLogsObj.FromDate);
        }
        if (angular.isDate($scope.MainTainLogsObj.ToDate)) {
            $scope.MainTainLogsObj.ToDate = formatLogsDate($scope.MainTainLogsObj.ToDate);
        }
    });

    var LogsActionBadgeClasses = {
        "accessed": "bg__E8F0FE-- tc__2563A8--",
        "authorization": "bg__E8F0FE-- tc__2563A8--",
        "added": "bg__E6F7EE-- tc__1A9D5C--",
        "login": "bg__E6F7EE-- tc__1A9D5C--",
        "signed off": "bg__E6F7EE-- tc__1A9D5C--",
        "edited": "bg__FFF4E0-- tc__B8790A--",
        "overwrite": "bg__FFF4E0-- tc__B8790A--",
        "unsigned": "bg__FFF4E0-- tc__B8790A--",
        "deleted": "bg__FDE8E8-- tc__C0392B--",
        "exported": "bg__F0E8FD-- tc__7038C9--",
        "imported": "bg__F0E8FD-- tc__7038C9--",
        "printed": "bg__F0E8FD-- tc__7038C9--",
        "logout": "bg__F1F2F4-- tc__5B6470--"
    };
    $scope.LogsActionBadgeClass = function (actionType) {
        return LogsActionBadgeClasses[(actionType || "").toString().trim().toLowerCase()] || "bg__F1F2F4-- tc__5B6470--";
    }

    $scope.SearchLogsData = function (Data) {
        if (Data == '') {
            $scope.searchMainReports();
        }
    }
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
    // Logs history (Change Details / Log Details) popup — rendered inline by the new design in ModificationLogsReport.html
    $scope.LogsHistoryPopup = { "isOpen": false, "isEdited": false, "LogItem": null };
    $scope.openCheckInPopup = function (item) {
        var LogItem = angular.copy(item);

        if (LogItem && LogItem.NewActionDescription) {
            LogItem.NewActionDescription = LogItem.NewActionDescription.replaceAll("|", "\n");
        }
        if (LogItem && LogItem.OldActionDescription) {
            LogItem.OldActionDescription = LogItem.OldActionDescription.replaceAll("|", "\n");
        }

        $scope.LogsHistoryPopup.LogItem = LogItem;
        // Old and new values side by side only when both exist; otherwise a single text body
        $scope.LogsHistoryPopup.isEdited = !!(LogItem && LogItem.OldActionDescription && LogItem.NewActionDescription);
        $scope.LogsHistoryPopup.isOpen = true;
    };
    $scope.closeLogsHistoryPopup = function () {
        $scope.LogsHistoryPopup.isOpen = false;
        $scope.LogsHistoryPopup.LogItem = null;
    };

    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
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
                "selectedApptObj": function () { return Obj; },
                "ParentObj": function () { return $scope.ParentObj; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, selectedApptObj, ParentObj, eHnoteCacheStorageService) {

                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                $scope.selectedApptObj = selectedApptObj || {};
                $scope.ParentObj = ParentObj
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
                    "NurseAnesthesiaTab":NurseAnesthesiaTab,
                    "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
                    "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                    "AscAppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                    "IsIOJParentOrganization": $scope.ParentObj.IsIOJParentOrganization || false,
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
}]);
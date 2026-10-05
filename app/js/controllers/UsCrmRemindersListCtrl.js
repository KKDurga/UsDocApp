"use strict";
eHnoteWebApp.controller("UsCrmRemindersListCtrl", ["$scope", "$log", "$rootScope", "$location", "$uibModal", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteValidateUsersDataService", "eHnoteLoginStatusService", "datacookieFactory", "$window", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "alertify", "uiCalendarConfig", "eHnotePatientPVService", "eHnotePatientVisitReasonServices", "eHnoteDiagnosisDataServices", "DeCodeFilter", "$q", "$interval", "localStorageFactory", "eHnoteProcedureDataService", "SyncService", "eHnoteSettingsDataService", "eHnoteAuditServices", "eHnotePrintService", "eHnoteUserDataService", "eHnotePatientAddressDataServices", "eHnoteMainAdminServices", "USPrintService", function ($scope, $log, $rootScope, $location, $uibModal, $filter, $timeout, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, $window, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserAppointmentDataService, alertify, uiCalendarConfig, eHnotePatientPVService, eHnotePatientVisitReasonServices, eHnoteDiagnosisDataServices, DeCodeFilter, $q, $interval, localStorageFactory, eHnoteProcedureDataService, SyncService, eHnoteSettingsDataService, eHnoteAuditServices, eHnotePrintService, eHnoteUserDataService, eHnotePatientAddressDataServices, eHnoteMainAdminServices, USPrintService,) {
    $scope.ReferralList = [];
    var doctorInfo = eHnoteMasterDataService.getUserInfo();

    console.log(doctorInfo);
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    $scope.DoctorId = doctorInfo.doctordata.User[0].DoctorID;
    $scope.GetAllIndicator = 0;
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
     

    $scope.daySetupPopUp = "";

    $scope.calobj = {
        "IsShow": false,
        "StartTime": "",
        "EndTime": "",
        "NewStartTime": "",
        "NewEndTime": "",
        "DoctorId": 0,
        "DoctorName": "",
        "infoobj": "",
        "date": "",
        "HospitalId": 0
    };

    $scope.evencalobj = {
        "IsShow": false,
        "StartTime": "",
        "EndTime": "",
        "DoctorId": 0,
        "DoctorName": "",
        "PatientName": "",
        "infoobj": "",
        "date": "",
        "HospitalId": 0,
        "VisitTypeId": 0
    };

    $scope.BreakEventObj = {
        "IsShow": false,
        "StartTime": "",
        "EndTime": "",
        "DoctorId": 0,
        "DoctorName": "",
        "infoobj": "",
        "date": "",
        "HospitalId": 0
    };

    $scope.ReminderTypes = [
        {
            "Type": 0,
            "Name": "All"
        },
        {
            "Type": 1,
            "Name": "General Reminders"
        },
        {
            "Type": 2,
            "Name": "Appointment Reminders"
        },
        {
            "Type": 3,
            "Name": "SMS Reminder"
        },
        //{
        //    "Type": 4,
        //    "Name": "Cancel Remainders"
        //},
        {
            "Type": 5,
            "Name": "Glass Reminder"
        },
    ];

    $scope.ReminderStatusTypes = [
        {
            "Type": null,
            "Name": "All"
        },
        {
            "Type": 1,
            "Name": "To be Worked"
        },
        {
            "Type": 2,
            "Name": "Not Interested"
        },
        {
            "Type": 3,
            "Name": "Booked"
        },
        {
            "Type": 4,
            "Name": "Deleted"
        },
        {
            "Type": 5,
            "Name": "FollowUp"
        },
        {
            "Type": 6,
            "Name": "Rescheduled"
        },
    ];
    var mObj = datapersistanceFactory.getItem("masterDataArrays");

    $scope.confirmationStatusArray = [];
    mObj.masterConfirmationStatusList = mObj.masterConfirmationStatusList || [];
    if (mObj.masterConfirmationStatusList.length > 0) {
        $scope.confirmationStatusArray = mObj.masterConfirmationStatusList || [];
        if ($scope.confirmationStatusArray.length > 0) {
            angular.forEach($scope.confirmationStatusArray, function (item) {
                if (item.ConfirmationStatusId == 3) {
                    item.IsChecked = false;
                }
            });
        }
    } else {
        $scope.confirmationStatusArray = [
            {
                "ConfirmationStatusId": 1,
                "ConfirmationStatusName": "Confirmed",
                "IsChecked": true
            },
            {
                "ConfirmationStatusId": 2,
                "ConfirmationStatusName": "Not Confirmed",
                "IsChecked": true
            },
            {
                "ConfirmationStatusId": 3,
                "ConfirmationStatusName": "Waiting",
                "IsChecked": false
            },
            {
                "ConfirmationStatusId": 4,
                "ConfirmationStatusName": "Cancelled",
                "IsChecked": true
            }
        ]

    };

    $scope.confirmationStatusArray1 = angular.copy($scope.confirmationStatusArray);

    $scope.AllStatusList = [
        {
            "Id": 1,
            "Name": "Confirmed",
            "IsChecked": true
        },
        {
            "Id": 2,
            "Name": "Not Confirmed",
            "IsChecked": true
        },
        {
            "Id": 3,
            "Name": "Cancelled",
            "IsChecked": true
        },
        {
            "Id": 4,
            "Name": "Waiting List",
            "IsChecked": false
        }
    ];

    $scope.ProfileStatusList = [
        {
            "Id": 1,
            "Name": "Complete",
            "IsChecked": true
        },
        {
            "Id": 2,
            "Name": "InComplete",
            "IsChecked": true
        },
        {
            "Id": 3,
            "Name": "Not Worked",
            "IsChecked": true
        }
    ];

    $scope.LocationTypeObj = {
        "SelectLocationString": "All Locations",
        "Name": "",
        "AllLocationCheck": false
    };

    $scope.ApptFilterObj = {
        "IsNoShowAppointment": false,
        "IsNoShowAppointment1": false
    };

    $scope.ProfileStatusList1 = angular.copy($scope.ProfileStatusList);

    $scope.StatusListObj = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": false
    };

    $scope.ProfileStatusListObj = {
        "SelectStatusString": "All",
        "Name": "",
        "AllStatusCheck": true
    };

    $scope.StatusListObj1 = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": true
    };

    $scope.ProfileStatusListObj1 = {
        "SelectStatusString": "Select Profile Status",
        "Name": "",
        "AllStatusCheck": true
    };

    $scope.StatusToggle = function (obj) {
        var checkedArray = _.where($scope.confirmationStatusArray, { IsChecked: true });
        $scope.StatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.confirmationStatusArray.length === checkedArray.length ? true : false;
        if ($scope.StatusListObj.AllStatusCheck) {
            $scope.StatusListObj.SelectStatusString = 'All';
        }

        if (!$scope.StatusListObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.StatusListObj.SelectStatusString = 'Selected';
        }
    };
    $scope.checkAllStatus = function (val) {
        if (val) {
            angular.forEach($scope.confirmationStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.StatusListObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.confirmationStatusArray, function (item) {
                item.IsChecked = false;
            });

            $scope.StatusListObj.SelectStatusString = 'Select Status';
        }

    };

    $scope.StatusToggle1 = function (obj) {
        var checkedArray = _.where($scope.confirmationStatusArray1, { IsChecked: true });
        $scope.StatusListObj1.AllStatusCheck = checkedArray.length > 0 && $scope.confirmationStatusArray1.length === checkedArray.length ? true : false;
        if ($scope.StatusListObj1.AllStatusCheck) {
            $scope.StatusListObj1.SelectStatusString = 'All';
        }

        if (!$scope.StatusListObj1.AllStatusCheck && checkedArray.length > 0) {
            $scope.StatusListObj1.SelectStatusString = 'Selected';
        }
    };
    $scope.checkAllStatus1 = function (val) {
        if (val) {
            angular.forEach($scope.confirmationStatusArray1, function (item) {
                item.IsChecked = true;
            });

            $scope.StatusListObj1.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.confirmationStatusArray1, function (item) {
                item.IsChecked = false;
            });

            $scope.StatusListObj1.SelectStatusString = 'Select Status';
        }

    };

    $scope.ProfileStatusToggle = function (obj) {
        var checkedArray = _.where($scope.ProfileStatusList, { IsChecked: true });
        $scope.ProfileStatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.ProfileStatusList.length === checkedArray.length ? true : false;
        if ($scope.ProfileStatusListObj.AllStatusCheck) {
            $scope.ProfileStatusListObj.SelectStatusString = 'All';
        }

        if (!$scope.ProfileStatusListObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.ProfileStatusListObj.SelectStatusString = 'Selected';
        }
    };
    $scope.checkAllProfileStatus = function (val) {
        if (val) {
            angular.forEach($scope.ProfileStatusList, function (item) {
                item.IsChecked = true;
            });

            $scope.ProfileStatusListObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.ProfileStatusList, function (item) {
                item.IsChecked = false;
            });

            $scope.ProfileStatusListObj.SelectStatusString = 'Select Profile Status';
        }

    };

    $scope.ProfileStatusToggle1 = function (obj) {
        var checkedArray = _.where($scope.ProfileStatusList1, { IsChecked: true });
        $scope.ProfileStatusListObj1.AllStatusCheck = checkedArray.length > 0 && $scope.ProfileStatusList1.length === checkedArray.length ? true : false;
        if ($scope.ProfileStatusListObj1.AllStatusCheck) {
            $scope.ProfileStatusListObj1.SelectStatusString = 'All';
        }

        if (!$scope.ProfileStatusListObj1.AllStatusCheck && checkedArray.length > 0) {
            $scope.ProfileStatusListObj1.SelectStatusString = 'Selected';
        }
    };
    $scope.checkAllProfileStatus1 = function (val) {
        if (val) {
            angular.forEach($scope.ProfileStatusList1, function (item) {
                item.IsChecked = true;
            });

            $scope.ProfileStatusListObj1.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.ProfileStatusList1, function (item) {
                item.IsChecked = false;
            });

            $scope.ProfileStatusListObj1.SelectStatusString = 'Select Profile Status';
        }

    };

    $scope.StatusToggle = function (obj) {
        var checkedArray = _.where($scope.confirmationStatusArray, { IsChecked: true });
        $scope.StatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.confirmationStatusArray.length === checkedArray.length ? true : false;
        if ($scope.StatusListObj.AllStatusCheck) {
            $scope.StatusListObj.SelectStatusString = 'All';
        }

        if (!$scope.StatusListObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.StatusListObj.SelectStatusString = 'Selected';
        }
    };
    $scope.checkAllStatus = function (val) {
        if (val) {
            angular.forEach($scope.confirmationStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.StatusListObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.confirmationStatusArray, function (item) {
                item.IsChecked = false;
            });

            $scope.StatusListObj.SelectStatusString = 'Select Status';
        }

    };

    $scope.ProfileStatusToggle = function (obj) {
        var checkedArray = _.where($scope.ProfileStatusList, { IsChecked: true });
        $scope.ProfileStatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.ProfileStatusList.length === checkedArray.length ? true : false;
        if ($scope.ProfileStatusListObj.AllStatusCheck) {
            $scope.ProfileStatusListObj.SelectStatusString = 'All';
        }

        if (!$scope.ProfileStatusListObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.ProfileStatusListObj.SelectStatusString = 'Selected';
        }
    };
    $scope.checkAllProfileStatus = function (val) {
        if (val) {
            angular.forEach($scope.ProfileStatusList, function (item) {
                item.IsChecked = true;
            });

            $scope.ProfileStatusListObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.ProfileStatusList, function (item) {
                item.IsChecked = false;
            });

            $scope.ProfileStatusListObj.SelectStatusString = 'Select Profile Status';
        }

    };

    $scope.SelectedStatus = {
        "StatusId": 0
    };

    //$scope.ProfileStatusList = [
    //    {
    //        "Id": 0,
    //        "Name": "All"
    //    },
    //    {
    //        "Id": 1,
    //        "Name": "Complete"
    //    },
    //    {
    //        "Id": 2,
    //        "Name": "InComplete"
    //    },
    //    {
    //        "Id": 3,
    //        "Name": "Not Worked"
    //    }
    //];

    $scope.SelectedProfileStatus = {
        "StatusId": 0
    };

    $scope.DoctorSlot = {
        "StartTime": "",
        "EndTime": ""
    }

    $scope.PopoverBtnObj = {
        "appointmentStatus": "",
        "pastdateappointment": false
    }
    $scope.CalenderObj = {
        "IsConfirmedAppointment": false
    };

    $scope.connectedUserObj = {
        "Available": false,
        "Users": []
    };

    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.connectedUserObj.Available = doctorInfo.doctordata.User[0].IsConnectedUsersAvailable || false;

        if ($scope.connectedUserObj.Available) {
            $scope.connectedUserObj.Users = doctorInfo.doctordata.UserAddress[0].ConnectedUsers || [];
        }
        console.log($scope.connectedUserObj.Users);


        $scope.DoctorSlot.StartTime = doctorInfo.doctordata.UserAddress[0].SlotStartTime;
        $scope.DoctorSlot.EndTime = doctorInfo.doctordata.UserAddress[0].SlotEndTime;

        if ($scope.DoctorSlot.StartTime == "00:00") {
            $scope.DoctorSlot.StartTime = "23:59";
            $scope.DoctorSlot.EndTime = "24:00"
        }
    }
    console.log($scope.DoctorSlot.StartTime);
    console.log($scope.DoctorSlot.EndTime);



    var sfdata = {
        "PatientData": "",
        "AppointmentData": "",
        "IsFromApptScreen": false
    }
    eHnoteMasterDataService.addPatientApptDataApptList(sfdata);
    if ($scope.userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path("/login");
        return;
    }
    $scope.SortType = 1; //0;
    var Index = -1;
    $scope.SortBy = "Asc";  //desc";
    $scope.RefreshTimeCounter = 300000;
    $scope.IsFutureAppointmentDate = false;

    $scope.TimeDesc = "desc";
    $scope.StatusDesc = "desc";
    $scope.CheckInDesc = "desc";
    $scope.ShowNewConsultation = false;
    if ($scope.SpecializationId === 3) {
        $scope.ShowNewConsultation = true;
    }
    $scope.masterQuestions = [];
    var object = {};
    $scope.masterQuestionInd = '0';
    $scope.ShowBarCodeprint = false;
    $scope.ShowLabelprint = false;
    $scope.Pagination = { "currentPagePatient": 1, "Patientitemsperpage": 400, "Patientmaxsize": 10 };

    $scope.IsTeleMedicineSlot = false;

    $scope.ShowStartConsultationForDynamicStatus = false;
    datapersistanceFactory.set("OpAppointmentDetailsById", "");
    datapersistanceFactory.set("CoordinatorToProfile", '');
    datapersistanceFactory.set('AppointmentDetailsCache', "");
    datapersistanceFactory.set('CCDASeletedPatient', "");

    if ($scope.Tab === 'teleappointments') {
        $scope.IsTeleMedicineSlot = true;
    }
    else {
        $scope.IsTeleMedicineSlot = false;
    }
    $scope.Status = "0";

    var todate = moment($scope.currentdate).add(30, 'days').format('MM-DD-YYYY');

    $scope.SearchObj = {
        "DoctorID": 0,
        "UserId": 3,
        "HospitalID": "",
        "UserBranchId": "",
        "AppointmentStatusIDLst": [],
        "AppointmentTypeStatusIDList": [],
        "ConsultationDt": moment().format("MM-DD-YYYY"),
        "FromDate": moment().format("MM-DD-YYYY"),
        "ToDate": todate,
        "GetAllAppointmentStatusInd": true,
        "GetAllAppointmentTypeStatusInd": true,
        "GetAllVisitStatusInd": true,
        "IsTeleMedicineSlot": false,
        "OldPatientMRNO": "",
        "PageNumber": 1,
        "PageSize": 20,
        "RoleId": "",
        "SearchPatientId": "",
        "SearchText": "",
        "ShowDueAmount": 'Y',
        "SortBy": 'desc',
        "SortType": 0,
        "SubSpecializationIds": [],
        "UserBranchId": 37,
        "UserId": 3,
        "VisitStatusIDLst": [],
        "searchPatientTxt": "",
        "searchPatientIdTxt": "",
        "searchPatientOldMR": "",
        "PatientId": "",
        "UserIds": "",
        "Screen": "/crm",
        "AllDoctorCheck": true,
        "AllUsersCheck": true,
        "ReminderTypeID": 0,
        "ReminderStatusId": null,
        "PriorityStatus":0,
    };

    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();
    $scope.selectedApptUsers = eHnoteMasterDataService.getSelectedCrmApptUsers();

    console.log($scope.selectedApptDates);

    if ($scope.selectedApptDates.FromDate === "" && $scope.selectedApptDates.ToDate === "") {
        $scope.SearchObj.FromDate = $scope.selectedApptDates.FromDate;
        $scope.SearchObj.ToDate = $scope.selectedApptDates.ToDate;
    };

    $scope.mainAppointmentView = {
        "isCalendarorList": "", // "calendar",
        "isprofileback": ""
    };
    if ($scope.selectedApptDates != undefined && $scope.selectedApptDates != '') {
        $scope.selectedApptDates.BacktoProfile = $scope.selectedApptDates.BacktoProfile || "";
        if ($scope.selectedApptDates.BacktoProfile != '') {
            $scope.mainAppointmentView.isprofileback = $scope.selectedApptDates.BacktoProfile;
        }
    }

    var obj = {
        "FromDate": $scope.SearchObj.FromDate,
        "ToDate": $scope.SearchObj.ToDate,
        "AppointmentDate": $scope.SearchObj.ConsultationDt,
        "Screen": $scope.SearchObj.Screen
    };
    eHnoteMasterDataService.addSelectedCrmApptDates(obj);






    $scope.queueSettingObj = {
        "IsEnabled": false,
        "AvgCheckInTime": 0,
        "RoomId": ""
    }

    $scope.SearchPatientfilter = {
        "IsPatientNameInd": false,
        "PaientMRNO": "",
        "PaientOldMRNO": ""
    };


    if (doctorInfo.doctordata.UserAddress.length > 0) {
        $scope.isQUeueManagementEnabled = doctorInfo.doctordata.UserAddress[0].IsEnableQueueManagement;
        $scope.queueSettingObj.IsEnabled = doctorInfo.doctordata.UserAddress[0].IsEnableQueueManagement;
        $scope.queueSettingObj.RoomId = doctorInfo.doctordata.UserAddress[0].ActiveRoomId || 0;

        $scope.queueSettingObj.CheckInAvgTime = doctorInfo.doctordata.UserAddress[0].CheckInAvgTime;
    }
    $scope.AppointmentStatusList = [
        { "Id": 1, "Description": "Completed", "Status": "E" },
        { "Id": 2, "Description": "OnGoing", "Status": "O" },
        { "Id": 1, "Description": "Cancelled", "Status": "C" },
        { "Id": 1, "Description": "Booked", "Status": "B" }
    ];



    $scope.AllDoctorsObj = {
        "AllDoctorCheck": true,
        "AllVisitReasonsCheck": true,
        "AllAppointmentTypeStatusCheck": true
    }

    $scope.AllAppointmentStatusCheck = true;
    $scope.AllSubSpecializationsCheck = true;
    //$scope.AllAppointmentTypeStatusCheck = true;
    $scope.AppointmentStatusFilterArray = [
        {
            "Id": 'B',
            "Name": "Booked",
            "isChecked": true
        },
        {
            "Id": 'E',
            "Name": "Completed",
            "isChecked": true
        },
        {
            "Id": 'D',
            "Name": "Saved",
            "isChecked": true
        },
        {
            "Id": 'O',
            "Name": "OnGoing",
            "isChecked": true
        }, {
            "Id": 'C',
            "Name": "Canceled",
            "isChecked": true
        }, {
            "Id": 'R',
            "Name": "Rescheduled",
            "isChecked": true
        }
    ];

    $scope.BranchDepartmentsArray = [
        {
            "SubSpecializationId": 1,
            "SubSpecializationName": "Retina",
            "isChecked": false
        },
        {
            "SubSpecializationId": 2,
            "SubSpecializationName": "Glucoma",
            "isChecked": false
        },
        {
            "SubSpecializationId": 3,
            "SubSpecializationName": "Catract",
            "isChecked": false
        },
        {
            "SubSpecializationId": 4,
            "SubSpecializationName": "Lasik",
            "isChecked": false
        }
    ];
    $scope.allUserList = [];

    $scope.MultiselectUserlist = []
    $scope.AllAppointmentVisitStatusCheck = true;
    $scope.AppointmentVisitFilterArray = [
        {
            "Id": 1,
            "Name": "WalkIn",
            "isChecked": true
        },
        {
            "Id": 2,
            "Name": "Online",
            "isChecked": true
        },
        {
            "Id": 3,
            "Name": "Telephonic",
            "isChecked": true
        }
    ];

    $scope.AllCheckInStatusCheck = true;
    $scope.CheckInFilterArray = [
        {
            "Id": 1,
            "Name": "Not CheckIN",
            "isChecked": true
        },
        {
            "Id": 2,
            "Name": "Check IN",
            "isChecked": true
        },
        {
            "Id": 3,
            "Name": "Check Out",
            "isChecked": true
        }
    ];

    $scope.CheckinAppointmentFilterArray = [
        {
            "Id": 1,
            "Name": "AppTime",
            "Value": ""
        },
        {
            "Id": 2,
            "Name": "CheckInTime",
            "Value": ""
        }
    ];

    $scope.SubTab = 11;
    $scope.FrequenTab = 1;
    $scope.tabClick = function (val) {
        $scope.FrequenTab = val;
    }

    $scope.ClickMe = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
    $scope.selectedDepartmentName = 'All Departments';
    $scope.selectAppointmentType = "All";
    $scope.selectVisitType = "All";
    $scope.selectStatusType = "All";

    eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
    function onTypesSuccess(data) {
        $scope.appointmentTypes = [];
        $scope.appointmentTypes = data;
        //if ($scope.userLoginDetails.RoleID == 1) {
        //    angular.forEach(data, function (aitem) {
        //        if (aitem.Id == 1 || aitem.Id == 2 || aitem.Id == 3 || aitem.Id == 4) {
        //            $scope.appointmentTypes.push(aitem);
        //        }
        //    });
        //} else {
        //    $scope.appointmentTypes = data;
        //}

        if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
            angular.forEach($scope.appointmentTypes, function (mitem) {
                mitem.isChecked = false;
                if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
                    if (mitem.Id == 1 || mitem.Id == 2 || mitem.Id == 3 || mitem.Id == 4) {
                        mitem.isChecked = true;
                    }
                }
                //if ($scope.userLoginDetails.RoleID == 10) {
                //    if (mitem.Id == 5) {
                //        mitem.isChecked = true;
                //    }
                //}
                if ($scope.userLoginDetails.RoleID == 18) {
                    // if (mitem.Id == 6) {
                    mitem.isChecked = true;
                    // }
                }
            });
            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = true;
            $scope.selectVisitType = 'All Visit Types';
            if ($scope.userLoginDetails.RoleID == 1) {
                $scope.selectVisitType = "All";
            }
        } else if ($scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63) {
            angular.forEach($scope.appointmentTypes, function (mitem) {
                mitem.isChecked = false;
                if (mitem.Id !== 4 && mitem.Id !== 6) {
                    mitem.isChecked = true;
                }
            });
            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;

        } else if ($scope.userLoginDetails.RoleID === 68) {
            angular.forEach($scope.appointmentTypes, function (mitem) {
                mitem.isChecked = false;
                if (mitem.Id !== 5 && mitem.Id !== 6) {
                    mitem.isChecked = true;
                }
            });
            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;
        } else if ($scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67) {
            angular.forEach($scope.appointmentTypes, function (mitem) {
                mitem.isChecked = false;
                if (mitem.Id === 4 || mitem.Id === 6) {
                    mitem.isChecked = true;
                }
            });
            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;

        }

        else {
            angular.forEach($scope.appointmentTypes, function (mitem) {
                mitem.isChecked = true;
            });
            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = true;
            $scope.selectVisitType = "All";
        }
    }
    function onTypesFailed(err) {
        console.log(err);
    }

    $scope.IsNewConsultationScreen = false;
    $scope.VideoConsultation = false;

    $scope.ShowPreConsultationTab = false;
    $rootScope.ShowPreConsultationTab = false;

    $scope.toggle = function (item) {
        var checkedArray = _.where($scope.AppointmentStatusFilterArray, { isChecked: true });
        $scope.AllAppointmentStatusCheck = checkedArray.length > 0 && $scope.AppointmentStatusFilterArray.length === checkedArray.length ? true : false;
        $scope.loadAppointments($scope.selectedDoctor, '');

    };


    $scope.checkAllAppointmentStatus = function (val) {
        if (val) {
            angular.forEach($scope.AppointmentStatusFilterArray, function (item) {
                item.isChecked = true;
            });

            $scope.AllAppointmentStatusCheck = true;
        } else {
            angular.forEach($scope.AppointmentStatusFilterArray, function (item) {
                item.isChecked = false;
            });

            $scope.AllAppointmentStatusCheck = false;
        }

        $scope.loadAppointments($scope.selectedDoctor, '');
    };
    $scope.checkAllAppointmenTypeStatus = function (val) {
        if (val) {
            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = true;
            });

            $scope.selectVisitType = 'All';
        }
        else {
            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = false;
            });

            $scope.selectVisitType = 'All Visit Types';
        }
        var checkedArray = _.where($scope.appointmentTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;

        if ($scope.mainAppointmentView.isCalendarorList == "list") {
            if (!$scope.IsDynamicCheckInMandatory) {
                $scope.loadAppointments($scope.selectedDoctor, '');
            }
        } else {
            if ($scope.mainCalendarView.MainTab == 2) {
                $scope.$broadcast('allCalendarView');
            }
        }
    };


    $scope.toggleSubSpecialization = function (item) {

        var checkedArray = _.where($scope.allSubSpecializationsArray, { isChecked: true });
        $scope.AllSubSpecializationsCheck = checkedArray.length > 0 && $scope.allSubSpecializationsArray.length === checkedArray.length ? true : false;
        $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
    };

    $scope.checkAllSubSpecializations = function (val) {
        if (val) {
            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDepartmentName = 'All Departments';

        } else {
            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = false;
            });
            $scope.selectedDepartmentName = 'Select Department';
        }

    };

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.VisitToggle = function (item) {
        var checkedArray = _.where($scope.AppointmentVisitFilterArray, { isChecked: true });
        $scope.AllAppointmentVisitStatusCheck = checkedArray.length > 0 && $scope.AppointmentVisitFilterArray.length === checkedArray.length ? true : false;
        $scope.loadAppointments($scope.selectedDoctor, '');

    };
    $scope.AppointmentTypeToggle = function (item) {
        var checkedArray = _.where($scope.appointmentTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;

        //if ($scope.mainAppointmentView.isCalendarorList == "list") {
        //    if (!$scope.IsDynamicCheckInMandatory) {
        //        $scope.loadAppointments($scope.selectedDoctor, '');
        //    }
        //} else {
        //    if ($scope.mainCalendarView.MainTab == 2) {
        //        $scope.$broadcast('allCalendarView');
        //    }
        //}
        if (checkedArray.length == 0) {
            $scope.selectVisitType = "All Visit Type";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectVisitType = checkedArray[0].Name;
            } else {
                $scope.selectVisitType = "All Visit Type";
            }
        }
    };
    $scope.checkAllVisitStatus = function (val) {
        if (val) {
            angular.forEach($scope.AppointmentVisitFilterArray, function (item) {
                item.isChecked = true;
            });

        } else {
            angular.forEach($scope.AppointmentVisitFilterArray, function (item) {
                item.isChecked = false;
            });
        }
        var checkedArray = _.where($scope.AppointmentVisitFilterArray, { isChecked: true });
        $scope.AllAppointmentVisitStatusCheck = checkedArray.length > 0 && $scope.AppointmentVisitFilterArray.length === checkedArray.length ? true : false;
        $scope.loadAppointments($scope.selectedDoctor, '');
    };

    $scope.checkAllCheckInStatus = function (val) {
        if (val) {
            angular.forEach($scope.CheckInFilterArray, function (item) {
                item.isChecked = true;
            });

        } else {
            angular.forEach($scope.CheckInFilterArray, function (item) {
                item.isChecked = false;
            });
        }
        var checkedArray = _.where($scope.CheckInFilterArray, { isChecked: true });
        $scope.AllCheckInStatusCheck = checkedArray.length > 0 && $scope.CheckInFilterArray.length === checkedArray.length ? true : false;
        $scope.loadAppointments($scope.selectedDoctor, '');
    };
    $scope.CheckInToggle = function (item) {
        var checkedArray = _.where($scope.CheckInFilterArray, { isChecked: true });
        $scope.AllCheckInStatusCheck = checkedArray.length > 0 && $scope.CheckInFilterArray.length === checkedArray.length ? true : false;
        $scope.loadAppointments($scope.selectedDoctor, '');
    };
    $scope.MultiSeleteSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: false,
        showCheckAll: true,
        showUncheckAll: true
    };
    $scope.SelectedAppointmentStatusList = [];

    $scope.calenderDate = "";
    $scope.patSearchType = 2;
    // $scope.SelectedDoctorcalendar = 'AllDoctors';
    $scope.SelectedDoctorcalendar = 'singleDoctor';
    $scope.dilationpatSearchType = 2;
    $scope.searchPatientTxt = "";
    $scope.searchPatientIdTxt = "";
    $scope.searchPatientOldMR = "";
    $scope.searchOldPatientMRNO = "";
    $scope.searchdilationPatientTxt = "";
    $scope.searchdilationPatientIdTxt = "";
    $scope.searchdilationOldPatientIdTxt = "";
    console.log($scope.SpecializationId);

    $scope.selectedSpecializationId = $scope.SpecializationId;

    $scope.showstartCnOpparamsinAppt = false;
    $scope.DocFreqItems = [];
    $scope.DoctorSpecializationId = 0;
    if ($scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61 || $scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57) {
        $scope.showstartCnOpparamsinAppt = true;
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
    $scope.referredappointmentdate = $filter('date')(new Date(), "dd-MMM-yyyy");
    $scope.viewDate = new Date();
    $scope.showCalendar = true;
    $scope.Showtreatments = false;
    $scope.selectedArObject = "";
    $scope.SelectedArId = 0;
    $scope.showRegPatBtninAptlist = true;

    var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();
    eHnoteMasterDataService.addSelectedAppointDt($scope.getCurrentDate());
    if ($scope.userLoginDetails.RoleID === 10) {
        $scope.SelectedOptometristId = eHnoteMasterDataService.getLoginId();
        $scope.showRegPatBtninAptlist = false;
    }
    if ($scope.userLoginDetails.RoleID === 61) {
        $scope.SelectedArId = eHnoteMasterDataService.getLoginId();
        $scope.showRegPatBtninAptlist = false;
    }

    $scope.ispatientExistsval = false;

    $scope.SearchBy = "";
    var TimetoScroll = '';
    var avgConsultationTime = 15;
    $scope.mainBookedAppointmentList = [];
    $scope.BookedAppointmentList = [];
    $scope.filteredAppointmentArray = [];

    $scope.searchtxtb = { "txt1": "", "txt2": "" };
    $scope.searchtxtSpc = { "txt1": "", "txt2": "" };
    $scope.searchtxtAppointmentType = { "txt1": "", "txt2": "", "txt3": "" };
    $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "", "txt9": "" };
    var FollowUpDate = "";
    var followupon = "";
    var followupnotes = "";
    $scope.DoctorsID = 0;
    $scope.addresIDs = [];
    $scope.patDetails = [];
    $scope.paramValueColl = [];
    $scope.eventsList = [];
    $scope.selectedDoctor = {};
    $scope.selectedOptometrist = {};
    datapersistanceFactory.set("BillingToProfile", '');
    $scope.selectedSpecialization = {
        "SpecializationName": "All Specialities",
        "SpecializationId": 0
    };
    $scope.SearchByPatients = "N";
    $scope.ageSplits = { "year": 0, "months": '0' };
    $scope.appCount = {
        "bookedCount": 0,
        "checkedInCount": 0,
        "completedCount": 0,
        "startedCount": 0,
        "eventsCount": 0
    };
    $rootScope.appointment_type = "1";
    $scope.UserSetting = "settings";
    $scope.showEditAppointmentID = true;
    $scope.disableClinic = false;
    $scope.appointmentDocName = '';
    $scope.showicon = false;
    var admin_status = false;
    var qtipDown = false;
    var clinicAddress = [];
    var listSelectedClinic = {};
    var calSelectedClinic = {};
    $scope.adminHospitalList = [];
    var Selectedfrpastdate = $filter('date')(new Date(), "dd-MM-yyyy");
    eHnoteMasterDataService.addSelectedPastAppDate(Selectedfrpastdate);
    var PastHealthHistoryRecord = [];
    eHnoteMasterDataService.addPreMedicalHistory(PastHealthHistoryRecord);
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    $scope.vitalsArray = [];

    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

    $scope.IsDynamicCheckInMandatory = false;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            if ($scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus === 1) {
                $scope.IsDynamicCheckInMandatory = true;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.SelectBarCodeLabelPrint === '2') {
                $scope.ShowBarCodeprint = true;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.SelectBarCodeLabelPrint === '3') {
                $scope.ShowLabelprint = true;
            }
        }
    }

    $scope.isObjectEmpty = function (input) {
        input = input || null;
        if (input !== null) {
            return Object.keys(input).length === 0;
        }
        return true;
    };
    $scope.showListofpatient = true;
    $scope.showGlobalListofpatient = true;
    $scope.showPatientbilling = true;
    $scope.showHospitalList = true;
    $scope.showDoctorsList = true;
    $scope.showGlobalAppointmentBook = true;
    $scope.showUpdatePatient = true;
    $scope.showVitalsViewinAppt = true;
    $scope.showOpthaViewinAppt = true;
    $scope.showBillinginCasehistory = true;
    $scope.showViewCaseHistory = true;
    $scope.showConsultationFromAppt = true;
    $scope.showConsultationFromPatient = true;
    $scope.showConsultationBilling = true;
    $scope.showAppointmentListBilling = true;

    if (doctorInfo.doctordata.UserAddress !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleName !== undefined) {
        $scope.Role = doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleName;
    }


    if ($scope.Role === "ADMIN") {
        $scope.RoleAdmin = true;
    } else {
        $scope.RoleAdmin = false;
    }
    eHnoteMasterDataService.addBillingInfo('');
    var chk = [];
    chk = $scope.userLoginDetails;
    $rootScope.mainDisplayName = $scope.userLoginDetails.displayName;
    var onchageselectappoint = 0;
    $scope.activeEvent = 'list';
    // $scope.activeEvent = 'day';
    setCalenderViewVisibility(false);
    $scope.selectedDocCSSid = 0;
    $scope.hospitalcd = "";
    $scope.hospid = "";

    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.hospitalcd = "";
        $scope.hospid = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.parenthospId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

    }
    $scope.admintype = doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleName;
    $scope.clinicDoctorList = [];
    $scope.clinicOptometristsList = [];
    $scope.clinicARAssistantList = [];
    $scope.clinicDoctorDepList = [];
    $scope.clinicDoctorCalendar = [];

    $scope.Calendardoctorlist1 = [];
    $scope.MultiselectDoctorlist = [];
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var sliceTime = "15";
    $scope.eventSource = {};
    $scope.eventsList = [];
    TimetoScroll = "15:00:00";
    $scope.pickerShow = false;
    $scope.calendarDate = new Date();
    $scope.minPerCase = 15;
    $scope.calendarView = 'day';
    $scope.redirectToPatientadd = false;
    $scope.isCellOpen = true;
    var jsonUnavailableTime = [];
    $scope.fullCollectionBilling = [];
    $scope.HospitalChange = false;
    $scope.appScreen = "list";
    $scope.refappwithcolors = {};
    $scope.refsuccessvalchange = {};
    $scope.collectionsuccessclr = [];
    $scope.collectionrefclr = [];
    $scope.items = [];
    $scope.animationsEnabled = true;
    var sdate = "";
    $scope.disabled = true;
    $scope.appointaddressId = false;
    $scope.appointmentlistID = true;
    $scope.showDayID = false;
    $scope.showWeekID = false;
    $scope.showCalendarID = true;
    $scope.items = [];

    eHnoteMasterDataService.addSelectedHospitalinAppList("");
    eHnoteMasterDataService.addSelectedDoctorinAppList("");
    $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
    $scope.CommunicationdetailsArray = $scope.UserSettingObject.CommunicationsSettings;
    $scope.sendDocSms = false;
    $scope.sendDocEmail = false;
    $scope.sendPatientSms = false;
    $scope.sendPatientEmail = false;


    $scope.loadDoctor = function (val, type, screen) {
        screen = screen || "";
        $scope.AppListselectedclinic = val;
        if ($scope.AppListselectedclinic.ClinicId === 0) {
            eHnoteMasterDataService.addSelectedHospitalinAppList("");
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList($scope.AppListselectedclinic);
        }
        eHnoteMasterDataService.addDocChangeHospital($scope.AppListselectedclinic);

        if (($scope.userLoginDetails.RoleID !== 1 && $scope.userLoginDetails.RoleID !== 56) ||
            ($scope.userLoginDetails.RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 0)) {

            $scope.clinicDoctorAllList = [];
            $scope.clinicDoctorList = [];
            if ($scope.AppListselectedclinic.ClinicId === 0) {
                angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                    $scope.clinicDoctorList = $scope.clinicDoctorList.concat(item.Doctors);
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
            } else {
                $scope.clinicDoctorList = $scope.clinicDoctorList.concat($scope.AppListselectedclinic.Doctors);
            }
            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            }) || [];
            if (screen === "list") {
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "UserBranchId": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                $scope.clinicDoctorList.unshift(docAll);
            }
            $scope.selectedDoctor = $scope.clinicDoctorList[0];
        } else {
        }

        $scope.loadAppointments($scope.selectedDoctor, '');

    };


    $scope.changeAppointmentBranch = function (obj, type, screen) {
        $scope.selectedBranch = obj;
        $scope.AppListselectedclinic = obj;

        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, '');
        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, '');
    };

    $scope.changeHospitalSpecialization = function (item) {


        $scope.selectedSpecialization = item;
        $scope.selectedSpecializationId = item.SpecializationId;
        $scope.allSubSpecializationsArray = [];
        eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                if (item.SpecializationId !== 0) {
                    $scope.allSubSpecializationsArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SpecializationId === item.SpecializationId; });
                }
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId, '');
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    }

    var RefreshRecusriveCall;
    $scope.StartAutoRefreshAppointment = function () {
    };
    $scope.$on("$destroy", function () {
        $interval.cancel(RefreshRecusriveCall);
    });

    $scope.LoadDynamicData = function (params, type) {

    }




    $scope.loadAppointments = function (selectedDr, type) {

        selectedDr = $scope.selectedDoctor;
        $scope.StartAutoRefreshAppointment();
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchObj.searchPatientIdTxt = "";
        $scope.SearchObj.searchPatientOldMR = "";
        $scope.SearchPatientfilter.IsPatientNameInd = false;
        $scope.SearchPatientfilter.PaientMRNO = "";
        $scope.SearchPatientfilter.PaientOldMRNO = "";

        if (selectedDr.FullName === "All Doctors") {
            selectedDr.UserBranchId = 0;
        }
        eHnoteMasterDataService.addSelectedDoctorinAppList(selectedDr);
        if ($scope.mainAppointmentView.isCalendarorList === "calendar") {
            $scope.selectedDoctor = selectedDr;
            if (selectedDr !== null || selectedDr !== undefined) {
                $scope.selectedDocCSSid = selectedDr.DoctorID;
                $scope.selectedDocApp = onchageselectappoint;
                $scope.appointmentDocName = selectedDr.FullName;
                $scope.SelectedAppointmentDr = selectedDr;

                $scope.appointmentCountDisplay = selectedDr.AppointmentCount;
                onchageselectappoint = $scope.selectedDoctor.UserBranchId;
            } else {
                onchageselectappoint = $scope.AppListselectedclinic.UserBranchId;
                avgConsultationTime = $scope.AppListselectedclinic.ExtDetails.MinPerCase || 15;
            }
            if ($scope.calendarView === "day") {
                $scope.loadDayView($scope.viewDate, selectedDr);
            } else if ($scope.calendarView === "week") {
                loadWeekView();
            } else if ($scope.calendarView === "month") {
                loadMonthView();
            }
            $scope.selectedDoctorView = getDoctorName("calendar");
            $scope.showDoctorListing = false;
        }
        else {
            $scope.selectedDoctor = selectedDr;
            var hospitalID = 0;

            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked == true; });
            hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");


            var subList = "";
            for (var i in $scope.allSubSpecializationsArray) {
                if ($scope.allSubSpecializationsArray[i].isChecked) {
                    subList += "," + $scope.allSubSpecializationsArray[i].SubSpecializationId;
                }
            }
            if (subList.charAt(0) === ",") {
                subList = subList.slice(1);
            }

            var consultdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");
            var params = {};


            var apptFromDate = $filter("date")(new Date($scope.SearchObj.FromDate), "yyyy-MM-dd");
            var apptToDate = $filter("date")(new Date($scope.SearchObj.ToDate), "yyyy-MM-dd");

            if ($scope.selectedDoctor.UserBranchId === 0) {
                params = {
                    "HospitalID": hospitalID,
                    "FromDate": apptFromDate,
                    "ToDate": apptToDate,
                    "PageSize": $scope.Pagination.Patientitemsperpage,
                    "PageNumber": $scope.Pagination.currentPagePatient,
                    "SearchText": $scope.SearchObj.searchPatientTxt ? $scope.SearchObj.searchPatientTxt : "",
                    "SearchPatientId": $scope.SearchObj.searchPatientIdTxt ? $scope.SearchObj.searchPatientIdTxt : "",
                    "RoleId": $scope.userLoginDetails.RoleID,
                    "SortType": $scope.SortType,
                    "SortBy": $scope.SortBy,
                    "SpecializationId": $scope.selectedSpecializationId,
                    "SubSpecializationIds": subList,
                    "UserIds": "",
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "PatientId": $scope.SearchObj.PatientId || 0

                };
            }
            else {
                params = {
                    "UserBranchId": $scope.selectedDoctor.UserBranchId,
                    "DoctorID": $scope.selectedDoctor.DoctorID,
                    "FromDate": apptFromDate,
                    "ToDate": apptToDate,
                    "HospitalID": hospitalID,
                    "PageSize": $scope.Pagination.Patientitemsperpage,
                    "PageNumber": $scope.Pagination.currentPagePatient,
                    "SearchText": $scope.SearchObj.searchPatientTxt ? $scope.SearchObj.searchPatientTxt : "",
                    "SearchPatientId": $scope.SearchObj.searchPatientIdTxt ? $scope.SearchObj.searchPatientIdTxt : "",
                    "RoleId": $scope.userLoginDetails.RoleID,
                    "SortType": $scope.SortType,
                    "SortBy": $scope.SortBy,
                    "UserIds": "",
                    "SpecializationId": $scope.selectedSpecializationId,
                    "SubSpecializationIds": subList,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "PatientId": $scope.SearchObj.PatientId || 0
                };
            }



            if ($scope.userLoginDetails.RoleID === 61) {
                params.ARassistantId = $scope.SelectedArId;
            }

            var list1 = [];
            angular.forEach($scope.AppointmentStatusFilterArray, function (items) {
                if (items.isChecked) {
                    list1.push(items.Id);
                }
            });
            var list2 = [];
            angular.forEach($scope.AppointmentVisitFilterArray, function (mitems) {
                if (mitems.isChecked) {
                    list2.push(mitems.Id);
                }
            });
            var list3 = [];
            angular.forEach($scope.appointmentTypes, function (mitems) {
                if (mitems.isChecked) {
                    list3.push(mitems.Id);
                }
            });
            var list4 = [];
            angular.forEach($scope.CheckInFilterArray, function (mitems) {
                if (mitems.isChecked) {
                    list4.push(mitems.Id);
                }
            });
            var list5 = [];
            angular.forEach($scope.Visitreasons, function (mitems) {
                if (mitems.isChecked) {
                    list5.push(mitems.ReasonId);
                }
            });

            var newlist1 = "";
            for (var i in $scope.AppointmentStatusFilterArray) {
                if ($scope.AppointmentStatusFilterArray[i].isChecked) {
                    newlist1 += "," + $scope.AppointmentStatusFilterArray[i].Id;
                }
            }
            if (newlist1.charAt(0) === ",") {
                newlist1 = newlist1.slice(1);
            }

            var newlist2 = "";
            for (var i in $scope.AppointmentVisitFilterArray) {
                if ($scope.AppointmentVisitFilterArray[i].isChecked) {
                    newlist2 += "," + $scope.AppointmentVisitFilterArray[i].Id;
                }
            }
            if (newlist2.charAt(0) === ",") {
                newlist2 = newlist2.slice(1);
            }
            var newlist3 = "";
            for (var i in $scope.appointmentTypes) {
                if ($scope.appointmentTypes[i].isChecked) {
                    newlist3 += "," + $scope.appointmentTypes[i].Id;
                }
            }
            if (newlist3.charAt(0) === ",") {
                newlist3 = newlist3.slice(1);
            }

            var newlist4 = "";
            for (var i in $scope.CheckInFilterArray) {
                if ($scope.CheckInFilterArray[i].isChecked) {
                    newlist4 += "," + $scope.CheckInFilterArray[i].Id;
                }
            }
            if (newlist4.charAt(0) === ",") {
                newlist4 = newlist4.slice(1);
            }
            var newlist5 = "";
            for (var i in $scope.Visitreasons) {
                if ($scope.Visitreasons[i].isChecked) {
                    newlist5 += "," + $scope.Visitreasons[i].ReasonId;
                }
            }
            if (newlist5.charAt(0) === ",") {
                newlist5 = newlist5.slice(1);
            }



            var newlist6 = "";
            for (var i in $scope.MultiselectDoctorlist) {
                if ($scope.MultiselectDoctorlist[i].isChecked) {
                    newlist6 += "," + $scope.MultiselectDoctorlist[i].DoctorID;
                }
            }
            if (newlist6.charAt(0) === ",") {
                newlist6 = newlist6.slice(1);
            }

            var newlist7 = "";
            for (var i in $scope.MultiselectUserlist) {
                if ($scope.MultiselectUserlist[i].isChecked) {
                    newlist7 += "," + $scope.MultiselectUserlist[i].DoctorID;
                }
            }
            if (newlist7.charAt(0) === ",") {
                newlist7 = newlist7.slice(1);
            }


            var newlist8 = "";
            for (var i in $scope.ProfileStatusList) {
                if ($scope.ProfileStatusList[i].IsChecked) {
                    newlist8 += "," + $scope.ProfileStatusList[i].Id;
                }
            }
            if (newlist8.charAt(0) === ",") {
                newlist8 = newlist8.slice(1);
            }

            var newlist9 = "";
            for (var i in $scope.confirmationStatusArray) {
                if ($scope.confirmationStatusArray[i].IsChecked) {
                    newlist9 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
                }
            }
            if (newlist9.charAt(0) === ",") {
                newlist9 = newlist9.slice(1);
            }
            var patienttaglist = "";
            for (var i in $scope.PatientTagList1) {
                if ($scope.PatientTagList1[i].IsChecked) {
                    patienttaglist += "," + $scope.PatientTagList1[i].HospitalEquipmentId;
                }
            }
            if (patienttaglist.charAt(0) === ",") {
                patienttaglist = patienttaglist.slice(1);
            }




            params.AppointmentStatusIDLst = newlist1;
            params.VisitStatusIDLst = newlist2;
            params.AppointmentTypeStatusIDList = newlist3;
            params.CheckInStatusIDList = newlist4;
            params.VisitReasonIdList = newlist5;
            params.DoctorIds = newlist6;
            params.GetAllAppointmentStatusInd = $scope.AllAppointmentStatusCheck;
            params.GetAllVisitStatusInd = $scope.AllAppointmentVisitStatusCheck;
            params.GetAllAppointmentTypeStatusInd = $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck;
            params.GetAllCheckInStatusInd = $scope.AllCheckInStatusCheck;
            params.StatusId = $scope.SelectedStatus.StatusId;
            params.ProfileStatusId = $scope.SelectedProfileStatus.StatusId;
            params.UserIds = newlist7;

            params.StatusIds = angular.copy(newlist9);
            params.ProfileStatusIds = angular.copy(newlist8);
            params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment || false;
            params.ReminderTypeID = $scope.SearchObj.ReminderTypeID || null;
            params.ReminderStatusId = $scope.SearchObj.ReminderStatusId || null;
            params.PatientTagListIds = patienttaglist;
            params.PriorityStatus = $scope.SearchObj.PriorityStatus || "";
            eHnoteMainAppointmentService.GetPatientRemindersAppointmentsList(params, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        }
    };
    function OnGetListofAppointmentSuccess(bookdata) {
        var data = [];
        data = bookdata.AppointmentList;
        $scope.mainBookedAppointmentListCount = bookdata.count;
        console.log($scope.mainBookedAppointmentListCount);
        LoadAppointmentlist(data);
        $scope.Priority = data
        $scope.referredshowloading = false;
    }
    function OnGetListofAppointmentError(bookdata) {
        $scope.currentshowloading = false;
        $scope.pastshowloading = false;
        $scope.referredshowloading = false;
        alertify.error("Error in listing Appointments");
    }





    $scope.searchDilationPatientAppointmentList = function (txt, type) {

        $scope.StartAutoRefreshAppointment();

        txt = txt || "";
        if (type === 2) {//MR number search
            if (txt === "") {
                $scope.searchdilationPatientTxt = "";
                $scope.searchdilationPatientIdTxt = "";

            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.searchdilationPatientIdTxt = txt;
                    $scope.searchdilationPatientTxt = "";
                    $scope.loadAppointments($scope.selectedDoctor, '');
                }
            }

        }
        else if (type === 3) {//old MR number search
            if (txt === "") {
                $scope.searchdilationPatientTxt = "";
                $scope.searchdilationPatientIdTxt = "";
                $scope.searchdilationOldPatientIdTxt = "";

            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.searchdilationOldPatientIdTxt = txt;
                    $scope.searchdilationPatientIdTxt = "";
                    $scope.searchdilationPatientTxt = "";
                    $scope.loadAppointments($scope.selectedDoctor, '');
                }
            }

        } else {//Name Search
            if (txt.length > 2) {
                $scope.searchdilationPatientTxt = txt;
                $scope.searchdilationPatientIdTxt = "";
                $scope.searchdilationOldPatientIdTxt = "";

            } else {
                if (txt === "") {
                    $scope.searchdilationPatientTxt = "";
                    $scope.searchdilationPatientIdTxt = "";
                    $scope.searchdilationOldPatientIdTxt = "";

                }
            }
        }
    };

    $scope.GetAllMasterClaimsData = function () {
        eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.MasterPriority.length > 0) {
                    $scope.MasterPriority = angular.copy(resp.data.MasterPriority);
                    if ($scope.MasterPriority.length > 0) {
                        const AllPriorityIds = $scope.MasterPriority.map(p => p.PriorityId).join(',');
                        $scope.MasterPriority.unshift({
                            PriorityId: AllPriorityIds,
                            PriorityName: "All"
                        });
                        $scope.SearchObj.PriorityStatus = AllPriorityIds;
                        $scope.resetallids = AllPriorityIds;

                    }
                }
            }
        }, function (err) {
            alertify.error("Getting Failed");
        });
    }
    $scope.initialiseClinicDoctor = function () {
        onchageselectappoint = 0;
        $scope.selectedDocCSSid = 0;
        var RoleID = $scope.userLoginDetails.RoleID;

        if (RoleID !== 1 && RoleID !== 56) {

            $scope.clinicDoctorList = [];
            $scope.AppListdoctoraddress = clinicAddress;

            $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
                return item.ClinicId === doctorInfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.AppListselectedclinic = $scope.defaultbranch[0];

            $scope.defaultbranch[0].Doctors = $scope.defaultbranch[0].Doctors || [];
            $scope.clinicDoctorList = $scope.clinicDoctorList.concat($scope.defaultbranch[0].Doctors);

            $scope.clinicOptometristsList = $filter("filter")($scope.clinicDoctorList, function (item) { return item.RoleId === 10; });
            $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });

            $scope.clinicARAssistantList = $filter("filter")($scope.clinicDoctorList, function (item) { return item.RoleId === 61; });
            $scope.clinicARAssistantList = _.uniq($scope.clinicARAssistantList, false, function (p) { return p.DoctorID; });

            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
            });
            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
            $scope.clinicDoctorList.unshift(docAll);
            var opthoall = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicOptometristsList.unshift(opthoall);

            var ARall = { "DoctorID": 0, "FullName": "All AR", "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicARAssistantList.unshift(ARall);

            Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
            if (Index > -1) {
                $scope.selectedDoctor = $scope.clinicDoctorList[Index];
            } else {
                $scope.selectedDoctor = $scope.clinicDoctorList[0];
            }
            onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
            $scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;
        }

        if (RoleID === 1 || RoleID === 56) {

            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
            });
        }

        if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {

            Index = $scope.clinicDoctorList.findIndex(record => record.FullName === "All Doctors");
            if (Index > -1) {
                $scope.clinicDoctorList.splice(Index, 1);
            }
            angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                if (item.ClinicName !== "All Locations") {
                    if (item.ExtDetails.HospitalID === $scope.hospid) {
                        $scope.AppListselectedclinic = item;
                        $scope.loadDoctor(item, true, "list");
                        eHnoteMasterDataService.addSelectedHospitalinAppList(item);
                    }
                }
            });
        }
        if (RoleID === 10) {
            Index = $scope.clinicOptometristsList.findIndex(record => record.DoctorID === $scope.SelectedOptometristId);
            if (Index > -1) {
                $scope.selectedOptometrist = $scope.clinicOptometristsList[Index];
            }
        }
        if (RoleID === 61) {
            Index = $scope.clinicARAssistantList.findIndex(record => record.DoctorID === $scope.SelectedArId);
            if (Index > -1) {
                $scope.selectedArObject = $scope.clinicARAssistantList[Index];
            }
        }

        var currentClinic = doctorInfo.doctordata.UserAddress[0];
        if ($scope.AppListdoctoraddress.length > 0) {
            angular.forEach($scope.AppListdoctoraddress, function (value, key) {
                if (currentClinic.ExtDetails !== undefined && currentClinic.ExtDetails.HospitalID !== undefined && value.ExtDetails !== undefined && value.ExtDetails.HospitalID !== undefined && currentClinic.ExtDetails.HospitalID === value.ExtDetails.HospitalID) {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                        onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
                        $scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;
                    } else {
                        $scope.AppListselectedclinic = value;
                    }
                }
            });
        }


        if ($scope.Tab === 'appointments' || $scope.Tab === 'teleappointments') {
            if (RoleID === 1 || RoleID === 56) {
                loadAppointmentforDoc($scope.selectedDoctor);
            } else {
                $scope.loadAppointments($scope.selectedDoctor, '');
            }
        }



    };
    $scope.LabsearchText = "";
    $scope.DilationSelectedEye = 3;
    $scope.DilationRemarks = "";



    $scope.init = function () {


        var emptyARray = [];
        eHnoteMasterDataService.addCalendarDoctorinAppList(emptyARray);
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        function onspecsuccess(data) {
            $scope.specialitylist = data;
            var specAll = { "Id": 0, "Name": "All" };
            $scope.specialitylist.unshift(specAll);
        }

        function onspecfailure(data) {
        }

        $scope.GetAllMasterClaimsData();
    };


    $scope.doctorlist = function () {
        $scope.Calendardoctorlist = [];
        // var Calendardoctorarray = angular.copy($scope.clinicDoctorList) || [];
        var Calendardoctorarray = angular.copy($scope.Calendardoctorlist1) || [];


        $scope.TimeSlotsList = [];
        $scope.timeslots = [];
        // var Stime = '00:00';
        var Stime = '08:00';
        var Etime = '21:00';
        var arr = Stime.split(':');
        var shour = $.trim(arr[0]);
        var smin = $.trim(arr[1]);


        var arr2 = Etime.split(':')
        var ehour = $.trim(arr2[0]);
        var emin = $.trim(arr2[1]);
        var startingTime = moment().hours(shour).minutes(smin);
        var endingTime = moment().hours(ehour).minutes(emin);
        var MinPerCase = '15';

        var currentStartTime = angular.copy(startingTime);
        var token = 1;
        while (currentStartTime < endingTime) {
            var slotObj = {
                "StartTime": currentStartTime.format("HH:mm"),
                "EndTime": currentStartTime.add(MinPerCase, "minute").format("HH:mm"),
                "TokenNumber": token,
                "ISbookAppointment": false,
                "MinPerCase": MinPerCase,
                "AppointmentId": 0,
                "PatientId": 0,
                "patientInfo": "",
                "PatientName": "",
                "DoctorId": ""
            }
            token++;
            $scope.timeslots.push(slotObj);

        }
        $scope.TimeSlotsList = $scope.timeslots || [];
        // $scope.setValue1 = $scope.timeslots || [];

        Calendardoctorarray = $filter("filter")(Calendardoctorarray, function (item, index) { return item.DoctorID !== 0; }) || [];
        if (Calendardoctorarray.length > 0) {
            angular.forEach(Calendardoctorarray, function (item) {
                var obj = {
                    "DoctorId": item.DoctorID,
                    "DoctorName": item.FullName,
                    "UserBranchId": item.UserBranchId,
                    "MinPerCase": item.MinPerCase,
                    "ConsultationDate": "",
                    "RoleId": item.RoleId,
                    "RoleName": item.RoleName,
                    "SlotsList": $scope.TimeSlotsList || [],

                }
                $scope.Calendardoctorlist.push(obj);
            });
        }


    };

    $scope.getDoctorsbySubSpecializations = function (branchId, pagetype) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = [];
        $scope.allUserList = [];
        $scope.MultiselectUserlist = [];
        $scope.MultiselectDoctorlist = [];
        $scope.selectedDoctor = "";
        $scope.selectedLoginDoctor = "";

        $scope.SearchObj.AllUsersCheck = false;

        //if (branchId === 0) {
        //    var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
        //    var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

        //    angular.forEach(TempAppListdoctoraddress, function (items) {
        //        branchesList.push(items.BranchId);
        //    });
        //} else {
        //    var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId === branchId; });
        //    var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
        //    angular.forEach(TempAppListdoctoraddress, function (items) {
        //        branchesList.push(items.BranchId);
        //    });
        //}
        //var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        //var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
        var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            //"SubSpecializationIdArray": subSplArray
        }

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.clinicDoctorList = [];
                $scope.Calendardoctorlist1 = [];
                $scope.MultiselectDoctorlist = [];
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllARList = angular.copy($scope.allUserList);
                $scope.AllBillingList = angular.copy($scope.allUserList);
                $scope.AllMultiselectUserlist = angular.copy($scope.allUserList);

                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                });
                $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                    return item.RoleId === 10;
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
                $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
                $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                    return item.RoleId === 61;
                });
                $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                    return item.RoleId === 2 || item.RoleId === 19;
                });

                $scope.AllReceptionList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                $scope.AllReceptionList = $filter("filter")($scope.AllBillingList, function (item) {
                    return item.RoleId === 2;
                });

                $scope.AllMultiselectUserlist = _.uniq($scope.AllMultiselectUserlist, false, function (p) { return p.DoctorID; });

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 10) {
                        $scope.clinicOptometristsList.push(Aitem);
                    }
                    if (Aitem.RoleId === 61) {
                        $scope.clinicARAssistantList.push(Aitem);
                    }
                });
                $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });
                $scope.clinicARAssistantList = _.uniq($scope.clinicARAssistantList, false, function (p) { return p.DoctorID; });


                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {

                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        $scope.clinicDoctorList.push(Aitem);
                    }
                    //if (Aitem.RoleId === 1 || Aitem.RoleId === 43 ) {

                    //    $scope.Calendardoctorlist1.push(Aitem);
                    //    $scope.MultiselectDoctorlist.push(Aitem);

                    //}
                    //if ($scope.MultiselectDoctorlist.length > 0) {
                    //    angular.forEach($scope.MultiselectDoctorlist, function (kitem) {
                    //        kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                    //    });

                    //}

                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                //var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                //$scope.clinicDoctorList.unshift(docAll);
                var opthoall = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicOptometristsList.unshift(opthoall);
                var Arall = { "DoctorID": 0, "FullName": "All AR", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicARAssistantList.unshift(Arall);

                Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                if (Index > -1) {
                    $scope.selectedDoctor = $scope.clinicDoctorList[Index];
                } else {
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }

                onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
                $scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;

                if (RoleID === 1 || RoleID === 56) {
                    $scope.clinicDoctorList = [];
                    angular.forEach($scope.allUserList, function (Aitem) {

                        if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {

                            $scope.clinicDoctorList.push(Aitem);

                        }

                    });
                    //var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                    //$scope.clinicDoctorList.unshift(docAll);
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                }


                if (RoleID === 10) {
                    Index = $scope.clinicOptometristsList.findIndex(record => record.DoctorID === $scope.SelectedOptometristId);
                    if (Index > -1) {
                        $scope.selectedOptometrist = $scope.clinicOptometristsList[Index];
                    }
                }
                if (RoleID === 61) {
                    Index = $scope.clinicARAssistantList.findIndex(record => record.DoctorID === $scope.SelectedArId);
                    if (Index > -1) {
                        $scope.selectedArObject = $scope.clinicARAssistantList[Index];
                    }
                }


                if ($scope.connectedUserObj.Available) {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.MultiselectDoctorlist = [];
                        $scope.Calendardoctorlist1 = [];
                        angular.forEach($scope.clinicDoctorList, function (kitem) {
                            kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                            if (doctorInfo.doctordata.User[0].RoleId == 1 && $scope.connectedUserObj.Users.length > 0) {
                                var TempReasion = $filter("filter")($scope.connectedUserObj.Users, function (uitem) { return uitem.ChildUserId == kitem.DoctorID || kitem.DoctorID == doctorInfo.doctordata.User[0].DoctorID; }) || [];
                                if (TempReasion.length > 0) {
                                    $scope.MultiselectDoctorlist.push(kitem);
                                    $scope.Calendardoctorlist1.push(kitem);
                                }
                            } else if (doctorInfo.doctordata.User[0].RoleId == 1 && $scope.connectedUserObj.Users.length == 0) {
                                if (kitem.DoctorID == doctorInfo.doctordata.User[0].DoctorID) {
                                    $scope.MultiselectDoctorlist.push(kitem);
                                    $scope.Calendardoctorlist1.push(kitem);
                                }
                            } else {
                                $scope.MultiselectDoctorlist.push(kitem);
                                $scope.Calendardoctorlist1.push(kitem);
                            }
                        });
                    }
                }
                else {
                    angular.forEach($scope.clinicDoctorList, function (kitem) {
                        kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                        $scope.MultiselectDoctorlist.push(kitem);
                        $scope.Calendardoctorlist1.push(kitem);
                    });
                }


                $scope.Calendardoctorlist1 = $scope.Calendardoctorlist1 || [];
                $scope.MultiselectDoctorlist = $scope.MultiselectDoctorlist || [];

                $scope.subMaindoc.DoctorsList = [];
                if ($scope.clinicDoctorList.length > 0) {
                    angular.forEach($scope.clinicDoctorList, function (citem, $index) {
                        citem.id = citem.DoctorID;
                        citem.title = citem.FullName;
                        citem.isChecked = true;
                    });
                }


                if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings != undefined) {
                    if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
                        if (!$scope.connectedUserObj.Available) {
                            if (doctorInfo.doctordata.User[0].SuffixId != 13) {
                                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                                $scope.selectedDoctor = $scope.clinicDoctorList[0];
                                $scope.MultiselectDoctorlist = $filter("filter")($scope.MultiselectDoctorlist, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                            }
                        }
                    }
                }

                if (RoleID === 1 || RoleID === 56 || RoleID === 43) {
                    $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];

                    // $scope.MultiselectDoctorlist = $filter("filter")($scope.MultiselectDoctorlist, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                }

                //if ($scope.Calendardoctorlist1.length > 0) {
                //    angular.forEach($scope.Calendardoctorlist1, function (citem, $index) {
                //        citem.id = citem.DoctorID;
                //        citem.DoctorID = citem.DoctorID;
                //        citem.title = citem.UserFullName;
                //        citem.isChecked = true;
                //    });
                //}
                //if ($scope.MultiselectDoctorlist.length > 0) {
                //    if ($scope.userLoginDetails.RoleID == 43 || $scope.userLoginDetails.RoleID == 1 ) {
                //        angular.forEach($scope.MultiselectDoctorlist, function (citem, $index) {
                //            if (doctorInfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                //                citem.isChecked = true;

                //                $scope.selectedDoctors = citem.SecondUserFullName + '-' + citem.NPI;
                //                $scope.selectedUsers = citem.SecondUserFullName + '-' + citem.NPI;
                //            } else {
                //                citem.isChecked = false;
                //            }

                //        });
                //    } else {
                //        angular.forEach($scope.MultiselectDoctorlist, function (citem, $index) {
                //            citem.isChecked = true;
                //        });
                //        $scope.selectedDoctors = "All";
                //        $scope.selectedUsers = "All";
                //    }

                //}

                $scope.selectedOPUsers = eHnoteMasterDataService.getSelectedCRMRemindersDoctors();
                console.log($scope.selectedOPUsers);
                console.log("WorkUp");

                $scope.selectedOPUsers.SelectedDoctorsList = $scope.selectedOPUsers.SelectedDoctorsList || [];
                if ($scope.selectedOPUsers.SelectedDoctorsList.length > 0) {
                    angular.forEach($scope.MultiselectDoctorlist, function (Mitem) {
                        Mitem.isChecked = false;
                    });
                    angular.forEach($scope.selectedOPUsers.SelectedDoctorsList, function (Selecteditem) {
                        angular.forEach($scope.MultiselectDoctorlist, function (Mainitem) {
                            if (Selecteditem.DoctorID == Mainitem.DoctorID) {
                                Mainitem.isChecked = true;
                            }
                        });
                    });

                    var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
                    $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;
                    if (checkedArray.length == 0) {
                        $scope.selectedDoctors = "Select Doctors";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            if ($scope.AllDoctorsObj.AllDoctorCheck) {
                                $scope.selectedDoctors = "All";
                            } else {
                                $scope.selectedDoctors = "Select Doctors";
                            }
                        }
                    }
                } else {
                    if ($scope.MultiselectDoctorlist.length > 0) {
                        if ($scope.connectedUserObj.Available) {
                            if (doctorInfo.doctordata.User[0].RoleId == 1) {
                                var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
                                $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;
                                if (checkedArray.length == 0) {
                                    $scope.selectedDoctors = "Select Doctors";
                                } else {
                                    if (checkedArray.length === 1) {
                                        $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                                    } else {
                                        if ($scope.AllDoctorsObj.AllDoctorCheck) {
                                            $scope.selectedDoctors = "All";
                                        } else {
                                            $scope.selectedDoctors = "Select Doctors";
                                        }
                                    }
                                }
                            } else {
                                angular.forEach($scope.MultiselectDoctorlist, function (Aitem, $index) {
                                    Aitem.isChecked = false;
                                    $scope.AllDoctorsObj.AllDoctorCheck = false;
                                    if (Aitem.DoctorID === doctorInfo.doctordata.User[0].DoctorID) {
                                        Aitem.DoctorfullNamewithNPI = Aitem.NPI + '-' + Aitem.SecondUserFullName;
                                        Aitem.isChecked = true;
                                    }
                                    angular.forEach($scope.connectedUserObj.Users, function (Uitem, $index) {
                                        if (Uitem.ChildUserId == Aitem.DoctorID) {
                                            Aitem.isChecked = true;
                                        }
                                    });

                                });
                                $scope.selectedDoctors = "Selected Doctors";
                            }
                        }
                        else {
                            if ($scope.userLoginDetails.RoleID != 1 && $scope.userLoginDetails.RoleID != 43) {
                                angular.forEach($scope.MultiselectDoctorlist, function (Aitem, $index) {
                                    $scope.AllDoctorsObj.AllDoctorCheck = true;
                                    Aitem.isChecked = true;
                                });
                                $scope.selectedDoctors = "All";
                            }
                            else {
                                if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
                                    angular.forEach($scope.MultiselectDoctorlist, function (citem, $index) {
                                        if (doctorInfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                                            citem.isChecked = true;
                                            $scope.selectedDoctors = citem.SecondUserFullName + '-' + citem.NPI;
                                            $scope.AllDoctorsObj.AllDoctorCheck = false;
                                        } else {
                                            citem.isChecked = false;
                                        }

                                    });
                                }
                            }
                        }
                    }
                }
                //  $scope.MultiselectUserlist = angular.copy($scope.MultiselectDoctorlist);

                if ($scope.AllMultiselectUserlist.length > 0) {
                    angular.forEach($scope.AllMultiselectUserlist, function (kitem) {
                        kitem.DoctorfullNamewithNPI = '';
                        kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                        kitem.id = kitem.DoctorID;
                        kitem.DoctorID = kitem.DoctorID;
                        kitem.title = kitem.UserFullName;
                        kitem.isChecked = true;
                    });

                };
                $scope.SearchObj.AllUsersCheck = true;
                $scope.MultiselectUserlist = [];
                angular.forEach($scope.AllMultiselectUserlist, function (ritem) {
                    $scope.MultiselectUserlist.push(ritem);
                    //if (ritem.RoleId === 2 || ritem.RoleId === 17 || ritem.RoleId === 62 || ritem.RoleId === 63 || ritem.RoleId === 64 || ritem.RoleId === 65 || ritem.RoleId === 66 || ritem.RoleId === 67 || ritem.RoleId === 68 || ritem.RoleId === 69 || ritem.RoleId === 70 || ritem.RoleId === 71 || ritem.RoleId === 20 || ritem.RoleId==43) {
                    //    $scope.MultiselectUserlist.push(ritem);
                    //}
                });
                angular.forEach($scope.MultiselectUserlist, function (item) {
                    item.isChecked = true;
                });
                $scope.selectedUsers = 'All';
                //if ($scope.RoleId === 2 || $scope.RoleId === 17 || $scope.RoleId === 62 || $scope.RoleId === 63 || $scope.RoleId === 64 || $scope.RoleId === 65 || $scope.RoleId === 66 || $scope.RoleId === 67 || $scope.RoleId === 68 || $scope.RoleId === 69 || $scope.RoleId === 70 || $scope.RoleId === 71 || $scope.RoleId === 20) {
                //    angular.forEach($scope.MultiselectUserlist, function (citem, $index) {
                //        if (doctorInfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                //            citem.isChecked = true;
                //            $scope.selectedUsers = citem.UserFullName + '-' + citem.NPI;
                //        } else {
                //            citem.isChecked = false;
                //        }
                //    });
                //} else {
                //    angular.forEach($scope.MultiselectUserlist, function (item) {
                //        item.isChecked = true;
                //    });
                //    $scope.selectedUsers = 'All';
                //}
                console.log($scope.connectedUserObj.Users);
                //if ($scope.userLoginDetails.RoleID != 1 && $scope.userLoginDetails.RoleID != 43) {
                //    if ($scope.AllDoctorList.length > 0) {
                //        if ($scope.connectedUserObj.Available && $scope.connectedUserObj.Users.length > 0) {
                //            $scope.MultiselectDoctorlist = [];
                //            angular.forEach($scope.AllDoctorList, function (kitem) {
                //                kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.SecondUserFullName;
                //                $scope.MultiselectDoctorlist.push(kitem);
                //            });
                //        }
                //    }
                //    angular.forEach($scope.MultiselectDoctorlist, function (citem, $index) {
                //        if ($scope.connectedUserObj.Available && $scope.connectedUserObj.Users.length > 0) {

                //            angular.forEach($scope.MultiselectDoctorlist, function (Aitem, $index) {
                //                Aitem.isChecked = false;
                //                $scope.AllDoctorsObj.AllDoctorCheck = false;
                //                angular.forEach($scope.connectedUserObj.Users, function (Uitem, $index) {
                //                    if (Uitem.ChildUserId == Aitem.DoctorID) {

                //                        Aitem.isChecked = true;
                //                    }

                //                });

                //            });
                //            $scope.selectedDoctors = "All";
                //        }
                //        else {

                //            angular.forEach($scope.MultiselectDoctorlist, function (Aitem, $index) {
                //                $scope.AllDoctorsObj.AllDoctorCheck = true;
                //                Aitem.isChecked = true;
                //            });
                //            //if (doctorInfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                //            //    citem.isChecked = true;
                //            //    $scope.selectedDoctors = citem.UserFullName + '-' + citem.NPI;
                //            //} else {
                //            //    citem.isChecked = false;
                //            //}
                //        }
                //    });

                //} 



                /*$scope.selectedApptUsers.SelectedDrList = $scope.selectedApptUsers.SelectedDrList || [];
                if ($scope.selectedApptUsers.SelectedDrList.length > 0) {
                    angular.forEach($scope.MultiselectUserlist, function (Mitem) {
                        Mitem.isChecked = false;
                    });
                    angular.forEach($scope.selectedApptUsers.SelectedDrList, function (Selecteditem) {
                        angular.forEach($scope.MultiselectUserlist, function (Mainitem) {
                            if (Selecteditem.DoctorID == Mainitem.DoctorID) {
                                Mainitem.isChecked = true;
                            }
                        });
                    });

                    var checkedArray = _.where($scope.MultiselectUserlist, { isChecked: true });
                    $scope.SearchObj.AllUsersCheck = checkedArray.length > 0 && $scope.MultiselectUserlist.length === checkedArray.length ? true : false;
                    if (checkedArray.length == 0) {
                        $scope.selectedUsers = "Select User";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedUsers = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            if ($scope.SearchObj.AllUsersCheck) {
                                $scope.selectedUsers = "All";
                            } else {
                                $scope.selectedUsers = "Selected Users";
                            }
                        }
                    }
                };*/

                eHnoteMasterDataService.addCalendarDoctorinAppList($scope.Calendardoctorlist1);








                if (RoleID === 1 || RoleID === 43) {
                    var ind1 = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                    if (ind1 > -1) {
                        $scope.selectedLoginDoctor = $scope.clinicDoctorList[ind1] || "";

                    } else {
                        $scope.selectedLoginDoctor = "";
                    }
                }

                $scope.loadAppointments($scope.selectedDoctor, pagetype);

                if ($scope.mainAppointmentView.isprofileback == '') {
                    $scope.mainAppointmentView.isCalendarorList = 'list';
                } else {
                    $scope.mainAppointmentView.isCalendarorList = $scope.mainAppointmentView.isprofileback;
                }

                if ($scope.userLoginDetails.RoleID === 2) {
                    //  $scope.mainAppointmentView.isCalendarorList = 'list';
                    $scope.mainCalendarView.MainTab = 2;
                    $scope.calendarView = "month";
                    var today1 = moment().format("MM-DD-YYYY");
                    $scope.changeCalendarDatefullCalendar(today1);

                } else if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43) {
                    //   $scope.mainAppointmentView.isCalendarorList = 'list';
                    $scope.mainCalendarView.MainTab = 1;

                } else if ($scope.userLoginDetails.RoleID === 20) {
                    //  $scope.mainAppointmentView.isCalendarorList = 'list';
                    $scope.mainCalendarView.MainTab = 2;
                }
                else {
                    //  $scope.mainAppointmentView.isCalendarorList = 'list';
                    $scope.mainCalendarView.MainTab = 2;
                }




            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
                $scope.mainDilationAppointmentList = [];
            }
        }

        function onGetUsersFailure(data) {
        }

    }

    $scope.init();


    //$scope.BranchesListArray = [];
    //  $scope.selectedBranch = "";
    $scope.allSubSpecializationsArray = [];
    $scope.newAllSubSpecializationsArray = [];
    $scope.newAllDoctorsArray = [];
    $scope.selectedSubSpecializationArray = [];

    $scope.allUserList = [];
    function GetBranchSubSpecializations(SubOrganizationId, BranchId, pagetype) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;

                console.log(pagetype + "__pagetype");

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
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorInfo) || [];
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
            "CommunicationMobileNo": "",
            "IsChecked": false
        };
        clinicAddress.unshift(EmptyClinicObj);
        $scope.BranchesListArray = clinicAddress;

        $scope.AppListdoctoraddress = clinicAddress;

        var RoleID = $scope.userLoginDetails.RoleID;

        $scope.clinicDoctorList = [];

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = "";
        $scope.selectedBranch = $scope.defaultbranch[0];
        $scope.AppListselectedclinic = $scope.defaultbranch[0];
        $scope.LocationTypeObj.SelectLocationString = $scope.AppListselectedclinic.ClinicName || '';
        if ($scope.AppListdoctoraddress.length > 0) {
            angular.forEach($scope.AppListdoctoraddress, function (bitem, index) {
                bitem.IsChecked = false;
                if (bitem.ClinicId == $scope.AppListselectedclinic.ClinicId) {
                    bitem.IsChecked = true;
                }
            });
        }

        //if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
        //    angular.forEach($scope.AppListdoctoraddress, function (item, index) {
        //        if (item.ClinicName !== "All Locations") {
        //            if (item.ClinicId === $scope.hospid) {
        //                $scope.selectedBranch = item;
        //                $scope.AppListselectedclinic = item;
        //                eHnoteMasterDataService.addSelectedHospitalinAppList(item);
        //            }
        //        }
        //    });
        //}
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);
    }

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
    function getSpecialityDesc(splCode) {
        var spl = "";
        angular.forEach(doctorinfo.specialitylist, function (item) {
            if (item.DoctorSpecialityID === splCode) {
                spl = item.DoctorSpecialityDesc;
                return;
            }
        });
        return spl;
    }
    $scope.set_color = function () {
        var value = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return {
            background: value
        };
    };
    $scope.today = function () {
        $scope.referredappointmentdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
        $scope.viewDate = new Date();
        $scope.calendarView = "day";
        $scope.changeView('agendaDay');
        $scope.activeEvent = "day";
        $scope.getListingDetailsonDateChange($scope.referredappointmentdate, 'calendar');
    };
    $scope.greaterThan = function (prop, val) {
        return function (item) {
            if (val === 0) {
                return item[prop];
            } else {
                return item[prop] > val;
            }
        };
    };

    function getDoctorName(screen) {
        var value = "";
        if ($scope.selectedDoctor !== undefined && $scope.selectedDoctor.DoctorID !== 0) {
            value = $scope.selectedDoctor.FullName;
        } else {
            value = doctorInfo.doctordata.User[0].FullName;
        }
        return value;
    }
    function getDoctorSpecialities(screen) {
        var value = "";
        var speciality = {};
        speciality = $scope.selectedDoctor.SpecialityCD;
        for (var i in speciality) {
            value += "," + getSpecialityDesc(speciality[i]);
        }
        if (value.charAt(0) === ",") return angular.copy(value);
    }
    $scope.timespanClicked = function (date) {
        date.action = "book";
        date.doctorName = getDoctorName('calendar');
        date.doctorSpecialities = getDoctorSpecialities('calendar');
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        date.doctorImage = "";
        var formatteddateValue = moment(date.date).format('HH:mm');
        var stMinutes = moment(date.minuteStart, 'HH:mm:ss');
        var che_time = moment(date.date)
            .clone()
            .hours(stMinutes.hours())
            .minutes(stMinutes.minutes())
            .seconds(stMinutes.seconds());
        $scope.dateStart = moment(date.date).format('YYYY-MM-DD');
        var newEvent = {};
        eventPopUp(date);
    };
    $scope.eventClicked = function (event, action) {
        action = action || "";
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        var tmpEvent = event;
        switch (tmpEvent.rowData.PatientInfo.appointmentStatus) {
            case "B":
                EditeventPopUp(event, action);
                break;
            case "EVENT":
                EditeventPopUp(event, action);
                break;
            case "IMPEVENT":
                EditeventPopUp(event, action);
                break;
            case "O":
                EditeventPopUp(event, action);
                break;
            case "C":
                if (action === "cancel") {
                    EditeventPopUp(event, action);
                } else {
                    rebookEvent(event, {}, {});
                }
                break;
            case "E":
                rebookEvent(event, {}, {}); break;
            default:
                alertify.error("Sorry, this Event cannot be edited"); break;
        }
    };
    $scope.viewChangeClicked = function (date, nextView) {
        $scope.calendarView = nextView;
        $scope.activeEvent = nextView;
        $scope.viewDate = date;
        $scope.referredappointmentdate = date;
    };
    function eventPopUp(event) {
        $scope.sendItem = event;
        eHnoteMasterDataService.addAddPatientwithoutConsult(false);
        eHnoteMasterDataService.addcalenderInfo(event);
        $scope.mInstanceAdd = $uibModal.open({
            templateUrl: "modalContent.html",
            controller: function ($scope, $uibModal) {
                $scope.ok = function () {
                    $scope.mInstanceAdd.dismiss('cancel');
                };
                $scope.cancel = function () {
                    $scope.mInstanceAdd.dismiss('cancel');
                };
            }
        });
        $scope.mInstanceAdd.result.then(function (selectedItem) {
        }, function () {
            if ($scope.calendarView === "day") {
                $scope.loadDayView($scope.viewDate, $scope.SelectedAppointmentDr);
            } else if ($scope.calendarView === "week") {
                loadWeekView();
            } else if ($scope.calendarView === "month") {
                loadMonthView();
            }
            if (eHnoteMasterDataService.getAddPatientwithoutConsult()) {

                $location.url("/registerPatient");
            }
        });
    }
    var cleanCallAppointmentCloseMdl = $rootScope.$on('CallAppointmentCloseMdl', function (event) {
        $scope.mInstanceAdd.dismiss('cancel');
    });
    $scope.$on('$destroy', function () {
        cleanCallAppointmentCloseMdl();
    });
    function EditeventPopUp(event, action) {
        action = action || "";
        $scope.sendItem = event;
        event.source = {
            "action": action
        };
        //cancel
        if (action === 'cancel') {
            $scope.CancelCalenderViewAppointmentList(event);
        }
        else if (action === 'OpenProfile') {
            $scope.CelanderProfileSampleClick(event.AppointmentDetails);
        } else {
            event.doctorName = event.rowData.doctorName;
            event.EmailId = event.rowData.EmailId;
            event.doctorSpecialities = getDoctorSpecialities('calendar');
            event.doctorImage = "";
            event.clinicDoctorList = $scope.clinicDoctorList;
            if (event.allDay && event.startDate !== event.endDate && event.end !== null) {
                event.endDate = moment(event.endDate).subtract(1, 'days');
                event.end = moment(event.end).subtract(1, 'days');
            }
            eHnoteMasterDataService.addcalenderInfo(event);
            $scope.OpAccess.bookAppointmentAccessFromAppList = true;

            var appoint_info = angular.copy(event.AppointmentDetails);
            appoint_info.PatientID = appoint_info.patientInfo.patientID;
            appoint_info.PatientDetails = angular.copy(appoint_info.patientInfo);
            eHnoteMasterDataService.addAppointmentInfo(appoint_info);

            var getDate = moment(event.startDate).format('DD-MMM-YYYY');
            var calenderDate = moment(event.startDate).format('DD-MMM-YYYY' + ' ' + event.AppointmentDetails.startTime);
            var calenderDate1 = moment(event.startDate).format('DD-MMM-YYYY' + ' ' + event.AppointmentDetails.endTime);
            var obj = {
                'IsComingFrom': 'Doctorcalendar',
                'MinPerCaseval': 0,
                'Starttime': calenderDate,
                'Endtime': calenderDate1,
                'GetDate': getDate,

            }
            datapersistanceFactory.set("SingleDoctorcalendar", obj);

            if ($scope.OpAccess.bookAppointmentAccessFromAppList) {
                $scope.mInstanceEdit = $uibModal.open({
                    templateUrl: 'modalEdit.html',
                    controller: function ($scope, $uibModal) {
                        $scope.ok = function () {
                            $scope.mInstanceEdit.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $scope.mInstanceEdit.dismiss('cancel');
                        };
                    }
                });
                $scope.mInstanceEdit.result.then(function (selectedItem) {
                }, function () {
                    if ($scope.calendarView === 'day') {
                        $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
                    } else if ($scope.calendarView === 'week') {
                        loadWeekView();
                    } else if ($scope.calendarView === 'month') {
                        loadMonthView();
                    }
                });
            }
        }
    }
    var cleanCallEditAppointmentCloseMdl = $rootScope.$on('CallEditAppointmentCloseMdl', function (event) {
        $scope.mInstanceEdit.dismiss('cancel');
    });
    $scope.$on('$destroy', function () {
        cleanCallEditAppointmentCloseMdl();
    });
    $scope.startWalkInConsultation = function () {
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        clearRegPatientDetails();
        $location.url("/phonenumber");
    };
    $scope.toggleCalender = function ($event, field) {
        $event.preventDefault();
        $event.stopPropagation();
    };
    function setDefaultClinic() {
        var currentClinic = doctorInfo.doctordata.UserAddress[0];
        if ($scope.AppListdoctoraddress.length > 0) {
            angular.forEach($scope.AppListdoctoraddress, function (value, key) {
                if (currentClinic.ExtDetails !== undefined && currentClinic.ExtDetails.HospitalID !== undefined && value.ExtDetails !== undefined && value.ExtDetails.HospitalID !== undefined && currentClinic.ExtDetails.HospitalID === value.ExtDetails.HospitalID) {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                        $scope.selectedDoctor = $scope.clinicDoctorList[0];
                        onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
                        $scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;
                    } else {
                        $scope.AppListselectedclinic = value;
                    }
                }
            });
        }
        if (doctorInfo.RoleID === 2 || doctorInfo.RoleID === 10 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 58) {//bharath redy added
            var allcount = 0;
            for (var i = 0; i < $scope.clinicDoctorList.length; i++) {
                if ($scope.clinicDoctorList[i].FullName === 'All Doctors') {
                    allcount++;
                    if (allcount > 1) {
                        $scope.clinicDoctorList.splice(i, 1);
                    }
                }
            }
            angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                if (item.ClinicName !== 'All Hospitals') {
                    if (item.ExtDetails.HospitalID === $scope.hospid) {
                        $scope.AppListselectedclinic = item;
                        $scope.loadDoctor(item, true, 'list');
                        eHnoteMasterDataService.addSelectedHospitalinAppList(item);
                    }
                }
            });
        }
        if (doctorInfo.RoleID === 10) {
            angular.forEach($scope.clinicOptometristsList, function (item, index) {
                if (item.DoctorID === $scope.SelectedOptometristId) {
                    $scope.selectedOptometrist = item;
                }
            });
        }
        if (doctorInfo.RoleID === 61) {
            angular.forEach($scope.clinicARAssistantList, function (item, index) {
                if (item.DoctorID === $scope.SelectedArId) {
                    $scope.selectedArObject = item;
                }
            });
        }
    }
    function loadAppointmentforDoc(selectedDr) {

        $scope.selectedDoctor = selectedDr;
        var docid = $scope.selectedDoctor.DoctorID;
        if (!$scope.HospitalChange) {
            var UserBranchId = 0;
            if (selectedDr && selectedDr.DoctorID !== null) {
                $scope.selectedDoctor = selectedDr;
                $scope.selectedDocCSSid = selectedDr.DoctorID;
            }
            var consultdate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
            var daycode = $filter('date')($scope.referredappointmentdate, "EEE").toUpperCase();
            var hospitalID = "";


            if ($scope.AppListselectedclinic !== undefined && $scope.AppListselectedclinic.ClinicName !== "All Locations") {

                var hospitalID = $scope.AppListselectedclinic.ExtDetails.HospitalID;

                if ($scope.selectedDoctor !== undefined && $scope.selectedDoctor.UserBranchId !== undefined) {
                    UserBranchId = $scope.selectedDoctor.UserBranchId;
                    onchageselectappoint = $scope.selectedDoctor.UserBranchId;
                }

            } else {

                //Get all Hospital Ids
                var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
                hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
            }


            if (UserBranchId === 0) {
                var params = {
                    "UserBranchId": UserBranchId,
                    "HospitalID": hospitalID,
                    "DoctorID": docid,
                    "ConsultationDt": consultdate,
                    "ShowDueAmount": "Y",
                    "PageSize": $scope.Pagination.Patientitemsperpage,
                    "PageNumber": $scope.Pagination.currentPagePatient,
                    "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
                    "SearchPatientId": $scope.searchPatientIdTxt ? $scope.searchPatientIdTxt : "",
                    "OldPatientMRNO": $scope.searchOldPatientMRNO ? $scope.searchOldPatientMRNO : "",
                    "RoleId": $scope.userLoginDetails.RoleID,
                    "SortType": $scope.SortType,
                    "SortBy": $scope.SortBy,
                    'UserId': eHnoteMasterDataService.getLoginId(),
                    "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot
                };
                var list1 = [];
                angular.forEach($scope.AppointmentStatusFilterArray, function (items) {
                    if (items.isChecked) {
                        list1.push(items.Id);
                    }
                });
                var list2 = [];
                angular.forEach($scope.AppointmentVisitFilterArray, function (mitems) {
                    if (mitems.isChecked) {
                        list2.push(mitems.Id);
                    }
                });
                var list3 = [];
                angular.forEach($scope.appointmentTypes, function (mitems) {
                    if (mitems.isChecked) {
                        list3.push(mitems.Id);
                    }
                });
                var list4 = [];
                angular.forEach($scope.Visitreasons, function (mitems) {
                    if (mitems.isChecked) {
                        list4.push(mitems.ReasonId);
                    }
                });
                params.AppointmentStatusIDLst = list1;
                params.AppointmentStatusIDLst = params.AppointmentStatusIDLst ? JSON.stringify(params.AppointmentStatusIDLst) : "";
                params.GetAllAppointmentStatusInd = $scope.AllAppointmentStatusCheck;
                params.VisitStatusIDLst = list2;
                params.VisitStatusIDLst = params.VisitStatusIDLst ? JSON.stringify(params.VisitStatusIDLst) : "";
                params.GetAllVisitStatusInd = $scope.AllAppointmentVisitStatusCheck;
                params.AppointmentTypeStatusIDList = list3;
                params.GetAllAppointmentTypeStatusInd = $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck;
                params.AppointmentTypeStatusIDList = params.AppointmentTypeStatusIDList ? JSON.stringify(params.AppointmentTypeStatusIDList) : "";
                params.VisitReasonIdList = list4;
                params.VisitReasonIdList = params.VisitReasonIdList ? JSON.stringify(params.VisitReasonIdList) : "";


                eHnoteMainAppointmentService.GetAllBookedAppointmentforAllDoctors(params, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
            } else {
                $scope.referredshowloading = true;
                var param = {
                    "UserBranchId": (UserBranchId || $scope.AppListselectedclinic.UserBranchId),
                    "DoctorID": docid,
                    "ConsultationDt": consultdate,
                    "ShowDueAmount": "Y",
                    "HospitalID": hospitalID,
                    "PageSize": $scope.Pagination.Patientitemsperpage,
                    "PageNumber": $scope.Pagination.currentPagePatient,
                    "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
                    "SearchPatientId": $scope.searchPatientIdTxt ? $scope.searchPatientIdTxt : "",
                    "OldPatientMRNO": $scope.searchOldPatientMRNO ? $scope.searchOldPatientMRNO : "",
                    "RoleId": $scope.userLoginDetails.RoleID,
                    "SortType": $scope.SortType,
                    "SortBy": $scope.SortBy,
                    'UserId': eHnoteMasterDataService.getLoginId(),
                    "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot
                };


                var list1 = [];
                angular.forEach($scope.AppointmentStatusFilterArray, function (items) {
                    if (items.isChecked) {
                        list1.push(items.Id);
                    }
                });
                var list2 = [];
                angular.forEach($scope.AppointmentVisitFilterArray, function (mitems) {
                    if (mitems.isChecked) {
                        list2.push(mitems.Id);
                    }
                });
                var list3 = [];
                angular.forEach($scope.appointmentTypes, function (mitems) {
                    if (mitems.isChecked) {
                        list3.push(mitems.Id);
                    }
                });
                var list4 = [];
                angular.forEach($scope.Visitreasons, function (mitems) {
                    if (mitems.isChecked) {
                        list4.push(mitems.ReasonId);
                    }
                });
                param.AppointmentStatusIDLst = list1;
                param.GetAllAppointmentStatusInd = $scope.AllAppointmentStatusCheck;
                param.AppointmentStatusIDLst = param.AppointmentStatusIDLst ? JSON.stringify(param.AppointmentStatusIDLst) : "";
                param.VisitStatusIDLst = list2;
                param.GetAllVisitStatusInd = $scope.AllAppointmentVisitStatusCheck;
                param.VisitStatusIDLst = param.VisitStatusIDLst ? JSON.stringify(param.VisitStatusIDLst) : "";
                param.AppointmentTypeStatusIDList = list3;
                param.GetAllAppointmentTypeStatusInd = $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck;
                param.AppointmentTypeStatusIDList = param.AppointmentTypeStatusIDList ? JSON.stringify(param.AppointmentTypeStatusIDList) : "";
                params.VisitReasonIdList = list4;
                params.VisitReasonIdList = params.VisitReasonIdList ? JSON.stringify(params.VisitReasonIdList) : "";


                eHnoteMainAppointmentService.GetAllBookedAppointmentUsingAddressID(param, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
            }
        }
    }
    $scope.DayChangeAddressID = function () {
        var Daychageselectappoint = parseInt($scope.Dayselectedclinic.UserBranchId);
        eHnoteMasterDataService.addDocAddressIdInfo(Daychageselectappoint);
        onchageselectappoint = Daychageselectappoint;
        if ($scope.Dayselectedclinic.ExtDetails !== undefined && $scope.Dayselectedclinic.ExtDetails.MinPerCase !== undefined) {
            avgConsultationTime = $scope.Dayselectedclinic.ExtDetails.MinPerCase;
        } else {
            avgConsultationTime = 15;
        }
        if ($scope.SelectedAppointmentDr !== undefined) {
            $scope.SelectedAppointmentDr.UserBranchId = onchageselectappoint;
        }
        if (onchageselectappoint > 0) {
            if ($scope.calendarView === 'day') {
                $scope.loadDayView(eHnoteMasterDataService.getSelectedAppointDt(), $scope.SelectedAppointmentDr);
            } else if ($scope.calendarView === 'week') {
                loadWeekView();
            } else if ($scope.calendarView === 'month') {
                loadMonthView();
            }
        }
    };
    $scope.GetReferredAppointmentByDoctorID = function (selectedDr) {
        var addressID = 0;
        var hospitalID = doctorInfo.hospitalID;
        if (selectedDr) {
            $scope.selectedDoctor = selectedDr;
        }
        var consultdate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        var daycode = $filter('date')($scope.referredappointmentdate, "EEE").toUpperCase();
        if ($scope.selectedDoctor !== undefined) {
            addressID = $scope.selectedDoctor.UserBranchId;
        }
        if (addressID === 0) {
            if ($scope.AppListselectedclinic !== undefined) {
                if (admin_status && $scope.AppListselectedclinic.HospitalID !== undefined) {
                    hospitalID = $scope.AppListselectedclinic.HospitalID;
                } else {
                    if ($scope.AppListselectedclinic.ExtDetails.HospitalID !== undefined) {
                        hospitalID = $scope.AppListselectedclinic.ExtDetails.HospitalID;
                    }
                }
            }
            eHnoteMainAppointmentService.GetAllBookedAppointmentforAllDoctors(hospitalID, consultdate, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        } else {
            $scope.referredshowloading = true;
            eHnoteMainAppointmentService.GetAllBookedAppointmentforAllDoctors(hospitalID, consultdate, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        }
    };
    $scope.loadAppointmentListView = function (val, blnValue, screen) {
        screen = screen || "";
        $scope.HospitalChange = blnValue;
        $scope.AppListselectedclinic = val;
        $scope.appScreen = screen;
        $scope.referredshowloading = true;
        var futuredate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        var daycode = $filter('date')(new Date($scope.referredappointmentdate), "EEE").toUpperCase();
        $scope.patDetails.length = 0;
        if ($scope.selectedDocCSSid === 0) {
            $scope.selectedDocCSSid = eHnoteMasterDataService.getLoginId();
        }
        if (($scope.selectedDoctor.DoctorID !== undefined && $scope.selectedDoctor.DoctorID !== 0) || ($scope.AppListselectedclinic.ExtDetails !== undefined && $scope.AppListselectedclinic.ExtDetails.HospitalID === undefined)) {
            eHnoteMainAppointmentService.GetAllBookedAppointmentUsingAddressID(0, daycode, ($scope.selectedDoctor.UserBranchId || $scope.AppListselectedclinic.UserBranchId), futuredate, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        } else {
            eHnoteMainAppointmentService.GetAllBookedAppointmentforAllDoctors($scope.AppListselectedclinic.ExtDetails.HospitalID, futuredate, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);
        }
        $scope.HospitalChange = false;
    };
    function GetDoctorAllAppointmentListByDate(daycode, addressID, consultdate) {
        $scope.referredshowloading = true;
        if ($scope.selectedDocCSSid === 0) {
            $scope.selectedDocCSSid = eHnoteMasterDataService.getLoginId();
        }
        eHnoteMainAppointmentService.GetAllBookedAppointment(daycode, addressID, consultdate, OnGetListofAppointmentSuccess, OnGetListofAppointmentError, 0);
    }
    $scope.getRandomColor = function () {
        var array_list = ['#af77c6', '#e4c120', '#69b3e7'];
        return 'background:' + array_list[Math.floor(Math.random() * array_list.length)];
    };

    $scope.StartAppointment = function (item) {
        item.Patient = [];
        item.PatientAddress = [];
        item.PatientPhone = [];
        item.Patient.push({
            "PatientID": item.PatientID,
            "FullName": item.PatientDetails.FullName,
            "DOB": item.PatientDetails.DOB,
            "Gender": item.PatientDetails.Gender,
            "EmailId": item.PatientDetails.EmailId
        });

        item.PatientDetails.PatientPhone = item.PatientDetails.PatientPhone || [];

        if (item.PatientDetails.PatientPhone.length !== 0) {
            item.PatientPhone.push({
                "PhNumber": item.PatientDetails.MobileNo
            });
        } else {
            item.PatientPhone.push({
                "PhNumber": ''
            });
        }
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.EmailId = item.EmailId ? item.EmailId : '';
        $scope.cacheStorageItem.doctorid = eHnoteMasterDataService.getLoginId();
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var PatientID = item.PatientID;
        var DoctorID = eHnoteMasterDataService.getDoctorId();
        $scope.preappbill = false;
        $scope.appointmentStatus = 'E';
        eHnotePatientDataService.getPatientAllBillingInfo(PatientID, DoctorID, 0, 0, $scope.appointmentStatus, callbackSuccessonAppointment, ErroronAppointment);
        function callbackSuccessonAppointment(data) {
            $scope.previousBillingData = data.rows.patientCaseBillingInfo;
            $scope.preappbill = true;
            eHnoteMasterDataService.fromappbill($scope.preappbill);
            eHnoteMasterDataService.addBillingInfo('');
            eHnoteMasterDataService.addBillingInfo(data);
        }
        function ErroronAppointment(err) {
            console.log(err);
        }
        eHnoteMasterDataService.addconsultType("NEW");
        eHnoteValidateUsersDataService.RemoveProcessingCookies();

        $location.url("/main");
    };
    $scope.CancelAppointmentPatient = function (item) {

        $scope.StartAutoRefreshAppointment();

        if (item.DoctorVisitRsnID === 8) {
            return;
        }
        if (item.CheckinStatusId === 1) {
            $scope.CancelAppointmentList(item);
        } else {
            alertify.error('Patient Already CheckedIn,You can not Cancel');
            return false;
        }
    };
    var phoneNumberString = "";
    $scope.DisplayNumber = "";
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

    $scope.Update = function (Cancelform, CancelReason, OtherCancelReason) {
        $scope.formatUSNumber();
        var currentdaycode = $filter("date")($scope.getCurrentDate(), "EEE").toUpperCase();

        var Cancelinfo = CancelReason === "Others" ? OtherCancelReason : CancelReason;
        Cancelinfo = Cancelinfo || "";
        if ($scope.CancelAppointmentobj.CancelReason === "Others") {
            if ($scope.CancelAppointmentobj.OtherCancelReason === '') {
                alertify.error('Please Enter Reason for Cancel');
                return false;
            }
        }
        if (Cancelinfo === '') {
            alertify.error('Please Select Reason For Cancellation');
            return false;
        }

        $scope.cancelAppPopup = true;
        var CurrentCheckOutTime = $filter("date")(new Date(), "HH:mm:ss");
        var AppmntParams = {
            "AppointmentID": $scope.Cancelappointmentinfo.AppointmentID,
            "AppointmentStatus": "C",
            "StartTime": $scope.CancelStTime,
            "EndTime": $scope.CancelEdTime,
            "IsFollowUp": false,
            "DoctorID": $scope.Canceldoctorid,
            "UserBranchId": doctorInfo.doctordata.UserAddress[0].UserBranchId,
            "DayCD": currentdaycode,
            "VisitUserTypeID": "OPATIENT",
            "OtherVisitRsn": "",
            "ConsultationDt": $scope.CanceltmpConsultationDt,
            "PatientID": $scope.Cancelappointmentinfo.PatientID,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "USRType": "DOCTOR",
            "DoctorVisitRsnID": $scope.CancelVisitRsnType,
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
                "CommunicationEmailId": $scope.selectedDoctor.CommunicationEmailId,
                "CommunicationMobileNo": $scope.DocCommunicationPhnumber || "",
                "DisplayNumber": $scope.DisplayNumber,
            },
            "PreviousAppointmentTime": "",
            "SendDocSms": $scope.CancelAppointmentobj.sendDocSms,
            "SendDocEmail": $scope.CancelAppointmentobj.sendDocEmail,
            "SendPatientEmail": $scope.CancelAppointmentobj.sendPatientEmail,
            "SendPatientSms": $scope.CancelAppointmentobj.sendPatientSms,
            "StatusDescription": Cancelinfo,
            "PaidFollowup": false,
            "IsTeleMedicineSlot": $scope.IsTeleMedicineSlot,
            "SubSpecializationId": $scope.Cancelappointmentinfo.SubSpecializationId,
            "BranchSubSpecializationId": $scope.Cancelappointmentinfo.BranchSubSpecializationId,
            "CurrentTime": CurrentCheckOutTime || null,
            "IsCheckedIn": $scope.Cancel_CheckInstatus || 1,
            "VisitTypeId": $scope.Cancel_VisitTypeId || null,
            "AppointmentPatientTypeId": $scope.Cancelappointmentinfo.AppointmentPatientTypeId || 1,
            /*"CancelReasonId": CancelReason.CancelVisitReasonId*/
            "CancelReasonId": CancelReason,
            "PatientSmsLanguageId": 152,
            "ParentAppointmentVisitReasonId": $scope.Cancel_VisitTypeId || null
        };

        eHnoteUserAppointmentDataService.AddUpdateAppointmentService(AppmntParams, OnAddApointmentSuccess, OnCaseSaveError);
        function OnAddApointmentSuccess(data) {
            alertify.success("Appointment Cancelled Successfully");

            $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
            $scope.cancelAppPopup = false;
            $scope.CancelAppointmentobj.Ispopup = false;
            $scope.showEditAppointmentID = true;
            $scope.sendDocSms = false;
            $scope.sendDocEmail = false;
            $scope.sendPatientSms = false;
            $scope.sendPatientEmail = false;

            $scope.CancelAppointmentobj.sendDocSms = false;
            $scope.CancelAppointmentobj.sendPatientSms = false;
            $scope.CancelAppointmentobj.sendDocEmail = false;
            $scope.CancelAppointmentobj.sendPatientEmail = false;

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

            $scope.clearEventSelectedSlots();
        }
        function OnCaseSaveError(data) {
            alertify.error("Error in Cancelling Appointment");
        }
    };
    $scope.closeCancelPopup = function () {
        $scope.cancelAppPopup = false;
        $scope.CancelAppointmentobj.Ispopup = false;
    };
    $scope.CancelAppointmentList = function (item) {


        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Patientname = item.PatientDetails.FullName;
        $scope.EmailId = item.PatientDetails.EmailId;
        $scope.DoctorFullName = item.DoctorFullName;
        $scope.DoctorEmail = item.DoctorEmail;
        $scope.appDate = item.ConsultationDt;
        $scope.TIME = item.StartTime;
        $scope.TokenNumber = item.TokenNumber;
        //$scope.MobileNumber = item.PatientDetails.PhCntryCD + "" + item.PatientDetails.MobileNo;
        $scope.MobileNumber = item.PatientDetails.MobileNo;
        $scope.DocPHnumber = item.CountryCode + "" + item.DoctorMobile;
        $scope.HospitalId = item.HospitalId;
        $scope.cancelAppPopup = true;
        $window.scrollTo(0, angular.element(document.getElementById('cancelAppModal')).offsetTop);
        $scope.Cancelappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Cancelappointmentinfo.AppointmentID = item.AppointmentID;
        $scope.Cancelappointmentinfo.PatientID = item.PatientID;
        $scope.Cancelappointmentinfo.PatientDetails = item.PatientDetails;
        $scope.Canceldoctorid = item.DoctorID;
        $scope.CancelStTime = item.StartTime;
        $scope.CancelEdTime = item.EndTime;
        $scope.CanceltmpConsultationDt = item.ConsultationDt; // $filter('date')(new Date(item.ConsultationDt), "yyyy-MM-dd");
        $scope.currentshowloading = true;
        $scope.CancelVisitRsnType = item.DoctorVisitRsnID;
        $scope.IsTeleMedicineSlot = item.IsTeleMedicineSlot;
        $scope.CommunicationEmailId = item.CommunicationEmailId || "";
        $scope.DocCommunicationPhnumber = item.CommunicationMobileNo;
        $scope.Cancelappointmentinfo.BranchSubSpecializationId = item.BranchSubSpecializationId;
        $scope.Cancelappointmentinfo.SubSpecializationId = item.SubSpecializationId;
        $scope.Cancelappointmentinfo.AppointmentPatientTypeId = item.AppointmentPatientTypeId;

        $scope.CancelAppointmentobj.Ispopup = true;
        $scope.CancelAppointmentobj.sendDocSms = false;
        $scope.CancelAppointmentobj.sendPatientSms = false;
        $scope.CancelAppointmentobj.sendDocEmail = false;
        $scope.CancelAppointmentobj.sendPatientEmail = false;
        $scope.CancelAppointmentobj.sendPatientSms = item.PatientDetails.IsPatientSmsInd || false;
        $scope.CancelAppointmentobj.sendPatientEmail = item.PatientDetails.IsPatientEmailInd || false;
        $scope.CancelAppointmentobj.CancelReason = "";
        $scope.CancelAppointmentobj.OtherCancelReason = "";
        $scope.Cancel_CheckInstatus = item.CheckinStatusId || 1;
        $scope.Cancel_VisitTypeId = item.VisitTypeId || null;

        $scope.CancelAppointmentobj.Patient_FullName = item.PatientDetails.FullName;
        var datetime = item.ConsultationDt + "T" + item.StartTime;
        $scope.CancelAppointmentobj.AppointmentDate_Time = datetime;
        $scope.CancelAppointmentobj.Doctor_Name = item.DoctorFullName;

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

            }
        });
    };
    $scope.CancelCalenderViewAppointmentList = function (item) {
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        item.start = item.AppointmentDetails.startTime;
        item.end = item.AppointmentDetails.endTime;
        //var NewStartDate = moment(item.start).local();
        //var NewStartTime = moment(item.start).local();
        //var NewEndTime = item.end === null ? moment(item.endDate).local() : moment(item.end).local();
        //if ($scope.isAllDay) {
        //    NewStartDate = moment(item.start).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).local();
        //    if (item.end !== null)
        //        NewEndTime = moment(item.end).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).local();
        //    NewStartTime = NewStartDate;
        //}
        //$scope.StartTimeHour = NewStartTime.format('HH');
        //$scope.StartTimeMin = NewStartTime.format('mm');
        //if (NewEndTime.format('HH:mm') === "23:59") {
        //    $scope.EndTimeHour = "00";
        //    $scope.EndTimeMin = "00";
        //} else {
        //    $scope.EndTimeHour = NewEndTime.format('HH');
        //    $scope.EndTimeMin = NewEndTime.format('mm');
        //}
        $scope.Patientname = item.rowData.PatientInfo.fullName;
        $scope.EmailId = item.rowData.PatientInfo.EmailId;
        $scope.DoctorFullName = item.rowData.doctorName;
        $scope.DoctorEmail = item.rowData.doctorEmail;
        $scope.DocCommunicationPhnumber = item.AppointmentDetails.doctorInfo.CommunicationMobileNo;

        //$scope.appDate = item.rowData.consultationDate;
        $scope.appDate = $filter('date')(item.rowData.consultationDate, "yyyy-MM-dd")
        //if ($scope.StartTimeHour) {
        //    $scope.TIME = $scope.StartTimeHour + ":" + $scope.StartTimeMin;
        //    $scope.CancelStTime = $scope.StartTimeHour + ":" + $scope.StartTimeMin;
        //}
        //if ($scope.EndTimeHour) {
        //    $scope.CancelEdTime = $scope.EndTimeHour + ":" + $scope.EndTimeMin;
        //}
        $scope.TIME = item.start;
        $scope.CancelStTime = item.start;
        $scope.CancelEdTime = item.end;


        var DateTime = $scope.appDate + "T" + $scope.TIME;
        $scope.AppointmentDate_Time = DateTime;

        $scope.TokenNumber = item.token;
        if (item.rowData.PatientInfo.MobileNo === undefined) {
            $scope.MobileNumber = "";
        } else {
            //$scope.MobileNumber = item.rowData.PatientInfo.CountryCode + "" + item.rowData.PatientInfo.MobileNo;
            $scope.MobileNumber = item.rowData.PatientInfo.MobileNo;
        }
        $scope.DocPHnumber = item.rowData.docCountrycode + "" + item.rowData.docMobile;
        $scope.HospitalId = item.rowData.hospitalId;
        $scope.cancelAppPopup = true;
        $window.scrollTo(0, angular.element(document.getElementById('cancelAppModal')).offsetTop);
        $scope.Cancelappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.Cancelappointmentinfo.AppointmentID = item.rowData.PatientInfo.appointmentID;
        $scope.Cancelappointmentinfo.PatientID = item.rowData.PatientInfo.patientID;
        $scope.Canceldoctorid = item.rowData.doctorId;
        $scope.CanceltmpConsultationDt = item.rowData.consultationDate; // $filter('date')(new Date(item.rowData.consultationDate), "yyyy-MM-dd");
        $scope.currentshowloading = true;

        $scope.CancelAppointmentobj.sendDocSms = false;
        $scope.CancelAppointmentobj.sendPatientSms = false;
        $scope.CancelAppointmentobj.sendDocEmail = false;
        $scope.CancelAppointmentobj.sendPatientEmail = false;
        $scope.CancelAppointmentobj.sendPatientSms = item.rowData.PatientInfo.IsPatientSmsInd || false;
        $scope.CancelAppointmentobj.sendPatientEmail = item.rowData.PatientInfo.IsPatientEmailInd || false;
        $scope.CancelAppointmentobj.CancelReason = "";
        $scope.CancelAppointmentobj.OtherCancelReason = "";
        $scope.Cancel_CheckInstatus = item.CheckinStatusId || 1;
        $scope.Cancel_VisitTypeId = item.AppointmentDetails.VisitTypeId || null;
        $scope.Cancelappointmentinfo.BranchSubSpecializationId = item.AppointmentDetails.BranchSubSpecializationId || 0;
        $scope.Cancelappointmentinfo.SubSpecializationId = item.AppointmentDetails.SubSpecializationId;
        $scope.Cancelappointmentinfo.AppointmentPatientTypeId = item.AppointmentDetails.AppointmentPatientTypeId;

        $scope.CancelVisitRsnType = item.rowData.doctorVisitRsnId;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var getParams = {
            //  "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            "PageSize": 100,
            "PageNumber": 1
            //"ReasonTypeId": 2
        };
        $scope.CancelAppointmentobj.CancelAppReason = [];
        return eHnotePatientVisitReasonServices.getOrganizationCancelVisitReasons(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                //$scope.CancelAppointmentobj.CancelAppReason = resp.data.rows || [];
                $scope.CancelAppointmentobj.CancelAppReason = $filter("filter")(resp.data.rows, { "ActiveInd": "Y" }, true);
                //var obj = {
                //    "ReasonId": 1,
                //    "CancelReason": "Others"
                //};
                //$scope.CancelAppointmentobj.CancelAppReason.push(obj);
            }
        });
    };
    $scope.showManageList = function () {
        setCalenderViewVisibility(false);
    };
    $scope.showAppointmentList = function () {
        setCalenderViewVisibility(false);
        $scope.noData = "";
        eHnoteMasterDataService.addSelectedAppointDt($scope.getCurrentDate());
        $scope.appointmentlistID = false;
        $scope.appointaddressId = false;
        $scope.appointmentlistID = true;
        $scope.showEditAppointmentID = true;
        $scope.vitalsID = false;
        $scope.showDayID = false;
        $scope.showWeekID = false;
        $scope.loadAppointments($scope.selectedDoctor, '');
    };
    var cleanCallAppointmentList = $rootScope.$on("CallAppointmentList", function (event) {
        if ($scope.allDoctors === null) {
            $scope.loadAppointments($scope.selectedDoctor, '');
        }
    });
    $scope.$on("$destroy", function () {
        cleanCallAppointmentList();
    });
    $scope.StartAppointmentEntry = function (item) {
        if (item.DoctorVisitRsnID === 8) {
            return;
        }
        eHnoteMasterDataService.addpatientData(item.PatientDetails);

        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;


        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.cacheStorageItem.ApptDate = item.ConsultationDt;
        $scope.cacheStorageItem.ApptStartTime = item.StartTime;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.VisitReason = item.VisitReason;
        $scope.cacheStorageItem.doctorid = item.DoctorID;
        $scope.cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId;
        $scope.cacheStorageItem.EmailID = item.PatientDetails.EmailId ? item.PatientDetails.EmailId : "";

        $scope.cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD;
        $scope.cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo;


        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.DoctorSpecializationId = item.DoctorSpecializationId || 0;
        eHnoteMasterDataService.addAppointmentInfo(item);
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        if ($scope.SpecializationId === 2 || $scope.DoctorSpecializationId === 2) {//Dentist
            $location.url("/DentalPast");
        } else {
            // $location.url("/Pastvisit");
            $location.url("/PastVisitList");
        }



    };
    $scope.consultationEntry = function (item) {
        $scope.cacheStorageItem.IsEasyMode = true;
        $scope.cacheStorageItem.IsNormalMode = false;
        $scope.cacheStorageItem.IsInvestigationMode = false;
        eHnoteMasterDataService.IsClickFromStartConsultation(true);
        if (datapersistanceFactory.getItem("myPatientsSet").length !== 0) {
            datapersistanceFactory.remove("myPatientsSet");
        }
        item.Patient = [];
        item.PatientAddress = [];
        item.PatientPhone = [];
        item.Patient.push({
            "PatientID": item.PatientID,
            "FullName": item.PatientDetails.FullName,
            "DOB": item.PatientDetails.DOB,
            "Gender": item.PatientDetails.Gender,
            "EmailId": item.PatientDetails.EmailId
        });

        item.PatientDetails.PatientPhone = item.PatientDetails.PatientPhone || [];

        if (item.PatientDetails.PatientPhone.length !== 0) {
            item.PatientPhone.push({
                "PhNumber": item.PatientDetails.MobileNo
            });
        } else {
            item.PatientPhone.push({
                "PhNumber": ''
            });
        }
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.VisitReason = item.VisitReason;
        $scope.cacheStorageItem.doctorid = item.DoctorID;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        eHnoteValidateUsersDataService.RemoveProcessingCookies();
        eHnoteMasterDataService.addAppointmentInfo(item);
        timeout(function () {

            $location.url("/NewOpthaConsultation");
        }, 500);
    };
    $scope.navtoCaseHistory = function (item) {
        $scope.StartAutoRefreshAppointment();
        $scope.StartAppointmentEntry(item);
    };

    $scope.CelanderProfileSampleClick = function (item) {
        item.PatientDetails = angular.copy(item.patientInfo);
        item.AppointmentID = angular.copy(item.appointmentID);
        item.PatientID = angular.copy(item.PatientDetails.patientID);
        item.MasterPatientId = angular.copy(item.PatientDetails.MasterPatientId);
        $scope.ClickPatientProfile(item);
    };

    $scope.ClickPatientProfile = function (item) {
        eHnoteMasterDataService.addPatientDetailsforBarcode(item);
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        item.AppointmentId = item.AppointmentID || 0;
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;

        var consultdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");
        var hospitalID = 0;

        if ($scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            hospitalID = $scope.AppListselectedclinic.ClinicId;
        }


        $scope.cacheStorageItem.patientid = item.PatientID;
        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        /*$scope.cacheStorageItem.PatientID = item.PatientID;*/
        $scope.cacheStorageItem.PatientID = item.PatientDetails.PatientID;
        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.SelectedAppointmentId = item.AppointmentID;
        $scope.cacheStorageItem.AppointmentId = item.AppointmentID;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        if ($scope.AllDoctorList != undefined) {
            $scope.cacheStorageItem.AllDoctorsList = $scope.AllDoctorList || [];
        }

        //var obj = {
        //    "HospitalId": hospitalID,
        //    "SearchText": "",
        //    "UserBranchId": $scope.selectedDoctor.UserBranchId,
        //    "DoctorId": $scope.selectedDoctor.DoctorID,
        //    "IsTeleMedicineSlot": false,
        //    "AppointmentDate": consultdate
        //}
        //eHnoteMainAppointmentService.GetAllAppointmentsByDoctorId(obj).then(function (response) {
        //    if (response.data !== undefined) {
        //        if (response.data.AppointmentList !== undefined) {
        //            $scope.cacheStorageItem.CurrentDateAppointmentList = response.data.AppointmentList || [];
        //            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        //            $location.url("/profile");
        //        }
        //    }
        //});
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        var obj = {
            "FromDate": $scope.SearchObj.FromDate,
            "ToDate": $scope.SearchObj.ToDate,
            "AppointmentDate": $scope.SearchObj.ConsultationDt,
            "Screen": $scope.SearchObj.Screen,
            "BacktoProfile": $scope.mainAppointmentView.isCalendarorList || ""
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);

        $location.url("/profile");

    };


    $scope.navtoNewConsultation = function (item) {
        $scope.cacheStorageItem.patientid = item.PatientID;
        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        eHnoteMasterDataService.addpatientData(item.PatientDetails);

        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        eHnoteMasterDataService.addAppointmentInfo(item);

        if ($scope.SpecializationId === 2 || $scope.DoctorSpecializationId === 2) {//Dentist
            $location.url("/NewOpthaConsultation");
        } else {
            $location.url("/NewOpthaConsultation");
        }

    }


    $scope.NavToStartInvestigation = function (row) {
        row.PatientId = row.PatientID || "";
        eHnoteMasterDataService.addInvestigationPatientId(row);
        $location.path("/Investigation");
    }

    $scope.PreStartDirectConsultation = function (item, type) {
        $scope.IsPatientChecked = true;
        if ($scope.IsDynamicCheckInMandatory === true) {
            var params = {
                "AppointmentId": item.AppointmentID || 0,
            };
            eHnoteMainAppointmentService.GetLatestDynamicStatusRoomById(params).then(function (resp) {
                if (resp.data.Status === 'Success') {

                    if (resp.data.rows.length !== 0) {
                        var DynamicStatusarray = resp.data.rows[0];
                        $scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                        $scope.cacheStorageItem.RoomId = DynamicStatusarray.RoomId || 0;
                        $scope.cacheStorageItem.PreviousCounterId = DynamicStatusarray.PreviousCounterId || 0;
                        $scope.cacheStorageItem.NextCounterId = DynamicStatusarray.NextCounterId || 0;
                        $scope.cacheStorageItem.PatientID = DynamicStatusarray.PatientId || 0;
                        $scope.cacheStorageItem.patientStatus = DynamicStatusarray.Status || "";
                        $scope.cacheStorageItem.AssignedUserId = DynamicStatusarray.AssignedUserId || 0;

                        if ($scope.cacheStorageItem.patientStatus === 'Waiting' && ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 3 || $scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 16 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57)) {
                            $scope.Time = $filter("date")(new Date(), "HH:mm");
                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "PatientId": $scope.cacheStorageItem.PatientID,
                                "AppointmentId": item.AppointmentID,
                                "RoomId": $scope.cacheStorageItem.RoomId,
                                "RoomTypeId": 1,
                                "NextCounterId": $scope.cacheStorageItem.RoomTypeId,
                                "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                                "StartTime": $scope.Time,
                                "PatientDynamicStatusId": 0,
                                "Status": "Active",
                                "DoctorId": item.DoctorID || null,
                                "TechnicianId": null,
                                "OptomId": null,
                                "DilationAssistantId": null,
                                "CounsellorId": null,
                                "ARId": null,
                                "IsCheckedOut": 2,
                                "RoleId": $scope.userLoginDetails.RoleID
                            }

                            eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                            }, function (err) {
                                console.log(err);

                            });
                        }

                        else if ($scope.cacheStorageItem.patientStatus === 'Waiting' && ($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61)) {
                            $scope.Time = $filter("date")(new Date(), "HH:mm");
                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "PatientId": $scope.cacheStorageItem.PatientID,
                                "AppointmentId": item.AppointmentID,
                                "RoomId": $scope.cacheStorageItem.RoomId,
                                "RoomTypeId": $scope.cacheStorageItem.RoomTypeId,
                                "NextCounterId": $scope.cacheStorageItem.RoomTypeId,
                                "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                                "StartTime": $scope.Time,
                                "PatientDynamicStatusId": 0,
                                "Status": "Active",
                                "DoctorId": null,
                                "TechnicianId": null,
                                "OptomId": null,
                                "DilationAssistantId": null,
                                "CounsellorId": null,
                                "ARId": null,
                                "IsCheckedOut": 2,
                                "RoleId": $scope.userLoginDetails.RoleID

                            }
                            if ($scope.cacheStorageItem.RoomTypeId === 2) {
                                params.OptomId = $scope.cacheStorageItem.AssignedUserId;
                            }
                            if ($scope.cacheStorageItem.RoomTypeId === 8) {
                                params.ARId = $scope.cacheStorageItem.AssignedUserId;
                            }
                            eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                            }, function (err) {
                                console.log(err);

                            });
                        }
                    } else {
                        $scope.IsPatientChecked = true;
                        $scope.cacheStorageItem.patientStatus = "";
                    }

                }


            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }

        // };
        if (item.IsAlreadyConsultationStarted) {
            alertify.error("Already some one started consultation,refresh appointments");
            return;
        }

        if (item.IsPaymentPending) {
            alertify.error("Appointment not Confirmed,Payment is Pending From Patient.");
            return;
        }
        if ($scope.IsPatientChecked === false) {
            alertify.error("Please Check_in The Patient Before Start Consultation");
            return;
        }

        $scope.StartAutoRefreshAppointment();

        $rootScope.ShowPreConsultationTab = false;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        eHnoteProcedureDataService.GetParentAndChildAppointmentDetails(item.AppointmentID).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.cacheStorageItem.ChildAppointmentId = resp.data[0].ChildAppointmentId || 0;
                $scope.cacheStorageItem.ChildAppointmentDoctorName = resp.data[0].ChildAppointmentDoctorName || "";
                $scope.cacheStorageItem.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                $scope.cacheStorageItem.ParentAppointmentId = resp.data[0].ParentAppointmentId || 0;
                $scope.cacheStorageItem.RootAppointmentId = resp.data[0].RootAppointmentId || 0;
                $scope.cacheStorageItem.ParentAppointmentDoctorName = resp.data[0].ParentAppointmentDoctorName || "";

            }
            $scope.cacheStorageItem.DoctorVisitRsnID = item.DoctorVisitRsnID;

            if ($scope.IsPatientChecked === false && item.AppointmentStatus === 'B') {
                alertify.error("Please Check_in The Patient Before Start Consultation");
                return;
            } else {
                $scope.startDirectConsultation(item, type);
            }

        }, function (err) {
            console.log(err);
        });

    };
    $scope.PreStartDirectConsultation1 = function (item, type) {
        $scope.IsPatientChecked = true;
        if ($scope.IsDynamicCheckInMandatory === true) {
            var params = {
                "AppointmentId": item.AppointmentID || 0,
            };
            eHnoteMainAppointmentService.GetLatestDynamicStatusRoomById(params).then(function (resp) {
                if (resp.data.Status === 'Success') {

                    if (resp.data.rows.length !== 0) {
                        var DynamicStatusarray = resp.data.rows[0];
                        $scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                        $scope.cacheStorageItem.RoomId = DynamicStatusarray.RoomId || 0;
                        $scope.cacheStorageItem.PreviousCounterId = DynamicStatusarray.PreviousCounterId || 0;
                        $scope.cacheStorageItem.NextCounterId = DynamicStatusarray.NextCounterId || 0;
                        $scope.cacheStorageItem.PatientID = DynamicStatusarray.PatientId || 0;
                        $scope.cacheStorageItem.patientStatus = DynamicStatusarray.Status || "";
                        $scope.cacheStorageItem.AssignedUserId = DynamicStatusarray.AssignedUserId || 0;

                        if ($scope.cacheStorageItem.patientStatus === 'Waiting' && ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 3 || $scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 16 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57)) {
                            $scope.Time = $filter("date")(new Date(), "HH:mm");
                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "PatientId": $scope.cacheStorageItem.PatientID,
                                "AppointmentId": item.AppointmentID,
                                "RoomId": $scope.cacheStorageItem.RoomId,
                                "RoomTypeId": 1,
                                "NextCounterId": $scope.cacheStorageItem.RoomTypeId,
                                "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                                "StartTime": $scope.Time,
                                "PatientDynamicStatusId": 0,
                                "Status": "Active",
                                "DoctorId": item.DoctorID || null,
                                "TechnicianId": null,
                                "OptomId": null,
                                "DilationAssistantId": null,
                                "CounsellorId": null,
                                "ARId": null,
                                "IsCheckedOut": 2,
                                "RoleId": $scope.userLoginDetails.RoleID
                            }

                            eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                            }, function (err) {
                                console.log(err);

                            });
                        }

                        else if ($scope.cacheStorageItem.patientStatus === 'Waiting' && ($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61)) {
                            $scope.Time = $filter("date")(new Date(), "HH:mm");
                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "PatientId": $scope.cacheStorageItem.PatientID,
                                "AppointmentId": item.AppointmentID,
                                "RoomId": $scope.cacheStorageItem.RoomId,
                                "RoomTypeId": $scope.cacheStorageItem.RoomTypeId,
                                "NextCounterId": $scope.cacheStorageItem.RoomTypeId,
                                "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                                "StartTime": $scope.Time,
                                "PatientDynamicStatusId": 0,
                                "Status": "Active",
                                "DoctorId": null,
                                "TechnicianId": null,
                                "OptomId": null,
                                "DilationAssistantId": null,
                                "CounsellorId": null,
                                "ARId": null,
                                "IsCheckedOut": 2,
                                "RoleId": $scope.userLoginDetails.RoleID
                            }
                            if ($scope.cacheStorageItem.RoomTypeId === 2) {
                                params.OptomId = $scope.cacheStorageItem.AssignedUserId;
                            }
                            if ($scope.cacheStorageItem.RoomTypeId === 8) {
                                params.ARId = $scope.cacheStorageItem.AssignedUserId;
                            }
                            eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                            }, function (err) {
                                console.log(err);

                            });
                        }
                    } else {
                        $scope.IsPatientChecked = true;
                        $scope.cacheStorageItem.patientStatus = "";
                    }

                }


            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }

        // };
        if (item.IsAlreadyConsultationStarted) {
            alertify.error("Already some one started consultation,refresh appointments");
            return;
        }

        if (item.IsPaymentPending) {
            alertify.error("Appointment not Confirmed,Payment is Pending From Patient.");
            return;
        }
        if ($scope.IsPatientChecked === false) {
            alertify.error("Please Check_in The Patient Before Start Consultation");
            return;
        }

        $scope.StartAutoRefreshAppointment();

        $rootScope.ShowPreConsultationTab = false;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        eHnoteProcedureDataService.GetParentAndChildAppointmentDetails(item.AppointmentID).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.cacheStorageItem.ChildAppointmentId = resp.data[0].ChildAppointmentId || 0;
                $scope.cacheStorageItem.ChildAppointmentDoctorName = resp.data[0].ChildAppointmentDoctorName || "";
                $scope.cacheStorageItem.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                $scope.cacheStorageItem.ParentAppointmentId = resp.data[0].ParentAppointmentId || 0;
                $scope.cacheStorageItem.RootAppointmentId = resp.data[0].RootAppointmentId || 0;
                $scope.cacheStorageItem.ParentAppointmentDoctorName = resp.data[0].ParentAppointmentDoctorName || "";

            }
            $scope.cacheStorageItem.DoctorVisitRsnID = item.DoctorVisitRsnID;

            if ($scope.IsPatientChecked === false && item.AppointmentStatus === 'B') {
                alertify.error("Please Check_in The Patient Before Start Consultation");
                return;
            } else {
                $scope.startDirectConsultation1(item, type);
            }

        }, function (err) {
            console.log(err);
        });

    };

    $scope.startDirectConsultation = function (item, type) {
        if (type === "Receptionist" || $scope.userLoginDetails.RoleID === 2 || $scope.userLoginDetails.RoleID === 11 || $scope.userLoginDetails.RoleID === 58) {
            $scope.cacheStorageItem.UserLoginType = "Receptionist";
            $scope.cacheStorageItem.IsLoginInd = true;
        } else {
            $scope.cacheStorageItem.UserLoginType = "";
            $scope.cacheStorageItem.IsLoginInd = false;
        }
        generatePatientNotes(item.PatientID, item);
    };

    $scope.startDirectConsultation1 = function (item, type) {
        if (type === "Receptionist" || $scope.userLoginDetails.RoleID === 2 || $scope.userLoginDetails.RoleID === 11 || $scope.userLoginDetails.RoleID === 58) {
            $scope.cacheStorageItem.UserLoginType = "Receptionist";
            $scope.cacheStorageItem.IsLoginInd = true;
        } else {
            $scope.cacheStorageItem.UserLoginType = "";
            $scope.cacheStorageItem.IsLoginInd = false;
        }
        generatePatientNotes1(item.PatientID, item);
    };


    function loadConsultationData(item) {

        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.AssessmentPlan = [];
        $scope.cacheStorageItem.OrderDetails = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.PlanOfCareComments = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.FileUploadPDfArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.TreatmentPlanId = 0;
        $scope.cacheStorageItem.PatientPreRequisiteId = 0;
        $scope.cacheStorageItem.SelectedConsultationType = "";

        $scope.cacheStorageItem.OptomComments = '';
        $scope.cacheStorageItem.DoctorComments = '';
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.LoadedTemplates = [];
        $scope.cacheStorageItem.SuperBillArray = [];

        $scope.cacheStorageItem.Checklist.MainArray.SkinArray = [];
        $scope.cacheStorageItem.Checklist.MainArray.HairArray = [];
        $scope.cacheStorageItem.InvGlasses = [];
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.ClinicalNotesComments = '';
        $scope.cacheStorageItem.PatientInstructionComments = '';
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.PostMydriaticTestArray = [];
        if (item.VisitReason) {

            var obj = {
                "ChiefComplaintName": item.VisitReason,
                "IsEdit": false,
                "ActiveInd": 'Y',
                "ChiefComplaintId": 0,
                "Duration": 0,
                "DurationType": 'D',
                "PatientChiefComplaintId": 0,
                "Remarks": "",
                "OrganId": 4,
                "OrganName": "General"
            };
            $scope.cacheStorageItem.ChiefComplaints.push(obj);
        }

        if (item.AppointmentStatus === "C") {
            $scope.cacheStorageItem.appointmentid = 0;
            $scope.cacheStorageItem.AppointmentDoctorID = 0;
        } else {
            $scope.cacheStorageItem.appointmentid = item.AppointmentID;
            $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        }
        $scope.cacheStorageItem.ApptDate = item.ConsultationDt;
        $scope.cacheStorageItem.ApptStartTime = item.StartTime;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.VisitReason = item.VisitReason;
        $scope.cacheStorageItem.doctorid = item.DoctorID;
        $scope.cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId;
        $scope.cacheStorageItem.EmailID = item.PatientDetails.EmailId ? item.PatientDetails.EmailId : "";
        $scope.cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD;
        $scope.cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo;

        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        var DocFreqItems = datapersistanceFactory.getItem("DoctorFrequenctItems");
        $scope.cacheStorageItem.UserFreqData = DocFreqItems;

        $scope.cacheStorageItem.SelectedConsultationType = "New";
        $scope.cacheStorageItem.masterChiefComplaintsArray = [];
        $scope.cacheStorageItem.masterClinicalNotesArray = [];
        $scope.cacheStorageItem.masterObservationsArray = [];
        $scope.cacheStorageItem.masterDiagnosisArray = [];
        $scope.cacheStorageItem.masterProceduresArray = [];
        $scope.cacheStorageItem.masterMedicinesArray = [];
        $scope.cacheStorageItem.masterLabTestArray = [];
        $scope.cacheStorageItem.masterInvestigationsArray = [];
        $scope.cacheStorageItem.masterInvCategoriesArray = [];
        $scope.cacheStorageItem.masterMedicineTemplatesArray = [];
        $scope.cacheStorageItem.masterPrescriptionFrequencies = [];
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.LabtestList = [];
        $scope.cacheStorageItem.ConsultationID = item.ConsultationId || 0;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.PatientPreRequisiteId = item.PatientPreRequisiteId;


        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();


        var object = {
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            "UserId": $scope.UserId,
            "ScreenType": "CrmReminderApptList"
        };
        eHnotePatientDataService.CheckConsultationStatus(object).then(function (resp) {
            if (item.ParentAppointmentId === 0) {
                if (resp.data.ConsultationId !== undefined) {
                    item.AppointmentStatus = resp.data.AppointmentStatus;
                    item.ConsultationId = resp.data.ConsultationId;
                    item.TreatmentPlanId = resp.data.TreatmentPlanId;
                    $scope.cacheStorageItem.AppointmentType = resp.data.AppointmentType;
                }
            } else {
                if (resp.data.ConsultationId !== undefined) {
                    item.AppointmentStatus = resp.data.AppointmentStatus;
                    item.ConsultationId = resp.data.ConsultationId;
                    $scope.cacheStorageItem.AppointmentType = resp.data.AppointmentType;
                }
            }
            item.PatientDetails.PatientDisplayId = item.PatientDetails.PatientDisplayId || "";
            if (item.PatientDetails.PatientDisplayId === "") {
                item.PatientDetails.PatientDisplayId = resp.data.PatientDisplayId;
                $scope.cacheStorageItem.PatientDisplayId = resp.data.PatientDisplayId;
            }


            eHnoteMasterDataService.addAppointmentInfo(item);
            if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
                continuetoVideoappointment(item);

            }
            else {
                continuetoappointment(item);
            }


        }, function (err) {
            if ($scope.VideoConsultation || $scope.Tab === 'teleappointments') {
                continuetoVideoappointment(item);
            }
            else {
                continuetoappointment(item);
            }

        });
    }

    function loadConsultationData1(item) {

        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.AssessmentPlan = [];
        $scope.cacheStorageItem.OrderDetails = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.PlanOfCareComments = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.FileUploadPDfArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.TreatmentPlanId = 0;
        $scope.cacheStorageItem.PatientPreRequisiteId = 0;
        $scope.cacheStorageItem.SelectedConsultationType = "";

        $scope.cacheStorageItem.OptomComments = '';
        $scope.cacheStorageItem.DoctorComments = '';
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.LoadedTemplates = [];
        $scope.cacheStorageItem.SuperBillArray = [];

        $scope.cacheStorageItem.Checklist.MainArray.SkinArray = [];
        $scope.cacheStorageItem.Checklist.MainArray.HairArray = [];
        $scope.cacheStorageItem.InvGlasses = [];
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.ClinicalNotesComments = '';
        $scope.cacheStorageItem.PatientInstructionComments = '';
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.PostMydriaticTestArray = [];
        if (item.VisitReason) {

            var obj = {
                "ChiefComplaintName": item.VisitReason,
                "IsEdit": false,
                "ActiveInd": 'Y',
                "ChiefComplaintId": 0,
                "Duration": 0,
                "DurationType": 'D',
                "PatientChiefComplaintId": 0,
                "Remarks": "",
                "OrganId": 4,
                "OrganName": "General"
            };
            $scope.cacheStorageItem.ChiefComplaints.push(obj);
        }

        if (item.AppointmentStatus === "C") {
            $scope.cacheStorageItem.appointmentid = 0;
            $scope.cacheStorageItem.AppointmentDoctorID = 0;
        } else {
            $scope.cacheStorageItem.appointmentid = item.AppointmentID;
            $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        }
        $scope.cacheStorageItem.ApptDate = item.ConsultationDt;
        $scope.cacheStorageItem.ApptStartTime = item.StartTime;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.VisitReason = item.VisitReason;
        $scope.cacheStorageItem.doctorid = item.DoctorID;
        $scope.cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId;
        $scope.cacheStorageItem.EmailID = item.PatientDetails.EmailId ? item.PatientDetails.EmailId : "";
        $scope.cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD;
        $scope.cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo;

        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        $scope.cacheStorageItem.PatientName = item.PatientDetails.FullName;
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        var DocFreqItems = datapersistanceFactory.getItem("DoctorFrequenctItems");
        $scope.cacheStorageItem.UserFreqData = DocFreqItems;

        $scope.cacheStorageItem.SelectedConsultationType = "New";
        $scope.cacheStorageItem.masterChiefComplaintsArray = [];
        $scope.cacheStorageItem.masterClinicalNotesArray = [];
        $scope.cacheStorageItem.masterObservationsArray = [];
        $scope.cacheStorageItem.masterDiagnosisArray = [];
        $scope.cacheStorageItem.masterProceduresArray = [];
        $scope.cacheStorageItem.masterMedicinesArray = [];
        $scope.cacheStorageItem.masterLabTestArray = [];
        $scope.cacheStorageItem.masterInvestigationsArray = [];
        $scope.cacheStorageItem.masterInvCategoriesArray = [];
        $scope.cacheStorageItem.masterMedicineTemplatesArray = [];
        $scope.cacheStorageItem.masterPrescriptionFrequencies = [];
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.LabtestList = [];
        $scope.cacheStorageItem.ConsultationID = item.ConsultationId || 0;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.PatientPreRequisiteId = item.PatientPreRequisiteId;



        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();


        var object = {
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            "UserId": $scope.UserId,
            "ScreenType": "CrmReminderApptList1"
        };
        eHnotePatientDataService.CheckConsultationStatus(object).then(function (resp) {
            if (item.ParentAppointmentId === 0) {
                if (resp.data.ConsultationId !== undefined) {
                    item.AppointmentStatus = resp.data.AppointmentStatus;
                    item.ConsultationId = resp.data.ConsultationId;
                    item.TreatmentPlanId = resp.data.TreatmentPlanId;
                    $scope.cacheStorageItem.AppointmentType = resp.data.AppointmentType;
                }
            } else {
                if (resp.data.ConsultationId !== undefined) {
                    item.AppointmentStatus = resp.data.AppointmentStatus;
                    item.ConsultationId = resp.data.ConsultationId;
                    $scope.cacheStorageItem.AppointmentType = resp.data.AppointmentType;
                }
            }
            item.PatientDetails.PatientDisplayId = item.PatientDetails.PatientDisplayId || "";
            if (item.PatientDetails.PatientDisplayId === "") {
                item.PatientDetails.PatientDisplayId = resp.data.PatientDisplayId;
                $scope.cacheStorageItem.PatientDisplayId = resp.data.PatientDisplayId;
            }


            eHnoteMasterDataService.addAppointmentInfo(item);
            if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
                continuetoVideoappointment(item);

            }
            else {
                continuetoappointment1(item);
            }


        }, function (err) {
            if ($scope.VideoConsultation || $scope.Tab === 'teleappointments') {
                continuetoVideoappointment(item);
            }
            else {
                continuetoappointment1(item);
            }

        });
    }
    function continuetoappointment(item) {
        $scope.DoctorSpecializationId = item.DoctorSpecializationId || 0;
        if ($scope.SpecializationId === 2 || item.DoctorSpecializationId === 2) {//Get Dental Case History
            if (item.ParentAppointmentId === 0) {
                if (item.AppointmentStatus === "E" || item.AppointmentStatus === "O") {
                    $scope.GetPatientDentalCaseHistorybyId(item);
                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                        continuetoStartConsultation();
                    }, function (err) {
                        console.log(err);
                    });

                }
            } else {
                if (item.AppointmentStatus === 'B') {
                    $scope.GetPatientDentalCaseHistorybyId(item);
                } else {
                    if (item.AppointmentStatus === "O" || item.AppointmentStatus === "E") {
                        $scope.GetPatientDentalCaseHistorybyId(item);
                    } else {
                        $q.all([
                            eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                            eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                        ]).then(function (res) {
                            if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                                $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                            }
                            if (res[1].data.ForumFiles.length > 0) {
                                $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                            }
                            if (res[1].data.PatientFiles.length > 0) {
                                $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                            }
                            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                            continuetoStartConsultation();
                        }, function (err) {
                            console.log(err);
                        });
                    }
                }
            }
        } else {//Get Opthalmology Case History
            if (item.ParentAppointmentId === 0) {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || (item.AppointmentStatus === "E") || (item.AppointmentStatus === "D")) {

                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentID);


                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartConsultation();
                    }, function (err) {
                        console.log(err);
                    });
                }
            } else {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || item.AppointmentStatus === "E" || item.AppointmentStatus === "D") {
                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentID);
                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartConsultation();
                    }, function (err) {
                        console.log(err);
                    });
                }
            }
        }
    }

    function continuetoappointment1(item) {
        $scope.DoctorSpecializationId = item.DoctorSpecializationId || 0;
        if ($scope.SpecializationId === 2 || item.DoctorSpecializationId === 2) {//Get Dental Case History
            if (item.ParentAppointmentId === 0) {
                if (item.AppointmentStatus === "E" || item.AppointmentStatus === "O") {
                    $scope.GetPatientDentalCaseHistorybyId(item);
                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                        continuetoStartConsultation1();
                    }, function (err) {
                        console.log(err);
                    });

                }
            } else {
                if (item.AppointmentStatus === 'B') {
                    $scope.GetPatientDentalCaseHistorybyId(item);
                } else {
                    if (item.AppointmentStatus === "O" || item.AppointmentStatus === "E") {
                        $scope.GetPatientDentalCaseHistorybyId(item);
                    } else {
                        $q.all([
                            eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                            eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                        ]).then(function (res) {
                            if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                                $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                            }
                            if (res[1].data.ForumFiles.length > 0) {
                                $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                            }
                            if (res[1].data.PatientFiles.length > 0) {
                                $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                            }
                            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                            continuetoStartConsultation1();
                        }, function (err) {
                            console.log(err);
                        });
                    }
                }
            }
        } else {//Get Opthalmology Case History
            if (item.ParentAppointmentId === 0) {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || (item.AppointmentStatus === "E") || (item.AppointmentStatus === "D")) {

                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentID);


                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartConsultation1();
                    }, function (err) {
                        console.log(err);
                    });
                }
            } else {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || item.AppointmentStatus === "E" || item.AppointmentStatus === "D") {
                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentID);
                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartConsultation1();
                    }, function (err) {
                        console.log(err);
                    });
                }
            }
        }
    }

    function continuetoStartConsultation1() {

        if ($scope.SpecializationId === 2 || $scope.DoctorSpecializationId === 2) {
            $location.url("/dentalConsultation");
        } else {
            $location.url("/USNewOpthaConsultation");
        }

    }
    function continuetoStartConsultation() {

        if ($scope.SpecializationId === 2 || $scope.DoctorSpecializationId === 2) {
            $location.url("/dentalConsultation");
        } else {
            $location.url("/NewOpthaConsultation");
        }

    }
    $scope.GetPatientCaseHistoryById = function (planind, consultationid, AppointmentID) {
        var type = 0;
        if (consultationid === 0) {
            type = 1;
        }

        object = {
            "AppointmentId": AppointmentID,
            "Type": type
        };

        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.treatmentData = resp.data;
                if (resp.data.length > 0) {
                    $scope.referalMailBind = resp.data[0].ReferralDocemail || "";
                    $scope.referalDoctorID = resp.data[0].ReferalDoctorId;
                    $scope.cacheStorageItem.ReferalDoctorName = resp.data[0].ReferalDoctorName || "";
                    $scope.cacheStorageItem.RefeRalDoctorNotes = resp.data[0].RefeRalDoctorNotes || "";
                }
                $scope.cacheStorageItem.TreatmentPlanId = planind;
                $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                if ($scope.SelectedPlanArray.length > 0) {
                    $scope.RestructureToCacheStorage($scope.SelectedPlanArray[0], consultationid);
                }
            } else {
                $scope.TreatMentPlans = [];
                if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
                    continuetoStartVideoConsultation();

                }
                else {
                    continuetoStartConsultation();
                }

            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
            $scope.TreatMentPlans = [];
        });

    };

    function getPatientNoteFiles(appID) {
        var param = {
            "AppointmentId": appID
        };
        eHnoteDiagnosisDataServices.getPatientNotesFiles(param, ongetFileSuccess, ongetFileError);
        function ongetFileSuccess(resp) {
            $scope.generalImgUploads = [];
            $scope.generalPdfUploads = [];
            $scope.PreTreatmentImgUploads = [];
            $scope.PreTreatmentPdfUploads = [];
            $scope.PostTreatmentImgUploads = [];
            $scope.PostTreatmentPdfUploads = [];
            $scope.ConsentImgUploads = [];
            $scope.ConsentPdfUploads = [];
            if (resp.PatientFiles !== undefined) {
                if (resp.PatientFiles.length > 0) {
                    var filteredArray = resp.PatientFiles;
                    for (var i = 0; i < filteredArray.length; i++) {
                        $scope.docname = '';
                        filteredArray[i].docNameDisplay = '';
                        var extension = ".jpg";
                        if (filteredArray[i].DocName) {
                            extension = filteredArray[i].DocName.split(".")[1];
                        }
                        var pName = filteredArray[i].DocName.split("_")[0];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + extension;
                        } else {
                            name = angular.copy(pName) + '.' + extension;
                        }
                        filteredArray[i].docNameDisplay = name;
                        if (filteredArray[i].DocURL.indexOf(".pdf") > -1) {
                            filteredArray[i].DeleteInd = false;
                            filteredArray.IsRemarksinEdit = false;
                            switch (filteredArray[i].FileTypeId) {
                                case 1:
                                    $scope.generalPdfUploads.push(filteredArray[i]);
                                    break;
                                case 2:
                                    $scope.PreTreatmentPdfUploads.push(filteredArray[i]);
                                    break;
                                case 3:
                                    $scope.PostTreatmentPdfUploads.push(filteredArray[i]);
                                    break;
                                case 4:
                                    $scope.ConsentPdfUploads.push(filteredArray[i]);
                                    break;
                            }
                        } else {
                            filteredArray[i].DeleteInd = false;
                            filteredArray.IsRemarksinEdit = false;
                            switch (filteredArray[i].FileTypeId) {
                                case 1:
                                    $scope.generalImgUploads.push(filteredArray[i]);
                                    break;
                                case 2:
                                    $scope.PreTreatmentImgUploads.push(filteredArray[i]);
                                    break;
                                case 3:
                                    $scope.PostTreatmentImgUploads.push(filteredArray[i]);
                                    break;
                                case 4:
                                    $scope.ConsentImgUploads.push(filteredArray[i]);
                                    break;
                            }
                        }
                    }
                }
            }

            $scope.PreTreatMentArrayChangedCount++;
            $scope.GeneralArrayChangedCount++;
            $scope.PostTreatMentArrayChangedCount++;
            $scope.ConsentsArrayChangedCount++;
        }
        function ongetFileError(err) {
            console.log(err);
        }
    }

    function getvitalparamertersbyId(appointmentid) {
        eHnotePatientPVService.getPatientPastVitalsByAppId(appointmentid, OnPVsuccess, OnPVerror);
        function OnPVsuccess(data) {
            if (data.Vitals !== null || data.Vitals !== undefined) {
                $scope.AppointmentVital = data.Vitals;
            }
        }
        function OnPVerror(data) {
        }
    }


    $scope.isParentAppointmentExists = false;
    $scope.GetPatientDentalCaseHistorybyId = function (item) {
        $scope.isParentAppointmentExists = false;
        var appointmentId = 0;
        var type = 0;

        if (item.ParentAppointmentId === 0) {
            appointmentId = item.AppointmentID;
            type = 0;
        } else {
            if (item.AppointmentStatus === "B") {
                $scope.isParentAppointmentExists = true;
                appointmentId = item.ParentAppointmentId;
                type = 1;
            } else {
                appointmentId = item.AppointmentID;
                type = 0;
            }
        }

        $scope.ConsultationData = [];

        object = {
            "UserId": item.DoctorID,
            "PatientId": item.PatientID,
            "AppointmentId": appointmentId,
            "Type": type
        };

        $scope.TreatmentPlanId = item.TreatmentPlanId;

        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;


        eHnotePatientDataService.GetPatientDentalCaseHistorybyId(object).then(function (resp) {
            var plan = "";
            $scope.SelectedPlan = "";
            if (resp.data.length > 0) {
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message);
                    return;
                }
                $scope.AppointmentsData = resp.data;
                getPatientNoteFiles(item.AppointmentID);
                getvitalparamertersbyId(item.AppointmentID);
                if ($scope.AppointmentsData.length === 0) {
                    return;
                }

                $scope.ConsultationData.push(resp.data[0]);
                $scope.cacheStorageItem.TotalTreatMentFinalCost = 0;
                angular.forEach($scope.ConsultationData, function (mainitem) {
                    mainitem.ToothProblems = mainitem.ToothProblems || [];
                    angular.forEach(mainitem.ToothProblems, function (subitem) {
                        subitem.Treatments = subitem.Treatments || [];
                        angular.forEach(subitem.Treatments, function (treatItem) {
                            if (treatItem.TreatmentData.Status !== undefined) {
                                treatItem.TreatmentData.Status = treatItem.TreatmentData.Status.toString();
                            } else {
                                treatItem.TreatmentData.Status = "1";
                            }
                            treatItem.TreatmentData.TreatmentFinalCost = treatItem.TreatmentData.TreatmentCost - treatItem.TreatmentData.DiscountAmount;
                            $scope.cacheStorageItem.TotalTreatMentFinalCost += treatItem.TreatmentData.TreatmentFinalCost;
                        });
                    });
                });

                $scope.SelectedPlanArray = $filter("filter")($scope.ConsultationData, { "AppointmentId": appointmentId }, true);
                if ($scope.SelectedPlanArray.length > 0) {
                    plan = $scope.SelectedPlanArray[0];
                    $scope.SelectedPlan = plan;
                }

                if (plan.Appointmentwith !== undefined && plan.Appointmentwith !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.DoctorName = plan.Appointmentwith;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }

                if (plan.BranchName !== undefined && plan.BranchName !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchName = plan.BranchName;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }

                if (plan.BranchEmail !== undefined && plan.BranchEmail !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchEmail = plan.BranchEmail;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
                if (plan.BranchMobile !== undefined && plan.BranchMobile !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchMobile = plan.BranchMobile;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
                if (plan.Address1 !== undefined && plan.Address1 !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchAddress1 = plan.Address1;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
                if (plan.Address2 !== undefined && plan.Address2 !== "") {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.BranchAddress2 = plan.Address2;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                }
            }

            $scope.RestructureToCacheStorage($scope.SelectedPlan, item.ConsultationId);

        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
            $scope.TreatMentPlans = [];
        });
    };
    function GetEyeName(OrganId) {
        if (OrganId === 1) {
            return "Right Eye";
        }
        if (OrganId === 2) {
            return "Left Eye";
        }
        if (OrganId === 3) {
            return "Both Eyes";
        }
        if (OrganId === 4) {
            return "General";
        }
        if (OrganId === 5) {
            return "Hair";
        }
        if (OrganId === 6) {
            return "Skin";
        }
        if (OrganId === 7) {
            return "Laser";
        }
    }
    function isString(val) {
        return typeof val === 'string' || (!!val && typeof val === 'object' && Object.prototype.toString.call(val) === '[object String]');
    }
    $scope.RestructureToCacheStorage = function (plan, consultationid) {

        plan = plan || "";

        $scope.cacheStorageItem.IsNewConsultation = false;
        $scope.cacheStorageItem.IsEditConsultation = true;
        $scope.cacheStorageItem.IsFollowupConsultation = false;

        if (consultationid === 0) {
            $scope.cacheStorageItem.ConsultationID = 0;
        } else {
            $scope.cacheStorageItem.ConsultationID = consultationid;
        }
        if (plan != "") {
            if ($scope.SpecializationId === 2) {
                $scope.cacheStorageItem.MedicalHistory = plan.MedicalHistory;
                $scope.cacheStorageItem.MedicalHistory.forEach(function (pitem, index) {
                    pitem.ActiveInd = true;
                    pitem.IsEdit = false;
                    pitem.Duration = pitem.Duration || "";
                    pitem.DurationType = pitem.DurationType || "D";
                    pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                    pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                    pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                });
            }

            else {
                if ($scope.PatientPastMedicalHistory !== undefined) {
                    if ($scope.PatientPastMedicalHistory.length !== 0) {
                        $scope.cacheStorageItem.MedicalHistory = $scope.PatientPastMedicalHistory;
                    }
                }
            }
        }


        if ($scope.PatientBirthHistory !== undefined) {
            if ($scope.PatientBirthHistory.length !== 0) {
                $scope.cacheStorageItem.BirthHistory = $scope.PatientBirthHistory;
            }
        }
        if ($scope.PatientOccularHistory !== undefined) {
            if ($scope.PatientOccularHistory.length !== 0) {
                $scope.cacheStorageItem.OccularHistory = $scope.PatientOccularHistory;
            }
        }
        if ($scope.PatientFamilyHistory !== undefined) {
            if ($scope.PatientFamilyHistory.length !== 0) {
                $scope.cacheStorageItem.FamilyHistory = $scope.PatientFamilyHistory;
            }
        }
        if ($scope.PatientNutritionalHistory !== undefined) {
            if ($scope.PatientNutritionalHistory.length !== 0) {
                $scope.cacheStorageItem.NutritionalHistory = $scope.PatientNutritionalHistory;
            }
        }
        if ($scope.PatientImmunisationHistory !== undefined) {
            if ($scope.PatientImmunisationHistory.length !== 0) {
                $scope.cacheStorageItem.ImmunisationHistory = $scope.PatientImmunisationHistory;
            }
        }
        if ($scope.PatientSurgicalHistory !== undefined) {
            if ($scope.PatientSurgicalHistory.length !== 0) {
                $scope.cacheStorageItem.SurgicalHistory = $scope.PatientSurgicalHistory;
            }
        }

        if ($scope.PatientMenstrualHistory !== undefined) {
            if ($scope.PatientMenstrualHistory.length !== 0) {
                $scope.cacheStorageItem.MenstrualHistory = $scope.PatientMenstrualHistory;
            }
        }
        if ($scope.PatientLifestyleHistory !== undefined) {
            if ($scope.PatientLifestyleHistory.length !== 0) {
                $scope.cacheStorageItem.LifestyleHistory = $scope.PatientLifestyleHistory;
            }
        }

        if ($scope.PatientAllergyHistory !== undefined) {
            if ($scope.PatientAllergyHistory.length !== 0) {
                $scope.cacheStorageItem.AllergyItems = $scope.PatientAllergyHistory;
            }
        }

        if (plan !== "") {
            if (plan.ReferalDoctorId) {
                $scope.cacheStorageItem.ReferalDoctorId = plan.ReferalDoctorId || "";
                $scope.cacheStorageItem.RefeRalDoctorNotes = plan.RefeRalDoctorNotes || "";
                $scope.cacheStorageItem.ReferalDoctorName = plan.ReferalDoctorName || "";
                $scope.cacheStorageItem.ReferalDoctorType = plan.referraldoctype || "";
                $scope.cacheStorageItem.ReferalOrgId = plan.ReferalOrgId || "";
                $scope.cacheStorageItem.ReferalId = plan.ConsulRefId;
            }

            //MedicalConditions
            if (plan.MedicalConditions !== undefined) {
                if (plan.MedicalConditions.length !== 0) {
                    $scope.cacheStorageItem.MedicalConditions = plan.MedicalConditions;
                }
            }
            //ChiefComplaints
            if (plan.ChiefComplaints !== undefined) {
                if (plan.ChiefComplaints.length !== 0) {
                    $scope.cacheStorageItem.ChiefComplaints = plan.ChiefComplaints;
                }
            }
            //Observations
            if (plan.Observations !== undefined) {
                if (plan.Observations.length !== 0) {
                    $scope.cacheStorageItem.Observations = plan.Observations;
                }
            }
            if (plan.PlanOfCareComments !== undefined) {
                if (plan.PlanOfCareComments.length !== 0) {
                    $scope.cacheStorageItem.PlanOfCareComments = plan.PlanOfCareComments;
                }
            }
            if (plan.OrderDetails !== undefined) {
                if (plan.OrderDetails.length !== 0) {
                    angular.forEach(plan.OrderDetails, function (item) {
                        item.OrderDate = item.OrderDate;
                    });
                    $scope.cacheStorageItem.OrderDetails = plan.OrderDetails;
                }
            }

            //AssessmentPlan
            if (plan.AssessmentPlan !== undefined) {
                if (plan.AssessmentPlan.length !== 0) {
                    $scope.cacheStorageItem.AssessmentPlan = [];
                    plan.AssessmentPlan.forEach(function (diag, index) {
                        var OrganName = '';
                        if (diag.OrganId == 1 || diag.OrganId == '1') {
                            OrganName = "OD";
                        }
                        else if (diag.OrganId == 2 || diag.OrganId == '2') {
                            OrganName = "OS";
                        }
                        else if (diag.OrganId == 3 || diag.OrganId == '3') {
                            OrganName = "OD";
                        }

                        $scope.ProceduresArray = [];
                        if (diag.ProceduresArray !== 0) {
                            angular.forEach(diag.ProceduresArray, function (item) {
                                var object = {
                                    "PatientTreatmentId": item.PatientTreatmentId,
                                    "SpecializationId": item.SpecializationId,
                                    "OrganId": item.OrganId,
                                    "OrganName": OrganName,
                                    "CreatedDateTime": item.CreatedDateTime,
                                    "TreatmentData": {
                                        "TreatmentHistoryId": item.TreatmentHistoryId,
                                        "ProcedureId": item.ProcedureId,
                                        "OrgProcedureId": item.OrgProcedureId,
                                        "TreatmentName": item.TreatmentName,
                                        "TreatmentNotes": item.TreatmentNotes,
                                        "ModifiedBy": item.ModifiedBy,
                                        "ModifiedDt": item.ModifiedDt,
                                        "TreatmentStatusName": item.TreatmentStatusName,
                                        // "ProcedureMaxCost": patientTypeCost,
                                        //"TreatmentCost": patientTypeCost,
                                        "Multiplyfactor": item.Multiplyfactor,
                                        "DiscountCost": 0,
                                        // "TreatmentStatus": "1",
                                        "discountValue": "",
                                        "discountType": "A",
                                        "TreatmentDiscountAmt": 0,
                                        "SurgeryStatusId": 0,
                                        "TotalSittings": 0,
                                        "ActiveInd": "Y",

                                    }
                                };
                                $scope.ProceduresArray.push(object);
                            });
                        }

                        if (diag.ProceduresArray != undefined && diag.ProceduresArray.length > 0) {  //13036
                            diag.ProceduresArray = [];
                            diag.ProceduresArray = angular.copy($scope.ProceduresArray);
                        }

                        diag.OrganName = OrganName;
                        diag.ActiveInd = 'Y';
                        diag.PlanOfcareNotesArray = diag.PlanOfcareNotesArray || [];
                        diag.SurgeryArray = diag.SurgeryArray || [];
                        diag.InvestigationsArray = diag.InvestigationArray || [];
                        diag.ProceduresArray = diag.ProceduresArray || [];
                        diag.PrescriptionArray = diag.PrescriptionArray || [];
                        $scope.cacheStorageItem.AssessmentPlan.push(diag);

                    });
                }
                else {
                    $scope.cacheStorageItem.AssessmentPlan = [];
                }
            } else {
                $scope.cacheStorageItem.AssessmentPlan = [];
            }


            if (plan.ClinicalNotesArray !== undefined) {
                if (plan.ClinicalNotesArray.length !== 0) {
                    $scope.cacheStorageItem.ClinicalNotesArray = [];
                    $scope.cacheStorageItem.ClinicalNotesArray = plan.ClinicalNotesArray || [];
                }
                else {
                    $scope.cacheStorageItem.ClinicalNotesArray = [];
                }
            } else {
                $scope.cacheStorageItem.ClinicalNotesArray = [];
            }


            if (plan.DoctorNotesArray !== undefined) {
                if (plan.DoctorNotesArray.length !== 0) {
                    $scope.cacheStorageItem.DoctorNotesArray = [];
                    $scope.cacheStorageItem.DoctorNotesArray = plan.DoctorNotesArray || [];
                }
                else {
                    $scope.cacheStorageItem.DoctorNotesArray = [];
                }
            } else {
                $scope.cacheStorageItem.DoctorNotesArray = [];
            }


            if (plan.OptomNotesArray !== undefined) {
                if (plan.OptomNotesArray.length !== 0) {
                    $scope.cacheStorageItem.OptomNotesArray = [];
                    $scope.cacheStorageItem.OptomNotesArray = plan.OptomNotesArray || [];
                }
                else {
                    $scope.cacheStorageItem.OptomNotesArray = [];
                }
            } else {
                $scope.cacheStorageItem.OptomNotesArray = [];
            }


            if (plan.PatientNotesArray !== undefined) {
                if (plan.PatientNotesArray.length !== 0) {
                    $scope.cacheStorageItem.PatientNotesArray = [];
                    $scope.cacheStorageItem.PatientNotesArray = plan.PatientNotesArray || [];
                }
                else {
                    $scope.cacheStorageItem.PatientNotesArray = [];
                }
            } else {
                $scope.cacheStorageItem.PatientNotesArray = [];
            }

            //PatientDiagnosis
            if (plan.Diagnosis !== undefined) {
                if (plan.Diagnosis.length !== 0) {
                    $scope.cacheStorageItem.Diagnosis = [];
                    plan.Diagnosis.forEach(function (diag, index) {
                        diag.Notes = diag.Notes || "";
                        $scope.cacheStorageItem.Diagnosis.push({
                            "PatientDiagnosisId": diag.PatientDiagnosisId,
                            "SpecializationId": diag.SpecializationId,
                            "OrganId": diag.OrganId,
                            "OrganName": GetEyeName(diag.OrganId),
                            "DiagnosisData": {
                                "DiagnosisId": diag.DiagnosisId,
                                "DiagnosisHistoryId": diag.DiagnosisHistoryId,
                                "DiagnosisTypeId": diag.DiagnosisTypeId.toString(),
                                "DiagnosisType": diag.DiagnosisType,
                                "DiagnosisName": diag.DiagnosisName,
                                "Notes": diag.Notes,
                                "ShowNote": diag.Notes === "" ? false : true,
                                "ActiveInd": "Y",
                                "DiagnosisNotes": diag.Notes,
                                "ModifiedBy": diag.ModifiedBy,
                                "ModifiedDt": diag.ModifiedDt
                            }
                        });
                    });
                }
            }

            if (plan.FollowUpDetails !== undefined) {
                if (plan.FollowUpDetails.length !== 0) {
                    $scope.cacheStorageItem.FollowUpArray = plan.FollowUpDetails;
                }
            }
            //LabTest
            if (plan.LabTest !== undefined) {
                if (plan.LabTest.length !== 0) {
                    plan.LabTest.forEach(function (lab, index) {
                        lab.ActiveInd = 'Y';
                    });
                    $scope.cacheStorageItem.LabTest = plan.LabTest;
                }
            }

            if (plan.PatientInvestigations !== undefined) {
                if (plan.PatientInvestigations.length !== 0) {
                    plan.PatientInvestigations.forEach(function (inv, index) {
                        inv.ActiveInd = 'Y';
                        // inv.OrganId = inv.OrganId.toString();
                    });
                    $scope.cacheStorageItem.PatientInvestigations = plan.PatientInvestigations;
                }
            }

            if (plan.masterQuestions !== undefined) {
                if (plan.masterQuestions.length !== 0) {
                    $scope.cacheStorageItem.masterQuestions = plan.masterQuestions;
                }
            }
            $scope.cacheStorageItem.ContactLens = plan.ContactLens || [];
            $scope.cacheStorageItem.SuperBillArray = plan.SuperBillArray || [];
            $scope.cacheStorageItem.ConsultationTreatments = plan.ConsultationTreatments || [];
            $scope.cacheStorageItem.FollowUpDuration = plan.FollowUpDuration ? plan.FollowUpDuration : "";
            $scope.cacheStorageItem.FollowUpDurationType = plan.FollowUpDurationType ? plan.FollowUpDurationType : "D";
            $scope.cacheStorageItem.FollowUpNotes = plan.FollowUpNotes ? plan.FollowUpNotes : "";
            $scope.cacheStorageItem.ConsultationDate = plan.AppointmentDt;
            $scope.cacheStorageItem.OptomComments = plan.OptomComments ? plan.OptomComments : "";
            $scope.cacheStorageItem.DoctorComments = plan.DoctorComments ? plan.DoctorComments : "";
            $scope.cacheStorageItem.ClinicalNotesComments = plan.ClinicalNotes ? plan.ClinicalNotes : "";
            $scope.cacheStorageItem.PatientInstructionComments = plan.PatientInstructions ? plan.PatientInstructions : "";
            //Treatment 
            if (plan.Treatment !== undefined) {
                if (plan.Treatment.length !== 0) {
                    $scope.cacheStorageItem.Treatments = [];
                    plan.Treatment.forEach(function (treat, index) {
                        treat.DiscountCost = treat.DiscountCost || 0;
                        treat.TreatmentNotes = treat.TreatmentNotes || "";
                        treat.ShowNote = treat.TreatmentNotes === "" ? false : true;
                        var TreatmentFinalCost = ((treat.ProcedureMaxCost * treat.MultiplyFactor) - parseFloat(treat.TreatmentDiscountAmt) || 0);
                        $scope.cacheStorageItem.Treatments.push({
                            "PatientTreatmentId": treat.PatientTreatmentId,
                            "SpecializationId": treat.SpecializationId,
                            "OrganId": treat.OrganId,
                            "OrganName": GetEyeName(treat.OrganId),
                            "TreatmentData": {
                                "TreatmentHistoryId": treat.TreatmentHistoryId,
                                "ProcedureId": treat.ProcedureId,
                                "TreatmentName": treat.TreatmentName,
                                "TreatmentNotes": treat.TreatmentNotes,
                                "ProcedureMaxCost": treat.ProcedureMaxCost,
                                "TreatmentCost": treat.ProcedureMaxCost,
                                "Multiplyfactor": treat.MultiplyFactor,
                                "DiscountCost": treat.DiscountCost,
                                "TreatmentStatus": treat.StatusId === undefined ? "1" : treat.StatusId.toString(),
                                "discountValue": treat.DiscountValue,
                                "discountType": treat.DiscountType,
                                "TreatmentDiscountAmt": treat.TreatmentDiscountAmt,
                                "ShowNote": treat.ShowNote,
                                "TreatmentFinalCost": TreatmentFinalCost,
                                "TotalSittings": treat.TotalSittings,
                                "ActiveInd": treat.ActiveInd,
                                "IsTreatmentInvoiced": treat.IsTreatmentInvoiced,
                                "ModifiedBy": treat.ModifiedBy,
                                "ModifiedDt": treat.ModifiedDt
                            }
                        });
                    });
                }
            }

            $scope.cacheStorageItem.TotalTreatcost = plan.TotalTreatcost;
            $scope.cacheStorageItem.TotalDisocuntAmount = plan.TotalDisocuntAmount;
            $scope.cacheStorageItem.TotalTreatNetAmount = plan.TotalTreatNetAmount;
            //Surgery
            if (plan.SurgeryData !== undefined) {
                if (plan.SurgeryData.length !== 0) {
                    $scope.cacheStorageItem.SurgeryArray = [];
                    plan.SurgeryData.forEach(function (surgeryItem, index) {
                        var EyeName = "";
                        EyeName = GetEyeName(surgeryItem.OrganId);
                        if (EyeName === "General") {
                            EyeName = "";
                        } else {
                            EyeName = " for " + EyeName;
                        }
                        var FullSurgeryName = "";
                        FullSurgeryName = surgeryItem.SurgeryName + "" + EyeName + " (" + $filter('date')(new Date(surgeryItem.SurgerySuggestedDate), "dd-MMM-yyyy") + ") ";
                        if (surgeryItem.AnesthesiaTypeId === 1) {
                            surgeryItem.AnesthesiaType = 'Local';
                        } else if (surgeryItem.AnesthesiaTypeId === 2) {
                            surgeryItem.AnesthesiaType = 'General';
                        } else {
                            surgeryItem.AnesthesiaType = 'Topical';
                        }
                        if (surgeryItem.SurgeryDoctorId === 0) { surgeryItem.SurgeryDoctorId = ""; }
                        if (surgeryItem.SurgeryAssistantDoctorId === 0) { surgeryItem.SurgeryAssistantDoctorId = ""; }
                        if (surgeryItem.SurgeryAnesthesiaDoctorId === 0) { surgeryItem.SurgeryAnesthesiaDoctorId = ""; }
                        if (surgeryItem.SurgeryDoctorId === 0) { surgeryItem.SurgeryDoctorId = ""; }
                        if (surgeryItem.SurgeryAssistantDoctorId === 0) { surgeryItem.SurgeryAssistantDoctorId = ""; }
                        if (surgeryItem.SurgeryAnesthesiaDoctorId === 0) { surgeryItem.SurgeryAnesthesiaDoctorId = ""; }
                        surgeryItem.ProcedureMaxCost = surgeryItem.SurgeryCost;
                        surgeryItem.SurgeryFinalCost = parseInt(surgeryItem.SurgeryCost) - parseInt(surgeryItem.SurgeryDiscountAmt);
                        var object = {
                            "PatientSurgeryId": surgeryItem.PatientSurgeryId,
                            "ParentPatientSurgeryId": surgeryItem.ParentPatientSurgeryId,
                            "SpecializationId": surgeryItem.SpecializationId,
                            "OrganId": surgeryItem.OrganId,
                            "OrganName": GetEyeName(surgeryItem.OrganId),
                            "OrgSurgeryId": surgeryItem.OrgSurgeryId,
                            "FullSurgeryName": FullSurgeryName,
                            "SurgeryCategoryName": surgeryItem.SurgeryCategoryName,
                            "SurgeryCategoryId": surgeryItem.SurgeryCategoryId,
                            "SurgeryObject": {
                                "OrgSurgeryId": surgeryItem.OrgSurgeryId,
                                "SurgeryName": surgeryItem.SurgeryName
                            },
                            "SurgeryBillingObject": {
                                "OrgSurgeryBillingId": surgeryItem.OrgSurgeryBillingId,
                                "SurgeryBillingName": surgeryItem.SurgeryBillingName,
                                "SurgeryCost": surgeryItem.SurgerBillingCost,
                                "OrganizationSurgeryId": surgeryItem.SurgeryId,
                                "SurgeryName": surgeryItem.SurgeryName
                            },
                            "OrgSurgeryBillingId": surgeryItem.OrgSurgeryBillingId,
                            "SurgeryName": surgeryItem.SurgeryName,
                            "SurgeryDoctorId": surgeryItem.SurgeryDoctorId,
                            "SurgeryDoctorName": surgeryItem.SurgeryDoctorName,
                            "SurgeryAnesthesiaDoctorId": surgeryItem.SurgeryAnesthesiaDoctorId,
                            "SurgeryAnesthesiaDoctorName": surgeryItem.SurgeryAnesthesiaDoctorName || "",
                            "SurgeryCounselorId": surgeryItem.SurgeryCounselorId,
                            "SurgeryCounselorName": surgeryItem.SurgeryCounselorName || surgeryItem.SurgeryCounselor || "",
                            "SurgeryInstructions": surgeryItem.SurgeryInstructions,
                            "SurgerySuggestedDate": surgeryItem.SurgerySuggestedDate,
                            "SurgeryStatusId": parseInt(surgeryItem.SurgeryStatusId),
                            "SurgeryStatus": surgeryItem.SurgeryStatusId,
                            "ProcedureMaxCost": surgeryItem.ProcedureMaxCost,
                            "SurgeryFinalCost": surgeryItem.SurgeryFinalCost,
                            "AnesthesiaType": surgeryItem.AnesthesiaType,
                            "AnesthesiaTypeId": surgeryItem.AnesthesiaTypeId,
                            "SurgeryAssistantDoctorId": surgeryItem.SurgeryAssistantDoctorId,
                            "IolPower": surgeryItem.IolPower || "",
                            "ActiveInd": "Y",
                            "SurgeryOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                        };
                        $scope.cacheStorageItem.SurgeryArray.push(object);
                    });
                }
            }
            //Prescription
            if (plan.Prescription !== undefined) {
                if (plan.Prescription.length !== 0) {
                    plan.Prescription.forEach(function (pre, index) {
                        if (pre.PrescriptionType === "" || pre.PrescriptionType === undefined) {
                            pre.PrescriptionType = "GenericMedicine";
                        }
                        pre.PrescriptionType = pre.PrescriptionType || "GenericMedicine";
                        if (pre.PrescriptionType === "GenericMedicine") {
                            pre.Dosage = pre.Dosage || "";
                            var DurationType = pre.DurationType || "D";
                            var DurationTypeName = pre.DurationType === "D" ? "Day(s)" : (pre.DurationType === "M" ? "Month(s)" : (pre.DurationType === "W" ? "Week(s)" : (pre.DurationType === "C" ? "To Be continued" : (pre.DurationType === "L" ? "Life Time" : "Year(s)"))));
                            var TypeOfDosage = pre.Frequency === "" ? "Default" : "Custom";
                            var Dosage1 = "";
                            var Dosage2 = "";
                            var Dosage3 = "";
                            var FrequencyObj;
                            if (TypeOfDosage === "Custom") {
                                if (pre.FrequencyId === 0) {
                                    FrequencyObj = pre.Frequency || "";
                                } else {
                                    FrequencyObj = {
                                        "FrequencyId": pre.FrequencyId || 0,
                                        "Name": pre.Frequency || "",
                                        "Code": pre.PrintNote,
                                        "FrequencyType": 'C'
                                    };
                                }
                            }
                            if (TypeOfDosage === "Default") {
                                Dosage1 = pre.Dosage1;
                                Dosage2 = pre.Dosage2;
                                Dosage3 = pre.Dosage3;
                                FrequencyObj = {
                                    "FrequencyId": pre.FrequencyId,
                                    "Name": pre.Frequency,
                                    "Code": pre.PrintNote,
                                    "FrequencyType": 'D'
                                };
                            }
                            if (pre.Intake === undefined) {
                                pre.Intake = 0;
                            }
                            if (!isString(FrequencyObj)) {
                                FrequencyObj.languages = pre ? pre.languages || [] : [];
                            }
                            pre.DosageValueInd = pre.DosageValueInd || "";
                            pre.FrequencyValueInd = pre.FrequencyValueInd || "";
                            pre.DurationValueInd = pre.DurationValueInd || "";


                            var object = {
                                "PrescriptionId": pre.PrescriptionId,
                                "PrescriptionType": "GenericMedicine",
                                "PrescriptionData": {
                                    "PrescriptionHistoryId": pre.PrescriptionHistoryId,
                                    "Id": pre.Id,
                                    "Name": pre.Name,
                                    "Dosage": pre.Dosage,
                                    "Refill": pre.Refill || null,
                                    "TypeOfDosage": TypeOfDosage,
                                    "Dosage1": Dosage1,
                                    "Dosage2": Dosage2,
                                    "Dosage3": Dosage3,
                                    "DosageValueInd": pre.DosageValueInd.toString(),
                                    "FrequencyValueInd": pre.FrequencyValueInd.toString(),
                                    "DurationValueInd": pre.DurationValueInd.toString(),
                                    "DirectionType": pre.DirectionType || "",
                                    "FrequencyObj": FrequencyObj,
                                    "FrequencyId": pre.FrequencyId,
                                    "Frequency": pre.Frequency,
                                    "FrequencyHindhi": "",
                                    "FrequencyTelugu": "",
                                    "FrequencyMarathi": "",
                                    "FrequencyKannada": "",
                                    "Frequencypanjab": "",
                                    "PrintNote": pre.PrintNote,
                                    "Intake": pre.Intake.toString(),
                                    "Duration": pre.Duration === 0 ? '' : pre.Duration,
                                    "DurationType": DurationType,
                                    "DurationTypeName": DurationTypeName,
                                    "MedicineType": pre.MedicineType,
                                    "OrganId": pre.OrganId,
                                    "OrganName": GetEyeName(pre.OrganId),
                                    "ActiveInd": "Y",
                                    "Instructions": pre.Instructions,
                                    "InstructionsLanguage": pre.InstructionsLanguage || [],
                                    "ShowInstruction": false,
                                    "ShowPrescriptiondiv": false,
                                    "ModifiedBy": pre.ModifiedBy,
                                    "ModifiedDt": pre.ModifiedDt,
                                    "TaperingArray": pre.TaperingArray || [],
                                    "TempTaperingArray": pre.TaperingArray || [],
                                }
                            };

                            if (!isString(FrequencyObj)) {
                                var hindhiobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'hi' })[0];
                                object.PrescriptionData.FrequencyHindhi = hindhiobj ? hindhiobj.translateName : '';
                                var englishobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'en' })[0];
                                object.PrescriptionData.FrequencyEnglish = englishobj ? englishobj.translateName : '';
                                englishobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'te' })[0];
                                object.PrescriptionData.FrequencyTelugu = englishobj ? englishobj.translateName : '';

                                var martiobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'mr' })[0];
                                object.PrescriptionData.FrequencyMarathi = martiobj ? martiobj.translateName : '';

                                var kannadaobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'kn' })[0];
                                object.PrescriptionData.FrequencyKannada = kannadaobj ? kannadaobj.translateName : '';

                                var panjabobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'pa' })[0];
                                object.PrescriptionData.Frequencypanjab = panjabobj ? panjabobj.translateName : '';
                                var tamilobj = $filter("filter")(object.PrescriptionData.FrequencyObj.languages, { "Language": 'ta' })[0];
                                object.PrescriptionData.FrequencyTamil = tamilobj ? tamilobj.translateName : '';
                            }
                            $scope.cacheStorageItem.Prescriptions.push(object);
                        }
                        else {
                            if (pre.TaperingArray.length > 0) {
                                angular.forEach(pre.TaperingArray, function (mitem) {
                                    mitem.ActiveInd = "Y";
                                    mitem.DurationTypeName = mitem.DurationType === "D" ? "Day(s)" : (mitem.DurationType === "M" ? "Month(s)" : (mitem.DurationType === "W" ? "Week(s)" : (pre.DurationType === "C" ? "To Be continued" : (mitem.DurationType === "L" ? "Life Time" : "Year(s)"))));
                                });
                            }
                            var object = {
                                "PrescriptionId": pre.PrescriptionId,
                                "PrescriptionType": pre.PrescriptionType,
                                "PrescriptionData": {
                                    "PrescriptionHistoryId": pre.PrescriptionHistoryId,
                                    "Id": pre.Id,
                                    "Name": pre.Name,
                                    "OrganId": pre.OrganId,
                                    "OrganName": GetEyeName(pre.OrganId),
                                    "TaperingArray": pre.TaperingArray || [],
                                    "TempTaperingArray": pre.TaperingArray || [],
                                    "ActiveInd": "Y"
                                }
                            }
                            if (pre.PrescriptionType == 'TaperDrop') {
                                object.PrescriptionData.ShowTaperDropdiv = true;
                            }
                            if (pre.PrescriptionType == 'TaperTablet') {
                                object.PrescriptionData.ShowTaperTabletdiv = true;
                            }
                            $scope.cacheStorageItem.Prescriptions.push(object);
                        }
                    });
                    $scope.cacheStorageItem.TempPrescriptions = $scope.cacheStorageItem.Prescriptions;
                }
            }
            //PrescriptionMedNotes
            if (plan.PrescriptionNotes !== undefined) {
                if (plan.PrescriptionNotes.length !== 0) {
                    $scope.cacheStorageItem.PrescriptionMedNotes = plan.PrescriptionNotes[0].Notes;
                }
            }
            //GlassPrescription
            if (plan.GlassPrescription !== undefined) {
                if (plan.GlassPrescription.length !== 0) {
                    $scope.cacheStorageItem.GlassPrescription = [{
                        "GlassPrescriptionId": plan.GlassPrescription[0].GlassPrescriptionId,
                        "GlassDetailsData": {
                            "GlassPrescriptionHistoryId": plan.GlassPrescription[0].GlassPrescriptionHistoryId,
                            "GlassPrescriptionId": plan.GlassPrescription[0].GlassPrescriptionId,
                            "GlassDetails": {
                                "NewGlassArray": plan.GlassPrescription[0].GlassDetails.NewGlassArray,
                                "OldGlassArray": plan.GlassPrescription[0].GlassDetails.OldGlassArray
                            },
                            "ActiveInd": "Y"
                        }
                    }];
                    var count = 0;
                    angular.forEach(plan.GlassPrescription[0].GlassDetails.OldGlassArray[0], function (value, key) {
                        if (value !== "") {
                            count++;
                        }
                    });
                    if (count > 1) {
                        $scope.cacheStorageItem.chkOldglass = true;
                    }
                }
            }
            if (plan.InvestigationDetails && angular.isArray(plan.InvestigationDetails.Findings)) {
                if (plan.InvestigationDetails.Findings.length > 0) {
                    $scope.cacheStorageItem.InvestigationDetails = [];
                    plan.InvestigationDetails.Findings.forEach(function (item, index) {
                        if (item.CategoryID === 296) {
                            $scope.TempDryEye = [];
                            item.CategoryConditions.forEach(function (item1, index1) {
                                if (item1.InvestigationId === 2079) {
                                    if (item1.Remarks !== ""
                                        || item1.ODValue1 != "" || item1.ODValue2 != "" || item1.ODValue3 != "" || item1.OSValue1 != "" ||
                                        item1.OSValue2 != "" || item1.OSValue3 != ""
                                    ) {
                                        $scope.TempDryEye.push(item1);
                                    }
                                }
                                if (item1.InvestigationId === 2080 || item1.InvestigationId === 2081 || item1.InvestigationId === 2082) {
                                    if ((item1.RightEyeArray && item1.RightEyeArray.length !== 0) || (item1.LeftEyeArray && item1.LeftEyeArray.length !== 0) || item1.RightEyemm !== "" || item1.LeftEyemm !== "") {
                                        $scope.TempDryEye.push(item1);
                                    }

                                }
                                if (item1.InvestigationId === 2083) {
                                    if ((item1.RightEyeArray && item1.RightEyeArray.length !== 0) || (item1.LeftEyeArray && item1.LeftEyeArray.length !== 0) || item1.RightEyeLissamineGreenmm !== "" || item1.RightEyeRoseBengalmm !== "" || item1.RightEyeFlouresceinmm !== "" || item1.LeftEyeLissamineGreenmm !== "" || item1.LeftEyeRoseBengalmm !== "" || item1.LeftEyeFlouresceinmm !== "") {
                                        $scope.TempDryEye.push(item1);
                                    }

                                }
                            });

                            if ($scope.TempDryEye.length !== 0) {
                                var object = {
                                    "RowID": count++,
                                    "CategoryID": 296,
                                    "CategoryDesc": "Dry Eye Evaluation",
                                    "CategoryConditions": $scope.TempDryEye
                                };

                                $scope.cacheStorageItem.InvestigationDetails.push(object);
                            }
                        }
                    });
                    $scope.cacheStorageItem.Findings = $scope.cacheStorageItem.InvestigationDetails;
                    $scope.loadVisionFromCache();
                }
            }
            if (plan.ConsentUploads !== undefined) {
                if (plan.ConsentUploads.length !== 0) {
                    $scope.cacheStorageItem.PatientPdfConsertArray = [];
                    $scope.cacheStorageItem.PatientConsertArray = [];
                    angular.forEach(plan.ConsentUploads, function (item) {
                        if (item.DocURL.indexOf(".pdf") > -1) {
                            $scope.cacheStorageItem.PatientPdfConsertArray.push(item);
                        } else {
                            $scope.cacheStorageItem.PatientConsertArray.push(item);
                        }
                    });
                }
            }
            $scope.cacheStorageItem.finalToothPrblmArray = [];
            $scope.cacheStorageItem.patientToothPrblmArray = [];
            $scope.cacheStorageItem.TotalTreatMentFinalCost = 0;


            if (plan.ToothProblems !== undefined) {
                if ($scope.isParentAppointmentExists) {
                    $scope.ToothProblemArray = angular.copy(plan.ToothProblems);
                    angular.forEach($scope.ToothProblemArray, function (pitem) {
                        angular.forEach(pitem.Treatments, function (subpitem) {
                            subpitem.TreatmentData.treatmentAccess = false;

                            if (subpitem.IsNewTreatment) {
                                subpitem.TreatmentData.TreatmentDoctorAppointmentId = $scope.cacheStorageItem.appointmentid;
                                subpitem.IsNewTreatment = false;
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId || subpitem.TreatmentData.TreatmentAddedDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            } else {
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.finalToothPrblmArray = angular.copy($scope.ToothProblemArray);
                    $scope.cacheStorageItem.IsEditConsultation = true;
                    $scope.cacheStorageItem.IsFollowupConsultation = false;
                } else {
                    $scope.ToothProblemArray = angular.copy(plan.ToothProblems);
                    angular.forEach($scope.ToothProblemArray, function (pitem) {
                        angular.forEach(pitem.Treatments, function (subpitem) {
                            subpitem.TreatmentData.treatmentAccess = false;
                            if (subpitem.IsNewTreatment) {
                                subpitem.TreatmentData.TreatmentDoctorAppointmentId = $scope.cacheStorageItem.appointmentid;
                                subpitem.IsNewTreatment = false;
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId || subpitem.TreatmentData.TreatmentAddedDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            } else {
                                if (subpitem.TreatmentData.TreatmentDoctorId === $scope.UserId) {
                                    subpitem.TreatmentData.treatmentAccess = true;
                                    subpitem.IsNewTreatment = true;
                                }
                            }
                        });
                    });
                    $scope.cacheStorageItem.finalToothPrblmArray = angular.copy($scope.ToothProblemArray);
                }
                if ($scope.cacheStorageItem.finalToothPrblmArray.length > 0) {
                    angular.forEach($scope.cacheStorageItem.finalToothPrblmArray, function (item, index) {
                        angular.forEach(item.Treatments, function (item1, index1) {
                            item1.TreatmentData.showTreatInstructionPopup = false;
                            item1.TreatmentData.Instructions = item1.TreatmentData.Instructions ? item1.TreatmentData.Instructions : "";
                            item1.TreatmentData.TreatmentFinalCost = item1.TreatmentData.TreatmentCost - item1.TreatmentData.DiscountAmount;
                            $scope.cacheStorageItem.TotalTreatMentFinalCost += item1.TreatmentData.TreatmentFinalCost;
                            item1.TreatmentData.TreatmentNotesArray = [];

                            if (item1.TreatmentNotesArray !== undefined && item1.TreatmentNotesArray.length > 0) {
                                item1.TreatmentData.TreatmentNotesArray = angular.copy(item1.TreatmentNotesArray);
                            }
                            item1.TreatmentNotesArray = [];
                        });
                    });
                }
            }
            $scope.cacheStorageItem.PatientVitals = [];
            $scope.cacheStorageItem.AppointmentPatientUploads = [];
            $scope.cacheStorageItem.PatientVitals = plan.Vitals;
            $scope.cacheStorageItem.AppointmentPatientUploads = plan.FileUploads;

            $scope.cacheStorageItem.ForumFiles = plan.ForumFiles || [];


            if (plan.CheckList !== undefined) {
                if (!_.isEmpty(plan.CheckList)) {
                    $scope.cacheStorageItem.Checklist = plan.CheckList;
                }
            }

            if (plan.VisionDetails !== undefined) {
                $scope.cacheStorageItem.FinalVisionDetails = plan.VisionDetails || [];
            }

            if (plan.DilatedRetinoscopy !== undefined) {
                $scope.cacheStorageItem.FinalDilatedRetinoscopyDetails = plan.DilatedRetinoscopy || [];
            }
            if (plan.CyloplegicRetinoscopy !== undefined) {
                $scope.cacheStorageItem.FinalCyloplegicRetinoscopyDetails = plan.CyloplegicRetinoscopy || [];
            }
            if (plan.ManifestRetinoscopy !== undefined) {
                $scope.cacheStorageItem.FinalManifestRetinoscopyDetails = plan.ManifestRetinoscopy || [];
            }

            if (plan.PMTRetinoscopy !== undefined) {
                $scope.cacheStorageItem.FinalPMTRetinoscopyDetails = plan.PMTRetinoscopy || [];
            }

            if (plan.PupilSizeDetails !== undefined) {
                $scope.cacheStorageItem.FinalPupilSizeDetails = plan.PupilSizeDetails || [];
            }
            if (plan.DilationDetails !== undefined) {
                $scope.cacheStorageItem.FinalDilationDetails = plan.DilationDetails || [];
            }

            if (plan.TonoMetryDetails !== undefined) {
                $scope.cacheStorageItem.FinalTonoMetry = plan.TonoMetryDetails || [];
            }

            $scope.tempPachymetry = [];
            if (plan.Pachymetry.length !== 0) {
                var object = {
                    "PatientFindingPachymetryId": 0,
                    "InvestigationId": 176,
                    "InvestigationDesc": "Pachymetry",
                    "CategoryId": 1,
                    "CategoryDesc": "Vision",
                    "ActiveInd": "Y",
                    "Pachymetry": plan.Pachymetry || [],

                    "ActiveInd": "Y"
                };
                $scope.tempPachymetry.push(object);
            }

            $scope.cacheStorageItem.FinalPachymetryDetails = $scope.tempPachymetry || [];




            if (plan.AnteriorSegmentDetails !== undefined) {
                $scope.cacheStorageItem.FinalAnteriorDetails = plan.AnteriorSegmentDetails || [];
            }
            if (plan.PosteriorSegmentDetails !== undefined) {
                $scope.cacheStorageItem.FinalPosteriorDetails = plan.PosteriorSegmentDetails || [];
            }
            if (plan.TonoMetryDetails !== undefined) {
                $scope.cacheStorageItem.FinalTonoMetryDetails = plan.TonoMetryDetails || [];
            }
            if (plan.GlassDetails !== undefined) {
                $scope.cacheStorageItem.FinalGlassDetails = plan.GlassDetails || [];
            }

            if (plan.ColorVisionDetails !== undefined) {
                $scope.cacheStorageItem.FinalColorVisionDetails = plan.ColorVisionDetails || [];
            }
            if (plan.LacrimalPatiencyDetails !== undefined) {
                $scope.cacheStorageItem.FinalLacrimalPatiencyDetails = plan.LacrimalPatiencyDetails || [];
            }

            plan.NearInvestigationdetails = plan.NearInvestigationdetails || [];
            angular.forEach(plan.NearInvestigationdetails, function (item) {
                item.RemarksEdit = false;
            });
            $scope.cacheStorageItem.FinalNearInvestigationdetails = plan.NearInvestigationdetails || [];

            if (plan.SquintDetails !== undefined) {
                plan.SquintDetails = plan.SquintDetails || [];
                angular.forEach(plan.SquintDetails, function (item) {
                    item.IsCornealODedit = false;
                    item.IsCornealOSedit = false;
                    item.RemarksEdit = false;
                    item.RightEyeEdit = false;
                    item.LeftEyeEdit = false;
                });
                $scope.cacheStorageItem.FinalSquintDetails = plan.SquintDetails || [];

            }
            $scope.cacheStorageItem.FinalExternalExaminationDetails = plan.ExternalExaminationDetails || [];
            $scope.cacheStorageItem.FinalDryEyeEvaluationData = [];
            plan.DryEyeEvaluationData = plan.DryEyeEvaluationData || [];
            if (plan.DryEyeEvaluationData !== undefined) {

                angular.forEach(plan.DryEyeEvaluationData, function (item) {
                    item.IsInvDataAdded = true;
                    item.RemarksEdit = false;
                });
                $scope.cacheStorageItem.FinalDryEyeEvaluationData = plan.DryEyeEvaluationData;


                console.log($scope.cacheStorageItem.FinalDryEyeEvaluationData);
            }

            if (plan.GonioscopyDetails !== undefined) {
                $scope.cacheStorageItem.FinalGonioscopyDetails = plan.GonioscopyDetails || [];
            }

            $scope.cacheStorageItem.FinalNineGazeExtraOcularDetails = [];
            plan.NineGazeExtraOcularDetails = plan.NineGazeExtraOcularDetails || [];
            if (plan.NineGazeExtraOcularDetails !== undefined) {

                angular.forEach(plan.NineGazeExtraOcularDetails, function (item) {
                    item.IsInvDataAdded = true;
                    item.LRemarksEdit = false;
                    item.RRemarksEdit = false;
                    item.DistanceEdit = false;
                    item.NearEdit = false;
                });
                $scope.cacheStorageItem.FinalNineGazeExtraOcularDetails = plan.NineGazeExtraOcularDetails;

            }

            $scope.cacheStorageItem.FinalHeadPosterDetails = [];
            plan.HeadPosterDetails = plan.HeadPosterDetails || [];
            if (plan.HeadPosterDetails !== undefined) {

                angular.forEach(plan.HeadPosterDetails, function (item) {
                    item.IsInvDataAdded = true;
                    item.RemarksEdit = false;
                });
                $scope.cacheStorageItem.FinalHeadPosterDetails = plan.HeadPosterDetails;


                console.log($scope.cacheStorageItem.FinalHeadPosterDetails);
            }


            $scope.cacheStorageItem.FinalContactLensArray = [];

            angular.forEach(plan.ContactLensArray, function (clmitem) {
                var object = clmitem.ContactLensData;
                object.PatientContactLensDetailId = clmitem.PatientContactLensDetailId;
                $scope.cacheStorageItem.FinalContactLensArray.push(object);
            });



            $scope.cacheStorageItem.AnteriorRemarks = plan.AnteriorRemarks || "";
            $scope.cacheStorageItem.PosteriorRemarks = plan.PosteriorRemarks || "";
            $scope.cacheStorageItem.LacrimalPatencyRemarks = plan.LacrimalPatencyRemarks || "";
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        if ($scope.VideoConsultation || ($scope.Tab === 'teleappointments' && $scope.SpecializationId === 3)) {
            continuetoStartVideoConsultation();

        } else {
            continuetoStartConsultation();
        }
    };



    function checkval(val) {
        return val && val !== "" ? true : false;
    }

    function CheckExist(obj) {
        var count = 0;
        for (var key in obj) {
            if (obj[key] !== "") {
                count++;
            }
        }
        return count;
    }
    function AfterCheckExist(obj) {
        var aftercount = 0;
        for (var key in obj) {
            if (obj[key] !== "") {
                aftercount++;
            }
        }
        return aftercount;
    }

    $scope.loadVisionFromCache = function () {
        $scope.cacheStorageItem.DryEyeEvaluationArray = [];

        if ($scope.cacheStorageItem.InvestigationDetails.length > 0) {
            $scope.cacheStorageItem.InvestigationDetails.forEach(function (mitem) {
                if (mitem.CategoryID === 296) {
                    $scope.mainDryEyePrintArray = [];
                    mitem.CategoryConditions.forEach(function (item, index) {

                        if (item.InvestigationId === 2079) {

                            if (item.Remarks !== ""
                                || item.ODValue1 != "" || item.ODValue2 != "" || item.ODValue3 != "" || item.OSValue1 != "" ||
                                item.OSValue2 != "" || item.OSValue3 != ""
                            ) {
                                $scope.cacheStorageItem.DryEyeEvaluationArray.push(item);
                            }

                            $scope.mainDryEyePrintArray.push({
                                "InvestigationName": item.InvestigationDesc || "",
                                "RightEye": item.RightEye,
                                "LeftEye": item.LeftEye,
                                "Remarks": item.Remarks,

                            });

                        }
                        if (item.InvestigationId === 2080 || item.InvestigationId === 2081 || item.InvestigationId === 2082) {
                            var RRemarks = item.RightEyemm;
                            var LRemarks = item.LeftEyemm;


                            var RightImageArray = [];

                            item.RightEyeArray = item.RightEyeArray || [];
                            if (item.RightEyeArray.length > 0) {
                                angular.forEach(item.RightEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            RightImageArray.push({
                                                "url": initem.DocURL,
                                                "thumbUrl": initem.DocURL
                                            });
                                        }
                                    }
                                });
                            }
                            var LeftImageArray = [];
                            item.LeftEyeArray = item.LeftEyeArray || [];
                            if (item.LeftEyeArray.length > 0) {
                                angular.forEach(item.LeftEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            LeftImageArray.push({
                                                "url": initem.DocURL,
                                                "thumbUrl": initem.DocURL
                                            });
                                        }
                                    }
                                });
                            }
                            if (item.RightEyemm !== "" || item.LeftEyemm !== "" || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0) {
                                var object = {
                                    "CategoryId": item.CategoryId,
                                    "Category": item.Category,
                                    "Remarks": item.Remarks || "",
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "InvestigationDetails": {
                                        "RightEyemm": RRemarks,
                                        "LeftEyemm": LRemarks,
                                        "RightEyeImage": RightImageArray,
                                        "LeftEyeImage": LeftImageArray
                                    }
                                };

                                $scope.cacheStorageItem.DryEyeEvaluationArray.push(object);
                            }
                        }

                        if (item.InvestigationId === 2083) {

                            var RightImageArray = [];
                            if (item.RightEyeArray.length > 0) {
                                angular.forEach(item.RightEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            RightImageArray.push({
                                                "url": initem.DocURL,
                                                "DocURL": initem.DocURL,
                                                "thumbUrl": initem.DocURL,
                                                "Type": initem.Type || ""
                                            });
                                        }
                                    }
                                });
                            }
                            var LeftImageArray = [];
                            if (item.LeftEyeArray && item.LeftEyeArray.length > 0) {
                                angular.forEach(item.LeftEyeArray, function (initem) {
                                    if (initem.DocURL) {
                                        if (initem.DocURL.indexOf("http:") > -1 || initem.DocURL.indexOf("https:") > -1) {
                                            LeftImageArray.push({
                                                "url": initem.DocURL,
                                                "DocURL": initem.DocURL,
                                                "thumbUrl": initem.DocURL,
                                                "Type": initem.Type || ""
                                            });
                                        }
                                    }
                                });
                            }
                            if (item.RightEyeLissamineGreenmm !== "" || item.RightEyeRoseBengalmm !== "" || item.RightEyeFlouresceinmm !== "" || item.LeftEyeLissamineGreenmm !== "" || item.LeftEyeRoseBengalmm !== "" || item.LeftEyeFlouresceinmm !== "" || item.RightEyeArray.length > 0 || item.LeftEyeArray.length > 0) {
                                var object = {
                                    "CategoryId": item.CategoryId,
                                    "Category": item.Category,
                                    "Remarks": item.Remarks || "",
                                    "InvestigationId": item.InvestigationId,
                                    "InvestigationDesc": item.InvestigationDesc,
                                    "LeftEyeFlouresceinmm": item.LeftEyeFlouresceinmm,
                                    "LeftEyeRoseBengalmm": item.LeftEyeRoseBengalmm,
                                    "LeftEyeLissamineGreenmm": item.LeftEyeLissamineGreenmm,
                                    "RightEyeLissamineGreenmm": item.RightEyeLissamineGreenmm,
                                    "RightEyeRoseBengalmm": item.RightEyeRoseBengalmm,
                                    "RightEyeFlouresceinmm": item.RightEyeFlouresceinmm,
                                    "RightEyeArray": RightImageArray,
                                    "LeftEyeArray": LeftImageArray,

                                };
                                $scope.cacheStorageItem.DryEyeEvaluationArray.push(object);
                            }

                        }

                    });
                }
            });
        }

        $scope.mainVisionPrintArray = [
            { type: "DryEyeEvalution", bindArray: $scope.cacheStorageItem.DryEyeEvaluationArray }
        ];

        if ($scope.mainVisionPrintArray.length > 0) {
            var i = 0;
            $scope.mainVisionPrintArray.forEach(function (item) {
                if (item.bindArray.length === 0) {
                    i++;
                }
            });
            $scope.visionDivShowHide = $scope.mainVisionPrintArray.length > 0 && $scope.mainVisionPrintArray.length !== i ? true : false;
        }
        $scope.cacheStorageItem.mainVisionPrintArray = $scope.mainVisionPrintArray;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };
    $scope.tmpcasehistory = [];
    $scope.Closevitals = function () {
        $scope.showpatientvitals = false;
    };
    $scope.Endtimechange = function () {
        if ($scope.patinet_appStarttime !== null) {
            var app_startingTime = $scope.patinet_appStarttime.startTime;
            $scope.dffTime = eHnoteMasterDataService.getavgConsultationTimeInfo();
            var eee = new Date(1980, 1, 1, 0, 0, 0);
            eee.setHours(app_startingTime.substring(0, 2), app_startingTime.substring(3, 5), 0);
            eee.setMinutes(eee.getMinutes() + $scope.dffTime);
            var lowm = eee.getMinutes();
            if (lowm < 10) lowm = "0" + lowm;
            sdate = eee.getHours() + ":" + lowm;
            $scope.EndtimeVAlue = sdate;
        }
    };
    $scope.CallPreBilling = function (item) {
        if ($scope.IsDynamicCheckInMandatory === true) {
            var params = {
                "AppointmentId": item.AppointmentID || 0,
            };
            eHnoteMainAppointmentService.GetLatestDynamicStatusRoomById(params).then(function (resp) {
                if (resp.data.Status === 'Success') {

                    if (resp.data.rows.length !== 0) {
                        var DynamicStatusarray = resp.data.rows[0];
                        $scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                        $scope.cacheStorageItem.RoomId = DynamicStatusarray.RoomId || 0;
                        $scope.cacheStorageItem.PreviousCounterId = DynamicStatusarray.PreviousCounterId || 0;
                        $scope.cacheStorageItem.NextCounterId = DynamicStatusarray.NextCounterId || 0;
                        $scope.cacheStorageItem.PatientID = DynamicStatusarray.PatientId || 0;
                        $scope.cacheStorageItem.patientStatus = DynamicStatusarray.Status || "";
                        $scope.cacheStorageItem.AssignedUserId = DynamicStatusarray.AssignedUserId || 0;

                        if ($scope.cacheStorageItem.patientStatus === 'Waiting' && ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 3 || $scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 16 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57)) {
                            $scope.Time = $filter("date")(new Date(), "HH:mm");
                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "PatientId": $scope.cacheStorageItem.PatientID,
                                "AppointmentId": item.AppointmentID,
                                "RoomId": $scope.cacheStorageItem.RoomId,
                                "RoomTypeId": 9,
                                "NextCounterId": $scope.cacheStorageItem.RoomTypeId,
                                "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                                "StartTime": $scope.Time,
                                "PatientDynamicStatusId": 0,
                                "Status": "Active",
                                "DoctorId": item.DoctorID || null,
                                "TechnicianId": null,
                                "OptomId": null,
                                "DilationAssistantId": null,
                                "CounsellorId": null,
                                "IsCheckedOut": 2,
                                "ARId": null,
                                "BillingUserId": null,
                                "RoleId": $scope.userLoginDetails.RoleID
                            }
                            if (params.RoomTypeId === 9) {
                                params.BillingUserId = $scope.cacheStorageItem.AssignedUserId;

                            }
                            eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                            }, function (err) {
                                console.log(err);

                            });
                        }
                    } else {
                        $scope.IsPatientChecked = false;
                        $scope.cacheStorageItem.patientStatus = "";
                    }

                }


            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }
        $scope.StartAutoRefreshAppointment();
        item.CaptureBillingFrom = "Appointment";

        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        item.PatientID = item.PatientID;
        item.MasterPatientId = item.MasterPatientId;
        item.Gender = item.PatientDetails.Gender || "";
        item.PatientGSTNO = item.PatientDetails.PatientGSTNO || "";
        if (item.BranchDetails != undefined) {
            item.BranchArea = item.BranchDetails.Area || "";
        } else {
            item.BranchArea = "";
        }
        if (item.PaymentTypeId === 1) {
            $scope.cacheStorageItem.PaymentType = 'Self';
            $scope.cacheStorageItem.BillingCategoryType = 'General';
        } else {
            $scope.cacheStorageItem.PaymentType = 'Insurance';
            $scope.cacheStorageItem.BillingCategoryType = item.InsuranceType;

        }
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        if (item.PaymentTypeId === 1) {
            $scope.cacheStorageItem.PaymentType = 'Self';
            $scope.cacheStorageItem.BillingCategoryType = 'General';
        } else {
            $scope.cacheStorageItem.PaymentType = 'Insurance';
            $scope.cacheStorageItem.BillingCategoryType = item.InsuranceType;

        }

        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $location.url("/appointmentbilling");

    };

    $scope.CreateNewBilling = function () {
        object = { "CaptureBillingFrom": "AppointmentNewBilling" };
        $rootScope.patientdetailesConsultation = false;
        eHnoteMasterDataService.addAppointmentInfo(object);
        $location.url("/appointmentbilling");
    };

    $scope.CallBilling = function (item) {

        item.CaptureBillingFrom = "Appointment";
        eHnoteMasterDataService.addAppointmentInfo(item);
        $location.url("/appointmentbilling");
    };
    $scope.tmpTodayValue = $filter('date')(new Date(), "yyyy-MM-dd");
    $scope.chkTodayDate = function (d1) {
        var tmpd1 = $filter('date')(new Date(d1), "yyyy-MM-dd");
        if (tmpd1 === $scope.tmpTodayValue) {
            return true;
        } else {
            return false;
        }
    };
    $scope.chkFutureDate = function (d1) {
        var tmpd1 = $filter('date')(new Date(d1), "yyyy-MM-dd");
        if (tmpd1 < $scope.tmpTodayValue || tmpd1 === $scope.tmpTodayValue) {
            return true;
        } else {
            return false;
        }
    };


    function GetMedicineType(item) {
        var med = '';
        switch (item.MedicineType) {
            case "TAB":
                med = "TABLET";
                break;
            case "T":
                med = "TABLET";
                break;
            case "INJ":
                med = "injection";
                break;
            case "GEL":
                med = "gel";
                break;
            case "CAP":
                med = "capsules";
                break;
            case "SUS":
                med = "oral suspension";
                break;
            case "OIN":
                med = "Ointment";
                break;
            case "CRE":
                med = "cream";
                break;
            case "SOL":
                med = "solution";
                break;
            case "SYR":
                med = "syrup";
                break;
            case "LIQ":
                med = "liquid";
                break;
            case "DRO":
                med = "drops";
                break;
            case "VIA":
                med = "vial";
                break;
            case "KIT":
                med = "kit";
                break;
            case "SPR":
                med = "spray";
                break;
            case "LOT":
                med = "lotion";
                break;
            case "RES":
                med = "respirator";
                break;
            case "INH":
                med = "inhaler";
                break;
            case "SUP":
                med = "supplement";
                break;
            case "INS":
                med = "Insulin";
                break;
        }
        return med;
    }
    function ConcatMeal(item) {
        var meal = "";
        if (item.MedicineType === "SUS" || item.MedicineType === "LIQ" || item.MedicineType === "SYR" || item.MedicineType === "SOL") {
            if (item.Dosage1.toString() === "" && item.Dosage2.toString() === "" && item.Dosage4.toString() === "") {
                meal += '-';
            } else {
                meal += item.Dosage1 === "" ? "0-" : item.Dosage1 + "-";
                meal += item.Dosage2 === "" ? "0-" : item.Dosage2 + "-";
                meal += item.Dosage4 === "" ? "0" : item.Dosage4 + "(ml)";
            }
        } else if (item.MedicineType === "DRO") {
            if (item.Dosage1.toString() === "" && item.Dosage2.toString() === "" && item.Dosage4.toString() === "") {
                meal += '-';
            } else {
                meal += item.Dosage1 === "" ? "0-" : item.Dosage1 + "-";
                meal += item.Dosage2 === "" ? "0-" : item.Dosage2 + "-";
                meal += item.Dosage4 === "" ? "0" : item.Dosage4 + " Drop(s)";
            }
        } else {
            if (item.Dosage1.toString() === "" && item.Dosage2.toString() === "" && item.Dosage4.toString() === "") {
                meal += '-';
            } else {
                meal += item.Dosage1 === "" ? "0-" : item.Dosage1 + "-";
                meal += item.Dosage2 === "" ? "0-" : item.Dosage2 + "-";
                meal += item.Dosage4 === "" ? "0" : item.Dosage4 + "";
            }
        }
        return meal;
    }
    $scope.GetSpeciality = function () {
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var speciality_data;
        if (doctorinfo.doctordata.UserSpecilityDetails[0] !== undefined && doctorinfo.doctordata.UserSpecilityDetails[0] !== '') {
            if (doctorinfo.doctordata.UserSpecilityDetails[0].CustomSpecialityDesc !== undefined && doctorinfo.doctordata.UserSpecilityDetails[0].CustomSpecialityDesc !== '') {
                speciality_data = doctorinfo.doctordata.UserSpecilityDetails[0].SpecialityDesc + "\n" + "(" + doctorinfo.doctordata.UserSpecilityDetails[0].CustomSpecialityDesc + ")";
            } else {
                speciality_data = doctorinfo.doctordata.UserSpecilityDetails[0].SpecialityDesc;
            }
        } else {
            speciality_data = "";
        }
        return speciality_data;
    };
    $scope.showDoctorList = function () {
        $scope.showDoctorListing = true;
    };
    $scope.AgeSplit = function (Age) {
        if (Age.toString().indexOf('.') !== -1) {
            var agefrmdb = Age.toString().split('.');
            if (agefrmdb[0] === 0) {
                $scope.ageSplits = agefrmdb[1] + 'm';
            } else {
                $scope.ageSplits = agefrmdb[0] + 'y ' + agefrmdb[1] + 'm';
            }
        } else {
            var agefrmdb = Age.toString().split(' ');
            if (agefrmdb.length === 1) {
                $scope.ageSplits = agefrmdb[0] + 'y';
            } else {
                $scope.ageSplits = agefrmdb[0] + 'y', agefrmdb[1] + 'm';
            }
        }
        return $scope.ageSplits;
    };







    $scope.changeLang = function () {
        if ($scope.changeTo === 'Hungarian') {
            $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
            $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
            $scope.changeTo = 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
        }
    };
    function setCalendarSlot() {
        if ($scope.AppListselectedclinic !== undefined) {
            if ($scope.AppListselectedclinic.ExtDetails !== undefined && $scope.AppListselectedclinic.ExtDetails.MinPerCase !== undefined) {
                sliceTime = $scope.AppListselectedclinic.ExtDetails.MinPerCase;
                avgConsultationTime = sliceTime;
                angular.element('#calControl').fullCalendar('option', {
                    defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
                    slotDuration: '00:' + avgConsultationTime + ':00'
                });
                setTimeout(function () {
                    angular.element('.fc-scroller').scrollTop(0);
                    if ($('.fc-now-indicator-line').offset()) {
                        angular.element('.fc-scroller').scrollTop($('.fc-now-indicator-line').offset().top - 300);
                    }
                }, 1000);
            }
        }
    }
    angular.element('body').on('mouseenter', '#calControl .fc-agendaDay-view .fc-slats .fc-widget-content', function (event) {
        if (!angular.element(this).hasClass('fc-axis')) {
            angular.element(this).addClass('fc-time-hover');
        }
    });
    angular.element('body').on('mouseleave', '#calControl .fc-agendaDay-view .fc-slats .fc-widget-content', function (event) {
        angular.element(this).removeClass('fc-time-hover');
    });
    var rebookEvent = function (event, jsEvent, view) {


        $scope.PageName = 'rebook';
        var patientID = event.rowData.PatientInfo.patientID;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.cacheStorageItem.patientid = patientID;
        $scope.cacheStorageItem.PatientName = event.rowData.PatientInfo.fullName;
        $scope.cacheStorageItem.EmailID = event.rowData.PatientInfo.EmailId ? event.rowData.PatientInfo.EmailId : '';
        $scope.cacheStorageItem.CountryCode = event.rowData.PatientInfo.CountryCode ? event.rowData.PatientInfo.CountryCode : '',
            $scope.cacheStorageItem.PhoneNumber = event.rowData.PatientInfo.MobileNo ? event.rowData.PatientInfo.MobileNo : '';
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.ispatientExistsval = true;
        $scope.calenderDate = undefined;
        if (event.rowData.doctorVisitRsnId !== undefined) {
            $rootScope.appointment_type = event.rowData.doctorVisitRsnId.toString();
        }

        if ($scope.OpAccess.bookAppointmentAccessFromAppList) {
            $scope.AppDate = "";
            // openAppPopup();
            BookApptPopupOpened();
        }
    };
    $scope.checkServiceList = function () {
        $scope.Nursesuccesslist = {};
        $scope.collectionnursesuccessclr = [];
        $scope.collectionclr = [];
        $scope.nurselistwithcolors = {};
        var Servicedate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        if (doctorInfo.doctordata.UserAddress !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails !== undefined &&
            doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            var params = {
                "HospitalCD": "",
                "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ServiceDate": Servicedate
            };
        }
    };
    $scope.getDateDetails = function (date) {
        $scope.referredappointmentdate = $filter('date')(new Date(date), "yyyy-MM-dd");
        $scope.checkServiceList();
    };
    function structureDoctors(data) {
        $scope.sDocArray = [];
        if (data.length !== 0) {
            $scope.sDocArray = angular.copy(data);
        }
        $scope.AllDoctorsList = [];
        $scope.AllCounselorsList = [];
        $scope.cacheStorageItem.AllDoctorsList = [];
        $scope.cacheStorageItem.AllCounselorsList = [];
        angular.forEach($scope.sDocArray, function (item, index) {
            if (item.Doctors !== undefined && item.Doctors.length !== 0 && item.Doctors !== null) {
                $scope.AllDoctorsList = $scope.AllDoctorsList.concat(item.Doctors);
                $scope.AllCounselorsList = $scope.AllDoctorsList.concat(item.Doctors);
            }
        });
        if ($scope.AllDoctorsList.length > 0) {
            $scope.AllDoctorsList = _.uniq($scope.AllDoctorsList, false, function (p) { return p.DoctorID; });
            $scope.AllDoctorsList = $filter("filter")($scope.AllDoctorsList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
            });
        }
        $scope.AllCounselorsList = _.uniq($scope.AllCounselorsList, false, function (p) { return p.DoctorID; });
        $scope.AllCounselorsList = $filter("filter")($scope.AllCounselorsList, function (item) {
            return item.RoleId === 18;
        });

        $scope.cacheStorageItem.AllDoctorsList = $scope.AllDoctorsList;
        $scope.cacheStorageItem.AllCounselorsList = $scope.AllCounselorsList;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    }

    //onclick();
    $scope.loadCalendarSettings = function (item) {
        switch (item) {
            case "smssettings":

                $location.url("/settings?screen=" + SMS);
                break;
            case "calendertimings":

                $location.url("/profile?screen=" + Practice);
                break;
            case "manageusers":

                $location.url("/manageusers");
                break;
        }
    };
    $scope.close = function () {
        $scope.addnewpat = false;
    };
    function OnGetPatientSuccess(tmpData) {
        $scope.SearchResultNotShow = false;
        if (tmpData.count > 0) {
            var data = tmpData;
            var patients = [];
            var patientsdata = data.rows;
            var boolval = !isNaN($scope.SearchBy);
            $scope.showRegisterPatient = false;
            if (data.count === 0 && boolval && $scope.SearchBy.length === 10) {
                $scope.SearchResultNotShow = true;
            } else if (data.count === 0 && $scope.SearchBy.length >= 3) {
                $scope.SearchResultNotShow = true;
            }
            $scope.close = function () {
                $scope.addnewpat = false;
            };
            $scope.noresult = false;
            $scope.showloading = false;
            if (data.count === 0 && $scope.patients.length === 0) {
                $scope.noresult = true;
            }
            $scope.pageno += 1;
            $scope.patients = [];
            if (patientsdata.length > 0) {
                $scope.patients = patientsdata;
            } else {
                $scope.SearchResultNotShow = true;
            }
            $scope.totalpatvalue = {};
            $scope.totalpatvalue = $scope.patients;
        }
    }
    $scope.settingList = function () {
    };
    $scope.cleardoctorall = function () {
        $scope.searchtxtb.txt2 = "";
    };
    function getSelectedDrSpeciality(doctorList, doctorid) {
        var spl = "";
        for (i in doctorList) {
            if (doctorList[i].DoctorID === doctorid) {
                if (doctorList[i].SpecialityCD !== undefined && doctorList[i].SpecialityCD[1] !== undefined) {
                    spl = GetSpecialityById(doctorList[i].SpecialityCD[1]);
                } else {
                    spl = "";
                }
            }
        }
        return spl;
    }
    function GetSpecialityById(splCode) {
        var spl = "";
        angular.forEach(doctorInfo.specialitylist, function (item) {
            if (item.DoctorSpecialityID === splCode) {
                spl = item.DoctorSpecialityDesc;
                return spl;
            }
        });
        return spl;
    }



    $scope.editPatient = function (item) {
        if ($scope.RoleName === "RECPTNIST" || $scope.AppListselectedclinic.ExtDetails.HospitalID !== doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            alertify.log("You do not have access to view this feature, Kindly contact your Administrator");
            return;
        }
        if (item.DoctorID !== eHnoteMasterDataService.getLoginId()) {
            alertify.log("You do not have access to view this feature, Kindly contact your Administrator");
            return;
        }
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mypatientUpdate.html',
            controller: 'EhnoteUpdatePatintInfoCtrl',
            resolve: {
                items: function () {
                    return item;
                }
            }
        });
        $scope.modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
        var cleanUpdatePatientCloseMdl = $rootScope.$on("CallUpdatePatientCloseMdl", function (event) {
            $scope.modalInstance.dismiss('cancel');
        });
    };




    function InitialiseSearchParam() {
        $scope.patients = [];
        $scope.morepatientdata = true;
        prevpagno = 0;
        pageno = 0;
        $scope.pageno = 1;
    }
    function OnGetSearchPatientSuccess(data) {
        var chkSearchParam = eHnoteMasterDataService.getPatientSearchInfo();
        $scope.showRegisterPatient = false;
        $scope.patients = data.rows;
        if (data.rows.length === 0 && $scope.SearchBy.length >= 5) {
            $scope.showRegisterPatient = true;
        }
        var boolval = !isNaN($scope.SearchBy);
        if (data.message === undefined && data.rows.length === 0 && boolval && $scope.SearchBy.length === 10) {
            $timeout(function () {
                if (data.rows.length === 0) {
                    $scope.addnewpat = true;
                }
            }, 100);
        }
    }
    function OnGetPatientError(data) {
    }
    $scope.changePatientPage = function () {

        $scope.loadAppointments($scope.selectedDoctor, '');
    };
    $scope.selectOptometrist = function (selectedDr) {
        if (selectedDr.FullName === "All Optometrists") {
            $scope.SelectedOptometristId = "";
        } else {
            $scope.SelectedOptometristId = selectedDr.DoctorID;
        }
        $scope.selectedOptometrist = selectedDr;
        var obj = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserBranchId": 0 };
        //  $scope.loadAppointments(obj);
    };
    $scope.selectARAssitant = function (selectedDr) {
        if (selectedDr.FullName === "All AR") {
            $scope.SelectedArId = "";
        } else {
            $scope.SelectedArId = selectedDr.DoctorID;
        }
        $scope.selectedArObject = selectedDr;
        var obj = { "DoctorID": 0, "FullName": "All AR", "AddressID": 0, "MinPerCase": 15, "UserBranchId": 0 };
        // $scope.loadAppointments(obj);
    };

    $scope.selectArAssistant = function (selectedDr) {
        if (selectedDr.FullName === "All AR") {
            $scope.SelectedArId = "";
        } else {
            $scope.SelectedArId = selectedDr.DoctorID;
        }
        $scope.selectedArObject = selectedDr;
        var obj = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserBranchId": 0 };
        $scope.loadAppointments(obj);
    };

    $scope.showAppointmtlistError = false;
    $scope.showSearchList = false;


    function LoadAppointmentlist(data) {
        $scope.BookedAppointmentList = [];
        $scope.filteredAppointmentArray = [];

        angular.forEach(data, function (item, index) {
            var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
            var val = array_list[Math.floor(Math.random() * array_list.length)];
            var datetime = item.ConsultationDt + "T" + item.StartTime;
            //var CurrentTime = $filter("date")(new Date(datetime), "HH:mm a");
            var ConvertDateStartTime = $filter('date')(datetime, "hh:mm a");
            var ConvertWalkInTime = $filter('date')(item.WalkInTime, "hh:mm a");
            var ConvertWalkOutTime = $filter('date')(item.WalkOutTime, "hh:mm a");

            var refmobileno = "";
            if (item.Patient.ReferralMobileNo != 0) {
                refmobileno = item.Patient.ReferralMobileNo;
            }
            if (item.Patient.ReferralContactNo != 0) {
                refmobileno = item.Patient.ReferralContactNo;
            }

            $scope.patientmnumber = item.Patient.MobileNo;
            $scope.patientmnumber = $scope.patientmnumber || "";
            if ($scope.patientmnumber === "" || $scope.patientmnumber === "0") {
                var obj = eHnoteUserDataService.UsMobileFormatChange(item.MobileNo);
                item.MobileNo1 = obj.UsFormatMobileNumber;
                item.Patient.MobileNoformate = item.MobileNo1 || "";
            } else {
                /*item.Patient.MobileNoformate = item.Patient.PhCntryCD + " " + $scope.patientmnumber;*/
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.patientmnumber);
                item.MobileNo2 = obj.UsFormatMobileNumber;
                item.Patient.MobileNoformate = item.MobileNo2;
            }



            item.AppointmentConfirmationText = "";
            //if (item.IsNoShowAppointment) {
            //    item.AppointmentConfirmationText = "No Show";
            //} else if (item.IsWaitingListAppointment) {
            //    item.AppointmentConfirmationText = "Waiting";
            //} else if (item.AppointmentStatus == 'C') {
            //    item.AppointmentConfirmationText = "Cancelled";
            //} else {
            //    item.AppointmentConfirmationText = item.IsConfirmedAppointment ? "Confirmed" : "Not Confirmed";
            //}

            //if (item.ConfirmationStatusId === 1) {
            //    item.AppointmentConfirmationText = "Confirmed";
            //}
            //else if (item.ConfirmationStatusId === 3) {
            //    item.AppointmentConfirmationText = "Waiting";
            //} else if (item.ConfirmationStatusId === 4) {
            //    item.AppointmentConfirmationText = "Cancelled";
            //} else {
            //    item.AppointmentConfirmationText = "Not Confirmed";
            //}

            object = {
                "HospitalId": item.HospitalId,
                "SeqNo": item.SeqNo,
                "AppointmentConfirmationText": item.AppointmentConfirmationText,
                "ConfirmationStatusId": item.ConfirmationStatusId,
                "AppointmentID": item.AppointmentId,
                "IsConsultationAvail": item.IsConsultationAvail,
                "ConsultationId": item.ConsultationId,
                "DayCD": item.DayCD,
                "ConsultationDt": item.ConsultationDt,
                "StartTime": item.StartTime,
                "ConvertDateStartTime": ConvertDateStartTime,
                "EndTime": item.EndTime,
                "PatientID": item.Patient.PatientID,
                "MasterPatientId": item.MasterPatientId,
                "VisitUserTypeID": item.VisitUserTypeID,
                "DoctorID": item.DoctorId,
                "VisitReason": item.VisitReason,
                "BranchName": item.BranchName,
                "BranchEmail": item.BranchEmail,
                "BranchMobile": item.BranchMobile,
                "DoctorFullName": item.DoctorName,
                "LastVisitedDate": item.LastVisitedDate || null,
                "DoctorEmail": item.DoctorEmail,
                "DoctorMobile": item.DoctorMobile,
                "DoctorDesignation": item.Designation,
                "DoctorSpecialization": item.SpecializationName,
                "CountryCode": item.CountryCode,
                "FirstTimeVisit": item.FirstTimeVisit,
                "DoctorVisitRsnID": item.DoctorVisitRsnID,
                "AppointmentStatus": item.AppointmentStatus,
                "TokenNumber": item.TokenNumber,
                "VisitRsnID": item.VisitRsnID,
                "PreliminaryNotes": item.PreliminaryNotes,
                "ReferralSourceDtls": item.ReferralSourceDtls,
                "Status": item.Status,
                "colors": val,
                "OtherVisitRsn": item.OtherVisitRsn,
                "ReferralSourceId": item.ReferralSourceId,
                "ReferralSourceName": item.ReferralSourceName || "",
                "PatientDetails": item.Patient,
                "S3URL": item.S3URL || '',
                "PatientName": item.Patient.FullName,
                "DoctorSpecializationId": item.SpecializationId,
                "UserBranchId": item.UserBranchId,
                "OptometristId": item.OptometristId ? item.OptometristId : "",
                "OptometristName": item.OptometristName ? item.OptometristName : "",
                "ARassistantId": item.ARassistantId ? item.ARassistantId : 0,
                "ARassistantName": item.ARassistantName ? item.ARassistantName : "",
                "DoctorGender": item.DoctorGender,
                "AvgConsultationTime": item.AvgConsultationTime,
                "DoctorRoleId": item.DoctorRoleId,
                "BranchId": item.BranchId,
                "BranchDetails": item.BranchDetails,
                "OrgGSTNO": item.OrgGSTNO,
                "Sno": item.Sno,
                "AppointmentType": item.AppointmentType,
                "PreviouslyDoneSurgery": "",
                "PreviouslyDoneSurgeryId": "",
                "IscheckedIn": item.IscheckedIn,
                "IsCheckedOut": item.IsCheckedOut,
                "MobileNo": item.MobileNo,
                "ShowSubcontent": false,
                "RootAppointmentId": item.RootAppointmentId,
                "ParentAppointmentId": item.ParentAppointmentId,
                "ParentAppointmentDoctorName": item.ParentAppointmentDoctorName,
                "BillingId": item.BillingId,
                "IsBilled": item.BillingId === 0 ? false : true,
                "TreatmentPlanId": item.TreatmentPlanId,
                "DilationStartTime": item.DilationStartTime || "",
                "DilationMedicationId": item.DilationMedicationId,
                "DilationMedicationName": item.DilationMedicationName,
                "OrganId": item.OrganId || "",
                "DilationEndTime": item.DilationEndTime || "",
                "Conunter": "00:00",
                "ItemScope": "Item" + item.PatientID,
                "isDilationstarted": false,
                "startConsultationEntryAccess": false,
                "caseHistoryAccess": true,
                "billingAccess": false,
                "FileUploadsAcces": false,
                "EnterVitalsAcces": false,
                "EditAppointmentAccess": true,
                "CancelAppointmentAccess": true,
                "EditConsultationAccess": false,
                "CaseSheetAccess": false,
                "ChildAppointmentId": item.ChildAppointmentId,
                "ChildAppointmentDate": item.ChildAppointmentDate,
                "ChildAppointmentBookedStatus": item.ChildAppointmentBookedStatus,
                /*"WalkInTime": item.WalkInTime || "",*/
                // "WalkInTime": ConvertWalkInTime || "",
                /*"WalkOutTime": item.WalkOutTime || "",*/
                // "WalkOutTime": ConvertWalkOutTime || "",
                "IsCheckInMandatory": item.IsCheckInMandatory,
                "IsAppointmentBillingStarted": item.IsAppointmentBillingStarted,
                "IsAlreadyConsultationStarted": false,
                "FollowUpDate": item.FollowUpDate,
                "InsuranceType": item.InsuranceType || '',
                "AppointmentPatientTypeId": item.AppointmentPatientTypeId,
                "IsAppointmentConfirmed": item.IsConfirmedAppointment || false,
                "IsTeleMedicineSlot": item.IsTeleMedicineSlot,
                "IsPrefix": item.IsPrefix,
                "IsDesignationRemove": false,
                "IsConsultationFollowUp": item.IsConsultationFollowUp,
                "BranchContactNo": item.BranchContactNo,
                "AttenderName": item.AttenderName || '',
                "masterQuestions": item.masterQuestions || [],
                "InvestigationList": item.InvestigationList || [],
                "IsPaymentPending": item.IsPaymentPending,
                "IsConfirmedAppointment": item.IsConfirmedAppointment,
                "PreConsultationFormStatus": item.PreConsultationFormStatus || '',
                "PreConsultationFormStatusId": item.PreConsultationFormStatusId,
                "BookingType": item.BookingType || '',
                "BookingTypeId": item.BookingTypeId,
                "ReferralMobileNo": item.Patient.ReferralMobileNo || '',
                "ReferralContactNo": item.Patient.ReferralContactNo || '',
                "HospitalEquipmentId": item.HospitalEquipmentId,
                "HospitalEquipmentName": item.HospitalEquipmentName,
                "CommunicationEmailId": item.CommunicationEmailId,
                "CommunicationMobileNo": item.CommunicationMobileNo,
                "CommunicationCountryCode": item.CommunicationCountryCode,
                "PatientReferralMobileNo": refmobileno,
                "BranchSubSpecializationId": item.BranchSubSpecializationId,
                "SpecializationId": item.SpecializationId,
                "SpecializationName": item.SpecializationName,
                "SubSpecializationId": item.SubSpecializationId,
                "SubSpecializationName": item.SubSpecializationName,
                "PaymentTypeId": item.PaymentTypeId || '1',
                "OrgInsuranceTpaId": item.OrgInsuranceTpaId || "",
                "IsDilationDone": item.IsDilationDone,
                "CheckinStatusId": item.CheckinStatusId,
                "ShowStartConsultationForDynamicStatus": false,
                "showSendTo": false,
                "showcheckinPopup": false,
                "WaitTime": item.WaitTime || "",
                "RoomType": item.RoomType || "",
                "ActiveStartTime": item.ActiveStartTime || "",
                "TrackerDetails": item.TrackerDetails || [],
                "NewTokenNumber": "",
                "IsPatientCallActive": false,
                "VisitTypeId": item.VisitTypeId || 0,
                "AppointmentTypeId": item.AppointmentTypeId || 0,
                "SurgeryId": item.SurgeryId || 0,
                "SurgeryName": item.SurgeryName || "",
                "PatientInsuranceList": item.PatientInsuranceList || [],
                "PatientMrNo": item.Patient.PatientDisplayId || "",
                "PatientOldMrNo": item.Patient.OldMRNo || "",
                "ProfileStatusMasterId": item.ProfileStatusMasterId || 3,
                "ProfileStatusName": item.ProfileStatusName || "Not Worked",
                "IsNoChargePatient": item.IsNoChargePatient,
                "LanguageName": item.Patient.LanguageName || "",
                "ReminderDate": item.ReminderDate,
                "ReminderRemarks": item.ReminderRemarks || "",
                "CreatedBy": item.CreatedBy || "",
                "PatientTagList": item.PatientTagList || [],
                "IsWaitingListAppointment": item.IsWaitingListAppointment || false,
                "IsNoShowAppointment": item.IsNoShowAppointment || false,
                "VisitReasonName": item.ReminderVisitReasonName,
                "ReminderType": item.ReminderType,
                "ReminderTypeID": item.ReminderTypeID,
                "ReminderStatusId": item.ReminderStatusId,
                "ReminderStatus": item.ReminderStatus,
                "PatientAppointmentReminderId": item.PatientAppointmentReminderId,
                "SecondUserFullName": item.SecondUserFullName || '',
                "ReminderAppointmentDate": item.ReminderAppointmentDate || '',
                "IsAddtoRecall": item.IsAddtoRecall || false,
                "PriorityId": item.PriorityId,
                "PriorityName": item.PriorityName,
                "TypeId": item.TypeId || 0,
                "FollowUpId": item.FollowUpId || 0,
            };




            if ($scope.queueSettingObj.IsEnabled) {
                object.NewTokenNumber = item.NewTokenNumber;
            }

            if (object.ChildAppointmentId !== 0) {
                object.FollowUpDate = object.ChildAppointmentDate;
            }




            var isCurrentDate = $scope.chkFutureDate($scope.referredappointmentdate);
            if (isCurrentDate) {
                if ($scope.DoctorId === object.DoctorID || $scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 59 || $scope.userLoginDetails.RoleID === 61) {

                    if ($scope.OrganizationSettingsData.BillingSettings != undefined) {
                        if ($scope.OrganizationSettingsData.BillingSettings.IsBillingMandatoryForStartConsultation === 1) {
                            if (object.BillingId === 0) {
                                object.startConsultationEntryAccess = false;
                            } else {
                                object.startConsultationEntryAccess = true;
                            }
                        } else {
                            if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O") {
                                object.startConsultationEntryAccess = true;
                            }
                        }
                    } else {
                        if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O") {
                            object.startConsultationEntryAccess = true;
                        }
                    }


                    if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && object.AppointmentStatus === "E") { // added by sabarish
                        object.startConsultationEntryAccess = false;
                    }



                }
                if ($scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57) {
                    if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O") {
                        if (object.IsTeleMedicineSlot) {
                            object.startConsultationEntryAccess = false;
                        } else {
                            if ($scope.OrganizationSettingsData.ConsultationSettings !== undefined) {
                                if ($scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
                                    object.startConsultationEntryAccess = false;
                                } else {
                                    object.startConsultationEntryAccess = true;
                                }
                            }
                        }

                    }
                }
            }


            if (object.AppointmentStatus === "E" || object.AppointmentStatus === "D") {//edit consulation access
                if ($scope.DoctorId === object.DoctorID) {
                    object.EditConsultationAccess = true;
                }
            }
            if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 10) && (object.AppointmentStatus === "D" || object.AppointmentStatus === "O")) {
                object.EditConsultationAccess = true;
            }
            if (isCurrentDate) {//file upload accesss

                if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O" || object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 11 || object.AppointmentStatus === "D") {
                    object.FileUploadsAcces = true;
                }

            }
            if (isCurrentDate) {//Vitals access

                if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O" || $scope.userLoginDetails.RoleID === 11 || object.AppointmentStatus === "D") {
                    object.EnterVitalsAcces = true;
                }

            }

            if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O" || object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 11 || object.AppointmentStatus === "D") {
                object.billingAccess = true;
            }


            if (object.AppointmentStatus === "C" || object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 10) {
                object.CancelAppointmentAccess = false;
            }

            if (object.AppointmentStatus === "E" || object.AppointmentStatus === "D") { //edit access
                object.EditAppointmentAccess = false;
            }
            if ($scope.userLoginDetails.RoleID === 2 || $scope.userLoginDetails.RoleID === 11 || $scope.userLoginDetails.RoleID === 58) {
                if (object.AppointmentStatus === "O" || object.AppointmentStatus === "B" || object.AppointmentStatus === "D") {
                    object.CaseSheetAccess = true;
                }

                if ($scope.OrganizationSettingsData.BillingSettings != undefined) {
                    if ($scope.OrganizationSettingsData.BillingSettings.IsBillingMandatoryForStartConsultation === 1 && !object.IsAppointmentBillingStarted) {// added by sabarish
                        object.CaseSheetAccess = false;
                    }
                }


            }
            if (object.AppointmentType === "Surgery") {
                object.startConsultationEntryAccess = false;
                object.caseHistoryAccess = false; //enable for all
                object.billingAccess = true;
                object.FileUploadsAcces = false;
                object.EnterVitalsAcces = false;
                object.EditAppointmentAccess = false;
                object.CancelAppointmentAccess = false;
                object.EditConsultationAccess = false;
                object.CaseSheetAccess = false;
            }
            if (object.AppointmentStatus === "C" || object.AppointmentStatus === "E") {
                object.StartVideoAccess = false;
            }
            else {
                if (object.IsTeleMedicineSlot) {
                    object.StartVideoAccess = true;
                }
            }
            if (object.masterQuestions.length > 0) {
                var List = $filter("filter")(object.masterQuestions, {
                    "IsActive": true
                }, true);
                if (List.length <= 2) {
                    $scope.masterQuestionInd = '0';
                }
                if (List.length === 3) {
                    $scope.masterQuestionInd = '1';
                }
                if (List.length >= 4) {
                    $scope.masterQuestionInd = '2';
                }
            }
            object.masterQuestionInd = $scope.masterQuestionInd;

            if ($scope.userLoginDetails.RoleID === 59) {
                var currentDt = $scope.getCurrentDate();
                currentDt = $filter('date')(new Date(currentDt), "dd-MMM-yyyy");
                if (currentDt === $scope.referredappointmentdate) {
                    if (object.AppointmentStatus === "E" || object.AppointmentStatus === "D") {
                        object.EditConsultationAccess = true;
                    }
                }
            }
            //if ($scope.IsDynamicCheckInMandatory) {
            //    if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43) {
            //        if ($scope.SubTab === 14 || $scope.SubTab === 15 || $scope.SubTab === 11 || $scope.SubTab === 12) {
            //            object.ShowStartConsultationForDynamicStatus = true;
            //        }
            //    }
            //    if ($scope.userLoginDetails.RoleID === 10) {//optom
            //        if ($scope.SubTab === 2 || $scope.SubTab === 7) {
            //            object.ShowStartConsultationForDynamicStatus = true;
            //        }
            //    }
            //    if ($scope.userLoginDetails.RoleID === 18) {//counsellor
            //        if ($scope.SubTab === 4 || $scope.SubTab === 9) {
            //            object.ShowStartConsultationForDynamicStatus = true;
            //        }
            //    }
            //    if ($scope.userLoginDetails.RoleID === 61) {//ar
            //        if ($scope.SubTab === 1 || $scope.SubTab === 6) {
            //            object.ShowStartConsultationForDynamicStatus = true;
            //        }
            //    }
            //    if ($scope.userLoginDetails.RoleID === 54) {//dilation
            //        if ($scope.SubTab === 3 || $scope.SubTab === 8) {
            //            object.ShowStartConsultationForDynamicStatus = true;
            //        }
            //    }
            //    if ($scope.userLoginDetails.RoleID === 55) {//investigator
            //        if ($scope.SubTab === 5 || $scope.SubTab === 10) {
            //            object.ShowStartConsultationForDynamicStatus = true;
            //        }
            //    }
            //}


            //if (object.TrackerDetails.length > 0) {
            //    angular.forEach(object.TrackerDetails, function (titem) {
            //        titem.isWaitingSlot = false;
            //        titem.isActiveSlot = false;
            //        titem.isCompletedSlot = false;
            //        titem.isWaitNormalSlot = false;
            //        titem.isWaitGreenSlot = false;
            //        titem.isWaitYellowSlot = false;
            //        titem.isWaitRedSlot = false;
            //        titem.isActiveNormalSlot = false;
            //        titem.isActiveGreenSlot = false;
            //        titem.isActiveYellowSlot = false;
            //        titem.isActiveRedSlot = false;
            //        titem.isCompletedNormalSlot = false;
            //        titem.isCompletedGreenSlot = false;
            //        titem.isCompletedYellowSlot = false;
            //        titem.isCompletedRedSlot = false;
            //        if (titem.UserId === 0 && titem.RoomTypeId !== 0) {
            //            titem.isWaitingSlot = true;

            //            var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
            //            // var apptDt = $filter('date')(new Date(item.consultationDt), "yyyy-MM-dd");
            //            //var apptDt = $filter('date')(new Date(object.ConsultationDt), "yyyy-MM-dd");
            //            var apptDt = object.ConsultationDt;
            //            var dresult = dateCompare(apptDt, currentDt);




            //            if (dresult) {


            //                var DiffMinutes = getcurrentTimeDifferenceMinutes(titem.WaitingStartTime);
            //                var waittimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
            //                titem.WaitTime = waittimec;


            //                if (DiffMinutes <= 5) {
            //                    titem.isWaitNormalSlot = true;
            //                }
            //                else if (DiffMinutes > 5 && DiffMinutes <= 10) {
            //                    titem.isWaitGreenSlot = true;
            //                }
            //                else if (DiffMinutes > 10 && DiffMinutes <= 15) {
            //                    titem.isWaitYellowSlot = true;
            //                }
            //                else if (DiffMinutes > 15) {
            //                    titem.isWaitRedSlot = true;
            //                }
            //            }
            //            else {



            //                var actSt = titem.WaitTime.split(':');
            //                var actSthour = parseFloat(actSt[0]) || 0;
            //                var actStmin = parseFloat(actSt[1]) || 0;
            //                var actStsec = parseFloat(actSt[2]) || 0;






            //                if (actSthour > 0) {
            //                    titem.isWaitRedSlot = true;
            //                } else {

            //                    if (DiffMinutes <= 5) {
            //                        titem.isWaitNormalSlot = true;
            //                    }
            //                    else if (DiffMinutes > 5 && DiffMinutes <= 10) {
            //                        titem.isWaitGreenSlot = true;
            //                    }
            //                    else if (DiffMinutes > 10 && DiffMinutes <= 15) {
            //                        titem.isWaitYellowSlot = true;
            //                    }
            //                    else if (DiffMinutes > 15) {
            //                        titem.isWaitRedSlot = true;
            //                    }

            //                    titem.WaitTime = actSt[1] + ":" + actSt[2];
            //                }




            //            }

            //        }
            //        else if (titem.UserId !== 0 && titem.RoomTypeId !== 0) {

            //            var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
            //            var apptDt = $filter('date')(new Date(object.ConsultationDt), "yyyy-MM-dd");
            //            var dresult = dateCompare(apptDt, currentDt)


            //            if (dresult) {
            //                var actSt = titem.ActiveStartTime.split(':');
            //                var actSthour = parseFloat(actSt[0]) || 0;
            //                var actStmin = parseFloat(actSt[1]) || 0;
            //                var actStsec = parseFloat(actSt[2]) || 0;

            //                var actEt = titem.ActiveEndTime.split(':');
            //                var actEthour = parseFloat(actEt[0]) || 0;
            //                var actEtmin = parseFloat(actEt[1]) || 0;
            //                var actEtsec = parseFloat(actEt[2]) || 0;

            //                if (actEthour == 0 && actEtmin === 0 && actEtsec == 0) {
            //                    if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
            //                        titem.isActiveSlot = true;

            //                        var activet = titem.WaitTime.split(':');
            //                        var activethour = parseFloat(activet[0]) || 0;
            //                        var activetmin = parseFloat(activet[1]) || 0;
            //                        var activetsec = parseFloat(activet[2]) || 0;

            //                        if (activethour > 0) {
            //                            titem.isActiveRedSlot = true;

            //                        }
            //                        else {

            //                            if (activetmin <= 5) {
            //                                titem.isActiveNormalSlot = true;
            //                            }
            //                            else if (activetmin > 5 && activetmin <= 10) {
            //                                titem.isActiveGreenSlot = true;
            //                            }
            //                            else if (activetmin > 10 && activetmin <= 15) {
            //                                titem.isActiveYellowSlot = true;
            //                            }
            //                            else if (activetmin > 15) {
            //                                titem.isActiveRedSlot = true;
            //                            }

            //                            titem.WaitTime = activet[1] + ":" + activet[2];

            //                        }
            //                        var DiffMinutes = getcurrentTimeDifferenceMinutes(titem.ActiveStartTime);



            //                        var ActiveTimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
            //                        console.log(ActiveTimec + "_ActiveTimec");
            //                        titem.ActiveTime = ActiveTimec;



            //                        //if (DiffMinutes <= 59) {
            //                        //    titem.ActiveTime = titem.ActiveTime;
            //                        //} else {
            //                        //    var newactivet = titem.ActiveTime.split(':');
            //                        //    var newactivethour = parseFloat(newactivet[0]) || 0;
            //                        //    var newactivetmin = parseFloat(newactivet[1]) || "00";
            //                        //    var newactivetsec = parseFloat(newactivet[2]) || "00";
            //                        //    titem.ActiveTime = newactivethour + ":" + newactivetmin + ":" + newactivetsec;


            //                        //}



            //                    }
            //                }
            //                else {
            //                    titem.isCompletedSlot = true;

            //                    var activet = titem.WaitTime.split(':');
            //                    var activethour = parseFloat(activet[0]) || 0;
            //                    var activetmin = parseFloat(activet[1]) || 0;
            //                    var activetsec = parseFloat(activet[2]) || 0;

            //                    if (activethour > 0) {
            //                        titem.isCompletedRedSlot = true;

            //                    }
            //                    else {

            //                        if (activetmin <= 5) {
            //                            titem.isCompletedNormalSlot = true;
            //                        }
            //                        else if (activetmin > 5 && activetmin <= 10) {
            //                            titem.isCompletedGreenSlot = true;
            //                        }
            //                        else if (activetmin > 10 && activetmin <= 15) {
            //                            titem.isCompletedYellowSlot = true;
            //                        }
            //                        else if (activetmin > 15) {
            //                            titem.isCompletedRedSlot = true;
            //                        }

            //                        titem.WaitTime = activet[1] + ":" + activet[2];
            //                    }

            //                    var newactivet = titem.ActiveTime.split(':');
            //                    var newactivethour = parseFloat(newactivet[0]) || 0;
            //                    var newactivetmin = parseFloat(newactivet[1]) || 0;
            //                    var newactivetsec = parseFloat(newactivet[2]) || 0;

            //                    if (newactivethour > 0) {

            //                    } else {
            //                        titem.ActiveTime = newactivet[1] + ":" + newactivet[2];
            //                    }

            //                }
            //            }
            //            else {



            //                var actSt = titem.WaitTime.split(':');
            //                var actSthour = parseFloat(actSt[0]) || 0;
            //                var actStmin = parseFloat(actSt[1]) || 0;
            //                var actStsec = parseFloat(actSt[2]) || 0;






            //                if (actSthour > 0) {
            //                    titem.isCompletedSlot = true;
            //                } else {

            //                    if (actStmin <= 5) {
            //                        titem.isCompletedNormalSlot = true;
            //                    }
            //                    else if (actStmin > 5 && actStmin <= 10) {
            //                        titem.isCompletedGreenSlot = true;
            //                    }
            //                    else if (actStmin > 10 && actStmin <= 15) {
            //                        titem.isCompletedYellowSlot = true;
            //                    }
            //                    else if (actStmin > 15) {
            //                        titem.isCompletedRedSlot = true;
            //                    }

            //                    titem.WaitTime = actSt[1] + ":" + actSt[2];
            //                }


            //                var newactivet = titem.ActiveTime.split(':');
            //                var newactivethour = parseFloat(newactivet[0]) || 0;


            //                if (newactivethour > 0) {

            //                } else {
            //                    titem.ActiveTime = newactivet[1] + ":" + newactivet[2];
            //                }
            //            }


            //        }


            //        if (titem.ActiveTime === undefined || titem.ActiveTime === null) {
            //            titem.ActiveTime = "00:00";
            //        }

            //    });

            //    var actSt = object.TrackerDetails[0].ActiveStartTime.split(':');
            //    var actSthour = parseFloat(actSt[0]) || 0;
            //    var actStmin = parseFloat(actSt[1]) || 0;
            //    var actStsec = parseFloat(actSt[2]) || 0;



            //    if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
            //        object.IsPatientCallActive = true;
            //    }

            //}

            $scope.BookedAppointmentList.push(object);
        });
        //angular.forEach($scope.BookedAppointmentList, function (object) {
        //    object.DilationStartTime = object.DilationStartTime || undefined;
        //    object.DilationEndTime = object.DilationEndTime || undefined;
        //    if (object.DilationStartTime !== undefined) {
        //        if (object.DilationEndTime === undefined) {
        //            object.isDilationstarted = true;
        //            object.ItemScope = $interval(function () { $scope.callAtInterval(object); }, 1000);
        //        } else {
        //            object.Conunter = "Done";
        //        }

        //    } else {
        //        object.isDilationstarted = false;
        //    }
        //});
        if ($scope.BookedAppointmentList.length > 0) {
            $scope.showSearchList = false;
            $scope.showAppointmtlistError = false;
        } else {
            $scope.showAppointmtlistError = true;
        }

        //angular.forEach($scope.BookedAppointmentList, function (item) {
        //    var arra = item.StartTime.split(':');
        //    var phour = $.trim(arra[0]);
        //    var pmin = $.trim(arra[1]);

        //    var startedTime = phour + ":" + pmin;
        //    item.DisplayStratTime = startedTime;
        //});

        // $scope.SubTab = 11;

        // $scope.cacheStorageItem.CurrentDateAppointmentList = $scope.BookedAppointmentList || [];
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        if ($scope.BookedAppointmentList.length > 0) {
            $scope.filteredAppointmentArray = $scope.BookedAppointmentList.filter(function (item) {
                return !(item.ReminderTypeID === 3 && [1, 2, 3, 4, 6].includes(item.ReminderStatusId));
            });
        } else {
            $scope.filteredAppointmentArray = angular.copy($scope.BookedAppointmentList);
        }

    }

    $scope.getConfirmationClass = function (item) {
        var defaultclass = 'text-orange';
        if (item.ConfirmationStatusId === 1) {
            defaultclass = "text-green";
        } else if (item.ConfirmationStatusId === 3) {
            defaultclass = "text-835dda";
        } else if (item.ConfirmationStatusId === 4) {
            defaultclass = "text-red";
        }
        return defaultclass;
    };

    $scope.getFavClassIcon = function (item) {

        var defaultclass = 'tracker-completed-time';

        if (item.isWaitingSlot) {
            if (item.isWaitNormalSlot) {
                defaultclass = 'tracker-completed-time';
            } else if (item.isWaitGreenSlot) {
                defaultclass = 'bgtracker-extra-time';
            } else if (item.isWaitYellowSlot) {
                defaultclass = 'bgtracker-wait-time';
            } else if (item.isWaitRedSlot) {
                defaultclass = 'bgtracker-over-time';
            }
        }

        if (item.isCompletedSlot) {

            if (item.isCompletedNormalSlot) {
                defaultclass = 'tracker-completed-time';
            } else if (item.isCompletedGreenSlot) {
                defaultclass = 'tracker-doctor-time';
            } else if (item.isCompletedYellowSlot) {
                defaultclass = 'tracker-counsoller-time';
            } else if (item.isCompletedRedSlot) {
                defaultclass = 'tracker-optometrist-time';
            }
        }

        if (item.isActiveSlot) {
            if (item.isActiveNormalSlot) {
                defaultclass = 'tracker-completed-time';
            } else if (item.isActiveGreenSlot) {
                defaultclass = 'tracker-doctor-time';
            } else if (item.isActiveYellowSlot) {
                defaultclass = 'tracker-counsoller-time';
            } else if (item.isActiveRedSlot) {
                defaultclass = 'tracker-optometrist-time';
            }
        }
        return defaultclass;
    };

    function dateCompare(d1, d2) {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        var result = false;
        if (date1 > date2) {
            result = false;
        } else if (date1 < date2) {
            result = false;
        } else {
            result = true;
        }

        return result;
    }

    function getcurrentTimeDifferenceMinutes(time) {
        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
        var waitingconcat = currentDt + " " + time;
        var startDate = new Date()
        var endDate = new Date(waitingconcat);
        var seconds = Math.round((startDate.getTime() - endDate.getTime()) / 1000);
        var minutss = Math.round(seconds / 60);
        return minutss || 0;
    }
    function getcurrentTimeDifferenceMinutesNew(time) {
        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
        var waitingconcat = currentDt + " " + time;
        var startDate = new Date()
        var endDate = new Date(waitingconcat);
        var seconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
        var minutss = Math.round(seconds / 60);
        return minutss || 0;
    }
    function getHrsnMinutesFormatfromMinutes(minutes) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        var hm = "";
        if (h == 0) {
            hm = m + ':00';
        } else {
            hm = h + ':' + m + ':00';
        }

        return hm;
    }


    $scope.editPatientPopup = function (item) {
        $scope.StartAutoRefreshAppointment();
        $scope.patientData = item;
        $scope.Parent.EditPatientComingFrom = "AppointmentList";
        $scope.Parent.EditPatientPopUp = $uibModal.open({
            "templateUrl": 'editpatientDirectivePopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg",
            //"windowClass": "inventory-full-popup"
        });
    };

    $scope.navtoEditPatient = function (item) {

        $scope.patientData = item;
        $scope.Parent.EditPatientComingFrom = "AppointmentList";

        var data = {
            "PatientData": item,
            "AppointmentData": "",
            "IsFromApptScreen": true
        }
        eHnoteMasterDataService.addPatientApptDataApptList(data);

        $location.url("/registerPatient");
    }

    $scope.$on("ReloadAppointmentList", function (event) {
        $scope.loadAppointments($scope.selectedDoctor, '');
        //SetupPopUp.dismiss("cancel");
    });

    $scope.SendToPatientRoomType = function (item) {
        $scope.patientData = item;
        $scope.Parent.EditPatientComingFrom = 'CheckInAppointmentList';

        $scope.Parent.EditPatientPopUp = $uibModal.open({
            "templateUrl": 'editpatientDirectivePopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg",
            // "windowClass": "inventory-full-popup"
        });
    }


    $scope.$on("ReloadCheckInAppointmentList", function (event, data) {
        $scope.Patientlistdata = data;
        $scope.RoomTypeList = [];
        eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {

            if ($rootScope.appointment_type !== '10') {
                $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 5 && item.Id !== 6 });
            } else {
                $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 });
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting ClaimTypes Failed");
        });
        $scope.modalInstance = $uibModal.open({
            "templateUrl": "ViewAvaliableSlots.html",
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope
        });
        $scope.modalInstance.result.then(function (type) {

        }, function (cancel) {

        });
    });


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
        "Roomobj": "",
        "SelectDoctor": "",
        "otherDocInd": false,
        "SubSpecialityObj": "",
        "SubSpecialityId": "",
        "NewApptStartTime": "",

    }

    $scope.AddToWaitingRoom = function () {
        if ($scope.RoomSearchObj.RoomTypeId === 0) {
            alertify.error("Select Room Type");
            return false;
        }
        //if ($scope.RoomSearchObj.RoomTypeId !== 7) {
        //    if ($scope.RoomSearchObj.RoomId === 0) {
        //        alertify.error("Select Room Type");
        //        return false;
        //    }
        //}

        if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicRoomAllocation) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        if ($scope.RoomSearchObj.RoomTypeId === 7) {
            if (!$scope.UserAccessRights.AllAccessRights.OPCheckOutAccess) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }

        if ($scope.RoomSearchObj.RoomTypeId === 1) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDoctor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 4) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoCounselor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 3) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDilation) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 5) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoTechnician) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 2) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoOptom) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.RoomSearchObj.OptomId === null) {
                alertify.error("Select Optometrist");
                return false;
            }
        }
        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": $scope.Patientlistdata.PatientID,
            "AppointmentId": $scope.Patientlistdata.AppointmentId || $scope.Patientlistdata.AppointmentID,
            "RoomId": $scope.RoomSearchObj.RoomId,
            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
            "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
            "PreviousCounterId": null,
            "PatientDynamicStatusId": 0,
            "Status": "Waiting",
            "DoctorId": $scope.RoomSearchObj.DoctorId,
            "OptomId": $scope.RoomSearchObj.OptomId,
            "DilationAssistantId": $scope.RoomSearchObj.DilationAssistantId,
            "CounsellorId": $scope.RoomSearchObj.CounsellorId,
            "StartTime": $scope.Time,
            "IsCheckedOut": 2,
            "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = 3;
            params.Status = 'Completed';
        }
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.modalInstance.dismiss("cancel");
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting ClaimTypes Failed");
        });
    };


    $scope.closeAvaliableSlots = function () {
        $scope.modalInstance.dismiss("cancel");
    };
    $scope.ChangesRoom = function (item) {

        item = item || null;
        if (item !== null) {
            $scope.RoomSearchObj.RoomId = item.RoomId || 0;
        } else {
            $scope.RoomSearchObj.RoomId = 0;
        }
    };
    $scope.ChangesOptham = function (item) {
        $scope.RoomSearchObj.SelectDoctor = item.FullName;
        $scope.RoomSearchObj.OptomId = item.DoctorID;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.DoctorId = null;
        $scope.RoomSearchObj.ARId = null;
        $scope.RoomSearchObj.BillingUserId = null;
        $scope.searchfilterforRoom.txt2 = "";
    };
    $scope.ChangesCounsellor = function (item) {
        $scope.RoomSearchObj.SelectDoctor = item.FullName;
        $scope.RoomSearchObj.CounsellorId = item.DoctorID;
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
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.DoctorId = null;
        $scope.RoomSearchObj.ARId = null;
        $scope.searchfilterforRoom.txt5 = "";
        $scope.RoomSearchObj.BillingUserId = null;
    };
    $scope.ChangesDilation = function (item) {
        $scope.RoomSearchObj.SelectDoctor = item.FullName;
        $scope.RoomSearchObj.DilationAssistantId = item.DoctorID || 0;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.DoctorId = null;
        $scope.RoomSearchObj.ARId = null;
        $scope.searchfilterforRoom.txt3 = "";
        $scope.RoomSearchObj.BillingUserId = null;
    };

    $scope.ChangesRoomDoctor = function (item) {
        $scope.RoomSearchObj.SelectDoctor = item.FullName;
        $scope.RoomSearchObj.DoctorId = item.DoctorID;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.ARId = null;
        $scope.searchfilterforRoom.txt1 = "";
        $scope.RoomSearchObj.BillingUserId = null;
    };
    $scope.ChangesAR = function (item) {
        $scope.RoomSearchObj.SelectDoctor = item.FullName;
        $scope.RoomSearchObj.ARId = item.DoctorID;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.DoctorId = null;
        $scope.searchfilterforRoom.txt8 = "";
        $scope.RoomSearchObj.BillingUserId = null;
    };
    $scope.ChangesBillingUser = function (item) {
        $scope.RoomSearchObj.SelectDoctor = item.FullName;
        $scope.RoomSearchObj.BillingUserId = item.DoctorID;
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
        //   $scope.RoomSearchObj.BillingUserId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.DoctorId = null;
        $scope.RoomSearchObj.ARId = null;
        $scope.RoomSearchObj.ReceptionId = item.DoctorID;
        $scope.searchfilterforRoom.txt10 = "";
    };


    $scope.changeradiobtn = function (item, type) {
        //item.searchPatientIdTxt = "";
        $scope.SearchObj.PatientId = 0;

        //$scope.SearchObj.searchPatientTxt = "";
        //$scope.SearchObj.searchPatientOldMR = "";

        // dont clear text in input fields // new enhancement
        if (type == "1") {
            if ($scope.SearchObj.searchPatientIdTxt !== "") {
                $scope.SearchObj.searchPatientTxt = $scope.SearchObj.searchPatientIdTxt;
            }
            if ($scope.SearchObj.searchPatientOldMR !== "") {
                $scope.SearchObj.searchPatientTxt = $scope.SearchObj.searchPatientOldMR;
            }
        }
        if (type == "2") {
            if ($scope.SearchObj.searchPatientTxt !== "") {
                $scope.SearchObj.searchPatientIdTxt = $scope.SearchObj.searchPatientTxt;
            }
            if ($scope.SearchObj.searchPatientOldMR !== "") {
                $scope.SearchObj.searchPatientIdTxt = $scope.SearchObj.searchPatientOldMR;
            }
        }
        if (type == "3") {
            if ($scope.SearchObj.searchPatientTxt !== "") {
                $scope.SearchObj.searchPatientOldMR = $scope.SearchObj.searchPatientTxt;
            }
            if ($scope.SearchObj.searchPatientIdTxt !== "") {
                $scope.SearchObj.searchPatientOldMR = $scope.SearchObj.searchPatientIdTxt;
            }
        }

        $scope.SearchPatientfilter.IsPatientNameInd = false;
        $scope.SearchPatientfilter.PaientMRNO = "";
        $scope.SearchPatientfilter.PaientOldMRNO = "";
    }

    $scope.changeDoctorradiobtn = function (item, type) {
        if (type === 'singleDoctor') {
            $scope.SearchList();
            // $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
            // $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        }
        if (type === 'AllDoctors') {
            $scope.activeEvent = 'day';
        }
    }


    $scope.searchPatientAppointmentList = function (txt, type) {

        $scope.StartAutoRefreshAppointment();

        txt = txt || "";
        if (type === 2) {//MR number search
            if (txt === "") {
                $scope.SearchObj.searchPatientTxt = "";
                $scope.SearchObj.searchPatientIdTxt = "";
                $scope.searchOldPatientMRNO = "";
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.SearchObj.searchPatientIdTxt = txt;
                    $scope.SearchObj.searchOldPatientMRNO = "";
                    $scope.searchPatientTxt = "";
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }
        }
        else if (type === 3) {//Old MR number search
            if (txt === "") {
                $scope.SearchObj.searchPatientTxt = "";
                $scope.SearchObj.searchPatientIdTxt = "";
                $scope.searchOldPatientMRNO = "";
                // $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.searchOldPatientMRNO = txt;
                    $scope.SearchObj.searchPatientTxt = "";
                    $scope.SearchObj.searchPatientIdTxt = "";
                    $scope.loadAppointments($scope.selectedDoctor, '');
                }
            }
        }
        else {//Name Search
            if (txt.length > 2) {
                $scope.SearchObj.searchPatientTxt = txt;
                $scope.SearchObj.searchPatientIdTxt = "";
                $scope.SearchObj.searchOldPatientMRNO = "";
                //$scope.loadAppointments($scope.selectedDoctor);
            } else {
                if (txt === "") {
                    $scope.SearchObj.searchPatientTxt = "";
                    $scope.SearchObj.searchPatientIdTxt = "";
                    $scope.searchOldPatientMRNO = "";
                    // $scope.loadAppointments($scope.selectedDoctor);
                }
            }
        }
    };

    $scope.AppointmentPatientListArray = [];
    $scope.LoadPatientSearch = function (val, type) {

        val = val || "";

        if (type === 1) {
            $scope.SearchPatientfilter.IsPatientNameInd = false;
            var patientfilter = $filter("filter")($scope.BookedAppointmentList, { "PatientName": val }) || [];
            if (patientfilter.length == 0) {
                $scope.SearchPatientfilter.IsPatientNameInd = true;
            }
        }
        else if (type === 2) {
            //if (val.length !== 10) {
            //    $scope.SearchPatientfilter.PaientMRNO = "";
            //    return false;
            //}
            //if (val.length === 10) {
            $scope.SearchPatientfilter.PaientMRNO = val;

            $scope.SearchPatientfilter.IsPatientNameInd = false;
            var patientfilter = $filter("filter")($scope.BookedAppointmentList, { "PatientMrNo": val }) || [];
            if (patientfilter.length == 0) {
                $scope.SearchPatientfilter.IsPatientNameInd = true;
            }
            //}


            /*  var consultdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");
              if (type === 1) {
                  var obj = {
                      "SearchText": val,
                      "DoctorId": $scope.selectedDoctor.DoctorID,
                      "BranchId": $scope.selectedBranch.BranchId,
                      "AppointmentDate": consultdate,
                      "AllDoctorInd": 0,
                      "MRNumber": ""
                  };
  
  
              }
              else if (type === 2) {
                  var obj = {
                      "SearchText": "",
                      "DoctorId": $scope.selectedDoctor.DoctorID,
                      "BranchId": $scope.selectedBranch.BranchId,
                      "AppointmentDate": consultdate,
                      "MRNumber": val,
                      "AllDoctorInd": 0
                  };
              }
  
              return eHnotePatientDataService.SearchAppointmentPatients(obj).then(function (resp) {
  
  
                  console.log(resp);
                  resp.data.rows = resp.data.rows || [];
  
                  if (resp.data.rows.length !== 0) {
                      $scope.AppointmentPatientListArray = resp.data.rows || [];
                  } else {
                      $scope.AppointmentPatientListArray = [];
                  }
              }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });*/
        }
        else if (type === 3) {
            $scope.SearchPatientfilter.PaientOldMRNO = val;

            $scope.SearchPatientfilter.IsPatientNameInd = false;
            var patientfilter = $filter("filter")($scope.BookedAppointmentList, { "PatientOldMrNo": val }) || [];
            if (patientfilter.length == 0) {
                $scope.SearchPatientfilter.IsPatientNameInd = true;
            }
        }
    };

    function setCalenderViewVisibility(val) {
        if ($scope.Tab != 'dilation') {
            //if (val) {
            //    document.getElementById('divCalenderView').setAttribute('style', 'visibility:visible;display:block;opacity:1;');
            //} else {
            //    document.getElementById('divCalenderView').setAttribute('style', 'visibility:hidden;display:none;opacity:0;');
            //}
        }

    }



    var loadEvents = function (booked, data) {
        for (var j = 0; j < booked.calendarList.length; j++) {
            if (booked.calendarList[j].slotList !== undefined) {
                for (var k = 0; k < booked.calendarList[j].slotList.length; k++) {
                    var sTime = booked.calendarList[j].slotList[k];
                    if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                        sTime.patientInfo = {};
                    }
                    if (sTime.patientInfo !== undefined) {
                        sTime.patientInfo.appointmentID = sTime.appointmentID;
                        sTime.patientInfo.appointmentStatus = sTime.appointmentStatus;
                        var userbranch = sTime.UserBranchId !== undefined ? sTime.UserBranchId : 0;
                        var OpId = sTime.OptometristId;
                        var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        if (sTime.startDate === undefined) {
                            var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        } else {
                            var datefinalValue = $filter('date')(sTime.startDate, "yyyy-MM-dd");
                        } if (sTime.endDate === undefined) {
                            var dateendval = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        } else {
                            var dateendval = $filter('date')(sTime.endDate, "yyyy-MM-dd");
                        }
                        var dayViewStart = moment(sTime.startTime, 'HH:mm:ss');
                        var dayViewEnd = moment(sTime.endTime, 'HH:mm:ss');
                        if (sTime.endTime === "23:59" && sTime.allDayEvents !== undefined && datefinalValue !== dateendval) {
                            dateendval = moment(sTime.endDate).add('days', 1).format('YYYY-MM-DD');
                        }
                        var appBgColor = "",
                            appFontColor = "";
                        var dayCounter = moment(datefinalValue)
                            .clone()
                            .hours(dayViewStart.hours())
                            .minutes(dayViewStart.minutes())
                            .seconds(dayViewStart.seconds());
                        if (sTime.endTime === "24:00") {
                            datefinalValue = $filter('date')(data.calendarList[j].consultationDt + 86400000, "yyyy-MM-dd");
                        }
                        var dayend = moment(dateendval)
                            .clone()
                            .hours(dayViewEnd.hours())
                            .minutes(dayViewEnd.minutes())
                            .seconds(dayViewEnd.seconds());
                        if (sTime.appointmentStatus === "B") {
                            var appStatus = "Booked";
                            appBgColor = "#757ef8";
                            appFontColor = "#FFF";
                        } else if (sTime.appointmentStatus === "O") {
                            var appStatus = "OnGoing";
                            appBgColor = "#77cb52";
                            appFontColor = "#FFF";
                        }
                        else if (sTime.appointmentStatus === "D") {
                            var appStatus = "Saved";
                            appBgColor = "#aa0abb";
                            appFontColor = "#FFF";
                        } else if (sTime.appointmentStatus === "C") {
                            var appStatus = "Cancelled";
                            appFontColor = "#FFF";
                            appBgColor = "#70d7cc";
                        } else if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                            var appStatus = "Events";
                            appBgColor = "#8d67b1";
                            appFontColor = "#FFF";
                        } else {
                            var appStatus = "Completed";
                            appBgColor = "#ff9024";
                            appFontColor = "#FFF";
                        }
                        sTime.VisitReasonColorCode = sTime.VisitReasonColorCode || "";
                        if (sTime.VisitReasonColorCode != '') {
                            appBgColor = sTime.VisitReasonColorCode;
                        }
                        var doctorSpecialities = "";
                        for (var i in sTime.doctorInfo.specialityCd) {
                            doctorSpecialities += "," + getSpecialityDesc(sTime.doctorInfo.specialityCd[i]);
                        }
                        if (doctorSpecialities.charAt(0) === ",") {
                            doctorSpecialities = doctorSpecialities.slice(1);
                        }
                        var title = null, eventInfo = null;
                        if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                            sTime.patientInfo.title = "Dr";
                            sTime.patientInfo.doctorID = sTime.doctorID;
                            sTime.patientInfo.fullName = sTime.doctorInfo.doctorName;
                            sTime.patientInfo.doctorSpecialities = "";
                            title = sTime.otherVisitRsn || "Events";
                            eventInfo = ((sTime.patientInfo.title === undefined) ? "" : sTime.patientInfo.title + '.') + sTime.patientInfo.fullName + " | Token : 0 | - | /Male | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                        } else {
                            // title = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName;
                            title = sTime.patientInfo.fullName;
                            eventInfo = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName + " | Token : " + (sTime.tokenNumber === '0' ? "Walk-In" : sTime.tokenNumber) + " | " + ((sTime.patientInfo.mobileNumber === undefined || sTime.patientInfo.mobileNumber.toString().length < 6) ? "-" : sTime.patientInfo.mobileNumber) + " | " + ((sTime.patientInfo.currentAge === undefined) ? ((sTime.patientInfo.age === undefined) ? '' : (sTime.patientInfo.age + "y")) : (((sTime.patientInfo.currentAge.year > 0) ? sTime.patientInfo.currentAge.year + "y" : '') + ' ' + ((sTime.patientInfo.currentAge.month > 0) ? sTime.patientInfo.currentAge.month + "m" : ''))) + "/" + ((sTime.patientInfo.Sex === 'M') ? 'Male' : 'Female') + " | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                        }
                        var newEvent = {
                            "title": title,
                            "eventInfo": eventInfo,
                            "UserBranchId": userbranch,
                            "OptometristId": OpId,
                            "start": dayCounter.clone(),
                            "startDate": dayCounter.clone(),
                            "startTime": dayCounter.clone(),
                            "endDate": dayend.clone(),
                            "endTime": dayend.clone(),
                            "end": dayend.clone(),
                            "color": appBgColor,
                            "textColor": appFontColor,
                            "allDay": sTime.allDayEvents !== undefined,
                            "token": sTime.tokenNumber === "0" ? "Walk-In" : sTime.tokenNumber,
                            "eventTitle": sTime.otherVisitRsn || "Events",
                            "eventDesc": sTime.eventDescription || "",
                            "eventVenue": sTime.eventLocation || "",
                            "sliceTime": avgConsultationTime,
                            "showDoctors": true,
                            "PatientName": sTime.patientInfo.fullName,
                            "PatientMrNo": sTime.patientInfo.PatientDisplayId,
                            "PatientOldMrNo": sTime.patientInfo.OldMrNo,
                            "rowData": {
                                "addressId": booked.calendarList[j].slotList[k].addressID,
                                "doctorId": booked.calendarList[j].slotList[k].doctorID,
                                "hospitalId": booked.calendarList[j].slotList[k].hospitalID,
                                "doctorName": sTime.doctorInfo.doctorName,
                                "doctorEmail": sTime.doctorInfo.EmailId,
                                "docMobile": sTime.doctorInfo.MobileNo,
                                "docCountrycode": sTime.doctorInfo.CountryCode,
                                "doctorSpecialities": doctorSpecialities,
                                "doctorImage": sTime.doctorInfo.doctorImage,
                                "consultationDate": booked.calendarList[j].consultationDt,
                                "DayCD": booked.calendarList[j].slotList[k].dayCD,
                                "PatientInfo": sTime.patientInfo,
                                "visitReason": sTime.VisitReason || "",
                                "doctorVisitRsnId": sTime.DoctorVisitRsnID,
                                "IscheckedIn": sTime.IscheckedIn,
                                "VisitTypeId": sTime.VisitTypeId || 0
                            }
                        };
                        $scope.eventsList.push(newEvent);
                    }
                }
            }
            if (booked.UserAvailableSlots.length > 0) {
                var consultationDate = $filter('date')(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                var UserAvailableSlots = $filter('filter')(booked.UserAvailableSlots, { "SlotDate": consultationDate }, true);
                angular.forEach(UserAvailableSlots, function (item) {
                    if (item.UserDayBreakSlots.length > 0) {
                        for (let l = 0; l < item.UserDayBreakSlots.length; l++) {
                            var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                            var appBgColor = "#b0b3b5",
                                appFontColor = "#000";
                            let startTime = consultationDate + ' ' + item.UserDayBreakSlots[l].StartTime;
                            let endTime = consultationDate + ' ' + item.UserDayBreakSlots[l].EndTime;

                            let object = {
                                "id": l + 1,
                                "title": "Blocked",
                                "resourceId": item.DoctorId,
                                "end": endTime,
                                "start": startTime,
                                "eventInfo": "",
                                "color": appBgColor,
                                "textColor": appFontColor,
                                "allDay": false,
                                "display": "background",
                                "SlotInfo": {
                                    "UserBranchId": item.UserBranchId,
                                    "DoctorId": item.DoctorId,
                                    "StartTime": startTime,
                                    "EndTime": endTime,
                                    "ConsultationDate": item.SlotDate,
                                    "UserScheduleId": item.UserDayBreakSlots[l].UserScheduleId,
                                    "UserDayBreakSlotId": item.UserDayBreakSlots[l].UserDayBreakSlotId,
                                    "OrganizationId": item.OrganizationId,
                                    "BlockedRemarks": item.UserDayBreakSlots[l].BlockedRemarks || "",
                                    "UnBlockedRemarks": item.UserDayBreakSlots[l].UnBlockedRemarks || "",
                                    "ReasonforBlockSlot": item.UserDayBreakSlots[l].ReasonforBlockSlot || ""
                                },
                                "IsBreakEvent": true
                            };

                            $scope.eventsList.push(object);
                        }
                    }
                });
            }
        }
    };
    function OnGetAppointmentSuccess(data) {
        $scope.eventsList = [];
        $scope.appCount = data.appointmentCounts;
        var booked = data;
        $scope.patDetails.length = 0;
        $scope.UserAvailableSlots = data.UserAvailableSlots;
        if (data.UserAvailableSlots.length > 0) {
            $scope.UserScheduleId = data.UserAvailableSlots[0].UserScheduleId;
            $scope.UserScheduleDetailId = data.UserAvailableSlots[0].UserScheduleDetailId;
        }
        var jsonAvailConsultTime = [];
        jsonUnavailableTime.length = 0;
        $scope.minPerCase = 0;
        if (booked.calendarList[0].slotList !== undefined) {
            if (booked.calendarList.length > 0 && booked.calendarList[0].slotList.length > 0) {
                $scope.eventsList = [];
                loadEvents(booked, data);
                eHnoteMasterDataService.addDocAvailConsultTimeInfo(jsonAvailConsultTime);
            } else {
                if (JSON.stringify($scope.showDayID) === "true" && JSON.stringify($scope.appointmentlistID) === "false") {
                    $scope.dayConfig.visible = false;
                    $scope.noData = "Time slot is not available for the selected day...";
                }
                eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
                $scope.setValue = [];
                $scope.eventsList = [];
                $scope.beginBHr = [];
                $scope.beginEHr = [];
            }
        } else {
            $scope.eventsList = [];
            loadEvents(booked, data);
        }
        uiCalendarConfig.calendars["calControl"].fullCalendar('removeEvents');
        uiCalendarConfig.calendars["calControl"].fullCalendar('addEventSource', $scope.eventsList);
        uiCalendarConfig.calendars["calControl"].fullCalendar('rerenderEvents');
        angular.element('#calControl').fullCalendar('option', {
            defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
            slotDuration: '00:' + avgConsultationTime + ':00'
        });
        setTimeout(function () {
            angular.element('.fc-scroller').scrollTop(0);
            if ($('.fc-now-indicator-line').offset()) {
                angular.element('.fc-scroller').scrollTop($('.fc-now-indicator-line').offset().top - 300);
            }
        }, 1000);
        eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
        if (getAppNewFormattedDate(new Date($scope.formatteddateValue)) === getAppNewFormattedDate(new Date())) {
            var dt = new Date();
            dt.getHours() >= 12 ? (function () {
                hr = dt.getHours() % 12 === 0 ? 12 : dt.getHours() % 12;
                ampm = "PM";
            })() : (function () {
                hr = dt.getHours();
                ampm = "AM";
            })();
            var min = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
            var time = hr + ":" + min + "" + ampm;
            setTimeout(function () {
                var match = "";
                $('.cal-day-hour-part .span1').each(function (i, e) {
                    var ele = $(e).text();
                    if ($(e).text() === time) {
                        match = e;
                        return false;
                    } else {
                        var curr = getApptimeSplit(time);
                        var pre = getApptimeSplit(ele);
                        if (curr['hr'] === pre['hr'] && curr['ampm'] === pre['ampm']) {
                            if (curr['min'] < pre['min']) {
                                match = $('.cal-day-hour-part .span1')[i];
                                return false;
                            }
                        }
                    }
                });
                var scrollVal = $('.cal-day-hour-part').index($(match).parent()) * 30;
                $('.cal-day-panel').scrollTop(scrollVal);
            }, 1000);
        }
        $scope.showCalendar = true;
    }
    function OnGetAppointmentError(data) {
        eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
        $scope.eventsList = [];
        $scope.setValue = [];
        $scope.beginBHr = [];
        $scope.beginEHr = [];
        $scope.showCalendar = false;
        alertify.error("Error in listing Appointments,  Please check internet connectivity");
    }
    $scope.Regpatient = function (item, Regpatient) {
        var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
        clearRegPatientDetails();
        eHnoteMasterDataService.addAddPatientwithoutConsult(true);
        var patientinfo = eHnoteMasterDataService.getNewPatientInfo();
        patientinfo.hasphone = true;
        eHnoteMasterDataService.addNewPatientInfo(patientinfo);

        $location.url("/registerPatient");
    };
    $scope.WalkinNavigate = function () {
        //$location.url("/phonenumber");
        $location.url("/registerPatient");
    };
    function clearRegPatientDetails() {
        var patientinfo = eHnoteMasterDataService.getNewPatientInfo();
        patientinfo.doctorid = eHnoteMasterDataService.getLoginId();
        patientinfo.title = 'Mr';
        patientinfo.firstname = "";
        patientinfo.lastname = "";
        patientinfo.CurrentAge = "";
        patientinfo.emailid = "";
        patientinfo.address1 = "";
        patientinfo.address2 = "";
        patientinfo.Landmark = "";
        patientinfo.pincode = '';
        patientinfo.citytown = "";
        patientinfo.phonenumber = "";
        patientinfo.gender = 'M';
        eHnoteMasterDataService.addNewPatientInfo(patientinfo);
        var emergencycontactinfo = eHnoteMasterDataService.getEmergencycontactinfo();
        emergencycontactinfo.name = '';
        emergencycontactinfo.title = 'Mr';
        emergencycontactinfo.relationship = '';
        emergencycontactinfo.mobilenumber = '';
        emergencycontactinfo.alternatenumber = '';
        eHnoteMasterDataService.addEmergencycontactinfo(emergencycontactinfo);
        var patientotherdetails = eHnoteMasterDataService.getPatientotherdetails();
        patientotherdetails.referralsource = {};
        patientotherdetails.maritalstatus = 'M';
        patientotherdetails.education = '';
        patientotherdetails.occupation = '';
        patientotherdetails.paymentmode = 'OTHERS';
        patientotherdetails.referralsource = {
            'OTHERS': 'Others'
        };
        eHnoteMasterDataService.addPatientotherdetails(patientotherdetails);
    }
    $scope.getListingDetailsonDateChange = function (refDate) {
        $scope.viewDate = new Date(refDate);
        eHnoteMasterDataService.addSelectedPastAppDate($filter('date')(new Date(refDate), "MM-DD-YYYY"));
        $scope.SortType = 1;  //0;
        $scope.SortBy = "Asc";  //"desc";
        $scope.Pagination.currentPagePatient = 1;
        $scope.IsFutureAppointmentDate = eHnotePatientDataService.IsFutureDate($scope.SearchObj.ConsultationDt);
    };
    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].$$hashKey) {
                    delete a[i].$$hashKey;
                }
                if (a[j].$$hashKey) {
                    delete a[j].$$hashKey;
                }
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };
    $scope.NavigatetoInvestigations = function (item) {
        $scope.cacheStorageItem.IsEasyMode = false;
        $scope.cacheStorageItem.IsNormalMode = false;
        $scope.cacheStorageItem.IsInvestigationMode = true;
        eHnoteMasterDataService.IsClickFromStartConsultation(true);
        if (datapersistanceFactory.getItem("myPatientsSet").length !== 0) {
            datapersistanceFactory.remove("myPatientsSet");
        }
        item.Patient = [];
        item.PatientAddress = [];
        item.PatientPhone = [];
        item.Patient.push({
            "PatientID": item.PatientID,
            "FullName": item.PatientDetails.FullName,
            "DOB": item.PatientDetails.DOB,
            "Gender": item.PatientDetails.Gender
        });

        item.PatientDetails.PatientPhone = item.PatientDetails.PatientPhone || [];

        if (item.PatientDetails.PatientPhone.length !== 0) {
            item.PatientPhone.push({
                "PhNumber": item.PatientDetails.MobileNo
            });
        } else {
            item.PatientPhone.push({
                "PhNumber": ''
            });
        }
        //if (item.DisplayID === undefined && item.DisplayID === "") {
        //    eHnoteMasterDataService.addDisplayID(item.DisplayID);
        //} else {
        //    eHnoteMasterDataService.addDisplayID(item.DisplayID);
        //}
        eHnoteMasterDataService.addconsultType("NEW");
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        var patientinfo = item.PatientDetails;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.VisitReason = item.VisitReason;
        $scope.cacheStorageItem.doctorid = item.DoctorID;
        //setCacheStorage(patientinfo, datapersistanceFactory, eHnoteCacheStorageService, eHnoteMasterDataService);
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.InvestigationMode = true;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        eHnoteValidateUsersDataService.RemoveProcessingCookies();
        item.ClinicName = $scope.AppListselectedclinic.ClinicName;
        item.DoctorSpeciality = getSelectedDrSpeciality($scope.AppListselectedclinic.Doctors, item.DoctorID);
        eHnoteMasterDataService.addAppointmentInfo(item);
        eHnoteMasterDataService.IsClickFromStartConsultation(false);
        eHnoteMasterDataService.addconsultType("NEW");
        $scope.pasthistory = [];
        eHnoteMasterDataService.addpastpatienthistory($scope.pasthistory);
        //var url = "/main";

        $location.url("/NewOpthaConsultation");
    };
    $scope.SelectedConsultationID = 0;
    $scope.SelectedAppointmentDocId = 0;
    $scope.SelectedAppointmentPatId = 0;
    $scope.SelectedAppointmentId = 0;
    $scope.openVitalParamspopUp = function (item) {

        $scope.StartAutoRefreshAppointment();

        if (item.DoctorVisitRsnID === 8) {
            return;
        }
        $scope.SelectedConsultationID = item.ConsultationId;
        $scope.SelectedAppointmentDocId = item.DoctorID;
        $scope.SelectedAppointmentPatId = item.PatientID;
        $scope.SelectedAppointmentId = item.AppointmentID;
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "ShowEhnoteVitals.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.vitalsArray = [
                    {
                        "VitalID": 1,
                        "VitalDesc": "Weight",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 2,
                        "VitalDesc": "Height",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 3,
                        "VitalDesc": "Blood Group",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 4,
                        "VitalDesc": "BP High",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 5,
                        "VitalDesc": "BP Low",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 6,
                        "VitalDesc": "Lipid Profile",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 7,
                        "VitalDesc": "Sugar Fast",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 8,
                        "VitalDesc": "Sugar PP",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 9,
                        "VitalDesc": "Sugar Random",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 10,
                        "VitalDesc": "Serum creatinine",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 11,
                        "VitalDesc": "Temperature",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 12,
                        "VitalDesc": "Pulse",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 13,
                        "VitalDesc": "Head Circumference",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 14,
                        "VitalDesc": "Respiratory Rate",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 15,
                        "VitalDesc": "SpO2",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 16,
                        "VitalDesc": "PEFR",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 17,
                        "VitalDesc": "BMI",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 27,
                        "VitalDesc": "Duct",
                        "ActiveIND": "",
                        "Value": ""
                    },
                    {
                        "VitalID": 28,
                        "VitalDesc": "Tension",
                        "ActiveIND": "",
                        "Value": ""
                    }
                ];
                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                var req = {
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
                };
                eHnoteSettingsDataService.getActivetVitalsByHospitalId(req, activevitalsuccess, activevitalerror);
                function activevitalsuccess(data) {
                    $scope.activeSettingsVitals = [];
                    angular.forEach(data.rows, function (value1, key) {
                        var vtDesc = value1.VitalDesc;
                        $scope.activeSettingsVitals.push({
                            VitalDesc: value1.VitalDesc,
                            VitalID: value1.VitalID,
                            ActiveIND: value1.ActiveIND
                        });
                    });
                    angular.forEach($scope.vitalsArray, function (item) {
                        angular.forEach($scope.activeSettingsVitals, function (item1) {
                            if (item.VitalID === item1.VitalID) {
                                item.ActiveIND = 'Y';
                            }
                        });
                    });
                }
                function activevitalerror() {
                }

                eHnotePatientPVService.getPatientPastVitalsByAppId($scope.SelectedAppointmentId, OnPVsuccess, OnPVerror);
                function OnPVsuccess(data) {
                    if (data.Vitals !== null || data.Vitals !== undefined) {
                        if (data.Vitals.length > 0) {
                            for (var j = 0; j < data.Vitals.length; j++) {
                                Index = $scope.vitalsArray.findIndex(record => record.VitalID === data.Vitals[j].VitalID);
                                if (Index > -1) {
                                    $scope.vitalsArray[Index].Value = data.Vitals[j].Value;
                                }
                            }
                        }
                        if ($scope.vitalsArray[1].Value !== "" && $scope.vitalsArray[0].Value !== "" && $scope.vitalsArray[1].Value !== undefined && $scope.vitalsArray[0].Value !== undefined) {
                            $scope.bmiValueCal($scope.vitalsArray[1].Value, $scope.vitalsArray[0].Value);
                        }
                    }
                }
                function OnPVerror(err) {
                    console.log(err);
                }
                $scope.bmiValueCal = function (val1, val2) {
                    val1 = parseFloat(val1) || 0;
                    val2 = parseFloat(val2) || 0;
                    var height_in_meter = 0;
                    var weight_in_kg = 0;
                    var BMI;
                    if (val1 !== 0) {
                        height_in_meter = val1 / 100;
                    }
                    if (val2 !== 0) {
                        weight_in_kg = val2;
                    }
                    BMI = weight_in_kg / (height_in_meter * height_in_meter);
                    BMI = Math.round(BMI * 100) / 100;
                    if (BMI < 18.5 && BMI > 0) {
                        BMI = BMI + ' (Under Weight)';
                    } else if (BMI >= 18.5 && BMI < 24.9) {
                        BMI = BMI + ' (Normal Weight)';
                    } else if (BMI >= 25 && BMI < 29.9) {
                        BMI = BMI + ' (Over Weight)';
                    } else if (BMI === 0) {
                        BMI = "";
                    } else {
                        BMI = BMI + ' (Obesity)';
                    }
                    if ($scope.vitalsArray.length === 16) {
                        $scope.vitalsArray.push({ "VitalID": 17, "VitalDesc": "BMI", "Value": "" });
                    }
                    if (val1 && val2) {
                        $scope.vitalsArray[16].Value = BMI;
                    } else {
                        $scope.vitalsArray[16].Value = "";
                    }
                };
                $scope.CloseVitalspopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.submitVitalParams = function (Arrayitem) {
                    var params = {
                        "AppointmentID": $scope.SelectedAppointmentId,
                        "USRId": eHnoteMasterDataService.getLoginId(),
                        "Vitals": Arrayitem
                    };
                    eHnotePatientPVService.modifyPatientvitalsbyId(params, OnPVAddsuccess, OnPVAdderror);
                    function OnPVAddsuccess(data) {
                        alertify.success("Updated Successfully");
                        $uibModalInstance.dismiss("cancel");
                        if ($scope.userLoginDetails.RoleID !== 1 && $scope.userLoginDetails.RoleID !== 56) {
                            //eHnoteMasterDataService.addSelectedDoctorinAppList("");
                            //eHnoteMasterDataService.addSelectedHospitalinAppList("");
                            if ($scope.mainAppointmentView.isCalendarorList !== 'Calendar') {
                                $scope.selectedDoctor = $scope.clinicDoctorList[0];
                            }
                        }
                        $scope.loadAppointments($scope.selectedDoctor, '');
                    }
                    function OnPVAdderror(err) {
                        console.log(err);
                    }
                };
            }
        });

    };
    function getApptimeSplit(time) {
        var t = time.split(':');
        dur = {};
        dur['hr'] = parseInt(t[0]);
        dur['min'] = parseInt(t[1].substr(0, 2));
        dur['ampm'] = t[1].substr(2);
        return dur;
    }
    function getAppNewFormattedDate(currdt) {
        var month = new Array(12);
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return currdt.getDate() < 10 ? "0" + currdt.getDate() : currdt.getDate() + "-" + month[currdt.getMonth()] + "-" + currdt.getFullYear();
    }
    $scope.getPatientItem = function (item) {
        $scope.pObj = item;
    };
    $scope.bookAppointment = function (data) {
        $('.modal-backdrop').remove();
        datacookieFactory.set('patientData', $scope.pObj);

        $location.url("/appointment-book");
    };
    var SetupPopUp;

    $scope.$on('openNewbookAppointment', function (e, item) {
        console.log("Appointment Called1");
        $scope.openAppointmentPopup(item);
    });
    $scope.$on('openNewbookAppointmentv2', function (e, item) {
        console.log("Appointment Called1");
        $scope.openAppointmentPopup(item, 2);
    });
    $scope.openAppointmentPopup = function (item, type) {
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
        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": undefined,
            "AppointmentId": null,
            "PatientId": null,
            'IsComingFrom': '',
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
            'type': 'op',
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        if ($scope.SpecializationId === 2) {
            $scope.PageName = "directFollowup";
        }
        if ($scope.Tab === 'teleappointments') {
            $rootScope.Consulatation_type = true;
        }
        if ($scope.Tab === 'appointments') {
            $rootScope.Consulatation_type = false;
        }

        // openAppPopup();

        if (type == 2) {
            BookApptPopupOpenedv2(item);
        } else {
            BookApptPopupOpened(item);
        }
    };
    $rootScope.appointmentRootId = 0;
    $rootScope.appointmentParentId = 0;
    $scope.EditAppointmentPopup = function (item) {



        $scope.StartAutoRefreshAppointment();

        if (item.DoctorVisitRsnID === 8) {
            return;
        }

        eHnoteMainAppointmentService.getAdditionalApptDetailsById(item.AppointmentID).then(function (resp) {
            resp.data = resp.data || [];
            console.log(resp);

            if (resp.data.length > 0) {
                if (resp.data[0].AppointmentDetails.length > 0) {

                    item.OrganizationId = resp.data[0].AppointmentDetails[0].OrganizationId;
                    item.HospitalName = resp.data[0].AppointmentDetails[0].HospitalName;
                    item.OrgGSTNO = resp.data[0].AppointmentDetails[0].OrgGSTNO;
                    item.IsCheckInMandatory = resp.data[0].AppointmentDetails[0].IsCheckInMandatory;
                    item.AppointmentSource = resp.data[0].AppointmentDetails[0].AppointmentSource;
                    item.BranchAddress1 = resp.data[0].AppointmentDetails[0].BranchAddress1;
                    item.BranchAddress2 = resp.data[0].AppointmentDetails[0].BranchAddress2;
                    item.BranchCityId = resp.data[0].AppointmentDetails[0].BranchCityId;
                    item.BranchState = resp.data[0].AppointmentDetails[0].BranchState;
                    item.BranchPinCode = resp.data[0].AppointmentDetails[0].BranchPinCode;
                    item.BranchCountry = resp.data[0].AppointmentDetails[0].BranchCountry;
                    item.Area = resp.data[0].AppointmentDetails[0].Area;
                    item.BranchName = resp.data[0].AppointmentDetails[0].BranchName;
                    item.BranchId = resp.data[0].AppointmentDetails[0].BranchId;
                    item.BranchEmail = resp.data[0].AppointmentDetails[0].BranchEmail;
                    item.BranchMobile = resp.data[0].AppointmentDetails[0].BranchMobile;
                    item.BranchCountryCode = resp.data[0].AppointmentDetails[0].BranchCountryCode;
                    item.BranchAreaCode = resp.data[0].AppointmentDetails[0].BranchAreaCode;
                    item.BranchPhoneNumber = resp.data[0].AppointmentDetails[0].BranchPhoneNumber;
                    item.CommunicationEmailId = resp.data[0].AppointmentDetails[0].CommunicationEmailId;
                    item.CommunicationMobileNo = resp.data[0].AppointmentDetails[0].CommunicationMobileNo;
                    item.CommunicationContactNo = resp.data[0].AppointmentDetails[0].CommunicationContactNo;
                    item.CommunicationCountryCode = resp.data[0].AppointmentDetails[0].CommunicationCountryCode;
                    item.CommunicationAreaCode = resp.data[0].AppointmentDetails[0].CommunicationAreaCode;
                    item.Designation = resp.data[0].AppointmentDetails[0].Designation;
                    item.UserBranchId = resp.data[0].AppointmentDetails[0].UserBranchId;
                    item.AvgConsultationTime = resp.data[0].AppointmentDetails[0].AvgConsultationTime;
                    item.CountryCode = resp.data[0].AppointmentDetails[0].CountryCode;
                    item.IsPrefix = resp.data[0].AppointmentDetails[0].IsPrefix;
                    item.IsConsultationFollowUp = resp.data[0].AppointmentDetails[0].IsConsultationFollowUp;
                    item.PreConsultationFormStatusId = resp.data[0].AppointmentDetails[0].PreConsultationFormStatusId;
                    item.IsTeleMedTermsAndConditions = resp.data[0].AppointmentDetails[0].IsTeleMedTermsAndConditions;
                    item.S3URL = resp.data[0].AppointmentDetails[0].S3URL;
                    item.ARassistantId = resp.data[0].AppointmentDetails[0].ARassistantId;
                    item.BranchContactNo = resp.data[0].AppointmentDetails[0].BranchContactNo;
                    item.IsConsultationAvail = resp.data[0].AppointmentDetails[0].IsConsultationAvail;
                    item.IsConsultationAvail = resp.data[0].AppointmentDetails[0].IsConsultationAvail;
                    item.VisitRemarks = resp.data[0].AppointmentDetails[0].VisitRemarks;

                    resp.data[0].AppointmentDetails[0].AppointmentNotes = resp.data[0].AppointmentNotes;
                    datapersistanceFactory.set("OpAppointmentDetailsById", resp.data[0].AppointmentDetails[0]);
                }

                item.PatientInsuranceList = resp.data[0].PatientInsuranceList || [];
            }




            var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            cacheStorageItem.patientid = item.PatientID;
            cacheStorageItem.InvestigationList = item.InvestigationList || [];
            cacheStorageItem.PatientName = item.PatientDetails.FullName;
            cacheStorageItem.EmailID = item.PatientDetails.EmailId ? item.PatientDetails.EmailId : "";
            cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD ? item.PatientDetails.PhCntryCD : "";
            cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo ? item.PatientDetails.MobileNo : "";
            cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId ? item.PatientDetails.PatientDisplayId : "";

            cacheStorageItem.AppointmentPatientTypeId = item.AppointmentPatientTypeId || 0;
            cacheStorageItem.AppointmentType = item.AppointmentType || "";

            cacheStorageItem.PatientDetails = item.PatientDetails;
            cacheStorageItem.AttenderName = item.AttenderName ? item.AttenderName : "";
            cacheStorageItem.HospitalEquipmentId = item.HospitalEquipmentId;
            cacheStorageItem.HospitalEquipmentName = item.HospitalEquipmentName;
            cacheStorageItem.IsAppointmentConfirmed = item.IsConfirmedAppointment;
            cacheStorageItem.bookApptType = 'EditAppointment';

            eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
            $scope.ispatientExistsval = true;
            var Sarray = item.StartTime.split(":");
            var stime = Sarray[0] + ":" + Sarray[1];
            var date = moment(item.ConsultationDt).format();
            var earray = item.EndTime.split(":");
            var etime = earray[0] + ":" + earray[1];
            var apptime = item.AppointmentID;
            var VisitTypeId = item.VisitTypeId || "";
            VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
            var VisitRemarks = item.VisitRemarks || "";

            $scope.AppDate = [stime, etime, apptime, item.VisitReason ? item.VisitReason : "", item.ReferralSourceId ? item.ReferralSourceId : "", VisitTypeId, VisitRemarks];


            $rootScope.appointmentRootId = 0;
            $rootScope.appointmentParentId = 0;
            if (item.DoctorVisitRsnID === 3) {
                $rootScope.appointmentRootId = item.RootAppointmentId;
                $rootScope.appointmentParentId = item.ParentAppointmentId;
            }

            $rootScope.appointment_type = item.DoctorVisitRsnID.toString();
            $rootScope.AppointmentPatient_type = item.AppointmentPatientTypeId;
            $rootScope.IsTeleMedicineSlot = item.IsTeleMedicineSlot || false;
            $rootScope.IsBillPaid = item.BillingId || 0;

            object = { // Added by Sabarish 
                "FullName": item.DoctorFullName,
                "DoctorID": item.DoctorID,
                "EmailId": item.DoctorEmail,
                "MobileNo": item.DoctorMobile,
                "CountryCode": item.CountryCode ? item.CountryCode : "",
                "Gender": doctorinfo.doctordata.User[0].Gender,
                "UserBranchId": item.UserBranchId,
                "OptometristId": item.OptometristId,
                "ARassistantId": item.ARassistantId || 0,
                "Active": "Y",
                "SpecializationId": item.DoctorSpecializationId,
                "MinPerCase": item.AvgConsultationTime,
                "RoleId": item.DoctorRoleId,
                "ClinicName": item.BranchName,
                "BranchEmail": item.BranchEmail,
                "CommunicationEmailId": item.CommunicationEmailId,
                "CommunicationMobileNo": item.CommunicationMobileNo,
                "CommunicationCountryCode": item.CommunicationCountryCode ? item.CommunicationCountryCode : ""
            };
            eHnoteMasterDataService.addSelectedDoctorinAppList(object);
            //item.showAllHospitalsinAppList = $scope.OpAccess.showAllHospitalsinAppList;
            eHnoteMasterDataService.addAppointmentInfo(item);


            var clinicAddressId = { "ClinicId": item.BranchId };
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);


            //$scope.ffff = "appedit";
            //$scope.calenderDate = undefined; 
            $scope.PageName = "reschedule";
            $rootScope.rescheduleConsultationFollowUp = item.IsConsultationFollowUp;
            if ($scope.Tab === 'teleappointments') {
                $rootScope.Consulatation_type = true;
            }
            if ($scope.Tab === 'appointments') {
                $rootScope.Consulatation_type = false;
            }
            //$rootScope.BookingType = item.BookingTypeId;

            openAppPopup();

        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });



    };



    function LoadDoctor(item) {
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorList.push({
            "FullName": item.DoctorFullName,
            "DoctorID": item.DoctorID,
            "EmailId": item.DoctorEmail,
            "MobileNo": item.DoctorMobile,
            "CountryCode": item.CountryCode ? item.CountryCode : '',
            "Gender": doctorinfo.doctordata.User[0].Gender,
            "UserBranchId": item.UserBranchId,
            "OptometristId": item.OptometristId,
            "Active": "Y",
            "SpecializationId": item.DoctorSpecializationId,
            "MinPerCase": item.AvgConsultationTime,
            "RoleId": item.DoctorRoleId,
            "ClinicName": item.BranchName,
            "BranchEmail": item.BranchEmail,
            "CommunicationEmailId": item.CommunicationEmailId,
            "CommunicationMobileNo": item.CommunicationMobileNo,
            "CommunicationCountryCode": item.CommunicationCountryCode ? item.CommunicationCountryCode : ''
        });
        $scope.selectedDoctor = $scope.clinicDoctorList[0];
        eHnoteMasterDataService.addSelectedDoctorinAppList($scope.clinicDoctorList[0]);
    }
    $scope.AppDate = "";

    $scope.$on("registerclosePopup", function (event) {
        $scope.daySetupPopUp.dismiss('cancel');


        $scope.PageName = "book";
        $rootScope.appointment_type = "1";
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.AppDate = "";
        $scope.ispatientExistsval = false;
        $scope.calenderDate = undefined;
        var clinicAddressId = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid,
            "OptometristId": "",
            "ARassistantId": "",
        };

        if (doctorinfo.RoleID === 3 || doctorinfo.RoleID === 43 || doctorinfo.RoleID === 11 || doctorinfo.RoleID === 57) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        }


        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentStatus = "B";
        appointmentInfo.showAllHospitalsinAppList = false;
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

        SetupPopUp = $uibModal.open({
            "templateUrl": 'registerappointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            //"windowClass": "inventory-full-popup"
            "size": "lg"
        });

    });


    function validatetime(ApptstartTime, timestartTime, ApptendTime, timeendTime) {
        var IsAppttime = false;
        const time1 = ApptstartTime;
        const time2 = timestartTime;
        const time3 = ApptendTime;
        const time4 = timeendTime;

        const [hours1, minutes1, seconds1] = time1.split(':');
        const [hours2, minutes2, seconds2] = time2.split(':');
        const [hours3, minutes3, seconds3] = time3.split(':');
        const [hours4, minutes4, seconds4] = time4.split(':');

        const date1 = new Date(2022, 0, 1, +hours1, +minutes1, +seconds1);
        const date2 = new Date(2022, 0, 1, +hours2, +minutes2, +seconds2);
        const date3 = new Date(2022, 0, 1, +hours3, +minutes3, +seconds3);
        const date4 = new Date(2022, 0, 1, +hours4, +minutes4, +seconds4);

        if (((date2.getTime() >= date1.getTime()) || (date2.getTime() >= date1.getTime())) && (date4.getTime() <= date3.getTime())) {
            IsAppttime = true;
        }
        return IsAppttime;


        //else if (date2.getTime() > date1.getTime()) {
        //    
        //    console.log('time2 is greater than time1');
        //} else {
        //    console.log('time1 is equal to time2');
        //}

    }


    $scope.loadappt = function () {
        var DoctorID = 0;
        if ($scope.selectedDocCSSid === 0) {
            DoctorID = eHnoteMasterDataService.getLoginId();
        } else {
            DoctorID = $scope.selectedDocCSSid;
        }
        if ($scope.selectedDoctor.UserBranchId === 0) {
            DoctorID = 0;
        }
        var curdate = $scope.viewDate;
        var tmpToday = $filter('date')(curdate, "EEE").toUpperCase();
        var weekBeginDate;
        var weekEndDate;
        if (tmpToday.toUpperCase() === 'SUN') {
            weekBeginDate = moment(curdate).format('YYYY-MM-DD');
            weekEndDate = moment(curdate).isoWeekday(1).startOf('isoweek').add(12, 'd').format('YYYY-MM-DD');
        } else {
            weekBeginDate = moment(curdate).isoWeekday(1).startOf('isoweek').add(-1, 'd').format('YYYY-MM-DD');
            weekEndDate = moment(curdate).isoWeekday(1).startOf('isoweek').add(5, 'd').format('YYYY-MM-DD');
        }
        var HospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.GetAllIndicator = 1;
        // var formatteddateValue = moment(dateValue).format('YYYY-MM-DD');
        var formatteddateValue = $filter('date')(new Date(), "yyyy-MM-dd");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "usrType": "DOCTOR",
            "startDate": formatteddateValue,
            "endDate": formatteddateValue,
            "HospitalID": $scope.HospitalId,
            "GetAllIndicator": 0,
            "AppointmentTypeStatusIDList": "",
            "VisitReasonIdList": ""
        };

        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            params.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            params.VisitReasonIdList = visitRsnList || "";
        }

        eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onweekSuccess, onweekError);
        function onweekSuccess(data) {
            var booked = data;
            $scope.patDetails.length = 0;
            //$scope.UserScheduleId = data.UserAvailableSlots[0].UserScheduleId;
            //$scope.UserScheduleDetailId = data.UserAvailableSlots[0].UserScheduleDetailId;

            $scope.minPerCase = 15;
            $scope.eventsList = [];
            $scope.calendarList = [];
            $scope.appCount = data.appointmentCounts;
            $scope.calendarList = data.calendarList;

            var ToDate = $filter('date')(new Date(), "yyyy-MM-dd");
            var filteredTimeArray = $filter("filter")($scope.calendarList, function (item, index) { return ($filter('date')(new Date(item.consultationDt), "yyyy-MM-dd")) == ToDate }) || [];
            $scope.TodaycalendarList = [];
            if (filteredTimeArray.length > 0) {
                $scope.TodaycalendarList = filteredTimeArray[0].slotList;
            }

            if ($scope.TodaycalendarList.length > 0) {
                angular.forEach($scope.TodaycalendarList, function (titem) {
                    var filteredCalendardoctorlistArray = [];
                    filteredCalendardoctorlistArray = $filter("filter")($scope.Calendardoctorlist, function (item, index) { return item.DoctorId === titem.doctorID, item.UserBranchId == titem.UserBranchId }) || [];
                    if (filteredCalendardoctorlistArray.length > 0) {
                        angular.forEach(filteredCalendardoctorlistArray[0].SlotsList, function (ABitem) {
                            var startTime = ABitem.StartTime + ':00';
                            var endTime = ABitem.EndTime + ':00';
                            $scope.isAppttime = validatetime(startTime, titem.startTime, endTime, titem.endTime);
                            if ($scope.isAppttime == true) {
                                ABitem.PatientName = titem.patientInfo.fullName || '';
                                ABitem.patientInfo = titem.patientInfo || '';
                                ABitem.DoctorId = titem.doctorID || 0;
                                ABitem.AppointmentID = titem.appointmentID || 0;
                            }
                        });
                    }

                });
            }








        }
        function onweekError(data) {

        }
    }


    $scope.$on("successMethod", function (event) {

        console.log("ABCC");
        $scope.daySetupPopUp.dismiss('cancel');
        //if ($scope.userLoginDetails.RoleID !== 1 && $scope.userLoginDetails.RoleID !== 56) {
        //    eHnoteMasterDataService.addSelectedDoctorinAppList("");
        //    eHnoteMasterDataService.addSelectedHospitalinAppList("");
        //}
        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        var obj = {
            "selectedDoctor": $scope.selectedDoctor
        }
        $rootScope.$broadcast("AppointmentTypefilter", obj);
        if ($scope.activeEvent === 'Calendar1') {
            $scope.loadappt();
        }
        if ($scope.mainCalendarView.MainTab == 2) {
            $scope.filterSelectedDoctorsonCalendar();
            $scope.clearSelectedSlots();
            $scope.clearEventSelectedSlots();
        }

        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();

    });
    $scope.$on("reshedulesuccessMethod", function (event, data) {


        //eHnoteMasterDataService.addSelectedDoctorinAppList("");
        //eHnoteMasterDataService.addSelectedHospitalinAppList("");

        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        var obj = {
            "selectedDoctor": $scope.selectedDoctor
        }
        $rootScope.$broadcast("AppointmentTypefilter", obj);
        $scope.daySetupPopUp.dismiss('cancel');
        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();
    });
    $scope.$on("changeBranchAppointments", function (event, data) {

        doctorInfo = eHnoteMasterDataService.getUserInfo();


        if (data.doctordata.UserAddress !== undefined) {
            angular.forEach($scope.BranchesListArray, function (item, index) {
                if (item.ClinicName !== 'All Hospitals') {
                    if (item.BranchId === data.doctordata.UserAddress[0].ExtDetails.HospitalID) {
                        $scope.appControl.AppListselectedclinic = item;
                        $scope.changeAppointmentBranch(item, true, 'list');
                        eHnoteMasterDataService.addSelectedHospitalinAppList(item);

                    }
                }
            });
        }


    });
    $scope.openPatientNoteFile = function (item) {
        $scope.StartAutoRefreshAppointment();
        item.CaptureBillingFrom = "Appointment";
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $location.url("/appointmentFileUploads");
    };
    $scope.othervisitrsn = "";
    $scope.GetVisitReasonsArray = [];
    $scope.GetVisitReason = function (val) {

        var getParams = {
            "OrganizationId": $scope.HospitalId,
            //"OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "ReasonTypeId": 1,
            "SearchText": val || "",
            "VisitTypeId": $scope.ApptObj.AppointmentTypeId || null
        };
        //return eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    //$scope.GetVisitReasonsArray = resp.data.rows || [];
                    $scope.GetVisitReasonsArray = [];
                    $scope.GetVisitReasonsArray = $filter("filter")(resp.data.rows, function (kitem) {
                        return kitem.ActiveIND == "Y";
                    });
                    //return resp.data.rows.map(function (item) {
                    //    return item;
                    //});
                }

            }
        });
    };
    $scope.showcheckinPopup = false;
    $scope.checkInObj = {
        "UserId": eHnoteMasterDataService.getLoginId(),
        "RoleId": $scope.userLoginDetails.RoleID,
        "AppointmentId": "",
        // "CheckInStatus": "",
        "CheckInStatus": 2,
        "VisitReason": "",
        "AttenderName": ""
    };




    $scope.dynamicPopoverpatienttype = {
        templateUrl: "mypatienttypeTemplate.html"
    };
    $scope.showPatientTypePopup = false;
    $scope.showPatientTypeClick = function (item, ind) {
        $scope.Patienttypelist = item;
        item.showPatientTypePopup = true;
    };



    $scope.AddPatietnDetailsLog = function (PatientId) {

        let obj = {
            "UserHistoryId": 0,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": PatientId || 0,

        };
        eHnoteMainAppointmentService.AddPatientDetailsLog(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }
    $scope.ChangeSubcontent = function (row) {

        if ($scope.userLoginDetails.RoleID == 20) {

            alertify.error("You Don't Have Access To Patient Profile");
            return false;
        }

        if ($scope.UserAccessRights.AllAccessRights.CRMReminderViewPatientProfile == true) {
            $scope.ClickPatientProfile(row);
        }
        $scope.AddPatietnDetailsLog(row.PatientID);


        return false;

        eHnoteMainAppointmentService.getAdditionalApptDetailsById(row.AppointmentID).then(function (resp) {
            resp.data = resp.data || [];

            if (resp.data.length > 0) {

                row.BillingId = resp.data[0].BillingId;
                row.TreatmentPlanId = resp.data[0].TreatmentPlanId;
                row.PatientPreRequisiteId = resp.data[0].PatientPreRequisiteId;
                row.BillingCategoryTypeId = resp.data[0].BillingCategoryTypeId;
                row.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                row.ChildAppointmentDate = resp.data[0].ChildAppointmentDate || "";
                row.InsuranceType = resp.data[0].InsuranceType || "";
                row.PreviouslyDoneSurgery = resp.data[0].PreviouslyDoneSurgery || "";
                row.PreviouslyDoneSurgeryId = resp.data[0].OrganizationSurgeryId || "";
                row.DoctorSpecialization = resp.data[0].DoctorSpecialization || "";
                row.DoctorSpecializationId = resp.data[0].DoctorSpecializationId || "";
                row.PatientDetails = resp.data[0].Patient || "";

                $scope.cacheStorageItem.PatientPreRequisiteId = row.PatientPreRequisiteId;
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                if (row.DoctorID !== resp.data[0].DoctorId && row.AppointmentStatus !== resp.data[0].AppointmentStatus) {
                    row.IsAlreadyConsultationStarted = true;
                }

                $scope.ShowNewConsultation = true;

                $scope.masterQuestions = resp.data[0].masterQuestions;
                $scope.cacheStorageItem.masterQuestions = $scope.masterQuestions;
                $scope.cacheStorageItem.AppointmentBillingId = resp.data[0].BillingId || 0;  // BillingId added to consultation
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }


            angular.forEach($scope.BookedAppointmentList, function (item, index) {
                item.ShowSubcontent = false;
            });
            row.ShowSubcontent = !row.ShowSubcontent;



            var isCurrentDate = $scope.chkFutureDate($scope.referredappointmentdate);
            if (isCurrentDate) {
                if ($scope.DoctorId === row.DoctorID || $scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 59 || $scope.userLoginDetails.RoleID === 61) {

                    if ($scope.OrganizationSettingsData.BillingSettings != undefined) {
                        if ($scope.OrganizationSettingsData.BillingSettings.IsBillingMandatoryForStartConsultation === 1) {
                            if (row.BillingId === 0) {
                                row.startConsultationEntryAccess = false;
                            } else {
                                row.startConsultationEntryAccess = true;
                            }
                        } else {
                            if (row.AppointmentStatus === "B" || row.AppointmentStatus === "O") {
                                row.startConsultationEntryAccess = true;
                            }
                        }
                    } else {
                        if (row.AppointmentStatus === "B" || row.AppointmentStatus === "O") {
                            row.startConsultationEntryAccess = true;
                        }
                    }


                    if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && row.AppointmentStatus === "E") { // added by sabarish
                        row.startConsultationEntryAccess = false;
                    }




                }

            }


            if (row.AppointmentStatus === "E" || row.AppointmentStatus === "D") {//edit consulation access
                if ($scope.DoctorId === row.DoctorID) {
                    row.EditConsultationAccess = true;
                }
            }
            if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && (row.AppointmentStatus === "D" || row.AppointmentStatus === "O")) {
                row.EditConsultationAccess = true;
            }




        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });



    };



    $scope.ChangeSubcontentNew = function (row) {



        eHnoteMainAppointmentService.getAdditionalApptDetailsById(row.AppointmentID).then(function (resp) {
            resp.data = resp.data || [];

            if (resp.data.length > 0) {

                row.BillingId = resp.data[0].BillingId;
                row.TreatmentPlanId = resp.data[0].TreatmentPlanId;
                row.PatientPreRequisiteId = resp.data[0].PatientPreRequisiteId;
                row.BillingCategoryTypeId = resp.data[0].BillingCategoryTypeId;
                row.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                row.ChildAppointmentDate = resp.data[0].ChildAppointmentDate || "";
                row.InsuranceType = resp.data[0].InsuranceType || "";
                row.PreviouslyDoneSurgery = resp.data[0].PreviouslyDoneSurgery || "";
                row.PreviouslyDoneSurgeryId = resp.data[0].OrganizationSurgeryId || "";
                row.DoctorSpecialization = resp.data[0].DoctorSpecialization || "";
                row.DoctorSpecializationId = resp.data[0].DoctorSpecializationId || "";
                row.PatientDetails = resp.data[0].Patient || "";

                $scope.cacheStorageItem.PatientPreRequisiteId = row.PatientPreRequisiteId;
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                if (row.DoctorID !== resp.data[0].DoctorId && row.AppointmentStatus !== resp.data[0].AppointmentStatus) {
                    row.IsAlreadyConsultationStarted = true;
                }

                $scope.ShowNewConsultation = true;

                $scope.masterQuestions = resp.data[0].masterQuestions;
                $scope.cacheStorageItem.masterQuestions = $scope.masterQuestions;
                $scope.cacheStorageItem.AppointmentBillingId = resp.data[0].BillingId || 0;  // BillingId added to consultation
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }


            angular.forEach($scope.BookedAppointmentList, function (item, index) {
                item.ShowSubcontent = false;
            });
            row.ShowSubcontent = !row.ShowSubcontent;



            var isCurrentDate = $scope.chkFutureDate($scope.referredappointmentdate);
            if (isCurrentDate) {
                if ($scope.DoctorId === row.DoctorID || $scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 59 || $scope.userLoginDetails.RoleID === 61) {

                    if ($scope.OrganizationSettingsData.BillingSettings != undefined) {
                        if ($scope.OrganizationSettingsData.BillingSettings.IsBillingMandatoryForStartConsultation === 1) {
                            if (row.BillingId === 0) {
                                row.startConsultationEntryAccess = false;
                            } else {
                                row.startConsultationEntryAccess = true;
                            }
                        } else {
                            if (row.AppointmentStatus === "B" || row.AppointmentStatus === "O") {
                                row.startConsultationEntryAccess = true;
                            }
                        }
                    } else {
                        if (row.AppointmentStatus === "B" || row.AppointmentStatus === "O") {
                            row.startConsultationEntryAccess = true;
                        }
                    }


                    if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && row.AppointmentStatus === "E") { // added by sabarish
                        row.startConsultationEntryAccess = false;
                    }



                }

            }


            if (row.AppointmentStatus === "E" || row.AppointmentStatus === "D") {//edit consulation access
                if ($scope.DoctorId === row.DoctorID) {
                    row.EditConsultationAccess = true;
                }
            }
            if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && (row.AppointmentStatus === "D" || row.AppointmentStatus === "O")) {
                row.EditConsultationAccess = true;
            }




        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });



    };


    $scope.dynamicPopover = {
        templateUrl: "myPopoverTemplate.html"
    };

    $scope.AssignedDoctorFollowup = function (item, type) {
        if (item.DoctorVisitRsnID === 8) {
            return;
        }

        if (item.ChildAppointmentId !== 0) {
            if (item.ChildAppointmentBookedStatus === "B" || item.ChildAppointmentBookedStatus === "E" || item.ChildAppointmentBookedStatus === "O") {
                alertify.error("Already followUp appointment booked");
                return false;
            }
        }




        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        cacheStorageItem.IsComingFromFollowupDoctor = type === "FromApptList" ? true : false;

        cacheStorageItem.patientid = item.PatientDetails.PatientID;
        cacheStorageItem.PatientName = item.PatientDetails.FullName;
        cacheStorageItem.EmailID = item.PatientDetails.EmailId ? item.PatientDetails.EmailId : '';
        cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD ? item.PatientDetails.PhCntryCD : '';
        cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo ? item.PatientDetails.MobileNo : '';
        cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId ? item.PatientDetails.PatientDisplayId : '';

        cacheStorageItem.appointmentid = item.AppointmentID;
        cacheStorageItem.ParentAppointmentId = item.ParentAppointmentId;
        cacheStorageItem.RootAppointmentId = item.RootAppointmentId;
        cacheStorageItem.FollowUpDate = item.FollowUpDate;
        cacheStorageItem.HospitalEquipmentId = "";
        cacheStorageItem.HospitalEquipmentName = "";
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        $scope.ispatientExistsval = true;

        $scope.AppDate = "";
        $rootScope.appointment_type = item.DoctorVisitRsnID.toString();
        //LoadBranch();
        //LoadDoctor(item);
        var clinicAddressId = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = { "DoctorID": doctorinfo.doctorid };
        if (doctorinfo.RoleID === 3 || doctorinfo.RoleID === 4 || doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        }


        //$scope.calenderDate = moment(date).format('DD-MMM-YYYY ' + stime);
        //$scope.ffff = "appedit";
        $scope.calenderDate = undefined;
        $scope.PageName = 'directFollowup';
        // openAppPopup();
        BookApptPopupOpened();
    };


    $scope.PrintConsultationEntryForm = function (row) {
        eHnotePrintService.GenerateConsultationEntryPrint(row);

    };


    $scope.DirectBookFollowup = function (item, type) {

        $scope.StartAutoRefreshAppointment();

        if (item.DoctorVisitRsnID === 8) {
            return;
        }

        if (item.ChildAppointmentId !== 0) {
            if (item.ChildAppointmentBookedStatus === "B" || item.ChildAppointmentBookedStatus === "E" || item.ChildAppointmentBookedStatus === "O") {
                alertify.error("Already followUp appointment booked");
                return false;
            }
        }




        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        cacheStorageItem.IsComingFromFollowupDoctor = type === "FromApptList" ? true : false;

        cacheStorageItem.patientid = item.PatientDetails.PatientID;
        cacheStorageItem.PatientName = item.PatientDetails.FullName;
        cacheStorageItem.EmailID = item.PatientDetails.EmailId ? item.PatientDetails.EmailId : '';
        cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD ? item.PatientDetails.PhCntryCD : '';
        cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo ? item.PatientDetails.MobileNo : '';
        cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId ? item.PatientDetails.PatientDisplayId : '';

        cacheStorageItem.appointmentid = item.AppointmentID;
        cacheStorageItem.ParentAppointmentId = item.ParentAppointmentId;
        cacheStorageItem.RootAppointmentId = item.RootAppointmentId;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        $scope.ispatientExistsval = true;

        $scope.AppDate = "";
        $rootScope.appointment_type = "3";
        //LoadBranch();
        //LoadDoctor(item);
        var clinicAddressId = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = { "DoctorID": doctorinfo.doctorid };
        if (doctorinfo.RoleID === 3 || doctorinfo.RoleID === 4 || doctorinfo.RoleID === 43 || doctorinfo.RoleID === 57) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        }

        $scope.calenderDate = undefined;
        $scope.PageName = 'withoutConsultationFollowup';
        //  openAppPopup();
        BookApptPopupOpened();
    };

    $scope.callAtInterval = function (item) {

        if (item.DilationStartTime !== undefined) {
            var now = $filter("date")(new Date(), "dd/MM/yyyy HH:mm:ss");
            var then = $filter("date")(new Date(item.DilationStartTime), "dd/MM/yyyy HH:mm:ss");
            var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
            var d = moment.duration(ms);
            var h = d.hours();
            var m = d.minutes();
            var sec = d.seconds();
            item.Conunter = m + ":" + sec;
            if (h > 0) {
                item.isDilationstarted = true;

                $interval.cancel(item.ItemScope);
                item.Conunter = "59:00";
            }
        }


    };
    $scope.SaveDilation = function (MedicationObj, DilationSelectedEye) {
        if (MedicationObj === null) {
            alertify.error("Please Select Dilation Medication");
            return false;
        }
        MedicationObj.OrganId = DilationSelectedEye;
        mInstanceAdd.close(MedicationObj);
    };
    $scope.Closemed = function () {
        mInstanceAdd.dismiss('Cancel');
    };
    var mInstanceAdd;

    $scope.StratDilation = function (item) {
        $scope.DilationList.length = $scope.DilationList.length || 0;
        if ($scope.DilationList.length == 0) {
            alertify.error("Add at least one dilation medicine in settings module");
            return false;
        }
        if ($scope.DilationList.length !== 0) {
            mInstanceAdd = $uibModal.open({
                templateUrl: "DilationMedicationpopup.html",
                backdrop: "static",
                scope: $scope,
                size: "sm"

            });
            mInstanceAdd.result.then(function (MedicationObj) {

                ContinueDilation(item, MedicationObj);
            }, function () {
            });
        } else {
            ContinueDilation(item, "");
        }



    };
    function ContinueDilation(item, MedicationObj) {
        item.isDilationstarted = true;
        item.DilationMedicationName = MedicationObj ? MedicationObj.MedicationName : "";
        item.DilationMedicationId = MedicationObj ? MedicationObj.MedicationId : "";
        item.DilationStartTime = $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss");
        item.OrganId = MedicationObj.OrganId;
        // $scope.ModifyPatientDilation(item)
        var parms = {
            "DilationStartTime": item.DilationStartTime,
            "DilationEndTime": null,
            "AppointmentId": item.AppointmentID,
            "DilationMedicationId": MedicationObj ? MedicationObj.MedicationId : "",
            "OrganId": MedicationObj.OrganId,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "Frequency": "",
            "IsDeferred": false,
            "IsRefused": false,
            "DilationHistoryId": 0 // $scope.Medication.DilationHistoryId != 0 ? $scope.Medication.DilationHistoryId : 0,
        };
        eHnotePatientDataService.ModifyPatientDilation(parms, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.data[0].Status === "Success") {

                item.ItemScope = $interval(function () { $scope.callAtInterval(item); }, 1000);
                if ($scope.Tab === 'dilation') {

                }
                if (item.AppointmentStatus === "B") {
                    item.AppointmentStatus = "O";
                }
            }
        }
        function onerror(error) {
            console.log(error);
        }
    }
    $scope.StopDilation = function (item) {
        mInstanceAdd = $uibModal.open({
            templateUrl: "DilationRemarkspopup.html",
            backdrop: "static",
            scope: $scope,
            size: "sm"

        });

        var obj = {
            "PatientId": item.PatientID,
            "AppointmentId": item.AppointmentID
        }
        eHnotePatientDataService.GetDilationHistory(obj).then(function (resp) {
            var DilationHistoryArray = resp.data.rows || [];
            $scope.Medication.DilationHistoryId = 0;
            if (DilationHistoryArray.length > 0) {
                $scope.Medication.DilationHistoryId = DilationHistoryArray[0].DilationHistoryId || 0; // latest historyid
            }
        });

        $scope.SaveRemarks = function (remarks) {
            item.isDilationstarted = false;
            $interval.cancel(item.ItemScope);
            item.counter = "00:00";
            var parms = {
                "DilationStartTime": item.DilationStartTime,
                "DilationEndTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                "AppointmentId": item.AppointmentID,
                "DilationMedicationId": item.DilationMedicationId,
                "OrganId": item.OrganId,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "Remarks": remarks || "",
                "Frequency": "",
                "IsDeferred": false,
                "IsRefused": false,
                "DilationHistoryId": $scope.Medication.DilationHistoryId != 0 ? $scope.Medication.DilationHistoryId : 0,
            };
            eHnotePatientDataService.ModifyPatientDilation(parms, onsuccess, onerror);
            function onsuccess(resp) {
                $scope.DilationRemarks = "";
                mInstanceAdd.dismiss('Cancel');
                item.Conunter = "Done";
            }
            function onerror(error) {
                console.log(error);
            }
        }
    };


    function generatePatientNotes(patientId, item) {

        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.LifestyleHistory = [];
        $scope.cacheStorageItem.AllergyItems = [];
        $scope.cacheStorageItem.SuperBillArray = [];
        // $scope.cacheStorageItem.MedicalConditions = [];

        $scope.cacheStorageItem.OccularHistory = [];
        //eHnotePatientDataService.GetGeneralPatientHistory(patientId).then(function (resp) {
        eHnotePatientDataService.GetMedicalConditonHistoriesByPatientId(patientId).then(function (resp) {

            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.PatientPastMedicalHistory = resp.data.rows[0].PastMedicalHistory;
                    $scope.PatientBirthHistory = resp.data.rows[0].BirthHistory;
                    $scope.PatientOccularHistory = resp.data.rows[0].OccularHistory;
                    $scope.PatientFamilyHistory = resp.data.rows[0].FamilyHistory;
                    $scope.PatientImmunisationHistory = resp.data.rows[0].ImmunisationHistory;
                    $scope.PatientNutritionalHistory = resp.data.rows[0].NutritionalHistory;
                    $scope.PatientSurgicalHistory = resp.data.rows[0].SurgicalHistory;
                    $scope.PatientMenstrualHistory = resp.data.rows[0].MenstrualHistory;
                    $scope.PatientLifestyleHistory = resp.data.rows[0].LifestyleHistory;
                    $scope.PatientAllergyHistory = resp.data.rows[0].Allergy;
                    //  $scope.PatientMedicalConditionHistory = resp.data.CurrentTreatment;
                    $scope.PatientOccularHistory = resp.data.rows[0].OccularHistory;
                    $scope.SystemicHistory = resp.data.rows[0].SystemicHistory || [];
                    $scope.VaccinationHistory = resp.data.rows[0].VaccinationHistory || [];

                    if ($scope.PatientPastMedicalHistory !== undefined) {
                        if ($scope.PatientPastMedicalHistory.length !== 0) {
                            $scope.cacheStorageItem.MedicalHistory = $scope.PatientPastMedicalHistory;
                        }
                    }

                    if ($scope.PatientBirthHistory !== undefined) {
                        if ($scope.PatientBirthHistory.length !== 0) {
                            $scope.cacheStorageItem.BirthHistory = $scope.PatientBirthHistory;
                        }
                    }
                    if ($scope.PatientFamilyHistory !== undefined) {
                        if ($scope.PatientFamilyHistory.length !== 0) {
                            $scope.cacheStorageItem.FamilyHistory = $scope.PatientFamilyHistory;
                        }
                    }
                    if ($scope.PatientNutritionalHistory !== undefined) {
                        if ($scope.PatientNutritionalHistory.length !== 0) {
                            $scope.cacheStorageItem.NutritionalHistory = $scope.PatientNutritionalHistory;
                        }
                    }
                    if ($scope.PatientImmunisationHistory !== undefined) {
                        if ($scope.PatientImmunisationHistory.length !== 0) {
                            $scope.cacheStorageItem.ImmunisationHistory = $scope.PatientImmunisationHistory;
                        }
                    }
                    if ($scope.PatientSurgicalHistory !== undefined) {
                        if ($scope.PatientSurgicalHistory.length !== 0) {
                            $scope.cacheStorageItem.SurgicalHistory = $scope.PatientSurgicalHistory;
                        }
                    }
                    if ($scope.PatientMenstrualHistory !== undefined) {
                        if ($scope.PatientMenstrualHistory.length !== 0) {
                            $scope.cacheStorageItem.MenstrualHistory = $scope.PatientMenstrualHistory;
                        }
                    }

                    if ($scope.PatientLifestyleHistory !== undefined) {
                        if ($scope.PatientLifestyleHistory.length !== 0) {
                            $scope.cacheStorageItem.LifestyleHistory = $scope.PatientLifestyleHistory;
                        }
                    }

                    if ($scope.PatientAllergyHistory !== undefined) {
                        if ($scope.PatientAllergyHistory.length !== 0) {
                            $scope.cacheStorageItem.AllergyItems = $scope.PatientAllergyHistory;
                        }
                    }
                    if ($scope.PatientOccularHistory !== undefined) {
                        if ($scope.PatientOccularHistory.length !== 0) {
                            $scope.cacheStorageItem.OccularHistory = $scope.PatientOccularHistory;
                        }
                    }
                    $scope.cacheStorageItem.MedicalHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.MedicalConditions.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.BirthHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.SurgicalHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    //if ($scope.PatientMedicalConditionHistory !== undefined) {
                    //    if ($scope.PatientMedicalConditionHistory.length !== 0) {
                    //        $scope.PatientMedicalConditionHistory.forEach(function (pitem, index) {
                    //            pitem.ActiveInd = true;
                    //        });
                    //        $scope.cacheStorageItem.MedicalConditions = $scope.PatientMedicalConditionHistory;
                    //    }
                    //}
                    $scope.SystemicHistory = $scope.SystemicHistory || [];
                    if ($scope.SystemicHistory.length !== 0) {
                        $scope.cacheStorageItem.SystemicHistory = $scope.SystemicHistory;
                    }
                    $scope.VaccinationHistory = $scope.VaccinationHistory || [];
                    if ($scope.VaccinationHistory.length !== 0) {
                        $scope.cacheStorageItem.VaccinationHistory = $scope.VaccinationHistory;
                    }

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                    loadConsultationData1(item);
                }

            }


        }, function (err) {
            loadConsultationData1(item);
        });


    }

    function generatePatientNotes1(patientId, item) {

        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.LifestyleHistory = [];
        $scope.cacheStorageItem.AllergyItems = [];
        $scope.cacheStorageItem.SuperBillArray = [];
        // $scope.cacheStorageItem.MedicalConditions = [];

        $scope.cacheStorageItem.OccularHistory = [];
        //eHnotePatientDataService.GetGeneralPatientHistory(patientId).then(function (resp) {
        eHnotePatientDataService.GetMedicalConditonHistoriesByPatientId(patientId).then(function (resp) {

            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.PatientPastMedicalHistory = resp.data.rows[0].PastMedicalHistory;
                    $scope.PatientBirthHistory = resp.data.rows[0].BirthHistory;
                    $scope.PatientOccularHistory = resp.data.rows[0].OccularHistory;
                    $scope.PatientFamilyHistory = resp.data.rows[0].FamilyHistory;
                    $scope.PatientImmunisationHistory = resp.data.rows[0].ImmunisationHistory;
                    $scope.PatientNutritionalHistory = resp.data.rows[0].NutritionalHistory;
                    $scope.PatientSurgicalHistory = resp.data.rows[0].SurgicalHistory;
                    $scope.PatientMenstrualHistory = resp.data.rows[0].MenstrualHistory;
                    $scope.PatientLifestyleHistory = resp.data.rows[0].LifestyleHistory;
                    $scope.PatientAllergyHistory = resp.data.rows[0].Allergy;
                    //  $scope.PatientMedicalConditionHistory = resp.data.CurrentTreatment;
                    $scope.PatientOccularHistory = resp.data.rows[0].OccularHistory;

                    if ($scope.PatientPastMedicalHistory !== undefined) {
                        if ($scope.PatientPastMedicalHistory.length !== 0) {
                            $scope.cacheStorageItem.MedicalHistory = $scope.PatientPastMedicalHistory;
                        }
                    }

                    if ($scope.PatientBirthHistory !== undefined) {
                        if ($scope.PatientBirthHistory.length !== 0) {
                            $scope.cacheStorageItem.BirthHistory = $scope.PatientBirthHistory;
                        }
                    }
                    if ($scope.PatientFamilyHistory !== undefined) {
                        if ($scope.PatientFamilyHistory.length !== 0) {
                            $scope.cacheStorageItem.FamilyHistory = $scope.PatientFamilyHistory;
                        }
                    }
                    if ($scope.PatientNutritionalHistory !== undefined) {
                        if ($scope.PatientNutritionalHistory.length !== 0) {
                            $scope.cacheStorageItem.NutritionalHistory = $scope.PatientNutritionalHistory;
                        }
                    }
                    if ($scope.PatientImmunisationHistory !== undefined) {
                        if ($scope.PatientImmunisationHistory.length !== 0) {
                            $scope.cacheStorageItem.ImmunisationHistory = $scope.PatientImmunisationHistory;
                        }
                    }
                    if ($scope.PatientSurgicalHistory !== undefined) {
                        if ($scope.PatientSurgicalHistory.length !== 0) {
                            $scope.cacheStorageItem.SurgicalHistory = $scope.PatientSurgicalHistory;
                        }
                    }
                    if ($scope.PatientMenstrualHistory !== undefined) {
                        if ($scope.PatientMenstrualHistory.length !== 0) {
                            $scope.cacheStorageItem.MenstrualHistory = $scope.PatientMenstrualHistory;
                        }
                    }

                    if ($scope.PatientLifestyleHistory !== undefined) {
                        if ($scope.PatientLifestyleHistory.length !== 0) {
                            $scope.cacheStorageItem.LifestyleHistory = $scope.PatientLifestyleHistory;
                        }
                    }

                    if ($scope.PatientAllergyHistory !== undefined) {
                        if ($scope.PatientAllergyHistory.length !== 0) {
                            $scope.cacheStorageItem.AllergyItems = $scope.PatientAllergyHistory;
                        }
                    }
                    if ($scope.PatientOccularHistory !== undefined) {
                        if ($scope.PatientOccularHistory.length !== 0) {
                            $scope.cacheStorageItem.OccularHistory = $scope.PatientOccularHistory;
                        }
                    }
                    $scope.cacheStorageItem.MedicalHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.MedicalConditions.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.BirthHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    $scope.cacheStorageItem.SurgicalHistory.forEach(function (pitem, index) {
                        pitem.ActiveInd = true;
                        pitem.IsEdit = false;
                        pitem.Duration = pitem.Duration || "";
                        pitem.DurationType = pitem.DurationType || "D";
                        pitem.DurationTypeName = pitem.DurationType === "Y" ? "Years(s)" : (pitem.DurationType === "M" ? "Month(s)" : (pitem.DurationType === "D" ? "Day(s)" : (pitem.DurationType === "W" ? "Week(s)" : (pitem.DurationType === "C" ? "To Be continued" : (pitem.DurationType === "L" ? "Life Time" : "")))));
                        pitem.DurationDate = pitem.DurationDate ? $filter("date")(new Date(pitem.DurationDate), "dd-MMM-yyyy") : "";
                        pitem.ShowDateFormat = pitem.DurationDate ? true : false;
                    });
                    //if ($scope.PatientMedicalConditionHistory !== undefined) {
                    //    if ($scope.PatientMedicalConditionHistory.length !== 0) {
                    //        $scope.PatientMedicalConditionHistory.forEach(function (pitem, index) {
                    //            pitem.ActiveInd = true;
                    //        });
                    //        $scope.cacheStorageItem.MedicalConditions = $scope.PatientMedicalConditionHistory;
                    //    }
                    //}


                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                    loadConsultationData(item);
                }

            }


        }, function (err) {
            loadConsultationData(item);
        });


    }

    $scope.updateAppCheckInStatus = function (item, IsCheckedIn) {


        if ($scope.IsFutureAppointmentDate) {
            alertify.error("for future appointment Checkin/Checkout not allowed");
            return;
        }


        if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57) {
            if (item.DoctorID !== eHnoteMasterDataService.getLoginId()) {
                alertify.error("Not Allowed To Checkin/Checkout");
                return;
            }
        }


        object = {
            "AppointmentId": item.AppointmentID,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": $scope.hospid,
            "IsCheckedIn": IsCheckedIn
        };
        eHnotePatientDataService.addAppointmentCheckInStatus(object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (IsCheckedIn === "Y") {
                    alertify.success("Patient Checked In Successfully");
                    item.CheckInTime = resp.data.CheckInTime;
                    item.CheckOutTime = resp.data.CheckOutTime;
                } else {
                    alertify.success("Patient not Checked In");
                    item.CheckInTime = "";
                    item.CheckOutTime = "";
                }
            } else {
                alertify.error(resp.data.Message);
            }
        });
    };




    $scope.SortByAppointmentList = function (SortType, SortBy) {
        SortBy = (SortBy === "desc") ? "asc" : "desc";
        $scope.SortType = SortType;
        $scope.SortBy = SortBy;
        if (SortType === 1) {
            $scope.TimeDesc = SortBy;
        }
        if (SortType === 2) {
            $scope.StatusDesc = SortBy;
        }
        if (SortType === 3) {
            $scope.CheckInDesc = SortBy;
        }
        $scope.loadAppointments($scope.selectedDoctor, '');
    };


    $scope.RefreshAppointments = function () {
        $scope.StartAutoRefreshAppointment();
        $scope.SortType = 1;  //0;
        $scope.SortBy = "Asc";  //"desc";
        $scope.SearchObj.PatientId = 0;
        $scope.SearchObj.searchPatientIdTxt = "";
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchPatientfilter.IsPatientNameInd = false;
        $scope.SearchPatientfilter.PaientMRNO = "";

        $scope.SearchObj.ConsultationDt = moment().format("MMM-DD-YYYY");

        $scope.loadAppointments($scope.selectedDoctor, '');
        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        var obj = {
            "selectedDoctor": $scope.selectedDoctor
        }
        $rootScope.$broadcast("AppointmentTypefilter", obj);
    };

    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '200px',
        showCheckAll: false,
        showUncheckAll: false,
        dynamicTitle: false
    };
    $scope.CategoriesSelected = [];
    $scope.Categories = [{ id: 1, label: "David" }, { id: 2, label: "Jhon" }, { id: 3, label: "Danny" }];

    function getpatientdetailsbyid(patientid) {
        eHnoteAuditServices.getPatientDetailsById(patientid, ongetPatientDetailsSuccess, ongetPatientDetailsError);
    }

    function ongetPatientDetailsSuccess(data) {
        if (data !== undefined) {
            if (data.Patient !== undefined) {
                if (data.Patient.length > 0) {
                    appointmentinfo.PatientDetails = "";
                    appointmentinfo.PatientDetails = data;
                }
            }
        }
    }
    function ongetPatientDetailsError(error) {
        console.log(error);
    }

    $scope.loadSpecializationAppointments = function (item) {
        $scope.selectedSpecialization = item;
        $scope.selectedSpecializationId = item.Id || null;
        $scope.TempDoctorArray = [];
        if (item.Id != 0) {
            if ($scope.AppListselectedclinic.Doctors.length > 0) {
                angular.forEach($scope.AppListselectedclinic.Doctors, function (mitem) {
                    if (mitem.SpecializationId === item.Id) {
                        $scope.TempDoctorArray.push(mitem);
                    }
                });
                $scope.clinicDoctorList = $scope.TempDoctorArray;
                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (Nitem) {
                    return Nitem.RoleId === 1 || Nitem.RoleId === 3 || Nitem.RoleId === 4 || Nitem.RoleId === 43 || Nitem.RoleId === 16 || Nitem.RoleId === 56 || Nitem.RoleId === 57;
                });


                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "UserBranchId": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                $scope.clinicDoctorList.unshift(docAll);
            }
        }
        else {
            if ($scope.AppListselectedclinic.Doctors.length > 0) {
                $scope.clinicDoctorList = $filter("filter")($scope.AppListselectedclinic.Doctors, function (kitem) {
                    return kitem.RoleId === 1 || kitem.RoleId === 3 || kitem.RoleId === 4 || kitem.RoleId === 43 || kitem.RoleId === 16 || kitem.RoleId === 56 || kitem.RoleId === 57;
                });
            }
        }

        $scope.loadAppointments($scope.selectedDoctor, '');
    }



    $scope.dynamicApointmentStatus = {
        templateUrl: 'dynamicApointmentStatus.html',
        "scope": $scope
    };
    $scope.dynamicVisitStatus = {
        templateUrl: 'dynamicVisitStatus.html',
        "scope": $scope
    };
    $scope.dynamicApointmentTypeStatus = {
        templateUrl: 'dynamicApointmentTypeStatus.html',
        "scope": $scope
    };

    $scope.dynamicCheckInStatus = {
        templateUrl: 'dynamicCheckInStatus.html',
        "scope": $scope
    };
    $scope.selectDoctorsendTo = {
        templateUrl: 'sendToTemplate.html',
        "scope": $scope
    };
    $scope.dynamicAppAndCheckinStatus = {
        templateUrl: 'dynamicAppAndCheckinStatus.html',
        "scope": $scope
    };
    $scope.ApptStatusSelect = {
        templateUrl: 'AppointmentStatusSelectPopOver.html',
        "scope": $scope
    };
    $scope.ProfileStatusSelect = {
        templateUrl: 'ProfileStatusSelectPopOver.html',
        "scope": $scope
    };
    $scope.ReceptionistSelect = {
        templateUrl: 'ReceptionistSelectPopOver.html',
        "scope": $scope
    };
    // new consultation changes
    $scope.PreNewStartDirectConsultation = function (item, type) {

        $scope.IsNewConsultationScreen = true;
        if (item.IsAlreadyConsultationStarted) {
            alertify.error("Already some one started consultation,refresh appointments");
            return;
        }
        $scope.StartAutoRefreshAppointment();
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        eHnoteProcedureDataService.GetParentAndChildAppointmentDetails(item.AppointmentID).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.cacheStorageItem.ChildAppointmentId = resp.data[0].ChildAppointmentId || 0;
                $scope.cacheStorageItem.ChildAppointmentDoctorName = resp.data[0].ChildAppointmentDoctorName || "";
                $scope.cacheStorageItem.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                $scope.cacheStorageItem.ParentAppointmentId = resp.data[0].ParentAppointmentId || 0;
                $scope.cacheStorageItem.RootAppointmentId = resp.data[0].RootAppointmentId || 0;
                $scope.cacheStorageItem.ParentAppointmentDoctorName = resp.data[0].ParentAppointmentDoctorName || "";
            }
            $scope.cacheStorageItem.DoctorVisitRsnID = item.DoctorVisitRsnID;
            $scope.startDirectConsultation(item, type);
        }, function (err) {
            console.log(err);
        });
    };

    function continuetoStartVideoConsultation() {
        $location.url("/ApptTeleConsultation");
    }

    function continuetoVideoappointment(item) {

        $scope.DoctorSpecializationId = item.DoctorSpecializationId || 0;
        if ($scope.DoctorSpecializationId === 3) {
            if (item.ParentAppointmentId === 0) {
                if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || (item.AppointmentStatus === "E") || (item.AppointmentStatus === "D")) {

                    $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentID);


                } else {
                    $q.all([
                        eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                        eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                    ]).then(function (res) {
                        if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                            $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                        }
                        if (res[1].data.PatientFiles.length > 0) {
                            $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                        }
                        if (res[1].data.ForumFiles.length > 0) {
                            $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                        }
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        continuetoStartVideoConsultation();
                    }, function (err) {
                        console.log(err);
                    });
                }
            } else {
                if (item.AppointmentStatus === "B") {


                    if (item.TreatmentPlanId === 0) {
                        continuetoStartVideoConsultation();
                    } else {
                        $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.ParentAppointmentId);
                    }


                } else {
                    if ((item.AppointmentStatus === "O" && item.TreatmentPlanId !== 0) || item.AppointmentStatus === "E" || item.AppointmentStatus === "D") {
                        $scope.GetPatientCaseHistoryById(item.TreatmentPlanId, item.ConsultationId, item.AppointmentID);
                    } else {
                        $q.all([
                            eHnotePatientPVService.GetPastVitalsByAppId(item.AppointmentID),
                            eHnoteDiagnosisDataServices.GetPatientNotesFiles({ "AppointmentId": item.AppointmentID })
                        ]).then(function (res) {
                            if (res[0].data.Vitals !== null || res[0].data.Vitals !== undefined) {
                                $scope.cacheStorageItem.PatientVitals = res[0].data.Vitals;
                            }
                            if (res[1].data.PatientFiles.length > 0) {
                                $scope.cacheStorageItem.AppointmentPatientUploads = res[1].data.PatientFiles;
                            }
                            if (res[1].data.ForumFiles.length > 0) {
                                $scope.cacheStorageItem.ForumFiles = res[1].data.ForumFiles;
                            }
                            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                            continuetoStartVideoConsultation();
                        }, function (err) {
                            console.log(err);
                        });
                    }
                }
            }
        }

    }


    $scope.navToVideoConsultationScreen = function (item) {
        $scope.VideoConsultation = true;
        $scope.StartAutoRefreshAppointment();
        item.CaptureBillingFrom = "Appointment";
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.cacheStorageItem.ApptDate = item.ConsultationDt;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        generatePatientNotes(item.PatientID, item);
    }



    $scope.navtoPayment = function (item) {
        $scope.StartAutoRefreshAppointment();
        item.CaptureBillingFrom = "Appointment";
        eHnoteMasterDataService.addpatientData(item.PatientDetails);
        eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.cacheStorageItem.ApptDate = item.ConsultationDt;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $location.url("/OnlinePayment");
    }

    $scope.PreRequisteConsultation = function (item) {
        $scope.cacheStorageItem.PatientTypeId = item.PatientDetails.PatientTypeId;
        $scope.cacheStorageItem.ApptDate = item.ConsultationDt;
        $scope.cacheStorageItem.patientid = item.PatientID;
        $scope.cacheStorageItem.appointmentid = item.AppointmentID;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.ShowPreConsultationTab = true;
        $rootScope.ShowPreConsultationTab = $scope.ShowPreConsultationTab || false;
        eHnoteMasterDataService.addAppointmentInfo(item);
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $location.url("/ApptTeleConsultation");
    }

    $scope.Medication = {
        "DilationHistoryId": 0
    };



    $scope.changeDoctor = function (item) {
        if (item != "") {
            $scope.selectedDoctor = item;
        }
        if ($scope.activeEvent == 'day') {
            var avgConsultationTime = item.MinPerCase;
            sliceTime = item.MinPerCase;
            angular.element('#calControl').fullCalendar('option', {
                defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
                slotDuration: '00:' + avgConsultationTime + ':00',

            });
            setTimeout(function () {
                angular.element('.fc-scroller').scrollTop(0);
                if ($('.fc-now-indicator-line').offset()) {
                    angular.element('.fc-scroller').scrollTop($('.fc-now-indicator-line').offset().top - 300);
                }
            }, 1000);
            $scope.renderCalendar('calControl');
            // var curdate = $scope.viewDate;
            // uiCalendarConfig.calendars["calControl"].fullCalendar();
            // setCalendarSlot();
            onclick();
        }
    }

    $scope.SearchList = function () {

        var checkedArrayList = [];
        var checkedArrayList1 = [];

        if ($scope.MultiselectUserlist.length > 0) {
            checkedArrayList = _.where($scope.MultiselectUserlist, { isChecked: true });
        }
        if ($scope.MultiselectDoctorlist.length > 0) {
            checkedArrayList1 = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        }
        //var obj1 = {
        //    "SelectedDrList": checkedArrayList || []
        //};
        //eHnoteMasterDataService.addSelectedCrmApptUsers(obj1);

        var dobj = {
            "SelectedDoctorsList": checkedArrayList1 || [],
            "OPFromDate": ''
        };
        eHnoteMasterDataService.addSelectedCRMRemindersDoctors(dobj);

        var obj = {
            "FromDate": $scope.SearchObj.FromDate,
            "ToDate": $scope.SearchObj.ToDate,
            "AppointmentDate": $scope.SearchObj.ConsultationDt,
            "Screen": $scope.SearchObj.Screen
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);



        // var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        var selectedDoctors = $filter("filter")($scope.MultiselectDoctorlist, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }

        var consultantdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");
        var todaydate = $filter('date')(new Date(), "yyyy-MM-dd");

        $scope.HidePreviousDatesbtn = false;
        if (consultantdate < todaydate) {
            $scope.HidePreviousDatesbtn = true;
        }
        else {
            $scope.HidePreviousDatesbtn = false;
        }

        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        //var obj = {
        //    "selectedDoctor": $scope.selectedDoctor
        //}
        //$rootScope.$broadcast("AppointmentTypefilter", obj);
    }


    $scope.changeActiveSubTab = function (roomTypeId, status, val, pageload) {

        if (pageload !== "RefreshPageLoad") {
            var selectedDoctors = $filter("filter")($scope.MultiselectDoctorlist, function (iterator, ind) { return iterator.isChecked == true; });
            if (selectedDoctors.length === 0) {
                alertify.error("Please Select Doctor");
                return false;
            }

            $scope.ChangeSubTabRefreshBarandTopbarCount(); // refresh count TopBar & status bar
        }
        $scope.ChangeSubTabRefreshBarandTopbarCount(); // refresh count TopBar & status bar
        $scope.SearchObj.searchPatientIdTxt = "";
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchPatientfilter.IsPatientNameInd = false;
        $scope.SearchPatientfilter.PaientMRNO = "";

        $scope.SubTab = val;
        if (val === 11) {
            $scope.loadAppointments($scope.selectedDoctor, '');
        }

        else {
            var selectedDr = $scope.selectedDoctor;
            //if ($scope.selectedSpecialization.SpecializationId === 0) {
            //    $scope.selectedSpecializationId = null;
            //}

            //if ($scope.OrgSpecialitiesArray.length == 2) {
            //    $scope.selectedSpecializationId = $scope.SpecializationId;
            //}
            $scope.StartAutoRefreshAppointment();
            if (selectedDr.FullName === "All Doctors") {
                selectedDr.UserBranchId = 0;
            }
            eHnoteMasterDataService.addSelectedDoctorinAppList(selectedDr);
            if ($scope.mainAppointmentView.isCalendarorList === "calendar") {
                $scope.selectedDoctor = selectedDr;
                if (selectedDr !== null || selectedDr !== undefined) {
                    $scope.selectedDocCSSid = selectedDr.DoctorID;
                    $scope.selectedDocApp = onchageselectappoint;
                    $scope.appointmentDocName = selectedDr.FullName;
                    $scope.SelectedAppointmentDr = selectedDr;
                    avgConsultationTime = selectedDr.MinPerCase;
                    $scope.appointmentCountDisplay = selectedDr.AppointmentCount;
                    onchageselectappoint = $scope.selectedDoctor.UserBranchId;
                } else {
                    onchageselectappoint = $scope.AppListselectedclinic.UserBranchId;
                    avgConsultationTime = $scope.AppListselectedclinic.ExtDetails.MinPerCase || 15;
                }
                if ($scope.calendarView === "day") {
                    $scope.loadDayView($scope.viewDate, selectedDr);
                } else if ($scope.calendarView === "week") {
                    loadWeekView();
                } else if ($scope.calendarView === "month") {
                    loadMonthView();
                }
                $scope.selectedDoctorView = getDoctorName("calendar");
                $scope.showDoctorListing = false;
            }
            else {
                $scope.selectedDoctor = selectedDr;
                var hospitalID = 0;

                if ($scope.AppListselectedclinic.ClinicId === 0) {
                    var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
                    hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
                } else {
                    hospitalID = $scope.AppListselectedclinic.ClinicId;
                }
                // var subList = [];
                var subList = ""
                //angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
                //    if (mitems.isChecked) {
                //        subList.push(mitems.SubSpecializationId);
                //    }
                //});

                for (var i in $scope.allSubSpecializationsArray) {
                    if ($scope.allSubSpecializationsArray[i].isChecked) {
                        subList += "," + $scope.allSubSpecializationsArray[i].SubSpecializationId;
                    }
                }
                if (subList.charAt(0) === ",") {
                    subList = subList.slice(1);
                }

                var consultdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");
                var params = {};



                if ($scope.selectedDoctor.UserBranchId === 0) {
                    params = {
                        "HospitalID": hospitalID,
                        "ConsultationDt": consultdate,
                        "PageSize": $scope.Pagination.Patientitemsperpage,
                        "PageNumber": $scope.Pagination.currentPagePatient,
                        "SearchText": $scope.SearchObj.searchPatientTxt ? $scope.SearchObj.searchPatientTxt : "",
                        "SearchPatientId": $scope.SearchObj.searchPatientIdTxt ? $scope.SearchObj.searchPatientIdTxt : "",
                        "RoleId": $scope.userLoginDetails.RoleID,
                        "SortType": $scope.SortType,
                        "SortBy": $scope.SortBy,
                        "SpecializationId": $scope.selectedSpecializationId,
                        "SubSpecializationIds": subList,
                        'UserId': eHnoteMasterDataService.getLoginId()

                    };
                } else {
                    params = {
                        "UserBranchId": $scope.selectedDoctor.UserBranchId,
                        // "DoctorID": $scope.selectedDoctor.DoctorID,
                        "DoctorIds": "",
                        "ConsultationDt": consultdate,
                        "HospitalID": hospitalID,
                        "PageSize": $scope.Pagination.Patientitemsperpage,
                        "PageNumber": $scope.Pagination.currentPagePatient,
                        "SearchText": $scope.SearchObj.searchPatientTxt ? $scope.SearchObj.searchPatientTxt : "",
                        "SearchPatientId": $scope.SearchObj.searchPatientIdTxt ? $scope.SearchObj.searchPatientIdTxt : "",
                        "RoleId": $scope.userLoginDetails.RoleID,
                        "SortType": $scope.SortType,
                        "SortBy": $scope.SortBy,
                        "SpecializationId": $scope.selectedSpecializationId,
                        "SubSpecializationIds": subList,
                        'UserId': eHnoteMasterDataService.getLoginId()
                    };
                }

                //change for show the Optometrist appointments
                /*   if ($scope.userLoginDetails.RoleID === 10) {
                       params.OptometristId = $scope.SelectedOptometristId;
                   }*/

                if ($scope.userLoginDetails.RoleID === 61) {
                    params.ARassistantId = $scope.SelectedArId;
                }

                var list1 = [];
                angular.forEach($scope.AppointmentStatusFilterArray, function (items) {
                    if (items.isChecked) {
                        list1.push(items.Id);
                    }
                });
                var list2 = [];
                angular.forEach($scope.AppointmentVisitFilterArray, function (mitems) {
                    if (mitems.isChecked) {
                        list2.push(mitems.Id);
                    }
                });
                var list3 = [];
                angular.forEach($scope.appointmentTypes, function (mitems) {
                    if (mitems.isChecked) {
                        list3.push(mitems.Id);
                    }
                });
                var list4 = [];
                angular.forEach($scope.Visitreasons, function (mitems) {
                    if (mitems.isChecked) {
                        list4.push(mitems.ReasonId);
                    }
                });


                var newlist1 = "";
                for (var i in $scope.AppointmentStatusFilterArray) {
                    if ($scope.AppointmentStatusFilterArray[i].isChecked) {
                        newlist1 += "," + $scope.AppointmentStatusFilterArray[i].Id;
                    }
                }
                if (newlist1.charAt(0) === ",") {
                    newlist1 = newlist1.slice(1);
                }

                var newlist2 = "";
                for (var i in $scope.AppointmentVisitFilterArray) {
                    if ($scope.AppointmentVisitFilterArray[i].isChecked) {
                        newlist2 += "," + $scope.AppointmentVisitFilterArray[i].Id;
                    }
                }
                if (newlist2.charAt(0) === ",") {
                    newlist2 = newlist2.slice(1);
                }
                var newlist3 = "";
                for (var i in $scope.appointmentTypes) {
                    if ($scope.appointmentTypes[i].isChecked) {
                        newlist3 += "," + $scope.appointmentTypes[i].Id;
                    }
                }
                if (newlist3.charAt(0) === ",") {
                    newlist3 = newlist3.slice(1);
                }

                //var newlist4 = "";
                //for (var i in $scope.CheckInFilterArray) {
                //    if ($scope.CheckInFilterArray[i].isChecked) {
                //        newlist4 += ", " + $scope.CheckInFilterArray[i].Id;
                //    }
                //}
                //if (newlist4.charAt(0) === ",") {
                //    newlist4 = newlist4.slice(2);
                //}
                var newlist5 = "";
                for (var i in $scope.Visitreasons) {
                    if ($scope.Visitreasons[i].isChecked) {
                        newlist5 += "," + $scope.Visitreasons[i].ReasonId;
                    }
                }
                if (newlist5.charAt(0) === ",") {
                    newlist5 = newlist5.slice(1);
                }
                var newlist6 = "";
                for (var i in $scope.MultiselectDoctorlist) {
                    if ($scope.MultiselectDoctorlist[i].isChecked) {
                        newlist6 += "," + $scope.MultiselectDoctorlist[i].DoctorID;
                    }
                }
                if (newlist6.charAt(0) === ",") {
                    newlist6 = newlist6.slice(1);
                }

                params.AppointmentStatusIDLst = newlist1;
                params.VisitStatusIDLst = newlist2;
                params.AppointmentTypeStatusIDList = newlist3;

                params.VisitReasonIdList = newlist5;
                params.DoctorIds = newlist6;


                //params.AppointmentStatusIDLst = list1;
                //params.AppointmentTypeStatusIDList = list3;
                //params.VisitStatusIDLst = list2;
                //params.VisitReasonIdList = list4;
                params.GetAllAppointmentTypeStatusInd = $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck;
                params.GetAllAppointmentStatusInd = $scope.AllAppointmentStatusCheck;
                params.GetAllVisitStatusInd = $scope.AllAppointmentVisitStatusCheck;
                //params.AppointmentStatusIDLst = params.AppointmentStatusIDLst ? JSON.stringify(params.AppointmentStatusIDLst) : "";
                //params.VisitStatusIDLst = params.VisitStatusIDLst ? JSON.stringify(params.VisitStatusIDLst) : "";
                //params.SubSpecializationIds = params.SubSpecializationIds ? JSON.stringify(params.SubSpecializationIds) : "";
                //params.AppointmentTypeStatusIDList = params.AppointmentTypeStatusIDList ? JSON.stringify(params.AppointmentTypeStatusIDList) : "";              
                //params.VisitReasonIdList = params.VisitReasonIdList ? JSON.stringify(params.VisitReasonIdList) : "";

                params.StatusId = $scope.SelectedStatus.StatusId;


                if (val === 12 || val == 13 || val === 16) {
                    if (val === 16) {
                        params.CheckInStatus = 1;
                    }
                    if (val === 12) {
                        params.CheckInStatus = 2;
                    }
                    if (val === 13) {
                        params.CheckInStatus = 3;
                    }
                    eHnoteMainAppointmentService.GetCheckInOutAppointmentList(params, OnDynamicRoomSuccess, OnDynamicRoomError);
                }
                else {
                    params.RoomTypeId = roomTypeId;
                    params.Status = status;
                    eHnoteMainAppointmentService.GetPatientDynamicStatusListByType(params, OnDynamicRoomSuccess, OnDynamicRoomError);
                }


            }
        }
        var DoctorID = $scope.UserId;

        if (DoctorID !== 0) {
            var DoctorSignId = $filter("filter")($scope.allUserList, function (item) {
                return item.DoctorID === DoctorID;
            });
            if (DoctorSignId.length !== 0) {
                if (DoctorSignId[0].SignatureOfUser !== undefined && DoctorSignId[0].SignatureOfUser !== "") {
                    var SignString = DoctorSignId[0].SignatureOfUser;
                    localStorageFactory.set("DoctorSignatureString", SignString);
                }
                else {
                    var emptystring = "";
                    localStorageFactory.set("DoctorSignatureString", emptystring);
                }
            }

            else {
                var emptystring = "";
                localStorageFactory.set("DoctorSignatureString", emptystring);
            }
        }

    };

    function OnDynamicRoomSuccess(bookdata) {
        var data = [];
        data = bookdata.AppointmentList;
        // $scope.mainBookedAppointmentListCount = bookdata.count;
        LoadAppointmentlist(data);
        $scope.referredshowloading = false;
    }
    function OnDynamicRoomError(bookdata) {
        $scope.currentshowloading = false;
        $scope.pastshowloading = false;
        $scope.referredshowloading = false;
        alertify.error("Error in listing Appointments");
    }

    $scope.RoomTypeList = [];

    $scope.changeOtherDocOption = function (roomObj) {
        $scope.RoomSearchObj.SubSpecialityObj = "";
        $scope.RoomSearchObj.SubSpecialityId = "";
        $scope.RoomSearchObj.NewApptStartTime = "";
    }


    $scope.SendTo = function (item) {
        $scope.RoomSearchObj = {
            "RoomTypeId": 0,
            "RoomAvailability": 0,
            "RoomCapacity": 0,
            "RoomId": 0,
            "RoomTypeobj": "",
            "Roomobj": "",
            "Opthamobj": "",
            "ARobj": "",
            "OptomId": null,
            "ARId": null,
            "Technicianobj": "",
            "TechnicianId": null,
            "Counsellorobj": "",
            "CounsellorId": null,
            "DilationAssistantobj": "",
            "DilationAssistantId": null,
            "Doctorobj": "",
            "DoctorId": null,
            "SelectDoctor": "",
            "BillingUserId": null,
            "otherDocInd": false,
            "SubSpecialityObj": "",
            "SubSpecialityId": "",
            "NewApptStartTime": ""
        };

        console.log($scope.newAllSubSpecializationsArray);

        //  item.showSendTo = true;
        $scope.Patientlistdata = item;

        $scope.RoomType.IsSelectedCheckout = false;
        $scope.submitbutton = "Send";

        eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
            $scope.RoomTypeList = resp.data;
            $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 4 });
            item.showSendTo = true;

        }, function (err) {
            console.log(err);
            alertify.error("Getting  Failed");
        });

        // GetBranchSubSpecializations(doctorInfo.doctordata.UserAddress[0].SubOrganizationId, doctorInfo.doctordata.UserAddress[0].ClinicId, '');
    }


    $scope.Technishionsend = function (item) {

        if (item.CheckinStatusId === 1) {
            alertify.error("Please make sure patient is checked-in");
            return false;
        }

        var params = {
            "AppointmentId": item.AppointmentID || 0,
        };
        eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    var DynamicStatusarray = resp.data.rows[0];


                    if ((($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 62 || $scope.userLoginDetails.RoleID == 63 || $scope.userLoginDetails.RoleID == 64 || $scope.userLoginDetails.RoleID == 65 || $scope.userLoginDetails.RoleID == 66 || $scope.userLoginDetails.RoleID == 67 || $scope.userLoginDetails.RoleID == 68 || $scope.userLoginDetails.RoleID == 69) && (DynamicStatusarray.RoomTypeId == 10 || DynamicStatusarray.RoomTypeId == 11)) || ($scope.userLoginDetails.RoleID == 10 && DynamicStatusarray.RoomTypeId == 2) ||
                        ($scope.userLoginDetails.RoleID == 18 && DynamicStatusarray.RoomTypeId == 4) || ($scope.userLoginDetails.RoleID == 19 && DynamicStatusarray.RoomTypeId == 9) ||
                        (($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) && (DynamicStatusarray.RoomTypeId == 12 || DynamicStatusarray.RoomTypeId == 1)) ||
                        ($scope.userLoginDetails.RoleID == 20 && DynamicStatusarray.RoomTypeId == 10) || ($scope.userLoginDetails.RoleID == 21 && DynamicStatusarray.RoomTypeId == 10)) {

                        console.log("A");

                        $scope.DynamicStatusInstanceAdd = $uibModal.open({
                            templateUrl: "sendToPatientTemplate.html",
                            //"size": "lg",
                            "windowClass": "modal__ninety--",
                            "resolve": {
                                "HospitalId": function () { return $scope.HospitalId; },
                                "subSplArray": function () { return $scope.allSubSpecializationsArray; },
                                "allUserList": function () { return $scope.allUserList; },
                                "DoctorFullName": function () { return item.DoctorFullName; },
                                "AppointmentDoctorID": function () { return item.DoctorID; },
                                "appointmentid": function () { return item.AppointmentID; },
                                "patientid": function () { return item.PatientID; },
                                "Currentstatus": function () { return DynamicStatusarray.Status; },
                                "roleId": function () { return $scope.userLoginDetails.RoleID; },
                                "VisitTyepId": function () { return item.AppointmentTypeId; },
                                "PreviousRoomTypeId": function () { return DynamicStatusarray.RoomTypeId; },
                            },
                            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, Currentstatus, VisitTyepId, PreviousRoomTypeId) {
                                $scope.RoleId = roleId;
                                $scope.HospitalId = HospitalId;
                                $scope.DoctorFullName = DoctorFullName;
                                $scope.AppointmentDoctorID = AppointmentDoctorID;
                                $scope.allUserList = allUserList;
                                $scope.allSubSpecializationsArray = subSplArray;
                                $scope.appointmentid = appointmentid;
                                $scope.patientid = patientid;
                                $scope.Currentstatus = Currentstatus;
                                $scope.VisitTyepId = VisitTyepId;
                                $scope.PreviousRoomTypeId = PreviousRoomTypeId;

                                $scope.RoomType = {
                                    "IsSelectedCheckout": false
                                };
                                // $scope.searchfilterforRoom = searchfilterforRoom;
                                if ($scope.allUserList.length !== 0) {
                                    $scope.clinicDoctorList = [];
                                    $scope.Calendardoctorlist1 = [];
                                    $scope.MultiselectDoctorlist = [];

                                    //var RoleID = $scope.userLoginDetails.RoleID;
                                    $scope.AllCounsollerList = angular.copy($scope.allUserList);

                                    $scope.AllTechnicianList = angular.copy($scope.allUserList);

                                    $scope.AllDoctorList = angular.copy($scope.allUserList);

                                    $scope.AllBillingList = angular.copy($scope.allUserList);
                                    $scope.AllReceptionList = angular.copy($scope.allUserList);
                                    $scope.AllOpthaList = angular.copy($scope.allUserList);

                                    $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                        return item.RoleId === 1 || item.RoleId === 43;
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
                                    "txt9": ""
                                };
                                $scope.popup_value = 1;
                                eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                                    $scope.RoomTypeList = resp.data;
                                    $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });


                                }, function (err) {
                                    console.log(err);
                                    alertify.error("Getting  Failed");
                                });
                                $scope.switchtonexttab = function (val) {
                                    $scope.popup_value = val;
                                };



                                $scope.RoomSearchObj = {
                                    "RoomTypeId": 0,
                                    "RoomId": 0,
                                    "RoomTypeobj": "",
                                    "NewApptStartTime": "",
                                    "NewApptEndTime": "",
                                    "otherDocInd": "N",
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
                                    "SelectDoctor": "",
                                    "sendtoDoctorId": "",
                                    "otherDocInd": false,
                                    "SubSpecialityObj": "",
                                    "SubSpecialityId": "",

                                }

                                $scope.ChangesRoomType = function (item) {

                                    $scope.RoomSearchObj.NewApptStartTime = "";
                                    $scope.RoomSearchObj.NewApptEndTime = "";
                                    $scope.RoomSearchObj.otherDocInd = "N";
                                    $scope.RoomSearchObj.RoomTypeId = item;
                                    $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "" };
                                    $scope.RoomSearchObj.SelectDoctor = "";
                                    if (item != 7) {
                                        $scope.RoomType.IsSelectedCheckout = false;
                                    }

                                    if ($scope.RoomSearchObj.RoomTypeId === 1) {

                                        $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                                        $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;

                                        $scope.ChangesRoomDoctor($scope.SelectDoctor);

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

                                            //  reStructureDoctorSelectedSlots(response);
                                            newreStructureDoctorSelectedSlots(response);
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



                                    // var doctorid = eHnoteMasterDataService.getLoginId;
                                    //if ($scope.RoleId == 1 || $scope.RoleId == 43) {

                                    //}
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


                                function reStructureDoctorSelectedSlots(resp) {
                                    if (resp.IsLeave) {
                                        alertify.error("Doctor is on Leave.Please choose another doctor");
                                        return false;
                                    }
                                    if (resp.UserConsultationNew.length > 0) {
                                        var apptTypeId = parseInt($scope.VisitTyepId);
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
                                function newreStructureDoctorSelectedSlots(resp) {
                                    //if (resp.IsLeave) {
                                    //    alertify.error("Doctor is on Leave.Please choose another doctor");
                                    //    return false;
                                    //}
                                    if (resp.UserScheduleSlots.length > 0) {
                                        var apptTypeId = parseInt($scope.VisitTyepId);
                                        resp.UserScheduleSlots[0].NewAppointmentMaxSlots = resp.UserScheduleSlots[0].NewAppointmentMaxSlots || 0;
                                        resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || 0;
                                        resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || 0;
                                        resp.UserScheduleSlots[0].ASCAppointmentMaxSlots = resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || 0;
                                        if (apptTypeId == 1) {
                                            if (resp.UserScheduleSlots[0].NewAppointmentMaxSlots != 0) {
                                                if (resp.DoctorNewAppointmentCount > resp.UserScheduleSlots[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserScheduleSlots[0].NewAppointmentMaxSlots) {
                                                    alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                                    return false;
                                                }
                                            }
                                        }
                                        else if (apptTypeId == 2) {
                                            if (resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots != 0) {
                                                if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                                                    alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                    return false;
                                                }
                                            }
                                        }
                                        else if (apptTypeId == 3) {
                                            if (resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots != 0) {
                                                if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                                                    alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                    return false;
                                                }
                                            }
                                        }
                                        else if (apptTypeId == 4 || apptTypeId == 14) {
                                            if (resp.UserScheduleSlots[0].ASCAppointmentMaxSlots != 0) {
                                                if (resp.DoctorAscAppointmentCount > resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserScheduleSlots[0].ASCAppointmentMaxSlots) {
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
                                    angular.forEach(resp.UserScheduleSlots, function (item) {

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


                                $scope.SendToRoom = function (item) {
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

                                    $scope.RoomTypeId = null;
                                    if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                                        var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                                        $scope.RoomTypeId = 1;
                                        if (SuffixId == 13) { //optha
                                            $scope.RoomTypeId = 12;
                                        }
                                        if (SuffixId == 10) { //doctor
                                            $scope.RoomTypeId = 1;
                                        }

                                    } else if ($scope.RoleId == 10) {
                                        $scope.RoomTypeId = 2;
                                    } else if ($scope.RoleId == 19) {
                                        $scope.RoomTypeId = 9;
                                    }
                                    else if ($scope.RoleId == 2) {
                                        $scope.RoomTypeId = 10;
                                    }
                                    else if ($scope.RoleId == 18) {
                                        $scope.RoomTypeId = 4;
                                    }
                                    else {
                                        $scope.RoomTypeId = null;
                                    }

                                    if ($scope.Currentstatus == 'Waiting') {

                                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                        var params = {
                                            "UserId": eHnoteMasterDataService.getLoginId(),
                                            "HospitalId": $scope.HospitalId,
                                            "AppointmentId": $scope.appointmentid,
                                            "AppointmentTrackerDetailId": 0,
                                            "RoleId": $scope.RoleId,
                                            "DoctorId": null,
                                            "DoctorRoleId": null,
                                            "RoomTypeId": $scope.PreviousRoomTypeId, //$scope.RoomTypeId,
                                            "RoomId": null,
                                            "CurrentTime": $scope.CurrentTime,
                                            "IsSendTo": "N",
                                            "IsCheckedIn": "N",
                                            "IsCheckedOut": "N",
                                            "IsReCheckIn": "N",
                                            "IsReCheckOut": "N"
                                        }
                                        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                            if (resp.data.Status == "Success") {
                                                $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                                var params = {
                                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                                    "HospitalId": $scope.HospitalId,
                                                    "AppointmentId": $scope.appointmentid,
                                                    "AppointmentTrackerDetailId": 0,
                                                    "RoleId": $scope.RoleId,
                                                    "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                                    "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                                    "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                                    "RoomId": $scope.RoomSearchObj.RoomId,
                                                    "IsSendTo": "Y",
                                                    "CurrentTime": $scope.CurrentTime,
                                                    "IsCheckedIn": "N",
                                                    "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                                                    "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                                                    "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                                                    "IsCheckedOut": "N",
                                                    "IsReCheckIn": "N",
                                                    "IsReCheckOut": "N"
                                                }

                                                console.log($scope.RoleId);
                                                if (params.RoomTypeId === 7) {
                                                    params.RoomId = null;
                                                    params.IsCheckedOut = "Y";
                                                    params.Status = 'Completed';
                                                }
                                                eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                                    if (resp.data.Status == "Success") {

                                                    } else {
                                                        //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                                                        alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                                    }
                                                }, function (err) {
                                                    console.log(err);
                                                    alertify.error("Getting Failed");
                                                });

                                                $uibModalInstance.close("cancel");
                                            }
                                        }, function (err) {
                                            console.log(err);
                                            alertify.error("Getting Failed");
                                        });
                                    } else {


                                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                        var params = {
                                            "UserId": eHnoteMasterDataService.getLoginId(),
                                            "HospitalId": $scope.HospitalId,
                                            "AppointmentId": $scope.appointmentid,
                                            "AppointmentTrackerDetailId": 0,
                                            "RoleId": $scope.RoleId,
                                            "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                            "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                            "RoomId": $scope.RoomSearchObj.RoomId,
                                            "IsSendTo": "Y",
                                            "CurrentTime": $scope.CurrentTime,
                                            "IsCheckedIn": "N",
                                            "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                                            "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                                            "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                                            "IsCheckedOut": "N",
                                            "IsReCheckIn": "N",
                                            "IsReCheckOut": "N"
                                        }

                                        console.log($scope.RoleId);
                                        if (params.RoomTypeId === 7) {
                                            params.RoomId = null;
                                            params.IsCheckedOut = "Y";
                                            params.Status = 'Completed';
                                        }
                                        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                            if (resp.data.Status == "Success") {

                                            } else {
                                                //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                                                alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                            }
                                        }, function (err) {
                                            console.log(err);
                                            alertify.error("Getting Failed");
                                        });

                                        $uibModalInstance.close("cancel");

                                    }




                                }

                            },



                        });

                        $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
                            $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                        }, function (cancel) {
                        });
                    }
                    else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 21 || $scope.userLoginDetails.RoleID == 10 || $scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43 || $scope.userLoginDetails.RoleID == 19 || $scope.userLoginDetails.RoleID == 62 || $scope.userLoginDetails.RoleID == 63 || $scope.userLoginDetails.RoleID == 64 || $scope.userLoginDetails.RoleID == 65 || $scope.userLoginDetails.RoleID == 66 || $scope.userLoginDetails.RoleID == 67 || $scope.userLoginDetails.RoleID == 68 || $scope.userLoginDetails.RoleID == 69) && (DynamicStatusarray.RoomTypeId == 1 || DynamicStatusarray.RoomTypeId == 2 || DynamicStatusarray.RoomTypeId == 4 || DynamicStatusarray.RoomTypeId == 9 || DynamicStatusarray.RoomTypeId == 12 || DynamicStatusarray.RoomTypeId == 10 || DynamicStatusarray.RoomTypeId == 11) && DynamicStatusarray.Status == 'Waiting') {

                        console.log("B");
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>The patient is " + DynamicStatusarray.Status + " at " + DynamicStatusarray.RoomType + " , would you like to take the patient to your active room? </h4>",
                            function () {
                                $scope.DynamicStatusInstanceAdd = $uibModal.open({
                                    templateUrl: "sendToPatientTemplate.html",
                                    /* "size": "lg",*/
                                    "windowClass": "modal__ninety--",
                                    "resolve": {
                                        "HospitalId": function () { return $scope.HospitalId; },
                                        "subSplArray": function () { return $scope.allSubSpecializationsArray; },
                                        "allUserList": function () { return $scope.allUserList; },
                                        "DoctorFullName": function () { return item.DoctorFullName; },
                                        "AppointmentDoctorID": function () { return item.DoctorID; },
                                        "appointmentid": function () { return item.AppointmentID; },
                                        "patientid": function () { return item.PatientID; },
                                        "roleId": function () { return $scope.userLoginDetails.RoleID; },
                                        "PreviousRoomTypeId": function () { return DynamicStatusarray.RoomTypeId; },
                                    },
                                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, PreviousRoomTypeId) {
                                        $scope.RoleId = roleId;
                                        $scope.HospitalId = HospitalId;
                                        $scope.DoctorFullName = DoctorFullName;
                                        $scope.AppointmentDoctorID = AppointmentDoctorID;
                                        $scope.allUserList = allUserList;
                                        $scope.allSubSpecializationsArray = subSplArray;
                                        $scope.appointmentid = appointmentid;
                                        $scope.patientid = patientid;
                                        $scope.PreviousRoomTypeId = PreviousRoomTypeId;
                                        $scope.RoomType = {
                                            "IsSelectedCheckout": false
                                        };
                                        // $scope.searchfilterforRoom = searchfilterforRoom;
                                        if ($scope.allUserList.length !== 0) {
                                            $scope.clinicDoctorList = [];
                                            $scope.Calendardoctorlist1 = [];
                                            $scope.MultiselectDoctorlist = [];

                                            //var RoleID = $scope.userLoginDetails.RoleID;
                                            $scope.AllCounsollerList = angular.copy($scope.allUserList);

                                            $scope.AllTechnicianList = angular.copy($scope.allUserList);

                                            $scope.AllDoctorList = angular.copy($scope.allUserList);

                                            $scope.AllBillingList = angular.copy($scope.allUserList);
                                            $scope.AllReceptionList = angular.copy($scope.allUserList);
                                            $scope.AllOpthaList = angular.copy($scope.allUserList);

                                            $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                                            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                                return item.RoleId === 1 || item.RoleId === 43;
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
                                                /*return (item.RoleId === 1 && item.SuffixName === "OD") || (item.RoleId === 43 && item.SuffixName === "OD");*/
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
                                            "txt9": ""
                                        };
                                        $scope.popup_value = 1;
                                        eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                                            $scope.RoomTypeList = resp.data;
                                            $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });


                                        }, function (err) {
                                            console.log(err);
                                            alertify.error("Getting  Failed");
                                        });
                                        $scope.switchtonexttab = function (val) {
                                            $scope.popup_value = val;
                                        };

                                        //$scope.cancel = function () {
                                        //    $uibModalInstance.dismiss("cancel");
                                        //};

                                        $scope.RoomSearchObj = {
                                            "RoomTypeId": 0,
                                            "RoomId": 0,
                                            "RoomTypeobj": "",
                                            "NewApptStartTime": "",
                                            "NewApptEndTime": "",
                                            "otherDocInd": "N",
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
                                            "SelectDoctor": "",
                                            "sendtoDoctorId": "",
                                            "otherDocInd": false,
                                            "SubSpecialityObj": "",
                                            "SubSpecialityId": "",

                                        }

                                        $scope.ChangesRoomType = function (item) {

                                            $scope.RoomSearchObj.NewApptStartTime = "";
                                            $scope.RoomSearchObj.NewApptEndTime = "";
                                            $scope.RoomSearchObj.otherDocInd = "N";
                                            $scope.RoomSearchObj.RoomTypeId = item;
                                            $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "" };
                                            $scope.RoomSearchObj.SelectDoctor = "";

                                            if ($scope.RoomSearchObj.RoomTypeId === 1) {
                                                // if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                                                //   $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                                                $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                                                $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;

                                                $scope.ChangesRoomDoctor($scope.SelectDoctor);
                                                //}
                                                //else {
                                                //    $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                                                //}

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

                                                    //   reStructureDoctorSelectedSlots(response);
                                                    newreStructureDoctorSelectedSlots(response);
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



                                            // var doctorid = eHnoteMasterDataService.getLoginId;
                                            //if ($scope.RoleId == 1 || $scope.RoleId == 43) {

                                            //}
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


                                        function reStructureDoctorSelectedSlots(resp) {
                                            if (resp.IsLeave) {
                                                alertify.error("Doctor is on Leave.Please choose another doctor");
                                                return false;
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
                                        function newreStructureDoctorSelectedSlots(resp) {
                                            //if (resp.IsLeave) {
                                            //    alertify.error("Doctor is on Leave.Please choose another doctor");
                                            //    return false;
                                            //}
                                            if (resp.UserScheduleSlots.length > 0) {
                                                var apptTypeId = parseInt($scope.VisitTyepId);
                                                resp.UserScheduleSlots[0].NewAppointmentMaxSlots = resp.UserScheduleSlots[0].NewAppointmentMaxSlots || 0;
                                                resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || 0;
                                                resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || 0;
                                                resp.UserScheduleSlots[0].ASCAppointmentMaxSlots = resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || 0;
                                                if (apptTypeId == 1) {
                                                    if (resp.UserScheduleSlots[0].NewAppointmentMaxSlots != 0) {
                                                        if (resp.DoctorNewAppointmentCount > resp.UserScheduleSlots[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserScheduleSlots[0].NewAppointmentMaxSlots) {
                                                            alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                                            return false;
                                                        }
                                                    }
                                                }
                                                else if (apptTypeId == 2) {
                                                    if (resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots != 0) {
                                                        if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                                                            alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                            return false;
                                                        }
                                                    }
                                                }
                                                else if (apptTypeId == 3) {
                                                    if (resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots != 0) {
                                                        if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                                                            alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                            return false;
                                                        }
                                                    }
                                                }
                                                else if (apptTypeId == 4 || apptTypeId == 14) {
                                                    if (resp.UserScheduleSlots[0].ASCAppointmentMaxSlots != 0) {
                                                        if (resp.DoctorAscAppointmentCount > resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserScheduleSlots[0].ASCAppointmentMaxSlots) {
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
                                            angular.forEach(resp.UserScheduleSlots, function (item) {

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


                                        $scope.SendToRoom = function (item) {
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
                                            //if ($scope.RoomSearchObj.RoomTypeId !== 7) {
                                            //    if ($scope.RoomSearchObj.RoomId === 0) {
                                            //        alertify.error("Select Room Type");
                                            //        return false;
                                            //    }
                                            //}

                                            //$scope.Time = $filter("date")(new Date(), "HH:mm");

                                            $scope.RoomTypeId = null;
                                            if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                                                var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                                                $scope.RoomTypeId = 1;
                                                if (SuffixId == 13) { //optha
                                                    $scope.RoomTypeId = 12;
                                                }
                                                if (SuffixId == 10) { //doctor
                                                    $scope.RoomTypeId = 1;
                                                }

                                            } else if ($scope.RoleId == 10) {
                                                $scope.RoomTypeId = 2;
                                            } else if ($scope.RoleId == 19) {
                                                $scope.RoomTypeId = 9;
                                            }
                                            else if ($scope.RoleId == 2) {
                                                $scope.RoomTypeId = 10;
                                            } else {
                                                $scope.RoomTypeId = null;
                                            }

                                            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                            var params = {
                                                "UserId": eHnoteMasterDataService.getLoginId(),
                                                "HospitalId": $scope.HospitalId,
                                                "AppointmentId": $scope.appointmentid,
                                                "AppointmentTrackerDetailId": 0,
                                                "RoleId": $scope.RoleId,
                                                "DoctorId": null,
                                                "DoctorRoleId": null,
                                                "RoomTypeId": $scope.PreviousRoomTypeId, // $scope.RoomTypeId,
                                                "RoomId": null,
                                                "CurrentTime": $scope.CurrentTime,
                                                "IsSendTo": "N",
                                                "IsCheckedIn": "N",
                                                "IsCheckedOut": "N",
                                                "IsReCheckIn": "N",
                                                "IsReCheckOut": "N"
                                            }
                                            eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                                if (resp.data.Status == "Success") {
                                                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                                    var params = {
                                                        "UserId": eHnoteMasterDataService.getLoginId(),
                                                        "HospitalId": $scope.HospitalId,
                                                        "AppointmentId": $scope.appointmentid,
                                                        "AppointmentTrackerDetailId": 0,
                                                        "RoleId": $scope.RoleId,
                                                        "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                                        "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                                        "RoomId": $scope.RoomSearchObj.RoomId,
                                                        "IsSendTo": "Y",
                                                        "CurrentTime": $scope.CurrentTime,
                                                        "IsCheckedIn": "N",
                                                        "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                                                        "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                                                        "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                                                        "IsCheckedOut": "N",
                                                        "IsReCheckIn": "N",
                                                        "IsReCheckOut": "N"
                                                    }

                                                    console.log($scope.RoleId);
                                                    if (params.RoomTypeId === 7) {
                                                        params.RoomId = null;
                                                        params.IsCheckedOut = "Y";
                                                        params.Status = 'Completed';
                                                    }
                                                    eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                                        if (resp.data.Status == "Success") {

                                                        } else {
                                                            //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                                                            alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                                        }
                                                    }, function (err) {
                                                        console.log(err);
                                                        alertify.error("Getting Failed");
                                                    });

                                                    $uibModalInstance.close("cancel");
                                                }
                                            }, function (err) {
                                                console.log(err);
                                                alertify.error("Getting Failed");
                                            });



                                        }

                                    },



                                });

                                $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
                                    $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                                }, function (cancel) {
                                });
                            }, function () {
                                return false;
                            });
                    }

                    else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 21 || $scope.userLoginDetails.RoleID == 62 || $scope.userLoginDetails.RoleID == 63 || $scope.userLoginDetails.RoleID == 64 || $scope.userLoginDetails.RoleID == 65 || $scope.userLoginDetails.RoleID == 66 || $scope.userLoginDetails.RoleID == 67 || $scope.userLoginDetails.RoleID == 68 || $scope.userLoginDetails.RoleID == 69 || DynamicStatusarray.RoleID == 9) && (DynamicStatusarray.RoomTypeId == 1 || DynamicStatusarray.RoomTypeId == 2 || DynamicStatusarray.RoomTypeId == 4) && DynamicStatusarray.Status == 'Active') {
                        console.log("C");

                        alertify.error("Patient is Active at  " + DynamicStatusarray.UserName + ",So Can't Send the Patient");
                        return false;
                    }

                }
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });



    }

    $scope.ShowPatientCurrentStatus = function (aitem) {

        $scope.objApptRemarks = {
            "Remarks": "",
            "DoctorId": aitem.DoctorID,
            "CreatedBy": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "PatientId": aitem.PatientID,
            "AppointmentId": aitem.AppointmentID,
            "DeleteInd": "N"

        }

        $scope.mainPatientTrackersArray = [];
        $scope.ApptTrackerRemarksArray = [];
        var obj = {
            "AppointmentDate": $filter('date')(new Date(), "yyyy-MM-dd"),
            "DoctorId": aitem.DoctorID,
            "AppointmentID": aitem.AppointmentID,
            "HospitalId": $scope.HospitalId,
            "PatientId": 0,
            "PageSize": 10,
            "PageNumber": 1
        };
        eHnotePatientDataService.GetAppointmentTrackerDetails(obj).then(function (resp) {
            if (resp.data.status === 'Success') {
                $scope.ApptTrackerRemarksArray = resp.data.TrackerRemarks || [];
                $scope.SetupPopUp = $uibModal.open({
                    templateUrl: "PatientTrackerTemplate.html",
                    "scope": $scope,
                    "keyboard": false,
                    "backdrop": "static",
                    "size": "lg",
                });
                $scope.mainPatientTrackersArray = resp.data.rows || [];
                $scope.SearchObj.TotalCount = resp.data.count || 0;

                if ($scope.mainPatientTrackersArray.length > 0) {
                    angular.forEach($scope.mainPatientTrackersArray, function (mainitem) {
                        if (mainitem.TrackerDetails.length > 0) {


                            angular.forEach(mainitem.TrackerDetails, function (item) {

                                item.isWaitingSlot = false;
                                item.isActiveSlot = false;
                                item.isCompletedSlot = false;
                                item.isWaitNormalSlot = false;
                                item.isWaitGreenSlot = false;
                                item.isWaitYellowSlot = false;
                                item.isWaitRedSlot = false;
                                item.isActiveNormalSlot = false;
                                item.isActiveGreenSlot = false;
                                item.isActiveYellowSlot = false;
                                item.isActiveRedSlot = false;
                                item.isCompletedNormalSlot = false;
                                item.isCompletedGreenSlot = false;
                                item.isCompletedYellowSlot = false;
                                item.isCompletedRedSlot = false;





                                if (item.UserId === 0 && item.RoomTypeId !== 0) {
                                    item.isWaitingSlot = true;

                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                    //var apptDt = $filter('date')(new Date(aitem.ConsultationDt), "yyyy-MM-dd");
                                    var apptDt = aitem.ConsultationDt;


                                    var dresult = dateCompare(apptDt, currentDt)




                                    if (dresult) {


                                        var DiffMinutes = getcurrentTimeDifferenceMinutes(item.WaitingStartTime);
                                        var waittimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                        item.WaitTime = waittimec;

                                        console.log(DiffMinutes);
                                        console.log(waittimec);
                                        if (DiffMinutes <= 5) {
                                            item.isWaitNormalSlot = true;
                                        }
                                        else if (DiffMinutes > 5 && DiffMinutes <= 10) {
                                            item.isWaitGreenSlot = true;
                                        }
                                        else if (DiffMinutes > 10 && DiffMinutes <= 15) {
                                            item.isWaitYellowSlot = true;
                                        }
                                        else if (DiffMinutes > 15) {
                                            item.isWaitRedSlot = true;
                                        }




                                        var DiffMinutesA = getcurrentTimeDifferenceMinutes(item.ActiveStartTime);
                                        var ActiveTimecA = getHrsnMinutesFormatfromMinutes(DiffMinutesA);
                                        item.ActiveTime = ActiveTimecA;

                                        var newactivet = item.ActiveTime.split(':');
                                        var newactivethour = parseFloat(newactivet[0]) || 0;
                                        var newactivetmin = parseFloat(newactivet[1]) || "00";
                                        var newactivetsec = parseFloat(newactivet[2]) || "00";

                                        if (newactivethour > 0) {
                                            item.ActiveTime = newactivethour + ":" + newactivetmin + ":" + newactivetsec;
                                        } else {
                                            item.ActiveTime = newactivetmin + ":" + newactivetsec;
                                        }
                                    }
                                    else {



                                        var actSt = item.WaitTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;






                                        if (actSthour > 0) {
                                            item.isWaitRedSlot = true;
                                        } else {

                                            if (DiffMinutes <= 5) {
                                                item.isWaitNormalSlot = true;
                                            }
                                            else if (DiffMinutes > 5 && DiffMinutes <= 10) {
                                                item.isWaitGreenSlot = true;
                                            }
                                            else if (DiffMinutes > 10 && DiffMinutes <= 15) {
                                                item.isWaitYellowSlot = true;
                                            }
                                            else if (DiffMinutes > 15) {
                                                item.isWaitRedSlot = true;
                                            }

                                            item.WaitTime = actSt[1] + ":" + actSt[2];
                                        }


                                    }


                                }
                                else if (item.UserId !== 0 && item.RoomTypeId !== 0) {

                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                    var apptDt = $filter('date')(new Date(aitem.ConsultationDt), "yyyy-MM-dd");
                                    var dresult = dateCompare(apptDt, currentDt)


                                    if (dresult) {
                                        var actSt = item.ActiveStartTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;

                                        var actEt = item.ActiveEndTime.split(':');
                                        var actEthour = parseFloat(actEt[0]) || 0;
                                        var actEtmin = parseFloat(actEt[1]) || 0;
                                        var actEtsec = parseFloat(actEt[2]) || 0;

                                        if (actEthour == 0 && actEtmin === 0 && actEtsec == 0) {
                                            if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
                                                item.isActiveSlot = true;

                                                var activet = item.WaitTime.split(':');
                                                var activethour = parseFloat(activet[0]) || 0;
                                                var activetmin = parseFloat(activet[1]) || 0;
                                                var activetsec = parseFloat(activet[2]) || 0;

                                                if (activethour > 0) {
                                                    item.isActiveRedSlot = true;

                                                }
                                                else {

                                                    if (activetmin <= 5) {
                                                        item.isActiveNormalSlot = true;
                                                    }
                                                    else if (activetmin > 5 && activetmin <= 10) {
                                                        item.isActiveGreenSlot = true;
                                                    }
                                                    else if (activetmin > 10 && activetmin <= 15) {
                                                        item.isActiveYellowSlot = true;
                                                    }
                                                    else if (activetmin > 15) {
                                                        item.isActiveRedSlot = true;
                                                    }

                                                    item.WaitTime = activet[1] + ":" + activet[2];

                                                }

                                                var DiffMinutes = getcurrentTimeDifferenceMinutes(item.ActiveStartTime);
                                                var ActiveTimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                                item.ActiveTime = ActiveTimec;

                                                var newactivet = item.ActiveTime.split(':');
                                                var newactivethour = parseFloat(newactivet[0]) || 0;
                                                var newactivetmin = parseFloat(newactivet[1]) || "00";
                                                var newactivetsec = parseFloat(newactivet[2]) || "00";

                                                if (newactivethour > 0) {
                                                    item.ActiveTime = newactivethour + ":" + newactivetmin + ":" + newactivetsec;
                                                } else {
                                                    item.ActiveTime = newactivetmin + ":" + newactivetsec;
                                                }
                                            }
                                        }
                                        else {
                                            item.isCompletedSlot = true;

                                            var activet = item.WaitTime.split(':');
                                            var activethour = parseFloat(activet[0]) || 0;
                                            var activetmin = parseFloat(activet[1]) || 0;
                                            var activetsec = parseFloat(activet[2]) || 0;

                                            if (activethour > 0) {
                                                item.isCompletedRedSlot = true;

                                            }
                                            else {

                                                if (activetmin <= 5) {
                                                    item.isCompletedNormalSlot = true;
                                                }
                                                else if (activetmin > 5 && activetmin <= 10) {
                                                    item.isCompletedGreenSlot = true;
                                                }
                                                else if (activetmin > 10 && activetmin <= 15) {
                                                    item.isCompletedYellowSlot = true;
                                                }
                                                else if (activetmin > 15) {
                                                    item.isCompletedRedSlot = true;
                                                }

                                                item.WaitTime = activet[1] + ":" + activet[2];
                                            }

                                            var newactivet = item.ActiveTime.split(':');
                                            var newactivethour = parseFloat(newactivet[0]) || 0;
                                            var newactivetmin = parseFloat(newactivet[1]) || 0;
                                            var newactivetsec = parseFloat(newactivet[2]) || 0;

                                            if (newactivethour > 0) {

                                            } else {
                                                item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                            }

                                        }
                                    }
                                    else {



                                        var actSt = item.WaitTime.split(':');
                                        var actSthour = parseFloat(actSt[0]) || 0;
                                        var actStmin = parseFloat(actSt[1]) || 0;
                                        var actStsec = parseFloat(actSt[2]) || 0;






                                        if (actSthour > 0) {
                                            item.isCompletedSlot = true;
                                        } else {

                                            if (actStmin <= 5) {
                                                item.isCompletedNormalSlot = true;
                                            }
                                            else if (actStmin > 5 && actStmin <= 10) {
                                                item.isCompletedGreenSlot = true;
                                            }
                                            else if (actStmin > 10 && actStmin <= 15) {
                                                item.isCompletedYellowSlot = true;
                                            }
                                            else if (actStmin > 15) {
                                                item.isCompletedRedSlot = true;
                                            }

                                            item.WaitTime = actSt[1] + ":" + actSt[2];
                                        }


                                        var newactivet = item.ActiveTime.split(':');
                                        var newactivethour = parseFloat(newactivet[0]) || 0;


                                        if (newactivethour > 0) {

                                        } else {
                                            item.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                        }
                                    }


                                }

                                var datetime2 = mainitem.AppointmentDate + "T" + item.WaitingStartTime;
                                mainitem.ConvertWaitingStartTime = $filter('date')(datetime2, "hh:mm a");

                            });
                        }

                        if (mainitem.AppointmentCheckInDelayTime != "") {
                            var delay = mainitem.AppointmentCheckInDelayTime.substring(0, 1);
                            if (delay == '-') {
                                mainitem.IsDelayTimeInd = true;
                            } else {
                                mainitem.IsDelayTimeInd = false;
                            }
                        }

                        var datetime1 = mainitem.AppointmentDate + "T" + mainitem.AppointmentStartTime;
                        mainitem.ConvertAppointmentStartTime = $filter('date')(datetime1, "hh:mm a");

                        var datetime3 = mainitem.AppointmentDate + "T" + mainitem.CheckInTime;
                        mainitem.ConvertAppointmentCheckInTime = $filter('date')(datetime3, "hh:mm a");

                    });

                }



            }

        }, function (err) {
            console.log(err);
        });



    };

    $scope.closeTracker = function () {
        $scope.SetupPopUp.dismiss('cancel');

    }

    $scope.RoomType = {
        "IsSelectedCheckout": false
    };
    $scope.submitbutton = "Send";
    $scope.ChangesCheckItem = function (item, checkoutItem) {
        if (checkoutItem === true) {
            $scope.RoomSearchObj.RoomTypeobj = "";
            $scope.submitbutton = "Save";
            $scope.ChangesRoomType(item);
        } else {
            $scope.RoomSearchObj.RoomTypeobj = "";
            $scope.submitbutton = "Send";
        }
    };

    $scope.ChangesRoomType = function (item) {

        $scope.RoomSearchObj.SelectDoctor = "";
        $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "" };
        $scope.Patientlistdata.OptometristId = $scope.Patientlistdata.OptometristId || null;
        $scope.RoomSearchObj.otherDocInd = false;
        $scope.RoomSearchObj.SubSpecialityObj = "";
        $scope.RoomSearchObj.SubSpecialityId = "";
        $scope.RoomSearchObj.NewApptStartTime = "";
        $scope.RoomSearchObj.NewApptEndTime = "";
        $scope.RoomSearchObj.RoomTypeId = item;
        if ($scope.RoomSearchObj.RoomTypeId === 1) {
            if ($scope.Patientlistdata.DoctorID !== null) {
                $scope.RoomSearchObj.SelectDoctor = $scope.Patientlistdata.DoctorFullName;
                $scope.RoomSearchObj.DoctorId = $scope.Patientlistdata.DoctorID;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 2) {
            if ($scope.Patientlistdata.OptometristId !== null) {
                $scope.RoomSearchObj.Opthamobj = _.where($scope.AllOpthaList, { "DoctorID": $scope.Patientlistdata.OptometristId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 8) {
            if ($scope.Patientlistdata.ARassistantId !== null) {
                $scope.RoomSearchObj.ARobj = _.where($scope.AllARList, { "DoctorID": $scope.Patientlistdata.ARassistantId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 4) {
            if ($scope.Patientlistdata.CounsellorId !== null) {
                $scope.RoomSearchObj.Counsellorobj = _.where($scope.AllCounsollerList, { "DoctorID": $scope.Patientlistdata.CounsellorId })[0];
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId != 7) {
            $scope.RoomType.IsSelectedCheckout = false;
            $scope.submitbutton = "Send";
        };

        var params = {
            "HospitalId": $scope.Patientlistdata.HospitalId,
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
    };


    $scope.changeRoomSubSpecialization = function (SubSpecialityObj) {
        $scope.RoomSearchObj.DoctorId = "";



        var listSubSplArray = $filter("filter")($scope.newAllSubSpecializationsArray, function (iterator, ind) { return iterator.SubSpecializationId === SubSpecialityObj.SubSpecializationId; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "SubSpecializationIdArray": subSplArray
        }

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.RoomDoctorsList = [];
                $scope.FilteredRoomDoctorsList = [];

                $scope.RoomDoctorsList = resp.rows;




                angular.forEach($scope.RoomDoctorsList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        //if (Aitem.BranchId === doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                        //        $scope.FilteredRoomDoctorsList.push(Aitem);
                        //    }
                        $scope.FilteredRoomDoctorsList.push(Aitem);
                    }
                });
                $scope.FilteredRoomDoctorsList = _.uniq($scope.FilteredRoomDoctorsList, false, function (p) { return p.DoctorID; });

                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15, "UserFullName": "All Doctors" };
                $scope.FilteredRoomDoctorsList.unshift(docAll);

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.RoomDoctorsList = [];
                $scope.FilteredRoomDoctorsList = [];
            }
        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.changeRoomDoctor = function (docObj) {
        console.log(docObj);
        $scope.RoomSearchObj.DoctorId = docObj.DoctorID;
        $scope.RoomSearchObj.SelectDoctor = docObj.FullName;
        $scope.RoomSearchObj.OptomId = null;
        $scope.RoomSearchObj.CounsellorId = null;
        $scope.RoomSearchObj.DilationAssistantId = null;
        $scope.RoomSearchObj.TechnicianId = null;
        $scope.RoomSearchObj.ARId = null;
        $scope.searchfilterforRoom.txt1 = "";
        $scope.RoomSearchObj.BillingUserId = null;
        $scope.RoomSearchObj.NewApptStartTime = "";




        if (docObj.MinPerCase !== undefined) {
            if ($scope.patinet_consultationTime === 60) {
                $scope.patinet_consultationTime = '1h';
            } else {
                $scope.patinet_consultationTime = docObj.MinPerCase + 'm';
            }
        };

        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        var MinPerCaseval = docObj.MinPerCase;



        $scope.restrictDoctorSlots = false;
        var filterHospitallist = $filter('filter')($scope.BranchesListArray, { 'ClinicId': doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true);
        $scope.selectedBranchobj = filterHospitallist[0];

        console.log($scope.selectedBranchobj.IsRestrictAppointmentSlot);

        if ($scope.selectedBranchobj !== undefined) {
            if ($scope.selectedBranchobj.IsRestrictAppointmentSlot) {
                $scope.restrictDoctorSlots = true;
            }
        }






        if ($scope.restrictDoctorSlots) {
            $scope.getUserBranchslots(docObj);
        } else {
            bindDoctorSlots(MinPerCaseval, 'current');
        }

    };

    $scope.getUserBranchslots = function (SelectedDoctorObj) {
        var SelectedDoctorId = parseInt(SelectedDoctorObj.DoctorID);
        var SelectedUserBranchId = parseInt(SelectedDoctorObj.UserBranchId);
        var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        var params = {
            "DoctorId": SelectedDoctorId,
            "UserBranchId": SelectedUserBranchId,
            "Date": appointmentDate
        }

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
                //   reStructureDoctorSelectedSlots(response);
                newreStructureDoctorSelectedSlots(response);
            }

        }
        function OnGetError(response) {
            var MinPerCaseval = SelectedDoctorObj.MinPerCase || 5;
            bindDoctorSlots(MinPerCaseval, 'current');
        }








    };

    function reStructureDoctorSelectedSlots(resp) {



        if (resp.IsLeave) {
            alertify.error("Doctor is on Leave.Please choose another doctor");
            return false;
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
        angular.forEach(resp.UserConsultation, function (item) {

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
            } else {
                alertify.error("Doctor Slot is not available.Please choose another doctor");
                $scope.setValue = [];
                $scope.patinet_appStarttime = "";

            }


        } else {

            alertify.error("Doctor is not available.Please choose another doctor");
            $scope.setValue = [];
            $scope.patinet_appStarttime = "";
            $scope.EndtimeVAlue = "";
            return;
        }


        console.log($scope.RoomSearchObj.NewApptStartTime);


    }

    function newreStructureDoctorSelectedSlots(resp) {
        //if (resp.IsLeave) {
        //    alertify.error("Doctor is on Leave.Please choose another doctor");
        //    return false;
        //}
        if (resp.UserScheduleSlots.length > 0) {
            var apptTypeId = parseInt($scope.VisitTyepId);
            resp.UserScheduleSlots[0].NewAppointmentMaxSlots = resp.UserScheduleSlots[0].NewAppointmentMaxSlots || 0;
            resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || 0;
            resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots = resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || 0;
            resp.UserScheduleSlots[0].ASCAppointmentMaxSlots = resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || 0;
            if (apptTypeId == 1) {
                if (resp.UserScheduleSlots[0].NewAppointmentMaxSlots != 0) {
                    if (resp.DoctorNewAppointmentCount > resp.UserScheduleSlots[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserScheduleSlots[0].NewAppointmentMaxSlots) {
                        alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                        return false;
                    }
                }
            }
            else if (apptTypeId == 2) {
                if (resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots != 0) {
                    if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].ClinicFollowUpAppointmentMaxSlots) {
                        alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                        return false;
                    }
                }
            }
            else if (apptTypeId == 3) {
                if (resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots != 0) {
                    if (resp.DoctorFollowUpAppointmentCount > resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserScheduleSlots[0].PostOpFollowUpAppointmentMaxSlots) {
                        alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                        return false;
                    }
                }
            }
            else if (apptTypeId == 4 || apptTypeId == 14) {
                if (resp.UserScheduleSlots[0].ASCAppointmentMaxSlots != 0) {
                    if (resp.DoctorAscAppointmentCount > resp.UserScheduleSlots[0].ASCAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserScheduleSlots[0].ASCAppointmentMaxSlots) {
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
        angular.forEach(resp.UserScheduleSlots, function (item) {

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



    function bindDoctorSlots(MinPerCaseval, type) {
        var currenttimewithZero = 0;

        $scope.setValue = [];

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
                $scope.setValue.push({ StartTime: hr + ":00" });
                currenttimewithZero++;
            }
            if (minutesStartCount > parseInt(MinPerCaseval)) {
                minutesStartCount = minutesStartCount - parseInt(MinPerCaseval);
            } else if (minutesStartCount <= parseInt(MinPerCaseval)) {
                minutesStartCount = 0;
                if (currenttimewithZero === 0)
                    $scope.setValue.push({ StartTime: hr + ":00" });
                currenttimewithZero++;
            }
            for (var j = 0; j <= minutesCount; j++) {
                count = count + MinPerCaseval;
                if (count < 60 && count > minutesStartCount) {
                    var minute = count < 10 ? "0" + count : count;
                    $scope.setValue.push({ StartTime: hr + ':' + minute });
                }
            }
        }

        $scope.patinet_appStarttime = $scope.setValue[0];




        if ($scope.setValue[0].StartTime > $scope.BindStartAppTime) {
            $scope.patinet_appStarttime = null;
        } else {
            $scope.FindTime = $filter("filter")($scope.setValue, { "StartTime": $scope.BindStartAppTime }, true);
            if ($scope.FindTime.length > 0) {
                $scope.patinet_appStarttime = $scope.FindTime[0];
            }
        }



        $scope.RoomSearchObj.NewApptStartTime = $scope.patinet_appStarttime.StartTime;
        console.log($scope.RoomSearchObj.NewApptStartTime);
    }

    $scope.ChangesDynamicRoomType = function (item) {
        $scope.RoomSearchObj.RoomTypeId = item.Id;

        var params = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
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

    $scope.SendToRoom = function (item) {
        if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicRoomAllocation) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        if ($scope.RoomSearchObj.RoomTypeId === 0) {
            alertify.error("Select Room Type");
            return false;
        }
        //if ($scope.RoomSearchObj.RoomTypeId !== 7) {
        //    if ($scope.RoomSearchObj.RoomId === 0) {
        //        alertify.error("Select Room Type");
        //        return false;
        //    }
        //}


        if ($scope.RoomSearchObj.RoomTypeId === 7) {
            if (!$scope.UserAccessRights.AllAccessRights.OPCheckOutAccess) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 1) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDoctor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 4) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoCounselor) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 3) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoDilation) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 5) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoTechnician) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
        }


        if ($scope.RoomSearchObj.RoomTypeId === 2) {
            if (!$scope.UserAccessRights.AllAccessRights.PatientDynamicSendtoOptom) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.RoomSearchObj.OptomId === null) {
                alertify.error("Select Optometrist");
                return false;
            }
        }

        if ($scope.RoomSearchObj.RoomTypeId === 8) {

            if ($scope.RoomSearchObj.ARId === null) {
                alertify.error("Select AR");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomTypeId === 9) {

            if ($scope.RoomSearchObj.BillingUserId === null) {
                alertify.error("Select Billing User");
                return false;
            }
        }
        if ($scope.RoomSearchObj.RoomCapacity !== 0) {
            if ($scope.RoomSearchObj.RoomAvailability === $scope.RoomSearchObj.RoomCapacity) {
                alertify.error("Patient limit for this room has been exceeded! Please select other Room");
                return false;
            }
        }

        $scope.Time = $filter("date")(new Date(), "HH:mm");
        var status = "Waiting";



        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": item.PatientID,
            "AppointmentId": item.AppointmentID,
            "RoomId": $scope.RoomSearchObj.RoomId,
            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
            "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
            "PreviousCounterId": item.NextCounterId || null,
            "StartTime": $scope.Time,
            "PatientDynamicStatusId": 0,
            "Status": status,
            // "DoctorId": item.DoctorID,
            "DoctorId": $scope.RoomSearchObj.DoctorId,
            "OptomId": $scope.RoomSearchObj.OptomId,
            "ARId": $scope.RoomSearchObj.ARId,
            "TechnicianId": $scope.RoomSearchObj.TechnicianId,
            "DilationAssistantId": $scope.RoomSearchObj.DilationAssistantId,
            "CounsellorId": $scope.RoomSearchObj.CounsellorId,
            "IsCheckedOut": 2,
            "BillingUserId": $scope.RoomSearchObj.BillingUserId,
            "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime,
            "RoleId": $scope.userLoginDetails.RoleID
        }
        if (params.RoomTypeId === 7) {
            params.RoomId = null;
            params.IsCheckedOut = 3;
            params.Status = 'Completed';
        }
        eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                item.showSendTo = false;
                $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                $scope.SubTab = 11;
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }
    $scope.closeRoom = function (item) {
        item.showSendTo = false;
        $scope.SubTab = 11;
    };

    $scope.viewTracking = function (item) {
        $scope.mInstanceTracking = $uibModal.open({
            "templateUrl": "viewpatienttracking.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg"
        });
        var params = {
            "AppointmentId": item.AppointmentID
        }
        eHnoteMainAppointmentService.GetPatientDynamicStatusById(params).success(function (data) {
            if (data.Status === "Success") {
                $scope.PatientTrackingList = data.rows || [];
            } else {
                $scope.PatientTrackingList = [];
            }


        }).error(function (error) {

        });

    }
    $scope.closeTrackingPopup = function () {
        $scope.mInstanceTracking.dismiss("cancel");
    };
    $scope.patientBarcodeprint = function (item) {
        console.log(item);



        var Patientname = item.PatientDetails.Title + " ." + item.PatientDetails.FullName;
        var PatientGender = item.PatientDetails.Gender;
        var PatientDisplayId = item.PatientDetails.PatientDisplayId;
        var Address = item.PatientDetails.Location || "";
        var ConsultationDt = $filter("date")(new Date(item.ConsultationDt), "dd-MM-yyyy");
        var patientAgePrint = "";
        item.PatientDetails.AgeInYears = item.PatientDetails.AgeInYears || "";
        if (item.PatientDetails.AgeInYears !== "") {
            patientAgePrint = item.PatientDetails.AgeInYears + "Y" + " " + item.PatientDetails.AgeInMonths + "M";
        } else {
            patientAgePrint = item.PatientDetails.AgeInMonths + "M" + " " + item.PatientDetails.AgeInDays + "D";
        }
        var days = 0;
        if (item.PatientDetails.FollowUpValidityDays !== 0) {
            days = item.PatientDetails.FollowUpValidityDays;
        } else {
            days = 30;
        }
        var followup = 0;
        var type = 'D';
        var Today = '';
        if (type === "Y") {
            followup = 365 * days;
        } else if (type === "M") {
            followup = 30 * days;
        } else if (type === "W") {
            followup = 7 * days;
        } else if (type === "D") {
            followup = 1 * days;
        }
        var pastdate = new Date(item.ConsultationDt);
        pastdate.setDate(pastdate.getDate() + followup);

        if (days === 0) {
            Today = null;
        } else {
            //return { "FollowUpDate": moment(pastdate).format("DD-MM-YYYY"), "followup": followup };
            Today = $filter("date")(new Date(pastdate), "dd-MM-yyyy");
        }

        var params = {
            "PatientName": Patientname,
            "MRNo": PatientDisplayId,
            "Age": patientAgePrint,
            "Gender": PatientGender,
            "ConsultationDt": ConsultationDt,
            "Today": Today,
            "Address": Address,
            "BarCode": "",
            "ShowLabelprint": $scope.ShowLabelprint,
            "ShowBarCodeprint": $scope.ShowBarCodeprint,



        }
        eHnoteSettingsDataService.getPatientBarcodeprint(params).then(function (resp) {
            console.log(resp);
            if (resp.data !== undefined) {
                var abc = "data:image/jpeg;base64,";
                params.BarCode = abc + resp.data;
                $scope.BarCode = abc + resp.data;
                $scope.PatientData = params;
                if ($scope.ShowLabelprint === true) {
                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "LablePrint.html",
                        "backdrop": "static",
                        "scope": $scope,
                        "keyboard": false,
                        "size": "md",
                        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                            $scope.closePrintIdcard = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.printToCart = function (printSectionId) {
                                var innerContents = document.getElementById(printSectionId).innerHTML;
                                var popupWinindow = window.open('', '_blank', 'width=500,height=900,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                                popupWinindow.document.open();
                                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                                popupWinindow.document.close();
                                $uibModalInstance.dismiss("cancel");

                            }
                        }
                    });
                }
                if ($scope.ShowBarCodeprint === true) {
                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "BarCodePrint.html",
                        "backdrop": "static",
                        "scope": $scope,
                        "keyboard": false,
                        "size": "md",
                        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                            $scope.closePrintIdcard = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.printToCart = function (printSectionId) {
                                var innerContents = document.getElementById(printSectionId).innerHTML;
                                var popupWinindow = window.open('', '_blank', 'width=800,height=900,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                                popupWinindow.document.open();
                                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()">' + innerContents + '</body></html>');
                                popupWinindow.document.close();
                                $uibModalInstance.dismiss("cancel");

                            }
                        }
                    });
                }

                // eHnotePrintService.GeneratepatientBarcodeprint(params);
            }
        });
    }

    $scope.DigitalCardprint = function (item) {


        var Patientimage = "";
        if (item.S3URL !== "") {
            Patientimage = item.S3URL;
        } else {
            Patientimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNOhpV67XSI4Vz5Z_L7XoWiH7UzZQDBTzS3g&usqp=CAU";
        }
        var Patientname = item.PatientDetails.Title + " ." + item.PatientDetails.FullName;
        var PatientGender = item.PatientDetails.Gender;
        var PatientDisplayId = item.PatientDetails.PatientDisplayId;
        var Address = item.PatientDetails.Location || "";
        var ConsultationDt = $filter("date")(new Date(item.ConsultationDt), "dd-MM-yyyy");
        var patientAgePrint = "";
        item.PatientDetails.AgeInYears = item.PatientDetails.AgeInYears || "";
        if (item.PatientDetails.AgeInYears !== "") {
            patientAgePrint = item.PatientDetails.AgeInYears + "Y" + " " + item.PatientDetails.AgeInMonths + "M";
        } else {
            patientAgePrint = item.PatientDetails.AgeInMonths + "M" + " " + item.PatientDetails.AgeInDays + "D";
        }

        var BranchName = "";
        var BranchPincode = "";
        var BranchMobileNo = "";
        var BranchEmail = "";
        var Address1 = "";
        var Address2 = "";
        var location = "";
        var stateName = "";
        var cityName = "";
        var countryName = "";
        var Address3 = "";
        $scope.SelectedToBranch = $filter("filter")(doctorinfo.doctordata.UserAddress, function (Aitem, index) { return Aitem.ClinicId === item.HospitalId })[0];
        if ($scope.SelectedToBranch !== '') {
            BranchName = $scope.SelectedToBranch.ClinicName;
            Address1 = $scope.SelectedToBranch.Address1;
            Address2 = $scope.SelectedToBranch.Address2;
            BranchPincode = $scope.SelectedToBranch.PinCode;
            BranchMobileNo = $scope.SelectedToBranch.MobileNo;
            BranchEmail = $scope.SelectedToBranch.BranchEmail;
            if ($scope.SelectedToBranch.Location !== undefined) {
                location = $scope.SelectedToBranch.Location + ',' || "";
            }
            if ($scope.SelectedToBranch.CityName !== undefined) {
                cityName = $scope.SelectedToBranch.CityName + ',' || "";
            }
            if ($scope.SelectedToBranch.StateName !== undefined) {
                stateName = $scope.SelectedToBranch.StateName + ',' || "";
            }
            if ($scope.SelectedToBranch !== undefined) {
                countryName = $scope.SelectedToBranch.CountryName + '.' || "";
            }
            Address3 = location + cityName + stateName + countryName;
        }
        var params = {
            "PatientName": Patientname,
            "Patientimage": Patientimage,
            "MRNo": PatientDisplayId,
            "Age": patientAgePrint,
            "Gender": PatientGender,
            "Address": Address,
            "BarCode": "",
            "BranchName": BranchName,
            "BranchPincode": BranchPincode,
            "BranchMobileNo": BranchMobileNo,
            "BranchEmail": BranchEmail,
            "Address1": Address1,
            "Address2": Address2,
            "Address3": Address3,
            "ShowBarCodeprint": $scope.ShowBarCodeprint,



        }
        eHnoteSettingsDataService.getPatientBarcodeprint(params).then(function (resp) {
            console.log(resp);
            if (resp.data !== undefined) {
                var abc = "data:image/jpeg;base64,";
                params.BarCode = abc + resp.data;
                $scope.BarCode = abc + resp.data;
                $scope.PatientData = params;

                // if ($scope.ShowBarCodeprint === true) {
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/PrintIDcard.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    "size": "md",
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                        $scope.closePrintIdcard = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        $scope.DigitalToCart = function (DigitalcardSectionId) {
                            var innerContents = document.getElementById(DigitalcardSectionId).innerHTML;
                            var popupWinindow = window.open('', '_blank', 'width=800,height=900,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                            popupWinindow.document.open();
                            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()">' + innerContents + '</body></html>');
                            popupWinindow.document.close();
                            $uibModalInstance.dismiss("cancel");

                        }

                    }
                });
                // }

                // eHnotePrintService.GeneratepatientBarcodeprint(params);
            }
        });
    }

    $scope.PatientProfile = function (item) {
        console.log(item);
        eHnoteMasterDataService.addPatientDetailsforBarcode(item);
        $location.url("/PatientProfile");
    };

    $scope.SendToInvestigation = function (item) {

        var params = {
            "AppointmentId": item.AppointmentID || 0,
        };
        eHnoteMainAppointmentService.GetLatestDynamicStatusRoomById(params).then(function (resp) {
            if (resp.data.Status === 'Success') {

                if (resp.data.rows.length !== 0) {
                    var DynamicStatusarray = resp.data.rows[0];

                    $scope.SelectedInvestiagtionPatient = DynamicStatusarray;
                    $scope.allUserList = $scope.allUserList;

                    $scope.Time = $filter("date")(new Date(), "HH:mm");
                    var params = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "PatientId": $scope.SelectedInvestiagtionPatient.PatientId,
                        "AppointmentId": $scope.SelectedInvestiagtionPatient.AppointmentId,
                        "RoomId": $scope.SelectedInvestiagtionPatient.RoomId,
                        "RoomTypeId": $scope.SelectedInvestiagtionPatient.RoomTypeId,
                        "NextCounterId": $scope.SelectedInvestiagtionPatient.RoomTypeId,
                        "PreviousCounterId": $scope.SelectedInvestiagtionPatient.NextCounterId || null,
                        "StartTime": $scope.Time,
                        "PatientDynamicStatusId": 0,
                        "Status": "Active",
                        "DoctorId": $scope.SelectedInvestiagtionPatient.AppointmentDoctorID,
                        "OptomId": null,
                        "ARId": null,
                        "TechnicianId": null,
                        "DilationAssistantId": null,
                        "CounsellorId": null,
                        "IsCheckedOut": 2,
                        "RoleId": $scope.userLoginDetails.RoleID

                    }
                    if (params.RoomTypeId === 5) {
                        params.TechnicianId = $scope.SelectedInvestiagtionPatient.AssignedUserId;

                    }
                    if (params.RoomTypeId === 7) {
                        params.RoomId = null;
                        params.IsCheckedOut = 3;
                        params.Status = 'Completed';
                    }
                    eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            eHnoteMasterDataService.addInvestigationPatientId($scope.SelectedInvestiagtionPatient, $scope.allUserList);
                            $location.path("/Investigation");
                        }

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });


                } else {
                    $scope.IsPatientChecked = false;
                    $scope.cacheStorageItem.patientStatus = "";
                }

            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }

    $scope.SendToCounsellor = function (item) {

        var params = {
            "AppointmentId": item.AppointmentID || 0,
        };
        eHnoteMainAppointmentService.GetLatestDynamicStatusRoomById(params).then(function (resp) {
            if (resp.data.Status === 'Success') {

                if (resp.data.rows.length !== 0) {
                    var DynamicStatusarray = resp.data.rows[0];

                    $scope.SelectCouncellorPatient = DynamicStatusarray;
                    $scope.allUserList = $scope.allUserList;

                    $scope.Time = $filter("date")(new Date(), "HH:mm");
                    var params = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "PatientId": $scope.SelectCouncellorPatient.PatientId,
                        "AppointmentId": $scope.SelectCouncellorPatient.AppointmentId,
                        "RoomId": $scope.SelectCouncellorPatient.RoomId,
                        "RoomTypeId": $scope.SelectCouncellorPatient.RoomTypeId,
                        "NextCounterId": $scope.SelectCouncellorPatient.RoomTypeId,
                        "PreviousCounterId": $scope.SelectCouncellorPatient.NextCounterId || null,
                        "StartTime": $scope.Time,
                        "PatientDynamicStatusId": 0,
                        "Status": "Active",
                        "DoctorId": $scope.SelectCouncellorPatient.AppointmentDoctorID,
                        "OptomId": null,
                        "ARId": null,
                        "DilationAssistantId": null,
                        "CounsellorId": null,
                        "IsCheckedOut": 2,
                        "RoleId": $scope.userLoginDetails.RoleID
                    }
                    if (params.RoomTypeId === 4) {
                        params.CounsellorId = $scope.SelectCouncellorPatient.AssignedUserId;

                    }
                    if (params.RoomTypeId === 7) {
                        params.RoomId = null;
                        params.IsCheckedOut = 3;
                        params.Status = 'Completed';
                    }
                    eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            //$scope.SelectedCounsellorPatient = item;
                            eHnoteMasterDataService.addCounsellorPatientId($scope.SelectCouncellorPatient);
                            $location.url("/Counsellor");
                        }

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });

                } else {
                    $scope.IsPatientChecked = false;
                    $scope.cacheStorageItem.patientStatus = "";
                }

            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });

    }


    $scope.checkTimeStatus = function (val) {
        $scope.SortType = val;
        $scope.loadAppointments($scope.selectedDoctor, '');
    }


    $scope.ClickSuperBill = function (item) {
        $scope.SelectedSuperBillPatientDetails = {};
        $scope.SelectedSuperBillPatientDetails = item;
        $scope.SuperBillList = [];
        $scope.SuperBillDiagnosis = [];
        $scope.SuperBillProcedures = [];
        $scope.modeltemIntance = $uibModal.open({
            "templateUrl": "SuperBill.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModalInstance) {

                var params = {
                    "HospitalId": item.HospitalId,
                    "UserId": item.DoctorID,
                    "ApptType": 5
                };
                eHnoteSettingsDataService.GetSuperBillByApptype(params).then(function (resp) {

                    if (resp.data.Status === 'Success') {
                        console.log(resp.data);
                        $scope.SuperBillList = resp.data.rows;
                        if ($scope.SuperBillList.length > 0) {
                            var List = $scope.SuperBillList[0];
                            //  $scope.SuperBillDiagnosis = $scope.SuperBillList[0].SuperBillDiagnosis;

                            $scope.SuperBillDiagnosis = $filter("filter")($scope.SuperBillList[0].SuperBillDiagnosis, { "DeleteInd": 'N' }, true);
                            $scope.SuperBillProcedures = $scope.SuperBillList[0].SuperBillProcedure;
                            function chunk(arr, size) {
                                var newArr = [];
                                for (var i = 0; i < arr.length; i += size) {
                                    newArr.push(arr.slice(i, i + size));
                                }
                                return newArr;
                            }

                            $scope.chunkedData = chunk(List.SuperBillDiagnosis, 3);
                        }



                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Getting Failed");
                });

                $scope.CloseDefaultTemplate = function () {

                    $uibModalInstance.dismiss("cancel");
                    // $scope.GetMasterCategoryDetails();
                };

                $scope.PrintSuperBill = function () {
                    var printObj = {
                        "PatientDetails": $scope.SelectedSuperBillPatientDetails.PatientDetails,
                        "SuperBillDiagnosis": $scope.SuperBillDiagnosis || [],
                        "SuperBillProcedures": $scope.SuperBillProcedures || []
                    }

                    var diagLength = $scope.SuperBillDiagnosis.length;

                    var diagindexlength = diagLength - 1;

                    $scope.printDiagarray1 = [];

                    $scope.getnewPObj = function () {
                        var obj = {
                            "Empty1": "",
                            "Code1": "",
                            "Name1": "",
                            "Empty2": "",
                            "Code2": "",
                            "Name2": "",
                            "Empty3": "",
                            "Code3": "",
                            "Name3": ""
                        };
                        return obj;
                    }

                    $scope.newpObj = $scope.getnewPObj();

                    var pindex = 0;




                    angular.forEach($scope.SuperBillDiagnosis, function (ditem, index) {

                        if (index <= 2) {

                            if (index === 0) {
                                $scope.newpObj = $scope.getnewPObj();
                            }




                            if (index === 0) {
                                $scope.newpObj.Empty1 = "";
                                $scope.newpObj.Code1 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name1 = ditem.ICD10DIAGDESCRIPTION || '';
                            }
                            if (index === 1) {
                                $scope.newpObj.Empty2 = "";
                                $scope.newpObj.Code2 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name2 = ditem.ICD10DIAGDESCRIPTION || '';
                            }
                            if (index === 2) {
                                $scope.newpObj.Empty3 = "";
                                $scope.newpObj.Code3 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name3 = ditem.ICD10DIAGDESCRIPTION || '';
                                $scope.printDiagarray1.push($scope.newpObj);
                            }

                        }

                        if (index <= 5) {
                            if (index === 3) {
                                $scope.newpObj = $scope.getnewPObj();
                            }

                            if (index === 3) {
                                $scope.newpObj.Empty1 = "";
                                $scope.newpObj.Code1 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name1 = ditem.ICD10DIAGDESCRIPTION || '';
                            }
                            if (index === 4) {
                                $scope.newpObj.Empty2 = "";
                                $scope.newpObj.Code2 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name2 = ditem.ICD10DIAGDESCRIPTION || '';
                            }
                            if (index === 5) {
                                $scope.newpObj.Empty3 = "";
                                $scope.newpObj.Code3 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name3 = ditem.ICD10DIAGDESCRIPTION || '';
                                $scope.printDiagarray1.push($scope.newpObj);
                            }
                        }

                        if (index <= 8) {

                            if (index === 6) {
                                $scope.newpObj = $scope.getnewPObj();
                            }
                            if (index === 6) {
                                $scope.newpObj.Empty1 = "";
                                $scope.newpObj.Code1 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name1 = ditem.ICD10DIAGDESCRIPTION || '';
                            }
                            if (index === 7) {
                                $scope.newpObj.Empty2 = "";
                                $scope.newpObj.Code2 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name2 = ditem.ICD10DIAGDESCRIPTION || '';
                            }
                            if (index === 8) {
                                $scope.newpObj.Empty3 = "";
                                $scope.newpObj.Code3 = ditem.ICD10CODE || '';
                                $scope.newpObj.Name3 = ditem.ICD10DIAGDESCRIPTION || '';
                                $scope.printDiagarray1.push($scope.newpObj);
                            }

                        }


                    });

                    printObj.printDiagarray1 = $scope.printDiagarray1;


                    eHnotePrintService.generateSuperBill(printObj, 2);
                }
            }
        });



    }


    $scope.ClickHCFAPrint = function (item) {
        eHnotePrintService.generateHCFAPrint(item);
    };

    $scope.showOtherMoreOptions = function (row) {


        eHnoteMainAppointmentService.getAdditionalApptDetailsById(row.AppointmentID).then(function (resp) {
            resp.data = resp.data || [];

            if (resp.data.length > 0) {

                row.BillingId = resp.data[0].BillingId;
                row.TreatmentPlanId = resp.data[0].TreatmentPlanId;
                row.PatientPreRequisiteId = resp.data[0].PatientPreRequisiteId;
                row.BillingCategoryTypeId = resp.data[0].BillingCategoryTypeId;
                row.ChildAppointmentBookedStatus = resp.data[0].ChildAppointmentBookedStatus || "";
                row.ChildAppointmentDate = resp.data[0].ChildAppointmentDate || "";
                row.InsuranceType = resp.data[0].InsuranceType || "";
                row.PreviouslyDoneSurgery = resp.data[0].PreviouslyDoneSurgery || "";
                row.PreviouslyDoneSurgeryId = resp.data[0].OrganizationSurgeryId || "";
                row.DoctorSpecialization = resp.data[0].DoctorSpecialization || "";
                row.DoctorSpecializationId = resp.data[0].DoctorSpecializationId || "";
                row.PatientDetails = resp.data[0].Patient || "";

                $scope.cacheStorageItem.PatientPreRequisiteId = row.PatientPreRequisiteId;
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                if (row.DoctorID !== resp.data[0].DoctorId && row.AppointmentStatus !== resp.data[0].AppointmentStatus) {
                    row.IsAlreadyConsultationStarted = true;
                }

                $scope.ShowNewConsultation = true;

                $scope.masterQuestions = resp.data[0].masterQuestions;
                $scope.cacheStorageItem.masterQuestions = $scope.masterQuestions;
                $scope.cacheStorageItem.AppointmentBillingId = resp.data[0].BillingId || 0;  // BillingId added to consultation
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }


            angular.forEach($scope.BookedAppointmentList, function (item, index) {
                item.ShowSubcontent = false;
            });
            row.ShowSubcontent = !row.ShowSubcontent;



            var isCurrentDate = $scope.chkFutureDate($scope.referredappointmentdate);
            if (isCurrentDate) {
                if ($scope.DoctorId === row.DoctorID || $scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 59 || $scope.userLoginDetails.RoleID === 61) {

                    if ($scope.OrganizationSettingsData.BillingSettings != undefined) {
                        if ($scope.OrganizationSettingsData.BillingSettings.IsBillingMandatoryForStartConsultation === 1) {
                            if (row.BillingId === 0) {
                                row.startConsultationEntryAccess = false;
                            } else {
                                row.startConsultationEntryAccess = true;
                            }
                        } else {
                            if (row.AppointmentStatus === "B" || row.AppointmentStatus === "O") {
                                row.startConsultationEntryAccess = true;
                            }
                        }
                    } else {
                        if (row.AppointmentStatus === "B" || row.AppointmentStatus === "O") {
                            row.startConsultationEntryAccess = true;
                        }
                    }


                    if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && row.AppointmentStatus === "E") { // added by sabarish
                        row.startConsultationEntryAccess = false;
                    }



                }

            }


            if (row.AppointmentStatus === "E" || row.AppointmentStatus === "D") {//edit consulation access
                if ($scope.DoctorId === row.DoctorID) {
                    row.EditConsultationAccess = true;
                }
            }
            if (($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) && (row.AppointmentStatus === "D" || row.AppointmentStatus === "O")) {
                row.EditConsultationAccess = true;
            }




        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });
    }

    $scope.openSMSHistoryForAppt = function (row) {


        console.log(row);
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PatientAppointmentSMSHistory.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "resolve": {
                "item": function () { return row; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, item) {
                $scope.CloseviewPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                console.log(item);
                $scope.PatientApptObj = {
                    "PatientName": item.PatientName,
                    "AppointmentId": item.AppointmentID,
                    "AppointmentDate": item.ConsultationDt,
                    "AppointmentDoctor": item.DoctorFullName,
                    "AppointmentStartTime": item.StartTime,
                    "AppointmentEndTime": item.EndTime,
                    "SMSHistory": []
                };




                eHnoteMainAppointmentService.GetPaitentAppointmentSMSHistory($scope.PatientApptObj.AppointmentId).then(function (resp) {
                    console.log(resp);

                    if (resp.data.SMSHistory.length > 0) {
                        $scope.PatientApptObj.SMSHistory = resp.data.SMSHistory || [];
                    }



                }, function (err) {
                    console.log(err);
                    alertify.error("Getting data failed");
                });



            }
        });



    };




    // $scope.doctorlist();
    $scope.Booknewappointment = function (item, doctor) {


        var filterpatientdata = $filter("filter")(doctor.SlotsList, function (Aitem, index) { return Aitem.StartTime == item.StartTime; }) || [];
        if (filterpatientdata.length > 0) {
            if (filterpatientdata[0].DoctorId == doctor.DoctorId) {
                return false;
            }
        }

        $scope.PageName = 'book';
        var date = new Date();
        var time = item.StartTime;
        $scope.ispatientExistsval = false;
        $scope.calenderDate = moment(date).format('DD-MMM-YYYY' + ' ' + time);


        var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };

        var doctorID = {
            "DoctorID": doctor.DoctorId
        };

        if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57 || doctorInfo.RoleID === 18) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorInfo.RoleID === 1 || doctorInfo.RoleID === 56) {
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        }

        datapersistanceFactory.set('appointmentinfo', "");
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentStatus = "B";
        appointmentInfo.BillingId = 0;
        appointmentInfo.showAllHospitalsinAppList = false;
        appointmentInfo.showTeleBookingAccess = false;
        appointmentInfo.showNormalBookingAccess = true;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

        $scope.AppDate = "";
        openAppPopup();
    }


    $scope.showPatientPopupClick = function (item) {
        $scope.selectpatient = item || '';
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "Patienttemplatepopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
        });
    };

    $scope.showdetails = function (type, mainitem, subitem) {
        console.log(type);
    }
    $scope.Closetemplate = function () {
        $scope.mInstanceAdd.dismiss("cancel");
    };

    //Again checkin
    $scope.ClicktoAgainCheckIn = function (rows) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Patient has checked out. Do you wish to check-in again?</h4>", function () {
            $scope.checkInObj.CheckInStatus = 2;
            $scope.checkInObj.VisitReason = "";
            $scope.checkInObj.AttenderName = "";
            $scope.checkInObj.HospitalID = rows.BranchId;
            $scope.checkInObj.AppointmentId = rows.AppointmentID;
            eHnoteUserAppointmentDataService.UpdateCheckInStatus($scope.checkInObj, onsuccess, onerror);
            function onsuccess(resp) {

                if (resp.Status === "Success") {

                    if ($scope.checkInObj.CheckInStatus === 2) {
                        alertify.success("Patient Check In Successfully");
                    }
                    Index = $scope.BookedAppointmentList.findIndex(record => record.AppointmentID === $scope.checkInObj.AppointmentId);

                    if (Index > -1) {

                        $scope.BookedAppointmentList[Index].PatientDetails.PatientDisplayId = resp.PatientDisplayId;
                        $scope.BookedAppointmentList[Index].CheckinStatusId = $scope.checkInObj.CheckInStatus;
                        $scope.BookedAppointmentList[Index].showcheckinPopup = false;

                        if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 4 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 56 || $scope.userLoginDetails.RoleID === 57) {
                            if ($scope.BookedAppointmentList[Index].AppointmentStatus === "B" || $scope.BookedAppointmentList[Index].AppointmentStatus === "O") {
                                if ($scope.DoctorId === $scope.BookedAppointmentList[Index].DoctorID) {
                                    $scope.BookedAppointmentList[Index].startConsultationEntryAccess = true;
                                }
                            }
                        } else if ($scope.userLoginDetails.RoleID === 10 || $scope.userLoginDetails.RoleID === 61) {
                            if ($scope.BookedAppointmentList[Index].AppointmentStatus === "B" || $scope.BookedAppointmentList[Index].AppointmentStatus === "O") {
                                $scope.BookedAppointmentList[Index].startConsultationEntryAccess = true;
                            }
                        }
                        $scope.closeCheckInPopup();
                    }
                    $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                } else {
                    alertify.error(resp.Message);
                }
            }
            function onerror(error) {
                console.log(error);
            }
        }, function () { });
    }


    //New SIngle doctor view


    $scope.cancelAppPopup = false;
    var onchageselectappoint = 0;
    var avgConsultationTime = 15;
    var jsonUnavailableTime = [];
    $scope.subMaindoc = {
        "DoctorsList": []
    }

    var qtipDown = false;
    $scope.SelectSlotDuration = '00:20';
    var TimetoScroll = '';
    TimetoScroll = "15:00:00";


    function onclick() {


        console.log($scope.DoctorSlot.StartTime);
        console.log($scope.DoctorSlot.EndTime);
        $scope.selectedLoginDoctor = $scope.selectedLoginDoctor || "";
        if ($scope.selectedLoginDoctor != "") {
            if ($scope.selectedLoginDoctor.SlotStartTime == undefined) {
                $scope.selectedLoginDoctor.SlotStartTime = "00:00";
            } else {
                if ($scope.selectedLoginDoctor.SlotStartTime == "00:00") {
                    $scope.selectedLoginDoctor.SlotStartTime = "00:00";
                } else {
                    $scope.selectedLoginDoctor.SlotStartTime = $scope.selectedLoginDoctor.SlotStartTime;
                }
            }
            if ($scope.selectedLoginDoctor.SlotEndTime == undefined) {
                $scope.selectedLoginDoctor.SlotEndTime = "00:00";
            } else {
                if ($scope.selectedLoginDoctor.SlotEndTime == "00:00") {
                    $scope.selectedLoginDoctor.SlotEndTime = "00:00";
                } else {
                    $scope.selectedLoginDoctor.SlotEndTime = $scope.selectedLoginDoctor.SlotEndTime;
                }
            }
        }



        $scope.uiConfig = {
            "singlecalendar": {
                "editable": true,
                "navLinks": true,
                "selectable": true,
                "initialView": 'resourceTimeGridDay',
                "header": {
                    "left": '',
                    "center": '',
                    "right": ''
                },
                "views": {
                    "day": {
                        "columnFormat": 'dddd MMM Do YYYY'
                    },
                    "week": {
                        "columnFormat": 'ddd MMM Do\'YY'
                    },
                    "month": {
                        "columnFormat": 'ddd'
                    }
                },
                "allDaySlot": true,
                "minTime": '06:00:00',
                "defaultTimedEventDuration": '00:05:00',
                "displayEventTime": false,
                "timezone": "local",
                "duration": '00:05:00',
                "slotDuration": $scope.SelectSlotDuration,
                "slotLabelInterval": '00:30:00',
                "slotLabelFormat": 'hh:mm a',
                "defaultView": 'agendaDay',
                "eventDrop": $scope.alertOnDrop,
                "eventResize": $scope.alertOnResize,
                "eventRender": $scope.eventRender,
                "select": $scope.alertOnSelect,
                // "eventSelect": $scope.alertOnSelect,
                "navLinkDayClick": function (date, jsEvent) {
                    $scope.referredappointmentdate = $filter('date')(new Date(date), "dd-MMMM-yyyy");
                    $scope.viewDate = new Date(date);
                    $scope.loadCalenderEvent('day');
                },
                // "dayClick": $scope.alertOnDayClick,
                "eventMouseover": $scope.eventMouseover,
                "eventMouseout": $scope.eventMouseout,
                "eventLimit": true,
                "nowIndicator": true,
                "scrollTime": TimetoScroll,
                "eventDragStart": function (event, jsEvent, ui, view) {
                    event.className += ' eventDrag';
                },
                "eventDragStop": function (event, jsEvent, ui, view) {
                    event.className = "";
                },
                "eventClick": $scope.eventmainclick,
                //"businessHours": {
                //    startTime: $scope.UserAvailableSlots[0].StartTime,
                //    endTime: $scope.UserAvailableSlots[0].EndTime,
                //}
            }
        };

    };

    $scope.filterLoadDayView = function (dateValue, docObject) {
        $scope.loadDayView(dateValue, docObject);
        $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);
    };


    $scope.loadDayView = function (dateValue, docObject) {
        $scope.appointmentCountDisplay = 0;
        var DoctorID = 0;
        var hospitalID = 0;
        var formatteddateValue = moment(dateValue).format('YYYY-MM-DD');
        if (uiCalendarConfig.calendars["Singlecalendar"])
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('gotoDate', moment(dateValue));
        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        if ($scope.selectedDocCSSid === 0) {
            DoctorID = eHnoteMasterDataService.getLoginId();
        } else {
            DoctorID = $scope.selectedDocCSSid;
        }
        if (docObject !== undefined) {
            DoctorID = docObject.DoctorID;
            $scope.selectedDocCSSid = DoctorID;
            onchageselectappoint = docObject.UserBranchId;
            var avgConsultationTime = docObject.MinPerCase;
            $scope.sliceTime = docObject.MinPerCase;
            angular.element('#Singlecalendar').fullCalendar('option', {
                defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
                slotDuration: '00:' + avgConsultationTime + ':00',

            });
        }
        if ($scope.selectedDoctor.UserBranchId === 0) {
            DoctorID = 0;
        }
        if (dateValue === "") {
            var datefinalValue = $scope.getCurrentDate();
        } else {
            var datefinalValue = formatteddateValue;
        }
        var daycode = $filter('date')(new Date(datefinalValue), "EEE").toUpperCase();
        eHnoteMasterDataService.addSelectedAppointDt(datefinalValue);

        if ($scope.AppListselectedclinic.ClinicId === 0) {
            hospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.GetAllIndicator = 1;
        } else {
            hospitalID = $scope.AppListselectedclinic.ClinicId;
            $scope.GetAllIndicator = 0;
        }
        if (onchageselectappoint !== 0) {
            var data_param = {
                'DoctorID': DoctorID,
                'UserId': eHnoteMasterDataService.getLoginId(),
                'usrType': "DOCTOR",
                'startDate': datefinalValue,
                'endDate': datefinalValue,
                'UserBranchId': onchageselectappoint,
                'HospitalID': hospitalID,
                "GetAllIndicator": $scope.GetAllIndicator,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": "",
                //"IsConfirmedAppointment": $scope.CalenderObj.IsConfirmedAppointment || false
            };
        } else {
            var data_param = {
                'UserId': eHnoteMasterDataService.getLoginId(),
                'usrType': "DOCTOR",
                'startDate': datefinalValue,
                'endDate': datefinalValue,
                'HospitalID': hospitalID,
                "GetAllIndicator": $scope.GetAllIndicator,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": "",
                //"IsConfirmedAppointment": $scope.CalenderObj.IsConfirmedAppointment || false
            };
        }
        if ($scope.userLoginDetails.RoleID === 10) {
            data_param.OptometristId = $scope.SelectedOptometristId;
        }

        if ($scope.userLoginDetails.RoleID === 61) {
            data_param.ARassistantId = $scope.SelectedArId;
        }

        // multi checkbox status and profile status list
        let statuslist = "";
        for (let i in $scope.confirmationStatusArray1) {
            if ($scope.confirmationStatusArray1[i].IsChecked) {
                statuslist += "," + $scope.confirmationStatusArray1[i].ConfirmationStatusId;
            }
        }
        if (statuslist.charAt(0) === ",") {
            statuslist = statuslist.slice(1);
        }

        let profilestatuslist = "";
        for (let i in $scope.ProfileStatusList1) {
            if ($scope.ProfileStatusList1[i].IsChecked) {
                profilestatuslist += "," + $scope.ProfileStatusList1[i].Id;
            }
        }
        if (profilestatuslist.charAt(0) === ",") {
            profilestatuslist = profilestatuslist.slice(1);
        }

        data_param.StatusIds = angular.copy(statuslist);
        data_param.ProfileStatusIds = angular.copy(profilestatuslist);
        data_param.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;

        $scope.getDcotorAppointmentDtlsDt = datefinalValue;
        $scope.patDetails.length = 0;

        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            data_param.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            data_param.VisitReasonIdList = visitRsnList || "";
        }

        eHnoteMainAppointmentService.getDoctorNewAppointmentInfo(OnGetAppointmentSuccess, OnGetAppointmentError, data_param);
    };
    var loadEvents = function (booked, data) {
        for (var j = 0; j < booked.calendarList.length; j++) {
            if (booked.calendarList[j].slotList !== undefined) {
                for (var k = 0; k < booked.calendarList[j].slotList.length; k++) {
                    var sTime = booked.calendarList[j].slotList[k];
                    if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                        sTime.patientInfo = {};
                    }
                    if (sTime.patientInfo !== undefined) {
                        sTime.patientInfo.appointmentID = sTime.appointmentID;
                        sTime.patientInfo.appointmentStatus = sTime.appointmentStatus;
                        var userbranch = sTime.UserBranchId !== undefined ? sTime.UserBranchId : 0;
                        var OpId = sTime.OptometristId;
                        var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        if (sTime.startDate === undefined) {
                            var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        } else {
                            var datefinalValue = $filter('date')(sTime.startDate, "yyyy-MM-dd");
                        } if (sTime.endDate === undefined) {
                            var dateendval = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                        } else {
                            var dateendval = $filter('date')(sTime.endDate, "yyyy-MM-dd");
                        }
                        var dayViewStart = moment(sTime.startTime, 'HH:mm:ss');
                        var dayViewEnd = moment(sTime.endTime, 'HH:mm:ss');
                        if (sTime.endTime === "23:59" && sTime.allDayEvents !== undefined && datefinalValue !== dateendval) {
                            dateendval = moment(sTime.endDate).add('days', 1).format('YYYY-MM-DD');
                        }
                        var appBgColor = "",
                            appFontColor = "";
                        var dayCounter = moment(datefinalValue)
                            .clone()
                            .hours(dayViewStart.hours())
                            .minutes(dayViewStart.minutes())
                            .seconds(dayViewStart.seconds());
                        if (sTime.endTime === "24:00") {
                            datefinalValue = $filter('date')(data.calendarList[j].consultationDt + 86400000, "yyyy-MM-dd");
                        }
                        var dayend = moment(dateendval)
                            .clone()
                            .hours(dayViewEnd.hours())
                            .minutes(dayViewEnd.minutes())
                            .seconds(dayViewEnd.seconds());
                        if (sTime.appointmentStatus === "B") {
                            var appStatus = "Booked";
                            appBgColor = "#757ef8";
                            appFontColor = "#FFF";
                        } else if (sTime.appointmentStatus === "O") {
                            var appStatus = "OnGoing";
                            appBgColor = "#77cb52";
                            appFontColor = "#FFF";
                        }
                        else if (sTime.appointmentStatus === "D") {
                            var appStatus = "Saved";
                            appBgColor = "#aa0abb";
                            appFontColor = "#FFF";
                        }
                        else if (sTime.appointmentStatus === "C") {
                            var appStatus = "Cancelled";
                            appFontColor = "#FFF";
                            appBgColor = "#70d7cc";
                        } else if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                            var appStatus = "Events";
                            appBgColor = "#8d67b1";
                            appFontColor = "#FFF";
                        } else {
                            var appStatus = "Completed";
                            appBgColor = "#ff9024";
                            appFontColor = "#FFF";
                        }
                        sTime.VisitReasonColorCode = sTime.VisitReasonColorCode || "";
                        if (sTime.VisitReasonColorCode != '') {
                            appBgColor = sTime.VisitReasonColorCode;
                        }
                        var doctorSpecialities = "";
                        for (var i in sTime.doctorInfo.specialityCd) {
                            doctorSpecialities += "," + getSpecialityDesc(sTime.doctorInfo.specialityCd[i]);
                        }
                        if (doctorSpecialities.charAt(0) === ",") {
                            doctorSpecialities = doctorSpecialities.slice(1);
                        }
                        var title = null, eventInfo = null;
                        if (sTime.appointmentStatus === "EVENT" || sTime.appointmentStatus === "IMPEVENT") {
                            sTime.patientInfo.title = "Dr";
                            sTime.patientInfo.doctorID = sTime.doctorID;
                            sTime.patientInfo.fullName = sTime.doctorInfo.doctorName;
                            sTime.patientInfo.doctorSpecialities = "";
                            title = sTime.otherVisitRsn || "Events";
                            eventInfo = ((sTime.patientInfo.title === undefined) ? "" : sTime.patientInfo.title + '.') + sTime.patientInfo.fullName + " | Token : 0 | - | /Male | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                        } else {
                            // title = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName;
                            title = sTime.patientInfo.fullName;
                            eventInfo = ((sTime.patientInfo.title === undefined || sTime.patientInfo.title === "") ? "" : sTime.patientInfo.title + '. ') + sTime.patientInfo.fullName + " | Token : " + (sTime.tokenNumber === '0' ? "Walk-In" : sTime.tokenNumber) + " | " + ((sTime.patientInfo.mobileNumber === undefined || sTime.patientInfo.mobileNumber.toString().length < 6) ? "-" : sTime.patientInfo.mobileNumber) + " | " + ((sTime.patientInfo.currentAge === undefined) ? ((sTime.patientInfo.age === undefined) ? '' : (sTime.patientInfo.age + "y")) : (((sTime.patientInfo.currentAge.year > 0) ? sTime.patientInfo.currentAge.year + "y" : '') + ' ' + ((sTime.patientInfo.currentAge.month > 0) ? sTime.patientInfo.currentAge.month + "m" : ''))) + "/" + ((sTime.patientInfo.Sex === 'M') ? 'Male' : 'Female') + " | " + sTime.startTime + " - " + sTime.endTime + " | " + appStatus;
                        }
                        var newEvent = {
                            "title": title,
                            "eventInfo": eventInfo,
                            "UserBranchId": userbranch,
                            "OptometristId": OpId,
                            "start": dayCounter.clone(),
                            "startDate": dayCounter.clone(),
                            "startTime": dayCounter.clone(),
                            "endDate": dayend.clone(),
                            "endTime": dayend.clone(),
                            "end": dayend.clone(),
                            "color": appBgColor,
                            "textColor": appFontColor,
                            "allDay": sTime.allDayEvents !== undefined,
                            "token": sTime.tokenNumber === "0" ? "Walk-In" : sTime.tokenNumber,
                            "eventTitle": sTime.otherVisitRsn || "Events",
                            "eventDesc": sTime.eventDescription || "",
                            "eventVenue": sTime.eventLocation || "",
                            "sliceTime": avgConsultationTime,
                            "showDoctors": true,
                            "PatientName": sTime.patientInfo.fullName,
                            "PatientMrNo": sTime.patientInfo.PatientDisplayId,
                            "PatientOldMrNo": sTime.patientInfo.OldMrNo,
                            "rowData": {
                                "addressId": booked.calendarList[j].slotList[k].addressID,
                                "doctorId": booked.calendarList[j].slotList[k].doctorID,
                                "hospitalId": booked.calendarList[j].slotList[k].hospitalID,
                                "doctorName": sTime.doctorInfo.doctorName,
                                "doctorEmail": sTime.doctorInfo.CommunicationEmailId, //sTime.doctorInfo.EmailId,
                                "docMobile": sTime.doctorInfo.MobileNo,
                                "docCountrycode": sTime.doctorInfo.CountryCode,
                                "doctorSpecialities": doctorSpecialities,
                                "doctorImage": sTime.doctorInfo.doctorImage,
                                "consultationDate": booked.calendarList[j].consultationDt,
                                "DayCD": booked.calendarList[j].slotList[k].dayCD,
                                "PatientInfo": sTime.patientInfo,
                                "visitReason": sTime.VisitReason || "",
                                "VisitTypeId": sTime.VisitTypeId || 0,
                                "doctorVisitRsnId": sTime.DoctorVisitRsnID,
                                "IscheckedIn": sTime.IscheckedIn,
                                "VisitTypeId": sTime.VisitTypeId || 0
                            },
                            "AppointmentDetails": booked.calendarList[j].slotList[k]
                        };
                        $scope.eventsList.push(newEvent);
                    }
                }
            }
            if (booked.UserAvailableSlots.length > 0) {
                var consultationDate = $filter('date')(new Date(booked.calendarList[j].consultationDt), "yyyy-MM-dd");
                var UserAvailableSlots = $filter('filter')(booked.UserAvailableSlots, { "SlotDate": consultationDate }, true);
                angular.forEach(UserAvailableSlots, function (item) {
                    if (item.UserDayBreakSlots.length > 0) {
                        for (let l = 0; l < item.UserDayBreakSlots.length; l++) {
                            var datefinalValue = $filter('date')(data.calendarList[j].consultationDt, "yyyy-MM-dd");
                            var appBgColor = "#b0b3b5",
                                appFontColor = "#000";
                            let startTime = consultationDate + ' ' + item.UserDayBreakSlots[l].StartTime;
                            let endTime = consultationDate + ' ' + item.UserDayBreakSlots[l].EndTime;

                            let object = {
                                "id": l + 1,
                                "title": "Blocked",
                                "resourceId": item.DoctorId,
                                "end": endTime,
                                "start": startTime,
                                "eventInfo": "",
                                "color": appBgColor,
                                "textColor": appFontColor,
                                "allDay": false,
                                "display": "background",
                                "SlotInfo": {
                                    "UserBranchId": item.UserBranchId,
                                    "DoctorId": item.DoctorId,
                                    "StartTime": startTime,
                                    "EndTime": endTime,
                                    "ConsultationDate": item.SlotDate,
                                    "UserScheduleId": item.UserDayBreakSlots[l].UserScheduleId,
                                    "UserDayBreakSlotId": item.UserDayBreakSlots[l].UserDayBreakSlotId,
                                    "OrganizationId": item.OrganizationId,
                                    "BlockedRemarks": item.UserDayBreakSlots[l].BlockedRemarks || "",
                                    "UnBlockedRemarks": item.UserDayBreakSlots[l].UnBlockedRemarks || "",
                                    "ReasonforBlockSlot": item.UserDayBreakSlots[l].ReasonforBlockSlot || ""
                                },
                                "IsBreakEvent": true
                            };

                            $scope.eventsList.push(object);
                        }
                    }
                });
            }
        }
    };

    $scope.CalenderDoctorAvailableSlots = "";
    function OnGetAppointmentSuccess(data) {
        $scope.eventsList = [];
        $scope.appCount = data.appointmentCounts;
        $scope.UserAvailableSlots = data.UserAvailableSlots;
        if (data.UserAvailableSlots.length > 0) {
            $scope.UserScheduleId = data.UserAvailableSlots[0].UserScheduleId;
            $scope.UserScheduleDetailId = data.UserAvailableSlots[0].UserScheduleDetailId;
        }
        var booked = data;
        $scope.patDetails.length = 0;
        var jsonAvailConsultTime = [];
        jsonUnavailableTime.length = 0;
        $scope.minPerCase = 0;

        if (booked.calendarList[0].slotList !== undefined) {
            if (booked.calendarList.length > 0 && booked.calendarList[0].slotList.length > 0) {
                $scope.eventsList = [];
                loadEvents(booked, data);
                eHnoteMasterDataService.addDocAvailConsultTimeInfo(jsonAvailConsultTime);
            } else {
                if (JSON.stringify($scope.showDayID) === "true" && JSON.stringify($scope.appointmentlistID) === "false") {
                    $scope.dayConfig.visible = false;
                    $scope.noData = "Time slot is not available for the selected day...";
                }
                eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
                $scope.setValue = [];
                $scope.eventsList = [];
                $scope.beginBHr = [];
                $scope.beginEHr = [];
            }
        } else {
            $scope.eventsList = [];
            loadEvents(booked, data);
        }
        uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('removeEvents');
        uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('addEventSource', $scope.eventsList);
        uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('rerenderEvents');
        angular.element('#Singlecalendar').fullCalendar('option', {
            defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
            slotDuration: '00:' + avgConsultationTime + ':00'
        });
        setTimeout(function () {
            angular.element('.fc-scroller').scrollTop(0);
            if ($('.fc-now-indicator-line').offset()) {
                angular.element('.fc-scroller').scrollTop($('.fc-now-indicator-line').offset().top - 300);
            }
        }, 1000);
        eHnoteMasterDataService.addavgConsultationTimeInfo($scope.minPerCase);
        if (getAppNewFormattedDate(new Date($scope.formatteddateValue)) === getAppNewFormattedDate(new Date())) {
            var dt = new Date();
            dt.getHours() >= 12 ? (function () {
                hr = dt.getHours() % 12 === 0 ? 12 : dt.getHours() % 12;
                ampm = "PM";
            })() : (function () {
                hr = dt.getHours();
                ampm = "AM";
            })();
            var min = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
            var time = hr + ":" + min + "" + ampm;
            setTimeout(function () {
                var match = "";
                $('.cal-day-hour-part .span1').each(function (i, e) {
                    var ele = $(e).text();
                    if ($(e).text() === time) {
                        match = e;
                        return false;
                    } else {
                        var curr = getApptimeSplit(time);
                        var pre = getApptimeSplit(ele);
                        if (curr['hr'] === pre['hr'] && curr['ampm'] === pre['ampm']) {
                            if (curr['min'] < pre['min']) {
                                match = $('.cal-day-hour-part .span1')[i];
                                return false;
                            }
                        }
                    }
                });
                var scrollVal = $('.cal-day-hour-part').index($(match).parent()) * 30;
                $('.cal-day-panel').scrollTop(scrollVal);
            }, 1000);
        }
        $scope.showCalendar = true;

        $scope.CalenderDoctorAvailableSlots = "";
        //data.AvailableSlots = data.AvailableSlots || [];     
        //if (data.AvailableSlots.length > 0) {
        //    $scope.CalenderDoctorAvailableSlots = angular.copy(data.AvailableSlots[0]);
        //}
        data.UserAvailableSlots = data.UserAvailableSlots || [];
        if (data.UserAvailableSlots.length > 0) {
            $scope.CalenderDoctorAvailableSlots = angular.copy(data.UserAvailableSlots[0]);
        }
    }
    function OnGetAppointmentError(data) {
        eHnoteMasterDataService.addDocAvailConsultTimeInfo("");
        $scope.eventsList = [];
        $scope.setValue = [];
        $scope.beginBHr = [];
        $scope.beginEHr = [];
        $scope.showCalendar = false;
        alertify.error("Error in listing Appointments,  Please check internet connectivity");
    }


    function setCalenderViewVisibility(val) {

    }
    function loadWeekView() {
        var DoctorID = 0;
        if ($scope.selectedDocCSSid === 0) {
            DoctorID = eHnoteMasterDataService.getLoginId();
        } else {
            DoctorID = $scope.selectedDocCSSid;
        }
        if ($scope.selectedDoctor.UserBranchId === 0) {
            DoctorID = 0;
        }
        var curdate = $scope.viewDate;
        uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('gotoDate', moment(curdate));
        var tmpToday = $filter('date')(curdate, "EEE").toUpperCase();
        var weekBeginDate;
        var weekEndDate;
        if (tmpToday.toUpperCase() === 'SUN') {
            weekBeginDate = moment(curdate).format('YYYY-MM-DD');
            weekEndDate = moment(curdate).isoWeekday(1).startOf('isoweek').add(12, 'd').format('YYYY-MM-DD');
        } else {
            weekBeginDate = moment(curdate).isoWeekday(1).startOf('isoweek').add(-1, 'd').format('YYYY-MM-DD');
            weekEndDate = moment(curdate).isoWeekday(1).startOf('isoweek').add(5, 'd').format('YYYY-MM-DD');
        }
        $scope.eventsList = [];
        if ($scope.AppListselectedclinic !== undefined && $scope.AppListselectedclinic !== null && $scope.AppListselectedclinic !== '') {
            var HospitalID = $scope.AppListselectedclinic.ClinicId;
        } else {
            HospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.GetAllIndicator = 1;
        }
        if (onchageselectappoint !== 0) {
            var params = {
                "DoctorID": DoctorID,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "usrType": "DOCTOR",
                "startDate": weekBeginDate,
                "endDate": weekEndDate,
                "UserBranchId": onchageselectappoint,
                "HospitalID": HospitalID,
                "GetAllIndicator": $scope.GetAllIndicator,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": ""
            };
        } else {
            var params = {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "usrType": "DOCTOR",
                "startDate": weekBeginDate,
                "endDate": weekEndDate,
                "HospitalID": HospitalID,
                "GetAllIndicator": $scope.GetAllIndicator,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": ""
            };
        }
        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            params.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            params.VisitReasonIdList = visitRsnList || "";
        }

        // multi checkbox status and profile status list
        let statuslist = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                statuslist += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (statuslist.charAt(0) === ",") {
            statuslist = statuslist.slice(1);
        }

        let profilestatuslist = "";
        for (let i in $scope.ProfileStatusList) {
            if ($scope.ProfileStatusList[i].IsChecked) {
                profilestatuslist += "," + $scope.ProfileStatusList[i].Id;
            }
        }
        if (profilestatuslist.charAt(0) === ",") {
            profilestatuslist = profilestatuslist.slice(1);
        }

        params.StatusIds = angular.copy(statuslist);
        params.ProfileStatusIds = angular.copy(profilestatuslist);
        params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;

        eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onweekSuccess, onweekError);
        function onweekSuccess(data) {
            var booked = data;
            $scope.patDetails.length = 0;
            //$scope.UserScheduleId = data.UserAvailableSlots[0].UserScheduleId;
            //$scope.UserScheduleDetailId = data.UserAvailableSlots[0].UserScheduleDetailId;
            var jsonAvailConsultTime = [];
            jsonUnavailableTime.length = 0;
            $scope.minPerCase = 15;
            $scope.eventsList = [];
            $scope.appCount = data.appointmentCounts;
            if (JSON.stringify(data) !== '{}' && data.calendarList !== undefined) {
                loadEvents(booked, data);
            }
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('removeEvents');
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('addEventSource', $scope.eventsList);
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('rerenderEvents');
            angular.element('#Singlecalendar').fullCalendar('option', {
                defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
                slotDuration: '00:' + avgConsultationTime + ':00'
            });
            setTimeout(function () {
                angular.element('.fc-scroller').scrollTop(0);
                if ($('.fc-now-indicator-line').offset()) {
                    angular.element('.fc-scroller').scrollTop($('.fc-now-indicator-line').offset().top - 300);
                }
            }, 1000);
        }
        function onweekError(data) {
            setCalenderViewVisibility(false);
        }
    }

    function loadMonthView() {
        var DoctorID = 0;
        if ($scope.selectedDocCSSid === 0) {
            DoctorID = eHnoteMasterDataService.getLoginId();
        } else {
            DoctorID = $scope.selectedDocCSSid;
        }
        if ($scope.selectedDoctor.UserBranchId === 0) {
            DoctorID = 0;
        }
        var curdate = $scope.viewDate;
        uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('gotoDate', moment(curdate));

        var monthBeginDate = moment(curdate).startOf('month').format('YYYY-MM-DD');
        var monthEndDate = moment(curdate).endOf('month').format('YYYY-MM-DD');
        $scope.eventsList = [];
        if ($scope.AppListselectedclinic !== undefined && $scope.AppListselectedclinic !== '') {
            var HospitalID = $scope.AppListselectedclinic.ClinicId;
        } else {
            HospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.GetAllIndicator = 1;
        }
        if (onchageselectappoint !== 0) {
            var params = {
                'DoctorID': DoctorID,
                'UserId': eHnoteMasterDataService.getLoginId(),
                'usrType': "DOCTOR",
                'startDate': monthBeginDate,
                'endDate': monthEndDate,
                'UserBranchId': onchageselectappoint,
                'HospitalID': HospitalID,
                "GetAllIndicator": $scope.GetAllIndicator,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": ""
            };
        } else {
            var params = {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "usrType": "DOCTOR",
                "startDate": monthBeginDate,
                "endDate": monthEndDate,
                "HospitalID": HospitalID,
                "AppointmentTypeStatusIDList": "",
                "VisitReasonIdList": ""
            };
        }
        if ($scope.appointmentTypes != undefined) {
            var listApptTypeArray = $filter("filter")($scope.appointmentTypes, function (iterator, ind) { return iterator.isChecked === true; });
            var apptList = _.pluck(listApptTypeArray, "Id").join(",");
            params.AppointmentTypeStatusIDList = apptList || "";
        }

        if ($scope.Visitreasons != undefined) {
            var listVisitRsnArray = $filter("filter")($scope.Visitreasons, function (iterator, ind) { return iterator.isChecked === true; });
            var visitRsnList = _.pluck(listVisitRsnArray, "ReasonId").join(",");
            params.VisitReasonIdList = visitRsnList || "";
        }

        // multi checkbox status and profile status list
        let statuslist = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                statuslist += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (statuslist.charAt(0) === ",") {
            statuslist = statuslist.slice(1);
        }

        let profilestatuslist = "";
        for (let i in $scope.ProfileStatusList) {
            if ($scope.ProfileStatusList[i].IsChecked) {
                profilestatuslist += "," + $scope.ProfileStatusList[i].Id;
            }
        }
        if (profilestatuslist.charAt(0) === ",") {
            profilestatuslist = profilestatuslist.slice(1);
        }

        params.StatusIds = angular.copy(statuslist);
        params.ProfileStatusIds = angular.copy(profilestatuslist);
        params.IsNoShowAppointment = $scope.ApptFilterObj.IsNoShowAppointment1 || false;

        eHnoteUserAppointmentDataService.getWeekwiseMonthwiseAppointments(params, onmonthkSuccess, onmonthError);
        function onmonthkSuccess(data) {
            var booked = data;
            $scope.patDetails.length = 0;
            var jsonAvailConsultTime = [];
            jsonUnavailableTime.length = 0;
            $scope.minPerCase = 0;
            $scope.eventsList = [];
            $scope.appCount = data.appointmentCounts;
            if (JSON.stringify(data) !== '{}') {
                loadEvents(booked, data);
            }
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('removeEvents');
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('addEventSource', $scope.eventsList);
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('rerenderEvents');
            setTimeout(function () {
                angular.element('#Singlecalendar').fullCalendar('option', {
                    defaultTimedEventDuration: '00:' + avgConsultationTime + ':00',
                    slotDuration: '00:' + avgConsultationTime + ':00'
                });
                angular.element('.fc-scroller').scrollTop(0);
                if ($('.fc-now-indicator-line').offset()) {
                    angular.element('.fc-scroller').scrollTop($('.fc-now-indicator-line').offset().top - 300);
                }
            }, 1000);
        }
        function onmonthError(data) {
            setCalenderViewVisibility(false);
        }
    }
    $scope.changeView = function (view) {
        uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('changeView', view);
    };
    $scope.loadCalenderEvent = function (evt) {
        $scope.SearchBy = "";
        //if (evt === 'week' || evt === 'month') { }
        $scope.hidescreen = false;
        $scope.hideregister = false;
        $scope.activeTab = evt;
        $scope.activeEvent = evt;
        $scope.calendarView = evt;
        $scope.renderCalendar('Singlecalendar');
        if (evt === 'day') {
            setCalenderViewVisibility(true);
            $scope.calendarView = evt;
            $scope.changeView('agendaDay');
            $scope.appScreen = "calendar";
            $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
            onclick();
        } else if (evt === 'week') {
            $scope.appScreen = "calendar";
            setCalenderViewVisibility(true);
            $scope.calendarView = evt;
            loadWeekView();
            $scope.changeView('agendaWeek');
        } else if (evt === 'month') {
            $scope.appScreen = "calendar";
            setCalenderViewVisibility(true);
            $scope.calendarView = evt;
            loadMonthView();
            $scope.changeView('month');
        } else {
            $scope.appScreen = "list";
            $scope.showAppointmentList();
        }
        $scope.evencalobj.IsShow = false;
    };


    $scope.eventmainclick = function (event) {

        console.log(event);

        if (!event.IsBreakEvent) {
            var appointmentMainObj = event;
            $scope.clearSelectedSlots();
            $scope.clearBreakDetails();
            console.log(appointmentMainObj);
            //var startTime = $filter("date")(new Date(appointmentMainObj.STime), "HH:mm a");
            //var endTime = $filter("date")(new Date(appointmentMainObj.ETime), "HH:mm a");

            var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(appointmentMainObj.AppointmentDetails.doctorID); });
            if (filteredDOcObj.length > 0) {
                $scope.evencalobj.DoctorName = filteredDOcObj[0].FullName;
            }
            function GetTime(date) {
                var currentTime = (new Date(date))
                var hours = currentTime.getHours()
                //Note: before converting into 12 hour format
                var suffix = '';
                if (hours > 11) {
                    suffix += "PM";
                } else {
                    suffix += "AM";
                }
                var minutes = currentTime.getMinutes()
                if (minutes < 10) {
                    minutes = "0" + minutes
                }
                if (hours > 12) {
                    hours -= 12;
                } else if (hours === 0) {
                    hours = 12;
                }
                var time = hours + ":" + minutes + " " + suffix;
                return time;
            }
            var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
            var Stime = currentdate + "T" + appointmentMainObj.AppointmentDetails.startTime;
            var Etime = currentdate + "T" + appointmentMainObj.AppointmentDetails.endTime;
            var newStartTime = GetTime(Stime);
            var newEndTime = GetTime(Etime);
            $scope.evencalobj.IsShow = true;
            /*$scope.evencalobj.StartTime = appointmentMainObj.STime;*/
            $scope.evencalobj.StartTime = newStartTime;
            /*$scope.evencalobj.EndTime = appointmentMainObj.ETime;*/
            $scope.evencalobj.EndTime = newEndTime;
            $scope.evencalobj.DoctorId = appointmentMainObj.AppointmentDetails.doctorID;
            $scope.evencalobj.infoobj = appointmentMainObj;
            //  $scope.evencalobj.date = "";
            $scope.evencalobj.date = appointmentMainObj.AppointmentDetails.startDate;
            $scope.evencalobj.appointmentStatus = event.AppointmentDetails.appointmentStatus;
            $scope.evencalobj.VisitTypeId = event.AppointmentDetails.VisitTypeId || 0;
            $scope.evencalobj.PatientName = appointmentMainObj.AppointmentDetails.patientInfo.fullName;

            var currentTime = $filter('date')(new Date(), 'HH:mm');
            var currentDate1 = $filter('date')(new Date(appointmentMainObj.AppointmentDetails.startDate), "yyyy-MM-dd");
            var newStartTime1 = $filter('date')(new Date(Stime), 'HH:mm');

            $scope.evencalobj.BookNewAppointmentIND = false;
            if (currentDate1 == currentdate) {
                if (newStartTime1 > currentTime) {
                    $scope.evencalobj.BookNewAppointmentIND = true;
                }
            }

            var appt_date = $filter("date")(new Date(event.rowData.consultationDate), "yyyy-MM-dd");
            var today_date = $filter('date')(new Date(), "yyyy-MM-dd");
            if (appt_date > today_date || appt_date == today_date) {
                console.log(" appointment future and today");
                $scope.PopoverBtnObj.pastdateappointment = false;
            } else {
                console.log("past date appointment");
                $scope.PopoverBtnObj.pastdateappointment = true;
            }
            $scope.PopoverBtnObj.appointmentStatus = event.AppointmentDetails.appointmentStatus;
        } else {
            let tempObj = event;
            var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(tempObj.SlotInfo.DoctorId); });
            if (filteredDOcObj.length > 0) {
                $scope.BreakEventObj.DoctorName = filteredDOcObj[0].FullName;
            }
            $scope.BreakEventObj.IsShow = true;
            $scope.BreakEventObj.StartTime = new Date(tempObj.SlotInfo.StartTime);
            $scope.BreakEventObj.EndTime = new Date(tempObj.SlotInfo.EndTime);
            $scope.BreakEventObj.DoctorId = tempObj.SlotInfo.DoctorId;
            $scope.BreakEventObj.infoobj = tempObj;
            $scope.BreakEventObj.date = tempObj.SlotInfo.ConsultationDate;

            $scope.clearEventSelectedSlots();
            $scope.clearSelectedSlots();
        }
    }

    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        //api.destroy();
        //  chooseAction(event, delta, revertFunc, jsEvent, ui, view);
        if (event.AppointmentDetails.appointmentStatus !== 'C') {

            var GivenDate = moment(event.start).format('DD-MMM-YYYY');
            var CurrentDate = new Date();
            GivenDate = new Date(GivenDate);
            if (GivenDate > CurrentDate) {

            } else {
                var given1 = $filter('date')(new Date(GivenDate), "MM-dd-yyyy");
                var current1 = $filter('date')(new Date(CurrentDate), "MM-dd-yyyy");
                if (given1 === current1) {
                    var todaystartTime = $filter("date")(new Date(event.start), "HH:mm");
                    var todaytime = $filter('date')(new Date(), 'HH:mm');
                    if (todaystartTime < todaytime) {
                        alertify.error('This Time Slot Has Already Ended!');
                        revertFunc();
                        return false;
                    }
                }
            }

            var startTime = $filter("date")(new Date(event.start), "HH:mm");
            var endTime = $filter('date')(new Date(event.end), 'HH:mm');
            var start1 = startTime.replaceAll(":", "");
            var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(doctorInfo.doctorid); });
            var OverAllStartTime1 = $scope.CalenderDoctorAvailableSlots.StartTime.replaceAll(":", "");
            var OverAllEndTime1 = $scope.CalenderDoctorAvailableSlots.EndTime.replaceAll(":", "");

            if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {

                $scope.ChangeAppointmentDoctor1(event);

            } else {
                if (filteredDOcObj[0].SlotStartTime != "00:00" && filteredDOcObj[0].SlotEndTime != "00:00") {
                    var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> You Have Selected Non-business Hours, Do You Wish to Continue?</h4>", function () {
                        $scope.ChangeAppointmentDoctor1(event);
                    }, function () {
                        revertFunc();
                    });
                } else {
                    revertFunc();
                }
            }


        } else {
            revertFunc();
        }
    };
    $scope.alertOnDayClick = function (date, event, view) {



        $scope.PageName = 'book';
        var time = date.format('HH:mm');
        $scope.ispatientExistsval = false;
        $scope.calenderDate = moment(date).format('DD-MMM-YYYY' + time);
        if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
            var clinicAddress = { "ClinicId": $scope.AppListselectedclinic.ExtDetails.HospitalID };
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        }

        $scope.AppDate = "";
        openAppPopup();

    };
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        // api.destroy();
        chooseAction(event, delta, revertFunc, jsEvent, ui, view);
    };
    $scope.alertOnSelect = function (date, event, view, info) {


        if (info.type == "month") {
            return false;
        }

        var startTime = date.format('HH:mm:ss');
        var endTime = event.format('HH:mm:ss');


        var getDate = date.format('DD-MMM-YYYY');

        var calenderDate = date.format('DD-MMM-YYYY' + ' ' + startTime);
        var calenderDate1 = date.format('DD-MMM-YYYY' + ' ' + endTime);

        var date1 = new Date(calenderDate);
        var date2 = new Date(calenderDate1);


        var GivenDate = date.format('DD-MMM-YYYY');
        var CurrentDate = new Date();
        GivenDate = new Date(GivenDate);
        if (GivenDate > CurrentDate) {

        } else {
            var given1 = $filter('date')(new Date(GivenDate), "MM-dd-yyyy");
            var current1 = $filter('date')(new Date(CurrentDate), "MM-dd-yyyy");
            if (given1 === current1) {
                if (info.intervalUnit !== "month") {
                    var todaystartTime = date.format('HH:mm');
                    var todaytime = $filter('date')(new Date(), 'HH:mm');
                    if (todaystartTime < todaytime) {
                        alertify.error('This Time Slot Has Already Ended!');
                        return false;
                    }
                }
            } else {
                return false;
            }
        }

        var startTime1 = date.format('HH:mm');
        var start1 = startTime1.replaceAll(":", "");


        var OverAllStartTime1 = $scope.CalenderDoctorAvailableSlots.StartTime.replaceAll(":", "");
        var OverAllEndTime1 = $scope.CalenderDoctorAvailableSlots.EndTime.replaceAll(":", "");

        console.log($scope.CalenderDoctorAvailableSlots.StartTime + "__" + $scope.CalenderDoctorAvailableSlots.EndTime);



        var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(doctorInfo.doctorid); });



        $scope.cacheStorageItem.bookApptType = "ApptFromCalendar";
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);



        function GetTime(date) {
            var currentTime = (new Date(date))
            var hours = currentTime.getHours()
            //Note: before converting into 12 hour format
            var suffix = '';
            if (hours > 11) {
                suffix += "PM";
            } else {
                suffix += "AM";
            }
            var minutes = currentTime.getMinutes()
            if (minutes < 10) {
                minutes = "0" + minutes
            }
            if (hours > 12) {
                hours -= 12;
            } else if (hours === 0) {
                hours = 12;
            }
            var time = hours + ":" + minutes + " " + suffix;
            return time;
        }

        var newstartTime = GetTime(date);
        var newendTime = GetTime(event);

        $scope.clearEventSelectedSlots();
        $scope.clearBreakDetails();

        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
            $scope.calobj.IsShow = true;
            $scope.calobj.StartTime = startTime;
            $scope.calobj.NewStartTime = newstartTime;
            $scope.calobj.NewEndTime = newendTime;
            $scope.calobj.EndTime = endTime;
            $scope.calobj.DoctorId = doctorInfo.doctorid;
            $scope.calobj.infoobj = info;
            //   $scope.calobj.date = date;
            $scope.calobj.date = GivenDate;
            $scope.calobj.DoctorName = filteredDOcObj[0].FullName;
        } else {
            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'> You have choosen non-business hours, do you want to continue? </h4>", function () {
                angular.forEach($scope.UserAvailableSlots, function (item) {
                    angular.forEach(item.ScheduleVisitTypeDetails, function (kitem) {
                        let startTime = kitem.StartTime.replace(":", "");
                        let endTime = kitem.EndTime.replace(":", "");
                        let startTime1 = $filter('date')(new Date(calenderDate), "HH:mm");
                        let endTime1 = $filter('date')(new Date(calenderDate1), "HH:mm");
                        startTime1 = startTime1.replace(":", "");
                        endTime1 = endTime1.replace(":", "");
                        if (startTime1 > startTime && startTime1 < endTime) {
                            $rootScope.appointment_type = kitem.VisitTypeId.toString();
                        }
                    });
                });

                function getMinutesBetweenDates(startDate, endDate) {
                    var diff = endDate.getTime() - startDate.getTime();
                    return (diff / 60000);
                }
                var minutes = getMinutesBetweenDates(date1, date2);
                $scope.selectedLoginDoctor.MinPerCase = $scope.selectedLoginDoctor.MinPerCase || 0;
                var obj = {
                    'IsComingFrom': 'Doctorcalendar',
                    //'MinPerCaseval': minutes != 0 ? minutes : $scope.selectedLoginDoctor.MinPerCase,
                    'MinPerCaseval': $scope.selectedLoginDoctor.MinPerCase != 0 ? $scope.selectedLoginDoctor.MinPerCase : (minutes != 0 ? minutes : 20),
                    'Starttime': calenderDate,
                    'Endtime': calenderDate1,
                    'GetDate': getDate,
                    'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                    'OutOfBusinessTime': true
                }
                datapersistanceFactory.set("SingleDoctorcalendar", obj);

                $scope.PageName = 'book';
                var time = date.format('HH:mm');
                $scope.ispatientExistsval = false;
                $scope.calenderDate = date.format('DD-MMM-YYYY' + time);
                var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
                var doctorID = {
                    "DoctorID": doctorInfo.doctorid
                };

                if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57 || doctorInfo.RoleID === 18) {
                    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
                    eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
                } else if (doctorInfo.RoleID === 1 || doctorInfo.RoleID === 56) {
                    eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
                    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
                } else {
                    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
                }

                $scope.AppDate = "";
                var Obj = {
                    "PageName": "book",
                    "AppDate": "",
                    "ispatientExistsval": $scope.ispatientExistsval || false,
                    "calenderDate": $scope.calenderDate,
                    "AppointmentId": null,
                    "PatientId": null,
                    'IsComingFrom': '',
                    "DoctorId": null,
                    "StartTime": null,
                    "EndTime": null,
                };
                datapersistanceFactory.set('AppointmentDetailsCache', Obj);
                //  openAppPopup();
                BookApptPopupOpened();


            }, function () { });
        }


        //if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
        //    $scope.mInstanceAdd2 = $uibModal.open({
        //        "templateUrl": "ConfirmBox.html",
        //        "backdrop": "static",
        //        "scope": $scope,
        //        "keyboard": false,
        //        "size": "md",
        //        "controller": function ($scope, $uibModal, $uibModalInstance) {
        //            $scope.CloseConfirmBoxInCalendar = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            };

        //            $scope.AddBreakFromCalendarConfirm = function () {
        //                let req = {
        //                    "UserId": $scope.UserId,
        //                    "DoctorId": doctorInfo.doctorid,
        //                    "BranchId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID,
        //                    "UserScheduleId": $scope.UserScheduleId,
        //                    "UserScheduleDetailId": $scope.UserScheduleDetailId,
        //                    "UserScheduleOnlineBreakDetailId": 0,
        //                    "StartTime": $filter('date')(new Date(calenderDate), "HH:mm"),
        //                    "EndTime": $filter('date')(new Date(calenderDate1), "HH:mm"),
        //                    "Date": $filter('date')(new Date(calenderDate), "yyyy-MM-dd"),
        //                    "DeleteInd": "N"
        //                };
        //                //console.log(req);
        //                //return;
        //                eHnoteMainAppointmentService.AddUpdateDoctorBreakSlot(req).then(function (resp) {
        //                    if (resp.data.Status === "Success") {
        //                        $scope.loadCalenderEvent('day');
        //                        $uibModalInstance.dismiss("cancel");
        //                    }
        //                    if (resp.data.Status === "Failure") {
        //                        alertify.error(resp.data.Message);
        //                        $uibModalInstance.dismiss("cancel");
        //                    }
        //                }, function (err) {
        //                    console.log(err);
        //                });

        //            };
        //        }
        //    });
        //    $scope.BookApptFromCalendarConfirm = function () {
        //        angular.forEach($scope.UserAvailableSlots, function (item) {
        //            angular.forEach(item.ScheduleVisitTypeDetails, function (kitem) {
        //                let startTime = kitem.StartTime.replace(":", "");
        //                let endTime = kitem.EndTime.replace(":", "");
        //                let startTime1 = $filter('date')(new Date(calenderDate), "HH:mm");
        //                let endTime1 = $filter('date')(new Date(calenderDate1), "HH:mm");
        //                startTime1 = startTime1.replace(":", "");
        //                endTime1 = endTime1.replace(":", "");
        //                if (startTime1 > startTime && startTime1 < endTime) {
        //                    $rootScope.appointment_type = kitem.VisitTypeId.toString();
        //                }
        //            });
        //        });
        //        $scope.mInstanceAdd2.dismiss("cancel");
        //        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
        //            function getMinutesBetweenDates(startDate, endDate) {
        //                var diff = endDate.getTime() - startDate.getTime();
        //                return (diff / 60000);
        //            }
        //            var minutes = getMinutesBetweenDates(date1, date2);
        //            $scope.selectedLoginDoctor.MinPerCase = $scope.selectedLoginDoctor.MinPerCase || 0;
        //            var obj = {
        //                'IsComingFrom': 'Doctorcalendar',
        //                //'MinPerCaseval': minutes != 0 ? minutes : $scope.selectedLoginDoctor.MinPerCase,
        //                'MinPerCaseval': $scope.selectedLoginDoctor.MinPerCase != 0 ? $scope.selectedLoginDoctor.MinPerCase : (minutes != 0 ? minutes : 20),
        //                'Starttime': calenderDate,
        //                'Endtime': calenderDate1,
        //                'GetDate': getDate,
        //                'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
        //                'OutOfBusinessTime': false
        //            }
        //            datapersistanceFactory.set("SingleDoctorcalendar", obj);

        //            $scope.PageName = 'book';
        //            var time = date.format('HH:mm');
        //            $scope.ispatientExistsval = false;
        //            $scope.calenderDate = date.format('DD-MMM-YYYY' + time);
        //            var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        //            var doctorID = {
        //                "DoctorID": doctorInfo.doctorid
        //            };

        //            if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57 || doctorInfo.RoleID === 18) {
        //                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        //                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        //            } else if (doctorInfo.RoleID === 1 || doctorInfo.RoleID === 56) {
        //                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        //                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        //            } else {
        //                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        //            }
        //            //if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
        //            //    var clinicAddress = { "ClinicId": $scope.AppListselectedclinic.ExtDetails.HospitalID };
        //            //    eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        //            //}

        //            $scope.AppDate = "";
        //            openAppPopup();
        //        } 
        //    };
        //}
        //else {

        //}












    };
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    $scope.renderCalendar = function (calendar) {
        $timeout(function () {
            if (uiCalendarConfig.calendars["Singlecalendar"]) {
                uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('render');
            }
        });
    };

    $scope.DeleteBreakSlot = function (obj) {
        if ($scope.userLoginDetails.RoleID !== 63 && $scope.userLoginDetails.RoleID !== 65 && $scope.userLoginDetails.RoleID !== 67 && $scope.userLoginDetails.RoleID !== 69) {
            alertify.error("You don't have access, Please contact reception manager!");
            return;
        }
        $scope.IsForAddingBreakSlot = false;
        $scope.Remarks = "";
        let RemarksBoxInstance = $uibModal.open({
            "templateUrl": "BreakSlotsRemarksPopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "sm",
            "controller": function ($scope, $uibModal, $uibModalInstance, obj) {
                $scope.closePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                let d = new Date(obj.infoobj.SlotInfo.ConsultationDate);
                let weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let DayId = d.getDay();
                let Day = weekArray[DayId];

                $scope.SaveRemarksAndUnBlockSlot = function () {
                    if ($scope.Remarks === "") {
                        alertify.error("Please enter the remarks!");
                        return false;
                    }
                    let req = {
                        "UserId": $scope.UserId,
                        "DoctorId": obj.infoobj.SlotInfo.DoctorId,
                        "BranchId": obj.infoobj.SlotInfo.OrganizationId,
                        "UserScheduleId": obj.infoobj.SlotInfo.UserScheduleId,
                        "UserDayBreakSlotId": obj.infoobj.SlotInfo.UserDayBreakSlotId,
                        "StartTime": obj.infoobj.SlotInfo.StartTime,
                        "EndTime": obj.infoobj.SlotInfo.EndTime,
                        "Date": obj.infoobj.SlotInfo.ConsultationDate,
                        "DayId": DayId,
                        "Day": Day,
                        "Remarks": $scope.Remarks,
                        "IsAddBreakSlot": false,
                        "DeleteInd": "Y"
                    };

                    eHnoteMainAppointmentService.AddUpdateDoctorBreakSlot(req).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.loadCalenderEvent('day');
                            $scope.clearBreakDetails();
                            $uibModalInstance.dismiss();
                        }
                    }, function (err) {
                        console.log(err);
                    });
                };
            },
            "resolve": {
                "obj": function () {
                    return obj;
                }
            }
        });


    };

    $scope.eventRender = function (event, element, view) {
        if (!event.IsBreakEvent) {
            var patInfo = event.rowData.PatientInfo;

            console.log(patInfo);
            var visitreasontxt = event.rowData.visitReason || "";


            var profileImg = (patInfo.S3URL === undefined || patInfo.S3URL === "") ? "images/default.png" : patInfo.S3URL;
            //var patientName = ((patInfo.title === undefined || patInfo.title === "") ? "" : (patInfo.title + ". ")) + patInfo.fullName;
            var patientName = patInfo.fullName;
            //var patientAge = patInfo.currentAge !== undefined ? (patInfo.currentAge.year + "y " + (patInfo.currentAge.month !== "0" ? (patInfo.currentAge.month + "m") : "")) : "";
            //var patientAge = patInfo.AgeInYears + 'Y' + ' ' + patInfo.AgeInMonths + 'M';
            //var patientAge = patInfo.DOB;
            var patientAge = $filter('date')(new Date(patInfo.DOB), "MM-dd-yyyy")
            //  var patientMobile = patInfo.MobileNo === undefined ? "" : patInfo.MobileNo;
            var patientMobile = "";
            patInfo.HomeNumber = patInfo.HomeNumber || "";
            var obj = eHnoteUserDataService.UsMobileFormatChange(patInfo.HomeAreaCode + patInfo.HomeNumber);
            patientMobile = obj.UsFormatMobileNumber;
            //if (patInfo.HomeNumber !== "") {
            //    patientMobile = patInfo.HomeNumber === undefined ? "" : patInfo.HomeCountryCode + "-" + patInfo.HomeAreaCode + "-" + patInfo.HomeNumber;
            //} else if (patInfo.MobileNo === undefined) {
            //    patientMobile = patInfo.MobileNo === undefined ? "" : patInfo.MobileNo;
            //}
            var patientSex = patInfo.Sex;
            //  var patientID = (doctorinfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID === undefined) ? "" : patInfo.patDisplayID;
            //   patientID = patInfo.patientID;
            var patientID = patInfo.PatientDisplayId || "";
            var patID = patInfo.patientID;
            var consultDate = $filter('date')(new Date(event.rowData.consultationDate), "MMM dd yyyy");
            var start = $filter('date')(new Date(event.startTime), "HH:mm a");
            var end = $filter('date')(new Date(event.endTime), "HH:mm a");
            var token = event.token;
            var doctorName = "Dr. " + event.rowData.doctorName;
            var isconfirmedappt = event.AppointmentDetails.IsConfirmedAppointment || false;
            var confirmedText = isconfirmedappt == true ? 'Confirmed' : 'Not confirmed';
            var confirmedimg = isconfirmedappt == true ? '<img src="img/appt-list/confirmed.svg" />' : '<img src="img/appt-list/Cancelled.svg" />';
            var doctorSpecialities = event.rowData.doctorSpecialities || "";
            if (end === "23:59") { end = "24:00"; }
            event.source = "";
            var popover = "";

            var appt_date = $filter("date")(new Date(event.rowData.consultationDate), "yyyy-MM-dd");
            var today_date = $filter('date')(new Date(), "yyyy-MM-dd");
            var pastdateappointment = false;
            if (appt_date > today_date || appt_date == today_date) {
                console.log(" appointment future and today");
                pastdateappointment = false;
            } else {
                console.log("past date appointment");
                pastdateappointment = true;
            }
            if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43) {
                var OpenProfileBtn = "Start Charting";
            } else {
                var OpenProfileBtn = "Open Profile";
            }

            var plugVisittype = false;
            event.AppointmentDetails.VisitTypeId = event.AppointmentDetails.VisitTypeId || 0;
            if (event.AppointmentDetails.VisitTypeId == 0) {
                plugVisittype = true;
            }


            var bgEventclass = element.context;
            bgEventclass.style.background = 'linear-gradient(to bottom right, white, ' + event.color + ')';
            bgEventclass.style.borderColor = "black";

            var fcTitle = element[0].firstChild.querySelector('.fc-title');
            if (patInfo.appointmentStatus == "C") {
                var imgElement = document.createElement("img");
                imgElement.src = "img/appt-list/xmark-solid.svg";
                imgElement.width = "11";
                imgElement.style.marginRight = "5px";
                element[0].firstChild.insertBefore(imgElement, fcTitle);
            } else {
                if (isconfirmedappt) {
                    var imgElement = document.createElement("img");
                    imgElement.src = "img/appt-list/check-solid.svg";
                    imgElement.width = "11";
                    imgElement.style.marginRight = "5px";
                    element[0].firstChild.insertBefore(imgElement, fcTitle);
                }
            }

            if (patInfo.appointmentStatus === "EVENT" || patInfo.appointmentStatus === "IMPEVENT") {
                if (patientName === "Dr. ") { patientName = "All Doctors"; }
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"> <div class="popover-image"><img src="' + profileImg + '" alt=""></div><div class="popover-details"><h3 style="margin-top:20px">' + patientName + '</h3></div></div><div class="col-md-6"><div class="popover-timming"><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div><div class="row popover-button"><div class="col-md-6 padding-right-0"><button class="btn-cancel-app app-cancel">Cancel Event</button></div><div class="col-md-6 reschedule-button"><button class="btn-cancel-app app-reschedule">Reschedule Event</button></div></div></div>';
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"><div class="cal-popover-patient"><label>' + patientName + '</label><button class="btn-cancel-app app-cancel">Cancel Event</button></div></div><div class="col-md-6"><div class="cal-popover-patient"><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p><button class="btn-cancel-app app-reschedule">Reschedule Event</button></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div>';
                if (pastdateappointment == true) {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="appointment-booked lh-2-2">Booked</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div><div class="calendar-details-footer"></div></div></div></div>';
                } else {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="appointment-booked lh-2-2">Booked</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div><div class="row"><div class="col-lg-3"><div class="dis-flex"><div class="cal-popover-patient flex"><button class="btn btn-cancel app-cancel">Cancel Event</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-reschedule">Open Appointment</button></div></div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                }
            } else if (patInfo.appointmentStatus === "O") {
                //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"> <div class="popover-image"><img src="' + profileImg + '" alt=""></div><div class="popover-details"><h3>' + patientName + '</h3><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p class=' + patID + '>Patient ID: ' + patientID + '</p><p>Token: ' + token + '</p></div></div><div class="col-md-6"><div class="popover-timming"><p>' + doctorName + '</p><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p><p class="app-status-started">OnGoing</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div><div class="row popover-button"><div class="col-md-6 padding-right-0"><button class="btn-cancel-app app-cancel no-action">Cancel Appointment</button></div><div class="col-md-6 reschedule-button"><button class="btn-cancel-app app-reschedule no-action">Reschedule Appointment</button></div></div></div>';
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"><div class="cal-popover-patient"><label>' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>Patient ID: ' + patientID + '</p><button class="btn btn-cancel app-cancel no-action">Cancel Appointment</button></div></div><div class="col-md-6"><div class="cal-popover-patient"><label>' + doctorName + '</label><br /><span class="app-status-started">OnGoing</span><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p><button class="btn btn-ehnote radius-100 app-reschedule no-action">Reschedule Appointment</button></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div>';
                if (pastdateappointment == true) {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="app-status-started lh-2-2">OnGoing</span><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-started">OnGoing</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div><div class="calendar-details-footer"></div></div></div></div>';
                } else {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="app-status-started lh-2-2">OnGoing</span><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div><div class="row"><div class="col-lg-3"><div class="dis-flex"><div class="cal-popover-patient flex"><button class="btn btn-cancel app-cancel no-action">Cancel Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-reschedule no-action">Open Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-OpenProfile">' + OpenProfileBtn + '</button></div></div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-started">OnGoing</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                }
            } else if (patInfo.appointmentStatus === "E") {
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"> <div class="popover-image"> <img src="' + profileImg + '" alt=""></div><div class="popover-details"><h3>' + patientName + '</h3><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p class=' + patID + '>Patient ID: ' + patientID + '</p><p>Token: ' + token + '</p> </div> </div> <div class="col-md-6"><div class="popover-timming"><p>' + doctorName + '</p><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p><p class="app-status-completed">Completed</p> </div> </div> <div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div><div class="row popover-button"><div class="col-md-6 padding-right-0"><button class="btn-cancel-app app-cancel no-action">Cancel Appointment</button></div><div class="col-md-6 reschedule-button"><button class="btn-cancel-app app-reschedule">Rebook Appointment</button></div> </div></div>';
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"><div class="cal-popover-patient"><label>' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>Patient ID: ' + patientID + '</p><button class="btn btn-cancel  app-cancel no-action">Cancel Appointment</button></div></div><div class="col-md-6"><div class="cal-popover-patient"><label>' + doctorName + '</label><br /><span class="app-status-completed">Completed</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + '</p><button class="btn btn-ehnote radius-100 app-reschedule">Rebook Appointment</button></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div>';
                if (pastdateappointment == true) {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="app-status-completed lh-2-2">Completed</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + '</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-completed">Completed</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div><div class="calendar-details-footer"></div></div></div></div>';
                } else {
                    // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="app-status-completed lh-2-2">Completed</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + '</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div><div class="row"><div class="col-lg-3"><div class="dis-flex"><div class="cal-popover-patient flex"><button class="btn btn-cancel  app-cancel no-action">Cancel Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-reschedule no-action">Open Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-OpenProfile">' + OpenProfileBtn + '</button></div></div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="app-status-completed">Completed</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                }
            } else if (patInfo.appointmentStatus === "C") {
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"> <div class="popover-image"><img src="' + profileImg + '" alt=""></div><div class="popover-details"><h3>' + patientName + '</h3><p>' + patientSex + ' - ' + patientAge + '</p> <p>' + patientMobile + '</p><p class=' + patID + '>Patient ID: ' + patientID + '</p><p>Token: ' + token + '</p></div></div><div class="col-md-5"><div class="popover-timming"><p>' + doctorName + '</p><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p><p class="app-status-checkin">Cancelled</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div><div class="row popover-button"><div class="col-md-6 padding-right-0"><button class="btn-cancel-app app-cancel">Cancel Appointment</button></div><div class="col-md-6 reschedule-button"><button class="btn-cancel-app app-reschedule">Rebook Appointment</button></div></div></div>';
                popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><span class="app-status-checkin">Cancelled</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
            } else if (patInfo.appointmentStatus === "D") {
                if (pastdateappointment == true) {
                    //  popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="app-status-saved lh-2-2" style="color:#3a647f; font-size:12px; width:80px">Saved</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + '</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><span class="app-status-saved">Saved</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div><div class="calendar-details-footer"></div></div></div></div>';
                } else {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="app-status-saved lh-2-2" style="color:#3a647f; font-size:12px; width:80px">Saved</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + '</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div><div class="row"><div class="col-lg-3"><div class="dis-flex"><div class="cal-popover-patient flex"><button class="btn btn-cancel  app-cancel no-action">Cancel Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-reschedule no-action">Open Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-OpenProfile">' + OpenProfileBtn + '</button></div></div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><span class="app-status-saved">Saved</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                }
            } else {
                // popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"> <div class="popover-image"><img src="' + profileImg + '"></div><div class="popover-details"><h3>' + patientName + '</h3><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p class=' + patID + '>Patient ID: ' + patientID + '</p><p>Token: ' + token + '</p></div></div><div class="col-md-6"> <div class="popover-timming"><p>' + doctorName + '</p><p>' + consultDate + '</p><p>' + start + ' Hrs to ' + end + ' Hrs</p><p class="app-status-booked">Booked</p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div><div class="row popover-button"><div class="col-md-6 padding-right-0"><button class="btn-cancel-app app-cancel">Cancel Appointment</button></div> <div class="col-md-6 reschedule-button"><button class="btn-cancel-app app-reschedule">Reschedule Appointment</button> </div></div></div>';
                //  popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-6"><div class="cal-popover-patient"><label style="font-size: 13px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>Patient ID: ' + patientID + '</p><button class="btn btn-cancel app-cancel">Cancel Appointment</button></div></div><div class="col-md-6"><div class="cal-popover-patient"><label style="font-size: 13px;">' + doctorName + '</label><br /><span class="appointment-booked lh-2-2">Booked</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p><button class="btn btn-ehnote radius-100 app-reschedule">Reschedule Appointment</button></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div>';
                if (pastdateappointment == true) {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="appointment-booked lh-2-2">Booked</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                } else if (plugVisittype == true) {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="appointment-booked lh-2-2">Booked</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div><div class="row"><div class="col-lg-3"><div class="dis-flex"><div class="cal-popover-patient flex"><button class="btn btn-cancel app-cancel no-action">Cancel Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-reschedule no-action">Open Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-OpenProfile no-action">' + OpenProfileBtn + '</button></div></div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                } else {
                    //popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-lg-12"><div class="dis-flex"><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + patientName + '</label><p>' + patientSex + ' - ' + patientAge + '</p><p>' + patientMobile + '</p><p>MR.No: ' + patientID + '</p></div><div class="cal-popover-patient flex"><label style="font-size: 15px;">' + doctorName + '</label><br /><span class="appointment-booked lh-2-2">Booked</span><p>' + consultDate + '</p><p>' + start + ' to ' + end + ' </p></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div><div class="row"><div class="col-lg-3"><div class="dis-flex"><div class="cal-popover-patient flex"><button class="btn btn-cancel app-cancel">Cancel Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-reschedule">Open Appointment</button></div><div class="cal-popover-patient flex"><button class="btn btn-ehnote radius-100 app-OpenProfile">' + OpenProfileBtn + '</button></div></div></div></div></div>';
                    popover = '<div class="appointment-popover-section"><div class="col-lg-12"><div class="width-500 bg-white"><div class="dis-flex p-8"> <div class="flex calendar-details-body"> <span class="calendar-details-head pc-head dis-inline-block">Patient Details</span><h3><i class="fas fa-user"></i> ' + patientName + '</h3><p><i class="fas fa-birthday-cake"></i> ' + patientSex + ' - ' + patientAge + '</p><p><i class="fas fa-id-card-alt"></i> ' + patientID + '</p><p><i class="fas fa-phone"></i>' + patientMobile + '</p><p>' + confirmedimg + '  ' + confirmedText + '</p></div ><div class="line-calendar"></div><div class="flex calendar-details-body"><span class="calendar-details-head dd-head dis-inline-block">Doctor Details</span><h3><i class="fas fa-user-md"></i>' + doctorName + '</h3><p><i class="fas fa-calendar-alt"></i>' + consultDate + '</p><p><i class="fas fa-clock"></i>' + start + ' to ' + end + '</p><p>Visit For : ' + visitreasontxt + '</p><span class="appointment-booked">Booked</span></div></div><div style="display:none" id="eventData">' + JSON.stringify(event) + '</div></div></div></div>';
                }
            }
        } else {
            var breakDate = $filter('date')(new Date(event.SlotInfo.ConsultationDate), "MM-dd-yyyy");
            var BreakStartTime = $filter('date')(new Date(event.SlotInfo.StartTime), "hh:mm a");
            var BreakEndTime = $filter('date')(new Date(event.SlotInfo.EndTime), "hh:mm a");
            var BlockedRemarks = event.SlotInfo.BlockedRemarks;
            var BlockReason = event.SlotInfo.ReasonforBlockSlot;
            //var popover = '<div class="appointment-popover-section"><div class="row appointment-popover-header"><div class="col-md-5"><div class="cal-popover-patient"><label id="eventData" class="hide">' + JSON.stringify(event.SlotInfo) + '</label><p>' + breakDate + '</p><p>' + BreakStartTime + ' to ' + BreakEndTime + '</p><p>' + BlockedRemarks +'</p></div></div></div></div>';
            var popover = '<div class="appointment-select m-b-10"><label id="eventData" class="hide">' + JSON.stringify(event.SlotInfo) + '</label><h6><i class="far fa-calendar p-l-10"></i><span> ' + breakDate + '</span></h6><h6><i class="far fa-clock p-l-10"></i> <b>' + BreakStartTime + ' - ' + BreakEndTime + '</b></h6><h5>Reason: </h5><h4>' + BlockReason + '</h4><h5>Remarks: </h5><h4>' + BlockedRemarks + '</h4><h3>Slot Blocked</h3></div>';
        }


        var tooltip = element.qtip({
            content: {
                text: popover
            },
            show: {
                solo: true,
                event: 'mouseenter'
            },
            hide: {
                fixed: true,
                delay: 50,
                event: 'click mousedown mouseleave'
            },
            adjust: {
                scroll: true
            },
            position: {
                target: 'mouse',
                adjust: {
                    mouse: false
                }
            },
            events: {
                mousedown: function (event, api) {
                    qtipDown = true;
                },
                move: function (event, api) {
                    if (qtipDown)
                        event.preventDefault();
                },
                mouseleave: function (event, api) {
                    qtipDown = false;
                },
                render: function (event, api) {
                    angular.element(this).on("click", ".app-cancel", function () {
                        var ele = angular.element(this).closest(".appointment-popover-section").find("#eventData");
                        var obj = JSON.parse(ele.html());
                        if (obj.rowData.IscheckedIn === "Y") {
                            alertify.error('Patient Already CheckedIn,You can not Cancel');
                            return false;
                        }
                        if (obj.rowData.PatientInfo.appointmentStatus !== "S" && obj.rowData.PatientInfo.appointmentStatus !== "E") {
                            $scope.eventClicked(obj, "cancel");
                        } else {
                            alertify.error("Sorry you cannot CANCEL this appointment");
                        }
                    });
                    angular.element(this).on('click', '.app-reschedule', function () {
                        var ele = angular.element(this).closest('.appointment-popover-section').find('#eventData');
                        var obj = JSON.parse(ele.html());
                        if (obj.rowData.PatientInfo.appointmentStatus !== "E") {
                            $scope.eventClicked(obj, "reschedule");
                        } else {
                            $scope.eventClicked(obj, "cancel");
                        }
                    });
                    angular.element(this).on('click', '.app-OpenProfile', function () {
                        var ele = angular.element(this).closest('.appointment-popover-section').find('#eventData');
                        var obj = JSON.parse(ele.html());
                        if (obj.rowData.PatientInfo.appointmentStatus !== "E") {
                            $scope.eventClicked(obj, "OpenProfile");
                        } else {
                            $scope.eventClicked(obj, "cancel");
                        }
                    });
                    angular.element(this).on('click', '.unblock-break', function () {
                        var ele = angular.element(this).closest('.appointment-popover-section').find('#eventData');
                        var obj = JSON.parse(ele.html());
                        $scope.DeleteBreakSlot(obj);
                    });
                }
            },
            style: {
                width: 508,
                tip: false,
                classes: 'qtip-light qtip-shadow'
            }
        });
        // api = tooltip.qtip('api'); //commented by sabarish. need to check where api variable declared.
    };


    var daySetupPopUp;
    function openAppPopup() {
        $scope.daySetupPopUp = $uibModal.open({
            "templateUrl": 'appointMentPopupId.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup",
            /* "size":"lg"*/
        });

    }

    function BookApptPopupOpened(type) {
        var openBookAppt = type || "";
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


            $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
            var obj = {
                "selectedDoctor": $scope.selectedDoctor
            }
            $rootScope.$broadcast("AppointmentTypefilter", obj);
            if ($scope.activeEvent === 'Calendar1') {
                $scope.loadappt();
            }
            if ($scope.mainCalendarView.MainTab == 2) {
                $scope.filterSelectedDoctorsonCalendar();
            }

            $scope.clearSelectedSlots();
            $scope.clearEventSelectedSlots();

        }, function () { });

    }

    function BookApptPopupOpenedv2(type) {
        var openBookAppt = type || "";
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


            $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
            var obj = {
                "selectedDoctor": $scope.selectedDoctor
            }
            $rootScope.$broadcast("AppointmentTypefilter", obj);
            if ($scope.activeEvent === 'Calendar1') {
                $scope.loadappt();
            }
            if ($scope.mainCalendarView.MainTab == 2) {
                $scope.filterSelectedDoctorsonCalendar();
            }

            $scope.clearSelectedSlots();
            $scope.clearEventSelectedSlots();

        }, function () { });

    }

    $scope.$on("closePopup", function (event) {
        $scope.daySetupPopUp.dismiss('cancel');
        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();
    });
    var receptionRoleIdsList = [2, 71, 64, 65, 62, 63, 18, 16, 66, 67, 10, 38, 30, 25, 19, 21, 8, 74, 73, 68, 69, 20, 11, 4];
    if (receptionRoleIdsList.includes($scope.userLoginDetails.RoleID)) {
        if ($scope.mainAppointmentView.isprofileback == '') {
            $scope.mainAppointmentView.isCalendarorList = 'list';
        } else {
            $scope.mainAppointmentView.isCalendarorList = $scope.mainAppointmentView.isprofileback
        }
    } else if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43) {
        if ($scope.mainAppointmentView.isprofileback == '') {
            $scope.mainAppointmentView.isCalendarorList = 'list';
        } else {
            $scope.mainAppointmentView.isCalendarorList = $scope.mainAppointmentView.isprofileback
        }
    } else if ($scope.userLoginDetails.RoleID === 20) {
        if ($scope.mainAppointmentView.isprofileback == '') {
            $scope.mainAppointmentView.isCalendarorList = 'list';
        } else {
            $scope.mainAppointmentView.isCalendarorList = $scope.mainAppointmentView.isprofileback
        }
    }
    else {
        if ($scope.mainAppointmentView.isprofileback == '') {
            $scope.mainAppointmentView.isCalendarorList = 'list';
        } else {
            $scope.mainAppointmentView.isCalendarorList = $scope.mainAppointmentView.isprofileback
        }
    }

    $scope.changeApptMainviewTab = function (type) {

        $scope.calobj.IsShow = false;
        $scope.calobj.StartTime = "";
        $scope.calobj.EndTime = "";
        $scope.calobj.NewStartTime = "";
        $scope.calobj.NewEndTime = "";
        $scope.calobj.DoctorId = "";
        $scope.calobj.DoctorName = "";
        $scope.calobj.infoobj = "";
        $scope.calobj.date = "";
        $scope.calobj.HospitalId = "";

        $scope.selectedOPUsers = eHnoteMasterDataService.getSelectedCRMRemindersDoctors();
        if ($scope.selectedOPUsers != '') {
            $scope.selectedOPUsers.SelectedDoctorsList = $scope.selectedOPUsers.SelectedDoctorsList || [];
            $scope.selectedOPUsers.OPFromDate = $scope.selectedOPUsers.OPFromDate || null;
        } else {
            $scope.selectedOPUsers = {
                "SelectedDoctorsList": [],
                "OPFromDate": moment().format("MM-DD-YYYY"),
            };
        }

        $scope.mainAppointmentView.isCalendarorList = type;
        $scope.SearchObj.ConsultationDt = moment().format("MMM-DD-YYYY");
        //  $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        if ($scope.mainAppointmentView.isCalendarorList === "calendar") {
            angular.forEach($scope.Calendardoctorlist1, function (citem, $index) {
                citem.isChecked = true;
            });
            $scope.mainCalendarView.AllDoctorscheck = true;

            $scope.selectedOPUsers.SelectedDoctorsList = $scope.selectedOPUsers.SelectedDoctorsList || [];
            if ($scope.selectedOPUsers.SelectedDoctorsList.length > 0) {
                angular.forEach($scope.MultiselectDoctorlist, function (Mitem) {
                    Mitem.isChecked = false;
                });
                angular.forEach($scope.selectedOPUsers.SelectedDoctorsList, function (Selecteditem) {
                    angular.forEach($scope.MultiselectDoctorlist, function (Mainitem) {
                        if (Selecteditem.DoctorID == Mainitem.DoctorID) {
                            Mainitem.isChecked = true;
                        }
                    });
                });

                var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
                $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;
                if (checkedArray.length == 0) {
                    $scope.selectedDoctors = "Select Doctors";
                    $scope.mainCalendarView.AllDoctorscheck = false;
                } else {
                    if (checkedArray.length === 1) {
                        $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        $scope.mainCalendarView.AllDoctorscheck = false;
                    } else {
                        if ($scope.AllDoctorsObj.AllDoctorCheck) {
                            $scope.selectedDoctors = "All";
                            $scope.mainCalendarView.AllDoctorscheck = true;
                        } else {
                            $scope.selectedDoctors = "Select Doctors";
                            $scope.mainCalendarView.AllDoctorscheck = false;
                        }
                    }
                }
            };

            eHnoteMasterDataService.addCalendarDoctorinAppList($scope.Calendardoctorlist1);
            $scope.filterSelectedDoctorsonCalendar();
        } else {
            if ($scope.MultiselectDoctorlist.length > 0) {
                /*if ($scope.userLoginDetails.RoleID == 43 || $scope.userLoginDetails.RoleID == 1) {
                    angular.forEach($scope.MultiselectDoctorlist, function (citem, $index) {
                        if (doctorInfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                            citem.isChecked = true;
                            //$scope.selectedDoctors = citem.NPI + '-' + citem.UserFullName;
                            $scope.selectedDoctors = citem.UserFullName + '-' + citem.NPI;
                            $scope.selectedUsers = citem.UserFullName + '-' + citem.NPI;
                        } else {
                            citem.isChecked = false;
                        }

                    });
                    $scope.mainCalendarView.AllDoctorscheck = false;
                } else {
                    angular.forEach($scope.MultiselectDoctorlist, function (citem, $index) {
                        citem.isChecked = true;
                    });
                    $scope.selectedDoctors = "All";
                    $scope.selectedUsers = "All";
                    $scope.mainCalendarView.AllDoctorscheck = true;
                }*/

                $scope.selectedOPUsers.SelectedDoctorsList = $scope.selectedOPUsers.SelectedDoctorsList || [];
                if ($scope.selectedOPUsers.SelectedDoctorsList.length > 0) {
                    angular.forEach($scope.MultiselectDoctorlist, function (Mitem) {
                        Mitem.isChecked = false;
                    });
                    angular.forEach($scope.selectedOPUsers.SelectedDoctorsList, function (Selecteditem) {
                        angular.forEach($scope.MultiselectDoctorlist, function (Mainitem) {
                            if (Selecteditem.DoctorID == Mainitem.DoctorID) {
                                Mainitem.isChecked = true;
                            }
                        });
                    });

                    var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
                    $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;
                    if (checkedArray.length == 0) {
                        $scope.selectedDoctors = "Select Doctors";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            if ($scope.AllDoctorsObj.AllDoctorCheck) {
                                $scope.selectedDoctors = "All";
                            } else {
                                $scope.selectedDoctors = "Select Doctors";
                            }
                        }
                    }
                }
            }
        }
        if ($scope.Visitreasons.length > 0) {
            angular.forEach($scope.Visitreasons, function (item) {
                if (item.VisitTypeId !== 4 && item.VisitTypeId !== 14 && item.VisitTypeId !== 6 && ($scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63)) {
                    item.isChecked = true;
                    $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                }
                if (item.VisitTypeId !== 5 && item.VisitTypeId !== 6 && ($scope.userLoginDetails.RoleID === 68)) {
                    item.isChecked = true;
                    $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                }
                if ((item.VisitTypeId === 4 || item.VisitTypeId === 14 || item.VisitTypeId === 6) && ($scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67)) {
                    item.isChecked = true;
                    $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                }
                if ($scope.userLoginDetails.RoleID !== 62 && $scope.userLoginDetails.RoleID !== 63 && $scope.userLoginDetails.RoleID !== 68 && $scope.userLoginDetails.RoleID !== 66 && $scope.userLoginDetails.RoleID !== 67) {
                    item.isChecked = true;
                }
            });
        }

        if ($scope.appointmentTypes.length > 0) {
            if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43 || $scope.userLoginDetails.RoleID == 10) {
                angular.forEach($scope.appointmentTypes, function (mitem) {
                    mitem.isChecked = false;
                    if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
                        if (mitem.Id == 1 || mitem.Id == 2 || mitem.Id == 3 || mitem.Id == 4) {
                            mitem.isChecked = true;
                        }
                    }
                    if ($scope.userLoginDetails.RoleID == 10) {
                        if (mitem.Id == 5 || mitem.Id == 1 || mitem.Id == 2 || mitem.Id == 3 || mitem.Id == 4 || mitem.Id == 6 || mitem.Id == 7) {
                            mitem.isChecked = true;
                        }
                    }
                    if ($scope.userLoginDetails.RoleID == 18) {
                        //  if (mitem.Id == 6) {
                        mitem.isChecked = true;
                        // }
                    }

                });
                $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;
                $scope.selectVisitType = 'All Visit Types';
                if ($scope.userLoginDetails.RoleID == 1) {
                    $scope.selectVisitType = "All";
                }
            } else if ($scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63) {
                angular.forEach($scope.appointmentTypes, function (mitem) {
                    mitem.isChecked = false;
                    if (mitem.Id !== 4 && mitem.Id !== 6) {
                        mitem.isChecked = true;
                    }
                });
                $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;

            } else if ($scope.userLoginDetails.RoleID === 68) {
                angular.forEach($scope.appointmentTypes, function (mitem) {
                    mitem.isChecked = false;
                    if (mitem.Id !== 5 && mitem.Id !== 6) {
                        mitem.isChecked = true;
                    }
                });
                $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;
            } else if ($scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67) {
                angular.forEach($scope.appointmentTypes, function (mitem) {
                    mitem.isChecked = false;
                    if (mitem.Id === 4 || mitem.Id === 6) {
                        mitem.isChecked = true;
                    }
                });
                $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = false;

            } else {
                angular.forEach($scope.appointmentTypes, function (mitem) {
                    mitem.isChecked = true;
                });
                $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = true;
                $scope.selectVisitType = "All";
            }
        }
        $scope.CalenderObj.IsConfirmedAppointment = false;

        if ($scope.selectedLoginDoctor.DoctorID != 0 && $scope.selectedLoginDoctor.DoctorID != undefined) {
            $scope.selectedDoctor = $scope.selectedLoginDoctor;
            $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        } else {
            $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        }



        if ($scope.mainAppointmentView.isCalendarorList === "calendar") {
            if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43) {
                $scope.mainCalendarView.MainTab = 1;
            } else {
                $scope.mainCalendarView.MainTab = 2;
            }

            if ($scope.mainCalendarView.MainTab === 1) {
                if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43) {
                    if ($scope.selectedLoginDoctor !== "") {
                        $scope.SelectSlotDuration = '00:' + $scope.selectedLoginDoctor.MinPerCase;
                    } else {
                        $scope.SelectSlotDuration = '00:20';
                    }
                    onclick();

                    $scope.GetDoctorAppointmentVisitReasons();
                }
            }
        }

        datapersistanceFactory.set("SingleDoctorcalendar", "");

        $scope.evencalobj.IsShow = false;
    };
    //$scope.$on('NewOpListTabActive', function (event, data) {
    //    console.log(data);


    //    $scope.changeApptMainviewTab(data.response);
    //});

    $scope.mainCalendarView = {
        "MainTab": 1,
        "AllDoctorscheck": true
    };
    $scope.activeEvent = 'day';
    $scope.SelectedDoctorcalendar = 'singleDoctor';





    $scope.changeDoctorviewTab = function (pageno) {

        $scope.mainCalendarView.MainTab = pageno;
        if ($scope.mainCalendarView.MainTab == 1) {
            $scope.activeEvent = 'day';
            $scope.SelectedDoctorcalendar = 'singleDoctor';

            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });

            $scope.selectedVisitReason = 'All Visit Reasons';
            $scope.AllDoctorsObj.AllVisitReasonsCheck = true;

            var emptyARray = [];
            eHnoteMasterDataService.addCalendarDoctorinAppList(emptyARray);

            if ($scope.selectedLoginDoctor.DoctorID != 0 && $scope.selectedLoginDoctor.DoctorID != undefined) {
                $scope.selectedDoctor = $scope.selectedLoginDoctor;
                $scope.loadAppointments($scope.selectedDoctor, '');
            } else {
                $scope.loadAppointments($scope.selectedDoctor, '');
            }
            $scope.doctoApptVistObj.AllReasonscheck = false;
            $scope.doctoApptVistObj.IsShowDoctorVisit = false;


            $scope.GetDoctorAppointmentVisitReasons();
            $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);

        } else {

            angular.forEach($scope.Calendardoctorlist1, function (citem, $index) {
                citem.id = citem.DoctorID;
                citem.title = citem.UserFullName;
                citem.isChecked = true;
            });
            $scope.mainCalendarView.AllDoctorscheck = true;
            $scope.SearchObj.ConsultationDt = moment().format("DD-MMM-YYYY");

            eHnoteMasterDataService.addCalendarDoctorinAppList($scope.Calendardoctorlist1);

            $scope.DoctorAppointmentVisitReasons = [];
            $scope.doctoApptVistObj.AllReasonscheck = false;
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });

            $scope.selectedVisitReason = 'All Visit Reasons';
            $scope.AllDoctorsObj.AllVisitReasonsCheck = true;

            /*    $scope.$broadcast('EventFromParent');*/

            //$scope.$on("reshedulesuccessMethod", function (event, data) {
            //    SetupPopUp.dismiss('cancel');
            //    eHnoteMasterDataService.addSelectedDoctorinAppList("");
            //    eHnoteMasterDataService.addSelectedHospitalinAppList("");

            //    $scope.loadAppointments($scope.selectedDoctor, '');
            //});
            $scope.calendarView2 = "day";
        }
        $scope.evencalobj.IsShow = false;

        $scope.clearEventSelectedSlots();
        $scope.clearSelectedSlots();
        $scope.clearBreakDetails();
    };
    onclick();



    $scope.checkAll = function (val) {
        if (val) {
            angular.forEach($scope.Calendardoctorlist1, function (item) {
                item.isChecked = true;
            });
        } else {
            angular.forEach($scope.Calendardoctorlist1, function (item) {
                item.isChecked = false;
            });
        }

        var checkedArray = _.where($scope.Calendardoctorlist1, { isChecked: true });
        checkedArray = checkedArray || [];
        $scope.mainCalendarView.AllDoctorscheck = false;

        if (checkedArray.length === $scope.Calendardoctorlist1.length) {
            $scope.mainCalendarView.AllDoctorscheck = true;
        }
    };


    $scope.filterSelectedDoctorsonCalendar = function () {
        var temarray = [];

        temarray = $filter("filter")($scope.Calendardoctorlist1, function (item) { return item.isChecked === true }, true);
        temarray = temarray || [];
        $scope.ShowFilterView = true;

        eHnoteMasterDataService.addCalendarDoctorinAppList(temarray);

        var obj = {
            "SelectedDoctorsList": temarray || [],
            "OPFromDate": ''
        };
        eHnoteMasterDataService.addSelectedCRMRemindersDoctors(obj);

        $scope.$broadcast('allCalendarView');






        var checkedArray = _.where($scope.Calendardoctorlist1, { isChecked: true });
        checkedArray = checkedArray || [];
        if (checkedArray.length === 1) {
            $scope.doctoApptVistObj.IsShowDoctorVisit = true;
            $scope.selectedDoctor = checkedArray[0];

            console.log($scope.selectedDoctor);

            /* $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);*/

            $scope.GetDoctorAppointmentVisitReasons();
        } else {
            $scope.doctoApptVistObj.IsShowDoctorVisit = false;
            $scope.DoctorAppointmentVisitReasons = [];
        }

    }


    $scope.toggleallDoctorsCalendar = function (item) {
        var checkedArray = _.where($scope.Calendardoctorlist1, { isChecked: true });
        checkedArray = checkedArray || [];
        $scope.mainCalendarView.AllDoctorscheck = false;



        if (checkedArray.length === $scope.Calendardoctorlist1.length) {
            $scope.mainCalendarView.AllDoctorscheck = true;
        }

        if (checkedArray.length === 1) {
            $scope.doctoApptVistObj.IsShowDoctorVisit = true;
            $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);


        } else {
            $scope.doctoApptVistObj.IsShowDoctorVisit = false;
            $scope.DoctorAppointmentVisitReasons = [];
        }
    }

    $scope.changeCalendarDatefullCalendar = function (date) {



        $scope.SearchObj.ConsultationDt = $filter("date")(new Date(date), "MM-dd-yyyy");;


        console.log($scope.mainCalendarView.MainTab + "__mainCalendarView.MainTab");
        if ($scope.mainCalendarView.MainTab == 1) {
            // $scope.activeEvent = 'day';
            $scope.loadCalenderEvent('day');
            $scope.calendarView = 'day';

            $scope.SelectedDoctorcalendar = 'singleDoctor';
            $scope.viewDate = new Date(date);
            $scope.loadAppointments($scope.selectedDoctor, '');

        } else {

            $scope.$broadcast('allCalendarView');
        }
    }



    $scope.selectedCalendarDate = new Date();
    var myFutureDate = new Date($scope.selectedCalendarDate);
    myFutureDate.setDate(myFutureDate.getDate() + 90);
    $scope.selectedCalendarMaxDate = myFutureDate;


    $scope.clear = function () {
        $scope.selectedCalendarDate = null;
    };
    $scope.jscalendaroptions = {
        customClass: getDayClass,
        minDate: new Date(),
        maxDate: myFutureDate,
        showWeeks: false
    };





    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.jscalendaroptions.minDate = $scope.jscalendaroptions.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.setDate = function (year, month, day) {
        $scope.selectedCalendarDate = new Date(year, month, day);
    };



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


    $scope.doctorslist = {
        "SearchText": ""

    }



    $scope.Changedtr = function (sitem) {
        angular.forEach($scope.Calendardoctorlist1, function (zitem) {
            if (sitem.DoctorID === zitem.DoctorID) {
                zitem.isChecked = true;
                $scope.mainCalendarView.AllDoctorscheck = false;
            }
            else {
                zitem.isChecked = false;
            }
        });


    }


    $scope.changeclear = function (mitem) {
        mitem = mitem || "";
        if (mitem == "") {
            angular.forEach($scope.Calendardoctorlist1, function (item) {
                item.isChecked = true;
                $scope.mainCalendarView.AllDoctorscheck = true;
            });

        }

    }

    $scope.CancelAppointmentobj = {
        "Ispopup": false,
        "CancelAppReason": [],
        "sendDocSms": false,
        "sendPatientSms": false,
        "sendDocEmail": false,
        "sendPatientEmail": false,
        "CancelReason": "",
        "OtherCancelReason": ""
    };

    $scope.getUserBranchSlotRestrictionForCalender = function (DoctorID, date) {
        var SelectedDoctorId = parseInt(DoctorID);
        var DoctorObj = $filter("filter")($scope.Calendardoctorlist1, function (item, index) { return item.DoctorID === SelectedDoctorId; }, true) || [];

        var SelectedUserBranchId = null;
        if (DoctorObj.length > 0) {
            SelectedUserBranchId = parseInt(DoctorObj[0].UserBranchId);
        }

        var GivenDate = moment(date).format('YYYY-MM-DD');

        var appointmentDate = GivenDate;
        var params = {
            "DoctorId": SelectedDoctorId,
            "UserBranchId": SelectedUserBranchId,
            "Date": appointmentDate
        }
        eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccesscalender, OnGetErrorcalender);
        function OnGetSuccesscalender(response) {
            console.log(JSON.stringify(response));
            if (response.status === 'Success') {
                angular.forEach(response.NormalSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                });
                angular.forEach(response.TeleSlots, function (item) {
                    item.StartTime = item.StartTime.substring(0, 5);
                });
                //  reStructureDoctorSelectedSlotsForCalender(response, date);
                newreStructureDoctorSelectedSlotsForCalender(response, date);
            }

        }
        function OnGetErrorcalender(response) {
        }
    };

    function reStructureDoctorSelectedSlotsForCalender(resp, date) {
        if (resp.IsLeave) {
            alertify.error("Doctor is on Leave.Please choose another doctor");
            return true;
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

        var VisitTypeId = $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3;
        $scope.RestrictSlotsUserConsultation = [];

        angular.forEach(resp.UserConsultation, function (item) {
            //  if (item.VisitType === 1 || item.VisitType === 3) {
            if (item.VisitType === VisitTypeId) {
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
                    $scope.timeslots.push(slotObj);
                }
                if ($scope.iscurrentDate === true) {
                    $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                }

                $scope.RestrictSlotsUserConsultation.push(item);
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
            } else {
                alertify.error("Doctor Slot is not available.Please choose another doctor");
                $scope.PopupRestriction = true;
                return true;
            }

            $scope.OverAllStartTime = "";
            $scope.OverAllEndTime = "";

            angular.forEach($scope.RestrictSlotsUserConsultation, function (ritem, index) {
                if (index === 0) {
                    $scope.OverAllStartTime = ritem.StartTime;
                    $scope.OverAllEndTime = ritem.EndTime;
                } else {
                    $scope.OverAllEndTime = ritem.EndTime;
                }
            });
            var start1 = date.format('HH:mm:ss');
            var startTime = start1.replaceAll(":", "");
            $scope.OverAllStartTime = $scope.OverAllStartTime.replaceAll(":", "");
            $scope.OverAllEndTime = $scope.OverAllEndTime.replaceAll(":", "");

            if ((parseInt($scope.OverAllStartTime) <= parseInt(startTime)) && (parseInt(startTime) < parseInt($scope.OverAllEndTime))) {

            } else {
                // alertify.error("Slots is not available");
                $scope.PopupRestriction = true;
                return true;
            }


        } else {
            alertify.error("Doctor is not available.Please choose another doctor");
            $scope.PopupRestriction = true;
            return true;
        }


    }

    function newreStructureDoctorSelectedSlotsForCalender(resp, date) {
        //if (resp.IsLeave) {
        //    alertify.error("Doctor is on Leave.Please choose another doctor");
        //    return true;
        //}

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

        var VisitTypeId = $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3;
        $scope.RestrictSlotsUserConsultation = [];

        angular.forEach(resp.UserConsultation, function (item) {
            //  if (item.VisitType === 1 || item.VisitType === 3) {
            if (item.VisitType === VisitTypeId) {
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
                    $scope.timeslots.push(slotObj);
                }
                if ($scope.iscurrentDate === true) {
                    $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                }

                $scope.RestrictSlotsUserConsultation.push(item);
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
            } else {
                alertify.error("Doctor Slot is not available.Please choose another doctor");
                $scope.PopupRestriction = true;
                return true;
            }

            $scope.OverAllStartTime = "";
            $scope.OverAllEndTime = "";

            angular.forEach($scope.RestrictSlotsUserConsultation, function (ritem, index) {
                if (index === 0) {
                    $scope.OverAllStartTime = ritem.StartTime;
                    $scope.OverAllEndTime = ritem.EndTime;
                } else {
                    $scope.OverAllEndTime = ritem.EndTime;
                }
            });
            var start1 = date.format('HH:mm:ss');
            var startTime = start1.replaceAll(":", "");
            $scope.OverAllStartTime = $scope.OverAllStartTime.replaceAll(":", "");
            $scope.OverAllEndTime = $scope.OverAllEndTime.replaceAll(":", "");

            if ((parseInt($scope.OverAllStartTime) <= parseInt(startTime)) && (parseInt(startTime) < parseInt($scope.OverAllEndTime))) {

            } else {
                // alertify.error("Slots is not available");
                $scope.PopupRestriction = true;
                return true;
            }


        } else {
            alertify.error("Doctor is not available.Please choose another doctor");
            $scope.PopupRestriction = true;
            return true;
        }


    }


    $scope.SelectedAppointmentPatient = function (patientitem) {
        console.log(patientitem);
        $scope.SearchObj.PatientId = patientitem.PatientId;
        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        $scope.AppointmentPatientListArray = [];
    };

    $scope.clearPatientApptSearch = function () {
        // $scope.AppointmentPatientListArray = [];
        $scope.SearchObj.PatientId = 0;
        $scope.SearchObj.searchPatientIdTxt = "";
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchPatientfilter.IsPatientNameInd = false;
        $scope.SearchPatientfilter.PaientMRNO = "";
        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
    };

    $scope.SelectedBookingTypeObj = {
        "WalkIn": false
    };
    $scope.changeWalkInSlot = function (checked) {

    }


    $scope.callCurrentPatienttoUser = function (row) {
        row.IsPatientCallActive = !row.IsPatientCallActive;

        if (row.TrackerDetails.length > 0) {

            var cRoomId = row.TrackerDetails[0].RoomId;
            var cRoomTypeId = row.TrackerDetails[0].RoomTypeId;
            var cAppointmentTrackerDetailId = row.TrackerDetails[0].AppointmentTrackerDetailId;


            var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": row.AppointmentID,
                "AppointmentTrackerDetailId": cAppointmentTrackerDetailId,
                "RoomTypeId": cRoomTypeId,
                "RoomId": $scope.queueSettingObj.RoomId,
                "RoleId": $scope.userLoginDetails.RoleID,
                "CurrentTime": CurrentTime,
                "IsRollBack": "N"
            }
            eHnoteMainAppointmentService.UpdatePatientUserCallStatus(params, OnGetSuccesscalender, OnGetErrorcalender);
            function OnGetSuccesscalender(response) {
                console.log(JSON.stringify(response));
                if (response.status === 'Success') {
                    $scope.loadAppointments($scope.selectedDoctor, '');
                }

            }
            function OnGetErrorcalender(response) {
            }
        }


    };


    $scope.recallCurrentPatienttoUser = function (row) {
        row.IsPatientCallActive = !row.IsPatientCallActive;

        if (row.TrackerDetails.length > 0) {

            var cRoomId = row.TrackerDetails[0].RoomId;
            var cRoomTypeId = row.TrackerDetails[0].RoomTypeId;
            var cAppointmentTrackerDetailId = row.TrackerDetails[0].AppointmentTrackerDetailId;


            var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": row.AppointmentID,
                "AppointmentTrackerDetailId": cAppointmentTrackerDetailId,
                "RoomTypeId": cRoomTypeId,
                "RoomId": $scope.queueSettingObj.RoomId,
                "RoleId": $scope.userLoginDetails.RoleID,
                "CurrentTime": CurrentTime,
                "IsRollBack": "Y"
            }
            eHnoteMainAppointmentService.UpdatePatientUserCallStatus(params, OnGetSuccesscalender, OnGetErrorcalender);
            function OnGetSuccesscalender(response) {
                console.log(JSON.stringify(response));
                if (response.status === 'Success') {

                    $scope.loadAppointments($scope.selectedDoctor, '');
                }

            }
            function OnGetErrorcalender(response) {
            }
        }
    }

    if (doctorInfo.doctordata.User.length > 0) {
        $scope.userLoginDetails.SuffixId = doctorInfo.doctordata.User[0].SuffixId || 0;
    }

    $scope.selectedVisitReason = "All Visit Reasons";
    $scope.selectedDoctors = "All";
    //$scope.AllVisitReasonsCheck = true;
    //$scope.AllDoctorCheck = true;

    if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
        $scope.AllDoctorsObj.AllDoctorCheck = false;
    }
    else {
        $scope.AllDoctorsObj.AllDoctorCheck = true;
    }

    //$scope.GetVisitReasonsNew = function () {
    //    var getParams = {
    //        // "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
    //        "OrganizationId": $scope.HospitalId,
    //        "ReasonTypeId": 1
    //    };
    //    eHnotePatientVisitReasonServices.getVisitReasonServicesList(getParams).then(function (resp) {
    //        if (resp.data !== undefined) {
    //            if (resp.data.rows.length > 0) {
    //                $scope.Visitreasons = resp.data.rows;
    //                angular.forEach($scope.Visitreasons, function (item) {
    //                    item.isChecked = true;
    //                });
    //            }

    //        }
    //   });

    //};
    //$scope.GetVisitReasonsNew();

    $scope.GetVisitReasonsNew = function () {
        var locationIds = $scope.AppListdoctoraddress.filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");

        var obj = {
            "OrganizationId": locationIds,
            "UserId": doctorinfo.doctorid,
            "VisitTypeId": 0,
            "visitReasonSearch": "",
            "PageNumber": 1,
            "PageSize": 1000,
            "IsFrequent": "N"
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj).then(function (resp) {
            //$scope.Visitreasons = resp.data.rows;
            //$scope.Visitreasons = resp.data.count;
            $scope.Visitreasons = [];
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.Visitreasons = resp.data.rows;
                    angular.forEach($scope.Visitreasons, function (item) {
                        if (item.VisitTypeId !== 4 && item.VisitTypeId !== 14 && item.VisitTypeId !== 6 && ($scope.userLoginDetails.RoleID === 62 || $scope.userLoginDetails.RoleID === 63)) {
                            item.isChecked = true;
                            $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                        }
                        if (item.VisitTypeId !== 5 && item.VisitTypeId !== 6 && ($scope.userLoginDetails.RoleID === 68)) {
                            item.isChecked = true;
                            $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                        }
                        if ((item.VisitTypeId === 4 || item.VisitTypeId === 14 || item.VisitTypeId === 6) && ($scope.userLoginDetails.RoleID === 66 || $scope.userLoginDetails.RoleID === 67)) {
                            item.isChecked = true;
                            $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
                        }
                        if ($scope.userLoginDetails.RoleID !== 62 && $scope.userLoginDetails.RoleID !== 63 && $scope.userLoginDetails.RoleID !== 68 && $scope.userLoginDetails.RoleID !== 66 && $scope.userLoginDetails.RoleID !== 67) {
                            item.isChecked = true;
                        }


                    });
                }

            }
        });
    };
    $scope.GetVisitReasonsNew();

    $scope.checkAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctors = 'All';
        } else {
            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                item.isChecked = false;
            });

            $scope.selectedDoctors = 'Select Doctors';
        }
        var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;

    };

    $scope.checkAllUsers = function (val) {
        if (val) {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = true;
            });

            $scope.selectedUsers = 'All';
        } else {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = false;
            });

            $scope.selectedUsers = 'Select Users';
        }
        var checkedArray = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.SearchObj.AllUsersCheck = checkedArray.length > 0 && $scope.MultiselectUserlist.length === checkedArray.length ? true : false;

    };

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
        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;



    };



    $scope.VisitRsnToggle = function (item) {
        var checkedArray1 = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray1.length > 0 && $scope.Visitreasons.length === checkedArray1.length ? true : false;
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

    $scope.DoctorToggle = function (item) {
        var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDoctors = "Selected Doctors";
            }
        }

    };

    $scope.UsersToggle = function (item) {
        var checkedArray = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.SearchObj.AllUsersCheck = checkedArray.length > 0 && $scope.MultiselectUserlist.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedUsers = "Select User";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedUsers = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                if ($scope.SearchObj.AllUsersCheck) {
                    $scope.selectedUsers = "All";
                } else {
                    $scope.selectedUsers = "Selected Users";
                }
            }
        }

    };

    $scope.ChangeSubTabRefreshBarandTopbarCount = function () {
        var subList = "";
        for (var i in $scope.allSubSpecializationsArray) {
            if ($scope.allSubSpecializationsArray[i].isChecked) {
                subList += "," + $scope.allSubSpecializationsArray[i].SubSpecializationId;
            }
        }
        if (subList.charAt(0) === ",") {
            subList = subList.slice(1);
        }
        var consultdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");
        var params = "";

        if ($scope.selectedDoctor.UserBranchId === 0) {
            params = {
                "HospitalID": $scope.HospitalId,
                "ConsultationDt": consultdate,
                "PageSize": $scope.Pagination.Patientitemsperpage,
                "PageNumber": $scope.Pagination.currentPagePatient,
                "SearchText": $scope.SearchObj.searchPatientTxt ? $scope.SearchObj.searchPatientTxt : "",
                "SearchPatientId": $scope.SearchObj.searchPatientIdTxt ? $scope.SearchObj.searchPatientIdTxt : "",
                "RoleId": $scope.userLoginDetails.RoleID,
                "SortType": $scope.SortType,
                "SortBy": $scope.SortBy,
                "SpecializationId": $scope.selectedSpecializationId,
                "SubSpecializationIds": subList,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PatientId": $scope.SearchObj.PatientId || 0

            };
        }
        else {
            params = {
                "UserBranchId": $scope.selectedDoctor.UserBranchId,
                "DoctorID": $scope.selectedDoctor.DoctorID,
                "ConsultationDt": consultdate,
                "HospitalID": $scope.HospitalId,
                "PageSize": $scope.Pagination.Patientitemsperpage,
                "PageNumber": $scope.Pagination.currentPagePatient,
                "SearchText": $scope.SearchObj.searchPatientTxt ? $scope.SearchObj.searchPatientTxt : "",
                "SearchPatientId": $scope.SearchObj.searchPatientIdTxt ? $scope.SearchObj.searchPatientIdTxt : "",
                "RoleId": $scope.userLoginDetails.RoleID,
                "SortType": $scope.SortType,
                "SortBy": $scope.SortBy,
                "SpecializationId": $scope.selectedSpecializationId,
                "SubSpecializationIds": subList,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PatientId": $scope.SearchObj.PatientId || 0
            };
        }

        var newlist1 = "";
        for (var i in $scope.AppointmentStatusFilterArray) {
            if ($scope.AppointmentStatusFilterArray[i].isChecked) {
                newlist1 += "," + $scope.AppointmentStatusFilterArray[i].Id;
            }
        }
        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        var newlist2 = "";
        for (var i in $scope.AppointmentVisitFilterArray) {
            if ($scope.AppointmentVisitFilterArray[i].isChecked) {
                newlist2 += "," + $scope.AppointmentVisitFilterArray[i].Id;
            }
        }
        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }
        var newlist3 = "";
        for (var i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist3 += "," + $scope.appointmentTypes[i].Id;
            }
        }
        if (newlist3.charAt(0) === ",") {
            newlist3 = newlist3.slice(1);
        }

        var newlist4 = "";
        for (var i in $scope.CheckInFilterArray) {
            if ($scope.CheckInFilterArray[i].isChecked) {
                newlist4 += "," + $scope.CheckInFilterArray[i].Id;
            }
        }
        if (newlist4.charAt(0) === ",") {
            newlist4 = newlist4.slice(1);
        }
        var newlist5 = "";
        for (var i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist5 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (newlist5.charAt(0) === ",") {
            newlist5 = newlist5.slice(1);
        }


        var newlist6 = "";
        for (var i in $scope.MultiselectDoctorlist) {
            if ($scope.MultiselectDoctorlist[i].isChecked) {
                newlist6 += "," + $scope.MultiselectDoctorlist[i].DoctorID;
            }
        }
        if (newlist6.charAt(0) === ",") {
            newlist6 = newlist6.slice(1);
        }

        params.AppointmentStatusIDLst = newlist1;
        params.VisitStatusIDLst = newlist2;
        params.AppointmentTypeStatusIDList = newlist3;
        params.CheckInStatusIDList = newlist4;
        params.VisitReasonIdList = newlist5;
        params.DoctorIds = newlist6;
        params.GetAllAppointmentStatusInd = $scope.AllAppointmentStatusCheck;
        params.GetAllVisitStatusInd = $scope.AllAppointmentVisitStatusCheck;
        params.GetAllAppointmentTypeStatusInd = $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck;
        params.GetAllCheckInStatusInd = $scope.AllCheckInStatusCheck;
        params.StatusId = $scope.SelectedStatus.StatusId;

        eHnoteMainAppointmentService.GetPatientDynamicStatusForAppointmentList(params).then(function (resp) {
            if (resp.data.length !== 0) {
                $scope.DynamicStatusCountList = resp.data || [];

                if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 43) {
                    var obj = {
                        "selectedDoctor": {
                            "DoctorID": doctorinfo.doctorid
                        }
                    }
                    $rootScope.$broadcast("AppointmentTypefilter", obj);
                } else {
                    var obj = {
                        "selectedDoctor": {
                            "DoctorID": 0
                        }
                    }
                    $rootScope.$broadcast("AppointmentTypefilter", obj);
                }

            }
        }, function (error) {
            console.log(error);
        });


    };



    $scope.HospitalEquipmentList = [];
    $scope.ApptObj = {
        "HospitalEquipmentId": 0, "VisitTypeId": 0,
        "AppointmentTypeId": 1
    };


    $scope.GetAllHospitalEquipments = function () {
        //var obj = {
        //    "ParentOrganizationId": $scope.ParenthospitalId
        //}
        $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
        eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.HospitalEquipmentList = resp.data.rows || [];
                $scope.PatientTagList1 = $scope.HospitalEquipmentList || [];
                angular.forEach($scope.PatientTagList1, function (item) {
                    item.IsChecked = false;
                });
                //$scope.HospitalEquipmentList = $filter("filter")($scope.HospitalEquipmentList, function (Nitem) {
                //    return Nitem.HospitalEquipmentId === 1 || Nitem.HospitalEquipmentId === 4;
                //}) || [];

            }
        });
    };
    $scope.GetAllHospitalEquipments();

    $scope.ChangeHospitalEquipment = function (item) {
        item = item || "";
        $scope.HospitalEquipmentId = item || "";
    }

    $scope.onothervisitrsn = function (item) {
        item = item || "";
        if (item.ReasonId !== "") {
            $scope.checkInObj.VisitReason = item.Reason;
            $scope.ApptObj.VisitTypeId = item.ReasonId;
        }
    };



    //function GetNewPrintPatientObj() {
    //    var obj = {
    //        "AppointmentTime": "",
    //        "PatientName": "",
    //        "DOB": "",
    //        "Age": "",
    //        "MRNumber": "",
    //        "MobileNumber": "",
    //        "DoctorName": "",
    //        "VisitReason": "",
    //        "AppointmentStatus": "",
    //        "PatientDetailsArray":item
    //    }
    //    return obj;
    //}


    //$scope.PrintPatientObj = GetNewPrintPatientObj();


    $scope.$on("changePrintAnother", function (event, item) {

        var printobj = {
            "PatientAppointmentDetails": $scope.BookedAppointmentList || []

        }
        eHnotePrintService.generatePatientDetailsPrintus(printobj);

    });


    $scope.continuetoBookAppointment = function (info) {





        var calenderDate = info.date.format('DD-MMM-YYYY' + ' ' + info.StartTime);
        var calenderDate1 = info.date.format('DD-MMM-YYYY' + ' ' + info.EndTime);
        var startTime1 = info.date.format('HH:mm');
        var start1 = startTime1.replaceAll(":", "");

        var getDate = info.date.format('DD-MMM-YYYY');
        var date1 = new Date(calenderDate);
        var date2 = new Date(calenderDate1);

        var OverAllStartTime1 = $scope.CalenderDoctorAvailableSlots.StartTime.replaceAll(":", "");
        var OverAllEndTime1 = $scope.CalenderDoctorAvailableSlots.EndTime.replaceAll(":", "");

        angular.forEach($scope.UserAvailableSlots, function (item) {
            angular.forEach(item.ScheduleVisitTypeDetails, function (kitem) {
                let startTime = kitem.StartTime.replace(":", "");
                let endTime = kitem.EndTime.replace(":", "");
                let startTime1 = $filter('date')(new Date(calenderDate), "HH:mm");
                let endTime1 = $filter('date')(new Date(calenderDate1), "HH:mm");
                startTime1 = startTime1.replace(":", "");
                endTime1 = endTime1.replace(":", "");
                if (startTime1 >= startTime && startTime1 < endTime) {
                    $rootScope.appointment_type = kitem.VisitTypeId.toString();
                }
            });
        });

        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
            function getMinutesBetweenDates(startDate, endDate) {
                var diff = endDate.getTime() - startDate.getTime();
                return (diff / 60000);
            }
            var minutes = getMinutesBetweenDates(date1, date2);
            $scope.selectedLoginDoctor.MinPerCase = $scope.selectedLoginDoctor.MinPerCase || 0;
            var obj = {
                'IsComingFrom': 'Doctorcalendar',
                //'MinPerCaseval': minutes != 0 ? minutes : $scope.selectedLoginDoctor.MinPerCase,
                'MinPerCaseval': $scope.selectedLoginDoctor.MinPerCase != 0 ? $scope.selectedLoginDoctor.MinPerCase : (minutes != 0 ? minutes : 20),
                'Starttime': calenderDate,
                'Endtime': calenderDate1,
                'GetDate': getDate,
                'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                'AppointmentTypeId': $rootScope.appointment_type,
                'OutOfBusinessTime': false
            }
            datapersistanceFactory.set("SingleDoctorcalendar", obj);

            $scope.PageName = 'book';
            var time = info.date.format('HH:mm');
            $scope.ispatientExistsval = false;
            $scope.calenderDate = info.date.format('DD-MMM-YYYY' + time);
            var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
            var doctorID = {
                "DoctorID": doctorInfo.doctorid
            };

            if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57 || doctorInfo.RoleID === 18) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            } else if (doctorInfo.RoleID === 1 || doctorInfo.RoleID === 56) {
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            } else {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            }

            $scope.cacheStorageItem.VisitRemarks = $scope.cacheStorageItem.VisitRemarks || "";
            if ($scope.cacheStorageItem.VisitRemarks != "") {
                $scope.cacheStorageItem.VisitRemarks = "";
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
            else {
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }

            $scope.AppDate = "";
            //  openAppPopup();

            BookApptPopupOpened();
        }
    };

    $scope.continuetoBookAppointment1 = function (info) {




        var calenderDate = moment(info.date).format('DD-MMM-YYYY' + ' ' + info.StartTime);
        var calenderDate1 = moment(info.date).format('DD-MMM-YYYY' + ' ' + info.EndTime);
        var startTime1 = $filter("date")(new Date(calenderDate), "HH:mm");
        var start1 = startTime1.replaceAll(":", "");
        var getDate = moment(info.date).format('DD-MMM-YYYY');
        var date1 = new Date(calenderDate);
        var date2 = new Date(calenderDate1);

        var OverAllStartTime1 = $scope.CalenderDoctorAvailableSlots.StartTime.replaceAll(":", "");
        var OverAllEndTime1 = $scope.CalenderDoctorAvailableSlots.EndTime.replaceAll(":", "");
        $scope.appointment_type = '';
        angular.forEach($scope.UserAvailableSlots, function (item) {
            angular.forEach(item.ScheduleVisitTypeDetails, function (kitem) {
                let startTime = kitem.StartTime.replace(":", "");
                let endTime = kitem.EndTime.replace(":", "");
                let startTime1 = $filter('date')(new Date(calenderDate), "HH:mm");
                let endTime1 = $filter('date')(new Date(calenderDate1), "HH:mm");
                startTime1 = startTime1.replace(":", "");
                endTime1 = endTime1.replace(":", "");
                if (startTime1 >= startTime && startTime1 < endTime) {
                    $scope.appointment_type = kitem.VisitTypeId.toString();
                }
            });
        });

        if ((parseInt(OverAllStartTime1) <= parseInt(start1)) && (parseInt(start1) < parseInt(OverAllEndTime1))) {
            function getMinutesBetweenDates(startDate, endDate) {
                var diff = endDate.getTime() - startDate.getTime();
                return (diff / 60000);
            }
            var minutes = getMinutesBetweenDates(date1, date2);
            $scope.selectedLoginDoctor.MinPerCase = $scope.selectedLoginDoctor.MinPerCase || 0;
            var obj = {
                'IsComingFrom': 'Doctorcalendar',
                'MinPerCaseval': $scope.selectedLoginDoctor.MinPerCase != 0 ? $scope.selectedLoginDoctor.MinPerCase : (minutes != 0 ? minutes : 20),
                'Starttime': calenderDate,
                'Endtime': calenderDate1,
                'GetDate': getDate,
                'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
                'AppointmentTypeId': $scope.appointment_type,
                'OutOfBusinessTime': false
            }
            datapersistanceFactory.set("SingleDoctorcalendar", obj);

            $scope.PageName = 'book';

            var time = $filter("date")(new Date(calenderDate), "HH:mm");

            $scope.ispatientExistsval = false;
            $scope.calenderDate = moment(info.date).format('DD-MMM-YYYY' + time);
            var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
            var doctorID = {
                "DoctorID": doctorInfo.doctorid
            };

            if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57 || doctorInfo.RoleID === 18) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            } else if (doctorInfo.RoleID === 1 || doctorInfo.RoleID === 56) {
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            } else {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            }

            $scope.cacheStorageItem.VisitRemarks = $scope.cacheStorageItem.VisitRemarks || "";
            if ($scope.cacheStorageItem.VisitRemarks != "") {
                $scope.cacheStorageItem.VisitRemarks = "";
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
            else {
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }

            $scope.AppDate = "";
            //  openAppPopup();
            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": $scope.ispatientExistsval || false,
                "calenderDate": $scope.calenderDate
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);
            BookApptPopupOpened();
        }
    };

    $scope.bookAppointmentForSelectedSlots = function (obj) {
        $scope.continuetoBookAppointment1(obj);
    };

    $scope.clearSelectedSlots = function () {

        $scope.calobj.IsShow = false;
        $scope.calobj.StartTime = "";
        $scope.calobj.EndTime = "";
        $scope.calobj.NewStartTime = "";
        $scope.calobj.NewEndTime = "";
        $scope.calobj.DoctorId = "";
        $scope.calobj.DoctorName = "";
        $scope.calobj.infoobj = "";
        $scope.calobj.date = "";
        $scope.calobj.HospitalId = "";
    };
    $scope.clearEventSelectedSlots = function () {

        $scope.evencalobj.IsShow = false;
        $scope.evencalobj.StartTime = "";
        $scope.evencalobj.EndTime = "";
        $scope.evencalobj.DoctorId = "";
        $scope.evencalobj.DoctorName = "";
        $scope.evencalobj.infoobj = "";
        $scope.evencalobj.PatientName = "";
        $scope.evencalobj.date = "";
        $scope.evencalobj.HospitalId = "";
    };

    $scope.clearBreakDetails = function () {
        $scope.BreakEventObj.IsShow = false;
        $scope.BreakEventObj.StartTime = "";
        $scope.BreakEventObj.EndTime = "";
        $scope.BreakEventObj.DoctorId = "";
        $scope.BreakEventObj.DoctorName = "";
        $scope.BreakEventObj.infoobj = "";
        $scope.BreakEventObj.date = "";
        $scope.BreakEventObj.HospitalId = "";
    };


    $scope.blocktheSelectedSlots = function (obj) {
        $scope.IsForAddingBreakSlot = true;
        $scope.SelectedReasonforBlockSlot = "";
        $scope.Remarks = "";
        let RemarksBoxInstance = $uibModal.open({
            "templateUrl": "BreakSlotsRemarksPopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            "controller": function ($scope, $uibModal, $uibModalInstance, obj) {
                $scope.closePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.continuetoBreakFromCalendarConfirm = function (info) {

                    var calenderDate = info.date.format('DD-MMM-YYYY') + ' ' + info.StartTime;
                    var calenderDate1 = info.date.format('DD-MMM-YYYY') + ' ' + info.EndTime;
                    let d = new Date(calenderDate);
                    let weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    let DayId = d.getDay();
                    let Day = weekArray[DayId];
                    let req = {
                        "UserId": $scope.UserId,
                        "DoctorId": doctorInfo.doctorid,
                        "BranchId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID,
                        "UserScheduleId": $scope.UserScheduleId,
                        "UserScheduleDetailId": $scope.UserScheduleDetailId,
                        "UserDayBreakSlotId": 0,
                        "StartTime": $filter('date')(new Date(calenderDate), "HH:mm"),
                        "EndTime": $filter('date')(new Date(calenderDate1), "HH:mm"),
                        "Date": $filter('date')(new Date(calenderDate), "yyyy-MM-dd"),
                        "DayId": DayId,
                        "Day": Day,
                        "Remarks": $scope.Remarks || "",
                        "IsAddBreakSlot": true,
                        "ReasonforBlockSlot": $scope.SelectedReasonforBlockSlot,
                        "DeleteInd": "N"
                    };
                    //console.log(req);
                    //return;
                    eHnoteMainAppointmentService.AddUpdateDoctorBreakSlot(req).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.loadCalenderEvent('day');
                            $scope.clearSelectedSlots();
                            $uibModalInstance.dismiss();
                        }
                        if (resp.data.Status === "Failure") {
                            alertify.error(resp.data.Message);
                        }
                    }, function (err) {
                        console.log(err);
                    });

                };
                $scope.SaveRemarksAndBlockSlot = function () {
                    if ($scope.SelectedReasonforBlockSlot === "") {
                        alertify.error("Please select the reason!");
                        return false;
                    }
                    $scope.continuetoBreakFromCalendarConfirm(obj);
                };
            },
            "resolve": {
                "obj": function () {
                    return obj;
                }
            }
        });


    }

    $scope.openAppointmentForSelectedSlots1 = function (info) {


        console.log(info.infoobj);
        $scope.event = {
            "AppointmentDetails": info.infoobj.AppointmentDetails,
            "DoctorID": info.infoobj.DoctorID,
            "ETime": info.infoobj.ETime,
            "STime": info.infoobj.STime,
            "startDate": info.infoobj.AppointmentDetails.startDate,
            "endDate": info.infoobj.AppointmentDetails.endDate,
            "eventDesc": info.infoobj.eventDesc,
            "eventInfo": info.infoobj.eventInfo,
            "eventTitle": info.infoobj.eventTitle,
            "eventVenue": info.infoobj.eventVenue,
            "patientID": info.infoobj.patientID,
            "patientendTime": info.infoobj.patientendTime,
            "patientstartTime": info.infoobj.patientstartTime,
            "rowData": info.infoobj.rowData,
            "doctorName": info.infoobj.AppointmentDetails.doctorInfo.doctorName,
            "EmailId": info.infoobj.AppointmentDetails.doctorInfo.EmailId,
            "doctorSpecialities": getDoctorSpecialities('calendar'),
            "doctorImage": "",
            "clinicDoctorList": $scope.clinicDoctorList,
            "source": {
                "action": "reschedule"
            }
        }


        //if ($scope.event.allDay && $scope.event.startDate !== $scope.event.endDate && $scope.event.end !== null) {
        //    $scope.event.endDate = moment($scope.event.endDate).subtract(1, 'days');
        //    $scope.event.end = moment($scope.event.end).subtract(1, 'days');
        //}
        eHnoteMasterDataService.addcalenderInfo($scope.event);

        var appoint_info = angular.copy(info.infoobj.AppointmentDetails);
        appoint_info.PatientID = appoint_info.patientInfo.patientID;
        appoint_info.PatientDetails = angular.copy(appoint_info.patientInfo);
        eHnoteMasterDataService.addAppointmentInfo(appoint_info);

        var getDate = moment(event.patientstartTime).format('DD-MMM-YYYY');
        var startDatetime = moment(info.infoobj.patientstartTime).format('DD-MMM-YYYY' + ' ' + info.infoobj.AppointmentDetails.startTime);
        var endDatetime = moment(info.infoobj.patientstartTime).format('DD-MMM-YYYY' + ' ' + info.infoobj.AppointmentDetails.endTime);
        var obj = {
            'IsComingFrom': 'Doctorcalendar',
            'MinPerCaseval': 0,
            'Starttime': startDatetime,
            'Endtime': endDatetime,
            'GetDate': getDate
        }
        datapersistanceFactory.set("SingleDoctorcalendar", obj);


        $scope.OpAccess.bookAppointmentAccessFromAppList = true;
        if ($scope.OpAccess.bookAppointmentAccessFromAppList) {
            $scope.mInstanceEdit = $uibModal.open({
                templateUrl: 'modalEdit.html',
                controller: function ($scope, $uibModal) {
                    $scope.ok = function () {
                        $scope.mInstanceEdit.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $scope.mInstanceEdit.dismiss('cancel');
                    };
                }
            });
            $scope.mInstanceEdit.result.then(function (selectedItem) {
            }, function () {
                if ($scope.calendarView === 'day') {
                    $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
                } else if ($scope.calendarView === 'week') {
                    loadWeekView();
                } else if ($scope.calendarView === 'month') {
                    // loadMonthView();
                    $scope.loadDayView();
                }
            });
        }

        var PHospitID = null;
        var patientId = "";
        patientId = appoint_info.patientInfo.patientID;
        PHospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        eHnoteUserAppointmentDataService.GetPatientUpcomingAppointments(patientId, PHospitID).then(function (response) {
            console.log(response);
            if (response.data.Status == "Success") {
                if (response.data.rows.length > 0) {
                    angular.forEach(response.data.rows, function (item, index) {
                        if (index == 0 || index == 1) {
                            $scope.cacheStorageItem.VisitRemarks = item.VisitRemarks;
                            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        }
                    });
                }
                else if (response.data.rows.length == 0) {
                    $scope.cacheStorageItem.VisitRemarks = "";
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                }
            }
        });
    };

    $scope.openAppointmentForSelectedSlots = function (info) {



        $scope.AppDate = [];

        //  $scope.calenderDate = moment(info.date).format("DD-MMM-YYYY" + " " + info.StartTime);
        $scope.event = {
            "AppointmentDetails": info.infoobj.AppointmentDetails,
            "DoctorID": info.infoobj.DoctorID,
            "ETime": info.infoobj.ETime,
            "STime": info.infoobj.STime,
            "startDate": info.infoobj.AppointmentDetails.startDate,
            "endDate": info.infoobj.AppointmentDetails.endDate,
            "eventDesc": info.infoobj.eventDesc,
            "eventInfo": info.infoobj.eventInfo,
            "eventTitle": info.infoobj.eventTitle,
            "eventVenue": info.infoobj.eventVenue,
            "patientID": info.infoobj.patientID,
            "patientendTime": info.infoobj.patientendTime,
            "patientstartTime": info.infoobj.patientstartTime,
            "rowData": info.infoobj.rowData,
            "doctorName": info.infoobj.AppointmentDetails.doctorInfo.doctorName,
            "EmailId": info.infoobj.AppointmentDetails.doctorInfo.EmailId,
            "doctorSpecialities": getDoctorSpecialities('calendar'),
            "doctorImage": "",
            "clinicDoctorList": $scope.clinicDoctorList,
            "source": {
                "action": "reschedule"
            }
        }

        var Obj = {
            "PageName": "reschedule",
            "AppDate": $scope.AppDate,
            "ispatientExistsval": true,
            "calenderDate": info.date,
            "AppointmentId": info.infoobj.AppointmentDetails.appointmentID || null,
            "PatientId": info.infoobj.patientID || null,
            'IsComingFrom': '',
            "DoctorId": info.infoobj.DoctorID,
            "StartTime": info.infoobj.STime,
            "EndTime": info.infoobj.STime,
            'type': 'CRM',

        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        BookApptPopupOpened();


    };

    $scope.opentheProfileSlots = function (info) {
        $scope.CelanderProfileSampleClick(info.infoobj.AppointmentDetails);
    };

    $scope.canceltheSelectedSlots = function (info) {

        console.log(info.infoobj);
        $scope.event = {
            "AppointmentDetails": info.infoobj.AppointmentDetails,
            "DoctorID": info.DoctorId,
            "ETime": info.infoobj.ETime,
            "STime": info.infoobj.STime,
            "startDate": info.infoobj.AppointmentDetails.startDate,
            "endDate": info.infoobj.AppointmentDetails.endDate,
            "eventDesc": info.infoobj.eventDesc || "",
            "eventInfo": info.infoobj.eventInfo || "",
            "eventTitle": info.infoobj.eventTitle || "",
            "eventVenue": info.infoobj.eventVenue || "",
            "patientID": info.infoobj.rowData.PatientInfo.patientID,
            "patientendTime": info.infoobj.patientendTime,
            "patientstartTime": info.infoobj.patientstartTime,
            "rowData": info.infoobj.rowData,
            "doctorName": info.infoobj.AppointmentDetails.doctorInfo.doctorName,
            "EmailId": info.infoobj.AppointmentDetails.doctorInfo.EmailId,
            "doctorSpecialities": getDoctorSpecialities('calendar'),
            "doctorImage": "",
            "clinicDoctorList": $scope.clinicDoctorList,
            "source": {
                "action": "cancel"
            }
        }

        $scope.CancelCalenderViewAppointmentList($scope.event);
    };
    $scope.clearEventSelectedSlots = function () {

        $scope.evencalobj.IsShow = false;
        $scope.evencalobj.StartTime = "";
        $scope.evencalobj.EndTime = "";
        $scope.evencalobj.DoctorId = "";
        $scope.evencalobj.DoctorName = "";
        $scope.evencalobj.infoobj = "";
        $scope.evencalobj.date = "";
        $scope.evencalobj.HospitalId = "";
    };


    $scope.ToggleApptStatus = function () {
        $scope.loadAppointments($scope.selectedDoctor, '');
    };

    $scope.BookNewApptFromCalendar = function (Obj) {

        var startTime = $filter("date")(Obj.infoobj.AppointmentDetails.startTime, "HH:mm");
        var endTime = $filter("date")(Obj.infoobj.AppointmentDetails.endTime, "HH:mm");

        var getDate = moment(Obj.infoobj.AppointmentDetails.startDate).format('DD-MMM-YYYY');
        var startDatetime = moment(Obj.infoobj.AppointmentDetails.startDate).format('DD-MMM-YYYY' + ' ' + startTime);
        var endDatetime = moment(Obj.infoobj.AppointmentDetails.endDate).format('DD-MMM-YYYY' + ' ' + endTime);
        var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(Obj.infoobj.AppointmentDetails.doctorID); });
        var obj = {
            'IsComingFrom': 'Doctorcalendar',
            'MinPerCaseval': filteredDOcObj[0].MinPerCase || minutes,
            'Starttime': startDatetime,
            'Endtime': endDatetime,
            'GetDate': getDate,
            //'SlotType': $scope.SelectedBookingTypeObj.WalkIn == true ? 1 : 3,
            "AppointmentTypeId": Obj.infoobj.AppointmentDetails.AppointmentTypeId,
            'OutOfBusinessTime': false
        }
        datapersistanceFactory.set("SingleDoctorcalendar", obj);
        var docObject = {
            "DoctorId": parseInt(Obj.infoobj.AppointmentDetails.doctorID),
            "StartTime": startTime,
            "EndTime": endTime,
            "BranchId": $scope.HospitalId
        }
        console.log(docObject);
        $scope.PageName = 'book';
        var doctorID = {
            "DoctorID": parseInt(docObject.DoctorId)
        };

        $scope.ispatientExistsval = false;
        eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

        var clinicAddress = { "ClinicId": $scope.HospitalId };
        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        $scope.appDate = "";
        $scope.AppDate = "";
        var date = new Date($scope.SearchObj.ConsultationDt);

        datapersistanceFactory.set('appointmentinfo', "");
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentStatus = "B";
        appointmentInfo.BillingId = 0;
        appointmentInfo.CaptureBillingFrom = "Appointment";
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

        /*$scope.openAppointmentPopup();*/
        $scope.cacheStorageItem.VisitRemarks = $scope.cacheStorageItem.VisitRemarks || "";
        if ($scope.cacheStorageItem.VisitRemarks != "") {
            $scope.cacheStorageItem.VisitRemarks = "";
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        else {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        $scope.AppDate = "";
        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": $scope.ispatientExistsval || false,
            "calenderDate": $scope.calenderDate,
            "AppointmentId": null,
            "PatientId": null,
            'IsComingFrom': '',
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        //  openAppPopup();
        BookApptPopupOpened();
    };



    $scope.ConsultationEntryFormPrint = function (item) {
        var ConsultationDt = '';
        ConsultationDt = $filter("date")((item.ConsultationDt), "MMM-dd-yyyy");
        item.PatientInsuranceList = item.PatientInsuranceList || [];
        $scope.PayorName = '';
        if (item.PatientInsuranceList.length > 0) {
            angular.forEach(item.PatientInsuranceList, function (Sitem) {
                $scope.PayorName += Sitem.PayorName + ',';
            });
        }
        var printobj = {
            "PatientName": item.PatientName || "",
            "MRNo": item.PatientMrNo || "",
            "MobileNo": item.PatientDetails.MobileNo || "",
            "Date": ConsultationDt || "",
            "StartTime": item.ConvertDateStartTime || "",
            "DoctorFullName": item.DoctorFullName || "",
            "VisitReason": item.VisitReason || "",
            "MedicalPlan": $scope.PayorName || "",
            "PatientInsuranceList": item.PatientInsuranceList || [],


        }
        USPrintService.generateConsultationEntryForm(printobj);
    }

    $scope.ClearApptRemarks = function () {
        $scope.objApptRemarks.Remarks = '';
    }

    $scope.Submit = function () {
        if ($scope.objApptRemarks.Remarks == '') {
            alertify.error("Enter Remarks");
            return false;
        }
        var Params = {
            "Remarks": $scope.objApptRemarks.Remarks || "",
            "CreatedBy": $scope.objApptRemarks.CreatedBy,
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.objApptRemarks.UserId,
            "PatientId": $scope.objApptRemarks.PatientId,
            "AppointmentId": $scope.objApptRemarks.AppointmentId,
            "DeleteInd": $scope.objApptRemarks.DeleteInd || "N"
        }

        eHnotePatientDataService.AddUpdateAppointmentTrackerRemarks(Params).then(function (resp) {
            if (resp.data.status == "Success") {
                alertify.success("Save Successfully");
                $scope.objApptRemarks.Remarks = '';
                //$scope.ApptTrackerRemarksArray = [];
                var obj = {
                    "AppointmentDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                    "DoctorId": $scope.objApptRemarks.DoctorId,
                    "AppointmentID": $scope.objApptRemarks.AppointmentId,
                    "HospitalId": $scope.HospitalId,
                    "PatientId": 0,
                    "PageSize": 10,
                    "PageNumber": 1
                };
                eHnotePatientDataService.GetAppointmentTrackerDetails(obj).then(function (resp) {
                    if (resp.data.status === 'Success') {
                        $scope.ApptTrackerRemarksArray = resp.data.TrackerRemarks || [];
                    }

                }, function (err) {
                    console.log(err);
                });
            } else {

            }
        }, function (error) {

        });
    }

    $scope.DeleteApptRemark = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to Delete? </h4>",
            function () {
                var Params = {
                    "TrackerRemarksId": item.TrackerRemarksId || "",
                    "Remarks": item.Remarks || "",
                    "HospitalId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    "PatientId": $scope.objApptRemarks.PatientId,
                    "AppointmentId": $scope.objApptRemarks.AppointmentId,
                    "DeleteInd": "Y"
                }

                eHnotePatientDataService.AddUpdateAppointmentTrackerRemarks(Params).then(function (resp) {
                    if (resp.data.status == "Success") {

                        alertify.success("Delete Successfully");
                        $scope.objApptRemarks.Remarks = '';
                        //$scope.ApptTrackerRemarksArray = [];
                        var obj = {
                            "AppointmentDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                            "DoctorId": $scope.objApptRemarks.DoctorId,
                            "AppointmentID": $scope.objApptRemarks.AppointmentId,
                            "HospitalId": $scope.HospitalId,
                            "PatientId": 0,
                            "PageSize": 10,
                            "PageNumber": 1
                        };
                        eHnotePatientDataService.GetAppointmentTrackerDetails(obj).then(function (resp) {
                            if (resp.data.status === 'Success') {
                                $scope.ApptTrackerRemarksArray = resp.data.TrackerRemarks || [];
                            }

                        }, function (err) {
                            console.log(err);
                        });

                    } else {

                    }
                }, function (error) {

                });
            }, function () {
                return false;
            });
    }



    $scope.navtoAppointmentReport = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/AppointmentReportpopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            //"size": "lg",
            "windowClass": "newassessmentspopupuib",
            "resolve": {

            },
            "controller": function ($scope, $uibModal, $uibModalInstance,) {
                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            },

        });
    }


    //$scope.DoctorAppointmentVisitReasonsFromService = [
    //    {
    //        "VisitReasonId": 3851,
    //        "VisitReasonName": "Eye redness in the right eye",
    //        "isChecked":false
    //    },
    //    {
    //        "VisitReasonId": 3869,
    //        "VisitReasonName": "Consultation for Eye",
    //        "isChecked": false
    //    },
    //    {
    //        "VisitReasonId": 3769,
    //        "VisitReasonName": "general check up",
    //        "isChecked": false
    //    },
    //    {
    //        "VisitReasonId": 3909,
    //        "VisitReasonName": "Multiple Eye Check up",
    //        "isChecked": false
    //    },
    //    {
    //        "VisitReasonId": 3878,
    //        "VisitReasonName": "diabetic retinopathy",
    //        "isChecked": false
    //    }
    //];

    $scope.DoctorAppointmentVisitReasonsFromService = [];
    $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);


    $scope.doctoApptVistObj = {
        "AllReasonscheck": false,
        "IsShowDoctorVisit": false
    }
    $scope.toggleallDoctorsApptVisitReason = function (item) {
        var checkedArray = _.where($scope.DoctorAppointmentVisitReasons, { isChecked: true });
        checkedArray = checkedArray || [];
        $scope.doctoApptVistObj.AllReasonscheck = false;
        if (checkedArray.length === $scope.DoctorAppointmentVisitReasons.length) {
            $scope.doctoApptVistObj.AllReasonscheck = true;
        }
    }

    $scope.checkAllVisitDoctorReason = function (val) {
        if (val) {
            angular.forEach($scope.DoctorAppointmentVisitReasons, function (item) {
                item.isChecked = true;
            });
        } else {
            angular.forEach($scope.DoctorAppointmentVisitReasons, function (item) {
                item.isChecked = false;
            });
        }

        var checkedArray = _.where($scope.DoctorAppointmentVisitReasons, { isChecked: true });
        checkedArray = checkedArray || [];
        $scope.doctoApptVistObj.AllReasonscheck = false;

        if (checkedArray.length === $scope.DoctorAppointmentVisitReasons.length) {
            $scope.doctoApptVistObj.AllReasonscheck = true;
        }
    };


    $scope.filterSelectedDoctorsVistReasonCalendar = function () {
        var temarray = [];

        temarray = $filter("filter")($scope.DoctorAppointmentVisitReasons, function (item) { return item.isChecked === true }, true);
        temarray = temarray || [];

        console.log(temarray);


        $scope.AllDoctorsObj.AllVisitReasonsCheck = false;
        angular.forEach($scope.Visitreasons, function (item) {
            item.isChecked = false;
            var filteredArray = $filter("filter")(temarray, function (titem) { return titem.VisitReasonId === item.ReasonId; });
            filteredArray = filteredArray || [];
            if (filteredArray.length > 0) {
                item.isChecked = true;
            }
        });


        if ($scope.mainCalendarView.MainTab === 2) {

            var temarrayd = [];

            temarrayd = $filter("filter")($scope.Calendardoctorlist1, function (item) { return item.isChecked === true }, true);
            temarrayd = temarrayd || [];
            $scope.ShowFilterView = true;

            eHnoteMasterDataService.addCalendarDoctorinAppList(temarrayd);

            $scope.$broadcast('allCalendarViewForVisitReason', temarray);

        } else {
            $scope.loadDayView($scope.SearchObj.ConsultationDt);
        }



    }



    $scope.GetDoctorAppointmentVisitReasons = function () {

        var consultdate = $filter("date")(new Date($scope.SearchObj.ConsultationDt), "yyyy-MM-dd");

        console.log($scope.selectedDoctor.DoctorID);

        var param = {
            "DoctorId": $scope.selectedDoctor.DoctorID,
            "AppointmentDate": consultdate,
            "BranchId": $scope.HospitalId
        };
        eHnotePatientDataService.GetDoctorAppointmentVisitReasonsById(param).then(function (resp) {


            $scope.DoctorAppointmentVisitReasonsFromService = [];
            if (resp.data.Status == "Success") {
                $scope.DoctorAppointmentVisitReasonsFromService = resp.data.rows || [];

                $scope.DoctorAppointmentVisitReasons = angular.copy($scope.DoctorAppointmentVisitReasonsFromService);
            }
        }, function (error) {

        });
    }
    $scope.UsNewBookAppointmentPopup = function () {

        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": undefined
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        $rootScope.appointment_type = "1";

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddressId = { "ClinicId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid
        };

        if (doctorInfo.RoleID === 3 || doctorInfo.RoleID === 43 || doctorInfo.RoleID === 11 || doctorInfo.RoleID === 57 || doctorInfo.RoleID === 18) {
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

        $rootScope.Consulatation_type = false;


        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopup.html",
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "appointment-full-popup",
            "controller": "UsBookAppointmentPopupCtrl"
        });
    }
    $scope.$on("BookapptclosePopup", function (event) {
        $scope.bookapptSetupPopUp.dismiss('cancel');
        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();
    });
    $scope.$on("bookapptreshedulesuccessMethod", function (event, data) {

        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        var obj = {
            "selectedDoctor": $scope.selectedDoctor
        }
        $rootScope.$broadcast("AppointmentTypefilter", obj);
        $scope.bookapptSetupPopUp.dismiss('cancel');
        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();
    });
    $scope.$on("BookApptsuccessMethod", function (event) {

        console.log("ABCC");
        $scope.bookapptSetupPopUp.dismiss('cancel');
        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
        var obj = {
            "selectedDoctor": $scope.selectedDoctor
        }
        $rootScope.$broadcast("AppointmentTypefilter", obj);
        if ($scope.activeEvent === 'Calendar1') {
            $scope.loadappt();
        }
        if ($scope.mainCalendarView.MainTab == 2) {
            $scope.filterSelectedDoctorsonCalendar();
            $scope.clearSelectedSlots();
            $scope.clearEventSelectedSlots();
        }

        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();

    });

    $scope.changeFromDate = function (fromDt, ToDt) {
        console.log(fromDt, ToDt);
    };
    $scope.changeToDate = function (fromDt, ToDt) {
        console.log(fromDt, ToDt);
    };

    $scope.newclearPatientApptSearchinCal = function () {

        $scope.SearchObj.searchPatientIdTxt = "";
        $scope.SearchObj.searchPatientTxt = "";
        $scope.SearchObj.searchPatientOldMR = "";
        $scope.SearchPatientfilter.PaientMRNO = "";
        $scope.SearchObj.PatientId = 0;
        $scope.SearchPatientfilter.IsPatientNameInd = false;

        if ($scope.mainCalendarView.MainTab == 1) {
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('removeEvents');
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('addEventSource', $scope.eventsList);
            uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('rerenderEvents');
        }

        if ($scope.mainCalendarView.MainTab == 2) {
            let obj = {
                "text": "",
                "type": ""
            };
            $scope.$broadcast("AllDocsCalendarFilterClear", obj);
        }

    };

    $scope.changePatientApptSearchTextinCalNew = function (text, type) {

        $scope.clearSelectedSlots();
        $scope.clearEventSelectedSlots();
        $scope.clearBreakDetails();
        $scope.filteredEventsList = [];
        if ($scope.mainCalendarView.MainTab == 1) {
            $timeout(function () {
                if (type == 1) {
                    if (text === "" || text === undefined) {
                        $scope.filteredEventsList = angular.copy($scope.eventsList);
                    } else {
                        $scope.filteredEventsList = $filter("filter")($scope.eventsList, { "PatientName": text }) || [];
                    }
                }
                if (type == 2) {
                    if (text === "" || text === undefined) {
                        $scope.filteredEventsList = angular.copy($scope.eventsList);
                    } else {
                        $scope.filteredEventsList = $filter("filter")($scope.eventsList, { "PatientMrNo": text }) || [];
                    }
                }
                if (type == 3) {
                    if (text === "" || text === undefined) {
                        $scope.filteredEventsList = angular.copy($scope.eventsList);
                    } else {
                        $scope.filteredEventsList = $filter("filter")($scope.eventsList, { "PatientOldMrNo": text }) || [];
                    }
                }
                if (type == 4) {
                    text = text + " 00:00:00";
                    //text = $filter('date')(new Date(text), "yyyy-MM-dd");
                    var parsedDate = new Date(text);
                    if (!isNaN(parsedDate.getTime())) {
                        text = $filter('date')(parsedDate, "yyyy-MM-dd");
                    } else {
                        // Log an error or handle the invalid date case
                        alertify.error("Invalid date format:", text);
                        // Return false or handle the error in another way
                        text = "";
                        return false;
                    }
                    if (text === "" || text === undefined) {
                        $scope.filteredEventsList = angular.copy($scope.eventsList);
                    } else {
                        $scope.filteredEventsList = $filter("filter")($scope.eventsList, function (event) {
                            // Check if the DOB in the patientInfo section matches the provided DOB
                            if (event.AppointmentDetails && event.AppointmentDetails.patientInfo) {
                                return event.AppointmentDetails.patientInfo.DOB === text;
                            }

                        }) || [];
                    }
                }
                uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('removeEvents');
                uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('addEventSource', $scope.filteredEventsList);
                uiCalendarConfig.calendars["Singlecalendar"].fullCalendar('rerenderEvents');
            }, 50);
        }

        if ($scope.mainCalendarView.MainTab == 2) {
            if (type !== 4) {
                let obj = {
                    "text": text,
                    "type": type
                };
                $scope.$broadcast("AllDocsCalendarFilter", obj);
            } else if (type === 4) {
                text = text + " 00:00:00";
                //text = $filter('date')(new Date(text), "yyyy-MM-dd");
                var parsedDate = new Date(text);
                if (!isNaN(parsedDate.getTime())) {
                    text = $filter('date')(parsedDate, "yyyy-MM-dd");
                    let obj = {
                        "text": text,
                        "type": type
                    };
                    $scope.$broadcast("AllDocsCalendarFilter", obj);
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", text);
                    // Return false or handle the error in another way
                    text = "";
                    return false;
                }

            }
        }

    };

    $scope.ApplyAppointmentDates = function () {

        if ($scope.MultiselectUserlist.length > 0) {
            var checkedArrayList = _.where($scope.MultiselectUserlist, { isChecked: true });
        }
        //var obj1 = {
        //    "SelectedDrList": checkedArrayList || []
        //};
        //eHnoteMasterDataService.addSelectedCrmApptUsers(obj1);

        var obj = {
            "FromDate": $scope.SearchObj.FromDate,
            "ToDate": $scope.SearchObj.ToDate,
            "AppointmentDate": $scope.SearchObj.ConsultationDt,
            "Screen": $scope.SearchObj.Screen
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);
    };


    $scope.ClearAppointmentDates = function () {
        if ($scope.MultiselectDoctorlist.length > 0) {

            angular.forEach($scope.MultiselectDoctorlist, function (Mainitem) {
                Mainitem.isChecked = true;
            });
            $scope.selectedDoctors = "All";
            $scope.selectedUsers = "All";
        }
        if ($scope.MultiselectUserlist.length > 0) {

            angular.forEach($scope.MultiselectUserlist, function (Mainitem) {
                Mainitem.isChecked = true;
            });

            if ($scope.RoleId === 2 || $scope.RoleId === 17 || $scope.RoleId === 62 || $scope.RoleId === 63 || $scope.RoleId === 64 || $scope.RoleId === 65 || $scope.RoleId === 66 || $scope.RoleId === 67 || $scope.RoleId === 68 || $scope.RoleId === 69 || $scope.RoleId === 70 || $scope.RoleId === 71) {
                angular.forEach($scope.MultiselectUserlist, function (citem, $index) {
                    //if (doctorInfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                    //    citem.isChecked = true;
                    //    $scope.selectedUsers = citem.UserFullName + '-' + citem.NPI;
                    //} else {
                    //    citem.isChecked = false;
                    //}
                });
            } else {
                angular.forEach($scope.MultiselectUserlist, function (Mainitem) {
                    Mainitem.isChecked = true;
                });
            }


            var checkedArrayList = _.where($scope.MultiselectUserlist, { isChecked: true });

            $scope.SearchObj.AllUsersCheck = checkedArrayList.length > 0 && $scope.MultiselectUserlist.length === checkedArrayList.length ? true : false;
            if (checkedArrayList.length == 0) {
                $scope.selectedUsers = "Select User";
            } else {
                if (checkedArrayList.length === 1) {
                    $scope.selectedUsers = checkedArrayList[0].UserFullName + '-' + checkedArrayList[0].NPI;
                } else {
                    if ($scope.SearchObj.AllUsersCheck) {
                        $scope.selectedUsers = "All";
                    } else {
                        $scope.selectedUsers = "Selected Users";
                    }
                }
            }

            //var obj1 = {
            //    "SelectedDrList": checkedArrayList || []
            //};
            //eHnoteMasterDataService.addSelectedCrmApptUsers(obj1);
            $scope.SearchObj.ReminderStatusId = null;
            var dobj = {
                "SelectedDoctorsList": checkedArrayList || [],
                "OPFromDate": ''
            };
            eHnoteMasterDataService.addSelectedCRMRemindersDoctors(dobj);
        }

        var obj = {
            "FromDate": moment().format("MM-DD-YYYY"),
            "ToDate": todate,
            "AppointmentDate": moment().format("MMM-DD-YYYY"),
            "Screen": $scope.SearchObj.Screen
        };
        eHnoteMasterDataService.addSelectedCrmApptDates(obj);
        $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
        if ($scope.PatientTagList1.length > 0) {
            angular.forEach($scope.PatientTagList1, function (item) {
                item.IsChecked = false;
            });
            $scope.checkedtaglist = $scope.PatientTagList1 || [];
        }
        $scope.SearchObj.ReminderTypeID = 0;
        $scope.SearchObj.FromDate = moment().format("MM-DD-YYYY");
        $scope.SearchObj.ToDate = todate;
        $scope.SearchObj.PriorityStatus = $scope.resetallids;
        $scope.SearchList();
    }

    $scope.onChangeSearchAppt = function (text, type) {
        text = text || "";
        if (text === "") {
            $scope.filteredAppointmentArray = angular.copy($scope.BookedAppointmentList);
        }
    }

    $scope.changePatientApptSearchText = function (text, type) {
        console.log(type + "__" + text + "__" + $scope.SearchObj.searchPatientTxt);
        $timeout(function () {
            if (type == 1) {
                if (text === "" || text === undefined) {
                    $scope.filteredAppointmentArray = angular.copy($scope.BookedAppointmentList);
                } else {
                    $scope.filteredAppointmentArray = $filter("filter")($scope.BookedAppointmentList, { "PatientName": text }) || [];
                }
            }
            if (type == 2) {
                if (text === "" || text === undefined) {
                    $scope.filteredAppointmentArray = angular.copy($scope.BookedAppointmentList);
                } else {
                    $scope.filteredAppointmentArray = $filter("filter")($scope.BookedAppointmentList, { "PatientMrNo": text }) || [];
                }
            }
            if (type == 3) {
                if (text === "" || text === undefined) {
                    $scope.filteredAppointmentArray = angular.copy($scope.BookedAppointmentList);
                } else {
                    $scope.filteredAppointmentArray = $filter("filter")($scope.BookedAppointmentList, { "PatientOldMrNo": text }) || [];
                }
            }
        }, 50);
    };

    $scope.newclick = function (str) {
        $scope.calendarView2 = angular.copy(str);
        $scope.$broadcast("CalendarViewChange", str);
    };


    $scope.ChangeAppointmentDoctor1 = function (event) {
        var startTime = $filter("date")(new Date(event.start), "HH:mm");
        var endTime = $filter('date')(new Date(event.end), 'HH:mm');
        var start1 = startTime.replaceAll(":", "");
        var filteredDOcObj = $filter("filter")($scope.Calendardoctorlist1, function (iterator, ind) { return iterator.DoctorID === parseInt(doctorInfo.doctorid); });

        var obj = {
            "UserId": $scope.UserId,
            "AppointmentId": event.AppointmentDetails.appointmentID,
            "StartTime": startTime,
            "EndTime": endTime,
            "DoctorId": parseInt(doctorInfo.doctorid),
            "Remarks": "",
            "UserBranchId": filteredDOcObj[0].UserBranchId || null
        }
        eHnotePatientDataService.ChangeAppointmentDoctorById(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.calendarView = $scope.calendarView || "day";
                $scope.loadCalenderEvent($scope.calendarView);
            }
        });

    };

    $scope.EditAppointmentPopup1 = function (item) {


        var Sarray = item.StartTime.split(":");
        var stime = Sarray[0] + ":" + Sarray[1];
        var date = moment(item.ConsultationDt).format();
        var earray = item.EndTime.split(":");
        var etime = earray[0] + ":" + earray[1];
        var apptime = item.AppointmentID;
        var VisitTypeId = item.VisitTypeId || "";
        VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
        var VisitRemarks = item.VisitRemarks || "";

        $scope.AppDate = [stime, etime, apptime, item.VisitReason ? item.VisitReason : "", item.ReferralSourceId ? item.ReferralSourceId : "", VisitTypeId, VisitRemarks];

        $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);

        $scope.PageName = "reschedule";

        var Obj = {
            "PageName": "reschedule",
            "AppDate": $scope.AppDate,
            "ispatientExistsval": true,
            "calenderDate": $scope.calenderDate,
            "AppointmentId": item.AppointmentID || null,
            "PatientId": item.PatientID || null,
            "DoctorId": item.DoctorId,
            "StartTime": stime,
            "EndTime": etime,

        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);
        BookApptPopupOpened();

    };


    $scope.ClickRemindersPopup1 = function (RemainderItem) {

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



                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/uibpopups/SetReminderPopover.html",
                        "backdrop": "static",
                        "scope": $scope,
                        "keyboard": false,
                        "size": "md",
                        /*"windowClass": "modal-full",*/
                        "resolve": {
                            "UserId": function () { return $scope.UserId; },
                            "HospitalId": function () { return $scope.HospitalId; },
                            "appointmentid": function () { return RemainderItem.AppointmentID; },
                            "PatientID": function () { return RemainderItem.PatientID; },
                            "RemainderItem": function () { return RemainderItem; },
                        },
                        "controller": function ($scope, $uibModal, $uibModalInstance, UserId, HospitalId, appointmentid, PatientID, RemainderItem) {

                            $scope.UserId = UserId || 0;
                            $scope.HospitalId = HospitalId || 0;
                            $scope.appointmentid = appointmentid || 0;
                            $scope.PatientID = PatientID || 0;

                            $scope.ReminderTab = 1;

                            $scope.switchReminderTab = function (val) {
                                $scope.ReminderObj = getnewReminderObj();
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
                                };
                                return obj;
                            }
                            $scope.ReminderObj = getnewReminderObj();

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

                            if (RemainderItem !== undefined) {

                                if (RemainderItem.ReminderDate == null) {
                                    var RemDate = $filter("date")(RemainderItem.Duration, "yyyy-MM-dd") || '';
                                } else {
                                    var RemDate = $filter("date")(RemainderItem.ReminderDate, "yyyy-MM-dd") || '';
                                }

                                /*$scope.ReminderObj.ReminderDate = RemDate || '';*/
                                $scope.ReminderObj.ReminderDate = $filter("date")(RemDate, "MM-dd-yyyy");
                                $scope.ReminderObj.Type = 'Date';
                                $scope.ReminderObj.ReminderRemarks = RemainderItem.ReminderRemarks || '';
                                $scope.ReminderObj.VisitTypeId = RemainderItem.VisitTypeId || null;
                                $scope.ReminderObj.VisitReasonName = RemainderItem.VisitReasonName || null;
                                $scope.ReminderObj.DoctorId = RemainderItem.DoctorID || null;
                                let tempArray = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.ReminderObj.DoctorId }, true);
                                if (tempArray.length > 0) {
                                    $scope.ReminderObj.DocObj = angular.copy(tempArray[0]);
                                }
                                $scope.ReminderTab = RemainderItem.ReminderTypeID;

                            }

                            $scope.navtoClearReminderObj = function () {
                                $uibModalInstance.dismiss("cancel");
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

                                if ($scope.ReminderTab == 2 && $scope.ReminderObj.VisitTypeId == null) {
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
                                    //"Duration": SelectedDurationToDate || null,
                                    "Duration": null,
                                    "Remarks": $scope.ReminderObj.ReminderRemarks,
                                    "DoctorId": $scope.ReminderObj.DoctorId || null,
                                    "VisitTypeId": $scope.ReminderObj.VisitTypeId || null,
                                    "ReminderTypeID": ($scope.ReminderTab == 1) ? 1 : 2,
                                    "ReminderType": ($scope.ReminderTab == 1) ? "General Reminder" : "Appointment Reminder",
                                    "ReminderStatusId": 1,
                                    "ReminderStatus": "To be Worked",
                                    "DeleteInd": "N",
                                    "IsFrom": "CRM",
                                    "PriorityName": $scope.ReminderObj.PriorityName,
                                    "PriorityId": $scope.ReminderObj.PriorityId,

                                }
                                if (RemainderItem !== undefined) {
                                    obj.PatientAppointmentReminderId = RemainderItem.PatientAppointmentReminderId || 0;
                                    if (obj.PatientAppointmentReminderId != 0) {
                                        obj.ReminderStatusId = 2;
                                        obj.ReminderStatus = "Revised";
                                    }
                                }
                                eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
                                    console.log(resp);
                                    if (resp.data.status == "Success") {
                                        alertify.success("Reminder Added Successfully");
                                        //$scope.GetSetReminderId();
                                        $scope.ReminderObj = getnewReminderObj();
                                        //$scope.mInstanceAdd.close();
                                        /*$uibModalInstance.dismiss("cancel");*/
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
                                }

                                eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
                                    if (resp.data.status == "Success") {
                                        $scope.SetReminderArray = resp.data.rows;
                                        $scope.mInstanceAdd.close($scope.SetReminderArray);
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
                        $scope.SearchList();
                    }, function () { });

                }

            }
        });


    };

    $scope.BookAppointmentFromReminder = function (obj) {
        $scope.PageName = "book";
        $rootScope.appointment_type = "1";

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddress = {
            "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID
        };
        var doctorID = {
            "DoctorID": obj.DoctorID
        };

        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": obj.ReminderDate,
            "AppointmentId": null,
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
            "PatientId": obj.PatientID || null,
            'IsComingFrom': 'PatientProfile',
            'type': 'op',
            'VisitTypeId': obj.VisitTypeId || null
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        //BookApptPopupOpened(opencallcenterpopup);

        let openBookAppt = "";
        let bookapptSetupPopUp = $uibModal.open({
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

        bookapptSetupPopUp.result.then(function (resp) {

            let SelectedDate = $filter("date")(obj.ReminderDate, "yyyy-MM-dd") || null;

            let req = {

                "UserId": $scope.UserId,
                "PatientAppointmentReminderId": obj.PatientAppointmentReminderId || 0,
                "HospitalId": $scope.HospitalId,
                "PatientId": obj.PatientID || 0,
                "AppointmentId": obj.AppointmentID || 0,
                "Type": 'Date',
                "Date": SelectedDate || null,
                "DurationType": "",
                "Duration": null,
                "Remarks": obj.ReminderRemarks,
                "DoctorId": obj.DoctorID || null,
                "VisitTypeId": obj.VisitTypeId || null,
                "ReminderTypeID": obj.ReminderTypeID,
                "ReminderType": (obj.ReminderTypeID == 1) ? "General Reminder" : "Appointment Reminder",
                "ReminderStatusId": 3,
                "ReminderStatus": "Booked",
                "DeleteInd": "N",
                "IsFrom": "CRM",
                "PriorityName": $scope.ReminderObj.PriorityName,
                "PriorityId": $scope.ReminderObj.PriorityId,
            }

            eHnoteMainAppointmentService.AddSetRemainderDetails(req).then(function (resp) {
                console.log(resp);
                if (resp.data.status == "Success") {
                    $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });


        }, function () { });
    };

    $scope.BookAppointmentFromReminderv2 = function (obj) {
        $scope.PageName = "book";
        $rootScope.appointment_type = "1";

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddress = {
            "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID
        };
        var doctorID = {
            "DoctorID": obj.DoctorID
        };

        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);

        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": obj.ReminderDate,
            "AppointmentId": null,
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
            "PatientId": obj.PatientID || null,
            'IsComingFrom': 'PatientProfile',
            'type': 'op',
            'VisitTypeId': obj.VisitTypeId || null
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        let openBookAppt = "";
        let bookapptSetupPopUp = $uibModal.open({
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

        bookapptSetupPopUp.result.then(function (resp) {
            var getresp = eHnoteMasterDataService.getSMSBookAppt();
            console.log(getresp);
            if (Object.keys(getresp).length > 0) {
                let SelectedDate = $filter("date")(obj.ReminderDate, "yyyy-MM-dd") || null;
                let ApptSelectedDate = $filter("date")(obj.ReminderAppointmentDate, "yyyy-MM-dd") || null;
                let req = {

                    "UserId": $scope.UserId,
                    "PatientAppointmentReminderId": obj.PatientAppointmentReminderId || 0,
                    "HospitalId": $scope.HospitalId,
                    "PatientId": obj.PatientID || 0,
                    "AppointmentId": obj.AppointmentID || 0,
                    "Type": 'Date',
                    "Date": SelectedDate || null,
                    "DurationType": "",
                    "Duration": null,
                    "Remarks": obj.ReminderRemarks,
                    "DoctorId": obj.DoctorID || null,
                    "VisitTypeId": obj.VisitTypeId || null,
                    "ReminderTypeID": obj.ReminderTypeID,
                    "ReminderType": (obj.ReminderTypeID == 1) ? "General Reminder" : "Appointment Reminder",
                    "ReminderStatusId": 3,
                    "ReminderStatus": "Booked",
                    "DeleteInd": "N",
                    "IsFrom": "CRM",
                    "PriorityName": obj.PriorityName,
                    "PriorityId": obj.PriorityId,
                    "ReminderAppointmentDate": ApptSelectedDate,
                    "FollowUpId": obj.FollowUpId || 0,
                    "TypeId": obj.TypeId || 0,
                    "IsAddtoRecall": obj.IsAddtoRecall || false,

                }

                eHnoteMainAppointmentService.AddSetRemainderDetails(req).then(function (resp) {
                    console.log(resp);
                    if (resp.data.status == "Success") {
                        $scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                    }
                }, function (err) {
                    alertify.error("Getting Failed");
                });

            } else {
                console.log("Agent Don't do any action ");
            }



        }, function () { });
    };

    $scope.ClickRemindersPopup = function (RemainderItem) {

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

                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/uibpopups/CRMReminderPopUp.html",
                        "backdrop": "static",
                        "scope": $scope,
                        "keyboard": false,
                        "size": "lg",
                        /*"windowClass": "modal-full",*/
                        "resolve": {
                            "UserId": function () { return $scope.UserId; },
                            "HospitalId": function () { return $scope.HospitalId; },
                            "appointmentid": function () { return RemainderItem.AppointmentID; },
                            "PatientID": function () { return RemainderItem.PatientID; },
                            "RemainderItem": function () { return RemainderItem; },
                        },
                        "controller": function ($scope, $uibModal, $uibModalInstance, UserId, HospitalId, appointmentid, PatientID, RemainderItem) {

                            $scope.UserId = UserId || 0;
                            $scope.HospitalId = HospitalId || 0;
                            $scope.appointmentid = appointmentid || 0;
                            $scope.PatientID = PatientID || 0;                          
                            $scope.FollowUpCount = 0;
                            
                            $scope.ReminderTab = 1;
                            $scope.IsFollowUp = false;

                            $scope.ClosePopUp = function () {
                                $uibModalInstance.dismiss();
                            };
                            $scope.Detailsobj = {
                                "PatientName": "",
                                "PatientDisplayId": "",
                                "PatientImageS3URL": "",
                                "PatientID": ""
                            };
                            $scope.Detailsobj.PatientName = RemainderItem.PatientName || '';
                            $scope.Detailsobj.PatientDisplayId = RemainderItem.PatientMrNo || '';
                            $scope.Detailsobj.PatientImageS3URL = RemainderItem.PatientDetails.S3URL || '';
                            $scope.Detailsobj.PatientID = RemainderItem.PatientID || '';

                            $scope.RemarksObj = {
                                "IsShow": false,
                                "Type": "NOTINT",
                                "Remarks": ""
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
                                };
                                return obj;
                            }
                            $scope.ReminderObj = getnewReminderObj();

                            function getnewFollowUpObj() {
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
                                    "IsFollowUp": false,
                                    "ReminderStatusId": 1,
                                    "ReminderStatus": "To be Worked"
                                };
                                return obj;
                            }
                            $scope.FollowUpObj = getnewFollowUpObj();

                            if (RemainderItem !== undefined) {

                                if (RemainderItem.ReminderDate == null) {
                                    var RemDate = $filter("date")(RemainderItem.Duration, "yyyy-MM-dd") || '';
                                } else {
                                    var RemDate = $filter("date")(RemainderItem.ReminderDate, "yyyy-MM-dd") || '';
                                }
                                if (RemainderItem.ReminderAppointmentDate != null) {
                                    var apptDate = $filter("date")(RemainderItem.ReminderAppointmentDate, "yyyy-MM-dd") || '';
                                }
                                RemainderItem.IsAddtoRecall = RemainderItem.IsAddtoRecall || false;

                                /*$scope.ReminderObj.ReminderDate = RemDate || '';*/
                                $scope.ReminderObj.PatientAppointmentReminderId = RemainderItem.PatientAppointmentReminderId;
                                $scope.ReminderObj.ReminderDate = $filter("date")(RemDate, "MM-dd-yyyy");
                                $scope.ReminderObj.Type = 'Date';
                                $scope.ReminderObj.ReminderRemarks = RemainderItem.ReminderRemarks || '';
                                $scope.ReminderObj.VisitTypeId = RemainderItem.VisitTypeId || null;
                                $scope.ReminderObj.VisitReasonName = RemainderItem.VisitReasonName || null;
                                $scope.ReminderObj.DoctorId = RemainderItem.DoctorID || null;
                                $scope.ReminderObj.DoctorName = RemainderItem.DoctorFullName || "";
                                $scope.ReminderObj.CreatedBy = RemainderItem.CreatedBy || "";
                                $scope.ReminderObj.ReminderType = RemainderItem.ReminderType || "";
                                $scope.ReminderObj.ReminderTypeID = RemainderItem.ReminderTypeID || null;
                                $scope.ReminderObj.ReminderStatusId = RemainderItem.ReminderStatusId || null;
                                $scope.ReminderObj.ReminderStatus = RemainderItem.ReminderStatus || "";
                                $scope.ReminderObj.PriorityName = RemainderItem.PriorityName || "";
                                $scope.ReminderObj.PriorityId = RemainderItem.PriorityId || "";
                                $scope.ReminderObj.ReminderAppointmentDate = $filter("date")(apptDate, "MM-dd-yyyy");
                                $scope.ReminderObj.IsAddtoRecall = RemainderItem.IsAddtoRecall || false;
                                let tempArray = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.ReminderObj.DoctorId }, true);
                                if (tempArray.length > 0) {
                                    $scope.ReminderObj.DocObj = angular.copy(tempArray[0]);
                                }
                                $scope.ReminderTab = RemainderItem.ReminderTypeID;

                            }

                            $scope.UpdateReminder = function (val) {
                                if (val != 3) {
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

                                    if ($scope.ReminderTab == 2 && $scope.ReminderObj.VisitTypeId == null) {
                                        alertify.error("Please Select visit reason!");
                                        return;
                                    }

                                    var ReminderType = '';
                                    if ($scope.ReminderTab == 1) {
                                        ReminderType = 'General Reminder';
                                    } else if ($scope.ReminderTab == 2) {
                                        ReminderType = 'Appointment Reminder';
                                    } else if ($scope.ReminderTab == 5) {
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
                                        "Duration": null,
                                        "Remarks": $scope.ReminderObj.ReminderRemarks,
                                        "DoctorId": $scope.ReminderObj.DoctorId || null,
                                        "VisitTypeId": $scope.ReminderObj.VisitTypeId || null,
                                        "ReminderTypeID": $scope.ReminderTab,
                                        "ReminderType": ReminderType,
                                        "FollowUpId": RemainderItem.FollowUpId || 0,
                                        "ReminderAppointmentDate": $scope.ReminderObj.ReminderAppointmentDate || null,
                                        "IsAddtoRecall": $scope.ReminderObj.IsAddtoRecall || false,
                                        "TypeId": RemainderItem.TypeId || 0,
                                        "ReminderStatusId": 1,
                                        "ReminderStatus": "To be Worked",
                                        "DeleteInd": "N",
                                        "IsFrom": "CRM",
                                        "PriorityName": $scope.ReminderObj.PriorityName,
                                        "PriorityId": $scope.ReminderObj.PriorityId,
                                    }
                                    if (RemainderItem !== undefined) {
                                        obj.PatientAppointmentReminderId = RemainderItem.PatientAppointmentReminderId || 0;
                                        if (val == 2) {
                                            obj.ReminderStatusId = 2;
                                            obj.ReminderStatus = "Not Interested";
                                            obj.Remarks = angular.copy($scope.RemarksObj.Remarks);
                                        }

                                        if (val == 4) {
                                            obj.ReminderStatusId = 4;
                                            obj.ReminderStatus = "Deleted";
                                            obj.Remarks = angular.copy($scope.RemarksObj.Remarks);
                                        }
                                    }
                                    eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
                                        console.log(resp);
                                        if (resp.data.status == "Success") {
                                            alertify.success("Reminder Added Successfully");
                                            $scope.ReminderObj = getnewReminderObj();
                                            let obj = {
                                                "value": val
                                            };
                                            $uibModalInstance.close(obj);
                                        }
                                    }, function (err) {
                                        alertify.error("Getting Failed");
                                    });
                                } else if (val == 3) {
                                    let obj = {
                                        "value": 3
                                    };
                                    $uibModalInstance.close(obj);
                                }
                            };

                            $scope.ShowFollowUp = function () {

                                $scope.FollowUpObj.PatientAppointmentReminderId = angular.copy($scope.ReminderObj.PatientAppointmentReminderId);
                                $scope.FollowUpObj.DoctorId = angular.copy($scope.ReminderObj.DoctorId);
                                $scope.FollowUpObj.DoctorName = angular.copy($scope.ReminderObj.DoctorName);
                                $scope.FollowUpObj.VisitTypeId = angular.copy($scope.ReminderObj.VisitTypeId);
                                $scope.FollowUpObj.VisitReasonName = angular.copy($scope.ReminderObj.VisitReasonName);

                                let tempArray = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.FollowUpObj.DoctorId }, true);
                                if (tempArray.length > 0) {
                                    $scope.FollowUpObj.DocObj = angular.copy(tempArray[0]);
                                }

                                $scope.FollowUpObj.IsFollowUp = true;
                            };

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

                            $scope.AddFollowUp = function () {
                                if ($scope.FollowUpCount == 3) {
                                    alertify.error("Followup limit reached!");
                                    return;
                                }

                                var SelectedDate = $filter("date")($scope.FollowUpObj.ReminderDate, "yyyy-MM-dd") || null;
                                var SelectedDurationToDate = $filter("date")($scope.FollowUpObj.DurationDate, "yyyy-MM-dd") || null;

                                if ($scope.FollowUpObj.ReminderDate == "" && $scope.FollowUpObj.Duration == "") {
                                    alertify.error("Please Select Reminder Date or Duration ");
                                    return;
                                }

                                if ($scope.ReminderTab == 2 && $scope.FollowUpObj.DoctorId == null) {
                                    alertify.error("Please Select Doctor!");
                                    return;
                                }

                                if ($scope.ReminderTab == 2 && $scope.FollowUpObj.VisitTypeId == null) {
                                    alertify.error("Please Select visit reason!");
                                    return;
                                }

                                if ($scope.FollowUpObj.ReminderRemarks == "") {
                                    alertify.error("Please enter remarks!");
                                    return;
                                }

                                let followupstatus = "";
                                if ($scope.FollowUpCount == 0) {
                                    followupstatus = "FollowUp-1";
                                } else if ($scope.FollowUpCount == 1) {
                                    followupstatus = "FollowUp-2";
                                } else if ($scope.FollowUpCount == 2) {
                                    followupstatus = "FollowUp-3";
                                }
                                var ReminderType = '';
                                if ($scope.ReminderTab == 1) {
                                    ReminderType = 'General Reminder';
                                } else if ($scope.ReminderTab == 2) {
                                    ReminderType = 'Appointment Reminder';
                                } else if ($scope.ReminderTab == 5){
                                    ReminderType = 'Glass Reminder';
                                }

                                let obj = {

                                    "UserId": $scope.UserId,
                                    "PatientAppointmentReminderId": $scope.FollowUpObj.PatientAppointmentReminderId || 0,
                                    "HospitalId": $scope.HospitalId,
                                    "PatientId": $scope.PatientID || 0,
                                    "AppointmentId": $scope.appointmentid || 0,
                                    "Type": $scope.FollowUpObj.Type,
                                    "Date": SelectedDate || SelectedDurationToDate || null,
                                    "DurationType": $scope.FollowUpObj.DurationType,
                                    //"Duration": SelectedDurationToDate || null,
                                    "Duration": null,
                                    "Remarks": $scope.FollowUpObj.ReminderRemarks,
                                    "DoctorId": $scope.FollowUpObj.DoctorId || null,
                                    "VisitTypeId": $scope.FollowUpObj.VisitTypeId || null,
                                    "ReminderTypeID": $scope.ReminderTab,
                                    "ReminderType": ReminderType,
                                    "ReminderStatusId": 5,
                                    "ReminderStatus": followupstatus,
                                    "FollowUpId": RemainderItem.FollowUpId || 0,
                                    "TypeId": RemainderItem.TypeId || 0,
                                    "DeleteInd": "N",
                                    "IsFrom": "CRM",
                                    "PriorityName": $scope.ReminderObj.PriorityName,
                                    "PriorityId": $scope.ReminderObj.PriorityId,
                                    "ReminderAppointmentDate": $scope.ReminderObj.ReminderAppointmentDate || null,
                                    "IsAddtoRecall": $scope.ReminderObj.IsAddtoRecall || false,
                                }

                                //console.log("__Reminder__FollowUp__Req__", obj);
                                //return;
                                eHnoteMainAppointmentService.AddSetRemainderDetails(obj).then(function (resp) {
                                    console.log(resp);
                                    if (resp.data.status == "Success") {
                                        alertify.success("FollowUp added successfully!");
                                        let obj = {
                                            "value": 5
                                        };
                                        $uibModalInstance.close(obj);
                                    }
                                }, function (err) {
                                    alertify.error("Getting Failed");
                                });
                            };


                            $scope.CloseFollowUp = function () {
                                $scope.FollowUpObj.IsFollowUp = false;
                            };

                            $scope.ChangeDurationstep1 = function () {
                                $scope.BindfollowUpData1($scope.FollowUpObj.DurationType, 'click');
                            }

                            $scope.ClearDuration1 = function () {
                                $scope.FollowUpObj.Duration = "";
                            };

                            $scope.getApptAdditionalDetails = function () {

                                eHnoteMainAppointmentService.getAdditionalApptDetailsById($scope.appointmentid).then(function (resp) {

                                    resp.data = resp.data || [];
                                    console.log(resp);

                                    if (resp.data.length > 0) {
                                        $scope.PatientName = resp.data[0].Patient.FullName || '';
                                        $scope.PatientDisplayId = resp.data[0].Patient.PatientDisplayId || '';
                                        $scope.PatientGender = resp.data[0].Patient.Gender || '';
                                        $scope.PatientAge = resp.data[0].Patient.Age || null;
                                        $scope.PatientDOB = resp.data[0].Patient.DOB || '';
                                        $scope.PatientImageS3URL = resp.data[0].Patient.S3URL || '';
                                        $scope.PatientID = resp.data[0].Patient.PatientID || '';
                                    } else {
                                        $scope.AppointmentNotesArray = [];
                                    }
                                }, function (err) {
                                    console.log(err);
                                    alertify.error("Getting data failed");
                                });
                            }

                            $scope.patiendetilsopen = function () {
                                let patientId = $scope.Detailsobj.PatientID || 0;
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


                            $scope.getApptAdditionalDetails();
                            $scope.BindfollowUpData1 = function (val, type) {
                                var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");
                                var FollowUpDuration = parseFloat($scope.FollowUpObj.Duration) || 0;
                                $scope.cacheStorageItem.FollowUpDurationType = val;
                                $scope.cacheStorageItem.FollowUpDurationTypeName = val === "Y" ? "Year(s)" : (val === "C" ? "To Be continued" : (val === "M" ? "Month(s)" : (val === "D" ? "Day(s)" : (val === "W" ? "Week(s)" : (val === "L" ? "Life Time" : "")))));
                                var TempFollowUpObj = eHnotePatientDataService.GetFollowUpDate(FollowUpDuration, $scope.cacheStorageItem.FollowUpDurationType, TodayDate);
                                /*$scope.ReminderObj.DurationDate = TempFollowUpObj.FollowUpDate;*/
                                $scope.FollowUpObj.DurationDate = $filter('date')(new Date(TempFollowUpObj.FollowUpDate), "yyyy-MM-dd");
                            };

                            $scope.changeReminderType1 = function () {
                                $scope.FollowUpObj.DurationType = 'D';
                                $scope.FollowUpObj.Duration = '';
                                $scope.FollowUpObj.ReminderRemarks = '';
                                $scope.FollowUpObj.ReminderDate = '';
                            }


                            $scope.GetReminderLog = function () {
                                let id = RemainderItem.PatientAppointmentReminderId || null;
                                eHnoteMainAppointmentService.GetReminderLog(id).then(function (resp) {
                                    if (resp.data.status === "Success") {
                                        if (resp.data.rows.length > 0) {
                                            $scope.RemindersLogArray = angular.copy(resp.data.rows);
                                        } else {
                                            $scope.RemindersLogArray = [];
                                        }
                                        let counter = 0;
                                        angular.forEach($scope.RemindersLogArray, function (kitem) {
                                            if (kitem.ReminderStatusId == 5) {
                                                counter++;
                                            }
                                        });
                                        $scope.FollowUpCount = counter;
                                    }

                                }, function () {

                                });
                            };

                            $scope.GetReminderFollowup = function () {
                                if ($scope.ReminderObj.ReminderStatusId == 5) {
                                    let id = RemainderItem.PatientAppointmentReminderId || null;
                                    eHnoteMainAppointmentService.GetReminderFollowup(id).then(function (resp) {
                                        if (resp.data.status === "Success") {
                                            if (resp.data.rows.length > 0) {
                                                $scope.ReminderFollowUpArray = angular.copy(resp.data.rows);
                                            } else {
                                                $scope.ReminderFollowUpArray = [];
                                            }
                                        }

                                    }, function () {

                                    });
                                }
                            };

                            $scope.OnClickNotIntorDel = function (val) {
                                $scope.RemarksObj.Remarks = "";
                                if (val == 2) {
                                    $scope.RemarksObj.Type = "NOTINT";
                                } else if (val == 4) {
                                    $scope.RemarksObj.Type = "DEL";
                                }
                                $scope.RemarksObj.IsShow = true;
                            };

                            $scope.onClickNotInterested = function () {
                                if ($scope.RemarksObj.Remarks == "") {
                                    alertify.error("Please enter remarks!");
                                    return;
                                }

                                $scope.UpdateReminder(2);
                            };

                            $scope.onClickDelete = function () {
                                if ($scope.RemarksObj.Remarks == "") {
                                    alertify.error("Please enter remarks!");
                                    return;
                                }

                                $scope.UpdateReminder(4);
                            };

                            $scope.init = function () {
                                $scope.GetReminderLog();
                                //$scope.GetReminderFollowup();
                            };

                            $scope.init();

                        }
                    });
                    $scope.mInstanceAdd.result.then(function (resp) {
                        if (resp.value === 3) {
                            /*$scope.BookAppointmentFromReminder(RemainderItem);*/
                            $scope.BookAppointmentFromReminderv2(RemainderItem);
                        } else {
                            $scope.SearchList();
                        }
                    }, function () { });

                }

            }
        });
    };
    $scope.TagPatientObj = {
        "SelectTag": "Select Tag Patient",
        "PatientTag": "",
        "AllPatientTagsCheck": false,
    };


    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }



    $scope.checkAllPatientTags = function (val) {
        if (val) {
            angular.forEach($scope.PatientTagList1, function (item) {
                item.IsChecked = true;
            });

            $scope.TagPatientObj.SelectTag = 'All';
        }
        else {
            angular.forEach($scope.PatientTagList1, function (item) {
                item.IsChecked = false;
            });

            $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
        }

    };



    $scope.PatientTagToggle = function (item) {
        var checkedArray = _.where($scope.PatientTagList1, { IsChecked: true });
        $scope.TagPatientObj.AllPatientTagsCheck = checkedArray.length > 0 && $scope.PatientTagList1.length === checkedArray.length ? true : false;
        if ($scope.TagPatientObj.AllPatientTagsCheck) {
            $scope.TagPatientObj.SelectTag = 'All';
        }

        if (!$scope.TagPatientObj.AllPatientTagsCheck && checkedArray.length > 0) {
            $scope.TagPatientObj.SelectTag = 'Selected';
        } else {
            $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
        }
        //if (checkedArray.length > 4) {
        //    item.IsChecked = false;
        //    alertify.error("Patient Tag Limit is Reached");
        //    return false;
        //}
    };
    $scope.$watch("SearchObj.FromDate", function (newVal, oldVal) {
        if (moment(newVal, 'MM-DD-YYYY').isValid()) {
            var tabviewDate = moment(newVal, "MM-DD-YYYY").format("MM-DD-YYYY");
            $scope.SearchObj.FromDate = angular.copy(tabviewDate);
        } else {
            console.log("Invalid date format: " + newVal);
            // Handle invalid date format here if necessary
        }
    }, true);
    $scope.$watch("SearchObj.ToDate", function (newVal, oldVal) {
        if (moment(newVal, 'MM-DD-YYYY').isValid()) {
            var tabviewDate = moment(newVal, "MM-DD-YYYY").format("MM-DD-YYYY");
            $scope.SearchObj.ToDate = angular.copy(tabviewDate);
        } else {
            console.log("Invalid date format: " + newVal);
            // Handle invalid date format here if necessary
        }
    }, true);

    $scope.ChangeRemainderBranch = function (item) {

        if (item.ClinicId == 0) {
            if (item.IsChecked) {
                angular.forEach($scope.AppListdoctoraddress, function (mitem) {
                    mitem.IsChecked = true;
                });
            } else {
                angular.forEach($scope.AppListdoctoraddress, function (mitem) {
                    mitem.IsChecked = false;
                });
            }
        }

        var SelectedBranchArr = _.where($scope.AppListdoctoraddress, { IsChecked: true });
        $scope.LocationTypeObj.AllLocationCheck = SelectedBranchArr.length > 0 && $scope.AppListdoctoraddress.length === SelectedBranchArr.length ? true : false;

        if (SelectedBranchArr.length == 0) {
            $scope.LocationTypeObj.SelectLocationString = "Select Location";
        } else {
            if (SelectedBranchArr.length === 1) {
                $scope.LocationTypeObj.SelectLocationString = SelectedBranchArr[0].BranchName;
            } else {
                $scope.LocationTypeObj.SelectLocationString = "Selected Locations";
            }
        }
        $scope.GetVisitReasonsNew();
        $scope.getDoctorsbySubSpecializations();
    };
    $scope.OnselectAllPriorityStatus = function (selectedId) {
            $scope.SearchObj.PriorityStatus = selectedId;
    };

}]);

eHnoteWebApp.controller("ModalEditCtrl", ["$scope", function ($scope) {
    $scope.ok = function () {
        $scope.mInstanceEdit.dismiss('cancel');
    };
    $scope.cancel = function () {
        $scope.mInstanceEdit.dismiss('cancel');
    };
}]);
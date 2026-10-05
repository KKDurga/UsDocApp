"use strict";
eHnoteWebApp.controller("UsOPAuditController", [
    "$scope", "eHnoteLoginStatusService", "eHnoteMasterDataService",
    "eHnoteUserAppointmentDataService", "$filter", "$q",
    "eHnoteMainAppointmentService", "eHnotePatientDataService", "eHnoteCacheStorageService",
    "$location", "alertify", "eHnoteAuditServices", "$timeout", "$uibModal",
    "eHnoteUserDataService",
    "OpAuditDataService",
    function ($scope, eHnoteLoginStatusService, eHnoteMasterDataService,
        eHnoteUserAppointmentDataService, $filter, $q,
        eHnoteMainAppointmentService, eHnotePatientDataService, eHnoteCacheStorageService,
        $location, alertify, eHnoteAuditServices, $timeout, $uibModal,
        eHnoteUserDataService,
        OpAuditDataService) {

        var mainObject = OpAuditDataService.getData();
        var doctorInfo = eHnoteMasterDataService.getUserInfo();

        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.DoctorId = doctorInfo.doctordata.User[0].DoctorID;
        $scope.RoleId = doctorInfo.doctordata.User[0].RoleId;
        $scope.loginClinicId = doctorInfo.doctordata.UserAddress[0].ClinicId;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        $scope.connectedUserObj = {
            "Available": false,
            "Users": []
        };

        if (doctorInfo !== undefined) {
            $scope.orgUsersData = doctorInfo.doctordata.UserAddress;
            if ($scope.orgUsersData !== undefined) {
                if ($scope.orgUsersData[0] !== undefined) {
                    $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.connectedUserObj.Available = doctorInfo.doctordata.User[0].IsConnectedUsersAvailable || false;

                    if ($scope.connectedUserObj.Available) {
                        $scope.connectedUserObj.Users = doctorInfo.doctordata.UserAddress[0].ConnectedUsers || [];
                    }
                }
            }
        }


        console.log(JSON.stringify(mainObject));

        $scope.mainObject = mainObject || '';

        $scope.Visitreasons = ($scope.mainObject.Visitreasons || []).filter(function (item) {
            return item.AppointmentTypeId != 4 && item.AppointmentTypeId != 14 && item.AppointmentTypeId != 7;
        });
        $scope.AllBranchesList = $scope.mainObject.AllBranchesList;
        $scope.MultiselectDoctorlist = $scope.mainObject.MultiselectDoctorlist;
        $scope.mainObject.allUserList = $scope.mainObject.allUserList || []


        $scope.StatusMaster = [
            { Id: 0, Name: "All" },
            { Id: 1, Name: "Not Signed" },
            { Id: 2, Name: "Signed" }
        ];

        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };

        $scope.AllDoctorsObj = {
            "AllDoctorCheck": false,
            "AllVisitReasonsCheck": false,
        }

        $scope.Pagination = {
            "currentPagePatient": 1,
            "Patientitemsperpage": 100,
            "Patientmaxsize": 10
        };
        $scope.searchHospital = { "visitRsnName": "", "apptTypename": "" };
        $scope.searchtxtb = { "txt1": "", "txt2": "" };

        $scope.IsLoading = false;
        $scope.HasMoreRecords = true;

        function getStatusListFilter() {
            return {
                "FromDate": moment().format("MM-DD-YYYY"),
                "ToDate": moment().format("MM-DD-YYYY"),
                "SearchType": 2,
                "SearchText": ''
            };
        }
        $scope.StatusListFilterObj = getStatusListFilter();

        $scope.PreviousFromDate = $scope.StatusListFilterObj.FromDate;
        $scope.PreviousToDate = $scope.StatusListFilterObj.ToDate;

        $scope.ValidateDateRange = function () {

            if (!$scope.StatusListFilterObj.FromDate || !$scope.StatusListFilterObj.ToDate)
                return;

            var fromDate = moment($scope.StatusListFilterObj.FromDate, "MM-DD-YYYY");
            var toDate = moment($scope.StatusListFilterObj.ToDate, "MM-DD-YYYY");
            var today = moment().startOf('day');

            // Invalid dates
            if (!fromDate.isValid() || !toDate.isValid()) {
                return;
            }

            // Future date validation
            if (fromDate.isAfter(today) || toDate.isAfter(today)) {

                alertify.error("Future dates are not allowed.");

                $scope.StatusListFilterObj.FromDate = $scope.PreviousFromDate;
                $scope.StatusListFilterObj.ToDate = $scope.PreviousToDate;
                return;
            }

            // From Date > To Date
            if (fromDate.isAfter(toDate)) {

                alertify.error("From Date cannot be greater than To Date.");

                $scope.StatusListFilterObj.FromDate = $scope.PreviousFromDate;
                $scope.StatusListFilterObj.ToDate = $scope.PreviousToDate;
                return;
            }

            // Maximum 30 days
            if (toDate.diff(fromDate, "days") > 30) {

                alertify.error("Date range cannot exceed 30 days.");

                $scope.StatusListFilterObj.FromDate = $scope.PreviousFromDate;
                $scope.StatusListFilterObj.ToDate = $scope.PreviousToDate;
                return;
            }

            // Save valid values
            $scope.PreviousFromDate = $scope.StatusListFilterObj.FromDate;
            $scope.PreviousToDate = $scope.StatusListFilterObj.ToDate;
        };

        $scope.GetStatusList = function () {

            if ($scope.IsLoading)
                return;

            $scope.IsLoading = true;

            var params = {
                "HospitalID": $scope.HospitalId,
                "PageSize": $scope.Pagination.Patientitemsperpage,
                "PageNumber": $scope.Pagination.currentPagePatient,
                "UserId": eHnoteMasterDataService.getLoginId(),

            };
            var newlist1 = "";
            for (var i in $scope.Visitreasons) {
                if ($scope.Visitreasons[i].isChecked) {
                    newlist1 += "," + $scope.Visitreasons[i].ParentAppointmentVisitReasonId;
                }
            }
            if (newlist1.charAt(0) === ",") {
                newlist1 = newlist1.slice(1);
            }

            var newlist2 = "";
            for (var i in $scope.MultiselectDoctorlist) {
                if ($scope.MultiselectDoctorlist[i].isChecked) {
                    newlist2 += "," + $scope.MultiselectDoctorlist[i].DoctorID;
                }
            }
            if (newlist2.charAt(0) === ",") {
                newlist2 = newlist2.slice(1);
            }
            var locationIds = $scope.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            params.Locationids = locationIds;
            params.VisitReasonIds = newlist1;
            params.DoctorIds = newlist2;
            params.ChartStatusId = $scope.SelectedStatus.Id;
            params.FromDate = $scope.StatusListFilterObj.FromDate
            params.ToDate = $scope.StatusListFilterObj.ToDate

            params.SearchType = $scope.StatusListFilterObj.SearchType || 2;
            params.SearchText = $scope.StatusListFilterObj.SearchText || "";

            var obj = {
                "Visitreasons": $scope.Visitreasons || [],
                "AllBranchesList": $scope.AllBranchesList || [],
                "MultiselectDoctorlist": $scope.MultiselectDoctorlist || [],
                "FromDate": $scope.StatusListFilterObj.FromDate || null,
                "ToDate": $scope.StatusListFilterObj.ToDate || null,
                "ChartStatusId": $scope.SelectedStatus.Id || 0,
            };
            eHnoteMasterDataService.addSelectedAuditOPUsers(obj);


            eHnoteMainAppointmentService.GetAllBookedAppointmentforAllOpAudit(params, OnGetListofAppointmentSuccess, OnGetListofAppointmentError);

            function OnGetListofAppointmentSuccess(bookdata) {

                $scope.mainBookedAppointmentListCount = bookdata.count;

                angular.forEach(bookdata.AppointmentList, function (item) {

                    item.ApptSign = item.ApptSign || "NotSigned";

                    var datetime = item.ConsultationDt + "T" + item.StartTime;
                    var formattedStartTime = $filter('date')(datetime, "hh:mm a");

                    item.ConvertedStartTime = formattedStartTime;
                    item.ConvertDateStartTime = formattedStartTime;
                    item.ExpressCheckOutTime = item.TrackerDetails?.[0]?.ExpressCheckOutTime || null;
                    if (item.ExpressCheckOutTime) {
                        var dateTime = moment().format("YYYY-MM-DD") + "T" + item.ExpressCheckOutTime;
                        item.ExpressCheckOutTime = $filter('date')(dateTime, "hh:mm a");
                    }

                    if (item.WalkInTime) {
                        item.WalkInTime = $filter('date')(item.WalkInTime, "hh:mm a");
                    }

                    if (item.WalkOutTime) {
                        item.WalkOutTime = $filter('date')(item.WalkOutTime, "hh:mm a");
                    }

                });

                if ($scope.Pagination.currentPagePatient == 1) {
                    $scope.AllAppointments = angular.copy(bookdata.AppointmentList);
                    $scope.OpAuditlBookedAppointmentList =
                        angular.copy(bookdata.AppointmentList);

                }
                else {

                    Array.prototype.push.apply($scope.AllAppointments, bookdata.AppointmentList);
                    Array.prototype.push.apply($scope.OpAuditlBookedAppointmentList,bookdata.AppointmentList);
                }

                $scope.IsLoading = false;

            }
            function OnGetListofAppointmentError(bookdata) {
                $scope.IsLoading = false;
                alertify.error("Error in listing Appointments");
            }
        }

        $scope.init = function () {

            var savedFilter = eHnoteMasterDataService.getaddSelectedAuditOPUsers();

            $scope.selectedDoctors = "Select Doctor";
            $scope.selectedVisitReason = "Select";
            $scope.OpAuditlBookedAppointmentList = [];
            $scope.AllAppointments = [];

            // Dates
            $scope.StatusListFilterObj.FromDate = savedFilter.FromDate || moment().format("MM-DD-YYYY");
            $scope.StatusListFilterObj.ToDate = savedFilter.ToDate || moment().format("MM-DD-YYYY");

             // Status
            $scope.SelectedStatus = $scope.StatusMaster.find(function (x) {
                return x.Id == savedFilter.ChartStatusId;
            }) || $scope.StatusMaster[1];

            /******************** VISIT REASONS ************************/

            if (savedFilter.Visitreasons && savedFilter.Visitreasons.length > 0) {
                $scope.Visitreasons = angular.copy(savedFilter.Visitreasons);
            } else {
                angular.forEach($scope.Visitreasons, function (item) {
                    item.isChecked = true;
                });
            }

            var checkedVisitReasons = _.where($scope.Visitreasons, { isChecked: true });

            $scope.AllDoctorsObj.AllVisitReasonsCheck =
                checkedVisitReasons.length == $scope.Visitreasons.length;

            if (checkedVisitReasons.length == 0)
                $scope.selectedVisitReason = "Select";
            else if ($scope.AllDoctorsObj.AllVisitReasonsCheck)
                $scope.selectedVisitReason = "All Visit Reasons";
            else if (checkedVisitReasons.length == 1)
                $scope.selectedVisitReason = checkedVisitReasons[0].AppointmentVisitReasonName;
            else
                $scope.selectedVisitReason = "Selected";


            /******************** DOCTORS ************************/

            if (savedFilter.MultiselectDoctorlist && savedFilter.MultiselectDoctorlist.length > 0) {

                // Restore saved doctors
                $scope.MultiselectDoctorlist = angular.copy(savedFilter.MultiselectDoctorlist);

            } else {

                // Default doctor selection
                if ($scope.MultiselectDoctorlist.length > 0) {

                    if ($scope.connectedUserObj.Available) {

                        if (doctorInfo.doctordata.User[0].RoleId == 1) {

                            var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });

                            $scope.AllDoctorsObj.AllDoctorCheck =
                                checkedArray.length > 0 &&
                                checkedArray.length === $scope.MultiselectDoctorlist.length;

                            if (checkedArray.length == 0) {
                                $scope.selectedDoctors = "Select Doctors";
                            }
                            else if (checkedArray.length == 1) {
                                $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                            }
                            else {
                                $scope.selectedDoctors = $scope.AllDoctorsObj.AllDoctorCheck ? "All" : "Selected Doctors";
                            }

                        } else {

                            angular.forEach($scope.MultiselectDoctorlist, function (item) {

                                item.isChecked = false;
                                $scope.AllDoctorsObj.AllDoctorCheck = false;

                                if (item.DoctorID === doctorInfo.doctordata.User[0].DoctorID) {
                                    item.DoctorfullNamewithNPI = item.NPI + '-' + item.SecondUserFullName;
                                    item.isChecked = true;
                                }

                                angular.forEach($scope.connectedUserObj.Users, function (user) {
                                    if (user.ChildUserId == item.DoctorID) {
                                        item.isChecked = true;
                                    }
                                });

                            });

                            $scope.selectedDoctors = "Selected Doctors";
                        }

                    } else {

                        if ($scope.userLoginDetails.RoleID != 1 &&
                            $scope.userLoginDetails.RoleID != 43) {

                            angular.forEach($scope.MultiselectDoctorlist, function (item) {
                                item.isChecked = true;
                            });

                            $scope.AllDoctorsObj.AllDoctorCheck = true;
                            $scope.selectedDoctors = "All";

                        } else {

                            angular.forEach($scope.MultiselectDoctorlist, function (item) {

                                if (doctorInfo.doctordata.User[0].DoctorID == item.DoctorID) {

                                    item.isChecked = true;
                                    $scope.selectedDoctors = item.SecondUserFullName + '-' + item.NPI;

                                } else {

                                    item.isChecked = false;

                                }

                            });

                            $scope.AllDoctorsObj.AllDoctorCheck = false;
                        }
                    }
                }
            }

            // Common code (runs for both saved and default selections)
            var checkedDoctors = _.where($scope.MultiselectDoctorlist, { isChecked: true });

            $scope.AllDoctorsObj.AllDoctorCheck =
                checkedDoctors.length > 0 &&
                checkedDoctors.length === $scope.MultiselectDoctorlist.length;

            if (checkedDoctors.length === 0) {
                $scope.selectedDoctors = "Select Doctors";
            }
            else if (checkedDoctors.length === 1) {
                $scope.selectedDoctors = checkedDoctors[0].SecondUserFullName + "-" + checkedDoctors[0].NPI;
            }
            else {
                $scope.selectedDoctors = $scope.AllDoctorsObj.AllDoctorCheck ? "All" : "Selected Doctors";
            }
            

            /******************** LOCATIONS ************************/

            if (savedFilter.AllBranchesList && savedFilter.AllBranchesList.length > 0) {
                $scope.AllBranchesList = angular.copy(savedFilter.AllBranchesList);
            }
            else {
                angular.forEach($scope.AllBranchesList, function (item) {
                    if (item.ClinicId == $scope.loginClinicId) {
                        item.IsChecked = true;
                    } else {
                        item.IsChecked = false;
                    }
                });

            }

            var checkedLocations = _.where($scope.AllBranchesList, { IsChecked: true });

            if (checkedLocations.length == 0)
                $scope.LocationTypeObj.SelectLocationString = "Select Location";
            else if (checkedLocations.length == $scope.AllBranchesList.length)
                $scope.LocationTypeObj.SelectLocationString = "All Locations";
            else if (checkedLocations.length == 1)
                $scope.LocationTypeObj.SelectLocationString = checkedLocations[0].BranchName;
            else
                $scope.LocationTypeObj.SelectLocationString = "Selected";

            /******************** LOAD LIST ************************/

            $scope.GetStatusList();
        };

        $scope.init();

        setTimeout(function () {

            var scrollDiv = angular.element(document.querySelector("#divStatusScroll"));

            scrollDiv.off("scroll.statuslist");

            scrollDiv.on("scroll.statuslist", function () {

                if ($scope.IsLoading)
                    return;

                var ele = this;

                if (ele.scrollTop + ele.clientHeight >= ele.scrollHeight - 20) {

                    if ($scope.OpAuditlBookedAppointmentList.length >= $scope.mainBookedAppointmentListCount)
                        return;

                    $scope.$applyAsync(function () {

                        $scope.Pagination.currentPagePatient++;

                        $scope.GetStatusList();

                    });
                }

            });

        }, 300);

        $scope.SelectStatus = function (item) {
            $scope.SelectedStatus = item;
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

                $scope.selectedVisitReason = 'Select';
            }
            var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
            $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;

        };

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

        $scope.VisitRsnToggle = function () {
            var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
            $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;

        };

        $scope.DoctorToggle = function () {
            var checkedArray = _.where($scope.MultiselectDoctorlist, { isChecked: true });
            $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.MultiselectDoctorlist.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedDoctors = "Select Doctor";
            } else {
                if (checkedArray.length === 1) {
                    $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.selectedDoctors = "Selected Doctors";
                }
            }

        };

        $scope.changeAppointmentBranch = function (obj) {
            if (obj.IsChecked) {
                $scope.LocationTypeObj.SelectLocationString = "Selected";
                if (obj.ClinicId === 0) {
                    angular.forEach($scope.AllBranchesList, function (mitem) {
                        mitem.IsChecked = true;
                    });

                    $scope.LocationTypeObj.SelectLocationString = "All Locations";
                }
                else {


                    if ($scope.AllBranchesList.every(mitem => mitem.ClinicId === 0 || mitem.IsChecked)) {
                        $scope.AllBranchesList.forEach(mitem => {
                            if (mitem.ClinicId === 0) {
                                mitem.IsChecked = true;

                                $scope.LocationTypeObj.SelectLocationString = "All Locations";
                            }
                        });
                    }

                }

            }
            else {
                if (obj.ClinicId === 0) {
                    angular.forEach($scope.AllBranchesList, function (mitem) {
                        mitem.IsChecked = false;
                    });
                }
                else {
                    angular.forEach($scope.AllBranchesList, function (mitem) {
                        if (mitem.ClinicId === 0) {
                            mitem.IsChecked = false;
                        }
                    });

                }

                $scope.LocationTypeObj.SelectLocationString = "Selected";

                var nofalsecount = 0;
                angular.forEach($scope.AllBranchesList, function (mitem) {
                    if (mitem.IsChecked) {
                        nofalsecount++;
                    }
                });
                if (nofalsecount === 0) {
                    $scope.LocationTypeObj.SelectLocationString = "Select Location";
                }
            }

        };

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        $scope.ApplyFilter = function () {

            $scope.Pagination.currentPagePatient = 1;
            $scope.OpAuditlBookedAppointmentList = [];
            $scope.AllAppointments = [];
            $scope.IsLoading = false;
            
            $scope.GetStatusList();

        }

        $scope.RefreshAppointments = function () {
            $scope.Pagination.currentPagePatient = 1;
            $scope.OpAuditlBookedAppointmentList = [];
            $scope.AllAppointments = [];
            $scope.IsLoading = false;
            $scope.StatusListFilterObj = getStatusListFilter();
            eHnoteMasterDataService.addSelectedAuditOPUsers({});
            $scope.init();
        }

        $scope.ShowPatientDetailsPopup = function (row) {
            let patientId = row.PatientID || 0;

            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);

            function ongetPatientDetailsSuccess(data) {
                if (!data || !data.Patient || !data.Patient.length) return;

                const patient = data.Patient[0];
                const otherDetails = (patient.PatientOtherDetails && patient.PatientOtherDetails.length)
                    ? patient.PatientOtherDetails[0]
                    : {};
                var mobileNo = ''
                if (patient.MobileNo) {
                    var formattedMobile = eHnoteUserDataService.UsMobileFormatChange(patient.MobileNo);
                    mobileNo = formattedMobile.UsFormatMobileNumber || "";
                }
                row.PatientName = patient.FullName || "";
                row.PatientMrNo = patient.PatientDisplayId || "";

                const patientDetails = {
                    FullName: patient.FullName || "",
                    PatientDisplayId: patient.PatientDisplayId || "",
                    DisplayID: patient.PatientDisplayId || "",
                    MobileNo: mobileNo || "",
                    DOB: patient.DOB || "",
                    AgeInYears: patient.AgeInYears || 0,
                    AgeInMonths: patient.AgeInMonths || 0,
                    S3URL: patient.S3URL || "",
                    SocialSecurityNo: patient.SocialSecurityNo || "",
                    BloodGroupName: otherDetails.BloodGroupName || "",
                    MaritalStatusName: otherDetails.MaritalStatus || "",
                    ExternalComanagerName: patient.ExternalComanagerName || "",
                    InternalComanagerName: patient.InternalComanagerName || "",
                    ContactInfo: {
                        EmailID: patient.EmailId || ""
                    }
                };

                row.PatientDetails = angular.copy(patientDetails);
                row.PatientDetailsList = angular.copy(patientDetails);
            }

            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        };

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };

        $scope.ContinueSignOffpassword = function (type, item) {

            $scope.Isfromchart = false;
            if (type == 'SignOff') {
                $scope.Isfromchart = true;

            }
            $scope.cacheStorageItem.AppointmentId = item.AppointmentID;
            $scope.AddToCache();

            let obj = {
                "Screen": "Chart",
                "Type": type || "",
                "VisitId": item.VisitId,
                "Isfromchart": $scope.Isfromchart || false,
                "DoctorId": item.DoctorID,
                "allUserList": angular.copy($scope.mainObject.allUserList),


            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
                "controller": "UsPasswordAuthenticationPopupCtrl",
                "size": "md",
                //"windowClass": "appointment-full-popup",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.Pagination.currentPagePatient = 1;
                $scope.OpAuditlBookedAppointmentList = [];
                $scope.AllAppointments = [];
                $scope.StatusListFilterObj.SearchText = "";
                $scope.IsLoading = false;
                if ($scope.VisitSummaryObj) {
                    $scope.VisitSummaryObj.ApptSign = 'Signed';
                }

                $scope.GetStatusList();

            }, function (data) {

            });


        }

        $scope.ApplySearch = function () {

            $scope.Pagination.currentPagePatient = 1;
            $scope.OpAuditlBookedAppointmentList = [];
            $scope.AllAppointments = [];
            $scope.mainBookedAppointmentListCount = 0;
            $scope.IsLoading = false;
            $scope.GetStatusList();
        };

        $scope.ClearSearch = function () {

            $scope.StatusListFilterObj = {
                SearchType: $scope.StatusListFilterObj.SearchType || 2,
                SearchText: "",
                FromDate: $scope.StatusListFilterObj.FromDate,
                ToDate: $scope.StatusListFilterObj.ToDate
            };
            $scope.IsLoading = false;
            $scope.Pagination.currentPagePatient = 1;
            $scope.OpAuditlBookedAppointmentList = [];
            $scope.AllAppointments = [];
            $scope.mainBookedAppointmentListCount = 0;

            $scope.GetStatusList();
        };

        //$scope.SearchPatient = function () {

        //    var searchText = ($scope.StatusListFilterObj.SearchText || "").toLowerCase().trim();

        //    if (!searchText) {
        //        $scope.OpAuditlBookedAppointmentList = angular.copy($scope.AllAppointments);
        //        return;
        //    }

        //    $scope.OpAuditlBookedAppointmentList = $scope.AllAppointments.filter(function (item) {

        //        if ($scope.StatusListFilterObj.SearchType == 1) {

        //            return item.Patient.FullName &&
        //                item.Patient.FullName.toLowerCase().indexOf(searchText) > -1;

        //        } else if ($scope.StatusListFilterObj.SearchType == 2) {

        //            return item.Patient.PatientDisplayId &&
        //                item.Patient.PatientDisplayId.toLowerCase().indexOf(searchText) > -1;

        //        } else if ($scope.StatusListFilterObj.SearchType == 4) {

        //            return moment(item.Patient.DOB).format("MM-DD-YYYY")
        //                .indexOf(searchText) > -1;
        //        }

        //        return true;
        //    });
        //};
        

        //$scope.newclearPatientApptSearch = function () {
        //    $scope.StatusListFilterObj.SearchText = "";
        //    $scope.OpAuditlBookedAppointmentList = angular.copy($scope.AllAppointments);
        //};

        $scope.finishAudit = function (resp) {
            OpAuditDataService.clearData();
            $scope.$emit('usOpAuditClosed', resp);
        };

        $scope.viewVisitSummary = function (item) {

            $scope.VisitSummaryObj = {
                AppointmentID: item.AppointmentID || 0,
                VisitId: item.VisitId || 0,
                DoctorID: item.DoctorID || 0,
                ApptSign: item.ApptSign || "",
                AppointmentStatus: item.AppointmentStatus || "",
                BranchName: item.BranchName || "",
                DoctorFullName: item.DoctorFullName || "",

                // Patient Details
                PatientFullName: "",
                PatientDisplayID: "",
                PatientGender: "",
                AgeInYears: 0,
                AgeInMonths: "",
                AgeInDays: "",
                PatientDOB: "",
                PatientMobileNumber: "",
                S3URL: ""
            };

            eHnoteAuditServices.getPatientDetailsById(
                item.PatientID,
                ongetPatientSuccess,
                ongetPatientError
            );

            function ongetPatientSuccess(data) {

                if (!data || !data.Patient || data.Patient.length === 0) {
                    return;
                }

                var patientitem = data;
                var patient = patientitem.Patient[0];

                // Patient Details
                $scope.VisitSummaryObj.PatientFullName = patient.FullName || "";
                $scope.VisitSummaryObj.PatientDisplayID = patient.PatientDisplayId || "";
                $scope.VisitSummaryObj.PatientGender = patient.Gender || "";
                $scope.VisitSummaryObj.ageinYears = patient.AgeInYears || 0;
                $scope.VisitSummaryObj.ageinMonths = patient.AgeInMonths ? patient.AgeInMonths.toString() : "";
                $scope.VisitSummaryObj.ageinDays = patient.AgeInDays ? patient.AgeInDays.toString() : "";
                $scope.VisitSummaryObj.S3URL = patient.S3URL;

                // DOB
                $scope.VisitSummaryObj.PatientDOB = patient.DOB
                    ? $filter('date')(patient.DOB, "MM-dd-yyyy")
                    : "";

                // Mobile Number
                var patientMobileNumber = (patient.Altareacode || "") + (patient.PatientHomeNumber || "");
                var mobileObj = eHnoteUserDataService.UsMobileFormatChange(patientMobileNumber);
                $scope.VisitSummaryObj.PatientMobileNumber = mobileObj.UsFormatMobileNumber;

                // Store Patient Data
                eHnoteMasterDataService.addpatientData(patientitem);

                // Cache
                $scope.cacheStorageItem.patientid = item.PatientID || 0;
                $scope.cacheStorageItem.IsAuditScreenInd = true;
                $scope.AddToCache();

                // Appointment Info
                var appointmentinfo = {
                    AppointmentID: item.AppointmentID || 0,
                    AppointmentId: item.AppointmentID || 0,
                    PatientID: item.PatientID || 0,
                    VisitId: item.VisitId || 0
                };

                eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);

                // Open Visit Summary Popup
                $uibModal.open({
                    templateUrl: "consultationSummaryPopup.html",
                    backdrop: "static",
                    keyboard: false,
                    scope: $scope,
                    windowClass: "modal__popup--1 bottom-to-top-modal",
                    controller: function ($scope, $uibModalInstance) {

                        $scope.uibclose = function () {
                            $uibModalInstance.dismiss("cancel");
                        };
                    }
                });
            }

            function ongetPatientError(error) {
                console.error("Error loading patient details:", error);
            }

        };

        $scope.SignoffPopover = {
            templateUrl: 'SignoffPopover.html',
        }
        $scope.popoverData = {};

        $scope.setPopoverData = function (row) {
            $scope.popoverData = row;
        };

        $scope.$on("$destroy", function () {

            angular.element(document.querySelector("#divStatusScroll"))
                .off("scroll.statuslist");

        });

        $scope.filterPopover = {
            templateUrl: 'filterPopoverOpAudit.html',
        };

    }]);
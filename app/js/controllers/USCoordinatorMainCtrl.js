"use strict";
eHnoteWebApp.controller("USCoordinatorMainCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "localStorageFactory", "eHnoteSurgeryService", "eHnoteInsuranceService", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "eHnoteLabService", "SurgeryStaticDataService", "loginCookieFactory", "eHnoteMainAdminServices", "eHnoteAuditServices", "$timeout", "$q", "eHnoteDbStaticDataService", "eHnoteUserDataService", "eHnotePatientVisitReasonServices", "eHnotePatientAddressDataServices", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, localStorageFactory, eHnoteSurgeryService, eHnoteInsuranceService, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, eHnoteLabService, SurgeryStaticDataService, loginCookieFactory, eHnoteMainAdminServices, eHnoteAuditServices, $timeout, $q, eHnoteDbStaticDataService, eHnoteUserDataService, eHnotePatientVisitReasonServices, eHnotePatientAddressDataServices) {



    $scope.patientsearchType = 1;
    $scope.MainTab = 1;
    $scope.SubTab = 1;
    $scope.searchPatientTxt = "";
    $scope.searchPatientIdTxt = "";
    $scope.AllUserBranchesList = [];
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.SpecializationId = 0;
    $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
    $scope.hospid = "";
    $scope.patientPageSize = 10;
    $scope.patientPageNumber = 1;
    $scope.patientmaxSize = 5;
    $scope.Selectedpatient = "";
    $scope.SelectedParticularPatient = "";
    $scope.SelectedPatientInvestigationList = [];
    $scope.SelectedPatientProcedureList = [];
    $scope.SelectedPatientContactLensList = [];
    $scope.SelectedPatientSurgeriesList = [];
    $scope.showEditInvestigation = false;
    $scope.showEditProcedures = false;
    $scope.showEditContactLens = false;
    $scope.showEditSurgery = false;
    $scope.showAddSurgery = false;
    $scope.showAddContactLens = false;
    $scope.showInvInsurance = false;
    $scope.showContactLensInsurance = false;
    $scope.showProcedureInsurance = false;
    $scope.orgBillingPackagePageSize = 10;
    $scope.orgBillingPackagePageNumber = 1;
    $scope.ImageFileUploadCount = 0;
    $scope.EditInvestigationList = [];
    $scope.IolPageSize = 10;
    $scope.IolPageNumber = 1;
    $scope.IolmaxSize = 5;
    $scope.SelectPaymentTypeId = 1;
    $scope.IsCreditBillingType = 'No';
    $scope.showInsurance = false;
    $scope.ShowNewConsultation = 'N';
    $scope.SelectedFile = 4;
    $scope.currentDate = $filter('date')(new Date(), "dd-MMM-yyyy");
    $scope.currentDate1 = $filter('date')(new Date(), "yyyy-MM-dd");
    $scope.EmptySelect = { ClinicName: '-- Select --' };
    $scope.EmptyDoctorSelect = { FullName: '-- Select --', DoctorID: '' };
    $scope.appDate = moment().format("DD-MMM-YYYY");
    $scope.patinet_consultationTime = "";
    $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
    $scope.InvSpecialityId = 3;
    $scope.GetAllSpecialityInd = 1;
    $scope.ShowInvestigationAndMedicationData = false;
    $scope.SelectedEyeoptha = 3;
    $scope.SurgeryInvestigationList = [];
    $scope.isGlobalPrescription = false;
    $scope.SelectedPatientName = "";
    $scope.SelectedPatientAppointmentId = 0;
    $scope.searchMedicine = { "txt1": "" };
    $scope.SelectPrescriptionTemplate = 'Select';
    $scope.IntakeArray = SurgeryStaticDataService.GetIntakeAarray();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();

    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.CustomPrescFrequency = angular.copy(mObj.PrescriptionFrequencies);
    $scope.PrescriptionTemplates = angular.copy(mObj.masterMedicineTemplatesArray) || [];
    $scope.InvestigationTemplates = [];
    $scope.InvestigationTemplatesCount = 0;
    $scope.masterInvestigationTemplatesArray = [];
    $scope.InvestigationTemplates = angular.copy(mObj.masterInvestigationTemplatesArray) || [];
    $scope.masterInvestigationTemplatesArray = angular.copy(mObj.masterInvestigationTemplatesArray) || [];
    $scope.ReserveIolDetailsList = [];
    datapersistanceFactory.set("CoordinatorToProfile", '');

    $scope.obj = {
        "SelectedInvestigationItem": "",
        "Type": "Active"
    };
    $scope.GetSurgeryObject = function () {
        return {
            "PatientId": 0,
            "SurgeonId": 0,
            "UserId": 0,
            "HospitalID": 0,
            "AppointmentID": 0,
            "DoctorVisitRsnID": 8,// for surgery appointment type
            "SurgeryAnesthesiaDoctorId": 0,
            "SurgeryAssistantId": 0,
            "SurgeryCounselorId": 0,
            "SendDocSms": false,
            "SendDocEmail": false,
            "sendPatientEmail": false,
            "sendPatientSms": false,
            "SendAnesthesistSms": false,
            "SendAnesthesistEmail": false,
            "SendAssistantSms": false,
            "SendAssistantEmail": false,
            "SendCounselorSms": false,
            "SendCounselorEmail": false,
            "PatientName": "",
            "SurgeryType": "AppointmentSurgery",
            "selectedBranchobj": "",
            "searchHospital": "",
            "SelectedAnesthesist": "",
            "SelectedAssistant": "",
            "SelectedCounselor": "",
            "ConsentFormDetails": [],
            "ConsentTempImagesArray": [],
            "ConsentTempPdfArray": [],
            "SurgerySuggestedDate": moment().format("DD-MMM-YYYY"),
            "AppointmentDate": moment().format("DD-MMM-YYYY"),
            "SurgeryList": [],
            "IOLPower": ""
        };
    };
    $scope.Surgery = angular.copy($scope.GetSurgeryObject());
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.hospitalcd = "";
        $scope.hospid = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.parenthospId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }
    $scope.Showeditpatient = false;

    if ($scope.UserSettingObject !== undefined) {
        if ($scope.UserSettingObject.ShowNewConsultation) {
            $scope.ShowNewConsultation = 'Y';
        }
    }
    $scope.paymentTypeObj = {
        "OrgInsuranceTpaId": 0,
        "PatientInsuranceId": 0
    };
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.AppointmentCheckInDynamicStatus = 0;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            $scope.AppointmentCheckInDynamicStatus = $scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus;
        }
    }






    $scope.GetCordinatorFollowUpList = function () {
        var obj = {
            "FromDate": $filter('date')(new Date($scope.CounsellorSearchObj.FromDate), "yyyy-MM-dd"),
            "ToDate": $filter('date')(new Date($scope.CounsellorSearchObj.ToDate), "yyyy-MM-dd"),
            "HospitalId": $scope.CounsellorSearchObj.HospitalId,
            "PageSize": $scope.patientPageSize,
            "PageNumber": $scope.patientPageNumber,
            //"SearchName": $scope.CounsellorSearchObj.SearchName,
            //"SearchMrno": $scope.CounsellorSearchObj.SearchMrno,

        }
        if ($scope.patientsearchType == 1) {
            obj.SearchText = $scope.CounsellorSearchObj.SearchName;
        } else if ($scope.patientsearchType == 2) {
            obj.SearchText = $scope.CounsellorSearchObj.SearchMrno;
        }
        eHnoteSurgeryService.GetCordinatorAppointmentFollowUpList(obj).then(function (resp) {
            $scope.CordinatorFollowUpList = [];
            if (resp.data.Status == "Success") {
                $scope.CordinatorFollowUpList = resp.data.rows || [];
            }



        });
    }



    $scope.GetCounsellorSearchObj = function () {
        return {
            "FromDate": moment().format("M-DD-YYYY"),
            "ToDate": moment().format("M-DD-YYYY"),
            "HospitalId": "",
            "PageSize": "",
            "PageNumber": "",
            "SearchName": "",
            "SearchMrno": "",
            //"Type": "4",
            "Type": "0",
            "HospitalObj": "",
            "HospitalName": ""
        };
    };

    $scope.CounsellorSearchObj = angular.copy($scope.GetCounsellorSearchObj());
    function bindDoctorSlots(MinPerCaseval, type) {
        var currenttimewithZero = 0;
        if ($scope.selectedDocObject !== "") {
            $scope.setValue = [];
            if (type === "current") {
                var count = 0;
                var hourStartCount = type === "current" ? moment().format("HH") : 0;
                var minutesStartCount = type === "current" ? moment().format("mm") : 0;
                hourStartCount = parseInt(hourStartCount);
                minutesStartCount = parseInt(minutesStartCount);
                for (var i = hourStartCount; i <= 23; i++) {
                    count = 0;
                    var hr = i < 10 ? "0" + i : i;
                    var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
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
                if ($scope.dateVal) {
                    $scope.patinet_appStarttime = _.where($scope.setValue, { StartTime: moment($scope.dateVal).format("HH:mm") })[0];
                    //$scope.dateVal = '';
                } else {
                    $scope.patinet_appStarttime = $scope.setValue[0];
                }
            } else {
                var count = 0;
                for (var i = 0; i <= 23; i++) {
                    count = 0;
                    var hr = i < 10 ? "0" + i : i;
                    var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
                    $scope.setValue.push({ StartTime: hr + ":00" });
                    for (var j = 0; j <= minutesCount; j++) {
                        count = count + MinPerCaseval;
                        if (count < 60) {
                            var minute = count < 10 ? "0" + count : count;
                            $scope.setValue.push({ StartTime: hr + ':' + minute });
                        }
                    }
                }
                if ($scope.dateVal) {
                    $scope.patinet_appStarttime = _.where($scope.setValue, { StartTime: moment($scope.dateVal).format("HH:mm") })[0];
                }
            }
            if ($scope.appCondate) {
                if ($scope.setValue[0].StartTime > $scope.BindStartAppTime) {
                    $scope.patinet_appStarttime = null;
                } else {
                    $scope.FindTime = $filter("filter")($scope.setValue, { "StartTime": $scope.BindStartAppTime }, true);
                    if ($scope.FindTime.length > 0) {
                        $scope.patinet_appStarttime = $scope.FindTime[0];
                    }
                }
            }
        }
    }
    $scope.getUserBranchslots = function (SelectedDoctorId) {
        SelectedDoctorId = parseInt(SelectedDoctorId);
        $scope.SelectedBranchDocId = SelectedDoctorId;
        $scope.selectedDocObject = "";

        var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === SelectedDoctorId);
        if (Index > -1) {
            $scope.selectedDocObject = $scope.clinicDoctorList[Index];
        }
        $scope.patinet_appStarttime = '';
        $scope.doctorName = $scope.selectedDocObject.FullName;
        $scope.selectedDocObject = $scope.selectedDocObject || "";


        var doctorTeleMinpercaseval = $scope.selectedDocObject.MinPerCase;
        if ($scope.appCondate === undefined || $scope.appCondate === '') {
            if (doctorTeleMinpercaseval === 60) {
                $scope.patinet_consultationTime = '1h';
                $scope.patinet_consultationTimeDisplay = '1 hr(s)';
            } else {
                $scope.patinet_consultationTime = doctorTeleMinpercaseval + 'm';
                $scope.patinet_consultationTimeDisplay = doctorTeleMinpercaseval + ' mins';
            }
        }
        if ($scope.selectedBranchobj.IsRestrictAppointmentSlot && $scope.selectedDocObject !== "") {
            var appointmentDate = $filter('date')(new Date($scope.appDate), "yyyy-MM-dd");
            var params = {
                "DoctorId": SelectedDoctorId,
                "UserBranchId": $scope.selectedDocObject.UserBranchId,
                "Date": appointmentDate
            };

            eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);

            function OnGetSuccess(response) {
                if (response.status === 'Success') {
                    angular.forEach(response.NormalSlots, function (item) {
                        item.StartTime = item.StartTime.substring(0, 5);
                    });
                    // reStructureDoctorSelectedSlots(response);
                }

            }
            function OnGetError(response) {
                var MinPerCaseval = $scope.selectedDocObject.MinPerCase;
                if ($scope.appDate) {
                    $scope.setValue = [];
                    if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                        bindDoctorSlots(MinPerCaseval, 'current');
                    } else {
                        bindDoctorSlots(MinPerCaseval, 'all');
                    }
                }
            }
        } else {
            var MinPerCaseval = $scope.selectedDocObject.MinPerCase;
            if ($scope.appDate) {
                $scope.setValue = [];
                if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                    bindDoctorSlots(MinPerCaseval, 'current');
                } else {
                    bindDoctorSlots(MinPerCaseval, 'all');
                }
            }

        }
    };
    $scope.changeAppointmentDoctor = function (SelectedDoctorId, type) {
        SelectedDoctorId = parseInt(SelectedDoctorId);
        $scope.SelectedBranchDocId = SelectedDoctorId;
        $scope.selectedDocObject = "";
        var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === SelectedDoctorId);
        if (Index > -1) {
            $scope.selectedDocObject = $scope.clinicDoctorList[Index];
        }
        $scope.patinet_appStarttime = '';


        if ($scope.selectedDocObject.MinPerCase !== undefined) {
            if ($scope.patinet_consultationTime === 60) {
                $scope.patinet_consultationTime = '1h';
            } else {
                $scope.patinet_consultationTime = $scope.selectedDocObject.MinPerCase + 'm';
            }
        }
        $scope.noData = "";
        if (JSON.stringify($scope.showDayID) === "true") {
            $scope.dayConfig.visible = true;
        }
        var MinPerCaseval = $scope.selectedDocObject.MinPerCase;


        $scope.restrictDoctorSlots = false;

        if ($scope.selectedBranchobj !== undefined) {
            if ($scope.selectedBranchobj.IsRestrictAppointmentSlot) {
                $scope.restrictDoctorSlots = true;
            }
        }


        if ($scope.restrictDoctorSlots && SelectedDoctorId !== 0) {//writen by bharath
            //  $scope.getUserBranchslots(SelectedDoctorId);
        } else {
            if ($scope.appDate) {
                $scope.setValue = [];
                if (moment($scope.appDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
                    bindDoctorSlots(MinPerCaseval, 'current');
                } else {
                    bindDoctorSlots(MinPerCaseval, 'all');
                }
            }
        }

    };
    function getDoctorsbySubSpecializations(branchId) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        $scope.AllDoctorsList = [];
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId === branchId; });
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
        };

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;
                $scope.AllDoctorsList = [];
                $scope.AllDoctorsList = angular.copy($scope.allUserList);
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllARList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.clinicDoctorList = angular.copy($scope.allUserList);
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllDoctorsList = _.uniq($scope.AllDoctorsList, false, function (p) { return p.DoctorID; });
                $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                    return item.RoleId === 18;
                });
                $scope.AllDoctorAnesthesiologist = $filter("filter")($scope.AllDoctorsList, function (item) {
                    return item.RoleId === 30;
                });

                $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                    return item.RoleId === 10;
                });

                $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
                $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                    return item.RoleId === 61;
                });
                $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
                $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                    return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
                });
                $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                    return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                });

                $scope.AllDoctorAnesthesiologist.unshift($scope.EmptyDoctorSelect);
                $scope.AllDoctorAssistant = $filter("filter")($scope.AllDoctorsList, function (item) {
                    return item.RoleId === 29;
                });
                $scope.AllDoctorAssistant.unshift($scope.EmptyDoctorSelect);
                $scope.AllDoctorsList = $filter("filter")($scope.AllDoctorsList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
                });
                $scope.AllDoctorsList.unshift($scope.EmptyDoctorSelect);

                $scope.Surgery.SelectedSurgeon = $filter("filter")($scope.AllDoctorsList, { "DoctorID": $scope.doctorinfo.doctorid }, true)[0] || "";
                if ($scope.Surgery.SelectedSurgeon !== "") {
                    $scope.changeAppointmentDoctor($scope.Surgery.SelectedSurgeon.DoctorID);
                }

            } else {
                //alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
            }
        }

        function onGetUsersFailure(data) {
        }
    }

    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }

        });
    };
    function InitializeNewBranches(data) {
        $scope.AllUserBranchesList = [];
        if (data.length !== 0) {
            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.OTListAllBranchesSurgeries, data, $scope.doctorinfo) || [];

            $scope.AppListdoctoraddress = angular.copy(BrachesList);
            $scope.AllUserBranchesList = BrachesList;
            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];
            $scope.selectedBranchobj = $scope.selectedBranch;
            $scope.Surgery.selectedBranchobj = $scope.selectedBranch;
            $scope.clinicDoctorList = [];

            $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                return item.BranchId === $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];

            $scope.CounsellorSearchObj.HospitalObj = $scope.defaultbranch[0];
            $scope.CounsellorSearchObj.HospitalId = $scope.defaultbranch[0].BranchId;
            $scope.CounsellorSearchObj.SubOrganizationId = $scope.selectedBranch.SubOrganizationId;
            //$scope.IOLSearchObj.HospitalObj = $scope.defaultbranch[0];
            //$scope.IOLSearchObj.HospitalId = $scope.defaultbranch[0].BranchId;
            //$scope.IOLSearchObj.SubOrganizationId = $scope.selectedBranch.SubOrganizationId;
            GetBranchSubSpecializations($scope.CounsellorSearchObj.SubOrganizationId, $scope.CounsellorSearchObj.HospitalId);
        }
    }

    $scope.ChangeHospital = function (item) {
        $scope.CounsellorSearchObj.HospitalObj = item;
        $scope.selectedBranch = item;
        $scope.CounsellorSearchObj.HospitalId = $scope.selectedBranch.BranchId;
    };

    $scope.init = function () {
        var brancList = localStorageFactory.getItem("allBranchesData") || [];
        OnGetDoctorSuccess(brancList);
        $scope.GetSearch();
        $scope.SearchCounsellorPatientList();


    };
    $scope.GetListOfPatientStatusList = function (PatientId, type, item) {
        $scope.CounsellorSearchObj.Type = type.toString();
        $scope.Selectedpatient = PatientId;
        $scope.SelectedPatientAppointmentId = item.AppointmentId || 0;
        var obj = {
            "PatientId": $scope.Selectedpatient,
            "HospitalId": $scope.CounsellorSearchObj.HospitalId,
            "Type": type
        };
        return eHnoteSurgeryService.GetStatuswiseAllProcedureDetailsByPatientId(obj).then(function (response) {
            if (response.data.Status === 'Success') {
                if (response.data.rows !== undefined) {
                    if (type === 1 || type === "1") {
                        $scope.SubTab = 1;
                        $scope.SelectedPatientInvestigationList = [];
                        $scope.SelectedPatientInvestigationList = response.data.rows;
                        if ($scope.SelectedPatientInvestigationList.length !== 0) {
                            $scope.SelectedParticularPatient = $scope.SelectedPatientInvestigationList[0];
                            $scope.SelectedParticularPatient.colors = '#af77c6';
                        } else {
                            $scope.SelectedPatientInvestigationList = [];
                            $scope.SelectedParticularPatient.PatientName = item.PatientName || "";
                        }
                    }
                    if (type === 2 || type === "2") {
                        $scope.SubTab = 2;
                        $scope.SelectedPatientProcedureList = [];
                        $scope.SelectedPatientProcedureList = response.data.rows;
                        if ($scope.SelectedPatientProcedureList.length !== 0) {
                            $scope.SelectedParticularPatient = $scope.SelectedPatientProcedureList[0];
                            $scope.SelectedParticularPatient.colors = '#af77c6';

                        } else {
                            $scope.SelectedPatientProcedureList = [];
                            $scope.SelectedParticularPatient.PatientName = item.PatientName || "";
                        }
                    }
                    if (type === 3 || type === "3") {
                        $scope.SubTab = 3;
                        $scope.SelectedPatientContactLensList = [];
                        $scope.SelectedPatientContactLensList = response.data.rows;
                        if ($scope.SelectedPatientContactLensList.length !== 0) {
                            $scope.SelectedParticularPatient = $scope.SelectedPatientContactLensList[0];
                            $scope.SelectedParticularPatient.colors = '#af77c6';

                        } else {
                            $scope.SelectedPatientContactLensList = [];
                            $scope.SelectedParticularPatient.PatientName = item.PatientName || "";
                        }
                    }
                    if (type === 4 || type === "4") {
                        $scope.SubTab = 4;
                        $scope.SelectedPatientSurgeriesList = [];
                        $scope.AcceptedSurgeryList = [];
                        $scope.SelectedPatientSurgeriesList = response.data.rows;
                        if ($scope.SelectedPatientSurgeriesList.length !== 0) {
                            $scope.SelectedParticularPatient = $scope.SelectedPatientSurgeriesList[0];
                            $scope.SelectedParticularPatient.colors = '#af77c6';
                            angular.forEach($scope.SelectedPatientSurgeriesList, function (kitem) {
                                kitem.InsuranceType = "No";
                                if (kitem.OrgInsuranceTpaId !== 0) {
                                    kitem.InsuranceType = "Yes";
                                }
                                //else {
                                //    kitem.InsuranceType = "No";
                                //}
                                if (kitem.SurgeryInvestigationList.length > 0) {
                                    $scope.SurgeryInvestigationList = [];
                                    $scope.SurgeryInvestigationList = kitem.SurgeryInvestigationList;
                                }
                                if (kitem.SurgeryMedicationList.length > 0) {
                                    $scope.SurgeryMedicationsArray = [];
                                    angular.forEach(kitem.SurgeryMedicationList, function (ritem) {
                                        if (ritem.MedicineId !== 0) {
                                            ritem.MedicineObj = ritem.MedicineName;
                                            ritem.OrganId = ritem.OrganId.toString();
                                            ritem.DurationTypeName = ritem.DurationType === "Y" ? "Years(s)" : (ritem.DurationType === "M" ? "Month(s)" : (ritem.DurationType === "D" ? "Day(s)" : (ritem.DurationType === "W" ? "Week(s)" : (ritem.DurationType === "C" ? "To Be continued" : (ritem.DurationType === "L" ? "Life Time" : "")))));
                                            if (ritem.FrequencyId === 0) {
                                                ritem.FrequencyObj = ritem.Frequency;
                                            } else {
                                                ritem.FrequencyObj = {
                                                    "FrequencyId": ritem.FrequencyId,
                                                    "Name": ritem.Frequency,
                                                    "Code": ritem.Frequency,
                                                    "FrequencyType": 'C'
                                                };
                                            }
                                        }
                                    });
                                    $scope.SurgeryMedicationsArray = kitem.SurgeryMedicationList;
                                }
                                if (kitem.OrganizationSurgeryId != 0) {
                                    var params = {
                                        "HospitalId": $scope.CounsellorSearchObj.HospitalId,
                                        "PageSize": $scope.orgBillingPackagePageSize,
                                        "PageNumber": $scope.orgBillingPackagePageNumber,
                                        "OrgSurgeryId": kitem.OrganizationSurgeryId || 0,
                                        "SurgeryListId": kitem.SurgeryListId
                                    };

                                    return eHnoteSurgeryService.GetSurgeryPackagesByCounsellorStatus(params).then(function (response) {
                                        if (response.data.Count !== 0) {
                                            if (response.data.rows !== undefined) {
                                                $scope.SurgerypackagesList = [];
                                                $scope.SurgerypackagesList = response.data.rows;

                                                if ($scope.SurgerypackagesList.length > 0) {
                                                    var upgradeobj = "";
                                                    upgradeobj = $filter("filter")($scope.SurgerypackagesList, { "StatusId": '13' })[0] || "";
                                                    kitem.UpgradePackage = "";
                                                    if (upgradeobj != "") {
                                                        kitem.UpgradePackage = upgradeobj.SurgeryBillingName;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            $scope.SelectedParticularPatient.PatientName = item.PatientName || "";
                        }

                    }
                    if (response.data.rows.length > 0) {
                        //    eHnoteInsuranceService.getPatientInsuranceDtls(response.data.rows[0].PatientId).then(function (response) {
                        eHnoteInsuranceService.getPatientInsuranceDtls($scope.Selectedpatient).then(function (response) {

                            $scope.mainOrgInsTpaArray = [];
                            if (response.data !== undefined) {
                                if (response.data.rows !== undefined) {
                                    $scope.patientInsuranceTpasArray = response.data.rows;
                                    if ($scope.patientInsuranceTpasArray.length === 0) {
                                        $scope.showInsurance = true;
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    if (type === 1) {
                        $scope.SelectedPatientInvestigationList = [];
                    }
                    if (type === 2) {
                        $scope.SelectedPatientProcedureList = [];
                    }
                    if (type === 3) {
                        $scope.SelectedPatientContactLensList = [];
                    }
                    if (type === 4) {
                        $scope.SelectedPatientSurgeriesList = [];
                    }
                }
            }
        });
    };
    function OnGetDoctorSuccess(data) {
        InitializeNewBranches(data);
    }

    $scope.GetSearch = function () {
        if ($scope.obj.Type == 'Follow-Up') {
            $scope.GetCordinatorFollowUpList();
        } else {
            $scope.SearchCounsellorPatientList();
        }
    }
    $scope.SearchCounsellorPatientList = function () {
        $scope.patientList = [];
        var obj = {
            //"FromDate": $filter('date')(new Date($scope.CounsellorSearchObj.FromDate), "yyyy-MM-dd"),
            //"ToDate": $filter('date')(new Date($scope.CounsellorSearchObj.ToDate), "yyyy-MM-dd"),
            "Date": $filter('date')(new Date($scope.CounsellorSearchObj.FromDate), "yyyy-MM-dd"),
            "HospitalId": $scope.CounsellorSearchObj.HospitalId,
            "PageSize": $scope.patientPageSize,
            "PageNumber": $scope.patientPageNumber,
            //"SearchName": $scope.CounsellorSearchObj.SearchName,
            //"SearchMrno": $scope.CounsellorSearchObj.SearchMrno,
            //"Type": $scope.CounsellorSearchObj.Type ? parseInt($scope.CounsellorSearchObj.Type) : 0

        };
        if ($scope.patientsearchType == 1) {
            obj.SearchText = $scope.CounsellorSearchObj.SearchName;
        } else if ($scope.patientsearchType == 2) {
            obj.SearchText = $scope.CounsellorSearchObj.SearchMrno;
        }
        //   return eHnoteSurgeryService.GetCounsellorPatientListByStatus(obj).then(function (response) {
        return eHnoteSurgeryService.GetCordinatorAppointmentList(obj).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows.length !== 0) {
                    $scope.patientList = [];
                    $scope.PatientInsuranceList = [];
                    $scope.PatientTagList = [];
                    $scope.patientList = response.data.rows;
                    $scope.PatientInsuranceList = response.data.rows[0].PatientInsuranceList || [];
                    $scope.PatientTagList = response.data.rows[0].PatientTagList || [];
                    $scope.patienttotalItems = response.data.Count;
                    if ($scope.patientList.length > 0) {
                        $scope.Selectedpatient = $scope.patientList[0].PatientId;
                        $scope.SelectedPatientName = $scope.patientList[0].PatientName || "";
                        $scope.SelectedPatientAppointmentId = $scope.patientList[0].AppointmentId || 0;
                    }
                    $scope.Mobilenumberus = '';
                    angular.forEach($scope.patientList, function (item) {
                        $scope.Mobilenumberus = item.Patient.PhAreaCD + item.Patient.HomeNumber;
                        $scope.Objectusnumber = eHnoteUserDataService.UsMobileFormatChange($scope.Mobilenumberus);
                        $scope.UserMobilenumberFormat = $scope.Objectusnumber.UsFormatMobileNumber;
                    });

                   

                    if ($scope.patientList.length >0) {

                        angular.forEach($scope.patientList, function (object, index) {
                            if (object.TrackerDetails.length > 0) {
                                angular.forEach(object.TrackerDetails, function (titem) {
                                    titem.isWaitingSlot = false;
                                    titem.isActiveSlot = false;
                                    titem.isCompletedSlot = false;
                                    titem.isWaitNormalSlot = false;
                                    titem.isWaitGreenSlot = false;
                                    titem.isWaitYellowSlot = false;
                                    titem.isWaitRedSlot = false;
                                    titem.isActiveNormalSlot = false;
                                    titem.isActiveGreenSlot = false;
                                    titem.isActiveYellowSlot = false;
                                    titem.isActiveRedSlot = false;
                                    titem.isCompletedNormalSlot = false;
                                    titem.isCompletedGreenSlot = false;
                                    titem.isCompletedYellowSlot = false;
                                    titem.isCompletedRedSlot = false;
                                    if (titem.UserId === 0 && titem.RoomTypeId !== 0) {
                                        titem.isWaitingSlot = true;

                                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                        // var apptDt = $filter('date')(new Date(item.consultationDt), "yyyy-MM-dd");
                                        //var apptDt = $filter('date')(new Date(object.ConsultationDt), "yyyy-MM-dd");
                                        var apptDt = object.ConsultationDt;
                                        var dresult = dateCompare(apptDt, currentDt);




                                        if (dresult) {


                                            var DiffMinutes = getcurrentTimeDifferenceMinutes(titem.WaitingStartTime);
                                            var waittimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                            titem.WaitTime = waittimec;


                                            if (DiffMinutes <= 5) {
                                                titem.isWaitNormalSlot = true;
                                            }
                                            else if (DiffMinutes > 5 && DiffMinutes <= 10) {
                                                titem.isWaitGreenSlot = true;
                                            }
                                            else if (DiffMinutes > 10 && DiffMinutes <= 15) {
                                                titem.isWaitYellowSlot = true;
                                            }
                                            else if (DiffMinutes > 15) {
                                                titem.isWaitRedSlot = true;
                                            }
                                        }
                                        else {



                                            var actSt = titem.WaitTime.split(':');
                                            var actSthour = parseFloat(actSt[0]) || 0;
                                            var actStmin = parseFloat(actSt[1]) || 0;
                                            var actStsec = parseFloat(actSt[2]) || 0;






                                            if (actSthour > 0) {
                                                titem.isWaitRedSlot = true;
                                            } else {

                                                if (DiffMinutes <= 5) {
                                                    titem.isWaitNormalSlot = true;
                                                }
                                                else if (DiffMinutes > 5 && DiffMinutes <= 10) {
                                                    titem.isWaitGreenSlot = true;
                                                }
                                                else if (DiffMinutes > 10 && DiffMinutes <= 15) {
                                                    titem.isWaitYellowSlot = true;
                                                }
                                                else if (DiffMinutes > 15) {
                                                    titem.isWaitRedSlot = true;
                                                }

                                                titem.WaitTime = actSt[1] + ":" + actSt[2];
                                            }




                                        }

                                    }
                                    else if (titem.UserId !== 0 && titem.RoomTypeId !== 0) {

                                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                        var apptDt = $filter('date')(new Date(object.ConsultationDt), "yyyy-MM-dd");
                                        var dresult = dateCompare(apptDt, currentDt)


                                        if (dresult) {
                                            var actSt = titem.ActiveStartTime.split(':');
                                            var actSthour = parseFloat(actSt[0]) || 0;
                                            var actStmin = parseFloat(actSt[1]) || 0;
                                            var actStsec = parseFloat(actSt[2]) || 0;

                                            var actEt = titem.ActiveEndTime.split(':');
                                            var actEthour = parseFloat(actEt[0]) || 0;
                                            var actEtmin = parseFloat(actEt[1]) || 0;
                                            var actEtsec = parseFloat(actEt[2]) || 0;

                                            if (actEthour == 0 && actEtmin === 0 && actEtsec == 0) {
                                                if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
                                                    titem.isActiveSlot = true;

                                                    var activet = titem.WaitTime.split(':');
                                                    var activethour = parseFloat(activet[0]) || 0;
                                                    var activetmin = parseFloat(activet[1]) || 0;
                                                    var activetsec = parseFloat(activet[2]) || 0;

                                                    if (activethour > 0) {
                                                        titem.isActiveRedSlot = true;

                                                    }
                                                    else {

                                                        if (activetmin <= 5) {
                                                            titem.isActiveNormalSlot = true;
                                                        }
                                                        else if (activetmin > 5 && activetmin <= 10) {
                                                            titem.isActiveGreenSlot = true;
                                                        }
                                                        else if (activetmin > 10 && activetmin <= 15) {
                                                            titem.isActiveYellowSlot = true;
                                                        }
                                                        else if (activetmin > 15) {
                                                            titem.isActiveRedSlot = true;
                                                        }

                                                        titem.WaitTime = activet[1] + ":" + activet[2];

                                                    }
                                                    var DiffMinutes = getcurrentTimeDifferenceMinutes(titem.ActiveStartTime);



                                                    var ActiveTimec = getHrsnMinutesFormatfromMinutes(DiffMinutes);
                                                    console.log(ActiveTimec + "_ActiveTimec");
                                                    titem.ActiveTime = ActiveTimec;
                                                }
                                            }
                                            else {
                                                titem.isCompletedSlot = true;

                                                var activet = titem.WaitTime.split(':');
                                                var activethour = parseFloat(activet[0]) || 0;
                                                var activetmin = parseFloat(activet[1]) || 0;
                                                var activetsec = parseFloat(activet[2]) || 0;

                                                if (activethour > 0) {
                                                    titem.isCompletedRedSlot = true;

                                                }
                                                else {

                                                    if (activetmin <= 5) {
                                                        titem.isCompletedNormalSlot = true;
                                                    }
                                                    else if (activetmin > 5 && activetmin <= 10) {
                                                        titem.isCompletedGreenSlot = true;
                                                    }
                                                    else if (activetmin > 10 && activetmin <= 15) {
                                                        titem.isCompletedYellowSlot = true;
                                                    }
                                                    else if (activetmin > 15) {
                                                        titem.isCompletedRedSlot = true;
                                                    }

                                                    titem.WaitTime = activet[1] + ":" + activet[2];
                                                }

                                                var newactivet = titem.ActiveTime.split(':');
                                                var newactivethour = parseFloat(newactivet[0]) || 0;
                                                var newactivetmin = parseFloat(newactivet[1]) || 0;
                                                var newactivetsec = parseFloat(newactivet[2]) || 0;

                                                if (newactivethour > 0) {

                                                } else {
                                                    titem.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                                }

                                            }
                                        }
                                        else {



                                            var actSt = titem.WaitTime.split(':');
                                            var actSthour = parseFloat(actSt[0]) || 0;
                                            var actStmin = parseFloat(actSt[1]) || 0;
                                            var actStsec = parseFloat(actSt[2]) || 0;






                                            if (actSthour > 0) {
                                                titem.isCompletedSlot = true;
                                            } else {

                                                if (actStmin <= 5) {
                                                    titem.isCompletedNormalSlot = true;
                                                }
                                                else if (actStmin > 5 && actStmin <= 10) {
                                                    titem.isCompletedGreenSlot = true;
                                                }
                                                else if (actStmin > 10 && actStmin <= 15) {
                                                    titem.isCompletedYellowSlot = true;
                                                }
                                                else if (actStmin > 15) {
                                                    titem.isCompletedRedSlot = true;
                                                }

                                                titem.WaitTime = actSt[1] + ":" + actSt[2];
                                            }


                                            var newactivet = titem.ActiveTime.split(':');
                                            var newactivethour = parseFloat(newactivet[0]) || 0;


                                            if (newactivethour > 0) {

                                            } else {
                                                titem.ActiveTime = newactivet[1] + ":" + newactivet[2];
                                            }
                                        }


                                    }


                                    if (titem.ActiveTime === undefined || titem.ActiveTime === null) {
                                        titem.ActiveTime = "00:00";
                                    }

                                });

                                var actSt = object.TrackerDetails[0].ActiveStartTime.split(':');
                                var actSthour = parseFloat(actSt[0]) || 0;
                                var actStmin = parseFloat(actSt[1]) || 0;
                                var actStsec = parseFloat(actSt[2]) || 0;



                                if (actSthour !== 0 || actStmin !== 0 || actStsec !== 0) {
                                    object.IsPatientCallActive = true;
                                }

                            }
                        });
                    }
                   
                
                }
            }
            else {
                $scope.patientList = [];
                $scope.Selectedpatient = 0;
                $scope.SelectedPatientInvestigationList = [];
                $scope.SelectedPatientProcedureList = [];
                $scope.SelectedPatientContactLensList = [];
                $scope.SelectedPatientSurgeriesList = [];
            }
        });
    };

    $scope.init();
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

    $scope.ChangeSubcontent = function (row) {
        $scope.ClickPatientProfile(row);
    };



    $scope.ChangeFollowUpSubcontent = function (row) {

        row.PatientID = row.PatientId;
        row.AppointmentID = row.AppointmentId;
        row.Patient = {
            "PatientID": row.PatientId
        }
        $scope.ClickPatientProfile(row);
    };


    $scope.ClickPatientProfile = function (item) {
       // $rootScope.$broadcast("CoordinatorToProfile", item);
        item.PatientID = item.PatientID;
        item.Patient.PatientID = item.PatientID;
        item.AppointmentId = item.AppointmentID;
        eHnoteMasterDataService.addPatientDetailsforBarcode(item);
        //eHnoteMasterDataService.addpatientData(item.PatientDetails);
        //eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        eHnoteMasterDataService.addAppointmentInfo(item);



        $scope.cacheStorageItem.patientid = item.PatientID;
        //item.MasterPatientId = item.Patient.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.PatientID;
        $scope.cacheStorageItem.ProfileStatusMasterId = item.ProfileStatusMasterId;
        //item.Gender = item.Patient.Gender || "";
        //item.PatientGSTNO = item.Patient.GSTNO || "";
        ////item.BranchArea = item.BranchDetails.Area;
        //$scope.cacheStorageItem.PatientName = item.Patient.Fullname;
        //$scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;
        //$scope.cacheStorageItem.appointmentid = item.AppointmentId;
        //$scope.cacheStorageItem.AppointmentID = item.AppointmentId;
        //$scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        //$scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        //$scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        //eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        //if ($scope.AllDoctorList != undefined) {
        //    $scope.cacheStorageItem.AllDoctorsList = $scope.AllDoctorList || [];
        //}

        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
       // datapersistanceFactory.set("CounsellorToProfile", item);
        
        //$timeout(function () {
        //    $rootScope.$broadcast('CoordinatorToProfile', item);

        //}, 300);
        datapersistanceFactory.set("CoordinatorToProfile", item);
        $location.url("/profile");

       
      

    };





    $scope.Technishionsend = function (item) {

        if (item.CheckinStatusId === 1) {
            alertify.error("Please make sure patient is checked-in");
            return false;
        }

        $scope.IsShowCheckinDeatilsInd = false;
        var PatientObj = {
            "PatientName": item.Patient.FullName,
            "PatientId": item.Patient.PatientID,
            "PhAreaCD": item.Patient.PhAreaCD || '',
            "PhCntryCD": item.Patient.PhCntryCD || '',
            "HomeNumber": item.Patient.HomeNumber || '',
            "MobileNo": item.Patient.MobileNo || '',
            "DOB": item.Patient.DOB || '',
            "OldMRNo": item.Patient.OldMRNo || '',
            "PatientDisplayId": item.Patient.PatientDisplayId || '',
            "CheckInBy": ""
        };
        if (PatientObj.DOB != '') {
            PatientObj.DOB = $filter('date')(PatientObj.DOB, "MM-dd-yyyy");
        }

        var params = {
            "AppointmentId": item.AppointmentID || 0,
        };
        eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
            if (resp.data.Status === 'Success') {
                if (resp.data.rows.length > 0) {
                    var DynamicStatusarray = resp.data.rows[0];
                    PatientObj.CheckInBy = DynamicStatusarray.CheckInBYName || "";

                    if (($scope.userLoginDetails.RoleID == 2 && DynamicStatusarray.RoomTypeId == 10) || ($scope.userLoginDetails.RoleID == 10 && DynamicStatusarray.RoomTypeId == 2) ||
                        ($scope.userLoginDetails.RoleID == 18 && DynamicStatusarray.RoomTypeId == 4) || ($scope.userLoginDetails.RoleID == 19 && DynamicStatusarray.RoomTypeId == 9) ||
                        (($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) && (DynamicStatusarray.RoomTypeId == 12 || DynamicStatusarray.RoomTypeId == 1)) ||
                        ($scope.userLoginDetails.RoleID == 20 && DynamicStatusarray.RoomTypeId == 10) || ($scope.userLoginDetails.RoleID == 21 && DynamicStatusarray.RoomTypeId == 10)) {

                        $scope.DynamicStatusInstanceAdd = $uibModal.open({
                            templateUrl: "sendToPatientTemplate.html",
                            /*"size": "lg",*/
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
                                "HospitalEquipmentList": function () { return $scope.HospitalEquipmentList; },
                                "ProfileStatusMasterId": function () { return item.ProfileStatusMasterId; },
                                "AppointmentObj": function () { return item;},
                                "PatientObj": function () { return PatientObj || {}; },
                                "PatientTagList": function () { return $scope.PatientTagList; },
                            },
                            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, Currentstatus, VisitTyepId, PreviousRoomTypeId, HospitalEquipmentList, ProfileStatusMasterId, AppointmentObj, PatientObj, PatientTagList) {
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
                                $scope.IsShowCheckinDeatilsInd = true;
                                $scope.HospitalEquipmentList = HospitalEquipmentList || [];
                                $scope.ProfileStatusMasterId = ProfileStatusMasterId;
                                $scope.RoomType = {
                                    "IsSelectedCheckout": false,
                                    "IsSelectedExpressCheckout": false
                                };
                                $scope.ApptObj = {
                                    "VisitTypeId": AppointmentObj.VisitTypeId,
                                    "HospitalEquipmentId": AppointmentObj.HospitalEquipmentId
                                }
                                $scope.PatientObj = PatientObj || {};

                                let selectedpatienttaglist = angular.copy(PatientTagList);
                                $scope.SelectedPatientTagList = angular.copy($scope.HospitalEquipmentList);

                                if (selectedpatienttaglist.length > 0) {
                                    angular.forEach(selectedpatienttaglist, function (item) {
                                        angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                                            if (kitem.HospitalEquipmentId === item.HospitalEquipmentId) {
                                                kitem.IsChecked = true;
                                            }
                                        });
                                    });
                                }

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
                                        /*return item.RoleId === 1 || item.RoleId === 43;*/
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

                                $scope.GetVisitReasonfunction = function (val) {
                                    var getParams = {
                                        "OrganizationId": $scope.HospitalId,
                                        "ReasonTypeId": 1,
                                        "SearchText": val || "",
                                        "VisitTypeId": $scope.VisitTyepId || null
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
                                $scope.GetVisitReasonfunction();
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

                                        $scope.PatientTagList = [];
                                        let selectedPatientTagsList = [];
                                        selectedPatientTagsList = $filter('filter')($scope.SelectedPatientTagList, { "IsChecked": true }, true);
                                        $scope.PatientTagList = angular.copy(selectedPatientTagsList);

                                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                        var params = {
                                            "UserId": eHnoteMasterDataService.getLoginId(),
                                            "TransferUserId": eHnoteMasterDataService.getLoginId(),
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
                                            "IsReCheckOut": "N",
                                            "IsExpressCheckedOut": "N",
                                            "Remarks": $scope.RoomSearchObj.Remarks || '',
                                            "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                            "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                                            "PatientTagList": $scope.PatientTagList
                                        }
                                        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                            if (resp.data.Status == "Success") {
                                                $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                                var params = {
                                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                                    "TransferUserId": eHnoteMasterDataService.getLoginId(),
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
                                                    "IsReCheckOut": "N",
                                                    "IsExpressCheckedOut": "N",
                                                    "Remarks": '',
                                                    "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                                    "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                                                    "PatientTagList": $scope.PatientTagList
                                                }

                                                console.log($scope.RoleId);
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
                                            "TransferUserId": eHnoteMasterDataService.getLoginId(),
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
                                            "IsReCheckOut": "N",
                                            "IsExpressCheckedOut": "N",
                                            "Remarks": $scope.RoomSearchObj.Remarks || '',
                                            "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                            "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                                            "PatientTagList": $scope.PatientTagList
                                        }

                                        console.log($scope.RoleId);
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
                                };

                                $scope.stopClosingDropDown = function (event) {
                                    event.stopPropagation();
                                }
                            },



                        });

                        $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
                            //$scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                            $scope.SearchCounsellorPatientList();
                        }, function (cancel) {
                        });
                    }
                    else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 21 || $scope.userLoginDetails.RoleID == 10 || $scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43 || $scope.userLoginDetails.RoleID == 19) && (DynamicStatusarray.RoomTypeId == 1 || DynamicStatusarray.RoomTypeId == 2 || DynamicStatusarray.RoomTypeId == 4 || DynamicStatusarray.RoomTypeId == 9 || DynamicStatusarray.RoomTypeId == 12 || DynamicStatusarray.RoomTypeId == 10) && DynamicStatusarray.Status == 'Waiting') {
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20' > Patient is " + DynamicStatusarray.Status + " at " + DynamicStatusarray.RoomType + ", Do you want to take patient to your Room ? </h4> ",
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
                                        "HospitalEquipmentList": function () { return $scope.HospitalEquipmentList; },
                                        "ProfileStatusMasterId": function () { return item.ProfileStatusMasterId; },
                                        "AppointmentObj": function () { return item; },
                                        "PatientObj": function () { return PatientObj || {}; }
                                    },
                                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, PreviousRoomTypeId, HospitalEquipmentList, ProfileStatusMasterId, AppointmentObj, PatientObj) {
                                        $scope.RoleId = roleId;
                                        $scope.HospitalId = HospitalId;
                                        $scope.DoctorFullName = DoctorFullName;
                                        $scope.AppointmentDoctorID = AppointmentDoctorID;
                                        $scope.allUserList = allUserList;
                                        $scope.allSubSpecializationsArray = subSplArray;
                                        $scope.appointmentid = appointmentid;
                                        $scope.patientid = patientid;
                                        $scope.PreviousRoomTypeId = PreviousRoomTypeId;
                                        $scope.IsShowCheckinDeatilsInd = true;
                                        $scope.HospitalEquipmentList = HospitalEquipmentList || [];
                                        $scope.ProfileStatusMasterId = ProfileStatusMasterId;
                                        $scope.RoomType = {
                                            "IsSelectedCheckout": false,
                                            "IsSelectedExpressCheckout": false
                                        };
                                        $scope.ApptObj = {
                                            "VisitTypeId": AppointmentObj.VisitTypeId,
                                            "HospitalEquipmentId": AppointmentObj.HospitalEquipmentId
                                        }
                                        $scope.PatientObj = PatientObj || {};
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
                                                /* return item.RoleId === 1 || item.RoleId === 43;*/
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

                                        $scope.GetVisitReasonfunction = function (val) {
                                            var getParams = {
                                                "OrganizationId": $scope.HospitalId,
                                                "ReasonTypeId": 1,
                                                "SearchText": val || "",
                                                "VisitTypeId": $scope.VisitTyepId || null
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
                                        $scope.GetVisitReasonfunction();
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
                                                "TransferUserId": eHnoteMasterDataService.getLoginId(),
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
                                                "IsReCheckOut": "N",
                                                "IsExpressCheckedOut": "N",
                                                "Remarks": $scope.RoomSearchObj.Remarks || '',
                                                "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                                "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null
                                            }
                                            eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                                if (resp.data.Status == "Success") {
                                                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                                    var params = {
                                                        "UserId": eHnoteMasterDataService.getLoginId(),
                                                        "TransferUserId": eHnoteMasterDataService.getLoginId(),
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
                                                        "IsReCheckOut": "N",
                                                        "IsExpressCheckedOut": "N",
                                                        "Remarks": '',
                                                        "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                                        "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null
                                                    }

                                                    console.log($scope.RoleId);
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
                                    //$scope.loadAppointments($scope.selectedDoctor, 'PageLoad');
                                    $scope.SearchCounsellorPatientList();
                                }, function (cancel) {
                                });
                            }, function () {
                                return false;
                            });
                    }

                    else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 21 || DynamicStatusarray.RoleID == 9) && (DynamicStatusarray.RoomTypeId == 1 || DynamicStatusarray.RoomTypeId == 2 || DynamicStatusarray.RoomTypeId == 4) && DynamicStatusarray.Status == 'Active') {
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

    $scope.GetAllHospitalEquipments = function () {
        //var obj = {
        //    "ParentOrganizationId": $scope.ParenthospitalId
        //}
        $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
        eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.HospitalEquipmentList = resp.data.rows || [];
                //$scope.HospitalEquipmentList = $filter("filter")($scope.HospitalEquipmentList, function (Nitem) {
                //    return Nitem.HospitalEquipmentId === 1 || Nitem.HospitalEquipmentId === 4;
                //}) || [];

            }
        });
    };
    $scope.GetAllHospitalEquipments();
}]);
"use strict";
eHnoteWebApp.controller("USOPandOTAppointmentListCtrl", ["$scope", "$log", "$rootScope", "$location", "$uibModal", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteValidateUsersDataService", "eHnoteLoginStatusService", "datacookieFactory", "$window", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "alertify", "uiCalendarConfig", "eHnotePatientPVService", "eHnotePatientVisitReasonServices", "eHnoteDiagnosisDataServices", "DeCodeFilter", "$q", "$interval", "localStorageFactory", "eHnoteProcedureDataService", "SyncService", "eHnoteSettingsDataService", "eHnoteAuditServices", "eHnotePrintService", "eHnoteUserDataService", "eHnotePatientAddressDataServices", "eHnoteMainAdminServices", "InventoryService",
    function ($scope, $log, $rootScope, $location, $uibModal, $filter, $timeout, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, $window, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserAppointmentDataService, alertify, uiCalendarConfig, eHnotePatientPVService, eHnotePatientVisitReasonServices, eHnoteDiagnosisDataServices, DeCodeFilter, $q, $interval, localStorageFactory, eHnoteProcedureDataService, SyncService, eHnoteSettingsDataService, eHnoteAuditServices, eHnotePrintService, eHnoteUserDataService, eHnotePatientAddressDataServices, eHnoteMainAdminServices, InventoryService) {
    $scope.ReferralList = [];
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    $scope.DoctorId = doctorInfo.doctordata.User[0].DoctorID;
    $scope.GetAllIndicator = 0;
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    $scope.HospitalID = 0;
    $scope.ParentHospitalId = 0;
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            var hospitalCD = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            var hospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

        $scope.HospitalID = hospitalID;
            $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }

    $scope.patSearchType = 2;


    $scope.init = function () {

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

    };

    $scope.AppListdoctoraddress = [];
    $scope.AppListselectedclinic = [];
    $scope.selectedBranch = [];
    $scope.OrgSpecialitiesArray = [];
    $scope.allSubSpecializationsArray = [];
    $scope.newAllSubSpecializationsArray = [];
    $scope.clinicDoctorList = [];
    $scope.allUserList = [];
    $scope.selectedDoctor = "";

    $scope.AllCounsollerList =[];
    $scope.AllDilationList = [];
    $scope.AllTechnicianList = [];
    $scope.AllOpthaList = [];
    $scope.AllDoctorList = [];
    $scope.AllARList = [];
    $scope.AllBillingList = [];
    $scope.clinicARAssistantList = [];
    $scope.clinicOptometristsList = [];
    var onchageselectappoint = 0;
    $scope.selectedDocCSSid = 0;
    $scope.searchHospital = { "txt1": "" };
    $scope.searchtxtb = { "txt1": "", "txt2": "" };
        $scope.Appointment = {
            "Date": $filter('date')(new Date(), "MM-dd-yyyy")
        };
        $scope.ConsultationDt = moment().format("MM-DD-YYYY");
    $scope.PageNumber = 1;
        $scope.PageSize = 10;

        $scope.searchradio = {
            "PatientSearchType": 2
        };
        function getSelectedPatient() {
            var obj = {
                "SearchText": "",
                "PatientId": 0
            }
            return obj;
        };
        $scope.PatientSearch = getSelectedPatient();
        $scope.AllPatientList = [];

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
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllARList = angular.copy($scope.allUserList);
                $scope.AllBillingList = angular.copy($scope.allUserList);

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
                    return item.RoleId === 2 || item.RoleId === 10;
                });

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    angular.forEach(Aitem.UserBranchRoles, function (kitem) {
                        if (kitem.RoleId === 10) {
                            $scope.clinicOptometristsList.push(Aitem);
                        }
                        if (kitem.RoleId === 61) {
                            $scope.clinicARAssistantList.push(Aitem);
                        }
                    });
                });
                $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });
                $scope.clinicARAssistantList = _.uniq($scope.clinicARAssistantList, false, function (p) { return p.DoctorID; });


                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    angular.forEach(Aitem.UserBranchRoles, function (item) {
                        if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57) {
                            if ($scope.selectedBranch.ClinicId === 0) {
                                $scope.clinicDoctorList.push(Aitem);
                            } else {
                                if (item.BranchId === $scope.selectedBranch.ClinicId) {
                                    $scope.clinicDoctorList.push(Aitem);
                                }
                            }
                        }
                    });
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicDoctorList.unshift(docAll);
                var opthoall = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicOptometristsList.unshift(opthoall);
                var Arall = { "DoctorID": 0, "FullName": "All AR", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicARAssistantList.unshift(Arall);

               var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
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
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                                if ($scope.selectedBranch.ClinicId === 0) {
                                    $scope.clinicDoctorList.push(Aitem);
                                } else {
                                    if (item.BranchId === $scope.selectedBranch.ClinicId) {
                                        $scope.clinicDoctorList.push(Aitem);
                                    }
                                }

                            }
                        });
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.clinicDoctorList.unshift(docAll);
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                }


                if (!$scope.UserAccessRights.AllAccessRights.APPListAllDoctorAppointments) {
                    $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }

                if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings != undefined) {
                    if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
                        $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                        $scope.selectedDoctor = $scope.clinicDoctorList[0];
                    }
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
                $scope.SearchAppointmentList();
                //if ($scope.appScreen === "list") {
                //    if ($scope.Tab === 'appointments' || $scope.Tab === 'teleappointments') {
                //        if (pagetype === 'PageLoad') {
                //            $scope.loadAppointments($scope.selectedDoctor, pagetype);
                //        }
                //    }
                //    if ($scope.Tab === 'dilation') {

                //        //if (RoleID === 1 || RoleID === 56) {
                //        //    loadAppointmentforDoc($scope.selectedDoctor);
                //        //}
                //        //else {
                //        //  $scope.loadDilationAppointments($scope.selectedDoctor);
                //        //}
                //        $scope.loadDilationAppointments($scope.selectedDoctor);
                //    }
                //} else {
                //    setCalendarSlot();
                //    if ($scope.calendarView === "day") {
                //        $scope.loadDayView($scope.viewDate, $scope.selectedDoctor);
                //    } else if ($scope.calendarView === "week") {
                //        loadWeekView();
                //    } else if ($scope.calendarView === "month") {
                //        loadMonthView();
                //    }
                //}
                //$scope.GetOrgDilationMedication($scope.AppListselectedclinic.ClinicId);


            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
                $scope.mainDilationAppointmentList = [];
            }
        }

        function onGetUsersFailure(data) {
        }
    }

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
    function InitializeBranches(data, pagetype) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorInfo) || [];
        $scope.BranchesListArray = clinicAddress;
        $scope.AppListdoctoraddress = clinicAddress;
        $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

        var RoleID = $scope.userLoginDetails.RoleID;

        $scope.clinicDoctorList = [];

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
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
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);
    }

    $scope.init();
    $scope.AppointmentType = {
        "TypeId": ""
    };
    $scope.AppointmentList = [
        {"Id" : 0, "TypeSearch" : "All"},
        { "Id": 1, "TypeSearch": "OP"},
        { "Id": 2, "TypeSearch": "OT"}
    ];

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
    }
    $scope.changeDoctor = function (item) {
        if (item != "") {
            $scope.selectedDoctor = item;
        }
    }



        $scope.ChangeSubcontent = function (row) {


        $scope.ClickPatientProfile(row);
           
    };

    $scope.ClickPatientProfile = function (item) {
         item.PatientDetails = angular.copy(item.Patient);
            item.PatientDetails.PatientID = item.Patient.PatientId;
        item.PatientID = item.Patient.PatientId;
        eHnoteMasterDataService.addPatientDetailsforBarcode(item);
        //eHnoteMasterDataService.addpatientData(item.PatientDetails);
        //eHnoteMasterDataService.setentryConsultationPatientInfo(item);
        eHnoteMasterDataService.addAppointmentInfo(item);
        $scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;

        var consultdate = $filter("date")(new Date($scope.ConsultationDt), "yyyy-MM-dd");
        var hospitalID = 0;

        if ($scope.AppListselectedclinic.ClinicId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
        } else {
            hospitalID = $scope.AppListselectedclinic.ClinicId;
        }


        $scope.cacheStorageItem.patientid = item.Patient.PatientId;
        item.PatientID = item.Patient.PatientId;
        item.MasterPatientId = item.Patient.MasterPatientId;
        $scope.cacheStorageItem.PatientID = item.Patient.PatientId;
        item.Gender = item.Patient.Gender || "";
        item.PatientGSTNO = item.Patient.GSTNO || "";
        //item.BranchArea = item.BranchDetails.Area;
        $scope.cacheStorageItem.PatientName = item.Patient.Fullname;
        $scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;
        $scope.cacheStorageItem.appointmentid = item.AppointmentId;
        $scope.cacheStorageItem.AppointmentID = item.AppointmentId;
        $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
        $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
        $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        if ($scope.AllDoctorList != undefined) {
            $scope.cacheStorageItem.AllDoctorsList = $scope.AllDoctorList || [];
        }

        
          
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        datapersistanceFactory.set("BillingToProfile", item);

        var obj = {
            'IsComingFrom': 'BillerBilling'
        }
       // datapersistanceFactory.set("OPBilling", obj);
        $location.url("/newbiller");
      
    };

        $scope.Pagination = { "currentPagePatient": 1, "Patientitemsperpage": 100, "Patientmaxsize": 10 };
    $scope.SearchAppointmentList = function () {
        $scope.OPandOTAppointmentListCount = 0;
        $scope.OPandOTAppointmentList = [];
        var param = {
            "AppoitmentDate": $filter("date")(new Date($scope.Appointment.Date), "yyyy-MM-dd"),
            "HospitalId": $scope.HospitalID,
            "DoctorId": $scope.selectedDoctor.DoctorID || 0,
            "GetAllDoctorIndictor": 0,
            "AppointmentTypeId": $scope.AppointmentType.TypeId || 0,
            "PatientId": $scope.PatientSearch.PatientId || 0,
            "PageSize": $scope.Pagination.Patientitemsperpage,
            "PageNo": $scope.PageNumber
        };

        if (param.DoctorId == 0) {
            param.GetAllDoctorIndictor = 1;
        } else {
            param.GetAllDoctorIndictor = 0;
            }

   

        eHnoteMainAppointmentService.GetAllOPandOTAppointmentList(param).then(function (respose) {
            console.log(respose);
            if (respose.data.status == "Success") {
                $scope.OPandOTAppointmentList = respose.data.rows;
                $scope.OPandOTAppointmentListCount = respose.data.count;
            }
          
        }, function (error) {
            console.log(error);
        });

    };
       // $scope.SearchAppointmentList();


        $scope.changePatientPage = function (pageNo) {
            $scope.PageNumber = pageNo || 1;
            $scope.SearchAppointmentList();
        };
        
        $scope.clearAppointmentList = function () {
            $scope.PatientSearch = getSelectedPatient();
            $scope.Appointment.Date = $filter('date')(new Date(), "MM-dd-yyyy");
            $scope.AppointmentType.TypeId = 0; 
            $scope.PageNumber = 1;
            $scope.PageSize = 10;
            $scope.searchradio.PatientSearchType = 2;

            $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
                return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
            }) || [];

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.changeAppointmentBranch($scope.selectedBranch);

            $scope.SearchAppointmentList();
        }
        //$scope.SearchAppointmentList();
    
        $scope.changeSearchType = function (id) {
            $scope.searchradio.PatientSearchType = id;
            $scope.PatientSearch = getSelectedPatient();
            $scope.AllPatientList = [];
        }
        $scope.LoadPatientSearch = function (val) {
            if (val == undefined || val == null || val == "") {
                $scope.AllPatientList = [];
                $scope.PatientSearch.PatientId = 0;
                return false;
            }

            var object = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "Name": null,
                "Mobile": null,
                "PatientId": null,
                "PageSize": 30,
                "PageNo": 1,
                "DOB": null
            };
            if ($scope.searchradio.PatientSearchType == 1) {
                object.Name = val;
            } else if ($scope.searchradio.PatientSearchType == 2) {
                object.PatientId = val;
            } else if ($scope.searchradio.PatientSearchType == 3) {
                val = val + " 00:00:00";
               /* val = $filter('date')(new Date(val), "yyyy-MM-dd");*/
                var parsedDate = new Date(val);
                if (!isNaN(parsedDate.getTime())) {
                    val = $filter('date')(parsedDate, "yyyy-MM-dd");
                    object.DOB = val;
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", val);
                    // Return false or handle the error in another way
                    val = null;
                    return false;
                }
            }
            InventoryService.SearchInvPatient(object).then(function (resp) {
                if (resp.data.data.length !== 0) {
                    if (resp.data.data != undefined) {
                        $scope.AllPatientList = [];
                        var patientList = resp.data.data || [];
                        angular.forEach(patientList, function (items) {
                            var obj = {
                                "FullName": items.fullname,
                                "PatientId": items.PatientId,
                                "PatientHomeNumber": items.MobileNo,
                                "PatientDisPlayID": items.PatientDisplayId,
                                "HomeCountryCode": items.HomeCountryCode || "",
                                "HomeAreaCode": items.HomeAreaCode || "",
                                "HomeNumber": items.HomeNumber || ""
                            };
                            $scope.AllPatientList.push(obj);
                        });
                    }
                } else {
                    $scope.patients = [];
                }
            }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        };
        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearch.PatientId = patietnitem.PatientId;
            $scope.AllPatientList = [];
        }




        $scope.clickremarksbillingpatient = {
            templateUrl: 'remarksbillingpatient.html',
        };










}]);
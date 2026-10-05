"use strict";
eHnoteWebApp.controller("EhnoteFollowUpAppointmentListCtrl", ["$scope", "$log", "$rootScope", "$location", "$uibModal", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteValidateUsersDataService", "eHnoteLoginStatusService", "datacookieFactory", "$window", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "alertify", "uiCalendarConfig", "eHnotePatientPVService", "eHnotePatientVisitReasonServices", "eHnoteDiagnosisDataServices", "DeCodeFilter", "$q", "$interval", "localStorageFactory", "eHnoteProcedureDataService", "SyncService", "eHnoteSettingsDataService", function ($scope, $log, $rootScope, $location, $uibModal, $filter, $timeout, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, $window, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserAppointmentDataService, alertify, uiCalendarConfig, eHnotePatientPVService, eHnotePatientVisitReasonServices, eHnoteDiagnosisDataServices, DeCodeFilter, $q, $interval, localStorageFactory, eHnoteProcedureDataService, SyncService, eHnoteSettingsDataService) {
    var object = {}, clinicAddress = [], SetupPopUp;
    $scope.AppListdoctoraddress = [];
    $scope.clinicDoctorList = [];
    $scope.clinicDoctorAllList = [];
    $scope.mainBookedAppointmentList = [];
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.hospid = "";

    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.hospitalcd = "";
        $scope.hospid = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.parenthospId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

    }
    $scope.searchHospital = { "txt1": "", "txt2": "" };
    $scope.searchtxtb = { "txt1": "", "txt2": "" };
    $scope.selectedDoctor = {};
    $scope.searchPatientIdTxt = "";
    $scope.searchOldPatientMRNO = "";
    $scope.patSearchType = 2;
    $scope.showAppointmtlistError = false;
    $scope.List = [];
    $scope.HospitalChange = false;
    $scope.AllSubSpecializationsCheck = true;
    $scope.PageName = null;
    $scope.AppDate = null;
    var onchageselectappoint = 0;

    $scope.Search = {
        "HospitalID": 3,
        "FromDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
        "EndDate": $filter("date")(new Date().setDate(new Date().getDate() + 30), "dd-MMM-yyyy"),
        "DoctorID": 3,
        "UserBranchId": 2107,
        "GetAllIndicator": 1,
        "SearchText": "",
        "SearchPatientId": "",
        "PageSize": 10,
        "PageNumber": 1,
        "TotalListCount": 0,
        "Patientmaxsize": 5,
        "Patientitemsperpage": 10
    };


    $scope.changePatientPage = function () {
        $scope.loadAppointments($scope.selectedDoctor);
    };
    $scope.loadAppointments = function (selectedDr) {
        if (selectedDr.FullName === "All Doctors") {
            selectedDr.UserBranchId = 0;
        }
        // eHnoteMasterDataService.addSelectedDoctorinAppList(selectedDr);
        $scope.selectedDoctor = selectedDr;
        var hospitalID = 0;
        if ($scope.AppListselectedclinic.ClinicId === 0) {
            //$scope.GetAllIndicator = 1;
            //hospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;


            //Get all Hospital Ids
            var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
            hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");


        } else {
            //$scope.GetAllIndicator = 0;
            hospitalID = $scope.AppListselectedclinic.ClinicId;
        }

        var subList = [];
        var subspecList = 0;
        angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
            if (mitems.isChecked) {
                subList.push(mitems);
            }
        });
        subspecList = _.pluck(subList, "SubSpecializationId").join(",");
        if ($scope.selectedDoctor.UserBranchId === 0) {
            object = {
                "HospitalID": hospitalID,
                //"GetAllIndicator": $scope.GetAllIndicator,
                "PageSize": $scope.Search.PageSize,
                "PageNumber": $scope.Search.PageNumber,
                "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
                "SearchPatientId": $scope.searchPatientIdTxt ? $scope.searchPatientIdTxt : "",
                "OldPatientMRNO": $scope.searchOldPatientMRNO ? $scope.searchOldPatientMRNO : "",
                "FromDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
                "EndDate": $filter("date")(new Date($scope.Search.EndDate), "yyyy-MM-dd"),
                "SubSpecializationIds": subspecList

            };
        } else {
            object = {
                "UserBranchId": $scope.selectedDoctor.UserBranchId,
                "DoctorID": $scope.selectedDoctor.DoctorID,
                //"GetAllIndicator": $scope.GetAllIndicator,
                "HospitalID": hospitalID,
                "PageSize": $scope.Search.PageSize,
                "PageNumber": $scope.Search.PageNumber,
                "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
                "SearchPatientId": $scope.searchPatientIdTxt ? $scope.searchPatientIdTxt : "",
                "OldPatientMRNO": $scope.searchOldPatientMRNO ? $scope.searchOldPatientMRNO : "",
                "FromDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
                "EndDate": $filter("date")(new Date($scope.Search.EndDate), "yyyy-MM-dd"),
                "SubSpecializationIds": subspecList
            };
        }
        $scope.GetListofFollowUpAppointments(object);
    };

    $scope.GetListofFollowUpAppointments = function (object) {

        eHnoteMainAppointmentService.GetListofFollowUpAppointments(object).then(function (resp) {
            $scope.List = resp.data.rows || [];
            $scope.Search.TotalListCount = resp.data.Count;
            angular.forEach($scope.List, function (iterator, index) {
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                iterator.colors = val;
                iterator.ShowSubcontent = false;
            });
        }, function (err) {
            console.log(err);
            alertify.error("Getting followups failed");
        });

    };

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    function OnGetListofAppointmentSuccess(bookdata) {
        var data = [];
        data = bookdata.AppointmentList;
        $scope.mainBookedAppointmentListCount = bookdata.count;
        //LoadAppointmentlist(data);
        $scope.referredshowloading = false;
    }
    function OnGetListofAppointmentError(bookdata) {
        $scope.currentshowloading = false;
        $scope.pastshowloading = false;
        $scope.referredshowloading = false;
        alertify.error("Error in listing Appointments");
    }
    function LoadAppointmentlist(data) {
        $scope.mainBookedAppointmentList = [];

        angular.forEach(data, function (item, index) {
            var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
            var val = array_list[Math.floor(Math.random() * array_list.length)];



            object = {
                "HospitalId": item.HospitalId,
                "SeqNo": item.SeqNo,
                "AppointmentID": item.AppointmentID,
                "IsConsultationAvail": item.IsConsultationAvail,
                "ConsultationId": item.ConsultationId,
                "DayCD": item.DayCD,
                "ConsultationDt": item.ConsultationDt,
                "StartTime": item.StartTime,
                "EndTime": item.EndTime,
                "PatientID": item.PatientID,
                "VisitUserTypeID": item.VisitUserTypeID,
                "DoctorID": item.DoctorID,
                "VisitReason": item.VisitReason,
                "BranchName": item.BranchName,
                "BranchEmail": item.BranchEmail,
                "BranchMobile": item.BranchMobile,
                "DoctorFullName": item.DoctorFullName,
                "LastVisitedDate": item.LastVisitedDate || null,
                "DoctorEmail": item.DoctorEmail,
                "DoctorMobile": item.DoctorMobile,
                "DoctorDesignation": item.Designation,
                "DoctorSpecialization": item.DoctorSpecialization,
                "CountryCode": item.CountryCode,
                "FirstTimeVisit": item.FirstTimeVisit,
                "DoctorVisitRsnID": item.DoctorVisitRsnID,
                "AppointmentStatus": item.AppointmentStatus,
                "TokenNumber": item.TokenNumber,
                "PatientBalance": item.PatientBalance || 0,
                "VisitRsnID": item.VisitRsnID,
                "PreliminaryNotes": item.PreliminaryNotes,
                "ReferralSourceDtls": item.ReferralSourceDtls,
                "Status": item.Status,
                "colors": val,
                "OtherVisitRsn": item.OtherVisitRsn,
                "ReferralSourceId": item.ReferralSourceId,
                "ReferralSourceName": item.ReferralSourceName || "",
                "PatientDetails": item.Patient,
                "PatientName": item.Patient.FullName,
                "DoctorSpecializationId": item.DoctorSpecializationId,
                "UserBranchId": item.UserBranchId,
                "OptometristId": item.OptometristId ? item.OptometristId : "",
                "OptometristName": item.OptometristName ? item.OptometristName : "",
                "DoctorGender": item.DoctorGender,
                "AvgConsultationTime": item.AvgConsultationTime,
                "DoctorRoleId": item.DoctorRoleId,
                "BranchId": item.BranchId,
                "BranchDetails": item.BranchDetails,
                "OrgGSTNO": item.OrgGSTNO,
                "Sno": item.Sno,
                "AppointmentType": item.AppointmentType,
                "IscheckedIn": item.IscheckedIn,
                "MobileNo": item.MobileNo,
                "ShowSubcontent": false,
                "TreatmentAssignedDoctor": item.TreatmentAssignedDoctor,
                "TreatmentAssignedDoctorName": item.TreatmentAssignedDoctorName,
                "RootAppointmentId": item.RootAppointmentId,
                "ParentAppointmentId": item.ParentAppointmentId,
                "ParentAppointmentDoctorName": item.ParentAppointmentDoctorName,
                "BillingId": item.BillingId,
                "TreatmentPlanId": item.TreatmentPlanId,
                "DilationStartTime": item.DilationStartTime,
                "DilationMedicationId": item.DilationMedicationId,
                "DilationMedicationName": item.DilationMedicationName,
                "OrganId": item.OrganId || "",
                "DilationEndTime": item.DilationEndTime,
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
                "PaidFollowup": item.PaidFollowup,
                "CheckInTime": item.CheckInTime,
                "CheckOutTime": item.CheckOutTime,
                "IsCheckInMandatory": item.IsCheckInMandatory,
                "IsAppointmentBillingStarted": item.IsAppointmentBillingStarted
            };



            var isCurrentDate = $scope.chkFutureDate($scope.referredappointmentdate);
            if (isCurrentDate) {//strat consulation access

                if ($scope.DoctorId === object.DoctorID || $scope.userLoginDetails.RoleID === 10) {

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

                    if ($scope.userLoginDetails.RoleID === 10 && object.AppointmentStatus === "E") { // added by sabarish
                        object.startConsultationEntryAccess = false;
                    }


                    if (object.PaidFollowup) {// added by sabarish
                        object.startConsultationEntryAccess = true;
                    }

                }

            }
            if (object.AppointmentStatus === "E") {//edit consulation access
                if ($scope.DoctorId === object.DoctorID) {
                    object.EditConsultationAccess = true;
                }
            }
            if (isCurrentDate) {//file upload accesss

                if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O" || object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 11) {
                    object.FileUploadsAcces = true;
                }

            }
            if (isCurrentDate) {//Vitals access

                if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O" || $scope.userLoginDetails.RoleID === 11) {
                    object.EnterVitalsAcces = true;
                }

            }
            if ($scope.userLoginDetails.RoleID === 10) {
                object.billingAccess = false;
            } else {
                if (object.AppointmentStatus === "B" || object.AppointmentStatus === "O" || object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 11) {
                    object.billingAccess = true;
                }
            }

            if (object.AppointmentStatus === "C" || object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 10) {
                object.CancelAppointmentAccess = false;
            }

            if (object.AppointmentStatus === "E" || $scope.userLoginDetails.RoleID === 10) { //edit access
                object.EditAppointmentAccess = false;
            }
            if ($scope.userLoginDetails.RoleID === 2 || $scope.userLoginDetails.RoleID === 11) {
                if (object.AppointmentStatus === "O" || object.AppointmentStatus === "B") {
                    object.CaseSheetAccess = true;
                }


                if ($scope.OrganizationSettingsData.BillingSettings.IsBillingMandatoryForStartConsultation === 1 && !object.IsAppointmentBillingStarted) {// added by sabarish
                    object.CaseSheetAccess = false;
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
            if ($scope.userLoginDetails.RoleID === 15) {
                $scope.hideBillingForSlave = true;
            }

            if (object.DilationStartTime !== undefined) {
                if (object.DilationEndTime === undefined) {
                    object.isDilationstarted = true;
                    object.ItemScope = $interval(function () { $scope.callAtInterval(object); }, 1000);
                } else {
                    object.Conunter = "Done";
                }

            } else {
                object.isDilationstarted = false;
            }
            $scope.mainBookedAppointmentList.push(object);
        });

        if ($scope.mainBookedAppointmentList.length > 0) {
            $scope.showSearchList = false;
            $scope.showAppointmtlistError = false;
        } else {
            $scope.showAppointmtlistError = true;
        }
    }
    $scope.changeAppointmentBranch = function (obj, type, screen) {
        $scope.selectedBranch = obj;
        $scope.AppListselectedclinic = obj;
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);
    }

    $scope.loadDoctor = function (val, type, screen) {
        //if (val.ClinicId === 0) {//For Parent Hospital Id
        //    $scope.GetAllIndicator = 1;
        //} else {//For child hospital
        //    $scope.GetAllIndicator = 0;
        //}
        screen = screen || "";
        $scope.AppListselectedclinic = val;
        if (val.ClinicId === 0) {
            eHnoteMasterDataService.addSelectedHospitalinAppList("");
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(val);
        }
        eHnoteMasterDataService.addDocChangeHospital(val);
        if ($scope.userLoginDetails.RoleID !== 1) {
            $scope.clinicDoctorList = [];
            if (val.ClinicId === 0) {
                angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                    $scope.clinicDoctorList = $scope.clinicDoctorList.concat(item.Doctors);
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
            } else {
                $scope.clinicDoctorList = $scope.clinicDoctorList.concat(val.Doctors);
            }
            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 16 || item.RoleId === 43;
            });
            if (screen === "list") {
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "UserBranchId": 0, "MinPerCase": 15 };
                $scope.clinicDoctorList.unshift(docAll);
            }
            $scope.selectedDoctor = $scope.clinicDoctorList[0];
        } else {
            //if (val !== null) {
            //    $scope.selectedDoctor.UserBranchId = val.UserBranchId;
            //    $scope.selectedDoctor.BranchEmail = val.BranchEmail;
            //    $scope.selectedDoctor.ClinicName = val.ClinicName;
            //    $scope.selectedDoctor.MobileNo = val.MobileNo;
            //}
        }


        $scope.loadAppointments($scope.selectedDoctor);

    };
    $scope.initialiseClinicDoctor = function () {
        //$scope.AppListdoctoraddress = [];
        //onchageselectappoint = 0;
        //$scope.selectedDocCSSid = 0;

        $scope.AppListdoctoraddress = clinicAddress || [];
        var RoleID = $scope.userLoginDetails.RoleID;

        if (RoleID !== 1) {

            $scope.clinicDoctorList = [];
            $scope.clinicDoctorAllList = [];


            $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) { return item.ClinicId === doctorInfo.doctordata.UserAddress[0].ClinicId; });
            $scope.AppListselectedclinic = $scope.defaultbranch[0];

            for (var i = 0; i < $scope.defaultbranch.length; i++) {
                if ($scope.defaultbranch[i].Doctors !== undefined) {
                    if ($scope.defaultbranch[i].Doctors.length > 0) {
                        for (var j = 0; j < $scope.defaultbranch[i].Doctors.length; j++) {
                            $scope.clinicDoctorAllList.push($scope.defaultbranch[i].Doctors[j]);
                        }
                    }
                }
            }


           // $scope.clinicOptometristsList = $filter("filter")($scope.clinicDoctorAllList, function (item) { return item.RoleId === 10; });
            angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                angular.forEach(Aitem.UserBranchRoles, function (kitem) {
                    if (kitem.RoleId === 10) {
                        $scope.clinicOptometristsList.push(Aitem);
                    }
                });
            });
            $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });


            angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                angular.forEach(Aitem.UserBranchRoles, function (item) {
                    if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57) {
                        $scope.clinicDoctorList.push(Aitem);
                        console.log($scope.clinicDoctorList);
                    }

                });
            });
            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
            var docAll = { "DoctorID": 0, "FullName": 'All Doctors', "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicDoctorList.unshift(docAll);
            var opthoall = { "DoctorID": 0, "FullName": 'All Optometrists', "AddressID": 0, "MinPerCase": 15 };
            $scope.clinicOptometristsList.unshift(opthoall);



            var DocArray = $filter("filter")($scope.clinicDoctorList, function (item) { return item.DoctorID === eHnoteMasterDataService.getLoginId(); }) || [];
            if (DocArray.length > 0) {
                $scope.selectedDoctor = DocArray[0];
            } else {
                $scope.selectedDoctor = $scope.clinicDoctorList[0];
            }

            //onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
            //$scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;



        }

        //if (RoleID === 1) {
        //    clinicAddress = [];
        //    if (doctorInfo !== null && doctorInfo.doctordata !== null) {
        //        if (doctorInfo.doctordata.UserAddress !== null) {
        //            var appListdoctoraddress = doctorInfo.doctordata.UserAddress;
        //            for (var i = 0; i < appListdoctoraddress.length; i++) {
        //                if (appListdoctoraddress[i].Active === "Y") {
        //                    clinicAddress.push(appListdoctoraddress[i]);
        //                }
        //            }
        //        }
        //    }
        //    //onchageselectappoint = doctorInfo.doctorid;
        //    //$scope.selectedDocCSSid = clinicAddress[0].UserBranchId;
        //    $scope.clinicDoctorList = [];
        //    var countryCode = "";
        //    if (doctorInfo.doctordata.UserPhone !== undefined) {
        //        countryCode = doctorInfo.doctordata.UserPhone[0].PhCntryCD;
        //    }
        //    var clinicObj = {
        //        "FullName": doctorInfo.doctordata.User[0].FullName,
        //        "DoctorID": doctorInfo.doctordata.User[0].DoctorID,
        //        "EmailId": doctorInfo.doctordata.UserEmail[0].EmailID,
        //        "MobileNo": doctorInfo.doctordata.UserAddress[0].MobileNo,
        //        "CountryCode": countryCode,
        //        "Gender": doctorInfo.doctordata.User[0].Gender,
        //        "UserBranchId": doctorInfo.doctordata.UserAddress[0].UserBranchId,
        //        "Active": "Y",
        //        "SpecializationId": doctorInfo.doctordata.User[0].SpecializationId,
        //        "MinPerCase": doctorInfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
        //        "RoleId": doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleID,
        //        "ClinicName": doctorInfo.doctordata.UserAddress[0].ClinicName,
        //        "BranchEmail": doctorInfo.doctordata.UserAddress[0].BranchEmail
        //    };
        //    $scope.clinicDoctorList.push(clinicObj);
        //    $scope.selectedDoctor = $scope.clinicDoctorList[0];
        //    $scope.AppListdoctoraddress = clinicAddress;
        //    $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];
        //    //onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
        //    //$scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;
        //}




        if (RoleID === 2 || RoleID === 10 || RoleID === 11) {
            var allcount = 0;
            for (var i = 0; i < $scope.clinicDoctorList.length; i++) {
                if ($scope.clinicDoctorList[i].FullName === "All Doctors") {
                    allcount++;
                    if (allcount > 1) {
                        $scope.clinicDoctorList.splice(i, 1);
                    }
                }
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
            angular.forEach($scope.clinicOptometristsList, function (item, index) {
                if (item.DoctorID === $scope.SelectedOptometristId) {
                    $scope.selectedOptometrist = item;
                }
            });
        }
        var currentClinic = doctorInfo.doctordata.UserAddress[0];
        if ($scope.AppListdoctoraddress.length > 0) {
            angular.forEach($scope.AppListdoctoraddress, function (value, key) {
                if (currentClinic.ExtDetails !== undefined && currentClinic.ExtDetails.HospitalID !== undefined && value.ExtDetails !== undefined && value.ExtDetails.HospitalID !== undefined && currentClinic.ExtDetails.HospitalID === value.ExtDetails.HospitalID) {
                    if ($scope.clinicDoctorList.length > 0) {
                        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                        //onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
                        //$scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;
                    } else {
                        $scope.AppListselectedclinic = value;
                    }
                }
            });
        }


        if (RoleID === 1) {
            loadAppointmentforDoc($scope.selectedDoctor);
        } else {
            $scope.loadAppointments($scope.selectedDoctor);
        }

        //$scope.GetOrgDilationMedication($scope.AppListselectedclinic.ClinicId);
    };


    function loadAppointmentforDoc(selectedDr) {

        $scope.selectedDoctor = selectedDr;
        var docid = $scope.selectedDoctor.DoctorID;
        if (!$scope.HospitalChange) {
            var UserBranchId = 0;
            //if (selectedDr && selectedDr.DoctorID !== null) {
            //    $scope.selectedDoctor = selectedDr;
            //    $scope.selectedDocCSSid = selectedDr.DoctorID;
            //}
            //var consultdate = $filter("date")(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
            //var daycode = $filter('date')($scope.referredappointmentdate, "EEE").toUpperCase();
            var hospitalID = "";
            if ($scope.AppListselectedclinic !== undefined && $scope.AppListselectedclinic.ClinicName !== "All Locations") {
                var hospitalID = $scope.AppListselectedclinic.ExtDetails.HospitalID;

                if ($scope.selectedDoctor !== undefined && $scope.selectedDoctor.UserBranchId !== undefined) {
                    UserBranchId = $scope.selectedDoctor.UserBranchId;
                    //onchageselectappoint = $scope.selectedDoctor.UserBranchId;
                }

            } else {
                //hospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                //$scope.GetAllIndicator = 1;

                //Get all Hospital Ids
                var TempAppListdoctoraddress = $filter("filter")($scope.AppListdoctoraddress, function (iterator, ind) { return iterator.ClinicId !== 0; });
                hospitalID = _.pluck(TempAppListdoctoraddress, "ClinicId").join(",");
            }
            var subList = [];
            var subspecList = 0;
            angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
                if (mitems.isChecked) {
                    subList.push(mitems);
                }
            });
            subspecList = _.pluck(subList, "SubSpecializationId").join(",");
            if (UserBranchId === 0) {
                object = {
                    "HospitalID": hospitalID,
                    //"GetAllIndicator": $scope.GetAllIndicator,
                    "PageSize": $scope.Search.PageSize,
                    "PageNumber": $scope.Search.PageNumber,
                    "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
                    "SearchPatientId": $scope.searchPatientIdTxt ? $scope.searchPatientIdTxt : "",
                    "OldPatientMRNO": $scope.searchOldPatientMRNO ? $scope.searchOldPatientMRNO : "",
                    "FromDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
                    "EndDate": $filter("date")(new Date($scope.Search.EndDate), "yyyy-MM-dd"),
                    "SubSpecializationIds": subspecList

                };
            } else {
                object = {
                    "UserBranchId": $scope.selectedDoctor.UserBranchId,
                    "DoctorID": $scope.selectedDoctor.DoctorID,
                    //"GetAllIndicator": $scope.GetAllIndicator,
                    "HospitalID": hospitalID,
                    "PageSize": $scope.Search.PageSize,
                    "PageNumber": $scope.Search.PageNumber,
                    "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
                    "SearchPatientId": $scope.searchPatientIdTxt ? $scope.searchPatientIdTxt : "",
                    "OldPatientMRNO": $scope.searchOldPatientMRNO ? $scope.searchOldPatientMRNO : "",
                    "FromDate": $filter("date")(new Date($scope.Search.FromDate), "yyyy-MM-dd"),
                    "EndDate": $filter("date")(new Date($scope.Search.EndDate), "yyyy-MM-dd"),
                    "SubSpecializationIds": subspecList
                };
            }
            $scope.GetListofFollowUpAppointments(object);
        }
    }

    $scope.toggleSubSpecialization = function (item) {
        var checkedArray = _.where($scope.allSubSpecializationsArray, { isChecked: true });
        $scope.AllSubSpecializationsCheck = checkedArray.length > 0 && $scope.allSubSpecializationsArray.length === checkedArray.length ? true : false;
        console.log($scope.selectedBranch);
        $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);

    };

    $scope.checkAllSubSpecializations = function (val) {
        if (val) {
            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = true;
            });

        } else {
            angular.forEach($scope.allSubSpecializationsArray, function (item) {
                item.isChecked = false;
            });
        }

        $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
    };


    $scope.init = function () {

        //var BranchList = localStorageFactory.getItem("allHospitalsDoctorsData") || [];

        // InitializeAppointments(BranchList);
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList);
        var NewDepartmentsList = localStorageFactory.getItem("allSubSpecializationsData") || [];

    };
    $scope.init();

    function InitializeBranches(data) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.FollowupsListAllBranchesAppointments, data, doctorInfo) || [];
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
        $scope.selectedBranch = $scope.BranchesListArray[0];
        $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

        var RoleID = $scope.userLoginDetails.RoleID;

     //   if (RoleID !== 1 && RoleID !== 56) {

            $scope.clinicDoctorList = [];
            $scope.AppListdoctoraddress = clinicAddress;

            $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
                return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.AppListselectedclinic = $scope.defaultbranch[0];
      //  }

        if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
            angular.forEach($scope.BranchesListArray, function (item, index) {
                if (item.ClinicName !== "All Locations") {
                    if (item.ExtDetails.HospitalID === $scope.hospid) {
                        $scope.selectedBranch = item;
                        $scope.AppListselectedclinic = item;
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

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

    }

    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {
        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    };
    $scope.getDoctorsbySubSpecializations = function (branchId) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
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
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;

                //$scope.clinicDoctorList = $scope.allUserList;
                //$scope.clinicOptometristsList = $filter("filter")($scope.clinicDoctorList, function (item) { return item.RoleId === 10; });
                //$scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });
                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                $scope.clinicOptometristsList = [];
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    angular.forEach(Aitem.UserBranchRoles, function (kitem) {
                        if (kitem.RoleId === 10) {
                            $scope.clinicOptometristsList.push(Aitem);
                        }
                    });
                });
                $scope.clinicOptometristsList = _.uniq($scope.clinicOptometristsList, false, function (p) { return p.DoctorID; });

                //$scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                //    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                //});
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    angular.forEach(Aitem.UserBranchRoles, function (item) {
                        if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                            $scope.clinicDoctorList.push(Aitem);
                           // console.log($scope.clinicDoctorList);
                        }

                    });
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicDoctorList.unshift(docAll);
                var opthoall = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicOptometristsList.unshift(opthoall);

                var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                if (Index > -1) {
                    $scope.selectedDoctor = $scope.clinicDoctorList[Index];
                } else {
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }

                onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
                $scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;


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



                }
                if (RoleID === 10) {
                    Index = $scope.clinicOptometristsList.findIndex(record => record.DoctorID === $scope.SelectedOptometristId);
                    if (Index > -1) {
                        $scope.selectedOptometrist = $scope.clinicOptometristsList[Index];
                    }
                }

                if (RoleID === 1) {
                    loadAppointmentforDoc($scope.selectedDoctor);
                } else {
                    $scope.loadAppointments($scope.selectedDoctor);
                }

            } else {
                alertify.error("No Users Found in Selected Departments");
            }


        }

        function onGetUsersFailure(data) {
        }
    }

    function InitializeAppointments(data) {



        clinicAddress = eHnoteUserAppointmentDataService.RestructureBranches($scope.OpAccess.showAllHospitalsinAppList, data, doctorInfo) || [];


        if (!$scope.OpAccess.showAllHospitalsinAppList) {
            $scope.clinicDoctorList = [];
            var countryCode = "";
            if (doctorInfo.doctordata.UserPhone !== undefined) {
                countryCode = doctorInfo.doctordata.UserPhone[0].PhCntryCD;
            }
            var clinicObj = {
                "FullName": doctorInfo.doctordata.User[0].FullName,
                "DoctorID": doctorInfo.doctordata.User[0].DoctorID,
                "EmailId": doctorInfo.doctordata.UserEmail[0].EmailID,
                "MobileNo": doctorInfo.doctordata.UserAddress[0].MobileNo,
                "CountryCode": countryCode,
                "Gender": doctorInfo.doctordata.User[0].Gender,
                "UserBranchId": doctorInfo.doctordata.UserAddress[0].UserBranchId,
                "Active": "Y",
                "SpecializationId": doctorInfo.doctordata.User[0].SpecializationId,
                "MinPerCase": doctorInfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                "RoleId": doctorInfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                "ClinicName": doctorInfo.doctordata.UserAddress[0].ClinicName,
                "BranchEmail": doctorInfo.doctordata.UserAddress[0].BranchEmail
            };
            $scope.clinicDoctorList.push(clinicObj);
            $scope.selectedDoctor = $scope.clinicDoctorList[0];
            $scope.AppListdoctoraddress = clinicAddress;
            $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];
            //onchageselectappoint = parseInt($scope.selectedDoctor.UserBranchId);
            //$scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;
        }
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
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
            "Doctors": []
        };
        clinicAddress.unshift(EmptyClinicObj);
        $scope.initialiseClinicDoctor();
    }
    $scope.searchPatientAppointmentList = function (txt, type) {
        txt = txt || "";
        if (type === 2) {//MR number search
            if (txt === "") {
                $scope.searchPatientTxt = "";
                $scope.searchPatientIdTxt = "";
                $scope.searchOldPatientMRNO = "";
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.searchPatientIdTxt = txt;
                    $scope.searchPatientTxt = "";
                    $scope.searchOldPatientMRNO = "";
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }
        }
        else if (type === 3) {//Old MR number search
            if (txt === "") {
                $scope.searchPatientTxt = "";
                $scope.searchPatientIdTxt = "";
                $scope.searchOldPatientMRNO = "";
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if ((txt.length > 9 && isNaN(txt)) || (txt.length > 3 && !isNaN(txt))) {
                    $scope.searchOldPatientMRNO = txt;
                    $scope.searchPatientTxt = "";
                    $scope.searchPatientIdTxt = "";
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }
        }
        else {//Name Search
            if (txt.length > 2) {
                $scope.searchPatientTxt = txt;
                $scope.searchPatientIdTxt = "";
                $scope.searchOldPatientMRNO = "";
                $scope.loadAppointments($scope.selectedDoctor);
            } else {
                if (txt === "") {
                    $scope.searchPatientTxt = "";
                    $scope.searchPatientIdTxt = "";
                    $scope.searchOldPatientMRNO = "";
                    $scope.loadAppointments($scope.selectedDoctor);
                }
            }
        }
    };
    $scope.getListingDetailsonDateChange = function () {
        if (!eHnoteMainAppointmentService.Is30DaysCount($scope.Search.FromDate, $scope.Search.EndDate)) {
            alertify.log("More than 30 days not allowed");
            return;
        }
        $scope.Search.PageNumber = 1;
        $scope.loadAppointments($scope.selectedDoctor);
    };
    $scope.AssignedDoctorFollowup = function (item, type) {

        if (item.DoctorVisitRsnID === 8) {
            return;
        }
        //if (item.ChildAppointmentId !== 0) {
        //    if (item.ChildAppointmentBookedStatus === "B" || item.ChildAppointmentBookedStatus === "E" || item.ChildAppointmentBookedStatus === "O") {
        //        alertify.error("Already followUp appointment booked");
        //        return false;
        //    }
        //}
        //$scope.AppDate = item.FollowUpDate;
        var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        cacheStorageItem.IsComingFromFollowupDoctor = type === "FromApptList" ? true : false;

        cacheStorageItem.patientid = item.PatientDetails.PatientId;
        cacheStorageItem.PatientName = item.PatientDetails.FullName;
        cacheStorageItem.EmailID = item.PatientDetails.EmailId !== null ? item.PatientDetails.EmailId : "";
        cacheStorageItem.CountryCode = item.PatientDetails.PhCntryCD ? item.PatientDetails.PhCntryCD : "";
        cacheStorageItem.PhoneNumber = item.PatientDetails.MobileNo !== null ? item.PatientDetails.MobileNo : "";
        cacheStorageItem.PatientDisplayId = item.PatientDetails.PatientDisplayId !== null ? item.PatientDetails.PatientDisplayId : "";

        cacheStorageItem.appointmentid = item.AppointmentId;
        cacheStorageItem.ParentAppointmentId = item.ParentAppointmentId;
        cacheStorageItem.RootAppointmentId = item.RootAppointmentId;



        cacheStorageItem.FollowUpDate = item.FollowUpDate;

        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);


        $scope.ispatientExistsval = true;
        $rootScope.appointment_type = item.DoctorVisitRsnID.toString();
        var clinicAddressId = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
        var doctorID = { "DoctorID": doctorinfo.doctorid };
        if (doctorinfo.RoleID === 3 || doctorinfo.RoleID === 4 || doctorinfo.RoleID === 43) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
        }

        $scope.PageName = "FollowUpAppointmentList";
        SetupPopUp = $uibModal.open({
            "templateUrl": "appointMentPopupId.html",
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "inventory-full-popup"
        });
    };
    $scope.$on("successMethod", function (event) {
        SetupPopUp.dismiss("cancel");
        $scope.Search.PageNumber = 1;
        $scope.loadAppointments($scope.selectedDoctor);
    });
    $scope.$on("closePopup", function (event) {
        SetupPopUp.dismiss("cancel");
    });
}]);
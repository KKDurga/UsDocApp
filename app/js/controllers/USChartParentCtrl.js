"use strict";
eHnoteWebApp.controller("USChartParentCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteCacheStorageService", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnotePatientDataService", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "$q", "$uibModal", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteUserDataService", "USPrintService", "eHnotePatientAddressDataServices", "eHnotePatientVisitReasonServices", "eHnoteAdminDepartmentService", "eHnoteUserAppointmentDataService",
    function ($scope, $rootScope, $filter, alertify, eHnoteCacheStorageService, eHnoteMasterDataService, eHnoteLoginStatusService, eHnotePatientDataService, eHnoteSettingsDataService, eHnoteMainAppointmentService, $q, $uibModal, datapersistanceFactory, eHnoteDiagnosisDataServices, $timeout, eHnoteUserDataService, USPrintService, eHnotePatientAddressDataServices, eHnotePatientVisitReasonServices, eHnoteAdminDepartmentService, eHnoteUserAppointmentDataService) {


        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            var hospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        $scope.SpecializationId = 0;
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
        $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        };
        $scope.UnSignObj = {
            "SummaryView": false
        };
        $scope.ConsultationObj = {
            "SummaryView": false
        };
        $scope.ChartObj = {
            "SubMainTab": 1,
            "AppointmentTypeId": null,
            "AppointmentStatus": "",
            "AppointmentId": null,
            "AppointmentDate": null,
            "IsComingFromChart": false,
            "DoctorId": null,
            "DoctorName": "",
            "FacilityTypeId": 0,
        }
        // procedure notes object for CCDA
        $scope.ProcedureNotesObj = {
            "Notes": ""
        };
        $scope.IsAppointmentToday = false;
        $scope.pdfurl = "";
        $scope.CCDALink = "";
        $scope.Modalities = [];

        $scope.DoctorSignature = '';
        $scope.GetScribeDoctorList = function () {
            $scope.allSubSpecializationsArray = [];
            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.row.length > 0) {
                        $scope.allSubSpecializationsArray = resp.data.row;
                        $scope.cacheStorageItem.allSubSpecializationsArray = $scope.allSubSpecializationsArray || [];
                        $scope.listSubSplArray = angular.copy(resp.data.row);
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
                    function onGetUsersSuccess(resp) {
                        if (resp.rows.length > 0) {

                            $scope.allUserList = resp.rows;
                            if ($scope.allUserList.length !== 0) {
                                $scope.clinicDoctorList = [];
                                $scope.Calendardoctorlist1 = [];

                                $scope.AllDoctorList = angular.copy($scope.allUserList);
                                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                    return item.RoleId === 1 || item.RoleId === 43 || item.RoleId === 16;
                                });

                                var TempArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.UserId }, true) || [];
                                if (TempArray.length > 0) {
                                    $scope.DoctorSignature = TempArray[0].SignatureOfUser || '';
                                }

                                $scope.AllDoctorAssitantList = $filter("filter")($scope.AllDoctorList, function (item) {
                                    /*return item.RoleId === 16;*/
                                    if ($scope.userLoginDetails.RoleID == 16) {
                                        angular.forEach($scope.AllDoctorList, function (citem, $index) {
                                            $scope.selectedDoctorAssitant = "All";
                                            if (doctorInfo.doctordata.User[0].DoctorID !== citem.DoctorID) {
                                                $scope.selectedDoctorAssitant = userLoginDetails.displayName + '-' + userLoginDetails.RoleName;
                                            }

                                        });
                                    }

                                });
                                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43 || Aitem.RoleId === 18) {
                                        $scope.clinicDoctorList.push(Aitem);

                                    }
                                });



                            }

                        } else {
                            alertify.error("No Users Found in Selected Departments");
                            $scope.RoomDoctorsList = [];
                            $scope.FilteredRoomDoctorsList = [];
                        }
                    }

                    function onGetUsersFailure(data) {
                    }

                }
            });
        }


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
        $scope.GEtAddVisitObj = function () {
            let obj = {
                "PatientId": $scope.cacheStorageItem.patientid || null,
                "VisitReasonId": null,
                "DoctorId": null,
                "FacilityId": null,
                "ParentVisitId": null,
                "ExamTypeId": null,
                "DocObj": {},
                "doctorSearch": '',
                "VisitReasonObj": {
                    Reason: ''
                },
                "OrganizationFacilityId": 0,
                "ExamTypeId": 0,
                "VisitId": 0,
                "StatusFlag": "B",
                "FacilityTypeId": 0,
            }
            return obj;
        }
        $scope.AddVisitObj = $scope.GEtAddVisitObj();
        //$scope.IsClinlicalVisitTypeEdit = false;
        $scope.init = function () {
            $scope.PatientAllVisits = [];
            $scope.AllVisitReasons = [];
            $scope.FacilityList = [];
            $scope.CaseHistory = [];
            $scope.treatmentArray = [];
            $scope.SelectedAppointmentId = 0;
            // $scope.GetOpthaPatientCaseHistory();
            $scope.GetMasterTestUsed();
            $scope.GetScribeDoctorList();
            $scope.CaseHistory = [];
            var AppointmentTypeIds = null;
            AppointmentTypeIds = "1,2,3,5,6,8,9,10,4,7,14";
            let Cobj = {
                "PatientID": $scope.cacheStorageItem.patientid,
                "HospitalID": $scope.HospitalId,
                "AppointmentTypeIds": AppointmentTypeIds
            }
            //var getParams = {
            //    "OrganizationId": $scope.HospitalId,
            //};
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "FacilityName": ""
            }
            var visitsobj = {
                "PatientId": $scope.cacheStorageItem.patientid,
            }
            $q.all([
                eHnotePatientDataService.GetAppointmentsForCaseHistory(Cobj),
                eHnotePatientAddressDataServices.GetAllAppointmentTypes(),
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
               /* eHnotePatientVisitReasonServices.GetVisitReasonsForNewVist(getParams),*/
                eHnotePatientVisitReasonServices.GetOrganizationActiveClinicalVisitReasonsById($scope.HospitalId),
              /*  eHnoteAdminDepartmentService.GetOrganizationFacilityData(obj),*/
                eHnoteMainAppointmentService.GetAllPatientsvisits(visitsobj.PatientId)
            ]).then(function (resp) {
                if (resp[0].data.length > 0) {
                    // Comented because Visit Realted Consultation purpose
                    ////$scope.CaseHistory = resp[0].data;
                    //var ConsultationId = resp[0].data[0].ConsultationId || 0;
                    //var AppointmentId = resp[0].data[0].AppointmentId || 0;
                    //$scope.cacheStorageItem.ConsultationID = resp[0].data[0].ConsultationId || 0;
                    //$scope.AppointmentTypeId = resp[0].data[0].AppointmentTypeId || 0;
                    //$scope.ChartObj.DoctorId = resp[0].data[0].DoctorId || 0;
                    //$scope.ChartObj.DoctorName = resp[0].data[0].DoctorName || "";
                    //$scope.ChartObj.AppointmentId = resp[0].data[0].AppointmentId || 0;
                    //$scope.ChartObj.AppointmentDate = resp[0].data[0].AppointmentDate || 0;
                    //$scope.ChartObj.AppointmentTypeId = resp[0].data[0].AppointmentTypeId || null;
                    //$scope.ChartObj.AppointmentStatus = resp[0].data[0].AppointmentStatus || "";
                    //if ($scope.ChartObj.AppointmentStatus === 'C') {
                    //    $scope.ChartObj.AppointmentStatus = 'E';
                    //}
                    //var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    //appoint_info.TreatmentPlanId = resp[0].data[0].TreatmentPlanId || 0;
                    //appoint_info.AppointmentID = resp[0].data[0].AppointmentId || 0;
                    //appoint_info.ConsultationId = resp[0].data[0].ConsultationId || 0;
                    //eHnoteMasterDataService.addAppointmentInfo(appoint_info);

                    //$scope.SelectedAppointmentId = resp[0].data[0].AppointmentId || 0;
                    //if ($scope.ChartObj.AppointmentTypeId != 4) {
                    //    if ($scope.ChartObj.IsComingFromChart == true) {
                    //        $scope.ChartObj.DoctorId = $scope.SelectedAppointmentobj.DoctorId || 0;
                    //        $scope.ChartObj.DoctorName = $scope.SelectedAppointmentobj.DoctorName || "";
                    //        $scope.ChartObj.AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                    //        $scope.ChartObj.AppointmentDate = $scope.SelectedAppointmentobj.AppointmentDate || 0;
                    //        $scope.SelectedAppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                    //        var ConsultationId = $scope.SelectedAppointmentobj.ConsultationId || 0;
                    //        var AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                    //    }

                    //    $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);
                    //}



                    //var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                    //if (currentdate === $scope.ChartObj.AppointmentDate) {
                    //    $scope.IsAppointmentToday = true;
                    //} else {
                    //    $scope.IsAppointmentToday = false;
                    //}
                    //let obj = {
                    //    "SubTab": $scope.ChartObj.AppointmentTypeId == 4 ? 7 : 2,
                    //    "AppointmentTypeId": $scope.ChartObj.AppointmentTypeId,
                    //    "AppointmentId": $scope.ChartObj.AppointmentId,
                    //    /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                    //    "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                    //    "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                    //}
                    //$scope.$broadcast("ASCAllvisits", obj);
                    //datapersistanceFactory.set('ASCPastvisits', obj);
                }

                if (resp[1].data.length > 0) {
                    $scope.appointmentTypes = [];
                    $scope.appointmentTypes = resp[1].data || [];
                }
                if (resp[2].data.CheifComplaintSeverity.length > 0) {
                    $scope.GetAssSeverityList = [];
                    $scope.GetAssSeverityList = resp[2].data.CheifComplaintSeverity || [];
                    $scope.Modalities = resp[2].data.Modalities || [];
                }
                if (resp[3].data.Status == "Success") {
                    //var obj = {
                    //    "ActiveIND": "Y",
                    //    "Reason": "All Visit Reason",
                    //    "ReasonId": 0,
                    //    "ReasonTypeId": 1,
                    //    "Remarks": "",
                    //    "VisitReasonColorCode": "",
                    //    "VisitTypeId": 0,
                    //    "VisitTypeName": "",
                    //    "VisitiTypeCode": ""
                    //};
                    $scope.AllVisitReasons = angular.copy(resp[3].data.rows) || [];
                    //if ($scope.AllVisitReasons.length > 0) {
                    //    $scope.AllVisitReasons = $filter("filter")($scope.AllVisitReasons, function (item) {
                    //        return item.ActiveIND === 'Y';
                    //    });

                    //    $scope.AllVisitReasons.unshift(obj);
                    //}
                }
               
                if (resp[4].data.Status === "Success") {
                    if (resp[4].data.rows.length != 0) {
                        $scope.PatientAllVisits = resp[4].data.rows || [];
                        $scope.CaseHistory = resp[4].data.rows || [];
                        var VisitId = resp[4].data.rows[0].VisitId || 0;
                        var AppointmentId = resp[4].data.rows[0].AppointmentId || 0;
                        $scope.cacheStorageItem.ConsultationID = resp[4].data.rows[0].ConsultationId || 0;
                        $scope.cacheStorageItem.PatientVisitId = VisitId || 0;
                        $scope.AddToCache();
                        $scope.AppointmentTypeId = resp[4].data.rows[0].AppointmentTypeId || 0;
                        $scope.ChartObj.DoctorId = resp[4].data.rows[0].DoctorId || 0;
                        $scope.ChartObj.DoctorName = resp[4].data.rows[0].DoctorName || "";
                        $scope.ChartObj.AppointmentDate = resp[4].data.rows[0].VisitDate || 0;

                        if (AppointmentId != 0) {
                            $scope.ChartObj.AppointmentId = resp[4].data.rows[0].AppointmentId || 0;
                            //$scope.ChartObj.AppointmentTypeId = resp[4].data.rows[0].VisitTypeId || null;
                            $scope.ChartObj.AppointmentStatus = resp[4].data.rows[0].AppointmentStatus || "";
                            if ($scope.ChartObj.AppointmentStatus === 'C') {
                                $scope.ChartObj.AppointmentStatus = 'E';
                            }
                        }


                        var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                        appoint_info.TreatmentPlanId = resp[4].data.rows[0].TreatmentPlanId || 0;
                        appoint_info.AppointmentID = resp[4].data.rows[0].AppointmentId || 0;
                        appoint_info.ConsultationId = resp[4].data.rows[0].ConsultationId || 0;
                        appoint_info.VisitId = resp[4].data.rows[0].VisitId || 0;
                        eHnoteMasterDataService.addAppointmentInfo(appoint_info);

                        //$scope.IsClinlicalVisitTypeEdit = resp[5].data.rows[0].IsClinlicalVisitTypeEdit || false;
                        $scope.SelectedAppointmentId = resp[4].data.rows[0].AppointmentId || 0;

                        $scope.ChartObj.AppointmentTypeId = $scope.ChartObj.AppointmentTypeId || 0;
                        if ($scope.ChartObj.AppointmentTypeId != 4 && $scope.ChartObj.AppointmentTypeId != 14) {
                            if ($scope.ChartObj.IsComingFromChart == true) {
                                $scope.ChartObj.DoctorId = $scope.SelectedAppointmentobj.DoctorId || 0;
                                $scope.ChartObj.DoctorName = $scope.SelectedAppointmentobj.DoctorName || "";
                                $scope.ChartObj.AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                                $scope.ChartObj.AppointmentDate = $scope.SelectedAppointmentobj.AppointmentDate || 0;
                                $scope.SelectedAppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                                var ConsultationId = $scope.SelectedAppointmentobj.ConsultationId || 0;
                                var AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                            }

                            //    $scope.GetPatientAppointmenthistroy(VisitId, AppointmentId);
                        }



                        var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                        if (currentdate === $scope.ChartObj.AppointmentDate) {
                            $scope.IsAppointmentToday = true;
                        } else {
                            $scope.IsAppointmentToday = false;
                        }
                        $scope.SelectedVisitId = 0;
                        $scope.ChartObj.FacilityTypeId = 0;
                        //if ($scope.IsAppointmentToday) {
                        $scope.ChartObj.FacilityTypeId = resp[4].data.rows[0].FacilityTypeId || 0;
                        if ($scope.ChartObj.AppointmentTypeId != 0) {
                            if ((($scope.ChartObj.AppointmentTypeId != 4 && $scope.ChartObj.AppointmentTypeId != 14) || $scope.ChartObj.AppointmentTypeId != 7) && $scope.ChartObj.FacilityTypeId == 0) {
                                $scope.ChartObj.FacilityTypeId = 1;
                            }
                        }
                        if ($scope.ChartObj.FacilityTypeId == 1) {
                            $scope.SelectedVisitId = resp[4].data.rows[0].VisitId || 0;
                            $scope.GetPatientAppointmenthistroy('', $scope.ChartObj.AppointmentId);
                        }

                        /*}*/

                        let obj = {
                            "SubTab": ($scope.ChartObj.AppointmentTypeId == 4 || $scope.ChartObj.AppointmentTypeId == 14) ? 7 : 2,
                            "AppointmentTypeId": $scope.ChartObj.AppointmentTypeId,
                            "AppointmentId": $scope.ChartObj.AppointmentId,
                            /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                            "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                            "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                        }
                        console.log("ASCAllvisits called6");
                        $scope.$broadcast("ASCAllvisits", obj);
                        datapersistanceFactory.set('ASCPastvisits', obj);
                    }
                }

                if (resp[1].data.length > 0) {
                    $scope.appointmentTypes = [];
                    $scope.appointmentTypes = resp[1].data || [];
                }
                if (resp[2].data.CheifComplaintSeverity.length > 0) {
                    $scope.GetAssSeverityList = [];
                    $scope.GetAssSeverityList = resp[2].data.CheifComplaintSeverity || [];
                    $scope.Modalities = resp[2].data.Modalities || [];
                }

            });
            $scope.initOrgLogo();
        }

        $scope.$on("ChartSummary", function (evt, data) {
            console.log(data);
            $scope.ChartObj.SubMainTab = 1;
            /*$scope.GetOpthaPatientCaseHistory();*/
            $scope.GetAllPatientsvisits();
            $scope.SelectedAppointmentobj = data.SelectedAppointmentobj;
            $scope.ChartObj.IsComingFromChart = true;

        });

        function GetRemarksHeaders() {  // ROS Physical Evaluation
            var obj = [
                { "Id": 1, "Name": 'Eyes', "Active": "N" },
                { "Id": 2, "Name": 'Respiratory', "Active": "N" },
                { "Id": 3, "Name": 'ENT', "Active": "N" },
                { "Id": 4, "Name": 'Skin', "Active": "N" },
                { "Id": 5, "Name": 'Genito-Urinary', "Active": "N" },
                { "Id": 6, "Name": 'Gastro Interstinal', "Active": "N" },
                { "Id": 7, "Name": 'Cardio Vascular', "Active": "N" },
                { "Id": 8, "Name": 'Blood/Lymph', "Active": "N" },
                { "Id": 9, "Name": 'Psychiatric', "Active": "N" },
                { "Id": 10, "Name": 'Constitutional', "Active": "N" },
                { "Id": 11, "Name": 'Neurological', "Active": "N" },
                { "Id": 12, "Name": 'Muscolo skeletal', "Active": "N" },
                { "Id": 13, "Name": 'Endocrine', "Active": "N" },
                { "Id": 14, "Name": 'Immunologic', "Active": "N" }
            ];
            return obj;
        };

        function GetEyeName(SelectedEye) {
            if (SelectedEye === 1 || SelectedEye === "1") {
                return "OD";
            }
            if (SelectedEye === 2 || SelectedEye === "2") {
                return "OS";
            }
            if (SelectedEye === 3 || SelectedEye === "3") {
                return "OU";
            }
            if (SelectedEye === 4 || SelectedEye === "4") {
                return "General";
            }

            if (SelectedEye === 5 || SelectedEye === "5") {
                return "Hair";
            }
            if (SelectedEye === 6 || SelectedEye === "6") {
                return "Skin";
            }
            if (SelectedEye === 7 || SelectedEye === "7") {
                return "Laser";
            }
        }
        $scope.GetPatientAppointmenthistroy = function (consultationid, AppointmentID, navtype) {
            var type = 0;
            //if (consultationid === 0) {
            //    type = 1;
            //}
            var object = {
                "AppointmentId": AppointmentID || 0,
                "Type": type,
                /*"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0*/
                //    "ConsultationID": consultationid || 0
                "VisitId": $scope.cacheStorageItem.PatientVisitId,

            };
            eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                if (resp.data !== undefined) {
                    $scope.treatmentData = resp.data;
                    $scope.treatmentArray = [];

                    angular.forEach(resp.data, function (item) {
                        if ($scope.cacheStorageItem.PatientVisitId === item.VisitId) {
                            //if (AppointmentID === item.AppointmentId) {

                            // to show appointmnt date, time and doctor name
                            let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                            ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                            item.AppointmentTime = ApptTime;

                            if (item.ContactLensDetails.length > 0) {
                                angular.forEach(item.ContactLensDetails, function (hitem) {
                                    if (hitem.InvestigationDetails.length > 0) {
                                        angular.forEach(hitem.InvestigationDetails, function (titem) {
                                            titem.CreatedDateTime = titem.CreatedDateTime || null;
                                            if (titem.CreatedDateTime != null) {
                                                titem.CreatedDateTime = moment(titem.CreatedDateTime).format('MM-DD-YYYY h:mm a');
                                            }
                                        });
                                    }
                                });
                            }

                            $scope.treatmentArray.push(item);
                        }
                    });

                    if (resp.data.length > 0) {
                        $scope.referalMailBind = resp.data[0].ReferralDocemail || "";
                        $scope.referalDoctorID = resp.data[0].ReferalDoctorId;
                        $scope.cacheStorageItem.ReferalDoctorName = resp.data[0].ReferalDoctorName || "";
                        $scope.cacheStorageItem.RefeRalDoctorNotes = resp.data[0].RefeRalDoctorNotes || "";
                        $scope.DoctorSignature = resp.data[0].SignatureOfUser || "";
                    }

                    $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "VisitId": $scope.cacheStorageItem.PatientVisitId }, true);


                    $scope.cacheStorageItem.appointmentid = AppointmentID;
                    $scope.cacheStorageItem.ConsultationID = consultationid;
                    if ($scope.SelectedPlanArray.length > 0) {
                        $scope.AddVisitObj.StatusFlag = $scope.SelectedPlanArray[0].StatusFlag || 'B';
                        $scope.cacheStorageItem.DoctorID = $scope.SelectedPlanArray[0].DoctorId || 0;
                        $scope.IsEditConsultationAccess = false;
                        //if ($scope.cacheStorageItem.DoctorID !== $scope.UserId) {
                        //    if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43) {
                        //        $scope.IsEditConsultationAccess = false;
                        //    }
                        //}
                        if ($scope.cacheStorageItem.DoctorID === $scope.UserId) {
                            if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43) {
                                $scope.IsEditConsultationAccess = true;
                            }
                        }
                        if (($scope.cacheStorageItem.DoctorID !== $scope.UserId) && ($scope.AddVisitObj.StatusFlag != "C")) {
                            if (userLoginDetails.RoleID === 10 || userLoginDetails.RoleID === 18 || userLoginDetails.RoleID === 73 || userLoginDetails.RoleID === 16) {
                                $scope.IsEditConsultationAccess = true;
                            }
                        }
                        $scope.RestructureToconsultation($scope.SelectedPlanArray[0], consultationid);
                        $scope.ProcedureNotesObj.Notes = $scope.SelectedPlanArray[0].OverallProcedureNotes || "";
                        // $scope.ConsultationObj.SummaryView = true;
                    }
                    $scope.cacheStorageItem.OPProceduresArray = $scope.cacheStorageItem.OPProceduresArray || [];

                    if ($scope.cacheStorageItem.OPProceduresArray.length > 0) {
                        angular.forEach($scope.cacheStorageItem.OPProceduresArray, function (item) {
                            item.PostOPEndDate = item.PostOPEndDate || "";
                            item.PostOPStartDate = item.PostOPStartDate || "";
                            item.PostOPEndDate = item.PostOPEndDate == "" ? item.PostOPEndDate : $filter("date")(new Date(item.PostOPEndDate), "MM-dd-yyyy");
                            item.PostOPStartDate = item.PostOPStartDate == "" ? item.PostOPStartDate : $filter("date")(new Date(item.PostOPStartDate), "MM-dd-yyyy");
                            item.SurgeryDate = $filter("date")(new Date(item.SurgeryDate), "MM-dd-yyyy");

                            item.OperativeNotes = item.OperativeNotes || "";
                            item.PostOpInstructions = item.PostOpInstructions || "";
                            item.Complications = item.Complications || "";
                            item.PreMedicationObservations = item.PreMedicationObservations || "";
                        });
                    }

                    $scope.cacheStorageItem.FamilyHistory = $scope.cacheStorageItem.FamilyHistory || [];
                    if ($scope.cacheStorageItem.FamilyHistory.length > 0) {
                        angular.forEach($scope.cacheStorageItem.FamilyHistory, function (Fitem) {
                            Fitem.RelationShipId = Fitem.RelationId || 0;
                            Fitem.RelationShipName = Fitem.RelationName || '';
                        });
                    }

                    if (navtype === "navToSummary") {
                        $scope.ChartObj.SubMainTab = 1;
                    }

                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        };

        $scope.GetOpthaPatientCaseHistory = function (type) {
            $scope.CaseHistory = [];
            var AppointmentTypeIds = null;
            AppointmentTypeIds = "1,2,3,5,6,8,9,10,4,7,14";


            var object = {
                "PatientID": $scope.cacheStorageItem.patientid,
                "HospitalID": $scope.HospitalId,
                "AppointmentTypeIds": AppointmentTypeIds
            };
            eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.length > 0) {
                        $scope.CaseHistory = resp.data;
                        var ConsultationId = resp.data[0].ConsultationId || 0;
                        var AppointmentId = resp.data[0].AppointmentId || 0;
                        $scope.AppointmentTypeId = resp.data[0].AppointmentTypeId || 0;
                        $scope.ChartObj.DoctorId = resp.data[0].DoctorId || 0;
                        $scope.ChartObj.DoctorName = resp.data[0].DoctorName || "";
                        $scope.ChartObj.AppointmentId = resp.data[0].AppointmentId || 0;
                        $scope.ChartObj.AppointmentDate = resp.data[0].AppointmentDate || 0;
                        $scope.SelectedAppointmentId = resp.data[0].AppointmentId || 0;
                        if ($scope.ChartObj.IsComingFromChart == true) {
                            $scope.ChartObj.DoctorId = $scope.SelectedAppointmentobj.DoctorId || 0;
                            $scope.ChartObj.AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                            $scope.ChartObj.AppointmentDate = $scope.SelectedAppointmentobj.AppointmentDate || 0;
                            $scope.SelectedAppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                            var ConsultationId = $scope.SelectedAppointmentobj.ConsultationId || 0;
                            var AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                        }

                        $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId, type);

                        var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                        if (currentdate === $scope.ChartObj.AppointmentDate) {
                            $scope.IsAppointmentToday = true;
                        } else {
                            $scope.IsAppointmentToday = false;
                        }
                    }
                }
                if (resp.data.status === "Failure") {
                    alertify.error("Getting Casehistory Failed");
                    return;
                }
            }, function (err) {
                alertify.error("Getting Casehistory Failed");
                $scope.CaseHistory = [];
            });
        };
        $scope.GetScoreObject = function () {
            return {
                "PHQScore": 0,
                "AUDITScore": 0,
                "NHANESscore": 0,
                "HARKscore": 0
            }
        };
        $scope.ScoreObject = angular.copy($scope.GetScoreObject());
        $scope.ChangesConsultation = function (item) {
            var ConsultationId = item.ConsultationId || 0;
            var AppointmentId = item.AppointmentId || 0;
            $scope.ChartObj.DoctorId = item.DoctorId || 0;
            $scope.ChartObj.DoctorName = item.DoctorName || "";
            $scope.ChartObj.AppointmentId = item.AppointmentId || 0;
            $scope.ChartObj.AppointmentDate = item.VisitDate || null;
            item.AppointmentId = item.AppointmentId || 0;
            if (item.AppointmentId != 0) {

                item.AppointmentDetails = item.AppointmentDetails || [];
                if (item.AppointmentDetails.length > 0) {
                    let AppointmentDetails = item.AppointmentDetails[0];
                    /*$scope.ChartObj.AppointmentDate = AppointmentDetails.AppointmentDate || 0;*/
                    $scope.ChartObj.AppointmentTypeId = AppointmentDetails.AppointmentTypeId || null;
                    $scope.ChartObj.AppointmentStatus = AppointmentDetails.AppointmentStatusId || "";
                } else {
                    $scope.ChartObj.AppointmentTypeId = null;

                }

            } else {
                $scope.ChartObj.AppointmentTypeId = null;
                $scope.ChartObj.AppointmentStatus = "";
            }

            $scope.cacheStorageItem.PatientVisitId = item.VisitId || 0;
            $scope.cacheStorageItem.AppointmentId = item.AppointmentId || 0;
            $scope.AddToCache();
            if ($scope.ChartObj.AppointmentStatus === 'C') {
                $scope.ChartObj.AppointmentStatus = 'E';
            }
            item.FacilityTypeId = item.FacilityTypeId || 0;

            $scope.ChartObj.AppointmentTypeId = $scope.ChartObj.AppointmentTypeId || null;
            if ($scope.ChartObj.AppointmentTypeId != null) {
                if ((($scope.ChartObj.AppointmentTypeId != 4 && $scope.ChartObj.AppointmentTypeId != 14) || $scope.ChartObj.AppointmentTypeId != 7) && item.FacilityTypeId == 0) {
                    item.FacilityTypeId = 1;
                }
                if (($scope.ChartObj.AppointmentTypeId === 4 || $scope.ChartObj.AppointmentTypeId === 14 || $scope.ChartObj.AppointmentTypeId === 7) && item.FacilityTypeId == 0) {
                    item.FacilityTypeId = 3;
                }
            }
            $scope.ChartObj.FacilityTypeId = item.FacilityTypeId || 0;
            if (item.FacilityTypeId == 3 || item.FacilityTypeId == 2) {

                if (($scope.ChartObj.AppointmentId != 0) && ($scope.ChartObj.AppointmentTypeId === 4 || $scope.ChartObj.AppointmentTypeId === 14 || $scope.ChartObj.AppointmentTypeId === 7)) {
                    let obj = {
                        "SubTab": ($scope.ChartObj.AppointmentTypeId == 4 || $scope.ChartObj.AppointmentTypeId == 14) ? 7 : 2,
                        "AppointmentTypeId": $scope.ChartObj.AppointmentTypeId,
                        "AppointmentId": $scope.ChartObj.AppointmentId,
                        /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                        "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                        "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                    }
                    console.log("ASCAllvisits called5");
                    $scope.$broadcast("ASCAllvisits", obj);
                    datapersistanceFactory.set('ASCPastvisits', obj);
                    //$scope.cacheStorageItem.PatientID = item.PatientId;
                    //$scope.cacheStorageItem.AppointmentId = item.AppointmentId;
                    //eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                }
            }
            else if (item.FacilityTypeId == 1 && $scope.ChartObj.AppointmentTypeId !== 4 && $scope.ChartObj.AppointmentTypeId !== 14 && $scope.ChartObj.AppointmentTypeId !== 7) {
                $scope.GetPatientAppointmenthistroy($scope.cacheStorageItem.PatientVisitId, AppointmentId);
            }
            else {
                $scope.treatmentArray = [];
                $scope.IsAppointmentToday = false;
                $scope.ChartObj.FacilityTypeId = 0;
            }
            //if (item.FacilityTypeId == 0) {
            //    $scope.treatmentArray = [];
            //    $scope.IsAppointmentToday = false;
            //}



            $scope.SelectedAppointmentId = item.AppointmentId || 0;
            $scope.SelectedVisitId = item.VisitId || 0;

            $scope.AppointmentTypeId = item.AppointmentTypeId || 0;
            var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
            if (currentdate === $scope.ChartObj.AppointmentDate) {
                $scope.IsAppointmentToday = true;
            } else {
                $scope.IsAppointmentToday = false;
            }
        }

        //$scope.GetMasterTestUsed = function () {
        //    return [
        //        {
        //            "TestUserId": 1,
        //            "TestName": "Snellen"
        //        },
        //        {
        //            "TestUserId": 2,
        //            "TestName": "HOTV"
        //        },
        //        {
        //            "TestUserId": 3,
        //            "TestName": "ATS"
        //        },
        //        {
        //            "TestUserId": 4,
        //            "TestName": "LEA"
        //        },
        //        {
        //            "TestUserId": 5,
        //            "TestName": "AC"
        //        },
        //        {
        //            "TestUserId": 6,
        //            "TestName": "PLT"
        //        },
        //        {
        //            "TestUserId": 7,
        //            "TestName": "Numbers"
        //        }
        //    ]
        //};
        //   $scope.MasterTestUsedlist = angular.copy($scope.GetMasterTestUsed());
        $scope.GetMasterTestUsed = function () {
            $scope.MasterTestUsedlist = [];
            eHnoteSettingsDataService.GetMasterTestUsed().then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.MasterTestUsedlist = resp.data.rows || [];
                }

            });
        };

        $scope.init();


        /* After save load the data*/

        $scope.RestructureToconsultation = function (plan, consultationid) {

            $scope.Accordionobj = {
                "IsShowChiefComplaintsData": true,
                "IsShowROSData": true,
                "IsShowVisionPerceptionData": true,
                "IsShowContactLensData": true,
                "IsShowExaminationData": true,
                "IsShowAssessmentData": true,
                "IsShowOrdersData": true,
                "IsShowMedicalRXData": true,
                "IsShowGlassRXData": true,
                "IsShowProceduresData": true,
                "IsShowSuperBillData": true,
                "IsShowGeneralPlanData": true
            }

            plan = plan || "";
            console.log("plan log");
            $scope.cacheStorageItem.IsNewConsultation = false;
            $scope.cacheStorageItem.IsEditConsultation = true;
            $scope.cacheStorageItem.IsFollowupConsultation = false;
            $scope.cacheStorageItem.isNKISelected = plan.isNKISelected || false;
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
            if (plan !== "") {
                if (plan.ReferalDoctorId) {
                    $scope.cacheStorageItem.ReferalDoctorId = plan.ReferalDoctorId || "";
                    $scope.cacheStorageItem.RefeRalDoctorNotes = plan.RefeRalDoctorNotes || "";
                    $scope.cacheStorageItem.ReferalDoctorName = plan.ReferalDoctorName || "";
                    $scope.cacheStorageItem.ReferalDoctorType = plan.referraldoctype || "";
                    $scope.cacheStorageItem.ReferalOrgId = plan.ReferalOrgId || "";
                    $scope.cacheStorageItem.ReferalId = plan.ConsulRefId;
                }


                plan.ScribeName = plan.ScribeName || "";
                plan.FollowUpVisitReasonName = plan.FollowUpVisitReasonName || "";
                plan.FollowupOnsetType = plan.FollowupOnsetType || "";

                $scope.cacheStorageItem.OverallChartNotes = plan.OverallChartNotes || "";
                $scope.cacheStorageItem.AppointmentTime = plan.AppointmentTime || "";

                //Ros Overall Remarks
                $scope.cacheStorageItem.AllergyRemarks = plan.AllergyRemarks || "";
                $scope.cacheStorageItem.SurgicalRemarks = plan.SurgicalRemarks || "";
                $scope.cacheStorageItem.CurrentEyeRemarks = plan.CurrentEyeRemarks || "";
                $scope.cacheStorageItem.CurrentSystemicRemarks = plan.CurrentSystemicRemarks || "";
                $scope.cacheStorageItem.SystemicHistoryRemarks = plan.SystemicHistoryRemarks || "";
                $scope.cacheStorageItem.OccularHistoryRemarks = plan.OccularHistoryRemarks || "";
                $scope.cacheStorageItem.OcularSurgicalHistoryRemarks = plan.OcularSurgicalHistoryRemarks || "";
                $scope.cacheStorageItem.FunctionalStatusRemarks = plan.FunctionalStatusRemarks || "";
                $scope.cacheStorageItem.VaccinationHistoryRemarks = plan.VaccinationHistoryRemarks || "";
                $scope.cacheStorageItem.BirthHistoryRemarks = plan.BirthHistoryRemarks || "";
                $scope.cacheStorageItem.NutritionalHistoryRemarks = plan.NutritionalHistoryRemarks || "";
                $scope.cacheStorageItem.MenstrualHistoryRemarks = plan.MenstrualHistoryRemarks || "";
                $scope.cacheStorageItem.PhysicalEvaluationRemarks = plan.PhysicalEvaluationRemarks || "";
                $scope.cacheStorageItem.PsychiatryRemarks = plan.PsychiatryRemarks || "";
                $scope.cacheStorageItem.HealthGoalsRemarks = plan.HealthGoalsRemarks || "";
                $scope.cacheStorageItem.LabInvestigationsRemarks = plan.LabInvestigationsRemarks || "";
                $scope.cacheStorageItem.FamilyHistoryRemarks = plan.FamilyHistoryRemarks || "";
                $scope.cacheStorageItem.ImplantRemarks = plan.ImplantRemarks || "";
                $scope.cacheStorageItem.PsychologicalObservRemarks = plan.PsychologicalObservRemarks || "";
                $scope.cacheStorageItem.VitalsRemarks = plan.VitalsRemarks || "";
                $scope.cacheStorageItem.LifestyleHistoryRemarks = plan.LifestyleHistoryRemarks || "";
                $scope.cacheStorageItem.PrescriptionDetails = plan.PatientPrescription || [];
                $scope.cacheStorageItem.MedicationLastUpdateDate = plan.MedicationLastUpdateDate || null;
                $scope.cacheStorageItem.PrescriptionLastUpdateDate = plan.PrescriptionLastUpdateDate || null;
                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (bitem) {
                        bitem.CompleteAction = bitem.CompleteAction || null;
                    });
                }
                //AllergyItems
                if (plan.AllergyItems !== undefined) {
                    if (plan.AllergyItems.length !== 0) {
                        $scope.cacheStorageItem.AllergyItems = plan.AllergyItems || [];

                        angular.forEach($scope.cacheStorageItem.AllergyItems, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                // Amendments
                if (plan.PatientAmendments !== undefined) {
                    if (plan.PatientAmendments.length !== 0) {
                        $scope.cacheStorageItem.PatientAmendments = plan.PatientAmendments || [];
                    }
                }
                //MedicalConditions
                if (plan.MedicalConditions !== undefined) {
                    if (plan.MedicalConditions.length !== 0) {
                        $scope.cacheStorageItem.MedicalConditions = plan.MedicalConditions;
                        angular.forEach($scope.cacheStorageItem.MedicalConditions, function (suitem) {
                            suitem.ActiveIND = "Y";
                        });
                    }
                }
                //CurrentEyeMedications
                if (plan.CurrentEyeMedications !== undefined) {
                    if (plan.CurrentEyeMedications.length !== 0) {
                        angular.forEach(plan.CurrentEyeMedications, function (item) {
                            item.IsAllnormal = false;
                            item.StartDate = $filter('date')(item.StartDate, "MM-dd-yyyy")
                            if (item.MedicineId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.CurrentEyeMedications = plan.CurrentEyeMedications;

                        angular.forEach($scope.cacheStorageItem.CurrentEyeMedications, function (suitem) {
                            suitem.DeleteInd = "N";
                        });
                    }
                }

                //BirthHistory
                if (plan.BirthHistory !== undefined) {
                    if (plan.BirthHistory.length !== 0) {
                        angular.forEach(plan.BirthHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.BirthHistory = plan.BirthHistory;

                        angular.forEach($scope.cacheStorageItem.BirthHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //NutritionalHistory
                if (plan.NutritionalHistory !== undefined) {
                    if (plan.NutritionalHistory.length !== 0) {
                        angular.forEach(plan.NutritionalHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.NutritionalHistory = plan.NutritionalHistory;

                        angular.forEach($scope.cacheStorageItem.NutritionalHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //SystemicHistory
                if (plan.SystemicHistory !== undefined) {
                    if (plan.SystemicHistory.length !== 0) {
                        angular.forEach(plan.SystemicHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        angular.forEach(plan.SystemicHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.SystemicHistory = plan.SystemicHistory;

                        angular.forEach($scope.cacheStorageItem.SystemicHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //MenstrualHistory
                if (plan.MenstrualHistory !== undefined) {
                    if (plan.MenstrualHistory.length !== 0) {
                        angular.forEach(plan.MenstrualHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.MenstrualHistory = plan.MenstrualHistory;

                        angular.forEach($scope.cacheStorageItem.MenstrualHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //SurgicalHistory
                if (plan.SurgicalHistory !== undefined) {
                    if (plan.SurgicalHistory.length !== 0) {
                        angular.forEach(plan.SurgicalHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.SurgicalHistory = plan.SurgicalHistory;

                        angular.forEach($scope.cacheStorageItem.SurgicalHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //FunctionalStatusHistory
                if (plan.FunctionalStatusHistory !== undefined) {
                    if (plan.FunctionalStatusHistory.length !== 0) {
                        angular.forEach(plan.FunctionalStatusHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.FunctionalStatusHistory = plan.FunctionalStatusHistory;

                        angular.forEach($scope.cacheStorageItem.FunctionalStatusHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //CurrentSystemicMedicationsHistory
                $scope.cacheStorageItem.MedicalReconcillation = plan.MedicalReconcillation || false;
                if (plan.CurrentSystemicMedicationsHistory !== undefined) {
                    if (plan.CurrentSystemicMedicationsHistory.length !== 0) {
                        angular.forEach(plan.CurrentSystemicMedicationsHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.MedicineId == 1) {
                                item.IsAllnormal = true;
                            }
                        });
                        $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = plan.CurrentSystemicMedicationsHistory;

                        angular.forEach($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, function (suitem) {
                            suitem.ActiveInd = true;
                            suitem.DeleteInd = "N";
                            suitem.Frequency = suitem.Frequency || "";
                            suitem.RcopiaPrescriptionId = suitem.RcopiaPrescriptionId || null;
                            suitem.RcopiaMedicationId = suitem.RcopiaMedicationId || null;
                        });
                    }
                }
                //OccularSurgicalHistory
                if (plan.OccularSurgicalHistory !== undefined) {
                    if (plan.OccularSurgicalHistory.length !== 0) {
                        angular.forEach(plan.OccularSurgicalHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }

                        });
                        $scope.cacheStorageItem.OcularSurgicalHistory = plan.OccularSurgicalHistory;

                        angular.forEach($scope.cacheStorageItem.OcularSurgicalHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //OccularHistory
                if (plan.OccularHistory !== undefined) {
                    if (plan.OccularHistory.length !== 0) {

                        angular.forEach(plan.OccularHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }

                        });

                        $scope.cacheStorageItem.OccularHistory = plan.OccularHistory;

                        angular.forEach($scope.cacheStorageItem.OccularHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //LifestyleHistory
                if (plan.LifestyleHistory !== undefined) {
                    if (plan.LifestyleHistory.length !== 0) {

                        angular.forEach(plan.LifestyleHistory, function (sitem) {
                            sitem.LifestyleHistoryDataIsPresent = false;
                            if (sitem.Smokinglist.length > 0) {
                                angular.forEach(sitem.Smokinglist, function (titem) {
                                    if (titem.SmokingType == 'Yes' || titem.SmokingType == 'No' || titem.SmokingStatusName != '' || titem.SmokingQuantityName != '' || titem.SmokingDuration != '' || sitem.AlcoholType == 'Yes' || sitem.AlcoholType == 'No' || sitem.AlcoholStatusName != '' || sitem.AlcoholQuantityName != '' || sitem.AlcoholDuration != '' || sitem.AlcoholDurationDate != '' || (sitem.DrugArray).length > 0 || sitem.DrugType == 'Yes' || sitem.DrugType == 'No' || sitem.DrugDuration != '' || sitem.DrugDurationDate != '' || sitem.DrugWhenQuit != '') {
                                        sitem.LifestyleHistoryDataIsPresent = true;
                                    }
                                });
                            }
                            if (sitem.SmokingType == '' && sitem.AlcoholType == '' && sitem.DrugType == '') {
                                //sitem.Remarks = '';
                                sitem.LifestyleHistoryDataIsPresent = false;
                            }
                        });

                        $scope.cacheStorageItem.LifestyleHistory = plan.LifestyleHistory;

                        //angular.forEach($scope.cacheStorageItem.LifestyleHistory, function (suitem) {
                        //    suitem.ActiveInd = true;
                        //});
                    }
                }
                //FamilyHistory
                if (plan.FamilyHistory !== undefined) {
                    if (plan.FamilyHistory.length !== 0) {
                        angular.forEach(plan.FamilyHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }

                        });
                        $scope.cacheStorageItem.FamilyHistory = plan.FamilyHistory;

                        angular.forEach($scope.cacheStorageItem.FamilyHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                //VaccinationHistory
                if (plan.VaccinationHistory !== undefined) {

                    if (plan.VaccinationHistory.length !== 0) {
                        angular.forEach(plan.VaccinationHistory, function (item) {
                            item.IsAllnormal = false;
                            if (item.HistoryId == 1) {
                                item.IsAllnormal = true;
                            }

                        });
                        $scope.cacheStorageItem.VaccinationHistory = plan.VaccinationHistory;

                        angular.forEach($scope.cacheStorageItem.VaccinationHistory, function (suitem) {
                            suitem.ActiveInd = true;
                        });
                    }
                }
                if (plan.LabInvestigations !== undefined) {

                    if (plan.LabInvestigations.length !== 0) {
                        angular.forEach(plan.LabInvestigations, function (item) {
                            item.IsAllnormal = false;
                            if (item.ProcedureId == 1) {
                                item.IsAllnormal = true;
                            }

                        });
                        $scope.cacheStorageItem.LabInvestigations = plan.LabInvestigations;
                    }
                }

                if (plan.PsychiatryData !== undefined) {
                    if (plan.PsychiatryData.length !== 0) {
                        $scope.cacheStorageItem.PsychiatryData = plan.PsychiatryData;
                    }
                }


                if (plan.PsychologicalObservationsArray !== undefined) {
                    if (plan.PsychologicalObservationsArray.length !== 0) {
                        $scope.ScoreObject = angular.copy($scope.GetScoreObject());
                        angular.forEach(plan.PsychologicalObservationsArray, function (Aitem) {
                            if (Aitem.TypeId == 1) {
                                if (Aitem.QuestionId == 4) {
                                    angular.forEach(Aitem.SubQuestions, function (item) {
                                        $scope.ScoreObject.PHQScore += item.Score;
                                    });
                                }

                                if (Aitem.QuestionId == 7) {
                                    angular.forEach(Aitem.SubQuestions, function (item) {
                                        $scope.ScoreObject.AUDITScore += item.Score;
                                    });
                                }
                            }
                            if (Aitem.TypeId == 2) {
                                $scope.ScoreObject.NHANESscore += Aitem.Score;
                            }
                            if (Aitem.TypeId == 3) {
                                $scope.ScoreObject.HARKscore += Aitem.Score;
                            }
                        });

                        $scope.cacheStorageItem.PsychologicalObservationsArray = angular.copy(plan.PsychologicalObservationsArray);
                    } else {
                        $scope.ScoreObject = angular.copy($scope.GetScoreObject());
                    }
                }

                //CustomAllergyRemarks
                plan.CustomAllergyRemarks = plan.CustomAllergyRemarks || [];
                angular.forEach(plan.CustomAllergyRemarks, function (hitem) {
                    hitem.CustomAllergyValue = hitem.CustomAllergyValue || '';
                    hitem.IsShowCustomallergy = false;
                    if (hitem.CustomAllergyValue != '' && hitem.ActiveInd == 'Y') {
                        hitem.IsShowCustomallergy = true;
                    }
                });
                $scope.cacheStorageItem.ROSAllergyRemarkDetails = [];
                if (plan.CustomAllergyRemarks.length > 0) {
                    $scope.cacheStorageItem.ROSAllergyRemarkDetails = angular.copy(plan.CustomAllergyRemarks);

                    $scope.cacheStorageItem.ROSAllergyHeaders = angular.copy(GetRemarksHeaders());
                    if ($scope.cacheStorageItem.ROSAllergyRemarkDetails.length > 0) {
                        angular.forEach($scope.cacheStorageItem.ROSAllergyHeaders, function (hitem) {
                            var filetrarray = $filter("filter")($scope.cacheStorageItem.ROSAllergyRemarkDetails, function (iterator, ind) { return iterator.CustomAllergyRemarkCategory == hitem.Name && (iterator.CustomAllergyValue == 'Y' || iterator.CustomAllergyValue == 'N'); }) || [];
                            if (filetrarray.length > 0) {
                                hitem.Active = "Y";
                            }
                        });
                    }
                }

                //ChiefComplaints
                if (plan.ChiefComplaints !== undefined) {
                    if (plan.ChiefComplaints.length !== 0) {
                        $scope.cacheStorageItem.ChiefComplaints = plan.ChiefComplaints;
                    }
                }
                $scope.isCollapsedSummary = true;
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
                //if (plan.OrderDetails !== undefined) {
                //    if (plan.OrderDetails.length !== 0) {
                //        angular.forEach(plan.OrderDetails, function (item) {
                //            item.OrderDate = item.OrderDate;
                //        });
                //        $scope.cacheStorageItem.OrderDetails = plan.OrderDetails;
                //    }
                //}

                if (plan.InvestigationsDetails !== undefined) {
                    if (plan.InvestigationsDetails.length !== 0) {
                        angular.forEach(plan.InvestigationsDetails, function (item) {
                            item.OrderDate = item.OrderDate;
                        });
                        $scope.cacheStorageItem.InvestigationsDetails = plan.InvestigationsDetails;
                    }
                }
                if (plan.ProceduresDetails !== undefined) {
                    if (plan.ProceduresDetails.length !== 0) {
                        angular.forEach(plan.ProceduresDetails, function (item) {
                            item.OrderDate = item.OrderDate;
                        });
                        $scope.cacheStorageItem.ProceduresDetails = plan.ProceduresDetails;
                    }
                }
                if (plan.SurgeriesDetails !== undefined) {
                    if (plan.SurgeriesDetails.length !== 0) {
                        angular.forEach(plan.SurgeriesDetails, function (item) {
                            item.OrderDate = item.OrderDate;
                        });
                        $scope.cacheStorageItem.SurgeriesDetails = plan.SurgeriesDetails;
                    }
                }
                if (plan.ReferralDetails !== undefined) {
                    if (plan.ReferralDetails.length !== 0) {
                        angular.forEach(plan.ReferralDetails, function (item) {
                            item.OrderDate = item.OrderDate;
                            item.Description = "Referral";
                        });
                        $scope.cacheStorageItem.ReferralDetails = plan.ReferralDetails;
                    }
                }


                $scope.cacheStorageItem.RegisterPatientNotesArray = [];
                plan.PatientNotesArray = plan.PatientNotesArray || [];
                if (plan.PatientNotesArray.length > 0) {
                    angular.forEach(plan.PatientNotesArray, function (pitem) {
                        if (pitem.AppointmentId == $scope.cacheStorageItem.appointmentid) {
                            $scope.cacheStorageItem.RegisterPatientNotesArray.push(pitem);
                        }
                    });
                }

                //AssessmentPlan
                if (plan.AssessmentPlan !== undefined) {
                    if (plan.AssessmentPlan.length !== 0) {
                        $scope.cacheStorageItem.AssessmentPlan = [];
                        plan.AssessmentPlan.forEach(function (diag, index) {
                            diag.ISAccordianshow = false;
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
                                        "PatientProcedureId": item.PatientProcedureId,
                                        "SpecializationId": item.SpecializationId,
                                        "ProcedureCode": item.ProcedureCode || "",
                                        "OrgProcedureId": item.OrgProcedureId,
                                        "ProcedureId": item.ProcedureId,
                                        "ProcedureName": item.ProcedureName,
                                        "CreatedDateTime": item.CreatedDateTime,
                                        "ProceduredDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                        "OrganId": item.OrganId,
                                        "OrganName": GetEyeName(item.OrganId,),
                                        "ProcedureNotes": item.ProcedureNotes,
                                        "DeleteInd": "N",
                                        "StatusId": item.StatusId,
                                        "Status": item.Status || '',
                                        "BookingStatusId": item.BookingStatusId || "",
                                        "Duration": item.Duration || 0,
                                        "DurationType": item.DurationType || '',
                                        "DurationDate": item.DurationDate || null,
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
                            //diag.InvestigationsArray = diag.InvestigationArray || [];
                            diag.InvestigationsArray = diag.InvestigationsArray || [];
                            diag.ProceduresArray = diag.ProceduresArray || [];
                            diag.PrescriptionArray = diag.PrescriptionArray || [];

                            if (diag.SnomedDescription != "") {
                                diag.SnomedCodeObject = diag.SnomedDescription + " - " + diag.SnomedCode || "";
                            }
                            $scope.cacheStorageItem.AssessmentPlan.push(diag);

                        });
                    }
                    else {
                        $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                    }
                } else {
                    $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                }

                //ContactLensDetails
                if (plan.ContactLensDetails !== undefined) {
                    if (plan.ContactLensDetails.length !== 0) {
                        $scope.cacheStorageItem.ContactLensDetails = [];
                        plan.ContactLensDetails.forEach(function (Citem) {
                            //Citem.CategoryId = 295;
                            //if (Citem.InvestigationId == 2078) {

                            //}

                            Citem.showstatus = false;
                            $scope.cacheStorageItem.ContactLensDetails.push(Citem);

                        });
                    }
                    else {
                        $scope.cacheStorageItem.ContactLensDetails = [];
                    }
                } else {
                    $scope.cacheStorageItem.ContactLensDetails = [];
                }
                //OPProceduresArray
                if (plan.OPProceduresArray !== undefined) {
                    if (plan.OPProceduresArray.length !== 0) {
                        $scope.cacheStorageItem.OPProceduresArray = [];
                        plan.OPProceduresArray.forEach(function (Citem) {
                            $scope.cacheStorageItem.OPProceduresArray.push(Citem);

                        });
                    }
                    else {
                        $scope.cacheStorageItem.OPProceduresArray = [];
                    }
                } else {
                    $scope.cacheStorageItem.OPProceduresArray = [];
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
                        plan.PatientNotesArray = plan.PatientNotesArray || [];
                        angular.forEach(plan.PatientNotesArray, function (pitem) {
                            if (pitem.AppointmentId == $scope.cacheStorageItem.appointmentid) {
                                $scope.cacheStorageItem.PatientNotesArray.push(pitem);
                            }
                        });
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
                //$scope.cacheStorageItem.SuperBillArray = plan.SuperBillArray || [];
                if ($scope.cacheStorageItem.SuperBillFinalObj != undefined) {
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillId = plan.SuperBillObj.SuperBillId;
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = plan.SuperBillObj.SuperBillArray || [];
                } else {
                    $scope.cacheStorageItem.SuperBillFinalObj = {
                        "SuperBillId": 0,
                        "SuperBillSuggestedCodes": []
                    };
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillId = plan.SuperBillObj.SuperBillId;
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = plan.SuperBillObj.SuperBillArray || [];
                }
                $scope.cacheStorageItem.ConsultationTreatments = plan.ConsultationTreatments || [];
                $scope.cacheStorageItem.FollowUpVisitreasonId = plan.FollowUpVisitreasonId || 0;
                $scope.cacheStorageItem.FollowUpVisitReasonName = plan.FollowUpVisitReasonName || "";
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

                //superbill
                //$scope.Modifiers = $scope.Modifiers || [];
                //if ($scope.Modifiers.length == 0) {
                //    $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                //}
                //if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                //    angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                //        if (item.DiagnosisArray.length > 0) {
                //            item.ShowDiagForAdd = true;
                //        } else {
                //            item.ShowDiagForAdd = false;
                //        }
                //        console.log($scope.Modifiers);
                //        let tempModifiers = angular.copy($scope.Modifiers) || [];
                //        angular.forEach(tempModifiers, function (kitem) {
                //            angular.forEach(item.Modifiers, function (hitem) {
                //                if (kitem.MODIFIERID == hitem.MODIFIERID) {
                //                    kitem.IsChecked = true;
                //                }
                //            });
                //        });

                //        item.Modifiers = angular.copy(tempModifiers) || [];
                //        item.DeleteInd = item.DeleteInd || false;

                //    });


                //}

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

                //RcopiaPrescription


                plan.PrescriptionsArray = plan.PrescriptionsArray || [];
                if (plan.PrescriptionsArray.length > 0) {
                    $scope.cacheStorageItem.rcopiaEprescriptionsArray = plan.PrescriptionsArray || [];
                }

                console.log($scope.cacheStorageItem.rcopiaEprescriptionsArray);


                //RcopiaMedications


                plan.MedicationsArray = plan.MedicationsArray || [];
                if (plan.MedicationsArray.length > 0) {
                    $scope.cacheStorageItem.rcopiaMedicationsArray = plan.MedicationsArray || [];
                }

                console.log($scope.cacheStorageItem.rcopiaMedicationsArray);


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

                $scope.visualacuityobj = {
                    "IsSCDistance": false,
                    "IsSCNear": false,
                    "IsCCGDistance": false,
                    "IsCCGNear": false,
                    "IsTACDistance": false,
                    "IsPinholeDistance": false,
                    "IsCCLDistance": false,
                    "IsCCLNear": false
                }
                if (plan.VisionDetails !== undefined) {
                    $scope.cacheStorageItem.FinalVisionDetails = plan.VisionDetails || [];
                    angular.forEach(plan.VisionDetails, function (item) {
                        if (item.ActiveInd === 'Y') {
                            if (item.InvestigationId === 4 || item.InvestigationId === 5 || item.InvestigationId === 12 || item.InvestigationId === 13 ||
                                item.InvestigationId === 2071 || item.InvestigationId === 2073 || item.InvestigationId === 2154 || item.InvestigationId === 2076) {
                                if (item.RightEyeValues.Distance !== "" || item.RightEyeValues.Near !== "" || item.RightEyeValues.Remarks !== "" ||
                                    item.LeftEyeValues.Distance !== "" || item.LeftEyeValues.Near !== "" || item.LeftEyeValues.Remarks !== "" ||
                                    item.BothEyeValues.Distance !== "" || item.BothEyeValues.Near !== "" || (item.BothEyeValues.Remarks !== "" && item.BothEyeValues.Remarks != undefined) ||
                                    item.Value !== "" || (item.Remarks !== "" && item.Remarks !== undefined)) {
                                    item.IsInvDataAdded = true;

                                    item.IsvisualactivityInd = true;
                                }

                            }
                        }

                        //if (item.InvestigationId === 2071) {
                        //    if (item.RightEyeValues.Distance != "" || item.LeftEyeValues.Distance != "" || item.BothEyeValues.Distance != "") {
                        //        $scope.visualacuityobj.IsCCLDistance = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsCCLDistance = false;
                        //    }
                        //    if (item.RightEyeValues.Near != '' || item.LeftEyeValues.Near != "" || item.BothEyeValues.Near != "") {
                        //        $scope.visualacuityobj.IsCCLNear = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsCCLNear = false;
                        //    }

                        //}

                        //if (item.InvestigationId === 5) {
                        //    if (item.RightEyeValues.Distance != "" || item.LeftEyeValues.Distance != "" || item.BothEyeValues.Distance != "") {
                        //        $scope.visualacuityobj.IsCCGDistance = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsCCGDistance = false;
                        //    }
                        //    if (item.RightEyeValues.Near != '' || item.LeftEyeValues.Near != "" || item.BothEyeValues.Near != "") {
                        //        $scope.visualacuityobj.IsCCGNear = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsCCGNear = false;
                        //    }

                        //}
                        //if (item.InvestigationId === 4) {
                        //    if (item.RightEyeValues.Distance != "" || item.LeftEyeValues.Distance != "" || item.BothEyeValues.Distance != "") {
                        //        $scope.visualacuityobj.IsSCDistance = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsSCDistance = false;
                        //    }
                        //    if (item.RightEyeValues.Near != '' || item.LeftEyeValues.Near != "" || item.BothEyeValues.Near != "") {
                        //        $scope.visualacuityobj.IsSCNear = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsSCNear = false;
                        //    }

                        //}
                        //if (item.InvestigationId === 2076) {
                        //    if (item.RightEyeValues.Remarks != "" || item.LeftEyeValues.Remarks != "") {
                        //        $scope.visualacuityobj.IsTACDistance = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsTACDistance = false;
                        //    }
                        //}
                        //if (item.InvestigationId === 13) {
                        //    if (item.RightEyeValues.Remarks != "" || item.LeftEyeValues.Remarks != "") {
                        //        $scope.visualacuityobj.IsPinholeDistance = true;
                        //    }
                        //    else {
                        //        $scope.visualacuityobj.IsPinholeDistance = false;
                        //    }
                        //}

                    });
                }

                if (plan.DilatedRetinoscopy !== undefined) {
                    $scope.cacheStorageItem.FinalDilatedRetinoscopyDetails = plan.DilatedRetinoscopy || [];
                }
                if (plan.CyloplegicRetinoscopy !== undefined) {
                    $scope.cacheStorageItem.FinalCyloplegicRetinoscopyDetails = plan.CyloplegicRetinoscopy || [];
                }
                if (plan.ManifestRetinoscopy !== undefined) {
                    $scope.cacheStorageItem.FinalManifestRetinoscopyDetails = plan.ManifestRetinoscopy || [];
                    angular.forEach(plan.ManifestRetinoscopy, function (kitem) {
                        if (kitem.RSpherical !== '' || kitem.RCylindrical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCNVA !== '' || kitem.RVAI !== '' || kitem.RDuo !== '' || kitem.RCs !== '' ||
                            kitem.RPrismVt !== '' || kitem.RBaseVt !== '' || kitem.RPrismHz !== '' || kitem.RBaseHz !== '' || kitem.RType !== '' || kitem.LSpherical !== '' || kitem.LCylindrical !== '' || kitem.LCylindrical !== '' || kitem.LAdition !== '' || kitem.LBCVA !== '' ||
                            kitem.LBCNVA !== '' || kitem.LVAI !== '' || kitem.LDuo !== '' || kitem.LCs !== '' || kitem.LPrismVt !== '' || kitem.LPrismVt !== '' ||
                            kitem.LPrismHz !== '' || kitem.LBaseHz !== '' || kitem.LType !== '' || kitem.BBCVA !== '' || kitem.BBCNVA !== '' || kitem.BVAI !== '' || kitem.BDuo !== '' || kitem.BCs !== '') {
                            kitem.IsDataAdded = true;

                        } else {
                            kitem.IsDataAdded = false;
                        }
                    });
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
                $scope.dilationobj = {
                    "IsBeforeDilation": false,
                    "IsAfterDilation": false,

                }
                if (plan.PupilSizeDetails.length > 0) {

                    var i = 0;
                    angular.forEach(plan.PupilSizeDetails, function (item) {
                        if (item.InvestigationId === 2133 || item.InvestigationId === 2134 || item.InvestigationId === 2135 || item.InvestigationId === 2161 ||
                            item.InvestigationId === 2160 || item.InvestigationId === 2162) {
                            if (item.AfterDilationLeftEye != "" || item.AfterDilationRightEye != "") {

                                i++;
                            }
                        }
                    });
                    if (i > 0) {
                        $scope.dilationobj.IsAfterDilation = true;
                    }
                    else {
                        $scope.dilationobj.IsAfterDilation = false;
                    }
                }

                if (plan.PupilSizeDetails.length > 0) {

                    var j = 0;
                    angular.forEach(plan.PupilSizeDetails, function (item) {
                        if (item.InvestigationId === 2133 || item.InvestigationId === 2134 || item.InvestigationId === 2135 || item.InvestigationId === 2161 ||
                            item.InvestigationId === 2160 || item.InvestigationId === 2162) {
                            if (item.BeforeDilationLeftEye != "" || item.BeforeDilationRightEye != "") {
                                j++;
                            }
                        }
                    });
                    if (j > 0) {
                        $scope.dilationobj.IsBeforeDilation = true;
                    }
                    else {
                        $scope.dilationobj.IsBeforeDilation = false;
                    }
                }

                //if (plan.TonoMetryDetails !== undefined) {
                //    $scope.cacheStorageItem.FinalTonoMetry = plan.TonoMetryDetails || [];
                //}
                $scope.cacheStorageItem.AvgTonometryODValue = "";
                $scope.cacheStorageItem.AvgTonometryOSValue = "";
                $scope.cacheStorageItem.MaxTonometryODValue = "";
                $scope.cacheStorageItem.MaxTonometryOSValue = "";
                $scope.cacheStorageItem.IOPInvName = "";
                $scope.cacheStorageItem.IOPInvId = "";
                $scope.cacheStorageItem.TargetIOPPercentage = plan.TargetIOPPercentage || "";
                $scope.cacheStorageItem.TargetIOPODValue = plan.TargetIOPODValue || "";
                $scope.cacheStorageItem.TargetIOPOSValue = plan.TargetIOPOSValue || "";

                if (plan.Tonometry !== undefined) {
                    $scope.IopODCC = false;
                    $scope.IopOsCC = false;
                    angular.forEach(plan.Tonometry, function (item) {
                        if (item.BeforeDilationODCC != "" || item.AfterDilationODCC != "") {
                            $scope.IopODCC = true;
                        }
                        if (item.BeforeDilationOSCC != "" || item.AfterDilationOSCC != "") {
                            $scope.IopOsCC = true;
                        }
                    });
                    let TotalOSValue = 0;
                    let TotalODValue = 0;
                    let TonometryODValuesArray = [];
                    let TonometryOSValuesArray = [];
                    var ODAvgValue = 0;
                    var OSAvgValue = 0;
                    var Count = 0;

                    $scope.cacheStorageItem.FinalTonoMetryDetails = plan.Tonometry || [];
                    plan.IOPAvgODValue = 0;
                    plan.IOPAvgOSValue = 0;
                    if ($scope.cacheStorageItem.FinalTonoMetryDetails.length > 0) {

                        if ($scope.cacheStorageItem.TonoMetryDetails.length >= 3) {
                            angular.forEach($scope.cacheStorageItem.FinalTonoMetryDetails, function (titem, ind) {
                                if (ind < 3) {
                                    let OSValue = titem.BeforeDilationLeftEye || titem.AfterDilationLeftEye;
                                    OSValue = parseFloat(OSValue);
                                    TotalOSValue += OSValue;
                                    let ODValue = titem.BeforeDilationRightEye || titem.AfterDilationRightEye;
                                    ODValue = parseFloat(ODValue);
                                    TotalODValue += ODValue;
                                }
                            });
                        }

                        angular.forEach($scope.cacheStorageItem.FinalTonoMetryDetails, function (titem, ind) {
                            titem.ActiveInd = "Y";
                            let OSValue = titem.BeforeDilationLeftEye || titem.AfterDilationLeftEye;
                            OSValue = parseFloat(OSValue);
                            TonometryOSValuesArray.push(OSValue);
                            let ODValue = titem.BeforeDilationRightEye || titem.AfterDilationRightEye;
                            ODValue = parseFloat(ODValue);
                            TonometryODValuesArray.push(ODValue);
                            $scope.cacheStorageItem.IOPInvName = titem.InvestigationDesc;
                            $scope.cacheStorageItem.IOPInvId = titem.InvestigationId;

                            if (titem.BeforeDilationRightEye != '' || titem.BeforeDilationLeftEye != '' || titem.BeforeDilationTime != '') {
                                ODAvgValue += parseInt(titem.BeforeDilationRightEye) || 0;
                                OSAvgValue += parseInt(titem.BeforeDilationLeftEye) || 0;

                            } else {
                                ODAvgValue += parseInt(titem.AfterDilationRightEye) || 0;
                                OSAvgValue += parseInt(titem.AfterDilationLeftEye) || 0;
                            }
                            Count++;

                        });
                        $scope.cacheStorageItem.AvgTonometryODValue = Number(TotalODValue / 3).toFixed(2);
                        $scope.cacheStorageItem.AvgTonometryOSValue = Number(TotalOSValue / 3).toFixed(2);
                        if (TonometryODValuesArray.length > 0) {
                            $scope.cacheStorageItem.MaxTonometryODValue = Math.max(...TonometryODValuesArray);
                        } else {
                            $scope.cacheStorageItem.MaxTonometryODValue = 0;
                        }
                        if (TonometryOSValuesArray.length > 0) {
                            $scope.cacheStorageItem.MaxTonometryOSValue = Math.max(...TonometryOSValuesArray);
                        } else {
                            $scope.cacheStorageItem.MaxTonometryOSValue = 0;
                        }

                        plan.IOPAvgODValue = parseFloat(ODAvgValue / Count).toFixed(2) || 0;
                        plan.IOPAvgOSValue = parseFloat(OSAvgValue / Count).toFixed(2) || 0;
                    }
                }
                $scope.cacheStorageItem.IOPodCCValue = plan.IOPodCCValue || null;
                $scope.cacheStorageItem.IOPosCCValue = plan.IOPosCCValue || null;

                $scope.tempPachymetry = [];
                if (plan.Pachymetry.length !== 0 || plan.PachymetryRemarks != '') {
                    var object = {
                        "PatientFindingPachymetryId": 0,
                        "InvestigationId": 176,
                        "InvestigationDesc": "Pachymetry",
                        "CategoryId": 1,
                        "CategoryDesc": "Vision",
                        "ActiveInd": "Y",
                        "Pachymetry": plan.Pachymetry || [],

                        "ActiveInd": "Y",
                        "Remarks": plan.PachymetryRemarks || ""
                    };
                    $scope.tempPachymetry.push(object);
                }
                var count1 = 0;
                var pachyODAvgValue = 0;
                var pachyOSAvgValue = 0;
                angular.forEach($scope.tempPachymetry, function (supitem) {
                    angular.forEach(supitem.Pachymetry, function (pitem) {
                        pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                        pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                        count1++;
                    });
                });
                plan.PachymetryAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
                plan.PachymetryAvgOSValue = parseFloat(pachyOSAvgValue / count1).toFixed(2) || 0;
                $scope.cacheStorageItem.FinalPachymetryDetails = $scope.tempPachymetry || [];
                if (plan.AnteriorSegmentDetails !== undefined) {
                    $scope.cacheStorageItem.FinalAnteriorDetails = plan.AnteriorSegmentDetails || [];
                }
                $scope.IsAnyAnteriorRemarksIsActive = false;
                if (plan.AnteriorSegmentDetails === undefined) { return; }
                angular.forEach(plan.AnteriorSegmentDetails, function (item) {
                    if (item.ActiveInd == "Y") {
                        angular.forEach(item.RemarksArray, function (inv) {
                            if (inv.ActiveInd == "Y") {
                                $scope.IsAnyAnteriorRemarksIsActive = true;
                            }
                        });
                    }
                    if ((item.InvestigationId == 6 && item.ActiveInd == "Y") && (item.LMRDcNS != '' || item.RMRDcNS != '' || item.RMRD2 != '' || item.LMRD2 != '' || item.RLF != '' || item.LLF != '' || item.RPFH != '' || item.LPFH != '' || item.RMRD1 != '' || item.LMRD1 != '')) {
                        $scope.IsAnyAnteriorRemarksIsActive = true;
                    }
                });
                if (plan.PosteriorSegmentDetails !== undefined) {
                    $scope.cacheStorageItem.FinalPosteriorDetails = plan.PosteriorSegmentDetails || [];
                }
                $scope.IsCDRshow = false;
                $scope.IsAnyPosteriorRemarksIsActive = false;
                if (plan.PosteriorSegmentDetails === undefined) { return; }
                angular.forEach(plan.PosteriorSegmentDetails, function (item) {
                    if (item.ActiveInd == "Y" && item.InvestigationId !== 32) {
                        angular.forEach(item.RemarksArray, function (inv) {
                            if (inv.ActiveInd == "Y") {
                                $scope.IsAnyPosteriorRemarksIsActive = true;
                            }
                        });
                    } else if (item.ActiveInd == "Y" && item.InvestigationId == 32) {
                        item.RHorizontal = item.RHorizontal || '';
                        item.RVertical = item.RVertical || '';
                        item.RDPS = item.RDPS || '';
                        item.LHorizontal = item.LHorizontal || '';
                        item.LVertical = item.LVertical || '';
                        item.LDPS = item.LDPS || '';
                        if (item.RHorizontal !== '' || item.RVertical !== '' || item.RDPS !== '' || item.LHorizontal !== '' || item.LVertical !== '' || item.LDPS !== '') {
                            $scope.IsAnyPosteriorRemarksIsActive = true;
                            $scope.IsCDRshow = true;
                        }
                    } else {

                    }
                });

                //angular.forEach(plan.PosteriorSegmentDetails, function (item) {
                //    if (item.ActiveInd == "Y") {
                //        angular.forEach(item.RemarksArray, function (inv) {
                //            if (inv.ActiveInd == "Y") {
                //                $scope.IsAnyPosteriorRemarksIsActive = true;
                //            }
                //        });
                //    }
                //});
                //if (plan.TonoMetryDetails !== undefined) {
                //    $scope.cacheStorageItem.FinalTonoMetryDetails = plan.TonoMetryDetails || [];
                //}
                if (plan.GlassDetails !== undefined) {
                    $scope.cacheStorageItem.FinalGlassDetails = plan.GlassDetails || [];
                }

                if (plan.ColorVisionDetails !== undefined) {
                    angular.forEach(plan.ColorVisionDetails, function (item) {
                        if (item.ActiveInd === 'Y') {
                            if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '' || item.Notes != '') {
                                item.IsInvDataAdded = true;
                            }
                        }
                    });
                    $scope.cacheStorageItem.FinalColorVisionDetails = plan.ColorVisionDetails || [];
                }
                if (plan.LacrimalPatiencyDetails !== undefined) {
                    $scope.cacheStorageItem.FinalLacrimalPatiencyDetails = plan.LacrimalPatiencyDetails || [];
                }
                plan.NearInvestigationdetails = plan.NearInvestigationdetails || [];
                angular.forEach(plan.NearInvestigationdetails, function (item) {
                    if (item.ActiveInd === 'Y') {
                        if (item.InvestigationId === 815) {
                            if (item.BlurOUValue != "" || item.BreakOUValue != "" || item.RecoveryOUValue != "" || item.Remarks != "") {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId === 2122) {
                            if (item.BlurODValue != "" || item.BreakODValue != "" || item.RecoveryODValue != "" || item.Remarks != "" || item.BlurOSValue != "" || item.BreakOSValue != "" || item.RecoveryOSValue != "") {
                                item.IsInvDataAdded = true;
                            }
                        }

                        if (item.InvestigationId === 2123) {
                            //if (item.ODNegitiveValue != "" || item.ODPositiveValue != "" || item.OSNegitiveValue != "" || item.OSPositiveValue != "" || item.Remarks != "") {
                            //    item.IsInvDataAdded = true;
                            //}
                            if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId === 2124) {
                            //if (item.ODNegitiveValue != "" || item.ODPositiveValue != "" || item.OSNegitiveValue != "" || item.OSPositiveValue != "" || item.Remarks != "") {
                            //    item.IsInvDataAdded = true;
                            //}
                            if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                                item.IsInvDataAdded = true;
                            }
                        }

                    }
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
                        if (item.InvestigationId == 64) {
                            if (item.DistanceValue != '' || item.NearValue != '' || item.Remarks != '') {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId == 699) {
                            if (item.DistanceValue !== '' || item.NearValue !== '' || item.DistanceTypeOfSquintId !== 0 || item.DistanceTypeOfSquintValue !== '' || item.DistanceFixationPreference !== ''
                                || item.NearTypeOfSquintId !== 0 || item.NearTypeOfSquintValue !== '' || item.NearFixationPreference !== '' || item.Remarks !== '') {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId == 697) {
                            if (item.RightEye.Name != '' || item.RightEye.DegreeValue != '' || item.LeftEye.Name != ''
                                || item.LeftEye.DegreeValue != '' || item.Remarks != '') {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId == 721) {
                            if (item.Nystagmus != '' || item.Remarks != '') {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId == 719) {
                            //if (item.PrismTypeName != ''&&item.Distance.DistanceRPrismValue != '' && item.Distance.DistanceRTypeOfSquintValue != '' && item.Distance.DistanceRFixationPreference != '' && item.Distance.DistanceLPrismValue != '' && item.Distance.DistanceLTypeOfSquintValue != '' && item.Distance.DistanceLFixationPreference != '') {
                            //    item.IsInvDataAdded = true;
                            //}
                            if (item.PrismCoverDetailsArray.length > 0) {
                                $scope.IsShowPrismDetails = false;
                                angular.forEach(item.PrismCoverDetailsArray, function (subitem) {
                                    if (subitem.Distance.DistanceRPrismValue != "" || subitem.Distance.DistanceLPrismValue != "" || subitem.Distance.DistanceRTypeOfSquintId != 0 || subitem.Distance.DistanceRTypeOfSquintValue != "" ||
                                        subitem.Distance.DistanceLTypeOfSquintId != 0 || subitem.Distance.DistanceLTypeOfSquintValue != "" || subitem.Distance.DistanceRFixationPreference != "" || subitem.Distance.DistanceLFixationPreference != "" || subitem.Near.NearRPrismValue != "" || subitem.Near.NearLPrismValue != "" || subitem.Near.NearRTypeOfSquintId != 0 || subitem.Near.NearRTypeOfSquintValue != "" ||
                                        subitem.Near.NearLTypeOfSquintId != 0 || subitem.Near.NearLTypeOfSquintValue != "" || subitem.Near.NearRFixationPreference != "" || subitem.Near.NearLFixationPreference != "" || subitem.AllRemarks != "") {
                                        subitem.IsInvDataAdded = true;
                                        item.IsInvDataAdded = true;
                                        $scope.IsShowPrismDetails = true;
                                    }
                                });
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId == 701) {
                            if (item.Fly != '' || item.Animals != '' || item.Circles != '' || item.RandotCircles != '' || item.DistVectograph != '' || item.DistStereo != '' || item.Frisby != '' || item.Lang != '' || item.Remarks != '') {
                                item.IsInvDataAdded = true;
                            }
                        }
                        if (item.InvestigationId === 2095) {
                            if (item.InvestigationOrgans.length > 0) {
                                item.IsInvDataAdded = true;
                            }
                        }

                    });
                    $scope.cacheStorageItem.FinalSquintDetails = plan.SquintDetails || [];
                }
                $scope.cacheStorageItem.FinalExternalExaminationDetails = plan.ExternalExaminationDetails || [];
                $scope.cacheStorageItem.FinalDryEyeEvaluationData = [];
                plan.DryEyeEvaluationData = plan.DryEyeEvaluationData || [];
                if (plan.DryEyeEvaluationData !== undefined) {

                    angular.forEach(plan.DryEyeEvaluationData, function (item) {
                        if (item.ActiveInd === 'Y') {
                            if (item.InvestigationId === 2079) {
                                if (item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '' || item.ODValue21 != '' || item.ODvalue31 != '' || item.OSValue21 != '' || item.OSvalue31 != '') {
                                    item.IsInvDataAdded = true;
                                }
                            } else {
                                if (item.ODValue1 != '' || item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue1 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '') {
                                    item.IsInvDataAdded = true;
                                }
                            }
                        }
                        /* item.IsInvDataAdded = true;*/
                        item.RemarksEdit = false;
                    });
                    $scope.cacheStorageItem.FinalDryEyeEvaluationData = plan.DryEyeEvaluationData;
                }
                if (plan.GonioscopyDetails !== undefined) {
                    $scope.cacheStorageItem.FinalGonioscopyDetails = plan.GonioscopyDetails || [];
                }
                $scope.cacheStorageItem.FinalNineGazeExtraOcularDetails = [];
                plan.NineGazeExtraOcularDetails = plan.NineGazeExtraOcularDetails || [];
                if (plan.NineGazeExtraOcularDetails !== undefined) {

                    angular.forEach(plan.NineGazeExtraOcularDetails, function (item) {
                        if (item.InvestigationId == 18) {
                            if (item.RsrValue != '' || item.RIoValue != '' || item.RLrValue != '' || item.RPgValue != '' || item.RMrValue != '' || item.RIrValue != '' || item.RRemarks != '' || item.RSoValue != ''
                                || item.LSrValue != '' || item.LIoValue != '' || item.LLrValue != '' || item.LPgValue != '' || item.LMrValue != '' || item.LIrValue != '' || item.LSoValue != '' || item.LRemarks != '') {
                                item.IsInvDataAdded = true;
                                item.LRemarksEdit = false;
                                item.RRemarksEdit = false;
                                item.DistanceEdit = false;
                                item.NearEdit = false;
                            }
                        }
                        if (item.InvestigationId == 695) {
                            if (item.RsrValue != '' || item.RIoValue != '' || item.RLrValue != '' || item.RPgValue != '' || item.RMrValue != '' || item.RIrValue != '' || item.RSoValue != '' || item.RRemarks != ''
                                || item.LSrValue != '' || item.LIoValue != '' || item.LLrValue != '' || item.LPgValue != '' || item.LMrValue != '' || item.LIrValue != '' || item.LSoValue != '' || item.LRemarks != '') {
                                item.IsInvDataAdded = true;
                                item.LRemarksEdit = false;
                                item.RRemarksEdit = false;
                                item.DistanceEdit = false;
                                item.NearEdit = false;
                            }
                        }

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

                plan.NewAmslerGridArray = plan.NewAmslerGridArray || [];
                if (plan.NewAmslerGridArray.length > 0) {
                    angular.forEach(plan.NewAmslerGridArray, function (item) {
                        item.IsInvDataAdded = false;
                        var List = [];
                        var List1 = [];
                        if (item.RDrawList != undefined) {
                            if (item.RDrawList.length > 0) {
                                List = $filter("filter")(item.RDrawList, { "IsChecked": true }, true) || [];
                            }
                        }
                        if (item.LDrawList != undefined) {
                            if (item.LDrawList.length > 0) {
                                List1 = $filter("filter")(item.LDrawList, { "IsChecked": true }, true) || [];
                            }
                        }
                        item.Files = item.Files || [];
                        if (item.RightEyeRemarks != "" || item.LeftEyeRemarks != "" || item.RS3Url != "" || item.LS3Url != "" || List.length > 0 || List1.length > 0 || item.RightEyeId != "" || item.LeftEyeId != "" || item.Files.length > 0) {
                            item.IsInvDataAdded = true;

                        }
                    });

                    $scope.cacheStorageItem.FinalNewAmslerGridArray = plan.NewAmslerGridArray || [];
                }
                plan.ConfrontationalFieldTestDetails = plan.ConfrontationalFieldTestDetails || [];
                if (plan.ConfrontationalFieldTestDetails.length > 0) {

                    angular.forEach(plan.ConfrontationalFieldTestDetails, function (item) {
                        var List = [];
                        var List1 = [];
                        if (item.FRDrawList.length > 0) {
                            List = $filter("filter")(item.FRDrawList, { "IsChecked": true }, true) || [];
                        }
                        if (item.FLDrawList.length > 0) {
                            List1 = $filter("filter")(item.FLDrawList, { "IsChecked": true }, true) || [];
                        }
                        if (List.length > 0 || List1.length > 0 || item.FRightEyeRemarks !== '' || item.FLeftEyeRemarks !== '' || item.FRightEyeNotes !== '' || item.FLeftEyeNotes !== '') {
                            item.IsfourFieldDataAdded = true;
                        } else {
                            item.IsfourFieldDataAdded = false;
                        }
                        var List2 = [];
                        var List3 = [];
                        if (item.RDrawList.length > 0) {
                            var List2 = $filter("filter")(item.RDrawList, { "IsChecked": true }, true) || [];
                        }
                        if (item.LDrawList.length > 0) {
                            List3 = $filter("filter")(item.LDrawList, { "IsChecked": true }, true) || [];

                        }
                        if (List2.length > 0 || List3.length > 0 || item.RightEyeRemarks !== '' || item.LeftEyeRemarks !== '' || item.ERightEyeNotes !== '' || item.ELeftEyeNotes !== '') {
                            item.IseightyFieldDataAdded = true;
                        } else {
                            item.IseightyFieldDataAdded = false;
                        }

                    });

                    $scope.cacheStorageItem.FinalConfrontationalFieldArray = plan.ConfrontationalFieldTestDetails || [];
                } else {
                    $scope.cacheStorageItem.FinalConfrontationalFieldArray = [];
                }

                plan.HertelsExaminationDetails = plan.HertelsExaminationDetails || [];
                angular.forEach(plan.HertelsExaminationDetails, function (item) {
                    item.RightEyeEdit = false;
                    item.LeftEyeEdit = false;
                });
                $scope.cacheStorageItem.FinalHertelsExaminationArray = plan.HertelsExaminationDetails || [];

                //$scope.cacheStorageItem.FinalContactLensArray = [];

                //angular.forEach(plan.ContactLensArray, function (clmitem) {
                //    var object = clmitem.ContactLensData;
                //    object.PatientContactLensDetailId = clmitem.PatientContactLensDetailId;
                //    $scope.cacheStorageItem.FinalContactLensArray.push(object);
                //});
                $scope.cacheStorageItem.AnteriorRemarks = plan.AnteriorRemarks || "";
                $scope.cacheStorageItem.PosteriorRemarks = plan.PosteriorRemarks || "";
                $scope.cacheStorageItem.PosteriorLensId = plan.PosteriorLensId || null;
                $scope.cacheStorageItem.LacrimalPatencyRemarks = plan.LacrimalPatencyRemarks || "";
                $scope.cacheStorageItem.PosteriorLensName = plan.PosteriorLensName || '';

                $scope.cacheStorageItem.ConsultationLogArray = [];
                plan.ConsultationLogArray = plan.ConsultationLogArray || []
                if (plan.ConsultationLogArray.length > 0) {
                    $scope.cacheStorageItem.ConsultationLogArray = angular.copy(plan.ConsultationLogArray);
                }
                //CustomAllergyRemarks
                plan.CustomAllergyRemarks = plan.CustomAllergyRemarks || [];
                $scope.cacheStorageItem.ROSAllergyRemarkDetails = [];
                if (plan.CustomAllergyRemarks.length > 0) {
                    $scope.cacheStorageItem.ROSAllergyRemarkDetails = angular.copy(plan.CustomAllergyRemarks);

                    $scope.cacheStorageItem.ROSAllergyHeaders = angular.copy(GetRemarksHeaders());
                    if ($scope.cacheStorageItem.ROSAllergyRemarkDetails.length > 0) {
                        angular.forEach($scope.cacheStorageItem.ROSAllergyHeaders, function (hitem) {
                            var filetrarray = $filter("filter")($scope.cacheStorageItem.ROSAllergyRemarkDetails, function (iterator, ind) { return iterator.CustomAllergyRemarkCategory == hitem.Name && (iterator.CustomAllergyValue == 'Y' || iterator.CustomAllergyValue == 'N'); }) || [];
                            if (filetrarray.length > 0) {
                                hitem.Active = "Y";
                            }
                        });
                    }
                }

                if (plan.KeratometryValues !== undefined) {
                    $scope.cacheStorageItem.FinalKeratometryDetails = plan.KeratometryValues || [];
                    if ($scope.cacheStorageItem.FinalKeratometryDetails.length > 0) {
                        angular.forEach($scope.cacheStorageItem.FinalKeratometryDetails, function (Kitem) {
                            Kitem.KeratometerEyeValues = angular.copy(Kitem.Keratometry);
                        });
                    }
                }

                if (plan.GlareArray != undefined) {
                    if (plan.GlareArray.length > 0) {
                        $scope.cacheStorageItem.FinalGlareDetails = plan.GlareArray || [];
                    }
                }

                if (plan.AutoRefractionArray != undefined) {
                    if (plan.AutoRefractionArray.length > 0) {
                        $scope.cacheStorageItem.FinalAutoRefractionDetails = plan.AutoRefractionArray || [];
                    } else {
                        $scope.cacheStorageItem.FinalAutoRefractionDetails = [];
                    }
                }
                if (plan.AutoRefractionArray.length > 0) {
                    angular.forEach(plan.AutoRefractionArray, function (mitem) {

                        //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                        //    mitem.IsCylindrical = true;
                        //}
                        //else {
                        //    mitem.IsCylindrical = false;
                        //}
                        //if (mitem.RAxis != "" || mitem.LAxis != "") {
                        //    mitem.IsAxis = true;
                        //}
                        //else {
                        //    mitem.IsAxis = false;
                        //}
                        if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                            if (mitem.RSpherical == '') {
                                mitem.RSpherical = "0.00";
                            }
                        }
                        if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                            if (mitem.LSpherical == '') {
                                mitem.LSpherical = "0.00";
                            }

                        }
                    });
                }
                if (plan.RetinoscopyRefractionArray != undefined) {
                    if (plan.RetinoscopyRefractionArray.length > 0) {
                        $scope.cacheStorageItem.FinalRetinoscopyRefractionDetails = plan.RetinoscopyRefractionArray || [];
                    } else {
                        $scope.cacheStorageItem.FinalRetinoscopyRefractionDetails = [];
                    }
                }
                if (plan.RetinoscopyRefractionArray.length > 0) {
                    angular.forEach(plan.RetinoscopyRefractionArray, function (mitem) {

                        //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                        //    mitem.IsCylindrical = true;
                        //}
                        //else {
                        //    mitem.IsCylindrical = false;
                        //}
                        //if (mitem.RAxis != "" || mitem.LAxis != "") {
                        //    mitem.IsAxis = true;
                        //}
                        //else {
                        //    mitem.IsAxis = false;
                        //}
                        if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                            if (mitem.RSpherical == '') {
                                mitem.RSpherical = "0.00";
                            }
                        }
                        if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                            if (mitem.LSpherical == '') {
                                mitem.LSpherical = "0.00";
                            }

                        }
                    });
                }

                if (plan.PGPrefractionArray != undefined) {
                    if (plan.PGPrefractionArray.length > 0) {
                        $scope.cacheStorageItem.FinalPGPRefractionDetails = plan.PGPrefractionArray || [];
                    } else {
                        $scope.cacheStorageItem.FinalPGPRefractionDetails = [];
                    }
                }
                if (plan.PGPrefractionArray.length > 0) {
                    angular.forEach(plan.PGPrefractionArray, function (mitem) {

                        //if (mitem.RSpherical != "" || mitem.LSpherical != "") {
                        //    mitem.IsSpherical = true;
                        //}
                        //else {
                        //    mitem.IsSpherical = false;
                        //}

                        //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                        //    mitem.IsCylindrical = true;
                        //}
                        //else {
                        //    mitem.IsCylindrical = false;
                        //}
                        //if (mitem.RAxis != "" || mitem.LAxis != "") {
                        //    mitem.IsAxis = true;
                        //}
                        //else {
                        //    mitem.IsAxis = false;
                        //}
                        if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                            if (mitem.RSpherical == '') {
                                mitem.RSpherical = "0.00";
                                mitem.IsSpherical = true;
                            }
                        }
                        if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                            if (mitem.LSpherical == '') {
                                mitem.LSpherical = "0.00";
                                mitem.IsSpherical = true;
                            }

                        }
                        //if (mitem.RAdition != "" || mitem.LAdition != "") {
                        //    mitem.IsAdition = true;
                        //}
                        //else {
                        //    mitem.IsAdition = false;
                        //}
                        //if (mitem.RBaseHz != "" || mitem.LBaseHz != "" || mitem.RPrismHz != "" || mitem.LPrismHz != "" || mitem.RBaseVt != "" || mitem.LBaseVt != "" || mitem.RPrismVt != "" || mitem.LPrismVt != "") {
                        //    mitem.IsPrism = true;
                        //}
                        //else {
                        //    mitem.IsPrism = false;
                        //}
                    });
                }

                if (plan.ManifestRefractionArray != undefined) {
                    if (plan.ManifestRefractionArray.length > 0) {
                        $scope.cacheStorageItem.FinalManifestRefractionDetails = plan.ManifestRefractionArray || [];
                        angular.forEach(plan.ManifestRefractionArray, function (kitem) {
                            if (kitem.RSpherical !== '' || kitem.RCylindrical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCNVA !== '' || kitem.RVAI !== '' || kitem.RDuo !== '' || kitem.RCs !== '' ||
                                kitem.RPrismVt !== '' || kitem.RBaseVt !== '' || kitem.RPrismHz !== '' || kitem.RBaseHz !== '' || kitem.RType !== '' || kitem.LSpherical !== '' || kitem.LCylindrical !== '' || kitem.LCylindrical !== '' || kitem.LAdition !== '' || kitem.LBCVA !== '' ||
                                kitem.LBCNVA !== '' || kitem.LVAI !== '' || kitem.LDuo !== '' || kitem.LCs !== '' || kitem.LPrismVt !== '' || kitem.LPrismVt !== '' ||
                                kitem.LPrismHz !== '' || kitem.LBaseHz !== '' || kitem.LType !== '' || kitem.BBCVA !== '' || kitem.BBCNVA !== '' || kitem.BVAI !== '' || kitem.BDuo !== '' || kitem.BCs !== '' || kitem.Remarks !== '') {
                                kitem.IsDataAdded = true;

                            } else {
                                kitem.IsDataAdded = false;
                            }
                            if (plan.ManifestRefractionArray.length > 0) {
                                angular.forEach(plan.ManifestRefractionArray, function (mitem) {

                                    //if (mitem.RSpherical != "" || mitem.LSpherical != "") {
                                    //    mitem.IsSpherical = true;
                                    //}
                                    //else {
                                    //    mitem.IsSpherical = false;
                                    //}

                                    //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                                    //    mitem.IsCylindrical = true;
                                    //}
                                    //else {
                                    //    mitem.IsCylindrical = false;
                                    //}
                                    //if (mitem.RAxis != "" || mitem.LAxis != "") {
                                    //    mitem.IsAxis = true;
                                    //}
                                    //else {
                                    //    mitem.IsAxis = false;
                                    //}
                                    if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                                        if (mitem.RSpherical == '') {
                                            mitem.RSpherical = "0.00";
                                            mitem.IsSpherical = true;
                                        }
                                    }
                                    if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                                        if (mitem.LSpherical == '') {
                                            mitem.LSpherical = "0.00";
                                            mitem.IsSpherical = true;
                                        }

                                    }
                                    //if (mitem.RAdition != "" || mitem.LAdition != "") {
                                    //    mitem.IsAdition = true;
                                    //}
                                    //else {
                                    //    mitem.IsAdition = false;
                                    //}
                                    //if (mitem.RBaseHz != "" || mitem.LBaseHz != "" || mitem.RPrismHz != "" || mitem.LPrismHz != "" || mitem.RBaseVt != "" || mitem.LBaseVt != "" || mitem.RPrismVt != "" || mitem.LPrismVt != "") {
                                    //    mitem.IsPrism = true;
                                    //}
                                    //else {
                                    //    mitem.IsPrism = false;
                                    //}
                                    //if (mitem.RType != "" || mitem.LType != "") {
                                    //    mitem.IsType = true;
                                    //}
                                    //else {
                                    //    mitem.IsType = false;
                                    //}
                                    //if (mitem.BBCNVA != "" || mitem.LBCNVA != "" || mitem.RBCNVA != "") {
                                    //    mitem.IsVAN = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAN = false;
                                    //}
                                    //if (mitem.BBCVA != "" || mitem.LBCVA != "" || mitem.RBCVA != "") {
                                    //    mitem.IsVAD = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAD = false;
                                    //}
                                    //if (mitem.BCs != "" || mitem.LCs != "" || mitem.RCs != "") {
                                    //    mitem.IsCs = true;
                                    //}
                                    //else {
                                    //    mitem.IsCs = false;
                                    //}
                                    //if (mitem.BDuo != "" || mitem.LDuo != "" || mitem.RDuo != "") {
                                    //    mitem.IsDuo = true;
                                    //}
                                    //else {
                                    //    mitem.IsDuo = false;
                                    //}
                                    //if (mitem.BVAI != "" || mitem.LVAI != "" || mitem.RVAI != "") {
                                    //    mitem.IsVAI = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAI = false;
                                    //}
                                });
                            }
                        });
                    } else {
                        $scope.cacheStorageItem.FinalManifestRefractionDetails = [];
                    }
                }
                if (plan.OverRefractionArray != undefined) {
                    if (plan.OverRefractionArray.length > 0) {
                        $scope.cacheStorageItem.FinalOverRefractionDetails = plan.OverRefractionArray || [];
                        angular.forEach(plan.OverRefractionArray, function (kitem) {
                            if (kitem.RCylindrical !== '' || kitem.RSpherical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCNVA !== '' || kitem.RVAI !== '' ||
                                kitem.LCylindrical !== '' || kitem.LSpherical !== '' || kitem.LAxis !== '' || kitem.LAdition !== '' || kitem.LBCVA !== '' || kitem.LBCNVA !== '' || kitem.LVAI !== '' ||
                                kitem.BBCVA !== '' || kitem.BBCNVA !== '' || kitem.BVAI !== '') {
                                kitem.IsDataAdded = true;

                            } else {
                                kitem.IsDataAdded = false;
                            }
                            if (plan.OverRefractionArray.length > 0) {
                                angular.forEach(plan.OverRefractionArray, function (mitem) {

                                    //if (mitem.RSpherical != "" || mitem.LSpherical != "") {
                                    //    mitem.IsSpherical = true;
                                    //}
                                    //else {
                                    //    mitem.IsSpherical = false;
                                    //}
                                    //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                                    //    mitem.IsCylindrical = true;
                                    //}
                                    //else {
                                    //    mitem.IsCylindrical = false;
                                    //}
                                    //if (mitem.RAxis != "" || mitem.LAxis != "") {
                                    //    mitem.IsAxis = true;
                                    //}
                                    //else {
                                    //    mitem.IsAxis = false;
                                    //}
                                    if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                                        if (mitem.RSpherical == '') {
                                            mitem.RSpherical = "0.00";
                                            mitem.IsSpherical = true;
                                        }
                                    }
                                    if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                                        if (mitem.LSpherical == '') {
                                            mitem.LSpherical = "0.00";
                                            mitem.IsSpherical = true;
                                        }

                                    }
                                    //if (mitem.RAdition != "" || mitem.LAdition != "") {
                                    //    mitem.IsAdition = true;
                                    //}
                                    //else {
                                    //    mitem.IsAdition = false;
                                    //}

                                    //if (mitem.BBCNVA != "" || mitem.LBCNVA != "" || mitem.RBCNVA != "") {
                                    //    mitem.IsVAN = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAN = false;
                                    //}
                                    //if (mitem.BBCVA != "" || mitem.LBCVA != "" || mitem.RBCVA != "") {
                                    //    mitem.IsVAD = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAD = false;
                                    //}
                                    //if (mitem.BVAI != "" || mitem.LVAI != "" || mitem.RVAI != "") {
                                    //    mitem.IsVAI = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAI = false;
                                    //}
                                });
                            }

                        });
                    } else {
                        $scope.cacheStorageItem.FinalOverRefractionDetails = [];
                    }
                }
                if (plan.FinalGlassRxArray != undefined) {
                    if (plan.FinalGlassRxArray.length > 0) {
                        $scope.cacheStorageItem.FinalGlassRxRefractionDetails = plan.FinalGlassRxArray || [];
                    } else {
                        $scope.cacheStorageItem.FinalGlassRxRefractionDetails = [];
                    }
                    angular.forEach(plan.FinalGlassRxArray, function (kitem) {
                        if (kitem.RSpherical !== '' || kitem.RCylindrical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCVA !== '' || kitem.RBCVA !== '' || kitem.RVAI !== '' || kitem.RPrismVt !== '' ||
                            kitem.RBaseVt !== '' || kitem.RPrismHz !== '' || kitem.RBaseHz !== '' || kitem.RType !== '' || kitem.LSpherical !== '' || kitem.LCylindrical !== '' || kitem.LAxis !== '' || kitem.LAdition !== '' ||
                            kitem.LBCVA !== '' || kitem.LBCNVA !== '' || kitem.LVAI !== '' || kitem.LPrismVt !== '' || kitem.LBaseVt !== '' || kitem.LPrismHz !== '' || kitem.LBaseHz !== '' || kitem.LType !== '') {
                            kitem.IsDataAdded = true;

                        } else {
                            kitem.IsDataAdded = false;
                        }
                        if (plan.FinalGlassRxArray.length > 0) {
                            angular.forEach(plan.FinalGlassRxArray, function (mitem) {

                                //if (mitem.RSpherical != "" || mitem.LSpherical != "") {
                                //    mitem.IsSpherical = true;
                                //}
                                //else {
                                //    mitem.IsSpherical = false;
                                //}
                                //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                                //    mitem.IsCylindrical = true;
                                //}
                                //else {
                                //    mitem.IsCylindrical = false;
                                //}
                                //if (mitem.RAxis != "" || mitem.LAxis != "") {
                                //    mitem.IsAxis = true;
                                //}
                                //else {
                                //    mitem.IsAxis = false;
                                //}
                                if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                                    if (mitem.RSpherical == '') {
                                        mitem.RSpherical = "0.00";
                                        mitem.IsSpherical = true;
                                    }
                                }
                                if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                                    if (mitem.LSpherical == '') {
                                        mitem.LSpherical = "0.00";
                                        mitem.IsSpherical = true;
                                    }

                                }
                                //if (mitem.RAdition != "" || mitem.LAdition != "") {
                                //    mitem.IsAdition = true;
                                //}
                                //else {
                                //    mitem.IsAdition = false;
                                //}
                                //if (mitem.RBaseHz != "" || mitem.LBaseHz != "" || mitem.RPrismHz != "" || mitem.LPrismHz != "" || mitem.RBaseVt != "" || mitem.LBaseVt != "" || mitem.RPrismVt != "" || mitem.LPrismVt != "") {
                                //    mitem.IsPrism = true;
                                //}
                                //else {
                                //    mitem.IsPrism = false;
                                //}
                                //if (mitem.RType != "" || mitem.LType != "") {
                                //    mitem.IsType = true;
                                //}
                                //else {
                                //    mitem.IsType = false;
                                //}
                                //if (mitem.LBCNVA != "" || mitem.RBCNVA != "") {
                                //    mitem.IsVAN = true;
                                //}
                                //else {
                                //    mitem.IsVAN = false;
                                //}
                                //if (mitem.LBCVA != "" || mitem.RBCVA != "") {
                                //    mitem.IsVAD = true;
                                //}
                                //else {
                                //    mitem.IsVAD = false;
                                //}
                                //if (mitem.LVAI != "" || mitem.RVAI != "") {
                                //    mitem.IsVAI = true;
                                //}
                                //else {
                                //    mitem.IsVAI = false;
                                //}
                            });
                        }
                    });
                }
                if (plan.CycloplegicRefractionArray != undefined) {
                    if (plan.CycloplegicRefractionArray.length > 0) {
                        $scope.cacheStorageItem.FinalCycloplegicRefractionDetails = plan.CycloplegicRefractionArray || [];
                        angular.forEach(plan.CycloplegicRefractionArray, function (kitem) {
                            if (kitem.RCylindrical !== '' || kitem.RSpherical !== '' || kitem.RAxis !== '' || kitem.RAdition !== '' || kitem.RBCNVA !== '' || kitem.RVAI !== '' ||
                                kitem.LCylindrical !== '' || kitem.LSpherical !== '' || kitem.LAxis !== '' || kitem.LAdition !== '' || kitem.LBCVA !== '' || kitem.LBCNVA !== '' || kitem.LVAI !== '' ||
                                kitem.BBCVA !== '' || kitem.BBCNVA !== '' || kitem.BVAI !== '') {
                                kitem.IsDataAdded = true;

                            } else {
                                kitem.IsDataAdded = false;
                            }
                            if (plan.CycloplegicRefractionArray.length > 0) {
                                angular.forEach(plan.CycloplegicRefractionArray, function (mitem) {

                                    //if (mitem.RSpherical != "" || mitem.LSpherical != "") {
                                    //    mitem.IsSpherical = true;
                                    //}
                                    //else {
                                    //    mitem.IsSpherical = false;
                                    //}
                                    //if (mitem.RCylindrical != "" || mitem.LCylindrical != "") {
                                    //    mitem.IsCylindrical = true;
                                    //}
                                    //else {
                                    //    mitem.IsCylindrical = false;
                                    //}
                                    //if (mitem.RAxis != "" || mitem.LAxis != "") {
                                    //    mitem.IsAxis = true;
                                    //}
                                    //else {
                                    //    mitem.IsAxis = false;
                                    //}
                                    if (mitem.RCylindrical != "" && mitem.RAxis != "") {
                                        if (mitem.RSpherical == '') {
                                            mitem.RSpherical = "0.00";
                                            mitem.IsSpherical = true;
                                        }
                                    }
                                    if (mitem.LCylindrical != "" && mitem.LAxis != "") {
                                        if (mitem.LSpherical == '') {
                                            mitem.LSpherical = "0.00";
                                            mitem.IsSpherical = true;
                                        }

                                    }
                                    //if (mitem.RAdition != "" || mitem.LAdition != "") {
                                    //    mitem.IsAdition = true;
                                    //}
                                    //else {
                                    //    mitem.IsAdition = false;
                                    //}

                                    //if (mitem.BBCNVA != "" || mitem.LBCNVA != "" || mitem.RBCNVA != "") {
                                    //    mitem.IsVAN = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAN = false;
                                    //}
                                    //if (mitem.BBCVA != "" || mitem.LBCVA != "" || mitem.RBCVA != "") {
                                    //    mitem.IsVAD = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAD = false;
                                    //}
                                    //if (mitem.BVAI != "" || mitem.LVAI != "" || mitem.RVAI != "") {
                                    //    mitem.IsVAI = true;
                                    //}
                                    //else {
                                    //    mitem.IsVAI = false;
                                    //}
                                });
                            }
                        });
                    } else {
                        $scope.cacheStorageItem.FinalCycloplegicRefractionDetails = [];
                    }
                }
                if (plan.DilationArray != undefined) {
                    if (plan.DilationArray.length > 0) {
                        $scope.cacheStorageItem.DilationArray = plan.DilationArray || [];
                    } else {
                        $scope.cacheStorageItem.DilationArray = [];
                    }
                }

                $scope.cacheStorageItem.SquintPossibleDiagnosis = angular.copy(plan.SquintPossibleDiagnosis) || "";
                $scope.cacheStorageItem.BVPossibleDiagnosis = angular.copy(plan.BVPossibleDiagnosis) || "";
                $scope.cacheStorageItem.BVPossibleDiagnosis = angular.copy(plan.SquintPossibleDiagnosisArray) || [];
                $scope.cacheStorageItem.BVPossibleDiagnosis = angular.copy(plan.BVPossibleDiagnosisArray) || [];
                $scope.cacheStorageItem.AnteriorIsNormal = angular.copy(plan.AnteriorIsNormal) || false;
                $scope.cacheStorageItem.PosteriorIsNormal = angular.copy(plan.PosteriorIsNormal) || false;
                $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology = angular.copy(plan.IsPosteriorExtendedOpthalmology) || false;
                $scope.cacheStorageItem.ExternalExaminactionIsNormal = angular.copy(plan.ExternalExaminactionIsNormal) || false;
                $scope.cacheStorageItem.IsExamedwithTorchused = angular.copy(plan.IsExamedwithTorchused) || false;
                if (plan.StatusFlag === 'C') {
                    $scope.cacheStorageItem.appointmentStatus = 'E';
                }
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                // loadEditConsultationData();
                if (plan.AnteriorSegmentImagesArray.length !== 0) {
                    var TemptImagesArray = angular.copy(plan.AnteriorSegmentImagesArray) || [];
                    if (TemptImagesArray.length > 0) {
                        plan.AnteriorSegmentImagesArray = [];
                        plan.PosteriorSegmentImagesArray = [];
                        angular.forEach(TemptImagesArray, function (Aitem, index) {
                            if (Aitem.CategoryId == 5) {
                                plan.AnteriorSegmentImagesArray.push(Aitem);
                            } else if (Aitem.CategoryId == 6) {
                                plan.PosteriorSegmentImagesArray.push(Aitem);
                            }
                        });
                    }
                }
                angular.forEach(plan.Vitals, function (suitem) {
                    suitem.ActiveIND = "Y";
                });
                if (plan.ImplantList != undefined) {
                    if (plan.ImplantList.length > 0) {
                        $scope.cacheStorageItem.ImplantList = plan.ImplantList || [];
                    } else {
                        $scope.cacheStorageItem.ImplantList = [];
                    }
                }
                if (plan.Vitals != undefined) {
                    if (plan.Vitals.length > 0) {
                        $scope.cacheStorageItem.VitalsArray = plan.Vitals || [];
                    } else {
                        $scope.cacheStorageItem.VitalsArray = [];
                    }
                }
                if (plan.PupilSizeRemarks !== '') {
                    $scope.cacheStorageItem.PupilSizeRemarks = plan.PupilSizeRemarks || '';
                }
                $scope.BillItemFileUploadList = plan.BillItemFileUploadList || [];
                $scope.BillItemList = plan.BillItemList || [];

                if ($scope.BillItemList.length > 0) {
                    $scope.BillItemList = $scope.BillItemList || [];

                    if ($scope.BillItemList.length > 0) {
                        $scope.cacheStorageItem.TotalAmount = null;
                        $scope.cacheStorageItem.TotalChargeAmount = null;
                        angular.forEach($scope.BillItemList, function (item) {
                            var Quantity = 0;
                            var Price = 0; Quantity = item.Units;
                            Price = item.PatientCoPay;
                            if (Quantity > 0 && Price > 0) {
                                /*$scope.hghgh = Quantity * Price;*/
                                item.Total = Quantity * Price;
                            } else {
                                item.Total = 0;
                            }
                            item.PatientCoPay = parseInt(item.PatientCoPay);
                            if (item.PatientCoPay != 0) {
                                $scope.cacheStorageItem.TotalAmount += item.Total;
                                $scope.cacheStorageItem.TotalChargeAmount += item.Total;
                            }
                            if (item.PatientCoPay == null || item.Units == null) {
                                $scope.Mainobj.TotalChargeAmount = '';
                            }
                        });
                    }
                }
                $scope.cacheStorageItem.TotalChargeAmount = $scope.cacheStorageItem.TotalChargeAmount || null;
                $scope.cacheStorageItem.FileUploadTotalAmount = plan.FileUploadTotalAmount || 0;

                $scope.VideoDetails = [];
                $scope.TempImagesArray = [];
                $scope.TempPdfArray = [];

                var PatientSurgeryDocument = plan.PatientSurgeryDocument || [];
                if (PatientSurgeryDocument.length > 0) {
                    angular.forEach(PatientSurgeryDocument, function (kitem, index) {
                        if (kitem.DocumentExt === 'image/jpeg' || kitem.DocumentExt === "image/png") {
                            kitem.file = kitem.S3URL;
                            kitem.IsChecked = true;
                            kitem.NoteFileTypeId = 31;
                            /*  kitem.PatientDocumentMaterialId = 0;*/
                            $scope.TempImagesArray.push(kitem);
                        }
                        if (kitem.DocumentExt === "application/pdf") {
                            kitem.file = kitem.S3URL;
                            kitem.IsChecked = true;
                            kitem.NoteFileTypeId = 31;
                            /*  kitem.PatientDocumentMaterialId = 0;*/
                            $scope.TempPdfArray.push(kitem);
                        }
                        if (kitem.DocumentExt === "video" || kitem.DocumentExt == null) {
                            var videoId = '';
                            var url = kitem.S3URL;
                            videoId = url.split("=")[1];
                            kitem.videoId = videoId || null;
                            kitem.IsChecked = true;
                            kitem.NoteFileTypeId = 31;
                            /* Vitem.PatientDocumentMaterialId = 0;*/
                            kitem.DocumentExt = 'video';
                            kitem.VideoName = kitem.DocumentName || '';
                            $scope.VideoDetails.push(kitem);
                        }
                    });
                }
            }


        };

        //$rootScope.$on('continuetoUsChartFromRx', function (evt, data) {
        //    console.log("this called");
        //    $scope.ChartObj.SubMainTab = 2;
        //    $scope.cacheStorageItem.appointmentid = data.AppointmentId;
        //    $scope.ChangeSubTab(2);
        //});

        $rootScope.$on('continuetoUsChartFromRx', function (evt, data) {
            console.log("this called");
            $scope.ChartObj.SubMainTab = 2;
            $scope.cacheStorageItem.appointmentid = data.AppointmentId;
            $scope.ChangeSubTab(2);
        });
        /* After save load the data  end*/
        $scope.ChangeSubTab = function (tab) {

            console.log(tab + "__tab" + $scope.ChartObj.SubMainTab);
            // $scope.ChartObj.SubMainTab = tab;
            if (tab == 1) {
                $scope.MasterTestUsedlist = angular.copy($scope.GetMasterTestUsed());
                var ConsultationID = $scope.cacheStorageItem.ConsultationID;
                var appointmentid = $scope.cacheStorageItem.appointmentid;
                /*$scope.GetOpthaPatientCaseHistory('navToSummary');*/
                $scope.GetAllPatientsvisits('navToSummary');
                //$timeout(function () {
                //    $scope.ChartObj.SubMainTab = tab;
                //}, 1000)
            }
            if (tab == 2) {
                if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 10 || userLoginDetails.RoleID === 16 || userLoginDetails.RoleID === 18) {
                    if (!$scope.IsAppointmentToday) {
                        alertify.error('Please Add Visit For Today');
                        $scope.ChartObj.SubMainTab = 1;
                        $scope.openAddVisitPopup();
                        return false;
                    }

                    if (userLoginDetails.RoleID === 43) {
                        if ($scope.ChartObj.DoctorId !== $scope.UserId) {
                            $scope.ChartObj.SubMainTab = 1;
                            alertify.error("Patient Doesn't Have an Appointment Scheduled for Today!");
                            return false;
                        }
                    }

                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    appoint_info.AppointmentId = $scope.ChartObj.AppointmentId || 0;
                    appoint_info.AppointmentID = $scope.ChartObj.AppointmentId || 0;
                    appoint_info.AppointmentStatus = $scope.ChartObj.AppointmentStatus || "";


                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                    //if (appoint_info.AppointmentID !== 0 && appoint_info.AppointmentID !== undefined) {
                    //    appoint_info.AppointmentId = appoint_info.AppointmentID || 0;
                    //}
                    if (appoint_info.AppointmentId !== 0) {
                        if (appoint_info.BookingTypeId == 2) {
                            alertify.error("Patient is in waiting status! Please make sure patient has confirmed appointment. ");
                            return false;
                        }
                        if (appoint_info.AppointmentStatusId == 1 || appoint_info.AppointmentStatusId == null) {
                            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>The patient isn't Checked In!<br> Do you want to Check In the patient? </h4>", function () {

                                var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");

                                var params = {
                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                    "HospitalId": $scope.HospitalId,
                                    /*"AppointmentId": $scope.cacheStorageItem.appointmentid,*/
                                    "AppointmentId": appoint_info.AppointmentId,
                                    "AppointmentTrackerDetailId": 0,
                                    "RoleId": userLoginDetails.RoleID,
                                    "VisitReason": "",
                                    "AttenderName": "",
                                    "DoctorId": null,
                                    "DoctorRoleId": null,
                                    "RoomTypeId": 1,
                                    "RoomId": null,
                                    "CurrentTime": CurrentTime,
                                    "IsSendTo": "N",
                                    "IsCheckedIn": "Y",
                                    "IsCheckedOut": "N",
                                    "IsReCheckIn": "N",
                                    "IsReCheckOut": "N",
                                    "AppointmentStatusId": 2,
                                    "BookingStatusId": appoint_info.BookingStatusId || 1,
                                    "VisitTypeId": appoint_info.VisitTypeId,
                                    "HospitalEquipmentId": appoint_info.PatientTagList || []
                                }
                                if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 16) {
                                    params.RoomTypeId = 1;
                                }
                                else if (userLoginDetails.RoleID === 10) {
                                    params.RoomTypeId = 2;
                                }
                                else if (userLoginDetails.RoleID === 18) {
                                    params.RoomTypeId = 4;
                                }

                                eHnoteMainAppointmentService.AddUpdateAppointmentCheckInTrackerDetails(params).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                        alertify.success("Patient CheckIn Successfully");
                                        var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                                        appoint_info.AppointmentStatusId = 2;
                                        eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                                        $scope.ChartObj.SubMainTab = tab;
                                    }
                                }, function (err) {
                                    alertify.error("Getting Failed");
                                });

                            }, function () {
                                r = "You pressed Cancel!";
                                $scope.ChartObj.SubMainTab = 1;
                            });
                        } else {
                            $scope.ChartObj.SubMainTab = tab;
                        }
                    }
                    else if ($scope.IsAppointmentToday && $scope.SelectedVisitId != 0) {
                        $scope.ChartObj.SubMainTab = tab;
                    } else {
                        alertify.error("Patient Does Not Have An Appointment Today");
                        return false;
                    }

                } else {
                    $scope.ChartObj.SubMainTab = 1;
                    alertify.error("The Charts Can Only Be Accessed by Physicians and Technicians");
                    return false;

                }
            }


        }




        $scope.UpdateToUnSign = function () {
            var r = alertify.confirm(
                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Are you sure you want to UnSign, Yes to continue ? </h4>",
                function () {

                    let obj = {
                        "Screen": "Chart",
                        "Type": "UnSign"
                    };

                    let signmodalInstance = $uibModal.open({
                        "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
                        "controller": "UsPasswordAuthenticationPopupCtrl",
                        "size": "md",
                        // "windowClass": "appointment-full-popup",
                        "backdrop": "static",
                        "keyboard": false,
                        "resolve": {
                            "obj": function () { return obj; }
                        }
                    });
                    signmodalInstance.result.then(function (resp) {
                        $scope.ChartObj.SubMainTab = 2;
                    }, function (data) {

                    });


                    //var Obj = {
                    //    "ConsultationId": $scope.cacheStorageItem.ConsultationID,
                    //    "UserId": $scope.UserId,
                    //    "ConsultationStatus": ""
                    //};
                    //if ($scope.cacheStorageItem.ConsultationLogArray.length > 0) {
                    //    var consul_Status = "";
                    //    var index = 0;
                    //    if ($scope.cacheStorageItem.ConsultationLogArray.length === 1) {
                    //        Obj.ConsultationStatus = "B";
                    //    } else if ($scope.cacheStorageItem.ConsultationLogArray.length > 1) {
                    //        Obj.ConsultationStatus = $scope.cacheStorageItem.ConsultationLogArray[1].Status;
                    //    }

                    //}

                    //eHnotePatientDataService.ConsultationStatusById(Obj).then(function (response) {
                    //    console.log(response);
                    //    if (response.data.length > 0) {
                    //        if (response.data[0].Status === "Success") {
                    //            $scope.ChartObj.SubMainTab = 2;

                    //            if (response.data[0].ConsultationLogArray.length > 0) {
                    //                $scope.cacheStorageItem.ConsultationLogArray = angular.copy(response.data[0].ConsultationLogArray);
                    //                $scope.UnSignObj.SummaryView = false;
                    //                $scope.ConsultationObj.SummaryView = false;
                    //            }
                    //        } else {
                    //            alertify.error(response);
                    //        }
                    //    }
                    //},
                    //    function (error) {
                    //        console.log(error);
                    //        alertify.error(error);
                    //    });
                }, function () {

                    return false;
                });

        }
        $scope.IsEditConsultationAccess = false;

        if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 10 || userLoginDetails.RoleID === 16) {
            $scope.IsEditConsultationAccess = true;
        }

        //if ($scope.cacheStorageItem.DoctorID !== $scope.UserId) {
        //    if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43) {
        //        $scope.IsEditConsultationAccess = false;
        //    }
        //}
        //$scope.IsEditConsultationAccess = (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 10 || userLoginDetails.RoleID === 16) && ($scope.cacheStorageItem.DoctorID === $scope.UserId || $scope.cacheStorageItem.DoctorID !== $scope.UserId && !(userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43));

        $scope.AfterEditSummary = function (plan, Edit) {

            $scope.cacheStorageItem.ConsultationID = plan.ConsultationId;
            $scope.cacheStorageItem.DoctorID = plan.DoctorId;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 10 || userLoginDetails.RoleID === 16 || userLoginDetails.RoleID === 18 || userLoginDetails.RoleID === 73) {


                if ($scope.AppointmentCheckInDynamicStatus === 1) {
                    var params = {
                        "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
                    };
                    eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                        if (resp.data.Status === 'Success') {
                            var DynamicStatusarray = resp.data.rows[0];
                            //$scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                            if ((userLoginDetails.RoleID == 1 || userLoginDetails.RoleID == 43 || userLoginDetails.RoleID == 16) && (DynamicStatusarray.RoomTypeId == 1) && DynamicStatusarray.Status == 'Waiting') {
                                $scope.updateAppointmentPatientTrackerstatus();
                                if (Edit === "SignOff") {
                                    $scope.UpdateToUnSign();
                                    let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                                    appointmentinfonew.AppointmentStatus = plan.StatusFlag;
                                    if (plan.StatusFlag === 'C') {
                                        $scope.cacheStorageItem.appointmentStatus = 'E';
                                        appointmentinfonew.AppointmentStatus = 'E';
                                    }
                                    appointmentinfonew.DoctorID = plan.DoctorId;

                                    appointmentinfonew.ConsultationId = plan.ConsultationId;
                                    appointmentinfonew.AppointmentID = plan.AppointmentId;
                                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfonew);

                                } else {
                                    $scope.ConsultationObj.SummaryView = false;
                                }
                            }
                            else if ((userLoginDetails.RoleID == 10) && (DynamicStatusarray.RoomTypeId == 2) && DynamicStatusarray.Status == 'Waiting') {
                                $scope.updateAppointmentPatientTrackerstatus();
                                if (Edit === "SignOff") {
                                    $scope.UpdateToUnSign();
                                    let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                                    appointmentinfonew.AppointmentStatus = plan.StatusFlag;
                                    if (plan.StatusFlag === 'C') {
                                        $scope.cacheStorageItem.appointmentStatus = 'E';
                                        appointmentinfonew.AppointmentStatus = 'E';
                                    }
                                    appointmentinfonew.DoctorID = plan.DoctorId;
                                    $scope.cacheStorageItem.ConsultationID = plan.ConsultationId;
                                    appointmentinfonew.ConsultationId = plan.ConsultationId;
                                    appointmentinfonew.AppointmentID = plan.AppointmentId;
                                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfonew);
                                } else {
                                    $scope.ConsultationObj.SummaryView = false;
                                }
                            }
                            else if ((userLoginDetails.RoleID == 10) && (DynamicStatusarray.RoomTypeId !== 2) && DynamicStatusarray.Status == 'Waiting') {
                                var r = alertify.confirm(
                                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is  " + DynamicStatusarray.Status + "  at " + DynamicStatusarray.RoomType + ", would you like to take the patient to your Room? </h4>",
                                    function () {
                                        $scope.isofflineConsultation = false;
                                        $scope.updateAppointmentPatientTrackerstatus();
                                        if (Edit === "SignOff") {
                                            $scope.UpdateToUnSign();
                                            let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                                            appointmentinfonew.AppointmentStatus = plan.StatusFlag;
                                            if (plan.StatusFlag === 'C') {
                                                $scope.cacheStorageItem.appointmentStatus = 'E';
                                                appointmentinfonew.AppointmentStatus = 'E';
                                            }
                                            appointmentinfonew.DoctorID = plan.DoctorId;
                                            $scope.cacheStorageItem.ConsultationID = plan.ConsultationId;
                                            appointmentinfonew.ConsultationId = plan.ConsultationId;
                                            appointmentinfonew.AppointmentID = plan.AppointmentId;
                                            eHnoteMasterDataService.addAppointmentInfo(appointmentinfonew);
                                        } else {
                                            $scope.ConsultationObj.SummaryView = false;
                                        }
                                    }, function () {
                                        var url = "/op";
                                        $location.url(url);
                                        // $scope.ChangeTab(1);
                                        return false;
                                    });
                            }
                            else if ((userLoginDetails.RoleID == 1 || userLoginDetails.RoleID == 43 || userLoginDetails.RoleID == 16) && (DynamicStatusarray.RoomTypeId !== 1 || DynamicStatusarray.RoomTypeId !== 12) && DynamicStatusarray.Status == 'Waiting') {
                                var r = alertify.confirm(
                                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is  " + DynamicStatusarray.Status + "  at " + DynamicStatusarray.RoomType + ", would you like to take the patient to your Room? </h4>",
                                    function () {
                                        $scope.isofflineConsultation = false;
                                        $scope.updateAppointmentPatientTrackerstatus();
                                        if (Edit === "SignOff") {
                                            $scope.UpdateToUnSign();
                                            let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                                            appointmentinfonew.AppointmentStatus = plan.StatusFlag;
                                            if (plan.StatusFlag === 'C') {
                                                $scope.cacheStorageItem.appointmentStatus = 'E';
                                                appointmentinfonew.AppointmentStatus = 'E';
                                            }
                                            appointmentinfonew.DoctorID = plan.DoctorId;
                                            $scope.cacheStorageItem.ConsultationID = plan.ConsultationId;
                                            appointmentinfonew.ConsultationId = plan.ConsultationId;
                                            appointmentinfonew.AppointmentID = plan.AppointmentId;
                                            eHnoteMasterDataService.addAppointmentInfo(appointmentinfonew);
                                        } else {
                                            $scope.ConsultationObj.SummaryView = false;
                                        }
                                    }, function () {
                                        var url = "/op";
                                        $location.url(url);
                                        // $scope.ChangeTab(1);
                                        return false;
                                    });
                            }
                            //else if ((userLoginDetails.RoleID == 1 || userLoginDetails.RoleID == 43 || userLoginDetails.RoleID == 10 || userLoginDetails.RoleID == 16) && (DynamicStatusarray.RoomTypeId !== 1 || DynamicStatusarray.RoomTypeId !== 12 || DynamicStatusarray.RoomTypeId !== 2) && DynamicStatusarray.Status == 'Active') {
                            else if (((userLoginDetails.RoleID == 1 && DynamicStatusarray.RoleId != 1) || (userLoginDetails.RoleID == 43 && DynamicStatusarray.RoleId != 43) || (userLoginDetails.RoleID == 10 && DynamicStatusarray.RoleId != 10) ||
                                (userLoginDetails.RoleID == 16 && DynamicStatusarray.RoleId != 16)) && (DynamicStatusarray.RoomTypeId !== 1 || DynamicStatusarray.RoomTypeId !== 12 || DynamicStatusarray.RoomTypeId !== 2) && DynamicStatusarray.Status == 'Active') {
                                var r = alertify.confirm(
                                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is  " + DynamicStatusarray.Status + "  at " + DynamicStatusarray.UserName + ", would you like to take the patient to your active room or work offline? </h4>",
                                    function () {
                                        $scope.RoomTypeId = null;
                                        if (userLoginDetails.RoleID == 1 || userLoginDetails.RoleID == 43 || userLoginDetails.RoleID == 16) {
                                            var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                                            $scope.RoomTypeId = 1;
                                            if (SuffixId == 13) { //optha
                                                $scope.RoomTypeId = 12;
                                            }
                                            if (SuffixId == 10) { //doctor
                                                $scope.RoomTypeId = 1;
                                            }

                                        }
                                        else if (userLoginDetails.RoleID == 10) {
                                            $scope.RoomTypeId = 2;
                                        }
                                        else if (userLoginDetails.RoleID == 2) {
                                            $scope.RoomTypeId = 10;
                                        }
                                        else if (userLoginDetails.RoleID == 19) {
                                            $scope.RoomTypeId = 9;
                                        } else {
                                            $scope.RoomTypeId = null;
                                        }
                                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                        var params = {
                                            "UserId": eHnoteMasterDataService.getLoginId(),
                                            "TransferUserId": eHnoteMasterDataService.getLoginId(),
                                            "HospitalId": $scope.HospitalId,
                                            "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                            "AppointmentTrackerDetailId": 0,
                                            "RoleId": userLoginDetails.RoleID,
                                            "DoctorId": null,
                                            "DoctorRoleId": null,
                                            "RoomTypeId": $scope.RoomTypeId,
                                            "RoomId": null,
                                            "CurrentTime": $scope.CurrentTime,
                                            "IsSendTo": "Y",
                                            "IsRollBack": "N",
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
                                                    "TransferUserId": eHnoteMasterDataService.getLoginId(),
                                                    "HospitalId": $scope.HospitalId,
                                                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                                    "AppointmentTrackerDetailId": 0,
                                                    "RoleId": userLoginDetails.RoleID,
                                                    "DoctorId": null,
                                                    "DoctorRoleId": null,
                                                    "RoomTypeId": $scope.RoomTypeId,
                                                    "RoomId": null,
                                                    "CurrentTime": $scope.CurrentTime,
                                                    "IsSendTo": "N",
                                                    "IsRollBack": "N",
                                                    "IsCheckedIn": "N",
                                                    "IsCheckedOut": "N",
                                                    "IsReCheckIn": "N",
                                                    "IsReCheckOut": "N"
                                                }
                                                eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                                    if (resp.data.Status == "Success") {
                                                        if (Edit === "SignOff") {
                                                            $scope.UpdateToUnSign();
                                                        } else {
                                                            $scope.ConsultationObj.SummaryView = false;
                                                        }
                                                    } else {
                                                        //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                                                        alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                                    }
                                                }, function (err) {
                                                    console.log(err);
                                                    alertify.error("Getting Failed");
                                                });


                                            }
                                        }, function (err) {
                                            console.log(err);
                                            alertify.error("Getting Failed");
                                        });

                                    },
                                    function () {
                                        $scope.isofflineConsultation = true;
                                        return false;
                                    });
                            }
                            else {
                                $scope.ConsultationObj.SummaryView = false;
                            }
                        }
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });


                } else {
                    if (Edit === "SignOff") {
                        $scope.UpdateToUnSign();

                        let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                        appointmentinfonew.AppointmentStatus = plan.StatusFlag;
                        if (plan.StatusFlag === 'C') {
                            $scope.cacheStorageItem.appointmentStatus = 'E';
                            appointmentinfonew.AppointmentStatus = 'E';
                        }
                        appointmentinfonew.DoctorID = plan.DoctorId;
                        $scope.cacheStorageItem.ConsultationID = plan.ConsultationId;
                        appointmentinfonew.ConsultationId = plan.ConsultationId;
                        appointmentinfonew.AppointmentID = plan.AppointmentId;
                        eHnoteMasterDataService.addAppointmentInfo(appointmentinfonew);
                    } else {
                        //$scope.ChartObj.SubMainTab = 2;
                        let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                        appointmentinfonew.AppointmentStatus = plan.StatusFlag;
                        if (plan.StatusFlag === 'C') {
                            $scope.cacheStorageItem.appointmentStatus = 'E';
                            appointmentinfonew.AppointmentStatus = 'E';
                        }
                        appointmentinfonew.DoctorID = plan.DoctorId;
                        appointmentinfonew.ConsultationId = plan.ConsultationId;
                        appointmentinfonew.AppointmentID = plan.AppointmentId;
                        eHnoteMasterDataService.addAppointmentInfo(appointmentinfonew);
                    }
                }
            } else {
                $scope.ChartObj.SubMainTab = 1;
                alertify.error("The Charts Can Only Be Accessed by Physicians and Technicians");
                return false;

            }


        }

        $scope.clicksApptListuibpopup = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/appointmentlistpop.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                //"size": "md",
                "windowClass": "appointmentlistuib",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }
        if ($scope.cacheStorageItem.ConsultationID != 0) {
            // $scope.clicksApptListuibpopup();
        }
        $scope.ChangesstatusSoftLens = function (item, statusid) {
            if (statusid == 1) {
                item.showstatus = !item.showstatus;
            } else {
                item.showAdvancestatus = !item.showAdvancestatus;
            }
        }
        $scope.ChangesstatusRGP = function (item, statusid) {
            if (statusid == 1) {
                item.showstatus = !item.showstatus;
            } else {
                item.showAdvancestatus = !item.showAdvancestatus;
            }
        }




        function BookApptPopupOpened(item) {
            var openBookAppt = item || "";
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
                let todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
                // if (resp.response.ConsultationDate === todaydate) {
                let tempappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                tempappointmentinfo.AppointmentStatus = resp.response.AppointmentStatus || "";
                tempappointmentinfo.AppointmentID = resp.response.AppointmentID || 0;
                tempappointmentinfo.AppointmentId = resp.response.AppointmentID || 0;
                tempappointmentinfo.DoctorID = resp.response.DoctorID || 0;
                tempappointmentinfo.DoctorFullName = resp.response.DoctorName || "";
                tempappointmentinfo.HospitalId = resp.response.BranchId || null;
                tempappointmentinfo.TreatmentPlanId = resp.response.TreatmentPlanId || 0;
                tempappointmentinfo.BranchId = resp.response.BranchId || 0;
                tempappointmentinfo.BranchName = resp.response.BranchName || "";
                tempappointmentinfo.ConsultationDt = resp.response.ConsultationDt || "";
                tempappointmentinfo.ConsultationId = resp.response.ConsultationId || 0;
                tempappointmentinfo.StartTime = resp.response.StartTime || "";
                tempappointmentinfo.EndTime = resp.response.EndTime || "";
                tempappointmentinfo.BillingId = resp.response.BillingId || 0;
                tempappointmentinfo.PatientInsuranceList = resp.response.PatientInsuranceList || [];
                tempappointmentinfo.AppointmentTOSCodes = resp.response.AppointmentTOSCodes || [];
                tempappointmentinfo.CheckinStatusId = resp.response.CheckinStatusId;
                tempappointmentinfo.AppointmentStatusId = resp.response.AppointmentStatusId || null;
                tempappointmentinfo.PaymentTypeId = resp.response.PaymentTypeId || 2;
                tempappointmentinfo.VisitRemarks = resp.response.VisitRemarks || "";
                tempappointmentinfo.VisitTypeId = resp.response.VisitTypeId || null;
                tempappointmentinfo.ProfileStatusMasterId = resp.response.ProfileStatusMasterId || "";
                tempappointmentinfo.AppointmentTypeId = resp.response.AppointmentTypeId || null;

                eHnoteMasterDataService.addAppointmentInfo(tempappointmentinfo);


                //  }
                $scope.GetOpthaPatientCaseHistory();


            }, function () {
                console.log("dismiss");
                $scope.SelectPatient($scope.patientid);
            });

        }

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
                let todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
                // if (resp.response.ConsultationDate === todaydate) {
                let tempappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                tempappointmentinfo.AppointmentStatus = resp.response.AppointmentStatus || "";
                tempappointmentinfo.AppointmentID = resp.response.AppointmentID || 0;
                tempappointmentinfo.AppointmentId = resp.response.AppointmentID || 0;
                tempappointmentinfo.DoctorID = resp.response.DoctorID || 0;
                tempappointmentinfo.DoctorFullName = resp.response.DoctorName || "";
                tempappointmentinfo.HospitalId = resp.response.BranchId || null;
                tempappointmentinfo.TreatmentPlanId = resp.response.TreatmentPlanId || 0;
                tempappointmentinfo.BranchId = resp.response.BranchId || 0;
                tempappointmentinfo.BranchName = resp.response.BranchName || "";
                tempappointmentinfo.ConsultationDt = resp.response.ConsultationDt || "";
                tempappointmentinfo.ConsultationId = resp.response.ConsultationId || 0;
                tempappointmentinfo.StartTime = resp.response.StartTime || "";
                tempappointmentinfo.EndTime = resp.response.EndTime || "";
                tempappointmentinfo.BillingId = resp.response.BillingId || 0;
                tempappointmentinfo.PatientInsuranceList = resp.response.PatientInsuranceList || [];
                tempappointmentinfo.AppointmentTOSCodes = resp.response.AppointmentTOSCodes || [];
                tempappointmentinfo.CheckinStatusId = resp.response.CheckinStatusId;
                tempappointmentinfo.AppointmentStatusId = resp.response.AppointmentStatusId || null;
                tempappointmentinfo.PaymentTypeId = resp.response.PaymentTypeId || 2;
                tempappointmentinfo.VisitRemarks = resp.response.VisitRemarks || "";
                tempappointmentinfo.VisitTypeId = resp.response.VisitTypeId || null;
                tempappointmentinfo.ProfileStatusMasterId = resp.response.ProfileStatusMasterId || "";
                tempappointmentinfo.AppointmentTypeId = resp.response.AppointmentTypeId || null;

                eHnoteMasterDataService.addAppointmentInfo(tempappointmentinfo);


                //  }
                /*$scope.GetOpthaPatientCaseHistory();*/
                $scope.GetAllPatientsvisits();

            }, function () {
                console.log("dismiss");
                $scope.SelectPatient($scope.patientid);
            });

        }

        $scope.BookAppointmentPopup = function (type) {
            var OpenType = type || 2;
            $scope.ShowPatientListDrop = false;
            $scope.PageName = "book";
            $rootScope.appointment_type = "1";

            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            var clinicAddress = {
                "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID
            };
            var doctorID = {
                "DoctorID": doctorinfo.doctorid
            };
            if (doctorinfo.RoleID === 43) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            } else if (doctorinfo.RoleID === 1) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            } else {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);

                var doctorID1 = {
                    "DoctorID": 0
                };
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID1);
            }
            $scope.cacheStorageItem.VisitRemarks = $scope.cacheStorageItem.VisitRemarks || "";
            if ($scope.cacheStorageItem.VisitRemarks != "") {
                $scope.cacheStorageItem.VisitRemarks = "";
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }
            else {
                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            }

            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": false,
                "calenderDate": undefined,
                "AppointmentId": null,
                "DoctorId": null,
                "StartTime": null,
                "EndTime": null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                'IsComingFrom': 'PatientProfile',
                'type': $scope.PreviousUrl === "/op" ? 'op' : ''    //$scope.cacheStorageItem.type
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            var opencallcenterpopup = "";
            if (($scope.userLoginDetails.RoleID === 20 || $scope.userLoginDetails.RoleID === 70) && $scope.PreviousUrl === "/crm") {
                opencallcenterpopup = "crm";
            }

            if (OpenType == 2) {
                BookApptPopupOpenedV2(opencallcenterpopup);
            } else {
                BookApptPopupOpened(opencallcenterpopup);
            }
        };

        $scope.ChangeScribe = function (id, item) {
            var List1 = $filter("filter")($scope.AllDoctorAssitantList1, function (Ditem,) { return Ditem.DoctorID === id; }) || [];
            if (List1.length != 0) {
                //item.RCoManagedby = List1[0].FullName;
                item.ScribeName = List1[0].FullName;
                item.ScribeId = List1[0].DoctorID;
                $scope.Amendmentobj.ScriberId = List1[0].DoctorID;
                $scope.Amendmentobj.ScribeName = List1[0].FullName;
            }
        };
        $scope.ChangeDcotor = function (id, item) {
            var List1 = $filter("filter")($scope.AllDoctorList, function (Ditem,) { return Ditem.DoctorID === id; }) || [];
            if (List1.length != 0) {
                item.DoctorName = List1[0].FullName;
                item.DoctorId = List1[0].DoctorID;
                $scope.Amendmentobj.DoctorId = List1[0].DoctorID;
                $scope.Amendmentobj.DoctorName = List1[0].FullName;
            }
        };

        $scope.AddAmendmentsData = function () {
            $scope.Amendmentobj = {
                "PatientId": $scope.cacheStorageItem.patientid,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": $scope.ChartObj.AppointmentId,
                "DoctorId": null,
                "ScriberId": null,
                "AmendmentsNotes": "",
                "DateTime": "",
                "UserId": $scope.UserId,

            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Addamendments.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "inventory-full-popup",
                //"controller": function ($scope, $uibModal, $uibModalInstance) {



                //}
            });

        };
        $scope.uibclose = function () {
            $scope.mInstanceAdd.dismiss("cancel");
        };

        $scope.SaveAmendment = function () {
            $scope.Amendmentobj.AmendmentsNotes = $scope.Amendmentobj.AmendmentsNotes || '';
            if ($scope.Amendmentobj.AmendmentsNotes == '') {
                alertify.error("Enter Amendment");
                return false;
            }
            var object = {
                "PatientId": $scope.Amendmentobj.PatientId,
                "HospitalId": $scope.Amendmentobj.HospitalId,
                "AppointmentId": $scope.Amendmentobj.AppointmentId,
                "DoctorId": $scope.Amendmentobj.DoctorId,
                "ScriberId": $scope.Amendmentobj.ScriberId,
                "AmendmentsNotes": $scope.Amendmentobj.AmendmentsNotes,
                "DateTime": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "UserId": $scope.UserId,

            }


            eHnotePatientDataService.AddUpdatePatientAmendments(object).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.mInstanceAdd.dismiss("cancel");

                    $scope.GetPatientAppointmenthistroy($scope.cacheStorageItem.ConsultationID, $scope.Amendmentobj.AppointmentId);
                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        }

        $scope.ActiveConsultaionSideBar1 = function (Num) {
            $rootScope.ConsultationActiveId = "#" + "ConsultationScroll" + Num;
        }

        $scope.activeclassFunction1 = function (id) {
            var objbit = false;
            if ($rootScope.ConsultationActiveId) {
                objbit = $rootScope.ConsultationActiveId == "#" + "ConsultationScroll" + id;
            }
            return !objbit;
        };





        function getEmailReqObj() {
            let obj = {
                "DoctorEmail": "",
                "TextBody": "",
                "AppointmentId": "",
                "Subject": "",
                "PHIEmail": "",
                "NormalEmail": 2,
                "IsChartCCDAChecked": false,
                "IsChartPdfChecked": false,
                "CCDALink": "",
                "pdfurl": "",
                "IsMailFromWebApp": false,
                "IsMailFromPatientPortal": false,
            }
            return obj;
        }
        $scope.eObj = getEmailReqObj();

        $scope.SendemailPopup = function (item) {
            $scope.eObj = getEmailReqObj();
            $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();
            $scope.eObj.AppointmentId = item.AppointmentId;
            $scope.eObj.ConsultationId = item.ConsultationId;
            $scope.eObj.PatientId = item.PatientArray[0].PatientId;
            $scope.eObj.DoctorId = item.DoctorId;
            $scope.newSendEmailReqObj.AppointmentId = item.AppointmentId;
            $scope.newSendEmailReqObj.PatientId = item.PatientArray[0].PatientId;
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "SendemailPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "md",
            });
        }


        $scope.ClosePop = function () {
            $scope.mInstanceAdd.dismiss("cancel");
        }


        $scope.SaveEmailpopup = function () {

            if ($scope.eObj.DoctorEmail == '') {
                alertify.error("Enter Doctor Email");
                return false;
            }
            if ($scope.eObj.Subject == '') {
                alertify.error("Enter Subject");
                return false;
            }
            if ($scope.eObj.TextBody == '') {
                alertify.error("Enter Text Body");
                return false;
            }
            var obj = {
                "DoctorEmail": $scope.eObj.DoctorEmail || "",
                "TextBody": $scope.eObj.TextBody || "",
                "Subject": $scope.eObj.Subject || "",
                "HospitalID": $scope.HospitalId,
                "UserId": $scope.UserId,
                "send": true,
                "receive": true,
                "PatientId": $scope.cacheStorageItem.patientid,
                "PHIEmail": "",
            }


            eHnoteDiagnosisDataServices.SendemailData1(obj).then(function (response) {

                if (response.data.status === 'success') {
                    $scope.mInstanceAdd.dismiss("cancel");
                }
            });
        }
        $scope.GetCCDACreate = function (item, doctype) {
            var type = 0;
            if (item.ConsultationId === 0) {
                type = 1;
            }
            var obj = {
                "PatientId": $scope.cacheStorageItem.patientid,
                "AppointmentId": item.AppointmentId,
                "Type": type,
                "IsFrom": "CCDA",
                "UserId": $scope.UserId,
                "DocumentType": doctype
            };

            eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                //window.open("C:/Users/VinayKokkula/Downloads/170.315_b1_toc_amb_ccd_r21_sample1_v13.html", "_blank");
                //  window.open("https://ehnotedevstorage.blob.core.windows.net/dev/1/CCDASampleTest.html", "_blank");
                //if (response.data.Status === 'Success') {
                //    window.open("https://ehnotedevstorage.blog.core.windows.net/dev/1/CDA.xsl", "_blank");
                //}

                if (resp.data != null) {
                    //  var abc = https://ehnotedevstorage.blog.core.windows.net/dev/1/CDA.xsl;
                    var abc = resp.data;
                    // window.open("href="+abc+", '_blank');
                    window.open(abc);

                } else {
                    window.open("https://ehnotedevstorage.blob.core.windows.net/dev/1/CCDASampleTest.html", "_blank");
                }
            });
        }

        $scope.GetCCDAXmlData = function (item, AppointmentID) {
            var type = 0;
            if (item.ConsultationId === 0) {
                type = 1;
            }
            var obj = {
                "PatientId": $scope.cacheStorageItem.patientid,
                "AppointmentId": item.AppointmentId,
                "Type": type,
                "IsFrom": "XmlData",
                "UserId": $scope.UserId

            };

            eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                //window.open("C:/Users/VinayKokkula/Downloads/170.315_b1_toc_amb_ccd_r21_sample1_v13.html", "_blank");
                //  window.open("https://ehnotedevstorage.blob.core.windows.net/dev/1/CCDASampleTest.html", "_blank");
                //if (response.data.Status === 'Success') {
                //    window.open("https://ehnotedevstorage.blog.core.windows.net/dev/1/CDA.xsl", "_blank");
                //}

                if (resp.data != null) {
                    //  var abc = https://ehnotedevstorage.blog.core.windows.net/dev/1/CDA.xsl;
                    var abc = resp.data;
                    // window.open("href="+abc+", '_blank');
                    window.open(abc);

                } else {
                    window.open("https://ehnotedevstorage.blob.core.windows.net/dev/1/CCDASampleTest.html", "_blank");
                }
            });
        }
        $scope.ConsultationMailSendObj = {
            "PatientEmail": "",
            "DoctorEmail": "",
            "OtherEmail": "",
            "Subject": "",
        }
        $scope.CloseConsultationPop = function () {
            $scope.mInstanceAdd.dismiss("cancel");
        }
        function getMailStr(pval, dval, oval) {
            var strmail = "";
            if (pval)
                strmail = pval;
            if (dval)
                strmail += strmail ? ',' + dval : dval;
            if (oval)
                strmail += strmail ? ',' + oval : oval;
            return strmail;
        }
        $scope.ConsultationMailSend = function (Plan, Type) {
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            $scope.EmailType = Type || "";
            $scope.ConsultationPlan = Plan || "";
            appointmentinfo.EmailID = appointmentinfo.PatientDetails.EmailId ? appointmentinfo.PatientDetails.EmailId : "";
            if (appointmentinfo.EmailID) {
                $scope.ConsultationMailSendObj.PatientEmail = appointmentinfo.EmailID;
            }
            $scope.ConsultationMailSendObj.DoctorEmail = Plan.DoctorEmailId || "";
            $scope.ConsultationMailSendObj.OtherEmail = "";
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "ConsultationMailSendPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "md",
            });
        }
        $scope.SaveSendConsultationMail = function () {

            if ($scope.ConsultationMailSendObj.PatientEmail == "") {
                alertify.error("Please Enter Patient Email");
                return false;
            }
            var TempConsultationPlan = angular.copy($scope.ConsultationPlan);
            TempConsultationPlan.emailAddresses = getMailStr($scope.ConsultationMailSendObj.PatientEmail, $scope.ConsultationMailSendObj.DoctorEmail, $scope.ConsultationMailSendObj.OtherEmail);
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            TempConsultationPlan.PatientName = appointmentinfo.PatientDetails.FullName ? appointmentinfo.PatientDetails.FullName : "";

            appointmentinfo.Title = appointmentinfo.PatientDetails.Title ? appointmentinfo.PatientDetails.Title : "";
            if (appointmentinfo.Title !== "") {
                TempConsultationPlan.PatientName = appointmentinfo.Title + "." + TempConsultationPlan.PatientName;
            }
            TempConsultationPlan.PhoneNumber = appointmentinfo.PatientDetails.MobileNo ? appointmentinfo.PatientDetails.MobileNo : "";
            TempConsultationPlan.PatientAddress = "";
            TempConsultationPlan.BranchPhone = TempConsultationPlan.BranchMobile;
            TempConsultationPlan.DoctorName = TempConsultationPlan.Appointmentwith;
            TempConsultationPlan.PatientAge = "";
            TempConsultationPlan.PatientGender = appointmentinfo.PatientDetails.Gender || "";
            appointmentinfo.PatientDetails.AgeInYears = appointmentinfo.PatientDetails.AgeInYears || "";
            if (appointmentinfo.PatientDetails.AgeInYears !== "") {
                TempConsultationPlan.PatientAge = appointmentinfo.PatientDetails.AgeInYears + "Y" + " " + appointmentinfo.PatientDetails.AgeInMonths + "M" + " " + appointmentinfo.PatientDetails.AgeInDays + "D";
            } else {
                TempConsultationPlan.PatientAge = appointmentinfo.PatientDetails.AgeInMonths + "M" + " " + appointmentinfo.PatientDetails.AgeInDays + "D";
            }
            //TempConsultationPlan.PatientGst = appointmentinfo.PatientGSTNO;
            TempConsultationPlan.PatientId = appointmentinfo.PatientID;
            TempConsultationPlan.PatientDisplayId = appointmentinfo.PatientDetails.PatientDisplayId ? appointmentinfo.PatientDetails.PatientDisplayId : "";
            TempConsultationPlan.BranchArea = TempConsultationPlan.BranchArea || "";
            TempConsultationPlan.BranchAddress = "";
            if (TempConsultationPlan.Address1 !== "" && TempConsultationPlan.Address2 !== "") {
                TempConsultationPlan.BranchAddress = TempConsultationPlan.Address1 + "," + TempConsultationPlan.Address2;
            } else if (TempConsultationPlan.Address1 !== "" && TempConsultationPlan.Address2 === "") {
                TempConsultationPlan.BranchAddress = TempConsultationPlan.Address1;
            } else if (TempConsultationPlan.Address1 === "" && TempConsultationPlan.Address2 !== "") {
                TempConsultationPlan.BranchAddress = TempConsultationPlan.Address2;
            }
            if (TempConsultationPlan.Vitals !== undefined) {
                var BpHigh = "";
                var BpLow = "";
                for (var i = TempConsultationPlan.Vitals.length - 1; i >= 0; i--) {
                    if (TempConsultationPlan.Vitals[i].VitalId === 4) {
                        BpLow = TempConsultationPlan.Vitals[i].Value1;
                    }
                    if (TempConsultationPlan.Vitals[i].VitalId === 5) {
                        BpHigh = TempConsultationPlan.Vitals[i].Value1;
                    }
                    //if (TempConsultationPlan.Vitals[i].Value === "" || TempConsultationPlan.Vitals[i].VitalId === 4 || TempConsultationPlan.Vitals[i].VitalId === 5) {
                    //    TempConsultationPlan.Vitals.splice(i, 1);
                    //}
                }
                if (BpHigh !== "" && BpLow !== "") {
                    TempConsultationPlan.Vitals.push({
                        "VitalID": 18,
                        "VitalDesc": "Bp (mm Hg)",
                        "Value": BpHigh + " / " + BpLow
                    });
                }
            }
            var req = {
                "ConsultationId": TempConsultationPlan.ConsultationId || "",
                "AppointmentId": TempConsultationPlan.AppointmentId || "",
                "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
                "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
                "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
                "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
                "ScribeName": TempConsultationPlan.ScribeName || "",
                "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
                "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
                "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
                "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
                "StatusFlag": TempConsultationPlan.StatusFlag || "",
                "RoleName": TempConsultationPlan.RoleName || "",
                "DoctorId": TempConsultationPlan.DoctorId || "",
                "DoctorName": TempConsultationPlan.DoctorName || "",
                "isSendRefLetterMail": false,
                "BranchName": TempConsultationPlan.BranchName || "",
                "BranchPhone": TempConsultationPlan.BranchPhone || "",
                "BranchEmail": TempConsultationPlan.BranchEmail || "",
                "BranchAddress": TempConsultationPlan.BranchAddress || "",
                "PatientName": appointmentinfo.PatientName || "",
                "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                "emailAddresses": TempConsultationPlan.emailAddresses || '',
                "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                "PatientDisplayId": TempConsultationPlan.PatientDisplayId || "",
                "PatientGender": TempConsultationPlan.PatientGender || "",
                "PatientAge": TempConsultationPlan.PatientAge || "",
                "PatientGst": TempConsultationPlan.AppointmentId || "",
                "PhoneNumber": TempConsultationPlan.PhoneNumber || "",
                "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                "ChiefComplaints": [],
                "Vitals": TempConsultationPlan.Vitals || [],
                "OccularHistory": TempConsultationPlan.OccularHistory || [],
                "AllergyItems": TempConsultationPlan.AllergyItems || [],
                "MedicalConditions": [],
                "OccularSurgicalHistory": TempConsultationPlan.OccularSurgicalHistory || [],
                "CurrentEyeMedications": TempConsultationPlan.CurrentEyeMedications || [],
                "SystemicHistory": TempConsultationPlan.SystemicHistory || [],
                "CurrentSystemicHistory": TempConsultationPlan.CurrentSystemicMedicationsHistory || [],
                "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                "BirthHistory": TempConsultationPlan.BirthHistory || [],
                "FamilyHistory": TempConsultationPlan.FamilyHistory || [],
                "FunctionalStatusHistory": TempConsultationPlan.FunctionalStatusHistory || [],
                "VaccinationHistory": TempConsultationPlan.VaccinationHistory || [],
                "NutritionalHistory": TempConsultationPlan.NutritionalHistory || [],
                "MenstrualHistory": TempConsultationPlan.MenstrualHistory || [],
                "HealthConcerns": TempConsultationPlan.PatientHealthConcerns || [],
                "HealthGoals": TempConsultationPlan.PatientGoals || [],
                "LifestyleHistory": TempConsultationPlan.LifestyleHistory || [],
                "VisionDetails": TempConsultationPlan.VisionDetails || [],
                "AutoRefractionDetails": TempConsultationPlan.AutoRefractionArray || [],
                "RetinoscopyRefractionDetails": TempConsultationPlan.RetinoscopyRefractionArray || [],
                "PGPRefractionDetails": TempConsultationPlan.PGPrefractionArray || [],
                "ManifestRefractionDetails": TempConsultationPlan.ManifestRefractionArray || [],
                "OverRefractionDetails": TempConsultationPlan.OverRefractionArray || [],
                "CycloplegicRefractionDetails": TempConsultationPlan.CycloplegicRefractionArray || [],
                "FinalGlassRxDetails": TempConsultationPlan.FinalGlassRxArray || [],
                "TonoMetryDetails": TempConsultationPlan.Tonometry || [],
                "PupilSizeDetails": TempConsultationPlan.PupilSizeDetails || [],
                "PachymetryDetails": TempConsultationPlan.Pachymetry || [],
                "GlareDetails": TempConsultationPlan.GlareArray || [],
                "KeratometryDetails": TempConsultationPlan.KeratometryValues || [],
                "ContactLensDetails": TempConsultationPlan.ContactLensDetails || [],
                "AnteriorSegmentArrayNew": TempConsultationPlan.AnteriorSegmentDetails || [],
                "PosteriorSegmentDetails": TempConsultationPlan.PosteriorSegmentDetails || [],
                "NineGazeExtraOcularDetails": TempConsultationPlan.NineGazeExtraOcularDetails || [],
                "SquintDetails": TempConsultationPlan.SquintDetails || [],
                "GlassDetails": TempConsultationPlan.GlassDetails || [],
                "OPProcedures": TempConsultationPlan.OPProceduresArray || [],
                "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
                "DryEyeEvalutionDetails": TempConsultationPlan.DryEyeEvaluationData || [],
                //"SquintPossibleDiagnosisArray": TempConsultationPlan.SquintPossibleDiagnosisArray || [],
                //"BVPossibleDiagnosisArray": TempConsultationPlan.BVPossibleDiagnosisArray || [],
                "ColorVisionDetails": TempConsultationPlan.ColorVisionDetails || [],
                "LacrimalPatiencyDetails": TempConsultationPlan.LacrimalPatiencyDetails || [],
                "GonioscopyDetails": TempConsultationPlan.GonioscopyDetails || [],
                "PrescriptionDetails": TempConsultationPlan.PatientPrescription.PrescriptionDetails || [],
                "AssessmentPlan": TempConsultationPlan.AssessmentPlan || [],
                "InvestigationsDetails": TempConsultationPlan.InvestigationsDetails || [],
                "SurgeriesDetails": TempConsultationPlan.SurgeriesDetails || [],
                "ProceduresDetails": TempConsultationPlan.ProceduresDetails || [],
                "ReferralDetails": TempConsultationPlan.ReferralDetails || [],
                "PhysicalEvaluation": TempConsultationPlan.CustomAllergyRemarks || [],
                "PsychiatryData": TempConsultationPlan.PsychiatryData || [],
                "LabInvestigations": TempConsultationPlan.LabInvestigations || [],
                "PsychologicalObservations": $scope.ScoreObject,
                "ROSAllergyHeaders": $scope.cacheStorageItem.ROSAllergyHeaders || [],
                "IsChartCCDAChecked": false,
                "IsChartPdfChecked": true,
                "PatientId": TempConsultationPlan.PatientId || 0
            }
            req.isSendRefLetterMail = false;
            if (TempConsultationPlan.ChiefComplaints.length > 0) {
                angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
                    var checifobj = {
                        "ChiefComplaintId": Citems.ChiefComplaintId || 0,
                        "ChiefComplaintName": Citems.ChiefComplaintName || "",
                        "Description": Citems.Description || "",
                        "OrganId": Citems.OrganId || 0,
                        "Duration": 1,
                        "DurationType": Citems.DurationType || '',
                        "Remarks": Citems.Remarks || "",
                        "PatientName": appointmentinfo.PatientName || "",
                    }
                    req.ChiefComplaints.push(checifobj);
                })
            }


            eHnoteDiagnosisDataServices.SendConsulatationEmail(req).then(function (resp) {
                if (resp.data.Message == 'Success') {
                    alertify.success("Mail Send Succesfully");
                    $scope.CloseConsultationPop();
                }
                else {
                    alertify.error("Mail  not Send to Patient");
                    $scope.CloseConsultationPop();
                }
            })
        }

        $scope.getPatientNoteFiles = function () {
            var param = { "AppointmentId": $scope.ChartObj.AppointmentId };
            $scope.cacheStorageItem.AppointmentPatientUploads = [];
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
                        $scope.cacheStorageItem.AppointmentPatientUploads = resp.PatientFiles;
                        console.log($scope.cacheStorageItem.AppointmentPatientUploads[0].url);
                        $scope.AddToCache();
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

            }
            function ongetFileError(err) {
                alertify.error("Getting files failed");
            }
        }

        $scope.ExportAppointmentData = function () {
            var param = { "AppointmentId": $scope.ChartObj.AppointmentId };
            $scope.cacheStorageItem.AppointmentPatientUploads = [];
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
                        $scope.cacheStorageItem.AppointmentPatientUploads = resp.PatientFiles;
                        console.log($scope.cacheStorageItem.AppointmentPatientUploads[0].url);
                        $scope.AddToCache();
                        var filteredArray = resp.PatientFiles;
                        $scope.date_string = $filter("date")(new Date($scope.ChartObj.AppointmentDate), "MM-dd-yyyy");
                        $scope.date_string_without_hyphens = $scope.date_string.replaceAll(/-/g, '');
                        //$scope.trimmedt = $scope.date_string_without_hyphens.trim();
                        $scope.exportInputObj = {
                            "HospitalID": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "PatientId": $scope.cacheStorageItem.PatientID,
                            "AppointmentId": $scope.ChartObj.AppointmentId,
                            "AppointmentDate": $scope.date_string_without_hyphens,
                            "url": $scope.cacheStorageItem.AppointmentPatientUploads[0].url,
                            "FileName": filteredArray[0].FileName
                        }
                        eHnoteMainAppointmentService.ExportAppointmentData($scope.exportInputObj).then(function (res) {
                            if (res.data.status == 'Success') {
                                console.log('checking');
                            }
                        })
                        alertify.success("Data Exported SuccessFully");
                        //  for (var i = 0; i < filteredArray.length; i++) {
                        //$scope.docname = '';
                        //filteredArray[i].docNameDisplay = '';
                        //var extension = ".jpg";
                        //if (filteredArray[i].DocName) {
                        //    extension = filteredArray[i].DocName.split(".")[1];
                        //}
                        var pName = filteredArray[i].DocName.split("_")[0];
                        //if (pName.length > 9) {
                        //    name = pName.substring(0, 9) + "..." + "." + extension;
                        //} else {
                        //    name = angular.copy(pName) + '.' + extension;
                        //}
                        //filteredArray[i].docNameDisplay = name;



                        //if (filteredArray[i].DocURL.indexOf(".pdf") > -1) {
                        //    filteredArray[i].DeleteInd = false;
                        //    filteredArray.IsRemarksinEdit = false;
                        //    switch (filteredArray[i].FileTypeId) {
                        //        case 1:
                        //            $scope.generalPdfUploads.push(filteredArray[i]);
                        //            break;
                        //        case 2:
                        //            $scope.PreTreatmentPdfUploads.push(filteredArray[i]);
                        //            break;
                        //        case 3:
                        //            $scope.PostTreatmentPdfUploads.push(filteredArray[i]);
                        //            break;
                        //        case 4:
                        //            $scope.ConsentPdfUploads.push(filteredArray[i]);
                        //            break;
                        //    }
                        //} else {
                        //    filteredArray[i].DeleteInd = false;
                        //    filteredArray.IsRemarksinEdit = false;
                        //    switch (filteredArray[i].FileTypeId) {
                        //        case 1:
                        //            $scope.generalImgUploads.push(filteredArray[i]);
                        //            break;
                        //        case 2:
                        //            $scope.PreTreatmentImgUploads.push(filteredArray[i]);
                        //            break;
                        //        case 3:
                        //            $scope.PostTreatmentImgUploads.push(filteredArray[i]);
                        //            break;
                        //        case 4:
                        //            $scope.ConsentImgUploads.push(filteredArray[i]);
                        //            break;
                        //    }
                        //}
                        // }
                    }
                }

            }
            function ongetFileError(err) {
                alertify.error("Getting files failed");
            }


        };

        $scope.attachmentobj = {
            attachemntname: ""
        }
        $scope.DownloadExportedData = function () {
            alertify.success("Data Downloaded SuccessFully");
        };

        $scope.ChangeNormalOrDirectMail = function (item, tab) {
            item.NormalEmail = tab;
        }
        $scope.AddingCCDAAttancmentTomail = function (IsChartCCDACheckedInd) {
            if (IsChartCCDACheckedInd) {
                var type = 0;
                var patientid = $scope.eObj.PatientId;
                var AppointmentId = $scope.eObj.AppointmentId;
                var ConsultationId = $scope.eObj.ConsultationId;
                var type = 0;
                if (ConsultationId === 0) {
                    type = 1;
                }
                var obj = {
                    "PatientId": patientid,
                    "AppointmentId": AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId
                };
                eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                    if (resp.data != null) {
                        $scope.eObj.CCDALink = resp.data;
                    } else {
                        $scope.eObj.CCDALink = "";
                        window.open("https://ehnotedevstorage.blob.core.windows.net/dev/1/CCDASampleTest.html", "_blank");
                    }
                });
            }
            else {
                $scope.eObj.CCDALink = "";
            }
        }
        $scope.GetPatientAllAppointmentDataExportInfo = function () {
            $scope.Arr_exportedData = [];
            $scope.dataobj = {
                "HospitalId": $scope.HospitalId,
                "PatinetId": $scope.cacheStorageItem.PatientID
            }
            eHnotePatientDataService.GetPatientAllAppointmentDataExportInfo($scope.dataobj).then(function (response) {
                console.log(response);
                if (response.data != null || response.data != undefined) {
                    if (response.data.Status === "Success") {
                        if (response.data.Attachments.length > 0) {
                            $scope.copyarry = response.data.Attachments;
                            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                            angular.forEach($scope.copyarry, function (item) {
                                if (appointmentinfo.AppointmentId == item.AppointmentId) {
                                    $scope.Arr_exportedData.push({
                                        "PatientId": item.PatientId,
                                        "AppointmentId": item.AppointmentId,
                                        "AppointmentDoctorName": item.AppointmentDoctorName,
                                        "AppointmentDate": item.AppointmentDate,
                                        "PatientDataExportId": item.PatientDataExportId,
                                        "FolderPath": item.FolderPath,
                                        "ExportedBy": item.ExportedBy,
                                        "ExportedDate": item.ExportedDate,
                                        "DeleteInd": item.DeleteInd,
                                        "CreatedUserName": item.CreatedUserName,
                                        "ischeckflag": $scope.checkflag,
                                        "IsExported": true,
                                        "Files": item.Files
                                    })
                                }
                            })
                            console.log($scope.Arr_exportedData)
                        }
                    } else {
                        alertify.error(response);
                    }
                }
            },
                function (error) {
                    console.log(error);
                    alertify.error(error);
                });
        };
        $scope.AddingPdfAttancmentTomail = function (IsChartPdfCheckedInd) {
            if (IsChartPdfCheckedInd) {
                var AppointmentId = $scope.eObj.AppointmentId;
                var ConsultationId = $scope.eObj.ConsultationId;
                var type = 0;
                if (ConsultationId === 0) {
                    type = 1;
                }
                var object = {
                    "AppointmentId": AppointmentId || 0,
                    "Type": type,
                    "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0

                };
                eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                    if (resp.data !== undefined) {
                        $scope.treatmentData = resp.data;

                        var IsNKISelected = $scope.cacheStorageItem.isNKISelected;

                        var TempConsultationPlan = angular.copy($scope.treatmentData[0]);

                        var count1 = 0;
                        var pachyODAvgValue = 0;
                        var pachyOSAvgValue = 0;
                        angular.forEach(TempConsultationPlan.Pachymetry, function (pitem) {
                            pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                            pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                            count1++;
                        });
                        TempConsultationPlan.PachymetryAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
                        TempConsultationPlan.PachymetryAvgOSValue = parseFloat(pachyOSAvgValue / count1).toFixed(2) || 0;

                        var BranchMobile = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.BranchMobile);
                        TempConsultationPlan.BranchMobile = BranchMobile.UsFormatMobileNumber;

                        var PhoneNumber = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].PhoneNumber);
                        var ContactNo = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].ContactNo);
                        TempConsultationPlan.PatientArray[0].PhoneNumber = PhoneNumber.UsFormatMobileNumber;
                        if (TempConsultationPlan.PatientArray[0].ContactNo.length > 10) {
                            TempConsultationPlan.PatientArray[0].ContactNo = ContactNo.UsFormatMobileNumber;
                        } else {
                            TempConsultationPlan.PatientArray[0].ContactNo = "";
                        }
                        TempConsultationPlan.PatientArray[0].DOB = TempConsultationPlan.PatientArray[0].DOB || "";

                        if (TempConsultationPlan != "") {
                            var req = {
                                "UserId": $scope.UserId,
                                "ConsultationId": TempConsultationPlan.ConsultationId || "",
                                "AppointmentId": TempConsultationPlan.AppointmentId || "",
                                "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                                "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                                "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
                                "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                                "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                                "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
                                "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
                                "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
                                "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
                                "ScribeName": TempConsultationPlan.ScribeName || "",
                                "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
                                "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
                                "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
                                "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
                                "StatusFlag": TempConsultationPlan.StatusFlag || "",
                                "RoleName": TempConsultationPlan.RoleName || "",
                                "DoctorId": TempConsultationPlan.DoctorId || "",
                                "DoctorName": TempConsultationPlan.Appointmentwith || "",
                                "isSendRefLetterMail": false,
                                "BranchId": TempConsultationPlan.BranchId || "",
                                "BranchName": TempConsultationPlan.BranchName || "",
                                "BranchPhoneNo": TempConsultationPlan.BranchMobile || "",
                                "BranchArea": TempConsultationPlan.BranchArea || "",
                                "BVPossibleDiagnosis": TempConsultationPlan.BVPossibleDiagnosis || "",
                                "BranchEmail": TempConsultationPlan.BranchEmail || "",
                                "BranchAddress": TempConsultationPlan.BranchAddress || "",
                                "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                "PreviousName": TempConsultationPlan.PatientArray[0].PreviousName || "",
                                "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                                "emailAddresses": TempConsultationPlan.emailAddresses || '',
                                "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                                "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
                                "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
                                "TitleId": TempConsultationPlan.PatientArray[0].TitleId || "",
                                "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
                                "PatientGst": TempConsultationPlan.AppointmentId || "",
                                "PatientPhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                                "ContactNo": TempConsultationPlan.PatientArray[0].ContactNo || "",
                                "PatientDOB": TempConsultationPlan.PatientArray[0].DOB || "",
                                "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                                "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                                "ChiefComplaints": [],
                                "ImplantList": [],
                                "Vitals": TempConsultationPlan.Vitals || [],
                                "OccularHistory": TempConsultationPlan.OccularHistory || [],
                                "AllergyItems": TempConsultationPlan.AllergyItems || [],
                                "MedicalConditions": [],
                                "OccularSurgicalHistory": TempConsultationPlan.OccularSurgicalHistory || [],
                                "CurrentEyeMedications": TempConsultationPlan.CurrentEyeMedications || [],
                                "SystemicHistory": TempConsultationPlan.SystemicHistory || [],
                                "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                                "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                                "BirthHistory": TempConsultationPlan.BirthHistory || [],
                                "FamilyHistory": TempConsultationPlan.FamilyHistory || [],
                                "FunctionalStatusHistory": TempConsultationPlan.FunctionalStatusHistory || [],
                                "VaccinationHistory": TempConsultationPlan.VaccinationHistory || [],
                                "NutritionalHistory": TempConsultationPlan.NutritionalHistory || [],
                                "MenstrualHistory": TempConsultationPlan.MenstrualHistory || [],
                                "HealthConcerns": TempConsultationPlan.PatientHealthConcerns || [],
                                "HealthGoals": TempConsultationPlan.PatientGoals || [],
                                "LifestyleHistory": TempConsultationPlan.LifestyleHistory || [],
                                "VisionDetails": TempConsultationPlan.VisionDetails || [],
                                "AutoRefractionDetails": TempConsultationPlan.AutoRefractionArray || [],
                                "RetinoscopyRefractionDetails": TempConsultationPlan.RetinoscopyRefractionArray || [],
                                "PGPRefractionDetails": TempConsultationPlan.PGPrefractionArray || [],
                                "ManifestRefractionDetails": TempConsultationPlan.ManifestRefractionArray || [],
                                "OverRefractionDetails": TempConsultationPlan.OverRefractionArray || [],
                                "CycloplegicRefractionDetails": TempConsultationPlan.CycloplegicRefractionArray || [],
                                "FinalGlassRxDetails": TempConsultationPlan.FinalGlassRxArray || [],
                                "TonoMetryDetails": TempConsultationPlan.Tonometry || [],
                                "PupilSizeDetails": TempConsultationPlan.PupilSizeDetails || [],
                                "PachymetryDetails": TempConsultationPlan.Pachymetry || [],
                                "GlareDetails": TempConsultationPlan.GlareArray || [],
                                "KeratometryDetails": TempConsultationPlan.KeratometryValues || [],
                                "ContactLensDetails": TempConsultationPlan.ContactLensDetails || [],
                                "AnteriorSegmentArrayNew": TempConsultationPlan.AnteriorSegmentDetails || [],
                                "PosteriorSegmentDetails": TempConsultationPlan.PosteriorSegmentDetails || [],
                                "NineGazeExtraOcularDetails": TempConsultationPlan.NineGazeExtraOcularDetails || [],
                                "SquintDetails": TempConsultationPlan.SquintDetails || [],
                                "GlassDetails": TempConsultationPlan.GlassDetails || [],
                                "OPProceduresArray": TempConsultationPlan.OPProceduresArray || [],
                                "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
                                "DryEyeEvalutionDetails": TempConsultationPlan.DryEyeEvaluationData || [],
                                //"SquintPossibleDiagnosisArray": TempConsultationPlan.SquintPossibleDiagnosisArray || [],
                                //"BVPossibleDiagnosisArray": TempConsultationPlan.BVPossibleDiagnosisArray || [],
                                "ColorVisionDetails": TempConsultationPlan.ColorVisionDetails || [],
                                "LacrimalPatiencyDetails": TempConsultationPlan.LacrimalPatiencyDetails || [],
                                "GonioscopyDetails": TempConsultationPlan.GonioscopyDetails || [],
                                "PrescriptionDetails": TempConsultationPlan.PatientPrescription.PrescriptionDetails || [],
                                "AssessmentPlan": TempConsultationPlan.AssessmentPlan || [],
                                "InvestigationsDetails": TempConsultationPlan.InvestigationsDetails || [],
                                "SurgeriesDetails": TempConsultationPlan.SurgeriesDetails || [],
                                "ProceduresDetails": TempConsultationPlan.ProceduresDetails || [],
                                "ReferralDetails": TempConsultationPlan.ReferralDetails || [],
                                "HeadPosterDetails": TempConsultationPlan.HeadPosterDetails || [],
                                "NearInvestigationdetails": TempConsultationPlan.NearInvestigationdetails || [],
                                "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
                                "PupilSizeRemarks": TempConsultationPlan.PupilSizeRemarks || "",
                                "PachymetryRemarks": TempConsultationPlan.PachymetryRemarks || "",
                                "DilationArray": TempConsultationPlan.DilationArray || [],
                                "LabInvestigations": TempConsultationPlan.LabInvestigations || [],
                                "PhysicalEvaluation": TempConsultationPlan.CustomAllergyRemarks || [],
                                "PsychiatryData": TempConsultationPlan.PsychiatryData || [],
                                "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
                                "OPProcedures": TempConsultationPlan.OPProceduresArray || [],
                                "CurrentSystemicHistory": TempConsultationPlan.CurrentSystemicMedicationsHistory || [],
                                "ROSAllergyHeaders": $scope.cacheStorageItem.ROSAllergyHeaders || [],
                                "IsNKISelected": IsNKISelected || "",
                                "PsychologicalObservations": $scope.ScoreObject,
                                "labinvestigationNotes": TempConsultationPlan.labinvestigationNotes || "",
                                "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || ""
                            }
                            req.isSendRefLetterMail = false;
                            if (TempConsultationPlan.ChiefComplaints.length > 0) {
                                angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
                                    var checifobj = {
                                        "ChiefComplaintId": Citems.ChiefComplaintId || 0,
                                        "ChiefComplaintName": Citems.ChiefComplaintName || "",
                                        "Description": Citems.Description || "",
                                        "OrganId": Citems.OrganId || 0,
                                        "Duration": 1,
                                        "DurationType": Citems.DurationType || '',
                                        "Remarks": Citems.Remarks || "",
                                        "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                    }
                                    req.ChiefComplaints.push(checifobj);
                                })
                            }
                            TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
                            if (TempConsultationPlan.ImplantList.length > 0) {
                                angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
                                    var Impobj = {
                                        "DeviceDescription": ImpItem.DeviceDescription || 0,
                                        "Location": ImpItem.Location || "",
                                        "UDI": ImpItem.UDI || ""
                                    }
                                    req.ImplantList.push(Impobj);
                                })
                            }
                        }

                        eHnoteDiagnosisDataServices.GetDemoViewConsultationPdf(req).then(function (resp) {
                            if (resp.data.Message == 'Success') {
                                $scope.DemoConsultationPdfUrl = [];
                                $scope.DemoConsultationPdfUrl = resp.data.data || [];
                                $scope.DemoPdfLinkGenarate($scope.DemoConsultationPdfUrl);

                                /*$scope.GetPatientAllAppointmentDataExportInfo();*/
                            }
                            else {
                                $scope.eObj.IsChartPdfChecked = false;
                                alertify.error("pdf genaratoin is fails ");
                                return false;
                            }
                        })

                    }
                }, function (err) {
                    alertify.error(err.data.ExceptionMessage);
                });
            }
            else {
                $scope.eObj.pdfurl = "";
            }
        }
        $scope.DemoPdfLinkGenarate = function (DemoPfdLinkItems) {

            if (DemoPfdLinkItems != "") {
                if (DemoPfdLinkItems.Attachments.length > 0) {
                    angular.forEach(DemoPfdLinkItems.Attachments, function (item) {
                        $scope.eObj.pdfurl = item.S3Url;

                        console.log($scope.eObj.pdfurl);

                    });
                }
                else {
                    $scope.eObj.pdfurl = "";
                }
            } else {
                $scope.eObj.pdfurl = "";
            }
        }
        $scope.SendCCDAandPdfAttachmentsToMail = function () {

            if ($scope.eObj.DoctorEmail == '') {
                alertify.error("Enter To Email Address");
                return false;
            }
            if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
                if ($scope.eObj.Subject == '') {
                    alertify.error("Enter Subject ");
                    return false;
                }
            }

            if ($scope.eObj.TextBody == '') {
                alertify.error("Enter TextBody ");
                return false;
            }
            //if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
            //    alertify.error("Please Select atleast one check box");
            //    return false;
            //}

            if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
                var AppointmentId = $scope.eObj.AppointmentId;
                var ConsultationId = $scope.eObj.ConsultationId;
                var type = 0;
                if (ConsultationId === 0) {
                    type = 1;
                }
                var req = {
                    "AppointmentId": AppointmentId,
                    "Type": type,
                    "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0
                };
                eHnotePatientDataService.GetPatientConsultationDetailsByApptId(req).then(function (resp) {
                    if (resp.data != undefined) {
                        if (resp.data.length !== 0) {
                            $scope.ConsultationMailMsg = resp.data;
                            $scope.ConsultationDataByApptIdArray = [];
                            angular.forEach(resp.data, function (item) {
                                if (AppointmentId === item.AppointmentId) {
                                    // to show appointmnt date, time and doctor name
                                    let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                                    ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                                    item.AppointmentTime = ApptTime;
                                    $scope.ConsultationDataByApptIdArray.push(item);
                                }
                            });
                        }
                        if ($scope.ConsultationDataByApptIdArray.length > 0) {
                            var TempConsultationPlan = angular.copy($scope.ConsultationDataByApptIdArray[0]);
                            TempConsultationPlan.emailAddresses = $scope.eObj.DoctorEmail || "";
                            TempConsultationPlan.subject = $scope.eObj.Subject || "";
                            TempConsultationPlan.TextBody = $scope.eObj.TextBody || "";
                            TempConsultationPlan.IsChartCCDAChecked = $scope.eObj.IsChartCCDAChecked;
                            TempConsultationPlan.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;

                            var Conreq = {
                                "UserId": $scope.UserId,
                                "ConsultationId": TempConsultationPlan.ConsultationId || "",
                                "AppointmentId": TempConsultationPlan.AppointmentId || "",
                                "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                                "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                                "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
                                "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                                "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                                "DoctorId": TempConsultationPlan.DoctorId || "",
                                "DoctorName": TempConsultationPlan.Appointmentwith || "",
                                "isSendRefLetterMail": false,
                                "BranchId": TempConsultationPlan.BranchId || "",
                                "BranchName": TempConsultationPlan.BranchName || "",
                                "BranchPhone": TempConsultationPlan.BranchMobile || "",
                                "BranchEmail": TempConsultationPlan.BranchEmail || "",
                                "BranchAddress": TempConsultationPlan.BranchAddress || "",
                                "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                                "emailAddresses": TempConsultationPlan.emailAddresses || '',
                                "subject": TempConsultationPlan.subject || '',
                                "TextBody": TempConsultationPlan.TextBody || '',
                                "IsChartCCDAChecked": TempConsultationPlan.IsChartCCDAChecked,
                                "IsChartPdfChecked": TempConsultationPlan.IsChartPdfChecked,
                            }
                            Conreq.isSendRefLetterMail = false;
                            Conreq.IsMailFromWebApp = true;
                            eHnoteDiagnosisDataServices.SendConsultationMsgToMail(Conreq).then(function (resp) {
                                if (resp.data.Message = "Success") {
                                    alertify.success("Mail send Successfully");
                                    $scope.ClosePop();
                                }
                                else {
                                    alertify.success("Mail sending is Failed");
                                    return false;
                                }
                            });


                        }
                    }
                });
            }
            else {
                var AppointmentId = $scope.eObj.AppointmentId;
                var ConsultationId = $scope.eObj.ConsultationId;
                var type = 0;
                if (ConsultationId === 0) {
                    type = 1;
                }
                var req1 = {
                    "PatientId": $scope.cacheStorageItem.patientid,
                    "AppointmentId": AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId
                };
                var req2 = {
                    "AppointmentId": AppointmentId,
                    "Type": type,
                    "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0
                };
                $q.all([
                    eHnoteDiagnosisDataServices.GetCCDACreate(req1),
                    eHnotePatientDataService.GetPatientConsultationDetailsByApptId(req2),
                ]).then(function (resp) {
                    if (resp[0].data != "") {
                        $scope.eObj.CCDALink = resp[0].data;
                    }
                    if (resp[1].data.length !== 0) {
                        $scope.ConsultationDataByApptId = resp[1].data;
                        $scope.ConsultationDataByApptIdArray = [];

                        angular.forEach(resp[1].data, function (item) {
                            if (AppointmentId === item.AppointmentId) {
                                // to show appointmnt date, time and doctor name
                                let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                                ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                                item.AppointmentTime = ApptTime;
                                $scope.ConsultationDataByApptIdArray.push(item);
                            }
                        });
                    }

                    var IsNKISelected = $scope.cacheStorageItem.isNKISelected;
                    if ($scope.ConsultationDataByApptIdArray.length > 0) {
                        var TempConsultationPlan = angular.copy($scope.ConsultationDataByApptIdArray[0]);
                        TempConsultationPlan.emailAddresses = $scope.eObj.DoctorEmail || "";
                        TempConsultationPlan.IsChartCCDAChecked = $scope.eObj.IsChartCCDAChecked;
                        TempConsultationPlan.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                        TempConsultationPlan.IsMailFromPatientPortal = $scope.eObj.IsMailFromPatientPortal || "";
                        TempConsultationPlan.IsMailFromWebApp = $scope.eObj.IsMailFromWebApp || "";

                        var BranchMobile = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.BranchMobile);
                        TempConsultationPlan.BranchMobile = BranchMobile.UsFormatMobileNumber;

                        var PhoneNumber = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].PhoneNumber);
                        var ContactNo = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].ContactNo);
                        TempConsultationPlan.PatientArray[0].PhoneNumber = PhoneNumber.UsFormatMobileNumber;
                        if (TempConsultationPlan.PatientArray[0].ContactNo.length > 10) {
                            TempConsultationPlan.PatientArray[0].ContactNo = ContactNo.UsFormatMobileNumber;
                        } else {
                            TempConsultationPlan.PatientArray[0].ContactNo = "";
                        }
                        TempConsultationPlan.PatientArray[0].DOB = TempConsultationPlan.PatientArray[0].DOB || "";

                        var Conreq = {
                            "UserId": $scope.UserId,
                            "ConsultationId": TempConsultationPlan.ConsultationId || "",
                            "AppointmentId": TempConsultationPlan.AppointmentId || "",
                            "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                            "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                            "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
                            "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                            "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                            "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
                            "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
                            "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
                            "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
                            "ScribeName": TempConsultationPlan.ScribeName || "",
                            "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
                            "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
                            "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
                            "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
                            "StatusFlag": TempConsultationPlan.StatusFlag || "",
                            "RoleName": TempConsultationPlan.RoleName || "",
                            "DoctorId": TempConsultationPlan.DoctorId || "",
                            "DoctorName": TempConsultationPlan.Appointmentwith || "",
                            "isSendRefLetterMail": false,
                            "BranchId": TempConsultationPlan.BranchId || "",
                            "BranchName": TempConsultationPlan.BranchName || "",
                            "BVPossibleDiagnosis": TempConsultationPlan.BVPossibleDiagnosis || "",
                            "BranchArea": TempConsultationPlan.BranchArea || "",
                            "BranchPhoneNo": TempConsultationPlan.BranchMobile || "",
                            "BranchEmail": TempConsultationPlan.BranchEmail || "",
                            "BranchAddress": TempConsultationPlan.BranchAddress || "",
                            "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                            "PreviousName": TempConsultationPlan.PatientArray[0].PreviousName || "",
                            "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                            "emailAddresses": TempConsultationPlan.emailAddresses || '',
                            "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                            "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
                            "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
                            "TitleId": TempConsultationPlan.PatientArray[0].TitleId || "",
                            "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
                            "PatientGst": TempConsultationPlan.AppointmentId || "",
                            "PatientPhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                            "ContactNo": TempConsultationPlan.PatientArray[0].ContactNo || "",
                            "PatientDOB": TempConsultationPlan.PatientArray[0].DOB || "",
                            "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                            "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                            "ChiefComplaints": [],
                            "ImplantList": [],
                            "Vitals": TempConsultationPlan.Vitals || [],
                            "OccularHistory": TempConsultationPlan.OccularHistory || [],
                            "AllergyItems": TempConsultationPlan.AllergyItems || [],
                            "MedicalConditions": [],
                            "OccularSurgicalHistory": TempConsultationPlan.OccularSurgicalHistory || [],
                            "CurrentEyeMedications": TempConsultationPlan.CurrentEyeMedications || [],
                            "SystemicHistory": TempConsultationPlan.SystemicHistory || [],
                            "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                            "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                            "BirthHistory": TempConsultationPlan.BirthHistory || [],
                            "FamilyHistory": TempConsultationPlan.FamilyHistory || [],
                            "FunctionalStatusHistory": TempConsultationPlan.FunctionalStatusHistory || [],
                            "VaccinationHistory": TempConsultationPlan.VaccinationHistory || [],
                            "NutritionalHistory": TempConsultationPlan.NutritionalHistory || [],
                            "MenstrualHistory": TempConsultationPlan.MenstrualHistory || [],
                            "HealthConcerns": TempConsultationPlan.PatientHealthConcerns || [],
                            "HealthGoals": TempConsultationPlan.PatientGoals || [],
                            "LifestyleHistory": TempConsultationPlan.LifestyleHistory || [],
                            "VisionDetails": TempConsultationPlan.VisionDetails || [],
                            "AutoRefractionDetails": TempConsultationPlan.AutoRefractionArray || [],
                            "RetinoscopyRefractionDetails": TempConsultationPlan.RetinoscopyRefractionArray || [],
                            "PGPRefractionDetails": TempConsultationPlan.PGPrefractionArray || [],
                            "ManifestRefractionDetails": TempConsultationPlan.ManifestRefractionArray || [],
                            "OverRefractionDetails": TempConsultationPlan.OverRefractionArray || [],
                            "CycloplegicRefractionDetails": TempConsultationPlan.CycloplegicRefractionArray || [],
                            "FinalGlassRxDetails": TempConsultationPlan.FinalGlassRxArray || [],
                            "TonoMetryDetails": TempConsultationPlan.Tonometry || [],
                            "PupilSizeDetails": TempConsultationPlan.PupilSizeDetails || [],
                            "PachymetryDetails": TempConsultationPlan.Pachymetry || [],
                            "GlareDetails": TempConsultationPlan.GlareArray || [],
                            "KeratometryDetails": TempConsultationPlan.KeratometryValues || [],
                            "ContactLensDetails": TempConsultationPlan.ContactLensDetails || [],
                            "AnteriorSegmentArrayNew": TempConsultationPlan.AnteriorSegmentDetails || [],
                            "PosteriorSegmentDetails": TempConsultationPlan.PosteriorSegmentDetails || [],
                            "NineGazeExtraOcularDetails": TempConsultationPlan.NineGazeExtraOcularDetails || [],
                            "SquintDetails": TempConsultationPlan.SquintDetails || [],
                            "GlassDetails": TempConsultationPlan.GlassDetails || [],
                            "OPProceduresArray": TempConsultationPlan.OPProceduresArray || [],
                            "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
                            //"SquintPossibleDiagnosisArray": TempConsultationPlan.SquintPossibleDiagnosisArray || [],
                            //"BVPossibleDiagnosisArray": TempConsultationPlan.BVPossibleDiagnosisArray || [],
                            "DryEyeEvalutionDetails": TempConsultationPlan.DryEyeEvaluationData || [],
                            "ColorVisionDetails": TempConsultationPlan.ColorVisionDetails || [],
                            "LacrimalPatiencyDetails": TempConsultationPlan.LacrimalPatiencyDetails || [],
                            "GonioscopyDetails": TempConsultationPlan.GonioscopyDetails || [],
                            "PrescriptionDetails": TempConsultationPlan.PatientPrescription.PrescriptionDetails || [],
                            "AssessmentPlan": TempConsultationPlan.AssessmentPlan || [],
                            "InvestigationsDetails": TempConsultationPlan.InvestigationsDetails || [],
                            "SurgeriesDetails": TempConsultationPlan.SurgeriesDetails || [],
                            "ProceduresDetails": TempConsultationPlan.ProceduresDetails || [],
                            "ReferralDetails": TempConsultationPlan.ReferralDetails || [],
                            "IsChartCCDAChecked": TempConsultationPlan.IsChartCCDAChecked,
                            "IsChartPdfChecked": TempConsultationPlan.IsChartPdfChecked,
                            "subject": TempConsultationPlan.subject || '',
                            "TextBody": TempConsultationPlan.TextBody || '',
                            "NearInvestigationdetails": TempConsultationPlan.NearInvestigationdetails || [],
                            "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
                            "IsMailFromWebApp": TempConsultationPlan.IsMailFromWebApp || false,
                            "IsMailFromPatientPortal": TempConsultationPlan.IsMailFromPatientPortal || false,
                            "PupilSizeRemarks": TempConsultationPlan.PupilSizeRemarks || "",
                            "PachymetryRemarks": TempConsultationPlan.PachymetryRemarks || "",
                            "DilationArray": TempConsultationPlan.DilationArray || [],
                            "LabInvestigations": TempConsultationPlan.LabInvestigations || [],
                            "PhysicalEvaluation": TempConsultationPlan.CustomAllergyRemarks || [],
                            "PsychiatryData": TempConsultationPlan.PsychiatryData || [],
                            "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
                            "OPProcedures": TempConsultationPlan.OPProceduresArray || [],
                            "CurrentSystemicHistory": TempConsultationPlan.CurrentSystemicMedicationsHistory || [],
                            "ROSAllergyHeaders": $scope.cacheStorageItem.ROSAllergyHeaders || [],
                            "IsNKISelected": IsNKISelected,
                            "PsychologicalObservations": $scope.ScoreObject,
                            "labinvestigationNotes": TempConsultationPlan.labinvestigationNotes || "",
                            "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || ""
                        }
                        Conreq.isSendRefLetterMail = false;
                        if (TempConsultationPlan.ChiefComplaints.length > 0) {
                            angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
                                var checifobj = {
                                    "ChiefComplaintId": Citems.ChiefComplaintId || 0,
                                    "ChiefComplaintName": Citems.ChiefComplaintName || "",
                                    "Description": Citems.Description || "",
                                    "OrganId": Citems.OrganId || 0,
                                    "Duration": 1,
                                    "DurationType": Citems.DurationType || '',
                                    "Remarks": Citems.Remarks || "",
                                    "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                }
                                Conreq.ChiefComplaints.push(checifobj);
                            })
                        }

                        TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
                        if (TempConsultationPlan.ImplantList.length > 0) {
                            angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
                                var Impobj = {
                                    "DeviceDescription": ImpItem.DeviceDescription || 0,
                                    "Location": ImpItem.Location || "",
                                    "UDI": ImpItem.UDI || ""
                                }
                                Conreq.ImplantList.push(Impobj);
                            })
                        }
                    }
                    //Pdf Mail Sending
                    if ($scope.eObj.IsChartPdfChecked) {
                        Conreq = Conreq || "";
                        Conreq.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                    }
                    else {
                        Conreq.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                    }
                    //CCDA Link 
                    if ($scope.eObj.IsChartCCDAChecked) {
                        Conreq.CCDALink = $scope.eObj.CCDALink;
                        //  Conreq.CCDALink = "https://ehnotedevstorage.blob.core.windows.net/dev/3/Attachment/Send/PRD0104449-20231003134544.xml";
                        Conreq.IsChartCCDAChecked = $scope.eObj.IsChartCCDAChecked;
                    } else {
                        Conreq.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                        Conreq.CCDALink = "";
                    }
                    if ($scope.eObj.TextBody != "") {
                        Conreq.EmailBody = $scope.eObj.TextBody || "";
                    } else {
                        Conreq.EmailBody = "";
                    }

                    Conreq.IsMailFromWebApp = true;
                    Conreq.IsMailFromPatientPortal = false;
                    eHnoteDiagnosisDataServices.GetSendConsultationPdfCCDAAttachmentToMail(Conreq).then(function (resp) {
                        if (resp.data.Message == "Success") {
                            alertify.success("Mail send Successfully");
                            $scope.ClosePop();
                        }
                    });
                }, function (err) {
                    console.log(err);
                    alertify.error("Getting Data Failed");
                });
            }

        }

        $scope.ShowAdditionInfo = function (item) {
            item = item || "";
            item.AdditionalInformation = !item.AdditionalInformation;
        }
        $scope.ConsultationPdfSendingData = function () {

            var AppointmentId = $scope.eObj.AppointmentId;
            var ConsultationId = $scope.eObj.ConsultationId;
            var type = 0;
            if (ConsultationId === 0) {
                type = 1;
            }
            var object = {
                "AppointmentId": AppointmentId,
                "Type": type,
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0
            };
            eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                if (resp.data !== undefined) {
                    $scope.ConsultationDataByApptId = resp.data;
                    $scope.ConsultationDataByApptIdArray = [];

                    angular.forEach(resp.data, function (item) {
                        if (AppointmentId === item.AppointmentId) {
                            // to show appointmnt date, time and doctor name
                            let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                            ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                            item.AppointmentTime = ApptTime;
                            $scope.ConsultationDataByApptIdArray.push(item);
                        }
                    });
                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        }

        $scope.PHIEmailUserArray = [
            { "Id": 1, "Value": "ehnote@test.directproject.net" },
            { "Id": 2, "Value": "ehnote-edge2015@directtest.interopengine.com" },

        ]
        function getSendEmailEmptyRequestObj() {

            var CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "AppointmentId": 0,
                "DirectSecureMessageId": 0,
                "FromEmail": "",
                "ToEmail": "",
                "RecipientAddress": "",
                "MessageType": "Transaction of Care",
                "MessageTypeId": 1,
                "EmailBody": "",
                "EmailSubject": "",
                "USPhiMailUser": "ehnote@test.directproject.net",
                "Status": "Pending",
                "StatusId": 1,
                "ExternalStatus": "Pending",
                "ExternalMessageId": "",
                "CreatedByUser": CreatedByName,
                "CreatedDate": $scope.currentdate,
                "EmailType": "Send",
                "EmailTypeId": 1,
                "DeleteInd": "N",
                "AttachmentsArray": [],
                "IsChartCCDAChecked": false,
                "IsChartPdfChecked": false,
                "IsMailFromWebApp": true,
                "IsMailFromPatientPortal": false,
                "AppointmentReferalId": "",
                "DocumentType": ""
            }
            return obj;
        }

        $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();

        $scope.SendPHIEmail = function (ApptReferalId) {


            if ($scope.newSendEmailReqObj.ToEmail == '') {
                alertify.error("Enter To Email");
                return false;
            }
            if ($scope.newSendEmailReqObj.EmailSubject == '') {
                alertify.error("Enter Subject");
                return false;
            }
            if ($scope.newSendEmailReqObj.EmailBody == '') {
                alertify.error("Enter Email Body");
                return false;
            }
            $scope.newSendEmailReqObj.AppointmentReferalId = ApptReferalId || "";

            console.log($scope.newSendEmailReqObj);
            eHnoteDiagnosisDataServices.SendPhiEmailData($scope.newSendEmailReqObj).then(function (response) {

                console.log(JSON.stringify(response))
                if (response.data.status === 'Success') {
                    $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();
                    alertify.success("Email Sent Successfully");
                    $scope.mInstanceAdd.dismiss("cancel");
                } else {
                    alertify.success("Some Error Occurred");
                }

            });
        };

        $scope.CCDACreationOptions = {
            "Allergies": true,
            "Problems": true,
            "Procedure": true,
            "Careplan": true,
            "Careteam": true,
            "Immunization": true,
            "HealthConcerns": true,
            "HealthGoals": true,
            "Prescription": true,
            "MedictionStatement": true,
            "Vitals": true,
            "Referrals": true,
            "Encounter": true,
            "MentalStatus": true,
            "SmokingStatus": true,
            "AssessmentPlan": true,
            "DischargeInstructions": true,
            "DischargeMedications": true,
            "LabInvestigations": true,
            "TreatmentPlan": true
        };
        $scope.getAttachmentFromtheSelectedData = function (Ind) {
            if (Ind) {

                var type = 0;
                var obj = {
                    "PatientId": $scope.newSendEmailReqObj.PatientId,
                    "AppointmentId": $scope.newSendEmailReqObj.AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId,
                    "Allergies": $scope.CCDACreationOptions.Allergies,
                    "Problems": $scope.CCDACreationOptions.Problems,
                    "Procedure": $scope.CCDACreationOptions.Procedure,
                    "Careplan": $scope.CCDACreationOptions.Careplan,
                    "Careteam": $scope.CCDACreationOptions.Careteam,
                    "Immunization": $scope.CCDACreationOptions.Immunization,
                    "HealthConcerns": $scope.CCDACreationOptions.HealthConcerns,
                    "HealthGoals": $scope.CCDACreationOptions.HealthGoals,
                    "Prescription": $scope.CCDACreationOptions.Prescription,
                    "MedictionStatement": $scope.CCDACreationOptions.MedictionStatement,
                    "Vitals": $scope.CCDACreationOptions.Vitals,
                    "Referrals": $scope.CCDACreationOptions.Referrals,
                    "Encounter": $scope.CCDACreationOptions.Encounter,
                    "MentalStatus": $scope.CCDACreationOptions.MentalStatus,
                    "SmokingStatus": $scope.CCDACreationOptions.SmokingStatus,
                    "AssessmentPlan": $scope.CCDACreationOptions.AssessmentPlan,
                    "DischargeInstructions": $scope.CCDACreationOptions.DischargeInstructions,
                    "DischargeMedications": $scope.CCDACreationOptions.DischargeMedications,
                    "LabInvestigations": $scope.CCDACreationOptions.LabInvestigations,
                    "TreatmentPlan": $scope.CCDACreationOptions.TreatmentPlan
                };

                eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                    if (resp.data != null) {
                        if (resp.data != "") {
                            let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                            var patname = appointmentinfonew.PatientDetails.FullName.replace(/ /g, "");
                            var attachmentObj = {
                                "FileId": 0,
                                "FileName": patname + "_" + "Attachment",
                                "S3URL": resp.data,
                                "ExternalFileName": patname + "_" + "Attachment",
                                "FileExt": ".xml",
                                "MimeType": "application/xml",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0
                            }
                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj);

                        } else {

                        }
                    }
                });
            }
            else {
                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.FileExt == '.xml') {
                            if (index > -1) {
                                $scope.newSendEmailReqObj.AttachmentsArray.splice(index);
                            }
                        }

                    });
                }
            }

        };
        $scope.getAttachmentFromtheSelectedDataNew = function (val) {

            angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                item.IsRemoved = false;
            });
            if (val === "CCD") {

                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.DocumentType == 'Referral' && item.FileExt == '.xml') {
                            item.IsRemoved = true;
                        }

                    });

                    let tempArray = $filter('filter')($scope.newSendEmailReqObj.AttachmentsArray, { 'IsRemoved': false }, true);
                    $scope.newSendEmailReqObj.AttachmentsArray = angular.copy(tempArray);
                }

                var type = 0;
                var obj = {
                    "PatientId": $scope.newSendEmailReqObj.PatientId,
                    "AppointmentId": $scope.newSendEmailReqObj.AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId,
                    "Allergies": $scope.CCDACreationOptions.Allergies,
                    "Problems": $scope.CCDACreationOptions.Problems,
                    "Procedure": $scope.CCDACreationOptions.Procedure,
                    "Careplan": $scope.CCDACreationOptions.Careplan,
                    "Careteam": $scope.CCDACreationOptions.Careteam,
                    "Immunization": $scope.CCDACreationOptions.Immunization,
                    "HealthConcerns": $scope.CCDACreationOptions.HealthConcerns,
                    "HealthGoals": $scope.CCDACreationOptions.HealthGoals,
                    "Prescription": $scope.CCDACreationOptions.Prescription,
                    "MedictionStatement": $scope.CCDACreationOptions.MedictionStatement,
                    "Vitals": $scope.CCDACreationOptions.Vitals,
                    "Referrals": $scope.CCDACreationOptions.Referrals,
                    "Encounter": $scope.CCDACreationOptions.Encounter,
                    "MentalStatus": $scope.CCDACreationOptions.MentalStatus,
                    "SmokingStatus": $scope.CCDACreationOptions.SmokingStatus,
                    "AssessmentPlan": $scope.CCDACreationOptions.AssessmentPlan,
                    "DischargeInstructions": $scope.CCDACreationOptions.DischargeInstructions,
                    "DischargeMedications": $scope.CCDACreationOptions.DischargeMedications,
                    "LabInvestigations": $scope.CCDACreationOptions.LabInvestigations,
                    "TreatmentPlan": $scope.CCDACreationOptions.TreatmentPlan,
                    "DocumentType": "CCD"
                };

                eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                    if (resp.data != null) {
                        if (resp.data != "") {
                            let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                            var patname = appointmentinfonew.PatientDetails.FullName.replace(/ /g, "");
                            var attachmentObj = {
                                "FileId": 0,
                                "FileName": patname + "_" + "Attachment",
                                "S3URL": resp.data,
                                "ExternalFileName": patname + "_" + "Attachment",
                                "FileExt": ".xml",
                                "MimeType": "application/xml",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0,
                                "DocumentType": "CCD"
                            }
                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj);

                        } else {

                        }
                    }
                });
            } else if (val === "Referral") {

                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.DocumentType == 'CCD' && item.FileExt == '.xml') {
                            item.IsRemoved = true;
                        }
                    });

                    let tempArray = $filter('filter')($scope.newSendEmailReqObj.AttachmentsArray, { 'IsRemoved': false }, true);
                    $scope.newSendEmailReqObj.AttachmentsArray = angular.copy(tempArray);
                }

                var type = 0;
                var obj = {
                    "PatientId": $scope.newSendEmailReqObj.PatientId,
                    "AppointmentId": $scope.newSendEmailReqObj.AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId,
                    "Allergies": $scope.CCDACreationOptions.Allergies,
                    "Problems": $scope.CCDACreationOptions.Problems,
                    "Procedure": $scope.CCDACreationOptions.Procedure,
                    "Careplan": $scope.CCDACreationOptions.Careplan,
                    "Careteam": $scope.CCDACreationOptions.Careteam,
                    "Immunization": $scope.CCDACreationOptions.Immunization,
                    "HealthConcerns": $scope.CCDACreationOptions.HealthConcerns,
                    "HealthGoals": $scope.CCDACreationOptions.HealthGoals,
                    "Prescription": $scope.CCDACreationOptions.Prescription,
                    "MedictionStatement": $scope.CCDACreationOptions.MedictionStatement,
                    "Vitals": $scope.CCDACreationOptions.Vitals,
                    "Referrals": $scope.CCDACreationOptions.Referrals,
                    "Encounter": $scope.CCDACreationOptions.Encounter,
                    "MentalStatus": $scope.CCDACreationOptions.MentalStatus,
                    "SmokingStatus": $scope.CCDACreationOptions.SmokingStatus,
                    "AssessmentPlan": $scope.CCDACreationOptions.AssessmentPlan,
                    "DischargeInstructions": $scope.CCDACreationOptions.DischargeInstructions,
                    "DischargeMedications": $scope.CCDACreationOptions.DischargeMedications,
                    "LabInvestigations": $scope.CCDACreationOptions.LabInvestigations,
                    "TreatmentPlan": $scope.CCDACreationOptions.TreatmentPlan,
                    "DocumentType": "Referral"
                };

                eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                    if (resp.data != null) {
                        if (resp.data != "") {
                            let appointmentinfonew = eHnoteMasterDataService.getAppointmentInfo();
                            var patname = appointmentinfonew.PatientDetails.FullName.replace(/ /g, "");
                            var attachmentObj = {
                                "FileId": 0,
                                "FileName": patname + "_" + "Attachment",
                                "S3URL": resp.data,
                                "ExternalFileName": patname + "_" + "Attachment",
                                "FileExt": ".xml",
                                "MimeType": "application/xml",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0,
                                "DocumentType": "Referral"
                            }
                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj);

                        } else {

                        }
                    }
                });
            } else if (val === "") {
                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.FileExt == '.xml') {
                            item.IsRemoved = true;
                        }

                    });

                    let tempArray = $filter('filter')($scope.newSendEmailReqObj.AttachmentsArray, { 'IsRemoved': false }, true);
                    $scope.newSendEmailReqObj.AttachmentsArray = angular.copy(tempArray);

                }
            }
            //else {
            //    if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
            //        angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
            //            if (item.FileExt == '.xml') {
            //                if (index > -1) {
            //                    $scope.newSendEmailReqObj.AttachmentsArray.splice(index);
            //                }
            //            }

            //        });
            //    }
            //}

        };

        $scope.removeAttachment = function (item) {
            let index = $scope.newSendEmailReqObj.AttachmentsArray.indexOf(item);
            if (index > -1) {
                $scope.newSendEmailReqObj.AttachmentsArray.splice(index, 1);
            }

            if ($scope.newSendEmailReqObj.AttachmentsArray.length === 0) {
                $scope.newSendEmailReqObj.DocumentType = "";
                $scope.newSendEmailReqObj.IsChartPdfChecked = false;
            }
        };


        $scope.viewAttachment = function (item) {
            var url = item.S3URL;
            window.open(url);
        };


        $scope.GetPdfGenerate = function (Ind) {
            if (Ind) {
                var object = {
                    "AppointmentId": $scope.newSendEmailReqObj.AppointmentId,
                    "Type": 0,
                    "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0
                };
                eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                    if (resp.data !== undefined) {
                        $scope.treatmentData = resp.data;

                        var TempConsultationPlan = angular.copy($scope.treatmentData[0]);
                        var BranchMobile = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.BranchMobile);
                        TempConsultationPlan.BranchMobile = BranchMobile.UsFormatMobileNumber;

                        var PhoneNumber = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].PhoneNumber);
                        var ContactNo = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].ContactNo);
                        TempConsultationPlan.PatientArray[0].PhoneNumber = PhoneNumber.UsFormatMobileNumber;
                        if (TempConsultationPlan.PatientArray[0].ContactNo.length > 10) {
                            TempConsultationPlan.PatientArray[0].ContactNo = ContactNo.UsFormatMobileNumber;
                        } else {
                            TempConsultationPlan.PatientArray[0].ContactNo = "";
                        }
                        TempConsultationPlan.PatientArray[0].DOB = TempConsultationPlan.PatientArray[0].DOB || "";

                        var req = {
                            "UserId": $scope.UserId,
                            "ConsultationId": TempConsultationPlan.ConsultationId || "",
                            "AppointmentId": TempConsultationPlan.AppointmentId || "",
                            "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                            "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                            "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
                            "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                            "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                            "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
                            "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
                            "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
                            "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
                            "ScribeName": TempConsultationPlan.ScribeName || "",
                            "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
                            "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
                            "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
                            "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
                            "StatusFlag": TempConsultationPlan.StatusFlag || "",
                            "RoleName": TempConsultationPlan.RoleName || "",
                            "DoctorId": TempConsultationPlan.DoctorId || "",
                            "DoctorName": TempConsultationPlan.Appointmentwith || "",
                            "isSendRefLetterMail": false,
                            "BranchId": TempConsultationPlan.BranchId || "",
                            "BranchName": TempConsultationPlan.BranchName || "",
                            "BranchPhoneNo": TempConsultationPlan.BranchMobile || "",
                            "BranchArea": TempConsultationPlan.BranchArea || "",
                            "BranchAddress": TempConsultationPlan.BranchAddress || "",
                            "BranchEmail": TempConsultationPlan.BranchEmail || "",
                            "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                            "PreviousName": TempConsultationPlan.PatientArray[0].PreviousName || "",
                            "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                            "emailAddresses": TempConsultationPlan.emailAddresses || '',
                            "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                            "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
                            "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
                            "TitleId": TempConsultationPlan.PatientArray[0].TitleId || "",
                            "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
                            "PatientGst": TempConsultationPlan.AppointmentId || "",
                            "PhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                            "PatientPhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                            "ContactNo": TempConsultationPlan.PatientArray[0].ContactNo || "",
                            "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                            "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                            "ChiefComplaints": [],
                            "ImplantList": [],
                            "Vitals": TempConsultationPlan.Vitals || [],
                            "OccularHistory": TempConsultationPlan.OccularHistory || [],
                            "AllergyItems": TempConsultationPlan.AllergyItems || [],
                            "MedicalConditions": [],
                            "OccularSurgicalHistory": TempConsultationPlan.OccularSurgicalHistory || [],
                            "CurrentEyeMedications": TempConsultationPlan.CurrentEyeMedications || [],
                            "SystemicHistory": TempConsultationPlan.SystemicHistory || [],
                            "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                            "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                            "BirthHistory": TempConsultationPlan.BirthHistory || [],
                            "FamilyHistory": TempConsultationPlan.FamilyHistory || [],
                            "FunctionalStatusHistory": TempConsultationPlan.FunctionalStatusHistory || [],
                            "VaccinationHistory": TempConsultationPlan.VaccinationHistory || [],
                            "NutritionalHistory": TempConsultationPlan.NutritionalHistory || [],
                            "MenstrualHistory": TempConsultationPlan.MenstrualHistory || [],
                            "HealthConcerns": TempConsultationPlan.PatientHealthConcerns || [],
                            "HealthGoals": TempConsultationPlan.PatientGoals || [],
                            "LifestyleHistory": TempConsultationPlan.LifestyleHistory || [],
                            "VisionDetails": TempConsultationPlan.VisionDetails || [],
                            "AutoRefractionDetails": TempConsultationPlan.AutoRefractionArray || [],
                            "RetinoscopyRefractionDetails": TempConsultationPlan.RetinoscopyRefractionArray || [],
                            "PGPRefractionDetails": TempConsultationPlan.PGPrefractionArray || [],
                            "ManifestRefractionDetails": TempConsultationPlan.ManifestRefractionArray || [],
                            "OverRefractionDetails": TempConsultationPlan.OverRefractionArray || [],
                            "CycloplegicRefractionDetails": TempConsultationPlan.CycloplegicRefractionArray || [],
                            "FinalGlassRxDetails": TempConsultationPlan.FinalGlassRxArray || [],
                            "TonoMetryDetails": TempConsultationPlan.Tonometry || [],
                            "PupilSizeDetails": TempConsultationPlan.PupilSizeDetails || [],
                            "PachymetryDetails": TempConsultationPlan.Pachymetry || [],
                            "GlareDetails": TempConsultationPlan.GlareArray || [],
                            "KeratometryDetails": TempConsultationPlan.KeratometryValues || [],
                            "ContactLensDetails": TempConsultationPlan.ContactLensDetails || [],
                            "AnteriorSegmentArrayNew": TempConsultationPlan.AnteriorSegmentDetails || [],
                            "PosteriorSegmentDetails": TempConsultationPlan.PosteriorSegmentDetails || [],
                            "NineGazeExtraOcularDetails": TempConsultationPlan.NineGazeExtraOcularDetails || [],
                            "SquintDetails": TempConsultationPlan.SquintDetails || [],
                            "GlassDetails": TempConsultationPlan.GlassDetails || [],
                            "OPProceduresArray": TempConsultationPlan.OPProceduresArray || [],
                            "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
                            //"SquintPossibleDiagnosisArray": TempConsultationPlan.SquintPossibleDiagnosisArray || [],
                            //"BVPossibleDiagnosisArray": TempConsultationPlan.BVPossibleDiagnosisArray || [],
                            "DryEyeEvalutionDetails": TempConsultationPlan.DryEyeEvaluationData || [],
                            "ColorVisionDetails": TempConsultationPlan.ColorVisionDetails || [],
                            "LacrimalPatiencyDetails": TempConsultationPlan.LacrimalPatiencyDetails || [],
                            "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
                            "GonioscopyDetails": TempConsultationPlan.GonioscopyDetails || [],
                            "PrescriptionDetails": TempConsultationPlan.PatientPrescription.PrescriptionDetails || [],
                            "AssessmentPlan": TempConsultationPlan.AssessmentPlan || [],
                            "InvestigationsDetails": TempConsultationPlan.InvestigationsDetails || [],
                            "SurgeriesDetails": TempConsultationPlan.SurgeriesDetails || [],
                            "ProceduresDetails": TempConsultationPlan.ProceduresDetails || [],
                            "ReferralDetails": TempConsultationPlan.ReferralDetails || [],
                            "HeadPosterDetails": TempConsultationPlan.HeadPosterDetails || [],
                            "PatientDOB": TempConsultationPlan.PatientArray[0].DOB || "",
                            "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
                            "labinvestigationNotes": TempConsultationPlan.labinvestigationNotes,
                            "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || ""
                        }
                        req.isSendRefLetterMail = false;
                        if (TempConsultationPlan.ChiefComplaints.length > 0) {
                            angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
                                var checifobj = {
                                    "ChiefComplaintId": Citems.ChiefComplaintId || 0,
                                    "ChiefComplaintName": Citems.ChiefComplaintName || "",
                                    "Description": Citems.Description || "",
                                    "OrganId": Citems.OrganId || 0,
                                    "Duration": 1,
                                    "DurationType": Citems.DurationType || '',
                                    "Remarks": Citems.Remarks || "",
                                    "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                }
                                req.ChiefComplaints.push(checifobj);
                            })
                        }

                        TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
                        if (TempConsultationPlan.ImplantList.length > 0) {
                            angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
                                var Impobj = {
                                    "DeviceDescription": ImpItem.DeviceDescription || 0,
                                    "Location": ImpItem.Location || "",
                                    "UDI": ImpItem.UDI || ""
                                }
                                req.ImplantList.push(Impobj);
                            })
                        }

                        eHnoteDiagnosisDataServices.GetDemoViewConsultationPdf(req).then(function (resp) {
                            if (resp.data.Message == 'Success') {
                                $scope.DemoConsultationPdfUrl = [];
                                $scope.DemoConsultationPdfUrl = resp.data.data || [];
                                if ($scope.DemoConsultationPdfUrl.Attachments.length > 0) {
                                    angular.forEach($scope.DemoConsultationPdfUrl.Attachments, function (item) {
                                        var patname = TempConsultationPlan.PatientArray[0].FullName.replace(/ /g, "");
                                        var attachmentObj = {
                                            "FileId": 0,
                                            "FileName": patname + "_" + "Attachment",
                                            "S3URL": item.S3Url,
                                            "ExternalFileName": patname + "_" + "Attachment",
                                            "FileExt": item.FileExt,
                                            "MimeType": "application/pdf",
                                            "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                            "CreatedDate": $scope.currentdate,
                                            "DeleteInd": "N",
                                            "DirectSecureMessageId": 0
                                        }
                                        $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj);
                                    })
                                    $scope.EmailSubTab = 1;

                                }
                            }
                        })

                    }
                }, function (err) {
                    alertify.error(err.data.ExceptionMessage);
                });
            }
            else {
                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.FileExt == '.pdf') {
                            if (index > -1) {
                                $scope.newSendEmailReqObj.AttachmentsArray.splice(index);
                            }
                        }

                    });
                }

            }
        }


        $scope.changeAppointmentReferalManual = function (val) {

            if (val) {
                $scope.appointmentReferalElectronic = false;
                $scope.appointmentReferalManual = true;
            }
        };
        $scope.changeAppointmentReferalElectronic = function (val) {
            if (val) {
                $scope.appointmentReferalManual = false;
                $scope.appointmentReferalElectronic = true;
            }
        };

        $scope.sendApptReferral = function (item) {


            $scope.eObj = getEmailReqObj();
            $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();
            $scope.eObj.AppointmentId = item.AppointmentId;
            $scope.eObj.ConsultationId = item.ConsultationId;
            $scope.eObj.PatientId = item.PatientArray[0].PatientId;
            $scope.eObj.DoctorId = item.DoctorId;
            $scope.newSendEmailReqObj.AppointmentId = item.AppointmentId;
            $scope.newSendEmailReqObj.PatientId = item.PatientArray[0].PatientId;

            console.log(item);

            var obj = {
                "UserId": $scope.UserId,
                "AppointmentId": item.AppointmentId,
                "PatientId": item.PatientArray[0].PatientId,
                "Item": item
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/ReferAppointmentPatient.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__eighty--",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject, eHnoteUserDataService) {


                    console.log(mainObject);


                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };


                    $scope.ClearDetails = function () {
                        //$uibModalInstance.close("save");
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.appointmentReferalManual = false;
                    $scope.appointmentReferalElectronic = false;


                    $scope.addUpdateAppointmentReqObj = {
                        "UserId": mainObject.UserId,
                        "AppointmentId": mainObject.AppointmentId,
                        "PatientId": mainObject.PatientId,
                        "AppointmentReferalId": 0,
                        "ReferalTypeId": 0,
                        "ReferalType": "",
                        "ReferalEmailId": "",
                        "ReferalDoctorName": "",
                        "ReferalOrganizationName": "",
                        "ReferalNote": "",
                    }






                    $scope.SaveReferalAppointment = function () {

                        var ReferalTypeId = 0, ReferalType = "";

                        if ($scope.appointmentReferalManual) {
                            ReferalTypeId = 1;
                            ReferalType = "Manual";
                        }

                        if ($scope.appointmentReferalElectronic) {
                            ReferalTypeId = 2;
                            ReferalType = "Electronic";


                            if ($scope.eObj.NormalEmail == 1) {

                                if ($scope.eObj.DoctorEmail == '') {
                                    alertify.error("Enter To Email Address");
                                    return false;
                                } else {
                                    $scope.addUpdateAppointmentReqObj.ReferalEmailId = $scope.eObj.DoctorEmail;
                                }
                                if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
                                    if ($scope.eObj.Subject == '') {
                                        alertify.error("Enter Subject ");
                                        return false;
                                    }
                                }

                                if ($scope.eObj.TextBody == '') {
                                    alertify.error("Enter TextBody ");
                                    return false;
                                }
                            }
                            else {
                                if ($scope.newSendEmailReqObj.ToEmail == '') {
                                    alertify.error("Enter To Email");
                                    return false;
                                } else {
                                    $scope.addUpdateAppointmentReqObj.ReferalEmailId = $scope.newSendEmailReqObj.ToEmail;
                                }
                                if ($scope.newSendEmailReqObj.EmailSubject == '') {
                                    alertify.error("Enter Subject");
                                    return false;
                                }
                                if ($scope.newSendEmailReqObj.EmailBody == '') {
                                    alertify.error("Enter Email Body");
                                    return false;
                                }
                            }
                        }

                        var params = {
                            "UserId": mainObject.UserId,
                            "AppointmentId": mainObject.AppointmentId,
                            "PatientId": mainObject.PatientId,
                            "AppointmentReferalId": 0,
                            "ReferalTypeId": ReferalTypeId,
                            "ReferalType": ReferalType,
                            "ReferalEmailId": $scope.addUpdateAppointmentReqObj.ReferalEmailId,
                            "ReferalDoctorName": $scope.addUpdateAppointmentReqObj.ReferalDoctorName,
                            "ReferalOrganizationName": $scope.addUpdateAppointmentReqObj.ReferalOrganizationName,
                            "ReferalNote": $scope.addUpdateAppointmentReqObj.ReferalNote,
                            "ReferalEmailSubject": $scope.newSendEmailReqObj.EmailSubject,
                            "ReferalEmailBody": $scope.newSendEmailReqObj.EmailBody,

                        }
                        eHnoteMainAppointmentService.AddUpdateAppointmentReminderDetails(params).then(function (resp) {

                            console.log(resp);

                            if (resp.data.status == "success") {
                                $uibModalInstance.close(resp);
                            } else {
                                alertify.error("Appointment Already Exists For This Patient");
                            }
                        }, function (err) {
                            alertify.error("Getting Failed");
                        })
                    }
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                $scope.ReferalDoctorDetails = [];
                $scope.ReferalDoctorDetails.push(resp.data);

                if ($scope.appointmentReferalManual) {
                    var AppointmentId = $scope.eObj.AppointmentId;
                    var ConsultationId = $scope.eObj.ConsultationId;
                    var type = 0;
                    if (ConsultationId === 0) {
                        type = 1;
                    }
                    var object = {
                        "AppointmentId": AppointmentId || 0,
                        "Type": type,
                        "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0

                    };
                    eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                        if (resp.data !== undefined) {
                            $scope.treatmentData = resp.data;

                            var IsNKISelected = $scope.cacheStorageItem.isNKISelected;

                            var TempConsultationPlan = angular.copy($scope.treatmentData[0]);

                            var count1 = 0;
                            var pachyODAvgValue = 0;
                            var pachyOSAvgValue = 0;
                            angular.forEach(TempConsultationPlan.Pachymetry, function (pitem) {
                                pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                                pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                                count1++;
                            });
                            TempConsultationPlan.PachymetryAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
                            TempConsultationPlan.PachymetryAvgOSValue = parseFloat(pachyOSAvgValue / count1).toFixed(2) || 0;

                            var BranchMobile = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.BranchMobile);
                            TempConsultationPlan.BranchMobile = BranchMobile.UsFormatMobileNumber;

                            var PhoneNumber = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].PhoneNumber);
                            TempConsultationPlan.PatientArray[0].PhoneNumber = PhoneNumber.UsFormatMobileNumber;
                            TempConsultationPlan.PatientArray[0].DOB = TempConsultationPlan.PatientArray[0].DOB || "";

                            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                            if (TempConsultationPlan != "") {
                                var req = {
                                    "UserId": $scope.UserId,
                                    "ConsultationId": TempConsultationPlan.ConsultationId || "",
                                    "AppointmentId": TempConsultationPlan.AppointmentId || "",
                                    "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                                    "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                                    "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
                                    "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                                    "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                                    "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
                                    "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
                                    "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
                                    "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
                                    "ScribeName": TempConsultationPlan.ScribeName || "",
                                    "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
                                    "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
                                    "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
                                    "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
                                    "StatusFlag": TempConsultationPlan.StatusFlag || "",
                                    "RoleName": TempConsultationPlan.RoleName || "",
                                    "DoctorId": TempConsultationPlan.DoctorId || "",
                                    "DoctorName": TempConsultationPlan.Appointmentwith || "",
                                    "isSendRefLetterMail": false,
                                    "BranchId": TempConsultationPlan.BranchId || "",
                                    "BranchName": TempConsultationPlan.BranchName || "",
                                    "BranchPhoneNo": TempConsultationPlan.BranchMobile || "",
                                    "BranchArea": TempConsultationPlan.BranchArea || "",
                                    "BVPossibleDiagnosis": TempConsultationPlan.BVPossibleDiagnosis || "",
                                    "BranchEmail": TempConsultationPlan.BranchEmail || "",
                                    "BranchAddress": TempConsultationPlan.BranchAddress || "",
                                    "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                    "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                                    "emailAddresses": TempConsultationPlan.emailAddresses || '',
                                    "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                                    "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
                                    "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
                                    "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
                                    "PatientGst": TempConsultationPlan.AppointmentId || "",
                                    "PatientPhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                                    "PatientDOB": TempConsultationPlan.PatientArray[0].DOB || "",
                                    "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                                    "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                                    "ChiefComplaints": [],
                                    "ImplantList": [],
                                    "Vitals": TempConsultationPlan.Vitals || [],
                                    "OccularHistory": TempConsultationPlan.OccularHistory || [],
                                    "AllergyItems": TempConsultationPlan.AllergyItems || [],
                                    "MedicalConditions": [],
                                    "OccularSurgicalHistory": TempConsultationPlan.OccularSurgicalHistory || [],
                                    "CurrentEyeMedications": TempConsultationPlan.CurrentEyeMedications || [],
                                    "SystemicHistory": TempConsultationPlan.SystemicHistory || [],
                                    "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                                    "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                                    "BirthHistory": TempConsultationPlan.BirthHistory || [],
                                    "FamilyHistory": TempConsultationPlan.FamilyHistory || [],
                                    "FunctionalStatusHistory": TempConsultationPlan.FunctionalStatusHistory || [],
                                    "VaccinationHistory": TempConsultationPlan.VaccinationHistory || [],
                                    "NutritionalHistory": TempConsultationPlan.NutritionalHistory || [],
                                    "MenstrualHistory": TempConsultationPlan.MenstrualHistory || [],
                                    "HealthConcerns": TempConsultationPlan.PatientHealthConcerns || [],
                                    "HealthGoals": TempConsultationPlan.PatientGoals || [],
                                    "LifestyleHistory": TempConsultationPlan.LifestyleHistory || [],
                                    "VisionDetails": TempConsultationPlan.VisionDetails || [],
                                    "AutoRefractionDetails": TempConsultationPlan.AutoRefractionArray || [],
                                    "RetinoscopyRefractionDetails": TempConsultationPlan.RetinoscopyRefractionArray || [],
                                    "PGPRefractionDetails": TempConsultationPlan.PGPrefractionArray || [],
                                    "ManifestRefractionDetails": TempConsultationPlan.ManifestRefractionArray || [],
                                    "OverRefractionDetails": TempConsultationPlan.OverRefractionArray || [],
                                    "CycloplegicRefractionDetails": TempConsultationPlan.CycloplegicRefractionArray || [],
                                    "FinalGlassRxDetails": TempConsultationPlan.FinalGlassRxArray || [],
                                    "TonoMetryDetails": TempConsultationPlan.Tonometry || [],
                                    "PupilSizeDetails": TempConsultationPlan.PupilSizeDetails || [],
                                    "PachymetryDetails": TempConsultationPlan.Pachymetry || [],
                                    "GlareDetails": TempConsultationPlan.GlareArray || [],
                                    "KeratometryDetails": TempConsultationPlan.KeratometryValues || [],
                                    "ContactLensDetails": TempConsultationPlan.ContactLensDetails || [],
                                    "AnteriorSegmentArrayNew": TempConsultationPlan.AnteriorSegmentDetails || [],
                                    "PosteriorSegmentDetails": TempConsultationPlan.PosteriorSegmentDetails || [],
                                    "NineGazeExtraOcularDetails": TempConsultationPlan.NineGazeExtraOcularDetails || [],
                                    "SquintDetails": TempConsultationPlan.SquintDetails || [],
                                    "GlassDetails": TempConsultationPlan.GlassDetails || [],
                                    "OPProceduresArray": TempConsultationPlan.OPProceduresArray || [],
                                    "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
                                    //"SquintPossibleDiagnosisArray": TempConsultationPlan.SquintPossibleDiagnosisArray || [],
                                    //"BVPossibleDiagnosisArray": TempConsultationPlan.BVPossibleDiagnosisArray || [],
                                    "DryEyeEvalutionDetails": TempConsultationPlan.DryEyeEvaluationData || [],
                                    "ColorVisionDetails": TempConsultationPlan.ColorVisionDetails || [],
                                    "LacrimalPatiencyDetails": TempConsultationPlan.LacrimalPatiencyDetails || [],
                                    "GonioscopyDetails": TempConsultationPlan.GonioscopyDetails || [],
                                    "PrescriptionDetails": TempConsultationPlan.PatientPrescription.PrescriptionDetails || [],
                                    "AssessmentPlan": TempConsultationPlan.AssessmentPlan || [],
                                    "InvestigationsDetails": TempConsultationPlan.InvestigationsDetails || [],
                                    "SurgeriesDetails": TempConsultationPlan.SurgeriesDetails || [],
                                    "ProceduresDetails": TempConsultationPlan.ProceduresDetails || [],
                                    "ReferralDetails": TempConsultationPlan.ReferralDetails || [],
                                    "HeadPosterDetails": TempConsultationPlan.HeadPosterDetails || [],
                                    "NearInvestigationdetails": TempConsultationPlan.NearInvestigationdetails || [],
                                    "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
                                    "PupilSizeRemarks": TempConsultationPlan.PupilSizeRemarks || "",
                                    "PachymetryRemarks": TempConsultationPlan.PachymetryRemarks || "",
                                    "DilationArray": TempConsultationPlan.DilationArray || [],
                                    "LabInvestigations": TempConsultationPlan.LabInvestigations || [],
                                    "PhysicalEvaluation": TempConsultationPlan.CustomAllergyRemarks || [],
                                    "PsychiatryData": TempConsultationPlan.PsychiatryData || [],
                                    "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
                                    "OPProcedures": TempConsultationPlan.OPProceduresArray || [],
                                    "CurrentSystemicHistory": TempConsultationPlan.CurrentSystemicMedicationsHistory || [],
                                    "ROSAllergyHeaders": $scope.cacheStorageItem.ROSAllergyHeaders || [],
                                    "IsNKISelected": IsNKISelected || "",
                                    "PsychologicalObservations": $scope.ScoreObject,
                                    "labinvestigationNotes": TempConsultationPlan.labinvestigationNotes || "",
                                    "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || "",

                                }
                                req.isSendRefLetterMail = false;
                                if (TempConsultationPlan.ChiefComplaints.length > 0) {
                                    angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
                                        var checifobj = {
                                            "ChiefComplaintId": Citems.ChiefComplaintId || 0,
                                            "ChiefComplaintName": Citems.ChiefComplaintName || "",
                                            "Description": Citems.Description || "",
                                            "OrganId": Citems.OrganId || 0,
                                            "Duration": 1,
                                            "DurationType": Citems.DurationType || '',
                                            "Remarks": Citems.Remarks || "",
                                            "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                        }
                                        req.ChiefComplaints.push(checifobj);
                                    })
                                }
                                TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
                                if (TempConsultationPlan.ImplantList.length > 0) {
                                    angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
                                        var Impobj = {
                                            "DeviceDescription": ImpItem.DeviceDescription || 0,
                                            "Location": ImpItem.Location || "",
                                            "UDI": ImpItem.UDI || ""
                                        }
                                        req.ImplantList.push(Impobj);
                                    })
                                }
                            }

                            eHnoteDiagnosisDataServices.GetDemoViewConsultationPdf(req).then(function (resp) {
                                if (resp.data.Message == 'Success') {
                                    $scope.DemoConsultationPdfUrl = [];
                                    $scope.DemoConsultationPdfUrl = resp.data.data || [];
                                    if ($scope.DemoConsultationPdfUrl != "") {
                                        if ($scope.DemoConsultationPdfUrl.Attachments.length > 0) {


                                            var s3Pdfurl = $scope.DemoConsultationPdfUrl.Attachments[0].S3Url;

                                            window.open(s3Pdfurl);
                                        }
                                        else {
                                            $scope.eObj.pdfurl = "";
                                        }
                                    } else {
                                        $scope.eObj.pdfurl = "";
                                    }
                                }
                                else {
                                    $scope.eObj.IsChartPdfChecked = false;
                                    alertify.error("pdf genaratoin is fails ");
                                    return false;
                                }
                            })

                        }
                    }, function (err) {
                        alertify.error(err.data.ExceptionMessage);
                    });
                } else {

                    if ($scope.eObj.NormalEmail == 1) {
                        $scope.SendCCDAandPdfAttachmentsToMail(resp.data.AppointmentReferalId);
                    } else {
                        $scope.SendPHIEmail(resp.data.AppointmentReferalId);
                    }

                }
            }, function (cancel) {
            });
        }
        $scope.visualCustomArrayOD = [
            {
                "OrganId": 1,
                "OrganName": "OD",
                'SCDistance': '',
                'SCNear': '',
                'CCGLDistance': '',
                'CCGLNear': '',
                'CCCLDistance': '',
                'CCCLNear': '',
                'Pinhole': '',
                'TAC': '',
            }
        ];
        $scope.visualCustomArrayOS = [
            {
                "OrganId": 2,
                "OrganName": "OS",
                'SCDistance': '',
                'SCNear': '',
                'CCGLDistance': '',
                'CCGLNear': '',
                'CCCLDistance': '',
                'CCCLNear': '',
                'Pinhole': '',
                'TAC': '',
            }
        ];
        $scope.visualCustomArrayOU = [
            {
                "OrganId": 3,
                "OrganName": "OU",
                'SCDistance': '',
                'SCNear': '',
                'CCGLDistance': '',
                'CCGLNear': '',
                'CCCLDistance': '',
                'CCCLNear': '',
                'Pinhole': '',
                'TAC': '',
            }
        ];
        $scope.visualMainCustomArray = [];
        $scope.PatientAge = '';
        if (appointmentinfo.PatientDetails.AgeInYears !== "") {
            $scope.PatientAge = appointmentinfo.PatientDetails.AgeInYears + "Y" + " " + appointmentinfo.PatientDetails.AgeInMonths + "M";
        }
        $scope.PatientAge = $scope.PatientAge || '';

        $scope.ChartOverAllPrint = function (pitem) {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }

            var VisionArray = [];
            angular.forEach($scope.cacheStorageItem.FinalVisionDetails, function (item) {
                if (item.InvestigationId === 4 || item.InvestigationId == 5 || item.InvestigationId === 2071 || item.InvestigationId === 13 || item.InvestigationId === 2076) {
                    VisionArray.push(item);
                }
            });
            if (VisionArray.length > 0) {

                var TempArray1 = $filter("filter")(VisionArray, { "InvestigationId": 4 }, true);
                if (TempArray1.length > 0) {
                    $scope.visualCustomArrayOD[0].SCDistance = TempArray1[0].RightEyeValues.Distance;
                    $scope.visualCustomArrayOD[0].SCNear = TempArray1[0].RightEyeValues.Near;
                    $scope.visualCustomArrayOS[0].SCDistance = TempArray1[0].LeftEyeValues.Distance;
                    $scope.visualCustomArrayOS[0].SCNear = TempArray1[0].LeftEyeValues.Near;
                    $scope.visualCustomArrayOU[0].SCDistance = TempArray1[0].BothEyeValues.Distance;
                    $scope.visualCustomArrayOU[0].SCNear = TempArray1[0].BothEyeValues.Near;
                }

                var TempArray2 = $filter("filter")(VisionArray, { "InvestigationId": 5 }, true);
                if (TempArray2.length > 0) {
                    $scope.visualCustomArrayOD[0].CCGLDistance = TempArray2[0].RightEyeValues.Distance;
                    $scope.visualCustomArrayOD[0].CCGLNear = TempArray2[0].RightEyeValues.Near;
                    $scope.visualCustomArrayOS[0].CCGLDistance = TempArray2[0].LeftEyeValues.Distance;
                    $scope.visualCustomArrayOS[0].CCGLNear = TempArray2[0].LeftEyeValues.Near;
                    $scope.visualCustomArrayOU[0].CCGLDistance = TempArray2[0].BothEyeValues.Distance;
                    $scope.visualCustomArrayOU[0].CCGLNear = TempArray2[0].BothEyeValues.Near;
                }

                var TempArray3 = $filter("filter")(VisionArray, { "InvestigationId": 2071 }, true);
                if (TempArray3.length > 0) {
                    $scope.visualCustomArrayOD[0].CCCLDistance = TempArray3[0].RightEyeValues.Distance;
                    $scope.visualCustomArrayOD[0].CCCLNear = TempArray3[0].RightEyeValues.Near;
                    $scope.visualCustomArrayOS[0].CCCLDistance = TempArray3[0].LeftEyeValues.Distance;
                    $scope.visualCustomArrayOS[0].CCCLNear = TempArray3[0].LeftEyeValues.Near;
                    $scope.visualCustomArrayOU[0].CCCLDistance = TempArray3[0].BothEyeValues.Distance;
                    $scope.visualCustomArrayOU[0].CCCLNear = TempArray3[0].BothEyeValues.Near;
                }

                var TempArray4 = $filter("filter")(VisionArray, { "InvestigationId": 13 }, true);
                if (TempArray4.length > 0) {
                    $scope.visualCustomArrayOD[0].Pinhole = TempArray4[0].RightEyeValues.Remarks;
                    $scope.visualCustomArrayOS[0].Pinhole = TempArray4[0].LeftEyeValues.Remarks;
                }

                var TempArray5 = $filter("filter")(VisionArray, { "InvestigationId": 2076 }, true);
                if (TempArray5.length > 0) {
                    $scope.visualCustomArrayOD[0].TAC = TempArray5[0].RightEyeValues.Remarks;
                    $scope.visualCustomArrayOS[0].TAC = TempArray5[0].LeftEyeValues.Remarks;
                }
                $scope.visualMainCustomArray = $scope.visualCustomArrayOD.concat($scope.visualCustomArrayOS, $scope.visualCustomArrayOU);
            } else {
                $scope.visualMainCustomArray = [];
            }
            $scope.cacheStorageItem.ROSAllergyHeaders = $scope.cacheStorageItem.ROSAllergyHeaders || [];
            var ROSAllergyHeadersData = [];
            angular.forEach($scope.cacheStorageItem.ROSAllergyHeaders, function (item) {
                if (item.Active == 'Y') {
                    ROSAllergyHeadersData.push(item);
                }
            });

            pitem.CustomAllergyRemarks = pitem.CustomAllergyRemarks || [];
            var PHysicalEvaluationLength = 62;
            var CustomAllergyRemarksData = [];
            angular.forEach(pitem.CustomAllergyRemarks, function (item) {
                if (item.CustomAllergyValue == 'Y') {
                    CustomAllergyRemarksData.push(item);
                }
            });
            pitem.PsychiatryData = pitem.PsychiatryData || [];
            var Psychiatry = [];
            angular.forEach(pitem.PsychiatryData, function (item) {
                if (item.PsychiatryType == 'Mood') {
                    Psychiatry.push(item);
                }
            });
            var MentalStatus = [];
            angular.forEach(pitem.PsychiatryData, function (item) {
                if (item.PsychiatryType == 'Mental Status') {
                    MentalStatus.push(item);
                }
            });

            var PamArray = [];
            pitem.VisionDetails = pitem.VisionDetails || 0;
            angular.forEach(pitem.VisionDetails, function (item) {
                if (item.InvestigationId == 2155) {
                    PamArray.push(item);
                }
            });
            //$scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
            //var PrescriptionDetails = [];
            //if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
            //    angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (item) {
            //        if (item.PrescriptionDetails.length > 0) {
            //            PrescriptionDetails = item.PrescriptionDetails;
            //        }
            //    });
            //}

            var PrescriptionDetails = [];
            pitem.PatientPrescription.PrescriptionDetails = pitem.PatientPrescription.PrescriptionDetails || [];
            if (pitem.PatientPrescription.PrescriptionDetails.length > 0) {
                angular.forEach(pitem.PatientPrescription.PrescriptionDetails, function (item) {
                    PrescriptionDetails.push(item);
                });
            }

            var DuctionsArray = [];
            $scope.cacheStorageItem.FinalSquintDetails = $scope.cacheStorageItem.FinalSquintDetails || [];
            angular.forEach($scope.cacheStorageItem.FinalSquintDetails, function (item) {
                if (item.InvestigationId == 2095 && item.InvestigationOrgans.length > 0) {
                    DuctionsArray.push(item);
                }
            });
            var Notes = '';
            if ($scope.cacheStorageItem.ReturnToOfficeNotes !== '' && $scope.cacheStorageItem.ReturnToOfficeNotes !== null && $scope.cacheStorageItem.ReturnToOfficeNotes !== undefined) {
                Notes = $scope.cacheStorageItem.ReturnToOfficeNotes;
            }
            var DurationDate = '';
            if ($scope.cacheStorageItem.FollowUpDate !== '' && $scope.cacheStorageItem.FollowUpDate !== null && $scope.cacheStorageItem.FollowUpDate !== undefined) {
                DurationDate = $filter("date")(new Date($scope.cacheStorageItem.FollowUpDate), "MM-dd-yyyy");
            }
            var Duration = '';
            if ($scope.cacheStorageItem.FollowUpDuration !== '' && $scope.cacheStorageItem.FollowUpDuration !== 0 && $scope.cacheStorageItem.FollowUpDuration !== null) {
                Duration = $scope.cacheStorageItem.FollowUpDuration
            }
            var DurationTypeName = '';
            if (Duration !== '') {
                DurationTypeName = $scope.cacheStorageItem.FollowUpDurationType === "Y" ? "Years(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "M" ? "Month(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "D" ? "Day(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "W" ? "Week(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "C" ? "To Be continued" : ($scope.cacheStorageItem.FollowUpDurationType === "L" ? "Life Time" : "")))));
            }
            $scope.cacheStorageItem.ReferralDetails = $scope.cacheStorageItem.ReferralDetails || [];
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            $scope.SquitArray = [];
            if ($scope.cacheStorageItem.FinalSquintDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.FinalSquintDetails, function (mitem, index) {
                    if (mitem.InvestigationId == 699) {
                        if (mitem.DistanceValue !== '' || mitem.DistanceFixationPreference !== '' || mitem.NearValue !== '' || mitem.NearFixationPreference !== '' || mitem.Remarks !== '') {
                            $scope.SquitArray.push(mitem)
                        }
                    }
                    if (mitem.InvestigationId == 719) {
                        var Count = 0;
                        if (mitem.PrismCoverDetailsArray.length > 0) {
                            angular.forEach(mitem.PrismCoverDetailsArray, function (item) {
                                if (item.Distance.DistanceRPrismValue !== '' || item.Distance.DistanceRTypeOfSquintValue !== '' || item.Distance.DistanceRFixationPreference !== "" || item.Distance.DistanceLPrismValue !== '' || item.Distance.DistanceLTypeOfSquintValue !== '' || item.Distance.DistanceLFixationPreference !== '' || item.Near.NearRPrismValue !== '' || item.Near.NearRTypeOfSquintValue !== '' || item.Near.NearRFixationPreference !== '' || item.Near.NearLPrismValue !== '' || item.Near.NearLTypeOfSquintValue !== '' || item.Near.NearLFixationPreference !== '' || item.AllRemarks !== '') {
                                    Count++
                                }
                            });
                            if (Count !== 0) {
                                $scope.SquitArray.push(mitem)
                            }
                        }
                    }
                    if (mitem.InvestigationId == 697) {
                        if (mitem.RightEye.Name !== '' || mitem.RightEye.DegreeValue !== '' || mitem.LeftEye.Name !== '' || mitem.LeftEye.DegreeValue !== '' || mitem.Remarks !== '') {
                            $scope.SquitArray.push(mitem)
                        }
                    }
                    if (mitem.InvestigationId == 721) {
                        mitem.Nystagmus = mitem.Nystagmus || '';
                        mitem.Remarks = mitem.Remarks || '';
                        if (mitem.Nystagmus !== '' || mitem.Remarks != '') {
                            $scope.SquitArray.push(mitem)
                        }
                    }
                });
            } else {
                $scope.SquitArray = [];
            }


            $scope.BinocularArray = [];
            if (pitem.SquintDetails.length > 0) {
                angular.forEach(pitem.SquintDetails, function (mitem, index) {
                    if (mitem.InvestigationId == 64) {
                        if (mitem.DistanceValue !== '' || mitem.NearValue !== '' || mitem.Remarks !== '') {
                            $scope.BinocularArray.push(mitem)
                        }
                    }
                    if (mitem.InvestigationId == 701) {
                        $scope.BinocularArray.push(mitem)
                    }
                });
            } else {
                $scope.BinocularArray = [];
            }

            $scope.cacheStorageItem.FinalAnteriorDetails = $scope.cacheStorageItem.FinalAnteriorDetails || [];
            $scope.AnteriorArray = [];
            if ($scope.cacheStorageItem.FinalAnteriorDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.FinalAnteriorDetails, function (item) {
                    if (item.RemarksArray.length > 0 || item.InvestigationId == 6) {
                        $scope.AnteriorArray.push(item)
                    }
                });
            } else {
                $scope.AnteriorArray = [];
            }
            $scope.TempArray = [];

            $scope.TempArray = $filter('orderBy')($scope.AnteriorArray, 'OrderBY');

            $scope.AnteriorArray = angular.copy($scope.TempArray);

            $scope.cacheStorageItem.FinalPosteriorDetails = $scope.cacheStorageItem.FinalPosteriorDetails || [];
            $scope.PosteriorArray = [];
            if ($scope.cacheStorageItem.FinalPosteriorDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.FinalPosteriorDetails, function (item) {
                    if (item.RemarksArray.length > 0 || item.InvestigationId == 32) {
                        $scope.PosteriorArray.push(item)
                    }
                });
            } else {
                $scope.PosteriorArray = [];
            }
            $scope.TempArray2 = [];

            $scope.TempArray2 = $filter('orderBy')($scope.PosteriorArray, 'OrderBY');

            $scope.PosteriorArray = angular.copy($scope.TempArray2);

            var ExtraOccularArray = [];
            pitem.NineGazeExtraOcularDetails = pitem.NineGazeExtraOcularDetails || [];
            //var ACtiveFilter = $filter("filter")(pitem.NineGazeExtraOcularDetails, { "InvestigationId": 18 }, true) || [];
            //if (ACtiveFilter.length > 0) {
            //    ExtraOccularArray = angular.copy(ACtiveFilter);
            //}

            if (pitem.NineGazeExtraOcularDetails.length > 0) {
                angular.forEach(pitem.NineGazeExtraOcularDetails, function (item) {
                    if (item.InvestigationId == 18) {
                        if (item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {

                            ExtraOccularArray.push(item)

                        }
                    }
                });
            }
            var NineGazeArray = [];
            pitem.NineGazeExtraOcularDetails = pitem.NineGazeExtraOcularDetails || [];
            var TempArray = $filter("filter")(pitem.NineGazeExtraOcularDetails, { "InvestigationId": 695 }, true) || [];
            if (TempArray.length > 0) {
                NineGazeArray = angular.copy(TempArray);
            }

            $scope.NearInvestigationdetailsArray = [];
            if (pitem.NearInvestigationdetails.length > 0) {
                angular.forEach(pitem.NearInvestigationdetails, function (mitem, index) {
                    if (mitem.InvestigationId == 815) {
                        if (mitem.BreakOUValue != '' || mitem.RecoveryOUValue != '' || mitem.Remarks != '') {
                            $scope.NearInvestigationdetailsArray.push(mitem)
                        }
                    }
                    if (mitem.InvestigationId == 2122) {
                        if (mitem.BlurODValue != '' || mitem.BreakODValue != '' || mitem.RecoveryODValue != '' || mitem.BlurOSValue != '' || mitem.BreakOSValue != '' || mitem.RecoveryOSValue != '' || mitem.BlurOUValue != '' || mitem.BreakOUValue != '' || mitem.RecoveryOUValue != '' || mitem.Remarks != '') {
                            $scope.NearInvestigationdetailsArray.push(mitem)
                        }
                    }
                    if (mitem.InvestigationId == 2123) {
                        if (mitem.ODNegativeDistaceValue != '' || mitem.ODNegativeNearValue != '' || mitem.ODPositiveDistaceValue != '' || mitem.ODPositiveNearValue != '' || mitem.OSNegativeDistaceValue != '' || mitem.OSNegativeNearValue != '' || mitem.OSPositiveDistaceValue != '' || mitem.OSPositiveNearValue != '' || mitem.Remarks != '') {
                            $scope.NearInvestigationdetailsArray.push(mitem)
                        }
                    }
                    if (mitem.InvestigationId == 2124) {
                        if (mitem.ODNegativeDistaceValue != '' || mitem.ODNegativeNearValue != '' || mitem.ODPositiveDistaceValue != '' || mitem.ODPositiveNearValue != '' || mitem.OSNegativeDistaceValue != '' || mitem.OSNegativeNearValue != '' || mitem.OSPositiveDistaceValue != '' || mitem.OSPositiveNearValue != '' || mitem.Remarks != '') {
                            $scope.NearInvestigationdetailsArray.push(mitem)
                        }
                    }
                });
            }



            var AllNormal = ''
            var occularHistory = $filter("filter")($scope.cacheStorageItem.OccularHistory, { "HistoryId": 1 }, true) || [];
            var ocularSurgicalHistory = $filter("filter")($scope.cacheStorageItem.OcularSurgicalHistory, { "HistoryId": 1 }, true) || [];
            var currentEyeMedications = $filter("filter")($scope.cacheStorageItem.CurrentEyeMedications, { "MedicineId": 1 }, true) || [];
            var systemicHistory = $filter("filter")($scope.cacheStorageItem.SystemicHistory, { "HistoryId": 1 }, true) || [];
            var surgicalHistory = $filter("filter")($scope.cacheStorageItem.SurgicalHistory, { "HistoryId": 1 }, true) || [];
            var currentSystemicMedicationsHistory = $filter("filter")($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, { "MedicineId": 1 }, true) || [];
            var familyHistory = $filter("filter")($scope.cacheStorageItem.FamilyHistory, { "HistoryId": 1 }, true) || [];
            var functionalStatusHistory = $filter("filter")($scope.cacheStorageItem.FunctionalStatusHistory, { "HistoryId": 1 }, true) || [];
            var vaccinationHistory = $filter("filter")($scope.cacheStorageItem.VaccinationHistory, { "HistoryId": 1 }, true) || [];
            var birthHistory = $filter("filter")($scope.cacheStorageItem.BirthHistory, { "HistoryId": 1 }, true) || [];
            var nutritionalHistory = $filter("filter")($scope.cacheStorageItem.NutritionalHistory, { "HistoryId": 1 }, true) || [];
            var menstrualHistory = $filter("filter")($scope.cacheStorageItem.MenstrualHistory, { "HistoryId": 1 }, true) || [];
            var labInvestigations = $filter("filter")($scope.cacheStorageItem.LabInvestigations, { "ProcedureId": 1 }, true) || [];
            if (occularHistory != 0 || ocularSurgicalHistory != 0 || currentEyeMedications != 0 || systemicHistory != 0 || surgicalHistory != 0 || currentSystemicMedicationsHistory != 0 || familyHistory != 0 || functionalStatusHistory != 0 || vaccinationHistory != 0 || birthHistory != 0 || nutritionalHistory != 0 || menstrualHistory != 0 || labInvestigations != 0) {
                AllNormal = 'All other Review of systems referred as NORMAL';
            }

            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationDate": $scope.cacheStorageItem.ConsultationDate || '',
                "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "ChiefComplaints": $scope.cacheStorageItem.ChiefComplaints || [],
                "AllergyItems": pitem.AllergyItems || [],
                "OccularHistory": pitem.OccularHistory || [],
                "OcularSurgicalHistory": pitem.OccularSurgicalHistory || [],
                "CurrentEyeMedications": pitem.CurrentEyeMedications || [],
                "SystemicHistory": pitem.SystemicHistory || [],
                "SurgicalHistory": pitem.SurgicalHistory || [],
                "CurrentSystemicMedicationsHistory": pitem.CurrentSystemicMedicationsHistory || [],
                "FamilyHistory": pitem.FamilyHistory || [],
                "FunctionalStatusHistory": pitem.FunctionalStatusHistory || [],
                "VaccinationHistory": pitem.VaccinationHistory || [],
                "LifestyleHistory": pitem.LifestyleHistory || [],
                "BirthHistory": pitem.BirthHistory || [],
                "NutritionalHistory": pitem.NutritionalHistory || [],
                "MenstrualHistory": pitem.MenstrualHistory || [],
                "ROSAllergyHeaders": ROSAllergyHeadersData || [],
                "CustomAllergyRemarks": CustomAllergyRemarksData || [],
                "PHysicalEvaluationLength": PHysicalEvaluationLength || 0,
                "PsychiatryData": Psychiatry,
                "Mentalstatus": MentalStatus,
                "PatientHealthConcerns": pitem.PatientHealthConcerns || [],
                "PatientGoals": pitem.PatientGoals || [],
                "ImplantList": pitem.ImplantList || [],
                "LabInvestigations": pitem.LabInvestigations || [],
                "PHQScore": $scope.ScoreObject.PHQScore || 0,
                "AUDITScore": $scope.ScoreObject.AUDITScore || 0,
                "NHANESscore": $scope.ScoreObject.NHANESscore || 0,
                "HARKscore": $scope.ScoreObject.HARKscore || 0,
                "VitalsArray": pitem.Vitals || [],
                "DilationArray": pitem.DilationArray || [],
                "VisionDetails": $scope.visualMainCustomArray || [],
                "VisionArray": $scope.cacheStorageItem.FinalVisionDetails || [],
                "TestUsed": $scope.MasterTestUsedlist,
                "AutoRefractionArray": $scope.cacheStorageItem.FinalAutoRefractionDetails || [],
                "RetinoscopyArray": $scope.cacheStorageItem.FinalRetinoscopyRefractionDetails || [],
                "PGPRefractionArray": $scope.cacheStorageItem.FinalPGPRefractionDetails || [],
                "ManifestRefractionArray": $scope.cacheStorageItem.FinalManifestRefractionDetails || [],
                "OverRefractionArray": $scope.cacheStorageItem.FinalOverRefractionDetails || [],
                "CycloplegicRefractionArray": $scope.cacheStorageItem.FinalCycloplegicRefractionDetails || [],
                "FinalGlassRefractionArray": pitem.FinalGlassRxArray || [],
                "IOPArray": pitem.Tonometry || [],
                "PupilSizeArray": $scope.cacheStorageItem.FinalPupilSizeDetails || [],
                "PupilSizeRemarks": $scope.cacheStorageItem.PupilSizeRemarks || '',
                "PachymetryArray": $scope.cacheStorageItem.FinalPachymetryDetails || [],
                "PachymetryAvgODValue": pitem.PachymetryAvgODValue || '',
                "PachymetryAvgOSValue": pitem.PachymetryAvgOSValue || '',
                "PamArray": PamArray,
                "GlareArray": $scope.cacheStorageItem.FinalGlareDetails || [],
                "KeratometryArray": $scope.cacheStorageItem.FinalKeratometryDetails || [],
                "AnteriorArray": $scope.AnteriorArray || [],
                "PosteriorArray": $scope.PosteriorArray || [],
                "GonioscopyArray": $scope.cacheStorageItem.FinalGonioscopyDetails || [],
                "ExtraOcularArray": ExtraOccularArray || [],
                "NineGazeArray": NineGazeArray || [],
                "ODFreelymoving": $scope.cacheStorageItem.ODExtraOcularFreelymovingInd || false,
                "OSFreelymoving": $scope.cacheStorageItem.OSExtraOcularFreelymovingInd || false,
                "ODNineGazeFreelymoving": $scope.cacheStorageItem.OD9GazeFreelymovingInd || false,
                "OSNineGazeFreelymoving": $scope.cacheStorageItem.OS9GazeFreelymovingInd || false,
                "DuctionsArray": DuctionsArray,
                "SquintArray": $scope.SquitArray || [],
                "BinocularArray": $scope.BinocularArray || [],
                "HeadPosterArray": $scope.cacheStorageItem.FinalHeadPosterDetails || [],
                "NearInvestigationArray": $scope.NearInvestigationdetailsArray || [],
                "DryEyeEvaluationData": $scope.cacheStorageItem.FinalDryEyeEvaluationData || [],
                "ColorVisionDetails": $scope.cacheStorageItem.FinalColorVisionDetails || [],
                "LacrimalPatiencyDetails": $scope.cacheStorageItem.FinalLacrimalPatiencyDetails || [],
                "LacrimalPatencyRemarks": $scope.cacheStorageItem.LacrimalPatencyRemarks || '',
                "HertelsExaminationArray": $scope.cacheStorageItem.FinalHertelsExaminationArray || [],
                "NewAmslerGridArray": $scope.cacheStorageItem.FinalNewAmslerGridArray || [],
                "ConfrontationalFieldArray": $scope.cacheStorageItem.FinalConfrontationalFieldArray || [],
                "AssessmentPlanArray": $scope.cacheStorageItem.AssessmentPlan || [],
                "InvestigationsDetails": $scope.cacheStorageItem.InvestigationsDetails || [],
                "SurgeriesDetails": $scope.cacheStorageItem.SurgeriesDetails || [],
                "ProceduresDetails": $scope.cacheStorageItem.ProceduresDetails || [],
                "ReferralDetails": $scope.cacheStorageItem.ReferralDetails || [],
                "GlassRxDetails": pitem.FinalGlassRxArray || [],
                "PrescriptionDetails": PrescriptionDetails || [],
                "ProceduresArray": pitem.OPProceduresArray || [],
                "SuperBillArray": $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "ReturnToOfficeNotes": Notes || '',
                "FollowUpDate": DurationDate || '',
                "FollowUpDuration": Duration,
                "FollowUpDurationType": DurationTypeName,
                "ScribeName": $scope.cacheStorageItem.ScribeName || '',
                "DoctorName": $scope.cacheStorageItem.DoctorName || '',
                "ConsultationNotes": $scope.cacheStorageItem.OverallChartNotes || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "OverallProcedureNotes": $scope.ProcedureNotesObj.Notes || '',
                "ExtendedOpthalmology": $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology || false,
                "IsExamedwithTorchused": $scope.cacheStorageItem.IsExamedwithTorchused || false,
                "PosteriorLensName": $scope.cacheStorageItem.PosteriorLensName || '',
                "FollowUpVisitReasonName": $scope.cacheStorageItem.FollowUpVisitReasonName || '',
                "ROSOverAllRemarks": pitem.ROSOverAllRemarks || '',
                "AllNormarlText": AllNormal || '',
                "LabInvestigationNotes": pitem.labinvestigationNotes || '',
                "AnteriorRemarks": pitem.AnteriorRemarks || '',
                "PosteriorRemarks": pitem.PosteriorRemarks || '',
                "AllergyRemarks": pitem.AllergyRemarks || "",
                "SurgicalRemarks": pitem.SurgicalRemarks || "",
                "CurrentEyeRemarks": pitem.CurrentEyeRemarks || "",
                "CurrentSystemicRemarks": pitem.CurrentSystemicRemarks || "",
                "SystemicHistoryRemarks": pitem.SystemicHistoryRemarks || "",
                "OccularHistoryRemarks": pitem.OccularHistoryRemarks || "",
                "OcularSurgicalHistoryRemarks": pitem.OcularSurgicalHistoryRemarks || "",
                "FamilyHistoryRemarks": pitem.FamilyHistoryRemarks || "",
                "FunctionalStatusRemarks": pitem.FunctionalStatusRemarks || "",
                "VaccinationHistoryRemarks": pitem.VaccinationHistoryRemarks || "",
                "BirthHistoryRemarks": pitem.BirthHistoryRemarks || "",
                "NutritionalHistoryRemarks": pitem.NutritionalHistoryRemarks || "",
                "MenstrualHistoryRemarks": pitem.MenstrualHistoryRemarks || "",
                "PhysicalEvaluationRemarks": pitem.PhysicalEvaluationRemarks || "",
                "PsychiatryRemarks": pitem.PsychiatryRemarks || "",
                "HealthGoalsRemarks": pitem.HealthGoalsRemarks || "",
                "LabInvestigationsRemarks": pitem.LabInvestigationsRemarks || "",
                "ImplantRemarks": pitem.ImplantRemarks || "",
                "PsychologicalObservRemarks": pitem.PsychologicalObservRemarks || "",
                "VitalsRemarks": pitem.VitalsRemarks || "",
                "LifestyleHistoryRemarks": pitem.LifestyleHistoryRemarks || "",

                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
            }

            if ($scope.PrintObj.IsPrintByModule) {
                //module based Print
                USPrintService.GenerateChartOverAllPrint(obj, $scope.ModuleNamesInd);
            }
            else {
                // print all 
                for (let key in $scope.ModuleNamesInd) {
                    if ($scope.ModuleNamesInd.hasOwnProperty(key)) {
                        $scope.ModuleNamesInd[key] = true;
                    }
                }
                USPrintService.GenerateChartOverAllPrint(obj, $scope.ModuleNamesInd);
            }
        };
        $scope.AssessmentsPrint = function () {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "AssessmentPlanArray": $scope.cacheStorageItem.AssessmentPlan || [],
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
            }
            USPrintService.GenerateAssessmentPrint(obj);
        }
        $scope.eObj = {};
        $scope.eObj.PatientEmail = "";
        $scope.eObj.DoctorEmail = "";
        $scope.eObj.OtherEmail = "";
        $scope.eObj.sms = "";
        $scope.isPatientChecked = "";
        $scope.Assessmentspopup = function () {
            $scope.eObj.isPatientEmailPopover = true;
            $scope.PopUpOnPlan = $uibModal.open({
                "templateUrl": "Assessments.html",
                "scope": $scope,
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "",
                size: 'md'
            })
        }
        $scope.AssessmentsEmailClose = function () {
            $scope.PopUpOnPlan.dismiss('cancel');
        }
        $scope.SendAssessmentsEmail = function () {
            if ($scope.eObj.PatientEmail == '') {
                alertify.error("Please Enter PatientEmail!");
                return false;
            }
            if ($scope.isPatientChecked) {
                sendSms($scope.eObj.sms);
            }
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "AssessmentPlanArray": $scope.cacheStorageItem.AssessmentPlan || [],
            }

            obj.emailAddresses = getMailStr($scope.eObj.PatientEmail, $scope.eObj.DoctorEmail, $scope.eObj.OtherEmail);
            obj.BranchName = doctorinfo.doctordata.UserAddress[0].ClinicName;
            obj.BranchPhone = doctorinfo.doctordata.UserAddress[0].MobileNo + "," + doctorinfo.doctordata.UserAddress[0].ContactNo;
            obj.DoctorName = appointmentinfo.DoctorFullName;
            obj.BranchEmail = doctorinfo.doctordata.UserAddress[0].BranchEmail;
            obj.PatientName = appointmentinfo.PatientDetails.FullName ? appointmentinfo.PatientDetails.FullName : "";
            obj.PatientGender = $scope.cacheStorageItem.Gender || '',
                obj.AssessmentSMS = $scope.eObj.sms
            obj.ConsultationDt = appointmentinfo.ConsultationDt || "";
            appointmentinfo.Title = appointmentinfo.PatientDetails.Title ? appointmentinfo.PatientDetails.Title : "";
            if (appointmentinfo.Title !== "") {
                obj.PatientName = appointmentinfo.Title + "." + obj.PatientName;
            }
            appointmentinfo.PatientDetails.AgeInYears = appointmentinfo.PatientDetails.AgeInYears || "";
            if (appointmentinfo.PatientDetails.AgeInYears !== "") {
                obj.PatientAge = appointmentinfo.PatientDetails.AgeInYears + "Y" + " " + appointmentinfo.PatientDetails.AgeInMonths + "M";
            } else {
                obj.PatientAge = appointmentinfo.PatientDetails.AgeInMonths + "M";
            }
            obj.PatientDisplayId = appointmentinfo.PatientDetails.PatientDisplayId ? appointmentinfo.PatientDetails.PatientDisplayId : "";
            obj.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;
            eHnotePatientVisitReasonServices.AssessmentsplanEmail(obj).then(function (resp) {
                if (resp.data.Message === "Success") {
                    alertify.success("Mail sent successfully");
                    $scope.eObj.PatientEmail = "";
                    $scope.eObj.DoctorEmail = "";
                    $scope.eObj.OtherEmail = "";
                    $scope.PopUpOnPlan.dismiss('cancel');
                }
            })
        }


        $scope.OrdersPrint = function () {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }

            var Notes = '';
            if ($scope.cacheStorageItem.ReturnToOfficeNotes !== '' && $scope.cacheStorageItem.ReturnToOfficeNotes !== null && $scope.cacheStorageItem.ReturnToOfficeNotes !== undefined) {
                Notes = $scope.cacheStorageItem.ReturnToOfficeNotes;
            }
            var DurationDate = '';
            if ($scope.cacheStorageItem.FollowUpDate !== '' && $scope.cacheStorageItem.FollowUpDate !== null && $scope.cacheStorageItem.FollowUpDate !== undefined) {
                DurationDate = $filter("date")(new Date($scope.cacheStorageItem.FollowUpDate), "MM-dd-yyyy");
            }
            var Duration = '';
            if ($scope.cacheStorageItem.FollowUpDuration !== '' && $scope.cacheStorageItem.FollowUpDuration !== 0 && $scope.cacheStorageItem.FollowUpDuration !== null) {
                Duration = $scope.cacheStorageItem.FollowUpDuration
            }
            var DurationTypeName = '';
            if (Duration !== '') {
                DurationTypeName = $scope.cacheStorageItem.FollowUpDurationType === "Y" ? "Years(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "M" ? "Month(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "D" ? "Day(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "W" ? "Week(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "C" ? "To Be continued" : ($scope.cacheStorageItem.FollowUpDurationType === "L" ? "Life Time" : "")))));
            }

            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "InvestigationsDetails": $scope.cacheStorageItem.InvestigationsDetails || [],
                "SurgeriesDetails": $scope.cacheStorageItem.SurgeriesDetails || [],
                "ProceduresDetails": $scope.cacheStorageItem.ProceduresDetails || [],
                "ReferralDetails": $scope.cacheStorageItem.ReferralDetails || [],
                "ReturnToOfficeNotes": Notes || '',
                "FollowUpDate": DurationDate || '',
                "FollowUpDuration": Duration,
                "FollowUpDurationType": DurationTypeName,
                "FollowUpVisitReasonName": $scope.cacheStorageItem.FollowUpVisitReasonName || '',
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
            }
            USPrintService.GenerateOrdersPrint(obj);
        }
        $scope.GlassRxPrint = function () {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "GlassRxDetails": $scope.cacheStorageItem.FinalGlassRxRefractionDetails || [],
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
            }
            USPrintService.GenerateGlassRxPrint(obj);
        }

        $scope.GlassRxSummaryEmail = function () {
            $scope.PopUpOnPlan = $uibModal.open({
                "templateUrl": "GlassRx.html",
                "scope": $scope,
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "",
                size: 'md'
            });
        }
        $scope.GlassRxEmailClose = function () {
            $scope.PopUpOnPlan.dismiss('cancel');
        }

        $scope.SendGlassRxEmail = function () {
            if ($scope.eObj.PatientEmail == '') {
                alertify.error("Please Enter PatientEmail!");
                return false;
            }
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "GlassRxDetails": $scope.cacheStorageItem.FinalGlassRxRefractionDetails || [],
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.cacheStorageItem.Age || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                "PatientDOB": appointmentinfo.PatientDetails.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
            }

            obj.BranchName = doctorinfo.doctordata.UserAddress[0].ClinicName;
            obj.BranchPhone = doctorinfo.doctordata.UserAddress[0].MobileNo + "," + doctorinfo.doctordata.UserAddress[0].ContactNo;
            obj.DoctorName = appointmentinfo.DoctorFullName;
            obj.BranchEmail = doctorinfo.doctordata.UserAddress[0].BranchEmail;

            obj.emailAddresses = getMailStr($scope.eObj.PatientEmail, $scope.eObj.DoctorEmail, $scope.eObj.OtherEmail);
            obj.PatientName = appointmentinfo.PatientDetails.FullName ? appointmentinfo.PatientDetails.FullName : "";
            obj.PatientGender = $scope.cacheStorageItem.Gender || '',
                obj.ConsultationDt = appointmentinfo.ConsultationDt || "";
            appointmentinfo.Title = appointmentinfo.PatientDetails.Title ? appointmentinfo.PatientDetails.Title : "";
            if (appointmentinfo.Title !== "") {
                obj.PatientName = appointmentinfo.Title + "." + obj.PatientName;
            }
            appointmentinfo.PatientDetails.AgeInYears = appointmentinfo.PatientDetails.AgeInYears || "";
            if (appointmentinfo.PatientDetails.AgeInYears !== "") {
                obj.PatientAge = appointmentinfo.PatientDetails.AgeInYears + "Y" + " " + appointmentinfo.PatientDetails.AgeInMonths + "M";
            } else {
                obj.PatientAge = appointmentinfo.PatientDetails.AgeInMonths + "M";
            }
            obj.PatientDisplayId = appointmentinfo.PatientDetails.PatientDisplayId ? appointmentinfo.PatientDetails.PatientDisplayId : "";
            obj.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;
            eHnotePatientVisitReasonServices.GlassRxSummaryEmail(obj).then(function (resp) {
                if (resp.data.Message === "Success") {
                    alertify.success("Mail sent successfully");
                    $scope.eObj.PatientEmail = "";
                    $scope.eObj.DoctorEmail = "";
                    $scope.eObj.OtherEmail = "";
                    $scope.PopUpOnPlan.dismiss('cancel');
                }
            })
        }

        $scope.MedicalRxPrint = function (Pitem) {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            // $scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
            var PrescriptionDetails = [];
            Pitem.PatientPrescription.PrescriptionDetails = Pitem.PatientPrescription.PrescriptionDetails || [];
            if (Pitem.PatientPrescription.PrescriptionDetails.length > 0) {
                angular.forEach(Pitem.PatientPrescription.PrescriptionDetails, function (item) {
                    PrescriptionDetails.push(item);
                });
            }

            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "PrescriptionDetails": PrescriptionDetails || [],
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
            }
            USPrintService.GenerateMedicalRxPrint(obj);
        }
        $scope.ProceduresPrint = function (Pitem) {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            $scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "ProceduresArray": Pitem.OPProceduresArray || [],
                "OverallProcedureNotes": $scope.ProcedureNotesObj.Notes || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
            }
            USPrintService.GenerateProceduresPrint(obj);
        }
        $scope.emailReferal = function () {
            // var appoint_info = eHnoteMasterDataService.getAppointmentInfo();

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/emailReferalpopup.html",
                "controller": "USEmailReferalpopupCtrl",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "ChartObj": function () { return angular.copy($scope.ChartObj) },

                },
                //"scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                //"controller": function ($scope, $uibModal, $uibModalInstance) {
                //    $scope.uibclose = function () {
                //        $uibModalInstance.dismiss("cancel");
                //    };
                //}
            });
        };
        $scope.AllmodulePrintObj = {};
        $scope.Printbymodule = function (pitem) {
            $scope.ModuleNamesInd = $scope.GetModuleNamesInd();
            $scope.AllmodulePrintObj = {};
            $scope.AllmodulePrintObj = pitem;
            $scope.PrintObj.IsPrintByModule = true;
            let mInstanceShow = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Printbymodulepopup.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "md",
                //"windowClass": "inventory-full-popup",
                "keyboard": false,
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.Uibclose = function () {
                        $scope.PrintObj.IsPrintByModule = false;
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
            mInstanceShow.result.then(function (resp) {
                if (resp.PrintObj.PrintType == 'Print') {
                    $scope.ChartOverAllPrint();
                }
            });
        }
        $scope.ShowhideAssementData = function (item) {
            item.ISAccordianshow = !item.ISAccordianshow;
        }
        $scope.PrintByEachModuleByCheck = function () {

            $scope.AllmodulePrintObj = $scope.AllmodulePrintObj || null;
            $scope.ChartOverAllPrint($scope.AllmodulePrintObj);
        }
        const ROSindicators = [
            'IsAllergiesInd',
            'IsOcularHistoryInd',
            'IsOcularSurgicalHistoryInd',
            'IsCurrentEyeMedicationsInd',
            'IsSystemicHistoryInd',
            'IsSurgicalHistoryInd',
            'IsCurrentSystemicMedicationsInd',
            'IsFamilyHistoryInd',
            'IsFunctionalHistoryInd',
            'IsLifeStyleHistoryInd',
            'IsVaccinationHistoryInd',
            'IsBirthHistoryInd',
            'IsNutritionalHistoryInd',
            'IsMenstrualHistoryInd',
            'IsPhysicalEvaluationInd',
            'IsPsychiatryInd',
            'IsHealthConcernsAndGoalsInd',
            'IsLabInvestigationsInd',
            'IsImplantsInd',
            'IsPsychologicalObservationsInd',
            'IsVitalsInd'
        ];
        const Visionindicators = [
            'IsVisualAcuityInd',
            'IsAutoRefractionInd',
            'IsRetinoscopyInd',
            'IsPresentGlassRxInd',
            'IsManifestRefractionInd',
            'IsCyclopegicRefractionInd',
            'IsOverRefractionInd',
            'IsFinalGlassRxInd',
            'IsKeratometryInd',
            'IsIOPandPachyInd',
            'IsPupilSizeInd',
            'IsPAMInd',
            'IsGlareInd'
        ];
        const Examinationsindicators = [
            'IsAnteriorSegmentInd',
            'IsPosteriorSegmentInd',
            'IsDryEyeEvaluationInd',
            'IsAmslerGridInd',
            'IsConfrontationalFieldTestInd',
            'IsGonioscopyInd',
            'IsHertelsExaminationInd',
            'IsColorVisionTestInd',
            'IsLacrimalPatencyInd',
            'IsMotorExaminationInd'
        ];
        //MainModule
        $scope.ModuleListIsChecked = function (Categoryitem) {
            // ROS
            if (Categoryitem == 'ROS') {
                const IsReviewOfSystemInd = $scope.ModuleNamesInd.IsReviewOfSystemInd;
                ROSindicators.forEach(ROSindicators => {
                    $scope.ModuleNamesInd[ROSindicators] = IsReviewOfSystemInd;
                });
            }
            // VISION
            if (Categoryitem == 'Vision') {

                const IsVisionAndPerceptionInd = $scope.ModuleNamesInd.IsVisionAndPerceptionInd;
                Visionindicators.forEach(Visionindicators => {
                    $scope.ModuleNamesInd[Visionindicators] = IsVisionAndPerceptionInd;
                });
            }
            //EXAMINATION
            if (Categoryitem == 'Examinations') {
                const IsExaminationsInd = $scope.ModuleNamesInd.IsExaminationsInd;
                Examinationsindicators.forEach(Examinationsindicators => {
                    $scope.ModuleNamesInd[Examinationsindicators] = IsExaminationsInd;
                });
            }
        }
        //subModule
        $scope.SubModuleListIsChecked = function (type) {
            //ROS
            let allROSTrue = ROSindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
            $scope.ModuleNamesInd.IsReviewOfSystemInd = allROSTrue;
            //VISION
            let allVisionTrue = Visionindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
            $scope.ModuleNamesInd.IsVisionAndPerceptionInd = allVisionTrue;
            //EXAM
            let allExamTrue = Examinationsindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
            $scope.ModuleNamesInd.IsExaminationsInd = allExamTrue;
        }
        //print by module code 
        $scope.GetModuleNamesInd = function () {
            return {
                "IsAllEmrModuleCheckInd": false,
                "IsChiefComplaintsInd": false,
                "IsReviewOfSystemInd": false,
                "IsAllergiesInd": false,
                "IsOcularHistoryInd": false,
                "IsOcularSurgicalHistoryInd": false,
                "IsCurrentEyeMedicationsInd": false,
                "IsSystemicHistoryInd": false,
                "IsSurgicalHistoryInd": false,
                "IsCurrentSystemicMedicationsInd": false,
                "IsFamilyHistoryInd": false,
                "IsFunctionalHistoryInd": false,
                "IsLifeStyleHistoryInd": false,
                "IsVaccinationHistoryInd": false,
                "IsBirthHistoryInd": false,
                "IsNutritionalHistoryInd": false,
                "IsMenstrualHistoryInd": false,
                "IsPhysicalEvaluationInd": false,
                "IsPsychiatryInd": false,
                "IsHealthConcernsAndGoalsInd": false,
                "IsLabInvestigationsInd": false,
                "IsImplantsInd": false,
                "IsPsychologicalObservationsInd": false,
                "IsVitalsInd": false,
                "IsVisionAndPerceptionInd": false,
                "IsVisualAcuityInd": false,
                "IsAutoRefractionInd": false,
                "IsRetinoscopyInd": false,
                "IsPresentGlassRxInd": false,
                "IsManifestRefractionInd": false,
                "IsCyclopegicRefractionInd": false,
                "IsOverRefractionInd": false,
                "IsFinalGlassRxInd": false,
                "IsKeratometryInd": false,
                "IsIOPandPachyInd": false,
                "IsPupilSizeInd": false,
                "IsPAMInd": false,
                "IsGlareInd": false,
                "IsContactLensInd": false,
                "IsExaminationsInd": false,
                "IsAnteriorSegmentInd": false,
                "IsPosteriorSegmentInd": false,
                "IsDryEyeEvaluationInd": false,
                "IsAmslerGridInd": false,
                "IsConfrontationalFieldTestInd": false,
                "IsGonioscopyInd": false,
                "IsHertelsExaminationInd": false,
                "IsColorVisionTestInd": false,
                "IsLacrimalPatencyInd": false,
                "IsMotorExaminationInd": false,
                "IsAssessmentPlansInd": false,
                "IsOrdersInd": false,
                "IsMedicalRxInd": false,
                "IsGlassRxInd": false,
                "IsProceduresInd": false,
                "IsSuperBillInd": false
            }
        }
        $scope.ModuleNamesInd = $scope.GetModuleNamesInd();
        $scope.ModuleNamesArray = [
            {
                "CategoryId": 1,
                "CategoryName": "Chief Complaints",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 2,
                "CategoryName": "Review Of System",
                "IsChecked": false,
                "SubTabsArray": [
                    {
                        "SubCategoryId": 3,
                        "SubCategoryName": "Allergies",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 37,
                        "SubCategoryName": "Ocular History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 72,
                        "SubCategoryName": "Ocular Surgical History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 4,
                        "SubCategoryName": "Current Eye Medications",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 69,
                        "SubCategoryName": "Systemic History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 7,
                        "SubCategoryName": "Surgical History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 73,
                        "SubCategoryName": "Current Systemic Medications",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 9,
                        "SubCategoryName": "Family History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 71,
                        "SubCategoryName": "Functional History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 46,
                        "SubCategoryName": "LifeStyle History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 70,
                        "SubCategoryName": "Vaccination History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 6,
                        "SubCategoryName": "Birth History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 8,
                        "SubCategoryName": "Nutritional History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 47,
                        "SubCategoryName": "Menstrual History",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 79,
                        "SubCategoryName": "Physical Evaluation",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 80,
                        "SubCategoryName": "Psychiatry",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 81,
                        "SubCategoryName": "Health Concerns And Goals",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 82,
                        "SubCategoryName": "Lab & Investigations",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 83,
                        "SubCategoryName": "Implants",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 84,
                        "SubCategoryName": "Psychological Observations",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 85,
                        "SubCategoryName": "Vitals",
                        "IsChecked": false,
                    },
                ],
            },
            {
                "CategoryId": 3,
                "CategoryName": "Vision & Perception",
                "IsChecked": false,
                "SubTabsArray": [
                    {
                        "SubCategoryId": 11,
                        "SubCategoryName": "Visual Acuity",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 49,
                        "SubCategoryName": "Auto Refraction",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 36,
                        "SubCategoryName": "Retinoscopy",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 42,
                        "SubCategoryName": "Present Glass Rx",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 50,
                        "SubCategoryName": "Manifest Refraction",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 54,
                        "SubCategoryName": "Cyclopegic Refraction",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 52,
                        "SubCategoryName": "Over Refraction",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 57,
                        "SubCategoryName": "Final Glass Rx",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 16,
                        "SubCategoryName": "Keratometry",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 60,
                        "SubCategoryName": "IOP & Pachy",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 61,
                        "SubCategoryName": "Pupil Size",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 74,
                        "SubCategoryName": "PAM",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 75,
                        "SubCategoryName": "Glare",
                        "IsChecked": false,
                    },
                ],
            },
            {
                "CategoryId": 9,
                "CategoryName": "Contact Lens",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 4,
                "CategoryName": "Examinations",
                "IsChecked": false,
                "SubTabsArray": [
                    {
                        "SubCategoryId": 24,
                        "SubCategoryName": "Anterior Segment",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 25,
                        "SubCategoryName": "Posterior Segment",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 38,
                        "SubCategoryName": "Dry Eye Evaluation",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 22,
                        "SubCategoryName": "Amsler Grid",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 78,
                        "SubCategoryName": "Confrontational Field Test",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 26,
                        "SubCategoryName": "Gonioscopy",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 77,
                        "SubCategoryName": "Hertels Examination",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 23,
                        "SubCategoryName": "Color Vision test",
                        "IsChecked": false,
                    }, {
                        "SubCategoryId": 41,
                        "SubCategoryName": "Lacrimal Patency",
                        "IsChecked": false,
                    },
                    {
                        "SubCategoryId": 21,
                        "SubCategoryName": "Motor examination / Squint evaluation / BV Testing",
                        "IsChecked": false,
                    },
                ],
            },
            {
                "CategoryId": 5,
                "CategoryName": "Assessment Plans",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 6,
                "CategoryName": "Orders",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 7,
                "CategoryName": "Medical Rx",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 8,
                "CategoryName": "Glass Rx",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 10,
                "CategoryName": "Procedures",
                "IsChecked": false,
                "SubTabsArray": [],
            },
            {
                "CategoryId": 11,
                "CategoryName": "Super Bill",
                "IsChecked": false,
                "SubTabsArray": [],
            },
        ];

        $scope.PrintObj = {
            'PrintType': 'Print',
            'IsPrintByModule': false
        }
        $scope.IsPrintByModule = true;
        $scope.ChangePrintTypeValue = function (Value) {
            if (Value == 'PrintByModule') {
                $scope.IsPrintByModule = true;
            } else {
                $scope.IsPrintByModule = false;
            }
        };
        $scope.CheckAllEmrCheckBoxes = function (Ischecked) {
            if (Ischecked) {
                for (let key in $scope.ModuleNamesInd) {
                    if ($scope.ModuleNamesInd.hasOwnProperty(key)) {
                        $scope.ModuleNamesInd[key] = true;
                    }
                }
            } else {
                $scope.ModuleNamesInd = $scope.GetModuleNamesInd();
            }
        }
        $scope.Historypopupnew = function (tab) {
            var HistoryTab = tab || 1;


            let mInstanceShow = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
                "controller": "HistorypopupnewCtrl",
                "backdrop": "static",
                //"scope": $scope,
                //"size": "lg",
               /* "windowClass": "offcanves-right",*/
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "keyboard": false,
                "resolve": {
                    "HistoryTab": function () { return HistoryTab },
                    "Patientid": function () { return angular.copy($scope.cacheStorageItem.patientid) },
                    "HospitalId": function () { return angular.copy($scope.HospitalId) },
                    "VisionObj": function () { return angular.copy($scope.VisionObj) },
                    "obj": function () { return angular.copy($scope.obj) },
                    "RefractionDetails": function () { return angular.copy($scope.PreviousInvestigationIdArray) },
                    "TonometrySubList": function () { return angular.copy($scope.TonometrySubList) },
                    "cacheStorageItem": function () { return angular.copy($scope.cacheStorageItem) },
                },

            });
        }


        $scope.NavtoNewimagemanagementPopup = function () {
            var pobject = {
                "From": 'OP'
            }
            var mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/NewimagemanagementV2.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "controller": "EhnoteImageManagementPopupCtrl",
                "resolve": {
                    "ModalitiesArray": function () { return angular.copy($scope.Modalities) },
                    "AllDoctorList": function () { return angular.copy($scope.AllDoctorList) },
                    "PatientOrderId": 0,
                    "IsComingFrom": function () { return angular.copy(pobject.From) }
                },
            });
            mInstanceAdd.result.then(function (SelectedInvestigationIdArray) {

                $scope.init();
            }, function (Investigation) {
                console.log("Cancel");

            });
        }

        $scope.SuperBillPrint = function () {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.AppointmentDoctorID }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": $scope.treatmentData[0].PatientArray || [],
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
                "SuperBillArray": $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.PatientAge || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID || '',
                "PatientDOB": $scope.cacheStorageItem.DOB || '',
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                "DoctorSignatureURL": $scope.DoctorSignature || '',
            }
            USPrintService.GenerateSuperBillPrint(obj);
        }

        $scope.clicktoNavtoSuperBill = function () {

            var Focus = '', Tab = 3; var type = "Superbill", Subtype = 'FromSuperBill';

            $scope.SelectedAppointmentObj.SubMainTab = 3;
            $scope.AssessmentInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/AddUpdateAssessmentpopup.html",
                "controller": "USAddUpdateAssessmentpopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "cache": function () { return angular.copy($scope.cacheStorageItem) },
                    "Focus": function () { return angular.copy(Focus) },
                    "allUserList": function () { return angular.copy($scope.allUserList) },
                    "Tabchange": function () { return Tab; },
                    "Modalities": function () { return angular.copy($scope.Modalities) },
                    "FinalObj": function () { return type; },

                    "checkInvArray": function () { return []; },
                    "CategoryList": function () { return [] },
                    "PosteriorLensDetails": function () { return [] },
                    "FocusSubTab": function () { return { "Focus": Focus, 'Subtype': Subtype } },
                    "BillItemFileUploadList": function () { return [] },
                    "BillItemList": function () { return [] },
                    "examtab": function () { return ''; },
                    "BranchList": function () { return $scope.BranchesListArray || []; },
                    "IsInsuranceAvailable": function () { return false; }
                },
                //"windowClass": "newassessmentspopupuib",
                "windowClass": "modal__popup--2 bottom-to-top-modal in"

            });
            $scope.AssessmentInstanceAdd.result.then(function (resp) {
                var consultationid = $scope.cacheStorageItem.ConsultationID || 0;
                var AppointmentID = $scope.cacheStorageItem.appointmentid;
                console.log(consultationid + "__" + AppointmentID);
                $scope.GetPatientAppointmenthistroy(consultationid, AppointmentID);


            })

        };

        $scope.openAddVisitPopup = function (id, Selecteditem) {
            Selecteditem = Selecteditem || '';
            $scope.ChartObj.IsComingFromChart = false;
            let SelectedVisitId = $scope.SelectedVisitId || 0;
            //$scope.cacheStorageItem.IsClinlicalVisitTypeEdit = $scope.IsClinlicalVisitTypeEdit || false;
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "AddVisitPopup.html",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                //"scope": $scope,
                /*"windowClass": "offcanves-right",*/
                "resolve": {
                    "cache": function () { return angular.copy($scope.cacheStorageItem); },
                    "FacilityList": function () { return angular.copy($scope.FacilityList) },
                    "clinicDoctorList": function () { return angular.copy($scope.clinicDoctorList) },
                    "ExamTypeList": function () { return angular.copy($scope.ExamTypeList) },
                    "AllVisitReasons": function () { return angular.copy($scope.AllVisitReasons) },
                    "PatientAllVisits": function () { return angular.copy($scope.PatientAllVisits) },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, cache, FacilityList, eHnoteMasterDataService, eHnoteUserAppointmentDataService, clinicDoctorList, ExamTypeList, AllVisitReasons, PatientAllVisits) {
                    $scope.cacheStorageItem = cache || {};
                    $scope.FacilityList = FacilityList || [];
                    $scope.clinicDoctorList = clinicDoctorList || []
                    $scope.ExamTypeList = ExamTypeList || []
                    $scope.AllVisitReasons = AllVisitReasons || []
                    $scope.PatientAllVisits = PatientAllVisits || []
                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                        && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                        var hospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    }

                    $scope.AppointmentDetailsForVist = [];
                    let AppointmentId = 0;
                    $scope.IsEditMood = false;

                    $scope.GetUpcomingAppointments = function (patientId) {
                        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                        $scope.cacheStorageItem.patientid = $scope.cacheStorageItem.patientid || 0;
                        if ($scope.cacheStorageItem.patientid == 0) {
                            return false;
                        }
                        var PHospitID = null;
                        var HospitID = null;
                        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                            PHospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                            HospitID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                        }
                        eHnoteUserAppointmentDataService.GetPatientUpcomingAppointments($scope.cacheStorageItem.patientid, PHospitID).then(function (response) {
                            console.log(response);
                            $scope.AllAppointmentsArray = [];
                            $scope.FutureAppointmentsArray = [];
                            $scope.UpcomingAppointmentArray = [];
                            $scope.IsCompleteandSend = false;
                            if (response.data.Status == "Success") {
                                if (response.data.AllAppointments.length > 0) {
                                    $scope.AllAppointmentsArray = angular.copy(response.data.AllAppointments);
                                    if ($scope.AllAppointmentsArray.length > 0) {
                                        angular.forEach($scope.AllAppointmentsArray, function (item) {
                                            item.ShowAppointmentNotes = false;
                                            item.ShortStartTime = $filter('date')(new Date(item.AppointmentDate + " " + item.StartTime), "hh:mm a");
                                        });
                                    }
                                }
                                if (response.data.rows.length > 0) {

                                    $scope.FutureAppointmentsArray = angular.copy(response.data.rows);
                                    //  $scope.UpcomingAppointmentArray = angular.copy(response.data.rows);
                                    angular.forEach(response.data.rows, function (item, index) {
                                        // if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4) {
                                        item.IsVisitcardCheckBox = false;
                                        $scope.UpcomingAppointmentArray.push(item);
                                        //}
                                    });
                                    angular.forEach($scope.UpcomingAppointmentArray, function (item) {
                                        let todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        item.IsCompleteandsendInd = false;
                                        item.IsCheckInInd = false;
                                        item.IsOnlyComplete = true;
                                        item.IsTodayAppointment = false;//Added because Asc Multiple appointments filter
                                        if (item.ConsultationDt > todaydate || item.ConsultationDt == todaydate) {
                                            item.IsHideCheckin = true;
                                        } else {
                                            item.IsHideCheckin = false;

                                        }
                                        if (item.ConsultationDt == todaydate) {
                                            item.IsOnlyComplete = false;
                                            item.IsTodayAppointment = true;
                                            if (item.AppointmentTypeId != 4 && item.AppointmentTypeId != 14 && item.AppointmentTypeId != 7 && item.AppointmentTypeId != 6) {
                                                $scope.AppointmentDetailsForVist.push(item);
                                                $scope.AddVisitObj.DocObj.SecondUserFullName = item.DoctorFullName || '';
                                                $scope.AddVisitObj.DocObj.DoctorID = item.DoctorId || null;
                                            }
                                        }

                                    });
                                    if ($scope.AppointmentDetailsForVist.length > 0 && id != 3) {
                                        AppointmentId = $scope.AppointmentDetailsForVist[0].AppointmentID || 0;
                                    }
                                }
                            } else {

                                alertify.error(Message);
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    };
                    $scope.GetUpcomingAppointments();
                    $scope.GEtAddVisitObj = function () {
                        let obj = {
                            "PatientId": $scope.cacheStorageItem.patientid || null,
                            "VisitReasonId": null,
                            "DoctorId": null,
                            "FacilityId": null,
                            "ParentVisitId": null,
                            "ExamTypeId": null,
                            "DocObj": {},
                            "doctorSearch": '',
                            "VisitReasonObj": {
                                Reason: ''
                            },
                            "OrganizationFacilityId": 0,
                            "ExamTypeId": 0,
                            "VisitId": 0,
                            "StatusFlag": "B",
                            "FacilityTypeId": 0,
                            "LinkVisitId": 0,
                        }
                        return obj;
                    }
                    id = id || 0;
                    $scope.AddVisitObj = $scope.GEtAddVisitObj();
                    //if (id == 3) {
                    //    $scope.cacheStorageItem.IsClinlicalVisitTypeEdit = true;
                    //}

                    if (id == 3) {
                        $scope.AddVisitObj.VisitReasonObj.VisitReasonId = Selecteditem.VisitReasonId || 0;
                        $scope.AddVisitObj.FacilityTypeId = 0;
                        $scope.AddVisitObj.DocObj.DoctorID = Selecteditem.DoctorId || 0;
                   /*     $scope.AddVisitObj.OrganizationFacilityId = Selecteditem.OrganizationFacilityId || 0;*/
                        AppointmentId = Selecteditem.AppointmentId || 0;
                        $scope.AddVisitObj.ExamTypeId = Selecteditem.ExamTypeId || 0;
                        $scope.AddVisitObj.VisitReasonObj.VisitReason = Selecteditem.VisitReason || 0;

                        if (SelectedVisitId != 0) {
                            $scope.AddVisitObj.VisitId = SelectedVisitId || 0;
                        }
                        $scope.IsEditMood = true;
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.selectDoctor = function (doctor) {
                        $scope.AddVisitObj.DocObj = doctor;
                    };
                    $scope.onSelectVisitReason = function (item, mainitem) {
                        /*VisitTypeId*/
                        //mainitem.OrganizationFacilityId = item.FacilityTypeId || 0;
                        //if (mainitem.OrganizationFacilityId != 0) {
                        //    var List1 = $filter("filter")($scope.FacilityList, function (Ditem,) { return Ditem.FacilityTypeId === item.FacilityTypeId; }) || [];
                        //    if (List1.length > 0) {
                        //        $scope.AddVisitObj.FacilityTypeId = List1[0].FacilityTypeId || 0;
                        //    } else {
                        //        $scope.AddVisitObj.FacilityTypeId = 0;
                        //    }
                        //}
                    }
                    //$scope.ChangeFacility = function (item, mainitem) {
                    //    var List1 = $filter("filter")($scope.FacilityList, function (Ditem,) { return Ditem.OrganizationFacilityId === $scope.AddVisitObj.OrganizationFacilityId; }) || [];
                    //    if (List1.length > 0) {
                    //        $scope.AddVisitObj.FacilityTypeId = List1[0].FacilityTypeId || 0;
                    //    } else {
                    //        $scope.AddVisitObj.FacilityTypeId = 0;
                    //    }

                    //}
                    $scope.AddVisit = function () {
                        var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                        var CurrentDate = $filter("date")(new Date(), "yyyy-MM-dd");
                        $scope.AddVisitObj.DocObj.DoctorID = $scope.AddVisitObj.DocObj.DoctorID || 0;
                        if ($scope.AddVisitObj.DocObj.DoctorID == 0) {
                            alertify.error("Select Doctor To  Add Visit");
                            return false;
                        }
                       
                        $scope.AppointmentDetailsForVist = $scope.AppointmentDetailsForVist || [];


                        //eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                        //var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                        var params = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "OrganizationId": $scope.HospitalId,
                            "PatientId": $scope.AddVisitObj.PatientId || null,
                            "StartTime": CurrentTime || null,
                            "EndTime": null,
                            "VisitDate": CurrentDate || null,
                            "VisitReasonId": $scope.AddVisitObj.VisitReasonObj.VisitReasonId || 0,
                            "DoctorId": $scope.AddVisitObj.DocObj.DoctorID || null,
                            "FacilityId": null,
                            "FacilityTypeId": null,
                            "ParentVisitId": $scope.AddVisitObj.LinkVisitId || null,
                            "VisitId": $scope.AddVisitObj.VisitId || null,
                            "AppointmentId": AppointmentId || 0,
                            "ExamTypeId": $scope.AddVisitObj.ExamTypeId || 0,
                            //"VisitTypeId": $scope.AddVisitObj.VisitReasonObj.VisitTypeId || 0,
                            "StatusFlag": 'B',



                        }
                        //console.log('add visit hi')
                        eHnoteMainAppointmentService.AddVisit(params).then(function (resp) {
                            if (resp.data.Status == 'Success') {
                                //console.log('add visit added')

                                $scope.AddVisitObj = $scope.GEtAddVisitObj();
                                $uibModalInstance.close();
                            }
                        }, function (err) {
                            alertify.error("Getting Failed");
                        });

                    }
                }
            });
            mInstanceAdd.result.then(function (resp) {
                $scope.GetAllPatientsvisits();
            }, function () { });
        };

        $scope.GetPatientPrescriptionDetails = function () {
            var params = {
                "PatientId": $scope.cacheStorageItem.patientid,
                "AppointmentId": appointmentinfo.AppointmentID,
                "PageSize": 10,
                "PageNumber": 1,
                "BranchId": $scope.HospitalID
            }
            eHnotePatientDataService.GetPatientPrescriptionDetails(params).then(function (resp) {

                if (resp.data.rows.length > 0) {
                    $scope.treatmentArray[0].PatientPrescription = resp.data.rows || [];
                    if ($scope.treatmentArray.length > 0) {
                        angular.forEach($scope.treatmentArray, function (pitem) {
                            angular.forEach(resp.data.rows, function (xitem) {
                                pitem.PatientPrescription.PrescriptionDetails = xitem.PrescriptionDetails || [];
                            });
                        });

                    }
                }

            });
        }
        $scope.visitAppointmentId = 0;
        $scope.CaseHistorytoVisit = function (appoinment) {
            var edited = $scope.CaseHistory.filter(function (eitem) { ((eitem.AppointmentId == appoinment.AppointmentId)) }) || [];
            /*  let appoinment = appoinment || '';*/
            console.log(appoinment);
            var appoint_info = {};

            appoint_info.TreatmentPlanId = appoinment.TreatmentPlanId || 0;
            appoint_info.AppointmentId = appoinment.AppointmentId || 0;
            appoint_info.ConsultationId = appoinment.ConsultationId || 0;
            appoint_info.BookingStatusId = appoinment.BookingStatusId || 0;
            //appoint_info.VisitTypeId = appoinment.VisitTypeId || 0;
            //appoint_info.HospitalEquipmentId = appoinment.HospitalEquipmentId || 0;
            appoint_info.AppointmentTypeId = appoinment.AppointmentTypeId || 0;
            appoint_info.PatientId = appoinment.PatientId || 0;
            eHnoteMasterDataService.addAppointmentInfo(appoint_info);


        }
        $scope.GetExamType = function () {
            return [{
                "ExamTypeId": 1,
                "ExamTypeName": "New Patient"
            },
            {
                "ExamTypeId": 2,
                "ExamTypeName": "Established Patient"
            }
            ];
        };
        $scope.ExamTypeList = angular.copy($scope.GetExamType()) || [];




        $scope.cacheStorageItem.PatientVisitId = 0;
        $scope.AddToCache();
        $scope.ChangeVisitId = function () {
            $scope.cacheStorageItem.PatientVisitId = $scope.AddVisitObj.VisitId || 0;
            $scope.AddToCache();
            $scope.GetPatientAppointmenthistroy();
        }

        $scope.GetAllPatientsvisits = function (navtype) {
            $scope.PatientAllVisits = [];
            var visitsobj = {
                "PatientId": $scope.cacheStorageItem.patientid,
            }
            eHnoteMainAppointmentService.GetAllPatientsvisits(visitsobj.PatientId).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.PatientAllVisits = resp.data.rows || [];
                    $scope.CaseHistory = resp.data.rows || [];
                    var VisitId = resp.data.rows[0].VisitId || 0;
                    var AppointmentId = resp.data.rows[0].AppointmentId || 0;
                    //$scope.cacheStorageItem.ConsultationID = resp.data.rows[0].ConsultationId || 0;
                    $scope.cacheStorageItem.PatientVisitId = VisitId || 0;
                    $scope.AddToCache();

                    $scope.AppointmentTypeId = resp.data.rows[0].AppointmentTypeId || 0;
                    $scope.ChartObj.DoctorId = resp.data.rows[0].DoctorId || 0;
                    $scope.ChartObj.DoctorName = resp.data.rows[0].DoctorName || "";
                    $scope.ChartObj.AppointmentDate = resp.data.rows[0].VisitDate || null;
                    if (AppointmentId != 0) {
                        $scope.ChartObj.AppointmentId = resp.data.rows[0].AppointmentId || 0;

                        //$scope.ChartObj.AppointmentTypeId = resp.data.rows[0].VisitTypeId || null;

                        $scope.ChartObj.AppointmentStatus = resp.data.rows[0].AppointmentStatus || "";
                        if ($scope.ChartObj.AppointmentStatus === 'C') {
                            $scope.ChartObj.AppointmentStatus = 'E';
                        }
                    }
                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    appoint_info.TreatmentPlanId = resp.data.rows[0].TreatmentPlanId || 0;
                    appoint_info.AppointmentID = resp.data.rows[0].AppointmentId || 0;
                    appoint_info.ConsultationId = resp.data.rows[0].ConsultationId || 0;
                    appoint_info.VisitId = resp.data.rows[0].VisitId || 0;
                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                    //$scope.IsClinlicalVisitTypeEdit = resp.data.rows[0].IsClinlicalVisitTypeEdit || false;
                    $scope.SelectedAppointmentId = resp.data.rows[0].AppointmentId || 0;
                    $scope.ChartObj.AppointmentTypeId = $scope.ChartObj.AppointmentTypeId || 0;





                    $scope.SelectedVisitId = 0;
                    $scope.ChartObj.FacilityTypeId = 0;

                    //if ($scope.IsAppointmentToday) {
                    $scope.ChartObj.FacilityTypeId = resp.data.rows[0].FacilityTypeId || 0;

                    //if ($scope.ChartObj.AppointmentTypeId != 4) {
                    $scope.ChartObj.IsComingFromChart = $scope.ChartObj.IsComingFromChart || false;
                    if ($scope.ChartObj.IsComingFromChart == true) {
                        $scope.ChartObj.DoctorId = $scope.SelectedAppointmentobj.DoctorId || 0;
                        $scope.ChartObj.DoctorName = $scope.SelectedAppointmentobj.DoctorName || "";
                        $scope.ChartObj.AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                        $scope.ChartObj.AppointmentDate = $scope.SelectedAppointmentobj.VisitDate || null;
                        $scope.SelectedVisitId = $scope.SelectedAppointmentobj.VisitId || 0;
                        var ConsultationId = $scope.SelectedAppointmentobj.ConsultationId || 0;
                        var AppointmentId = $scope.SelectedAppointmentobj.AppointmentId || 0;
                        $scope.cacheStorageItem.PatientVisitId = $scope.SelectedVisitId || 0;
                        $scope.AddToCache();
                        $scope.GetPatientAppointmenthistroy('', $scope.ChartObj.AppointmentId);
                    }


                    /*}*/
                    else if ($scope.ChartObj.FacilityTypeId == 1) {
                        $scope.SelectedVisitId = resp.data.rows[0].VisitId || 0;
                        $scope.ChartObj.AppointmentId = resp.data.rows[0].AppointmentId || 0;

                        $scope.GetPatientAppointmenthistroy('', $scope.ChartObj.AppointmentId);
                    }
                    /*}*/
                    var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                    if (currentdate === $scope.ChartObj.AppointmentDate) {
                        $scope.IsAppointmentToday = true;
                    } else {
                        $scope.IsAppointmentToday = false;
                    }
                    if (navtype === "navToSummary") {
                        $scope.ChartObj.SubMainTab = 1;
                    }
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });

        }
        $scope.closevisit = function () {
            $scope.modalInstance.dismiss("cancel");
        }
        $scope.LatestUpdate = function () {
            $scope.getMedicationsFromRcopia();
            $scope.getPrescriptionsFromRcopia();
        }

        $scope.ShowDocumentsPopup = function () {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/FilesPopUp.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "resolve": {
                    "cacheStorageItem": function () { return $scope.cacheStorageItem; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, cacheStorageItem) {
                    $scope.cacheStorageItem = angular.copy(cacheStorageItem);
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss();
                    };
                },
            });
        };


        $scope.getPrescriptionRequestObj = {
            "UserId": $scope.UserId,
            "RcopiaPatientId": $scope.selectedPatientData.Patient[0].RcopiaPatientId,
            "LastUpdatedDate": "08/30/2022 12:00:00"
        };
        $scope.getPrescriptionsFromRcopia = function () {
            $scope.getPrescriptionRequestObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId;




            var lastUpdatedDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
            var MaximumLastUpdateDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");

            var previousDate = new Date()
            previousDate.setDate(previousDate.getDate() - 1)
            var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

            //if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
            //    angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (pitem) {

            //        $scope.value = pitem.PatientPrescriptionId;
            //    });

            //}

            var params = {
                "UserId": $scope.UserId,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
                "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
                "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
                "RcopiaPatientId": $scope.getPrescriptionRequestObj.RcopiaPatientId,
                "LastUpdateDate": PreviousDate,
                //"MaximumLastUpdateDate": MaximumLastUpdateDate,
                "ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "AppointmentId": $scope.appointmentInfo.AppointmentID,
                "PatientId": $scope.selectedPatientData.Patient[0].PatientID,
                //"PatientPrescriptionId": $scope.value || 0,
                "PrescribedDate": lastUpdatedDate
            };

            //if (params.PatientPrescriptionId !== 0) {

            //    if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
            //        var update = $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate;
            //        var UpDate = $filter('date')(update, "MM/dd/yyyy HH:mm:ss");

            //        params.LastUpdateDate = UpDate;
            //    }
            //}

            eHnoteDiagnosisDataServices.getPatientPrescriptionsFromRcopia(params).then(function (response) {



                if (response.status === 'Success') {

                }




                //$scope.GetPatientPrescriptionDetails();


            });
        };
        $scope.getMedicationsRequestObj = {
            "UserId": $scope.UserId,
            "PatientRcopiaId": $scope.selectedPatientData.Patient[0].RcopiaPatientId,
            "LastUpdatedDate": "08/30/2022 12:00:00"
        };
        $scope.getMedicationsFromRcopia = function () {
            $scope.getMedicationsRequestObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId;


            var lastUpdatedDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
            var MaximumLastUpdateDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");



            var previousDate = new Date()
            previousDate.setDate(previousDate.getDate() - 1)
            var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");



            //if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
            //    angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (pitem) {

            //        $scope.value = pitem.PatientPrescriptionId;
            //    });

            //}


            var params = {
                "UserId": $scope.UserId,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
                "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
                "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
                "RcopiaPatientId": $scope.getMedicationsRequestObj.RcopiaPatientId,
                "LastUpdateDate": PreviousDate,
                //"MaximumLastUpdateDate": MaximumLastUpdateDate,
                "ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "AppointmentId": $scope.appointmentInfo.AppointmentID,
                "PatientId": $scope.appointmentInfo.PatientID,
                //"PatientPrescriptionId": $scope.value || 0,
                "PrescribedDate": lastUpdatedDate
            }

            //if (params.PatientPrescriptionId !== 0) {
            //    if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
            //        var update = $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate;
            //        var UpDate = $filter('date')(update, "MM/dd/yyyy HH:mm:ss");

            //        params.LastUpdateDate = UpDate;
            //    }
            //}




            console.log(params.LastUpdateDate + "__LastUpdateDate");

            eHnoteDiagnosisDataServices.getPatientMedicationsFromRcopia(params).then(function (response) {



                var newUpdatedTime = params.LastUpdateDate;
                if (response.data.Status === 'Success') {
                    //newUpdatedTime = response.data.LastUpdateDate;
                    //console.log(newUpdatedTime + "__newUpdatedTime");
                    //if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    //    $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate = newUpdatedTime;
                    //}
                    //$scope.AddToCache();
                }



                //$scope.getPrescriptionsFromRcopia();
                $scope.GetPatientAppointmenthistroy();

            });


        };

        $scope.IsfutureAppt = false;
        if ($scope.currentdate >= $scope.appointmentInfo.ConsultationDt) {
            $scope.IsfutureAppt = true;
        }
    }]);
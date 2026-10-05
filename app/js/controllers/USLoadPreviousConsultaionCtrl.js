eHnoteWebApp.controller('USLoadPreviousConsultaionCtrl', ['$scope', '$rootScope', '$filter', 'eHnoteProcedureDataService', 'eHnoteMasterDataService', 'datacookieFactory', 'eHnoteCacheStorageService', 'eHnoteValidateUsersDataService', 'eHnotePatientDataService', '$location', 'alertify', 'eHnoteLoginStatusService', 'eHnotePrintService', 'eHnoteMainAppointmentService', '$window', 'eHnoteDiagnosisDataServices', "Lightbox", "eHnoteSettingsDataService", "textAngularManager", "taRegisterTool", "$timeout", "$uibModal", "localStorageFactory", "eHnoteUserAppointmentDataService", "$uibModalInstance", function ($scope, $rootScope, $filter, eHnoteProcedureDataService, eHnoteMasterDataService, datacookieFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnotePatientDataService, $location, alertify, eHnoteLoginStatusService, eHnotePrintService, eHnoteMainAppointmentService, $window, eHnoteDiagnosisDataServices, Lightbox, eHnoteSettingsDataService, textAngularManager, taRegisterTool, $timeout, $uibModal, localStorageFactory, eHnoteUserAppointmentDataService, $uibModalInstance) {
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
    var docid = doctorinfo.doctorid;
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
/*    $scope.PatientId = $scope.cacheStorageItem.PatientID;*/
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    }
    $scope.SummaryTab = 1;
    $scope.changetab = function (val) {
        $scope.SummaryTab = val;
    }

    console.log($scope.doctorinfo);
    console.log(appointmentinfo.AppointmentID);

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.cacheStorageItem.appointmentid = $scope.cacheStorageItem.appointmentid || 0;
    console.log($scope.cacheStorageItem.appointmentid);

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.PatientId = appointmentinfo.PatientID;
    $scope.PatientName = appointmentinfo.PatientName || "";
    $scope.AppointmentDate = appointmentinfo.ConsultationDt || $filter("date")(new Date(), "yyyy-MM-dd");
    $scope.AppointmentId = appointmentinfo.AppointmentID ? appointmentinfo.AppointmentID : $scope.cacheStorageItem.appointmentid;

    $scope.GOTOConsultation = function () {
        $uibModalInstance.close();
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


    $scope.GetPatientAppointmenthistroy = function (consultationid, AppointmentID) {
        var type = 0;
        if (consultationid === 0) {
            type = 1;
        }
        var object = {
            "AppointmentId": AppointmentID,
            "Type": type
        };
        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.treatmentData = resp.data;
                $scope.treatmentArray = [];

                angular.forEach(resp.data, function (item) {
                    if (AppointmentID === item.AppointmentId) {

                        // to show appointmnt date, time and doctor name
                        let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                        ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                        item.AppointmentTime = ApptTime;

                        $scope.treatmentArray.push(item);
                    }
                });

                if (resp.data.length > 0) {
                    $scope.referalMailBind = resp.data[0].ReferralDocemail || "";
                    $scope.referalDoctorID = resp.data[0].ReferalDoctorId;
                    $scope.cacheStorageItem.ReferalDoctorName = resp.data[0].ReferalDoctorName || "";
                    $scope.cacheStorageItem.RefeRalDoctorNotes = resp.data[0].RefeRalDoctorNotes || "";
                }

                $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                if ($scope.SelectedPlanArray.length > 0) {
                    $scope.RestructureToconsultation($scope.SelectedPlanArray[0], consultationid);
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
                    });
                }

                $scope.cacheStorageItem.FamilyHistory = $scope.cacheStorageItem.FamilyHistory || [];
                if ($scope.cacheStorageItem.FamilyHistory.length > 0) {
                    angular.forEach($scope.cacheStorageItem.FamilyHistory, function (Fitem) {
                        Fitem.RelationShipId = Fitem.RelationId || 0;
                        Fitem.RelationShipName = Fitem.RelationName || '';
                    });
                }

            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };




    $scope.showConsultationDetails = false;

    $scope.ChangesConsultation = function (item) {
        var ConsultationId = item.ConsultationId || 0;
        var AppointmentId = item.AppointmentId || 0;
        $scope.ChartObj.DoctorId = item.DoctorId || 0;
        $scope.ChartObj.AppointmentId = item.AppointmentId || 0;
        $scope.ChartObj.AppointmentDate = item.AppointmentDate || 0;

        $scope.SelectedAppointmentId = item.AppointmentId || 0;
        $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);

        var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
        if (currentdate === $scope.ChartObj.AppointmentDate) {
            $scope.IsAppointmentToday = true;
        } else {
            $scope.IsAppointmentToday = false;
        }

        $scope.showConsultationDetails = true;

        //$scope.chiefComplaintsOpen = true;
        //$scope.reviewOfSystemsOpen = true;
        //$scope.VisionandPerceptionOpen = true;
        //$scope.ContactLensOpen = true;
        //$scope.ExaminationOpen = true;
        //$scope.AssessmentOpen = true;
        //$scope.OrdersOpen = true;
        //$scope.ProceduresOpen = true;
        //$scope.SuperBillOpen = true;
        //$scope.CoordinatorOpen = true;

        $scope.chiefComplaintsCopied = false;
        $scope.reviewOfSystemsCopied = false;
        $scope.visionAndPerceptionCopied = false;
        $scope.ContactLensCopied = false;
        $scope.ExaminationCopied = false;
        $scope.AssessmentCopied = false;
        $scope.OrdersCopied = false;
        $scope.ProceduresCopied = false;
        $scope.SuperBillCopied = false;
        $scope.CoordinatorCopied = false;
    }

    $scope.UnSignObj = {
        "SummaryView": false
    };
    $scope.ConsultationObj = {
        "SummaryView": false
    };
    $scope.ChartObj = {
        "SubMainTab": 1,
        "AppointmentId": null,
        "AppointmentDate": null,
        "IsComingFromChart": false,
        "DoctorId": null,

    }

    $scope.IsAppointmentToday = false;
    $scope.init = function () {

        $scope.CaseHistory = [];
        $scope.treatmentArray = [];
        $scope.SelectedAppointmentId = 0;
        $scope.GetOpthaPatientCaseHistory();
        $scope.GetMasterTestUsed();
    }



    $scope.GetOpthaPatientCaseHistory = function () {
        $scope.CaseHistory = [];
     /*   $scope.Pastdates = [];*/
        var AppointmentTypeIds = null;
        AppointmentTypeIds = "1,2,3,5,6,8,9";


        var object = {
            "PatientID": $scope.cacheStorageItem.patientid,
            "HospitalID": $scope.HospitalId,
            "AppointmentTypeIds": AppointmentTypeIds
        };
        eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
            if (resp.data !== undefined) {

                if (resp.data.length > 0) {

                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    var dateObj = new Date(currentDate);
                    var year = dateObj.getFullYear();
                    var month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1 and pad with zero if needed
                    var day = String(dateObj.getDate()).padStart(2, "0");
                    var formattedDate = year + "-" + month + "-" + day;
                   
                    //$scope.Pastdates = resp.data.filter(function (appointment) {
                    //    var appointmentDate = new Date(appointment.AppointmentDate);
                    //    return appointmentDate < currentDate;
                    //});

                    var pastdatefilter = $filter("filter")(resp.data, function (item, index) { return item.AppointmentDate != formattedDate });

                    $scope.CaseHistory = pastdatefilter || [];
                    var ConsultationId = resp.data[0].ConsultationId || 0;
                    var AppointmentId = resp.data[0].AppointmentId || 0;

                    $scope.ChartObj.DoctorId = resp.data[0].DoctorId || 0;
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

                    $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);

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

    $scope.GetMasterTestUsed = function () {
        $scope.MasterTestUsedlist = [];
        eHnoteSettingsDataService.GetMasterTestUsed().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.MasterTestUsedlist = resp.data.rows || [];
            }

        });
    };
    $scope.init();


    $scope.RestructureToconsultation = function (plan, consultationid) {

        plan = plan || "";
        console.log("plan log");
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
        if (plan !== "") {
            if (plan.ReferalDoctorId) {
                $scope.cacheStorageItem.ReferalDoctorId = plan.ReferalDoctorId || "";
                $scope.cacheStorageItem.RefeRalDoctorNotes = plan.RefeRalDoctorNotes || "";
                $scope.cacheStorageItem.ReferalDoctorName = plan.ReferalDoctorName || "";
                $scope.cacheStorageItem.ReferalDoctorType = plan.referraldoctype || "";
                $scope.cacheStorageItem.ReferalOrgId = plan.ReferalOrgId || "";
                $scope.cacheStorageItem.ReferalId = plan.ConsulRefId;
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
            if (plan.ROSCommonRemarks !== undefined) {
                if (plan.ROSCommonRemarks.length !== '') {
                    $scope.cacheStorageItem.ROSCommonRemarks = plan.ROSCommonRemarks || "";
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
                    $scope.cacheStorageItem.CurrentEyeMedications = plan.CurrentEyeMedications;

                    angular.forEach($scope.cacheStorageItem.CurrentEyeMedications, function (suitem) {
                        suitem.DeleteInd = "N";
                    });
                }
            }

            //BirthHistory
            if (plan.BirthHistory !== undefined) {
                if (plan.BirthHistory.length !== 0) {
                    $scope.cacheStorageItem.BirthHistory = plan.BirthHistory;

                    angular.forEach($scope.cacheStorageItem.BirthHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //NutritionalHistory
            if (plan.NutritionalHistory !== undefined) {
                if (plan.NutritionalHistory.length !== 0) {
                    $scope.cacheStorageItem.NutritionalHistory = plan.NutritionalHistory;

                    angular.forEach($scope.cacheStorageItem.NutritionalHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //SystemicHistory
            if (plan.SystemicHistory !== undefined) {
                if (plan.SystemicHistory.length !== 0) {
                    $scope.cacheStorageItem.SystemicHistory = plan.SystemicHistory;

                    angular.forEach($scope.cacheStorageItem.SystemicHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //MenstrualHistory
            if (plan.MenstrualHistory !== undefined) {
                if (plan.MenstrualHistory.length !== 0) {
                    $scope.cacheStorageItem.MenstrualHistory = plan.MenstrualHistory;

                    angular.forEach($scope.cacheStorageItem.MenstrualHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //SurgicalHistory
            if (plan.SurgicalHistory !== undefined) {
                if (plan.SurgicalHistory.length !== 0) {
                    $scope.cacheStorageItem.SurgicalHistory = plan.SurgicalHistory;

                    angular.forEach($scope.cacheStorageItem.SurgicalHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //FunctionalStatusHistory
            if (plan.FunctionalStatusHistory !== undefined) {
                if (plan.FunctionalStatusHistory.length !== 0) {
                    $scope.cacheStorageItem.FunctionalStatusHistory = plan.FunctionalStatusHistory;

                    angular.forEach($scope.cacheStorageItem.FunctionalStatusHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //CurrentSystemicMedicationsHistory
            if (plan.CurrentSystemicMedicationsHistory !== undefined) {
                if (plan.CurrentSystemicMedicationsHistory.length !== 0) {
                    $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = plan.CurrentSystemicMedicationsHistory;

                    angular.forEach($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, function (suitem) {
                        suitem.ActiveInd = true;
                        suitem.DeleteInd = "N";
                        suitem.Frequency = suitem.Dosage || "";
                    });
                }
            }
            //OccularSurgicalHistory
            if (plan.OccularSurgicalHistory !== undefined) {
                if (plan.OccularSurgicalHistory.length !== 0) {
                    $scope.cacheStorageItem.OcularSurgicalHistory = plan.OccularSurgicalHistory;

                    angular.forEach($scope.cacheStorageItem.OcularSurgicalHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //OccularHistory
            if (plan.OccularHistory !== undefined) {
                if (plan.OccularHistory.length !== 0) {
                    $scope.cacheStorageItem.OccularHistory = plan.OccularHistory;

                    angular.forEach($scope.cacheStorageItem.OccularHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //LifestyleHistory
            if (plan.LifestyleHistory !== undefined) {
                if (plan.LifestyleHistory.length !== 0) {
                    $scope.cacheStorageItem.LifestyleHistory = plan.LifestyleHistory;

                    //angular.forEach($scope.cacheStorageItem.LifestyleHistory, function (suitem) {
                    //    suitem.ActiveInd = true;
                    //});
                }
            }
            //FamilyHistory
            if (plan.FamilyHistory !== undefined) {
                if (plan.FamilyHistory.length !== 0) {
                    $scope.cacheStorageItem.FamilyHistory = plan.FamilyHistory;

                    angular.forEach($scope.cacheStorageItem.FamilyHistory, function (suitem) {
                        suitem.ActiveInd = true;
                    });
                }
            }
            //VaccinationHistory
            if (plan.VaccinationHistory !== undefined) {
                if (plan.VaccinationHistory.length !== 0) {
                    $scope.cacheStorageItem.VaccinationHistory = plan.VaccinationHistory;

                    angular.forEach($scope.cacheStorageItem.VaccinationHistory, function (suitem) {
                        suitem.ActiveInd = true;
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

            //AssessmentPlan
            if (plan.AssessmentPlan !== undefined) {
                if (plan.AssessmentPlan.length !== 0) {
                    $scope.cacheStorageItem.FAssessmentPlan = [];
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
                                //var object = {
                                //    "PatientTreatmentId": item.PatientTreatmentId,
                                //    "SpecializationId": item.SpecializationId,
                                //    "OrganId": item.OrganId,
                                //    "OrganName": OrganName,
                                //    "CreatedDateTime": item.CreatedDateTime,
                                //    "TreatmentData": {
                                //        "TreatmentHistoryId": item.TreatmentHistoryId,
                                //        "ProcedureId": item.ProcedureId,
                                //        "OrgProcedureId": item.OrgProcedureId,
                                //        "TreatmentName": item.TreatmentName,
                                //        "TreatmentNotes": item.TreatmentNotes,
                                //        "ModifiedBy": item.ModifiedBy,
                                //        "ModifiedDt": item.ModifiedDt,
                                //        "TreatmentStatusName": item.TreatmentStatusName,
                                //        // "ProcedureMaxCost": patientTypeCost,
                                //        //"TreatmentCost": patientTypeCost,
                                //        "Multiplyfactor": item.Multiplyfactor,
                                //        "DiscountCost": 0,
                                //        // "TreatmentStatus": "1",
                                //        "discountValue": "",
                                //        "discountType": "A",
                                //        "TreatmentDiscountAmt": 0,
                                //        "SurgeryStatusId": 0,
                                //        "TotalSittings": 0,
                                //        "ActiveInd": "Y",
                                //        "CPTCode": item.CPTCode || ""
                                //    },
                                //    "ActiveInd": 'Y'
                                //};
                                //$scope.ProceduresArray.push(object);
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
                                    "ProcedureNotes": "",
                                    "DeleteInd": "N",
                                    "StatusId": item.StatusId,
                                    "BookingStatusId": item.BookingStatusId || "",
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
                        $scope.cacheStorageItem.FAssessmentPlan.push(diag);

                    });
                }
                else {
                    $scope.cacheStorageItem.FAssessmentPlan = plan.AssessmentPlan || [];
                }
            } else {
                $scope.cacheStorageItem.FAssessmentPlan =  [];
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
            $scope.Modifiers = $scope.Modifiers || [];
            if ($scope.Modifiers.length == 0) {
                $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
            }
            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                    if (item.DiagnosisArray.length > 0) {
                        item.ShowDiagForAdd = true;
                    } else {
                        item.ShowDiagForAdd = false;
                    }
                    console.log($scope.Modifiers);
                    let tempModifiers = angular.copy($scope.Modifiers) || [];
                    angular.forEach(tempModifiers, function (kitem) {
                        angular.forEach(item.Modifiers, function (hitem) {
                            if (kitem.MODIFIERID == hitem.MODIFIERID) {
                                kitem.IsChecked = true;
                            }
                        });
                    });

                    item.Modifiers = angular.copy(tempModifiers) || [];
                    item.DeleteInd = item.DeleteInd || false;

                });


            }

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
            if (plan.PosteriorSegmentDetails !== undefined) {
                $scope.cacheStorageItem.FinalPosteriorDetails = plan.PosteriorSegmentDetails || [];
            }
            //if (plan.TonoMetryDetails !== undefined) {
            //    $scope.cacheStorageItem.FinalTonoMetryDetails = plan.TonoMetryDetails || [];
            //}
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

            plan.NewAmslerGridArray = plan.NewAmslerGridArray || [];
            if (plan.NewAmslerGridArray.length > 0) {
                $scope.cacheStorageItem.FinalNewAmslerGridArray = plan.NewAmslerGridArray || [];
            }
            plan.ConfrontationalFieldTestDetails = plan.ConfrontationalFieldTestDetails || [];
            if (plan.ConfrontationalFieldTestDetails.length > 0) {
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
                        var filetrarray = $filter("filter")($scope.cacheStorageItem.ROSAllergyRemarkDetails, function (iterator, ind) { return iterator.CustomAllergyRemarkCategory == hitem.Name && iterator.CustomAllergyValue != ''; }) || [];
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
            if (plan.RetinoscopyRefractionArray != undefined) {
                if (plan.RetinoscopyRefractionArray.length > 0) {
                    $scope.cacheStorageItem.FinalRetinoscopyRefractionDetails = plan.RetinoscopyRefractionArray || [];
                } else {
                    $scope.cacheStorageItem.FinalRetinoscopyRefractionDetails = [];
                }
            }
            if (plan.PGPrefractionArray != undefined) {
                if (plan.PGPrefractionArray.length > 0) {
                    $scope.cacheStorageItem.FinalPGPRefractionDetails = plan.PGPrefractionArray || [];
                } else {
                    $scope.cacheStorageItem.FinalPGPRefractionDetails = [];
                }
            }
            if (plan.ManifestRefractionArray != undefined) {
                if (plan.ManifestRefractionArray.length > 0) {
                    $scope.cacheStorageItem.FinalManifestRefractionDetails = plan.ManifestRefractionArray || [];
                } else {
                    $scope.cacheStorageItem.FinalManifestRefractionDetails = [];
                }
            }
            if (plan.OverRefractionArray != undefined) {
                if (plan.OverRefractionArray.length > 0) {
                    $scope.cacheStorageItem.FinalOverRefractionDetails = plan.OverRefractionArray || [];
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
            }
            if (plan.CycloplegicRefractionArray != undefined) {
                if (plan.CycloplegicRefractionArray.length > 0) {
                    $scope.cacheStorageItem.FinalCycloplegicRefractionDetails = plan.CycloplegicRefractionArray || [];
                } else {
                    $scope.cacheStorageItem.FinalCycloplegicRefractionDetails = [];
                }
            }
            $scope.cacheStorageItem.SquintPossibleDiagnosis = angular.copy(plan.SquintPossibleDiagnosis) || "";
            $scope.cacheStorageItem.BVPossibleDiagnosis = angular.copy(plan.BVPossibleDiagnosis) || "";

            if (plan.StatusFlag === 'C') {
                $scope.cacheStorageItem.appointmentStatus = 'E';
            }
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            // loadEditConsultationData();
        }


    };


    $scope.chiefComplaintsOpen = false;
    $scope.reviewOfSystemsOpen = false;
    $scope.VisionandPerceptionOpen = false;
    $scope.ContactLensOpen = false;
    $scope.ExaminationOpen = false;
    $scope.AssessmentOpen = false;
    $scope.OrdersOpen = false;
    $scope.ProceduresOpen = false;
    $scope.SuperBillOpen = false;
    $scope.CoordinatorOpen = false;


    $scope.savedCopiedAccordions = [];

 
    $scope.reviewOfSystemsCopied = [];
    $scope.VisionandPerceptionCopied = [];
    $scope.ContactLensCopied = [];
    $scope.ExaminatiosCopied = [];
    $scope.AssessmentCopied = [];
    $scope.OrdersCopied = [];
    $scope.ProceduresCopied = [];
    $scope.SuperBillCopied = [];
    $scope.CoordinatorCopied = [];

    $scope.toggleAccordion = function (section) {
        if (section === 'chiefComplaints') {
            $scope.chiefComplaintsOpen = !$scope.chiefComplaintsOpen;
        } else if (section === 'reviewOfSystems') {
         /*   $scope.chiefComplaintsOpen = false;*/
            $scope.reviewOfSystemsOpen = !$scope.reviewOfSystemsOpen;
        } else if (section === 'visionAndPerception') {
            $scope.VisionandPerceptionOpen = !$scope.VisionandPerceptionOpen;
        }
        else if (section === 'ContactLens') {
            $scope.ContactLensOpen = !$scope.ContactLensOpen;
        }
        else if (section === 'Examination') {
            $scope.ExaminationOpen = !$scope.ExaminationOpen;
        }
        else if (section === 'Assessment') {
            $scope.AssessmentOpen = !$scope.AssessmentOpen;
        }
        else if (section === 'Orders') {
            $scope.OrdersOpen = !$scope.OrdersOpen;
        }
        else if (section === 'Procedures') {
            $scope.ProceduresOpen = !$scope.ProceduresOpen;
        }
        else if (section === 'SuperBill') {
            $scope.SuperBillOpen = !$scope.SuperBillOpen;
        }
        else if (section === 'Coordinator') {
            $scope.CoordinatorOpen = !$scope.CoordinatorOpen;
        }
    };

    $scope.chiefComplaintsCopied = false;
    $scope.reviewOfSystemsCopied = false;
    $scope.visionAndPerceptionCopied = false;
    $scope.ContactLensCopied = false;
    $scope.ExaminationCopied = false;
    $scope.AssessmentCopied = false;
    $scope.OrdersCopied = false;
    $scope.ProceduresCopied = false;
    $scope.SuperBillCopied = false;
    $scope.CoordinatorCopied = false;


    var obj = {
        "ChiefComplaints": [],
        "AllergyItems": [],
        "OccularHistory": [],
        "OcularSurgicalHistory": [],
        "CurrentEyeMedications": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "CurrentSystemicMedicationsHistory": [],
        "FamilyHistory": [],
        "FunctionalStatusHistory": [],
        "VaccinationHistory": [],
        "LifestyleHistory": [],
        "BirthHistory": [],
        "NutritionalHistory": [],
        "MenstrualHistory": [],
        "ROSAllergyRemarkDetails": [],
        "AutoRefractionDetails": [],
        "RetinoscopyRefractionDetails": [],
        "PGPRefractionDetails": [],
        "ManifestRefractionDetails": [],
        "OverRefractionDetails": [],
        "CycloplegicRefractionDetails": [],
        "GlassRxRefractionDetails": [],
        "VisionDetails": [],
        "TonoMetryDetails": [],
        "PupilSizeDetails": [],
        "PachymetryDetails": [],
        "GlareDetails": [],
        "Vitals": [],
        "KeratometryDetails": [],
        "InvestigationDetails": [],
        "AnteriorDetails": [],
        "PosteriorDetails": [],
        "ExternalExaminationDetails": [],
        "NineGazeExtraOcularDetails": [],
        "SquintDetails": [],
        "HeadPosterDetails": [],
        "NearInvestigationdetails": [],
        "DryEyeEvaluationData": [],
        "GonioscopyDetails": [],
        "NewAmslerGridArray": [],
        "ConfrontationalFieldArray": [],
        "ColorVisionDetails": [],
        "LacrimalPatiencyDetails": [],
        "LacrimalPatencyRemarks": [],
        "HertelsExaminationArray": [],
        "AssessmentPlan": [],
        "InvestigationsDetails": [],
        "SurgeriesDetails": [],
        "ProceduresDetails": [],
        "ReferralDetails": [],
        "Prescriptions": [],
        "GlassDetails": [],
        "OPProceduresArray": [],
        "SuperBillSuggestedCodes": [],
        "ROSCommonRemarks":  "",

    }

    $scope.CopyConsultationDetails = angular.copy(obj);

    $scope.copyAccordion = function (section) {

        if (section === 'chiefComplaints') {
            if ($scope.CopyConsultationDetails.ChiefComplaints === 0) {

                //$scope.CopyConsultationDetails.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints;
                $scope.CopyConsultationDetails.ChiefComplaints = $scope.cacheStorageItem.ChiefComplaints;
            } else {
                angular.forEach($scope.cacheStorageItem.ChiefComplaints, function (newItem) {
                    var isDuplicate = $filter('filter')($scope.CopyConsultationDetails.ChiefComplaints, { ChiefComplaintId: newItem.ChiefComplaintId }, true).length > 0;
                    if (!isDuplicate) {
                        $scope.CopyConsultationDetails.ChiefComplaints.push(newItem);
                    }
                });
            }
        }else if (section === 'reviewOfSystems') {
            if ($scope.treatmentArray.length > 0) {

                $scope.CopyConsultationDetails.AllergyItems.push($scope.cacheStorageItem.AllergyItems[0]);
                $scope.CopyConsultationDetails.BirthHistory.push($scope.cacheStorageItem.BirthHistory[0] || []);
                $scope.CopyConsultationDetails.CurrentEyeMedications.push($scope.cacheStorageItem.CurrentEyeMedications[0]);
                $scope.CopyConsultationDetails.CurrentSystemicMedicationsHistory.push($scope.cacheStorageItem.CurrentSystemicMedicationsHistory[0]);
                $scope.CopyConsultationDetails.FamilyHistory.push($scope.cacheStorageItem.FamilyHistory[0]);
                $scope.CopyConsultationDetails.FunctionalStatusHistory.push($scope.cacheStorageItem.FunctionalStatusHistory[0]);
                $scope.CopyConsultationDetails.LifestyleHistory.push($scope.cacheStorageItem.LifestyleHistory[0]);
                $scope.CopyConsultationDetails.MenstrualHistory.push($scope.cacheStorageItem.MenstrualHistory[0]);
                $scope.CopyConsultationDetails.NutritionalHistory.push($scope.cacheStorageItem.NutritionalHistory[0]);
                $scope.CopyConsultationDetails.OccularHistory.push($scope.cacheStorageItem.OccularHistory[0]);
                $scope.CopyConsultationDetails.OcularSurgicalHistory.push($scope.cacheStorageItem.OcularSurgicalHistory[0]);
                $scope.CopyConsultationDetails.ROSAllergyRemarkDetails.push($scope.cacheStorageItem.ROSAllergyRemarkDetails[0]);
                $scope.CopyConsultationDetails.SurgicalHistory.push($scope.cacheStorageItem.SurgicalHistory[0]);
                $scope.CopyConsultationDetails.SystemicHistory.push($scope.cacheStorageItem.SystemicHistory[0]);
                $scope.CopyConsultationDetails.VaccinationHistory.push($scope.cacheStorageItem.VaccinationHistory[0]);
                $scope.CopyConsultationDetails.ROSCommonRemarks.push($scope.cacheStorageItem.ROSCommonRemarks[0]);

            }

        }
        else if (section === 'visionAndPerception') {
            if ($scope.treatmentArray.length > 0) {

                $scope.CopyConsultationDetails.AutoRefractionDetails.push($scope.cacheStorageItem.FinalAutoRefractionDetails[0]);
                $scope.CopyConsultationDetails.RetinoscopyRefractionDetails.push($scope.cacheStorageItem.FinalRetinoscopyRefractionDetails[0] || []);
                $scope.CopyConsultationDetails.PGPRefractionDetails.push($scope.cacheStorageItem.FinalPGPRefractionDetails[0]);
                $scope.CopyConsultationDetails.ManifestRefractionDetails.push($scope.cacheStorageItem.FinalManifestRefractionDetails[0]);
                $scope.CopyConsultationDetails.OverRefractionDetails.push($scope.cacheStorageItem.FinalOverRefractionDetails[0]);
                $scope.CopyConsultationDetails.CycloplegicRefractionDetails.push($scope.cacheStorageItem.FinalCycloplegicRefractionDetails[0]);
                $scope.CopyConsultationDetails.GlassRxRefractionDetails.push($scope.cacheStorageItem.FinalGlassRxRefractionDetails[0]);
                $scope.CopyConsultationDetails.VisionDetails.push($scope.cacheStorageItem.FinalVisionDetails[0]);
                $scope.CopyConsultationDetails.TonoMetryDetails.push($scope.cacheStorageItem.FinalTonoMetryDetails[0]);
                $scope.CopyConsultationDetails.PupilSizeDetails.push($scope.cacheStorageItem.FinalPupilSizeDetails[0]);
                $scope.CopyConsultationDetails.PachymetryDetails.push($scope.cacheStorageItem.FinalPachymetryDetails[0]);
                $scope.CopyConsultationDetails.GlareDetails.push($scope.cacheStorageItem.FinalGlareDetails[0]);
                $scope.CopyConsultationDetails.Vitals.push($scope.cacheStorageItem.PatientVitals[0]);
                $scope.CopyConsultationDetails.KeratometryDetails.push($scope.cacheStorageItem.FinalKeratometryDetails[0]);
            }
        } else if (section === 'ContactLens') {
            if ($scope.cacheStorageItem.ContactLensDetails.length > 0) {
                $scope.CopyConsultationDetails.InvestigationDetails.push($scope.cacheStorageItem.InvestigationDetails[0]);
            }
        } else if (section === 'Examination') {
            if ($scope.treatmentArray.length > 0) {
                $scope.CopyConsultationDetails.AnteriorDetails.push($scope.cacheStorageItem.FinalAnteriorDetails[0]);
                $scope.CopyConsultationDetails.PosteriorDetails.push($scope.cacheStorageItem.FinalPosteriorDetails[0]);
                $scope.CopyConsultationDetails.ExternalExaminationDetails.push($scope.cacheStorageItem.FinalExternalExaminationDetails[0]);
                $scope.CopyConsultationDetails.NineGazeExtraOcularDetails.push($scope.cacheStorageItem.FinalNineGazeExtraOcularDetails[0]);
                $scope.CopyConsultationDetails.SquintDetails.push($scope.cacheStorageItem.FinalSquintDetails[0]);
                $scope.CopyConsultationDetails.HeadPosterDetails.push($scope.cacheStorageItem.FinalHeadPosterDetails[0]);
                $scope.CopyConsultationDetails.NearInvestigationdetails.push($scope.cacheStorageItem.FinalNearInvestigationdetails[0]);
                $scope.CopyConsultationDetails.DryEyeEvaluationData.push($scope.cacheStorageItem.FinalDryEyeEvaluationData[0]);
                $scope.CopyConsultationDetails.GonioscopyDetails.push($scope.cacheStorageItem.FinalGonioscopyDetails[0]);
                $scope.CopyConsultationDetails.NewAmslerGridArray.push($scope.cacheStorageItem.FinalNewAmslerGridArray[0]);
                $scope.CopyConsultationDetails.ConfrontationalFieldArray.push($scope.cacheStorageItem.FinalConfrontationalFieldArray[0]);
                $scope.CopyConsultationDetails.ColorVisionDetails.push($scope.cacheStorageItem.FinalColorVisionDetails[0]);
                $scope.CopyConsultationDetails.LacrimalPatiencyDetails.push($scope.cacheStorageItem.FinalLacrimalPatiencyDetails[0]);
                $scope.CopyConsultationDetails.LacrimalPatencyRemarks.push($scope.cacheStorageItem.LacrimalPatencyRemarks[0]);
                $scope.CopyConsultationDetails.HertelsExaminationArray.push($scope.cacheStorageItem.FinalHertelsExaminationArray[0]);

            }
        } else if (section === 'Assessment') {
            if ($scope.cacheStorageItem.AssessmentPlan.length >= 0) {
                $scope.CopyConsultationDetails.AssessmentPlan.push($scope.cacheStorageItem.FAssessmentPlan[0]);
            }

        } else if (section === 'Orders') {
            if ($scope.treatmentArray.length > 0) {
                $scope.CopyConsultationDetails.InvestigationsDetails.push($scope.cacheStorageItem.InvestigationsDetails[0]);
                $scope.CopyConsultationDetails.SurgeriesDetails.push($scope.cacheStorageItem.SurgeriesDetails[0]);
                $scope.CopyConsultationDetails.ProceduresDetails.push($scope.cacheStorageItem.ProceduresDetails[0]);
                $scope.CopyConsultationDetails.ReferralDetails.push($scope.cacheStorageItem.ReferralDetails[0]);
                /*                $scope.CopyConsultationDetails.Orders[0].PrescriptionDetails.push($scope.cacheStorageItem.InvestigationsDetails);*/
                $scope.CopyConsultationDetails.Prescriptions.push($scope.cacheStorageItem.Prescriptions[0]);
                $scope.CopyConsultationDetails.GlassDetails.push($scope.cacheStorageItem.FinalGlassDetails[0]);
            }
        } else if (section === 'Procedures') {
            if ($scope.cacheStorageItem.OPProceduresArray.length > 0) {
                $scope.CopyConsultationDetails.OPProceduresArray.push($scope.cacheStorageItem.OPProceduresArray[0]);
            }
        }
        else if (section === 'SuperBill') {
            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                $scope.CopyConsultationDetails.SuperBillSuggestedCodes.push($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[0]);
            }
        }
        //else if (section === 'Coordinator') {
        //    if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
        //        $scope.CopyConsultationDetails.SuperBill[0].SuperBillSuggestedCodes.push($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes);
        //    }
        //}


        $scope[section + "Copied"] = true;
    }

    $scope.saveCopiedAccordions = function () {

        console.log($scope.CopyConsultationDetails);
         $uibModalInstance.close($scope.CopyConsultationDetails);

    };


    $scope.ShowConsultationDetailsToSignOff = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": 'templates/uibpopups/ConsultationDetailsPopupToSignOff.html',
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            "windowClass": "templateschiefcomplaints overflow-hidden",
            "controller": function ($scope, $uibModal) {
                $scope.CloseCosultPop = function () {
                    $scope.mInstanceAdd.dismiss("cancel");
                };
            }
        });
    };
  







}]);

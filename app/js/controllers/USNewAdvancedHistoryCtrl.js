

"use strict";
eHnoteWebApp.controller("USNewAdvancedHistoryCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "localStorageFactory", "eHnoteUserAppointmentDataService", "$filter",
    "eHnoteInsuranceService", "alertify", "eHnoteSettingsDataService", "eHnotePatientAddressDataServices", "datapersistanceFactory",
    "eHnotePrintService", "$q", "eHnoteLoginStatusService", "eHnoteMainAppointmentService", "eHnoteProcedureDataService", "$uibModal", "eHnotePatientDataService", "eHnoteDiagnosisDataServices", "eHnoteCacheStorageService", function ($scope, $rootScope, eHnoteMasterDataService,
        localStorageFactory, eHnoteUserAppointmentDataService, $filter, eHnoteInsuranceService, alertify, eHnoteSettingsDataService, eHnotePatientAddressDataServices, datapersistanceFactory,
        eHnotePrintService, $q, eHnoteLoginStatusService, eHnoteMainAppointmentService, eHnoteProcedureDataService, $uibModal, eHnotePatientDataService, eHnoteDiagnosisDataServices, eHnoteCacheStorageService) {
        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var allbranches = localStorageFactory.getItem("allBranchesData") || [];
        $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
        $scope.ParentHospitalID = 0;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        //$scope.mainObject = Selectobj;

        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParentHospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        $scope.PatientConsultationDetails = {
            "FinalChiefComplaints": [],
            "FinalAllergyItems": [],
            "FinalMedicalConditions": [],
            "FinalVitals": [],
            //"FinalAnteriorSegment": [],
            "FinalPatientPastHistorys": [],
            "FinalVisionDetails": [],
            "FinalTonoMetryDetails": [],
            "FinalPupilSize": [],
            "FinalPachymetryDetails": [],
            "FinalKeratometryDetails": [],
            "FinalAnteriorSegmentDetails": [],
            "FinalPosteriorSegmentDetails": [],
            "FinalExternalExaminationsDetails": [],
            "FinalAmslerGridDetails": [],
            "FinalGonioscopyDetails": [],
            "FinalColorVisionDetails": [],
            "FinalAssessmentPlanDetails": [],
            "FinalOrderDetails": [],
            "FinalGlassDetails": [],
            "FinalPrescriptionDetails": [],
            "FinalPatientNotesArrayDetails": [],
            "FinalCornealReflexDetails": [],
            "FinalNineGazeDetails": [],
            "FinalExtraOcularDetails": [],
            "FinalHeadPosterDetails": [],
            "FinalBSVDetails": [],
            "FinalTypeofSquintDetails": [],
            "FinalDuctionsDetails": [],
            "FinalCoverAlternateDetails": [],
            "FinalNearInvestigationdetails": [],
            "FinalLacrimalPatiencyDetails": [],
            "FinalSquintDetails": [],
            "FinalGlassRxDetails": [],

        }
        function GetAppointmentsBydate() {
            $scope.Patientlatestappointmentslist = [];
            var obj = { "HospitalID": $scope.HospitalId, "PatientId": $scope.cacheStorageItem.PatientID };
            eHnotePatientDataService.GetAppointmentsBydate(obj).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.rows.length > 0) {
                        $scope.Patientlatestappointmentslist = resp.data.rows || [];
                        angular.forEach($scope.Patientlatestappointmentslist, function (Aitem) {
                            Aitem.isselected = false;
                        });
                    }
                }
            }, function (err) {
                console.log(err);

            });
        }
        GetAppointmentsBydate();

        $scope.init = function () {
            object = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "Type": 0
            };

            eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                if (resp.data !== undefined) {
                    $scope.treatmentData = resp.data[0] || '';
                    if ($scope.treatmentData != '') {
                        if ($scope.Patientlatestappointmentslist.length > 0) {
                            angular.forEach($scope.Patientlatestappointmentslist, function (Aitem) {
                                if ($scope.treatmentData.AppointmentId == Aitem.AppointmentId) {
                                    Aitem.isselected = true;
                                }
                            });
                        }

                        if ($scope.treatmentData.ChiefComplaints.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ChiefComplaints": $scope.treatmentData.ChiefComplaints || [],
                            }
                            $scope.PatientConsultationDetails.FinalChiefComplaints.push(object);
                        } else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ChiefComplaints": [],
                            }
                            $scope.PatientConsultationDetails.FinalChiefComplaints.push(object);
                        }
                        if ($scope.treatmentData.AllergyItems.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Allergies": $scope.treatmentData.AllergyItems || [],
                            }
                            $scope.PatientConsultationDetails.FinalAllergyItems.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Allergies": [],
                            }
                            $scope.PatientConsultationDetails.FinalAllergyItems.push(object);
                        }
                        if ($scope.treatmentData.MedicalConditions.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "MedicalConditions": $scope.treatmentData.MedicalConditions || [],
                            }
                            $scope.PatientConsultationDetails.FinalMedicalConditions.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "MedicalConditions": [],
                            }
                            $scope.PatientConsultationDetails.FinalMedicalConditions.push(object);
                        }
                        if ($scope.treatmentData.VisionDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "VisionDetails": $scope.treatmentData.VisionDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalVisionDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "VisionDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalVisionDetails.push(object);
                        }
                        if ($scope.treatmentData.VisionDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.VisionDetails, { "InvestigationId": 2121 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "GlassRxDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalGlassRxDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "GlassRxDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalGlassRxDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GlassRxDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalGlassRxDetails.push(object);
                        }
                        if ($scope.treatmentData.TonoMetryDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "TonoMetryDetails": $scope.treatmentData.TonoMetryDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalTonoMetryDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "TonoMetryDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalTonoMetryDetails.push(object);
                        }
                        if ($scope.treatmentData.PupilSizeDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PupilSizeDetails": $scope.treatmentData.PupilSizeDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalPupilSize.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PupilSizeDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalPupilSize.push(object);
                        }
                        if ($scope.treatmentData.Pachymetry.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PachymetryDetails": $scope.treatmentData.Pachymetry || [],
                            }
                            $scope.PatientConsultationDetails.FinalPachymetryDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PachymetryDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalPachymetryDetails.push(object);
                        }
                        if ($scope.treatmentData.AnteriorSegmentDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AnteriorSegmentDetails": $scope.treatmentData.AnteriorSegmentDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalAnteriorSegmentDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AnteriorSegmentDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalAnteriorSegmentDetails.push(object);
                        }
                        if ($scope.treatmentData.PosteriorSegmentDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PosteriorSegmentDetails": $scope.treatmentData.PosteriorSegmentDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalPosteriorSegmentDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PosteriorSegmentDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalPosteriorSegmentDetails.push(object);
                        }

                        if ($scope.treatmentData.ExternalExaminationDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ExternalExaminationDetails": $scope.treatmentData.ExternalExaminationDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalExternalExaminationsDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ExternalExaminationDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalExternalExaminationsDetails.push(object);
                        }
                        if ($scope.treatmentData.NewAmslerGridArray.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AmslerGridDetails": $scope.treatmentData.NewAmslerGridArray || [],
                            }
                            $scope.PatientConsultationDetails.FinalAmslerGridDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AmslerGridDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalAmslerGridDetails.push(object);
                        }
                        if ($scope.treatmentData.GonioscopyDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GonioscopyDetails": $scope.treatmentData.GonioscopyDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalGonioscopyDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GonioscopyDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalGonioscopyDetails.push(object);
                        }
                        if ($scope.treatmentData.ColorVisionDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ColorVisionDetails": $scope.treatmentData.ColorVisionDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalColorVisionDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ColorVisionDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalColorVisionDetails.push(object);
                        }

                        if ($scope.treatmentData.VisionDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.VisionDetails, { "InvestigationId": 11 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "KeratometryDetails": list[0].KeratometerEyeValues || [],
                                }
                                $scope.PatientConsultationDetails.FinalKeratometryDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "KeratometryDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalKeratometryDetails.push(object);
                            }
                        }
                        if ($scope.treatmentData.AssessmentPlan.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AssessmentPlanDetails": $scope.treatmentData.AssessmentPlan || [],
                            }
                            $scope.PatientConsultationDetails.FinalAssessmentPlanDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AssessmentPlanDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalAssessmentPlanDetails.push(object);
                        }
                        if ($scope.treatmentData.OrderDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "OrderDetails": $scope.treatmentData.OrderDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalOrderDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "OrderDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalOrderDetails.push(object);
                        }
                        if ($scope.treatmentData.GlassDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GlassDetails": $scope.treatmentData.GlassDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalGlassDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GlassDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalGlassDetails.push(object);
                        }
                        if ($scope.treatmentData.PatientNotesArray.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PatientNotesArray": $scope.treatmentData.PatientNotesArray || [],
                            }
                            $scope.PatientConsultationDetails.FinalPatientNotesArrayDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PatientNotesArray": [],
                            }
                            $scope.PatientConsultationDetails.FinalPatientNotesArrayDetails.push(object);
                        }
                        if ($scope.treatmentData.Prescription.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Prescription": $scope.treatmentData.Prescription || [],
                            }
                            $scope.PatientConsultationDetails.FinalPrescriptionDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Prescription": [],
                            }
                            $scope.PatientConsultationDetails.FinalPrescriptionDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 697 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CornealReflexDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalCornealReflexDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CornealReflexDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalCornealReflexDetails.push(object);
                            }
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {                           
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "SquintDetails": $scope.treatmentData.SquintDetails || [],
                                }
                            $scope.PatientConsultationDetails.FinalSquintDetails.push(object);                            
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "SquintDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalSquintDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 700 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "TypeofSquintDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalTypeofSquintDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "TypeofSquintDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalTypeofSquintDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "TypeofSquintDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalTypeofSquintDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 2095 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "Ductions": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalDuctionsDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "Ductions": [],
                                }
                                $scope.PatientConsultationDetails.FinalDuctionsDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Ductions": [],
                            }
                            $scope.PatientConsultationDetails.FinalDuctionsDetails.push(object);
                        }
                        if ($scope.treatmentData.NineGazeExtraOcularDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.NineGazeExtraOcularDetails, { "InvestigationId": 695 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "NineGazeDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalNineGazeDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "NineGazeDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalNineGazeDetails.push(object);
                            }
                        } else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "NineGazeDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalNineGazeDetails.push(object);
                        }
                        if ($scope.treatmentData.NineGazeExtraOcularDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.NineGazeExtraOcularDetails, { "InvestigationId": 18 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "ExtraOcularDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalExtraOcularDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "ExtraOcularDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalExtraOcularDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ExtraOcularDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalExtraOcularDetails.push(object);
                        }
                        if ($scope.treatmentData.NineGazeExtraOcularDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.NineGazeExtraOcularDetails, { "InvestigationId": 2096 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "BSVDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalBSVDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "BSVDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalBSVDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "BSVDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalBSVDetails.push(object);
                        }
                        if ($scope.treatmentData.HeadPosterDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.HeadPosterDetails, { "InvestigationId": 698 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "HeadPosterDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalHeadPosterDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "HeadPosterDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalHeadPosterDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "HeadPosterDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalHeadPosterDetails.push(object);
                        }
                        if ($scope.treatmentData.NearInvestigationdetails.length != 0) {

                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "NearInvestigationdetails": $scope.treatmentData.NearInvestigationdetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalNearInvestigationdetails.push(object);

                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "NearInvestigationdetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalNearInvestigationdetails.push(object);
                        }
                        if ($scope.treatmentData.LacrimalPatiencyDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "LacrimalPatiencyDetails": $scope.treatmentData.LacrimalPatiencyDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "LacrimalPatiencyDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 699 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CoverAlternateDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalCoverAlternateDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CoverAlternateDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalCoverAlternateDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "CoverAlternateDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalCoverAlternateDetails.push(object);
                        }
                        if ($scope.treatmentData.Vitals.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Vitals": $scope.treatmentData.Vitals || [],
                            }

                            //var List = $filter("filter")($scope.PatientConsultationDetails.FinalVitals, function (kitem, index) { return kitem.AppointmentId === object.AppointmentId });
                            //if (List.length > 0) {
                            //    alertify.error('You have already Selected this AppointmentDate');
                            //    return;
                            //}

                            $scope.PatientConsultationDetails.FinalVitals.push(object);
                        }

                    }
                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });

            eHnotePatientDataService.GetMedicalConditonHistoriesByPatientId($scope.cacheStorageItem.PatientID).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.rows.length > 0) {
                        $scope.PatientConsultationDetails.FinalPatientPastHistorys = resp.data.rows;
                    }
                }

            }, function (err) {

            });
        }
        $scope.init();
        $scope.RemoveselectedAppointment = function (item) {
            if ($scope.PatientConsultationDetails.FinalChiefComplaints.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalChiefComplaints, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalChiefComplaints.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalAllergyItems.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalAllergyItems, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalAllergyItems.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalMedicalConditions.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalMedicalConditions, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalMedicalConditions.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalVitals.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalVitals, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalVitals.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalVisionDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalVisionDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalVisionDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalTonoMetryDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalTonoMetryDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalTonoMetryDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalPupilSize.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalPupilSize, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalPupilSize.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalPachymetryDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalPachymetryDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalPachymetryDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalKeratometryDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalKeratometryDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalKeratometryDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalAnteriorSegmentDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalAnteriorSegmentDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalAnteriorSegmentDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalPosteriorSegmentDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalPosteriorSegmentDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalPosteriorSegmentDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalExternalExaminationsDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalExternalExaminationsDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalExternalExaminationsDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalAmslerGridDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalAmslerGridDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalAmslerGridDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalGonioscopyDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalGonioscopyDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalGonioscopyDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalColorVisionDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalColorVisionDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalColorVisionDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalAssessmentPlanDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalAssessmentPlanDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalAssessmentPlanDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalOrderDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalOrderDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalOrderDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalGlassDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalGlassDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalGlassDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalPrescriptionDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalPrescriptionDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalPrescriptionDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalPatientNotesArrayDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalPatientNotesArrayDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalPatientNotesArrayDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalCornealReflexDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalCornealReflexDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalCornealReflexDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalNineGazeDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalNineGazeDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalNineGazeDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalExtraOcularDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalExtraOcularDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalExtraOcularDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalHeadPosterDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalHeadPosterDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalHeadPosterDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalBSVDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalBSVDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalBSVDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalTypeofSquintDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalTypeofSquintDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalTypeofSquintDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalDuctionsDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalDuctionsDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalDuctionsDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalCoverAlternateDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalCoverAlternateDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalCoverAlternateDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalNearInvestigationdetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalNearInvestigationdetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalNearInvestigationdetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails.splice(index,1);
                    }
                });
            }
            if ($scope.PatientConsultationDetails.FinalSquintDetails.length != 0) {
                angular.forEach($scope.PatientConsultationDetails.FinalSquintDetails, function (Mitem,index) {
                    if (item.AppointmentId == Mitem.AppointmentId) {
                        $scope.PatientConsultationDetails.FinalSquintDetails.splice(index,1);
                    }
                });
            }
        }
        $scope.SelectAppointmented = function (item, type) {
            item.isselected = !item.isselected;
            if (item.isselected ==false) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Uncheck the Appointment ? ", function () {
                    console.log(item.AppointmentId);
                    $scope.RemoveselectedAppointment(item);
                    return false;
               }, function () {
                    item.isselected = true;
                    return false;
                    r = "You pressed Cancel!";
                });
            }
            var List = $filter("filter")($scope.PatientConsultationDetails.FinalChiefComplaints, function (kitem, index) { return kitem.AppointmentId === item.AppointmentId });
            if (List.length > 0) {
               // alertify.error('You have already Selected this AppointmentDate');
                return;
            }

            var obj = { "AppointmentId": item.AppointmentId, "Type": 0 };
            eHnotePatientDataService.GetPatientConsultationDetailsByApptId(obj).then(function (resp) {
                if (resp.data !== undefined) {
                    $scope.treatmentData = resp.data[0] || '';

                    if ($scope.treatmentData != '') {
                        if ($scope.Patientlatestappointmentslist.length > 0) {
                            angular.forEach($scope.Patientlatestappointmentslist, function (Aitem) {
                                if ($scope.treatmentData.AppointmentId == Aitem.AppointmentId) {
                                    Aitem.isselected = true;
                                }
                            });
                        }

                        if ($scope.treatmentData.ChiefComplaints.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ChiefComplaints": $scope.treatmentData.ChiefComplaints || [],
                            }
                            $scope.PatientConsultationDetails.FinalChiefComplaints.push(object);
                        } else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ChiefComplaints": [],
                            }
                            $scope.PatientConsultationDetails.FinalChiefComplaints.push(object);
                        }
                        if ($scope.treatmentData.AllergyItems.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Allergies": $scope.treatmentData.AllergyItems || [],
                            }
                            $scope.PatientConsultationDetails.FinalAllergyItems.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Allergies": [],
                            }
                            $scope.PatientConsultationDetails.FinalAllergyItems.push(object);
                        }
                        if ($scope.treatmentData.MedicalConditions.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "MedicalConditions": $scope.treatmentData.MedicalConditions || [],
                            }
                            $scope.PatientConsultationDetails.FinalMedicalConditions.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "MedicalConditions": [],
                            }
                            $scope.PatientConsultationDetails.FinalMedicalConditions.push(object);
                        }
                        if ($scope.treatmentData.VisionDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "VisionDetails": $scope.treatmentData.VisionDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalVisionDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "VisionDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalVisionDetails.push(object);
                        }

                        if ($scope.treatmentData.VisionDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.VisionDetails, { "InvestigationId": 2121 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "GlassRxDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalGlassRxDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "GlassRxDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalGlassRxDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GlassRxDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalGlassRxDetails.push(object);
                        }

                        if ($scope.treatmentData.TonoMetryDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "TonoMetryDetails": $scope.treatmentData.TonoMetryDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalTonoMetryDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "TonoMetryDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalTonoMetryDetails.push(object);
                        }
                        if ($scope.treatmentData.PupilSizeDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PupilSizeDetails": $scope.treatmentData.PupilSizeDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalPupilSize.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PupilSizeDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalPupilSize.push(object);
                        }
                        if ($scope.treatmentData.Pachymetry.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PachymetryDetails": $scope.treatmentData.Pachymetry || [],
                            }
                            $scope.PatientConsultationDetails.FinalPachymetryDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PachymetryDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalPachymetryDetails.push(object);
                        }
                        if ($scope.treatmentData.AnteriorSegmentDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AnteriorSegmentDetails": $scope.treatmentData.AnteriorSegmentDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalAnteriorSegmentDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AnteriorSegmentDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalAnteriorSegmentDetails.push(object);
                        }
                        if ($scope.treatmentData.PosteriorSegmentDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PosteriorSegmentDetails": $scope.treatmentData.PosteriorSegmentDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalPosteriorSegmentDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PosteriorSegmentDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalPosteriorSegmentDetails.push(object);
                        }

                        if ($scope.treatmentData.ExternalExaminationDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ExternalExaminationDetails": $scope.treatmentData.ExternalExaminationDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalExternalExaminationsDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ExternalExaminationDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalExternalExaminationsDetails.push(object);
                        }
                        if ($scope.treatmentData.NewAmslerGridArray.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AmslerGridDetails": $scope.treatmentData.NewAmslerGridArray || [],
                            }
                            $scope.PatientConsultationDetails.FinalAmslerGridDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AmslerGridDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalAmslerGridDetails.push(object);
                        }
                        if ($scope.treatmentData.GonioscopyDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GonioscopyDetails": $scope.treatmentData.GonioscopyDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalGonioscopyDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GonioscopyDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalGonioscopyDetails.push(object);
                        }
                        if ($scope.treatmentData.ColorVisionDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ColorVisionDetails": $scope.treatmentData.ColorVisionDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalColorVisionDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ColorVisionDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalColorVisionDetails.push(object);
                        }

                        if ($scope.treatmentData.VisionDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.VisionDetails, { "InvestigationId": 11 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "KeratometryDetails": list[0].KeratometerEyeValues || [],
                                }
                                $scope.PatientConsultationDetails.FinalKeratometryDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "KeratometryDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalKeratometryDetails.push(object);
                            }
                        }
                        if ($scope.treatmentData.AssessmentPlan.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AssessmentPlanDetails": $scope.treatmentData.AssessmentPlan || [],
                            }
                            $scope.PatientConsultationDetails.FinalAssessmentPlanDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "AssessmentPlanDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalAssessmentPlanDetails.push(object);
                        }
                        if ($scope.treatmentData.OrderDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "OrderDetails": $scope.treatmentData.OrderDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalOrderDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "OrderDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalOrderDetails.push(object);
                        }
                        if ($scope.treatmentData.GlassDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GlassDetails": $scope.treatmentData.GlassDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalGlassDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "GlassDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalGlassDetails.push(object);
                        }
                        if ($scope.treatmentData.PatientNotesArray.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PatientNotesArray": $scope.treatmentData.PatientNotesArray || [],
                            }
                            $scope.PatientConsultationDetails.FinalPatientNotesArrayDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "PatientNotesArray": [],
                            }
                            $scope.PatientConsultationDetails.FinalPatientNotesArrayDetails.push(object);
                        }
                        if ($scope.treatmentData.Prescription.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Prescription": $scope.treatmentData.Prescription || [],
                            }
                            $scope.PatientConsultationDetails.FinalPrescriptionDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Prescription": [],
                            }
                            $scope.PatientConsultationDetails.FinalPrescriptionDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 697 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CornealReflexDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalCornealReflexDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CornealReflexDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalCornealReflexDetails.push(object);
                            }
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "SquintDetails": $scope.treatmentData.SquintDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalSquintDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "SquintDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalSquintDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 700 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "TypeofSquintDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalTypeofSquintDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "TypeofSquintDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalTypeofSquintDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "TypeofSquintDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalTypeofSquintDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 2095 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "Ductions": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalDuctionsDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "Ductions": [],
                                }
                                $scope.PatientConsultationDetails.FinalDuctionsDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Ductions": [],
                            }
                            $scope.PatientConsultationDetails.FinalDuctionsDetails.push(object);
                        }
                        if ($scope.treatmentData.NineGazeExtraOcularDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.NineGazeExtraOcularDetails, { "InvestigationId": 695 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "NineGazeDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalNineGazeDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "NineGazeDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalNineGazeDetails.push(object);
                            }
                        } else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "NineGazeDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalNineGazeDetails.push(object);
                        }
                        if ($scope.treatmentData.NineGazeExtraOcularDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.NineGazeExtraOcularDetails, { "InvestigationId": 18 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "ExtraOcularDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalExtraOcularDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "ExtraOcularDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalExtraOcularDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "ExtraOcularDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalExtraOcularDetails.push(object);
                        }
                        if ($scope.treatmentData.NineGazeExtraOcularDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.NineGazeExtraOcularDetails, { "InvestigationId": 2096 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "BSVDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalBSVDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "BSVDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalBSVDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "BSVDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalBSVDetails.push(object);
                        }
                        if ($scope.treatmentData.HeadPosterDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.HeadPosterDetails, { "InvestigationId": 698 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "HeadPosterDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalHeadPosterDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "HeadPosterDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalHeadPosterDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "HeadPosterDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalHeadPosterDetails.push(object);
                        }
                        if ($scope.treatmentData.NearInvestigationdetails.length != 0) {

                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "NearInvestigationdetails": $scope.treatmentData.NearInvestigationdetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalNearInvestigationdetails.push(object);

                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "NearInvestigationdetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalNearInvestigationdetails.push(object);
                        }
                        if ($scope.treatmentData.LacrimalPatiencyDetails.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "LacrimalPatiencyDetails": $scope.treatmentData.LacrimalPatiencyDetails || [],
                            }
                            $scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails.push(object);
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "LacrimalPatiencyDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalLacrimalPatiencyDetails.push(object);
                        }
                        if ($scope.treatmentData.SquintDetails.length != 0) {
                            var list = $filter("filter")($scope.treatmentData.SquintDetails, { "InvestigationId": 699 }, true) || [];
                            if (list.length > 0) {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CoverAlternateDetails": list || [],
                                }
                                $scope.PatientConsultationDetails.FinalCoverAlternateDetails.push(object);
                            }
                            else {
                                var object = {
                                    "AppointmentId": $scope.treatmentData.AppointmentId,
                                    "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                    "CoverAlternateDetails": [],
                                }
                                $scope.PatientConsultationDetails.FinalCoverAlternateDetails.push(object);
                            }
                        }
                        else {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "CoverAlternateDetails": [],
                            }
                            $scope.PatientConsultationDetails.FinalCoverAlternateDetails.push(object);
                        }
                        if ($scope.treatmentData.Vitals.length != 0) {
                            var object = {
                                "AppointmentId": $scope.treatmentData.AppointmentId,
                                "AppointmentDate": $scope.treatmentData.AppointmentDt,
                                "Vitals": $scope.treatmentData.Vitals || [],
                            }

                            //var List = $filter("filter")($scope.PatientConsultationDetails.FinalVitals, function (kitem, index) { return kitem.AppointmentId === object.AppointmentId });
                            //if (List.length > 0) {
                            //    alertify.error('You have already Selected this AppointmentDate');
                            //    return;
                            //}

                            $scope.PatientConsultationDetails.FinalVitals.push(object);
                        }

                    }
                  
                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        };

        $scope.closeadvancedHistory = function () {
            $scope.ChangeTab(2);
        }



      


    }]);


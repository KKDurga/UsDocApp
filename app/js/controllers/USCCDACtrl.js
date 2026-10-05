"use strict";
eHnoteWebApp.controller("USCCDACtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "eHnoteMainAppointmentService", "eHnotePatientDataService", "$location", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnoteUserDataService", "localStorageFactory", "eHnoteUserAppointmentDataService", "eHnotePatientAddressDataServices", "$uibModal",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, eHnoteMainAppointmentService, eHnotePatientDataService, $location, eHnoteCacheStorageService, datapersistanceFactory, eHnoteUserDataService, localStorageFactory, eHnoteUserAppointmentDataService, eHnotePatientAddressDataServices, $uibModal) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            var hospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        $scope.SpecializationId = 0;
        //   $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.files = "";
        $scope.htmlfiles = "";
        $scope.SelectedAppointmentId = 0;

        $scope.FilesObj = {
            "TempImagesArray": [],
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,

        }

        $scope.treatmentArray = [];

        $scope.selectedImgs = function (files) {

            $scope.ChartObj = {

                "IsMergeApptview": false,
                "AppointmentId": null,
                "AppointmentDate": null,
                "IsComingFromChart": false,
                "DoctorId": null,

            }

            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    // files = item || [];
                    $scope.file = item;
                    if ($scope.file != null) {

                        var pName = $scope.file.name, name = "";
                        var type = $scope.file.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": $scope.file,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DisplayName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,

                        };

                        $scope.FilesObj.TempImagesArray.push(obj);


                        //  angular.element("input[type='file']").val(null);
                        console.log($scope.FilesObj);
                    }
                });
            }

        };

        $scope.SavePatientData = function () {
            var obj = {
                "TempImagesArray": $scope.FilesObj.TempImagesArray || [],
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
            }
            $scope.treatmentArray = [];
            if (obj.TempImagesArray.length == 0) {
                alertify.error('Select XMl file');
                return false;
            }
            eHnoteDiagnosisDataServices.AddPatientxmlfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

            function OnFilesObjMaterialSuccess(data) {
                alertify.success("The XML file has been successfully uploaded and processed.");
                angular.element("input[type='file']").val(null);
                $scope.FilesObj = {
                    "TempImagesArray": [],
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,

                }
                if (data.Status == "Success") {
                    $scope.selectedPatientData = data;

                    if ($scope.selectedPatientData.PatientList.length > 0) {
                        angular.forEach($scope.selectedPatientData.PatientList, function (item) {
                            item.IsSelectedPatient = false;
                        });
                    }

                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.selectedPatientData.MobileNumber);
                    $scope.selectedPatientData.MobileNumber = obj.UsFormatMobileNumber;
                }

            }

            function OnFilesObjMaterialError(data) {
                console.log(data);
                $scope.IsDisabled = false;
            }
        }


        $scope.ChangePatient = function (val, item) {
            if ($scope.selectedPatientData.PatientList.length > 0) {
                angular.forEach($scope.selectedPatientData.PatientList, function (item) {
                    item.IsSelectedPatient = false;
                });
            }
            item.IsSelectedPatient = val;
            if (item.IsSelectedPatient == true) {
                $scope.selectedPatientData.PatientId = item.PatientId;
                $scope.selectedPatientData.FirstName = item.PatientFirstName;
                $scope.selectedPatientData.MiddleName = item.PatientMiddleName;
                $scope.selectedPatientData.LastName = item.PatientLastName;
                $scope.selectedPatientData.MobileNumber = item.PatientMobile;
                $scope.selectedPatientData.Gender = item.PatientGender;
                $scope.selectedPatientData.DOB = item.PatientDOB;
                $scope.GetOpthaPatientCaseHistory();
            } else {
                $scope.selectedPatientData.PatientId = null;
            }

            $scope.selectedPatientData.IsAlleryReconcile = true;
            $scope.selectedPatientData.IsMedicationReconcile = true;
            $scope.selectedPatientData.IsProblemReconcile = true;
        }

        $scope.GetHTMLGenerateObj = function () {

            return {
                "txt1": "",
                "FromDate": null,
                "ToDate": null,
                "PageSize": 0
            }

        }
        $scope.HTMLGenerateObj = $scope.GetHTMLGenerateObj();

        $scope.AddUpdatePatient = function () {

            //   var patientfullname = $scope.selectedPatientData.PatientName + " " + $scope.selectedPatientData.FamilyName;
            var params = {
                "PatientId": $scope.selectedPatientData.PatientId,
                "FirstName": $scope.selectedPatientData.FirstName,
                "MiddleName": $scope.selectedPatientData.MiddleName,
                "LastName": $scope.selectedPatientData.LastName,
                "MobileNumber": $scope.selectedPatientData.MobileNumber,
                "HomeNumber": $scope.selectedPatientData.HomeNumber,
                "HomeAreaCode": $scope.selectedPatientData.HomeAreaCode,
                "HomeCountryCode": $scope.selectedPatientData.HomeCountryCode,
                "OfficeAreaCode": $scope.selectedPatientData.OfficeAreaCode,
                "OfficeCountryCode": $scope.selectedPatientData.OfficeCountryCode,
                "OfficeNumber": $scope.selectedPatientData.OfficeNumber,
                "Gender": $scope.selectedPatientData.Gender,
                "DOB": $scope.selectedPatientData.DOB,
                "PatientSSN": $scope.selectedPatientData.PatientSSN,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "MaritalStatus": $scope.selectedPatientData.MaritalStatus,
                "PatientAddress": {
                    "Address1": $scope.selectedPatientData.PatientAddress.Address1,
                    "CityId": null,
                    "CityName": $scope.selectedPatientData.PatientAddress.CityName,
                    "StateId": null,
                    "StateName": $scope.selectedPatientData.PatientAddress.StateName,
                    "ZipCode": $scope.selectedPatientData.PatientAddress.ZipCode,
                    "CountryId": null,
                    "CountryName": $scope.selectedPatientData.PatientAddress.CountryName,
                },
            }
            eHnoteMainAppointmentService.CCDAAddUpdatePatient(params).then(function (resp) {
                if (resp.data.status == "success") {
                    alertify.success("Patient Added Successfully");
                    $scope.selectedPatientData.PatientId = resp.data.PatientId;
                    $scope.selectedPatientData.PatientDisplayId = resp.data.PatientDisplayId;
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }

        $scope.ChartObj = {

            "IsMergeApptview": false,
            "AppointmentId": null,
            "AppointmentDate": null,
            "IsComingFromChart": false,
            "DoctorId": null,

        }
        $scope.CCDAChartObj = {
            "IsComingform": "CCDA",
            "PatientId": null,
            "AppointmentId": null,

        }

        $scope.ChangesConsultation = function (item) {
            var ConsultationId = item.ConsultationId || 0;
            var AppointmentId = item.AppointmentId || 0;
            $scope.ChartObj.DoctorId = item.DoctorId || 0;
            $scope.ChartObj.AppointmentId = item.AppointmentId || 0;
            $scope.ChartObj.AppointmentDate = item.AppointmentDate || 0;

            $scope.SelectedAppointmentId = item.AppointmentId || 0;
            $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);


            if ($scope.currentdate === $scope.ChartObj.AppointmentDate) {
                $scope.IsAppointmentToday = true;
            } else {
                $scope.IsAppointmentToday = false;
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

                            $scope.CCDAChartObj.AppointmentId = item.AppointmentId;
                            $scope.CCDAChartObj.PatientId = item.PatientArray[0].PatientId;
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

                    }

                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        };


        $scope.GetOpthaPatientCaseHistory = function () {
            $scope.CaseHistory = [];
            var AppointmentTypeIds = null;
            AppointmentTypeIds = "1,2,3,5,6,8,9,10,4,7,14";


            var object = {
                "PatientID": $scope.selectedPatientData.PatientId,
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
                        $scope.ChartObj.AppointmentId = resp.data[0].AppointmentId || 0;
                        $scope.ChartObj.AppointmentDate = resp.data[0].AppointmentDate || 0;
                        $scope.SelectedAppointmentId = resp.data[0].AppointmentId || 0;


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


        $scope.AddUpdateBookAppointment = function () {
            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
            var obj = {
                "AppointmentId": null,
                //"PatientId": null,
                "DoctorID": $scope.UserId || null,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "IsCheckedIn": 1,
                "VisitTypeId": 10,
                "VisitReason": 4174,
                "SubSpecializationId": 11,
                "ConfirmationStatusId": 2,
                "ConsultationDt": "",
                "AppointmentStatus": "D",
                "CurrentTime": $scope.CurrentTime,
                "StartTime": "19:00",
                "EndTime": "19:15",
            }

            // $scope.selectedPatientData.AppointmentId = obj.AppointmentId;
            $scope.selectedPatientData.UserId = $scope.UserId;
            $scope.selectedPatientData.HospitalId = $scope.HospitalId;
            $scope.selectedPatientData.DoctorID = obj.DoctorID;
            $scope.selectedPatientData.IsCheckedIn = obj.IsCheckedIn;
            $scope.selectedPatientData.VisitTypeId = obj.VisitTypeId;
            $scope.selectedPatientData.VisitReason = obj.VisitReason;
            $scope.selectedPatientData.SubSpecializationId = obj.SubSpecializationId;
            $scope.selectedPatientData.ConfirmationStatusId = obj.ConfirmationStatusId;
            //  $scope.selectedPatientData.ConsultationDt = obj.ConsultationDt;
            $scope.selectedPatientData.AppointmentStatus = obj.AppointmentStatus;
            $scope.selectedPatientData.MergeAppointmentId = $scope.ChartObj.AppointmentId || null;
            $scope.selectedPatientData.CurrentTime = obj.CurrentTime;
            //$scope.selectedPatientData.StartTime = obj.StartTime;
            //$scope.selectedPatientData.EndTime = obj.EndTime;


            $scope.selectedPatientData.IsAlleryReconcile = true;
            $scope.selectedPatientData.IsMedicationReconcile = true;
            $scope.selectedPatientData.IsProblemReconcile = true;

            //if ($scope.selectedPatientData.MergeAppointmentId !=null) {
            //    $scope.selectedPatientData.ConsultationDt = $filter("date")(new Date(), "yyyy-MM-dd")
            //}

            if ($scope.selectedPatientData.ApptStartTime != '') {
                $scope.selectedPatientData.StartTime = $scope.selectedPatientData.ApptStartTime || '19:00';
            }
            if ($scope.selectedPatientData.ApptEndTime != '') {
                $scope.selectedPatientData.EndTime = $scope.selectedPatientData.ApptEndTime || '19:15';
            }

            if ($scope.selectedPatientData.ImmunizationHistory.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.ImmunizationHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                $scope.selectedPatientData.ImmunizationHistory = filetrODarray;
            }
            if ($scope.selectedPatientData.SocialHistory.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.SocialHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                $scope.selectedPatientData.SocialHistory = filetrODarray;
            }
            if ($scope.selectedPatientData.MedicationList.length > 0) {
                var filetrMedicineNamearray = $filter("filter")($scope.selectedPatientData.MedicationList, function (iterator, ind) { return iterator.PlanName != null }) || [];
                $scope.selectedPatientData.MedicationList = filetrMedicineNamearray;
            }
            if ($scope.selectedPatientData.Procedure.length > 0) {
                var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.Procedure, function (iterator, ind) { return iterator.Description != null }) || [];
                $scope.selectedPatientData.Procedure = filetrProcedurearray;
            }
            if ($scope.selectedPatientData.EncounterDiagnosis.length > 0) {
                var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.EncounterDiagnosis, function (iterator, ind) { return iterator.EncounterName != null }) || [];
                $scope.selectedPatientData.EncounterDiagnosis = filetrProcedurearray;
            }

            if ($scope.selectedPatientData.ImplantsList.length > 0) {
                angular.forEach($scope.selectedPatientData.ImplantsList, function (item) {
                    $scope.Implantsobj = {
                        "PatientImplantId": null,
                        "DateOfImplant": item.DateOfImplant,
                        "UDI": item.UDI || '',
                        "DeviceType": '',
                        "LotNumber": '',
                        "Location": '',
                        "OwnerId": '',
                        "OwnerName": '',
                        "ModelType": '',
                        "DeleteInd": 'N',
                        "ManufacturerName": item.CompanyName,
                        "ManufactureDate": item.ManufacturingDate,
                        "DeviceName": item.BrandName,
                        "DeviceTypeName": "other",
                        "Snomed": item.Snomed,
                        "DI": item.DI,
                        "DeviceDescription": item.DeviceDescription || '',
                        "GMDNPTName": item.GmdnPTName,
                        "GMDNPTDefinition": item.GmdnPTDefinition,
                        "DeviceIDIssuingAgency": item.IssuingAgency,
                        "SerialNumber": item.SerialNumber,
                        "ModelNumber": item.VersionModelNumber,
                        "MRISafetyStatus": item.MRISafetyStatus,
                        "ProductBatchNo": item.ProductBatchNo,
                        "ProductSerialNo": item.ProductSerialNo,
                        "ExpiryDate": item.ExpirationDate,
                        "Entered": item.Entered,
                        "ProviderId": item.ProviderId || '',
                        "StaffId": item.StaffId || '',
                        "Comments": item.Comments || '',
                        "StatusId": item.StatusId || '',

                    }
                    $scope.selectedPatientData.ImplantCCDAList.push($scope.Implantsobj);
                })
            }

            eHnoteMainAppointmentService.CCDAAddUpdateAppointmentWithConsultation($scope.selectedPatientData).then(function (resp) {
                if (resp.data.status == "Success") {

                    let AppointmentId = resp.data.AppointmentId;
                    let ConsultationId = resp.data.ConsultationId;
                    $scope.ChartObj.IsMergeApptview = false;
                    if ($scope.selectedPatientData.MergeAppointmentId != null) {
                        $scope.ChartObj.IsMergeApptview = true;
                        $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);
                    }


                    alertify.success("Appointment Added Successfully");


                    $scope.FilesObj = {
                        "TempImagesArray": [],
                        "UserId": $scope.UserId,
                        "HospitalId": $scope.HospitalId,

                    }
                    $scope.selectedPatientData = "";
                } else {
                    alertify.error("Appointment Already Exists For This Patient");
                }
            }, function (err) {
                alertify.error("Getting Failed");
            })
        }













        $scope.NavigateToChart = function () {
            //$scope.CCDAChartObj.AppointmentId = 1236803;
            //$scope.CCDAChartObj.PatientId = 519818;
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
            $scope.cacheStorageItem.PatientID = $scope.CCDAChartObj.PatientId;
            $scope.cacheStorageItem.patientid = $scope.CCDAChartObj.PatientId;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            eHnoteMasterDataService.addPatientDetailsforBarcode('');
            datapersistanceFactory.set("CCDASeletedPatient", $scope.CCDAChartObj);
            $location.url("/profile");
        }


        $scope.AddUpdateMergeBookAppointment = function () {
            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
            var obj = {
                "AppointmentId": null,
                //"PatientId": null,
                "DoctorID": $scope.UserId || null,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "IsCheckedIn": 1,
                "VisitTypeId": 10,
                "VisitReason": 4174,
                "SubSpecializationId": 11,
                "ConfirmationStatusId": 2,
                "ConsultationDt": "",
                "AppointmentStatus": "D",
                "CurrentTime": $scope.CurrentTime,
                "StartTime": "19:00",
                "EndTime": "19:15",
            }

            // $scope.selectedPatientData.AppointmentId = obj.AppointmentId;
            $scope.selectedPatientData.UserId = $scope.UserId;
            $scope.selectedPatientData.HospitalId = $scope.HospitalId;
            $scope.selectedPatientData.DoctorID = obj.DoctorID;
            $scope.selectedPatientData.IsCheckedIn = obj.IsCheckedIn;
            $scope.selectedPatientData.VisitTypeId = obj.VisitTypeId;
            $scope.selectedPatientData.VisitReason = obj.VisitReason;
            $scope.selectedPatientData.SubSpecializationId = obj.SubSpecializationId;
            $scope.selectedPatientData.ConfirmationStatusId = obj.ConfirmationStatusId;
            //  $scope.selectedPatientData.ConsultationDt = obj.ConsultationDt;
            $scope.selectedPatientData.AppointmentStatus = obj.AppointmentStatus;
            $scope.selectedPatientData.MergeAppointmentId = $scope.ChartObj.AppointmentId || null;
            $scope.selectedPatientData.CurrentTime = obj.CurrentTime;
            //$scope.selectedPatientData.StartTime = obj.StartTime;
            //$scope.selectedPatientData.EndTime = obj.EndTime;


            //if ($scope.selectedPatientData.MergeAppointmentId !=null) {
            //    $scope.selectedPatientData.ConsultationDt = $filter("date")(new Date(), "yyyy-MM-dd")
            //}

            if ($scope.selectedPatientData.ApptStartTime != '') {
                $scope.selectedPatientData.StartTime = $scope.selectedPatientData.ApptStartTime || '19:00';
            }
            if ($scope.selectedPatientData.ApptEndTime != '') {
                $scope.selectedPatientData.EndTime = $scope.selectedPatientData.ApptEndTime || '19:15';
            }

            if ($scope.selectedPatientData.AllergyList.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.AllergyList, function (iterator, ind) { return iterator.AllergyId == null }) || [];
                $scope.selectedPatientData.AllergyList = filetrODarray;
            }
            if ($scope.selectedPatientData.CurrentSystemicMedications.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.CurrentSystemicMedications, function (iterator, ind) { return iterator.MedicineId == null }) || [];
                $scope.selectedPatientData.CurrentSystemicMedications = filetrODarray;
            }
            if ($scope.selectedPatientData.AssessmentPlan.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.AssessmentPlan, function (iterator, ind) { return iterator.ConsultationDiagnosisId == null }) || [];
                $scope.selectedPatientData.AssessmentPlan = filetrODarray;
            }

            if ($scope.selectedPatientData.ImmunizationHistory.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.ImmunizationHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                $scope.selectedPatientData.ImmunizationHistory = filetrODarray;
            }
            if ($scope.selectedPatientData.SocialHistory.length > 0) {
                var filetrODarray = $filter("filter")($scope.selectedPatientData.SocialHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                $scope.selectedPatientData.SocialHistory = filetrODarray;
            }
            if ($scope.selectedPatientData.MedicationList.length > 0) {
                var filetrMedicineNamearray = $filter("filter")($scope.selectedPatientData.MedicationList, function (iterator, ind) { return iterator.PlanName != null }) || [];
                $scope.selectedPatientData.MedicationList = filetrMedicineNamearray;
            }
            if ($scope.selectedPatientData.Procedure.length > 0) {
                var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.Procedure, function (iterator, ind) { return iterator.Description != null }) || [];
                $scope.selectedPatientData.Procedure = filetrProcedurearray;
            }
            if ($scope.selectedPatientData.EncounterDiagnosis.length > 0) {
                var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.EncounterDiagnosis, function (iterator, ind) { return iterator.EncounterName != null }) || [];
                $scope.selectedPatientData.EncounterDiagnosis = filetrProcedurearray;
            }

            if ($scope.selectedPatientData.ImplantsList.length > 0) {
                angular.forEach($scope.selectedPatientData.ImplantsList, function (item) {
                    $scope.Implantsobj = {
                        "PatientImplantId": null,
                        "DateOfImplant": item.DateOfImplant,
                        "UDI": item.UDI || '',
                        "DeviceType": '',
                        "LotNumber": '',
                        "Location": '',
                        "OwnerId": '',
                        "OwnerName": '',
                        "ModelType": '',
                        "DeleteInd": 'N',
                        "ManufacturerName": item.CompanyName,
                        "ManufactureDate": item.ManufacturingDate,
                        "DeviceName": item.BrandName,
                        "DeviceTypeName": "other",
                        "Snomed": item.Snomed,
                        "DI": item.DI,
                        "DeviceDescription": item.DeviceDescription || '',
                        "GMDNPTName": item.GmdnPTName,
                        "GMDNPTDefinition": item.GmdnPTDefinition,
                        "DeviceIDIssuingAgency": item.IssuingAgency,
                        "SerialNumber": item.SerialNumber,
                        "ModelNumber": item.VersionModelNumber,
                        "MRISafetyStatus": item.MRISafetyStatus,
                        "ProductBatchNo": item.ProductBatchNo,
                        "ProductSerialNo": item.ProductSerialNo,
                        "ExpiryDate": item.ExpirationDate,
                        "Entered": item.Entered,
                        "ProviderId": item.ProviderId || '',
                        "StaffId": item.StaffId || '',
                        "Comments": item.Comments || '',
                        "StatusId": item.StatusId || '',

                    }
                    $scope.selectedPatientData.ImplantCCDAList.push($scope.Implantsobj);
                })
            }

            eHnoteMainAppointmentService.CCDAAddUpdateAppointmentWithConsultation($scope.selectedPatientData).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.ChartObj.IsMergeApptview = false;
                    $scope.treatmentArray = [];
                    alertify.success("Appointment Added Successfully");

                    let AppointmentId = resp.data.AppointmentId;
                    let ConsultationId = resp.data.ConsultationId;
                    let PatientId = resp.data.PatientId;

                    $scope.CCDAChartObj.AppointmentId = AppointmentId;
                    $scope.CCDAChartObj.PatientId = PatientId;

                    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
                    $scope.cacheStorageItem.PatientID = $scope.CCDAChartObj.PatientId;
                    $scope.cacheStorageItem.patientid = $scope.CCDAChartObj.PatientId;
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    eHnoteMasterDataService.addPatientDetailsforBarcode('');
                    datapersistanceFactory.set("CCDASeletedPatient", $scope.CCDAChartObj);
                    $location.url("/profile");

                    $scope.FilesObj = {
                        "TempImagesArray": [],
                        "UserId": $scope.UserId,
                        "HospitalId": $scope.HospitalId,

                    }
                    $scope.selectedPatientData = "";
                } else {
                    alertify.error("Appointment Already Exists For This Patient");
                }
            }, function (err) {
                alertify.error("Getting Failed");
            })
        }

        $scope.UpdateMergeandview = function () {

            $scope.expapptdoctor = "";



            var filetr1array = $filter("filter")($scope.treatmentArray[0].CCDADocumentDetails, function (iterator, ind) { return iterator.TypeId == 2 }) || [];
            if (filetr1array.length > 0) {
                $scope.expapptdoctor = filetr1array[0].FirstName + filetr1array[0].LastName;
            }
            $scope.ChartObj.IsMergeApptview = true;
            if ($scope.treatmentArray[0].AllergyItems.length > 0) {



                angular.forEach($scope.treatmentArray[0].AllergyItems, function (item) {
                    var filetrarray = $filter("filter")($scope.selectedPatientData.AllergyList, function (iterator, ind) { return iterator.AllergyName == item.AllergyName }) || [];

                    if (filetrarray.length == 0) {
                        let obj = {
                            "AllergyId": item.AllergyId,
                            "AllergyName": item.AllergyName,
                            "EXpApptDoctor": $scope.expapptdoctor,
                            "ModifiedDt": item.ModifiedDt,
                            "isduplicatrRecd": false,
                            "DeleteInd": null,
                            "ObservationCode": null,
                            "ObservationCodeSystem": null,
                            "ObservationCodeSystemName": null,
                            "ObservationName": null,
                            "PatientDetailId": null,
                            "ReactionId": null,
                            "ReactionName": item.ReactionName,
                            "SeverityId": null,
                            "SeverityName": item.SeverityName,
                            "StatusId": null,
                            "StatusName": item.StatusName,
                            "code": null,
                            "codeSystem": null,
                            "codeSystemName": null,
                        }

                        $scope.selectedPatientData.AllergyList.push(obj);
                    }
                    else {
                        let obj = {
                            "AllergyId": item.AllergyId,
                            "AllergyName": item.AllergyName,
                            "EXpApptDoctor": $scope.expapptdoctor,
                            "ModifiedDt": item.ModifiedDt,
                            "isduplicatrRecd": true,
                            "DeleteInd": null,
                            "ObservationCode": null,
                            "ObservationCodeSystem": null,
                            "ObservationCodeSystemName": null,
                            "ObservationName": null,
                            "PatientDetailId": null,
                            "ReactionId": null,
                            "ReactionName": item.ReactionName,
                            "SeverityId": null,
                            "SeverityName": item.SeverityName,
                            "StatusId": null,
                            "StatusName": item.StatusName,
                            "code": null,
                            "codeSystem": null,
                            "codeSystemName": null,
                        }

                        $scope.selectedPatientData.AllergyList.push(obj)
                    }




                });

            }

            if ($scope.treatmentArray[0].CurrentSystemicMedicationsHistory.length > 0) {
                angular.forEach($scope.treatmentArray[0].CurrentSystemicMedicationsHistory, function (item) {
                    var filetrarray = $filter("filter")($scope.selectedPatientData.CurrentSystemicMedications, function (iterator, ind) { return iterator.MedicineName == item.MedicineName }) || [];

                    if (filetrarray.length == 0) {
                        let obj = {
                            "MedicineId": item.MedicineId,
                            "MedicineName": item.MedicineName,
                            "EXpApptDoctor": $scope.expapptdoctor,
                            "ModifiedDt": item.ModifiedDt,
                            "isduplicatrRecd": false,
                            "DeleteInd": "N",
                            "Directions": "",
                            "EffectiveDate": item.StartDate,
                            "Indications": "",
                            "PatientInstructions": "",
                            "PatientMedicineId": "",
                            "RouteCode": "",
                            "RouteCodeSystem": "",
                            "RouteCodeSystemName": "",
                            "RouteName": "",
                            "SNOMED": "",
                            "StatusName": "",
                            "doseQuantity": item.Quantity,
                            "manufacturedMaterialCode": "",
                            "manufacturedMaterialCodeSystem": "",

                        }


                        $scope.selectedPatientData.CurrentSystemicMedications.push(obj);
                    }
                    else {
                        let obj = {
                            "MedicineId": item.MedicineId,
                            "MedicineName": item.MedicineName,
                            "EXpApptDoctor": $scope.expapptdoctor,
                            "ModifiedDt": item.ModifiedDt,
                            "isduplicatrRecd": true,
                            "DeleteInd": "N",
                            "Directions": "",
                            "EffectiveDate": item.StartDate,
                            "Indications": "",
                            "PatientInstructions": "",
                            "PatientMedicineId": "",
                            "RouteCode": "",
                            "RouteCodeSystem": "",
                            "RouteCodeSystemName": "",
                            "RouteName": "",
                            "SNOMED": "",
                            "StatusName": "",
                            "doseQuantity": item.Quantity,
                            "manufacturedMaterialCode": "",
                            "manufacturedMaterialCodeSystem": "",

                        }
                        $scope.selectedPatientData.CurrentSystemicMedications.push(obj);
                    }

                });

            }

            if ($scope.treatmentArray[0].AssessmentPlan.length > 0) {
                angular.forEach($scope.treatmentArray[0].AssessmentPlan, function (item) {
                    if (item.Type == "General") {
                        var filetrarray = $filter("filter")($scope.selectedPatientData.AssessmentPlan, function (iterator, ind) { return iterator.DiagnosisName == item.DiagnosisName }) || [];

                        if (filetrarray.length == 0) {
                            let obj = {
                                "AssessmentPlanId": item.AssessmentPlan.AssessmentPlanId,
                                "ConsultationDiagnosisId": item.ConsultationDiagnosisId,
                                "DiagnosisName": item.DiagnosisName,
                                "EXpApptDoctor": $scope.expapptdoctor,
                                "ModifiedDt": item.ModifiedDt,
                                "isduplicatrRecd": false,
                                "DeleteInd": "N",
                                "FromDate": item.OnSetDate,
                                "ObservationCode": "",
                                "ObservationCodeSystem": "",
                                "ObservationCodeSystemName": "",
                                "ProblemCode": item.SnomedCode,
                                "ProblemCodeSystem": "",
                                "ProblemCodeSystemName": "",
                                "SNOMEDCode": item.SnomedCode,
                                "StatusId": "",
                                "StatusName": item.StatusList[0].DiagnosisStatus,
                                "ToDate": "",
                            }

                            $scope.selectedPatientData.AssessmentPlan.push(obj);
                        }
                        else {
                            let obj = {
                                "AssessmentPlanId": item.AssessmentPlan.AssessmentPlanId,
                                "ConsultationDiagnosisId": item.ConsultationDiagnosisId,
                                "DiagnosisName": item.DiagnosisName,
                                "ModifiedDt": item.ModifiedDt,
                                "EXpApptDoctor": $scope.expapptdoctor,
                                "isduplicatrRecd": true,
                                "DeleteInd": "N",
                                "FromDate": item.OnSetDate,
                                "ObservationCode": "",
                                "ObservationCodeSystem": "",
                                "ObservationCodeSystemName": "",
                                "ProblemCode": item.SnomedCode,
                                "ProblemCodeSystem": "",
                                "ProblemCodeSystemName": "",
                                "SNOMEDCode": item.SnomedCode,
                                "StatusId": "",
                                "StatusName": item.StatusList[0].DiagnosisStatus,
                                "ToDate": "",
                            }

                            $scope.selectedPatientData.AssessmentPlan.push(obj);
                        }
                    }



                });

            }



            if ($scope.selectedPatientData.IsAlleryReconcile == false) {
                if ($scope.selectedPatientData.AllergyList.length > 0) {
                    angular.forEach($scope.selectedPatientData.AllergyList, function (item) {
                        item.IsAlleryReconcile = false;
                    });
                }
            }
            if ($scope.selectedPatientData.IsAlleryReconcile == true) {
                if ($scope.selectedPatientData.AllergyList.length > 0) {
                    angular.forEach($scope.selectedPatientData.AllergyList, function (item) {
                        item.IsAlleryReconcile = true;
                    });
                }
            }



            if ($scope.selectedPatientData.IsMedicationReconcile == false) {
                if ($scope.selectedPatientData.CurrentSystemicMedications.length > 0) {
                    angular.forEach($scope.selectedPatientData.CurrentSystemicMedications, function (item) {
                        item.IsMedicationReconcile = false;
                    });
                }
            }
            if ($scope.selectedPatientData.IsMedicationReconcile == true) {
                if ($scope.selectedPatientData.CurrentSystemicMedications.length > 0) {
                    angular.forEach($scope.selectedPatientData.CurrentSystemicMedications, function (item) {
                        item.IsMedicationReconcile = true;
                    });
                }
            }

            if ($scope.selectedPatientData.IsProblemReconcile == false) {
                if ($scope.selectedPatientData.AssessmentPlan.length > 0) {
                    angular.forEach($scope.selectedPatientData.AssessmentPlan, function (item) {
                        item.IsProblemReconcile = false;
                    });
                }
            }
            if ($scope.selectedPatientData.IsProblemReconcile == true) {
                if ($scope.selectedPatientData.AssessmentPlan.length > 0) {
                    angular.forEach($scope.selectedPatientData.AssessmentPlan, function (item) {
                        item.IsProblemReconcile = true;
                    });
                }
            }

        }



        $scope.selectedResource = "";
        $scope.ActualResourcesArray = [
            {
                "ResourceId": 1,
                "ResourceName": "Allergies",
                "IsShow": true,
                "Order": 1
            },
            {
                "ResourceId": 2,
                "ResourceName": "Encounters",
                "IsShow": true,
                "Order": 2
            },
            {
                "ResourceId": 3,
                "ResourceName": "Medications",
                "IsShow": true,
                "Order": 3
            },
            {
                "ResourceId": 4,
                "ResourceName": "Immunizations",
                "IsShow": true,
                "Order": 4
            },
            {
                "ResourceId": 5,
                "ResourceName": "Assessment Plan",
                "IsShow": true,
                "Order": 5
            },
            {
                "ResourceId": 6,
                "ResourceName": "Careplan",
                "IsShow": true,
                "Order": 6
            },
            {
                "ResourceId": 7,
                "ResourceName": "Treatmentplan",
                "IsShow": true,
                "Order": 7
            },
            {
                "ResourceId": 8,
                "ResourceName": "Reason For Referral",
                "IsShow": true,
                "Order": 8
            },
            {
                "ResourceId": 9,
                "ResourceName": "Problems",
                "IsShow": true,
                "Order": 9
            },
            {
                "ResourceId": 10,
                "ResourceName": "Procedures",
                "IsShow": true,
                "Order": 10
            },
            {
                "ResourceId": 11,
                "ResourceName": "Functional Status",
                "IsShow": true,
                "Order": 11
            },
            {
                "ResourceId": 12,
                "ResourceName": "Congitive Status",
                "IsShow": true,
                "Order": 12
            },
            {
                "ResourceId": 13,
                "ResourceName": "Results",
                "IsShow": true,
                "Order": 13
            },
            {
                "ResourceId": 14,
                "ResourceName": "SocialHistory",
                "IsShow": true,
                "Order": 14
            },
            {
                "ResourceId": 15,
                "ResourceName": "Vital Signs",
                "IsShow": true,
                "Order": 15
            },
            {
                "ResourceId": 16,
                "ResourceName": "Health Goals",
                "IsShow": true,
                "Order": 16
            },
            {
                "ResourceId": 17,
                "ResourceName": "Health Concerns",
                "IsShow": true,
                "Order": 17
            }, {
                "ResourceId": 18,
                "ResourceName": "Progress Note",
                "IsShow": true,
                "Order": 18
            },
            {
                "ResourceId": 19,
                "ResourceName": "Health & Physical Note",
                "IsShow": true,
                "Order": 19
            },
            {
                "ResourceId": 20,
                "ResourceName": "Consultation Note",
                "IsShow": true,
                "Order": 20
            },
            {
                "ResourceId": 21,
                "ResourceName": "Device/Implant",
                "IsShow": true,
                "Order": 21
            },
            {
                "ResourceId": 22,
                "ResourceName": "Labaratory Note",
                "IsShow": true,
                "Order": 22
            },
            {
                "ResourceId": 23,
                "ResourceName": "Procedure Note",
                "IsShow": true,
                "Order": 23
            }
        ]

        $scope.configurationResourceArray = angular.copy($scope.ActualResourcesArray);

        $scope.changeActualResourceHideandShow = function (item) {
            console.log(item.IsShow);

            angular.forEach($scope.configurationResourceArray, function (citem) {
                if (citem.ResourceId == item.ResourceId) {
                    citem.IsShow = item.IsShow;
                }
            });
        };

        $scope.$watch('configurationResourceArray', function (newVal, oldVal) {
            angular.forEach($scope.configurationResourceArray, function (sitem, index) {
                if (sitem.IsShow) {
                    sitem.Order = index + 1;
                }
            });
        }, true);








        $scope.GetHTML = function () {
            eHnoteMainAppointmentService.GetPatientInfoHtml().then(function (resp) {
                if (resp.data.status == "success") {

                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }


        $scope.GetERA = function () {
            var obj = {
                "CurrentDate": "2025-10-11",
                "Type": 8
            }
            eHnoteMainAppointmentService.GetUnParsedEdiFiles(obj).then(function (resp) {
                if (resp.data.status == "success") {

                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }


        $scope.mainCCDATabObj = {
            "MainTab": 1
        };

        $scope.switchmainCCDATab = function (tabno) {
            $scope.mainCCDATabObj.MainTab = tabno || 1;

            if (tabno === 3) {
                $scope.GetHtmlExportJobsStatusList();
            }
        };


        $scope.selectedhtmlfiles = function (files) {

            $scope.ChartObj = {
                "IsMergeApptview": false,
                "AppointmentId": null,
                "AppointmentDate": null,
                "IsComingFromChart": false,
                "DoctorId": null,
            }

            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    // files = item || [];
                    $scope.file = item;
                    if ($scope.file != null) {

                        var pName = $scope.file.name, name = "";
                        var type = $scope.file.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": $scope.file,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DisplayName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,

                        };

                        $scope.FilesObj.TempImagesArray.push(obj);


                        //  angular.element("input[type='file']").val(null);
                        console.log($scope.FilesObj);
                    }
                });
            }

        };
        $scope.selectedschedulefiles = function (files) {

            $scope.ChartObj = {
                "IsMergeApptview": false,
                "AppointmentId": null,
                "AppointmentDate": null,
                "IsComingFromChart": false,
                "DoctorId": null,
            }

            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    // files = item || [];
                    $scope.file = item;
                    if ($scope.file != null) {

                        var pName = $scope.file.name, name = "";
                        var type = $scope.file.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": $scope.file,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DisplayName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,

                        };

                        $scope.FilesObj.TempImagesArray.push(obj);


                        //  angular.element("input[type='file']").val(null);
                        console.log($scope.FilesObj);
                    }
                });
            }

        };
        $scope.htmlConvertedJSON = "";
        $scope.SavehtmluploadedData = function () {
            $scope.htmlConvertedJSON = "";
            var obj = {
                "TempImagesArray": $scope.FilesObj.TempImagesArray || [],
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientId": 0,
                "AppointmentId": 0,
                "VisitId": 0,
                "HTMLContent": "",
                "S3URL": ""
            }
            $scope.treatmentArray = [];
            if (obj.TempImagesArray.length == 0) {
                alertify.error('Select HTML file');
                return false;
            }
            eHnoteDiagnosisDataServices.AddPatienthtmlfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

            function OnFilesObjMaterialSuccess(resp) {


                console.log(JSON.stringify(resp));

                $scope.htmlConvertedJSON = resp;
                if (resp.S3URL && typeof resp.S3URL === 'string') {
                    // Directly trust the S3 URL for the iframe
                    $scope.htmlFileUrl = $sce.trustAsResourceUrl(resp.S3URL);
                } else {
                    alertify.warning("No valid HTML URL returned from server.");
                    $scope.htmlFileUrl = null;
                }
                alertify.success("The HTML file has been extracted successfully");
                angular.element("input[type='file']").val(null);
                

            }

            function OnFilesObjMaterialError(data) {
                console.log(data);
                $scope.IsDisabled = false;
                alertify.error("The Schedule file has been extract Failed");
            }
        }
        $scope.SavescheduleuploadedData = function () {
            $scope.ScheduleConvertedJSON = "";
            var obj = {
                "TempImagesArray": $scope.FilesObj.TempImagesArray || [],
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientId": 0,
                "AppointmentId": 0,
                "VisitId": 0,
                "HTMLContent": "",
                "S3URL": "",
                "Schedule": true,
            }
            $scope.treatmentArray = [];
            if (obj.TempImagesArray.length == 0) {
                alertify.error('Select HTML file');
                return false;
            }
            eHnoteDiagnosisDataServices.AddPatienthtmlfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

            function OnFilesObjMaterialSuccess(resp) {

                console.log(JSON.stringify(resp));
                $scope.ScheduleConvertedJSON = resp;
                alertify.success("The Schedule file has been extracted successfully");
                angular.element("input[type='file']").val(null);

            }

            function OnFilesObjMaterialError(data) {
                console.log(data);
                $scope.IsDisabled = false;
                alertify.error("The Schedule file has been extract Failed");
            }
        }
        $scope.Createpatientandvisitdata = function () {
            var S3URL = $scope.htmlConvertedJSON.S3URL.split('?')[0];
            var object = {
                "PatientDataFromHtml": $scope.htmlConvertedJSON.PatientDataFromHtml,
                "S3URL": S3URL,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentType": "External Appointment",
                "ClinicalVisitType": "External Visit",
                "VisitReasonId": 3911,
                "AppointmentId": 0,
                "VisitId": 0,
                "StartTime": "08:00",
                "EndTime": "08:15",
                "BookingStatusId": 1,
                "AppointmentStatusId": 1,
                "ProfileStatusMasterId": 3,
                "BookingTypeId": 3,
            }
            //if ($scope.ScheduleConvertedJSON) {
            //    object.PatientDataFromSchedule = $scope.ScheduleConvertedJSON.PatientDataFromSchedule;
            //}
            eHnoteDiagnosisDataServices.GeneratePatientAndVisitfromccda(object, OnCreateVisitDataSuccess, OnCreateVisitDataError);

            function OnCreateVisitDataSuccess(resp) {

                console.log(resp);
                alertify.success("Patient visit created successfully");
            }
        }


        $scope.DownloadOrganizationVisitEmrDataByRequestId = function () {

            var obj = {
                "OrganizationId": 3
            };

            eHnoteMainAppointmentService.downloadEMrVisitData(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status == "Success") {
                    var downloadUrl = resp.data.ZipUrl;

                    // Force browser download
                    var link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = "Organization_EMR_Visits.zip";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }

        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };
        $scope.init = function () {
            var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
            InitializeBranches(NewBranchList, "PageLoad");
        }
        $scope.init();
        function InitializeBranches(data, pagetype) {
            var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];

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

            $scope.ApptBranchLocations = clinicAddress;

        };
        $scope.changeAppointmentBranch = function (obj, type, screen) {
            angular.forEach($scope.ApptBranchLocations, function (item) {
                item.IsChecked = false;
            });
            if (obj.ClinicId === 0) {

                angular.forEach($scope.ApptBranchLocations, function (item) {
                    item.IsChecked = true;
                });

                $scope.LocationTypeObj.SelectLocationString = "All Locations";
                $scope.AppListselectedclinic = {
                    ClinicId: 0,
                    ClinicName: "All Locations"
                };

                return;
            }

            obj.IsChecked = true;

            $scope.LocationTypeObj.SelectLocationString = "Selected";
            $scope.AppListselectedclinic = obj;

        };
        $scope.TopRecordList = [
            { id: 0, name: 'All' },
            { id: 10, name: 'Top 10' },
            { id: 20, name: 'Top 20' },
            { id: 30, name: 'Top 30' },
            { id: 40, name: 'Top 40' }
        ];
        $scope.PatientDetails = {
            "PatientMrNo": "",
            "RecordsPagesize": ""
        }
        $scope.selectTopRecord = function (item) {
            $scope.SelectedTopRecord = item;
            $scope.PatientDetails.RecordsPagesize = item.id;
            $scope.HTMLGenerateObj.PageSize = item.id;
        };

        $scope.clearFilters = function () {
            $scope.AppListselectedclinic = null;
            $scope.HTMLGenerateObj = $scope.GetHTMLGenerateObj();
        };

        $scope.RequesttoGenerate = function () {
            if (!$scope.AppListselectedclinic || !$scope.AppListselectedclinic.ClinicId) {
                alertify.error("Please select Branch");
                return false;
            }
            var fromdate = null;
            var toDate = null;
            $scope.HTMLGenerateObj.PageSize = $scope.HTMLGenerateObj.PageSize || 0;
            if ($scope.HTMLGenerateObj.PageSize === 0) {
                $scope.HTMLGenerateObj.FromDate = $scope.HTMLGenerateObj.FromDate || null;
                if ($scope.HTMLGenerateObj.FromDate === null) {
                    alertify.error("Please select FromDate")
                    return false;
                }

                $scope.HTMLGenerateObj.ToDate = $scope.HTMLGenerateObj.ToDate || null;
                if ($scope.HTMLGenerateObj.ToDate === null) {
                    alertify.error("Please select ToDate")
                    return false;
                }

                fromdate = $filter('date')($scope.HTMLGenerateObj.FromDate, 'yyyy-MM-dd');
                toDate = $filter('date')($scope.HTMLGenerateObj.ToDate, 'yyyy-MM-dd');
            }



            if ($scope.HTMLGenerateObj.FromDate !== null && $scope.HTMLGenerateObj.ToDate !== null) {
                $scope.PatientDetails.RecordsPagesize = 0;
                $scope.PatientDetails.PatientMrNo = "";
            }



            var request = {
                UserId: $scope.UserId,
                HospitalId: $scope.AppListselectedclinic?.ClinicId || 0,
                ParentOrganizationId: $scope.ParentHospitalId,
                PatientMrNo: $scope.PatientDetails.PatientMrNo,
                GetAllIndicator: 0,
                PageSize: $scope.HTMLGenerateObj.PageSize,
                HtmlExportJobId: 0,
                FromDate: fromdate,
                ToDate: toDate
            };

            eHnoteMainAppointmentService.InitiateDownloadEmrJobManual(request).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.GetHtmlExportJobsStatusList();
                    $scope.clearFilters();
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });

        }


        $scope.GetHtmlExportJobsStatusList = function () {
            var obj = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "BranchIds": doctorinfo.doctordata.UserAddress[0].ClinicId
            }
            console.log('sdfg');
            eHnoteMainAppointmentService.GetHtmlExportJobsStatusList(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.HtmlExportList = [];
                    $scope.HtmlExportList = resp.data.rows;
                }
            })
        }

        $scope.currentip = "";


        $scope.getIPAddress = function () {
            eHnotePatientAddressDataServices.getCurrentIp(onTypesSuccess, onTypesFailed);
            function onTypesSuccess(resp) {
                $scope.currentip = "";
                console.log(resp);
                if (resp !== undefined) {
                    $scope.currentip = resp;
                }
            }
            function onTypesFailed(err) {
                console.log(err);
            }
        }

        $scope.getIPAddress();

        $scope.generatePasswordObj = {
            "UserId": $scope.UserId,
            "Password": "",
            "JobId": 0,
            "ExpiryHours": 24,
            "OrganizationId": $scope.HospitalId,
            "IPAddress": $scope.currentip
        }

        $scope.GeneratePasswordFortheJobExport = function () {
            var obj = {
                "UserId": $scope.generatePasswordObj.UserId,
                "Password": $scope.generatePasswordObj.Password,
                "JobId": $scope.generatePasswordObj.JobId,
                "ExpiryHours": $scope.generatePasswordObj.ExpiryHours,
                "IPAddress": $scope.currentip,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ClinicId
            }
            console.log(obj);
            eHnoteMainAppointmentService.GenerateandUpdateSecureDownloadLink(obj).then(function (resp) {
                console.log(JSON.stringify(resp));

                if (resp.data.status == "Success") {

                }
            })
        };

        $scope.ValidateExportDataSecureDownloadLink = function () {
            var obj = {
                "UserId": $scope.generatePasswordObj.UserId,
                "Password": $scope.generatePasswordObj.Password,
                "JobId": $scope.generatePasswordObj.JobId,
                "IPAddress": $scope.currentip,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ClinicId
            }
            console.log(obj);
            eHnoteMainAppointmentService.ValidateExportDataSecureDownloadLink(obj).then(function (resp) {
                console.log(JSON.stringify(resp));

                if (resp.data.status == "Success") {

                }
            })
        };


        $scope.navtoGeneratePasswordPopUp = function (jobItem) {


            $scope.generatePasswordObj = {
                "UserId": $scope.UserId,
                "Password": "",
                "JobId": jobItem.HtmlExportJobId,
                "ExpiryHours": 24,
                "OrganizationId": $scope.HospitalId,
                "IPAddress": $scope.currentip
            };
            $scope.mInstanceGenerate = $uibModal.open({
                "templateUrl": "EmrGeneratePasswordModal.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "sm",
                "resolve": {
                    "PasswordObj": function () { return $scope.generatePasswordObj; },
                },
                "controller": function ($scope, $uibModalInstance, PasswordObj) {


                    $scope.showPassword = false;
                    $scope.generating = false;
                    $scope.genSuccess = '';
                    $scope.genError = '';

                    console.log(PasswordObj);
                    $scope.generatePasswordObj = PasswordObj;



                    $scope.closeModal = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.GeneratePasswordFortheJobExport = function () {


                        if (!$scope.generatePasswordObj.Password) {
                            $scope.genError = 'Please enter password.';
                            return;
                        }

                        $scope.generating = true;
                        $scope.genSuccess = '';
                        $scope.genError = '';

                        var obj = {
                            UserId: $scope.generatePasswordObj.UserId,
                            Password: $scope.generatePasswordObj.Password,
                            JobId: $scope.generatePasswordObj.JobId,
                            ExpiryHours: $scope.generatePasswordObj.ExpiryHours,
                            IPAddress: $scope.generatePasswordObj.IPAddress,
                            OrganizationId: $scope.generatePasswordObj.OrganizationId
                        };

                        console.log(obj);

                        eHnoteMainAppointmentService.GenerateandUpdateSecureDownloadLink(obj)
                            .then(function (resp) {
                                $scope.generating = false;
                                console.log(JSON.stringify(resp));
                                if (resp.data.status === 'Success') {
                                    $scope.genSuccess = 'Password generated successfully! Share password with user.';
                                    // ✅ Reset form
                                    $scope.generatePasswordObj.Password = '';
                                    $scope.generatePasswordObj.JobId = null;
                                    $uibModalInstance.close("Saved");
                                } else {
                                    $scope.genError = resp.data.message || 'Failed to generate password.';
                                }
                            })
                            .catch(function (err) {
                                $scope.generating = false;
                                $scope.genError = 'Something went wrong. Please try again.';
                                console.error(err);
                            });
                    };
                }
            });

            $scope.mInstanceGenerate.result.then(function () { }, function () { });
        };

        $scope.navtoDownloadExportFolder = function (JobItem) {
            $scope.mInstanceDownload = $uibModal.open({
                templateUrl: "EmrDownloadPasswordModal.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "sm",
                controller: function ($scope, $uibModalInstance, currentip, doctorinfo, jobId) {

                    $scope.downloadPasswordObj = {
                        JobId: jobId,
                        Password: ''
                    };
                    $scope.showPassword = false;
                    $scope.downloading = false;
                    $scope.dlSuccess = '';
                    $scope.dlError = '';

                    $scope.closeModal = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ValidateExportDataSecureDownloadLink = function () {
                      
                        if (!$scope.downloadPasswordObj.Password) {
                            $scope.dlError = 'Please enter password.';
                            return;
                        }

                        $scope.downloading = true;
                        $scope.dlSuccess = '';
                        $scope.dlError = '';

                        var obj = {
                            UserId: $scope.UserId,
                            Password: $scope.downloadPasswordObj.Password,
                            JobId: $scope.downloadPasswordObj.JobId,
                            IPAddress: currentip,
                            OrganizationId: $scope.HospitalId
                        };

                        eHnoteMainAppointmentService.ValidateExportDataSecureDownloadLink(obj)
                            .then(function (resp) {
                                $scope.downloading = false;


                                console.log(JSON.stringify(resp));

                                if (resp.data.status === 'Success') {
                                    $scope.dlSuccess = 'Validated! Starting download...';

                                    // ✅ Trigger download
                                    var link = document.createElement('a');
                                    link.href = resp.data.ZipUrl;
                                    link.download = '';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);

                                    // ✅ Close modal after 2 sec
                                    setTimeout(function () {
                                        $uibModalInstance.close(true);
                                    }, 2000);

                                } else {
                                    // ✅ Show exact error from API
                                    switch (resp.data.status) {
                                        case 'InvalidPassword':
                                            $scope.dlError = 'Invalid password. Please try again.';
                                            break;
                                        case 'Expired':
                                            $scope.dlError = 'Download link has expired. Contact administrator.';
                                            break;
                                        case 'Disabled':
                                            $scope.dlError = 'Download link is disabled. Contact administrator.';
                                            break;
                                        case 'NotFound':
                                            $scope.dlError = 'Download not available for this Job ID.';
                                            break;
                                        default:
                                            $scope.dlError = resp.data.message || 'Download failed. Try again.';
                                    }

                                    $scope.downloadPasswordObj.Password = "";
                                }
                            })
                            .catch(function (err) {
                                $scope.downloading = false;
                                if (err.status === 401)
                                    $scope.dlError = 'Invalid password. Please try again.';
                                else if (err.status === 400)
                                    $scope.dlError = err.data.message || 'Download link expired or disabled.';
                                else
                                    $scope.dlError = 'Download failed. Please try again.';
                                console.error(err);
                            });
                    };
                },
                resolve: {
                    currentip: function () { return $scope.currentip; },
                    doctorinfo: function () { return doctorinfo; },
                    jobId: function () { return JobItem.HtmlExportJobId; },
                }
            });

            $scope.mInstanceDownload.result.then(function (result) {
                if (result === true) {
                    
                    $scope.GetHtmlExportJobsStatusList();
                }
            }, function () { });
        };
    }]);
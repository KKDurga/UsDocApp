"use strict";
eHnoteWebApp.controller("USConsultationMultiCategoryPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteDbStaticDataService", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "eHnoteMainAdminServices", "cache", "allUserList", "eHnoteReferalDataService", "eHnoteDiagnosisDataServices", "eHnoteUserDataService", "$uibModal", "eHnoteConditionsDataService", "$q", "eHnotePatientAddressDataServices", "EditDiagnosisId", "Tabchange", "FinalObj", "Modalities",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteDbStaticDataService, eHnoteSettingsDataService, eHnoteMainAppointmentService, eHnotePatientDataService, eHnoteMainAdminServices, cache, allUserList, eHnoteReferalDataService, eHnoteDiagnosisDataServices, eHnoteUserDataService, $uibModal, eHnoteConditionsDataService, $q, eHnotePatientAddressDataServices, EditDiagnosisId, Tabchange, FinalObj, Modalities) {



        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.Appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.cacheStorageItem = cache || '';
        $scope.allUserList = allUserList || '';
        $scope.MultiselectDoctorlist = [];
        $scope.allSubSpecializationsArray = [];
        $scope.Modalities = Modalities || [];
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        };

        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.AppointmentID = $scope.cacheStorageItem.appointmentid;
        $scope.ConsultationID = $scope.cacheStorageItem.ConsultationID;

        $scope.closeAssessmentpopup = function () {
            $uibModalInstance.dismiss("cancel");
        };

        if ($scope.cacheStorageItem.allSubSpecializationsArray.length > 0) {
            $scope.allSubSpecializationsArray = $scope.cacheStorageItem.allSubSpecializationsArray || [];
            $scope.listSubSplArray = angular.copy($scope.cacheStorageItem.allSubSpecializationsArray) || [];
        }
        if ($scope.allUserList.length > 0) {
            angular.forEach($scope.allUserList, function (kitem) {
                kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;
                $scope.MultiselectDoctorlist.push(kitem);
            });

        }
        /*    var Tabchange = Tabchange || 1;*/
        $scope.Assesmenttab = Tabchange || 1;


        $scope.ClickTabchage = function (value, savetab) {

            if ($scope.Assesmenttab !== value) {

                if ($scope.Assesmenttab === 1) {

                    $scope.SaveAssessmentpopup(2);
                } else if ($scope.Assesmenttab === 2) {

                    $scope.SaveAssessmentpopup(2);








                } else if ($scope.Assesmenttab === 3) {
                    // Save data for Super Bill tab
                    $scope.SaveSuperBillpopup(2);
                }


                $scope.Assesmenttab = value;
                if ($scope.Assesmenttab === 3) {
                    $scope.ReloadSuperbill();
                }

                //if (savetab === 'Order') {
                //    $scope.SaveAssessmentpopup(2);
                //} else if (savetab === 'Superbill') {
                //    $scope.SaveSuperBillpopup(2);
                //}
            }
        };


        /* -------Emty-----*/

        $scope.AssessmentPlanobj = {
            "ICDCode": "2",
            "SnomedCodeShow": true,
        };
        $scope.ProblemrxObj = {
            "IsRcopiaa": true
        }

        $scope.SnomedCodesObj = {
            "SearchType": "",
            "SearchConcept": "",
            "SearchEnteredDate": "",
            "SearchDescription": ""
        };
        $scope.PaitentDetails = {
            "FullName": $scope.selectedPatientData.Patient[0].FullName || "",
            "PatientDisplayId": $scope.selectedPatientData.Patient[0].PatientDisplayId || "",
            "MobileNo": $scope.selectedPatientData.Patient[0].MobileNo || 0,
            "DOB": $scope.selectedPatientData.Patient[0].DOB || "",
        }
        if ($scope.PaitentDetails.MobileNo != 0) {
            let number = $scope.PaitentDetails.MobileNo.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(number);
            $scope.PaitentDetails.MobileNo = obj.UsFormatMobileNumber
        }
        $scope.Diabetesobj = {
            "IsDiabetesMellitus": false,
        }
        if ($scope.cacheStorageItem.IsDiabetesMellitus) {
            $scope.Diabetesobj.IsDiabetesMellitus = true;
        }
        $scope.addUpdatePatientProblemsToRcopiaReqObj = {
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "PatientId": $scope.selectedPatientData.Patient[0].PatientID,
            "RcopiaPatientId": $scope.selectedPatientData.Patient[0].RcopiaPatientId,
            "AppointmentId": $scope.AppointmentID,
            "DiagnosisList": []
        };

        $scope.medicineGetObj = {
            "IsRcopiaa": true,
            "MedicineObject": "",
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "TotalItems": 0
        };
        $scope.SigSearch = {
            "Shows": false
        }

        $scope.assonj = {
            'SelectedInvestigationObj': "",
            'SelectedPlanOfDiscussionsTemplateName': "",
            'SelectedDiagnosisTemplateName': "",
            'EnterDiagnosisTemplateName': "",
            'EnterPlanOfDiscussionsTemplateName': "",
            'EnterPatientsInstructionTemplateName': "",
            'EnterAssessmentsNotesTemplateName': "",
            'EnterActionsTakenTemplateName': "",
            'SelectedActionsTakenTemplateName': "",
            'SelectedPatientsInstructionsTemplateName': "",
            'SelectedAssessmentsNotesTemplateName': "",
            'SelectedDoctorNotesTemplateName': "",
            'SelectedProcedureObj': "",
            'SearchProcedureObj': "",
            'SearchOrdersProcedureObj': "",
            'EnterOverallnterDiagnosisTemplateName': '',
            'SelectOverallnterDiagnosisTemplateName': '',
            'IsPlanOfDiscussionTemplateSavePopOver': false,
            'IsAssessmentsTemplateSavePopOver': false,
            'IsPatientInstructionsTemplateSavePopOver': false,
            'IsDoctorNotesTemplateSavePopOver': false,
            'IsActionsTakenTemplateSavePopOver': false,
            'IsNKDSelected': false,
            'SearchReferralObj': "",
            'ShowTab': "Order",
            'AllOrderTab': "Orders",

            'IsDiagnosisTemplateSavePopOver': false,
            'IsMultipleDiagnosisTemplateSavePopOver': false
        };
        var objasses = {
            "PatientId": $scope.cacheStorageItem.patientid
        }

        function getNewPrescriptionDetailObj() {
            var obj = {
                "PatientPrescriptionDetailId": 0,
                "PatientPrescriptionId": 0,
                "PatientId": $scope.cacheStorageItem.patientid,
                "MedicationId": 0,
                "RcopiaDrugId": "",
                "RcopiaMedicationId": 0,
                "MedicationName": "",
                "DrugNDCID": "",
                "DrugFirstDataBankMedID": "",
                "DrugGenericId": "",
                "DrugBrandName": "",
                "DrugGenericName": "",
                "DrugForm": "",
                "DrugStrength": "",
                "DrugSchedule": "1",
                "DrugSupply": "",
                "DrugCompound": "",
                "MedicationTypeId": "",
                "MedicationTypeName": "",
                "Sig": "",
                "SigId": 0,
                "SigObj": "",
                "ActionId": "",
                "Action": "",
                "DoseId": "",
                "Dose": "",
                "DoseUnitId": "",
                "DoseUnit": "",
                "RouteId": "",
                "Route": "",
                "FrequencyId": "",
                "Frequency": "",
                "DoseOtherId": "",
                "DoseOther": "",
                "DaysSupplyId": "",
                "DaysSupply": "",
                "Quantity": "",
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "SubstitutionPermitted": "y",
                "PatientInstructions": "",
                "AssessmentsNotes": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "StopDate": null,
                "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEditMode": true
            }
            return obj;
        };
        function getEmptyPrescriptionObj() {
            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.cacheStorageItem.patientid,
                "RcopiaPatientId": "",
                "PatientPrescriptionId": 0,
                "AppointmentId": $scope.AppointmentID,
                "ProviderId": $scope.Appointmentinfo.DoctorID,
                "PrescribedDate": TodayDate,
                "RcopiaPrescriptionId": "",
                "LastUpdateDate": TodayDate,
                "PharmacyId": 0,
                "RcopiaPharmacyId": "",
                "PrescriberOrderNumber": "",
                "RxReferenceNumber": "",
                "PrescriptionAction": "",
                "CompletedDate": null,
                "SignedDate": null,
                "StopDate": null,
                "LastModifiedBy": $scope.UserId,
                "LastModifiedDate": TodayDate,
                "CompleteAction": "Created",
                "PrescriptionSentMethod": "",
                "PrescriptionStatus": "",
                "DeleteInd": "N",
                "RcopiaDeleted": "n",
                "PrescriptionDetails": []
            };
            return obj;
        };
        $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

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
        $scope.GetOrganName = function () {
            return [{
                "OrganId": "1",
                "OrganName": "OD"
            },
            {
                "OrganId": "2",
                "OrganName": "OS"
            },
            {
                "OrganId": "4",
                "OrganName": "General"
            }
            ];
        };
        $scope.GetOrganNameList = angular.copy($scope.GetOrganName());


        $scope.GetProcedureStatus = function () {
            return [{
                "StatusId": 1,
                "Status": "Active"
            },
            {
                "StatusId": 2,
                "Status": "InActive"
            },
            {
                "StatusId": 3,
                "Status": "Completed"
            }
            ];
        };

        $scope.GetProcedureStatusList = angular.copy($scope.GetProcedureStatus());
        $scope.Referralobj = {
            "OrderReferralDetailId": 0,
            "referralDoctorObj": "",
            "referralDoctorId": "",
            "referralDoctorName": "",
            "SpecializationObj": "",
            "SpecializationId": $scope.SpecializationId,
            "SpecializationName": "",
            "Type": "Internal",
            "OrderDate": "",
            "Alarm": "",
            "IsnewProvider": false,
            "ShowDateFormat": false,
            "DurationDate": "",
            "Duration": "",
            "DurationType": "",
        };

        $scope.GetAssessmentObj = function () {
            return {
                "SnomedCodeId": 0,
                "SnomedCode": "",
                "CreatedDateTime": "",
                "ConsultationDiagnosisId": 0,
                "AssessmentPlanId": 0,
                "AssessmentPlan": {
                    "AssessmentPlanId": 0,
                    "PlanofDiscussionsNotes": "",
                    "PatientInstructions": "",
                    "AssessmentsNotes": "",
                    "DoctorNotes": "",
                    "ActionsTaken": ""
                },
                "SpecializationId": $scope.SpecializationId,
                "Type": "Optha",
                "PriorityId": null,
                "DiagnosisId": 0,
                "PlanofDiscussionsNotes": "",
                "PatientInstructions": "",
                "AssessmentsNotes": "",
                "SubTab": "1",
                "DoctorNotes": "",
                "DiagnosisObject": "",
                "DiagnosisRiskLevel": 'Mild',
                "FindingDiagnosisId": 0,
                "DiagnosisHistoryId": 0,
                "ICD10CODE": "",
                "ICD10DIAGDESCRIPTION": "",
                "ICD10DIAGNAME": "",
                "PlanOfcareNotesArray": [],
                "ProceduresArray": [],
                "PrescriptionArray": [],
                "SurgeryArray": [],
                "InvestigationsArray": [],
                "InvestigationFindingId": 0,
                "FindingId": 0,
                //"ActiveInd": "Y",
                "DeleteInd": "N",
                "ProceduresAddedTime": "",
                "PrescriptionAddedTime": "",
                "PlanOfCareAddedTime": "",
                "SurgeryAddedTime": "",
                "IsEditData": false,
                "SelectedInvestigationObj": "",
                "InvsearchBy": 1,
                "OPDPsearchBy": 1,
                "SurgerysearchBy": 1,
                "ProcedureSurgerysearchBy": 1,
                "ReferralArray": [],
                "ActionsTaken": "",
                "RVerificationStatusId": 1,
                "LVerificationStatusId": 1,
                "MasterCareEpisodeId": null,
                "IsCheckedDiagnosis": false,
                "MasterCareEpisodeId": null,
                "MedicalPrescriptionDetails": [],
                "StatusList": [{
                    "OrganStatusId": null,
                    "OrganId": "1",
                    "SeverityId": null,
                    "Verificationstatusid": null,
                    "DiagnosisStatus": 'Not Examined',
                    "DiagnosisStatusId": 6,
                    "EndDate": '',
                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
                    "DeleteInd": 'N',

                },
                {
                    "OrganStatusId": null,
                    "OrganId": "2",
                    "SeverityId": null,
                    "Verificationstatusid": null,
                    "DiagnosisStatus": 'Not Examined',
                    "DiagnosisStatusId": 6,
                    "EndDate": '',
                    "StartDate": '',
                    "DeleteInd": 'N',

                }
                ],
                "CodeSystem": '',

            };
        };
        $scope.newAssessmentObj = angular.copy($scope.GetAssessmentObj());
        //orders obj
        $scope.adviseObj = {
            'SearchProcedureObj': "",
            'DiagnosisObject': "",
            'SearchReferalObj': ""
        };

        $scope.ResultObj = {
            "DurationDate": "",
            "DoctorsName": "",
            "LocationName": "",
            "InvestigationName": "",
            "LocationId": null,
            "Notes": "",
            "ResultId": 0,
        }



        $scope.GetPCPObj = function () {
            return {
                "PcpReferalId": 0,
                "FirstName": "",
                'LastName': '',
                'SuffixId': '',
                'Title': 'Mr',
                'Age': '',
                "MobileNo": null,
                "AlternateMobileNo": null,
                "Gender": "",
                "EmailId": "",
                'Address1': '',
                'Address2': '',
                'LocationId': null,
                "StateId": null,
                'CityId': null,
                'PinCode': '',
                'NPI': '',
                'SSN': '',
                'EmployeeId': '',
                'ZipCodePlusNo': '',
                "SpecializationId": null,
                "SubSpecializationId": null,
                "DeleteInd": false,
                "countrycode": "",
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ZipCode": '',
                "LocationName": "",
                "PcpOrganizationName": "",
                "CityName": "",
                "StateName": "",
                "ContactNo": null,
                "Slicence": "",
                "TaxonomyId": "",
                "Contactcountrycode": "",
                "SpecializationObj": "",
                "SubSpecializationObj": ""
            };
        };
        $scope.PCPObj = angular.copy($scope.GetPCPObj());
        $scope.ShowTab = 'Order';
        $scope.ChangeAllOrdersTab = function (type) {
            $scope.ShowTab = type;
            $scope.Referralobj.IsnewProvider = false;
        };
        //orders objend
        /* -------Emty-----*/

        $scope.ChangeICDcode = function (item) {
            if (item == '1') {
                $scope.AssessmentPlanobj.SnomedCodeShow = false;
            } else {
                $scope.AssessmentPlanobj.SnomedCodeShow = true;

            }
        }

        $scope.ClickcreateAddtemplateover = {
            templateUrl: 'AddDiagnosisTemplateSave.html',
        };
        $scope.ClickAddMultipletemplateover = {
            templateUrl: 'AddMultipleDiagnosisTemplateSave.html',
        };

        $scope.ClearNotesDeatils = function (item, type) {
            if (type == 'PlanofDiscussion') {
                item.PlanofDiscussionsNotes = "";
                $scope.assonj.EnterPlanOfDiscussionsTemplateName = '';
            }
            else if (type == 'Assessments') {
                item.AssessmentPlan.AssessmentsNotes = "";
                $scope.assonj.EnterAssessmentsNotesTemplateName = "";
            }
            else if (type == 'PatientInstructions') {
                item.PatientInstructions = "";
                $scope.assonj.EnterPatientsInstructionTemplateName = "";
            }
            else if (type == 'ActionsTaken') {
                item.ActionsTaken = "";
                $scope.assonj.EnterActionsTakenTemplateName = "";
            }
            else if (type == 'DoctorNotes') {
                item.DoctorNotes = "";
                $scope.assonj.EnterDoctorNotesTemplateName = "";
            } else {

            }

        }

        $scope.ChangeDiagnosis = function (mainitem) {
            angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                item.IsEditData = false;
                item.IsCheckedDiagnosis = false;
            })
            mainitem.IsEditData = true;
            mainitem.IsCheckedDiagnosis = true;
        }

        $scope.changePlanOfDiscussionsTemp = function (Subitem, mainitem) {
            mainitem.PlanofDiscussionsNotes = mainitem.PlanofDiscussionsNotes || '';
            if (mainitem.PlanofDiscussionsNotes == '') {
                mainitem.PlanofDiscussionsNotes = Subitem.PlanofDiscussionsNotes || '';
            } else {
                var notes = '';
                notes = mainitem.PlanofDiscussionsNotes;
                mainitem.PlanofDiscussionsNotes = notes + '\n' + Subitem.PlanofDiscussionsNotes || '';
            }
            $scope.assonj.SelectedPlanOfDiscussionsTemplateName = '';
        }
        $scope.changePatientsInstructionsTemp = function (Subitem, mainitem) {
            mainitem.PatientInstructions = mainitem.PatientInstructions || '';
            if (mainitem.PatientInstructions == '') {
                mainitem.PatientInstructions = Subitem.PatientInstructions || '';
            } else {
                var notes = '';
                notes = mainitem.PatientInstructions;
                mainitem.PatientInstructions = notes + '\n' + Subitem.PatientInstructions || '';
            }
            $scope.assonj.SelectedPatientsInstructionsTemplateName = '';
        }
        $scope.changeActionsTakenTemp = function (Subitem, mainitem) {
            mainitem.ActionsTaken = mainitem.ActionsTaken || '';
            if (mainitem.ActionsTaken == '') {
                mainitem.ActionsTaken = Subitem.ActionsTaken || '';
            } else {
                var notes = '';
                notes = mainitem.ActionsTaken;
                mainitem.ActionsTaken = notes + '\n' + Subitem.ActionsTaken || '';
            }
            $scope.assonj.SelectedActionsTakenTemplateName = '';
        }
        $scope.changeDoctorNotesTemp = function (Subitem, mainitem) {
            mainitem.DoctorNotes = mainitem.DoctorNotes || '';
            if (mainitem.DoctorNotes == '') {
                mainitem.DoctorNotes = Subitem.DoctorNotes || '';
            } else {
                var notes = '';
                notes = mainitem.DoctorNotes;
                mainitem.DoctorNotes = notes + '\n' + Subitem.DoctorNotes || '';
            }
            $scope.assonj.SelectedDoctorNotesTemplateName = '';
        }
        $scope.DelectAssessmentPlan = function (item, type) {
            var index = $scope.AssessmentplanpopupObj.AssessmentListArray.indexOf(item);
            if (item.ConsultationDiagnosisId === 0) {
                if (index > -1) {
                    $scope.AssessmentplanpopupObj.AssessmentListArray.splice(index, 1);

                }
            } else {
                $scope.AssessmentplanpopupObj.AssessmentListArray[index].DeleteInd = 'Y';
                if (item.CodeSystem == "Snomed-CT") {
                    var obj = {
                        "Deleted": 'y',
                        "Status": 'Deleted',
                        "RcopiaProblemId": item.RcopiaProblemId || "",
                        "OnsetDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                        "RcopiaID": item.RcopiaProblemId || "",
                        "ExternalID": item.ConsultationDiagnosisId,
                        "IsIcd11": false,
                        "IsIcd10": false,
                        "IsIcd9": false,
                        "IsSnomedCode": true,
                        "DiagnosisCode": '',
                        "DiagnosisName": '',
                        "SnomedConceptID": item.ICD10CODE || '',
                        "SnomedDescription": item.ICD10DIAGNAME,

                    };
                }
                else {
                    var obj = {
                        "Deleted": 'y',
                        "Status": 'Deleted',
                        "RcopiaProblemId": item.RcopiaProblemId || "",
                        "OnsetDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                        "RcopiaID": item.RcopiaProblemId || "",
                        "ExternalID": item.ConsultationDiagnosisId,
                        "IsIcd11": false,
                        "IsIcd10": true,
                        "IsIcd9": false,
                        "IsSnomedCode": item.SnomedCode || '',
                        "DiagnosisCode": item.ICD10CODE || '', //ICD10CODE olny
                        "DiagnosisName": item.ICD10DIAGNAME,
                        "SnomedConceptID": '',
                        "SnomedDescription": '',

                    };
                }
                $scope.addUpdatePatientProblemsToRcopiaReqObj.DiagnosisList.push(obj);
                eHnoteDiagnosisDataServices.addPatientProblemToRcopia($scope.addUpdatePatientProblemsToRcopiaReqObj).then(function (response) {

                    console.log(JSON.stringify(response));

                    if (response.data.status === 'Success') {

                    }
                });
            }


            if (type == "popup") {
                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    var i = 0;
                    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (aitem) {
                        if (i === 0) {
                            if (aitem.DeleteInd === "N") {
                                i++;
                                $scope.ChangeDiagnosis(aitem);
                            }
                        }
                    });
                }
            }
        };

        $scope.ChangeReferralTab = function (type, item) {
            if (item == 1) {
                $scope.assonj.ShowTab = type;
                $scope.Referralobj.IsnewProvider = false;
            }
            else {
                $scope.assonj.AllOrderTab = type;
            }

            if (type == 'Referral') {
                getBranchSpecializations(0, $scope.HospitalId);
            }

        };


        function addAssessmentInvestigations(SelectedInvestigationItem, mainitem) {
            var object = {
                "PatientInvestigationId": 0,
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": 1,
                /* "DescriptionId": SelectedInvestigationItem.InvestigationId || "",*/
                "DescriptionId": SelectedInvestigationItem.ProcedureId || "",
                /* "Description": SelectedInvestigationItem.InvestigationName || "",*/
                "Description": SelectedInvestigationItem.ProcedureName || "",
                "ProcedureCode": SelectedInvestigationItem.ProcedureCode || 0,
                /*"OrgDescriptionId": SelectedInvestigationItem.OrgInvestigationId || 0,*/
                "OrgDescriptionId": SelectedInvestigationItem.OrganizationProcedureId || 0,
                "Remarks": SelectedInvestigationItem.InvestigationNotes || "",
                "OrganId": SelectedInvestigationItem.OrganId || "",
                "OrganName": "",
                "BillingCode": "",
                "BookingStatusId": "2",
                "CPTCode": SelectedInvestigationItem.CPTCode || "",
                "StatusId": SelectedInvestigationItem.StatusId || "1",
                "DeleteInd": "N",
                "InvSpecialityId": "",
                "PatientSurgeryId": 0,
                "SurgeryListId": 0,
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "DurationType": SelectedInvestigationItem.DurationType || "",
                "Duration": SelectedInvestigationItem.Duration || '',
                "DurationDate": SelectedInvestigationItem.DurationDate || '',
                "OrderScheduleDate": SelectedInvestigationItem.OrderScheduleDate || null,
                "DiagnosisList": [],
                "OrderType": "Investigations",
                "ModalityId": SelectedInvestigationItem.ModalityId || 1,
                "AdvicedInvestigationId": 0,
                "GeneralCost": SelectedInvestigationItem.GeneralCost || 0,
                "TypeOfServiceId": SelectedInvestigationItem.TypeOfServiceId || 0,
                "ProcedureDescription": SelectedInvestigationItem.ProcedureDescription || 0,
                "ShowDateFormat": SelectedInvestigationItem.ShowDateFormat || false,
                "StatusId": SelectedInvestigationItem.StatusId || 1,
                "Status": SelectedInvestigationItem.Status || "Active"
            }
            var list = {
                "DiagnosisDetailId": 0,
                "DiagnosisId": mainitem.DiagnosisId,
                "DiagnosisName": mainitem.ICD10DIAGNAME,
                "ICDCode": mainitem.ICD10CODE,
                "ActiveInd": "Y"
            };
            object.DiagnosisList.push(list);
            $scope.AssessmentplanpopupObj.OrdersInvestigationArray.push(object);

        }
        $scope.onAsseselectInvestigation = function (InvObject, mainitem) {

            if (InvObject.ProcedureId === '') {
                InvObject.InvestigationName = '';
                return false;
            }
            $scope.obj = {
                "SelectedInvestigationItem": ""
            }
            $scope.obj.SelectedInvestigationItem = InvObject || "";
            if ($scope.obj.SelectedInvestigationItem === "") {
                return;
            }
            var object = {
                "PatientInvestigationId": 0,
                "PatientOrderId": 0,
                "ProcedureCode": $scope.obj.SelectedInvestigationItem.CPTCode || "",    //$scope.obj.SelectedInvestigationItem.ProcedureCode
                "OrgInvestigationId": $scope.obj.SelectedInvestigationItem.OrganizationProcedureId,
                "SpecializationId": $scope.SpecializationId,
                "InvestigationId": $scope.obj.SelectedInvestigationItem.ProcedureId,
                "InvestigationName": $scope.obj.SelectedInvestigationItem.ProcedureName,
                "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "OrganId": mainitem.OrganId || "0",
                "InvestigationNotes": $scope.obj.SelectedInvestigationItem.Notes || "",
                "DeleteInd": "N",
                "IsEdit": false,
                "ShowDateFormat": true,
                "DurationDate": "",
                "Duration": "",
                "DurationType": "",
                "Remarks": "",
                // "BookingStatusId": "",
                "StatusId": 1,
                "Status": "Active"
            }

            var i = 0;
            mainitem.InvestigationsArray = mainitem.InvestigationsArray || [];
            if (mainitem.InvestigationsArray.length > 0) {
                angular.forEach(mainitem.InvestigationsArray, function (item) {
                    if (item.InvestigationId === $scope.obj.SelectedInvestigationItem.ProcedureId && item.DeleteInd === 'N') {
                        alertify.error('You already entered this Investigation');
                        i++;
                        return false;
                    }
                });
            }
            if (i === 0) {
                mainitem.InvestigationsArray.push(object);

                var obj = {
                    "PatientOrderId": 0,
                    "SpecializationId": $scope.SpecializationId,
                    "OrderTypeId": 1,
                    "OrderType": "Investigation",
                    "Description": $scope.obj.SelectedInvestigationItem.ProcedureName,
                    "DescriptionId": $scope.obj.SelectedInvestigationItem.ProcedureId,
                    "OrgInvestigationId": $scope.obj.SelectedInvestigationItem.OrganizationProcedureId,
                    "Remarks": $scope.obj.SelectedInvestigationItem.Notes || "",
                    "OrganId": mainitem.OrganId,
                    "OrganName": GetEyeName(mainitem.OrganId),
                    "BillingCode": $scope.obj.SelectedInvestigationItem.CPTCode || "",
                    "BookingStatusId": "2",
                    //"CPTCode": $scope.obj.SelectedInvestigationItem.CPTCode || "",
                    "ProcedureCode": $scope.obj.SelectedInvestigationItem.ProcedureCode || "",
                    "StatusId": $scope.obj.SelectedInvestigationItem.StatusId ? $scope.obj.SelectedInvestigationItem.StatusId : "1",
                    "DeleteInd": "N",
                    "InvSpecialityId": $scope.obj.SelectedInvestigationItem.InvSpecialityId,
                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                    "DiagnosisList": [],
                    "ReferralDoctorName": "",
                    "PatientSurgeryId": "",
                    "SurgeryListId": "",
                    "GeneralCost": $scope.obj.SelectedInvestigationItem.GeneralCost,
                    "TypeOfServiceId": $scope.obj.SelectedInvestigationItem.TypeOfServiceId,
                    "ProcedureDescription": $scope.obj.SelectedInvestigationItem.ProcedureDescription
                }
                var OrganizationDiagnosisId = 0;
                if (mainitem.DiagnosisObject != undefined) {
                    OrganizationDiagnosisId = mainitem.DiagnosisObject.OrganizationDiagnosisId || 0;
                }
                var list = {
                    "DiagnosisDetailId": 0,
                    "DiagnosisId": mainitem.DiagnosisId,
                    "OrganizationDiagnosisId": OrganizationDiagnosisId,  //mainitem.DiagnosisObject.OrganizationDiagnosisId,
                    "DiagnosisName": mainitem.DiagnosisName,
                    "ICDCode": mainitem.ICD10CODE,
                    "ActiveInd": "Y"
                };
                obj.DiagnosisList.push(list);
                $scope.AssessmentplanpopupObj.OrdersArray.push(obj);

                if ($scope.AssessmentplanpopupObj.OrdersInvestigationArray.length > 0) {
                    var list = $filter("filter")($scope.AssessmentplanpopupObj.OrdersInvestigationArray, {
                        "OrgDescriptionId": $scope.obj.SelectedInvestigationItem.OrganizationProcedureId, "DescriptionId": $scope.obj.SelectedInvestigationItem.ProcedureId, 'DeleteInd': 'N'
                    }, true) || [];

                    if (list.length > 0) {
                        var listfilter = $filter("filter")(list[0].DiagnosisList, {
                            "DiagnosisId": mainitem.DiagnosisId, 'ActiveInd': 'Y'
                        }, true) || [];
                        if (listfilter.length == 0) {
                            var list1 = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": mainitem.DiagnosisId,
                                "DiagnosisName": mainitem.ICD10DIAGNAME,
                                "ICDCode": mainitem.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            list[0].DiagnosisList.push(list1);
                        }
                    } else {
                        addAssessmentInvestigations($scope.obj.SelectedInvestigationItem, mainitem);
                    }

                } else {
                    addAssessmentInvestigations($scope.obj.SelectedInvestigationItem, mainitem);
                }

            }

            $scope.assonj.SearchProcedureObj = "";
            $scope.InvSpecialityId = InvObject.InvSpecialityId;
            $scope.GetAllSpecialityInd = InvObject.GetAllSpecialityInd;
            $scope.obj.SelectedInvestigationItem = "";
        };

        function addassessmentProcedure(item, mainitem) {
            var object = {
                "PatientProcedureId": 0,
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": 2,
                "OrderType": "Procedure",
                "DescriptionId": item.ProcedureId || "",
                "Description": item.ProcedureName || "",
                "ProcedureCode": item.ProcedureCode || 0,
                /*"OrgDescriptionId": item.OrgProcedureId || 0,*/
                "OrgDescriptionId": item.OrganizationProcedureId || 0,
                "Remarks": item.ProcedureNotes || "",
                "OrganId": item.OrganId || "",
                "OrganName": "",
                "BillingCode": "",
                "BookingStatusId": "2",
                "CPTCode": item.CPTCode || "",
                "StatusId": item.StatusId || "1",
                "DeleteInd": "N",
                "InvSpecialityId": "",
                "PatientSurgeryId": 0,
                "SurgeryListId": 0,
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "DurationType": item.DurationType || "",
                "Duration": item.Duration || '',
                "DurationDate": item.DurationDate || '',
                "DiagnosisList": [],
                "AdvicedInvestigationId": 0,
                "GeneralCost": item.GeneralCost || 0,
                "TypeOfServiceId": item.TypeOfServiceId || 0,
                "ProcedureDescription": item.ProcedureDescription || "",
                "ShowDateFormat": item.ShowDateFormat || false,
                "StatusId": item.StatusId || 1,
                "Status": item.Status || "Active"
            }
            var list = {
                "DiagnosisDetailId": 0,
                "DiagnosisId": mainitem.DiagnosisId,
                "DiagnosisName": mainitem.ICD10DIAGNAME,
                "ICDCode": mainitem.ICD10CODE,
                "ActiveInd": "Y"
            };
            object.DiagnosisList.push(list);
            $scope.AssessmentplanpopupObj.OrdersProcedureArray.push(object);
        }
        $scope.onAsseselectProcedureItem = function (Subitem, mainitem) {
            var item = Subitem;
            if (item.ProcedureId === '') {
                item.ProcedureName = '';
                return false;
            }

            item.SelectedProcedureObj = item;
            var object = {
                "PatientProcedureId": 0,
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "ProcedureCode": item.SelectedProcedureObj.CPTCode || "", //$scope.assonj.SelectedSurgeryObj.ProcedureCode || "",  //item.SelectedProcedureObj.ProcedureCode
                "OrgProcedureId": item.SelectedProcedureObj.OrganizationProcedureId,
                "ProcedureId": item.SelectedProcedureObj.ProcedureId,
                "ProcedureName": item.SelectedProcedureObj.ProcedureName,
                "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "ProceduredDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                "OrganId": mainitem.OrganId || '0',
                "OrganName": GetEyeName(mainitem.OrganId),
                "ProcedureNotes": "",
                "DeleteInd": "N",
                "IsEdit": false,
                "Duration": "",
                "DurationType": "",
                "ShowDateFormat": true,
                "DurationDate": "",
                "Remarks": "",
                //"BookingStatusId": "",
                "StatusId": 1,
                "Status": "Active"
            };
            var i = 0;
            mainitem.ProceduresArray = mainitem.ProceduresArray || [];
            if (mainitem.ProceduresArray.length > 0) {
                angular.forEach(mainitem.ProceduresArray, function (initem) {
                    if (initem.ProcedureId === item.ProcedureId && initem.DeleteInd === "N") {
                        alertify.error('You have already entered this Procedure');
                        i++;
                    }
                });
            };

            if (i === 0) {
                mainitem.ProceduresArray.push(object);
                var obj = {
                    "PatientOrderId": 0,
                    "SpecializationId": $scope.SpecializationId,
                    "OrderTypeId": 2,
                    "OrderType": "Procedure",
                    "Description": item.SelectedProcedureObj.ProcedureName,
                    "DescriptionId": item.SelectedProcedureObj.ProcedureId,
                    "OrgProcedureId": item.SelectedProcedureObj.OrganizationProcedureId,                 //OrgProcedureId,
                    "Remarks": item.SelectedProcedureObj.ProcedureNotes || "",
                    "OrganId": mainitem.OrganId,
                    "OrganName": GetEyeName(mainitem.OrganId),
                    "BillingCode": item.SelectedProcedureObj.CPTCode || "", // item.SelectedProcedureObj.BillingCode || "",
                    "BookingStatusId": "2",
                    "CPTCode": item.SelectedProcedureObj.CPTCode || "",  //"",
                    "StatusId": "",
                    "DeleteInd": "N",
                    "InvSpecialityId": "",
                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                    "DiagnosisList": [],
                    "ReferralDoctorName": "",
                    "PatientSurgeryId": "",
                    "SurgeryListId": "",
                    "ProcedureCode": item.SelectedProcedureObj.ProcedureCode,
                    "GeneralCost": item.SelectedProcedureObj.GeneralCost,
                    "TypeOfServiceId": item.SelectedProcedureObj.TypeOfServiceId,
                    "ProcedureDescription": item.SelectedProcedureObj.ProcedureDescription
                }

                var OrganizationDiagnosisId = 0;
                if (mainitem.DiagnosisObject != undefined) {
                    OrganizationDiagnosisId = mainitem.DiagnosisObject.OrganizationDiagnosisId || 0;
                }

                var list = {
                    "DiagnosisDetailId": 0,
                    "DiagnosisId": mainitem.DiagnosisId,
                    "OrganizationDiagnosisId": OrganizationDiagnosisId, // mainitem.DiagnosisObject.OrganizationDiagnosisId,
                    "DiagnosisName": mainitem.DiagnosisName,
                    "ICDCode": mainitem.ICD10CODE,
                    "ActiveInd": "Y"
                };
                obj.DiagnosisList.push(list);
                $scope.AssessmentplanpopupObj.OrdersArray.push(obj);


                if ($scope.AssessmentplanpopupObj.OrdersProcedureArray.length > 0) {
                    var list = $filter("filter")($scope.AssessmentplanpopupObj.OrdersProcedureArray, {
                        "OrgDescriptionId": item.SelectedProcedureObj.OrganizationProcedureId, "DescriptionId": item.SelectedProcedureObj.ProcedureId, 'DeleteInd': 'N'
                    }, true) || [];

                    if (list.length > 0) {
                        var listfilter = $filter("filter")(list[0].DiagnosisList, {
                            "DiagnosisId": mainitem.DiagnosisId, 'ActiveInd': 'Y'
                        }, true) || [];
                        if (listfilter.length == 0) {
                            var list1 = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": mainitem.DiagnosisId,
                                "DiagnosisName": mainitem.ICD10DIAGNAME,
                                "ICDCode": mainitem.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            list[0].DiagnosisList.push(list1);
                        }
                    } else {
                        addassessmentProcedure(item.SelectedProcedureObj, mainitem);
                    }

                } else {
                    addassessmentProcedure(item.SelectedProcedureObj, mainitem);
                }

            }
            $scope.assonj.SearchProcedureObj = "";
        };

        function addAssessmentSurgery(item, mainitem) {
            var object = {
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": 3,
                //"DescriptionId": item.SurgeryId || "",
                //"Description": item.SurgeryName || "",
                "ProcedureCode": item.ProcedureCode || 0,
                //"OrgDescriptionId": item.OrgSurgeryId || 0,
                "DescriptionId": item.ProcedureId || "",
                "Description": item.ProcedureName || "",
                "OrgDescriptionId": item.OrganizationProcedureId || 0,
                "Remarks": item.ExternalCoManagerRemarks || "",
                "OrganId": item.OrganId || "",
                "OrganName": "",
                "BillingCode": "",
                "BookingStatusId": "2",
                "CPTCode": item.CPTCode || "",
                "StatusId": item.StatusId || "1",
                "DeleteInd": "N",
                "InvSpecialityId": "",
                "PatientSurgeryId": 0,
                "SurgeryListId": 0,
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "DurationType": item.DurationType || "",
                "Duration": item.Duration || '',
                "DurationDate": item.DurationDate || '',
                "DiagnosisList": [],
                "OrderType": "Surgery",
                /*"ModalityId": 1,*/
                "AdvicedInvestigationId": 0,
                "GeneralCost": item.GeneralCost || 0,
                "TypeOfServiceId": item.TypeOfServiceId || 0,
                "ProcedureDescription": item.ProcedureDescription || 0,
                "CoordinatorId": item.CoordinatorId || 0,
                "CoordinatorName": item.CoordinatorName || '',
                "ExternalCoManagerId": item.ExternalCoManagerId || 0,
                "ExternalCoManagerName": item.ExternalCoManagerName || '',
                "InternalCoManagerId": item.InternalCoManagerId || 0,
                "InternalCoManagerName": item.InternalCoManagerName || '',
                "DoctorNotes": mainitem.DoctorNotes || "",
                "ShowDateFormat": item.ShowDateFormat || false,
                "StatusId": item.StatusId || 1,
                "Status": item.Status || "Active"
            }
            var list = {
                "DiagnosisDetailId": 0,
                "DiagnosisId": mainitem.DiagnosisId,
                "DiagnosisName": mainitem.ICD10DIAGNAME,
                "ICDCode": mainitem.ICD10CODE,
                "ActiveInd": "Y"
            };
            object.DiagnosisList.push(list);
            $scope.AssessmentplanpopupObj.OrdersSurgeryArray.push(object);

        }
        $scope.onAsseselectSurgeryItem = function (item, mainitem) {
            /*item.SelectedSurgeryObj.ProcedureId === ''*/
            if (item.ProcedureId === '') {
                item.ProcedureName = '';
                return false;
            }
            $scope.assonj.SelectedSurgeryObj = item || "";
            if ($scope.assonj.SelectedSurgeryObj === "") {
                return;
            }
            var Object = {
                "PatientSurgeryId": 0,
                "PatientOrderId": 0,
                "ProcedureCode": $scope.assonj.SelectedSurgeryObj.CPTCode || "",  // $scope.assonj.SelectedSurgeryObj.ProcedureCode
                "OrgSurgeryId": $scope.assonj.SelectedSurgeryObj.OrganizationProcedureId,
                "SurgeryId": $scope.assonj.SelectedSurgeryObj.ProcedureId,
                "SurgeryName": $scope.assonj.SelectedSurgeryObj.ProcedureName,
                "SpecializationId": $scope.SpecializationId,
                "SurgeryDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                "CreatedDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "OrganId": mainitem.OrganId || '0',
                "OrganName": GetEyeName(mainitem.OrganId),
                "SurgeryNotes": "",
                "DeleteInd": "N",
                "IsEdit": false,
                "InternalCoManagerId": null,
                "CoordinatorId": null,
                "CoordinatorRemarks": '',
                "ExternalCoManagerRemarks": '',
                "InternalCoManagerRemarks": '',
                "IsCoordinatorRemarks": false,
                "IsExternalCoManagerRemarks": false,
                "IsInternalCoManagerRemarks": false,
                "ExternalCoManagerId": null,
                "Duration": "",
                "DurationType": "",
                "ShowDateFormat": true,
                "DurationDate": "",
                "Remarks": "",
                //"BookingStatusId": "2",
                "StatusId": 1,
                "Status": "Active"
            }

            var i = 0;
            mainitem.SurgeryArray = mainitem.SurgeryArray || [];
            if (mainitem.SurgeryArray.length > 0) {
                angular.forEach(mainitem.SurgeryArray, function (item) {
                    if (item.OrgSurgeryId === $scope.assonj.SelectedSurgeryObj.OrganizationProcedureId && item.DeleteInd === 'N') {
                        alertify.error('You have already added these Surgery');
                        i++;
                        return false;
                        $scope.assonj.SearchProcedureObj = '';
                    }
                });
            }


            if (i === 0) {

                Object.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");
                mainitem.SurgeryArray.push(Object);

                var obj = {
                    "PatientOrderId": 0,
                    "SpecializationId": $scope.SpecializationId,
                    "OrderTypeId": 3,
                    "OrderType": "Surgery",
                    "Description": Object.SurgeryName,
                    "DescriptionId": Object.SurgeryId,
                    "OrgSurgeryId": Object.OrgSurgeryId,
                    "Remarks": Object.SurgeryNotes || "",
                    "OrganId": mainitem.OrganId,
                    "OrganName": GetEyeName(mainitem.OrganId),
                    //"BillingCode": item.CPTCode, //item.BillingCode,
                    "BookingStatusId": "2",
                    //  "CPTCode": item.CPTCode,  //"",
                    "StatusId": Object.SurgeryStatusId || 1,
                    "DeleteInd": "N",
                    "InvSpecialityId": "",
                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                    "DiagnosisList": [],
                    "ReferralDoctorName": "",
                    "PatientSurgeryId": 0,
                    "SurgeryListId": 0,
                    "InternalCoManagerId": null,
                    "CoordinatorId": null,
                    "ExternalCoManagerId": null,
                    "ProcedureCode": Object.ProcedureCode,
                    "GeneralCost": $scope.assonj.SelectedSurgeryObj.GeneralCost,
                    "TypeOfServiceId": $scope.assonj.SelectedSurgeryObj.TypeOfServiceId,
                    "ProcedureDescription": $scope.assonj.SelectedSurgeryObj.ProcedureDescription
                }

                var OrganizationDiagnosisId = 0;
                if (mainitem.DiagnosisObject != undefined) {
                    OrganizationDiagnosisId = mainitem.DiagnosisObject.OrganizationDiagnosisId || 0;
                }

                var list = {
                    "DiagnosisDetailId": 0,
                    "DiagnosisId": mainitem.DiagnosisId,
                    "OrganizationDiagnosisId": OrganizationDiagnosisId,  // mainitem.DiagnosisObject.OrganizationDiagnosisId,
                    "DiagnosisName": mainitem.DiagnosisName,
                    "ICDCode": mainitem.ICD10CODE,
                    "ActiveInd": "Y"
                };
                obj.DiagnosisList.push(list);
                $scope.AssessmentplanpopupObj.OrdersArray.push(obj);



                if ($scope.AssessmentplanpopupObj.OrdersSurgeryArray.length > 0) {
                    var list = $filter("filter")($scope.AssessmentplanpopupObj.OrdersSurgeryArray, {
                        "OrgDescriptionId": item.OrganizationProcedureId, "DescriptionId": item.ProcedureId, 'DeleteInd': 'N'
                    }, true) || [];

                    if (list.length > 0) {
                        var listfilter = $filter("filter")(list[0].DiagnosisList, {
                            "DiagnosisId": mainitem.DiagnosisId, 'ActiveInd': 'Y'
                        }, true) || [];
                        if (listfilter.length == 0) {
                            var list1 = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": mainitem.DiagnosisId,
                                "DiagnosisName": mainitem.ICD10DIAGNAME,
                                "ICDCode": mainitem.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            list[0].DiagnosisList.push(list1);
                        }
                    } else {
                        addAssessmentSurgery($scope.assonj.SelectedSurgeryObj, mainitem);
                    }

                } else {
                    addAssessmentSurgery($scope.assonj.SelectedSurgeryObj, mainitem);
                }

                $scope.assonj.SelectedSurgeryObj = "";


            }

            $scope.assonj.SearchProcedureObj = '';

        };

        $scope.OnClickAdvisedProcedure = function (Subitem, mainitem) {
            //if ($scope.Assesmenttab == 1) {
            //    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
            //        item.IsCheckedDiagnosis = false;
            //    });
            //    mainitem.IsCheckedDiagnosis = true;

            //    if (Subitem.OrderTypeId == 1) {
            //        $scope.onAsseselectInvestigation(Subitem, mainitem);
            //    }
            //    if (Subitem.OrderTypeId == 2) {
            //        $scope.onAsseselectProcedureItem(Subitem, mainitem);

            //    }
            //    if (Subitem.OrderTypeId == 3) {
            //        $scope.onAsseselectSurgeryItem(Subitem, mainitem);

            //    }
            //}
            //else {
            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                var filterProcedure = $filter("filter")($scope.AdvisedOrderDetailsArray, function (Aitem, index) { return Aitem.ProcedureCode == Subitem.ProcedureCode && Aitem.DeleteInd == 'N' },);
                if (filterProcedure.length > 0) {
                    $scope.adviseObj.SearchProcedureObj = "";
                    alertify.error("Procedure Already Added");
                    return false;
                }
            }

            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });
            }
            if ($scope.AddDiagnosisAssesmentPlanArray.length > 0) {
                angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (item) {
                    item.IsCheckedDiagnosis = false;
                });
            }

            if (Subitem.OrderType == 'Investigation') {
                Subitem.OrderType = 'Investigations';
            }
            if (Subitem.ProcedureName !== "Referral") {
                var object = {
                    "PatientOrderId": 0,
                    "SpecializationId": 0,
                    "OrderTypeId": Subitem.OrderTypeId,
                    "DescriptionId": Subitem.ProcedureId || "",
                    "Description": Subitem.ProcedureName || "",
                    "ProcedureCode": Subitem.ProcedureCode || 0,
                    "OrgDescriptionId": Subitem.OrganizationProcedureId || 0,
                    "Remarks": "",
                    "OrganId": 1,
                    "OrganName": "OD",
                    "BillingCode": "",
                    "BookingStatusId": "2",
                    "CPTCode": Subitem.CPTCode,
                    "StatusId": "1",
                    "DeleteInd": "N",
                    "InvSpecialityId": "",
                    "PatientSurgeryId": 0,
                    "SurgeryListId": 0,
                    "IsEditData": true,
                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                    "DurationType": Subitem.DurationType || "D",
                    "CoordinatorId": Subitem.CoordinatorId || 0,
                    "ExternalCoManagerId": Subitem.ExternalCoManagerId || 0,
                    "InternalCoManagerId": Subitem.InternalCoManagerId || 0,
                    "ShowDateFormat": true,
                    "Duration": '',
                    "DurationType": '',
                    "DurationDate": '',
                    "DiagnosisList": [],
                    "OrderType": Subitem.OrderType,
                    "ModalityId": 1,
                    "AdvicedInvestigationId": 0,
                    "PatientInvestigationId": 0,
                    "PatientProcedureId": 0,
                    "StatusId": 1,
                    "Status": "Active"
                }
                $scope.Referralobj.FinalObj = object.OrderType;
                $scope.Referralobj.OrderTypeId = object.OrderTypeId;
                $scope.AdvisedOrderDetailsArray.push(object);
            }

            $scope.adviseObj.SearchProcedureObj = "";
            $scope.adviseObj.DiagnosisObject = "";
            $scope.ContentButtonShowInvestigation = false;
            $scope.ContentButtonShowActiveProcedure = false;
            $scope.ContentButtonShowActiveSurgery = false;
            $scope.ContentButtonShowActiveReferral = false;

            if (Subitem.OrderTypeId == 1) {
                $scope.ContentButtonShowInvestigation = true;
            } else if (Subitem.OrderTypeId == 2) {
                $scope.ContentButtonShowActiveProcedure = true;
            }
            else if (Subitem.OrderTypeId == 3) {
                $scope.ContentButtonShowActiveSurgery = true;
            }
            //  }

        }

        $scope.OnClickReferralSearch = function (item, mainitem) {
            mainitem.ReferralArray = mainitem.ReferralArray || [];

            $scope.Referralobj = {
                "OrderReferralDetailId": 0,
                "referralDoctorObj": "",
                "referralDoctorId": "",
                "referralDoctorName": "",
                "SpecializationObj": 3,
                "SpecializationId": 3,
                "SpecializationName": "",
                "Type": "Internal",
                "OrderDate": "",
                "Alarm": "",
                "IsnewProvider": false,
                "ShowDateFormat": true,
                "DurationDate": "",
                "Duration": "",
                "DurationType": "",
            };

            var object = {
                "PatientReferralDetailId": 0,
                "PatientOrderId": 0,
                "SpecializationId": $scope.Referralobj.SpecializationId || "",
                "Remarks": "",
                "Type": $scope.Referralobj.Type || "Internal",
                "DeleteInd": "N",
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "ReferralDoctorName": $scope.Referralobj.referralDoctorName || "",
                "ReferralDoctorId": $scope.Referralobj.referralDoctorId || null,
                "SpecializationName": $scope.Referralobj.SpecializationName || "",
                "Alarm": "",
                "ShowDateFormat": true,
                "IsUrgency": false,
                "IsFollowUpAfterReferral": false,
                "IsIncludeInCaseHistory": false,
                "DurationDate": null,
                "Duration": "",
                "ReferralImageArray": [],
                "DiagnosisList": [],
                "ReferralReason": "",
                "DurationType": "",
                "ReferralId": item.ReferralId,
                "Referral": item.Referral || "",
            };

            var i = 0;

            if (mainitem.ReferralArray.length > 0) {
                angular.forEach(mainitem.ReferralArray, function (initem) {
                    if (item.ReferralId == initem.ReferralId && initem.DeleteInd == 'N') {
                        alertify.error('You already entered this Referral');
                        i++;
                    }
                });
            };

            if (i === 0) {
                mainitem.ReferralArray.push(object);
                //    $scope.AssessmentplanpopupObj.ReferralDetails.push(object);
            }

            $scope.assonj.SearchReferralObj = '';
        };

        $scope.SaveTextDiagnosis = function () {

            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                var filterdiagnosis = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "DiagnosisId": 2, "DeleteInd": "N" }, true);
                if (filterdiagnosis.length > 0) {
                    $scope.newAssessmentObj.DiagnosisObject = "";
                    alertify.error("Diagnosis Already Added");
                    return false;
                }
            }

            $scope.newAssessmentObj.ICD10CODE = 'NSD';
            $scope.newAssessmentObj.ICD10DIAGNAME = 'General Careplan';
            $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = 'NSD-UnSpecifiedDiagnosis';
            $scope.newAssessmentObj.DiagnosisName = 'General Careplan';
            $scope.newAssessmentObj.DiagnosisDescription = 'NSD-UnSpecifiedDiagnosis';
            $scope.newAssessmentObj.DiagnosisId = 2;
            $scope.newAssessmentObj.OrganizationDiagnosisId = 1;
            $scope.newAssessmentObj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

            $scope.newAssessmentObj.IsEditData = true;
            $scope.newAssessmentObj.Type = 'NotDiagnosis';
            $scope.newAssessmentObj.GeneralDiagnosisStatusName = "Active";
            $scope.newAssessmentObj.GeneralDiagnosisStatusId = 2;
            $scope.newAssessmentObj.LDiagnosisStatusId = '';
            $scope.newAssessmentObj.RDiagnosisStatusId = '';
            $scope.newAssessmentObj.StatusList = [];

            let obj = {
                "OrganStatusId": null,
                "OrganId": "4",
                "SeverityId": null,
                "Verificationstatusid": 4,
                "DiagnosisStatus": 'Active',
                "DiagnosisStatusId": 2,
                "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "DeleteInd": 'N',
            }

            $scope.newAssessmentObj.StatusList.push(obj);

            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length !== 0) {
                angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                    item.IsEditData = false;
                });
            }
            $scope.AssessmentplanpopupObj.AssessmentListArray.push($scope.newAssessmentObj);

            $scope.newAssessmentObj = angular.copy($scope.GetAssessmentObj());

        }
        $scope.pushPrescriptionMedicationDetails1 = function (obj, type, mainitem) {
            $scope.SigSearch.Shows = false;
            obj.SigFields = false;
            mainitem.fastsig = false;
            var newmedicationobj = getNewPrescriptionDetailObj();
            if (type === 'Rcopia') {
                newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId;
                newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID;
                newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID;
                newmedicationobj.DrugGenericId = obj.GenericID;
                newmedicationobj.DrugBrandName = obj.BrandName;
                newmedicationobj.DrugGenericName = obj.GenericName;
                newmedicationobj.DrugForm = obj.Form;
                newmedicationobj.DrugStrength = obj.Strength;
                newmedicationobj.MedicationName = obj.BrandName + " " + obj.Strength;
                newmedicationobj.DrugSchedule = obj.Schedule;
                newmedicationobj.DrugSupply = obj.RouteCode;
                newmedicationobj.DrugCompound = "";
                newmedicationobj.Type = "MedicineOrders";
                var mparams = {
                    "UserId": $scope.UserId,
                    "MedicineId": 0,
                    "RcopiaDrugId": obj.RcopiaDrugId,
                    "DrugNDCID": obj.RcopiaDrugNDCID,
                    "FirstDataBankMedID": obj.FirstDataBankMedID,
                    "DrugGenericID": obj.GenericID,
                    "DrugName": obj.BrandName,
                    "GenericName": obj.GenericName,
                    "MedicineType": obj.Form,
                    "Strength": obj.Strength,
                    "Schedule": obj.Schedule,
                    "RouteCode": obj.RouteCode,
                    "RxNormList": []
                }

                if (obj.RxNormList.length > 0) {
                    var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a' }, true) || [];
                    if (filteredRxNorm.length > 0) {
                        newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                        var rxNormObj = {
                            "MedicineRxNormsId": 0,
                            "RxnormID": filteredRxNorm[0].RxnormID,
                            "RxnormIDType": filteredRxNorm[0].RxnormIDType,
                            "Status": "a",
                            "Representative": "y"
                        }

                        mparams.RxNormList.push(rxNormObj)
                    }
                }
                eHnoteDiagnosisDataServices.UpdateFirstBankMasterDrugDetails(mparams).then(function (response) {

                    console.log(JSON.stringify(response));
                    if (response.data.status === 'Success') {
                        newmedicationobj.MedicationId = response.data.MedicineId;

                        if (response.data.RxNormList.length > 0) {
                            var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                            if (filteredRxNorm.length > 0) {
                                newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                            }
                        }

                        var medi = 0;
                        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                if (item.MedicationId == newmedicationobj.MedicationId) {
                                    medi++;
                                }
                            });
                        }


                        if (medi > 0) {
                            alertify.error('You have already entered this Drug');
                            $scope.medicineGetObj.MedicineObject = "";
                        } else {
                            $scope.PrescriptionMainAddObj.PrescriptionDetails.push(newmedicationobj);
                            $scope.medicineGetObj.MedicineObject = "";
                            if (mainitem != '') {
                                mainitem.MedicalPrescriptionDetails.push(newmedicationobj);
                            }
                        }

                    }
                });
            } else {
                newmedicationobj.MedicationId = obj.MedicineId;
                newmedicationobj.DrugBrandName = obj.DrugBrandName;
                newmedicationobj.MedicationName = obj.MedicineName;
                newmedicationobj.DrugSchedule = obj.ScheduleType;
                newmedicationobj.DrugStrength = obj.Strength;
                newmedicationobj.DrugGenericName = obj.GenericName;

                newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
                newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
                newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
                newmedicationobj.DrugGenericId = obj.GenericID || "";
                newmedicationobj.Type = "MedicineOrders";
                var medi = 0;
                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                        if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd == 'N') {
                            medi++;
                        }
                    });
                }
                if (medi > 0) {
                    alertify.error('You have already entered this Drug');
                    $scope.medicineGetObj.MedicineObject = "";
                } else {
                    $scope.PrescriptionMainAddObj.PrescriptionDetails.push(newmedicationobj);
                    $scope.medicineGetObj.MedicineObject = "";
                    if (mainitem != '') {
                        mainitem.MedicalPrescriptionDetails.push(newmedicationobj);
                    }
                }

            }
            $scope.getMasterFieldDosageDataInAssesment();
        };


        $scope.SelectSpecializationObj = true;
        $scope.changereferalSpecialization = function (item) {
            item = item || "";

            if (item == 3 || "") {
                $scope.SelectSpecializationObj = true;
            }
            else {
                $scope.SelectSpecializationObj = false;
            }

            $scope.Referralobj.referralDoctorObj = "";
        };

        $scope.SearchInternalDOClist = function (val) {
            $scope.AllDoctorList = angular.copy($scope.allUserList);
            if ($scope.Assesmenttab == 1) {
                if ($scope.SelectSpecializationObj == true) {

                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 43;
                    });
                    $scope.Referralobj.SubSpecializationId = $scope.Referralobj.SubSpecializationId || null;
                    if ($scope.Referralobj.SubSpecializationId == null || $scope.Referralobj.SubSpecializationId == 0) {
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            return item.SpecialityCD != undefined && item.SpecialityCD.SpecializationId == $scope.Referralobj.SpecializationObj;
                        });
                    } else {
                        var DoctorList = [];
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            return item.SpecialityCD != undefined && item.SpecialityCD.SpecializationId == $scope.Referralobj.SpecializationObj;
                        });
                        angular.forEach($scope.AllDoctorList, function (ditem) {
                            ditem.UserSubSpecialization = ditem.UserSubSpecialization || [];
                            if (ditem.UserSubSpecialization.length > 0) {

                                var filtersubspe = $filter("filter")(ditem.UserSubSpecialization, function (item) {
                                    return item.SubSpecializationId === $scope.Referralobj.SubSpecializationId;
                                }) || [];
                                if (filtersubspe.length > 0) {
                                    DoctorList.push(ditem);
                                }
                            }
                        });

                        $scope.AllDoctorList = angular.copy(DoctorList);
                    }

                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, { "FullName": val });
                    return $scope.AllDoctorList.map(function (item) {
                        return item;

                    });

                }
                else {
                    if ($scope.Referralobj.SpecializationObj != 3 && $scope.Referralobj.SpecializationObj != 0 && $scope.Referralobj.SpecializationObj != null) {
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            return item.SpecialityCD != undefined && item.SpecialityCD.SpecializationId == $scope.Referralobj.SpecializationObj;
                        });
                    }
                    else if ($scope.Referralobj.SpecializationObj == 0) {
                        $scope.AllDoctorList = angular.copy($scope.allUserList);
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });
                    } else {
                        $scope.AllDoctorList = [];
                    }

                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, { "FullName": val });
                    return $scope.AllDoctorList.map(function (item) {
                        return item;

                    });

                }

            } else {
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });
                $scope.Referralobj.SubSpecializationId = $scope.Referralobj.SubSpecializationId || null;
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, { "FullName": val });
                return $scope.AllDoctorList.map(function (item) {
                    return item;

                });
            }

        }

        /*Service calls*/

        function getBranchSpecializations(SubOrganizationId, BranchId) {
            $scope.OrgSpecialitiesArray = [];
            if (BranchId === 0) {
                eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                    if (resp.data.row.length > 0) {
                        $scope.OrgSpecialitiesArray = resp.data.row;
                    }
                });
            } else {
                eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                    if (resp.data.row.length > 0) {
                        $scope.OrgSpecialitiesArray = resp.data.row;
                    }

                });
            }

        }
        $scope.getMasterFieldDosageDataInAssesment = function () {
            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {
                console.log(JSON.stringify(resp));
                $scope.doseArray = resp.data.doseArray || [];
                $scope.doseOtherArray = resp.data.doseOtherArray || [];
                $scope.frequencyArray = resp.data.frequencyArray || [];
                $scope.refillsArray = resp.data.refillsArray || [];
                $scope.durationArray = resp.data.durationArray || [];
                $scope.actionArray = resp.data.actionArray || [];
                $scope.routeArray = resp.data.routeArray || [];
                $scope.doseUnitArray = resp.data.doseUnitArray || [];
                $scope.quantityUnitArray = resp.data.quantityUnitArray || [];
            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };
        $scope.getMasterFieldDosageDataInAssesment();
        $scope.GetDiagnosisList = function (val) {
            let object = {
                "LevelType": 'O',
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "IsFrequent": 'N',
                "ParentOrganizationId": $scope.ParenthospitalId || null,
            };

            if (object.SearchText == '') {
                object.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        };
        $scope.GetProblemsFromRcopia = function (val) {
            var searchvalue = val || "";

            if (searchvalue != "") {
                var req = {
                    "VendorName": "Appolo Pharmacy",
                    "VendorPassword": "abc123",
                    "searchText": val || "nexium",
                    "codeType": "ICD10",
                    "UserId": $scope.UserId || null,
                    "OrganizationId": $scope.HospitalId || null,
                    "SearchType": "search_problem",
                    "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                    "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                    "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
                }
                return eHnoteConditionsDataService.getProblemsDataFromRcopia(req).then(function (resp) {
                    console.log(resp);
                    if (resp.data.ProblemList !== undefined) {
                        return resp.data.ProblemList.map(function (item) {
                            return item;
                        });
                    }
                });
            }
        }

        $scope.getSnomedCodesItem = function (val) {
            $scope.SearchText = val || "";


            var params = {
                "HospitalId": $scope.HospitalId,
                "SearchText": $scope.SearchText || '',
                "PageSize": 20,
                "PageNumber": 1,
                "SearchType": $scope.SnomedCodesObj.SearchType || "",
                "SearchConcept": $scope.SnomedCodesObj.SearchConcept || "",
                "SearchDate": $scope.SnomedCodesObj.SearchEnteredDate || "",
                "ParentOrganizationId": $scope.ParenthospitalId || null,
            }
            return eHnoteSettingsDataService.GetSnomedCodes(params).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            item.ConceptId = item.ConceptId || "";
                            return item;
                        });
                    }
                }
            });
        };
        $scope.SaveMedicalRxDetailes = function () {
            console.log($scope.PrescriptionMainAddObj);
            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObj, OnAddSigSuccess, OnAddSigError);
                function OnAddSigSuccess(response) {
                    if (response != '') {
                        $scope.PresciptionResponceObj = response;
                    }
                    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (assitem) {
                        angular.forEach($scope.PresciptionResponceObj.PrescriptionDetails, function (Pitem) {
                            angular.forEach(assitem.MedicalPrescriptionDetails, function (witem) {
                                if (witem.DiagnosisId = Pitem.DiagnosisId) {
                                    witem = Pitem;
                                }
                            })
                        });
                    });
                    console.log(response);
                    $scope.GetPatientPrescriptionDetails();

                }
                function OnAddSigError() {
                    alertify.error("Creating  Failed");
                }
            }

        }
        $scope.GetPatientPrescriptionDetails = function () {
            var ApptId = '';
            ApptId = $scope.AppointmentID || 0;
            var params = {
                "PatientId": $scope.cacheStorageItem.patientid || 0,
                "AppointmentId": ApptId || 0,
                "PageSize": 10,
                "PageNumber": 1,
                "BranchId": $scope.HospitalId || 0
            }
            eHnotePatientDataService.GetPatientPrescriptionDetails(params).then(function (resp) {
                console.log(resp);
                if (resp.data.rows.length > 0) {

                    $scope.cacheStorageItem.PrescriptionDetails = resp.data.rows || [];
                } else {
                    $scope.cacheStorageItem.PrescriptionDetails = [];
                }

                $scope.AssessmentplanpopupObj.PrescriptionDetails = angular.copy($scope.cacheStorageItem.PrescriptionDetails);
                $scope.AssessmentplanpopupObj.AssessmentListArray = angular.copy($scope.AssessmentPlanDeatils);
                $scope.AssessmentplanpopupObj.OrdersInvestigationArray = angular.copy($scope.OrdersInvestigation)
                $scope.AssessmentplanpopupObj.OrdersSurgeryArray = angular.copy($scope.OrdersSurgery)
                $scope.AssessmentplanpopupObj.OrdersProcedureArray = angular.copy($scope.OrdersProcedure)
                $scope.AssessmentplanpopupObj.ReferralDetails = angular.copy($scope.ReferralDetails)

                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {

                    $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.AssessmentplanpopupObj.AssessmentListArray || [];
                    if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                        angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                            angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (sitem) {
                                angular.forEach(sitem.PrescriptionDetails, function (Pitem) {
                                    item.MedicalPrescriptionDetails = item.MedicalPrescriptionDetails || [];
                                    if (Pitem.Type == "MedicineOrders") {
                                        item.MedicalPrescriptionDetails.push(Pitem);
                                    }
                                });
                            });
                        });
                    }
                }

                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                        /*item.MedicalPrescriptionDetails = $filter("filter")(item.MedicalPrescriptionDetails, function (iterator) { return iterator.DiagnosisId !== 0; });*/
                        item.MedicalPrescriptionDetails = _.uniq(item.MedicalPrescriptionDetails, false, function (sitem) { return sitem.MedicationId; });
                        item.IsEditData = false;
                        item.SubTab = '1';

                        if (item.StatusList.length > 0) {
                            angular.forEach(item.StatusList, function (Aitem) {
                                Aitem.OrganId = Aitem.OrganId || '1';
                                Aitem.OrganId = Aitem.OrganId.toString();
                            });
                        }
                        if (item.InvestigationsArray.length > 0) {
                            angular.forEach(item.InvestigationsArray, function (Iitem) {
                                Iitem.DurationDate = Iitem.DurationDate || null;
                                Iitem.DurationDate = $filter('date')(Iitem.DurationDate, 'MM-dd-yyyy');
                                if (Iitem.DurationDate !== null) {
                                    Iitem.ShowDateFormat = true;
                                } else {
                                    Iitem.ShowDateFormat = false;
                                }
                                Iitem.OrganId = Iitem.OrganId || null;
                                if (Iitem.OrganId !== null) {
                                    Iitem.OrganId = Iitem.OrganId.toString();
                                }
                            });
                        }
                        if (item.ProceduresArray.length > 0) {
                            angular.forEach(item.ProceduresArray, function (pitem) {
                                pitem.DurationDate = pitem.DurationDate || null;
                                pitem.DurationDate = $filter('date')(pitem.DurationDate, 'MM-dd-yyyy');
                                if (pitem.DurationDate !== null) {
                                    pitem.ShowDateFormat = true;
                                } else {
                                    pitem.ShowDateFormat = false;
                                }
                                pitem.OrganId = pitem.OrganId || null;
                                if (pitem.OrganId !== null) {
                                    pitem.OrganId = pitem.OrganId.toString();
                                }
                            });
                        }
                        if (item.SurgeryArray.length > 0) {
                            angular.forEach(item.SurgeryArray, function (sitem) {
                                sitem.DurationDate = sitem.DurationDate || null;
                                sitem.DurationDate = $filter('date')(sitem.DurationDate, 'MM-dd-yyyy');
                                if (sitem.DurationDate !== null) {
                                    sitem.ShowDateFormat = true;
                                } else {
                                    sitem.ShowDateFormat = false;
                                }
                                sitem.OrganId = sitem.OrganId || null;
                                if (sitem.OrganId !== null) {
                                    sitem.OrganId = sitem.OrganId.toString();
                                }
                            });
                        }
                        item.ReferralArray = item.ReferralArray || [];
                        if (item.ReferralArray.length > 0) {
                            angular.forEach(item.ReferralArray, function (Ritem) {
                                Ritem.DurationDate = Ritem.DurationDate || null;
                                Ritem.DurationDate = $filter('date')(Ritem.DurationDate, 'MM-dd-yyyy');
                                if (Ritem.DurationDate !== null) {
                                    Ritem.ShowDateFormat = true;
                                } else {
                                    Ritem.ShowDateFormat = false;
                                }
                            });
                        }
                    });
                    $scope.AssessmentplanpopupObj.AssessmentListArray[0].IsEditData = true;
                }

                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    $scope.cacheStorageItem.AssessmentPlan = angular.copy($scope.AssessmentplanpopupObj.AssessmentListArray);
                    $scope.cacheStorageItem.AssessmentPlan = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, function (iterator, ind) { return iterator.DiagnosisId !== 2; });

                    angular.forEach($scope.cacheStorageItem.AssessmentPlan, function (pitem) {
                        pitem.IsSummaryViewInd = false;
                    });
                } else {
                    $scope.cacheStorageItem.AssessmentPlan = [];
                }
                if ($scope.Assesmenttab == 2) {
                    $scope.ReloadOrdertab();
                }
                if ($scope.Assesmenttab == 3) {
                    $scope.ShowSuggestedCodesOnClick();
                }
                if ($scope.Assessmentsavetype != 2) {
                    $uibModalInstance.close($scope.AssessmentplanpopupObj);
                }

            });
        }
        $scope.Assessmentsavetype = 0;
        $scope.SaveAssessmentpopup = function (type) {
            $scope.Assessmentsavetype = type;

            if ($scope.Assesmenttab == 1 || $scope.Assesmenttab == 2) {
                $scope.AssessmentplanpopupObj.MedicalRXAssesmentObj = angular.copy($scope.PrescriptionMainAddObj);
                //if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                //    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (assitem) {
                //        var Mitem = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "IsEditData": true }, true);
                //        if (assitem.ProceduresArray.length > 0) {
                //            angular.forEach(assitem.ProceduresArray, function (pitem) {
                //                if (pitem.DeleteInd == 'N') {

                //                    angular.forEach($scope.AssessmentplanpopupObj.OrdersProcedureArray, function (Opitem) {
                //                        if (pitem.OrgProcedureId == Opitem.OrgDescriptionId) {
                //                            Opitem.OrganId = pitem.OrganId || "";
                //                            Opitem.Remarks = pitem.ProcedureNotes || ""
                //                            Opitem.DurationDate = pitem.DurationDate || null;
                //                            Opitem.StatusId = pitem.StatusId || 0;
                //                            Opitem.ShowDateFormat = pitem.ShowDateFormat || false;
                //                            Opitem.OrganName = pitem.OrganName || "";
                //                        }
                //                    });
                //                } 
                //                   //  else {
                //                //    angular.forEach($scope.AssessmentplanpopupObj.OrdersProcedureArray, function (Opitem) {
                //                //        if (pitem.OrgProcedureId == Opitem.OrgDescriptionId) {
                //                //            Opitem.DeleteInd = 'Y';
                //                //        }
                //                //    });
                //                //}
                //            });
                //        }
                //        if (assitem.InvestigationsArray.length > 0) {
                //            angular.forEach(assitem.InvestigationsArray, function (Iitem) {
                //                if (Iitem.DeleteInd == 'N') {
                //                    angular.forEach($scope.AssessmentplanpopupObj.OrdersInvestigationArray, function (OIitem) {
                //                        if (Iitem.OrgInvestigationId == OIitem.OrgDescriptionId) {
                //                            OIitem.DurationDate = Iitem.DurationDate || null;
                //                            OIitem.StatusId = Iitem.StatusId || 0;
                //                            OIitem.OrganId = Iitem.OrganId || 0;
                //                            OIitem.OrganName = Iitem.OrganName || null;
                //                            OIitem.InvestigationNotes = Iitem.Remarks || "";
                //                            OIitem.ModalityId = Iitem.ModalityId || 1;

                //                        }
                //                    });
                //                }
                //                //else {
                //                //    angular.forEach($scope.AssessmentplanpopupObj.OrdersInvestigationArray, function (OIitem) {
                //                //        if (Iitem.OrgInvestigationId == OIitem.OrgDescriptionId) {
                //                //            OIitem.DeleteInd = 'Y';
                //                //        }
                //                //    });
                //                //}
                //            });
                //        }
                //        if (assitem.SurgeryArray.length > 0) {
                //            angular.forEach(assitem.SurgeryArray, function (suritem) {
                //                suritem.CoordinatorId = suritem.CoordinatorId || null;
                //                suritem.ExternalCoManagerId = suritem.ExternalCoManagerId || null;
                //                suritem.InternalCoManagerId = suritem.InternalCoManagerId || null;

                //                suritem.CoordinatorName = "";
                //                if (suritem.CoordinatorId != null) {
                //                    var filterco = $filter("filter")($scope.AllCoordinatorList, { "DoctorID": suritem.CoordinatorId }, true) || [];
                //                    if (filterco.length > 0) {
                //                        suritem.CoordinatorName = filterco[0].FullName || "";
                //                    }
                //                }
                //                suritem.ExternalCoManagerName = "";
                //                if (suritem.ExternalCoManagerId != null) {
                //                    var filterco = $filter("filter")($scope.AllExternalCoordinatorList, { "DoctorID": suritem.ExternalCoManagerId }, true) || [];
                //                    if (filterco.length > 0) {
                //                        suritem.ExternalCoManagerName = filterco[0].FullName || "";
                //                    }
                //                }
                //                suritem.InternalCoManagerName = "";
                //                if (suritem.InternalCoManagerId != null) {
                //                    var filterco = $filter("filter")($scope.AllInternalCoordinatorList, { "DoctorID": suritem.InternalCoManagerId }, true) || [];
                //                    if (filterco.length > 0) {
                //                        suritem.InternalCoManagerName = filterco[0].FullName || "";
                //                    }
                //                }
                //                if (suritem.DeleteInd == 'N') {

                //                    angular.forEach($scope.AssessmentplanpopupObj.OrdersSurgeryArray, function (ositem) {

                //                        if (ositem.OrgDescriptionId == suritem.OrgSurgeryId) {
                //                            ositem.OrganId = suritem.OrganId || "";
                //                            ositem.OrganName = suritem.OrganName || "";
                //                            ositem.Remarks = suritem.ExternalCoManagerRemarks || '';
                //                            ositem.DurationDate = suritem.DurationDate || '';
                //                            ositem.InternalCoManagerId = suritem.InternalCoManagerId || 0;
                //                            ositem.InternalCoManagerName = suritem.InternalCoManagerName || "";
                //                            ositem.CoordinatorId = suritem.CoordinatorId || 0;
                //                            ositem.CoordinatorName = suritem.CoordinatorName || "";
                //                            ositem.ExternalCoManagerId = suritem.ExternalCoManagerId || 0;
                //                            ositem.ShowDateFormat = suritem.ShowDateFormat || false;
                //                            ositem.StatusId = suritem.StatusId || 0;
                //                            ositem.ExternalCoManagerName = suritem.ExternalCoManagerName || ""
                //                            ositem.ExternalCoManagerId = suritem.ExternalCoManagerId||0
                //                        }
                //                    });
                //                }
                //            });
                //        }
                //        assitem.MedicalPrescriptionDetails = assitem.MedicalPrescriptionDetails || [];
                //        if (assitem.MedicalPrescriptionDetails.length > 0) {
                //            angular.forEach(assitem.MedicalPrescriptionDetails, function (item) {
                //                item.DiagnosisId = assitem.DiagnosisId;
                //                item.ICD10CODE = assitem.ICD10CODE;
                //                item.DiagnosisName = assitem.ICD10DIAGNAME;
                //            });
                //        }
                //        if (assitem.ReferralArray.length > 0) {
                //            angular.forEach(assitem.ReferralArray, function (Ritem) {

                //                if (Ritem.DeleteInd == 'N') {
                //                    var list = $filter("filter")($scope.AssessmentplanpopupObj.ReferralDetails, { "ReferralId": Ritem.ReferralId, 'DeleteInd': 'N' }, true) || [];
                //                    if (list.length == 0) {
                //                        Ritem.DiagnosisList = Ritem.DiagnosisList || [];
                //                        var list = {
                //                            "DiagnosisDetailId": 0,
                //                            "DiagnosisId": Mitem[0].DiagnosisId,
                //                            "DiagnosisName": Mitem[0].ICD10DIAGNAME,
                //                            "ICDCode": Mitem[0].ICD10CODE,
                //                            "ActiveInd": "Y"
                //                        };
                //                        Ritem.DiagnosisList.push(list);
                //                        $scope.AssessmentplanpopupObj.ReferralDetails.push(Ritem);
                //                    }
                //                }

                //            });
                //        }
                //    });
                //}
                /*RestructureToOrder();*/
                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (initem) {
                        angular.forEach(initem.SurgeryArray, function (Sitem) {
                            Sitem.UserId = $scope.UserId;
                        });
                        initem.AppointmentId = initem.AppointmentId || $scope.AppointmentID;
                    });
                }
                if ($scope.AdvisedOrderDetailsArray.length > 0) {
                    $scope.cacheStorageItem.InvestigationsDetails = [];
                    $scope.cacheStorageItem.SurgeriesDetails = [];
                    $scope.cacheStorageItem.ProceduresDetails = [];
                    $scope.cacheStorageItem.ReferralDetails = [];

                    angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {

                        if (item.OrderType == "Investigations") {
                            $scope.cacheStorageItem.InvestigationsDetails.push(item);
                        }

                        if (item.OrderType == "Surgery") {
                            item.UserId = $scope.UserId;
                            $scope.cacheStorageItem.SurgeriesDetails.push(item);
                        }

                        if (item.OrderType == "Procedure") {
                            $scope.cacheStorageItem.ProceduresDetails.push(item);
                        }

                        if (item.OrderType == "Referral") {
                            $scope.cacheStorageItem.ReferralDetails.push(item);
                        }

                        item.DiagnosisList = $filter("filter")(item.DiagnosisList, function (FAitem, index) { return FAitem.Diagnosis == true },);

                    });
                }

                //if ($scope.AssessmentplanpopupObj.OrdersSurgeryArray.length > 0) {
                //    angular.forEach($scope.AssessmentplanpopupObj.OrdersSurgeryArray, function (Sitem) {
                //        Sitem.UserId = $scope.UserId;
                //    });
                //}
                $scope.AddUpdateAssessmentobj = {
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "AppointmentId": $scope.AppointmentID,
                    "ConsultationId": $scope.ConsultationID,
                    "StatusFlag": "D",
                    "IsNKDSelected": $scope.assonj.IsNKDSelected || false,
                    "PatientId": $scope.cacheStorageItem.patientid,
                    "AssessmentplanArray": $scope.AssessmentplanpopupObj.AssessmentListArray,
                    "InvestigationsDetails": $scope.cacheStorageItem.InvestigationsDetails,
                    "SurgeriesDetails": $scope.cacheStorageItem.SurgeriesDetails,
                    "ProceduresDetails": $scope.cacheStorageItem.ProceduresDetails,
                    "ReferralDetails": $scope.cacheStorageItem.ReferralDetails,
                    "IsDiabetesMellitus": $scope.Diabetesobj.IsDiabetesMellitus || false,
                    "PrescriptionMainAddObj": $scope.PrescriptionMainAddObj
                }
            }

            
            if ($scope.Assesmenttab == 1 || $scope.Assesmenttab == 2) {
                eHnoteSettingsDataService.AddUpdateAppointmentAssessmentplanDetails($scope.AddUpdateAssessmentobj).then(function (resp) {

                    $scope.AssessmentPlanDeatils = [];
                    if (resp.data.data.Status === 'Success') {

                        $scope.AssessmentPlanDeatils = resp.data.data.AssessmentPlanArray;

                        $scope.OrdersInvestigation = resp.data.data.InvestigationsDetails;
                        $scope.OrdersSurgery = resp.data.data.SurgeriesDetails;
                        $scope.OrdersProcedure = resp.data.data.ProceduresDetails;
                        $scope.ReferralDetails = resp.data.data.ReferralDetails;
                        $scope.AssessmentplanpopupObj.IsNKDSelected = resp.data.data.IsNKDSelected || false;
                        $scope.AssessmentplanpopupObj.IsDiabetesMellitus = resp.data.data.IsDiabetesMellitus || false;
                        if ($scope.AssessmentPlanDeatils.length > 0) {
                            angular.forEach($scope.AssessmentPlanDeatils, function (initem) {
                                $scope.AssessmentplanpopupObj.ConsultationId = initem.ConsultationId;
                            });
                        }
                        /*   if ($scope.Assesmenttab == 2) {*/
                        $scope.cacheStorageItem.InvestigationsDetails = resp.data.data.InvestigationsDetails || [];
                        $scope.cacheStorageItem.SurgeriesDetails = resp.data.data.SurgeriesDetails || [];
                        $scope.cacheStorageItem.ProceduresDetails = resp.data.data.ProceduresDetails || [];
                        $scope.cacheStorageItem.ReferralDetails = resp.data.data.ReferralDetails || [];
                        /*  }*/
                        if ($scope.AssessmentPlanDeatils.length > 0) {
                            $scope.cacheStorageItem.AssessmentPlan = angular.copy($scope.AssessmentPlanDeatils) || [];
                            $scope.AssessmentplanpopupObj.AssessmentListArray = angular.copy($scope.AssessmentPlanDeatils);
                        }
                        //if ($scope.OrdersInvestigation.length > 0) {
                        //    $scope.AssessmentplanpopupObj.OrdersInvestigationArray = angular.copy($scope.OrdersInvestigation);
                        //}
                        //if ($scope.OrdersSurgery.length > 0) {
                        //    $scope.AssessmentplanpopupObj.OrdersSurgeryArray = angular.copy($scope.OrdersSurgery);
                        //}
                        //if ($scope.OrdersProcedure.length > 0) {
                        //    $scope.AssessmentplanpopupObj.OrdersProcedureArray = angular.copy($scope.OrdersProcedure);
                        //}
                        //if ($scope.ReferralDetails.length > 0) {
                        //    $scope.AssessmentplanpopupObj.ReferralDetails = angular.copy($scope.ReferralDetails);
                        //}
                        $scope.AdvisedOrderDetailsArray = [];

                        if ($scope.cacheStorageItem.InvestigationsDetails.length !== 0) {
                            angular.forEach($scope.cacheStorageItem.InvestigationsDetails, function (item) {
                                item.OrderType = "Investigations"
                                item.AdvicedInvestigationId = item.PatientInvestigationId || 0;
                                item.DurationDate = item.DurationDate || null;
                                item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                                if (item.DurationDate !== null) {
                                    item.ShowDateFormat = true;
                                } else {
                                    item.ShowDateFormat = false;
                                }
                                if (item.DiagnosisList.length > 0) {
                                    angular.forEach(item.DiagnosisList, function (Ditem) {
                                        Ditem.Diagnosis = true;
                                    });
                                }
                                item.OrganId = item.OrganId || '1';
                                item.OrganId = item.OrganId.toString();
                                $scope.AdvisedOrderDetailsArray.push(item);
                            });
                        }
                        if ($scope.cacheStorageItem.SurgeriesDetails.length !== 0) {
                            angular.forEach($scope.cacheStorageItem.SurgeriesDetails, function (item) {
                                item.OrderType = "Surgery"
                                item.DurationDate = item.DurationDate || null;
                                item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                                if (item.DurationDate !== null) {
                                    item.ShowDateFormat = true;
                                } else {
                                    item.ShowDateFormat = false;
                                }
                                if (item.DiagnosisList.length > 0) {
                                    angular.forEach(item.DiagnosisList, function (Ditem) {
                                        Ditem.Diagnosis = true;
                                    });
                                }
                                item.OrganId = item.OrganId || '1';
                                item.OrganId = item.OrganId.toString();
                                $scope.AdvisedOrderDetailsArray.push(item);
                            });
                        }
                        if ($scope.cacheStorageItem.ProceduresDetails.length !== 0) {
                            angular.forEach($scope.cacheStorageItem.ProceduresDetails, function (item) {
                                item.OrderType = "Procedure"
                                item.DurationDate = item.DurationDate || null;
                                item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                                if (item.DurationDate !== null) {
                                    item.ShowDateFormat = true;
                                } else {
                                    item.ShowDateFormat = false;
                                }
                                if (item.DiagnosisList.length > 0) {
                                    angular.forEach(item.DiagnosisList, function (Ditem) {
                                        Ditem.Diagnosis = true;
                                    });
                                }
                                item.OrganId = item.OrganId || '1';
                                item.OrganId = item.OrganId.toString();
                                $scope.AdvisedOrderDetailsArray.push(item);
                            });
                        }

                        if ($scope.cacheStorageItem.ReferralDetails.length !== 0) {
                            angular.forEach($scope.cacheStorageItem.ReferralDetails, function (item) {
                                item.OrderType = "Referral";
                                item.OrderTypeId = 4;
                                item.Description = item.Referral || '';
                                item.DurationDate = item.DurationDate || null;
                                item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                                if (item.DurationDate !== null) {
                                    item.ShowDateFormat = true;
                                } else {
                                    item.ShowDateFormat = false;
                                }
                                if (item.DiagnosisList.length > 0) {
                                    angular.forEach(item.DiagnosisList, function (Ditem) {
                                        Ditem.Diagnosis = true;
                                    });
                                }
                                $scope.AdvisedOrderDetailsArray.push(item);
                            });
                        }




                        /* $uibModalInstance.close($scope.AssessmentplanpopupObj);*/
                        if ($scope.Assesmenttab != 2) {
                            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                                /* $scope.SaveMedicalRxDetailes();*/
                                $scope.GetPatientPrescriptionDetails();
                            }

                        } else if ($scope.Assesmenttab == 2 && type == 1) {
                            $uibModalInstance.close($scope.AssessmentplanpopupObj);
                        } else if ($scope.Assesmenttab == 2) {
                            $scope.AddDiagnosisAssesmentPlanArray = [];
                            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                                    item.IsEditData = false;
                                });
                                $scope.AdvisedOrderDetailsArray[0].IsEditData = true
                            }
                            $scope.AddDiagnosisAssesmentPlanArray = $scope.cacheStorageItem.AssessmentPlan || [];
                            if ($scope.AddDiagnosisAssesmentPlanArray.length > 0) {
                                angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (item) {
                                    item.IsCheckedDiagnosis = false;
                                });

                                if ($scope.AdvisedOrderDetailsArray.length > 0) {
                                    if ($scope.AdvisedOrderDetailsArray[0].DiagnosisList.length > 0) {
                                        angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (Aitem) {
                                            angular.forEach($scope.AdvisedOrderDetailsArray[0].DiagnosisList, function (Bitem) {
                                                if (Aitem.DiagnosisId == Bitem.DiagnosisId) {
                                                    Aitem.IsCheckedDiagnosis = true;
                                                }

                                            });
                                        });
                                    }
                                }
                            }
                            // $scope.GetPatientPrescriptionDetails();
                        } else if ($scope.Assesmenttab == 3) {
                            $scope.ShowSuggestedCodesOnClick();
                        }


                        alertify.success("Diagnosis Added Successfully");
                    } else {
                        alertify.error(resp.data.Message);
                    }
                })

            }





        };
        $scope.GetOrganizationCPTProcedure = function (val) {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": val || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "IsFrequent": "N",
                "Status": 0
            };
            if (val == "") {
                obj.IsFrequent = "Y"
            }
            return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.rows.length !== 0) {
                        if (response.data.rows.length > 0) {
                            angular.forEach(response.data.rows, function (item) {
                                if (item.CPTCode == "") {
                                    if (item.LoincCode != '') {
                                        item.CPTCode = item.LoincCode;
                                    }
                                }
                            });
                        }

                        return response.data.rows.map(function (item) {
                            return item;
                        });

                    }
                }
            });
        };
        $scope.GetReferralMasterData = function (val) {
            var obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "UserId": $scope.UserId,
                "SearchText": val || null,
                "PageNumber": 1,
                "PageSize": 20,
            };
            return eHnoteSettingsDataService.GetReferralMasterData(obj).then(function (response) {
                if (response.data.Referral.length !== 0) {
                    return response.data.Referral.map(function (item) {
                        return item;
                    });

                }
            });
        };
        $scope.GetDrugDataListFromRcopia = function (val) {
            var searchvalue = val || "";
            if (searchvalue != "") {
                var req = {
                    "VendorName": "Appolo Pharmacy",
                    "VendorPassword": "abc123",
                    "searchText": searchvalue,
                    "Maximum": 20,
                    "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                    "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                    "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
                }
                return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                    if (resp.data.DrugDetailsList !== undefined) {
                        return resp.data.DrugDetailsList.map(function (item) {
                            return item;
                        });
                    }
                });
            }
        }

        $scope.getOrgMedicines = function (text) {
            text = text || "";
            $scope.showhideprecesDiv = false;
            var object = {
                "LevelType": "G",
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": text,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": 'C',
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (text === "") {
                object.Type = 'C';
            }
            return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.MedicineList !== undefined) {
                        $scope.showhideprecesDiv = false;
                        if (text === "") {
                            var obj = {
                                "MedicineId": "",
                                "MedicineNameWithStock": "Frequently Added"
                            };
                            response.data.MedicineList.unshift(obj);
                        }
                        return response.data.MedicineList.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.showhideprecesDiv = true;
                    }
                } else {
                    $scope.showhideprecesDiv = false;
                    if (text != '') {
                        $scope.showhideprecesDiv = true;
                    }
                }
            });
        };
        /*Service End calls*/

        var params = {
            "UserId": $scope.UserId,
            "SearchText": "",
            "PageSize": 1000,
            "PageNumber": 1,
            "OrganizationId": $scope.HospitalId,
            "IsFavoriteInd": 0
        }
        var reqObj = {
            'LocationId': null,
            'PageNumber': 1,
            'PageSize': 1000,
            'SearchTaxt': "",
            "SpecializationId": $scope.SpecializationId || null,
            "DeleteInd": 'N',
            "OrganizationId": $scope.HospitalId || 0

        };
        var LocationListparams = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 10
        };
        $scope.init = function () {

            $scope.AllExternalCoordinatorList = [];
            $scope.LocationList = [];
            $scope.SuffixList = [];
            $q.all([
                eHnoteSettingsDataService.GetConsultationDetailsByPatientId(objasses.PatientId),
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                eHnotePatientDataService.GetUserConsultationTemplateDetails(params),
                eHnoteReferalDataService.GetReferalPCPDoctors(reqObj),
                eHnoteSettingsDataService.GetOrganizationBillingProviders(LocationListparams),
                eHnoteDbStaticDataService.getMasterUserSuffixList(),
            ]).then(function (resp) {
                if (resp[0].data[0].Status === "Success") {

                    $scope.PatientAssessmentplanList = angular.copy(resp[0].data[0].AssessmentPlan);
                    if ($scope.AssessmentplanpopupObj.AssessmentListArray.length == 0) {
                        $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.PatientAssessmentplanList;
                        if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                            angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                                item.IsEditData = false;
                                item.SubTab = '1';
                                if (item.Type == 'Optha') {
                                    item.StatusList = [];
                                    let obj1 = {
                                        "OrganStatusId": null,
                                        "OrganId": "1",
                                        "SeverityId": null,
                                        "Verificationstatusid": null,
                                        "DiagnosisStatus": '',
                                        "DiagnosisStatusId": 6,
                                        "EndDate": null,
                                        "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null,
                                        "DeleteInd": 'N',

                                    }
                                    item.StatusList.push(obj1);
                                    let obj = {
                                        "OrganStatusId": null,
                                        "OrganId": "2",
                                        "SeverityId": null,
                                        "Verificationstatusid": null,
                                        "DiagnosisStatus": '',
                                        "DiagnosisStatusId": 6,
                                        "EndDate": null,
                                        "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null,
                                        "DeleteInd": 'N',

                                    }
                                    item.StatusList.push(obj);
                                }
                                if (item.Type == 'General') {
                                    item.StatusList = [];
                                    let obj = {
                                        "OrganStatusId": null,
                                        "OrganId": "4",
                                        "SeverityId": null,
                                        "Verificationstatusid": null,
                                        "DiagnosisStatus": '',
                                        "DiagnosisStatusId": 6,
                                        "EndDate": null,
                                        "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null,
                                        "DeleteInd": 'N',

                                    }
                                    item.StatusList.push(obj);
                                    item.IsGeneral = true;
                                }
                                item.MedicalPrescriptionDetails = item.MedicalPrescriptionDetails || [];
                                item.ProceduresArray = item.ProceduresArray || [];
                                item.PrescriptionArray = item.PrescriptionArray || [];
                                item.SurgeryArray = item.SurgeryArray || [];
                                item.ReferralArray = item.ReferralArray || [];
                                item.InvestigationsArray = item.InvestigationsArray || [];



                            });
                            $scope.AssessmentplanpopupObj.AssessmentListArray[0].IsEditData = true;
                        }
                    }
                }
                if (resp[1].data.status === "Success") {

                    $scope.AssesmentPlanStatusList = resp[1].data.AssesmentPlanStatus || [];
                    $scope.CareEpisodeList = resp[1].data.CareEpisode || [];
                    $scope.GetSeverityList = resp[1].data.CheifComplaintSeverity || [];
                    $scope.GetPriorityList = resp[1].data.AssesmentPriority || [];
                }
                if (resp[2].data.Status === "Success") {

                    $scope.DiagnosisTemplatesArray = resp[2].data.AssessmentsPlanArray || [];
                    $scope.ActionsTakenlist = resp[2].data.ConsultationActionsTaken || [];
                    $scope.DoctorNoteslist = resp[2].data.DoctorNotes || [];
                    $scope.PatientInstructionslist = resp[2].data.PatientInstructions || [];
                    $scope.AssessmentsNoteslist = resp[2].data.AssessmentsNotesTemplates || [];
                    $scope.PlanofDiscussionTemplateslist = resp[2].data.DiscussionTemplates || [];
                    $scope.MultipleAssessmentsPlanArray = resp[2].data.MultipleAssessmentsPlanArray || [];
                    $scope.DiagnosisTemplatesArray = $scope.DiagnosisTemplatesArray.concat($scope.MultipleAssessmentsPlanArray);
                    if ($scope.DiagnosisTemplatesArray.length > 0) {
                        angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
                            mitem.IsEdit = false;
                            //item.IsDescriptionEdit = false;
                        });
                    }
                    $scope.DiagnosisTemplatesArray[0].IsEdit = true;
                }
                if (resp[3].data.PcpRefdetails.length > 0) {
                    $scope.AllExternalCoordinatorList = resp[3].data.PcpRefdetails || [];
                }
                if (resp[4].data.Status == "Success") {
                    if (resp[4].data.rows.length > 0) {
                        $scope.LocationList = resp[4].data.rows || [];
                    } else {
                        alertify.error(resp[4].data.Message);
                    }
                }
                if (resp[5].data != undefined) {
                    $scope.SuffixList = resp.data || [];
                }

            });

            $scope.AllInternalCoordinatorList = [];
            $scope.AllCoordinatorList = [];
            $scope.AllInternalCoordinatorList = angular.copy($scope.allUserList) || [];
            $scope.AllInternalCoordinatorList = _.uniq($scope.AllInternalCoordinatorList, false, function (p) { return p.DoctorID; });
            $scope.AllInternalCoordinatorList = $filter("filter")($scope.AllInternalCoordinatorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            });
            $scope.AllCoordinatorList = angular.copy($scope.allUserList) || [];
            $scope.AllCoordinatorList = _.uniq($scope.AllCoordinatorList, false, function (p) { return p.DoctorID; });
            $scope.AllCoordinatorList = $filter("filter")($scope.AllCoordinatorList, function (item) {
                return item.RoleId === 18;
            });

            if ($scope.cacheStorageItem.GeneralAssessmentPlan.length > 0) {
                angular.forEach($scope.cacheStorageItem.GeneralAssessmentPlan, function (Gitem) {
                    var List = 0;
                    List = $filter("filter")($scope.cacheStorageItem.AssessmentPlan, function (FAitem, index) { return FAitem.ConsultationDiagnosisId == Gitem.ConsultationDiagnosisId },);
                    if (List == 0) {
                        $scope.cacheStorageItem.AssessmentPlan.push(Gitem);
                    }
                });
            }
            if ($scope.cacheStorageItem.AssessmentPlan.length > 0) {
                angular.forEach($scope.cacheStorageItem.AssessmentPlan, function (item) {
                    if (item.StatusList.length > 0) {
                        angular.forEach(item.StatusList, function (sitem) {
                            sitem.StartDate = $filter('date')(sitem.StartDate, 'MM-dd-yyyy');
                            sitem.EndDate = $filter('date')(sitem.EndDate, 'MM-dd-yyyy');
                            sitem.FocusStartDateDate = false;
                            sitem.FocusEndDateDate = false;
                        });
                    }
                });
            }

            $scope.AssessmentplanpopupObj = {
                "AssessmentListArray": $scope.cacheStorageItem.AssessmentPlan || [],
                "OrdersArray": [],
                "ReferralDetails": $scope.cacheStorageItem.ReferralDetails || [],
                "AssessmentsFocus": false,
                "IsNKDSelected": false,
                "TargetIOPODValue": "",
                "TargetIOPOSValue": "",
                "OrdersInvestigationArray": $scope.cacheStorageItem.InvestigationsDetails || [],
                "OrdersSurgeryArray": $scope.cacheStorageItem.SurgeriesDetails || [],
                "OrdersProcedureArray": $scope.cacheStorageItem.ProceduresDetails || [],
                "IsDiabetesMellitus": false,
                "cacheStorageItem": $scope.cacheStorageItem || [],
            };
            $scope.AssessmentplanpopupObj.TargetIOPODValue = $scope.cacheStorageItem.TargetIOPODValue;
            $scope.AssessmentplanpopupObj.TargetIOPOSValue = $scope.cacheStorageItem.TargetIOPOSValue;
            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                    item.IsEditData = false;
                    item.SubTab = '1';
                    if (item.StatusList.length > 0) {
                        angular.forEach(item.StatusList, function (Aitem) {
                            Aitem.OrganId = Aitem.OrganId || '1';
                            Aitem.OrganId = Aitem.OrganId.toString();
                        });
                    }

                    if (item.InvestigationsArray.length > 0) {
                        angular.forEach(item.InvestigationsArray, function (Iitem) {
                            Iitem.DurationDate = Iitem.DurationDate || null;
                            Iitem.DurationDate = $filter('date')(Iitem.DurationDate, 'MM-dd-yyyy');
                            if (Iitem.DurationDate !== null) {
                                Iitem.ShowDateFormat = true;
                            } else {
                                Iitem.ShowDateFormat = false;
                            }
                            Iitem.OrganId = Iitem.OrganId || null;
                            if (Iitem.OrganId !== null) {
                                Iitem.OrganId = Iitem.OrganId.toString();
                            }
                        });
                    }
                    if (item.ProceduresArray.length > 0) {
                        angular.forEach(item.ProceduresArray, function (pitem) {
                            pitem.DurationDate = pitem.DurationDate || null;
                            pitem.DurationDate = $filter('date')(pitem.DurationDate, 'MM-dd-yyyy');
                            if (pitem.DurationDate !== null) {
                                pitem.ShowDateFormat = true;
                            } else {
                                pitem.ShowDateFormat = false;
                            }
                            pitem.OrganId = pitem.OrganId || null;
                            if (pitem.OrganId !== null) {
                                pitem.OrganId = pitem.OrganId.toString();
                            }
                        });
                    }
                    if (item.SurgeryArray.length > 0) {
                        angular.forEach(item.SurgeryArray, function (sitem) {
                            sitem.DurationDate = sitem.DurationDate || null;
                            sitem.DurationDate = $filter('date')(sitem.DurationDate, 'MM-dd-yyyy');
                            if (sitem.DurationDate !== null) {
                                sitem.ShowDateFormat = true;
                            } else {
                                sitem.ShowDateFormat = false;
                            }
                            sitem.OrganId = sitem.OrganId || null;
                            if (sitem.OrganId !== null) {
                                sitem.OrganId = sitem.OrganId.toString();
                            }
                        });
                    }
                    item.ReferralArray = item.ReferralArray || [];
                    if (item.ReferralArray.length > 0) {
                        angular.forEach(item.ReferralArray, function (Ritem) {
                            Ritem.DurationDate = Ritem.DurationDate || null;
                            Ritem.DurationDate = $filter('date')(Ritem.DurationDate, 'MM-dd-yyyy');
                            if (Ritem.DurationDate !== null) {
                                Ritem.ShowDateFormat = true;
                            } else {
                                Ritem.ShowDateFormat = false;
                            }
                        });
                    }
                });
                $scope.AssessmentplanpopupObj.AssessmentListArray[0].IsEditData = true;
            }

        }


        $scope.init();


        $scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
        if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {

            $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.AssessmentplanpopupObj.AssessmentListArray || [];
            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                    angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (sitem) {
                        angular.forEach(sitem.PrescriptionDetails, function (Pitem) {
                            item.MedicalPrescriptionDetails = item.MedicalPrescriptionDetails || [];
                            if (Pitem.Type == "MedicineOrders") {
                                item.MedicalPrescriptionDetails.push(Pitem);
                            }
                        });
                    });
                });
            }
        }
        if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
            angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                /*item.MedicalPrescriptionDetails = $filter("filter")(item.MedicalPrescriptionDetails, function (iterator) { return iterator.DiagnosisId !== 0; });*/
                item.MedicalPrescriptionDetails = _.uniq(item.MedicalPrescriptionDetails, false, function (sitem) { return sitem.MedicationId; });

            });
        }


        $scope.onSelectAssesmentPlannewDiagnosis = function (mainobject, type) {
            //if (Array.isArray(type)) {
            //    if (Diagnosisitem.DiagnosisList.length > 0) {
            //        var filterdiagnosis = $filter("filter")(Diagnosisitem.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
            //        if (filterdiagnosis.length > 0) {
            //            mainobject = "";
            //            $scope.adviseObj.DiagnosisObject = "";
            //            alertify.error("Diagnosis Already Added");
            //            return false;
            //        }
            //    }



            //    var obj = {
            //        "ActiveInd": "Y",
            //        "DiagnosisDetailId": mainobject.DiagnosisId || 0,
            //        "DiagnosisId": mainobject.DiagnosisId,
            //        "DiagnosisName": mainobject.DiagnosisName,
            //        "ICDCode": mainobject.ICD10CODE,
            //        "Diagnosis": true
            //    }

            //    Diagnosisitem.DiagnosisList.push(obj);
            //    $scope.adviseObj.DiagnosisObject = "";
            //    console.log('type is an array!');
            //}
            //else {
            if (type == 'ehnote') {
                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    var filterdiagnosis = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "DiagnosisId": mainobject.DiagnosisObject.DiagnosisId, "DeleteInd": "N" }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.newAssessmentObj.DiagnosisObject = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }
                $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.AssessmentplanpopupObj.AssessmentListArray || [];
                $scope.newAssessmentObj.DiagnosisId = mainobject.DiagnosisObject.DiagnosisId;
                $scope.newAssessmentObj.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;


                $scope.newAssessmentObj.ICD10CODE = mainobject.DiagnosisObject.ICD10CODE;
                $scope.newAssessmentObj.ICD10DIAGNAME = mainobject.DiagnosisObject.DiagnosisName;
                $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.FullName;
                $scope.newAssessmentObj.DiagnosisName = mainobject.DiagnosisObject.DiagnosisName;
                $scope.newAssessmentObj.DiagnosisDescription = mainobject.DiagnosisObject.FullName;
                $scope.newAssessmentObj.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;

                $scope.newAssessmentObj.CodeSystem = "ICD";
                /*mainobject.IsGeneral = false;*/
            }

            if (type == 'rcopia') {




                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    var filterdiagnosis = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "ICD10CODE": mainobject.DiagnosisObject.ICD10Code, "DeleteInd": "N" }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.newAssessmentObj.DiagnosisObject = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }

                $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.AssessmentplanpopupObj.AssessmentListArray || [];




                $scope.newAssessmentObj.ICD10CODE = mainobject.DiagnosisObject.ICD10Code;
                $scope.newAssessmentObj.ICD10DIAGNAME = mainobject.DiagnosisObject.ICD10Description;
                $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.ICD10Description;
                $scope.newAssessmentObj.DiagnosisName = mainobject.DiagnosisObject.ICD10Description;
                $scope.newAssessmentObj.DiagnosisDescription = mainobject.DiagnosisObject.ICD10Description;
                $scope.newAssessmentObj.SnomedCode = mainobject.DiagnosisObject.SNOMEDConceptID;
                $scope.newAssessmentObj.SnomedCodeDescription = mainobject.DiagnosisObject.SNOMEDDescription;
                $scope.newAssessmentObj.CodeSystem = "ICD";


                var req = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "ICD10CODE": $scope.newAssessmentObj.ICD10CODE || "",
                    "ICD10Description": mainobject.DiagnosisObject.ICD10Description || "",
                    "SNOMEDConceptId": $scope.newAssessmentObj.SnomedCode || "",
                    "SNOMEDDescription": $scope.newAssessmentObj.SnomedCodeDescription || "",
                    "DiagnosisId": $scope.newAssessmentObj.DiagnosisId || 0,
                    "OrgDiagnosisId": $scope.newAssessmentObj.OrganizationDiagnosisId || 0
                }
                eHnoteSettingsDataService.UpdateDiagnosisFromRcopia(req).then(function (response) {
                    console.log(JSON.stringify(response));
                    if (response.data.status === 'Success') {
                        mainobject.DiagnosisId = response.data.DiagnosisId;
                        mainobject.OrganizationDiagnosisId = response.data.OrgDiagnosisId;
                    }

                });

                /*mainobject.IsGeneral = false;*/
            }
            if (type == 'Snomed') {
                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                    var filterdiagnosis = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "SnomedCodeId": mainobject.DiagnosisObject.SnomedCodeId, "DeleteInd": "N" }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.newAssessmentObj.DiagnosisObject = "";
                        alertify.error("Snomed Already Added");
                        return false;
                    }
                }

                $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.AssessmentplanpopupObj.AssessmentListArray || [];
                $scope.newAssessmentObj.SnomedCodeId = mainobject.DiagnosisObject.SnomedCodeId;
                $scope.newAssessmentObj.OrganizationDiagnosisId = mainobject.DiagnosisObject.OrganizationDiagnosisId;

                $scope.newAssessmentObj.ICD10CODE = mainobject.DiagnosisObject.ConceptId;
                $scope.newAssessmentObj.ICD10DIAGNAME = mainobject.DiagnosisObject.Description;
                $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisObject.Description;
                $scope.newAssessmentObj.CodeSystem = "Snomed-CT";
                /*mainobject.IsGeneral = false;*/

            }

            $scope.newAssessmentObj.IsEditData = true;

            if ($scope.newAssessmentObj.StatusList.length > 0) {
                angular.forEach($scope.newAssessmentObj.StatusList, function (item) {
                    item.StartDate = $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null;
                    item.EndDate = null;
                });
            }

            $scope.newAssessmentObj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");


            if ($scope.newAssessmentObj.PlanOfcareNotesArray.length > 0) {
                $scope.newAssessmentObj.PlanOfCareAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
            } else {
                $scope.newAssessmentObj.PlanOfCareAddedTime = "";
            }

            if ($scope.newAssessmentObj.ProceduresArray.length > 0) {
                $scope.newAssessmentObj.ProceduresAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
            } else {
                $scope.newAssessmentObj.ProceduresAddedTime = "";
            }
            if ($scope.newAssessmentObj.PrescriptionArray.length > 0) {
                $scope.newAssessmentObj.PrescriptionAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
            } else {
                $scope.newAssessmentObj.PrescriptionAddedTime = "";
            }
            if ($scope.newAssessmentObj.SurgeryArray.length > 0) {
                $scope.newAssessmentObj.SurgeryAddedTime = $filter('date')(new Date(), "dd-MMM-yyyy h:mm a");
            } else {
                $scope.newAssessmentObj.SurgeryAddedTime = "";
            }


            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length !== 0) {
                angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                    item.IsEditData = false;
                    item.IsCheckedDiagnosis = false;
                });
            }
            mainobject.IsCheckedDiagnosis = true;

            if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                angular.forEach($scope.cacheStorageItem.PrescriptionDetails, function (sitem) {
                    angular.forEach(sitem.PrescriptionDetails, function (Pitem) {
                        mainobject.MedicalPrescriptionDetails = mainobject.MedicalPrescriptionDetails || [];
                        if (Pitem.Type == "MedicineOrders") {
                            mainobject.MedicalPrescriptionDetails.push(Pitem);
                        }
                    });
                });
            }
            $scope.AssessmentplanpopupObj.AssessmentListArray.push(mainobject);

            if ($scope.AssessmentplanpopupObj.AssessmentListArray.length > 0) {
                $scope.assonj.IsNKDSelected = false;
            }

            $scope.newAssessmentObj = angular.copy($scope.GetAssessmentObj());
            /* }*/

        };

        $scope.AssesmentPlantemplatePopUp = function (TemplateType) {
            $scope.SelectedTemplateType = TemplateType;
            angular.forEach($scope.DiagnosisTemplatesArray, function (Ditem) {
                Ditem.SelectedDiagnosisTemplateCheck = false;
            });
            //angular.forEach($scope.MultipleAssessmentsPlanArray, function (Mitem) {
            //    Mitem.SelectedMultipleDiagnosisTemplateCheck = false;
            //});
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/AssessmentPlanTemplatePopUp.html",
                "keyboard": false,
                "backdrop": "static",
                "scope": $scope,
                "resolve": {},

                "windowClass": "templateschiefcomplaints overflow-hidden",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.ChangesForDiagnosisTemp = function (item) {
            item = item || null;
            if (item.SelectedDiagnosisTemplateCheck && item !== null) {
                item.DiagnosisArray = item.DiagnosisArray || [];
                if (item.DiagnosisArray.length == 0) {
                    return false;
                }
                if (item.DiagnosisArray.length > 0) {
                    var mainobject = item.DiagnosisArray[0];
                }

                var i = 0;
                $scope.AssessmentplanpopupObj.AssessmentListArray = $scope.AssessmentplanpopupObj.AssessmentListArray || [];
                var filterdiagnosis = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "DiagnosisId": mainobject.DiagnosisId, "DeleteInd": "N" }, true);
                if (filterdiagnosis.length > 0) {
                    $scope.newAssessmentObj.DiagnosisObject = "";
                    i++;
                }
                if ($scope.AssessmentplanpopupObj.AssessmentListArray.length !== 0) {
                    angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                        item.IsEditData = false;
                    });
                }

                angular.forEach(mainobject.ProceduresArray, function (pitem) {
                    pitem.OrganId = '';
                    pitem.ShowDateFormat = true;
                    pitem.DurationDate = null;
                    pitem.Duration = 0;
                    pitem.DurationType = '';
                    pitem.ProcedureNotes = '';
                    pitem.StatusId = 1;
                    pitem.Status = 'Active';
                });
                angular.forEach(mainobject.InvestigationsArray, function (Iitem) {
                    Iitem.OrganId = '';
                    Iitem.ShowDateFormat = true;
                    Iitem.DurationDate = null;
                    Iitem.Duration = 0;
                    Iitem.DurationType = '';
                    Iitem.InvestigationNotes = '';
                    Iitem.StatusId = 1;
                    Iitem.Status = 'Active';
                });
                angular.forEach(mainobject.SurgeriesArray, function (sitem) {
                    sitem.OrganId = '';
                    sitem.ShowDateFormat = true;
                    sitem.DurationDate = null;
                    sitem.Duration = 0;
                    sitem.DurationType = '';
                    sitem.ProcedureNotes = '';
                    sitem.CoordinatorId = null;
                    sitem.CoordinatorName = '';
                    sitem.InternalCoManagerId = null;
                    sitem.InternalCoManagerName = '';
                    sitem.ExternalCoManagerId = null;
                    sitem.ExternalCoManagerName = '';
                    sitem.ExternalCoManagerRemarks = '';
                    sitem.StatusId = 1;
                    sitem.Status = 'Active';
                });
                angular.forEach(mainobject.ReferralArray, function (pitem) {
                    pitem.ReferralReason = '';
                    pitem.ShowDateFormat = true;
                    pitem.DurationDate = null;
                    pitem.Duration = 0;
                    pitem.DurationType = '';
                    pitem.IsUrgency = false;
                    pitem.IsFollowUpAfterReferral = false;
                    pitem.ReferralDoctorId = 0;
                    pitem.ReferralDoctorName = '';
                });

                if (i == 0) {
                    $scope.newAssessmentObj.DiagnosisId = mainobject.DiagnosisId;
                    $scope.newAssessmentObj.ICD10CODE = mainobject.ICD10CODE;
                    $scope.newAssessmentObj.RcopiaProblemId = mainobject.RcopiaProblemId || "";
                    $scope.newAssessmentObj.ICD10DIAGNAME = mainobject.DiagnosisName;
                    $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = mainobject.DiagnosisName || "";
                    $scope.newAssessmentObj.DiagnosisName = mainobject.DiagnosisName;

                    $scope.newAssessmentObj.PlanofDiscussionsNotes = mainobject.PlanofDiscussionsNotes || '';
                    $scope.newAssessmentObj.PatientInstructions = mainobject.PatientInstructions || '';
                    $scope.newAssessmentObj.AssessmentsNotes = mainobject.AssessmentPlan.AssessmentsNotes || '';
                    $scope.newAssessmentObj.ActionsTaken = mainobject.ActionsTaken || '';
                    $scope.newAssessmentObj.DoctorNotes = mainobject.DoctorNotes || '';
                    $scope.newAssessmentObj.DiagnosisStatus = mainobject.DiagnosisStatus || '';
                    $scope.newAssessmentObj.PriorityId = mainobject.PriorityId || '';
                    $scope.newAssessmentObj.SnomedCode = mainobject.SnomedCode || '';
                    $scope.newAssessmentObj.SnomedCodeId = mainobject.SnomedCodeId || '';
                    $scope.newAssessmentObj.SnomedCodeObject = mainobject.SnomedCode || '';
                    $scope.newAssessmentObj.ProceduresArray = mainobject.ProceduresArray || [];
                    $scope.newAssessmentObj.InvestigationsArray = mainobject.InvestigationsArray || [];
                    $scope.newAssessmentObj.SurgeryArray = mainobject.SurgeriesArray || [];
                    $scope.newAssessmentObj.ReferralArray = mainobject.ReferralArray || [];
                    $scope.newAssessmentObj.IsEditData = true;
                    $scope.newAssessmentObj.SubTab = '1';

                    $scope.newAssessmentObj.StatusList = [];
                    $scope.newAssessmentObj.StatusList = [
                        {
                            "OrganStatusId": null,
                            "OrganId": "1",
                            "SeverityId": null,
                            "Verificationstatusid": null,
                            "DiagnosisStatus": 'Not Examined',
                            "DiagnosisStatusId": 6,
                            "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "DeleteInd": 'N',

                        },
                        {
                            "OrganStatusId": null,
                            "OrganId": "2",
                            "SeverityId": null,
                            "Verificationstatusid": null,
                            "DiagnosisStatus": 'Not Examined',
                            "DiagnosisStatusId": 6,
                            "EndDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "StartDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "DeleteInd": 'N',

                        }
                    ];



                    $scope.newAssessmentObj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

                    if ($scope.AssessmentplanpopupObj.AssessmentListArray.length !== 0) {
                        angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                            item.IsEditData = false;
                        });
                    }

                    if ($scope.newAssessmentObj.ProceduresArray.length > 0) {
                        angular.forEach($scope.newAssessmentObj.ProceduresArray, function (item) {
                            item.ProcedureNotes = item.ProcedureNotes || "";
                            if (item.ProcedureNotes != '') {
                                item.IsEdit = true;
                            } else {
                                item.IsEdit = false;
                            }
                            item.OrganId = item.OrganId != '' ? parseInt(item.OrganId) : "";
                            item.OrganName = item.OrganId == 1 ? 'OD' : (item.OrganId == 2 ? 'OS' : (item.OrganId == 3 ? 'OU' : ''));
                            item.OrganId = item.OrganId.toString();

                            item.DurationDate = $filter('date')(item.DurationDate, 'MM/dd/yyyy');
                            if (item.Duration == '' || item.Duration == null) {
                                item.ShowDateFormat = true;
                            } else {
                                item.ShowDateFormat = false;
                            }
                        });
                    }
                    if ($scope.newAssessmentObj.InvestigationsArray.length > 0) {
                        angular.forEach($scope.newAssessmentObj.InvestigationsArray, function (item) {
                            item.InvestigationNotes = item.InvestigationNotes || "";
                            if (item.InvestigationNotes != '') {
                                item.IsEdit = true;
                            } else {
                                item.IsEdit = false;
                            }
                            item.OrganId = item.OrganId != '' ? parseInt(item.OrganId) : "";
                            item.OrganName = item.OrganId == 1 ? 'OD' : (item.OrganId == 2 ? 'OS' : (item.OrganId == 3 ? 'OU' : ''));
                            item.OrganId = item.OrganId.toString();

                            item.DurationDate = $filter('date')(item.DurationDate, 'MM/dd/yyyy');
                            if (item.Duration == '' || item.Duration == null) {
                                item.ShowDateFormat = true;
                            } else {
                                item.ShowDateFormat = false;
                            }
                        });
                    }
                    if ($scope.newAssessmentObj.SurgeryArray.length > 0) {
                        angular.forEach($scope.newAssessmentObj.SurgeryArray, function (item) {
                            item.InternalCoManagerRemarks = item.InternalCoManagerRemarks || "";
                            if (item.InternalCoManagerRemarks != '') {
                                item.IsInternalCoManagerRemarks = true;
                            }
                            item.ExternalCoManagerRemarks = item.ExternalCoManagerRemarks || "";
                            if (item.ExternalCoManagerRemarks != '') {
                                item.IsExternalCoManagerRemarks = true;
                            }
                            item.CoordinatorRemarks = item.CoordinatorRemarks || "";
                            if (item.CoordinatorRemarks != '') {
                                item.IsCoordinatorRemarks = true;
                            }
                            item.OrganId = item.OrganId != '' ? parseInt(item.OrganId) : "";
                            item.OrganName = item.OrganId == 1 ? 'OD' : (item.OrganId == 2 ? 'OS' : (item.OrganId == 3 ? 'OU' : ''));
                            item.OrganId = item.OrganId.toString();

                            item.DurationDate = $filter('date')(item.DurationDate, 'MM/dd/yyyy');
                            if (item.Duration == '' || item.Duration == null) {
                                item.ShowDateFormat = true;
                            } else {
                                item.ShowDateFormat = false;
                            }
                        });
                    }

                    $scope.AssessmentplanpopupObj.OrdersArray.push($scope.newAssessmentObj);

                    mainobject.InvestigationsArray = mainobject.InvestigationsArray || [];
                    if (mainobject.InvestigationsArray.length !== 0) {
                        angular.forEach(mainobject.InvestigationsArray, function (tpitem) {
                            var obj = {
                                "PatientOrderId": 0,
                                "SpecializationId": tpitem.SpecializationId,
                                "OrderTypeId": 1,
                                "OrderType": "Investigation",
                                "Description": mainobject.ICD10DIAGDESCRIPTION,
                                "DescriptionId": tpitem.InvestigationId, //mainobject.ICD10CODE,
                                "OrgDescriptionId": tpitem.OrgInvestigationId,
                                "Remarks": tpitem.InvestigationNotes || "",
                                "OrganId": tpitem.OrganId,
                                "OrganName": tpitem.OrganName,
                                "BillingCode": "",
                                "BookingStatusId": "2",
                                "ProcedureCode": tpitem.ProcedureCode || "",
                                "StatusId": tpitem.StatusId || "1",
                                "DeleteInd": tpitem.DeleteInd || "N",
                                "InvSpecialityId": "",
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DiagnosisList": [],
                                "ReferralDoctorName": "",
                                "PatientSurgeryId": "",
                                "SurgeryListId": "",
                                "GeneralCost": '',
                                "TypeOfServiceId": '',
                                "ProcedureDescription": ''
                            }
                            var list = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": mainobject.DiagnosisId,
                                "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                                "DiagnosisName": mainobject.DiagnosisName,
                                "ICDCode": mainobject.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            obj.DiagnosisList.push(list);
                            $scope.AssessmentplanpopupObj.OrdersArray.push(obj);
                        });
                    }

                    mainobject.ProceduresArray = mainobject.ProceduresArray || [];
                    if (mainobject.ProceduresArray.length !== 0) {
                        angular.forEach(mainobject.ProceduresArray, function (tpitem) {
                            var obj = {
                                "PatientOrderId": 0,
                                "SpecializationId": tpitem.SpecializationId,
                                "OrderTypeId": 2,
                                "OrderType": "Procedure",
                                "Description": mainobject.ICD10DIAGDESCRIPTION,
                                "DescriptionId": tpitem.ProcedureId, //mainobject.ICD10CODE,
                                "OrgDescriptionId": tpitem.OrgProcedureId,
                                "Remarks": tpitem.ProcedureNotes || "",
                                "OrganId": tpitem.OrganId,
                                "OrganName": GetEyeName(tpitem.OrganId),
                                "BillingCode": "",
                                "BookingStatusId": "2",
                                "CPTCode": tpitem.ProcedureCode || "",
                                "StatusId": tpitem.StatusId || "1",
                                "DeleteInd": tpitem.DeleteInd || "N",
                                "InvSpecialityId": "",
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DiagnosisList": [],
                                "ReferralDoctorName": "",
                                "PatientSurgeryId": "",
                                "SurgeryListId": "",
                                "ProcedureCode": tpitem.ProcedureCode || "",
                                "GeneralCost": '',
                                "TypeOfServiceId": '',
                                "ProcedureDescription": ''
                            }
                            var list = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": mainobject.DiagnosisId,
                                "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                                "DiagnosisName": mainobject.DiagnosisName,
                                "ICDCode": mainobject.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            obj.DiagnosisList.push(list);
                            $scope.AssessmentplanpopupObj.OrdersArray.push(obj);
                        });
                    }

                    mainobject.SurgeriesArray = mainobject.SurgeriesArray || [];
                    if (mainobject.SurgeriesArray.length !== 0) {
                        angular.forEach(mainobject.SurgeriesArray, function (tpitem) {
                            var obj = {
                                "PatientOrderId": 0,
                                "SpecializationId": tpitem.SpecializationId,
                                "OrderTypeId": 3,
                                "OrderType": "Surgery",
                                "Description": tpitem.SurgeryName,
                                "DescriptionId": tpitem.SurgeryId,
                                "OrgDescriptionId": tpitem.OrgSurgeryId,
                                "Remarks": tpitem.SurgeryNotes || "",
                                "OrganId": tpitem.OrganId,
                                "OrganName": GetEyeName(tpitem.OrganId) || tpitem.OrganName,
                                "BookingStatusId": "2",
                                "StatusId": tpitem.StatusId || "1",
                                "DeleteInd": tpitem.DeleteInd || "N",
                                "InvSpecialityId": "",
                                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                "DiagnosisList": [],
                                "ReferralDoctorName": "",
                                "PatientSurgeryId": tpitem.PatientSurgeryId || 0,
                                "SurgeryListId": 0,
                                "InternalCoManagerId": tpitem.InternalCoManagerId || null,
                                "CoordinatorId": null,
                                "ExternalCoManagerId": tpitem.ExternalCoManagerId || null,
                                "ProcedureCode": tpitem.ProcedureCode,
                                "GeneralCost": '',
                                "TypeOfServiceId": '',
                                "ProcedureDescription": ''
                            }
                            var list = {
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": mainobject.DiagnosisId,
                                "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                                "DiagnosisName": mainobject.DiagnosisName,
                                "ICDCode": mainobject.ICD10CODE,
                                "ActiveInd": "Y"
                            };
                            obj.DiagnosisList.push(list);
                            $scope.AssessmentplanpopupObj.OrdersArray.push(obj);
                        });
                    }

                    $scope.AssessmentplanpopupObj.AssessmentListArray.push($scope.newAssessmentObj);
                    if (item.SelectedDiagnosisTemplateCheck && i == 0) {
                        alertify.success("Template is selected");
                    }
                } else if (i > 0) {
                    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to Update This Diagnosis? </h4>", function () {
                        angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (Aitem) {
                            if (Aitem.DiagnosisId == mainobject.DiagnosisId) {
                                Aitem.DiagnosisId = mainobject.DiagnosisId;
                                Aitem.ICD10CODE = mainobject.ICD10CODE;
                                Aitem.RcopiaProblemId = mainobject.RcopiaProblemId || "";
                                Aitem.ICD10DIAGNAME = mainobject.DiagnosisName;
                                Aitem.ICD10DIAGDESCRIPTION = mainobject.DiagnosisName || "";
                                Aitem.DiagnosisName = mainobject.DiagnosisName;
                                Aitem.PlanofDiscussionsNotes = mainobject.PlanofDiscussionsNotes || '';
                                Aitem.PatientInstructions = mainobject.PatientInstructions || '';
                                Aitem.AssessmentPlan.AssessmentsNotes = mainobject.AssessmentPlan.AssessmentsNotes || '';
                                Aitem.ActionsTaken = mainobject.ActionsTaken || '';
                                Aitem.DoctorNotes = mainobject.DoctorNotes || '';
                                Aitem.DiagnosisStatus = mainobject.DiagnosisStatus || '';
                                Aitem.PriorityId = mainobject.PriorityId || '';
                                Aitem.SnomedCode = mainobject.SnomedCode || '';
                                Aitem.SnomedCodeId = mainobject.SnomedCodeId || '';
                                Aitem.SnomedCodeObject = mainobject.SnomedCode || '';
                                Aitem.ProceduresArray = mainobject.ProceduresArray || [];
                                Aitem.InvestigationsArray = mainobject.InvestigationsArray || [];
                                Aitem.SurgeryArray = mainobject.SurgeriesArray || [];
                                Aitem.ReferralArray = mainobject.ReferralArray || [];
                                Aitem.IsEditData = true;
                                Aitem.SubTab = '1';
                                Aitem.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");

                                if (Aitem.ProceduresArray.length > 0) {
                                    angular.forEach(Aitem.ProceduresArray, function (item) {
                                        item.ProcedureNotes = item.ProcedureNotes || "";
                                        if (item.ProcedureNotes != '') {
                                            item.IsEdit = true;
                                        } else {
                                            item.IsEdit = false;
                                        }
                                        item.OrganId = item.OrganId != '' ? parseInt(item.OrganId) : "";
                                        item.OrganName = item.OrganId == 1 ? 'OD' : (item.OrganId == 2 ? 'OS' : (item.OrganId == 3 ? 'OU' : ''));
                                    });
                                }
                                if (Aitem.InvestigationsArray.length > 0) {
                                    angular.forEach(Aitem.InvestigationsArray, function (item) {
                                        item.InvestigationNotes = item.InvestigationNotes || "";
                                        if (item.InvestigationNotes != '') {
                                            item.IsEdit = true;
                                        } else {
                                            item.IsEdit = false;
                                        }
                                        item.OrganId = item.OrganId != '' ? parseInt(item.OrganId) : "";
                                        item.OrganName = item.OrganId == 1 ? 'OD' : (item.OrganId == 2 ? 'OS' : (item.OrganId == 3 ? 'OU' : ''));
                                    });
                                }
                                if (Aitem.SurgeryArray.length > 0) {
                                    angular.forEach(Aitem.SurgeryArray, function (item) {
                                        item.InternalCoManagerRemarks = item.InternalCoManagerRemarks || "";
                                        if (item.InternalCoManagerRemarks != '') {
                                            item.IsInternalCoManagerRemarks = true;
                                        }
                                        item.ExternalCoManagerRemarks = item.ExternalCoManagerRemarks || "";
                                        if (item.ExternalCoManagerRemarks != '') {
                                            item.IsExternalCoManagerRemarks = true;
                                        }
                                        item.CoordinatorRemarks = item.CoordinatorRemarks || "";
                                        if (item.CoordinatorRemarks != '') {
                                            item.IsCoordinatorRemarks = true;
                                        }
                                        item.OrganId = item.OrganId != '' ? parseInt(item.OrganId) : "";
                                        item.OrganName = item.OrganId == 1 ? 'OD' : (item.OrganId == 2 ? 'OS' : (item.OrganId == 3 ? 'OU' : ''));
                                    });
                                }
                                $scope.AssessmentplanpopupObj.OrdersArray.push(Aitem);
                            }
                        });

                        mainobject.InvestigationsArray = mainobject.InvestigationsArray || [];
                        if (mainobject.InvestigationsArray.length !== 0) {
                            angular.forEach(mainobject.InvestigationsArray, function (tpitem) {
                                var obj = {
                                    "PatientOrderId": 0,
                                    "SpecializationId": tpitem.SpecializationId,
                                    "OrderTypeId": 1,
                                    "OrderType": "Investigation",
                                    "Description": mainobject.ICD10DIAGDESCRIPTION,
                                    "DescriptionId": tpitem.InvestigationId, //mainobject.ICD10CODE,
                                    "OrgDescriptionId": tpitem.OrgInvestigationId,
                                    "Remarks": tpitem.InvestigationNotes || "",
                                    "OrganId": tpitem.OrganId,
                                    "OrganName": tpitem.OrganName,
                                    "BillingCode": "",
                                    "BookingStatusId": "2",
                                    "ProcedureCode": tpitem.ProcedureCode || "",
                                    "StatusId": tpitem.StatusId || "1",
                                    "DeleteInd": tpitem.DeleteInd || "N",
                                    "InvSpecialityId": "",
                                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                    "DiagnosisList": [],
                                    "ReferralDoctorName": "",
                                    "PatientSurgeryId": "",
                                    "SurgeryListId": "",
                                    "GeneralCost": '',
                                    "TypeOfServiceId": '',
                                    "ProcedureDescription": ''
                                }
                                var list = {
                                    "DiagnosisDetailId": 0,
                                    "DiagnosisId": mainobject.DiagnosisId,
                                    "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                                    "DiagnosisName": mainobject.DiagnosisName,
                                    "ICDCode": mainobject.ICD10CODE,
                                    "ActiveInd": "Y"
                                };
                                obj.DiagnosisList.push(list);
                                $scope.AssessmentplanpopupObj.OrdersArray.push(obj);
                            });
                        }

                        mainobject.ProceduresArray = mainobject.ProceduresArray || [];
                        if (mainobject.ProceduresArray.length !== 0) {
                            angular.forEach(mainobject.ProceduresArray, function (tpitem) {
                                var obj = {
                                    "PatientOrderId": 0,
                                    "SpecializationId": tpitem.SpecializationId,
                                    "OrderTypeId": 2,
                                    "OrderType": "Procedure",
                                    "Description": mainobject.ICD10DIAGDESCRIPTION,
                                    "DescriptionId": tpitem.ProcedureId, //mainobject.ICD10CODE,
                                    "OrgDescriptionId": tpitem.OrgProcedureId,
                                    "Remarks": tpitem.ProcedureNotes || "",
                                    "OrganId": tpitem.OrganId,
                                    "OrganName": GetEyeName(tpitem.OrganId),
                                    "BillingCode": "",
                                    "BookingStatusId": "2",
                                    "CPTCode": tpitem.ProcedureCode || "",
                                    "StatusId": tpitem.StatusId || "1",
                                    "DeleteInd": tpitem.DeleteInd || "N",
                                    "InvSpecialityId": "",
                                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                    "DiagnosisList": [],
                                    "ReferralDoctorName": "",
                                    "PatientSurgeryId": "",
                                    "SurgeryListId": "",
                                    "ProcedureCode": tpitem.ProcedureCode || "",
                                    "GeneralCost": '',
                                    "TypeOfServiceId": '',
                                    "ProcedureDescription": ''
                                }
                                var list = {
                                    "DiagnosisDetailId": 0,
                                    "DiagnosisId": mainobject.DiagnosisId,
                                    "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                                    "DiagnosisName": mainobject.DiagnosisName,
                                    "ICDCode": mainobject.ICD10CODE,
                                    "ActiveInd": "Y"
                                };
                                obj.DiagnosisList.push(list);
                                $scope.AssessmentplanpopupObj.OrdersArray.push(obj);
                            });
                        }

                        mainobject.SurgeriesArray = mainobject.SurgeriesArray || [];
                        if (mainobject.SurgeriesArray.length !== 0) {
                            angular.forEach(mainobject.SurgeriesArray, function (tpitem) {
                                var obj = {
                                    "PatientOrderId": 0,
                                    "SpecializationId": tpitem.SpecializationId,
                                    "OrderTypeId": 3,
                                    "OrderType": "Surgery",
                                    "Description": tpitem.SurgeryName,
                                    "DescriptionId": tpitem.SurgeryId,
                                    "OrgDescriptionId": tpitem.OrgSurgeryId,
                                    "Remarks": tpitem.SurgeryNotes || "",
                                    "OrganId": tpitem.OrganId,
                                    "OrganName": GetEyeName(tpitem.OrganId) || tpitem.OrganName,
                                    "BookingStatusId": "2",
                                    "StatusId": tpitem.StatusId || "1",
                                    "DeleteInd": tpitem.DeleteInd || "N",
                                    "InvSpecialityId": "",
                                    "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                                    "DiagnosisList": [],
                                    "ReferralDoctorName": "",
                                    "PatientSurgeryId": tpitem.PatientSurgeryId || 0,
                                    "SurgeryListId": 0,
                                    "InternalCoManagerId": tpitem.InternalCoManagerId || null,
                                    "CoordinatorId": null,
                                    "ExternalCoManagerId": tpitem.ExternalCoManagerId || null,
                                    "ProcedureCode": tpitem.ProcedureCode,
                                    "GeneralCost": '',
                                    "TypeOfServiceId": '',
                                    "ProcedureDescription": ''
                                }
                                var list = {
                                    "DiagnosisDetailId": 0,
                                    "DiagnosisId": mainobject.DiagnosisId,
                                    "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                                    "DiagnosisName": mainobject.DiagnosisName,
                                    "ICDCode": mainobject.ICD10CODE,
                                    "ActiveInd": "Y"
                                };
                                obj.DiagnosisList.push(list);
                                $scope.AssessmentplanpopupObj.OrdersArray.push(obj);
                            });
                        }


                    }, function () {
                        return;
                    });
                }
                $scope.newAssessmentObj = {
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "AssessmentsNotes": "",
                        "DoctorNotes": "",
                        "ActionsTaken": ""
                    },
                    "SnomedCodeId": 0,
                    "SnomedCode": "",
                    "CreatedDateTime": "",
                    "SpecializationId": $scope.SpecializationId,
                    "GeneralSeverityId": null,
                    "GeneralSeverityName": null,
                    "GeneralDiagnosisStatusId": '',
                    "GeneralDiagnosisStatusName": '',
                    "GeneralVerificationStatusId": '',
                    "GeneralVerificationStatus": '',
                    "Type": "Optha",
                    "OrganId1": "1",
                    "OrganId2": "2",
                    "OrganId": "1",
                    "SubTab": "1",
                    "PriorityId": null,
                    "ODSeverityId": null,
                    "OSSeverityId": null,
                    "OrganName": "OD",

                    "DiagnosisId": 0,
                    "DiagnosisObject": "",
                    "PlanofDiscussionsNotes": "",
                    "PatientInstructions": "",
                    "AssessmentsNotes": "",
                    "ActionsTaken": "",
                    "DoctorNotes": "",
                    "DiagnosisRiskLevel": 'Mild',
                    "FindingDiagnosisId": 0,
                    "DiagnosisHistoryId": 0,
                    "ICD10CODE": "",
                    "ICD10DIAGDESCRIPTION": "",
                    "ICD10DIAGNAME": "",
                    "DiagnosisStatus": 1,
                    "PlanOfcareNotesArray": [],
                    "ProceduresArray": [],
                    "PrescriptionArray": [],
                    "SurgeryArray": [],
                    "ReferralArray": [],
                    "InvestigationsArray": [],
                    "InvestigationFindingId": 0,
                    "FindingId": 0,
                    "DeleteInd": "N",
                    "ProceduresAddedTime": "",
                    "PrescriptionAddedTime": "",
                    "PlanOfCareAddedTime": "",
                    "SurgeryAddedTime": "",
                    "IsEditData": false,
                    "SelectedInvestigationObj": "",
                    "InvsearchBy": 1,
                    "OPDPsearchBy": 1,
                    "SurgerysearchBy": 1,
                    "ProcedureSurgerysearchBy": 1,
                    "StatusList": [{
                        "OrganStatusId": null,
                        "OrganId": "1",
                        "SeverityId": null,
                        "Verificationstatusid": null,
                        "DiagnosisStatus": 'Not Examined',
                        "DiagnosisStatusId": 6,
                        "EndDate": '',
                        "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
                        "DeleteInd": 'N',

                    },
                    {
                        "OrganStatusId": null,
                        "OrganId": "2",
                        "SeverityId": null,
                        "Verificationstatusid": null,
                        "DiagnosisStatus": 'Not Examined',
                        "DiagnosisStatusId": 6,
                        "EndDate": '',
                        "StartDate": '',
                        "DeleteInd": 'N',

                    }
                    ],
                    "RcopiaProblemId": ""
                }
            }
        }

        $scope.ChangeDiagnosisTemplate = function (item) {
            if ($scope.DiagnosisTemplatesArray.length > 0) {
                angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
                    mitem.IsEdit = false;
                });
                item.IsEdit = true;
            }
        };

        $scope.$watch("AssessmentplanpopupObj.AssessmentListArray", function (newVal, oldVal) {
            $scope.ActiveCount = 0;
            $scope.InactiveCount = 0;
            $scope.ResolvedCount = 0;
            $scope.RuledOutCount = 0;
            $scope.ProvisionalCount = 0;
            $scope.NotExaminedCount = 0;
            $scope.EnteredinErrorCount = 0;
            var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");

            if ($scope.AssessmentplanpopupObj.AssessmentListArray === undefined) { return; }
            angular.forEach($scope.AssessmentplanpopupObj.AssessmentListArray, function (item) {
                if (item.DeleteInd == "N") {

                    item.ActiveInd = false;
                    item.InactiveInd = false;
                    item.ResolvedInd = false;
                    item.RuledOutInd = false;
                    item.ProvisionalInd = false;
                    item.NotExaminedInd = false;
                    item.EnteredinErrorInd = false;
                    item.CarryingNotActiveRDiagnosisStatus = false;
                    item.CarryingNotActiveLDiagnosisStatus = false;

                    let ProvisionalDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 1; });
                    if (ProvisionalDiagnosisststusList.length > 0) {
                        $scope.ProvisionalCount++;
                        item.ProvisionalInd = true;
                    }

                    let ActiveDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 2; });
                    if (ActiveDiagnosisststusList.length > 0) {
                        $scope.ActiveCount++;
                        item.ActiveInd = true;
                    }

                    let InActiveDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 3; });
                    if (InActiveDiagnosisststusList.length > 0) {
                        $scope.InactiveCount++;
                        item.InactiveInd = true;
                    }

                    let ResolveDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 4; });
                    if (ResolveDiagnosisststusList.length > 0) {
                        $scope.ResolvedCount++;
                        item.ResolvedInd = true;
                    }

                    let RuledOutDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 5; });
                    if (RuledOutDiagnosisststusList.length > 0) {
                        $scope.RuledOutCount++;
                        item.RuledOutInd = true;
                    }

                    let NotExaminedDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 6; });
                    if (NotExaminedDiagnosisststusList.length > 0) {
                        $scope.NotExaminedCount++;
                        item.NotExaminedInd = true;
                    }
                    let EnteredDiagnosisststusList = $filter("filter")(item.StatusList, function (iterator) { return iterator.DiagnosisStatusId === 7; });
                    if (EnteredDiagnosisststusList.length > 0) {
                        $scope.EnteredinErrorCount++;
                        item.EnteredinErrorInd = true;
                    }
                    item.IsGeneral = false;
                    if (item.Type == 'General') {
                        item.IsGeneral = true;
                    }

                }
            });
        }, true);
        $scope.GetUserConsultationTemplateDetails = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 1000,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
                "IsFavoriteInd": 0
            }
            eHnotePatientDataService.GetUserConsultationTemplateDetails(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.DiagnosisTemplatesArray = resp.data.AssessmentsPlanArray || [];
                    $scope.ActionsTakenlist = resp.data.ConsultationActionsTaken || [];
                    $scope.DoctorNoteslist = resp.data.DoctorNotes || [];
                    $scope.PatientInstructionslist = resp.data.PatientInstructions || [];
                    $scope.AssessmentsNoteslist = resp.data.AssessmentsNotesTemplates || [];
                    $scope.PlanofDiscussionTemplateslist = resp.data.DiscussionTemplates || [];

                    $scope.MultipleAssessmentsPlanArray = resp.data.MultipleAssessmentsPlanArray || [];


                    $scope.DiagnosisTemplatesArray = $scope.DiagnosisTemplatesArray.concat($scope.MultipleAssessmentsPlanArray);
                    if ($scope.DiagnosisTemplatesArray.length > 0) {
                        angular.forEach($scope.DiagnosisTemplatesArray, function (mitem) {
                            mitem.IsEdit = false;
                            //item.IsDescriptionEdit = false;
                        });
                    }
                    $scope.DiagnosisTemplatesArray[0].IsEdit = true;


                } else {
                    $scope.DiagnosisTemplatesArray = [];

                    $scope.ActionsTakenlist = [];
                    $scope.DoctorNoteslist = [];
                    $scope.PatientInstructionslist = [];
                    $scope.AssessmentsNoteslist = [];
                    $scope.PlanofDiscussionTemplateslist = [];
                    // $scope.MultipleAssessmentsPlanArray = []
                }

            }, function (err) {

            });
        }
        $scope.DiagnosisTemp = {
            "TempInd": false
        };
        $scope.DiagnosisTemSaveClick = function () {
            $scope.DiagnosisTemp.TempInd = !$scope.DiagnosisTemp.TempInd;
        }
        $scope.SaveDiagnosisTemplates = function (item) {
            // var item = $filter("filter")(item, { "IsEditData": true }, true) || [];
            if ($scope.assonj.EnterDiagnosisTemplateName === "") {
                alertify.error("Please Enter Template Name");
                return false;
            }
            //if ($scope.AssessmentPlanArrays.length === 0) {
            //    alertify.error("Please Select The Diagnois");
            //    return false;
            //}
            var count = 0;
            $scope.NewFinalSubmitArray = [];
            $scope.submitDiagnosis = [];
            $scope.AnteriorValuesArray = [];
            $scope.PosteriorValuesArray = [];
            $scope.ExternalExaminationsValuesArray = [];

            //$scope.submitDiagnosis = [];
            $scope.dummyObj = {
                "TemplateDiagnosisId": 0,
                "DiagnosisId": 0,
                "DiagnosisName": "",
                "FullName": "",
                "DiagnosisNotes": "",
                "HospitalId": 0,
                "UserId": 0,
                "DiagnosisCode": "",
                "ICD10CODE": "",
                "SnomedCodeId": 0,
                "SnomedCode": "",
                "OrganId": "1",
                "OrganName": "OD",
                "ODSeverityId": null,
                "OSSeverityId": null,
                "PlanofDiscussionsNotes": "",
                "PatientInstructions": "",
                "AssessmentsNotes": "",
                "AssessmentsNotes": "",
                "ActionsTaken": "",
                "DiagnosisRiskLevel": "",
                "DiagnosisStatus": 1,
                "ProceduresArray": [],
                "InvestigationsArray": [],
                "SurgeriesArray": [],
                "ReferralArray": [],
                "PriorityId": ""
                //"PlanOfCareNotesArray": []
            }

            angular.forEach(item, function (citem) {

                citem.ProceduresArray = $filter("filter")(citem.ProceduresArray, { "DeleteInd": 'N' }, true) || [];
                citem.InvestigationsArray = $filter("filter")(citem.InvestigationsArray, { "DeleteInd": 'N' }, true) || [];
                citem.SurgeryArray = $filter("filter")(citem.SurgeryArray, { "DeleteInd": 'N' }, true) || [];
                citem.ReferralArray = $filter("filter")(citem.ReferralArray, { "DeleteInd": 'N' }, true) || [];

                $scope.dummyObj.ActiveInd = citem.ActiveInd;
                $scope.dummyObj.DeleteInd = citem.DeleteInd;
                $scope.dummyObj.CreatedDateTime = citem.CreatedDateTime;
                $scope.dummyObj.DiagnosisId = citem.DiagnosisId;
                $scope.dummyObj.DiagnosisName = citem.DiagnosisName || citem.ICD10DIAGDESCRIPTION;
                $scope.dummyObj.PatientInstructions = citem.PatientInstructions;
                $scope.dummyObj.AssessmentsNotes = citem.AssessmentPlan.AssessmentsNotes || '';
                $scope.dummyObj.ActionsTaken = citem.ActionsTaken;
                $scope.dummyObj.PlanofDiscussionsNotes = citem.PlanofDiscussionsNotes;
                $scope.dummyObj.DoctorNotes = citem.DoctorNotes;
                $scope.dummyObj.ICD10CODE = citem.ICD10CODE;
                $scope.dummyObj.ICD10DIAGDESCRIPTION = citem.ICD10DIAGDESCRIPTION;
                $scope.dummyObj.ODSeverityId = citem.ODSeverityId;
                $scope.dummyObj.OSSeverityId = citem.OSSeverityId;
                $scope.dummyObj.SnomedCode = citem.SnomedCode;
                $scope.dummyObj.SnomedCodeId = citem.SnomedCodeId;
                $scope.dummyObj.DiagnosisStatus = citem.DiagnosisStatus;
                $scope.dummyObj.ProceduresArray = citem.ProceduresArray || [];
                $scope.dummyObj.InvestigationsArray = citem.InvestigationsArray || [];
                $scope.dummyObj.SurgeriesArray = citem.SurgeryArray || [];
                $scope.dummyObj.ReferralArray = citem.ReferralArray || [];
                $scope.dummyObj.PriorityId = citem.PriorityId || null;


                //$scope.submitDiagnosis.push($scope.dummyObj);

                $scope.DiagnosisArray = angular.copy($scope.dummyObj);

                $scope.submitDiagnosis.push($scope.DiagnosisArray);


            });

            $scope.DiagnosisMultipleTemp = false;

            if ($scope.submitDiagnosis.length > 1) {
                $scope.DiagnosisMultipleTemp = true;
            }
            else {
                $scope.DiagnosisMultipleTemp = false;
            }


            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "TemplateId": 0,
                "TemplateName": $scope.assonj.EnterDiagnosisTemplateName,
                "DiagnosisArray": $scope.submitDiagnosis,
                "Medications": [],
                "AnteriorValuesArray": [],
                "PosteriorValuesArray": [],
                "ExternalExaminationsValuesArray": [],
                "DeleteInd": 0,
                "IsTemplateFavorites": false,
                "IsDiagnosisMultiple": $scope.DiagnosisMultipleTemp
            }

            console.log(JSON.stringify(params));
            //return false;
            eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
                if (resp.data.Status === "Failure") {
                    alertify.error(resp.data.Message);
                } else {
                    if (params.TemplateId === 0) {
                        alertify.success("Save successfully");
                        $scope.DiagnosisTemSaveClick();
                    } else {
                        alertify.success("Update successfully");
                        $scope.DiagnosisTemSaveClick();
                    }
                    $scope.assonj.EnterDiagnosisTemplateName = '';
                    $scope.GetUserConsultationTemplateDetails();
                }
            }, function (err) {

            });

            $scope.assonj.IsDiagnosisTemplateSavePopOver = false;
        };

        $scope.DeleteDiagnosisTemplates = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this template  ?", function () {
                var params = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "TemplateId": item.TemplateId,
                    "TemplateName": item.TemplateName,
                    "DiagnosisArray": [],
                    "Medications": [],
                    "AnteriorValuesArray": [],
                    "PosteriorValuesArray": [],
                    "ExternalExaminationsValuesArray": [],
                    "DeleteInd": 1,
                    "IsTemplateFavorites": false,
                    "IsDiagnosisMultiple": false,
                    "ProceduresArray": [],
                    "ReferralArray": [],
                    "SurgeryArray": []
                }

                eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {
                    $scope.GetUserConsultationTemplateDetails();
                    if (resp.data != undefined && resp.data != "") {
                        alertify.success("Delete successfully");
                        // $scope.GetUserChiefComplaintTemplateDetails();
                    };
                    // $scope.ExamAnteriorPosteriorObject.ViewAutoPlansDtls = false;
                }, function (err) {

                });
            }, function () {
                r = "You pressed Cancel!";
            });

        };
        $scope.AddFaviroteDiagnosisTemplates = function (item) {
            item.IsTemplateFavorites = !item.IsTemplateFavorites || false;
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "TemplateId": item.TemplateId,
                "TemplateName": item.TemplateName,
                "DiagnosisArray": item.DiagnosisArray,
                "Medications": [],
                "AnteriorValuesArray": [],
                "PosteriorValuesArray": [],
                "ExternalExaminationsValuesArray": [],
                "DeleteInd": 0,
                "IsTemplateFavorites": item.IsTemplateFavorites || false,
                "IsDiagnosisMultiple": false,
                "ProceduresArray": [],
                "ReferralArray": [],
                "SurgeryArray": []
            }
            eHnotePatientDataService.AddUpdateUserConsultationTemplateDetails(params).then(function (resp) {

                if (resp.data != undefined && resp.data != "") {
                    if (item.IsTemplateFavorites) {
                        alertify.success('Add Favorite Template Successfully');
                    } else {
                        alertify.success('Remove Favorite Template Successfully');
                    }
                    $scope.GetUserConsultationTemplateDetails();
                };
            }, function (err) {

            });
        };
        $scope.changeODSeverity = function (item, id) {
            var SeverityList = $filter("filter")($scope.GetSeverityList, function (iterator) { return iterator.SeverityId === id; });
            /*item.ODSeverityId = id*/
            item.StatusList[0].SeverityId = SeverityList[0].SeverityId || '';


        }
        $scope.changeOSSeverity = function (item, id) {
            var SeverityList = $filter("filter")($scope.GetSeverityList, function (iterator) { return iterator.SeverityId === id; });
            /*item.OSSeverityId = id*/
            item.StatusList[1].SeverityId = SeverityList[0].SeverityId || '';


        }
        $scope.Generalobj = {
            "IsGeneral": false
        }
        $scope.changeOrgangeneral = function (mainitem) {
            if (mainitem.IsGeneral) {
                mainitem.Type = 'General';

                mainitem.StatusList = [];
                let obj = {
                    "OrganStatusId": null,
                    "OrganId": "4",
                    "SeverityId": null,
                    "Verificationstatusid": null,
                    "DiagnosisStatus": '',
                    "DiagnosisStatusId": 6,
                    "EndDate": null,
                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null,
                    "DeleteInd": 'N',

                }
                mainitem.StatusList.push(obj);
            } else {
                mainitem.Type = 'Optha';
                mainitem.StatusList = [];
                let od = {
                    "OrganStatusId": null,
                    "OrganId": "1",
                    "SeverityId": null,
                    "Verificationstatusid": null,
                    "DiagnosisStatus": '',
                    "DiagnosisStatusId": 6,
                    "EndDate": null,
                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null,
                    "DeleteInd": 'N',

                }
                mainitem.StatusList.push(od);
                let os = {
                    "OrganStatusId": null,
                    "OrganId": "2",
                    "SeverityId": null,
                    "Verificationstatusid": null,
                    "DiagnosisStatus": '',
                    "DiagnosisStatusId": 6,
                    "EndDate": null,
                    "StartDate": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null,
                    "DeleteInd": 'N',

                }
                mainitem.StatusList.push(os);
            }
        }
        $scope.ClearProcedureDetails = function (item) {
            item.DurationDate = "";
            item.Duration = "";
            item.DurationType = "";
            item.ProcedureNotes = "";
            item.OrganId = "";
        }
        $scope.ClearInvestigationDetails = function (item) {
            item.OrganId = "";
            item.DurationDate = "";
            item.Duration = "";
            item.DurationType = "";
            item.InvestigationNotes = "";

        }

        $scope.ClearSurgeriesDetails = function (item) {
            item.ExternalCoManagerRemarks = "";
            item.OrganId = "";
            item.CoordinatorId = "";
            item.ExternalCoManagerId = "";
            item.InternalCoManagerId = "";
            item.DurationDate = null;
            item.Duration = "";
            item.DurationType = "";
        }
        $scope.DelectAssProcedure = function (Aitem, mainitem) {
            var index = mainitem.ProceduresArray.indexOf(Aitem);

            if (Aitem.PatientProcedureId === 0) {
                if (index > -1) {
                    mainitem.ProceduresArray.splice(index, 1);
                }
            } else {
                mainitem.ProceduresArray[index].DeleteInd = 'Y';
            }

            if ($scope.cacheStorageItem.ProceduresDetails.length !== 0) {

                var List = $filter("filter")($scope.cacheStorageItem.ProceduresDetails, function (assitem, index) { return assitem.DescriptionId == Aitem.ProcedureId },);
                if (List.length !== 0) {
                    if (List[0].OrgDescriptionId == Aitem.OrgProcedureId) {
                        List[0].DeleteInd = 'Y';
                    }

                }
            }

        };
        $scope.DelectAssInvestigation = function (Aitem, mainitem) {
            var index = mainitem.InvestigationsArray.indexOf(Aitem);
            if (Aitem.PatientInvestigationId === 0) {
                if (index > -1) {
                    mainitem.InvestigationsArray.splice(index, 1);
                }
            } else {
                mainitem.InvestigationsArray[index].DeleteInd = 'Y';
            }

            if ($scope.cacheStorageItem.InvestigationsDetails.length !== 0) {
                var List = $filter("filter")($scope.cacheStorageItem.InvestigationsDetails, function (assitem, index) { return assitem.ProcedureCode == Aitem.ProcedureCode },);
                if (List.length !== 0) {
                    if (List[0].OrgDescriptionId == Aitem.OrgInvestigationId) {
                        List[0].DeleteInd = 'Y';
                    }
                }
            }

        };
        $scope.DelectAssSurgery = function (Aitem, mainitem) {
            var index = mainitem.SurgeryArray.indexOf(Aitem);
            if (Aitem.PatientSurgeryId === 0) {
                if (index > -1) {
                    mainitem.SurgeryArray.splice(index, 1);
                }
            } else {
                mainitem.SurgeryArray[index].DeleteInd = 'Y';
            }

            if ($scope.cacheStorageItem.SurgeriesDetails.length !== 0) {

                var List = $filter("filter")($scope.cacheStorageItem.SurgeriesDetails, function (assitem, index) { return assitem.ProcedureCode == Aitem.ProcedureCode },);
                if (List.length !== 0) {
                    if (List[0].OrgDescriptionId == Aitem.OrgSurgeryId) {

                        List[0].DeleteInd = 'Y';
                    }

                }
            }

        };
        $scope.RemovePrescriptionDetailObj = function (index, item) {
            item.DeleteInd = 'Y';

            item.RcopiaMedicationId = item.RcopiaMedicationId || "";


            console.log(item.RcopiaMedicationId + "__RcopiaMedicationId");



            $scope.PrescriptionMainAddObjFOrDelete = getEmptyPrescriptionObj();
            $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId = item.PatientPrescriptionId;

            var newmedicationobj = getNewPrescriptionDetailObj();
            newmedicationobj.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
            newmedicationobj.PatientPrescriptionId = item.PatientPrescriptionId;
            newmedicationobj.MedicationId = item.MedicationId;
            newmedicationobj.RcopiaDrugId = item.RcopiaDrugId || 0;
            newmedicationobj.RcopiaMedicationId = item.RcopiaMedicationId || 0;
            newmedicationobj.MedicationName = item.MedicationName || 0;
            newmedicationobj.DrugNDCID = item.DrugNDCID || "";
            newmedicationobj.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
            newmedicationobj.DrugGenericId = item.DrugGenericId || "";
            newmedicationobj.DrugBrandName = item.DrugBrandName || "";
            newmedicationobj.DrugGenericName = item.DrugGenericName || "";
            newmedicationobj.DrugForm = item.DrugForm || "";
            newmedicationobj.DrugStrength = item.DrugStrength || "";
            newmedicationobj.DrugSchedule = item.DrugSchedule || "";
            newmedicationobj.DrugSupply = item.DrugSupply || "";
            newmedicationobj.DrugCompound = item.DrugSupply || "";
            newmedicationobj.MedicationTypeId = item.MedicationTypeId || "";
            newmedicationobj.MedicationTypeName = item.MedicationTypeName || "";
            newmedicationobj.Sig = item.Sig || "";
            newmedicationobj.SigId = item.SigId || "";
            newmedicationobj.ActionId = item.ActionId || "";
            newmedicationobj.Action = item.Action || "";
            newmedicationobj.DoseId = item.DoseId || "";
            newmedicationobj.Dose = item.Dose || "";
            newmedicationobj.DoseUnitId = item.DoseUnitId || "";
            newmedicationobj.DoseUnit = item.DoseUnit || "";
            newmedicationobj.RouteId = item.RouteId || "";
            newmedicationobj.Route = item.Route || "";
            newmedicationobj.FrequencyId = item.FrequencyId || "";
            newmedicationobj.Frequency = item.Frequency || "";
            newmedicationobj.DoseOtherId = item.DoseOtherId || "";
            newmedicationobj.DoseOther = item.DoseOther || "";
            newmedicationobj.DaysSupplyId = item.DaysSupplyId || "";
            newmedicationobj.DaysSupply = item.DaysSupply || "";
            newmedicationobj.Quantity = item.Quantity || "";
            newmedicationobj.QuantityUnitId = item.QuantityUnitId || "";
            newmedicationobj.QuantityUnit = item.QuantityUnit || "";
            newmedicationobj.RefillId = item.RefillId || "";
            newmedicationobj.Refills = item.Refills || "";
            newmedicationobj.SubstitutionPermitted = item.SubstitutionPermitted || "";
            newmedicationobj.PatientInstructions = item.PatientInstructions || "";
            newmedicationobj.DeleteInd = "Y";
            newmedicationobj.OtherNotes = "";
            newmedicationobj.Remarks = "";
            newmedicationobj.StartDate = "";
            newmedicationobj.StopDate = "";
            newmedicationobj.FillDate = "";
            newmedicationobj.StopReason = "";
            newmedicationobj.RcopiaMedicationStatus = 0;
            newmedicationobj.IsEditMode = false;
            $scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails.push(newmedicationobj);


            console.log(JSON.stringify($scope.PrescriptionMainAddObjFOrDelete));

            eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObjFOrDelete, OnAddSigSuccess, OnAddSigError);
            function OnAddSigSuccess(response) {
                if (response.status === "Success") {
                    alertify.success("Medication Deleted  Successfully");


                    if (item.RcopiaMedicationId !== "") {

                        $scope.AddNewPrescriptionObj = getnewPrescriptionObj();


                        angular.forEach($scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails, function (pitem) {

                            var scheduletype = "unknown";
                            if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                                scheduletype = "unknown";
                            } else {
                                scheduletype = pitem.DrugSchedule;
                            }
                            var obj = {
                                "PatientMedicationId": pitem.PatientPrescriptionDetailId,
                                "IsInPatientMedication": "n",
                                "HistorySource": "patient",
                                "HasScheduledDrug": "n",
                                "Deleted": "y",
                                "RcopiaMedicationId": pitem.RcopiaMedicationId,
                                "MedicationId": pitem.MedicationId,
                                "DrugRocipaId": pitem.RcopiaDrugId,
                                "DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                                "DrugNDCID": pitem.DrugNDCID,
                                "DrugRxNormId": pitem.DrugRxNormId,
                                "DrugBrandName": pitem.DrugBrandName,
                                "GenericName": pitem.DrugGenericName,
                                "Form": pitem.DrugForm,
                                "Schedule": scheduletype,
                                "Strength": pitem.DrugStrength,
                                "Supply": "n",
                                "Compound": "n",
                                "Action": pitem.DrugAction,
                                "Dose": pitem.DrugDose,
                                "Route": pitem.DoseRoute,
                                "DoseUnit": pitem.DoseUnit,
                                "DoseTiming": pitem.DoseTiming,
                                "DoseOther": pitem.DoseOther,
                                "Duration": pitem.DoseDuration,
                                "Quantity": pitem.DoseQuantity,
                                "QuantityUnit": pitem.QuantityUnit,
                                "Refills": pitem.Refills,
                                "SubstitutionPermitted": pitem.SubstitutionPermitted,
                                "OtherNotes": pitem.OtherNotes,
                                "PatientNotes": pitem.PatientNotes,
                                "Comments": "",
                                "StartDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                                "StopDate": pitem.StopDate,
                                "FillDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
                                "StopReason": pitem.MedicineStopReason,
                                "DeleteInd": pitem.DeleteInd
                            };

                            $scope.AddNewPrescriptionObj.MedicationsList.push(obj);

                        });


                        eHnoteDiagnosisDataServices.addPatientMedicationsToRcopia($scope.AddNewPrescriptionObj).then(function (response) {
                            if (response.status === 'Success') {

                            }
                        });
                    }
                }
            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
        };
        $scope.ClearMedicalRxItem = function (mainitem) {

            mainitem.ActionId = "";
            mainitem.Action = "";
            mainitem.Dose = "";
            mainitem.DoseUnit = "";
            mainitem.Route = "";
            mainitem.Frequency = "";
            mainitem.DoseOther = "";
            mainitem.DaysSupply = "";
            mainitem.QuantityUnit = "";
            mainitem.DoseId = "";
            mainitem.DoseUnitId = "";
            mainitem.RouteId = "";
            mainitem.FrequencyId = "";
            mainitem.DoseOtherId = "";
            mainitem.DaysSupplyId = "";
            mainitem.Quantity = "";
            mainitem.QuantityUnitId = "";
            mainitem.RefillId = "";
            mainitem.Refills = "";
            mainitem.PatientInstructions = "";
            mainitem.SigObj = '';

        }
        $scope.ShowSigFields = function (item) {
            item.SigFields = !item.SigFields;
            $scope.adnewsigobj.IsNewSig = false;

        }

        $scope.addSIgNameDynamicallyAdded = function () {

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                    var dosesupplytest = "";
                    if (initem.DaysSupplyDescription == undefined) {
                        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                        if (filteredArray.length > 0) {

                            initem.DaysSupply = filteredArray[0].Code;
                            initem.DaysSupplyDescription = filteredArray[0].Description;
                        };
                    }
                    if (initem.DaysSupply !== '') {
                        dosesupplytest = " for " + initem.DaysSupplyDescription;
                    }
                    initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;

                });
            }

        }
        $scope.changePrescAction = function (mainobj) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
            if (filteredArray.length > 0) {
                mainobj.Action = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescDoseUnit = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
            if (filteredArray.length > 0) {
                mainobj.DoseUnit = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescDose = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
            if (filteredArray.length > 0) {
                mainobj.Dose = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescRoute = function (mainobj) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
            if (filteredArray.length > 0) {
                mainobj.Route = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescFrequency = function (mainobj) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
            if (filteredArray.length > 0) {
                mainobj.Frequency = filteredArray[0].Description;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescDoseOther = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
            if (filteredArray.length > 0) {
                mainobj.DoseOther = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescDaysSupply = function (mainobj) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
            if (filteredArray.length > 0) {

                mainobj.DaysSupply = filteredArray[0].Code;
                mainobj.DaysSupplyDescription = filteredArray[0].Description;
            };
            $scope.addSIgNameDynamicallyAdded();
        };
        $scope.changePrescQuantityUnit = function (mainobj) {
            var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
            if (filteredArray.length > 0) {
                mainobj.QuantityUnit = filteredArray[0].Code;
            };
        };
        $scope.changePrescRefill = function (mainobj) {
            var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
            if (filteredArray.length > 0) {
                mainobj.Refills = filteredArray[0].Code;
            };
        };
        $scope.changeSigForMedicine = function (item) {
            item.Sig = "";
            item.SigId = 0;
        };

        $scope.ONSigDetails = function (item, mainitem) {
            mainitem.SigFields = false;
            console.log(item);
            console.log(mainitem);

            mainitem.ActionId = item.ActionId || null;
            mainitem.Action = item.Action || '';
            mainitem.Dose = item.Dose || '';
            mainitem.DoseUnit = item.DoseUnit || '';
            mainitem.Route = item.Route || '';
            mainitem.Frequency = item.Frequency || '';
            mainitem.DoseOther = item.DoseOther || '';
            mainitem.DaysSupply = item.DaysSupply || '';
            mainitem.QuantityUnit = item.QuantityUnit || '';
            mainitem.DoseId = item.DoseId || null;
            mainitem.DoseUnitId = item.DoseUnitId || null;
            mainitem.RouteId = item.RouteId || null;
            mainitem.FrequencyId = item.FrequencyId || null;
            mainitem.DoseOtherId = item.DoseOtherId || null;
            mainitem.DaysSupplyId = item.DaysSupplyId || null;
            mainitem.Quantity = item.Quantity || null;
            mainitem.QuantityUnitId = item.QuantityUnitId || null;
            mainitem.RefillId = item.RefillId || null;
            mainitem.Refills = item.Refills || null;
            mainitem.Sig = item.Sig;
            mainitem.SigId = item.OrganizationSigTemplateId;

            if (item.DaysSupplyId != 0) {
                var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
                if (filteredArray.length > 0) {
                    var DateCode = filteredArray[0].Code;
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                    mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');
                }
            }
        }
        $scope.getOrganizationMedicationSigitems = function (text) {
            text = text || '';
            var params = {
                "OrganizationId": $scope.HospitalId,
                "SearchText": text || '',
                "IsFrequent": "Y",
                "PageSize": 10,
                "PageNumber": 1

            };
            if (text != "") {
                params.IsFrequent = "N";
            }
            return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
                if (resp.data.rows.length !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }

            });
        };
        $scope.getParticularSigMedicationitems = function (text, item) {
            text = text || '';
            var params = {
                "MedicineId": item.MedicationId,
                "OrganizationId": $scope.HospitalId,
                "SearchText": text || '',
                "IsFrequent": "N",
                "PageSize": 10,
                "PageNumber": 1
            };
            if (text != "") {
                params.IsFrequent = "N";
            }
            return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
                if (resp.data.rows.length !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }

            });

        };

        $scope.adnewsigobj = {
            "IsNewSig": false,
            "MedicineId": 0,
        }
        $scope.AddNewMedicineIdchange = function (item) {
            $scope.adnewsigobj.MedicineId = item.MedicationId || 0;
            $scope.adnewsigobj.IsNewSig = !$scope.adnewsigobj.IsNewSig;
        }
        function getnewOrganizationSigObj() {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationSigTemplateId": 0,
                "OrganizationId": $scope.HospitalId,
                "Sig": "",
                "ActionId": "",
                "Action": "",
                "DoseId": "",
                "Dose": "",
                "DoseUnitId": "",
                "DoseUnit": "",
                "RouteId": "",
                "Route": "",
                "FrequencyId": "",
                "Frequency": "",
                "DoseOtherId": "",
                "DoseOther": "",
                "DaysSupplyId": "",
                "DaysSupply": "",
                "Quantity": "",
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "DeleteInd": "N",
                "IsFrequent": "N",
                "PageSize": 10,
                "PageNumber": 1,
                "MedicineId": $scope.adnewsigobj.MedicineId || 0,
            };

            return obj;
        }


        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();

        $scope.changePopupPrescAction = function (mainobj) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
            if (filteredArray.length > 0) {
                mainobj.Action = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.changePopupPrescDose = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
            if (filteredArray.length > 0) {
                mainobj.Dose = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.changePopupPrescDoseUnit = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
            if (filteredArray.length > 0) {
                mainobj.DoseUnit = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.changePopupPrescRoute = function (mainobj) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
            if (filteredArray.length > 0) {
                mainobj.Route = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.changePopupPrescFrequency = function (mainobj) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
            if (filteredArray.length > 0) {
                mainobj.Frequency = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.changePopupPrescDoseOther = function (mainobj) {
            var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
            if (filteredArray.length > 0) {
                mainobj.DoseOther = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.changePopupPrescDaysSupply = function (mainobj) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                mainobj.DaysSupply = filteredArray[0].Code;
            };
            $scope.addSIgNameDynamically();
        };

        $scope.addSIgNameDynamically = function () {
            var dosesupplytest = "";
            if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
                dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupply;
            }
            $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
        }


        $scope.changePopupPrescQuantityUnit = function (mainobj) {
            var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
            if (filteredArray.length > 0) {
                mainobj.QuantityUnit = filteredArray[0].Code;
            };
        };

        $scope.changePopupPrescRefill = function (mainobj) {
            var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
            if (filteredArray.length > 0) {
                mainobj.Refills = filteredArray[0].Code;
            };
        };

        $scope.OnOrdersInvestigationItem = function (InvObject) {

            if (InvObject.ProcedureId === '') {
                InvObject.InvestigationName = '';
                return false;
            }
            InvObject = InvObject || "";
            if (InvObject === "") {
                return;
            }

            var obj = {
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": 1,
                "OrderType": "Investigation",
                "Description": InvObject.ProcedureName,
                "DescriptionId": InvObject.ProcedureId,
                "OrgInvestigationId": InvObject.OrganizationProcedureId,
                "Remarks": InvObject.Notes || "",
                "OrganId": null,
                "OrganName": "",
                "BillingCode": InvObject.CPTCode || "",
                "BookingStatusId": "2",
                "ProcedureCode": InvObject.CPTCode || "",
                "StatusId": InvObject.StatusId ? InvObject.StatusId : "1",
                "DeleteInd": "N",
                "InvSpecialityId": InvObject.InvSpecialityId,
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "OrderScheduleDate": null,
                "DiagnosisList": [],
                "ReferralDoctorName": "",
                "PatientSurgeryId": "",
                "SurgeryListId": "",
                "GeneralCost": InvObject.GeneralCost,
                "TypeOfServiceId": InvObject.TypeOfServiceId,
                "ProcedureDescription": InvObject.ProcedureDescription,
                "OrgDescriptionId": InvObject.OrganizationProcedureId,
                "IsAllOrderspopoverInv": false,
                "ModalityId": InvObject.ModalityId || 1,
            }
            $scope.AssessmentplanpopupObj.OrdersInvestigationArray.push(obj);


            $scope.assonj.SearchOrdersProcedureObj = "";
        };

        $scope.OnOrdersProcedureItem = function (Subitem) {

            var item = Subitem;
            if (item.ProcedureId === '') {
                item.ProcedureName = '';
                return false;
            }

            item.SelectedProcedureObj = item;
            var obj = {
                "PatientProcedureId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": 2,
                "OrderType": "Procedure",
                "Description": item.SelectedProcedureObj.ProcedureName,
                "ProcedureName": item.SelectedProcedureObj.ProcedureName,
                "ProcedureId": item.SelectedProcedureObj.ProcedureId,
                "DescriptionId": item.SelectedProcedureObj.ProcedureId,
                "OrgDescriptionId": item.SelectedProcedureObj.OrganizationProcedureId,
                "Remarks": item.SelectedProcedureObj.ProcedureNotes || "",
                "OrganId": null,
                "OrganName": "",
                "BillingCode": item.SelectedProcedureObj.CPTCode || "", // item.SelectedProcedureObj.BillingCode || "",
                "BookingStatusId": "2",
                "CPTCode": item.SelectedProcedureObj.CPTCode || "",
                "StatusId": "",
                "DeleteInd": "N",
                "InvSpecialityId": "",
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "DiagnosisList": [],
                "ReferralDoctorName": "",
                "PatientSurgeryId": "",
                "SurgeryListId": "",
                "ProcedureCode": item.SelectedProcedureObj.CPTCode, //item.SelectedProcedureObj.ProcedureCode
                "GeneralCost": item.SelectedProcedureObj.GeneralCost,
                "TypeOfServiceId": item.SelectedProcedureObj.TypeOfServiceId,
                "ProcedureDescription": item.SelectedProcedureObj.ProcedureDescription,
                "IsAllOrderspopoverprocedure": false,
            }
            $scope.AssessmentplanpopupObj.OrdersProcedureArray.push(obj);

            $scope.assonj.SearchOrdersProcedureObj = "";
        };

        $scope.OnOrdersSurgeryItem = function (item) {
            item = item || "";
            if (item === "") {
                return;
            }

            if (item.ProcedureId === '') {
                item.ProcedureName = '';
                return false;
            }

            var obj = {
                "PatientOrderId": 0,
                "SpecializationId": $scope.SpecializationId,
                "OrderTypeId": 3,
                "OrderType": "Surgery",
                "Description": item.ProcedureName,
                "DescriptionId": item.ProcedureId,
                "OrgSurgeryId": item.OrganizationProcedureId,
                "Remarks": item.Notes || "",
                "OrganId": 0,
                "OrganName": GetEyeName(0),
                "BookingStatusId": "2",
                "StatusId": item.SurgeryStatusId || 1,
                "DeleteInd": "N",
                "InvSpecialityId": "",
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "DiagnosisList": [],
                "ReferralDoctorName": "",
                "PatientSurgeryId": 0,
                "SurgeryListId": 0,
                "InternalCoManagerId": null,
                "CoordinatorId": null,
                "ExternalCoManagerId": null,
                "ProcedureCode": item.CPTCode, //item.ProcedureCode
                "GeneralCost": item.GeneralCost || 0,
                "TypeOfServiceId": item.TypeOfServiceId,
                "ProcedureDescription": item.ProcedureDescription,
                "SurgerySuggestedDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "OrgDescriptionId": item.OrganizationProcedureId,
                "IsAllOrderspopoverSurg": false
            }
            $scope.AssessmentplanpopupObj.OrdersSurgeryArray.push(obj);

            $scope.assonj.SearchOrdersProcedureObj = '';

        };

        $scope.OnClickAdvisedProcedureInOrders = function (Subitem) {

            if (Subitem.OrderTypeId == 1) {
                $scope.OnOrdersInvestigationItem(Subitem);
            }
            if (Subitem.OrderTypeId == 2) {
                $scope.OnOrdersProcedureItem(Subitem);

            }
            if (Subitem.OrderTypeId == 3) {
                $scope.OnOrdersSurgeryItem(Subitem);

            }
        }
        $scope.OnClickAllOrdersReferralSearch = function (item) {

            var object = {
                "PatientReferralDetailId": 0,
                "PatientOrderId": 0,
                "SpecializationId": $scope.Referralobj.SpecializationId || "",
                "Remarks": "",
                "Type": $scope.Referralobj.Type,
                "DeleteInd": "N",
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "ReferralDoctorName": $scope.Referralobj.referralDoctorName || "",
                "ReferralDoctorId": $scope.Referralobj.referralDoctorId || null,
                "SpecializationName": $scope.Referralobj.SpecializationName || "",
                "Alarm": "",
                "ShowDateFormat": true,
                "IsUrgency": false,
                "IsFollowUpAfterReferral": false,
                "IsIncludeInCaseHistory": false,
                "DurationDate": null,
                "Duration": "",
                "ReferralImageArray": [],
                "DiagnosisList": [],
                "ReferralReason": "",
                "DurationType": "",
                "ReferralId": item.ReferralId,
                "Referral": item.Referral || "",
            };
            var i = 0;

            $scope.AssessmentplanpopupObj.ReferralDetails = $scope.AssessmentplanpopupObj.ReferralDetails || [];
            if ($scope.AssessmentplanpopupObj.ReferralDetails.length > 0) {
                angular.forEach($scope.AssessmentplanpopupObj.ReferralDetails, function (initem) {
                    if (item.ReferralId == initem.ReferralId && initem.DeleteInd == 'N') {
                        alertify.error('You already entered this Referral');
                        i++;
                    }
                });
            };

            if (i === 0) {
                $scope.AssessmentplanpopupObj.ReferralDetails.push(object);

            }

            $scope.assonj.SearchReferralObj = '';

        };

        $scope.SaveOrganizationSig = function (item) {
            console.log($scope.addNewOrganizationSigObj);
            if ($scope.addNewOrganizationSigObj.Sig == '') {
                alertify.error("Please Enter Sig");
                return false;
            }

            if ($scope.addNewOrganizationSigObj.IsFrequent == true) {
                $scope.addNewOrganizationSigObj.IsFrequent = "Y";
            }
            item = item || ""
            if (item != "") {
                item.ActionId = $scope.addNewOrganizationSigObj.ActionId || null;
                item.Action = $scope.addNewOrganizationSigObj.Action || '';
                item.Dose = $scope.addNewOrganizationSigObj.Dose || '';
                item.DoseUnit = $scope.addNewOrganizationSigObj.DoseUnit || '';
                item.Route = $scope.addNewOrganizationSigObj.Route || '';
                item.Frequency = $scope.addNewOrganizationSigObj.Frequency || '';
                item.DoseOther = $scope.addNewOrganizationSigObj.DoseOther || '';
                item.DaysSupply = $scope.addNewOrganizationSigObj.DaysSupply || '';
                item.QuantityUnit = $scope.addNewOrganizationSigObj.QuantityUnit || '';
                item.DoseId = $scope.addNewOrganizationSigObj.DoseId || null;
                item.DoseUnitId = $scope.addNewOrganizationSigObj.DoseUnitId || null;
                item.RouteId = $scope.addNewOrganizationSigObj.RouteId || null;
                item.FrequencyId = $scope.addNewOrganizationSigObj.FrequencyId || null;
                item.DoseOtherId = $scope.addNewOrganizationSigObj.DoseOtherId || null;
                item.DaysSupplyId = $scope.addNewOrganizationSigObj.DaysSupplyId || null;
                item.Quantity = $scope.addNewOrganizationSigObj.Quantity || null;
                item.QuantityUnitId = $scope.addNewOrganizationSigObj.QuantityUnitId || null;
                item.RefillId = $scope.addNewOrganizationSigObj.RefillId || null;
                item.Refills = $scope.addNewOrganizationSigObj.Refills || null;
                item.SigObj = $scope.addNewOrganizationSigObj.Sig;
                item.SigId = $scope.addNewOrganizationSigObj.OrganizationSigTemplateId;
            }
            if (item.SigObj == "") {
                var dosesupplytest = "";
                if (item.DaysSupply !== '') {
                    dosesupplytest = " for " + item.DaysSupply;
                }
                item.SigObj = item.Action + " " + item.Dose + " " + item.DoseUnit + " " + item.Route + " " + item.Frequency + " " + item.DoseOther + "" + dosesupplytest;
            }
            eHnotePatientDataService.AddUpdateOrganizationMedicationSig($scope.addNewOrganizationSigObj, OnAddSigSuccess, OnAddSigError);
            function OnAddSigSuccess(response) {
                alertify.success("Sig Added  Successfully");

                $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();

                $scope.adnewsigobj.IsNewSig = false;


            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
        };


        $scope.clearOrganizationSiginput = function () {
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
        };
        $scope.AdditionaldiagnosisaddedReferral = function (mitem, type) {
            $scope.NewReferralDetailsArray = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "IsCheckedDiagnosis": true }, true);
            if (type == 'Referral') {
                var obj = angular.copy(mitem);
                angular.forEach($scope.NewReferralDetailsArray, function (item) {
                    if (item.ReferralArray.length > 0) {
                        var list = $filter("filter")(item.ReferralArray, { "ReferralId": obj.ReferralId, 'DeleteInd': 'N' }, true) || [];
                        if (list.length == 0) {
                            obj.PatientReferralDetailId = 0;
                            item.ReferralArray.push(obj);
                        }
                    } else {
                        obj.PatientReferralDetailId = 0;
                        item.ReferralArray.push(obj);
                    }

                    $scope.AssessmentplanpopupObj.ReferralDetails = $filter("filter")($scope.AssessmentplanpopupObj.ReferralDetails, { "DeleteInd": 'N' }, true) || [];
                    if ($scope.AssessmentplanpopupObj.ReferralDetails.length > 0) {
                        angular.forEach($scope.AssessmentplanpopupObj.ReferralDetails, function (pitem) {
                            pitem.DiagnosisList = pitem.DiagnosisList || [];
                            var list = [];
                            list = $filter("filter")(pitem.DiagnosisList, { "DiagnosisId": item.DiagnosisId }, true) || [];
                            if (list.length == 0) {
                                var obj1 = {
                                    "DiagnosisDetailId": 0,
                                    "DiagnosisId": item.DiagnosisId,
                                    "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                                    "DiagnosisName": item.DiagnosisName,
                                    "ICDCode": item.ICD10CODE,
                                    "ActiveInd": "Y"
                                };
                                pitem.DiagnosisList.push(obj1);
                            }
                        });
                    }

                });
            }
            mitem.IsAddDiagnosisinRefSavePopOver = false;

        }


        $scope.NewInvestDetailsArray = [];
        $scope.Investemptyrray = [];

        $scope.additionaldiagnosisInvestigationadded = function (mitem, type) {
            $scope.Investemptyrray.push(mitem);
            $scope.NewInvestDetailsArray = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "IsCheckedDiagnosis": true }, true);
            if (type == 'Investigation') {
                var obj = angular.copy(mitem);
                angular.forEach($scope.NewInvestDetailsArray, function (item) {
                    if (item.InvestigationsArray.length > 0) {
                        var list = $filter("filter")(item.InvestigationsArray, { "InvestigationId": obj.InvestigationId, "OrgInvestigationId": obj.OrgInvestigationId, 'DeleteInd': 'N' }, true) || [];
                        if (list.length == 0) {
                            obj.PatientInvestigationId = 0;
                            item.InvestigationsArray.push(obj);
                        }
                    } else {
                        obj.PatientInvestigationId = 0;
                        item.InvestigationsArray.push(obj);
                    }
                    $scope.AssessmentplanpopupObj.OrdersInvestigationArray = $scope.AssessmentplanpopupObj.OrdersInvestigationArray || [];
                    if ($scope.AssessmentplanpopupObj.OrdersInvestigationArray.length > 0) {
                        angular.forEach($scope.AssessmentplanpopupObj.OrdersInvestigationArray, function (pitem) {
                            var list = [];
                            if (pitem.DeleteInd == 'N') {
                                list = $filter("filter")(pitem.DiagnosisList, { "DiagnosisId": item.DiagnosisId }, true) || [];
                                if (list.length == 0) {
                                    var obj1 = {
                                        "DiagnosisDetailId": 0,
                                        "DiagnosisId": item.DiagnosisId,
                                        "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                                        "DiagnosisName": item.DiagnosisName,
                                        "ICDCode": item.ICD10CODE,
                                        "ActiveInd": "Y"
                                    };
                                    pitem.DiagnosisList.push(obj1);
                                }
                            }
                        });
                    }
                });

            }
            mitem.IsAddDiagnosisinInvSavePopOver = false;

        }

        $scope.NewSurgeryDetailsArray = [];
        $scope.emptyrray = [];
        $scope.additionaldiagnosisaddedSurgery = function (mainitem, type) {
            $scope.emptyrray.push(mainitem);
            $scope.NewSurgeryDetailsArray = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "IsCheckedDiagnosis": true }, true);

            if (type == 'Surgery') {
                var obj = angular.copy(mainitem);
                angular.forEach($scope.NewSurgeryDetailsArray, function (item) {
                    if (item.SurgeryArray.length > 0) {
                        var list = $filter("filter")(item.SurgeryArray, { "SurgeryId": obj.SurgeryId, "OrgSurgeryId": obj.OrgSurgeryId, 'DeleteInd': 'N' }, true) || [];
                        if (list.length == 0) {
                            obj.PatientSurgeryId = 0;
                            item.SurgeryArray.push(obj);
                        }

                    } else {
                        obj.PatientSurgeryId = 0;
                        item.SurgeryArray.push(obj);
                    }

                    $scope.AssessmentplanpopupObj.OrdersSurgeryArray = $scope.AssessmentplanpopupObj.OrdersSurgeryArray || [];
                    if ($scope.AssessmentplanpopupObj.OrdersSurgeryArray.length > 0) {
                        angular.forEach($scope.AssessmentplanpopupObj.OrdersSurgeryArray, function (pitem) {
                            var list = [];
                            if (pitem.DeleteInd == 'N') {
                                list = $filter("filter")(pitem.DiagnosisList, { "DiagnosisId": item.DiagnosisId }, true) || [];
                                if (list.length == 0) {
                                    var obj1 = {
                                        "DiagnosisDetailId": 0,
                                        "DiagnosisId": item.DiagnosisId,
                                        "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                                        "DiagnosisName": item.DiagnosisName,
                                        "ICDCode": item.ICD10CODE,
                                        "ActiveInd": "Y"
                                    };
                                    pitem.DiagnosisList.push(obj1);
                                }
                            }
                        });
                    }
                });
            }

            mainitem.IsAddDiagnosisinSurgSavePopOver = false;

        }

        $scope.NewProcedureDetailsArray = [];
        $scope.Procedureemptyrray = [];
        $scope.additionaldiagnosisaddedProcedure = function (mitem, type) {
            $scope.Procedureemptyrray.push(mitem);
            $scope.NewProcedureDetailsArray = $filter("filter")($scope.AssessmentplanpopupObj.AssessmentListArray, { "IsCheckedDiagnosis": true }, true);
            if (type == 'Procedure') {
                var obj = angular.copy(mitem);
                angular.forEach($scope.NewProcedureDetailsArray, function (item) {
                    if (item.ProceduresArray.length > 0) {
                        var list = $filter("filter")(item.ProceduresArray, { "ProcedureId": obj.ProcedureId, "OrgProcedureId": obj.OrgProcedureId, 'DeleteInd': 'N' }, true) || [];
                        if (list.length == 0) {
                            obj.PatientProcedureId = 0;
                            item.ProceduresArray.push(obj);
                        }

                    } else {
                        obj.PatientProcedureId = 0;
                        item.ProceduresArray.push(obj);
                    }
                    $scope.AssessmentplanpopupObj.OrdersProcedureArray = $scope.AssessmentplanpopupObj.OrdersProcedureArray || [];
                    if ($scope.AssessmentplanpopupObj.OrdersProcedureArray.length > 0) {
                        angular.forEach($scope.AssessmentplanpopupObj.OrdersProcedureArray, function (pitem) {
                            var list = [];
                            if (pitem.DeleteInd == 'N') {
                                list = $filter("filter")(pitem.DiagnosisList, { "DiagnosisId": item.DiagnosisId }, true) || [];
                                if (list.length == 0) {
                                    var obj1 = {
                                        "DiagnosisDetailId": 0,
                                        "DiagnosisId": item.DiagnosisId,
                                        "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                                        "DiagnosisName": item.DiagnosisName,
                                        "ICDCode": item.ICD10CODE,
                                        "ActiveInd": "Y"
                                    };
                                    pitem.DiagnosisList.push(obj1);
                                }
                            }
                        });
                    }
                });
            }
            mitem.IsAddDiagnosisinProcSavePopOver = false;

        }
        $scope.ChangeReferalType = function (refitem, Mitem) {
            if ($scope.Assesmenttab == 1) {
                $scope.Referralobj.referralDoctorObj = '';
                Mitem.Type = refitem.Type || 'Internal';
            } else {
                $scope.Referralobj.IsnewProvider = false;
                $scope.Referralobj.SubSpecializationObj = "";
                $scope.Referralobj.referralDoctorObj = "";
                Mitem.Type = refitem.Type || "Internal";
                getBranchSpecializations(0, $scope.HospitalId);
            }
        };

        $scope.DelectAssReferral = function (obs, mainitem) {

            var index = mainitem.ReferralArray.indexOf(obs);
            if (obs.PatientReferralDetailId == 0) {
                if (index > -1) {
                    mainitem.ReferralArray.splice(index, 1);
                }
            } else {
                mainitem.ReferralArray[index].DeleteInd = 'Y';
            }

            $scope.cacheStorageItem.ReferralDetails = $scope.cacheStorageItem.ReferralDetails || [];
            if ($scope.cacheStorageItem.ReferralDetails.length !== 0) {


                var List = $filter("filter")($scope.cacheStorageItem.ReferralDetails, function (assitem, index) { return assitem.ReferralDoctorId == obs.ReferralDoctorId },);
                if (List.length !== 0) {
                    if (List[0].ReferralDoctorId == obs.ReferralDoctorId) {

                        List[0].DeleteInd = 'Y';
                    }

                }

            }


        };
        $scope.changereferalSubSpecialization = function (item) {
            item = item || "";
            if (item == "") {
                $scope.Referralobj.SubSpecializationId = "";
                $scope.Referralobj.SpecializationId = "";
                $scope.Referralobj.SpecializationName = "";
                return false;
            }
            $scope.Referralobj.SubSpecializationId = item.SubSpecializationId;
            $scope.Referralobj.SpecializationId = item.SpecializationId;
            $scope.PCPObj.SpecializationId = item.SpecializationId;

            $scope.Referralobj.referralDoctorObj = "";
        }


        $scope.changeRDiagnosisStatus = function (item, id) {

            var DiagnosisststusList = $filter("filter")($scope.AssesmentPlanStatusList, function (iterator) { return iterator.AssesmentPlanStatusID === id; });
            item.StatusList[0].DiagnosisStatusId = id
            item.StatusList[0].DiagnosisStatus = DiagnosisststusList[0].AssesmentPlanStatus || '';

            if (item.StatusList[0].DiagnosisStatusId == 2 || item.StatusList[0].DiagnosisStatusId == 3 || item.StatusList[0].DiagnosisStatusId == 4) {

                item.StatusList[0].VerificationStatusId = 4;
                item.StatusList[0].EndDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }

            if (item.StatusList[0].DiagnosisStatusId == 1) {

                item.StatusList[0].VerificationStatusId = 2;
                item.StatusList[0].EndDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }

            if (item.StatusList[0].DiagnosisStatusId == 5) {

                item.StatusList[0].VerificationStatusId = 5;
                item.StatusList[0].EndDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }

            if (item.StatusList[0].DiagnosisStatusId == 7) {

                item.StatusList[0].VerificationStatusId = 6;
                item.StatusList[0].EndDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }
            if (item.StatusList[0].DiagnosisStatusId == 4 || item.StatusList[0].DiagnosisStatusId == 5) {
                item.StatusList[0].EndDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }
            item.StatusList[0].EndDate = null;
        }

        $scope.changeLDiagnosisStatus = function (item, id) {

            var DiagnosisststusList = $filter("filter")($scope.AssesmentPlanStatusList, function (iterator) { return iterator.AssesmentPlanStatusID === id; });
            item.StatusList[1].DiagnosisStatusId = id
            item.StatusList[1].DiagnosisStatus = DiagnosisststusList[0].AssesmentPlanStatus || '';

            if (item.StatusList[1].DiagnosisStatusId == 2 || item.StatusList[1].DiagnosisStatusId == 3 || item.StatusList[1].DiagnosisStatusId == 4) {

                item.StatusList[1].VerificationStatusId = 4;
                item.StatusList[1].EndDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
            if (item.StatusList[1].DiagnosisStatusId == 1) {

                item.StatusList[1].VerificationStatusId = 2;
                item.StatusList[1].EndDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
            if (item.StatusList[1].DiagnosisStatusId == 5) {

                item.StatusList[1].VerificationStatusId = 5;
                item.StatusList[1].EndDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
            if (item.StatusList[1].DiagnosisStatusId == 7) {

                item.StatusList[1].VerificationStatusId = 6;
                item.StatusList[1].EndDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
            if (item.StatusList[1].DiagnosisStatusId == 4 || item.StatusList[1].DiagnosisStatusId == 5) {
                //  item.LResolvedDate = $filter('date')(new Date(), "yyyy-MM-dd");
                item.StatusList[1].EndDate = $filter('date')(new Date(), "yyyy-MM-dd");
            }
            item.StatusList[1].EndDate = null;
        }

        $scope.ChangeProcedureStatus = function (Aitem) {
            var List = $filter("filter")($scope.GetProcedureStatusList, function (pitem, index) { return pitem.StatusId == Aitem.StatusId; });
            Aitem.Status = List[0].Status || "Active";
        };

        //ORDERS tab START
        $scope.ContentButtonShowActiveReferral = false;
        $scope.ContentButtonShowActiveProcedure = false;
        $scope.ContentButtonShowActiveSurgery = false;
        $scope.ContentButtonShowInvestigation = false;


        var FinalObj = FinalObj || ""
        $scope.Referralobj.FinalObj = FinalObj || "Investigations";
        $scope.ReloadOrdertab = function () {
            $scope.AdvisedOrderDetailsArray = [];
            $scope.cacheStorageItem.InvestigationsDetails = $scope.cacheStorageItem.InvestigationsDetails || [];
            $scope.cacheStorageItem.SurgeriesDetails = $scope.cacheStorageItem.SurgeriesDetails || [];
            $scope.cacheStorageItem.ProceduresDetails = $scope.cacheStorageItem.ProceduresDetails || [];
            $scope.cacheStorageItem.ReferralDetails = $scope.cacheStorageItem.ReferralDetails || [];
            $scope.cacheStorageItem.InvestigationResults = $scope.cacheStorageItem.InvestigationResults || [];

            if ($scope.cacheStorageItem.InvestigationsDetails.length !== 0) {
                angular.forEach($scope.cacheStorageItem.InvestigationsDetails, function (item) {
                    item.OrderType = "Investigations"
                    item.AdvicedInvestigationId = item.PatientInvestigationId || 0;
                    item.DurationDate = item.DurationDate || null;
                    item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                    if (item.DurationDate !== null) {
                        item.ShowDateFormat = true;
                    } else {
                        item.ShowDateFormat = false;
                    }
                    if (item.DiagnosisList.length > 0) {
                        angular.forEach(item.DiagnosisList, function (Ditem) {
                            Ditem.Diagnosis = true;
                        });
                    }
                    item.OrganId = item.OrganId || '1';
                    item.OrganId = item.OrganId.toString();
                    $scope.AdvisedOrderDetailsArray.push(item);
                });
            }
            if ($scope.cacheStorageItem.SurgeriesDetails.length !== 0) {
                angular.forEach($scope.cacheStorageItem.SurgeriesDetails, function (item) {
                    item.OrderType = "Surgery"
                    item.DurationDate = item.DurationDate || null;
                    item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                    if (item.DurationDate !== null) {
                        item.ShowDateFormat = true;
                    } else {
                        item.ShowDateFormat = false;
                    }
                    if (item.DiagnosisList.length > 0) {
                        angular.forEach(item.DiagnosisList, function (Ditem) {
                            Ditem.Diagnosis = true;
                        });
                    }
                    item.OrganId = item.OrganId || '1';
                    item.OrganId = item.OrganId.toString();
                    $scope.AdvisedOrderDetailsArray.push(item);
                });
            }
            if ($scope.cacheStorageItem.ProceduresDetails.length !== 0) {
                angular.forEach($scope.cacheStorageItem.ProceduresDetails, function (item) {
                    item.OrderType = "Procedure"
                    item.DurationDate = item.DurationDate || null;
                    item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                    if (item.DurationDate !== null) {
                        item.ShowDateFormat = true;
                    } else {
                        item.ShowDateFormat = false;
                    }
                    if (item.DiagnosisList.length > 0) {
                        angular.forEach(item.DiagnosisList, function (Ditem) {
                            Ditem.Diagnosis = true;
                        });
                    }
                    item.OrganId = item.OrganId || '1';
                    item.OrganId = item.OrganId.toString();
                    $scope.AdvisedOrderDetailsArray.push(item);
                });
            }

            if ($scope.cacheStorageItem.ReferralDetails.length !== 0) {
                angular.forEach($scope.cacheStorageItem.ReferralDetails, function (item) {
                    item.OrderType = "Referral";
                    item.OrderTypeId = 4;
                    item.Description = item.Referral || '';
                    item.DurationDate = item.DurationDate || null;
                    item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy');
                    if (item.DurationDate !== null) {
                        item.ShowDateFormat = true;
                    } else {
                        item.ShowDateFormat = false;
                    }
                    if (item.DiagnosisList.length > 0) {
                        angular.forEach(item.DiagnosisList, function (Ditem) {
                            Ditem.Diagnosis = true;
                        });
                    }
                    $scope.AdvisedOrderDetailsArray.push(item);
                });
            }
            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });
                var tempAdvisedOrder = [];
                if (obj != undefined) {
                    if ($scope.Referralobj.FinalObj == "Referral") {
                        tempAdvisedOrder = $filter("filter")($scope.AdvisedOrderDetailsArray, function (advitem, index) { return advitem.DeleteInd == "N" && advitem.OrderType == $scope.Referralobj.FinalObj && advitem.ReferralDoctorId == obj.ReferralDoctorId });
                    } else {
                        tempAdvisedOrder = $filter("filter")($scope.AdvisedOrderDetailsArray, function (advitem, index) { return advitem.DeleteInd == "N" && advitem.OrderType == $scope.Referralobj.FinalObj && advitem.DescriptionId == obj.DescriptionId });
                    }
                } else {
                    tempAdvisedOrder = $filter("filter")($scope.AdvisedOrderDetailsArray, function (advitem, index) { return advitem.DeleteInd == "N" && advitem.OrderType == $scope.Referralobj.FinalObj });
                }
                if (tempAdvisedOrder.length !== 0) {
                    tempAdvisedOrder[0].IsEditData = true;
                } else {

                }

                if ($scope.AdvisedOrderDetailsArray[0].OrderType == "Referral") {
                    $scope.Referralobj.FinalObj = "Referral";
                }
            }
            if ($scope.AdvisedOrderDetailsArray.length > 0) {

                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });

                if ($scope.Referralobj.FinalObj == 'Investigations') {
                    var SubOrdersArray = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 1; });
                    if (SubOrdersArray.length > 0) {
                        SubOrdersArray[0].IsEditData = true;
                        $scope.ContentButtonShowInvestigation = true;
                    }

                }
                else if ($scope.Referralobj.FinalObj == 'Procedure') {
                    var SubOrdersArray1 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 2; });
                    if (SubOrdersArray1.length > 0) {
                        SubOrdersArray1[0].IsEditData = true;
                        $scope.ContentButtonShowActiveProcedure = true;
                    }

                }
                else if ($scope.Referralobj.FinalObj == 'Surgery') {
                    var SubOrdersArray2 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 3; });
                    if (SubOrdersArray2.length > 0) {
                        SubOrdersArray2[0].IsEditData = true;
                        $scope.ContentButtonShowActiveSurgery = true;
                    }

                }
                else if ($scope.Referralobj.FinalObj == 'Referral') {
                    var SubOrdersArray3 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator, ind) { return iterator.DeleteInd === 'N' && iterator.OrderTypeId == 4; });
                    if (SubOrdersArray3.length > 0) {
                        SubOrdersArray3[0].IsEditData = true;
                        $scope.ContentButtonShowActiveReferral = true;
                    }
                } else {

                }

                if ($scope.ContentButtonShowInvestigation == false && $scope.ContentButtonShowActiveProcedure == false && $scope.ContentButtonShowActiveSurgery == false && $scope.ContentButtonShowActiveReferral == false) {
                    var SubOrdersArray4 = $filter("filter")($scope.AdvisedOrderDetailsArray, function (iterator) { return iterator.DeleteInd === 'N' });
                    if (SubOrdersArray4.length > 0) {
                        SubOrdersArray4[0].IsEditData = true;
                        if (SubOrdersArray4[0].OrderTypeId == 1) {
                            $scope.ContentButtonShowInvestigation = true;
                        } else if (SubOrdersArray4[0].OrderTypeId == 2) {
                            $scope.ContentButtonShowActiveProcedure = true;
                        }
                        else if (SubOrdersArray4[0].OrderTypeId == 3) {
                            $scope.ContentButtonShowActiveSurgery = true;
                        }
                        else if (SubOrdersArray4[0].OrderTypeId == 4) {
                            $scope.ContentButtonShowActiveReferral = true;
                        }
                    }
                }
            }
            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                    if ($scope.cacheStorageItem.AssessmentPlan.length > 0) {
                        angular.forEach($scope.cacheStorageItem.AssessmentPlan, function (Aitem) {
                            //var i = 0;
                            //var List = 0;
                            //if (Aitem.StatusList.length > 0) {
                            //    List = $filter("filter")(Aitem.StatusList, function (FAitem) { return FAitem.DiagnosisStatusId == 2 },);
                            //    if (List.length > 0) {
                            //        i++;
                            //    }
                            //}
                            //if (i > 0) {
                            var obj = {
                                "ActiveInd": "Y",
                                "DiagnosisDetailId": 0,
                                "DiagnosisId": Aitem.DiagnosisId,
                                "DiagnosisName": Aitem.ICD10DIAGNAME,
                                "ICDCode": Aitem.ICD10CODE,
                                "Diagnosis": false
                            }
                            item.DiagnosisList = item.DiagnosisList || [];
                            var List1 = 0;
                            List1 = $filter("filter")(item.DiagnosisList, function (Ditem) { return Ditem.DiagnosisId == Aitem.DiagnosisId },);
                            if (List1.length == 0) {
                                item.DiagnosisList.push(obj);
                            }
                            /*}*/
                            if (item.DiagnosisList.length > 0) {
                                angular.forEach(item.DiagnosisList, function (dAitem) {
                                    if (dAitem.DiagnosisId == Aitem.DiagnosisId) {
                                        dAitem.Diagnosis = true;
                                    } else {
                                        dAitem.Diagnosis = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        $scope.ReloadOrdertab();
        $scope.OnClickAdvisedReferal = function (mainitem) {
            $scope.AdvisedOrderDetailsArray = $scope.AdvisedOrderDetailsArray || [];
            if ($scope.AdvisedOrderDetailsArray.length > 0) {
                var filterProcedure = $filter("filter")($scope.AdvisedOrderDetailsArray, function (Aitem, index) { return Aitem.ReferralId == mainitem.ReferralId && Aitem.DeleteInd == 'N' },);
                if (filterProcedure.length > 0) {
                    $scope.adviseObj.SearchReferalObj = "";
                    alertify.error("Already Added This Referral");
                    return false;
                }
            }

            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });
            }
            $scope.adviseObj.SearchReferalObj = "";

            var obj = {
                "PatientOrderId": 0,
                "PatientReferralDetailId": 0,
                "SpecializationId": 0,
                "Remarks": "",
                "DeleteInd": "N",
                "OrderDate": $filter("date")(new Date(), "MM-dd-yyyy h:mm a") || "",
                "ReferralDoctorName": "",
                "ReferralDoctorId": 0,
                "SpecializationName": "",
                "Alarm": "",
                "IsUrgency": false,
                "IsFollowUpAfterReferral": false,
                "IsIncludeInCaseHistory": false,
                "DurationDate": "",
                "Duration": "",
                "ReferralReason": "",
                "DurationType": "",
                "DiagnosisList": [],
                "IsEditData": true,
                "FinalObj": "Referral",
                "OrderType": 'Referral',
                "OrderTypeId": 4,
                "Description": mainitem.Referral || "",
                "ReferralId": mainitem.ReferralId,
                "Referral": mainitem.Referral || "",
                "ShowDateFormat": true,
                "DurationDate": '',
                "referralDoctorObj": "",
                "Type": "Internal"
            }
            $scope.AdvisedOrderDetailsArray.push(obj);
            $scope.Referralobj.FinalObj = obj.OrderType;
            $scope.Referralobj.OrderTypeId = obj.OrderTypeId;

            $scope.Referralobj.IsnewProvider = false;
            $scope.Referralobj.Type = 'Internal';
            $scope.Referralobj.SpecializationObj = '';
            $scope.Referralobj.referralDoctorObj = '';

            $scope.ContentButtonShowActiveReferral = true;
            $scope.ContentButtonShowActiveProcedure = false;
            $scope.ContentButtonShowActiveSurgery = false;
            $scope.ContentButtonShowInvestigation = false;
        };


        $scope.ChangeAdvisedOrder = function (mainitem) {
            angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                item.IsEditData = false;
            });

            if (mainitem.ReferralId == 14) {
                $scope.Referralobj.referralDoctorObj = mainitem.ReferralDoctorName;
            }
            mainitem.IsEditData = true;

            if ($scope.AddDiagnosisAssesmentPlanArray.length > 0) {
                angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (item) {
                    item.IsCheckedDiagnosis = false;
                });

                if ($scope.AdvisedOrderDetailsArray.length > 0) {
                    if (mainitem.DiagnosisList.length > 0) {
                        angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (Aitem) {
                            angular.forEach($scope.AdvisedOrderDetailsArray[0].DiagnosisList, function (Bitem) {
                                if (Aitem.DiagnosisId == Bitem.DiagnosisId) {
                                    Aitem.IsCheckedDiagnosis = true;
                                }

                            });
                        });
                    }
                }
            }

            //$scope.Referralobj.FinalObj = mainitem.OrderType;

            $scope.Referralobj.IsAddResult = false;
        }
        $scope.ChangeItem = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = null;
            } else {
                item.Duration = "";
                item.DurationType = "";
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };
        $scope.SearchPCPDOClist = function (val, typeId, item) {
            var reqObj = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 1000,
                'SearchTaxt': val || "",
                "SpecializationId": $scope.SpecializationId || null,
                "DeleteInd": 'N',
                "OrganizationId": $scope.HospitalId || 0,
                "RefaralTypeId": typeId || ""

            };
            $scope.Referralobj.SpecializationId = $scope.Referralobj.SpecializationId || "";
            if ($scope.Referralobj.SpecializationId !== "") {
                reqObj.SpecializationId = $scope.Referralobj.SpecializationId;
            }

            item.ReferralId = item.ReferralId || "";
            if (item.ReferralId === 14) {
                $scope.IsReferToHospitalsInd = true;
            } else {
                $scope.IsReferToHospitalsInd = false;
            }

            return eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
                if ($scope.IsReferToHospitalsInd) {
                    resp.data.PcpRefdetails = $filter("filter")(resp.data.PcpRefdetails, function (item) { return item.RefaralTypeId === 4; });
                } else {
                    resp.data.PcpRefdetails = $filter("filter")(resp.data.PcpRefdetails, function (item) { return item.RefaralTypeId === 1 || item.RefaralTypeId === 2; });
                }
                return resp.data.PcpRefdetails.map(function (item) {
                    return item;
                });

            });
        };
        $scope.onSelectAssesmentPlannewDiagnosiss = function (mainobject, Diagnosisitem) {

            if (Diagnosisitem.DiagnosisList.length > 0) {
                var filterdiagnosis = $filter("filter")(Diagnosisitem.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                if (filterdiagnosis.length > 0) {
                    mainobject = "";
                    $scope.adviseObj.DiagnosisObject = "";
                    alertify.error("Diagnosis Already Added");
                    return false;
                }
            }



            var obj = {
                "ActiveInd": "Y",
                "DiagnosisDetailId": mainobject.DiagnosisId || 0,
                "DiagnosisId": mainobject.DiagnosisId,
                "DiagnosisName": mainobject.DiagnosisName,
                "ICDCode": mainobject.ICD10CODE,
                "Diagnosis": true
            }

            Diagnosisitem.DiagnosisList.push(obj);
            $scope.adviseObj.DiagnosisObject = "";
        };
        $scope.onSelectAssesmentPlannewDiagnosis1 = function (object, Mainobj) {
            Mainobj.DiagnosisList = Mainobj.DiagnosisList || [];
            if (Mainobj.DiagnosisList.length > 0) {
                var filterdiagnosis = $filter("filter")(Mainobj.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == object.DiagnosisId }, true);
                if (filterdiagnosis.length > 0) {
                    Mainobj.DiagnosisObject = "";
                    alertify.error("Diagnosis Already Added");
                    return false;
                }
            }

            var obj = {
                "ActiveInd": "Y",
                "DiagnosisDetailId": object.DiagnosisId || 0,
                "DiagnosisId": object.DiagnosisId,
                "DiagnosisName": object.DiagnosisName,
                "ICDCode": object.ICD10CODE,
                "Diagnosis": true
            }

            Mainobj.DiagnosisList.push(obj);
            $scope.Referralobj.DiagnosisObject = "";
            Mainobj.DiagnosisObject = "";
        };

        $scope.uploadPatientFiles = function ($files, ritem) {
            $scope.patientfiles = $files;
            if ($scope.patientfiles === "" || $scope.patientfiles === null || $scope.patientfiles === undefined) {
                return;
            }


            var file = $scope.patientfiles;
            var fd = new FormData();
            $scope.cacheStorageItem.TreatmentPlanId = $scope.cacheStorageItem.TreatmentPlanId || 0;
            fd.append("UserID", eHnoteMasterDataService.getLoginId());
            fd.append("HospitalID", $scope.HospitalId);
            fd.append("PatientID", $scope.cacheStorageItem.patientid);
            fd.append("PatientName", $scope.cacheStorageItem.PatientName);
            fd.append("AppointmentID", $scope.cacheStorageItem.appointmentid);
            fd.append("TreatmentPlanId", $scope.cacheStorageItem.TreatmentPlanId);

            fd.append("Remarks", '');
            fd.append("SignedDate", $filter('date')(new Date(), "yyyy-MM-dd"));
            fd.append("OrgConsentFormId", 0);
            fd.append("FileTypeId", 10);
            fd.append("IsPartiallyUploaded", 'Y');
            fd.append("LabTestId", 0);
            fd.append("ShowNewConsultation", 'Y');
            angular.forEach(file, function (value, key) {
                fd.append(key, value);
            });


            eHnoteDiagnosisDataServices.addPatientUploadfile(fd, callbackfileuploadSuccess, callbackfileuploadError);
            function callbackfileuploadSuccess(resp) {
                ritem.ReferralImageArray = ritem.ReferralImageArray || [];
                $scope.TempFileUploadPdfArray = [];
                $('#noFile').html('No file chosen...');
                if (resp.PatientFiles !== undefined) {
                    if (resp.PatientFiles.length > 0) {
                        var filteredArray = $filter('filter')(resp.PatientFiles, { "IsPartiallyUploaded": true });
                        for (var i = 0; i < filteredArray.length; i++) {
                            if (filteredArray[i].FileTypeId == 10) {
                                $scope.docname = "";
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
                                    $scope.TempFileUploadPdfArray.push(filteredArray[i]);
                                } else {
                                    filteredArray[i].DeleteInd = false;
                                    ritem.ReferralImageArray.push(filteredArray[i]);
                                }
                                $scope.cacheStorageItem.ConsultationID = filteredArray[i].ConsultationId;
                            }

                        }
                    }
                }
            }
            function callbackfileuploadError(err) {
                alertify.success("Uploading Failed");
            }

        };


        $scope.SearchLocationByZipcode = function (val) {
            var Zipcode = val || "";
            if (val.length >= 5) {
                return eHnoteSettingsDataService.GetLocationsByZipCode(Zipcode).then(function (response) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                });
            }
        };

        $scope.SearchZipcodebyCounty = function (item) {
            if (item != "") {
                $scope.PCPObj.LocationId = item.LocationId;
                $scope.PCPObj.LocationName = item.LocationName;
                $scope.PCPObj.CityId = item.CityId;
                $scope.PCPObj.CityName = item.CityName;
                $scope.PCPObj.StateId = item.StateId;
                $scope.PCPObj.StateName = item.StateName;
            }
        };

        $scope.changeZipcodetoProcedure = function (item) {
            $scope.PCPObj.LocationName = "";
            $scope.PCPObj.CityName = "";
            $scope.PCPObj.StateName = "";
            $scope.PCPObj.CountyName = "";
        };
        $scope.AddReferalPCPDoctor = function () {
            if ($scope.PCPObj.FirstName === '') {
                alertify.error("Please Enter Name ");
                return;
            }
            $scope.PCPObj.Gender = $scope.PCPObj.Gender || ""
            if ($scope.PCPObj.Gender === '') {
                alertify.error("Please Enter Gender ");
                return;
            }
            $scope.PCPObj.MobileNo = $scope.PCPObj.MobileNo || null;
            if ($scope.PCPObj.MobileNo === null) {
                alertify.error("Please Enter MobileNo ");
                return;
            }
            if ($scope.PCPObj.EmailId === '') {
                alertify.error("Please Enter EmailId ");
                return;
            }
            if ($scope.PCPObj.NPI === '') {
                alertify.error("Please Enter NPI ");
                return;
            }
            if ($scope.PCPObj.ZipCode === '') {
                alertify.error("Please Enter ZipCode ");
                return;
            }

            var reqObj = {
                "PcpReferalId": $scope.PCPObj.PcpReferalId,
                "FirstName": $scope.PCPObj.FirstName,
                'LastName': $scope.PCPObj.LastName,
                'Title': $scope.PCPObj.Title,
                'PcpOrganizationName': $scope.PCPObj.PcpOrganizationName || '',
                'Age': $scope.PCPObj.Age,
                "MobileNo": $scope.PCPObj.MobileNo,
                "AlternateMobileNo": $scope.PCPObj.AlternateMobileNo,
                "Gender": $scope.PCPObj.Gender,
                "EmailId": $scope.PCPObj.EmailId,
                "SuffixId": $scope.PCPObj.SuffixId,
                'Address1': $scope.PCPObj.Address1,
                'Address2': $scope.PCPObj.Address2,
                'LocationId': $scope.PCPObj.LocationId,
                "StateId": $scope.PCPObj.StateId,
                'CityId': $scope.PCPObj.CityId,
                'PinCode': $scope.PCPObj.PinCode,
                'ZipCodePlusNo': $scope.PCPObj.ZipCodePlusNo,
                "SpecializationId": $scope.PCPObj.SpecializationId || null,
                "SubSpecializationId": $scope.PCPObj.SubSpecializationId || null,
                "DeleteInd": $scope.PCPObj.DeleteInd,
                "countrycode": $scope.PCPObj.countrycode,
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                'NPI': $scope.PCPObj.NPI,
                'SSN': $scope.PCPObj.SSN || '',
                'EmployeeId': $scope.PCPObj.EmployeeId || '',
                'Slicence': $scope.PCPObj.Slicence,
                'TaxonomyId': $scope.PCPObj.TaxonomyId,
                'ContactNo': $scope.PCPObj.ContactNo,
                'Contactcountrycode': $scope.PCPObj.Contactcountrycode
            };
            eHnoteReferalDataService.ModifyReferalPCPDoctor(reqObj).then(function (resp) {

                if (resp.data.Status == "Success") {
                    alertify.success("Successfully Added");
                    $scope.Referralobj.IsnewProvider = false;

                }
                else {
                    alertify.error(resp.data.Message);
                }

            });
        };
        $scope.ChangeSpecialization = function (item) {
            if (item != undefined) {
                $scope.PCPObj.SubSpecializationId = item.SubSpecializationId;
            }
        };
        $scope.ChangeSubspecialization = function (item) {
            if (item != undefined) {
                $scope.PCPObj.SpecializationId = item.SpecializationId;
            }
        };
        $scope.cacheStorageItem.ReferralDetails = $scope.cacheStorageItem.ReferralDetails || [];
        $scope.ChangeProvider = function (item) {
            if (item == true) {
                $scope.Referralobj.IsnewProvider = false;
            } else {
                $scope.Referralobj.IsnewProvider = true;
            }
        };
        $scope.ChangeReferalDetails = function (ritem) {


            angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                item.IsEditData = false;
            })
            ritem.IsEditData = true;
        }
        $scope.OnSelectDoctor = function (item, obj) {
            $scope.Referralobj.SpecializationId = $scope.Referralobj.SpecializationId || "";
            if ($scope.Referralobj.SpecializationId == "") {
                alertify.error('Please Select Specialization');
                $scope.Referralobj.referralDoctorObj = "";
                return false;
            }
            obj.ReferralDoctorId = item.DoctorID;
            obj.ReferralDoctorName = item.FullName;
            obj.SpecializationId = $scope.Referralobj.SpecializationId;
            obj.SubSpecializationId = $scope.Referralobj.SubSpecializationId;


        };
        $scope.RemoveDoctorName = function (item) {
            //item.OrderReferralDetailId = "";
            item.PatientReferralDetailId
            item.ReferralDoctorName = "";
            item.ReferralDoctorId = 0;
            item.Duration = 0;
            item.DurationType = "D";
            item.Alarm = "";
            item.ReferralReason = "";
            item.Remarks = "";
            item.DiagnosisObject = "";
            item.IsUrgency = false;
            item.IsFollowUpAfterReferral = false;
            item.IsIncludeInCaseHistory = false;
        }
        $scope.ChangeAdvisedOrders = function () {
            $scope.ProcedureListFocus = false;
        }
        $scope.ChangeFinalType = function (type, item) {

            item.OrderType = type;
            if (item.OrderType == 'Investigations') {
                item.OrderTypeId = 1;
            }
            if (item.OrderType == 'Procedures') {
                item.OrderTypeId = 2;
            }
            if (item.OrderType == 'Surgery') {
                item.OrderTypeId = 3;
                item.CoordinatorId = null;
                item.ExternalCoManagerId = null;
                item.InternalCoManagerId = null;
            }
            if ($scope.AdvisedOrderDetailsArray.length !== 0) {
                angular.forEach($scope.AdvisedOrderDetailsArray, function (item) {
                    item.IsEditData = false;
                });

                var tempAdvisedOrder = $filter("filter")($scope.AdvisedOrderDetailsArray, function (advitem, index) { return advitem.DeleteInd == "N" && advitem.OrderType == type }) || [];
                if (tempAdvisedOrder.length > 0) {
                    tempAdvisedOrder[0].IsEditData = true;
                }

            }
        }
        $scope.DelectAdvicedOrder = function (item, type) {
            var index = $scope.AdvisedOrderDetailsArray.indexOf(item);
            if (item.PatientOrderId === 0) {
                if (index > -1) {
                    $scope.AdvisedOrderDetailsArray.splice(index, 1);

                }
            } else {
                $scope.AdvisedOrderDetailsArray[index].DeleteInd = 'Y';

            }

        }
        $scope.ChangeModalities = function (item, id) {
            item.ModalityId = id || null;
        }
        $scope.ordershistorypopup = {
            "templateUrl": "templates/UIBPopovers/ordershistorypopup.html",
        };
        $scope.ChangeReferalDateFormet = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = null;
            } else {
                item.Duration = "";
                item.DurationType = "";
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };
        $scope.OnSelectReferalHospital = function (item, Mitem) {
            Mitem.ReferralDoctorName = item.FullName || '';
            Mitem.ReferralReason = $scope.cacheStorageItem.PatientName + " s being referred to " + item.FullName + " due to high fever";
            Mitem.ReferralDoctorId = item.DoctorID || null;
        };

        $scope.OnSelectReferalDoctor = function (item, Mitem) {
            Mitem.ReferralDoctorName = item.FullName || '';
            Mitem.ReferralDoctorId = item.DoctorID || null;
        };
        $scope.changePhNumber = function (item) {
            item = item.toString();
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.MobileNo = obj.UsFormatMobileNumber;
        }
        $scope.ChangeDurationType = function (item) {
            if (item.DurationType === "SD" || item.DurationType === "NV" || item.DurationType === "T" || item.DurationType === "ASAP") {
                item.Duration = "";
            }
        };
        $scope.AddResult = function (item) {
            if (item.PatientInvestigationId != 0 || item.PatientProcedureId != 0) {
                $scope.PatientInvestigationId = item.PatientInvestigationId || 0;
                $scope.PatientProcedureId = item.PatientProcedureId || 0;
                $scope.ResultObj.InvestigationName = item.Description || "";
                $scope.Referralobj.IsAddResult = true;
                $scope.ResultObj.DurationDate = $filter('date')(item.ResultDate, "MM-dd-yyyy"),
                    $scope.ResultObj.DoctorsName = item.ResultAddedBy || "";
                $scope.ResultObj.LocationName = item.ResultLocation || "";
                $scope.ResultObj.Notes = item.InterpretationNotes || "";
                $scope.ResultObj.ResultId = item.ResultId || 0;
                $scope.ResultObj.LocationId = item.LocationId || 0;
                $scope.TypeId = $scope.PatientProcedureId != 0 ? 1 : $scope.PatientInvestigationId != 0 ? 2 : 0;
            } else {
                $scope.ResultObj.InvestigationName = "";
                $scope.ResultObj.DurationDate = "";
                $scope.ResultObj.DoctorsName = "";
                $scope.ResultObj.LocationName = "";
                $scope.ResultObj.Notes = "";
                $scope.ResultObj.ResultId = 0;
                $scope.ResultObj.LocationId = 0;
                $scope.ResultObj.PatientInvestigationId = 0;
                $scope.ResultObj.PatientProcedureId = 0;
                $scope.TypeId = 0;
            }
        };
        $scope.CloseResult = function () {
            $scope.Referralobj.IsAddResult = false;
            $scope.ResultObj.DurationDate = "";
            $scope.ResultObj.DoctorsName = "";
            $scope.ResultObj.LocationName = "";
            $scope.ResultObj.Notes = "";
        };
        $scope.searchtxtb = { "txt1": "", "txt2": "" };
        $scope.searchtxtb.txt1 = "";
        $scope.SelectUserName = function (kitem) {
            $scope.ResultObj.DoctorsName = kitem.UserFullName + '-' + kitem.NPI;
        }
        $scope.AddUpdateResult = function (item) {

            if ($scope.ResultObj.Notes != "") {
                item.InterpretationNotes = $scope.ResultObj.Notes;
            } else {
                item.InterpretationNotes = "";
            }
            if ($scope.ResultObj.LocationName != "") {
                item.ResultLocation = $scope.ResultObj.LocationName;
            } else {
                item.ResultLocation = "";
            }
            if ($scope.ResultObj.DurationDate != "") {
                item.ResultDate = $scope.ResultObj.DurationDate;
            } else {
                item.ResultDate = "";
            }
            if ($scope.ResultObj.DoctorsName != "") {
                item.ResultAddedBy = $scope.ResultObj.DoctorsName;
            } else {
                item.ResultAddedBy = "";
            }

            var obj = {
                "ResultId": $scope.ResultObj.ResultId || 0,
                "PatientInvestigationId": $scope.PatientInvestigationId || 0,
                "PatientProcedureId": $scope.PatientProcedureId || 0,
                "InvestigationName": $scope.ResultObj.InvestigationName || "",
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "UserId": $scope.UserId,
                "ConsultationId": $scope.cacheStorageItem.ConsultationID,
                "PatientId": $scope.cacheStorageItem.patientid,
                "DurationDate": $filter('date')(new Date($scope.ResultObj.DurationDate), "yyyy-MM-dd"),
                "DoctorsName": $scope.ResultObj.DoctorsName || "",
                "LocationName": $scope.ResultObj.LocationName || "",
                "LocationId": $scope.ResultObj.LocationId || null,
                "Notes": $scope.ResultObj.Notes || "",
                "TypeId": $scope.TypeId || 0,
            }
            eHnoteSettingsDataService.AddUpdateResultsforInvestigation(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.cacheStorageItem.InvestigationResults = [];
                    $scope.cacheStorageItem.InvestigationResults = resp.data.rows;
                    $scope.Referralobj.IsAddResult = false;

                    if (resp.data.rows.length > 0) {
                        item.PhysicalAddress1 = resp.data.rows[0].PhysicalAddress1 || "";
                        item.PhysicalAddress2 = resp.data.rows[0].PhysicalAddress2 || "";
                        item.PhysicalCityName = resp.data.rows[0].PhysicalCityName || "";
                        item.PhysicalStateName = resp.data.rows[0].PhysicalStateName || "";
                        item.PhysicalZipCode = resp.data.rows[0].PhysicalZipCode || "";
                        item.ContactMobileNumber = resp.data.rows[0].ContactMobileNumber || "";

                    } else {
                        item.PhysicalAddress1 = "";
                        item.PhysicalAddress2 = "";
                        item.PhysicalCityName = "";
                        item.PhysicalStateName = "";
                        item.PhysicalZipCode = "";
                        item.ContactMobileNumber = "";
                    }
                }
            });
        }
        $scope.ClearResult = function () {
            $scope.ResultObj.DurationDate = "";
            $scope.ResultObj.DoctorsName = "";
            $scope.ResultObj.LocationName = "";
            $scope.ResultObj.LocationId = null;
            $scope.ResultObj.Notes = "";
            $scope.ResultObj.DoctorsName = "";
        }
        $scope.ChangeLocation = function (locationname) {
            var filterlocation = $filter("filter")($scope.LocationList, function (Litem, index) { return Litem.FacilityName == locationname }, true);
            if (filterlocation.length > 0) {
                $scope.ResultObj.LocationId = filterlocation[0].OrganizationBillingProviderId;
            }
        }
        $scope.Focustocalender = function () {
            $scope.IsCalenderOpen = !$scope.IsCalenderOpen;
        }

        //superbill start
        $scope.ReloadSuperbill = function () {
            $scope.SuperBillSuggestedCodeslist = [];
            $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();

            $scope.GetOrganizationSuperBillSuggestedCodes = function () {
                var obj = {
                    'OrganizationId': $scope.HospitalId
                }
                eHnotePatientDataService.GetOrganizationSuperBillSuggestedCodes(obj.OrganizationId).then(function (resp) {
                    console.log(resp);
                    if (resp.data.status == "Success") {
                        $scope.SuperBillSuggestedCodeslist = resp.data.row || [];
                        $scope.ShowSuggestedCodesOnClick();
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error(err);
                });

            }
            $scope.GetOrganizationSuperBillSuggestedCodes();


            $scope.GetOrganNameList = angular.copy($scope.GetOrganName());

            $scope.SuperBillObj = {
                "SelectedCode": "",
                "Isfocused": false
            };

            $scope.SuperBillObject = {
                "Remarks": ""
            }


            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {

                $scope.SuperBillObject.Remarks = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillRemarks;
            } else {
                $scope.cacheStorageItem.SuperBillFinalObj.SuperBillRemarks = '';
            }





            $scope.GetSuggestedCodeObj = function () {
                return {
                    "SuperBillItemId": 0,
                    "OrganizationProcedureId": null,
                    "ProcedureId": null,
                    "OrganizationId": null,
                    "UserId": $scope.UserId,
                    "TypeOfServiceId": null,
                    "Cost": 0,
                    "ProcedureCode": "",
                    "ProcedureName": "",
                    "CPTCodeProcedureName": "",
                    "ProcedureDescription": "",
                    "OrganizationName": "",
                    "BillingHistoryId": 0,
                    "AppointmentId": null,
                    "IsBillingSelected": true,
                    "IsBillingDone": false,
                    "CPTCode": "",
                    "ShowDiagForAdd": false,
                    "Quantity": 1,
                    "DiagnosisArray": [],
                    "Modifiers": [],
                    "DeleteInd": false
                };
            };

            $scope.getModifier = function () {
                eHnoteSettingsDataService.GetMasterModifiers().then(function (response) {
                    if (response.data.count !== 0) {
                        if (response.data.rows !== undefined) {
                            $scope.Modifiers = response.data.rows;
                            angular.forEach($scope.Modifiers, function (kitem) {
                                kitem.IsChecked = false;
                            });
                            $scope.cacheStorageItem.Modifiers = $scope.Modifiers;

                            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                                angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (Aitem) {
                                    if (Aitem.Modifiers.length > 0) {
                                        angular.forEach(Aitem.Modifiers, function (Bitem) {
                                            angular.forEach($scope.cacheStorageItem.Modifiers, function (Citem) {
                                                if (Bitem.MODIFIERID == Citem.MODIFIERID) {
                                                    Bitem.IsChecked = true;
                                                } else {
                                                    Citem.IsChecked = false;
                                                    Aitem.Modifiers.push(Citem);
                                                }
                                            });
                                        });
                                    } else {
                                        Aitem.Modifiers = $scope.Modifiers || [];
                                    }
                                });
                            }
                        }
                    }
                });
            };
            $scope.getModifier();

        }
        $scope.ReloadSuperbill();
        $scope.OnModifierCheck = function (obj, parentindex) {
            let counter = 0;
            angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].Modifiers, function (kitem) {
                if (kitem.IsChecked) {
                    counter++;
                }
            });
            if (counter > 4) {
                alertify.error("Only 4 modifiers are allowed!");
                obj.IsChecked = false;
                return;
            }
        };

        $scope.pushtoSuperBill = function (obj) {

            let counter = 0;
            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (hitem) {
                    if (hitem.OrganizationProcedureId == obj.OrganizationProcedureId && !hitem.DeleteInd) {
                        counter++;
                    }
                });
            }
            if (counter > 0) {
                alertify.error("Selected Procedure already exists!");
                $scope.SuperBillObj.SelectedCode = "";
                return;
            }
            $scope.SuggestedCodeObj = $scope.GetSuggestedCodeObj();


            $scope.SuggestedCodeObj.SuperBillItemId = 0;
            $scope.SuggestedCodeObj.OrganizationProcedureId = obj.OrganizationProcedureId;
            $scope.SuggestedCodeObj.ProcedureId = obj.ProcedureId;
            $scope.SuggestedCodeObj.OrganizationId = obj.OrganizationId;
            $scope.SuggestedCodeObj.UserId = $scope.UserId;
            $scope.SuggestedCodeObj.TypeOfServiceId = obj.TypeOfServiceId;
            $scope.SuggestedCodeObj.Cost = obj.GeneralCost;
            $scope.SuggestedCodeObj.ProcedureCode = obj.ProcedureCode;
            $scope.SuggestedCodeObj.ProcedureName = obj.ProcedureName;
            $scope.SuggestedCodeObj.CPTCodeProcedureName = obj.CPTCodeProcedureName;
            $scope.SuggestedCodeObj.ProcedureDescription = obj.ProcedureDescription;
            $scope.SuggestedCodeObj.OrganizationName = obj.OrganizationName;
            $scope.SuggestedCodeObj.BillingHistoryId = 0;
            $scope.SuggestedCodeObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
            $scope.SuggestedCodeObj.IsBillingSelected = true;
            $scope.SuggestedCodeObj.IsBillingDone = false;
            $scope.SuggestedCodeObj.CPTCode = obj.CPTCode;
            $scope.SuggestedCodeObj.ShowDiagForAdd = false;
            $scope.SuggestedCodeObj.Quantity = 1;
            $scope.SuggestedCodeObj.DiagnosisArray = [];
            $scope.SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
            $scope.SuggestedCodeObj.DeleteInd = false;
            $scope.SuggestedCodeObj.IsChecked = true;
            $scope.SuggestedCodeObj.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];

            $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.push($scope.SuggestedCodeObj);
            $scope.SuperBillObj.SelectedCode = "";

            $scope.SuperBillObject.Remarks = '';
        };




        $scope.AddDiagForSuperbill = function (obj) {
            let index = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(obj);
            if (index > -1) {
                $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.ShowDiagForAdd = true;
                obj.ShowDiagForAdd = true;
            }
        };
        $scope.onSelectSuperBillDiagnosis = function (item) {
            let ind = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(item);
            let counter = 0;
            angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[ind].DiagnosisArray, function (kitem) {
                if (kitem.DiagnosisId == item.DiagnosisObject.DiagnosisId && !kitem.DeleteInd) {
                    counter++;
                }
            });
            if (counter > 0) {
                alertify.error("Diagnosis already exists!");
                item.DiagnosisObject = "";
                return;
            }
            item.DiagnosisObject.SuperBillDiagnosisId = 0;
            item.DiagnosisObject.DeleteInd = false;
            $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[ind].DiagnosisArray.push(item.DiagnosisObject);
            item.DiagnosisObject = "";
        };
        $scope.DeleteDiagInSuperBill = function (obj, parentobj) {
            let parentindex = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(parentobj);
            if (obj.SuperBillDiagnosisId == 0) {
                let index = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray.indexOf(obj);
                if (index > -1) {
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray.splice(index, 1);
                }
            } else {
                let index = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray.indexOf(obj);
                if (index > -1) {
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray[index].DeleteInd = true;
                }
            }
        };

        $scope.DeleteProcInSuperBill = function (obj) {
            if (obj.SuperBillItemId == 0) {
                obj.IsChecked = false;
                let index = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(obj);
                if (index > -1) {
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.splice(index, 1);
                    if (obj.DiagnosisArray.length > 0) {
                        angular.forEach(obj.DiagnosisArray, function (nitem) {
                            nitem.IsChecked = false;
                        });
                    }

                }

            } else {
                let index = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(obj);
                if (index > -1) {
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes[index].DeleteInd = true;

                }
                var SuperBillObj = {
                    "UserId": $scope.UserId,
                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                    "OrganizationId": $scope.HospitalId,
                    "SuperBillRemarks": '',
                    "SuperBillId": $scope.cacheStorageItem.SuperBillFinalObj.SuperBillId || '',
                    "SuperBillArray": $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes || []
                };

                eHnoteDiagnosisDataServices.AddupdateSuperBill(SuperBillObj).then(function (response) {

                    if (response.data.Status === 'Success') {
                        //if (response.data.SuperBillArray.length > 0) {
                        //    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = response.data.SuperBillArray || [];
                        //    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillRemarks = $scope.SuperBillObject.Remarks || '';
                        //}
                        alertify.error("Deleted Successfully");

                    }
                });

            }
        };

        $scope.ShowSuggestedCodes = false;
        $scope.ShowSuggestedCodesOnClick = function () {
            $scope.ShowSuggestedCodes = !$scope.ShowSuggestedCodes;
            $scope.SuggestedCodesArray = [];
            $scope.cacheStorageItem.InvestigationsDetails = $scope.cacheStorageItem.InvestigationsDetails || [];
            $scope.cacheStorageItem.ProceduresDetails = $scope.cacheStorageItem.ProceduresDetails || [];
            $scope.cacheStorageItem.SurgeriesDetails = $scope.cacheStorageItem.SurgeriesDetails || [];
            if ($scope.ShowSuggestedCodes) {
                let contacttempArray = [...$scope.cacheStorageItem.InvestigationsDetails, ...$scope.cacheStorageItem.ProceduresDetails, ...$scope.cacheStorageItem.SurgeriesDetails];

                let tempArray = angular.copy(contacttempArray);

                if ($scope.cacheStorageItem.GonioscopyDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (item) {
                        if (item.InvestigationId == 2127 && item.IsInvDataAdded == true) {
                            if ($scope.SuperBillSuggestedCodeslist.length > 0) {
                                var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingId == 2127 }) || [];
                                if (filtredobj.length > 0) {
                                    angular.forEach(filtredobj, function (item) {
                                        var obj = {
                                            "OrgDescriptionId": item.OrganizationProcedureId,
                                            "DescriptionId": item.ProcedureId,
                                            "OrganizationId": item.OrganizationId,
                                            "TypeOfServiceId": item.TypeOfServiceId,
                                            "ProcedureCode": item.ProcedureCode,
                                            "Description": item.ProcedureName,
                                            "CPTCodeProcedureName": item.ProcedureName,
                                            "ProcedureDescription": item.ProcedureDescription,
                                            "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                            "ProcedureDescription": item.ProcedureDescription,
                                            "OrganizationName": item.OrganizationName,
                                            "ServicesTypeName": item.ServicesTypeName,
                                            "CPTCode": item.ProcedureCode,
                                            "Notes": "",
                                            "ModifierId": 1,
                                            "IsFrequent": "Y",
                                            "CliaIDRequired": false,
                                            "MamographyCertificateRequired": false,
                                            "RefferingProviderRequired": true,
                                            "PatientRecall": false,
                                            "PatientRecallDays": 0,
                                            "SlidingScaleRequired": false,
                                            "SlidingScaleAmount": 0.0,
                                            "ApplyGlobalPeriod": false,
                                            "ApplyGlobalPeriodDays": 0,
                                            'DeleteInd': 'N',
                                            "NDCCode": "",
                                            "RevenueCode": "",
                                            "UnitValue": 0.0,
                                            "AnesthesiaValue": 10.0,
                                            "GeneralCost": 0.0,
                                            "IsActive": true,
                                            "ModifierName": "55(Post op mg)",
                                            "CategoryId": 1,
                                            "CategoryName": null
                                        }

                                        $scope.Modifiers = $scope.Modifiers || [];
                                        if ($scope.Modifiers.length == 0) {
                                            $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                                        }
                                        obj.Modifiers = $scope.Modifiers || [];

                                        angular.forEach($scope.cacheStorageItem.GonioscopyDetails, function (Gitem) {
                                            if (Gitem.RightEye.DepthRightValue !== '' || Gitem.RightEye.DepthLeftValue !== '' || Gitem.RightEye.DepthTopValue !== '' || Gitem.RightEye.DepthBottomValue !== '' || Gitem.RightEye.TopValue !== '' || Gitem.RightEye.BottomValue !== '' || Gitem.RightEye.RightValue !== '' || Gitem.RightEye.LeftValue !== '' || Gitem.RightEye.PigmentValue !== '' || Gitem.RightEye.PossibleDiagnosisId !== '') {
                                                obj.OrganId = 1;
                                            }
                                            if (Gitem.LeftEye.DepthRightValue !== '' || Gitem.LeftEye.DepthLeftValue !== '' || Gitem.LeftEye.DepthTopValue !== '' || Gitem.LeftEye.DepthBottomValue !== '' || Gitem.LeftEye.TopValue !== '' || Gitem.LeftEye.BottomValue !== '' || Gitem.LeftEye.RightValue !== '' || Gitem.LeftEye.LeftValue !== '' || Gitem.LeftEye.PigmentValue !== '' || Gitem.LeftEye.PossibleDiagnosisId !== '') {
                                                obj.OrganId = 2;
                                            }
                                            if ((Gitem.RightEye.DepthRightValue !== '' || Gitem.RightEye.DepthLeftValue !== '' || Gitem.RightEye.DepthTopValue !== '' || Gitem.RightEye.DepthBottomValue !== '' || Gitem.RightEye.TopValue !== '' || Gitem.RightEye.BottomValue !== '' || Gitem.RightEye.RightValue !== '' || Gitem.RightEye.LeftValue !== '' || Gitem.RightEye.PigmentValue !== '' || Gitem.RightEye.PossibleDiagnosisId !== '') && (Gitem.LeftEye.DepthRightValue !== '' || Gitem.LeftEye.DepthLeftValue !== '' || Gitem.LeftEye.DepthTopValue !== '' || Gitem.LeftEye.DepthBottomValue !== '' || Gitem.LeftEye.TopValue !== '' || Gitem.LeftEye.BottomValue !== '' || Gitem.LeftEye.RightValue !== '' || Gitem.LeftEye.LeftValue !== '' || Gitem.LeftEye.PigmentValue !== '' || Gitem.LeftEye.PossibleDiagnosisId !== '')) {
                                                obj.OrganId = 3;
                                            }
                                        });


                                        tempArray.push(obj);
                                    })
                                }
                            }



                        }
                    });
                }
                if ($scope.cacheStorageItem.ManifestRefractionDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.ManifestRefractionDetails, function (item) {
                        if (item.InvestigationId == 2114 && item.IsDataAdded == true) {
                            if ($scope.SuperBillSuggestedCodeslist.length > 0) {
                                var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingId == 2114 }) || [];
                                if (filtredobj.length > 0) {
                                    angular.forEach(filtredobj, function (item) {
                                        var obj = {
                                            "OrgDescriptionId": item.OrganizationProcedureId,
                                            "DescriptionId": item.ProcedureId,
                                            "OrganizationId": item.OrganizationId,
                                            "TypeOfServiceId": item.TypeOfServiceId,
                                            "ProcedureCode": item.ProcedureCode,
                                            "Description": item.ProcedureName,
                                            "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                            "ProcedureDescription": item.ProcedureDescription,
                                            "OrganizationName": item.OrganizationName,
                                            "ServicesTypeName": item.ServicesTypeName,
                                            "CPTCode": item.ProcedureCode,
                                            "ModifierName": "55(Post op mg)",
                                            "Notes": "",
                                            "ModifierId": 1,
                                            "IsFrequent": "Y",
                                            "CliaIDRequired": false,
                                            "MamographyCertificateRequired": false,
                                            "RefferingProviderRequired": true,
                                            "PatientRecall": false,
                                            "PatientRecallDays": 0,
                                            "SlidingScaleRequired": false,
                                            "SlidingScaleAmount": 0.0,
                                            "ApplyGlobalPeriod": false,
                                            "ApplyGlobalPeriodDays": 0,
                                            'DeleteInd': 'N',
                                            "NDCCode": "",
                                            "RevenueCode": "",
                                            "UnitValue": 0.0,
                                            "AnesthesiaValue": 10.0,
                                            "GeneralCost": 0.0,
                                            "IsActive": true,

                                            "CategoryId": 1,
                                            "CategoryName": null
                                        }

                                        $scope.Modifiers = $scope.Modifiers || [];
                                        if ($scope.Modifiers.length == 0) {
                                            $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                                        }
                                        obj.Modifiers = $scope.Modifiers || [];

                                        if ($scope.cacheStorageItem.ManifestRefractionDetails[0].RSpherical !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RCylindrical !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RAxis !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RAdition !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RBCVA !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RBCNVA !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RVAI !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RDuo !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RCs !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RPrismVt !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RBaseVt !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RPrismHz !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RBaseHz !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].RType !== '') {
                                            obj.OrganId = 1;
                                        }
                                        if ($scope.cacheStorageItem.ManifestRefractionDetails[0].LSpherical !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LCylindrical !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LAxis !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LAdition !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LBCVA !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LBCNVA !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LVAI !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LDuo !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LCs !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LPrismVt !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LBaseVt !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LPrismHz !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LBaseHz !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].LType !== '') {
                                            obj.OrganId = 2;
                                        }
                                        if (($scope.cacheStorageItem.ManifestRefractionDetails[0].BBCVA !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].BBCNVA !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].BVAI !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].BDuo !== '' || $scope.cacheStorageItem.ManifestRefractionDetails[0].BCs !== '')) {
                                            obj.OrganId = 3;
                                        }

                                        tempArray.push(obj);
                                    })
                                }
                            }



                        }
                    });
                }
                if ($scope.cacheStorageItem.PachymetryDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.PachymetryDetails, function (item) {
                        if (item.InvestigationId == 176 && item.IsInvDataAdded == true) {
                            if ($scope.SuperBillSuggestedCodeslist.length > 0) {
                                var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingId == 176 }) || [];
                                if (filtredobj.length > 0) {
                                    angular.forEach(filtredobj, function (item) {
                                        var obj = {
                                            "OrgDescriptionId": item.OrganizationProcedureId,
                                            "DescriptionId": item.ProcedureId,
                                            "OrganizationId": item.OrganizationId,
                                            "TypeOfServiceId": item.TypeOfServiceId,
                                            "ProcedureCode": item.ProcedureCode,
                                            "Description": item.ProcedureName,
                                            "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                            "ProcedureDescription": item.ProcedureDescription,
                                            "OrganizationName": item.OrganizationName,
                                            "ServicesTypeName": item.ServicesTypeName,
                                            "CPTCode": item.ProcedureCode,
                                            "ModifierName": "55(Post op mg)",
                                            "Notes": "",
                                            "ModifierId": 1,
                                            "IsFrequent": "Y",
                                            "CliaIDRequired": false,
                                            "MamographyCertificateRequired": false,
                                            "RefferingProviderRequired": true,
                                            "PatientRecall": false,
                                            "PatientRecallDays": 0,
                                            "SlidingScaleRequired": false,
                                            "SlidingScaleAmount": 0.0,
                                            "ApplyGlobalPeriod": false,
                                            "ApplyGlobalPeriodDays": 0,
                                            'DeleteInd': 'N',
                                            "NDCCode": "",
                                            "RevenueCode": "",
                                            "UnitValue": 0.0,
                                            "AnesthesiaValue": 10.0,
                                            "GeneralCost": 0.0,
                                            "IsActive": true,

                                            "CategoryId": 1,
                                            "CategoryName": null
                                        }

                                        $scope.Modifiers = $scope.Modifiers || [];
                                        if ($scope.Modifiers.length == 0) {
                                            $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                                        }
                                        obj.Modifiers = $scope.Modifiers || [];
                                        angular.forEach($scope.cacheStorageItem.PachymetryDetails, function (Gitem) {
                                            if (Gitem.Pachymetry.length > 0) {
                                                if (Gitem.Pachymetry[0].RightEye !== '') {
                                                    obj.OrganId = 1;
                                                }
                                                if (Gitem.Pachymetry[0].LeftEye !== '') {
                                                    obj.OrganId = 2;
                                                }
                                                if ((Gitem.Pachymetry[0].RightEye !== '') && (Gitem.Pachymetry[0].LeftEye !== '')) {
                                                    obj.OrganId = 3;
                                                }
                                            }
                                        });

                                        tempArray.push(obj);
                                    })
                                }
                            }



                        }
                    });
                }

                if ($scope.cacheStorageItem.DryEyeEvaluationData.length > 0) {
                    angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (item) {
                        if (item.InvestigationId == 2103 && item.IsInvDataAdded == true) {
                            if ($scope.SuperBillSuggestedCodeslist.length > 0) {
                                var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingName == "Tear Osmolarity" }) || [];
                                if (filtredobj.length > 0) {
                                    angular.forEach(filtredobj, function (item) {
                                        var obj = {
                                            "OrgDescriptionId": item.OrganizationProcedureId,
                                            "DescriptionId": item.ProcedureId,
                                            "OrganizationId": item.OrganizationId,
                                            "TypeOfServiceId": item.TypeOfServiceId,
                                            "ProcedureCode": item.ProcedureCode,
                                            "Description": item.ProcedureName,
                                            "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                            "ProcedureDescription": item.ProcedureDescription,
                                            "OrganizationName": item.OrganizationName,
                                            "ServicesTypeName": item.ServicesTypeName,
                                            "CPTCode": item.ProcedureCode,
                                            "ModifierName": "55(Post op mg)",
                                            "Notes": "",
                                            "ModifierId": 1,
                                            "IsFrequent": "Y",
                                            "CliaIDRequired": false,
                                            "MamographyCertificateRequired": false,
                                            "RefferingProviderRequired": true,
                                            "PatientRecall": false,
                                            "PatientRecallDays": 0,
                                            "SlidingScaleRequired": false,
                                            "SlidingScaleAmount": 0.0,
                                            "ApplyGlobalPeriod": false,
                                            "ApplyGlobalPeriodDays": 0,
                                            'DeleteInd': 'N',
                                            "NDCCode": "",
                                            "RevenueCode": "",
                                            "UnitValue": 0.0,
                                            "AnesthesiaValue": 10.0,
                                            "GeneralCost": 0.0,
                                            "IsActive": true,
                                            "CategoryId": 1,
                                            "CategoryName": null
                                        }

                                        $scope.Modifiers = $scope.Modifiers || [];
                                        if ($scope.Modifiers.length == 0) {
                                            $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                                        }
                                        obj.Modifiers = $scope.Modifiers || [];

                                        angular.forEach($scope.cacheStorageItem.DryEyeEvaluationData, function (Gitem) {
                                            if (Gitem.InvestigationId == 2103) {
                                                if (Gitem.ODValue2 !== '') {
                                                    obj.OrganId = 1;
                                                }
                                                if (Gitem.OSValue2 !== '') {
                                                    obj.OrganId = 2;
                                                }
                                                if ((Gitem.ODValue2 !== '') && (Gitem.OSValue2 !== '')) {
                                                    obj.OrganId = 3;
                                                }
                                            }
                                        });

                                        tempArray.push(obj);
                                    })
                                }
                            }



                        }
                    });
                }
                /*if ($scope.cacheStorageItem.ContactLens.length > 0) {*/
                if ($scope.cacheStorageItem.ContactLensDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.ContactLensDetails, function (Aitem) {
                        Aitem.IsInvSummaryShow = true;
                        if (Aitem.InvestigationDetails.length > 0) {
                            angular.forEach(Aitem.InvestigationDetails, function (item) {
                                if ((Aitem.InvestigationId == 2084 || Aitem.InvestigationId == 2078) && Aitem.IsInvSummaryShow == true) {
                                    if ($scope.SuperBillSuggestedCodeslist.length > 0) {
                                        var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingId == 2089 }) || [];
                                        if (filtredobj.length > 0) {
                                            angular.forEach(filtredobj, function (item) {
                                                var obj = {
                                                    "OrgDescriptionId": item.OrganizationProcedureId,
                                                    "DescriptionId": item.ProcedureId,
                                                    "OrganizationId": item.OrganizationId,
                                                    "TypeOfServiceId": item.TypeOfServiceId,
                                                    "ProcedureCode": item.ProcedureCode,
                                                    "Description": item.ProcedureName,
                                                    "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                                    "ProcedureDescription": item.ProcedureDescription,
                                                    "OrganizationName": item.OrganizationName,
                                                    "ServicesTypeName": item.ServicesTypeName,
                                                    "CPTCode": item.ProcedureCode,
                                                    "ModifierName": "55(Post op mg)",
                                                    "Notes": "",
                                                    "ModifierId": 1,
                                                    "IsFrequent": "Y",
                                                    "CliaIDRequired": false,
                                                    "MamographyCertificateRequired": false,
                                                    "RefferingProviderRequired": true,
                                                    "PatientRecall": false,
                                                    "PatientRecallDays": 0,
                                                    "SlidingScaleRequired": false,
                                                    "SlidingScaleAmount": 0.0,
                                                    "ApplyGlobalPeriod": false,
                                                    "ApplyGlobalPeriodDays": 0,
                                                    'DeleteInd': 'N',
                                                    "NDCCode": "",
                                                    "RevenueCode": "",
                                                    "UnitValue": 0.0,
                                                    "AnesthesiaValue": 10.0,
                                                    "GeneralCost": 0.0,
                                                    "IsActive": true,

                                                    "CategoryId": 1,
                                                    "CategoryName": null
                                                }

                                                $scope.Modifiers = $scope.Modifiers || [];
                                                if ($scope.Modifiers.length == 0) {
                                                    $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                                                }
                                                obj.Modifiers = $scope.Modifiers || [];

                                                angular.forEach($scope.cacheStorageItem.ContactLensDetails, function (Citem) {
                                                    if (((Citem.InvestigationDetails.length > 0) && (Citem.InvestigationId == 2078)) || ((Citem.InvestigationDetails.length > 0) && (Citem.InvestigationId == 2084))) {
                                                        angular.forEach(Citem.InvestigationDetails, function (Gitem) {
                                                            if (Gitem.BasicODDesignType !== '' || Gitem.BasicODSph !== '' || Gitem.BasicODCyl !== '' || Gitem.BasicODAxis !== '' || Gitem.BasicODBC !== '' || Gitem.BasicODDia !== '' || Gitem.BasicODKeratometry !== '' || Gitem.BasicODColor !== '' || Gitem.BasicODProduct !== '' || Gitem.BasicODVaDistance !== '' || Gitem.BasicODVaNear !== '' || Gitem.BasicODVaIntermediate !== '') {
                                                                obj.OrganId = 1;
                                                            }
                                                            if (Gitem.BasicOSDesignType !== '' || Gitem.BasicOSSph !== '' || Gitem.BasicOSCyl !== '' || Gitem.BasicOSAxis !== '' || Gitem.BasicOSBC !== '' || Gitem.BasicOSDia !== '' || Gitem.BasicOSKeratometry !== '' || Gitem.BasicOSColor !== '' || Gitem.BasicOSProduct !== '' || Gitem.BasicOSVaDistance !== '' || Gitem.BasicOSVaNear !== '' || Gitem.BasicOSVaIntermediate !== '') {
                                                                obj.OrganId = 2;
                                                            }
                                                            if (Gitem.BasicOUVaDistance !== '' || Gitem.BasicOUVaNear !== '' || Gitem.BasicOUVaIntermediate !== '') {
                                                                obj.OrganId = 3;
                                                            }
                                                        });
                                                    }
                                                });

                                                tempArray.push(obj);
                                            })
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

                /*if ($scope.appointmentInfo.IsPosteriorExtendedOpthalmology == true) {*/
                if ($scope.cacheStorageItem.IsPosteriorExtendedOpthalmology == true) {
                    var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingName == "Extended Ophthalmology" }) || [];
                    if (filtredobj.length > 0) {
                        angular.forEach(filtredobj, function (item) {
                            var obj = {
                                "OrgDescriptionId": item.OrganizationProcedureId,
                                "DescriptionId": item.ProcedureId,
                                "OrganizationId": item.OrganizationId,
                                "TypeOfServiceId": item.TypeOfServiceId,
                                "ProcedureCode": item.ProcedureCode,
                                "Description": item.ProcedureName,
                                "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                "ProcedureDescription": item.ProcedureDescription,
                                "OrganizationName": item.OrganizationName,
                                "ServicesTypeName": item.ServicesTypeName,
                                "CPTCode": item.ProcedureCode,
                                "ModifierName": "55(Post op mg)",
                                "Notes": "",
                                "ModifierId": 1,
                                "IsFrequent": "Y",
                                "CliaIDRequired": false,
                                "MamographyCertificateRequired": false,
                                "RefferingProviderRequired": true,
                                "PatientRecall": false,
                                "PatientRecallDays": 0,
                                "SlidingScaleRequired": false,
                                "SlidingScaleAmount": 0.0,
                                "ApplyGlobalPeriod": false,
                                "ApplyGlobalPeriodDays": 0,
                                'DeleteInd': 'N',
                                "NDCCode": "",
                                "RevenueCode": "",
                                "UnitValue": 0.0,
                                "AnesthesiaValue": 10.0,
                                "GeneralCost": 0.0,
                                "IsActive": true,

                                "CategoryId": 1,
                                "CategoryName": null
                            }

                            $scope.Modifiers = $scope.Modifiers || [];
                            if ($scope.Modifiers.length == 0) {
                                $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                            }
                            obj.Modifiers = $scope.Modifiers || [];

                            if ($scope.cacheStorageItem.IsPosteriorExtendedOpthalmology) {
                                obj.OrganId = 4;
                            }

                            tempArray.push(obj);
                        })
                    }
                }

                if ($scope.appointmentInfo.AppointmentPatientTypeId == 1) {
                    var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingName == "New Patient" }) || [];
                    if (filtredobj.length > 0) {
                        angular.forEach(filtredobj, function (item) {
                            var obj = {
                                "OrgDescriptionId": item.OrganizationProcedureId,
                                "DescriptionId": item.ProcedureId,
                                "OrganizationId": item.OrganizationId,
                                "TypeOfServiceId": item.TypeOfServiceId,
                                "ProcedureCode": item.ProcedureCode,
                                "Description": item.ProcedureName,
                                "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                "ProcedureDescription": item.ProcedureDescription,
                                "OrganizationName": item.OrganizationName,
                                "ServicesTypeName": item.ServicesTypeName,
                                "CPTCode": item.ProcedureCode,
                                "ModifierName": "55(Post op mg)",
                                "Notes": "",
                                "ModifierId": 1,
                                "IsFrequent": "Y",
                                "CliaIDRequired": false,
                                "MamographyCertificateRequired": false,
                                "RefferingProviderRequired": true,
                                "PatientRecall": false,
                                "PatientRecallDays": 0,
                                "SlidingScaleRequired": false,
                                "SlidingScaleAmount": 0.0,
                                "ApplyGlobalPeriod": false,
                                "ApplyGlobalPeriodDays": 0,
                                'DeleteInd': 'N',
                                "NDCCode": "",
                                "RevenueCode": "",
                                "UnitValue": 0.0,
                                "AnesthesiaValue": 10.0,
                                "GeneralCost": 0.0,
                                "IsActive": true,
                                "OrganId": 4,

                                "CategoryId": 1,
                                "CategoryName": null
                            }

                            $scope.Modifiers = $scope.Modifiers || [];
                            if ($scope.Modifiers.length == 0) {
                                $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                            }
                            obj.Modifiers = $scope.Modifiers || [];


                            tempArray.push(obj);
                        })
                    }
                }
                if ($scope.appointmentInfo.AppointmentPatientTypeId == 2 && $scope.appointmentInfo.AppointmentTypeId == 3) {
                    var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingName == "Already patient existed" }) || [];
                    if (filtredobj.length > 0) {
                        angular.forEach(filtredobj, function (item) {
                            if (item.OrganizationProcedureId != 180121) {
                                var obj = {
                                    "OrgDescriptionId": item.OrganizationProcedureId,
                                    "DescriptionId": item.ProcedureId,
                                    "OrganizationId": item.OrganizationId,
                                    "TypeOfServiceId": item.TypeOfServiceId,
                                    "ProcedureCode": item.ProcedureCode,
                                    "Description": item.ProcedureName,
                                    "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                    "ProcedureDescription": item.ProcedureDescription,
                                    "OrganizationName": item.OrganizationName,
                                    "ServicesTypeName": item.ServicesTypeName,
                                    "CPTCode": item.ProcedureCode,
                                    "ModifierName": "55(Post op mg)",
                                    "Notes": "",
                                    "ModifierId": 1,
                                    "IsFrequent": "Y",
                                    "CliaIDRequired": false,
                                    "MamographyCertificateRequired": false,
                                    "RefferingProviderRequired": true,
                                    "PatientRecall": false,
                                    "PatientRecallDays": 0,
                                    "SlidingScaleRequired": false,
                                    "SlidingScaleAmount": 0.0,
                                    "ApplyGlobalPeriod": false,
                                    "ApplyGlobalPeriodDays": 0,
                                    'DeleteInd': 'N',
                                    "NDCCode": "",
                                    "RevenueCode": "",
                                    "UnitValue": 0.0,
                                    "AnesthesiaValue": 10.0,
                                    "GeneralCost": 0.0,
                                    "IsActive": true,
                                    "OrganId": 4,

                                    "CategoryId": 1,
                                    "CategoryName": null
                                }

                                $scope.Modifiers = $scope.Modifiers || [];
                                if ($scope.Modifiers.length == 0) {
                                    $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                                }
                                obj.Modifiers = $scope.Modifiers || [];
                                tempArray.push(obj);
                            }

                        })
                    }
                }
                if ($scope.appointmentInfo.AppointmentPatientTypeId == 2 && $scope.appointmentInfo.AppointmentTypeId != 3) {
                    var filtredobj = $filter("filter")($scope.SuperBillSuggestedCodeslist, function (item, index) { return item.FindingName == "Already patient existed" }) || [];
                    if (filtredobj.length > 0) {
                        angular.forEach(filtredobj, function (item) {
                            /*if (item.OrganizationProcedureId != 180121 && item.OrganizationProcedureId != 180122) {*/

                            var obj = {
                                "OrgDescriptionId": item.OrganizationProcedureId,
                                "DescriptionId": item.ProcedureId,
                                "OrganizationId": item.OrganizationId,
                                "TypeOfServiceId": item.TypeOfServiceId,
                                "ProcedureCode": item.ProcedureCode,
                                "Description": item.ProcedureName,
                                "CPTCodeProcedureName": item.CPTCodeProcedureName,
                                "ProcedureDescription": item.ProcedureDescription,
                                "OrganizationName": item.OrganizationName,
                                "ServicesTypeName": item.ServicesTypeName,
                                "CPTCode": item.ProcedureCode,
                                "ModifierName": "55(Post op mg)",
                                "Notes": "",
                                "ModifierId": 1,
                                "IsFrequent": "Y",
                                "CliaIDRequired": false,
                                "MamographyCertificateRequired": false,
                                "RefferingProviderRequired": true,
                                "PatientRecall": false,
                                "PatientRecallDays": 0,
                                "SlidingScaleRequired": false,
                                "SlidingScaleAmount": 0.0,
                                "ApplyGlobalPeriod": false,
                                "ApplyGlobalPeriodDays": 0,
                                'DeleteInd': 'N',
                                "NDCCode": "",
                                "RevenueCode": "",
                                "UnitValue": 0.0,
                                "AnesthesiaValue": 10.0,
                                "GeneralCost": 0.0,
                                "IsActive": true,
                                "OrganId": 4,

                                "CategoryId": 1,
                                "CategoryName": null
                            }

                            $scope.Modifiers = $scope.Modifiers || [];
                            if ($scope.Modifiers.length == 0) {
                                $scope.Modifiers = $scope.cacheStorageItem.Modifiers;
                            }
                            obj.Modifiers = $scope.Modifiers || [];
                            tempArray.push(obj);


                        })
                    }
                }


                let tempuniqArray = _.uniq(tempArray, function (x) {
                    return x.OrgDescriptionId;
                });
                tempuniqArray = $filter('filter')(tempuniqArray, { 'DeleteInd': 'N' }, true) || [];

                angular.forEach(tempuniqArray, function (kitem) {
                    let tarray = $filter('filter')(tempArray, { 'OrgDescriptionId': kitem.OrgDescriptionId, 'DeleteInd': 'N' }, true);
                    if (tarray.length > 0) {
                        if (tarray.length > 1) {
                            angular.forEach(tarray, function (sitem) {
                                angular.forEach(sitem.DiagnosisList, function (litem) {
                                    kitem.DiagnosisList.push(litem);
                                });
                            });
                        }
                        kitem.DiagnosisList = _.uniq(kitem.DiagnosisList, function (x) {
                            return x.DiagnosisId;
                        });
                    }
                });
                angular.forEach(tempuniqArray, function (aitem) {

                    $scope.SuggestedCodeObj = $scope.GetSuggestedCodeObj();


                    $scope.SuggestedCodeObj.SuperBillItemId = 0;
                    $scope.SuggestedCodeObj.OrganizationProcedureId = aitem.OrgDescriptionId;
                    $scope.SuggestedCodeObj.ProcedureId = aitem.DescriptionId;
                    $scope.SuggestedCodeObj.OrganizationId = $scope.HospitalId;
                    $scope.SuggestedCodeObj.UserId = $scope.UserId;
                    $scope.SuggestedCodeObj.TypeOfServiceId = aitem.TypeOfServiceId;
                    $scope.SuggestedCodeObj.Cost = aitem.GeneralCost;
                    $scope.SuggestedCodeObj.ProcedureCode = aitem.ProcedureCode;
                    $scope.SuggestedCodeObj.ProcedureName = aitem.Description;
                    $scope.SuggestedCodeObj.OrganName = aitem.OrganName;
                    $scope.SuggestedCodeObj.CPTCodeProcedureName = aitem.CPTCodeProcedureName || "";
                    $scope.SuggestedCodeObj.ProcedureDescription = aitem.ProcedureDescription;
                    $scope.SuggestedCodeObj.OrganizationName = aitem.OrganizationName || "";
                    $scope.SuggestedCodeObj.BillingHistoryId = 0;
                    $scope.SuggestedCodeObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
                    $scope.SuggestedCodeObj.IsBillingSelected = true;
                    $scope.SuggestedCodeObj.IsBillingDone = false;
                    $scope.SuggestedCodeObj.CPTCode = aitem.BillingCode || "";
                    $scope.SuggestedCodeObj.ShowDiagForAdd = false;
                    $scope.SuggestedCodeObj.Quantity = 1;
                    $scope.SuggestedCodeObj.DiagnosisArray = angular.copy(aitem.DiagnosisList);
                    $scope.SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
                    $scope.SuggestedCodeObj.DeleteInd = false;
                    $scope.SuggestedCodeObj.IsChecked = false;
                    $scope.SuggestedCodeObj.OrganId = aitem.OrganId || null;
                    $scope.SuggestedCodeObj.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];

                    $scope.SuggestedCodesArray.push($scope.SuggestedCodeObj);
                });

                if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                    angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (Aitem) {
                        angular.forEach($scope.SuggestedCodesArray, function (Sitem) {
                            angular.forEach(Aitem.DiagnosisArray, function (Xitem) {
                                angular.forEach(Sitem.DiagnosisArray, function (Yitem) {

                                    if (Yitem.DiagnosisId == Xitem.DiagnosisId) {
                                        Yitem.IsChecked = true;
                                    }
                                });
                            });

                            if (Sitem.ProcedureCode == Aitem.ProcedureCode) {
                                Sitem.IsChecked = true;

                            }
                        });
                    });
                }

            }
        };


        $scope.OnCheckSuggestedCode = function (obj) {
            if (obj.IsChecked) {
                let temparray = $filter('filter')($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, { "OrganizationProcedureId": obj.OrganizationProcedureId, "DeleteInd": false }, true);
                if (temparray.length > 0) {
                    alertify.error("Procedure already exists!");
                    obj.IsChecked = false;
                    return;
                } else {
                    angular.forEach(obj.DiagnosisArray, function (item) {
                        item.IsChecked = true;
                    });

                    obj.DiagnosisArray = $filter('filter')(obj.DiagnosisArray, { 'IsChecked': true }, true);
                    if (obj.DiagnosisArray.length > 0) {
                        obj.ShowDiagForAdd = true;
                    } else {
                        obj.ShowDiagForAdd = false;
                    }
                    angular.forEach(obj.DiagnosisArray, function (litem) {
                        litem.DeleteInd = false;
                        litem.ICD10CODE = litem.ICDCode;
                    });
                    let tempArray = angular.copy($scope.Modifiers);
                    angular.forEach(tempArray, function (item) {
                        item.IsChecked = false;
                    });
                    obj.Modifiers = angular.copy(tempArray);
                    if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length == 0) {
                        $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.push(obj);
                    } else {
                        $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.push(obj);
                    }
                }
            } else {
                angular.forEach(obj.DiagnosisArray, function (item) {
                    item.IsChecked = false;
                    if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                        $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = $filter("filter")($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, { "IsChecked": true }, true);
                    }
                });
                if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                    $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = $filter("filter")($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, { "IsChecked": true }, true);
                }
            }

        };

        $scope.OnCheckDiagforSuggestedCode = function (diag, item) {
            if (item.IsChecked && diag.IsChecked) {
                diag.Ischecked = true;
            } else if (!item.IsChecked && diag.IsChecked) {
                diag.IsChecked = false;
            }
        };

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        $scope.SaveSuperBillpopup = function (type) {
            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length == "" || null) {
                alertify.error("Please select at least one procedure");
                return false;
            }

            if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (mitem) {
                    mitem.Modifiers = $filter("filter")(mitem.Modifiers, { "IsChecked": true }, true);
                });
            }

            var SuperBillObj = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "SuperBillRemarks": $scope.SuperBillObject.Remarks || '',
                "SuperBillId": $scope.cacheStorageItem.SuperBillFinalObj.SuperBillId || '',
                "SuperBillArray": $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes || []
            };

            eHnoteDiagnosisDataServices.AddupdateSuperBill(SuperBillObj).then(function (response) {

                if (response.data.Status === 'Success') {
                    if (response.data.SuperBillArray.length > 0) {
                        $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = response.data.SuperBillArray || [];
                        $scope.cacheStorageItem.SuperBillFinalObj.SuperBillRemarks = $scope.SuperBillObject.Remarks;
                    }
                    if (type != 2) {
                        $uibModalInstance.close($scope.AssessmentplanpopupObj);
                    }
                }
            });
        }


        $scope.Investigationtoggle = function (type, Aitem) {
            if (type == 'Investigation') {
                $scope.isPopoverOpenInvestigation = true;
            }
            if (Aitem.DiagnosisArray.length > 0) {
                angular.forEach(Aitem.AssessmentPlan, function (zitem) {
                    zitem.IsCheckedDiagnosis = false;
                });
                angular.forEach(Aitem.DiagnosisArray, function (Bitem) {
                    angular.forEach(Aitem.AssessmentPlan, function (Citem) {
                        if (Bitem.DiagnosisId == Citem.DiagnosisId) {
                            Citem.IsCheckedDiagnosis = true;
                        }
                    });
                });
            } else {
                angular.forEach(Aitem.AssessmentPlan, function (Bitem) {
                    Bitem.IsCheckedDiagnosis = false;
                });
            }
            if (Aitem.AssessmentPlan != undefined) {
                $scope.AddDiagnosisAssesmentPlanArray = Aitem.AssessmentPlan || [];
            } else {
                angular.forEach(Aitem.DiagnosisArray, function (Digitem) {
                    Digitem.IsCheckedDiagnosis = true;
                });
                $scope.AddDiagnosisAssesmentPlanArray = Aitem.DiagnosisArray || [];
            }

        }
        $scope.dgnosispopoverinvest = {
            templateUrl: 'investdiagnosispopoverscript.html',
        };
        $scope.ADDdiagnosisInvestigationadded = function (Mitem, type) {

            angular.forEach(Mitem.AssessmentPlan, function (item) {
                if (item.IsCheckedDiagnosis) {
                    var obj = {
                        "DiagnosisDetailId": 0,
                        "DiagnosisId": item.DiagnosisId,
                        "DiagnosisName": item.DiagnosisName,
                        "ICDCode": '',
                        "ActiveInd": item.ActiveInd || "Y",
                        "IsChecked": true,
                        "DeleteInd": item.DeleteInd || 'N',
                        "ICD10CODE": item.ICD10CODE || ""
                    }
                    var TempDiagnosisDiagnosisArray = $filter("filter")(Mitem.DiagnosisArray, { "DiagnosisId": item.DiagnosisId }, true);
                    if (TempDiagnosisDiagnosisArray.length == 0) {
                        Mitem.DiagnosisArray.push(obj);
                    }
                }
            });
            $scope.isPopoverOpenInvestigation = false;
        }

        $scope.Mapdiagnosis = function (item) {


            var TempDiagnosisArray = $filter("filter")($scope.AdvisedOrderDetailsArray, { "IsEditData": true }, true);
            if (TempDiagnosisArray.length > 0) {
                if (item.IsCheckedDiagnosis) {
                    var obj = {
                        "DiagnosisDetailId": 0,
                        "DiagnosisId": item.DiagnosisId,
                        "PatientOrderId": TempDiagnosisArray[0].PatientOrderId,
                        "AssessmentPlanId": item.AssessmentPlan.AssessmentPlanId,
                        "ConsultationDiagnosisId": item.ConsultationDiagnosisId,
                        "DiagnosisName": item.DiagnosisName,
                        "ICDCode": '',
                        "ActiveInd": item.ActiveInd || "Y",
                        "IsChecked": true,
                        "DeleteInd": item.DeleteInd || 'N',
                        "ICD10CODE": item.ICD10CODE || ""
                    }
                    var TempDiagnosisDiagnosisArray = $filter("filter")(TempDiagnosisArray[0].DiagnosisList, { "DiagnosisId": item.DiagnosisId }, true);
                    if (TempDiagnosisDiagnosisArray.length == 0) {
                        TempDiagnosisArray[0].DiagnosisList.push(obj);
                    }
                }
            }
        }
        //super bill end

        $scope.Costestimatedpopuporders = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Costestimatedpopupnew.html",
                "backdrop": "static",
                "backdropClass": "customassessmentspopupback",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "customassessmentspopup",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }

        $scope.medicalRXpopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/medicalRXpopup.html",
                "backdrop": "static",
                "backdropClass": "customassessmentspopupback",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "customassessmentspopup",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }


    }]);
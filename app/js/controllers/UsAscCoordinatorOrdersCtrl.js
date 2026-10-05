"use strict";
eHnoteWebApp.controller("UsAscCoordinatorOrdersCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "eHnoteAuditServices", "Lightbox", "$timeout", "$uibModalInstance", "$uibModal", "localStorageFactory", "eHnoteMainAppointmentService", "eHnoteUserDataService", "eHnoteSurgeryService", "$q", "eHnotePatientVisitReasonServices", "eHnoteSettingsDataService", "eHnoteConditionsDataService", "eHnoteDiagnosisDataServices", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, eHnoteAuditServices, Lightbox, $timeout, $uibModalInstance, $uibModal, localStorageFactory, eHnoteMainAppointmentService, eHnoteUserDataService, eHnoteSurgeryService, $q, eHnotePatientVisitReasonServices, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }

    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.RoleId = userLoginDetails.RoleID;
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
    $scope.Appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.ROSocularSeverity = [];
    $scope.ROSAllergySeverity = [];
    $scope.ROSAllergyStatus = [];
    $scope.ROSAllergyType = [];
    $scope.ROSIsNormalArray = [];
    $scope.ocularObj = {
        "SelectedOcularHistoryItem": "",
        "OccularHistoryArray": [],
        "OccularHistoryRemarks": ""
    }
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    };
    $scope.AscTemplates = {
        "SearchProcedureObj": "",
        "TemplateName": ""
    }
    $scope.TempPreOpObj = {
        "OrderType": "",
        "OrderName": "",
    }
    $scope.GetPreOpMedicationObj = function () {
        return {
            "OrderName": "",
            "MedicineObject": "",
            "MedicationId": null,
            "OrganizationMedicationId": null,
            "MedicationName": "",
            "FrequencyId": null,
            "DoseId": null,
            "DoseUnitId": null,
            "RouteId": null,
            "ActionId": null,
            "Frequency": "",
            "Dose": "",
            "DoseUnit": "",
            "Route": "",
            "Action": "",
            "OrderDescription": "",
            "MedicationNotes": "",
            "maxDose": "",
            "IsChecked": false,
            "EditIndex": -1,
            "OrderTypeId": null,
            "OrderTypeName": "",
            "IsmedSearchDisabled": false
        };
    };
    $scope.TempDilationMedicationObj = angular.copy($scope.GetPreOpMedicationObj());

    $scope.TempPreOpObj.OrderType = 'Medications'
    $scope.TempIntraOpObj = {
        "OrderType": 4,
        "OrderName": ""
    }
    $scope.TempPostOpObj = {
        "OrderType": 8,
        "OrderName": ""
    }
    $scope.MedicalrxObj = {
        "IsRcopiaa": false,
        "IsCurrentEye": true,
        "IsCurrentSystem": true
    }
    $scope.medicineGetObj = {
        "MedicineObject": ""
    }
    function getNewPrescriptionDetailObj() {
        var obj = {
            "PatientPrescriptionDetailId": 0,
            "MedicationTemplateId": 0,
            "PatientPrescriptionId": 0,
            "MedicationId": 0,
            "RcopiaDrugId": "",
            "RcopiaMedicationId": "",
            "RcopiaPrescriptionId": "",
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
            "Quantity": null,
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "SubstitutionPermitted": "y",
            "HasScheduledDrug": "n",
            "PatientInstructions": "",
            "DeleteInd": "N",
            "OtherNotes": "",
            "Remarks": "",
            "StartDate": $scope.CurrentDateMMFormat,
            "StopDate": null,
            "FillDate": $scope.CurrentDateMMFormat,
            "StopReason": "",
            "RcopiaMedicationStatus": "",
            "IsEditMode": true,
            "IsAllSig": false,
            "Type": "",
            "MedicineObj": "",
            "StopReasonId": "",
            "IsMedicationStopped": false,
            "SelectedMedicationHistory": 'CurrentEyeMedication'


        }
        return obj;
    };
    $scope.GetOrganName = function () {
        return [{
            "OrganId": 1,
            "OrganName": "OD"
        },
        {
            "OrganId": 2,
            "OrganName": "OS"
        },
        {
            "OrganId": 3,
            "OrganName": "OU"
        },
        {
            "OrganId": 4,
            "OrganName": "General"
        }
        ];
    };
    $scope.GetOrganNameList = angular.copy($scope.GetOrganName());
    $scope.GetSeverityName = function () {
        return [{
            "SeverityId": 1,
            "SeverityName": "Mild"
        },
        {
            "SeverityId": 3,
            "SeverityName": "Moderate"
        },
        {
            "SeverityId": 5,
            "SeverityName": "Severe"
        }];
    };
    $scope.GetSeverityList = angular.copy($scope.GetSeverityName());
    $scope.GetStatusName = function () {
        return [{
            "DiagnosisStatusId": 1,
            "DiagnosisStatus": "Provisional"
        },
        {
            "DiagnosisStatusId": 2,
            "DiagnosisStatus": "Active"
        },
        {
            "DiagnosisStatusId": 3,
            "DiagnosisStatus": "InActive"
        },
        {
            "DiagnosisStatusId": 4,
            "DiagnosisStatus": "Resolved"
        },
        {
            "DiagnosisStatusId": 5,
            "DiagnosisStatus": "RuledOut"
        },
        {
            "DiagnosisStatusId": 6,
            "DiagnosisStatus": "Not Examined"
        },
        {
            "DiagnosisStatusId": 7,
            "DiagnosisStatus": "Entered In Error"
        }];
    };
    $scope.GetStatusList = angular.copy($scope.GetStatusName());
    $scope.TempPostOpObj.OrderType = 'Medications'
    $scope.temptab = 'preop';
    $scope.GetIntraOpMedicationObj = function () {
        return {
            "SubTab": 1,
            "MedicineObject": "",
            "MedicationId": null,
            "OrganizationMedicationId": null,
            "MedicationName": "",
            "DeleteInd": "N",
            "MedicationName": "",
            "FrequencyId": null,
            "DoseId": null,
            "DoseUnitId": null,
            "RouteId": null,
            "ActionId": null,
            "Frequency": "",
            "Dose": "",
            "DoseUnit": "",
            "Route": "",
            "Action": "",
            "OrderDescription": "",
            "MedicationNotes": "",
            "maxDose": "",
            "IsChecked": false,
            "EditIndex": -1,
            "OrderTypeId": null,
            "OrderTypeName": "",
            "IsmedSearchDisabled": false
        };
    };
    $scope.GetPostOpMedicationObj = function () {
        return {
            "OrderName": "",
            "MedicineObject": "",
            "MedicationId": null,
            "OrganizationMedicationId": null,
            "MedicationName": "",
            "FrequencyId": null,
            "DoseId": null,
            "DoseUnitId": null,
            "RouteId": null,
            "ActionId": null,
            "Frequency": "",
            "Dose": "",
            "DoseUnit": "",
            "Route": "",
            "Action": "",
            "OrderDescription": "",
            "MedicationNotes": "",
            "maxDose": "",
            "IsChecked": false,
            "EditIndex": -1,
            "OrderTypeId": null,
            "OrderTypeName": "",
            "IsmedSearchDisabled": false
        };
    };
    $scope.TempPostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
    $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
    $scope.TempIntraOpObj.OrderType = 'Medications'


    $scope.GetASCSectionsobj = function () {
        return {
            "PreopTab": 1,
            "IntraOpTab": 1,
            "PostOpTab": 1,
            "TAB": 1,
            //"PreopNurse": 1,
            //"PreopNurse": "",
            //"PreopNurse": "N",
            //"PreopNurse": null,
            //"PreopNurse": null,
            //"PreopNurse": null
        };
    };
    $scope.ASCSectionsobj = angular.copy($scope.GetASCSectionsobj());
    // opened with a starting tab (e.g. 9 = Labs&Studies from the Labs & Studies summary Edit); otherwise the default tab
    if ($scope.AscTemplateScreenObj && $scope.AscTemplateScreenObj.InitialTab) {
        $scope.ASCSectionsobj.TAB = $scope.AscTemplateScreenObj.InitialTab;
    }

    $scope.GetPreopAccrdnSectionsobj = function () {
        return {
            "PreOpChecklist": [
                {
                    PreopChecklistId: 1,
                    PreopChecklistName: "General Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 2,
                    PreopChecklistName: "Clinical Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 3,
                    PreopChecklistName: "Medication Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 4,
                    PreopChecklistName: "Fall Risk Assessment",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 5,
                    PreopChecklistName: "Nurse Interventions",
                    IsChecked: true,
                }
            ],

        };
    };
    $scope.PreopSectionsobj = angular.copy($scope.GetPreopAccrdnSectionsobj());

    $scope.GetIntraAccrdnSectionsobj = function () {
        return {
            "PreOpChecklist": [
                {
                    PreopChecklistId: 1,
                    PreopChecklistName: "General Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 2,
                    PreopChecklistName: "Clinical Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 3,
                    PreopChecklistName: "Medication Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 4,
                    PreopChecklistName: "Fall Risk Assessment",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 5,
                    PreopChecklistName: "Nurse Interventions",
                    IsChecked: true,
                }
            ],

        };
    };
    $scope.IntraOpSectionsobj = angular.copy($scope.GetIntraAccrdnSectionsobj());

    $scope.GetPostOpAccrdnSectionsobj = function () {
        return {
            "PreOpChecklist": [
                {
                    PreopChecklistId: 1,
                    PreopChecklistName: "General Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 2,
                    PreopChecklistName: "Clinical Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 3,
                    PreopChecklistName: "Medication Checklist",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 4,
                    PreopChecklistName: "Fall Risk Assessment",
                    IsChecked: true,
                },
                {
                    PreopChecklistId: 5,
                    PreopChecklistName: "Nurse Interventions",
                    IsChecked: true,
                }
            ],

        };
    };
    $scope.PostopSectionsobj = angular.copy($scope.GetPostOpAccrdnSectionsobj());


    $scope.GetPreopSectionsobj = function () {
        return {
            "IsChecklistaccordion": true,
            "ISNurseInterventions": true,
            "TimeOutChecklist": true,
            "Consumables": true,
            "AnesthesiaOrders": true,
            "PostOpTab": 1,
            "TAB": 1,
        };
    };
    $scope.PreopSectionsobj = angular.copy($scope.GetPreopSectionsobj());



    $scope.AscSectionTabChanges = function (tab) {
        $scope.ASCSectionsobj.TAB = tab || 0;
        if ($scope.ASCSectionsobj.TAB == 1) {
            $scope.PreOpObj.MedTypeId = 2;
        }
        else if ($scope.ASCSectionsobj.TAB == 2) {
            $scope.PreOpObj.MedTypeId = 1;
        }
        else if ($scope.ASCSectionsobj.TAB == 3) {
            $scope.TempIntraOpObj.MedTypeId = 4;
        } else if ($scope.ASCSectionsobj.TAB == 4) {
            $scope.TempIntraOpObj.MedTypeId = 3;
        } else if ($scope.ASCSectionsobj.TAB == 5) {
            $scope.TempPostOpObj.MedTypeId = 5;
        }
        else if ($scope.ASCSectionsobj.TAB == 6) {
            $scope.TempPostOpObj.MedTypeId = 8;
        }
        //if ($scope.ASCSectionsobj.TAB == 1 || $scope.ASCSectionsobj.TAB == 3 || $scope.ASCSectionsobj.TAB == 5) {
        //    $scope.GetOrganizationASCCheckListData();
        //}
        $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
        $scope.TempPostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
        $scope.TempDilationMedicationObj = angular.copy($scope.GetPreOpMedicationObj());
    }

    $scope.GetAsctemplateObj = function () {
        return {
            "UserId": $scope.UserId,
            "ASCSurgeryTemplateUserId": 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "OrganizationId": $scope.HospitalId,
            "OrgSurgeryId": 0,
            "SurgeryId": 0,
            "UserSurgeryTemplateId": 0,
            "OrganId": null,
            "SurgeryArray": [],

            "TemplateName": '',
            "Preadmission": {},
            "PreOp": {
                "OrderDetails": [],
                "OrgASCChecklist": [],
                "AlderetScoreDetails": [],
            },
            "IntraOp": {
                "OrderDetails": [],
                "OrgASCChecklist": [],
            },
            "PostOp": {
                "OrderDetails": [],
                "OrgASCChecklist": [],
            },
            "Discharge": {},
            "ProcedureCode": '',
            "SurgeryName": '',
            "CoordinatorChecklistArray": [],
            "InvestigationsList": [],
            "PostSurgery": {
                "OccularHistoryArray": [],
                "OccularHistoryRemarks": "",
            },

        };
    };
    $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());
    //$scope.OnClickTemplateOrders = function (mainitem, type) {
    //    //$scope.AsctemplateObj.SurgeryId = mainitem.ProcedureId || 0;
    //    //$scope.AsctemplateObj.OrgSurgeryId = mainitem.OrganizationProcedureId || 0

    //    var i = 0;
    //    if ($scope.AsctemplateObj.SurgeryArray.length > 0) {
    //        var filterProcedure = $filter("filter")($scope.AsctemplateObj.SurgeryArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
    //        if (filterProcedure.length > 0) {
    //            $scope.AscTemplates.SearchProcedureObj = '';
    //            alertify.error("This order has already been added");
    //            return false;
    //            i++;
    //        }
    //    }

    //    let si = 0, TemplateName = '';
    //    if ($scope.AscTemplateScreenObj.Tab == 1) {
    //        angular.forEach($scope.AscTemplateScreenObj.TemplateList, function (mitem) {
    //            let templist = $filter("filter")(mitem.SurgeryArray, function (oitem) {
    //                return oitem.OrgSurgeryId === mainitem.OrganizationProcedureId;
    //            }) || [];
    //            if (templist.length > 0) {
    //                si++;
    //                if (TemplateName == '') {
    //                    TemplateName = mitem.TemplateName || '';
    //                } else {
    //                    TemplateName += ',' + (mitem.TemplateName);

    //                }
    //            }
    //        });
    //    }
    //    if (si > 0) {
    //        //alertify.error('Selected Surgery Already In ' + TemplateName);
    //        alertify.error('Selected Surgery already added to "' + TemplateName + '" template.');

    //        $scope.AscTemplates.SearchProcedureObj = '';
    //        return;
    //    }



    //    if (i == 0) {
    //        var object = {
    //            "OrderTypeId": mainitem.OrderTypeId || 3,
    //            "SurgeryId": mainitem.ProcedureId || 0,
    //            "DescriptionId": mainitem.ProcedureId || "",
    //            "Description": mainitem.ProcedureName || "",
    //            "SurgeryName": mainitem.ProcedureName || "",
    //            "ProcedureCode": mainitem.ProcedureCode || 0,
    //            "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
    //            "OrgSurgeryId": mainitem.OrganizationProcedureId || 0,

    //            "CPTCode": mainitem.CPTCode,

    //            "DeleteInd": "N",


    //        }
    //        $scope.AsctemplateObj.SurgeryArray.push(object);
    //    }
    //    $scope.AscTemplates.SearchProcedureObj = '';


    //}

    $scope.OnClickTemplateOrders = function (mainitem, type) {
        if ($scope.AscTemplateScreenObj.Tab == 2) {

            if (!$scope.AsctemplateObj.OrganId) {
                alertify.error("Please select Organ before adding procedure.");
                $scope.AscTemplates.SearchProcedureObj = '';

                return;
            }
            var selectedOrganId = $scope.AsctemplateObj.OrganId;
            var procedureOrganId = mainitem.OrganId || null;
            if (!procedureOrganId) {
                if ($scope.AsctemplateObj.OrganId != 3) {
                    alertify.error("Please select Other In Organ before adding procedure.");
                    $scope.AscTemplates.SearchProcedureObj = '';

                    return;

                }
            }
            else if (procedureOrganId != selectedOrganId) {

                alertify.error("Selected procedure does not match the chosen Organ.");
                $scope.AscTemplates.SearchProcedureObj = '';

                return;
            }
        }
        var selectedDoctorId = $scope.AsctemplateObj.ASCSurgeryTemplateUserId || 0;

        var duplicateInCurrent = $filter("filter")(
            $scope.AsctemplateObj.SurgeryArray,
            function (Aitem) {
                return (
                    Aitem.OrgSurgeryId == mainitem.OrganizationProcedureId && // same order
                    $scope.AsctemplateObj.ASCSurgeryTemplateUserId == selectedDoctorId && // same doctor
                    Aitem.DeleteInd == "N" // not deleted
                );
            }
        );

        if (duplicateInCurrent.length > 0) {
            alertify.error("This doctor + order combination is already added in the template.");
            $scope.AscTemplates.SearchProcedureObj = '';
            return;
        }


        var si = 0, TemplateName = '';
        if ($scope.AscTemplateScreenObj.Tab == 1) {
            angular.forEach($scope.AscTemplateScreenObj.TemplateList, function (mitem) {
                var found = $filter("filter")(mitem.SurgeryArray, function (oitem) {
                    return (
                        oitem.OrgSurgeryId === mainitem.OrganizationProcedureId &&
                        mitem.ASCSurgeryTemplateUserId === selectedDoctorId &&
                        oitem.DeleteInd === "N"
                    );
                }) || [];

                if (found.length > 0) {
                    si++;
                    if (TemplateName === '') {
                        TemplateName = mitem.TemplateName || '';
                    } else {
                        TemplateName += ', ' + (mitem.TemplateName);
                    }
                }
            });
        }

        if (si > 0) {
            alertify.error('This doctor + order is already present in "' + TemplateName + '" template.');
            $scope.AscTemplates.SearchProcedureObj = '';
            return;
        }


        var object = {
            "OrderTypeId": mainitem.OrderTypeId || 3,
            "SurgeryId": mainitem.ProcedureId || 0,
            "DescriptionId": mainitem.ProcedureId || "",
            "Description": mainitem.ProcedureName || "",
            "SurgeryName": mainitem.ProcedureName || "",
            "ProcedureCode": mainitem.ProcedureCode || 0,
            "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
            "OrgSurgeryId": mainitem.OrganizationProcedureId || 0,
            "CPTCode": mainitem.CPTCode,

            "DeleteInd": "N",
        };

        $scope.AsctemplateObj.SurgeryArray.push(object);


        $scope.AscTemplates.SearchProcedureObj = '';
    };

    $scope.PreOpObj = {
        "MedTypeId": 2,

        "OrderDetails": [
            {
                "UserOrderId": 0,
                "UserId": $scope.UserId,
                "DeleteInd": "N",
                "IsOrderReviewed": false,
                "ReviewedByPassword": '',
                "ReviewedByDateTime": null,
                "ReviewedBy": null,
                "UserType": "Nurse",
                "ScreenType": "PreOp",
                "ScreenTypeId": 4,
                "MedTypeId": null,
                "MedTypeName": '',
                "DilationMedications": [],
                "GeneralOrders": [],
                "PreOpMedications": [],
            }
        ],
        "OrgASCChecklist": [],
        "ChunkedClinicalChecklist": [],
        "ChunkedGeneralChecklist": [],
        "AlderetScoreDetails": [],
    }
    $scope.IntraOpObj = {
        "AllIntraOpChecklistsArray": [],
        "OrderDetails": [
            {
                "UserOrderId": 0,
                "UserId": $scope.UserId,
                "DeleteInd": "N",
                "IsOrderReviewed": false,
                "ReviewedByDateTime": null,
                "ReviewedByPassword": '',
                "ReviewedBy": null,
                "UserType": "Nurse",
                "ScreenType": "Intra-OP",
                "ScreenTypeId": 5,
                "MedTypeId": null,
                "MedTypeName": '',
                //"AnesthesiaMedications": [],
                "IntraOpMedications": [],
                "GeneralOrders": [],

            }
        ],
        "IsBeforeAnesthesiaNormal": false,
        "IsBeforeIncisionNormal": false,
        "IsBeforeORNormal": false,
        "NurseActionobj": {
            Cleansed: false,
            CleanContaminated: false,
            Contaminated: false,
            Dirty: false,
        }

    }
    $scope.GetPostOpObj = function () {
        return {
            "OrderDetails": [
                {
                    "UserOrderId": 0,
                    "UserId": $scope.UserId,
                    "DeleteInd": "N",
                    "IsOrderReviewed": false,
                    "ReviewedByDateTime": null,
                    "ReviewedByPassword": '',
                    "ReviewedBy": null,
                    "UserType": "Nurse",
                    "ScreenType": "PostOp",
                    "ScreenTypeId": 6,
                    "MedTypeId": null,
                    "MedTypeName": '',
                    "PostOpMedications": [],
                    "GeneralOrders": [],
                }
            ],
            "OrgASCChecklist": [],
            "CheckinCheckList": [],
            "MasterAscPatientGoal": [],


        }
    }
    $scope.PostOpObj = $scope.GetPostOpObj();

    $scope.GetOperativeNotesObj = function () {
        return {

            "SurgeonOperativeNotes": '',
            "CodeImplants": "",
            "Complications": "",
            "Findings": "",
            "OtherCodes": "",
            "Pathology": "",
            "PatientInstructions": "",
            "PreProcedureNote": "",
            "ProcedureDetails": "",
            "ReasonForVisit": "",
            "CheifComplaints": "",
            "MedicationsPostOP": "",
            "PostProcedureNote": "",
            "PhysicalExam": ""
        }
    }
    $scope.OperativeNotesObj = $scope.GetOperativeNotesObj();
    $scope.GetDischargeObj = function () {
        return {
            "Patientinstruction": '',
            "PatientConditionOnDischarge": '',
            "Finaldisposition": '',
            "ISPatientUnderstandsTheInstructionsBeforeSigningOff": false,

        }
    }
    $scope.DischargeObj = $scope.GetDischargeObj();

    function isAllChecklistChecked(checkListArray) {
        const flatChunkedList = checkListArray.flatMap(item => item);
        const allItems = flatChunkedList.flatMap(mitem => mitem.OrganizationCheckListDetails);
        const yesItems = allItems.filter(item => item.Value === "Yes");
        const isAllYes = yesItems.length > 0 && yesItems.every(item => item.IsChecked);

        const noItems = allItems.filter(item => item.Value === "No");
        const isAllNo = noItems.length > 0 && noItems.every(item => item.IsChecked);

        const naItems = allItems.filter(item => item.Value === "N/A");
        const isAllNA = naItems.length > 0 && naItems.every(item => item.IsChecked);

        return isAllYes ? 1 : (isAllNo ? 2 : (isAllNA ? 3 : null))
    }
    $scope.init = function () {
        //let req1 = {
        //    // "ParentOrganizationId": $scope.ParenthospitalId,
        //    "OrganizationId": $scope.HospitalId,
        //};
        let preopcheckreq = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1,
            "GetAllIndicator": 1
        };

        let intracheckreq = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 2
        };
        let postopreq = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 3
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId),
            eHnoteSurgeryService.GetOrganizationASCCheckListData(preopcheckreq),
            eHnoteSurgeryService.GetOrganizationASCCheckListData(intracheckreq),
            eHnoteSurgeryService.GetOrganizationASCCheckListData(postopreq),
            eHnoteSurgeryService.GetMasterAldreteScoreDetails(),
            eHnoteDiagnosisDataServices.GetAllMasterConsultationData()

        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                angular.forEach(resp[0].data.rows, function (item) {
                    item.AscMedicationId = 0;
                    item.IsChecked = false;
                    item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                });

                let tempPreOpMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 1 }, true);
                $scope.MasterPreOpMedications = angular.copy(tempPreOpMedications) || [];
                let tempDilationMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 2 }, true);
                $scope.MasterDilationMedications = angular.copy(tempDilationMedications);
                let tempanesthesiaMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 3 }, true);
                $scope.MasterAnesthesiaMedications = angular.copy(tempanesthesiaMedications);
                let tempintraopMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 4 }, true);
                $scope.MasterIntraOpMedications = angular.copy(tempintraopMedications);
                let temppostopMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 5 }, true);
                $scope.MasterPostOpMedications = angular.copy(temppostopMedications);


            }
            if (resp[1].data.status === "Success") {
                //if ($scope.ASCSectionsobj.TAB == 1) {


                $scope.PreOpObj.OrgASCChecklist = resp[1].data.rows || [];
                angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });

                $scope.PreOpObj.ChunkedGeneralChecklist = [];
                let tempArrayGeneral = $filter('filter')($scope.PreOpObj.OrgASCChecklist, { 'CheckListCategoryId': 6 }, true);
                let filteredClinicalChecklist1 = angular.copy(tempArrayGeneral);
                if (filteredClinicalChecklist1.length > 0) {
                    filteredClinicalChecklist1.sort(function (a, b) {
                        return a.OrgOrderBy - b.OrgOrderBy;
                    });
                    let chunkSize = Math.ceil((filteredClinicalChecklist1.length) / 2);
                    for (let i = 0; i < filteredClinicalChecklist1.length; i += chunkSize) {
                        $scope.PreOpObj.ChunkedGeneralChecklist.push(filteredClinicalChecklist1.slice(i, i + chunkSize));
                    }
                }
                $scope.PreOpObj.ChunkedClinicalChecklist = [];
                let tempArray = $filter('filter')($scope.PreOpObj.OrgASCChecklist, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true);
                let filteredClinicalChecklist = angular.copy(tempArray);
                if (filteredClinicalChecklist.length > 0) {
                    filteredClinicalChecklist.sort(function (a, b) {
                        return a.OrgOrderBy - b.OrgOrderBy;
                    });
                    let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                    for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                        $scope.PreOpObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                    }
                }

                /*}*/
            }
            if (resp[2].data.status === "Success") {
                $scope.IntraOpObj.AllIntraOpChecklistsArray = [];
                angular.forEach(resp[2].data.rows, function (item) {
                    item.IsChecked = false;
                    if (item.SubCheckList.length > 0) {
                        angular.forEach(item.SubCheckList, function (kitem) {
                            kitem.IsChecked = false;
                        });
                    }
                });
                let tempIntraopChecklistsArray = $filter('filter')(resp[2].data.rows, { 'CheckListModuleId': 2 }, true);
                if (tempIntraopChecklistsArray.length > 0) {
                    $scope.IntraOpObj.AllIntraOpChecklistsArray = angular.copy(tempIntraopChecklistsArray);
                }
                if (resp[2].data.AnaesthesiaTypes.length > 0) {
                    $scope.IntraOpObj.AnesthesiaTypelist = resp[2].data.AnaesthesiaTypes || [];
                }
            }
            if (resp[3].data.status === "Success") {
                resp[3].data.goalsList = resp[3].data.goalsList || [];
                if (resp[3].data.goalsList.length > 0) {
                    $scope.PostOpObj.MasterAscPatientGoal = angular.copy(resp[3].data.goalsList);
                    if ($scope.PostOpObj.MasterAscPatientGoal.length > 0) {
                        angular.forEach($scope.PostOpObj.MasterAscPatientGoal, function (Gitem) {
                            Gitem.Value = "";
                            Gitem.DeleteInd = "N";
                        });
                    }
                }
                $scope.PostOpObj.OrgASCChecklist = angular.copy(resp[3].data.rows) || [];
                angular.forEach($scope.PostOpObj.OrgASCChecklist, function (item) {
                    item.IsChecked = false;
                });

                $scope.PostOpObj.CheckinCheckList = [];
                let tempCheckinCheckList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1 }, true);
                let filteredCheckinCheckList = angular.copy(tempCheckinCheckList);
                if (filteredCheckinCheckList.length > 0) {
                    filteredCheckinCheckList.sort(function (a, b) {
                        return a.OrgOrderBy - b.OrgOrderBy;
                    });
                    let chunkSize = Math.ceil((filteredCheckinCheckList.length) / 2);
                    for (let i = 0; i < filteredCheckinCheckList.length; i += chunkSize) {
                        $scope.PostOpObj.CheckinCheckList.push(filteredCheckinCheckList.slice(i, i + chunkSize));
                    }
                }

                $scope.PostOpObj.ProgressNotesList = [];
                let tempProgressNotesList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 18 }, true) || [];
                let filteredProgressNotesList = angular.copy(tempProgressNotesList) || [];
                if (filteredProgressNotesList.length > 0) {
                    filteredProgressNotesList.sort(function (a, b) {
                        return a.OrgOrderBy - b.OrgOrderBy;
                    });
                    let chunkSize = Math.ceil((filteredProgressNotesList.length) / 2);
                    for (let i = 0; i < filteredProgressNotesList.length; i += chunkSize) {
                        $scope.PostOpObj.ProgressNotesList.push(filteredProgressNotesList.slice(i, i + chunkSize));
                    }
                }

                $scope.PostOpObj.GeneralOrdersList = [];
                let tempGeneralOrderList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 19 }, true) || [];
                let filteredGeneralOrderList = angular.copy(tempGeneralOrderList) || [];
                if (filteredGeneralOrderList.length > 0) {
                    filteredGeneralOrderList.sort(function (a, b) {
                        return a.OrgOrderBy - b.OrgOrderBy;
                    });
                    let chunkSize = Math.ceil((filteredGeneralOrderList.length) / 2);
                    for (let i = 0; i < filteredGeneralOrderList.length; i += chunkSize) {
                        $scope.PostOpObj.GeneralOrdersList.push(filteredGeneralOrderList.slice(i, i + chunkSize));
                    }
                }
                $scope.PostOpObj.CheckoutActionList = [];
                let tempCheckoutActionList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 2 }, true);
                let filteredtCheckoutActionList = angular.copy(tempCheckoutActionList);
                if (filteredtCheckoutActionList.length > 0) {
                    filteredtCheckoutActionList.sort(function (a, b) {
                        return a.OrgOrderBy - b.OrgOrderBy;
                    });
                    let chunkSize = Math.ceil((filteredtCheckoutActionList.length) / 2);
                    for (let i = 0; i < filteredtCheckoutActionList.length; i += chunkSize) {
                        $scope.PostOpObj.CheckoutActionList.push(filteredtCheckoutActionList.slice(i, i + chunkSize));
                    }
                }
                $scope.PostOpObj.PatientInterventionsList = [];
                let tempInterventionsCheckList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListCategoryId': 16 }, true);
                if (tempInterventionsCheckList.length > 0) {
                    $scope.PostOpObj.PatientInterventionsList = angular.copy(tempInterventionsCheckList);
                };
            }
            if (resp[4].data.status === "Success") {
                angular.forEach(resp[4].data.rows, function (item) {
                    item.Value = null;
                    item.IsChecked = false;
                    angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });
                $scope.PreOpObj.AlderetScoreDetails = angular.copy(resp[4].data.rows);
            }
            if (resp[5].data.status === "Success") {
                console.log("resp[5].data", resp[5].data);
                let rosMasterData = resp[5].data;
                $scope.ROSAllergySeverity = rosMasterData.ROSAllergySeverity || [];
                $scope.ROSAllergyStatus = rosMasterData.ROSAllergyStatus || [];
                $scope.ROSAllergyType = rosMasterData.ROSAllergyType || [];
                $scope.FrequentlyOccularHIstory = rosMasterData.OccularHIstory || [];
                angular.forEach($scope.ROSAllergySeverity, function (item) {
                    if (item.ROSAllergySeverityId !== 2 && item.ROSAllergySeverityId !== 4 && item.ROSAllergySeverityId !== 6 && item.ROSAllergySeverityId !== 7) {
                        $scope.ROSocularSeverity.push(item);
                    }
                });
            }
            getMasterCunsultationData();
            GetAllFrequentlyAddedData();
            let SelectedTempItem = $scope.AscTemplateScreenObj.SelectedTempItem || {};   //settingctrlobj
            if (Object.keys(SelectedTempItem).length > 0) {
                console.log("SelectedTempItem", SelectedTempItem);
                $scope.AsctemplateObj.UserSurgeryTemplateId = SelectedTempItem.UserSurgeryTemplateId || 0;
                $scope.AsctemplateObj.ASCSurgeryTemplateUserId = SelectedTempItem.ASCSurgeryTemplateUserId || 0;
                $scope.AsctemplateObj.TemplateName = SelectedTempItem.TemplateName || '';
                $scope.AsctemplateObj.SurgeryArray = SelectedTempItem.SurgeryArray || [];
                $scope.AsctemplateObj.OrganId = SelectedTempItem.OrganId || null;
                let OrderDetails = SelectedTempItem.OrderDetails || [];
                let OrgASCChecklist = SelectedTempItem.OrgASCChecklist || [];
                let AlderetScoreDetails = SelectedTempItem.AlderetScoreDetails || [];
                let tempPatientGoalsArray = SelectedTempItem.AscTemplatePatientGoal || [];
                if (OrgASCChecklist.length > 0) {
                    let PreOpOrgASCChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                        return item.CheckListModuleId == 1;
                    }) || [];
                    if (PreOpOrgASCChecklist.length > 0) {
                        angular.forEach(PreOpOrgASCChecklist, function (item) {
                            angular.forEach($scope.PreOpObj.OrgASCChecklist, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId && kitem.CheckListId === item.CheckListId) {
                                    kitem.IsChecked = true;
                                    kitem.Score = item.Score || 0;
                                    kitem.Value = item.Value || '';
                                    kitem.Remarks = item.Remarks || '';
                                    kitem.intranotes1 = kitem.Remarks !== '';
                                    kitem.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || null;

                                    if ((item.CheckListId === 212 || item.CheckListId === 170) && !$scope.ParentObj.IsIOJParentOrganization) {
                                        if (Array.isArray(item.AscMultiCheckValueArray)) {
                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                    if (hitem.OrganizationPreOpCheckListValueId === jitem.OrganizationPreOpCheckListValueId) {
                                                        hitem.IsChecked = true;
                                                        hitem.AscTemplateMultiCheckListDetailId = jitem.AscTemplateMultiCheckListDetailId || null;
                                                        hitem.AscTemplateCheckListDetailId = jitem.AscTemplateCheckListDetailId || null;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    // SubChecklist
                                    item.SubCheckList = item.SubCheckList || [];
                                    if (item.SubCheckList.length > 0) {
                                        angular.forEach(item.SubCheckList, function (jitem) {
                                            angular.forEach(kitem.SubCheckList, function (hitem) {
                                                if (hitem.SubCheckListId === jitem.SubCheckListId) {
                                                    hitem.IsChecked = true;
                                                    hitem.AscTemplateSubCheckListId = jitem.AscTemplateSubCheckListId || null;
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                            Gitem.IsChecked = (item.OrganizationPreOpCheckListValueId === Gitem.OrganizationPreOpCheckListValueId);
                                        });
                                    }
                                }
                            });
                        });
                        $scope.PreOpObj.FallRiskAssessmentTotalScore = 0;
                        angular.forEach($scope.PreOpObj.OrgASCChecklist, function (Titem) {
                            if ((Titem.IsChecked) && (Titem.CheckListId == 162 || Titem.CheckListId == 163 || Titem.CheckListId == 164 || Titem.CheckListId == 165 || Titem.CheckListId == 166 || Titem.CheckListId == 167)) {
                                Titem.Score = Titem.Score || 0;
                                $scope.PreOpObj.FallRiskAssessmentTotalScore += Titem.Score || 0;
                            }
                        });
                        $scope.PreOpObj.ChunkedGeneralChecklist = [];
                        let tempArrayGeneral = $filter('filter')($scope.PreOpObj.OrgASCChecklist, { 'CheckListCategoryId': 6 }, true);
                        let filteredClinicalChecklist1 = angular.copy(tempArrayGeneral);
                        if (filteredClinicalChecklist1.length > 0) {
                            filteredClinicalChecklist1.sort(function (a, b) {
                                return a.OrgOrderBy - b.OrgOrderBy;
                            });
                            let chunkSize = Math.ceil((filteredClinicalChecklist1.length) / 2);
                            for (let i = 0; i < filteredClinicalChecklist1.length; i += chunkSize) {
                                $scope.PreOpObj.ChunkedGeneralChecklist.push(filteredClinicalChecklist1.slice(i, i + chunkSize));
                            }
                            $scope.PreOpObj.IsAllGeneralCheckListChecked = isAllChecklistChecked($scope.PreOpObj.ChunkedGeneralChecklist);
                        }
                        $scope.PreOpObj.ChunkedClinicalChecklist = [];
                        let tempArray = $filter('filter')($scope.PreOpObj.OrgASCChecklist, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true);
                        let filteredClinicalChecklist = angular.copy(tempArray);
                        if (filteredClinicalChecklist.length > 0) {
                            filteredClinicalChecklist.sort(function (a, b) {
                                return a.OrgOrderBy - b.OrgOrderBy;
                            });
                            let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                            for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                                $scope.PreOpObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                            }
                            $scope.PreOpObj.IsAllNurseCheckListChecked = isAllChecklistChecked($scope.PreOpObj.ChunkedClinicalChecklist)
                        }
                        let medicationCheckList = $scope.PreOpObj.OrgASCChecklist.filter(item => item.CheckListCategoryId === 5);
                        $scope.PreOpObj.IsAllMedicineCheckListChecked = isAllChecklistChecked(medicationCheckList);
                    }

                    let IntraOpOrgASCChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                        return item.CheckListModuleId == 2;
                    }) || [];
                    if (IntraOpOrgASCChecklist.length > 0) {
                        let TempAllIntraOpChecklistArray = [];
                        const multiSelectCheckListIds = [178, 179, 180, 336];

                        angular.forEach(IntraOpOrgASCChecklist, function (item) {
                            angular.forEach($scope.IntraOpObj.AllIntraOpChecklistsArray, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId &&
                                    kitem.CheckListId === item.CheckListId) {

                                    kitem.IsChecked = true;
                                    kitem.Score = item.Score || 0;
                                    kitem.Value = item.Value || '';
                                    kitem.Remarks = item.Remarks || '';
                                    kitem.intranotes1 = kitem.Remarks !== '';
                                    kitem.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || null;

                                    // Special case: 180 with no multi-selects
                                    if (item.CheckListId === 180 && (!item.AscMultiCheckValueArray || item.AscMultiCheckValueArray.length === 0)) {
                                        kitem.IsChecked = false;
                                        kitem.Value = '';
                                    }

                                    // SubChecklist
                                    if (Array.isArray(item.SubCheckList)) {
                                        angular.forEach(item.SubCheckList, function (jitem) {
                                            angular.forEach(kitem.SubCheckList, function (hitem) {
                                                if (hitem.SubCheckListId === jitem.SubCheckListId) {
                                                    hitem.IsChecked = true;
                                                    hitem.AscTemplateSubCheckListId = jitem.AscTemplateSubCheckListId || null;
                                                }
                                            });
                                        });
                                    }

                                    // Multi-check logic
                                    if (multiSelectCheckListIds.includes(item.CheckListCode)) {
                                        if (Array.isArray(item.AscMultiCheckValueArray)) {
                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                    if (hitem.OrganizationPreOpCheckListValueId === jitem.OrganizationPreOpCheckListValueId) {
                                                        hitem.IsChecked = true;
                                                        hitem.AscTemplateMultiCheckListDetailId = jitem.AscTemplateMultiCheckListDetailId || null;
                                                        hitem.AscTemplateCheckListDetailId = jitem.AscTemplateCheckListDetailId || null;

                                                    }
                                                });
                                            });
                                        }
                                    } else {
                                        angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                            Gitem.IsChecked = (item.Value === Gitem.Value);
                                        });
                                    }

                                    TempAllIntraOpChecklistArray.push(angular.copy(kitem));
                                }
                            });
                        });
                    }


                    let PostOpOrgASCChecklist = $filter("filter")(OrgASCChecklist, function (item) {
                        return item.CheckListModuleId == 3;
                    }) || [];
                    if (PostOpOrgASCChecklist.length > 0) {
                        angular.forEach(PostOpOrgASCChecklist, function (item) {
                            angular.forEach($scope.PostOpObj.OrgASCChecklist, function (hitem) {
                                //if (hitem.CheckListId == 139 && !$scope.ParentObj.IsIOJParentOrganization && $scope.PostOpObj.ProgressNotesPainScore !== null) {
                                //    hitem.IsChecked = true;
                                //}
                                if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                    if (item.CheckListId == 132 || item.CheckListId == 136) {
                                        if (item.AscMultiCheckValueArray.length > 0) {
                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                angular.forEach(hitem.OrganizationCheckListDetails, function (Oitem) {
                                                    if (Oitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                        Oitem.IsChecked = true;
                                                        Oitem.AscTemplateMultiCheckListDetailId = jitem.AscTemplateMultiCheckListDetailId || null;
                                                        hitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                        Oitem.AscTemplateCheckListDetailId = jitem.AscTemplateCheckListDetailId || null;
                                                    }
                                                });
                                            });
                                        }

                                    } else {
                                        angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                            if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                                kitem.IsChecked = true;
                                                hitem.IsChecked = true;
                                                hitem.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || 0;
                                                kitem.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || 0;
                                                hitem.Value = item.Value || '';
                                            } else {
                                                kitem.IsChecked = false;
                                            }
                                        });
                                    }
                                }
                            });
                        });

                        $scope.PostOpObj.CheckinCheckList = [];
                        $scope.PostOpObj.CheckoutActionList = [];
                        $scope.PostOpObj.ProgressNotesList = [];
                        $scope.PostOpObj.GeneralOrdersList = [];
                        $scope.PostOpObj.PostopCallList = [];
                        let tempCheckinCheckList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1 }, true);
                        let filteredCheckinCheckList = angular.copy(tempCheckinCheckList);
                        if (filteredCheckinCheckList.length > 0) {
                            filteredCheckinCheckList.sort(function (a, b) {
                                return a.OrgOrderBy - b.OrgOrderBy;
                            });
                            let chunkSize = Math.ceil((filteredCheckinCheckList.length) / 2);
                            for (let i = 0; i < filteredCheckinCheckList.length; i += chunkSize) {
                                $scope.PostOpObj.CheckinCheckList.push(filteredCheckinCheckList.slice(i, i + chunkSize));
                            }
                        }

                        let tempInterventionsCheckList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListCategoryId': 16 }, true);
                        if (tempInterventionsCheckList.length > 0) {
                            $scope.PostOpObj.PatientInterventionsList = angular.copy(tempInterventionsCheckList);
                        };

                        let TempArray = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListCategoryId': 16, 'IsChecked': true, 'Value': 'Yes', 'CheckListId': 241 }, true) || [];

                        if (TempArray.length > 0) {
                            $scope.IsDiscontinueoxygen = true;
                        } else {
                            $scope.IsDiscontinueoxygen = false;
                        }

                        let tempCheckoutActionList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 2 }, true);
                        let filteredtCheckoutActionList = angular.copy(tempCheckoutActionList);
                        if (filteredtCheckoutActionList.length > 0) {
                            filteredtCheckoutActionList.sort(function (a, b) {
                                return a.OrgOrderBy - b.OrgOrderBy;
                            });
                            let chunkSize = Math.ceil((filteredtCheckoutActionList.length) / 2);
                            for (let i = 0; i < filteredtCheckoutActionList.length; i += chunkSize) {
                                $scope.PostOpObj.CheckoutActionList.push(filteredtCheckoutActionList.slice(i, i + chunkSize));
                            }
                            $scope.PostOpObj.IsCheckoutActionListChecked = isAllChecklistChecked($scope.PostOpObj.CheckoutActionList)
                        }

                        let tempProgressNotesList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 18 }, true) || [];
                        let filteredProgressNotesList = angular.copy(tempProgressNotesList) || [];
                        if (filteredProgressNotesList.length > 0) {
                            filteredProgressNotesList.sort(function (a, b) {
                                return a.OrgOrderBy - b.OrgOrderBy;
                            });
                            let chunkSize = Math.ceil((filteredProgressNotesList.length) / 2);
                            for (let i = 0; i < filteredProgressNotesList.length; i += chunkSize) {
                                $scope.PostOpObj.ProgressNotesList.push(filteredProgressNotesList.slice(i, i + chunkSize));
                            }
                        }

                        let tempGeneralOrderList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 19 }, true) || [];
                        let filteredGeneralOrderList = angular.copy(tempGeneralOrderList) || [];
                        if (filteredGeneralOrderList.length > 0) {
                            filteredGeneralOrderList.sort(function (a, b) {
                                return a.OrgOrderBy - b.OrgOrderBy;
                            });
                            let chunkSize = Math.ceil((filteredGeneralOrderList.length) / 2);
                            for (let i = 0; i < filteredGeneralOrderList.length; i += chunkSize) {
                                $scope.PostOpObj.GeneralOrdersList.push(filteredGeneralOrderList.slice(i, i + chunkSize));
                            }
                        }


                        let temppostopcallList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 21 }, true) || [];
                        if (temppostopcallList.length > 0) {
                            $scope.PostOpObj.PostopCallList = angular.copy(temppostopcallList);
                        }
                    }

                }
                if (AlderetScoreDetails.length > 0) {
                    angular.forEach($scope.PreOpObj.AlderetScoreDetails, function (hitem) {
                        angular.forEach(hitem.AldreteScoreDetailTypes, function (kitem) {

                            let savedaldret = $filter("filter")(AlderetScoreDetails, function (sitem) {
                                return (sitem.AldreteScoreDetailTypeId === kitem.AldreteScoreDetailTypeId);
                            }) || [];
                            if (savedaldret.length > 0) {
                                kitem.IsChecked = true;
                                hitem.IsChecked = true;
                                hitem.Value = kitem.AldreteScore;
                                hitem.AldreteScoreDetailTypeName = kitem.AldreteScoreDetailTypeName;
                                hitem.AlderetScoreTemplateDetailId = savedaldret[0].AlderetScoreTemplateDetailId || 0;
                            }

                        });
                    });

                    //angular.forEach(AlderetScoreDetails, function (item) {
                    //    angular.forEach($scope.PreOpObj.AlderetScoreDetails, function (hitem) {
                    //        angular.forEach(hitem.AldreteScoreDetailTypes, function (kitem) {
                    //            if (kitem.AldreteScoreDetailTypeId === item.AldreteScoreDetailTypeId) {
                    //                if (item.DeleteInd == "N") {
                    //                    kitem.IsChecked = true;
                    //                    hitem.IsChecked = true;
                    //                    hitem.Value = kitem.AldreteScore;
                    //                    hitem.AldreteScoreDetailTypeName = kitem.AldreteScoreDetailTypeName;
                    //                    hitem.AlderetScoreTemplateDetailId = item.AlderetScoreTemplateDetailId  || 0;
                    //                }
                    //            }
                    //        });
                    //    });
                    //});
                }

                if (SelectedTempItem.IntraOp != undefined && SelectedTempItem.IntraOp.NurseActions != undefined) {
                    $scope.IntraOpObj.NurseActionobj.IntraOPNurseTemplateActionId = SelectedTempItem.IntraOp.NurseActions.IntraOPNurseTemplateActionId || 0;

                    $scope.IntraOpObj.NurseActionobj.CleanContaminated = SelectedTempItem.IntraOp.NurseActions.CleanContaminated || null;
                    $scope.IntraOpObj.NurseActionobj.Cleansed = SelectedTempItem.IntraOp.NurseActions.Cleansed || null;
                    $scope.IntraOpObj.NurseActionobj.Contaminated = SelectedTempItem.IntraOp.NurseActions.Contaminated || null;
                    $scope.IntraOpObj.NurseActionobj.Dirty = SelectedTempItem.IntraOp.NurseActions.Dirty || null;

                }

                if (SelectedTempItem.PostSurgery != undefined && SelectedTempItem.PostSurgery.DischargeSummury != undefined) {
                    $scope.DischargeObj = SelectedTempItem.PostSurgery.DischargeSummury || $scope.GetDischargeObj();

                    if ($scope.DischargeObj.FinalDisposition) {
                        $scope.DischargeObj.Finaldisposition = $scope.DischargeObj.FinalDisposition.replace(/<br>/g, '\n');
                    }
                    if ($scope.DischargeObj.PatientInstruction) {
                        $scope.DischargeObj.Patientinstruction = $scope.DischargeObj.PatientInstruction.replace(/<br>/g, '\n');
                    }
                    $scope.DischargeObj.ISPatientUnderstandsTheInstructionsBeforeSigningOff = $scope.DischargeObj.IsPatientUnderstandsTheInstructionsBeforeSigningOff || false;
                }
                if (SelectedTempItem.PostSurgery != undefined && SelectedTempItem.PostSurgery.OperativeNotes != undefined) {
                    $scope.OperativeNotesObj = SelectedTempItem.PostSurgery.OperativeNotes || $scope.GetOperativeNotesObj();
                }

                if (SelectedTempItem.PostSurgery) {
                    let postSuregeryItem = angular.copy(SelectedTempItem.PostSurgery)
                    $scope.OperativeNotesObj.CodeImplants = postSuregeryItem.CodeImplants || "";
                    $scope.OperativeNotesObj.Complications = postSuregeryItem.Complications || "";
                    $scope.OperativeNotesObj.Findings = postSuregeryItem.Findings || "";
                    $scope.OperativeNotesObj.OtherCodes = postSuregeryItem.OtherCodes || "";
                    $scope.OperativeNotesObj.Pathology = postSuregeryItem.Pathology || "";
                    $scope.OperativeNotesObj.PatientInstructions = postSuregeryItem.PatientInstructions || "";
                    $scope.OperativeNotesObj.PreProcedureNote = postSuregeryItem.PreProcedureNote || "";
                    $scope.OperativeNotesObj.ProcedureDetails = postSuregeryItem.ProcedureDetails || "";
                    $scope.OperativeNotesObj.ReasonForVisit = postSuregeryItem.ReasonForVisit || "";
                    $scope.OperativeNotesObj.CheifComplaints = postSuregeryItem.CheifComplaints || "";
                    $scope.OperativeNotesObj.MedicationsPostOP = postSuregeryItem.MedicationsPostOP || "";
                    $scope.OperativeNotesObj.PostProcedureNote = postSuregeryItem.PostProcedureNote || "";
                    $scope.OperativeNotesObj.PhysicalExam = postSuregeryItem.PhysicalExam || "";
                    $scope.OperativeNotesObj.Diagnosis = postSuregeryItem.Diagnosis || [];
                    if ($scope.OperativeNotesObj.Diagnosis && $scope.OperativeNotesObj.Diagnosis.length > 0) {
                        $scope.OperativeNotesObj.Diagnosis.forEach(item => {
                            item.ICDCode = item.ICD10CODE || "";
                            item.IsLocation2Added = !!(item.LocationId2 || item.SeverityId2 || item.DiagnosisStatusId2)
                        })
                    }
                    $scope.ocularObj.OccularHistoryArray = postSuregeryItem.OccularHistoryArray || [];
                    $scope.ocularObj.OccularHistoryRemarks = postSuregeryItem.OccularHistoryRemarks || "";
                    $scope.ocularObj.OccularHistoryNotesInd = !!(postSuregeryItem.OccularHistoryRemarks);
                    $scope.ocularObj.OccularHistoryArray.forEach(item => {
                        item.ShowNote = !!(item.Remarks);
                    })
                    $scope.PrescriptionMainAddObj.PrescriptionDetails = postSuregeryItem.PrescriptionArray || [];
                    if ($scope.PrescriptionMainAddObj.PrescriptionDetails && $scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.forEach(item => {
                            item.SigObj = item.Sig;
                        })
                    }
                    $scope.Surgeryobj.Investigationslist = postSuregeryItem.InvestigationsList || [];
                    if ($scope.Surgeryobj.Investigationslist && $scope.Surgeryobj.Investigationslist.length > 0) {
                        $scope.Surgeryobj.Investigationslist.forEach(item => {
                            item.ProcedureCode = item.DescriptionCode || '';
                            item.LocationId = item.OrganId || '';
                            item.IsNoteEdit = !!(item.Notes);
                            item.InvestigationNotes = item.Notes;
                        })
                    }
                }
                if (tempPatientGoalsArray.length > 0) {
                    angular.forEach(tempPatientGoalsArray, function (item) {
                        angular.forEach($scope.PostOpObj.MasterAscPatientGoal, function (kitem) {
                            if (kitem.MasterPatientGoalId === item.MasterPatientGoalId) {
                                kitem.Value = item.Value || "";
                                kitem.ASCTemplatePatientGoalId = item.ASCTemplatePatientGoalId || null;
                            }
                        });
                    });
                    const isAllYes = $scope.PostOpObj.MasterAscPatientGoal.every(item => item.Value === "Yes");
                    const isAllNo = $scope.PostOpObj.MasterAscPatientGoal.every(item => item.Value === "No");
                    $scope.PostOpObj.IsAllMasterAscPatientGoalChecked = isAllYes ? 1 : (isAllNo ? 2 : null);
                    //    $scope.LogObj.PatientAscPatientGoal = angular.copy(tempPatientGoalsArray) || [];
                }
            }

        });
    }
    $scope.OrdersTabinit = function () {
        let req1 = {
            // "ParentOrganizationId": $scope.ParenthospitalId,
            "OrganizationId": $scope.HospitalId,
        };
        $q.all([
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId),
            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),


        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                angular.forEach(resp[0].data.rows, function (item) {
                    item.AscMedicationId = 0;
                    item.IsChecked = false;
                    item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                });

                let tempPreOpMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 1 }, true);
                $scope.MasterPreOpMedications = angular.copy(tempPreOpMedications) || [];
                let tempDilationMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 2 }, true);
                $scope.MasterDilationMedications = angular.copy(tempDilationMedications);
                let tempanesthesiaMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 3 }, true);
                $scope.MasterAnesthesiaMedications = angular.copy(tempanesthesiaMedications);
                let tempintraopMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 4 }, true);
                $scope.MasterIntraOpMedications = angular.copy(tempintraopMedications);
                let temppostopMedications = $filter('filter')(resp[0].data.rows, { "MedTypeId": 5 }, true);
                $scope.MasterPostOpMedications = angular.copy(temppostopMedications);


            }
            let SelectedTempItem = $scope.AscTemplateScreenObj.SelectedTempItem || {};   //settingctrlobj
            if (Object.keys(SelectedTempItem).length > 0) {
                $scope.AsctemplateObj.UserSurgeryTemplateId = SelectedTempItem.UserSurgeryTemplateId || 0;
                $scope.AsctemplateObj.ASCSurgeryTemplateUserId = SelectedTempItem.ASCSurgeryTemplateUserId || 0;
                $scope.AsctemplateObj.ASCCounselorSurgeryTemplateUserId = SelectedTempItem.ASCCounselorSurgeryTemplateUserId || 0;//IDENTITY needto change
                $scope.AsctemplateObj.ASCCounselorSurgeryTemplateId = SelectedTempItem.ASCCounselorSurgeryTemplateId || 0;//IDENTITY
                $scope.PreviousSelectUserId = SelectedTempItem.ASCSurgeryTemplateUserId || 0;
                $scope.AsctemplateObj.TemplateName = SelectedTempItem.TemplateName || '';
                $scope.AsctemplateObj.SurgeryArray = SelectedTempItem.SurgeryArray || [];
                $scope.AsctemplateObj.OrganId = SelectedTempItem.OrganId || null;

                // Load Labs & Studies in Edit mode
                $scope.SetLabsStudiesFromTemplate(SelectedTempItem, false);

                // Load Coordinator Checklist in Edit mode
                $scope.SetCoordinatorChecklistFromTemplate(SelectedTempItem, false);

                // Labs & Studies Reviewed By / Patient-Guardian signature are set on the Coordinator Orders summary; the popup
                // only carries them through so a popup Save does not clear them (helper on the parent USAddUpdateAssessmentpopupCtrl)
                $scope.CopyLabsStudiesSummaryFields($scope.AsctemplateObj, SelectedTempItem);

                let OrderDetails = SelectedTempItem.OrderDetails || [];
                if (OrderDetails.length > 0) {
                    let preopOrderDetails = [], IntraopOrderDetails = [], PostOpOrderDetails = [];
                    preopOrderDetails = $filter("filter")(OrderDetails, function (item) {
                        return (item.MedTypeId === 1 && ((item.AscMedications && item.AscMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                            (item.MedTypeId === 2 && ((item.AscMedications && item.AscMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
                    }) || [];
                    if (preopOrderDetails.length > 0) {
                        angular.forEach(preopOrderDetails, function (item) {
                            if (item.MedTypeId === 1) {
                                item.PreOpMedications = item.AscMedications || [];
                            } else {
                                item.DilationMedications = item.AscMedications || [];
                            }

                        });
                        $scope.PreOpObj.OrderDetails = preopOrderDetails || [];
                    }

                    IntraopOrderDetails = $filter("filter")(OrderDetails, function (item) {
                        return (item.MedTypeId === 3 && ((item.AscMedications && item.AscMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                            (item.MedTypeId === 4 && ((item.AscMedications && item.AscMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
                    }) || [];
                    if (IntraopOrderDetails.length > 0) {
                        angular.forEach(IntraopOrderDetails, function (item) {
                            if (item.MedTypeId === 3) {
                                item.IntraOpMedications = item.AscMedications || [];
                            } else {
                                item.IntraOpMedications = item.AscMedications || [];
                            }

                        });
                        $scope.IntraOpObj.OrderDetails = IntraopOrderDetails || [];
                    }


                    PostOpOrderDetails = $filter("filter")(OrderDetails, function (item) {
                        return (item.MedTypeId === 5 && ((item.AscMedications && item.AscMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                            (item.MedTypeId === 8 && ((item.AscMedications && item.AscMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
                    }) || [];
                    if (PostOpOrderDetails.length > 0) {
                        angular.forEach(PostOpOrderDetails, function (item) {
                            if (item.MedTypeId === 5) {
                                item.PostOpMedications = item.AscMedications || [];
                            } else {
                                item.PostOpMedications = item.AscMedications || [];
                            }

                        });
                        $scope.PostOpObj.OrderDetails = PostOpOrderDetails || [];
                    }


                }

            }


            if (resp[1].data.status === "Success") {
                $scope.DoseArray = resp[1].data.doseArray || [];
                $scope.DoseOtherArray = resp[1].data.doseOtherArray || [];
                $scope.FrequencyArray = resp[1].data.frequencyArray || [];
                $scope.RefillsArray = resp[1].data.refillsArray || [];
                $scope.DurationArray = resp[1].data.durationArray || [];
                $scope.ActionArray = resp[1].data.actionArray || [];
                $scope.RouteArray = resp[1].data.routeArray || [];
                $scope.DoseUnitArray = resp[1].data.doseUnitArray || [];
                $scope.QuantityUnitArray = resp[1].data.quantityUnitArray || [];

                $scope.doseArray = resp[1].data.doseArray || [];
                $scope.doseOtherArray = resp[1].data.doseOtherArray || [];
                $scope.frequencyArray = resp[1].data.frequencyArray || [];
                $scope.refillsArray = resp[1].data.refillsArray || [];
                $scope.durationArray = resp[1].data.durationArray || [];
                $scope.actionArray = resp[1].data.actionArray || [];
                $scope.routeArray = resp[1].data.routeArray || [];
                $scope.doseUnitArray = resp[1].data.doseUnitArray || [];
                $scope.quantityUnitArray = resp[1].data.quantityUnitArray || [];
                $scope.MedicationStopReasons = resp[1].data.MedicationStopReasons || [];
            }
        });
    }
    if ($scope.AscTemplateScreenObj.Tab == 2) {
        $scope.init();
    } else {
        $scope.OrdersTabinit();
    }
    $scope.switchtemplatestabs = function (tab) {
        $scope.temptab = tab;
        $scope.TempPreOpObj = {
            "OrderType": "",
            "OrderName": ""
        }
    }
    $scope.GetOrganizationProcedure = function (text) {
        var params = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "CPTCODE": "",
            "SearchText": text || "",
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "Status": 1,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        if (params.SearchText == '') {
            params.IsFrequent = 'Y';
        }

        return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows
                    .filter(function (item) {
                        return item.IsActive == true && Number(item.OrderTypeId) == 3;
                    })
                    .map(function (item) {
                        return item;
                    });
            }
        });
    };
    $scope.ChangeAdvised = function () {
        $scope.ProcedureListFocus = false;
    }
    $scope.OnClickTemplate = function (item) {
        if (item.CPTCode == null || item.CPTCode == undefined || item.CPTCode == "") {
            item.CPTCode == null
        }
        if (item.CPTCode == null) {
            alertify.error("No CPT Available selected Code.");
            mainitem.ServiceObj = "";
            return false;
        }
    }
    $scope.GetOrganizationMedicationlist = function (text, val) {
        val = val || null;
        let req = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 20,
            "SearchText": text || '',
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "IsFrequent": "N",
            "MedTypeId": val,
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        //if (req.SearchKey == "") {
        //    req.IsFrequent = "Y";
        //}
        return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.MedicineList !== undefined) {
                    var list1 = [];
                    angular.forEach(resp.data.MedicineList, function (item) {
                        if (item.MedTypeId == val || item.MedTypeId == null) {
                            list1.push(item);
                        }
                    });
                    return list1.map(function (item) {
                        return item;

                    });
                }
            }
        });
    }

    $scope.AddGeneralOrder = function () {
        if ($scope.TempDilationMedicationObj.OrderName == '') {
            alertify.error("Please Enter General Orders!");
            return false;
        }
        //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": $scope.PreOpObj.MedTypeId, 'IsOrderReviewed': false }, true);
        let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
            return poitem.MedTypeId === $scope.PreOpObj.MedTypeId && poitem.DeleteInd == 'N';
        }) || [];
        if (templist.length > 0) {
            let Gobj = {
                "GeneralOrderId": null,
                "MedicineName": $scope.TempDilationMedicationObj.OrderName || '',
                "DeleteInd": "N",
                "Status": "",
                "MedicationTime": "",

            }
            templist[0].GeneralOrders.push(Gobj);
            $scope.TempDilationMedicationObj.OrderName = "";
        } else {
            //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
            let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
                return poitem.MedTypeId === null && poitem.DeleteInd == 'N' && poitem.ReviewedBy == null;
            }) || [];
            if (templist2.length > 0) {
                templist2[0].MedTypeId = $scope.PreOpObj.MedTypeId;
                //    templist2[0].MedTypeName = 'Dilation Medication';
            } else {
                //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.PreOpObj.MedTypeId }, true) || [];
                let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
                    return poitem.MedTypeId === $scope.PreOpObj.MedTypeId && poitem.DeleteInd == 'N' && poitem.ReviewedBy == null;
                }) || [];
                if (templist3.length > 0) {

                } else {
                    var obj = {
                        "UserSurgeryOrderTemplateDetailId": 0,
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByPassword": '',
                        "ReviewedByDateTime": null,
                        "ReviewedBy": null,
                        "UserType": "Nurse",
                        "ScreenType": "PreOp",
                        "ScreenTypeId": 4,
                        "MedTypeId": $scope.PreOpObj.MedTypeId,
                        "MedTypeName": '',
                        "DilationMedications": [],
                        "PreOpMedications": [],
                        "GeneralOrders": [],
                    }
                    $scope.PreOpObj.OrderDetails.push(obj);
                }

            }


            //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.PreOpObj.MedTypeId }, true) || [];
            let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
                return poitem.MedTypeId === $scope.PreOpObj.MedTypeId && poitem.DeleteInd == 'N' && poitem.ReviewedBy == null;
            }) || [];

            if (templist1.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.TempDilationMedicationObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",

                }
                templist1[0].GeneralOrders.push(Gobj);
                $scope.TempDilationMedicationObj.OrderName = "";
            } else {

            }
        }
    }

    $scope.OnIVAccessChecklistSelect = function (sitem, MItem) {
        if (sitem.IsChecked == true) {
            sitem.AscTemplateCheckListDetailId = sitem.AscTemplateCheckListDetailId || 0;
            if (sitem.AscTemplateCheckListDetailId !== 0) {
                sitem.DeleteInd = 'Y';
            }
            MItem.IsChecked = false;
            sitem.IsChecked = false;
        } else {
            MItem.IsChecked = true;
            sitem.IsChecked = true;
        }
    };


    $scope.SavesettingtemplateData = function () {
        $scope.AsctemplateObj.TemplateName = $scope.AsctemplateObj.TemplateName || '';
        if ($scope.AsctemplateObj.TemplateName == '') {
            alertify.error('Please Enter TemplateName');
            return;
        }
        if (!$scope.AsctemplateObj.OrganId) {
            alertify.error('Please Select Organ');
            return;
        }
        if ($scope.AsctemplateObj.SurgeryArray.length == 0) {
            alertify.error('Please Select Surgery');
            return;
        }
        //if ($scope.AsctemplateObj.ASCSurgeryTemplateUserId== 0) {
        //    alertify.error('Please Select Template Doctor');
        //    return;
        //}
        //preop 
        let PreopFinalOrderDetails = [];
        let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 1 && ((item.PreOpMedications && item.PreOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 2 && ((item.DilationMedications && item.DilationMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (templist.length > 0) {
            PreopFinalOrderDetails = templist || [];
        }
        //$scope.AsctemplateObj.PreOp.OrderDetails = PreopFinalOrderDetails || [];

        let PreopOrgASCChecklist = [];
        angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
            //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);

            let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
            let checkedvalue;
            if (checkedvaluearray.length > 0) {
                checkedvalue = checkedvaluearray[0];
            }
            if (checkedvalue !== undefined) {
                if (item.CheckListCategoryId !== 11 && item.CheckListCategoryId !== 1 && item.CheckListCategoryId !== 6 && item.CheckListCategoryId !== 7) {

                    if (item.CheckListId !== 212) {
                        if (checkedvalue.CheckListId === item.CheckListId) {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "DeleteInd": checkedvalue.DeleteInd || 'N',
                                "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                                "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                                "ChecklistDate": item.ChecklistDate,
                                "Remarks": item.Remarks,
                                "SubCheckList": [],

                            };


                            PreopOrgASCChecklist.push(obj);
                        }
                    } else {
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "OrganizationPreOpCheckListValueId": null,
                            "Value": item.Value || "",
                            "SubCheckList": [],
                            "Remarks": item.Remarks || "",
                            "DeleteInd": item.DeleteInd || "N",
                            "Score": item.Score || 0,
                            "AscMultiCheckValueArray": []
                        };

                        if (item.OrganizationCheckListDetails.length > 0) {
                            angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                hitem.AscTemplateMultiCheckListDetailId = hitem.AscTemplateMultiCheckListDetailId || 0;
                                hitem.IsChecked = hitem.IsChecked || false;
                                if (hitem.AscTemplateMultiCheckListDetailId != 0 && hitem.IsChecked == false) {
                                    hitem.DeleteInd = "Y";
                                }

                                if (hitem.IsChecked == true || hitem.AscTemplateMultiCheckListDetailId != 0) {
                                    let object = {
                                        "CheckListId": hitem.CheckListId,
                                        "AscTemplateMultiCheckListDetailId": hitem.AscTemplateMultiCheckListDetailId || 0,
                                        "DeleteInd": hitem.DeleteInd,
                                        "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                        "Value": hitem.Value,
                                        "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,

                                    };
                                    obj.AscMultiCheckValueArray.push(object);
                                }
                            });
                        }
                        if (obj.AscMultiCheckValueArray.length > 0) {
                            PreopOrgASCChecklist.push(obj);
                        }
                    }
                }
            } else if (item.CheckListCategoryId == 7) {
                item.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || 0;
                if (item.IsChecked || (item.AscTemplateCheckListDetailId != 0 && item.IsChecked == false)) {
                    let DeleteInd = 'N';
                    if (item.AscTemplateCheckListDetailId != 0 && item.IsChecked == false) {
                        DeleteInd = 'Y';
                    }
                    let obj = {
                        "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                        "CheckListId": item.CheckListId,
                        "CheckListName": item.CheckListName,
                        "CheckListCode": item.CheckListCode,
                        "CheckListModuleId": item.CheckListModuleId,
                        "CheckListCategoryId": item.CheckListCategoryId,
                        "CheckListSubTypeId": item.CheckListSubTypeId,
                        "ParentOrganizationId": item.ParentOrganizationId,
                        "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                        "OrganizationPreOpCheckListValueId": null,
                        "Value": item.Value || "",
                        "SubCheckList": [],
                        "Remarks": item.Remarks || "",
                        "DeleteInd": DeleteInd || "N",
                        "Score": item.Score || 0,
                        "AscMultiCheckValueArray": []
                    };

                    //if (item.SubCheckList.length > 0) {
                    //    angular.forEach(item.SubCheckList, function (hitem) {
                    //        hitem.PatientAscSubCheckListId = hitem.PatientAscSubCheckListId || 0;
                    //        if (hitem.IsChecked || (hitem.PatientAscSubCheckListId != 0 && hitem.IsChecked == false)) {
                    //            hitem.DeleteInd = 'N';
                    //            if (hitem.PatientAscSubCheckListId != 0 && hitem.IsChecked == false) {
                    //                hitem.DeleteInd = 'Y';
                    //            }
                    //            obj.SubCheckList.push(hitem);
                    //        }
                    //    });
                    //}
                    if (item.SubCheckList.length > 0) {
                        angular.forEach(item.SubCheckList, function (hitem) {
                            hitem.AscTemplateSubCheckListId = hitem.AscTemplateSubCheckListId || 0;
                            if (hitem.IsChecked || (hitem.AscTemplateSubCheckListId != 0 && hitem.IsChecked == false)) {
                                hitem.DeleteInd = 'N';
                                if (hitem.AscTemplateSubCheckListId != 0 && hitem.IsChecked == false) {
                                    hitem.DeleteInd = 'Y';
                                }
                                obj.SubCheckList.push(hitem);
                            }
                        });
                    }
                    PreopOrgASCChecklist.push(obj);
                }
            }
        });



        angular.forEach($scope.PreOpObj.ChunkedClinicalChecklist, function (kitem) {
            angular.forEach(kitem, function (item) {
                //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);

                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": checkedvalue.DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks,
                        };
                        PreopOrgASCChecklist.push(obj);
                    }
                }
            });

        });

        angular.forEach($scope.PreOpObj.ChunkedGeneralChecklist, function (kitem) {
            angular.forEach(kitem, function (item) {
                //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": checkedvalue.DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks,
                        };
                        PreopOrgASCChecklist.push(obj);
                    }
                }
            });

        });
        if ($scope.PreOpObj.OrgASCChecklist.length > 0) {
            angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                if (item.CheckListCategoryId == 11) {
                    item.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || 0;
                    if (item.IsChecked || (item.AscTemplateCheckListDetailId != 0 && item.IsChecked == false)) {
                        let DeleteInd = 'N';
                        if (item.AscTemplateCheckListDetailId != 0 && item.IsChecked == false) {
                            DeleteInd = 'Y';
                        }
                        let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                        let checkedvalue;
                        if (checkedvaluearray.length > 0) {
                            checkedvalue = checkedvaluearray[0];
                        }

                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": item.Value || "",
                            "SubCheckList": [],
                            "Remarks": item.Remarks || "",
                            /*"OrganizationCheckListDetails": [],*/
                            "DeleteInd": DeleteInd || "N",
                            "Score": item.Score || 0,
                        };

                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (hitem) {
                                hitem.AscTemplateSubCheckListId = hitem.AscTemplateSubCheckListId || 0;
                                if (hitem.IsChecked || (hitem.AscTemplateSubCheckListId != 0 && hitem.IsChecked == false)) {
                                    hitem.DeleteInd = 'N';
                                    if (hitem.AscTemplateSubCheckListId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = 'Y';
                                    }
                                    obj.SubCheckList.push(hitem);
                                }
                            });
                        }
                        PreopOrgASCChecklist.push(obj);
                    }
                }
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (item.CheckListCategoryId == 1) {
                        if (checkedvalue.CheckListId === 168 || checkedvalue.CheckListId === 169 || item.CheckListId === 191) {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "DeleteInd": checkedvalue.DeleteInd || 'N',
                                "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                                "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                                "ChecklistDate": item.ChecklistDate,
                                "Remarks": item.Remarks,
                            };
                            PreopOrgASCChecklist.push(obj);
                        }

                        if (checkedvalue.CheckListId == 170) {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "OrganizationPreOpCheckListValueId": null,
                                "Value": item.Value || "",
                                "SubCheckList": [],
                                "Remarks": item.Remarks || "",
                                "DeleteInd": item.DeleteInd || "N",
                                "Score": item.Score || 0,
                                "AscMultiCheckValueArray": []
                            };

                            if (item.OrganizationCheckListDetails.length > 0) {
                                angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                    hitem.AscTemplateMultiCheckListDetailId = hitem.AscTemplateMultiCheckListDetailId || 0;
                                    hitem.IsChecked = hitem.IsChecked || false;
                                    if (hitem.AscTemplateMultiCheckListDetailId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = "Y";
                                    }

                                    if (hitem.IsChecked == true || hitem.AscTemplateMultiCheckListDetailId != 0) {
                                        let object = {
                                            "CheckListId": hitem.CheckListId,
                                            "AscTemplateMultiCheckListDetailId": hitem.AscTemplateMultiCheckListDetailId || 0,
                                            "DeleteInd": hitem.DeleteInd,
                                            "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                            "Value": hitem.Value,
                                            "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,
                                        };
                                        obj.AscMultiCheckValueArray.push(object);
                                    }
                                });
                            }
                            if (obj.AscMultiCheckValueArray.length > 0) {
                                PreopOrgASCChecklist.push(obj);
                            }
                        };
                    }
                }
            });
        }
        $scope.AsctemplateObj.PreOp.OrgASCChecklist = PreopOrgASCChecklist || [];


        let alderetScoreDetailsArray = [];
        angular.forEach($scope.PreOpObj.AlderetScoreDetails, function (item) {
            let selectedTypearray = $filter('filter')(item.AldreteScoreDetailTypes, { "IsChecked": true }, true);
            let selectedType;
            selectedTypearray = selectedTypearray || [];
            if (selectedTypearray.length > 0) {
                selectedType = selectedTypearray[0];
            }
            if (selectedTypearray.length > 0) {
                let obj = {
                    "AlderetScoreTemplateDetailId": item.AlderetScoreTemplateDetailId || 0,
                    "AldreteScoreTypeId": item.AldreteScoreTypeId,
                    "AldreteScoreTypeName": item.AldreteScoreTypeName,
                    "Value": item.Value,
                    "IsChecked": item.IsChecked,
                    "AldreteScoreDetailTypeId": (selectedType != undefined) ? selectedType.AldreteScoreDetailTypeId : null,
                    "AldreteScoreDetailTypeName": (selectedType != undefined) ? selectedType.AldreteScoreDetailTypeName : "",
                    "DeleteInd": item.DeleteInd,
                };
                alderetScoreDetailsArray.push(obj);
            }
        });

        $scope.AsctemplateObj.PreOp.AlderetScoreDetails = angular.copy(alderetScoreDetailsArray);


        //intraop
        let IntraOpFinalOrderDetails = [];
        let Intralist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 3 && ((item.IntraOpMedications && item.IntraOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 4 && ((item.IntraOpMedications && item.IntraOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (Intralist.length > 0) {
            IntraOpFinalOrderDetails = Intralist || [];
        }
        //$scope.AsctemplateObj.IntraOp.OrderDetails = IntraOpFinalOrderDetails || [];






        let IntraOpOrgASCChecklist = [];
        if ($scope.IntraOpObj.AllIntraOpChecklistsArray.length > 0) {
            IntraOpOrgASCChecklist = [];
            angular.forEach($scope.IntraOpObj.AllIntraOpChecklistsArray, function (item) {
                if (item.CheckListId != 180 && item.CheckListId != 178 && item.CheckListId != 179 && item.CheckListCode != 336) {
                    item.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || 0;
                    if (item.IsChecked || (item.AscTemplateCheckListDetailId != 0 && item.IsChecked == false)) {
                        let DeleteInd = 'N';
                        if (item.AscTemplateCheckListDetailId != 0 && item.IsChecked == false) {
                            DeleteInd = 'Y';
                        }
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "OrganizationPreOpCheckListValueId": null,
                            "Value": item.Value || "",
                            "SubCheckList": [],
                            "Remarks": item.Remarks || "",
                            /*"OrganizationCheckListDetails": [],*/
                            "DeleteInd": DeleteInd || "N",
                            "Score": item.Score || 0,
                            "AscMultiCheckValueArray": []
                        };

                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (hitem) {
                                hitem.AscTemplateSubCheckListId = hitem.AscTemplateSubCheckListId || 0;
                                if (hitem.IsChecked || (hitem.AscTemplateSubCheckListId != 0 && hitem.IsChecked == false)) {
                                    hitem.DeleteInd = 'N';
                                    if (hitem.AscTemplateSubCheckListId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = 'Y';
                                    }
                                    obj.SubCheckList.push(hitem);
                                }
                            });
                        }
                        IntraOpOrgASCChecklist.push(obj);
                    }
                } else {

                    let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                    let checkedvalue;
                    if (checkedvaluearray.length > 0) {
                        checkedvalue = checkedvaluearray[0];
                    }
                    if (checkedvalue !== undefined) {
                        if (checkedvalue.CheckListId == 180 || checkedvalue.CheckListId == 178 || checkedvalue.CheckListId == 179 || item.CheckListCode == 336) {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "OrganizationPreOpCheckListValueId": null,
                                "Value": item.Value || "",
                                "SubCheckList": [],
                                "Remarks": item.Remarks || "",
                                "DeleteInd": item.DeleteInd || "N",
                                "Score": item.Score || 0,
                                "AscMultiCheckValueArray": []
                            };

                            if (item.OrganizationCheckListDetails.length > 0) {
                                angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                    hitem.AscTemplateMultiCheckListDetailId = hitem.AscTemplateMultiCheckListDetailId || 0;
                                    hitem.IsChecked = hitem.IsChecked || false;
                                    if (hitem.AscTemplateMultiCheckListDetailId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = "Y";
                                    }

                                    if (hitem.IsChecked == true || hitem.AscTemplateMultiCheckListDetailId != 0) {
                                        let object = {
                                            "CheckListId": hitem.CheckListId,
                                            "AscTemplateMultiCheckListDetailId": hitem.AscTemplateMultiCheckListDetailId || 0,
                                            "DeleteInd": hitem.DeleteInd,
                                            "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                            "Value": hitem.Value,
                                            "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,
                                        };
                                        obj.AscMultiCheckValueArray.push(object);
                                    }
                                });
                            }
                            if (obj.AscMultiCheckValueArray.length > 0) {
                                IntraOpOrgASCChecklist.push(obj);
                            }
                        };

                    }
                }
            });
        }
        $scope.AsctemplateObj.IntraOp.OrgASCChecklist = IntraOpOrgASCChecklist || [];
        $scope.AsctemplateObj.IntraOp.NurseActions = $scope.IntraOpObj.NurseActionobj || {};

        //postop
        let postopOrgASCChecklist = [];
        angular.forEach($scope.PostOpObj.CheckinCheckList, function (kitem) {
            angular.forEach(kitem, function (item) {
                //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }

                if (checkedvalue !== undefined) {
                    if (item.CheckListId !== 132) {
                        if (checkedvalue.CheckListId === item.CheckListId) {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "DeleteInd": checkedvalue.DeleteInd || 'N',
                                "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                                "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                                "ChecklistDate": item.ChecklistDate,
                                "Remarks": item.Remarks,
                            };
                            postopOrgASCChecklist.push(obj);
                        }
                    } else {
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "OrganizationPreOpCheckListValueId": null,
                            "Value": item.Value || "",
                            "SubCheckList": [],
                            "Remarks": item.Remarks || "",
                            "DeleteInd": item.DeleteInd || "N",
                            "Score": item.Score || 0,
                            "AscMultiCheckValueArray": []
                        };

                        if (item.OrganizationCheckListDetails.length > 0) {
                            angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                hitem.AscTemplateMultiCheckListDetailId = hitem.AscTemplateMultiCheckListDetailId || 0;
                                hitem.IsChecked = hitem.IsChecked || false;
                                if (hitem.AscTemplateMultiCheckListDetailId != 0 && hitem.IsChecked == false) {
                                    hitem.DeleteInd = "Y";
                                }

                                if (hitem.IsChecked == true || hitem.AscTemplateMultiCheckListDetailId != 0) {
                                    let object = {
                                        "CheckListId": hitem.CheckListId,
                                        "AscTemplateMultiCheckListDetailId": hitem.AscTemplateMultiCheckListDetailId || 0,
                                        "DeleteInd": hitem.DeleteInd,
                                        "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                        "Value": hitem.Value,
                                        "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,

                                    };
                                    obj.AscMultiCheckValueArray.push(object);
                                }
                            });
                        }
                        if (obj.AscMultiCheckValueArray.length > 0) {
                            postopOrgASCChecklist.push(obj);
                        }
                    }
                }
            });

        });
        angular.forEach($scope.PostOpObj.PatientInterventionsList, function (item) {

            let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
            let checkedvalue;
            if (checkedvaluearray.length > 0) {
                checkedvalue = checkedvaluearray[0];
            }
            if (checkedvalue !== undefined) {
                if (checkedvalue.CheckListId === item.CheckListId) {
                    let obj = {
                        "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                        "CheckListId": item.CheckListId,
                        "CheckListName": item.CheckListName,
                        "CheckListModuleId": item.CheckListModuleId,
                        "CheckListCategoryId": item.CheckListCategoryId,
                        "CheckListSubTypeId": item.CheckListSubTypeId,
                        "ParentOrganizationId": item.ParentOrganizationId,
                        "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                        "DeleteInd": checkedvalue.DeleteInd || 'N',
                        "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                        "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                        "ChecklistDate": item.ChecklistDate,
                        "Remarks": item.Remarks,
                    };
                    postopOrgASCChecklist.push(obj);
                }
            }
        });
        angular.forEach($scope.PostOpObj.CheckoutActionList, function (kitem) {
            angular.forEach(kitem, function (item) {
                //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": checkedvalue.DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks,
                        };
                        postopOrgASCChecklist.push(obj);
                    }
                }
            });

        });

        angular.forEach($scope.PostOpObj.ProgressNotesList, function (kitem) {
            angular.forEach(kitem, function (item) {

                if (item.CheckListId == 139 && !$scope.ParentObj.IsIOJParentOrganization && $scope.PostOpObj.ProgressNotesPainScore !== null) {
                    let obj = {
                        "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                        "CheckListId": item.CheckListId,
                        "CheckListName": item.CheckListName,
                        "CheckListModuleId": item.CheckListModuleId,
                        "CheckListCategoryId": item.CheckListCategoryId,
                        "CheckListSubTypeId": item.CheckListSubTypeId,
                        "ParentOrganizationId": item.ParentOrganizationId,
                        "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                        "DeleteInd": 'N',
                        "OrganizationPreOpCheckListValueId": null,
                        "Value": "",
                        "ChecklistDate": item.ChecklistDate,
                        "Remarks": item.Remarks,
                    };
                    postopOrgASCChecklist.push(obj);
                }

                //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {

                        if (item.CheckListId !== 136 && item.CheckListId !== 152) {

                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "DeleteInd": checkedvalue.DeleteInd || 'N',
                                "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                                "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                                "ChecklistDate": item.ChecklistDate,
                                "Remarks": item.Remarks,
                            };
                            postopOrgASCChecklist.push(obj);

                        }
                        else {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "OrganizationPreOpCheckListValueId": null,
                                "Value": item.Value || "",
                                "SubCheckList": [],
                                "Remarks": item.Remarks || "",
                                "DeleteInd": item.DeleteInd || "N",
                                "Score": item.Score || 0,
                                "AscMultiCheckValueArray": []
                            };

                            if (item.OrganizationCheckListDetails.length > 0) {
                                angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                    hitem.AscTemplateMultiCheckListDetailId = hitem.AscTemplateMultiCheckListDetailId || 0;
                                    hitem.IsChecked = hitem.IsChecked || false;
                                    if (hitem.AscTemplateMultiCheckListDetailId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = "Y";
                                    }

                                    if (hitem.IsChecked == true || hitem.AscTemplateMultiCheckListDetailId != 0) {
                                        let object = {
                                            "CheckListId": hitem.CheckListId,
                                            "AscTemplateMultiCheckListDetailId": hitem.AscTemplateMultiCheckListDetailId || 0,
                                            "DeleteInd": hitem.DeleteInd,
                                            "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                            "Value": hitem.Value,
                                            "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,

                                        };
                                        obj.AscMultiCheckValueArray.push(object);
                                    }
                                });
                            }

                            postopOrgASCChecklist.push(obj);
                        }
                    }
                }
            });

        });

        angular.forEach($scope.PostOpObj.GeneralOrdersList, function (kitem) {
            angular.forEach(kitem, function (item) {
                //let checkedvaluearray = $filter('filter')(item.OrganizationCheckListDetails, { "IsChecked": true }, true);
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (item.CheckListId !== 136) {
                        if (checkedvalue.CheckListId === item.CheckListId) {
                            let obj = {
                                "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "DeleteInd": checkedvalue.DeleteInd || 'N',
                                "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                                "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                                "ChecklistDate": item.ChecklistDate,
                                "Remarks": item.Remarks,
                            };
                            postopOrgASCChecklist.push(obj);
                        }

                    } else {
                        let obj = {
                            "AscTemplateCheckListDetailId": item.AscTemplateCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "OrganizationPreOpCheckListValueId": null,
                            "Value": item.Value || "",
                            "SubCheckList": [],
                            "Remarks": item.Remarks || "",
                            "DeleteInd": item.DeleteInd || "N",
                            "Score": item.Score || 0,
                            "AscMultiCheckValueArray": []
                        };

                        if (item.OrganizationCheckListDetails.length > 0) {
                            angular.forEach(item.OrganizationCheckListDetails, function (hitem) {
                                hitem.AscTemplateMultiCheckListDetailId = hitem.AscTemplateMultiCheckListDetailId || 0;
                                hitem.IsChecked = hitem.IsChecked || false;
                                if (hitem.AscTemplateMultiCheckListDetailId != 0 && hitem.IsChecked == false) {
                                    hitem.DeleteInd = "Y";
                                }

                                if (hitem.IsChecked == true || hitem.AscTemplateMultiCheckListDetailId != 0) {
                                    let object = {
                                        "CheckListId": hitem.CheckListId,
                                        "AscTemplateMultiCheckListDetailId": hitem.AscTemplateMultiCheckListDetailId || 0,
                                        "DeleteInd": hitem.DeleteInd,
                                        "OrganizationPreOpCheckListValueId": hitem.OrganizationPreOpCheckListValueId,
                                        "Value": hitem.Value,
                                        "OrganizationPreOpCheckListId": hitem.OrganizationPreOpCheckListId,

                                    };
                                    obj.AscMultiCheckValueArray.push(object);
                                }
                            });
                        }

                        postopOrgASCChecklist.push(obj);
                    }
                }
            });

        });
        $scope.AsctemplateObj.PostOp.OrgASCChecklist = postopOrgASCChecklist || [];
        let AscTemplatePatientGoal = [];
        if ($scope.PostOpObj.MasterAscPatientGoal.length > 0) {
            AscTemplatePatientGoal = $filter("filter")($scope.PostOpObj.MasterAscPatientGoal, function (kitem, index) { return (kitem.Value !== '' && kitem.DeleteInd == 'N') || (kitem.Value == '' && kitem.DeleteInd == 'Y'); });
        }
        $scope.AsctemplateObj.PostOp.AscTemplatePatientGoal = AscTemplatePatientGoal || [];
        let PostOpFinalOrderDetails = [];
        //let PostList = $filter("filter")($scope.PostOpObj.OrderDetails, function (item) {
        //    return (item.MedTypeId === 5 && ((item.PostOpMedications && item.PostOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
        //        (item.MedTypeId === 8 && ((item.PostOpMedications && item.PostOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        //}) || [];
        //if (PostList.length > 0) {
        //    PostOpFinalOrderDetails = PostList || [];
        //}
        //$scope.AsctemplateObj.PostOp.OrderDetails = PostOpFinalOrderDetails || [];
        $scope.AsctemplateObj.PostSurgery = {};
        if ($scope.OperativeNotesObj.SurgeonOperativeNotes != '') {
            $scope.AsctemplateObj.PostSurgery.OperativeNotes = $scope.OperativeNotesObj || '';
        }
        if ($scope.DischargeObj.Patientinstruction != '' || $scope.DischargeObj.PatientConditionOnDischarge != '' || $scope.DischargeObj.Finaldisposition != '') {
            $scope.AsctemplateObj.PostSurgery.DischargeSummury = $scope.DischargeObj || '';
        }
        /*OcularHistory*/
        postSurgeryFinalObjFeildsFun()


        eHnoteSurgeryService.AddAscSettingTemplate($scope.AsctemplateObj).then(function (resp) {
            if (resp.data.status === "Success") {
                if ($scope.AsctemplateObj.UserSurgeryTemplateId != 0) {
                    alertify.success("Update Template successfully")
                } else {
                    alertify.success("Template added successfully")

                }
                $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());
                $scope.PreOpObj.OrderDetails = [];
                $scope.IntraOpObj.OrderDetails = [];
                //    $uibModalInstance.close("cancel");
                //$scope.CloseAscTemplateAdupdateScreen();
                $scope.$emit("AscSurgeryTemplateClose");


            } else if (resp.data.status == "Failure") {
                alertify.error(resp.data.Message);
            }
            //return eHnoteSurgeryService.AddAscSettingTemplate(requestData).then(function (resp) {
            //    $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());

        });
    }
    //$scope.OnClickTemplateOrders = function (mainitem, type) {

    function postSurgeryFinalObjFeildsFun() {
        if ($scope.OperativeNotesObj.CodeImplants) {
            $scope.AsctemplateObj.PostSurgery.CodeImplants = $scope.OperativeNotesObj.CodeImplants;
        }
        if ($scope.OperativeNotesObj.PhysicalExam) {
            $scope.AsctemplateObj.PostSurgery.PhysicalExam = $scope.OperativeNotesObj.PhysicalExam;
        }
        if ($scope.OperativeNotesObj.PostProcedureNote) {
            $scope.AsctemplateObj.PostSurgery.PostProcedureNote = $scope.OperativeNotesObj.PostProcedureNote;
        }
        if ($scope.OperativeNotesObj.Complications) {
            $scope.AsctemplateObj.PostSurgery.Complications = $scope.OperativeNotesObj.Complications;
        }
        if ($scope.OperativeNotesObj.Findings) {
            $scope.AsctemplateObj.PostSurgery.Findings = $scope.OperativeNotesObj.Findings;
        }
        if ($scope.OperativeNotesObj.OtherCodes) {
            $scope.AsctemplateObj.PostSurgery.OtherCodes = $scope.OperativeNotesObj.OtherCodes;
        }
        if ($scope.OperativeNotesObj.Pathology) {
            $scope.AsctemplateObj.PostSurgery.Pathology = $scope.OperativeNotesObj.Pathology;
        }
        if ($scope.OperativeNotesObj.PatientInstructions) {
            $scope.AsctemplateObj.PostSurgery.PatientInstructions = $scope.OperativeNotesObj.PatientInstructions;
        }
        if ($scope.OperativeNotesObj.PreProcedureNote) {
            $scope.AsctemplateObj.PostSurgery.PreProcedureNote = $scope.OperativeNotesObj.PreProcedureNote;
        }
        if ($scope.OperativeNotesObj.ProcedureDetails) {
            $scope.AsctemplateObj.PostSurgery.ProcedureDetails = $scope.OperativeNotesObj.ProcedureDetails;
        }
        if ($scope.OperativeNotesObj.ReasonForVisit) {
            $scope.AsctemplateObj.PostSurgery.ReasonForVisit = $scope.OperativeNotesObj.ReasonForVisit;
        }
        if ($scope.OperativeNotesObj.CheifComplaints) {
            $scope.AsctemplateObj.PostSurgery.CheifComplaints = $scope.OperativeNotesObj.CheifComplaints;
        }
        if ($scope.OperativeNotesObj.MedicationsPostOP) {
            $scope.AsctemplateObj.PostSurgery.MedicationsPostOP = $scope.OperativeNotesObj.MedicationsPostOP;
        }
        if ($scope.OperativeNotesObj.Diagnosis) {
            $scope.AsctemplateObj.PostSurgery.Diagnosis = $scope.OperativeNotesObj.Diagnosis || [];
        }
        $scope.AsctemplateObj.PostSurgery.OccularHistoryArray = $scope.ocularObj.OccularHistoryArray || [];
        $scope.AsctemplateObj.PostSurgery.OccularHistoryRemarks = $scope.ocularObj.OccularHistoryRemarks || "";
        if ($scope.PrescriptionMainAddObj.PrescriptionDetails && $scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            $scope.AsctemplateObj.PostSurgery.PrescriptionArray = $scope.PrescriptionMainAddObj.PrescriptionDetails || [];
        }
        $scope.AsctemplateObj.PostSurgery.InvestigationsList = $scope.Surgeryobj.Investigationslist || [];
    }
    $scope.GetOrganizationMedicationSigArrayList = [];
    $scope.getOrganizationMedicationSig = function (text) {
        text = text || '';
        var params = {
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "PageSize": 10,
            "PageNumber": 1
            /*"IsFrequent": "Y" ,*/
        };
        //if (text!="") {
        //    params.IsFrequent ="N"
        //}
        eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {

                $scope.GetOrganizationMedicationSigArrayList = resp.data.rows;
            }
            else if (resp.data.Status == "Failure") {
                alertify.error("Data Updating Failed");
            }
            //if (resp.data.rows.length  > 0) {

            //}
        });
    };

    $scope.AddUpdateAscSurgeryOrderTemplatesData = function () {
        $scope.AsctemplateObj.TemplateName = $scope.AsctemplateObj.TemplateName || '';
        if ($scope.AsctemplateObj.TemplateName == '') {
            alertify.error('Please Enter TemplateName');
            return;
        }
        if ($scope.AsctemplateObj.SurgeryArray.length == 0) {
            alertify.error('Please Select Surgery');
            return;
        }
        //if ($scope.AsctemplateObj.UserSurgeryTemplateId == 0) {

        /*}*/
        //preop 
        let PreopFinalOrderDetails = [];
        let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 1 && ((item.PreOpMedications && item.PreOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 2 && ((item.DilationMedications && item.DilationMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (templist.length > 0) {
            PreopFinalOrderDetails = templist || [];
        }
        $scope.AsctemplateObj.PreOp.OrderDetails = PreopFinalOrderDetails || [];

        let PreopOrgASCChecklist = [];


        //intraop
        let IntraOpFinalOrderDetails = [];
        let Intralist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 3 && ((item.IntraOpMedications && item.IntraOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 4 && ((item.IntraOpMedications && item.IntraOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (Intralist.length > 0) {
            IntraOpFinalOrderDetails = Intralist || [];
        }
        $scope.AsctemplateObj.IntraOp.OrderDetails = IntraOpFinalOrderDetails || [];






        let IntraOpOrgASCChecklist = [];



        //postop
        let postopOrgASCChecklist = [];


        let PostOpFinalOrderDetails = [];
        let PostList = $filter("filter")($scope.PostOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 5 && ((item.PostOpMedications && item.PostOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 8 && ((item.PostOpMedications && item.PostOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (PostList.length > 0) {
            PostOpFinalOrderDetails = PostList || [];
        }
        $scope.AsctemplateObj.PostOp.OrderDetails = PostOpFinalOrderDetails || [];

        $scope.AsctemplateObj.CoordinatorChecklistArray =
            angular.copy($scope.CoordinatorChecklistArray || []);

        //Labs&Studies (Laboratory / Examination investigations)
        $scope.AsctemplateObj.InvestigationsList = $filter("filter")($scope.Surgeryobj.Investigationslist || [], function (item) {
            return $scope.IsLabsStudiesInvestigation(item);
        }) || [];

        eHnoteSurgeryService.AddUpdateAscSurgeryOrderTemplates($scope.AsctemplateObj).then(function (resp) {
            if (resp.data.status === "Success") {
                if ($scope.AsctemplateObj.UserSurgeryTemplateId != 0) {
                    alertify.success("Update Template successfully")
                } else {
                    alertify.success("Template added successfully")

                }
                $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());
                $scope.PreOpObj.OrderDetails = [];
                $scope.IntraOpObj.OrderDetails = [];
                //    $uibModalInstance.close("cancel");
                //$scope.CloseAscTemplateAdupdateScreen();
                $scope.$emit("AscSurgeryTemplateClose");


            } else if (resp.data.status == "Failure") {
                alertify.error(resp.data.Message);
            }
            //return eHnoteSurgeryService.AddAscSettingTemplate(requestData).then(function (resp) {
            //    $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());

        });
    }
    //    $scope.AsctemplateObj.OrgSurgeryId = mainitem.OrganizationProcedureId || 0;
    //    $scope.AsctemplateObj.SurgeryId = mainitem.ProcedureId || 0;
    //    $scope.AsctemplateObj.ProcedureCode = mainitem.CPTCode || '';
    //    $scope.AsctemplateObj.SurgeryName = mainitem.ProcedureName || '';
    //    $scope.AscTemplates.SearchProcedureObj = '';
    //}
    $scope.MedicationOrderTypes = [
        {
            MedTypeId: 1,
            MedTypeName: "Anesthesia Orders",
        },
        {
            MedTypeId: 2,
            MedTypeName: "Surgeon Orders",

        }
    ]

    $scope.customOrder = function (item) {
        var desiredOrder = [
            36565,
            36863,
        ];
        var index = desiredOrder.indexOf(item.MedicineId);
        return index !== -1 ? index : 9999;
    };
    //$scope.SelectPreopMedicationOrders = function (item, type) {
    //    $scope.PreOpObj.MedTypeId = $scope.PreOpObj.MedTypeId || 0;
    //    if ($scope.PreOpObj.MedTypeId == 0) {
    //        alertify.error('Please Select Medication Type');
    //        return false;
    //    }
    //    //    "MedTypeId": 2
    //    if ($scope.PreOpObj.MedTypeId == 2) {
    //        let MedTypeName = 'Dilation Medication';
    //        //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": $scope.PreOpObj.MedTypeId }, true);
    //        let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //            return poitem.MedTypeId === $scope.PreOpObj.MedTypeId && poitem.DeleteInd == 'N';
    //        }) || [];
    //        let i = 0;
    //        angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
    //            angular.forEach(mitem.DilationMedications, function (Aitem) {
    //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
    //                    i++;
    //                }
    //            });
    //        });

    //        if (i > 0) {
    //            alertify.error('You have already entered this Medication');
    //            $scope.TempDilationMedicationObj.MedicineObject = "";
    //            return false;
    //        }
    //        if (templist.length > 0) {

    //            let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
    //            if (List.length > 0) {
    //                alertify.error("Medicine name already added!");
    //                $scope.TempDilationMedicationObj.MedicineObject = '';
    //                return false;
    //            }

    //            var obj = {
    //                "SurgeryTemplateMedicationId": 0,
    //                "AscMedicationId": 0,
    //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
    //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": item.MedicineId,
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "DropTimings": [],

    //                "TypeId": 2,
    //                "DeleteInd": "N"
    //            }
    //            templist[0].DilationMedications.push(obj);
    //            $scope.TempDilationMedicationObj.MedicineObject = "";
    //        }
    //        else {
    //            //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
    //            let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy === null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
    //            }) || [];
    //            if (templist2.length > 0) {
    //                templist2[0].MedTypeId = $scope.PreOpObj.MedTypeId;
    //                //    templist2[0].MedTypeName = 'PreOp Medication';
    //            } else {

    //                //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.PreOpObj.MedTypeId }, true) || [];
    //                let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //                    return poitem.ReviewedBy === null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.PreOpObj.MedTypeId;
    //                }) || [];
    //                if (templist3.length > 0) {

    //                }
    //                else {
    //                    var obj = {
    //                        "UserSurgeryOrderTemplateDetailId": 0,
    //                        "UserOrderId": 0,
    //                        "UserId": $scope.UserId,
    //                        "DeleteInd": "N",
    //                        "ReviewedBy": null,
    //                        "IsOrderReviewed": false,
    //                        "ReviewedByPassword": '',
    //                        "ReviewedByDateTime": null,
    //                        "UserType": "Nurse",
    //                        "ScreenType": "PreOp",
    //                        "ScreenTypeId": 4,
    //                        "MedTypeId": $scope.PreOpObj.MedTypeId,
    //                        "MedTypeName": MedTypeName || '',
    //                        "DilationMedications": [],
    //                        "PreOpMedications": [],
    //                        "GeneralOrders": [],
    //                    }
    //                    $scope.PreOpObj.OrderDetails.push(obj);
    //                }

    //            }
    //            //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.PreOpObj.MedTypeId, 'DeleteInd': 'N' }, true) || [];
    //            let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy === null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.PreOpObj.MedTypeId;
    //            }) || [];
    //            var obj = {
    //                "OrganizationMedicationId": Number(item.OrganizationPrescriptionId),
    //                "OrganizationPrescriptionId": Number(item.OrganizationPrescriptionId),
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "SurgeryTemplateMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": Number(item.MedicineId),
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "TypeId": 2,
    //                "DeleteInd": "N"
    //            }
    //            templist1[0].DilationMedications.push(obj);
    //            $scope.TempDilationMedicationObj.MedicineObject = "";
    //            //$scope.AddPreOpDropsTime(obj, 'DilationMedications');
    //        }
    //    }

    //    else {
    //        //let templist = $filter("filter")($scope.PreOpObj.OrderDetails, { "MedTypeId": $scope.PreOpObj.MedTypeId, 'IsOrderReviewed': false }, true);
    //        let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //            return   poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.PreOpObj.MedTypeId;
    //        }) || [];
    //        let i = 0;
    //        angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
    //            angular.forEach(mitem.PreOpMedications, function (Aitem) {
    //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
    //                    i++;
    //                }
    //            });
    //        });

    //        if (i > 0) {
    //            alertify.error('You have already entered this Medication');
    //            $scope.TempDilationMedicationObj.MedicineObject = "";
    //            return false;
    //        }
    //        if (templist.length > 0) {

    //            let List1 = $filter("filter")(templist[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //            let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
    //            if (List.length > 0) {
    //                alertify.error("Medicine name already added!");
    //                $scope.TempDilationMedicationObj.MedicineObject = "";
    //                return false;
    //            }

    //            var obj = {
    //                "OrganizationMedicationId": Number(item.OrganizationPrescriptionId),
    //                "OrganizationPrescriptionId": Number(item.OrganizationPrescriptionId),
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "SurgeryTemplateMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": Number(item.MedicineId),
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "TypeId": $scope.PreOpObj.MedTypeId,
    //                "DeleteInd": "N"
    //            }
    //            templist[0].PreOpMedications.push(obj);
    //            $scope.TempDilationMedicationObj.MedicineObject = "";
    //            // $scope.AddPreOpDropsTime(obj, 'PreOpMediacation');

    //        }
    //        else {
    //            let MedTypeName = 'PreOp Medication';

    //            //let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
    //            let templist2 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //                return poitem.DeleteInd == 'N' && poitem.MedTypeId == null && poitem.ReviewedBy == null;
    //            }) || [];
    //            if (templist2.length > 0) {
    //                templist2[0].MedTypeId = $scope.PreOpObj.MedTypeId;
    //                templist2[0].MedTypeName = MedTypeName;
    //            } else {

    //                //let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.PreOpObj.MedTypeId }, true) || [];
    //                let templist3 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //                    return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.PreOpObj.MedTypeId && poitem.ReviewedBy == null;
    //                }) || [];
    //                if (templist3.length > 0) {

    //                }
    //                else {
    //                    var obj = {
    //                        "UserSurgeryOrderTemplateDetailId": 0,
    //                        "UserOrderId": 0,
    //                        "UserId": $scope.UserId,
    //                        "DeleteInd": "N",
    //                        "ReviewedBy": null,
    //                        "IsOrderReviewed": false,
    //                        "ReviewedByPassword": '',
    //                        "ReviewedByDateTime": null,
    //                        "UserType": "Nurse",
    //                        "ScreenType": "PreOp",
    //                        "ScreenTypeId": 4,
    //                        "MedTypeId": 1,
    //                        "MedTypeName": 'PreOp Medication',
    //                        "DilationMedications": [],
    //                        "PreOpMedications": [],
    //                        "GeneralOrders": [],
    //                    }
    //                    $scope.PreOpObj.OrderDetails.push(obj);
    //                }

    //            }

    //            //let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.PreOpObj.MedTypeId }, true) || [];
    //            let templist1 = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
    //                return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.PreOpObj.MedTypeId && poitem.ReviewedBy == null;
    //            }) || [];
    //            if (templist1.length > 0) {
    //                let List1 = $filter("filter")(templist1[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //                let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
    //                if (List.length > 0) {
    //                    alertify.error("Medicine name already added!");
    //                    $scope.TempDilationMedicationObj.MedicineObject = "";
    //                    return false;
    //                }





    //                var obj = {
    //                    "OrganizationMedicationId": Number(item.OrganizationPrescriptionId),
    //                    "OrganizationPrescriptionId": Number(item.OrganizationPrescriptionId),
    //                    "ParentOrganizationId": $scope.ParenthospitalId,
    //                    "ASCOrganizationMedicationId": 0,
    //                    "SurgeryTemplateMedicationId": 0,
    //                    "Strength": item.Strength || '',
    //                    "IsFrequent": item.IsFrequent || 'N',
    //                    "MedicineId": Number(item.MedicineId),
    //                    "MedicationName": item.MedicineName,
    //                    "IsChecked": false,
    //                    "IsDilationMed": false,
    //                    "IsIntraAnesthesiaMed": false,
    //                    "IsIntraMed": false,
    //                    "IsPreOPMed": false,
    //                    "MedicationDosage": "",
    //                    "TypeId": $scope.PreOpObj.MedTypeId,
    //                    "DeleteInd": "N"
    //                }


    //                templist1[0].PreOpMedications.push(obj);
    //                $scope.TempDilationMedicationObj.MedicineObject = "";
    //                //$scope.AddPreOpDropsTime(obj, 'PreOpMediacation');
    //            }

    //        }
    //    }
    //}
    $scope.DeleteMainMediacation = function (item, Aitem, Type) {
        var index = -1;
        if ($scope.PreOpObj.MedTypeId == 2) {
            index = Aitem.DilationMedications.indexOf(item);
        }
        if ($scope.PreOpObj.MedTypeId == 1) {
            index = Aitem.PreOpMedications.indexOf(item);
        }
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            if (item.SurgeryTemplateMedicationId != 0) {
                if (index > -1) {
                    item.DeleteInd = 'Y';
                }
                $scope.$digest();
                $scope.PreopOrderinit(Type);

            }
            else {
                if (index > -1) {
                    if ($scope.PreOpObj.MedTypeId == 2) {
                        Aitem.DilationMedications.splice(index, 1);
                    }
                    if ($scope.PreOpObj.MedTypeId == 1) {
                        Aitem.PreOpMedications.splice(index, 1);
                    }

                }
                $scope.PreopOrderinit(Type);

            }
        }, function () {
        });
    }
    $scope.PreopOrderinit = function (Type) {
        if ($scope.PreOpObj.MedTypeId == 2) {
            let FinalNurseOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];
            if (FinalNurseOrderDetails.length > 0) {
                angular.forEach(FinalNurseOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.DilationMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }
        }
        if ($scope.PreOpObj.MedTypeId == 1) {
            let FinalAnesthisiaOrderDetails = $filter('filter')($scope.PreOpObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];
            if (FinalAnesthisiaOrderDetails.length > 0) {
                angular.forEach(FinalAnesthisiaOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.PreOpMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }
        }

    }
    $scope.DeletePreopGeneralOrder = function (Mitem, item) {
        var index = Mitem.GeneralOrders.indexOf(item);
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            if (item.SurgeryGeneralOrderId === 0) {
                if (index > -1) {
                    Mitem.GeneralOrders.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }
            $scope.PreopOrderinit('');
        }, function () {
        });
    }
    $scope.ChangeGeneralMedicationStatus = function (item, Id) {
        if (Id == 1) {
            item.Status = 'Done';
            item.MedicationTime = '';
            //    item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
        } else {
            item.Status = 'NotDone';
            item.MedicationTime = '';
        }
    };


    $scope.IntraopMedicationOrderTypes = [
        {
            MedTypeId: 3,
            MedTypeName: "Anesthesia Orders",
        },
        {
            MedTypeId: 4,
            MedTypeName: "Surgeon Orders",

        }
    ]

    $scope.PostOpMedicationOrderTypes = [
        {
            MedTypeId: 5,
            MedTypeName: "Surgeon Orders",
        },
        {
            MedTypeId: 8,
            MedTypeName: "Anesthesia Orders",

        }
    ]

    //$scope.SelectIntraMedicationOrders = function (item, type) {
    //    $scope.TempIntraOpObj.MedTypeId = $scope.TempIntraOpObj.MedTypeId || 0;
    //    if ($scope.TempIntraOpObj.MedTypeId == 0) {
    //        alertify.error('Please Select Medication Type');
    //        return false;
    //    }

    //    //    "MedTypeId": 2
    //    if ($scope.TempIntraOpObj.MedTypeId == 3) {
    //        //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true);
    //        let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //            return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId ;
    //        }) || [];
    //        let i = 0;
    //        angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
    //            angular.forEach(mitem.IntraOpMedications, function (Aitem) {
    //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
    //                    i++;
    //                }
    //            });
    //        });

    //        if (i > 0) {
    //            alertify.error('You have already entered this Medication');
    //            $scope.IntraOpMedicationObj.MedicineObject = "";
    //            return false;
    //        }
    //        if (templist.length > 0) {

    //            let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
    //            if (List.length > 0) {
    //                alertify.error("Medicine name already added!");
    //                $scope.IntraOpMedicationObj.MedicineObject = '';
    //                return false;
    //            }

    //            var obj = {
    //                "AscMedicationId": 0,
    //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
    //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": item.MedicineId,
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "DropTimings": [],

    //                "TypeId": 5,
    //                "DeleteInd": "N"
    //            }
    //            templist[0].IntraOpMedications.push(obj);
    //            $scope.IntraOpMedicationObj.MedicineObject = "";
    //        }
    //        else {
    //            //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
    //            let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
    //            }) || [];
    //            if (templist2.length > 0) {
    //                templist2[0].MedTypeId = $scope.TempIntraOpObj.MedTypeId;
    //                templist2[0].MedTypeName = 'IntraAnesthesia Medications';
    //            } else {

    //                //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true) || [];
    //                let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
    //                }) || [];
    //                if (templist3.length > 0) {

    //                }
    //                else {
    //                    var obj = {
    //                        "UserOrderId": 0,
    //                        "UserId": $scope.UserId,
    //                        "DeleteInd": "N",
    //                        "ReviewedBy": null,
    //                        "IsOrderReviewed": false,
    //                        "ReviewedByPassword": '',
    //                        "ReviewedByDateTime": null,
    //                        "UserType": "Nurse",
    //                        "ScreenType": "Intraop",
    //                        "ScreenTypeId": 5,
    //                        "MedTypeId": $scope.TempIntraOpObj.MedTypeId,
    //                        "MedTypeName": 'IntraAnesthesia Medications',
    //                        "IntraOpMedications": [],
    //                        "GeneralOrders": [],
    //                    }
    //                    $scope.IntraOpObj.OrderDetails.push(obj);
    //                }

    //            }
    //            //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId, 'DeleteInd': 'N' }, true) || [];
    //            let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
    //            }) || [];
    //            var obj = {
    //                "OrganizationMedicationId": Number(item.OrganizationPrescriptionId),
    //                "OrganizationPrescriptionId": Number(item.OrganizationPrescriptionId),
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": Number(item.MedicineId),
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "TypeId": 5,
    //                "DeleteInd": "N"
    //            }
    //            templist1[0].IntraOpMedications.push(obj);
    //            $scope.IntraOpMedicationObj.MedicineObject = "";
    //            //$scope.AddPreOpDropsTime(obj, 'DilationMedications');
    //        }
    //    }



    //    else {
    //        //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": $scope.TempIntraOpObj.MedTypeId, 'IsOrderReviewed': false }, true);
    //        let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //            return  poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
    //        }) || [];
    //        let i = 0;
    //        angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
    //            angular.forEach(mitem.PreOpMedications, function (Aitem) {
    //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
    //                    i++;
    //                }
    //            });
    //        });

    //        if (i > 0) {
    //            alertify.error('You have already entered this Medication');
    //            $scope.IntraOpMedicationObj.MedicineObject = "";
    //            return false;
    //        }
    //        if (templist.length > 0) {

    //            let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //            let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
    //            if (List.length > 0) {
    //                alertify.error("Medicine name already added!");
    //                $scope.IntraOpMedicationObj.MedicineObject = "";
    //                return false;
    //            }

    //            var obj = {
    //                "OrganizationMedicationId": Number(item.OrganizationPrescriptionId),
    //                "OrganizationPrescriptionId": Number(item.OrganizationPrescriptionId),
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": Number(item.MedicineId),
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "TypeId": $scope.TempIntraOpObj.MedTypeId,
    //                "DeleteInd": "N"
    //            }
    //            templist[0].IntraOpMedications.push(obj);
    //            $scope.IntraOpMedicationObj.MedicineObject = "";
    //            // $scope.AddPreOpDropsTime(obj, 'PreOpMediacation');

    //        }
    //        else {
    //            //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
    //            let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
    //            }) || [];
    //            if (templist2.length > 0) {
    //                templist2[0].MedTypeId = $scope.TempIntraOpObj.MedTypeId;
    //                templist2[0].MedTypeName = 'Intra Medication';
    //            } else {

    //                //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true) || [];
    //                let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
    //                }) || [];
    //                if (templist3.length > 0) {

    //                }
    //                else {
    //                    var obj = {
    //                        "UserOrderId": 0,
    //                        "UserId": $scope.UserId,
    //                        "DeleteInd": "N",
    //                        "ReviewedBy": null,
    //                        "IsOrderReviewed": false,
    //                        "ReviewedByPassword": '',
    //                        "ReviewedByDateTime": null,
    //                        "UserType": "Nurse",
    //                        "ScreenType": "IntraOp",
    //                        "ScreenTypeId": 5,
    //                        "MedTypeId": $scope.TempIntraOpObj.MedTypeId,
    //                        "MedTypeName": 'Intra Medication',
    //                        "IntraOpMedications": [],
    //                        "GeneralOrders": [],
    //                    }
    //                    $scope.IntraOpObj.OrderDetails.push(obj);
    //                }

    //            }

    //            //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true) || [];
    //            let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
    //            }) || [];
    //            if (templist1.length > 0) {
    //                let List1 = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //                let List = $filter("filter")(List1, { 'DeleteInd': 'N' }, true);
    //                if (List.length > 0) {
    //                    alertify.error("Medicine name already added!");
    //                    $scope.IntraOpMedicationObj.MedicineObject = "";
    //                    return false;
    //                }





    //                var obj = {
    //                    "OrganizationMedicationId": Number(item.OrganizationPrescriptionId),
    //                    "OrganizationPrescriptionId": Number(item.OrganizationPrescriptionId),
    //                    "ParentOrganizationId": $scope.ParenthospitalId,
    //                    "ASCOrganizationMedicationId": 0,
    //                    "Strength": item.Strength || '',
    //                    "IsFrequent": item.IsFrequent || 'N',
    //                    "MedicineId": Number(item.MedicineId),
    //                    "MedicationName": item.MedicineName,
    //                    "IsChecked": false,
    //                    "IsDilationMed": false,
    //                    "IsIntraAnesthesiaMed": false,
    //                    "IsIntraMed": false,
    //                    "IsPreOPMed": false,
    //                    "MedicationDosage": "",
    //                    "TypeId": $scope.TempIntraOpObj.MedTypeId,
    //                    "DeleteInd": "N"
    //                }


    //                templist1[0].IntraOpMedications.push(obj);
    //                $scope.IntraOpMedicationObj.MedicineObject = "";
    //                //$scope.AddPreOpDropsTime(obj, 'PreOpMediacation');
    //            }

    //        }
    //    }
    //}


    $scope.AddIntraOpGeneralOrder = function (Type) {
        if (Type == 'Nurse') {
            if ($scope.TempIntraOpObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }

            //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": $scope.TempIntraOpObj.MedTypeId, 'IsOrderReviewed': false }, true);
            let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
            }) || [];
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.TempIntraOpObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",
                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.TempIntraOpObj.OrderName = "";
            } else {
                //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = $scope.TempIntraOpObj.MedTypeId;
                    templist2[0].MedTypeName = 'Intra Medications';
                } else {

                    //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true) || [];
                    let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                        return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "ReviewedBy": null,
                            "UserType": "Nurse",
                            "ScreenType": "Intra-OP",
                            "ScreenTypeId": 5,
                            "MedTypeId": $scope.TempIntraOpObj.MedTypeId,
                            "MedTypeName": 'Intra Medication',
                            "IntraOpMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.IntraOpObj.OrderDetails.push(obj);
                    }

                }


                //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true) || [];
                let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
                }) || [];
                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.TempIntraOpObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.TempIntraOpObj.OrderName = "";
                } else {

                }
            }
        } else {
            if ($scope.TempIntraOpObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }

            //let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, { "MedTypeId": $scope.TempIntraOpObj.MedTypeId, 'IsOrderReviewed': false }, true);
            let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
            }) || [];
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.TempIntraOpObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",
                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.TempIntraOpObj.OrderName = "";
            } else {
                //let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = $scope.TempIntraOpObj.MedTypeId;
                    templist2[0].MedTypeName = 'Postop Anesthesia Medications';
                } else {

                    //let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempIntraOpObj.MedTypeId }, true) || [];
                    let templist3 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                        return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "ReviewedBy": null,
                            "UserType": "Anesthesia",
                            "ScreenType": "PostOp",
                            "ScreenTypeId": 5,
                            "MedTypeId": 3,
                            "MedTypeName": 'IntraAnesthesia Medications',
                            "IntraOpMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.IntraOpObj.OrderDetails.push(obj);
                    }

                }


                //let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 3 }, true) || [];
                let templist1 = $filter("filter")($scope.IntraOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempIntraOpObj.MedTypeId;
                }) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.TempIntraOpObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.TempIntraOpObj.OrderName = "";
                } else {

                }
            }
        }
    }

    $scope.DeleteIntraMainMediacation = function (item, Aitem, Type) {
        var index = -1;
        if ($scope.TempIntraOpObj.MedTypeId == 3) {
            index = Aitem.IntraOpMedications.indexOf(item);
        } else {
            index = Aitem.IntraOpMedications.indexOf(item);
        }
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            if (item.SurgeryTemplateMedicationId != 0) {
                if (index > -1) {
                    item.DeleteInd = 'Y';
                }
                $scope.$digest();
                $scope.IntraOrdersInit(Type);

            }
            else {
                if (index > -1) {

                    if (Type == 'IntraopMedications') {
                        Aitem.IntraOpMedications.splice(index, 1);
                    } else {
                        Aitem.IntraOpMedications.splice(index, 1);
                    }

                }
                $scope.IntraOrdersInit(Type);

            }
        }, function () {

        });
    }
    $scope.IntraOrdersInit = function () {
        let FinalOrderDetails = $filter('filter')($scope.IntraOpObj.OrderDetails, { 'MedTypeId': $scope.TempIntraOpObj.MedTypeId }, true) || [];
        if (FinalOrderDetails.length > 0) {
            angular.forEach(FinalOrderDetails, function (Mitem) {
                let temp = $filter('filter')(Mitem.IntraOpMedications, { 'DeleteInd': 'N' }, true) || [];
                let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                if (temp.length == 0 && temp1.length == 0) {
                    Mitem.DeleteInd = 'Y';
                }
            });
        }

    }
    $scope.DeleteIntraGeneralOrder = function (Mitem, item) {
        var index = Mitem.GeneralOrders.indexOf(item);
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            if (item.SurgeryGeneralOrderId === 0) {
                if (index > -1) {
                    Mitem.GeneralOrders.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }
            $scope.IntraOrdersInit('');
        }, function () {

        });
    }

    $scope.removeOrdersclick = function (item, diagType) {
        //if (diagType == 'Surgery') {
        var index = $scope.AsctemplateObj.SurgeryArray.indexOf(item);
        item.AscTemplateSurgeryId = item.AscTemplateSurgeryId || 0;
        if (item.AscTemplateSurgeryId == 0) {
            if (index > -1) {
                $scope.AsctemplateObj.SurgeryArray.splice(index, 1);
            }
        } else {
            $scope.AsctemplateObj.SurgeryArray[index].DeleteInd = 'Y';
        }
        /*}*/
    }


    $scope.GetOrganizationASCCheckListData = function () {
        let req
        if ($scope.ASCSectionsobj.TAB == 1 || $scope.ASCSectionsobj.TAB == 2) {
            //preop
            req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 1,
                "GetAllIndicator": 1
            };
        }
        if ($scope.ASCSectionsobj.TAB == 3 || $scope.ASCSectionsobj.TAB == 4) {
            //intraop
            req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 2
            };
        }
        if ($scope.ASCSectionsobj.TAB == 5 || $scope.ASCSectionsobj.TAB == 6) {
            //postop
            req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 3
            };
        }
        eHnoteSurgeryService.GetOrganizationASCCheckListData(req).then(function (resp) {
            if (resp.data.status === "Success") {

                if ($scope.ASCSectionsobj.TAB == 1) {


                    $scope.PreOpObj.OrgASCChecklist = resp.data.rows;
                    angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                    });

                    $scope.PreOpObj.ChunkedGeneralChecklist = [];
                    let tempArrayGeneral = $filter('filter')($scope.PreOpObj.OrgASCChecklist, { 'CheckListCategoryId': 6 }, true);
                    let filteredClinicalChecklist1 = angular.copy(tempArrayGeneral);
                    if (filteredClinicalChecklist1.length > 0) {
                        filteredClinicalChecklist1.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredClinicalChecklist1.length) / 2);
                        for (let i = 0; i < filteredClinicalChecklist1.length; i += chunkSize) {
                            $scope.PreOpObj.ChunkedGeneralChecklist.push(filteredClinicalChecklist1.slice(i, i + chunkSize));
                        }
                    }
                    $scope.PreOpObj.ChunkedClinicalChecklist = [];
                    let tempArray = $filter('filter')($scope.PreOpObj.OrgASCChecklist, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true);
                    let filteredClinicalChecklist = angular.copy(tempArray);
                    if (filteredClinicalChecklist.length > 0) {
                        filteredClinicalChecklist.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                        for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                            $scope.PreOpObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                        }
                    }

                }
                else if ($scope.ASCSectionsobj.TAB == 3) {
                    $scope.IntraOpObj.AllIntraOpChecklistsArray = [];
                    angular.forEach(resp.data.rows, function (item) {
                        item.IsChecked = false;
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                kitem.IsChecked = false;
                            });
                        }
                    });
                    let tempIntraopChecklistsArray = $filter('filter')(resp.data.rows, { 'CheckListModuleId': 2 }, true);
                    if (tempIntraopChecklistsArray.length > 0) {
                        $scope.IntraOpObj.AllIntraOpChecklistsArray = angular.copy(tempIntraopChecklistsArray);
                    }
                    if (resp.data.AnaesthesiaTypes.length > 0) {
                        $scope.IntraOpObj.AnesthesiaTypelist = resp.data.AnaesthesiaTypes || [];
                    }
                }
                else if ($scope.ASCSectionsobj.TAB == 5) {
                    resp.data.goalsList = resp.data.goalsList || [];
                    if (resp.data.goalsList.length > 0) {
                        $scope.PostOpObj.MasterAscPatientGoal = angular.copy(resp.data.goalsList);
                    }
                    $scope.PostOpObj.OrgASCChecklist = angular.copy(resp.data.rows) || [];
                    angular.forEach($scope.PostOpObj.OrgASCChecklist, function (item) {
                        item.IsChecked = false;
                    });

                    $scope.PostOpObj.CheckinCheckList = [];
                    let tempCheckinCheckList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1 }, true);
                    let filteredCheckinCheckList = angular.copy(tempCheckinCheckList);
                    if (filteredCheckinCheckList.length > 0) {
                        filteredCheckinCheckList.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredCheckinCheckList.length) / 2);
                        for (let i = 0; i < filteredCheckinCheckList.length; i += chunkSize) {
                            $scope.PostOpObj.CheckinCheckList.push(filteredCheckinCheckList.slice(i, i + chunkSize));
                        }
                    }

                    $scope.PostOpObj.ProgressNotesList = [];
                    let tempProgressNotesList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 18 }, true) || [];
                    let filteredProgressNotesList = angular.copy(tempProgressNotesList) || [];
                    if (filteredProgressNotesList.length > 0) {
                        filteredProgressNotesList.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredProgressNotesList.length) / 2);
                        for (let i = 0; i < filteredProgressNotesList.length; i += chunkSize) {
                            $scope.PostOpObj.ProgressNotesList.push(filteredProgressNotesList.slice(i, i + chunkSize));
                        }
                    }

                    $scope.PostOpObj.GeneralOrdersList = [];
                    let tempGeneralOrderList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 19 }, true) || [];
                    let filteredGeneralOrderList = angular.copy(tempGeneralOrderList) || [];
                    if (filteredGeneralOrderList.length > 0) {
                        filteredGeneralOrderList.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredGeneralOrderList.length) / 2);
                        for (let i = 0; i < filteredGeneralOrderList.length; i += chunkSize) {
                            $scope.PostOpObj.GeneralOrdersList.push(filteredGeneralOrderList.slice(i, i + chunkSize));
                        }
                    }
                    $scope.PostOpObj.CheckoutActionList = [];
                    let tempCheckoutActionList = $filter('filter')($scope.PostOpObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 2 }, true);
                    let filteredtCheckoutActionList = angular.copy(tempCheckoutActionList);
                    if (filteredtCheckoutActionList.length > 0) {
                        filteredtCheckoutActionList.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredtCheckoutActionList.length) / 2);
                        for (let i = 0; i < filteredtCheckoutActionList.length; i += chunkSize) {
                            $scope.PostOpObj.CheckoutActionList.push(filteredtCheckoutActionList.slice(i, i + chunkSize));
                        }
                    }
                }
            }

        }, function (err) {
            console.log(err);
        });

    };
    $scope.OnSelectAlderetScore1 = function (Obj, ParentObj) {
        angular.forEach($scope.PreOpObj.AlderetScoreDetails, function (item) {
            if (item.AldreteScoreTypeId === ParentObj.AldreteScoreTypeId) {
                angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                    kitem.IsChecked = false;
                });
            }
        });
        ParentObj.Value = Obj.AldreteScore;
        ParentObj.IsChecked = true;
        Obj.IsChecked = true;
        Obj.DeleteInd = 'N';
        ParentObj.DeleteInd = 'N';
        $scope.PreOpObj.TotalAlderetScore = null;
        let sum = 0;
        angular.forEach($scope.PreOpObj.AlderetScoreDetails, function (item) {
            if (item.DeleteInd == 'N') {
                sum += item.Value;
            }
        });

        $scope.PreOpObj.TotalAlderetScore = sum;
    };
    //$scope.GetOrganizationASCCheckListData();
    $scope.OnPreOpChecklistSelect = function (obj, parentobj) {
        var CheckListInd = false;
        angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {
            if (obj.IsChecked == true && item.Value == obj.Value) {
                CheckListInd = true;
                parentobj.AscTemplateCheckListDetailId = parentobj.AscTemplateCheckListDetailId || null;
                if (parentobj.AscTemplateCheckListDetailId != null) {
                    item.DeleteInd = "Y";
                }
            } else {
                item.IsChecked = false;
            }
        })

        if (CheckListInd == true) {
            obj.IsChecked = false;
            parentobj.IsChecked = false;


            if (parentobj.CheckListCategoryId === 1) {
                $scope.PreOpObj.IsAllNurseCheckListChecked = '';
            }
            if (parentobj.CheckListCategoryId === 5) {
                $scope.PreOpObj.IsAllMedicineCheckListChecked = '';
            }
            if (parentobj.CheckListCategoryId === 6) {
                $scope.PreOpObj.IsAllGeneralCheckListChecked = '';
            }


        } else {
            obj.IsChecked = true;
            parentobj.IsChecked = true;
            if (parentobj.Value == "Others") {
                parentobj.Remarks = "";
            }
            parentobj.Value = obj.Value || '';
            parentobj.ChecklistDate = null;
        }

        if (parentobj.CheckListCategoryId === 1) {
            if (obj.Value !== "N/A" && obj.Value !== "No" && obj.Value !== "Not") {
                //    parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }
            if (obj.Value == "Yes" || obj.Value == "Reviewed" || obj.Value == "Done") {
                $scope.PreOpObj.IsAllNurseCheckListChecked = $scope.PreOpObj.IsAllNurseCheckListChecked == 1 ? $scope.PreOpObj.IsAllNurseCheckListChecked : '';
            }
            if (obj.Value == "No" || obj.Value == "Not") {
                $scope.PreOpObj.IsAllNurseCheckListChecked = $scope.PreOpObj.IsAllNurseCheckListChecked == 2 ? $scope.PreOpObj.IsAllNurseCheckListChecked : '';
            }
            if (obj.Value == "N/A") {
                $scope.PreOpObj.IsAllNurseCheckListChecked = $scope.PreOpObj.IsAllNurseCheckListChecked == 3 ? $scope.PreOpObj.IsAllNurseCheckListChecked : '';
            }

            if (obj.CheckListId == 12 && obj.Value !== "Yes") {
                $scope.PreOpObj.NPOTime = '';
            }
            $scope.PreOpObj.IsAllNurseCheckListChecked = isAllChecklistChecked($scope.PreOpObj.ChunkedClinicalChecklist)
        }
        if (parentobj.CheckListCategoryId === 6) {
            if (obj.Value == "Yes" || obj.Value == "Reviewed" || obj.Value == "Done") {
                $scope.PreOpObj.IsAllGeneralCheckListChecked = $scope.PreOpObj.IsAllGeneralCheckListChecked == 1 ? $scope.PreOpObj.IsAllGeneralCheckListChecked : '';
                //    parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
            }
            if (obj.Value == "No" || obj.Value == "Not") {
                $scope.PreOpObj.IsAllGeneralCheckListChecked = $scope.PreOpObj.IsAllGeneralCheckListChecked == 2 ? $scope.PreOpObj.IsAllGeneralCheckListChecked : '';
            }
            if (obj.Value == "N/A") {
                $scope.PreOpObj.IsAllGeneralCheckListChecked = $scope.PreOpObj.IsAllGeneralCheckListChecked == 3 ? $scope.PreOpObj.IsAllGeneralCheckListChecked : '';
            }
            $scope.PreOpObj.IsAllGeneralCheckListChecked = isAllChecklistChecked($scope.PreOpObj.ChunkedGeneralChecklist)
        }
        if (parentobj.CheckListCategoryId === 5) {
            if (obj.Value == "Yes" || obj.Value == "Reviewed" || obj.Value == "Done") {
                $scope.PreOpObj.IsAllMedicineCheckListChecked = $scope.PreOpObj.IsAllMedicineCheckListChecked == 1 ? $scope.PreOpObj.IsAllMedicineCheckListChecked : '';
                if (parentobj.CheckListId == 40) {
                    //    parentobj.ChecklistDate = $filter('date')(new Date(), "MM-dd-yyyy");
                }
            }
            if (obj.Value == "No" || obj.Value == "Not") {
                $scope.PreOpObj.IsAllMedicineCheckListChecked = $scope.PreOpObj.IsAllMedicineCheckListChecked == 2 ? $scope.PreOpObj.IsAllMedicineCheckListChecked : '';
            }
            if (obj.Value == "N/A") {
                $scope.PreOpObj.IsAllMedicineCheckListChecked = $scope.PreOpObj.IsAllMedicineCheckListChecked == 3 ? $scope.PreOpObj.IsAllMedicineCheckListChecked : '';
            }
            var MedicalCheckListArray = $filter("filter")($scope.PreOpObj.OrgASCChecklist, { "CheckListCategoryId": 5 }, true) || [];
            $scope.PreOpObj.IsAllMedicineCheckListChecked = isAllChecklistChecked(MedicalCheckListArray);
        }
        if ($scope.PreOpObj.IsAllNurseCheckListChecked === '' || $scope.PreOpObj.IsAllGeneralCheckListChecked === '' || $scope.PreOpObj.IsAllMedicineCheckListChecked === '') {
            $scope.PreOpObj.IsAllCheckListChecked = '';
        }
    };

    $scope.ChangeFallRisKChecklist = function (bool, MItem) {
        angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
            item.IsChecked = false;
        });
        bool.IsChecked = true;
        MItem.IsChecked = true;
        MItem.Value = bool.Value || '';
        MItem.Score = bool.SubValue;


        $scope.PreOpObj.FallRiskAssessmentTotalScore = 0;
        angular.forEach($scope.PreOpObj.OrgASCChecklist, function (Titem) {
            if ((Titem.IsChecked) && (Titem.CheckListId == 162 || Titem.CheckListId == 163 || Titem.CheckListId == 164 || Titem.CheckListId == 165 || Titem.CheckListId == 166 || Titem.CheckListId == 167)) {
                Titem.Score = Titem.Score || 0;
                $scope.PreOpObj.FallRiskAssessmentTotalScore += Titem.Score || 0;
            }
        });

        //if ($scope.PreOpObj.FallRiskAssessmentTotalScore <= 24) {
        //    $scope.PreOpObj.FallRiskLevel = 'Low Risk';
        //    $scope.PreOpObj.ImplementedFallRiskProtocoltype = 'Good basic nursing care taken';
        //} else if ($scope.PreOpObj.FallRiskAssessmentTotalScore >= 25 && $scope.PreOpObj.FallRiskAssessmentTotalScore <= 44) {
        //    $scope.PreOpObj.FallRiskLevel = 'Modarate Risk';
        //    $scope.PreOpObj.ImplementedFallRiskProtocoltype = 'Implemented standard fall prevention interventions';
        //} else if ($scope.PreOpObj.FallRiskAssessmentTotalScore >= 45) {
        //    $scope.PreOpObj.FallRiskLevel = 'High Risk';
        //    $scope.PreOpObj.ImplementedFallRiskProtocoltype = 'Implemeted high risk fall prevention interventions';
        //}
        //$scope.uibclose = function () {
        //    $uibModalInstance.dismiss("cancel");
        //};
    };

    $scope.OnSelectFireRiskAssesChecklist = function (bool, Item) {
        if (bool) {
            //if (Item.CheckListId == 159) {
            //    $scope.IntraOpObj.NurseActionobj.IsShowAnesthetistReviewByinFireRisk = true;
            //}
            //if (Item.CheckListId == 160) {
            //    $scope.IntraOpObj.NurseActionobj.IsShowDoctorReviewByinFireRisk = true;
            //}
        } else {
            //if (Item.CheckListId == 159) {
            //    $scope.IntraOpObj.NurseActionobj.IsShowAnesthetistReviewByinFireRisk = false;
            //    $scope.IntraOpObj.NurseActionobj.AnesthetistFireRiskID = 0;
            //    $scope.IntraOpObj.NurseActionobj.AnesthetistFireRiskName = '';
            //}
            //if (Item.CheckListId == 160) {
            //    $scope.IntraOpObj.NurseActionobj.IsShowDoctorReviewByinFireRisk = false;
            //    $scope.IntraOpObj.NurseActionobj.DoctorFireRiskID = 0;
            //    $scope.IntraOpObj.NurseActionobj.DoctorFireRiskName = '';
            //}
            if (!Item.IsChecked && Item.SubCheckList.length > 0) {
                angular.forEach(Item.SubCheckList, function (sitem) {
                    sitem.IsChecked = false;
                });
            }
        }

        var FireRisccount = 0;
        angular.forEach($scope.IntraOpObj.AllIntraOpChecklistsArray, function (sitem) {
            if (sitem.CheckListCategoryId == 10 && sitem.IsChecked) {
                FireRisccount++;
            }
        });
        if (FireRisccount == 0) {
            //$scope.IntraOpObj.NurseActionobj.RiskLevel = '';
            //$scope.IntraOpObj.NurseActionobj.NurseFireRiskID = 0;
            //$scope.IntraOpObj.NurseActionobj.NurseFireRiskName = '';
        }
        //else if (FireRisccount <= 2) {
        //    $scope.IntraOpObj.NurseActionobj.RiskLevel = 'Low Risk';
        //} else if (FireRisccount == 3) {
        //    $scope.IntraOpObj.NurseActionobj.RiskLevel = 'Potential to convert to high risk';
        //} else if (FireRisccount > 3) {
        //    $scope.IntraOpObj.NurseActionobj.RiskLevel = 'High risk';
        //}
        else { }
    };
    $scope.PreopOnClickNormalInChecklists = function (boolvalue, id) {
        id = id || null;
        if (id != null) {
            if (boolvalue) {
                angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                    if (item.CheckListCategoryId === id) {
                        if (item.IsNormal) {
                            item.IsChecked = true;
                        }
                        item.SubCheckList = item.SubCheckList || [];
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                if (kitem.IsNormal) {
                                    kitem.IsChecked = true;
                                }
                            });
                        }
                        if (item.IsNormal == null || item.IsNormal == false) {
                            if (item.IsChecked = true) {
                                item.IsChecked = false;
                            }
                            item.SubCheckList = item.SubCheckList || [];
                            if (item.SubCheckList.length > 0) {
                                angular.forEach(item.SubCheckList, function (kitem) {
                                    if (kitem.IsNormal == false || kitem.IsNormal == null) {
                                        if (kitem.IsChecked = true) {
                                            kitem.IsChecked = false;
                                        }
                                    }
                                });
                            }
                        }

                    }
                });
            } else {
                angular.forEach($scope.PreOpObj.OrgASCChecklist, function (item) {
                    if (item.CheckListCategoryId === id) {
                        if (item.IsNormal) {
                            item.IsChecked = false;
                        }
                        item.SubCheckList = item.SubCheckList || [];
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                if (kitem.IsNormal) {
                                    kitem.IsChecked = false;
                                }
                            });
                        }
                    }
                });
            }
        }
    };

    $scope.OnClickNormalInChecklists = function (boolvalue, id) {
        id = id || null;
        if (id != null) {
            if (boolvalue) {
                angular.forEach($scope.IntraOpObj.AllIntraOpChecklistsArray, function (item) {
                    if (item.CheckListCategoryId === id) {
                        if (item.IsNormal) {
                            item.IsChecked = true;
                        }
                        item.SubCheckList = item.SubCheckList || [];
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                if (kitem.IsNormal) {
                                    kitem.IsChecked = true;
                                }
                            });
                        }
                        if (item.IsNormal == null || item.IsNormal == false) {
                            if (item.IsChecked = true) {
                                item.IsChecked = false;
                            }
                            item.SubCheckList = item.SubCheckList || [];
                            if (item.SubCheckList.length > 0) {
                                angular.forEach(item.SubCheckList, function (kitem) {
                                    if (kitem.IsNormal == false || kitem.IsNormal == null) {
                                        if (kitem.IsChecked = true) {
                                            kitem.IsChecked = false;
                                        }
                                    }
                                });
                            }
                        }

                    }
                });
            } else {
                angular.forEach($scope.IntraOpObj.AllIntraOpChecklistsArray, function (item) {
                    if (item.CheckListCategoryId === id) {
                        if (item.IsNormal) {
                            item.IsChecked = false;
                        }
                        item.SubCheckList = item.SubCheckList || [];
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                if (kitem.IsNormal) {
                                    kitem.IsChecked = false;
                                }
                            });
                        }
                    }
                });
            }
        }
    };
    $scope.OnSelectMainChecklist = function (boolvalue, obj) {
        if (boolvalue) {
            if (obj.SubCheckList.length > 0) {
                angular.forEach(obj.SubCheckList, function (kitem) {
                    kitem.IsChecked = true;
                });
            }

        } else {
            if (obj.SubCheckList.length > 0) {
                angular.forEach(obj.SubCheckList, function (kitem) {
                    kitem.IsChecked = false;
                });
            }
        }

        // check,uncheck "Normal" checkbox case
        CheckUncheckNormalCheckBox();
    };
    function CheckUncheckNormalCheckBox() {
        let counter = 0;
        let counter1 = 0;
        let counter11 = 0;
        let beforeAnesthesiaChecklistArray = $filter('filter')($scope.IntraOpObj.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 7 }, true);
        angular.forEach(beforeAnesthesiaChecklistArray, function (item) {
            if (item.IsNormal) {
                counter++;
            }
            if (item.IsChecked && item.IsNormal) {
                counter1++;
            }
            if (item.IsChecked) {
                counter11++;
            }
            if (item.SubCheckList.length > 0) {
                angular.forEach(item.SubCheckList, function (kitem) {
                    if (kitem.IsNormal) {
                        counter++;
                    }
                    if (kitem.IsChecked && kitem.IsNormal) {
                        counter1++;
                    }
                    if (kitem.IsChecked) {
                        counter11++;
                    }
                });
            }
        });

        if (counter == counter1 && counter1 == counter11) {
            $scope.IntraOpObj.IsBeforeAnesthesiaNormal = true;
        } else {
            $scope.IntraOpObj.IsBeforeAnesthesiaNormal = false;
        }

        let counter2 = 0;
        let counter3 = 0;
        let counter33 = 0;
        let beforeIncisionChecklistArray = $filter('filter')($scope.IntraOpObj.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 8 }, true);
        angular.forEach(beforeIncisionChecklistArray, function (item) {
            if (item.IsNormal) {
                counter2++;
            }
            if (item.IsChecked && item.IsNormal) {
                counter3++;
            }
            if (item.IsChecked) {
                counter33++;
            }
            if (item.SubCheckList.length > 0) {
                angular.forEach(item.SubCheckList, function (kitem) {
                    if (kitem.IsNormal) {
                        counter2++;
                    }
                    if (kitem.IsChecked && kitem.IsNormal) {
                        counter3++;
                    }
                    if (kitem.IsChecked) {
                        counter33++;
                    }
                });
            }
        });

        if (counter2 == counter3 && counter3 == counter33) {
            $scope.IntraOpObj.IsBeforeIncisionNormal = true;
        } else {
            $scope.IntraOpObj.IsBeforeIncisionNormal = false;
        }

        let counter4 = 0;
        let counter5 = 0;
        let counter55 = 0;
        let beforeORChecklistArray = $filter('filter')($scope.IntraOpObj.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 9 }, true);
        angular.forEach(beforeORChecklistArray, function (item) {
            if (item.IsNormal) {
                counter4++;
            }
            if (item.IsChecked && item.IsNormal) {
                counter5++;
            }
            if (item.IsChecked) {
                counter55++;
            }
            if (item.SubCheckList.length > 0) {
                angular.forEach(item.SubCheckList, function (kitem) {
                    if (kitem.IsNormal) {
                        counter4++;
                    }
                    if (kitem.IsChecked && kitem.IsNormal) {
                        counter5++;
                    }
                    if (kitem.IsChecked) {
                        counter55++;
                    }
                });
            }
        });

        if (counter4 == counter5 && counter5 == counter55) {
            $scope.IntraOpObj.IsBeforeORNormal = true;
        } else {
            $scope.IntraOpObj.IsBeforeORNormal = false;
        }
    }
    $scope.OnSelectSubChecklist = function (boolvalue, obj) {
        if (boolvalue) {
            obj.IsChecked = true;

        } else {
            let tempArray = $filter('filter')(obj.SubCheckList, { 'IsChecked': false }, true);
            if (tempArray.length == obj.SubCheckList.length) {
                obj.IsChecked = false;
            }
        }

        // check,uncheck "Normal" checkbox case
        CheckUncheckNormalCheckBox();
    };
    $scope.OnInraOpChecklistSelect = function (sitem, MItem) {
        if (sitem.CheckListId == 180 || sitem.CheckListId == 178 || sitem.CheckListId == 179) {
            var IntraCheckListInd = false;
            angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
                if (sitem.IsChecked == true && item.Value == sitem.Value) {
                    IntraCheckListInd = true;
                }

            });
            if (sitem.IsChecked == true) {
                MItem.IsChecked = false;
                sitem.IsChecked = false;

                sitem.AscTemplateMultiCheckListDetailId = sitem.AscTemplateMultiCheckListDetailId || 0;
                if (sitem.AscTemplateMultiCheckListDetailId !== 0) {
                    sitem.DeleteInd = 'Y';
                }

            } else {
                MItem.IsChecked = true;
                sitem.IsChecked = true;
            }

        } else {
            if (MItem.CheckListCode == 177) {
                if (sitem.IsChecked == true) {
                    MItem.IsChecked = false;
                    sitem.IsChecked = false;
                    MItem.Remarks = "";
                } else {
                    angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
                        item.IsChecked = false;
                    });
                    MItem.IsChecked = true;
                    sitem.IsChecked = true;
                    MItem.Value = sitem.Value || '';
                    MItem.ChecklistDate = null;
                }

            }
        }
    }
    $scope.OnInraOpAnesthesiaCheckoutChecklistSelect = function (sitem, MItem) {
        if (MItem.CheckListCode == 336) {

            if (sitem.IsChecked == true) {
                MItem.IsChecked = false;
                sitem.IsChecked = false;

                sitem.AscTemplateCheckListDetailId = sitem.AscTemplateCheckListDetailId || 0;
                if (sitem.AscTemplateCheckListDetailId !== 0) {
                    sitem.DeleteInd = 'Y';
                }


            } else {

                MItem.IsChecked = true;
                sitem.IsChecked = true;
            }

        } else {
            if (sitem.IsChecked == true) {
                MItem.IsChecked = false;
                sitem.IsChecked = false;

                sitem.AscTemplateCheckListDetailId = sitem.AscTemplateCheckListDetailId || 0;
                if (sitem.AscTemplateCheckListDetailId !== 0) {
                    sitem.DeleteInd = 'Y';
                }


            } else {
                angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
                    item.IsChecked = false;
                });
                MItem.IsChecked = true;
                sitem.IsChecked = true;
                MItem.Value = sitem.Value || '';
                MItem.ChecklistDate = null;
            }
        }
    }

    $scope.OnInraOpAnesthesiaCheckinchecklist = function (sitem, MItem) {


        if (sitem.IsChecked == true) {
            MItem.IsChecked = false;
            sitem.IsChecked = false;

            sitem.PatientMultiCheckListId = sitem.PatientMultiCheckListId || 0;
            if (sitem.PatientMultiCheckListId !== 0) {
                sitem.DeleteInd = 'Y';
            }


        } else {
            angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
                item.IsChecked = false;
            });
            MItem.IsChecked = true;
            sitem.IsChecked = true;
            MItem.Value = sitem.Value || '';
            MItem.ChecklistDate = null;
        }

    }
    $scope.FireRiskAssessmentsublistPopoverClick = function (item) {
        $scope.popOverhtmlContent = "";
        item.Description = item.Description || "";
        if (item.Description != "") {
            //    $scope.popOverhtmlContent = $sce.trustAsHtml(item.Description);
        }

    };
    $scope.OnSelectMultipleChecklist = function (sitem, MItem) {
        if (sitem.IsChecked == true) {
            sitem.AscTemplateMultiCheckListDetailId = sitem.AscTemplateMultiCheckListDetailId || 0;
            if (sitem.AscTemplateMultiCheckListDetailId !== 0) {
                sitem.DeleteInd = 'Y';
            }
            MItem.IsChecked = false;
            sitem.IsChecked = false;
        } else {
            MItem.IsChecked = true;
            sitem.IsChecked = true;
        }
    };
    $scope.PostOpselectedItem = function (subArray, item) {
        if (item.CheckListId == 136) {
            if (item.IsChecked == true) {
                item.IsChecked = false;
                item.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || null;
                if (item.AscTemplateCheckListDetailId != null) {
                    item.DeleteInd = "Y";
                }
            } else {
                item.IsChecked = true;
            }
        } else {
            if (item.IsChecked == true) {
                angular.forEach(subArray, function (sitem) {
                    sitem.IsChecked = false;

                });
                item.AscTemplateCheckListDetailId = item.AscTemplateCheckListDetailId || null;
                if (item.AscTemplateCheckListDetailId != null) {
                    item.DeleteInd = "Y";
                }
            } else {
                if (subArray.length > 0) {
                    angular.forEach(subArray, function (sitem) {
                        sitem.IsChecked = false;
                        if (sitem.OrganizationPreOpCheckListValueId == item.OrganizationPreOpCheckListValueId) {
                            item.IsChecked = true;
                        }
                    });
                }
            }

            if (item.CheckListId == 241) {
                if (item.IsChecked == true && item.Value == "Yes") {
                    $scope.IsDiscontinueoxygen = true;
                } else {
                    $scope.IsDiscontinueoxygen = false;
                    angular.forEach($scope.PostOpObj.PatientInterventionsList, function (sitem) {
                        if (sitem.CheckListId == 242 || sitem.CheckListId == 250) {
                            angular.forEach(sitem.OrganizationCheckListDetails, function (nitem) {
                                nitem.IsChecked = false;
                                nitem.AscTemplateCheckListDetailId = nitem.AscTemplateCheckListDetailId || null;
                                if (nitem.AscTemplateCheckListDetailId !== null) {
                                    nitem.DeleteInd = "Y";
                                }
                            });
                        }
                    });
                }
            };
        }
    }
    $scope.OnclickGoalValue = function (obj, val) {
        if (val === "Yes") {
            if (obj.Value == "Yes") {
                obj.Value = "";
                obj.ASCTemplatePatientGoalId = obj.ASCTemplatePatientGoalId || null;
                if (obj.ASCTemplatePatientGoalId != null) {
                    obj.DeleteInd = "Y";
                }
            } else if (obj.Value == "No" || obj.Value == "") {
                obj.Value = "Yes";
                obj.DeleteInd = "N";
            }

            let tempArray = $filter('filter')($scope.PostOpObj.MasterAscPatientGoal, { 'Value': "Yes" }, true);

            if (tempArray.length === $scope.PostOpObj.MasterAscPatientGoal.length) {
                $scope.PostOpObj.IsAllActionCheckListCheckedGoal = 1;
            } else {
                $scope.PostOpObj.IsAllActionCheckListCheckedGoal = null;
            }

        }

        if (val === "No") {
            if (obj.Value == "No") {
                obj.Value = "";
                obj.ASCTemplatePatientGoalId = obj.ASCTemplatePatientGoalId || null;
                if (obj.ASCTemplatePatientGoalId != null) {
                    obj.DeleteInd = "Y";
                }
            } else if (obj.Value == "Yes" || obj.Value == "") {
                obj.Value = "No";
                obj.DeleteInd = "N";
            }
            let tempArray = $filter('filter')($scope.PostOpObj.MasterAscPatientGoal, { 'Value': "No" }, true);


        }
    };

    //$scope.SelectPostOpMedicationItems = function (item, type) {

    //    //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": $scope.TempPostOpObj.MedTypeId, 'IsOrderReviewed': false }, true);
    //    let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
    //        return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempPostOpObj.MedTypeId;
    //    }) || [];
    //    let i = 0;
    //    let MedTypeName = '';
    //    if ($scope.TempPostOpObj.MedTypeId == 5) {
    //        MedTypeName = 'PostOp Medication';
    //    } else if ($scope.TempPostOpObj.MedTypeId == 8) {
    //        MedTypeName = 'Postop Anesthesia Medications'
    //    }
    //    angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
    //        if (mitem.MedTypeId == $scope.TempPostOpObj.MedTypeId) {
    //            angular.forEach(mitem.PostOpMedications, function (Aitem) {
    //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
    //                    i++;
    //                }
    //            });
    //        };
    //    });

    //    if (i > 0) {
    //        alertify.error('You have already entered this Medication');
    //        $scope.TempPostOpMedicationObj.MedicineObject = "";
    //        return false;
    //    }
    //    if (templist.length > 0) {

    //        let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
    //        if (List.length > 0) {
    //            alertify.error("Medicine name already added!");
    //            $scope.TempPostOpMedicationObj.MedicineObject = '';
    //            return false;
    //        }
    //        let GivenBy = null;
    //        let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
    //        if (loggedUser.length > 0) {
    //            GivenBy = loggedUser[0].DoctorID;
    //        }


    //        var obj = {
    //            "AscMedicationId": 0,
    //            "OrganizationMedicationId": item.OrganizationPrescriptionId,
    //            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
    //            "ParentOrganizationId": $scope.ParenthospitalId,
    //            "ASCOrganizationMedicationId": 0,
    //            "Strength": item.Strength || '',
    //            "IsFrequent": item.IsFrequent || 'N',
    //            "MedicineId": item.MedicineId,
    //            "MedicationName": item.MedicineName,
    //            "IsChecked": false,
    //            "IsDilationMed": false,
    //            "IsIntraAnesthesiaMed": false,
    //            "IsIntraMed": false,
    //            "IsPreOPMed": false,
    //            "MedicationDosage": "",
    //            "DropTimings": [],
    //            "TypeId": $scope.TempPostOpObj.MedTypeId,
    //            "DeleteInd": "N"
    //        }
    //        templist[0].PostOpMedications.push(obj);
    //        $scope.TempPostOpMedicationObj.MedicineObject = "";


    //    } else {

    //        //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
    //        let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
    //            return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
    //        }) || [];
    //        if (templist2.length > 0) {
    //            templist2[0].MedTypeId = $scope.TempPostOpObj.MedTypeId;
    //            templist2[0].MedTypeName = MedTypeName;
    //        } else {

    //            //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempPostOpObj.MedTypeId }, true) || [];
    //            let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
    //                return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempPostOpObj.MedTypeId;
    //            }) || [];
    //            if (templist3.length > 0) {

    //            } else {
    //                var obj = {
    //                    "UserOrderId": 0,
    //                    "UserId": $scope.UserId,
    //                    "DeleteInd": "N",
    //                    "IsOrderReviewed": false,
    //                    "ReviewedByDateTime": null,
    //                    "ReviewedByPassword": '',
    //                    "ReviewedBy": null,
    //                    "UserType": "Anesthesia",
    //                    "ScreenType": "PostOp",
    //                    "ScreenTypeId": 6,
    //                    "MedTypeId": $scope.TempPostOpObj.MedTypeId,
    //                    "MedTypeName": MedTypeName,
    //                    "PostOpMedications": [],
    //                    "GeneralOrders": [],
    //                }
    //                $scope.PostOpObj.OrderDetails.push(obj);
    //            }

    //        }
    //        //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": $scope.TempPostOpObj.MedTypeId }, true) || [];
    //        let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
    //            return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempPostOpObj.MedTypeId;
    //        }) || [];
    //        if (templist1.length > 0) {
    //            let List1 = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
    //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
    //            if (List.length > 0) {
    //                alertify.error("Medicine name already added!");
    //                $scope.TempPostOpMedicationObj.MedicineObject = "";
    //                return false;
    //            }
    //            let GivenBy = null;


    //            var obj = {
    //                "AscMedicationId": 0,
    //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
    //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
    //                "ParentOrganizationId": $scope.ParenthospitalId,
    //                "ASCOrganizationMedicationId": 0,
    //                "Strength": item.Strength || '',
    //                "IsFrequent": item.IsFrequent || 'N',
    //                "MedicineId": item.MedicineId,
    //                "MedicationName": item.MedicineName,
    //                "IsChecked": false,
    //                "IsDilationMed": false,
    //                "IsIntraAnesthesiaMed": false,
    //                "IsIntraMed": false,
    //                "IsPreOPMed": false,
    //                "MedicationDosage": "",
    //                "DropTimings": [],
    //                "TypeId": $scope.TempPostOpObj.MedTypeId,
    //                "DeleteInd": "N"
    //            }
    //            templist1[0].PostOpMedications.push(obj);
    //            $scope.TempPostOpMedicationObj.MedicineObject = "";

    //        }
    //    }
    //};

    $scope.AddPostopGeneralOrder = function (Type) {
        if ($scope.TempPostOpObj.MedTypeId == 5) {
            Type = 'Nurse';
        } else if ($scope.TempPostOpObj.MedTypeId == 8) {
            Type = 'Anesthesia';
        }
        if (Type == 'Nurse') {
            if ($scope.TempPostOpObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }
            //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 5, 'IsOrderReviewed': false }, true);
            let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.TempPostOpObj.MedTypeId;
            }) || [];
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.TempPostOpObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",
                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.TempPostOpObj.OrderName = "";
            } else {
                //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 5;
                    templist2[0].MedTypeName = 'PostOp Medication';
                } else {

                    //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                    let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                        return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == 5;
                    }) || [];

                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "ReviewedBy": null,
                            "UserType": "Nurse",
                            "ScreenType": "PostOp",
                            "ScreenTypeId": 6,
                            "MedTypeId": 5,
                            "MedTypeName": 'PostOp Medication',
                            "PostOpMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.PostOpObj.OrderDetails.push(obj);
                    }

                }

                //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == 5;
                }) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.TempPostOpObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.TempPostOpObj.OrderName = "";
                } else {

                }
            }
        } else {
            if ($scope.TempPostOpObj.OrderName == '') {
                alertify.error("Please Enter General Orders!");
                return false;
            }
            //let templist = $filter("filter")($scope.PostOpObj.OrderDetails, { "MedTypeId": 8, 'IsOrderReviewed': false }, true);
            let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                return poitem.DeleteInd == 'N' && poitem.MedTypeId == 8;
            }) || [];
            if (templist.length > 0) {
                let Gobj = {
                    "GeneralOrderId": null,
                    "MedicineName": $scope.TempPostOpObj.OrderName || '',
                    "DeleteInd": "N",
                    "Status": "",
                    "MedicationTime": "",
                }
                templist[0].GeneralOrders.push(Gobj);
                $scope.TempPostOpObj.OrderName = "";
            } else {
                //let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == null;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 8;
                    templist2[0].MedTypeName = 'Postop Anesthesia Medications';
                } else {

                    //let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8 }, true) || [];
                    let templist3 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                        return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == 8;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "ReviewedBy": null,
                            "UserType": "Anesthesia",
                            "ScreenType": "PostOp",
                            "ScreenTypeId": 6,
                            "MedTypeId": 8,
                            "MedTypeName": 'Postop Anesthesia Medications',
                            "PostOpMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.PostOpObj.OrderDetails.push(obj);
                    }

                }

                //let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 8 }, true) || [];
                let templist1 = $filter("filter")($scope.PostOpObj.OrderDetails, function (poitem) {
                    return poitem.ReviewedBy == null && poitem.DeleteInd == 'N' && poitem.MedTypeId == 8;
                }) || [];

                if (templist1.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.TempPostOpObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist1[0].GeneralOrders.push(Gobj);
                    $scope.TempPostOpObj.OrderName = "";
                } else {

                }
            }
        };
    }
    $scope.PostOpOrdersInit = function () {
        let FinalOrderDetails = $filter('filter')($scope.PostOpObj.OrderDetails, { 'MedTypeId': $scope.TempPostOpObj.MedTypeId }, true) || [];
        if (FinalOrderDetails.length > 0) {
            angular.forEach(FinalOrderDetails, function (Mitem) {
                let temp = $filter('filter')(Mitem.PostOpMedications, { 'DeleteInd': 'N' }, true) || [];
                let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                if (temp.length == 0 && temp1.length == 0) {
                    Mitem.DeleteInd = 'Y';
                }
            });
        }
    }
    $scope.DeletePostOpMainMediacation = function (item, Aitem, Type) {

        var index = Aitem.PostOpMedications.indexOf(item);
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            if (item.SurgeryTemplateMedicationId != 0) {
                if (index > -1) {
                    item.DeleteInd = 'Y';
                }
                $scope.$digest();
                $scope.PostOpOrdersInit();

            }
            else {
                if (index > -1) {
                    Aitem.PostOpMedications.splice(index, 1);

                }
                $scope.PostOpOrdersInit();

            }
        }, function () {

        });

    }
    $scope.DeletePostOpGeneralOrder = function (Mitem, item) {
        var index = Mitem.GeneralOrders.indexOf(item);
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            if (item.SurgeryGeneralOrderId === 0) {
                if (index > -1) {
                    Mitem.GeneralOrders.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }
            $scope.PostOpOrdersInit();
        }, function () {

        });
    }


    $scope.LabsStudiesTypes = {
        "Laboratory": 'LabInvestigation',
        "Examination": 'Investigation',
        "LaboratoryTypeId": 1,
        "ExaminationTypeId": 2
    };

    $scope.LabsStudiesObj = {
        "OrderType": 'Laboratories',
        "LabInvestigationObj": "",
        "ExaminationObj": "",
        "SelectedExaminationItem": "",
        "LocationId": null
    };
    $scope.CoordinatorChecklistObj = {
        "CheckListName": "",
        "ChecklistValueType":""
    };
    $scope.CoordinatorChecklistArray = [];


    $scope.IsLabsStudiesInvestigation = function (item) {
        return !!item && (item.TypeName === $scope.LabsStudiesTypes.Laboratory || item.TypeName === $scope.LabsStudiesTypes.Examination);
    };



    function getLabsStudiesInvestigationObj(InvestigationId, InvestigationName, ProcedureCode, OrgInvestigationId, TypeName, LocationId) {

        var TypeId = null;

        if (TypeName === $scope.LabsStudiesTypes.Laboratory) {
            TypeId = $scope.LabsStudiesTypes.LaboratoryTypeId; // 1
        }
        else if (TypeName === $scope.LabsStudiesTypes.Examination) {
            TypeId = $scope.LabsStudiesTypes.ExaminationTypeId; // 2
        }
        return {
            "AscTemplateInvestigationId": 0,
            "ProcedureCode": ProcedureCode || "",
            "OrgInvestigationId": OrgInvestigationId || null,
            "InvestigationId": InvestigationId,
            "InvestigationName": InvestigationName,
            "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "OrganId": LocationId || null,
            "DeleteInd": "N",
            "IsEdit": false,
            "IsNoteEdit": false,
            "ShowDateFormat": false,
            "DurationDate": null,
            "Duration": null,
            "DurationType": "",
            "Remarks": "",
            "LocationId": LocationId || null,
            "InvestigationNotes": null,
            "TypeName": TypeName,
            "TypeId": TypeId
        };
    }

    function addLabsStudiesInvestigation(object) {
        $scope.Surgeryobj.Investigationslist = $scope.Surgeryobj.Investigationslist || [];
        let existing = $filter("filter")($scope.Surgeryobj.Investigationslist, function (item) {
            return item.DeleteInd === 'N' && item.TypeName === object.TypeName && item.InvestigationId === object.InvestigationId
                && (object.TypeName !== $scope.LabsStudiesTypes.Examination || item.LocationId == object.LocationId);
        }) || [];
        if (existing.length > 0) {
            alertify.error('You already entered this Investigation');
            return false;
        }
        $scope.Surgeryobj.Investigationslist.push(object);
        return true;
    }

    // Laboratories: ROS LabInvestigation master (GetMasterLabInvestigation), added on select like OnRosLabInvestigationBlurChange
    $scope.OnSelectLabsStudiesLaboratory = function (LabItem) {
        $scope.LabsStudiesObj.LabInvestigationObj = "";
        if (!LabItem || !LabItem.ProcedureId) {
            return;
        }
        addLabsStudiesInvestigation(getLabsStudiesInvestigationObj(LabItem.ProcedureId, LabItem.ProcedureName, LabItem.CPTCODE, null, $scope.LabsStudiesTypes.Laboratory, null));
    };

    // Default Eye for a new Examination Order = Organ of the Surgery selected on the Orders screen (same selection the parent
    // AscCoordinatorOrderstemplatePopUp uses), else the popup's AsctemplateObj.OrganId. Only OD/OS/OU (1/2/3) map to an Eye;
    // Other/RT/LT or no Organ -> null, so the user selects OD/OS/OU manually as before.
    function getLabsStudiesDefaultLocationId() {
        let OrganId = null;
        let SelectedTemplist = $filter("filter")($scope.AdvisedOrderDetailsArray || [], function (oitem) {
            return oitem.IsEditData;
        }) || [];
        if (SelectedTemplist.length > 0) {
            let SelectedOrderlist = $filter("filter")(SelectedTemplist[0].OrderDetails || [], function (oitem) {
                return oitem.ISSelectedOrderDetailItem;
            }) || [];
            if (SelectedOrderlist.length > 0) {
                OrganId = SelectedOrderlist[0].OrganId;
            }
        }
        if (!OrganId && $scope.AsctemplateObj) {
            OrganId = $scope.AsctemplateObj.OrganId;
        }
        OrganId = parseInt(OrganId, 10);
        return (OrganId === 1 || OrganId === 2 || OrganId === 3) ? OrganId : null;
    }

    // applies the Surgery Organ only when no Eye is selected yet, so a manual selection is never overwritten
    $scope.SetLabsStudiesDefaultEye = function () {
        if (!$scope.LabsStudiesObj.LocationId) {
            $scope.LabsStudiesObj.LocationId = getLabsStudiesDefaultLocationId();
        }
    };

    // Examination Orders: Assessment Orders -> Investigation master, with OD/OS/OU (LocationId/OrganId 1/2/3)
    $scope.OnSelectLabsStudiesExamination = function (InvItem) {
        $scope.LabsStudiesObj.SelectedExaminationItem = (InvItem && InvItem.ProcedureId) ? InvItem : "";
        $scope.SetLabsStudiesDefaultEye();
    };

    $scope.AddLabsStudiesExamination = function () {
        let InvItem = $scope.LabsStudiesObj.SelectedExaminationItem;
        if (!InvItem || typeof $scope.LabsStudiesObj.ExaminationObj !== 'object') {
            alertify.error("Please Select Examination Order!");
            return false;
        }
        if (!$scope.LabsStudiesObj.LocationId) {
            alertify.error("Please Select OD / OS / OU!");
            return false;
        }
        let object = getLabsStudiesInvestigationObj(InvItem.ProcedureId, InvItem.ProcedureName, InvItem.CPTCode || InvItem.ProcedureCode, InvItem.OrganizationProcedureId, $scope.LabsStudiesTypes.Examination, $scope.LabsStudiesObj.LocationId);
        if (addLabsStudiesInvestigation(object)) {
            $scope.LabsStudiesObj.ExaminationObj = "";
            $scope.LabsStudiesObj.SelectedExaminationItem = "";
            $scope.LabsStudiesObj.LocationId = getLabsStudiesDefaultLocationId();
        }
    };

    $scope.GetLabsStudiesLocationName = function (LocationId) {
        let location = $filter("filter")($scope.GetLocationNameList, { "LocationId": parseInt(LocationId, 10) }, true)[0];
        return location ? location.LocationName : '';
    };

    // isCopy: ids are cleared so the copied rows are inserted as new rows
    $scope.SetLabsStudiesFromTemplate = function (source, isCopy) {
        let InvestigationsList = angular.copy((source || {}).InvestigationsList || []);
        $scope.Surgeryobj.Investigationslist = $filter("filter")(InvestigationsList, function (item) {
            return $scope.IsLabsStudiesInvestigation(item) && (!isCopy || item.DeleteInd !== 'Y');
        }) || [];
        angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
            item.InvestigationName = item.InvestigationName || '';
            item.LocationId = item.LocationId || item.OrganId || null;
            item.OrganId = item.LocationId;
            item.DeleteInd = item.DeleteInd || 'N';
            if (isCopy) {
                item.AscTemplateInvestigationId = 0;
            }
        });
    };

    $scope.AddCoordinatorChecklist = function () {
        let CheckListName = ($scope.CoordinatorChecklistObj.CheckListName || '').trim();
        if (CheckListName === '') {
            alertify.error("Please Enter Coordinator Checklist!");
            return false;
        }

        if ($scope.CoordinatorChecklistObj.ChecklistValueType === "") {
            alertify.error("Please Select Any One Value!");
            return false;
        }

        let tempArray = [];
        if ($scope.CoordinatorChecklistObj.ChecklistValueType == "1") {
            tempArray = [
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "Yes",
                    "DeleteInd": "N",
                    "IsChecked": false
                },
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "No",
                    "DeleteInd": "N",
                    "IsChecked": false
                },
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "N/A",
                    "DeleteInd": "N",
                    "IsChecked": false
                }
            ];
        } else if ($scope.CoordinatorChecklistObj.ChecklistValueType == "2") {
            tempArray = [
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "Done",
                    "DeleteInd": "N",
                    "IsChecked": false
                },
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "Not",
                    "DeleteInd": "N",
                    "IsChecked": false
                },
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "N/A",
                    "DeleteInd": "N",
                    "IsChecked": false
                }
            ];
        } else if ($scope.CoordinatorChecklistObj.ChecklistValueType == "3") {
            tempArray = [
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "Reviewed",
                    "DeleteInd": "N",
                    "IsChecked": false
                },
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "Not",
                    "DeleteInd": "N",
                    "IsChecked": false
                },
                {
                    "CoordinatorChecklistValueId": 0,
                    "CoordinatorChecklistId": 0,
                    "Value": "N/A",
                    "DeleteInd": "N",
                    "IsChecked": false
                }
            ];
        }

        $scope.CoordinatorChecklistArray.push({
            "CoordinatorChecklistId": 0,
            "CheckListName": CheckListName,
            "DeleteInd": "N",
            "SubCheckListDetails": tempArray,
        });
        $scope.CoordinatorChecklistObj.CheckListName = "";
        $scope.CoordinatorChecklistObj.ChecklistValueType = "";
    };

    // Ids are in the patient's coordinator tables only when this popup was opened on a saved coordinator record.
    // Ids from an ASC template are not, and the proc would insert such a row as an already-deleted row.
    function isSavedCoordinatorRow(id) {
        return ($scope.AsctemplateObj.ASCCounselorSurgeryTemplateId || 0) > 0 && (id || 0) > 0;
    }

    $scope.DeleteCoordinatorChecklist = function (item) {
        var index = $scope.CoordinatorChecklistArray.indexOf(item);
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
            if (!isSavedCoordinatorRow(item.CoordinatorChecklistId)) {
                if (index > -1) {
                    $scope.CoordinatorChecklistArray.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }
            $scope.$digest();
        }, function () {

        });
    };

    $scope.SetCoordinatorChecklistFromTemplate = function (template, isCopy) {
        let checklistArray = angular.copy(
            template.CoordinatorChecklistArray || []
        );

        angular.forEach(checklistArray, function (item) {

            item.SubCheckListDetails =
                item.SubCheckListDetails || [];

            if (isCopy) {
                item.CoordinatorChecklistId = 0;
                item.DeleteInd = "N";
            }
        });

        $scope.CoordinatorChecklistArray = checklistArray;
    };

    $scope.DeleteOrderInvestigation = function (Aitem) {
        var index = $scope.Surgeryobj.Investigationslist.indexOf(Aitem);
        if (!isSavedCoordinatorRow(Aitem.AscTemplateInvestigationId)) {
            if (index > -1) {
                $scope.Surgeryobj.Investigationslist.splice(index, 1);
            }
        } else {
            $scope.Surgeryobj.Investigationslist[index].DeleteInd = 'Y';
        }
    };

    $scope.SearchObj = {
        ProcedureName: '',
    }
    $scope.focusGlobalSearch = function (eye) {
        $timeout(function () {
            var inputField = document.getElementById('ODglobalSearchInput');
            if (inputField) {
                inputField.focus();
            }
        }, 0);


    };
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.GetOrganizationProcedure1 = function (text) {
        if ($scope.SearchObj.ProcedureName.length < 2) {
            return false;
        }
        var params = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "CPTCODE": "",
            "SearchText": text || "",
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10000,
            "Status": 1,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        if (params.SearchText == '') {
            params.IsFrequent = 'Y';
        }

        eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                //return resp.data.rows
                //    .filter(function (item) {
                //        return item.IsActive == true && Number(item.OrderTypeId) == 3;
                //    })
                //    .map(function (item) {
                //        return item;
                //    });
                $scope.SurgeryList = resp.data.rows
                    .filter(function (item) {
                        return item.IsActive == true && Number(item.OrderTypeId) == 3;
                    })
                    .map(function (item) {
                        return item;
                    });
            }
        });
    };
    //$scope.GetOrganizationProcedure1();
    $scope.ChangeSurgerySelection = function (mainitem, type) {
        //$scope.AsctemplateObj.SurgeryId = mainitem.ProcedureId || 0;
        //$scope.AsctemplateObj.OrgSurgeryId = mainitem.OrganizationProcedureId || 0

        var i = 0;
        if ($scope.AsctemplateObj.SurgeryArray.length > 0) {
            var filterProcedure = $filter("filter")($scope.AsctemplateObj.SurgeryArray, function (Aitem, index) { return Aitem.OrgDescriptionId == mainitem.OrganizationProcedureId && Aitem.DeleteInd == 'N' },);
            if (filterProcedure.length > 0) {
                $scope.AscTemplates.SearchProcedureObj = '';
                alertify.error("This order has already been added ");
                return false;
                i++;
            }
        }
        mainitem.Isselcted = true;
        if (i == 0) {
            var object = {
                "OrderTypeId": mainitem.OrderTypeId,
                "SurgeryId": mainitem.ProcedureId || 0,
                "DescriptionId": mainitem.ProcedureId || "",
                "Description": mainitem.ProcedureName || "",
                "SurgeryName": mainitem.ProcedureName || "",
                "ProcedureCode": mainitem.ProcedureCode || 0,
                "OrgDescriptionId": mainitem.OrganizationProcedureId || 0,
                "OrgSurgeryId": mainitem.OrganizationProcedureId || 0,

                "CPTCode": mainitem.CPTCode,

                "DeleteInd": "N",


            }
            $scope.AsctemplateObj.SurgeryArray.push(object);
        }
        $scope.AscTemplates.SearchProcedureObj = '';


    }

    $scope.GetOrganizationCPTProcedure = function (val) {
        val = val || "";
        let obj = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "CPTCODE": "",
            "SearchText": val || "",
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "GetAllIndicator": 0,
            "IsFrequent": "N",
            "Status": 0,
            "Type": "SurgeriesProcedures",
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        /* "Type": "Surgery"*/ //commented by durga as BA team asked to bring both surgery and procedures
        if (val == "") {
            obj.IsFrequent = "Y";
        }
        return eHnoteSettingsDataService.GetOrganizationProceduresByType(obj).then(function (response) {
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

                    //let allSurgeryItem = {
                    //    ProcedureCode: "",
                    //    ProcedureName: "All Surgeries",
                    //    CPTCode: "",
                    //    LoincCode: ""
                    //};

                    //response.data.rows.unshift(allSurgeryItem);

                    val = val || "";

                    return response.data.rows.map(function (item) {
                        item.OrganName = item.OrganName || "";
                        return item;
                    });
                }

            }
        });
    };

    $scope.OnSelectAllNurseChecklist = function (val) {
        $scope.PreOpObj.IsAllNurseCheckListChecked = val;
        checkListCheckAllFun(val, $scope.PreOpObj.ChunkedClinicalChecklist);
    };
    $scope.OnSelectAllGeneralChecklist = function (val) {
        $scope.PreOpObj.IsAllGeneralCheckListChecked = val;
        checkListCheckAllFun(val, $scope.PreOpObj.ChunkedGeneralChecklist);
    };

    $scope.OnSelectAllMedicineChecklist = function (val) {
        var MedicalCheckListArray = $filter("filter")($scope.PreOpObj.OrgASCChecklist, { "CheckListCategoryId": 5 }, true) || [];
        $scope.PreOpObj.IsAllMedicineCheckListChecked = val;
        checkListCheckAllFun(val, MedicalCheckListArray);
    };
    $scope.OnSelectAllCheckoutActionList = function (val) {
        $scope.PostOpObj.IsCheckoutActionListChecked = val;
        checkListCheckAllFun(val, $scope.PostOpObj.CheckoutActionList);
    }
    $scope.OnSelectAllMasterAscPatientGoal = function (val) {
        $scope.PostOpObj.IsAllMasterAscPatientGoalChecked = val;
        if (val === 1) {
            $scope.PostOpObj.MasterAscPatientGoal.forEach(item => {
                item.Value = "Yes";
            })
        } else if (val === 2) {
            $scope.PostOpObj.MasterAscPatientGoal.forEach(item => {
                item.Value = "No";
            })
        }
    }
    function checkListCheckAllFun(val, checkListArray) {
        checkListArray = checkListArray.flatMap(item => item);
        let targetValue = null;
        if (val === 1) {
            targetValue = "Yes";
        } else if (val === 2) {
            targetValue = "No";
        } else if (val === 3) {
            targetValue = "N/A";
        }
        checkListArray.forEach(item => {
            const isSpecialCase = ((val === 1 || val === 2) && (item.CheckListCode === 198 || item.CheckListId === 488)) || (val === 3 && (item.CheckListId === 97 || item.CheckListCode === 198 || item.CheckListId === 488));
            if (isSpecialCase) return;
            item.Value = targetValue;
            item.OrganizationCheckListDetails.forEach(litem => {
                litem.IsChecked = (litem.Value === targetValue);
            });
        });
    }

    $scope.AddOccularnotes = function (item) {
        item.ShowNote = true;
    };
    $scope.ClearOccularHistory = function (item, index) {
        var index = $scope.ocularObj.OccularHistoryArray.indexOf(item);
        item.OccularTemplateId = item.OccularTemplateId || null;
        if (item.OccularTemplateId === null) {
            if (index > -1) {
                $scope.ocularObj.OccularHistoryArray.splice(index, 1);
            }
        } else {
            $scope.ocularObj.OccularHistoryArray[index].DeleteInd = 'Y';
        }
        var FreqList = $filter("filter")($scope.FrequentlyOccularHIstory, function (fitem) {
            return fitem.HistoryId == item.HistoryId;
        }, true) || [];
        if (FreqList.length > 0) {
            FreqList[0].Onselect = false;
        }

    };
    $scope.ClearSubOccularHistory = function (item, type) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear Ocular History data?  </h4>", function () {
            if (type == 'R') {
                item.RDurationDate = "";
                item.RSeverityId = "";
                item.RStatusId = 1;
                item.RDuration = "";
                item.RDurationType = "D";
            }
            if (type == 'L') {
                item.LDurationDate = "";
                item.LSeverityId = "";
                item.LStatusId = 1;
                item.LDuration = "";
                item.LDurationType = "D";
            }
            item.OrganId = 1;
            item.Remarks = "";
            item.ReactionId = "";
            item.DurationType = "D";
            item.DurationDate = "";
            item.SnomedCode = "";
            item.DiagnosisObject = "";

            $scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });
    };


    $scope.onRosOccularHistoryBlurChange = function (occularHistory) {
        if (occularHistory.HistoryId === '') {
            occularHistory.HistoryName = '';
            $scope.ocularObj.SelectedOcularHistoryItem = '';
            return false;
        }
        $scope.ocularObj.SelectedOcularHistoryItem = occularHistory;

        var i = 0;
        $scope.ocularObj.SelectedOcularHistoryItem = $scope.ocularObj.SelectedOcularHistoryItem || "";
        if ($scope.ocularObj.SelectedOcularHistoryItem === "") {
            return;
        }

        var object = {};
        if (angular.isObject(occularHistory)) {
            object = {
                "PatientDetailId": 0,
                "OccularTemplateId": 0,
                "HistoryId": $scope.ocularObj.SelectedOcularHistoryItem.HistoryId,
                "HistoryName": $scope.ocularObj.SelectedOcularHistoryItem.HistoryName,
                "IsEdit": true,
                "showOccularHistory": false,
                "ActiveInd": true,
                "DeleteInd": 'N',
                "Remarks": $scope.ocularObj.SelectedOcularHistoryItem.Remarks || "",
                "DiagnosisId": $scope.ocularObj.SelectedOcularHistoryItem.DiagnosisId || "",
                "DiagnosisObject": $scope.ocularObj.SelectedOcularHistoryItem.ICD10CODE || "",
                "ICD10CODE": $scope.ocularObj.SelectedOcularHistoryItem.ICD10CODE || "",
                "SNOMEDCODE": $scope.ocularObj.SelectedOcularHistoryItem.SNOMED || "",
                "SNOMEDId": $scope.ocularObj.SelectedOcularHistoryItem.SNOMEDId || "",
                "ShowNote": false,
                "RDuration": $scope.ocularObj.SelectedOcularHistoryItem.Duration || "",
                "RDurationType": $scope.ocularObj.SelectedOcularHistoryItem.DurationType || "D",
                "RDurationTypeName": $scope.ocularObj.SelectedOcularHistoryItem.DurationTypeName || "Day(s)",
                "RSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "RDurationDate": "",
                "RShowDateFormat": true,
                "RSeverityId": "",
                "RStatusId": 1,
                "RStatusName": 'Active',
                "RSeverityName": "",
                "LDuration": $scope.ocularObj.SelectedOcularHistoryItem.Duration || "",
                "LDurationType": $scope.ocularObj.SelectedOcularHistoryItem.DurationType || "D",
                "LDurationTypeName": $scope.ocularObj.SelectedOcularHistoryItem.DurationTypeName || "Day(s)",
                "LSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "LDurationDate": "",
                "LShowDateFormat": true,
                "LSeverityId": "",
                "LStatusId": 1,
                "LStatusName": 'Active',
                "LSeverityName": "",
                "IsBothEye": false,
                "IsFrequent": $scope.ocularObj.SelectedOcularHistoryItem.IsFrequent || "",
            };
        } else {
            object = {
                "PatientDetailId": 0,
                "OccularTemplateId": 0,
                "HistoryId": 0,
                "HistoryName": $scope.ocularObj.SelectedOcularHistoryItem,
                "IsEdit": true,
                "showOccularHistory": false,
                "ActiveInd": true,
                "DeleteInd": 'N',
                "DiagnosisId": $scope.ocularObj.SelectedOcularHistoryItem.DiagnosisId || "",
                "ICD10CODE": $scope.ocularObj.SelectedOcularHistoryItem.ICD10CODE || "",
                "SNOMEDCODE": $scope.ocularObj.SelectedOcularHistoryItem.SNOMED || "",
                "SNOMEDId": $scope.ocularObj.SelectedOcularHistoryItem.SNOMEDId || "",
                "Remarks": $scope.ocularObj.SelectedOcularHistoryItem.Remarks || "",
                "ShowNote": false,
                "RDuration": "",
                "RDurationType": "D",
                "RDurationTypeName": "Day(s)",
                "RSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "RDurationDate": "",
                "RShowDateFormat": true,
                "RSeverityId": "",
                "RStatusId": 1,
                "RStatusName": 'Active',
                "RSeverityName": "",
                "LDuration": "",
                "LDurationType": "D",
                "LDurationTypeName": "Day(s)",
                "LSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "LDurationDate": "",
                "LShowDateFormat": true,
                "LSeverityId": "",
                "LStatusId": 1,
                "LStatusName": 'Active',
                "LSeverityName": "",
                "IsBothEye": false,
                "IsFrequent": $scope.ocularObj.SelectedOcularHistoryItem.IsFrequent || "",
            };
        }

        var i = 0;
        if ($scope.ocularObj.OccularHistoryArray.length > 0) {
            angular.forEach($scope.ocularObj.OccularHistoryArray, function (item) {
                if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                    alertify.error('You have already entered this Ocular History');
                    $scope.ocularObj.SelectedOcularHistoryItem = "";
                    i++;
                }
            });
        }
        if ($scope.ocularObj.OccularHistoryArray.length !== 0) {
            var List = $filter("filter")($scope.ocularObj.OccularHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                angular.forEach(List, function (item) {
                    if (item.OccularTemplateId === 0) {
                        var indexToRemove = $scope.ocularObj.OccularHistoryArray.indexOf(item);
                        if (indexToRemove !== -1) {
                            $scope.ocularObj.OccularHistoryArray.splice(indexToRemove, 1);
                        }
                    }
                    else {
                        item.DeleteInd = 'Y';
                    }
                });
            }
            $scope.ocularObj.isNKOHSelected = false
            angular.forEach($scope.ocularObj.OccularHistoryArray, function (item, index) {

                item.IsEdit = false;

            });
        }

        object.IsShowoccularHistorySnomedInd = false;
        object.IsShowoccularHistorySnomedInd = false;
        object.IsShowoccularHistorySnomedAddInd = false;
        object.IsShowoccularHistoryICD10CODEAddInd = false;
        if (object.SNOMEDCODE == "") {
            object.IsShowoccularHistorySnomedInd = true;
        }
        if (object.ICD10CODE == "") {
            object.IsShowoccularHistoryICD10CODEInd = true;
        }

        if (i === 0) {
            var FreqList = $filter("filter")($scope.FrequentlyOccularHIstory, function (fitem) {
                return fitem.HistoryId == object.HistoryId;
            }, true) || [];
            if (FreqList.length > 0) {
                FreqList[0].Onselect = true;
            }
            object.GeneralPatientHistoryId = 0;
            $scope.ocularObj.OccularHistoryArray.unshift(object);
            $scope.ocularObj.SelectedOcularHistoryItem = "";
        }

    };
    $scope.AddOccularHistory = false;
    $scope.GetMasterOccularHistory = function (val, type) {
        var params = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            "UserId": doctorinfo.doctorid,
            "NotesTypeId": 1,
            "HistoryId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": val,
            "Type": '',
            "IsFrequent": "N"
        };
        if (params.SearchText == "") {
            params.IsFrequent = "Y";
        }
        return eHnoteSettingsDataService.GetMasterOccularHistory(params).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.OccularHistory !== undefined) {
                    $scope.AddOccularHistory = false;
                    return resp.data.OccularHistory.map(function (item) {
                        return item;
                    });
                } else {
                    $scope.AddOccularHistory = true;
                }
            } else {
                $scope.AddOccularHistory = false;
                if (val != '') {
                    $scope.AddOccularHistory = true;
                }

            }
        });
    };
    $scope.AddNewOccularHistory = function (SelectedOccularHistory) {
        SelectedOccularHistory = SelectedOccularHistory || "";
        if (SelectedOccularHistory === "") {
            alertify.error("Enter OccularHistory");
            return;
        }
        var object = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            "UserId": doctorinfo.doctorid,
            "DeleteInd": false,
            "HistoryName": SelectedOccularHistory,
            "HistoryId": 0
        };
        eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).success(function (response) {
            if (response.Status === 'Success') {
                if (response.count > 0) {
                    $scope.SelectedOccularHistory = "";
                    SelectedOccularHistory = "";
                    $scope.onRosOccularHistoryBlurChange(response.OccularHistory[0]);
                    $scope.ROSHistoriesObj.AddOccularHistory = false;
                    alertify.success("Successfully Added");
                }
            }
            if (response.Status === 'Failure') {
                alertify.error(response.Message);
                $scope.SelectedOccularHistory = "";
                SelectedOccularHistory = "";
            }
        }).error(function (error) { alertify.error("Error Occured"); });
    };
    $scope.onisNKOHSelected = function () {
        if ($scope.ocularObj.OccularHistoryArray.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected OccularHistory?", function () {
                if ($scope.ocularObj.isNKOHSelected) {
                    var newArray = [];
                    angular.forEach($scope.ocularObj.OccularHistoryArray, function (item) {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = 'Y';
                            newArray.push(item);
                        }
                    });
                    $scope.ocularObj.OccularHistoryArray = angular.copy(newArray);
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "OccularHistory" }, true);
                    if (filteredArray && filteredArray.length > 0) {
                        var object = {
                            "PatientDetailId": 0,
                            "HistoryId": filteredArray[0].Id || null,
                            "HistoryName": filteredArray[0].Name || '',
                            "IsEdit": false,
                            "showOccularHistory": false,
                            "ActiveInd": true,
                            "DeleteInd": 'N',
                            "Remarks": "",
                            "DiagnosisId": "",
                            "DiagnosisObject": "",
                            "ICD10CODE": "",
                            "SNOMEDCODE": "",
                            "SNOMEDId": "",
                            "ShowNote": false,
                            "RDuration": "",
                            "RDurationType": "D",
                            "RDurationTypeName": "Day(s)",
                            "RSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "RDurationDate": "",
                            "RShowDateFormat": false,
                            "RSeverityId": "",
                            "RStatusId": "",
                            "RStatusName": "",
                            "RSeverityName": "",
                            "LDuration": "",
                            "LDurationType": "D",
                            "LDurationTypeName": "Day(s)",
                            "LSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "LDurationDate": "",
                            "LShowDateFormat": false,
                            "LSeverityId": "",
                            "LStatusId": "",
                            "LStatusName": "",
                            "LSeverityName": "",
                            "IsBothEye": false,
                            "IsNKOHSelected": $scope.ocularObj.isNKOHSelected || false,
                        };
                        $scope.ocularObj.OccularHistoryArray.push(object);
                        $scope.$digest();
                        angular.forEach($scope.FrequentlyOccularHIstory, function (item) {
                            item.Onselect = false;
                        });
                    }
                }
            },
                function () {
                    $scope.ocularObj.isNKOHSelected = false;
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });

        }
        else {
            if ($scope.ocularObj.isNKOHSelected) {
                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "OccularHistory" }, true);
                if (filteredArray.length > 0) {
                    var object = {
                        "PatientDetailId": 0,
                        "HistoryId": filteredArray[0].Id || null,
                        "HistoryName": filteredArray[0].Name || '',
                        "IsEdit": false,
                        "showOccularHistory": false,
                        "ActiveInd": true,
                        "DeleteInd": 'N',
                        "Remarks": "",
                        "DiagnosisId": "",
                        "DiagnosisObject": "",
                        "ICD10CODE": "",
                        "SNOMEDCODE": "",
                        "SNOMEDId": "",
                        "ShowNote": false,
                        "RDuration": "",
                        "RDurationType": "D",
                        "RDurationTypeName": "Day(s)",
                        "RSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                        "RDurationDate": "",
                        "RShowDateFormat": false,
                        "RSeverityId": "",
                        "RStatusId": "",
                        "RStatusName": "",
                        "RSeverityName": "",
                        "LDuration": "",
                        "LDurationType": "D",
                        "LDurationTypeName": "Day(s)",
                        "LSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                        "LDurationDate": "",
                        "LShowDateFormat": false,
                        "LSeverityId": "",
                        "LStatusId": "",
                        "LStatusName": "",
                        "LSeverityName": "",
                        "IsBothEye": false,
                        "IsNKOHSelected": $scope.ocularObj.isNKOHSelected || false,
                    };
                    $scope.ocularObj.OccularHistoryArray.push(object);
                    angular.forEach($scope.FrequentlyOccularHIstory, function (item) {
                        item.Onselect = false;
                    });
                }
            }
        }

    }
    $scope.ChangeOcularHistoryFrequentStatus = function (item, ind) {
        if (item.IsFrequent == "N") {
            var Frequentval = "Y"
        } else {
            var Frequentval = "N"
        }
        if (item.IsFrequent == "Y") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to Remove this From the frequently added list", function () {
                var object = {
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": $scope.HospitalId,

                    "UserId": doctorinfo.doctorid,
                    "DeleteInd": false,

                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": "N"
                };
                eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        GetAllFrequentlyAddedData();


                        item.IsFrequent = Frequentval



                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);

                    }
                });
            }, function () {
                r = "You pressed Cancel!";
            });
        }


        if (item.IsFrequent == "N") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to add this to the frequently added list", function () {

                var object = {
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": $scope.HospitalId,
                    "UserId": doctorinfo.doctorid,
                    "DeleteInd": false,

                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": "Y"
                };
                eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        GetAllFrequentlyAddedData();

                        item.IsFrequent = Frequentval

                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);

                    }
                });
            }, function () {
                r = "You pressed Cancel!";

            });
        }

    }
    $scope.OccularHistorySnomedICD10Code = function (item, type) {
        if (type == 'SNOMEDCODE') {
            item.IsShowoccularHistorySnomedAddInd = !item.IsShowoccularHistorySnomedAddInd;
        }
        if (type == 'ICD10CODE') {
            item.IsShowoccularHistoryICD10CODEAddInd = !item.IsShowoccularHistoryICD10CODEAddInd;
        }
    }

    function getMasterCunsultationData() {
        let doctroId = doctorinfo.doctorid;
        eHnotePatientDataService.GetUserConsultationMasterTemplateDtls(doctroId).then(function (resp) {
            if (resp.data) {
                if (resp.data.ROS.length > 0) {
                    $scope.ROSIsNormalArray = resp.data.ROS || [];
                }
            }
        })
    }
    function GetAllFrequentlyAddedData() {
        var allrgireq = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 30,
            "PageNumber": 1,
            "UserId": doctorinfo.doctorid,
            "IsFrequent": "Y"

        };
        eHnoteDiagnosisDataServices.GetAllFrequentlyAddedData(allrgireq).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.FrequentlyOccularHIstory = resp.data.OccularHIstory || [];

                angular.forEach($scope.FrequentlyOccularHIstory, function (item) {
                    item.Onselect = false;
                });
                if ($scope.ocularObj.OccularHistoryArray.length > 0) {
                    angular.forEach($scope.ocularObj.OccularHistoryArray, function (item) {
                        if (item.DeleteInd == 'N') {
                            var FreqList = $filter("filter")($scope.FrequentlyOccularHIstory, function (fitem) {
                                return fitem.HistoryId == item.HistoryId;
                            }, true) || [];
                            if (FreqList.length > 0) {
                                FreqList[0].Onselect = true;
                            }
                        }
                    });
                }
            }
        })
    }
    $scope.GetDiagnosisList = function (val) {
        var object = {
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



    $scope.onSelectDiagnosis = function (mainobject) {
        console.log(mainobject);
        var i = 0;

        $scope.OperativeNotesObj.Diagnosis = $scope.OperativeNotesObj.Diagnosis || [];
        if ($scope.OperativeNotesObj.Diagnosis.length > 0) {
            angular.forEach($scope.OperativeNotesObj.Diagnosis, function (item) {

                if (item.DiagnosisId === mainobject.DiagnosisId && item.DeleteInd == 'N') {
                    alertify.error('You already entered this Diagnosis');
                    i++;
                    return false;
                }

            });
            $scope.OperativeNotesObj.DiagnosisObject = "";
        }
        if (i === 0) {

            var obj = {
                "ConsultationDiagnosisId": 0,
                "TemplateDiagnosisId": 0,
                "AssessmentPlanId": 0,
                "AssessmentPlan": {
                    "AssessmentPlanId": 0,
                    "PlanofDiscussionsNotes": "",
                    "PatientInstructions": "",
                    "AssessmentsNotes": "",
                    "DoctorNotes": "",
                    "ActionsTaken": ""
                },
                "DiagnosisId": mainobject.DiagnosisId,
                "DiagnosisName": mainobject.DiagnosisName,
                "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                "ICD10CODE": mainobject.ICD10CODE,
                "ICDCode": mainobject.ICD10CODE,
                "ICD10DIAGNAME": mainobject.DiagnosisName,
                "ICD10DIAGDESCRIPTION": mainobject.FullName,
                "DiagnosisDescription": mainobject.FullName,
                "CodeSystem": "ICD",
                /*"StatusList": [],*/
                "DeleteInd": "N",
                "IsLocation2Added": false,

                "LocationId1": 0,
                "Location1": '',
                "SeverityId1": 0,
                "Verificationstatusid1": null,
                "DiagnosisStatus1": "",
                "DiagnosisStatusId1": 0,
                "EndDate1": null,
                "StartDate1": null,

                "LocationId2": 0,
                "Location2": '',
                "SeverityId2": 0,
                "Verificationstatusid2": null,
                "DiagnosisStatus2": "",
                "DiagnosisStatusId2": 0,
                "EndDate2": null,
                "StartDate2": null,
                "TypeId": 8,
                "AscDiagnosisTypeId": 2,
            }

            if (mainobject.OrganId == 1) {
                obj.LocationId1 = 1;
                obj.Location1 = 'OD';
                obj.DiagnosisStatusId1 = 2;
                obj.DiagnosisStatus1 = "Active";
            } else if (mainobject.OrganId == 2) {
                obj.LocationId1 = 2;
                obj.Location1 = 'OS';
                obj.DiagnosisStatusId1 = 2;
                obj.DiagnosisStatus1 = "Active";
            } else if (mainobject.OrganId == 3) {
                obj.LocationId1 = 1;
                obj.LocationId2 = 2;
                obj.Location1 = 'OD';
                obj.Location2 = 'OS';
                obj.DiagnosisStatusId1 = 2;
                obj.DiagnosisStatus1 = "Active";
                obj.DiagnosisStatusId2 = 2;
                obj.DiagnosisStatus2 = "Active";
                obj.IsLocation2Added = true;
            } else if (mainobject.OrganId == 0) {
                obj.LocationId1 = 0;
                obj.Location1 = '';
            } else { }

            $scope.OperativeNotesObj.Diagnosis.push(obj);
            $scope.OperativeNotesObj.DiagnosisObject = "";
        }
    }

    $scope.ClearDiagnosis = function (item, index) {
        item.TemplateDiagnosisId = item.TemplateDiagnosisId || 0;
        if (item.TemplateDiagnosisId != 0) {
            item.DeleteInd = "Y";
        } else {
            $scope.OperativeNotesObj.Diagnosis.splice(index, 1);
        }
    };
    $scope.SelectLocation2 = function (item) {
        if (item.LocationId1 == item.LocationId2) {
            item.LocationId2 = 0;
            alertify.error('You already entered this Location');
            return false;
        }
    };
    $scope.getMasterFieldDosageData = function () {
        eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {
            $scope.DoseArray = resp.data.doseArray || [];
            $scope.DoseOtherArray = resp.data.doseOtherArray || [];
            $scope.FrequencyArray = resp.data.frequencyArray || [];
            $scope.RefillsArray = resp.data.refillsArray || [];
            $scope.DurationArray = resp.data.durationArray || [];
            $scope.ActionArray = resp.data.actionArray || [];
            $scope.RouteArray = resp.data.routeArray || [];
            $scope.DoseUnitArray = resp.data.doseUnitArray || [];
            $scope.QuantityUnitArray = resp.data.quantityUnitArray || [];


        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };
    $scope.getMasterFieldDosageData();
    $scope.adnewsigobj = {
        "IsNewSig": false,
        "MedicineId": 0,
    }
    $scope.SigSearch = {
        "Shows": false
    }
    $scope.Surgeryobj = {
        'MedicineObject': '',
        'CurrentMedicationobj': '',
        'SubType': 'PreSurgery',
        'PreMedicationslist': [],
        'CurrentMedicationslist': [],
        'Investigationslist': [],
        'EnterPreSurgeryTemplateName': "",
        'SelectedPreSurgeryTemplateName': "",
        "PrescriptionDetails": ""
    }
    function getEmptyPrescriptionObj() {

        var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "ProviderId": $scope.UserId,
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
            "IsNKMSelected": false,
            "LastModifiedBy": $scope.UserId,
            "LastModifiedDate": TodayDate,
            "CompleteAction": "Created",
            "PrescriptionSentMethod": "",
            "PrescriptionStatus": "",
            "DeleteInd": "N",
            "RcopiaDeleted": "N",
            "PrescriptionDetails": []
        };
        return obj;
    };
    $scope.Selectedmedic = function (item, val) {
        item.SelectedMedicationHistory = val;
    }

    $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();
    $scope.pushPrescriptionMedicationDetails1 = function (obj, type, type1) {
        $scope.SigSearch.Shows = false;
        obj.SigfieldsShows = false;
        $scope.adnewsigobj.IsNewSig = false;
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
            newmedicationobj.Type = type1;
            newmedicationobj.IsMedicationStopped = false;
            newmedicationobj.SigFormationFields = false;
            newmedicationobj.isEditFocused = false;
            newmedicationobj.isAddFocused = false;
            newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';


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

            console.log(mparams);


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
                            if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd == 'N') {
                                medi++;
                            }
                        });
                    }


                    if (medi > 0) {
                        alertify.error('You have already entered this medicine');
                        $scope.medicineGetObj.MedicineObject = "";
                    } else {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                        $scope.medicineGetObj.MedicineObject = "";
                    }

                }
            });


        }
        else {
            newmedicationobj.MedicationId = obj.MedicineId;
            newmedicationobj.DrugBrandName = obj.MedicineName;
            newmedicationobj.MedicationName = obj.MedicineName;
            newmedicationobj.DrugSchedule = obj.ScheduleType;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.DrugGenericName = obj.GenericName;

            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
            newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
            newmedicationobj.DrugGenericId = obj.GenericID || "";
            newmedicationobj.Type = type1;
            newmedicationobj.IsMedicationStopped = false;
            newmedicationobj.RxNormList = obj.RxNormList || [];
            newmedicationobj.SigFormationFields = false;
            newmedicationobj.isEditFocused = false;
            newmedicationobj.isAddFocused = false;
            newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';

            if (obj.RxNormList.length > 0) {
                let filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                if (filteredRxNorm.length > 0) {
                    newmedicationobj.DrugRxNormId = filteredRxNorm[0].RXNormId;
                }
            }
            var medi = 0;
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd == 'N') {
                        medi++;
                    }
                });
            }


            if (medi > 0) {
                alertify.error('You have already entered this medicine');
                $scope.medicineGetObj.MedicineObject = "";
            }
            else {
                $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                $scope.medicineGetObj.MedicineObject = "";
            }
        }

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            $scope.PrescriptionMainAddObj.IsNKMSelected = false;
        }
    };
    $scope.GetOrganizationMedicationlist = function (val) {

        var req = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 10,
            "SearchText": val || '',
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        if (req.SearchKey == "") {
            req.IsFrequent = "Y";
        }

        return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
            if (resp.data.count !== 0) {

                if (resp.data.MedicineList !== undefined) {
                    return resp.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.PrescriptionChange = function (obj) {
        obj = obj || "";
    }
    $scope.GetDrugDataListFromRcopia = function (val) {
        var searchvalue = val || "";
        if (searchvalue != "") {
            var req = {
                "VendorName": "Appolo Pharmacy",
                "VendorPassword": "abc123",
                "searchText": searchvalue,
                "Maximum": 20,
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "SearchType": "search_drug_detail",
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                resp.data.DrugDetailsList = resp.data.DrugDetailsList || [];
                if (resp.data.DrugDetailsList.length > 0) {
                    return resp.data.DrugDetailsList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }
    $scope.RemovePrescriptionDetailObj = function (index, item) {
        if (item.MedicationTemplateId != 0) {
            item.DeleteInd = 'Y';
            item.RcopiaMedicationId = item.RcopiaMedicationId || "";
            $scope.PrescriptionMainAddObjFOrDelete = getEmptyPrescriptionObj();
            $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId = item.PatientPrescriptionId;

            var newmedicationobj = getNewPrescriptionDetailObj();
            newmedicationobj.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
            newmedicationobj.PatientPrescriptionId = item.PatientPrescriptionId;
            newmedicationobj.MedicationId = item.MedicationId;
            newmedicationobj.RcopiaDrugId = item.RcopiaDrugId || 0;
            newmedicationobj.RcopiaMedicationId = item.RcopiaMedicationId || "";
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
            newmedicationobj.Quantity = item.Quantity || null;
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
            newmedicationobj.SigFormationFields = false;
        } else {
            $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
        }

    };
    $scope.ClearMedicineItem = function (mainitem) {
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
        mainitem.Quantity = null;
        mainitem.QuantityUnitId = "";
        mainitem.RefillId = "";
        mainitem.Refills = "";
        mainitem.PatientInstructions = "";
        mainitem.SigObj = "";
        mainitem.Sig = "";
        mainitem.MedicineObj = ""
    }
    $scope.ONSigDetailsMedOrders = function (item, mainitem) {
        console.log(item);
        console.log(mainitem);
        $scope.adnewsigobj.IsNewSig = false;
        mainitem.isAddFocused = false;
        mainitem.isEditFocused = false;
        mainitem.SigfieldsShows = true;
        //mainitem.SigFields = true;
        mainitem.ActionId = item.ActionId || null;
        mainitem.Action = item.Action || '';
        mainitem.Dose = item.Dose || '';
        mainitem.DoseUnit = item.DoseUnit || '';
        mainitem.Route = item.Route || '';
        mainitem.Frequency = item.Frequency || '';
        mainitem.DoseOther = item.DoseOther || '';
        mainitem.DaysSupply = item.DaysSupply || '';
        mainitem.DoseId = item.DoseId || null;
        mainitem.DoseUnitId = item.DoseUnitId || null;
        mainitem.RouteId = item.RouteId || null;
        mainitem.FrequencyId = item.FrequencyId || null;
        mainitem.DoseOtherId = item.DoseOtherId || null;
        mainitem.DaysSupplyId = item.DaysSupplyId || null;
        mainitem.Sig = item.Sig;
        mainitem.SigId = item.OrganizationSigTemplateId;
        mainitem.MedicineObj = ''



        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
            }
        }
    };
    $scope.changeSigForMedicine = function (item) {
        item.Sig = item.SigObj || "";
        item.SigId = 0;
    };
    $scope.EditSigFields = function (item) {
        item.SigFields = !item.SigFields;
        $scope.adnewsigobj.IsNewSig = false;
        item.isEditFocused = true;
        item.isAddFocused = false;

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
            "Quantity": null,
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "DeleteInd": "N",
            "IsFrequent": "N",
            "MedicineId": 0,
        };

        return obj;
    }
    $scope.AddNewMedicineIdchange = function (item) {

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                item.SigFormationFields = false;
                item.isAddFocused = false;

            });
        }

        item.MedicineObj = '';
        item.SigObj = '';
        $scope.adnewsigobj.MedicineId = item.MedicationId || 0;
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
        item.SigFields = false;
        $scope.adnewsigobj.IsNewSig = true;
        item.SigFormationFields = !item.SigFormationFields;
        item.isEditFocused = false;
        item.isAddFocused = true;

        item.ActionId = 0;
        item.Action = '';
        item.Dose = '';
        item.DoseUnit = '';
        item.Route = '';
        item.Frequency = '';
        item.DoseOther = '';
        item.DaysSupply = '';
        item.DoseId = 0;
        item.DoseUnitId = 0;
        item.RouteId = 0;
        item.FrequencyId = 0;
        item.DoseOtherId = 0;
        item.DaysSupplyId = 0;

    }
    $scope.getParticularSigMedicationitems = function (text, item) {
        text = text || '';
        if (item.IsAllSig) {
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
        } else {
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
        }
    };

    $scope.addSIgNameDynamicallyAdded = function () {

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                var dosesupplytest = "";
                if (initem.DaysSupply !== '') {
                    dosesupplytest = " for " + initem.DaysSupplyDescription || "";
                }

                if (initem.DaysSupply !== '') {
                    var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {
                        initem.DaysSupply = filteredArray[0].Code;
                        dosesupplytest = " for " + filteredArray[0].Description;
                    }
                }

                initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;


            });
        }
    }
    $scope.changePrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.ActionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RouteArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.FrequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {

            mainobj.DaysSupply = filteredArray[0].Code;
            mainobj.DaysSupplyDescription = filteredArray[0].Description;

            var DateCode = filteredArray[0].Code;
            var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
            mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
        };

        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.QuantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };

    $scope.changePrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        }
        else {
            mainobj.Refills = '';
        }
    };
    $scope.clearOrganizationSiginput = function () {
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
    };
    $scope.showAddSigFields = false;
    $scope.showAddSigButton = true;
    $scope.toggleAddSigFields = function () {
        $scope.showAddSigFields = !$scope.showAddSigFields;

        $scope.showAddSigButton = !$scope.showAddSigButton;
    };
    $scope.SaveOrganizationSig = function (item) {
        console.log($scope.addNewOrganizationSigObj);
        $scope.addNewOrganizationSigObj.MedicineId = item?.MedicationId || 0;
        if ($scope.addNewOrganizationSigObj.Sig == '') {
            alertify.error("Please Enter Sig");
            return false;
        }
        if ($scope.addNewOrganizationSigObj.IsFrequent == true) {
            $scope.addNewOrganizationSigObj.IsFrequent = "Y";
        }

        eHnotePatientDataService.AddUpdateOrganizationMedicationSig($scope.addNewOrganizationSigObj, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {
            alertify.success("Sig Added  Successfully");
            $scope.savedSigs.push($scope.addNewOrganizationSigObj);
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
            $scope.adnewsigobj.IsNewSig = false;
            $scope.toggleAddSigFields();
            $scope.getOrganizationMedicationSig();

        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };

    $scope.onselectInvestigation = function (InvObject) {

        if (InvObject.ProcedureId === '') {
            InvObject.InvestigationName = '';
            return false;
        }
        $scope.Surgeryobj.InvestigationObj = InvObject || "";
        if ($scope.Surgeryobj.InvestigationObj === "") {
            return;
        }
        var object = {
            "PatientInvestigationId": 0,
            "OrderTemplateId": 0,
            "PatientOrderId": 0,
            "ProcedureCode": $scope.Surgeryobj.InvestigationObj.ProcedureCode || "",
            "OrgInvestigationId": $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId,
            "InvestigationId": $scope.Surgeryobj.InvestigationObj.ProcedureId,
            "InvestigationName": $scope.Surgeryobj.InvestigationObj.ProcedureName,
            "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "OrganId": "",
            "InvestigationNotes": $scope.Surgeryobj.InvestigationObj.Notes || "",
            "DeleteInd": "N",
            "IsEdit": false,
            "IsNoteEdit": false,
            "ShowDateFormat": false,
            "DurationDate": null,
            "Duration": null,
            "DurationType": "",
            "Remarks": "",
            "LocationId": null,
            "InvestigationNotes": null
        }

        var i = 0;
        $scope.Surgeryobj.Investigationslist = $scope.Surgeryobj.Investigationslist || [];
        if ($scope.Surgeryobj.Investigationslist.length > 0) {
            angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
                if (item.InvestigationId === $scope.Surgeryobj.InvestigationObj.ProcedureId && item.DeleteInd === 'N') {
                    i++;
                }
            });
        }
        if (i > 0) {
            alertify.error('You already entered this Investigation');
            $scope.Surgeryobj.InvestigationObj = "";
        }
        if (i === 0) {
            $scope.Surgeryobj.Investigationslist.push(object);
            $scope.Surgeryobj.InvestigationObj = "";
        }
        return false;

    };

    $scope.DelectInvestigation = function (Aitem) {
        var index = $scope.Surgeryobj.Investigationslist.indexOf(Aitem);
        if (Aitem.OrderTemplateId === 0) {
            if (index > -1) {
                $scope.Surgeryobj.Investigationslist.splice(index, 1);
            }
        } else {
            $scope.Surgeryobj.Investigationslist[index].DeleteInd = 'Y';
        }
    };
    $scope.ChangeDuration = function (item) {
        item.DurationDate = null;
    };
    $scope.ChangeItem = function (item) {
        item.ShowDateFormat = !item.ShowDateFormat;
    };
    $scope.GetLocationName = function () {
        return [{
            "LocationId": 1,
            "LocationName": "OD"
        },
        {
            "LocationId": 2,
            "LocationName": "OS"
        },
        {
            "LocationId": 3,
            "LocationName": "OU"
        },
        {
            "LocationId": 4,
            "LocationName": "GENERAL"
        }
        ];
    };
    $scope.GetLocationNameList = angular.copy($scope.GetLocationName());

    $scope.LabInvestNotes = function (item) {
        item.IsNoteEdit = !item.IsNoteEdit;
    }
    $scope.LabInvestNotes = function (item) {
        item.IsNoteEdit = !item.IsNoteEdit;
    }
    $scope.GetOrganizationTypeOfService = function (text) {
        var Type = 'Investigation';
        var params = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": text || "", // searchtext
            "TypeOfServiceId": 0,
            "Type": Type || 0,
            "IsFrequent": 'N',
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };

        if (params.SearchText == "") {
            params.IsFrequent = "Y";
        }

        return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };
    $scope.savedSigs = [];
    $scope.clearOrganizationSiginput = function () {
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
    };

    $scope.addSIgNameDynamically = function () {
        var dosesupplytest = "";
        if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
            dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupplyDescription;
        }
        $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
    }

    $scope.changePopupPrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.ActionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RouteArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.FrequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {

            mainobj.DaysSupply = filteredArray[0].Code;
            mainobj.DaysSupplyDescription = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.QuantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };

    $scope.changePopupPrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };

    $scope.changePreopAction = function (Id, type) {
        if (type == 2) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Action = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
            };


            $scope.updateOrderDescription(2);
        } else if (type == 1) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Action = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(1);
        }


        else if (type == 4) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Action = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
            };


            $scope.updateOrderDescription(4);
        } else if (type == 3) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Action = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
            };


            $scope.updateOrderDescription(3);
        }
        else if (type == 8) {

            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Action = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(8);
        } else if (type == 5) {
            var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Action = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(5);
        }
    };

    $scope.changePreopDose = function (Id, type) {
        if (type == 2) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Dose = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(2);
        } else if (type == 1) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Dose = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(1);
        }


        else if (type == 4) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Dose = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(4);
        } else if (type == 3) {

            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Dose = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(3);
        }
        else if (type == 8) {

            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Dose = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(8);
        } else if (type == 5) {
            var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Dose = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(5);
        }
    };

    $scope.changePreopDoseUnit = function (Id, type) {
        if (type == 2) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.DoseUnit = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(2);
        } else if (type == 1) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.DoseUnit = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(1);
        }

        else if (type == 4) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.DoseUnit = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(4);
        } else if (type == 3) {

            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.DoseUnit = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(3);
        } else if (type == 8) {

            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.DoseUnit = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(8);
        } else if (type == 5) {
            var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.DoseUnit = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(5);
        }

    };

    $scope.changePreopRoute = function (Id, type) {
        if (type == 2) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Route = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(2);
        } else if (type == 1) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Route = filteredArray[0].Code;
                $scope.TempDilationMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(1);
        }


        else if (type == 4) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Route = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(4);
        } else if (type == 3) {

            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Route = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(3);
        }
        else if (type == 8) {

            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Route = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(8);
        } else if (type == 5) {
            var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Route = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(5);
        }
    };

    $scope.changePreopFrequency = function (Id, type) {
        if (type == 2) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Frequency = filteredArray[0].Description;
                $scope.TempDilationMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(2);
        } else if (type == 1) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempDilationMedicationObj.Frequency = filteredArray[0].Description;
                $scope.TempDilationMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
            };

            $scope.updateOrderDescription(1);
        }


        else if (type == 4) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Frequency = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(4);
        } else if (type == 3) {

            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.IntraOpMedicationObj.Frequency = filteredArray[0].Code;
                $scope.IntraOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(3);
        } else if (type == 8) {

            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Frequency = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(8);
        } else if (type == 5) {
            var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.TempPostOpMedicationObj.Frequency = filteredArray[0].Code;
                $scope.TempPostOpMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
            };
            $scope.updateOrderDescription(5);
        }
    };



    $scope.updateOrderDescription = function (id) {

        if (id == 2) {
            $scope.TempDilationMedicationObj.OrderDescription = $scope.TempDilationMedicationObj.Action + " " + $scope.TempDilationMedicationObj.MedicationName + " " + $scope.TempDilationMedicationObj.Dose + " " + $scope.TempDilationMedicationObj.DoseUnit + " " + $scope.TempDilationMedicationObj.Route + " " + $scope.TempDilationMedicationObj.Frequency + " " + ($scope.TempDilationMedicationObj.maxDose ? " for " + $scope.TempDilationMedicationObj.maxDose + " times." : "");

        } else if (id == 1) {
            $scope.TempDilationMedicationObj.OrderDescription = $scope.TempDilationMedicationObj.Action + " " + $scope.TempDilationMedicationObj.MedicationName + " " + $scope.TempDilationMedicationObj.Dose + " " + $scope.TempDilationMedicationObj.DoseUnit + " " + $scope.TempDilationMedicationObj.Route + " " + $scope.TempDilationMedicationObj.Frequency + " " + ($scope.TempDilationMedicationObj.maxDose ? " for " + $scope.TempDilationMedicationObj.maxDose + " times." : "");

        }


        else if (id == 4) {
            $scope.IntraOpMedicationObj.OrderDescription = $scope.IntraOpMedicationObj.Action + " " + $scope.IntraOpMedicationObj.MedicationName + " " + $scope.IntraOpMedicationObj.Dose + " " + $scope.IntraOpMedicationObj.DoseUnit + " " + $scope.IntraOpMedicationObj.Route + " " + $scope.IntraOpMedicationObj.Frequency + ($scope.IntraOpMedicationObj.maxDose ? " for " + $scope.IntraOpMedicationObj.maxDose + " times." : "");

        } else if (id == 3) {
            $scope.IntraOpMedicationObj.OrderDescription = $scope.IntraOpMedicationObj.Action + " " + $scope.IntraOpMedicationObj.MedicationName + " " + $scope.IntraOpMedicationObj.Dose + " " + $scope.IntraOpMedicationObj.DoseUnit + " " + $scope.IntraOpMedicationObj.Route + " " + $scope.IntraOpMedicationObj.Frequency + ($scope.IntraOpMedicationObj.maxDose ? " for " + $scope.IntraOpMedicationObj.maxDose + " times." : "");

        } else if (id == 5) {
            $scope.TempPostOpMedicationObj.OrderDescription = $scope.TempPostOpMedicationObj.Action + " " + $scope.TempPostOpMedicationObj.MedicationName + " " + $scope.TempPostOpMedicationObj.Dose + " " + $scope.TempPostOpMedicationObj.DoseUnit + " " + $scope.TempPostOpMedicationObj.Route + " " + $scope.TempPostOpMedicationObj.Frequency + ($scope.TempPostOpMedicationObj.maxDose ? " for " + $scope.TempPostOpMedicationObj.maxDose + " times." : "");
        } else if (id == 8) {
            $scope.TempPostOpMedicationObj.OrderDescription = $scope.TempPostOpMedicationObj.Action + " " + $scope.TempPostOpMedicationObj.MedicationName + " " + $scope.TempPostOpMedicationObj.Dose + " " + $scope.TempPostOpMedicationObj.DoseUnit + " " + $scope.TempPostOpMedicationObj.Route + " " + $scope.TempPostOpMedicationObj.Frequency + ($scope.TempPostOpMedicationObj.maxDose ? " for " + $scope.TempPostOpMedicationObj.maxDose + " times." : "");
        }

    }



    $scope.ClearMedicationData = function (Id) {

        if (Id == 3) {
            $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
        } else if (Id == 4) {
            $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
        }
        else if (Id == 5) {
            $scope.TempPostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
        } else if (Id == 8) {
            $scope.TempPostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
        } else if (Id == 2) {
            $scope.TempDilationMedicationObj = angular.copy($scope.GetPreOpMedicationObj());
        } else {
            $scope.TempDilationMedicationObj = angular.copy($scope.GetPreOpMedicationObj());
        }

    }


    $scope.maxDoseList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.SelectPreopMedicationOrders = function (item, type) {
        $scope.PreOpObj.MedTypeId = $scope.PreOpObj.MedTypeId || 0;
        if ($scope.PreOpObj.MedTypeId == 0) {
            alertify.error('Please Select Medication Type');
            return false;
        }
        //    "MedTypeId": 2
        if ($scope.PreOpObj.MedTypeId == 2) {
            let MedTypeName = 'Dilation Medication';
            let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
                return poitem.MedTypeId === $scope.PreOpObj.MedTypeId && poitem.DeleteInd == 'N';
            }) || [];
            let i = 0;
            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.DilationMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.TempDilationMedicationObj.MedicineObject = "";
                $scope.TempDilationMedicationObj.MedicationName = '';
                return false;
            }
            $scope.TempDilationMedicationObj.MedicineObject = item;
            $scope.TempDilationMedicationObj.MedicationName = item.MedicineName;


            if ($scope.TempDilationMedicationObj.SurgeryTemplateMedicationId != 0) {
                item.SurgeryTemplateMedicationId = $scope.TempDilationMedicationObj.SurgeryTemplateMedicationId;
            }


            $scope.updateOrderDescription(2);

        }

        else {

            let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (poitem) {
                return poitem.DeleteInd == 'N' && poitem.MedTypeId == $scope.PreOpObj.MedTypeId;
            }) || [];
            let i = 0;
            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.PreOpMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.TempDilationMedicationObj.MedicineObject = "";
                $scope.TempDilationMedicationObj.MedicationName = "";
                return false;
            }

            $scope.TempDilationMedicationObj.MedicineObject = item;
            $scope.TempDilationMedicationObj.MedicationName = item.MedicineName;


            if ($scope.TempDilationMedicationObj.SurgeryTemplateMedicationId != 0) {
                item.SurgeryTemplateMedicationId = $scope.TempDilationMedicationObj.SurgeryTemplateMedicationId;
            }


            $scope.updateOrderDescription(1);

        }
    }



    $scope.AddDilationMedication = function (Id) {


        if (Id == 2) {
            let item = $scope.TempDilationMedicationObj.MedicineObject;
            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }


            let obj = {
                "SurgeryTemplateMedicationId": item.SurgeryTemplateMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.TempDilationMedicationObj.MedicationName,
                "Action": $scope.TempDilationMedicationObj.Action,
                "Dose": $scope.TempDilationMedicationObj.Dose,
                "DoseUnit": $scope.TempDilationMedicationObj.DoseUnit,
                "Route": $scope.TempDilationMedicationObj.Route,
                "Frequency": $scope.TempDilationMedicationObj.Frequency,
                "ActionId": $scope.TempDilationMedicationObj.ActionId,
                "DoseId": $scope.TempDilationMedicationObj.DoseId,
                "DoseUnitId": $scope.TempDilationMedicationObj.DoseUnitId,
                "RouteId": $scope.TempDilationMedicationObj.RouteId,
                "FrequencyId": $scope.TempDilationMedicationObj.FrequencyId,
                "OrderDescription": $scope.TempDilationMedicationObj.OrderDescription,
                "MedicationNotes": $scope.TempDilationMedicationObj.MedicationNotes,
                "maxDose": $scope.TempDilationMedicationObj.maxDose,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": false,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": $scope.TempDilationMedicationObj.DropTimings || [],
                "TypeId": 2,
                "DeleteInd": "N",

            };
            let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N';
            }) || [];


            if (templist.length > 0 && templist[0].DilationMedications.length > $scope.TempDilationMedicationObj.EditIndex && $scope.TempDilationMedicationObj.EditIndex >= 0) {
                templist[0].DilationMedications[$scope.TempDilationMedicationObj.EditIndex] = obj;
                alertify.success('Updated successfully');
            }

            else {

                if (templist.length > 0) {
                    templist[0].DilationMedications.push(obj);
                } else {

                    let newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "ReviewedBy": null,
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "UserType": "Nurse",
                        "ScreenType": "PreOp",
                        "ScreenTypeId": 4,
                        "MedTypeId": 2,
                        "MedTypeName": 'Dilation Medication',
                        "DilationMedications": [obj],
                        "PreOpMedications": [],
                        "GeneralOrders": [],

                    };
                    $scope.PreOpObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }

            $scope.TempDilationMedicationObj = angular.copy($scope.GetPreOpMedicationObj());
        } else {
            let item = $scope.TempDilationMedicationObj.MedicineObject;
            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }


            let obj = {
                "SurgeryTemplateMedicationId": item.SurgeryTemplateMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.TempDilationMedicationObj.MedicationName,
                "Action": $scope.TempDilationMedicationObj.Action,
                "Dose": $scope.TempDilationMedicationObj.Dose,
                "DoseUnit": $scope.TempDilationMedicationObj.DoseUnit,
                "Route": $scope.TempDilationMedicationObj.Route,
                "Frequency": $scope.TempDilationMedicationObj.Frequency,
                "ActionId": $scope.TempDilationMedicationObj.ActionId,
                "DoseId": $scope.TempDilationMedicationObj.DoseId,
                "DoseUnitId": $scope.TempDilationMedicationObj.DoseUnitId,
                "RouteId": $scope.TempDilationMedicationObj.RouteId,
                "FrequencyId": $scope.TempDilationMedicationObj.FrequencyId,
                "OrderDescription": $scope.TempDilationMedicationObj.OrderDescription,
                "MedicationNotes": $scope.TempDilationMedicationObj.MedicationNotes,
                "maxDose": $scope.TempDilationMedicationObj.maxDose,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": false,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": $scope.TempDilationMedicationObj.DropTimings || [],
                "TypeId": 2,
                "DeleteInd": "N",

            };
            let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N';
            }) || [];


            if (templist.length > 0 && templist[0].PreOpMedications.length > $scope.TempDilationMedicationObj.EditIndex && $scope.TempDilationMedicationObj.EditIndex >= 0) {
                templist[0].PreOpMedications[$scope.TempDilationMedicationObj.EditIndex] = obj;
                alertify.success('Updated successfully');
            }

            else {

                if (templist.length > 0) {
                    templist[0].PreOpMedications.push(obj);
                } else {

                    let newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "ReviewedBy": null,
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "UserType": "Nurse",
                        "ScreenType": "PreOp",
                        "ScreenTypeId": 4,
                        "MedTypeId": 1,
                        "MedTypeName": 'PreOp Medication',
                        "DilationMedications": [],
                        "PreOpMedications": [obj],
                        "GeneralOrders": [],

                    };
                    $scope.PreOpObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }

            $scope.TempDilationMedicationObj = angular.copy($scope.GetPreOpMedicationObj());
        }


    }


    $scope.editDilationMedication = function (item, index, Id) {
        if (Id == 2) {
            $scope.TempDilationMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0

            };

            $scope.TempDilationMedicationObj.MedicationName = item.MedicationName;

            $scope.TempDilationMedicationObj.Action = item.Action;
            $scope.TempDilationMedicationObj.Dose = item.Dose;
            $scope.TempDilationMedicationObj.DoseUnit = item.DoseUnit;
            $scope.TempDilationMedicationObj.Route = item.Route;
            $scope.TempDilationMedicationObj.Frequency = item.Frequency;

            $scope.TempDilationMedicationObj.ActionId = item.ActionId;
            $scope.TempDilationMedicationObj.DoseId = item.DoseId;
            $scope.TempDilationMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.TempDilationMedicationObj.RouteId = item.RouteId;
            $scope.TempDilationMedicationObj.FrequencyId = item.FrequencyId;

            $scope.TempDilationMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.TempDilationMedicationObj.maxDose = item.maxDose;

            $scope.TempDilationMedicationObj.OrderDescription = item.OrderDescription;
            $scope.TempDilationMedicationObj.DropTimings = item.DropTimings || [];
            $scope.TempDilationMedicationObj.EditIndex = index;

            $scope.TempDilationMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.TempDilationMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.TempDilationMedicationObj.SurgeryTemplateMedicationId = item.SurgeryTemplateMedicationId;
            $scope.TempDilationMedicationObj.IsmedSearchDisabled = true;
            $scope.TempPreOpObj.OrderType = "Medications";
        } else {
            $scope.TempDilationMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0

            };

            $scope.TempDilationMedicationObj.MedicationName = item.MedicationName;

            $scope.TempDilationMedicationObj.Action = item.Action;
            $scope.TempDilationMedicationObj.Dose = item.Dose;
            $scope.TempDilationMedicationObj.DoseUnit = item.DoseUnit;
            $scope.TempDilationMedicationObj.Route = item.Route;
            $scope.TempDilationMedicationObj.Frequency = item.Frequency;

            $scope.TempDilationMedicationObj.ActionId = item.ActionId;
            $scope.TempDilationMedicationObj.DoseId = item.DoseId;
            $scope.TempDilationMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.TempDilationMedicationObj.RouteId = item.RouteId;
            $scope.TempDilationMedicationObj.FrequencyId = item.FrequencyId;

            $scope.TempDilationMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.TempDilationMedicationObj.maxDose = item.maxDose;

            $scope.TempDilationMedicationObj.OrderDescription = item.OrderDescription;
            $scope.TempDilationMedicationObj.DropTimings = item.DropTimings || [];
            $scope.TempDilationMedicationObj.EditIndex = index;

            $scope.TempDilationMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.TempDilationMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.TempDilationMedicationObj.SurgeryTemplateMedicationId = item.SurgeryTemplateMedicationId;
            $scope.TempDilationMedicationObj.IsmedSearchDisabled = true;
            $scope.TempPreOpObj.OrderType = "Medications";
        }


    };


    // Intraop Medication 


    $scope.editIntraopMedication = function (item, index, Id) {
        if (Id == 3) {
            $scope.IntraOpMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0
            };

            $scope.IntraOpMedicationObj.MedicationName = item.MedicationName;
            $scope.IntraOpMedicationObj.Action = item.Action;
            $scope.IntraOpMedicationObj.Dose = item.Dose;
            $scope.IntraOpMedicationObj.DoseUnit = item.DoseUnit;
            $scope.IntraOpMedicationObj.Route = item.Route;
            $scope.IntraOpMedicationObj.Frequency = item.Frequency;

            $scope.IntraOpMedicationObj.ActionId = item.ActionId;
            $scope.IntraOpMedicationObj.DoseId = item.DoseId;
            $scope.IntraOpMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.IntraOpMedicationObj.RouteId = item.RouteId;
            $scope.IntraOpMedicationObj.FrequencyId = item.FrequencyId;

            $scope.IntraOpMedicationObj.OrderDescription = item.OrderDescription;
            $scope.IntraOpMedicationObj.MedicationNotes = item.MedicationNotes;

            $scope.IntraOpMedicationObj.DropTimings = item.DropTimings || [];

            $scope.IntraOpMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.IntraOpMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.IntraOpMedicationObj.SurgeryTemplateMedicationId = item.SurgeryTemplateMedicationId;

            $scope.IntraOpMedicationObj.maxDose = item.maxDose;

            $scope.IntraOpMedicationObj.EditIndex = index;
            $scope.IntraOpMedicationObj.IsmedSearchDisabled = true;
            $scope.TempIntraOpObj.OrderType = 'Medications';
        } else if (Id == 4) {
            $scope.IntraOpMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0
            };

            $scope.IntraOpMedicationObj.MedicationName = item.MedicationName;
            $scope.IntraOpMedicationObj.Action = item.Action;
            $scope.IntraOpMedicationObj.Dose = item.Dose;
            $scope.IntraOpMedicationObj.DoseUnit = item.DoseUnit;
            $scope.IntraOpMedicationObj.Route = item.Route;
            $scope.IntraOpMedicationObj.Frequency = item.Frequency;

            $scope.IntraOpMedicationObj.ActionId = item.ActionId;
            $scope.IntraOpMedicationObj.DoseId = item.DoseId;
            $scope.IntraOpMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.IntraOpMedicationObj.RouteId = item.RouteId;
            $scope.IntraOpMedicationObj.FrequencyId = item.FrequencyId;

            $scope.IntraOpMedicationObj.OrderDescription = item.OrderDescription;
            $scope.IntraOpMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.IntraOpMedicationObj.maxDose = item.maxDose;
            $scope.IntraOpMedicationObj.DropTimings = item.DropTimings || [];


            $scope.IntraOpMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.IntraOpMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.IntraOpMedicationObj.SurgeryTemplateMedicationId = item.SurgeryTemplateMedicationId;

            $scope.IntraOpMedicationObj.EditIndex = index;
            $scope.IntraOpMedicationObj.IsmedSearchDisabled = true;
            $scope.TempIntraOpObj.OrderType = 'Medications';
        }
    };

    $scope.SelectIntraMedicationOrders = function (item, type) {


        if ($scope.TempIntraOpObj.MedTypeId == 3) {
            let i = 0;
            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.IntraOpMedicationObj.MedicineObject = "";
                $scope.IntraOpMedicationObj.MedicationName = '';
                return false;
            }
            $scope.IntraOpMedicationObj.MedicineObject = item;
            $scope.IntraOpMedicationObj.MedicationName = item.MedicineName;


            if ($scope.IntraOpMedicationObj.SurgeryTemplateMedicationId != 0) {
                item.SurgeryTemplateMedicationId = $scope.IntraOpMedicationObj.SurgeryTemplateMedicationId;
            }


            $scope.updateOrderDescription(3);

        }

        else {

            let i = 0;

            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.IntraOpMedicationObj.MedicineObject = "";
                $scope.IntraOpMedicationObj.MedicationName = "";
                return false;
            }

            $scope.IntraOpMedicationObj.MedicineObject = item;
            $scope.IntraOpMedicationObj.MedicationName = item.MedicineName;


            if ($scope.IntraOpMedicationObj.SurgeryTemplateMedicationId != 0) {
                item.SurgeryTemplateMedicationId = $scope.IntraOpMedicationObj.SurgeryTemplateMedicationId;
            }


            $scope.updateOrderDescription(4);

        }
    }

    $scope.AddIntraOpMedication = function (id) {
        if (id == 3) {
            let item = $scope.IntraOpMedicationObj.MedicineObject;

            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }




            let obj = {
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0,
                AscMedicationId: item.AscMedicationId || 0,
                OrganizationMedicationId: item.OrganizationPrescriptionId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                ParentOrganizationId: $scope.ParenthospitalId,
                ASCOrganizationMedicationId: 0,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                MedicineId: item.MedicineId,
                MedicationName: $scope.IntraOpMedicationObj.MedicationName,

                Action: $scope.IntraOpMedicationObj.Action,
                Dose: $scope.IntraOpMedicationObj.Dose,
                DoseUnit: $scope.IntraOpMedicationObj.DoseUnit,
                Route: $scope.IntraOpMedicationObj.Route,
                Frequency: $scope.IntraOpMedicationObj.Frequency,

                ActionId: $scope.IntraOpMedicationObj.ActionId,
                DoseId: $scope.IntraOpMedicationObj.DoseId,
                DoseUnitId: $scope.IntraOpMedicationObj.DoseUnitId,
                RouteId: $scope.IntraOpMedicationObj.RouteId,
                FrequencyId: $scope.IntraOpMedicationObj.FrequencyId,
                OrderDescription: $scope.IntraOpMedicationObj.OrderDescription,
                MedicationNotes: $scope.IntraOpMedicationObj.MedicationNotes,
                maxDose: $scope.IntraOpMedicationObj.maxDose,

                IsChecked: false,
                IsDilationMed: false,
                IsIntraAnesthesiaMed: false,
                IsIntraMed: true,
                IsPreOPMed: false,
                MedicationDosage: '',
                DropTimings: $scope.IntraOpMedicationObj.DropTimings || [],
                TypeId: 4,
                DeleteInd: 'N',

            };

            let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 3 && oitem.DeleteInd === 'N';
            }) || [];

            if ($scope.IntraOpMedicationObj.EditIndex >= 0) {

                if (templist.length > 0 && templist[0].IntraOpMedications.length > $scope.IntraOpMedicationObj.EditIndex) {
                    templist[0].IntraOpMedications[$scope.IntraOpMedicationObj.EditIndex] = obj;
                    alertify.success('Updated successfully');
                }
            } else {

                if (templist.length > 0) {
                    templist[0].IntraOpMedications.push(obj);
                } else {
                    let newObj = {
                        UserOrderId: 0,
                        UserId: $scope.UserId,
                        DeleteInd: 'N',
                        ReviewedBy: null,
                        IsOrderReviewed: false,
                        ReviewedByDateTime: null,
                        ReviewedByPassword: '',
                        UserType: 'Nurse',
                        ScreenType: 'Intra-OP',
                        ScreenTypeId: 5,
                        MedTypeId: 3,
                        MedTypeName: 'IntraAnesthesia Medications',
                        IntraOpMedications: [obj],
                        GeneralOrders: [],

                    };
                    $scope.IntraOpObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }


            $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
        } else {
            let item = $scope.IntraOpMedicationObj.MedicineObject;

            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }




            let obj = {
                AscMedicationId: item.AscMedicationId || 0,
                OrganizationMedicationId: item.OrganizationPrescriptionId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                ParentOrganizationId: $scope.ParenthospitalId,
                ASCOrganizationMedicationId: 0,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                MedicineId: item.MedicineId,
                MedicationName: $scope.IntraOpMedicationObj.MedicationName,
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0,
                Action: $scope.IntraOpMedicationObj.Action,
                Dose: $scope.IntraOpMedicationObj.Dose,
                DoseUnit: $scope.IntraOpMedicationObj.DoseUnit,
                Route: $scope.IntraOpMedicationObj.Route,
                Frequency: $scope.IntraOpMedicationObj.Frequency,

                ActionId: $scope.IntraOpMedicationObj.ActionId,
                DoseId: $scope.IntraOpMedicationObj.DoseId,
                DoseUnitId: $scope.IntraOpMedicationObj.DoseUnitId,
                RouteId: $scope.IntraOpMedicationObj.RouteId,
                FrequencyId: $scope.IntraOpMedicationObj.FrequencyId,
                OrderDescription: $scope.IntraOpMedicationObj.OrderDescription,
                MedicationNotes: $scope.IntraOpMedicationObj.MedicationNotes,
                maxDose: $scope.IntraOpMedicationObj.maxDose,

                IsChecked: false,
                IsDilationMed: false,
                IsIntraAnesthesiaMed: false,
                IsIntraMed: true,
                IsPreOPMed: false,
                MedicationDosage: '',
                DropTimings: $scope.IntraOpMedicationObj.DropTimings || [],
                TypeId: 4,
                DeleteInd: 'N',

            };

            let templist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 4 && oitem.DeleteInd === 'N';
            }) || [];

            if ($scope.IntraOpMedicationObj.EditIndex >= 0) {

                if (templist.length > 0 && templist[0].IntraOpMedications.length > $scope.IntraOpMedicationObj.EditIndex) {
                    templist[0].IntraOpMedications[$scope.IntraOpMedicationObj.EditIndex] = obj;
                    alertify.success('Updated successfully');
                }
            } else {

                if (templist.length > 0) {
                    templist[0].IntraOpMedications.push(obj);
                } else {
                    let newObj = {
                        UserOrderId: 0,
                        UserId: $scope.UserId,
                        DeleteInd: 'N',
                        ReviewedBy: null,
                        IsOrderReviewed: false,
                        ReviewedByDateTime: null,
                        ReviewedByPassword: '',
                        UserType: 'Nurse',
                        ScreenType: 'Intra-OP',
                        ScreenTypeId: 5,
                        MedTypeId: 4,
                        MedTypeName: 'Intra Medication',
                        IntraOpMedications: [obj],
                        GeneralOrders: [],

                    };
                    $scope.IntraOpObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }


            $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
        }
    };

    // PostOp Medication



    $scope.SelectPostOpMedicationItems = function (item, type) {


        if ($scope.TempPostOpObj.MedTypeId == 5) {
            let i = 0;

            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                if (mitem.MedTypeId == $scope.TempPostOpObj.MedTypeId) {
                    angular.forEach(mitem.PostOpMedications, function (Aitem) {
                        if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                            i++;
                        }
                    });
                };
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.TempPostOpMedicationObj.MedicineObject = "";
                $scope.TempPostOpMedicationObj.MedicationName = "";
                return false;
            }


            $scope.TempPostOpMedicationObj.MedicineObject = item;
            $scope.TempPostOpMedicationObj.MedicationName = item.MedicineName;


            if ($scope.TempPostOpMedicationObj.SurgeryTemplateMedicationId != 0) {
                item.SurgeryTemplateMedicationId = $scope.TempPostOpMedicationObj.SurgeryTemplateMedicationId;
            }

            $scope.updateOrderDescription(5);

        }
        else {
            let i = 0;

            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                if (mitem.MedTypeId == $scope.TempPostOpObj.MedTypeId) {
                    angular.forEach(mitem.PostOpMedications, function (Aitem) {
                        if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                            i++;
                        }
                    });
                };
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.TempPostOpMedicationObj.MedicineObject = "";
                $scope.TempPostOpMedicationObj.MedicationName = "";
                return false;
            }

            $scope.TempPostOpMedicationObj.MedicineObject = item;
            $scope.TempPostOpMedicationObj.MedicationName = item.MedicineName;


            if ($scope.TempPostOpMedicationObj.SurgeryTemplateMedicationId != 0) {
                item.SurgeryTemplateMedicationId = $scope.TempPostOpMedicationObj.SurgeryTemplateMedicationId;
            }

            $scope.updateOrderDescription(8);
        }

    };



    $scope.editPostopMedication = function (item, index, Id) {

        if (Id == 5) {
            $scope.TempPostOpMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0
            };

            $scope.TempPostOpMedicationObj.MedicationName = item.MedicationName;
            $scope.TempPostOpMedicationObj.Action = item.Action;
            $scope.TempPostOpMedicationObj.Dose = item.Dose;
            $scope.TempPostOpMedicationObj.DoseUnit = item.DoseUnit;
            $scope.TempPostOpMedicationObj.Route = item.Route;
            $scope.TempPostOpMedicationObj.Frequency = item.Frequency;

            $scope.TempPostOpMedicationObj.ActionId = item.ActionId;
            $scope.TempPostOpMedicationObj.DoseId = item.DoseId;
            $scope.TempPostOpMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.TempPostOpMedicationObj.RouteId = item.RouteId;
            $scope.TempPostOpMedicationObj.FrequencyId = item.FrequencyId;

            $scope.TempPostOpMedicationObj.OrderDescription = item.OrderDescription;
            $scope.TempPostOpMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.TempPostOpMedicationObj.maxDose = item.maxDose;

            $scope.TempPostOpMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.TempPostOpMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.TempPostOpMedicationObj.SurgeryTemplateMedicationId = item.SurgeryTemplateMedicationId;

            $scope.TempPostOpMedicationObj.DropTimings = item.DropTimings || [];
            $scope.TempPostOpMedicationObj.EditIndex = index;
            $scope.TempPostOpMedicationObj.IsmedSearchDisabled = true;
            $scope.TempPostOpObj.OrderType = 'Medications';


        } else if (Id == 8) {
            $scope.TempPostOpMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                SurgeryTemplateMedicationId: item.SurgeryTemplateMedicationId || 0
            };

            $scope.TempPostOpMedicationObj.MedicationName = item.MedicationName;
            $scope.TempPostOpMedicationObj.Action = item.Action;
            $scope.TempPostOpMedicationObj.Dose = item.Dose;
            $scope.TempPostOpMedicationObj.DoseUnit = item.DoseUnit;
            $scope.TempPostOpMedicationObj.Route = item.Route;
            $scope.TempPostOpMedicationObj.Frequency = item.Frequency;

            $scope.TempPostOpMedicationObj.ActionId = item.ActionId;
            $scope.TempPostOpMedicationObj.DoseId = item.DoseId;
            $scope.TempPostOpMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.TempPostOpMedicationObj.RouteId = item.RouteId;
            $scope.TempPostOpMedicationObj.FrequencyId = item.FrequencyId;

            $scope.TempPostOpMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.TempPostOpMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.TempPostOpMedicationObj.SurgeryTemplateMedicationId = item.SurgeryTemplateMedicationId;

            $scope.TempPostOpMedicationObj.OrderDescription = item.OrderDescription;
            $scope.TempPostOpMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.TempPostOpMedicationObj.maxDose = item.maxDose;
            $scope.TempPostOpMedicationObj.DropTimings = item.DropTimings || [];

            $scope.TempPostOpMedicationObj.EditIndex = index;
            $scope.TempPostOpMedicationObj.IsmedSearchDisabled = true;
            $scope.TempPostOpObj.OrderType = 'Medications';
        }
    };




    $scope.AddPostMedication = function (id) {

        if (id == 8) {


            let item = $scope.TempPostOpMedicationObj.MedicineObject;


            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }

            let obj = {
                "SurgeryTemplateMedicationId": item.SurgeryTemplateMedicationId || 0,
                "AscMedicationId": item.AscMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.TempPostOpMedicationObj.MedicationName,

                "Action": $scope.TempPostOpMedicationObj.Action,
                "Dose": $scope.TempPostOpMedicationObj.Dose,
                "DoseUnit": $scope.TempPostOpMedicationObj.DoseUnit,
                "Route": $scope.TempPostOpMedicationObj.Route,
                "Frequency": $scope.TempPostOpMedicationObj.Frequency,

                "ActionId": $scope.TempPostOpMedicationObj.ActionId,
                "DoseId": $scope.TempPostOpMedicationObj.DoseId,
                "DoseUnitId": $scope.TempPostOpMedicationObj.DoseUnitId,
                "RouteId": $scope.TempPostOpMedicationObj.RouteId,
                "FrequencyId": $scope.TempPostOpMedicationObj.FrequencyId,
                "OrderDescription": $scope.TempPostOpMedicationObj.OrderDescription,
                "MedicationNotes": $scope.TempPostOpMedicationObj.MedicationNotes,
                "maxDose": $scope.TempPostOpMedicationObj.maxDose,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": true,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": $scope.TempPostOpMedicationObj.DropTimings || [],
                "TypeId": 4,
                "DeleteInd": "N",


            };


            let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 8 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N';
            }) || [];





            if ($scope.TempPostOpMedicationObj.EditIndex >= 0) {

                if (templist.length > 0 && templist[0].PostOpMedications.length > $scope.TempPostOpMedicationObj.EditIndex) {
                    templist[0].PostOpMedications[$scope.TempPostOpMedicationObj.EditIndex] = obj;
                    alertify.success('Updated successfully');
                }
            } else {
                if (templist.length > 0) {
                    templist[0].PostOpMedications.push(obj);
                } else {

                    let newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "ReviewedBy": null,
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "UserType": "Nurse",
                        "ScreenType": "PostOp",
                        "ScreenTypeId": 6,
                        "MedTypeId": 8,
                        "MedTypeName": "Postop Anesthesia Medications",

                        "PostOpMedications": [obj],
                        "GeneralOrders": [],

                    };
                    $scope.PostOpObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }

            $scope.TempPostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());

        } else {

            let item = $scope.TempPostOpMedicationObj.MedicineObject;


            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }






            let obj = {
                "SurgeryTemplateMedicationId": item.SurgeryTemplateMedicationId || 0,
                "AscMedicationId": item.AscMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.TempPostOpMedicationObj.MedicationName,

                "Action": $scope.TempPostOpMedicationObj.Action,
                "Dose": $scope.TempPostOpMedicationObj.Dose,
                "DoseUnit": $scope.TempPostOpMedicationObj.DoseUnit,
                "Route": $scope.TempPostOpMedicationObj.Route,
                "Frequency": $scope.TempPostOpMedicationObj.Frequency,

                "ActionId": $scope.TempPostOpMedicationObj.ActionId,
                "DoseId": $scope.TempPostOpMedicationObj.DoseId,
                "DoseUnitId": $scope.TempPostOpMedicationObj.DoseUnitId,
                "RouteId": $scope.TempPostOpMedicationObj.RouteId,
                "FrequencyId": $scope.TempPostOpMedicationObj.FrequencyId,
                "OrderDescription": $scope.TempPostOpMedicationObj.OrderDescription,
                "MedicationNotes": $scope.TempPostOpMedicationObj.MedicationNotes,
                "maxDose": $scope.TempPostOpMedicationObj.maxDose,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": true,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": $scope.TempPostOpMedicationObj.DropTimings || [],
                "TypeId": 4,
                "DeleteInd": "N",


            };


            let templist = $filter("filter")($scope.PostOpObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N';
            }) || [];


            if ($scope.TempPostOpMedicationObj.EditIndex >= 0) {
                if (templist.length > 0 && templist[0].PostOpMedications.length > $scope.TempPostOpMedicationObj.EditIndex) {
                    templist[0].PostOpMedications[$scope.TempPostOpMedicationObj.EditIndex] = obj;
                    alertify.success('Updated successfully');
                }
            } else {
                if (templist.length > 0) {
                    templist[0].PostOpMedications.push(obj);
                } else {

                    let newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "ReviewedBy": null,
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "UserType": "Nurse",
                        "ScreenType": "PostOp",
                        "ScreenTypeId": 6,
                        "MedTypeId": 5,
                        "MedTypeName":
                            "PostOp Medication",

                        "PostOpMedications": [obj],
                        "GeneralOrders": [],

                    };
                    $scope.PostOpObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }

            $scope.TempPostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
        }
    }



    $scope.onMaxDoseChange = function (id, item, type) {
        let currentMedId = item.MedicineObject.MedicineId;
        let allowUpdate = true;
        let savedDose = null;

        if (type == 1 || type == 2) {
            // From PreOpObj
            angular.forEach($scope.PreOpObj.OrderDetails, function (mitem) {
                let meds = (type == 2) ? mitem.DilationMedications : mitem.PreOpMedications;
                angular.forEach(meds || [], function (Aitem) {
                    if (Aitem.MedicineId === currentMedId && Aitem.maxDose > id) {
                        allowUpdate = false;
                        savedDose = Aitem.maxDose;
                    }
                });
            });
        }
        else if (type == 5 || type == 8) {
            // From PostOpObj
            angular.forEach($scope.PostOpObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.PostOpMedications || [], function (Aitem) {
                    if (Aitem.MedicineId === currentMedId && Aitem.maxDose > id) {
                        allowUpdate = false;
                        savedDose = Aitem.maxDose;
                    }
                });
            });
        }
        else if (type == 3 || type == 4) {
            // From IntraOpObj
            angular.forEach($scope.IntraOpObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.IntraOpMedications || [], function (Aitem) {
                    if (Aitem.MedicineId === currentMedId && Aitem.maxDose > id) {
                        allowUpdate = false;
                        savedDose = Aitem.maxDose;
                    }
                });
            });
        }

        if (!allowUpdate) {
            alertify.error("You cannot reduce the dose. Already saved dose is higher.");

            // Revert ng-model value to savedDose
            if (type == 1) {
                $scope.TempDilationMedicationObj.maxDose = savedDose;
            } else if (type == 2) {
                $scope.TempDilationMedicationObj.maxDose = savedDose;
            } else if (type == 3) {
                $scope.IntraOpMedicationObj.maxDose = savedDose;
            } else if (type == 4) {
                $scope.IntraOpMedicationObj.maxDose = savedDose;
            } else if (type == 5) {
                $scope.TempPostOpMedicationObj.maxDose = savedDose;
            } else if (type == 8) {
                $scope.TempPostOpMedicationObj.maxDose = savedDose;
            }

            return;
        }

        // Assign new dose if valid
        if (type == 1) {
            $scope.TempDilationMedicationObj.maxDose = id;
            $scope.updateOrderDescription(1);
        } else if (type == 2) {
            $scope.TempDilationMedicationObj.maxDose = id;
            $scope.updateOrderDescription(2);
        } else if (type == 3) {
            $scope.IntraOpMedicationObj.maxDose = id;
            $scope.updateOrderDescription(3);
        } else if (type == 4) {
            $scope.IntraOpMedicationObj.maxDose = id;
            $scope.updateOrderDescription(4);
        } else if (type == 5) {
            $scope.TempPostOpMedicationObj.maxDose = id;
            $scope.updateOrderDescription(5);
        } else if (type == 8) {
            $scope.TempPostOpMedicationObj.maxDose = id;
            $scope.updateOrderDescription(8);
        }
    };

    $scope.OnDoctorChange = function (newDoctorId, item) {
        var duplicate = false;


        if (item.SurgeryArray.length > 0) {
            angular.forEach(item.SurgeryArray, function (curOrder) {
                angular.forEach($scope.AscTemplateScreenObj.TemplateList, function (mitem) {
                    if (mitem.ASCSurgeryTemplateUserId === newDoctorId) {
                        angular.forEach(mitem.SurgeryArray, function (oitem) {
                            if (oitem.OrgSurgeryId === curOrder.OrgSurgeryId && oitem.AscTemplateSurgeryId !== curOrder.AscTemplateSurgeryId) {
                                duplicate = true;
                            }
                        });
                    }
                });
            });
        }

        if (duplicate) {
            alertify.error("This doctor + order combination already exists. Cannot change doctor.");
            $scope.AsctemplateObj.ASCSurgeryTemplateUserId = $scope.PreviousSelectUserId || 0;
            return;
        }
    };
    $scope.GetOrganName = function () {
        return [{
            "OrganId": 1,
            "OrganName": "OD"
        },
        {
            "OrganId": 2,
            "OrganName": "OS"
        },
        {
            "OrganId": 3,
            "OrganName": "Other"
        }];
    };
    $scope.GetOrganNameList = angular.copy($scope.GetOrganName()) || [];
    $scope.uibclose = function () {
        $uibModalInstance.dismiss("cancel");
    };


    $scope.AddUpdateAscCoordinatorSurgeryOrderTemplatesData = function () {
        $scope.AsctemplateObj.TemplateName = $scope.AsctemplateObj.TemplateName || '';
        //if ($scope.AsctemplateObj.TemplateName == '') {
        //    alertify.error('Please Enter TemplateName');
        //    return;
        //}
        //if ($scope.AsctemplateObj.SurgeryArray.length == 0) {
        //    alertify.error('Please Select Surgery');
        //    return;
        //}
        //if ($scope.AsctemplateObj.UserSurgeryTemplateId == 0) {

        /*}*/
        //preop 
        let PreopFinalOrderDetails = [];
        let templist = $filter("filter")($scope.PreOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 1 && ((item.PreOpMedications && item.PreOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 2 && ((item.DilationMedications && item.DilationMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (templist.length > 0) {
            PreopFinalOrderDetails = templist || [];
        }
        $scope.AsctemplateObj.PreOp.OrderDetails = PreopFinalOrderDetails || [];

        let PreopOrgASCChecklist = [];


        //intraop
        let IntraOpFinalOrderDetails = [];
        let Intralist = $filter("filter")($scope.IntraOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 3 && ((item.IntraOpMedications && item.IntraOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 4 && ((item.IntraOpMedications && item.IntraOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (Intralist.length > 0) {
            IntraOpFinalOrderDetails = Intralist || [];
        }
        $scope.AsctemplateObj.IntraOp.OrderDetails = IntraOpFinalOrderDetails || [];






        let IntraOpOrgASCChecklist = [];



        //postop
        let postopOrgASCChecklist = [];


        let PostOpFinalOrderDetails = [];
        let PostList = $filter("filter")($scope.PostOpObj.OrderDetails, function (item) {
            return (item.MedTypeId === 5 && ((item.PostOpMedications && item.PostOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0))) ||
                (item.MedTypeId === 8 && ((item.PostOpMedications && item.PostOpMedications.length > 0) || (item.GeneralOrders && item.GeneralOrders.length > 0)));
        }) || [];
        if (PostList.length > 0) {
            PostOpFinalOrderDetails = PostList || [];
        }
        $scope.AsctemplateObj.PostOp.OrderDetails = PostOpFinalOrderDetails || [];
        $scope.AsctemplateObj.PatientId = $scope.AscTemplateScreenObj.PatientId || 0;
        $scope.AsctemplateObj.AppointmentId = $scope.AscTemplateScreenObj.AppointmentId || 0;

        $scope.AsctemplateObj.CoordinatorChecklistArray =
            angular.copy($scope.CoordinatorChecklistArray || []);

        //Labs&Studies (Laboratory / Examination investigations)
        $scope.AsctemplateObj.InvestigationsList = $filter("filter")($scope.Surgeryobj.Investigationslist || [], function (item) {
            return $scope.IsLabsStudiesInvestigation(item);
        }) || [];


        $uibModalInstance.close($scope.AsctemplateObj);






        //eHnoteSurgeryService.AddUpdateCounselorSurgeryLevelTemplate($scope.AsctemplateObj).then(function (resp) {
        //    if (resp.data.status === "Success") {
        //        if ($scope.AsctemplateObj.UserSurgeryTemplateId != 0) {
        //            alertify.success("Update Template successfully")
        //        } else {
        //            alertify.success("Template added successfully")

        //        }
        //        $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());
        //        $scope.PreOpObj.OrderDetails = [];
        //        $scope.IntraOpObj.OrderDetails = [];
        //        $uibModalInstance.close("cancel");
        //        //$scope.CloseAscTemplateAdupdateScreen();
        //        //$scope.$emit("AscSurgeryTemplateClose");


        //    } else if (resp.data.status == "Failure") {
        //        alertify.error(resp.data.Message);
        //    }
        //    //return eHnoteSurgeryService.AddAscSettingTemplate(requestData).then(function (resp) {
        //    //    $scope.AsctemplateObj = angular.copy($scope.GetAsctemplateObj());

        //});
    }

    $scope.GetMasterLabInvestigation = function (val) {
        var params = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "NotesTypeId": 1,
            "HistoryId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": val,
            "Type": '',
            "IsFrequent": "N"
        };
        if (params.SearchText == "") {
            params.IsFrequent = "Y";
        }


        return eHnoteSettingsDataService.GetMasterLabInvestigation(params).then(function (resp) {
            if (resp.data.rows.length > 0) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };


    $scope.OnCoordinatorChecklistSelect = function (kitem, Aitem) {

        if (!kitem || !Aitem) {
            return;
        }

        var wasChecked = kitem.IsChecked === true;

        angular.forEach(Aitem.SubCheckListDetails || [], function (item) {
            item.IsChecked = false;
        });

        if (!wasChecked) {
            kitem.IsChecked = true;
        }

    };

    
}]);
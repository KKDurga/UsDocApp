"use strict";
eHnoteWebApp.controller("UsSuperBillPopupCtrl", ["$scope", "$rootScope", '$templateCache', "$compile", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "$interval", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteUserDataService", "eHnoteMainAdminServices", "eHnoteInsuranceService", "eHnotePatientVisitReasonServices", 'eHnoteSettingsDataService', 'eHnoteConditionsDataService', "eHnoteDiagnosisDataServices", "USPrintService", "ParentObject", "cacheStorageItem", "$uibModalInstance", "allUserList", "eHnoteAuditServices", "IsInsuranceAvailable",
    function ($scope, $rootScope, $templateCache, $compile, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, $interval, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteUserDataService, eHnoteMainAdminServices, eHnoteInsuranceService, eHnotePatientVisitReasonServices, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, USPrintService, ParentObject, cacheStorageItem, $uibModalInstance, allUserList, eHnoteAuditServices, IsInsuranceAvailable) {
        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = '';
        $scope.ParentHospitalId = '';
        if (doctorInfo !== undefined) {
            if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            }
        }
        $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
        $scope.ParentObject = ParentObject || null;
        $scope.IsInsuranceAvailable = IsInsuranceAvailable;
        $scope.ParentObject.AppointmentInsuranceList = $scope.ParentObject.AppointmentInsuranceList || [];
        //if ($scope.ParentObject.AppointmentInsuranceList.length > 0) {
        //    $scope.IsInsuranceAvailable = true;
        //}
        $scope.ParentObject.IsScreenFrom = $scope.ParentObject.IsScreenFrom || "ASC";
        $scope.cacheStorageItem = cacheStorageItem || [];

        if ($scope.cacheStorageItem.AppointmentDate == undefined) {
            $scope.cacheStorageItem.AppointmentDate = $scope.cacheStorageItem.AppointmentDt;
        }

        $scope.cacheStorageItem.SurgeryList = $scope.cacheStorageItem.SurgeryList || [];
        console.log($scope.cacheStorageItem.appointmentid + "__AppointmentId");
        console.log($scope.cacheStorageItem.ConsultationID + "__ConsultationId");
        $scope.allUserList = allUserList || [];
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        // empty Objects
        $scope.superBillMainObj = {
            "MainTab": 1,
            "SurgeryTabAccess": true,
            "AnesthesiaTabAccess": true,
            "SuggestedSurgeryCodesArray": [],
            "AdvisedSurgeryCodesArray": [],
            "SuggestedAnesthesiaCodes": [],
            "SuggestedConsultationCodes": [],
            "SuggestedDiagnosisCodes": []
        };
        //$scope.superBillMainObj.SuggestedSurgeryCodesArray = $scope.ParentObject.SuggestedCodesArray || [];
        $scope.suggestedSuperBillTemplatesArray = {
            "AllTemplates": [],
            "Surgery": [],
            "AnesthesiaTemplateData": [],
            "ConsultationTemplateData": []
        }
        function getnewSuggestedCodeObj() {
            var obj = {
                "SuperBillItemId": 0,
                "OrganizationProcedureId": null,
                "ProcedureId": null,
                "OrganizationId": null,
                "UserId": $scope.UserId,
                "TypeOfServiceId": null,
                "DateOfService": null,
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
                "ResponcibilityId": 2,
                "DiagnosisArray": [],
                "DiagnosisArrayOriginal": [],
                "Modifiers": [],
                "DeleteInd": false,
                "IsRcopiaa": false,
                "SortOrder": 0
            };
            return obj;
        }
        $scope.GetLogObj = function () {
            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.appointmentid || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "LogArray": [],
                "SuperBillSuggestedCodes": [],
                "SuperBillRemarks": "",
                "EncounterStatus": "",
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        $scope.closeuib = function () {
            const filteredData = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.map(item => {
                return {
                    ...item,
                    Modifiers: item.Modifiers.filter(mitem => mitem.IsChecked === true)
                };
            }).filter(item => item.Modifiers.length > 0);
            $uibModalInstance.dismiss(filteredData);
        };

        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };


        $scope.SuperBillObj = {
            "SelectedCode": "",
            "Isfocused": false
        };

        $scope.SuperBillObject = {
            "Remarks": ""
        };
        $scope.SuperBillFinalObj = {
            "SuperBillSuggestedCodes": [],
            "SuperBillId": 0,
            "VisitId": $scope.cacheStorageItem.ConsultationID || 0,
            "SuperBillRemarks": "",
            "selectedSuperBillTemplateObj": "",
            "isPopoverOpenInvestigation": false,
            "EncounterStatusId": ($scope.ParentObject.IsScreenFrom === "ASC") ? 1 : 7,
            "EncounterStatus": ($scope.ParentObject.IsScreenFrom === "ASC") ? "Ready To Bill" : "NotSigned",
            "IsClickSaveSuperBillBtn": false,
        };

        if ($scope.ParentObject.IsScreenFrom=="OP") {
            $scope.SuperBillFinalObj.EncounterStatusId == $scope.ParentObject.EncounterStatusId || 7;
            $scope.SuperBillFinalObj.EncounterStatus == $scope.ParentObject.EncounterStatus || "NotSigned";
        }
        $scope.AddAuditLogNew = function (selectedItem) {
            $scope.LogObj.LogArray = [];
            let SubModuleName = selectedItem.SubModuleName || "";
            let SubModuleId = selectedItem.SubModuleId || 0;
            let ScreenType = selectedItem.ScreenType || "";
            let ActionType = selectedItem.ActionType || "Accessed";
            let ActionDescription = selectedItem.ActionDescription || "";
            let OldActionDescription = selectedItem.OldActionDescription || "";
            let NewActionDescription = selectedItem.NewActionDescription || "";
            let obj = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPatient",
                "SubModuleId": SubModuleId,
                "SubModuleName": SubModuleName,
                "ScreenType": ScreenType,
                "ActionType": ActionType,
                // "ActionDescription": ActionDescription,
                "OldActionDescription": OldActionDescription,
                "NewActionDescription": NewActionDescription,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
            eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
                if (resp.data.status == "Success") {
                    console.log("Added");
                }
            });
        }


        $scope.ProblemrxObj = {
            "IsRcopiaa": true,
            "DiagnosisObject": "",
        }
        $scope.GetOrganizationProcedure = function (text) {
            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
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
                            return item.IsActive == true;
                        })
                        .map(function (item) {
                            return item;
                        });
                }
            });
        };
        $scope.pushtoSuperBill = function (obj) {
            let counter = 0;
            if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (hitem) {
                    if (hitem.OrganizationProcedureId == obj.OrganizationProcedureId && hitem.DeleteInd == 'N') {
                        counter++;
                    }
                });
            }
            //if (counter > 0) {
            //    alertify.error("Selected Procedure already exists!");
            //    $scope.SuperBillObj.SelectedCode = "";
            //    return;
            //}


            if (counter > 0) {
                alertify.confirm(
                    "<b class='txt-centre'>Confirm!</b>" + "<h4 class='txt-body-centre'> CPT: <b>" + obj.CPTCode + "</b> already entered for this bill.<br>" +
                    "(Use with appropriate modifier)<br><br>Do you want to continue?</h4>",
                    function () {
                        let reqobj = {
                            "OrganizationId": $scope.HospitalId,
                            "ProcedureId": obj.ProcedureId,
                        }
                        eHnoteSettingsDataService.getCptcodesModifiersbyProcedureId(reqobj).then(function (resp) {
                            if (resp.data.status == "Success") {
                                obj.procedurerelatedModifiers = angular.copy(resp.data.rows) || [];
                                obj.DrugNDCID = resp.data.DrugNDCID || "";
                                obj.MedicineId = resp.data.MedicineId || "";
                                obj.MedicineName = resp.data.MedicineName || "";
                                obj.MedicineStrength = resp.data.MedicineStrength || "";
                                obj.UnitId = resp.data.UnitId || "";
                                obj.UnitName = resp.data.UnitName || "";
                            }
                        })
                            .catch(function (error) {
                                console.log("error occured on cpt codes geting")
                            })
                            .finally(function () {
                                addSuperBillSuggestedCodes(obj);
                            });
                        $scope.$apply();
                    },
                    function () {

                        $scope.SuperBillObj.SelectedCode = "";
                        /*    $scope.$apply();*/
                    }
                );
            } else {
                let reqobj = {
                    "OrganizationId": $scope.HospitalId,
                    "ProcedureId": obj.ProcedureId,
                }
                eHnoteSettingsDataService.getCptcodesModifiersbyProcedureId(reqobj).then(function (resp) {
                    if (resp.data.status == "Success") {
                        obj.procedurerelatedModifiers = angular.copy(resp.data.rows) || [];
                        obj.DrugNDCID = resp.data.DrugNDCID || "";
                        obj.MedicineId = resp.data.MedicineId || "";
                        obj.MedicineName = resp.data.MedicineName || "";
                        obj.MedicineStrength = resp.data.MedicineStrength || "";
                        obj.UnitId = resp.data.UnitId || "";
                        obj.UnitName = resp.data.UnitName || "";
                    }
                })
                    .catch(function (error) {
                        console.log("error occured on cpt codes geting")
                    })
                    .finally(function () {
                        addSuperBillSuggestedCodes(obj);
                    });
            }

        };
        function addSuperBillSuggestedCodes(obj) {
            $scope.SuggestedCodeObj = getnewSuggestedCodeObj();
            $scope.SuggestedCodeObj.SuperBillItemId = 0;
            $scope.SuggestedCodeObj.UniqueKey = 'TMP_' + Date.now() + '_' + Math.random();
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
            $scope.SuggestedCodeObj.DateOfService = $scope.cacheStorageItem.AppointmentDate||null;
            $scope.SuggestedCodeObj.IsBillingSelected = true;
            $scope.SuggestedCodeObj.IsBillingDone = false;
            $scope.SuggestedCodeObj.CPTCode = obj.CPTCode;
            $scope.SuggestedCodeObj.ShowDiagForAdd = false;
            $scope.SuggestedCodeObj.Quantity = 1;
            $scope.SuggestedCodeObj.DiagnosisArray = [];
            $scope.SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
            $scope.SuggestedCodeObj.DeleteInd = 'N';
            $scope.SuggestedCodeObj.IsChecked = true;
            $scope.SuggestedCodeObj.MedicineId = obj.MedicineId || null;
            $scope.SuggestedCodeObj.MedicineName = obj.MedicineName || '';
            $scope.SuggestedCodeObj.DrugNDCID = obj.DrugNDCID || '';
            $scope.SuggestedCodeObj.MedicineStrength = obj.MedicineStrength || '';
            $scope.SuggestedCodeObj.UnitId = obj.UnitId || '';
            $scope.SuggestedCodeObj.UnitName = obj.UnitName || '';
            $scope.SuggestedCodeObj.AssessmentPlan = angular.copy($scope.AddDiagnosisAssesmentPlanArray) || [];
            if ($scope.IsInsuranceAvailable) {
                $scope.SuggestedCodeObj.ResponcibilityId = 2;
                $scope.parts = obj.ProcedureCode.split("_");
                if ($scope.parts.length > 1) {
                    if ($scope.parts[1] == "INS") {
                        $scope.SuggestedCodeObj.ResponcibilityId = 3;
                    }
                }
            } else {
                $scope.SuggestedCodeObj.ResponcibilityId = 1;
            }
            $scope.SuggestedCodeObj.AddDiagnosisAssesmentPlanArray = angular.copy($scope.AddDiagnosisAssesmentPlanArray || []);
            //$scope.SuggestedCodeObj.IsRcopiaa = $scope.ParentObject.IsScreenFrom == "ASC" ? true : false;
            $scope.SuggestedCodeObj.SortOrder = ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.filter(item => item.DeleteInd == 'N').length + 1);
            $scope.SuperBillFinalObj.SuperBillSuggestedCodes.push(angular.copy($scope.SuggestedCodeObj));
            $scope.SuperBillObj.SelectedCode = "";
        }
        $scope.ChangeSuperBillTab = function (Tab) {
            $scope.superBillMainObj.MainTab = Tab;
            $scope.SuperBillFinalObj.SuperBillSuggestedCodes = [];
            $scope.SuperBillFinalObj.SuperBillId = 0;
            $scope.SuperBillFinalObj.SuperBillRemarks = "";
            $scope.SuperBillFinalObj.selectedSuperBillTemplateObj = 0;
            $scope.SuperBillFinalObj.isPopoverOpenInvestigation = false;

        };
        $scope.Adddiagnosis = function () {

        }
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
            //let favorites = $scope.superBillMainObj.SuggestedDiagnosisCodes.filter(item => {
            //    return item.DiagnosisStatusId1 == 2 || item.DiagnosisStatusId2 == 2;
            //}) || 
            let favorites = [];
            // without enter text second time not showing data
            //if (object.SearchText == '') {
            //    object.IsFrequent = 'Y';
            //}
            if ($scope.Assesmenttab === 2) {
                if ($scope.AdvisedOrderDetailsArray.length == 0) {
                    alertify.error("Please Select Any Order And Continue To search");
                    return false;
                }
            }
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        let searchResults = response.data.DiagnosisList.map(function (item) {
                            item._group = "Search Diagnosis"
                            return item;
                        });
                        let filteredSearch = [];
                        if (!val || val.trim() === '') {
                            filteredSearch = searchResults;
                        } else {
                            filteredSearch = searchResults.filter(item =>
                                item.DiagnosisName.toLowerCase().includes(val.toLowerCase()) ||
                                (item.ICD10CODE.toLowerCase().includes(val.toLowerCase()))
                            );
                        }
                        if (favorites.length) favorites[0].showHeader = true;
                        if (filteredSearch.length) filteredSearch[0].showHeader = true;
                        return [...favorites, ...filteredSearch];
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
                    "RcopiaVendorAccountName": doctorInfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                    "RcopiaVendorAccountPassword": doctorInfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                    "RcopiaPracticeId": doctorInfo.doctordata.UserAddress[0].RcopiaPracticeId
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
                "OrganId": "3",
                "OrganName": "OU"
            },
            {
                "OrganId": "4",
                "OrganName": "General"
            }
            ];
        };

        $scope.ShowSuggestedCodes = false;
        $scope.SuperBillSuggestedCodeslist = [];
        $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();




        $scope.GetOrganNameList = angular.copy($scope.GetOrganName());
        $scope.Modifiers = [];



        $scope.surgeryOrganId = null;
        function restructureSurgeryDiagnosis(aitem) {

            var SuggestedCodeObj = getnewSuggestedCodeObj();
            SuggestedCodeObj.SuperBillItemId = 0;
            SuggestedCodeObj.OrganizationProcedureId = aitem.OrganizationProcedureId;
            SuggestedCodeObj.ProcedureId = aitem.ProcedureId;
            SuggestedCodeObj.OrganizationId = $scope.HospitalId;
            SuggestedCodeObj.UserId = $scope.UserId;
            SuggestedCodeObj.TypeOfServiceId = aitem.TypeOfServiceId;
            SuggestedCodeObj.Cost = aitem.GeneralCost;
            SuggestedCodeObj.ProcedureCode = aitem.ProcedureCode;
            SuggestedCodeObj.CPTCode = aitem.CPTCode;
            SuggestedCodeObj.ProcedureName = aitem.ProcedureName;
            SuggestedCodeObj.OrganName = aitem.OrganName;
            SuggestedCodeObj.CPTCodeProcedureName = aitem.CPTCodeProcedureName || "";
            SuggestedCodeObj.ProcedureDescription = aitem.ProcedureDescription;
            SuggestedCodeObj.OrganizationName = aitem.OrganizationName || "";
            SuggestedCodeObj.BillingHistoryId = 0;
            SuggestedCodeObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
            SuggestedCodeObj.IsBillingSelected = true;
            SuggestedCodeObj.IsBillingDone = false;
            SuggestedCodeObj.ShowDiagForAdd = false;
            SuggestedCodeObj.Quantity = 1;

            SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
            SuggestedCodeObj.DeleteInd = 'N';
            SuggestedCodeObj.IsChecked = false;
            SuggestedCodeObj.OrganId = aitem.OrganId || null;
            SuggestedCodeObj.DiagnosisArray = angular.copy(aitem.DiagnosisList);
            $scope.superBillMainObj.AdvisedSurgeryCodesArray.push(SuggestedCodeObj);
        };
        if ($scope.cacheStorageItem.SurgeryList.length > 0) {
            $scope.surgeryOrganId = $scope.cacheStorageItem.SurgeryList[0].OrganId;

            console.log($scope.surgeryOrganId + "__OrganId");
            restructureSurgeryDiagnosis($scope.cacheStorageItem.SurgeryList[0]);
        }




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
                "CodeSystem": '',
                "LocationId1": 0,
                "Location1": "",
                "SeverityId1": 0,
                "Verificationstatusid1": 0,
                "DiagnosisStatusId1": 6,
                "DiagnosisStatus1": 'Not Examined',
                "EndDate1": '',
                "StartDate1": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
                "LocationId2": 0,
                "Location2": "",
                "SeverityId2": 0,
                "Verificationstatusid2": 0,
                "DiagnosisStatusId2": 6,
                "DiagnosisStatus2": 'Not Examined',
                "EndDate2": '',
                "StartDate2": $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || '',
            };
        };
        $scope.newAssessmentObj = angular.copy($scope.GetAssessmentObj());
        $scope.OnModifierCheck = function (obj, parentindex) {
            let counter = 0;
            angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].Modifiers, function (kitem) {
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





        $scope.AddDiagForSuperbill = function (obj) {
            let index = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(obj);
            if (index > -1) {
                $scope.SuperBillFinalObj.SuperBillSuggestedCodes.ShowDiagForAdd = true;
                obj.ShowDiagForAdd = true;
            }
        };
        $scope.onSelectSuperBillDiagnosis = function (item) {
            let ind = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(item);
            let counter = 0;
            angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes[ind].DiagnosisArray, function (kitem) {
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
            $scope.SuperBillFinalObj.SuperBillSuggestedCodes[ind].DiagnosisArray.push(item.DiagnosisObject);
            item.DiagnosisObject = "";
        };
        $scope.DeleteDiagInSuperBill = function (obj, parentobj) {
            let parentindex = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(parentobj);
            if (obj.SuperBillDiagnosisId == 0) {
                let index = $scope.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray.indexOf(obj);
                if (index > -1) {
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray.splice(index, 1);
                }
            } else {
                let index = $scope.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray.indexOf(obj);
                if (index > -1) {
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes[parentindex].DiagnosisArray[index].DeleteInd = "Y";
                }
            }
        };

        $scope.DeleteProcInSuperBill = function (obj) {
            obj.DeleteInd = "Y";
            $scope.LogObj.LogArray = [];
            let deletedCount = 0;
            let ProNames = '';
            if (obj.SuperBillItemId == 0) {
                obj.IsChecked = false;
                let index = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(obj);
                if (index > -1) {
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes.splice(index, 1);
                    obj.DiagnosisArray = obj.DiagnosisArray || [];
                    if (obj.DiagnosisArray.length > 0) {
                        angular.forEach(obj.DiagnosisArray, function (nitem) {
                            nitem.IsChecked = false;
                        });
                    }
                }
            }
            else {
                $scope.SuperBillFinalObj.SuperBillSuggestedCodes.forEach(function (code) {
                    if (Array.isArray(code.Modifiers)) {
                        code.Modifiers = code.Modifiers.filter(function (modifier) {
                            return modifier.IsChecked === true;
                        });
                    }
                });

                angular.forEach($scope.SuggestedCodesArray, function (hitem) {
                    if (hitem.ProcedureId == obj.ProcedureId) {
                        hitem.IsChecked = false;
                    }
                    hitem.DiagnosisArray = hitem.DiagnosisArray || [];
                    if (hitem.DiagnosisArray.length > 0) {
                        if (hitem.ProcedureId == obj.ProcedureId) {
                            angular.forEach(hitem.DiagnosisArray, function (kitem) {
                                kitem.IsChecked = false;
                            })
                        }
                    }
                });
                let index = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(obj);
                if (index > -1) {
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes[index].DeleteInd = "Y";
                }
                var SuperBillObj = {
                    "UserId": $scope.UserId,
                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                    "VisitId": $scope.cacheStorageItem.ConsultationID || 0,
                    "OrganizationId": $scope.HospitalId,
                    "SuperBillRemarks": $scope.SuperBillFinalObj.SuperBillRemarks || "",
                    "SuperBillId": $scope.SuperBillFinalObj.SuperBillId || '',
                    "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                    "EncounterStatusId": $scope.SuperBillFinalObj.EncounterStatusId || 0,
                    "EncounterStatus": $scope.SuperBillFinalObj.EncounterStatus || "",
                    "Logs": {}
                };
                if (obj.DeleteInd === 'Y') {

                    if (deletedCount > 0) ProNames += ', ';
                    ProNames += `${obj.ProcedureCode} - ${obj.ProcedureDescription}`;
                    deletedCount++;
                }
                if (deletedCount > 0) {
                    $scope.LogObj.LogArray.push({
                        LogId: 0,
                        ModuleId: 1,
                        ModuleName: "OUTPatient",
                        SubModuleId: 58,
                        SubModuleName: "Super Bill",
                        ScreenType: "Super Bill",
                        ActionType: "Deleted",
                        OldActionDescription: ProNames,
                        NewActionDescription: "",
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    });
                }
                //if ($scope.LogObj.LogArray.length > 0) {
                //    SuperBillObj.Logs = $scope.LogObj || {};
                //}
                eHnoteDiagnosisDataServices.AddUpdateSuperBillItemsForAsc(SuperBillObj).then(function (response) {
                    if (response.data.Status === 'Success') {
                        alertify.error("Deleted Successfully");
                    }
                });
            }
            var pcounter = 0;
            angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                $scope.superBillMainObj.SuggestedSurgeryCodesArray.forEach(pitem => {
                    if (pitem.ProcedureId == item.ProcedureId) {
                        pcounter++;
                    }
                });

            })

            if (pcounter > 0) {
                angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (sitem) {
                    $scope.superBillMainObj.SuggestedSurgeryCodesArray.forEach(citem => {
                        if (citem.ProcedureId == sitem.ProcedureId)
                            citem.IsChecked = true;

                    });
                    $scope.superBillMainObj.AdvisedSurgeryCodesArray.forEach(aitem => {
                        if (aitem.ProcedureId == sitem.ProcedureId)
                            aitem.IsChecked = true;

                    });

                })
            }
            else {
                $scope.SuperBillFinalObj.SuperBillSuggestedCodes.forEach((item, index) => { item.SortOrder = index + 1; });
                $scope.superBillMainObj.SuggestedSurgeryCodesArray.forEach(item => {
                    if (item.ProcedureId === obj.ProcedureId) item.IsChecked = false;
                });
                $scope.superBillMainObj.AdvisedSurgeryCodesArray.forEach(item => {
                    if (item.ProcedureId === obj.ProcedureId) item.IsChecked = false;
                });
            }

        };

        $scope.ShowSuggestedCodesOnClick = function () {
            $scope.ShowSuggestedCodes = true;
            $scope.SuggestedCodesArray = [];
            $scope.cacheStorageItem.InvestigationsDetails = $scope.cacheStorageItem.InvestigationsDetails || [];
            $scope.cacheStorageItem.ProceduresDetails = $scope.cacheStorageItem.ProceduresDetails || [];
            $scope.cacheStorageItem.SurgeriesDetails = $scope.cacheStorageItem.SurgeriesDetails || [];
            if ($scope.ShowSuggestedCodes) {
                // for testing Adding this line 
                // $scope.cacheStorageItem.InvestigationsDetails.forEach(item => { if (!item.DescriptionId) { item.DescriptionId = item.OrgDescriptionId; } });
                let contacttempArray = [...$scope.cacheStorageItem.InvestigationsDetails, ...$scope.cacheStorageItem.ProceduresDetails, ...$scope.cacheStorageItem.SurgeriesDetails];
                let tempArray = angular.copy(contacttempArray);
                if (tempArray.length > 0) {
                    angular.forEach(tempArray, function (titem) {
                        titem.DiagnosisList = [];
                        if (titem.OrderDetails.length > 0) {
                            angular.forEach(titem.OrderDetails, function (oitem) {
                                angular.forEach(oitem.DiagnosisList, function (ditem) {
                                    let filterDiagnosis = $filter("filter")(titem.DiagnosisList, function (Aitem, index) { return Aitem.DiagnosisId == ditem.DiagnosisId && Aitem.DeleteInd == 'N' },);
                                    if (filterDiagnosis.length == 0) {
                                        titem.DiagnosisList.push(ditem);
                                    }
                                });

                            });
                        }

                    });
                    
                }
                if ($scope.ParentObject.IsScreenFrom == 'OP') {
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
                    };
                    $scope.cacheStorageItem.ManifestRefractionDetails = $scope.cacheStorageItem.ManifestRefractionDetails || [];
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
                    $scope.cacheStorageItem.PachymetryDetails = $scope.cacheStorageItem.PachymetryDetails || [];
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
                    $scope.cacheStorageItem.DryEyeEvaluationData = $scope.cacheStorageItem.DryEyeEvaluationData || [];
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
                    $scope.cacheStorageItem.ContactLensDetails = $scope.cacheStorageItem.ContactLensDetails || [];
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
                    };
                    if ($scope.cacheStorageItem.AppointmentTypeId == 1 || $scope.cacheStorageItem.AppointmentTypeId == 11) {
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
                    if ($scope.cacheStorageItem.AppointmentTypeId == 2 || $scope.cacheStorageItem.AppointmentTypeId == 3) {
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
                    if ($scope.cacheStorageItem.AppointmentTypeId == 12 || $scope.cacheStorageItem.AppointmentTypeId == 2) {
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
                }
                if ($scope.ParentObject.IsScreenFrom == 'ASC') {
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


                                obj.Modifiers = $scope.Modifiers || [];


                                tempArray.push(obj);
                            })
                        }
                    }
                    if ($scope.appointmentInfo.AppointmentPatientTypeId == 2 || $scope.appointmentInfo.AppointmentTypeId == 3) {
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


                                    obj.Modifiers = $scope.Modifiers || [];
                                    tempArray.push(obj);
                                }

                            })
                        }
                    }
                    if ($scope.appointmentInfo.AppointmentPatientTypeId == 2 || $scope.appointmentInfo.AppointmentTypeId != 3) {
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

                                obj.Modifiers = $scope.Modifiers || [];
                                tempArray.push(obj);


                            })
                        }
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
                                    /*litem.ICD10CODE = litem.ICDCode || '';*/
                                    kitem.DiagnosisList.push(litem);
                                });
                            });
                        }
                        kitem.DiagnosisList = _.uniq(kitem.DiagnosisList, function (x) {
                            return x.DiagnosisId;
                        });
                    }
                    if (kitem.DiagnosisList.length > 0) {
                        angular.forEach(kitem.DiagnosisList, function (litem) {
                            if (litem.ICDCode != '') {
                                litem.ICD10CODE = litem.ICDCode || '';
                            } else {
                                litem.ICD10CODE = litem.ICD10CODE || '';
                            }

                        });
                    }
                });
                angular.forEach(tempuniqArray, function (aitem) {

                    $scope.SuggestedCodeObj = getnewSuggestedCodeObj();


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
                    $scope.SuggestedCodeObj.DateOfService = $scope.cacheStorageItem.AppointmentDate||null;
                    $scope.SuggestedCodeObj.IsBillingSelected = true;
                    $scope.SuggestedCodeObj.IsBillingDone = false;
                    $scope.SuggestedCodeObj.CPTCode = aitem.CPTCode || aitem.ProcedureCode || "";
                    $scope.SuggestedCodeObj.ShowDiagForAdd = false;
                    $scope.SuggestedCodeObj.Quantity = 1;
                    $scope.SuggestedCodeObj.DiagnosisArray = angular.copy(aitem.DiagnosisList);
                    $scope.SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
                    $scope.SuggestedCodeObj.DeleteInd = false;
                    $scope.SuggestedCodeObj.IsChecked = false;
                    $scope.SuggestedCodeObj.OrganId = aitem.OrganId || null;
                    $scope.SuggestedCodeObj.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                    //const firstOrderDetail = aitem.OrderDetails?.[0];
                    //if (firstOrderDetail?.DiagnosisList?.length > 0) {
                    //    firstOrderDetail.DiagnosisList.forEach(diagnosis => {
                    //        diagnosis.ICD10CODE = diagnosis.ICDCode || "";
                    //    });
                    //}
                    //$scope.ParentObject.IsScreenFrom == 'OP' ? $scope.SuggestedCodeObj.DiagnosisArray = (aitem.OrderDetails && aitem.OrderDetails[0]?.DiagnosisList) || [] : '';

                    $scope.SuggestedCodesArray.push($scope.SuggestedCodeObj);
                    $scope.superBillMainObj.SuggestedSurgeryCodesArray.push(angular.copy($scope.SuggestedCodeObj));
                });

                if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                    angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (Aitem) {
                        if (Aitem.DeleteInd == false) {
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
                        }
                    });
                }


            }
        };

        $scope.OnCheckSuggestedCode = function (obj) {
            if (obj.IsChecked) {
                let temparray = $filter('filter')($scope.SuperBillFinalObj.SuperBillSuggestedCodes, {
                    "OrganizationProcedureId": obj.OrganizationProcedureId,
                    "DeleteInd": 'N'
                }, true);

                //if (temparray.length > 0) {
                //    alertify.error("Procedure already exists!");
                //    obj.IsChecked = false;
                //    return;
                //}

                let copiedObj = angular.copy(obj);

                // Mark Diagnoses as checked and assign SortOrder
                angular.forEach(copiedObj.DiagnosisArray, function (item, index) {
                    item.IsChecked = true;
                    item.SortOrder = index + 1;
                });

                copiedObj.DiagnosisArray = copiedObj.DiagnosisArray.filter(item => item.IsChecked);
                copiedObj.DiagnosisArrayOriginal = angular.copy(copiedObj.DiagnosisArray) || [];
                copiedObj.ShowDiagForAdd = copiedObj.DiagnosisArray.length > 0;

                copiedObj.DateOfService = $scope.cacheStorageItem.AppointmentDate || null;

                if ($scope.ParentObject.IsScreenFrom === 'OP') {
                    angular.forEach(copiedObj.DiagnosisArray, function (litem) {
                        litem.DeleteInd = "N";
                        litem.ICD10CODE = litem.ICDCode || litem.ICD10CODE;
                    });
                }

                let tempArray = angular.copy($scope.Modifiers);
                angular.forEach(tempArray, function (item) {
                    item.IsChecked = false;
                });

                copiedObj.Modifiers = tempArray;

                copiedObj.OrganId = $scope.ParentObject.IsScreenFrom === 'OP'
                    ? (copiedObj.OrganId || 4)
                    : (copiedObj.surgeryOrganId || 4);

                if (copiedObj.OrganId !== 0) {
                    copiedObj.OrganId = copiedObj.OrganId.toString();
                }

                copiedObj.ResponcibilityId = 1;
                if ($scope.IsInsuranceAvailable) {
                    copiedObj.ResponcibilityId = 2;
                    $scope.parts = copiedObj.ProcedureCode.split("_");
                    if ($scope.parts.length > 1) {
                        if ($scope.parts[1] == "INS") {
                            copiedObj.ResponcibilityId = 3;
                        }
                    }
                }


                /*  copiedObj.IsRcopiaa = $scope.ParentObject.IsScreenFrom === "ASC";*/
                copiedObj.UniqueKey = 'TMP_' + Date.now() + '_' + Math.random();
                copiedObj.DeleteInd = copiedObj.DeleteInd === false ? 'N' : copiedObj.DeleteInd;
                copiedObj.SortOrder = ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.filter(item => item.DeleteInd === 'N').length + 1) || 0;
                copiedObj.ProcedureDescription = angular.copy(copiedObj.ProcedureName) || '';
                $scope.SuperBillFinalObj.SuperBillSuggestedCodes.push(copiedObj);

                let reqobj = {
                    "OrganizationId": $scope.HospitalId,
                    "ProcedureId": copiedObj.ProcedureId
                };

                eHnoteSettingsDataService.getCptcodesModifiersbyProcedureId(reqobj).then(function (resp) {
                    if (resp.data.status === "Success") {
                        angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                            if (item.OrganizationProcedureId === copiedObj.OrganizationProcedureId) {
                                item.MedicineId = resp.data.MedicineId || null;
                                item.MedicineName = resp.data.MedicineName || "";
                                item.DrugNDCID = resp.data.DrugNDCID || "";
                                item.MedicineStrength = resp.data.MedicineStrength || "";
                                item.UnitId = resp.data.UnitId || "";
                                item.UnitName = resp.data.UnitName || "";
                            }
                        });
                    }
                });

            } else {
                // Uncheck and remove logic
                if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                    let SortOrder = 1;
                    angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                        if (item.DeleteInd === 'N') {
                            item.SortOrder = SortOrder++;
                        }
                        if (item.ProcedureId === obj.ProcedureId) {
                            if (item.SuperBillItemId === 0) {
                                let index = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.indexOf(item);
                                if (index > -1) {
                                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes.splice(index, 1);
                                }
                            } else {
                                item.DeleteInd = "Y";

                                let SuperBillObj = {
                                    "UserId": $scope.UserId,
                                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                    "OrganizationId": $scope.HospitalId,
                                    "SuperBillRemarks": $scope.SuperBillFinalObj.SuperBillRemarks || "",
                                    "SuperBillId": $scope.SuperBillFinalObj.SuperBillId || '',
                                    "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                                    "EncounterStatusId": $scope.SuperBillFinalObj.EncounterStatusId || 0,
                                    "EncounterStatus": $scope.SuperBillFinalObj.EncounterStatus || ""
                                };

                                eHnoteDiagnosisDataServices.AddupdateSuperBill(SuperBillObj).then(function (response) {
                                    if (response.data.Status === 'Success') {
                                        if (response.data.SuperBillArray.length > 0) {
                                            $scope.SuperBillFinalObj.SuperBillSuggestedCodes = response.data.SuperBillArray || [];
                                        }
                                    }
                                });
                            }
                        }
                    });
                }

                // Uncheck original obj diagnoses (for UI consistency)
                angular.forEach(obj.DiagnosisArray, function (item) {
                    item.IsChecked = false;
                });
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
            if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length == "" || null) {
                alertify.error("Please select at least one procedure");
                return false;
            }

            if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (mitem) {
                    mitem.Modifiers = $filter("filter")(mitem.Modifiers, { "IsChecked": true }, true);
                });
            }

            var SuperBillObj = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "SuperBillRemarks": $scope.SuperBillFinalObj.SuperBillRemarks || '',
                "SuperBillId": $scope.SuperBillFinalObj.SuperBillId || '',
                "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "EncounterStatusId": $scope.SuperBillFinalObj.EncounterStatusId || 0,
                "EncounterStatus": $scope.SuperBillFinalObj.EncounterStatus || "",
            };

            eHnoteDiagnosisDataServices.AddupdateSuperBill(SuperBillObj).then(function (response) {

                if (response.data.Status === 'Success') {
                    if (response.data.SuperBillArray.length > 0) {
                        $scope.SuperBillFinalObj.SuperBillSuggestedCodes = response.data.SuperBillArray || [];
                    }
                    if (type != 2) {
                        $uibModalInstance.close($scope.AssessmentplanpopupObj);
                    }
                }
            });
        }

        $scope.addAdditionalDiagnosis = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "addAdditionalDiagnosis.html",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.modalItem = item;
                    $scope.uibcloseFirst = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.ADDdiagnosisInvestigationadded = function (Mitem, type) {

                        angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (item) {
                            if (item.IsCheckedDiagnosis) {
                                var obj = {
                                    "DiagnosisDetailId": 0,
                                    "SuperbillItemDiagnosisId": 0,
                                    "ICDCode": '',
                                    "DiagnosisId": item.DiagnosisId,
                                    "DiagnosisName": item.DiagnosisName,
                                    "FullName": item.DiagnosisName,
                                    "DiagnosisNotes": '',
                                    "ActiveInd": item.ActiveInd || "Y",
                                    "IsChecked": true,
                                    "DeleteInd": item.DeleteInd || 'N',
                                    "ICD10CODE": item.ICD10CODE || "",
                                    "DiagnosisCode": item.ICD10CODE || "",
                                    "HospitalId": $scope.HospitalId,
                                    "UserId": $scope.UserId
                                }
                                var TempDiagnosisDiagnosisArray = $filter("filter")(Mitem.DiagnosisArray, { "DiagnosisId": item.DiagnosisId }, true) || [];
                                if (TempDiagnosisDiagnosisArray.length == 0) {
                                    Mitem.DiagnosisArray.push(obj);
                                    Mitem.DiagnosisArrayOriginal.push(obj);
                                }
                            } else {
                                Mitem.DiagnosisArray = Mitem.DiagnosisArray || [];
                                if (Mitem.DiagnosisArray.length != 0) {
                                    angular.forEach(Mitem.DiagnosisArray, function (Aitem, index) {
                                        if (Aitem.DiagnosisId == item.DiagnosisId) {
                                            if (Aitem.DiagnosisDetailId == 0) {
                                                Mitem.DiagnosisArray.splice(index, 1);
                                            } else {
                                                Aitem.DeleteInd = 'Y';
                                            }
                                        }
                                    });
                                }
                            }

                        });
                        $scope.SuperBillFinalObj.isPopoverOpenInvestigation = false;
                        Mitem.isPopoverOpenInvestigation = false;
                        $scope.uibcloseFirst();
                    }
                }
            });
        };
        $scope.DiagnosisSelections = {};
        $scope.addupdateDiagnosistoprocedure = function (item, Mitem,) {
            if (item.IsCheckedDiagnosis) {
                var obj = {
                    "DiagnosisDetailId": 0,
                    "SuperbillItemDiagnosisId": 0,
                    "ICDCode": '',
                    "DiagnosisId": item.DiagnosisId,
                    "DiagnosisName": item.DiagnosisName,
                    "FullName": item.DiagnosisName,
                    "DiagnosisNotes": '',
                    "ActiveInd": item.ActiveInd || "Y",
                    "IsChecked": true,
                    "DeleteInd": item.DeleteInd || 'N',
                    "ICD10CODE": item.ICD10CODE || "",
                    "DiagnosisCode": item.ICD10CODE || "",
                    "HospitalId": $scope.HospitalId,
                    "UserId": $scope.UserId
                }
                var TempDiagnosisDiagnosisArray = $filter("filter")(Mitem.DiagnosisArray, { "DiagnosisId": item.DiagnosisId }, true) || [];
                if (TempDiagnosisDiagnosisArray.length == 0) {
                    Mitem.DiagnosisArray.push(obj);
                    Mitem.DiagnosisArrayOriginal.push(obj);
                }
            } else {
                Mitem.DiagnosisArray = Mitem.DiagnosisArray || [];
                if (Mitem.DiagnosisArray.length != 0) {
                    angular.forEach(Mitem.DiagnosisArray, function (Aitem, index) {
                        if (Aitem.DiagnosisId == item.DiagnosisId) {
                            if (Aitem.DiagnosisDetailId == 0) {
                                Mitem.DiagnosisArray.splice(index, 1);
                            } else {
                                Aitem.DeleteInd = 'Y';
                            }
                        }
                    });
                }
            }
        }

        $scope.connectDiagnosistoCpt = function (type, Aitem) {


            $scope.SuperBillFinalObj.isPopoverOpenInvestigation = true;
            $scope.ProblemrxObj.IsRcopiaa = true;

            angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (mitem) {
                mitem.isPopoverOpenInvestigation = false;
            });

            if (Aitem.DiagnosisArray.length > 0) {
                angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (zitem) {
                    zitem.IsCheckedDiagnosis = false;
                });
                if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length == 0) {
                    if ($scope.SuggestedCodesArray.length > 0) {
                        angular.forEach($scope.SuggestedCodesArray, function (hitem) {
                            hitem.DiagnosisArray = hitem.DiagnosisArray || [];
                            if (hitem.DiagnosisArray.length > 0 && hitem.ProcedureId == Aitem.ProcedureId) {
                                angular.forEach(hitem.DiagnosisArray, function (kitem) {
                                    if (kitem.IsChecked == true) {
                                        angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (Citem) {
                                            if (kitem.DiagnosisId == Citem.DiagnosisId) {
                                                Citem.IsCheckedDiagnosis = true;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                        angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (hitem) {
                            if (hitem.DiagnosisArray.length > 0 && hitem.ProcedureId == Aitem.ProcedureId) {
                                angular.forEach(hitem.DiagnosisArray, function (kitem) {
                                    if ($scope.AddDiagnosisAssesmentPlanArray.length > 0) {
                                        angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (Citem) {
                                            if (kitem.DiagnosisId == Citem.DiagnosisId) {
                                                Citem.IsCheckedDiagnosis = true;
                                            }
                                        });
                                    } else {
                                        kitem.ICD10DIAGNAME = kitem.ICD10DIAGDESCRIPTION;
                                        kitem.IsCheckedDiagnosis = true;
                                        $scope.AddDiagnosisAssesmentPlanArray.push(kitem);
                                    }
                                });
                            } else {
                                if (hitem.DiagnosisArray.length > 0) {
                                    angular.forEach(hitem.DiagnosisArray, function (kitem) {
                                        kitem.ICD10DIAGNAME = kitem.ICD10DIAGDESCRIPTION;
                                        $scope.AddDiagnosisAssesmentPlanArray.push(kitem);
                                    });
                                }

                            }
                        });
                    }
                }
            } else {
                if ($scope.AddDiagnosisAssesmentPlanArray.length > 0) {
                    angular.forEach($scope.AddDiagnosisAssesmentPlanArray, function (zitem) {
                        zitem.IsCheckedDiagnosis = false;
                    });
                } else {
                    angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (hitem) {
                        angular.forEach(hitem.DiagnosisArray, function (kitem) {
                            kitem.ICD10DIAGNAME = kitem.ICD10DIAGDESCRIPTION;
                            $scope.AddDiagnosisAssesmentPlanArray.push(kitem);
                        });
                    });
                }
            }

            if (type == 'Investigation') {
                Aitem.isPopoverOpenInvestigation = true;
                if (Aitem.DiagnosisArray.length > 0) {
                    angular.forEach(Aitem.DiagnosisArray, function (item) {
                        if (item.SuperbillItemDiagnosisId != 0) {
                            item.ICD10DIAGNAME = item.DiagnosisName;
                            item.IsCheckedDiagnosis = true;
                        } else {
                            item.IsCheckedDiagnosis = false;
                        }
                    });
                }
            }
            $scope.AddDiagnosisAssesmentPlanArray = _.uniq($scope.AddDiagnosisAssesmentPlanArray, false, function (p) { return p.DiagnosisId; });
        }

        $scope.Closeiagnosisadded = function (item) {
            item.isPopoverOpenInvestigation = false;
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
                        "DiagnosisName": item.DiagnosisName || '',
                        "ICDCode": item.ICD10CODE || '',
                        "ActiveInd": "Y",
                        "IsChecked": true,
                        "DeleteInd": item.DeleteInd || 'N',
                        "ICD10CODE": item.ICD10CODE || "",
                        "Diagnosis": true,
                    }
                    if (obj.DiagnosisName == '') {
                        obj.DiagnosisName = item.ICD10DIAGDESCRIPTION || '';
                    }
                    var TempDiagnosisDiagnosisArray = $filter("filter")(TempDiagnosisArray[0].DiagnosisList, { "DiagnosisId": item.DiagnosisId, "DeleteInd": 'N' }, true);
                    if (TempDiagnosisDiagnosisArray.length == 0) {
                        TempDiagnosisArray[0].DiagnosisList.push(obj);
                    }
                } else {
                    // var TempDiagnosisDiagnosisArray = $filter("filter")(TempDiagnosisArray[0].DiagnosisList, { "DiagnosisId": item.DiagnosisId }, true);
                    if (TempDiagnosisArray[0].DiagnosisList.length != 0) {
                        angular.forEach(TempDiagnosisArray[0].DiagnosisList, function (Aitem, index) {
                            if (Aitem.DiagnosisId == item.DiagnosisId) {
                                if (Aitem.DiagnosisDetailId == 0) {
                                    TempDiagnosisArray[0].DiagnosisList.splice(index, 1);
                                } else {
                                    Aitem.DeleteInd = 'Y';
                                    Aitem.ActiveInd = 'N';
                                }

                            }

                        });

                    }

                }
            } else {
                item.IsCheckedDiagnosis = false;
                alertify.error("Select Edit Order To Map Diagnosis");

            }

        }
        //super bill end

        $scope.changeSuperBillTemplateObj = function (sobj) {
            console.log(sobj);
            $scope.superBillMainObj.SuggestedSurgeryCodesArray = [];
            sobj.CPTCodesList = sobj.CPTCodesList || [];

            angular.forEach(sobj.CPTCodesList, function (aitem) {
                aitem.IsChecked = false;

                if (aitem.DiagnosisArray.length > 0) {
                    angular.forEach(aitem.DiagnosisArray, function (jitem) {
                        jitem.IsChecked = false;
                    });
                }


                var SuggestedCodeObj = getnewSuggestedCodeObj();
                SuggestedCodeObj.SuperBillItemId = 0;
                SuggestedCodeObj.OrganizationProcedureId = aitem.OrganizationProcedureId;
                SuggestedCodeObj.ProcedureId = aitem.ProcedureId;
                SuggestedCodeObj.OrganizationId = $scope.HospitalId;
                SuggestedCodeObj.UserId = $scope.UserId;
                SuggestedCodeObj.TypeOfServiceId = aitem.TypeOfServiceId;
                SuggestedCodeObj.Cost = aitem.GeneralCost;
                SuggestedCodeObj.ProcedureCode = aitem.ProcedureCode;
                SuggestedCodeObj.CPTCode = aitem.CPTCode;
                SuggestedCodeObj.ProcedureName = aitem.ProcedureName;
                SuggestedCodeObj.OrganName = aitem.OrganName;
                SuggestedCodeObj.CPTCodeProcedureName = aitem.CPTCodeProcedureName || "";
                SuggestedCodeObj.ProcedureDescription = aitem.ProcedureDescription;
                SuggestedCodeObj.OrganizationName = aitem.OrganizationName || "";
                SuggestedCodeObj.BillingHistoryId = 0;
                SuggestedCodeObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
                SuggestedCodeObj.IsBillingSelected = true;
                SuggestedCodeObj.IsBillingDone = false;
                SuggestedCodeObj.ShowDiagForAdd = false;
                SuggestedCodeObj.Quantity = 1;
                SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
                SuggestedCodeObj.DeleteInd = 'N';
                SuggestedCodeObj.IsChecked = false;
                SuggestedCodeObj.OrganId = aitem.OrganId || null;
                SuggestedCodeObj.DiagnosisArray = aitem.DiagnosisArray || [];
                console.log(SuggestedCodeObj.DiagnosisArray)
                $scope.superBillMainObj.SuggestedSurgeryCodesArray.push(SuggestedCodeObj);
            });


        };

        $scope.onSelectAssesmentPlannewDiagnosis = function (mainobject, type, MainItem) {
            $scope.newAssessmentObj = angular.copy($scope.GetAssessmentObj());
            $scope.newAssessmentObj.StartDate1 = $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null;
            $scope.newAssessmentObj.StartDate2 = $filter('date')(new Date(), "yyyy-MM-dd h:mm a") || null;
            $scope.newAssessmentObj.EndDate1 = null;
            $scope.newAssessmentObj.EndDate2 = null;
            $scope.newAssessmentObj.CreatedDateTime = $filter('date')(new Date(), "MM-dd-yyyy h:mm a");
            if (type == 'ehnote') {
                MainItem.DiagnosisArray = MainItem.DiagnosisArray || [];
                if (MainItem.DiagnosisArray.length > 0) {
                    var filterdiagnosis = $filter("filter")(MainItem.DiagnosisArray, { "DiagnosisId": mainobject.DiagnosisId, "DeleteInd": "N" }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.newAssessmentObj.DiagnosisObject = "";
                        MainItem.DiagnosisObject = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }
                $scope.newAssessmentObj.DiagnosisId = mainobject.DiagnosisId;
                $scope.newAssessmentObj.OrganizationDiagnosisId = mainobject.OrganizationDiagnosisId;
                $scope.newAssessmentObj.ICD10CODE = mainobject.ICD10CODE;
                $scope.newAssessmentObj.ICD10DIAGNAME = mainobject.DiagnosisName;
                $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = mainobject.FullName;
                $scope.newAssessmentObj.DiagnosisName = mainobject.DiagnosisName;
                $scope.newAssessmentObj.DiagnosisDescription = mainobject.FullName;
                $scope.newAssessmentObj.OrganizationDiagnosisId = mainobject.OrganizationDiagnosisId;
                $scope.newAssessmentObj.CodeSystem = "ICD";
            }
            if (type == 'rcopia') {
                if ($scope.AddDiagnosisAssesmentPlanArray.length > 0) {
                    var filterdiagnosis = $filter("filter")($scope.AddDiagnosisAssesmentPlanArray, { "ICD10CODE": mainobject.ICD10Code, "DeleteInd": "N" }, true);
                    if (filterdiagnosis.length > 0) {
                        $scope.newAssessmentObj.DiagnosisObject = "";
                        MainItem.DiagnosisObject = "";
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }
                $scope.AddDiagnosisAssesmentPlanArray = $scope.AddDiagnosisAssesmentPlanArray || [];
                $scope.newAssessmentObj.ICD10CODE = mainobject.ICD10Code;
                $scope.newAssessmentObj.ICD10DIAGNAME = mainobject.ICD10Description;
                $scope.newAssessmentObj.ICD10DIAGDESCRIPTION = mainobject.ICD10Description;
                $scope.newAssessmentObj.DiagnosisName = mainobject.ICD10Description;
                $scope.newAssessmentObj.DiagnosisDescription = mainobject.ICD10Description;
                $scope.newAssessmentObj.SnomedCode = mainobject.SNOMEDConceptID;
                $scope.newAssessmentObj.SnomedCodeDescription = mainobject.SNOMEDDescription;
                $scope.newAssessmentObj.CodeSystem = "ICD";
                var req = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "ICD10CODE": $scope.newAssessmentObj.ICD10CODE || "",
                    "ICD10Description": mainobject.ICD10Description || "",
                    "SNOMEDConceptId": $scope.newAssessmentObj.SnomedCode || "",
                    "SNOMEDDescription": $scope.newAssessmentObj.SnomedCodeDescription || "",
                    "DiagnosisId": $scope.newAssessmentObj.DiagnosisId || 0,
                    "OrgDiagnosisId": $scope.newAssessmentObj.OrganizationDiagnosisId || 0
                }
                eHnoteSettingsDataService.UpdateDiagnosisFromRcopia(req).then(function (response) {
                    console.log(JSON.stringify(response));
                    if (response.data.status === 'Success') {
                        $scope.newAssessmentObj.DiagnosisId = response.data.DiagnosisId;
                        $scope.newAssessmentObj.OrganizationDiagnosisId = response.data.OrgDiagnosisId;
                        if (type == 'rcopia') {

                            mainobject.DiagnosisId = $scope.newAssessmentObj.DiagnosisId;
                            MainItem.DiagnosisArray = MainItem.DiagnosisArray || [];
                            if (MainItem.DiagnosisArray.length) {
                                const exists = MainItem.DiagnosisArray.some(d => d.DiagnosisId === mainobject.DiagnosisId && d.DeleteInd === "N");
                                if (exists) {
                                    $scope.newAssessmentObj.DiagnosisObject = "";
                                    MainItem.DiagnosisObject = "";
                                    alertify.error("Diagnosis Already Added");
                                    return false;
                                }
                            }

                            var obj = {
                                "DiagnosisDetailId": 0,
                                "SuperbillItemDiagnosisId": 0,
                                "ICDCode": '',
                                "DiagnosisId": mainobject.DiagnosisId,
                                "DiagnosisName": mainobject.ICD10Description,
                                "FullName": mainobject.ICD10Description,
                                "DiagnosisNotes": '',
                                "ActiveInd": mainobject.ActiveInd || "Y",
                                "IsChecked": true,
                                "DeleteInd": mainobject.DeleteInd || 'N',
                                "ICD10CODE": mainobject.ICD10Code || "",
                                "DiagnosisCode": mainobject.ICD10Code || "",
                                "HospitalId": $scope.HospitalId,
                                "UserId": $scope.UserId,
                                "SortOrder": (MainItem.DiagnosisArray.filter(item => item.DeleteInd == 'N').length + 1)
                            }
                            const copied1 = angular.copy(obj);
                            MainItem.DiagnosisArray.push(copied1);
                            setTimeout(function () {
                                const alreadyExists = MainItem.DiagnosisArrayOriginal.some(x => x.DiagnosisId === obj.DiagnosisId);
                                if (!alreadyExists) {
                                    const copied2 = angular.copy(obj);
                                    MainItem.DiagnosisArrayOriginal.push(copied2);
                                }
                            }, 5000);
                            $scope.AddDiagnosisAssesmentPlanArray.push($scope.newAssessmentObj);
                        }
                    }
                });
            }
            $scope.newAssessmentObj.IsEditData = false;
            $scope.newAssessmentObj.IsCheckedDiagnosis = false;
            if (type != 'rcopia') {

                var obj = {
                    "DiagnosisDetailId": 0,
                    "SuperbillItemDiagnosisId": 0,
                    "ICDCode": '',
                    "DiagnosisId": mainobject.DiagnosisId,
                    "DiagnosisName": mainobject.DiagnosisName,
                    "FullName": mainobject.FullName,
                    "DiagnosisNotes": '',
                    "ActiveInd": mainobject.ActiveInd || "Y",
                    "IsChecked": true,
                    "DeleteInd": mainobject.DeleteInd || 'N',
                    "ICD10CODE": mainobject.ICD10CODE || "",
                    "DiagnosisCode": mainobject.ICD10CODE || "",
                    "HospitalId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    "SortOrder": (MainItem.DiagnosisArray.filter(item => item.DeleteInd == 'N').length + 1)
                }
                const copied1 = angular.copy(obj);
                MainItem.DiagnosisArray.push(copied1);
                setTimeout(function () {
                    const alreadyExists = MainItem.DiagnosisArrayOriginal.some(x => x.DiagnosisId === obj.DiagnosisId);
                    if (!alreadyExists) {
                        const copied2 = angular.copy(obj);
                        MainItem.DiagnosisArrayOriginal.push(copied2);
                    }
                }, 5000);
            }
            MainItem.DiagnosisObject = "";
            //let object = angular.copy($scope.newAssessmentObj);
            //object.IsCheckedDiagnosis = false;
            //$scope.SuperBillFinalObj.SuperBillSuggestedCodes.forEach(xitem => {
            //    xitem.AddDiagnosisAssesmentPlanArray.push(angular.copy(object));
            //});
            //MainItem.AddDiagnosisAssesmentPlanArray.forEach(sitem => {
            //    if ($scope.newAssessmentObj.DiagnosisId == sitem.DiagnosisId) {
            //        sitem.IsCheckedDiagnosis = true;
            //    }
            //});

            //var exists = $scope.SuperBillDiagnosisArray.some(function (existingItem) {
            //    return existingItem.DiagnosisId === mainobject.DiagnosisId;
            //});

            //if (!exists) {
            //    var obj = {
            //        "SuperBillDiagnosisId": 0,
            //        "DiagnosisId": mainobject.DiagnosisId,
            //        "DiagnosisName": mainobject.DiagnosisName,
            //        "DiagnosisNotes": "",
            //        "DiagnosisCode": mainobject.ICD10CODE,
            //        "ICD10Code": mainobject.ICD10CODE,
            //        "FullName": mainobject.ICD10CODE + '-' + mainobject.DiagnosisName,
            //        "HospitalId": $scope.HospitalId,
            //        "UserId": $scope.UserId,
            //        "Type": mainobject.Type,
            //        "DeleteInd": "N"
            //    }
            //    $scope.SuperBillDiagnosisArray.push(obj);
            //}
        };


        $scope.SaveSuperBill = function (type) {
            if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (mitem) {
                    mitem.Modifiers = $filter("filter")(mitem.Modifiers, { "IsChecked": true }, true);
                });
            }


            var SuperBillObj = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "SuperBillRemarks": $scope.SuperBillFinalObj.SuperBillRemarks || "",
                "DeleteInd": "N",
                "VisitId": $scope.cacheStorageItem.ConsultationID || 0,
                "SuperBillId": $scope.SuperBillFinalObj.SuperBillId || 0,
                "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "EncounterStatusId": $scope.SuperBillFinalObj.EncounterStatusId || 0,
                "EncounterStatus": $scope.SuperBillFinalObj.EncounterStatus || "",
                "Type": type
            };
            eHnoteDiagnosisDataServices.AddupdateSuperBill(SuperBillObj).then(function (response) {
                if (response.data.Status === 'Success') {
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes = response.data.SuperBillArray || [];
                    if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                        angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (kitem) {
                            var ModifiersArray = angular.copy($scope.Modifiers) || [];
                            if (kitem.Modifiers.length > 0) {
                                angular.forEach(kitem.Modifiers, function (item) {
                                    //if (item.IsChecked) {
                                    var TempArray = $filter("filter")(ModifiersArray, { "MODIFIERID": item.MODIFIERID }, true) || [];
                                    if (TempArray.length > 0) {
                                        TempArray[0].IsChecked = true;
                                    }
                                    /*}*/
                                });
                                kitem.Modifiers = angular.copy(ModifiersArray);
                            } else {
                                kitem.Modifiers = angular.copy(ModifiersArray);
                            }
                        });
                    }
                    alertify.success("Saved Successfully");
                    $uibModalInstance.close("save");
                }
            });
        };


        $scope.getAppointmentSuperBillDetails = function () {
            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
            };
            eHnoteDiagnosisDataServices.GetSuperBillDetailsByAppointmentId(params.AppointmentId, $scope.cacheStorageItem.ConsultationID).then(function (response) {
                console.log(response);
                if (response.data.Status == "Success") {
                    if (response.data.rows.length > 0) {
                        let SuperBillArray = response.data.rows[0].SuperBillArray || [];
                        $scope.SuperBillFinalObj.SuperBillRemarks = response.data.rows[0].SuperBillRemarks || "";
                        $scope.LogObj.SuperBillRemarks = $scope.SuperBillFinalObj.SuperBillRemarks || "";
                        $scope.SuperBillFinalObj.SuperBillId = response.data.rows[0].SuperbillId || 0;
                        $scope.SuperBillFinalObj.EncounterStatusId = response.data.rows[0].EncounterStatusId || 1;
                        $scope.SuperBillFinalObj.EncounterStatus = response.data.rows[0].EncounterStatus || "Ready To Bill";
                        $scope.LogObj.EncounterStatus = $scope.SuperBillFinalObj.EncounterStatus || "";
                        $scope.SuperBillFinalObj.SuperBillSuggestedCodes = SuperBillArray || [];
                        if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                            angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (kitem) {
                                var ModifiersArray = angular.copy($scope.Modifiers) || [];
                                if (kitem.Modifiers.length > 0) {
                                    angular.forEach(kitem.Modifiers, function (item) {
                                        //if (item.IsChecked) {
                                        var TempArray = $filter("filter")(ModifiersArray, { "MODIFIERID": item.MODIFIERID }, true) || [];
                                        if (TempArray.length > 0) {
                                            TempArray[0].IsChecked = true;
                                        }
                                        /*}*/
                                    });
                                    kitem.Modifiers = angular.copy(ModifiersArray);
                                } else {
                                    kitem.Modifiers = angular.copy(ModifiersArray);
                                }
                            });
                            $scope.LogObj.SuperBillSuggestedCodes = angular.copy($scope.SuperBillFinalObj.SuperBillSuggestedCodes) || [];
                        }
                    }
                }

            });
        };

        //$scope.getAppointmentSuperBillDetails();

        $scope.HeaderLogo = '';
        $scope.toDataURL = function (dataURL, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', dataURL);
            xhr.responseType = 'blob';
            xhr.send();
        };
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


        $scope.SuperSurgeryBillPrint = function () {
            let CreatedByName = "";
            if (doctorInfo.doctordata.User.length > 0) {
                CreatedByName = doctorInfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.UserId }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            let PatientDOB = $scope.cacheStorageItem.PatientDOB || null;
            let PatientName = $scope.cacheStorageItem.PatientName || '';
            let PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || '';
            let Age = $scope.cacheStorageItem.Age || '';
            let Gender = $scope.cacheStorageItem.Gender || '';
            let VisitReason = $scope.cacheStorageItem.VisitReason || '';
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": [],
                //"PatientArray": $scope.treatmentData[0].PatientArray || [],

                "VisitReason": '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorInfo.doctordata.UserAddress[0].Address1 + '  ' + doctorInfo.doctordata.UserAddress[0].Address2 || '',
                "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "EhnoteLogoURL": $scope.HeaderLogo || "",
                "PatientDOB": PatientDOB || '',
                "Name": PatientName || '',
                "PatientDisplayId": PatientDisplayId || null,
                "Age": Age || '',
                "Gender": Gender || '',
                "VisitReason": VisitReason || '',
            }
            USPrintService.GenerateSuperBillPrint(obj);
        }

        $scope.SuperAnesthesiaBillPrint = function () {
            let CreatedByName = "";
            if (doctorInfo.doctordata.User.length > 0) {
                CreatedByName = doctorInfo.doctordata.User[0].FullName || "";
            }
            var AppointmentDoctor = '';
            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.UserId }, true) || [];
            if ($scope.DoctorArray.length > 0) {
                AppointmentDoctor = $scope.DoctorArray[0].FullName;
            }
            let PatientDOB = $scope.cacheStorageItem.PatientDOB || null;
            let PatientName = $scope.cacheStorageItem.PatientName || '';
            let PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || '';
            let Age = $scope.cacheStorageItem.Age || '';
            let Gender = $scope.cacheStorageItem.Gender || '';
            let VisitReason = $scope.cacheStorageItem.VisitReason || '';
            var obj = {
                "CreatedBy": CreatedByName,
                "ConsultationStartTime": $scope.cacheStorageItem.ConsultationStartTime || '',
                "PatientArray": [],
                //"PatientArray": $scope.treatmentData[0].PatientArray || [],

                "VisitReason": '',
                "AppointmentDoctor": AppointmentDoctor || '',
                "Address": doctorInfo.doctordata.UserAddress[0].Address1 + '  ' + doctorInfo.doctordata.UserAddress[0].Address2 || '',
                "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "EhnoteLogoURL": $scope.HeaderLogo || "",
                "PatientDOB": PatientDOB || '',
                "Name": PatientName || '',
                "PatientDisplayId": PatientDisplayId || null,
                "Age": Age || '',
                "Gender": Gender || '',
                "VisitReason": VisitReason || '',
            }
            USPrintService.GenerateSuperBillPrint(obj);
        }

        $scope.OnSelectClaimResp = function (item) {
            if ([2, 3].includes(item.ResponcibilityId) && !$scope.IsInsuranceAvailable) {
                item.ResponcibilityId = 0;
                alertify.error("There is no insurance available");
            }
        }
        $scope.compareSuperBill = function (oldList, newList) {

            oldList = oldList || [];
            newList = newList|| [];

            let oldArr = [];
            let newArr = [];
            let pronames = "";
            let deletedCount = 0;


            function eyeName(id) {
                return id == 1 ? "OD" : id == 2 ? "OS" : id == 3 ? "OU" : id == 4 ? "General" : "";
            }

            function claimName(id) {
                return {
                    1: "Patient Office",
                    2: "Insurance-Professional",
                    3: "Insurance-Institutional",
                    4: "Worker comp",
                    5: "Others",
                    6: "Patient ASC"
                }[id] || "";
            }

            function getModifiers(arr) {
                if (!arr) return "";
                return arr
                    .filter(x => x.IsChecked)
                    .map(x => x.ModifierName)
                    .join(", ");
            }

            function getDiagnosis(arr) {
                if (!arr) return "";
                return arr
                    .filter(x => x.DeleteInd === "N")
                    .map(x => `${x.ICD10CODE} - ${x.DiagnosisName}`)
                    .join("\n");
            }

            function formatBlock(item) {

                let out = [];

               // out.push("Super Bill");
                out.push(`${item.CPTCode} - ${item.ProcedureName}`);
                if (item.OrganId)out.push(`EYE : ${eyeName(item.OrganId)}`);
                if (item.Quantity)out.push(`Units : ${item.Quantity}`);
                if (item.Modifiers.length>0)out.push(`Modifier : ${getModifiers(item.Modifiers)}`);
                if (item.ResponcibilityId)out.push(`Claim Responsibility : ${claimName(item.ResponcibilityId)}`);

                let diag = getDiagnosis(item.DiagnosisArray);
                if (diag) {
                    out.push("\nAdditional Diagnosis :");
                    out.push(diag);
                }

                return out.join("\n").trim();
            }

            function compareField(label, oldVal, newVal, oldF, newF) {
                if ((oldVal || "") !== (newVal || "")) {
                    if (oldVal) oldF.push(`${label} : ${oldVal}`);
                    if (newVal) newF.push(`${label} : ${newVal}`);
                }
            }

            oldList.forEach(o => {
                let exists = newList.find(n => n.SuperBillItemId == o.SuperBillItemId);
                if (!exists || exists.DeleteInd == "Y") {
                    if (deletedCount > 0) pronames += '\n ';
                    pronames += `${o.ProcedureCode} - ${o.ProcedureName}`;
                    deletedCount++;
                   // deletedArr.push(formatBlock(o));
                }
            });

            newList.forEach(n => {

                if (n.DeleteInd == "Y") return;

                let old = oldList.find(o => o.SuperBillItemId == n.SuperBillItemId);

                // ---------- ADDED ----------
                if (!old) {
                    newArr.push(formatBlock(n));
                    return;
                }

                // ---------- EDITED ----------
                let oldFields = [];
                let newFields = [];

                compareField("EYE", eyeName(old.OrganId), eyeName(n.OrganId), oldFields, newFields);
                compareField("Units", old.Quantity, n.Quantity, oldFields, newFields);
                compareField("Modifier", getModifiers(old.Modifiers), getModifiers(n.Modifiers), oldFields, newFields);
                compareField("Claim Responsibility",
                    claimName(old.ResponcibilityId),
                    claimName(n.ResponcibilityId),
                    oldFields, newFields
                );
                compareField("Additional Diagnosis",
                    getDiagnosis(old.DiagnosisArray),
                    getDiagnosis(n.DiagnosisArray),
                    oldFields, newFields
                );

                if (oldFields.length || newFields.length) {
                    let header = `${n.ProcedureCode} - ${n.ProcedureName}`;

                    oldArr.push(header + "\n" + oldFields.join("\n"));
                    newArr.push(header + "\n" + newFields.join("\n"));
                }
            });
            if (deletedCount > 0) {
                $scope.LogObj.LogArray.push({
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 58,
                    SubModuleName: "Super Bill",
                    ScreenType: "Super Bill",
                    ActionType: "Deleted",
                    OldActionDescription: pronames,
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                });
            }
            return {
                old: oldArr.join("\n\n").trim(),
                new: newArr.join("\n\n").trim(),
            };
        };

        $scope.SuperBillFinalObj.IsClickSaveSuperBillBtn = false;
        /* Asc Super Bill New Add Service */
        $scope.SaveAscSuperBill = function () {
            $scope.LogObj.LogArray = [];
            if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (mitem) {
                    mitem.Modifiers = $filter("filter")(mitem.Modifiers, { "IsChecked": true }, true);
                });
            } else {
                alertify.error("Please add super bill data.");
                return false;
            }
            $scope.SuperBillFinalObj.IsClickSaveSuperBillBtn = true;
            let reqObj = {
                "ConsultationID": 0,
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "SuperBillRemarks": $scope.SuperBillFinalObj.SuperBillRemarks || "",
                "DeleteInd": "N",
                "VisitId": $scope.cacheStorageItem.ConsultationID || 0,
                "EncounterStatus": $scope.SuperBillFinalObj.EncounterStatus || "NotSigned",
                "EncounterStatusId": $scope.SuperBillFinalObj.EncounterStatusId || 7,
                "SuperBillId": $scope.SuperBillFinalObj.SuperBillId || 0,
                "SuperBillArray": $scope.SuperBillFinalObj.SuperBillSuggestedCodes || [],
                "SuperBillDiagnosisArray": [],
                "Logs": {}
            }
            if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {

                let resultProc = $scope.compareSuperBill (
                    $scope.LogObj.SuperBillSuggestedCodes,      // OLD
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes     // NEW
                );

                let oldDesc = "";
                let newDesc = "";
                if ($scope.SuperBillFinalObj.SuperBillRemarks != $scope.LogObj.SuperBillRemarks) {
                    if ($scope.SuperBillFinalObj.SuperBillRemarks) resultProc.new += `\n Remarks : ${$scope.SuperBillFinalObj.SuperBillRemarks}`;
                    if ($scope.LogObj.SuperBillRemarks) resultProc.old += `\n Remarks : ${$scope.LogObj.SuperBillRemarks}`;
                }
                if ($scope.SuperBillFinalObj.EncounterStatus != $scope.LogObj.EncounterStatus) {
                    if ($scope.SuperBillFinalObj.EncounterStatus) resultProc.new += `\n EncounterStatus : ${$scope.SuperBillFinalObj.EncounterStatus}`;
                    if ($scope.LogObj.EncounterStatus) resultProc.old += `\n EncounterStatus : ${$scope.LogObj.EncounterStatus}`;
                }
                if (resultProc.old || resultProc.new) {

                    let header = "Super Bill\n";

                    if (resultProc.old) {
                        oldDesc += header + resultProc.old;
                    }
                    if (resultProc.new) {
                        newDesc += header + resultProc.new;
                    }
                }

                if (oldDesc || newDesc) {
                    $scope.LogObj.LogArray.push({
                        LogId: 0,
                        ModuleId: 1,
                        ModuleName: "OUTPatient",
                        SubModuleId: 58,
                        SubModuleName: "Super Bill",
                        ScreenType: "Super Bill",
                        ActionType: oldDesc ? "Edited" : "Added",
                        OldActionDescription: oldDesc.trim(),
                        NewActionDescription: newDesc.trim(),
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    });
                }
            }


            if ($scope.LogObj.LogArray.length > 0) {
                reqObj.Logs = $scope.LogObj || {};
            }

            eHnoteDiagnosisDataServices.AddUpdateSuperBillItemsForAsc(reqObj).then(function (resp) {
                if (resp.data.Status === 'Success') {
                    $scope.SuperBillFinalObj.SuperBillSuggestedCodes = angular.copy(resp.data.SuperBillArray) || [];
                    $scope.LogObj.SuperBillSuggestedCodes = angular.copy($scope.SuperBillFinalObj.SuperBillSuggestedCodes) || [];
                    //if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                    //    angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (kitem) {
                    //        var ModifiersArray = angular.copy($scope.Modifiers) || [];
                    //        if (kitem.Modifiers.length > 0) {
                    //            angular.forEach(kitem.Modifiers, function (item) {
                    //                var TempArray = $filter("filter")(ModifiersArray, { "MODIFIERID": item.MODIFIERID }, true) || [];
                    //                if (TempArray.length > 0) {
                    //                    TempArray[0].IsChecked = true;
                    //                }
                    //            });
                    //            kitem.Modifiers = angular.copy(ModifiersArray);
                    //        } else {
                    //            kitem.Modifiers = angular.copy(ModifiersArray);
                    //        }
                    //    });
                    //}
                    alertify.success("Saved Successfully");
                    $scope.SuperBillFinalObj.IsClickSaveSuperBillBtn = false;
                    $uibModalInstance.close($scope.SuperBillFinalObj);
                   
                }
            }, function (err) {
                $scope.SuperBillFinalObj.IsClickSaveSuperBillBtn = false;
                alertify.error("Fetching data failed!");

            });
        }

        $scope.GetOrganizationSuperBillSuggestedCodes = function () {
            var obj = {
                "OrganizationId": $scope.HospitalId
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


        $scope.cacheStorageItem.FullName = $scope.cacheStorageItem.PatientName || '';
        $scope.cacheStorageItem.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || '';

        $scope.patiendetilsopen = function () {
            let patientId = $scope.cacheStorageItem.PatientID || 0;
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var selectedPatientData = data;

                    $scope.PaitentDetails = {
                        "FullName": selectedPatientData.Patient[0].FullName || "",
                        "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
                        "MobileNo": selectedPatientData.Patient[0].MobileNo || 0,
                        "DOB": selectedPatientData.Patient[0].DOB || "",
                        "AgeInYears": selectedPatientData.Patient[0].AgeInYears || 0,
                        "AgeInMonths": selectedPatientData.Patient[0].AgeInMonths || 0,
                        "S3URL": selectedPatientData.Patient[0].S3URL || "",
                        "SocialSecurityNo": selectedPatientData.Patient[0].SocialSecurityNo || "",
                        "BloodGroupName": selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                        "MaritalStatusName": selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                        "ExternalComanagerName": selectedPatientData.Patient[0].ExternalComanagerName || '',
                        "InternalComanagerName": selectedPatientData.Patient[0].InternalComanagerName || '',
                        "PCPDoctorName": selectedPatientData.Patient[0].PCPDoctorName || '',
                        "RefferalName": selectedPatientData.Patient[0].ReferralName || '',
                        "ContactInfo": {
                            "EmailID": selectedPatientData.Patient[0].EmailId || "",
                        }
                    }

                    $scope.PostalAddressSummaryObj = {
                        "AddressId": selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                        "AddressLine1": selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                        "AddressLine2": selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                        "ZipCode": selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                        "CountyId": selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                        "CountyName": selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                        "CityName": selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                        "CityId": selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                        "StateName": selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                        "StateId": selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                        "CountryName": selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                        "CountryId": selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
                    }

                    $scope.PermanentAddressSummaryObj = {
                        "AddressId": selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                        "AddressLine1": selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                        "AddressLine2": selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                        "ZipCode": selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                        "CountyId": selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                        "CountyName": selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                        "CityName": selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                        "CityId": selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                        "StateName": selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                        "StateId": selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                        "CountryName": selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                        "CountryId": selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
                    }

                    $scope.PatientOfficeNumber = selectedPatientData.Patient[0].OfficeAreaCode + selectedPatientData.Patient[0].PatientOfficeNumber;
                    var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
                    $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

                    $scope.PatientMobileNumber = selectedPatientData.Patient[0].MobileNo;
                    var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
                    $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

                    $scope.DemographicSummaryObj = {
                        "LanguageName": selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                        "Proficiency": selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                        "SexualOrientation": selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                        "GenderIdentityStatus": selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
                    }

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        }

        $scope.resetDiagnosisOrder = function (Mitem) {
            Mitem.DiagnosisArray = angular.copy(Mitem.DiagnosisArrayOriginal);
            Mitem.DiagnosisReordered = false;
        }
        $scope.captureDiagnosisState = function (Mitem) {
            $scope.previousDiagnosisArray = angular.copy(Mitem.DiagnosisArray);
            Mitem.DiagnosisReordered = true;
        }
        $scope.undoDiagnosisReorder = function (Mitem) {
            if ($scope.previousDiagnosisArray.length > 0) {
                Mitem.DiagnosisArray = angular.copy($scope.previousDiagnosisArray);
            }
        };
        $scope.getActiveDiagnoses = function (item) {
            return item.DiagnosisArray.filter(d => d.DeleteInd === 'N');
        };
        $scope.RemoveDiagnosisById = function (mitem, item) {
            console.log(mitem);
            if (mitem.SuperbillItemDiagnosisId != 0) {
                mitem.DeleteInd = 'Y';
            }
            else {
                let index = item.DiagnosisArray.findIndex(kitem => kitem.DiagnosisId == mitem.DiagnosisId);
                if (index > -1) {
                    item.DiagnosisArray.splice(index, 1);
                }
            }
        }
        function GetSuggestedDiagnosisCodes() {
            console.log($scope.superBillMainObj.SuggestedDiagnosisCodes);
            if ($scope.cacheStorageItem.AssessmentPlan.length > 0) {
                $scope.cacheStorageItem.AssessmentPlan.forEach(item => {
                    item.DiagnosisName = item.DiagnosisName || '';
                    if (item.DiagnosisName == '') {
                        item.DiagnosisName = item.ICD10DIAGNAME || '';
                    }
                    let pusobj = {
                        "DiagnosisId": item.DiagnosisId || 0,
                        "DiagnosisName": item.DiagnosisName || "",
                        "FullName": item.DiagnosisName || "",
                        "DiagnosisNotes": "",
                        "HospitalId": $scope.HospitalID,
                        "UserId": null,
                        "DiagnosisCode": item.ICD10CODE,
                        "ICD10CODE": item.ICD10CODE,
                        "OrganizationDiagnosisId": 0,
                        "OrganId": null,
                        "SeverityId": null,
                        "ParentDiagnosisId": 0,
                        "DiagnosisStatus1": item.DiagnosisStatus1 || '',
                        "DiagnosisStatus2": item.DiagnosisStatus2 || '',
                        "DiagnosisStatusId1": item.DiagnosisStatusId1 || 0,
                        "DiagnosisStatusId2": item.DiagnosisStatusId2 || 0,
                        "_group": "Active Diagnosis"
                    }
                    $scope.superBillMainObj.SuggestedDiagnosisCodes.push(pusobj);
                });
            }
        }
        function CheckUncheckSuggestedCodes() {
            if ($scope.superBillMainObj.SuggestedSurgeryCodesArray.length > 0 && $scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                let ProcedureIdsList = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.filter(item => item.DeleteInd === 'N').map(item => item.ProcedureId);
                $scope.superBillMainObj.SuggestedSurgeryCodesArray.forEach(Procedureitem => {
                    if (ProcedureIdsList.includes(Procedureitem.ProcedureId)) {
                        Procedureitem.IsChecked = true;
                    }
                });
            }
            if ($scope.superBillMainObj.AdvisedSurgeryCodesArray.length > 0 && $scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                let ProcedureIdsList = $scope.SuperBillFinalObj.SuperBillSuggestedCodes.filter(item => item.DeleteInd === 'N').map(item => item.ProcedureId);
                $scope.superBillMainObj.AdvisedSurgeryCodesArray.forEach(Procedureitem => {
                    if (ProcedureIdsList.includes(Procedureitem.ProcedureId)) {
                        Procedureitem.IsChecked = true;
                    }
                });
            }
        }
        // Super Bill Init Function 
        $scope.init = function () {

            $scope.AddDiagnosisAssesmentPlanArray = [];
            $scope.SuperBillDiagnosisArray = [];

            var request1 = {
                "OrganizationId": $scope.HospitalId,
                "CategoryId": 0,
                "TypeId": 0
            };
            var objasses = {
                "PatientId": $scope.appointmentInfo.PatientID
            }
            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
            };
            $q.all([
                eHnoteSurgeryService.GetOrganizationSuperBillTemplatesData(request1),
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                eHnoteSettingsDataService.GetConsultationDetailsByPatientId(objasses.PatientId),
                eHnoteDiagnosisDataServices.GetSuperBillDetailsByAppointmentId(params.AppointmentId, $scope.cacheStorageItem.ConsultationID),
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {

                    resp[0].data.rows = resp[0].data.rows || [];
                    $scope.suggestedSuperBillTemplatesArray.AllTemplates = angular.copy(resp[0].data.rows) || [];

                    var stemplates = $filter("filter")($scope.suggestedSuperBillTemplatesArray.AllTemplates, function (kitem) { return kitem.TypeId == 1 }, true);
                    if (stemplates.length > 0) {
                        $scope.suggestedSuperBillTemplatesArray.Surgery = stemplates || [];
                    }


                    var atemplates = $filter("filter")($scope.suggestedSuperBillTemplatesArray.AllTemplates, function (kitem) { return kitem.TypeId == 2 }, true);
                    if (atemplates.length > 0) {
                        $scope.suggestedSuperBillTemplatesArray.AnesthesiaTemplateData = atemplates[0].CPTCodesList || [];
                    }
                    var ctemplates = $filter("filter")($scope.suggestedSuperBillTemplatesArray.AllTemplates, function (kitem) { return kitem.TypeId == 3 }, true);
                    if (ctemplates.length > 0) {
                        $scope.suggestedSuperBillTemplatesArray.ConsultationTemplateData = ctemplates[0].CPTCodesList || [];
                    }


                    angular.forEach($scope.suggestedSuperBillTemplatesArray.AnesthesiaTemplateData, function (aitem) {

                        aitem.IsChecked = false;

                        if (aitem.DiagnosisArray.length > 0) {
                            angular.forEach(aitem.DiagnosisArray, function (jitem) {
                                jitem.IsChecked = false;
                            });
                        }


                        var SuggestedCodeObj = getnewSuggestedCodeObj();
                        SuggestedCodeObj.SuperBillItemId = 0;
                        SuggestedCodeObj.OrganizationProcedureId = aitem.OrganizationProcedureId;
                        SuggestedCodeObj.ProcedureId = aitem.ProcedureId;
                        SuggestedCodeObj.OrganizationId = $scope.HospitalId;
                        SuggestedCodeObj.UserId = $scope.UserId;
                        SuggestedCodeObj.TypeOfServiceId = aitem.TypeOfServiceId;
                        SuggestedCodeObj.Cost = aitem.GeneralCost;
                        SuggestedCodeObj.ProcedureCode = aitem.ProcedureCode;
                        SuggestedCodeObj.CPTCode = aitem.CPTCode;
                        SuggestedCodeObj.ProcedureName = aitem.ProcedureName;
                        SuggestedCodeObj.OrganName = aitem.OrganName;
                        SuggestedCodeObj.CPTCodeProcedureName = aitem.CPTCodeProcedureName || "";
                        SuggestedCodeObj.ProcedureDescription = aitem.ProcedureDescription;
                        SuggestedCodeObj.OrganizationName = aitem.OrganizationName || "";
                        SuggestedCodeObj.BillingHistoryId = 0;
                        SuggestedCodeObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
                        SuggestedCodeObj.IsBillingSelected = true;
                        SuggestedCodeObj.IsBillingDone = false;
                        SuggestedCodeObj.ShowDiagForAdd = false;
                        SuggestedCodeObj.Quantity = 1;
                        SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
                        SuggestedCodeObj.DeleteInd = 'N';
                        SuggestedCodeObj.IsChecked = false;
                        SuggestedCodeObj.OrganId = aitem.OrganId || null;

                        $scope.superBillMainObj.SuggestedAnesthesiaCodes.push(SuggestedCodeObj);

                    });
                    console.log($scope.superBillMainObj.SuggestedAnesthesiaCodes);
                    console.log("SuggestedAnesthesiaCodes");
                    angular.forEach($scope.suggestedSuperBillTemplatesArray.ConsultationTemplateData, function (aitem) {

                        aitem.IsChecked = false;

                        if (aitem.DiagnosisArray.length > 0) {
                            angular.forEach(aitem.DiagnosisArray, function (jitem) {
                                jitem.IsChecked = false;
                            });
                        }


                        var SuggestedCodeObj = getnewSuggestedCodeObj();
                        SuggestedCodeObj.SuperBillItemId = 0;
                        SuggestedCodeObj.OrganizationProcedureId = aitem.OrganizationProcedureId;
                        SuggestedCodeObj.ProcedureId = aitem.ProcedureId;
                        SuggestedCodeObj.OrganizationId = $scope.HospitalId;
                        SuggestedCodeObj.UserId = $scope.UserId;
                        SuggestedCodeObj.TypeOfServiceId = aitem.TypeOfServiceId;
                        SuggestedCodeObj.Cost = aitem.GeneralCost;
                        SuggestedCodeObj.ProcedureCode = aitem.ProcedureCode;
                        SuggestedCodeObj.CPTCode = aitem.CPTCode;
                        SuggestedCodeObj.ProcedureName = aitem.ProcedureName;
                        SuggestedCodeObj.OrganName = aitem.OrganName;
                        SuggestedCodeObj.CPTCodeProcedureName = aitem.CPTCodeProcedureName || "";
                        SuggestedCodeObj.ProcedureDescription = aitem.ProcedureDescription;
                        SuggestedCodeObj.OrganizationName = aitem.OrganizationName || "";
                        SuggestedCodeObj.BillingHistoryId = 0;
                        SuggestedCodeObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
                        SuggestedCodeObj.IsBillingSelected = true;
                        SuggestedCodeObj.IsBillingDone = false;
                        SuggestedCodeObj.ShowDiagForAdd = false;
                        SuggestedCodeObj.Quantity = 1;
                        SuggestedCodeObj.Modifiers = angular.copy($scope.Modifiers);
                        SuggestedCodeObj.DeleteInd = 'N';
                        SuggestedCodeObj.IsChecked = false;
                        SuggestedCodeObj.OrganId = aitem.OrganId || null;

                        $scope.superBillMainObj.SuggestedConsultationCodes.push(SuggestedCodeObj);

                    })
                    console.log($scope.superBillMainObj.SuggestedConsultationCodes);
                }
                if (resp[1].data.status === "Success") {
                    $scope.ClaimResponcibilities = resp[1].data.MasterClaimResponsibility || [];
                    $scope.Modifiers = resp[1].data.Modifiers || [];
                    if ($scope.Modifiers.length > 0) {
                        angular.forEach($scope.Modifiers, function (kitem) {
                            kitem.IsChecked = false;
                        });

                    }
                }
                if (resp[2].data[0].Status === "Success") {

                    console.log(resp[2].data[0].AssessmentPlan)
                    resp[2].data[0].AssessmentPlan = resp[2].data[0].AssessmentPlan || [];
                    if (resp[2].data[0].AssessmentPlan.length == 0) {
                        $scope.AddDiagnosisAssesmentPlanArray = angular.copy(resp[2].data[0].AssessmentPlan || []);
                    }
                }
                if (resp[3].data.Status == "Success") {
                    if (resp[3].data.rows.length > 0) {
                        let SuperBillArray = resp[3].data.rows[0].SuperBillArray || [];
                        $scope.SuperBillFinalObj.SuperBillSuggestedCodes = SuperBillArray.filter(item => item.DeleteInd != 'Y');
                        $scope.SuperBillDiagnosisArray = resp[3].data.rows[0].SuperbillDiagnosis || [];
                        $scope.SuperBillFinalObj.SuperBillRemarks = resp[3].data.rows[0].SuperBillRemarks || "";
                        $scope.LogObj.SuperBillRemarks = $scope.SuperBillFinalObj.SuperBillRemarks || "";
                        $scope.SuperBillFinalObj.SuperBillId = resp[3].data.rows[0].SuperbillId || 0;
                        $scope.SuperBillFinalObj.EncounterStatusId = resp[3].data.rows[0].EncounterStatusId || 7;
                        $scope.SuperBillFinalObj.EncounterStatus = resp[3].data.rows[0].EncounterStatus || "NotSigned";
                        $scope.LogObj.EncounterStatus = $scope.SuperBillFinalObj.EncounterStatus||"";
                        if ($scope.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                            angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (kitem, index) {
                                if (kitem.SuperBillItemId && kitem.SuperBillItemId > 0) {
                                    kitem.UniqueKey = kitem.SuperBillItemId; // from DB
                                } else {
                                    kitem.UniqueKey = 'TMP_' + Date.now() + '_' + Math.random(); // new unsaved
                                }
                                kitem.SortOrder = index + 1;
                                kitem.OrganId = kitem.OrganId || '';
                                kitem.OrganId = kitem.OrganId.toString() || '';
                                var ModifiersArray = angular.copy($scope.Modifiers) || [];
                                if (kitem.Modifiers.length > 0) {
                                    angular.forEach(kitem.Modifiers, function (item) {
                                        var TempArray = $filter("filter")(ModifiersArray, { "MODIFIERID": item.MODIFIERID }, true) || [];
                                        if (TempArray.length > 0) {
                                            TempArray[0].IsChecked = true;
                                        }
                                    });
                                    kitem.Modifiers = angular.copy(ModifiersArray);
                                } else {
                                    kitem.Modifiers = angular.copy(ModifiersArray);
                                }
                                kitem.DiagnosisArray.forEach((ditem, index) => { ditem.SortOrder = index + 1; });
                                // empty declaration assigning 
                                kitem.DiagnosisArrayOriginal = kitem.DiagnosisArray || [],
                                    //kitem.IsRcopiaa = $scope.ParentObject.IsScreenFrom == 'ASC' ? true : false,
                                    kitem.AddDiagnosisAssesmentPlanArray = $scope.AddDiagnosisAssesmentPlanArray || [];
                            });
                            $scope.LogObj.SuperBillSuggestedCodes = angular.copy($scope.SuperBillFinalObj.SuperBillSuggestedCodes) || [];
                        };
                        CheckUncheckSuggestedCodes();
                    }
                }
                $scope.initOrgLogo();
            });
            GetSuggestedDiagnosisCodes();
        }
        $scope.init();
        $scope.Historypopupnew = function (tab, type, from) {
            var HistoryTab = tab || 1;
            type = type || 2;
            from = from || "";
            let LogItem = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPATIENT",
                "SubModuleId": 58,
                "SubModuleName": "Super Bill",
                "ScreenType": "History",
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": "History From Super Bill",
            }
            $scope.AddAuditLogNew(LogItem);
            $scope.TonometrySubList = [];
            $scope.PreviousInvestigationIdArray = [];
            $scope.VisionObj = {};
            $scope.obj = {};
            $scope.cacheStorageItem.SuperBillFinalObj = {};
            $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = angular.copy($scope.SuperBillFinalObj.SuperBillSuggestedCodes);
            console.log($scope.cacheStorageItem)
            console.log($scope.SuperBillFinalObj.SuperBillSuggestedCodes)
            let mInstanceShow = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
                "controller": "HistorypopupnewCtrl",
                "backdrop": "static",
                /* "windowClass": "offcanves-right  ",*/
                "windowClass": "modal__popup--1 bottom-to-top-modal  ",
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
                    "type": function () { return type },
                    "Comingfrom": function () { return from },
                },

            });
            mInstanceShow.result.then(function (result) {
                $scope.SuperBillObj = angular.copy(result.SuperBillObj);
                $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = angular.copy($scope.SuperBillObj.SuperBillSuggestedCodes);
                $scope.SuperBillObject.Remarks = $scope.SuperBillObj.SuperBillRemarks || "";
                $scope.SuperBillFinalObj.Remarks = $scope.SuperBillObj.SuperBillRemarks || "";
                $scope.SuperBillFinalObj.SuperBillSuggestedCodes = $scope.SuperBillObj.SuperBillSuggestedCodes || [];
                if ($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes.length > 0) {
                    angular.forEach($scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                        if (item.DeleteInd == 'N') {
                            item.OrganId = item.OrganId.toString();
                            item.AssessmentPlan = angular.copy($scope.AddDiagnosisAssesmentPlanArray) || [];
                        }
                    });
                    angular.forEach($scope.SuperBillFinalObj.SuperBillSuggestedCodes, function (item) {
                        if (!item.UniqueKey) {
                            item.UniqueKey = item.SuperBillItemId && item.SuperBillItemId > 0
                                ? item.SuperBillItemId
                                : 'TMP_' + Date.now() + '_' + Math.random();
                        }
                    });
                }

            }, function (cancel) {
            });
        }
        $scope.reportDate = new Date().toLocaleDateString();
        $scope.activeDropdownValue = null;
        $scope.toggled = function (open, pitem) {
            if (open) {
                $scope.activeDropdownValue = pitem;
                pitem.DiagnosisArray = angular.copy(pitem.DiagnosisArray) || [];
                const filteredCodes = $scope.superBillMainObj.SuggestedDiagnosisCodes.filter(item =>
                    item.DiagnosisStatusId1 == 2 || item.DiagnosisStatusId2 == 2
                );
                if (pitem.DiagnosisArray.length > 0) {
                    const DiagnosisIds = pitem.DiagnosisArray.filter(x => x.DeleteInd === 'N').map(x => x.DiagnosisId);
                    // const DiagnosisIds = pitem.DiagnosisArray.map(x => x.DiagnosisId && x.DeleteInd=='N');
                    $scope.superBillMainObj.SuggestedDiagnosisCodes = angular.copy(
                        filteredCodes.map(item => ({
                            ...item,
                            IsCheckedDiagnosis: DiagnosisIds.includes(item.DiagnosisId)
                        }))
                    );
                } else {
                    $scope.superBillMainObj.SuggestedDiagnosisCodes = angular.copy(
                        filteredCodes.map(item => ({
                            ...item,
                            IsCheckedDiagnosis: false
                        }))
                    );
                }
                console.log('Dropdown opened!', pitem);
            } else {
                //console.log($scope.SuperBillFinalObj.SuperBillSuggestedCodes)
                //console.log($scope.superBillMainObj.SuggestedDiagnosisCodes)
                console.log('Dropdown closed!', pitem);
                if ($scope.activeDropdownValue === pitem) {
                    $scope.superBillMainObj.SuggestedDiagnosisCodes.forEach(ditem => {
                        ditem.IsCheckedDiagnosis = false;
                    });
                    $scope.activeDropdownValue = null;
                }
            }
        };



    }]);
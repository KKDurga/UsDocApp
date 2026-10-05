
"use strict";
eHnoteWebApp.controller("USDischargeSummaryPopUpCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteDbStaticDataService", "eHnoteSettingsDataService", "eHnoteConditionsDataService", "eHnotePatientDataService", "eHnoteDiagnosisDataServices", "$uibModal", "DischargeSummaryObj", "eHnoteSurgeryService","PostOpDiagnosis",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteDbStaticDataService, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnotePatientDataService, eHnoteDiagnosisDataServices, $uibModal, DischargeSummaryObj, eHnoteSurgeryService, PostOpDiagnosis) {


        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

        $scope.DischargePostOpDiagnosis = [];
        $scope.DischargePostOpDiagnosis = angular.copy(PostOpDiagnosis);
      

        $scope.DischargeSummaryObj = angular.copy(DischargeSummaryObj);
        $scope.DischargeSummaryObj.DischargeMedicationInstructions = $scope.DischargeSummaryObj.DischargeMedicationInstructions || "";
        $scope.DischargeSummaryObj.FollowUpInstructions = $scope.DischargeSummaryObj.FollowUpInstructions || "";
        $scope.DischargeSummaryObj.PostOpInstruction = $scope.DischargeSummaryObj.PostOpInstruction || "";
        $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplates = $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplates || [];

        $scope.DischargeSummaryObj.FollowUpDate1 = $filter('date')($scope.DischargeSummaryObj.FollowUpDate1,"MM-dd-yyyy") || "";
        $scope.DischargeSummaryObj.FollowUpDate2 = $filter('date')($scope.DischargeSummaryObj.FollowUpDate2, "MM-dd-yyyy") || "";
        $scope.DischargeSummaryObj.FollowUpDate3 = $filter('date')($scope.DischargeSummaryObj.FollowUpDate3, "MM-dd-yyyy") || "";

        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        };

        $scope.Surgeryobj = {
            'MedicineObject': '',
            'CurrentMedicationobj': '',
            'SubType': 'PreSurgery',
            'PreMedicationslist': [],
            'CurrentMedicationslist': [],
            'Investigationslist': [],
            'EnterPreSurgeryTemplateName': "",
            'SelectedPreSurgeryTemplateName': "",
        };

        $scope.DischargeSummaryObj.Medications = $scope.DischargeSummaryObj.Medications || [];
        $scope.Surgeryobj.CurrentMedicationslist = angular.copy($scope.DischargeSummaryObj.Medications);

        if ($scope.Surgeryobj.CurrentMedicationslist.length > 0) {
            angular.forEach($scope.Surgeryobj.CurrentMedicationslist, function (Aitem) {
                Aitem.SigfieldsShows = true;
                Aitem.SigSearchShows = false;
            });

        }

        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
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
       

        $scope.PushfreqMedicalItems = function (item) {
            item.SigfieldsShows = false;
            item.SigSearchShows = false;
            var obj = {
                "ProcedureMedicationId": 0,
                "HospitalId": item.OrganizationId,
                "MedicineId": item.MedicineId,
                "MedicineType": item.MedicineType,
                "MedicineTypeId": item.MedicineTypeId,
                "MedicineName": item.MedicineName,
                "MedicationType": "",
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
                "DrugSchedule": "",
                "DrugSupply": "",
                "DrugCompound": "",
                "MedicationTypeId": "",
                "MedicationTypeName": "",
                "Sig": "",
                "SigId": 0,
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
                "SubstitutionPermitted": "n",
                "PatientInstructions": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": '',
                "StopDate": null,
                "FillDate": '',
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEdit": true,
                "ShowNote": false,

            };

            var i = 0;
            if ($scope.Surgeryobj.CurrentMedicationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.CurrentMedicationslist, function (Aitem) {
                    if (Aitem.MedicineId === item.MedicineId && Aitem.DeleteInd == 'N') {
                        alertify.error('Medicine Already Added To The List!');
                        i++;
                    }
                });
            }
            if (i === 0) {
                $scope.Surgeryobj.CurrentMedicationslist.push(obj);
                $scope.Surgeryobj.CurrentMedicationobj = "";
            }

        }

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

        $scope.GetUserMedicationTemplates = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 1000,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
            }
            eHnotePatientDataService.GetUserPreSurgeryTemplateByCoordinator(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.UserMedicationTemplatesArray = resp.data.rows || [];
                }

            }, function (err) {

            });
        };

        $scope.init = function () {
           
            $scope.getMasterFieldDosageData();
            $scope.GetUserMedicationTemplates();
        };

        $scope.init();

        $scope.ClearMedication = function (item) {

            item.PostOpSurgeonMedicationId = item.PostOpSurgeonMedicationId || null;
            if (item.PostOpSurgeonMedicationId != null) {
                item.DeleteInd = 'Y';
            }
            else {
                let index = $scope.Surgeryobj.CurrentMedicationslist.indexOf(item);
                if (index > -1) {
                    $scope.Surgeryobj.CurrentMedicationslist.splice(index, 1);
                }
            }
               
         
        };

        $scope.ShowDischargeMedInstructionBtn = function () {
            $scope.DischargeSummaryObj.ShowTemplateSaveBtn = true;
        };

        $scope.CloseInstructionTemplateBtn = function () {
            $scope.DischargeSummaryObj.TemplateName = "";
            $scope.DischargeSummaryObj.ShowTemplateSaveBtn = false;
        };

        $scope.GetDischargeMedicationInstructionTemplatesList = function () {
            let req1 = {
                "UserId": $scope.UserId
            };

            eHnoteSurgeryService.GetDischargeMedicationInstructionTemplatesList(req1).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.DischargeSummaryObj.DischargeMedicationInstructionTemplates = angular.copy(resp.data.rows);
                }

            }, function () {

            });
        };

        $scope.AddDischargeMedicationInstructionTemplate = function () {
            $scope.DischargeSummaryObj.TemplateName = $scope.DischargeSummaryObj.TemplateName || "";
            if ($scope.DischargeSummaryObj.TemplateName == "") {
                alertify.error("Please enter template name!");
                return;
            }

            let templateReq = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientASCPostOPId": $scope.DischargeSummaryObj.PatientASCPostOPId,
                "TemplateId": 0,
                "DischargeMedicationInstruction": $scope.DischargeSummaryObj.DischargeMedicationInstructions,
                "TemplateName": $scope.DischargeSummaryObj.TemplateName,
                "DeleteInd": "N",
            };
            eHnoteSurgeryService.AddUpdateDischargeMedicationInstructionTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetDischargeMedicationInstructionTemplatesList();
                    $scope.DischargeSummaryObj.TemplateName = "";
                    $scope.DischargeSummaryObj.ShowTemplateSaveBtn = false;
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message)
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.OnSelectTemplatelist = function (array) {
            let temparray = $filter('filter')(array, { 'PostOpInstructionTemplateId': $scope.DischargeSummaryObj.PostOpInstructionTemplateId }, true);
            temparray = temparray || [];
            if (temparray.length > 0) {
                $scope.DischargeSummaryObj.PostOpInstruction = temparray[0].PostOpInstruction;
            } else {
                $scope.DischargeSummaryObj.PostOpInstruction = "";
            }
        };

        $scope.SaveDischargeSummary = function () {

            let req = {
                "PatientDischargeSummaryId": 0,
                "PatientId": $scope.DischargeSummaryObj.PatientId || null,
                "AppointmentId": $scope.DischargeSummaryObj.AppointmentId || null,
                "MedicationList": $scope.Surgeryobj.CurrentMedicationslist || [],
                "DischargeMedicationInstructions": $scope.DischargeSummaryObj.DischargeMedicationInstructions || "",
                "PostOpInstructions": $scope.DischargeSummaryObj.PostOpInstruction || "",
                "FollowUpDate1": $scope.DischargeSummaryObj.FollowUpDate1 || "",
                "FollowUpDate2": $scope.DischargeSummaryObj.FollowUpDate2 || "",
                "FollowUpDate3": $scope.DischargeSummaryObj.FollowUpDate3 || "",
                "FollowUpInstructions": $scope.DischargeSummaryObj.FollowUpInstructions || ""
            };

            //console.log(req);
            //return;

            eHnoteSurgeryService.AddUpdateDischargeSummaryDetails(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Data Successfully submitted!");
                    $uibModalInstance.close();
                }

            }, function () {

            });


        };


        $scope.SaveDischargeMedicationTemplate = function () {
            if ($scope.DischargeSummaryObj.DischargeMedicationTemplateName === "") {
                alertify.error("Please Enter Template Name");
                return false;
            }
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "DeleteInd": "N",
                "TemplateId": 0,
                "TemplateName": $scope.DischargeSummaryObj.DischargeMedicationTemplateName,
                "PreMedicationslist": $scope.Surgeryobj.CurrentMedicationslist || [],
            }

            eHnotePatientDataService.AddUpdateUserPreSurgeryTemplateByCoordinator(params).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Saved successfully");
                    $scope.DischargeSummaryObj.DischargeMedicationTemplateName = '';
                    $scope.GetUserMedicationTemplates();
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        };

        $scope.getOrganizationMedicationSigitems = function (text) {
            text = text || '';
            let params = {
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
       

        $scope.ONSigDetails = function (item, mainitem) {
            console.log(item);
            console.log(mainitem);
            mainitem.SigfieldsShows = true;
          
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
           
            $scope.SigObject = '';
        };

        $scope.ONSigDetailsAll = function (item, mainitem) {
            console.log(item);
            console.log(mainitem);
            mainitem.SigfieldsShows = true;
          
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
            $scope.MedicineObject = '';
        };


        $scope.addnewOrganizationSig = function (item) {

            var Obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "doseArray": $scope.DoseArray,
                "actionArray": $scope.ActionArray,
                "refillsArray": $scope.RefillsArray,
                "doseOtherArray": $scope.DoseOtherArray,
                "frequencyArray": $scope.FrequencyArray,
                "durationArray": $scope.DurationArray,
                "routeArray": $scope.RouteArray,
                "doseUnitArray": $scope.DoseUnitArray,
                "quantityUnitArray": $scope.QuantityUnitArray,
                "MedicineId": item.MedicineId
            }
            var modalInstance = $uibModal.open({
                "templateUrl": "templates/uibpopups/AddMedicationSigPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "windowClass": "modal__eighty--",
                "keyboard": false,
                //"size": "lg",
                "resolve": {
                    "ParentObject": Obj
                },
                "controller": function ($scope, $uibModalInstance, eHnoteSettingsDataService, eHnotePatientDataService, ParentObject, alertify) {

                    console.log(ParentObject);


                    $scope.doseArray = ParentObject.doseArray || [];
                    $scope.doseOtherArray = ParentObject.doseOtherArray || [];
                    $scope.frequencyArray = ParentObject.frequencyArray || [];
                    $scope.refillsArray = ParentObject.refillsArray || [];
                    $scope.durationArray = ParentObject.durationArray || [];
                    $scope.actionArray = ParentObject.actionArray || [];
                    $scope.routeArray = ParentObject.routeArray || [];
                    $scope.doseUnitArray = ParentObject.doseUnitArray || [];
                    $scope.quantityUnitArray = ParentObject.quantityUnitArray || [];


                    $scope.closeSigPopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };


                    function getnewOrganizationSigObj() {
                        var obj = {
                            "UserId": $scope.UserId,
                            "OrganizationSigTemplateId": 0,
                            "OrganizationId": ParentObject.HospitalId,
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
                            "MedicineId": item.MedicineId
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
                            mainobj.Frequency = filteredArray[0].Description;
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
                            mainobj.Refill = filteredArray[0].Code;
                        };
                    };
                    //$scope.changeIsfrequent = function (obj) {
                    //    $scope.addNewOrganizationSigObj.IsFrequent = obj.IsFrequent ? "Y" : "N";
                    //};


                    $scope.SaveOrganizationSig = function () {
                        console.log($scope.addNewOrganizationSigObj);
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
                            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();

                            //    $uibModalInstance.close('save');
                            $scope.savedSigs.push($scope.addNewOrganizationSigObj);
                            $scope.toggleAddSigFields();
                            $scope.getOrganizationMedicationSig();


                        }
                        function OnAddSigError() {
                            alertify.error("Creating  Failed");
                        }
                    };

                    $scope.clearOrganizationSiginput = function () {
                        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
                    };


                    $scope.DeleteSig = function (item) {
                        item = item || "";
                        item.DeleteInd = "Y";

                        var obj = {
                            "OrganizationSigTemplateId": item.OrganizationSigTemplateId || 0,
                            "OrganizationId": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "Sig": item.Sig,
                            "ActionId": item.ActionId,
                            "Action": item.Action,
                            "DoseId": item.DoseId,
                            "Dose": item.Dose,
                            "DoseUnitId": item.DoseUnitId,
                            "DoseUnit": item.DoseUnit,
                            "RouteId": item.RouteId,
                            "Route": item.Route,
                            "FrequencyId": item.FrequencyId,
                            "Frequency": item.Frequency,
                            "DoseOtherId": item.DoseOtherId,
                            "DoseOther": item.DoseOther,
                            "DaysSupplyId": item.DaysSupplyId,
                            "DaysSupply": item.DaysSupply,
                            "Quantity": item.Quantity,
                            "QuantityUnitId": item.QuantityUnitId,
                            "QuantityUnit": item.QuantityUnit,
                            "RefillId": item.RefillId,
                            "Refills": item.Refills,
                            "DeleteInd": "Y",
                            "IsFrequent": item.IsFrequent,
                            "MedicineId": item.MedicineId


                        }
                        /*   $scope.GetOrganizationMedicationSigArrayList = $scope.GetOrganizationMedicationSigArrayList || [];*/
                        /* $scope.addNewOrganizationSigObj.push(obj);*/

                        eHnotePatientDataService.AddUpdateOrganizationMedicationSig(obj, OnAddSigSuccess, OnAddSigError);
                        function OnAddSigSuccess(response) {
                            alertify.success("Sig Deleted  Successfully");
                            $scope.getOrganizationMedicationSig();
                        }
                        function OnAddSigError() {
                            alertify.error("Deletion  Failed");
                        }
                    };

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
                                $scope.GetOrganizationMedicationSigArrayList = [];
                                $scope.GetOrganizationMedicationSigArrayList = resp.data.rows;
                            }
                            else if (resp.data.Status == "Failure") {
                                alertify.error("Data Updating Failed");
                            }
                            //if (resp.data.rows.length  > 0) {

                            //}
                        });
                    };
                    $scope.getOrganizationMedicationSig();
                    $scope.clearSigPopup = function () {
                        $uibModalInstance.close('clear');
                    };

                }

            });
            $scope.showAddSigFields = false;
            $scope.showAddSigButton = true;
            $scope.savedSigs = [];

            $scope.toggleAddSigFields = function () {
                $scope.showAddSigFields = !$scope.showAddSigFields;

                $scope.showAddSigButton = !$scope.showAddSigButton;
            };
            modalInstance.result.then(function (result) {
                console.log(result);


            }, function (cancel) {
            });

        };

        $scope.OnSelectDischargeMedicationTemplate = function (item) {

            item = item || '';
            if (item.PreMedicationslistArray.length > 0) {
                angular.forEach(item.PreMedicationslistArray, function (Citem) {
                    Citem.SigfieldsShows = true;
                });
            }
            $scope.SelectedDischargeMedications = [];
            if (item != '') {
                $scope.SelectedDischargeMedications = angular.copy(item.PreMedicationslistArray) || [];
            }

            if ($scope.Surgeryobj.CurrentMedicationslist.length == 0) {
                $scope.Surgeryobj.CurrentMedicationslist = $scope.SelectedDischargeMedications || [];
            } else {
                if ($scope.SelectedDischargeMedications.length !== 0) {
                    angular.forEach($scope.SelectedDischargeMedications, function (Citem) {
                        var List = $filter("filter")($scope.Surgeryobj.CurrentMedicationslist, function (Aitem, index) { return Aitem.MedicineId == Citem.MedicineId },);
                        if (List.length == 0) {
                            $scope.Surgeryobj.CurrentMedicationslist.push(Citem);
                        }
                    });

                }
            }
        };

        $scope.OnSelectMedicationInstructionTemplate = function (item) {
            if (item != null) {
                $scope.DischargeSummaryObj.DischargeMedicationInstructions = item.DischargeMedicationInstruction || "";
            } else {
                $scope.DischargeSummaryObj.DischargeMedicationInstructions = "";
            }
           
        };

        $scope.ChangeType = function (item, mainobj, type) {
            if (type == 'Action') {
                var filteredArray = $filter("filter")($scope.ActionArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.Action = filteredArray[0].Code;
                };
            }
            if (type == 'Dose') {
                var filteredArray = $filter("filter")($scope.DoseArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.Dose = filteredArray[0].Code;
                };
            }
            if (type == 'DoseUnit') {
                var filteredArray = $filter("filter")($scope.DoseUnitArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.DoseUnit = filteredArray[0].Code;
                };
            }
            if (type == 'Route') {
                var filteredArray = $filter("filter")($scope.RouteArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.Route = filteredArray[0].Code;
                };
            }
            if (type == 'DoseTiming') {
                var filteredArray = $filter("filter")($scope.FrequencyArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.Frequency = filteredArray[0].Code;
                };
            }
            if (type == 'Other') {
                var filteredArray = $filter("filter")($scope.DoseOtherArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.DoseOther = filteredArray[0].Code;
                };
            }
            if (type == 'Duration') {
                var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.DaysSupply = filteredArray[0].Code;
                };
            }
            if (type == 'Unit') {
                var filteredArray = $filter("filter")($scope.QuantityUnitArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.QuantityUnit = filteredArray[0].Code;
                };
            }
            if (type == 'Unit') {
                var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.QuantityUnit = filteredArray[0].Code;
                };
            }
            if (type == 'Refill') {
                var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": item }, true);
                if (filteredArray.length > 0) {
                    mainobj.Refills = filteredArray[0].Code;
                };
            }
        };

        $scope.GetAscPostOpinstructionTemplatesList = function () {
            let gettemplateReq = {
                "UserId": $scope.UserId,
            };
            eHnoteSurgeryService.GetAscPostOpinstructionTemplatesList(gettemplateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.DischargeSummaryObj.AscPostOpInstructionTemplateList = [];
                    $scope.DischargeSummaryObj.AscPostOpInstructionTemplateList = angular.copy(resp.data.rows);
                    $scope.DischargeSummaryObj.PostOpInstruction = "";
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message)
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.SaveDischargePostOpInstructionTemplate = function () {

            if ($scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName == "") {
                alertify.error("Please enter template name!");
                return;
            }

            let templateReq = {
                "UserId": $scope.UserId,
                "PostOpInstructionTemplateId": 0,
                "PostOpInstruction": $scope.DischargeSummaryObj.PostOpInstruction,
                "TemplateName": $scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName,
                "DeleteInd": "N",
            };
            eHnoteSurgeryService.AddUpdateAscPostOpInstructionTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.DischargeSummaryObj.DischargePostOpInstructionTemplateName = "";
                    $scope.DischargeSummaryObj.PostOpInstructionTemplateId = null;
                    $scope.GetAscPostOpinstructionTemplatesList();
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message)
                }
            }, function (err) {
                console.log(err);
            });

        };
        $scope.ShowSigFields = function (item) {
            item.SigfieldsShows = !item.SigfieldsShows;
        }
        $scope.ShowSigSearch = function (item) {
            item.SigSearchShows = !item.SigSearchShows;
        }
     

    }]);

"use strict";
eHnoteWebApp.controller("UScoordinationviewpopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteDbStaticDataService", "eHnoteSettingsDataService", "eHnoteConditionsDataService", "eHnotePatientDataService", "eHnoteDiagnosisDataServices", "cache", "Type", "ScreenType", "IsComingFrom", "$uibModal","eHnoteSurgeryService",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteDbStaticDataService, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnotePatientDataService, eHnoteDiagnosisDataServices, cache, Type, ScreenType, IsComingFrom, $uibModal, eHnoteSurgeryService) {


        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

        $scope.cache = cache || '';
        $scope.Type = Type || '';
        $scope.ScreenType = ScreenType || '';
        $scope.IsComingFrom = IsComingFrom || '';
        $scope.RoleId = $scope.cache.RoleId;
        if ( $scope.IsComingFrom == '') {
             $scope.IsComingFrom = 'Pre-Surgery Medication';
        }
       
        if ( $scope.IsComingFrom == 'PostOp') {
             $scope.IsComingFrom = 'Post Surgery Medications ';
        }
        if ($scope.IsComingFrom == 'IntraOp') {
            $scope.IsComingFrom = 'Intra-Op Medications Orders';
        }

        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        };
        
      
        $scope.Surgeryobj = {
            'MedicineObject':'',
            'CurrentMedicationobj':'',
            'SubType':'PreSurgery',
            'PreMedicationslist': [],
            'CurrentMedicationslist': [],
            'Investigationslist': [],
            'EnterPreSurgeryTemplateName': "",
            'SelectedPreSurgeryTemplateName': "",
            "PrescriptionDetails": ""
        }
     
        if ($scope.Type !='') {
            $scope.Surgeryobj.SubType =$scope.Type;
        }


        $scope.Medicationtemplateover = {
            templateUrl: 'MedicationTemplatSave.html',
        };

        $scope.Investigationtemplateover = {
            templateUrl: 'InvestigationTemplatSave.html',
        };



        if ($scope.cache.CurrentMedicationList.length>0) {
            $scope.Surgeryobj.CurrentMedicationslist = $scope.cache.CurrentMedicationList || [];
            angular.forEach($scope.Surgeryobj.CurrentMedicationslist, function (item) {
                item.SigfieldsShows = true;
                item.SigSearchShows = false;
                item.StartDate = $filter("date")(item.StartDate, "MM-dd-yyyy");
                item.StopDate = $filter("date")(item.StopDate, "MM-dd-yyyy");
            });
           
        }
        if ($scope.cache.MedicationsList.length > 0) {
            $scope.Surgeryobj.PreMedicationslist = $scope.cache.MedicationsList || [];
            angular.forEach($scope.Surgeryobj.PreMedicationslist, function (item) {
                item.SigfieldsShows = true;
                item.SigSearchShows = false;
            });
        }
        if ($scope.cache.InvestigationsList.length > 0) {
            $scope.Surgeryobj.Investigationslist = $scope.cache.InvestigationsList||[];
        }              

        angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
            if (item.InvestigationNotes != '') {
                item.IsNoteEdit = true;
            }
            item.DurationDate = item.DurationDate || null;
            if (item.DurationDate != null) {
                item.ShowDateFormat = true;
                item.DurationDate = $filter("date")(item.DurationDate, "MM-dd-yyyy");
            }
        });
        $scope.PreSurgeryIns = { "MedicineOrdersInstructions": "" }

        if (cache.OverallInstructions !='') {
            $scope.PreSurgeryIns.MedicineOrdersInstructions = cache.MedicineOrdersInstructions;
        }

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
            }
            ];
        };
        $scope.GetOrganNameList = angular.copy($scope.GetOrganName());
        $scope.GetLogObj = function () {
            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cache.AppointmentId || null,
                "PatientId": $scope.cache.PatientId || null,
                "LogArray": [],
                "PrescriptionArray": [],
                "InvestigationsList":[],
                "MedicineOrdersInstructions":""
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        // log info assign
        if ($scope.cache.PrescriptionDetails.length>0) {
            $scope.LogObj.PrescriptionArray = angular.copy($scope.cache.PrescriptionDetails[0].PrescriptionDetails) || [];
            $scope.LogObj.InvestigationsList = angular.copy($scope.cache.InvestigationsList)|| [];
            $scope.LogObj.MedicineOrdersInstructions = angular.copy($scope.cache.MedicineOrdersInstructions) || "";
        }
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
        $scope.getOrgMedicines = function (text) {
            text = text || "";
            var object = {
                "LevelType": "O",
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": text,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (text === "") {
                object.Type = 'C';
            }
            return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.MedicineList !== undefined) {
                        return response.data.MedicineList.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        }

        $scope.PushfreqMedicalItems1 = function (item) {
            console.log(item);
            //var obj = {
            //    "ProcedureMedicationId": 0,
            //    "DeleteInd": "N",
            //    "OrganId": "",
            //    "MedicineId": item.MedicineId,
            //    "MedicineName": item.MedicineName,
            //    "MedicineType": item.MedicineType,
            //    "DrugActionId": null,
            //    "DrugDoseId": null,
            //    "DoseUnitId": null,
            //    "DoseRouteId": null,
            //    "DoseTimingId": null,
            //    "DoseOtherId": null,
            //    "DoseDurationId": null,
            //    "DoseQuantity": null,
            //    "QuantityUnitId": null,
            //    "Refills": null,
            //    "SubstitutionPermitted": '',
            //    "ShowNotes": false,
            //    "Duration": "",
            //    "DurationType": "",
            //    "Instructions": "",
            //    "DurationDate": "",
            //    "FromDate": "",
            //    "ToDate": "",
            //    "StartTime": "",
            //    "EndTime": "",
            //    "Drops": ""
            //}
            var obj = {
                "ProcedureMedicationId": 0,
                "DeleteInd": "N",
                "OrganId": "",
                "MedicineId": item.MedicineId,
                "MedicineName": item.MedicineName,
                "MedicineType": item.MedicineType,
                "MedicationType": "Continuation",
                "CategoryId": null,
                "CategoryName": "",
                "HospitalId": null,
                "DrugActionId": null,
                "DrugDoseId": null,
                "DoseUnitId": null,
                "DoseRouteId": null,
                "DoseTimingId": null,
                "DoseOtherId": null,
                "DoseDurationId": null,
                "DoseQuantity": null,
                "QuantityUnitId": null,
                "Refills": null,
                "SubstitutionPermitted": 'n',
                "ShowNotes": false,
                "Duration": "",
                "DurationType": "",
                "Instructions": "",
                "DurationDate": "",
                "FromDate": "",
                "ToDate": "",
                "StartTime": "",
                "EndTime": "",
                "Drops": "",
                "IsEdit": true,
                "IsAllSig": false,
            }

            var i = 0;
            if ($scope.Surgeryobj.PreMedicationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.PreMedicationslist, function (Aitem) {
                    if (Aitem.MedicineId === item.MedicineId && Aitem.DeleteInd == 'N') {
                        /*alertify.error('You have already entered this Medications');*/
                        alertify.error('Medicine Already Added To The List!');
                        i++;
                    }
                });
            }
            if (i === 0) {
                $scope.Surgeryobj.PreMedicationslist.push(obj);
                $scope.Surgeryobj.MedicineObject = "";
            }
        
        }

        $scope.PushfreqMedicalItems = function (item) {
            console.log(item);
            item.SigSearchShows = false;
            item.SigfieldsShows = false;
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
                "Quantity": null,
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
                "IsAllSig": false
               
            };

            var i = 0;
            if ($scope.Surgeryobj.PreMedicationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.PreMedicationslist, function (Aitem) {
                    if (Aitem.MedicineId === item.MedicineId && Aitem.DeleteInd == 'N') {
                        /*alertify.error('You have already entered this Medications');*/
                        alertify.error('Medicine Already Added To The List!');
                        i++;
                    }
                });
            }
            if (i === 0) {
                $scope.Surgeryobj.PreMedicationslist.push(obj);
                $scope.Surgeryobj.MedicineObject = "";
            }

        }

        $scope.ChangeMedicationType = function (item, Type) {
            if (Type == 'Stop') {
                item.DrugActionId = '';
                item.Refills = '';
                item.OrganId = '';
                item.Drops = '';
                item.Duration = '';
                item.DurationType = 'D';
                item.MedicationType = 'Stop';

                item.ActionId = 0;
                item.Action = '';
                item.Dose = '';
                item.DoseUnit = '';
                item.Route = '';
                item.Frequency = '';
                item.DoseOther = '';
                item.DaysSupply = '';
                item.QuantityUnit = '';
                item.DoseId = 0;
                item.DoseUnitId = 0;
                item.RouteId = 0;
                item.FrequencyId = 0;
                item.DoseOtherId = 0;
                item.DaysSupplyId = 0;
                item.Quantity = null;
                item.QuantityUnitId = 0;
                item.RefillId = 0;
                item.Refills = '';

            }
            if (Type == 'Continuation') {
                item.FromDate = '';
                item.ToDate = '';
                item.StartTime = '';
                item.EndTime = '';
                item.StartDate = '';
                item.StopDate = '';
                item.MedicationType = 'Continuation';
            }
        }

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
        }

        $scope.onRosCurrentMedicationsHistorylist = function (item) {
            console.log(item);
            item.SigfieldsShows = false;
            item.SigSearchShows = false;
            var obj = {
                "ProcedureMedicationId": 0,
                "HospitalId": item.OrganizationId,
                "MedicineId": item.MedicineId,
                "MedicineType": item.MedicineType,
                "MedicineTypeId": item.MedicineTypeId,
                "MedicineName": item.MedicineName,
                "MedicationType": "Continuation",
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
                "Quantity": null,
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
                "IsAllSig": false

            };

            var i = 0;
            if ($scope.Surgeryobj.CurrentMedicationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.CurrentMedicationslist, function (Aitem) {
                    if (Aitem.MedicineId === item.MedicineId && Aitem.DeleteInd == 'N') {
                        /*alertify.error('You have already entered this Medications');*/
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
       



        $scope.DelectPostMedicationitem = function (index,item) {

          
            if ($scope.IsComingFrom == 'Coordinator') {
                item.ProcedureMedicationId = item.ProcedureMedicationId || null;
                if (item.ProcedureMedicationId!=null) {                   
                    $scope.Surgeryobj.PreMedicationslist[index].DeleteInd = 'Y';
                }
                else {
                    $scope.Surgeryobj.PreMedicationslist.splice(index, 1);
                }
            }
            else if ($scope.IsComingFrom == 'PreOp') {

                var index = $scope.Surgeryobj.PreMedicationslist.indexOf(item);
                item.PreOpCurrentMedicationId = item.PreOpCurrentMedicationId || null;
                if (item.PreOpCurrentMedicationId == null) {
                    if (index > -1) {
                        $scope.Surgeryobj.PreMedicationslist.splice(index, 1);
                    }
                } else {
                    $scope.Surgeryobj.PreMedicationslist[index].DeleteInd = 'Y';
                }
            }
            else if ($scope.IsComingFrom == 'PostOp') {
                item.ProcedureMedicationId = item.ProcedureMedicationId || null;
                item.PostOpSurgeonMedicationId = item.PostOpSurgeonMedicationId || null;
                if (item.PostOpSurgeonMedicationId!=null) {
                    $scope.Surgeryobj.PreMedicationslist[index].DeleteInd = 'Y';
                }
                else {
                    $scope.Surgeryobj.PreMedicationslist.splice(index, 1);
                }
            } else {
                item.ProcedureMedicationId = item.ProcedureMedicationId || null;
                if (item.ProcedureMedicationId != null) {
                    $scope.Surgeryobj.PreMedicationslist[index].DeleteInd = 'Y';
                }
                else {
                    $scope.Surgeryobj.PreMedicationslist.splice(index, 1);
                }
            }
          
        };
        $scope.GetUserPreSurgeryTemplateByCoordinator = function () {
            var params = {
                "UserId": $scope.UserId,
                "SearchText": "",
                "PageSize": 1000,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
            }
            eHnotePatientDataService.GetUserPreSurgeryTemplateByCoordinator(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PreSurgeryTemplatesArray = resp.data.rows || [];
                }

            }, function (err) {

            });
        }
        //$scope.GetUserPreSurgeryTemplateByCoordinator();

        $scope.SavePreMedicationTemplates = function () {
            if ($scope.Surgeryobj.EnterPreSurgeryTemplateName === "") {
                alertify.error("Please Enter Template Name");
                return false;
            }
            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "DeleteInd": "N",
                "TemplateId": 0,
                "TemplateName": $scope.Surgeryobj.EnterPreSurgeryTemplateName,
                "PreMedicationslist": $scope.Surgeryobj.PreMedicationslist||[],
            }
            //console.log(JSON.stringify(params));
            //return false;
            
            eHnotePatientDataService.AddUpdateUserPreSurgeryTemplateByCoordinator(params).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Save successfully");
                    $scope.Surgeryobj.EnterPreSurgeryTemplateName = '';
                    $scope.GetUserPreSurgeryTemplateByCoordinator();

                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.ChangesForPreSurgeryTemp = function (item) {
            console.log(item);
            item = item || '';
            $scope.SelectedtempPreMedications = [];
            if (item !='') {
                $scope.SelectedtempPreMedications = angular.copy(item.PreMedicationslistArray) || [];
            }
          
            if ($scope.Surgeryobj.PreMedicationslist.length == 0) {
                $scope.Surgeryobj.PreMedicationslist = $scope.SelectedtempPreMedications || [];
            } else {
                if ($scope.SelectedtempPreMedications.length !== 0) {
                    angular.forEach($scope.SelectedtempPreMedications, function (Citem) {
                        var List = $filter("filter")($scope.Surgeryobj.PreMedicationslist, function (Aitem, index) { return Aitem.MedicineId == Citem.MedicineId },);
                        if (List.length == 0) {
                            $scope.Surgeryobj.PreMedicationslist.push(Citem);
                        }
                    });

                }
            }
        }

        $scope.GetMedicalConditionArray = function (val) {          
            var req = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "PageSize": 10,
                "SearchKey": val,
                "PageNumber": 1,
                "Type": '',
                "UserId": $scope.UserId,
                "IsFrequent": "N"
            };
            if (req.SearchKey == "") {
                req.IsFrequent = "Y";
            }

            return eHnoteConditionsDataService.GetMedicalConditionSettings(req).then(function (resp) {
                if (resp.data.count !== 0) {                 
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });
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


        $scope.ONSigDetails = function (item, mainitem) {
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
                $scope.SigObject = '';
            mainitem.SigfieldsShows = true;
            mainitem.SigSearchShows = false;
        }
        $scope.ONSigDetailsAll = function (item, mainitem) {
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
            $scope.MedicineObject = '';
            mainitem.SigfieldsShows = true;
            mainitem.SigSearchShows = false;
        }

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
                            "Quantity": null,
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
                             //$uibModalInstance.close('save');
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
            
        }

        $scope.onRosMedicalconditionItemSelect = function (object) {
            if (object.MedicalConditionId === '') {
                object.MedicalConditionName = '';
                $scope.Surgeryobj.CurrentMedicationobj = '';
                return false;
            }

            $scope.Surgeryobj.CurrentMedicationobj = object;
            $scope.Surgeryobj.CurrentMedicationobj = $scope.Surgeryobj.CurrentMedicationobj || "";
            
            if (angular.isObject($scope.Surgeryobj.CurrentMedicationobj)) {
                
                //var object = {
                //    "DeleteInd": "N",
                //    "CategoryId": $scope.Surgeryobj.CurrentMedicationobj.CategoryId,
                //    "CategoryName": $scope.Surgeryobj.CurrentMedicationobj.CategoryName,
                //    "HospitalId": $scope.Surgeryobj.CurrentMedicationobj.HospitalId,
                //    "MedicalConditionId": $scope.Surgeryobj.CurrentMedicationobj.MedicalConditionId,
                //    "MedicalConditionName": $scope.Surgeryobj.CurrentMedicationobj.MedicalConditionName,
                //    "Remarks": "",
                //    "OrganId":"",
                //    "Duration":"",
                //    "DurationType":"D",                 
                //    "MedicationType":"Continuation",
                //    "DurationDate":"",
                //    "FromDate":"",
                //    "ToDate":"",
                //    "StartTime":"",
                //    "EndTime":"",
                //    "Drops":"",                   
                //    "Refills":"",
                //    "IsEdit": true,
                    
                //};
                var object = {
                    "ProcedureMedicationId": 0,
                    "DeleteInd": "N",
                    "OrganId": "",
                    "MedicineId": $scope.Surgeryobj.CurrentMedicationobj.MedicalConditionId,
                    "MedicineName": $scope.Surgeryobj.CurrentMedicationobj.MedicalConditionName,
                    "MedicineType": "",
                    "MedicationType": "Continuation",
                    "CategoryId": $scope.Surgeryobj.CurrentMedicationobj.CategoryId || "",
                    "CategoryName": $scope.Surgeryobj.CurrentMedicationobj.CategoryName || "",
                    "HospitalId": $scope.Surgeryobj.CurrentMedicationobj.HospitalId,
                    "DrugActionId": null,
                    "DrugDoseId": null,
                    "DoseUnitId": null,
                    "DoseRouteId": null,
                    "DoseTimingId": null,
                    "DoseOtherId": null,
                    "DoseDurationId": null,
                    "DoseQuantity": null,
                    "QuantityUnitId": null,
                    "Refills": null,
                    "SubstitutionPermitted": 'n',
                    "ShowNotes": false,
                    "Duration": "",
                    "DurationType": "",
                    "Instructions": "",
                    "DurationDate": "",
                    "FromDate": "",
                    "ToDate": "",
                    "StartTime": "",
                    "EndTime": "",
                    "Drops": "",
                    "IsEdit": true,
                    "IsAllSig": false
                };
            }

            var i = 0;
            if ($scope.Surgeryobj.CurrentMedicationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.CurrentMedicationslist, function (item) {
                    if (item.MedicineId === $scope.Surgeryobj.CurrentMedicationobj.MedicalConditionId && item.DeleteInd == 'N') {
                        alertify.error('You have already entered this Current Eye Medication');
                        i++;
                    }
                });
            }
           
            if (i === 0) {
                object.MedicalHistoryDetailsId = 0;
                $scope.Surgeryobj.CurrentMedicationslist.push(object);
                $scope.Surgeryobj.CurrentMedicationobj = "";
            }
           

        };
        $scope.ClearCurrentMedication = function (item, index) {
            
            if ($scope.IsComingFrom == 'Coordinator') {
                item.ProcedureMedicationId = item.ProcedureMedicationId || null;
                if (item.ProcedureMedicationId != null) {
                    // $scope.Surgeryobj.PreMedicationslist[index].DeleteInd = 'Y';
                    item.DeleteInd = 'Y';
                }
                else {
                    $scope.Surgeryobj.CurrentMedicationslist.splice(index, 1);
                }
            } else if ($scope.IsComingFrom == 'PreOp') {

                var index = $scope.Surgeryobj.CurrentMedicationslist.indexOf(item);
                item.PreOpCurrentMedicationId = item.PreOpCurrentMedicationId || 0;
                if (item.PreOpCurrentMedicationId === 0) {
                    if (index > -1) {
                        $scope.Surgeryobj.CurrentMedicationslist.splice(index, 1);
                    }
                } else {
                    $scope.Surgeryobj.CurrentMedicationslist[index].DeleteInd = 'Y';
                }
            }
            else {
                item.ProcedureMedicationId = item.ProcedureMedicationId || null;
                if (item.ProcedureMedicationId != null) {
                    item.DeleteInd = 'Y';
                }
                else {
                    $scope.Surgeryobj.CurrentMedicationslist.splice(index, 1);
                }
            }

        
          
        };

     



        $scope.GetOrganizationTypeOfService = function (text) {
            var Type = 'Investigation';
            //if (Servicetype == 'Investigation') {
            //    Type = 'Investigation';

            //} else if (Servicetype == 'Surgery') {
            //    Type = 'Surgery';
            //}
            //else if (Servicetype == 'Procedure') {
            //    Type = 'Procedure';
            //}
            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "Type": Type || 0,
                /*"IsFrequent": 'N'*/
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
                "InvestigationNotes":null
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
            if (Aitem.PatientInvestigationId === 0) {
                if (index > -1) {
                    $scope.Surgeryobj.Investigationslist.splice(index, 1);              
                }
            } else {
                $scope.Surgeryobj.Investigationslist[index].DeleteInd = 'Y';              
            }
        };
       
        $scope.SaveMedicationsData = function () {
            $scope.LogObj.LogArray = [];
            $scope.cache.ScreenType = $scope.cache.ScreenType || null;
            $scope.Surgeryobj.Investigationslist = $scope.Surgeryobj.Investigationslist || [];
            var i = 0;
            var j = 0;
            if ($scope.Surgeryobj.Investigationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.Investigationslist, function (Aitem) {
                    Aitem.OrganId = Aitem.OrganId || ""
                    Aitem.LocationId = Aitem.LocationId || ""
                    if (Aitem.DeleteInd == 'N') {
                        if (Aitem.LocationId == "") {
                            j++;
                        }
                        //if (Aitem.LocationId == 1) {
                        //  if (Aitem.OrganId == "") {
                        //      i++;
                        //  }
                        //}
                    }
                });
            }
            if (j !== 0) {
                alertify.error('Please Select Location');
                return false;
            }
            if (i !== 0) {
                alertify.error('Please Select Organ in Labs/Investigations');
                return false;
            }
            var MedicationsArray = [];
            $scope.Surgeryobj.PrescriptionMainAddObj = angular.copy($scope.PrescriptionMainAddObj);
            $scope.Surgeryobj.MedicineOrdersInstructions = angular.copy($scope.PreSurgeryIns.MedicineOrdersInstructions);
            MedicationsArray.push($scope.Surgeryobj.PrescriptionMainAddObj);
            var reqobj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.cache.PatientId,
                "AppointmentId": $scope.cache.AppointmentId,
                "PrescriptionArray": MedicationsArray || [],
                "InvestigationsList": $scope.Surgeryobj.Investigationslist || [],
                "MedicineOrdersInstructions": $scope.Surgeryobj.MedicineOrdersInstructions || '',
                "Logs": {}
            }
            var logcount = 0
            if (reqobj.MedicineOrdersInstructions != '' || $scope.LogObj.MedicineOrdersInstructions!='') {
                if (reqobj.MedicineOrdersInstructions != $scope.LogObj.MedicineOrdersInstructions) {
                    logcount++
                }
            }
            let ActionType = '';
            if ($scope.LogObj.MedicineOrdersInstructions == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }
            let ActionDescription = '';
            if ($scope.cache.ScreenType == 1) {
                ActionDescription = ` Medical Instructions in Operative notes  For Appointment ID: ${$scope.cache.AppointmentId}` || "";
            } else if ($scope.cache.ScreenType == 2) {
                ActionDescription = ` Medical Instructions in Discharge summary  For Appointment ID: ${$scope.cache.AppointmentId}` || "";
            } else if ($scope.cache.ScreenType==null){
                ActionDescription = ` Medical Instructions For Appointment ID: ${$scope.cache.AppointmentId}` || "";
            }
            
            if (logcount != 0) {
                let Reqobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 5,
                    "SubModuleName": "Operative Notes",
                    "ScreenType": "ASC Chart",
                    "ActionType": ActionType,
                    "ActionDescription": ActionDescription,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(Reqobj);
            }

            if (reqobj.PrescriptionArray.length > 0) {
                let ordersaddcount = 0, editcount = 0;
                let tempPrescriptionArray = reqobj.PrescriptionArray[0].PrescriptionDetails || []
                if ($scope.LogObj.PrescriptionArray.length > 0) {
                    angular.forEach(tempPrescriptionArray, function (item) {
                        item.Sig = item.Sig || "";
                        var edited = $scope.LogObj.PrescriptionArray.filter(function (eitem) {
                            eitem.Sig = eitem.Sig || "";
                            return ((eitem.MedicationId == item.MedicationId) && (item.DeleteInd == eitem.DeleteInd) && (eitem.Remarks == item.Remarks) && (eitem.ActionId == item.ActionId) &&
                                (eitem.DaysSupplyId == item.DaysSupplyId) && (eitem.DoseId == item.DoseId) && (eitem.DoseOtherId == item.DoseOtherId) && (eitem.DoseUnitId == item.DoseUnitId) && (eitem.FrequencyId == item.FrequencyId) && (eitem.RouteId == item.RouteId)
                                && (eitem.Quantity == item.Quantity) && (eitem.QuantityUnitId == item.QuantityUnitId) && (eitem.RefillId == item.RefillId) && (eitem.SubstitutionPermitted == item.SubstitutionPermitted) && (eitem.Sig == item.Sig)
                                && (normalizeDate(eitem.StartDate) == normalizeDate(item.StartDate)) && (normalizeDate(eitem.StopDate) == normalizeDate(item.StopDate)))
                        }) || [];

                        if (edited.length == 0) {
                            editcount++;
                        }
                    });
                }
                else {
                    if (tempPrescriptionArray.length > 0) {
                        ordersaddcount++;
                    }
                    
                }

                let ActionDescription = '';
                if ($scope.cache.ScreenType == 1) {
                    ActionDescription = ` Medications in Operative notes  For Appointment ID: ${$scope.cache.AppointmentId}`;
                } else if ($scope.cache.ScreenType == 2) {
                    ActionDescription = ` Medications in Discharge summary  For Appointment ID: ${$scope.cache.AppointmentId}`;
                } else if ($scope.cache.ScreenType == null) {
                    ActionDescription = ` Medication Orders For Appointment ID: ${$scope.cache.AppointmentId}`;
                }

                if (editcount != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 5,
                        "SubModuleName": "Operative Notes",
                        "ScreenType": "ASC Chart",
                        "ActionType": "Edited",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                }
                else if (ordersaddcount != 0) {

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 5,
                        "SubModuleName": "Operative Notes",
                        "ScreenType": "ASC Chart",
                        "ActionType": "Added",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            }
            if (reqobj.InvestigationsList.length>0) {
                let ordersaddcount = 0, editcount = 0,deletecountitem=0;
                if ($scope.LogObj.InvestigationsList.length > 0) {
                    angular.forEach(reqobj.InvestigationsList, function (item) {
                        item.DurationType = item.DurationType || "";
                        if (item.DeleteInd=='Y') {
                            deletecountitem++;
                        }
                        var edited = $scope.LogObj.InvestigationsList.filter(function (eitem) {
                            eitem.DurationType = eitem.DurationType || "";
                            return ((eitem.InvestigationId == item.InvestigationId) && (eitem.InvestigationNotes == item.InvestigationNotes) && (eitem.DurationDate == item.DurationDate) &&
                                (eitem.Duration == item.Duration) && (eitem.LocationId == item.LocationId) && (eitem.Remarks == item.Remarks) && (eitem.DurationType == item.DurationType));
                        }) || [];

                        if (edited.length == 0) {
                            editcount++;
                        }
                    });
                } else {
                    ordersaddcount++;
                }

                let ActionDescription = '';
                if ($scope.cache.ScreenType == 1) {
                    ActionDescription = ` Labs/Investigations in Operative notes  For Appointment ID: ${$scope.cache.AppointmentId}`;
                } else if ($scope.cache.ScreenType == 2) {
                    ActionDescription = ` Labs/Investigations in Discharge summary For Appointment ID: ${$scope.cache.AppointmentId}`;
                } else if ($scope.cache.ScreenType == null) {
                    ActionDescription = ` Lab Orders  For Appointment ID: ${$scope.cache.AppointmentId}`;
                }
                if (editcount != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 5,
                        "SubModuleName": "Operative Notes",
                        "ScreenType": "ASC Chart",
                        "ActionType": "Edited",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                }
                else if (deletecountitem!=0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 5,
                        "SubModuleName": "Operative Notes",
                        "ScreenType": "ASC Chart",
                        "ActionType": "Deleted",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
                else if (ordersaddcount != 0) {

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 5,
                        "SubModuleName": "Operative Notes",
                        "ScreenType": "ASC Chart",
                        "ActionType": "Added",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            reqobj.Logs = angular.copy($scope.LogObj) || []

            eHnoteSurgeryService.AddUpdateOperativeNotesData(reqobj).then(function (resp) {
                if (resp.data.Status == 'Success') {
                    alertify.success("Data Saved Successfully!");
                   
                }
                $uibModalInstance.close(resp.data);

            }, function (err) {
                alertify.error("Fetching Data Failed!");
                console.log(err);
            });
        };
        function normalizeDate(date) {
            if (!date) return null;
            let value = $filter("date")(date, "MM-dd-yyyy");
            return value;
        }
        $scope.closeuib = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.ChangeItem = function (item) {
            item.ShowDateFormat = !item.ShowDateFormat;
        };
        $scope.ChangeDuration = function (item) {
            item.DurationDate = null;
        };

        $scope.GetPresentTime = function (item) {
            item.StartTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.GetPresentTime2 = function (item) {
            item.EndTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.ChangeLocation = function (List,Litem) {
            if (Litem === 1) {
                List.OrganId = List.OrganId || '';
            } else {
                List.OrganId = '';
            }
        }

        $scope.ChangeFormatDate = function (item) {
            item.Duration = null;
            item.DurationType = '';
        }

        $scope.ShowSigFields = function (item) {
            item.SigfieldsShows = !item.SigfieldsShows;
          
        }
        $scope.ShowSigSearch = function (item) {
            item.IsAllSig = !item.IsAllSig;
        }

        // new orders design related code 24-01-2024

        $scope.CurrentDateTime = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
        $scope.CurrentDateMMFormat = $filter('date')(new Date(), "MM/dd/yyyy");

        console.log($scope.CurrentDateMMFormat + "__$scope.CurrentDateMMFormat");

        $scope.MedicalrxObj = {
            "IsRcopiaa": false,
            "IsCurrentEye": true,
            "IsCurrentSystem": true
        }

        $scope.medicineGetObj = {
            "MedicineObject": ""
        }

        $scope.SigSearch = {
            "Shows": false
        }

        function getNewPrescriptionDetailObj() {
            var obj = {
                "PatientPrescriptionDetailId": 0,
                "PatientPrescriptionId": 0,
                "PatientId": $scope.cache.PatientID,
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
                "Quantity":null,
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
        
        function getnewRcopiaPatientObj() {
            var obj = {
                "FirstName": "",
                "LastName": "",
                "ExternalID": "",
                "DeleteInd": "n",
                "MiddleName": "",
                "RcopiaPatientId": 0,
                "DOB": "",
                "Sex": "",
                "HomePhone": "",
                "Address1": "",
                "Address2": "",
                "City": "",
                "State": "",
                "Zip": "",
                "Suffix": "",
                "Prefix": "",
                "EmailId": "",
                "Race": "",
                "Ethnicity": ""
            };
            return obj;
        }

        $scope.RcopiaPatientObj = getnewRcopiaPatientObj();

        function getEmptyPrescriptionObj() {

            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.cache.PatientId,
                "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
                "PatientPrescriptionId": 0,
                "AppointmentId": $scope.cache.AppointmentId,
                "ProviderId": $scope.cache.DoctorId,
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
                "RcopiaDeleted": "n",
                "PrescriptionDetails": []
            };
            return obj;
        };

        $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

        if ($scope.cache.PrescriptionDetails.length > 0) {
            $scope.PrescriptionMainAddObj.PatientPrescriptionId = $scope.cache.PrescriptionDetails[0].PatientPrescriptionId;
            $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy($scope.cache.PrescriptionDetails[0].PrescriptionDetails);
        }


        if ($scope.cache.PrescriptionDetails.length > 0) {
            $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy($scope.cache.PrescriptionDetails[0].PrescriptionDetails) || [];
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {        
                item.StartDate = $filter("date")(item.StartDate, "MM-dd-yyyy");
                item.StopDate = $filter("date")(item.StopDate, "MM-dd-yyyy");
                item.SigObj = item.Sig;
               
            });

        }

        $scope.adnewsigobj = {
            "IsNewSig": false,
            "MedicineId": 0,
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
           /* $scope.adnewsigobj.IsNewSig = !$scope.adnewsigobj.IsNewSig;*/
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
            item.SigFields = false;         
            /* item.SigFormationFields = !item.SigFormationFields;*/
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
            //item.Quantity = null;
            //item.QuantityUnitId = 0;
            //item.QuantityUnit = '';
            //item.RefillId = 0;
            //item.Refills = '';

        }

        function getnewOrganizationSigObj() {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationSigTemplateId": 0,
                "OrganizationId": $scope.HospitalId || null,
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
                "DaysSupplyDescription": "",
                "Quantity": null,
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

        $scope.pushPrescriptionMedicationDetails1 = function (obj, type, type1) {
            console.log(JSON.stringify(obj));
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
                newmedicationobj.isAddFocused  = false;
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
                                if (item.MedicationId == newmedicationobj.MedicationId && item.DeleteInd =='N') {
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

        $scope.PrescriptionChange = function (obj) {
            obj = obj || "";
        }

        $scope.addSIgNameDynamicallyAdded = function () {

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                    var dosesupplytest = "";
                    if (initem.DaysSupply !== '') {
                        dosesupplytest = " for " + initem.DaysSupplyDescription || "";
                    }

                    if (initem.DaysSupply !== '') {
                        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                        if (filteredArray.length > 0) {
                            initem.DaysSupply = filteredArray[0].Code;
                            dosesupplytest = " for " + filteredArray[0].Description;
                        }
                    }

                    initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                    initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;

                    //if (initem.MedicineObj == '') {
                    //    initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                    //    initem.Sig = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                    //} else {
                    //    initem.MedicineObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                    //}
                  

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

        $scope.RemovePrescriptionDetailObj = function (index, item) {
            if (item.PatientPrescriptionDetailId != 0) {
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
                $scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails.push(newmedicationobj);


                console.log(JSON.stringify($scope.PrescriptionMainAddObjFOrDelete));
                $scope.LogObj.LogArray = [];
                let logobj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 5,
                    "SubModuleName": "Operative Notes",
                    "ScreenType": "ASC List",
                    "ActionType": "Deleted",
                    "ActionDescription": `	Medications in Operative notes For Appointment ID: ${$scope.cache.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(logobj);
                $scope.PrescriptionMainAddObjFOrDelete.Logs = {};
                $scope.PrescriptionMainAddObjFOrDelete.Logs = angular.copy($scope.LogObj);

                eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObjFOrDelete, OnAddSigSuccess, OnAddSigError);
                function OnAddSigSuccess(response) {
                    if (response.status === "Success") {
                        alertify.success("Medication Deleted  Successfully");
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                        if (item.RcopiaMedicationId !== "") {

                            $scope.AddNewPrescriptionObj = getnewPrescriptionObj();

                            $scope.AddNewPrescriptionObj.PatientPrescriptionId = $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId || 0;

                            angular.forEach($scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails, function (pitem) {

                                var scheduletype = "unknown";
                                if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                                    scheduletype = "unknown";
                                } else {
                                    scheduletype = pitem.DrugSchedule;
                                }

                                if (pitem.DrugSchedule === "3" || pitem.DrugSchedule === "2" || pitem.DrugSchedule === "4" || pitem.DrugSchedule === "5" || pitem.DrugSchedule === "scheduled") {
                                    pitem.HasScheduledDrug = "y";
                                }
                                var StopDate = $filter('date')(pitem.StopDate, "MM/dd/yyyy HH:mm:ss");
                                var obj = {
                                    "PatientMedicationId": pitem.PatientPrescriptionDetailId,
                                    "IsInPatientMedication": "n",
                                    "HistorySource": "patient",
                                    "HasScheduledDrug": pitem.HasScheduledDrug,
                                    "Deleted": "y",
                                    "RcopiaMedicationId": pitem.RcopiaMedicationId || "",
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
                                    "StartDate": $scope.CurrentDateMMFormat,
                                    "StopDate": StopDate,
                                    "FillDate": $scope.CurrentDateMMFormat,
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
            } else {
                $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
            }

        };

        $scope.EditSigFields = function (item) {
            item.SigFields = !item.SigFields;
            $scope.adnewsigobj.IsNewSig = false;
            item.isEditFocused = true;
            item.isAddFocused = false;

        }

        $scope.changeSigForMedicine = function (item) {
            item.Sig = item.SigObj || "";
            item.SigId = 0;
         

            //item.DrugActionId = '';
            //item.Refills = '';
            //item.OrganId = '';
            //item.Drops = '';
            //item.Duration = '';
            //item.DurationType = 'D';
            //item.ActionId = 0;
            //item.Action = '';
            //item.Dose = '';
            //item.DoseUnit = '';
            //item.Route = '';
            //item.Frequency = '';
            //item.DoseOther = '';
            //item.DaysSupply = '';
            //item.QuantityUnit = '';
            //item.DoseId = 0;
            //item.DoseUnitId = 0;
            //item.RouteId = 0;
            //item.FrequencyId = 0;
            //item.DoseOtherId = 0;
            //item.DaysSupplyId = 0;
            //item.Quantity = null;
            //item.QuantityUnitId = 0;
            //item.RefillId = 0;
            //item.Refills = '';
        };

        $scope.Selectedmedic = function (item, val) {
            item.SelectedMedicationHistory = val;
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
                var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
                if (filteredArray.length > 0) {
                    var DateCode = filteredArray[0].Code;
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                    mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
                }
            }
        };

        $scope.ONSigDetailsSig = function (item, mainitem) {
           $scope.adnewsigobj.IsNewSig = false;
            console.log(item);
            console.log(mainitem);
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
                    mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
                }
            }
        };

        $scope.doseArray = [];
        $scope.doseOtherArray = [];
        $scope.frequencyArray = [];
        $scope.refillsArray = [];
        $scope.durationArray = [];
        $scope.actionArray = [];
        $scope.routeArray = [];
        $scope.doseUnitArray = [];
        $scope.quantityUnitArray = [];

        $scope.getMasterFieldDosageData = function () {
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

        $scope.getMasterFieldDosageData();

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
            mainitem.MedicineObj = ""
        }

        $scope.SaveOrganizationSig = function () {
            console.log($scope.addNewOrganizationSigObj);
            if ($scope.addNewOrganizationSigObj.Sig == '') {
                alertify.error("Please Enter Sig");
                return false;
            }
            //if ($scope.addNewOrganizationSigObj.Quantity == '') {
            //    alertify.error("Please Enter Quantity");
            //    return false;
            //}

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

        //$scope.showAddSigFields = false;
        //$scope.showAddSigButton = true;
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


        $scope.MedicationObj = {
            "AscOrderTemplateId": 0,
            "TemplateName":""

        }
      
        $scope.InvestObj = {
            "AscOrderTemplateId": 0,
            "TemplateName": ""
        }


        $scope.SaveIntraMedicationTemplate = function () {

            if ($scope.MedicationObj.TemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length === 0) {
                alertify.error("Please Add Atleast One Medication");
                return false;
            }

            $scope.MedicationArray = [];
            $scope.MedicationArray =angular.copy($scope.PrescriptionMainAddObj.PrescriptionDetails);

            let templateReq = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AscOrderTemplateId": $scope.MedicationObj.AscOrderTemplateId ||  0,
                "CategoryId": 1,
                "TemplateName": $scope.MedicationObj.TemplateName || "",
                "DeleteInd": "N",
                "PatientAscInvestigations": [],
                "PatientAscMedications": $scope.MedicationArray|| [],
                "PatientAscEyeDrops":  [],
                "PatientAscInjections": [],
                "Type": 'Medication',
                "TypeId": '1',
                "RoleId": $scope.RoleId
            };
            eHnotePatientDataService.AddUpdateUserAscOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetUserAscOrderTemplates();
                    $scope.IsOpenMedication = false;
                    $scope.MedicationObj.TemplateName = "";
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message)
                }
            }, function (err) {
                console.log(err);
            });
        };


        $scope.GetUserAscOrderTemplates = function () {
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "CategoryId": 1
            }
            eHnotePatientDataService.GetUserAscOrderTemplates(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.MedicationTemplates = resp.data.Medications || [];
                    $scope.InvestigationTemplates = resp.data.Investigations || [];
                }

            }, function (err) {

            });
        };
        $scope.GetUserAscOrderTemplates();

        //$scope.OnselectMedicationNotesTemplates = function (item) {
        //    console.log(item);





        //        $scope.PrescriptionMainAddObj.PrescriptionDetails = item.PatientAscMedications || [];
           
        //    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
        //        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (Citem) {
        //            Citem.SigObj = Citem.Sig;
        //            var NewDate = new Date();
        //            Citem.StartDate = $filter("date")(NewDate, "MM/dd/yyyy");
        //            if (Citem.DaysSupplyId != 0) {
        //                var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": Citem.DaysSupplyId }, true);
        //                if (filteredArray.length > 0) {
        //                    var DateCode = filteredArray[0].Code;
        //                    var currentDate = new Date();
        //                    var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
        //                    Citem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
        //                }
        //            }

        //            Citem.Type = Citem.Type || '';
        //            if (Citem.Type == '') {
        //                Citem.Type = "MedicineOrders";
        //            }

        //        });
        //    }
        //}

        $scope.OnselectMedicationNotesTemplates = function (item) {

            item.PatientAscMedications = item.PatientAscMedications || [];
            $scope.MedicationsArray = [];
            $scope.TemplateMedicationsArray = item.PatientAscMedications || [];

            /*$scope.templatesList = angular.copy(item.PatientAscMedications);*/
            //if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length  > 0) {
            //    for (var i = $scope.templatesList.length - 1; i >= 0; i--) {
            //        let tempArray = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'MedicationId': $scope.templatesList[i].MedicationId }, true);
            //        if (tempArray.length > 0) {
            //            $scope.templatesList.splice(i, 1);
            //        }
            //    }
            //}

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                let indexesToRemove = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'PatientPrescriptionDetailId': 0 }, true);
                indexesToRemove.reverse().forEach(function (index) {
                    $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                });
            };

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (Aitem) {
                    if (Aitem.PatientPrescriptionDetailId !== 0 && Aitem.DeleteInd == 'N') {
                        $scope.MedicationsArray.push(Aitem);
                    }
                });
            }
            if ($scope.MedicationsArray.length > 0) {
                $scope.OpenAlertPopup();
                return false;
            }


            if (item.PatientAscMedications.length > 0) {
                angular.forEach(item.PatientAscMedications, function (pitem) {
                    var newmedicationobj = getNewPrescriptionDetailObj();
                    newmedicationobj.MedicationId = pitem.MedicationId || 0;
                    newmedicationobj.DrugBrandName = pitem.MedicationName || "";
                    newmedicationobj.MedicationName = pitem.MedicationName || "";
                    newmedicationobj.DrugSchedule = pitem.DrugSchedule || "";
                    newmedicationobj.DrugStrength = pitem.DrugStrength || "";
                    newmedicationobj.Route = pitem.Route || "";
                    newmedicationobj.RouteId = pitem.RouteId || "";
                    newmedicationobj.ActionId = pitem.ActionId || "";
                    newmedicationobj.Action = pitem.Action || "";
                    newmedicationobj.DoseId = pitem.DoseId || "";
                    newmedicationobj.Dose = pitem.Dose || "";
                    newmedicationobj.DoseUnitId = pitem.DoseUnitId || "";
                    newmedicationobj.DoseUnit = pitem.DoseUnit || "";
                    newmedicationobj.DoseOtherId = pitem.DoseOtherId || "";
                    newmedicationobj.DoseOther = pitem.DoseOther || "";
                    newmedicationobj.DaysSupplyId = pitem.DaysSupplyId || "";
                    newmedicationobj.DaysSupply = pitem.DaysSupply || "";
                    newmedicationobj.Quantity = pitem.Quantity || null;
                    newmedicationobj.QuantityUnitId = pitem.QuantityUnitId || "";
                    newmedicationobj.QuantityUnit = pitem.QuantityUnit || "";
                    newmedicationobj.RefillId = pitem.RefillId || "";
                    newmedicationobj.SubstitutionPermitted = pitem.SubstitutionPermitted || "";
                    newmedicationobj.FrequencyId = pitem.FrequencyId || "";
                    newmedicationobj.Frequency = pitem.Frequency || "";
                    newmedicationobj.DrugSupply = pitem.DrugSupply || "";
                    newmedicationobj.DrugGenericName = pitem.GenericName || "";
                    newmedicationobj.RcopiaDrugId = pitem.RcopiaDrugId || "";
                    newmedicationobj.DrugNDCID = pitem.RcopiaDrugNDCID || "";
                    newmedicationobj.Sig = pitem.Sig || "";
                    newmedicationobj.SigObj = pitem.Sig || "";
                    newmedicationobj.DrugFirstDataBankMedID = pitem.FirstDataBankMedID || "";
                    newmedicationobj.DrugGenericId = pitem.GenericID || "";
                    newmedicationobj.Type = pitem.Type || "";
                    newmedicationobj.IsMedicationStopped = false;
                    newmedicationobj.RxNormList = pitem.RxNormList || [];
                    newmedicationobj.SigFormationFields = false;
                    newmedicationobj.isEditFocused = false;
                    newmedicationobj.isAddFocused = false;
                    newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
                    newmedicationobj.DrugRxNormId = pitem.RXNormId;

                    $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                    $scope.medicineGetObj.MedicineObject = "";

                });
            }
            
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                $scope.PrescriptionMainAddObj.IsNKMSelected = false;
            }
               
        }

        $scope.IsOpenMedicationTemp = function () {
            $scope.IsOpenMedication = true;
        }


        $scope.SaveIntraInvestTemplate = function () {

            if ($scope.InvestObj.TemplateName == "") {
                alertify.error("Please Enter Template Name!");
                return;
            }

          
            if ($scope.Surgeryobj.Investigationslist.length === 0) {
                alertify.error("Please Add Atleast One Investigation");
                return false;
            }



            $scope.InvestigationArray = [];
            $scope.InvestigationArray = angular.copy($scope.Surgeryobj.Investigationslist);

            let templateReq = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AscOrderTemplateId": $scope.InvestObj.AscOrderTemplateId || 0,
                "CategoryId": 1,
                "TemplateName": $scope.InvestObj.TemplateName || "",
                "DeleteInd": "N",
                "PatientAscInvestigations": $scope.InvestigationArray || [],
                "PatientAscMedications":[],
                "PatientAscEyeDrops": [],
                "PatientAscInjections": [],
                "Type": 'Investigation',
                "TypeId": '2',
                "RoleId": $scope.RoleId,
            };
            eHnotePatientDataService.AddUpdateUserAscOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetUserAscOrderTemplates();
                    $scope.IsOpenInvestigation = false;
                    $scope.InvestObj.TemplateName = "";
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message)
                }
            }, function (err) {
                console.log(err);
            });
        };

       

        $scope.IsOpenInvestigationTemp = function () {
            $scope.IsOpenInvestigation = true;
        }

        $scope.OnselectInvestNotesTemplates = function (item) {

            item.PatientAscInvestigations = item.PatientAscInvestigations || [];

            if ($scope.Surgeryobj.Investigationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.Investigationslist, function (Aitem) {
                    Aitem.DeleteInd = 'Y'
                });
            }

            /*$scope.Surgeryobj.Investigationslist = item.PatientAscInvestigations || [];*/

            if (item.PatientAscInvestigations.length > 0) {
                angular.forEach(item.PatientAscInvestigations, function (item) {
                    //if (item.Remarks != '') {
                    //    item.IsNoteEdit = true;
                    //    item.InvestigationNotes=item.Remarks;

                    //}
                    //item.DurationDate = item.DurationDate || null;
                    //if (item.DurationDate != null) {
                    //    item.ShowDateFormat = true;
                    //    item.DurationDate = $filter("date")(item.DurationDate, "MM-dd-yyyy");
                    //}

                    item.InvestigationNotes = '';
                    item.DurationDate = null;
                    item.OrganId = '';
                    item.LocationId = null;
                    item.Duration = null;
                    item.DurationType = '';
                    $scope.Surgeryobj.Investigationslist.push(item);


                });
            }
        }

        $scope.LabInvestNotes = function (item) {
            item.IsNoteEdit = !item.IsNoteEdit;
        }

        $scope.OpenAlertPopup = function () {
            $scope.mInstancecoordinationAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Facesheeteditmedicationpopup.html",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    "MedicationsArray": function () { return angular.copy($scope.MedicationsArray); },
                    "TemplateMedicationsArray": function () { return angular.copy($scope.TemplateMedicationsArray); }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, MedicationsArray, TemplateMedicationsArray) {
                    $scope.MedicationsArray = MedicationsArray || [];
                    $scope.TemplateMedicationsArray = TemplateMedicationsArray || [];

                    $scope.AddMedications = function (MedicationsArray, TemplateMedicationsArray) {
                        $scope.PrescriptionDetails = [];
                        if (MedicationsArray.length > 0) {
                            for (var i = TemplateMedicationsArray.length - 1; i >= 0; i--) {
                                let tempArray = $filter('filter')(MedicationsArray, { 'MedicationId': TemplateMedicationsArray[i].MedicationId }, true);
                                if (tempArray.length > 0) {
                                    TemplateMedicationsArray.splice(i, 1);
                                } 
                            }
                        }

                        if (MedicationsArray.length > 0) {
                            angular.forEach(MedicationsArray, function (Citem) {
                                TemplateMedicationsArray.push(Citem);
                            });
                        }

                        $scope.PrescriptionDetails = angular.copy(TemplateMedicationsArray);
                        $uibModalInstance.close($scope.PrescriptionDetails);
                    }
                    $scope.ReplaceMedications = function (MedicationsArray, TemplateMedicationsArray) {
                        $scope.PrescriptionDetails = [];
                        if (TemplateMedicationsArray.length > 0) {
                            for (var i = MedicationsArray.length - 1; i >= 0; i--) {
                                let tempArray = $filter('filter')(TemplateMedicationsArray, { 'MedicationId': MedicationsArray[i].MedicationId }, true);
                                if (tempArray.length > 0) {
                                    MedicationsArray.splice(i, 1);
                                } 
                            }
                        }

                        if (MedicationsArray.length > 0) {
                            angular.forEach(MedicationsArray, function (Citem) {
                                Citem.DeleteInd = 'Y';
                                TemplateMedicationsArray.push(Citem);
                            });
                        }
                        $scope.PrescriptionDetails = angular.copy(TemplateMedicationsArray);
                        $uibModalInstance.close($scope.PrescriptionDetails);
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
            $scope.mInstancecoordinationAdd.result.then(function (PrescriptionDetails) {
                var MedicationsArray = [];
                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                        if (item.DeleteInd == 'Y') {
                            $scope.MedicationsArray.push(Aitem);
                        }
                    });
                }
                $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
                if (PrescriptionDetails.length > 0) {
                    angular.forEach(PrescriptionDetails, function (Aitem) {
                        Aitem.SigObj = Aitem.Sig;
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.push(Aitem);
                    });
                }
                if (MedicationsArray.length > 0) {
                    angular.forEach(MedicationsArray, function (Bitem) {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.push(Bitem);
                    });
                }
                
            }, function () { });
        };
       
    }]);
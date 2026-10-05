"use strict";
eHnoteWebApp.controller("EhnoteSettingFeeStructureCtrl", ["$scope", "eHnoteMasterDataService", "eHnoteSettingsDataService", "alertify", "$filter", "$q", "$uibModal", "eHnoteInsuranceService", "$timeout","eHnoteSurgeryService",
    function ($scope, eHnoteMasterDataService, eHnoteSettingsDataService, alertify, $filter, $q, $uibModal, eHnoteInsuranceService, $timeout, eHnoteSurgeryService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.ParentHospitalID = 0;
        $scope.HospitalId = 0;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        }

        $scope.IsShowAddNewCPT = false;
        $scope.IsShowAllFeeList = true;

        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.filterLocationslist = angular.copy($scope.AllUserBranchesList);
        $scope.Locationslist = angular.copy($scope.filterLocationslist.filter(pitem => pitem.ClinicId !== 0));
        var filtredArray = $filter("filter")($scope.FacilitiesList, { "ActiveInd": 'Y' }, true) || [];
        $scope.BillingProviderList = angular.copy(filtredArray) || [];
        $scope.BillingProviderList.unshift({
            "BillingProviderName": "All Providers",
            "OrganizationBillingProviderId": 0
        });
        $scope.BillingProviderList.forEach(item => item.IsChecked = true);
        $scope.filterProviderList = angular.copy($scope.BillingProviderList);
        $scope.filterLocationslist.forEach(item => item.IsChecked = true);
        /* Medicare Fee - Start */

        $scope.GetMasterMedicareFeeObj = function () {
            return {
                "UserId": $scope.UserId,
                "OrganizationId": 0,
                "ParentOrganizationId": $scope.ParentHospitalID || 0,
                "MedicareRateId": 0,
                "ProcedureId": 0,
                "ProcedureName": "",
                "CPTCode": "",
                "Procedureobj": "",
                "MedicareYear": 0,
                "DataEntryMode": "",
                "EffectiveFrom": "",
                "EffectiveTo": "",
                "MedicareOfficeFee": null,
                "MedicareASCFee": null,
                "AnesthesiaCost": null,
                "RevenueCode": "",
                "StatusCode": "",
                "StatusCodeId": 0,
                "ModifierCode": "",
                "PCTCIndicator": "",
                "PCTCIndicatorId": 0,
                "GlobalDays": "",
                "GlobalDaysId": 0,
                "MultipleProcedureIndicator": 0,
                "BilateralSurgeryIndicator": 0,
                "AssistantSurgeonIndicator": 0,
                "CoSurgeonIndicator": 0,
                "TeamSurgeonIndicator": 0,
                "PhysicianSupervisionofDiagnosticProcedures": "",
                "PageNumber": 1,
                "PageSize": 10,
                "DeleteInd": "N"
            }
        };

        $scope.MasterMedicareFeeObj = angular.copy($scope.GetMasterMedicareFeeObj());

        $scope.GetMedicareSearchObj = function () {
            return {
                "EffectiveFromDate": "",
                "EffectiveToDate": "",
                "CPTSearchText": "",
                /* empty is "All Locations" - the list then comes back for every
                   location the user has access to, the way it always has */
                "LocationId": ""
            }
        };

        $scope.MedicareSearchObj = angular.copy($scope.GetMedicareSearchObj());

        /* a CPT lives under one location, so picking one narrows the list to it -
           the count and the paging change with it, so it goes back to page one */
        $scope.OnSelectMedicareLocation = function () {
            $scope.MasterMedicareFeeObj.PageNumber = 1;
            $scope.GetProcedureMedicareDetails();
        };

        $scope.GetProcedureMedicareDetails = function (typeid) {

            var Locationids = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
            $scope.MedicareSearchObj.CPTSearchText = $scope.MedicareSearchObj.CPTSearchText || '';
            if ($scope.MedicareSearchObj.CPTSearchText!='') {
                $scope.MasterMedicareFeeObj.PageNumber=1
            }

            var obj = {
                // the picked location, or every one of them when none is picked
                "OrganizationId": $scope.MedicareSearchObj.LocationId || Locationids,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PageSize": 10,
                "PageNumber": $scope.MasterMedicareFeeObj.PageNumber||1,
                "CPTSearchText": $scope.MedicareSearchObj.CPTSearchText,
                "EffectiveFrom": $scope.MedicareSearchObj.EffectiveFromDate,
                "EffectiveTo": $scope.MedicareSearchObj.EffectiveToDate,
                "MedicareYear": new Date().getFullYear()
            }

            eHnoteSettingsDataService.GetProcedureMedicareCosts(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.ProceduresList.length > 0) {
                        resp.data.ProceduresList.forEach(item => item.ActiveInd = 'Y');
                        $scope.AllMedicareFeeList = angular.copy(resp.data.ProceduresList);
                        $scope.MedicareFeeListCount = resp.data.count;

                        typeid = typeid || 0;
                        $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        //if (typeid == 1) {                            
                        //    $scope.FeeSchedulesObj.ProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        //    $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        //}
                    } else {
                        $scope.AllMedicareFeeList = [];
                        $scope.FeeSchedulesObj.ProceduresList = [];
                    }
                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };

        $scope.GetAddFeeProcedureMedicareDetails = function (typeid) {

            var Locationids = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            var obj = {
                /* Always pull every location the user has access to, the Location dropdown
                   filters this list client side through OnSelectFeeLocation(). */
                "OrganizationId": Locationids,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PageSize": 100,
                "PageNumber": 1,
                "CPTSearchText": "",
                "EffectiveFrom": "",
                "EffectiveTo":"",
                "MedicareYear": new Date().getFullYear()
            }

            eHnoteSettingsDataService.GetProcedureMedicareCosts(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.ProceduresList.length > 0) {
                        resp.data.ProceduresList.forEach(item => item.ActiveInd = 'Y');
                        $scope.AllMedicareFeeList = angular.copy(resp.data.ProceduresList);
                        $scope.MedicareFeeListCount = resp.data.count;

                        typeid = typeid || 0;
                        $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        //if (typeid == 1) {
                        //    $scope.FeeSchedulesObj.ProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        //    $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        //}
                        /* Show only the location defaulted on the Add screen, same as picking it from the dropdown. */
                        if ($scope.FeeSchedulesObj.OrganizationId) {
                            $scope.OnSelectFeeLocation();
                        }
                    } else {
                        $scope.AllMedicareFeeList = [];
                        $scope.FeeSchedulesObj.ProceduresList = [];
                    }
                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };

        $scope.switchToNextPage = function (Pageno) {
            $scope.MasterMedicareFeeObj.PageNumber = Pageno;
            $scope.GetProcedureMedicareDetails();
        }

        $scope.ClearMedicareSearch = function () {
            $scope.MedicareSearchObj = angular.copy($scope.GetMedicareSearchObj());
            // clearing widens the list again, so the page it was left on may not exist
            $scope.MasterMedicareFeeObj.PageNumber = 1;
            $scope.GetProcedureMedicareDetails();
        }

        $scope.feeinit = function () {

            $scope.MasterAssistantSurgeonIndicator = [];
            $scope.MasterBilateralSurgeryIndicator = [];
            $scope.MasterCoSurgeonIndicator = [];
            $scope.MasterGlobalSurgeryDays = [];
            $scope.MasterMedicareStatusCodes = [];
            $scope.MasterMultipleProcedureIndicator = [];
            $scope.MasterPctcIndicators = [];
            $scope.MasterPhysicianSupervision = [];
            $scope.MasterSurgeons = [];
            $scope.MasterTeamSurgeonIndicator = [];
            $scope.masterModifierList = [];

            $q.all([
                eHnoteInsuranceService.GetMasterMedicareFeeStructure(),
                eHnoteSettingsDataService.GetAllMasterClaimsData(),
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    $scope.MasterAssistantSurgeonIndicator = resp[0].data.MasterAssistantSurgeonIndicator;
                    $scope.MasterBilateralSurgeryIndicator = resp[0].data.MasterBilateralSurgeryIndicator;
                    $scope.MasterCoSurgeonIndicator = resp[0].data.MasterCoSurgeonIndicator;
                    $scope.MasterGlobalSurgeryDays = resp[0].data.MasterGlobalSurgeryDays;
                    $scope.MasterMedicareStatusCodes = resp[0].data.MasterMedicareStatusCodes;
                    $scope.MasterMultipleProcedureIndicator = resp[0].data.MasterMultipleProcedureIndicator;
                    $scope.MasterPctcIndicators = resp[0].data.MasterPctcIndicators;
                    $scope.MasterPhysicianSupervision = resp[0].data.MasterPhysicianSupervision;
                    $scope.MasterSurgeons = resp[0].data.MasterSurgeons;
                    $scope.MasterTeamSurgeonIndicator = resp[0].data.MasterTeamSurgeonIndicator;
                }
                if (resp[1].data.status === "Success") {
                    $scope.masterModifierList = resp[1].data.Modifiers;
                }

                $scope.GetProcedureMedicareDetails();
            });
        }

        $scope.onselectCptCode = function (item) {

            item = item || null;

            $scope.MasterMedicareFeeObj.ProcedureId = item.ProcedureId || 0;
            $scope.MasterMedicareFeeObj.OrganizationProcedureId = item.OrganizationProcedureId || 0;
            $scope.MasterMedicareFeeObj.ProcedureName = item.ProcedureName || '';
            $scope.MasterMedicareFeeObj.CPTCode = item.CPTCode || '';
            $scope.MasterMedicareFeeObj.ProcedureCode = item.ProcedureCode || '';
            $scope.MasterMedicareFeeObj.ProcedureDescription = item.ProcedureDescription || '';
        };

        $scope.OnSelectModifierName = function (val) {
            $scope.MasterMedicareFeeObj.ModifierCode = val.ModifierCode || '';
        }

        $scope.onStatusCodeSelect = function (id) {
            var List = $filter("filter")($scope.MasterMedicareStatusCodes, { "MedicareStatusCodeId": id }, true) || [];
            if (List.length > 0) {
                $scope.MasterMedicareFeeObj.StatusCode = List[0].Code;
            }
        }

        $scope.onPCTCCodeSelect = function (id) {
            var List = $filter("filter")($scope.MasterPctcIndicators, { "PctcIndicatorId": id }, true) || [];
            if (List.length > 0) {
                $scope.MasterMedicareFeeObj.PCTCIndicator = List[0].Code;
            }
        }

        $scope.onGlobalDaysSelect = function (id) {
            var List = $filter("filter")($scope.MasterGlobalSurgeryDays, { "GlobalSurgeryDaysId": id }, true) || [];
            if (List.length > 0) {
                $scope.MasterMedicareFeeObj.GlobalDays = List[0].Code;
            }
        }

        //$scope.changeCPTProcedure = function (val) {
        //     $scope.MasterMedicareFeeObj.ProcedureId = 0;
        //    $scope.MasterMedicareFeeObj.OrganizationProcedureId = 0;           
        //    $scope.MasterMedicareFeeObj.CPTCode = val || '';
        //    $scope.MasterMedicareFeeObj.ProcedureCode = val || '';
        //}

        $scope.AddUpdateMedicareFeeStructure = function () {

            let ProceduresList = [];

            var dateStr = $scope.MasterMedicareFeeObj.EffectiveFrom;
            var date = new Date(dateStr);
            var Medicareyear = date.getFullYear();

            if ($scope.MasterMedicareFeeObj.OrganizationId == 0) {
                alertify.error('Please select location');
                return false;
            }
            //$scope.MasterMedicareFeeObj.CPTCode=$scope.MasterMedicareFeeObj.CPTCode||'';
            //if ($scope.MasterMedicareFeeObj.CPTCode == '') {
            //    alertify.error('Please enter CPT Code');
            //    return false;
            //}

            if ($scope.MasterMedicareFeeObj.ProcedureId == 0) {
                alertify.error('Please enter CPT Code');
                return false;
            }

            if ($scope.MasterMedicareFeeObj.MedicareOfficeFee == 0) {
                alertify.error('Please enter office fee');
                return false;
            }

            if ($scope.MasterMedicareFeeObj.MedicareASCFee == 0) {
                alertify.error('Please enter facility fee');
                return false;
            }
            if ($scope.MasterMedicareFeeObj.AnesthesiaCost == 0) {
                alertify.error('Please enter Anesthesia Cost');
                return false;
            }

            if ($scope.MasterMedicareFeeObj.EffectiveFrom == "") {
                alertify.error('Please select effective date');
                return false;
            }

            if ($scope.MasterMedicareFeeObj.EffectiveTo == "") {
                alertify.error('Please select end date');
                return false;
            }

            var procedureobj = {
                "MedicareRateId": $scope.MasterMedicareFeeObj.MedicareRateId || 0,
                "OrganizationProcedureId": $scope.MasterMedicareFeeObj.OrganizationProcedureId,
                "ProcedureId": $scope.MasterMedicareFeeObj.ProcedureId,
                "ProcedureName": $scope.MasterMedicareFeeObj.ProcedureName,
                "CPTCode": $scope.MasterMedicareFeeObj.CPTCode,
                "ProcedureCode": $scope.MasterMedicareFeeObj.ProcedureCode,
                "ProcedureDescription": $scope.MasterMedicareFeeObj.ProcedureDescription,
                "MedicareYear": Medicareyear,
                "DataEntryMode": $scope.MasterMedicareFeeObj.DataEntryMode,
                "EffectiveFrom": $scope.MasterMedicareFeeObj.EffectiveFrom,
                "EffectiveTo": $scope.MasterMedicareFeeObj.EffectiveTo,
                "MedicareOfficeFee": $scope.MasterMedicareFeeObj.MedicareOfficeFee,
                "MedicareASCFee": $scope.MasterMedicareFeeObj.MedicareASCFee,
                "AnesthesiaCost": $scope.MasterMedicareFeeObj.AnesthesiaCost,
                "StatusCode": $scope.MasterMedicareFeeObj.StatusCode,
                "StatusCodeId": $scope.MasterMedicareFeeObj.StatusCodeId,
                "ModifierCode": $scope.MasterMedicareFeeObj.ModifierCode,
                "PCTCIndicator": $scope.MasterMedicareFeeObj.PCTCIndicator,
                "PCTCIndicatorId": $scope.MasterMedicareFeeObj.PCTCIndicatorId,
                "GlobalDays": $scope.MasterMedicareFeeObj.GlobalDays,
                "GlobalDaysId": $scope.MasterMedicareFeeObj.GlobalDaysId,
                "MultipleProcedureIndicator": $scope.MasterMedicareFeeObj.MultipleProcedureIndicator,
                "BilateralSurgeryIndicator": $scope.MasterMedicareFeeObj.BilateralSurgeryIndicator,
                "AssistantSurgeonIndicator": $scope.MasterMedicareFeeObj.AssistantSurgeonIndicator,
                "CoSurgeonIndicator": $scope.MasterMedicareFeeObj.CoSurgeonIndicator,
                "TeamSurgeonIndicator": $scope.MasterMedicareFeeObj.TeamSurgeonIndicator,
                "PhysicianSupervisionofDiagnosticProcedures": $scope.MasterMedicareFeeObj.PhysicianSupervisionofDiagnosticProcedures,
                "DeleteInd": $scope.MasterMedicareFeeObj.DeleteInd || "N",
                "RevenueCode": $scope.MasterMedicareFeeObj.RevenueCode || "",
            }

            ProceduresList.push(procedureobj);

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.MasterMedicareFeeObj.OrganizationId || 0,
                "ParentOrganizationId": $scope.ParentHospitalID || 0,
                "ProceduresList": ProceduresList || []
            }

            eHnoteSettingsDataService.AddUpdateProcedureMedicareCosts(obj).success(function (resp) {
                if (resp.Status === "Success") {
                    alertify.success("Medicare fee list added successfully");
                    $scope.IsShowAddNewCPT = false;
                    $scope.IsShowAllFeeList = true;
                    $scope.GetProcedureMedicareDetails();
                } else {
                    alertify.error("The CPT Code already exists for this organization.");
                    
                }
            });
        }

        $scope.EditMedicareFeelist = function (item) {
            $scope.MasterMedicareFeeObj.OrganizationId = item.OrganizationId;
            $scope.MasterMedicareFeeObj.ProcedureId = item.ProcedureId;
            $scope.MasterMedicareFeeObj.ProcedureName = item.ProcedureName;
            $scope.MasterMedicareFeeObj.CPTCode = item.CPTCode;
            $scope.MasterMedicareFeeObj.RevenueCode = item.RevenueCode||"";
            $scope.MasterMedicareFeeObj.ProcedureCode = item.ProcedureCode;
            $scope.MasterMedicareFeeObj.ProcedureDescription = item.ProcedureDescription;
            $scope.MasterMedicareFeeObj.Procedureobj = item.CPTCode + '-' + item.ProcedureName;
            $scope.MasterMedicareFeeObj.MedicareOfficeFee = item.MedicareOfficeFee;
            $scope.MasterMedicareFeeObj.MedicareASCFee = item.MedicareASCFee;
            $scope.MasterMedicareFeeObj.AnesthesiaCost = item.AnesthesiaCost;
            $scope.MasterMedicareFeeObj.MedicareRateId = item.MedicareRateId||0;
            $scope.MasterMedicareFeeObj.MedicareYear = item.MedicareYear;
            $scope.MasterMedicareFeeObj.StatusCode = item.StatusCode;
            $scope.MasterMedicareFeeObj.StatusCodeId = item.StatusCodeId;
            $scope.MasterMedicareFeeObj.ModifierCode = item.ModifierCode;
            var ModifierList = $filter("filter")($scope.masterModifierList, { "ModifierCode": $scope.MasterMedicareFeeObj.ModifierCode }, true) || [];
            if (ModifierList.length > 0) {
                $scope.MasterMedicareFeeObj.ModifierObj = ModifierList[0].ModifierName;
            }
            $scope.MasterMedicareFeeObj.MultipleProcedureIndicator = item.MultipleProcedureIndicator;
            $scope.MasterMedicareFeeObj.AssistantSurgeonIndicator = item.AssistantSurgeonIndicator;
            $scope.MasterMedicareFeeObj.CoSurgeonIndicator = item.CoSurgeonIndicator;
            $scope.MasterMedicareFeeObj.TeamSurgeonIndicator = item.TeamSurgeonIndicator;
            $scope.MasterMedicareFeeObj.BilateralSurgeryIndicator = item.BilateralSurgeryIndicator;
            $scope.MasterMedicareFeeObj.PCTCIndicator = item.PCTCIndicator;
            $scope.MasterMedicareFeeObj.PCTCIndicatorId = item.PCTCIndicatorId;
            $scope.MasterMedicareFeeObj.GlobalDays = item.GlobalDays;
            $scope.MasterMedicareFeeObj.GlobalDaysId = item.GlobalDaysId;
            $scope.MasterMedicareFeeObj.PhysicianSupervisionofDiagnosticProcedures = item.PhysicianSupervisionofDiagnosticProcedures;
            $scope.MasterMedicareFeeObj.EffectiveFrom = $filter('date')(item.EffectiveFrom, "MM-dd-yyyy");
            $scope.MasterMedicareFeeObj.EffectiveTo = $filter('date')(item.EffectiveTo, "MM-dd-yyyy");
            $scope.MasterMedicareFeeObj.CreatedBy = item.CreatedBy;
            $scope.MasterMedicareFeeObj.CreatedDt = item.CreatedDt;
            $scope.MasterMedicareFeeObj.ModifiedBy = item.ModifiedBy;
            $scope.MasterMedicareFeeObj.ModifiedDt = item.ModifiedDt;
            $scope.MasterMedicareFeeObj.DataEntryMode = item.DataEntryMode;

            $scope.IsShowAddNewCPT = true;
            $scope.IsShowAllFeeList = false;
        }

        $scope.DeleteMedicareFeelist = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {

                let ProceduresList = [];
                item.DeleteInd = "Y";
                ProceduresList.push(item);

                var obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": item.OrganizationId || 0,
                    "ParentOrganizationId": item.ParentOrganizationId || 0,
                    "ProceduresList": ProceduresList
                };
                eHnoteSettingsDataService.AddUpdateProcedureMedicareCosts(obj).success(function (resp) {
                    if (resp.Status === "Success") {
                        alertify.success("Medicare fee list Deleted successfully");
                        $scope.GetProcedureMedicareDetails();
                    }
                });
            });
        }

        $scope.ClearMedicareFeeStructure = function () {
            $scope.MasterMedicareFeeObj = angular.copy($scope.GetMasterMedicareFeeObj());
        }

        $scope.switchToAddCPT = function () {
            $scope.IsShowAddNewCPT = true;
            $scope.IsShowAllFeeList = false;
            $scope.MasterMedicareFeeObj = angular.copy($scope.GetMasterMedicareFeeObj());
        };

        $scope.switchToCancelCPT = function () {
            $scope.IsShowAddNewCPT = false;
            $scope.IsShowAllFeeList = true;
            $scope.MasterMedicareFeeObj = angular.copy($scope.GetMasterMedicareFeeObj());
        };

        $scope.exportToExcel = function () {

            if (!$scope.AllMedicareFeeList || !$scope.AllMedicareFeeList.length) {
                alertify.error("No data available to export!");
                return;
            }

            $scope.ShowRecordSaving = true;

            let data = angular.copy($scope.AllMedicareFeeList);

            const mapValue = (list, idKey, valKey, matchValue) => {
                const found = list.find(x => x[idKey] == matchValue);
                return found ? found[valKey] : "";
            };

            const formatCurrency = val => {
                if (val == null || val === "") return "";
                return `$${parseFloat(val).toFixed(2)}`;
            };

            data.forEach(item => {
                item.OrganizationName = mapValue($scope.Locationslist, "ClinicId", "ClinicName", item.OrganizationId) || "";
                item.StatusCode = mapValue($scope.MasterMedicareStatusCodes, "MedicareStatusCodeId", "CodeName", item.StatusCodeId) || "";
                item.PCTCIndName = mapValue($scope.MasterPctcIndicators, "PctcIndicatorId", "CodeName", item.PCTCIndicatorId) || "";
                item.GlobalDays = mapValue($scope.MasterGlobalSurgeryDays, "GlobalSurgeryDaysId", "CodeName", item.GlobalDaysId) || "";
                item.MultiProcedureInd = mapValue($scope.MasterMultipleProcedureIndicator, "MultipleProcedureIndicatorId", "CodeName", item.MultipleProcedureIndicator) || "";
                item.BilatSurgery = mapValue($scope.MasterBilateralSurgeryIndicator, "BilateralSurgeryIndicatorId", "CodeName", item.BilateralSurgeryIndicator) || "";
                item.AsstSurgery = mapValue($scope.MasterAssistantSurgeonIndicator, "AssistantSurgeonIndicatorId", "IndicatorDescription", item.AssistantSurgeonIndicator) || "";
                item.CoSurgery = mapValue($scope.MasterCoSurgeonIndicator, "CoSurgeonIndicatorId", "IndicatorDescription", item.CoSurgeonIndicator) || "";
                item.TeamSurgery = mapValue($scope.MasterTeamSurgeonIndicator, "TeamSurgeonIndicatorId", "IndicatorDescription", item.TeamSurgeonIndicator) || "";
                item.PhysSupervisionDxProc = mapValue($scope.MasterPhysicianSupervision, "SupervisionCode", "SupervisionDescription", item.PhysicianSupervisionofDiagnosticProcedures) || "";

                item.EffectiveFrom = $filter('date')(item.EffectiveFrom, "MM-dd-yyyy") || "";
                item.EffectiveTo = $filter('date')(item.EffectiveTo, "MM-dd-yyyy") || "";

                item.MedicareOfficeFee = formatCurrency(item.MedicareOfficeFee) || "";
                item.MedicareASCFee = formatCurrency(item.MedicareASCFee) || "";
                item.AnesthesiaCost = formatCurrency(item.AnesthesiaCost) || "";
            });

            const exportData = data.map(item => ({
                "Location": item.OrganizationName,
                "CPT Code": item.CPTCode,
                "Modifiers": item.ModifierCode,
                "Description": item.ProcedureName,
                "Status Code": item.StatusCode,
                "Office Fee": item.MedicareOfficeFee,
                "Facility Fee": item.MedicareASCFee,
                "Anesthesia Cost": item.AnesthesiaCost,
                "Effective Date": item.EffectiveFrom,
                "End Date": item.EffectiveTo,
                "PCTC IND": item.PCTCIndName,
                "Glob. Days": item.GlobalDays,
                "Multi Proc.": item.MultiProcedureInd,
                "Bilat. Surgery": item.BilatSurgery,
                "Asst. Surgery": item.AsstSurgery,
                "Co-Surgery": item.CoSurgery,
                "Team Surgery": item.TeamSurgery,
                "Phys. Supervision - Dx Proc": item.PhysSupervisionDxProc
            }));

            let ws = XLSX.utils.json_to_sheet(exportData);

            ws['!cols'] = Object.keys(exportData[0]).map(k => ({ wch: k.length + 8 }));

            const headerRange = XLSX.utils.decode_range(ws['!ref']);
            for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        font: { bold: true, color: { rgb: "000000" } },
                        fill: { fgColor: { rgb: "D9D9D9" } }, // light gray
                        alignment: { horizontal: "center", vertical: "center" }
                    };
                }
            }

            setTimeout(function () {
                $scope.ShowRecordSaving = false;
                $scope.$apply();
                let wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "MedicareFeeList");
                XLSX.writeFile(wb, "Medicare_Fee_List.xlsx");
            }, 1000); // 1 seconds

        };

        /* Import Excel File */

        $scope.importFile = null;

        $scope.triggerImport = function () {
            document.getElementById("importExcel").click();
        };

        $scope.resetImportFile = function () {
          $("#importExcel").val(null);
        };

        $scope.fetchProcedure = function (cpt, desc) {
            return $scope.GetOrganizationProcedureDetailsforexcel(cpt).then(function (list) {

                if (!list || !list.length) return null;

                let byCPT = list.find(x => x.CPTCode == cpt);
                if (byCPT) return byCPT;

                let byDesc = list.find(x => x.ProcedureName.trim().toUpperCase() === desc.trim().toUpperCase());
                if (byDesc) return byDesc;

                return null;
            });
        };


        $scope.importExcel = function (file) {

            const allowedExtensions = [".xlsx", ".xls"];
            const fileName = file.name.toLowerCase();
            const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

            if (!isValid) {
                alertify.error("Only Excel files (.xlsx, .xls) are allowed");
                return false;
            }

            let reader = new FileReader();

            reader.onload = async function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: "array" });

                let sheetName = workbook.SheetNames[0];
                let sheet = workbook.Sheets[sheetName];

                let json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                if (!json.length) {
                    alertify.error("Please Enetr Location!");
                    return;
                }
               
                let finalList = [];

                for (let i = 0; i < json.length; i++) {

                    let row = json[i];
                    let r = i + 1;

                    let cpt = (row["CPT Code"] || "").toString().trim();
                    let Proccpt = (row["Procedure Code"] || "").toString().trim();
                    let desc = row["Description"]?.trim();
                    let excelLocation = row["Location"]?.trim();
                    let modifier = row["Modifiers"]?.toString().trim();
                   // let statusCode = row["Status Code"]?.toString().trim();
                    let procResp = await $scope.fetchProcedure(cpt, desc);

                    let orgName = getIdFromName($scope.Locationslist, "ClinicName", excelLocation, "ClinicName");
                    let orgId = getIdFromName($scope.Locationslist, "ClinicName", excelLocation, "ClinicId");

                    let MedicareOfficeFee = parseFee(row["Office Fee"]);
                    let MedicareASCFee = parseFee(row["Facility Fee"]);
                    let AnesthesiaCost = parseFee(row["Anesthesia Cost"]);                 


                    if (!excelLocation)
                        return alertError(`Row ${r}: Location is required.`);
               
                    // Validation
                    if (!orgName) return alertError(`Invalid Location Name → '${excelLocation}'`);
                    if (!orgId) return alertError(`ClinicId not found for → '${excelLocation}'`);
                    if (!procResp)
                        return alertError(`Row ${r}: Procedure not found → CPT: '${cpt}', Desc: '${desc}'`);

                    if (!Proccpt)
                        return alertError(`Row ${r}: Proccpt is required.`);
                    if (!MedicareOfficeFee || MedicareOfficeFee === 0)
                        return alertError(`Row ${r}: Office Fee is required.`);

                    if (!MedicareASCFee || MedicareASCFee === 0)
                        return alertError(`Row ${r}: Facility Fee is required.`);

                    if (!AnesthesiaCost || AnesthesiaCost === 0)
                        return alertError(`Row ${r}: Anesthesia Cost is required.`);

                    let effectiveFrom = formatDate(row["Effective Date"]);
                    let effectiveTo = formatDate(row["End Date"]);

                    // validate after declaring
                    if (!effectiveFrom)
                        return alertError(`Row ${r}: Effective Date is required.`);

                    if (!effectiveTo)
                        return alertError(`Row ${r}: End Date is required.`);

                    //if (procResp.CPTCode?.trim() !== cpt)
                    //    return alertError(`Row ${r}: CPT mismatch → File: '${cpt}', System: '${procResp.CPTCode}'`);

                    //if (procResp.ProcedureName?.trim().toLowerCase() !== desc?.toLowerCase())
                    //    return alertError(`Row ${r}: Procedure Name mismatch → File: '${desc}', System: '${procResp.ProcedureName}'`);

                    let modifierCode = modifier && modifier.toString().trim() !== ""
                        ? getIdFromName($scope.masterModifierList, "ModifierCode", modifier, "ModifierCode")
                        : null;

                    let statusCodeId = row["Status Code"] && row["Status Code"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterMedicareStatusCodes, "CodeName", row["Status Code"], "MedicareStatusCodeId")
                        : null;

                    let pctcId = row["PCTC IND"] && row["PCTC IND"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterPctcIndicators, "CodeName", row["PCTC IND"], "PctcIndicatorId")
                        : null;

                    let globalDaysId = row["Glob. Days"] && row["Glob. Days"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterGlobalSurgeryDays, "CodeName", row["Glob. Days"], "GlobalSurgeryDaysId")
                        : null;

                    let multiProcId = row["Multi Proc."] && row["Multi Proc."].toString().trim() !== ""
                        ? getIdFromName($scope.MasterMultipleProcedureIndicator, "CodeName", row["Multi Proc."], "MultipleProcedureIndicatorId")
                        : null;

                    let bilatId = row["Bilat. Surgery"] && row["Bilat. Surgery"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterBilateralSurgeryIndicator, "CodeName", row["Bilat. Surgery"], "BilateralSurgeryIndicatorId")
                        : null;

                    let asstId = row["Asst. Surgery"] && row["Asst. Surgery"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterAssistantSurgeonIndicator, "IndicatorDescription", row["Asst. Surgery"], "AssistantSurgeonIndicatorId")
                        : null;

                    let coSurgId = row["Co-Surgery"] && row["Co-Surgery"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterCoSurgeonIndicator, "IndicatorDescription", row["Co-Surgery"], "CoSurgeonIndicatorId")
                        : null;

                    let teamSurgId = row["Team Surgery"] && row["Team Surgery"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterTeamSurgeonIndicator, "IndicatorDescription", row["Team Surgery"], "TeamSurgeonIndicatorId")
                        : null;

                    let dxSuperId = row["Phys. Supervision - Dx Proc"] && row["Phys. Supervision - Dx Proc"].toString().trim() !== ""
                        ? getIdFromName($scope.MasterPhysicianSupervision, "SupervisionDescription", row["Phys. Supervision - Dx Proc"], "SupervisionCode")
                        : null;


             

                

                    if (modifier && modifier.toString().trim() !== "" && !modifierCode)
                        return alertError(`Row ${r}: Invalid Modifier → '${modifier}'`);

                    if (row["Status Code"] && row["Status Code"].toString().trim() !== "" && !statusCodeId)
                        return alertError(`Row ${r}: Invalid Status Code → '${row["Status Code"]}'`);

                    if (row["PCTC IND"] && row["PCTC IND"].toString().trim() !== "" && !pctcId)
                        return alertError(`Row ${r}: Invalid PCTC Indicator → '${row["PCTC IND"]}'`);

                    if (row["Glob. Days"] && row["Glob. Days"].toString().trim() !== "" && !globalDaysId)
                        return alertError(`Row ${r}: Invalid Global Days → '${row["Glob. Days"]}'`);

                    if (row["Multi Proc."] && row["Multi Proc."].toString().trim() !== "" && !multiProcId)
                        return alertError(`Row ${r}: Invalid Multi Proc → '${row["Multi Proc."]}'`);

                    if (row["Bilat. Surgery"] && row["Bilat. Surgery"].toString().trim() !== "" && !bilatId)
                        return alertError(`Row ${r}: Invalid Bilateral Indicator → '${row["Bilat. Surgery"]}'`);

                    if (row["Asst. Surgery"] && row["Asst. Surgery"].toString().trim() !== "" && !asstId)
                        return alertError(`Row ${r}: Invalid Assistant Surgery → '${row["Asst. Surgery"]}'`);

                    if (row["Co-Surgery"] && row["Co-Surgery"].toString().trim() !== "" && !coSurgId)
                        return alertError(`Row ${r}: Invalid Co-Surgery → '${row["Co-Surgery"]}'`);

                    if (row["Team Surgery"] && row["Team Surgery"].toString().trim() !== "" && !teamSurgId)
                        return alertError(`Row ${r}: Invalid Team Surgery → '${row["Team Surgery"]}'`);

                    if (row["Phys. Supervision - Dx Proc"] && row["Phys. Supervision - Dx Proc"].toString().trim() !== "" && !dxSuperId)
                        return alertError(`Row ${r}: Invalid Dx Supervision → '${row["Phys. Supervision - Dx Proc"]}'`);
                   
                    finalList.push({
                        CPTCode: cpt,
                        ProcedureCode: cpt,
                        ProcedureName: procResp.ProcedureName,
                        ProcedureId: procResp.ProcedureId,
                        ModifierCode: modifierCode,
                        MedicareOfficeFee: parseFee(row["Office Fee"]),
                        MedicareASCFee: parseFee(row["Facility Fee"]),
                        AnesthesiaCost: parseFee(row["Anesthesia Cost"]),
                        EffectiveFrom: effectiveFrom,
                        EffectiveTo: effectiveTo,
                        MedicareYear: new Date().getFullYear(),
                        OrganizationName: orgName,
                        OrganizationId: orgId,
                        StatusCodeId: statusCodeId,
                        StatusCode: row["Status Code"],
                        PCTCIndicator: row["PCTC IND"],
                        PCTCIndicatorId: pctcId,
                        GlobalDays: row["Glob. Days"],
                        GlobalDaysId: globalDaysId,
                        MultipleProcedureIndicator: multiProcId,
                        BilateralSurgeryIndicator: bilatId,
                        AssistantSurgeonIndicator: asstId,
                        CoSurgeonIndicator: coSurgId,
                        TeamSurgeonIndicator: teamSurgId,
                        PhysicianSupervisionofDiagnosticProcedures: dxSuperId,
                        DeleteInd: "N"
                    });

                }

                function alertError(msg) {
                    alertify.error(msg);
                    return false;
                }

                $scope.ExcelImportedList = finalList;
                $scope.$apply();
                $scope.importMedicareFee();
            };

            reader.readAsArrayBuffer(file);
        };      

        function parseFee(value) {
            if (value == null) return 0;

            let str = value.toString().trim();

            str = str.replace(/[$,]/g, "");

            const num = parseFloat(str);
            return isNaN(num) ? 0 : num;
        }

        function formatDate(val) {
            if (val === null || val === undefined || val === "") return null;
            let d;
            if (val instanceof Date) {
                d = val;
            } else if (typeof val === "number") {
                d = new Date(Math.round((val - 25569) * 86400 * 1000));
                d = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
            } else {
                d = moment(val).toDate();
            }
            return isNaN(d.getTime()) ? null : moment(d).format("MM-DD-YYYY");
        }

        function getIdFromName(list, nameKey, nameValue, idKey) {
            if (!nameValue) return null;
            let found = list.find(x => x[nameKey] == nameValue);
            return found ? found[idKey] : null;
        }

        $scope.importMedicareFee = function () {
            if (!$scope.ExcelImportedList || !$scope.ExcelImportedList.length) {
                alertify.error("Please import an Excel file first!");
                return;
            }

            const req = {
                "UserId": $scope.UserId,
                "MedicareFeeList": $scope.ExcelImportedList
            };


            eHnoteSettingsDataService.ImportMedicareFee(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.GetProcedureMedicareDetails();
                    alertify.success("Medicare Fee List Imported Successfully");
                    document.getElementById("fileUpload").value = "";
                   
                } else {
                    alertify.error("Import failed");
                }
            });
        };

        $scope.GetOrganizationProcedureDetails = function (text) {
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
                "ParentOrganizationId": $scope.ParentHospitalID || null
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

          //  return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
            return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
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

        $scope.GetOrganizationProcedureDetailsforexcel = function (text) {
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
                "ParentOrganizationId": $scope.ParentHospitalID || null
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

          //  return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
            return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
                if (resp.data.rows !== undefined) {

                    return resp.data.rows                       
                        .map(function (item) {
                            return item;
                        });
                }
            });
        };

        /* Medicare Fee - End */

       /* Fee Schedules - Start */
        $scope.GetFeeSchedulesObj = function () {
            return {
                "UserId": $scope.UserId,
                "FeeScheduleId": 0,
                "FeeScheduleName": "",
                "ParentOrganizationId": 0,
                "OrganizationId": 0,
                "MedicareYear": 0,
                "EffectiveFrom": "",
                "EffectiveTo": "",
                "ScheduleTypeId": 2,
                "ScheduleType": "% of Medicare",
                "MedicarePercentValue": null,
                "DefaultFee": null,
                "RVU": null,
                "PayorGroupId": null,
                "ProviderGroupId": 0,
                "AvailableFor": "",
                "IsAvailableForInsurance": false,
                "IsAvailableForPatientBill": false,
                "IsActive": false,
                "CreatedBy": 0,
                "CreatedDate": $filter('date')(new Date(), "MM-dd-yyyy HH:mm:ss"),
                "ModifiedBy": 0,
                "ModifiedDate": $filter('date')(new Date(), "MM-dd-yyyy HH:mm:ss"),
                "PayorObj": "",
                "PayorGroupObj": "",
                "Procedureobj": "",
                "PayorSelectionType": "Payer",
                "Payors": [],
                "Providers": [],
                "filterProceduresList": [],
                "DisplayProceduresList": [],
                "ProceduresList": [],
                "TempProceduresList": [],
                "SelectedPayors": [],
                "SearchProcedure": "",
                "SelectPayorText": "Select Payer",
                "SelectProviderText": "All",
                "PayerIds": "",
                "ProviderIds": "",
                "LocationIds": "",
                "StatusNames": "",
                "PageNumber": 1,
                "CostPageNumber": 1,
                "PageSize": 10,
                "CostPageSize": 10,
            }
        };

        $scope.FeeSchedulesObj = angular.copy($scope.GetFeeSchedulesObj());

        $scope.GetStatusList = function () {
            return [
                { StatusId: 1, StatusName: "Active" },
                { StatusId: 2, StatusName: "InActive" }
            ];
        };

        $scope.ChangeFeeScheduleType = function (val) {
            if (val == 'PatientBill') {
                $scope.FeeSchedulesObj.IsAvailableForPatientBill = true;
                $scope.FeeSchedulesObj.IsAvailableForInsurance = false;
            }
            else if (val == 'Insurance') {
                $scope.FeeSchedulesObj.IsAvailableForInsurance = true;
                $scope.FeeSchedulesObj.IsAvailableForPatientBill = false;
            } else {
                $scope.FeeSchedulesObj.IsAvailableForInsurance = false;
                $scope.FeeSchedulesObj.IsAvailableForPatientBill = false;
            }
        };
        $scope.StatusList = angular.copy($scope.GetStatusList());

        $scope.FilteredPayorList = [];
        let payorSearchTimeout = null;

        $scope.createfeeschedule = false;

        /* Location the user picked while logging in, only when it is one of the locations
           listed in the dropdown. Returns 0 so the field stays on "Select" otherwise. */
        $scope.GetLoginLocationId = function () {
            var loginLocation = $filter("filter")($scope.Locationslist, { "ClinicId": $scope.HospitalId }, true)[0];
            return loginLocation ? loginLocation.ClinicId : 0;
        };

        $scope.AddFeeScheduleDetails = function (typeid) {
            $scope.FeeSchedulesObj = angular.copy($scope.GetFeeSchedulesObj());
            $scope.FeeSchedulesObj.OrganizationId = $scope.GetLoginLocationId();
            $scope.FeeSchedulesObj.Providers = angular.copy($scope.BillingProviderList);
            $scope.FilteredPayorList = [];
            $scope.createfeeschedule = true;
            $scope._lastCreateFeePayorSearchText = null;
            $scope.GetAddFeeProcedureMedicareDetails(typeid);
        }

        $scope.closeschedule = function () {
            $scope.createfeeschedule = false;
        }

        $scope.GetOrganizationPayorGroupList = function (val) {

            var param = {
                "SearchText": val || "",
                "PageSize": 10,
                "PageNumber": 1,
                "OrganizationId": $scope.FeeSchedulesObj.OrganizationId||$scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalID
            };
            return eHnoteInsuranceService.GetOrganizationPayorGroups(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };


        $scope.SearchPayorList = function (type) {

            type = type || "";
            var SearchText = "";

            if ($scope.activeFeeTab === 4) {
                SearchText = $scope.FinalFeeObj.PayorObj || "";
            } else if ($scope.activeFeeTab === 2) {
                SearchText = $scope.FeeSchedulesObj.PayorObj || "";
            }
            else if ($scope.activeFeeTab === 1) {
                SearchText = $scope.PayorWiseCptObj.PayorObj || "";
            }

            if (payorSearchTimeout) {
                $timeout.cancel(payorSearchTimeout);
            }

            payorSearchTimeout = $timeout(function () {
                const param = {
                    "SearchText": SearchText.trim(),
                    "Status": "Active",
                    "PageSize": 10,
                    "PageNumber": 1,
                    "UserId": $scope.UserId,
                    "SpecializationId": $scope.SpecializationId,
                    "OrganizationId": $scope.HospitalId,
                    "ParentOrganizationId": $scope.ParentHospitalID,
                    "GetAllIndicator": 0,
                    "PayorId": 0,
                    "PayorTypeId": 0
                };

                eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                    if (resp.data && resp.data.rows) {
                        const rows = resp.data.rows.map(function (item) {
                            item.IsChecked = $scope.FeeSchedulesObj.SelectedPayors.some(p => p.PayorId === item.PayorId);
                            return item;
                        });
                        $scope.FilteredPayorList = rows;
                    }

                    $scope.FilteredPayorList.unshift({
                        PayorName: "All Payers",
                        PayorId: 0,
                        OrganizationPayorId: 0
                    });
                    $scope.FilteredPayorList.forEach(item => item.IsChecked = false);
                    $scope.FeeSchedulesObj.SelectPayorText = "Select Payer";
                });

            }, 300);
        };

        $scope.GetOrganizationNewPayorAllList = function (val) {

            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };

        $scope.ChangeInsurancePayor = function (obj) {
          //  $scope.FinalFeeObj.PayorId = obj.PayorId;        
            $scope.FinalFeeObj.PayorId = obj.OrganizationPayorId;
 
        }


        $scope.togglePayorSelection = function (item) {

            if (item.OrganizationPayorId === 0) {
                $scope.FilteredPayorList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.FilteredPayorList
                .filter(branch => branch.OrganizationPayorId !== 0)
                .every(branch => branch.IsChecked);

            const allPayorItem = $scope.FilteredPayorList.find(branch => branch.OrganizationPayorId === 0);

            if (allPayorItem) {
                allPayorItem.IsChecked = allNonZeroChecked;
            }

            const checkedPayors = $scope.FilteredPayorList.filter(branch => branch.IsChecked);
            const totalPayors = $scope.FilteredPayorList.length;

            if (item.OrganizationPayorId === 0) {
                if (checkedPayors.length > 0) {
                    checkedPayors.forEach(payor => {
                        if (!$scope.FeeSchedulesObj.Payors.some(x => x.OrganizationPayorId === payor.OrganizationPayorId)) {
                            $scope.FeeSchedulesObj.Payors.push(angular.copy(payor));
                        } else {
                            const p = $scope.FeeSchedulesObj.Payors.find(x => x.OrganizationPayorId === payor.OrganizationPayorId);
                            p.DeleteInd = !payor.IsChecked ? "Y" : "N";
                            p.IsChecked = payor.IsChecked;
                        }
                    });
                } else {
                    $scope.FilteredPayorList.forEach(payor => {
                        const p = $scope.FeeSchedulesObj.Payors.find(x => x.OrganizationPayorId === payor.OrganizationPayorId);
                        if (!p || payor.IsChecked) return;
                        p.FeeScheduleSummaryPayorId = p.FeeScheduleSummaryPayorId || 0;
                        if (p.FeeScheduleSummaryPayorId === 0) {
                            $scope.FeeSchedulesObj.Payors = $scope.FeeSchedulesObj.Payors.filter(x => x.OrganizationPayorId !== payor.OrganizationPayorId);
                        } else {
                            p.DeleteInd = "Y";
                            p.IsChecked = false;
                        }
                    });
                }
            } else {
                const index = $scope.FeeSchedulesObj.Payors.findIndex(x => x.OrganizationPayorId === item.OrganizationPayorId);
                if (item.IsChecked && index === -1) {
                    $scope.FeeSchedulesObj.Payors.push(angular.copy(item));
                } else {
                    const p = $scope.FeeSchedulesObj.Payors.find(x => x.OrganizationPayorId === item.OrganizationPayorId);
                    p.FeeScheduleSummaryPayorId = p.FeeScheduleSummaryPayorId || 0;
                    if (p.FeeScheduleSummaryPayorId === 0 && !item.IsChecked) {
                        $scope.FeeSchedulesObj.Payors = $scope.FeeSchedulesObj.Payors.filter(x => x.OrganizationPayorId !== item.OrganizationPayorId);
                    } else if ((p.FeeScheduleSummaryPayorId !== 0 && item.IsChecked) || (p.FeeScheduleSummaryPayorId === 0 && item.IsChecked)) {
                        p.DeleteInd = "N";
                        p.IsChecked = true;
                    } else {
                        p.DeleteInd = "Y";
                        p.IsChecked = false;
                    }
                }
            }

            $scope.FeeSchedulesObj.Payors = $scope.FeeSchedulesObj.Payors.filter(x => {
                x.FeeScheduleSummaryPayorId = x.FeeScheduleSummaryPayorId || 0;
                return (x.FeeScheduleSummaryPayorId !== 0) || (x.IsChecked && x.OrganizationPayorId !== 0);
            });

            $scope.FeeSchedulesObj.SelectPayorText = checkedPayors.length === totalPayors ? "All" : checkedPayors.length === 1 ? (checkedPayors[0].PayorName || "Select Payer") : checkedPayors.length > 1 ? "Selected" : "Select Payer";

        };

        $scope.OnSelectProvider = function (item) {

            if (item.OrganizationBillingProviderId === 0) {
                $scope.FeeSchedulesObj.Providers.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                    branch.DeleteInd = (!branch.IsChecked && branch.FeeScheduleSummaryProviderId != 0) ? "Y" : "N";
                });
            } else {
                item.DeleteInd = (!item.IsChecked && item.FeeScheduleSummaryProviderId != 0) ? "Y" : "N";
            }

            const allNonZeroChecked = $scope.FeeSchedulesObj.Providers
                .filter(branch => branch.OrganizationBillingProviderId !== 0)
                .every(branch => branch.IsChecked);

            const allLocationItem = $scope.FeeSchedulesObj.Providers.find(branch => branch.OrganizationBillingProviderId === 0);

            if (allLocationItem) {
                allLocationItem.IsChecked = allNonZeroChecked;
            }

            const checkedProvider = $scope.FeeSchedulesObj.Providers.filter(branch => branch.IsChecked);
            const totalProvider = $scope.FeeSchedulesObj.Providers.length;

            $scope.FeeSchedulesObj.SelectProviderText = checkedProvider.length === totalProvider ? "All" : checkedProvider.length === 1 ? (checkedProvider[0].BillingProviderName || "Select") : checkedProvider.length > 1 ? "Selected" : "Select";
        };

        $scope._lastCreateFeePayorSearchText = null;

        $scope.onPayorDropdownOpen = function (text) {

            text = text || "";
            const isDefaultSelection = $scope.FeeSchedulesObj.SelectPayorText === "Select Payer";

            if (isDefaultSelection && text === $scope._lastCreateFeePayorSearchText) {
                return;
            }

            if (!text && isDefaultSelection) {
                $scope._lastCreateFeePayorSearchText = text;
                $scope.SearchPayorList();
            }
        };

        $scope.stopClosingDropDown = function (e) {
            e.stopPropagation();
        };

        $scope.RemoveSelectedPayors = function (item) {
            if (item && item.IsChecked !== undefined) {
                item.IsChecked = false;
                item.DeleteInd = item.FeeScheduleSummaryPayorId != 0 ? "Y" : "N";

                if ($scope.FilteredPayorList.length > 0) {
                    $scope.FilteredPayorList.forEach(x => {
                        if (x.OrganizationPayorId === item.OrganizationPayorId || x.OrganizationPayorId === 0) {
                            x.IsChecked = false;
                        }
                    });

                    const checkedPayors = $scope.FilteredPayorList.filter(branch => branch.IsChecked);
                    const totalPayors = $scope.FilteredPayorList.length;
                    $scope.FeeSchedulesObj.Payors = $scope.FeeSchedulesObj.Payors.filter(x => {
                        x.FeeScheduleSummaryPayorId = x.FeeScheduleSummaryPayorId || 0;
                        return (x.FeeScheduleSummaryPayorId !== 0) || (x.IsChecked && x.OrganizationPayorId !== 0);
                    });
                    $scope.FeeSchedulesObj.SelectPayorText = checkedPayors.length === totalPayors ? "All" : checkedPayors.length === 1 ? (checkedPayors[0].PayorName || "Select Payer") : checkedPayors.length > 1 ? "Selected" : "Select Payer";
                }
            }
        };

        $scope.RemoveSelectedProviders = item => {

            if (!item || item.IsChecked === undefined) return;
            item.IsChecked = false;
            item.DeleteInd = item.FeeScheduleSummaryProviderId ? "Y" : "N";

            const fs = $scope.FeeSchedulesObj.Providers;
            fs.forEach(x => x.IsChecked = (x.OrganizationBillingProviderId === item.OrganizationBillingProviderId || x.OrganizationBillingProviderId === 0) ? false : x.IsChecked);

            const checked = fs.filter(x => x.IsChecked);
            $scope.FeeSchedulesObj.SelectProviderText = checked.length === fs.length ? "All" : checked.length === 1 ? checked[0].BillingProviderName || "Select" : checked.length > 1 ? "Selected" : "Select";
        };


        $scope.RemoveSelectedGroupPayors = function (item) {
            if (item && item.IsChecked !== undefined) {
                item.IsChecked = false;
            }
        };

        $scope.OnSelectGroupPayor = function (item) {
            item.GroupPayors.forEach(p => {
                if (!$scope.FeeSchedulesObj.Payors.some(x => x.PayorId === p.MasterPayorId)) {
                    p.IsChecked = true;
                    p.PayorId = p.MasterPayorId;
                    p.PayorName = p.MasterPayorName;
                    $scope.FeeSchedulesObj.Payors.push(p);
                }
            });
        }

        $scope.changeScheduleType = function () {
            $scope.FeeSchedulesObj.SearchProcedure = "";
            $scope.filterProcedures();
        }

        //$scope.calculateFee = function (value, typeid) {

        //    const isValidValue = value != null && value !== '' && !isNaN(value);
        //    const multiplier = isValidValue ? (1 + (parseFloat(value) / 100)) : 1;

        //    if (typeid === 1 && $scope.FeeSchedulesObj.DefaultFee) {
        //        $scope.FeeSchedulesObj.RVU = null;
        //        $scope.FeeSchedulesObj.MedicarePercentValue = null;
        //    }
        //    if (typeid === 2 && $scope.FeeSchedulesObj.MedicarePercentValue) {
        //        $scope.FeeSchedulesObj.DefaultFee = null;
        //        $scope.FeeSchedulesObj.RVU = null;
        //    }
        //    if (typeid === 3 && $scope.FeeSchedulesObj.RVU) {
        //        $scope.FeeSchedulesObj.DefaultFee = null;
        //        $scope.FeeSchedulesObj.MedicarePercentValue = null;
        //    }

        //    const orgId = $scope.FeeSchedulesObj.OrganizationId || null;
        //    let procedurelist = $scope.FeeSchedulesObj.filterProceduresList;

        //    if (orgId != null) {
        //        procedurelist = $filter('filter')(procedurelist, { OrganizationId: orgId }, true) || [];
        //    }

        //    procedurelist.forEach(item => {

        //        item.OriginalAnesthesiaFee = item.OriginalAnesthesiaFee ?? parseFloat(item.AnesthesiaCost || 0).toFixed(2);
        //        item.OriginalASCFee = item.OriginalASCFee ?? parseFloat(item.MedicareASCFee || 0).toFixed(2);
        //        item.OriginalOfficeFee = item.OriginalOfficeFee ?? parseFloat(item.MedicareOfficeFee || 0).toFixed(2);

        //        const Anesthesia = parseFloat(item.OriginalAnesthesiaFee);
        //        const asc = parseFloat(item.OriginalASCFee);
        //        const off = parseFloat(item.OriginalOfficeFee);

        //        if (isValidValue) {
        //            if (typeid === 1 || typeid === 2) {
        //                // Percentage-based calculation
        //                if (parseFloat(value) !== 0) {
        //                    item.AnesthesiaCost = +(Anesthesia * multiplier).toFixed(2);
        //                    item.MedicareASCFee = +(asc * multiplier).toFixed(2);
        //                    item.MedicareOfficeFee = +(off * multiplier).toFixed(2);
        //                } else {
        //                    item.AnesthesiaCost = +Anesthesia.toFixed(2);
        //                    item.MedicareASCFee = +asc.toFixed(2);
        //                    item.MedicareOfficeFee = +off.toFixed(2);
        //                }
        //            } else if (typeid === 3) {
        //                // Direct multiplication by value
        //                item.AnesthesiaCost = +(Anesthesia * parseFloat(value)).toFixed(2);
        //                item.MedicareASCFee = +(asc * parseFloat(value)).toFixed(2);
        //                item.MedicareOfficeFee = +(off * parseFloat(value)).toFixed(2);
        //            }
        //        } else {
        //            // Reset to original if invalid input
        //            item.AnesthesiaCost = +Anesthesia.toFixed(2);
        //            item.MedicareASCFee = +asc.toFixed(2);
        //            item.MedicareOfficeFee = +off.toFixed(2);
        //        }
        //    });

        //    $scope.FeeSchedulesObj.ProceduresList = angular.copy(procedurelist);
        //};

        $scope.calculateFee = function (value, typeid) {

            const isValidValue = value != null && value !== '' && !isNaN(value);
            const multiplier = isValidValue ? (1 + (parseFloat(value) / 100)) : 1;

           
            if (typeid === 2 && $scope.FeeSchedulesObj.MedicarePercentValue) {
                $scope.FeeSchedulesObj.DefaultFee = null;
                $scope.FeeSchedulesObj.RVU = null;
            }
           

            const orgId = $scope.FeeSchedulesObj.OrganizationId || null;
            let procedurelist = $scope.FeeSchedulesObj.filterProceduresList;

            if (orgId != null) {
                procedurelist = $filter('filter')(procedurelist, { OrganizationId: orgId }, true) || [];
            }

            procedurelist.forEach(item => {

                item.OriginalAnesthesiaFee = item.OriginalAnesthesiaFee ?? parseFloat(item.AnesthesiaCost || 0).toFixed(2);
                item.OriginalASCFee = item.OriginalASCFee ?? parseFloat(item.MedicareASCFee || 0).toFixed(2);
                item.OriginalOfficeFee = item.OriginalOfficeFee ?? parseFloat(item.MedicareOfficeFee || 0).toFixed(2);

                const Anesthesia = parseFloat(item.OriginalAnesthesiaFee);
                const asc = parseFloat(item.OriginalASCFee);
                const off = parseFloat(item.OriginalOfficeFee);

                if (isValidValue) {
                    if (typeid === 1 || typeid === 2) {
                        // Percentage-based calculation
                        if (parseFloat(value) !== 0) {
                            item.AnesthesiaCost = +(Anesthesia * multiplier).toFixed(2);
                            item.MedicareASCFee = +(asc * multiplier).toFixed(2);
                            item.MedicareOfficeFee = +(off * multiplier).toFixed(2);
                        } else {
                            item.AnesthesiaCost = +Anesthesia.toFixed(2);
                            item.MedicareASCFee = +asc.toFixed(2);
                            item.MedicareOfficeFee = +off.toFixed(2);
                        }
                    } else if (typeid === 3) {
                        // Direct multiplication by value
                        item.AnesthesiaCost = +(Anesthesia * parseFloat(value)).toFixed(2);
                        item.MedicareASCFee = +(asc * parseFloat(value)).toFixed(2);
                        item.MedicareOfficeFee = +(off * parseFloat(value)).toFixed(2);
                    }
                } else {
                    // Reset to original if invalid input
                    item.AnesthesiaCost = +Anesthesia.toFixed(2);
                    item.MedicareASCFee = +asc.toFixed(2);
                    item.MedicareOfficeFee = +off.toFixed(2);
                }
            });

            $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(procedurelist);
        };


        $scope.FeeswitchToNextPage = function (Pageno) {
            $scope.FeeSchedulesObj.PageNumber = Pageno;
            $scope.GetCptFeeScheduleDetails();
        }

        $scope.GetCptFeeScheduleDetails = function () {

            $scope.FeeSchedulesObj.LocationIds = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");

            $scope.FeeSchedulesObj.ProviderIds = $scope.filterProviderList
                .filter(branch => branch.IsChecked && branch.OrganizationBillingProviderId !== 0)
                .map(branch => branch.OrganizationBillingProviderId)
                .join(",");


            var obj = {
                "OrganizationId": $scope.FeeSchedulesObj.LocationIds || "",
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PayerIds": $scope.FeeSchedulesObj.PayerIds || "",
                "ProviderIds": $scope.FeeSchedulesObj.ProviderIds || "",
                "Status": $scope.FeeSchedulesObj.StatusName || "Active",
                "MedicareYear": new Date().getFullYear(),
                "PageNumber": $scope.FeeSchedulesObj.PageNumber||1,
                "PageSize": $scope.FeeSchedulesObj.PageSize || 10,
                "FeeScheduleId": null
            }

            eHnoteSettingsDataService.GetCptFeeScheduleDetails(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.FeeScheduleList = resp.data.rows;
                        $scope.FeeScheduleListCount = resp.data.Count;
                    } else {
                        $scope.FeeScheduleList = [];
                        $scope.FeeScheduleListCount = 0;
                    }
                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };

        $scope.AddUpdateCPTFeeScheduleDetails = function () {

            if ($scope.FeeSchedulesObj.FeeScheduleName == "") {
                alertify.error('Please enter fee schedule name');
                return false;
            }
            if ($scope.FeeSchedulesObj.OrganizationId == 0) {
                alertify.error('Please select the Location');
                return false;
            }
            let ProviderList = $filter("filter")($scope.FeeSchedulesObj.Providers, { "IsChecked": true }, true) || [];
            if (ProviderList.length === 0) {
                alertify.error('Please select billing provider');
                return false;
            }

            if (!$scope.FeeSchedulesObj.IsAvailableForInsurance && !$scope.FeeSchedulesObj.IsAvailableForPatientBill) {
                alertify.error("Please select at least one option: Insurance Payers or Patient Bills.");
                return false;
            }
          

            if ($scope.FeeSchedulesObj.EffectiveFrom == "") {
                alertify.error('Please select effective date');
                return false;
            }

            if ($scope.FeeSchedulesObj.EffectiveTo == "") {
                alertify.error('Please select end date');
                return false;
            }

          


            const typeId = $scope.FeeSchedulesObj.ScheduleTypeId || null;
          //  var MedicarePercentValue = parseFloat(typeId == 1 ? $scope.FeeSchedulesObj.DefaultFee : typeId == 2 ? $scope.FeeSchedulesObj.MedicarePercentValue : $scope.FeeSchedulesObj.RVU) || 0;
            var MedicarePercentValue = parseFloat($scope.FeeSchedulesObj.MedicarePercentValue) || 0;

            //if (MedicarePercentValue === 0) {
            //    const messages = {
            //        1: 'Please enter the fee for service amount.',
            //        2: 'Please enter the Medicare percentage for the service.',
            //        3: 'Please enter the RVU value for the service.'
            //    };
            //    alertify.error(messages[typeId] || 'Please enter a valid value.');
            //    return false;
            //}

            if ($scope.FeeSchedulesObj.SearchProcedure !== "") {
                $scope.FeeSchedulesObj.ProceduresList = angular.copy($scope.FeeSchedulesObj.filterProceduresList);
            }

            let FeeSchedulePayorList = [];
            let FeeScheduleProviderList = [];
            let ProceduresFeeList = [];

            if ($scope.FeeSchedulesObj.Payors && $scope.FeeSchedulesObj.Payors.length > 0) {
                angular.forEach($scope.FeeSchedulesObj.Payors, function (payor) {
                    if (payor.OrganizationPayorId === 0 || !payor.IsChecked && payor.FeeScheduleSummaryPayorId === 0) return;
                    var obj = {
                        "FeeScheduleId": $scope.FeeSchedulesObj.FeeScheduleId,
                        "FeeScheduleSummaryPayorId": payor.FeeScheduleSummaryPayorId || 0,
                        "MasterPayorId": payor.PayorId || 0,
                        "OrganizationPayorId": payor.OrganizationPayorId || 0,
                        "ParentOrganizationId": $scope.ParentHospitalID,
                        "DeleteInd": payor.DeleteInd || "N",
                    };
                    FeeSchedulePayorList.push(obj);
                });
                FeeSchedulePayorList = FeeSchedulePayorList.filter(p => !(p.FeeScheduleSummaryPayorId === 0 && p.DeleteInd === "Y"));
            }

            if ($scope.FeeSchedulesObj.Providers && $scope.FeeSchedulesObj.Providers.length > 0) {
                angular.forEach($scope.FeeSchedulesObj.Providers, function (pitem) {
                    if (pitem.OrganizationBillingProviderId === 0 || !pitem.IsChecked && pitem.FeeScheduleSummaryProviderId === 0) return;
                    var obj = {
                        "FeeScheduleId": $scope.FeeSchedulesObj.FeeScheduleId,
                        "FeeScheduleSummaryProviderId": pitem.FeeScheduleSummaryProviderId || 0,
                        "BillingProviderId": pitem.OrganizationBillingProviderId || 0,
                        "ParentOrganizationId": $scope.ParentHospitalID,
                        "DeleteInd": pitem.DeleteInd || "N"
                    };
                    FeeScheduleProviderList.push(obj);
                });
                FeeScheduleProviderList = FeeScheduleProviderList.filter(p => !(p.FeeScheduleSummaryProviderId === 0 && p.DeleteInd === "Y"));
            }

            if ($scope.FeeSchedulesObj.TempProceduresList.length > 0) {
                angular.forEach($scope.FeeSchedulesObj.TempProceduresList, function (item) {
                    var obj = {
                        "FeeScheduleCPTCostingId": item.FeeScheduleCPTCostingId || 0,
                        "OrganizationProcedureId": item.OrganizationProcedureId,
                        "ProcedureId": item.ProcedureId,
                        "ProcedureName": item.ProcedureName,
                        "ParentOrganizationId": item.ParentOrganizationId,
                        "CPTCode": item.CPTCode,
                        "ProcedureCode": item.ProcedureCode || "",
                        "ProcedureDescription": item.ProcedureDescription || "",
                        "MasterPayorId": item.MasterPayorId || 0,
                        "OrganizationPayorId": item.OrganizationPayorId || 0,
                        "MedicareOfficeFee": item.MedicareOfficeFee,
                        "MedicareASCFee": item.MedicareASCFee,
                        "AnesthesiaCost": item.AnesthesiaCost,
                        "MedicareRateId": item.MedicareRateId,
                        "ModifierCode": item.ModifierCode,
                        "MedicareYear": item.MedicareYear,
                        "EffectiveFrom": item.EffectiveFrom,
                        "EffectiveTo": item.EffectiveTo,
                        "ActiveInd": item.ActiveInd,
                        "DeleteInd": "N",
                        "RequirePreAuth": item.RequirePreAuth,
                        "ProcedureNotCoveredByInsurance": item.ProcedureNotCoveredByInsurance,
                        "CapitatedService": item.CapitatedService,
                        "IsActive": item.IsActive,
                        "IsReferralRequired": item.IsReferralRequired
                    };
                    ProceduresFeeList.push(obj);
                });
            }

            var obj = {
                "UserId": $scope.UserId,
                "FeeScheduleId": $scope.FeeSchedulesObj.FeeScheduleId,
                "FeeScheduleName": $scope.FeeSchedulesObj.FeeScheduleName,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "OrganizationId": $scope.FeeSchedulesObj.OrganizationId,
                "MedicareYear": new Date().getFullYear(),
                "EffectiveFrom": $filter('date')($scope.FeeSchedulesObj.EffectiveFrom, "MM-dd-yyyy"),
                "EffectiveTo": $filter('date')($scope.FeeSchedulesObj.EffectiveTo, "MM-dd-yyyy"),
                "ScheduleTypeId": $scope.FeeSchedulesObj.ScheduleTypeId,
                "ScheduleType": ($scope.FeeSchedulesObj.ScheduleTypeId === 1 ? "Fee for Service" : $scope.FeeSchedulesObj.ScheduleTypeId === 2 ? "% of Medicare" : "RVU"),
                "MedicarePercentValue": MedicarePercentValue || null,
                "PayorGroupId": $scope.FeeSchedulesObj.PayorGroupId || null,
                "ProviderGroupId": null,
                "IsAvailableForInsurance": $scope.FeeSchedulesObj.IsAvailableForInsurance,
                "IsAvailableForPatientBill": $scope.FeeSchedulesObj.IsAvailableForPatientBill,
                "IsActive": true,
                "CreatedBy": $scope.UserId,
                "CreatedDate": $scope.FeeSchedulesObj.CreatedDate,
                "ModifiedBy": $scope.UserId,
                "ModifiedDate": $scope.FeeSchedulesObj.ModifiedDate,
                "Payors": FeeSchedulePayorList,
                "Providers": FeeScheduleProviderList,
                "ProceduresList": ProceduresFeeList,
                "DeleteInd": "N"
            }

            eHnoteSettingsDataService.AddUpdateCptFeeScheduleDetails(obj).success(function (resp) {
                if (resp.Status === "Success") {
                    alertify.success("Fee schedule added successfully");
                    $scope.closeschedule();
                    $scope.GetCptFeeScheduleDetails();
                    if ($scope.activeFeeTab == 1) {
                        $scope.PayorWiseCptFeeList = [];
                        $scope.GetPayorWiseCptFeeList();
                    }
                }
            });
        }

        $scope.filterProcedures = function () {

            const orgId = $scope.FeeSchedulesObj.OrganizationId || null;
            let procedurelist = $scope.FeeSchedulesObj.filterProceduresList;

            if (orgId != null) {
                procedurelist = $filter('filter')(procedurelist, { OrganizationId: orgId }, true) || [];
            }

            const search = ($scope.FeeSchedulesObj.SearchProcedure || '').trim().toLowerCase();

            if (!search) {
                $scope.FeeSchedulesObj.ProceduresList = angular.copy(procedurelist);
                return;
            }

            $scope.FeeSchedulesObj.ProceduresList = procedurelist.filter(item => (item.CPTCode && item.CPTCode.toLowerCase().includes(search)) || (item.ProcedureName && item.ProcedureName.toLowerCase().includes(search)));
        };


        $scope.DeleteFreeCpt = function (index,item) {
            $scope.FeeSchedulesObj.TempProceduresList.splice(index, 1);
        }

        $scope.ViewFeeSchedule = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "addfeeschedule.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__ninetynine--",
                "resolve": {
                    "FeeScheduleDetails": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, FeeScheduleDetails, $q) {

                    var doctorinfo = eHnoteMasterDataService.getUserInfo();


                    var obj = {
                        "OrganizationId": FeeScheduleDetails.OrganizationId,
                        "FeeScheduleId": FeeScheduleDetails.FeeScheduleId,
                     
                    }
                    $scope.FeeScheduleSummary = {};
                    $scope.ProceduresSummaryFeeList = [];
                    $q.all([
                        eHnoteSettingsDataService.GetOrgCptFeeScheduleDetails(obj),

                    ]).then(function (resp) {
                        if (resp[0].data.status === "Success") {
                            if (resp[0].data.rows.length > 0) {
                                FeeScheduleDetails.OrgPayorData = resp[0].data.rows || [];
                            } 
                        }


                 
                        $scope.FeeScheduleSummary = angular.copy(FeeScheduleDetails);
                        $scope.FeeScheduleSummary.SearchProcedure = "";
                        $scope.ProceduresSummaryFeeList = angular.copy(FeeScheduleDetails.OrgPayorData);
                    });

               

                    let List = $filter("filter")(doctorinfo.doctordata.User, { "DoctorID": $scope.FeeScheduleSummary.CreatedBy }, true) || [];
                    if (List.length > 0) {
                        $scope.FeeScheduleSummary.CreatedByName = List[0].SecondUserFullName;
                    }

                    $scope.filterCPTRates = function () {
                        const search = ($scope.FeeScheduleSummary.SearchProcedure || '').trim().toLowerCase();

                        if (!search) {
                            $scope.FeeScheduleSummary.OrgPayorData = angular.copy($scope.ProceduresSummaryFeeList);
                            return;
                        }

                        $scope.FeeScheduleSummary.OrgPayorData = $scope.ProceduresSummaryFeeList.filter(item =>
                            (item.CPTCode && item.CPTCode.toLowerCase().includes(search)) ||
                            (item.ProcedureName && item.ProcedureName.toLowerCase().includes(search))
                        );
                    };
                    
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.UpdateFeeSchedule = function () {
                        $scope.FeeScheduleSummary.ProceduresList = angular.copy($scope.ProceduresSummaryFeeList);
                        $uibModalInstance.close($scope.FeeScheduleSummary);
                    }
                }
            });
            mInstanceAdd.result.then(function (resp) {
                $scope.EditFeeSchedule(resp);
            }, function () { });
        };

        $scope.filterspopover = {
            templateUrl: 'filterspopover.html'
        }
        $scope.filtersPayerpopover = {
            templateUrl: 'filtersPayerpopover.html'
        }

        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };

        $scope.DeleteFeeSchedule = function (item) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
                var obj = {
                    "UserId": $scope.UserId,
                    "FeeScheduleId": item.FeeScheduleId,
                    "FeeScheduleName": item.FeeScheduleName,
                    "ParentOrganizationId": item.ParentOrganizationId,
                    "OrganizationId": $scope.HospitalId,
                    "MedicareYear": item.MedicareYear,
                    "EffectiveFrom": item.EffectiveFrom,
                    "EffectiveTo": item.EffectiveTo,
                    "ScheduleTypeId": item.ScheduleTypeId,
                    "ScheduleType": item.ScheduleType,
                    "MedicarePercentValue": item.MedicarePercentValue,
                    "PayorGroupId": item.PayorGroupId || 0,
                    "ProviderGroupId": null,
                    "IsAvailableForInsurance": item.IsAvailableForInsurance,
                    "IsAvailableForPatientBill": item.IsAvailableForPatientBill,
                    "IsActive": item.IsActive,
                    "CreatedBy": $scope.UserId,
                    "CreatedDate": item.CreatedDt,
                    "ModifiedBy": $scope.UserId,
                    "ModifiedDate": item.ModifiedDt,
                    "Payors": [],
                    "Providers": [],
                    "ProceduresList": [],
                    "DeleteInd": "Y"
                }
                eHnoteSettingsDataService.AddUpdateCptFeeScheduleDetails(obj).success(function (resp) {
                    if (resp.Status === "Success") {
                        alertify.success("Fee schedule deleted successfully");
                        $scope.GetCptFeeScheduleDetails();
                       
                    }
                });

            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.UpdateStatusFeeSchedule = function (item, active) {

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "FeeScheduleId": item.FeeScheduleId,
                "IsActive": active,
            };
            eHnoteSettingsDataService.UpdateCptFeeSchedule(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.status === "Success") {
                    item.IsActive = active;
                    $scope.GetCptFeeScheduleDetails();
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.EditFeeSchedule = function (item) {            
            $scope.FeeSchedulesObj = angular.copy($scope.GetFeeSchedulesObj());

            $scope.FeeSchedulesObj.FeeScheduleId = item.FeeScheduleId;
            $scope.FeeSchedulesObj.FeeScheduleName = item.FeeScheduleName;
            $scope.FeeSchedulesObj.PayorGroupObject = item.OrgPayorGroupName;
            $scope.FeeSchedulesObj.ParentOrganizationId = item.ParentOrganizationId;
            $scope.FeeSchedulesObj.OrganizationId = item.OrganizationId;
            $scope.FeeSchedulesObj.MedicareYear = item.MedicareYear;
            $scope.FeeSchedulesObj.EffectiveFrom = $filter('date')(item.EffectiveFrom, "MM-dd-yyyy");
            $scope.FeeSchedulesObj.EffectiveTo = $filter('date')(item.EffectiveTo, "MM-dd-yyyy");
            $scope.FeeSchedulesObj.ScheduleTypeId = item.ScheduleTypeId;
            $scope.FeeSchedulesObj.ScheduleType = item.ScheduleType;
            if (item.ScheduleTypeId == 1) {
                $scope.FeeSchedulesObj.DefaultFee = item.MedicarePercentValue;
            } else if (item.ScheduleTypeId == 2) {
                $scope.FeeSchedulesObj.MedicarePercentValue = item.MedicarePercentValue;
            } else {
                $scope.FeeSchedulesObj.RVU = item.MedicarePercentValue;
            }



            if (item.IsAvailableForInsurance) {
                $scope.FeeSchedulesObj.AvailableFor = "Insurance";
            } else if (item.IsAvailableForPatientBill) {
                $scope.FeeSchedulesObj.AvailableFor = "PatientBill";
            }

            $scope.FeeSchedulesObj.PayorGroupId = item.OrgPayorGroupId;
            $scope.FeeSchedulesObj.OrgPayorGroupId = item.OrgPayorGroupId;
            $scope.FeeSchedulesObj.OrgPayorGroupName = item.OrgPayorGroupName;
            $scope.FeeSchedulesObj.ProviderGroupId = item.ProviderGroupId;
            $scope.FeeSchedulesObj.IsAvailableForInsurance = item.IsAvailableForInsurance;
            $scope.FeeSchedulesObj.IsAvailableForPatientBill = item.IsAvailableForPatientBill;
            $scope.FeeSchedulesObj.IsActive = item.IsActive;
            $scope.FeeSchedulesObj.MedicarePercentValue = item.MedicarePercentValue;
            $scope.FeeSchedulesObj.CreatedBy = item.CreatedBy;
            $scope.FeeSchedulesObj.CreatedDt = item.CreatedDt;
            $scope.FeeSchedulesObj.ModifiedBy = item.ModifiedBy;
            $scope.FeeSchedulesObj.ModifiedDt = item.ModifiedDt;
            item.Payors.forEach(p => p.IsChecked = true);
            $scope.FeeSchedulesObj.Payors = angular.copy(item.Payors);
            let ProvidersList = angular.copy($scope.BillingProviderList);
            if (item.Providers?.length) {
                item.Providers.forEach(p => {
                    $scope.FeeSchedulesObj.Providers.push({
                        FeeScheduleId: p.FeeScheduleId,
                        FeeScheduleSummaryProviderId: p.FeeScheduleSummaryProviderId,
                        OrganizationBillingProviderId: p.BillingProviderId,
                        BillingProviderName: p.BillingProviderName,
                        ParentOrganizationId: p.ParentOrganizationId,
                        IsChecked: true,
                        DeleteInd: "N"
                    });
                });

                ProvidersList.filter(p => p.OrganizationBillingProviderId !== 0 && !$scope.FeeSchedulesObj.Providers.some(x => x.OrganizationBillingProviderId === p.OrganizationBillingProviderId))
                    .forEach(p => {
                        $scope.FeeSchedulesObj.Providers.push({
                            FeeScheduleId: 0,
                            FeeScheduleSummaryProviderId: 0,
                            OrganizationBillingProviderId: p.OrganizationBillingProviderId,
                            BillingProviderName: p.BillingProviderName,
                            ParentOrganizationId: $scope.ParentHospitalID,
                            IsChecked: false,
                            DeleteInd: "N"
                        });
                    });

                $scope.FeeSchedulesObj.Providers.unshift({
                    FeeScheduleId: 0,
                    FeeScheduleSummaryProviderId: 0,
                    OrganizationBillingProviderId: 0,
                    BillingProviderName: "All",
                    ParentOrganizationId: $scope.ParentHospitalID,
                    IsChecked: $scope.FeeSchedulesObj.Providers.every(x => x.IsChecked),
                    DeleteInd: "N"
                });

                const checkedProvider = $scope.FeeSchedulesObj.Providers.filter(branch => branch.IsChecked);
                const totalProvider = $scope.FeeSchedulesObj.Providers.length;
                $scope.FeeSchedulesObj.SelectProviderText = checkedProvider.length === totalProvider ? "All" : checkedProvider.length === 1 ? (checkedProvider[0].BillingProviderName || "Select") : checkedProvider.length > 1 ? "Selected" : "Select";
            }

            item.ProceduresList.map(function (p) {
                p.OrganizationId = item.OrganizationId;
                return p;
            });

            $scope.FeeSchedulesObj.ProceduresList = angular.copy(item.ProceduresList);
            $scope.FeeSchedulesObj.TempProceduresList = angular.copy(item.ProceduresList);
            $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(item.OrgPayorData);
          //  $scope.FeeSchedulesObj.filterProceduresList = angular.copy(item.ProceduresList);
            $scope.FilteredPayorList = [];
            $scope.createfeeschedule = true;
            $scope._lastCreateFeePayorSearchText = null;
            

            var obj = {
                "OrganizationId": $scope.FeeSchedulesObj.OrganizationId || Locationids,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PageSize": 100,
                "PageNumber":1,
                "CPTSearchText": "",
                "EffectiveFrom": "",
                "EffectiveTo": "",
                "MedicareYear": $scope.FeeSchedulesObj.MedicareYear
            }

            $q.all([
                eHnoteSettingsDataService.GetProcedureMedicareCosts(obj),
               
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    if (resp[0].data.ProceduresList.length > 0) {
                        resp[0].data.ProceduresList.forEach(item => item.ActiveInd = 'Y');
                        $scope.AllMedicareFeeList = angular.copy(resp[0].data.ProceduresList);
                        $scope.MedicareFeeListCount = resp[0].data.count;                     
                        $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(resp[0].data.ProceduresList) || [];
                        $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp[0].data.ProceduresList) || [];
                       
                    } else {
                        $scope.AllMedicareFeeList = [];
                        $scope.FeeSchedulesObj.ProceduresList = [];
                    }
                    $scope.calculateFee($scope.FeeSchedulesObj.MedicarePercentValue, 2);
                }
               

               
            });
        }

        $scope.Getdispalycost = function (Pageno) {
            $scope.FeeSchedulesObj.CostPageNumber = Pageno||1;
            var Locationids = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
            var obj = {
                "OrganizationId": $scope.FeeSchedulesObj.OrganizationId || Locationids,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PageSize": 100,
                "PageNumber": $scope.FeeSchedulesObj.CostPageNumber,
                "CPTSearchText": "",
                "EffectiveFrom": "",
                "EffectiveTo": "",
                "MedicareYear": new Date().getFullYear(),
            }
            eHnoteSettingsDataService.GetProcedureMedicareCosts(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.ProceduresList.length > 0) {
                        resp.data.ProceduresList.forEach(item => item.ActiveInd = 'Y');
                        $scope.AllMedicareFeeList = angular.copy(resp.data.ProceduresList);
                        $scope.MedicareFeeListCount = resp.data.count;
                        $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(resp.data.ProceduresList) || [];
                        $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp.data.ProceduresList) || [];

                    } else {
                        $scope.AllMedicareFeeList = [];
                        $scope.FeeSchedulesObj.ProceduresList = [];
                    }
                    $scope.calculateFee($scope.FeeSchedulesObj.MedicarePercentValue, 2);
                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        }

        $scope.CopyFromFeeSchedule = function (item) {

            // Fetch full fee schedule details first
            //var obj = {
            //    "OrganizationId": $scope.filterLocationslist
            //        .filter(pitem => pitem.ClinicId !== 0)
            //        .map(pitem => pitem.ClinicId)
            //        .join(","),
            //    "ParentOrganizationId": $scope.ParentHospitalID,
            //    "PayerIds": "",
            //    "ProviderIds": "",
            //    "Status": "Active",
            //    "MedicareYear": new Date().getFullYear(),
            //    "PageNumber": 1,
            //    "PageSize": 10,
            //    "FeeScheduleId": item.FeeScheduleId
            //};

            //eHnoteSettingsDataService.GetCptFeeScheduleDetails(obj).then(function (resp) {
            //    if (resp.data.status === "Success") {
            //    }
            //}, function (err) {
            //    alertify.error("Failed to load fee schedule");
            //    console.log(err);
            //});




    

                var sourceData = angular.copy(item);

                // Reset the main fee schedule object
                $scope.FeeSchedulesObj = angular.copy($scope.GetFeeSchedulesObj());

                // Copy over configuration from source
                $scope.FeeSchedulesObj.FeeScheduleId = 0; // NEW record
                $scope.FeeSchedulesObj.FeeScheduleName = sourceData.FeeScheduleName + " (Copy)";
                $scope.FeeSchedulesObj.OrganizationId = sourceData.OrganizationId;
                $scope.FeeSchedulesObj.MedicareYear = sourceData.MedicareYear;
                $scope.FeeSchedulesObj.EffectiveFrom = $filter('date')(sourceData.EffectiveFrom, "MM-dd-yyyy");
                $scope.FeeSchedulesObj.EffectiveTo = $filter('date')(sourceData.EffectiveTo, "MM-dd-yyyy");
                $scope.FeeSchedulesObj.ScheduleTypeId = sourceData.ScheduleTypeId;
                $scope.FeeSchedulesObj.ScheduleType = sourceData.ScheduleType;
                $scope.FeeSchedulesObj.IsAvailableForInsurance = sourceData.IsAvailableForInsurance;
                $scope.FeeSchedulesObj.IsAvailableForPatientBill = sourceData.IsAvailableForPatientBill;

                // Set AvailableFor radio
                if (sourceData.IsAvailableForInsurance) {
                    $scope.FeeSchedulesObj.AvailableFor = "Insurance";
                } else if (sourceData.IsAvailableForPatientBill) {
                    $scope.FeeSchedulesObj.AvailableFor = "PatientBill";
                }

                // Copy fee calculation values
                if (sourceData.ScheduleTypeId == 1) {
                    $scope.FeeSchedulesObj.DefaultFee = sourceData.MedicarePercentValue;
                } else if (sourceData.ScheduleTypeId == 2) {
                    $scope.FeeSchedulesObj.MedicarePercentValue = sourceData.MedicarePercentValue;
                } else if (sourceData.ScheduleTypeId == 3) {
                    $scope.FeeSchedulesObj.RVU = sourceData.MedicarePercentValue;
                }

                $scope.FeeSchedulesObj.PayorGroupId = sourceData.OrgPayorGroupId || null;
                $scope.FeeSchedulesObj.OrgPayorGroupName = sourceData.OrgPayorGroupName || "";

                // Reset Payors — user will select new payers
                $scope.FeeSchedulesObj.Payors = [];
                $scope.FeeSchedulesObj.SelectPayorText = "Select Payer";
                $scope.FilteredPayorList = [];

                // Copy Providers but reset IDs for new record
                $scope.FeeSchedulesObj.Providers = angular.copy($scope.BillingProviderList);
                if (sourceData.Providers && sourceData.Providers.length > 0) {
                    $scope.FeeSchedulesObj.Providers = [];

                    sourceData.Providers.forEach(function (p) {
                        $scope.FeeSchedulesObj.Providers.push({
                            FeeScheduleId: 0,
                            FeeScheduleSummaryProviderId: 0, // reset
                            OrganizationBillingProviderId: p.BillingProviderId,
                            BillingProviderName: p.BillingProviderName,
                            ParentOrganizationId: p.ParentOrganizationId,
                            IsChecked: true,
                            DeleteInd: "N"
                        });
                    });

                    // Add remaining providers that weren't in source
                    var ProvidersList = angular.copy($scope.BillingProviderList);
                    ProvidersList
                        .filter(function (p) {
                            return p.OrganizationBillingProviderId !== 0 &&
                                !$scope.FeeSchedulesObj.Providers.some(function (x) {
                                    return x.OrganizationBillingProviderId === p.OrganizationBillingProviderId;
                                });
                        })
                        .forEach(function (p) {
                            $scope.FeeSchedulesObj.Providers.push({
                                FeeScheduleId: 0,
                                FeeScheduleSummaryProviderId: 0,
                                OrganizationBillingProviderId: p.OrganizationBillingProviderId,
                                BillingProviderName: p.BillingProviderName,
                                ParentOrganizationId: $scope.ParentHospitalID,
                                IsChecked: false,
                                DeleteInd: "N"
                            });
                        });

                    // Add "All Providers" option
                    $scope.FeeSchedulesObj.Providers.unshift({
                        FeeScheduleId: 0,
                        FeeScheduleSummaryProviderId: 0,
                        OrganizationBillingProviderId: 0,
                        BillingProviderName: "All Providers",
                        ParentOrganizationId: $scope.ParentHospitalID,
                        IsChecked: $scope.FeeSchedulesObj.Providers.every(function (x) { return x.IsChecked; }),
                        DeleteInd: "N"
                    });

                    var checkedProvider = $scope.FeeSchedulesObj.Providers.filter(function (b) { return b.IsChecked; });
                    var totalProvider = $scope.FeeSchedulesObj.Providers.length;
                    $scope.FeeSchedulesObj.SelectProviderText = checkedProvider.length === totalProvider ? "All" :
                        checkedProvider.length === 1 ? (checkedProvider[0].BillingProviderName || "Select") :
                            checkedProvider.length > 1 ? "Selected" : "Select";
                }

                // Copy Procedures but reset IDs for new record
                var copiedProcedures = [];
                if (sourceData.ProceduresList && sourceData.ProceduresList.length > 0) {
                    sourceData.ProceduresList.forEach(function (proc) {
                        // Fix backend typo
                        if (proc.ProvedureNotCoveredByInsurance !== undefined && proc.ProcedureNotCoveredByInsurance === undefined) {
                            proc.ProcedureNotCoveredByInsurance = proc.ProvedureNotCoveredByInsurance;
                        }

                        copiedProcedures.push({
                            "FeeScheduleCPTCostingId": 0, // reset — new record
                            "OrganizationProcedureId": proc.OrganizationProcedureId,
                            "ProcedureId": proc.ProcedureId,
                            "ProcedureName": proc.ProcedureName,
                            "ParentOrganizationId": proc.ParentOrganizationId,
                            "CPTCode": proc.CPTCode,
                            "ProcedureCode": proc.ProcedureCode || "",
                            "ProcedureDescription": proc.ProcedureDescription || "",
                            "MasterPayorId": 0,
                            "OrganizationPayorId": 0,
                            "MedicareOfficeFee": proc.MedicareOfficeFee,
                            "MedicareASCFee": proc.MedicareASCFee,
                            "AnesthesiaCost": proc.AnesthesiaCost,
                            "MedicareRateId": proc.MedicareRateId,
                            "ModifierCode": proc.ModifierCode,
                            "MedicareYear": proc.MedicareYear,
                            "EffectiveFrom": proc.EffectiveFrom,
                            "EffectiveTo": proc.EffectiveTo,
                            "ActiveInd": proc.ActiveInd || "Y",
                            "DeleteInd": "N",
                            "RequirePreAuth": proc.RequirePreAuth || false,
                            "ProcedureNotCoveredByInsurance": proc.ProcedureNotCoveredByInsurance || false,
                            "CapitatedService": proc.CapitatedService || false,
                            "IsActive": proc.IsActive || false,
                            "IsReferralRequired": proc.IsReferralRequired || false,
                            "OrganizationId": sourceData.OrganizationId
                        });
                    });
                }

                $scope.FeeSchedulesObj.TempProceduresList = angular.copy(copiedProcedures);
                $scope.FeeSchedulesObj.ProceduresList = angular.copy(copiedProcedures);
                $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(sourceData.OrgPayorData || copiedProcedures);
               // $scope.FeeSchedulesObj.filterProceduresList = angular.copy(copiedProcedures);

                $scope._lastCreateFeePayorSearchText = null;
                $scope.createfeeschedule = true;
            var obj = {
                "OrganizationId": $scope.FeeSchedulesObj.OrganizationId || Locationids,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PageSize": 100,
                "PageNumber": 1,
                "CPTSearchText": "",
                "EffectiveFrom": "",
                "EffectiveTo": "",
                "MedicareYear": new Date().getFullYear()
            }

            $q.all([
                eHnoteSettingsDataService.GetProcedureMedicareCosts(obj),

            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    if (resp[0].data.ProceduresList.length > 0) {
                        resp[0].data.ProceduresList.forEach(item => item.ActiveInd = 'Y');
                        $scope.AllMedicareFeeList = angular.copy(resp[0].data.ProceduresList);
                        $scope.MedicareFeeListCount = resp[0].data.count;
                        $scope.FeeSchedulesObj.DisplayProceduresList = angular.copy(resp[0].data.ProceduresList) || [];
                        $scope.FeeSchedulesObj.filterProceduresList = angular.copy(resp[0].data.ProceduresList) || [];

                    } else {
                        $scope.AllMedicareFeeList = [];
                        $scope.FeeSchedulesObj.ProceduresList = [];
                    }
                    $scope.calculateFee($scope.FeeSchedulesObj.MedicarePercentValue, 2);
                }



            });
             
        };


        $scope.OnSelectLocation = function (item) {

            if (item.ClinicId === 0) {
                if (item.IsChecked) {
                    $scope.filterLocationslist.forEach(branch => branch.IsChecked = true);
                } else {
                    $scope.filterLocationslist.forEach(branch => branch.IsChecked = false);
                }
            } else {
                const allCheckedExceptSpecial = $scope.filterLocationslist
                    .filter(branch => branch.ClinicId !== 0)
                    .every(branch => branch.IsChecked);

                const specialItem = $scope.filterLocationslist.find(branch => branch.ClinicId === 0);
                if (specialItem) {
                    specialItem.IsChecked = allCheckedExceptSpecial;
                }
            }

            const ids = $scope.filterLocationslist
                .filter(branch => branch.IsChecked && branch.ClinicId !== 0)
                .map(branch => branch.ClinicId);

            $scope.FeeSchedulesObj.LocationIds = ids.join(",");
        };

        $scope.OnSelectBillingProvider = function (item) {

            if (item.OrganizationBillingProviderId === 0) {
                if (item.IsChecked) {
                    $scope.filterProviderList.forEach(branch => branch.IsChecked = true);
                } else {
                    $scope.filterProviderList.forEach(branch => branch.IsChecked = false);
                }
            } else {
                const allCheckedExceptSpecial = $scope.filterProviderList
                    .filter(branch => branch.OrganizationBillingProviderId !== 0)
                    .every(branch => branch.IsChecked);

                const specialItem = $scope.filterProviderList.find(branch => branch.OrganizationBillingProviderId === 0);
                if (specialItem) {
                    specialItem.IsChecked = allCheckedExceptSpecial;
                }
            }

            const ids = $scope.filterProviderList
                .filter(branch => branch.IsChecked && branch.OrganizationBillingProviderId !== 0)
                .map(branch => branch.OrganizationBillingProviderId);

            $scope.FeeSchedulesObj.ProviderIds = ids.join(",");
        };

        $scope.OnSelectPayers = function (item) {

            if (item.OrganizationPayorId === 0) {
                if (item.IsChecked) {
                    $scope.FilteredPayorList.forEach(branch => branch.IsChecked = true);
                } else {
                    $scope.FilteredPayorList.forEach(branch => branch.IsChecked = false);
                }
            } else {
                const allCheckedExceptSpecial = $scope.FilteredPayorList
                    .filter(branch => branch.OrganizationPayorId !== 0)
                    .every(branch => branch.IsChecked);

                const specialItem = $scope.FilteredPayorList.find(branch => branch.OrganizationPayorId === 0);
                if (specialItem) {
                    specialItem.IsChecked = allCheckedExceptSpecial;
                }
            }

            const ids = $scope.FilteredPayorList
                .filter(branch => branch.IsChecked && branch.OrganizationPayorId !== 0)
                .map(branch => branch.OrganizationPayorId);

            $scope.FeeSchedulesObj.PayerIds = ids.join(",");
            $scope.PayorWiseCptObj.Payors = $scope.FilteredPayorList||[];
        };

        $scope.OnSelectStatus = function (item) {

            $scope.SelectedStatus = item;

            $scope.FeeSchedulesObj.StatusName = item.StatusName;
        };


        $scope.ResetAll = function () {
            $scope.searchHospital = { "txt1": "", "txt2": "", "txt3": "" }
            $scope.filterProviderList.forEach(item => item.IsChecked = true);
            $scope.filterLocationslist.forEach(item => item.IsChecked = true);
            $scope.StatusList = angular.copy($scope.GetStatusList());
            $scope.FeeSchedulesObj.PayorObj = "";
            $scope.FeeSchedulesObj.StatusName = "Active";
            $scope.FeeSchedulesObj.ProviderIds = "";
            $scope.FeeSchedulesObj.PayerIds = "";
            $scope.SearchPayorList();
            $scope.GetCptFeeScheduleDetails();
            $scope.SelectedStatus = $scope.StatusList.find(s => s.StatusId === 1);
        }

        $scope.ApplyFilters = function () {
            $scope.GetCptFeeScheduleDetails();
            angular.element(document.querySelector('.popover')).remove();
        }

        $scope.syncProcedure = function (item, index, type) {

            type = type || '';
            if (type === 'Active') {
                item.ActiveInd = item.ActiveInd === 'Y' ? 'N' : 'Y';
            }

            $scope.FeeSchedulesObj.filterProceduresList[index] = angular.copy(item);
        };

        $scope.onSearchClickfilterPopover = function () {
            $scope.FeeSchedulesObj.PayorObj = "";
            $scope.SelectedStatus = $scope.StatusList.find(s => s.StatusId === 1);

            $scope.SearchPayorList();
        };

        $scope.OnSelectFeeLocation = function () {

            const list = $scope.FeeSchedulesObj.filterProceduresList || [];
            const orgId = $scope.FeeSchedulesObj.OrganizationId;
            $scope.FeeSchedulesObj.DisplayProceduresList = $filter('filter')(list, { OrganizationId: orgId }, true) || [];
            $scope.calculateFee($scope.FeeSchedulesObj.MedicarePercentValue, 2);
        };


        /* Fee Schedules - End */

        /* Final Fee - Start */

        $scope.GetFinalFeeObj = function () {
            var obj = {
                "LocationIds": "",
                "ParentOrganizationId": 0,
                "SearchText": "",
                "PayerIds": "",
                "PayerId": "",
                "ProviderIds": "",
                "SelectFinalLocationText": "All Locations",
                "SelectFinalPayorText": "Select Payers",
                "SelectFinalProviderText": "All Providers",
                "PayorObj": "",
                "Payors": [],
                "Providers": [],
                "MedicareYear": new Date().getFullYear(),
                "PageNumber": 1,
                "PageSize": 50
            }
            return obj;
        }

        $scope.FinalFeeObj = angular.copy($scope.GetFinalFeeObj());
        $scope.FinalFeeLocationlist = [];

        $scope.GetFinalFeeScheduleDetails = function () {

            const Locationids = $scope.FinalFeeLocationlist
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");

            const PayerIds = $scope.FilteredPayorList
                .filter(branch => branch.IsChecked && branch.OrganizationPayorId !== 0)
                .map(branch => branch.OrganizationPayorId)
                .join(",");

            const ProviderIds = $scope.filterProviderList
                .filter(branch => branch.IsChecked && branch.OrganizationBillingProviderId !== 0)
                .map(branch => branch.OrganizationBillingProviderId)
                .join(",");

            const req = {
                "LocationIds": Locationids || "",
                "ParentOrganizationId": $scope.ParentHospitalID || null,
                "SearchText": $scope.FinalFeeObj.SearchText || "",
                //"PayerIds": PayerIds || "",
                "PayerIds": $scope.FinalFeeObj.PayorId || "",
                "ProviderIds": ProviderIds || "",
                "MedicareYear": new Date().getFullYear(),
                "PageNumber": $scope.FinalFeeObj.PageNumber || 1,
                "PageSize": $scope.FinalFeeObj.PageSize || 50
            };

            eHnoteSettingsDataService.GetFinalFeeScheduleDetails(req).success(function (resp) {
                if (resp.Status === "Success") {
                    if (resp.rows.length > 0) {
                        $scope.FinalFeeList = angular.copy(resp.rows);
                        $scope.FinalFeeListCount = angular.copy(resp.Count);
                    } else {
                        $scope.FinalFeeList = [];
                        $scope.FinalFeeListCount = 0;
                    }
                }
            });
        };

        $scope.toggleFinalFeePayor = function (item) {

            if (item.OrganizationPayorId === 0) {
                $scope.FilteredPayorList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.FilteredPayorList
                .filter(branch => branch.OrganizationPayorId !== 0)
                .every(branch => branch.IsChecked);

            const allPayorItem = $scope.FilteredPayorList.find(branch => branch.OrganizationPayorId === 0);

            if (allPayorItem) {
                allPayorItem.IsChecked = allNonZeroChecked;
            }

            const checkedPayors = $scope.FilteredPayorList.filter(branch => branch.IsChecked);
            const totalPayors = $scope.FilteredPayorList.length;

            $scope.FinalFeeObj.SelectFinalPayorText = checkedPayors.length === totalPayors ? "All Payors" : checkedPayors.length === 1 ? (checkedPayors[0].PayorName || "Select Payers") : checkedPayors.length > 1 ? "Selected" : "Select Payers";
        };

        $scope._lastFinalFeePayorSearchText = null;

        $scope.onFinalFeePayorDropdownOpen = function (text, type) {

            text = text || "";
            const isDefaultSelection = $scope.FinalFeeObj.SelectFinalPayorText === "Select Payers";

            if (isDefaultSelection && text === $scope._lastFinalFeePayorSearchText) {
                return;
            }

            if (!text && isDefaultSelection) {
                $scope._lastFinalFeePayorSearchText = text;
                $scope.SearchPayorList(type);
            }
        };

        $scope.switchToFinalNextPage = function (Pageno) {
            $scope.FinalFeeObj.PageNumber = Pageno;
            $scope.GetProcedureMedicareDetails();
        }

        $scope.ResetFinalFilters = function () {
            $scope.FinalFeeObj = angular.copy($scope.GetFinalFeeObj());
            $scope.filterProviderList.forEach(item => item.IsChecked = true);
            $scope.FinalFeeLocationlist.forEach(item => item.IsChecked = true);
            $scope.FilteredPayorList.forEach(item => item.IsChecked = false);
            $scope.GetFinalFeeScheduleDetails();
        }

        $scope.OnSelectFinalProvider = function (item) {

            if (item.OrganizationBillingProviderId === 0) {
                $scope.filterProviderList.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.filterProviderList
                .filter(branch => branch.OrganizationBillingProviderId !== 0)
                .every(branch => branch.IsChecked);

            const allPayorItem = $scope.filterProviderList.find(branch => branch.OrganizationBillingProviderId === 0);

            if (allPayorItem) {
                allPayorItem.IsChecked = allNonZeroChecked;
            }

            const checkedProviders = $scope.filterProviderList.filter(branch => branch.IsChecked);
            const totalProviders = $scope.filterProviderList.length;

            $scope.FinalFeeObj.SelectFinalProviderText = checkedProviders.length === totalProviders ? "All Providers" : checkedProviders.length === 1 ? (checkedProviders[0].BillingProviderName || "Select Providers") : checkedProviders.length > 1 ? "Selected" : "Select Providers";

        };

        $scope.toggleLocationSelection = function (item) {

            if (item.ClinicId === 0) {
                $scope.FinalFeeLocationlist.forEach(branch => {
                    branch.IsChecked = item.IsChecked;
                });
            }

            const allNonZeroChecked = $scope.FinalFeeLocationlist
                .filter(branch => branch.ClinicId !== 0)
                .every(branch => branch.IsChecked);

            const allPayorItem = $scope.FinalFeeLocationlist.find(branch => branch.ClinicId === 0);

            if (allPayorItem) {
                allPayorItem.IsChecked = allNonZeroChecked;
            }

            const checkedLocations = $scope.FinalFeeLocationlist.filter(branch => branch.IsChecked);
            const totalLocations = $scope.FinalFeeLocationlist.length;

            $scope.FinalFeeObj.SelectFinalLocationText = checkedLocations.length === totalLocations ? "All Locations" : checkedLocations.length === 1 ? (checkedLocations[0].ClinicName || "Select Locations") : checkedLocations.length > 1 ? "Selected" : "Select Locations";
        };

        /* Final Fee - End */


        $scope.switchFeeTab = function (tabno) {

            if ($scope.activeFeeTab === tabno) return;
            $scope.activeFeeTab = tabno;
            $scope.IsShowAddNewCPT = false;
            if (tabno === 3) {
                $scope.feeinit();
            } else if (tabno === 2) {
                $scope.FeeSchedulesObj = angular.copy($scope.GetFeeSchedulesObj());
                $scope.filterLocationslist.forEach(item => item.IsChecked = true);
                $scope.filterProviderList.forEach(item => item.IsChecked = true);
                $scope.GetCptFeeScheduleDetails();
            } else if (tabno === 4) {
                $scope.FinalFeeObj = angular.copy($scope.GetFinalFeeObj());
                $scope.filterProviderList = angular.copy($scope.BillingProviderList);
                $scope.filterProviderList.forEach(item => item.IsChecked = true);
                $scope.FinalFeeLocationlist = angular.copy($scope.filterLocationslist);
                $scope.FinalFeeLocationlist.forEach(item => item.IsChecked = true);
                $scope._lastFinalFeePayorSearchText = null;
                $scope.GetFinalFeeScheduleDetails();
            }
            else if (tabno === 1) {
                $scope.PayorWiseCptFeeList = [];
                $scope.PayorWiseCptObj = angular.copy($scope.GetPayorWiseCptObj());
                $scope.filterLocationslist = angular.copy($scope.AllUserBranchesList);
                $scope.filterLocationslist.forEach(item => item.IsChecked = true);                
                $scope.GetPayorWiseCptFeeList();
            }
        };
        $scope.switchFeeTab(2);

        $scope.GetMedicareFeeCPTTemplate = function () {
            eHnoteSurgeryService.GetMedicareFeeCPTMasterTemplate().then(function (resp) {
                window.open(resp.data, "_blank");
            }, function (err) {
                console.log(err);
            });
        };


        $scope.GetSearchProcedureMedicareDetails = function (text) {
            var Locationids = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
            var params = {
                "OrganizationId": Locationids,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PageSize": 10,
                "PageNumber": 1,
                "CPTSearchText": text,
                "EffectiveFrom": "",
                "EffectiveTo": "",
                "MedicareYear": new Date().getFullYear()
            };
           

            return eHnoteSettingsDataService.GetOrgProcedure_MedicareProcedureCosts(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows
                        .map(function (item) {
                            return item;
                        });
                }
            });
        };


        $scope.onselectCptCost = function (item) {
            if (!item) {
                return;
            }

            // Ensure TempProceduresList exists
            $scope.FeeSchedulesObj.TempProceduresList = $scope.FeeSchedulesObj.TempProceduresList || [];

            // Check if procedure already exists in the list
            let existingProcedure = $scope.FeeSchedulesObj.TempProceduresList.filter(function (ins) {
                return ins.OrganizationProcedureId === item.OrganizationProcedureId;
                    
            });

            if (existingProcedure.length > 0) {
       
            } else {
                let obj = {
                    "FeeScheduleCPTCostingId": 0, // new record, will be assigned by backend
                    "OrganizationProcedureId": item.OrganizationProcedureId,
                    "ProcedureId": item.ProcedureId,
                    "ProcedureName": item.ProcedureName,
                    "ParentOrganizationId": item.ParentOrganizationId,
                    "CPTCode": item.CPTCode,
                    "ProcedureCode": item.ProcedureCode,
                    "ProcedureDescription": item.ProcedureDescription,
                    "MasterPayorId": $scope.FeeSchedulesObj.MasterPayorId || null,
                    "OrganizationPayorId": $scope.FeeSchedulesObj.OrganizationPayorId || null,
                    "MedicareOfficeFee": item.MedicareOfficeFee,
                    "MedicareASCFee": item.MedicareASCFee,
                    "AnesthesiaCost": item.AnesthesiaCost,
                    "MedicareRateId": item.MedicareRateId,
                    "ModifierCode": item.ModifierCode,
                    "MedicareYear": item.MedicareYear,
                    "EffectiveFrom": item.EffectiveFrom,
                    "EffectiveTo": item.EffectiveTo,
                    "ActiveInd": "Y",
                    "DeleteInd": "N",
                    "RequirePreAuth": false,
                    "ProcedureNotCoveredByInsurance": false,
                    "CapitatedService": false,
                    "IsActive": false,
                    "IsReferralRequired": false,
                    "IsManualAmtUpdate": true
                };

                $scope.FeeSchedulesObj.TempProceduresList.push(obj);
            }      

            $scope.FeeSchedulesObj.Procedureobj = "";
        };

        $scope.GetPayorWiseCptObj = function () {
            var obj = {
                "LocationIds": "",
                "ParentOrganizationId": 0,
                "SearchText": "",
                "PayerIds": "",            
                "SelectFinalLocationText": "All Locations",
                "SelectFinalPayorText": "Select Payers",             
                "PayorObj": "",
                "PayerIds": "",
                "Payors": [],        
                "MedicareYear": new Date().getFullYear(),
                "PageNumber": 1,
                "PageSize": 50
            }
            return obj;
        }

        $scope.PayorWiseCptObj = angular.copy($scope.GetPayorWiseCptObj());

        $scope.onSearchClickfilterPopover = function () {
            $scope.PayorWiseCptObj.PayorObj = "";
            $scope.SearchPayorList();
        };

        $scope.PayorResetAll = function () {
            $scope.searchHospital = { "txt1": "", "txt2": "", "txt3": "" }            
            $scope.filterLocationslist.forEach(item => item.IsChecked = true);           
            $scope.PayorWiseCptObj.PayorObj = "";
            $scope.PayorWiseCptObj.PayerIds = "";
            $scope.PayorWiseCptObj.Payors = [];
            $scope.SearchPayorList();
            $scope.GetPayorWiseCptFeeList();
            
        }

        $scope.ApplyPayorFilters = function () {
            $scope.GetPayorWiseCptFeeList();
            angular.element(document.querySelector('.popover')).remove();
        }
      
        $scope.GetPayorWiseCptFeeList = function () {

            const Locationids = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");

            const PayerIds = $scope.PayorWiseCptObj.Payors
                .filter(branch => branch.IsChecked && branch.OrganizationPayorId !== 0)
                .map(branch => branch.OrganizationPayorId)
                .join(",");

        

            const req = {
                "OrganizationId": Locationids || "",
                "ParentOrganizationId": $scope.ParentHospitalID || null,               
                "PayerIds": PayerIds || "",               
                "MedicareYear": new Date().getFullYear(),
                "PageNumber": $scope.PayorWiseCptObj.PageNumber || 1,
                "PageSize": $scope.PayorWiseCptObj.PageSize || 50
            };

            eHnoteSettingsDataService.GetPayorWiseCptFeeList(req).success(function (resp) {
                if (resp.rows.length > 0) {
                    $scope.PayorWiseCptFeeList = angular.copy(resp.rows);
                } else {
                    $scope.PayorWiseCptFeeList = [];
                }
            });
        };

        $scope.FeeScheduleCPTDetailsByOrgPayor = function (item) {
            $scope.FeeScheduleCPTDetail = [];
            const isCurrentlyOpen = item.isOpen;
            $scope.PayorWiseCptFeeList.forEach(subItem => {
                subItem.isOpen = false;
            });
            item.isOpen = !isCurrentlyOpen;
            let req = {
                "OrganizationId": item.OrganizationId || $scope.HospitalId,
                "OrganizationPayorId": item.OrganizationPayorId,
                "FeeScheduleId": item.FeeScheduleId,
                "PageNumber": 1,
                "PageSize":50
            };

            eHnoteSettingsDataService.GetFeeScheduleCPTDetailsByOrgPayorId(req).success(function (resp) {
                if (resp.Status=="Success") {
                    $scope.FeeScheduleCPTDetail = resp.rows || [];
                }
            });
        };
        


        $scope.EditPayorFeeSchedule = function (item) {
            $scope.FeeSchedulesObj.LocationIds = $scope.filterLocationslist
                .filter(pitem => pitem.ClinicId !== 0 && pitem.IsChecked)
                .map(pitem => pitem.ClinicId)
                .join(",");
            var obj = {
                "OrganizationId": $scope.FeeSchedulesObj.LocationIds||"",
                "ParentOrganizationId": $scope.ParentHospitalID,
                "PayerIds": "",
                "ProviderIds": "",
                "Status": "Active",
                "MedicareYear": new Date().getFullYear(),
                "PageNumber": 1,
                "PageSize": 10,
                "FeeScheduleId": item.FeeScheduleId
            };

            eHnoteSettingsDataService.GetCptFeeScheduleDetails(obj).then(function (resp) {
                if (resp.data.status === "Success" && resp.data.rows && resp.data.rows.length > 0) {

                    var feeScheduleData = angular.copy(resp.data.rows[0]);

                    // ===== KEY FIX: Keep only the clicked payer =====
                    if (feeScheduleData.Payors && feeScheduleData.Payors.length > 0) {
                        feeScheduleData.Payors = feeScheduleData.Payors.filter(function (p) {
                            return p.OrganizationPayorId === item.OrganizationPayorId;
                        });
                    }

                    // ===== Keep only procedures of the clicked payer =====
                    if (feeScheduleData.ProceduresList && feeScheduleData.ProceduresList.length > 0) {
                        feeScheduleData.ProceduresList = feeScheduleData.ProceduresList.filter(function (proc) {
                            // Match by OrganizationPayorId if procedure carries it
                            if (proc.OrganizationPayorId) {
                                return proc.OrganizationPayorId === item.OrganizationPayorId;
                            }
                            return true;
                        });
                    }

                    // Handle backend typo for "ProvedureNotCoveredByInsurance"
                    if (feeScheduleData.ProceduresList) {
                        feeScheduleData.ProceduresList.forEach(function (p) {
                            if (p.ProvedureNotCoveredByInsurance !== undefined && p.ProcedureNotCoveredByInsurance === undefined) {
                                p.ProcedureNotCoveredByInsurance = p.ProvedureNotCoveredByInsurance;
                            }
                        });
                    }

                    // Flag to indicate single-payer edit mode
                    $scope.IsSinglePayerEdit = true;
                    $scope.EditingPayorId = item.OrganizationPayorId;

                    // Reuse existing edit flow
                    $scope.EditFeeSchedule(feeScheduleData);

                } else {
                    alertify.error("Unable to load fee schedule details");
                }
            }, function (err) {
                alertify.error("Failed to load fee schedule");
                console.log(err);
            });
        };

        $scope.GetOrganizationProcedure = function (SearchText) {

            $scope.MasterMedicareFeeObj.OrganizationId = $scope.MasterMedicareFeeObj.OrganizationId || 0;
            if ($scope.MasterMedicareFeeObj.OrganizationId==0) {
                alertify.error('Please select location');
                return false;
            }
           
            var obj = {
                "OrganizationId": $scope.MasterMedicareFeeObj.OrganizationId||$scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE":  "",  // cptcode tblorganizationprocedure
                "SearchText": SearchText ||"", // searchtext
                "TypeOfServiceId":  0,
                "ProcedurePayorPlanId":  0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "IsFrequent": "N",
                "Status": 0 // All - 0, Active - 1, InActive -2
            };

            if (obj.OrganizationId == 0) {
                obj.GetAllIndicator = 1;
            } else if (obj.OrganizationId != 0) {
                obj.GetAllIndicator = 0;
            }

            return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows
                        .map(function (item) {
                            return item;
                        });
                }
            });
            
        };



  

    }]);
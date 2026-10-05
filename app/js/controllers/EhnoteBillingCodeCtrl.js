
eHnoteWebApp.controller('EhnoteBillingCodeCtrl', ['$scope', 'eHnoteMasterDataService', 'eHnotePatientVisitReasonServices', '$timeout', 'alertify', '$filter', 'eHnoteLoginStatusService', '$rootScope', '$location', 'localStorageFactory', 'eHnoteSettingsDataService', "eHnoteLabService", "$q", "$uibModal", "$window", "Lightbox", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnoteUserAppointmentDataService", "eHnoteMainAdminServices", function ($scope, eHnoteMasterDataService, eHnotePatientVisitReasonServices, $timeout, alertify, $filter, eHnoteLoginStatusService, $rootScope, $location, localStorageFactory, eHnoteSettingsDataService, eHnoteLabService, $q, $uibModal, $window, Lightbox, eHnoteUserDataService, eHnoteMainAppointmentService, eHnoteUserAppointmentDataService, eHnoteMainAdminServices) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.DisplayName = userLoginDetails.displayName;
    $scope.BillingCodeTabActive = 1;
    $scope.BillingCodeSubTabActive = 1;
    $scope.masterDiagnosisBtnName = "Add";
    $scope.masterCPTBillDetailBtnName = "Add";
    $scope.masterCPTValidationBtnName = "Add";
    $scope.masterSnomedCodeBtnName = "Add";
    $scope.masterDenialCodeBtnName = "Add";
    $scope.masterDrawerBtnName = "Add";
    $scope.masterDiagLevelType = "O";
    $scope.showModifyMasterDiagDiv = false;
    $scope.showAddCPTBillDetailDiv = false;
    $scope.masterFeeCodeBtnName = "Add";
    var currentdate = new Date();

    $scope.SelectedProceduresList = [];
    $scope.searchtxtb = { "txt1": "", "txt2": "" };
    $scope.selectedFeeCode = {};
    $scope.BillingMainClassActiveMenu = function (menuno) {
        return (menuno === $scope.BillingCodeTabActive) ? "active" : "";
    };

    $scope.BillingClassActiveMenu = function (menuno) {
        return (menuno === $scope.BillingCodeSubTabActive) ? "active" : "";
    };

    $scope.getDiagnosisObj = function () {
        var obj = {
            "DiagnosisId": 0,
            "DiagnosisName": "",
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchCode": "",
            "SearchDescription": "",
            "DiagnosisCode": "",
            "DiagnosisNotes": "",
            "ActiveInd": 'Y',
            "DiagnosisICDCode": "",
            "ICD9Code": "",
            "ICD10Code": "",
            "ICD11Code": "",
            "SearchICD9": "",
            "SearchICD10": "",
            "SearchICD11": "",
            "IsFrequent": false
        };
        return obj;
    };
    $scope.DiagnosisObj = angular.copy($scope.getDiagnosisObj());

    $scope.getDiagnosisICD9Obj = function () {
        var obj = {
            "DiagnosisId": 0,
            "DiagnosisName": "",
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchCode": "",
            "SearchDescription": "",
            "DiagnosisCode": "",
            "DiagnosisNotes": "",
            "ActiveInd": 'Y',
            "DiagnosisICDCode": ""
        };
        return obj;
    };
    $scope.DiagnosisICD9Obj = angular.copy($scope.getDiagnosisICD9Obj());

    $scope.getCPTBillDetailObj = function () {

        var obj = {
            "ProcedureId": 0,
            "OrgProcedureId":0,
            "ProcedureName":"",
            "ProcedureCode": "",
            "ShortCut": "",
            "Description": "",
            "Statement": "",
            "Modifier1": "",
            "Modifier2": "",
            "Modifier3": "",
            "Modifier4": "",
            "ProcedureGeneralCost": "",
            "MedicareExpected": "",
            "MedicarePublished": "",
            "PageSize": 10,
            "PageNumber": 1,
            "ActiveInd": 'Y',
            "SearchText": "",
            "SearchDescription": "",
            "SearchModifier1": "",
            "SearchCharge": "",
            "SearchMedicarePublished": "",
            "Modifier1Obj": "",
            "Modifier2Obj": "",
            "Modifier3Obj": "",
            "Modifier4Obj": "",
            "ProcedureCategoryId": "",
            "SpecializationId": "",
            "InternalRVU": "",
            "StandardCost": "",
            "StandardUnits": "",
            "HCPCSCode": "",
            "RVSCode": "",
            "RVSFee": "",
            "RVSUnits": "",
            "UBRevenueCode": "",
            "ServiceTypeObj":"",
            "ServiceTypeId": "",
            "CopayRelated": "",
            "ProcedureCategoryObj": "",
            "SpecialityObj": "",
            "POSId": "",
            "TOSId": "",
            "RecallTypeObj": "",
            "RecallTypeId": "",
            "RecallInterval": "",
            "CoinsurancePercent": "",
            "AuthorizationRequired": 'N',
            "DocumentationRequired": 'N',
            "ShortList": 'N',
            "NDCNumber": "",
            "DrugQuantity": "",
            "Comments": "",
            "Status": '',
            "POSObj": "",
            "TOSObj": "",
            "Inventory": "N",
            "OnHand": "",
            "ReorderPoint": "",
            "PurchasedService": "N",
            "ValidGender": "N",
            "EMCode": "N",
            "Emergency": "N",
            "COB": "N",
            "EPSTD": "N",
            "CodingSymbolObj": "",
            "CodingSymbolId": "",
            "PostOpDays": "",
            "ProcedureTypeobj": "",
            "ProcedureTypeNewId": "",
            "TaxableService":'N'
        };
        return obj;
    }
    $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());


    $scope.getCPTValidationObj = function () {
        var obj = {
            "ProcedureValidationId": 0,
            "ProcedureId": $scope.CPTBillDetailObj.ProcedureId,
            "CPTCode":"",
            "DiagnosisId": 0,
            "Gender": 'M',
            "InsurancePlanObj":"",
            "InsurancePlanId": "",
            "SpecializationId":"",
            "SpecialityObj":"",
            "Age": "",
            "Allow": "N",
            "Parnopar": "",
            "IncludeExclude":"N",
            "UserId": "",
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchCode": "",
            "SearchDescription": "",
            "DeleteInd": 'N',
            "ICD9PageSize": 10,
            "ICDPageNumber": 1,
            "ICDSearchText": "",
            "ICDSearchCode": "",
            "ICDSearchDescription": "",
            "SelectedICD9Obj": "",
            "SelectedICD10Obj": "",
            "ProcedureCode": $scope.CPTBillDetailObj.ProcedureCode,
            "SearchSpecializationId": "",
            "SearchSpecialityObj":""
        };
        return obj;
    };
    $scope.CPTValidationObj = angular.copy($scope.getCPTValidationObj());

    function getMasterModifiers() {
        eHnoteSettingsDataService.GetAllModifiers().success(function (response) {
            $scope.ModifierList1 = [];
            $scope.ModifierList2 = [];
            $scope.ModifierList3 = [];
            $scope.ModifierList4 = [];
            $scope.FeeModifierList1 = [];
            $scope.FeeModifierList2 = [];
            $scope.FeeModifierList3 = [];
            $scope.FeeModifierList4 = [];
            if (response.status === "Success") {
                $scope.ModifierList1 = response.rows || [];
                $scope.ModifierList2 = response.rows || [];
                $scope.ModifierList3 = response.rows || [];
                $scope.ModifierList4 = response.rows || [];

                $scope.FeeModifierList1 = response.rows || [];
                $scope.FeeModifierList2 = response.rows || [];
                $scope.FeeModifierList3 = response.rows || [];
                $scope.FeeModifierList4 = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }

    function getMasterCPTBillDetail() {

        object = {
            "LevelType": "O",
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.CPTBillDetailObj.SearchText,
            "PageSize": $scope.CPTBillDetailObj.PageSize,
            "PageNumber": $scope.CPTBillDetailObj.PageNumber,
            "ProcedureTypeId": 1,
            "SearchDescription": $scope.CPTBillDetailObj.SearchDescription,
            "SearchModifier1": $scope.CPTBillDetailObj.SearchModifier1,
            "SearchCharge": $scope.CPTBillDetailObj.SearchCharge,
            "AllBranchInd": 0
        };

        eHnoteSettingsDataService.getMasterCPTBillDetail(object).success(function (response) {
            $scope.FeeCodeMasterCPTBillDetailList = [];
            $scope.MasterCPTBillDetailList = [];
            if (response.ProcedureList !== undefined) {
                if (response.ProcedureList.length > 0) {
                    $scope.MasterCPTBillDetailList = response.ProcedureList;
                    $scope.MasterCPTBillDetailItems = response.count;
                    $scope.FeeCodeMasterCPTBillDetailList = response.ProcedureList;
                }
            }

        }).error(function (error) {
            console.log(error);
        });
    }


    function getFeeMasterCPTBillDetail() {

        object = {
            "LevelType": "O",
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.CPTBillDetailObj.SearchText || "",
            "PageSize": 100,
            "PageNumber": 1,
            "ProcedureTypeId": 1,
            "SearchDescription":"",
            "SearchModifier1": "",
            "SearchCharge":"",
            "AllBranchInd": 0
        };

        eHnoteSettingsDataService.getMasterCPTBillDetail(object).success(function (response) {
            $scope.FeeCodeMasterCPTBillDetailList = [];
            if (response.ProcedureList !== undefined) {
                if (response.ProcedureList.length > 0) {
                    $scope.FeeCodeMasterCPTBillDetailList = response.ProcedureList;
                }
            }

        }).error(function (error) {
            console.log(error);
        });
    }


    function getServiceType() {
            eHnoteSettingsDataService.GetAllDropdownValuesByType('ProcedureServiceType').then(function (resp) {
                $scope.ServiceTypes = resp.data.rows;
            }, function (err) {
                console.log(err);
                    alertify.error("Getting ServiceTypes Failed");
            });
    }
    function getInsuranceServiceType() {
        $scope.InsurancePlanTypeList = [];
        eHnoteSettingsDataService.GetAllDropdownValuesByType('InsurancePlanType').then(function (resp) {
            $scope.InsurancePlanTypeList = resp.data.rows;
            }, function (err) {
                console.log(err);
                    alertify.error("Getting ServiceTypes Failed");
            });
    }

    $scope.ClearCPTBillDetail = function () {
        $scope.showAddCPTBillDetailDiv = false;

        $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());
        $scope.masterCPTBillDetailBtnName = 'Add';
    }
    function getMasterPOSCodes() {
        eHnoteSettingsDataService.GetAllPOSCodes().success(function (response) {
            $scope.POSCodeList = [];
            if (response.status === "Success") {
                $scope.POSCodeList = response.rows || [];
                $scope.FeePOSCodeList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }
    function Getwriteoffdetails() {
        eHnoteSettingsDataService.Getwriteoffdetails().success(function (response) {
            $scope.WriteoffList = [];
            if (response.status === "Success") {
                $scope.WriteoffList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }
    function getMasterTOSCodes() {
        eHnoteSettingsDataService.GetAllTOSCodes().success(function (response) {
            $scope.TOSCodeList = [];
            if (response.status === "Success") {
                $scope.TOSCodeList = response.rows || [];
                $scope.FeeTOSCodeList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }
    function getMasterProcedureCategory() {
        eHnoteSettingsDataService.GetAllProcedureCategory().success(function (response) {
            $scope.ProcedureCategoryList = [];
            if (response.status === "Success") {
                $scope.ProcedureCategoryList = response.rows || [];
                $scope.FeeProcedureCategoryList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }

    function getRecallTypes() {
        eHnoteSettingsDataService.GetAllDropdownValuesByType('ProcedureRecallType').then(function (resp) {
            $scope.RecallTypes = resp.data.rows;
        }, function (err) {
            console.log(err);
            alertify.error("Getting RecallTypes Failed");
        });
    }
    function getCodingSymbols() {
        eHnoteSettingsDataService.GetAllDropdownValuesByType('ProcedureCodingSymbol').then(function (resp) {
            $scope.CodingSymbolList = resp.data.rows;
        }, function (err) {
            console.log(err);
            alertify.error("Getting Coding Symbols Failed");
        });
    }
    function getProcedureTypes() {
        eHnoteSettingsDataService.GetAllDropdownValuesByType('ProcedureType').then(function (resp) {
            $scope.ProcedureTypes = resp.data.rows;
        }, function (err) {
            console.log(err);
            alertify.error("Getting ProcedureTypes Failed");
        });
    }
    function getInsuranceTypes() {
     eHnoteSettingsDataService.GetAllInsurancePlans().then(function (resp) {
                $scope.InsurancePlanList = resp.data;
                $scope.FeeInsurancePlanList = resp.data;
        }, function (err) {
            console.log(err);
            alertify.error("Getting InsurancePlan Failed");
        });
    }

    $scope.getSnomedCodesObj = function () {
        var obj = {
            "SnomedCodeId": 0,
            "ConceptId": "",
            "Description": "",
            "EffectiveTime": moment().format("MM-DD-YYYY"),
            "TypeId": "",
            "StatusId": "",
            "ModifiedStatusId": "",
            "EnterBy": $scope.DisplayName,
            "ModifiedName": $scope.DisplayName,
            "CreatedBy": $scope.UserId,
            "ModifiedBy": $scope.UserId,
            "EnteredDate": moment().format("MM-DD-YYYY"),
            "DeleteInd": 'N',
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchType": "",
            "SearchConcept": "",
            "SearchEnteredDate": moment().format("MM-DD-YYYY"),
            "ConceptObj": "",
            "TypeObj": "",
            "StatusObj": "",
            "ActiveInd": 'Y'
        };
        return obj;
    };
    $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());

    function getSnomedCodeItems() {
        object = {
            "HospitalId": hospid,
            "SearchText": $scope.SnomedCodesObj.SearchDescription,
            "PageSize": $scope.SnomedCodesObj.PageSize,
            "PageNumber": $scope.SnomedCodesObj.PageNumber,
            "SearchType": $scope.SnomedCodesObj.SearchType || "",
            "SearchConcept": $scope.SnomedCodesObj.SearchConcept || "",
            "SearchDate": $scope.SnomedCodesObj.SearchEnteredDate || "",
            "ParentOrganizationId": parentHospitalId || null,
        };

        eHnoteSettingsDataService.GetSnomedCodes(object).success(function (response) {
            $scope.SnomedCodesArray = [];
            if (response.count > 0) {
                $scope.SnomedCodesArray = response.rows;
                $scope.masterSnomedCodesItems = response.count;
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    $scope.getSnomedCodesforICD10Obj = function () {
        var obj = {
            "SnomedCodeId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchDescription": "",
            "HospitalId": hospid
        };
        return obj;
    };
    $scope.SnomedCodesICD10Obj = angular.copy($scope.getSnomedCodesforICD10Obj());



    $scope.getDenialsObj = function () {
        var obj = {
            "DenialId": 0,
            "ShortCut": "",
            "Description": "",
            "PlanId": "",
            "StatusId": "Y",
            "Comments":"",
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchDescription": "",
            "SearchStatusId":'Y',
            "HospitalId": hospid,
            "DeleteInd": "N"
        };
        return obj;
    };

    $scope.BillingDenialObj = angular.copy($scope.getDenialsObj());



    $scope.getDrawerObj = function () {
        var obj = {
            "SuperBillId":0,
            "ProviderId": "",
            "AppointmentTypeId": "",
            "PlanId": "",
            "LocationId": "",
            "SpecializationId":'',
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SearchPlan": "",
            "SearchAppType": '',
            "HospitalId": hospid,
            "DeleteInd": "N",
            "ProviderObj": "",
            "PlanObj": "",
            "SpecialityObj": "",
            "LocationObj": "",
            "SearchProviderObj": "",
            "SearchPlanObj": "",
            "SearchAppTypeObj": "",
            "AppTypeObj":""
        };
        return obj;
    };

    $scope.SuperBillDrawerObj = angular.copy($scope.getDrawerObj());

    function getMasterSnomedICD10Items(type) {
        if (type === 'Search') {
            $scope.SnomedCodesICD10Obj.PageNumber = 1;
        }
        object = {
            "HospitalId": hospid,
            "SnomedCodeId": $scope.SnomedCodesObj.SnomedCodeId || 0,
            "SearchText": $scope.SnomedCodesICD10Obj.SearchText,
            "PageSize": $scope.SnomedCodesICD10Obj.PageSize,
            "PageNumber": $scope.SnomedCodesICD10Obj.PageNumber,
            "SearchDescription": $scope.SnomedCodesICD10Obj.SearchDescription,
        };

        eHnoteSettingsDataService.getMasterSnomedCodesForICD10(object).success(function (response) {
            $scope.SnomedICD10Array = [];
            if (response.rows !== undefined) {
                if (response.rows.length > 0) {
                    $scope.SnomedICD10Array = response.rows;
                    $scope.masterSnomedICD10Items = response.count;
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    $scope.SearchMasterSnomedICD10Items = function (type) {
        getMasterSnomedICD10Items(type);
    }
    $scope.ClearMasterSnomedICD10Items = function () {
        $scope.SnomedCodesICD10Obj = angular.copy($scope.getSnomedCodesforICD10Obj());
        $scope.SnomedCodesICD10Obj.SnomedCodeId = $scope.SnomedCodesObj.SnomedCodeId || 0;
        getMasterSnomedICD10Items('');
    }

    function GetDenialCodes(type) {
        if (type === 'Search') {
            $scope.BillingDenialObj.PageNumber = 1;
        }
        object = {
            "HospitalId": hospid,
            "SearchText": $scope.BillingDenialObj.SearchText,
            "PageSize": $scope.BillingDenialObj.PageSize,
            "PageNumber": $scope.BillingDenialObj.PageNumber,
            "SearchDescription": $scope.BillingDenialObj.SearchDescription,
            "SearchStatusId": $scope.BillingDenialObj.SearchStatusId
        };

        eHnoteSettingsDataService.GetDenialCodes(object).success(function (response) {
            $scope.DenialCodesList = [];
            if (response.rows !== undefined) {
                if (response.rows.length > 0) {
                    $scope.DenialCodesList = response.rows;
                    $scope.masterDenialCodeItems = response.count;
                    angular.forEach($scope.DenialCodesList, function (item) {
                        if (item.StatusId === 'Y') {
                            item.StatusName = 'Active';
                        }
                        else {
                            item.StatusName = 'InActive';
                        }
                    })
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }


    function GetSuperBill(type) {
        if (type === 'Search') {
            $scope.SuperBillDrawerObj.PageNumber = 1;
        }
        object = {
            "HospitalId": hospid,
            "SearchText": $scope.SuperBillDrawerObj.SearchText,
            "PageSize": $scope.SuperBillDrawerObj.PageSize,
            "PageNumber": $scope.SuperBillDrawerObj.PageNumber,
            "SearchPlan": $scope.SuperBillDrawerObj.SearchPlan,
            "SearchAppType": $scope.SuperBillDrawerObj.SearchAppType
        };

        eHnoteSettingsDataService.GetSuperBills(object).success(function (response) {
            $scope.DrawerList = [];
            if (response.rows !== undefined) {
                if (response.rows.length > 0) {
                    $scope.DrawerList = response.rows;
                    $scope.masterDrawerItems = response.count;
                   
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    $scope.getBranchAppointmentTypes = function (hospitalId) {

        eHnoteMainAppointmentService.getBranchAppointmentTypes(hospitalId).then(function (resp) {
            $scope.appointmentTypes = [];
            if (resp.data.rows != undefined) {
                $scope.appointmentTypes = resp.data.rows;
                $scope.appointmentTypes = $scope.appointmentTypes.filter(x => x.AppointmentTypeId !== 9);
                angular.forEach($scope.appointmentTypes, function (item) {
                    item.AppointmentTypeId = item.AppointmentTypeId.toString();
                });
            }
        });
    };
    $scope.getDoctorsbySubSpecializations = function (branchId, pagetype) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }
        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.clinicDoctorList = [];
                $scope.allUserList = resp.rows;
                var RoleID = userLoginDetails.RoleID;
               
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                

                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                });

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
                $scope.mainDilationAppointmentList = [];
            }
        }

        function onGetUsersFailure(data) {
        }
    }
    function getBranchSpecializations(SubOrganizationId, BranchId, pagetype) {
        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }

            });
        }
    }
    function GetBranchSubSpecializations(SubOrganizationId, BranchId, pagetype) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;

                if (pagetype === 'PageLoad') {
                    $scope.newAllSubSpecializationsArray = angular.copy(resp.data.row);
                }


                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations(BranchId, pagetype);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.newAllSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    };
    function InitializeBranches(data, pagetype) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
        $scope.BranchesListArray = clinicAddress;
        $scope.AppListdoctoraddress = [];
        angular.forEach($scope.BranchesListArray, function (item, index) {
            if (item.ClinicName !== 'All Locations') {
                $scope.AppListdoctoraddress.push(item);
            }
        });
        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);
    }

    $scope.getSuperBillProcedureObj = function () {

        var obj = {
            "PageSize": 100,
            "PageNumber": 1,
            "ActiveInd": 'Y',
            "SearchText": "",
            "SearchDescription": "",
            "SearchModifier1": "",
            "SearchCharge": "",
            "SuperbillProcedureId":0
        };
        return obj;
    }
    $scope.SuperBillProcedureObj = angular.copy($scope.getSuperBillProcedureObj());


    $scope.getSuperBillDiagnosisObj = function () {

        var obj = {
            "PageSize": 100,
            "PageNumber": 1,
            "ActiveInd": 'Y',
            "SearchText": "",
            "SearchCode": "",
            "SearchDescription": "",
            "SuperbillDiagnosisId": 0
        };
        return obj;
    }
    $scope.SuperBillDiagnosisObj = angular.copy($scope.getSuperBillDiagnosisObj());

    function getMasterProceduresForSuperBill() {

        object = {
            "LevelType": "O",
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.SuperBillProcedureObj.SearchText,
            "PageSize": $scope.SuperBillProcedureObj.PageSize,
            "PageNumber": $scope.SuperBillProcedureObj.PageNumber,
            "ProcedureTypeId": 1,
            "SearchDescription": $scope.SuperBillProcedureObj.SearchDescription,
            "SearchModifier1": $scope.SuperBillProcedureObj.SearchModifier1,
            "SearchCharge": $scope.SuperBillProcedureObj.SearchCharge,
            "AllBranchInd": 0
        };

        eHnoteSettingsDataService.getMasterCPTBillDetail(object).success(function (response) {
            $scope.MasterSuperBillProcedureList = [];
            if (response.ProcedureList !== undefined) {
                if (response.ProcedureList.length > 0) {
                    $scope.MasterSuperBillProcedureList = response.ProcedureList;
                }
            }

        }).error(function (error) {
            console.log(error);
        });
    }


    function getMasterDiagnosisForSuperBill() {
        object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.SuperBillDiagnosisObj.SearchText,
            "PageSize": $scope.SuperBillDiagnosisObj.PageSize,
            "PageNumber": $scope.SuperBillDiagnosisObj.PageNumber,
            "SearchCode": $scope.SuperBillDiagnosisObj.SearchCode,
            "SearchDescription": $scope.SuperBillDiagnosisObj.SearchDescription,
            "IsFrequent": "N",
            "ParentOrganizationId": parentHospitalId || null,
        };

        eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).success(function (response) {
            $scope.MasterSuperBillDiagnosisList = [];
            if (response.DiagnosisList !== undefined) {
                if (response.DiagnosisList.length > 0) {
                    $scope.MasterSuperBillDiagnosisList = response.DiagnosisList;
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    $scope.SearchSuperBillProcedure = function () {
        getMasterProceduresForSuperBill();
    }
    $scope.SearchSuperBillDiagnosis = function () {
        getMasterDiagnosisForSuperBill();
    }
    function getMasterDiagnosisItems() {
        object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.DiagnosisObj.SearchText,
            "PageSize": $scope.DiagnosisObj.PageSize,
            "PageNumber": $scope.DiagnosisObj.PageNumber,
            "SearchCode": $scope.DiagnosisObj.SearchCode,
            "SearchDescription": $scope.DiagnosisObj.SearchDescription,
            "SearchICD9": $scope.DiagnosisObj.SearchICD9,
            "SearchICD10": $scope.DiagnosisObj.SearchICD10,
            "SearchICD11": $scope.DiagnosisObj.SearchICD11,
            "IsFrequent": "N",
            "ParentOrganizationId": parentHospitalId || null,
        };

        eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).success(function (response) {
            $scope.MasterDiagnosisOrgArray = [];
            if (response.DiagnosisList !== undefined) {
                if (response.DiagnosisList.length > 0) {
                    $scope.MasterDiagnosisICD10Array = response.DiagnosisList;
                    $scope.masterdiagItems = response.count;
                    if ($scope.MasterDiagnosisICD10Array.length > 0) {
                        angular.forEach($scope.MasterDiagnosisICD10Array, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentInd = true;
                            }
                            else {
                                item.IsFrequentInd = false;
                            }
                        });
                    }
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }
    $scope.switchBillingCodeTab = function (index) {
        $scope.BillingCodeTabActive = index;
        if ($scope.BillingCodeTabActive === 1) {
            $scope.BillingCodeSubTabActive = 1;
            getMasterDiagnosisItems();
        }
        if ($scope.BillingCodeTabActive === 2) {
            $scope.BillingCodeSubTabActive = 4;
            $scope.ClearCPTBillDetail();
            getMasterModifiers();
            getServiceType();
            getMasterCPTBillDetail();
            getMasterPOSCodes();
            getMasterTOSCodes();
            getRecallTypes();
            getCodingSymbols();
            getProcedureTypes();
            getMasterProcedureCategory();
           
        }
        if ($scope.BillingCodeTabActive === 3) {
            $scope.BillingCodeSubTabActive = 11;
            getProcedureTypes();
            getSnomedCodeItems();
        }
        if ($scope.BillingCodeTabActive === 4) {
            $scope.BillingCodeSubTabActive = 14;
            getFeeMasterCPTBillDetail();
            getMasterPOSCodes();
            getMasterTOSCodes();
            getMasterProcedureCategory();           
            getInsuranceTypes();
            getMasterModifiers();
            
            GetMasterProcedureFees();
            Getwriteoffdetails();

        }
        if ($scope.BillingCodeTabActive === 5) {
            $scope.BillingCodeSubTabActive = 18;
            var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
            InitializeBranches(NewBranchList, "PageLoad");
            $scope.getBranchAppointmentTypes(hospid);
            GetSuperBill('');
        }
        if ($scope.BillingCodeTabActive === 6) {
            $scope.BillingCodeSubTabActive = 22;
        }
        if ($scope.BillingCodeTabActive === 7) {
            GetDenialCodes('');
        }
        if ($scope.BillingCodeTabActive === 8) {
            $scope.BillingCodeSubTabActive = 25;
        }
        if ($scope.BillingCodeTabActive === 9) {
            $scope.BillingCodeSubTabActive = 30;
        }
        if ($scope.BillingCodeTabActive === 10) {
            $scope.BillingCodeSubTabActive = 34;
        }
        if ($scope.BillingCodeTabActive === 11) {
            $scope.BillingCodeSubTabActive = 38;
            getProcedureTypes();
        }
    };


   

    function getMasterDiagnosisICD9Items() {
        object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.DiagnosisICD9Obj.SearchText,
            "PageSize": $scope.DiagnosisICD9Obj.PageSize,
            "PageNumber": $scope.DiagnosisICD9Obj.PageNumber,
            "SearchCode": $scope.DiagnosisICD9Obj.SearchCode,
            "SearchDescription": $scope.DiagnosisICD9Obj.SearchDescription,
        };

        eHnoteSettingsDataService.getMasterDiagnosisForICD9Codes(object).success(function (response) {
            $scope.MasterDiagnosisICD9Array = [];
            if (response.DiagnosisList !== undefined) {
                if (response.DiagnosisList.length > 0) {
                    $scope.MasterDiagnosisICD9Array = response.DiagnosisList;
                    $scope.masterdiagICD9Items = response.count;
                  
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    function getCPTValidationItems() {
        object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.CPTValidationObj.SearchText,
            "PageSize": $scope.CPTValidationObj.PageSize,
            "PageNumber": $scope.CPTValidationObj.PageNumber,
            "SearchICD9Code": $scope.CPTValidationObj.SearchICD9Code || "",
            "SearchICD10Code": $scope.CPTValidationObj.SearchICD10Code || ""
        };

        eHnoteSettingsDataService.GetCPTValidations(object).success(function (response) {
            $scope.CPTValidationArray = [];
            if (response.count > 0) {
                $scope.CPTValidationArray = response.rows;

                $scope.masterCPTValidationItems = response.count;

            }
        }).error(function (error) {
            console.log(error);
        });
    }
    function getSuperBillProcedure(SuperBillId,hospid) {
        eHnoteSettingsDataService.GetSuperBillProcedure(SuperBillId, hospid).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.SelectedProceduresList = resp.data.rows || [];
            }
        });
    };
    function getSuperBillDiagnosis(SuperBillId, hospid) {
        eHnoteSettingsDataService.GetSuperBillDiagnosis(SuperBillId, hospid).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.SelectedDiagnosisList = resp.data.rows || [];
            }
        });
    };

    $scope.switchBillingCodeSubTab = function (index) {
        $scope.BillingCodeSubTabActive = index;
        if ($scope.BillingCodeSubTabActive === 1) {
            getMasterDiagnosisItems();
        }
        if ($scope.BillingCodeSubTabActive === 2) {
            getMasterDiagnosisICD9Items();
        }
        if ($scope.BillingCodeSubTabActive === 3) {
            $scope.showAddCPTBillDetailDiv = false;
            getMasterCPTBillDetail();
            getMasterModifiers();
          
        }

        if ($scope.BillingCodeSubTabActive === 4) {
            $scope.showAddCPTBillDetailDiv = false;
            getMasterModifiers();
            getMasterProcedureCategory();
           
        }
        if ($scope.BillingCodeSubTabActive === 14) {            
            //getMasterProcedureCategory();
            getFeeMasterCPTBillDetail();
        }

        if ($scope.BillingCodeSubTabActive === 5) {
            $scope.showAddCPTBillDetailDiv = false;
          
        }

        if ($scope.BillingCodeSubTabActive === 6) {
            getMasterPOSCodes();
            getMasterTOSCodes();
        }

        if ($scope.BillingCodeSubTabActive === 10) {
          
            getInsuranceTypes();
            getCPTValidationItems();
            $scope.CPTValidationObj = angular.copy($scope.getCPTValidationObj());
            $scope.CPTValidationObj.ProcedureId = $scope.CPTBillDetailObj.ProcedureId;
            $scope.CPTValidationObj.CPTCode = $scope.CPTBillDetailObj.ProcedureCode;
          //  $scope.GetDiagnosisICD9List('ICD10');
        }
        if ($scope.BillingCodeSubTabActive === 13) {
            getMasterSnomedICD10Items('');
        }
        if ($scope.BillingCodeSubTabActive === 18) {
            GetSuperBill('');
        }
        if ($scope.BillingCodeSubTabActive === 19) {
            getMasterDiagnosisForSuperBill();
            getSuperBillDiagnosis($scope.SuperBillDrawerObj.SuperBillId, hospid);
        }
        if ($scope.BillingCodeSubTabActive === 20) {
            getMasterProceduresForSuperBill();
            getSuperBillProcedure($scope.SuperBillDrawerObj.SuperBillId,hospid);
        }
        if ($scope.BillingCodeSubTabActive === 24) {
            $scope.BillingCodechildSubTabActive = 1;
        }
       
    };

    $scope.switchBillingCodechildSubTab = function (index) {
        $scope.BillingCodechildSubTabActive = index;
    }

    $scope.init = function () {
        getInsuranceTypes();
        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        function onspecsuccess(data) {
            $scope.specialitylist = data;
        }

        function onspecfailure(data) {
        }
        getMasterDiagnosisItems();
    };
    $scope.init();

    $scope.DiagnosisICD10pageChanged = function (pageno) {

        $scope.DiagnosisObj.PageNumber = pageno;
        getMasterDiagnosisItems();

    };
    $scope.DiagnosisICD9pageChanged = function (pageno) {

        $scope.DiagnosisICD9Obj.PageNumber = pageno;
        getMasterDiagnosisICD9Items();

    };

    $scope.SearchDiagnosisICD10List = function () {
        var object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.DiagnosisObj.SearchText,
            "PageSize": $scope.DiagnosisObj.PageSize,
            "PageNumber": 1,
            "SearchCode": $scope.DiagnosisObj.SearchCode,
            "SearchDescription": $scope.DiagnosisObj.SearchDescription,
            "SearchICD9": $scope.DiagnosisObj.SearchICD9 ,
            "SearchICD10": $scope.DiagnosisObj.SearchICD10,
            "SearchICD11": $scope.DiagnosisObj.SearchICD11,
            "IsFrequent": "N",
            "ParentOrganizationId": parentHospitalId || null,
        };

        eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).success(function (response) {
            $scope.MasterDiagnosisICD10Array = [];
            if (response.DiagnosisList !== undefined) {
                if (response.DiagnosisList.length > 0) {

                    $scope.MasterDiagnosisICD10Array = response.DiagnosisList;

                    $scope.masterdiagItems = response.count;

                    if ($scope.MasterDiagnosisICD10Array.length > 0) {
                        angular.forEach($scope.MasterDiagnosisICD10Array, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentInd = true;
                            }
                            else {
                                item.IsFrequentInd = false;
                            }
                        });
                    }
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    
    $scope.showModifyMasterDiag = function () {
        $scope.showModifyMasterDiagDiv = true;
        $scope.EditDiagnosisCode = true;
    };

    $scope.AddupdateMasteDiag = function () {

      
        if ($scope.DiagnosisObj.DiagnosisName === "" || $scope.DiagnosisObj.DiagnosisName === undefined) {
            alertify.error("Enter Diagnosis Name");
            return false;
        }
        //if ($scope.DiagnosisObj.DiagnosisICDCode === "" || $scope.DiagnosisObj.DiagnosisICDCode === undefined) {
        //    alertify.error("Enter DiagnosisCode");
        //    return false;
        //}

        if ($scope.DiagnosisObj.IsFrequent == true) {
            var IsFrequent = "Y";
        } else {
            var IsFrequent = "N";
        }

        object = {
            "DiagnosisId": $scope.DiagnosisObj.DiagnosisId || 0,
            "DiagnosisName": $scope.DiagnosisObj.DiagnosisName,
            "DiagnosisNotes": $scope.DiagnosisObj.DiagnosisNotes,
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "ActiveInd": $scope.DiagnosisObj.ActiveInd,
            "SpecializationId": $scope.SpecializationId,
            "DiagnosisCode": $scope.DiagnosisObj.DiagnosisCode,
            "DiagnosisICDCode": $scope.DiagnosisObj.DiagnosisICDCode,
            "ICD9Code": $scope.DiagnosisObj.ICD9Code,
            "ICD10Code": $scope.DiagnosisObj.ICD10Code,
            "ICD11Code": $scope.DiagnosisObj.ICD11Code,
            "IsFrequent": IsFrequent,
            "ParentOrganizationId": parentHospitalId || null,

        };

        if ($scope.DiagnosisObj.DiagnosisId == 0) {
            if ($scope.MasterDiagnosisICD10Array.length > 0) {

                if (angular.isObject($scope.DiagnosisObj.DiagnosisName)) {
                    var List = $filter("filter")($scope.MasterDiagnosisICD10Array, { "ICD10DIAGNAME": $scope.DiagnosisObj.DiagnosisName}, true);
                }
                else {
                    var List = $filter("filter")($scope.MasterDiagnosisICD10Array, { "ICD10DIAGNAME": $scope.DiagnosisObj.DiagnosisName }, true);
                }

                if (List.length > 0) {
                    alertify.error('Diagnosis Name is already exists');
                    return;
                }
            }
        }

        eHnoteSettingsDataService.addUpdateMasterDiagnosis(object).success(function (response) {

            if ($scope.DiagnosisObj.ActiveInd === 'N') {
                alertify.success("Diagnosis Deleted Successfully");
                $scope.CancelMasterDiagClick();
                getMasterDiagnosisItems();

            } else {
                if (response.status === 'Success') {
                    if ($scope.DiagnosisObj.DiagnosisId === undefined || $scope.DiagnosisObj.DiagnosisId === 0) {
                        alertify.success("Diagnosis Added Successfully");
                    } else {
                        alertify.success("Diagnosis Updated Successfully");
                    }
                    $scope.CancelMasterDiagClick();
                    getMasterDiagnosisItems();

                }

                if (response.status === 'Failure') {
                    if (response.Message === 'Maximum Frequent Items Reached!') {
                        alertify.error("Maximum Frequent Items Reached!");
                        $scope.DiagnosisObj.DiagnosisName = "";
                        $scope.DiagnosisObj.IsFrequent = false;                       
                    }
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    };
    
  
    $scope.CancelMasterDiagClick = function () {
        $scope.showModifyMasterDiagDiv = false;
        $scope.masterDiagnosisBtnName = "Add";
        $scope.DiagnosisObj = angular.copy($scope.getDiagnosisObj());
    };
    
    $scope.editOrgMasterDiagItem = function (item, index) {
        $scope.diagnosisFocus = true;
        $scope.showModifyMasterDiagDiv = true;
        $scope.DiagnosisObj = angular.copy($scope.getDiagnosisObj());
        $scope.DiagnosisObj.DiagnosisId = item.DiagnosisId;
        $scope.DiagnosisObj.DiagnosisName = item.ICD10DIAGNAME;
        //$scope.DiagnosisObj.DiagnosisNotes = item.ICD10DIAGDESCRIPTION;
        $scope.DiagnosisObj.DiagnosisNotes = item.DiagnosisNotes;
        $scope.DiagnosisObj.DiagnosisICDCode = item.ICD10CODE;
        $scope.DiagnosisObj.ActiveInd = "Y";
        $scope.masterDiagnosisBtnName = "Update";
        $scope.DiagnosisObj.ICD9Code = item.ICD9CODE;
        $scope.DiagnosisObj.ICD10Code = item.ICD10CODE;
        $scope.DiagnosisObj.ICD11Code = item.ICD11CODE;
        if (item.IsFrequent == "Y") {
            $scope.DiagnosisObj.IsFrequent = true;
        } else {
            $scope.DiagnosisObj.IsFrequent = false;
        }
    };


    $scope.CancelDiagnosisSearch = function () {
        
        $scope.DiagnosisObj = angular.copy($scope.getDiagnosisObj());
        $scope.SearchDiagnosisICD10List();
    };

    $scope.deleteOrgMasterDiagItem = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this diagnosis? </h4>", function () {

            $scope.DiagnosisObj.DiagnosisId = item.DiagnosisId;
            $scope.DiagnosisObj.DiagnosisName = item.ICD10DIAGNAME;
            $scope.DiagnosisObj.DiagnosisNotes = item.ICD10DIAGDESCRIPTION;
            $scope.DiagnosisObj.DiagnosisICDCode = item.ICD10CODE;
            $scope.DiagnosisObj.ActiveInd = 'N';
            $scope.AddupdateMasteDiag();
        }, function () {
            r = "You pressed Cancel!";
        });
    };
    $scope.EditDiagnosisCode = false;
  
    $scope.SearchDiagnosisICD9List = function () {
        var object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.DiagnosisICD9Obj.SearchText,
            "PageSize": $scope.DiagnosisICD9Obj.PageSize,
            "PageNumber": 1,
            "SearchCode": $scope.DiagnosisICD9Obj.SearchCode,
            "SearchDescription": $scope.DiagnosisICD9Obj.SearchDescription,
        };

        eHnoteSettingsDataService.getMasterDiagnosisForICD9Codes(object).success(function (response) {
            $scope.MasterDiagnosisICD9Array = [];
            if (response.DiagnosisList !== undefined) {
                if (response.DiagnosisList.length > 0) {

                    $scope.MasterDiagnosisICD9Array = response.DiagnosisList;

                    $scope.masterdiagICD9Items = response.count;
                }
            }
        }).error(function (error) {
            console.log(error);
        });
    }


    $scope.ClearDiagnosisICD9List = function () {
        $scope.DiagnosisICD9Obj = angular.copy($scope.getDiagnosisICD9Obj());
        getMasterDiagnosisICD9Items();
    };
    $scope.SearchCPTBillDetail = function () {

        object = {
            "LevelType": "O",
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": null,
            "SearchText": $scope.CPTBillDetailObj.SearchText,
            "PageSize": $scope.CPTBillDetailObj.PageSize,
            "PageNumber": 1,
            "ProcedureTypeId": 1,
            "SearchDescription": $scope.CPTBillDetailObj.SearchDescription,
            "SearchModifier1": $scope.CPTBillDetailObj.SearchModifier1,
            "SearchCharge": $scope.CPTBillDetailObj.SearchCharge,
            "AllBranchInd": 0
        };

        eHnoteSettingsDataService.getMasterCPTBillDetail(object).success(function (response) {

            $scope.MasterCPTBillDetailList = [];
           

            if (response.ProcedureList !== undefined) {
                if (response.ProcedureList.length > 0) {
                    $scope.MasterCPTBillDetailList = response.ProcedureList;
                    $scope.MasterCPTBillDetailItems = response.count;
                   
                }
            }

        }).error(function (error) {
            console.log(error);
        });
    }


    $scope.CancelCPTBillDetail = function () {
        $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());
        getMasterCPTBillDetail();
    }
    $scope.ClearCPTBillDetail = function () {
        $scope.showAddCPTBillDetailDiv = false;
      
        $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());
        $scope.masterCPTBillDetailBtnName = 'Add';
    }
    $scope.showAddCPTBillDetail = function () {
        $scope.showAddCPTBillDetailDiv = true;
        $scope.EditCPTBillDetail = true;
    };
  


    $scope.AddUpdateCPTBillDetail = function (type,screen) {

    
        if ($scope.CPTBillDetailObj.ProcedureCode === "" || $scope.CPTBillDetailObj.ProcedureCode === undefined) {
            alertify.error("Enter CPT Code");
            return false;
        }
        if ($scope.CPTBillDetailObj.ProcedureName === "" || $scope.CPTBillDetailObj.ProcedureName === undefined) {
            alertify.error("Enter CPT Name");
            return false;
        }

        object = {
            "ProcedureId": $scope.CPTBillDetailObj.ProcedureId || 0,
            "ProcedureName": $scope.CPTBillDetailObj.ProcedureName,
            "ProcedureCode": $scope.CPTBillDetailObj.ProcedureCode,
            "ShortCut": $scope.CPTBillDetailObj.ShortCut,
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "ActiveInd": $scope.CPTBillDetailObj.ActiveInd,
            "SpecializationId": $scope.SpecializationId,
            "ProcedureNotes": $scope.CPTBillDetailObj.Description,
            "Statement": $scope.CPTBillDetailObj.Statement,
            "Modifier1": $scope.CPTBillDetailObj.Modifier1,
            "Modifier2": $scope.CPTBillDetailObj.Modifier2,
            "Modifier3": $scope.CPTBillDetailObj.Modifier3,
            "Modifier4": $scope.CPTBillDetailObj.Modifier4,
            "ProcedureTypeId":1,
            "ProcedureGeneralCost": parseInt($scope.CPTBillDetailObj.ProcedureGeneralCost) || 0,
        //    "MedicareExpected": $scope.CPTBillDetailObj.MedicareExpected,
           // "MedicarePublished": $scope.CPTBillDetailObj.MedicarePublished,
            "ParentHospitalId": parentHospitalId,
            "AllHospitalsIndicator": 0,
            "ProcedureCategoryId": $scope.CPTBillDetailObj.ProcedureCategoryId,
            "SpecializationId": $scope.CPTBillDetailObj.SpecializationId || $scope.SpecializationId,
            "InternalRVU": $scope.CPTBillDetailObj.InternalRVU ? parseInt($scope.CPTBillDetailObj.InternalRVU):null,
            "StandardCost": $scope.CPTBillDetailObj.StandardCost ? parseInt($scope.CPTBillDetailObj.StandardCost) : null,
            "StandardUnits": $scope.CPTBillDetailObj.StandardUnits ? parseFloat($scope.CPTBillDetailObj.StandardUnits) : null,
            "HCPCSCode": $scope.CPTBillDetailObj.HCPCSCode,
            "RVSCode": $scope.CPTBillDetailObj.RVSCode,
            "RVSFee": $scope.CPTBillDetailObj.RVSFee ? parseInt($scope.CPTBillDetailObj.RVSFee) : null,
            "RVSUnits": $scope.CPTBillDetailObj.RVSUnits ? parseFloat($scope.CPTBillDetailObj.RVSUnits) : null,
            "UBRevenueCode": $scope.CPTBillDetailObj.UBRevenueCode,
            "ServiceTypeId": $scope.CPTBillDetailObj.ServiceTypeId,
            "CopayRelated": $scope.CPTBillDetailObj.CopayRelated,
            "POSId": $scope.CPTBillDetailObj.POSId,
            "TOSId": $scope.CPTBillDetailObj.TOSId,
            "CoinsurancePercent": $scope.CPTBillDetailObj.CoinsurancePercent ? parseFloat($scope.CPTBillDetailObj.CoinsurancePercent):null,
            "AuthorizationRequired": $scope.CPTBillDetailObj.AuthorizationRequired,
            "DocumentationRequired": $scope.CPTBillDetailObj.DocumentationRequired,
            "ShortList": $scope.CPTBillDetailObj.ShortList,
            "NDCNumber": $scope.CPTBillDetailObj.NDCNumber,
            "DrugQuantity": $scope.CPTBillDetailObj.DrugQuantity,
            "Inventory": $scope.CPTBillDetailObj.Inventory,
            "OnHand": $scope.CPTBillDetailObj.OnHand ? parseInt($scope.CPTBillDetailObj.OnHand):null,
            "ReorderPoint": $scope.CPTBillDetailObj.ReorderPoint ? parseInt($scope.CPTBillDetailObj.ReorderPoint) : null,
            "PurchasedService": $scope.CPTBillDetailObj.PurchasedService,
            "ValidGender": $scope.CPTBillDetailObj.ValidGender,
            "EMCode": $scope.CPTBillDetailObj.EMCode,
            "RecallTypeId": $scope.CPTBillDetailObj.RecallTypeId,
            "RecallInterval": $scope.CPTBillDetailObj.RecallInterval ? parseInt($scope.CPTBillDetailObj.RecallInterval) : null,
            "Emergency": $scope.CPTBillDetailObj.Emergency,
            "COB": $scope.CPTBillDetailObj.COB,
            "EPSTD": $scope.CPTBillDetailObj.EPSTD,
            "CodingSymbolId": $scope.CPTBillDetailObj.CodingSymbolId,
            "PostOpDays": $scope.CPTBillDetailObj.PostOpDays ? parseInt($scope.CPTBillDetailObj.PostOpDays) : null,
            "ProcedureTypeNewId": $scope.CPTBillDetailObj.ProcedureTypeNewId,
            "TaxableService": $scope.CPTBillDetailObj.TaxableService
        };

        //if ($scope.CPTBillDetailObj.ProcedureId == 0) {
        //    if ($scope.MasterDiagnosisICD10Array.length > 0) {

        //        if (angular.isObject($scope.CPTBillDetailObj.ProcedureCode)) {
        //            var List = $filter("filter")($scope.MasterCPTBillDetailList, { "CPTCode": $scope.CPTBillDetailObj.ProcedureCode.ProcedureCode }, true);
        //        }
        //        else {
        //            var List = $filter("filter")($scope.MasterCPTBillDetailList, { "CPTCode": $scope.CPTBillDetailObj.ProcedureCode }, true);
        //        }

        //        if (List.length > 0) {
        //            alertify.error('CPT  is already exists');
        //            return;
        //        }
        //    }
        //}

        eHnoteSettingsDataService.addUpdateMasterCPTBillDetails(object).success(function (response) {

            if ($scope.CPTBillDetailObj.ActiveInd === 'N') {
                alertify.success("CPT BillDetail Deleted Successfully");
                $scope.ClearCPTBillDetail();
                getMasterCPTBillDetail();

            } else {
                if (response.status === 'Success') {
                    if ($scope.CPTBillDetailObj.ProcedureId === undefined || $scope.CPTBillDetailObj.ProcedureId === 0) {
                        alertify.success("CPT BillDetail Added Successfully");
                    } else {
                        alertify.success("CPT BillDetail Updated Successfully");
                    }
                    
                    if (type === 'Save') {
                        $scope.ClearCPTBillDetail();
                        getMasterCPTBillDetail();
                    }
                    if (type === 'Continue' && screen==='Detail') {
                        var item = response.ProcedureList[0];
                        $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());
                        $scope.CPTBillDetailObj.ProcedureId = item.ProcedureId;
                        $scope.CPTBillDetailObj.ProcedureName = item.ProcedureName;
                        $scope.CPTBillDetailObj.ProcedureCode = item.ProcedureCode;
                        $scope.CPTBillDetailObj.Description = item.ProcedureNotes;
                        $scope.CPTBillDetailObj.Modifier1 = item.Modifier1 ? parseInt(item.Modifier1):"" ;
                        $scope.CPTBillDetailObj.Modifier2 = item.Modifier2 ? parseInt(item.Modifier2) : "";
                        $scope.CPTBillDetailObj.Modifier3 = item.Modifier3 ? parseInt(item.Modifier3) : "";
                        $scope.CPTBillDetailObj.Modifier4 = item.Modifier4 ? parseInt(item.Modifier4) : "";
                        

                        $scope.BillingCodeSubTabActive = 5;

                        getMasterProcedureCategory();
                        getServiceType();

                        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
                        function onspecsuccess(data) {
                            $scope.specialitylist = data;
                        }

                        function onspecfailure(data) {
                        }

                    }

                }

                if (response.status === 'Failure') {
                     alertify.error("CPT BillDetail  already exist");
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    }


    $scope.editCPTBillDetailItem = function (item, index) {
        $scope.showAddCPTBillDetailDiv = true;
        $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());
        $scope.CPTBillDetailObj.ProcedureId = item.ProcedureId;
        $scope.CPTBillDetailObj.ProcedureName = item.ProcedureName;
        $scope.CPTBillDetailObj.Description = item.ProcedureNotes;
        $scope.CPTBillDetailObj.ProcedureCode = item.ProcedureCode;
        $scope.CPTBillDetailObj.ProcedureGeneralCost = item.ProcedureGeneralCost;
        $scope.CPTBillDetailObj.OrgProcedureId = item.OrgProcedureId;
        $scope.CPTBillDetailObj.Modifier1 = item.Modifier1 || "";
        $scope.CPTBillDetailObj.Modifier2 = item.Modifier2 || "";
        $scope.CPTBillDetailObj.Modifier3 = item.Modifier3 || "";
        $scope.CPTBillDetailObj.Modifier4 = item.Modifier4 || "";
        if ($scope.CPTBillDetailObj.Modifier1 !== "") {
            $scope.CPTBillDetailObj.Modifier1 = parseInt($scope.CPTBillDetailObj.Modifier1);
            $scope.CPTBillDetailObj.Modifier1Obj = $filter("filter")($scope.ModifierList1, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier1 })[0];
        }
        if ($scope.CPTBillDetailObj.Modifier2 !== "") {
            $scope.CPTBillDetailObj.Modifier2 = parseInt($scope.CPTBillDetailObj.Modifier2);
            $scope.CPTBillDetailObj.Modifier2Obj = $filter("filter")($scope.ModifierList2, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier2 })[0];
        }
        if ($scope.CPTBillDetailObj.Modifier3 !== "") {
            $scope.CPTBillDetailObj.Modifier3 = parseInt($scope.CPTBillDetailObj.Modifier3);
            $scope.CPTBillDetailObj.Modifier3Obj = $filter("filter")($scope.ModifierList3, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier3 })[0];
        }
        if ($scope.CPTBillDetailObj.Modifier4 !== "") {
            $scope.CPTBillDetailObj.Modifier4 = parseInt($scope.CPTBillDetailObj.Modifier4);
            $scope.CPTBillDetailObj.Modifier4Obj = $filter("filter")($scope.ModifierList4, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier4 })[0];
        }
        $scope.CPTBillDetailObj.ActiveInd = "Y";
        $scope.CPTBillDetailObj.AuthorizationRequired = item.AuthorizationRequired || "N";
        $scope.CPTBillDetailObj.DocumentationRequired = item.DocumentationRequired || "N";
        $scope.CPTBillDetailObj.CoinsurancePercent = item.CoinsurancePercent || "";
        
        $scope.CPTBillDetailObj.Inventory = item.Inventory || "N";
        $scope.CPTBillDetailObj.DrugQuantity = item.DrugQuantity || "";
        $scope.CPTBillDetailObj.NDCNumber = item.NDCNumber || "";
        $scope.CPTBillDetailObj.ShortList = item.ShortList || "N";
        $scope.CPTBillDetailObj.POSId = item.POSId || "";
        $scope.CPTBillDetailObj.TOSId = item.TOSId || "";
        if ($scope.CPTBillDetailObj.POSId !== "") {
            $scope.CPTBillDetailObj.POSId = parseInt($scope.CPTBillDetailObj.POSId);
            $scope.CPTBillDetailObj.POSObj = $filter("filter")($scope.POSCodeList, { "POSId": $scope.CPTBillDetailObj.POSId })[0];
        }
        if ($scope.CPTBillDetailObj.TOSId !== "") {
            $scope.CPTBillDetailObj.TOSId = parseInt($scope.CPTBillDetailObj.TOSId);
            $scope.CPTBillDetailObj.TOSObj = $filter("filter")($scope.TOSCodeList, { "TOSId": $scope.CPTBillDetailObj.TOSId })[0];
        }
        $scope.CPTBillDetailObj.ValidGender = item.ValidGender || "N";
        $scope.CPTBillDetailObj.ReorderPoint = item.ReorderPoint || "";
        $scope.CPTBillDetailObj.OnHand = item.OnHand || "";
        $scope.CPTBillDetailObj.PurchasedService = item.PurchasedService || "N";
        $scope.CPTBillDetailObj.EMCode = item.EANDMCODE || "N";
        $scope.CPTBillDetailObj.TaxableService = item.TaxableService || "N";
        $scope.CPTBillDetailObj.ProcedureCategoryId = item.ProcedureCategoryId || "";
        if ($scope.CPTBillDetailObj.ProcedureCategoryId !== "") {
            $scope.CPTBillDetailObj.ProcedureCategoryId = parseInt($scope.CPTBillDetailObj.ProcedureCategoryId);
            $scope.CPTBillDetailObj.ProcedureCategoryObj = $filter("filter")($scope.ProcedureCategoryList, { "ProcCatId": $scope.CPTBillDetailObj.ProcedureCategoryId })[0];
        }
        $scope.CPTBillDetailObj.ServiceTypeId = item.ServiceTypeId || "";
        $scope.CPTBillDetailObj.SpecializationId = item.SpecializationId || "";
        $scope.CPTBillDetailObj.RecallTypeId = item.RecallTypeId || "";
        if ($scope.CPTBillDetailObj.RecallTypeId !== "") {
            $scope.CPTBillDetailObj.RecallTypeId = parseInt($scope.CPTBillDetailObj.RecallTypeId);
            $scope.CPTBillDetailObj.RecallTypeObj = $filter("filter")($scope.RecallTypes, { "DropdownId": $scope.CPTBillDetailObj.RecallTypeId })[0];
        }

        if ($scope.CPTBillDetailObj.ServiceTypeId !== "") {
            $scope.CPTBillDetailObj.ServiceTypeId = parseInt($scope.CPTBillDetailObj.ServiceTypeId);
            $scope.CPTBillDetailObj.ServiceTypeObj = $filter("filter")($scope.ServiceTypes, { "DropdownId": $scope.CPTBillDetailObj.ServiceTypeId })[0];
        }
        if ($scope.CPTBillDetailObj.SpecializationId !== "") {
            $scope.CPTBillDetailObj.SpecializationId = parseInt($scope.CPTBillDetailObj.SpecializationId);
            $scope.CPTBillDetailObj.SpecialityObj = $filter("filter")($scope.specialitylist, { "Id": $scope.CPTBillDetailObj.SpecializationId })[0];
        }
        $scope.CPTBillDetailObj.RecallInterval = item.RecallInterval;
        $scope.CPTBillDetailObj.Emergency = item.Emergency || "N";
        $scope.CPTBillDetailObj.COB = item.COB || "N";
        $scope.CPTBillDetailObj.EPSTD = item.EPSTD || "N";
        $scope.CPTBillDetailObj.PostOpDays = item.PostOpDays;
        $scope.CPTBillDetailObj.CodingSymbolId = item.CodingSymbolId || "";
        if ($scope.CPTBillDetailObj.CodingSymbolId !== "") {
            $scope.CPTBillDetailObj.CodingSymbolId = parseInt($scope.CPTBillDetailObj.CodingSymbolId);
            $scope.CPTBillDetailObj.CodingSymbolObj = $filter("filter")($scope.CodingSymbolList, { "DropdownId": $scope.CPTBillDetailObj.CodingSymbolId })[0];
        }
        $scope.CPTBillDetailObj.ProcedureTypeNewId = item.ProcedureTypeNewId || "";
              
        if ($scope.CPTBillDetailObj.ProcedureTypeNewId !== "") {
            $scope.CPTBillDetailObj.ProcedureTypeNewId = parseInt($scope.CPTBillDetailObj.ProcedureTypeNewId);
            $scope.CPTBillDetailObj.ProcedureTypeobj = $filter("filter")($scope.ProcedureTypes, { "DropdownId": $scope.CPTBillDetailObj.ProcedureTypeNewId })[0];
        }
        $scope.masterCPTBillDetailBtnName = "Update";
    };


    $scope.deleteCPTBillDetailItem = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this CPT Detail? </h4>", function () {

            $scope.CPTBillDetailObj.ProcedureId = item.ProcedureId;
            $scope.CPTBillDetailObj.ProcedureName = item.ProcedureName;
            $scope.CPTBillDetailObj.Description = item.ProcedureNotes;
            $scope.CPTBillDetailObj.ProcedureCode = item.ProcedureCode;
            $scope.CPTBillDetailObj.ProcedureGeneralCost = item.ProcedureGeneralCost;
            $scope.CPTBillDetailObj.Modifier1 = item.Modifier1 || "";
            $scope.CPTBillDetailObj.Modifier2 = item.Modifier2 || "";
            $scope.CPTBillDetailObj.Modifier3 = item.Modifier3 || "";
            $scope.CPTBillDetailObj.Modifier4 = item.Modifier4 || "";
            if ($scope.CPTBillDetailObj.Modifier1 !== "") {
                $scope.CPTBillDetailObj.Modifier1 = parseInt($scope.CPTBillDetailObj.Modifier1);
                $scope.CPTBillDetailObj.Modifier1Obj = $filter("filter")($scope.ModifierList1, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier1 })[0];
            }
            if ($scope.CPTBillDetailObj.Modifier2 !== "") {
                $scope.CPTBillDetailObj.Modifier2 = parseInt($scope.CPTBillDetailObj.Modifier2);
                $scope.CPTBillDetailObj.Modifier2Obj = $filter("filter")($scope.ModifierList2, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier2 })[0];
            }
            if ($scope.CPTBillDetailObj.Modifier3 !== "") {
                $scope.CPTBillDetailObj.Modifier3 = parseInt($scope.CPTBillDetailObj.Modifier3);
                $scope.CPTBillDetailObj.Modifier3Obj = $filter("filter")($scope.ModifierList3, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier3 })[0];
            }
            if ($scope.CPTBillDetailObj.Modifier4 !== "") {
                $scope.CPTBillDetailObj.Modifier4 = parseInt($scope.CPTBillDetailObj.Modifier4);
                $scope.CPTBillDetailObj.Modifier4Obj = $filter("filter")($scope.ModifierList4, { "MODIFIERID": $scope.CPTBillDetailObj.Modifier4 })[0];
            }
            $scope.CPTBillDetailObj.ActiveInd = 'N';
            $scope.AddUpdateCPTBillDetail();
        }, function () {
            r = "You pressed Cancel!";
        });
    };


    $scope.ChangeModifier1 = function (item) {
        item.Modifier1Obj = item.Modifier1Obj || "";
        if (item.Modifier1Obj!= "") {
            item.Modifier1 = item.Modifier1Obj.MODIFIERID;
        }
    };
    $scope.ChangeModifier2 = function (item) {
        item.Modifier2Obj = item.Modifier2Obj || "";
        if (item.Modifier2Obj != "") {
            item.Modifier2 = item.Modifier2Obj.MODIFIERID;
        }
    };
    $scope.ChangeModifier3 = function (item) {
        item.Modifier3Obj = item.Modifier3Obj || "";
        if (item.Modifier3Obj != "") {
            item.Modifier3 = item.Modifier3Obj.MODIFIERID;
        }
    };
    $scope.ChangeModifier4 = function (item) {
        item.Modifier4Obj = item.Modifier4Obj || "";
        if (item.Modifier4Obj != "") {
            item.Modifier4 = item.Modifier4Obj.MODIFIERID;
        }
    };
    $scope.ChangeSearchModifier1 = function (item) {
        item.SearchModifier1Obj = item.SearchModifier1Obj || "";
        if (item.SearchModifier1Obj != "") {
            item.SearchModifier1 = item.SearchModifier1Obj.MODIFIERID;
        }
        else {
            item.SearchModifier1 = "";
        }
    };
    $scope.ChangeProcedureCategory = function (item) {
        item.ProcedureCategoryObj = item.ProcedureCategoryObj || "";
        if (item.ProcedureCategoryObj != "") {
            item.ProcedureCategoryId = item.ProcedureCategoryObj.ProcCatId;
        }
    };
    $scope.ChangeServiceType = function (item) {
        item.ServiceTypeObj = item.ServiceTypeObj || "";
        if (item.ServiceTypeObj != "") {
            item.ServiceTypeId = item.ServiceTypeObj.DropdownId;
        }
    };
    $scope.ChangeSpeciality = function (item) {
        item.SpecialityObj = item.SpecialityObj || "";
        if (item.SpecialityObj != "") {
            item.SpecializationId = item.SpecialityObj.Id;
        }
    };
    $scope.ChangePOSStatus = function (item) {
        item.POSObj = item.POSObj || "";
        if (item.POSObj != "") {
            item.POSId = item.POSObj.POSId;
        }
    };
    $scope.ChangeTOSStatus = function (item) {
        item.TOSObj = item.TOSObj || "";
        if (item.TOSObj != "") {
            item.TOSId = item.TOSObj.TOSId;
        }
    };
    $scope.ChangeRecallType = function (item) {
        item.RecallTypeObj = item.RecallTypeObj || "";
        if (item.RecallTypeObj != "") {
            item.RecallTypeId = item.RecallTypeObj.DropdownId;
        }
    };

    $scope.ChangeCodingSymbol = function (item) {
        item.CodingSymbolObj = item.CodingSymbolObj || "";
        if (item.CodingSymbolObj != "") {
            item.CodingSymbolId = item.CodingSymbolObj.DropdownId;
        }
    };

    $scope.ChangeProcedureType = function (item) {
        item.ProcedureTypeobj = item.ProcedureTypeobj || "";
        if (item.ProcedureTypeobj != "") {
            item.ProcedureTypeNewId = item.ProcedureTypeobj.DropdownId;
        }
    };
    $scope.ChangeValidationInsurancePlan = function (item) {
        item.InsurancePlanObj = item.InsurancePlanObj || "";
        if (item.InsurancePlanObj != "") {
            item.InsurancePlanId = item.InsurancePlanObj.InsurancePlanId;
        }
    };
    $scope.ChangeValidationSpecality = function (item) {
        item.SpecialityObj = item.SpecialityObj || "";
        if (item.SpecialityObj != "") {
            item.SpecializationId = item.SpecialityObj.Id;
        }
    };
    $scope.ChangeSearchValidationSpecality = function (item) {
        item.SearchSpecialityObj = item.SearchSpecialityObj || "";
        if (item.SearchSpecialityObj != "") {
            item.SearchSpecializationId = item.SearchSpecialityObj.Id;
        }
    };

    $scope.MasterCPTBillDetailpageChanged = function (pageno) {

        $scope.CPTBillDetailObj.PageNumber = pageno;
        getMasterCPTBillDetail();
    };

    $scope.GetDiagnosisICD9List = function (val,type) {
        val = val || "";
        object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SearchText": val,
            "PageSize": 10,
            "PageNumber":1,
            "Type": type
        };

        return eHnoteSettingsDataService.GetMasterDiagnosisCodes(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.DiagnosisList!= undefined) {

                    return response.data.DiagnosisList.map(function (kitem) {
                        return kitem;
                    });
                } 
            }
           
        });
      

    };
    $scope.DiagnosisBlurChange = function (SelectedDiagnosis) {
        //if (type = 'ICD9') {
            $scope.CPTValidationObj.SelectedICD10Obj = SelectedDiagnosis.ICD10CODE;
            $scope.CPTValidationObj.SelectedICD9Obj = SelectedDiagnosis.ICD9CODE;
            $scope.CPTValidationObj.DiagnosisId = SelectedDiagnosis.DiagnosisId;
        //}
       
    };

    $scope.SearchCPTValidation = function () {
        var object = {
 
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.CPTValidationObj.SearchSpecializationId || $scope.SpecializationId,
            "SearchText": $scope.CPTValidationObj.SearchText || "",
            "PageSize": $scope.CPTValidationObj.PageSize,
            "PageNumber": 1,
            "SearchICD9Code": $scope.CPTValidationObj.SearchICD9Code || "",
            "SearchICD10Code": $scope.CPTValidationObj.SearchICD10Code || ""
        
        };

        eHnoteSettingsDataService.GetCPTValidations(object).success(function (response) {
            $scope.CPTValidationArray = [];
            if (response.count >0) {
                    $scope.CPTValidationArray = response.rows;

                $scope.masterCPTValidationItems = response.count;
               
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    
    $scope.CptValidationpageChanged = function (pageno) {

        $scope.CPTValidationObj.PageNumber = pageno;
        getCPTValidationItems();

    };

    $scope.CptValidationClick = function () {
        $scope.masterCPTValidationBtnName = "Add";
        $scope.CPTValidationObj = angular.copy($scope.getCPTValidationObj());
    };

    $scope.AddUpdateCptValidation = function () {

        var object = {
            "ProcedureValidationId": $scope.CPTValidationObj.ProcedureValidationId,
            "ProcedureId": $scope.CPTValidationObj.ProcedureId,
            "DiagnosisId": $scope.CPTValidationObj.DiagnosisId,
            //"DiagnosisId": 60841,
            "Gender": $scope.CPTValidationObj.Gender,
            "InsurancePlanId": $scope.CPTValidationObj.InsurancePlanId,
            "SpecializationId": $scope.CPTValidationObj.SpecializationId,
            "Age": $scope.CPTValidationObj.Age ? parseInt($scope.CPTValidationObj.Age): null,
            "Allow": $scope.CPTValidationObj.Allow,
            "PARNOPAR": $scope.CPTValidationObj.Parnopar,
            "INCLUDEEXCLUDE": $scope.CPTValidationObj.IncludeExclude,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "DeleteInd": $scope.CPTValidationObj.DeleteInd,
            "HospitalId": hospid
        };

        

        eHnoteSettingsDataService.addUpdateCPTValidations(object).success(function (response) {

            if ($scope.CPTValidationObj.DeleteInd === 'Y') {
                alertify.success("Validation Deleted Successfully");
               $scope.CptValidationClick();
                getCPTValidationItems();

            } else {
                if (response.status === 'Success') {
                    if ($scope.CPTValidationObj.ProcedureValidationId === undefined || $scope.CPTValidationObj.ProcedureValidationId === 0) {
                        alertify.success("Validation Added Successfully");
                    } else {
                        alertify.success("Validation Updated Successfully");
                    }
                    $scope.CptValidationClick();
                    getCPTValidationItems();

                }

                if (response.status === 'Failure') {
                    if (response.Message === 'Validation Already exists') {
                        alertify.error("Validation Name already exist");
                        //$scope.DiagnosisObj.DiagnosisName = "";
                    }
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    };

    $scope.editCptValidationItem = function (item, index) {
       // $scope.showModifyMasterDiagDiv = true;
        $scope.CPTValidationObj = angular.copy($scope.getCPTValidationObj());
        $scope.CPTValidationObj.ProcedureValidationId = item.ProcedueValidationId;
        $scope.CPTValidationObj.ProcedureId = item.ProcedureId;
        $scope.CPTValidationObj.ProcedureCode = item.ProcCode;
        $scope.CPTValidationObj.InsurancePlanId = item.InsurancePlanId;
        if ($scope.CPTValidationObj.InsurancePlanId !== "") {
            $scope.CPTValidationObj.InsurancePlanObj = $filter("filter")($scope.InsurancePlanList, { "InsurancePlanId": $scope.CPTValidationObj.InsurancePlanId })[0];
        }
        $scope.CPTValidationObj.SpecializationId = item.SpecializationId;
        if ($scope.CPTValidationObj.SpecializationId !== "") {
            $scope.CPTValidationObj.SpecialityObj = $filter("filter")($scope.specialitylist, { "Id": $scope.CPTValidationObj.SpecializationId })[0];
        }
        $scope.CPTValidationObj.DiagnosisId = item.DiagnosisId;
        $scope.CPTValidationObj.Age = item.AGE;
        $scope.CPTValidationObj.Gender = item.GENDER;
        $scope.CPTValidationObj.Allow = item.ALLOW;
        $scope.CPTValidationObj.Parnopar = item.Parnopar || "";
        $scope.CPTValidationObj.IncludeExclude = item.INCLUDEEXCLUDE;
        $scope.CPTValidationObj.SelectedICD9Obj = item.ICD9CODE;
        $scope.CPTValidationObj.SelectedICD10Obj = item.ICD10CODE;
        $scope.CPTValidationObj.DeleteInd = "N";
        $scope.masterCPTValidationBtnName = "Update";
    };


    $scope.deleteCptValidationItem = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Validation? </h4>", function () {

            $scope.CPTValidationObj.ProcedureValidationId = item.ProcedueValidationId;
            $scope.CPTValidationObj.ProcedureId = item.ProcedureId;
            $scope.CPTValidationObj.ProcedureCode = item.ProcCode;
            $scope.CPTValidationObj.InsurancePlanId = item.InsurancePlanId;
            $scope.CPTValidationObj.SpecializationId = item.SpecializationId;
            $scope.CPTValidationObj.DiagnosisId = item.DiagnosisId;
            $scope.CPTValidationObj.Age = item.AGE;
            $scope.CPTValidationObj.Gender = item.GENDER;
            $scope.CPTValidationObj.Allow = item.ALLOW;
            $scope.CPTValidationObj.Parnopar = item.Parnopar || "";
            $scope.CPTValidationObj.IncludeExclude = item.INCLUDEEXCLUDE;
            $scope.CPTValidationObj.DeleteInd = 'Y';
            $scope.AddUpdateCptValidation();
        }, function () {
            r = "You pressed Cancel!";
        });
    };



      ///   Feecodestart

    $scope.getFeeCodesDetailObj = function () {

        var obj = {
            "ProcedureFeeId": 0,
            "ProcedureId": 0,
            "MODIFIERKEY1": 0,
            "MODIFIERKEY2": 0,
            "MODIFIERKEY3": 0,
            "MODIFIERKEY4": 0,
            "ALTERNATEProcedureId": 0,
            "WRITEOFFId": 0,
            "InsurancePlanId": 0,
            "METHOD": "",
            "CHARGE": null,
            "ALLOWED": null,
            "ALLOWEDPERCENT": 0,
            "WRITEOFFINDICATOR": "N",
            "CoverId": "",
            "CAPITATED": "N",
            "DOCUMENTATIONREQUIRED": "N",
            "COMMENTS": "",
            "InsuranceEstimate": null,
            "PatientEstimate": null,
            "TAXABLEPERCENT": null,
            "DISPLAYHINT": "",
            "DISPLAYHINTTYPE": "",
            "AUTHORIZATIONREQUIRED": "",
            "COPAYMENT": null,
            "COPAYRELATED": null,
            "POSTOPDAYS": null,
            "COINSURANCEPERCENT": null,
            "POSTOPVISITS": 0,
            "REFERRALREQUIRED": 'N',
            "EFFECTIVEDATE": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "EXPIRYDATE": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "ALTERNATECODE": "",
            "ALTERNATECODE2": "",
            "INTERNALRVU": "",
            "RVSCODE": "",
            "RVSFEE": null,
            "RVSUNITS": 'N',
            "REFERRINGDOCTORREQD": null,
            "PREAUTHORIZATIONREQUIRED": null,
            "ALLOWEDYESNO": null,
            "PAPERONLY": "N",
            "NOTCOVERED": "N",
            "UserId": 0,
            "POSKEY": 0,
            "TOSKEY": 0,
            "POSObj": "",
            "TOSObj": "",
            "DeleteInd": "N",
            "ProcedureCategoryObj": "Select",
            "InsurancePlanTypeObj": "",
            "Modifier1Obj": "",
            "Modifier2Obj": "",
            "Modifier3Obj": "",
            "Modifier4Obj": "",
            "WriteoffObj": "",
        };
        return obj;
    };
    $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
    $scope.ClearFeeCodesDetail = function () {
        $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
        $scope.masterFeeCodeBtnName = 'Add';
    }

    $scope.ChangeFeePOSStatus = function (item) {
        item.POSObj = item.POSObj || "";
        if (item.POSObj != "") {
            item.POSKEY = item.POSObj.POSId;
        }
    };
   
    $scope.ChangeFeeTOSStatus = function (item) {
        item.TOSObj = item.TOSObj || "";
        if (item.TOSObj != "") {
            item.TOSKEY = item.TOSObj.TOSId;
        }
    };
   
    $scope.ChangeFeeProcedureCategory = function (item) {
        item.ProcedureCategoryObj = item.ProcedureCategoryObj || "";
        if (item.ProcedureCategoryObj != "") {
            item.ProcedureId = item.ProcedureCategoryObj.ProcCatId;
        }
    };

   
    $scope.ChangeFeeInsurancePlan = function (item) {
        item.InsurancePlanTypeObj = item.InsurancePlanTypeObj || "";
        if (item.InsurancePlanTypeObj != "") {
            item.InsurancePlanId = item.InsurancePlanTypeObj.InsurancePlanId;
        }
    };
   

    $scope.AddUpdateProcedureFees = function (type, screen) {

        if ($scope.FeeCodesDetailObj.ProcedureId === 0) {
            alertify.error("Please select CPT Procedure");
            return false;
        }
        var object = {
            "ProcedureFeeId": $scope.FeeCodesDetailObj.ProcedureFeeId ||0,
            "ProcedureId": $scope.FeeCodesDetailObj.ProcedureId,
            "MODIFIERKEY1": $scope.FeeCodesDetailObj.MODIFIERKEY1,
            "MODIFIERKEY2": $scope.FeeCodesDetailObj.MODIFIERKEY2,
            "MODIFIERKEY3": $scope.FeeCodesDetailObj.MODIFIERKEY3,
            "MODIFIERKEY4": $scope.FeeCodesDetailObj.MODIFIERKEY4,
            "ALTERNATEProcedureId": $scope.FeeCodesDetailObj.ALTERNATEProcedureId,
            "WRITEOFFId": $scope.FeeCodesDetailObj.WRITEOFFId,
            "InsurancePlanId": $scope.FeeCodesDetailObj.InsurancePlanId,
            "METHOD": $scope.FeeCodesDetailObj.METHOD,
            "CHARGE": $scope.FeeCodesDetailObj.CHARGE,
            "ALLOWED": $scope.FeeCodesDetailObj.ALLOWED,
            "ALLOWEDPERCENT": $scope.FeeCodesDetailObj.ALLOWEDPERCENT,
            "WRITEOFFINDICATOR": $scope.FeeCodesDetailObj.WRITEOFFINDICATOR,
            "CoverId": $scope.FeeCodesDetailObj.CoverId,
            "CAPITATED": $scope.FeeCodesDetailObj.CAPITATED,
            "DOCUMENTATIONREQUIRED": $scope.FeeCodesDetailObj.DOCUMENTATIONREQUIRED,
            "COMMENTS": $scope.FeeCodesDetailObj.COMMENTS,
            "InsuranceEstimate": $scope.FeeCodesDetailObj.InsuranceEstimate,
            "PatientEstimate": $scope.FeeCodesDetailObj.PatientEstimate,
            "TAXABLEPERCENT": $scope.FeeCodesDetailObj.TAXABLEPERCENT,
            "DISPLAYHINT": $scope.FeeCodesDetailObj.DISPLAYHINT,
            "DISPLAYHINTTYPE": $scope.FeeCodesDetailObj.DISPLAYHINTTYPE,
            "AUTHORIZATIONREQUIRED": $scope.FeeCodesDetailObj.AUTHORIZATIONREQUIRED,
            "COPAYMENT": $scope.FeeCodesDetailObj.COPAYMENT,
            "COPAYRELATED": $scope.FeeCodesDetailObj.COPAYRELATED,
            "POSTOPDAYS": $scope.FeeCodesDetailObj.POSTOPDAYS,
            "COINSURANCEPERCENT": $scope.FeeCodesDetailObj.COINSURANCEPERCENT,
            "POSTOPVISITS": $scope.FeeCodesDetailObj.POSTOPVISITS,
            "REFERRALREQUIRED": $scope.FeeCodesDetailObj.REFERRALREQUIRED,
            "EFFECTIVEDATE": $scope.FeeCodesDetailObj.EFFECTIVEDATE,
            "EXPIRYDATE": $scope.FeeCodesDetailObj.EXPIRYDATE,
            "ALTERNATECODE": $scope.FeeCodesDetailObj.ALTERNATECODE,
            "ALTERNATECODE2": $scope.FeeCodesDetailObj.ALTERNATECODE2,
            "INTERNALRVU": $scope.FeeCodesDetailObj.INTERNALRVU,
            "RVSCODE": $scope.FeeCodesDetailObj.RVSCODE,
            "RVSFEE": $scope.FeeCodesDetailObj.RVSFEE,
            "RVSUNITS": $scope.FeeCodesDetailObj.RVSUNITS,
            "REFERRINGDOCTORREQD": $scope.FeeCodesDetailObj.REFERRINGDOCTORREQD,
            "PREAUTHORIZATIONREQUIRED": $scope.FeeCodesDetailObj.PREAUTHORIZATIONREQUIRED,
            "ALLOWEDYESNO": $scope.FeeCodesDetailObj.ALLOWEDYESNO,
            "PAPERONLY": $scope.FeeCodesDetailObj.PAPERONLY,
            "NOTCOVERED": $scope.FeeCodesDetailObj.NOTCOVERED,
            "HospitalId": hospid,
            "UserId": $scope.UserId,           
            "SpecializationId": $scope.SpecializationId,
            "POSKEY": $scope.FeeCodesDetailObj.POSKEY,
            "TOSKEY": $scope.FeeCodesDetailObj.TOSKEY,         
            "DeleteInd": "N",
           
        };
        eHnoteSettingsDataService.AddUpdateProcedureFees(object).success(function (response) {
            if (response.status === 'Success') {
                if (type === 'Save') {
                    $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
                    GetMasterProcedureFees();
                }

                if (type === 'Continue' && screen === 'Detail') {
                    var item = response.rows[0];
                    $scope.FeeCodesDetailObj.ProcedureFeeId = item.ProcedureFeeId
                    $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
                    $scope.FeeCodesDetailObj.InsurancePlanId = item.InsurancePlanId;
                    $scope.FeeCodesDetailObj.CHARGE = item.CHARGE;
                    $scope.FeeCodesDetailObj.COPAYMENT = item.COPAYMENT;
                    $scope.FeeCodesDetailObj.COINSURANCEPERCENT = item.COINSURANCEPERCENT;
                    $scope.FeeCodesDetailObj.CAPITATED = item.CAPITATED || "";
                    $scope.FeeCodesDetailObj.REFERRALREQUIRED = item.REFERRALREQUIRED || "";
                    $scope.FeeCodesDetailObj.POSKEY = item.POSKEY || "";
                    $scope.FeeCodesDetailObj.TOSKEY = item.TOSKEY || "";
                    $scope.BillingCodeSubTabActive = 15;
                }
            }

            else {
                alertify.error(response.Message);
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    };


    $scope.FeeSearch= {
        "ProcedureId": 0,
        "InsurancePlanId": 0,
        "POSKEY": 0,
        "TOSKEY": 0,      
        "PageSize":10,
        "PageNumber": 1,
        "ProcedureObj": "Select",
        "POSObj": "",
        "TOSObj": "",

    }
    //$scope.SearchFeeProcedure = function (item) {
    //    item.ProcedureObj = item.ProcedureObj || "";
    //    if (item.ProcedureObj != "") {
    //        item.ProcedureId = item.ProcedureObj.ProcCatId;
    //    }
    //};

    $scope.SearchFeeProcedure = function (item) {
        if (item != "") {
            $scope.FeeSearch.ProcedureId = item.ProcedureId;
            $scope.FeeSearch.ProcedureObj = item.ProcedureCode;
        }
    };

    $scope.SearchMasterFeeProcedure = function (item) {
        if (item != "") {
            $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.ProcedureCode;
        }
    };

    $scope.SearchFeeInsurancePlan = function (item) {
        item.InsurancePlanObj = item.InsurancePlanObj || "";
        if (item.InsurancePlanObj != "") {
            item.InsurancePlanId = item.InsurancePlanObj.InsurancePlanId;
        }
    };

    $scope.SearchFeePOSStatus = function (item) {
        item.POSObj = item.POSObj || "";
        if (item.POSObj != "") {
            item.POSKEY = item.POSObj.POSId;
        }
    };
    $scope.SearchFeeTOSStatus = function (item) {
        item.TOSObj = item.TOSObj || "";
        if (item.TOSObj != "") {
            item.TOSKEY = item.TOSObj.TOSId;
        }
    };

    $scope.FeeCodesChanged = function (pageno) {
        $scope.FeeSearch.PageNumber = pageno;
        $scope.FeeCodeSearch();
    };

    $scope.FeeCodeSearch = function () {
        GetMasterProcedureFees();
    };

    function GetMasterProcedureFees() {
        $scope.FeeCodeArrayList = [];
        $scope.masterFeeCodeitemscount = 0;
        object = {
            "ProcedureId": $scope.FeeSearch.ProcedureId,
            "InsurancePlanId": $scope.FeeSearch.InsurancePlanId,
            "POSKEY": $scope.FeeSearch.POSKEY,
            "TOSKEY": $scope.FeeSearch.TOSKEY,
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,          
            "PageSize": $scope.FeeSearch.PageSize,
            "PageNumber": $scope.FeeSearch.PageNumber
        }

        eHnoteSettingsDataService.GetProcedureFees(object).success(function (response) {
            if (response.status === 'Success') {
                $scope.FeeCodeArrayList = response.rows || [];
                $scope.masterFeeCodeitemscount = response.count;
            }
        }).error(function (error) {
            console.log(error);
        });
    }


    $scope.CancelFeecodeDetail = function () {
        $scope.FeeSearch = {
            "ProcedureId": 0,
            "InsurancePlanId": 0,
            "POSKEY": 0,
            "TOSKEY": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "ProcedureObj": "",
            "POSObj": "",
            "TOSObj": "",

        }
        GetMasterProcedureFees();
    }

    $scope.DeleteFeecodeDetailItem = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this fee Detail? </h4>", function () {
            $scope.FeeCodesDetailObj.ProcedureFeeId = item.ProcedureFeeId
            $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
            $scope.FeeCodesDetailObj.InsurancePlanId = item.InsurancePlanId;
            $scope.FeeCodesDetailObj.CHARGE = item.CHARGE;
            $scope.FeeCodesDetailObj.COPAYMENT = item.COPAYMENT;
            $scope.FeeCodesDetailObj.COINSURANCEPERCENT = item.COINSURANCEPERCENT;
            $scope.FeeCodesDetailObj.CAPITATED = item.CAPITATED || "";
            $scope.FeeCodesDetailObj.REFERRALREQUIRED = item.REFERRALREQUIRED || "";
            $scope.FeeCodesDetailObj.POSKEY = item.POSKEY || "";
            $scope.FeeCodesDetailObj.TOSKEY = item.TOSKEY || "";

            $scope.CPTBillDetailObj.DeleteInd = 'Y';
            var object = {
                "ProcedureFeeId": $scope.FeeCodesDetailObj.ProcedureFeeId || 0,
                "ProcedureId": $scope.FeeCodesDetailObj.ProcedureId,
                "MODIFIERKEY1": $scope.FeeCodesDetailObj.MODIFIERKEY1,
                "MODIFIERKEY2": $scope.FeeCodesDetailObj.MODIFIERKEY2,
                "MODIFIERKEY3": $scope.FeeCodesDetailObj.MODIFIERKEY3,
                "MODIFIERKEY4": $scope.FeeCodesDetailObj.MODIFIERKEY4,
                "ALTERNATEProcedureId": $scope.FeeCodesDetailObj.ALTERNATEProcedureId,
                "WRITEOFFId": $scope.FeeCodesDetailObj.WRITEOFFId,
                "InsurancePlanId": $scope.FeeCodesDetailObj.InsurancePlanId,
                "METHOD": $scope.FeeCodesDetailObj.METHOD,
                "CHARGE": $scope.FeeCodesDetailObj.CHARGE,
                "ALLOWED": $scope.FeeCodesDetailObj.ALLOWED,
                "ALLOWEDPERCENT": $scope.FeeCodesDetailObj.ALLOWEDPERCENT,
                "WRITEOFFINDICATOR": $scope.FeeCodesDetailObj.WRITEOFFINDICATOR,
                "CoverId": $scope.FeeCodesDetailObj.CoverId,
                "CAPITATED": $scope.FeeCodesDetailObj.CAPITATED,
                "DOCUMENTATIONREQUIRED": $scope.FeeCodesDetailObj.DOCUMENTATIONREQUIRED,
                "COMMENTS": $scope.FeeCodesDetailObj.COMMENTS,
                "InsuranceEstimate": $scope.FeeCodesDetailObj.InsuranceEstimate,
                "PatientEstimate": $scope.FeeCodesDetailObj.PatientEstimate,
                "TAXABLEPERCENT": $scope.FeeCodesDetailObj.TAXABLEPERCENT,
                "DISPLAYHINT": $scope.FeeCodesDetailObj.DISPLAYHINT,
                "DISPLAYHINTTYPE": $scope.FeeCodesDetailObj.DISPLAYHINTTYPE,
                "AUTHORIZATIONREQUIRED": $scope.FeeCodesDetailObj.AUTHORIZATIONREQUIRED,
                "COPAYMENT": $scope.FeeCodesDetailObj.COPAYMENT,
                "COPAYRELATED": $scope.FeeCodesDetailObj.COPAYRELATED,
                "POSTOPDAYS": $scope.FeeCodesDetailObj.POSTOPDAYS,
                "COINSURANCEPERCENT": $scope.FeeCodesDetailObj.COINSURANCEPERCENT,
                "POSTOPVISITS": $scope.FeeCodesDetailObj.POSTOPVISITS,
                "REFERRALREQUIRED": $scope.FeeCodesDetailObj.REFERRALREQUIRED,
                "EFFECTIVEDATE": $scope.FeeCodesDetailObj.EFFECTIVEDATE,
                "EXPIRYDATE": $scope.FeeCodesDetailObj.EXPIRYDATE,
                "ALTERNATECODE": $scope.FeeCodesDetailObj.ALTERNATECODE,
                "ALTERNATECODE2": $scope.FeeCodesDetailObj.ALTERNATECODE2,
                "INTERNALRVU": $scope.FeeCodesDetailObj.INTERNALRVU,
                "RVSCODE": $scope.FeeCodesDetailObj.RVSCODE,
                "RVSFEE": $scope.FeeCodesDetailObj.RVSFEE,
                "RVSUNITS": $scope.FeeCodesDetailObj.RVSUNITS,
                "REFERRINGDOCTORREQD": $scope.FeeCodesDetailObj.REFERRINGDOCTORREQD,
                "PREAUTHORIZATIONREQUIRED": $scope.FeeCodesDetailObj.PREAUTHORIZATIONREQUIRED,
                "ALLOWEDYESNO": $scope.FeeCodesDetailObj.ALLOWEDYESNO,
                "PAPERONLY": $scope.FeeCodesDetailObj.PAPERONLY,
                "NOTCOVERED": $scope.FeeCodesDetailObj.NOTCOVERED,
                "HospitalId": hospid,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "POSKEY": $scope.FeeCodesDetailObj.POSKEY,
                "TOSKEY": $scope.FeeCodesDetailObj.TOSKEY,
                "DeleteInd": "Y",

            };
            eHnoteSettingsDataService.AddUpdateProcedureFees(object).success(function (response) {
                if (response.status === 'Success') {
                    alertify.success("Fee BillDetail Deleted Successfully");
                    $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
                    GetMasterProcedureFees();
                }
            })
                .error(function (error) {
                    alertify.error("Error Occurred");
                });
        }, function () {
            r = "You pressed Cancel!";
        });
    };

    $scope.EditFeecodeDetailItem = function (item, index) {
        $scope.FeeCodesDetailObj.ProcedureFeeId = item.ProcedureFeeId
        $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
        $scope.FeeCodesDetailObj.MODIFIERKEY1 = item.MODIFIERKEY1;
        $scope.FeeCodesDetailObj.MODIFIERKEY2 = item.MODIFIERKEY2;
        $scope.FeeCodesDetailObj.MODIFIERKEY3 = item.MODIFIERKEY3;
        $scope.FeeCodesDetailObj.MODIFIERKEY4 = item.MODIFIERKEY4;
        $scope.FeeCodesDetailObj.ALTERNATEProcedureId = item.ALTERNATEProcedureId;
        $scope.FeeCodesDetailObj.WRITEOFFId = item.WRITEOFFId;
        $scope.FeeCodesDetailObj.InsurancePlanId = item.InsurancePlanId;
        $scope.FeeCodesDetailObj.METHOD = item.METHOD;
        $scope.FeeCodesDetailObj.CHARGE = item.CHARGE;
        $scope.FeeCodesDetailObj.ALLOWED = item.ALLOWED;
        $scope.FeeCodesDetailObj.ALLOWEDPERCENT = item.ALLOWEDPERCENT;
        $scope.FeeCodesDetailObj.WRITEOFFINDICATOR = item.WRITEOFFINDICATOR;
        $scope.FeeCodesDetailObj.CoverId = item.CoverId;
        $scope.FeeCodesDetailObj.CAPITATED = item.CAPITATED;
        $scope.FeeCodesDetailObj.DOCUMENTATIONREQUIRED = item.DOCUMENTATIONREQUIRED;
        $scope.FeeCodesDetailObj.COMMENTS = item.COMMENTS;
        $scope.FeeCodesDetailObj.InsuranceEstimate = item.InsuranceEstimate;
        $scope.FeeCodesDetailObj.PatientEstimate = item.PatientEstimate;
        $scope.FeeCodesDetailObj.TAXABLEPERCENT = item.TAXABLEPERCENT;
        $scope.FeeCodesDetailObj.DISPLAYHINT = item.DISPLAYHINT;
        $scope.FeeCodesDetailObj.DISPLAYHINTTYPE = item.DISPLAYHINTTYPE;
        $scope.FeeCodesDetailObj.AUTHORIZATIONREQUIRED = item.AUTHORIZATIONREQUIRED;
        $scope.FeeCodesDetailObj.COPAYMENT = item.COPAYMENT;
        $scope.FeeCodesDetailObj.COPAYRELATED = item.COPAYRELATED;
        $scope.FeeCodesDetailObj.POSTOPDAYS = item.POSTOPDAYS;
        $scope.FeeCodesDetailObj.COINSURANCEPERCENT = item.COINSURANCEPERCENT;
        $scope.FeeCodesDetailObj.POSTOPVISITS = item.POSTOPVISITS;
        $scope.FeeCodesDetailObj.REFERRALREQUIRED = item.REFERRALREQUIRED;
        $scope.FeeCodesDetailObj.EFFECTIVEDATE = $filter('date')(new Date(item.EFFECTIVEDATE), "dd-MMM-yyyy");
        $scope.FeeCodesDetailObj.EXPIRYDATE = $filter('date')(new Date(item.EXPIRYDATE), "dd-MMM-yyyy");
        $scope.FeeCodesDetailObj.ALTERNATECODE = item.ALTERNATECODE;
        $scope.FeeCodesDetailObj.ALTERNATECODE2 = item.ALTERNATECODE2;
        $scope.FeeCodesDetailObj.INTERNALRVU = item.INTERNALRVU;
        $scope.FeeCodesDetailObj.RVSCODE = item.RVSCODE;
        $scope.FeeCodesDetailObj.RVSFEE = item.RVSFEE;
        $scope.FeeCodesDetailObj.RVSUNITS = item.RVSUNITS;
        $scope.FeeCodesDetailObj.REFERRINGDOCTORREQD = item.REFERRINGDOCTORREQD;
        $scope.FeeCodesDetailObj.PREAUTHORIZATIONREQUIRED = item.PREAUTHORIZATIONREQUIRED;
        $scope.FeeCodesDetailObj.ALLOWEDYESNO = item.ALLOWEDYESNO;
        $scope.FeeCodesDetailObj.PAPERONLY = item.PAPERONLY;
        $scope.FeeCodesDetailObj.NOTCOVERED = item.NOTCOVERED;
        $scope.FeeCodesDetailObj.POSKEY = item.POSKEY;
        $scope.FeeCodesDetailObj.TOSKEY = item.TOSKEY;

        if ($scope.FeeCodesDetailObj.ProcedureId !== "") {
            $scope.FeeCodesDetailObj.ProcedureId = parseInt($scope.FeeCodesDetailObj.ProcedureId);
            var tempprocedureobj = $filter("filter")($scope.FeeCodeMasterCPTBillDetailList, { "ProcedureId": $scope.FeeCodesDetailObj.ProcedureId })[0];
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = tempprocedureobj.ProcedureCode || "";
        }
        if ($scope.FeeCodesDetailObj.InsurancePlanId !== "") {
            $scope.FeeCodesDetailObj.InsurancePlanId = parseInt($scope.FeeCodesDetailObj.InsurancePlanId);
            $scope.FeeCodesDetailObj.InsurancePlanTypeObj = $filter("filter")($scope.FeeInsurancePlanList, { "InsurancePlanId": $scope.FeeCodesDetailObj.InsurancePlanId })[0];
        }
        if ($scope.FeeCodesDetailObj.POSKEY !== "") {
            $scope.FeeCodesDetailObj.POSKEY = parseInt($scope.FeeCodesDetailObj.POSKEY);
            $scope.FeeCodesDetailObj.POSObj = $filter("filter")($scope.FeePOSCodeList, { "POSId": $scope.FeeCodesDetailObj.POSKEY })[0];
        }
        if ($scope.FeeCodesDetailObj.TOSKEY !== "") {
            $scope.FeeCodesDetailObj.TOSKEY = parseInt($scope.FeeCodesDetailObj.TOSKEY);
            $scope.FeeCodesDetailObj.TOSObj = $filter("filter")($scope.TOSCodeList, { "TOSId": $scope.FeeCodesDetailObj.TOSKEY })[0];
        }
        $scope.masterFeeCodeBtnName='Update'
    }

    $scope.FeeChangeModifier1 = function (item) {
        item.Modifier1Obj = item.Modifier1Obj || "";
        if (item.Modifier1Obj != "") {
            item.MODIFIERKEY1 = item.Modifier1Obj.MODIFIERID;
        }
    };

    $scope.changeFeeWriteoff = function (item) {
        item.WriteoffObj = item.WriteoffObj || "";
        if (item.WriteoffObj != "") {
            item.WRITEOFFId = item.WriteoffObj.WriteOffId;
        }
    };
    $scope.FeeChangeModifier2 = function (item) {
        item.Modifier2Obj = item.Modifier2Obj || "";
        if (item.Modifier2Obj != "") {
            item.MODIFIERKEY2 = item.Modifier2Obj.MODIFIERID;
        }
    };
    $scope.FeeChangeModifier3 = function (item) {
        item.Modifier3Obj = item.Modifier3Obj || "";
        if (item.Modifier3Obj != "") {
            item.MODIFIERKEY3 = item.Modifier3Obj.MODIFIERID;
        }
    };
    $scope.FeeChangeModifier4 = function (item) {
        item.Modifier4Obj = item.Modifier4Obj || "";
        if (item.Modifier4Obj != "") {
            item.MODIFIERKEY4 = item.Modifier4Obj.MODIFIERID;
        }
    };
   

    $scope.ChangeSnomedProcedureType = function (item) {
        item.TypeObj = item.TypeObj || "";
        if (item.TypeObj != "") {
            item.TypeId = item.TypeObj.DropdownId;
        }
    };
    $scope.ChangeSearchType = function (item) {
        item.SearchTypeObj = item.SearchTypeObj || "";
        if (item.SearchTypeObj != "") {
            item.SearchType = item.SearchTypeObj.DropdownId;
        }
    };

    $scope.ClearSnomedCodes = function () {
        $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());
        $scope.masterSnomedCodeBtnName = "Add";
    }
    $scope.ClearSearchSnomedCodes = function () {
        $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());
        $scope.masterSnomedCodeBtnName = "Add";
        getSnomedCodeItems();
    }

    $scope.AddUpdateSnomedCodes = function () {
        if ($scope.SnomedCodesObj.ConceptId === "" || $scope.SnomedCodesObj.ConceptId === undefined) {
            alertify.error("Enter Concept Id");
            return false;
        }

      var  object = {
          "SnomedCodeId": $scope.SnomedCodesObj.SnomedCodeId,
          "ConceptId": $scope.SnomedCodesObj.ConceptId,
          "Description": $scope.SnomedCodesObj.Description,
          "EffectiveTime": $scope.SnomedCodesObj.EffectiveTime,
          "TypeId": $scope.SnomedCodesObj.TypeId,
          "StatusId": $scope.SnomedCodesObj.StatusId || null,
          "ModuleId": null,
          "CreatedBy": $scope.SnomedCodesObj.CreatedBy,
          "ModifiedBy": $scope.SnomedCodesObj.ModifiedBy,
          "CreatedDt": $scope.SnomedCodesObj.EnteredDate,
          "DeleteInd": $scope.SnomedCodesObj.DeleteInd,
          "HospitalId": hospid,
          "ActiveInd": $scope.SnomedCodesObj.ActiveInd,
          "ParentOrganizationId": parentHospitalId || null,
        };
       // object.CreatedDt = $filter("dateFormatter")(object.CreatedDt, "-");
       // object.EffectiveTime = $filter("dateFormatter")(object.EffectiveTime, "-");
        object.CreatedDt = $filter("date")(new Date(object.CreatedDt), "yyyy-MM-dd");
        object.EffectiveTime = $filter("date")(new Date(object.EffectiveTime), "yyyy-MM-dd");

        eHnoteSettingsDataService.addUpdateSnomedCodes(object).success(function (response) {

            if ($scope.SnomedCodesObj.DeleteInd === 'Y') {
                alertify.success("SnomedCodes Deleted Successfully");
                $scope.ClearSnomedCodes();
                getSnomedCodeItems();

            } else {
                if (response.status === 'Success') {
                    if ($scope.SnomedCodesObj.SnomedCodeId === undefined || $scope.SnomedCodesObj.SnomedCodeId === 0) {
                        alertify.success("SnomedCodes Added Successfully");
                    } else {
                        alertify.success("SnomedCodes Updated Successfully");
                    }
                    $scope.ClearSnomedCodes();
                    getSnomedCodeItems();
                }

                if (response.status === 'Failure') {
                    if (response.Message === 'Description & ConceptId Already Exists') {
                        alertify.error("Snomed Code already exist");
                    }
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    };
    $scope.EditSnomedCodeItem = function (item, index) {
        $scope.snomedCodesFocus = true;
        $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());
        $scope.SnomedCodesObj.SnomedCodeId = item.SnomedCodeId;
        $scope.SnomedCodesObj.ConceptId = item.ConceptId;
        $scope.SnomedCodesObj.Description = item.Description;
        $scope.SnomedCodesObj.EffectiveTime = item.EffectiveTime;
        if ($scope.SnomedCodesObj.EffectiveTime != '') {
            $scope.SnomedCodesObj.EffectiveTime = $filter("date")(new Date(item.EffectiveTime), "dd-MM-yyyy");
        }
        $scope.SnomedCodesObj.TypeId = item.Type;
        $scope.SnomedCodesObj.StatusId = item.StatusId;
        $scope.SnomedCodesObj.EnterBy = item.CreatedByName;
        $scope.SnomedCodesObj.ModifiedName = item.ModifiedByName;
       $scope.SnomedCodesObj.CreatedBy = item.CreatedBy;
        $scope.SnomedCodesObj.ModifiedBy = item.ModifiedBy;
        $scope.SnomedCodesObj.EnteredDate = item.Date || "";
        if ($scope.SnomedCodesObj.EnteredDate != '') {
            $scope.SnomedCodesObj.EnteredDate = $filter("date")(new Date(item.Date), "dd-MM-yyyy");
        }
        if ($scope.SnomedCodesObj.TypeId !== "") {
           
            $scope.SnomedCodesObj.TypeObj = $filter("filter")($scope.ProcedureTypes, { "DropdownId": $scope.SnomedCodesObj.TypeId })[0];
        }
        $scope.SnomedCodesObj.DeleteInd = 'N';
        $scope.masterSnomedCodeBtnName = "Update";
    };


    $scope.DeleteSnomedCodeItem = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Snomed Codes? </h4>", function () {

            $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());
            $scope.SnomedCodesObj.SnomedCodeId = item.SnomedCodeId;
            $scope.SnomedCodesObj.ConceptId = item.ConceptId;
            $scope.SnomedCodesObj.Description = item.Description;
            $scope.SnomedCodesObj.EffectiveTime = item.EffectiveTime;
            if ($scope.SnomedCodesObj.EffectiveTime != '') {
                $scope.SnomedCodesObj.EffectiveTime = $filter("date")(new Date(item.EffectiveTime), "dd-MM-yyyy");
            }
            $scope.SnomedCodesObj.TypeId = item.TypeId;
            $scope.SnomedCodesObj.StatusId = item.StatusId;
            $scope.SnomedCodesObj.EnterBy = item.CreatedByName;
            $scope.SnomedCodesObj.ModifiedName = item.ModifiedByName;
            $scope.SnomedCodesObj.CreatedBy = item.CreatedBy;
            $scope.SnomedCodesObj.ModifiedBy = item.ModifiedBy;
            $scope.SnomedCodesObj.EnteredDate = item.Date || "";
            if ($scope.SnomedCodesObj.EnteredDate != '') {
                $scope.SnomedCodesObj.EnteredDate = $filter("date")(new Date(item.Date), "dd-MM-yyyy");
            }
            $scope.SnomedCodesObj.DeleteInd = 'Y';
            $scope.AddUpdateSnomedCodes();
        }, function () {
            r = "You pressed Cancel!";
        });
    };

    $scope.SnomedCodesChanged1 = function (pageno) {
        $scope.SnomedCodesObj.PageNumber = pageno;
        getSnomedCodeItems();
    };

    $scope.ChangeSearchDate = function (dt) {
        //$scope.SnomedCodesObj.SearchEnteredDate = $filter("date")(new Date(dt), "dd-MM-yyyy");
        $scope.SnomedCodesObj.SearchEnteredDate = dt;
    }

    $scope.SearchSnomedCodes=function() {
        object = {
            "HospitalId": hospid,
            "SearchText": $scope.SnomedCodesObj.SearchDescription,
            "PageSize": 20,
            "PageNumber": 1,
            "SearchType": $scope.SnomedCodesObj.SearchType || "",
            "SearchConcept": $scope.SnomedCodesObj.SearchConcept || "",
            "SearchDate": $scope.SnomedCodesObj.SearchEnteredDate || "",
            "ParentOrganizationId": parentHospitalId || null,
        };

       // object.SearchDate = $filter("dateFormatter")(object.SearchDate, "-");
        object.SearchDate = $filter("date")(new Date(object.SearchDate), "yyyy-MM-dd");
        eHnoteSettingsDataService.GetSnomedCodes(object).success(function (response) {
            $scope.SnomedCodesArray = [];
            if (response.count > 0) {
                $scope.SnomedCodesArray = response.rows;

                $scope.masterSnomedCodesItems = response.count;

            }
        }).error(function (error) {
            console.log(error);
        });
    }
    $scope.SnomedCodesChanged = function (pageno) {
        $scope.SnomedCodesICD10Obj.PageNumber = pageno;
        getMasterSnomedICD10Items('');
    };

    $scope.ChangeDenialPlan = function (item) {
        item.PlanObj = item.PlanObj || "";
        if (item.PlanObj != "") {
            item.PlanId = item.PlanObj.InsurancePlanId;
        }
    };

    $scope.ChangeDrawerPlan = function (item) {
        item.PlanObj = item.PlanObj || "";
        if (item.PlanObj != "") {
            item.PlanId = item.PlanObj.InsurancePlanId;
        }
    };

    $scope.ChangeSearchDrawerPlan = function (item) {
        item.SearchPlanObj = item.SearchPlanObj || "";
        if (item.SearchPlanObj != "") {
            item.SearchPlan = item.SearchPlanObj.InsurancePlanId;
        }
        else {
            item.SearchPlan = "";
        }
    };

    $scope.ChangeDrawerProvider = function (item) {
        item.ProviderObj = item.ProviderObj || "";
        if (item.ProviderObj != "") {
            item.ProviderId = item.ProviderObj.DoctorID;
        }
    };
    $scope.ChangeSearchDrawerProvider = function (item) {
        item.SearchProviderObj = item.SearchProviderObj || "";
        if (item.SearchProviderObj != "") {
            item.SearchText = item.SearchProviderObj.DoctorID;
        }
        else {
            item.SearchText = "";
        }
    };
    $scope.ChangeDrawerAppType = function (item) {
        item.AppTypeObj = item.AppTypeObj || "";
        if (item.AppTypeObj != "") {
            item.AppointmentTypeId = item.AppTypeObj.AppointmentTypeId;
        }
    };
    $scope.ChangeSearchDrawerAppType = function (item) {
        item.SearchAppTypeObj = item.SearchAppTypeObj || "";
        if (item.SearchAppTypeObj != "") {
            item.SearchAppType = item.SearchAppTypeObj.AppointmentTypeId;
        }
        else {
            item.SearchAppType = "";
        }
    };
    $scope.ChangeDrawerLocation = function (item) {
        item.LocationObj = item.LocationObj || "";
        if (item.LocationObj != "") {
            item.LocationId = item.LocationObj.ClinicId;
        }
    };

    $scope.ClearDenialCode = function () {
        $scope.BillingDenialObj = angular.copy($scope.getDenialsObj());
        $scope.masterDenialCodeBtnName = "Add";
    }
    $scope.CancelDenialCode = function () {
        $scope.BillingDenialObj = angular.copy($scope.getDenialsObj());
        $scope.masterDenialCodeBtnName = "Add";
        GetDenialCodes('');
    }
   
    $scope.AddUpdateDenialItem = function () {

        if ($scope.BillingDenialObj.ShortCut === "" || $scope.BillingDenialObj.ShortCut === undefined) {
            alertify.error("Enter ShortCut");
            return false;
        }
        var object = {
            "DenialId": $scope.BillingDenialObj.DenialId,
            "ShortCut": $scope.BillingDenialObj.ShortCut,
            "Description": $scope.BillingDenialObj.Description,
            "PlanId": $scope.BillingDenialObj.PlanId,
            "StatusId": $scope.BillingDenialObj.StatusId,
            "Comments": $scope.BillingDenialObj.Comments,
            "DeleteInd": $scope.BillingDenialObj.DeleteInd,
            "HospitalId": hospid,
            "UserId": $scope.UserId
        };
        eHnoteSettingsDataService.AddUpdateDenialCodes(object).success(function (response) {

            if ($scope.BillingDenialObj.DeleteInd === 'Y') {
                alertify.success("Denial Deleted Successfully");
                $scope.ClearDenialCode();
                GetDenialCodes('');

            } else {
                if (response.status === 'Success') {
                    if ($scope.BillingDenialObj.DenialId === undefined || $scope.BillingDenialObj.DenialId === 0) {
                        alertify.success("Denial Added Successfully");
                    } else {
                        alertify.success("Denial Updated Successfully");
                    }
                       $scope.ClearDenialCode();
                       GetDenialCodes('');
                }

                if (response.status === 'Failure') {
                    if (response.Message === 'Denial Already exists') {
                        alertify.error("Denial already exist");
                    }
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    };

    $scope.DenialCodesChanged = function (pageno) {
        $scope.BillingDenialObj.PageNumber = pageno;
        GetDenialCodes('Search');
    };

    $scope.editDenialCodes = function (item, index) {
        $scope.showModifyMasterDiagDiv = true;
        $scope.BillingDenialObj = angular.copy($scope.getDenialsObj());
        $scope.BillingDenialObj.DenialId = item.DenialCodeId;
        $scope.BillingDenialObj.Description = item.Name;
        $scope.BillingDenialObj.PlanId = item.PlanId;
        if ($scope.BillingDenialObj.InsurancePlanId !== "") {
            $scope.BillingDenialObj.PlanObj = $filter("filter")($scope.InsurancePlanList, { "InsurancePlanId": $scope.BillingDenialObj.PlanId })[0];
        }
        $scope.BillingDenialObj.ShortCut = item.ShortCode;
        $scope.BillingDenialObj.Comments = item.Comments;
        $scope.BillingDenialObj.StatusId = item.StatusId;
        $scope.masterDenialCodeBtnName = "Update";
    };


    $scope.deleteDenialCodes = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this DenialCodes? </h4>", function () {

            $scope.BillingDenialObj.DenialId = item.DenialCodeId;
            $scope.BillingDenialObj.Description = item.Name;
            $scope.BillingDenialObj.PlanId = item.PlanId;
            $scope.BillingDenialObj.ShortCut = item.ShortCode;
            $scope.BillingDenialObj.Comments = item.Comments;
            $scope.BillingDenialObj.StatusId = item.StatusId;
            $scope.BillingDenialObj.DeleteInd = 'Y';
            $scope.AddUpdateDenialItem();
        }, function () {
            r = "You pressed Cancel!";
        });
    };

    $scope.SearchDenialCodes = function () {
        GetDenialCodes('Search');
    }

    $scope.SearchDrawerSuperBill = function () {
        GetSuperBill('Search');
    }
    $scope.ChangeDrawerSpeciality = function (item) {
        item.SpecialityObj = item.SpecialityObj || "";
        if (item.SpecialityObj != "") {
            item.SpecializationId = item.SpecialityObj.Id;
        }
    };

    $scope.ClearDrawerItem = function () {
        $scope.SuperBillDrawerObj = angular.copy($scope.getDrawerObj());
        $scope.masterDrawerBtnName = "Save";
    }

    $scope.AddUpdateSuperBillDrawerItem = function () {
        if ($scope.SuperBillDrawerObj.AppointmentTypeId === "" || $scope.SuperBillDrawerObj.AppointmentTypeId === undefined) {
            alertify.error("Please Select AppointmentType");
            return false;
        }

        var object = {
            "SuperBillId": $scope.SuperBillDrawerObj.SuperBillId,
            "ProviderId": $scope.SuperBillDrawerObj.ProviderId,
            "AppointmentTypeId": $scope.SuperBillDrawerObj.AppointmentTypeId,
            "PlanId": $scope.SuperBillDrawerObj.PlanId,
            "LocationId": $scope.SuperBillDrawerObj.LocationId,
            "SpecializationId": $scope.SuperBillDrawerObj.SpecializationId,
            "DeleteInd": $scope.SuperBillDrawerObj.DeleteInd,
            "HospitalId": hospid,
            "UserId": $scope.UserId
        };

        eHnoteSettingsDataService.AddUpdateSuperBill(object).success(function (response) {
            if ($scope.SuperBillDrawerObj.DeleteInd === 'Y') {
                alertify.success("Denial Deleted Successfully");
                $scope.ClearDrawerItem();
                GetSuperBill('');

            } else {
                if (response.Status === 'Success') {
                    if ($scope.SuperBillDrawerObj.SuperBillId === undefined || $scope.SuperBillDrawerObj.SuperBillId === 0) {
                        alertify.success("Drawer Added Successfully");
                    } else {
                        alertify.success("Drawer Updated Successfully");
                    }
                    $scope.ClearDrawerItem();
                    GetSuperBill('');
                }

                if (response.status === 'Failure') {
                    if (response.Message === 'Drawer Already exists') {
                        alertify.error("Drawer already exist");
                    }
                }
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    }

    $scope.EditDrawerItems = function (item, index) {
        $scope.SuperBillDrawerObj = angular.copy($scope.getDrawerObj());
        $scope.SuperBillDrawerObj.SuperBillId = item.SuperbillId;
        $scope.SuperBillDrawerObj.LocationId = item.LocationId;
        $scope.SuperBillDrawerObj.PlanId = item.PlanId;
        $scope.SuperBillDrawerObj.SpecializationId = item.SpecialtyId;
        $scope.SuperBillDrawerObj.ProviderId = item.UserId;
        $scope.SuperBillDrawerObj.AppointmentTypeId = item.ApptTypeId;
        if ($scope.SuperBillDrawerObj.PlanId !== "") {
            $scope.SuperBillDrawerObj.PlanObj = $filter("filter")($scope.InsurancePlanList, { "InsurancePlanId": $scope.SuperBillDrawerObj.PlanId })[0];
        }
        if ($scope.SuperBillDrawerObj.AppointmentTypeId !== "") {
            $scope.SuperBillDrawerObj.AppTypeObj = $filter("filter")($scope.appointmentTypes, { "AppointmentTypeId": $scope.SuperBillDrawerObj.AppointmentTypeId })[0];
        }
        if ($scope.SuperBillDrawerObj.ProviderId !== "") {
            $scope.SuperBillDrawerObj.ProviderObj = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.SuperBillDrawerObj.ProviderId })[0];
        }
        if ($scope.SuperBillDrawerObj.LocationId !== "") {
            $scope.SuperBillDrawerObj.LocationObj = $filter("filter")($scope.AppListdoctoraddress, { "ClinicId": $scope.SuperBillDrawerObj.LocationId })[0];
        }

        if ($scope.SuperBillDrawerObj.SpecializationId !== "") {
            $scope.SuperBillDrawerObj.SpecialityObj = $filter("filter")($scope.specialitylist, { "Id": $scope.SuperBillDrawerObj.SpecializationId })[0];
        }
        $scope.masterDrawerBtnName = "Update";
    };


    $scope.DeleteDrawerItems = function (item, index) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Drawer Bill? </h4>", function () {

            $scope.SuperBillDrawerObj.SuperBillId = item.SuperbillId;
            $scope.SuperBillDrawerObj.LocationId = item.LocationId;
            $scope.SuperBillDrawerObj.PlanId = item.PlanId;
            $scope.SuperBillDrawerObj.SpecializationId = item.SpecialtyId;
            $scope.SuperBillDrawerObj.ProviderId = item.UserId;
            $scope.SuperBillDrawerObj.AppointmentTypeId = item.ApptTypeId;
            $scope.SuperBillDrawerObj.DeleteInd = 'Y';
            $scope.AddUpdateSuperBillDrawerItem();
        }, function () {
            r = "You pressed Cancel!";
        });
    };

    $scope.SuperBillDrawerPageChange = function (pageno) {
        $scope.SuperBillDrawerObj.PageNumber = pageno;
        GetSuperBill('');
    };
    $scope.CancelDrawerSuperBill = function () {
        $scope.SuperBillDrawerObj = angular.copy($scope.getDrawerObj());
        $scope.masterDrawerBtnName = "Save";
        GetSuperBill('');
    }
    $scope.selectedRow = null;  
    $scope.selectedAddRow = null;  

    $scope.selectedDiagnosisRow = null;
    $scope.selectedDiagnosisAddRow = null;  

    $scope.setClickedRow = function (index) { 
        $scope.selectedRow = index;
    }
    $scope.setAddClickedRow = function (index) {
        $scope.selectedAddRow = index;
    }
    
    $scope.setDiagnosisClickedRow = function (index) {
        $scope.selectedDiagnosisRow = index;
    }

    $scope.setAddDiagnosisClickedRow = function (index) {
        $scope.selectedDiagnosisAddRow = index;
    }
    $scope.PushProcedureItem = function () {
        var index = $scope.selectedRow;
        
        if (index > -1) {
            $scope.SelectedProceduresList.push($scope.MasterSuperBillProcedureList[index]);
        }
    }
    $scope.PushDiagnosisItem = function () {
        var index = $scope.selectedDiagnosisRow;

        if (index > -1) {
            $scope.MasterSuperBillDiagnosisList[index].DeleteInd = 'N';
            $scope.SelectedDiagnosisList.push($scope.MasterSuperBillDiagnosisList[index]);
        }
    }

    $scope.AddBlankLine = function () {
        var obj = {
            "ProcedureId": "",
            "LineType": 'B',
        }
        $scope.SelectedProceduresList.push(obj);
    }

    $scope.AddHeaderLine = function () {
        if ($scope.selectedAddRow === null) {
            alertify.error("Please select CPT");
            return false;
        }
        var index = $scope.selectedAddRow;
        if (index > -1) {
            $scope.SelectedProceduresList[index].LineType = 'H';
        }
    }
    $scope.RemoveProcedureItem = function () {
        var index = $scope.selectedAddRow;

        if (index > -1) {
            if ($scope.SelectedProceduresList[index].SuperbillProcedureId === 0 || $scope.SelectedProceduresList[index].SuperbillProcedureId === undefined) {
                $scope.SelectedProceduresList.splice(index, 1);
            }
            else {
                $scope.SelectedProceduresList[index].DeleteInd = 'Y';
            }
        }
    }

    $scope.RemoveDiagnosisItem = function () {
        var index = $scope.selectedDiagnosisAddRow;

        if (index > -1) {
            if ($scope.SelectedDiagnosisList[index].SuperbillDiagnosisId === 0 || $scope.SelectedDiagnosisList[index].SuperbillDiagnosisId === undefined) {
                $scope.SelectedDiagnosisList.splice(index, 1);
            }
            else {
                $scope.SelectedDiagnosisList[index].DeleteInd = 'Y';
            }
        }
    }

    $scope.AddDiagnosisBlankLine = function () {
        var obj = {
            "DiagnosisId": "",
            "LineType": 'B',
        }
        $scope.SelectedDiagnosisList.push(obj);
    }

    $scope.AddDiagnosisHeaderLine = function () {
        if ($scope.selectedDiagnosisAddRow === null) {
            alertify.error("Please select Diagnosis");
            return false;
        }
        var index = $scope.selectedDiagnosisAddRow;
        if (index > -1) {
            $scope.SelectedDiagnosisList[index].LineType = 'H';
        }
    }

    
    $scope.more = function () {
        var PageSize = $scope.SuperBillProcedureObj.PageSize + 100;
        object = {
            "LevelType": "O",
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.SuperBillProcedureObj.SearchText,
            "PageSize": PageSize,
            "PageNumber": $scope.SuperBillProcedureObj.PageNumber,
            "ProcedureTypeId": 1,
            "SearchDescription": $scope.SuperBillProcedureObj.SearchDescription,
            "SearchModifier1": $scope.SuperBillProcedureObj.SearchModifier1,
            "SearchCharge": $scope.SuperBillProcedureObj.SearchCharge,
            "AllBranchInd": 0
        };

        eHnoteSettingsDataService.getMasterCPTBillDetail(object).success(function (response) {
             $scope.ProcedureList = [];
            if (response.ProcedureList !== undefined) {
                if (response.ProcedureList.length > 0) {
                    $scope.ProcedureList = response.ProcedureList;
                    $scope.MasterSuperBillProcedureList = $scope.MasterSuperBillProcedureList.concat($scope.ProcedureList);
                }
            }

        }).error(function (error) {
            console.log(error);
        });
    };

    $scope.AddUpdateSuperBillProcedure = function () {
        $scope.ProcedureList = [];
        angular.forEach($scope.SelectedProceduresList, function (item, index) {
            var obj = {
                "SuperbillProcedureId": item.SuperbillProcedureId || 0,
                "SuperbillId": $scope.SuperBillDrawerObj.SuperBillId,
                 "ProcedureId": item.ProcedureId,
                 "LineType": item.LineType || 'P',
                "DeleteInd": item.DeleteInd || 'N'
            }
            $scope.ProcedureList.push(obj);
        });

        var object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "ProcedureList": $scope.ProcedureList
        };

        if ($scope.ProcedureList.length === 0) {
            alertify.error("Please select atleast one item in CPT");
            return false;
        }
      
        eHnoteSettingsDataService.AddUpdateSuperBillProcedure(object).success(function (response) {
            if (response.Status === 'Success') {
                if ($scope.SuperBillProcedureObj.SuperbillProcedureId === undefined || $scope.SuperBillProcedureObj.SuperbillProcedureId === 0) {
                    alertify.success("Procedure Added Successfully");
                } else {
                    alertify.success("Procedure Updated Successfully");
                }
                $scope.ClearDrawerItem();
                GetSuperBill('');
            }

            if (response.status === 'Failure') {
                if (response.Message === 'Procedure Already exists') {
                    alertify.error("Procedure already exist");
                }
            }

        }).error(function (error) {
                alertify.error("Error Occurred");
            });
    }

    $scope.moreDiagnosisList = function () {
        var PageSize = $scope.SuperBillDiagnosisObj.PageSize + 100;

        var object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.SuperBillDiagnosisObj.SearchText,
            "PageSize": PageSize,
            "PageNumber": $scope.SuperBillDiagnosisObj.PageNumber,
            "SearchCode": $scope.SuperBillDiagnosisObj.SearchCode,
            "SearchDescription": $scope.SuperBillDiagnosisObj.SearchDescription,
            "IsFrequent": "N",
            "ParentOrganizationId": parentHospitalId || null,
        };

        eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).success(function (response) {
            $scope.DiagnosisList = [];
            if (response.DiagnosisList !== undefined) {
                if (response.DiagnosisList.length > 0) {
                    $scope.DiagnosisList = response.DiagnosisList;
                    $scope.MasterSuperBillDiagnosisList = $scope.MasterSuperBillDiagnosisList.concat($scope.DiagnosisList);
                }
            }
        }).error(function (error) {
            
        });
    };

    $scope.AddUpdateSuperBillDiagnosis = function () {
        $scope.DiagnosisList = [];
        angular.forEach($scope.SelectedDiagnosisList, function (item, index) {
            var obj = {
                "SuperbillDiagnosisId": item.SuperbillDiagnosisId || 0,
                "SuperbillId": $scope.SuperBillDrawerObj.SuperBillId,
                "DiagnosisId": item.DiagnosisId,
                "LineType": item.LineType || 'D',
                "DeleteInd": item.DeleteInd || 'N'
            }
            $scope.DiagnosisList.push(obj);
        });

        var object = {
            "HospitalId": hospid,
            "UserId": $scope.UserId,
            "DiagnosisList": $scope.DiagnosisList
        };

        if ($scope.DiagnosisList.length === 0) {
            alertify.error("Please select atleast one item from ICD 10");
            return false;
        }
        eHnoteSettingsDataService.AddUpdateSuperBillDiagnosis(object).success(function (response) {
        
                if (response.Status === 'Success') {
                    if ($scope.SuperBillDiagnosisObj.SuperbillDiagnosisId === undefined || $scope.SuperBillDiagnosisObj.SuperbillDiagnosisId === 0) {
                        alertify.success("ICD10 Added Successfully");
                    } else {
                        alertify.success("ICD10 Updated Successfully");
                    }
                    $scope.ClearDrawerItem();
                    GetSuperBill('');
                }

                if (response.status === 'Failure') {
                    if (response.Message === 'ICD10 Already exists') {
                        alertify.error("ICD10 already exist");
                    }
                }
        }).error(function (error) {
                alertify.error("Error Occurred");
            });
    }
    $scope.changeDiagnosisActive = function (item) {
        if (item.ActiveInd == 'N') {
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": item.OrganizationId,
                "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                "ActiveInd": "Y",
            }
            eHnoteSettingsDataService.UpdateDiagnosisActiveStatusList(params).success(function (data) {
                if (data.Status === "Success") {
                    getMasterDiagnosisItems();
                    alertify.success('Diagnosis Activated!');
                }
            }).error(function (error) {

            });
        }
        if (item.ActiveInd == 'Y') {
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": item.OrganizationId,
                "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                "ActiveInd": "N",
            }
            eHnoteSettingsDataService.UpdateDiagnosisActiveStatusList(params).success(function (data) {
                if (data.Status === "Success") {
                    getMasterDiagnosisItems();
                    alertify.success('Diagnosis Deactivated!');
                }
            }).error(function (error) {

            });
        }

    }

    $scope.AddDiagnosiswithSNOMED = function (item, Snomeditem,type) {
        $scope.modalROSInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/AddDiagnosiswithSnomedpopup.html",
            "controller": "USAddDiagnosiswithSnomedPopupCtrl",
            "resolve": {
                "DiagnosisObject": function () { return item; },
                "SnomedObject": function () { return Snomeditem; },
                "Type": function () { return type; },
                
            },
            "backdrop": "static",
            "keyboard": false,
            "size":"lg",
            //"windowClass": "inventory-full-popup",
        });
    }


    $scope.changeSnomedActive = function (item) {
        if (item.ActiveInd == 'Y') {
            var ActiveInd = 'N'
        } else {
            var ActiveInd = 'Y'
        }

            var params = {
                "SnomedCodeId": item.SnomedCodeId,
                "ConceptId": item.ConceptId,
                "Description": item.Description,
                "EffectiveTime": item.EffectiveTime,
                "StatusId": item.StatusId,
                "CreatedBy": item.CreatedBy,
                "ModifiedBy": item.ModifiedBy,
                "CreatedDt": item.Date,
                "HospitalId": hospid,
                "ActiveInd": ActiveInd,
                "TypeId": item.Type,
                "ParentOrganizationId": parentHospitalId || null,
            }
            eHnoteSettingsDataService.addUpdateSnomedCodes(params).success(function (response) {
                if (response.status === 'Success') {
                    getSnomedCodeItems();
                    if (item.ActiveInd == 'N') {
                        alertify.success('SnomedCode Activated!');
                    } else {
                        alertify.success('SnomedCode InActivated!');
                    }
                    //alertify.success('SnomedCode Activated!');
                }
            }).error(function (error) {

            });
    }

    $scope.ChangeProcedureFrequentStatus = function (item, ind) {
        if (ind == true) {
            var Frequentval = "Y"
        } else {
            var Frequentval = "N"
        }
        if (item.IsFrequent == "Y") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Current Systemic History", function () {
                var obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": item.OrganizationId,
                    "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                    "DiagnosisId": item.DiagnosisId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.UpdateDiagnosisIsFrequentStatusById(obj).then(function (resp) {
                    if (resp.data.status === "Success") {
                        alertify.success("IsFrequent Updated successfully");
                        $scope.SearchDiagnosisICD10List();
                    }
                    if (resp.data.status === "Failure") {
                        alertify.error(resp.data.Message);
                        item.IsFrequentInd = false;
                    }              
                });
            }, function () {
                r = "You pressed Cancel!";
                if (ind == false) {
                    item.IsFrequentInd = true;
                }
            });
        }
        if (item.IsFrequent == "N") {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "OrganizationDiagnosisId": item.OrganizationDiagnosisId,
                "DiagnosisId": item.DiagnosisId,
                "IsFrequent": Frequentval
            };
            eHnoteSettingsDataService.UpdateDiagnosisIsFrequentStatusById(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("IsFrequent Updated successfully");
                    $scope.SearchDiagnosisICD10List();
                }
                if (resp.data.status === "Failure") {
                    alertify.error(resp.data.Message);
                    item.IsFrequentInd = false;
                }

           });

        }
    }
    $scope.LostSettingsFocus = function () {
        $scope.diagnosisFocus = false;
        $scope.snomedCodesFocus = false;
    };

}]);
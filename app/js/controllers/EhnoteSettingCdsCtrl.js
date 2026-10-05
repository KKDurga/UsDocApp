"use strict";
eHnoteWebApp.controller("EhnoteSettingCdsCtrl", ["$scope", "$http", "$log", "$rootScope", "$uibModal", "$routeParams", "$filter", "$timeout", "alertify", "eHnoteMasterDataService", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteMainAdminServices", "datapersistanceFactory", "$window", "eHnotePatientVisitReasonServices", "eHnoteCacheStorageService", "eHnoteConditionsDataService", "eHnoteSettingsDataService", "eHnoteDiagnosisDataServices", "$location", function ($scope, $http, $log, $rootScope, $uibModal, $routeParams, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteUserDataService, eHnoteMainAppointmentService, eHnotePatientDataService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteMainAdminServices, datapersistanceFactory, $window, eHnotePatientVisitReasonServices, eHnoteCacheStorageService, eHnoteConditionsDataService, eHnoteSettingsDataService, eHnoteDiagnosisDataServices, $location) {


    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
    }
    $scope.SettingCdsshowingObj = {
        "IsShowDemograpicValue": false,
    }
    $scope.GetSavingCdsMainObj = {
        "UserId": '',
        "OrganizationId": "",
        "CDAIntreventionRule": "",
        "CDAIntreventionName": "",
        "DeleteInd": "N",
        "ActiveInd": false,
        "EnableCDSInterventionInd": false,
        "EnableRulesInd": false,
        "PageNationsValue": 1,
        "IsCdsDataEditCaseInd": false,
        "PageSize":10,
        "RuleData": {
            "RuleId": 0,
            "RuleValueId": "",
            "RuleName": "",
            "DeleteInd": "Y",
            "ActiveInd": "N",
            "RuleDetails": [{
                "DemograpicObjArray": [],
                "DiagnosisObjArray": [],
                "MedicationsObjArray": [],
                "AllergiesObjArray": [],
                "VitalsObjArray": [],
                "LabObjArray": [],
            }]
        },
    }
    $scope.GetSavingCdsMainObj.PageSize = 10;
    $scope.InitialRuleDetails = [];
    $scope.DemograpicViewAddingArray = [];
    $scope.VitalsViewAddingArray = [];
    $scope.getnewDemograpicArray = function () {
        var array = [
            {
                "SelectedParameterId": 1,
                "ParameterName": "Age",
            },
            {
                "SelectedParameterId": 2,
                "ParameterName": "Gender",
            },
            {
                "SelectedParameterId": 3,
                "ParameterName": "Language",
            },
            //{
            //    "SelectedParameterId": 4,
            //    "ParameterName": "DOB",
            //},
            {
                "SelectedParameterId": 5,
                "ParameterName": "Race",
            },
            {
                "SelectedParameterId": 6,
                "ParameterName": "Ethnicity",
            }
        ];
        return array;
    }
    $scope.settingDemograpicArray = $scope.getnewDemograpicArray();
    //$scope.getnewVitalsArray = function () {
    //    var array = [
    //        {
    //            "VitalId": 1,
    //            "VitalName": "Weight",
    //        },
    //        {
    //            "VitalId": 2,
    //            "VitalName": "Height",
    //        },
    //        {
    //            "VitalId": 4,
    //            "VitalName": "BP",
    //        },
    //        {
    //            "VitalId": 5,
    //            "VitalName": "Blood Glucose Level",
    //        },
    //        {
    //            "VitalId": 11,
    //            "VitalName": "Temperature",
    //        },
    //        {
    //            "VitalId": 12,
    //            "VitalName": "Pulse",
    //        },
    //        {
    //            "VitalId": 13,
    //            "VitalName": "Head Circumference",
    //        },
    //        {
    //            "VitalId": 14,
    //            "VitalName": "Respiratory Rate",
    //        },
    //        {
    //            "VitalId": 15,
    //            "VitalName": "SpO2",
    //        },
    //        {
    //            "VitalId": 17,
    //            "VitalName": "BMI",
    //        },
    //        {
    //            "VitalId": 40,
    //            "VitalName": "Inhaled oxygen concentration",
    //        },
    //        {
    //            "VitalId": 37,
    //            "VitalName": "Others",
    //        },
    //        //{
    //        //    "VitalId": 3,
    //        //    "VitalName": "Blood Group",
    //        //},
            
    //        //{
    //        //    "VitalId": 6,
    //        //    "VitalName": "Lipid Profile	",
    //        //},
    //        //{
    //        //    "VitalId": 7,
    //        //    "VitalName": "Sugar Fast",
    //        //},
    //        //{
    //        //    "VitalId": 8,
    //        //    "VitalName": "Sugar PP",
    //        //},
    //        //{
    //        //    "VitalId": 9,
    //        //    "VitalName": "Sugar Random",
    //        //},
    //        //{
    //        //    "VitalId": 10,
    //        //    "VitalName": "Serum creatinine",
    //        //},
            
    //        //{
    //        //    "VitalId": 16,
    //        //    "VitalName": "PEFR",
    //        //},
           
    //        //{
    //        //    "VitalId": 27,
    //        //    "VitalName": "Duct",
    //        //},
    //        //{
    //        //    "VitalId": 28,
    //        //    "VitalName": "Tension",
    //        //},
    //        //{
    //        //    "VitalId": 29,
    //        //    "VitalName": "HGB",
    //        //},
    //        //{
    //        //    "VitalId": 30,
    //        //    "VitalName": "HBS Ag",
    //        //},
    //        //{
    //        //    "VitalId": 31,
    //        //    "VitalName": "FBS/RBS",
    //        //},
    //        //{
    //        //    "VitalId": 32,
    //        //    "VitalName": "HCV",
    //        //},
    //        //{
    //        //    "VitalId": 33,
    //        //    "VitalName": "HIV",
    //        //},
    //        //{
    //        //    "VitalId": 34,
    //        //    "VitalName": "2D Echo",
    //        //},
    //        //{
    //        //    "VitalId": 35,
    //        //    "VitalName": "X-Ray",
    //        //},
    //        //{
    //        //    "VitalId": 36,
    //        //    "VitalName": "ECG",
    //        //}, 
           
    //        //{
    //        //    "VitalId": 39,
    //        //    "VitalName": "Sedation Score",
    //        //},
          
            
    //    ];
    //    return array;
    //}
    $scope.getnewVitalsArray = function () {
        var array = [
            {
                "VitalId": 11,
                "VitalName": "Tempareture",
            },
            {
                "VitalId": 12,
                "VitalName": "Pulse",
            },
            {
                "VitalId": 4,
                "VitalName": "BP",
            },
            {
                "VitalId": 14,
                "VitalName": "Resp.rate",
            },
            {
                "VitalId": 15,
                "VitalName": "Sp O2",
            },
            {
                "VitalId": 40,
                "VitalName": "Inh. O2 Conc.	",
            },
            {
                "VitalId": 5,
                "VitalName": "BGL",
            },
            {
                "VitalId": 13,
                "VitalName": "HOFC perc.",
            },
            {
                "VitalId": 1,
                "VitalName": "Weight",
            },
            {
                "VitalId": 2,
                "VitalName": "Height",
            },
            {
                "VitalId": 17,
                "VitalName": "BMI",
            },
            {
                "VitalId": 37,
                "VitalName": "%",
            }
        ];
        return array;
    }
    $scope.VitalsShowArray = $scope.getnewVitalsArray();
    $scope.VitalsShowArray.VitalId = 1;
    $scope.GetVitalsValuesStoringObj = function () {
        return {
            "RuleDetailId": 0,
            "InterventionTypeId": 5,
            "IntreventionTypeName": "Vitals",
            "CategoryId": "",
            "CategoryName": "",
            "ConditionId": 0,
            "ConditionName": "",
            "OrganizationValueId": 12,
            "ValueId": 0,
            "ValueName": "",
            "ValueCode": "RXNormId",
            "DeleteInd": "N",
            "ActiveInd": "Y",
            "RemoveFactor": "",
            "TemparetureFactor": "",
            "BGLFactor": "",
            "LanguageFactor": "",
            "WeightFactor": "",
            "RaceFactor": "",
            "EthnicityFactor": "",
            "VitalId": 1,
            "SecondValueName": "",
            "ConditionFactor":"",
            "secondConditionFactor":""
        };
    };
    $scope.GetDemograpicValuesStoringObj = function () {
        return {
            "RuleDetailId": 0,
            "InterventionTypeId": 1,
            "IntreventionTypeName": "Demographics",
            "CategoryId": "",
            "CategoryName": "",
            "ConditionId": 0,
            "ConditionName": "",
            "OrganizationValueId": 12,
            "ValueId": 0,
            "ValueName": "",
            "ValueCode": "RXNormId",
            "DeleteInd": "N",
            "ActiveInd": "Y",
            "RemoveFactor": "",
            "AgeFactor": "",
            "GenderFactor": "",
            "LanguageFactor": "",
            "DobFactor": "",
            "RaceFactor": "",
            "EthnicityFactor": "",
            "SelectedParameterId": 1,
        };
    };
    $scope.languageOptions = [
        { Id: 1, value: 'English' },
        { Id: 2, value: 'Spanish' },
        { Id: 3, value: 'French' },
        { Id: 4, value: 'Others'}
    ];
    $scope.genderOptions = [
        { Id: 1, value: 'Male' },
        { Id: 2, value: 'Female' },
        { Id: 3, value: 'Prefer not to tell' },
        { Id: 3, value: 'Unknown' },
    ];
    $scope.ageOptions = [
        { Id: 1, value: '<' },
        { Id: 2, value: '>' },
        { Id: 3, value: '=' },
        { Id: 4, value: '>=' },
        { Id: 5, value: '<=' },
        { Id: 6, value: 'between'}

    ];
    $scope.TempratureUnits = [
        { Id: 1, value: 'Fahrenheit ' },
        { Id: 2, value: 'Celsius' },
    ]
    $scope.BGLUnits = [
        { Id: 1, value: 'mg/dL' },
        { Id: 2, value: 'mmol/L' },
    ]
    $scope.WeightUnits = [
        { Id: 1, value: 'lb' },
        { Id: 2, value: 'kg' },
    ]
    $scope.HeightUnits = [
        { Id: 1, value: 'In' },
        { Id: 2, value: 'cm' },
    ]
    $scope.Conditions = [
        { ConditionId: 1, value: '<' },
        { ConditionId: 2, value: '>' },
        { ConditionId: 3, value: '=' },
        { ConditionId: 4, value: '>=' },
        { ConditionId: 5, value: '<=' }
    ]
    $scope.SaveTitle = 'ADD';
    $scope.settingDemograpicArray.SelectedParameterId = 1;
    $scope.ChangeValueBasedOnSelection = function (item, mainitem) {

        if (mainitem.AgeFactor !='') {
            mainitem.AgeFactor = '';
        }
        if (mainitem.GenderFactor != '') {
            mainitem.GenderFactor = '';
        }
        if (mainitem.RaceFactor != '') {
            mainitem.RaceFactor = '';
        }
        if (mainitem.LanguageFactor != '') {
            mainitem.LanguageFactor = '';
        }
        if (mainitem.EthnicityFactor != '') {
            mainitem.EthnicityFactor = '';
        }
        var count = 0;
        var FilterDemoGrapicFilterArray = $filter('filter')($scope.DemograpicViewAddingArray, { 'DeleteInd': 'N' }, true) || [];
        if (FilterDemoGrapicFilterArray.length > 1) {
            angular.forEach(FilterDemoGrapicFilterArray, function (sitem) {
                if (sitem.CategoryId.SelectedParameterId == item.SelectedParameterId) {
                    count = count + 1;
                }
            });
        }
        if (count>1) {
            alertify.error('the Demographics rule is already added ');
            mainitem.CategoryId = '';
            return false;
        }
        else {
            if (item.SelectedParameterId == 1) {
                mainitem.SelectedParameterId = 1;
            }
            else if (item.SelectedParameterId == 2) {
                mainitem.SelectedParameterId = 2;
            }
            else if (item.SelectedParameterId == 3) {
                mainitem.SelectedParameterId = 3;
            }
            else if (item.SelectedParameterId == 4) {
                mainitem.SelectedParameterId = 4;
            }
            else if (item.SelectedParameterId == 5) {
                mainitem.SelectedParameterId = 5;
            }
            else if (item.SelectedParameterId == 6) {
                mainitem.SelectedParameterId = 6;
            }
            else {
                console.log('checking')
            }
        }
    }
    $scope.getCdsPrimaryRuleArray = function () {
        var Array = [
            {
                "CdsSeletingRuleId": 1,
                "CdsRuleName": "Adding Chart"
            },
            {
                "CdsSeletingRuleId": 2,
                "CdsRuleName": "Viewing Chart"
            },
            {
                "CdsSeletingRuleId": 3,
                "CdsRuleName": "Modifying Chart"
            },
        ];
        return Array;
    }
    $scope.PrimaryRuleObj = function () {
        var obj = [
            {
                "InterventionTypeId": 1,
                "IntreventionTypeName": "Demographics",
            },
            {
                "InterventionTypeId": 2,
                "IntreventionTypeName": "Diagnosis",
            },
            {
                "InterventionTypeId": 3,
                "IntreventionTypeName": "Medications",
            },
            {
                "InterventionTypeId": 4,
                "IntreventionTypeName": "Allergies",
            },
            {
                "InterventionTypeId": 5,
                "IntreventionTypeName": "Vitals",
            },
            {
                "InterventionTypeId": 6,
                "IntreventionTypeName": "Lab",
            },
        ];
        return obj;
    }
    $scope.CdsPrimaryRuleObjArray = $scope.getCdsPrimaryRuleArray();
    $scope.DemograpicObjValue =
    {
        "DemograpicRuleName": "",
        "DemograpicRuleId": "",
        "DemograpicRuleCodition": "",
        "DemograpicRuleVlaue": ""
    };
    $scope.AllergiesObjValue =
    {
        "AllergiesRuleName": "",
        "AllergiesRuleNameStoreArray": []
    };
    $scope.DiagnosisObjValue =
    {
        "DiagnosisRuleName": "",
        "DiagnosisRuleNameStoreArray": []
    };
    $scope.MedicineGetObj =
    {
        "MedicationsRuleName": "",
        "MedicationsRuleNameStoreArray": []
    };
    $scope.LabObjValue =
    {
        "LabRuleName": "",
        "LabRuleNameStoreArray": []
    };
    $scope.SettingCdsTabs = {
        "SettingsCdsTab": '',
    };
    $scope.SettingCdsTabs.SettingsCdsTab = 'Demographics';
    $scope.switchCdsTab = function (type) {
        if (type == 'Demographics') {
            $scope.SettingCdsTabs.SettingsCdsTab = 'Demographics';
        }
        else if (type == 'Diagnosis') {
            $scope.SettingCdsTabs.SettingsCdsTab = 'Diagnosis';
        }
        else if (type == 'Medications') {
            $scope.SettingCdsTabs.SettingsCdsTab = 'Medications';
        }
        else if (type == 'Allergies') {
            $scope.SettingCdsTabs.SettingsCdsTab = 'Allergies';
        }
        else if (type == 'Vitals') {
            $scope.SettingCdsTabs.SettingsCdsTab = 'Vitals';
        }
        else if (type == 'Lab') {
            $scope.SettingCdsTabs.SettingsCdsTab = 'Lab';
        }
        else {
            console.log('checking')
        }
    }
    $scope.GetAllergyList = function (val) {
        var req = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || "",
            "GetAllIndicator": 1,
            "SearchText": val,
            "AllergyType": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "Type": '',
            "UserId": doctorinfo.doctorid,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParenthospitalId || null,
        };
        if (req.SearchText == "") {
            req.IsFrequent = "Y";
        }
        return eHnoteConditionsDataService.getListOfAllergies(req).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.onAllergySelect = function (object) {
        if (object!='') {
            var req = {
                "RcopiaAllergyId": object.RcopiaAllergyId || "",
                "AllergyName": object.BrandName || "",
                "RxnormID": object.RxnormID || "",
                "RxnormIDType": object.RxnormIDType || "",
                "NDCID": object.NDCID || "",
                "DrugGroupID": object.DrugGroupID || "",
                "GenericName": object.GenericName || "",
                "Form": object.Form || "",
                "Schedule": object.Schedule || "",
                "Strength": object.Strength || "",
                "RouteCode": object.RouteCode || "",
                "UserId": doctorinfo.doctorid,
                "OnsetDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a")
            }
        }
        eHnoteConditionsDataService.SearchandUpdateAllergyRcopiaData(req).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    var selectedobj = resp.data.rows[0];
                    if (selectedobj.AllergyId === '') {
                        selectedobj.AllergyName = '';
                        $scope.obj.SelectedAllergyItem = '';
                        return false;
                    }
                    if (selectedobj !== "") {
                        var requiredObj = {
                            "RuleDetailId": 0,
                            "InterventionTypeId": 4,
                            "IntreventionTypeName": "Allergies",
                            "CategoryId":"",
                            "CategoryName": "",
                            "ConditionId": "",
                            "ConditionName": "",
                            "OrganizationValueId":"",
                            "ValueId": selectedobj.AllergyId || "",
                            "ValueName": selectedobj.AllergyName || "",
                            "ValueCode": selectedobj.RouteCode,
                            "DeleteInd": "N",
                            "ActiveInd": "Y",
                        }
                       
                        var i = 0;
                        if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                            angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                angular.forEach(item.AllergiesObjArray, function (jitem) {
                                    if (jitem.ValueId === selectedobj.AllergyId && jitem.DeleteInd == 'N') {
                                        alertify.error('You have already entered this Allergy');
                                        i++;
                                    }
                                })
                            });
                        }
                        if (i==0) {
                            $scope.AllergiesObjValue.AllergiesRuleNameStoreArray.push(requiredObj);
                            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails != '') {
                                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                    item.AllergiesObjArray.push(requiredObj);
                                });
                            }
                        }
                       
                    }
                    $scope.AllergiesObjValue.AllergiesRuleName = '';
                }
            }
        });




        
    }
    $scope.addAllergy = function (allergy) {
        allergy = allergy || "";
        if (allergy == '') {
            return false;
        }
        var reqObj = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "AllergyId": 0,
            "AllergyName": allergy,
            "AllergyTypeId": 13,
            "Reaction": "",
            "DeleteInd": false,
            "ModifiedBy": $scope.DisplayName,
            "ModifiedDt": $scope.DisplayDate,
            "ParentOrganizationId": $scope.ParenthospitalId,
        };
        eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
            if (response.data.Status === "Success") {
                $scope.onAllergySelect(response.data.rows[0]);
            }
            if (response.Status === 'Failure') {
                alertify.error(response.data.Message);
            }
        });
    };
    $scope.RemoveAllergyItem = function (item, index) {
        if (item.RuleDetailId == 0) {
            $scope.AllergiesObjValue.AllergiesRuleNameStoreArray = $filter('filter')($scope.AllergiesObjValue.AllergiesRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            $scope.AllergiesObjValue.AllergiesRuleNameStoreArray.splice(index, 1);
        }
        else {
            item.DeleteInd = 'Y';
            //$scope.AllergiesObjValue.AllergiesRuleNameStoreArray = $filter('filter')($scope.AllergiesObjValue.AllergiesRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            //$scope.AllergiesObjValue.AllergiesRuleNameStoreArray[index].DeleteInd = 'Y';
        }
        if ($scope.GetSavingCdsMainObj.RuleData != '') {
            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                    if (item.AllergiesObjArray.length > 0) {
                        item.AllergiesObjArray[index].DeleteInd = 'Y';
                    }
                });
            }
        }
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
            "ParentOrganizationId": $scope.ParenthospitalId || null
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

    $scope.GetProblemsFromRcopia= function(val){
        var req = {
            "VendorName": "Appolo Pharmacy",
            "VendorPassword": "abc123",
            "searchText": val || "nexium",
            "codeType": "ICD10",
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
    $scope.onSelectDiagnosisVlaue = function (item) {


        var req = {
            "UserId": $scope.UserId||"",
            "OrganizationId": $scope.HospitalId||"",
            "ICD10Code": item.ICD10Code || "",
            "ICD10Description": item.ICD10Description || "",
            "SNOMEDConceptID": item.SnomedCode || "",
            "SNOMEDDescription": item.SnomedCodeDescription || "",
            "DiagnosisId": item.DiagnosisId || 0,
            "OrgDiagnosisId": item.OrganizationDiagnosisId || 0
        }
        eHnoteSettingsDataService.UpdateDiagnosisFromRcopia(req).then(function (response) {
            console.log(JSON.stringify(response));
            if (response.data.status === 'Success') {
                var valueId = response.data.DiagnosisId;
                var OrganizationValueId = response.data.OrgDiagnosisId;
                    var requiredObj = {
                        "RuleDetailId": 0,
                        "InterventionTypeId": 2,
                        "IntreventionTypeName": "Diagnosis",
                        "CategoryId": 0,
                        "CategoryName": "",
                        "ConditionId": 0,
                        "ConditionName": "",
                        "OrganizationValueId": OrganizationValueId|| "",
                        "ValueId": valueId || "",
                        "ValueName": item.ICD10Description || "",
                        "ValueCode": item.ICD10Code || "",
                        "DeleteInd": item.DeleteIndicator || "N",
                        "ActiveInd": "Y",
                }
                var i = 0;
                if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                  var filterdiagnosis = $filter("filter")($scope.GetSavingCdsMainObj.RuleData.RuleDetails[0].DiagnosisObjArray, { "ValueCode": item.ICD10Code }, true);
                  if (filterdiagnosis.length > 0) {
                            i++;
                   }
                }
               
                if (i == 0) {
                    $scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray.push(requiredObj);
                    if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails != '') {
                        angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                            item.DiagnosisObjArray.push(requiredObj);
                        });
                    }
                }
                else {
                    alertify.error('the Diagnosis is already added.');
                }
                $scope.DiagnosisObjValue.DiagnosisRuleName = '';
            }
        });
    }
    $scope.RemoveDiagnosisItem = function (item, index) {

        if (item.RuleDetailId == 0) {
            $scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray = $filter('filter')($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            $scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray.splice(index, 1);
        }
        else {
            item.DeleteInd = 'Y';
            //$scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray = $filter('filter')($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            //$scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray[index].DeleteInd = 'Y';
        }
        if ($scope.GetSavingCdsMainObj.RuleData != '') {
            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                    if (item.DiagnosisObjArray.length > 0) {
                        item.DiagnosisObjArray[index].DeleteInd = 'Y';
                    }
                });
            }
        }
    }
    $scope.GetOrganizationMedicationrulelist = function (val) {

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
    $scope.MedicationDetailsSelecting = function (obj) {


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
        eHnoteDiagnosisDataServices.UpdateFirstBankMasterDrugDetails(mparams).then(function (response) {

            console.log(JSON.stringify(response));
            if (response.data.status === 'Success') {
                var MedicalValueArray = response.data || "";
                    var requiredObj = {
                        "RuleDetailId": 0,
                        "InterventionTypeId": 3,
                        "IntreventionTypeName": "Medications",
                        "CategoryId": 0,
                        "CategoryName": "",
                        "ConditionId": 0,
                        "ConditionName": "",
                        "OrganizationValueId": MedicalValueArray.SpecializationId || "",
                        "ValueId": MedicalValueArray.MedicineId || "",
                        "ValueName": MedicalValueArray.MedicineName || "",
                        "ValueCode":"",
                        "DeleteInd": MedicalValueArray.DeleteInd || "N",
                        "ActiveInd": "Y",
                }
                var i = 0;
                if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        angular.forEach(item.MedicationsObjArray, function (jitem) {
                            if (jitem.ValueId === MedicalValueArray.MedicineId && jitem.DeleteInd == 'N') {
                                alertify.error('You have already entered this medication');
                                i++;
                            }
                        })
                    });
                }
                if (i==0) {
                    $scope.MedicineGetObj.MedicationsRuleNameStoreArray.push(requiredObj);
                    if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails != '') {
                        angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                            item.MedicationsObjArray.push(requiredObj);
                        });
                    }
                }
                $scope.MedicineGetObj.MedicationsRuleName = '';
            }
        });



       
    }
    $scope.RemoveMedicineItem = function (item, index) {
        if (item.RuleDetailId == 0) {
            $scope.MedicineGetObj.MedicationsRuleNameStoreArray = $filter('filter')($scope.MedicineGetObj.MedicationsRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            $scope.MedicineGetObj.MedicationsRuleNameStoreArray.splice(index, 1);
        }
        else {
            item.DeleteInd = 'Y';
            //$scope.MedicineGetObj.MedicationsRuleNameStoreArray = $filter('filter')($scope.MedicineGetObj.MedicationsRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            //$scope.MedicineGetObj.MedicationsRuleNameStoreArray[index].DeleteInd = 'Y';
        }
        if ($scope.GetSavingCdsMainObj.RuleData != '') {
            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                    if (item.MedicationsObjArray.length > 0) {
                        item.MedicationsObjArray[index].DeleteInd = 'Y';
                    }
                });
            }
        }
    }
    $scope.IsShowCdsAddingData = function () {
        $scope.SaveTitle = 'ADD';
        $scope.SettingCdsshowingObj.IsShowDemograpicValue = true;
        let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
        if ($scope.DemograpicViewAddingArray.length == 0) {
            $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
        }
        let GetVitalsValuesStoringObj = angular.copy($scope.GetVitalsValuesStoringObj());
        if ($scope.VitalsViewAddingArray.length==0) {
            $scope.VitalsViewAddingArray.push(GetVitalsValuesStoringObj);
        }
    }
    $scope.AddingNewDemograpicValue = function (item) {
        if (item.SelectedParameterId == 1) {
            if (item.CategoryId != "" && item.ValueName != '' && item.AgeFactor!='') {
                let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
            }
            else {
                if (item.AgeFactor == '') {
                    alertify.error('Please Enter Demographics Condition')
                }
                else if (item.ValueName == '') {
                    alertify.error('Please Enter Demographics Value')
                }
                else {
                    console.log('checking');
                }
            }
        }
        if (item.SelectedParameterId == 2) {
            if (item.CategoryId != "" && item.GenderFactor != '') {
                let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
            }
            else {
                alertify.error('Please Enter Demographics Value')
            }
        }
        if (item.SelectedParameterId == 3) {
            if (item.CategoryId != "" && item.LanguageFactor != '') {
                let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
            }
            else {
                alertify.error('Please Enter Demographics Value')
            }
        }
        if (item.SelectedParameterId == 5) {
            if (item.CategoryId != "" && item.RaceFactor != '') {
                let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
            }
            else {
                alertify.error('Please Enter Demographics Value')
            }
        }
        if (item.SelectedParameterId == 6) {
            if (item.CategoryId != "" && item.EthnicityFactor != '') {
                let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
            }
            else {
                alertify.error('Please Enter Demographics Value')
            }
        }
    }
    $scope.RemoveDemograpicValue = function (item, index) {
        if (item.RuleDetailId == 0) {
            $scope.DemograpicViewAddingArray = $filter('filter')($scope.DemograpicViewAddingArray, { 'DeleteInd': "N" }, true) || [];
            $scope.DemograpicViewAddingArray.splice(index, 1);
        }
        else {
            item.DeleteInd = 'Y';
            //$scope.DemograpicViewAddingArray = $filter('filter')($scope.DemograpicViewAddingArray, { 'DeleteInd': "N" }, true) || [];
            //$scope.DemograpicViewAddingArray[index].DeleteInd = 'Y';
        }
        //if ($scope.GetSavingCdsMainObj.RuleData != '') {
        //    if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
        //        angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (saitem) {
        //            if (saitem.DemograpicObjArray.length>0) {
        //                saitem.DemograpicObjArray[index].DeleteInd = 'Y';
        //            }
        //        });
        //    }
        //}
    }
    $scope.changeRuleType = function (item) {
        $scope.GetSavingCdsMainObj.RuleData.RuleName = item.CdsRuleName || "";
        $scope.GetSavingCdsMainObj.RuleData.RuleValueId = item.CdsSeletingRuleId || "";
    }
    $scope.IsHideShowCdsDataViewClick = function (item) {
        item.IsShowGetCdaDataOInd = !item.IsShowGetCdaDataOInd;
    }
    $scope.getCDAIntreventionData = function () {
        var OrganizationId = $scope.HospitalId;
        if ($scope.GetSavingCdsMainObj.CDAIntreventionName != '') {
            var CDAIntreventionName = $scope.GetSavingCdsMainObj.CDAIntreventionName;
        }
        var pagenumber = $scope.GetSavingCdsMainObj.PageNationsValue;
        var requestObj = {
            "OrganizationId": OrganizationId || "",
            "PageSize": 10,
            "PageNumber": pagenumber || 1,
            "SearchText": "",
            "IsCdsUseActiveInd":false
        }
        eHnoteSettingsDataService.GetOrganizationCDAIntreventions(requestObj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.GetCDAinventionsDataArray = [];
                if (resp.data.rows.length > 0) {
                    $scope.GetCDAinventionsDataArray = resp.data.rows || "";
                    $scope.GetSavingCdsMainObjTotalItem = resp.data.Count||10;
                }
            }
        }, function (err) {
            console.log(err);
        });
    }
    $scope.SavingCdsSettingLevel = function () {
        if ($scope.GetSavingCdsMainObj.CDAIntreventionName == '') {
            alertify.error('Select CDS Intervention Name');
            return false;
        }
        if ($scope.GetSavingCdsMainObj.CDAIntreventionRule == '') {
            alertify.error('Select Rules');
            return false;
        }
        $scope.DemoAge = [];
        $scope.DemoGender = [];
        $scope.DemoLanguage = [];
        $scope.DemoRace = [];
        $scope.DemoEnthencity = [];
        $scope.FilterDemograpicViewAddingArray = [];
        $scope.FilterDemograpicViewAddingArray = $filter('filter')($scope.DemograpicViewAddingArray, { 'DeleteInd': 'N' }, true)||[];
        if ($scope.FilterDemograpicViewAddingArray.length==1) {
            if ($scope.FilterDemograpicViewAddingArray[0].CategoryId=='') {
                console.log('checking');
            }
            else
            {
                if ($scope.FilterDemograpicViewAddingArray[0].SelectedParameterId==1) {
                    if ($scope.FilterDemograpicViewAddingArray[0].ValueName == '' || $scope.DemograpicViewAddingArray[0].AgeFactor == '') {
                        alertify.error('Please Enter the  Demograpic Fields');
                        return false;
                    }
                    if ($scope.FilterDemograpicViewAddingArray[0].ValueName != '') {
                        var Agearr = $scope.FilterDemograpicViewAddingArray[0].ValueName.split(',');
                        if (Number(Agearr[0]) > Number(Agearr[1])){
                            alertify.error('Please Enter the Age in between Values lesser Value To Greater age');
                            return false;
                        }
                    }
                }
                if ($scope.FilterDemograpicViewAddingArray[0].SelectedParameterId == 2) {
                    if ($scope.FilterDemograpicViewAddingArray[0].GenderFactor == '') {
                        alertify.error('Please Enter the  Demograpic Fields');
                        return false;
                    }
                }
                if ($scope.FilterDemograpicViewAddingArray[0].SelectedParameterId == 3) {
                    if ($scope.DemograpicViewAddingArray[0].LanguageFactor == '') {
                        alertify.error('Please Enter the  Demograpic Fields');
                        return false;
                    }
                }
                if ($scope.FilterDemograpicViewAddingArray[0].SelectedParameterId == 5) {
                    if ($scope.DemograpicViewAddingArray[0].RaceFactor == '') {
                        alertify.error('Please Enter the  Demograpic Fields');
                        return false;
                    }
                }
                if ($scope.FilterDemograpicViewAddingArray[0].SelectedParameterId == 6) {
                    if ($scope.DemograpicViewAddingArray[0].EthnicityFactor == '') {
                        alertify.error('Please Enter the  Demograpic Fields');
                        return false;
                    }
                }
            }
        }
        if ($scope.FilterDemograpicViewAddingArray.length > 1) {
            $scope.FilterDemograpicViewAddingArray = $filter("filter")($scope.FilterDemograpicViewAddingArray, function (assitem, index) { return assitem.CategoryId !=='' },true)||[];
            $scope.DemoAge = $filter('filter')($scope.FilterDemograpicViewAddingArray, { 'SelectedParameterId': 1 }, true) || [];
            $scope.DemoGender = $filter('filter')($scope.FilterDemograpicViewAddingArray, { 'SelectedParameterId': 2 }, true) || [];
            $scope.DemoLanguage = $filter('filter')($scope.FilterDemograpicViewAddingArray, { 'SelectedParameterId': 3 }, true) || [];
            $scope.DemoRace = $filter('filter')($scope.FilterDemograpicViewAddingArray, { 'SelectedParameterId': 5 }, true) || [];
            $scope.DemoEnthencity = $filter('filter')($scope.FilterDemograpicViewAddingArray, { 'SelectedParameterId': 6 }, true) || [];
        }
        if ($scope.DemoAge.length>0) {
            if ($scope.DemoAge[0].CategoryId == "" || $scope.DemoAge[0].ValueName == '' || $scope.DemoAge[0].AgeFactor == '' || $scope.DemoAge[0].AgeFactor==null) {
                alertify.error('Please Enter the  Demograpic Fields');
                return false;
            }
        }
        if ($scope.DemoGender.length > 0) {
            if ($scope.DemoGender[0].CategoryId == "" || $scope.DemoGender[0].GenderFactor == '' || $scope.DemoGender[0].GenderFactor == null) {
                alertify.error('Please Enter the  Demograpic Fields');
                return false;
            }
        }
        if ($scope.DemoLanguage.length > 0) {
            if ($scope.DemoLanguage[0].CategoryId == "" || $scope.DemoLanguage[0].LanguageFactor == '' || $scope.DemoLanguage[0].LanguageFactor == null) {
                alertify.error('Please Enter the  Demograpic Fields');
                return false;
            }
        }
        if ($scope.DemoRace.length > 0) {
            if ($scope.DemoRace[0].CategoryId == "" || $scope.DemoRace[0].RaceFactor == '' || $scope.DemoRace[0].RaceFactor == null) {
                alertify.error('Please Enter the  Demograpic Fields');
                return false;
            }
        }
        if ($scope.DemoEnthencity.length > 0) {
            if ($scope.DemoEnthencity[0].CategoryId == "" || $scope.DemoEnthencity[0].EthnicityFactor == '' || $scope.DemoRace[0].EthnicityFactor == null) {
                alertify.error('Please Enter the  Demograpic Fields');
                return false;
            }
        }
        $scope.FilterVitalsViewAddingArray = [];
        $scope.FilterVitalsViewAddingArray = $filter('filter')($scope.VitalsViewAddingArray, { 'DeleteInd': 'N' }, true);
        if ($scope.FilterVitalsViewAddingArray.length == 1) {
            if ($scope.FilterVitalsViewAddingArray[0].CategoryId == '') {
                console.log('checking');
            }
            else {
                if ($scope.FilterVitalsViewAddingArray[0].ValueName == '' || $scope.FilterVitalsViewAddingArray[0].ConditionFactor == '' || $scope.FilterVitalsViewAddingArray[0].ConditionFactor==null) {
                    alertify.error('Please Enter  Fields');
                    return false;
                }
            }
        }
        if ($scope.FilterVitalsViewAddingArray.length > 1) {
            var count = 0;
            
            angular.forEach($scope.FilterVitalsViewAddingArray, function (Vitem) {
                if (Vitem.CategoryId!='') {
                    if (Vitem.ValueName == '' || Vitem.CategoryId == '' || Vitem.ConditionFactor == '' || Vitem.ConditionFactor == null) {
                        count++;
                    }
                }
            });
            if (count>0) {
                alertify.error('Please Enter  Fields');
                return false;
            }
        }
        var UserId = $scope.UserId;
        var OrganizationId = $scope.HospitalId;
        if ($scope.GetSavingCdsMainObj.CDAIntreventionRule != '') {
            var chartId = $scope.GetSavingCdsMainObj.CDAIntreventionRule;
        }
        if ($scope.GetSavingCdsMainObj.CDAIntreventionName != '') {
            var CDAIntreventionName = $scope.GetSavingCdsMainObj.CDAIntreventionName;
        }
        if ($scope.GetSavingCdsMainObj.RuleData.RuleName != "") {
            var RuleName = $scope.GetSavingCdsMainObj.RuleData.RuleName;
        }
        if ($scope.GetSavingCdsMainObj.RuleData.RuleName != "") {
            var RuleValueId = $scope.GetSavingCdsMainObj.RuleData.RuleValueId;
        }
        else {
            if (chartId != '') {
                RuleValueId = chartId.CdsSeletingRuleId || 0;
                RuleName = chartId.CdsRuleName || "";
            }
        }
        if ($scope.GetSavingCdsMainObj.IsCdsDataEditCaseInd != '') {
            var IsEditCaseInd = $scope.GetSavingCdsMainObj.IsCdsDataEditCaseInd || false;
        }
        if ($scope.GetSavingCdsMainObj.CDAIntreventionId != '') {
            var CDAIntreventionId = $scope.GetSavingCdsMainObj.CDAIntreventionId;
        }
        if ($scope.GetSavingCdsMainObj.EditTimeRuleId != '') {
            var RuleId = $scope.GetSavingCdsMainObj.EditTimeRuleId;
        }
        if ($scope.GetSavingCdsMainObj.ActiveInd == false) {
            var ActiveInd = 'N';
        }
        else {
            var ActiveInd = 'Y';
        }
        if (IsEditCaseInd) {
            if ($scope.GetSavingCdsMainObj.RuleData!='') {
                if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (kitem) {
                        kitem.DemograpicObjArray = [];
                        kitem.VitalsObjArray = [];
                        kitem.DiagnosisObjArray = [];
                        kitem.MedicationsObjArray = [];
                        kitem.AllergiesObjArray = [];
                        kitem.LabObjArray = [];
                    })
                }
            }
            if ($scope.DemograpicViewAddingArray.length > 0) {
                     angular.forEach($scope.DemograpicViewAddingArray, function (mainitem) {
                         if (mainitem.CategoryId == "") {
                             return false;
                         } else {
                             var InterventionTypeId = mainitem.InterventionTypeId;
                             var IntreventionTypeName = mainitem.IntreventionTypeName;
                             var CategoryId = mainitem.CategoryId.SelectedParameterId;
                             var CategoryName = mainitem.CategoryId.ParameterName;
                             var OrganizationValueId = mainitem.OrganizationValueId;
                             if (CategoryId == 1) {
                                 var ConditionId = mainitem.AgeFactor.Id;
                                 var ConditionName = mainitem.AgeFactor.value;
                                 var ValueId = mainitem.AgeFactor.Id;
                                 var ValueName = mainitem.ValueName;
                             }
                             else if (CategoryId == 2) {
                                 var ValueId = mainitem.GenderFactor.Id;
                                 var ValueName = mainitem.GenderFactor.value;
                             }
                             else if (CategoryId == 3) {
                                 var ValueId = mainitem.LanguageFactor.Id;
                                 var ValueName = mainitem.LanguageFactor.value;
                             }
                             else if (CategoryId == 4) {
                                 var ValueName = mainitem.DobFactor;
                                 var ValueId = 1;
                             }
                             else if (CategoryId == 5) {
                                 var ValueName = mainitem.RaceFactor.Value || "";
                                 var ValueId = mainitem.RaceFactor.DropdownId || 0;
                                 var ConditionName =  "";
                             }
                             else if (CategoryId == 6) {
                                 var ValueName = mainitem.EthnicityFactor.Value;
                                 var ValueId = mainitem.EthnicityFactor.DropdownId;
                                 var ConditionName = "";
                             }
                             else {
                                 console.log('checking')
                             }
                             var requiredObj = {
                                 "RuleDetailId": mainitem.RuleDetailId||0,
                                 "InterventionTypeId": InterventionTypeId || 0,
                                 "IntreventionTypeName": IntreventionTypeName || "",
                                 "CategoryId": CategoryId || 0,
                                 "CategoryName": CategoryName || "",
                                 "ConditionId": ConditionId || 0,
                                 "ConditionName": ConditionName || "",
                                 "OrganizationValueId": OrganizationValueId || "",
                                 "ValueId": ValueId || 0,
                                 "ValueName": ValueName || "",
                                 "ValueCode": "",
                                 "DeleteInd": mainitem.DeleteInd||"N",
                                 "ActiveInd": ActiveInd || 'N',
                             }
                             $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                             if ($scope.GetSavingCdsMainObj.RuleData != '') {
                                 angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                     if (requiredObj.ValueId == 0) {
                                         item.DemograpicObjArray = [];
                                     }
                                     else {
                                         item.DemograpicObjArray.push(requiredObj);
                                     }
                                 });

                             }


                         }
                     })
            }

            if ($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.DiagnosisObjArray = angular.copy($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray);
                    });
                }
            }
            if ($scope.MedicineGetObj.MedicationsRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.MedicationsObjArray = angular.copy($scope.MedicineGetObj.MedicationsRuleNameStoreArray);
                    });
                }
            }
            if ($scope.AllergiesObjValue.AllergiesRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.AllergiesObjArray = angular.copy($scope.AllergiesObjValue.AllergiesRuleNameStoreArray);
                    });
                }
            }
            if ($scope.VitalsViewAddingArray.length > 0) {
                angular.forEach($scope.VitalsViewAddingArray, function (mainitem) {
                    var InterventionTypeId = mainitem.InterventionTypeId;
                    var IntreventionTypeName = mainitem.IntreventionTypeName;
                    var CategoryId = mainitem.CategoryId.VitalId;
                    var CategoryName = mainitem.CategoryId.VitalName;
                    var OrganizationValueId = mainitem.OrganizationValueId;
                    if (CategoryId == 11) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId;
                        var ConditionName = mainitem.ConditionFactor.value;
                        var ValueName = mainitem.ValueName;
                        var VitalValueUnitId = mainitem.TemparetureFactor.Id || "";
                        var VitalValueUnit = mainitem.TemparetureFactor.value || "";
                    }
                    else if (CategoryId == 12) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 4) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.SecondValueName || ""; 
                        var VitalBpValueConditonId = mainitem.secondConditionFactor.ConditionId || "";
                        var VitalBpValueCodition = mainitem.secondConditionFactor.value || "";
                        var VitalBpValue = mainitem.ValueName || "";

                    }
                    else if (CategoryId == 14) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 15) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 40) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 5) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.BGLFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                        var VitalValueUnitId = mainitem.BGLFactor.Id || "";
                        var VitalValueUnit = mainitem.BGLFactor.value || "";
                    }
                    else if (CategoryId == 13) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 1) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.WeightFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                        var VitalValueUnitId = mainitem.WeightFactor.Id || "";
                        var VitalValueUnit = mainitem.WeightFactor.value || "";
                    }
                    else if (CategoryId == 2) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.HeightFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                        var VitalValueUnitId = mainitem.HeightFactor.Id || "";
                        var VitalValueUnit = mainitem.HeightFactor.value || "";

                    }
                    else if (CategoryId == 17) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 37) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else {
                        console.log('checking');
                    }
                    var VitalObj = {
                        "RuleDetailId": mainitem.RuleDetailId||0,
                        "InterventionTypeId": InterventionTypeId || 0,
                        "IntreventionTypeName": IntreventionTypeName || "",
                        "CategoryId": CategoryId || 0,
                        "CategoryName": CategoryName || "",
                        "ConditionId": ConditionId || 0,
                        "ConditionName": ConditionName || "",
                        "OrganizationValueId": OrganizationValueId || "",
                        "ValueId": ValueId || 0,
                        "ValueName": ValueName || "",
                        "ValueCode": "",
                        "DeleteInd": mainitem.DeleteInd || "N",
                        "ActiveInd": ActiveInd || 'N',
                        "VitalValueUnit": VitalValueUnit || "",
                        "VitalValueUnitId": VitalValueUnitId || 0,
                        "VitalBpValueConditonId": VitalBpValueConditonId || 0,
                        "VitalBpValueCodition": VitalBpValueCodition || "",
                        "VitalBpValue": VitalBpValue||"",
                    }
                    if ($scope.GetSavingCdsMainObj.RuleData != '') {
                        if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails != '') {
                            if (VitalObj.CategoryId != 0) {
                                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                    item.VitalsObjArray.push(VitalObj);
                                });
                            }
                            else {
                                return;
                            }
                        }
                    }
                })
            }
            if ($scope.LabObjValue.LabRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.LabObjArray = angular.copy($scope.LabObjValue.LabRuleNameStoreArray);
                    });
                }
            }
            var RequestSampleArray = [];
            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                    if (item.DemograpicObjArray.length > 0) {
                        angular.forEach(item.DemograpicObjArray, function (ditem) {
                            RequestSampleArray.push(ditem);
                        });
                    };
                    if (item.DiagnosisObjArray.length > 0) {
                        angular.forEach(item.DiagnosisObjArray, function (ditem) {
                            RequestSampleArray.push(ditem);
                        });
                    };
                    if (item.MedicationsObjArray.length > 0) {
                        angular.forEach(item.MedicationsObjArray, function (mitem) {
                            RequestSampleArray.push(mitem);
                        });
                    }
                    if (item.AllergiesObjArray.length > 0) {
                        angular.forEach(item.AllergiesObjArray, function (Aitem) {
                            RequestSampleArray.push(Aitem);
                        });
                    }
                    if (item.VitalsObjArray.length > 0) {
                        angular.forEach(item.VitalsObjArray, function (Aitem) {
                            if (Aitem.CategoryId == 0 || Aitem.CategoryId == "") {
                                return;
                            }
                            else {
                                RequestSampleArray.push(Aitem);
                            }
                        });
                    }
                    if (item.LabObjArray.length > 0) {
                        angular.forEach(item.LabObjArray, function (Aitem) {
                            RequestSampleArray.push(Aitem);
                        });
                    }
                });
            }
        }
        else {
            if ($scope.GetSavingCdsMainObj.RuleData != '') {
                if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (kitem) {
                        kitem.DemograpicObjArray = [];
                        kitem.VitalsObjArray = [];
                        kitem.DiagnosisObjArray = [];
                        kitem.MedicationsObjArray = [];
                        kitem.AllergiesObjArray = [];
                    })
                }
            }
            if ($scope.DemograpicViewAddingArray.length > 0) {
                angular.forEach($scope.DemograpicViewAddingArray, function (mainitem) {
                    if (mainitem.CategoryId == "") {
                        return false;
                    } else {
                        var InterventionTypeId = mainitem.InterventionTypeId;
                        var IntreventionTypeName = mainitem.IntreventionTypeName;
                        var CategoryId = mainitem.CategoryId.SelectedParameterId;
                        var CategoryName = mainitem.CategoryId.ParameterName;
                        var OrganizationValueId = mainitem.OrganizationValueId;
                        if (CategoryId == 1) {
                            var ConditionId = mainitem.AgeFactor.Id;
                            var ConditionName = mainitem.AgeFactor.value;
                            var ValueId = mainitem.AgeFactor.Id;
                            var ValueName = mainitem.ValueName;
                        }
                        else if (CategoryId == 2) {
                            var ValueId = mainitem.GenderFactor.Id;
                            var ValueName = mainitem.GenderFactor.value;
                        }
                        else if (CategoryId == 3) {
                            var ValueId = mainitem.LanguageFactor.Id;
                            var ValueName = mainitem.LanguageFactor.value;
                        }
                        else if (CategoryId == 4) {
                            var ValueName = mainitem.DobFactor;
                            var ValueId = 1;
                        }
                        else if (CategoryId == 5) {
                            var ValueName = mainitem.RaceFactor.Value || "";
                            var ValueId = mainitem.RaceFactor.DropdownId || 0;
                            var ConditionName = "";
                        }
                        else if (CategoryId == 6) {
                            var ValueName = mainitem.EthnicityFactor.Value;
                            var ValueId = mainitem.EthnicityFactor.DropdownId;
                            var ConditionName = "";
                        }
                        else {
                            console.log('checking')
                        }


                        var requiredObj = {
                            "RuleDetailId": 0,
                            "InterventionTypeId": InterventionTypeId || 0,
                            "IntreventionTypeName": IntreventionTypeName || "",
                            "CategoryId": CategoryId || 0,
                            "CategoryName": CategoryName || "",
                            "ConditionId": ConditionId || 0,
                            "ConditionName": ConditionName || "",
                            "OrganizationValueId": OrganizationValueId || "",
                            "ValueId": ValueId || 0,
                            "ValueName": ValueName || "",
                            "ValueCode": "",
                            "DeleteInd": "N",
                            "ActiveInd": ActiveInd || 'N',
                        }

                        if ($scope.GetSavingCdsMainObj.RuleData != '') {
                            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails != '') {
                                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                    if (requiredObj.ValueId == 0) {
                                        item.DemograpicObjArray = [];
                                    }
                                    else {

                                        item.DemograpicObjArray.push(requiredObj);
                                    }
                                });
                            }
                        }
                    }
                })
            }
            if ($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.DiagnosisObjArray = angular.copy($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray);
                    });
                }
            }
            if ($scope.MedicineGetObj.MedicationsRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.MedicationsObjArray = angular.copy($scope.MedicineGetObj.MedicationsRuleNameStoreArray);
                    });
                }
            }
            if ($scope.AllergiesObjValue.AllergiesRuleNameStoreArray.length > 0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.AllergiesObjArray = angular.copy($scope.AllergiesObjValue.AllergiesRuleNameStoreArray);
                    });
                }
            }
            if ($scope.LabObjValue.LabRuleNameStoreArray.length>0) {
                if ($scope.GetSavingCdsMainObj.RuleData != '') {
                    $scope.GetSavingCdsMainObj.RuleData.RuleDetails = $scope.GetSavingCdsMainObj.RuleData.RuleDetails || [];
                    angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                        item.LabObjArray = angular.copy($scope.LabObjValue.LabRuleNameStoreArray);
                    });
                }
            }
            if ($scope.VitalsViewAddingArray.length > 0) {
                angular.forEach($scope.VitalsViewAddingArray, function (mainitem) {
                    var InterventionTypeId = mainitem.InterventionTypeId;
                    var IntreventionTypeName = mainitem.IntreventionTypeName;
                    var CategoryId = mainitem.CategoryId.VitalId;
                    var CategoryName = mainitem.CategoryId.VitalName;
                    var OrganizationValueId = mainitem.OrganizationValueId;
                    if (CategoryId == 11) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId;
                        var ConditionName = mainitem.ConditionFactor.value;
                        var ValueName = mainitem.ValueName;
                        var VitalValueUnitId = mainitem.TemparetureFactor.Id || "";
                        var VitalValueUnit = mainitem.TemparetureFactor.value || "";
                    }
                    else if (CategoryId == 12) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 4) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.ConditionId || "";
                        var ValueName = mainitem.SecondValueName || "";
                        var VitalBpValueConditonId = mainitem.secondConditionFactor.ConditionId || "";
                        var VitalBpValueCodition = mainitem.secondConditionFactor.value || "";
                        var VitalBpValue = mainitem.ValueName || "";

                    }
                    else if (CategoryId == 14) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 15) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 40) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 5) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.BGLFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                        var VitalValueUnitId = mainitem.BGLFactor.Id || "";
                        var VitalValueUnit = mainitem.BGLFactor.value || "";
                    }
                    else if (CategoryId == 13) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 1) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.WeightFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                        var VitalValueUnitId = mainitem.WeightFactor.Id || "";
                        var VitalValueUnit = mainitem.WeightFactor.value || "";
                    }
                    else if (CategoryId == 2) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.HeightFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                        var VitalValueUnitId = mainitem.HeightFactor.Id || "";
                        var VitalValueUnit = mainitem.HeightFactor.value || "";

                    }
                    else if (CategoryId == 17) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else if (CategoryId == 37) {
                        var ConditionId = mainitem.ConditionFactor.ConditionId || "";
                        var ConditionName = mainitem.ConditionFactor.value || "";
                        var ValueId = mainitem.ConditionFactor.Id || "";
                        var ValueName = mainitem.ValueName || "";
                    }
                    else {
                        console.log('checking');
                    }
                    var VitalObj = {
                        "RuleDetailId": 0,
                        "InterventionTypeId": InterventionTypeId || 0,
                        "IntreventionTypeName": IntreventionTypeName || "",
                        "CategoryId": CategoryId || 0,
                        "CategoryName": CategoryName || "",
                        "ConditionId": ConditionId || 0,
                        "ConditionName": ConditionName || "",
                        "OrganizationValueId": OrganizationValueId || "",
                        "ValueId": ValueId || 0,
                        "ValueName": ValueName || "",
                        "ValueCode": "",
                        "DeleteInd": "N",
                        "ActiveInd": ActiveInd || 'N',
                        "VitalValueUnit": VitalValueUnit || "",
                        "VitalValueUnitId": VitalValueUnitId || 0,
                        "VitalBpValueConditonId": VitalBpValueConditonId||0,
                        "VitalBpValueCodition": VitalBpValueCodition||"",
                        "VitalBpValue": VitalBpValue||"",
                    }
                    if ($scope.GetSavingCdsMainObj.RuleData != '') {
                        if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails != '') {
                            if (VitalObj.CategoryId != 0) {
                                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                    item.VitalsObjArray.push(VitalObj);
                                });
                            }
                            else {
                                return;
                            }

                        }
                    }


                })
            }
            var RequestSampleArray = [];
            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                    if (item.DemograpicObjArray.length > 0) {
                        angular.forEach(item.DemograpicObjArray, function (ditem) {
                            RequestSampleArray.push(ditem);
                        });
                    };
                    if (item.DiagnosisObjArray.length > 0) {
                        angular.forEach(item.DiagnosisObjArray, function (ditem) {
                            RequestSampleArray.push(ditem);
                        });
                    };
                    if (item.MedicationsObjArray.length > 0) {
                        angular.forEach(item.MedicationsObjArray, function (mitem) {
                            RequestSampleArray.push(mitem);
                        });
                    }
                    if (item.AllergiesObjArray.length > 0) {
                        angular.forEach(item.AllergiesObjArray, function (Aitem) {
                            RequestSampleArray.push(Aitem);
                        });
                    }
                    if (item.VitalsObjArray.length > 0) {
                        angular.forEach(item.VitalsObjArray, function (Aitem) {
                            if (Aitem.CategoryId == 0 || Aitem.CategoryId == "") {
                                return;
                            }
                            else {
                                RequestSampleArray.push(Aitem);
                            }
                        });
                    }
                    if (item.LabObjArray.length > 0) {
                        angular.forEach(item.LabObjArray, function (Aitem) {
                            RequestSampleArray.push(Aitem);
                        });
                    }
                });
            }
        }
        if (IsEditCaseInd) {
            var requestObj =
            {
                "UserId": UserId || '',
                "OrganizationId": OrganizationId || "",
                "CDAIntreventionId": CDAIntreventionId,
                "CDAIntreventionName": CDAIntreventionName || "",
                "DeleteInd": "N",
                "ActiveInd": ActiveInd || 'N',
                "IsCdsUseActiveInd":true,
                "RuleData": {
                    "RuleId": RuleId||0,
                    "RuleValueId": RuleValueId || 0,
                    "RuleName": RuleName || "",
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "RuleDetails": RequestSampleArray || [],
                }
            }
        } else {
            var requestObj =
            {
                "UserId": UserId || '',
                "OrganizationId": OrganizationId || "",
                "CDAIntreventionId": 0,
                "CDAIntreventionName": CDAIntreventionName || "",
                "DeleteInd": "N",
                "ActiveInd": ActiveInd || 'N',
                "IsCdsUseActiveInd": true,
                "RuleData": {
                    "RuleId": 0,
                    "RuleValueId": RuleValueId || 0,
                    "RuleName": RuleName || "",
                    "DeleteInd": "N",
                    "ActiveInd": ActiveInd || 'N',
                    "RuleDetails": RequestSampleArray || [],
                }
            }
        }
        eHnoteSettingsDataService.AddUpdateOrganizationCDsIntreventions(requestObj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.getCDAIntreventionData();
                alertify.success("Successfully Added");
                $scope.GetSavingCdsMainObj.IsCdsDataEditCaseInd = false;
                $scope.SettingCdsshowingObj.IsShowDemograpicValue = false;
                $scope.ClearCdsEnterData();
            }
        }, function (err) {
            console.log(err);
        });
    }
    $scope.CdspageChanged = function (PageVlaue) {
        $scope.GetSavingCdsMainObj.PageNationsValue = PageVlaue;
        $scope.getCDAIntreventionData();
    }
    $scope.getCDAIntreventionData();
    $scope.getiingMasterData = function () {
        eHnoteSettingsDataService.GetPatientRelatedMasterData().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.GetCDAinventionsDataArray = [];
                if (resp.data.rows.length > 0) {
                    $scope.PatientEthnicityList = resp.data.PatientEthnicity;
                }
            }
        });
    }
    $scope.Init = function () {
        $scope.PatientEthnicityList = [];
        eHnoteSettingsDataService.GetPatientRelatedMasterData().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.PatientEthnicityList = resp.data.PatientEthnicity;
                if ($scope.PatientEthnicityList.length > 0) {
                    angular.forEach($scope.PatientEthnicityList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }
                $scope.PatientRaceList = resp.data.PatientRace;
                if ($scope.PatientRaceList.length > 0) {
                    angular.forEach($scope.PatientRaceList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    $scope.Init();
    $scope.RemoveCdsItemSettTing = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            if (item != '') {
                item.DeleteInd = 'Y';
            }
            eHnoteSettingsDataService.AddUpdateOrganizationCDsIntreventions(item).then(function (resp) {
                if (resp.data.Status == "Success") {
                    alertify.success("Deleted Successfull");
                    $scope.getCDAIntreventionData();
                }
            }, function (err) {
                console.log(err);
            });
        }, function () {
            return;
        });
    }
    $scope.EditCdsItemBySettinglevel = function (Mainitem) {
        $scope.cdsFocus = true;
        if (Mainitem!='') {
            $scope.DemograpicViewAddingArray = [];
            $scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray = [];
            $scope.MedicineGetObj.MedicationsRuleNameStoreArray = [];
            $scope.AllergiesObjValue.AllergiesRuleNameStoreArray = [];
            $scope.VitalsViewAddingArray = [];
            $scope.LabObjValue.LabRuleNameStoreArray = [];
        }
        $scope.SaveTitle = 'Update';
        var DemograpicArray = [];
        var DiagnosisRuleArray = [];
        var MedicationsRuleArray = [];
        var AllergiesRuleArray = [];
        var VitalsRuleArray = [];
        var LabsRuleArray = [];
        $scope.GetSavingCdsMainObj.IsCdsDataEditCaseInd = true;
        $scope.GetSavingCdsMainObj.CDAIntreventionId = Mainitem.CDAIntreventionId;
        $scope.EditCaseCdsArrayMaintain = [];
        $scope.SettingCdsshowingObj.IsShowDemograpicValue = true;
        if (Mainitem.ActiveInd==false) {
            $scope.GetSavingCdsMainObj.ActiveInd = false;
        }
        else
        {
            $scope.GetSavingCdsMainObj.ActiveInd = true;
        }
        $scope.EditCaseCdsArrayMaintain = angular.copy(Mainitem);
        if (Mainitem != '') {
            $scope.GetSavingCdsMainObj.CDAIntreventionName = Mainitem.CDAIntreventionName;
            angular.forEach(Mainitem.RuleData, function (jitem) {
                $scope.GetSavingCdsMainObj.CDAIntreventionRule = $filter('filter')($scope.CdsPrimaryRuleObjArray, { 'CdsSeletingRuleId': jitem.RuleValueId }, true)[0];
            });
            angular.forEach(Mainitem.RuleData, function (titem) {

                if (titem.RuleDetails.length > 0) {
                    DemograpicArray = $filter('filter')(titem.RuleDetails, { 'InterventionTypeId': 1 }, true);
                    DiagnosisRuleArray = $filter('filter')(titem.RuleDetails, { 'InterventionTypeId': 2 }, true);
                    MedicationsRuleArray = $filter('filter')(titem.RuleDetails, { 'InterventionTypeId': 3 }, true);
                    AllergiesRuleArray = $filter('filter')(titem.RuleDetails, { 'InterventionTypeId': 4 }, true);
                    VitalsRuleArray = $filter('filter')(titem.RuleDetails, { 'InterventionTypeId': 5 }, true);
                    LabsRuleArray = $filter('filter')(titem.RuleDetails, { 'InterventionTypeId': 6 }, true);
                    if (DemograpicArray.length==0) {
                        let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                        if ($scope.DemograpicViewAddingArray.length == 0) {
                            $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
                        }
                    }
                    if (VitalsRuleArray.length==0) {
                        let GetVitalsValuesStoringObj = angular.copy($scope.GetVitalsValuesStoringObj());
                        if ($scope.VitalsViewAddingArray.length == 0) {
                            $scope.VitalsViewAddingArray.push(GetVitalsValuesStoringObj);
                        }
                    }
                    $scope.GetSavingCdsMainObj.EditTimeRuleId = titem.RuleId || 0;
                    if (titem.RuleDetails.length > 0) {
                        if (DemograpicArray.length > 0) {
                            $scope.DemograpicViewAddingArray = [];
                            angular.forEach(DemograpicArray, function (item) {
                                var DemograpicObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                                if (item.CategoryId == 1) {
                                    DemograpicObj.SelectedParameterId = item.CategoryId;
                                    DemograpicObj.CategoryId = $filter('filter')($scope.settingDemograpicArray, { 'SelectedParameterId': 1 }, true)[0];
                                    DemograpicObj.AgeFactor = $filter('filter')($scope.ageOptions, { 'Id': item.ConditionId }, true)[0];
                                    DemograpicObj.ValueName = item.ValueName;
                                    DemograpicObj.RuleDetailId = item.RuleDetailId;
                                    DemograpicObj.RuleId = item.RuleId;
                                    $scope.DemograpicViewAddingArray.push(DemograpicObj);
                                }
                                if (item.CategoryId == 2) {
                                    DemograpicObj.SelectedParameterId = item.CategoryId;
                                    DemograpicObj.CategoryId = $filter('filter')($scope.settingDemograpicArray, { 'SelectedParameterId': 2 }, true)[0];
                                    DemograpicObj.GenderFactor = $filter('filter')($scope.genderOptions, { 'Id': item.ValueId }, true)[0];
                                    DemograpicObj.RuleDetailId = item.RuleDetailId;
                                    DemograpicObj.RuleId = item.RuleId;
                                    $scope.DemograpicViewAddingArray.push(DemograpicObj);
                                }
                                if (item.CategoryId == 3) {
                                    DemograpicObj.SelectedParameterId = item.CategoryId;
                                    DemograpicObj.CategoryId = $filter('filter')($scope.settingDemograpicArray, { 'SelectedParameterId': 3 }, true)[0];
                                    DemograpicObj.LanguageFactor = $filter('filter')($scope.languageOptions, { 'Id': item.ValueId }, true)[0];
                                    DemograpicObj.RuleDetailId = item.RuleDetailId;
                                    DemograpicObj.RuleId = item.RuleId;
                                    $scope.DemograpicViewAddingArray.push(DemograpicObj);
                                }
                                if (item.CategoryId == 4) {
                                    DemograpicObj.SelectedParameterId = item.CategoryId;
                                    DemograpicObj.CategoryId = $filter('filter')($scope.settingDemograpicArray, { 'SelectedParameterId': 4 }, true)[0];
                                    DemograpicObj.RuleDetailId = item.RuleDetailId;
                                    DemograpicObj.RuleId = item.RuleId;
                                    if (item.ValueName != '') {
                                        DemograpicObj.DobFactor = item.ValueName;
                                    }
                                    $scope.DemograpicViewAddingArray.push(DemograpicObj);
                                }
                                if (item.CategoryId == 5) {
                                    DemograpicObj.SelectedParameterId = item.CategoryId;
                                    DemograpicObj.CategoryId = $filter('filter')($scope.settingDemograpicArray, { 'SelectedParameterId': 5 }, true)[0];
                                    DemograpicObj.RaceFactor = $filter('filter')($scope.PatientRaceList, { 'DropdownId': item.ValueId }, true)[0];
                                    DemograpicObj.RuleDetailId = item.RuleDetailId;
                                    DemograpicObj.RuleId = item.RuleId;
                                    $scope.DemograpicViewAddingArray.push(DemograpicObj);
                                }
                                if (item.CategoryId == 6) {
                                    DemograpicObj.SelectedParameterId = item.CategoryId;
                                    DemograpicObj.CategoryId = $filter('filter')($scope.settingDemograpicArray, { 'SelectedParameterId': 6 }, true)[0];
                                    DemograpicObj.EthnicityFactor = $filter('filter')($scope.PatientEthnicityList, { 'DropdownId': item.ValueId }, true)[0];
                                    DemograpicObj.RuleDetailId = item.RuleDetailId;
                                    DemograpicObj.RuleId = item.RuleId;
                                    $scope.DemograpicViewAddingArray.push(DemograpicObj);
                                }
                            });
                        }
                        if (DiagnosisRuleArray.length > 0) {
                            $scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray = angular.copy(DiagnosisRuleArray);
                        }
                        if (MedicationsRuleArray.length > 0) {
                            $scope.MedicineGetObj.MedicationsRuleNameStoreArray = angular.copy(MedicationsRuleArray);
                        }
                        if (AllergiesRuleArray.length > 0) {
                            $scope.AllergiesObjValue.AllergiesRuleNameStoreArray = angular.copy(AllergiesRuleArray);
                        }
                        if (VitalsRuleArray.length > 0) {
                            $scope.VitalViewAddingArray = [];
                            angular.forEach(VitalsRuleArray, function (item) {
                                var VitalDemoObj = angular.copy($scope.GetVitalsValuesStoringObj());
                                if (item.CategoryId == 11) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 11 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.TemparetureFactor = $filter('filter')($scope.TempratureUnits, { 'Id': item.VitalValueUnitId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;

                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 12) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 12 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 4) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 4 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.secondConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.VitalBpValueConditonId }, true)[0];
                                    VitalDemoObj.ValueName = item.VitalBpValue;
                                    VitalDemoObj.SecondValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId; 
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 14) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 14 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 15) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 15 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 40) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 40 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 5) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 5 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.BGLFactor = $filter('filter')($scope.BGLUnits, { 'Id': item.ValueId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 13) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 13 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 1) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 1 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.WeightFactor = $filter('filter')($scope.WeightUnits, { 'Id': item.ValueId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 2) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 2 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.HeightFactor = $filter('filter')($scope.HeightUnits, { 'Id': item.ValueId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 17) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 17 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                                if (item.CategoryId == 37) {
                                    VitalDemoObj.VitalId = item.CategoryId;
                                    VitalDemoObj.CategoryId = $filter('filter')($scope.VitalsShowArray, { 'VitalId': 37 }, true)[0];
                                    VitalDemoObj.ConditionFactor = $filter('filter')($scope.Conditions, { 'ConditionId': item.ConditionId }, true)[0];
                                    VitalDemoObj.ValueName = item.ValueName;
                                    VitalDemoObj.RuleDetailId = item.RuleDetailId;
                                    VitalDemoObj.RuleId = item.RuleId;
                                    $scope.VitalsViewAddingArray.push(VitalDemoObj);
                                }
                            });
                        }

                        if (LabsRuleArray.length > 0) {
                            $scope.LabObjValue.LabRuleNameStoreArray = angular.copy(LabsRuleArray);
                        }
                        if ($scope.GetSavingCdsMainObj.RuleData != '') {
                            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length > 0) {
                                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (item) {
                                    if (DemograpicArray.length > 0) {
                                        item.DemograpicObjArray = angular.copy(DemograpicArray);
                                    }
                                    if (DiagnosisRuleArray.length > 0) {
                                        item.DiagnosisObjArray = angular.copy(DiagnosisRuleArray);
                                    }
                                    if (MedicationsRuleArray.length > 0) {
                                        item.MedicationsObjArray = angular.copy(MedicationsRuleArray);
                                    }
                                    if (AllergiesRuleArray.length > 0) {
                                        item.AllergiesObjArray = angular.copy(AllergiesRuleArray);
                                    }
                                    if ($scope.VitalsViewAddingArray.length > 0) {
                                        item.VitalsObjArray = angular.copy($scope.VitalsViewAddingArray);
                                    }
                                    if (LabsRuleArray.length > 0) {
                                        item.LabObjArray = angular.copy(LabsRuleArray);
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    let GetDemograpicValuesStoringObj = angular.copy($scope.GetDemograpicValuesStoringObj());
                    if ($scope.DemograpicViewAddingArray.length == 0) {
                        $scope.DemograpicViewAddingArray.push(GetDemograpicValuesStoringObj);
                    }
                    let GetVitalsValuesStoringObj = angular.copy($scope.GetVitalsValuesStoringObj());
                    if ($scope.VitalsViewAddingArray.length == 0) {
                        $scope.VitalsViewAddingArray.push(GetVitalsValuesStoringObj);
                    }
                }
            });
        }
    }
    $scope.ClearCdsEnterData = function (item) {
        if ($scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray.length > 0) {
            $scope.DiagnosisObjValue.DiagnosisRuleNameStoreArray = [];
        }
        if ($scope.MedicineGetObj.MedicationsRuleNameStoreArray.length > 0) {
            $scope.MedicineGetObj.MedicationsRuleNameStoreArray = [];
        }
        if ($scope.AllergiesObjValue.AllergiesRuleNameStoreArray.length > 0) {
            $scope.AllergiesObjValue.AllergiesRuleNameStoreArray = [];
        }
        if ($scope.LabObjValue.LabRuleNameStoreArray.length > 0) {
            $scope.LabObjValue.LabRuleNameStoreArray = [];
        }
        if ($scope.DemograpicViewAddingArray.length > 0) {
            $scope.DemograpicViewAddingArray = [];
        }
        $scope.SettingCdsshowingObj.IsShowDemograpicValue = false;
        $scope.GetSavingCdsMainObj.ActiveInd = false;
        if ($scope.GetSavingCdsMainObj.CDAIntreventionName != '') {
          $scope.GetSavingCdsMainObj.CDAIntreventionName = '';
        }
        if ($scope.GetSavingCdsMainObj.CDAIntreventionRule!= '') {
            $scope.GetSavingCdsMainObj.CDAIntreventionRule = '';
        }
        if ($scope.VitalsViewAddingArray != '') {
            $scope.VitalsViewAddingArray = [];
        }
        console.log($scope.VitalsViewAddingArray);
        if ($scope.GetSavingCdsMainObj.RuleData != '') {
            if ($scope.GetSavingCdsMainObj.RuleData.RuleDetails.length>0) {
                angular.forEach($scope.GetSavingCdsMainObj.RuleData.RuleDetails, function (Sitem) {
                        if (Sitem.AllergiesObjArray.length > 0) {
                            Sitem.AllergiesObjArray = [];
                        }
                        if (Sitem.DemograpicObjArray.length > 0) {
                            Sitem.DemograpicObjArray = [];
                        }
                        if (Sitem.DiagnosisObjArray.length > 0) {
                            Sitem.DiagnosisObjArray = [];
                        }
                        if (Sitem.MedicationsObjArray.length > 0) {
                            Sitem.MedicationsObjArray = [];
                        }
                        if (Sitem.LabObjArray.length > 0) {
                            Sitem.LabObjArray = [];
                        }
                        if (Sitem.VitalsObjArray.length > 0) {
                           Sitem.VitalsObjArray = [];
                        }
                })
            }
        }
    }
    $scope.ChangingEnableCdsIntervention = function (type, item) {
        if (type == 'Enable Access') {
            if (item.ActiveInd == true) {
                item.ActiveInd = 'Y';
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to Enable Cds Intervention? </h4>", function () {

                    var reqobj = {
                        "UserId": $scope.UserId || 0,
                        "CDAIntreventionId": item.CDAIntreventionId || 0,
                        "ActiveInd": item.ActiveInd || 0,
                        "OrganizationValueId": $scope.HospitalId||0,
                    }
                    eHnoteSettingsDataService.AddUpdateEnableDiasibleCDSIntrevention(reqobj).then(function (resp) {
                        if (resp.data.Status == "Success") {
                            alertify.success("Enable Cds Intervention Successfull");
                            $scope.getCDAIntreventionData();
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }, function () {
                    item.ActiveInd = false;
                    return;
                });
            }
            else if (item.ActiveInd == false) {
                item.ActiveInd = 'N';
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to Disable Cds Intervention? </h4>", function () {
                    var reqobj = {
                        "UserId": $scope.UserId || 0,
                        "CDAIntreventionId": item.CDAIntreventionId || 0,
                        "ActiveInd": item.ActiveInd || 0,
                        "OrganizationValueId": $scope.HospitalId||0,
                    }
                    eHnoteSettingsDataService.AddUpdateEnableDiasibleCDSIntrevention(reqobj).then(function (resp) {
                        if (resp.data.Status == "Success") {
                            alertify.success("Disable Cds Intervention Successfull");
                            item.ActiveInd = false;
                            $scope.getCDAIntreventionData();
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }, function () {
                    item.ActiveInd = true;
                    return;
                });
            }
        }
        //if (type == 'EnableAdding') {
        //    if (item) {
        //        if ($scope.GetSavingCdsMainObj.ActiveInd != '') {
        //            $scope.GetSavingCdsMainObj.ActiveInd = 'Y';
        //        }
        //    }
        //    else {
        //        if ($scope.GetSavingCdsMainObj.ActiveInd != '') {
        //            $scope.GetSavingCdsMainObj.ActiveInd = 'N';
        //        }
        //    }
        //}
    }
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
                if (resp.data.DrugDetailsList !== null) {
                    return resp.data.DrugDetailsList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }
    function getpatientdetailsbyid(patientid) {
        eHnoteAuditServices.getPatientDetailsById(patientid, ongetPatientDetailsSuccess, ongetPatientDetailsError);
    }

    function ongetPatientDetailsSuccess(data) {
        if (data !== undefined) {
            if (data.Patient !== undefined) {
                if (data.Patient.length > 0) {
                    appointmentinfo.PatientDetails = "";
                    appointmentinfo.PatientDetails = data;
                }
            }
        }
    }
    function ongetPatientDetailsError(error) {
        console.log(error);
    }
    $scope.GetAllergyListFromRcopia = function (val) {

        var searchvalue = val || "";

        if (searchvalue != "") {
            var req = {
                "VendorName": "Appolo Pharmacy",
                "VendorPassword": "abc123",
                "searchText": searchvalue || "",
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getAllergyDataFromRcopia(req).then(function (resp) {
                if (resp.data.AllergyList !== null) {
                    return resp.data.AllergyList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }
    $scope.changeVitelIdCondition = function (item, mainitem) {

        var count = 0;
        var FilterVitalsViewAddingArray = $filter('filter')($scope.VitalsViewAddingArray, { 'DeleteInd': 'N' }, true) || [];
        if (FilterVitalsViewAddingArray.length > 1) {
            angular.forEach(FilterVitalsViewAddingArray, function (sitem) {
                if (sitem.CategoryId.VitalId == item.VitalId) {
                    count = count + 1;
                }
            });
        }
        if (count > 1) {
            alertify.error('the Vitals rule is already added ');
            mainitem.CategoryId = '';
            return false;
        }
        else {
            if (mainitem.ConditionFactor != '') {
                mainitem.ConditionFactor = '';
            }
            if (mainitem.ValueName != '') {
                mainitem.ValueName = '';
            }
            if (item.VitalId == 11) {
                mainitem.VitalId = 11;
            }
            else if (item.VitalId == 12) {
                mainitem.VitalId = 12;
            }
            else if (item.VitalId == 4) {
                mainitem.VitalId = 4;
            }
            else if (item.VitalId == 14) {
                mainitem.VitalId = 14;
            }
            else if (item.VitalId == 15) {
                mainitem.VitalId = 15;
            }
            else if (item.VitalId == 40) {
                mainitem.VitalId = 40;
            }
            else if (item.VitalId == 5) {
                mainitem.VitalId = 5;
            }
            else if (item.VitalId == 13) {
                mainitem.VitalId = 13;
            }
            else if (item.VitalId == 1) {
                mainitem.VitalId = 1;
            }
            else if (item.VitalId == 2) {
                mainitem.VitalId = 2;
            }
            else if (item.VitalId == 17) {
                mainitem.VitalId = 17;
            }
            else if (item.VitalId == 37) {
                mainitem.VitalId = 37;
            }
            else {
                console.log('checking')
            }
        }
    }
    $scope.AddVitalCondition = function (item) {

        if (item.ValueName != '' && item.CategoryId != '' && item.ConditionFactor!='') {
            let GetVitalsValuesStoringObj = angular.copy($scope.GetVitalsValuesStoringObj());
            $scope.VitalsViewAddingArray.push(GetVitalsValuesStoringObj);
        }
        else {
            alertify.error('Please Enter the Fields')
        }
    }
    $scope.RemoveVitalItemById = function (item,index) {
        if (item.RuleDetailId == 0) {
              $scope.VitalsViewAddingArray = $filter('filter')($scope.VitalsViewAddingArray, { 'DeleteInd': "N" }, true) || [];
              $scope.VitalsViewAddingArray.splice(index, 1);
        }
        else {
            item.DeleteInd = 'Y';
            //$scope.VitalsViewAddingArray = $filter('filter')($scope.VitalsViewAddingArray, { 'DeleteInd': "N" }, true) || [];
            //$scope.VitalsViewAddingArray[index].DeleteInd = 'Y';
        }
    }

    $scope.GetOrganizationTypeOfService = function (text) {
        var params = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": text || "", // searchtext
            "TypeOfServiceId": 0,
            "Type": 'Investigation',
            "IsFrequent": 'N',
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        if (params.SearchText == '') {
            params.IsFrequent = 'Y';
        }

        return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };
    $scope.onAsseselectInvestigation = function (InvObject, mainitem) {

        if (InvObject.ProcedureId === '') {
            InvObject.InvestigationName = '';
            return false;
        }
        $scope.SelectedInvestigationItem = InvObject || "";
        if ($scope.SelectedInvestigationItem === "") {
            return;
        }
        var InterventionTypeId = 6;
        var IntreventionTypeName = "Lab";
        var CategoryName = 'Investigation';
        var ValueId = InvObject.ProcedureId||0;
        var ValueName = InvObject.ProcedureName || "";
        var ActiveInd = InvObject.ActiveInd || "";
        var ProcedureCode = InvObject.ProcedureCode || "";
        var i = 0;
       
        var GetInvobj = {
            "RuleDetailId": 0,
            "InterventionTypeId": InterventionTypeId || 0,
            "IntreventionTypeName": IntreventionTypeName || "",
            "CategoryId": 0,
            "CategoryName": "",
            "ConditionId": 0,
            "ConditionName": "",
            "OrganizationValueId": '12',
            "ValueId": ValueId || 0,
            "ValueName": ValueName || "",
            "ValueCode": ProcedureCode || "",
            "DeleteInd": "N",
            "ActiveInd": ActiveInd || 'N',
        }
        $scope.LabObjValue.LabRuleNameStoreArray = $scope.LabObjValue.LabRuleNameStoreArray || [];
        if ($scope.LabObjValue.LabRuleNameStoreArray.length > 0) {
            angular.forEach($scope.LabObjValue.LabRuleNameStoreArray, function (item) {
                if (item.ValueId === $scope.SelectedInvestigationItem.ProcedureId && item.DeleteInd === 'N') {
                    alertify.error('You already entered this Investigation');
                    i++;
                    return false;
                }
            });
        }
        if (i === 0) {
            $scope.LabObjValue.LabRuleNameStoreArray.push(GetInvobj);
        }
        else {
            $scope.LabObjValue.LabRuleNameStoreArray = $scope.LabObjValue.LabRuleNameStoreArray || [];
        }
        $scope.LabObjValue.LabRuleName = '';
    };
    $scope.RemoveLabRuleItem = function (item,index) {
        if (item.RuleDetailId == 0) {
            $scope.LabObjValue.LabRuleNameStoreArray = $filter('filter')($scope.LabObjValue.LabRuleNameStoreArray, { 'DeleteInd': "N" }, true) || [];
            $scope.LabObjValue.LabRuleNameStoreArray.splice(index, 1);
        }
        else {
            item.DeleteInd = 'Y';
        }
    }
    $scope.LostSettingsFocus = function () {
        $scope.cdsFocus = false;
    };
}]);
"use strict";
eHnoteWebApp.controller("USAddDiagnosiswithSnomedPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteConditionsDataService", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "DiagnosisObject","SnomedObject", "Type",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteMainAppointmentService, DiagnosisObject, SnomedObject, Type) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParentOrganizationId = 0;
        $scope.HospitalId = 0;
        $scope.EditSnomed = "Save";
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParentOrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        }
        $scope.close = function () {
            $scope.EditSnomed = "Save";
            $uibModalInstance.dismiss("cancel");
        };
        $scope.Type = Type;
        $scope.DiagnosisObject = DiagnosisObject;
        $scope.SnomedObject = SnomedObject;
        if ($scope.Type =='Diagnosis') {
            $scope.obj = {
                "ParentOrganizationId": $scope.ParentOrganizationId,
                "UserId": $scope.UserId,
                "DeleteInd": false,
                "Diagnosisobj": $scope.DiagnosisObject.ICD10DIAGNAME,
                "DiagnosisId": $scope.DiagnosisObject.DiagnosisId,
                "SnomedCodeId": "",
                "SnomedCodeobj": "",
                "SnomedCode": "",

            }
        }
        if ($scope.Type == 'SNOMED') {
            $scope.Snomedobj = {               
                "DeleteInd": false,
                "Diagnosisobj": '',
                "DiagnosisId": null,
                "SNOMEDCTICD10Id": null,
                "SnomedCodeId": $scope.SnomedObject.SnomedCodeId||null,
                "SnomedCodeobj": $scope.SnomedObject.ConceptId || null,
                "SnomedCode": $scope.SnomedObject.ConceptId || null,

            }
        }
      

        $scope.ICD10SnomedList = [];
        $scope.GetSearchSnomedCodes = function (val) {
            var object = {
                "HospitalId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": val,
                "ParentOrganizationId": $scope.ParentOrganizationId || null,
            };
            return eHnoteSettingsDataService.GetSearchSnomedCodes(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });
        }

        $scope.GetSearchICD10Codes = function (val) {
            var object = {
                "LevelType": 'O',
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "ParentOrganizationId": $scope.ParentOrganizationId || null,
            };
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {                       
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    }
                }
            });

          
        }
        $scope.ICD10List = [];
        $scope.GetSnomedCTICD10 = function (val) {
            var DiagnosisId = null;
            var SnomedCodeId = null;
            if ($scope.Type =='Diagnosis') {
                DiagnosisId = $scope.DiagnosisObject.DiagnosisId || null;
                SnomedCodeId = null;
            }
            if ($scope.Type == 'SNOMED') {
                DiagnosisId = null;
                SnomedCodeId = $scope.Snomedobj.SnomedCodeId ||null;
            }
            var object = {
                "ParentOrganizationId": $scope.ParentOrganizationId,
                "DiagnosisId": DiagnosisId||null,
                "SnomedCodeId": SnomedCodeId||null,
                "PageSize": 20,
                "PageNumber": 1,
                "Searchtext": "",

            };
            eHnoteSettingsDataService.GetSnomedCTICD10(object).then(function (resp) {
                console.log(resp);
                if (resp.data.status == 'Success') {
                    $scope.ICD10List = resp.data.Rows || [];
                } else {
                    $scope.ICD10List = [];
                }
            });
        }
        $scope.GetSnomedCTICD10();
        $scope.onSelectSystemicHistoryDiagnosis = function (item) {
            $scope.obj.SnomedCodeId = item.SnomedCodeId;
            $scope.obj.SnomedCode = item.ConceptId;
        }
        $scope.onSelectDiagnosis = function (item) {
            $scope.Snomedobj.DiagnosisId = item.DiagnosisId;
            $scope.Snomedobj.ICD10CODE = item.ICD10CODE;
        }
        $scope.AddDiagnosis = function () {

            //if ($scope.obj.SnomedCodeobj == "") {
            //    alertify.error("Enter Snomed code");
            //    return false;
            //}  
            if ($scope.Type == 'Diagnosis') {
                if ($scope.obj.SnomedCodeobj == "") {
                    alertify.error("Enter Snomed code");
                    return false;
                }
            }
            else if ($scope.Type == 'SNOMED') {
                if ($scope.Snomedobj.Diagnosisobj == "") {
                    alertify.error("Enter Diagnosis code");
                    return false;
                }
            }
            $scope.ICD10SnomedList = $scope.ICD10SnomedList || [];
            if ($scope.ICD10SnomedList.length > 0) {
                if ($scope.Type == 'Diagnosis') {
                    var filterSnomed = $filter("filter")($scope.ICD10SnomedList, { "SnomedCodeId": $scope.obj.SnomedCodeobj.SnomedCodeId }, true);
                    if (filterSnomed.length > 0) {
                        alertify.error("SnomedCode Already Added");
                        return false;
                    }
                }
                else if ($scope.Type == 'SNOMED') {
                    var filterdiag = $filter("filter")($scope.ICD10SnomedList, { "DiagnosisId": $scope.Snomedobj.Diagnosisobj.DiagnosisId }, true);
                    if (filterdiag.length > 0) {
                        alertify.error("Diagnosis Already Added");
                        return false;
                    }
                }
            }
            if ($scope.Type == 'Diagnosis') {
                var obj = {
                    "DeleteInd": 'N',
                    "DiagnosisId": $scope.DiagnosisObject.DiagnosisId || null,
                    "SnomedCodeId": $scope.obj.SnomedCodeId || null,
                    "ICD10Code": $scope.DiagnosisObject.ICD10CODE || "",
                    "SnomedCode": $scope.obj.SnomedCode || "",
                    "SNOMEDCTICD10Id": $scope.obj.SNOMEDCTICD10Id || null
                }
                $scope.ICD10SnomedList.push(obj);
                $scope.obj = {
                    "ParentOrganizationId": $scope.ParentOrganizationId,
                    "UserId": $scope.UserId,
                    "DeleteInd": false,
                    "Diagnosisobj": $scope.DiagnosisObject.ICD10DIAGNAME,
                    "DiagnosisId": "",
                    "SnomedCodeId": "",
                    "SnomedCodeobj": "",
                    "SNOMEDCTICD10Id": ""
                }
            }
            if ($scope.Type == 'SNOMED') {
                var obj = {
                    "DeleteInd": 'N',
                    "DiagnosisId": $scope.Snomedobj.DiagnosisId || null,
                    "SnomedCodeId": $scope.SnomedObject.SnomedCodeId || null,
                    "ICD10Code": $scope.Snomedobj.ICD10CODE || "",
                    "SnomedCode": $scope.Snomedobj.SnomedCode || "",
                    "SNOMEDCTICD10Id": $scope.Snomedobj.SNOMEDCTICD10Id || null
                }
                $scope.ICD10SnomedList.push(obj);
                $scope.Snomedobj = {                   
                    "DeleteInd": false,
                    "Diagnosisobj": '',
                    "DiagnosisId": null,
                    "SNOMEDCTICD10Id": null,
                    "SnomedCodeId": $scope.SnomedObject.SnomedCodeId || null,
                    "SnomedCodeobj": $scope.SnomedObject.ConceptId || null,
                    "SnomedCode": $scope.SnomedObject.ConceptId || null,

                }
            }
      
        }

        $scope.Save = function () {
            if ($scope.Type == 'Diagnosis') {
                if ($scope.ICD10SnomedList.length == 0) {
                    alertify.error("Add Snomed codes");
                    return false;
                }
            }
            if ($scope.Type == 'SNOMED') {
                if ($scope.ICD10SnomedList.length == 0) {
                    alertify.error("Add Diagnosis codes");
                    return false;
                }
            }
            var obj = {
                "ParentOrganizationId": $scope.ParentOrganizationId,
                "UserId": $scope.UserId,
                "ICD10SnomedList": $scope.ICD10SnomedList||[]
            }
        
          
            eHnoteSettingsDataService.AddUpdateSNOMEDCTICD10(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status == "Success") {
                    alertify.success(" Successfully Added");
                    $scope.ICD10SnomedList = [];
                    $scope.GetSnomedCTICD10();
                    if ($scope.Type == 'Diagnosis') {
                        $scope.obj = {
                            "ParentOrganizationId": $scope.ParentOrganizationId,
                            "UserId": $scope.UserId,
                            "DeleteInd": false,
                            "Diagnosisobj": $scope.DiagnosisObject.ICD10DIAGNAME,
                            "DiagnosisId": $scope.DiagnosisObject.DiagnosisId,
                            "SnomedCodeId": "",
                            "SnomedCodeobj": "",
                            "SnomedCode": "",

                        }
                    }
                    if ($scope.Type == 'SNOMED') {
                        $scope.Snomedobj = {
                            "DeleteInd": false,
                            "Diagnosisobj": '',
                            "DiagnosisId": null,
                            "SNOMEDCTICD10Id": null,
                            "SnomedCodeId": $scope.SnomedObject.SnomedCodeId || null,
                            "SnomedCodeobj": $scope.SnomedObject.ConceptId || null,
                            "SnomedCode": $scope.SnomedObject.ConceptId || null,

                        }
                    }
                }
               
            });
        }
        $scope.EditSnomedCode = function (item) {
            $scope.obj.SnomedCode = item.SnomedCode;
            $scope.EditSnomed = "Update";
        }
    }]);
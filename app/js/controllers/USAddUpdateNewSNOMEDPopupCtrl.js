"use strict";
eHnoteWebApp.controller("USAddUpdateNewSNOMEDPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteConditionsDataService", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "SNOMEDval",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteMainAppointmentService, SNOMEDval) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParentOrganizationId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParentOrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        }
        $scope.close = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.SNOMEDval = SNOMEDval || '';
        $scope.getSnomedCodesObj = function () {
            var obj = {
                "SnomedCodeId": 0,
                "ConceptId": $scope.SNOMEDval || "",
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
                "StatusObj": ""
            };
            return obj;
        };
        $scope.ClearSnomedCodes = function () {
            $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());       
        }
        $scope.SnomedCodesObj = angular.copy($scope.getSnomedCodesObj());

        function getProcedureTypes() {
            eHnoteSettingsDataService.GetAllDropdownValuesByType('ProcedureType').then(function (resp) {
                $scope.ProcedureTypes = resp.data.rows;
            }, function (err) {
                console.log(err);
                alertify.error("Getting ProcedureTypes Failed");
            });
        }
        getProcedureTypes();
        $scope.ChangeSnomedProcedureType = function (item) {
            item.TypeObj = item.TypeObj || "";
            if (item.TypeObj != "") {
                item.TypeId = item.TypeObj.DropdownId;
            }
        };
        $scope.AddUpdateSnomedCodes = function () {
            if ($scope.SnomedCodesObj.ConceptId === "" || $scope.SnomedCodesObj.ConceptId === undefined) {
                alertify.error("Enter ConceptId");
                return false;
            }

            var object = {
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
                "HospitalId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentOrganizationId || null,
            };
            // object.CreatedDt = $filter("dateFormatter")(object.CreatedDt, "-");
            // object.EffectiveTime = $filter("dateFormatter")(object.EffectiveTime, "-");
            object.CreatedDt = $filter("date")(new Date(object.CreatedDt), "yyyy-MM-dd");
            object.EffectiveTime = $filter("date")(new Date(object.EffectiveTime), "yyyy-MM-dd");

            eHnoteSettingsDataService.addUpdateSnomedCodes(object).success(function (response) {

                if (response.status === 'Success') {
                    if ($scope.SnomedCodesObj.SnomedCodeId === undefined || $scope.SnomedCodesObj.SnomedCodeId === 0) {
                        alertify.success("SnomedCodes Added Successfully");
                    } else {
                        alertify.success("SnomedCodes Updated Successfully");
                    }
                    $scope.SnomedCodes = response.SnomedCodes || [];
                    $uibModalInstance.close($scope.SnomedCodes);
                }

                if (response.status === 'Failure') {
                    if (response.Message === 'SnomedCode Already exists') {
                        alertify.error("Snomed Code already exist");
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };
    }]);
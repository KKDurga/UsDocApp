"use strict";
eHnoteWebApp.controller("USAddUpdateNewDiagnosisPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteConditionsDataService", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteMainAppointmentService","Diagnosisval",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteMainAppointmentService, Diagnosisval) {

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

        $scope.Diagnosisval = Diagnosisval;
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
                "ICD10Code": $scope.Diagnosisval||"",
                "ICD11Code": "",
                "SearchICD9": "",
                "SearchICD10": "",
                "SearchICD11": ""
            };
            return obj;
        };
        $scope.DiagnosisObj = angular.copy($scope.getDiagnosisObj());

        $scope.AddupdateMasteDiag = function () {


            if ($scope.DiagnosisObj.DiagnosisName === "" || $scope.DiagnosisObj.DiagnosisName === undefined) {
                alertify.error("Enter Diagnosis Name");
                return false;
            }
            $scope.DiagnosisObj.ICD10Code = $scope.DiagnosisObj.ICD10Code || '';
            if ($scope.DiagnosisObj.ICD10Code === "") {
                alertify.error("Enter ICD10Code");
                return false;
            }   

          var object = {
                "DiagnosisId": $scope.DiagnosisObj.DiagnosisId || 0,
                "DiagnosisName": $scope.DiagnosisObj.DiagnosisName,
                "DiagnosisNotes": $scope.DiagnosisObj.DiagnosisNotes,
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.DiagnosisObj.ActiveInd,
                "SpecializationId": $scope.SpecializationId,
                "DiagnosisCode": $scope.DiagnosisObj.DiagnosisCode,
                "DiagnosisICDCode": $scope.DiagnosisObj.DiagnosisICDCode,
                "ICD9Code": $scope.DiagnosisObj.ICD9Code,
                "ICD10Code": $scope.DiagnosisObj.ICD10Code,
              "ICD11Code": $scope.DiagnosisObj.ICD11Code,
              "ParentOrganizationId": $scope.ParentOrganizationId || null,

            };

            //if ($scope.DiagnosisObj.DiagnosisId == 0) {
            //    if ($scope.MasterDiagnosisICD10Array.length > 0) {

            //        if (angular.isObject($scope.DiagnosisObj.DiagnosisName)) {
            //            var List = $filter("filter")($scope.MasterDiagnosisICD10Array, { "ICD10DIAGNAME": $scope.DiagnosisObj.DiagnosisName }, true);
            //        }
            //        else {
            //            var List = $filter("filter")($scope.MasterDiagnosisICD10Array, { "ICD10DIAGNAME": $scope.DiagnosisObj.DiagnosisName }, true);
            //        }

            //        if (List.length > 0) {
            //            alertify.error('Diagnosis Name is already exists');
            //            return;
            //        }
            //    }
            //}

            eHnoteSettingsDataService.addUpdateMasterDiagnosis(object).success(function (response) {

                if (response.status === 'Success') {
                    if ($scope.DiagnosisObj.DiagnosisId === undefined || $scope.DiagnosisObj.DiagnosisId === 0) {
                        alertify.success("Diagnosis Added Successfully");
                    } else {
                        alertify.success("Diagnosis Updated Successfully");
                    }
                    $scope.DiagnosisList =response.DiagnosisList || [];
                    $uibModalInstance.close($scope.DiagnosisList);
                }

                if (response.status === 'Failure') {
                    if (response.Message === 'DiagnosisName Already Exists') {
                        alertify.error("Diagnosis Name already exist");
                        $scope.DiagnosisObj.DiagnosisName = "";
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.CancelMasterDiagClick = function () {
            $scope.DiagnosisObj = angular.copy($scope.getDiagnosisObj());
        };
    }]);
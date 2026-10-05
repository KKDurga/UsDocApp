"use strict";
eHnoteWebApp.controller("USTreatmentPlanCtrl", ["$rootScope", "$scope", "$uibModalInstance", "eHnoteMasterDataService","eHnoteSettingsDataService",
    function ($rootScope, $scope, $uibModalInstance, eHnoteMasterDataService, eHnoteSettingsDataService) {

        // Investigation, procedures and medications
        let doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        }

        $scope.SearchObj = {
            "SearchType": 1,
            "TreatmentObj":""
        };

        $scope.TreatmentPlanObj = {
            "Investigations" : [],
            "Procedures" : [],
            "Medications" : [],
        };

        $scope.ProcedureStatusList = [
            {
                "StatusId": 1,
                "Status": "Active"
            },
            {
                "StatusId": 2,
                "Status": "InActive"
            },
            {
                "StatusId": 3,
                "Status": "Completed"
            }
        ];


        $scope.close = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.ChangeSearchType = function (val) {
            $scope.SearchObj.TreatmentObj = "";
        };


        $scope.GetOrganizationCPTProcedure = function (val) {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": val || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "IsFrequent": "N",
                "Status": 0
            };
            if (val == "") {
                obj.IsFrequent = "Y"
            }
            return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.rows.length !== 0) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });

                    }
                }
            });
        };

        $scope.OnClickAdvisedProcedureInOrders = function (Subitem) {

            if (Subitem.OrderTypeId == 1) {
                $scope.OnOrdersInvestigationItem(Subitem);
            }

            if (Subitem.OrderTypeId == 2) {
                $scope.OnOrdersProcedureItem(Subitem);
            }
            
        };

        $scope.OnOrdersProcedureItem = function (Subitem) {

            let item = Subitem;
            if (item.ProcedureId === '') {
                item.ProcedureName = '';
                return false;
            }

            let obj = {
                "AppointmentTreatmentPlanId": 0,
                "AppointmentId": 1236304,
                "TreatmentPlanName": "Get an EKG done on 6/23/2015",
                "PlanName": item.ProcedureName,
                "PlanId": "88634",
                "PlanCode": item.LoincCode,
                "PlanCodeSystem": "2.16.840.1.113883.6.1",
                "PlanCodeSystemName": "LOINC",
                "PlanDate": "2023-11-16",
                "PlanType": "Observation",
                "StatusId": "1",
                "Status": "active",
                "BodySiteName": "",
                "BodySiteCode": "",
                "BodySiteCodeSystem": "",
                "BodySiteCodeSystemName": "",
                "IsFollowUpAppointment": false,
                "HospitalId": 3,
                "DoctorId": 3,
                "FollowUpDate": ""
            };

            $scope.TreatmentPlanObj.Procedures.push(obj);

            $scope.SearchObj.TreatmentObj = "";
        };

        $scope.OnOrdersInvestigationItem = function (item) {

            if (item.ProcedureId === '') {
                item.InvestigationName = '';
                return false;
            }

            let obj = {
                "AppointmentTreatmentPlanId": 0,
                "AppointmentId": 1236304,
                "TreatmentPlanName": "Get an EKG done on 6/23/2015",
                "PlanName": item.ProcedureName,
                "PlanId": item.ProcedureId,
                "PlanCode": item.LoincCode,
                "PlanCodeSystem": "2.16.840.1.113883.6.1",
                "PlanCodeSystemName": "LOINC",
                "PlanDate": "",
                "PlanType": "Lab",
                "StatusId": "1",
                "Status": "active",
                "BodySiteName": "",
                "BodySiteCode": "",
                "BodySiteCodeSystem": "",
                "BodySiteCodeSystemName": "",
                "IsFollowUpAppointment": false,
                "HospitalId": $scope.HospitalId,
                "DoctorId": $scope.UserId,
                "OrganId": "",
                "FollowUpDate": "",
                "ShowDateFormat": true,
                "DurationType": "",
                "Duration": null
            };
   
            $scope.TreatmentPlanObj.Investigations.push(obj);

            $scope.SearchObj.TreatmentObj = "";
        };

        $scope.ChangeItem = function (item) {
            if (item.ShowDateFormat) {
                item.DurationDate = '';
            } else {
                item.Duration = '';
            }
            item.ShowDateFormat = !item.ShowDateFormat;
        };

        $scope.DeleteInvestigation = function (obj) {
            if (obj.AppointmentTreatmentPlanId == 0) {
                let index = $scope.TreatmentPlanObj.Investigations.indexOf(obj);
                if (index > -1) {
                    $scope.TreatmentPlanObj.Investigations.splice(index,1);
                }
            } 
        };


        $scope.SaveTreatmentPlan = function () {

            let reqObj = {
                "UserId": $scope.UserId,
                "AppointmentId": 0,
                "OrganizationId": $scope.HospitalId,
                "TreatmentPlanArray": []
            };

            let tempTreatmentPlanArray = [];
            angular.forEach($scope.TreatmentObj.Investigations, function (item) {
                tempTreatmentPlanArray.push(item);
            });

            angular.forEach($scope.TreatmentObj.Procedures, function (item) {
                tempTreatmentPlanArray.push(item);
            });

            angular.forEach($scope.TreatmentObj.Medications, function (item) {
                tempTreatmentPlanArray.push(item);
            });

            reqObj.TreatmentPlanArray = angular.copy(tempTreatmentPlanArray);

        };

    }]);
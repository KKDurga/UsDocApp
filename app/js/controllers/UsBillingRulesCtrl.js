"use strict";
eHnoteWebApp.controller("UsBillingRulesCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnoteInsuranceService", "alertify","$q", function ($scope, $rootScope, eHnoteMasterDataService, eHnoteInsuranceService, alertify,$q) {

    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = 0;
    $scope.ParentHospitalId = 0;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
        && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }
    $scope.activeSubTab = 1;



    var masterPolicies = [
        {
            "RoleType": "AutoWriteOff",
            "Type": "COPAY",
            "IsEnabledInd": true,
            "WriteOffLimit": null,
            "RuleWriteOffId": null
        },
        {
            "RoleType": "AutoWriteOff",
            "Type": "COINSURANCE",
            "IsEnabledInd": true,
            "WriteOffLimit": null,
            "RuleWriteOffId": null
        },
        {
            "RoleType": "AutoWriteOff",
            "Type": "DEDUCTIBLE",
            "IsEnabledInd": true,
            "WriteOffLimit": null,
            "RuleWriteOffId": null
        }
    ]


    function GetBillingRulesData() {
        var obj = {
            "OrganizationId": $scope.HospitalId,
            "ParentOrganization": $scope.ParentHospitalId,
            "UserId": $scope.UserId,
            "DeleteInd": "N",
            "CreatedOn": "2026-02-12T10:30:00Z",
            "Policies": masterPolicies || [],
            "IsEditInd":false

        }
        return obj;
    };
    $scope.BillingRuleobj = GetBillingRulesData();


    $scope.init = function () {
        $scope.BillingRuleobj = GetBillingRulesData();
        let obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
        }


        $q.all([
            eHnoteInsuranceService.GetAutoWriteOffPolicy(obj),
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                if (resp[0].data.rows.length > 0) {
                    $scope.BillingRuleobj.Policies = [];
                    angular.forEach(resp[0].data.rows, function (item) {
                        let obj = {
                            "RoleType": item.RoleType,
                            "Type": item.Type,
                            "IsEnabledInd": item.IsEnabledInd,
                            "WriteOffLimit": item.WriteOffLimit,
                            "RuleWriteOffId": item.RuleWriteOffId
                        }
                        $scope.BillingRuleobj.Policies.push(obj);
                    });
                    $scope.BillingRuleobj.IsEditInd = true;
                }
            }
         

        
        });


    }
    $scope.init();

    $scope.navtoRuletype = function (tabno) {       
        $scope.activeSubTab = tabno || "";
    }


    $scope.EditRules = function () {
        $scope.BillingRuleobj.IsEditInd = false;
    }

    $scope.SaveRules = function () {
        var obj = {
            "OrganizationId": $scope.BillingRuleobj.OrganizationId,
            "ParentOrganizationId": $scope.BillingRuleobj.ParentOrganization,
            "UserId": $scope.BillingRuleobj.UserId,
            "DeleteInd": $scope.BillingRuleobj.DeleteInd,
            "CreatedOn": $scope.BillingRuleobj.CreatedOn,
            "Policies": $scope.BillingRuleobj.Policies || []

        }

        eHnoteInsuranceService.AddOrganizationAutoWriteOffPolicy(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                alertify.success("Added successfully");
                return false;

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }





}]);
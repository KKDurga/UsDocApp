
eHnoteWebApp.controller('DilationMedicationCtrl', ['$scope', 'eHnoteMasterDataService', 'eHnotePatientVisitReasonServices', '$timeout', 'alertify', '$filter', 'eHnoteLoginStatusService', '$rootScope', '$location', 'localStorageFactory', 'eHnoteSettingsDataService', function ($scope, eHnoteMasterDataService, eHnotePatientVisitReasonServices, $timeout, alertify, $filter, eHnoteLoginStatusService, $rootScope, $location, localStorageFactory, eHnoteSettingsDataService) {
    $scope.GetAllIndicator = 1;
    $scope.maxSize = 10;
    $scope.PageNumber = 1;
    $scope.LabsearchText = "";
    // $scope.AllUserBranchesList = [];
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
  
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.getNewDilalationObj = function () {
        var obj  = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "MedicationObj": "",
            "MedicationId": null,
            "MedicationName": "",
            "IsDefault":false,
            "OrgDilationMedicationId": "",
            "DelInd": "Y"
        }
        return obj;
    }
    $scope.DilalationObj = angular.copy($scope.getNewDilalationObj());
    $scope.DilationChange = function (item) {
        item.MedicationId = item.MedicationObj.MedicationId;
        item.MedicationName = item.MedicationObj.MedicationName;
    };
    $scope.changeDilationSearch = function (item) {
        item.MedicationName = item.MedicationObj;
        item.MedicationId = 0;
    };
    $scope.editMedication = function (item, type) {
        $scope.dilationFocus = true;
        $scope.addedDilationMedication = true;
        if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateDilationMedications) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        };

        $scope.DilalationObj = angular.copy($scope.getNewDilalationObj());
        $scope.DilalationObj.OrgDilationMedicationId = item.OrgDilationMedicationId;
        $scope.DilalationObj.MedicationObj = item.MedicationName; 
        $scope.DilalationObj.MedicationName = item.MedicationName;
        $scope.DilalationObj.MedicationId = item.MedicationId;
        $scope.DilalationObj.IsDefault = item.IsDefault;

        if (type == 'delete') {
            r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete these Dilation  ?", function () {



                $scope.DilalationObj.DelInd = 'N';
                $scope.SaveDilation('delete');
            }, function () {
                r = "You pressed Cancel!";
            });




        }
    }
   

    $scope.SaveDilation = function (type) {

        if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateDilationMedications) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        };

        $scope.DilalationObj.MedicationName = $scope.DilalationObj.MedicationName || "";
        if ($scope.DilalationObj.MedicationName === "") {
            alertify.error("Please Enter  Medication Name");
            return false;
        }
        eHnoteSettingsDataService.AddUpdateOrgMedication($scope.DilalationObj).success(function (response) {

            if (response.status === "Success") {
                if (type == 'delete') {
                    alertify.success("Deleted Sucessfully");
                } else {
                    alertify.success("Added Sucessfully");
                }
                
                $scope.DilalationObj = angular.copy($scope.getNewDilalationObj());               
                $scope.GetOrgDilationMedication();
            } else {
                alertify.error(response.Message);
            }




        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    }
    $scope.GetDilationMedication = function (text, item) {

        //var params = {
        //    "PageSize": 10,
        //    "PageNumber": 1,
        //    "SearchText": text,
        //    "LabSpecialityId": item.LabSpecialityId,
        //    "GetAllIndicator": 1
        //};
        return eHnoteSettingsDataService.GetDilationMedication(text, "Get").then(function (response) {
            if (response.data.length !== 0) {
              
                    return response.data.map(function (item) {
                        return item;
                    });
               
            }
        });
    };
   
    $scope.GetOrgDilationMedication = function () {

        eHnoteSettingsDataService.GetOrgDilationMedication($scope.LabsearchText, $scope.HospitalId)
           .success(function (data) {
               $scope.DilationList = data;
               //$scope.OrgLabTestArrayCount = response.count;
               
           })
           .error(function (error) {
               alertify.log("Check internet connectivity");
           });
        
    }
    
    $scope.init = function () {
        $scope.GetOrgDilationMedication();
    }
    $scope.init();

    $scope.addedDilationMedication = false;
    $scope.addDilationMedication = function () {
        $scope.addedDilationMedication = true;
    };
    $scope.closeDilationMedication = function () {
        $scope.DilalationObj.MedicationObj = '';
        $scope.DilalationObj.IsDefault = false;
        $scope.addedDilationMedication = false;
    };
    $scope.LostSettingsFocus = function () {
        $scope.dilationFocus = false;
    };
}]);
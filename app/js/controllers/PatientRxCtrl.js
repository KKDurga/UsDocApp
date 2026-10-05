"use strict";
eHnoteWebApp.controller("PatientRxCtrl", ["$scope", "$rootScope", "$filter","eHnoteMainAppointmentService", "eHnoteMasterDataService", "eHnoteCacheStorageService", "alertify", "$timeout", "$uibModal", "datapersistanceFactory",
    function ($scope, $rootScope, $filter, eHnoteMainAppointmentService, eHnoteMasterDataService, eHnoteCacheStorageService, alertify, $timeout, $uibModal, datapersistanceFactory) {

        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();

        console.log(appointmentinfo);
        $scope.AppId = appointmentinfo.AppointmentID;
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

        $scope.tab = 1;

        $scope.GetMedicationsList = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.getAllPatientsactiveReqObj = {
            "PatientId": 0,
            "OrganizationId": $scope.HospitalId,
            "PageSize": 10,
            "PageNumber": 1,
            "TotalCount": 0
        }

        $scope.PrescriptionsArray = [];
        $scope.GetPatientCurrentActiveMedicationsList = function () {
            // $scope.AppId
            var obj = {
                "PatientId": 0,
                "OrganizationId": $scope.getAllPatientsactiveReqObj.OrganizationId,
                "PageSize": $scope.getAllPatientsactiveReqObj.PageSize,
                "PageNumber": $scope.getAllPatientsactiveReqObj.PageNumber
            }

            eHnoteDiagnosisDataServices.GetPatientActiveMedicationsList(obj).then(function (resp) {

                console.log(JSON.stringify(resp));



                $scope.PrescriptionsArray = [];
                if (resp.data.Status == "Success") {
                    $scope.PrescriptionsArray = resp.data.rows || [];
                    angular.forEach($scope.PrescriptionsArray, function (pitem) {
                        pitem.IsSelected = false;
                    });
                }
            }, function (err) {

            });
        }


        $scope.AllPatientsArray = [];

      

        for (var i = 0; i < 5; i++) {
            var patientobj = {
                "PatientId": i+1,
                "PatientName": "Durga reddy Kolla",
                "PatientFullName": "Durga reddy Kolla",
                "PatientMrNo": "MVP100233",
                "OldMrNo": "173411",
                "Gender": "M",
                "Age": "27",
                "DOB":"2002-06-21",
                "MobileNo": "+1 797 123445",
                "CreatedBy": "Rosario (Receptionist)",
                "ContentShow":false
            }
            $scope.AllPatientsArray.push(patientobj)
        };

        $scope.ShowContent = function (item) {
            console.log(item);
            item.ContentShow = !item.ContentShow;
        }


 
}]);
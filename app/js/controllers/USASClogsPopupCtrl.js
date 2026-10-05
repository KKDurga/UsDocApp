"use strict";
eHnoteWebApp.controller("USASClogsPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnoteSurgeryService", "$q", "eHnoteDiagnosisDataServices", "allUserList", "eHnoteUserDataService", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "obj",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteCacheStorageService, eHnoteSurgeryService, $q, eHnoteDiagnosisDataServices, allUserList, eHnoteUserDataService, eHnoteMainAppointmentService, eHnoteLoginStatusService, obj,) {



        
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.allUserList = allUserList || [];
        $scope.AppointmentId = obj.AppointmentId ||0;
        $scope.PatientId = obj.PatientId ||0;
        $scope.ModuleTypeId = obj.ModuleTypeId ||0;
        $scope.Type = obj.Type ||'';
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        let PatientDetailsObj;
        PatientDetailsObj = {
            "PatientName": $scope.cacheStorageItem.PatientName || "",
            "S3URL": "",
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || "",
            "DOB": $scope.cacheStorageItem.PatientDOB || "",
            "Gender": $scope.cacheStorageItem.Gender || "",
            "Age": $scope.cacheStorageItem.Age || "",
            "Mobile": $scope.cacheStorageItem.MobileNo || "",
            "Race": $scope.cacheStorageItem.RaceName || "",
            "Height": $scope.cacheStorageItem.ApptHeight || "",
            "Weight": $scope.cacheStorageItem.ApptWeight || "",
            "HeightUnit": $scope.cacheStorageItem.ApptHeightUnit || "",
            "WeightUnit": $scope.cacheStorageItem.ApptWeightUnit || "",
        };
        $scope.PatientDetails = PatientDetailsObj || '';

      
        $scope.init = function () {

            $scope.PreOpObj = {
                "Type": $scope.Type||"",
                "GeneralChecklist": [],
                "DilationMedications": [],
                "Medications": [],
                "PostOPPatientGoal":[],
                "DocumentsData": [],
                "PreviousAnesthesticsLog": [],
                "AnestheticPlanTypeLog": [],
                "LabInvestigationsLog": [],
                "DentitionArrayLog": [],
                "PrescriptionArrayLog": [],
                "AllergiesLog": [],
                "SurgicalHistoryLog": [],
                "CurrentSystemicMedicationsLog": [],
                "CurrentEyeMedicationsLog": [],
                "SystemicHistoryLog": [],
                "ImplantsLog": [],
                "IntraNurseCheckOutLog": [],
                "AnesthesiaMedications": [],
                "AnesthesiaVitals": [],

            }
            var req1 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.AppointmentId,
                "PatientId": $scope.PatientId,
                "ModuleTypeId": $scope.ModuleTypeId,
            }

            $q.all([
                eHnoteSurgeryService.GetEachAscLogByAppointmetId(req1),
              
            ]).then(function (resp) {
                if (resp[0].data.AppointmentCheckListLog.length>0) {
                    $scope.AllAppointmentCheckListLog = resp[0].data.AppointmentCheckListLog || [];
                    $scope.PreOpObj.Medications = resp[0].data.Medications || [];
                    $scope.PreOpObj.DilationMedications = $filter('filter')($scope.PreOpObj.Medications, { 'IsDilationMed': true }, true)||[];
                    $scope.PreOpObj.IntraOpMedications = $filter('filter')($scope.PreOpObj.MedicationsLog, { 'IsIntraMed': true }, true)||[];
                   // let tempArrayGeneral = $filter('filter')($scope.AllAppointmentCheckListLog, { 'CheckListCategoryId': 6 }, true);
                    $scope.PreOpObj.GeneralChecklist = angular.copy($scope.AllAppointmentCheckListLog);
                    $scope.PreOpObj.PostOPPatientGoal = resp[0].data.PostOPPatientGoal || [];

                    $scope.PreOpObj.DocumentsDataLog = resp[0].data.DocumentsDataLog || [];

                    $scope.PreOpObj.PreviousAnesthesticsLog = resp[0].data.PreviousAnesthesticsLog || [];
                    $scope.PreOpObj.AnestheticPlanTypeLog = resp[0].data.AnestheticPlanTypeLog || [];
                    $scope.PreOpObj.LabInvestigationsLog = resp[0].data.LabInvestigationsLog || [];
                    $scope.PreOpObj.DentitionArrayLog = resp[0].data.DentitionArrayLog || [];
                    $scope.PreOpObj.PrescriptionArrayLog = resp[0].data.PrescriptionArrayLog || [];
                    $scope.PreOpObj.AllergiesLog = resp[0].data.AllergiesLog || [];
                    $scope.PreOpObj.SurgicalHistoryLog = resp[0].data.SurgicalHistoryLog || [];
                    $scope.PreOpObj.CurrentSystemicMedicationsLog = resp[0].data.CurrentSystemicMedicationsLog || [];
                    $scope.PreOpObj.CurrentEyeMedicationsLog = resp[0].data.CurrentEyeMedicationsLog || [];
                    $scope.PreOpObj.SystemicHistoryLog = resp[0].data.SystemicHistoryLog || [];
                    $scope.PreOpObj.ImplantsLog = resp[0].data.ImplantsLog || [];
                    $scope.PreOpObj.IntraNurseCheckOutLog = resp[0].data.IntraNurseCheckOutLog || [];
                    $scope.PreOpObj.AnesthesiaMedications = resp[0].data.MedicationsLog || [];

                    $scope.PreOpObj.AnesthesiaVitals = resp[0].data.AnesthesiaVitals || [];

                    //let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                    //    return kitem.ProcedureId == 506 || kitem.ProcedureId == 840 || kitem.ProcedureId == 841 || kitem.ProcedureId == 842
                    //        || kitem.ProcedureId == 844 || kitem.ProcedureId == 845 || kitem.ProcedureId == 846 || kitem.ProcedureId == 847
                    //        || kitem.ProcedureId == 848 || kitem.ProcedureId == 849 || kitem.ProcedureId == 850 || kitem.ProcedureId == 851
                    //        || kitem.ProcedureId == 848 || kitem.ProcedureId == 849 || kitem.ProcedureId == 850 || kitem.ProcedureId == 851
                    //        || kitem.ProcedureId == 863 || kitem.ProcedureId == 864 || kitem.ProcedureId == 865 || kitem.ProcedureId == 852
                    //        || kitem.ProcedureId == 863 || kitem.ProcedureId == 864 || kitem.ProcedureId == 865 || kitem.ProcedureId == 852

                    //});
                }
            });

        }
        $scope.init();
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }]);
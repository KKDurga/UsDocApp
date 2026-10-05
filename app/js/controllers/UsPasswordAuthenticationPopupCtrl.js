"use strict";
eHnoteWebApp.controller("UsPasswordAuthenticationPopupCtrl", ["$scope", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService", "$uibModalInstance", "obj", "$filter", function ($scope, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService, $uibModalInstance, obj, $filter) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
    }

    let resolveObj = obj || "";


    $scope.AdmitUserList = angular.copy(resolveObj.allUserList) || [];
    $scope.PreOPUserList = angular.copy(resolveObj.allUserList) || [];
    $scope.allUserList = angular.copy(resolveObj.allUserList) || [];
    if ($scope.allUserList.length > 0) {
      

        $scope.SurgeonArray = angular.copy($scope.allUserList).filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
        //$scope.SurgeonArray = $scope.SurgeonArray.filter((x) => x.SuffixId == 10);
    }
    function SignOffPasswordObj() {
        var obj1 = {
            "SignOffPassword": "",
            "Remarks": "",
            "ContinueSignOff": false,
            "DoctorId": null,
            "Type": resolveObj.Type
        }
        return obj1;
    }
    $scope.SignOffPasswordObj = SignOffPasswordObj();


    function OverallSignOffPasswordObj() {
        var obj1 = {
            "SignOffPassword": "",
            "Remarks": "",
            "ContinueSignOff": false,
            "DoctorId": null,
            "Type": resolveObj.Type,
            "Screen": resolveObj.Screen
        }
        return obj1;
    }
    $scope.OverallSignOffPasswordObj = OverallSignOffPasswordObj();
    if (resolveObj.Screen == 'Chart') {
        //$scope.signoffUserObj.NurseAccess = true;
        //$scope.signoffUserObj.IsNurseUnSign = false;
        let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': resolveObj.DoctorId }, true);
        if (loggedUser.length > 0) {
            $scope.SignOffPasswordObj.DoctorId = loggedUser[0].DoctorID;
        }
    }

    $scope.FinalReviewbyobj = {

        "AdmitReviewBy": null,
        "IntraCheckinCheckReviewedBy": null,
        "IntraOPReviewAnesthetistId": null,
        "IntraOPReviewDoctorId": null,
        "IntraOPReviewNurseId": null,
        "IntraOpTechnicianId": null,
        "PostOpDischargeReviewedBy": null,
        "PostOpReviewAnesthetistId": null,
        "PostOpReviewDoctorId": null,
        "PostOpReviewNurseId": null,
        "PreOPOverallReviewedBy": null,
        "AnesthesiaPreAdmReviewedBy": null,
        "CardiologistPreAdmReviewedBy": null,
    }

    $scope.AccessUserlist = [];
    $scope.UnsignVisit = function () {
        let obj = {
            "OrganizationId": $scope.HospitalId,
            "AccessRightId": 561
        }
        eHnoteMainAdminServices.GetAccessRightsUsersByOrganizationId(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status == "Success") {
                $scope.AccessUserlist = resp.data.rows || [];
            }

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }


    if (resolveObj.Type == 'VisitReason') {
        $scope.UnsignVisit();
    }


    if (resolveObj.Screen == 'ASCOverallSignoff' || resolveObj.Screen == 'PreAdmOverallSignoff') {
        let req = {
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
        }

        $q.all([
            eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.SubOrganizationId, $scope.HospitalId),
            eHnoteSurgeryService.GetASCAllReviewedBy(req),


        ]).then(function (resp) {

            if (resp[0].data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp[0].data.row || [];
                $scope.listSubSplArray = angular.copy(resp[0].data.row) || [];
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });

                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
                var reqObj = {
                    "BranchId": $scope.HospitalId,
                    "SubSpecializationIdArray": subSplArray
                }

                eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                function onGetUsersSuccess(resp) {
                    $scope.allUserList = [];
                    

                    if (resp.rows.length > 0) {
                        $scope.allUserList = resp.rows || [];
                        $scope.AllDoctorList = angular.copy($scope.allUserList);
                        $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });

                        $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 43);
                        $scope.AnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 30);
                        $scope.SurgeonArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43 || x.RoleId == 16);
                        $scope.NurseArray = $scope.allUserList.filter((x) => x.RoleId == 8);
                        $scope.TechnicianArray = $scope.allUserList.filter((x) => x.RoleId == 10 || x.RoleId == 38);
                        $scope.AllCardiologistList = $scope.allUserList.filter((x) => x.RoleId == 72 || x.RoleId == 8) || [];
                        $scope.AllAnesthetistList = [];
                        if ($scope.allUserList.length > 0) {
                            angular.forEach($scope.allUserList, function (item) {
                                if (item.RoleId == 30 || item.RoleId == 8|| item.RoleId == 1 || item.RoleId == 43) {
                                    $scope.AllAnesthetistList.push(item);
                                }
                            })
                        };
                    }
                }
                function onGetUsersFailure(data) {
                }
            }

            if (resp[1].data.status == "Success") {
                $scope.SelectedReviewobj = resp[1].data;

                $scope.FinalReviewbyobj.AnesthesiaPreAdmReviewedBy = $scope.SelectedReviewobj.AnesthesiaPreAdmReviewedBy || null;
                $scope.FinalReviewbyobj.CardiologistPreAdmReviewedBy = $scope.SelectedReviewobj.CardiologistPreAdmReviewedBy || null;


                $scope.FinalReviewbyobj.AdmitReviewBy = $scope.SelectedReviewobj.AdmitReviewBy||null;
                $scope.FinalReviewbyobj.IntraCheckinCheckReviewedBy = $scope.SelectedReviewobj.IntraCheckinCheckReviewedBy||null;
                $scope.FinalReviewbyobj.IntraOPReviewAnesthetistId = $scope.SelectedReviewobj.IntraOPReviewAnesthetistId||null;
                $scope.FinalReviewbyobj.IntraOPReviewDoctorId = $scope.SelectedReviewobj.IntraOPReviewDoctorId||null;
                $scope.FinalReviewbyobj.IntraOPReviewNurseId = $scope.SelectedReviewobj.IntraOPReviewNurseId||null;
                $scope.FinalReviewbyobj.IntraOpTechnicianId = $scope.SelectedReviewobj.IntraOpTechnicianId||null;
                $scope.FinalReviewbyobj.PostOpDischargeReviewedBy = $scope.SelectedReviewobj.PostOpDischargeReviewedBy||null;
                $scope.FinalReviewbyobj.PostOpReviewAnesthetistId = $scope.SelectedReviewobj.PostOpReviewAnesthetistId||null;
                $scope.FinalReviewbyobj.PostOpReviewDoctorId = $scope.SelectedReviewobj.PostOpReviewDoctorId||null;
                $scope.FinalReviewbyobj.PostOpReviewNurseId = $scope.SelectedReviewobj.PostOpReviewNurseId||null;
                $scope.FinalReviewbyobj.PreOPOverallReviewedBy = $scope.SelectedReviewobj.PreOPOverallReviewedBy||null;



            }

        });

    }

    $scope.Signoffoverallasc = function () {

        $scope.FinalReviewbyobj.AdmitReviewBy = $scope.FinalReviewbyobj.AdmitReviewBy || null;
        $scope.FinalReviewbyobj.PreOPOverallReviewedBy = $scope.FinalReviewbyobj.PreOPOverallReviewedBy || null;
        $scope.FinalReviewbyobj.IntraOPReviewDoctorId = $scope.FinalReviewbyobj.IntraOPReviewDoctorId || null;
        $scope.FinalReviewbyobj.IntraOPReviewAnesthetistId = $scope.FinalReviewbyobj.IntraOPReviewAnesthetistId || null;
        $scope.FinalReviewbyobj.IntraOpTechnicianId = $scope.FinalReviewbyobj.IntraOpTechnicianId || null;
        $scope.FinalReviewbyobj.PostOpReviewDoctorId = $scope.FinalReviewbyobj.PostOpReviewDoctorId || null;

        if ($scope.FinalReviewbyobj.AdmitReviewBy == null) {
            alertify.error("Please Select Admit-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.PreOPOverallReviewedBy == null) {
            alertify.error("Please Select PreOP-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.IntraOPReviewDoctorId == null) {
            alertify.error("Please Select IntraOP-Doctor-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.IntraOPReviewNurseId == null) {
            alertify.error("Please Select IntraOP-Nurse-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.IntraOPReviewAnesthetistId == null) {
            alertify.error("Please Select IntraOP-Anesthetist-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.IntraOpTechnicianId == null) {
            alertify.error("Please Select IntraOP-Technician-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.PostOpReviewDoctorId == null) {
            alertify.error("Please Select PostOp-Doctor-Reviewed By");
            return false;
        }

        if ($scope.FinalReviewbyobj.PostOpReviewNurseId == null) {
            alertify.error("Please Select PostOp-Nurse-Reviewed By");
            return false;
        }
        if ($scope.FinalReviewbyobj.PostOpReviewAnesthetistId == null) {
            alertify.error("Please Select PostOp-Anesthetist-Reviewed By");
            return false;
        }
        if ($scope.SignOffPasswordObj.SignOffPassword == "") {
            alertify.error("Please Enter Valid Password");
            return false;
        }
        //if ($scope.SignOffPasswordObj.Remarks == "") {
        //    alertify.error("Please Enter Remarks");
        //    return false;
        //}
        let DoctorId = $scope.cacheStorageItem.DoctorID;

        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            "DoctorId": DoctorId || null,
            "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
            "Screen": resolveObj.Screen,
            "Type": resolveObj.Type,
            "Remarks": $scope.SignOffPasswordObj.Remarks || ""
        }

        eHnoteSettingsDataService.GetValidateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
        function getSignoffPWDSuccess(data) {
            if (data.status == "Success") {
                let obj = {
                    "UserId": $scope.UserId,
                    "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                    "AdmitReviewBy": $scope.FinalReviewbyobj.AdmitReviewBy || null,
                    "IntraCheckinCheckReviewedBy": $scope.FinalReviewbyobj.IntraCheckinCheckReviewedBy,
                    "IntraOPReviewAnesthetistId": $scope.FinalReviewbyobj.IntraOPReviewAnesthetistId,
                    "IntraOPReviewDoctorId": $scope.FinalReviewbyobj.IntraOPReviewDoctorId,
                    "IntraOPReviewNurseId": $scope.FinalReviewbyobj.IntraOPReviewNurseId,
                    "IntraOpTechnicianId": $scope.FinalReviewbyobj.IntraOpTechnicianId,
                    "PostOpDischargeReviewedBy": $scope.FinalReviewbyobj.PostOpDischargeReviewedBy,
                    "PostOpReviewAnesthetistId": $scope.FinalReviewbyobj.PostOpReviewAnesthetistId,
                    "PostOpReviewDoctorId": $scope.FinalReviewbyobj.PostOpReviewDoctorId,
                    "PostOpReviewNurseId": $scope.FinalReviewbyobj.PostOpReviewNurseId,
                    "PreOPOverallReviewedBy": $scope.FinalReviewbyobj.PreOPOverallReviewedBy,
                }

                eHnoteSurgeryService.UpdateAscSignoffByAppointment(obj).then(function (resp) {
                    if (resp.data.status === "Success") {
                        console.log(resp.data);
                        $uibModalInstance.close();
                    }
                });
            } else {
                alertify.error(data.Message);
            }
        }
        function getSignoffPWDError(err) {
            console.log(err);
        }




    }
    $scope.SignoffoverallPreAdm = function () {

        $scope.FinalReviewbyobj.CardiologistPreAdmReviewedBy = $scope.FinalReviewbyobj.CardiologistPreAdmReviewedBy || null;
        $scope.FinalReviewbyobj.AnesthesiaPreAdmReviewedBy = $scope.FinalReviewbyobj.AnesthesiaPreAdmReviewedBy || null;



        if ($scope.FinalReviewbyobj.AnesthesiaPreAdmReviewedBy == null) {
            alertify.error("Please select the anaesthetist");
            return false;
        }

        if ($scope.FinalReviewbyobj.CardiologistPreAdmReviewedBy == null) {
            alertify.error("Please select the Cardiology");
            return false;
        }
    
        if ($scope.SignOffPasswordObj.SignOffPassword == "") {
            alertify.error("Please Enter Valid Password");
            return false;
        }
        //if ($scope.SignOffPasswordObj.Remarks == "") {
        //    alertify.error("Please Enter Remarks");
        //    return false;
        //}
        let DoctorId = $scope.cacheStorageItem.DoctorID;

        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            "DoctorId": DoctorId || null,
            "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
            "Screen": resolveObj.Screen,
            "Type": resolveObj.Type,
            "Remarks": $scope.SignOffPasswordObj.Remarks || ""
        }

        eHnoteSettingsDataService.GetValidateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
        function getSignoffPWDSuccess(data) {
            if (data.status == "Success") {
                let obj = {
                    "UserId": $scope.UserId,
                    "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                    "AnesthesiaPreAdmReviewedBy": $scope.FinalReviewbyobj.AnesthesiaPreAdmReviewedBy || null,
                    "CardiologistPreAdmReviewedBy": $scope.FinalReviewbyobj.CardiologistPreAdmReviewedBy,
                 
                }

                eHnoteSurgeryService.UpdatePreAdmissionSignoffByAppointment(obj).then(function (resp) {
                    if (resp.data.status === "Success") {
                        console.log(resp.data);
                        $uibModalInstance.close();
                    }
                });
            } else {
                alertify.error(data.Message);
            }
        }
        function getSignoffPWDError(err) {
            console.log(err);
        }




    }

    $scope.CanclsignoffPopup = function () {
        $uibModalInstance.dismiss("cancel");
        $scope.SignOffPasswordObj.SignOffPassword = "";
        $scope.SignOffPasswordObj.ContinueSignOff = false;
    };


    $scope.ChangeSignOffpwd = function (pwd) {
        if ($scope.SignOffPasswordObj.ContinueSignOff) {
            $scope.SignOffPasswordObj.ContinueSignOff = false;
        }
    }

    $scope.ValidateSignOffPassword = function () {

        let DoctorId = $scope.SignOffPasswordObj.DoctorId;
        if (resolveObj.Type == 'VisitReason') {
            $scope.SignOffPasswordObj.DoctorId = $scope.SignOffPasswordObj.DoctorId || null;
            if ($scope.SignOffPasswordObj.DoctorId == null) {
                alertify.error("Select User");
                return false;
            }
            DoctorId = $scope.SignOffPasswordObj.DoctorId;
        }
        $scope.SignOffPasswordObj.SignOffPassword = $scope.SignOffPasswordObj.SignOffPassword || "";
        if ($scope.SignOffPasswordObj.SignOffPassword == "") {
            alertify.error("Please Enter Valid Password");
            return false;
        }
        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.cacheStorageItem.AppointmentId||0,
            "DoctorId": DoctorId || null,
            "VisitId": resolveObj.VisitId || 0,
            "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
            "Screen": resolveObj.Screen,
            "Type": resolveObj.Type,
            "Remarks": $scope.SignOffPasswordObj.Remarks || "",
            "AmbientSessionId": resolveObj.AmbientSessionId,
            "TreatmentPlanId": resolveObj.TreatmentPlanId
        }

        eHnoteSettingsDataService.GetValidateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
        function getSignoffPWDSuccess(data) {
            if (data.status == "Success") {
                $uibModalInstance.close();
               // $scope.SignOffPasswordObj.ContinueSignOff = true;
            } else {
                alertify.error(data.Message);
            }
        }
        function getSignoffPWDError(err) {
            console.log(err);
        }
    };

    $scope.ContinueSignOffRequired = function () {
        $scope.SignOffPasswordObj.SignOffPassword = "";
        $uibModalInstance.close();
    }




}]);

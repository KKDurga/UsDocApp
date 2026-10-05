

"use strict";
eHnoteWebApp.controller("UsSignOffPasswordPopupCtrl", ["$scope", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService", "$uibModalInstance", "obj", "$filter", function ($scope, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService, $uibModalInstance, obj, $filter) {

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
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = $scope.userLoginDetails.RoleID || 0;
    let resolveObj = obj || "";
    $scope.autosighnoff = false;
    if (resolveObj != '') {
        resolveObj.IsAutoSighnOff = resolveObj.IsAutoSighnOff || false
        $scope.autosighnoff = resolveObj.IsAutoSighnOff || false;
        $scope.LogObj = resolveObj.LogObj || {};
        resolveObj.screenlist = resolveObj.screenlist || [];
        resolveObj.FacesheetLastSignOffUserDetails = resolveObj.FacesheetLastSignOffUserDetails || [];
        $scope.IsshowBulkSignrefreshButton = resolveObj.IsshowBulkSignrefreshButton || false;
        $scope.ConsentformSignatureIndication = resolveObj.ConsentformSignatureIndication || '';
        $scope.consentsMainObj = resolveObj.consentsMainObj || {};
    }
    $scope.allUserList = angular.copy(resolveObj.allUserList) || [];
    $scope.CoordinatorList = [];
    /* A LASIK phase is nurse / ASC-technician work, so that sign-off offers both
       roles. Every other sign-off keeps its nurses-only list. */
    $scope.IsLasikSignOff = resolveObj.IsLasikSignOff || false;

    if ($scope.allUserList.length > 0) {
        $scope.NurseArray = angular.copy($scope.allUserList).filter((x) => $scope.IsLasikSignOff ? (x.RoleId == 8 || x.RoleId == 38) : x.RoleId == 8) || [];

        $scope.AllAnesthetistList = angular.copy($scope.allUserList).filter((x) => x.RoleId == 30 || x.RoleId == 25) || []; //x.RoleId == 25
        $scope.AllCardiologistList = angular.copy($scope.allUserList).filter((x) => x.RoleId == 72) || [];

        $scope.CoordinatorList = angular.copy($scope.allUserList).filter((x) => x.RoleId == 18) || [];

        $scope.SurgeonArray = angular.copy($scope.allUserList).filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
        $scope.SurgeonArray = $scope.SurgeonArray.filter((x) => x.SuffixId == 10);
    }

    function SignOffPasswordObj() {
        var obj1 = {
            "SignOffPassword": "",
            "Remarks": "",
            "ContinueSignOff": false,
            "DoctorId": null,
            "Type": resolveObj.Type,
            "UserType": resolveObj.UserType,
            "Screen": resolveObj.Screen,
            "screenlist": resolveObj.screenlist||[]
        }
        return obj1;
    }
    $scope.SignOffPasswordObj = SignOffPasswordObj();
    $scope.iSshowconsentalertscreen = false;
    if (($scope.SignOffPasswordObj.Screen == 'PreOp' && $scope.SignOffPasswordObj.UserType == "Anesthesia") || $scope.SignOffPasswordObj.Screen == 'PostOp-R1' || $scope.SignOffPasswordObj.Screen == 'PostOp-R2' || $scope.SignOffPasswordObj.Screen == 'OperativeNotes' || $scope.SignOffPasswordObj.Type == 'bulksignoff') {
        if ($scope.SignOffPasswordObj.Type == 'SignOff' || $scope.SignOffPasswordObj.Type == 'bulksignoff') {
            $scope.iSshowconsentalertscreen = true;
        }
    }

    $scope.FinalReviewbyobj = {

        "NurseId": null,
        "AnesthetistId": null,
        "SurgeonId": null,
        "NursePassword": '',
        "AnesthetistPassword": '',
        "SurgeonPassword": '',

    }





    $scope.ValidateSignOffPassword = function (type) {

        let DoctorId = null;
        let IsNurse = false;
        let IsAnesthesia = false;
        let IsSurgeon = false;
        let IsCardiologist = false;
        $scope.FinalReviewbyobj.NurseId = $scope.FinalReviewbyobj.NurseId || null;
        if (type == 'Nurse') {
            $scope.SignOffPasswordObj.SignOffPassword = $scope.FinalReviewbyobj.NursePassword || "";
            DoctorId = $scope.FinalReviewbyobj.NurseId || null;
            IsNurse = true;

        }
        if (type == 'Anesthetist') {
            DoctorId = $scope.FinalReviewbyobj.AnesthetistId || null;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.FinalReviewbyobj.AnesthetistPassword || "";
            IsAnesthesia = true;
        }
        if (type == 'Surgeon') {
            DoctorId = $scope.FinalReviewbyobj.SurgeonId || null;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.FinalReviewbyobj.SurgeonPassword || "";
            IsSurgeon = true;
        }
        if (type == 'Cardiologist') {
            DoctorId = $scope.FinalReviewbyobj.CardiologistId || null;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.FinalReviewbyobj.CardiologistPassword || "";
            IsCardiologist = true;
        }

        if (DoctorId == null) {
            alertify.error("Select User");
            return false;
        }
        let loggedUser = $filter('filter')($scope.allUserList, { 'DoctorID': DoctorId }, true);
        if (loggedUser) {
            console.log(loggedUser.doctorname); // Output: Dr. Jones
        } else {
            console.log("Doctor not found");
        }
        $scope.SignOffPasswordObj.SignOffPassword = $scope.SignOffPasswordObj.SignOffPassword || "";
        if ($scope.SignOffPasswordObj.SignOffPassword == "") {
            alertify.error("Please Enter Valid Password");
            return false;
        }
        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            "DoctorId": DoctorId || null,
            "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
            "Screen": resolveObj.Screen,
            "Type": resolveObj.Type,
            "IsNurse": IsNurse || false,
            "IsAnesthesia": IsAnesthesia || false,
            "IsCardiologist": IsCardiologist || false,
            "IsSurgeon": IsSurgeon || false,
            "Remarks": $scope.SignOffPasswordObj.Remarks || "",
            "IsAutoSighnOff": false,
        }
        eHnoteSettingsDataService.GetValidateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
        function getSignoffPWDSuccess(data) {
            if (data.status == "Success") {
                if (IsNurse == true) {
                    $scope.FinalReviewbyobj.IsUnSignNurse = true;
                }
                if (IsAnesthesia == true) {
                    $scope.FinalReviewbyobj.IsUnSignAnesthesia = true;
                }
                if (IsSurgeon == true) {
                    $scope.FinalReviewbyobj.IsUnSignSurgeon = true;
                }
                if (IsCardiologist == true) {
                    $scope.FinalReviewbyobj.IsUnSignCardiologist = true;
                }
                if (resolveObj.Screen == 'Facesheet') {
                    $uibModalInstance.close(params);
                }

                if (resolveObj.Screen == 'OperativeNotes' || resolveObj.Screen == 'OperativeNotesAddendum' || resolveObj.Screen == 'Anesthesia PreAdmission' || resolveObj.Screen == 'Cardiology PreAdmission') {
                    $uibModalInstance.close(params);
                }


                if (params.Type == "SignOff") {
                    alertify.success('Successfully Signed Off');
                } else {
                    alertify.success('Successfully Unsigned ');
                }


            } else {
                alertify.error(data.Message);

            }
        }
        function getSignoffPWDError(err) {
            console.log(err);
        }
    };



    $scope.ContinueSignOffRequired = function () {

        if ($scope.SignOffPasswordObj.Type == 'Unsign') {
            if ($scope.FinalReviewbyobj.NurseId != null && $scope.FinalReviewbyobj.IsUnSignNurse == false) {
                alertify.error("Please Enter Nurse Valid Password");
                return false;
            }
            if ($scope.FinalReviewbyobj.AnesthetistId != null && $scope.FinalReviewbyobj.IsUnSignAnesthesia == false) {
                alertify.error("Please Enter Anesthetis Valid Password");
                return false;
            }
            if ($scope.FinalReviewbyobj.SurgeonId != null && $scope.FinalReviewbyobj.IsUnSignSurgeon == false) {
                alertify.error("Please Enter Surgeon Valid Password");
                return false;
            }
            if ($scope.FinalReviewbyobj.CardiologistId != null && $scope.FinalReviewbyobj.IsUnSignCardiologist == false) {
                alertify.error("Please Enter Cardiologist Valid Password");
                return false;
            }
            $uibModalInstance.close();
        } else {
            if ($scope.SignOffPasswordObj.Type == 'SignOff') {
                if (($scope.FinalReviewbyobj.NurseId != null && $scope.FinalReviewbyobj.IsUnSignNurse == true) || ($scope.FinalReviewbyobj.SurgeonId != null && $scope.FinalReviewbyobj.IsUnSignSurgeon == true) || ($scope.FinalReviewbyobj.AnesthetistId != null && $scope.FinalReviewbyobj.IsUnSignAnesthesia == true) || ($scope.FinalReviewbyobj.CardiologistId != null && $scope.FinalReviewbyobj.IsUnSignCardiologist == true)) {
                    $uibModalInstance.close();
                }
                else {
                    alertify.error("Please Enter User Name and Enter Valid Password");
                    return false;
                }

            }

        }

    }

    $scope.CanclsignoffPopup = function () {
        $uibModalInstance.dismiss("cancel");
        $scope.SignOffPasswordObj.SignOffPassword = "";
        $scope.SignOffPasswordObj.ContinueSignOff = false;
    };
    $scope.CanclsignoffPopupForRecoveryScreens = function () {
        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            "DoctorId": $scope.SignOffPasswordObj.DoctorId || null,
            "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
            "Screen": resolveObj.Screen,
            "Type": resolveObj.Type,
            "UserType": resolveObj.UserType,
            "Remarks": $scope.SignOffPasswordObj.Remarks || "",
            "IsNurseSignValid": $scope.IsNurseSignValid || false,
            "IsAnesthesiaSignValid": $scope.IsAnesthesiaSignValid || false,
            "AnesthesiaUserId": $scope.signoffUserObj.AnesthesiaUserId || null,
            "NurseUserId": $scope.signoffUserObj.NurseUserId || null,
        }
        $uibModalInstance.close(params);
        $scope.SignOffPasswordObj.SignOffPassword = "";
        $scope.SignOffPasswordObj.ContinueSignOff = false;
    };

    $scope.signoffUserObj = {
        "NurseAccess": false,
        "NurseUserId": 0,
        "NurseUserObj": "",
        "NursePassword": "",
        "IsNurseUnSign": false,
        "NurseUnSignRemarks": "",
        "AnesthesiaAccess": false,
        "AnesthesiaUserId": 0,
        "IsAnesthesiaUnSign": false,
        "AnesthesiaUserObj": "",
        "AnesthesiaPassword": "",
        "AnesthesiaUnSignRemarks": "",
        "SurgeonAccess": false,
        "SurgeonUserId": 0,
        "IsSurgeonUnSign": false,
        "SurgeonUserObj": "",
        "SurgeonUnSignRemarks": "",
        "CardiologistAccess": false,
        "CardiologistUserId": null,
        "IsCardiologistUnSign": false,
        "CardiologistUserObj": "",
        "CardiologistUnSignRemarks": "",
        "CoordinatorAccess": false,
        "CoordinatorId": null,
        "IsCoordinatorUnSign": false,
        "CoordinatorObj": "",
        "CoordinatorUnSignRemarks": "",
        "CoordinatorPassword": "",
    };

    let PostOpObj = resolveObj.PostOpObj || {};
    PostOpObj.R2PostOpNurseChartStatus = PostOpObj.R2PostOpNurseChartStatus || '';
    PostOpObj.R2PostOpAnesthesiaChartStatus = PostOpObj.R2PostOpAnesthesiaChartStatus || '';
    PostOpObj.PostOpNurseChartStatus = PostOpObj.PostOpNurseChartStatus || '';
    PostOpObj.PostOpAnesthesiaChartStatus = PostOpObj.PostOpAnesthesiaChartStatus || '';
    console.log(resolveObj.UserType + "__" + resolveObj.Type);
    if ($scope.SignOffPasswordObj.Screen != 'PostOp-R1' && $scope.SignOffPasswordObj.Screen != 'PostOp-R2') {
        if (resolveObj.UserType == 'Anesthesia' && (resolveObj.Type == 'SignOff' || resolveObj.Type == 'Save')) {
            $scope.signoffUserObj.AnesthesiaAccess = true;
            $scope.signoffUserObj.IsAnesthesiaUnSign = false;

            let loggedUser = $filter('filter')($scope.AllAnesthetistList, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                $scope.signoffUserObj.AnesthesiaUserId = loggedUser[0].DoctorID;
            }
        }
        else if (resolveObj.UserType == 'Nurse' && resolveObj.Type == 'SignOff') {
            $scope.signoffUserObj.NurseAccess = true;
            $scope.signoffUserObj.IsNurseUnSign = false;
            let loggedUser = $filter('filter')($scope.NurseArray, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                $scope.signoffUserObj.NurseUserId = loggedUser[0].DoctorID;
            }
        }
        else if (resolveObj.UserType == 'Surgeon' && resolveObj.Type == 'SignOff') {
            $scope.signoffUserObj.SurgeonAccess = true;
            $scope.signoffUserObj.IsSurgeonUnSign = false;
            $scope.cacheStorageItem.selectedApptObj = $scope.cacheStorageItem.selectedApptObj || '';
            //for facesheet,discharge,operative
            if ($scope.SignOffPasswordObj.Screen == "Facesheet" || $scope.SignOffPasswordObj.Screen == "Discharge" || $scope.SignOffPasswordObj.Screen == "OperativeNotes") {
                let DoctorID = 0;
                if ($scope.cacheStorageItem.selectedApptObj != '') {
                    DoctorID = $scope.cacheStorageItem.selectedApptObj.DoctorID || 0
                }
                let loggedUser = [];
                if (DoctorID != 0) {
                    loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': DoctorID }, true);

                } else {
                    loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true);

                }
                if (loggedUser.length > 0) {
                    $scope.signoffUserObj.SurgeonUserId = loggedUser[0].DoctorID;
                }
            } else {
                let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    $scope.signoffUserObj.SurgeonUserId = loggedUser[0].DoctorID;
                    /*$scope.FinalReviewbyobj.SurgeonId = loggedUser[0].DoctorID;*/
                }
            }
            //for facesheet,discharge,operative login doctor

        }
        else if (resolveObj.UserType == 'Cardiologist' && resolveObj.Type == 'SignOff') {
            $scope.signoffUserObj.CardiologistAccess = true;
            $scope.signoffUserObj.IsCardiologistUnSign = false;
            let loggedUser = $filter('filter')($scope.AllCardiologistList, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                $scope.signoffUserObj.CardiologistUserId = loggedUser[0].DoctorID;
            }
        }
        else if (resolveObj.UserType == 'Nurse' && resolveObj.Type == 'bulksignoff') {
            $scope.signoffUserObj.NurseAccess = true;
            $scope.signoffUserObj.IsNurseUnSign = false;
            let loggedUser = $filter('filter')($scope.NurseArray, { 'DoctorID': $scope.UserId }, true) || [];
            if (loggedUser.length > 0) {
                $scope.signoffUserObj.NurseUserId = loggedUser[0].DoctorID;
            }
        }
        else if (resolveObj.UserType == 'Anesthesia' && resolveObj.Type == 'bulksignoff') {
            $scope.signoffUserObj.AnesthesiaAccess = true;
            $scope.signoffUserObj.IsAnesthesiaUnSign = false;

            let loggedUser = $filter('filter')($scope.AllAnesthetistList, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                $scope.signoffUserObj.AnesthesiaUserId = loggedUser[0].DoctorID;
            }
        }
        else if (resolveObj.UserType == 'Surgeon' && resolveObj.Type == 'bulksignoff') {
            $scope.signoffUserObj.SurgeonAccess = true;
            $scope.signoffUserObj.IsSurgeonUnSign = false;
            //if ($scope.cacheStorageItem.DoctorID != $scope.UserId) {
            //    $scope.signoffUserObj.IsSurgeonUnSign = true;
            //}
            $scope.cacheStorageItem.selectedApptObj = $scope.cacheStorageItem.selectedApptObj || '';
            //for facesheet,discharge,operative
            if ($scope.SignOffPasswordObj.Screen == "Facesheet" || $scope.SignOffPasswordObj.Screen == "Discharge" || $scope.SignOffPasswordObj.Screen == "OperativeNotes") {
                let DoctorID = 0;
                if ($scope.cacheStorageItem.selectedApptObj != '') {
                    DoctorID = $scope.cacheStorageItem.selectedApptObj.DoctorID || 0
                }
                let loggedUser = [];
                if (DoctorID != 0) {
                    loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': DoctorID }, true);

                } else {
                    loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true);

                }
                if (loggedUser.length > 0) {
                    $scope.signoffUserObj.SurgeonUserId = loggedUser[0].DoctorID;
                }
            } else {
                let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    $scope.signoffUserObj.SurgeonUserId = loggedUser[0].DoctorID;
                    /*$scope.FinalReviewbyobj.SurgeonId = loggedUser[0].DoctorID;*/
                }
            }
        }
        else if (resolveObj.UserType == 'Coordinator' && resolveObj.Type == 'SignOff') {
            $scope.signoffUserObj.CoordinatorAccess = true;
            $scope.signoffUserObj.IsCoordinatorUnSign = false;

            let loggedUser = $filter('filter')($scope.CoordinatorList, { 'DoctorID': $scope.UserId }, true);
            if (loggedUser.length > 0) {
                $scope.signoffUserObj.CoordinatorId = loggedUser[0].DoctorID;
            }
        } else {

        }
    } else {
        if ($scope.RoleId == 8 || $scope.RoleId == 25 || $scope.RoleId == 30) {
            if (resolveObj.UserType == 'Anesthesia' && (resolveObj.Type == 'SignOff' || resolveObj.Type == 'Save')) {
                $scope.signoffUserObj.AnesthesiaAccess = true;
                $scope.signoffUserObj.IsAnesthesiaUnSign = false;

                let loggedUser = $filter('filter')($scope.AllAnesthetistList, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    $scope.signoffUserObj.AnesthesiaUserId = loggedUser[0].DoctorID;
                }
            }
            else if (resolveObj.UserType == 'Nurse' && resolveObj.Type == 'SignOff') {
                $scope.signoffUserObj.NurseAccess = true;
                $scope.signoffUserObj.IsNurseUnSign = false;
                let loggedUser = $filter('filter')($scope.NurseArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    $scope.signoffUserObj.NurseUserId = loggedUser[0].DoctorID;
                }
            }
        } else {
            if (resolveObj.Type == 'SignOff') {
                if (($scope.SignOffPasswordObj.Screen == "PostOp-R2" && PostOpObj.R2PostOpAnesthesiaChartStatus != 'E') || ($scope.SignOffPasswordObj.Screen == "PostOp-R1" && PostOpObj.PostOpAnesthesiaChartStatus != 'E')) {

                    $scope.signoffUserObj.AnesthesiaAccess = true;
                    $scope.signoffUserObj.IsAnesthesiaUnSign = false;

                    let AnesthetistloggedUser = $filter('filter')($scope.AllAnesthetistList, { 'DoctorID': $scope.UserId }, true);
                    if (AnesthetistloggedUser.length > 0) {
                        $scope.signoffUserObj.AnesthesiaUserId = AnesthetistloggedUser[0].DoctorID;
                    }
                }
                if (($scope.SignOffPasswordObj.Screen == "PostOp-R2" && PostOpObj.R2PostOpNurseChartStatus != 'E') || ($scope.SignOffPasswordObj.Screen == "PostOp-R1" && PostOpObj.PostOpNurseChartStatus != 'E')) {

                    $scope.signoffUserObj.NurseAccess = true;
                    $scope.signoffUserObj.IsNurseUnSign = false;
                    let NurseloggedUser = $filter('filter')($scope.NurseArray, { 'DoctorID': $scope.UserId }, true);
                    if (NurseloggedUser.length > 0) {
                        $scope.signoffUserObj.NurseUserId = NurseloggedUser[0].DoctorID;
                    }
                }

            }
        }
    }

    if ($scope.SignOffPasswordObj.Type == 'Unsign' && $scope.SignOffPasswordObj.Screen == "Facesheet") {
        $scope.LastSignOffUserDetails = angular.copy(resolveObj.FacesheetLastSignOffUserDetails) || [];
        if ($scope.LastSignOffUserDetails.length > 0) {
            var Temparray1 = $filter("filter")($scope.LastSignOffUserDetails, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen }, true);
            if (Temparray1.length > 1 && $scope.SignOffPasswordObj.UserType == 'Nurse') {

                var Temparray = $filter("filter")($scope.LastSignOffUserDetails, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.LatestStatus == "SignOff" }, true);

            }
            else if (Temparray1.length > 1 && $scope.SignOffPasswordObj.UserType == "Surgeon") {
                var Temparray = $filter("filter")($scope.LastSignOffUserDetails, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.UserType == "Surgeon" }, true);

            }
            else {
                Temparray = Temparray1
            }
            if (Temparray.length > 0) {
                if ($scope.SignOffPasswordObj.UserType == 'Nurse') {
                    if ($scope.SignOffPasswordObj.UserType == 'Nurse' && Temparray[0].UserType == 'Surgeon') {
                        $scope.signoffUserObj.SurgeonAccess = true;
                        $scope.signoffUserObj.IsSurgeonUnSign = true;
                        $scope.signoffUserObj.SurgeonUserId = Temparray[0].UserId || null;
                        $scope.FinalReviewbyobj.SurgeonId = Temparray[0].UserId || null;
                    }
                    else {
                        $scope.signoffUserObj.NurseAccess = true;
                        $scope.signoffUserObj.IsNurseUnSign = true;
                        $scope.signoffUserObj.NurseUserId = Temparray[0].UserId || null;
                    }
                }
                if ($scope.SignOffPasswordObj.UserType == 'Surgeon') {
                    if ($scope.SignOffPasswordObj.UserType == 'Surgeon' && Temparray[0].UserType == 'Nurse') {
                        $scope.signoffUserObj.NurseAccess = true;
                        $scope.signoffUserObj.IsNurseUnSign = true;
                        $scope.signoffUserObj.NurseUserId = Temparray[0].UserId || null;
                    }
                    else {
                        $scope.signoffUserObj.SurgeonAccess = true;
                        $scope.signoffUserObj.IsSurgeonUnSign = true;
                        $scope.signoffUserObj.SurgeonUserId = Temparray[0].UserId || null;
                        $scope.FinalReviewbyobj.SurgeonId = Temparray[0].UserId || null;
                    }
                }
            }
        }
    }
    $scope.IsNurseSignValid = false;
    $scope.IsAnesthesiaSignValid = false;

    $scope.ValidateUserSignOff = function (type) {


        let DoctorId = null;
        let IsNurse = false;
        let IsAnesthesia = false;
        let IsSurgeon = false;
        let IsCardiologist = false;
        if (type == 'Nurse') {
            $scope.signoffUserObj.NurseUserId = $scope.signoffUserObj.NurseUserId || null;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.signoffUserObj.NursePassword || "";
            $scope.SignOffPasswordObj.DoctorId = $scope.signoffUserObj.NurseUserId || null;
            $scope.SignOffPasswordObj.Remarks = $scope.signoffUserObj.NurseUnSignRemarks;
        }

        if (type == 'Anesthesia') {
            $scope.signoffUserObj.AnesthesiaUserId = $scope.signoffUserObj.AnesthesiaUserId || null;
            $scope.SignOffPasswordObj.DoctorId = $scope.signoffUserObj.AnesthesiaUserId;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.signoffUserObj.AnesthesiaPassword || "";
            $scope.SignOffPasswordObj.Remarks = $scope.signoffUserObj.AnesthesiaUnSignRemarks;
        }
        if (type == 'Surgeon') {
            $scope.signoffUserObj.SurgeonUserId = $scope.signoffUserObj.SurgeonUserId || null;
            $scope.SignOffPasswordObj.DoctorId = $scope.signoffUserObj.SurgeonUserId;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.signoffUserObj.SurgeonPassword || "";
            $scope.SignOffPasswordObj.Remarks = $scope.signoffUserObj.SurgeonUnSignRemarks;
        }
        if (type == 'Cardiologist') {
            $scope.signoffUserObj.CardiologistUserId = $scope.signoffUserObj.CardiologistUserId || null;
            $scope.SignOffPasswordObj.DoctorId = $scope.signoffUserObj.CardiologistUserId;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.signoffUserObj.CardiologistPassword || "";
            $scope.SignOffPasswordObj.Remarks = $scope.signoffUserObj.CardiologistUnSignRemarks;
        };
        if (type == 'Coordinator') {
            $scope.signoffUserObj.CardiologistUserId = $scope.signoffUserObj.CoordinatorId || null;
            $scope.SignOffPasswordObj.DoctorId = $scope.signoffUserObj.CoordinatorId;
            $scope.SignOffPasswordObj.SignOffPassword = $scope.signoffUserObj.CoordinatorPassword || "";
            $scope.SignOffPasswordObj.Remarks = $scope.signoffUserObj.CoordinatorUnSignRemarks;
        };
        if (resolveObj.Type == 'bulksignoff' && resolveObj.screenlist.length>0) {
            $scope.SignOffPasswordObj.SignOffPassword = $scope.SignOffPasswordObj.SignOffPassword || "";
            if ($scope.SignOffPasswordObj.SignOffPassword == "") {
                alertify.error("Please Enter Valid Password");
                return false;
            }
            resolveObj.screenlist = resolveObj.screenlist || [];
            let params = {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "AppointmentId": resolveObj.AppointmentId,
                "DoctorId": $scope.SignOffPasswordObj.DoctorId || null,
                "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
                "Screen": resolveObj.Screen,
                "Type": "SignOff",
                "screenlist": resolveObj.screenlist,
            }
            let PreOpNurseChartStatus = resolveObj.PreOpNurseChartStatus||"";
            let PreOpAnesthesiaChartStatus = resolveObj.PreOpAnesthesiaChartStatus || "";
            let IntraOpNurseChartStatus = resolveObj.IntraOpNurseChartStatus || "";
            let IntraOpAnesthesiaChartStatus = resolveObj.IntraOpAnesthesiaChartStatus || "";
            let PostOpNurseChartStatus = resolveObj.PostOpNurseChartStatus || "";
            let PostOpAnesthesiaChartStatus = resolveObj.PostOpAnesthesiaChartStatus || "";
            let R2PostOpNurseChartStatus = resolveObj.R2PostOpNurseChartStatus || "";
            let R2PostOpAnesthesiaChartStatus = resolveObj.R2PostOpAnesthesiaChartStatus || "";

            let FaceSheetChartStatus = resolveObj.FaceSheetChartStatus || "";
            let OperativeChartStatus = resolveObj.OperativeChartStatus || "";
            let DischargeChartStatus = resolveObj.DischargeChartStatus || "";

            /* LASIK is charted one row per phase, so each phase carries its own
               status - only the phases being signed are sent */
            let LasikPreopChartStatus = resolveObj.LasikPreopChartStatus || "";
            let LasikIntraopChartStatus = resolveObj.LasikIntraopChartStatus || "";
            let LasikPostopChartStatus = resolveObj.LasikPostopChartStatus || "";
            if (PreOpNurseChartStatus !== "") {
                params["PreOpNurseChartStatus"] = PreOpNurseChartStatus;
            }

            if (PreOpAnesthesiaChartStatus !== "") {
                params["PreOpAnesthesiaChartStatus"] = PreOpAnesthesiaChartStatus;
            }

            if (IntraOpNurseChartStatus !== "") {
                params["IntraOpNurseChartStatus"] = IntraOpNurseChartStatus;
            }

            if (IntraOpAnesthesiaChartStatus !== "") {
                params["IntraOpAnesthesiaChartStatus"] = IntraOpAnesthesiaChartStatus;
            }

            if (PostOpNurseChartStatus !== "") {
                params["PostOpNurseChartStatus"] = PostOpNurseChartStatus;
            }

            if (PostOpAnesthesiaChartStatus !== "") {
                params["PostOpAnesthesiaChartStatus"] = PostOpAnesthesiaChartStatus;
            }
            if (R2PostOpNurseChartStatus !== "") {
                params["R2PostOpNurseChartStatus"] = R2PostOpNurseChartStatus;
            }

            if (R2PostOpAnesthesiaChartStatus !== "") {
                params["R2PostOpAnesthesiaChartStatus"] = R2PostOpAnesthesiaChartStatus;
            }

            if (FaceSheetChartStatus !== "") {
                params["FaceSheetChartStatus"] = FaceSheetChartStatus;
            }
            if (OperativeChartStatus !== "") {
                params["OperativeChartStatus"] = OperativeChartStatus;
                params["OperativeReviewedDate"] = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            }
            if (DischargeChartStatus !== "") {
                params["DischargeChartStatus"] = DischargeChartStatus;
                params["DischargeReviewedDate"] = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            }

            if (LasikPreopChartStatus !== "") {
                params["LasikPreopChartStatus"] = LasikPreopChartStatus;
            }

            if (LasikIntraopChartStatus !== "") {
                params["LasikIntraopChartStatus"] = LasikIntraopChartStatus;
            }

            if (LasikPostopChartStatus !== "") {
                params["LasikPostopChartStatus"] = LasikPostopChartStatus;
            }

            eHnoteSettingsDataService.GetValidatebulkSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
            function getSignoffPWDSuccess(data) {

                if (data.status == "Success") {
                    if (params.Type == "SignOff") {
                        alertify.success('Successfully Signed Off');
                    } else {
                        alertify.success('Successfully Unsigned');
                    }
                    $uibModalInstance.close(params);

                } else {
                    alertify.error(data.Message);
                }
            }
            function getSignoffPWDError(err) {
                console.log(err);
            }
        }
        else {
            if (resolveObj.IsAutoSighnOff == false) {

                if ($scope.SignOffPasswordObj.DoctorId == null) {
                    alertify.error("Select User");
                    return false;
                }

                $scope.SignOffPasswordObj.SignOffPassword = $scope.SignOffPasswordObj.SignOffPassword || "";
                if ($scope.SignOffPasswordObj.SignOffPassword == "") {
                    alertify.error("Please Enter Valid Password");
                    return false;
                }                
                let params = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "AppointmentId": $scope.cacheStorageItem.AppointmentId || resolveObj.AppointmentId||0,
                    "DoctorId": $scope.SignOffPasswordObj.DoctorId || null,
                    "AnesthesiaUserId": $scope.signoffUserObj.AnesthesiaUserId || null,
                    "NurseUserId": $scope.signoffUserObj.NurseUserId || null,
                    "SignOffPassword": $scope.SignOffPasswordObj.SignOffPassword || "",
                    "Screen": resolveObj.Screen,
                    "Type": resolveObj.Type,
                    "UserType": resolveObj.UserType,
                    "IsNurse": IsNurse || false,
                    "IsAnesthesia": IsAnesthesia || false,
                    "IsCardiologist": IsCardiologist || false,
                    "IsSurgeon": IsSurgeon || false,
                    "Remarks": $scope.SignOffPasswordObj.Remarks || "",
                    "IsAutoSighnOff": false,
                }

                if (params.Screen == "PostOp-R1" || params.Screen == "PostOp-R2") {
                    if ($scope.RoleId != 8 && $scope.RoleId != 25 && $scope.RoleId != 30) {
                        params.UserType = type;
                        
                    }
                }

                eHnoteSettingsDataService.GetValidateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
                function getSignoffPWDSuccess(data) {
                    if (data.status == "Success") {
                        if (params.Type == "SignOff") {
                            alertify.success('Successfully Signed Off');
                        } else {
                            alertify.success('Successfully Unsigned');
                        }
                        if (params.Screen != "PostOp-R1" && params.Screen != "PostOp-R2") {
                            $uibModalInstance.close(params);
                        } else {
                            if ($scope.RoleId == 8 || $scope.RoleId == 25 || $scope.RoleId == 30) {
                                $uibModalInstance.close(params);
                            } else {
                                if (type == 'Nurse') {
                                    $scope.IsNurseSignValid = true;
                                } else {
                                    $scope.IsAnesthesiaSignValid = true;
                                }
                            }
                        }

                    } else {
                        alertify.error(data.Message);
                    }
                }
                function getSignoffPWDError(err) {
                    console.log(err);
                }

            }
            else {

                let params = {
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                    "DoctorId": $scope.SignOffPasswordObj.DoctorId || null,
                    "AnesthesiaUserId": $scope.signoffUserObj.AnesthesiaUserId || null,
                    "NurseUserId": $scope.signoffUserObj.NurseUserId || null,
                    "SignOffPassword": "",
                    "Screen": resolveObj.Screen,
                    "Type": resolveObj.Type,
                    "UserType": resolveObj.UserType,
                    "IsNurse": IsNurse || false,
                    "IsAnesthesia": IsAnesthesia || false,
                    "IsCardiologist": IsCardiologist || false,
                    "IsSurgeon": IsSurgeon || false,
                    "Remarks": "",
                    "IsAutoSighnOff": true,
                }

                if (params.Screen == "PostOp-R1" || params.Screen == "PostOp-R2") {
                    if ($scope.RoleId != 8 && $scope.RoleId != 25 && $scope.RoleId != 30) {
                        params.UserType = type;

                    }
                }
                eHnoteSettingsDataService.GetValidateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
                function getSignoffPWDSuccess(data) {
                    if (data.status == "Success") {
                        if (params.Type == "SignOff") {
                            alertify.success('Successfully Signed Off');
                        } else {
                            alertify.success('Successfully Unsigned');
                        }
                        //$uibModalInstance.close(params);
                        if (params.Screen != "PostOp-R1" && params.Screen != "PostOp-R2") {
                            $uibModalInstance.close(params);
                        } else {
                            if ($scope.RoleId == 8 || $scope.RoleId == 25 || $scope.RoleId == 30) {
                                $uibModalInstance.close(params);
                            } else {
                                if (type == 'Nurse') {
                                    $scope.IsNurseSignValid = true;
                                } else {
                                    $scope.IsAnesthesiaSignValid = true;
                                }
                            }
                        }

                    } else {
                        alertify.error(data.Message);
                    }
                }
                function getSignoffPWDError(err) {
                    console.log(err);
                }
            }

        }



    };

    $scope.patientsignrequiredcount = 0;
    $scope.Gaurdiansignrequiredcount = 0;
    $scope.Staffsignrequiredcount = 0;
    $scope.Anesthesiasignrequiredcount = 0;
    $scope.DoctorSignsignrequiredcount = 0;
    $scope.init = function () {
        $scope.SignOffPasswordObj = SignOffPasswordObj();

        $scope.FinalReviewbyobj = {
            "NurseId": null,
            "AnesthetistId": null,
            "SurgeonId": null,
            "CardiologistId": null,
            "NursePassword": '',
            "AnesthetistPassword": '',
            "CardiologistPassword": '',
            "SurgeonPassword": '',
            "IsUnSignNurse": false,
            "IsUnSignAnesthesia": false,
            "IsUnSignSurgeon": false,
            "IsUnSignCardiologist": false,

        }
        let req = {
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "UserType": resolveObj.UserType,
            "Screen": resolveObj.Screen,
        }
        let PostOpDreq = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };



        $q.all([
            //  eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.SubOrganizationId, $scope.HospitalId),
            eHnoteSurgeryService.GetASCAllReviewedBy(req),
            eHnoteSurgeryService.GetPostOpDischargeData(PostOpDreq),

        ]).then(function (resp) {

            if (resp[0].data.status == "Success") {
                $scope.SelectedReviewobj = resp[0].data;
            }

            if (resp[0].data.SignOffLog.length > 0) {
                $scope.SignOffLoglist = resp[0].data.SignOffLog || [];

                //if ($scope.SignOffPasswordObj.Type == 'Unsign') {


                //    var Temparray = $filter("filter")($scope.SignOffLoglist, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.UserType == $scope.SignOffPasswordObj.UserType },true);
                //    if (Temparray.length > 0) {
                //        var Temparray1 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Nurse' });
                //        if (Temparray1.length > 0) {
                //            $scope.signoffUserObj.NurseUserId = Temparray1[0].UserId || null;

                //        }
                //        var Temparray2 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Anesthesia' });
                //        if (Temparray2.length > 0) {
                //            $scope.signoffUserObj.AnesthesiaUserId = Temparray2[0].UserId || null;

                //        }
                //        var Temparray3 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Surgeon' });
                //        if (Temparray3.length > 0) {
                //            $scope.signoffUserObj.SurgeonUserId = Temparray3[0].UserId || null;

                //        }
                //        var Temparray4 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Cardiologist' });
                //        if (Temparray4.length > 0) {
                //            $scope.signoffUserObj.CardiologistUserId = Temparray4[0].UserId || null;

                //        }
                //    }
                //}

                if ($scope.SignOffPasswordObj.Type == 'Unsign' && $scope.SignOffPasswordObj.Screen !== "Discharge" && $scope.SignOffPasswordObj.Screen !== "Facesheet") {

                    // for post op dual unsign in other than nurse anethesia im changing exsting structure of this get when postopscreen called
                    if ($scope.SignOffPasswordObj.Screen != "PostOp-R1" && $scope.SignOffPasswordObj.Screen != "PostOp-R2") {
                        var Temparray = $filter("filter")($scope.SignOffLoglist, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.UserType == $scope.SignOffPasswordObj.UserType }, true);

                        if (Temparray.length > 0) {
                            var Temparray1 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Nurse' });
                            if (Temparray1.length > 0) {
                                $scope.signoffUserObj.NurseAccess = true;
                                $scope.signoffUserObj.IsNurseUnSign = true;
                                $scope.signoffUserObj.NurseUserId = Temparray1[0].UserId || null;

                            }
                            var Temparray2 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Anesthesia' });
                            if (Temparray2.length > 0) {
                                $scope.signoffUserObj.AnesthesiaAccess = true;
                                $scope.signoffUserObj.IsAnesthesiaUnSign = true;
                                $scope.signoffUserObj.AnesthesiaUserId = Temparray2[0].UserId || null;

                            }
                            var Temparray3 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Surgeon' });
                            if (Temparray3.length > 0) {
                                $scope.signoffUserObj.SurgeonAccess = true;
                                $scope.signoffUserObj.IsSurgeonUnSign = true;
                                $scope.signoffUserObj.SurgeonUserId = Temparray3[0].UserId || null;
                                $scope.FinalReviewbyobj.SurgeonId = Temparray3[0].UserId || null;

                            }
                            var Temparray4 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Cardiologist' });
                            if (Temparray4.length > 0) {
                                $scope.signoffUserObj.CardiologistAccess = true;
                                $scope.signoffUserObj.IsCardiologistUnSign = true;
                                $scope.signoffUserObj.CardiologistUserId = Temparray4[0].UserId || null;

                            };

                            var Temparray5 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Coordinator' });
                            if (Temparray5.length > 0) {
                                $scope.signoffUserObj.CoordinatorAccess = true;
                                $scope.signoffUserObj.IsCoordinatorUnSign = true;
                                $scope.signoffUserObj.CoordinatorId = Temparray5[0].UserId || null;

                            };
                        }
                    } else {
                        if ($scope.RoleId != 8 && $scope.RoleId != 25 && $scope.RoleId!=30) {
                            var Temparray = $filter("filter")($scope.SignOffLoglist, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen  }, true);
                            //signstatus
                          
                            
                            if (Temparray.length > 0) {
                                var Temparray1 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Nurse' });
                                if (($scope.SignOffPasswordObj.Screen == "PostOp-R2" && PostOpObj.R2PostOpNurseChartStatus == 'E') || ($scope.SignOffPasswordObj.Screen == "PostOp-R1"&&PostOpObj.PostOpNurseChartStatus == 'E')) { 
                                if (Temparray1.length > 0) {
                                    $scope.signoffUserObj.NurseAccess = true;
                                    $scope.signoffUserObj.IsNurseUnSign = true;
                                    $scope.signoffUserObj.NurseUserId = Temparray1[0].UserId || null;

                                    }
                                }
                                if (($scope.SignOffPasswordObj.Screen == "PostOp-R2" && PostOpObj.R2PostOpAnesthesiaChartStatus == 'E') || ($scope.SignOffPasswordObj.Screen == "PostOp-R1" && PostOpObj.PostOpAnesthesiaChartStatus == 'E')) {

                                    var Temparray2 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Anesthesia' });
                                    if (Temparray2.length > 0) {
                                        $scope.signoffUserObj.AnesthesiaAccess = true;
                                        $scope.signoffUserObj.IsAnesthesiaUnSign = true;
                                        $scope.signoffUserObj.AnesthesiaUserId = Temparray2[0].UserId || null;

                                    }
                                }
                               
                            }
                        } else {
                            var Temparray = $filter("filter")($scope.SignOffLoglist, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.UserType == $scope.SignOffPasswordObj.UserType }, true);

                            if (Temparray.length > 0) {
                                var Temparray1 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Nurse' });
                                if (Temparray1.length > 0) {
                                    $scope.signoffUserObj.NurseAccess = true;
                                    $scope.signoffUserObj.IsNurseUnSign = true;
                                    $scope.signoffUserObj.NurseUserId = Temparray1[0].UserId || null;

                                }
                                var Temparray2 = $filter("filter")(Temparray, function (kitem) { return kitem.UserType == 'Anesthesia' });
                                if (Temparray2.length > 0) {
                                    $scope.signoffUserObj.AnesthesiaAccess = true;
                                    $scope.signoffUserObj.IsAnesthesiaUnSign = true;
                                    $scope.signoffUserObj.AnesthesiaUserId = Temparray2[0].UserId || null;

                                }
                         
                            }
                        }
                    }
                }

                //if (resolveObj.UserType == 'Anesthesia' && resolveObj.Type == 'Unsign') {
                //     $scope.signoffUserObj.AnesthesiaAccess = true;
                //     $scope.signoffUserObj.IsAnesthesiaUnSign = true;
                //     let loggedUser = $filter('filter')($scope.AllAnesthetistList, { 'DoctorID': $scope.UserId }, true);
                //     if (loggedUser.length > 0) {
                //         $scope.signoffUserObj.AnesthesiaUserId = loggedUser[0].DoctorID;
                //     }
                // }
                // else if (resolveObj.UserType == 'Nurse' && resolveObj.Type == 'Unsign') {
                //     $scope.signoffUserObj.NurseAccess = true;
                //     $scope.signoffUserObj.IsNurseUnSign = true;
                //     let loggedUser = $filter('filter')($scope.NurseArray, { 'DoctorID': $scope.UserId }, true);
                //     if (loggedUser.length > 0) {
                //         $scope.signoffUserObj.NurseUserId = loggedUser[0].DoctorID;
                //     }
                // }
                // else if (resolveObj.UserType == 'Surgeon' && resolveObj.Type == 'Unsign') {
                //     $scope.signoffUserObj.SurgeonAccess = true;
                //     $scope.signoffUserObj.IsSurgeonUnSign = true;
                //     let loggedUser = $filter('filter')($scope.SurgeonArray, { 'DoctorID': $scope.UserId }, true);
                //     if (loggedUser.length > 0) {
                //         $scope.signoffUserObj.SurgeonUserId = loggedUser[0].DoctorID;
                //     }
                // }
                // else if (resolveObj.UserType == 'Cardiologist' && resolveObj.Type == 'Unsign') {
                //     $scope.signoffUserObj.CardiologistAccess = true;
                //     $scope.signoffUserObj.IsCardiologistUnSign = true;
                //     let loggedUser = $filter('filter')($scope.AllCardiologistList, { 'DoctorID': $scope.UserId }, true);
                //     if (loggedUser.length > 0) {
                //         $scope.signoffUserObj.CardiologistUserId = loggedUser[0].DoctorID;
                //     }
                // }
            }
            if (resp[1].data.Status === "Success") {
                $scope.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];
                if ($scope.SignOffPasswordObj.Type == 'Unsign' && $scope.SignOffPasswordObj.Screen == "Discharge") {

                    var Temparray1 = $filter("filter")($scope.LastSignOffUserDetails, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen }, true);
                    if (Temparray1.length > 1 && $scope.SignOffPasswordObj.UserType == 'Nurse') {

                        var Temparray = $filter("filter")($scope.LastSignOffUserDetails, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.LatestStatus == "SignOff" }, true);

                    }
                    else if (Temparray1.length > 1 && $scope.SignOffPasswordObj.UserType == "Surgeon") {
                        var Temparray = $filter("filter")($scope.LastSignOffUserDetails, function (kitem) { return kitem.Screen == $scope.SignOffPasswordObj.Screen && kitem.UserType == "Surgeon" }, true);

                    }
                    else {
                        Temparray = Temparray1
                    }
                    if (Temparray.length > 0) {
                        if ($scope.SignOffPasswordObj.UserType == 'Nurse') {
                            if ($scope.SignOffPasswordObj.UserType == 'Nurse' && Temparray[0].UserType == 'Surgeon') {
                                $scope.signoffUserObj.SurgeonAccess = true;
                                $scope.signoffUserObj.IsSurgeonUnSign = true;
                                $scope.signoffUserObj.SurgeonUserId = Temparray[0].UserId || null;
                                $scope.FinalReviewbyobj.SurgeonId = Temparray[0].UserId || null;
                            }
                            else {
                                $scope.signoffUserObj.NurseAccess = true;
                                $scope.signoffUserObj.IsNurseUnSign = true;
                                $scope.signoffUserObj.NurseUserId = Temparray[0].UserId || null;
                            }
                        }
                        if ($scope.SignOffPasswordObj.UserType == 'Surgeon') {
                            if ($scope.SignOffPasswordObj.UserType == 'Surgeon' && Temparray[0].UserType == 'Nurse') {
                                $scope.signoffUserObj.NurseAccess = true;
                                $scope.signoffUserObj.IsNurseUnSign = true;
                                $scope.signoffUserObj.NurseUserId = Temparray[0].UserId || null;
                            }
                            else {
                                $scope.signoffUserObj.SurgeonAccess = true;
                                $scope.signoffUserObj.IsSurgeonUnSign = true;
                                $scope.signoffUserObj.SurgeonUserId = Temparray[0].UserId || null;
                                $scope.FinalReviewbyobj.SurgeonId = Temparray[0].UserId || null;
                            }
                        }
                    }

                }


            }
            $scope.IsshowBulkSignrefreshButton = false;
            if ($scope.signoffUserObj.NurseAccess && $scope.RoleId == 8) {
                $scope.patientsignrequiredcount = 0;
                $scope.Gaurdiansignrequiredcount = 0;
                $scope.Staffsignrequiredcount = 0;
                angular.forEach($scope.consentsMainObj.MainConsents, function (item) {










                    if (!item.IsCounselorSignRequired) {
                        item.CounselorClass = 'disabled';
                    } else {
                        if (item.IsCounselorSignatureDone) {
                            item.CounselorClass = 'complete';
                        } else {
                            item.CounselorClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = false;
                    //&&
                    var UserType = "";
                    //if ($scope.RoleId == 8) {
                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                            $scope.patientsignrequiredcount++;
                        }
                    }








                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                            $scope.Gaurdiansignrequiredcount++;
                        }
                    }//nurse
                    UserType = "Staff";

                    if (!item.IsStaffSignRequired) {
                        item.StaffClass = 'disabled';
                    } else {
                        if (item.IsStaffSignatureDone) {
                            item.StaffClass = 'complete';
                        } else {
                            item.StaffClass = 'incomplete';
                            $scope.Staffsignrequiredcount++;
                        }
                    }

                    item.CanBulksignconsent = item.StaffClass == 'incomplete' || item.PatientClass == 'incomplete' || item.GaurdianClass == 'incomplete';

                    /*}*/

                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                        //    $scope.ConsentformSignatureIndication = `${UserType} Sign Is Incomplete In Appointment Consents Please Check And Sign The Consents.`;
                    }
                    //sitem.AnesthesistClass !== 'incomplete'; 

                });
                if ($scope.Staffsignrequiredcount > 0) {
                    const message = "Staff Sign Is Incomplete in the consent forms.";

                    $scope.ConsentformSignatureIndication =
                        $scope.ConsentformSignatureIndication ? $scope.ConsentformSignatureIndication + "\n" + message : message;
                }
                if ($scope.patientsignrequiredcount > 0) {
                    const message = "Patient Sign Is InComplete In  Consents forms.";

                    $scope.ConsentformSignatureIndication =
                        $scope.ConsentformSignatureIndication ? $scope.ConsentformSignatureIndication + "\n" + message : message;
                }
                if ($scope.Gaurdiansignrequiredcount > 0) {
                    const message = "Gaurdian Sign Is InComplete In  Consents forms.";

                    $scope.ConsentformSignatureIndication =
                        $scope.ConsentformSignatureIndication ? $scope.ConsentformSignatureIndication + "\n" + message : message;
                }
            }
            if ($scope.signoffUserObj.AnesthesiaAccess && ($scope.RoleId == 25 || $scope.RoleId == 30)) {
                angular.forEach($scope.consentsMainObj.MainConsents, function (item) {




                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                        }
                    }








                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                        }
                    }





                    if (!item.IsCounselorSignRequired) {
                        item.CounselorClass = 'disabled';
                    } else {
                        if (item.IsCounselorSignatureDone) {
                            item.CounselorClass = 'complete';
                        } else {
                            item.CounselorClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = false;
                    //&&
                    var UserType = "";

                    /* if ($scope.RoleId == 25 || $scope.RoleId == 30) {*/  //Anestiea
                    UserType = "Anesthesia";

                    if (!item.IsAnesthesistSignRequired) {
                        item.AnesthesistClass = 'disabled';
                    } else {
                        if (item.IsAnesthesistSignatureDone) {
                            item.AnesthesistClass = 'complete';
                        } else {
                            item.AnesthesistClass = 'incomplete';
                        }
                    }
                    item.CanBulksignconsent = item.AnesthesistClass == 'incomplete';

                    /*}*/

                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                        $scope.ConsentformSignatureIndication = `${UserType} Sign Is Incomplete In  Consents Forms.`;
                        $scope.Anesthesiasignrequiredcount++;
                    }
                    //sitem.AnesthesistClass !== 'incomplete'; 

                });
            }
            if ($scope.signoffUserObj.SurgeonAccess && ($scope.RoleId == 43 || $scope.RoleId == 1)) {
                $scope.DoctorSignsignrequiredcount = 0;
                angular.forEach($scope.consentsMainObj.MainConsents, function (item) {




                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                        }
                    }








                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                        }
                    }





                    if (!item.IsCounselorSignRequired) {
                        item.CounselorClass = 'disabled';
                    } else {
                        if (item.IsCounselorSignatureDone) {
                            item.CounselorClass = 'complete';
                        } else {
                            item.CounselorClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = false;
                    //&&
                    var UserType = "";

                    //if ($scope.RoleId == 43 || $scope.RoleId == 1) {  //Doctor
                    UserType = "Surgeon";

                    if (!item.IsDoctorSignRequired) {
                        item.ProviderClass = 'disabled';
                    } else {
                        if (item.IsProviderSignatureDone) {
                            item.ProviderClass = 'complete';
                        } else {
                            item.ProviderClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = item.ProviderClass == 'incomplete';

                    /*}*/
                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                        $scope.ConsentformSignatureIndication = `${UserType} Sign Is Incomplete In  Consents Forms.`;
                        $scope.DoctorSignsignrequiredcount++;
                    }
                    //sitem.AnesthesistClass !== 'incomplete'; 

                });
            }
        });
    }
    $scope.init();
    $scope.ApplySignature = function () {
        $scope.ProviderSigBase64 = null;
        if ($scope.signoffUserObj.NurseAccess) {
            let appdoctor = $filter("filter")($scope.allUserList, function (item) {
                return item.DoctorID == $scope.signoffUserObj.NurseUserId;
            }) || [];
            if (appdoctor.length > 0) {
                if (appdoctor[0].SignatureOfUser) {
                    $scope.ProviderSigBase64 = appdoctor[0].SignatureOfUser || null;
                }
            }
        }
        if ($scope.signoffUserObj.AnesthesiaAccess) {
            let appdoctor = $filter("filter")($scope.allUserList, function (item) {
                return item.DoctorID == $scope.signoffUserObj.AnesthesiaUserId;
            }) || [];
            if (appdoctor.length > 0) {
                if (appdoctor[0].SignatureOfUser) {
                    $scope.ProviderSigBase64 = appdoctor[0].SignatureOfUser || null;
                }
            }
        }
        if ($scope.signoffUserObj.SurgeonAccess) {
            let appdoctor = $filter("filter")($scope.allUserList, function (item) {
                return item.DoctorID == $scope.signoffUserObj.SurgeonUserId;
            }) || [];
            if (appdoctor.length > 0) {
                if (appdoctor[0].SignatureOfUser) {
                    $scope.ProviderSigBase64 = appdoctor[0].SignatureOfUser || null;
                }
            }
        }
        var providerSigBase64 = $scope.ProviderSigBase64 || null;
        $scope.AppointmentPatientdata = [];
        var hospitalobj = {
            "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "Address1": doctorinfo.doctordata.UserAddress[0].Address1,
            "Address2": doctorinfo.doctordata.UserAddress[0].Address2,
            "CityName": doctorinfo.doctordata.UserAddress[0].CityName,
            "StateName": doctorinfo.doctordata.UserAddress[0].StateName,
            "CountryName": doctorinfo.doctordata.UserAddress[0].CountryName,
            "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
            "AreaCode": doctorinfo.doctordata.UserAddress[0].AreaCode,
            "PinCode": doctorinfo.doctordata.UserAddress[0].PinCode
        };

        $scope.AppointmentPatientdata.push(hospitalobj);

        var sobj = {
            "mainitem": $scope.cacheStorageItem.selectedApptObj,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "ParentHospitalId": $scope.ParentHospitalId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "HospitalAddress": $scope.AppointmentPatientdata,
            "selectedArray": [],
            "selectedObj": "",
            "Page": "PreOp",
            "PatientDetails": $scope.cacheStorageItem.selectedApptObj.Patient || "",
            "ApptHospitalId": $scope.cacheStorageItem.selectedApptObj.BranchId || 0,
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/DocumentsPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "resolve": {
                "ParentObject": function () { return sobj; }
            },
            "keyboard": false,
            "controller": "UsPatientDocumentsCtrl",
            "windowClass": "modal__popup--1 bottom-to-top-modal"
        });
        $scope.mInstanceAdd.result.then(function (result) {
            console.log(result);
            $scope.consentsMainObj.MainConsents = result.MainConsents || [];
            $scope.ConsentformSignatureIndication = '';
            $scope.IsshowBulkSignrefreshButton = false;
            if ($scope.signoffUserObj.NurseAccess && ($scope.RoleId == 8)) {
                $scope.patientsignrequiredcount = 0;
                $scope.Gaurdiansignrequiredcount = 0;
                $scope.Staffsignrequiredcount = 0;
                angular.forEach($scope.consentsMainObj.MainConsents, function (item) {










                    if (!item.IsCounselorSignRequired) {
                        item.CounselorClass = 'disabled';
                    } else {
                        if (item.IsCounselorSignatureDone) {
                            item.CounselorClass = 'complete';
                        } else {
                            item.CounselorClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = false;
                    //&&
                    var UserType = "";
                    //if ($scope.RoleId == 8) {
                        if (!item.IsPatientSignRequired) {
                            item.PatientClass = 'disabled';
                        } else {
                            if (item.IsPatientSignatureDone) {
                                item.PatientClass = 'complete';
                            } else {
                                item.PatientClass = 'incomplete';
                                $scope.patientsignrequiredcount++;
                            }
                        }








                        if (!item.IsGuardianSignRequired) {
                            item.GaurdianClass = 'disabled';
                        } else {
                            if (item.IsGaurdianSignatureDone) {
                                item.GaurdianClass = 'complete';
                            } else {
                                item.GaurdianClass = 'incomplete';
                                $scope.Gaurdiansignrequiredcount++;
                            }
                        }//nurse
                        UserType = "Staff";

                        if (!item.IsStaffSignRequired) {
                            item.StaffClass = 'disabled';
                        } else {
                            if (item.IsStaffSignatureDone) {
                                item.StaffClass = 'complete';
                            } else {
                                item.StaffClass = 'incomplete';
                                $scope.Staffsignrequiredcount++;
                            }
                        }

                        item.CanBulksignconsent = item.StaffClass == 'incomplete' || item.PatientClass == 'incomplete' || item.GaurdianClass == 'incomplete';

                    /*}*/

                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                        //    $scope.ConsentformSignatureIndication = `${UserType} Sign Is Incomplete In Appointment Consents Please Check And Sign The Consents.`;
                    }
                    //sitem.AnesthesistClass !== 'incomplete'; 

                });
                if ($scope.Staffsignrequiredcount > 0) {
                    const message = "Staff Sign Is Incomplete in the consent forms.";

                    $scope.ConsentformSignatureIndication =
                        $scope.ConsentformSignatureIndication ? $scope.ConsentformSignatureIndication + "\n" + message : message;
                }
                if ($scope.patientsignrequiredcount > 0) {
                    const message = "Patient Sign Is InComplete In  Consents forms.";

                    $scope.ConsentformSignatureIndication =
                        $scope.ConsentformSignatureIndication ? $scope.ConsentformSignatureIndication + "\n" + message : message;
                }
                if ($scope.Gaurdiansignrequiredcount > 0) {
                    const message = "Gaurdian Sign Is InComplete In  Consents forms.";

                    $scope.ConsentformSignatureIndication =
                        $scope.ConsentformSignatureIndication ? $scope.ConsentformSignatureIndication + "\n" + message : message;
                }
            }
            if ($scope.signoffUserObj.AnesthesiaAccess && ($scope.RoleId == 25 || $scope.RoleId == 30)) {
                $scope.Anesthesiasignrequiredcount = 0;
                angular.forEach($scope.consentsMainObj.MainConsents, function (item) {




                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                        }
                    }








                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                        }
                    }





                    if (!item.IsCounselorSignRequired) {
                        item.CounselorClass = 'disabled';
                    } else {
                        if (item.IsCounselorSignatureDone) {
                            item.CounselorClass = 'complete';
                        } else {
                            item.CounselorClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = false;
                    //&&
                    var UserType = "";
          
                   /* if ($scope.RoleId == 25 || $scope.RoleId == 30) {*/  //Anestiea
                        UserType = "Anesthesia";

                        if (!item.IsAnesthesistSignRequired) {
                            item.AnesthesistClass = 'disabled';
                        } else {
                            if (item.IsAnesthesistSignatureDone) {
                                item.AnesthesistClass = 'complete';
                            } else {
                                item.AnesthesistClass = 'incomplete';
                            }
                        }
                        item.CanBulksignconsent = item.AnesthesistClass == 'incomplete';

                    /*}*/
             
                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                        $scope.ConsentformSignatureIndication = `${UserType} Sign Is Incomplete In  Consents Forms.`;
                        $scope.Anesthesiasignrequiredcount++
                    }
                    //sitem.AnesthesistClass !== 'incomplete'; 

                });
            }
            if ($scope.signoffUserObj.SurgeonAccess && ($scope.RoleId == 43 || $scope.RoleId == 1)) {
                $scope.DoctorSignsignrequiredcount = 0;
                angular.forEach($scope.consentsMainObj.MainConsents, function (item) {




                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                        }
                    }








                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                        }
                    }





                    if (!item.IsCounselorSignRequired) {
                        item.CounselorClass = 'disabled';
                    } else {
                        if (item.IsCounselorSignatureDone) {
                            item.CounselorClass = 'complete';
                        } else {
                            item.CounselorClass = 'incomplete';
                        }
                    }

                    item.CanBulksignconsent = false;
                    //&&
                    var UserType = "";
            
                    //if ($scope.RoleId == 43 || $scope.RoleId == 1) {  //Doctor
                        UserType = "Surgeon";

                        if (!item.IsDoctorSignRequired) {
                            item.ProviderClass = 'disabled';
                        } else {
                            if (item.IsProviderSignatureDone) {
                                item.ProviderClass = 'complete';
                            } else {
                                item.ProviderClass = 'incomplete';
                            }
                        }

                        item.CanBulksignconsent = item.ProviderClass == 'incomplete';

                    /*}*/
                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                        $scope.ConsentformSignatureIndication = `${UserType} Sign Is Incomplete In  Consents Forms.`;
                        $scope.DoctorSignsignrequiredcount++;
                    }
                    //sitem.AnesthesistClass !== 'incomplete'; 

                });
            }
        }, function (cancel) {

        });
    }
}]);

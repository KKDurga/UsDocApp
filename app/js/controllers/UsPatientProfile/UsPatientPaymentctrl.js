eHnoteWebApp.controller("UsPatientPaymentctrl", ["$scope", "$rootScope", "$route", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", "$http", "downloadpdfService", function ($scope, $rootScope, $route, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate, $http, downloadpdfService) {
 


    $scope.PatientDetailsArray = {};
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.CountryId = doctorinfo.doctordata.UserAddress[0].CountryId;
    $scope.DrFullName = doctorinfo.doctordata.UserAddress[0].FullName;
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserFullName = doctorinfo.doctordata.User[0].SecondUserFullName;
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
    $scope.RoleId = $scope.userLoginDetails.RoleID;
    $scope.userProfilePic = "img/register-defaultuser-ico.png";
    datapersistanceFactory.set("SingleDoctorcalendar", "");
    datapersistanceFactory.set("OpAppointmentDetailsById", "");
    $scope.PreviousUrl = "/op";
    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();
    
    if ($scope.selectedApptDates.Screen != "") {
        $scope.PreviousUrl = $scope.selectedApptDates.Screen;
    }

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
   
    if (doctorinfo !== undefined) {

        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {

                $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;


               
                $scope.lRName = $scope.orgUsersData[0].ExtDetails.RoleName;

                $scope.Name = $scope.userLoginDetails.displayName;
                $rootScope.mainDisplayName = $scope.userLoginDetails.displayName;
                //$scope.SpecialityName = $scope.userLoginDetails.specialisation;
                //$scope.Speciality = $scope.userLoginDetails.specialisation;
                $scope.SpecialityName = doctorinfo.doctordata.User[0].SpecializationName || "";
                $scope.Speciality = doctorinfo.doctordata.User[0].SpecializationName || "";

                $scope.groupID = doctorinfo.doctordata.User[0].GroupId;
                $scope.accessRights = doctorinfo.doctordata.User[0].AccessDetails;
                $scope.RoleName = doctorinfo.doctordata.User[0].RoleName;
                $scope.userLoginDetails.RoleID = doctorinfo.doctordata.User[0].RoleId;


                if ($scope.RoleId === 4 || $scope.RoleId === 43 || $scope.RoleId === 1 || $scope.RoleId === 3 || $scope.RoleId === 14 || $scope.RoleId === 56 || $scope.RoleId === 57) {
                    $scope.profileName = $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                } else {
                    $scope.profileName = $rootScope.mainDisplayName + ' (' + $scope.lRName + ')';
                }


                $scope.userProfilePic = datapersistanceFactory.getItem('userProfileimg') || "img/register-defaultuser-ico.png";

                var speciality = datacookieFactory.set('specialisation');
                if (datapersistanceFactory.getItem('userProfileimg') !== "") {
                    $scope.ProfileImage = "data:image/png;base64," + GetImage(datapersistanceFactory.getItem('userProfileimg'));
                } else {
                    $scope.ProfileImage = "data:image/png;base64," + (datapersistanceFactory.getItem('userProfileimg') === "") ? "" : GetImage(datapersistanceFactory.getItem('userProfileimg'));
                }


            }
        }
    }

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();


    var transactionId = $location.search().transactionId;

    // Log or use the transactionId
    console.log("Transaction ID:", transactionId);

    // You can now use transactionId to query the transaction details or show a success message
    $scope.transactionId = transactionId;

    $scope.NavigateToMainScreen = function () {

        $rootScope.CurrentUrl = "/op";
        $location.url("/op");
    };
}]);



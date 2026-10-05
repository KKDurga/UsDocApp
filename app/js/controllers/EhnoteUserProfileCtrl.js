


eHnoteWebApp.controller('EhnoteUserProfileCtrl', ['$scope', '$rootScope', '$location', '$filter', '$window', 'datapersistanceFactory', 'eHnoteLoginObjService', 'eHnoteMasterDataService', 'eHnoteUserDataService', 'eHnoteValidateUsersDataService', 'eHnoteLoginStatusService', 'datacookieFactory', 'eHnoteUserProfileService', 'Lightbox', 'alertify', '$uibModal', "eHnoteMainAdminServices", "localStorageFactory", "eHnoteMasterDataService", function ($scope, $rootScope, $location, $filter, $window, datapersistanceFactory, eHnoteLoginObjService, eHnoteMasterDataService, eHnoteUserDataService, eHnoteValidateUsersDataService, eHnoteLoginStatusService, datacookieFactory, eHnoteUserProfileService, Lightbox, alertify, $uibModal, eHnoteMainAdminServices, localStorageFactory, eHnoteMasterDataService) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

 

    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
        return;
    }
    $scope.ShowTab = function (no) {
        $scope.tabno = no;
    };
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.loadingPage = function () {
        $scope.showPage = false;
        setTimeout(function () {
            $scope.showPage = true;
        }, 100);
    };
    $scope.loadingPage();
    $scope.ShowTab(1);
    $scope.UserPassword = {
        "Password": "",
        "ConfirmPassword": ""
    };
    var SetupPopUp;
    $scope.movetoabout = function () {
        $location.path('/doctorprofile');
    };
    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
    };
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.RoleID = doctorinfo.RoleID;
    console.log(doctorinfo);
    var emailfilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //$scope.password_pattern = /^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/;
    $scope.password_pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
    $scope.editmode = true;
    $scope.emailpattern = emailfilter;
    var speciality_default_push = { "DoctorSpecialitySEODesc": "", "DoctorSpecialityID": "", "DoctorSpecialityDesc": "Select the speciality", "SpecialityDesc": "", "ActiveIND": "Y" };
    eHnoteUserDataService.getspeciality(onsuccess, onfailure);
    function onsuccess(data) {
        $scope.specialitylist = data;
    }
    function onfailure(data) {
    }
    $scope.doctorinfo = doctorinfo;

    $scope.referraldoctors = doctorinfo.referraldoctors;
    if (doctorinfo.doctordata.User[0].ProfileImage !== undefined) {
        $scope.doctorinfo.profileimage = GetImage(doctorinfo.doctordata.User[0].ProfileImage);
    }
    var logininfo = eHnoteLoginObjService.getProfileInfo();
    var currentdaycode = new Date();
    $scope.currentdaycode = $filter('date')(currentdaycode, "EEE").toUpperCase();
    var spcialityList_data = [];
    angular.forEach($scope.specialitylist, function (item) {
        angular.forEach(doctorinfo.doctordata.UserSpecilityDetails, function (spcialityList) {
            if (item.Id == spcialityList.SepcialityID) {
                spcialityList_data.push(spcialityList);
            }
        });
    });
    if (doctorinfo.doctordata.UserSpecilityDetails != undefined)
        logininfo.specialization = doctorinfo.doctordata.UserSpecilityDetails;
    else
        logininfo.specialization = [];
    function getDoctorInfoData() {
        if (doctorinfo.doctorid > 0) {
            var data = doctorinfo.doctordata.User[0];
            logininfo.Name = data.FullName;
            if (doctorinfo.doctordata.UserPhone !== undefined) {
                if (doctorinfo.doctordata.UserPhone.length !== 0) {
                    if (doctorinfo.doctordata.UserPhone[0].PhType == "M") {
                        logininfo.PhCntryCD = doctorinfo.doctordata.UserPhone[0].PhCntryCD;
                        logininfo.PhAreaCD = doctorinfo.doctordata.UserPhone[0].PhAreaCD;
                        logininfo.PhMobileNo = doctorinfo.doctordata.UserPhone[0].PhMobileNo;
                        logininfo.MobileNumber = doctorinfo.doctordata.UserPhone[0].PhNumber;
                        logininfo.UserMobileNumber = doctorinfo.doctordata.UserPhone[0].PhNumber;
                        logininfo.UserMobileNo = doctorinfo.doctordata.UserPhone[0].PhMobileNo;
                    }
                }
            }
            if (doctorinfo.doctordata.UserEmail !== undefined) {
                if (doctorinfo.doctordata.UserEmail.length !== 0) {
                    logininfo.Email = doctorinfo.doctordata.UserEmail[0].EmailID;
                }
                else {
                    logininfo.Email = data.UserLoginID;
                }
            }
            if (data.MemberID !== undefined) {
                logininfo.MedicalRegNumber = data.MemberID;
            }
            logininfo.Experience = data.Exp;
            logininfo.About = data.About;
            $scope.UserPassword.SignOffPWDInd = data.SignOffPWDInd;
            $scope.UserPassword.SignOffPassword = data.SignOffPassword;
            logininfo.Gender = data.Gender;
            if (data.DOB !== undefined) {
                logininfo.DOB = $filter('date')(data.DOB, "MM-dd-yyyy");
            }
            if (doctorinfo.doctordata.UserEducation != undefined)
                logininfo.Qualification = doctorinfo.doctordata.UserEducation;
            else
                logininfo.Qualification = [];
        }
    }
    getDoctorInfoData();
    $scope.showSingleTime = true;
    $scope.showMultipleTime = false;
    $scope.showTimingsset = function (status, val) {
        if (status) {
            $scope.showSingleTime = false;
            $scope.showMultipleTime = true;
        }
        else {
            $scope.showSingleTime = true;
            $scope.showMultipleTime = false;
        }
    };
    var edu_collection = [];
    angular.forEach(doctorinfo.doctordata.UserEducation, function (edu_item) {
        edu_collection.push({
            'RowID': edu_item.RowID,
            'EducationName': edu_item.EducationName,
            'InstituteName': edu_item.InstituteName,
            'edu_startyear': edu_item.StartYear,
            'edu_endyear': edu_item.EndYear
        });
    });
    logininfo.UserEducation = edu_collection;
    if (doctorinfo.doctordata.UserServices != undefined)
        logininfo.Services = doctorinfo.doctordata.UserServices;
    else
        logininfo.Services = [];
    if (doctorinfo.doctordata.UserMemberships != undefined)
        logininfo.Memberships = doctorinfo.doctordata.UserMemberships;
    else
        logininfo.Memberships = [];
    if (doctorinfo.doctordata.UserAwards != undefined)
        logininfo.Awards = doctorinfo.doctordata.UserAwards;
    else
        logininfo.Awards = [];
    $scope.editmode = true;
    $scope.logininfo = logininfo;
    if (doctorinfo.doctordata.UserPublishing !== undefined) {
        logininfo.UserPublishing = doctorinfo.doctordata.UserPublishing;
    }
    else {
        logininfo.UserPublishing = [];
    }
    if (doctorinfo.doctordata.UserAchievements !== undefined) {
        logininfo.UserAchievements = doctorinfo.doctordata.UserAchievements;
    }
    else {
        logininfo.UserAchievements = [];
    }

    //connect users
    $scope.connectedUserObj = {
        "Available": false,
        "Users": [],
        "IsShowScheduletab" : false
    };

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.connectedUserObj.Available = doctorinfo.doctordata.User[0].IsConnectedUsersAvailable || false;

        if ($scope.connectedUserObj.Available) {
            $scope.connectedUserObj.Users = doctorinfo.doctordata.UserAddress[0].ConnectedUsers || [];
            $scope.connectedUserObj.IsShowScheduletab = true;
        } else {
            $scope.connectedUserObj.IsShowScheduletab = false;
        }
    }

    $scope.edit_contact_view = false;
    $scope.contact_view_con = true;
    $scope.contact_cancel = function () {
        $scope.edit_contact_view = false;
        $scope.contact_view_con = true;
        if ($scope.edit_contactTemp) {
            logininfo.Email = $scope.email_temp;
            logininfo.MobileNumber = $scope.phone_temp;
        }
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }

    };
    $scope.about_cancel = function () {
        $scope.edit_info = false;
        $scope.about_view_container = true;
        if ($scope.aboutedit_status) {
            logininfo.About = $scope.aboutTemp;
            logininfo.DOB = $scope.dobTemp;
            logininfo.Gender = $scope.genderTemp;
        }
        $scope.edit_contact_view = false;
        $scope.contact_view_con = true;
        if ($scope.edit_contactTemp) {
            logininfo.Email = $scope.email_temp;
            logininfo.MobileNumber = $scope.phone_temp;
        }
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.profile_top_cancel = function () {
        $scope.exp_edit_view = false;
        $scope.exp_view_con = true;
        $scope.medical_edit_view = false;
        $scope.medical_view_con = true;
        if ($scope.profileToeedit_status) {
            logininfo.Experience = $scope.expTemp;
            logininfo.MedicalRegNumber = $scope.medicalTemp;
            $scope.experience_valid = false;
        }
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.education_cancel = function () {
        $scope.eudcation_edit_view = false;
        $scope.education_view_container = true;
        $scope.education_add_container = false;
        if ($scope.edutempStatus) {
            logininfo.UserEducation = $scope.educationTemp;
        }
        $scope.edu_name = undefined;
        $scope.edu_year = undefined;
        $scope.edu_institute = undefined;
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.services_cancel = function () {
        $scope.edit_view_services = false;
        $scope.services_view_container = true;
        $scope.add_service_container = false;
        if ($scope.servicesTempStatus) {
            logininfo.Services = $scope.servicesTemp;
        }
        $scope.services_addset = undefined;
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.achievments_cancel = function () {
        $scope.edit_view_achievments = false;
        $scope.achievments_view_container = true;
        $scope.add_achievements_container = false;
        if ($scope.AchievmentsTempStatus) {
            logininfo.UserAchievements = $scope.achievementsTemp;
        }
        $scope.add_achievmentsset = undefined;
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.publication_cancel = function () {
        $scope.edit_view_publication = false;
        $scope.publication_view_container = true;
        $scope.publication_add_container = false;
        if ($scope.publicationTempStatus) {
            logininfo.UserPublishing = $scope.publicationTemp;
        }
        $scope.addPublication = undefined;
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.membership_cancel = function () {
        $scope.edit_view_membership = false;
        $scope.membership_view_container = true;
        $scope.add_view_membership = false;
        $scope.membership_addset = undefined;
        if ($scope.membershiptEditStatus) {
            logininfo.Memberships = $scope.membershipTempData;
        }
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.awards_cancel = function () {
        $scope.edit_view_awards = false;
        $scope.awards_view_container = true;
        $scope.awards_add_container = false;
        $scope.awards_addset = undefined;
        if ($scope.awardsEditStatus) {
            logininfo.Awards = $scope.awardsTempData;
        }
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.speciality_cancel = function () {
        $scope.speciality_edit_view = false;
        $scope.speciality_view_container = true;
        $scope.speciality_add_container = false;
        $scope.speciality_add = undefined;
        if ($scope.specialityTempstatus) {
            logininfo.specialization = $scope.specialityTemp;
        }
        if (SetupPopUp) {
            SetupPopUp.dismiss("cancel");
        }
    };
    $scope.speciality_view_container = true;
    $scope.speciality_edit = function () {
        $scope.speciality_edit_view = true;
        $scope.speciality_view_container = false;
        $scope.speciality_add_container = false;
        $scope.specialityTempstatus = true;
        $scope.speciality_add = undefined;
        $scope.specialityTemp = angular.copy(logininfo.specialization);
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'SpecialityProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.add_speciality = function () {
        $scope.speciality_edit_view = false;
        $scope.speciality_view_container = true;
        $scope.speciality_add_container = true;
        $scope.speciality_add = "";
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'SpecialityProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.edit_contact = function () {
        $scope.ChangeUsFormate(logininfo.MobileNumber);
        $scope.edit_contact_view = true;
        $scope.contact_view_con = false;
        $scope.edit_contactTemp = true;
        $scope.email_temp = angular.copy(logininfo.Email);
        $scope.phone_temp = angular.copy(logininfo.MobileNumber);
        $scope.edit_info = true;
        $scope.about_view_container = false;
        $scope.aboutedit_status = true;
        $scope.aboutTemp = angular.copy(logininfo.About);
        $scope.dobTemp = angular.copy(logininfo.DOB);
        $scope.genderTemp = angular.copy(logininfo.Gender);
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.speciality_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'BasicInfoProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.about_view_container = true;
    $scope.edit_about = function () {
        $scope.edit_info = true;
        $scope.about_view_container = false;
        $scope.aboutedit_status = true;
        $scope.aboutTemp = angular.copy(logininfo.About);
        $scope.dobTemp = angular.copy(logininfo.DOB);
        $scope.genderTemp = angular.copy(logininfo.Gender);
    };
    $scope.add_about = function () {
        $scope.edit_info = true;
        $scope.about_view_container = false;
    };
    $scope.exp_edit_view = false;
    $scope.exp_view_con = true;
    $scope.medical_edit_view = false;
    $scope.medical_view_con = true;
    $scope.profile_top_edit = function () {
        $scope.exp_edit_view = true;
        $scope.exp_view_con = false;
        $scope.medical_edit_view = true;
        $scope.medical_view_con = false;
        $scope.profileToeedit_status = true;
        $scope.expTemp = angular.copy(logininfo.Experience);
        $scope.medicalTemp = angular.copy(logininfo.MedicalRegNumber);
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'ProfessionalProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.education_view_container = true;
    $scope.education_edit = function () {
        $scope.eudcation_edit_view = true;
        $scope.education_view_container = false;
        $scope.education_add_container = false;
        $scope.edutempStatus = true;
        $scope.educationTemp = angular.copy(logininfo.UserEducation);
        $scope.edu_name = undefined;
        $scope.edu_year = undefined;
        $scope.edu_institute = undefined;
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'UpdateUserProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.add_education = function () {
        $scope.eudcation_edit_view = false;
        $scope.education_view_container = true;
        $scope.education_add_container = true;
        $scope.edu_name = "";
        $scope.start_year = "";
        $scope.end_year = "";
        $scope.awards_addset = $scope.addPublication = $scope.membership_addset = $scope.add_achievmentsset = $scope.services_addset = $scope.speciality_add = $scope.speciality_addCustomSpeciality = undefined;
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'UpdateUserProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.services_view_container = true;
    $scope.services_edit = function () {
        $scope.edit_view_services = true;
        $scope.services_view_container = false;
        $scope.servicesTempStatus = true;
        $scope.servicesTemp = angular.copy(logininfo.Services);
        $scope.services_addset = undefined;
        $scope.add_service_container = false;
        //$scope.education_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'ServicesofferedProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.add_services = function () {
        $scope.edit_view_services = false;
        $scope.services_view_container = true;
        $scope.add_service_container = true;
        $scope.services_addset = "";
        //$scope.education_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'ServicesofferedProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.achievments_view_container = true;
    $scope.achievments_edit = function () {
        $scope.edit_view_achievments = true;
        $scope.achievments_view_container = false;
        $scope.add_achievements_container = false;
        $scope.AchievmentsTempStatus = true;
        $scope.add_achievmentsset = undefined;
        $scope.achievementsTemp = angular.copy(logininfo.UserAchievements);
        $scope.services_addset = undefined;
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'AchievementsProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.add_achievments = function () {
        $scope.edit_view_achievments = false;
        $scope.achievments_view_container = true;
        $scope.add_achievements_container = true;
        $scope.add_achievmentsset = "";
        $scope.services_addset = undefined;
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'AchievementsProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.publication_view_container = true;
    $scope.publication_edit = function () {
        $scope.edit_view_publication = true;
        $scope.publication_view_container = false;
        $scope.publication_add_container = false;
        $scope.publicationTempStatus = true;
        $scope.publicationTemp = angular.copy(logininfo.UserPublishing);
        $scope.addPublication = undefined;
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'PublicationsProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.add_publication = function () {
        $scope.edit_view_publication = false;
        $scope.publication_view_container = true;
        $scope.publication_add_container = true;
        $scope.addPublication = "";
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.awards_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'PublicationsProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.membership_view_container = true;
    $scope.membership_edit = function () {
        $scope.edit_view_membership = true;
        $scope.membership_view_container = false;
        $scope.add_view_membership = false;
        $scope.membership_addset = undefined;
        $scope.membershiptEditStatus = true;
        $scope.membershipTempData = angular.copy(logininfo.Memberships);
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'MembershipProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });

    };
    $scope.membership_add = function () {
        $scope.add_view_membership = true;
        $scope.edit_view_membership = false;
        $scope.membership_view_container = true;
        $scope.membership_addset = "";
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.awards_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'MembershipProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.edit_view_awards = false;
    $scope.awards_view_container = true;
    $scope.awards_edit = function () {
        $scope.edit_view_awards = true;
        $scope.awards_view_container = false;
        $scope.awards_add_container = false;
        $scope.awards_addset = undefined;
        $scope.awardsEditStatus = true;
        $scope.awardsTempData = angular.copy(logininfo.Awards);
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'AwardsProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.awards_add = function () {
        $scope.edit_view_awards = false;
        $scope.awards_view_container = true;
        $scope.awards_add_container = true;
        $scope.awards_addset = "";
        //$scope.education_cancel();
        //$scope.services_cancel();
        //$scope.achievments_cancel();
        //$scope.membership_cancel();
        //$scope.publication_cancel();
        //$scope.speciality_cancel();
        //$scope.profile_top_cancel();
        //$scope.about_cancel();
        //$scope.contact_cancel();
        SetupPopUp = $uibModal.open({
            "templateUrl": 'AwardsProfileData.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "size": "lg"
        });
    };
    $scope.editmode = true;
    $scope.Update = function (loginform, logininfo, pageno) {
        //console.log(loginform.$valid)
        //if (!loginform.$valid) {
        //    return;
        //}
        //logininfo.MobileNumber = logininfo.MobileNumber || '';
        if (logininfo.MobileNumber == undefined || logininfo.MobileNumber.length < 10) {
            $scope.phone_valid = true;
            alertify.error("Please Enter Valid MobileNumber");
            return;
        }
        else {
            $scope.phone_valid = false;
        }
        $scope.email_valid = true;
        //if (logininfo.Email == "") {
        //    alertify.error("Please Enter Valid Email");
        //}
        //if (logininfo.Email != "") {
        //    if (!emailfilter.test(logininfo.Email)) {
        //        $scope.email_valid = true;
        //        return;
        //    }
        //    else {
        //        $scope.email_valid = false;
        //    }
        //}

        //if (logininfo.Experience == undefined || logininfo.Experience == null) {
        //    $scope.experience_valid = true;
        //    return;
        //}
        //else {
        //    $scope.experience_valid = false;
        //}
        $scope.experience_valid = false;
        $scope.phone_valid = false;
        $scope.email_valid = false;
        if ($scope.edu_name !== undefined) {
            if ($scope.edu_name == "") {
                //alert("Degree cannot be empty");
                alertify.error("Degree cannot be empty");
                return;
            }
            logininfo.UserEducation.push({
                'EducationName': $scope.edu_name,
                'InstituteName': ($scope.edu_institute == undefined) ? '' : $scope.edu_institute,
                'edu_startyear': ($scope.start_year == undefined) ? '' : $scope.start_year,
                'edu_endyear': ($scope.end_year == undefined) ? '' : $scope.end_year
            });
        }
        $scope.education_name_valid = false;
        if ($scope.speciality_add !== undefined || $scope.speciality_add == "SELECTCODE") {
            if ($scope.speciality_add == "" || $scope.speciality_add == "SELECTCODE") {
                alertify.error("Speciality cannot be empty");
                return;
            }
            angular.forEach($scope.specialitylist, function (item) {
                if (item.Id == $scope.speciality_add) {
                    logininfo.specialization.push({
                        "SpecialityDesc": item.Name,
                        "SpecialityID": item.Id,
                        "SubSpecialityDesc": $scope.speciality_addCustomSpeciality == undefined ? '' : $scope.speciality_addCustomSpeciality
                    });
                }
            });
        }
        if ($scope.services_addset !== undefined) {
            if ($scope.services_addset == "") {
                alertify.error("Services cannot be empty");
                return;
            }
            logininfo.Services.push({
                'Name': $scope.services_addset
            });
        }
        if ($scope.add_achievmentsset !== undefined) {
            if ($scope.add_achievmentsset == "") {
                alertify.error("Achievement cannot be empty");
                return;
            }
            var length;
            var row_id;
            if (logininfo.UserAchievements.length > 0) {
                length = logininfo.UserAchievements.length;
                row_id = logininfo.UserAchievements[length - 1].RowID;
                row_id = row_id + 1;
            }
            else {
                row_id = 0;
            }
            logininfo.UserAchievements.push({
                'RowID': row_id,
                'Name': $scope.add_achievmentsset,
                'Year': '',
                'Indicator': "A"
            });
        }
        if ($scope.membership_addset !== undefined) {
            if ($scope.membership_addset == "") {
                alertify.error("Membership cannot be empty");
                return;
            }
            logininfo.Memberships.push({
                'Name': $scope.membership_addset
            });
        }
        if ($scope.addPublication !== undefined) {
            if ($scope.addPublication == "") {
                alertify.error("Publication cannot be empty");
                return;
            }
            var pub_length;
            var pub_row_id;
            if (logininfo.UserPublishing.length > 0) {
                pub_length = logininfo.UserPublishing.length;
                pub_row_id = logininfo.UserPublishing[pub_length - 1].RowID;
                pub_row_id = pub_row_id + 1;
            }
            else {
                pub_row_id = 0;
            }
            logininfo.UserPublishing.push({
                'RowID': pub_row_id,
                'Name': $scope.addPublication,
                'Year': '',
                'Indicator': "P"
            });
        }
        if ($scope.awards_addset !== undefined) {
            if ($scope.awards_addset == "") {
                alertify.error("Awards cannot be empty");
                return;
            }
            logininfo.Awards.push({
                'Name': $scope.awards_addset
            });
        }
        if (logininfo.DOB !== null) {
            var momentObj = moment(logininfo.DOB);
            var momment_currentdate = momentObj.format("MM-DD-YYYY");
            logininfo.DOB = momment_currentdate;
        }
        $scope.logininfo.doctorid = doctorinfo.doctorid;
        $scope.logininfo.RoleId = doctorinfo.RoleID;
        $scope.logininfo.GroupId = doctorinfo.groupID;
        eHnoteLoginObjService.addProfileInfo($scope.logininfo);
        $scope.showloading = true;

        $scope.logininfo.ResetPassWord = true;

        eHnoteUserProfileService.SaveUserProfile($scope.logininfo, pageno, OnProfileInfoSaved, OnError);
    };
    function OnProfileInfoSaved(data) {
        if (data == "Invalid EmailId") {
            alertify.error('Invalid Email id');
        }
        else {
            doctorinfo.doctordata = data;
            eHnoteMasterDataService.addUserInfo(doctorinfo);
            $scope.showloading = false;
            $scope.about_view_container = true;
            $scope.edit_info = false;
            $scope.AchievmentsTempStatus = $scope.membershiptEditStatus = $scope.awardsEditStatus = $scope.edutempStatus = $scope.servicesTempStatus = $scope.publicationTempStatus = $scope.specialityTempstatus = $scope.edit_contactTemp = $scope.aboutedit_status = $scope.profileToeedit_status = false;
            $scope.education_cancel();
            $scope.services_cancel();
            $scope.achievments_cancel();
            $scope.membership_cancel();
            $scope.awards_cancel();
            $scope.publication_cancel();
            $scope.speciality_cancel();
            $scope.profile_top_cancel();
            $scope.ChangePassword_cancel();
            $scope.about_cancel();
            $scope.contact_cancel();
            $location.path('/doctorprofile');
            $scope.awards_addset = $scope.addPublication = $scope.membership_addset = $scope.add_achievmentsset = $scope.services_addset = $scope.speciality_add = $scope.edu_name = $scope.speciality_addCustomSpeciality = undefined;
            getDoctorInfoData();
            $scope.ChangePassForm.$setPristine();
            $scope.ChangePassForm.$setUntouched();
            alertify.success('Profile Information updated successfully');
        }
    }
    function OnError(data) {
        $scope.showloading = false;
    }
    $scope.AddSpeciality = function () {
        var newitem = { DoctorSpecialityID: '' };
        $scope.logininfo.specialization.push(newitem);
        $scope.speciality_edit_view = true;
        $scope.speciality_view_container = false;
    };
    $scope.RemoveSpeciality = function (item) {
        var index = $scope.logininfo.specialization.indexOf(item);
        $scope.logininfo.specialization.splice(index, 1);
    };
    $scope.AddEducation = function () {
        var newitem = { EducationName: '', InstituteName: '', FullName: '', Active: 'Y' };
        $scope.logininfo.UserEducation.push(newitem);
        $scope.add_education();
    };
    $scope.RemoveEducation = function (item) {
        var index = $scope.logininfo.UserEducation.indexOf(item);
        $scope.logininfo.UserEducation.splice(index, 1);
    };
    $scope.AddService = function () {
        var newitem = { name: '' };
        $scope.logininfo.Services.push(newitem);
        $scope.edit_view_services = true;
        $scope.services_view_container = false;
    };
    $scope.RemoveService = function (item) {
        var index = $scope.logininfo.Services.indexOf(item);
        $scope.logininfo.Services.splice(index, 1);
        $scope.services_view_container = false;
    };
    $scope.AddMembership = function () {
        var newitem = { name: '' };
        $scope.logininfo.Memberships.push(newitem);
        $scope.edit_view_membership = true;
        $scope.membership_view_container = false;
    };
    $scope.RemoveMembership = function (item) {
        var index = $scope.logininfo.Memberships.indexOf(item);
        $scope.logininfo.Memberships.splice(index, 1);
        $scope.membership_view_container = false;
    };
    $scope.AddAward = function () {
        var newitem = { name: '' };
        $scope.logininfo.Awards.push(newitem);
        $scope.edit_view_awards = true;
        $scope.awards_view_container = false;
    };
    $scope.RemoveAward = function (item) {
        var index = $scope.logininfo.Awards.indexOf(item);
        $scope.logininfo.Awards.splice(index, 1);
        $scope.awards_view_container = false;
    };
    $scope.AddPublications = function () {
        var newitem = { "publishedBy": '', "publishedBooks": '', "Year": '', "Name": '', "Active": 'Y' };
        $scope.logininfo.UserPublishing.push(newitem);
        $scope.publication_view_container = false;
    };
    $scope.RemovePublications = function (item) {
        var index = $scope.logininfo.UserPublishing.indexOf(item);
        $scope.logininfo.UserPublishing.splice(index, 1);
        $scope.edit_view_publication = true;
    };
    $scope.AddAchievements = function () {
        var newitem = { Name: '', Year: '', "Active": 'Y' };
        $scope.logininfo.UserAchievements.push(newitem);
        $scope.achievments_view_container = false;
    };
    $scope.RemoveAchievements = function (item) {
        var index = $scope.logininfo.UserAchievements.indexOf(item);
        $scope.logininfo.UserAchievements.splice(index, 1);
        $scope.edit_view_achievments = true;
    };
    $scope.GetImageFromString = function (imagestr) {
        return GetImage(imagestr);
    };
    $scope.GetFee = function (addressid) {
        var fee = "";
        angular.forEach($scope.doctorinfo.UserConsultation, function (item) {
            if (item.UserBranchId == addressid) {
                fee = item.Fees;
                return fee;
            }
        });
        return fee;
    };
    $scope.GetQualification = function (qualification) {
        return GetQualification(qualification);
    };
    $scope.GetMemberID = function (MemberID) {
        return GetMemberID(MemberID);
    };
    $scope.GetSpeciality = function (code) {
        return GetSpeciality(doctorinfo.specialitylist, code);
    };
    $scope.GetSpecialityById = function (splCode) {
        var spl = "";
        angular.forEach($scope.specialitylist, function (item) {
            if (item.Name == splCode) {
                spl = item.Name;
                return spl;
            }
        });
        return spl;
    };
    $scope.GetValues = function (val) {
        return GetDictionaryValues(val);
    };
    $scope.EditPersonalInfo = function () {
        $location.path('/personalinfo');
    };
    $scope.EditAbout = function () {
        $location.path('/professionalinfo');
    };
    $scope.EditPractise = function () {
        $location.path('/practiseinfo');
    };
    

    $scope.IsPasswordEditMode = false;
    $scope.changePasswordsave = function (form, obj, logininfo) {

        $scope.UserPassword.ConfirmPassword = obj.ConfirmPassword || "";
        $scope.UserPassword.Password = obj.Password || "";
        logininfo.Userpassword = obj.Password;

        if ($scope.UserPassword.Password === "") {
            alertify.error("Please Enter Valid Password");
            return false;
        }

        if ($scope.UserPassword.ConfirmPassword === "") {
            alertify.error("Please Enter Confirm Password");
            return false;
        }

        $scope.Update(form, logininfo, 2)


    }

    $scope.EditChangePassword = function () {

        setTimeout(function () {
            var element = window.document.getElementById("password");
            if (element)
                element.focus();
        }, 500);
    }
    $scope.ChangePassword_cancel = function () {
        $scope.IsPasswordEditMode = false;
        $scope.UserPassword = {
            "Password": "",
            "ConfirmPassword": "",
            "SignOffPWDInd": false,
            "SignOffPassword": ""
        };
    }

    function GetUrl(key) {
        var url = "";
        var val = datapersistanceFactory.getItemString(key);
        if (val == null || val.length == 0)
            url = "";
        else {
            url = val.replace('"', '').replace('"', '');
        }
        return url;
    }
    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.ImageDocumentArray, index);
    };
    $scope.getkeyvallength = function (val) {
        if (val !== undefined) {
            return Object.keys(val).length;
        }
    };
    if ($location.search().screen != undefined && $location.search().screen == "Practice") {
        $scope.tabno = 2;
    }


    $scope.GetDoctor = function () {
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "USRType": "ADMIN",
            "USRId": doctorinfo.doctorid
        };
        eHnoteMainAdminServices.getDoctorPost(params, onDoctorDetailsSuccess, onDoctorDetailsError);
        function onDoctorDetailsSuccess(data) {


            $scope.selectedDoctor = data;
            $scope.UserPassword.SignOffPWDInd = data.User[0].SignOffPWDInd;
            $scope.UserPassword.SignOffPassword = data.User[0].SignOffPassword;
            if ($scope.selectedDoctor.User[0].UserLoginID.length > 0) {
                $scope.UserLoginEmailID = $scope.selectedDoctor.User[0].UserLoginID;
            }
        }
        function onDoctorDetailsError(data) {
        }
    }

    $scope.GetDoctor();


    $scope.Telecurrentdaycode = $filter('date')(new Date(), "EEE").toUpperCase();
    $scope.ActiveTimeSlot = function (data, Type) {
        // data.IsSlotActive = !data.IsSlotActive;
        var obj = {
            "UserBranchConsultID": data.UserBranchConsultID,
            "IsSlotActive": !data.IsSlotActive,
            "Type": Type,
            "UserId": doctorinfo.doctordata.User[0].DoctorID,
        }
        eHnoteMainAdminServices.AddUpdateActiveSlots(obj).success(function (subdata) {
            if (subdata.status === "Failure") {
                alertify.error(subdata.Message);
            } else {

                data.IsSlotActive = !data.IsSlotActive;
            }
        }).error(function (error) {
            alertify.error(error.Message);

        });

    };
    $scope.showAddNewSlot = false;

    $scope.clickShowAddslotDiv = function () {
        $scope.showAddNewSlot = true;
    };
    $scope.clearslot = function () {
        $scope.showAddNewSlot = false;
    };

    //var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');
    var brancList = localStorageFactory.getItem('allBranchesData');
    //var brancList = doctorinfo.doctordata;

    if (brancList.length > 0) {
        $scope.branchDetails = angular.copy(brancList);

    }

    $scope.NormalTeleslot = "Normal";
    //$scope.Teleslot = "Tele";
    $scope.changeslot = function (type) {
        $scope.NormalTeleslot = type;
    };
    $scope.changebranch = function (item) {
        console.log(item);
        $scope.HospitalID = item;

    };

    $scope.GetConnectUserSchedule = function () {
        $scope.ConnectedUserScheduleSlotsArray = [];

        var params = {
            "DoctorIds": "",
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        }
        if ($scope.connectedUserObj.Available && $scope.connectedUserObj.Users.length > 0) {
            var SubArray = _.pluck($scope.connectedUserObj.Users, "ChildUserId").join(",");
            params.DoctorIds = SubArray;
            if ($scope.RoleID == 1 || $scope.RoleID == 43) {
                params.DoctorIds = doctorinfo.doctorid.toString() + "," + params.DoctorIds;
            }
        } else {
            if ($scope.RoleID == 1 || $scope.RoleID == 43) {
                params.DoctorIds = doctorinfo.doctorid.toString();
            }
        }

        // The Schedule tab uses this to tell "still loading" from "nothing to show"
        $scope.ConnectedUserSlotsLoading = true;
        eHnoteMainAdminServices.GetConnectUserScheduledSlots(params, callbackuserSlotSuccess, callbackuserSlotError);
        function callbackuserSlotSuccess(resp) {
            $scope.ConnectedUserSlotsLoading = false;
            if (resp.status === "Success") {
                $scope.ConnectedUserScheduleSlotsArray = resp.rows || [];

                if ($scope.ConnectedUserScheduleSlotsArray.length > 0) {
                    angular.forEach($scope.ConnectedUserScheduleSlotsArray, function (citem) {
                        citem.IsShowUserSchedule = false;
                        if ($scope.ConnectedUserScheduleSlotsArray.length == 1) {
                            citem.IsShowUserSchedule = true;
                        }
                        if (citem.UserSchedule.length > 0) {
                            angular.forEach(citem.UserSchedule, function (subitem) {
                                subitem.ContentShow = false;
                                if (subitem.FromDate != null && subitem.FromDate != '') {
                                    subitem.FromDate = $filter("date")(new Date(subitem.FromDate + ' ' + '00:00:00'), "MM-dd-yyyy");
                                }
                                if (subitem.ToDate != null && subitem.ToDate != '') {
                                    subitem.ToDate = $filter("date")(new Date(subitem.ToDate + ' ' + '00:00:00'), "MM-dd-yyyy");
                                }
                                subitem.IsAdvancedSlotsActive = false;
                                subitem.Type = subitem.Type || 'Duration';

                                if (subitem.UserScheduleDetails.length > 0) {
                                    angular.forEach(subitem.UserScheduleDetails, function (Aitem) {
                                        var list1 = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, function (kitem, index) { return kitem.BranchId == Aitem.BranchId && kitem.UserBranchId == Aitem.UserBranchId });
                                        if (list1.length > 0) {
                                            Aitem.BranchObj = list1[0];
                                        }

                                        var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                        var dateStarttime = currentDt + "T" + Aitem.StartTime;
                                        var dateEndtime = currentDt + "T" + Aitem.EndTime;

                                        var CurrentStartTime = $filter("date")(new Date(dateStarttime), "h:mm a");
                                        var CurrentEndTime = $filter("date")(new Date(dateEndtime), "h:mm a");

                                        Aitem.displaystarttime = CurrentStartTime || '';
                                        Aitem.displayEndtime = CurrentEndTime || '';
                                        Aitem.OnlineSlots = Aitem.OnlineSlots || [];
                                        Aitem.BreakSlots = Aitem.BreakSlots || [];

                                        if (Aitem.BreakSlots.length > 0) {
                                            angular.forEach(Aitem.BreakSlots, function (Citem) {
                                                var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                Citem.displaystarttime = CurrentStartTime || '';
                                                Citem.displayEndtime = CurrentEndTime || '';

                                            });
                                        }
                                        if (Aitem.OnlineSlots.length > 0) {
                                            angular.forEach(Aitem.OnlineSlots, function (Citem) {
                                                var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                Citem.displaystarttime = CurrentStartTime || '';
                                                Citem.displayEndtime = CurrentEndTime || '';

                                            });
                                        }

                                        if (Aitem.SlotsList.length > 0) {
                                            angular.forEach(Aitem.SlotsList, function (Citem) {
                                                var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                Citem.displaystarttime = CurrentStartTime || '';
                                                Citem.displayEndtime = CurrentEndTime || '';

                                            });
                                        }
                                    });
                                }

                                subitem.Daylist = "";
                                if (subitem.UserDaySlots.length > 0) {
                                    var uniqlist = _.uniq(subitem.UserDaySlots, false, function (p) { return p.Day; });
                                    var joinList = "";
                                    joinList = _.pluck(uniqlist, "Day").join(",");
                                    subitem.Daylist = joinList;
                                }

                                subitem.ScheduleMonthMultiEveryType = subitem.ScheduleMonthMultiEveryType || "";
                                subitem.ScheduleMonthMultiEveryList = [];
                                if (subitem.ScheduleMonthMultiEveryType != '') {
                                    subitem.ScheduleMonthMultiEveryList = subitem.ScheduleMonthMultiEveryType.split(',');
                                }

                            });
                        }
                    });
                }


            }
        }
        function callbackuserSlotError(err) {
            $scope.ConnectedUserSlotsLoading = false;
            alertify.error("Some Error Occured");
        }
    }

    $scope.Profileshowscreen = 1;
    $scope.ProfileclickShow = function (id) {
        $scope.Profileshowscreen = id;
        $scope.MainUserObj.BasicInfo = $scope.newUserBasicInfoObj;

        if (id == 2) {           
            $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();

            $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();


            $scope.TimeSlots = getNewTimeSlotsEmptyObj();
            $scope.getSlotTimesList();
            $scope.getUserBranchOtherDetails($scope.MainUserObj.BasicInfo.UserId);
            $scope.showAddTimeSlotDev = true;



            var newdate = new Date();
            $scope.isCurrentPreviousMonth = true;
            var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

            var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
            var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




            $scope.selectedDate = firstDay;


            var startDate = firstDay;
            var EndDate = lastDay;
            var DateArray = [];

            var ExtraDaysCount = 0;



            var daynumber = new Date(firstDay).getDay();





            var currentMonthFirstDate = getMonthFirstDate(firstDay);

            DateArray = getDates(currentMonthFirstDate, EndDate);
            $scope.MainTimerArray = [];
            $scope.TimerWeekArray = [];
            $scope.selectedCurrentWeek = 1;
            console.log(newdate);
            formTimerArray(DateArray, newdate);
            $scope.startTimeHH.start = '00';
            $scope.endTimeHH.start = '';

            $scope.GetConnectUserSchedule();

        }


    }
    $scope.DeleteClick = function (type, i) {
        if (type == "Education") {
            $scope.logininfo.UserEducation.splice(i, 1);
        }
        if (type == "Memberships") {
            $scope.logininfo.Memberships.splice(i, 1);
        }
        if (type == "Speciality") {
            $scope.logininfo.specialization.splice(i, 1);
        }
        if (type == "Services") {
            $scope.logininfo.Services.splice(i, 1);
        }
        if (type == "Achievements") {
            $scope.logininfo.UserAchievements.splice(i, 1);
        }
        if (type == "Publications") {
            $scope.logininfo.UserPublishing.splice(i, 1);
        }
        if (type == "Awards") {
            $scope.logininfo.Awards.splice(i, 1);
        }

    }

    $scope.startTimeHH = {
        'start': "00"
    };
    $scope.endTimeHH = {
        'start': "00"
    };
    $scope.startTimeMM = {
        'end': "00"
    };
    $scope.endTimeMM = {
        'end': "00"
    };
    $scope.hospital = {
        "minpercase": "15",
        "Teleminpercase": "5",
        "ConsulationPrice": "",
        "ConsulationFreeSlots": "",
        "ConsulationFreeSlotsDays": "",
        "ConsulationFreeSlotsDaysType": "D",
        "TeleConsulationPrice": "",
        "TeleConsulationFreeSlots": "",
        "TeleConsulationFreeSlotsDays": "",
        "TeleConsulationFreeSlotsDaysType": "D"
    };
    
  
    function getuserBranchTimeSLotemptyObj() {
        var obj = {
            "BranchObj": "",
            "BranchId": "",
            "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
            "UserTimeSlotId": 0,
            "SlotDate": "",
            "SlotStartTime": "",
            "SlotEndTime": "",
            "SlotTypeId": 1,
            "OTStartTime": "",
            "OTEndTime": "",
            "IsNewFollowUpAscSameSlots": true,
            "NewAppointmentStartTime": "",
            "NewAppointmentEndTime": "",
            "FollowUpAppointmentStartTime": "",
            "FollowUpAppointmentEndTime": "",
            "IsNewAppointmentWalkinOnlineTeleSameSlots": true,
            "NewAppointmentWalkinStartTime": "",
            "NewAppointmentWalkinEndTime": "",
            "NewAppointmentOnlineStartTime": "",
            "NewAppointmentOnlineEndTIme": "",
            "NewAppointmentTeleStartTime": "",
            "NewAppointmentTeleEndTime": "",
            "IsFollowUpWalkinOnlineSameSlots": true,
            "FollowUpWalkinStartTime": "",
            "FollowUpWalkinEndTime": "",
            "FollowUpOnlineStartTime": "",
            "FollowUpOnlineEndTime": "",
            "FollowUpTeleStartTime": "",
            "FollowUpTeleEndTime": "",
            "NewAppointmentMaxSlots": 0,
            "FollowUpAppointmentMaxSlots": 0,
            "OTAppointmentMaxSlots": 0,
            "IsLeave": false,
            "LeaveRemarks": ""
        };

        return obj;
    }

    $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();

    function getNewUserBasicInfoObject() {
        var obj = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId,
            "UserId": doctorinfo.doctorid ,
            "PrefixId": "",
            "Prefix": "",
            "FirstName": "",
            "LastName": "",
            "SuffixId": "",
            "Gender": "Male",
            "DOB": "",
            "Mobile": "",
            "ContactNo": "",
            "UserProfilePicUrl": "",
            "CountryCode": "91",
            "MainPhType": "M",
            "AreaCode": "",
            "Experience": "",
            "CommunicationMobile": "",
            //"CommunicationCountryCode": "91",
            "CommunicationPhType": "M",
            "CommunicationAreaCode": "",
            "CommunicationEmailId": "",
            "UserName": "",
            "CountryCode": "+1",
            "CommunicationCountryCode": "+1",
            "showResetPassword": true,
            "Password": "",
            "ConfirmPassword": "",
            "CreatedUserId": doctorinfo.doctorid,
            "SpecializationId": "",
            "UserWorkingBranches": [],
            "UserBranchRoles": [],
            "UserSpecialization": "",
            "UserDesignation": "",
            "NPI": "",
            "ProviderId": "",

            "UserTaxId": "",
            "UserTaxonomyCode": "",
            "UserSSN": "",
            "UserFaxNumber": "",
            "MailingAddress": {
                "AddressId": 0,
                "AddressLine1": "",
                "AddressLine2": "",
                "CityId": "",
                "CityName": "",
                "StateId": "",
                "StateName": "",
                "CountryId": "",
                "CountyName": "",
                "ZipCode": "",
                "CountyId": "",
                "CountyName": "",
                "CountyCodeObj": ""

            },
            "PhysicalAddress": {
                "AddressId": 0,
                "AddressLine1": "",
                "AddressLine2": "",
                "CityId": "",
                "CityName": "",
                "StateId": "",
                "StateName": "",
                "CountryId": "",
                "CountyName": "",
                "ZipCode": "",
                "CountyId": "",
                "CountyName": "",
                "CountyCodeObj": ""


            },
            "AddressSameAsCopy": false,
            "SignatureOfUser": "",
            "UserMobileNo": "",
            "UserCommunicationMobileNo": ""
        }
        return obj;
    }

    $scope.newUserBasicInfoObj = getNewUserBasicInfoObject();
    function getTimeSlotObj() {
        var obj = {
            "UserTimeSlotId": 0,
            "UserTimeSlot": "",
            "BranchId": doctorinfo.doctordata.UserAddress[0].ClinicId,
            "BranchName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "BranchObj": "",
            "TemplateId": 0,
            "SlotType": 1,
            "IsLeave": false,
            "LeaveRemarks": "",
            "StartTime": "",
            "EndTime": "",
            "SelectedDatesArray": [],
            "VisitType": "",
            "AllAllowSlotsObj": {},
            "AllBranches": false
        };
        return obj;
    };

    function getnewUserbanchEntireTimeSLotObj() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "DoctorId": "",
            "BranchId": "",
            "UserBranchId": "",
            "UserBranchSlotsArray": [

            ]
        }
        return obj;
    };

    $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();


    $scope.newUserBranchTimeSlotObj = getTimeSlotObj();

    function getNewTimeSlotsEmptyObj() {
        var obj = {
            "SlotStartValues": [],
            "SlotStartTime": "",
            "SlotEndValues": [],
            "SlotEndTime": "",
            "OpSlotStartValues": [],
            "OpSlotStartTIme": [],
            "OpSlotEndValues": [],
            "OpSlotEndTime": [],
            "OTSlotStartValues": [],
            "OTSlotStartTime": [],
            "OTSlotEndValues": [],
            "OTSlotEndTime": [],
            "OpNewApptStartValues": [],
            "OpNewApptStartTime": [],
            "OpNewApptEndValues": [],
            "OpNewApptEndTime": [],
            "OpNewApptWalkinStartValues": [],
            "OpNewApptWalkinStartTime": [],
            "OpNewApptWalkinEndValues": [],
            "OpNewApptWalkinEndTime": [],
            "OpNewApptOnlineStartValues": [],
            "OpNewApptOnlineStartTime": [],
            "OpNewApptOnlineEndValues": [],
            "OpNewApptOnlineEndTime": [],
            "OpNewApptTeleStartValues": [],
            "OpNewApptTeleStartTime": [],
            "OpNewApptTeleEndValues": [],
            "OpNewApptTeleEndTime": [],
            "OpFollowUpStartValues": [],
            "OpFollowUpStartTime": [],
            "OpFollowUpEndValues": [],
            "OpFollowUpEndTime": [],
            "OpFollowUpWalkinStartValues": [],
            "OpFollowUpWalkinStartTime": [],
            "OpFollowUpWalkinEndValues": [],
            "OpFollowUpWalkinEndTime": [],
            "OpFollowUpOnlineStartValues": [],
            "OpFollowUpOnlineStartTime": [],
            "OpFollowUpOnlineEndValues": [],
            "OpFollowUpOnlineEndTime": [],
            "OpFollowUpTeleStartValues": [],
            "OpFollowUpTeleStartTime": [],
            "OpFollowUpTeleEndTime": [],
            "GeneralSlotTypeId": "",
            "GeneralSlotStartValues": [],
            "GeneralSlotEndValues": [],
            "GeneralStartTime": "",
            "GeneralEndTime": "",
            "VisitSlotSubTypeId": "",
            "VisitTypeSubStartValues": [],
            "VisitTypeSubEndValues": [],
            "VisitTypeStartTime": "",
            "VisitTypeEndTime": "",
            "GeneralMaxSolts": ""
        }

        return obj;
    };

    $scope.TimeSlots = getNewTimeSlotsEmptyObj();
    function GetAllowAllTimeSlots() {
        var obj = {
            "AllVisitTypeSlots": true,
            "WalkInStartTimeHH": "00",
            "WalkInStartTimeMM": "00",
            "WalkInEndTimeHH": "00",
            "WalkInEndTimeMM": "00",
            "IsWalkIn": true,
            "OnlineStartTimeHH": "00",
            "OnlineStartTimeMM": "00",
            "OnlineEndTimeHH": "00",
            "OnlineEndTimeMM": "00",
            "IsOnline": true,
            "TelephonicStartTimeHH": "00",
            "TelephonicStartTimeMM": "00",
            "TelephonicEndTimeHH": "00",
            "TelephonicEndTimeMM": "00",
            "IsTelephonic": true
        }
        return obj;
    };
    $scope.NewAllowAllTimeSlots = GetAllowAllTimeSlots();


    $scope.TimeSlots = {
        "SlotStartValues": [],
        "SlotStartTime": "",
        "SlotEndValues": [],
        "SlotEndTime": "",
        "OpSlotStartValues": [],
        "OpSlotStartTIme": [],
        "OpSlotEndValues": [],
        "OpSlotEndTime": [],
        "OTSlotStartValues": [],
        "OTSlotStartTime": [],
        "OTSlotEndValues": [],
        "OTSlotEndTime": [],
        "OpNewApptStartValues": [],
        "OpNewApptStartTime": [],
        "OpNewApptEndValues": [],
        "OpNewApptEndTime": [],
        "OpNewApptWalkinStartValues": [],
        "OpNewApptWalkinStartTime": [],
        "OpNewApptWalkinEndValues": [],
        "OpNewApptWalkinEndTime": [],
        "OpNewApptOnlineStartValues": [],
        "OpNewApptOnlineStartTime": [],
        "OpNewApptOnlineEndValues": [],
        "OpNewApptOnlineEndTime": [],
        "OpNewApptTeleStartValues": [],
        "OpNewApptTeleStartTime": [],
        "OpNewApptTeleEndValues": [],
        "OpNewApptTeleEndTime": [],
        "OpFollowUpStartValues": [],
        "OpFollowUpStartTime": [],
        "OpFollowUpEndValues": [],
        "OpFollowUpEndTime": [],
        "OpFollowUpWalkinStartValues": [],
        "OpFollowUpWalkinStartTime": [],
        "OpFollowUpWalkinEndValues": [],
        "OpFollowUpWalkinEndTime": [],
        "OpFollowUpOnlineStartValues": [],
        "OpFollowUpOnlineStartTime": [],
        "OpFollowUpOnlineEndValues": [],
        "OpFollowUpOnlineEndTime": [],
        "OpFollowUpTeleStartValues": [],
        "OpFollowUpTeleStartTime": [],
        "OpFollowUpTeleEndTime": [],
        "GeneralSlotTypeId": "",
        "GeneralSlotStartValues": [],
        "GeneralSlotEndValues": [],
        "GeneralStartTime": "",
        "GeneralEndTime": "",
        "VisitSlotSubTypeId": "",
        "VisitTypeSubStartValues": [],
        "VisitTypeSubEndValues": [],
        "VisitTypeStartTime": "",
        "VisitTypeEndTime": ""
    };


    $scope.generalSlotTypesArray = [
        {
            "VisitSlotType": "New",
            "VisitSlotTypeId": 1,
        },
        {
            "VisitSlotType": "FollowUp",
            "VisitSlotTypeId": 2,
        },
        {
            "VisitSlotType": "ASC",
            "VisitSlotTypeId": 3,
        }

    ];


    $scope.generalVisitSlotTypesArray = [
        {
            "VisitSlotSubType": "Walkin",
            "VisitSlotSubTypeId": 1,
        },
        {
            "VisitSlotSubType": "Online",
            "VisitSlotSubTypeId": 2,
        },
        {
            "VisitSlotSubType": "Tele",
            "VisitSlotSubTypeId": 3,
        }
    ];

    $scope.changemintues = function () {
        if ($scope.hospital.minpercase === "5") {
            $scope.consultationminituesvalue = [{ "mins": "00" }, { "mins": "05" }, { "mins": "10" }, { "mins": "15" }, { "mins": "20" }, { "mins": "25" }, { "mins": "30" }, { "mins": "35" }, { "mins": "40" }, { "mins": "45" }, { "mins": "50" }, { "mins": "55" }];
        }
        else if ($scope.hospital.minpercase === "10") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '10' }, { 'mins': '20' }, { 'mins': '30' }, { 'mins': '40' }, { 'mins': '50' }];
        }
        else if ($scope.hospital.minpercase === "15") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '15' }, { 'mins': '30' }, { 'mins': '45' }];
        }
        else if ($scope.hospital.minpercase === "20") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '20' }, { 'mins': '40' }];
        }
        else if ($scope.hospital.minpercase === "30") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '30' }];
        }
        else if ($scope.hospital.minpercase === "60") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }];
        }
    };
    $scope.Telechangemintues = function () {
        if ($scope.hospital.Teleminpercase === "5") {
            $scope.consultationminituesvalue = [{ "mins": "00" }, { "mins": "05" }, { "mins": "10" }, { "mins": "15" }, { "mins": "20" }, { "mins": "25" }, { "mins": "30" }, { "mins": "35" }, { "mins": "40" }, { "mins": "45" }, { "mins": "50" }, { "mins": "55" }];
        }
        else if ($scope.hospital.Teleminpercase === "10") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '10' }, { 'mins': '20' }, { 'mins': '30' }, { 'mins': '40' }, { 'mins': '50' }];
        }
        else if ($scope.hospital.Teleminpercase === "15") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '15' }, { 'mins': '30' }, { 'mins': '45' }];
        }
        else if ($scope.hospital.Teleminpercase === "20") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '20' }, { 'mins': '40' }];
        }
        else if ($scope.hospital.Teleminpercase === "30") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }, { 'mins': '30' }];
        }
        else if ($scope.hospital.Teleminpercase === "60") {
            $scope.consultationminituesvalue = [{ 'mins': '00' }];
        }
    };
    $scope.getWalkinOnlineGeneralSlotStartTimeList = function (obj) {


        $scope.TimeSlots.VisitTypeSubStartValues = [];
        $scope.TimeSlots.VisitTypeSubEndValues = [];

        var sttimeArray = obj.StartTime.split(':');
        var stTime = parseInt(sttimeArray[0]);

        $scope.TimeSlots.GeneralStartTime = "";




        if (obj.StartTime !== '00' && (obj.EndTime !== '00' || $scope.TimeSlots.EndTime !== "")) {


            var EndtimeArray = obj.EndTime.split(':');
            var EndtTime = parseInt(EndtimeArray[0]);

            var val1 = EndtTime;


            for (var i = parseInt(stTime); i < parseInt(val1); i++) {
                if (i > 9) {
                    $scope.TimeSlots.VisitTypeSubStartValues.push({ 'time': i });
                    $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': i });
                }
                else {
                    $scope.TimeSlots.VisitTypeSubStartValues.push({ 'time': '0' + i });
                    $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': '0' + i });

                }
            };



            console.log($scope.TimeSlots.VisitTypeSubStartValues);
            console.log($scope.TimeSlots.VisitTypeSubEndValues);



            var tempTimeArray = [];
            angular.forEach($scope.TimeSlots.VisitTypeSubStartValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.VisitTypeSubStartValues = angular.copy(tempTimeArray);


            console.log($scope.TimeSlots.VisitTypeSubStartValues);



            var tempTimeArray2 = [];
            angular.forEach($scope.TimeSlots.VisitTypeSubEndValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray2.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.VisitTypeSubEndValues = angular.copy(tempTimeArray2);






        }
    };
    $scope.WalkIngetEndTime = function (val) {
        $scope.WalkInEndValues = [];
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.WalkInEndValues.push({ 'time': i });
            } else {
                $scope.WalkInEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.WalkInEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.WalkInEndValues = angular.copy(tempTimeArray);
        if ($scope.WalkInEndValues.length > 0) {

            $scope.NewAllowAllTimeSlots.WalkInEndTimeHH = $scope.endTimeHH.start.toString() + ':' + "00";

        } else {
            $scope.NewAllowAllTimeSlots.WalkInEndTimeHH = '';
        }

    };

    $scope.OnlinegetEndTime = function (val) {
     
        $scope.OnlineEndValues = [];
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.OnlineEndValues.push({ 'time': i });
            } else {
                $scope.OnlineEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.OnlineEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.OnlineEndValues = angular.copy(tempTimeArray);
        if ($scope.OnlineEndValues.length > 0) {
            //  $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = $scope.OnlineEndValues[0].time.toString();
            $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = $scope.endTimeHH.start.toString() + ':' + "00";
            //$scope.NewAllowAllTimeSlots.OnlineEndTimeMM = $scope.endTimeMM.end.toString();
        } else {
            $scope.NewAllowAllTimeSlots.OnlineEndTimeHH = '';
        }
    };

    $scope.TelephonicgetEndTime = function (val) {
     
        $scope.TelephonicEndValues = [];
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TelephonicEndValues.push({ 'time': i });
            } else {
                $scope.TelephonicEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.TelephonicEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TelephonicEndValues = angular.copy(tempTimeArray);
        if ($scope.TelephonicEndValues.length > 0) {
            // $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = $scope.TelephonicEndValues[0].time.toString();
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = $scope.endTimeHH.start.toString() + ':' + "00";
            //$scope.NewAllowAllTimeSlots.TelephonicEndTimeMM = $scope.endTimeMM.end.toString();
        } else {
            $scope.NewAllowAllTimeSlots.TelephonicEndTimeHH = '';
        }
        //$scope.NewAllowAllTimeSlots.OnlineStartTimeHH = "";
        //$scope.NewAllowAllTimeSlots.OnlineEndTimeHH = "";
    };

    $scope.changemintues();
    $scope.startValues = [];
    $scope.endValues = [];

    function getMonthFirstDate(firstDay) {
        var daynumber = new Date(firstDay).getDay();
        var days; // Days you want to subtract
        var date = new Date();
        var startingdate = "";
        if (daynumber === 1) {//MON
            days = 0;
        }
        else if (daynumber === 2) { //TUE
            days = 1;
        }
        else if (daynumber === 3) { //WED
            days = 2;
        }
        else if (daynumber === 4) { //THU
            days = 3;
        }
        else if (daynumber === 5) { //FRI
            days = 4;
        }
        else if (daynumber === 6) { //SAT
            days = 5;
        }
        else if (daynumber === 0) { //SUN
            days = 6;
        }
        ExtraDaysCount = days + 1;
        var last = new Date(firstDay.getTime() - (days * 24 * 60 * 60 * 1000));
        startingdate = $filter('date')(new Date(last), "yyyy-MM-dd")
        return startingdate;
    }

    function formTimerArray(DateArray, selectedmonth) {


        for (var i = 0; i < DateArray.length; i++) {
            var obj = "";
            var IsCurrentDate = false;
            var IsFutureDate = false;
            var selectedWeek = false;
            var isHoliday = false;
            var holidayText = "";
            var currentselectedMonth = false;
            if (DateArray[i].FullDate == $filter('date')(new Date(), 'yyyy-MM-dd')) {
                IsCurrentDate = true;
            }

            if (moment(new Date(), "DD/MM/YYYY") < moment(DateArray[i].FullDate, "DD/MM/YYYY")) {
                IsFutureDate = true;
            }


            if (DateArray[i].Month === $filter('date')(new Date(selectedmonth), 'M')) {
                currentselectedMonth = true;
            }

            //angular.forEach($scope.HolidaysList, function (item) {
            //    var dateOne = $filter('date')(new Date(item.HolidayDate), 'yyyy-MM-dd');
            //    var dateTwo = DateArray[i].FullDate;
            //    if (dateOne === dateTwo) {
            //        isHoliday = true;
            //        holidayText = item.HolidayName;
            //    }
            //});

            var WeekNumber = 0;
            if (i >= 0 && i < 7) {
                WeekNumber = 1;
                selectedWeek = true;
                var weeknameObj = "";
                weeknameObj = {
                    "weekName": DateArray[i].Day
                }
                $scope.TimerWeekArray.push(weeknameObj);
            }
            if (i >= 7 && i < 14) {
                WeekNumber = 2;
            }
            if (i >= 14 && i < 21) {
                WeekNumber = 3;
            }
            if (i >= 21 && i < 28) {
                WeekNumber = 4;
            }
            if (i >= 28 && i < 35) {
                WeekNumber = 5;
            }
            if (i >= 35 && i < 42) {
                WeekNumber = 6;
            }

            $scope.weekitems = {
                "checkitem1": "N",
                "checkitem2": "N",
                "checkitem3": "N",
                "checkitem4": "N",
                "checkitem5": "N",
                "checkitem6": "N"
            }
            $scope.month = { "checkitem": "N" };


            obj = {
                "RowIndex": i + 1,
                "Day": DateArray[i].Day,
                "Week": WeekNumber,
                "Date": DateArray[i].Date,
                "FullDate": DateArray[i].FullDate,
                "IsCurrentDate": IsCurrentDate,
                "IsSelectedDate": false,
                "SelectedWeek": selectedWeek,
                "IsFutureDate": IsFutureDate,
                "IsSelectedMonth": currentselectedMonth,
                "IsHoliday": isHoliday,
                "IsHolidayText": holidayText,
                "IsDateSlotBooked": false,
                "IsDateSlotLeave": false,
                "BranchesName": "",
                "BranchesFullName": ""
            }



            $scope.MainTimerArray.push(obj);

        }
        console.log(selectedmonth);
        console.log($scope.MainTimerArray);



        var firstDay = new Date(selectedmonth.getFullYear(), selectedmonth.getMonth(), 1);
        var lastDay = new Date(selectedmonth.getFullYear(), selectedmonth.getMonth() + 1, 0);
        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "FromDate": $filter('date')(new Date(firstDay), "yyyy-MM-dd"),
            "ToDate": $filter('date')(new Date(lastDay), "yyyy-MM-dd"),
            "BranchId": 0,
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
            "SlotTypeId": 0
        }

        console.log(JSON.stringify(params));


        eHnoteMainAdminServices.getUserTimeSlots(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.status === "Success") {
                $scope.userBranchSlotList = resp.slotsList;


                var SlotsDateArray = getMonthDates(firstDay, lastDay);
                console.log(SlotsDateArray);


                angular.forEach(SlotsDateArray, function (bitem) {
                    angular.forEach($scope.userBranchSlotList, function (sitem) {
                        if (bitem.FullDate === sitem.SlotDate) {
                            if (sitem.SlotTypeId === 2) {
                                bitem.IsLeave = sitem.IsLeave;
                                bitem.UserTimeSlotId = sitem.UserTimeSlotId;
                            }
                            if (sitem.SlotTypeId === 1) {
                                if (bitem.BranchArray.length === 0) {
                                    var obj = {
                                        "BranchId": sitem.BranchId,
                                        "BranchName": sitem.BranchName,
                                        "TimeSlotsArray": []
                                    }
                                    bitem.BranchArray.push(obj);
                                } else {
                                    var filteredArray = $filter("filter")(bitem.BranchArray, function (iterator, ind) { return iterator.BranchId === sitem.BranchId; });

                                    if (filteredArray.length === 0) {
                                        var obj = {
                                            "BranchId": sitem.BranchId,
                                            "BranchName": sitem.BranchName,
                                            "TimeSlotsArray": []
                                        }
                                        bitem.BranchArray.push(obj);
                                    }
                                }
                            }
                        }
                    });
                });



                angular.forEach(SlotsDateArray, function (mitem) {
                    angular.forEach(mitem.BranchArray, function (bitem) {
                        angular.forEach($scope.userBranchSlotList, function (citem) {
                            if (mitem.FullDate === citem.SlotDate && bitem.BranchId === citem.BranchId) {
                                var pobj = {
                                    "UserTimeSlotId": citem.UserTimeSlotId,
                                    "StartTime": citem.SlotStartTime,
                                    "EndTime": citem.SlotEndTime
                                }
                                bitem.TimeSlotsArray.push(pobj);
                            }
                        });
                    });
                });


                $scope.modifiedUserSlotsArray = SlotsDateArray;



                angular.forEach($scope.modifiedUserSlotsArray, function (mainitem) {
                    angular.forEach($scope.MainTimerArray, function (subitem) {
                        if (mainitem.FullDate === subitem.FullDate) {
                            if (mainitem.SlotTypeId === 2) {
                                subitem.IsDateSlotLeave = true;
                            } else {
                                if (mainitem.BranchArray.length > 0) {
                                    subitem.IsDateSlotBooked = true;
                                    var totalLength = mainitem.BranchArray.length;
                                    angular.forEach(mainitem.BranchArray, function (bitem, bindex) {
                                        if (bindex === 0) {
                                            subitem.BranchesName = bitem.BranchName;
                                        }

                                        if (bindex === totalLength + 1 || bindex === 0) {
                                            subitem.BranchesFullName = bitem.BranchName;
                                        } else {
                                            subitem.BranchesFullName = subitem.BranchesFullName + " ," + bitem.BranchName;
                                        }
                                    });
                                }
                            }

                        }
                    });
                });








            } else {
                $scope.userBranchSlotList = [];
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }

    }


    var newdate = new Date();
    $scope.isCurrentPreviousMonth = true;
    var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

    var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
    $scope.selectedDate = firstDay;


    var startDate = firstDay;
    var EndDate = lastDay;
    var DateArray = [];

    $scope.months = [{
        Id: 0,
        Name: 'JANUARY'
    }, {
        Id: 1,
        Name: 'FEBRUARY'
    }, {
        Id: 2,
        Name: 'MARCH'
    }, {
        Id: 3,
        Name: 'APRIL'
    }, {
        Id: 4,
        Name: 'MAY'
    }, {
        Id: 5,
        Name: 'JUNE'
    }, {
        Id: 6,
        Name: 'JULY'
    }, {
        Id: 7,
        Name: 'AUGUST'
    }, {
        Id: 8,
        Name: 'SEPTEMBER'
    }, {
        Id: 9,
        Name: 'OCTOBER'
    }, {
        Id: 10,
        Name: 'NOVEMBER'
    }, {
        Id: 11,
        Name: 'DECEMBER'
    }];

    $scope.selectedmonth = newdate.getMonth();

    $scope.years = [];
    $scope.currentYear = newdate.getFullYear();
    // 10 Years from current year
    $scope.maxYear = new Date(newdate.setFullYear(newdate.getFullYear() + 10)).getFullYear();
    for (var x = $scope.currentYear; x <= $scope.maxYear; x++) {
        $scope.years.push({ Id: x, Name: x });
    }

    $scope.selectedyear = $scope.currentYear;

    function getMonthDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);

        var newstopDate = stopDate;

        while (currentDate <= newstopDate) {
            var obj = "";
            if (currentDate <= stopDate) {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "IsLeave": false,
                    "BranchArray": []
                }
            } else {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "IsLeave": false,
                    "BranchArray": []
                }
            }



            dateArray.push(obj)
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    function getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        var NoOfdays = stopDate.diff(currentDate, 'days');


        var maxDayCount = 34 + ExtraDaysCount;
        var diffDays = parseInt(maxDayCount) - parseInt(NoOfdays);

        //moment() stopDate.addDays(diffDays);
        var newstopDate = moment(stopDate, 'dd/MM/yyyy').add('days', diffDays);


        var newdatesdifference = newstopDate.diff(currentDate, 'days');

        if (newdatesdifference === 40) {
            var newstopDate = moment(stopDate, 'dd/MM/yyyy').add('days', diffDays + 1);
        }


        while (currentDate <= newstopDate) {
            var obj = "";
            if (currentDate <= stopDate) {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "Date": $filter('date')(new Date(currentDate), 'd'),
                    "Day": $filter('date')(new Date(currentDate), 'EEE'),
                    "Month": $filter('date')(new Date(currentDate), 'M')
                }
            } else {
                obj = {
                    "FullDate": $filter('date')(new Date(currentDate), 'yyyy-MM-dd'),
                    "Date": $filter('date')(new Date(currentDate), 'd'),
                    "Day": $filter('date')(new Date(currentDate), 'EEE'),
                    "Month": $filter('date')(new Date(currentDate), 'M')
                }
            }



            dateArray.push(obj)
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    $scope.getEndTime = function (val) {


        $scope.endValues = [];
        for (var i = parseInt(val); i < 24; i++) {
            if (i > 9) {
                $scope.endValues.push({ 'time': i });
            } else {
                $scope.endValues.push({ 'time': '0' + i });
            }
        }

        $scope.endTimeHH = {
            'start': ""
        };

        console.log($scope.endValues);

        console.log($scope.startTimeHH.start);
        if ($scope.startTimeHH.start !== '00' && ($scope.endTimeHH.start !== '00' || $scope.endTimeHH.start !== "")) {
            getStartTimeInAllowSlots($scope.startTimeHH.start);
        }
    };

    function getStartTimeInAllowSlots(val) {
        val = val || 0;
        $scope.AllowSlotsStartValues = [];
        $scope.NewAllowAllTimeSlots.AllVisitTypeSlots = true;
        $scope.NewAllowAllTimeSlots.IsWalkIn = true;
        $scope.NewAllowAllTimeSlots.IsOnline = true;
        $scope.NewAllowAllTimeSlots.IsTelephonic = true;
        var val1 = 24;
        if ($scope.endTimeHH.start == '00') {
            val1 = 24;
        } else if ($scope.endTimeHH.start !== '00') {
            val1 = $scope.endTimeHH.start;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.AllowSlotsStartValues.push({ 'time': i });
            }
            else {
                $scope.AllowSlotsStartValues.push({ 'time': '0' + i });
            }
        }
        // new code
        var tempTimeArray = [];
        angular.forEach($scope.AllowSlotsStartValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.AllowSlotsStartValues = angular.copy(tempTimeArray);


        $scope.newUserTimeSlotObj.SlotStartTime = $scope.startTimeHH.start.toString() + ':' + "00";
        $scope.newUserTimeSlotObj.SlotEndTime = $scope.endTimeHH.start.toString() + ':' + "00";

    };
    $scope.changeEndTimeSlot = function () {
        getStartTimeInAllowSlots($scope.startTimeHH.start);
    };
    $scope.ChangeAllAllowSlotsModes = function () {
        if ($scope.NewAllowAllTimeSlots.AllVisitTypeSlots) {
            getStartTimeInAllowSlots($scope.startTimeHH.start);
            $scope.NewAllowAllTimeSlots.IsWalkIn = true;
            $scope.NewAllowAllTimeSlots.IsOnline = true;
            $scope.NewAllowAllTimeSlots.IsTelephonic = true;
        }
    };


    $scope.MainUserObj = {
        "BasicInfo": "",
        "UserBranchTimeSlots": "",
        "UserBranchRolesnRights": [],
        "UserBranchSubSpecialities": []
    };


    $scope.UserBranchAccessRights = [];
    $scope.UserBranchSubAccessCategories = [];
    $scope.UserBranchSubSpecialitiesArray = [];
    $scope.getUserBranchOtherDetails = function (UserId) {

        eHnoteMainAdminServices.getUserBranchParticularDtls(UserId).then(function (resp) {
            console.log(resp);
            $scope.UserBranchAccessRights = [];
            $scope.UserBranchSubAccessCategories = [];
            $scope.MainUserObj.UserBranchRolesnRights = [];
            if (resp.data.UserBranchDetails.length > 0) {
                $scope.MainUserObj.UserBranchRolesnRights = resp.data.UserBranchDetails;


            }
        });
    }

    

    $scope.getSlotTimesList = function () {

        $scope.TimeSlots.SlotStartValues = [];

        for (var i = 0; i < 24; i++) {
            if (i > 9) {
                $scope.TimeSlots.SlotStartValues.push({ 'time': i });
            }
            else {
                $scope.TimeSlots.SlotStartValues.push({ 'time': '0' + i });
            }
        }

        console.log($scope.TimeSlots.SlotStartValues);
        $scope.TimeSlots.SlotEndValues = [];
        for (var i = 0; i < 24; i++) {
            if (i > 9) {
                $scope.TimeSlots.SlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.SlotEndValues.push({ 'time': '0' + i });
            }
        }



        console.log($scope.TimeSlots.SlotEndValues);
    };

    $scope.getSlotTimesList();


    $scope.getGeneralSlotStartTimesList = function (val) {


        $scope.TimeSlots.GeneralSlotStartValues = [];
        $scope.TimeSlots.GeneralSlotEndValues = [];


        $scope.TimeSlots.GeneralStartTime = "";




        if ($scope.TimeSlots.SlotEndTime !== '00' || $scope.TimeSlots.SlotEndTime !== "") {




            var val1 = 24;
            if ($scope.TimeSlots.SlotEndTime == '00' || $scope.TimeSlots.SlotEndTime == "") {
                val1 = 24;
            } else if ($scope.TimeSlots.SlotEndTime !== '00') {
                val1 = $scope.TimeSlots.SlotEndTime;
            }

            for (var i = parseInt($scope.TimeSlots.SlotStartTime); i < parseInt(val1); i++) {
                if (i > 9) {
                    $scope.TimeSlots.GeneralSlotStartValues.push({ 'time': i });
                    $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': i });
                }
                else {
                    $scope.TimeSlots.GeneralSlotStartValues.push({ 'time': '0' + i });
                    $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': '0' + i });

                }
            };



            console.log($scope.TimeSlots.GeneralSlotStartValues);
            console.log($scope.TimeSlots.GeneralSlotEndValues);



            var tempTimeArray = [];
            angular.forEach($scope.TimeSlots.GeneralSlotStartValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.GeneralSlotStartValues = angular.copy(tempTimeArray);


            console.log($scope.TimeSlots.GeneralSlotStartValues);



            var tempTimeArray2 = [];
            angular.forEach($scope.TimeSlots.GeneralSlotEndValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray2.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.GeneralSlotEndValues = angular.copy(tempTimeArray2);


            //$scope.newUserTimeSlotObj.SlotStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            //$scope.newUserTimeSlotObj.SlotEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";


        }
    };

    $scope.getUserTimeSlots = function (firstDay, lastDay) {



        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "FromDate": $filter('date')(new Date(firstDay), "yyyy-MM-dd"),
            "ToDate": $filter('date')(new Date(lastDay), "yyyy-MM-dd"),
            "BranchId": ($scope.newUserBranchTimeSlotObj.BranchObj !== "") ? $scope.newUserBranchTimeSlotObj.BranchObj.BranchId : 0,
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
            //  "SlotTypeId": $scope.userSlotTypeId
            "SlotTypeId": 0
        }

        console.log(JSON.stringify(params));


        eHnoteMainAdminServices.getUserTimeSlots(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.status === "Success") {
                $scope.userBranchSlotList = resp.slotsList;
                var SlotsDateArray = getMonthDates(firstDay, lastDay);
                console.log(SlotsDateArray);


                angular.forEach(SlotsDateArray, function (bitem) {
                    angular.forEach($scope.userBranchSlotList, function (sitem) {
                        if (bitem.FullDate === sitem.SlotDate) {
                            bitem.FollowUpAppointmentEndTime = sitem.FollowUpAppointmentEndTime;
                            bitem.FollowUpAppointmentMaxSlots = sitem.FollowUpAppointmentMaxSlots;
                            bitem.FollowUpAppointmentStartTime = sitem.FollowUpAppointmentStartTime;
                            bitem.FollowUpOnlineEndTime = sitem.FollowUpOnlineEndTime;
                            bitem.FollowUpOnlineStartTime = sitem.FollowUpOnlineStartTime;
                            bitem.FollowUpTeleEndTime = sitem.FollowUpTeleEndTime;
                            bitem.FollowUpTeleStartTime = sitem.FollowUpTeleStartTime;
                            bitem.FollowUpWalkinEndTime = sitem.FollowUpWalkinEndTime;
                            bitem.FollowUpWalkinStartTime = sitem.FollowUpWalkinStartTime;
                            bitem.IsFollowUpWalkinOnlineSameSlots = sitem.IsFollowUpWalkinOnlineSameSlots;
                            bitem.IsNewAppointmentWalkinOnlineTeleSameSlots = sitem.IsNewAppointmentWalkinOnlineTeleSameSlots;
                            bitem.IsNewFollowUpAscSameSlots = sitem.IsNewFollowUpAscSameSlots;
                            bitem.IsOpOTSameSlots = sitem.IsOpOTSameSlots;
                            bitem.LeaveRemarks = sitem.LeaveRemarks;
                            bitem.NewAppointmentEndTime = sitem.NewAppointmentEndTime;
                            bitem.NewAppointmentMaxSlots = sitem.NewAppointmentMaxSlots;
                            bitem.NewAppointmentOnlineEndTIme = sitem.NewAppointmentOnlineEndTIme;
                            bitem.NewAppointmentOnlineStartTime = sitem.NewAppointmentOnlineStartTime;
                            bitem.NewAppointmentStartTime = sitem.NewAppointmentStartTime;
                            bitem.NewAppointmentTeleEndTime = sitem.NewAppointmentTeleEndTime;
                            bitem.NewAppointmentTeleStartTime = sitem.NewAppointmentTeleStartTime;
                            bitem.NewAppointmentWalkinEndTime = sitem.NewAppointmentWalkinEndTime;
                            bitem.NewAppointmentWalkinStartTime = sitem.NewAppointmentWalkinStartTime;
                            bitem.OPEndTime = sitem.OPEndTime;
                            bitem.OPStartTime = sitem.OPStartTime;
                            bitem.OTAppointmentMaxSlots = sitem.OTAppointmentMaxSlots;
                            bitem.OTEndTime = sitem.OTEndTime;
                            bitem.OTStartTime = sitem.OTStartTime;
                            bitem.SlotDate = sitem.SlotDate;
                            bitem.SlotStartTime = sitem.SlotStartTime;
                            bitem.SlotEndTime = sitem.SlotEndTime;
                            bitem.SlotType = sitem.SlotType;
                            bitem.SlotTypeId = sitem.SlotTypeId;
                            bitem.UserTimeSlotId = sitem.UserTimeSlotId;
                            if (sitem.SlotTypeId === 2) {
                                bitem.IsLeave = sitem.IsLeave;
                                bitem.UserTimeSlotId = sitem.UserTimeSlotId;
                            }

                        }
                    });
                });

                console.log(SlotsDateArray);




                $scope.modifiedUserSlotsArray = SlotsDateArray;

                console.log($scope.modifiedUserSlotsArray);


            } else {
                $scope.userBranchSlotList = [];
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }



    $scope.showAddTimeSlotDev = true;
    $scope.showBranchUserSlots = function (val) {
        $scope.newUserBranchTimeSlotObj = getTimeSlotObj();
        $scope.NewAllowAllTimeSlots = GetAllowAllTimeSlots();
        $scope.startTimeHH.start = "00";
        $scope.endTimeHH.start = "";
        $scope.getEndTime(0);
        //$scope.newUserBranchTimeSlotObj.BranchObj = $scope.MainUserObj.BasicInfo.UserWorkingBranches[0];
      
        $scope.newUserBranchTimeSlotObj.BranchId = $scope.MainUserObj.UserBranchRolesnRights.BranchId;
        $scope.newUserBranchTimeSlotObj.UserBranchId = $scope.MainUserObj.UserBranchRolesnRights.UserBranchId;
        console.log(val);
        $scope.showAddTimeSlotDev = !val;
        if (!$scope.showAddTimeSlotDev) {
            $scope.isCurrentPreviousMonth = true;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


            var fullyear = date.getFullYear();
            var fullmonth = date.getMonth();

            $scope.selectedmonth = fullmonth;
            $scope.selectedyear = fullyear;
            $scope.userSlotTypeId = 1;
            $scope.isNormalSlot = true;
            $scope.getUserTimeSlots(firstDay, lastDay);
        } else {
            var newdate = new Date();
            $scope.isCurrentPreviousMonth = true;
            var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

            var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
            var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




            $scope.selectedDate = firstDay;


            var startDate = firstDay;
            var EndDate = lastDay;
            var DateArray = [];

            var ExtraDaysCount = 0;



            var daynumber = new Date(firstDay).getDay();


            var fullyear = newdate.getFullYear();
            var fullmonth = newdate.getMonth();

            $scope.selectedmonth = fullmonth;
            $scope.selectedyear = fullyear;


            var currentMonthFirstDate = getMonthFirstDate(firstDay);

            DateArray = getDates(currentMonthFirstDate, EndDate);
            $scope.MainTimerArray = [];
            $scope.TimerWeekArray = [];
            $scope.selectedCurrentWeek = 1;
            console.log(newdate);
            formTimerArray(DateArray, newdate);
        }
    }
    $scope.changeTimeSlotBranch = function (item) {
        item.BranchObj = item.BranchObj || "";
        if (item.BranchObj !== "") {
            item.BranchId = item.BranchObj.BranchId;
            item.BranchName = item.BranchObj.BranchName;
            item.UserBranchId = item.BranchObj.UserBranchId;
        }
    };
    $scope.changeUserslotType = function (type) {

        $scope.isCurrentPreviousMonth = true;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        var fullyear = date.getFullYear();
        var fullmonth = date.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;
        $scope.userSlotTypeId = type;
        $scope.getUserTimeSlots(firstDay, lastDay);

    }
    $scope.navtoPreviousMonthSlotsList = function (selectedmonth, selectedyear) {
        console.log(selectedmonth);
        console.log(selectedyear);
        console.log($scope.selectedDate);
        var past = moment($scope.selectedDate).subtract(1, 'month');


        var previousmonth = moment(past);
        console.log(previousmonth);
        var previousmonthDate = moment(previousmonth).format('YYYY/MM/DD');
        console.log(previousmonthDate);

        var newDate = new Date(previousmonthDate);

        console.log(newDate)

        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        $scope.selectedDate = selectedMonthStartDate;



        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }
        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        $scope.getUserTimeSlots(selectedMonthStartDate, selectedMonthEndDate);

    }
    $scope.navtoPreviousMonth = function (selectedmonth, selectedyear) {
        console.log(selectedmonth);
        console.log(selectedyear);
        console.log($scope.selectedDate);
        var past = moment($scope.selectedDate).subtract(1, 'month');


        var previousmonth = moment(past);
        console.log(previousmonth);
        var previousmonthDate = moment(previousmonth).format('YYYY/MM/DD');
        console.log(previousmonthDate);

        var newDate = new Date(previousmonthDate);

        console.log(newDate)

        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        $scope.selectedDate = selectedMonthStartDate;



        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }
        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);


        var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);


        DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
        $scope.MainTimerArray = [];
        $scope.TimerWeekArray = [];
        $scope.selectedCurrentWeek = 1;
        formTimerArray(DateArray, newDate);
    }
    $scope.changeYearMonthCalendar = function (selectedmonth, year) {

        var thisyear = new Date()
        var selectedYear = new Date(thisyear);




        var currentyear = thisyear.getFullYear();

        var yearDifference = year - currentyear;



        if (yearDifference === 0) {
            selectedYear.setYear(thisyear.getFullYear());
        } else {
            selectedYear.setYear(thisyear.getFullYear() + 1);
        }


        var thisMonth = new Date()

        var currentmonth = thisMonth.getMonth();


        var nextMonth = new Date(thisMonth);

        var monthdifference = selectedmonth - currentmonth;


        if (selectedmonth < currentmonth) {
            nextMonth.setMonth(thisMonth.getMonth() + monthdifference);
        } else if (selectedmonth > currentmonth) {
            nextMonth.setMonth(thisMonth.getMonth() + monthdifference);
        } else {
            nextMonth.setMonth(thisMonth.getMonth());
        }



        var selectedMonthStartDate = new Date(selectedYear.getFullYear(), nextMonth.getMonth(), 1);

        var selectedMonthEndDate = new Date(selectedYear.getFullYear(), nextMonth.getMonth() + 1, 0);



        var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);


        DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
        $scope.MainTimerArray = [];
        $scope.TimerWeekArray = [];
        $scope.selectedCurrentWeek = 1;
        formTimerArray(DateArray, nextMonth);
    };
    $scope.navtoNextMonth = function (selectedmonth, selectedyear) {
        console.log($scope.selectedDate);

        var next = moment($scope.selectedDate).add(1, 'month');
        console.log(next);

        var nextmonth = moment(next);
        console.log(nextmonth);

        var nextmonthDate = moment(nextmonth).format('YYYY/MM/DD');



        var newDate = new Date(nextmonthDate);






        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

        $scope.selectedDate = selectedMonthStartDate;


        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }

        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);


        var currentMonthFirstDate = getMonthFirstDate(selectedMonthStartDate);


        DateArray = getDates(currentMonthFirstDate, selectedMonthEndDate);
        $scope.MainTimerArray = [];
        $scope.TimerWeekArray = [];
        $scope.selectedCurrentWeek = 1;
        formTimerArray(DateArray, newDate);
    }
    $scope.navtoNextMonthSlotsList = function (selectedmonth, selectedyear) {
        console.log($scope.selectedDate);

        var next = moment($scope.selectedDate).add(1, 'month');
        console.log(next);

        var nextmonth = moment(next);
        console.log(nextmonth);

        var nextmonthDate = moment(nextmonth).format('YYYY/MM/DD');



        var newDate = new Date(nextmonthDate);






        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

        $scope.selectedDate = selectedMonthStartDate;


        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }

        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);


        $scope.getUserTimeSlots(selectedMonthStartDate, selectedMonthEndDate);
    }

    $scope.deleteParticularSlot = function (citem) {

        var slottypeid = parseFloat($scope.userSlotTypeId) || 1;
        var params = {
            "UserTimeSlotId": citem.UserTimeSlotId,
            "UserId": doctorinfo.doctorid,
            "SlotType": slottypeid
        }

        eHnoteMainAdminServices.deleteUserTimeSlots(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.status === "Success") {

                alertify.success("Deleted Successfully");


                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var fullyear = date.getFullYear();
                var fullmonth = date.getMonth();
                $scope.selectedmonth = fullmonth;
                $scope.selectedyear = fullyear;
                $scope.getUserTimeSlots(firstDay, lastDay);
            } else {
                $scope.userBranchSlotList = [];
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }
    $scope.selctWholeMonth = function (checkitem) {
        // var filteredArray = $filter("filter")(check, { "IsSelectedDate": false });
        //DateArray[i].Month = $filter('date')(new Date(selectedmonth), 'M');

        var filteredArray = $filter("filter")($scope.MainTimerArray, { 'IsSelectedMonth': true });
        if (checkitem === "Y") {
            angular.forEach(filteredArray, function (item) {
                if (item.IsSelectedMonth && !item.IsHoliday) {
                    item.IsSelectedDate = true;
                }
            });
            $scope.weekitems.checkitem1 = "Y";
            $scope.weekitems.checkitem2 = "Y";
            $scope.weekitems.checkitem3 = "Y";
            $scope.weekitems.checkitem4 = "Y";
            $scope.weekitems.checkitem5 = "Y";
            $scope.weekitems.checkitem6 = "Y";
        }
        if (checkitem === "N") {
            angular.forEach(filteredArray, function (item) {
                item.IsSelectedDate = false;
            });
            $scope.weekitems.checkitem1 = "N";
            $scope.weekitems.checkitem2 = "N";
            $scope.weekitems.checkitem3 = "N";
            $scope.weekitems.checkitem4 = "N";
            $scope.weekitems.checkitem5 = "N";
            $scope.weekitems.checkitem6 = "N";
        }
    };

    $scope.navtoPreviousMonthSlotsList = function (selectedmonth, selectedyear) {
        console.log(selectedmonth);
        console.log(selectedyear);
        console.log($scope.selectedDate);
        var past = moment($scope.selectedDate).subtract(1, 'month');


        var previousmonth = moment(past);
        console.log(previousmonth);
        var previousmonthDate = moment(previousmonth).format('YYYY/MM/DD');
        console.log(previousmonthDate);

        var newDate = new Date(previousmonthDate);

        console.log(newDate)

        var fullyear = newDate.getFullYear();
        var fullmonth = newDate.getMonth();

        $scope.selectedmonth = fullmonth;
        $scope.selectedyear = fullyear;


        var selectedMonthStartDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        $scope.selectedDate = selectedMonthStartDate;



        var currentDate = new Date();
        var currentfullyear = currentDate.getFullYear();
        var currentfullmonth = currentDate.getMonth();
        $scope.isCurrentPreviousMonth = false;
        if (currentfullyear === fullyear && currentfullmonth === fullmonth) {
            $scope.isCurrentPreviousMonth = true;
        }
        var selectedMonthEndDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        $scope.getUserTimeSlots(selectedMonthStartDate, selectedMonthEndDate);

    }

    $scope.changeWholeWeek = function (checkitem, weekid) {
        //var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');
        var check = $filter("filter")($scope.MainTimerArray, { "Week": weekid });
        if (checkitem === "Y") {

            angular.forEach(check, function (item) {
                if (item.IsSelectedMonth && !item.IsHoliday) {
                    item.IsSelectedDate = true;
                }
            });
        }
        if (checkitem === "N") {
            angular.forEach(check, function (item) {
                item.IsSelectedDate = false;
            });
        }
        var filteredArrayMonth = $filter("filter")($scope.MainTimerArray, { 'IsSelectedMonth': true, "IsSelectedDate": false });
        if (filteredArrayMonth.length === 0) {
            $scope.month.checkitem = "Y";
        } else {
            $scope.month.checkitem = "N";
        }
    };

    $scope.checkunselectitem = function (id) {
        //console.log(item);
        var check = $filter("filter")($scope.MainTimerArray, { "Week": id });

        var filteredArray = $filter("filter")(check, { "IsSelectedDate": false, 'IsSelectedMonth': true });

        if (filteredArray.length === 0) {

            if (id === 1) {
                $scope.weekitems.checkitem1 = "Y";
            }
            if (id === 2) {
                $scope.weekitems.checkitem2 = "Y";
            }
            if (id === 3) {
                $scope.weekitems.checkitem3 = "Y";
            }
            if (id === 4) {
                $scope.weekitems.checkitem4 = "Y";
            }
            if (id === 5) {
                $scope.weekitems.checkitem5 = "Y";
            }
            if (id === 6) {
                $scope.weekitems.checkitem6 = "Y";
            }

        } else {

            if (id === 1) {
                $scope.weekitems.checkitem1 = "N";
            }
            if (id === 2) {
                $scope.weekitems.checkitem2 = "N";
            }
            if (id === 3) {
                $scope.weekitems.checkitem3 = "N";
            }
            if (id === 4) {
                $scope.weekitems.checkitem4 = "N";
            }
            if (id === 5) {
                $scope.weekitems.checkitem5 = "N";
            }
            if (id === 6) {
                $scope.weekitems.checkitem6 = "N";
            }
        }
        var filteredArrayMonth = $filter("filter")($scope.MainTimerArray, { 'IsSelectedMonth': true, "IsSelectedDate": false });
        if (filteredArrayMonth.length === 0) {
            $scope.month.checkitem = "Y";
        } else {
            $scope.month.checkitem = "N";
        }

    }

    $scope.OnSelectLeave = function () {
        if ($scope.newUserTimeSlotObj.SlotTypeId === 2) {
            $scope.newUserTimeSlotObj.IsLeave = true;
        } else {
            $scope.newUserTimeSlotObj.IsLeave = false;
        }
    };

    function getStartTime() {
        $scope.startValues.length = 0;
        for (var i = 0; i < 24; i++) {
            if (i > 9) {
                $scope.startValues.push({ 'time': i });
            }
            else {
                $scope.startValues.push({ 'time': '0' + i });
            }
        }
        $scope.getEndTime(0);

    }

    $scope.getOTSlotEndTimesList = function (val) {

        $scope.TimeSlots.OTSlotEndValues = [];
        var val1 = 24;
        if ($scope.TimeSlots.OTSlotEndTime == '00' || $scope.TimeSlots.OTSlotEndTime == "") {
            val1 = 24;
        } else if ($scope.TimeSlots.OTSlotEndTime !== '00') {
            val1 = $scope.TimeSlots.OTSlotEndTime;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.OTSlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.OTSlotEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.OTSlotEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.OTSlotEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.OTSlotEndValues);

        if ($scope.TimeSlots.OTSlotEndValues.length > 0) {
            $scope.TimeSlots.OTSlotEndTime = $scope.TimeSlots.OTSlotStartTime.toString();


        } else {
            $scope.TimeSlots.OTSlotEndTime = '';
        }

    };
    $scope.getOpSlotEndTimesList = function (val) {

        $scope.TimeSlots.OpSlotEndValues = [];
        var val1 = 24;
        if ($scope.TimeSlots.OpSlotEndTime == '00' || $scope.TimeSlots.OpSlotEndTime == "") {
            val1 = 24;
        } else if ($scope.TimeSlots.OpSlotEndTime !== '00') {
            val1 = $scope.TimeSlots.OpSlotEndTime;
        }

        for (var i = parseInt(val); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.OpSlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.OpSlotEndValues.push({ 'time': '0' + i });
            }
        }
        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.OpSlotEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.OpSlotEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.OpSlotEndValues);

        if ($scope.TimeSlots.OpSlotEndValues.length > 0) {
            $scope.TimeSlots.OpSlotEndTime = $scope.TimeSlots.OpSlotStartTime.toString();
        } else {
            $scope.TimeSlots.OpSlotEndTime = '';
        }

    };




    $scope.getSlotEndTimesList = function (val) {


        $scope.TimeSlots.SlotEndValues = [];

        $scope.TimeSlots.OpSlotStartValues = [];

        for (var i = parseInt(val); i < 24; i++) {
            if (i > 9) {
                $scope.TimeSlots.SlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.SlotEndValues.push({ 'time': '0' + i });
            }
        }

        $scope.TimeSlots.SlotEndTime = "";




        if ($scope.TimeSlots.SlotEndTime !== '00' || $scope.TimeSlots.SlotEndTime !== "") {




            var val1 = 24;
            if ($scope.TimeSlots.SlotEndTime == '00' || $scope.TimeSlots.SlotEndTime == "") {
                val1 = 24;
            } else if ($scope.TimeSlots.SlotEndTime !== '00') {
                val1 = $scope.TimeSlots.SlotEndTime;
            }

            for (var i = parseInt($scope.TimeSlots.SlotStartTime); i <= parseInt(val1); i++) {
                if (i > 9) {
                    $scope.TimeSlots.OpSlotStartValues.push({ 'time': i });
                    $scope.TimeSlots.OTSlotStartValues.push({ 'time': i });
                }
                else {
                    $scope.TimeSlots.OpSlotStartValues.push({ 'time': '0' + i });
                    $scope.TimeSlots.OTSlotStartValues.push({ 'time': '0' + i });
                }
            };

            console.log($scope.TimeSlots.OpSlotStartValues);
            console.log($scope.TimeSlots.OTSlotStartValues);

            var tempTimeArray = [];
            angular.forEach($scope.TimeSlots.OpSlotStartValues, function (hitem) {
                angular.forEach($scope.consultationminituesvalue, function (mitem) {
                    tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
                });
            });

            $scope.TimeSlots.OpSlotStartValues = angular.copy(tempTimeArray);
            $scope.TimeSlots.OTSlotStartValues = angular.copy(tempTimeArray);

            console.log($scope.TimeSlots.OpSlotStartValues);
            console.log($scope.TimeSlots.OTSlotStartValues);

            $scope.newUserTimeSlotObj.SlotStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            $scope.newUserTimeSlotObj.SlotEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";


            $scope.newUserTimeSlotObj.OPStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            $scope.newUserTimeSlotObj.OPEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";

            if ($scope.TimeSlots.SlotEndTime === "") {
                $scope.newUserTimeSlotObj.OPEndTime = "";
            }

            $scope.newUserTimeSlotObj.OTStartTime = $scope.TimeSlots.SlotStartTime.toString() + ':' + "00";
            $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";
            if ($scope.TimeSlots.SlotEndTime === "") {
                $scope.newUserTimeSlotObj.OTEndTime = "";
            }

        }
        $scope.ChangeAllowOPOtSameSlots($scope.newUserTimeSlotObj);
    };

    $scope.changeEndSlotTimeList = function (obj) {
        //  $scope.getSlotEndTimesList();
        console.log(obj);
        console.log(obj.SlotEndTime);
        $scope.ChangeAllowOPOtSameSlots($scope.newUserTimeSlotObj);
        $scope.newUserTimeSlotObj.OPEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";
        $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";


    };
    $scope.ChangeAllowOPOtSameSlots = function (obj) {

        console.log(obj.IsNewFollowUpAscSameSlots);

        if (obj.IsNewFollowUpAscSameSlots) {

            //$scope.TimeSlots.OTSlotEndValues = [];
            //$scope.TimeSlots.OTSlotEndTime = [];
            //$scope.TimeSlots.OpSlotEndValues = [];
            //$scope.TimeSlots.OpSlotEndTime = [];
            $scope.getGeneralSlotStartTimesList(0);
            $scope.generalVisitSlotsArray = [];

        } else {
            $scope.getGeneralSlotStartTimesList(0);
            $scope.generalVisitSlotsArray = [];

        }
    };

    $scope.getGeneralSlotEndTimesList = function (val) {


        var starray = val.time.split(':');
        console.log(starray);

        var stTime = parseInt(starray[0]);


        $scope.TimeSlots.GeneralSlotEndValues = [];
        var val1 = 24;
        if ($scope.TimeSlots.SlotEndTime == '00' || $scope.TimeSlots.SlotEndTime == "") {
            val1 = 24;
        } else if ($scope.TimeSlots.SlotEndTime !== '00') {
            val1 = $scope.TimeSlots.SlotEndTime;
        }


        console.log(starray + "__" + val1);

        for (var i = parseInt(stTime); i < parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.GeneralSlotEndValues.push({ 'time': '0' + i });
            }
        };

        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.GeneralSlotEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.GeneralSlotEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.GeneralSlotEndValues);

        $scope.TimeSlots.GeneralEndTime = "";

    };
    $scope.changeGeneralSlotEndTimesList = function () {

    }


    $scope.addGeneralVisitSlotTypesTimes = function () {

        var counter = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (mitem) {
            if (mitem.VisitSlotTypeId == $scope.TimeSlots.GeneralSlotTypeId) {
                counter++;
            }
        });
        if (counter > 0) {
            alertify.error("Already Added");
            return false;
        }

        var counter1 = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (nitem) {
            if (nitem.StartTime == $scope.TimeSlots.GeneralStartTime || nitem.EndTime == $scope.TimeSlots.GeneralEndTime.time) {
                counter1++;
            }
        });
        if (counter1 > 0) {
            alertify.error("Already Added Time");
            return false;
        }


        if ($scope.TimeSlots.GeneralSlotTypeId == '') {
            alertify.error("Select Appointment");
            return false;
        }

        if ($scope.TimeSlots.GeneralStartTime.time == undefined) {
            alertify.error("Select Start Time");
            return false;
        }
        if ($scope.TimeSlots.GeneralEndTime.time == undefined) {
            alertify.error("Select End Time");
            return false;
        }
        if ($scope.TimeSlots.GeneralStartTime.time == $scope.TimeSlots.GeneralEndTime.time) {
            alertify.error("Please change End time");
            return false;
        }


        var Obj = {
            "VisitSlotTypeId": $scope.TimeSlots.GeneralSlotTypeId,
            "VisitSlotType": "",
            "StartTime": $scope.TimeSlots.GeneralStartTime.time,
            "EndTime": $scope.TimeSlots.GeneralEndTime.time,
            "IsSameSlotsForWalkinOnlineTele": false,
            "SpecificTimes": [],
            "Maxslots": $scope.TimeSlots.GeneralMaxSolts || ""
        }

        if (Obj.VisitSlotTypeId === 1) {
            Obj.VisitSlotType = "New";
        } else if (Obj.VisitSlotTypeId === 2) {
            Obj.VisitSlotType = "FollowUp";
        } else if (Obj.VisitSlotTypeId === 3) {
            Obj.VisitSlotType = "ASC";
        }

        $scope.generalVisitSlotsArray.push(Obj);


        $scope.TimeSlots.GeneralStartTime = "";
        $scope.TimeSlots.GeneralEndTime = "";
        $scope.TimeSlots.GeneralSlotTypeId = "";
        $scope.TimeSlots.GeneralMaxSolts = "";
        $scope.getGeneralSlotStartTimesList(0);




    };
    $scope.EditVisitSlotTime = function (vitem, index) {
        $scope.TimeSlots.GeneralSlotTypeId = vitem.VisitSlotTypeId;

        var starttimobj = $filter("filter")($scope.TimeSlots.GeneralSlotStartValues, { "time": vitem.StartTime }, true)[0];
        var endtimobj = $filter("filter")($scope.TimeSlots.GeneralSlotEndValues, { "time": vitem.EndTime }, true)[0];
        console.log(starttimobj);
        $scope.TimeSlots.GeneralStartTime = starttimobj;
        $scope.TimeSlots.GeneralEndTime = endtimobj;
        $scope.generalVisitSlotsArray.splice(index, 1);

    }
    $scope.DeleteVisitSlotTime = function (item, index) {
        $scope.generalVisitSlotsArray.splice(index, 1);

    };
    $scope.AddMOreSpecificTimeSlots = function (vitem, indexx) {


        angular.forEach($scope.generalVisitSlotsArray, function (item, ind) {
            if (indexx === ind) {
            } else {
                item.IsSameSlotsForWalkinOnlineTele = false;
            }

        });


        vitem.IsSameSlotsForWalkinOnlineTele = !vitem.IsSameSlotsForWalkinOnlineTele;

        if (vitem.IsSameSlotsForWalkinOnlineTele) {
            $scope.getWalkinOnlineGeneralSlotStartTimeList(vitem);
        } else {

        }
    };
    $scope.getGeneralVisitSlotEndTimesList = function (val, obj) {


        var starray = val.time.split(':');
        console.log(starray);

        var stTime = parseInt(starray[0]);


        $scope.TimeSlots.VisitTypeSubEndValues = [];



        var EndtimeArray = obj.EndTime.split(':');
        var EndtTime = parseInt(EndtimeArray[0]);

        var val1 = EndtTime;


        for (var i = parseInt(stTime); i <= parseInt(val1); i++) {
            if (i > 9) {
                $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': i });
            } else {
                $scope.TimeSlots.VisitTypeSubEndValues.push({ 'time': '0' + i });
            }
        };

        var tempTimeArray = [];
        angular.forEach($scope.TimeSlots.VisitTypeSubEndValues, function (hitem) {
            angular.forEach($scope.consultationminituesvalue, function (mitem) {
                tempTimeArray.push({ 'time': hitem.time + ':' + mitem.mins });
            });
        });

        $scope.TimeSlots.VisitTypeSubEndValues = angular.copy(tempTimeArray);

        console.log($scope.TimeSlots.VisitTypeSubEndValues);

        $scope.TimeSlots.GeneralEndTime = "";

    };
    $scope.changeGeneralVisitSlotEndTimesList = function () {

    }

    $scope.addGeneralVisitSlotSubTimes = function (mainobj) {

        var count = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (xitem) {
            if (xitem.VisitSlotTypeId == mainobj.VisitSlotTypeId) {
                if (xitem.SpecificTimes.length > 0) {
                    angular.forEach(xitem.SpecificTimes, function (yitem) {
                        if (yitem.VisitSlotSubTypeId == $scope.TimeSlots.VisitSlotSubTypeId) {
                            count++;
                        }
                    });
                }
            }


        });
        if (count > 0) {
            alertify.error("Already Added");
            return false;
        }


        var coun = 0;
        angular.forEach($scope.generalVisitSlotsArray, function (pitem) {
            if (pitem.VisitSlotTypeId == mainobj.VisitSlotTypeId) {
                if (pitem.SpecificTimes.length > 0) {
                    angular.forEach(pitem.SpecificTimes, function (qitem) {
                        if (qitem.StartTime == $scope.TimeSlots.VisitTypeStartTime.time || qitem.EndTime == $scope.TimeSlots.VisitTypeEndTime.time) {
                            coun++;
                        }
                    });
                }

            }
        });
        if (coun > 0) {
            alertify.error("Already Added Time");
            return false;
        }

        if ($scope.TimeSlots.VisitSlotSubTypeId == '') {
            alertify.error("Select Visit");
            return false;
        }
        if ($scope.TimeSlots.VisitTypeStartTime.time == undefined) {
            alertify.error("Select Start Time");
            return false;
        }
        if ($scope.TimeSlots.VisitTypeEndTime.time == undefined) {
            alertify.error("Select End Time");
            return false;
        }

        if ($scope.TimeSlots.VisitTypeStartTime.time == $scope.TimeSlots.VisitTypeEndTime.time) {
            alertify.error("Please change End time");
            return false;
        }

        var Obj = {
            "VisitSlotSubTypeId": $scope.TimeSlots.VisitSlotSubTypeId,
            "VisitSlotSubType": "",
            "StartTime": $scope.TimeSlots.VisitTypeStartTime.time,
            "EndTime": $scope.TimeSlots.VisitTypeEndTime.time,
            "IsSameSlotsForWalkinOnlineTele": false,
            "SpecificTimes": [],
        }

        if (Obj.VisitSlotSubTypeId === 1) {
            Obj.VisitSlotSubType = "WalkIn";
        } else if (Obj.VisitSlotSubTypeId === 2) {
            Obj.VisitSlotSubType = "Online";
        } else if (Obj.VisitSlotSubTypeId === 3) {
            Obj.VisitSlotSubType = "Tele";
        }

        mainobj.SpecificTimes.push(Obj);


        $scope.TimeSlots.VisitTypeStartTime = "";
        $scope.TimeSlots.VisitTypeEndTime = "";
        $scope.TimeSlots.VisitSlotSubTypeId = "";
        mainobj.IsSameSlotsForWalkinOnlineTele = false;

        $scope.getWalkinOnlineGeneralSlotStartTimeList(mainobj);
    };

    $scope.EditVisitSlotSubTime = function (vitem, sitem, index) {
        vitem.IsSameSlotsForWalkinOnlineTele = !vitem.IsSameSlotsForWalkinOnlineTele;
        if (vitem.IsSameSlotsForWalkinOnlineTele) {
            $scope.getWalkinOnlineGeneralSlotStartTimeList(vitem);
            $scope.TimeSlots.VisitSlotSubTypeId = sitem.VisitSlotSubTypeId;
            var starttimobj1 = $filter("filter")($scope.TimeSlots.VisitTypeSubStartValues, { "time": sitem.StartTime }, true)[0];
            var endtimobj1 = $filter("filter")($scope.TimeSlots.VisitTypeSubEndValues, { "time": sitem.EndTime }, true)[0];
            $scope.TimeSlots.VisitTypeStartTime = starttimobj1;
            $scope.TimeSlots.VisitTypeEndTime = endtimobj1;
            angular.forEach($scope.generalVisitSlotsArray, function (pitem) {
                pitem.SpecificTimes.splice(index, 1);
            });
        }
    }
    $scope.DeleteVisitSlotSubTime = function (mainobj, index) {
        mainobj.SpecificTimes.splice(index, 1);
    };
    $scope.clearNewUserBranchTime = function () {

        $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();

        $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();


        $scope.TimeSlots = getNewTimeSlotsEmptyObj();
        $scope.getSlotTimesList();
        $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];

        $scope.generalVisitSlotsArray = [];
    };



    $scope.SaveUserBranchCurrentSLot = function () {

        var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });


        if (selectedDatesArray.length === 0) {
            alertify.error("Select Dates");
            return false;
        }

        if ($scope.newUserTimeSlotObj.BranchId === "" || $scope.newUserTimeSlotObj.BranchId === 0) {
            alertify.error("Please Select Branch");
            return false;
        }

        $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];



        $scope.newUserTimeSlotObj.SlotStartTime = $scope.TimeSlots.SlotStartTime;
        $scope.newUserTimeSlotObj.SlotEndTime = $scope.TimeSlots.SlotEndTime;

        if ($scope.newUserTimeSlotObj.IsNewFollowUpAscSameSlots) {
            $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";
            //    $scope.newUserTimeSlotObj.OTEndTime = $scope.TimeSlots.SlotEndTime.toString() + ':' + "00";

        } else {
            if ($scope.generalVisitSlotsArray.length > 0) {
                var NewApptTimeSLotsArray = $filter("filter")($scope.generalVisitSlotsArray, { "VisitSlotTypeId": 1 }, true);
                if (NewApptTimeSLotsArray.length > 0) {
                    $scope.newUserTimeSlotObj.NewAppointmentStartTime = NewApptTimeSLotsArray[0].StartTime;
                    $scope.newUserTimeSlotObj.NewAppointmentEndTime = NewApptTimeSLotsArray[0].EndTime;
                    $scope.newUserTimeSlotObj.NewAppointmentMaxSlots = NewApptTimeSLotsArray[0].Maxslots || 0;
                    if (NewApptTimeSLotsArray[0].SpecificTimes.length > 0) {

                        $scope.newUserTimeSlotObj.IsNewAppointmentWalkinOnlineTeleSameSlots = false;

                        var NewApptWalkinTimeSLotsArray = $filter("filter")(NewApptTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 1 }, true);
                        if (NewApptWalkinTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.NewAppointmentWalkinStartTime = NewApptWalkinTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.NewAppointmentWalkinEndTime = NewApptWalkinTimeSLotsArray[0].EndTime;
                        }

                        var NewApptOnlineTimeSLotsArray = $filter("filter")(NewApptTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 2 }, true);
                        if (NewApptOnlineTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime = NewApptOnlineTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.NewAppointmentOnlineEndTIme = NewApptOnlineTimeSLotsArray[0].EndTime;
                        }

                        var NewApptTeleTimeSLotsArray = $filter("filter")(NewApptTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 3 }, true);
                        if (NewApptTeleTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.NewAppointmentTeleStartTime = NewApptTeleTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.NewAppointmentTeleEndTIme = NewApptTeleTimeSLotsArray[0].EndTime;
                        }

                    }
                }

                var FollowUpTimeSLotsArray = $filter("filter")($scope.generalVisitSlotsArray, { "VisitSlotTypeId": 2 }, true);
                if (FollowUpTimeSLotsArray.length > 0) {
                    $scope.newUserTimeSlotObj.FollowUpAppointmentStartTime = FollowUpTimeSLotsArray[0].StartTime;
                    $scope.newUserTimeSlotObj.FollowUpAppointmentEndTime = FollowUpTimeSLotsArray[0].EndTime;
                    $scope.newUserTimeSlotObj.FollowUpAppointmentMaxSlots = FollowUpTimeSLotsArray[0].Maxslots || 0;
                    if (FollowUpTimeSLotsArray[0].SpecificTimes.length > 0) {


                        $scope.newUserTimeSlotObj.IsFollowUpWalkinOnlineSameSlots = false;

                        var FollowUpWalkinTimeSLotsArray = $filter("filter")(FollowUpTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 1 }, true);
                        if (FollowUpWalkinTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.FollowUpWalkinStartTime = FollowUpWalkinTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.FollowUpWalkinEndTime = FollowUpWalkinTimeSLotsArray[0].EndTime;
                        }


                        var FollowUpOnlineTimeSLotsArray = $filter("filter")(FollowUpTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 2 }, true);
                        if (FollowUpOnlineTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.FollowUpOnlineStartTime = FollowUpOnlineTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.FollowUpOnlineEndTime = FollowUpOnlineTimeSLotsArray[0].EndTime;
                        }

                        var FollowUpTeleTimeSLotsArray = $filter("filter")(FollowUpTimeSLotsArray[0].SpecificTimes, { "VisitSlotSubTypeId": 3 }, true);
                        if (FollowUpTeleTimeSLotsArray.length > 0) {
                            $scope.newUserTimeSlotObj.FollowUpTeleStartTime = FollowUpTeleTimeSLotsArray[0].StartTime;
                            $scope.newUserTimeSlotObj.FollowUpTeleEndTime = FollowUpTeleTimeSLotsArray[0].EndTime;
                        }

                    }
                }


                var ASCTimeSLotsArray = $filter("filter")($scope.generalVisitSlotsArray, { "VisitSlotTypeId": 3 }, true);
                if (ASCTimeSLotsArray.length > 0) {
                    $scope.newUserTimeSlotObj.OTStartTime = ASCTimeSLotsArray[0].StartTime;
                    $scope.newUserTimeSlotObj.OTEndTime = ASCTimeSLotsArray[0].EndTime;
                    $scope.newUserTimeSlotObj.OTAppointmentMaxSlots = ASCTimeSLotsArray[0].Maxslots || 0;
                } else {
                    $scope.newUserTimeSlotObj.OTStartTime = "00:00";
                    $scope.newUserTimeSlotObj.OTEndTime = "00:00";
                }
            }
        }


        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            $scope.newUserTimeSlotObj.SlotDate = sitem.FullDate;
            $scope.newUserTimeSlotAddReqObj.BranchId = $scope.newUserTimeSlotObj.BranchId;
            $scope.newUserTimeSlotAddReqObj.DoctorId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserTimeSlotAddReqObj.UserBranchId = $scope.newUserTimeSlotObj.UserBranchId;


            var obj = {
                "BranchObj": "",
                "BranchId": $scope.newUserTimeSlotAddReqObj.BranchId,
                "UserBranchId": $scope.newUserTimeSlotAddReqObj.UserBranchId,
                "UserTimeSlotId": 0,
                "SlotDate": sitem.FullDate,
                "SlotStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "SlotEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "SlotTypeId": $scope.newUserTimeSlotObj.SlotTypeId,
                "IsOpOTSameSlots": $scope.newUserTimeSlotObj.IsOpOTSameSlots,
                "OPStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "OPEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "OTStartTime": $scope.newUserTimeSlotObj.OTStartTime,
                "OTEndTime": $scope.newUserTimeSlotObj.OTEndTime,
                "IsNewFollowUpAscSameSlots": $scope.newUserTimeSlotObj.IsNewFollowUpAscSameSlots,
                "NewAppointmentStartTime": $scope.newUserTimeSlotObj.NewAppointmentStartTime,
                "NewAppointmentEndTime": $scope.newUserTimeSlotObj.NewAppointmentEndTime,
                "FollowUpAppointmentStartTime": $scope.newUserTimeSlotObj.FollowUpAppointmentStartTime,
                "FollowUpAppointmentEndTime": $scope.newUserTimeSlotObj.FollowUpAppointmentEndTime,
                "IsNewAppointmentWalkinOnlineTeleSameSlots": $scope.newUserTimeSlotObj.IsNewAppointmentWalkinOnlineTeleSameSlots,
                "NewAppointmentWalkinStartTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinStartTime,
                "NewAppointmentWalkinEndTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinEndTime,
                "NewAppointmentOnlineStartTime": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentOnlineEndTIme": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentTeleStartTime": $scope.newUserTimeSlotObj.NewAppointmentTeleStartTime,
                "NewAppointmentTeleEndTIme": $scope.newUserTimeSlotObj.NewAppointmentTeleEndTIme,
                "IsFollowUpWalkinOnlineSameSlots": $scope.newUserTimeSlotObj.IsFollowUpWalkinOnlineSameSlots,
                "FollowUpWalkinStartTime": $scope.newUserTimeSlotObj.FollowUpWalkinStartTime,
                "FollowUpWalkinEndTime": $scope.newUserTimeSlotObj.FollowUpWalkinEndTime,
                "FollowUpOnlineStartTime": $scope.newUserTimeSlotObj.FollowUpOnlineStartTime,
                "FollowUpOnlineEndTime": $scope.newUserTimeSlotObj.FollowUpOnlineEndTime,
                "FollowUpTeleStartTime": $scope.newUserTimeSlotObj.FollowUpTeleStartTime,
                "FollowUpTeleEndTime": $scope.newUserTimeSlotObj.FollowUpTeleEndTime,
                "NewAppointmentMaxSlots": parseInt($scope.newUserTimeSlotObj.NewAppointmentMaxSlots) || 0,
                "FollowUpAppointmentMaxSlots": parseInt($scope.newUserTimeSlotObj.FollowUpAppointmentMaxSlots) || 0,
                "OTAppointmentMaxSlots": parseInt($scope.newUserTimeSlotObj.OTAppointmentMaxSlots) || 0,
                "IsLeave": $scope.newUserTimeSlotObj.IsLeave,
                "LeaveRemarks": $scope.newUserTimeSlotObj.LeaveRemarks
            }

            $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray.push(obj);
        });





        if ($scope.newUserTimeSlotObj.IsLeave) {
            if ($scope.newUserTimeSlotObj.LeaveRemarks === "") {
                alertify.error("Please Enter Leave Remarks");
                return false;
            }

            $scope.newUserTimeSlotObj.SlotStartTime = "00";
            $scope.newUserTimeSlotObj.SlotEndTime = "00";

        } else {

            if ($scope.newUserTimeSlotObj.SlotStartTime === "" && $scope.newUserTimeSlotObj.SlotEndTime === "") {
                alertify.error("Please select a time slot!");
                return;
            };


            

            if ($scope.newUserTimeSlotObj.SlotStartTime === $scope.newUserTimeSlotObj.SlotEndTime) {
                alertify.error("Please Choose Valid End Time");
                return false;
            }
        }

        //$scope.newUserTimeSlotObj.SlotStartTime = $scope.newUserTimeSlotObj.SlotStartTime || "";
        //$scope.newUserTimeSlotObj.SlotEndTime = $scope.newUserTimeSlotObj.SlotEndTime || "";

        var params = {
            "UserId": $scope.MainUserObj.BasicInfo.UserId,
            "BranchId": $scope.newUserTimeSlotObj.BranchId,
            "TimeSlotsArray": [],
            "TempTimeSlots": $scope.tempTimeSlotsArray || []
        };

        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            var obj = {
                "Date": sitem.FullDate,
                "StartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "EndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "SlotTypeId": 1
            };
            params.TimeSlotsArray.push(obj);
        });


        var timeslotduplicate = CompareDuplpicatesolts(params);
        if (timeslotduplicate === true) {
            alertify.error("Duplicate Slots");
            return false;
        }




        // console.log(JSON.stringify($scope.newUserTimeSlotAddReqObj));


        eHnoteMainAdminServices.checkIsUserSlotAvail(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
        function callbackgetuserbranchSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.isUserSlotAvailable) {

                $scope.continuetoSaveCurrentSLot($scope.newUserTimeSlotAddReqObj);


            } else {

                alertify.error(resp.Message);
            }

        }
        function callbackgetuserbranchError(err) {
            alertify.error("Some Error Occured");
        }







    }


    $scope.continuetoSaveCurrentSLot = function (params) {






        eHnoteMainAdminServices.addUpdateUserBranchTimeSlotsNew(params, callbackuserbranchSuccess, ccallbackuserbranchError);
        function callbackuserbranchSuccess(resp) {
            console.log(resp);
            if (resp.status === "Success") {
                if ($scope.newUserTimeSlotObj.IsLeave) {
                    alertify.success("Leave Added Successfully");
                } else {
                    alertify.success("Time Slots Added Successfully");
                }


                $scope.newUserTimeSlotObj = getuserBranchTimeSLotemptyObj();

                $scope.newUserTimeSlotAddReqObj = getnewUserbanchEntireTimeSLotObj();


                $scope.TimeSlots = getNewTimeSlotsEmptyObj();
                $scope.getSlotTimesList();
                $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray = [];

                $scope.generalVisitSlotsArray = [];

                angular.forEach($scope.MainTimerArray, function (aitem) {
                    aitem.IsSelectedDate = false;
                });
                $scope.weekitems.checkitem1 = "N";
                $scope.weekitems.checkitem2 = "N";
                $scope.weekitems.checkitem3 = "N";
                $scope.weekitems.checkitem4 = "N";
                $scope.weekitems.checkitem5 = "N";
                $scope.weekitems.checkitem6 = "N";
                $scope.month.checkitem = "N";

                $scope.startTimeHH.start = "00";
                $scope.startTimeHH.end = "00";
                $scope.endTimeHH.start = "00";
                $scope.endTimeMM.end = "00";


                $scope.tempTimeSlotsArray = [];
                $scope.mainTimeslotArray = [];

                $scope.showAddTimeSlotDev = true;



                var newdate = new Date();
                $scope.isCurrentPreviousMonth = true;
                var currentSelectedmonth = $filter('date')(new Date(newdate), 'M');

                var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
                var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);




                $scope.selectedDate = firstDay;


                var startDate = firstDay;
                var EndDate = lastDay;
                var DateArray = [];

                var ExtraDaysCount = 0;



                var daynumber = new Date(firstDay).getDay();




                var fullyear = newdate.getFullYear();
                var fullmonth = newdate.getMonth();

                $scope.selectedmonth = fullmonth;
                $scope.selectedyear = fullyear;



                var currentMonthFirstDate = getMonthFirstDate(firstDay);

                DateArray = getDates(currentMonthFirstDate, EndDate);
                $scope.MainTimerArray = [];
                $scope.TimerWeekArray = [];
                $scope.selectedCurrentWeek = 1;
                console.log(newdate);
                formTimerArray(DateArray, newdate);
            }


        }
        function ccallbackuserbranchError(err) {
            alertify.error("Some Error Occured");
        }
    }

    function CompareDuplpicatesolts(paramobj) {
        var timesoltarray = angular.copy(paramobj.TimeSlotsArray) || [];
        var temptimesoltarray = angular.copy($scope.tempTimeSlotsArray) || [];
        var timeslotduplicate = false;
        if (temptimesoltarray.length > 0) {
            angular.forEach(timesoltarray, function (titem1) {
                titem1.tempstarttime = titem1.StartTime.replace(":", "");
                titem1.tempendtime = titem1.EndTime.replace(":", "");

                if (!timeslotduplicate) {
                    angular.forEach(temptimesoltarray, function (titem2, index) {
                        angular.forEach(titem2.SelectedDatesArray, function (titem3) {

                            if (titem1.Date === titem3.Date) {
                                titem2.tempstarttime = titem2.StartTime.replace(":", "");
                                titem2.tempendtime = titem2.EndTime.replace(":", "");

                                if ((parseInt(titem2.tempstarttime) <= parseInt(titem1.tempstarttime)) && (parseInt(titem1.tempstarttime) <= parseInt(titem2.tempendtime))) {
                                    timeslotduplicate = true;
                                    return false;
                                }
                                if ((parseInt(titem2.tempstarttime) <= parseInt(titem1.tempendtime)) && (parseInt(titem1.tempendtime) <= parseInt(titem2.tempendtime))) {
                                    timeslotduplicate = true;
                                    return false;
                                }

                            }

                        });
                    });
                }

                //if (timeslotduplicate === true) {
                //    return false;
                //}
            });
        }

        return timeslotduplicate;

    }
    $scope.ConsultationTypes = [
        {
            "Name": "Physical Consultation",
            "Id": 1
        },
        {
            "Name": "Tele Consultation",
            "Id": 2
        }
    ];
    $scope.SaveLeaveUserbaranch = function () {

        var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });

        if (selectedDatesArray.length === 0) {
            alertify.error("Select Dates");
            return false;
        }
        if ($scope.newUserTimeSlotObj.BranchId === "" || $scope.newUserTimeSlotObj.BranchId === 0) {
            alertify.error("Please Select Branch");
            return false;
        }

        if ($scope.newUserTimeSlotObj.LeaveRemarks === "") {
            alertify.error("Please Enter Leave Remarks");
            return false;
        }

        if ($scope.newUserTimeSlotObj.IsLeave) {

            $scope.newUserTimeSlotObj.SlotStartTime = "00";
            $scope.newUserTimeSlotObj.SlotEndTime = "00";
            $scope.newUserTimeSlotObj.OTStartTime = "";
            $scope.newUserTimeSlotObj.OTEndTime = "";
        }

        angular.forEach(selectedDatesArray, function (sitem) {
            console.log(sitem.FullDate);
            $scope.newUserTimeSlotObj.SlotDate = sitem.FullDate;
            $scope.newUserTimeSlotAddReqObj.BranchId = $scope.newUserTimeSlotObj.BranchId;
            $scope.newUserTimeSlotAddReqObj.DoctorId = $scope.MainUserObj.BasicInfo.UserId;
            $scope.newUserTimeSlotAddReqObj.UserBranchId = $scope.newUserTimeSlotObj.UserBranchId;


            var obj = {
                "BranchObj": "",
                "BranchId": $scope.newUserTimeSlotAddReqObj.BranchId,
                "UserBranchId": $scope.newUserTimeSlotAddReqObj.UserBranchId,
                "UserTimeSlotId": 0,
                "SlotDate": sitem.FullDate,
                "SlotStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "SlotEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "SlotTypeId": $scope.newUserTimeSlotObj.SlotTypeId,
                "IsOpOTSameSlots": $scope.newUserTimeSlotObj.IsOpOTSameSlots,
                "OPStartTime": $scope.newUserTimeSlotObj.SlotStartTime.toString() + ':' + "00",
                "OPEndTime": $scope.newUserTimeSlotObj.SlotEndTime.toString() + ':' + "00",
                "OTStartTime": $scope.newUserTimeSlotObj.OTStartTime,
                "OTEndTime": $scope.newUserTimeSlotObj.OTEndTime,
                "IsNewFollowUpAscSameSlots": $scope.newUserTimeSlotObj.IsNewFollowUpAscSameSlots,
                "NewAppointmentStartTime": $scope.newUserTimeSlotObj.NewAppointmentStartTime,
                "NewAppointmentEndTime": $scope.newUserTimeSlotObj.NewAppointmentEndTime,
                "FollowUpAppointmentStartTime": $scope.newUserTimeSlotObj.FollowUpAppointmentStartTime,
                "FollowUpAppointmentEndTime": $scope.newUserTimeSlotObj.FollowUpAppointmentEndTime,
                "IsNewAppointmentWalkinOnlineTeleSameSlots": $scope.newUserTimeSlotObj.IsNewAppointmentWalkinOnlineTeleSameSlots,
                "NewAppointmentWalkinStartTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinStartTime,
                "NewAppointmentWalkinEndTime": $scope.newUserTimeSlotObj.NewAppointmentWalkinEndTime,
                "NewAppointmentOnlineStartTime": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentOnlineEndTIme": $scope.newUserTimeSlotObj.NewAppointmentOnlineStartTime,
                "NewAppointmentTeleStartTime": $scope.newUserTimeSlotObj.NewAppointmentTeleStartTime,
                "NewAppointmentTeleEndTIme": $scope.newUserTimeSlotObj.NewAppointmentTeleEndTIme,
                "IsFollowUpWalkinOnlineSameSlots": $scope.newUserTimeSlotObj.IsFollowUpWalkinOnlineSameSlots,
                "FollowUpWalkinStartTime": $scope.newUserTimeSlotObj.FollowUpWalkinStartTime,
                "FollowUpWalkinEndTime": $scope.newUserTimeSlotObj.FollowUpWalkinEndTime,
                "FollowUpOnlineStartTime": $scope.newUserTimeSlotObj.FollowUpOnlineStartTime,
                "FollowUpOnlineEndTime": $scope.newUserTimeSlotObj.FollowUpOnlineEndTime,
                "FollowUpTeleStartTime": $scope.newUserTimeSlotObj.FollowUpTeleStartTime,
                "FollowUpTeleEndTime": $scope.newUserTimeSlotObj.FollowUpTeleEndTime,
                "IsLeave": $scope.newUserTimeSlotObj.IsLeave,
                "LeaveRemarks": $scope.newUserTimeSlotObj.LeaveRemarks
            }

            $scope.newUserTimeSlotAddReqObj.UserBranchSlotsArray.push(obj);
        });

        $scope.continuetoSaveCurrentSLot($scope.newUserTimeSlotAddReqObj);

        
    }

    $scope.ChangeSignOffPWDInd = function (form, obj, logininfo) {
        logininfo.SignOffPWDInd = obj;
        if (logininfo.SignOffPWDInd == false) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Cancel the SignOff Required Password? </h4>", function () {
                logininfo.SignOffPassword = "";

                $scope.Update(form, logininfo, 2)

            }, function () {
                return;
            });
        }
    }

    $scope.SubmitSignOffPassword = function (form, obj, logininfo) {
        logininfo.SignOffPWDInd = obj.SignOffPWDInd;
        logininfo.SignOffPassword = obj.SignOffPassword;

        if (logininfo.SignOffPWDInd === true) {
            logininfo.SignOffPassword = logininfo.SignOffPassword || "";
            if (logininfo.SignOffPassword == "") {
                alertify.error("Please Enter Valid SignOff Password");
                return false;
            }
        }
        $scope.Update(form, logininfo, 2)
    }

    $scope.ChangeUsFormate = function (phoneNumberString,type) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.logininfo.MobileNumber = part1 + part2 + part3;
            $scope.logininfo.MobileNo = $scope.logininfo.MobileNumber;
            if (type === "edit") {
                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.logininfo.PhAreaCD = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.logininfo.UserMobileNo = contact;
                    $scope.logininfo.UserMobileNumber =
                        ($scope.logininfo.PhCntryCD || "") + ($scope.USnumberString || "");
                }
            }
        }
    }
    $scope.ChangeUsFormate(logininfo.MobileNumber);
    //Connect User Changes
    $scope.ChangeShowContent = function (sitem) {
        sitem.ContentShow = !sitem.ContentShow;
    };
    $scope.connectSchedules = function (sid, docid, Mainitem) {

        var sScheduleId = sid || 0;
        var connecteddocid = docid || 0
        var mainobj = {
            "MainUserObj": $scope.MainUserObj,
            "UserId": doctorinfo.doctorid,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "SlotsArray": $scope.UserScheduleSlotsArray,
            "UserScheduleId": sScheduleId || 0,
            "ConnectedUserId": connecteddocid,
            "allUsersList": [],
            "DoctorId": Mainitem.DoctorId
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/connectSchedulePopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "appointment-full-popup",
            "resolve": {
                "mainitem": function () {
                    return mainobj;
                }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, mainitem) {

                console.log(mainitem);

                console.log(mainitem.ConnectedUserId);

                $scope.AllUsersList = mainobj.allUsersList;

                $scope.slotsArray = mainitem.SlotsArray || [];
                $scope.Type = "Duration";
                $scope.ScheduleEveryType = "";
                $scope.ScheduledDateArray = [];
                $scope.SearchWeekobj = {
                    "txt": "",
                    "selecteditem": "Select"
                };

                $scope.disableScheduleSelection = false;
                $scope.connectedUsersObj = {
                    "isAvailable": false,
                    "UsersList": []
                }

                $scope.SelectedMonthobj = {
                    "Selecteditem": "Select"
                }
                $scope.RepeatMonth = [{
                    "Id": 10,
                    "Name": "Every Month 1st",
                    "isChecked": false,
                    "Active": "Y"
                }, {
                    "Id": 11,
                    "Name": "Every Month 2nd",
                    "isChecked": false,
                    "Active": "Y"
                }, {
                    "Id": 12,
                    "Name": "Every Month 3rd",
                    "isChecked": false,
                    "Active": "Y"
                }, {
                    "Id": 13,
                    "Name": "Every Month 4th",
                    "isChecked": false,
                    "Active": "Y"
                }, {
                        "Id": 15,
                        "Name": "Every Month 5th",
                        "isChecked": false,
                        "Active": "Y"
                },{
                    "Id": 14,
                    "Name": "Every Month last",
                    "isChecked": false,
                    "Active": "Y"
                }
                ];


                function getnewAddUpdateScheduleObj() {
                    var obj = {
                        "UserId": mainitem.UserId,
                        "BranchId": mainitem.BranchId,
                        "DoctorId": mainitem.DoctorId,
                        "Type": "Duration",
                        "ScheduleDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                        "FromDate": null,
                        "ToDate": null,
                        "ScheduleDuration": "",
                        "ScheduleDurationType": "M",
                        "UserScheduleId": 0,
                        "ConnectedUserObj": "",
                        "UserScheduleObj": "",
                        "UserScheduleName": "",
                        "showDaySelection": false,
                        "ScheduleMonthEveryType": "",
                        "UserScheduleDetails": [],
                        "UserDaySlots": [],
                        "ScheduleMonthorWeekType": 1,
                        "ScheduleMonthMultiEveryType": "",
                        "IsAlternateDaysSelected": false
                    }

                    return obj;
                }

                $scope.addUpdateScheduleObj = getnewAddUpdateScheduleObj();


                if (mainitem.UserScheduleId !== 0) {

                    var selectedScheduledArray = $filter("filter")($scope.slotsArray, { "UserScheduleId": mainitem.UserScheduleId });
                    if (selectedScheduledArray.length > 0) {
                        $scope.addUpdateScheduleObj.UserScheduleObj = selectedScheduledArray[0];
                        $scope.addUpdateScheduleObj.UserScheduleId = selectedScheduledArray[0].UserScheduleId;
                        $scope.addUpdateScheduleObj.UserScheduleName = selectedScheduledArray[0].UserScheduleName;
                        $scope.addUpdateScheduleObj.UserScheduleDetails = selectedScheduledArray[0].UserScheduleDetails;
                        $scope.disableScheduleSelection = true;
                    }

                }


                if (mainitem.ConnectedUserId !== 0) {
                    if ($scope.AllUsersList.length > 0) {
                        var selectedDocListArray = $filter("filter")($scope.AllUsersList, { "UserId": mainitem.ConnectedUserId }, true);
                        if (selectedDocListArray.length > 0) {
                            var connectedUsersList = selectedDocListArray[0].ConnectedUsers || [];
                            if (connectedUsersList.length > 0) {
                                angular.forEach(connectedUsersList, function (mitem) {
                                    if (mitem.BranchId === mainitem.BranchId) {
                                        var selectedDocListArray = $filter("filter")($scope.AllUsersList, { "UserId": mitem.ChildUserId }, true);
                                        if (selectedDocListArray.length > 0) {
                                            var Obj = {
                                                "UserId": selectedDocListArray[0].UserId,
                                                "UserName": selectedDocListArray[0].FullName
                                            }
                                            $scope.connectedUsersObj.UsersList.push(Obj);
                                            $scope.connectedUsersObj.isAvailable = true;
                                            $scope.slotsArray = [];
                                            $scope.addUpdateScheduleObj.DoctorId = 0;
                                        }
                                    }

                                });
                            }
                        }
                    }
                }
                $scope.changeUserScheduleObj = function (obj) {
                    console.log(obj);
                    $scope.addUpdateScheduleObj.UserScheduleId = obj.UserScheduleId;
                    $scope.addUpdateScheduleObj.UserScheduleName = obj.UserScheduleName;
                    $scope.addUpdateScheduleObj.UserScheduleDetails = obj.UserScheduleDetails;
                };

                $scope.changeMonthEveryType = function (obj) {
                    console.log(obj);
                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                };


                $scope.daysofweek = [{
                    "WeekId": 1,
                    "WeekDay": "Monday",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 2,
                    "WeekDay": "Tuesday",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 3,
                    "WeekDay": "Wednesday",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 4,
                    "WeekDay": "Thursday",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 5,
                    "WeekDay": "Friday",
                    "isChecked": false,
                    "Active": "Y"
                },
                {
                    "WeekId": 6,
                    "WeekDay": "Saturday",
                    "isChecked": false,
                    "Active": "Y"
                }];

                if ($scope.addUpdateScheduleObj.UserScheduleObj != "") {
                    var uniqDayslist = _.uniq($scope.addUpdateScheduleObj.UserScheduleObj.UserScheduleDetails, false, function (p) { return p.Day; });
                    if (uniqDayslist.length > 0) {
                        angular.forEach($scope.daysofweek, function (item) {
                            item.Active = "N";
                        });

                        angular.forEach(uniqDayslist, function (ditem) {
                            var tempArray = $filter('filter')($scope.daysofweek, { 'WeekId': ditem.DayId }, true);
                            if (tempArray.length > 0) {
                                tempArray[0].Active = "Y";
                            }
                        });
                    }
                }

                function getAlternateDatesByDayWise(dayid, selectedstartdate) {

                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    var currentDate = new Date(selectedstartdate);
                    var month = currentDate.getMonth();
                    var weekdayCount = 0;
                    for (var i = 0; i <= emonths; i++) {    
                        console.log(currentDate.getMonth() + "__" + month);
                        while (currentDate.getMonth() === month) {
                            if (currentDate.getDay() === dayid) {
                                weekdayCount++;
                                if (weekdayCount % 2 === 1) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }  
                                    selecteddates.push(obj);
                                }
                            }

                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                        month++;
                        //after 12 months increasing 1 year
                        if (month > 11) {
                            month = 0;
                            currentDate.setFullYear(currentDate.getFullYear());
                        }
                    }
                    return selecteddates;
                }

                function getDatesByDayWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;
                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        for (var day = 1; day <= 7; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                var dayno = daysOfWeek[currentDate.getDay()];
                                var weekno = getWeekOfMonth(currentDate);
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": dayno,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                selecteddates.push(obj);
                                break;
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }
                function getDatesBysecondweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 2) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                    break;
                                }
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }
                function getDatesByThirdweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 3) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                    break;
                                }
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }

                function getDatesByFourthweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 4) {
                                    $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    var dayno = daysOfWeek[currentDate.getDay()];
                                    var weekno = getWeekOfMonth(currentDate);
                                    var obj = {
                                        "Date": $scope.DisplayDate,
                                        "Day": dayno,
                                        "WeekNumber": weekno,
                                        "StartTime": "",
                                        "EndTime": "",
                                    }
                                    selecteddates.push(obj);
                                    break;
                                }
                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }

                function getDatesByFifthweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;
                    var currentmonth = "";

                    for (var i = 0; i < emonths; i++) {
                        currentDate.setDate(1);
                        var currentmonth = currentDate.getMonth();

                        var count = 0;
                        for (var day = 1; day <= 31; day++) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {
                                count++;
                                if (count === 5) {
                                    var afterconvert = currentDate.getMonth();
                                    if (currentmonth == afterconvert) {
                                        $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                        var dayno = daysOfWeek[currentDate.getDay()];
                                        var weekno = getWeekOfMonth(currentDate);
                                        var obj = {
                                            "Date": $scope.DisplayDate,
                                            "Day": dayno,
                                            "WeekNumber": weekno,
                                            "StartTime": "",
                                            "EndTime": "",
                                        }
                                        selecteddates.push(obj);
                                    }
                                    break;
                                }
                            }
                        }

                        var copydate = angular.copy(currentDate);
                        var currentmonth1 = copydate.getMonth();
                        if (currentmonth + 1 == currentmonth1) {

                        } else {
                            currentDate.setDate(1);
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        }
                    }
                    return selecteddates;
                }

                function getDatesByLastweekWise(dayid) {
                    var currentDate = new Date();
                    var selecteddates = [];
                    var emonths = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 3;

                    for (var i = 0; i < emonths; i++) {

                        var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                        for (var day = lastDayOfMonth; day >= 1; day--) {
                            currentDate.setDate(day);
                            if (currentDate.getDay() === dayid) {

                                $scope.DisplayDate = $filter('date')(currentDate, "yyyy-MM-dd");
                                var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                var dayno = daysOfWeek[currentDate.getDay()];
                                var weekno = getWeekOfMonth(currentDate);
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": dayno,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                selecteddates.push(obj);
                                break;


                            }
                        }
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    return selecteddates;
                }


                $scope.changeConnectedUsersObj = function (obj) {
                    console.log(obj)
                    $scope.UserScheduleSlotsArray = [];
                    $scope.slotsArray = [];
                    $scope.addUpdateScheduleObj.DoctorId = obj.UserId;
                    var params = {
                        "UserId": obj.UserId,
                        "BranchId": mainitem.BranchId
                    }
                    eHnoteMainAdminServices.GetUserScheduledSlots(params, callbackuserSlotSuccess, callbackuserSlotError);
                    function callbackuserSlotSuccess(resp) {
                        if (resp.status === "Success") {
                            $scope.UserScheduleSlotsArray = resp.rows || [];


                            $scope.SlotStartValues = [];
                            for (var i = 0; i < 24; i++) {

                                var thistime = "";
                                if (i > 12) {
                                    var it = i - 12;
                                    if (it > 9) {
                                        thistime = it + ':00' + ': PM';
                                    } else {
                                        thistime = '0' + it + ':00' + ': PM';
                                    }
                                }
                                else {
                                    var it = i;
                                    if (it > 9) {
                                        if (it >= 12) {
                                            thistime = it + ':00' + ': PM';
                                        } else {
                                            thistime = it + ':00' + ': AM';
                                        }

                                    } else {
                                        thistime = '0' + it + ':00' + ': AM';
                                    }
                                }

                                var obj = {
                                    "time": "",
                                    "newtime": ""
                                }

                                if (i > 9) {
                                    obj.time = i + ':00';
                                    obj.newtime = thistime;
                                }
                                else {
                                    obj.time = '0' + i + ':00';
                                    obj.newtime = thistime;
                                }

                                $scope.SlotStartValues.push(obj);
                            }

                            $scope.SlotEndValues = [];
                            for (var i = 0; i < 24; i++) {
                                var thistime = "";
                                if (i > 12) {
                                    var it = i - 12;
                                    if (it > 9) {
                                        thistime = it + ':00' + ': PM';
                                    } else {
                                        thistime = '0' + it + ':00' + ': PM';
                                    }
                                }
                                else {
                                    var it = i;
                                    if (it > 9) {
                                        if (it >= 12) {
                                            thistime = it + ':00' + ': PM';
                                        } else {
                                            thistime = it + ':00' + ': AM';
                                        }

                                    } else {
                                        thistime = '0' + it + ':00' + ': AM';
                                    }
                                }

                                var obj = {
                                    "time": "",
                                    "newtime": ""
                                }

                                if (i > 9) {
                                    obj.time = i + ':00';
                                    obj.newtime = thistime;
                                }
                                else {
                                    obj.time = '0' + i + ':00';
                                    obj.newtime = thistime;
                                }
                             

                                $scope.SlotEndValues.push(obj);
                            }
                            console.log($scope.SlotStartValues);
                            console.log($scope.SlotEndValues);


                            if ($scope.UserScheduleSlotsArray.length > 0) {
                                angular.forEach($scope.UserScheduleSlotsArray, function (item) {
                                    item.IsAdvancedSlotsActive = false;
                                    item.SlotStartValues = angular.copy($scope.SlotStartValues) || [];
                                    item.SlotEndValues = angular.copy($scope.SlotEndValues) || [];
                                    item.Type = item.Type || 'Duration';
                                    item.FromDate = item.FromDate || "";
                                    item.ToDate = item.ToDate || "";

                                    if (item.UserScheduleDetails.length > 0) {
                                        angular.forEach(item.UserScheduleDetails, function (Aitem) {
                                            var list1 = $filter("filter")($scope.MainUserObj.BasicInfo.UserWorkingBranches, function (kitem, index) { return kitem.BranchId == Aitem.BranchId && kitem.UserBranchId == Aitem.UserBranchId });
                                            if (list1.length > 0) {
                                                Aitem.BranchObj = list1[0];
                                            }

                                            var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                            var dateStarttime = currentDt + "T" + Aitem.StartTime;
                                            var dateEndtime = currentDt + "T" + Aitem.EndTime;

                                            var CurrentStartTime = $filter("date")(new Date(dateStarttime), "h:mm a");
                                            var CurrentEndTime = $filter("date")(new Date(dateEndtime), "h:mm a");

                                            Aitem.displaystarttime = CurrentStartTime || '';
                                            Aitem.displayEndtime = CurrentEndTime || '';
                                            Aitem.OnlineSlots = Aitem.OnlineSlots || [];
                                            Aitem.BreakSlots = Aitem.BreakSlots || [];

                                            if (Aitem.BreakSlots.length > 0) {
                                                angular.forEach(Aitem.BreakSlots, function (Citem) {
                                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                    var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                    var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                    var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                    var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                    Citem.displaystarttime = CurrentStartTime || '';
                                                    Citem.displayEndtime = CurrentEndTime || '';

                                                });
                                            }
                                            if (Aitem.OnlineSlots.length > 0) {
                                                angular.forEach(Aitem.OnlineSlots, function (Citem) {
                                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                    var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                    var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                    var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                    var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                    Citem.displaystarttime = CurrentStartTime || '';
                                                    Citem.displayEndtime = CurrentEndTime || '';

                                                });
                                            }


                                            if (Aitem.SlotsList.length > 0) {
                                                angular.forEach(Aitem.SlotsList, function (Citem) {
                                                    var currentDt = $filter('date')(new Date(), "yyyy-MM-dd");
                                                    var dateStarttime1 = currentDt + "T" + Citem.StartTime;
                                                    var dateEndtime1 = currentDt + "T" + Citem.EndTime;

                                                    var CurrentStartTime = $filter("date")(new Date(dateStarttime1), "h:mm a");
                                                    var CurrentEndTime = $filter("date")(new Date(dateEndtime1), "h:mm a");

                                                    Citem.displaystarttime = CurrentStartTime || '';
                                                    Citem.displayEndtime = CurrentEndTime || '';

                                                });
                                            }
                                        });
                                    }
                                })


                                $scope.slotsArray = $scope.UserScheduleSlotsArray || [];

                            } else {
                                $scope.UserScheduleSlotsArray = [];
                                alertify.error("No Schedules Added For the User,Please Add Schedule and continue");
                            }



                        }
                    }
                    function callbackuserSlotError(err) {
                        alertify.error("Some Error Occured");
                    }
                };

                function getAllWeekDates() {

                    var array = [];
                    console.log($scope.addUpdateScheduleObj.ScheduleDate);

                    var actualSelectedDt = $filter('date')($scope.addUpdateScheduleObj.ScheduleDate, "yyyy-MM-dd");


                    $scope.currentDate = new Date($filter('date')($scope.addUpdateScheduleObj.ScheduleDate, "yyyy-MM-dd") + ' ' + "00:00:00");


                    console.log($scope.currentDate);
                    var monthCount = parseInt($scope.addUpdateScheduleObj.ScheduleDuration) || 0;


                    for (var i = 0; i < monthCount; i++) {
                        var monthStartDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + i, 1);

                        var numDaysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();

                        for (var j = 0; j < numDaysInMonth; j++) {
                            var date = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), j + 1);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];
                            console.log(date);
                            $scope.DisplayDate = $filter('date')(new Date(date), "yyyy-MM-dd");
                            var weekno = getWeekOfMonth(date);

                            var result = comparetwodates(actualSelectedDt, $scope.DisplayDate);
                            console.log(result);

                            if (!result) {
                                var obj = {
                                    "Date": $scope.DisplayDate,
                                    "Day": day,
                                    "WeekNumber": weekno,
                                    "StartTime": "",
                                    "EndTime": "",
                                }
                                array.push(obj);
                            }

                        }
                    }

                    return array;

                }

                function getWeekOfMonth(date) {
                    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                    const dayOfWeek = firstDayOfMonth.getDay();
                    const dayOfMonth = date.getDate() + dayOfWeek;
                    return Math.ceil(dayOfMonth / 7);
                }

                function comparetwodates(dt1, dt2) {
                    let date1 = new Date(dt1); // December 31, 2022
                    let date2 = new Date(dt2); // January 1, 2022

                    var result = false;
                    // compare the two dates
                    if (date1.getTime() > date2.getTime()) {
                        result = true;
                    } else if (date1.getTime() < date2.getTime()) {
                        result = false;
                    } else {
                        result = false;
                    }
                    return result;
                }



                $scope.getTimeSlotsByEveryType = function (typeid) {
                    console.log(typeid);
                    typeid = parseFloat(typeid) || 0;

                    $scope.ScheduledDateArray = [];

                    $scope.currentDate = new Date();
                    $scope.addUpdateScheduleObj.showDaySelection = false;
                    $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    if (typeid === 1) {
                        $scope.ScheduledDateArray = getAllWeekDates();
                    }
                    else if (typeid === 2) {

                        $scope.ScheduledDateArray = [];
                        var array = getAllWeekDates();

                        console.log(array);
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2 || sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }

                    }
                    else if (typeid === 3) {
                        $scope.ScheduledDateArray = [];
                        var array = getAllWeekDates();
                        console.log(array);
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1 || sditem.WeekNumber === 3 || sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 4) {
                        $scope.ScheduledDateArray = [];



                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 1) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 5) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 2) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 6) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 3) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 7) {
                        $scope.ScheduledDateArray = [];


                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 4) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 8) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });
                        }
                    }
                    else if (typeid === 9) {
                        $scope.ScheduledDateArray = [];

                        var array = getAllWeekDates();
                        if (array.length > 0) {
                            angular.forEach(array, function (sditem) {
                                if (sditem.WeekNumber === 5) {
                                    $scope.ScheduledDateArray.push(sditem);
                                }
                            });

                            if ($scope.ScheduledDateArray.length === 0) {
                                angular.forEach(array, function (sditem) {
                                    if (sditem.WeekNumber === 4) {
                                        $scope.ScheduledDateArray.push(sditem);
                                    }
                                });
                            }
                        }
                    }
                    else {
                      //  $scope.addUpdateScheduleObj.showDaySelection = true;
                    }
                    console.log($scope.ScheduledDateArray);

                    $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false)
                    console.log($scope.filteredArray);

                }

                $scope.OnChangeslot = function (val) {
                    if ($scope.addUpdateScheduleObj.showDaySelection) {
                       // var strtpe = parseInt($scope.addUpdateScheduleObj.ScheduleEveryType);

                        var checkedMonthArray = _.where($scope.RepeatMonth, { isChecked: true }) || [];

                        $scope.ScheduledDateArray = [];
                        $scope.addUpdateScheduleObj.ScheduleDuration = $scope.addUpdateScheduleObj.ScheduleDuration || "";
                        if ($scope.addUpdateScheduleObj.ScheduleDuration == '') {
                            $scope.filteredArray = [];
                            return false;
                        }

                        if (checkedMonthArray.length == 0) {
                            $scope.filteredArray = [];
                            return false;
                        }

                        angular.forEach(checkedMonthArray, function (mitem) {
                            var strtpe = mitem.Id;
                            if (strtpe === 14) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByLastweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 10) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByDayWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 11) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesBysecondweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 12) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByThirdweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            } else if (strtpe === 13) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByFourthweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            }
                            else if (strtpe === 15) {
                                var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                                if (checkedArray.length > 0) {
                                    angular.forEach(checkedArray, function (citem) {
                                        var selectedScheduledDateArray = [];
                                        selectedScheduledDateArray = getDatesByFifthweekWise(citem.WeekId);
                                        $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                    });
                                }

                            }
                        });

                        $scope.ScheduledDateArray = _.uniq($scope.ScheduledDateArray, false, function (p) { return p.Date; });
                        $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false);
                        console.log($scope.filteredArray);
                    } else {
                        console.log($scope.addUpdateScheduleObj.ScheduleEveryType)
                        if ($scope.addUpdateScheduleObj.ScheduleEveryType == "10") {



                            var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                            if (checkedArray.length > 0) {
                                angular.forEach(checkedArray, function (citem) {
                                    var selectedScheduledDateArray = [];
                                    selectedScheduledDateArray = getAlternateDatesByDayWise(citem.WeekId, citem.StartDate);
                                    $scope.ScheduledDateArray = $scope.ScheduledDateArray.concat(selectedScheduledDateArray);
                                });
                            }


                            $scope.ScheduledDateArray = _.uniq($scope.ScheduledDateArray, false, function (p) { return p.Date; });

                            $scope.filteredArray = $filter('orderBy')($scope.ScheduledDateArray, 'Date', false);
                            console.log($scope.filteredArray);

                        } else {
                            $scope.getTimeSlotsByEveryType(val);
                        }

                    }

                }


                $scope.changeType = function (type) {
                    console.log(type);
                    $scope.addUpdateScheduleObj.Type = type;
                    $scope.calendarSelectedSlots = [];
                };



                $scope.clearDayData = function (obj) {
                    obj.StartTime = "";
                    obj.EndTime = "";
                    obj.BranchObj = "";
                    obj.MaximumOverAllSlots = "";
                    obj.BranchId = null;
                    obj.UserBranchId = null;
                };



                $scope.closeuib = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.calendarSelectedSlots = [];

                $scope.addmoreDatesinCustom = function () {

                    var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });
                    selectedDatesArray = selectedDatesArray || [];
                    if (selectedDatesArray.length === 0) {
                        alertify.error("Select Dates");
                        return false;
                    } else {
                        angular.forEach(selectedDatesArray, function (sitem) {
                            var obj = {
                                "UserDaySlotId": 0,
                                "BranchId": null,
                                "Week": sitem.Week,
                                "UserBranchId": null,
                                "DayId": null,
                                "Day": sitem.Day || '',
                                "SlotDate": sitem.FullDate || "",
                                "DeleteInd": "N"
                            }
                            $scope.calendarSelectedSlots.push(obj);
                        });
                    }

                    console.log($scope.calendarSelectedSlots);

                    angular.forEach($scope.MainTimerArray, function (aitem) {
                        aitem.IsSelectedDate = false;
                    });

                    $scope.weekitems.checkitem1 = "N";
                    $scope.weekitems.checkitem2 = "N";
                    $scope.weekitems.checkitem3 = "N";
                    $scope.weekitems.checkitem4 = "N";
                    $scope.weekitems.checkitem5 = "N";
                    $scope.weekitems.checkitem6 = "N";
                }

                $scope.SaveSelectedScheduleToCalendar = function () {

                    if (mainitem.ConnectedUserId !== 0) {
                        if ($scope.connectedUsersObj.UsersList.length > 0) {
                            if ($scope.addUpdateScheduleObj.DoctorId === 0) {
                                alertify.error("Please Select a User");
                                return false;
                            }
                        }
                    }

                    if ($scope.addUpdateScheduleObj.UserScheduleId === 0) {
                        alertify.error("Please Select a Schedule");
                        return false;
                    }
                    if ($scope.addUpdateScheduleObj.Type == 'Custom') {
                        //var selectedDatesArray = $filter("filter")($scope.MainTimerArray, { "IsSelectedDate": true });
                        //selectedDatesArray = selectedDatesArray || [];
                        //if (selectedDatesArray.length === 0) {
                        //    alertify.error("Select Dates");
                        //    return false;
                        //} else {
                        //    angular.forEach(selectedDatesArray, function (sitem) {
                        //        var obj = {
                        //            "UserDaySlotId": 0,
                        //            "BranchId": null,
                        //            "UserBranchId": null,
                        //            "DayId": null,
                        //            "Day": sitem.Day || '',
                        //            "SlotDate": sitem.FullDate || "",
                        //            "DeleteInd": "N"
                        //        }
                        //        $scope.addUpdateScheduleObj.UserDaySlots.push(obj);
                        //    });
                        //}

                        if ($scope.calendarSelectedSlots.length === 0) {
                            alertify.error("Please select dates from the Calendar");
                            return false;
                        }
                        $scope.addUpdateScheduleObj.UserDaySlots = $scope.calendarSelectedSlots || []

                    }


                    if ($scope.addUpdateScheduleObj.Type == 'Duration') {
                        $scope.addUpdateScheduleObj.ScheduleDuration = $scope.addUpdateScheduleObj.ScheduleDuration || null;
                        $scope.addUpdateScheduleObj.FromDate = null;
                        $scope.addUpdateScheduleObj.ToDate = null;
                        $scope.addUpdateScheduleObj.ScheduleEveryType = $scope.addUpdateScheduleObj.ScheduleEveryType || "";

                        if ($scope.addUpdateScheduleObj.ScheduleMonthorWeekType == 1) {
                            if ($scope.addUpdateScheduleObj.ScheduleEveryType == "") {
                                alertify.error("Please Select Week");
                                return false;
                            }
                        } else if ($scope.addUpdateScheduleObj.ScheduleMonthorWeekType == 2) {
                            var checkedMonthArray = _.where($scope.RepeatMonth, { isChecked: true }) || [];
                            if (checkedMonthArray.length == 0) {
                                alertify.error("Please Select Repeat");
                                return false;
                            }

                            var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                            if (checkedArray.length == 0) {
                                alertify.error("Please Select Day");
                                return false;
                            }

                            var SelectedMonthType = _.pluck(checkedMonthArray, "Id").join(",");
                            $scope.addUpdateScheduleObj.ScheduleMonthMultiEveryType = SelectedMonthType || "";
                        }

                        /* if ($scope.addUpdateScheduleObj.ScheduleEveryType == "10" || $scope.addUpdateScheduleObj.ScheduleEveryType == "11" || $scope.addUpdateScheduleObj.ScheduleEveryType == "12" ||
                             $scope.addUpdateScheduleObj.ScheduleEveryType == "13" || $scope.addUpdateScheduleObj.ScheduleEveryType == "14") {
                             var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                             if (checkedArray.length == 0) {
                                 alertify.error("Please Select Day");
                                 return false;
                             }
                         }*/

                        if ($scope.addUpdateScheduleObj.ScheduleDuration == null) {
                            alertify.error("Please Enter Duration");
                            return false;
                        }
                        $scope.addUpdateScheduleObj.UserDaySlots = [];
                        if ($scope.ScheduledDateArray.length > 0) {
                            angular.forEach($scope.ScheduledDateArray, function (Aitem) {
                                var obj = {
                                    "UserDaySlotId": 0,
                                    "BranchId": null,
                                    "UserBranchId": null,
                                    "DayId": null,
                                    "Day": Aitem.Day || '',
                                    "SlotDate": Aitem.Date || "",
                                    "DeleteInd": "N"
                                }
                                $scope.addUpdateScheduleObj.UserDaySlots.push(obj);
                            });
                        }
                    }
                    if ($scope.addUpdateScheduleObj.Type == 'Date') {
                        $scope.addUpdateScheduleObj.FromDate = $scope.addUpdateScheduleObj.FromDate || null;
                        $scope.addUpdateScheduleObj.ToDate = $scope.addUpdateScheduleObj.ToDate || null;
                        if ($scope.addUpdateScheduleObj.FromDate == null) {
                            alertify.error("Please Select From Date");
                            return false;
                        }
                        if ($scope.addUpdateScheduleObj.ToDate == null) {
                            alertify.error("Please Select To Date");
                            return false;
                        }
                        var currentDate = new Date($scope.addUpdateScheduleObj.FromDate);
                        var ToDateDate = new Date($scope.addUpdateScheduleObj.ToDate);
                        $scope.addUpdateScheduleObj.UserDaySlots = [];
                        $scope.addUpdateScheduleObj.ScheduleDuration = null;
                        for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                            // datesArray.push(new Date(d));
                            var date = new Date(d);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                            var obj = {
                                "UserDaySlotId": 0,
                                "BranchId": null,
                                "UserBranchId": null,
                                "DayId": null,
                                "Day": day || '',
                                "SlotDate": $scope.DisplayDate || "",
                                "DeleteInd": "N"
                            }
                            $scope.addUpdateScheduleObj.UserDaySlots.push(obj);
                        }
                    }
                    if ($scope.addUpdateScheduleObj.UserDaySlots.length > 0) {
                        angular.forEach($scope.addUpdateScheduleObj.UserDaySlots, function (Aitem) {

                            $scope.addUpdateScheduleObj.FromDate = $scope.addUpdateScheduleObj.UserDaySlots[0].SlotDate;
                            $scope.addUpdateScheduleObj.ToDate = $scope.addUpdateScheduleObj.UserDaySlots[$scope.addUpdateScheduleObj.UserDaySlots.length - 1].SlotDate;

                            var list1 = $filter("filter")($scope.addUpdateScheduleObj.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                            if (list1.length > 0) {
                                Aitem.Day = list1[0].Day;
                                Aitem.DayId = list1[0].DayId;
                                Aitem.UserBranchId = list1[0].UserBranchId;
                                Aitem.BranchId = list1[0].BranchId;
                            }
                        });
                    }





                    $scope.UsertempTimeSlotsArray = [];

                    if ($scope.addUpdateScheduleObj.Type == 'Duration') {
                        $scope.addUpdateScheduleObj.ScheduleDuration = $scope.addUpdateScheduleObj.ScheduleDuration || null;

                        if ($scope.addUpdateScheduleObj.ScheduleDuration == null) {
                            alertify.error("Please Enter Duration");
                            return false;
                        }
                        var currentDate = new Date();
                        var oneMonthLater = new Date();
                        $scope.addUpdateScheduleObj.ScheduleDuration = parseInt($scope.addUpdateScheduleObj.ScheduleDuration);
                        oneMonthLater.setMonth(currentDate.getMonth() + $scope.addUpdateScheduleObj.ScheduleDuration);

                        $scope.UsertempTimeSlotsArray = [];
                        if ($scope.ScheduledDateArray.length > 0) {
                            angular.forEach($scope.ScheduledDateArray, function (Btem) {
                                var obj = {
                                    "Date": Btem.Date,
                                    "Day": Btem.Day,
                                    "StartTime": "",
                                    "EndTime": "",

                                }
                                $scope.UsertempTimeSlotsArray.push(obj);
                            });
                        }
                    }
                    if ($scope.addUpdateScheduleObj.Type == 'Date') {
                        $scope.addUpdateScheduleObj.FromDate = $scope.addUpdateScheduleObj.FromDate || null;
                        $scope.addUpdateScheduleObj.ToDate = $scope.addUpdateScheduleObj.ToDate || null;
                        if ($scope.addUpdateScheduleObj.FromDate == null) {
                            alertify.error("Please Select From Date");
                            return false;
                        }
                        if ($scope.addUpdateScheduleObj.ToDate == null) {
                            alertify.error("Please Select To Date");
                            return false;
                        }
                        var currentDate = new Date($scope.addUpdateScheduleObj.FromDate);
                        var ToDateDate = new Date($scope.addUpdateScheduleObj.ToDate);
                        $scope.addUpdateScheduleObj.ScheduleDuration = null;
                        $scope.UsertempTimeSlotsArray = [];
                        for (var d = currentDate; d <= ToDateDate; d.setDate(d.getDate() + 1)) {
                            // datesArray.push(new Date(d));
                            var date = new Date(d);
                            var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var day = daysOfWeek[date.getDay()];

                            $scope.DisplayDate = $filter('date')(new Date(d), "yyyy-MM-dd");
                            var obj = {
                                "Date": $scope.DisplayDate,
                                "Day": day,
                                "StartTime": "",
                                "EndTime": "",

                            }
                            $scope.UsertempTimeSlotsArray.push(obj);
                        }
                    }

                    $scope.TimeSlotsArray = [];
                    if ($scope.UsertempTimeSlotsArray.length > 0) {
                        angular.forEach($scope.UsertempTimeSlotsArray, function (Aitem) {
                            var list1 = $filter("filter")($scope.addUpdateScheduleObj.UserScheduleDetails, function (kitem, index) { return kitem.Day == Aitem.Day });

                            if (list1.length > 0) {
                                var Breakobj = {
                                    "BranchId": list1[0].BranchId,
                                    "Date": Aitem.Date || "",
                                    "StartTime": list1[0].StartTime,
                                    "EndTime": list1[0].EndTime,

                                }
                                $scope.TimeSlotsArray.push(Breakobj);
                            }
                        });
                    }

                    var params = {
                        "UserId": $scope.MainUserObj.BasicInfo.UserId,
                        "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "TimeSlotsArray": $scope.TimeSlotsArray || [],
                    };


                    eHnoteMainAdminServices.CheckIsUserSlotAvailNew(params, callbackgetuserbranchSuccess, callbackgetuserbranchError);
                    function callbackgetuserbranchSuccess(resp) {
                        console.log(JSON.stringify(resp));
                        if (resp.isUserSlotAvailable) {
                            $scope.continuetoSaveScheduletoCalendar($scope.addUpdateScheduleObj);
                        } else {
                            //  alertify.error(resp.Message);
                            var r = alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20' > Previous slots will be updated with new information, Do you want to continue?</h4> ",
                                function () {
                                    $scope.continuetoSaveScheduletoCalendar($scope.addUpdateScheduleObj);
                                }, function () {
                                    return false;
                                });
                        }

                    }
                    function callbackgetuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }






                }


                $scope.continuetoSaveScheduletoCalendar = function () {

                    var params = {
                        "UserId": $scope.addUpdateScheduleObj.UserId,
                        "DoctorId": $scope.addUpdateScheduleObj.DoctorId,
                        "BranchId": $scope.addUpdateScheduleObj.BranchId,
                        "Type": $scope.addUpdateScheduleObj.Type || "Duration",
                        "FromDate": $scope.addUpdateScheduleObj.FromDate || null,
                        "ToDate": $scope.addUpdateScheduleObj.ToDate || null,
                        "ScheduleDate": $filter("date")(new Date($scope.addUpdateScheduleObj.ScheduleDate), "yyyy-MM-dd"),
                        "ScheduleDuration": $scope.addUpdateScheduleObj.ScheduleDuration || "",
                        "ScheduleDurationType": $scope.addUpdateScheduleObj.ScheduleDurationType || "",
                        "UserScheduleId": $scope.addUpdateScheduleObj.UserScheduleId || 0,
                        "DeleteInd": "N",
                        "UserDaySlots": $scope.addUpdateScheduleObj.UserDaySlots || [],
                        "UserDayBreakSlots": $scope.addUpdateScheduleObj.UserDayBreakSlots || [],
                        "ScheduleEveryType": $scope.addUpdateScheduleObj.ScheduleEveryType,
                        "UserScheduleName": $scope.addUpdateScheduleObj.UserScheduleName,
                        "ScheduleMonthorWeekType": $scope.addUpdateScheduleObj.ScheduleMonthorWeekType,
                        "ScheduleMonthMultiEveryType": $scope.addUpdateScheduleObj.ScheduleMonthMultiEveryType
                    }



                    eHnoteMainAdminServices.AddupdateSlotCalendarSchedule(params, callbackuserbranchSuccess, callbackuserbranchError);
                    function callbackuserbranchSuccess(resp) {
                        console.log(resp);
                        if (resp.status === "Success") {
                            alertify.success("Time Slots Added Successfully");
                            $scope.GetConnectUserSchedule();
                           // $scope.AdminScheduleObj.IsShowEditSchedule = false;
                          //  $scope.AdminScheduleObj.ShowNewAddSchedule = false;
                            $scope.closeuib();
                        }
                    }
                    function callbackuserbranchError(err) {
                        alertify.error("Some Error Occured");
                    }
                }

                $scope.onSelectAlternateWeekDays = function () {
                    var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                    $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    if (checkedArray.length == 0) {
                        $scope.SearchWeekobj.selecteditem = "Select";
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    } else if (checkedArray.length == 1) {
                        $scope.SearchWeekobj.selecteditem = checkedArray[0].WeekDay;
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = true;
                    } else if ($scope.daysofweek.length == checkedArray.length) {
                        $scope.SearchWeekobj.selecteditem = "All";
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = true;
                    } else {
                        $scope.SearchWeekobj.selecteditem = "Selected";
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = true;
                    }

                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }
                //dayofweek multiple
                $scope.onselectedDaysofweek = function () {
                    var checkedArray = _.where($scope.daysofweek, { isChecked: true });
                    if (checkedArray.length == 0) {
                        $scope.SearchWeekobj.selecteditem = "Select";
                    } else if (checkedArray.length == 1) {
                        $scope.SearchWeekobj.selecteditem = checkedArray[0].WeekDay;
                    } else if ($scope.daysofweek.length == checkedArray.length) {
                        $scope.SearchWeekobj.selecteditem = "All";
                    } else {
                        $scope.SearchWeekobj.selecteditem = "Selected";
                    }

                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }

                $scope.OnClickRepeatMonth = function () {
                    var checkedArray = _.where($scope.RepeatMonth, { isChecked: true });
                    if (checkedArray.length == 0) {
                        $scope.SelectedMonthobj.Selecteditem = "Select";
                        $scope.addUpdateScheduleObj.showDaySelection = false;

                    } else if (checkedArray.length == 1) {
                        $scope.SelectedMonthobj.Selecteditem = checkedArray[0].Name;
                        $scope.addUpdateScheduleObj.showDaySelection = true;

                    } else if ($scope.RepeatMonth.length == checkedArray.length) {
                        $scope.SelectedMonthobj.Selecteditem = "All";
                        $scope.addUpdateScheduleObj.showDaySelection = true;

                    } else {
                        $scope.SelectedMonthobj.Selecteditem = "Selected";
                        $scope.addUpdateScheduleObj.showDaySelection = true;
                    }

                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }
                $scope.ChangeScheduleMonthorWeek = function (Id) {
                    angular.forEach($scope.RepeatMonth, function (ritem) {
                        ritem.isChecked = false;
                    });
                    $scope.addUpdateScheduleObj.showDaySelection = false;
                    $scope.SelectedMonthobj.Selecteditem = "Select";

                    $scope.addUpdateScheduleObj.ScheduleEveryType = "";
                    angular.forEach($scope.daysofweek, function (ritem) {
                        ritem.isChecked = false;
                    });
                    $scope.SearchWeekobj.selecteditem = "Select";
                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";

                    if ($scope.addUpdateScheduleObj.ScheduleMonthorWeekType == 2) {
                        $scope.addUpdateScheduleObj.IsAlternateDaysSelected = false;
                    }
                }
                $scope.changeWeekDayDate = function () {
                    $scope.ScheduledDateArray = [];
                    $scope.filteredArray = [];
                    $scope.addUpdateScheduleObj.ScheduleDuration = "";
                }

            }
        });
    };
    $scope.connectScheduleFromList = function (item, Mainitem) {
        $scope.UserScheduleSlotsArray = [];
        $scope.UserScheduleSlotsArray = angular.copy(Mainitem.UserSchedule);
        $scope.connectSchedules(item.UserScheduleId, 0, Mainitem);
    };
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.OnClickShowUerSchedules = function (item) {
        item.IsShowUserSchedule = !item.IsShowUserSchedule;
    }
  
}]);
function GetSpeciality(doctorspeciality, specialitycode) {
    var spl = "";
    angular.forEach(doctorspeciality, function (item) {
        angular.forEach(specialitycode, function (k, v) {
            if (item.DoctorSpecialityID == k) {
                spl += item.DoctorSpecialityDesc + " ";
            }
        });
    });
    return spl;
}
function GetQualification(qualifications) {
    var education = "";
    angular.forEach(qualifications, function (k, v) {
        education += k + " ";
    });
    return education;
}
function GetMemberID(memberid) {
    var regid = "";
    angular.forEach(memberid, function (k, v) {
        regid += k + " ";
    });
    return regid;
}
function GetDictionaryValues(qualifications) {
    var education = "";
    angular.forEach(qualifications, function (k, v) {
        education += k + " ";
    });
    return education;
}
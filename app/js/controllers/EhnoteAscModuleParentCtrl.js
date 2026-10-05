"use strict";
eHnoteWebApp.controller("EhnoteAscModuleParentCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.MaxDate = null;

    $scope.changeYear = false;
    $scope.changeMonth = false;
    $scope.PhoneType = 'Mobile';

    $scope.HeaderPatientSearchObj = {
        "IsShowSearchInd": true,
        "IsShowSearchRemoveInd": false
    };
    $scope.PatientSearch = {
        "SearchText": ""
    };

    //var pageurl = $location.url();

    //console.log(pageurl + "__pageurl");

    //if (pageurl=='/AscModule') {
    //    $scope.HeaderPatientSearchObj.IsShowSearchInd = false;
    //}

    $scope.patientSearchType = 2;
    $scope.ShowPatientSeatch = false;
    $scope.AllDoctorsList = [];
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.IsPatientSelected = false;

    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    if (!userLoginDetails.loggedinStatus) {
        datapersistanceFactory.clearAll();
        $location.path('/login');
        return false;
    }

    $scope.RoleId = userLoginDetails.RoleID;
    $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
    $scope.userProfilePic = "img/register-defaultuser-ico.png";

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    console.log($scope.cacheStorageItem.PatientID +"__PatientID");
    
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };

    if (doctorinfo !== undefined) {

        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
                    $scope.parenthospId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                }
                $scope.lRName = $scope.orgUsersData[0].ExtDetails.RoleName;

                $scope.Name = userLoginDetails.displayName;
                $rootScope.mainDisplayName = userLoginDetails.displayName;
                $scope.SpecialityName = userLoginDetails.specialisation;
                $scope.Speciality = userLoginDetails.specialisation;

                $scope.groupID = doctorinfo.doctordata.User[0].GroupId;
                $scope.accessRights = doctorinfo.doctordata.User[0].AccessDetails;
                $scope.RoleName = doctorinfo.doctordata.User[0].RoleName;
                $scope.Speciality = userLoginDetails.specialisation;
                userLoginDetails.RoleID = doctorinfo.doctordata.User[0].RoleId;


                if (userLoginDetails.RoleID === 4 || userLoginDetails.RoleID === 43 || userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 3 || userLoginDetails.RoleID === 14 || userLoginDetails.RoleID === 56 || userLoginDetails.RoleID === 57) {
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


    $scope.ChangeTabType = function (menu) {
        //$scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        //if (menu == 7) {
        //    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        //    $scope.cacheStorageItem.AppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId || 0;
        //    if ($scope.cacheStorageItem.PresentScreen == 'Asc' && $scope.cacheStorageItem.AppointmentTypeId !== 4) {
        //        alertify.error("This Patient Don't Have Asc Appointment");
        //        //$location.url("/OT");
        //        return false;
        //    } else if ($scope.cacheStorageItem.PresentScreen == 'Preadm' && $scope.cacheStorageItem.AppointmentTypeId !== 7 && $scope.cacheStorageItem.AppointmentTypeId !== 6) {
        //        alertify.error("This Patient Don't Have Preadm Appointment");
        //        //$location.url("/OT");
        //        return false;
        //    }
        //}

        if (menu == 7) {
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.selectedApptObj.AppointmentStatusId === 1) {
                    alertify.error("Patient has not checkedin yet!");
                    return;
                }
                if ($scope.cacheStorageItem.AdmissionId == 0) {
                    alertify.error("Patient is not admitted");
                    return false;
                }
               
            }
            else if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6){
                if ($scope.cacheStorageItem.selectedApptObj.AppointmentStatusId === 1) {
                    alertify.error("Patient has not checkedin yet!");
                    return;
                }
            }
        }
        $scope.AscTab = menu;
        if ($scope.AscTab == 1) {
            $scope.PreAdmissionSummaryViewTemplate();
        }
        if ($scope.AscTab == 7) {
            if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
                $scope.cacheStorageItem.PresentScreen = 'Preadm';
            } else if($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14 ){          
                    $scope.cacheStorageItem.PresentScreen = 'Asc';
            }
            $scope.AddToCache();
        }
        if ($scope.AscTab == 9) {          
        //    eHnoteMasterDataService.addAppointmentInfo('');
        }
        if ($scope.AscTab == 6) {
            datapersistanceFactory.set("CoordinatorToProfile", '');
        }
    };

    $scope.AscmainTab = 1;
    $scope.ChangemainTabType = function (type) {
        $scope.AscmainTab = type;
    };

    $scope.AscpreopsubTab = 1;
    $scope.ChangepreopsubTabType = function (type) {
        $scope.AscpreopsubTab = type;
    };

    $scope.Preadminpopover = {
        templateUrl: 'Preadminpopover.html',
        "scope": $scope
    };

    $scope.ClinicalChecklistObj = {
        "ClinicalChecklist": [],
        "IsAllClinicalCheckListChecked": '',
        "ClinicalChecklistTemplates": [],
        "MedicineChecklistTemplates": [],
        "SelectedClinicalChecklistTemplate": "",
        "AdmissionRemarks": ""
    };

    $scope.ModuleParentObj = {
        "SurgeryDiagnosisObj": {
            "Diagnosis": "",
            "DiagnosisId": null,
            "OrganizationDiagnosisId": null,
            "OrganizationSurgeryId": null,
            "SurgeryId": null,
            "SurgeryDate": "",
            "OperativeProcedure": "",
            "Surgeon": "",
        },
        "PatientDetails": {
            "PatientId": 0,
            "FullName": "",
            "Mobile": "",
            "DisplayId": "",
            "Gender": "",
            "Age": "",          
            "S3URL": "",
            "ExternalCoManager": "",
            "InternalCoManager": "",
            "PCP": "",
            "AddressLine1": "",
            "AddressLine2": "",
            "InsuranceDetails": [],
            "Allergies": []
        },       
        "HealthArray": [],
        "PostalAddress": {
            "AddressId": 0,
            "AddressLine1": "",
            "AddressLine2": "",
            "ZipCode": "",
            "CountyName": "",
            "CountyId": 0,
            "CityName": "",
            "CityId": 0,
            "StateName": "",
            "StateId": 0,
            "CountryName": "",
            "CountryId": 0,
            "CountyCodeObj": "",
            "ZipCodeArray": []
        },
        "PermanentAddress": {
            "AddressId": 0,
            "AddressLine1": "",
            "AddressLine2": "",
            "ZipCode": "",
            "CountyName": "",
            "CountyId": 0,
            "CityName": "",
            "CityId": 0,
            "StateName": "",
            "StateId": 0,
            "CountryName": "",
            "CountryId": 0,
            "CountyCodeObj": "",
            "ZipCodeArray": []
        }

    };

    $scope.PatientDetailsObj = {
        "PatientId": 0,
        "FullName": "",
        "Mobile": "",
        "DisplayId": "",
        "Gender": "",
        "Age": "",
        "S3URL": "",
        "ExternalCoManager": "",
        "InternalCoManager": "",
        "PCP": "",
        "InsuranceDetails": [],
        "Allergies": []
    };

    $scope.languageObj = {
        "selectedLang": "en"
    };

    $scope.languageObj.selectedLang = datapersistanceFactory.getItem("SelectedLanguageKey");

    $scope.activeLanguageChange = function (langKey) {
        $scope.languageObj.selectedLang = langKey;
        $translate.use(langKey);
        datapersistanceFactory.set("SelectedLanguageKey", langKey);
    };


    $scope.GetAllUsers = function () {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    $scope.listSubSplArray = angular.copy(resp.data.row);
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                }
                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
                var reqObj = {
                    "BranchId": $scope.HospitalId,
                    "SubSpecializationIdArray": subSplArray
                }

                eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                function onGetUsersSuccess(resp) {
                    if (resp.rows.length > 0) {
                        $scope.allUserList = resp.rows;
                        $scope.PerformedByArray = [];
                        $scope.allUserList = $scope.allUserList || [];
                        if ($scope.allUserList.length > 0) {
                            $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 43 || x.RoleId == 56 || x.RoleId == 57);
                        }
                    } else {
                        alertify.error("No Users Found in Selected Departments");
                    }
                }

                function onGetUsersFailure(data) {
                }

            }
        });
    };

    $scope.SelectPatient = function () {
        let patientId = $scope.cacheStorageItem.PatientID || 0;
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;

                $scope.ModuleParentObj.PatientDetails.PatientId = patientitem.Patient[0].PatientID;
                $scope.ModuleParentObj.PatientDetails.FullName = patientitem.Patient[0].FullName;
                $scope.ModuleParentObj.PatientDetails.DisplayId = patientitem.Patient[0].PatientDisplayId;
                $scope.ModuleParentObj.PatientDetails.Gender = patientitem.Patient[0].Gender;
                $scope.ModuleParentObj.PatientDetails.Mobile = patientitem.Patient[0].AltCountryCode + '-' + patientitem.Patient[0].Altareacode + '-' + patientitem.Patient[0].PatientHomeNumber;
                $scope.ModuleParentObj.PatientDetails.AltAreacode = patientitem.Patient[0].Altareacode || "";
                $scope.ModuleParentObj.PatientDetails.AltCountryCode = patientitem.Patient[0].AltCountryCode || "";
                $scope.ModuleParentObj.PatientDetails.PatientHomeNumber = patientitem.Patient[0].PatientHomeNumber || "";
                $scope.ModuleParentObj.PatientDetails.Age = patientitem.Patient[0].AgeInYears + 'Y' + ' ' + patientitem.Patient[0].AgeInMonths + 'M';
                $scope.ModuleParentObj.PatientDetails.AddressLine1 = patientitem.PatientAddress.PermanentAddress.AddressLine1;
                $scope.ModuleParentObj.PatientDetails.AddressLine2 = patientitem.PatientAddress.PermanentAddress.AddressLine2;

                $scope.ModuleParentObj.PatientDetails.S3URL = patientitem.Patient[0].S3URL || "";

                //$scope.ModuleParentObj.PatientDetails.ExternalCoManager = "";
                //$scope.ModuleParentObj.PatientDetails.InternalCoManager = "";
                $scope.ModuleParentObj.PatientDetails.PCP = patientitem.Patient[0].AdditionalInfo.PCPName;

                $scope.ModuleParentObj.PatientDetails.Allergies = angular.copy(patientitem.PatientAllergies);
                $scope.ModuleParentObj.PatientDetails.InsuranceDetails = angular.copy(patientitem.patientInsuranceDetails);

                $scope.ContactList = [];
                patientitem.Patient[0].ContactNo = patientitem.Patient[0].ContactNo || "";
                patientitem.Patient[0].MobileNo = patientitem.Patient[0].MobileNo || "";

                var contactno = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].ContactNo);
                $scope.ModuleParentObj.PatientDetails.ContactNo = contactno.UsFormatMobileNumber;

                var mobile = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].MobileNo);
                $scope.ModuleParentObj.PatientDetails.Mobile = mobile.UsFormatMobileNumber;

                if (patientitem.Patient[0].ContactNo.length > 10) {
                    let obj = {
                        "value": $scope.ModuleParentObj.PatientDetails.ContactNo
                    }
                    $scope.ContactList.push(obj);
                }

                if (patientitem.Patient[0].MobileNo.length > 10) {
                    let obj = {
                        "value": $scope.ModuleParentObj.PatientDetails.Mobile
                    }
                    $scope.ContactList.push(obj);
                }
                $scope.ModuleParentObj.PatientDetails.DOB = patientitem.Patient[0].DOB;
                $scope.ModuleParentObj.PatientDetails.SSN = patientitem.Patient[0].SocialSecurityNo;
                $scope.ModuleParentObj.PatientDetails.MaritalStatus = patientitem.Patient[0].AdditionalInfo.MaritalStatus;
                $scope.ModuleParentObj.PatientDetails.BloodGroupName = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupName;

                $scope.ModuleParentObj.PostalAddress.AddressLine1 = patientitem.PatientAddress.PostalAddress.AddressLine1 || "";
                $scope.ModuleParentObj.PostalAddress.AddressLine2 = patientitem.PatientAddress.PostalAddress.AddressLine2 || "";
                $scope.ModuleParentObj.PostalAddress.CountyName = patientitem.PatientAddress.PostalAddress.CountyName;
                $scope.ModuleParentObj.PostalAddress.CityName = patientitem.PatientAddress.PostalAddress.CityName;
                $scope.ModuleParentObj.PostalAddress.StateName = patientitem.PatientAddress.PostalAddress.StateName;
                $scope.ModuleParentObj.PostalAddress.CountryName = patientitem.PatientAddress.PostalAddress.CountryName;
                $scope.ModuleParentObj.PostalAddress.ZipCode = patientitem.PatientAddress.PostalAddress.ZipCode;

                $scope.ModuleParentObj.PermanentAddress.AddressLine1 = patientitem.PatientAddress.PermanentAddress.AddressLine1 || "";
                $scope.ModuleParentObj.PermanentAddress.AddressLine2 = patientitem.PatientAddress.PermanentAddress.AddressLine2 || "";
                $scope.ModuleParentObj.PermanentAddress.CountyName = patientitem.PatientAddress.PermanentAddress.CountyName;
                $scope.ModuleParentObj.PermanentAddress.CityName = patientitem.PatientAddress.PermanentAddress.CityName;
                $scope.ModuleParentObj.PermanentAddress.StateName = patientitem.PatientAddress.PermanentAddress.StateName;
                $scope.ModuleParentObj.PermanentAddress.CountryName = patientitem.PatientAddress.PermanentAddress.CountryName;
                $scope.ModuleParentObj.PermanentAddress.ZipCode = patientitem.PatientAddress.PermanentAddress.ZipCode;

                $scope.ModuleParentObj.PatientTagList = [];
                if (patientitem.Patient[0].PatientTagList.length > 0) {
                    $scope.ModuleParentObj.PatientTagList = angular.copy(patientitem.Patient[0].PatientTagList);
                }

                $scope.ModuleParentObj.PatientDetails.OldMrno = patientitem.Patient[0].OldMrno;
                $scope.ModuleParentObj.PatientDetails.LanguageName = patientitem.Patient[0].AdditionalInfo.LanguageName;
                $scope.ModuleParentObj.PatientDetails.LanguageID = patientitem.Patient[0].AdditionalInfo.LanguageID;

                var obj = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].MobileNo);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

                //$scope.PatientDetailsObj.PatientId = patientitem.Patient[0].PatientID;
                //$scope.PatientDetailsObj.FullName = patientitem.Patient[0].FullName;
                //$scope.PatientDetailsObj.DisplayId = patientitem.Patient[0].PatientDisplayId;
                //$scope.PatientDetailsObj.Gender = patientitem.Patient[0].Gender;
                //$scope.PatientDetailsObj.Mobile = patientitem.Patient[0].AltCountryCode + '-' + patientitem.Patient[0].Altareacode + '-' + patientitem.Patient[0].PatientHomeNumber;
                //$scope.PatientDetailsObj.Age = patientitem.Patient[0].AgeInYears + 'Y' + ' ' + patientitem.Patient[0].AgeInMonths + 'M';

                //$scope.PatientDetailsObj.ExternalCoManager = "";
                //$scope.PatientDetailsObj.InternalCoManager = "";
                //$scope.PatientDetailsObj.PCP = patientitem.Patient[0].AdditionalInfo.PCPName;
                //$scope.PatientDetailsObj.S3URL = patientitem.Patient[0].S3URL;

                //$scope.PatientDetailsObj.Allergies = angular.copy(patientitem.PatientAllergies);

                //$scope.PatientDetailsObj.AddressLine1 = angular.copy(patientitem.PatientAddress.PermanentAddress.AddressLine1) || "";
                //$scope.PatientDetailsObj.AddressLine2 = angular.copy(patientitem.PatientAddress.PermanentAddress.AddressLine2) || "";
                //$scope.PatientDetailsObj.InsuranceDetails = angular.copy(patientitem.patientInsuranceDetails);


                $scope.cacheStorageItem.Gender = patientitem.Patient[0].Gender;
                $scope.cacheStorageItem.PatientMobileNumber = $scope.PatientMobileNumber || "";
                $scope.cacheStorageItem.Age = patientitem.Patient[0].AgeInYears + 'Y' + ' ' + patientitem.Patient[0].AgeInMonths + 'M';

                $scope.cacheStorageItem.Height = patientitem.Patient[0].Height || "";
                $scope.cacheStorageItem.Weight = patientitem.Patient[0].Weight || "";

                if (patientitem.PatientRace.length > 0) {
                    $scope.cacheStorageItem.RaceName = patientitem.PatientRace[0].RaceName;
                }

                $scope.AddToCache();


            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }
   
    $scope.init = function () {
        $scope.SelectPatient();
        let tab = 7;
        $scope.cacheStorageItem.IsfromScreen = $scope.cacheStorageItem.IsfromScreen || '';
        if ($scope.cacheStorageItem.IsfromScreen == 'ascprofile') {
            tab=6
        }
        if ($scope.cacheStorageItem.IsfromScreen =='preauth') {
            tab = 6
        }
        //$scope.AscTab = 6;
        $scope.ChangeTabType(tab);
    };
    $scope.init();

    $scope.Navigate = function () {
        $location.url("/OT");

        // if it is past appointment, dont enable dynamic status: 10-04-2024


        //if ($scope.cacheStorageItem.IsPastAppointment) {
        //    $location.url("/OT");
        //} else {
        //    let params = {
        //        "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
        //    };

        //    eHnoteMainAppointmentService.GetASCLatestTrackerStatusById(params).then(function (resp) {
        //        if (resp.data.Status === "Success") {
        //            if (resp.data.rows.length > 0) {
        //                let DynamicStatusObj = resp.data.rows[0];
        //                alertify.confirm(
        //                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>The patient is at " + DynamicStatusObj.RoomType + " , would you like to tranfer patient to another room? </h4>",
        //                    function () {
        //                        let PatientObj = {
        //                            "PatientName": $scope.ModuleParentObj.PatientDetails.FullName,
        //                            "PatientId": $scope.cacheStorageItem.PatientID,
        //                            "PhAreaCD": $scope.ModuleParentObj.PatientDetails.AltAreacode || '',
        //                            "PhCntryCD": $scope.ModuleParentObj.PatientDetails.AltCountryCode || '',
        //                            "HomeNumber": $scope.ModuleParentObj.PatientDetails.PatientHomeNumber || '',
        //                            "MobileNo": $scope.ModuleParentObj.PatientDetails.Mobile || '',
        //                            "DOB": $scope.ModuleParentObj.PatientDetails.DOB || '',
        //                            "OldMRNo": $scope.ModuleParentObj.PatientDetails.OldMrno || '',
        //                            "PatientDisplayId": $scope.ModuleParentObj.PatientDetails.DisplayId || '',
        //                            "CheckInBy": ""
        //                        };
        //                        if (PatientObj.DOB != '') {
        //                            PatientObj.DOB = $filter('date')(PatientObj.DOB, "MM-dd-yyyy");
        //                        }

        //                        let modalInstance = $uibModal.open({
        //                            "templateUrl": "templates/ASC/ASCSendtoPopUp.html",
        //                            "controller": function ($scope, $uibModal, $uibModalInstance, PatientObj) {
        //                                $scope.PatientObj = angular.copy(PatientObj);

        //                                $scope.RoomSearchObj = {
        //                                    "RoomTypeId": 0,
        //                                    "RoomId": 0,
        //                                    "RoomTypeobj": "",
        //                                    "NewApptStartTime": "",
        //                                    "NewApptEndTime": "",
        //                                    "otherDocInd": "N",
        //                                    "Opthamobj": "",
        //                                    "OptomId": null,
        //                                    "Technicianobj": "",
        //                                    "TechnicianId": null,
        //                                    "Counsellorobj": "",
        //                                    "CounsellorId": null,
        //                                    "DilationAssistantobj": "",
        //                                    "DilationAssistantId": null,
        //                                    "DoctorId": null,
        //                                    "sendtoDoctorRoleId": null,
        //                                    "Roomobj": "",
        //                                    "Remarks": "",
        //                                    "TransferUserId": eHnoteMasterDataService.getLoginId(),
        //                                    "SelectDoctor": "",
        //                                    "sendtoDoctorId": "",
        //                                    "otherDocInd": false,
        //                                    "SubSpecialityObj": "",
        //                                    "SubSpecialityId": "",
        //                                }

        //                                $scope.ChangesRoomType = function (val) {
        //                                    $scope.RoomSearchObj.RoomTypeId = val;
        //                                };

        //                                $scope.closeRoom = function () {
        //                                    $uibModalInstance.dismiss("cancel");
        //                                };

        //                                $scope.GetASCRoomTypes = function () {
        //                                    eHnoteMainAdminServices.GetASCWaitingRoomTypes().then(function (resp) {
        //                                        let tempRooms = angular.copy(resp.data);
        //                                        if (tempRooms.length > 0) {
        //                                            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
        //                                                $scope.RoomTypeList = tempRooms.filter((x) => x.Id == 13 || x.Id == 17 || x.Id == 20 || x.Id == 21 || x.Id == 22 || x.Id == 23 || x.Id == 24);
        //                                            } else if ($scope.cacheStorageItem.AppointmentTypeId == 4) {
        //                                                $scope.RoomTypeList = tempRooms.filter((x) => x.Id == 13 || x.Id == 14 || x.Id == 15 || x.Id == 16 || x.Id == 17 || x.Id == 18);
        //                                            }

        //                                        } else {
        //                                            $scope.RoomTypeList = [];
        //                                        }
        //                                    });
        //                                };

        //                                $scope.init = function () {
        //                                    $scope.GetASCRoomTypes();
        //                                };

        //                                $scope.init();

        //                                $scope.SendToRoom = function () {
        //                                    $scope.RoomSearchObj.RoomTypeId = $scope.RoomSearchObj.RoomTypeId || 0;
        //                                    if ($scope.RoomSearchObj.RoomTypeId === 0) {
        //                                        alertify.error("Select Room Type");
        //                                        return false;
        //                                    }

        //                                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
        //                                    var params = {
        //                                        "UserId": eHnoteMasterDataService.getLoginId(),
        //                                        "HospitalId": $scope.HospitalId,
        //                                        "AppointmentId": $scope.cacheStorageItem.AppointmentId,
        //                                        "ASCAppointmentTrackerDetailId": 0,
        //                                        "RoleId": $scope.RoleId,
        //                                        "DoctorId": null,
        //                                        "DoctorRoleId": null,
        //                                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId || 0,
        //                                        "RoomId": null,
        //                                        "Remarks": $scope.RoomSearchObj.Remarks || '',
        //                                        "CurrentTime": $scope.CurrentTime,
        //                                        "IsSendTo": "Y",
        //                                        "IsCheckedIn": "N",
        //                                        "IsCheckedOut": "N",
        //                                        "IsReCheckIn": "N",
        //                                        "IsReCheckOut": "N"
        //                                    }
        //                                    eHnoteMainAppointmentService.AddUpdateASCAppointmentTrackerDetails(params).then(function (resp) {
        //                                        if (resp.data.Status === "Success") {
        //                                            alertify.success("Patient transferred successfully!");
        //                                            $uibModalInstance.close();

        //                                        }
        //                                    });
        //                                }
        //                            },
        //                            "size": "lg",
        //                            "backdrop": "static",
        //                            "scope": $scope,
        //                            "keyboard": false,
        //                            "resolve": {
        //                                "PatientObj": function () { return PatientObj || {}; }
        //                            }
        //                        });
        //                        modalInstance.result.then(function () {
        //                            $location.url("/OT");
        //                        }, function (cancel) {

        //                        });
        //                    },
        //                    function () {
        //                        $location.url("/OT");
        //                    });
        //            }
        //        }
        //    }, function (err) {

        //    });
        //}
        
    };

    $scope.navToSwitchAnother = function () {

        $rootScope.$broadcast("changeSwitchAnother", doctorinfo);
        $rootScope.showSwitchAnother = true;
        $location.url("/login");
    };
    $scope.navToLogout = function () {
        // Going offline has to happen before the session is torn down: it is an
        // authenticated call, and the token lives in the storage cleared below.
        $rootScope.$broadcast('telnyxForceOffline');
        $scope.openPopupCheck = "";

        datapersistanceFactory.clearAll();
        eHnoteDiagnosisDataServices.ClearMasterConsultationCache();
        eHnoteSettingsDataService.ClearMasterClaimCache();
        $rootScope.showMainPageHeader = false;
        $rootScope.patientdetailesConsultation = false;
        $rootScope.patientConsultationScreen = false;
        datapersistanceFactory.set("JWTToken", "");

        angular.element('.modal-dialog').hide();

        angular.element('.inmodal').hide();
        angular.element('.alertify').hide();

        eHnoteMasterDataService.addSelectedCrmApptDates('');

        eHnoteMasterDataService.addSelectedOPUsers('');

        if ($window.location.host == "ioj.ehnote.com") {
            $window.location.href = "https://portal.ehnote.com/#/login";
        } else if ($window.location.host == 'insts.ehnote.com') {
            $window.location.href = "https://stage.ehnote.com/#/login";
        } else {
            $location.path("/login");
        }
    };

    $scope.clearPatientSearchData = function () {
        $scope.ShowPatientListDrop = false;
        $scope.PatientSearch.SearchText = "";
    };

    $scope.ClickPatientSearchIcon = function () {
        $scope.HeaderPatientSearchObj.IsShowSearchInd = false;
        $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = true;
        $scope.clearPatientSearchData();
    }

    $scope.ClickPatientSearchRemoveIcon = function () {
        $scope.HeaderPatientSearchObj.IsShowSearchInd = true;
        $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = false;
    }

    $scope.SearchByTextOPHeader = function (type) {
        if ($scope.PatientSearch.SearchText != '') {
            $scope.Showeditpatient = false;
            $scope.cancelAppPopup = false;

            $scope.showpatientsummary = false;
            if ($scope.PatientDepositsPopup == "1") {
                $scope.modaldepositInstance.dismiss('cancel');
            }
            if ($scope.PatientDepositsPopup == "2" || $scope.PatientDepositsPopup == "5") {
                $scope.mInstanceAdd.dismiss('cancel');
            }
            if ($scope.PatientDepositsPopup == "3" || $scope.PatientDepositsPopup == "4") {
                $scope.bookapptSetupPopUp.dismiss('cancel');
            }

            var name = $scope.PatientSearch.SearchText;
            if (name === undefined || name === '') {
                type = 'click';
            }

            if ($scope.patientSearchType === 5) {
                name = name + " 00:00:00";
                var parsedDate = new Date(name);
                if (!isNaN(parsedDate.getTime())) {
                    name = $filter('date')(parsedDate, "yyyy-MM-dd");
                } else {
                    // Log an error or handle the invalid date case
                    alertify.error("Invalid date format:", name);
                    name = "";
                    // Return false or handle the error in another way
                    return false;
                }
            }

            if ((name && name.length >= 4) || $scope.patientSearchType !== 1) {
                $scope.Emailid = "";

                var param = {
                    "PageSize": 21,
                    "UserId": "",
                    "PageNumber": 1,
                    "SearchText": "",
                    "Count": 0,
                    "SearchDetails": { "listdocpatients": "Y" },
                    "EndAge": 0,
                    "StartAge": 0,
                    "StartDate": "",
                    "EndDate": ""
                };
                if (!isNaN(name) && $scope.patientSearchType == 3) {
                    if (name.length < 10) {
                        param.hasparam = false;
                        return;
                    }
                }
                if (!isNaN(name)) {
                    param.PhoneNumber = name;
                    param.hasparam = true;
                    param.SearchText = "";
                } else {
                    param.SearchText = name;
                    param.hasparam = true;
                    param.PhoneNumber = "";
                }
                param.UserId = eHnoteMasterDataService.getLoginId();
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.CheckHospitalId = {};
                    if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 56) {
                        $scope.HospitalArray = [];
                        angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                            if (item.ExtDetails !== undefined) {
                                if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                    var Obj = {
                                        "HospitalName": item.ClinicName,
                                        "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                        "ActiveIND": "Y",
                                        "isChecked": true,
                                        "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                    };
                                    $scope.HospitalArray.push(Obj);
                                }
                            }
                        });
                    }
                }
                var list = [];
                $scope.HospitalArray = $scope.HospitalArray || [];
                if ($scope.HospitalArray.length > 0) {
                    angular.forEach($scope.HospitalArray, function (items) {
                        if (items.isChecked) {
                            list.push(items.BranchId);
                        }
                    });
                } else {
                    var data = localStorageFactory.getItem("allBranchesData") || [];
                    angular.forEach(data, function (item, index) {
                        item.HospitalInfo.HospitalDetails.isChecked = true;
                        $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
                    });
                    angular.forEach($scope.HospitalArray, function (items) {
                        if (items.isChecked) {
                            list.push(items.BranchId);
                        }
                    });
                }

                param["HospitalIDLst"] = list;
                var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                eHnoteMasterDataService.addPatientSearchInfo(param);
                if (param.PhoneNumber !== "") {
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.PhoneNumber || '',
                        "SearchTypeID": $scope.patientSearchType || 0,
                    }
                    eHnotePatientDataService.SearchAllPatientData(object, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
                } else {
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText || "",
                        "SearchTypeID": $scope.patientSearchType || 0,
                    }
                    eHnotePatientDataService.SearchAllPatientData(object, OnGetSearchPatientSuccess, OnGetPatientSearchError, $scope.sendhospcode);
                }
            }
        }
    };
    function OnGetSearchPatientSuccess(data) {
        if (data.count > 0) {
            $scope.count = data.count;
            $scope.PatientsArray = [];
            $scope.patientpushval = [];
            $scope.patientinitval = {};
            angular.forEach(data.rows, function (item) {
                $scope.patientinitval = {};
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.S3URL = item.S3URL || "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;

                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;
                $scope.patientinitval.OldMrno = item.OldMrno;

                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                $scope.patientinitval.DisplayID = item.DisplayID || "";
                $scope.patientinitval.Altareacode = item.Altareacode || "";
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";

                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                $scope.patientinitval.PatientMobileNoFormate = obj.UsFormatMobileNumber;

                $scope.patientinitval.PatientDetails = {};
                $scope.patientinitval.PatientDetails.PatientID = "";
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientpushval.push(previouspatval);
            });
            $scope.PatientsArray = $scope.patientpushval;
            $scope.noresult = false;
            $scope.showloading = false;
            if ($scope.PatientSearch.SearchText != "") {
                $scope.ShowPatientListDrop = true;
            }
        } else {
            $scope.count = 0;
            $scope.PatientsArray = [];
        }
    }
    function OnGetPatientSearchError() {
        $scope.count = 0;
        $scope.PatientsArray = [];
        $scope.PatientSearch.SearchText = "";
    }

    $scope.ClickOPPatientSearchIcon = function () {
        $scope.SearchByTextOPHeader();
    };

    $scope.getSelectedPatientDetails = function (item) {
        $scope.cacheStorageItem.PatientID = item.PatientID || 0;
        $scope.cacheStorageItem.IsfromScreen = "ascprofile";
        $scope.AddToCache();
        $scope.SelectPatient();
       
        $rootScope.$broadcast("ASCPatientSearch", item.PatientID);
 /*       $scope.AscTab = 6;*/
        $scope.ClickPatientSearchRemoveIcon();
        $scope.clearPatientSearchData();
    }

    $scope.GetPreAdmChecklistObj = function () {
        var obj = {
            "IsPreadmVitalsInd": true,
            "IsPreAdmROSMainInd": true,
            "IsPrAdmROSSystemicInd": true,
            "IsPrAdmROSSurgicalInd": true,
            "IsPrAdmROSAllergiesInd": true,
            "IsPreAdmEvaluationMainInd": true,
            "IsPrAdmEvaluationLabInd": true,
            "IsPrAdmEvaluationCardioInd": true,
            "IsPrAdmEvaluationAirwayInd": true,
            "IsPreAdmChecklistMainInd": true,
            "IsPreAdmChecklistHealthPlanInd": true,
            "IsPreAdmPreSurgeryOrdersMainInd": true,
            "IsPreAdmPreSurgeryMedicationsInd": true,
            "IsPreAdmCurrentMedicationsInd": true,
            "IsPreAdmLabsInvestigationsInd": true,
            "IsPreAdmAnesthetistPlanMainInd": true,
            "IsPreAdmPreviousAnestheticInd": true,
            "IsPreAdmAssessmentASAInd": true,
            "IsPreAdmAnestheticPlanInd": true
        }
        return obj;
    }

    $scope.PreAdminCheckListObj = $scope.GetPreAdmChecklistObj();

 
    $scope.showSelectedData = function () {
        var selectedData = [];

        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory) {
            selectedData.push('Family/pt History');
        }

        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway) {
            selectedData.push('Difficult airway');
        }

        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV) {
            selectedData.push('PONV');
        }

        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR) {
            selectedData.push('Patient is DNR');
        }

        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend) {
            selectedData.push('Suspend');
        }

        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue) {
            selectedData.push('Continue');
        }

        return selectedData.join(', ');
    };

    $scope.SelectedData = function () {
        var selectedData1 = [];

        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia) {
            selectedData1.push('Topical Anesthesia');
        }

        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia) {
            selectedData1.push('Local Anesthesia');
        }

        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia) {
            selectedData1.push('General Anesthesia');
        }

        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia){
            selectedData1.push('Peri-bulbar Anesthesia');
        }
        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia) {
            selectedData1.push('SubTenon Anesthesia');
        }
        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia) {
            selectedData1.push('Regional Anesthesia');
        }
     
        return selectedData1.join(', ');
    };

    
    $scope.$on("loader Module", function (evt, data) {
        $scope.SelectPatient();    
    });
   

}]);

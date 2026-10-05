"use strict";
eHnoteWebApp.controller("EhnoteRegisterPatientCtrl", ["$scope", "$rootScope", "Upload", "$location", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteDbStaticDataService", "alertify", "eHnoteOrgReferralDataServices", "eHnotePatientAddressDataServices", "eHnoteLoginStatusService", "datacookieFactory", "datapersistanceFactory", "eHnoteCacheStorageService", "eHnoteValidateUsersDataService", "$uibModal", "$timeout", "$filter", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteUserAppointmentDataService", "eHnoteInsuranceService", "eHnoteConditionsDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnotePrintService", "$q", "localStorageFactory", "eHnoteMainAppointmentService", "eHnoteReferalDataService", function ($scope, $rootScope, Upload, $location, eHnoteMasterDataService, eHnotePatientDataService, eHnoteDbStaticDataService, alertify, eHnoteOrgReferralDataServices, eHnotePatientAddressDataServices, eHnoteLoginStatusService, datacookieFactory, datapersistanceFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, $uibModal, $timeout, $filter, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteUserAppointmentDataService, eHnoteInsuranceService, eHnoteConditionsDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnotePrintService, $q, localStorageFactory, eHnoteMainAppointmentService, eHnoteReferalDataService) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path("/login");
        return;
    }
    $scope.ShowpatientsDetails = false;
    $scope.showSaveForSingleUser = false;
    $scope.addAppfrmPat = false;
    $scope.Registeraddpopup = false;
    $scope.addRefferelPopup = false;
    $rootScope.appointment_type = "12";
    $scope.openFamilyDetails = false;
    $scope.ageinMonths = "";
    $scope.ageinDays = "";
    $scope.ageinYears = "";
    $scope.PhNumber = "";
    $scope.Current_patinet_appStarttime = "";
    $scope.Current_patinet_appEndtime = "";
    $scope.AddedPatientData = [];
    $scope.DocFreqItems = [];
    var hospid = 0;
    var hospcode = "";
    var parenthospid = 0;
    $scope.getPatientsVisibleStatus = datapersistanceFactory.set("myPatientsSet", "yes");
    $scope.patientinfo = eHnoteMasterDataService.getNewPatientInfo();
    $scope.patientinfo.CountyCodeObj = "";
    $scope.patientinfo.ZipCodePlusNo = "";
    $scope.patientinfo.PCP = 0;
    $scope.patientinfo.Provider1 = 0;
    $scope.patientinfo.Provider2 = 0;
    $scope.patientinfo.Corporation = 0;
    $scope.patientinfo.Office = 0;
    $scope.patientinfo.IsPhysicallyChallenged = false;
    $scope.DisplayName = userLoginDetails.displayName;

    $scope.patientinfo.emgyCntryCode = "91";
    $scope.MaxDate = null;
    $scope.changeYear = false;
    $scope.changeMonth = false;
    $scope.ShowAddNew = false;
    $scope.DefaultShowDetails = false;
    $scope.ShowNewConsultation = false;
    $scope.ShowFamilyAddNew = false;
    $scope.showIsMobileNoManadatory = false;
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.UserSettingObject = datapersistanceFactory.getItem('UserSettingsData');
    $scope.IsEmergencyContactMandatory = false;
    $scope.isLogoDefault = true;
    $scope.isLogoThumbnailDefault = false;
    $scope.isLogoS3URLDefault = false;
    $scope.ShowBarCodeprint = false;
    $scope.ShowLabelprint = false;
    $scope.IsMobileNoManadatory = false;
    $scope.IsRefferalSourceMandatory = false;
    $scope.IsAddressDetailsMandatory = false;
    $scope.CitySelected = null;
    $scope.selectedCountry = null;
    $scope.selectedItem = null;
    $scope.querycity = [];
    $scope.querySearch = [];
    $scope.countryArray = [];
    $scope.state = true;
    $scope.city = true;
    $scope.IsEthnicitySelected = [];
    $scope.IsRaceSelected = [];

    $scope.obj = {
        "IsEthnicitySelected": [],
        "IsRaceSelected": []
    }
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.PatientRegistration !== undefined) {
            if ($scope.OrganizationSettingsData.PatientRegistration.IsEmergencyContactMandatory === 1) {
                $scope.IsEmergencyContactMandatory = true;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.SelectBarCodeLabelPrint === '2') {
                $scope.ShowBarCodeprint = true;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.SelectBarCodeLabelPrint === '3') {
                $scope.ShowLabelprint = true;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsMobileNoManadatory === 1) {
                $scope.IsMobileNoManadatory = true;
            }
            else {
                $scope.showIsMobileNoManadatory = true;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.IsRefferalSourceMandatory === 1) {
                $scope.IsRefferalSourceMandatory = true;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.IsAddressDetailsMandatory === 1) {
                $scope.IsAddressDetailsMandatory = true;
            }
        }
    }

    $scope.SelectedBillingCategoryType = "";
    $scope.SelectedBillingCategoryTypeId = "";

    $scope.patientid = 0;
    $scope.familyname = "";
    $scope.HospitalCD = "";
    $scope.familyidchange = "Y";
    $scope.patientinfo.Selectedtitle = "";

    $scope.selectedEthnicity = 'Select';
    $scope.selectedRace = 'Select';
    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.RoleId = doctorinfo.RoleID;

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

    $scope.ParenthospitalId = 0;

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }
    var frmregpatient = eHnoteMasterDataService.getPatientvalConsult();
    $scope.frmEditAppointment = eHnoteMasterDataService.getAddPatientwithoutConsult();
    $scope.patientinfo.doctorid = eHnoteMasterDataService.getLoginId();

    $scope.PatientEthnicityList = [];
    $scope.PatientRaceList = [];


    $scope.initPatientEdit = function (obj) {


        console.log(obj);

        var patientitem = {
            "Patient": [{
                "PatientId": obj.PatientData.PatientID
            }]
        };

        $scope.SelectPatient(patientitem, 1);

    };


    $scope.PatientLanguagePreferenceList = [];
    $scope.PatientLanguageExpressionList = [];

    $q.all([
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientSuffix'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientEthnicity'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientRace'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientSexualOrientation'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientGenderIdentity'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientNationality'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientLanguage'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('InsuranceRelationship'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('InsuranceCoverage'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('InsuranceStatus'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('InsurancePlanType'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientTitle'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('LanguageProficiency'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('LanguageExpression'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientClass'),
        eHnoteSettingsDataService.GetAllDropdownValuesByType('BillingType')

    ]).then(function (resp) {
        if (resp[0].data.rows.length !== 0) {
            $scope.PatientSuffixList = resp[0].data.rows;
        }
        if (resp[1].data.rows.length !== 0) {
            $scope.PatientEthnicityList = resp[1].data.rows;

            console.log($scope.PatientEthnicityList);

            if ($scope.PatientEthnicityList.length > 0) {
                angular.forEach($scope.PatientEthnicityList, function (kitem) {
                    kitem.IsSelected = false;
                    kitem.Id = 0;
                });
            }
        }
        if (resp[2].data.rows.length !== 0) {
            $scope.PatientRaceList = resp[2].data.rows;
            if ($scope.PatientRaceList.length > 0) {
                angular.forEach($scope.PatientRaceList, function (kitem) {
                    kitem.IsSelected = false;
                    kitem.Id = 0;
                });
            }
        }
        if (resp[3].data.rows.length !== 0) {
            $scope.PatientSexualOrientationList = resp[3].data.rows;
        }
        if (resp[4].data.rows.length !== 0) {
            $scope.PatientGenderIdentityList = resp[4].data.rows;
        }
        if (resp[5].data.rows.length !== 0) {
            $scope.PatientNationalityList = resp[5].data.rows;
        }
        if (resp[6].data.rows.length !== 0) {
            $scope.PatientLanguageList = resp[6].data.rows;
        }
        if (resp[7].data.rows.length !== 0) {
            $scope.InsuranceRelationShipList = resp[7].data.rows;
        }
        if (resp[8].data.rows.length !== 0) {
            $scope.InsuranceCoverageList = resp[8].data.rows;
        }
        if (resp[9].data.rows.length !== 0) {
            $scope.InsuranceStatusList = resp[9].data.rows;
        }
    
        if (resp[10].data.rows.length !== 0) {
            $scope.InsurancePlanTypeList = resp[10].data.rows;
        }
        if (resp[11].data.rows.length !== 0) {
            $scope.PatientPrefixList = resp[11].data.rows;
        }
        if (resp[12].data.rows.length !== 0) {
            $scope.PatientLanguageProficiencyList = resp[12].data.rows;
        }
        if (resp[13].data.rows.length !== 0) {
            $scope.PatientLanguageExpressionList = resp[13].data.rows;
        }

        if (resp[14].data.rows.length !== 0) {
            $scope.PatientClassArray = resp[14].data.rows;
        }
        if (resp[15].data.rows.length !== 0) {
            $scope.PatientBillingTypeArray = resp[15].data.rows;
        }


        var opatientApptGet = eHnoteMasterDataService.getPatientApptDataApptList();
        if (opatientApptGet.IsFromApptScreen) {
            $scope.initPatientEdit(opatientApptGet);
        } else {
            InitializeNewBranches();
        }

    }, function (err) {
        console.log(err);
        alertify.error("Getting Data Failed");
    });

    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);
    $scope.MartialStatusList = angular.copy(mObj.masterMartialStatusList);
    $scope.BloodGroupList = angular.copy(mObj.masterBloodGroupList);


    $scope.educationDetails = angular.copy(mObj.masterEducationsList);


    $scope.occupationDetails = angular.copy(mObj.masterOccupationsList);



    function newPatientInsuranceObj() {

        var obj = {
            "PatientInsuranceDetailId":0,
            "CoverageId": 277,
            "CoverageName": "Primary",
            "PlanId": "",
            "Payor": "",
            "PayorId": "",
            "PlanTypeId": "",
            "PolicyId": "",
            "GroupId": "",
            "GroupName": "",
            "PolicyHolder": "Self",
            "Employer": "",
            "Coinsurance": "",
            "VisitCopay": "",
            "EffectiveDate": "",
            "ExpiryDate": "",
            "ScanDate": "",
            "VerifiedDate": "",
            "AcceptAssign": "No",
            "AssignBenifits": "No",
            "ReleaseInfo": "No",
            "LaboratoryId": "",
            "StatusId": 282,
            "PolicyHolderName": "",
            "RelationShipId": "",
            "Comments": "",
            "MSPTrailerTypeId": "",
            "Staff": $scope.DisplayName,
            "CoverageObj": "",
            "PlanObj": "",
            "DeleteInd": false,
            "TempInsuranceImagesArray": [],
            "payorPlansListArray": []
        }
        return obj;
    }

    var insObj = newPatientInsuranceObj();
    $scope.patientinfo.PatientInsuranceDetailsArray = [];

    $scope.patientinfo.PatientInsuranceDetailsArray.push(insObj);


    $scope.states = eHnotePatientAddressDataServices.getStates(hospid, getstatesSuccess, getstatesFailed);
    function getstatesSuccess(data) {
        $scope.states = data;
    }
    function getstatesFailed(data) {
    }
    $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
    function getcountriesSuccess(data) {
        $scope.countries = data;
    }
    function getcountriesFailed(data) {
    }
    //eHnotePatientAddressDataServices.getCities(hospid, getcitiesSuccess, getcitiesFailed);
    //function getcitiesSuccess(data) {
    //    $scope.cities = data;
    //}
    //function getcitiesFailed(data) {
    //}

    //eHnotePatientAddressDataServices.GetAllMartialStatus(hospid, GetAllMartialStatusSuccess, GetAllMartialStatusFailed);
    //function GetAllMartialStatusSuccess(data) {
    //    $scope.MartialStatusList = data;
    //}
    //function GetAllMartialStatusFailed(data) {
    //}
    //eHnotePatientAddressDataServices.GetAllBloodGroups(hospid, GetAllBloodGroupsSuccess, GetAllBloodGroupsFailed);
    //function GetAllBloodGroupsSuccess(data) {
    //    $scope.BloodGroupList = data;
    //}
    //function GetAllBloodGroupsFailed(data) {
    //}

    eHnoteDbStaticDataService.GetAllTitlesByParentId($scope.ParenthospitalId).then(function (resp) {
        $scope.TitlesList = resp.data;
        $scope.patientinfo.Selectedtitle = $scope.TitlesList[0];
        $scope.SelectedTitle = $scope.TitlesList[0];
        $scope.patientinfo.Selectemgytitle = $scope.TitlesList[0];

    }, function (err) {
        console.log(err);
        alertify.error("Getting Titles Failed");
    });


    //eHnoteMainAdminServices.GetAllRelations().then(function (resp) {
    //    $scope.RelationShipTypeList = resp.data;
    //}, function (err) {
    //    console.log(err);
    //    alertify.error("Getting RelationsShip Failed");
    //});

    //eHnotePatientAddressDataServices.getReferral(hospid, getreffSuccess, getreffFailed);
    //function getreffSuccess(data) {
    //    $scope.referralDetails = data;
    //}
    //function getreffFailed(data) {
    //}



    $scope.patientinfo.title = "Mr";
    $scope.patientinfo.firstname = "";
    $scope.patientinfo.PatientHomeCode = "";
    $scope.patientinfo.PatientHomeNumber = "";
    $scope.patientinfo.PatientOfficeCode = "";
    $scope.patientinfo.PatientOfficeNumber = "";
    $scope.patientinfo.BloodGroup = "";
    $scope.patientinfo.BloodGroupObj = "";
    $scope.patientinfo.BloodGroupId = "";
    $scope.patientinfo.lastname = "";
    $scope.patientinfo.vipFlag = 'N';
    $scope.patientinfo.CurrentAge = "";
    $scope.patientinfo.mobileNumber = "";
    $scope.patientinfo.landlineNumber = "";
    $scope.patientinfo.phType = 'M';
    $scope.patientinfo.phStdCD = "";
    $scope.patientinfo.phAreaCD = '+91';
    $scope.patientinfo.emailid = "";
    $scope.patientinfo.gender = 'Male';
    $scope.patientinfo.dob = "";
    $scope.patientinfo.emgymobilenumber = "";
    $scope.patientinfo.emgyrelationship = "";
    $scope.patientinfo.emgyalternatenumber = "";
    $scope.patientinfo.emgyname = "";
    $scope.patientinfo.emgytitle = "Mr";
    $scope.patientinfo.othDetailmaritalstatus = "";
    $scope.patientinfo.othDetailmaritalstatusObj = "";
    $scope.patientinfo.othDetailmaritalstatusId = "";
    $scope.patientinfo.othDetaileducation = "";
    $scope.patientinfo.othDetailoccupation = "";
    $scope.patientinfo.othDetailreferralsource = "";
    $scope.patientinfo.othrDetailNotes = "";
    $scope.patientinfo.referralSource = "";
    $scope.patientinfo.patientPhone = [];
    $scope.patientinfo.othDetailreferralsourceName = "";
    $scope.patientinfo.patientAddress = [];
    $scope.existfamilyid = "Y";
    $scope.patientid = 0;
    $scope.patientinfo.familyRelation = "";
    $scope.patientinfo.Refvalue = 0;
    $scope.patientinfo.SubValue = 0;
    $scope.patientinfo.AdharNo = "";
    $scope.patientinfo.PanNo = "";
    $scope.patientinfo.PassportNo = "";
    $scope.patientinfo.Nationality = "";
    $scope.patientinfo.NationalityObj = "";
    $scope.patientinfo.NationalityId = "";
    $scope.patientinfo.Visastatus = "";
    $scope.patientinfo.AlternateType = 'Mobile';
    $scope.patientinfo.ReferralPhoneType = 'Mobile';
    $scope.patientinfo.ReferralMobileNo = "";
    $scope.patientinfo.ReferralContactNo = "";
    $scope.patientinfo.FamilyPatientId = "";
    $scope.patientinfo.prefixObj = "";
    $scope.patientinfo.SuffixObj = "";
    $scope.patientinfo.LanguageObj = "";
    $scope.patientinfo.EthnicityObj = "";
    $scope.patientinfo.RaceObj = "";
    $scope.patientinfo.SexualOrientationObj = "";
    $scope.patientinfo.GenderIdentityObj = "";
    var emptyArray = [];
    eHnoteMasterDataService.addAppointmentInfo(emptyArray);

    var appointmentInfoFrmPatient = eHnoteMasterDataService.getAppointmentInfoFrmPatient();
    $scope.regPaientBtnName = "Save Patient";

    $scope.patientinfo.InsuranceObj = '';
    $scope.altertype = "1";
    $scope.file3 = "";

    $scope.getType = function (item) {
        $scope.altertype = item;
    }

    $scope.$on('reloadRegister', function (event) {
        $scope.patientinfo = eHnoteMasterDataService.getNewPatientInfo();
    });

    $scope.patientinfo.TempImagesArray = [];
    $scope.patientinfo.TempImagesArray1 = [];
    $scope.patientinfo.TempImagesArray2 = [];
    $scope.patientinfo.TempPdfArray = [];





    $scope.selectPrintImgLogo = function (file) {
        $scope.file = file;
        if ($scope.file != null) {
            var pName = $scope.file.name, name = "";
            var type = $scope.file.type.split("/")[1];
            if (pName.length > 9) {
                name = pName.substring(0, 9) + "..." + "." + type;
            } else {
                name = angular.copy(pName) + '.' + type;
            }
            if ($scope.patientinfo.DocumentTypeId === "" || $scope.patientinfo.DocumentObj.Id === "") {
                alertify.error("Select Document Type");
                angular.element("input[type='file']").val(null);
                $scope.file = null;
                return;
            }

            var obj = {
                "file": $scope.file,
                "DocumentTypeId": $scope.patientinfo.DocumentTypeId,
                "DeleteInd": false,
                "DocumentId": 0,
                "DocumentExt": $scope.file.type,
                "DisplayName": name
            };

            if ($scope.file.type != 'application/pdf') {
                $scope.patientinfo.TempImagesArray.push(obj);
            }
            else {
                $scope.patientinfo.TempPdfArray.push(obj);
            }
            angular.element("input[type='file']").val(null);
        }
    };
    $scope.removeImage = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            $scope.IsModifedLogo = false;
            if (item.TempImagesArray1.length !== 0) {
                $scope.patientinfo.TempImagesArray1 = item.TempImagesArray1 || [];
                $scope.patientinfo.TempImagesArray1[0].DeleteInd = true;
            }
            $scope.patientinfo.S3URL = '';
            $scope.file = "";

            $scope.isLogoDefault = true;
            $scope.isLogoThumbnailDefault = false;
            $scope.isLogoS3URLDefault = false;
        }, function () {
            return;
        });
    }

    $scope.IsModifedLogo = false;
    $scope.selectPrintImgLogo1 = function (file) {
        $scope.patientinfo.TempImagesArray1 = [];

        $scope.isLogoDefault = false;
        $scope.isLogoThumbnailDefault = true;
        $scope.isLogoS3URLDefault = false;
        $scope.IsModifedLogo = true;

        $scope.patientinfo.S3URL = '';
        $scope.file = "";

        $scope.file = file;
        if ($scope.file != null) {
            var pName = $scope.file.name, name = "";
            var type = $scope.file.type.split("/")[1];
            if (pName.length > 9) {
                name = pName.substring(0, 9) + "..." + "." + type;
            } else {
                name = angular.copy(pName) + '.' + type;
            }


            var obj = {
                "file": $scope.file,
                "DocumentTypeId": $scope.patientinfo.DocumentTypeId,
                "DeleteInd": false,
                "DocumentId": $scope.patientinfo.DocumentId || 0,
                "DocumentExt": $scope.file.type,
                "DisplayName": name
            };

            if ($scope.file.type != 'application/pdf') {
                $scope.patientinfo.TempImagesArray1.push(obj);
            }

            angular.element("input[type='file']").val(null);
        }
    };

    //$scope.selectPCPimagelist = function (file) {
    //    $scope.patientinfo.TempImagesArray2 = [];     
    //    $scope.file3 = "";
    //    $scope.file3 = file;
    //    if ($scope.file3 != null) {
    //        var pName = $scope.file3.name, name = "";
    //        var type = $scope.file3.type.split("/")[1];
    //        if (pName.length > 9) {
    //            name = pName.substring(0, 9) + "..." + "." + type;
    //        } else {
    //            name = angular.copy(pName) + '.' + type;
    //        }


    //        var obj = {
    //            "file": $scope.file3,
    //            "DocumentTypeId": $scope.patientinfo.DocumentTypeId,
    //            "DeleteInd": false,
    //            "DocumentId": $scope.patientinfo.DocumentId || 0,
    //            "DocumentExt": $scope.file3.type,
    //            "DisplayName": name
    //        };

    //        if ($scope.file3.type != 'application/pdf') {
    //            $scope.patientinfo.TempImagesArray2.push(obj);
    //        }
    //        angular.element("input[type='file']").val(null);
    //    }
    //};

    $scope.selectPCPimagelist = function ($files) {

        $scope.patientinfo.TempImagesArray2 = [];
        $scope.agreementFiles = [];
       
        if ($files.length > 0) {
            //$scope.agreementFiles.push($files[0]);
            $scope.agreementFiles = $files;
            if ($scope.agreementFiles != null) {
                if ($scope.agreementFiles.length > 0) {
                    $scope.patientinfo.TempImagesArray2 = [];
                    $scope.TempPdfArray = [];
                    angular.forEach($scope.agreementFiles, function (kitem) {

                        var pName = kitem.name, name = "";
                        var type = kitem.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": kitem,
                            "DocumentTypeId": $scope.patientinfo.DocumentTypeId,
                            "DeleteInd": false,
                            "DocumentId": $scope.patientinfo.DocumentId || 0,
                            "DocumentExt": kitem.type,
                            "PatientPCPDocumentId": null,                     
                            "DisplayName": name
                        };
                        if (kitem.type != 'application/pdf') {
                            $scope.patientinfo.TempImagesArray2.push(obj);
                       
                        }
                       
                    });
                }
            }
        }
    };

    $scope.RemovePhoneNumber = function (item) {
        var index = $scope.patientinfo.patientPhone.indexOf(item);
        $scope.patientinfo.patientPhone.splice(index, 1);
    };
    $scope.ChangeRefferalSource = function () {
        $scope.patientinfo.ReferralSource = "";
        $scope.patientinfo.othDetailreferralsourceName = "";

        console.log($scope.patientinfo.MasterReferralSource);

        if ($scope.patientinfo.MasterReferralSource != "") {
            if ($scope.patientinfo.MasterReferralSource.ShowType == 'D') {
                GetrefferalSource("");
            }
        }
    }

    $scope.SearchByReferralSource = function () {
        if ($scope.patientinfo.referralSource != "") {
            $scope.Refferalserachname = $scope.patientinfo.othDetailreferralsourceName;
            if ($scope.Refferalserachname === "" || $scope.Refferalserachname.length < 2) {
                $scope.patientinfo.othDetailreferralsource = "";
                $scope.ShowRefferallist = false;
                return false;
            } else {

                $scope.ShowRefferallist = true;
                GetrefferalSource($scope.Refferalserachname);
            }
        } else {
            alertify.error("Please Choose Referral Resource");
            return false;
        }

    };
    function GetrefferalSource(Searchtext) {
        hospid = undefined;
        var getParams = {
            "DoctorID": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "PageSize": 1000,
            "SearchText": Searchtext,
            "PageNumber": 1,
            "USRId": doctorinfo.doctorid,
            "MasterReferralSourceId": $scope.patientinfo.MasterReferralSource.MasterReferralSourceId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
        } else {
            hospid = undefined;
            eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
        }
        function onreadSuccess(data) {
            $scope.ReferralList = data[0].rows;
            $scope.totalItems = data[0].count;
            if ($scope.IsbindindData) {

                $scope.patientinfo.ReferralSource = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.patientinfo.othDetailreferralsource }, true)[0];

                if ($scope.patientinfo.ReferralSource !== undefined) {
                    $scope.patientinfo.othDetailreferralsource = $scope.patientinfo.ReferralSource.ReferralID;
                    $scope.patientinfo.othDetailreferralsourceName = $scope.patientinfo.ReferralSource.ReferralTitle;
                    $scope.referralTitle = "";
                }

                $scope.IsbindindData = false;
            }

        }
        function onreadFailed(data) {
        }
    }
    //GetrefferalSource("");

    $scope.changeReferral = function (selectedReferral) {
        console.log(selectedReferral);


        $scope.ShowRefferallist = false;
        if (selectedReferral === null) {
            $scope.patientinfo.othDetailreferralsource = "";
            $scope.patientinfo.othDetailreferralsourceName = "";
        } else {
            $scope.patientinfo.othDetailreferralsource = selectedReferral.ReferralID;
            $scope.patientinfo.othDetailreferralsourceName = selectedReferral.ReferralTitle;
            $scope.patientinfo.ReferralMobileNo = selectedReferral.ReferralMobileNo;
            $scope.patientinfo.ReferralContactNo = selectedReferral.ReferralContactNo;
            $scope.patientinfo.ReferralSource = selectedReferral;
        }

        console.log($scope.patientinfo.othDetailreferralsource);

    };

    $scope.patientinfo.Address2 = "";
    $scope.patientinfo.Address1 = "";
    $scope.patientinfo.DistrictRegion = "";
    $scope.patientinfo.PinCode = "";
    $scope.patientinfo.State = ($scope.statecodeval === undefined) ? '' : $scope.statecodeval;
    $scope.patientinfo.Street = "";
    $scope.patientinfo.Country = ($scope.countrycodeval === undefined) ? '' : $scope.countrycodeval;
    $scope.patientinfo.AddressType = "H";
    $scope.patientinfo.CityTown = ($scope.citycodeval === undefined) ? '' : $scope.citycodeval;
    $scope.patientinfo.Location = ($scope.locationcodeval === undefined) ? '' : $scope.locationcodeval;
    $scope.patientinfo.SendPatientEmail = false;
    $scope.onItemSelected = function (item) {
        $scope.patientid = item.PatientID;
        $scope.familyname = item.FamilyDisplayID;
    };
    $scope.cancel = function (click) {
        var url = "/OP";
        $location.url(url);
    };
    $scope.getDateOfBirth = function (year, month, day) {
        year = parseInt(year) || 0;
        month = parseInt(month) || 0;
        day = parseInt(day) || 0;
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dateNow = today.getDate();
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }

        if (dateNow > day)
            var dateAge = dateNow - day;
        else {
            dobmonth--;
            dateAge = 30 + dateNow - day;

            if (dobmonth < 0) {
                dobmonth = 11;
                dobyear--;
            }
        }
        dobmonth = dobmonth < 10 ? "0" + dobmonth : dobmonth;
        dateAge = dateAge < 10 ? "0" + dateAge : dateAge;
        if (dateAge === "00") {
            dateAge = "01";
        }
        return dobmonth + "/" + dateAge + "/" + dobyear;
    };
    $scope.Removeimage = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            item.DeleteInd = true;
            if (item.DocumentId === 0) {
                if ($scope.patientinfo.TempImagesArray.length > 0) {
                    for (var k = 0; k < $scope.patientinfo.TempImagesArray.length; k++) {
                        if ($scope.patientinfo.TempImagesArray[k].DeleteInd === true) {
                            $scope.patientinfo.TempImagesArray.splice(k, 1);
                        }
                    }
                }
            }
            else {
                $scope.DeleteImageArray.push(item);
                var obj = {
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "patientInsuranceDetails": {
                        "PatientDocumentDetails": $scope.DeleteImageArray,
                        "InsuranceCompanyId": $scope.patientinfo.InsuranceCompanyId,
                        "TPAId": $scope.patientinfo.TPAId
                    }
                };
                eHnotePatientDataService.DeletePatientInsuranceDetails(obj).then(function (resp) {
                    if (resp.data.Status === 'Success') {
                        if ($scope.patientinfo.TempImagesArray.length > 0) {
                            for (var k = 0; k < $scope.patientinfo.TempImagesArray.length; k++) {
                                if ($scope.patientinfo.TempImagesArray[k].DeleteInd === true) {
                                    $scope.patientinfo.TempImagesArray.splice(k, 1);
                                }
                            }
                        }
                    }
                },
                    function (err) {
                    });
            }
        }, function () {
            return;
        });


    };

    $scope.changeReferralPhoneType = function (type) {
        if (type === 'Mobile') {
            $scope.patientinfo.ReferralContactNo = "";
        }
        if (type === 'LandLine') {
            $scope.patientinfo.ReferralMobileNo = "";
        }
    }

    $scope.removeInsurance = function (ind) {
        $scope.patientinfo.PatientInsuranceDetailsArray.splice(ind, 1);
    };

    $scope.RegpFlowpopup = false;
    var SetupPopUp;

    $scope.$on('closePopup', function (event) {
        SetupPopUp.dismiss('cancel');
        $rootScope.Comingfrom = "RegPatient";
        $location.url("/op");
    });
    $scope.$on('successMethod', function (event) {
        SetupPopUp.dismiss('cancel');
        $rootScope.Comingfrom = "appointmentList";
        $timeout(function () {
            $location.url("/op");
        }, 1000);
    });
    function OnAddPatientError(err) {
        console.log(err);
    }
    var getplacesParams = { "DoctorID": doctorinfo.doctordata.User[0].DoctorID, "ActiveIND": "Y" };
    eHnoteDbStaticDataService.getCity(getplacesParams, onsuccesscity, onerrorcity);
    function onsuccesscity(data) {
        $scope.cityValues = data;
        $scope.cityDatavalue = [];
        angular.forEach($scope.cityValues, function (item) {
            if (item.StateID === $scope.patientinfo.State) {
                $scope.cityDatavalue.push(item);
            }
        });
    }
    function onerrorcity(err) {
        console.log(err);
    }
    $scope.changeState = function () {
        $scope.cityDatavalue = [];
        angular.forEach($scope.cityValues, function (item) {
            if (item.StateID === $scope.patientinfo.State) {
                $scope.cityDatavalue.push(item);
            }
        });
    };
    $scope.changecitytown = function () {
        $scope.locationsetValues = [];
        angular.forEach($scope.locationValues, function (item) {
            if (item.CityID === $scope.patientinfo.CityTown) {
                $scope.locationsetValues.push(item);
            }
        });
    };
    $scope.BlurChangeState = function (item) {
        if (item.NationalityId !== 1 || item.NationalityId !== "") {
            item.State = item.State;
            item.StateId = 0;
        }
    };
    $scope.changePatientState = function (item) {
        $scope.patientinfo.State = item.Name;
        $scope.patientinfo.StateId = item.StateId;
        $scope.patientinfo.Street = "";
        $scope.patientinfo.Location = "";
        $scope.patientinfo.CityTown = "";
    };
    $scope.ONchangePatientState = function (item) {
        $scope.patientinfo.State = item.Name;
        $scope.patientinfo.StateId = item.StateId;
        $scope.patientinfo.Street = "";
        $scope.patientinfo.Location = "";
        $scope.patientinfo.CityTown = "";
    };
    function createFilterFor(query) {
        var lowercaseQuery = "";
        for (var i = 0; i < query.length; i++) {
            if (i === 0) {
                lowercaseQuery = angular.uppercase(query[i]);
            } else {
                lowercaseQuery = lowercaseQuery + angular.lowercase(query[i]);
            }
        }
        return function filterFn(state) {
            return (state.Name.indexOf(lowercaseQuery) === 0);
        };
    }
    $scope.querySearch = function (query) {
        var results = query ? $scope.states.filter(createFilterFor(query)) : [];
        return results;
    }
    $scope.clear = function (l) {
        $scope.searchText = l;
        $scope.querySearch = [];
        if ($scope.patientinfo.CityId != "" && $scope.patientinfo.CityId != null) {
            $scope.querySearch = [];
        }
        if ($scope.patientinfo.State.length != 0 && $scope.state === true) {

            var results = $scope.searchText ? $scope.states.filter(createFilterFor($scope.searchText)) : [];
            $scope.querySearch = results;
            $scope.patientinfo.StateId = "";

        }
        if ($scope.state === false) {
            $scope.state = true;
        }

    }
    $scope.changecountry = function () {
        $scope.stateDatavalue = [];
        angular.forEach($scope.stateValues, function (item) {
            if (item.CountryID === $scope.patientinfo.Country) {
                $scope.stateDatavalue.push(item);
            }
        });
        angular.forEach(countryCodeValue, function (item) {
            angular.forEach(item, function (getCode) {
                if (getCode.CountryID === $scope.patientinfo.Country) {
                    $scope.countryCodeSetValue = getCode.CountryCode;
                }
            });
        });
    };
    eHnoteDbStaticDataService.getState(getplacesParams, onsuccessState, onerrorState);
    function onsuccessState(data) {
        $scope.stateDatavalue = [];
        $scope.stateValues = data;
        angular.forEach($scope.stateValues, function (item) {
            if (item.CountryID === $scope.patientinfo.Country) {
                $scope.stateDatavalue.push(item);
            }
        });
    }
    function onerrorState(data) {
    }
    var countryCodeValue = [];
    eHnoteDbStaticDataService.getCountry(getplacesParams, onsuccessCountry, onerrorCountry);
    function onsuccessCountry(data) {
        $scope.countryValues = data;
        countryCodeValue.push(data);
    }
    function onerrorCountry(data) {
    }
    var currencyCodeValue = [];
    $scope.MasterReferralSource = function () {
        eHnoteOrgReferralDataServices.GetMasterReferralSource(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (response) {
            $scope.ReferralSouceMaster = response.data.rows;
        });
    }

    $scope.MasterReferralSource();
    function onsuccesslookup(data) {
        currencyCodeValue.push(data.currencyType);
        $scope.CurrencyType = data.currencyType;
        $scope.familyRelationList = data.familyRltnType;
        angular.forEach(countryCodeValue, function (item) {
            if (item.CountryID === $scope.patientinfo.Country) {
                $scope.countryCodeValue = item.CountryCode;
            }
            angular.forEach(item, function (getCode) {
                if (getCode.CountryID === $scope.patientinfo.Country) {
                    $scope.countryCodeSetValue = getCode.CountryCode;
                }
            });
        });
    }
    function onerrorlookup(data) {
    }
    $scope.placeChanged = function () {
        $scope.patientinfo.Country = '';
        $scope.patientinfo.State = '';
        $scope.patientinfo.CityTown = '';
        $scope.patientinfo.Location = '';
        $scope.state = false;
        $scope.latlngStatus = true;
        $scope.patientinfo.CityTown = '';
        $scope.place = this.getPlace();
        var lat_val = $scope.place.geometry.location.lat();
        var lng_val = $scope.place.geometry.location.lng();
        $scope.patientinfo.Longitude = lng_val.toString();
        $scope.patientinfo.Latitude = lat_val.toString();
        angular.forEach($scope.place.address_components, function (place) {
            angular.forEach(place.types, function (item) {
                var exitLoop = false;
                if (item === "country") {
                    $scope.countryval = place.short_name;
                }
                $scope.changecountry();
                setTimeout(function () {
                    if (item === "administrative_area_level_1") {
                        angular.forEach($scope.stateValues, function (item) {
                            if (!exitLoop) {
                                if (item.StateID === place.short_name) {
                                    $scope.stateval = place.short_name;
                                    $scope.state = false;
                                    exitLoop = true;
                                } else {
                                    $scope.state = true;
                                }
                            }
                        });
                    }
                    $scope.changeState();
                }, 50);
                setTimeout(function () {
                    if (item === "administrative_area_level_2") {
                        angular.forEach($scope.cityValues, function (item) {
                            if (item.CityIDDesc === place.short_name) {
                                window.dispatchEvent(new Event('resize'));
                            }
                        });
                    }
                    $scope.changecitytown();
                }, 100);
                setTimeout(function () {
                    if (item === "sublocality_level_1") {
                        angular.forEach($scope.locationValues, function (locationitem) {
                            if (locationitem.LocationIDDesc === place.short_name) {
                                window.dispatchEvent(new Event('resize'));
                                $scope.patientinfo.Location = locationitem.LocationIDDesc;
                                document.getElementById('Location').value = locationitem.LocationID;
                            }
                        });
                    }
                }, 50);
            });
        });
    };
    $scope.getDate = function (Tmpfromdate) {
        if (Tmpfromdate != "") {
            $scope.BSMSind1 = true;
            //$scope.BSMSind = true;
            $scope.patientinfo.BSMSind = true;
        }
        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0) {
            fromdate.setMonth(m[1] + 1, 0);
            ddiff = fromdate.getDate() - d[1] + d[0];
            --mdiff;
        }
        if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
        if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
        if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
        $scope.ageinYears = ydiff.toString();
        $scope.ageinMonths = mdiff.toString();
        $scope.ageinDays = ddiff.toString();
        if ($scope.ageinMonths === "-1") {
            $scope.ageinMonths = "";
        }
        var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
        $scope.patientinfo.CurrentAge = curAge;
    };
    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
    $scope.setAgeandMonth = function (year, month, days) {
        $scope.ageinYears = year;
        $scope.ageinMonths = month;
        $scope.ageinDays = days;
        if ($scope.ageinYears != "") {
            $scope.patientinfo.BSMSind = false;
        }
        var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
        $scope.patientinfo.CurrentAge = curAge;
        var dob = $scope.getDateOfBirth($scope.ageinYears, $scope.ageinMonths, $scope.ageinDays);
        // $scope.patientinfo.dob = moment(dob).format('DD-MMM-YYYY');
        $scope.patientinfo.dob = moment(dob).format('MM-DD-YYYY');
        daysInMonth(month, year);
    };
    $scope.openPopup = function () {
        $('#myModal').modal('show');
        $scope.tabno = 1;
        $scope.photoTaken = false;
        $scope.myImage = '';
        document.getElementById("fileInput").value = "";
        $scope.openset = false;
    };
    $scope.clearImg = function () {
        $scope.myImage = '';
        document.getElementById("fileInput").value = "";
        $scope.browseOpenSet = true;
    };


    $scope.hsptlId = userLoginDetails.HospitalID;
    $scope.closeSuccessPopup = function () {
        var url = "/op";
        $location.url(url);
        $scope.Registeraddpopup = false;
    };
    $scope.SearchByText = function (SearchBy) {
        var name = SearchBy;
        if (name === "") {
            $scope.patients = [];
            return;
        } else {
            var params = { "PageSize": 30, "DoctorID": "", "PageNumber": 1, "SearchText": SearchBy };
            params.DoctorID = eHnoteMasterDataService.getLoginId();
            params.loaderStatus = false;
            eHnotePatientDataService.SearchPatient(params, OnGetSearchPatientSuccess, OnGetPatientError);
        }
    };
    function OnGetSearchPatientSuccess(data) {
        var patients = [];
        var patientsdata = data.rows;
        $scope.patients = patientsdata;
    }
    function OnGetPatientError(data) {
    }
    function InitialiseSearchParam() {
        $scope.patients = [];
        $scope.morepatientdata = true;
        prevpagno = 0;
        pageno = 0;
        $scope.pageno = 1;
    }

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined &&
        doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        hospcode = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.openFamilyDetails = true;

    }
    $scope.membershipChange = function () {
        $scope.patientinfo.membership = $scope.patientinfo.membership;
    };
    $scope.SubValue = function (sourcevalue) {
        $scope.SubSourcevalueid = sourcevalue;
        $scope.patientinfo.SubValue = $scope.SubSourcevalueid;
        alert($scope.patientinfo.SubValue);
    };
    $scope.SourceChange = function (sourceid) {
        angular.forEach($scope.ReferralList, function (desc) {
            if (sourceid === desc.ReferralTitle) {
                $scope.Refvalue = desc.ReferralID;
            }
        });
        if (sourceid === '' || sourceid === undefined || sourceid === 'OTHERS') {
            $scope.SubSource = "";
            $scope.subSourceList = "";
            return;
        }
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "HospitalCD": $scope.HospitalCD,
            "USRType": "DOCTOR",
            "CatagoryID": parseInt($scope.Refvalue),
            "PageSize": 100,
            "PageNumber": 1,
            "USRId": doctorinfo.doctorid
        };
        eHnoteOrgReferralDataServices.listSubVisitReferral(params, listSubSourceSuccess, listSubSourceError);
        $scope.patientinfo.Refvalue = sourceid;
        function listSubSourceSuccess(data) {
            if (data.status !== "failure") {
                var tmp = [];
                $scope.SubSourcevalueid = "";
                $scope.patientinfo.SubValue = 0;
                $scope.SubSource = "";
                for (var i in data.response.rows) {
                    if (data.response.rows[i].ActiveIND === "Y") {
                        tmp.push(data.response.rows[i]);
                    }
                }
                $scope.subSourceList = tmp;
            } else {
                $scope.SubSource = "";
                $scope.subSourceList = "";
            }
        }
        function listSubSourceError(data) {
        }
    };

    $scope.startConsultation = function () {

        $scope.Registeraddpopup = false;

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentinfo.PatientDetails = $scope.AddedPatientData.Patient[0];
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);


        $scope.cacheStorageItem.PatientName = $scope.AddedPatientData.Patient[0].FullName;
        $scope.cacheStorageItem.patientid = $scope.AddedPatientData.Patient[0].PatientID;
        $scope.cacheStorageItem.PatientID = $scope.AddedPatientData.Patient[0].PatientID;
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.AppointmentStatus = "";
        $scope.cacheStorageItem.PatientTypeId = $scope.AddedPatientData.Patient[0].PatientTypeId;
        $scope.cacheStorageItem.PatientDisplayId = $scope.AddedPatientData.Patient[0].ClinicPreference.PatientDisPlayID;

        $scope.cacheStorageItem.UserFreqData = $scope.DocFreqItems;
        $scope.cacheStorageItem.PatientInvestigationTemplates = [];
        $scope.cacheStorageItem.SelectedConsultationType = 'New';
        eHnoteMasterDataService.addpatientData($scope.AddedPatientData.Patient[0]);

        $scope.cacheStorageItem.masterChiefComplaintsArray = [];
        $scope.cacheStorageItem.masterClinicalNotesArray = [];
        $scope.cacheStorageItem.masterObservationsArray = [];
        $scope.cacheStorageItem.masterDiagnosisArray = [];
        $scope.cacheStorageItem.masterProceduresArray = [];
        $scope.cacheStorageItem.masterMedicinesArray = [];
        $scope.cacheStorageItem.masterLabTestArray = [];
        $scope.cacheStorageItem.masterInvestigationsArray = [];
        $scope.cacheStorageItem.masterInvCategoriesArray = [];
        $scope.cacheStorageItem.masterMedicineTemplatesArray = [];
        $scope.cacheStorageItem.masterPrescriptionFrequencies = [];

        var mObj = datapersistanceFactory.getItem("masterDataArrays");


        $scope.cacheStorageItem.masterChiefComplaintsArray = angular.copy(mObj.masterChiefComplaintsArray);
        $scope.cacheStorageItem.masterClinicalNotesArray = angular.copy(mObj.masterClinicalNotesArray);
        $scope.cacheStorageItem.masterObservationsArray = angular.copy(mObj.masterObservationsArray);
        $scope.cacheStorageItem.masterDiagnosisArray = angular.copy(mObj.masterDiagnosisArray);
        $scope.cacheStorageItem.masterProceduresArray = angular.copy(mObj.masterProceduresArray);
        $scope.cacheStorageItem.masterMedicinesArray = angular.copy(mObj.masterMedicinesArray);
        $scope.cacheStorageItem.masterLabTestArray = angular.copy(mObj.masterLabTestArray);
        $scope.cacheStorageItem.masterInvestigationsArray = angular.copy(mObj.masterInvestigations);
        $scope.cacheStorageItem.masterInvCategoriesArray = angular.copy(mObj.masterInvCategories);
        $scope.cacheStorageItem.masterMedicineTemplatesArray = angular.copy(mObj.masterMedicineTemplatesArray);
        $scope.cacheStorageItem.masterPrescriptionFrequencies = angular.copy(mObj.PrescriptionFrequencies);

        $scope.referredappointmentdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
        var appointdate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        var daycd = $filter('date')(new Date($scope.referredappointmentdate), "EEE");
        var starttime = $scope.Current_patinet_appStarttime;
        var endtime = $scope.Current_patinet_appEndtime;
        daycd = daycd.toUpperCase();
        var appointmenttype = "4";
        var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

        eHnotePatientDataService.AddPatientAppointmentImmediate(starttime, endtime, doctorinfo.doctorid, daycd, appointdate, $scope.cacheStorageItem.patientid, OnAddApointmentSuccess, OnAddApointmentError, appointmenttype);


        function OnAddApointmentSuccess(data) {

            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentinfo.AppointmentID = data.response.AppointmentID;
            appointmentinfo.DoctorName = data.response.DoctorName;
            appointmentinfo.DoctorSpecialization = data.response.DoctorSpecialization;
            appointmentinfo.DoctorDesignation = data.response.Designation;
            appointmentinfo.PatientID = $scope.AddedPatientData.Patient[0].PatientID;
            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);

            var BranchArea = "";
            updatebranchesToappointmentInfo(data.response.BranchName, data.response.BranchMobile, data.response.BranchEmail, data.response.DoctorEmailId, data.response.DoctorName, data.BranchId, data.response.DoctorID, BranchArea);

            $scope.cacheStorageItem.appointmentid = data.response.AppointmentID;
            $scope.cacheStorageItem.AppointmentDt = data.response.ConsultationDt;
            $scope.cacheStorageItem.AppointmentDoctorID = data.response.DoctorID;

            $scope.cacheStorageItem.TreatmentPlanId = 0;
            $scope.cacheStorageItem.ConsultationID = 0;

            $scope.cacheStorageItem.IsNewConsultation = true;
            $scope.cacheStorageItem.IsEditConsultation = false;
            $scope.cacheStorageItem.IsFollowupConsultation = false;

            $scope.checkInObj = {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "AppointmentId": "",
                "CheckInStatus": "",
                "VisitReason": ""
            };
            $scope.checkInObj.CheckInStatus = 'Y';
            $scope.checkInObj.AppointmentId = $scope.cacheStorageItem.appointmentid;
            eHnoteUserAppointmentDataService.UpdateCheckInStatus($scope.checkInObj, onsuccess, onerror);
            function onsuccess(resp) {
                if (resp.PatientDisplayId !== '') {
                    $scope.Main = {};
                    $scope.Main.DisplayID = resp.PatientDisplayId;
                }
            }
            function onerror(error) {
                console.log(error);
            }

            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

            var url = "";
            if ($scope.SpecializationId === 2) {
                url = "/dentalConsultation";
            } else {
                url = "/NewOpthaConsultation";
            }

            $location.url(url);


        }
        function OnAddApointmentError(err) {
            console.log(err);
            $scope.SelectedPatientDetails = {};
        }
        return false;
    };

    function updatebranchesToappointmentInfo(branchName, branchMobile, branchEmail, DoctorEmail, DoctorName, BranchId, DoctorId, BranchArea) {
        var appInfo = eHnoteMasterDataService.getAppointmentInfo();
        appInfo.BranchName = branchName;
        appInfo.BranchEmail = branchEmail;
        appInfo.BranchMobile = branchMobile;
        appInfo.DoctorEmail = DoctorEmail;
        appInfo.DoctorName = DoctorName;
        appInfo.BranchId = BranchId;
        appInfo.DoctorId = DoctorId;
        appInfo.BranchArea = BranchArea || "";
        eHnoteMasterDataService.addAppointmentInfo(appInfo);
    }
    function bindDoctorSlot() {

        var currenttimewithZero = 0;
        var count = 0;
        var hourStartCount = moment().format('HH');
        var minutesStartCount = moment().format('mm');
        var MinPerCaseval = doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase || 5;

        $scope.setValue = [];

        hourStartCount = parseInt(hourStartCount);
        minutesStartCount = parseInt(minutesStartCount);
        for (var i = hourStartCount; i <= 23; i++) {
            count = 0;
            var hr = i < 10 ? '0' + i : i;
            var minutesCount = (60 / parseInt(MinPerCaseval)) + 1;
            if (minutesStartCount > 0 && i === hourStartCount) {
            } else {
                $scope.setValue.push({ startTime: hr + ':00' });
                currenttimewithZero++;
            }
            if (minutesStartCount > parseInt(MinPerCaseval)) {
                minutesStartCount = minutesStartCount - parseInt(MinPerCaseval);
            } else if (minutesStartCount <= parseInt(MinPerCaseval)) {
                minutesStartCount = 0;
                if (currenttimewithZero === 0)
                    $scope.setValue.push({ startTime: hr + ':00' });
                currenttimewithZero++;
            }
            for (var j = 0; j <= minutesCount; j++) {
                count = count + MinPerCaseval;
                if (count < 60 && count > minutesStartCount) {
                    var minute = count < 10 ? '0' + count : count;
                    $scope.setValue.push({ startTime: hr + ':' + minute });
                }
            }
        }



        var startTime = moment($scope.setValue[0].startTime, 'HH:mm');

        var startTimeval = "";
        var endtime = "";
        startTimeval = angular.copy(startTime);
        if (MinPerCaseval >= 60) {
            startTimeval.add(1, 'h');
            endtime = startTimeval.format("HH:mm");
        } else {
            startTimeval.add(MinPerCaseval, 'm');
            endtime = startTimeval.format("HH:mm");
        }

        $scope.Current_patinet_appStarttime = moment(startTime).format('HH:mm');
        $scope.Current_patinet_appEndtime = moment(endtime, 'HH:mm').format('HH:mm');
    }
    $scope.PageName = "book";
    $scope.bookAppointment = function () {
        $scope.PageName = "book";
        $rootScope.appointment_type = "12";
        $scope.Registeraddpopup = false;
        SetupPopUp = $uibModal.open({
            "templateUrl": 'appointMentPopupId1.html',
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "inventory-full-popup"
        });
    };
    $scope.closeBookAppPopup = function () {
        var url = "/op";
        $location.url(url);
    };
    $scope.onCountryChange = function (item) {
        $scope.patientinfo.Country = item.Name;
        $scope.patientinfo.CountryId = item.Id;
    };


    $scope.onCityChange = function (item) {
        $scope.patientinfo.CityTown = item.CityName || "";
        $scope.patientinfo.CityId = item.CityId;
        eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.patientList = resp.data;
                $scope.patientinfo.State = $scope.patientList[0].StateName;
                $scope.patientinfo.StateId = $scope.patientList[0].StateId;
                $scope.patientinfo.Country = $scope.patientList[0].CountryName;
                $scope.patientinfo.CountryId = $scope.patientList[0].CountryId;
            }
        });
        $scope.locationsArray = [];
        eHnoteSettingsDataService.getLocationsByCityId(item.CityId).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.locationsArray = resp.data;
            }
        });
        $scope.patientinfo.Street = "";
        $scope.patientinfo.Location = "";
    };

    $scope.GetAreaSearch = function (text) {
        text = text || "";
        return eHnoteSettingsDataService.GetAreaSearch(text).then(function (response) {
            if (response.data !== undefined) {
                return response.data;
            }
        });

    };
    $scope.onAreaChange = function (item) {
        $scope.patientinfo.Location = item.LocationName;
        $scope.patientinfo.LocationId = item.LocationId;
        $scope.patientinfo.CityTown = item.CityName;
        $scope.patientinfo.CityId = item.CityId;
        $scope.patientinfo.State = item.StateName;
        $scope.patientinfo.StateId = item.StateId;
        $scope.patientinfo.CountryId = item.CountryId;
        $scope.patientinfo.Country = item.CountryName;
        $scope.patientinfo.PinCode = item.PinCode ? item.PinCode : "";
    };

    $scope.onStateChange = function (item) {
        $scope.patientinfo.State = item.Name;
        $scope.patientinfo.StateId = item.StateId;
    };
    $scope.onReferralChange = function (refid) {
    };

    $scope.category = function (item) {
        $scope.selectedPatientType = item.patienttypeId;
        $scope.selectedPatientTypeName = item.PatientType;
    }


    $scope.referralTitle = "";

    $scope.IsbindindData = false;

    $scope.closeAddRefpopup = function () {
        $scope.addRefferelPopup = false;
        $scope.referralTitle = "";
    };


    $scope.getPatientExistingList = function (patientInfo) {

        if (patientInfo.patientPhone[0].PhNumber !== undefined) {
            eHnotePatientDataService.GetCheckPatientList(patientInfo.firstname, patientInfo.lastname, patientInfo.patientPhone[0].PhNumber, parenthospid).then(function (resp) {
                $scope.PatientExistingList = resp.data;
                if ($scope.PatientExistingList[0].PatientId > 0) {
                    alertify.error("This Patient is Already Exist");
                }
            });
        }
    };

    $scope.ChangeGenderByTitle = function (item) {
        if (item === "Mr" || item === "Master") {
            $scope.patientinfo.gender = 'Male';
        }
        else if (item === "Mrs" || item === "Miss" || item === "Baby" || item === 'Ms') {
            $scope.patientinfo.gender = 'Female';
        }
        else {
            $scope.patientinfo.gender = "";
        }
    };

    $scope.BillingPopup = function () {
        $scope.Registeraddpopup = false;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentinfo.PatientDetails = $scope.AddedPatientData.Patient[0];
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        $scope.cacheStorageItem.PatientName = $scope.AddedPatientData.Patient[0].FullName;
        $scope.cacheStorageItem.patientid = $scope.AddedPatientData.Patient[0].PatientID;
        $scope.cacheStorageItem.PatientID = $scope.AddedPatientData.Patient[0].PatientID;
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.AppointmentStatus = "";
        $scope.cacheStorageItem.PatientTypeId = $scope.AddedPatientData.Patient[0].PatientTypeId;
        $scope.cacheStorageItem.PatientDisplayId = $scope.AddedPatientData.Patient[0].ClinicPreference.PatientDisPlayID;
        $scope.cacheStorageItem.UserFreqData = $scope.DocFreqItems;
        $scope.cacheStorageItem.PatientInvestigationTemplates = [];
        $scope.cacheStorageItem.SelectedConsultationType = 'New';
        eHnoteMasterDataService.addpatientData($scope.AddedPatientData.Patient[0]);
        $scope.referredappointmentdate = $filter('date')(new Date(), "dd-MMMM-yyyy");
        var appointdate = $filter('date')(new Date($scope.referredappointmentdate), "yyyy-MM-dd");
        var daycd = $filter('date')(new Date($scope.referredappointmentdate), "EEE");
        var starttime = $scope.Current_patinet_appStarttime;
        var endtime = $scope.Current_patinet_appEndtime;
        daycd = daycd.toUpperCase();
        var appointmenttype = "4";
        var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        var parenthospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        var url = "";
        url = "/Pastvisit";
        $location.url(url);
        $timeout(function () {
            $rootScope.$broadcast("ShowBillingTab", true);
        }, 300);

    }

    $scope.navtoUploadDocuments = function () {
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentinfo.PatientDetails = $scope.AddedPatientData.Patient[0];
        appointmentinfo.PatientID = $scope.AddedPatientData.Patient[0].PatientID;
        appointmentinfo.CaptureBillingFrom = "RegisterPatient";
        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        $scope.cacheStorageItem.PatientName = $scope.AddedPatientData.Patient[0].FullName;
        $scope.cacheStorageItem.patientid = $scope.AddedPatientData.Patient[0].PatientID;
        $scope.cacheStorageItem.PatientID = $scope.AddedPatientData.Patient[0].PatientID;
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.AppointmentStatus = "";
        $scope.cacheStorageItem.PatientTypeId = $scope.AddedPatientData.Patient[0].PatientTypeId;
        $scope.cacheStorageItem.PatientDisplayId = $scope.AddedPatientData.Patient[0].ClinicPreference.PatientDisPlayID;
        $scope.cacheStorageItem.UserFreqData = $scope.DocFreqItems;
        $scope.cacheStorageItem.PatientInvestigationTemplates = [];
        $scope.cacheStorageItem.SelectedConsultationType = 'New';
        eHnoteMasterDataService.addpatientData($scope.AddedPatientData.Patient[0]);

        $location.url("/appointmentFileUploads");
    }

    $scope.dynamicPopover = {
        templateUrl: 'patientInsuranceFiles.html'
    };

    $scope.patients = [];
    $scope.ClearpatientSearch = function () {
        $scope.DefaultShowDetails = false;
        $scope.patients = [];
        $scope.mobilenumber = "";
        $scope.ageinYears = "";
        $scope.ageinMonths = "";
        $scope.ShowSearchAndClear = true;
        $scope.patientinfo = {
            "title": "Mr",
            "firstname": "",
            "PatientHomeCode": "",
            "PatientHomeNumber": "",
            "PatientOfficeCode": "",
            "PatientOfficeNumber": "",
            "lastname": "",
            "BloodGroup": "",
            "BloodGroupObj": "",
            "BloodGroupId": "",
            "CurrentAge": "",
            "vipFlag": "N",
            "mobileNumber": "",
            "landlineNumber": "",
            "emailid": "",
            "phType": "M",
            "phStdCD": "",
            "phAreaCD": '+91',
            "gender": 'Male',
            "dob": "",
            "AlternatePhoneNo": "",
            "AlternateLandLine": "",
            "emgymobilenumber": "",
            "emgyrelationship": "",
            "emgyalternatenumber": "",
            "emgyname": "",
            "emgytitle": "Mr",
            "othDetailmaritalstatus": "",
            "othDetailmaritalstatusObj": "",
            "othDetailmaritalstatusId": "",
            "othDetaileducation": "",
            "othDetailoccupation": "",
            "othDetailreferralsource": "",
            "othrDetailNotes": "",
            "referralSource": "",
            "patientPhone": [
                //{
                //    "PhAreaCD": '',
                //    "PhCntryCD": $scope.currencyCode === 'AED' ? "971" : "91",
                //    "PhNumber": "",
                //    "PhType": "H",
                //    "PrimaryIND": "Y",
                //    "PhStateCD": '',
                //    "ContactNo": ""
                //}
            ],
            "patientAddress": [],
            "familyRelation": "",
            "Refvalue": 0,
            "SubValue": 0,
            "AdharNo": "",
            "PanNo": "",
            "PassportNo": "",
            "Nationality": "",
            "NationalityObj": "",
            "NationalityId": "",
            "Visastatus": "",
            "InsuranceObj": "",
            "InsuranceCompanyId": 0,
            "OrgInsuranceTpaId": 0,
            "PaymentType": "Cash",
            "TPAId": 0,
            "TPAName": "",
            "InsurancePolicyNo": "",
            "StartDate": "",
            "EndDate": "",
            "InsuranceDocument": "",
            "SumInsured": 0,
            "DocumentTypeId": "",
            "DocumentObj": "",
            "TempImagesArray": [],
            "TempImagesArray1": [],
            "TempImagesArray2": [],
            "TempPdfArray": [],
            "emgyCntryCode": "91",
            "Address2": "",
            "LandMark": "",
            "PrimaryIND": "Y",
            "Latitude": "",
            "Address1": "",
            "DistrictRegion": "",
            "Longitude": "",
            "PinCode": "",
            "State": "",
            "StateId": "",
            "Street": "",
            "Country": "",
            "CountryId": "",
            "AddressType": "",
            "CityTown": "",
            "CityId": "",
            "Location": "",
            "SendPatientEmail": false,
            "BSMSind": "",
            "membership": "",
            "doctorid": eHnoteMasterDataService.getLoginId(),
            "MedicalHistory": $scope.MasterMedicalHistory,
            "Allergies": $scope.MasterAllergies,
            "Language": [],
            "FamilyHistory": $scope.MasterFamilyHistory,
            "BirthHistory": $scope.MasterBirthHistory,
            "NutritionalHistory": $scope.MasterNutritionalHistory,
            "ImmunisationHistory": $scope.MasterImmunisationHistory,
            "SurgicalHistory": $scope.MasterSurgicalHistory,
            "MenstrualHistory": $scope.MasterMenstrualHistory,
            "LifestyleHistory": $scope.MasterLifestyleHistory,
            "ReferralMobileNo": "",
            "ReferralContactNo": "",
            "ReferralPhoneType": 'Mobile',
            "TitleId": "",
            "Selectedtitle": $scope.SelectedTitle,
            "AlternateType": 'Mobile',
            "FamilyPatientId": "",
            "FamilyRelationShipId": ""
        };

        angular.forEach($scope.patientinfo.MedicalHistory, function (item) {
            item.IsSelected = false;
            item.Duration = "";
            item.DurationType = "D";
            item.DurationTypeName = "Day(s)";
            item.DurationDate = "";
            item.ShowDateFormat = false;
        });
        angular.forEach($scope.patientinfo.FamilyHistory, function (item) {
            item.IsSelected = false;
            item.RelationShipId = "";
            item.RelationShipName = "";
        });
        angular.forEach($scope.patientinfo.Allergies, function (item) {
            item.IsSelected = false;
        });
        angular.forEach($scope.patientinfo.languagesspoken, function (item) {
            item.IsSelected = false;

        });
    };
    $scope.ChangepatientSearch = function () {
        $scope.patients = [];
        $scope.FamilypatientsList = [];
        $scope.ageinYears = "";
        $scope.ageinMonths = "";
        $scope.ShowSearchAndClear = true;
        $scope.patientinfo = {
            "title": "Mr",
            "firstname": "",
            "PatientHomeCode": "",
            "PatientHomeNumber": "",
            "PatientOfficeCode": "",
            "PatientOfficeNumber": "",
            "lastname": "",
            "BloodGroup": "",
            "BloodGroupObj": "",
            "BloodGroupId": "",
            "CurrentAge": "",
            "vipFlag": "N",
            "mobileNumber": "",
            "landlineNumber": "",
            "emailid": "",
            "phType": "M",
            "phStdCD": "",
            "phAreaCD": '+91',
            "gender": 'Male',
            "dob": "",
            "emgymobilenumber": "",
            "emgyrelationship": "",
            "emgyalternatenumber": "",
            "emgyname": "",
            "emgytitle": "Mr",
            "othDetailmaritalstatus": "",
            "othDetailmaritalstatusObj": "",
            "othDetailmaritalstatusId": "",
            "othDetaileducation": "",
            "othDetailoccupation": "",
            "othDetailreferralsource": "",
            "othrDetailNotes": "",
            "referralSource": "",
            "patientPhone": [
                //{
                //    "PhAreaCD": '',
                //    "PhCntryCD": $scope.currencyCode === 'AED' ? "971" : "91",
                //    "PhNumber": "",
                //    "PhType": "H",
                //    "PrimaryIND": "Y",
                //    "PhStateCD": '',
                //    "ContactNo": ""
                //}
            ],
            "patientAddress": [],
            "familyRelation": "",
            "Refvalue": 0,
            "SubValue": 0,
            "AdharNo": "",
            "PanNo": "",
            "PassportNo": "",
            "Nationality": "",
            "NationalityObj": "",
            "NationalityId": "",
            "Visastatus": "",
            "InsuranceObj": "",
            "InsuranceCompanyId": 0,
            "TPAId": 0,
            "TPAName": "",
            "InsurancePolicyNo": "",
            "StartDate": "",
            "EndDate": "",
            "InsuranceDocument": "",
            "SumInsured": 0,
            "DocumentTypeId": "",
            "DocumentObj": "",
            "TempImagesArray": [],
            "TempImagesArray1": [],
            "TempImagesArray2": [],
            "TempPdfArray": [],
            "emgyCntryCode": "91",
            "Address2": "",
            "LandMark": "",
            "PrimaryIND": "Y",
            "Latitude": "",
            "Address1": "",
            "DistrictRegion": "",
            "Longitude": "",
            "PinCode": "",
            "State": doctorinfo.doctordata.UserAddress[0].StateName,
            "StateId": doctorinfo.doctordata.UserAddress[0].StateId,
            "Street": "",
            "Country": doctorinfo.doctordata.UserAddress[0].CountryName,
            "CountryId": doctorinfo.doctordata.UserAddress[0].CountryId,
            "AddressType": "",
            "CityTown": "",
            "CityId": "",
            "Location": "",
            "SendPatientEmail": false,
            "BSMSind": "",
            "membership": "",
            "doctorid": eHnoteMasterDataService.getLoginId(),
            "MedicalHistory": $scope.MasterMedicalHistory,
            "Allergies": $scope.MasterAllergies,
            "Language": $scope.patientinfo.languagesspoken,
            "FamilyHistory": $scope.MasterFamilyHistory,
            "BirthHistory": $scope.MasterBirthHistory,
            "NutritionalHistory": $scope.MasterNutritionalHistory,
            "ImmunisationHistory": $scope.MasterImmunisationHistory,
            "SurgicalHistory": $scope.MasterSurgicalHistory,
            "MenstrualHistory": $scope.MasterMenstrualHistory,
            "LifestyleHistory": $scope.MasterLifestyleHistory,
            "ReferralMobileNo": "",
            "ReferralContactNo": "",
            "ReferralPhoneType": 'Mobile',
            "TitleId": "",
            "Selectedtitle": $scope.SelectedTitle,
            "AlternateType": 'Mobile',
            "FamilyPatientId": "",
            "FamilyRelationShipId": "",
            "SearchText": ""
        };
    };
    $scope.changeMobileNumber = function (mobilenumber) {
        if (mobilenumber !== undefined) {
            if (mobilenumber.length === 10) {
                var param = {
                    "PageSize": 30,
                    "Sort": "asc",
                    "hasparam": true,
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "DoctorID": eHnoteMasterDataService.getLoginId(),
                    "PageNumber": 1,
                    "HospitalCD": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode,
                    "loaderStatus": false,
                    "PhoneNumber": mobilenumber,
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
                };
                eHnotePatientDataService.SearchOnlyPatient(param, OnGetPatientSuccess, OnGetPatientError1);

            } else {
                $scope.patients = [];
                $scope.patientinfo.PhoneType = "Mobile";
            }
        }

    };


    $scope.changeMasterMobileNumber = function (mobilenumber) {
        if (mobilenumber !== undefined) {
            if (mobilenumber.length === 10) {
                var param = {
                    "PageSize": 30,
                    "PageNumber": 1,
                    "PhoneNumber": mobilenumber,
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
                };
                eHnotePatientDataService.SearchMasterPatient(param, OnGetPatientSuccess, OnGetPatientError1);

            } else {
                $scope.patients = [];
                $scope.patientinfo.PhoneType = "Mobile";
                $scope.ShowAddNew = false;
                $scope.DefaultShowDetails = false;
                $scope.ChangepatientSearch();
            }
        }

    };
    function OnGetPatientSuccess(data) {
        $scope.showloading = false;
        if (data.count > 0) {
            $scope.patients = data.rows;

            $scope.ShowpatientsDetails = true;
            $scope.ShowAddNew = true;

        } else {
            if ($scope.patients.length === 0) {
                $scope.patientinfo.MobileNumber = $scope.mobilenumber || "";
                $scope.ShowAddNew = true;
                $scope.ShowpatientsDetails = false;
            } else {
                $scope.patientinfo.MobileNumber = "";
            }
        }


    }
    function OnGetPatientError1(data) {
        $scope.showloading = false;
        alertify.log("Error");
    }
    $scope.patientinfo.SearchText = "";

    $scope.ShowSearchAndClear = true;
    $scope.SelectPatient = function (patientitem, type) {
        $scope.patientinfo.PatientInsuranceDetailsArray = [];
        $scope.DefaultShowDetails = true;
        $scope.ShowpatientsDetails = false;

        if (type === 1) {
            eHnoteAuditServices.getPatientDetailsById(patientitem.Patient[0].PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    patientitem = data;

                    $scope.AddedPatientData = [];
                    datacookieFactory.set('patientData', patientitem);

                    var tmpPatId = 0;
                    $scope.patID = patientitem.Patient[0].PatientID;
                    tmpPatId = patientitem.Patient[0].PatientID;
                    $scope.showloading = false;
                    if (patientitem !== null && patientitem.Patient !== null && patientitem.Patient.length > 0) {
                        $scope.newpatient = patientitem;
                        $scope.AddedPatientData = patientitem;
                        eHnoteValidateUsersDataService.RemoveProcessingCookies();
                        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    }


                    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                    cacheStorageItem.patientid = patientitem.Patient[0].PatientId;
                    cacheStorageItem.EmailID = patientitem.PatientEmail ? patientitem.PatientEmail[0].EmailId : '';
                 

                    cacheStorageItem.CountryCode = patientitem.Patient ? patientitem.Patient[0].PatientHomeCode : '';
                    cacheStorageItem.PhoneNumber = patientitem.Patient ? patientitem.Patient[0].PatientHomeNumber : '';

                    cacheStorageItem.PatientTypeId = patientitem.Patient[0].PatientTypeId;
                    eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);

                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    var clinicAddress = {
                        "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID
                    };
                    var doctorID = {
                        "DoctorID": doctorinfo.doctorid
                    };
                    if (doctorinfo.RoleID === 4 || doctorinfo.RoleID === 43) {
                        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                        eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
                    } else if (doctorinfo.RoleID === 1) {
                        eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
                    }

                    //bindDoctorSlot();
                    $scope.ageinYears = patientitem.Patient[0].AgeInYears;
                    $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
                    patientitem.Patient[0].PatientHomeNumber = patientitem.Patient[0] ? patientitem.Patient[0].PatientHomeNumber === 0 ? '' : patientitem.Patient[0].PatientHomeNumber : "";
                    if (patientitem.Patient.length > 0) {
                        var number = patientitem.Patient[0].PatientHomeNumber.toString();
                        number = number.slice(0, 3) + '-' + number.slice(3, 6) + '-' + number.substring(6, 10);;
                        patientitem.Patient[0].TempPhNumber = number;
                    }
                  
                    if (patientitem.Patient[0].AlternatePhoneNo === 0) {
                        patientitem.Patient[0].AlternatePhoneNo = "";
                    }
                    if (patientitem.Patient[0].AlternateLandLine === 0) {
                        patientitem.Patient[0].AlternateLandLine = "";
                    }

                    if (patientitem.Patient[0].AlternatePhoneNo != "" || patientitem.Patient[0].AlternatePhoneNo != 0) {
                        $scope.altertype = "1";
                    }
                    if (patientitem.Patient[0].AlternateLandLine != "" || patientitem.Patient[0].AlternateLandLine != 0) {
                        $scope.altertype = "2";
                    }

                    if (patientitem.Patient[0].TitleId !== "") {
                        $scope.SelectedTitle = $filter("filter")($scope.TitlesList, { "Id": patientitem.Patient[0].TitleId })[0];
                    } else {
                        $scope.SelectedTitle = $scope.TitlesList[0];
                    }
                    var altPhoneNo = "", altLandline = "";
                    if (patientitem.Patient[0].AlternatePhoneNo) {
                        altPhoneNo = patientitem.Patient[0].AlternatePhoneNo.toString();
                    }
                    if (patientitem.Patient[0].AlternateLandLine) {
                        altLandline = patientitem.Patient[0].AlternateLandLine.toString();
                    }

                    $scope.SelectedBillingCategoryType = patientitem.Patient[0].PatientTypeName;
                    $scope.SelectedBillingCategoryTypeId = patientitem.Patient[0].PatientTypeId;
                    var StateName = doctorinfo.doctordata.UserAddress[0].StateName;
                    var StateId = doctorinfo.doctordata.UserAddress[0].StateId;
                    var CountryName = doctorinfo.doctordata.UserAddress[0].CountryName;
                    var CountryId = doctorinfo.doctordata.UserAddress[0].CountryId;

                    if (patientitem.PatientAddress != undefined) {
                        if (patientitem.PatientAddress.length > 0) {
                            if (patientitem.PatientAddress[0].StateName !== null) {
                                StateName = patientitem.PatientAddress[0].StateName;
                            }
                            if (patientitem.PatientAddress[0].State !== null) {
                                StateId = patientitem.PatientAddress[0].State;
                            }
                            if (patientitem.PatientAddress[0].CountryName !== null) {
                                CountryName = patientitem.PatientAddress[0].CountryName;
                            }

                            if (patientitem.PatientAddress[0].Country !== null) {
                                CountryId = patientitem.PatientAddress[0].Country;
                            }

                        }
                    }

             

                    $scope.patientinfo = {
                        "patientId": patientitem.Patient[0].PatientId,
                        "title": patientitem.Patient[0].Title || "",
                        "firstname": patientitem.Patient[0].FirstName,
                        "PatientHomeCode": patientitem.Patient[0] ? patientitem.Patient[0].PatientHomeCode === 0 ? '' : patientitem.Patient[0].PatientHomeCode : "",
                        "PatientHomeNumber": patientitem.Patient[0] ? patientitem.Patient[0].PatientHomeNumber === 0 ? '' : patientitem.Patient[0].PatientHomeNumber : "",
                        "mobileNumber": patientitem.Patient[0] ? patientitem.Patient[0].PatientHomeNumber === 0 ? '' : patientitem.Patient[0].PatientHomeNumber : "",
                        "PatientOfficeCode": patientitem.Patient[0] ? patientitem.Patient[0].PatientOfficeCode === 0 ? '' : patientitem.Patient[0].PatientOfficeCode : "",
                        "PatientOfficeNumber": patientitem.Patient[0] ? patientitem.Patient[0].PatientOfficeNumber === 0 ? '' : patientitem.Patient[0].PatientOfficeNumber : "",
                        "landlineNumber": patientitem.Patient[0] ? patientitem.Patient[0].PatientOfficeNumber === 0 ? '' : patientitem.Patient[0].PatientOfficeNumber : "",
                      
                        "lastname": patientitem.Patient[0].LastName || "",
                        "PatientTypeId": patientitem.Patient[0].PatientTypeId,
                        "BloodGroup": patientitem.PatientVitals[0].Vitals ? patientitem.PatientVitals[0].Vitals.BLG : "",
                        "BloodGroupObj": "",
                        "BloodGroupId": patientitem.PatientVitals[0].Vitals ? patientitem.PatientVitals[0].Vitals.BLGId : "",
                        "CurrentAge": patientitem.Patient[0].CurrentAge,
                        "vipFlag": "N",
                         "emailid": patientitem.PatientEmail[0].EmailId,
                        "phType": "M",
                        "phStdCD": patientitem.PatientPhone[0] ? patientitem.PatientPhone[0].PhCntryCD : "",
                        "phAreaCD": '+91',
                        "gender": patientitem.Patient[0].Gender,
                        "dob": patientitem.Patient[0].DOB,
                        "emgymobilenumber": patientitem.Patient[0].EmergencyInfo ? patientitem.Patient[0].EmergencyInfo.ContactNo : "",
                        "emgyrelationship": patientitem.Patient[0].EmergencyInfo ? patientitem.Patient[0].EmergencyInfo.Relation : "",
                        "emgyalternatenumber": "",
                        "emgyname": patientitem.Patient[0].EmergencyInfo ? patientitem.Patient[0].EmergencyInfo.Name : "",
                        "emgytitle": patientitem.Patient[0].EmergencyInfo ? patientitem.Patient[0].EmergencyInfo.Title : "",
                        "othDetailmaritalstatus": patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                        "othDetailmaritalstatusObj": "",
                        "othDetailmaritalstatusId": patientitem.Patient[0].PatientOtherDetails[0].MaritalStatusId || "",
                        "othDetaileducation": "",
                        "othDetailoccupation": "",
                        "othDetailreferralsource": patientitem.Patient[0].PatientOtherDetails[0].ReferralID || "",
                        "othDetailreferralsourceName": patientitem.Patient[0].PatientOtherDetails[0].ReferralName || "",
                        "MasterReferralSource": "",
                        "othrDetailNotes": patientitem.Patient[0].PatientOtherDetails[0].OccupationDescription || "",
                        "referralSource": "",
                        "IsPhysicallyChallenged": patientitem.Patient[0].IsPhysicallyChallenged || false,
                        "patientPhone": [
                            //{
                            //    "PhAreaCD": '',
                            //    "PhCntryCD": $scope.currencyCode === 'AED' ? "971" : "91",
                            //    "PhNumber": patientitem.PatientPhone[0] ? patientitem.PatientPhone[0].PhNumber.toString() : "",
                            //    "PhType": "H",
                            //    "PrimaryIND": "Y",
                            //    "PhStateCD": '',
                            //    "ContactNo": patientitem.PatientPhone[1] ? patientitem.PatientPhone[1].PhNumber.toString() : "",
                            //    "TempPhNumber": patientitem.PatientPhone[0] ? patientitem.PatientPhone[0].TempPhNumber.toString() : ""
                            //}
                        ],
                        "patientAddress": patientitem.patientAddress,
                        "familyRelation": "",
                        "Refvalue": 0,
                        "SubValue": 0,
                        "AdharNo": patientitem.Patient[0].PatientOtherDetails[0].IdentityDtls ? patientitem.Patient[0].PatientOtherDetails[0].IdentityDtls.AadharCardNo : "",
                        "PanNo": patientitem.Patient[0].PatientOtherDetails[0].IdentityDtls ? patientitem.Patient[0].PatientOtherDetails[0].IdentityDtls.PanCardNumber : "",
                        "PassportNo": "",
                        "Nationality": patientitem.Patient[0].PatientOtherDetails[0].Nationality || "",
                        "NationalityObj": "",
                        "NationalityId": patientitem.Patient[0].PatientOtherDetails[0].NationalityId || "",
                        "Visastatus": "",
                        "InsuranceObj": "",
                        "InsuranceCompanyId": 0,
                        "TPAId": 0,
                        "TPAName": "",
                        "InsurancePolicyNo": "",
                        "StartDate": "",
                        "EndDate": "",
                        "InsuranceDocument": "",
                        "SumInsured": 0,
                        "DocumentTypeId": "",
                        "DocumentObj": "",
                        "TempImagesArray": [],
                        "TempImagesArray1": [],
                        "TempImagesArray2": [],
                        "TempPdfArray": [],
                        "emgyCntryCode": "91",
                        "Address2": patientitem.PatientAddress ? patientitem.PatientAddress[0].Address2 : "",
                        "LandMark": patientitem.PatientAddress ? patientitem.PatientAddress[0].Landmark : "",
                        "PrimaryIND": "Y",
                        "Latitude": patientitem.PatientAddress ? patientitem.PatientAddress[0].Latitude : "",
                        "Address1": patientitem.PatientAddress ? patientitem.PatientAddress[0].Address1 : "",
                        "DistrictRegion": patientitem.PatientAddress ? patientitem.PatientAddress[0].DistrictRegion : "",
                        "Longitude": patientitem.PatientAddress ? patientitem.PatientAddress[0].Longitude : "",
                        "PinCode": patientitem.PatientAddress ? patientitem.PatientAddress[0].PinCode : "",
                        "Street": patientitem.PatientAddress ? patientitem.PatientAddress[0].Street : "",
                        "State": StateName,
                        "StateId": StateId,
                        "Country": CountryName,
                        "CountryId": CountryId,
                        "AddressType": patientitem.PatientAddress ? patientitem.PatientAddress[0].AddressType : "",
                        "CityTown": patientitem.PatientAddress ? patientitem.PatientAddress[0].CityName : "",
                        "CityId": patientitem.PatientAddress ? patientitem.PatientAddress[0].CityId : "",
                        "Location": patientitem.PatientAddress ? patientitem.PatientAddress[0].Location : "",
                        "SendPatientEmail": false,
                        "BSMSind": "",
                        "membership": "",
                        "doctorid": eHnoteMasterDataService.getLoginId(),
                        "MedicalHistory": $scope.MasterMedicalHistory,
                        "Allergies": $scope.MasterAllergies,
                        "Language": $scope.patientinfo.languagesspoken,
                        "FamilyHistory": $scope.MasterFamilyHistory,
                        "BirthHistory": $scope.MasterBirthHistory,
                        "NutritionalHistory": $scope.MasterNutritionalHistory,
                        "ImmunisationHistory": $scope.MasterImmunisationHistory,
                        "SurgicalHistory": $scope.MasterSurgicalHistory,
                        "MenstrualHistory": $scope.MasterMenstrualHistory,
                        "LifestyleHistory": $scope.MasterLifestyleHistory,
                        "ReferralPhoneType": patientitem.Patient[0].PatientOtherDetails[0].OccupationDescription || 'Mobile',
                        "ReferralMobileNo": patientitem.Patient[0].PatientOtherDetails[0].ReferralMobileNo || "",
                        "ReferralContactNo": patientitem.Patient[0].PatientOtherDetails[0].ReferralContactNo || "",
                        "AlternateType": patientitem.Patient[0].PatientOtherDetails[0].OccupationDescription || 'Mobile',
                        "TitleId": patientitem.Patient[0].TitleId,
                        "Selectedtitle": $scope.SelectedTitle,
                        "altMobile": altPhoneNo,
                        "altLandline": altLandline,
                        "landcode": patientitem.Patient[0].AltCountryCode,
                        "PatientInsuranceDetailsArray": [],
                        "Corporation": patientitem.Patient[0].AdditionalInfo.Corporation || 0,
                        "MothersMiddleName": patientitem.Patient[0].AdditionalInfo.MothersMiddleName || "",
                        "MultipleBirth": patientitem.Patient[0].AdditionalInfo.MultipleBirth || "No",
                        "Office": patientitem.Patient[0].AdditionalInfo.Office || 0,
                        "ProficiencyId": patientitem.Patient[0].AdditionalInfo.ProficiencyId || "",
                        "ExpressionId": patientitem.Patient[0].AdditionalInfo.ExpressionId || "",
                        "Provider1": patientitem.Patient[0].AdditionalInfo.Provider1 || 0,
                        "Provider2": patientitem.Patient[0].AdditionalInfo.Provider2 || 0,
                        "SocialSecurityNo": patientitem.Patient[0].AdditionalInfo.SocialSecurityNo || "",
                        "PhoneType": "Mobile",
                        "PCP": patientitem.Patient[0].AdditionalInfo.PCP || 0,
                        "PatientEthnicity": [],
                        "PatientRace": [],
                        "PatientComanagingId": patientitem.Patient[0].AdditionalInfo.PatientComanagingId || 0,
                        "Attorny": patientitem.Patient[0].AdditionalInfo.Attorny || "",
                        "Pharmacy": patientitem.Patient[0].AdditionalInfo.Pharmacy || "",
                        "PatientBillingTypeId": patientitem.Patient[0].AdditionalInfo.PatientBillingTypeId || 0,
                        "PatientClassId": patientitem.Patient[0].AdditionalInfo.PatientClassId || 0,
                        "Ambulatory": patientitem.Patient[0].AdditionalInfo.Ambulatory || "",
                    };

                    $scope.patientinfo.TempImagesArray2 = [];
                    $scope.patientinfo.TempImagesArray1 = [];
                    $scope.patientinfo.TempImagesArray1 = patientitem.patientProfilePicDetails || [];
                    $scope.patientinfo.S3URL = "";
                    $scope.file = "";
                    $scope.patientinfo.DocumentId = "";
                    if ($scope.patientinfo.TempImagesArray1.length != 0) {
                        $scope.patientinfo.S3URL = $scope.patientinfo.TempImagesArray1[0].S3URL || "";
                        $scope.patientinfo.DocumentId = $scope.patientinfo.TempImagesArray1[0].DocumentId || 0;
                    }

                    if (patientitem.Patient[0].AlternatePhoneNo != 0 && patientitem.Patient[0].AlternatePhoneNo != "" && patientitem.Patient[0].AlternatePhoneNo != undefined) {
                        patientitem.Patient[0].AlternatePhoneNo = patientitem.Patient[0].AlternatePhoneNo.toString();
                    }
                    if (patientitem.Patient[0].AlternateLandLine != 0 && patientitem.Patient[0].AlternateLandLine != "" && patientitem.Patient[0].AlternateLandLine != undefined) {
                        patientitem.Patient[0].AlternateLandLine = patientitem.Patient[0].AlternateLandLine.toString();
                    }
                    if (patientitem.Patient[0].Gender != "") {
                        if ($scope.patientinfo.title === "") {
                            if (patientitem.Patient[0].Gender === 'Female') {
                                $scope.patientinfo.title = 'Mrs';
                            }
                            else {
                                $scope.patientinfo.title = 'Mr';
                            }
                        }
                    }

                    patientitem.FamilyDetails = patientitem.FamilyDetails || [];
                    if (patientitem.FamilyDetails.length > 0) {
                        $scope.patientinfo.FamilyPatientId = patientitem.FamilyDetails[0].FamilyPatientId || "";
                        $scope.patientinfo.SearchText = patientitem.FamilyDetails[0].Name || "";
                        if (patientitem.FamilyDetails[0].FamilyRelationShipId != "") {
                            $scope.patientinfo.FamilyRelationShipId = patientitem.FamilyDetails[0].FamilyRelationShipId;
                        }
                        else {
                            $scope.patientinfo.FamilyRelationShipId = "";
                        }
                    }
                    patientitem.FamilyMenbers[0].PatientOtherDetails[0].Occupation = patientitem.FamilyMenbers[0].PatientOtherDetails[0].Occupation || 0;
                    if (patientitem.FamilyMenbers[0].PatientOtherDetails[0].Occupation !== 0) {
                        $scope.filtredOcc = $filter("filter")($scope.occupationDetails, { "Id": patientitem.FamilyMenbers[0].PatientOtherDetails[0].Occupation })[0];
                        $scope.patientinfo.othDetailoccupation = $scope.filtredOcc.Id;
                    } else {
                        $scope.patientinfo.othDetailoccupation = "";
                    }
                    $scope.patientinfo.BloodGroupId = $scope.patientinfo.BloodGroupId || '';
                    if ($scope.patientinfo.BloodGroupId !== "") {
                        $scope.patientinfo.BloodGroupObj = $filter("filter")($scope.BloodGroupList, { "Id": $scope.patientinfo.BloodGroupId })[0];
                    }
                    patientitem.FamilyMenbers[0].PatientOtherDetails[0].Education = patientitem.FamilyMenbers[0].PatientOtherDetails[0].Education || "";
                    if (patientitem.FamilyMenbers[0].PatientOtherDetails[0].Education !== "") {
                        $scope.filtredEdu = $filter("filter")($scope.educationDetails, { "Id": patientitem.FamilyMenbers[0].PatientOtherDetails[0].Education })[0];
                        $scope.patientinfo.othDetaileducation = $scope.filtredEdu.Id;
                    } else {
                        $scope.patientinfo.othDetaileducation = "";
                    }

                    patientitem.Patient[0].PatientOtherDetails[0].MasterReferralSourceId = patientitem.Patient[0].PatientOtherDetails[0].MasterReferralSourceId || "";

                    if (patientitem.Patient[0].PatientOtherDetails[0].MasterReferralSourceId !== "") {
                        $scope.patientinfo.MasterReferralSource = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": patientitem.Patient[0].PatientOtherDetails[0].MasterReferralSourceId }, true)[0];
                    }


                    $scope.patientinfo.othDetailmaritalstatusId = $scope.patientinfo.othDetailmaritalstatusId || "";
                    if ($scope.patientinfo.othDetailmaritalstatusId !== "") {
                        $scope.patientinfo.othDetailmaritalstatusObj = $filter("filter")($scope.MartialStatusList, { "Id": $scope.patientinfo.othDetailmaritalstatusId })[0];
                    } else {
                        $scope.patientinfo.othDetailmaritalstatusObj = "";
                    }

                    $scope.patientinfo.NationalityId = $scope.patientinfo.NationalityId || "";
                    if ($scope.patientinfo.NationalityId !== "") {
                        $scope.patientinfo.NationalityObj = $filter("filter")($scope.PatientNationalityList, { "DropdownId": $scope.patientinfo.NationalityId })[0];
                    } else {
                        $scope.patientinfo.NationalityObj = "";
                    }

                    $scope.patientinfo.ExpressionId = $scope.patientinfo.ExpressionId || "";
                    if ($scope.patientinfo.ExpressionId !== "") {
                        $scope.patientinfo.ExpressionObj = $filter("filter")($scope.PatientLanguageExpressionList, { "DropdownId": $scope.patientinfo.ExpressionId })[0];
                    } else {
                        $scope.patientinfo.ExpressionObj = "";
                    }


                    $scope.patientinfo.PatientComanagingId = $scope.patientinfo.PatientComanagingId || 0;
                    if ($scope.patientinfo.PatientComanagingId !== 0) {
                        $scope.patientinfo.ComanagingObj = $filter("filter")($scope.PatientComanagingArray, { "DropdownId": $scope.patientinfo.PatientComanagingId })[0];
                    } else {
                        $scope.patientinfo.ComanagingObj = "";
                    }

                    $scope.patientinfo.PatientClassId = $scope.patientinfo.PatientClassId || 0;
                    if ($scope.patientinfo.PatientClassId !== 0) {
                        $scope.patientinfo.ClassObj = $filter("filter")($scope.PatientClassArray, { "DropdownId": $scope.patientinfo.PatientClassId })[0];
                    } else {
                        $scope.patientinfo.ClassObj = "";
                    }

                    $scope.patientinfo.PatientBillingTypeId = $scope.patientinfo.PatientBillingTypeId || 0;
                    if ($scope.patientinfo.PatientBillingTypeId !== 0) {
                        $scope.patientinfo.BillingTypeObj = $filter("filter")($scope.PatientBillingTypeArray, { "DropdownId": $scope.patientinfo.PatientBillingTypeId })[0];
                    } else {
                        $scope.patientinfo.BillingTypeObj = "";
                    }

                    $scope.patientinfo.ProficiencyId = $scope.patientinfo.ProficiencyId || "";
                    if ($scope.patientinfo.ProficiencyId !== "") {
                        $scope.patientinfo.ProficiencyObj = $filter("filter")($scope.PatientLanguageProficiencyList, { "DropdownId": $scope.patientinfo.ProficiencyId })[0];
                    } else {
                        $scope.patientinfo.ProficiencyObj = "";
                    }

                    $scope.patientinfo.BloodGroupId = $scope.patientinfo.BloodGroupId || "";
                    if ($scope.patientinfo.BloodGroupId !== "") {
                        $scope.patientinfo.BloodGroupObj = $filter("filter")($scope.BloodGroupList, { "Id": $scope.patientinfo.BloodGroupId })[0];
                    } else {
                        $scope.patientinfo.BloodGroupObj = "";
                    }
                    $scope.patientinfo.ZipCodePlusNo = patientitem.PatientAddress ? patientitem.PatientAddress[0].ZipCodePlusNo : "";


                    if ($scope.patientinfo.PinCode !== "") {
                        if ($scope.patientinfo.ZipCodePlusNo !== "") {
                            $scope.countyCodesArray = [];
                            eHnoteSettingsDataService.getCountiesByZipCode($scope.patientinfo.PinCode).then(function (resp) {
                                console.log(resp);
                                $scope.countyCodesArray = resp.data.rows || [];
                                var filteredArrays = $filter("filter")($scope.countyCodesArray, { "COUNTY": $scope.patientinfo.ZipCodePlusNo }, true);

                                $scope.patientinfo.CountyCodeObj = filteredArrays[0];
                                $scope.patientinfo.ZipCodePlusNo = filteredArrays[0].COUNTY;

                            });
                        }

                    }

                    if ($scope.patientinfo.MasterReferralSource !== undefined) {
                        if ($scope.patientinfo.MasterReferralSource.ShowType === "D") {
                            $scope.IsbindindData = true;
                            GetrefferalSource("");

                        }
                    }


                    patientitem.patientProfilePicDetails = patientitem.patientProfilePicDetails || [];

                    patientitem.Patient[0].SuffixId = patientitem.Patient[0].SuffixId || 0;
                    patientitem.Patient[0].PrefixId = patientitem.Patient[0].PrefixId || 0;

                    if ($scope.patientinfo.emgytitle !== "") {
                        $scope.filtredOcc1 = $filter("filter")($scope.TitlesList, { "Name": $scope.patientinfo.emgytitle })[0];
                        $scope.patientinfo.Selectemgytitle = $scope.filtredOcc1;
                    } else {
                        $scope.patientinfo.Selectemgytitle = "";
                    }
                    if (patientitem.Patient[0].SuffixId !== 0) {
                        $scope.filtredOcc = $filter("filter")($scope.PatientSuffixList, { "SuffixId": patientitem.Patient[0].SuffixId })[0];
                        $scope.patientinfo.SuffixObj = $scope.filtredOcc;
                    } else {
                        $scope.patientinfo.SuffixObj = "";
                    }

                    if (patientitem.Patient[0].PrefixId !== 0) {
                        $scope.filtredOcc2 = $filter("filter")($scope.PatientPrefixList, { "DropdownId": patientitem.Patient[0].SuffixId })[0];
                        $scope.patientinfo.prefixObj = $scope.filtredOcc2;
                    } else {
                        $scope.patientinfo.prefixObj = "";
                    }

                    patientitem.PatientLanguage = patientitem.PatientLanguage || [];
                    if (patientitem.PatientLanguage.length > 0) {
                        if (patientitem.PatientLanguage[0].Languageid !== 0) {
                            $scope.Occ = $filter("filter")($scope.PatientLanguageList, { "DropdownId": patientitem.PatientLanguage[0].Languageid })[0];
                            $scope.patientinfo.LanguageObj = $scope.Occ;
                        } else {
                            $scope.patientinfo.LanguageObj = "";
                        }
                    }

                    if (patientitem.Patient[0].AdditionalInfo.SexualOrientationId !== 0) {
                        $scope.filtred1 = $filter("filter")($scope.PatientSexualOrientationList, { "DropdownId": patientitem.Patient[0].AdditionalInfo.SexualOrientationId })[0];
                        $scope.patientinfo.SexualOrientationObj = $scope.filtred1;
                    } else {
                        $scope.patientinfo.SexualOrientationObj = "";
                    }
                    if (patientitem.Patient[0].AdditionalInfo.GenderIdentityId !== 0) {
                        $scope.filtred = $filter("filter")($scope.PatientGenderIdentityList, { "DropdownId": patientitem.Patient[0].AdditionalInfo.GenderIdentityId })[0];
                        $scope.patientinfo.GenderIdentityObj = $scope.filtred;
                    } else {
                        $scope.patientinfo.GenderIdentityObj = "";
                    }
                  
                    patientitem.PatientEthnicity = patientitem.PatientEthnicity || [];
                    $scope.obj.IsEthnicitySelected = [];
                    if (patientitem.PatientEthnicity.length > 0) {
                        
                        angular.forEach(patientitem.PatientEthnicity, function (kitem) {
                            angular.forEach($scope.PatientEthnicityList, function (mitem) {
                                if (kitem.EthnicityId === mitem.DropdownId) {
                                    mitem.IsSelected = true;
                                    mitem.IsActive = "1";
                                    mitem.Value = kitem.EthnicityName;
                                    mitem.Id = kitem.Id;
                                    mitem.Name = "PatientEthnicity";
                                    $scope.obj.IsEthnicitySelected.push(mitem);
                                }

                            });
                        });
                    }

                    patientitem.PatientRace = patientitem.PatientRace || [];
                    $scope.obj.IsRaceSelected = [];
                    if (patientitem.PatientRace.length > 0) {                      
                        angular.forEach(patientitem.PatientRace, function (kitem) {
                            angular.forEach($scope.PatientRaceList, function (mitem) {
                                if (kitem.RaceId === mitem.DropdownId) {
                                    mitem.IsSelected = true;
                                    mitem.Id = kitem.Id;
                                    mitem.Value = kitem.EthnicityName;
                                    mitem.Id = kitem.Id;
                                    mitem.Name = "PatientRace";
                                    $scope.obj.IsRaceSelected.push(mitem);
                                }
                            });
                        });
                    }


                    $scope.patientinfo.PatientInsuranceDetailsArray = [];
                    $scope.patientinfo.PatientInsuranceDetailsArray = patientitem.patientInsuranceDetails;


                    $scope.patientinfo.PatientPCPDocuments = [];
                    $scope.patientinfo.PatientPCPDocuments = patientitem.PatientPCPDocuments;

                    if (patientitem.patientInsuranceDetails.length == 0) {
                        var insObj = newPatientInsuranceObj();
                        $scope.patientinfo.PatientInsuranceDetailsArray.push(insObj);
                    }
                    else {
                        angular.forEach($scope.patientinfo.PatientInsuranceDetailsArray, function (kitem) {
                            kitem.StatusId = kitem.StatusId || 0;
                            if (kitem.CoverageId != 0) {
                                var filtredobj = $filter("filter")($scope.InsuranceCoverageList, { "DropdownId": kitem.CoverageId })[0];
                                kitem.CoverageObj = filtredobj;
                            }
                            //if (kitem.PlanId != 0) {
                            //    var filtredobj1 = $filter("filter")($scope.InsurancePlanList, { "InsurancePlanId": kitem.PlanId })[0];
                            //    kitem.PlanObj = filtredobj1;
                            //}
                            if (kitem.PlanTypeId != 0) {
                                var filtredobj2 = $filter("filter")($scope.InsurancePlanTypeList, { "DropdownId": kitem.PlanTypeId })[0];
                                kitem.PlanTypeObj = filtredobj2;
                            }
                            if (kitem.RelationShipId != 0) {
                                var filtredobj3 = $filter("filter")($scope.InsuranceRelationShipList, { "DropdownId": kitem.RelationShipId })[0];
                                kitem.InsuranceRelationShipObj = filtredobj3;
                            }
                            if (kitem.StatusId != 0) {
                                var filtredobj4 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": kitem.StatusId })[0];
                                kitem.InsuranceStatusObj = filtredobj4;
                            }


                            if (kitem.PayorId != 0) {
                                var filtredobj56 = $filter("filter")($scope.PayorAllLIstArray, { "PayorId": kitem.PayorId })[0];
                                kitem.PayorObj = filtredobj56;
                            }
                            if (kitem.PlanId != 0) {
                               

                                $scope.payorPlansListArray = [];

                                var param = {
                                    "SearchText": "",
                                    "PageSize": 10,
                                    "PageNumber": 1,
                                    "UserId": $scope.UserId,
                                    "SpecializationId": $scope.SpecializationId,
                                    "OrganizationId": 1,
                                    "ParentOrganizationId": $scope.ParentHospitalID,
                                    "GetAllIndicator": 0,
                                    "PayorId": kitem.PayorId
                                }
                                eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

                                    $scope.payorPlansListArray = [];
                                    if (resp.data.Status === "Success") {
                                        kitem.payorPlansListArray = resp.data.rows || [];

                                        var filtredobjpk = $filter("filter")(kitem.payorPlansListArray, { "PlanId": kitem.PlanId })[0];
                                        kitem.PlanObj = filtredobjpk;

                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                            }
                            
                            if (kitem.EffectiveDate !== "") {
                                kitem.EffectiveDate = $filter('date')(new Date(kitem.EffectiveDate), "dd-MM-yyyy");
                            }
                            if (kitem.ExpiryDate !== "") {
                                kitem.ExpiryDate = $filter('date')(new Date(kitem.ExpiryDate), "dd-MM-yyyy");
                            }
                            if (kitem.ScanDate !== "") {
                                kitem.ScanDate = $filter('date')(new Date(kitem.ScanDate), "dd-MM-yyyy");
                            }
                            if (kitem.VerifiedDate !== "") {
                                kitem.VerifiedDate = $filter('date')(new Date(kitem.VerifiedDate), "dd-MM-yyyy");
                            }
                            kitem.TempInsuranceImagesArray = [];
                            kitem.PatientDocumentDetails = kitem.PatientDocumentDetails || [];
                        });
                    }

                    if ($scope.patientinfo.dob != "") {
                        $scope.patientinfo.dob = moment($scope.patientinfo.dob).format('MM-DD-YYYY');
                    }


                    InitializeNewBranches("Edit");
                    $scope.patients = [];
                    if ($scope.patientinfo.patientId === 0) {
                        $scope.ShowSearchAndClear = true;
                    }
                    else {
                        $scope.ShowSearchAndClear = false;
                        if ($scope.mobilenumbe == '' || $scope.mobilenumbe == undefined) {
                           // $scope.mobilenumber = patientitem.PatientPhone ? patientitem.PatientPhone[0].PhNumber : '';
                            $scope.mobilenumber = patientitem.Patient ? patientitem.Patient[0].PatientHomeNumber : '';
                        }                     
                    }
                    $scope.ShowAddNew = false;
                    $scope.state = false;
                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        }
        else if (type === 2) {
            $scope.patientinfo.PhoneType = "Mobile";
            $scope.patientinfo.patientId = 0;
            //if ($scope.patientinfo.patientPhone.length > 0) {
            //    $scope.patientinfo.patientPhone[0].PhNumber = $scope.mobilenumber;
            //    if ($scope.mobilenumber.length > 0) {
            //        var number = $scope.mobilenumber;
            //        number = number.slice(0, 3) + '-' + number.slice(3, 6) + '-' + number.substring(6, 10);;
            //        $scope.patientinfo.patientPhone[0].TempPhNumber = number;
            //    }
            //}
            $scope.patientinfo.MobileNumber = $scope.patientinfo.MobileNumber || '';
            if ($scope.patientinfo.MobileNumber.length > 0) {
                $scope.patientinfo.MobileNumber = $scope.mobilenumber;
                $scope.patientinfo.PatientHomeNumber = $scope.mobilenumber||"";
                //if ($scope.mobilenumber.length > 0) {
                //    var number = $scope.mobilenumber;
                //    number = number.slice(0, 3) + '-' + number.slice(3, 6) + '-' + number.substring(6, 10);;
                //    $scope.patientinfo.Patient[0].TempPhNumber = number;
                //}
            }
            $scope.patientinfo.S3URL = "";
            $scope.ShowSearchAndClear = true;
            if ($scope.patientinfo.PatientInsuranceDetailsArray.length === 0) {
                var insObj = newPatientInsuranceObj();
                $scope.patientinfo.PatientInsuranceDetailsArray.push(insObj);
            }
        }
        $scope.ShowAddNew = false;
        $scope.showIsMobileNoManadatory = false;
    };

    $scope.SelectFamilyPatient = function (patientitem) {
        $scope.patientinfo.SearchText = patientitem.Patient[0].FullName;
        $scope.patientinfo.FamilyPatientId = patientitem.Patient[0].PatientId;
        $scope.ShowFamilyAddNew = false;
    }

    $scope.ShowRegisterPatient = function () {
        $scope.DefaultShowDetails = true;
    }

    $scope.ShoWDoBData = true;
    $scope.AgeDIsplay = function () {
        $scope.ShoWDoBData = !$scope.ShoWDoBData;
    };


    $scope.SelectLanguage = function (item) {
        item.IsSelected = !item.IsSelected;
        if (item.ISExist) {
            item.DeleteInd = true;
        }
    };

    $scope.ChangeGender = function (type) {
        $scope.patientinfo.gender = type;
    };

    $scope.AddNewPatient = function () {
        $scope.ShowAddNew = false;
        $scope.DefaultShowDetails = true;
       // $scope.patientinfo.patientPhone[0].PhNumber = $scope.mobilenumber;
        $scope.patientinfo.PatientHomeNumber = $scope.mobilenumber;
        $scope.patientinfo.PatientInsuranceDetailsArray = [];
        var insObj = newPatientInsObj();
        $scope.patientinfo.PatientInsuranceDetailsArray.push(insObj);
        $scope.patientinfo.S3URL = "";
        $scope.file = "";
    };

    var modelIntance;
    $scope.addReferral = function (ref) {

        $scope.referralTitle = ref;

        if ($scope.referralTitle === undefined || $scope.referralTitle === "") {
            alertify.error("Please Add Referral Source");
            return;
        }
        $scope.patientinfo.ReferralSource = $scope.patientinfo.ReferralSource || "";
        if ($scope.patientinfo.ReferralSource === "") {
            alertify.error("Please Choose Referral");
            $scope.addRefferelPopup = false;
            return;
        }
        var params = {
            "DoctorID": doctorinfo.doctorid,
            "USRType": "DOCTOR",
            "ReferralDesc": "Referral Description",
            "PageSize": 1000,
            "PageNumber": 1,
            "ActiveIND": "Y",
            "USRId": doctorinfo.doctorid,
            "ReferralTitle": $scope.referralTitle,
            "MasterReferralSourceId": $scope.patientinfo.ReferralSource.MasterReferralSourceId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        };

        eHnoteOrgReferralDataServices.AddUpdateReferralServicesList(params, onSuccess, onFailed);
        function onSuccess(data) {


            if (data.status === "Failure") {
                alertify.error("Referral Source already exist");
                $scope.referralTitle = "";
            } else {
                alertify.success('Added Successfully');

                if (data[0].rows.length > 0) {
                    $scope.addRefferelPopup = false;
                    modelIntance.dismiss('cancel');
                    $scope.IsbindindData = true;
                    $scope.patientinfo.othDetailreferralsource = data[0].rows[0].ReferralID;
                    $scope.patientinfo.othDetailreferralsourceName = data[0].rows[0].ReferralTitle;
                    GetrefferalSource("");
                }


            }
        }
        function onFailed(err) {
            console.log(err);
            alertify.error("Referral Source already exist");
        }
    };

    $scope.Refferalcancel = function () {
        modelIntance.dismiss('cancel');
    };

    $scope.openRefferalAddpopUp = function () {
        $scope.referralTitle = $scope.patientinfo.othDetailreferralsourceName || "";
        $scope.addRefferelPopup = true;
        $scope.ShowRefferallist = false;
        modelIntance = $uibModal.open({
            size: 'sm',
            templateUrl: 'AddRefferalSource.html',
            scope: $scope,
            "backdrop": "static",
            "keyboard": false,
        })
    };

    function getdateslist(d) {
        if (d === 31) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        }
        else if (d === 30) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
        }
        else if (d === 28) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
        }
        else if (d === 29) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin29daysArray();
        }
        else {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        }


    };
    function daysInMonth(month, year) {
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }
        var d = new Date(dobyear, dobmonth, 0).getDate();
        getdateslist(d);
        return d;

    }

    $scope.ChangeItem = function (item) {
        item.ShowDateFormat = !item.ShowDateFormat;
    };
    $scope.ChangeFormatDate = function (item) {
        item.DurationDate = $filter("date")(new Date(item.DurationDate), "dd-MMM-yyyy");
        item.Duration = "";
        item.DurationType = "D";
        item.DurationTypeName = "Day(s)";
    };
    $scope.ChangeDuration = function (item) {
        item.DurationDate = "";
    };
    $scope.ChnageBloodGroup = function (item) {
        item.BloodGroupObj = item.BloodGroupObj || "";
        if (item.BloodGroupObj === "") {
            item.BloodGroup = "";
            item.BloodGroupId = "";
        } else {
            // item.BloodGroup = item.BloodGroupObj.Name;
            item.BloodGroup = item.BloodGroupObj.BloodGroupName;

            item.BloodGroupId = item.BloodGroupObj.Id;
        }

    };
    $scope.ChangeMaritalStatus = function (item) {
        item.othDetailmaritalstatusObj = item.othDetailmaritalstatusObj || "";
        if (item.othDetailmaritalstatusObj === "") {
            item.othDetailmaritalstatus = "";
            item.othDetailmaritalstatusId = "";
        } else {
            //item.othDetailmaritalstatus = item.othDetailmaritalstatusObj.Name;
            item.othDetailmaritalstatus = item.othDetailmaritalstatusObj.MaritalStatus;
            item.othDetailmaritalstatusId = item.othDetailmaritalstatusObj.Id;
        }
    };

    $scope.ChangePrefixStatus = function (item) {
        item.prefixObj = item.prefixObj || "";
        if (item.prefixObj != "") {
            item.PrefixId = item.prefixObj.DropdownId;
        }
    };

    $scope.ChangeSuffixStatus = function (item) {
        item.SuffixObj = item.SuffixObj || "";
        if (item.SuffixObj != "") {
            item.SuffixId = item.SuffixObj.SuffixId;
        }
    };
    $scope.ChangeEthnicityStatus = function (item) {
        //item.EthnicityObj = item.EthnicityObj || "";
        //if (item.EthnicityObj != "") {
        //    item.EthnicityId = item.EthnicityObj.DropdownId;
        //    item.EthnicityName = item.EthnicityObj.Value;

        //}
        if (item.length > 0) {
            angular.forEach(item, function (kitem) {
                kitem.IsSelected = true;
            });
        }
    };
    $scope.ChangeRaceStatus = function (item) {
        //item.RaceObj = item.RaceObj || "";
        //if (item.RaceObj != "") {
        //    item.RaceId = item.RaceObj.DropdownId;
        //    item.RaceName = item.RaceObj.Value;
        //}
        if (item.length > 0) {
            angular.forEach(item, function (kitem) {
                kitem.IsSelected = true;
            });
        }
    };
    $scope.ChangeNationality = function (item) {
        item.NationalityObj = item.NationalityObj || "";
        if (item.NationalityObj != "") {
            item.Nationality = item.NationalityObj.Value;
            item.NationalityId = item.NationalityObj.DropdownId;
            $scope.NationalityId = item.NationalityObj.DropdownId;

        }

    };
    $scope.ChangeLanguageStatus = function (item) {
        item.LanguageObj = item.LanguageObj || "";
        if (item.LanguageObj != "") {

            item.Language = item.LanguageObj.Value;
            item.LanguageId = item.LanguageObj.DropdownId;

        }

    };


    $scope.ChangeExpressionStatus = function (item) {
        item.ExpressionObj = item.ExpressionObj || "";
        if (item.ExpressionObj != "") {
            item.Expression = item.ExpressionObj.Value;
            item.ExpressionId = item.ExpressionObj.DropdownId;
        }

    };

    $scope.ChangeProficiencyStatus = function (item) {
        item.ProficiencyObj = item.ProficiencyObj || "";
        if (item.ProficiencyObj != "") {
            item.Proficiency = item.ProficiencyObj.Value;
            item.ProficiencyId = item.ProficiencyObj.DropdownId;
        }

    };

    $scope.ChangeSexualOrientationStatus = function (item) {
        item.SexualOrientationObj = item.SexualOrientationObj || "";
        if (item.SexualOrientationObj != "") {
            item.SexualOrientationId = item.SexualOrientationObj.DropdownId;
        }
    };

    $scope.ChangeGenderIdentityStatus = function (item) {
        item.GenderIdentityObj = item.GenderIdentityObj || "";
        if (item.GenderIdentityObj != "") {
            item.GenderIdentityId = item.GenderIdentityObj.DropdownId;
        }
    };

    $scope.captureimage = function () {
        $scope.modelIntance = $uibModal.open({
            "size": 'md',
            "templateUrl": 'loadNewpopup.html',
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false
        });
    };

    $scope.newcaptureimage = function () {

        $scope.ClosepatientPhotoUpload();
        $scope.modelIntance = $uibModal.open({
            "size": 'md',
            "templateUrl": 'loadNewpopup.html',
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false
        });
    };
    $scope.cancel = function () {
        $location.url("/op");
    };

    $scope.cancelCapturePopup = function () {
        $scope.modelIntance.dismiss('cancel');

        $scope.captureImageorupload();
    }
    $scope.save = function () {
        var abc = document.getElementById('printresult');

        $scope.splitStrings1 = abc.innerHTML;


        function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        $scope.file = dataURLtoFile($scope.splitStrings1, 'Profile');
        $scope.selectPrintImgLogo1($scope.file);

        $scope.modelIntance.dismiss('cancel');

    };

    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].$$hashKey) {
                    delete a[i].$$hashKey;
                }
                if (a[j].$$hashKey) {
                    delete a[j].$$hashKey;
                }
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };

    $scope.getStreetsBySearch = function (val) {

        var params = {
            "SearchText": val,
            "LocationId": $scope.patientinfo.LocationId
        };

        return eHnotePatientDataService.SearchStreetByAutoComplete(params).then(function (resp) {

            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.onStreetSelected = function (item) {
        $scope.patientinfo.Street = item.StreetName;
        $scope.patientinfo.Location = item.LocationName;

    }

    $scope.changeRelationShip = function (item) {
        item.NameOfTheEmployee = "";
        if (item.RelationShipId === 1) {
            item.NameOfTheEmployee = $scope.patientinfo.firstname;
        }
    };

    $scope.getFrequentlyAddedCities = function (val) {
        var params = {
            "UserId": doctorinfo.doctorid,
            "SearchText": val,
            "StateId": ""
        };

        return eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {

            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };


    //$scope.getFrequentlyAddedCities = function (val) {
    //    var params = {
    //        "UserId": doctorinfo.doctorid,
    //        "SearchText": val,
    //        "StateId": ""
    //    };
    //    eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {
    //        if (resp.data.rows !== undefined) {
    //            $scope.querycity = resp.data.rows;
    //        }
    //    });
    //};

    $scope.changecitytext = function (selecttext) {
        if (selecttext !== "") {
            if ($scope.city === true) {
                $scope.getFrequentlyAddedCities(selecttext);
                $scope.patientinfo.CityId = null;
            }
        } else {
            $scope.querycity = [];
            $scope.patientinfo.CityId = null;
        }
        if ($scope.city === false) {
            $scope.city = true;
        }

    }

    $scope.searchLocations = function (val) {
        var params = {
            "SearchText": val,
            "CityId": 0,
            "StateId": $scope.patientinfo.StateId
        };

        return eHnoteSettingsDataService.getLocationsSearch(params).then(function (resp) {

            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.viewRegisterPatient = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/ViewRegisterPatientSuccess.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeRegisterPatientSuccess = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    $scope.viewScancard = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/Viewscancode.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closescancodecard = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    $scope.CloseInsuranceCard = function () {
        $scope.modelIntance.dismiss("cancel");
    };

    $scope.UploadInsuranceCard = function (insitem) {

        $scope.insItem = angular.copy(insitem);

        $scope.backItemS3Url = false;
        $scope.frontItemS3Url = false;
        $scope.backS3Url = "";
        $scope.frontS3Url = "";
        $scope.insItem.PatientDocumentDetails = $scope.insItem.PatientDocumentDetails || [];
        if ($scope.insItem.PatientDocumentDetails.length > 0) {
            angular.forEach($scope.insItem.PatientDocumentDetails, function (citem) {
                if (citem.IsBackSidefile) {
                    citem.S3URL = citem.S3URL || "";
                    if (citem.S3URL !== "") {
                        $scope.backItemS3Url = true;
                        $scope.backS3Url = citem.S3URL;
                    }
                } else {
                    citem.S3URL = citem.S3URL || "";
                    if (citem.S3URL !== "") {
                        $scope.frontItemS3Url = true;
                        $scope.frontS3Url = citem.S3URL;
                    }
                }

            })
        }
        $scope.modelIntance = $uibModal.open({
            "size": 'md',
            "templateUrl": 'PatientInsuranceUploads.html',
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false
        });

        $scope.modelIntance.result.then(function (selectedItem) {
            console.log(selectedItem);
            insitem.PatientInsuranceDetailId = selectedItem.PatientInsuranceDetailId;
            insitem.PatientDocumentDetails = selectedItem.PatientDocumentDetails || [];
        }, function () {
            console.log("cancelled");
        });
    }


    $scope.ClosepatientPhotoUpload = function () {
        $scope.modelIntance.dismiss("cancel");
    };


    $scope.removeInsImage = function (type) {
        if (type === 'front') {
            $scope.frontItemUpload = false;
            $scope.Ffile = null;
            $scope.frontItemS3Url = false;

            if ($scope.insItem.PatientDocumentDetails.length > 0) {
                angular.forEach($scope.insItem.PatientDocumentDetails, function (citem) {
                    if (!citem.IsBackSidefile) {
                        citem.S3URL = citem.S3URL || "";
                        if (citem.S3URL !== "") {
                            citem.DeleteInd = "Y";
                        }
                    }

                })
            }
        }
        else {
            $scope.backItemUpload = false;
            $scope.Bfile = null;
            $scope.backItemS3Url = false;

            if ($scope.insItem.PatientDocumentDetails.length > 0) {
                angular.forEach($scope.insItem.PatientDocumentDetails, function (citem) {
                    if (citem.IsBackSidefile) {
                        citem.S3URL = citem.S3URL || "";
                        if (citem.S3URL !== "") {
                            citem.DeleteInd = "Y";
                        }
                    }

                })
            }
        }


    }


    $scope.savePatientProfilePic = function () {

        $scope.modelIntance.close('save');
    };


    $scope.ClearPatientProfileImg = function () {
        $scope.isLogoDefault = true;
        $scope.isLogoThumbnailDefault = false;
        $scope.isLogoS3URLDefault = false;
        $scope.IsModifedLogo = false;
    }
    $scope.captureImageorupload = function () {



        $scope.modelIntance = $uibModal.open({
            "size": 'sm',
            "templateUrl": 'PatientPhotoUploadNew.html',
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false
        });
        //$scope.mInstanceAdd = $uibModal.open({
        //    "templateUrl": "templates/uibpopups/patientPhotoUpload.html",
        //    "backdrop": "static",
        //    "scope": $scope,
        //    "keyboard": false,
        //    "size": "sm",
        //    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {

        //        $scope.patientImgUrlFile = "";
        //        $scope.isPatientImgAvail = false;

        //        $scope.ClosepatientPhotoUpload = function () {
        //            $uibModalInstance.dismiss("cancel");
        //        };

        //        $scope.captureimage = function () {

        //            $scope.modelIntance = $uibModal.open({
        //                "size": 'md',
        //                "templateUrl": 'loadNewpopup.html',
        //                "scope": $scope,
        //                "backdrop": "static",
        //                "keyboard": false
        //            });
        //        };


        //        $scope.selectPrintImgLogo1 = function (file) {
        //            $scope.isPatientImgAvail = true;
        //            $scope.patientinfo.TempImagesArray1 = [];
        //            $scope.IsModifedLogo = true;
        //            $scope.patientinfo.S3URL = '';
        //            $scope.file = "";

        //            $scope.file = file;
        //            if ($scope.file != null) {
        //                var pName = $scope.file.name, name = "";
        //                var type = $scope.file.type.split("/")[1];
        //                if (pName.length > 9) {
        //                    name = pName.substring(0, 9) + "..." + "." + type;
        //                } else {
        //                    name = angular.copy(pName) + '.' + type;
        //                }


        //                var obj = {
        //                    "file": $scope.file,
        //                    "DocumentTypeId": $scope.patientinfo.DocumentTypeId,
        //                    "DeleteInd": false,
        //                    "DocumentId": $scope.patientinfo.DocumentId || 0,
        //                    "DocumentExt": $scope.file.type,
        //                    "DisplayName": name
        //                };

        //                if ($scope.file.type != 'application/pdf') {
        //                    $scope.patientinfo.TempImagesArray1.push(obj);
        //                }

        //                angular.element("input[type='file']").val(null);
        //            }
        //        };


        //        $scope.ClearPatientProfileImg = function () {

        //        }

        //        $scope.removeImage = function (item) {
        //            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
        //                $scope.isPatientImgAvail = false;
        //                if (item.TempImagesArray1.length !== 0) {
        //                    $scope.patientinfo.TempImagesArray1 = item.TempImagesArray1 || [];
        //                    $scope.patientinfo.TempImagesArray1[0].DeleteInd = true;
        //                }
        //                $scope.patientinfo.S3URL = '';
        //                $scope.file = "";
        //            }, function () {
        //                return;
        //            });
        //        }

        //    }
        //});
    }

    $scope.CloseDesignatedPop = function () {
        $scope.mInstanceAdd.dismiss("cancel");
    };

    $scope.saveAdditionalDesignatedInfo = function () {
        $scope.mInstanceAdd.close("save");
    }

    $scope.DesignatedRegPatient = function () {
        //$scope.mInstanceAdd = $uibModal.open({
        //    "templateUrl": "templates/uibpopups/Designatedpopup.html",
        //    "backdrop": "static",
        //    "scope": $scope,
        //    "keyboard": false,
        //    "size": "md",
        //    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
        //        $scope.CloseDesignatedPop = function () {
        //            $uibModalInstance.dismiss("cancel");
        //        };
        //    }
        //});

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "PatientAdditionalDesignatedinfo.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md"
        });
    }

    $scope.InsuranceAdditionalInfo = function (insitem) {


        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/InsuranceAdditionalInfoPop.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "resolve": {
                "InsuranceObj": {
                    "insItem": insitem,
                    "InsuranceRelationShipList": $scope.InsuranceRelationShipList
                }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, InsuranceObj) {


                console.log(InsuranceObj);

                $scope.InsuranceObj = InsuranceObj;


                $scope.InsuranceRelationShipList = [];
                $scope.InsuranceRelationShipList = $scope.InsuranceObj.InsuranceRelationShipList || [];

                $scope.CloseInsuranceAdditionalInfoPop = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                //$scope.ChangeReleaseInfo = function (val, item) {
                //    item.insItem.ReleaseInfo = val;
                  
                //};
                //$scope.ChangeAcceptAssignBenifits = function (val, item) {
                //    item.insItem.AcceptAssignBenifits = val;
                  
                //};
                //$scope.ChangeAcceptAssign = function (val, item) {
                //    item.insItem.AcceptAssign = val;
                  
                //};
                $scope.saveAdditonalInsuranceDetails = function () {
                    $uibModalInstance.close($scope.InsuranceObj.insItem);
                };

                $scope.ChangeInsuranceRelationShipItem = function (item) {
                    item.InsuranceRelationShipObj = item.InsuranceRelationShipObj || "";
                    if (item.InsuranceRelationShipObj != "") {
                        item.RelationShipId = item.InsuranceRelationShipObj.DropdownId;
                    }
                };
                $scope.ChangePatientBillingType = function (item) {
                    item.BillingTypeObj = item.BillingTypeObj || "";
                    if (item.BillingTypeObj != "") {
                        item.PatientBillingTypeId = item.BillingTypeObj.Id;
                    }
                };

               
               


            }
        });

        $scope.mInstanceAdd.result.then(function (result) {
            console.log(result);
            insitem = result;
        }, function (cancel) {
        });
    }

    $scope.ChangeZipCode = function (val) {
        val = val || "";
        $scope.countyCodesArray = [];
        $scope.patientinfo.ZipCodePlusNo = "";
        $scope.patientinfo.CountyCodeObj = "";
        if (val.length >= 5) {

            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.length > 0) {

                    $scope.pincodesarray = resp.data || [];
                    $scope.pincodesarraycount = resp.data.length;
                    if ($scope.pincodesarray.length !== 0) {
                        $scope.patientinfo.CityId = $scope.pincodesarray[0].CityId;
                        $scope.patientinfo.CityTown = $scope.pincodesarray[0].CityName;
                        $scope.patientinfo.State = $scope.pincodesarray[0].StateName;
                        $scope.patientinfo.StateId = $scope.pincodesarray[0].StateId;
                        $scope.patientinfo.Country = $scope.pincodesarray[0].CountryName;
                        $scope.CitySelected = $scope.pincodesarray[0].CityName;
                        $scope.selectedItem = $scope.pincodesarray[0].StateName;
                        $scope.selectedCountry = $scope.pincodesarray[0].CountryName;
                        $scope.state = false;
                        $scope.city = false;
                    
                    }
                }
            });

            $scope.searchCountyByZipCode(val);
        }
        else {
            $scope.patientinfo.CityTown = "";
            $scope.patientinfo.State = "";
            $scope.patientinfo.Country = "";
            $scope.CitySelected = "";
            $scope.selectedItem = "";
            $scope.selectedCountry = "";
        }
    }

    $scope.ChangeCoverageStatus = function (item) {
     

        item.CoverageObj = $filter("filter")($scope.InsuranceCoverageList, { "DropdownId": item.CoverageId }, true)[0];

        item.CoverageObj = item.CoverageObj || "";
        if (item.CoverageObj != "") {
            item.CoverageId = item.CoverageObj.DropdownId;
            item.CoverageName = item.CoverageObj.Value;
        }
    }

    $scope.ChangeInsuranceStatus = function (item) {
        item.InsuranceStatusObj = item.InsuranceStatusObj || "";
        if (item.InsuranceStatusObj != "") {
            item.StatusId = item.InsuranceStatusObj.DropdownId;
        }
    }
    $scope.ChangeInsuranceRelationShipItem = function (item) {
        item.InsuranceRelationShipObj = item.InsuranceRelationShipObj || "";
        if (item.InsuranceRelationShipObj != "") {
            item.RelationShipId = item.InsuranceRelationShipObj.DropdownId;
        }
    };
    $scope.ChangePlanType = function (item) {
        item.PlanTypeObj = item.PlanTypeObj || "";
        if (item.PlanTypeObj != "") {
            item.PlanTypeId = item.PlanTypeObj.DropdownId;
        }
    }



    $scope.ChangeInsurancePlan = function (val, item) {
        val = val || "";

        var PlanId = val.InsurancePlanId || 0;
        if (PlanId != 0) {
            eHnoteSettingsDataService.GetInsurancePlanById(PlanId).then(function (resp) {
                if (resp.data.length > 0) {

                    $scope.InsurancePlanarray = resp.data || [];
                    if ($scope.InsurancePlanarray.length !== 0) {

                        item.Payor = $scope.InsurancePlanarray[0].PayorName;
                        item.PlanType = $scope.InsurancePlanarray[0].PlanType;
                        var plantypefiltered = $filter("filter")($scope.InsurancePlanTypeList, { "Value": item.PlanType }, true);
                        item.PlanTypeObj = plantypefiltered[0] || "";
                        if (item.PlanTypeObj != '') {
                            item.PlanTypeId = item.PlanTypeObj.DropdownId;
                        }

                        item.PlanId = PlanId;
                    }
                }
            });
        }
    }

    $scope.addMoreInsurance = function (index) {

        //insItem.CoverageId = insItem[index].CoverageId || 0;
        // insItem.PlanId = insItem.PlanId || 0;
        //insItem.PlanTypeId = insItem.PlanTypeId || 0;


        if ($scope.patientinfo.PatientInsuranceDetailsArray[index].CoverageId === 0) {
            alertify.error("Please select Coverage");
            return false;
        }


        if ($scope.patientinfo.PatientInsuranceDetailsArray[index].PlanId === 0) {
            alertify.error("Please Select Plan");
            return false;
        }
        if ($scope.patientinfo.PatientInsuranceDetailsArray[index].PlanTypeId === 0) {
            alertify.error("Please Select PlanType");
            return false;
        }



        var insObj = angular.copy(newPatientInsuranceObj());

        insObj.CoverageId = "";
        insObj.CoverageName = "";

        $scope.patientinfo.PatientInsuranceDetailsArray.push(insObj);

    }


    $scope.changeTextCountry = function (searchText) {
        searchText = searchText || "";
        $scope.countryArray = [];
        if (searchText != "") {
            if ($scope.patientinfo.CountryName.length != 0) {
                var results = searchText ? $scope.countries.filter(createFilterFor(searchText)) : [];

                $scope.countryArray = results;
            }
        }
    }

    $scope.patientSave = function (patientform, patientinfo, from_where, blnStartConsultation) {


        if ($scope.patientinfo.Selectedtitle !== undefined) {
            $scope.patientinfo.title = $scope.patientinfo.Selectedtitle.Name;
            $scope.patientinfo.TitleId = $scope.patientinfo.Selectedtitle.Id;
         }


        $scope.patientinfo.countrycode = $("#txtcountrycode").val();
     //   $scope.patientinfo.patientPhone[0].PhNumber = $scope.patientinfo.patientPhone[0].PhNumber || "";
        $scope.patientinfo.PatientHomeNumber = $scope.patientinfo.PatientHomeNumber || "";
        if ($scope.patientinfo.firstname === null || $scope.patientinfo.firstname === "" || $scope.patientinfo.firstname === undefined) {
            alertify.error("Patient Name Is Mandatory");
            return false;
        }
        if ($scope.patientinfo.dob === "" && $scope.ageinYears === "" && $scope.ageinMonths === "" && $scope.ageinMonths === "") {
            alertify.error("DOB / Age Is Mandatory");
            return false;
        }
        else {
            if ($scope.patientinfo.dob !== "") {

                var todat = $filter("date")(new Date(), "dd-MMM-yyyy");
                if ($scope.patientinfo.dob === todat) {
                    alertify.error("Future Dates Not Allowed");
                    return false;
                }
            } else {
                $scope.patientinfo.dob = $scope.getDateOfBirth($scope.ageinYears, $scope.ageinMonths);
                $scope.patientinfo.dob = new Date($scope.patientinfo.dob);
            }
        }




        //single, dobule, / codes 
        var str = $scope.patientinfo.Address1 || "";
        $scope.patientinfo.Address1 = str.replaceAll("'", " ");
        var str1 = $scope.patientinfo.Address1;
        $scope.patientinfo.Address1 = str1.replaceAll('"', ' ');
        var str2 = $scope.patientinfo.Address1;
        $scope.patientinfo.Address1 = str2.replaceAll(/\\/g, ' ');

        var str3 = $scope.patientinfo.Address2 || "";
        $scope.patientinfo.Address2 = str3.replaceAll("'", " ");
        var str4 = $scope.patientinfo.Address2;
        $scope.patientinfo.Address2 = str4.replaceAll('"', ' ');
        var str5 = $scope.patientinfo.Address2;
        $scope.patientinfo.Address2 = str5.replaceAll(/\\/g, ' ');

        var str6 = $scope.patientinfo.firstname || "";
        $scope.patientinfo.firstname = str6.replaceAll("'", " ");
        var str7 = $scope.patientinfo.firstname;
        $scope.patientinfo.firstname = str7.replaceAll('"', ' ');
        var str8 = $scope.patientinfo.firstname;
        $scope.patientinfo.firstname = str8.replaceAll(/\\/g, ' ');

        var str9 = $scope.patientinfo.lastname || "";
        $scope.patientinfo.lastname = str9.replaceAll("'", " ");
        var str10 = $scope.patientinfo.lastname;
        $scope.patientinfo.lastname = str10.replaceAll('"', ' ');
        var str11 = $scope.patientinfo.lastname;
        $scope.patientinfo.lastname = str11.replaceAll(/\\/g, ' ');

        var strM1 = $scope.patientinfo.MothersMiddleName || "";
        $scope.patientinfo.MothersMiddleName = strM1.replaceAll("'", " ");
        var strM2 = $scope.patientinfo.MothersMiddleName;
        $scope.patientinfo.MothersMiddleName = strM2.replaceAll('"', ' ');
        var str1M3 = $scope.patientinfo.MothersMiddleName;
        $scope.patientinfo.MothersMiddleName = str1M3.replaceAll(/\\/g, ' ');



        if ($scope.patientinfo.CurrentAge !== undefined) {
            $scope.patientinfo.Age = parseFloat($scope.patientinfo.CurrentAge);
        }
      

        var PhNumber = $scope.PhNumber || "";

        patientinfo.altLandline = patientinfo.altLandline || "";


        angular.forEach($scope.countries, function (item) {
            //  if (patientinfo.Country.Name === item.Name) {
            if (patientinfo.Country === item.Name) {
                $scope.countrycodeval = item.Name;
                $scope.countrycodeid = item.Id;
            }
        });
        angular.forEach($scope.states, function (item) {
            // if (patientinfo.State.Name === item.Name) {
            if (patientinfo.State === item.Name) {
                $scope.statecodeval = item.Name;
                $scope.statecodeid = item.StateId;
            }
        });
        //angular.forEach($scope.cities, function (item) {
        //    if (patientinfo.CityTown === item.Name) {
        //        $scope.citycodeval = item.Name;
        //        $scope.citycodeid = item.Id;
        //    }
        //});
        angular.forEach($scope.querycity, function (item) {
            if (patientinfo.CityTown === item.Name) {
                $scope.citycodeval = item.Name;
                $scope.citycodeid = item.Id;
            }
        });
        angular.forEach($scope.locationValues, function (item) {
            if (patientinfo.Location === item.LocationIDDesc) {
                $scope.locationcodeval = item.LocationID;
            }
        });
        if ($scope.familyidchange === "N") {
            if ($scope.patientid === 0) {
                alertify.error('Please search their familyid or number');
                return;
            }
        }




        $scope.patientinfo.othDetailoccupation = parseInt($scope.patientinfo.othDetailoccupation);
        $scope.patientinfo.othDetaileducation = parseInt($scope.patientinfo.othDetaileducation);
        $scope.patientinfo.SubValue = 2;

        console.log($scope.patientinfo.othDetailreferralsource);

        $scope.patientinfo.Refvalue = parseInt($scope.patientinfo.othDetailreferralsource);

        $scope.patientinfo.prefixObj = $scope.patientinfo.prefixObj || "";
        $scope.patientinfo.SuffixObj = $scope.patientinfo.SuffixObj || "";
        if ($scope.patientinfo.prefixObj != '') {
            $scope.patientinfo.PrefixId = $scope.patientinfo.prefixObj.DropdownId;
        }
        if ($scope.patientinfo.SuffixObj != '') {
            $scope.patientinfo.SuffixId = $scope.patientinfo.SuffixObj.SuffixId;
        }

        $scope.patientinfo.PatientTypeId = 1;

        patientinfo.StartDate = $filter("dateFormatter")(patientinfo.StartDate, "-");
        patientinfo.EndDate = $filter("dateFormatter")(patientinfo.EndDate, "-");
        patientinfo.patientId = patientinfo.patientId || 0;
        if (patientinfo.patientId !== 0) {
            $rootScope.AppointmentPatient_type = 2;
            $rootScope.FastTrackAppointment = false;
        } else {
            $rootScope.AppointmentPatient_type = 1;
            $rootScope.FastTrackAppointment = false;
        }



        patientinfo.languagesspoken = [];
        patientinfo.Ethnicity = [];
        patientinfo.Race = [];
        patientinfo.LanguageId = patientinfo.LanguageId || "";
        if (patientinfo.LanguageId != "") {
            var languageobj = {
                "Id": 0,
                "LanguageName": patientinfo.Language,
                "Languageid": patientinfo.LanguageId,
                "IsSelected": true,
                "DeleteInd": 0
            }
            patientinfo.languagesspoken.push(languageobj);
        }





        angular.forEach($scope.obj.IsEthnicitySelected, function (kitem) {
            var obj = {
                "Id": kitem.Id || 0,
                "EthnicityName": kitem.Value,
                "EthnicityId": kitem.DropdownId,
                "IsSelected": true,
                "DeleteInd": 0
            }
            patientinfo.Ethnicity.push(obj);
        });
        angular.forEach($scope.obj.IsRaceSelected, function (kitem) {
            var obj = {
                "Id": kitem.Id || 0,
                "RaceName": kitem.Value,
                "RaceId": kitem.DropdownId,
                "IsSelected": true,
                "DeleteInd": 0
            }
            patientinfo.Race.push(obj);
        });

        //$scope.patientinfo.PatientInsuranceDetailsArray = [];


      

        var plancount = 0;

        if ($scope.patientinfo.PatientInsuranceDetailsArray.length > 0) {
            angular.forEach($scope.patientinfo.PatientInsuranceDetailsArray, function (pitem, indesx) {
                pitem.PlanId = pitem.PlanId || 0;
                pitem.PayorId = pitem.PayorId || 0;
                if (pitem.PayorId !== 0 && pitem.PlanId === 0) {
                    plancount++;
                }
            });
        }
     

        if (plancount > 0) {
            alertify.error("Please select a plan for the Payor");
            return false;
        }


        if ($scope.patientinfo.PatientInsuranceDetailsArray.length === 0) {
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
                hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                var branchcd = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.BranchCode;
                var hosid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                var BranchDetails = doctorinfo.doctordata.UserAddress[0];
                if ($scope.patientinfo.firstname !== undefined && $scope.patientinfo.PatientHomeNumber !== undefined) {

                    if ($scope.ShowSearchAndClear) {

                        eHnotePatientDataService.GetCheckPatientList($scope.patientinfo.firstname, $scope.patientinfo.lastname, $scope.patientinfo.PatientHomeNumber, parenthospid).then(function (resp) {
                            $scope.PatientExistingList = resp.data;
                            if ($scope.PatientExistingList[0].PatientId > 0) {
                                alertify.error("This Patient is Already Exist");
                                return;
                            }
                            else {
                                eHnotePatientDataService.RegisterPatient(patientinfo, hosid, hospid, branchcd, $scope.countrycodeval, $scope.countrycodeid, $scope.statecodeval, $scope.statecodeid, $scope.citycodeval, $scope.citycodeid, $scope.locationcodeval, $scope.familyidchange, $scope.patientid, $scope.regPaientBtnName, BranchDetails, $scope.file, OnAddPatientSuccess, OnAddPatientError);
                            }
                        });
                    } else {
                        eHnotePatientDataService.RegisterPatient(patientinfo, hosid, hospid, branchcd, $scope.countrycodeval, $scope.countrycodeid, $scope.statecodeval, $scope.statecodeid, $scope.citycodeval, $scope.citycodeid, $scope.locationcodeval, $scope.familyidchange, $scope.patientid, $scope.regPaientBtnName, BranchDetails, $scope.file, OnAddPatientSuccess, OnAddPatientError);
                    }

                }

            } else {
                hospid = undefined;
                var branchcd = undefined;
                var hosid = undefined;
                $scope.existfamilyid = "";
                $scope.patientid = 0;
                eHnotePatientDataService.RegisterPatient($scope.patientinfo, hosid, hospid, branchcd, $scope.countrycodeval, $scope.countrycodeid, $scope.statecodeval, $scope.statecodeid, $scope.citycodeval, $scope.citycodeid, $scope.locationcodeval, $scope.familyidchange, $scope.patientid, $scope.regPaientBtnName, BranchDetails, $scope.file, OnAddPatientSuccess, OnAddPatientError);
            }
        }
        else {
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
                hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                var branchcd = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.BranchCode;
                var hosid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                var BranchDetails = doctorinfo.doctordata.UserAddress[0];
                if ($scope.patientinfo.firstname !== undefined && $scope.patientinfo.PatientHomeNumber !== undefined) {

                    if ($scope.ShowSearchAndClear) {

                        eHnotePatientDataService.GetCheckPatientList($scope.patientinfo.firstname, $scope.patientinfo.lastname, $scope.patientinfo.PatientHomeNumber, parenthospid).then(function (resp) {
                            $scope.PatientExistingList = resp.data;
                            if ($scope.PatientExistingList[0].PatientId > 0) {
                                alertify.error("This Patient is Already Exist");
                                return;
                            }
                            else {
                                eHnotePatientDataService.RegisterPatient(patientinfo, hosid, hospid, branchcd, $scope.countrycodeval, $scope.countrycodeid, $scope.statecodeval, $scope.statecodeid, $scope.citycodeval, $scope.citycodeid, $scope.locationcodeval, $scope.familyidchange, $scope.patientid, $scope.regPaientBtnName, BranchDetails, $scope.file, OnAddPatientSuccess, OnAddPatientError);
                            }
                        });
                    } else {
                        eHnotePatientDataService.RegisterPatient(patientinfo, hosid, hospid, branchcd, $scope.countrycodeval, $scope.countrycodeid, $scope.statecodeval, $scope.statecodeid, $scope.citycodeval, $scope.citycodeid, $scope.locationcodeval, $scope.familyidchange, $scope.patientid, $scope.regPaientBtnName, BranchDetails, $scope.file, OnAddPatientSuccess, OnAddPatientError);
                    }

                }

            } else {
                hospid = undefined;
                var branchcd = undefined;
                var hosid = undefined;
                $scope.existfamilyid = "";
                $scope.patientid = 0;
                eHnotePatientDataService.RegisterPatient($scope.patientinfo, hosid, hospid, branchcd, $scope.countrycodeval, $scope.countrycodeid, $scope.statecodeval, $scope.statecodeid, $scope.citycodeval, $scope.citycodeid, $scope.locationcodeval, $scope.familyidchange, $scope.patientid, $scope.regPaientBtnName, BranchDetails, $scope.file, OnAddPatientSuccess, OnAddPatientError);
            }

        }
    };

    function OnAddPatientSuccess(data) {
        if ($scope.patientinfo.patientid === 0) {
            alertify.success("Patient Add Successfully");
        }
        else {
            alertify.success("Patient Updated Successfully");
        }
        var url = "/op";
        $location.url(url);
        //SetupPopUp = $uibModal.open({
        //    templateUrl: 'appointMentPopupId1.html',
        //    scope: $scope
        //});
    }

    $scope.toppings = [
        { category: 'meat', name: 'Pepperoni' },
        { category: 'meat', name: 'Sausage' },
        { category: 'meat', name: 'Ground Beef' },
        { category: 'meat', name: 'Bacon' },
        { category: 'veg', name: 'Mushrooms' },
        { category: 'veg', name: 'Onion' },
        { category: 'veg', name: 'Green Pepper' },
        { category: 'veg', name: 'Green Olives' }
    ];

    $scope.selectInsuranceFileUpload = function (file, insItem, index) {
        $scope.file = "";
        $scope.file = file;
        if ($scope.file != null) {
            var pName = $scope.file.name, name = "";
            var type = $scope.file.type.split("/")[1];
            if (pName.length > 9) {
                name = pName.substring(0, 9) + "..." + "." + type;
            } else {
                name = angular.copy(pName) + '.' + type;
            }


            var obj = {
                "file": $scope.file,
                "DeleteInd": false,
                "DocumentId": 0,
                "DocumentExt": $scope.file.type,
                "DisplayName": name
            };

            insItem.TempInsuranceImagesArray.push(obj);

            angular.element("input[type='file']").val(null);
        }
    };


    $scope.backItemUpload = false;
    $scope.frontItemUpload = false;

    $scope.selectInsuranceFrontFileUpload = function (file, insItem, index) {
        $scope.Ffile = "";
        $scope.Ffile = file;
        $scope.frontItemUpload = true;
        if ($scope.Ffile != null) {
            var pName = $scope.Ffile.name, name = "";
            var type = $scope.Ffile.type.split("/")[1];
            if (pName.length > 9) {
                name = pName.substring(0, 9) + "..." + "." + type;
            } else {
                name = angular.copy(pName) + '.' + type;
            }


            var obj = {
                "file": $scope.Ffile,
                "DeleteInd": false,
                "DocumentId": 0,
                "DocumentExt": $scope.Ffile.type,
                "DocumentName": name,
                "DisplayName": "Front"
            };

            insItem.TempInsuranceImagesArray.push(obj);

            angular.element("input[type='file']").val(null);
        }
    };


    $scope.selectInsuranceBackFileUpload = function (file, insItem, index) {
        $scope.Bfile = "";
        $scope.Bfile = file;
        $scope.backItemUpload = true;
        if ($scope.Bfile != null) {
            var pName = $scope.Bfile.name, name = "";
            var type = $scope.Bfile.type.split("/")[1];
            if (pName.length > 9) {
                name = pName.substring(0, 9) + "..." + "." + type;
            } else {
                name = angular.copy(pName) + '.' + type;
            }


            var obj = {
                "file": $scope.Bfile,
                "DeleteInd": false,
                "DocumentId": 0,
                "DocumentExt": $scope.Bfile.type,
                "DocumentName": name,
                "DisplayName": "Back"
            };

            insItem.TempInsuranceImagesArray.push(obj);

            angular.element("input[type='file']").val(null);
        }
    };



    $scope.RemoveInsuranceimage = function (item, index) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            item.DeleteInd = true;
            if ($scope.patientinfo.PatientInsuranceDetailsArray[index].TempInsuranceImagesArray.length > 0) {
                for (var k = 0; k < $scope.patientinfo.PatientInsuranceDetailsArray[index].TempInsuranceImagesArray.length; k++) {
                    if ($scope.patientinfo.PatientInsuranceDetailsArray[index].TempInsuranceImagesArray[k].DeleteInd === true) {
                        $scope.patientinfo.PatientInsuranceDetailsArray[index].TempInsuranceImagesArray.splice(k, 1);
                    }
                }
            }
        }, function () {
            return;
        });
    };

    $scope.RemoveInsuranceDocuments = function (item, index) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            item.DeleteInd = true;
            if ($scope.patientinfo.PatientInsuranceDetailsArray[index].PatientDocumentDetails.length > 0) {
                for (var k = 0; k < $scope.patientinfo.PatientInsuranceDetailsArray[index].PatientDocumentDetails.length; k++) {
                    if ($scope.patientinfo.PatientInsuranceDetailsArray[index].PatientDocumentDetails[k].DeleteInd === true) {
                        $scope.patientinfo.PatientInsuranceDetailsArray[index].PatientDocumentDetails.splice(k, 1);
                    }
                }
            }
        }, function () {
            return;
        });
    };


    $scope.countyCodesArray = [];

    $scope.searchCountyByZipCode = function (zipcode) {
        eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
            console.log(resp);
            $scope.countyCodesArray = resp.data.rows || [];
        });
    };
    $scope.ChangeCountyZip = function (pitem) {
        pitem.ZipCodePlusNo = pitem.CountyCodeObj.COUNTY;
    };


    $scope.SearchPCPDOClist = function () {
        var reqObj = {
            'LocationId': null,
            'PageNumber': 1,
            'PageSize': 1000,
            'SearchTaxt': '',
            "SpecializationId": $scope.SpecializationId,
            "DeleteInd": 'N',
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID

        };

        eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.ReferalPCPDoctorsList = resp.data.PcpRefdetails;
                $scope.ReferalPCPDoctorsListCount = resp.data.count;

            }
            else {
                alertify.error(resp.data.Message);
            }

        });
    }
    $scope.SearchPCPDOClist();
    $scope.getDoctorsbySubSpecializations = function (branchId, type) {

        console.log(branchId);
        var branchesList = [];
        $scope.BranchDoctorsList = [];
        $scope.allUserList = [];
        $scope.UserObject = {
            "DoctorObj": {
                "FullName": "Select",
                "DoctorName": "Select"
            },
            "DoctorObj2": {
                "FullName": "Select"
            },
            "DoctorObj3": {
                "FullName": "Select"
            },
            "HospitalObj": {
                "ClinicName": "Select"
            },
            "ParentHospitalObj": {
                "ClinicName": "Select"
            }
        };

        if (type === "") {
            $scope.patientinfo.PCP = 0;
            $scope.patientinfo.Provider1 = 0;
            $scope.patientinfo.Provider2 = 0;
            $scope.patientinfo.Corporation = 0;
            $scope.patientinfo.Office = 0;
        }


        var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
        var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
        angular.forEach(TempAppListdoctoraddress, function (items) {
            branchesList.push(items.BranchId);
        });




        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }



        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;


                if ($scope.allUserList.length !== 0) {
                    $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                }





                if ($scope.BranchDoctorsList.length > 0) {
                    $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) { return p.DoctorID; });
                    $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
                    });
                }

                //var DoctorID = doctorinfo.doctordata.User[0].DoctorID;

                //var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == DoctorID })[0];

                //if (doctorinfo.doctordata.User[0].RoleId !== 10 && doctorinfo.doctordata.User[0].RoleId !== 55 && doctorinfo.doctordata.User[0].RoleId !== 2) {
                //    $scope.UserObject.DoctorObj = DoctorObj;
                //}
                //else {
                //    $scope.UserObject.DoctorObj = $scope.BranchDoctorsList[0];
                //}

                if (type === "Edit") {

                    $scope.patientinfo.PCP = parseFloat($scope.patientinfo.PCP) || 0;
                    $scope.patientinfo.Provider1 = parseFloat($scope.patientinfo.Provider1) || 0;
                    $scope.patientinfo.Provider2 = parseFloat($scope.patientinfo.Provider2) || 0;
                    $scope.patientinfo.Corporation = parseFloat($scope.patientinfo.Corporation) || 0;
                    $scope.patientinfo.Office = parseFloat($scope.patientinfo.Office) || 0;


                    //if ($scope.patientinfo.PCP !== 0) {
                    //    var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == $scope.patientinfo.PCP })[0];
                    //    $scope.UserObject.DoctorObj = DoctorObj;
                    //}

                    if ($scope.patientinfo.PCP !== 0) {
                        var DoctorObj = $filter("filter")($scope.ReferalPCPDoctorsList, function (item, index) { return item.PcpReferralId == $scope.patientinfo.PCP })[0];
                        $scope.UserObject.DoctorObj = DoctorObj;
                    }

                    if ($scope.patientinfo.Provider1 !== 0) {
                        var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == $scope.patientinfo.Provider1 })[0];
                        $scope.UserObject.DoctorObj2 = DoctorObj;
                    }

                    if ($scope.patientinfo.Provider2 !== 0) {
                        var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == $scope.patientinfo.Provider2 })[0];
                        $scope.UserObject.DoctorObj3 = DoctorObj;
                    }

                    if ($scope.patientinfo.Corporation !== 0) {
                        var HospObj = $filter("filter")($scope.AllUserBranchesList, function (item, index) { return item.ClinicId == $scope.patientinfo.Corporation })[0];
                        $scope.UserObject.ParentHospitalObj = HospObj;
                    }

                    if ($scope.patientinfo.Office !== 0) {
                        var HospObj = $filter("filter")($scope.AllUserBranchesList, function (item, index) { return item.ClinicId == $scope.patientinfo.Office })[0];
                        $scope.UserObject.HospitalObj = HospObj;
                    }






                }



            } else {
                alertify.error("No Doctors Found in Selected Hospital");

            }


        }

        function onGetUsersFailure(data) {
        }
    }
    function GetBranchSubSpecializations(SubOrganizationId, BranchId, type) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                console.log($scope.allSubSpecializationsArray);
                $scope.getDoctorsbySubSpecializations(BranchId, type);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };
    function InitializeNewBranches(type) {
        var Type = type || "";
        var brancList = localStorageFactory.getItem("allBranchesData") || [];
        var data = brancList;
        $scope.AllUserBranchesList = [];
        if (data.length !== 0) {


            //   BrachesList = eHnoteUserAppointmentDataService.RestructureBranches(true, data, doctorInfo) || [];
            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];
            //  structureDoctors(BrachesList);
            //var EmptyClinicObj = {
            //    "ClinicName": "All Locations",
            //    "ClinicId": 0,
            //    "Address1": "",
            //    "Address2": "",
            //    "Location": "",
            //    "StateId": "",
            //    "PinCode": "",
            //    "CountryId": "",
            //    "CityId": "",
            //    "DistrictRegion": "",
            //    "Latitude": "",
            //    "Longitude": "",
            //    "BranchEmail": "",
            //    "CountryCode": "",
            //    "mobilenum": "",
            //    "Active": "Y",
            //    "Doctors": []

            //};
            //BrachesList.unshift(EmptyClinicObj);

            $scope.AllUserBranchesList = BrachesList;
            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];
            var RoleID = userLoginDetails.RoleID;


            $scope.clinicDoctorList = [];

            $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.UserObject.HospitalObj = $scope.defaultbranch[0];

            if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                angular.forEach($scope.BranchesListArray, function (item, index) {
                    if (item.ClinicName !== "All Locations") {
                        if (item.ExtDetails.HospitalID === $scope.hospid) {
                            $scope.selectedBranch = item;
                            $scope.UserObject.HospitalObj = item;
                        }
                    }
                });
            }
        }

        // InitialiseBranchDoctor();
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, Type);

    }
    $scope.BranchesListArray = [];
    $scope.BranchDoctorsList = [];
    $scope.allUserList = [];

    $scope.UserObject = {
        "DoctorObj": {
            "FullName": "Select",
            "DoctorName": "Select"
        },
        "DoctorObj2": {
            "FullName": "Select"
        },
        "DoctorObj3": {
            "FullName": "Select"
        },
        "HospitalObj": {
            "ClinicName": "Select"
        },
        "ParentHospitalObj": {
            "ClinicName": "Select"
        }
    };

    $scope.ChangePCPUser = function (doctorobj) {
        //$scope.UserObject.DoctorObj = doctorobj;
        //$scope.patientinfo.PCP = doctorobj.DoctorID;

        $scope.UserObject.DoctorObj = doctorobj;
        $scope.patientinfo.PCP = doctorobj.PcpReferralId;
    };

    $scope.ChangeProvider1User = function (doctorobj) {
        $scope.UserObject.DoctorObj2 = doctorobj;
        $scope.patientinfo.Provider1 = doctorobj.DoctorID;
    };

    $scope.ChangeProvider2User = function (doctorobj) {
        $scope.UserObject.DoctorObj3 = doctorobj;
        $scope.patientinfo.Provider2 = doctorobj.DoctorID;
    };
    $scope.ChangeCorporationHospital = function (item) {
        $scope.UserObject.ParentHospitalObj = item;
        $scope.patientinfo.Corporation = item.ClinicId;
    };

    $scope.ChangeOfficeHospital = function (item) {
        $scope.UserObject.HospitalObj = item;
        $scope.patientinfo.Office = item.ClinicId;
    };


    $scope.SavePatientInsuranceUploads = function (insitem) {






        var obj = {
            "PatientId": $scope.patientinfo.patientId,
            "FullName": $scope.patientinfo.firstname,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "patientInsuranceDetails": []
        };

        obj.patientInsuranceDetails.push(insitem);


        obj.patientInsuranceDetails[0].PatientDocumentDetails = [];
        angular.forEach(insitem.TempInsuranceImagesArray, function (item) {
            item.DocumentId = item.DocumentId || 0;
            item.S3URL = item.S3URL || "";
            if (item.DocumentId === 0) {

                var isfront = false;
                if (item.DisplayName === "Front") { isfront = true; };
                var object = {
                    "DocumentTypeId": 4,
                    "DocumentName": item.DocumentName,
                    "DocumentExt": item.DocumentExt,
                    "S3URL": item.S3URL,
                    "file": item.file,
                    "DeleteInd": item.DeleteInd,
                    "DocumentId": item.DocumentId,
                    "IsBackSidefile": isfront
                };
                obj.patientInsuranceDetails[0].PatientDocumentDetails.push(object);
            }

        });

        obj.patientInsuranceDetails[0].ExpiryDate = $filter("dateFormatter")(insitem.ExpiryDate, "-");
        obj.patientInsuranceDetails[0].EffectiveDate = $filter("dateFormatter")(insitem.EffectiveDate, "-");
        obj.patientInsuranceDetails[0].ScanDate = $filter("dateFormatter")(insitem.ScanDate, "-");
        obj.patientInsuranceDetails[0].VerifiedDate = $filter("dateFormatter")(insitem.VerifiedDate, "-");




        console.log(JSON.stringify(obj));

        eHnotePatientDataService.SavePatientInsuranceDetailsById(obj, OnAddPatientSuccess, OnAddPatientError);
        function OnAddPatientSuccess(resp) {
            console.log(JSON.stringify(resp));
            if (resp.Status === "Success") {
                insitem.PatientInsuranceDetailId = resp.PatientInsuranceDetailId;
                insitem.PatientDocumentDetails = resp.DocumentDetails || [];

                $scope.modelIntance.close(insitem);
            }
        }
        function OnAddPatientError() {
            alertify.error("Creating  Failed");
        }




    };


    $scope.PatientComanagingArray = [];
    $scope.PatientAttornyArray = [];
    $scope.PatientPharmacyArray = [];
    $scope.PatientBillingTypeArray = [];
    $scope.PatientClassArray = [];
    $scope.PatientAmbulatoryArray = [];

    var Comanagingobj = {
        "Id": 1,
        "Name": "Comanaging 1"
    };
    $scope.PatientComanagingArray.push(Comanagingobj);

    var Attornyobj = {
        "Id": 1,
        "Name": "Attorny 1"
    };
    $scope.PatientAttornyArray.push(Attornyobj);

    var Pharmacyobj = {
        "Id": 1,
        "Name": "Pharmacy 1"
    };
    $scope.PatientPharmacyArray.push(Pharmacyobj);

    var BillingTypeobj = {
        "Id": 1,
        "Name": "BillingType 1"
    };
    $scope.PatientBillingTypeArray.push(BillingTypeobj);

    var ClassTypeobj = {
        "Id": 1,
        "Name": "Class 1"
    };
    $scope.PatientClassArray.push(ClassTypeobj);

    var Ambulatory = {
        "Id": 1,
        "Name": "Ambulatory 1"
    };
    $scope.PatientAmbulatoryArray.push(Ambulatory);



    $scope.ChangeComanaging = function (item) {
        item.ComanagingObj = item.ComanagingObj || "";
        if (item.ComanagingObj != "") {
            item.PatientComanagingId = item.ComanagingObj.Id;
        }
    };
    $scope.ChangePatientClass = function (item) {
        item.ClassObj = item.ClassObj || "";
        if (item.ClassObj != "") {
            item.PatientClassId = item.ClassObj.Id;
        }
    };


    $scope.ChangeAttorny = function (item) {
        item.AttornyObj = item.AttornyObj || "";
        if (item.AttornyObj != "") {
            item.PatientAttornyId = item.AttornyObj.Id;
        }
    };

    $scope.ChangePharmacy = function (item) {
        item.PharmacyObj = item.PharmacyObj || "";
        if (item.PharmacyObj != "") {
            item.PatientPharmacyId = item.PharmacyObj.Id;
        }
    };

    $scope.ChangePatientBillingType = function (item) {
        item.BillingTypeObj = item.BillingTypeObj || "";
        if (item.BillingTypeObj != "") {
            item.PatientBillingTypeId = item.BillingTypeObj.Id;
        }
    };

    $scope.ChangePatientClass = function (item) {
        item.ClassObj = item.ClassObj || "";
        if (item.ClassObj != "") {
            item.PatientClassId = item.ClassObj.Id;
        }
    };

    $scope.ChangeAmbulatory = function (item) {
        item.AmbulatoryObj = item.AmbulatoryObj || "";
        if (item.AmbulatoryObj != "") {
            item.PatientAmbulatoryId = item.AmbulatoryObj.Id;
        }
    };

   
 
    
    $scope.PayorAllLIstArray = [];
    $scope.GetOrganizationPayorAllList = function () {
         

        var param = {
            "SearchText": "",
            "PageSize": 10000,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": 1,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": 0,
            "PayorTypeId": 0
        }
        eHnoteInsuranceService.GetOrganizationPayorsList(param).then(function (resp) {
          
            $scope.PayorAllLIstArray = [];
            if (resp.data.Status === "Success") {
                $scope.PayorAllLIstArray = resp.data.rows;

                console.log($scope.PayorAllLIstArray);

            } else {

            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.GetOrganizationPayorAllList();
    $scope.payorPlansListArray = [];
    $scope.ChangeInsurancePayor = function (obj, mainitem) {

        mainitem.payorPlansListArray = [];
    
        mainitem.PayorId = obj.PayorId;

        

        var param = {
            "SearchText": "",
            "PageSize": 10,
            "PageNumber":1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId":1,
            "ParentOrganizationId": $scope.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": obj.PayorId
        }
        eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

            mainitem.payorPlansListArray = [];
            if (resp.data.Status === "Success") {
                mainitem.payorPlansListArray = resp.data.rows || [];
               
            }
        }, function (error) {
            console.log(error);
        });

    }



    $scope.PlanDetailsArray = [];
    $scope.GetMasterPayorPlanTypes = function () {
        eHnoteInsuranceService.GetMasterPayorPlanTypes().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.PlanDetailsArray = resp.data.rows;
            }
        }, function (error) {
            console.log(error);
        });
    };


    $scope.ChangePayorPlan = function (mainitem) {
        mainitem.PlanId = mainitem.PlanObj.PlanId;
        mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
    }
    $scope.GetMasterPayorPlanTypes();
}]);

"use strict";
eHnoteWebApp.controller("UsEditPatientProfileCtrlv2", ["$scope", "$rootScope", "$route", "$location", "$filter", "eHnoteMainAppointmentService", "eHnoteAuditServices", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$q", "eHnoteUserDataService", "eHnoteCacheStorageService", "alertify", "$timeout", "$uibModal", "datapersistanceFactory", "eHnoteSettingsDataService", "mainObject", "$uibModalInstance", "eHnotePatientDataService", "eHnoteInsuranceService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteDiagnosisDataServices", 'eHnoteDbStaticDataService', "eHnoteReferalDataService","eHnoteMainAdminServices",
    function ($scope, $rootScope, $route, $location, $filter, eHnoteMainAppointmentService, eHnoteAuditServices, eHnoteMasterDataService, eHnotePatientAddressDataServices, $q, eHnoteUserDataService, eHnoteCacheStorageService, alertify, $timeout, $uibModal, datapersistanceFactory, eHnoteSettingsDataService, mainObject, $uibModalInstance, eHnotePatientDataService, eHnoteInsuranceService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteDiagnosisDataServices, eHnoteDbStaticDataService, eHnoteReferalDataService, eHnoteMainAdminServices) {

      
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.CountryId = doctorinfo.doctordata.UserAddress[0].CountryId;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        console.log(JSON.stringify(mainObject));
        $scope.AddEdit = mainObject.AddEdit;
        $scope.todayDate = new Date();
        var brancList = localStorageFactory.getItem("allBranchesData") || [];
        var data = brancList;
        $scope.$route = $route;
        $scope.AllUserBranchesList = [];
        if (data.length !== 0) {
            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];
            $scope.AllUserBranchesList = BrachesList;
        }
        $scope.closeuib = function () {
            $uibModalInstance.close('Rcopia');
        };

        $scope.mainEditPatientProfileObj = {
            "MainTab":1
        }
        $scope.ShowInsCopyBtn = false;
        $scope.TagPatientObj = {
            "SelectTag": "Select Tag Patient",
            "PatientTag": "",
            "AllPatientTagsCheck": false,
        };
        var OverAllPatientSave = false;
        function GetPatientDetailsInfo() {
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientID": 0,
                "PatientProfilePicDetails": [],
                "PatientTagId": 0,
                "PatientTagName": "",
                "PatientTagObj": "",
                "Title": "",
                "TitleId": 0,
                "FirstName": "",
                "MiddleName": "",
                "LastName": "",
                "DOB": "",
                "SocialSecurityNo": "",
                "Gender": "",
                "MaritalStatusID": "",
                "MaritalStatusName": "",
                "BloodGroupObj": {},
                "BloodGroupName": "",
                "BloodGroupId": 0,
                "MobileNumber": "",
                "FaxNumber": "",
                "Faxcountrycode": "",
                "FaxAreacode": "",
                "FaxHomeNumber": "",
                "ContactInfo": {
                    "PatientHomeCode": "",
                    "PatientHomeNumber": "",
                    "PatientOfficeCode": "",
                    "PatientOfficeNumber": "",
                    "EmailID": "",
                    "HomeCountryCode": "+1",
                    "HomeAreaCode": "",
                    "HomeNumber": "",
                    "OfficeCountryCode": "+1",
                    "OfficeAreaCode": "",
                    "OfficeNumber": "",
                    "MobileNumber": "",
                    "ContactNumber": "",
                    "AuthorizationId": "",
                    "IsPatientSmsInd": false,
                    "IsPatientEmailInd": false
                },
                "CurrentAge": "",
                "S3URL": "",
                "LeadSourceInd": "N",
                "PatientDisplayID": "",
                "Age": "",
                "DisplayMobileNumber": "",
                "DisplayAlternateNumber": "",
                "SecondLastName": "",
                "SecondLastNameInd": true,
                "IsNoChargePatient": false,
                "IsDiseased": false,
                "CauseOfDeath": "",
                "DateOfDeath": "",
                "OccupationId": null,
                "OccupationDescription": "",
                "EmployerPhoneNo": "",
                "Emergency": "",
                "EmergencyMobile": "",
                "FatherName": "",
                "MotherName": "",
                "Guardian": "",
                "Employer": "",
                "OldMrno": "",
                "BirthSex": "",
                "AuthorizedUserFullName": "",
                "AuthorizedUserEmailId": "",
                "AuthorizedUserMobileNo": "",
                "EmergencyRelationId": 0,
                "IsfutureCommunications": false,
                "SuffixName": "",
                "HospitalReferenceId": null,
                "ReferenceNotes": "",
                "IsAllowAiAutomatedCalls": false
            }
            return obj;
        }

        $scope.PatientDetailsInfo = GetPatientDetailsInfo();

        function IscheckMobileOrname() {
            var inputText = mainObject.PatientDetails || "";
            if (!inputText) {
                return "Invalid Input";
            }

            var trimmedInput = inputText.trim();
            var digitOnly = trimmedInput.replace(/\D/g, ""); 

            if (digitOnly.length > 10) {
                digitOnly = digitOnly.substring(0, 10);
            }

            var mobileRegex = /^\d{10}$/;
            if (mobileRegex.test(digitOnly)) {
                var obj = eHnoteUserDataService.UsMobileFormatChange(digitOnly);
                $scope.PatientDetailsInfo.DisplayMobileNumber = obj.UsFormatMobileNumber;
                $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = digitOnly.substring(0, 3);
                $scope.PatientDetailsInfo.ContactInfo.HomeNumber = digitOnly.substring(3);
            } else {
                $scope.PatientDetailsInfo.FirstName = inputText || "";
            }
        }

        $scope.daysList = [0,1, 2, 3, 4, 5, 6, 7];
       
        function GetInsuranceObj() {
            var obj = {
                "CoverageId": 0,
                "CoverageName": "",
                "CoverageObj": "",
                "PatientInsuranceDetailId": 0,
                "PlanId": 0,
                "PlanObj": "",
                "Payor": "",
                "PayorId": 0,
                "PayorObj": "",
                "PlanTypeId": 0,
                "PolicyId": "",
                "GroupId": "",
                "GroupName": "",
                "RelationShipId": 1,
                "InsuranceRelationShipObj": "",
                "PolicyHolder": "",
                "PolicyHolderName": "",
                "Employer": "",
                "Coinsurance": "",
                "VisitCopay": "",
                "EffectiveDate": "",
                "ExpiryDate": "",
                "ScanDate": "",
                "VerifiedDate": "",
                "DeleteInd": false,
                "AcceptAssign": "",
                "AssignBenifits": "",
                "ReleaseInfo": "",
                "LaboratoryId": 0,
                "StatusId": 1,  //0,
                "Comments": "",
                "MSPTrailerTypeId": 0,
                "Staff": "",
                "PatientDocumentDetails": [],
                "MsnTyp": "",
                "IsAcceptAssign": 0,
                "IsAcceptAssignBenifits": 0,
                "IsReleaseInfo": 0,
                "PatientBillingTypeId": 0,
                "TempInsuranceImagesArray": [],
                "InsuredPersonFirstName": "",
                "InsuredPersonMiddleName": "",
                "InsuredPersonLastName": "",
                "InsuredPersonSecondLastName": "",
                "InsuredPersonSuffix": "",
                "InsuredPersonDOB": "",
                "EligibleInsuredPersonDOB": "",
                "InsuredPersonGenderID": "",
                "InsuredPersonSSN": "",
                "IdentifierId": null,
                "IsDefaultBillingIns": false,
                "IPA": "",
                "PCP": "",
                "OrganizationPayorId": 0,
                "OrganizationPayorName": "",
                "IsVerified": false,
                "AppointmentInsuranceDetailId": 0,
                "PatientFirstName": "",
                "PatientMiddleName": "",
                "PatientLastName": "",
                "PatientSecondLastName": "",
                "PatientSuffix": "",
                "PatientDOB": "",
                "PatientSSN": "",
                "IsIdentifier": false,
                "VerifiedBy": 0,
                "EligibilityStatusId": 1,
                "IsConnectToFutureAppointment": false,
                "IsInsuranceConnectedAppointment": false,
                "IsPolicyIdRenewInd": false,
                "IsGroupIdDiasibleInd": false,
                "IsPolicyIdDiasibleInd": false,
                "IsPayorPlanDiasibleInd": false,
                "IsAddnewInsuranceInd": false,
                "IsAddnewInsurancePlanInd": false,
                "InsuranceDeactiveDetailId": 0,
                "IsPlanEnabled": true,
                "IsCoverageEnabled": false,
                "IsPolicyIdEnabled": false,
                "IsGroupIdEnabled": false,
                "InsuranceDeactiveDetailId": 0,
                "InactiveActiveInsurance": false,
                "ConnectCurrentInsuranceInd": false,
                "ConnectInsuranceToAppointmentFrom": null,
                "MSPInsuranceTypeId": null,
                "PayorTypeId": null,
            }
            return obj;
        }
        $scope.PatientInsuranceObj = GetInsuranceObj();
        $scope.GetTempInsuranceObj = function () {
            var obj = {
                "PatientInsuranceDetailId": 0,
                "GroupId": "",
                "PolicyId": "",
                "PayorId": "",
                "PlanId": ""
            }
            return obj;
        }
        $scope.TempInsuranceObj = $scope.GetTempInsuranceObj();
        function GetPatientAddress() {
            var obj = {
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
                },
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
                "IsCheckCopy": false,
                "PatientAddressDocuments": []
            }
            return obj;
        }
        $scope.PatientAddressInfo = GetPatientAddress();

        function GetDemographicInfo() {
            var obj = {
                "PatientId": 0,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "Ethnicity": [],
                "Race": [],
                "PreferedLanguage": [],
                "PreferedLanguageId": 0,
                "PreferedLanguageName": "",
                "PreferedLanguageObj": "",
                "ExpressionId": 0,
                "Expression": "",
                "ExpressionObj": "",
                "Proficiency": "",
                "ProficiencyId": 0,
                "ProficiencyObj": "",
                "MultipleBirth": "",
                "MothersMiddleName": "",
                "PatientPrefixListName": "",
                "PatientPrefixListId": 0,
                "PatientPrefixObj": "",
                "FirstName": "",
                "MiddleName": "",
                "LastName": "",
                "PatinetSuffixId": 0,
                "PatientSuffixName": "",
                "PatinetSuffixObj": "",
                "SexualOrientation": "",
                "SexualOrientationId": 0,
                "NametoUse": "",
                "PronounName": "",
                "PronounId": 0,
                "SexualOrientationObj": "",
                "GenderIdentityStatus": "",
                "GenderIdentityStatusId": 0,
                "GenderIdentityStatusObj": "",
                "LanguageID": "",
                "RaceID": "",
                "EthnicityID": "",
                "EthnicityName": "",
                "RaceName": "",
                "LanguageName": "",
                "LGuardianFirstName": "",
                "LGuardianMiddleName": "",
                "LGuardianLastName": "",
                "PatFatherFirstName": "",
                "LGuardianFullname": "",

                "EducationId": 0,               
                "ResourceName": "",
                "ResourceId": 0,
                "QuestionName": "",
              

            }
            return obj;
        }
        $scope.DemographicInfo = GetDemographicInfo();

      
        function GetFamilyInfo() {
            var obj = {
                "FamilyArray": [{
                    "PatientId": 0,
                    "FamilyId": 0,
                    "DeleteInd": "N",
                    "Title": "",
                    "TitleId": 0,
                    "FirstName": "",
                    "LastName": "",
                    "Relation": "",
                    "RelationId": "",
                    "AreaCode": "",
                    "MobileNumber": "",
                    "ParentPatientId": 0,
                    "RelationObj": "",
                    "Age": "",
                    "DOB": "",
                    "CurrentAge": "",
                    "ageinYears": "",
                    "ageinMonths": "",
                    "ageinDays": "",
                    "CountryCode": "+1",
                    "PhoneNumber": "",
                    "Gender": "Male",
                    "AreaCodeInd": false,
                    "FamilyPhoneNumber": "",
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
                    "ZipCodeArray": [],
                    "Address": "",
                    "Informant": "",
                }]
            }
            return obj;
        }
        $scope.FamilyInfo = GetFamilyInfo();

        $scope.obj = {
            "IsEthnicitySelected": [],
            "IsRaceSelected": []
        }

        $scope.SaveTypeObj = {
            "TypeName": ""
        };

        function getpayorPlanslistObj() {
            var obj = {
                "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "OrganizationPayorId": 0,
                "TotalCount": 0,
                "PayorObj": ""
            }
            return obj;
        }
        $scope.payorPlansListObj = getpayorPlanslistObj();
        $scope.switchEditProfileTab = function (tabno) {
           // $scope.mainEditPatientProfileObj.MainTab = tabno;

            $scope.currentTabName = angular.copy($scope.SaveTypeObj.TypeName);


            $scope.ContinuePatientSaveOnTabClick(tabno, $scope.currentTabName);

            if ($scope.mainEditPatientProfileObj.MainTab === 1) {
                $scope.SaveTypeObj.TypeName = 'PatientDetails';
            }else if ($scope.mainEditPatientProfileObj.MainTab === 2) {
                $scope.SaveTypeObj.TypeName = 'AddressDetails';
            }else if ($scope.mainEditPatientProfileObj.MainTab === 3) {
                $scope.SaveTypeObj.TypeName = 'InsuranceDetails';               
                if (!$scope.ValidateIndictor) {
                    if ($scope.PatientInsuranceSummary.length > 0) {
                        $scope.ShowInsuranceAddnew = true;
                    }
                    else {
                        $scope.ShowInsuranceAddnew = false;
                    }
                }
                $scope.ShowInsCopyBtn = false;
            }else if ($scope.mainEditPatientProfileObj.MainTab === 4) {
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            }else if ($scope.mainEditPatientProfileObj.MainTab === 5) {
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';
            }
        }

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }


        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };


        $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");


        // Patient Registraion Mandatory 

        $scope.IsMobileNoManadatory = false;
        $scope.IsFirstNameNoManadatory = false;
        $scope.IsMiddleNameNoManadatory = false;
        $scope.IsLastNameNoManadatory = false;

        $scope.IsDOBNoManadatory = false;
        $scope.IsGenderNoManadatory = false;

        $scope.IsEmailIdNoManadatory = false;
        $scope.IsAlternativeNumberNoManadatory = false;
        $scope.IsEmployerNameNoManadatory = false;
        $scope.IsEmployerPhoneNumberNoManadatory = false;
        $scope.IsOccupationNoManadatory = false;
        $scope.IsAddressDetailsNoManadatory = false;

        $scope.IsPlannameNoManadatory = false;
        $scope.IsPayornameNoManadatory = false;
        $scope.IsPolicyIDNoManadatory = false;
        $scope.IsGroupIDNoManadatory = false;
        $scope.IsEffectivedateNoManadatory = false;
        $scope.IsExpirydateNoManadatory = false;
        $scope.IsCoverageNoManadatory = false;

        $scope.IsSecondLastNameMandatory = false;
        $scope.IsNoChargePatientMandatory = false;
        $scope.IsPreviousNameMandatory = false;
       
        if ($scope.OrganizationSettingsData !== undefined) {       
            if ($scope.OrganizationSettingsData.PatientRegistration.IsMobileNoManadatory === 1) {
                $scope.IsMobileNoManadatory = true;
            }
            else {
                $scope.IsMobileNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsFirstNameNoManadatory === 1) {
                $scope.IsFirstNameNoManadatory = true;
            }
            else {
                $scope.IsFirstNameNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsMiddleNameNoManadatory === 1) {
                $scope.IsMiddleNameNoManadatory = true;
            }
            else {
                $scope.IsMiddleNameNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsLastNameNoManadatory === 1) {
                $scope.IsLastNameNoManadatory = true;
            }
            else {
                $scope.IsLastNameNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsDOBNoManadatory === 1) {
                $scope.IsDOBNoManadatory = true;
            }
            else {
                $scope.IsDOBNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsMiddleNameNoManadatory === 1) {
                $scope.IsMiddleNameNoManadatory = true;
            }
            else {
                $scope.IsMiddleNameNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsGenderNoManadatory === 1) {
                $scope.IsGenderNoManadatory = true;
            }
            else {
                $scope.IsGenderNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsEmailIdNoManadatory === 1) {
                $scope.IsEmailIdNoManadatory = true;
            }
            else {
                $scope.IsEmailIdNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsAlternativeNumberNoManadatory === 1) {
                $scope.IsAlternativeNumberNoManadatory = true;
            }
            else {
                $scope.IsAlternativeNumberNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsEmployerNameNoManadatory === 1) {
                $scope.IsEmployerNameNoManadatory = true;
            }
            else {
                $scope.IsEmployerNameNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsEmployerPhoneNumberNoManadatory === 1) {
                $scope.IsEmployerPhoneNumberNoManadatory = true;
            }
            else {
                $scope.IsEmployerPhoneNumberNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsOccupationNoManadatory === 1) {
                $scope.IsOccupationNoManadatory = true;
            }
            else {
                $scope.IsOccupationNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsAddressDetailsNoManadatory === 1) {
                $scope.IsAddressDetailsNoManadatory = true;
            }
            else {
                $scope.IsAddressDetailsNoManadatory = false;
            }



            if ($scope.OrganizationSettingsData.PatientRegistration.IsGroupIDNoManadatory === 1) {
                $scope.IsGroupIDNoManadatory = true;
            }
            else {
                $scope.IsGroupIDNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsPolicyIDNoManadatory === 1) {
                $scope.IsPolicyIDNoManadatory = true;
            }
            else {
                $scope.IsPolicyIDNoManadatory = false;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.IsPayornameNoManadatory === 1) {
                $scope.IsPayornameNoManadatory = true;
            }
            else {
                $scope.IsPayornameNoManadatory = false;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.IsPlannameNoManadatory === 1) {
                $scope.IsPlannameNoManadatory = true;
            }
            else {
                $scope.IsPlannameNoManadatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsEffectivedateNoManadatory === 1) {
                $scope.IsEffectivedateNoManadatory = true;
            }
            else {
                $scope.IsEffectivedateNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsExpirydateNoManadatory === 1) {
                $scope.IsExpirydateNoManadatory = true;
            }
            else {
                $scope.IsExpirydateNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsCoverageNoManadatory === 1) {
                $scope.IsCoverageNoManadatory = true;
            }
            else {
                $scope.IsCoverageNoManadatory = false;
            }


            if ($scope.OrganizationSettingsData.PatientRegistration.IsPreviousNameMandatory === 1) {
                $scope.IsPreviousNameMandatory = true;
            }
            else {
                $scope.IsPreviousNameMandatory = false;
            }

            if ($scope.OrganizationSettingsData.PatientRegistration.IsSecondLastNameMandatory === 1) {
                $scope.IsSecondLastNameMandatory = true;
            }
            else {
                $scope.IsSecondLastNameMandatory = false;
            }
            if ($scope.OrganizationSettingsData.PatientRegistration.IsNoChargePatientMandatory === 1) {
                $scope.IsNoChargePatientMandatory = true;
            }
            else {
                $scope.IsNoChargePatientMandatory = false;
            }
        }
        
        $scope.openAddNewPlanPopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "addNewPlan.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__ninety--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
      
        function onloding() {
            $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
            function getcountriesSuccess(data) {
                $scope.Allcountries = data;

                $scope.AllCountryCodeList = [];
                angular.forEach($scope.Allcountries, function (citem) {
                    citem.InternationalDialing = citem.InternationalDialing || "";
                    if (citem.InternationalDialing != '') {
                        $scope.AllCountryCodeList.push(citem);
                    }
                });
                $scope.Allcountries = _.uniq($scope.Allcountries, false, function (p) { return p.InternationalDialing; });
            }
            function getcountriesFailed(data) {
            }
        }

        $scope.changeFaxNumber = function (fitem) {
            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.PatientDetailsInfo.FaxNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.PatientDetailsInfo.FaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.PatientDetailsInfo.FaxHomeNumber = contact;
                }
            }
        }
        $scope.GetSearchPCPObj = function () {
            return {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 10,
                'SearchTaxt': '',
                "SpecializationId": null,
                "DeleteInd": "N",
                "OrganizationId": $scope.HospitalId,
                "RefaralTypeId": "",
                "NewpcpDoctor": false,
                "Internal": "",
                "External": ""
            }
        };
        $scope.SearchPCPObj = angular.copy($scope.GetSearchPCPObj());

        function OnloadAlluserlist() {
            $scope.allUserList = $scope.allUserList || [];
            if ($scope.allUserList.length > 0) {
                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                $scope.clinicDoctorList = [];
                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                        $scope.clinicDoctorList.push(Aitem);

                    }
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                if ($scope.SearchPCPObj.Internal != 0) {
                    $scope.SearchPCPObj.Internal = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.SearchPCPObj.Internal }, true)[0] || [];
                }
                console.log("user list alredy loaded");
            } else {
                $q.all([
                    eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId),
                ]).then(function (resp) {
                    if (resp[0].data.status === "Success") {
                        if (resp[0].data.row.length > 0) {
                            $scope.allSubSpecializationsArray = resp[0].data.row;
                            $scope.listSubSplArray = angular.copy(resp[0].data.row);
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
                        function onGetUsersSuccess(response) {
                            if (response.rows.length > 0) {
                                $scope.allUserList = [];
                                $scope.allUserList = response.rows || [];
                                if ($scope.allUserList.length > 0) {
                                    $scope.clinicDoctorList = [];
                                    angular.forEach($scope.allUserList, function (Aitem) {
                                        if (Aitem.RoleId === 1 || Aitem.RoleId === 43) {
                                            $scope.clinicDoctorList.push(Aitem);
                                        }
                                    });
                                }
                                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                                if ($scope.SearchPCPObj.Internal != 0) {
                                    $scope.SearchPCPObj.Internal = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.SearchPCPObj.Internal }, true)[0] || [];
                                }
                            } else {
                                alertify.error("No Users Found in Selected Departments");
                            }
                        }

                        function onGetUsersFailure(data) {
                        }
                    }
                });
            }
        };
        function GetApptPCPInfo() {
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientID": $scope.PatientId,
                "AppointmentId": 0,
                "AppointmentDate": "",
                "PatientDesignatedInfoId": 0,
                "PCP": 0,
                "Referral": 0,
                "ExternalManager": 0,
                "Corporation": 0,
                "Office": 0,
                "ReferralMobileNo": 0,
                "ReferralContactNo": 0,
                "MasterReferralSourceId": 0,
                "MasterReferralSourceName": "",
                "MasterReferralSourceObj": '',
                "ReferralSourceId": 0,
                "ReferralSourceName": "",
                "ReferralSourceObj": "",
                "ReferralSubSourceId": 0,
                "ReferralDate": "",
                "PatientPCPDocuments": [],
                "PCPobj": "",
                "ReferalObj": "",
                "ExternalManegerObj": "",
                "CorporationObj": "",
                "OfficeObj": "",
                "PCPDoctorName": "",
                "ReferralName": "",
                "ExternalManagerName": "",
                "CorporationName": "",
                "OfficeName": "",
                "SummaryPcpDocument": [],
                "EmployerName": "",
                "OccupationId": "",
                "OccupationDescription": "",
                "EmployerPhoneNo": "",
                "Emergency": "",
                "EmergencyMobile": "",
                "S3URL": "",
                "PcpNPI": "",
                "ReferenceNumber": "",
                "PatientReferalDocuments": [],
                "PCPReferenceNumber": "",
                "PCPContactNo": "",
                "PCPNotes": "",
                "IsPCPCoManagerInd": false,
                "PCPEmailId": "",
                "PCPReferralDate": null,
                "ReferalNotes": "",
                "IsReferalCoManagerInd": false,
                "ReferalReferenceNumber": "",
                "ReferalEmailId": "",
                "ReferalNPI": "",
                "SourceDesignatedInfoNotes": "",
                "PCPCheckBox": false,
                "ReferalCheckBox": false,
                "SourceCheckBox": false,
                "ReferralContact": ""
            }

            if ($scope.AllUserBranchesList != undefined && $scope.AllUserBranchesList.length > 0) {
                obj.CorporationObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.ParenthospitalId })[0] || [];
                if (obj.CorporationObj != "") {
                    obj.Corporation = obj.CorporationObj.ClinicId;
                    obj.CorporationName = obj.CorporationObj.ClinicName;
                }
            }

            return obj;
        }

        $scope.PatientApptPCPInfo = GetApptPCPInfo();


        $scope.changeApptpcpDoctor = function (mainitem) {

            $scope.PatientApptPCPInfo.PCP = 0;
            $scope.PatientApptPCPInfo.PCPEmailId = "";
            $scope.PatientApptPCPInfo.PCPContactNo = "";
            $scope.PatientApptPCPInfo.PcpNPI = "";
            $scope.PatientApptPCPInfo.PCPDoctorName = "";
        };

        $scope.onSelectApptPcpDoctor = function (item, mainitem) {

            $scope.PatientApptPCPInfo.PCP = item.PcpReferralId;
            $scope.PatientApptPCPInfo.PCPEmailId = item.EmailId;
            $scope.PatientApptPCPInfo.PCPContactNo = item.MobileNo;
            $scope.PatientApptPCPInfo.PcpNPI = item.NPI;
            $scope.PatientApptPCPInfo.PCPDoctorName = item.FullName;
            $scope.PatientApptPCPInfo.PCPobj = item.FullName;
        };
        $scope.changeApptReferalDoctornew = function (mainitem) {
            $scope.PatientApptPCPInfo.Referral = 0;
            $scope.PatientApptPCPInfo.ReferralName = "";
            $scope.PatientApptPCPInfo.ReferalEmailId = "";
            $scope.PatientApptPCPInfo.ReferalNPI = "";
            $scope.PatientApptPCPInfo.ReferralContact = "";
        };

        $scope.onSelectApptReferalDoctorNew = function (item, mainitem) {
            $scope.PatientApptPCPInfo.Referral = item.DoctorID;
            $scope.PatientApptPCPInfo.ReferralName = item.FullName;
            $scope.PatientApptPCPInfo.ReferalEmailId = item.EmailId;
            $scope.PatientApptPCPInfo.ReferalNPI = item.NPI;
            $scope.PatientApptPCPInfo.ReferralContact = item.MobileNo;
            $scope.PatientApptPCPInfo.ReferalObj = item.FullName;
        };



        $scope.init = function () {
            
             console.log(mainObject)
            if (mainObject.AddEdit == 'Edit') {
                $scope.patientid = mainObject.PatientDetails.PatientID || 0;
                $scope.PatientDisplayID = mainObject.PatientDetails.PatientDisplayID || "";

                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);
                $scope.MartialStatusList = angular.copy(mObj.masterMartialStatusList);
                $scope.BloodGroupList = angular.copy(mObj.masterBloodGroupList);
                $scope.OccupationsList = angular.copy(mObj.masterOccupationsList);


                $scope.SelectedPatientTagList = angular.copy(mainObject.HospitalEquipmentList);
                $scope.PatientRaceList = mainObject.AllMasterData.PatientRace || [];
                $scope.MasterEducation = mainObject.AllMasterData.MasterEducation || [];
                $scope.FinancialResourceList = mainObject.AllMasterData.FinancialResourceList || [];
                $scope.MasterPhysicalActivity = angular.copy(mainObject.AllMasterData.MasterPhysicalActivity) || [];
                $scope.PatientEthnicityList = mainObject.AllMasterData.PatientEthnicity || [];
                $scope.PatientLanguageList = mainObject.AllMasterData.PatientLanguage || [];
                $scope.PatientLanguageExpressionList = mainObject.AllMasterData.LanguageExpression || [];
                $scope.PatientLanguageProficiencyList = mainObject.AllMasterData.LanguageProficiency || [];
                $scope.PatientSexualOrientationList = mainObject.AllMasterData.PatientSexualOrientation || [];
                $scope.PatientPronounList = mainObject.AllMasterData.MasterPronouns || [];
                $scope.PatientGenderIdentityList = mainObject.AllMasterData.PatientGenderIdentity || [];
                $scope.PatientPrefixList = mainObject.AllMasterData.PatientTitle || [];
                $scope.PatientSuffixList = mainObject.AllMasterData.PatientSuffix || [];
                $scope.MSPInsuranceTypeList = mainObject.AllMasterData.MSPInsuranceTypes || [];
                $scope.HospitalReferenceMaster = mainObject.AllMasterData.HospitalReferenceMaster || [];
                $scope.TitlesList = mainObject.TitlesList || [];
                $scope.CoverageList = (mainObject.CoverageList?.length > 0)
                                        ? mainObject.CoverageList
                                        : mainObject?.AllMasterData?.InsuranceIdentifierList;
                $scope.allUserList = mainObject.AllUsersList || [];
                $scope.SearchPCPObj.External = mainObject.PatientDetails.ExternalComanagerId || "";
                $scope.SearchPCPObj.Internal = mainObject.PatientDetails.InternalComanagerId || "";
                $scope.PatientApptPCPInfo.PCPobj = mainObject.PatientDetails.PCPDoctorName || "";
                $scope.PatientApptPCPInfo.ReferalObj = mainObject.PatientDetails.ReferralName || "";
                $scope.PatientApptPCPInfo.PCP = mainObject.PatientDetails.PCP || null;
                $scope.PatientApptPCPInfo.Referral = mainObject.PatientDetails.Referral || null;
                $scope.cacheStorageItem.IsFromAddPcpAtAppt = $scope.cacheStorageItem.IsFromAddPcpAtAppt || "";
                // add update value to patiet 
                if ($scope.cacheStorageItem.IsFromAddPcpAtAppt == 'ApptLevelPCPAdd') {
                    $scope.PatientApptPCPInfo.PCP = $scope.cacheStorageItem.PCP || "";
                    $scope.PatientApptPCPInfo.Referral = $scope.cacheStorageItem.Referral || "";
                    $scope.PatientApptPCPInfo.PCPobj = $scope.cacheStorageItem.PCPDoctorName || "";
                    $scope.PatientApptPCPInfo.ReferalObj = $scope.cacheStorageItem.ReferralName || "";
                    $scope.SearchPCPObj.External = $scope.cacheStorageItem.ExternalComanagerId ||  0;
                    $scope.SearchPCPObj.Internal = $scope.cacheStorageItem.InternalComanagerId || 0;

                    // remove paramtere from cache
                    delete $scope.cacheStorageItem.IsFromAddPcpAtAppt
                    delete $scope.cacheStorageItem.PCP;
                    delete $scope.cacheStorageItem.Referral;
                    delete $scope.cacheStorageItem.PCPDoctorName;
                    delete $scope.cacheStorageItem.ReferralName;
                    delete $scope.cacheStorageItem.ExternalComanagerId;
                    delete $scope.cacheStorageItem.InternalComanagerId;
                }

                if ($scope.CoverageList.length > 0) {
                    $scope.CoverageList = $filter("filter")($scope.CoverageList, function (item, index) { return item.IdentifierId !== 6 && item.IdentifierId !== 7 });
                }
                

                if ($scope.PatientEthnicityList.length > 0) {
                    angular.forEach($scope.PatientEthnicityList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }

                if ($scope.PatientRaceList.length > 0) {
                    angular.forEach($scope.PatientRaceList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }

                mainObject.Tab = mainObject.Tab || 1;

                $scope.mainEditPatientProfileObj.MainTab = mainObject.Tab || 1;

                if ($scope.mainEditPatientProfileObj.MainTab === 1) {
                    $scope.SaveTypeObj.TypeName = 'PatientDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 2) {
                    $scope.SaveTypeObj.TypeName = 'AddressDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 3) {
                    $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 4) {
                    $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 5) {
                    $scope.SaveTypeObj.TypeName = 'FamilyDetails';
                }

                $scope.PatientDetailsInfo.PatientID = mainObject.PatientDetails.PatientID || 0;
                $scope.PatientDetailsInfo.FullName =mainObject.PatientDetails.FullName || '';
                $scope.PatientDetailsInfo.TitleId =mainObject.PatientDetails.TitleId || 0;
                $scope.PatientDetailsInfo.FirstName = mainObject.PatientDetails.FirstName || '';
                $scope.PatientDetailsInfo.MiddleName = mainObject.PatientDetails.MiddleName || '';
                $scope.PatientDetailsInfo.LastName = mainObject.PatientDetails.LastName || '';
                $scope.PatientDetailsInfo.SecondLastName = mainObject.PatientDetails.SecondLastName || '';
                $scope.PatientDetailsInfo.SuffixName = mainObject.PatientDetails.SuffixName || '';
                $scope.PatientDetailsInfo.DOB = mainObject.PatientDetails.DOB || null;
                $scope.PatientDetailsInfo.SocialSecurityNo = mainObject.PatientDetails.SocialSecurityNo || '';
                $scope.PatientDetailsInfo.Gender = mainObject.PatientDetails.Gender || '';
                $scope.PatientDetailsInfo.BirthSex = mainObject.PatientDetails.BirthSex || '';
                $scope.PatientDetailsInfo.MaritalStatusID = mainObject.PatientDetails.MaritalStatusID || 0;
                $scope.PatientDetailsInfo.BloodGroupId = mainObject.PatientDetails.BloodGroupId || 0;
                $scope.PatientDetailsInfo.IsDiseased = mainObject.PatientDetails.IsDiseased || false;
                $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls = mainObject.PatientDetails.IsAllowAiAutomatedCalls || false;
                $scope.PatientDetailsInfo.AuthorizedUser = mainObject.PatientDetails.AuthorizedUser || false;
                $scope.PatientDetailsInfo.DateOfDeath = $filter('date')(mainObject.PatientDetails.DateOfDeath, "MM-dd-yyyy") || null;
                $scope.PatientDetailsInfo.CauseOfDeath = mainObject.PatientDetails.CauseOfDeath || '';
                $scope.PatientDetailsInfo.AuthorizedUserFullName = mainObject.PatientDetails.AuthorizedUserFullName || '';
                $scope.PatientDetailsInfo.AuthorizedUserEmailId = mainObject.PatientDetails.AuthorizedUserEmailId || '';
                $scope.PatientDetailsInfo.AuthorizedUserMobileNo = mainObject.PatientDetails.AuthorizedUserMobileNo || '';
                $scope.PatientDetailsInfo.ContactInfo.EmailID = mainObject.PatientDetails.ContactInfo.EmailID || '';
                $scope.PatientDetailsInfo.DisplayMobileNumber = mainObject.PatientDetails.ContactInfo.MobileNumber || '';
                $scope.PatientDetailsInfo.FatherName = mainObject.PatientDetails.FatherName || '';
                $scope.PatientDetailsInfo.MotherName = mainObject.PatientDetails.MotherName || '';
                $scope.PatientDetailsInfo.Guardian = mainObject.PatientDetails.Guardian || '';
                $scope.PatientDetailsInfo.Employer = mainObject.PatientDetails.Employer || '';
                $scope.PatientDetailsInfo.OccupationId = mainObject.PatientDetails.OccupationId || null;
                $scope.PatientDetailsInfo.OccupationDescription = mainObject.PatientDetails.OccupationDescription || '';
                $scope.PatientDetailsInfo.EmployerPhoneNo = mainObject.PatientDetails.EmployerPhoneNo || '';
                $scope.PatientDetailsInfo.EmergencyContactName = mainObject.PatientDetails.EmergencyContactName || '';
                $scope.PatientDetailsInfo.EmergencyRelationId = mainObject.PatientDetails.EmergencyRelationId || 0;
                $scope.PatientDetailsInfo.EmeregecyContactNo = mainObject.PatientDetails.EmeregecyContactNo || '';
                $scope.PatientDetailsInfo.PatientTagList = mainObject.PatientDetails.PatientTagList || [];
                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = mainObject.PatientDetails.ContactInfo.IsPatientSmsInd || false;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = mainObject.PatientDetails.ContactInfo.IsPatientEmailInd || false;
                $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode = mainObject.PatientDetails.ContactInfo.HomeCountryCode || '';
                $scope.PatientDetailsInfo.ContactInfo.HomeNumber = mainObject.PatientDetails.ContactInfo.HomeNumber || '';
                $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = mainObject.PatientDetails.ContactInfo.HomeAreaCode || '';
                $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = mainObject.PatientDetails.ContactInfo.OfficeAreaCode || '';
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = mainObject.PatientDetails.ContactInfo.OfficeNumber || '';
                $scope.PatientDetailsInfo.ageinYears = mainObject.PatientDetails.AgeInYears || '';
                mainObject.PatientDetails.AgeInMonths = mainObject.PatientDetails.AgeInMonths || '';
                $scope.PatientDetailsInfo.ageinMonths = mainObject.PatientDetails.AgeInMonths.toString() || "";
                $scope.PatientDetailsInfo.EmergencyRelationId = mainObject.PatientDetails.EmergencyRelationId || 0;
                $scope.PatientDetailsInfo.S3URL = mainObject.PatientDetails.S3URL || '';
                $scope.PatientDetailsInfo.IsNoChargePatient = mainObject.PatientDetails.IsNoChargePatient || false;
                $scope.PatientDetailsInfo.PreviousName = mainObject.PatientDetails.PreviousName || '';
                $scope.PatientDetailsInfo.FaxAreacode = mainObject.PatientDetails.FaxAreacode || '';
                $scope.PatientDetailsInfo.FaxHomeNumber = mainObject.PatientDetails.FaxHomeNumber || '';
                $scope.PatientDetailsInfo.FaxNumber = mainObject.PatientDetails.FaxNumber || '';
                $scope.PatientDetailsInfo.HospitalReferenceId = parseInt(mainObject.PatientDetails.HospitalReferenceId) || null;
                $scope.PatientDetailsInfo.ReferenceNotes = mainObject.PatientDetails.ReferenceNotes || '';

                $scope.PatientOfficeumber = $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode + $scope.PatientDetailsInfo.ContactInfo.OfficeNumber;
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeumber);
                $scope.PatientDetailsInfo.DisplayAlternateNumber = obj.UsFormatMobileNumber;

                if ($scope.PatientDetailsInfo.AuthorizedUserFullName != '' || $scope.PatientDetailsInfo.AuthorizedUserEmailId != '' || $scope.PatientDetailsInfo.AuthorizedUserMobileNo != '') {
                    $scope.PatientDetailsInfo.AuthorizedUser = true;
                } else {
                    $scope.PatientDetailsInfo.AuthorizedUser = false;
                }
                
                

               
                if ($scope.PatientDetailsInfo.PatientTagList.length > 0) {
                    angular.forEach($scope.PatientDetailsInfo.PatientTagList, function (item) {
                        angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                            if (item.HospitalEquipmentId == kitem.HospitalEquipmentId) {
                                kitem.IsChecked = true;
                            }
                        });
                    });
                } 

                if ($scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && !$scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "1";
                    $scope.PatientDetailsInfo.ContactInfo.PatinetAuthId = 1;
                    $scope.PatientDetailsInfo.ContactInfo.AuthSMSInd = true;
                    $scope.PatientDetailsInfo.ContactInfo.IsfutureCommunications = true;
                    
                }
                else if (!$scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "2";
                    $scope.PatientDetailsInfo.ContactInfo.PatinetAuthId = 2;
                    $scope.PatientDetailsInfo.ContactInfo.AuthEmailInd = true;
                    $scope.PatientDetailsInfo.ContactInfo.IsfutureCommunications = true;
                  
                }
                else if ($scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "3";
                    $scope.PatientDetailsInfo.ContactInfo.AuthEmailInd = true;
                    $scope.PatientDetailsInfo.ContactInfo.AuthSMSInd = true;
                    $scope.PatientDetailsInfo.ContactInfo.AuthBothInd = true;
                    $scope.PatientDetailsInfo.ContactInfo.IsfutureCommunications = true;
                   
                }
                else if (!$scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && !$scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "4";
                    $scope.PatientDetailsInfo.ContactInfo.IsfutureCommunications = false;
                    $scope.PatientDetailsInfo.ContactInfo.AuthEmailInd = false;
                    $scope.PatientDetailsInfo.ContactInfo.AuthSMSInd = false;
                    $scope.PatientDetailsInfo.ContactInfo.AuthBothInd = false;
                    $scope.PatientDetailsInfo.ContactInfo.UnAuthorisedInd = true;
                    
                }

                //address


                $scope.PatientAddressInfo.PermanentAddress.AddressId = mainObject.PatientAddress.PermanentAddress.AddressId || 0;
                $scope.PatientAddressInfo.PermanentAddress.AddressLine1 = mainObject.PatientAddress.PermanentAddress.AddressLine1 || "";
                $scope.PatientAddressInfo.PermanentAddress.AddressLine2 = mainObject.PatientAddress.PermanentAddress.AddressLine2 || "";
                $scope.PatientAddressInfo.PermanentAddress.ZipCode = mainObject.PatientAddress.PermanentAddress.ZipCode || "";
                $scope.PatientAddressInfo.PermanentAddress.CountyId = mainObject.PatientAddress.PermanentAddress.CountyId;
                $scope.PatientAddressInfo.PermanentAddress.CountyName = mainObject.PatientAddress.PermanentAddress.CountyName;
                $scope.PatientAddressInfo.PermanentAddress.CityName = mainObject.PatientAddress.PermanentAddress.CityName;
                $scope.PatientAddressInfo.PermanentAddress.CityId = mainObject.PatientAddress.PermanentAddress.CityId;
                $scope.PatientAddressInfo.PermanentAddress.StateName = mainObject.PatientAddress.PermanentAddress.StateName;
                $scope.PatientAddressInfo.PermanentAddress.StateId = mainObject.PatientAddress.PermanentAddress.StateId;
                $scope.PatientAddressInfo.PermanentAddress.CountryName = mainObject.PatientAddress.PermanentAddress.CountryName;
                $scope.PatientAddressInfo.PermanentAddress.CountryId = mainObject.PatientAddress.PermanentAddress.CountryId;
                $scope.PatientAddressInfo.PermanentAddress.StateCode = mainObject.PatientAddress.PermanentAddress.StateCode;

                $scope.PatientAddressInfo.PostalAddress.AddressId = mainObject.PatientAddress.PostalAddress.AddressId || 0;
                $scope.PatientAddressInfo.PostalAddress.AddressLine1 = mainObject.PatientAddress.PostalAddress.AddressLine1 || "";
                $scope.PatientAddressInfo.PostalAddress.AddressLine2 = mainObject.PatientAddress.PostalAddress.AddressLine2 || "";
                $scope.PatientAddressInfo.PostalAddress.ZipCode = mainObject.PatientAddress.PostalAddress.ZipCode || "";
                $scope.PatientAddressInfo.PostalAddress.CountyId = mainObject.PatientAddress.PostalAddress.CountyId;
                $scope.PatientAddressInfo.PostalAddress.CountyName = mainObject.PatientAddress.PostalAddress.CountyName;
                $scope.PatientAddressInfo.PostalAddress.CityName = mainObject.PatientAddress.PostalAddress.CityName;
                $scope.PatientAddressInfo.PostalAddress.CityId = mainObject.PatientAddress.PostalAddress.CityId;
                $scope.PatientAddressInfo.PostalAddress.StateName = mainObject.PatientAddress.PostalAddress.StateName;
                $scope.PatientAddressInfo.PostalAddress.StateId = mainObject.PatientAddress.PostalAddress.StateId;
                $scope.PatientAddressInfo.PostalAddress.CountryName = mainObject.PatientAddress.PostalAddress.CountryName;
                $scope.PatientAddressInfo.PostalAddress.CountryId = mainObject.PatientAddress.PostalAddress.CountryId;
                $scope.PatientAddressInfo.PatientAddressDocuments = mainObject.PatientAddress.PatientAddressDocuments || [];
                $scope.PatientAddressInfo.IsCheckCopy = mainObject.PatientAddress.IsCheckCopy || false;
                $scope.PatientAddressInfo.PostalAddress.StateCode = mainObject.PatientAddress.PostalAddress.StateCode;


                // DemographicsList

                var DemographicsList = mainObject.PatientDetails.AdditionalInfo || {};

                $scope.PatientQuestions = $scope.PatientQuestions || [];

                $scope.PatientQuestions = mainObject.PatientDetails.PatientQuestions || [];

                if ($scope.PatientQuestions.length > 0) {
                    angular.forEach($scope.PatientQuestions, function (ans) {
                        var match = $scope.MasterPhysicalActivity.find(x => x.Id == ans.QuestionId);
                        if (match) {
                            //match.UserValue = ans.UnitsValue;
                            match.UserValue = parseInt(ans.UnitsValue);
                        }
                    });
                }


                if ($scope.PatientQuestions && $scope.PatientQuestions.length > 0) {               
                  
                    let edu = $scope.PatientQuestions.find(x =>
                        x.QuestionName === 'Highest level of education'
                    );

                    if (edu) {
                        $scope.DemographicInfo.EducationId = edu.AnswerId || 0;
                    }                
                 
                    let resource = $scope.PatientQuestions.find(x =>
                        x.QuestionName === 'How hard is it for you to pay basics like food, housing, medical care, heating'
                    );

                    if (resource) {
                        $scope.DemographicInfo.ResourceId = resource.AnswerId || 0;
                    }
                }


                 
               
                $scope.DemographicInfo.Ethnicity = angular.copy(mainObject.PatientDetails.PatientEthnicity);
                $scope.DemographicInfo.Race = angular.copy(mainObject.PatientDetails.PatientRace);
                $scope.DemographicInfo.PreferedLanguage = angular.copy(mainObject.PatientDetails.PatientLanguage);

                $scope.DemographicInfo.ExpressionId = DemographicsList.ExpressionId || 0;

                $scope.DemographicInfo.ProficiencyId = DemographicsList.ProficiencyId || 0;

                $scope.DemographicInfo.PatientPrefixListId = DemographicsList.PatientPrefixListId || 0;

                $scope.DemographicInfo.PatinetSuffixId = DemographicsList.PatinetSuffixId || 0;

                $scope.DemographicInfo.SexualOrientationId = DemographicsList.SexualOrientationId || 0;

                $scope.DemographicInfo.GenderIdentityStatusId = DemographicsList.GenderIdentityId || 0;


                $scope.DemographicInfo.FirstName = DemographicsList.FirstName || "";
                $scope.DemographicInfo.LastName = DemographicsList.LastName || "";
                $scope.DemographicInfo.MultipleBirth = DemographicsList.MultipleBirth || "";
                $scope.DemographicInfo.MothersMiddleName = DemographicsList.MothersMiddleName || "";

                $scope.DemographicInfo.EthnicityID = DemographicsList.EthnicityID || "";
                $scope.DemographicInfo.EthnicityName = DemographicsList.EthnicityName || "";
                $scope.DemographicInfo.RaceID = DemographicsList.RaceID || "";
                $scope.DemographicInfo.RaceName = DemographicsList.RaceName || "";
                $scope.DemographicInfo.LanguageID = DemographicsList.LanguageID || "";
                $scope.DemographicInfo.LanguageName = DemographicsList.LanguageName || "";

                $scope.DemographicInfo.LGuardianFirstName = DemographicsList.LGuardianFirstName || "";
                $scope.DemographicInfo.LGuardianMiddleName = DemographicsList.LGuardianMiddleName || "";
                $scope.DemographicInfo.LGuardianLastName = DemographicsList.LGuardianLastName || "";
                $scope.DemographicInfo.PatFatherFirstName = DemographicsList.PatFatherFirstName || "";
                $scope.DemographicInfo.LGuardianFullname = DemographicsList.LGuardianFullname || "";
                $scope.DemographicInfo.NametoUse = DemographicsList.NametoUse || "";
                $scope.DemographicInfo.PronounId = DemographicsList.PronounId || 0;
              
                if ($scope.DemographicInfo.ExpressionId != "") {
                    $scope.DemographicInfo.ExpressionObj = $filter("filter")($scope.PatientLanguageExpressionList, { "LanguageExpressionId": $scope.DemographicInfo.ExpressionId })[0];
                }
                if ($scope.DemographicInfo.ProficiencyId != "") {
                    $scope.DemographicInfo.ProficiencyObj = $filter("filter")($scope.PatientLanguageProficiencyList, { "LanguageProficiencyId": $scope.DemographicInfo.ProficiencyId })[0];
                }
                if ($scope.DemographicInfo.PatientPrefixListId != "" && $scope.DemographicInfo.PatientPrefixListId != null) {
                    $scope.DemographicInfo.PatientPrefixObj = $filter("filter")($scope.PatientPrefixList, { "TitleId": $scope.DemographicInfo.PatientPrefixListId })[0];
                }
                if ($scope.DemographicInfo.PatinetSuffixId != "" && $scope.DemographicInfo.PatinetSuffixId != null) {
                    $scope.DemographicInfo.PatinetSuffixObj = $filter("filter")($scope.PatientSuffixList, { "SuffixId": $scope.DemographicInfo.PatinetSuffixId })[0];
                    $scope.DemographicInfo.PatientSuffixName = $scope.DemographicInfo.PatinetSuffixObj.Value || "";
                }
                if ($scope.DemographicInfo.SexualOrientationId != "") {
                    $scope.DemographicInfo.SexualOrientationObj = $filter("filter")($scope.PatientSexualOrientationList, { "SexualOrientationId": $scope.DemographicInfo.SexualOrientationId })[0];
                }
                if ($scope.DemographicInfo.GenderIdentityStatusId != "") {
                    $scope.DemographicInfo.GenderIdentityStatusObj = $filter("filter")($scope.PatientGenderIdentityList, { "GenderIdentityId": $scope.DemographicInfo.GenderIdentityStatusId })[0];
                }
                if ($scope.DemographicInfo.Ethnicity.length > 0) {
                    $scope.obj.IsEthnicitySelected = [];
                    if ($scope.DemographicInfo.Ethnicity.length > 0) {
                        angular.forEach($scope.DemographicInfo.Ethnicity, function (kitem) {
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
                }
                if ($scope.DemographicInfo.Race.length > 0) {
                    $scope.obj.IsRaceSelected = [];
                    if ($scope.DemographicInfo.Race.length > 0) {
                        angular.forEach($scope.DemographicInfo.Race, function (kitem) {
                            angular.forEach($scope.PatientRaceList, function (mitem) {
                                if (kitem.RaceId === mitem.DropdownId) {
                                    mitem.IsSelected = true;
                                    mitem.IsActive = "1";
                                    mitem.Value = kitem.RaceName;
                                    mitem.Id = kitem.Id;
                                    mitem.Name = "PatientRace";
                                    $scope.obj.IsRaceSelected.push(mitem);
                                }
                            });
                        });
                    }
                }
                if ($scope.DemographicInfo.PreferedLanguage.length > 0) {
                    $scope.DemographicInfo.PreferedLanguageObj = $filter("filter")($scope.PatientLanguageList, { "Languageid": $scope.DemographicInfo.PreferedLanguage[0].LanguageId })[0];
                }

               


                //family info

                mainObject.FamilySummary = mainObject.FamilySummary || [];
                if (mainObject.FamilySummary.length > 0) {
                    $scope.FamilyInfo.FamilyArray = mainObject.FamilySummary;
                }



                // insurance array

                $scope.PatientInsuranceSummary = mainObject.PatientInsuranceSummary || [];
                $scope.InsuranceStatusList = mainObject.InsuranceStatusList || [];
                $scope.ShowInsuranceAddnew = mainObject.ShowInsuranceAddnew || false;
                var InsuranceEditItem = mainObject.InsuranceEditItem || {};

                // edit insurance assigning
                $scope.ShowPatientListDrop = false;
                $scope.PatientInsuranceObj = GetInsuranceObj();

                $scope.frontItemUpload = false;
                $scope.Ffile = null;
                $scope.Bfile = null;
                $scope.frontItemS3Url = false;
                $scope.backItemUpload = false;
                $scope.backItemS3Url = false;
                if ($scope.PatientInsuranceObj.RelationShipId == 1) {

                $scope.PatientInsuranceObj.InsuredPersonFirstName = mainObject.PatientDetails.FirstName || '';
                $scope.PatientInsuranceObj.InsuredPersonGenderID = mainObject.PatientDetails.Gender == "Male" ? 'M' : 'F';
                $scope.PatientInsuranceObj.InsuredPersonDOB = mainObject.PatientDetails.DOB;
                    $scope.PatientInsuranceObj.InsuredPersonSSN = mainObject.PatientDetails.SocialSecurityNo;
                $scope.PatientInsuranceObj.InsuredPersonMiddleName = mainObject.PatientDetails.MiddleName || '';
                $scope.PatientInsuranceObj.InsuredPersonLastName = mainObject.PatientDetails.LastName || '';
                    $scope.PatientInsuranceObj.InsuredPersonSuffix = mainObject.PatientDetails.SuffixName || '';
                    $scope.PatientInsuranceObj.InsuredPersonSecondLastName = mainObject.PatientDetails.SecondLastName || '';

                }
               
                $scope.PatientInsuranceObj.PatientFirstName = mainObject.PatientDetails.FirstName || '';
                $scope.PatientInsuranceObj.PatientLastName = mainObject.PatientDetails.LastName || '';
                $scope.PatientInsuranceObj.PatientDOB = mainObject.PatientDetails.DOB;
                $scope.PatientInsuranceObj.PatientSSN = mainObject.PatientDetails.SocialSecurityNo;
                $scope.PatientInsuranceObj.PatientSuffix = mainObject.PatientDetails.SuffixName;
                $scope.PatientInsuranceObj.PatientMiddleName = mainObject.PatientDetails.MiddleName;
                $scope.PatientInsuranceObj.PatientSecondLastName = mainObject.PatientDetails.SecondLastName;
                $scope.PatientInsuranceObj.IsIdentifier = false;
                if ($scope.PatientInsuranceSummary.length == 0) {
                    $scope.ShowInsuranceAddnew = false;
                    $scope.ShowInsCopyBtn = true;
                }
                else {
                    $scope.ShowInsuranceAddnew = true;
                }
                if (Object.keys(InsuranceEditItem).length > 0) {

                    $scope.PatientInsuranceObj.IsPlanEnabled = true;
                    $scope.PatientInsuranceObj.IsCoverageEnabled = true;
                    $scope.PatientInsuranceObj.IsPolicyIdEnabled = true;
                    $scope.PatientInsuranceObj.IsGroupIdEnabled = true;
                    $scope.ShowInsuranceAddnew = false;
                    $scope.ShowInsCopyBtn = false;
                    $scope.PatientInsuranceObj.IdentifierId = InsuranceEditItem.IdentifierId;
                    $scope.PatientInsuranceObj.MSPInsuranceTypeId = InsuranceEditItem.MSPInsuranceTypeId;
                    $scope.PatientInsuranceObj.PayorTypeId = InsuranceEditItem.PayorTypeId;
                    $scope.PatientInsuranceObj.CoverageId = InsuranceEditItem.CoverageId;
                    $scope.PatientInsuranceObj.CoverageName = InsuranceEditItem.CoverageName;
                    $scope.PatientInsuranceObj.GroupId = InsuranceEditItem.GroupId || "";
                    $scope.PatientInsuranceObj.GroupName = InsuranceEditItem.GroupName;
                    $scope.PatientInsuranceObj.InsuranceRelationShipObj = InsuranceEditItem.InsuranceRelationShipObj;
                    $scope.PatientInsuranceObj.InsuredPersonDOB = $filter('date')(InsuranceEditItem.InsuredPersonDOB, "MM-dd-yyyy");
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = InsuranceEditItem.InsuredPersonFirstName;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = InsuranceEditItem.InsuredPersonGenderID === "M" ? 'M' : 'F';
                    $scope.PatientInsuranceObj.InsuredPersonSSN = InsuranceEditItem.InsuredPersonSSN;
                    $scope.PatientInsuranceObj.PatientInsuranceDetailId = InsuranceEditItem.PatientInsuranceDetailId;
                    $scope.PatientInsuranceObj.PayorId = InsuranceEditItem.PayorId;
                    $scope.PatientInsuranceObj.PayorName = InsuranceEditItem.PayorName;
                    $scope.PatientInsuranceObj.PayorObj = InsuranceEditItem.OrganizationPayorName;
                    $scope.PatientInsuranceObj.PlanId = InsuranceEditItem.PlanId;
                    $scope.PatientInsuranceObj.PlanName = InsuranceEditItem.PlanName;
                    $scope.PatientInsuranceObj.PlanObj = InsuranceEditItem.PlanName;
                    $scope.PatientInsuranceObj.PlanTypeId = InsuranceEditItem.PlanTypeId;
                    $scope.PatientInsuranceObj.PolicyHolder = InsuranceEditItem.PolicyHolder;
                    $scope.PatientInsuranceObj.PolicyHolderName = InsuranceEditItem.PolicyHolderName;
                    $scope.PatientInsuranceObj.PolicyId = InsuranceEditItem.PolicyId;
                    $scope.PatientInsuranceObj.RelationName = InsuranceEditItem.RelationName;
                    $scope.PatientInsuranceObj.RelationShipId = InsuranceEditItem.RelationShipId;
                    $scope.PatientInsuranceObj.ReleaseInfo = InsuranceEditItem.ReleaseInfo;
                    $scope.PatientInsuranceObj.StatusId = InsuranceEditItem.StatusId;
                    $scope.PatientInsuranceObj.Staff = InsuranceEditItem.Staff;
                    $scope.PatientInsuranceObj.AcceptAssign = InsuranceEditItem.AcceptAssign;
                    $scope.PatientInsuranceObj.AssignBenifits = InsuranceEditItem.AssignBenifits;
                    $scope.PatientInsuranceObj.Comments = InsuranceEditItem.Comments;
                    $scope.PatientInsuranceObj.IsDefaultBillingIns = InsuranceEditItem.IsDefaultBillingIns;
                    $scope.PatientInsuranceObj.PCP = InsuranceEditItem.PCP;
                    $scope.PatientInsuranceObj.IPA = InsuranceEditItem.IPA;
                    $scope.PatientInsuranceObj.OrganizationPayorId = InsuranceEditItem.OrganizationPayorId;
                    $scope.PatientInsuranceObj.OrganizationPayorName = InsuranceEditItem.OrganizationPayorName;
                    $scope.PatientInsuranceObj.IsVerified = InsuranceEditItem.IsVerified || false;
                    //$scope.PatientInsuranceObj.EligibilityStatusId = InsuranceEditItem.EligibilityStatusId || 0;
                    $scope.PatientInsuranceObj.AppointmentInsuranceDetailId = InsuranceEditItem.AppointmentInsuranceDetailId || 0;
                    $scope.PatientInsuranceObj.InsuredPersonMiddleName = InsuranceEditItem.InsuredPersonMiddleName;
                    $scope.PatientInsuranceObj.InsuredPersonLastName = InsuranceEditItem.InsuredPersonLastName;
                    $scope.PatientInsuranceObj.InsuredPersonSecondLastName = InsuranceEditItem.InsuredPersonSecondLastName;
                    $scope.PatientInsuranceObj.InsuredPersonSuffix = InsuranceEditItem.InsuredPersonSuffix;
                    $scope.PatientInsuranceObj.PatientFirstName = InsuranceEditItem.PatientFirstName;
                    $scope.PatientInsuranceObj.PatientMiddleName = InsuranceEditItem.PatientMiddleName;
                    $scope.PatientInsuranceObj.PatientLastName = InsuranceEditItem.PatientLastName;
                    $scope.PatientInsuranceObj.PatientSecondLastName = InsuranceEditItem.PatientSecondLastName;
                    $scope.PatientInsuranceObj.PatientSuffix = InsuranceEditItem.PatientSuffix;
                    $scope.PatientInsuranceObj.PatientDOB = $filter('date')(InsuranceEditItem.PatientDOB, "MM-dd-yyyy");
                    $scope.PatientInsuranceObj.PatientSSN = InsuranceEditItem.PatientSSN;
                    $scope.PatientInsuranceObj.IsIdentifier = false;
                    $scope.PatientInsuranceObj.MovetoBilling = InsuranceEditItem.MovetoBilling;
                    InsuranceEditItem.PatientDocumentDetails = InsuranceEditItem.PatientDocumentDetails || [];

                    if (InsuranceEditItem.PatientDocumentDetails.length > 0) {
                        angular.forEach(InsuranceEditItem.PatientDocumentDetails, function (billitem) {
                            if (!billitem.IsBackSidefile) {
                                $scope.frontItemUpload = false;
                                $scope.frontItemS3Url = true;
                                $scope.frontS3Url = billitem.S3URL;
                            }
                            if (billitem.IsBackSidefile) {
                                $scope.backItemUpload = false;
                                $scope.backItemS3Url = true;
                                $scope.backS3Url = billitem.S3URL;
                            }
                        });
                        $scope.PatientInsuranceObj.PatientDocumentDetails = [];
                        $scope.PatientInsuranceObj.PatientDocumentDetails = InsuranceEditItem.PatientDocumentDetails;

                    }

                    InsuranceEditItem.EffectiveDate = InsuranceEditItem.EffectiveDate || "";
                    if (InsuranceEditItem.EffectiveDate != "") {
                        $scope.PatientInsuranceObj.EffectiveDate = $filter('date')(InsuranceEditItem.EffectiveDate, "MM-dd-yyyy");
                        //$scope.PatientInsuranceObj.EffectiveDate = $filter("date")(new Date(InsuranceEditItem.EffectiveDate), "MM-dd-yyyy") || "";
                    }
                    InsuranceEditItem.ExpiryDate = InsuranceEditItem.ExpiryDate || "";
                    if (InsuranceEditItem.ExpiryDate != "") {
                        $scope.PatientInsuranceObj.ExpiryDate = $filter('date')(InsuranceEditItem.ExpiryDate, "MM-dd-yyyy");
                        //$scope.PatientInsuranceObj.ExpiryDate = $filter("date")(new Date(InsuranceEditItem.ExpiryDate), "MM-dd-yyyy") || "";
                    }
                    InsuranceEditItem.ScanDate = InsuranceEditItem.ScanDate || "";
                    if (InsuranceEditItem.ScanDate != "") {
                        $scope.PatientInsuranceObj.ScanDate = $filter("date")(new Date(InsuranceEditItem.ScanDate), "MM-dd-yyyy") || "";
                    }
                    //InsuranceEditItem.VerifiedDate = InsuranceEditItem.VerifiedDate || "";
                    //if (InsuranceEditItem.VerifiedDate != "") {
                    //    $scope.PatientInsuranceObj.VerifiedDate = $filter("date")(new Date(InsuranceEditItem.VerifiedDate), "MM-dd-yyyy") || "";
                    //}
                    // insurance inds 
                    $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = InsuranceEditItem.IsInsuranceConnectedAppointment || false;
                    $scope.PatientInsuranceObj.IsConnectToFutureAppointment = InsuranceEditItem.IsConnectToFutureAppointment || false;
                    if ($scope.PatientInsuranceObj.GroupId == '') {
                        $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = true;
                    }
                    if ($scope.PatientInsuranceObj.PolicyId == '') {
                        $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = true;
                    }
                    if ($scope.PatientInsuranceObj.PayorName == '') {
                        $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = true;
                    }
                    if ($scope.PatientInsuranceObj.PlanName == '') {
                        $scope.PatientInsuranceObj.IsPalnIdDiasibleInd = false;
                    } else {
                        $scope.PatientInsuranceObj.IsPalnIdDiasibleInd = true;
                    }
                    if ($scope.PatientInsuranceObj.IsConnectToFutureAppointment == true) {
                        $scope.PatientInsuranceObj.IsConnectToFutureApptInd = true;
                    }

                }
                else {
                    $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = false;
                    $scope.PatientInsuranceObj.IsGroupIdDiasibleInd = false;
                    $scope.PatientInsuranceObj.IsPolicyIdDiasibleInd = false;
                    $scope.PatientInsuranceObj.IsPayorPlanDiasibleInd = false;
                    $scope.PatientInsuranceObj.IsPalnIdDiasibleInd = false;
                    $scope.ShowInsCopyBtn = true;
                    $scope.CoverageList = $scope.CoverageList || [];
                    if ($scope.CoverageList.length > 0) {
                        var CoverageObj = $filter("filter")($scope.CoverageList, { "IdentifierId": 1 }, true)[0];

                        CoverageObj = CoverageObj || "";
                        if (CoverageObj != "") {
                            $scope.PatientInsuranceObj.IdentifierId = CoverageObj.IdentifierId;
                            $scope.PatientInsuranceObj.IdentifierName = CoverageObj.IdentifierName;
                        }
                    }
                }
                onloding();
                OnloadAlluserlist();

                $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

              
               
              
                var reqObj2 = {
                    'LocationId': $scope.SearchPCPObj.LocationId,
                    'PageNumber': $scope.SearchPCPObj.PageNumber,
                    'PageSize': 100,
                    'SearchTaxt': '',
                    "SpecializationId": $scope.SearchPCPObj.SpecializationId,
                    "DeleteInd": $scope.SearchPCPObj.DeleteInd,
                    "OrganizationId": $scope.SearchPCPObj.OrganizationId,
                    "RefaralTypeId": 6
                };


                $q.all([
                    eHnotePatientAddressDataServices.getStatesByCountryId($scope.CountryId),
                    eHnoteReferalDataService.GetReferalPCPDoctors(reqObj2),

                ]).then(function (resp) {
                    if (resp[0].data.Status === "Success") {
                        if (resp[0].data.rows.length > 0) {
                            $scope.states = resp[0].data.rows;
                            $scope.PostalStates = resp[0].data.rows || [];
                            $scope.PermanentStates = resp[0].data.rows || [];
                        }
                    }
                    if (resp[1].data.status == "Success") {
                        if (resp[1].data.PcpRefdetails.length != 0) {
                            $scope.ExternalComanagerList = [];
                            $scope.ExternalComanagerList = resp[1].data.PcpRefdetails || [];
                            if ($scope.ExternalComanagerList.length > 0) {

                                angular.forEach($scope.ExternalComanagerList, function (kitem) {
                                    kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;

                                });

                                if ($scope.SearchPCPObj.External != 0) {
                                    $scope.SearchPCPObj.External = $filter('filter')($scope.ExternalComanagerList, { 'DoctorID': $scope.SearchPCPObj.External }, true)[0] || [];
                                }
                            }

                        } else {
                            return [];
                        }
                    }

                })
            }
            else {
                $scope.PatientInsuranceObj = GetInsuranceObj();
                $scope.PatientDetailsInfo = GetPatientDetailsInfo();
                $scope.PatientAddressInfo = GetPatientAddress();
                $scope.DemographicInfo = GetDemographicInfo();
                $scope.FamilyInfo = GetFamilyInfo();
                $scope.payorPlansListObj = getpayorPlanslistObj();
                IscheckMobileOrname();
                $scope.PatientInsuranceSummary = mainObject.PatientInsuranceSummary || [];
                $scope.InsuranceStatusList = mainObject.InsuranceStatusList || [];
                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);
                $scope.MartialStatusList = angular.copy(mObj.masterMartialStatusList);
                $scope.BloodGroupList = angular.copy(mObj.masterBloodGroupList);
                $scope.OccupationsList = angular.copy(mObj.masterOccupationsList);


                $scope.SelectedPatientTagList = angular.copy(mainObject.HospitalEquipmentList);
                $scope.PatientRaceList = mainObject.AllMasterData.PatientRace || [];
                $scope.MasterEducation = mainObject.AllMasterData.MasterEducation || [];
                $scope.FinancialResourceList = mainObject.AllMasterData.FinancialResourceList || [];
                $scope.MasterPhysicalActivity = angular.copy(mainObject.AllMasterData.MasterPhysicalActivity) || [];
                $scope.PatientEthnicityList = mainObject.AllMasterData.PatientEthnicity || [];
                $scope.PatientLanguageList = mainObject.AllMasterData.PatientLanguage || [];
                $scope.PatientLanguageExpressionList = mainObject.AllMasterData.LanguageExpression || [];
                $scope.PatientLanguageProficiencyList = mainObject.AllMasterData.LanguageProficiency || [];
                $scope.PatientSexualOrientationList = mainObject.AllMasterData.PatientSexualOrientation || [];
                $scope.PatientPronounList = mainObject.AllMasterData.MasterPronouns || [];
                $scope.PatientGenderIdentityList = mainObject.AllMasterData.PatientGenderIdentity || [];
                $scope.PatientPrefixList = mainObject.AllMasterData.PatientTitle || [];
                $scope.PatientSuffixList = mainObject.AllMasterData.PatientSuffix || [];
                $scope.TitlesList = mainObject.TitlesList || [];
                $scope.HospitalReferenceMaster = mainObject.AllMasterData.HospitalReferenceMaster || [];

            onloding();
                OnloadAlluserlist();

                var reqObj2 = {
                    'LocationId': $scope.SearchPCPObj.LocationId,
                    'PageNumber': $scope.SearchPCPObj.PageNumber,
                    'PageSize': 100,
                    'SearchTaxt': '',
                    "SpecializationId": $scope.SearchPCPObj.SpecializationId,
                    "DeleteInd": $scope.SearchPCPObj.DeleteInd,
                    "OrganizationId": $scope.SearchPCPObj.OrganizationId,
                    "RefaralTypeId": 6
                };
                $q.all([
                    eHnotePatientAddressDataServices.getStatesByCountryId($scope.CountryId),
                    eHnoteSettingsDataService.GetPatientRelatedMasterData(),
                    eHnoteReferalDataService.GetReferalPCPDoctors(reqObj2),
                ]).then(function (resp) {
                    if (resp[0].data.Status === "Success") {
                        if (resp[0].data.rows.length > 0) {
                            $scope.states = resp[0].data.rows;
                            $scope.PostalStates = resp[0].data.rows || [];
                            $scope.PermanentStates = resp[0].data.rows || [];
                        }
                    };
                    if (resp[1].data.status === "Success") {
                        $scope.PatientMasterDataArray = resp[1].data.rows;
                        $scope.PatientSuffixList = resp[1].data.PatientSuffix;
                        $scope.PatientEthnicityList = resp[1].data.PatientEthnicity;
                        if ($scope.PatientEthnicityList.length > 0) {
                            angular.forEach($scope.PatientEthnicityList, function (kitem) {
                                kitem.IsSelected = false;
                                kitem.Id = 0;
                            });
                        }
                        $scope.PatientRaceList = resp[1].data.PatientRace;
                        if ($scope.PatientRaceList.length > 0) {
                            angular.forEach($scope.PatientRaceList, function (kitem) {
                                kitem.IsSelected = false;
                                kitem.Id = 0;
                            });
                        }
                        $scope.MasterEducation = resp[1].data.MasterEducation || [];
                        $scope.FinancialResourceList = resp[1].data.FinancialResourceList || [];
                        $scope.MasterPhysicalActivity = angular.copy(resp[1].data.MasterPhysicalActivity) || [];
                        $scope.PatientPronounList = resp[1].data.MasterPronouns||[];
                        $scope.PatientSexualOrientationList = resp[1].data.PatientSexualOrientation;
                        $scope.PatientGenderIdentityList = resp[1].data.PatientGenderIdentity;
                        $scope.PatientNationalityList = resp[1].data.PatientNationality;
                        $scope.PatientLanguageList = resp[1].data.PatientLanguage;
                        $scope.InsuranceRelationShipList = resp[1].data.InsuranceRelationShip;

                        $scope.InsurancePlanTypeList = resp[1].data.InsurancePlanType;
                        $scope.PatientPrefixList = resp[1].data.PatientTitle;
                        $scope.PatientLanguageProficiencyList = resp[1].data.LanguageProficiency;
                        $scope.PatientLanguageExpressionList = resp[1].data.LanguageExpression;
                        $scope.PatientClassArray = resp[1].data.PatientClass;
                        $scope.InsuranceCoverageList = resp[1].data.CoverageArray;
                        $scope.InsuranceStatusList = resp[1].data.InsuranceStatus;
                        $scope.CoverageList = resp[1].data.InsuranceIdentifierList || [];
                        $scope.MSPInsuranceTypeList = resp[1].data.MSPInsuranceTypes || [];
                        if ($scope.CoverageList.length > 0) {
                            $scope.CoverageList = $filter("filter")($scope.CoverageList, function (item, index) { return item.IdentifierId !== 6 && item.IdentifierId !== 7 });
                        }
                    }
                    if (resp[2].data.status == "Success") {
                        if (resp[2].data.PcpRefdetails.length != 0) {
                            $scope.ExternalComanagerList = [];
                            $scope.ExternalComanagerList = resp[2].data.PcpRefdetails || [];
                            if ($scope.ExternalComanagerList.length > 0) {

                                angular.forEach($scope.ExternalComanagerList, function (kitem) {
                                    kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;

                                });

                                if ($scope.SearchPCPObj.External != 0) {
                                    $scope.SearchPCPObj.External = $filter('filter')($scope.ExternalComanagerList, { 'DoctorID': $scope.SearchPCPObj.External }, true)[0] || [];
                                }
                            }

                        } else {
                            return [];
                        }
                    }
                });
                if ($scope.PatientEthnicityList.length > 0) {
                    angular.forEach($scope.PatientEthnicityList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }

                if ($scope.PatientRaceList.length > 0) {
                    angular.forEach($scope.PatientRaceList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }

                mainObject.Tab = mainObject.Tab || 1;

                $scope.mainEditPatientProfileObj.MainTab = mainObject.Tab || 1;

                if ($scope.mainEditPatientProfileObj.MainTab === 1) {
                    $scope.SaveTypeObj.TypeName = 'PatientDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 2) {
                    $scope.SaveTypeObj.TypeName = 'AddressDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 3) {
                    $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 4) {
                    $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
                } else if ($scope.mainEditPatientProfileObj.MainTab === 5) {
                    $scope.SaveTypeObj.TypeName = 'FamilyDetails';
                }

                $scope.ShowInsuranceAddnew = mainObject.ShowInsuranceAddnew || false;
            }
        };

        $scope.init();
        

        $scope.PatientTagToggle = function (item) {
            var checkedArray = _.where($scope.SelectedPatientTagList, { IsChecked: true });
            $scope.TagPatientObj.AllPatientTagsCheck = checkedArray.length > 0 && $scope.SelectedPatientTagList.length === checkedArray.length ? true : false;
            if ($scope.TagPatientObj.AllPatientTagsCheck) {
                $scope.TagPatientObj.SelectTag = 'All';
            }

            if (!$scope.TagPatientObj.AllPatientTagsCheck && checkedArray.length > 0) {
                $scope.TagPatientObj.SelectTag = 'Selected';
            }
            if (checkedArray.length > 4) {
                item.IsChecked = false;
                alertify.error("Patient Tag Limit is Reached");
                return false;
            }
        };
        $scope.changePatientAuthorization = function (AuthorizationId, Type) {
            if (AuthorizationId === null) {
                $scope.PatientDetailsInfo.AuthorizationId = "";
                return false;
            }
            $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = Type;
            const obj = $scope.PatientDetailsInfo.ContactInfo;
            const hasAuthId = !!AuthorizationId;
            // Now apply logic based on the Type
            switch (Type) {
                case 1: // Email
                    if (hasAuthId) {
                        obj.IsPatientEmailInd = true;
                        obj.AuthEmailInd = true;
                        obj.IsfutureCommunications = true;
                        obj.UnAuthorisedInd = false;
                    } else {
                        obj.IsPatientEmailInd = false;
                        obj.AuthEmailInd = false;
                        if (!obj.AuthEmailInd && !obj.AuthSMSInd && !obj.AuthBothInd) {
                            obj.IsfutureCommunications = false;
                        }
                    }
                    break;

                case 2: // SMS
                    if (hasAuthId) {
                        obj.AuthSMSInd = true;
                        obj.IsPatientSmsInd = true;
                        obj.IsfutureCommunications = true;
                        obj.UnAuthorisedInd = false;
                    } else {
                        obj.AuthSMSInd = false;
                        obj.IsPatientSmsInd = false;
                        if (!obj.AuthEmailInd && !obj.AuthSMSInd && !obj.AuthBothInd) {
                            obj.IsfutureCommunications = false;
                        }
                    }
                    break;

                case 3: // Both
                    if (hasAuthId) {
                        obj.IsPatientEmailInd = true;
                        obj.AuthEmailInd = true;
                        obj.AuthSMSInd = true;
                        obj.IsPatientSmsInd = true;
                        obj.AuthBothInd = true;
                        obj.IsfutureCommunications = true;
                        obj.UnAuthorisedInd = false;
                    } else {
                        obj.IsPatientEmailInd = false;
                        obj.AuthEmailInd = false;
                        obj.AuthSMSInd = false;
                        obj.IsPatientSmsInd = false;
                        obj.AuthBothInd = false;
                        //obj.UnAuthorisedInd = true;
                        if (!obj.AuthEmailInd && !obj.AuthSMSInd && !obj.AuthBothInd) {
                            obj.IsfutureCommunications = false;
                        }
                    }
                    break;

                case 4: // Unauthorized
                    obj.IsPatientEmailInd = false;
                    obj.AuthEmailInd = false;
                    obj.AuthSMSInd = false;
                    obj.IsPatientSmsInd = false;
                    obj.AuthBothInd = false;
                    obj.IsfutureCommunications = false;
                    obj.UnAuthorisedInd = hasAuthId ? true : false;
                    break;
            }

            // Final corrections
            if (!obj.AuthEmailInd && !obj.AuthSMSInd && !obj.AuthBothInd) {
                obj.AuthorizationId = '';
            }
            if ((!obj.AuthEmailInd && obj.AuthSMSInd) || (obj.AuthEmailInd && !obj.AuthSMSInd)) {
                obj.AuthBothInd = false;
            }
            if (obj.AuthEmailInd && obj.AuthSMSInd) {
                obj.IsPatientEmailInd = true;
                obj.IsPatientSmsInd = true;
                obj.AuthBothInd = true;
                obj.IsfutureCommunications = true;
                obj.UnAuthorisedInd = false;
            }
        };



        //$scope.changePatientAuthorization = function (AuthorizationId) {
        //    if (AuthorizationId === null) {
        //        $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "";
        //        return false;
        //    }

        //    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = AuthorizationId || "";
        //    if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == "1") {
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = true;
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = false;
        //        $scope.PatientDetailsInfo.IsfutureCommunications = true;
        //    }
        //    else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == "2") {
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = false;
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = true;
        //        $scope.PatientDetailsInfo.IsfutureCommunications = true;
        //    }
        //    else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == "3") {
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = true;
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = true;
        //        $scope.PatientDetailsInfo.IsfutureCommunications = true;
        //    }
        //    else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == "4") {
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = false;
        //        $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = false;
        //        $scope.PatientDetailsInfo.IsfutureCommunications = false;
        //    }

        //};
       
        $scope.selectPrintImgLogo1 = function (file) {
            $scope.PatientDetailsInfo.PatientProfilePicDetails = [];

            $scope.isLogoDefault = false;
            $scope.isLogoThumbnailDefault = true;
            $scope.isLogoS3URLDefault = false;
            $scope.IsModifedLogo = true;

            $scope.PatientDetailsInfo.S3URL = '';
            $scope.file = "";

            $scope.file = file;
            if ($scope.file != null) {
                var pName = $scope.file.name, name = "";
                $scope.PatientDetailsInfo.FileName = pName;
                $scope.PatientDetailsInfo.FileExt = $scope.file.type;
                var type = $scope.file.type.split("/")[1];
                if (pName.length > 9) {
                    name = pName.substring(0, 9) + "..." + "." + type;
                } else {
                    name = angular.copy(pName) + '.' + type;
                }


                var obj = {
                    "file": $scope.file,
                    "DocumentTypeId": "",
                    "DeleteInd": false,
                    "DocumentId": 0,
                    "DocumentExt": $scope.file.type,
                    "DisplayName": name,
                    "Thumbnail": ""
                };


                if ($scope.file.type != 'application/pdf') {
                //    $scope.PatientDetailsInfo.PatientProfilePicDetails.push(obj);
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let img = new Image();
                        img.src = event.target.result;
                        img.onload = function () {
                            let canvas = document.createElement("canvas");
                            let ctx = canvas.getContext("2d");

                            // Define thumbnail size (e.g., 100x100 pixels)
                            let maxWidth = 100;
                            let maxHeight = 100;
                            let width = img.width;
                            let height = img.height;

                            // Maintain aspect ratio
                            if (width > height) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            } else {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }

                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);

                            // Convert to Base64 and store it
                            obj.Thumbnail = canvas.toDataURL("image/png");

                            $scope.PatientDetailsInfo.PatientProfilePicDetails = $scope.PatientDetailsInfo.PatientProfilePicDetails || [];
                            $scope.PatientDetailsInfo.PatientProfilePicDetails.push(obj);
                            $scope.$apply();

                        };
                    };

                    reader.readAsDataURL(file);
                }

                angular.element("input[type='file']").val(null);
            }
        };

        $scope.newcaptureimage = function () {

            // $scope.ClosepatientPhotoUpload();
            $scope.modelIntance = $uibModal.open({
                "size": 'md',
                "templateUrl": 'loadNewpopup.html',
                "scope": $scope,
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
            });
        };

        $scope.cancelCapturePopup = function () {
            $scope.PatientDetailsInfo.S3URL = '';
            $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
            $scope.modelIntance.dismiss('cancel');

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

        $scope.removeImage = function () {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                $scope.IsModifedLogo = false;
                $scope.PatientDetailsInfo.S3URL = '';
                $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
                $scope.file = "";
            }, function () {
                return;
            });
        }

       

        $scope.PatientSaveAndClose = function (type) {
            //if ($scope.PatientDetailsInfo.ContactInfo.HomeNumber == "" || null) {
            //    alertify.error("Please Enter Your Mobile Number");
            //    return false;
            //}

            //var DisplayContactnumber = angular.copy($scope.PatientDetailsInfo.DisplayMobileNumber) || "";
            //if ($scope.PatientDetailsInfo.DisplayMobileNumber != '' || $scope.PatientDetailsInfo.DisplayMobileNumber != '') {
            //    if ((DisplayContactnumber.toString()).length < 14) {
            //        alertify.error("Please Enter Valid Mobile Number");
            //        return false;
            //    }
            //}
            $scope.SaveTypeObj.TypeName = 'PatientDetails';
            $scope.RegisterPatientSave(type);

        };

        $scope.clearExpireDates = function () {
            $scope.PatientInsuranceObj.ExpiryDate = ""
            
        }
        $scope.clearEffectiveDates = function () {
            $scope.PatientInsuranceObj.EffectiveDate = ""
        }
        $scope.RegisterPatientSave = function (type, EditMode) {
            OverAllPatientSave = (type == 'Final') ? true : false;
            if ($scope.SaveTypeObj.TypeName === "PatientDetails") {
                $scope.Finalsubmit = "";
                $scope.ValidateIndictor = false;
                $scope.PatientSave(type);
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);
            }
            else if ($scope.SaveTypeObj.TypeName === "AddressDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientAddressSave(type);
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);
            }
            else if ($scope.SaveTypeObj.TypeName === "DemographicsDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientDemographicsSave(type);
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);
            }
            else if ($scope.SaveTypeObj.TypeName === "FamilyDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientFamilySave(type);
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);
            }
            //else if ($scope.SaveTypeObj.TypeName === "DesignatedDetails") {
            //    $scope.ValidateIndictor = false;
            //    $scope.PatientDesignatedSave(type);
            //}
            else if ($scope.SaveTypeObj.TypeName === "InsuranceDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientInsuranceDetailsSave(type, EditMode);
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);
            }
            else {
                $scope.ValidateIndictor = false;
            }
            //alertify.success("Saved Successfully");
            

        }
        $scope.encryptData = function (data) {
            return btoa(data); // Simple Base64 Encoding
        };
        $scope.PatientSave = function (type) {

            var FirstName = $scope.PatientDetailsInfo.FirstName || "";
            var LastName = $scope.PatientDetailsInfo.LastName || "";
            var MiddleName = $scope.PatientDetailsInfo.MiddleName || "";

            function isValidName(name) {
                const regex = /[a-zA-Z]/;
                return regex.test(name);
            }

            // First Name 

            if ($scope.IsFirstNameNoManadatory === true) {
                // Full validation when mandatory
                if (!FirstName) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient First Name");
                    return false;
                }

                if (FirstName.length < 2) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter First Name Minimum 2 letters");
                    return false;
                }

                if (!isValidName(FirstName)) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter at least one letter in the First Name.");
                    return false;
                }
            } else {

                // Not mandatory – only validate if something is entered
                if (FirstName && FirstName.trim().length > 0) {
                    if (FirstName.length < 2) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Enter First Name Minimum 2 letters");
                        return false;
                    }

                    if (!isValidName(FirstName)) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please enter at least one letter in the First Name.");
                        return false;
                    }
                }
            }

           //Middel Name 

            if ($scope.IsMiddleNameNoManadatory) {
                if (!MiddleName) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Middle Name");
                    return false;
                }
                if ($scope.PatientDetailsInfo.MiddleName != "") {

                  
                    if (!isValidName(MiddleName)) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please enter at least one letter in the Middle Name");
                        return false;
                    }
                }
            }

            // Last Name 
           
            if ($scope.IsLastNameNoManadatory === true) {
                // Mandatory – check for empty and valid
                if (LastName.trim() === "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Last Name");
                    return false;
                }

                if (!isValidName(LastName)) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter at least one letter in the Last Name.");
                    return false;
                }
            } else {
                // Optional – only check if value is entered
                if (LastName.trim().length > 0) {
                    if (!isValidName(LastName)) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please enter at least one letter in the Last Name.");
                        return false;
                    }
                }
            }





            if ($scope.IsSecondLastNameMandatory) {
                $scope.PatientDetailsInfo.SecondLastName = $scope.PatientDetailsInfo.SecondLastName || "";
                if ($scope.PatientDetailsInfo.SecondLastName === "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Second Last Name");
                    return false;
                }
            }
            $scope.PatientDetailsInfo.SuffixName = $scope.PatientDetailsInfo.SuffixName || '';
            if ($scope.PatientDetailsInfo.AuthorizedUser) {
                $scope.PatientDetailsInfo.AuthorizedUserEmailId = $scope.PatientDetailsInfo.AuthorizedUserEmailId || "";
                if ($scope.PatientDetailsInfo.AuthorizedUserEmailId === "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Valid Authorized Email ID");
                    return false;
                }
                $scope.PatientDetailsInfo.AuthorizedUserFullName = $scope.PatientDetailsInfo.AuthorizedUserFullName || "";
                if ($scope.PatientDetailsInfo.AuthorizedUserFullName === "") {
                    alertify.error("Please Enter Patient Authorized User Name");
                    return false;
                }
            }

            if ($scope.IsDOBNoManadatory) {
                if ($scope.PatientDetailsInfo.DOB === null || $scope.PatientDetailsInfo.DOB === "" || $scope.PatientDetailsInfo.DOB === undefined) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient DOB");
                    return false;
                }
                if (!$scope.PatientDetailsInfo.ageinYears && !$scope.PatientDetailsInfo.ageinMonths) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Select Patient Age");
                    return false;
                }
            }
            
           
            if ($scope.IsGenderNoManadatory) {
                if ($scope.PatientDetailsInfo.Gender === null || $scope.PatientDetailsInfo.Gender === "" || $scope.PatientDetailsInfo.Gender === undefined) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Gender");
                    return false;
                }
            }
            if ($scope.PatientDetailsInfo.DateOfDeath === "") {
                $scope.PatientDetailsInfo.DateOfDeath = null;
            }


            if ($scope.IsPreviousNameMandatory) {
                $scope.PatientDetailsInfo.PreviousName = $scope.PatientDetailsInfo.PreviousName || "";
                if ($scope.PatientDetailsInfo.PreviousName === "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Previous Name");
                    return false;
                }
            }

            if ($scope.IsEmailIdNoManadatory) {
                if ($scope.PatientDetailsInfo.ContactInfo.EmailID == undefined || $scope.PatientDetailsInfo.ContactInfo.EmailID == "" ) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Email ID");
                    return false;
                }
            }

            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '';
            //if ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode == '' || ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode.toString()).length < 2) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Enter Valid Area Code");
            //    return false;
            //}
            var HomeAreaCode = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode) || "";
            //if ((HomeAreaCode.toString()).length < 3) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Enter Area Code minimum 3 characters");
            //    return false;
            //}

            console.log($scope.PatientDetailsInfo.DisplayMobileNumber + "__DisplayMobileNumber");
            //var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeNumber) || "";
            //if ((MobileNumber.toString()).length != 7) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Enter Valid Mobile Number");
            //    return false;
            //}
            if ($scope.IsMobileNoManadatory) {
                if (($scope.PatientDetailsInfo.DisplayMobileNumber.toString()).length < 14) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Mobile Number");
                    return false;
                }


                var firstDigit = HomeAreaCode.toString().charAt(0);
                if (firstDigit === '0' || firstDigit === '1') {
                    $scope.ValidateIndictor = true;
                    alertify.error("Mobile number cannot start with 0 or 1");
                    return false;
                }
            } else {
                var mobileNumber = $scope.PatientDetailsInfo.DisplayMobileNumber;

                if (mobileNumber && mobileNumber.toString().trim().length > 0) {
                    if (mobileNumber.toString().length < 14) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Enter Valid Mobile Number");
                        return false;
                    }

                    var firstDigit = HomeAreaCode.toString().charAt(0);
                    if (firstDigit === '0' || firstDigit === '1') {
                        $scope.ValidateIndictor = true;
                        alertify.error("Mobile number cannot start with 0 or 1");
                        return false;
                    }
                }     
            }
       
            $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode || '';
            //if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode != '' || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber != '') {
            //    if (($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode.toString()).length < 2) {
            //        $scope.ValidateIndictor = true;
            //        alertify.error("Please Enter Valid Area Code");
            //        return false;
            //    }
            //}



            //var Contactnumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.OfficeNumber) || "";
            //if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode != '' || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber != '') {
            //    if ((Contactnumber.toString()).length != 7) {
            //        $scope.ValidateIndictor = true;
            //        alertify.error("Please Enter Valid Mobile Number");
            //        return false;
            //    }
            //}


            var Contactnumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.OfficeNumber) || "";
            var OfficeAreaCode = $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode || "";
         
            // Remove spaces or dashes if needed
            Contactnumber = Contactnumber.toString().replace(/\s|-/g, '');

            if ($scope.IsAlternativeNumberNoManadatory === true) {
               
                if (OfficeAreaCode === '' && Contactnumber === '') {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Office Number");
                    return false;
                }

                if (Contactnumber.length !== 7) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Office Number");
                    return false;
                }

            } else {
              
                if (OfficeAreaCode !== '' || Contactnumber !== '') {
                    if (Contactnumber.length !== 7) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Enter Valid 7-digit Office Number");
                        return false;
                    }
                }
            }


            var SSNno = angular.copy($scope.PatientDetailsInfo.SocialSecurityNo) || "";
            SSNno = SSNno.toString();
            if (SSNno != "" && SSNno.length !== "" && SSNno.length < 4) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid SSN Number");
                return false;
            }
            if ($scope.PatientDetailsInfo.FaxNumber != "") {
                if ($scope.PatientDetailsInfo.FaxNumber.length < 14) {
                    alertify.error("Please Enter Valid Fax");
                    return false;
                }
            }
         

       
            $scope.PatientDetailsInfo.Employer = $scope.PatientDetailsInfo.Employer || "";
            if ($scope.IsEmployerNameNoManadatory) {
                if ($scope.PatientDetailsInfo.Employer == "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Employer Name");
                    return false;
                }
            }

            //$scope.PatientDetailsInfo.EmployerPhoneNo = $scope.PatientDetailsInfo.EmployerPhoneNo || "";
            //if ($scope.PatientDetailsInfo.EmployerPhoneNo != "") {
            //    if ($scope.PatientDetailsInfo.EmployerPhoneNo.length < 14) {
            //        $scope.ValidateIndictor = true;
            //        alertify.error("Please Enter Valid Office Mobile Number");
            //        return false;
            //    }
            //}
             
            $scope.PatientDetailsInfo.OccupationId = $scope.PatientDetailsInfo.OccupationId || null;
            if ($scope.IsOccupationNoManadatory) {
                if ($scope.PatientDetailsInfo.OccupationId == null) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Add the Occupation");
                    return false;
                }
            }

            $scope.PatientDetailsInfo.EmployerPhoneNo = $scope.PatientDetailsInfo.EmployerPhoneNo || "";
            var EmployerPhoneNo = $scope.PatientDetailsInfo.EmployerPhoneNo;
           

            if ($scope.IsEmployerPhoneNumberNoManadatory === true) {
               
                if (EmployerPhoneNo.trim() === "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Employer Mobile Number");
                    return false;
                }

                if (EmployerPhoneNo.length < 14) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Employer Mobile Number");
                    return false;
                }

            } else {
              
                if (EmployerPhoneNo.trim() !== "" && EmployerPhoneNo.length < 14) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Employer Mobile Number");
                    return false;
                }
            }







            $scope.PatientDetailsInfo.EmeregecyContactNo = $scope.PatientDetailsInfo.EmeregecyContactNo || "";
            if ($scope.PatientDetailsInfo.EmeregecyContactNo != "") {
                if ($scope.PatientDetailsInfo.EmeregecyContactNo.length < 14) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Emergency Mobile Number");
                    return false;
                }
            }

            $scope.PatientTagList = [];
            let selectedpatientTagsList = $filter('filter')($scope.SelectedPatientTagList, { 'IsChecked': true }, true);
            $scope.PatientTagList = angular.copy(selectedpatientTagsList);

            $scope.Finalsubmit = type || "";
            let ExternalComanagerId = $scope.SearchPCPObj.External.DoctorID;
            let InternalComanagerId = $scope.SearchPCPObj.Internal.DoctorID;
            //$scope.PatientApptPCPInfo.PCP = $scope.PatientApptPCPInfo.PCP || null;
            //$scope.PatientApptPCPInfo.PcpNPI = $scope.PatientApptPCPInfo.PcpNPI || "";
            //$scope.PatientApptPCPInfo.PCPContactNo = $scope.PatientApptPCPInfo.PCPContactNo || "";
            //$scope.PatientApptPCPInfo.PCPEmailId = $scope.PatientApptPCPInfo.PCPEmailId || "";

            //$scope.PatientApptPCPInfo.ReferalEmailId = $scope.PatientApptPCPInfo.ReferalEmailId || "";
            //$scope.PatientApptPCPInfo.ReferalNPI = $scope.PatientApptPCPInfo.ReferalNPI || "";
            //$scope.PatientApptPCPInfo.ReferralContactNo = $scope.PatientApptPCPInfo.ReferralContactNo || 0;
            //$scope.PatientApptPCPInfo.Referral = $scope.PatientApptPCPInfo.Referral || null;
          
            var param = {
                "UserId": $scope.PatientDetailsInfo.UserId,
                "HospitalId": $scope.PatientDetailsInfo.HospitalId,
                "PatientId": $scope.PatientDetailsInfo.PatientID || 0,
                "TitleId": $scope.PatientDetailsInfo.TitleId || 0,
                "FirstName": $scope.PatientDetailsInfo.FirstName,
                "MiddleName": $scope.PatientDetailsInfo.MiddleName,
                "LastName": $scope.PatientDetailsInfo.LastName,
                "SecondLastName": $scope.PatientDetailsInfo.SecondLastName,
                "SuffixName": $scope.PatientDetailsInfo.SuffixName,
                "PreviousName": $scope.PatientDetailsInfo.PreviousName,
                "DOB": $filter("date")($scope.PatientDetailsInfo.DOB, "yyyy-MM-dd") || "",
                "Age": $scope.ageinYears,
                "SSN": $scope.PatientDetailsInfo.SocialSecurityNo,
                "FaxNumber": $scope.PatientDetailsInfo.FaxNumber,
                "Faxcountrycode": $scope.PatientDetailsInfo.Faxcountrycode,
                "FaxAreacode": $scope.PatientDetailsInfo.FaxAreacode,
                "FaxHomeNumber": $scope.PatientDetailsInfo.FaxHomeNumber,
                "Gender": $scope.PatientDetailsInfo.Gender,
                "PatientTagId": ($scope.PatientDetailsInfo.PatientTagId == 0 || $scope.PatientDetailsInfo.PatientTagId == null) ? null : $scope.PatientDetailsInfo.PatientTagId,
                "MaritalStatusId": $scope.PatientDetailsInfo.MaritalStatusID || null,
                "BloodGroupId": $scope.PatientDetailsInfo.BloodGroupId !== 0 ? $scope.PatientDetailsInfo.BloodGroupId : null,
                "CountryCode": $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode,
                "MobileNumber": $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber,
                "AreaCode": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode,
                "ContactNumber": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber,
                "LeadSourceInd": "N",
                "FileTypeId": 40,
                "PatientS3Url": $scope.PatientDetailsInfo.S3URL != "" ? $scope.PatientDetailsInfo.S3URL : "",
                "EmailID": $scope.PatientDetailsInfo.ContactInfo.EmailID,
                "FullName": $scope.PatientDetailsInfo.FirstName + $scope.PatientDetailsInfo.LastName || "",
                "DeviceEntityTypeId": 2,

                "HomeCountryCode": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode || "",
                "HomeAreaCode": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || "",
                "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber || "",
                "OfficeCountryCode": $scope.PatientDetailsInfo.ContactInfo.OfficeCountryCode || "",
                "OfficeAreaCode": $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode || "",
                "OfficeNumber": $scope.PatientDetailsInfo.ContactInfo.OfficeNumber || "",
                "MobileNo": "",
                "ContactNo": "",
                "IsPatientSmsInd": $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd,
                "IsPatientEmailInd": $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd,
                "IsNoChargePatient": $scope.PatientDetailsInfo.IsNoChargePatient || false,
                "IsDiseased": $scope.PatientDetailsInfo.IsDiseased || false,
                "DateOfDeath": $scope.PatientDetailsInfo.DateOfDeath,
                "CauseOfDeath": $scope.PatientDetailsInfo.CauseOfDeath || "",
                "OccupationId": $scope.PatientDetailsInfo.OccupationId || null,
                "OccupationDescription": $scope.PatientDetailsInfo.OccupationDescription,
                "EmployerPhoneNo": $scope.PatientDetailsInfo.EmployerPhoneNo,
                "EmergencyContactName": $scope.PatientDetailsInfo.EmergencyContactName,
                "EmeregecyContactNo": $scope.PatientDetailsInfo.EmeregecyContactNo,
                "FatherName": $scope.PatientDetailsInfo.FatherName || "",
                "MotherName": $scope.PatientDetailsInfo.MotherName || "",
                "Guardian": $scope.PatientDetailsInfo.Guardian || "",
                "Employer": $scope.PatientDetailsInfo.Employer || "",
                "PatientTagList": $scope.PatientTagList,
                "BirthSex": $scope.PatientDetailsInfo.BirthSex,
                "AuthorizedUserEmailId": $scope.PatientDetailsInfo.AuthorizedUserEmailId || "",
                "AuthorizedUserFullName": $scope.PatientDetailsInfo.AuthorizedUserFullName || "",
                "AuthorizedUserMobileNo": $scope.PatientDetailsInfo.AuthorizedUserMobileNo || "",
                "EmergencyRelationId": $scope.PatientDetailsInfo.EmergencyRelationId || 0,
                "InternalComanagerId": InternalComanagerId,
                "ExternalComanagerId": ExternalComanagerId,
                "Thumbnail": '',
                "FileName": $scope.PatientDetailsInfo.FileName || '',
                "FileExt": $scope.PatientDetailsInfo.FileExt || '',
                "AddressDetailsInfo": $scope.PatientAddressInfo,
            // "FileId": $scope.PatientDetailsInfo.FileId || 0,
                "PCP": $scope.PatientApptPCPInfo.PCP || null,
                "PcpNPI": $scope.PatientApptPCPInfo.PcpNPI || "",
                "PCPContactNo": $scope.PatientApptPCPInfo.PCPContactNo || "",
                "PCPEmailId": $scope.PatientApptPCPInfo.PCPEmailId,
                "Referral": $scope.PatientApptPCPInfo.Referral || null,
                "ReferalNPI": $scope.PatientApptPCPInfo.ReferalNPI || "",
                "ReferralContactNo": $scope.PatientApptPCPInfo.ReferralContactNo || 0,
                "ReferalEmailId": $scope.PatientApptPCPInfo.ReferalEmailId || "",
                "HospitalReferenceId": $scope.PatientDetailsInfo.HospitalReferenceId || null,
                "ReferenceNotes": $scope.PatientDetailsInfo.ReferenceNotes || '',
                "IsAllowAiAutomatedCalls": $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls || false,
            };
            if (param.HomeAreaCode != "" && param.HomeNumber != "") {
                param.MobileNo = param.MobileNo.concat(param.HomeCountryCode, param.HomeAreaCode, param.HomeNumber) || "";
            }
            else {
                param.MobileNo = "";
                param.HomeCountryCode = "";
            }
            param.ContactNo = param.ContactNo.concat(param.OfficeCountryCode, param.OfficeAreaCode, param.OfficeNumber) || "";

            var picdetails = {
                "patientProfilePicDetails": ""
            };
            if ($scope.PatientDetailsInfo.PatientProfilePicDetails != undefined && $scope.PatientDetailsInfo.PatientProfilePicDetails.length > 0) {
                picdetails.patientProfilePicDetails = $scope.PatientDetailsInfo.PatientProfilePicDetails;
                if ($scope.PatientDetailsInfo.PatientProfilePicDetails[0].Thumbnail) {
                    let thumbnail = $scope.PatientDetailsInfo.PatientProfilePicDetails[0].Thumbnail;
                    if (thumbnail.startsWith("data:image")) {
                        param.Thumbnail = $scope.encryptData($scope.PatientDetailsInfo.PatientProfilePicDetails[0].Thumbnail);
                    } else {
                        param.Thumbnail = thumbnail; // If already encrypted, keep as is
                    }
                } else {
                    param.Thumbnail = '';
                }
            }


            eHnotePatientDataService.USRegisterPatient(param, picdetails, OnAddPatientSuccess1, OnAddPatientError1);
        }
        function OnAddPatientSuccess1(resp) {
            if (resp.status === "success") {
                var response = resp;
                $scope.patientid = resp.PatientId;
                $scope.PatientDetailsInfo.PatientID = $scope.patientid;
                
                if (response.TitleId != null && response.TitleId != '') {
                    var filtertitle = $filter("filter")($scope.TitlesList, { "Id": response.TitleId }, true) || [];
                    if (filtertitle.length > 0) {
                        $scope.PatientDetailsInfo.Title = filtertitle[0].Name;
                        $scope.PatientDetailsInfo.TitleId = filtertitle[0].Id;
                    }
                }
                $scope.PatientDetailsInfo.OccupationId = response.OccupationId || null;
                $scope.PatientDetailsInfo.OccupationDescription = response.OccupationDescription;
                $scope.PatientDetailsInfo.EmployerPhoneNo = response.EmployerPhoneNo;
                $scope.PatientDetailsInfo.EmergencyContactName = response.EmergencyContactName;
                $scope.PatientDetailsInfo.EmeregecyContactNo = response.EmeregecyContactNo;


                $scope.PatientDetailsInfo.FirstName = response.FirstName;
                $scope.PatientDetailsInfo.MiddleName = response.MiddleName || '';
                $scope.PatientDetailsInfo.LastName = response.LastName;
                $scope.PatientDetailsInfo.SecondLastName = response.SecondLastName;
                $scope.PatientDetailsInfo.SuffixName = response.SuffixName;

                $scope.PatientDetailsInfo.FatherName = response.FatherName;
                $scope.PatientDetailsInfo.MotherName = response.MotherName;
                $scope.PatientDetailsInfo.Guardian = response.Guardian;
                $scope.PatientDetailsInfo.Employer = response.Employer;

                $scope.PatientDetailsInfo.IsNoChargePatient = response.IsNoChargePatient || false;
                $scope.PatientDetailsInfo.IsDiseased = response.IsDiseased || false;
                $scope.PatientDetailsInfo.CauseOfDeath = response.CauseOfDeath || "";
                $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls = response.IsAllowAiAutomatedCalls || false;

                response.DateOfDeath = response.DateOfDeath || '';

                if (response.DateOfDeath != '') {
                    $scope.PatientDetailsInfo.DateOfDeath = $filter('date')(response.DateOfDeath, "MM-dd-yyyy");
                } else {
                    $scope.PatientDetailsInfo.DateOfDeath = null;
                }

                if (response.DOB != "") {
                    $scope.PatientDetailsInfo.DOB = $filter('date')(response.DOB, "MM-dd-yyyy");
                }

                $scope.PatientDetailsInfo.SocialSecurityNo = response.SSN || "";

                $scope.PatientDetailsInfo.Gender = response.Gender || "";

                //patient details update insurance tab
                $scope.PatientInsuranceObj.PatientFirstName = response.FirstName || '';
                $scope.PatientInsuranceObj.PatientLastName = response.LastName || '';
                $scope.PatientInsuranceObj.PatientDOB = $filter('date')(response.DOB, "MM-dd-yyyy") || '';
                $scope.PatientInsuranceObj.PatientSSN = response.SSN || "";
                $scope.PatientInsuranceObj.PatientSecondLastName = response.SecondLastName;
                $scope.PatientInsuranceObj.PatientSuffix = response.SuffixName;
                $scope.PatientInsuranceObj.PatientMiddleName = response.MiddleName || '';

                if ($scope.PatientInsuranceObj.RelationShipId == 1) {
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = response.FirstName || '';
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = response.Gender == "Male" ? 'M' : 'F';
                    $scope.PatientInsuranceObj.InsuredPersonDOB = $filter('date')(response.DOB, "MM-dd-yyyy") || '';
                    $scope.PatientInsuranceObj.InsuredPersonSSN = response.SSN || "";
                    $scope.PatientInsuranceObj.InsuredPersonMiddleName = response.MiddleName || '';
                    $scope.PatientInsuranceObj.InsuredPersonLastName = response.LastName || '';
                    $scope.PatientInsuranceObj.InsuredPersonSecondLastName = response.SecondLastName;
                    $scope.PatientInsuranceObj.InsuredPersonSuffix = response.SuffixName;

                }

                response.MaritalStatus = response.MaritalStatus || '';
                if (response.MaritalStatus != "") {
                    var MaritalStatusId = parseInt(response.MaritalStatus) || '';
                    $scope.PatientDetailsInfo.MaritalStatusID = MaritalStatusId;
                    var filterStatus = $filter("filter")($scope.MartialStatusList, { "Id": MaritalStatusId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailsInfo.MaritalStatusName = filterStatus[0].MaritalStatus;
                    }
                }

                $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode = response.HomeCountryCode != '' ? response.HomeCountryCode : '';
                $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = response.HomeAreaCode || '';
                $scope.PatientDetailsInfo.ContactInfo.HomeNumber = response.HomeNumber || '';
                $scope.PatientDetailsInfo.ContactInfo.MobileNumber = response.MobileNumber || '';


                $scope.MNumber = response.HomeAreaCode + response.HomeNumber
                $scope.MNumber = $scope.MNumber || '';
                if ($scope.MNumber !='') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.MNumber);
                    $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
                }




                $scope.PatientDetailsInfo.ContactInfo.OfficeCountryCode = response.OfficeCountryCode != '' ? response.OfficeCountryCode : '';
                $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = response.OfficeAreaCode || "";
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = response.OfficeNumber || "";
                $scope.PatientDetailsInfo.ContactInfo.ContactNumber = response.ContactNumber || "";

                $scope.ONumber = response.OfficeAreaCode + response.OfficeNumber;
                $scope.ONumber = $scope.ONumber || '';
                if ($scope.ONumber !='') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.ONumber);
                    $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;
                }


                $scope.PatientDetailsInfo.ContactInfo.EmailID = response.EmailId || "";
                response.BloodGroupId = response.BloodGroupId || null;
                if (response.BloodGroupId != null) {
                    var filterStatus = $filter("filter")($scope.BloodGroupList, { "Id": response.BloodGroupId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailsInfo.BloodGroupName = filterStatus[0].BloodGroupName;
                        $scope.PatientDetailsInfo.BloodGroupId = filterStatus[0].Id;
                        $scope.PatientDetailsInfo.BloodGroupObj = filterStatus[0];
                    }
                }
                if (response.PatientTagId != "" && response.PatientTagId != 0 && response.PatientTagId != null) {
                    var filterStatus = [];
                    var PatientTagId = parseInt(response.PatientTagId) || 0;
                    $scope.PatientDetailsInfo.PatientTagId = PatientTagId;
                    filterStatus = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": PatientTagId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailsInfo.PatientTagName = filterStatus[0].HospitalEquipmentName;
                    }
                }

                if (response.PatientTagList.length > 0) {
                    $scope.PatientDetailsInfo.PatientTagList = angular.copy(response.PatientTagList);
                }
                $scope.PatientDetailsInfo.DisplayMobileNumber = $scope.PatientMobileNumber || "";
                $scope.PatientDetailsInfo.DisplayAlternateNumber = $scope.PatientOfficeNumber || "";
                $scope.PatientDetailsInfo.MobileNo = $scope.PatientMobileNumber || '';
                $scope.PatientDetailsInfo.Age = response.Age;
                $scope.PatientDetailsInfo.PatientDisplayID = response.PatientDisplayId;
                $scope.PatientDetailsInfo.FullName = response.FullName;
                $scope.PatientDetailsInfo.S3URL = response.S3URL || "";

                $scope.PatientDetailsInfo.AgeInDays = response.AgeInDays || "";
                $scope.PatientDetailsInfo.AgeInMonths = response.AgeInMonths || "";
                $scope.PatientDetailsInfo.AgeInYears = response.AgeInYears || "";

                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = response.IsPatientSmsInd || false;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = response.IsPatientEmailInd || false;
                $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "";

                if ($scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && !$scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = 1;
                }
                else if (!$scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = 2;
                }
                else if ($scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = 3;
                }
                else if (!$scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd && !$scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = 4;
                }

                $scope.PatientDetailsInfo.CreatedBy = resp.CreatedBy;
                $scope.PatientDetailsInfo.CreatedDt = $filter('date')(new Date(resp.CreatedDt), 'MM-dd-yyyy,hh:mm a');
                $scope.PatientDetailsInfo.ModifiedBy = resp.ModifiedBy;
                $scope.PatientDetailsInfo.ModifiedDt = $filter('date')(new Date(resp.ModifiedDt), 'MM-dd-yyyy,hh:mm a');
                alertify.success("Saved Successfully");
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);

                if ($scope.Finalsubmit === "Final") {
                    $uibModalInstance.close('Rcopia');
                }
               
               

            }
        }
        function OnAddPatientError1(err) {
            console.log(err);
            alertify.error(err);
        }

        $scope.AddPatietnDetailsLog = function (selectedItem) {
            let obj = {
                "UserHistoryId": 0,
                "UserId": $scope.UserId || null,
                "PatientId": selectedItem.PatientId || 0,
            };
            eHnoteMainAppointmentService.AddPatientDetailsLog(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    console.log("Added");
                }
            });
        }


        $scope.getPatientCaseHistoryItem = function (patientitem) {
            
            patientitem.PatientID = patientitem.PatientID || 0;
            if (patientitem.PatientID == 0) {
                return false;
            }

            let obj = {
                "PatientId": patientitem.PatientID,
            }
            $scope.AddPatietnDetailsLog(obj);

            datapersistanceFactory.set('CCDASeletedPatient', "");
            eHnoteAuditServices.getParticularPatientDetailsById(patientitem.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(response) {
                console.log(response);
                if (response.count > 0) {
                    patientitem = response.rows[0];
                    patientitem.PatientID = patientitem.PatientId;
                    patientitem.OldMrno = response.rows[0].OldMrno;
                    var item = {};
                    item.PatientDetails = {
                        "PatientID": patientitem.PatientID,
                        "Title": patientitem.Title,
                        "FullName": patientitem.FullName,
                        "DOB": patientitem.DOB,
                        "Gender": patientitem.Gender,
                        "AgeInYears": patientitem.AgeInYears,
                        "AgeInDays": patientitem.AgeInDays,
                        "AgeInMonths": patientitem.AgeInMonths,
                        "CurrentAge": patientitem.CurrentAge,
                        "PatientDisplayId": patientitem.DisplayID ? patientitem.DisplayID : "",
                        "OldMrno": patientitem.OldMrno ? patientitem.OldMrno : "",
                        "MobileNo": patientitem.PhoneNumber,
                        "ContactNo": patientitem.ContactNo || "",
                        "EmailId": patientitem.EmailID || "",
                        "PatientTypeId": patientitem.PatientTypeId || "",
                        "Age": patientitem.Age,
                        "PatientGSTNO": patientitem.PatientGSTNO,
                        "PhCntryCD": patientitem.CountryCode || ""
                    };
                    item.PatientID = patientitem.PatientID;
                    item.S3URL = patientitem.S3URL || "";
                    $scope.S3URL = patientitem.S3URL || "";


                    eHnoteMasterDataService.addAppointmentInfo(item);
                    let cacheStorageItem1 = eHnoteCacheStorageService.getCacheStorage();
                    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
                    /*  $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();*/
                    $scope.cacheStorageItem.PatientID = patientitem.PatientID;
                    $scope.cacheStorageItem.patientid = patientitem.PatientID;
                    $scope.cacheStorageItem.PatientName = patientitem.FullName;
                    $scope.cacheStorageItem.EmailID = patientitem.EmailID ? patientitem.EmailID : '';
                    $scope.cacheStorageItem.CountryCode = patientitem.CountryCode ? patientitem.CountryCode : '';
                    $scope.cacheStorageItem.PhoneNumber = patientitem.PhoneNumber ? patientitem.PhoneNumber : '';
                    $scope.cacheStorageItem.appointmentid = 0;
                    $scope.cacheStorageItem.AppointmentId = 0;
                    $scope.cacheStorageItem.appointmentStatus = "";
                    $scope.cacheStorageItem.AppointmentPatientUploads = [];
                    $scope.cacheStorageItem.AppointmentType = cacheStorageItem1.AppointmentType || '';
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);


                    eHnoteMasterDataService.addPatientDetailsforBarcode(item);


                    $scope.CheckPatientAppointmentStatus();
                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        };
        $scope.CheckPatientAppointmentStatus = function () {
            
            if ($scope.cacheStorageItem.appointmentid === 0) {
                var object = {
                    "PatientId": $scope.cacheStorageItem.patientid,
                    "AppointmentDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "DoctorId": eHnoteMasterDataService.getLoginId()
                };
            } else {
                var object = { "AppointmentID": $scope.cacheStorageItem.appointmentid };
            }
            eHnotePatientDataService.CheckAppointmentStatus(object).then(function (resp) {
                if (resp.data.Status) {
                    if (resp.data.AppointmentStatus === "D" || resp.data.AppointmentStatus === "E" || resp.data.AppointmentStatus === "O") {
                        $scope.cacheStorageItem.TreatmentPlanId = resp.data.TreatmentPlanId;
                        $scope.cacheStorageItem.ConsultationID = resp.data.ConsultationId;
                        $scope.cacheStorageItem.appointmentid = resp.data.AppointmentID;
                        $scope.cacheStorageItem.AppointmentId = resp.data.AppointmentID;
                        $scope.cacheStorageItem.AppointmentDt = resp.data.ConsultationDt;
                        $scope.cacheStorageItem.IsFollowupConsultation = false;
                        //  $scope.cacheStorageItem.IsNewConsultation = false;
                        $scope.cacheStorageItem.IsEditConsultation = true;
                        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
                        $scope.cacheStorageItem.AppointmentDoctorID = resp.data.DoctorId;
                        $scope.cacheStorageItem.appointmentStatus = resp.data.AppointmentStatus;

                    } else if (resp.data.AppointmentStatus === "B") {
                        $scope.cacheStorageItem.appointmentid = resp.data.AppointmentID;
                        $scope.cacheStorageItem.AppointmentDt = resp.data.ConsultationDt;
                        $scope.cacheStorageItem.TreatmentPlanId = 0;
                        $scope.cacheStorageItem.ConsultationID = 0;
                        // $scope.cacheStorageItem.IsNewConsultation = true;
                        $scope.cacheStorageItem.IsEditConsultation = false;
                        $scope.cacheStorageItem.IsFollowupConsultation = false;
                        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
                        $scope.cacheStorageItem.AppointmentDoctorID = resp.data.DoctorId;
                        $scope.cacheStorageItem.ConsultationDate = $scope.cacheStorageItem.AppointmentDt;
                        $scope.cacheStorageItem.appointmentStatus = resp.data.AppointmentStatus;
                    }
                    /*eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);*/

                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.AppointmentStatus = resp.data.AppointmentStatus || "";
                    appointmentinfo.AppointmentID = resp.data.AppointmentID || 0;
                    appointmentinfo.AppointmentId = resp.data.AppointmentID || 0;
                    appointmentinfo.DoctorID = resp.data.DoctorId || 0;
                    appointmentinfo.DoctorFullName = resp.data.DoctorName || "";
                    appointmentinfo.TreatmentPlanId = resp.data.TreatmentPlanId || 0;
                    appointmentinfo.BranchId = resp.data.BranchId || 0;
                    appointmentinfo.BranchName = resp.data.BranchName || "";
                    appointmentinfo.ConsultationDt = resp.data.ConsultationDt || "";
                    appointmentinfo.ConsultationId = resp.data.ConsultationId || 0;
                    appointmentinfo.StartTime = resp.data.AppointmentStartTime || "";
                    appointmentinfo.EndTime = resp.data.EndTime || "";
                    appointmentinfo.BillingId = resp.data.BillingId || 0;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                    $scope.cacheStorageItem.IsfromScreen = '';
                    if ($scope.$route.current.activetab == "ot") {
                        $scope.cacheStorageItem.IsfromScreen = "ascprofile";
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        let screen = 'ASC'
                        var obj = {
                            "Screen": screen,
                        };
                        eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                        //    $location.url("/ascprofile");
                        if (OverAllPatientSave) {
                            $location.url("/profile");
                        }
                    } else {
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        if ($scope.$route.current.activetab != "op" && OverAllPatientSave) {
                            $location.url("/profile");
                        }
                    }
                } else {
                    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                    appointmentinfo.AppointmentStatus = "";
                    appointmentinfo.AppointmentID = 0;
                    appointmentinfo.AppointmentId = 0;
                    appointmentinfo.DoctorID = 0;
                    appointmentinfo.DoctorFullName = "";
                    appointmentinfo.TreatmentPlanId = 0;
                    appointmentinfo.BranchId = 0;
                    appointmentinfo.BranchName = "";
                    appointmentinfo.ConsultationDt = "";
                    appointmentinfo.ConsultationId = 0;
                    appointmentinfo.StartTime = "";
                    appointmentinfo.BillingId = 0;
                    eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
                    $scope.cacheStorageItem.IsfromScreen = "";
                    if ($scope.$route.current.activetab == "ot") {
                        resp.data.AppointmentTypeId = resp.data.AppointmentTypeId || 0;
                        $scope.cacheStorageItem.AppointmentTypeId = resp.data.AppointmentTypeId || 0;
                        $scope.cacheStorageItem.IsfromScreen = "ascprofile";
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        let screen = 'ASC'
                        var obj = {
                            "Screen": screen,
                        };
                        eHnoteMasterDataService.addSelectedCrmApptDates(obj);
                        //    $location.url("/ascprofile");
                    } else {
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    }
                    if (OverAllPatientSave) {
                        $location.url("/profile");
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }
        $scope.PatientSaveAndNext = function () {
            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '';
            //if ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode == '' || ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode.toString()).length < 2) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Enter Valid Area Code");
            //    return false;
            //}
            var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeNumber) || "";
            //if ((MobileNumber.toString()).length != 7) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Enter Valid Mobile Number");
            //    return false;
            //}
           
            //var DisplayContactnumber = angular.copy($scope.PatientDetailsInfo.DisplayMobileNumber) || "";
            //if ($scope.PatientDetailsInfo.DisplayMobileNumber != '' || $scope.PatientDetailsInfo.DisplayMobileNumber != '') {
            //    if ((DisplayContactnumber.toString()).length < 14) {
            //        alertify.error("Please Enter Valid Mobile Number");
            //        return false;
            //    }
            //}
            $scope.SaveTypeObj.TypeName = 'PatientDetails';
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.mainEditPatientProfileObj.MainTab = 2;
                $scope.SaveTypeObj.TypeName = "AddressDetails";

            }
        };
        $scope.getDate = function (Tmpfromdate, patientObj, tempObj) {
            if ($scope.PatientDetailsInfo.DOB == '') {
                $scope.PatientDetailsInfo.ageinYears = '';
                $scope.PatientDetailsInfo.ageinMonths = '';

            }
            if (Tmpfromdate != "") {
                $scope.BSMSind1 = true;
                $scope.PatientDetailsInfo.BSMSind = true;
            }
            //  SAFARI-COMPATIBLE DATE PARSING USING MOMENT
            var fromMoment = moment(Tmpfromdate, 'MM-DD-YYYY', true); // ← Change format here if needed
            if (!fromMoment.isValid()) {
                console.warn("Invalid Tmpfromdate format:", Tmpfromdate);
                return;
            }
            var fromdate = fromMoment.toDate(); // native Date object
            var todate = new Date(); // today's date
            var age = [];
            var y = [todate.getFullYear(), fromdate.getFullYear()];
            var ydiff = y[0] - y[1];
            var m = [todate.getMonth(), fromdate.getMonth()];
            var mdiff = m[0] - m[1];
            var d = [todate.getDate(), fromdate.getDate()];
            var ddiff = d[0] - d[1];
            if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) {
                --ydiff;
                mdiff += 12;
            }
            if (ddiff < 0) {
                fromdate.setMonth(m[1] + 1, 0);
                ddiff = fromdate.getDate() - d[1] + d[0];
                --mdiff;
            }
            if (mdiff < 0) {
                mdiff += 12;
                --ydiff;
            }
            if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
            if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
            if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
            if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
            if (patientObj === "PatientDOB") {
                $scope.PatientDetailsInfo.ageinYears = ydiff.toString();
                $scope.PatientDetailsInfo.ageinMonths = mdiff.toString();
                $scope.PatientDetailsInfo.ageinDays = ddiff.toString();

                if ($scope.PatientDetailsInfo.ageinMonths === "-1") {
                    $scope.PatientDetailsInfo.ageinMonths = "";
                }

                var curAge = $scope.PatientDetailsInfo.ageinYears + '.' + $scope.PatientDetailsInfo.ageinMonths;
                $scope.PatientDetailsInfo.CurrentAge = curAge;
            }
            if (tempObj !== undefined) {
                tempObj.ageinYears = ydiff.toString();
                tempObj.ageinMonths = mdiff.toString();
                tempObj.ageinDays = ddiff.toString();

                if (tempObj.ageinMonths === "-1") {
                    tempObj.ageinMonths = "";
                }
                var curAge = tempObj.ageinYears + '.' + tempObj.ageinMonths;
                tempObj.CurrentAge = curAge;
                tempObj.Age = tempObj.ageinYears;
            }
        };


        //$scope.getDate = function (Tmpfromdate, patientObj, tempObj) {
        //    if (Tmpfromdate != "") {
        //        $scope.BSMSind1 = true;
        //        //$scope.BSMSind = true;
        //        $scope.PatientDetailsInfo.BSMSind = true;
        //    }
        //    var todate = new Date();
        //    var age = [];
        //    var fromdate = new Date(Tmpfromdate); 
        //    var y = [todate.getFullYear(), fromdate.getFullYear()];
        //    var ydiff = y[0] - y[1];
        //    var m = [todate.getMonth(), fromdate.getMonth()];
        //    var mdiff = m[0] - m[1];
        //    var d = [todate.getDate(), fromdate.getDate()];
        //    var ddiff = d[0] - d[1];
        //    if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) {
        //        --ydiff;
        //        mdiff += 12; 
        //    }

        //    if (ddiff < 0) {
        //        fromdate.setMonth(m[1] + 1, 0);
        //        ddiff = fromdate.getDate() - d[1] + d[0];
        //        --mdiff; 
        //    }
        //    if (mdiff < 0) {
        //        mdiff += 12;
        //        --ydiff;
        //    }

        //    if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        //    if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
        //    if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
        //    if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
        //    if (patientObj === "PatientDOB") {
        //        $scope.PatientDetailsInfo.ageinYears = ydiff.toString();
        //        $scope.PatientDetailsInfo.ageinMonths = mdiff.toString();
        //        $scope.PatientDetailsInfo.ageinDays = ddiff.toString();
        //        if ($scope.PatientDetailsInfo.ageinMonths === "-1") {
        //            $scope.PatientDetailsInfo.ageinMonths = "";
        //        }
        //        var curAge = $scope.PatientDetailsInfo.ageinYears + '.' + $scope.PatientDetailsInfo.ageinMonths;
        //        $scope.PatientDetailsInfo.CurrentAge = curAge;
        //    }

        //    if (tempObj != undefined) {
        //        tempObj.ageinYears = ydiff.toString();
        //        tempObj.ageinMonths = mdiff.toString();
        //        tempObj.ageinDays = ddiff.toString();
        //        if (tempObj.ageinMonths === "-1") {
        //            tempObj.ageinMonths = "";
        //        }
        //        var curAge = tempObj.ageinYears + '.' + tempObj.ageinMonths;
        //        tempObj.CurrentAge = curAge;
        //        tempObj.Age = tempObj.ageinYears;
        //    }
        //};
        $scope.setAgeandMonth = function (year, month, days) {
            $scope.PatientDetailsInfo.ageinYears = year;
            $scope.PatientDetailsInfo.ageinMonths = month || "";
            $scope.PatientDetailsInfo.ageinDays = days || "";
            if ($scope.ageinYears != "") {
                $scope.PatientDetailsInfo.BSMSind = false;
            }
            var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
            $scope.PatientDetailsInfo.CurrentAge = curAge;
            var dob = $scope.getDateOfBirth($scope.PatientDetailsInfo.ageinYears, $scope.PatientDetailsInfo.ageinMonths, $scope.PatientDetailsInfo.ageinDays);
            $scope.PatientDetailsInfo.DOB = moment(dob).format('MM-DD-YYYY');
            daysInMonth(month, year);
            if ($scope.PatientDetailsInfo.ageinYears === "" && $scope.PatientDetailsInfo.ageinMonths === "" && $scope.PatientDetailsInfo.ageinDays === "") {
                $scope.PatientDetailsInfo.DOB = "";
            }
        };

        $scope.ChangeIsPatientDiseased = function () {
            if ($scope.PatientDetailsInfo.IsDiseased == true) {
                $scope.PatientDetailsInfo.IsDiseased = true;
            } else {
                $scope.PatientDetailsInfo.IsDiseased = false;
                $scope.PatientDetailsInfo.DateOfDeath = "";
                $scope.PatientDetailsInfo.CauseOfDeath = "";
            }
        };

        $scope.ChangeIsPatientAuthorizedUser = function () {
            if ($scope.PatientDetailsInfo.AuthorizedUser == true) {
                $scope.PatientDetailsInfo.AuthorizedUser = true;
            } else {
                $scope.PatientDetailsInfo.AuthorizedUser = false;
                $scope.PatientDetailsInfo.AuthorizedUserEmailId = "";
                $scope.PatientDetailsInfo.AuthorizedUserFullName = "";
                $scope.PatientDetailsInfo.AuthorizedUserMobileNo = "";
            }
        };

        $scope.formatUSNumberAlternateinfo = function (phoneNumberString) {
            $scope.USAlternatenumberString = phoneNumberString || "";
            if ($scope.USAlternatenumberString != "") {
                console.log($scope.USAlternatenumberString);
                const match = phoneNumberString
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.PatientDetailsInfo.DisplayAlternateNumber = part1 + part2 + part3;

                if ($scope.USAlternatenumberString.length > 9) {
                    var Area = $scope.USAlternatenumberString.slice(0, 3);
                    $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = Area;
                    var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
                    $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = contact;
                } else if ($scope.USAlternatenumberString.length <= 9) {
                    var Area = $scope.USAlternatenumberString.slice(0, 3);
                    $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = Area;
                    var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
                    $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = contact;
                }
            } else {
                $scope.PatientDetailsInfo.DisplayAlternateNumber = "";
                $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = "";
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = "";
            }
        }
        
        $scope.ChangeOccupation = function (id) {
            id = id || null;
            if (id === null) {
                $scope.PatientDetailsInfo.OccupationId = null;
            } else {
                $scope.PatientDetailsInfo.OccupationId = id;
            }
        };

        $scope.changePhNumber = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PatientDetailsInfo.EmployerPhoneNo = obj.UsFormatMobileNumber;
        };

        $scope.changeEmeregecyContact = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PatientDetailsInfo.EmeregecyContactNo = obj.UsFormatMobileNumber;
        };

        $scope.AddressSaveAndClose = function (type) {
            $scope.SaveTypeObj.TypeName = 'AddressDetails';
            $scope.RegisterPatientSave(type);
        };

        $scope.PatientAddressSave = function (type) {
           
            
            $scope.PatientAddressInfo.PermanentAddress.AddressLine1 = $scope.PatientAddressInfo.PermanentAddress.AddressLine1 || "";
            $scope.PatientAddressInfo.PermanentAddress.AddressLine2 = $scope.PatientAddressInfo.PermanentAddress.AddressLine2 || "";
            $scope.PatientAddressInfo.PermanentAddress.ZipCode = ($scope.PatientAddressInfo.PermanentAddress.ZipCode || "").replace(/\D/g, "");
            $scope.PatientAddressInfo.PermanentAddress.CountyId = $scope.PatientAddressInfo.PermanentAddress.CountyId || null;
            $scope.PatientAddressInfo.PermanentAddress.CityId = $scope.PatientAddressInfo.PermanentAddress.CityId || null;
            $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.PatientAddressInfo.PermanentAddress.StateId || null;
            $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.PatientAddressInfo.PermanentAddress.CountryId || null;
            $scope.PatientAddressInfo.PostalAddress.AddressLine1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1 || "";
            $scope.PatientAddressInfo.PostalAddress.AddressLine2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2 || "";
            $scope.PatientAddressInfo.PostalAddress.ZipCode = ($scope.PatientAddressInfo.PostalAddress.ZipCode || "").replace(/\D/g, "");
            $scope.PatientAddressInfo.PostalAddress.CountyId = $scope.PatientAddressInfo.PostalAddress.CountyId || null;
            $scope.PatientAddressInfo.PostalAddress.CityId = $scope.PatientAddressInfo.PostalAddress.CityId || null;
            $scope.PatientAddressInfo.PostalAddress.StateId = $scope.PatientAddressInfo.PostalAddress.StateId || null;
            $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.PatientAddressInfo.PostalAddress.CountryId || null;


            // Postal  Address 

            if ($scope.IsAddressDetailsNoManadatory) {

                if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter AddressLine1 ");
                    return false;
                }
                //if ($scope.PatientAddressInfo.PostalAddress.AddressLine2 == "") {
                //    alertify.error("Please enter AddressLine2 ");
                //    return false;
                //}
                if ($scope.PatientAddressInfo.PostalAddress.CityId == null) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter City");
                    return false;
                }

             

                if ($scope.PatientAddressInfo.PostalAddress.StateId == null) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter State ");
                    return false;
                }
                if ($scope.PatientAddressInfo.PostalAddress.CountryId == null) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter Country ");
                    return false;
                }
                if ($scope.PatientAddressInfo.PostalAddress.ZipCode == "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter ZipCode");
                    return false;
                }

            }


            //$scope.PatientAddressInfo.PostalAddress.ZipCode = ($scope.PatientAddressInfo.PostalAddress.ZipCode || "").replace(/\D/g, "");
            //if (type !== "Final") {
            //    if ($scope.PatientAddressInfo.PostalAddress.ZipCode == '' || $scope.PatientAddressInfo.PostalAddress.ZipCode == null || $scope.PatientAddressInfo.PostalAddress.ZipCode == 0) {
            //        alertify.error("Please Enter Zip Code");
            //        return false;
            //    }
            //}

            $scope.PatientAddressInfo.PostalAddress.CountryName = $scope.PatientAddressInfo.PostalAddress.CountryName || "";
            $scope.PatientAddressInfo.PermanentAddress.CountryName = $scope.PatientAddressInfo.PermanentAddress.CountryName || "";

            $scope.PatientAddressInfo.PatientAddressDocuments = $scope.PatientAddressInfo.PatientAddressDocuments || [];
            $scope.tempAddressDocsArray = $scope.tempAddressDocsArray || [];
            angular.forEach($scope.PatientAddressInfo.PatientAddressDocuments, function (item) {
                if (item.PatientAddressDocumentId == 0) {
                    $scope.PatientAddressInfo.PatientAddressDocuments = $filter("filter")($scope.PatientAddressInfo.PatientAddressDocuments, function (iterator, ind) { return iterator.PatientAddressDocumentId === 0; }) || [];
                }
            });

            if ($scope.PatientAddressInfo.PermanentAddress.AddressId == 0 && $scope.PatientAddressInfo.PostalAddress.AddressId == 0 &&
                ($scope.PatientAddressInfo.PermanentAddress.AddressLine1 == "") && ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == "") &&
                ($scope.PatientAddressInfo.PermanentAddress.AddressLine2 == "") && ($scope.PatientAddressInfo.PostalAddress.AddressLine2 == "") &&
                ($scope.PatientAddressInfo.PermanentAddress.ZipCode == null || $scope.PatientAddressInfo.PermanentAddress.ZipCode === 0 || $scope.PatientAddressInfo.PermanentAddress.ZipCode == "" || $scope.PatientAddressInfo.PermanentAddress.ZipCode == undefined) &&
                ($scope.PatientAddressInfo.PostalAddress.ZipCode == null || $scope.PatientAddressInfo.PostalAddress.ZipCode === 0 || $scope.PatientAddressInfo.PostalAddress.ZipCode == "" || $scope.PatientAddressInfo.PostalAddress.ZipCode == undefined) &&
                ($scope.PatientAddressInfo.PermanentAddress.CountyId == null) && ($scope.PatientAddressInfo.PostalAddress.CountyId == null) &&
                ($scope.PatientAddressInfo.PermanentAddress.CityId == null) && ($scope.PatientAddressInfo.PostalAddress.CityId == null) &&
                ($scope.PatientAddressInfo.PermanentAddress.StateId == null) && ($scope.PatientAddressInfo.PostalAddress.StateId == null) && ($scope.tempAddressDocsArray.length == 0)) {
                if (type === "Final") {
                    $uibModalInstance.close();
                }
                return false;
            }
            var TempAddress = {
                "PatientId": $scope.patientid,
                "PatientDisplayID": $scope.PatientDisplayID,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AddressDetailsInfo": $scope.PatientAddressInfo,
                "FullName": $scope.PatientDetailsInfo.FirstName + $scope.PatientDetailsInfo.MiddleName + $scope.PatientDetailsInfo.LastName + $scope.PatientDetailsInfo.SecondLastName || ""
                /*"AddressDetailsInfo": angular.copy($scope.PatientAddressInfo)*/
            }

            eHnotePatientDataService.AppUpdatePatientAddressDetails(TempAddress, $scope.tempAddressDocsArray, callbackSuccess1, callbackError1);

            function callbackSuccess1(resp) {
                if (resp.Status == "Success") {

                    var PermanentResponseList = resp.PermanentAddress;
                    var PostalResponseList = resp.PostalAddress;
                    $scope.PatientAddressInfo.PermanentAddress.AddressLine1 = PermanentResponseList.AddressLine1 || "";
                    $scope.PatientAddressInfo.PermanentAddress.AddressLine2 = PermanentResponseList.AddressLine2 || "";
                    $scope.PatientAddressInfo.PermanentAddress.CityId = PermanentResponseList.CityId;
                    $scope.PatientAddressInfo.PermanentAddress.CityName = PermanentResponseList.CityName || "";
                    $scope.PatientAddressInfo.PermanentAddress.CountryId = PermanentResponseList.CountryId;
                    $scope.PatientAddressInfo.PermanentAddress.CountryName = PermanentResponseList.CountryName || "";
                    $scope.PatientAddressInfo.PermanentAddress.StateId = PermanentResponseList.StateId;
                    $scope.PatientAddressInfo.PermanentAddress.StateName = PermanentResponseList.StateName || "";
                    $scope.PatientAddressInfo.PermanentAddress.ZipCode = PermanentResponseList.ZipCode || "";
                    $scope.PatientAddressInfo.PermanentAddress.CountyName = PermanentResponseList.CountyName || "";
                    $scope.PatientAddressInfo.PermanentAddress.CountyId = PermanentResponseList.CountyId;

                    $scope.PatientAddressInfo.PostalAddress.AddressLine1 = PostalResponseList.AddressLine1 || "";
                    $scope.PatientAddressInfo.PostalAddress.AddressLine2 = PostalResponseList.AddressLine2 || "";
                    $scope.PatientAddressInfo.PostalAddress.CityId = PostalResponseList.CityId;
                    $scope.PatientAddressInfo.PostalAddress.CityName = PostalResponseList.CityName || "";
                    $scope.PatientAddressInfo.PostalAddress.CountryId = PostalResponseList.CountryId;
                    $scope.PatientAddressInfo.PostalAddress.CountryName = PostalResponseList.CountryName || "";
                    $scope.PatientAddressInfo.PostalAddress.StateId = PostalResponseList.StateId;
                    $scope.PatientAddressInfo.PostalAddress.StateName = PostalResponseList.StateName || "";
                    $scope.PatientAddressInfo.PostalAddress.ZipCode = PostalResponseList.ZipCode || "";
                    $scope.PatientAddressInfo.PostalAddress.CountyName = PostalResponseList.CountyName || "";
                    $scope.PatientAddressInfo.PostalAddress.CountyId = PostalResponseList.CountyId;

                    $scope.PatientAddressInfo.PatientAddressDocuments = resp.PatientAddressDocuments || [];

                    $scope.PatientAddressInfo.PermanentAddress.AddressId = PermanentResponseList.AddressId;
                    $scope.PatientAddressInfo.PostalAddress.AddressId = PostalResponseList.AddressId;
                    $scope.PatientAddressInfo.PermanentAddress.StateCode = PermanentResponseList.StateCode;
                    $scope.PatientAddressInfo.PostalAddress.StateCode = PostalResponseList.StateCode;

                    
                    if (type === "Final") {
                        $uibModalInstance.close('Rcopia');
                    }
                    $scope.tempAddressDocsArray = [];
                    alertify.success("Saved Successfully");
                  
                }
            }
            function callbackError1() {
                alertify.error("Creating  Failed");
            }

        }

        // function for insurance functionlaity 
        
        $scope.ShowInsuranceAddnewclick = function () {
            $scope.ShowInsuranceAddnew = false;
            $scope.ShowInsCopyBtn = true;
            $scope.Ffile = null;
            $scope.Bfile = null;
            $scope.frontItemUpload = false;
            $scope.frontItemS3Url = false;
            $scope.backItemUpload = false;
            $scope.backItemS3Url = false;
            if (mainObject.PatientDetails != "") {
                $scope.PatientInsuranceObj = GetInsuranceObj();
            }
            if ($scope.PatientInsuranceObj.RelationShipId == 1) {
                if (mainObject.PatientDetails !="") {
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = mainObject.PatientDetails.FirstName || '';
                    $scope.PatientInsuranceObj.InsuredPersonDOB = mainObject.PatientDetails.DOB;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = mainObject.PatientDetails.Gender == "Male" ? 'M' : 'F';
                    $scope.PatientInsuranceObj.InsuredPersonSSN = "";
                    $scope.PatientInsuranceObj.InsuredPersonMiddleName = mainObject.PatientDetails.MiddleName || '';
                    $scope.PatientInsuranceObj.InsuredPersonLastName = mainObject.PatientDetails.LastName || '';
                    $scope.PatientInsuranceObj.InsuredPersonSecondLastName = mainObject.PatientDetails.SecondLastName || '';
                    $scope.PatientInsuranceObj.InsuredPersonSuffix = mainObject.PatientDetails.SuffixName || '';
                }
            }
            if (mainObject.PatientDetails != "") {
                $scope.PatientInsuranceObj.PatientFirstName = mainObject.PatientDetails.FirstName || '';
                $scope.PatientInsuranceObj.PatientLastName = mainObject.PatientDetails.LastName || '';
                $scope.PatientInsuranceObj.PatientDOB = mainObject.PatientDetails.DOB;
                $scope.PatientInsuranceObj.PatientSSN = mainObject.PatientDetails.SocialSecurityNo || '';
                $scope.PatientInsuranceObj.PatientSecondLastName = mainObject.PatientDetails.SecondLastName || '';
                $scope.PatientInsuranceObj.PatientMiddleName = mainObject.PatientDetails.MiddleName || '';
                $scope.PatientInsuranceObj.PatientSuffix = mainObject.PatientDetails.SuffixName || '';
                $scope.PatientInsuranceObj.IsIdentifier = false;
            }

            $scope.PatientInsuranceObj.IsPlanEnabled = true;
            $scope.PatientInsuranceObj.IsCoverageEnabled = false;
            $scope.PatientInsuranceObj.IsPolicyIdEnabled = false;
            $scope.PatientInsuranceObj.IsGroupIdEnabled = false;

        };
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

                insItem.TempInsuranceImagesArray = insItem.TempInsuranceImagesArray || [];
                var obj = {
                    "file": $scope.Ffile,
                    "DeleteInd": "N",
                    "DocumentId": 0,
                    "DocumentExt": $scope.Ffile.type,
                    "DocumentName": name,
                    "DisplayName": "Front"
                };

                insItem.TempInsuranceImagesArray.push(obj);

                angular.element("input[type='file']").val(null);
            }
            var ScanDate = new Date();
            insItem.ScanDate = moment(ScanDate).format('MM-DD-YYYY');
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

                insItem.TempInsuranceImagesArray = insItem.TempInsuranceImagesArray || [];
                var obj = {
                    "file": $scope.Bfile,
                    "DeleteInd": "N",
                    "DocumentId": 0,
                    "DocumentExt": $scope.Bfile.type,
                    "DocumentName": name,
                    "DisplayName": "Back"
                };

                insItem.TempInsuranceImagesArray.push(obj);

                angular.element("input[type='file']").val(null);
            }
            var ScanDate = new Date();
            insItem.ScanDate = moment(ScanDate).format('MM-DD-YYYY');
        };
        $scope.removeInsImageBack = function (type, insItem) {
            var remove1 = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete the insurance image? </h4>", function () {
                var obj = "";
                var filterTins = [];
                if (type == 'back') {
                    if (insItem.PatientDocumentDetails.length > 0) {
                        $scope.Bfile = '';
                        var filterInsv = $filter("filter")(insItem.PatientDocumentDetails, function (Iitem, index) { return Iitem.IsBackSidefile == true }) || [];
                        if (filterInsv.length > 0) {


                            obj = {
                                "UserId": $scope.UserId,
                                "HospitalID": $scope.HospitalId,
                                "PatientInsuranceDetails": {
                                    "PatientInsuranceDetailId": insItem.PatientInsuranceDetailId,

                                    "PatientDocumentDetails": [
                                        {
                                            "DocumentId": filterInsv[0].DocumentId,
                                            "DocumentTypeId": filterInsv[0].DocumentTypeId,
                                            "DocumentName": filterInsv[0].DocumentName,
                                            "DocumentExt": filterInsv[0].DocumentExt,
                                            "S3URL": filterInsv[0].S3URL,
                                            "DeleteInd": "Y"
                                        }
                                    ]
                                }
                            }
                        } else {
                            var filterTins = $filter("filter")(insItem.TempInsuranceImagesArray, function (Titem, index) { return Titem.DisplayName == "Back" }) || [];
                            if (filterTins.length > 0) {
                                var index = insItem.TempInsuranceImagesArray.indexOf(filterTins[0]);
                                if (filterTins[0].DocumentId == 0) {
                                    insItem.TempInsuranceImagesArray.splice(index, 1);
                                    $scope.Bfile = '';
                                    $scope.backItemUpload = false;
                                    insItem.ScanDate = "";
                                    return false;
                                }
                            }
                        }
                    } else {

                        var filterTins = $filter("filter")(insItem.TempInsuranceImagesArray, function (Titem, index) { return Titem.DisplayName == "Back" }) || [];
                        if (filterTins.length > 0) {
                            var index = insItem.TempInsuranceImagesArray.indexOf(filterTins[0]);
                            if (filterTins[0].DocumentId == 0) {
                                insItem.TempInsuranceImagesArray.splice(index, 1);
                                $scope.Bfile = '';
                                $scope.backItemUpload = false;
                                insItem.ScanDate = "";
                                return false;
                            }
                        }
                    }
                }

                eHnotePatientDataService.DeletePatientInsuranceDetails(obj).then(function (resp) {

                    if (resp.data.Status == "Success") {
                        var index = insItem.PatientDocumentDetails.indexOf(filterInsv[0]);
                        if (filterInsv[0].DocumentId != 0) {
                            insItem.PatientDocumentDetails.splice(index, 1);
                            $scope.backS3Url = '';
                            $scope.backItemS3Url = false;
                            $scope.Bfile = '';
                            $scope.backItemUpload = false;
                            insItem.ScanDate = "";
                            return false;
                        }
                    }

                });
            }, function () {
                remove1 = "You pressed Cancel!";
            });
        }
        $scope.removeInsImageFront = function (type, insItem) {
            var remove = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete the insurance image? </h4>", function () {
                var obj = "";
                var filterTins = [];
                if (type == 'front') {
                    if (insItem.PatientDocumentDetails.length > 0) {
                        var filterInsv = $filter("filter")(insItem.PatientDocumentDetails, function (Iitem, index) { return Iitem.IsBackSidefile == false }) || [];
                        if (filterInsv.length > 0) {

                            obj = {
                                "UserId": $scope.UserId,
                                "HospitalID": $scope.HospitalId,
                                "PatientInsuranceDetails": {
                                    "PatientInsuranceDetailId": insItem.PatientInsuranceDetailId,

                                    "PatientDocumentDetails": [
                                        {
                                            "DocumentId": filterInsv[0].DocumentId,
                                            "DocumentTypeId": filterInsv[0].DocumentTypeId,
                                            "DocumentName": filterInsv[0].DocumentName,
                                            "DocumentExt": filterInsv[0].DocumentExt,
                                            "S3URL": filterInsv[0].S3URL,
                                            "DeleteInd": "Y"
                                        }
                                    ]
                                }
                            }


                        } else {
                            var filterTins = $filter("filter")(insItem.TempInsuranceImagesArray, function (Titem, index) { return Titem.DisplayName == "Front" }) || [];
                            if (filterTins.length > 0) {
                                var index = insItem.TempInsuranceImagesArray.indexOf(filterTins[0]);
                                if (filterTins[0].DocumentId == 0) {
                                    insItem.TempInsuranceImagesArray.splice(index, 1);
                                    $scope.Ffile = '';
                                    $scope.frontItemUpload = false;
                                    insItem.ScanDate = "";
                                    return false;
                                }
                            }
                        }
                    } else {
                        var filterTins = $filter("filter")(insItem.TempInsuranceImagesArray, function (Titem, index) { return Titem.DisplayName == "Front" }) || [];
                        if (filterTins.length > 0) {
                            var index = insItem.TempInsuranceImagesArray.indexOf(filterTins[0]);
                            if (filterTins[0].DocumentId == 0) {
                                insItem.TempInsuranceImagesArray.splice(index, 1);
                                $scope.Ffile = '';
                                $scope.frontItemUpload = false;
                                insItem.ScanDate = "";
                                return false;
                            }
                        }
                    }
                }

                eHnotePatientDataService.DeletePatientInsuranceDetails(obj).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        var index = insItem.PatientDocumentDetails.indexOf(filterInsv[0]);
                        if (filterInsv[0].DocumentId != 0) {
                            insItem.PatientDocumentDetails.splice(index, 1);
                            $scope.frontS3Url = '';
                            $scope.frontItemS3Url = false;
                            $scope.Ffile = '';
                            $scope.frontItemUpload = false;
                            insItem.ScanDate = "";
                            return false;
                        }
                    }
                });
            }, function () {
                remove = "You pressed Cancel!";
            });

        }
        $scope.scanInsImageDocuments = function (type, pos, insobj) {
            console.log(type);

            var obj = {
                "PatientId": $scope.PatientDetailsInfo.PatientID || null,
                "AppointmentId": null,
                "PatientName": $scope.PatientDetailsInfo.FullName || '',
                "Tab": "Insurance",
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "md",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty--  ",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (result) {
                console.log(result);
                if (result !== "") {
                    console.log(result);
                    if (type === "front") {
                        $scope.frontItemS3Url = true;
                        $scope.frontS3Url = result.S3URL;
                        result.IsBackSidefile = false;
                        result.DisplayName = "front";
                        result.DocumentId = 0;
                        result.PatientImageDocumentId = 0;
                        result.DocumentName = result.DocumentName || "FrontScan";
                        $scope.PatientInsuranceObj.PatientDocumentDetails.push(result);
                    }

                    if (type === "back") {
                        $scope.backItemS3Url = true;
                        $scope.backS3Url = result.S3URL;
                        result.IsBackSidefile = true;
                        result.DisplayName = "back";
                        result.DocumentId = 0;
                        result.PatientImageDocumentId = 0;
                        result.DocumentName = result.DocumentName || "BackScan";
                        $scope.PatientInsuranceObj.PatientDocumentDetails.push(result);
                    }
                }
            }, function (cancel) {
            });

        }
        function isSameInsurance(a, b) {
            return a.PayorId === b.PayorId &&
                a.PlanId === b.PlanId &&
                a.PolicyId === b.PolicyId &&
                a.StatusId === b.StatusId &&
                a.IdentifierId === b.IdentifierId &&
                (a.GroupId || '') === (b.GroupId || '') &&
                $filter('date')(a.EffectiveDate || '', 'yyyy-MM-dd') === $filter('date')(b.EffectiveDate || '', 'yyyy-MM-dd') &&
                $filter('date')(a.ExpiryDate || '', 'yyyy-MM-dd') === $filter('date')(b.ExpiryDate || '', 'yyyy-MM-dd') &&
                a.PatientDocumentDetails == b.PatientDocumentDetails;
        }

        function proceedWithDefaults(insurance) {
            insurance.StatusId = 1;
            insurance.InactiveActiveInsurance = false;
            insurance.ConnectCurrentInsuranceInd = true;
            insurance.ConnectInsuranceToAppointmentFrom = insurance.EffectiveDate
                ? insurance.EffectiveDate
                : $filter('date')(new Date(), "MM-dd-yyyy");
        }
        $scope.PatientInsuranceDetailsSave = function (type, EditMode) {
            
            console.log($scope.PatientInsuranceObj);
            console.log($scope.PatientInsuranceObj.PayorId + "__PayorId");
            var TempInsuarance = $scope.PatientInsuranceObj;
            TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;
            TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;
            TempInsuarance.MSPInsuranceTypeId = TempInsuarance.MSPInsuranceTypeId || null;
            TempInsuarance.PayorTypeId = TempInsuarance.PayorTypeId || null;
            TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            TempInsuarance.PlanId === TempInsuarance.PlanId || 0;
            TempInsuarance.PolicyId = TempInsuarance.PolicyId || "";
            TempInsuarance.GroupId = TempInsuarance.GroupId || "";
            TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || "";
            TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || "";
            TempInsuarance.Staff = TempInsuarance.Staff || "";
            TempInsuarance.AcceptAssign = TempInsuarance.AcceptAssign || "";
            TempInsuarance.AssignBenifits = TempInsuarance.AssignBenifits || "";
            TempInsuarance.Comments = TempInsuarance.Comments || "";
            //TempInsuarance.VerifiedBy = $scope.UserId || "";
            TempInsuarance.TempInsuranceImagesArray = TempInsuarance.TempInsuranceImagesArray || [];

            // documents upload 
            $scope.Ffile = $scope.Ffile || '';
            $scope.Bfile = $scope.Bfile || '';
            $scope.frontS3Url = $scope.frontS3Url || '';
            $scope.backS3Url = $scope.backS3Url || '';
            if (($scope.Ffile != '' || $scope.frontS3Url != '') && ($scope.Bfile != '' || $scope.backS3Url != '')) {

            } else if ($scope.Ffile == '' && $scope.frontS3Url == '' && $scope.Bfile == '' && $scope.backS3Url == '') {

            } else {
            }
            console.log(TempInsuarance);
            let scannedFilesArray = [];
            angular.forEach(TempInsuarance.PatientDocumentDetails, function (item) {
                item.DocumentId = item.DocumentId || 0;
                if (item.DocumentId !== 0 && $scope.PatientInsuranceObj.IsAddnewInsuranceInd) {
                    var object = {
                        "DocumentTypeId": 4,
                        "DocumentName": item.DocumentName,
                        "DocumentExt": item.DocumentExt,
                        "S3URL": item.S3URL,
                        "file": "",
                        "DeleteInd": "N",
                        "DocumentId": item.DocumentId,
                        "IsBackSidefile": item.IsBackSidefile
                    };
                    scannedFilesArray.push(object);
                } else {
                    if (item.DisplayName === "front" || item.DisplayName === "back") {
                        item.PatientImageDocumentId = item.PatientImageDocumentId || 0;
                        item.S3URL = item.S3URL || "";
                        if (item.PatientImageDocumentId === 0) {
                            var isfront = false;
                            if (item.DisplayName === "back") { isfront = true; };
                            var object = {
                                "DocumentTypeId": 4,
                                "DocumentName": item.DocumentName,
                                "DocumentExt": item.FileExt,
                                "S3URL": item.S3URL,
                                "file": item.file || "",
                                "DeleteInd": "N",
                                "DocumentId": item.PatientImageDocumentId,
                                "IsBackSidefile": isfront
                            };
                            scannedFilesArray.push(object);
                        }
                    }
                }
            });
            TempInsuarance.PatientDocumentDetails = [];
            TempInsuarance.PatientDocumentDetails = angular.copy(scannedFilesArray);
            TempInsuarance.DeleteInd = TempInsuarance.DeleteInd || false;
            angular.forEach(TempInsuarance.TempInsuranceImagesArray, function (item) {
                item.DocumentId = item.DocumentId || 0;
                item.S3URL = item.S3URL || "";
                if (item.DocumentId === 0) {

                    var isfront = false;
                    if (item.DisplayName === "Back") { isfront = true; };
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
                    TempInsuarance.PatientDocumentDetails.push(object);
                }
            });
            // documents uploading
            if ($scope.PatientInsuranceObj.IsAddnewInsuranceInd == true) {
                if (TempInsuarance.PolicyId == $scope.TempInsuranceObj.PolicyId && TempInsuarance.GroupId == $scope.TempInsuranceObj.GroupId && TempInsuarance.PlanId == $scope.TempInsuranceObj.PlanId && TempInsuarance.PayorId == $scope.TempInsuranceObj.PayorId) {
                    TempInsuarance.PatientInsuranceDetailId = TempInsuarance.PatientInsuranceDetailId;
                } else {
                    TempInsuarance.InsuranceDeactiveDetailId = TempInsuarance.PatientInsuranceDetailId;
                    TempInsuarance.IsConnectToFutureAppointment = false;
                    TempInsuarance.PatientInsuranceDetailId = 0;
                }
            }
            TempInsuarance.GroupId = TempInsuarance.GroupId || "";
            TempInsuarance.PolicyId = TempInsuarance.PolicyId || "";
            if (TempInsuarance.PayorId !== null || TempInsuarance.PlanId !== 0 || TempInsuarance.GroupId !== "" || TempInsuarance.PolicyId !== "") {
                TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;
                if (TempInsuarance.PatientFirstName == "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient First Name");
                    return false;
                }
                if (TempInsuarance.PatientLastName == "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Last Name");
                    return false;
                }
            }
            TempInsuarance.InsuredPersonFirstName = $scope.PatientInsuranceObj.InsuredPersonFirstName;
            TempInsuarance.InsuredPersonLastName = $scope.PatientInsuranceObj.InsuredPersonLastName;
            TempInsuarance.InsuredPersonGenderID = $scope.PatientInsuranceObj.InsuredPersonGenderID;
            TempInsuarance.InsuredPersonSSN = $scope.PatientInsuranceObj.InsuredPersonSSN;
            TempInsuarance.InsuredPersonDOB = $scope.PatientInsuranceObj.InsuredPersonDOB;
            TempInsuarance.InsuredPersonMiddleName = $scope.PatientInsuranceObj.InsuredPersonMiddleName;
            TempInsuarance.InsuredPersonSecondLastName = $scope.PatientInsuranceObj.InsuredPersonSecondLastName;
            TempInsuarance.InsuredPersonSuffix = $scope.PatientInsuranceObj.InsuredPersonSuffix;
            TempInsuarance.PolicyId = TempInsuarance.PolicyId || "";
            TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;

           
                  

            if ($scope.ShowInsuranceAddnew == false && ($scope.IsCoverageNoManadatory || $scope.IsPayornameNoManadatory || $scope.IsPlannameNoManadatory || $scope.IsPolicyIDNoManadatory || $scope.IsGroupIDNoManadatory)) {
                if ($scope.IsCoverageNoManadatory) {
                    if (TempInsuarance.IdentifierId === null) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Select the Coverage Name");
                        return false;
                    }
                }
                TempInsuarance.MSPInsuranceTypeId = TempInsuarance.MSPInsuranceTypeId || null;
                TempInsuarance.PayorTypeId = TempInsuarance.PayorTypeId || null;
                if (TempInsuarance.MSPInsuranceTypeId === null && TempInsuarance.IdentifierId === 2 && (TempInsuarance.PayorTypeId === 12 || TempInsuarance.PayorTypeId === 9 || TempInsuarance.PayorTypeId === 31)) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Select the Type Id");
                    return false;
                }

                TempInsuarance.PayorId = TempInsuarance.PayorId || null;
                if ($scope.IsPayornameNoManadatory) {
                    if (TempInsuarance.PayorId === null) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Select the Payor Name");
                        return false;
                    }
                }
                TempInsuarance.PlanId === TempInsuarance.PlanId || 0;
                if ($scope.IsPlannameNoManadatory) {
                    if (TempInsuarance.PlanId === 0) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Select the Plan");
                        return false;
                    }
                }

                TempInsuarance.PolicyId = TempInsuarance.PolicyId || null;
                if ($scope.IsPolicyIDNoManadatory) {
                    if (TempInsuarance.PolicyId === null) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Enter the Policy ID");
                        return false;
                    }
                }

                TempInsuarance.GroupId = TempInsuarance.GroupId || null;
                if ($scope.IsGroupIDNoManadatory) {
                    if (TempInsuarance.GroupId === null) {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Enter the Group ID");
                        return false;
                    }
                }
            } else {
                if ($scope.ShowInsuranceAddnew == true) {
                    return false;
                }

            }

            if (TempInsuarance.PatientInsuranceDetailId === 0 && TempInsuarance.CoverageId == null && TempInsuarance.PayorId == null && TempInsuarance.PlanId == 0 &&
                TempInsuarance.PolicyId == '' && TempInsuarance.GroupId == '' && TempInsuarance.ExpiryDate == '' && TempInsuarance.ExpiryDate == '' && TempInsuarance.Staff == '' &&
                TempInsuarance.Comments == '' && TempInsuarance.TempInsuranceImagesArray.length == 0) {
                //TempInsuarance.AcceptAssign == '' && TempInsuarance.AssignBenifits == '' &&
                if (type === "Final") {
                    $scope.Registeraddpopup = true;
                    $uibModalInstance.close('Rcopia');
                }
                return false;
            }



          
            //if ($scope.IsCoverageNoManadatory) {
            //    if (TempInsuarance.IdentifierId === null) {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please Select the Coverage Name");
            //        return false;
            //    }
            //}

            //TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            //if ($scope.IsPayornameNoManadatory) {
            //    if (TempInsuarance.PayorId === null) {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please Select the Payor Name");
            //        return false;
            //    }
            //}
            //TempInsuarance.PlanId === TempInsuarance.PlanId || 0;
            //if ($scope.IsPlannameNoManadatory) {
            //    if (TempInsuarance.PlanId === 0) {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please Select the Plan");
            //        return false;
            //    }
            //}

            //TempInsuarance.PolicyId = TempInsuarance.PolicyId || null;
            //if ($scope.IsPolicyIDNoManadatory) {
            //    if (TempInsuarance.PolicyId === null) {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please Enter the Policy ID");
            //        return false;
            //    }
            //}

            //TempInsuarance.GroupId = TempInsuarance.GroupId || null;
            //if ($scope.IsGroupIDNoManadatory) {
            //    if (TempInsuarance.GroupId === null) {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please Enter the Group ID");
            //        return false;
            //    }
            //}


            //TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || "";
            //if ($scope.IsEffectivedateNoManadatory) {
            //    if (TempInsuarance.EffectiveDate === "") {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please  Select EffectiveDate");
            //        return false;
            //    }
            //}


            //TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || "";
            //if ($scope.IsExpirydateNoManadatory) {
            //    if (TempInsuarance.ExpiryDate === "") {
            //        $scope.ValidateIndictor = false;
            //        alertify.error("Please Select ExpiryDate");
            //        return false;
            //    }
            //}

            var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");
            TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, "MM-dd-yyyy");
  
            if ($scope.PatientInsuranceSummary.length > 0) {
                var currentId = TempInsuarance.PatientInsuranceDetailId;
                var selectedIdentifierId = TempInsuarance.IdentifierId; // 1=Primary, 2=Secondary, 3=Other

                // Get all existing insurance records except the one being edited
                var existingInsurances = $scope.PatientInsuranceSummary.filter(function (item) {
                    return item.PatientInsuranceDetailId !== currentId;
                });

                // Count how many of each type exist (excluding the one being edited)
                var hasPrimary = existingInsurances.some(item => item.IdentifierId === 1);
                var hasSecondary = existingInsurances.some(item => item.IdentifierId === 2);

                // Get the existing record being edited
                var existingRecord = $scope.PatientInsuranceSummary.find(item => item.PatientInsuranceDetailId === currentId);

                // If existing record is Primary and user is trying to change it to Secondary or Other,
                // but no other Primary exists
                if (existingRecord && existingRecord.IdentifierId === 1 &&
                    (selectedIdentifierId === 2 || selectedIdentifierId === 3 || selectedIdentifierId === 4 || selectedIdentifierId === 5) &&
                    !hasPrimary) {
                    alertify.error("Primary insurance required. Add another before changing this one");
                    return false;
                }

                // If user is trying to assign 'Other' without Primary and Secondary
                if ((selectedIdentifierId === 3 || selectedIdentifierId === 4 || selectedIdentifierId === 5) && (!hasPrimary || !hasSecondary)) {
                    alertify.error("Primary and Secondary insurance required. Add another before changing this one");
                    return false;
                }
            }

            if ($scope.PatientInsuranceSummary.length === 0) {
                // No insurance added yet
                if (TempInsuarance.IdentifierId != 1) {
                    alertify.error('You must add Primary Insurance first.');
                    return false;
                }
                var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                if (newRecordEffDate && currentdate < newRecordEffDate) {
                    TempInsuarance.StatusId = 1; // User confirmed
                    TempInsuarance.InactiveActiveInsurance = false;
                    TempInsuarance.ConnectCurrentInsuranceInd = true;
                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                }
                else {
                    TempInsuarance.StatusId = 1; // No existing primary, so proceed directly
                    TempInsuarance.InactiveActiveInsurance = false;
                    TempInsuarance.ConnectCurrentInsuranceInd = true;
                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                }
               
            }
            else {
                
                let PrimaryInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
                    return (resp.IdentifierId == 1 && resp.StatusId == 1 && resp.DeleteInd == 'N' || resp.DeleteInd == false);
                });
                let secondaryInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
                    return (resp.IdentifierId == 2 && resp.StatusId == 1 && resp.DeleteInd == 'N' || resp.DeleteInd == false);
                });
                let OtherInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
                    return (resp.IdentifierId == 3 && resp.StatusId == 1 && resp.DeleteInd == 'N' || resp.DeleteInd == false);
                });
                //if (TempInsuarance.IdentifierId == 2 && PrimaryInsurance.length == 0) {
                //    alertify.error('Please add Primary Insurance before adding Secondary.');
                //    return false;
                //}
                //if (TempInsuarance.IdentifierId == 3) {
                //    if (PrimaryInsurance.length == 0) {
                //        alertify.error('Please add Primary Insurance before adding Tertiary.');
                //        return false;
                //    }
                //    if (secondaryInsurance.length == 0) {
                //        alertify.error('Please add Secondary Insurance before adding Tertiary.');
                //        return false;
                //    }
                //}
                if (PrimaryInsurance.length > 0 && TempInsuarance.IdentifierId == 1)
                {
                    
                    var existing = PrimaryInsurance[0];
                    if (isSameInsurance(existing, TempInsuarance)) {
                        if (type === "Final") {
                            $uibModalInstance.close('Rcopia');
                        }
                        return;
                    }
                   var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                    if (newRecordEffDate && currentdate < newRecordEffDate && TempInsuarance.PatientInsuranceDetailId == 0) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>The Effective Date is in the future. Do you want to add it as active? Click Yes to confirm.</h4>",
                            function () {
                                TempInsuarance.StatusId = 1; // User confirmed
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                $scope.$apply();
                            },
                            function () {

                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5; // User cancelled
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);


                                $scope.$apply();
                            }
                        );
                    }
                   
                    else if (TempInsuarance.PatientInsuranceDetailId !== 0)
                    {
                        var existing = PrimaryInsurance[0];
                        var existingStatusId = existing.StatusId;
                        var newStatusId = TempInsuarance.StatusId;

                        // Case 4: Re-activating an inactive insurance while another one is already active
                        if (
                            existingStatusId === 1 &&
                            newStatusId === 1 &&
                            (
                                TempInsuarance.PatientInsuranceDetailId === 0 ||
                                (existing.PatientInsuranceDetailId !== TempInsuarance.PatientInsuranceDetailId && existing.StatusId === 1)
                            )
                        ) {                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active primary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                                function () {
                                    TempInsuarance.StatusId = 1;
                                    TempInsuarance.InactiveActiveInsurance = true;
                                    TempInsuarance.ConnectCurrentInsuranceInd = true;
                                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                        ? TempInsuarance.EffectiveDate
                                        : $filter('date')(new Date(), "MM-dd-yyyy");
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    TempInsuarance.InactiveActiveInsurance = false;
                                    TempInsuarance.ConnectCurrentInsuranceInd = false;
                                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                        ? TempInsuarance.EffectiveDate
                                        : $filter('date')(new Date(), "MM-dd-yyyy");
                                    TempInsuarance.StatusId = 5;
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                }
                            );
                        }

                        // Case 1 & 2: Updating fields or changing status
                        else if (!isSameInsurance(existing, TempInsuarance) || existingStatusId !== newStatusId) {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                                function () {
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    $uibModalInstance.close('Rcopia');
                                    $scope.$apply();
                                }
                            );
                        }
                        
                        // Case 0: No changes at all
                        else {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                                function () {
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    $uibModalInstance.close('Rcopia');
                                    $scope.$apply();
                                }
                            );
                            return;
                        }
                    }


                    else
                    {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active primary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                            function () {
                                
                                TempInsuarance.StatusId = 1; // User confirmed
                                TempInsuarance.InactiveActiveInsurance = true;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                $scope.$apply();
                            },
                            function () {
                                
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                    TempInsuarance.StatusId = 5; // User cancelled
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);

                                $scope.$apply();
                            }
                        );
                  }
                   
                }
               else if (secondaryInsurance.length > 0 && TempInsuarance.IdentifierId == 2) {
                    
                    var existing = secondaryInsurance[0];
                    if (isSameInsurance(existing, TempInsuarance)) {
                        if (type === "Final") {
                            $uibModalInstance.close('Rcopia');
                        }
                        return;
                    }
                    var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                    if (newRecordEffDate && currentdate < newRecordEffDate && TempInsuarance.PatientInsuranceDetailId == 0) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>The Effective Date is in the future. Do you want to add it as active? Click Yes to confirm.</h4>",
                            function () {
                                TempInsuarance.StatusId = 1; // User confirmed
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                $scope.$apply();
                            },
                            function () {

                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5; // User cancelled
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);


                                $scope.$apply();
                            }
                        );
                    }

                    else if (TempInsuarance.PatientInsuranceDetailId !== 0) {
                        var existing = secondaryInsurance[0];
                        var existingStatusId = existing.StatusId;
                        var newStatusId = TempInsuarance.StatusId;

                        // Case 4: Re-activating an inactive insurance while another one is already active
                        if (
                            existingStatusId === 1 &&
                            newStatusId === 1 &&
                            (
                                TempInsuarance.PatientInsuranceDetailId === 0 ||
                                (existing.PatientInsuranceDetailId !== TempInsuarance.PatientInsuranceDetailId && existing.StatusId === 1)
                            )
                        ) {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active secondry insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                                function () {
                                    TempInsuarance.StatusId = 1;
                                    TempInsuarance.InactiveActiveInsurance = true;
                                    TempInsuarance.ConnectCurrentInsuranceInd = true;
                                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                        ? TempInsuarance.EffectiveDate
                                        : $filter('date')(new Date(), "MM-dd-yyyy");
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    TempInsuarance.InactiveActiveInsurance = false;
                                    TempInsuarance.ConnectCurrentInsuranceInd = false;
                                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                        ? TempInsuarance.EffectiveDate
                                        : $filter('date')(new Date(), "MM-dd-yyyy");
                                    TempInsuarance.StatusId = 5;
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                }
                            );
                        }

                        // Case 1 & 2: Updating fields or changing status
                        else if (!isSameInsurance(existing, TempInsuarance) || existingStatusId !== newStatusId) {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                                function () {
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    $uibModalInstance.close('Rcopia');
                                    $scope.$apply();
                                }
                            );
                        }

                        // Case 0: No changes at all
                        else {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                                function () {
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    $uibModalInstance.close('Rcopia');
                                    $scope.$apply();
                                }
                            );
                            return;
                        }
                    }


                    else {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active secondary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                            function () {

                                TempInsuarance.StatusId = 1; // User confirmed
                                TempInsuarance.InactiveActiveInsurance = true;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                $scope.$apply();
                            },
                            function () {

                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5; // User cancelled
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);

                                $scope.$apply();
                            }
                        );
                    }

                }
                else if (OtherInsurance.length > 0 && TempInsuarance.IdentifierId == 3) {
                    
                    var existing = OtherInsurance[0];
                    if (isSameInsurance(existing, TempInsuarance)) {
                        if (type === "Final") {
                            $uibModalInstance.close('Rcopia');
                        }
                        return;
                    }
                    var newRecordEffDate = TempInsuarance.EffectiveDate != null && TempInsuarance.EffectiveDate != "" ? TempInsuarance.EffectiveDate : null;
                    if (newRecordEffDate && currentdate < newRecordEffDate && TempInsuarance.PatientInsuranceDetailId == 0) {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>The Effective Date is in the future. Do you want to add it as active? Click Yes to confirm.</h4>",
                            function () {
                                TempInsuarance.StatusId = 1; // User confirmed
                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                $scope.$apply();
                            },
                            function () {

                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5; // User cancelled
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);


                                $scope.$apply();
                            }
                        );
                    }

                    else if (TempInsuarance.PatientInsuranceDetailId !== 0) {
                        var existing = OtherInsurance[0];
                        var existingStatusId = existing.StatusId;
                        var newStatusId = TempInsuarance.StatusId;

                        // Case 4: Re-activating an inactive insurance while another one is already active
                        if (
                            existingStatusId === 1 &&
                            newStatusId === 1 &&
                            (
                                TempInsuarance.PatientInsuranceDetailId === 0 ||
                                (existing.PatientInsuranceDetailId !== TempInsuarance.PatientInsuranceDetailId && existing.StatusId === 1)
                            )
                        ) {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active tertiary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                                function () {
                                    TempInsuarance.StatusId = 1;
                                    TempInsuarance.InactiveActiveInsurance = true;
                                    TempInsuarance.ConnectCurrentInsuranceInd = true;
                                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                        ? TempInsuarance.EffectiveDate
                                        : $filter('date')(new Date(), "MM-dd-yyyy");
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    TempInsuarance.InactiveActiveInsurance = false;
                                    TempInsuarance.ConnectCurrentInsuranceInd = false;
                                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null
                                        ? TempInsuarance.EffectiveDate
                                        : $filter('date')(new Date(), "MM-dd-yyyy");
                                    TempInsuarance.StatusId = 5;
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                }
                            );
                        }

                        // Case 1 & 2: Updating fields or changing status
                        else if (!isSameInsurance(existing, TempInsuarance) || existingStatusId !== newStatusId) {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                                function () {
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    $uibModalInstance.close('Rcopia');
                                    $scope.$apply();
                                }
                            );
                        }

                        // Case 0: No changes at all
                        else {
                            alertify.confirm(
                                "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to update the patient insurance?</h4>",
                                function () {
                                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                    $scope.$apply();
                                },
                                function () {
                                    $uibModalInstance.close('Rcopia');
                                    $scope.$apply();
                                }
                            );
                            return;
                        }
                    }


                    else {
                        alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient already has an active tertiary insurance. Do you want to add the current insurance as active and deactivate the previous one?</h4>",
                            function () {

                                TempInsuarance.StatusId = 1; // User confirmed
                                TempInsuarance.InactiveActiveInsurance = true;
                                TempInsuarance.ConnectCurrentInsuranceInd = true;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);
                                $scope.$apply();
                            },
                            function () {

                                TempInsuarance.InactiveActiveInsurance = false;
                                TempInsuarance.ConnectCurrentInsuranceInd = false;
                                TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                                TempInsuarance.StatusId = 5; // User cancelled
                                proceedToSaveInsurance(TempInsuarance, type, EditMode);

                                $scope.$apply();
                            }
                        );
                    }

                }
                else {
                    TempInsuarance.StatusId = 1;
                    TempInsuarance.InactiveActiveInsurance = false;
                    TempInsuarance.ConnectCurrentInsuranceInd = true;
                    TempInsuarance.ConnectInsuranceToAppointmentFrom = TempInsuarance.EffectiveDate != null ? TempInsuarance.EffectiveDate : $filter('date')(new Date(), "MM-dd-yyyy");
                    proceedToSaveInsurance(TempInsuarance, type, EditMode);
                }
                
            } 

           
        };
        function proceedToSaveInsurance(TempInsuarance, type, EditMode) {
           
            // TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || null;
            //if (TempInsuarance.EffectiveDate === null) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Select Patient Effective Date");
            //    return false;
            //}
            //TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || null;
            //if (TempInsuarance.ExpiryDate === null) {
            //    $scope.ValidateIndictor = true;
            //    alertify.error("Please Select Patient Expire Date");
            //    return false;
            //}
            //for making insurance as patinet level  --1616
           

            //if ($scope.PatientInsuranceSummary.length > 0) {
            //    // primary
            //    let PrimaryInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
            //        return (resp.IdentifierId == 1 && resp.StatusId == 1);
            //    });
            //    if (PrimaryInsurance.length > 0 && TempInsuarance.IdentifierId == 1 && TempInsuarance.PatientInsuranceDetailId == 0) {
            //        var expiryDate = new Date(PrimaryInsurance[0].ExpiryDate);
            //        var effectiveDate = new Date(PrimaryInsurance[0].EffectiveDate);
            //        var newRecordDate = new Date(TempInsuarance.EffectiveDate);
            //        if (newRecordDate < expiryDate) {
            //            alertify.error('This Patient is already have Primary insurance between those dates');
            //            return false;
            //        }
            //    }
            //    // Secondary
            //    let secondaryInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
            //        return (resp.IdentifierId == 2 && resp.StatusId == 1);
            //    });
            //    if (PrimaryInsurance.length == 0) {
            //        alertify.error('This Patient is dont have the primary insurace please add .');
            //        return false;
            //    }
            //    if (secondaryInsurance.length > 0 && TempInsuarance.IdentifierId == 2 && TempInsuarance.PatientInsuranceDetailId == 0) {
            //        var expiryDate = new Date(secondaryInsurance[0].ExpiryDate);
            //        var effectiveDate = new Date(secondaryInsurance[0].EffectiveDate);
            //        var newRecordDate = new Date(TempInsuarance.EffectiveDate);
            //        if (newRecordDate < expiryDate) {
            //            alertify.error('This Patient is already have Primary insurance between those dates');
            //            return false;
            //        }
            //    }
            //    // other
            //    let OtherInsurance = $filter('filter')($scope.PatientInsuranceSummary, function (resp) {
            //        return (resp.IdentifierId == 2 && resp.StatusId == 5);
            //    });
            //    if (secondaryInsurance.length == 0 && PrimaryInsurance.length == 0 && TempInsuarance.PatientInsuranceDetailId == 0) {
            //        alertify.error('This Patient is dont have the secondary insurace please add .');
            //        return false;
            //    }
            //    if (OtherInsurance.length > 0 && TempInsuarance.IdentifierId == 5) {
            //        alertify.error('This Patient is already have other insurance');
            //        return false;
            //    }
            //};

            //$scope.Ffile = $scope.Ffile || '';
            //$scope.Bfile = $scope.Bfile || '';
            //$scope.frontS3Url = $scope.frontS3Url || '';
            //$scope.backS3Url = $scope.backS3Url || '';
            //if (($scope.Ffile != '' || $scope.frontS3Url != '') && ($scope.Bfile != '' || $scope.backS3Url != '')) {

            //} else if ($scope.Ffile == '' && $scope.frontS3Url == '' && $scope.Bfile == '' && $scope.backS3Url == '') {

            //} else {
            //}
            //console.log(TempInsuarance);
            //let scannedFilesArray = [];
            //angular.forEach(TempInsuarance.PatientDocumentDetails, function (item) {
            //    item.DocumentId = item.DocumentId || 0;
            //    if (item.DocumentId !== 0 && $scope.PatientInsuranceObj.IsAddnewInsuranceInd) {
            //        var object = {
            //            "DocumentTypeId": 4,
            //            "DocumentName": item.DocumentName,
            //            "DocumentExt": item.DocumentExt,
            //            "S3URL": item.S3URL,
            //            "file": "",
            //            "DeleteInd": "N",
            //            "DocumentId": item.DocumentId,
            //            "IsBackSidefile": item.IsBackSidefile
            //        };
            //        scannedFilesArray.push(object);
            //    } else {
            //        if (item.DisplayName === "front" || item.DisplayName === "back") {
            //            item.PatientImageDocumentId = item.PatientImageDocumentId || 0;
            //            item.S3URL = item.S3URL || "";
            //            if (item.PatientImageDocumentId === 0) {
            //                var isfront = false;
            //                if (item.DisplayName === "back") { isfront = true; };
            //                var object = {
            //                    "DocumentTypeId": 4,
            //                    "DocumentName": item.DocumentName,
            //                    "DocumentExt": item.FileExt,
            //                    "S3URL": item.S3URL,
            //                    "file": item.file || "",
            //                    "DeleteInd": "N",
            //                    "DocumentId": item.PatientImageDocumentId,
            //                    "IsBackSidefile": isfront
            //                };
            //                scannedFilesArray.push(object);
            //            }
            //        }
            //    }
            //});
            //TempInsuarance.PatientDocumentDetails = [];
            //TempInsuarance.PatientDocumentDetails = angular.copy(scannedFilesArray);
            //TempInsuarance.DeleteInd = TempInsuarance.DeleteInd || false;
            //angular.forEach(TempInsuarance.TempInsuranceImagesArray, function (item) {
            //    item.DocumentId = item.DocumentId || 0;
            //    item.S3URL = item.S3URL || "";
            //    if (item.DocumentId === 0) {

            //        var isfront = false;
            //        if (item.DisplayName === "Back") { isfront = true; };
            //        var object = {
            //            "DocumentTypeId": 4,
            //            "DocumentName": item.DocumentName,
            //            "DocumentExt": item.DocumentExt,
            //            "S3URL": item.S3URL,
            //            "file": item.file,
            //            "DeleteInd": item.DeleteInd,
            //            "DocumentId": item.DocumentId,
            //            "IsBackSidefile": isfront
            //        };
            //        TempInsuarance.PatientDocumentDetails.push(object);
            //    }
            //});
            if (TempInsuarance.ExpiryDate != "") {
                TempInsuarance.ExpiryDate = $filter('date')(TempInsuarance.ExpiryDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.EffectiveDate != "") {
                TempInsuarance.EffectiveDate = $filter('date')(TempInsuarance.EffectiveDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.ScanDate != "") {
                TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.VerifiedDate != "") {
                TempInsuarance.VerifiedDate = $filter('date')(TempInsuarance.VerifiedDate, 'yyyy-MM-dd');
            }
            if (TempInsuarance.InsuredPersonDOB != "") {
                TempInsuarance.InsuredPersonDOB = $filter('date')(TempInsuarance.InsuredPersonDOB, 'yyyy-MM-dd');
            }

            var param = {
                "PatientId": $scope.patientid,
                "FullName": $scope.PatientFullName,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                // "IsConnectToFutureAppointment": $scope.PatientInsuranceObj.IsConnectToFutureAppointment || false,
                "IsConnectToFutureAppointment": TempInsuarance.IsConnectToFutureAppointment || false,
                "PatientInsuranceDetails": []
            }
            param.PatientInsuranceDetails.push(TempInsuarance);


            console.log(JSON.stringify(TempInsuarance.PatientDocumentDetails))
          
            eHnotePatientDataService.SavePatientInsuranceDetailsById(param, OnAddPatientSuccess, OnAddPatientError);
            function OnAddPatientSuccess(resp) {
                if (resp.Status === "Success") {
                    
                    console.log(type + "_type");
                    $scope.IsShowEligibiltySave = false;
                    if (resp.PatientInsuranceDetails.length > 0) {
                        $scope.PatientInsuranceSummary = resp.PatientInsuranceDetails;
                        $scope.PatientInsuranceSummary = $scope.PatientInsuranceSummary.map(item => ({
                            ...item,
                            IsShowEligibiltySave: false
                        }));
                    }
                    $scope.Registeraddpopup = true;
                    if (type === "Final") {
                        $uibModalInstance.close('Rcopia');
                    }
                    alertify.success("Saved Successfully");
                    $scope.PatientInsuranceObj = GetInsuranceObj();
                    if (resp.PatientInsuranceDetails.length > 0) {
                        $scope.PatientInsuranceObj.PatientFirstName = resp.PatientInsuranceDetails[0].PatientFirstName || '';
                        $scope.PatientInsuranceObj.PatientLastName = resp.PatientInsuranceDetails[0].PatientLastName || '';
                        $scope.PatientInsuranceObj.PatientDOB = resp.PatientInsuranceDetails[0].PatientDOB;
                        $scope.PatientInsuranceObj.PatientSSN = resp.PatientInsuranceDetails[0].PatientSSN || '';
                        $scope.PatientInsuranceObj.PatientSecondLastName = resp.PatientInsuranceDetails[0].PatientSecondLastName || '';
                        $scope.PatientInsuranceObj.PatientMiddleName = resp.PatientInsuranceDetails[0].PatientMiddleName || '';
                        $scope.PatientInsuranceObj.PatientSuffix = resp.PatientInsuranceDetails[0].PatientSuffix || '';
                        $scope.PatientInsuranceObj.RelationName = "Self";
                        $scope.PatientInsuranceObj.RelationShipId = 1;
                        $scope.PatientInsuranceObj.IsIdentifier = false;
                    }
                }
            }
            function OnAddPatientError() {
                alertify.error("Creating  Failed");
            }
        }
        $scope.ChangeInsurancePayor = function (obj, mainitem, GetMode) {
            $scope.PatientInsuranceObj.PayorId = obj.PayorId;
            $scope.PatientInsuranceObj.PayorName = obj.PayorName;
            $scope.PatientInsuranceObj.PayorCode = obj.PayorCode;
            $scope.PatientInsuranceObj.PayorTypeId = obj.PayorTypeId;
            $scope.PatientInsuranceObj.OrganizationPayorId = obj.OrganizationPayorId;
            $scope.PatientInsuranceObj.PlanObj = "";
            $scope.PatientInsuranceObj.PlanId = 0;
            $scope.PatientInsuranceObj.PlanTypeId = 0;
            if ($scope.PatientInsuranceObj.IsInsuranceConnectedAppointment) {
                $scope.PatientInsuranceObj.IsAddnewInsurancePlanInd = true;
            }

            if (obj.OrganizationPayorName !== "") {
                $scope.PatientInsuranceObj.IsCoverageEnabled = true;
                $scope.PatientInsuranceObj.IsPolicyIdEnabled = true;
                $scope.PatientInsuranceObj.IsGroupIdEnabled = true;
            }
            $scope.PatientInsuranceObj.MSPInsuranceTypeId = 0;
        }

        $scope.ChangePayorPlan = function (payorname, item) {
            item = item || null;
            payorname = payorname || '';

            if (payorname == '') {
                item.OrganizationPayorId = 0;

                $scope.PatientInsuranceObj.IsPlanEnabled = true;
                $scope.PatientInsuranceObj.IsCoverageEnabled = false;
                $scope.PatientInsuranceObj.IsPolicyIdEnabled = false;
                $scope.PatientInsuranceObj.IsGroupIdEnabled = false;

                $scope.PatientInsuranceObj.PlanObj = "";
                $scope.PatientInsuranceObj.GroupId = "";
                $scope.PatientInsuranceObj.PolicyId = "";
                $scope.PatientInsuranceObj.PayorId = 0;
                $scope.PatientInsuranceObj.PlanId = 0;
                $scope.PatientInsuranceObj.CoverageId = 0;
                $scope.PatientInsuranceObj.PayorName = "";
                $scope.PatientInsuranceObj.PlanTypeId = 0;
                $scope.PatientInsuranceObj.MSPInsuranceTypeId = 0;

            } else {
                $scope.PatientInsuranceObj.IsCoverageEnabled = true;
                $scope.PatientInsuranceObj.IsPolicyIdEnabled = true;
                $scope.PatientInsuranceObj.IsGroupIdEnabled = true;
            }
        }

        $scope.ChangePlan = function (item) {
            item = item || "";
            if (item == "") {
                $scope.PatientInsuranceObj.PolicyId = "";
                $scope.PatientInsuranceObj.GroupId = "";
            }
            $scope.PatientInsuranceObj.CoverageId = 0;
            $scope.PatientInsuranceObj.PlanId = 0;
            $scope.PatientInsuranceObj.PlanTypeId = 0;
        };


        $scope.GetOrganizationNewPayorAllList = function (val) {
            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.onSelectPayorPlan = function (mainitem) {
            if (mainitem.PlanObj == null || mainitem.PlanObj == "") {
                mainitem.PlanId = 0;
                return false;
            }
            mainitem.PlanId = mainitem.PlanObj.PlanId;
            mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
            mainitem.CoverageId = mainitem.PlanObj.PayorTypeId;
        }
        $scope.GetOrganizationPayorPlansList = function (obj, mainitem) {
            mainitem.PayorId = mainitem.PayorId || 0;
            mainitem.payorPlansListArray = [];
            var param = {
                "OrganizationId": $scope.HospitalId,
                "SearchText": obj || "",
                "PageSize": 10,
                "PageNumber": 1,
                "GetAllIndicator": 0,
                // "PayorId": $scope.payorPlansListObj.PayorId || 0,
                "OrganizationPayorId": mainitem.OrganizationPayorId,
                "Status": 1,  // All - 0, Active - 1, InActive -2
                "ParentOrganizationId": $scope.ParenthospitalId,
            };
            return eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (response) {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        }
        $scope.AddReNewInsurance = function (item) {
            $scope.TempInsuranceObj.GroupId = item.GroupId;
            $scope.TempInsuranceObj.PolicyId = item.PolicyId;
            $scope.TempInsuranceObj.PayorId = item.PayorId;
            $scope.TempInsuranceObj.PlanId = item.PlanId;
            $scope.PatientInsuranceObj.IsAddnewInsuranceInd = true;
        }
 
        $scope.ChangeInsuranceRelationShipItem = function (item) {
            if (item.RelationShipId === 1 && !item.PatientInsuranceDetailId) {
                item.InsuredPersonFirstName = $scope.PatientInsuranceObj.PatientFirstName;
                item.InsuredPersonGenderID = $scope.PatientDetailsInfo.Gender == "Male" ? 'M' : 'F';
                item.InsuredPersonDOB = $scope.PatientDetailsInfo.DOB;
                item.InsuredPersonSSN = $scope.PatientDetailsInfo.SocialSecurityNo;
                item.InsuredPersonLastName = $scope.PatientInsuranceObj.PatientLastName;
                item.PatientSecondLastName = $scope.PatientInsuranceObj.PatientSecondLastName;
                item.PatientSuffix = $scope.PatientInsuranceObj.PatientSuffix;
                item.InsuredPersonMiddleName = $scope.PatientInsuranceObj.PatientMiddleName;
                item.InsuredPersonSecondLastName = $scope.PatientInsuranceObj.PatientSecondLastName;
            } else if (item.RelationShipId === 1 && item.PatientInsuranceDetailId){
                var tempInslist = $filter("filter")($scope.PatientInsuranceSummary, { "PatientInsuranceDetailId": item.PatientInsuranceDetailId }, true) || [];
                if (tempInslist.length > 0) {
                   item.InsuredPersonFirstName = tempInslist[0].InsuredPersonFirstName;
                   item.InsuredPersonMiddleName = tempInslist[0].InsuredPersonMiddleName;
                   item.InsuredPersonLastName = tempInslist[0].InsuredPersonLastName;
                   item.InsuredPersonSecondLastName = tempInslist[0].InsuredPersonSecondLastName;
                   item.InsuredPersonSuffix = tempInslist[0].InsuredPersonSuffix;
                    item.InsuredPersonDOB = $filter('date')(tempInslist[0].InsuredPersonDOB, 'MM-dd-yyyy')
                   item.InsuredPersonSSN = tempInslist[0].InsuredPersonSSN;
                   
                    item.InsuredPersonGenderID = tempInslist[0].InsuredPersonGenderID||'';
                }
            } else {
                item.InsuredPersonFirstName = "";
                item.InsuredPersonGenderID = "";
                item.InsuredPersonDOB = "";
                item.InsuredPersonSSN = "";
                item.InsuredPersonLastName = "";
                item.InsuredPersonMiddleName = "";
                item.InsuredPersonSecondLastName = "";
            }
        }
        $scope.AddPlanPopup = function () {
            $scope.PopUpOnPlan = $uibModal.open({
                "templateUrl": "addNewPlan.html",
                "scope": $scope,    
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "modal__ninety--",
                "resolve": {
                    "AllUserBranchesList": function () { return $scope.AllUserBranchesList; },
                },
                "controller": function ($scope, $uibModal, eHnoteInsuranceService, AllUserBranchesList) {
                    $scope.AllUserBranchesList = AllUserBranchesList || [];
                    $scope.AddPlanclosePopUp = function () {
                        $scope.PopUpOnPlan.dismiss('cancel');
                    }
                    $scope.GetOrganizationNewPayorAllList = function (val) {

                        var param = {
                            "SearchText": val || "",
                            "Status": "Active",
                            "PageSize": 10,
                            "PageNumber": 1,
                            "UserId": $scope.UserId,
                            "SpecializationId": $scope.SpecializationId,
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                            "GetAllIndicator": 0,
                            "PayorId": 0,
                            "PayorTypeId": 0
                        };
                        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                            if (resp.data.count !== 0) {
                                if (resp.data.rows !== undefined) {
                                    return resp.data.rows.map(function (item) {
                                        return item;
                                    });
                                }
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                    $scope.onSelectOrganizationPayor = function (planobj, mainplanobj) {
                        if (planobj != undefined) {
                            mainplanobj.PayorId = planobj.PayorId;
                            mainplanobj.OrganizationPayorId = planobj.OrganizationPayorId;
                            mainplanobj.OrganizationPayorName = planobj.OrganizationPayorName;
                        }
                    };
                    $scope.ClearInsuranceNew = function () {
                        $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();

                    };

                    $scope.GetPlanDetailsObjectNew = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                                "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                                "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "OrganizationPlanId": 0,
                            "OrganizationPayorId": 0,
                            "PayorId": 0,
                            "PlanId": 0,
                            "PlanName": "",
                            "PlanCode": "",
                            "PlanDescription": "",
                            "ReformaReferralRequired": false,
                            "IsFixedCopay": false,
                            "FixedCopayAmount": "",
                            "IsAnnualDeduction": false,
                            "AnnualDeductionAmount": "",
                            "WaitingPeriodApply": false,
                            "WaitingPeriodDays": "",
                            "IsCoverWithMedicaidFunds": false,
                            "MedicareComplementary": false,
                            "CoverComplementaryAnnualDeduction": false,
                            "CopaymentByProcedureGroup": false,
                            "CopaymentAmountByProcedureGroup": "",
                            "ShowNotesAsAlerts": false,
                            "Remarks": "",
                            "ProcedureGroup": "",
                            "GeneralCostValue": "",
                            "GeneralValueType": "A",
                            "SpecialistCostvalue": "",
                            "SpecialistValueType": "A",
                            "SubSpecialistCostvalue": "",
                            "SubSpecialistValueType": "A",
                            "LabCostValue": "",
                            "LabValueType": "A",
                            "RxCostValue": "",
                            "RxValueType": "A",
                            "PdxCostValue": "",
                            "PdxValueType": "A",
                            "EmergencyCostValue": "",
                            "EmergencyValueType": "A",
                            "OtherCostValue": "",
                            "OtherValueType": "A",
                            "IOLCostValue": "",
                            "IOLValueType": "A",
                            "OpticalCostValue": "",
                            "OpticalValueType": "A",
                            "RefractionCostValue": "",
                            "RefractionValueType": "A",
                            "MedicalCostValue": "",
                            "MedicalValueType": "A",
                            "TejidCostValue": "",
                            "TejidValueType": "A",
                            "TP6CostValue": "",
                            "TP6ValueType": "A",
                            "TP7CostValue": "",
                            "TP7ValueType": "A",
                            "CQMCostValue": "",
                            "CQMValueType": "A",
                            "IsActive": true,
                            "DeleteInd": "N",
                            "PayorObj": "",
                            "PlanTypeId": 0,
                            "Procedures": "",
                            "ParentOrganizationId": $scope.ParenthospitalId,
                        }
                        return obj;
                    };
                    $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();

                    $scope.AddUpdateOrganizationPlans = function () {

                        if ($scope.PlanDetailsObjectNew.OrganizationPayorId == 0) {
                            alertify.error("Please Select Payor");
                            return false;
                        }
                        if ($scope.PlanDetailsObjectNew.PlanTypeId == 0) {
                            alertify.error("Please Select Plan Type");
                            return false;
                        }
                        if ($scope.PlanDetailsObjectNew.PlanCode == "") {
                            alertify.error("Please Enter Plan Code");
                            return false;
                        }
                        if ($scope.PlanDetailsObjectNew.PlanName == "") {
                            alertify.error("Please Enter Plan Name");
                            return false;
                        }

                        eHnoteInsuranceService.AddUpdateOrganizationPayorPlan($scope.PlanDetailsObjectNew, callbackresponseforplan, callbackerrorforplan);
                        function callbackresponseforplan(resp) {
                            if (resp.status === "Success") {
                                if ($scope.PlanDetailsObjectNew.OrganizationPlanId == 0) {
                                    alertify.success('Plan Added Successfully');
                                } else {
                                    alertify.success('Plan Updated Successfully');
                                }
                                var l = resp;
                                $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();
                                $scope.GetOrganizationPayorPlanList(1);
                            }
                            if (resp.status === "Failure") {
                                alertify.error(resp.Message);
                            }
                        }
                        function callbackerrorforplan(err) {
                            alertify.error("Some Error Occured");
                        }
                    };

                    $scope.ChangeCopaymentofprocedure = function (type) {
                        if (type == "Gen") {
                            $scope.PlanDetailsObjectNew.GeneralCostValue = $scope.PlanDetailsObjectNew.GeneralCostValue || "";
                        } else if (type == "Spslt") {
                            $scope.PlanDetailsObjectNew.SpecialistCostvalue = $scope.PlanDetailsObjectNew.SpecialistCostvalue || "";
                        }
                        else if (type == "Sub") {
                            $scope.PlanDetailsObjectNew.SubSpecialistCostvalue = $scope.PlanDetailsObjectNew.SubSpecialistCostvalue || "";
                        }
                        else if (type == "Lab") {
                            $scope.PlanDetailsObjectNew.LabCostValue = $scope.PlanDetailsObjectNew.LabCostValue || "";
                        }
                        else if (type == "Rx") {
                            $scope.PlanDetailsObjectNew.RxCostValue = $scope.PlanDetailsObjectNew.RxCostValue || "";
                        }
                        else if (type == "P.Dx") {
                            $scope.PlanDetailsObjectNew.PdxCostValue = $scope.PlanDetailsObjectNew.PdxCostValue || "";
                        }
                        else if (type == "Emg") {
                            $scope.PlanDetailsObjectNew.EmergencyCostValue = $scope.PlanDetailsObjectNew.EmergencyCostValue || "";
                        }
                        else if (type == "Other") {
                            $scope.PlanDetailsObjectNew.OtherCostValue = $scope.PlanDetailsObjectNew.OtherCostValue || "";
                        }
                        else if (type == "IOl") {
                            $scope.PlanDetailsObjectNew.IOLCostValue = $scope.PlanDetailsObjectNew.IOLCostValue || "";
                        }
                        else if (type == "Optic") {
                            $scope.PlanDetailsObjectNew.OpticalCostValue = $scope.PlanDetailsObjectNew.OpticalCostValue || "";
                        }
                        else if (type == "Refra") {
                            $scope.PlanDetailsObjectNew.RefractionCostValue = $scope.PlanDetailsObjectNew.RefractionCostValue || "";
                        }
                        else if (type == "Medic") {
                            $scope.PlanDetailsObjectNew.MedicalCostValue = $scope.PlanDetailsObjectNew.MedicalCostValue || "";
                        }
                        else if (type == "Tejid") {
                            $scope.PlanDetailsObjectNew.TejidCostValue = $scope.PlanDetailsObjectNew.TejidCostValue || "";
                        }
                        else if (type == "TP-6") {
                            $scope.PlanDetailsObjectNew.TP6CostValue = $scope.PlanDetailsObjectNew.TP6CostValue || "";
                        }
                        else if (type == "TP-7") {
                            $scope.PlanDetailsObjectNew.TP7CostValue = $scope.PlanDetailsObjectNew.TP7CostValue || "";
                        }
                        else if (type == "CQM") {
                            $scope.PlanDetailsObjectNew.CQMCostValue = $scope.PlanDetailsObjectNew.CQMCostValue || "";
                        }
                    };
                }
            })
        };
        $scope.GetOrganizationPayorPlanList = function (page) {
            if (page == 1) {
                $scope.payorPlansListObj.PageNumber = 1;
            }
            var param = {
                "OrganizationId": $scope.payorPlansListObj.BranchObj.BranchId || 0,
                "SearchText": $scope.payorPlansListObj.SearchText || "",
                "PageSize": $scope.payorPlansListObj.PageSize || 10,
                "PageNumber": $scope.payorPlansListObj.PageNumber || 1,
                "GetAllIndicator": 0,
                "OrganizationPayorId": $scope.payorPlansListObj.OrganizationPayorId || 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "Status": 0
            };
            eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

                $scope.payorPlansListArray = [];
                if (resp.data.Status === "Success") {
                    $scope.payorPlansListArray = resp.data.rows || [];
                    $scope.payorPlansListObj.TotalCount = resp.data.count;
                    $scope.PopUpOnPlan.dismiss('cancel');
                }
            }, function (error) {
                console.log(error);
            });
        };

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
        $scope.GetMasterPayorPlanTypes();
        $scope.EditInsurace = function (InsuranceEditItem) {
            $scope.ShowInsuranceAddnew = false;
            $scope.ShowInsCopyBtn = false;
            $scope.PatientInsuranceObj = GetInsuranceObj();
            $scope.frontItemUpload = false;
            $scope.Ffile = null;
            $scope.Bfile = null;
            $scope.frontItemS3Url = false;
            $scope.backItemUpload = false;
            $scope.backItemS3Url = false;
            //$scope.PatientInsuranceObj.InsuredPersonFirstName = mainObject.PatientDetails.FirstName || '';
            //$scope.PatientInsuranceObj.InsuredPersonGenderID = mainObject.PatientDetails.Gender == "Male" ? 'M' : 'F';
            //$scope.PatientInsuranceObj.InsuredPersonDOB = mainObject.PatientDetails.DOB;
            //$scope.PatientInsuranceObj.InsuredPersonSSN = "";
            //$scope.PatientInsuranceObj.InsuredPersonMiddleName = mainObject.PatientDetails.MiddleName || '';
            $scope.PatientInsuranceObj.InsuredPersonLastName = mainObject.PatientDetails.LastName || '';
            $scope.PatientInsuranceObj.PatientFirstName = mainObject.PatientDetails.FirstName || '';
            $scope.PatientInsuranceObj.PatientLastName = mainObject.PatientDetails.LastName || '';
            $scope.PatientInsuranceObj.PatientMiddleName = mainObject.PatientDetails.MiddleName || '';
            $scope.PatientInsuranceObj.PatientSecondLastName = mainObject.PatientDetails.SecondLastName || '';
            $scope.PatientInsuranceObj.PatientSuffix = mainObject.PatientDetails.SuffixName || '';
            $scope.PatientInsuranceObj.PatientDOB = mainObject.PatientDetails.DOB;
            $scope.PatientInsuranceObj.PatientSSN = mainObject.PatientDetails.SocialSecurityNo;
            $scope.PatientInsuranceObj.IsIdentifier = false;
            if ($scope.PatientInsuranceSummary.length == 0) {
                $scope.ShowInsuranceAddnew = false;
            }
            if (Object.keys(InsuranceEditItem).length > 0) {
                $scope.ShowInsuranceAddnew = false;
                if (InsuranceEditItem.InsuredPersonGenderID == "Male" || InsuranceEditItem.InsuredPersonGenderID == "M") {
                    InsuranceEditItem.InsuredPersonGenderID = "M";
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = "M";
                }
                if (InsuranceEditItem.InsuredPersonGenderID == "Female" || InsuranceEditItem.InsuredPersonGenderID == "F") {
                    InsuranceEditItem.InsuredPersonGenderID = "F";
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = "F";
                }
                $scope.PatientInsuranceObj.IdentifierId = InsuranceEditItem.IdentifierId;
                $scope.PatientInsuranceObj.MSPInsuranceTypeId = InsuranceEditItem.MSPInsuranceTypeId;
                $scope.PatientInsuranceObj.PayorTypeId = InsuranceEditItem.PayorTypeId;
                $scope.PatientInsuranceObj.CoverageId = InsuranceEditItem.CoverageId;
                $scope.PatientInsuranceObj.CoverageName = InsuranceEditItem.CoverageName;
                $scope.PatientInsuranceObj.GroupId = InsuranceEditItem.GroupId || "";
                $scope.PatientInsuranceObj.GroupName = InsuranceEditItem.GroupName;
                $scope.PatientInsuranceObj.InsuranceRelationShipObj = InsuranceEditItem.InsuranceRelationShipObj;
                $scope.PatientInsuranceObj.InsuredPersonDOB = $filter('date')(InsuranceEditItem.InsuredPersonDOB, "MM-dd-yyyy");
                $scope.PatientInsuranceObj.InsuredPersonFirstName = InsuranceEditItem.InsuredPersonFirstName;
               // $scope.PatientInsuranceObj.InsuredPersonGenderID = InsuranceEditItem.InsuredPersonGenderID == "Male" ? 'M' : 'F';
                $scope.PatientInsuranceObj.InsuredPersonSSN = InsuranceEditItem.InsuredPersonSSN;
                $scope.PatientInsuranceObj.PatientInsuranceDetailId = InsuranceEditItem.PatientInsuranceDetailId;
                $scope.PatientInsuranceObj.PayorId = InsuranceEditItem.PayorId;
                $scope.PatientInsuranceObj.PayorName = InsuranceEditItem.PayorName;
                $scope.PatientInsuranceObj.PayorObj = InsuranceEditItem.OrganizationPayorName;
                $scope.PatientInsuranceObj.PlanId = InsuranceEditItem.PlanId;
                $scope.PatientInsuranceObj.PlanName = InsuranceEditItem.PlanName;
                $scope.PatientInsuranceObj.PlanObj = InsuranceEditItem.PlanName;
                $scope.PatientInsuranceObj.PlanTypeId = InsuranceEditItem.PlanTypeId;
                $scope.PatientInsuranceObj.PolicyHolder = InsuranceEditItem.PolicyHolder;
                $scope.PatientInsuranceObj.PolicyHolderName = InsuranceEditItem.PolicyHolderName;
                $scope.PatientInsuranceObj.PolicyId = InsuranceEditItem.PolicyId;
                $scope.PatientInsuranceObj.RelationName = InsuranceEditItem.RelationName;
                $scope.PatientInsuranceObj.RelationShipId = InsuranceEditItem.RelationShipId;
                $scope.PatientInsuranceObj.ReleaseInfo = InsuranceEditItem.ReleaseInfo;
                $scope.PatientInsuranceObj.StatusId = InsuranceEditItem.StatusId;
                $scope.PatientInsuranceObj.Staff = InsuranceEditItem.Staff;
                $scope.PatientInsuranceObj.AcceptAssign = InsuranceEditItem.AcceptAssign;
                $scope.PatientInsuranceObj.AssignBenifits = InsuranceEditItem.AssignBenifits;
                $scope.PatientInsuranceObj.Comments = InsuranceEditItem.Comments;
                $scope.PatientInsuranceObj.IsDefaultBillingIns = InsuranceEditItem.IsDefaultBillingIns;
                $scope.PatientInsuranceObj.PCP = InsuranceEditItem.PCP;
                $scope.PatientInsuranceObj.IPA = InsuranceEditItem.IPA;
                $scope.PatientInsuranceObj.OrganizationPayorId = InsuranceEditItem.OrganizationPayorId;
                $scope.PatientInsuranceObj.OrganizationPayorName = InsuranceEditItem.OrganizationPayorName;
                $scope.PatientInsuranceObj.IsVerified = InsuranceEditItem.IsVerified || false;
                $scope.PatientInsuranceObj.EligibilityStatusId = InsuranceEditItem.EligibilityStatusId || 0;
                $scope.PatientInsuranceObj.AppointmentInsuranceDetailId = InsuranceEditItem.AppointmentInsuranceDetailId || 0;
                $scope.PatientInsuranceObj.InsuredPersonMiddleName = InsuranceEditItem.InsuredPersonMiddleName;
                $scope.PatientInsuranceObj.InsuredPersonLastName = InsuranceEditItem.InsuredPersonLastName;
                $scope.PatientInsuranceObj.PatientFirstName = InsuranceEditItem.PatientFirstName;
                $scope.PatientInsuranceObj.PatientLastName = InsuranceEditItem.PatientLastName;
                $scope.PatientInsuranceObj.PatientDOB = $filter('date')(InsuranceEditItem.PatientDOB, "MM-dd-yyyy");
                $scope.PatientInsuranceObj.PatientSSN = InsuranceEditItem.PatientSSN;
                $scope.PatientInsuranceObj.IsIdentifier = false;
                $scope.PatientInsuranceObj.MovetoBilling = InsuranceEditItem.MovetoBilling;
                InsuranceEditItem.PatientDocumentDetails = InsuranceEditItem.PatientDocumentDetails || [];
                $scope.PatientInsuranceObj.InsuredPersonSecondLastName = InsuranceEditItem.InsuredPersonSecondLastName;
                $scope.PatientInsuranceObj.InsuredPersonSuffix = InsuranceEditItem.InsuredPersonSuffix;
                $scope.PatientInsuranceObj.PatientMiddleName = InsuranceEditItem.PatientMiddleName;
                $scope.PatientInsuranceObj.PatientSecondLastName = InsuranceEditItem.PatientSecondLastName;
                $scope.PatientInsuranceObj.PatientSuffix = InsuranceEditItem.PatientSuffix;

               
                if ($scope.PatientInsuranceObj.PayorObj!== "") {
                    $scope.PatientInsuranceObj.IsCoverageEnabled = true;
                    $scope.PatientInsuranceObj.IsPolicyIdEnabled = true;
                    $scope.PatientInsuranceObj.IsGroupIdEnabled = true;
                }

                if (InsuranceEditItem.PatientDocumentDetails.length > 0) {
                    angular.forEach(InsuranceEditItem.PatientDocumentDetails, function (billitem) {
                        if (!billitem.IsBackSidefile) {
                            $scope.frontItemUpload = false;
                            $scope.frontItemS3Url = true;
                            $scope.frontS3Url = billitem.S3URL;
                        }
                        if (billitem.IsBackSidefile) {
                            $scope.backItemUpload = false;
                            $scope.backItemS3Url = true;
                            $scope.backS3Url = billitem.S3URL;
                        }
                    });
                    $scope.PatientInsuranceObj.PatientDocumentDetails = [];
                    $scope.PatientInsuranceObj.PatientDocumentDetails = InsuranceEditItem.PatientDocumentDetails;

                }

                InsuranceEditItem.EffectiveDate = InsuranceEditItem.EffectiveDate || "";
                if (InsuranceEditItem.EffectiveDate != "") {
                    $scope.PatientInsuranceObj.EffectiveDate = $filter('date')(InsuranceEditItem.EffectiveDate, "MM-dd-yyyy");
                    //$scope.PatientInsuranceObj.EffectiveDate = $filter("date")(new Date(InsuranceEditItem.EffectiveDate), "MM-dd-yyyy") || "";
                }
                InsuranceEditItem.ExpiryDate = InsuranceEditItem.ExpiryDate || "";
                if (InsuranceEditItem.ExpiryDate != "") {
                    $scope.PatientInsuranceObj.ExpiryDate = $filter('date')(InsuranceEditItem.ExpiryDate, "MM-dd-yyyy");
                    //$scope.PatientInsuranceObj.ExpiryDate = $filter("date")(new Date(InsuranceEditItem.ExpiryDate), "MM-dd-yyyy") || "";
                }
                InsuranceEditItem.ScanDate = InsuranceEditItem.ScanDate || "";
                if (InsuranceEditItem.ScanDate != "") {
                    $scope.PatientInsuranceObj.ScanDate = $filter("date")(new Date(InsuranceEditItem.ScanDate), "MM-dd-yyyy") || "";
                }
                InsuranceEditItem.VerifiedDate = InsuranceEditItem.VerifiedDate || "";
                if (InsuranceEditItem.VerifiedDate != "") {
                    $scope.PatientInsuranceObj.VerifiedDate = $filter("date")(new Date(InsuranceEditItem.VerifiedDate), "MM-dd-yyyy") || "";
                }
               
            }
        }
        $scope.ChangePatientDetails = function () {
            if ($scope.PatientInsuranceObj.RelationShipId == 1) {
            $scope.PatientInsuranceObj.InsuredPersonFirstName = angular.copy($scope.PatientInsuranceObj.PatientFirstName);
            $scope.PatientInsuranceObj.InsuredPersonMiddleName = angular.copy($scope.PatientInsuranceObj.PatientMiddleName);
            $scope.PatientInsuranceObj.InsuredPersonLastName = angular.copy($scope.PatientInsuranceObj.PatientLastName);
            $scope.PatientInsuranceObj.InsuredPersonSecondLastName = angular.copy($scope.PatientInsuranceObj.PatientSecondLastName);
            $scope.PatientInsuranceObj.InsuredPersonSuffix = angular.copy($scope.PatientInsuranceObj.PatientSuffix);
            $scope.PatientInsuranceObj.InsuredPersonDOB = angular.copy($scope.PatientInsuranceObj.PatientDOB);
                $scope.PatientInsuranceObj.InsuredPersonSSN = angular.copy($scope.PatientInsuranceObj.PatientSSN);
            }
        }

        // funcions on insurance is completed 
        $scope.AddressSaveAndNext = function () {
                $scope.SaveTypeObj.TypeName = 'AddressDetails';
                $scope.RegisterPatientSave();
                if (!$scope.ValidateIndictor) {
                    $scope.mainEditPatientProfileObj.MainTab = 3;
                    $scope.SaveTypeObj.TypeName = 'InsuranceDetails';

                    if ($scope.PatientInsuranceSummary.length > 0) {
                        $scope.ShowInsuranceAddnew = true;
                    } else {
                        $scope.ShowInsuranceAddnew = false;
                    }
                    $scope.ShowInsCopyBtn = false;
                }
            };
        
        $scope.RemoveAddressDocuments = function (item, index) {

                if (item.PatientAddressDocumentId != 0) {

                    var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete Upload Document? </h4>", function () {

                        if ($scope.PatientAddressInfo.PatientAddressDocuments.length > 0) {
                            $scope.AddressDeleteDocumentById =
                            {
                                "UserId": $scope.UserId,
                                "HospitalID": $scope.HospitalId,
                                "PatientAddressDocumentDetails": [{
                                    "DocumentId": item.PatientAddressDocumentId,
                                    "DocumentTypeId": 0,
                                    "DocumentName": item.DocumentName,
                                    "DocumentExt": item.DocumentExt,
                                    "S3URL": item.S3URL,
                                    "DeleteInd": "Y"
                                }]
                            }
                        }
                        eHnotePatientDataService.DeletePatientAddressDocumentById($scope.AddressDeleteDocumentById).then(function (resp) {
                            console.log(resp);
                            if (resp.data.status == "Success") {

                                var filterTins = $filter("filter")($scope.PatientAddressInfo.PatientAddressDocuments, { "PatientAddressDocumentId": item.PatientAddressDocumentId }, true) || [];
                                if (filterTins.length > 0) {

                                    var index = $scope.PatientAddressInfo.PatientAddressDocuments.indexOf(filterTins[0]);

                                    $scope.PatientAddressInfo.PatientAddressDocuments.splice(index, 1);

                                }
                            }

                            alertify.success("Deleted Successfully");
                        }, function (err) {
                            console.log(err);
                            alertify.error("Deleting Failed");
                        });
                    })
                } else {
                    $scope.PatientAddressInfo.PatientAddressDocuments.splice(index, 1);
                }
            }
        $scope.RemoveAddressDocuments1 = function (index) {
                $scope.tempAddressDocsArray.splice(index, 1);
            }
        
        $scope.scanAddressImageDocuments = function () {

                var obj = {
                    "PatientId": $scope.PatientDetailsInfo.PatientID || null,
                    "AppointmentId": null,
                    "PatientName": $scope.PatientDetailsInfo.FullName || '',
                    "Tab": "Insurance"
                }

                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                    "backdrop": "static",
                    "size": "md",
                    "resolve": {
                        "mainObject": function () { return obj; }
                    },
                    "windowClass": "modal__eighty--   overflow-hidden",
                    "keyboard": false,
                    "controller": "DocumentScannerCtrl",

                });
                $scope.mInstanceAdd.result.then(function (result) {
                    if (result !== "") {
                        console.log(result);
                        var obj = {
                            "PatientAddressDocumentId": 0,
                            "DocumentTypeId": 0,
                            "DocumentExt": result.FileExt,
                            "DocumentName": result.DocumentName, 
                            "S3URL": result.S3URL,
                            "DeleteInd": "N",
                        }

                        $scope.PatientAddressInfo.PatientAddressDocuments.push(obj);

                    }



                }, function (cancel) {
                });

            }
        
        $scope.selectPatientAddressDocuments = function ($files) {
                $scope.PatientAddressInfo.PatientAddressDocuments = $scope.PatientAddressInfo.PatientAddressDocuments || [];
                $scope.tempAddressDocsArray = $scope.tempAddressDocsArray || [];
                $scope.PatientAddressInfo.S3URL = '';
                $scope.file = "";

                $scope.file = $files;

                if ($scope.file != null) {
                    if ($scope.file.length > 0) {
                        angular.forEach($scope.file, function (fitem) {
                            var pName = fitem.name, name = "";
                            var Filetype = fitem.type.split("/")[1];
                            if (pName.length > 9) {
                                name = pName.substring(0, 9) + "..." + "." + Filetype;
                            } else {
                                name = angular.copy(pName) + '.' + Filetype;
                            }

                            var obj = {
                                "file": fitem,
                                "DeleteInd": "N",
                                "PatientAddressDocumentId": 0,
                                "DocumentExt": fitem.Filetype,
                                "DocumentName": name,
                                "S3URL": "",
                                "Type": "PatientAddress"
                            };



                            if (fitem.Filetype != 'application/pdf') {
                                $scope.tempAddressDocsArray.push(obj);
                            }
                            else {
                                $scope.tempAddressDocsArray.push(obj);
                            }


                        });
                    }
                }
            };
        
        $scope.getFrequentlyAddedCities = function (val, item) {
                var params = {
                    "UserId": doctorinfo.doctorid,
                    "SearchText": val,
                    "StateId": item.StateId
                };

                return eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {

                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                });
            };
        
        $scope.onCityChange = function (item) {
                $scope.PatientAddressInfo.PermanentAddress.CityName = item.CityName || "";
                $scope.PatientAddressInfo.PermanentAddress.CityId = item.CityId;
                $scope.PatientAddressInfo.PermanentAddress.StateName = item.StateName || "";
                $scope.PatientAddressInfo.PermanentAddress.StateId = item.StateId;
                $scope.PatientAddressInfo.PermanentAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];

                eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                    if (resp.data.length > 0) {
                        $scope.patientList = resp.data;

                        //$scope.PatientAddressInfo.PermanentAddress.StateName = $scope.patientList[0].StateName;
                        // $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.patientList[0].StateId;
                        //$scope.PatientAddressInfo.PermanentAddress.CountryName = $scope.patientList[0].CountryName;
                        //$scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.patientList[0].CountryId;

                        if ($scope.patientList.length > 0) {
                            if ($scope.patientList.length == 1) {
                                $scope.PatientAddressInfo.PermanentAddress.StateName = $scope.patientList[0].StateName;
                                $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.patientList[0].StateId;
                            } else {
                                $scope.PermanentStates = [];
                                angular.forEach($scope.patientList, function (suitem) {
                                    suitem.Name = suitem.StateName || "";
                                    $scope.PermanentStates.push(suitem);
                                });
                            }
                            $scope.PatientAddressInfo.PermanentAddress.CountryName = $scope.patientList[0].CountryName;
                            $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.patientList[0].CountryId;
                        } else {
                            $scope.PermanentStates = angular.copy($scope.states) || [];
                        }

                    }
                });

            };
        $scope.onCityChange1 = function (item) {
                $scope.PatientAddressInfo.PostalAddress.CityName = item.CityName || "";
                $scope.PatientAddressInfo.PostalAddress.CityId = item.CityId;
                $scope.PatientAddressInfo.PostalAddress.StateName = item.StateName || "";
                $scope.PatientAddressInfo.PostalAddress.StateId = item.StateId;
                $scope.PatientAddressInfo.PostalAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];

                eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                    if (resp.data.length > 0) {
                        $scope.patientList1 = resp.data;

                        //$scope.PatientAddressInfo.PostalAddress.StateName = $scope.patientList1[0].StateName;
                        //$scope.PatientAddressInfo.PostalAddress.StateId = $scope.patientList1[0].StateId;

                        if ($scope.patientList1.length > 0) {
                            if ($scope.patientList1.length == 1) {
                                $scope.PatientAddressInfo.PostalAddress.StateName = $scope.patientList1[0].StateName;
                                $scope.PatientAddressInfo.PostalAddress.StateId = $scope.patientList1[0].StateId;
                            } else {
                                $scope.PostalStates = [];
                                angular.forEach($scope.patientList1, function (suitem) {
                                    suitem.Name = suitem.StateName || "";
                                    suitem.ZipCodeArray = suitem.ZipCodeArray || [];
                                    $scope.PostalStates.push(suitem);
                                });
                            }
                            $scope.PatientAddressInfo.PostalAddress.CountryName = $scope.patientList1[0].CountryName;
                            $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.patientList1[0].CountryId;
                        } else {
                            $scope.PostalStates = angular.copy($scope.states) || [];
                        }

                    }
                });

            };
        
        $scope.ChnageCitiesText = function (type) {
                if (type === "Permanent") {
                    $scope.PatientAddressInfo.PermanentAddress.StateName = "";
                    $scope.PatientAddressInfo.PermanentAddress.StateId = 0;

                    $scope.PermanentStates = angular.copy($scope.states) || [];
                    $scope.PatientAddressInfo.PermanentAddress.ZipCodeArray = [];
                } else {
                    $scope.PatientAddressInfo.PostalAddress.StateName = "";
                    $scope.PatientAddressInfo.PostalAddress.StateId = 0;

                    $scope.PostalStates = angular.copy($scope.states) || [];
                    $scope.PatientAddressInfo.PostalAddress.ZipCodeArray = [];
                }
            }
        
        $scope.ONchangePatientState = function (item, type) {
                if (type === "Permanent") {
                    $scope.PatientAddressInfo.PermanentAddress.StateName = item.Name;
                    $scope.PatientAddressInfo.PermanentAddress.StateId = item.StateId;
                    //$scope.PatientAddressInfo.PermanentAddress.CityName = "";
                    //$scope.PatientAddressInfo.PermanentAddress.CityId = item.CityId || 0;
                    //$scope.PatientAddressInfo.PermanentAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];
                } else {
                    $scope.PatientAddressInfo.PostalAddress.StateName = item.Name;
                    $scope.PatientAddressInfo.PostalAddress.StateId = item.StateId;
                    //$scope.PatientAddressInfo.PostalAddress.CityName = "";
                    //$scope.PatientAddressInfo.PostalAddress.CityId = item.CityId || 0;
                    //$scope.PatientAddressInfo.PostalAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];
                }
            };
        
        $scope.ChangestateText = function (type) {
                if (type === "Permanent") {
                    $scope.PatientAddressInfo.PermanentAddress.StateId = 0;
                } else {
                    $scope.PatientAddressInfo.PostalAddress.StateId = 0;
                }
            }
        
        $scope.OnchangeCountry = function (item, type) {
                if (type === "Permanent") {
                    $scope.PatientAddressInfo.PermanentAddress.CountryName = item.Name;
                    $scope.PatientAddressInfo.PermanentAddress.CountryId = item.Id;
                } else {
                    $scope.PatientAddressInfo.PostalAddress.CountryName = item.Name;
                    $scope.PatientAddressInfo.PostalAddress.CountryId = item.Id;
                }
            }
        
        $scope.Changezipcodepostal = function (val) {
                val = val || "";
                if (val.length >= 5) {
                    eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                        if (resp.data.rows.length > 0) {
                            var basedZipcode = resp.data.rows || [];
                            if (basedZipcode.length !== 0) {

                                $scope.PatientAddressInfo.PostalAddress.CityName = basedZipcode[0].CityName;
                                $scope.PatientAddressInfo.PostalAddress.CityId = basedZipcode[0].CityId;
                                $scope.PatientAddressInfo.PostalAddress.StateName = basedZipcode[0].StateName;
                                $scope.PatientAddressInfo.PostalAddress.StateId = basedZipcode[0].StateId;
                                $scope.PatientAddressInfo.PostalAddress.CountryName = basedZipcode[0].CountryName;
                                $scope.PatientAddressInfo.PostalAddress.CountryId = basedZipcode[0].CountryId;

                            }
                        }
                    });
                }

                else {
                    $scope.PatientAddressInfo.PostalAddress.CityName = '';
                    $scope.PatientAddressInfo.PostalAddress.CityId = 0;
                    $scope.PatientAddressInfo.PostalAddress.StateName = '';
                    $scope.PatientAddressInfo.PostalAddress.StateId = 0;
                    $scope.PatientAddressInfo.PostalAddress.CountryName = '';
                    $scope.PatientAddressInfo.PostalAddress.CountryId = 0;
                    $scope.PatientAddressInfo.PostalAddress.ZipCodeArray = [];
                }
            }
        
        $scope.OnSelectedZipCode = function (item, type) {
                if (type === "Permanent") {
                    $scope.PatientAddressInfo.PermanentAddress.ZipCode = item.ZIP;
                } else {
                    $scope.PatientAddressInfo.PostalAddress.ZipCode = item.ZIP;
                }
            };
        
        $scope.changeaddressDetails = function (item) {
                if (item == true) {
                    $scope.PatientAddressInfo.PermanentAddress.AddressLine1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1;
                    $scope.PatientAddressInfo.PermanentAddress.AddressLine2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2;
                    $scope.PatientAddressInfo.PermanentAddress.ZipCode = $scope.PatientAddressInfo.PostalAddress.ZipCode;
                    $scope.PatientAddressInfo.PermanentAddress.CountyName = $scope.PatientAddressInfo.PostalAddress.CountyName;
                    $scope.PatientAddressInfo.PermanentAddress.CountyId = $scope.PatientAddressInfo.PostalAddress.CountyId;
                    $scope.PatientAddressInfo.PermanentAddress.CityName = $scope.PatientAddressInfo.PostalAddress.CityName;
                    $scope.PatientAddressInfo.PermanentAddress.CityId = $scope.PatientAddressInfo.PostalAddress.CityId;
                    $scope.PatientAddressInfo.PermanentAddress.StateName = $scope.PatientAddressInfo.PostalAddress.StateName;
                    $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.PatientAddressInfo.PostalAddress.StateId;
                    $scope.PatientAddressInfo.PermanentAddress.CountryName = $scope.PatientAddressInfo.PostalAddress.CountryName;
                    $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.PatientAddressInfo.PostalAddress.CountryId;
                    $scope.PatientAddressInfo.PermanentAddress.CountyCodeObj = $scope.PatientAddressInfo.PostalAddress.CountyCodeObj;

                } else {
                    $scope.clearPermanentAddress();
                }
            }
        $scope.clearPermanentAddress = function () {
                $scope.PatientAddressInfo.PermanentAddress.AddressLine1 = "";
                $scope.PatientAddressInfo.PermanentAddress.AddressLine2 = "";
                $scope.PatientAddressInfo.PermanentAddress.ZipCode = "";
                $scope.PatientAddressInfo.PermanentAddress.CountyName = "";
                $scope.PatientAddressInfo.PermanentAddress.CountyId = 0;
                $scope.PatientAddressInfo.PermanentAddress.CityName = "";
                $scope.PatientAddressInfo.PermanentAddress.CityId = 0;
                $scope.PatientAddressInfo.PermanentAddress.StateName = "";
                $scope.PatientAddressInfo.PermanentAddress.StateId = 0;
                $scope.PatientAddressInfo.PermanentAddress.CountryName = "";
                $scope.PatientAddressInfo.PermanentAddress.CountryId = 0;
                $scope.PatientAddressInfo.PermanentAddress.CountyCodeObj = "";
                $scope.PatientAddressInfo.IsCheckCopy = false;
                $scope.Isdisabled1 = false;
            }
        
        $scope.Changezipcodepermanent = function (val) {
                val = val || "";
                if (val.length >= 5) {
                    eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                        if (resp.data.rows.length > 0) {
                            var basedZipcode = resp.data.rows || [];
                            if (basedZipcode.length !== 0) {

                                $scope.PatientAddressInfo.PermanentAddress.CityName = basedZipcode[0].CityName;
                                $scope.PatientAddressInfo.PermanentAddress.CityId = basedZipcode[0].CityId;
                                $scope.PatientAddressInfo.PermanentAddress.StateName = basedZipcode[0].StateName;
                                $scope.PatientAddressInfo.PermanentAddress.StateId = basedZipcode[0].StateId;
                                $scope.PatientAddressInfo.PermanentAddress.CountryName = basedZipcode[0].CountryName;
                                $scope.PatientAddressInfo.PermanentAddress.CountryId = basedZipcode[0].CountryId;

                            }
                        }
                    });
                }

                else {
                    $scope.PatientAddressInfo.PermanentAddress.CityName = '';
                    $scope.PatientAddressInfo.PermanentAddress.CityId = 0;
                    $scope.PatientAddressInfo.PermanentAddress.StateName = '';
                    $scope.PatientAddressInfo.PermanentAddress.StateId = 0;
                    $scope.PatientAddressInfo.PermanentAddress.CountryName = '';
                    $scope.PatientAddressInfo.PermanentAddress.CountryId = 0;
                    $scope.PatientAddressInfo.PermanentAddress.ZipCodeArray = []
                }
            };
        
        $scope.formatUSNumberInfo = function (phoneNumberString) {
                $scope.USnumberString = phoneNumberString || "";
                if ($scope.USnumberString != "") {
                    console.log($scope.USnumberString);
                    const match = phoneNumberString
                        .replace(/\D+/g, '')
                        .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                    const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                    const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                    const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                    //  return `${part1}${part2}${part3}`;
                    $scope.PatientDetailsInfo.DisplayMobileNumber = part1 + part2 + part3;

                    if ($scope.USnumberString.length > 9) {
                        var Area = $scope.USnumberString.slice(0, 3);
                        $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = Area;
                        var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                        $scope.PatientDetailsInfo.ContactInfo.HomeNumber = contact;
                    }
                } else {
                    $scope.PatientDetailsInfo.DisplayMobileNumber = "";
                    $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = "";
                    $scope.PatientDetailsInfo.ContactInfo.HomeNumber = "";
                }
            }
        
        $scope.ONchangeocupation = function (item) {
                $scope.PatientDetailsInfo.OccupationId = item.OccupationId;
                $scope.PatientDetailsInfo.OccupationDescription = item.occupation;
        }

        $scope.DemographicsSaveAndClose = function (type) {
            $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            $scope.RegisterPatientSave(type);
        };

        // Demographics Info save
        $scope.PatientDemographicsSave = function (type) {
            $scope.DemographicInfo.EducationId = $scope.DemographicInfo.EducationId || null;
          
            $scope.DemographicInfo.ResourceId = $scope.DemographicInfo.ResourceId || null;
            $scope.DemographicInfo.ResourceName = $scope.DemographicInfo.ResourceName || "";
            $scope.DemographicInfo.MultipleBirth = $scope.DemographicInfo.MultipleBirth || "";
            $scope.DemographicInfo.MothersMiddleName = $scope.DemographicInfo.MothersMiddleName || "";
            $scope.DemographicInfo.PatinetSuffixId = $scope.DemographicInfo.PatinetSuffixId || null;
            $scope.DemographicInfo.PatientPrefixListId = $scope.DemographicInfo.PatientPrefixListId || null;
            $scope.DemographicInfo.ExpressionId = $scope.DemographicInfo.ExpressionId || null;
            $scope.DemographicInfo.SexualOrientationId = $scope.DemographicInfo.SexualOrientationId || null;
            $scope.DemographicInfo.ProficiencyId = $scope.DemographicInfo.ProficiencyId || null;
            $scope.DemographicInfo.GenderIdentityStatusId = $scope.DemographicInfo.GenderIdentityStatusId || null;

            $scope.DemographicInfo.EthnicityID = $scope.DemographicInfo.EthnicityID || null;
            $scope.DemographicInfo.RaceID = $scope.DemographicInfo.RaceID || null;
            $scope.DemographicInfo.LanguageID = $scope.DemographicInfo.LanguageID || null;

            $scope.obj.IsEthnicitySelected = $scope.obj.IsEthnicitySelected || [];
            $scope.obj.IsRaceSelected = $scope.obj.IsRaceSelected || [];
            $scope.DemographicInfo.PreferedLanguageObj = $scope.DemographicInfo.PreferedLanguageObj || [];

         

            var checkexitingData = false;
            if (($scope.DemographicInfo.LanguageID != 0 && $scope.DemographicInfo.LanguageID != '') || ($scope.DemographicInfo.RaceID != 0 && $scope.DemographicInfo.RaceID != '') || ($scope.DemographicInfo.EthnicityID != 0 && $scope.DemographicInfo.EthnicityID != '') ||
                ($scope.DemographicInfo.ExpressionId != 0 && $scope.DemographicInfo.ExpressionId != '') || ($scope.DemographicInfo.ProficiencyId != 0 && $scope.DemographicInfo.ProficiencyId != '') ||
                $scope.DemographicInfo.MultipleBirth != '' ||
                ($scope.DemographicInfo.SexualOrientationId != 0 && $scope.DemographicInfo.SexualOrientationId != '') || ($scope.DemographicInfo.GenderIdentityStatusId != '' && $scope.DemographicInfo.GenderIdentityStatusId != 0)) {
                checkexitingData = true;
            }


            var tempObj = $scope.DemographicInfo;
            tempObj.PatientId = $scope.patientid;

            tempObj.PatientQuestions = tempObj.PatientQuestions || [];
            $scope.PatientQuestions = $scope.PatientQuestions || [];
           
            if ($scope.DemographicInfo.EducationId != null) {
                let old = $scope.PatientQuestions.find(x =>
                    x.QuestionName == 'Highest level of education'
                );

                var obj1 = {
                    "PatientId": $scope.patientid,
                    "UserId": $scope.UserId,
                    "QuestionId": 0,
                    "PatientQuestingsId": old ? old.PatientQuestingsId : 0,
                    "QuestionName": "Highest level of education",
                    "AnswerId": $scope.DemographicInfo.EducationId || 0,
                    "AnswerName": $scope.DemographicInfo.QuestionName || "",
                    "Type": "",
                    "Score": 0,
                    "UnitsId": 0,
                    "UnitsName": "",
                    "UnitsValue": null,
                    "DeleteInd": "N"
                };

                tempObj.PatientQuestions.push(obj1);
            }         
            if ($scope.DemographicInfo.ResourceId != null) {
                let old2 = $scope.PatientQuestions.find(x =>
                    x.QuestionName == 'How hard is it for you to pay basics like food, housing, medical care, heating'
                );
                var obj2 = {
                    "PatientId": $scope.patientid,
                    "UserId": $scope.UserId,
                    "QuestionId": 0,
                    "PatientQuestingsId": old2 ? old2.PatientQuestingsId : 0,
                    "QuestionName": "How hard is it for you to pay basics like food, housing, medical care, heating",
                    "AnswerId": $scope.DemographicInfo.ResourceId || 0,
                    "AnswerName": $scope.DemographicInfo.ResourceName || "",
                    "Type": "",
                    "Score": 0,
                    "UnitsId": 0,
                    "UnitsName": "",
                    "UnitsValue":null,
                    "DeleteInd": "N"
                };

                tempObj.PatientQuestions.push(obj2);
            }         

            angular.forEach($scope.MasterPhysicalActivity, function (mitem) {

                let old = $scope.PatientQuestions.find(x => x.QuestionId == mitem.Id);
                let isEmpty = !mitem.UserValue || mitem.UserValue === "";
               
                if (isEmpty && !old) {
                    return;
                }
                var obj3 = {
                    "PatientId": $scope.patientid,
                    "UserId": $scope.UserId,
                    "QuestionId": mitem.Id,
                    "PatientQuestingsId": old ? old.PatientQuestingsId : 0,
                    "QuestionName": mitem.Name || "",
                    "AnswerId": 0,
                    "AnswerName": "",
                    "Type": "",
                    "Score": 0,
                    "UnitsId": 0,
                    "UnitsName": mitem.Unit || "",
                    "UnitsValue": isEmpty ? null : mitem.UserValue,
                    "DeleteInd": isEmpty ? "Y" : "N"
                };               
                          
                tempObj.PatientQuestions.push(obj3);
            });


       
          
            if (tempObj.PreferedLanguageObj != undefined && tempObj.PreferedLanguageObj != "" && tempObj.PreferedLanguageObj != null) {
                var filter1 = [];
                if (tempObj.PreferedLanguage.length > 0) {
                    filter1 = $filter("filter")(tempObj.PreferedLanguage, { "LanguageId": tempObj.PreferedLanguageObj.Languageid })[0] || [];
                }
                if (filter1.length === 0) {
                    var obj = {
                        "Id": 0,
                        "LanguageName": tempObj.PreferedLanguageObj.Value,
                        "LanguageId": tempObj.PreferedLanguageObj.Languageid,  //tempObj.PreferedLanguageObj.DropdownId,
                        "IsSelected": "Y",
                        "DeleteInd": "N"
                    }
                    tempObj.PreferedLanguage.push(obj);
                }
                if (tempObj.PreferedLanguage.length > 0) {
                    angular.forEach(tempObj.PreferedLanguage, function (litem) {
                        if (litem.LanguageId === tempObj.PreferedLanguageObj.Languageid) {
                            litem.DeleteInd = "N";
                        } else {
                            litem.DeleteInd = "Y";
                        }
                    });
                }
            } else {
                tempObj.PreferedLanguage = tempObj.PreferedLanguage || [];
                tempObj.PreferedLanguageObj = tempObj.PreferedLanguageObj || [];
                if (tempObj.PreferedLanguageObj.length === 0) {
                    if (tempObj.PreferedLanguage.length > 0) {
                        angular.forEach(tempObj.PreferedLanguage, function (mitem) {
                            mitem.DeleteInd = "Y";
                        });
                    }
                }
            }
            if ($scope.obj.IsEthnicitySelected != "" && $scope.obj.IsEthnicitySelected != null) {
                if ($scope.obj.IsEthnicitySelected.length != 0) {
                    if (tempObj.Ethnicity.length === 0) {
                        angular.forEach($scope.obj.IsEthnicitySelected, function (mitem) {
                            var obj1 = {
                                "Id": 0,
                                "EthnicityName": mitem.Value,
                                "EthnicityId": mitem.DropdownId,
                                "IsSelected": "Y",
                                "DeleteInd": "N"
                            }
                            tempObj.Ethnicity.push(obj1);
                        });
                    } else if (tempObj.Ethnicity.length > 0) {
                        angular.forEach($scope.obj.IsEthnicitySelected, function (nitem) {
                            var filter1 = [];
                            if (tempObj.Ethnicity.length > 0) {
                                filter1 = $filter("filter")(tempObj.Ethnicity, { "EthnicityId": nitem.DropdownId }, true) || [];
                            }
                            if (filter1.length == 0) {
                                var obj1 = {
                                    "Id": 0,
                                    "EthnicityName": nitem.Value,
                                    "EthnicityId": nitem.DropdownId,
                                    "IsSelected": "Y",
                                    "DeleteInd": "N"
                                }
                                tempObj.Ethnicity.push(obj1);
                            }
                        });
                        angular.forEach(tempObj.Ethnicity, function (mitem) {
                            var filter1 = [];
                            if (tempObj.Ethnicity.length > 0) {
                                filter1 = $filter("filter")($scope.obj.IsEthnicitySelected, { "DropdownId": mitem.EthnicityId }, true) || [];
                            }
                            if (filter1.length == 0) {
                                mitem.DeleteInd = "Y";
                            } else {
                                mitem.DeleteInd = "N";
                            }
                        });
                    }
                }
            }
            if ($scope.obj.IsEthnicitySelected == undefined || $scope.obj.IsEthnicitySelected == "") {
                $scope.obj.IsEthnicitySelected = $scope.obj.IsEthnicitySelected || [];
                if ($scope.obj.IsEthnicitySelected.length == 0) {
                    if (tempObj.Ethnicity.length > 0) {
                        angular.forEach(tempObj.Ethnicity, function (mitem) {
                            mitem.DeleteInd = "Y";
                        });
                    }
                }
            }

            if ($scope.obj.IsRaceSelected != "" && $scope.obj.IsRaceSelected != null) {
                if ($scope.obj.IsRaceSelected.length != 0) {
                    if (tempObj.Race.length === 0) {
                        angular.forEach($scope.obj.IsRaceSelected, function (mitem) {
                            var obj2 = {
                                "Id": 0,
                                "RaceName": mitem.Value,
                                "RaceId": mitem.DropdownId,
                                "IsSelected": "Y",
                                "DeleteInd": "N"
                            }
                            tempObj.Race.push(obj2);
                        });
                    } else if (tempObj.Race.length > 0) {
                        angular.forEach($scope.obj.IsRaceSelected, function (nitem) {
                            var filter1 = [];
                            if (tempObj.Race.length > 0) {
                                filter1 = $filter("filter")(tempObj.Race, { "RaceId": nitem.DropdownId }, true) || [];
                            }
                            if (filter1.length == 0) {
                                var obj1 = {
                                    "Id": 0,
                                    "RaceName": nitem.Value,
                                    "RaceId": nitem.DropdownId,
                                    "IsSelected": "Y",
                                    "DeleteInd": "N"
                                }
                                tempObj.Race.push(obj1);
                            }
                        });
                        angular.forEach(tempObj.Race, function (mitem) {
                            var filter1 = [];
                            if (tempObj.Race.length > 0) {
                                filter1 = $filter("filter")($scope.obj.IsRaceSelected, { "DropdownId": mitem.RaceId }, true) || [];
                            }
                            if (filter1.length == 0) {
                                mitem.DeleteInd = "Y";
                            } else {
                                mitem.DeleteInd = "N";
                            }
                        });
                    }
                }
            }
            if ($scope.obj.IsRaceSelected == undefined || $scope.obj.IsRaceSelected == "") {
                $scope.obj.IsRaceSelected = $scope.obj.IsRaceSelected || [];
                if ($scope.obj.IsRaceSelected.length == 0) {
                    if (tempObj.Race.length > 0) {
                        angular.forEach(tempObj.Race, function (mitem) {
                            mitem.DeleteInd = "Y";
                        });
                    }
                }
            }
            if (tempObj.Race.length === 0 && tempObj.Ethnicity.length == 0 && $scope.DemographicInfo.LanguageID == null && $scope.DemographicInfo.ExpressionId == null &&
                $scope.DemographicInfo.ProficiencyId == null && ($scope.DemographicInfo.MultipleBirth == "" || $scope.DemographicInfo.MultipleBirth == 0) && $scope.DemographicInfo.SexualOrientationId == null &&
                $scope.DemographicInfo.GenderIdentityStatusId == null && checkexitingData == false) {
                if (type === "Final") {
                    $uibModalInstance.close('Rcopia');
                }
                return false;
            }         
            eHnotePatientDataService.AddUpdatePatientDemographicsDetails(tempObj).then(function (resp) {

                if (resp.data.status == "Success") {

                    if (type === "Final") {
                        $uibModalInstance.close('Rcopia');
                    }
                    alertify.success("Saved Successfully");
                }

            }, function (err) {
                console.log(err);
                alertify.error(err);
            });
        }

        $scope.DesignatedSaveAndNext = function () {
            $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.mainEditPatientProfileObj.MainTab = 5;
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';
            }
        };

        $scope.changeLanguage = function (id) {
            if (id == null) {
                $scope.DemographicInfo.LanguageID = "";
                return false;
            }

            $scope.DemographicInfo.LanguageID = id;
        };

        $scope.ChangeExpressionStatus = function (objitem) {
            objitem.ExpressionObj = objitem.ExpressionObj || null;
            if (objitem.ExpressionObj != null) {
                objitem.Expression = objitem.ExpressionObj.LanguageExpression;
                objitem.ExpressionId = objitem.ExpressionObj.LanguageExpressionId;
            } else {
                objitem.ExpressionId = 0;
                objitem.Expression = "";
                objitem.ExpressionObj = "";
            }
        }

        $scope.ChangeProficiencyStatus = function (objitem) {
            objitem.ProficiencyObj = objitem.ProficiencyObj || null;
            if (objitem.ProficiencyObj != null) {
                objitem.Proficiency = objitem.ProficiencyObj.LanguageProficiency;
                objitem.ProficiencyId = objitem.ProficiencyObj.LanguageProficiencyId;
            } else {
                objitem.ProficiencyId = 0;
                objitem.Proficiency = "";
                objitem.ProficiencyObj = "";
            }
        }

        $scope.ChangeSexualOrientationStatus = function (objitem) {
            objitem.SexualOrientationObj = objitem.SexualOrientationObj || null;
            if (objitem.SexualOrientationObj != null) {
                objitem.SexualOrientation = objitem.SexualOrientationObj.SexualOrientation;
                objitem.SexualOrientationId = objitem.SexualOrientationObj.SexualOrientationId;
            } else {
                objitem.SexualOrientationId = 0;
                objitem.SexualOrientation = "";
                objitem.SexualOrientationObj = "";
            }
        }

        $scope.ChangePronounStatus = function (Id) {
            var filteredArray = $filter("filter")($scope.PatientPronounList, { "MasterPronounId": Id }, true);
            if (filteredArray.length > 0) {
                $scope.DemographicInfo.PronounName = filteredArray[0].Display;
            }
        }

        $scope.ChangeMasterEducation = function (Id) {
            var filteredArray = $filter("filter")($scope.MasterEducation, { "EducationId": Id }, true);  
            if (filteredArray.length > 0) {
                $scope.DemographicInfo.QuestionName = filteredArray[0].EducationName;
            }
        }
        $scope.ChangeFinancialResource = function (Id) {
            var filteredArray = $filter("filter")($scope.FinancialResourceList, { "Id": Id }, true);
            if (filteredArray.length > 0) {
                $scope.DemographicInfo.ResourceName = filteredArray[0].Name;
            }
        }
        $scope.ChangeGenderIdentityStatus = function (objitem) {
            objitem.GenderIdentityStatusObj = objitem.GenderIdentityStatusObj || null;
            if (objitem.GenderIdentityStatusObj != null) {
                objitem.GenderIdentityStatus = objitem.GenderIdentityStatusObj.GenderIdentity;
                objitem.GenderIdentityStatusId = objitem.GenderIdentityStatusObj.GenderIdentityId;
            } else {
                objitem.GenderIdentityStatusId = 0;
                objitem.GenderIdentityStatus = "";
                objitem.GenderIdentityStatusObj = "";
            }
        }

        $scope.changeGenderbasedTitleInFamily = function (item) {
            if (item.Gender === "Female") {
                item.TitleId = 3;
            } else {
                item.TitleId = 1;
            }
        };

        $scope.changeFamilyPhoneNumber = function (fitem) {
            $scope.USnumberString = fitem.FamilyPhoneNumber || "";
            if ($scope.USnumberString != "") {
                const match = fitem.FamilyPhoneNumber
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                fitem.FamilyPhoneNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    fitem.AreaCode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    fitem.PhoneNumber = contact;
                }
            } else {
                fitem.PhoneNumber = "";
                fitem.AreaCode = "";
                fitem.FamilyPhoneNumber = "";
            }
        }

        $scope.ChangeFamilyAddress = function (item, fitem) {
            //if ($scope.PatientAddressInfo.PostalAddress.AddressId == 0) {
            //    $scope.PatientAddressInfo = $scope.PatientAddressInfo;
            //}
            if (item == 'PostalAdd') {
                fitem.AddressId = angular.copy($scope.PatientAddressInfo.PostalAddress.AddressId) || "";
                fitem.AddressLine1 = angular.copy($scope.PatientAddressInfo.PostalAddress.AddressLine1) || "";
                fitem.AddressLine2 = angular.copy($scope.PatientAddressInfo.PostalAddress.AddressLine2) || "";
                fitem.ZipCode = angular.copy($scope.PatientAddressInfo.PostalAddress.ZipCode) || "";
                fitem.CountyName = angular.copy($scope.PatientAddressInfo.PostalAddress.CountyName) || "";
                fitem.CountyId = angular.copy($scope.PatientAddressInfo.PostalAddress.CountyId) || "";
                fitem.CityName = angular.copy($scope.PatientAddressInfo.PostalAddress.CityName) || "";
                fitem.CityId = angular.copy($scope.PatientAddressInfo.PostalAddress.CityId) || "";
                fitem.StateName = angular.copy($scope.PatientAddressInfo.PostalAddress.StateName) || "";
                fitem.StateId = angular.copy($scope.PatientAddressInfo.PostalAddress.StateId) || "";
                fitem.CountryName = angular.copy($scope.PatientAddressInfo.PostalAddress.CountryName) || "";
                fitem.CountryId = angular.copy($scope.PatientAddressInfo.PostalAddress.CountryId) || "";
                fitem.CountyCodeObj = angular.copy($scope.PatientAddressInfo.PostalAddress.CountyCodeObj) || "";
                fitem.ZipCodeArray = angular.copy($scope.PatientAddressInfo.PostalAddress.ZipCodeArray) || [];
            } else {
                fitem.AddressId = angular.copy($scope.PatientAddressInfo.PermanentAddress.AddressId) || "";
                fitem.AddressLine1 = angular.copy($scope.PatientAddressInfo.PermanentAddress.AddressLine1) || "";
                fitem.AddressLine2 = angular.copy($scope.PatientAddressInfo.PermanentAddress.AddressLine2) || "";
                fitem.ZipCode = angular.copy($scope.PatientAddressInfo.PermanentAddress.ZipCode) || "";
                fitem.CountyName = angular.copy($scope.PatientAddressInfo.PermanentAddress.CountyName) || "";
                fitem.CountyId = angular.copy($scope.PatientAddressInfo.PermanentAddress.CountyId) || "";
                fitem.CityName = angular.copy($scope.PatientAddressInfo.PermanentAddress.CityName) || "";
                fitem.CityId = angular.copy($scope.PatientAddressInfo.PermanentAddress.CityId) || "";
                fitem.StateName = angular.copy($scope.PatientAddressInfo.PermanentAddress.StateName) || "";
                fitem.StateId = angular.copy($scope.PatientAddressInfo.PermanentAddress.StateId) || "";
                fitem.CountryName = angular.copy($scope.PatientAddressInfo.PermanentAddress.CountryName) || "";
                fitem.CountryId = angular.copy($scope.PatientAddressInfo.PermanentAddress.CountryId) || "";
                fitem.CountyCodeObj = angular.copy($scope.PatientAddressInfo.PermanentAddress.CountyCodeObj) || "";
                fitem.ZipCodeArray = angular.copy($scope.PatientAddressInfo.PermanentAddress.ZipCodeArray) || [];
            }
        }
        $scope.ClearAddress = function (item) {
            item.AddressLine1 = "";
            item.AddressLine2 = "";
            item.ZipCode = "";
            item.CountyName = "";
            item.CityName = "";
            item.StateName = "";
            item.CountryName = "";
            item.CountyCodeObj = "";
            item.ZipCodeArray = [];
            item.Address = "";
        }

        $scope.getFrequentlyAddedCitiesforfamily = function (val, item) {
            var params = {
                "UserId": doctorinfo.doctorid,
                "SearchText": val,
                "StateId": item.StateId
            };

            return eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {

                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };

        $scope.onCityChangeForFamily = function (item, Mainitem) {
            Mainitem.CityName = item.CityName || "";
            Mainitem.CityId = item.CityId;
            Mainitem.StateName = item.StateName || "";
            Mainitem.StateId = item.StateId;
            Mainitem.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];

            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.patientList1 = resp.data;
                    if ($scope.patientList1.length > 0) {
                        if ($scope.patientList1.length == 1) {
                            Mainitem.StateName = $scope.patientList1[0].StateName;
                            Mainitem.StateId = $scope.patientList1[0].StateId;
                        } else {
                            $scope.PostalStates = [];
                            Mainitem.Name = item.StateName || "";
                            Mainitem.ZipCodeArray = item.ZipCodeArray || [];
                            $scope.PostalStates.push(item);
                        }
                        Mainitem.CountryName = $scope.patientList1[0].CountryName;
                        Mainitem.CountryId = $scope.patientList1[0].CountryId;
                    } else {
                        $scope.PostalStates = angular.copy($scope.states) || [];
                    }

                }
            });

        };

        $scope.ChnageCitiesTextForFamily = function () {
            $scope.FamilyInfo.FamilyArray.StateName = "";
            $scope.FamilyInfo.FamilyArray.StateId = 0;
            $scope.PermanentStates = angular.copy($scope.states) || [];
            $scope.FamilyInfo.FamilyArray.ZipCodeArray = [];
        }

        $scope.ONchangeFamilyState = function (item, suitem) {
            //suitem.CityId = item.CityId || 0;
            suitem.StateName = item.Name;
            suitem.StateId = item.StateId;
            //suitem.ZipCodeArray = item.ZipCodeArray || [];
        };

        $scope.ChangestateTextForFamily = function () {
            $scope.FamilyInfo.FamilyArray.StateId = 0;
        }

        $scope.OnchangeCountryForFamily = function (item, nitem) {
            nitem.CountryName = item.CountryName;
            nitem.CountryId = item.CountryId;
        }

        $scope.ChangezipcodeFamilyPostal = function (val, item) {
            var index = $scope.FamilyInfo.FamilyArray.indexOf(item);
            val = val || "";
            if (val.length >= 5) {
                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {
                        var basedZipcode = resp.data.rows || [];
                        if (basedZipcode.length !== 0) {

                            $scope.FamilyInfo.FamilyArray[index].CityName = basedZipcode[0].CityName;
                            $scope.FamilyInfo.FamilyArray[index].CityId = basedZipcode[0].CityId;
                            $scope.FamilyInfo.FamilyArray[index].StateName = basedZipcode[0].StateName;
                            $scope.FamilyInfo.FamilyArray[index].StateId = basedZipcode[0].StateId;
                            $scope.FamilyInfo.FamilyArray[index].CountryName = basedZipcode[0].CountryName;
                            $scope.FamilyInfo.FamilyArray[index].CountryId = basedZipcode[0].CountryId;

                        }
                    }
                });
            }

            else {
                $scope.FamilyInfo.FamilyArray[index].CityName = '';
                $scope.FamilyInfo.FamilyArray[index].CityId = 0;
                $scope.FamilyInfo.FamilyArray[index].StateName = '';
                $scope.FamilyInfo.FamilyArray[index].StateId = 0;
                $scope.FamilyInfo.FamilyArray[index].CountryName = '';
                $scope.FamilyInfo.FamilyArray[index].CountryId = 0;
                $scope.FamilyInfo.FamilyArray[index].ZipCodeArray = [];

            }
        }

        $scope.OnSelectedZipCodeForFamily = function (item, Mitem) {
            Mitem.ZipCode = item.ZIP;
        };

        $scope.FamilySaveAndClose = function (type) {
            $scope.SaveTypeObj.TypeName = 'FamilyDetails';
            $scope.RegisterPatientSave(type);
        };


        // FamilyInfo
        $scope.PatientFamilySave = function (type) {

            if ($scope.FamilyInfo.FamilyArray.length === 0) {
                $scope.ValidateIndictor = true;
                return false;
            }
            $scope.FamilyInfo.FamilyArray[0].AreaCode = $scope.FamilyInfo.FamilyArray[0].AreaCode || "";
            $scope.FamilyInfo.FamilyArray[0].PhoneNumber = $scope.FamilyInfo.FamilyArray[0].PhoneNumber || "";
            if ($scope.FamilyInfo.FamilyArray.length === 1) {
                $scope.FamilyInfo.FamilyArray[0].LastName = $scope.FamilyInfo.FamilyArray[0].LastName || "";

                if (($scope.FamilyInfo.FamilyArray[0].FirstName == "" || $scope.FamilyInfo.FamilyArray[0].FirstName == undefined) && $scope.FamilyInfo.FamilyArray[0].LastName == '' && $scope.FamilyInfo.FamilyArray[0].AreaCode == '' && $scope.FamilyInfo.FamilyArray[0].PhoneNumber == '' &&
                    ($scope.FamilyInfo.FamilyArray[0].RelationId == "" || $scope.FamilyInfo.FamilyArray[0].RelationId == 0 || $scope.FamilyInfo.FamilyArray[0].RelationId == undefined)) {
                    if (type === "Final") {
                        $uibModalInstance.close('Rcopia');
                    }
                    return false;
                }
            }
            var familyarryEmptyString = false;
            if ($scope.FamilyInfo.FamilyArray.length > 0) {
                angular.forEach($scope.FamilyInfo.FamilyArray, function (item) {
                    if (item.DeleteInd != "Y") {
                        if (item.FirstName === "" || item.FirstName === null || item.FirstName === undefined) {
                            familyarryEmptyString = true;
                            alertify.error("Please Enter Patient FirstName");
                            return false;
                        }
                        if (item.FirstName.length < 3) {
                            familyarryEmptyString = true;
                            alertify.error("Please Enter Patient FirstName");
                            return false;
                        }
                        item.LastName = item.LastName || "";
                        if (item.LastName === "") {
                            familyarryEmptyString = true;
                            alertify.error("Please Enter Patient LastName");
                            return false;
                        }

                        if (item.DOB === "" || item.DOB === null) {
                            familyarryEmptyString = true;
                            alertify.error("Please Enter DOB");
                            return false;
                        } else {
                            /*item.DOB = $filter("dateFormatter")(item.DOB, "-");*/
                            item.DOB = $filter('date')(item.DOB, 'yyyy-MM-dd');
                        }

                        if (item.RelationId === "" || item.RelationId === null || item.RelationId === undefined || item.RelationId === 0) {
                            familyarryEmptyString = true;
                            alertify.error("Please Select Patient Relation");
                            return false;
                        }
                       
                        item.FamilyPhoneNumber = item.FamilyPhoneNumber || '';
                        if (item.FamilyPhoneNumber == '') {
                            familyarryEmptyString = true;
                            alertify.error("Please Enter Mobile Number");
                            return false;
                        }
                        if (item.FamilyPhoneNumber.length != 14) {
                            familyarryEmptyString = true;
                            alertify.error("Please Enter Valid MobileNumber");
                            return false;
                        }

                    }
                });
            }

            if (familyarryEmptyString === true) {
                $scope.ValidateIndictor = true;
                return false;
            }
          
            var param = {
                "PatientId": $scope.patientid,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "FamilyInfo": angular.copy($scope.FamilyInfo.FamilyArray)
            }
            angular.forEach(param.FamilyInfo, function (item) {
                item.ParentPatientId = $scope.patientid;
            });

            eHnotePatientDataService.AddUpdatePatientFamilyDetails(param).then(function (resp) {
                if (resp.data.status == "Success") {
                   
                    if (type === "Final") {
                        $uibModalInstance.close('Rcopia');
                        alertify.success("Saved Successfully");
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error(err);
            });
        }

        $scope.Previous = function (type) {
            $scope.mainEditPatientProfileObj.MainTab = type;
            if ($scope.mainEditPatientProfileObj.MainTab === 1) {
                $scope.SaveTypeObj.TypeName = 'PatientDetails';
            }
            if ($scope.mainEditPatientProfileObj.MainTab === 2) {
                $scope.SaveTypeObj.TypeName = 'AddressDetails';
            }
            if ($scope.mainEditPatientProfileObj.MainTab === 3) {
                $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
                if ($scope.PatientInsuranceSummary.length > 0) {
                    $scope.ShowInsuranceAddnew = true;
                }
                else {
                    $scope.ShowInsuranceAddnew = false;
                   
                }
                $scope.ShowInsCopyBtn = false;
            }
            if ($scope.mainEditPatientProfileObj.MainTab === 4) {
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            }
            if ($scope.mainEditPatientProfileObj.MainTab === 5) {
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';
            }
        }

        $scope.AddOneMoreFamilyMember = function (fitem) {

            if (fitem.FirstName == "" && (fitem.RelationId == "" || fitem.RelationId == 0) &&
                (fitem.MobileNumber == "" || fitem.MobileNumber == 0 || fitem.MobileNumber == undefined)) {
                alertify.error("Enter Above Family Member Details");
                return false;
            }
            if (fitem.FirstName === "" || fitem.FirstName === null || fitem.FirstName === undefined) {
                alertify.error("Please Enter First Name");
                return false;
            }
            if (fitem.FirstName.length < 3) {
                alertify.error("Please Enter First Name");
                return false;
            }
            fitem.LastName = fitem.LastName || "";
            if (fitem.LastName === "") {
                alertify.error("Please Enter Last Name");
                return false;
            }
            if (fitem.DOB === "" || fitem.DOB === null) {
                alertify.error("Please Enter DOB");
                return false;
            }

            if (fitem.RelationId === "" || fitem.RelationId === null || fitem.RelationId === undefined || fitem.RelationId === 0) {
                alertify.error("Please Enter patient Relation");
                return false;
            }
           
            //if (fitem.AreaCode.length != 3) {
            //    alertify.error("Please Enter Valid Area Code");
            //    return false;
            //}
            if (fitem.PhoneNumber.length != 7) {
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }


            var obj = {
                "PatientId": 0,
                "FamilyId": 0,
                "DeleteInd": "N",
                "Title": $scope.TitlesList[0].Name,
                "TitleId": $scope.TitlesList[0].Id,
                "FirstName": "",
                "LastName": "",
                "Relation": "",
                "RelationId": 0,
                "AreaCode": "",
                "MobileNumber": "",
                "ParentPatientId": 0,
                "RelationObj": "",
                "Age": "",
                "DOB": "",
                "CurrentAge": "",
                "ageinYears": "",
                "ageinMonths": "",
                "ageinDays": "",
                "CountryCode": "+1",
                "PhoneNumber": "",
                "Gender": "Male",
                "AreaCodeInd": false,
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
                "ZipCodeArray": [],
                "Address": ""
            }
            $scope.FamilyInfo.FamilyArray.push(obj);
        }

        $scope.RemoveFamilyMember = function (item) {
            if (item.FamilyId === 0) {
                var index = $scope.FamilyInfo.FamilyArray.indexOf(item);
                $scope.FamilyInfo.FamilyArray.splice(index, 1);
            } else {
                item.DeleteInd = "Y";
            }
        }

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


        $scope.ContinuePatientSaveOnTabClick = function (type, typename) {

            if (typename === "PatientDetails") {
                $scope.Finalsubmit = "";
                $scope.ValidateIndictor = false;
                $scope.PatientSave(type);
                if (!$scope.ValidateIndictor) {
                    $scope.mainEditPatientProfileObj.MainTab = type;
                }
            }
            else if (typename === "AddressDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientAddressSave(type);
                if (!$scope.ValidateIndictor) {
                    $scope.mainEditPatientProfileObj.MainTab = type;

                }
            }
            else if (typename === "DemographicsDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientDemographicsSave(type);
                if (!$scope.ValidateIndictor) {
                    $scope.mainEditPatientProfileObj.MainTab = type;
                }
            }
            else if (typename === "FamilyDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientFamilySave(type);
                if (!$scope.ValidateIndictor) {
                    $scope.mainEditPatientProfileObj.MainTab = type;

                }
            }
            //else if (typename === "DesignatedDetails") {
            //    $scope.ValidateIndictor = false;
            //    $scope.PatientDesignatedSave(type);
            //}
            else if (typename === "InsuranceDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientInsuranceDetailsSave(type);
                if (!$scope.ValidateIndictor) {
                    $scope.mainEditPatientProfileObj.MainTab = type;

                }
            }
            else {
                $scope.ValidateIndictor = false;
            }

        }

        $scope.setAgeinYears = function (year, month, days, fitem) {
            fitem.ageinYears = year;
            fitem.ageinMonths = month;
            fitem.ageinDays = days;
            if (fitem.ageinYears != "") {
                fitem.BSMSind = false;
            }
            var curAge = fitem.ageinYears + '.' + fitem.ageinMonths;
            fitem.CurrentAge = curAge;
            var dob = $scope.getDateOfBirth(fitem.ageinYears, fitem.ageinMonths, fitem.ageinDays);

            fitem.ageinYears = fitem.ageinYears || "";
            if (fitem.ageinYears != "") {
                fitem.DOB = moment(dob).format('MM-DD-YYYY');
            }
            else {
                fitem.DOB = "";
            }
        };
       
        $scope.ChangeNoChargePatient = function (NoChargePatientInd) {
            NoChargePatientInd = !NoChargePatientInd;
        };
        

        $scope.changeAuthorizedUserMobileNo = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PatientDetailsInfo.AuthorizedUserMobileNo = obj.UsFormatMobileNumber;
        };

        $scope.InsuranceSaveAndNext = function () {
            $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.mainEditPatientProfileObj.MainTab = 4;
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            }
        };

        $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
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

        $scope.ChangeCoverageStatus = function (item) {


            item.CoverageObj = $filter("filter")($scope.CoverageList, { "IdentifierId": item.IdentifierId }, true)[0];

            item.CoverageObj = item.CoverageObj || "";
            if (item.CoverageObj != "") {
                item.IdentifierId = item.CoverageObj.IdentifierId;
                item.IdentifierName = item.CoverageObj.IdentifierName;
            }
            item.MSPInsuranceTypeId = 0;
        }
        $scope.getBranchSpecializationByIdDetails = function () {
            $scope.PCPMainBranchSubSpecializationList = [];
            eHnoteMainAdminServices.getBranchSpecializationById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.PCPMainBranchSubSpecializationList = resp.data.row;
                    $scope.allSubSpecializationsArray = resp.data.row;
                }
            });

        }
        $scope.getBranchSpecializationByIdDetails();

        $scope.selectedAppointmentObject = {
            "PCPDoctor": '',
            "OtherProviderDoctorName": '',
            "OtherProviderDoctorID": 0,
            "IsReferralDoctornotes": false,

        }
        $scope.SearchExternalDOClist = function (val) {
            var reqObj = {
                'LocationId': $scope.SearchPCPObj.LocationId,
                'PageNumber': $scope.SearchPCPObj.PageNumber,
                'PageSize': 100,
                'SearchTaxt': val || '',
                "SpecializationId": $scope.SearchPCPObj.SpecializationId,
                "DeleteInd": $scope.SearchPCPObj.DeleteInd,
                "OrganizationId": $scope.SearchPCPObj.OrganizationId,
                "RefaralTypeId": 6
            };
            eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
                if (resp.data.PcpRefdetails.length != 0) {
                    $scope.ExternalComanagerList = resp.data.PcpRefdetails || [];
                    if ($scope.ExternalComanagerList.length > 0) {
                        if ($scope.NewlyAddedPcpReferalId != 0) {
                            $scope.SearchPCPObj.External = $filter('filter')($scope.ExternalComanagerList, { 'DoctorID': $scope.NewlyAddedPcpReferalId }, true)[0] || [];
                        }

                        angular.forEach($scope.ExternalComanagerList, function (kitem) {
                            kitem.DoctorfullNamewithNPI = kitem.NPI + '-' + kitem.FullName;

                        });
                    }

                } else {
                    return [];
                }
            });
        };
        $scope.GetPCPObj = function () {
            return {
                "PcpReferalId": 0,
                "FirstName": "",
                'LastName': '',
                'SuffixId': '',
                'Title': 'Mr',
                'Age': null,
                "MobileNo": null,
                "AlternateMobileNo": null,
                "Gender": "Male",
                "EmailId": "",
                'Address1': '',
                'Address2': '',
                'LocationId': null,
                "StateId": 0,
                'CityId': 0,
                'PinCode': '',
                'NPI': '',
                'SSN': '',
                'EmployeeId': '',
                'ZipCodePlusNo': '',
                "SpecializationId": null,
                //"DeleteInd": false,
                "DeleteInd": "N",
                "countrycode": "",
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ZipCode": '',
                "LocationName": "",
                "CityName": "",
                "CityId": "",
                "StateName": "",
                "StateId": "",
                "ContactNo": null,
                "Slicence": "",
                "TaxonomyId": "",
                "Contactcountrycode": '+1',
                'RefaralDr': '',
                'RefaralTypeId': '',
                'RefaralTypeName': '',
                'CountyName': '',
                'CountyId': 0,
                'CountryName': '',
                'CountryId': 0,
                'CLIAID': '',
                'EmployeeId': '',
                'LIC': '',
                'PCPOrganization': '',
                'WWW': '',
                'PCPNotes': '',
                'SubSpecializationId': '',
                'Fax': '',
                'Alternatecountrycode': '+1',
                'Faxcountrycode': '+1',

                'Contact': "",
                'PCPSubSpecializations': [],
                'ZipCodeArray': [],
                "IsShowCoManagerAddViewInd": false
            };
        };
        $scope.NewlyAddedPcpReferalId = 0;
        $scope.PCPObj = angular.copy($scope.GetPCPObj());
        $scope.PCPObj.RefaraldoctorObj = 6;
        $scope.AddReferalPCPDoctor = function (type) {
            type = type || 1;
            if ($scope.selectedAppointmentObject.PCPDoctor != '') {
                $scope.PCPObj.FirstName = $scope.selectedAppointmentObject.PCPDoctor || '';
                var reqObj = {
                    "PcpReferalId": 0,
                    "FirstName": $scope.PCPObj.FirstName,
                    'LastName': $scope.PCPObj.LastName,
                    'Title': $scope.PCPObj.Title,
                    'Age': $scope.PCPObj.Age || null,
                    "MobileNo": $scope.PCPObj.MobileNo,
                    "AlternateMobileNo": $scope.PCPObj.AlternateMobileNo,
                    "Gender": $scope.PCPObj.Gender,
                    "EmailId": $scope.PCPObj.EmailId,
                    "SuffixId": $scope.PCPObj.SuffixId,
                    'Address1': $scope.PCPObj.Address1,
                    'Address2': $scope.PCPObj.Address2,
                    'LocationId': $scope.PCPObj.LocationId,
                    "StateId": $scope.PCPObj.StateId || 0,
                    "StateName": $scope.PCPObj.StateName || '',
                    'CityId': $scope.PCPObj.CityId || 0,
                    'CityName': $scope.PCPObj.CityName || '',
                    'CountryId': $scope.PCPObj.CountryId || 0,
                    'CountryName': $scope.PCPObj.CountryName || '',
                    'PinCode': $scope.PCPObj.ZipCode || '',
                    'ZipCodePlusNo': $scope.PCPObj.ZipCodePlusNo,
                    "SpecializationId": $scope.PCPObj.SpecializationId,
                    "DeleteInd": $scope.PCPObj.DeleteInd,
                    "countrycode": $scope.PCPObj.CountryId,
                    "OrganizationId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    'NPI': $scope.PCPObj.NPI,
                    'SSN': $scope.PCPObj.SSN || '',
                    'EmployeeId': $scope.PCPObj.EmployeeId || '',
                    'Slicence': $scope.PCPObj.Slicence,
                    'TaxonomyId': $scope.PCPObj.TaxonomyId,
                    'ContactNo': $scope.PCPObj.ContactNo,
                    'Contactcountrycode': $scope.PCPObj.Contactcountrycode,
                    'RefaralTypeId': $scope.PCPObj.RefaralTypeId || 0,
                    'RefaralTypeName': $scope.PCPObj.RefaralTypeName || '',
                    //  'RefaralTypeName': "Referral For BookAppt",
                    'ZipCode': $scope.PCPObj.ZipCode,
                    'County': $scope.PCPObj.CountyId,
                    'CLIAID': $scope.PCPObj.CLIAID,
                    'EmployeeId': $scope.PCPObj.EmployeeId,
                    'LIC': $scope.PCPObj.LIC,
                    'PCPOrganization': $scope.PCPObj.PCPOrganization,
                    'WWW': $scope.PCPObj.WWW,
                    'PCPNotes': $scope.PCPObj.PCPNotes,
                    'SubSpecializationId': $scope.PCPObj.SubSpecializationId,
                    'Fax': $scope.PCPObj.Fax,
                    'Faxcountrycode': $scope.PCPObj.Faxcountrycode,
                    'Alternatecountrycode': $scope.PCPObj.Alternatecountrycode,
                    'Contact': $scope.PCPObj.Contact,
                    'PCPSubSpecializations': $scope.PCPObj.PCPSubSpecializations

                };
                eHnoteReferalDataService.ModifyReferalPCPDoctor(reqObj).then(function (resp) {

                    if (resp.data.Status == "Success") {
                        alertify.success("Successfully Added");
                        $scope.SearchPCPDOClist();
                        $scope.SearchPCPObj.NewpcpDoctor = false;
                        /* $scope.selectedAppointmentObject.PCPDoctor = '';*/
                        $scope.selectedAppointmentObject.OtherProviderDoctorName = $scope.selectedAppointmentObject.PCPDoctor || '';
                        $scope.selectedAppointmentObject.OtherProviderDoctorID = resp.data.PcpReferalId || 0;
                        $scope.ClosePCPPopup();
                        if ($scope.selectedAppointmentObject.OtherProviderDoctorName != '') {
                            $scope.selectedAppointmentObject.IsReferralDoctornotes = true;
                        }
                    }
                    else {
                        alertify.error(resp.data.Message);
                    }


                });
            }
            if (type == 1) {
                if ($scope.PCPObj.FirstName === '') {
                    alertify.error("Please Enter First Name");
                    return;
                }
                if ($scope.PCPObj.MobileNo != undefined) {
                    if ($scope.PCPObj.MobileNo.length < 10) {
                        alertify.error("Please Enter Valid Mobile Number");
                        return false;
                    }
                }
                if ($scope.PCPObj.EmailId == undefined) {
                    alertify.error("Please Enter Valid Email ID");
                    return false;
                }
                if ($scope.PCPObj.NPI == '') {
                    alertify.error("Please Enter NPI ");
                    return;
                }
                else if ($scope.PCPObj.NPI.length < 10) {
                    alertify.error("Please Enter Valid NPI ");
                    return;
                }

                if ($scope.PCPMainBranchSubSpecializationList.length > 0) {
                    $scope.PCPObj.PCPSubSpecializations = [];
                    angular.forEach($scope.PCPMainBranchSubSpecializationList, function (sitem) {
                        if (sitem.isChecked == true) {
                            var obj = {
                                "PCPSubSpecializationId": sitem.UserSubSpecializationId || 0,
                                /*"BranchSubSpecializationId": sitem.BranchSubSpecializationId,*/
                                "SubSpecializationId": sitem.SubSpecializationId,
                                "IsPrimarySubSpecialization": sitem.IsPrimarySubSpecialization,
                                "DeleteInd": sitem.DeleteInd || "N",
                            }
                            $scope.PCPObj.PCPSubSpecializations.push(obj);
                        }
                    });
                }
                var reqObj = {
                    "PcpReferalId": 0,
                    "FirstName": $scope.PCPObj.FirstName,
                    'LastName': $scope.PCPObj.LastName,
                    'Title': $scope.PCPObj.Title,
                    'Age': $scope.PCPObj.Age || null,
                    "MobileNo": $scope.PCPObj.MobileNo,
                    "AlternateMobileNo": $scope.PCPObj.AlternateMobileNo,
                    "Gender": $scope.PCPObj.Gender,
                    "EmailId": $scope.PCPObj.EmailId,
                    "SuffixId": $scope.PCPObj.SuffixId,
                    'Address1': $scope.PCPObj.Address1,
                    'Address2': $scope.PCPObj.Address2,
                    'LocationId': $scope.PCPObj.LocationId,
                    "StateId": $scope.PCPObj.StateId || 0,
                    "StateName": $scope.PCPObj.StateName || '',
                    'CityId': $scope.PCPObj.CityId || 0,
                    'CityName': $scope.PCPObj.CityName || '',
                    'CountryId': $scope.PCPObj.CountryId || 0,
                    'CountryName': $scope.PCPObj.CountryName || '',
                    'PinCode': $scope.PCPObj.ZipCode || '',
                    'ZipCodePlusNo': $scope.PCPObj.ZipCodePlusNo,
                    "SpecializationId": $scope.PCPObj.SpecializationId,
                    "DeleteInd": $scope.PCPObj.DeleteInd,
                    "countrycode": $scope.PCPObj.CountryId,
                    "OrganizationId": $scope.HospitalId,
                    "UserId": $scope.UserId,
                    'NPI': $scope.PCPObj.NPI,
                    'SSN': $scope.PCPObj.SSN || '',
                    'EmployeeId': $scope.PCPObj.EmployeeId || '',
                    'Slicence': $scope.PCPObj.Slicence,
                    'TaxonomyId': $scope.PCPObj.TaxonomyId,
                    'ContactNo': $scope.PCPObj.ContactNo,
                    'Contactcountrycode': $scope.PCPObj.Contactcountrycode,
                    'RefaralTypeId': $scope.PCPObj.RefaralTypeId || 0,
                    'RefaralTypeName': $scope.PCPObj.RefaralTypeName,
                    //  'RefaralTypeName': "Referral For BookAppt",
                    'ZipCode': $scope.PCPObj.ZipCode,
                    'County': $scope.PCPObj.CountyId,
                    'CLIAID': $scope.PCPObj.CLIAID,
                    'EmployeeId': $scope.PCPObj.EmployeeId,
                    'LIC': $scope.PCPObj.LIC,
                    'PCPOrganization': $scope.PCPObj.PCPOrganization,
                    'WWW': $scope.PCPObj.WWW,
                    'PCPNotes': $scope.PCPObj.PCPNotes,
                    'SubSpecializationId': $scope.PCPObj.SubSpecializationId,
                    'Fax': $scope.PCPObj.Fax,
                    'Faxcountrycode': $scope.PCPObj.Faxcountrycode,
                    'Alternatecountrycode': $scope.PCPObj.Alternatecountrycode,
                    'Contact': $scope.PCPObj.Contact,
                    'PCPSubSpecializations': $scope.PCPObj.PCPSubSpecializations

                };
                eHnoteReferalDataService.ModifyReferalPCPDoctor(reqObj).then(function (resp) {

                    if (resp.data.Status == "Success") {
                        alertify.success("Successfully Added");
                        console.log(resp.data);
                        $scope.PCPObj = angular.copy($scope.GetPCPObj());
                        $scope.PCPObj.RefaraldoctorObj = 6;
                        $scope.NewlyAddedPcpReferalId = resp.data.PcpReferalId;
                        $scope.ClosePCPPopup();
                        //$scope.SearchExternalDOClist();
                    }
                    else {
                        alertify.error(resp.data.Message);
                    }


                });
            }
        };

        $scope.GetMasterSuffix = function () {
            $scope.SuffixList = [];
            $scope.Refaraldoctorlist = [];
            eHnoteDbStaticDataService.getMasterUserSuffixList().then(function (resp) {
                $scope.SuffixList = resp.data.rows;
                $scope.Refaraldoctorlist = resp.data.RefaralTypes;
                var filter1 = "";
                filter1 = $filter("filter")($scope.Refaraldoctorlist, { "RefaralTypeId": 6 }, true) || "";
                if (filter1.length > 0) {
                    $scope.PCPObj.RefaraldoctorObj = filter1[0] || "";
                    $scope.PCPObj.RefaralTypeId = filter1[0].RefaralTypeId || 0;
                    $scope.PCPObj.RefaralTypeName = filter1[0].RefaralTypeName || "";
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Titles Failed");
            });
        }

        $scope.changeRefaralTypeId = function (item) {
            if (item == null) {
                $scope.PCPObj.RefaralTypeId = 0;
            } else {
                $scope.PCPObj.RefaralTypeId = item.RefaralTypeId;
                $scope.PCPObj.RefaralTypeName = item.RefaralTypeName;
            }
        }


        $scope.showhideAddComanager = function (item) {
            //var onCloseCallback = function () {
            //    console.log("Modal closed, parent function is being called.");
            //    $scope.SearchExternalDOClist();  // This will refresh data when the modal is closed
            //};
            $scope.GetMasterSuffix();
            let mInstanceShow = $uibModal.open({
                "templateUrl": "Addnewpcppopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__eighty--",
                //"controller": "EhnotePCPReferalCtrl",
                //"resolve": {
                //    // Pass a callback function to the modal
                //    onClose: function () {
                //        return $scope.onCloseCallback;  // Return the function to modal
                //    }
                //}
            });
            $scope.mInstanceShow = mInstanceShow;
            mInstanceShow.result.then(function (resp) {
                console.log("Modal closed with response:", resp);
                $scope.SearchExternalDOClist();
            }, function (reason) {
                console.log("Modal dismissed with reason:", reason);
            });
            //$scope.PCPObj.IsShowCoManagerAddViewInd = !$scope.PCPObj.IsShowCoManagerAddViewInd;
        }
        $scope.ClosePCPPopup = function () {
            $scope.mInstanceShow.dismiss("cancel");
        }
        $scope.Clearpcppopup = function () {
            $scope.PCPObj = angular.copy($scope.GetPCPObj());
            var filter1 = "";
            filter1 = $filter("filter")($scope.Refaraldoctorlist, { "RefaralTypeId": 6 }, true) || "";
            if (filter1.length > 0) {
                $scope.PCPObj.RefaraldoctorObj = filter1[0] || "";
                $scope.PCPObj.RefaralTypeId = filter1[0].RefaralTypeId || 0;
                $scope.PCPObj.RefaralTypeName = filter1[0].RefaralTypeName || "";
            }
            if ($scope.PCPMainBranchSubSpecializationList.length > 0) {
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (Ditem) {
                    Ditem.IsPrimarySubSpecialization = false;
                    Ditem.isChecked = false;
                });
                $scope.AllDoctorCheck = false;
            }
        }
        $scope.changeFaxPCPNumber = function (fitem) {

            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.PCPObj.Fax = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.PCPObj.FaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.PCPObj.FaxHomeNumber = contact;
                }
            }
        }
        $scope.changePhoneNumber = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.MobileNo = obj.UsFormatMobileNumber;
        };
        $scope.AllDoctorCheck = false;
        $scope.selectedDoctors = "All";
        $scope.searchtxtb = { "txt1": "", "txt2": "" };
        $scope.checkAllDoctor = function (val) {
            if (val) {
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (item) {
                    item.isChecked = true;
                    item.IsPrimarySubSpecialization = false;
                    if (item.SubSpecializationId === 11) {
                        item.IsPrimarySubSpecialization = true;
                    }
                });

                $scope.selectedDoctors = 'All';
            } else {
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (item) {
                    item.isChecked = false;
                    item.IsPrimarySubSpecialization = false;
                });

                $scope.selectedDoctors = 'Select SubSpecialities';
            }
            var checkedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: true });
            $scope.AllDoctorCheck = checkedArray.length > 0 && $scope.PCPMainBranchSubSpecializationList.length === checkedArray.length ? true : false;

        };

        $scope.DoctorToggle = function (item) {
            var checkedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: true });

            if (checkedArray.length == 1) {
                checkedArray[0].IsPrimarySubSpecialization = true;
            }
            var UncheckedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: false });
            if (UncheckedArray.length > 0) {
                angular.forEach(UncheckedArray, function (item) {
                    item.IsPrimarySubSpecialization = false;
                });
            }

            $scope.AllDoctorCheck = checkedArray.length > 0 && $scope.PCPMainBranchSubSpecializationList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedDoctors = "Select  SubSpecialities ";
            } else {
                if (checkedArray.length > 0) {
                    $scope.selectedDoctors = checkedArray[0].SubSpecializationName;


                } else {
                    $scope.selectedDoctors = "Select  SubSpecialities";
                }
            }

        };
        $scope.searchCountyByZipCode = function (zipcode) {
            eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.countyCodesArray = resp.data.rows || [];
                    if (resp.data.rows.length > 0) {
                        $scope.PCPObj.CountyName = resp.data.rows[0].CountyName;
                        $scope.PCPObj.CountyId = resp.data.rows[0].CountyId;
                    }
                }
            });
        };
        $scope.changeZipcodetoProcedure = function (val) {
            val = val || "";
            if (val.length >= 5) {
                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {
                        var basedZipcode = resp.data.rows || [];
                        if (basedZipcode.length !== 0) {
                            $scope.PCPObj.CityName = basedZipcode[0].CityName;
                            $scope.PCPObj.CityId = basedZipcode[0].CityId;
                            $scope.PCPObj.StateName = basedZipcode[0].StateName;
                            $scope.PCPObj.StateId = basedZipcode[0].StateId;
                            $scope.PCPObj.CountryName = basedZipcode[0].CountryName;
                            $scope.PCPObj.CountryId = basedZipcode[0].CountryId;
                            $scope.searchCountyByZipCode(val);
                        }
                    }
                });
            }
            else {
                $scope.PCPObj.CityName = "";
                $scope.PCPObj.CityId = 0;
                $scope.PCPObj.StateName = "";
                $scope.PCPObj.StateId = 0;
                $scope.PCPObj.CountryName = "";
                $scope.PCPObj.CountryId = 0;
                $scope.PCPObj.CountyName = "";
                $scope.PCPObj.CountyId = 0;
                $scope.PCPObj.ZipCodeArray = [];
            }
        };
        $scope.ONchangeState = function (item, type) {
            if (type === "Mailing") {
                $scope.PCPObj.StateName = item.Name;
                $scope.PCPObj.StateId = item.StateId;
                $scope.PCPObj.CityName = "";
            }
        }
        $scope.changeState = function (type) {
            if (type == "") {
                $scope.PCPObj.StateName = "";
                $scope.PCPObj.StateId = 0;

            }
        }
        $scope.changeCity = function (type) {
            if (type == "") {
                $scope.PCPObj.CityName = "";
                $scope.PCPObj.CityId = 0;
            }
        }
        $scope.ONchangeCounty = function (item, type) {
            if (type === "Refer") {
                $scope.PCPObj.CountyName = item.CountyName;
                $scope.PCPObj.CountyId = item.CountyId;
            }
        }
        $scope.getAddedCities = function (val) {
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

        eHnotePatientAddressDataServices.getStates(2, getstatesSuccess, getstatesFailed);
        function getstatesSuccess(data) {
            $scope.states = data;
        }
        function getstatesFailed(data) {
        }
        $scope.OnCity = function (item) {
            $scope.PCPObj.CityName = item.CityName || "";
            $scope.PCPObj.CityId = item.CityId;
            $scope.PCPObj.ZipCodeArray = item.ZipCodeArray || [];

            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.PCPObj.StateName = resp.data[0].StateName;
                    $scope.PCPObj.StateId = resp.data[0].StateId;
                    $scope.PCPObj.CountryName = resp.data[0].CountryName;
                    $scope.PCPObj.CountryId = resp.data[0].CountryId;

                }
            });
        }
        $scope.searchReferalDoctors = function (val, typeid) {

            var searchtext = "", searchNPI = "";
            if (isNaN(val)) {
                searchtext = val;
            }
            else {
                searchNPI = val;
            }

            var param = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 20,
                'SearchTaxt': searchtext,
                "SpecializationId": null,
                "DeleteInd": 'N',
                "NPI": searchNPI,
                "RefaralTypeId": typeid,
                /*"OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID*/
                "OrganizationId": $scope.HospitalId,
            };
            return eHnoteReferalDataService.GetReferalPCPDoctors(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.PcpRefdetails.length > 0) {
                        return resp.data.PcpRefdetails.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        }


        $scope.openCopyAsPopup = function () {
            console.log("opened copy as popup");
            var modalInstance = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/AddCopyPreviousInsurance.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "lg",
                "resolve": {
                    "PatientInsuranceSummary": function () { return $scope.PatientInsuranceSummary; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, PatientInsuranceSummary) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.PatientInsuranceSummaryList = [];
                    $scope.PatientInsuranceSummaryList = PatientInsuranceSummary || [];

                    $scope.selectedInsurance = null;

                    $scope.PatientSelectedInsList = [];
                    $scope.ChangeSelectedInsurance = function (selectedItem, selectedIndex) {
                        $scope.PatientInsuranceSummaryList.forEach(function (item, index) {
                            item.selectedInsurance = (index === selectedIndex);
                        });

                        $scope.PatientSelectedInsList = selectedItem;
                    };
                    
                    /*$scope.PatientSelectedInsList= $scope.PatientInsuranceSummaryList.filter(item => item.selectedInsurance === true);*/

                    $scope.confirmSelectedInsurance = function () {
                        if ($scope.PatientSelectedInsList != null) {
                            let obj = {
                                "CopyInsobj": $scope.PatientSelectedInsList,
                            }
                            $uibModalInstance.close(obj);
     
                        } else {
                            alertify.error("Please select an insurance plan before confirming.");
                        }
                    };


                }
            });
            modalInstance.result.then(function (resp) {
                resp = resp || null;

                $scope.PatientInsuranceObj = GetInsuranceObj();

                if (resp.CopyInsobj != null) {

                    $scope.PatientInsuranceObj.CoverageId = resp.CopyInsobj.CoverageId || 0;
                    $scope.PatientInsuranceObj.CoverageName = resp.CopyInsobj.CoverageName || "";
                    $scope.PatientInsuranceObj.PatientInsuranceDetailId = 0;
                    $scope.PatientInsuranceObj.PlanId = resp.CopyInsobj.PlanId || 0;
                    $scope.PatientInsuranceObj.PlanObj = resp.CopyInsobj.PlanName || 0;
                    $scope.PatientInsuranceObj.PayorId = resp.CopyInsobj.PayorId || 0;
                    $scope.PatientInsuranceObj.PayorObj = resp.CopyInsobj.PayorName || 0;
                    $scope.PatientInsuranceObj.PlanTypeId = resp.CopyInsobj.PlanTypeId || 0;
                    /*  $scope.PatientInsuranceObj.PlanTypeName = resp.CopyInsobj.PlanTypeName || 0;*/
                    $scope.PatientInsuranceObj.PolicyId =  "";
                    $scope.PatientInsuranceObj.GroupId =  "";
                    $scope.PatientInsuranceObj.GroupName = resp.CopyInsobj.GroupName || 0;
                    $scope.PatientInsuranceObj.RelationShipId = resp.CopyInsobj.RelationShipId || 0;
                    $scope.PatientInsuranceObj.InsuranceRelationShipObj = resp.CopyInsobj.InsuranceRelationShipObj ||"";
                    $scope.PatientInsuranceObj.PolicyHolder = resp.CopyInsobj.PolicyHolder ||"";
                    $scope.PatientInsuranceObj.PolicyHolderName = resp.CopyInsobj.PolicyHolderName ||"";
                    $scope.PatientInsuranceObj.Employer = resp.CopyInsobj.Employer ||"";
                    $scope.PatientInsuranceObj.PatientDocumentDetails = [];
                    $scope.PatientInsuranceObj.OrganizationPayorId = resp.CopyInsobj.OrganizationPayorId;
                    $scope.PatientInsuranceObj.OrganizationPayorName = resp.CopyInsobj.OrganizationPayorName;

                    if (resp.CopyInsobj.EffectiveDate != "") {
                        $scope.PatientInsuranceObj.EffectiveDate = $filter('date')(resp.CopyInsobj.EffectiveDate, "MM-dd-yyyy");
                    }
                    if (resp.CopyInsobj.ExpiryDate != "") {
                        $scope.PatientInsuranceObj.ExpiryDate = $filter('date')(resp.CopyInsobj.ExpiryDate, "MM-dd-yyyy");
                    }
                    if (resp.CopyInsobj.ScanDate != "") {
                        $scope.PatientInsuranceObj.ScanDate = $filter('date')(resp.CopyInsobj.ScanDate, "MM-dd-yyyy");
                    }
                    if (resp.CopyInsobj.VerifiedDate != "") {
                        $scope.PatientInsuranceObj.VerifiedDate = $filter('date')(resp.CopyInsobj.VerifiedDate, "MM-dd-yyyy");
                    }

                    $scope.PatientInsuranceObj.Staff = resp.CopyInsobj.Staff || "";
                    $scope.PatientInsuranceObj.StatusId = resp.CopyInsobj.StatusId || "";
                    $scope.PatientInsuranceObj.StatusName = resp.CopyInsobj.StatusName || "";
                    $scope.PatientInsuranceObj.IdentifierId = resp.CopyInsobj.IdentifierId || '';
                    $scope.PatientInsuranceObj.MSPInsuranceTypeId = resp.CopyInsobj.MSPInsuranceTypeId || '';
                    $scope.PatientInsuranceObj.PayorTypeId = resp.CopyInsobj.PayorTypeId || '';
                    $scope.PatientInsuranceObj.AcceptAssign = resp.CopyInsobj.AcceptAssign || '';
                    $scope.PatientInsuranceObj.AssignBenifits = resp.CopyInsobj.AssignBenifits || '';
                    $scope.PatientInsuranceObj.RelationShipName = resp.CopyInsobj.RelationShipName || '';
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = resp.CopyInsobj.InsuredPersonFirstName || '';
                    $scope.PatientInsuranceObj.InsuredPersonLastName = resp.CopyInsobj.InsuredPersonLastName || '';
                    if (resp.CopyInsobj.InsuredPersonDOB != "") {
                        $scope.PatientInsuranceObj.InsuredPersonDOB = $filter('date')(resp.CopyInsobj.InsuredPersonDOB, "MM-dd-yyyy");
                    }
               
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = resp.CopyInsobj.InsuredPersonGenderID || '';
                    $scope.PatientInsuranceObj.InsuredPersonSSN = resp.CopyInsobj.InsuredPersonSSN || '';

                    $scope.PatientInsuranceObj.PatientFirstName = resp.CopyInsobj.PatientFirstName || '';
                    $scope.PatientInsuranceObj.PatientLastName = resp.CopyInsobj.PatientLastName || '';
                    $scope.PatientInsuranceObj.PatientSSN = resp.CopyInsobj.PatientSSN || '';
                    if (resp.CopyInsobj.PatientDOB != "") {
                        $scope.PatientInsuranceObj.PatientDOB = $filter('date')(resp.CopyInsobj.PatientDOB, "MM-dd-yyyy");
                    }

                    if (resp.CopyInsobj.OrganizationPayorName !== "") {
                        $scope.PatientInsuranceObj.IsCoverageEnabled = true;
                        $scope.PatientInsuranceObj.IsPolicyIdEnabled = true;
                        $scope.PatientInsuranceObj.IsGroupIdEnabled = true;
                    }


                }

            }, function () {

            });

        };

        $scope.ChangefutureCommunication = function (Ind) {
            if (!Ind) {
                $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "";
            }
        }

        $scope.smsemailauthorizetemplate = {
            templateUrl: 'smsemailauthorizetemplate.html',
        };

        $scope.aiCallsauthorizetemplate = {
            templateUrl: 'aiCallsauthorizetemplate.html',
        };

 }]);
"use strict";
eHnoteWebApp.controller("EditPatientInfoPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "Headers", "eHnoteMasterDataService", "PatientDetailsInfo", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "eHnoteMainAppointmentService", "eHnotePatientDataService", 'PatientInsuranceObj', 'SaveTypeObj', 'eHnoteUserDataService', 'eHnoteSettingsDataService', 'eHnotePatientAddressDataServices', 'Patobj', 'eHnoteAuditServices', 'eHnoteInsuranceService', 'DemographicInfo', 'FamilyInfo', 'eHnoteCacheStorageService', 'eHnoteDbStaticDataService', '$route', '$location', 'PatientAddressInfo','LogObj',
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, Headers, eHnoteMasterDataService, PatientDetailsInfo, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, eHnoteMainAppointmentService, eHnotePatientDataService, PatientInsuranceObj, SaveTypeObj, eHnoteUserDataService, eHnoteSettingsDataService, eHnotePatientAddressDataServices, Patobj, eHnoteAuditServices, eHnoteInsuranceService, DemographicInfo, FamilyInfo, eHnoteCacheStorageService, eHnoteDbStaticDataService, $route, $location, PatientAddressInfo, LogObj) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.CountryId = doctorinfo.doctordata.UserAddress[0].CountryId;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();

        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);
        $scope.MartialStatusList = angular.copy(mObj.masterMartialStatusList);
        $scope.BloodGroupList = angular.copy(mObj.masterBloodGroupList);
        
        $scope.PatientInsuranceSummary = [];
        $scope.GetHeaderInfo = function () {
            var obj = {
                "PatientHeader": false,
                "AddresHeader": false,
                "DemographicsHeader": false,
                "FamilyMemberHeader": false,
                "DesignatedHeader": false,
                "InsuranceHeader": false
            }
            return obj;
        }
        $scope.Headers = $scope.GetHeaderInfo();
        $scope.Headers = Headers || {};
        $scope.TagPatientObj = {
            "SelectTag": "Select Tag Patient",
            "PatientTag": "",
            "AllPatientTagsCheck": false,
        };
        
        $scope.PatientEthnicityList = Patobj.PatientEthnicityList || [];
        $scope.Allcountries = Patobj.Allcountries || [];
        $scope.PatientRaceList = Patobj.PatientRaceList || [];
        $scope.PatientLanguageList = Patobj.PatientLanguageList || [];
        $scope.PatientSexualOrientationList = Patobj.PatientSexualOrientationList || [];
        $scope.PatientLanguageExpressionList = Patobj.PatientLanguageExpressionList || [];
        $scope.PatientLanguageProficiencyList = Patobj.PatientLanguageProficiencyList || [];
        $scope.PatientGenderIdentityList = Patobj.PatientGenderIdentityList || [];
        $scope.InsuranceStatusList = Patobj.InsuranceStatusList || [];
        $scope.TitlesList = Patobj.TitlesList || [];
        $scope.Appointmentid = Patobj.Appointmentid;
        $scope.patientid = Patobj.patientid;
        $scope.PatientDisplayID = Patobj.PatientDisplayID;
        $scope.UserId = Patobj.UserId;
        $scope.SaveTypeObj = SaveTypeObj;
        $scope.IsCoomingFrom = Patobj.IsCoomingFrom;
        $scope.$route = $route;
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
        $scope.PatientAddressSummary = GetPatientAddress();
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
                "LGuardianFullname": ""
            }
            return obj;
        }
        $scope.DemographicInfo = GetDemographicInfo();
        $scope.DemographicSummary = GetDemographicInfo();

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
                "InsuredPersonDOB": "",
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
                "InsuredPersonMiddleName": "",
                "InsuredPersonLastName": "",
                "PatientFirstName": "",
                "PatientLastName": "",
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
                "InsuranceDeactiveDetailId": 0
            }
            return obj;
        }
        $scope.PatientInsuranceObj = GetInsuranceObj();

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
                "Gender": "Male",
                "MaritalStatusID": "",
                "MaritalStatusName": "",
                "BloodGroupObj": {},
                "BloodGroupName": "",
                "BloodGroupId": 0,
                "MobileNumber": "",
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
                "IsAllowAiAutomatedCalls":false
            }
            return obj;
        }
        $scope.maxdate = new Date();
        $scope.PatientDetailsInfo = GetPatientDetailsInfo();
        $scope.PatientDetailSummary = GetPatientDetailsInfo();

        if ($scope.IsCoomingFrom == 'PatientProfile') {
            $scope.DemographicInfo = DemographicInfo;
            $scope.PatientDetailsInfo = PatientDetailsInfo || {};
            $scope.PatientInsuranceObj = PatientInsuranceObj || {};
            $scope.PatientAddressInfo = PatientAddressInfo || {};
            $scope.LogObj = LogObj || {};
        }
       
        $scope.obj = {
            "IsEthnicitySelected": [],
            "IsRaceSelected": []
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

        $scope.Patientauthorized = [
            { "Id": 2, "Name": "Email" },
            { "Id": 4, "Name": "Not Authorized " },
            { "Id": 1, "Name": "SMS" },
            { "Id": 3, "Name": "SMS & Email" }
        ];

        $scope.newcaptureimage = function () {

             $scope.modelIntance = $uibModal.open({
                 "size": 'md',
                "templateUrl": 'loadNewpopup.html',
                "scope": $scope,
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "",
            });
        };
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
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
        $scope.getDate = function (Tmpfromdate, patientObj, tempObj) {
            if (Tmpfromdate != "") {
                $scope.BSMSind1 = true;
                $scope.PatientDetailsInfo.BSMSind = true;
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
            if (patientObj === "PatientDOB") {
                $scope.PatientDetailsInfo.ageinYears = ydiff.toString();
                $scope.PatientDetailsInfo.ageinMonths = mdiff.toString();
                $scope.PatientDetailsInfo.ageinDays = ddiff.toString();
                if ($scope.ageinMonths === "-1") {
                    $scope.ageinMonths = "";
                }
                var curAge = $scope.PatientDetailsInfo.ageinYears + '.' + $scope.PatientDetailsInfo.ageinMonths;
                $scope.PatientDetailsInfo.CurrentAge = curAge;
            }

            if (tempObj != undefined) {
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
        
        $scope.CloseEditPatientPopUp = function (tab) {
            $uibModalInstance.close(tab);
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
            $scope.SaveTypeObj.TypeName = "PatientDetails";
            $scope.RegisterPatientSave(type);

        };

        $scope.RegisterPatientSave = function (type, EditMode) {

            if ($scope.SaveTypeObj.TypeName === "PatientDetails") {
                $scope.Finalsubmit = "";
                $scope.ValidateIndictor = false;
                $scope.PatientSave(type);
            }
            else if ($scope.SaveTypeObj.TypeName === "AddressDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientAddressSave(type);
            }
            else if ($scope.SaveTypeObj.TypeName === "DemographicsDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientDemographicsSave(type);
            }
            else if ($scope.SaveTypeObj.TypeName === "FamilyDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientFamilySave(type);
            }
            else if ($scope.SaveTypeObj.TypeName === "DesignatedDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientDesignatedSave(type);
            }
            else if ($scope.SaveTypeObj.TypeName === "InsuranceDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientInsuranceDetailsSave(type, EditMode);
            }
            else {
                $scope.ValidateIndictor = false;
            }

        }

        $scope.PatientSave = function (type) {

            var FirstName = $scope.PatientDetailsInfo.FirstName;
            var LastName = $scope.PatientDetailsInfo.LastName;
            var MiddleName = $scope.PatientDetailsInfo.MiddleName || "";

            function isValidName(name) {
                const regex = /[a-zA-Z]/;
                return regex.test(name);
            }

            if ($scope.PatientDetailsInfo.FirstName === null || $scope.PatientDetailsInfo.FirstName === "" || $scope.PatientDetailsInfo.FirstName === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient First Name");
                return false;
            }
            if ($scope.PatientDetailsInfo.FirstName.length < 2) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter First Name Minimum 2 letters");
                return false;
            }

            if (!isValidName(FirstName)) {
                $scope.ValidateIndictor = true;
                alertify.error("Please enter at least one letter in the First Name.");
                return false;
            }

            if ($scope.PatientDetailsInfo.MiddleName != "") {
                if (!isValidName(MiddleName)) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please enter at least one letter in the Middle Name");
                    return false;
                }
            }
            $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName || "";
            if ($scope.PatientDetailsInfo.LastName === "") {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient Last Name");
                return false;
            }

            if (!isValidName(LastName)) {
                $scope.ValidateIndictor = true;
                alertify.error("Please enter at least one letter in the Last Name.");
                return false;
            }

            if ($scope.IsSecondLastNameMandatory) {
                $scope.PatientDetailsInfo.SecondLastName = $scope.PatientDetailsInfo.SecondLastName || "";
                if ($scope.PatientDetailsInfo.SecondLastName === "") {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Second Last Name");
                    return false;
                }
            }
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
            if ($scope.PatientDetailsInfo.DOB === null || $scope.PatientDetailsInfo.DOB === "" || $scope.PatientDetailsInfo.DOB === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient DOB");
                return false;
            }
            if ($scope.PatientDetailsInfo.DateOfDeath === "") {
                $scope.PatientDetailsInfo.DateOfDeath = null;
            }
            if ($scope.PatientDetailsInfo.ageinYears === null || $scope.PatientDetailsInfo.ageinYears === "" || $scope.PatientDetailsInfo.ageinYears === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Age");
                return false;
            }
            if ($scope.PatientDetailsInfo.Gender === null || $scope.PatientDetailsInfo.Gender === "" || $scope.PatientDetailsInfo.Gender === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient Gender");
                return false;
            }

            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '';
            if ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode == '' || ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode.toString()).length < 2) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Area Code");
                return false;
            }
            var HomeAreaCode = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode) || "";
            if ((HomeAreaCode.toString()).length < 3) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Area Code minimum 3 characters");
                return false;
            }

            console.log($scope.PatientDetailsInfo.DisplayMobileNumber + "__DisplayMobileNumber");
            var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeNumber) || "";
            if ((MobileNumber.toString()).length != 7) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }

            $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode || '';
            if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode != '' || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber != '') {
                if (($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode.toString()).length < 2) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Area Code");
                    return false;
                }
            }

            var Contactnumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.OfficeNumber) || "";
            if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode != '' || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber != '') {
                if ((Contactnumber.toString()).length != 7) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Mobile Number");
                    return false;
                }
            }


            var SSNno = angular.copy($scope.PatientDetailsInfo.SocialSecurityNo) || "";
            SSNno = SSNno.toString();
            if (SSNno != "" && SSNno.length !== "" && SSNno.length < 4) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid SSN Number");
                return false;
            }

            if ($scope.PatientDetailsInfo.ContactInfo.EmailID == undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Email ID");
                return false;
            }

            $scope.PatientDetailsInfo.EmployerPhoneNo = $scope.PatientDetailsInfo.EmployerPhoneNo || "";
            if ($scope.PatientDetailsInfo.EmployerPhoneNo != "") {
                if ($scope.PatientDetailsInfo.EmployerPhoneNo.length < 14) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Valid Office Mobile Number");
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
            var param = {
                "UserId": $scope.PatientDetailsInfo.UserId,
                "HospitalId": $scope.PatientDetailsInfo.HospitalId,
                "PatientId": $scope.PatientDetailsInfo.PatientID || 0,
                "TitleId": $scope.PatientDetailsInfo.TitleId || 0,
                "FirstName": $scope.PatientDetailsInfo.FirstName,
                "MiddleName": $scope.PatientDetailsInfo.MiddleName,
                "LastName": $scope.PatientDetailsInfo.LastName,
                "SecondLastName": $scope.PatientDetailsInfo.SecondLastName,
                "PreviousName": $scope.PatientDetailsInfo.PreviousName,
                "DOB": $filter("date")(new Date($scope.PatientDetailsInfo.DOB), "yyyy-MM-dd") || "",
                "Age": $scope.ageinYears,
                "SSN": $scope.PatientDetailsInfo.SocialSecurityNo,
                "Gender": $scope.PatientDetailsInfo.Gender,
                "PatientTagId": ($scope.PatientDetailsInfo.PatientTagId == 0 || $scope.PatientDetailsInfo.PatientTagId == null) ? null : $scope.PatientDetailsInfo.PatientTagId,
                "MaritalStatusId": $scope.PatientDetailsInfo.MaritalStatusID || null,
                "BloodGroupId": $scope.PatientDetailsInfo.BloodGroupId !== 0 ? $scope.PatientDetailsInfo.BloodGroupId : null,
                "CountryCode": $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode,
                "MobileNumber": $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber,
                "AreaCode": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode,
                "ContactNumber": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber,
                "LeadSourceInd": "N",
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
                "IsAllowAiAutomatedCalls": $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls || false,
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
            };
            param.MobileNo = param.MobileNo.concat(param.HomeCountryCode, param.HomeAreaCode, param.HomeNumber) || "";
            param.ContactNo = param.ContactNo.concat(param.OfficeCountryCode, param.OfficeAreaCode, param.OfficeNumber) || "";

            var picdetails = {
                "patientProfilePicDetails": ""
            };
            if ($scope.PatientDetailsInfo.PatientProfilePicDetails != undefined && $scope.PatientDetailsInfo.PatientProfilePicDetails.length > 0) {
                picdetails.patientProfilePicDetails = $scope.PatientDetailsInfo.PatientProfilePicDetails;
            }

            eHnotePatientDataService.USRegisterPatient(param, picdetails, OnAddPatientSuccess1, OnAddPatientError1);
        }
        function OnAddPatientSuccess1(resp) {
            if (resp.status === "success") {
                var response = resp;
                $scope.patientid = resp.PatientId;
                $scope.PatientDetailsInfo.PatientID = $scope.patientid;
                $scope.PatientDetailSummary.PatientID = $scope.patientid;
                $scope.PatientDetailSummary = GetPatientDetailsInfo();

                $scope.PatientDetailSummary.PatientID = response.PatientId;
                if (response.TitleId != null && response.TitleId != '') {
                    var filtertitle = $filter("filter")($scope.TitlesList, { "Id": response.TitleId }, true) || [];
                    if (filtertitle.length > 0) {
                        $scope.PatientDetailSummary.Title = filtertitle[0].Name;
                        $scope.PatientDetailSummary.TitleId = filtertitle[0].Id;
                    }
                }
                $scope.PatientDetailSummary.OccupationId = response.OccupationId;
                $scope.PatientDetailSummary.OccupationDescription = response.OccupationDescription;
                $scope.PatientDetailSummary.EmployerPhoneNo = response.EmployerPhoneNo;
                $scope.PatientDetailSummary.EmergencyContactName = response.EmergencyContactName;
                $scope.PatientDetailSummary.EmeregecyContactNo = response.EmeregecyContactNo;


                $scope.PatientDetailSummary.FirstName = response.FirstName;
                $scope.PatientDetailSummary.MiddleName = response.MiddleName || '';
                $scope.PatientDetailSummary.LastName = response.LastName;
                $scope.PatientDetailSummary.SecondLastName = response.SecondLastName;

                $scope.PatientDetailSummary.FatherName = response.FatherName;
                $scope.PatientDetailSummary.MotherName = response.MotherName;
                $scope.PatientDetailSummary.Guardian = response.Guardian;
                $scope.PatientDetailSummary.Employer = response.Employer;

                $scope.PatientDetailSummary.IsNoChargePatient = response.IsNoChargePatient || false;
                $scope.PatientDetailSummary.IsDiseased = response.IsDiseased || false;
                $scope.PatientDetailSummary.DateOfDeath = response.DateOfDeath;
                $scope.PatientDetailSummary.CauseOfDeath = response.CauseOfDeath || "";

                if (response.DOB != "") {
                    $scope.PatientDetailSummary.DOB = $filter('date')(response.DOB, "MM-dd-yyyy");
                }

                $scope.PatientDetailSummary.SocialSecurityNo = response.SSN || "";

                $scope.PatientDetailSummary.Gender = response.Gender || "";

                if (response.MaritalStatus != "") {
                    var MaritalStatusId = parseInt(response.MaritalStatus) || '';
                    $scope.PatientDetailSummary.MaritalStatusID = MaritalStatusId;
                    var filterStatus = $filter("filter")($scope.MartialStatusList, { "Id": MaritalStatusId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailSummary.MaritalStatusName = filterStatus[0].MaritalStatus;
                    }
                }

                $scope.PatientDetailSummary.ContactInfo.HomeCountryCode = response.HomeCountryCode != '' ? response.HomeCountryCode : '';
                $scope.PatientDetailSummary.ContactInfo.HomeAreaCode = response.HomeAreaCode || '';
                $scope.PatientDetailSummary.ContactInfo.HomeNumber = response.HomeNumber || '';
                $scope.PatientDetailSummary.ContactInfo.MobileNumber = response.MobileNumber || '';


                $scope.MNumber = response.HomeAreaCode + response.HomeNumber
                if ($scope.MNumber.length > 0) {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.MNumber);
                    $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
                }




                $scope.PatientDetailSummary.ContactInfo.OfficeCountryCode = response.OfficeCountryCode != '' ? response.OfficeCountryCode : '';
                $scope.PatientDetailSummary.ContactInfo.OfficeAreaCode = response.OfficeAreaCode || "";
                $scope.PatientDetailSummary.ContactInfo.OfficeNumber = response.OfficeNumber || "";
                $scope.PatientDetailSummary.ContactInfo.ContactNumber = response.ContactNumber || "";

                $scope.ONumber = response.OfficeAreaCode + response.OfficeNumber;
                if ($scope.ONumber.length > 0) {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.ONumber);
                    $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;
                }


                $scope.PatientDetailSummary.ContactInfo.EmailID = response.EmailId || "";
                if (response.BloodGroupId != 0 && response.BloodGroupId != "") {
                    var filterStatus = $filter("filter")($scope.BloodGroupList, { "Id": response.BloodGroupId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailSummary.BloodGroupName = filterStatus[0].BloodGroupName;
                        $scope.PatientDetailSummary.BloodGroupId = filterStatus[0].Id;
                        $scope.PatientDetailSummary.BloodGroupObj = filterStatus[0];
                    }
                }
                if (response.PatientTagId != "" && response.PatientTagId != 0 && response.PatientTagId != null) {
                    var filterStatus = [];
                    var PatientTagId = parseInt(response.PatientTagId) || 0;
                    $scope.PatientDetailSummary.PatientTagId = PatientTagId;
                    filterStatus = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": PatientTagId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailSummary.PatientTagName = filterStatus[0].HospitalEquipmentName;
                    }
                }

                if (response.PatientTagList.length > 0) {
                    $scope.PatientDetailSummary.PatientTagList = angular.copy(response.PatientTagList);
                    $scope.PatientDetailsInfo.PatientTagList = angular.copy(response.PatientTagList);
                }
                $scope.PatientDetailSummary.DisplayMobileNumber = $scope.PatientMobileNumber || "";
                $scope.PatientDetailSummary.DisplayAlternateNumber = $scope.PatientOfficeNumber || "";
                $scope.PatientDetailsInfo.MobileNo = $scope.PatientMobileNumber || '';
                $scope.PatientDetailSummary.Age = response.Age;
                $scope.PatientDetailSummary.PatientDisplayID = response.PatientDisplayId;
                $scope.PatientDetailSummary.FullName = response.FullName;
                $scope.PatientDetailSummary.S3URL = response.S3URL || "";

                $scope.PatientDetailSummary.AgeInDays = response.AgeInDays || "";
                $scope.PatientDetailSummary.AgeInMonths = response.AgeInMonths || "";
                $scope.PatientDetailSummary.AgeInYears = response.AgeInYears || "";

                $scope.PatientDetailSummary.ContactInfo.IsPatientSmsInd = response.IsPatientSmsInd || false;
                $scope.PatientDetailSummary.ContactInfo.IsPatientEmailInd = response.IsPatientEmailInd || false;
                $scope.PatientDetailSummary.ContactInfo.AuthorizationId = "";

                if ($scope.PatientDetailSummary.ContactInfo.IsPatientSmsInd && !$scope.PatientDetailSummary.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailSummary.ContactInfo.AuthorizationId = 1;
                }
                else if (!$scope.PatientDetailSummary.ContactInfo.IsPatientSmsInd && $scope.PatientDetailSummary.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailSummary.ContactInfo.AuthorizationId = 2;
                }
                else if ($scope.PatientDetailSummary.ContactInfo.IsPatientSmsInd && $scope.PatientDetailSummary.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailSummary.ContactInfo.AuthorizationId = 3;
                }
                else if (!$scope.PatientDetailSummary.ContactInfo.IsPatientSmsInd && !$scope.PatientDetailSummary.ContactInfo.IsPatientEmailInd) {
                    $scope.PatientDetailSummary.ContactInfo.AuthorizationId = 4;
                }

                $scope.PatientDetailSummary.CreatedBy = resp.CreatedBy;
                $scope.PatientDetailSummary.CreatedDt = $filter('date')(new Date(resp.CreatedDt), 'MM-dd-yyyy,hh:mm a');
                $scope.PatientDetailSummary.ModifiedBy = resp.ModifiedBy;
                $scope.PatientDetailSummary.ModifiedDt = $filter('date')(new Date(resp.ModifiedDt), 'MM-dd-yyyy,hh:mm a');

                // Insurance

                $scope.PatientInsuranceObj = GetInsuranceObj();
                if ($scope.PatientInsuranceObj.RelationShipId == 1) {
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = $scope.PatientDetailSummary.FirstName;
                    $scope.PatientInsuranceObj.InsuredPersonDOB = $scope.PatientDetailSummary.DOB;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = "";
                    $scope.PatientInsuranceObj.InsuredPersonSSN = "";
                    $scope.PatientInsuranceObj.InsuredPersonMiddleName = $scope.PatientDetailSummary.MiddleName;
                    $scope.PatientInsuranceObj.InsuredPersonLastName = $scope.PatientDetailSummary.LastName;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = $scope.PatientDetailSummary.Gender == "Male" ? 'M' : 'F';
                }
                $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientDetailSummary.FirstName;
                $scope.PatientInsuranceObj.PatientLastName = $scope.PatientDetailSummary.LastName;
                $scope.PatientInsuranceObj.PatientDOB = $scope.PatientDetailSummary.DOB;
                $scope.PatientInsuranceObj.PatientSSN = $scope.PatientDetailSummary.SocialSecurityNo;
                $scope.PatientInsuranceObj.IsIdentifier = false;
                $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientDetailSummary.IsInsuranceConnectedAppointment;


                if ($scope.Finalsubmit === "Final") {
                    $scope.Registeraddpopup = true;
                    //$scope.cacheValuesBookAppointment();
                    //return false;
                    //$scope.SelectPatient($scope.patientid);
                    //$scope.CloseEditPatientPopUp();
                    $uibModalInstance.close();
                }
                if ($scope.PatientDetailSummary.S3URL != '') {
                    $scope.toDataURL($scope.PatientDetailSummary.S3URL, function (dataURL) {
                        $scope.PatientProfileImageBase64 = dataURL;
                    });
                } else {
                    $scope.PatientProfileImageBase64 = "";
                }

                $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
                function getnewRcopiaPatientObj() {
                    var obj = {
                        "FirstName": "",
                        "LastName": "",
                        "ExternalID": "",
                        "MiddleName": "",
                        "DeleteInd": "n",
                        "RcopiaPatientId": $scope.selectedPatientData.Patient[0].RcopiaPatientId || 0,
                        "DOB": "",
                        "Sex": "",
                        "HomePhone": "",
                        "Address1": "",
                        "Address2": "",
                        "City": "",
                        "State": "",
                        "Zip": "",
                        "Suffix": "",
                        "Prefix": "",
                        "EmailId": "",
                        "Race": "",
                        "Ethnicity": "",
                        "PreferredLanguage": "",
                        "MobilePhone": ""
                    };
                    return obj;
                }

                $scope.selectedPatientData.Patient[0].RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || '';
                if ($scope.selectedPatientData.Patient[0].RcopiaPatientId != '') {
                    $scope.addUpdatePatientToRcopiaReqObj = {
                        "UserId": $scope.UserId,
                        "AppointmentId": $scope.Appointmentid,
                        "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                        "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                        "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                        "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
                        "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
                        "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
                        "PatientList": []
                    };

                    $scope.addUpdatePatientToRcopiaReqObj.PatientList = [];
                    $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
                    $scope.RcopiaPatientObj.FirstName = $scope.PatientDetailsInfo.FirstName;
                    $scope.RcopiaPatientObj.LastName = $scope.PatientDetailsInfo.LastName || "";
                    $scope.RcopiaPatientObj.MiddleName = $scope.PatientDetailsInfo.MiddleName || "";
                    $scope.RcopiaPatientObj.ExternalID = $scope.PatientDetailsInfo.PatientID;
                    $scope.RcopiaPatientObj.RcopiaPatientId = $scope.PatientDetailsInfo.RcopiaPatientId || "";
                    $scope.RcopiaPatientObj.EmailId = $scope.PatientDetailsInfo.EmailId;
                    //$scope.RcopiaPatientObj.DOB = $filter('date')($scope.PatientDetailsInfo.DOB, "MM/dd/yyyy");

                    var dateComponents = $scope.PatientDetailsInfo.DOB.split('-') || '';
                    var convertedDate = dateComponents.join('/') || '';
                    $scope.RcopiaPatientObj.DOB = convertedDate || '';


                    var cGender = "M";
                    if ($scope.PatientDetailsInfo.Gender == 'Female') {
                        cGender = "F";
                    };
                    if ($scope.PatientDetailsInfo.Gender == "Unknown" || $scope.PatientDetailsInfo.Gender == "Prefer not to tell") {
                        cGender = "U";
                    };


                    if ($scope.PatientDetailsInfo.IsDiseased) {
                        $scope.RcopiaPatientObj.DeleteInd = "y";
                    } else {
                        $scope.RcopiaPatientObj.DeleteInd = "n";
                    }

                    $scope.RcopiaPatientObj.Sex = cGender;
                    $scope.RcopiaPatientObj.MobilePhone = $scope.PatientDetailsInfo.MobileNo;
                    $scope.RcopiaPatientObj.HomePhone = $scope.PatientDetailsInfo.DisplayAlternateNumber;


                    if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == '' && $scope.PatientAddressInfo.PostalAddress.AddressLine2 == '') {
                        $scope.RcopiaPatientObj.Address1 = "Unknown";
                    } else {
                        $scope.RcopiaPatientObj.Address1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1;
                        $scope.RcopiaPatientObj.Address2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2;
                    }
                    $scope.RcopiaPatientObj.City = $scope.PatientAddressInfo.PostalAddress.CityName;
                    $scope.RcopiaPatientObj.State = $scope.PatientAddressInfo.PostalAddress.StateCode;
                    $scope.RcopiaPatientObj.Zip = $scope.PatientAddressInfo.PostalAddress.ZipCode;


                    if ($scope.PatientDetailsInfo.AdditionalInfo != undefined) {
                        $scope.RcopiaPatientObj.Ethnicity = $scope.PatientDetailsInfo.AdditionalInfo.EthnicityName;
                        $scope.RcopiaPatientObj.Race = $scope.PatientDetailsInfo.AdditionalInfo.RaceName;
                        $scope.RcopiaPatientObj.PreferredLanguage = $scope.PatientDetailsInfo.AdditionalInfo.LanguageName;
                    }

                    $scope.addUpdatePatientToRcopiaReqObj.PatientList.push($scope.RcopiaPatientObj);


                    eHnoteDiagnosisDataServices.addPatientToRcopia($scope.addUpdatePatientToRcopiaReqObj).then(function (response) {

                        console.log(JSON.stringify(response));

                        if (response.data.status === 'Success') {
                            if (response.data.rows.length > 0) {
                                $scope.RcopiaPatientObj.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                                $scope.selectedPatientData.Patient[0].RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                            }
                        };
                    });
                }

                if ($scope.Finalsubmit === "AddPatient") {
                    $scope.getPatientCaseHistoryItem($scope.PatientDetailSummary);
                    $uibModalInstance.close();
                }
            }
        }
        function OnAddPatientError1(err) {
            console.log(err);
            alertify.error(err);
        }

        $scope.PatientSaveAndNext = function () {
            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '';
            if ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode == '' || ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode.toString()).length < 2) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Area Code");
                return false;
            }
            var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeNumber) || "";
            if ((MobileNumber.toString()).length != 7) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }
            var DisplayContactnumber = angular.copy($scope.PatientDetailsInfo.DisplayMobileNumber) || "";
            if ($scope.PatientDetailsInfo.DisplayMobileNumber != '' || $scope.PatientDetailsInfo.DisplayMobileNumber != '') {
                if ((DisplayContactnumber.toString()).length < 14) {
                    alertify.error("Please Enter Valid Mobile Number");
                    return false;
                }
            }

            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.AddresHeader = true;
                $scope.SaveTypeObj.TypeName = 'AddressDetails';

                $scope.PatientAddressInfo = angular.copy($scope.PatientAddressSummary);
            }
            if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == '' && $scope.PatientAddressInfo.PostalAddress.AddressLine2 == '' && $scope.PatientAddressInfo.PostalAddress.ZipCode == '' && $scope.PatientAddressInfo.PostalAddress.CityName == '' && $scope.PatientAddressInfo.PostalAddress.CountryName == '' && $scope.PatientAddressInfo.PostalAddress.CountyName == '' && $scope.PatientAddressInfo.PostalAddress.StateName == '') {
                $scope.PatientAddressInfo.IsCheckCopy = false;
            } else {
                $scope.PatientAddressInfo.IsCheckCopy = true;
            }
        };

        $scope.clearHeaderInfo = function () {
            $scope.Headers = $scope.GetHeaderInfo();
        };

        $scope.PatientAddressSave = function (type) {
            
            $scope.LogObj.LogArray = [];

            //if ($scope.PatientAddressInfo.PermanentAddress.CountryId !== 0 || $scope.PatientAddressInfo.PermanentAddress.CountryId == 0) {
            //    $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.CountryId;
            //}
            //if ($scope.PatientAddressInfo.PostalAddress.CountryId !== 0 || $scope.PatientAddressInfo.PostalAddress.CountryId == 0) {
            //    $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.CountryId;
            //}
            $scope.PatientAddressInfo.PermanentAddress.AddressLine1 = $scope.PatientAddressInfo.PermanentAddress.AddressLine1 || "";
            $scope.PatientAddressInfo.PermanentAddress.AddressLine2 = $scope.PatientAddressInfo.PermanentAddress.AddressLine2 || "";
            $scope.PatientAddressInfo.PermanentAddress.ZipCode = $scope.PatientAddressInfo.PermanentAddress.ZipCode || null;
            $scope.PatientAddressInfo.PermanentAddress.CountyId = $scope.PatientAddressInfo.PermanentAddress.CountyId || null;
            $scope.PatientAddressInfo.PermanentAddress.CityId = $scope.PatientAddressInfo.PermanentAddress.CityId || null;
            $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.PatientAddressInfo.PermanentAddress.StateId || null;
            $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.PatientAddressInfo.PermanentAddress.CountryId || null;
            $scope.PatientAddressInfo.PostalAddress.AddressLine1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1 || "";
            $scope.PatientAddressInfo.PostalAddress.AddressLine2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2 || "";
            $scope.PatientAddressInfo.PostalAddress.ZipCode = $scope.PatientAddressInfo.PostalAddress.ZipCode || null;
            $scope.PatientAddressInfo.PostalAddress.CountyId = $scope.PatientAddressInfo.PostalAddress.CountyId || null;
            $scope.PatientAddressInfo.PostalAddress.CityId = $scope.PatientAddressInfo.PostalAddress.CityId || null;
            $scope.PatientAddressInfo.PostalAddress.StateId = $scope.PatientAddressInfo.PostalAddress.StateId || null;
            $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.PatientAddressInfo.PostalAddress.CountryId || null;

            $scope.PatientAddressInfo.PostalAddress.ZipCode = $scope.PatientAddressInfo.PostalAddress.ZipCode || null;
            if (type !== "Final") {
                if ($scope.PatientAddressInfo.PostalAddress.ZipCode == '' || $scope.PatientAddressInfo.PostalAddress.ZipCode == null || $scope.PatientAddressInfo.PostalAddress.ZipCode == 0) {
                    alertify.error("Please Enter Zip Code");
                    return false;
                }
            }
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
                    /*$scope.Registeraddpopup = true;*/
                    /*$scope.cacheValuesBookAppointment();*/
                    $scope.CloseEditPatientPopUp();
                }
                return false;
            }
            var TempAddress = {
                "PatientId": $scope.patientid,
                "PatientDisplayID": $scope.PatientDisplayID,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AddressDetailsInfo": $scope.PatientAddressInfo,
                "FullName": $scope.PatientDetailsInfo.FirstName + $scope.PatientDetailsInfo.MiddleName + $scope.PatientDetailsInfo.LastName + $scope.PatientDetailsInfo.SecondLastName || "",
                /*"AddressDetailsInfo": angular.copy($scope.PatientAddressInfo)*/
            "Logs": {},

            }

            if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 != '' || $scope.LogObj.PostalAddressLine1 != '' || $scope.PatientAddressInfo.PostalAddress.AddressLine2 != '' || $scope.LogObj.PostalAddressLine2 != '' || $scope.PatientAddressInfo.PostalAddress.CityName != '' || $scope.LogObj.PostalCityName != '' || $scope.PatientAddressInfo.PostalAddress.CountryName != '' || $scope.LogObj.PostalCountryName != '' || $scope.PatientAddressInfo.PostalAddress.StateName != '' || $scope.LogObj.PostalStateName != '' || $scope.PatientAddressInfo.PostalAddress.ZipCode != '' || $scope.LogObj.PostalZipCode != '' || $scope.PatientAddressInfo.PostalAddress.PostalCountyName != '' || $scope.LogObj.PostalCountyName != '' || $scope.PatientAddressInfo.PermanentAddress.AddressLine1 != '' || $scope.LogObj.PerminantAddressLine1 != '' || $scope.PatientAddressInfo.PermanentAddress.AddressLine2 != '' || $scope.LogObj.PerminantAddressLine2 != '' || $scope.PatientAddressInfo.PermanentAddress.CityName != '' || $scope.LogObj.PerminantCityName != '' || $scope.PatientAddressInfo.PermanentAddress.CountryName != '' || $scope.LogObj.PerminantCountryName != '' || $scope.PatientAddressInfo.PermanentAddress.StateName != '' || $scope.LogObj.PerminantStateName != '' || $scope.PatientAddressInfo.PermanentAddress.ZipCode != '' || $scope.LogObj.PerminantZipCode != '' || $scope.PatientAddressInfo.PermanentAddress.PerminantCountyName != '' || $scope.LogObj.PerminantCountyName != '') {
                let ActionType = '', count = 0, ScreenType = '';
                if (appointmentinfo.AppointmentType == 'ASC') {
                    ScreenType = 'ASC List';
                }
                else {
                    ScreenType = 'Pre-Admission';
                }


                if ($scope.LogObj.PostalAddressLine1 == '' && $scope.LogObj.PostalAddressLine2 == '' && $scope.LogObj.PostalCityName == '' && $scope.LogObj.PostalCountryName == '' && $scope.LogObj.PostalStateName == '' && $scope.LogObj.PostalZipCode == '' && $scope.LogObj.PostalCountyName == '' && $scope.LogObj.PerminantAddressLine1 == '' && $scope.LogObj.PerminantAddressLine2 == '' && $scope.LogObj.PerminantCityName == '' && $scope.LogObj.PerminantCountryName == '' && $scope.LogObj.PerminantStateName == '' && $scope.LogObj.PerminantZipCode == '' && $scope.LogObj.PerminantCountyName == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                if (($scope.PatientAddressInfo.PostalAddress.AddressLine1 != $scope.LogObj.PostalAddressLine1) || ($scope.PatientAddressInfo.PostalAddress.AddressLine2 != $scope.LogObj.PostalAddressLine2) || ($scope.PatientAddressInfo.PostalAddress.CityName != $scope.LogObj.PostalCityName) || ($scope.PatientAddressInfo.PostalAddress.CountryName != $scope.LogObj.PostalCountryName) || ($scope.PatientAddressInfo.PostalAddress.StateName != $scope.LogObj.PostalStateName) || ($scope.PatientAddressInfo.PostalAddress.ZipCode != $scope.LogObj.PostalZipCode) || ($scope.PatientAddressInfo.PostalAddress.PostalCountyName || $scope.LogObj.PostalCountyName) || ($scope.PatientAddressInfo.PermanentAddress.AddressLine1 != $scope.LogObj.PerminantAddressLine1) || ($scope.PatientAddressInfo.PermanentAddress.AddressLine2 != $scope.LogObj.PerminantAddressLine2) || ($scope.PatientAddressInfo.PermanentAddress.CityName != $scope.LogObj.PerminantCityName) || ($scope.PatientAddressInfo.PermanentAddress.CountryName != $scope.LogObj.PerminantCountryName) || ($scope.PatientAddressInfo.PermanentAddress.CountyName != $scope.LogObj.PerminantCountyName)) {
                    count++;
                }
                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 10,
                        "SubModuleName": "Profile",
                        "ScreenType": ScreenType,
                        "ActionType": ActionType,
                        //"ActionDescription": "Address in profile screen from " + ScreenType,
                        "ActionDescription": `Address in profile screen from  ${ScreenType}  For Appointment ID: ${appointmentinfo.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                TempAddress.Logs = $scope.LogObj || {};
            }

            eHnotePatientDataService.AppUpdatePatientAddressDetails(TempAddress, $scope.tempAddressDocsArray, callbackSuccess1, callbackError1);

            function callbackSuccess1(resp) {
                if (resp.Status == "Success") {
                    var PermanentResponseList = resp.PermanentAddress;
                    var PostalResponseList = resp.PostalAddress;
                    $scope.PatientAddressSummary.PermanentAddress.AddressLine1 = PermanentResponseList.AddressLine1 || "";
                    $scope.PatientAddressSummary.PermanentAddress.AddressLine2 = PermanentResponseList.AddressLine2 || "";
                    $scope.PatientAddressSummary.PermanentAddress.CityId = PermanentResponseList.CityId;
                    $scope.PatientAddressSummary.PermanentAddress.CityName = PermanentResponseList.CityName || "";
                    $scope.PatientAddressSummary.PermanentAddress.CountryId = PermanentResponseList.CountryId;
                    $scope.PatientAddressSummary.PermanentAddress.CountryName = PermanentResponseList.CountryName || "";
                    $scope.PatientAddressSummary.PermanentAddress.StateId = PermanentResponseList.StateId;
                    $scope.PatientAddressSummary.PermanentAddress.StateName = PermanentResponseList.StateName || "";
                    $scope.PatientAddressSummary.PermanentAddress.ZipCode = PermanentResponseList.ZipCode || "";
                    $scope.PatientAddressSummary.PermanentAddress.CountyName = PermanentResponseList.CountyName || "";
                    $scope.PatientAddressSummary.PermanentAddress.CountyId = PermanentResponseList.CountyId;

                    $scope.PatientAddressSummary.PostalAddress.AddressLine1 = PostalResponseList.AddressLine1 || "";
                    $scope.PatientAddressSummary.PostalAddress.AddressLine2 = PostalResponseList.AddressLine2 || "";
                    $scope.PatientAddressSummary.PostalAddress.CityId = PostalResponseList.CityId;
                    $scope.PatientAddressSummary.PostalAddress.CityName = PostalResponseList.CityName || "";
                    $scope.PatientAddressSummary.PostalAddress.CountryId = PostalResponseList.CountryId;
                    $scope.PatientAddressSummary.PostalAddress.CountryName = PostalResponseList.CountryName || "";
                    $scope.PatientAddressSummary.PostalAddress.StateId = PostalResponseList.StateId;
                    $scope.PatientAddressSummary.PostalAddress.StateName = PostalResponseList.StateName || "";
                    $scope.PatientAddressSummary.PostalAddress.ZipCode = PostalResponseList.ZipCode || "";
                    $scope.PatientAddressSummary.PostalAddress.CountyName = PostalResponseList.CountyName || "";
                    $scope.PatientAddressSummary.PostalAddress.CountyId = PostalResponseList.CountyId;

                    $scope.PatientAddressSummary.PatientAddressDocuments = resp.PatientAddressDocuments || [];

                    $scope.PatientAddressInfo.PermanentAddress.AddressId = PermanentResponseList.AddressId;
                    $scope.PatientAddressInfo.PostalAddress.AddressId = PostalResponseList.AddressId;
                    $scope.PatientAddressInfo.PermanentAddress.StateCode = PermanentResponseList.StateCode;
                    $scope.PatientAddressInfo.PostalAddress.StateCode = PostalResponseList.StateCode;

                    $scope.LogObj.PerminantAddressLine1 = PermanentResponseList.AddressLine1 || "";
                    $scope.LogObj.PerminantAddressLine2 = PermanentResponseList.AddressLine2 || "";
                    $scope.LogObj.PerminantCityId = PermanentResponseList.CityId || "";
                    $scope.LogObj.PerminantCityName = PermanentResponseList.CityName || "";
                    $scope.LogObj.PerminantCountryName = PermanentResponseList.CountryName || "";
                    $scope.LogObj.PerminantStateName = PermanentResponseList.StateName || "";
                    $scope.LogObj.PerminantZipCode = PermanentResponseList.ZipCode || "";
                    $scope.LogObj.PerminantCountyName = PermanentResponseList.CountyName || "";

                    $scope.LogObj.PostalAddressLine1 = PostalResponseList.AddressLine1 || "";
                    $scope.LogObj.PostalAddressLine2 = PostalResponseList.AddressLine2 || "";
                    $scope.LogObj.PostalCityName = PostalResponseList.CityName || "";
                    $scope.LogObj.PostalCountryName = PostalResponseList.CountryName || "";
                    $scope.LogObj.PostalStateName = PostalResponseList.StateName || "";
                    $scope.LogObj.PostalZipCode = PostalResponseList.ZipCode || "";
                    $scope.LogObj.PostalCountyName = PostalResponseList.CountyName || "";


                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.CloseEditPatientPopUp();
                        //$scope.cacheValuesBookAppointment();
                        //return false;
                        /*$scope.SelectPatient($scope.patientid);*/
                    }
                    $scope.tempAddressDocsArray = [];

                    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
                    function getnewRcopiaPatientObj() {
                        var obj = {
                            "FirstName": "",
                            "LastName": "",
                            "ExternalID": "",
                            "MiddleName": "",
                            "DeleteInd": "n",
                            "RcopiaPatientId": $scope.selectedPatientData.Patient[0].RcopiaPatientId || 0,
                            "DOB": "",
                            "Sex": "",
                            "HomePhone": "",
                            "Address1": "",
                            "Address2": "",
                            "City": "",
                            "State": "",
                            "Zip": "",
                            "Suffix": "",
                            "Prefix": "",
                            "EmailId": "",
                            "Race": "",
                            "Ethnicity": "",
                            "PreferredLanguage": "",
                            "MobilePhone": ""
                        };
                        return obj;
                    }

                    $scope.selectedPatientData.Patient[0].RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || '';
                    if ($scope.selectedPatientData.Patient[0].RcopiaPatientId != '') {
                        $scope.addUpdatePatientToRcopiaReqObj = {
                            "UserId": $scope.UserId,
                            "AppointmentId": $scope.Appointmentid,
                            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
                            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
                            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
                            "PatientList": []
                        };

                        $scope.addUpdatePatientToRcopiaReqObj.PatientList = [];
                        $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
                        $scope.RcopiaPatientObj.FirstName = $scope.PatientDetailsInfo.FirstName;
                        $scope.RcopiaPatientObj.LastName = $scope.PatientDetailsInfo.LastName || "";
                        $scope.RcopiaPatientObj.MiddleName = $scope.PatientDetailsInfo.MiddleName || "";
                        $scope.RcopiaPatientObj.ExternalID = $scope.PatientDetailsInfo.PatientID;
                        $scope.RcopiaPatientObj.RcopiaPatientId = $scope.PatientDetailsInfo.RcopiaPatientId || "";
                        $scope.RcopiaPatientObj.EmailId = $scope.PatientDetailsInfo.EmailId;
                        /*  $scope.RcopiaPatientObj.DOB = $filter('date')($scope.PatientDetailsInfo.DOB, "MM/dd/yyyy");*/


                        var dateComponents = $scope.PatientDetailsInfo.DOB.split('-') || '';
                        var convertedDate = dateComponents.join('/') || '';
                        $scope.RcopiaPatientObj.DOB = convertedDate || '';

                        var cGender = "M";
                        if ($scope.PatientDetailsInfo.Gender == 'Female') {
                            cGender = "F";
                        };
                        if ($scope.PatientDetailsInfo.Gender == "Unknown" || $scope.PatientDetailsInfo.Gender == "Prefer not to tell") {
                            cGender = "U";
                        };


                        if ($scope.PatientDetailsInfo.IsDiseased) {
                            $scope.RcopiaPatientObj.DeleteInd = "y";
                        } else {
                            $scope.RcopiaPatientObj.DeleteInd = "n";
                        }

                        $scope.RcopiaPatientObj.Sex = cGender;


                        $scope.RcopiaPatientObj.MobilePhone = $scope.PatientDetailsInfo.MobileNo;
                        $scope.RcopiaPatientObj.HomePhone = $scope.PatientDetailsInfo.DisplayAlternateNumber;

                        if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == '' && $scope.PatientAddressInfo.PostalAddress.AddressLine2 == '') {
                            $scope.RcopiaPatientObj.Address1 = "Unknown";
                        } else {
                            $scope.RcopiaPatientObj.Address1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1;
                            $scope.RcopiaPatientObj.Address2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2;
                        }
                        $scope.RcopiaPatientObj.City = $scope.PatientAddressInfo.PostalAddress.CityName;
                        $scope.RcopiaPatientObj.State = $scope.PatientAddressInfo.PostalAddress.StateCode;
                        $scope.RcopiaPatientObj.Zip = $scope.PatientAddressInfo.PostalAddress.ZipCode;


                        if ($scope.PatientDetailsInfo.AdditionalInfo != undefined) {
                            $scope.RcopiaPatientObj.Ethnicity = $scope.PatientDetailsInfo.AdditionalInfo.EthnicityName;
                            $scope.RcopiaPatientObj.Race = $scope.PatientDetailsInfo.AdditionalInfo.RaceName;
                            $scope.RcopiaPatientObj.PreferredLanguage = $scope.PatientDetailsInfo.AdditionalInfo.LanguageName;
                        }

                        $scope.addUpdatePatientToRcopiaReqObj.PatientList.push($scope.RcopiaPatientObj);


                        eHnoteDiagnosisDataServices.addPatientToRcopia($scope.addUpdatePatientToRcopiaReqObj).then(function (response) {

                            console.log(JSON.stringify(response));

                            if (response.data.status === 'Success') {
                                if (response.data.rows.length > 0) {
                                    $scope.RcopiaPatientObj.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                                    $scope.selectedPatientData.Patient[0].RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                                    //$scope.AddNewPrescriptionObj.PatientRcopiaId = response.data.rows[0].RcopiaPatientId;
                                }
                            };
                        });
                    }
                }
            }
            function callbackError1() {
                alertify.error("Creating  Failed");
            }

        }

        // FamilyInfo
        $scope.PatientFamilySave = function (type) {
            $scope.LogObj.LogArray = [];
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
                        //$scope.Registeraddpopup = true;
                        ///*   $scope.cacheValuesBookAppointment();*/
                        //$scope.CloseEditPatientPopUp();
                        //$scope.SelectPatient($scope.patientid);
                        $scope.CloseEditPatientPopUp();
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
                        //if (item.MobileNumber === "" || item.MobileNumber === null || item.MobileNumber === undefined || item.MobileNumber === 0) {
                        //    familyarryEmptyString = true;
                        //    alertify.error("Please Enter Valid MobileNumber");
                        //    return false;
                        //}
                        //var FMobileNumber = angular.copy(item.MobileNumber) || "";
                        //FMobileNumber = FMobileNumber.toString();
                        //if (FMobileNumber.length !== 10) {
                        //    familyarryEmptyString = true;
                        //    alertify.error("Please Enter Valid MobileNumber");
                        //    return false;
                        //}
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
            // FirstName, LastName,MobileNumber, RelationId
            var param = {
                "PatientId": $scope.patientid,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "FamilyInfo": angular.copy($scope.FamilyInfo.FamilyArray),
                "Logs":[]
            }
            angular.forEach(param.FamilyInfo, function (item) {
                item.ParentPatientId = $scope.patientid;
            });

            if ($scope.FamilyInfo.FamilyArray.length > 0) {
                let ScreenType = '';
                if (appointmentinfo.AppointmentType == 'ASC') {
                    ScreenType = 'ASC List';
                }
                else {
                    ScreenType = 'Pre-Admission';
                }
                if ($scope.LogObj.FamilyArray.length > 0) {
                    let count = 0;
                    angular.forEach($scope.FamilyInfo.FamilyArray, function (item) {
                        var edited = $scope.LogObj.FamilyArray.filter(function (eitem) {
                            return ((eitem.FirstName == item.FirstName) && (item.LastName == eitem.LastName) && (item.Gender == eitem.Gender) && (item.DOB == eitem.DOB) && (item.Age == eitem.Age) && (item.RelationId == eitem.RelationId) && (item.FamilyPhoneNumber == eitem.FamilyPhoneNumber) && (item.AddressLine1 == eitem.AddressLine1) && (item.AddressLine2 == eitem.AddressLine2) && (item.CityName == eitem.CityName) && (item.StateName == eitem.StateName) && (item.CountryName == eitem.CountryName) && (item.ZipCode == eitem.ZipCode) && (item.CountyName == eitem.CountyName));
                        }) || [];

                        if (edited.length == 0) {
                            count++;
                        }

                    });
                    if (count != 0) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 10,
                            "SubModuleName": "Profile",
                            "ScreenType": ScreenType,
                            "ActionType": "Edited",
                           // "ActionDescription": "Family member in " + ScreenType + "patient profile",
                            "ActionDescription": `Family member in  ${ScreenType} patient profile For Appointment ID: ${appointmentinfo.AppointmentId}`,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }
                else {

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 10,
                        "SubModuleName": "Profile",
                        "ScreenType": ScreenType,
                        "ActionType": "Added",
                        "ActionDescription": `Family member in  ${ScreenType} patient profile For Appointment ID: ${appointmentinfo.AppointmentId}`,
                       "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                param.Logs = $scope.LogObj || {};
            }

            eHnotePatientDataService.AddUpdatePatientFamilyDetails(param).then(function (resp) {
                $scope.FamilySummary = [];
                if (resp.data.status == "Success") {
                    var Familylist = angular.copy(resp.data.FamilyInfo);
                    angular.forEach(Familylist, function (fitem) {

                        var input = fitem.ContactNo;
                        var area = input.substring(0, 1);
                        var BranchMNumber = input.substring(2, 12);

                        var obj = eHnoteUserDataService.UsMobileFormatChange(BranchMNumber);
                        var BranchMobilenumber = obj.UsFormatMobileNumber;

                        var objitem = {
                            "PatientId": fitem.PatientId,
                            "FamilyId": fitem.FamilyId || 0,
                            "DeleteInd": "N",
                            "Title": fitem.Title,
                            "TitleId": fitem.TitleId || 0,
                            "FirstName": fitem.FirstName,
                            "LastName": fitem.LastName,
                            "Relation": "",
                            "RelationId": fitem.RelationId || 0,
                            "AreaCode": fitem.HomeAreaCode || "",
                            "MobileNumber": fitem.ContactNo,
                            "ParentPatientId": fitem.ParentPatientId,
                            "RelationObj": "",
                            "Age": fitem.Age,
                            "DOB": "",
                            "CurrentAge": "",
                            "ageinYears": "",
                            "ageinMonths": "",
                            "ageinDays": "",
                            "CountryCode": fitem.HomeCountryCode || "+1",
                            "PhoneNumber": fitem.HomeNumber || "",
                            "CountryCode": fitem.CountryCode || "+1",
                            "AreaCode": fitem.AreaCode || "",
                            "PhoneNumber": fitem.Number || "",
                            "Gender": fitem.Gender || "",
                            "FamilyPhoneNumber": BranchMobilenumber,
                            "AddressId": fitem.AddressId || 0,
                            "AddressLine1": fitem.AddressLine1 || "",
                            "AddressLine2": fitem.AddressLine2 || "",
                            "ZipCode": fitem.ZipCode || 0,
                            "CountyName": fitem.CountyName || "",
                            "CountyId": fitem.CountyId || 0,
                            "CityName": fitem.CityName || "",
                            "CityId": fitem.CityId || 0,
                            "StateName": fitem.StateName || "",
                            "StateId": fitem.StateId || 0,
                            "CountryName": fitem.CountryName || "",
                            "CountryId": fitem.CountryId || 0,
                            "CountyCodeObj": fitem.CountyCodeObj || "",
                            "ZipCodeArray": fitem.ZipCodeArray || []

                        }
                        var filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objitem.RelationId }, true) || [];
                        if (filterStatus.length > 0) {
                            objitem.Relation = filterStatus[0].RelationName;
                        }
                        angular.forEach($scope.FamilyInfo.FamilyArray, function (sitem) {
                            if (sitem.FirstName === fitem.FirstName && sitem.RelationId === fitem.RelationId) {

                            }
                        });
                        if (fitem.DOB != "" && fitem.DOB != null && fitem.DOB != undefined) {
                            objitem.DOB = $filter("date")(fitem.DOB, "MM-dd-yyyy");
                        }
                        $scope.FamilySummary.push(objitem);
                        $scope.LogObj.FamilyArray.push(objitem);
                    });

                    if (type === "Final") {
                        /*$scope.Registeraddpopup = true;*/
                        $scope.CloseEditPatientPopUp();
                        alertify.success("Saved Successfully");
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error(err);
            });
        }

        $scope.RemoveIndividualFamilyMember = function (familyitem) {
            var remove = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                if (familyitem.FamilyId === 0) {
                    var index = $scope.FamilyInfo.FamilyArray.indexOf(item);
                    $scope.FamilyInfo.FamilyArray.splice(index, 1);
                    return false;
                } else {
                    familyitem.DeleteInd = "Y";
                }

                var familyinfoarray = [];
                familyinfoarray.push(familyitem);
                var param = {
                    "PatientId": $scope.patientid,
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "FamilyInfo": angular.copy(familyinfoarray)
                }
                angular.forEach(param.FamilyInfo, function (item) {
                    item.ParentPatientId = $scope.patientid;
                });

                eHnotePatientDataService.AddUpdatePatientFamilyDetails(param).then(function (resp) {
                    $scope.FamilySummary = [];
                    if (resp.data.status == "Success") {
                        var Familylist = angular.copy(resp.data.FamilyInfo);
                        angular.forEach(Familylist, function (fitem) {

                            var input = fitem.ContactNo;
                            var area = input.substring(0, 1);
                            var BranchMNumber = input.substring(2, 12);

                            var obj = eHnoteUserDataService.UsMobileFormatChange(BranchMNumber);
                            var BranchMobilenumber = obj.UsFormatMobileNumber;

                            var objitem = {
                                "PatientId": fitem.PatientId,
                                "FamilyId": fitem.FamilyId || 0,
                                "DeleteInd": "N",
                                "Title": fitem.Title,
                                "TitleId": fitem.TitleId || 0,
                                "FirstName": fitem.FirstName,
                                "LastName": fitem.LastName,
                                "Relation": "",
                                "RelationId": fitem.RelationId || 0,
                                "AreaCode": fitem.HomeAreaCode || "",
                                "MobileNumber": fitem.ContactNo,
                                "ParentPatientId": fitem.ParentPatientId,
                                "RelationObj": "",
                                "Age": fitem.Age,
                                "DOB": "",
                                "CurrentAge": "",
                                "ageinYears": "",
                                "ageinMonths": "",
                                "ageinDays": "",
                                "CountryCode": fitem.HomeCountryCode || "+1",
                                "PhoneNumber": fitem.HomeNumber || "",
                                "CountryCode": fitem.CountryCode || "+1",
                                "AreaCode": fitem.AreaCode || "",
                                "PhoneNumber": fitem.Number || "",
                                "Gender": fitem.Gender || "",
                                "FamilyPhoneNumber": BranchMobilenumber,
                                "AddressId": fitem.AddressId || 0,
                                "AddressLine1": fitem.AddressLine1 || "",
                                "AddressLine2": fitem.AddressLine2 || "",
                                "ZipCode": fitem.ZipCode || 0,
                                "CountyName": fitem.CountyName || "",
                                "CountyId": fitem.CountyId || 0,
                                "CityName": fitem.CityName || "",
                                "CityId": fitem.CityId || 0,
                                "StateName": fitem.StateName || "",
                                "StateId": fitem.StateId || 0,
                                "CountryName": fitem.CountryName || "",
                                "CountryId": fitem.CountryId || 0,
                                "CountyCodeObj": fitem.CountyCodeObj || "",
                                "ZipCodeArray": fitem.ZipCodeArray || []

                            }
                            var filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objitem.RelationId }, true) || [];
                            if (filterStatus.length > 0) {
                                objitem.Relation = filterStatus[0].RelationName;
                            }
                            angular.forEach($scope.FamilyInfo.FamilyArray, function (sitem) {
                                if (sitem.FirstName === fitem.FirstName && sitem.RelationId === fitem.RelationId) {

                                }
                            });
                            if (fitem.DOB != "" && fitem.DOB != null && fitem.DOB != undefined) {
                                objitem.DOB = $filter("date")(new Date(fitem.DOB), "MM-dd-yyyy") || "";
                            }
                            $scope.FamilySummary.push(objitem);
                        });
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error(err);
                });
            }, function () {
                remove = "You pressed Cancel!";
            });
        }

        // Demographics Info
        $scope.PatientDemographicsSave = function (type) {

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
            if (($scope.DemographicSummary.LanguageID != 0 && $scope.DemographicSummary.LanguageID != '') || ($scope.DemographicSummary.RaceID != 0 && $scope.DemographicSummary.RaceID != '') || ($scope.DemographicSummary.EthnicityID != 0 && $scope.DemographicSummary.EthnicityID != '') ||
                ($scope.DemographicSummary.ExpressionId != 0 && $scope.DemographicSummary.ExpressionId != '') || ($scope.DemographicSummary.ProficiencyId != 0 && $scope.DemographicSummary.ProficiencyId != '') ||
                $scope.DemographicSummary.MultipleBirth != '' ||
                ($scope.DemographicSummary.SexualOrientationId != 0 && $scope.DemographicSummary.SexualOrientationId != '') || ($scope.DemographicSummary.GenderIdentityStatusId != '' && $scope.DemographicSummary.GenderIdentityStatusId != 0)) {
                checkexitingData = true;
            }
            //$scope.DemographicInfo.EthnicityID == null && $scope.DemographicInfo.RaceID == null
            //if ($scope.obj.IsEthnicitySelected.length == 0 && $scope.obj.IsRaceSelected.length == 0 && $scope.DemographicInfo.LanguageID == null && $scope.DemographicInfo.ExpressionId == null &&
            //    $scope.DemographicInfo.ProficiencyId == null && ($scope.DemographicInfo.MultipleBirth == "" || $scope.DemographicInfo.MultipleBirth == 0) && $scope.DemographicInfo.SexualOrientationId == null &&
            //    $scope.DemographicInfo.GenderIdentityStatusId == null && checkexitingData == false) {
            //    if (type === "Final") {
            //        $scope.Registeraddpopup = true;
            //        $scope.CloseEditPatientPopUp();
            //    }
            //    return false;
            //}

            var tempObj = $scope.DemographicInfo;
            tempObj.PatientId = $scope.patientid;

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
                    alertify.success("Saved Successfully");
                    $scope.CloseEditPatientPopUp();
                }
                return false;
            }
            eHnotePatientDataService.AddUpdatePatientDemographicsDetails(tempObj).then(function (resp) {
                var DemographicsList = "";
                $scope.DemographicSummary = GetDemographicInfo();
                if (resp.data.status == "Success") {
                    DemographicsList = resp.data.DemographicsInfo[0];
                    $scope.DemographicSummary.Ethnicity = angular.copy(DemographicsList.Ethnicity);
                    $scope.DemographicSummary.Race = angular.copy(DemographicsList.Race);
                    $scope.DemographicSummary.PreferedLanguage = angular.copy(DemographicsList.PreferedLanguage);

                    $scope.DemographicSummary.ExpressionId = DemographicsList.ExpressionId || 0;
                    var filter1 = $filter("filter")($scope.PatientLanguageExpressionList, { "LanguageExpressionId": DemographicsList.ExpressionId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.Expression = filter1[0].LanguageExpression || "";
                    }
                    $scope.DemographicSummary.ProficiencyId = DemographicsList.ProficiencyId || 0;
                    var filter1 = $filter("filter")($scope.PatientLanguageProficiencyList, { "LanguageProficiencyId": DemographicsList.ProficiencyId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.Proficiency = filter1[0].LanguageProficiency || "";
                    }
                    $scope.DemographicSummary.PatientPrefixListId = DemographicsList.PatientPrefixListId || 0;
                    var filter1 = $filter("filter")($scope.PatientPrefixList, { "DropdownId": DemographicsList.PatientPrefixListId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.PatientPrefixListName = filter1[0].Value || "";
                    }
                    $scope.DemographicSummary.PatinetSuffixId = DemographicsList.PatinetSuffixId || 0;
                    var filter1 = $filter("filter")($scope.PatientSuffixList, { "SuffixId": DemographicsList.PatinetSuffixId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.PatientSuffixName = filter1[0].Value || "";
                    }
                    $scope.DemographicSummary.SexualOrientationId = DemographicsList.SexualOrientationId || 0;
                    var filter1 = $filter("filter")($scope.PatientSexualOrientationList, { "DropdownId": DemographicsList.SexualOrientationId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.SexualOrientation = filter1[0].Value || "";
                    }
                    $scope.DemographicSummary.GenderIdentityStatusId = DemographicsList.GenderIdentityStatusId || 0;
                    var filter1 = $filter("filter")($scope.PatientGenderIdentityList, { "DropdownId": DemographicsList.GenderIdentityStatusId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.GenderIdentityStatus = filter1[0].Value || "";
                    }

                    $scope.DemographicSummary.FirstName = DemographicsList.FirstName || "";
                    $scope.DemographicSummary.LastName = DemographicsList.LastName || "";
                    $scope.DemographicSummary.MultipleBirth = DemographicsList.MultipleBirth || "";
                    $scope.DemographicSummary.MothersMiddleName = DemographicsList.MothersMiddleName || "";

                    $scope.DemographicSummary.EthnicityID = resp.data.EthnicityID || "";
                    $scope.DemographicSummary.EthnicityName = resp.data.EthnicityName || "";
                    $scope.DemographicSummary.RaceID = resp.data.RaceID || "";
                    $scope.DemographicSummary.RaceName = resp.data.RaceName || "";
                    $scope.DemographicSummary.LanguageID = resp.data.LanguageID || "";
                    $scope.DemographicSummary.LanguageName = resp.data.LanguageName || "";

                    $scope.DemographicSummary.LGuardianFirstName = resp.data.LGuardianFirstName || "";
                    $scope.DemographicSummary.LGuardianMiddleName = resp.data.LGuardianMiddleName || "";
                    $scope.DemographicSummary.LGuardianLastName = resp.data.LGuardianLastName || "";
                    $scope.DemographicSummary.PatFatherFirstName = resp.data.PatFatherFirstName || "";
                    $scope.DemographicSummary.LGuardianFullname = resp.data.LGuardianFullname || "";

                    if (type === "Final") {
                        //$scope.Registeraddpopup = true;
                        //$scope.SelectPatient($scope.patientid);
                        //$scope.CloseEditPatientPopUp();
                        //$scope.cacheValuesBookAppointment();
                        //return false;
                        $scope.CloseEditPatientPopUp();
                    }
                }

            }, function (err) {
                console.log(err);
                alertify.error(err);
            });
        }

        $scope.ClearDemopgraphicinfo = function () {
            var remove = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to clear demographics info? </h4>", function () {
                $scope.DemographicInfo = GetDemographicInfo();
                $scope.obj.IsEthnicitySelected = [];
                $scope.obj.IsRaceSelected = [];
                $scope.PatientDemographicsSave('Final');
            }, function () {
                remove = "You pressed Cancel!";
            });
        }

        // Patient Designated details
        $scope.PatientDesignatedSave = function (type) {
            $scope.PatientDesignatedInfo.PCP = $scope.PatientDesignatedInfo.PCP || null;
            $scope.PatientDesignatedInfo.Referral = $scope.PatientDesignatedInfo.Referral || null;
            $scope.PatientDesignatedInfo.ExternalManager = $scope.PatientDesignatedInfo.ExternalManager || null;
            $scope.PatientDesignatedInfo.Corporation = $scope.PatientDesignatedInfo.Corporation || null;
            $scope.PatientDesignatedInfo.Office = $scope.PatientDesignatedInfo.Office || null;
            $scope.PatientDesignatedInfo.MasterReferralSourceId = $scope.PatientDesignatedInfo.MasterReferralSourceId || null;
            $scope.PatientDesignatedInfo.ReferralSourceId = $scope.PatientDesignatedInfo.ReferralSourceId || null;
            $scope.PatientDesignatedInfo.ReferralDate = $scope.PatientDesignatedInfo.ReferralDate || "";



            $scope.PatientDesignatedInfo.PcpNPI = $scope.PatientDesignatedInfo.PcpNPI || "";
            $scope.PatientDesignatedInfo.ReferenceNumber = $scope.PatientDesignatedInfo.ReferenceNumber || "";

            $scope.PatientDesignatedInfo.PCPReferenceNumber = $scope.PatientDesignatedInfo.PCPReferenceNumber || "";
            //  $scope.PatientDesignatedInfo.PCPReferenceNumber = $scope.PatientDesignatedInfo.PCPReferenceNumber || "";
            $scope.PatientDesignatedInfo.PCPContactNo = $scope.PatientDesignatedInfo.PCPContactNo || "";
            $scope.PatientDesignatedInfo.PCPNotes = $scope.PatientDesignatedInfo.PCPNotes || "";
            $scope.PatientDesignatedInfo.IsPCPCoManagerInd = $scope.PatientDesignatedInfo.IsPCPCoManagerInd || false;
            $scope.PatientDesignatedInfo.PCPEmailId = $scope.PatientDesignatedInfo.PCPEmailId || "";
            $scope.PatientDesignatedInfo.PCPReferralDate = $scope.PatientDesignatedInfo.PCPReferralDate || null;
            $scope.PatientDesignatedInfo.ReferalNotes = $scope.PatientDesignatedInfo.ReferalNotes || "";
            $scope.PatientDesignatedInfo.IsReferalCoManagerInd = $scope.PatientDesignatedInfo.IsReferalCoManagerInd || false;
            $scope.PatientDesignatedInfo.ReferalReferenceNumber = $scope.PatientDesignatedInfo.ReferalReferenceNumber || "";
            $scope.PatientDesignatedInfo.ReferalEmailId = $scope.PatientDesignatedInfo.ReferalEmailId || "";
            $scope.PatientDesignatedInfo.ReferalNPI = $scope.PatientDesignatedInfo.ReferalNPI || "";
            $scope.PatientDesignatedInfo.SourceDesignatedInfoNotes = $scope.PatientDesignatedInfo.SourceDesignatedInfoNotes || "";
            $scope.PatientDesignatedInfo.ReferralContactNo = $scope.PatientDesignatedInfo.ReferralContactNo || 0;
            $scope.PatientDesignatedInfo.PCPCheckBox = $scope.PatientDesignatedInfo.PCPCheckBox || false;
            $scope.PatientDesignatedInfo.ReferalCheckBox = $scope.PatientDesignatedInfo.ReferalCheckBox || false;
            $scope.PatientDesignatedInfo.SourceCheckBox = $scope.PatientDesignatedInfo.SourceCheckBox || false;
            $scope.PatientDesignatedInfo.ReferralContact = $scope.PatientDesignatedInfo.ReferralContact || "";
            var CheckIndicatorDesignated = false;
            if (($scope.PatientDesignatedSummary.ReferalNotes != 0 && $scope.PatientDesignatedSummary.ReferalNotes != '') || ($scope.PatientDesignatedSummary.PCPNotes != 0 && $scope.PatientDesignatedSummary.PCPNotes != '') ||
                ($scope.PatientDesignatedSummary.PCPCheckBox != false && $scope.PatientDesignatedSummary.PCPCheckBox != '') || ($scope.PatientDesignatedSummary.ReferalCheckBox != false && $scope.PatientDesignatedSummary.ReferalCheckBox != '') ||
                ($scope.PatientDesignatedSummary.SourceCheckBox != false && $scope.PatientDesignatedSummary.SourceCheckBox != '') || ($scope.PatientDesignatedSummary.ReferralContact != 0 && $scope.PatientDesignatedSummary.ReferralContact != '') ||
                ($scope.PatientDesignatedSummary.PCPReferenceNumber != 0 && $scope.PatientDesignatedSummary.PCPReferenceNumber != '') || ($scope.PatientDesignatedSummary.PCPContactNo != 0 && $scope.PatientDesignatedSummary.PCPContactNo != '') ||
                ($scope.PatientDesignatedSummary.ReferralSourceId != 0 && $scope.PatientDesignatedSummary.ReferralSourceId != '') || ($scope.PatientDesignatedSummary.IsPCPCoManagerInd != 0 && $scope.PatientDesignatedSummary.IsPCPCoManagerInd != '') ||
                ($scope.PatientDesignatedSummary.PCPEmailId != 0 && $scope.PatientDesignatedSummary.PCPEmailId != '') || ($scope.PatientDesignatedSummary.PCPReferralDate != 0 && $scope.PatientDesignatedSummary.PCPReferralDate != null) ||
                ($scope.PatientDesignatedInfo.PatientPCPDocuments.length != 0 && $scope.PatientDesignatedInfo.PatientPCPDocuments.length != '') || ($scope.PatientDesignatedSummary.IsReferalCoManagerInd != 0 && $scope.PatientDesignatedSummary.IsReferalCoManagerInd != '') ||
                ($scope.PatientDesignatedSummary.ReferalEmailId != 0 && $scope.PatientDesignatedSummary.ReferalEmailId != '') || ($scope.PatientDesignatedSummary.ReferalNPI != 0 && $scope.PatientDesignatedSummary.ReferalNPI != '') ||
                ($scope.PatientDesignatedSummary.SourceDesignatedInfoNotes != 0 && $scope.PatientDesignatedSummary.SourceDesignatedInfoNotes != '') || ($scope.PatientDesignatedSummary.SourceDesignatedInfoNotes != 0 && $scope.PatientDesignatedSummary.SourceDesignatedInfoNotes != '') ||
                ($scope.PatientDesignatedSummary.PcpNPI != 0 && $scope.PatientDesignatedSummary.PcpNPI != '') || ($scope.PatientDesignatedSummary.ReferenceNumber != 0 && $scope.PatientDesignatedSummary.ReferenceNumber != '') ||
                ($scope.PatientDesignatedSummary.MasterReferralSourceId != 0 && $scope.PatientDesignatedSummary.MasterReferralSourceId != '')) {
                CheckIndicatorDesignated = true;
            }
            if ($scope.PatientDesignatedInfo.PCPCheckBox == false && CheckIndicatorDesignated == false
                && $scope.PatientDesignatedInfo.ReferalCheckBox == false
                && $scope.PatientDesignatedInfo.SourceCheckBox == false
                && $scope.PatientDesignatedInfo.ReferralContact == ""
                && $scope.PatientDesignatedInfo.PCPReferenceNumber == ""
                && $scope.PatientDesignatedInfo.PCPContactNo == ""
                && $scope.PatientDesignatedInfo.PCPNotes == ""
                && $scope.PatientDesignatedInfo.IsPCPCoManagerInd == false
                && $scope.PatientDesignatedInfo.PCPEmailId == ""
                && $scope.PatientDesignatedInfo.PCPReferralDate == null
                && $scope.PatientDesignatedInfo.ReferalNotes == ""
                && $scope.PatientDesignatedInfo.IsReferalCoManagerInd == false
                && $scope.PatientDesignatedInfo.ReferalReferenceNumber == ""
                && $scope.PatientDesignatedInfo.ReferalEmailId == ""
                && $scope.PatientDesignatedInfo.ReferalNPI == ""
                && $scope.PatientDesignatedInfo.SourceDesignatedInfoNotes == ""
                && $scope.PatientDesignatedInfo.PCP == null && $scope.PatientDesignatedInfo.Referral == null &&
                $scope.PatientDesignatedInfo.ExternalManager == null &&
                $scope.PatientDesignatedInfo.Office == null && $scope.PatientDesignatedInfo.MasterReferralSourceId == null &&
                $scope.PatientDesignatedInfo.ReferralSourceId == null && $scope.PatientDesignatedInfo.PatientPCPDocuments.length == 0 &&
                ($scope.PatientDesignatedInfo.ReferralDate == "" || $scope.PatientDesignatedInfo.ReferralDate == null || $scope.PatientDesignatedInfo.ReferralDate == undefined) &&
                $scope.PatientDesignatedInfo.PcpNPI == "" && $scope.PatientDesignatedInfo.ReferenceNumber == "") {
                if (type === "Final") {
                    /*$scope.Registeraddpopup = true;*/
                    /*$scope.cacheValuesBookAppointment();*/
                    $scope.CloseEditPatientPopUp();
                    alertify.success("Saved Successfully");
                }
                return false;
            }

            var TempDesignated = $scope.PatientDesignatedInfo;
            /*TempDesignated.PatientId = $scope.patientid;*/
            TempDesignated.PatientID = $scope.patientid;
            /* TempDesignated.ReferralDate = $filter("dateFormatter")(TempDesignated.ReferralDate, "-");*/ //$scope.patientid;
            TempDesignated.FullName = $scope.PatientFullName;
            TempDesignated.ReferralName = $scope.PatientDesignatedInfo.ReferralName;
            TempDesignated.MasterReferralSourceId = TempDesignated.MasterReferralSourceId === 0 ? null : TempDesignated.MasterReferralSourceId;
            TempDesignated.ReferralSourceId = TempDesignated.ReferralSourceId === 0 ? null : TempDesignated.ReferralSourceId;
            if ($scope.PatientDesignatedInfo.ReferralDate != '') {
                TempDesignated.ReferralDate = $filter("date")(new Date($scope.PatientDesignatedInfo.ReferralDate), "MM-dd-yyyy") || "";
            }

            angular.forEach(TempDesignated.PatientPCPDocuments, function (item) {
                if (item.PatientPCPDocumentId == 0) {
                    TempDesignated.PatientPCPDocuments = $filter("filter")(TempDesignated.PatientPCPDocuments, function (iterator, ind) { return iterator.PatientPCPDocumentId === 0; }) || [];
                }

            });


            if ($scope.FamilySummary.length > 0) {
                $scope.FamilyInfo.FamilyArray = angular.copy($scope.FamilySummary);
                // return false;
            }
            eHnotePatientDataService.AddUpdateDesignatedDetails(TempDesignated, OnAddPatientSuccess, OnAddPatientError);
            function OnAddPatientSuccess(resp) {
                if (resp.Status === "Success") {

                    $scope.PatientDesignatedSummary = GetDesignatedInfo();
                    $scope.PatientDesignatedSummary.PCP = resp.PCP || 0;
                    $scope.PatientDesignatedSummary.PCPDoctorName = resp.PCPDoctorName || "";
                    $scope.PatientDesignatedSummary.Referral = resp.Referral || 0;
                    $scope.PatientDesignatedSummary.ExternalManager = resp.ExternalManager || 0;
                    $scope.PatientDesignatedSummary.Corporation = resp.Corporation || 0;
                    $scope.PatientDesignatedSummary.CorporationName = resp.CorporationName || "";
                    $scope.PatientDesignatedSummary.Office = resp.Office || 0;
                    $scope.PatientDesignatedSummary.ReferralMobileNo = resp.ReferralMobileNo || 0;
                    $scope.PatientDesignatedSummary.ReferralContactNo = resp.ReferralContactNo || 0;
                    $scope.PatientDesignatedSummary.MasterReferralSourceId = resp.MasterReferralSourceId || 0;
                    $scope.PatientDesignatedSummary.ReferralSourceId = resp.ReferralSourceId || 0;
                    $scope.PatientDesignatedSummary.ReferralDate = resp.ReferralDate != null ? $filter('date')(new Date(resp.ReferralDate), "MM-dd-yyyy") : '';
                    $scope.PatientDesignatedSummary.PatientPCPDocuments = angular.copy(resp.PatientPCPDocuments) || [];
                    $scope.PatientDesignatedSummary.SummaryPcpDocument = angular.copy(resp.PatientPCPDocuments) || [];

                    if (type === "Final") {
                        alertify.success("Saved Successfully");
                        $scope.CloseEditPatientPopUp();
                    }
                }
            }
            function OnAddPatientError() {
                alertify.error("Creating  Failed");
            }
        };

        $scope.PatientInsuranceDetailsSave = function (type, EditMode) {
            var TempInsuarance = $scope.PatientInsuranceObj;

            TempInsuarance.CoverageId = TempInsuarance.CoverageId || null;
            TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;
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
            TempInsuarance.TempInsuranceImagesArray = TempInsuarance.TempInsuranceImagesArray || [];

            if ($scope.PatientInsuranceObj.IsAddnewInsuranceInd == true) {
                if (TempInsuarance.PolicyId == $scope.TempInsuranceObj.PolicyId && TempInsuarance.GroupId == $scope.TempInsuranceObj.GroupId && TempInsuarance.PlanId == $scope.TempInsuranceObj.PlanId && TempInsuarance.PayorId == $scope.TempInsuranceObj.PayorId) {
                    TempInsuarance.PatientInsuranceDetailId = TempInsuarance.PatientInsuranceDetailId;
                } else {
                    TempInsuarance.InsuranceDeactiveDetailId = TempInsuarance.PatientInsuranceDetailId;
                    TempInsuarance.IsConnectToFutureAppointment = false;
                    TempInsuarance.PatientInsuranceDetailId = 0;
                }
            }
            if (TempInsuarance.PatientInsuranceDetailId === 0 && TempInsuarance.CoverageId == null && TempInsuarance.PayorId == null && TempInsuarance.IdentifierId == null && TempInsuarance.PlanId == 0 &&
                TempInsuarance.PolicyId == '' && TempInsuarance.GroupId == '' && TempInsuarance.ExpiryDate == '' && TempInsuarance.ExpiryDate == '' && TempInsuarance.Staff == '' &&
                TempInsuarance.AcceptAssign == '' && TempInsuarance.AssignBenifits == '' && TempInsuarance.Comments == '' && TempInsuarance.TempInsuranceImagesArray.length == 0) {
                if (type === "Final") {
                    /*$scope.Registeraddpopup = true;*/
                    alertify.success("Saved Successfully");
                    $scope.CloseEditPatientPopUp();
                }
                return false;
            }

            if (TempInsuarance.PayorId !== null || TempInsuarance.PlanId !== 0 || TempInsuarance.GroupId !== null || TempInsuarance.PolicyId !== null) {
                TempInsuarance.IdentifierId = TempInsuarance.IdentifierId || null;
                
                if (TempInsuarance.PatientFirstName == "") {
                    alertify.error("Please Enter Patient First Name");
                    return false;
                }
                if (TempInsuarance.PatientLastName == "") {
                    alertify.error("Please Enter Patient Last Name");
                    return false;
                }
            }
            TempInsuarance.PolicyId = TempInsuarance.PolicyId || null;
            if (TempInsuarance.PolicyId === null) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient Policy ID");
                $scope.Headers.InsuranceHeader = true;
                return false;
            }

            TempInsuarance.PayorId = TempInsuarance.PayorId || null;
            if (TempInsuarance.PayorId === null) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Payor");
                return false;
            }
            TempInsuarance.PlanId === TempInsuarance.PlanId || 0;
            if (TempInsuarance.PlanId === 0) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Plan");
                return false;
            }

            $scope.Ffile = $scope.Ffile || '';
            $scope.Bfile = $scope.Bfile || '';
            $scope.frontS3Url = $scope.frontS3Url || '';
            $scope.backS3Url = $scope.backS3Url || '';
            if (($scope.Ffile != '' || $scope.frontS3Url != '') && ($scope.Bfile != '' || $scope.backS3Url != '')) {

            } else if ($scope.Ffile == '' && $scope.frontS3Url == '' && $scope.Bfile == '' && $scope.backS3Url == '') {

            } else {
                //$scope.ValidateIndictor = true;
                //alertify.error("Please Select Another Insurance-Card");
                //return false;
            }

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
            //if (TempInsuarance.InsuredPersonDOB != "") {
            //    TempInsuarance.InsuredPersonDOB = $filter("dateFormatter")(TempInsuarance.InsuredPersonDOB, "-");
            //}
            if (TempInsuarance.InsuredPersonDOB != "") {
                TempInsuarance.InsuredPersonDOB = $filter('date')(TempInsuarance.InsuredPersonDOB, 'yyyy-MM-dd');
            }

            //   });
            var param = {
                "PatientId": $scope.patientid,
                "FullName": $scope.PatientFullName,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "IsConnectToFutureAppointment": TempInsuarance.IsConnectToFutureAppointment || false,
                "PatientInsuranceDetails": []
            }
            param.PatientInsuranceDetails.push(TempInsuarance);

            eHnotePatientDataService.SavePatientInsuranceDetailsById(param, OnAddPatientSuccess, OnAddPatientError);
            function OnAddPatientSuccess(resp) {
                if (resp.Status === "Success") {
                    $scope.IsShowEligibiltySave = false;
                    $scope.Registeraddpopup = true;
                    if (resp.PatientInsuranceDetails.length > 0) {
                        $scope.PatientInsuranceSummary = resp.PatientInsuranceDetails;
                        $scope.PatientInsuranceSummary = $scope.PatientInsuranceSummary.map(item => ({
                            ...item,
                            IsShowEligibiltySave: false
                        }));
                    }
                    if (type === "Final") {
                        //$scope.SelectPatient($scope.patientid);
                        //$scope.TempInsuranceObj = $scope.GetTempInsuranceObj();
                        //$scope.CloseEditPatientPopUp(6);
                        $uibModalInstance.close(6);
                        alertify.success("Saved Successfully");
                    } else {

                    }

                    //alertify.success("Saved Successfully");
                    if ($scope.PatientInsuranceSummary.length > 0) {
                        angular.forEach($scope.PatientInsuranceSummary, function (insitem, index) {
                            insitem.EffectiveDate = insitem.EffectiveDate || "";
                            if (insitem.EffectiveDate != "") {
                                //  insitem.EffectiveDate = $filter("date")(new Date(insitem.EffectiveDate), "MM-dd-yyyy") || "";
                                insitem.EffectiveDate = $filter("date")(insitem.EffectiveDate, "MM-dd-yyyy") || "";
                            }
                            insitem.ExpiryDate = insitem.ExpiryDate || "";
                            if (insitem.ExpiryDate != "") {
                                // insitem.ExpiryDate = $filter("date")(new Date(insitem.ExpiryDate), "MM-dd-yyyy") || "";
                                insitem.ExpiryDate = $filter("date")(insitem.ExpiryDate, "MM-dd-yyyy") || "";
                            }
                            insitem.ScanDate = insitem.ScanDate || "";
                            if (insitem.ScanDate != "") {
                                //   insitem.ScanDate = $filter("date")(new Date(insitem.ScanDate), "MM-dd-yyyy") || "";
                                insitem.ScanDate = $filter("date")(insitem.ScanDate, "MM-dd-yyyy") || "";
                            }
                            insitem.VerifiedDate = insitem.VerifiedDate || "";
                            if (insitem.VerifiedDate != "") {
                                // insitem.VerifiedDate = $filter("date")(new Date(insitem.VerifiedDate), "MM-dd-yyyy") || "";
                                insitem.VerifiedDate = $filter("date")(insitem.VerifiedDate, "MM-dd-yyyy") || "";
                            }

                            insitem.InsuredPersonDOB = insitem.InsuredPersonDOB || "";
                            if (insitem.InsuredPersonDOB != "") {
                                insitem.InsuredPersonDOB = $filter("date")(insitem.InsuredPersonDOB, "MM-dd-yyyy") || "";
                            }

                        });
                    }

                    if (resp.PatientInsuranceDetails.length > 0) {
                        angular.forEach(resp.PatientInsuranceDetails, function (insitem, index) {
                            if (insitem.MovetoBilling === true) {
                                $rootScope.$broadcast("PatientINsuranceEdittobiller");
                            }
                        });
                    }
                    $scope.GetUpcomingAppointments($scope.patientid);

                    $scope.PatientInsurancebase64 = [];
                    angular.forEach($scope.PatientInsuranceSummary, function (item) {
                        if (item.PatientDocumentDetails.length > 0) {
                            angular.forEach(item.PatientDocumentDetails, function (subitem) {
                                if (subitem.IsBackSidefile == false && subitem.S3URL != '') {
                                    var obj = {
                                        "Documentid": subitem.DocumentId,
                                        "frontbase64": ""
                                    };
                                    $scope.toDataURL(subitem.S3URL, function (dataURL) {
                                        obj.frontbase64 = dataURL;
                                        $scope.PatientInsurancebase64.push(obj);
                                    });
                                }
                            });
                        }
                    });

                }
            }
            function OnAddPatientError() {
                alertify.error("Creating  Failed");
            }
        };

        $scope.GetSubHeaderInfo = function () {
            var obj = {
                "PrimaryInsuranceHeader": false,
                "SecInsuranceHeader": false,
                "TerInsuranceHeader": false,
                "WorkersCompHeader": false,
                "OtherInsuranceHeader": false,
            }
            return obj;
        }
        $scope.SubHeaders = $scope.GetSubHeaderInfo();

        $scope.TabClick = function (type) {

            $scope.currentTabName = angular.copy($scope.SaveTypeObj.TypeName);
            $scope.ContinuePatientSaveOnTabClick(type, $scope.currentTabName);
            $scope.Headers = $scope.GetHeaderInfo();
            $scope.SubHeaders = $scope.GetSubHeaderInfo();

            if (type === 1) {
                $scope.Headers.PatientHeader = true;
                $scope.SaveTypeObj.TypeName = 'PatientDetails';

                var phoneNumberString = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode + $scope.PatientDetailsInfo.ContactInfo.HomeNumber;
                $scope.formatUSNumberInfo(phoneNumberString);
                var AlternateNumberString = $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode + $scope.PatientDetailsInfo.ContactInfo.OfficeNumber;
                $scope.formatUSNumberAlternateinfo(AlternateNumberString);
            }
            if (type === 2) {
                $scope.Headers.AddresHeader = true;
                $scope.Headers.PatientHeader = false;
                $scope.SaveTypeObj.TypeName = 'AddressDetails';
                $scope.PatientAddressInfo = angular.copy($scope.PatientAddressSummary);
            }
            if (type === 3) {
                $scope.Headers.DemographicsHeader = true;
                $scope.Headers.PatientHeader = false;
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
                $scope.EditDemographicDetails($scope.DemographicSummary, "JustTabMove");
            }
            if (type === 4) {
                $scope.Headers.FamilyMemberHeader = true;
                $scope.Headers.PatientHeader = false;
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';
                $scope.FamilySummary = $scope.FamilySummary || [];
                if ($scope.FamilySummary.length > 0) {
                    $scope.FamilyInfo.FamilyArray = angular.copy($scope.FamilySummary);
                } else {
                    $scope.FamilyInfo = GetFamilyInfo();

                    $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
                    $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
                }
            }
            if (type === 5) {
                $scope.Headers.DesignatedHeader = true;
                $scope.Headers.PatientHeader = false;
                $scope.SaveTypeObj.TypeName = 'DesignatedDetails';
                $scope.newViewEditPopup(5, $scope.PatientDesignatedSummary, true);
            }
            if (type === 6) {
                $scope.Headers.InsuranceHeader = true;
                $scope.Headers.PatientHeader = false;
                $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
                $scope.SubHeaders.PrimaryInsuranceHeader = true;
                $scope.ShowInsuranceAddnew = false;
                if ($scope.PatientInsuranceSummary.length > 0) {
                    $scope.ShowInsuranceAddnew = true;
                }

                $scope.PatientInsuranceObj = GetInsuranceObj();
                if ($scope.PatientInsuranceObj.RelationShipId == 1) {
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = $scope.PatientDetailSummary.FirstName;
                    $scope.PatientInsuranceObj.InsuredPersonDOB = $scope.PatientDetailSummary.DOB;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = "";
                    $scope.PatientInsuranceObj.InsuredPersonSSN = "";
                    $scope.PatientInsuranceObj.InsuredPersonMiddleName = $scope.PatientDetailSummary.MiddleName;
                    $scope.PatientInsuranceObj.InsuredPersonLastName = $scope.PatientDetailSummary.LastName;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = $scope.PatientDetailSummary.Gender == "Male" ? 'M' : 'F';
                }
                $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientDetailSummary.FirstName;
                $scope.PatientInsuranceObj.PatientLastName = $scope.PatientDetailSummary.LastName;
                $scope.PatientInsuranceObj.PatientDOB = $scope.PatientDetailSummary.DOB;
                $scope.PatientInsuranceObj.PatientSSN = $scope.PatientDetailSummary.SocialSecurityNo;
                $scope.PatientInsuranceObj.IsIdentifier = false;
                $scope.PatientInsuranceObj.IsInsuranceConnectedAppointment = $scope.PatientDetailSummary.IsInsuranceConnectedAppointment;
            }

        };

        $scope.ContinuePatientSaveOnTabClick = function (type, typename) {

            if (typename === "PatientDetails") {
                $scope.Finalsubmit = "";
                $scope.ValidateIndictor = false;
                $scope.PatientSave(type);
            }
            else if (typename === "AddressDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientAddressSave(type);
            }
            else if (typename === "DemographicsDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientDemographicsSave(type);
            }
            else if (typename === "FamilyDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientFamilySave(type);
            }
            else if (typename === "DesignatedDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientDesignatedSave(type);
            }
            else if (typename === "InsuranceDetails") {
                $scope.ValidateIndictor = false;
                $scope.PatientInsuranceDetailsSave(type);
            }
            else {
                $scope.ValidateIndictor = false;
            }

        }
        $scope.cancelCapturePopup = function () {
            $scope.PatientDetailsInfo.S3URL = '';
            $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
            $uibModalInstance.close();
        }
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
                    "DisplayName": name
                };

                if ($scope.file.type != 'application/pdf') {
                    $scope.PatientDetailsInfo.PatientProfilePicDetails.push(obj);
                }

                angular.element("input[type='file']").val(null);
            }
        };
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
        $scope.EditDemographicDetails = function (DemographicDetails, movetype) {
            if (DemographicDetails != null) {
                $scope.Headers = $scope.GetHeaderInfo();
                $scope.Headers.DemographicsHeader = true;
                $scope.DemographicInfo = angular.copy(DemographicDetails);

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
                    var filter1 = [];
                    // $scope.obj.IsEthnicitySelected = $filter("filter")($scope.PatientEthnicityList, { "DropdownId": $scope.DemographicInfo.Ethnicity[0].EthnicityId })[0];
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
                    var filter1 = [];
                    // $scope.obj.IsRaceSelected = $filter("filter")($scope.PatientRaceList, { "DropdownId": $scope.DemographicInfo.Race[0].RaceId })[0];
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
                    var filter1 = [];
                    $scope.DemographicInfo.PreferedLanguageObj = $filter("filter")($scope.PatientLanguageList, { "Languageid": $scope.DemographicInfo.PreferedLanguage[0].LanguageId })[0];
                }

                if (movetype == "JustTabMove") {

                } else {
                    $scope.RegisterPatientSave();
                    $scope.SaveTypeObj.TypeName = "DemographicsDetails";
                }
                $scope.SaveTypeObj.TypeName = "DemographicsDetails";
            }
        }
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
        $scope.FamilySummary = [];
        $scope.FamilyInfo = FamilyInfo;

        $scope.newViewEditPopup = function (type, mainitem, DesignatedIND) {
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo(); // for latest appoinment details, checkinstatus id after checkin in profile // sumanth
            $scope.ShowPatientListDrop = false;

            var brancList = localStorageFactory.getItem("allBranchesData") || [];
            var data = brancList;
            $scope.AllUserBranchesList = [];
            if (data.length !== 0) {
                var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];

                $scope.AllUserBranchesList = BrachesList;
                $scope.BranchesListArray = BrachesList;
                $scope.selectedBranch = $scope.BranchesListArray[0];
                var RoleID = userLoginDetails.RoleID;

                $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                    return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                });

                $scope.selectedBranch = $scope.defaultbranch[0];

                if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                    angular.forEach($scope.BranchesListArray, function (item, index) {
                        if (item.ClinicName !== "All Locations") {
                            if (item.ExtDetails.HospitalID === $scope.hospid) {
                                $scope.selectedBranch = item;
                            }
                        }
                    });
                }

                var filterarray1 = [];
                filterarray1 = $filter("filter")($scope.AllUserBranchesList, function (item) {
                    return item.BranchId === $scope.ParenthospitalId;
                }) || [];
                if (filterarray1.length > 0) {
                    $scope.PatientDesignatedInfo.CorporationObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.ParenthospitalId })[0] || [];
                    if ($scope.PatientDesignatedInfo.CorporationObj != "") {
                        $scope.PatientDesignatedInfo.Corporation = $scope.PatientDesignatedInfo.CorporationObj.ClinicId;
                        $scope.PatientDesignatedInfo.CorporationName = $scope.PatientDesignatedInfo.CorporationObj.ClinicName;

                        if (type == 5) {
                            mainitem.Corporation = $scope.PatientDesignatedInfo.CorporationObj.ClinicId;
                            mainitem.CorporationName = $scope.PatientDesignatedInfo.CorporationObj.ClinicName;
                        }
                    }
                }

                if (type == 5) {
                    mainitem.Corporation = mainitem.Corporation || 0;
                    if (mainitem.Corporation == 0) {
                        if (doctorinfo.doctordata.UserAddress.length > 0) {
                            mainitem.Corporation = doctorinfo.doctordata.UserAddress[0].ParentOrganizationId;
                            mainitem.CorporationName = doctorinfo.doctordata.UserAddress[0].ParentOrganizationName;
                        }
                    }
                }
            }

            if ($scope.selectedBranch.BranchId === 0) {
                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                }
            }



            eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                    var branchesList = [];
                    $scope.BranchDoctorsList = [];
                    $scope.allUserList = [];




                    var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === $scope.selectedBranch.BranchId; });
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

                            if (DesignatedIND === true) {
                                $scope.EditDesignatedDetails($scope.PatientDesignatedSummary, "JustTabMove");
                            } else {
                                $scope.viewEditPopUp(type, mainitem);
                            }



                        } else {
                            alertify.error("No Doctors Found in Selected Hospital");

                        }


                    }

                    function onGetUsersFailure(data) {
                    }
                } else {
                    $scope.allSubSpecializationsArray = [];
                    $scope.clinicDoctorList = [];
                    $scope.allUserList = [];
                    $scope.selectedDoctor = "";
                    alertify.error("No Departments are been added");
                }
            });
            $scope.SubHeaders.SecInsuranceHeader = false;
            $scope.SubHeaders.TerInsuranceHeader = false;
            $scope.SubHeaders.WorkersCompHeader = false;
            $scope.SubHeaders.OtherInsuranceHeader = false;
            $scope.SubHeaders.PrimaryInsuranceHeader = false;
            mainitem.IsPolicyIdRenewInd = true;
            if ($scope.IsDynamicCheckInMandatory == true && $scope.PreviousUrl !== "/crm" && $scope.PreviousUrl !== "ASC") {
                if ((userLoginDetails.RoleID === 2 || userLoginDetails.RoleID === 62 || userLoginDetails.RoleID === 63 || userLoginDetails.RoleID === 64 || userLoginDetails.RoleID === 65 || userLoginDetails.RoleID === 66 || userLoginDetails.RoleID === 67 || userLoginDetails.RoleID === 68 || userLoginDetails.RoleID === 69) && appointmentinfo.AppointmentStatusId == 2) {

                    var params = {
                        "AppointmentId": appointmentinfo.AppointmentID || 0,
                    };
                    eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                        if (resp.data.Status === 'Success') {
                            var DynamicStatusarray = resp.data.rows[0];
                            if ((userLoginDetails.RoleID == 2 || userLoginDetails.RoleID === 62 || userLoginDetails.RoleID === 63 || userLoginDetails.RoleID === 64 || userLoginDetails.RoleID === 65 || userLoginDetails.RoleID === 66 || userLoginDetails.RoleID === 67 || userLoginDetails.RoleID === 68 || userLoginDetails.RoleID === 69) && DynamicStatusarray.RoomTypeId == 10 && DynamicStatusarray.Status == 'Waiting') {
                                $scope.IsReceptionistactive = true;
                                $scope.IsRoomActive = false;
                                $scope.updateAppointmentPatientTrackerstatus();
                            }
                            else if ((userLoginDetails.RoleID == 2 || userLoginDetails.RoleID === 62 || userLoginDetails.RoleID === 63 || userLoginDetails.RoleID === 64 || userLoginDetails.RoleID === 65 || userLoginDetails.RoleID === 66 || userLoginDetails.RoleID === 67 || userLoginDetails.RoleID === 68 || userLoginDetails.RoleID === 69) && (DynamicStatusarray.RoomTypeId !== 10) && DynamicStatusarray.Status == 'Waiting') {
                                //var r = alertify.confirm(
                                //    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is  " + DynamicStatusarray.Status + "  at " + DynamicStatusarray.RoomType + ", Do you want to move patient to your active Room or work offline?</h4>",
                                //    function () {
                                //        $scope.IsRoomActive = false;
                                //        $scope.updateAppointmentPatientTrackerstatus();
                                //    }, function () {                                  
                                //        return false;
                                //});
                                if ($scope.ConfirmboxObj.IsWorkOffline == true) {
                                    return false;
                                }

                                // $scope.ShowConfirmString = "Patient is  " + DynamicStatusarray.Status + " at " + DynamicStatusarray.RoomType + ", Do you want to move patient to your active Room or work offline ?";
                                $scope.ShowConfirmString = "Patient is " + DynamicStatusarray.Status + " with the " + DynamicStatusarray.RoomType + ", would you like to take the patient to your active room or work offline ?";

                                $scope.mInstanceAdd2 = $uibModal.open({
                                    "templateUrl": "ConfirmBox.html",
                                    "backdrop": "static",
                                    "scope": $scope,
                                    "keyboard": false,
                                    "size": "md",
                                    "controller": function ($scope, $uibModal, $uibModalInstance) {
                                        $scope.onClickSelectedOffline = function () {
                                            $scope.ConfirmboxObj.IsWorkOffline = true;
                                            $uibModalInstance.dismiss("cancel");
                                        }
                                        $scope.onClickSelectedActiveRoom = function () {
                                            $scope.updateAppointmentPatientTrackerstatus();
                                            $uibModalInstance.close("Active");
                                        }
                                        $scope.ConfirmClosepopup = function () {
                                            $uibModalInstance.close("close");
                                            // $location.url("/op");
                                        }
                                    }
                                });
                                $scope.mInstanceAdd2.result.then(function (resp) {
                                    if (resp == "Active") {
                                        $scope.IsRoomActive = false;
                                        $scope.IsReceptionistactive = true;
                                        $scope.ConfirmboxObj.IsWorkOffline = false;
                                    } else if (resp == "close") {
                                        /*$scope.Showeditpatient = false;*/
                                        $scope.EditPopoverInstance.dismiss("cancel");
                                    }
                                }, function (cancel) {
                                });

                            }

                        }


                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });


                }
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
        $scope.onCityChange1 = function (item) {
            $scope.PatientAddressInfo.PostalAddress.CityName = item.CityName || "";
            $scope.PatientAddressInfo.PostalAddress.CityId = item.CityId;
            $scope.PatientAddressInfo.PostalAddress.StateName = item.StateName || "";
            $scope.PatientAddressInfo.PostalAddress.StateId = item.StateId;
            $scope.PatientAddressInfo.PostalAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];

            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.patientList1 = resp.data;

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

        $scope.states = [];
        $scope.BlurChangeState = function () {
            eHnotePatientAddressDataServices.getStatesByCountryId($scope.CountryId).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    $scope.states = resp.data.rows;
                    $scope.PostalStates = resp.data.rows || [];
                    $scope.PermanentStates = resp.data.rows || [];
                }
            });
        };
        $scope.BlurChangeState();

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
        $scope.ONchangePatientState = function (item, type) {
            if (type === "Permanent") {
                $scope.PatientAddressInfo.PermanentAddress.StateName = item.Name;
                $scope.PatientAddressInfo.PermanentAddress.StateId = item.StateId;
                //$scope.PatientAddressInfo.PermanentAddress.CityName = "";
                $scope.PatientAddressInfo.PermanentAddress.CityId = item.CityId || 0;
                $scope.PatientAddressInfo.PermanentAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];
            } else {
                $scope.PatientAddressInfo.PostalAddress.StateName = item.Name;
                $scope.PatientAddressInfo.PostalAddress.StateId = item.StateId;
                //$scope.PatientAddressInfo.PostalAddress.CityName = "";
                $scope.PatientAddressInfo.PostalAddress.CityId = item.CityId || 0;
                $scope.PatientAddressInfo.PostalAddress.ZipCodeArray = angular.copy(item.ZipCodeArray) || [];
            }
        };
        $scope.OnSelectedZipCode = function (item, type) {
            if (type === "Permanent") {
                $scope.PatientAddressInfo.PermanentAddress.ZipCode = item.ZIP;
            } else {
                $scope.PatientAddressInfo.PostalAddress.ZipCode = item.ZIP;
            }
        };
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

        
        $scope.tempAddressDocsArray = [];
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

                            //  $scope.PatientAddressInfo.PatientAddressDocuments.splice(index, 1);
                            var filterAddressDocuments = $filter("filter")($scope.PatientAddressSummary.PatientAddressDocuments, { "PatientAddressDocumentId": item.PatientAddressDocumentId }, true) || [];
                            if (filterAddressDocuments.length > 0) {
                                var indexAddress = $scope.PatientAddressSummary.PatientAddressDocuments.indexOf(filterAddressDocuments[0]);
                                $scope.PatientAddressSummary.PatientAddressDocuments.splice(indexAddress, 1);
                            }

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
                "AppointmentId": $scope.Appointmentid || null,
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
                "windowClass": "modal__eighty-- overflow-hidden",
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
        $scope.AddressSaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.InsuranceHeader = true;
                $scope.SubHeaders.PrimaryInsuranceHeader = true;
                $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
                $scope.ShowInsuranceAddnew = false;
                if ($scope.PatientInsuranceSummary.length > 0) {
                    $scope.ShowInsuranceAddnew = true;
                }

                if ($scope.PatientInsuranceObj.RelationShipId == 1) {
                    $scope.PatientInsuranceObj.InsuredPersonFirstName = $scope.PatientDetailSummary.FirstName;
                    $scope.PatientInsuranceObj.InsuredPersonGenderID = $scope.PatientDetailSummary.Gender == "Male" ? 'M' : 'F';

                    $scope.PatientInsuranceObj.InsuredPersonDOB = $scope.PatientDetailSummary.DOB;
                    $scope.PatientInsuranceObj.InsuredPersonSSN = "";
                    $scope.PatientInsuranceObj.InsuredPersonMiddleName = $scope.PatientDetailSummary.MiddleName;
                    $scope.PatientInsuranceObj.InsuredPersonLastName = $scope.PatientDetailSummary.LastName;
                }
                //$scope.InsuranceClick();
                $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientDetailSummary.FirstName;
                $scope.PatientInsuranceObj.PatientLastName = $scope.PatientDetailSummary.LastName;
                $scope.PatientInsuranceObj.PatientDOB = $scope.PatientDetailSummary.DOB;
                $scope.PatientInsuranceObj.PatientSSN = $scope.PatientDetailSummary.SocialSecurityNo;
                $scope.PatientInsuranceObj.IsIdentifier = false;
            }
        };
        $scope.AddressSaveAndClose = function (type) {
            $scope.RegisterPatientSave(type);
        };
        $scope.DemographicsSaveAndClose = function (type) {
            $scope.RegisterPatientSave(type);
        };
        $scope.FamilySaveAndClose = function (type) {
            $scope.RegisterPatientSave(type);
        };
        $scope.DesignatedSaveAndClose = function (type) {
            $scope.RegisterPatientSave(type);
        };
        $scope.AddressPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.PatientHeader = true;
            $scope.SaveTypeObj.TypeName = 'PatientDetails';
            $scope.searchCountyByZipCode($scope.PatientAddressSummary.PermanentAddress.ZipCode, "GetCounty");
            $scope.searchCountyByZipCode1($scope.PatientAddressSummary.PostalAddress.ZipCode, "GetCounty");
        };
        $scope.PatientInsurancePrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.AddresHeader = true;
            $scope.SaveTypeObj.TypeName = 'AddressDetails';
            $scope.PatientAddressInfo = angular.copy($scope.PatientAddressSummary);
        };
        $scope.DemographicsPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.InsuranceHeader = true;
            $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
            $scope.SubHeaders.PrimaryInsuranceHeader = true;
            $scope.ShowInsuranceAddnew = false;
            if ($scope.PatientInsuranceSummary.length > 0) {
                $scope.ShowInsuranceAddnew = true;
            }
            $scope.PatientInsuranceObj = GetInsuranceObj();
            if ($scope.PatientInsuranceObj.RelationShipId == 1) {
                $scope.PatientInsuranceObj.InsuredPersonFirstName = $scope.PatientDetailSummary.FirstName;
                $scope.PatientInsuranceObj.InsuredPersonDOB = $scope.PatientDetailSummary.DOB;
                $scope.PatientInsuranceObj.InsuredPersonGenderID = "";
                $scope.PatientInsuranceObj.InsuredPersonSSN = "";
                $scope.PatientInsuranceObj.InsuredPersonMiddleName = $scope.PatientDetailSummary.MiddleName;
                $scope.PatientInsuranceObj.InsuredPersonLastName = $scope.PatientDetailSummary.LastName;
                $scope.PatientInsuranceObj.InsuredPersonGenderID = $scope.PatientDetailSummary.Gender == "Male" ? 'M' : 'F';
            }
            $scope.PatientInsuranceObj.PatientFirstName = $scope.PatientDetailSummary.FirstName;
            $scope.PatientInsuranceObj.PatientLastName = $scope.PatientDetailSummary.LastName;
            $scope.PatientInsuranceObj.PatientDOB = $scope.PatientDetailSummary.DOB;
            $scope.PatientInsuranceObj.PatientSSN = $scope.PatientDetailSummary.SocialSecurityNo;
            $scope.PatientInsuranceObj.IsIdentifier = false;

        }
        $scope.toDataURL = function (dataURL, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', dataURL);
            xhr.responseType = 'blob';
            xhr.send();
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
        $scope.removeImage = function (item) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                $scope.IsModifedLogo = false;
                $scope.PatientDetailsInfo.S3URL = '';
                $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
                $scope.file = "";

                // $scope.isLogoDefault = true;
                // $scope.isLogoThumbnailDefault = false;
                // $scope.isLogoS3URLDefault = false;
            }, function () {
                return;
            });
        }
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
        $scope.changePatientAuthorization = function (AuthorizationId) {
            if (AuthorizationId === null) {
                $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "";
                return false;
            }

            $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = AuthorizationId || "";
            if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 1) {
                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = true;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = false;
            }
            else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 2) {
                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = false;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = true;
            }
            else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 3) {
                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = true;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = true;
            }
            else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 4) {
                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = false;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = false;
            }

        };
        
        $scope.ChangeInsurancePayor = function (obj, mainitem, GetMode) {

            $scope.PatientInsuranceObj.PayorId = obj.PayorId;
            $scope.PatientInsuranceObj.PayorName = obj.PayorName;
            $scope.PatientInsuranceObj.PayorCode = obj.PayorCode;
            $scope.PatientInsuranceObj.OrganizationPayorId = obj.OrganizationPayorId;

            $scope.PatientInsuranceObj.PlanObj = "";
            $scope.PatientInsuranceObj.PlanId = 0;
            $scope.PatientInsuranceObj.PlanTypeId = 0;
            if ($scope.PatientInsuranceObj.IsInsuranceConnectedAppointment) {
                $scope.PatientInsuranceObj.IsAddnewInsurancePlanInd = true;
            }
            
        }
        $scope.ChangePlan = function (mainitem) {
            mainitem.PlanId = 0;
            mainitem.PlanTypeId = 0;
            
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
        $scope.GetOrganizationPayorPlansList = function (obj, mainitem) {
            mainitem.PayorId = mainitem.PayorId || 0;
            mainitem.payorPlansListArray = [];
            
            var param = {
                "OrganizationId": $scope.HospitalId,
                "SearchText": obj || "",
                "PageSize": 10,
                "PageNumber": 1,
                "GetAllIndicator": 0,
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
        $scope.ChangeInsuranceRelationShipItem = function (item) {


            if (item.RelationShipId == 1) {
                item.InsuredPersonFirstName = $scope.PatientDetailSummary.FirstName;
                item.InsuredPersonGenderID = $scope.PatientDetailSummary.Gender == "Male" ? 'M' : 'F';

                item.InsuredPersonDOB = $scope.PatientDetailSummary.DOB;
                item.InsuredPersonSSN = "";
                item.InsuredPersonMiddleName = $scope.PatientDetailSummary.MiddleName;
                item.InsuredPersonLastName = $scope.PatientDetailSummary.LastName;
            }
            
            else {
                item.InsuredPersonFirstName = "";
                item.InsuredPersonGenderID = "";
                item.InsuredPersonDOB = "";
                item.InsuredPersonSSN = "";
                item.InsuredPersonMiddleName = "";
                item.InsuredPersonLastName = "";
            }
        };

        //Upload insurance documents
        $scope.frontItemUpload = false;
        $scope.frontItemS3Url = false;
        $scope.backItemUpload = false;
        $scope.backItemS3Url = false;
        $scope.Ffile = "";
        $scope.Bfile = "";
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
        $scope.scanInsImageDocuments = function (type, pos, insobj) {
            
            var obj = {
                "PatientId": $scope.PatientDetailsInfo.PatientID || null,
                "AppointmentId": $scope.Appointmentid || null,
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
                "windowClass": "modal__eighty-- overflow-hidden",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",

            });
            $scope.mInstanceAdd.result.then(function (result) {
                if (result !== "") {
                    if (type === "front") {
                        $scope.frontItemS3Url = true;
                        $scope.frontS3Url = result.S3URL;
                        result.IsBackSidefile = false;
                        result.DisplayName = "front";
                        result.DocumentName = result.DocumentName || "FrontScan";
                        $scope.PatientInsuranceObj.PatientDocumentDetails.push(result);
                    }

                    if (type === "back") {
                        $scope.backItemS3Url = true;
                        $scope.backS3Url = result.S3URL;
                        result.IsBackSidefile = true;
                        result.DisplayName = "back";
                        result.DocumentName = result.DocumentName || "BackScan";
                        $scope.PatientInsuranceObj.PatientDocumentDetails.push(result);
                    }

                }

            }, function (cancel) {
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
        $scope.DeletePatientInsurance = function (InsItem) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'> This insurance will be inactive. Are you want to delete this insurance? </h4>", function () {
                var TempInsuarance = angular.copy(InsItem);
                TempInsuarance.DeleteInd = "Y";
                TempInsuarance.StatusId = 5;
                var param = {
                    "PatientId": $scope.patientid,
                    "FullName": $scope.PatientFullName,
                    "UserId": $scope.UserId,
                    "HospitalId": $scope.HospitalId,
                    "IsConnectToFutureAppointment": false,
                    "PatientInsuranceDetails": []
                }
                TempInsuarance.ScanDate = TempInsuarance.ScanDate || "";

                if (TempInsuarance.ScanDate != "") {
                    //   TempInsuarance.ScanDate = $filter('date')(TempInsuarance.ScanDate + " " + "00:00:00", "yyyy-MM-dd") || null;
                    TempInsuarance.ScanDate = $filter("dateFormatter")(TempInsuarance.ScanDate, "-");
                }
                TempInsuarance.VerifiedDate = TempInsuarance.VerifiedDate || '';
                if (TempInsuarance.VerifiedDate != "") {
                    //  TempInsuarance.VerifiedDate = $filter('date')(new Date(TempInsuarance.VerifiedDate), 'yyyy-MM-dd');
                    TempInsuarance.VerifiedDate = $filter("dateFormatter")(TempInsuarance.VerifiedDate, "-");
                }

                TempInsuarance.EffectiveDate = TempInsuarance.EffectiveDate || "";
                if (TempInsuarance.EffectiveDate != "") {
                    TempInsuarance.EffectiveDate = moment(TempInsuarance.EffectiveDate).format('YYYY-MM-DD');
                }
                TempInsuarance.ExpiryDate = TempInsuarance.ExpiryDate || "";
                if (TempInsuarance.ExpiryDate != "") {
                    TempInsuarance.ExpiryDate = moment(TempInsuarance.ExpiryDate).format('YYYY-MM-DD');
                }
                param.PatientInsuranceDetails.push(TempInsuarance); 

                eHnotePatientDataService.SavePatientInsuranceDetailsById(param, OnAddPatientSuccess, OnAddPatientError);
                function OnAddPatientSuccess(resp) {
                    if (resp.Status === "Success") {
                        console.log("Delete Insurance in patient level");
                        $scope.PatientInsuranceSummary = angular.copy(resp.PatientInsuranceDetails);

                        if ($scope.PatientInsuranceSummary.length > 0) {
                            angular.forEach($scope.PatientInsuranceSummary, function (insitem, index) {
                                insitem.EffectiveDate = insitem.EffectiveDate || "";
                                if (insitem.EffectiveDate != "") {
                                    insitem.EffectiveDate = $filter("date")(insitem.EffectiveDate, "MM-dd-yyyy") || "";
                                }
                                insitem.ExpiryDate = insitem.ExpiryDate || "";
                                if (insitem.ExpiryDate != "") {
                                    insitem.ExpiryDate = $filter("date")(insitem.ExpiryDate, "MM-dd-yyyy") || "";
                                }
                                insitem.ScanDate = insitem.ScanDate || "";
                                if (insitem.ScanDate != "") {
                                    insitem.ScanDate = $filter("date")(insitem.ScanDate, "MM-dd-yyyy") || "";
                                }
                                insitem.VerifiedDate = insitem.VerifiedDate || "";
                                if (insitem.VerifiedDate != "") {
                                    insitem.VerifiedDate = $filter("date")(insitem.VerifiedDate, "MM-dd-yyyy") || "";
                                }
                            });
                        }
                    }
                }
                function OnAddPatientError() {
                    alertify.error("Creating  Failed");
                }

            }, function () {
                return;
            });
        };
        $scope.InsuranceSaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.DemographicsHeader = true;
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            }
        }
        $scope.onSelectPayorPlan = function (mainitem) {
            if (mainitem.PlanObj == null || mainitem.PlanObj == "") {
                mainitem.PlanId = 0;
                //mainitem.PayorId = 0;
                return false;
            }
            mainitem.PlanId = mainitem.PlanObj.PlanId;
            mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
            //mainitem.PayorId = mainitem.PlanObj.PayorId;
            //mainitem.PayorName = mainitem.PlanObj.PayorName;
            mainitem.CoverageId = mainitem.PlanObj.PayorTypeId;
            /*  mainitem.OrganizationPayorId = mainitem.PlanObj.OrganizationPayorId;*/
            //var obj = {
            //    "PayorId": mainitem.PlanObj.PayorId,
            //    "PayorName": mainitem.PlanObj.PayorName,
            //    "PayorCode": mainitem.PlanObj.PayorCode,
            //    "OrganizationPayorId": mainitem.PlanObj.OrganizationPayorId,
            //    "OrganizationPayorName": mainitem.PlanObj.OrganizationPayorName,
            //}

            //mainitem.PayorObj = obj;
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
        $scope.DesignatedSaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.FamilyMemberHeader = true;
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';

                $scope.FamilySummary = $scope.FamilySummary || [];
                if ($scope.FamilySummary.length > 0) {
                    $scope.FamilyInfo.FamilyArray = angular.copy($scope.FamilySummary);
                    return false;
                } else {
                    $scope.FamilyInfo = GetFamilyInfo();

                    $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
                    $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
                }
            }
        };

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
        $scope.OnSelectedZipCodeForFamily = function (item, Mitem) {
            Mitem.ZipCode = item.ZIP;
        };
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
            
            if (fitem.AreaCode.length != 3) {
                alertify.error("Please Enter Valid Area Code");
                return false;
            }
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
        $scope.DesignatedPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.DemographicsHeader = true;
            $scope.SaveTypeObj.TypeName = 'DemographicsDetails';

            $scope.EditDemographicDetails($scope.DemographicSummary, "JustTabMove");
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

        $scope.GetAllHospitalEquipments = function () {
            //var obj = {
            //    "ParentOrganizationId": $scope.ParenthospitalId || 0
            //}
            $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
            eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    angular.forEach(resp.data.rows, function (item) {
                        item.IsChecked = false;
                    });
                    $scope.SelectedPatientTagList = resp.data.rows;

                    if ($scope.PatientDetailsInfo.PatientTagList.length > 0) {
                        angular.forEach($scope.PatientDetailsInfo.PatientTagList, function (item) {
                            angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                                if (item.HospitalEquipmentId == kitem.HospitalEquipmentId) {
                                    kitem.IsChecked = true;
                                }
                            });
                        });
                    }
                }
            });
        };
        $scope.GetAllHospitalEquipments();

        $scope.getPatientCaseHistoryItem = function (patientitem) {
            patientitem.PatientID = patientitem.PatientID || 0;
            if (patientitem.PatientID == 0) {
                return false;
            }
            datapersistanceFactory.set('CCDASeletedPatient', "");
            eHnoteAuditServices.getParticularPatientDetailsById(patientitem.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(response) {
                
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

                    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
                    $scope.cacheStorageItem.PatientID = patientitem.PatientID;
                    $scope.cacheStorageItem.patientid = patientitem.PatientID;
                    $scope.cacheStorageItem.PatientName = patientitem.FullName;
                    $scope.cacheStorageItem.EmailID = patientitem.EmailID ? patientitem.EmailID : '';
                    $scope.cacheStorageItem.CountryCode = patientitem.CountryCode ? patientitem.CountryCode : '';
                    $scope.cacheStorageItem.PhoneNumber = patientitem.PhoneNumber ? patientitem.PhoneNumber : '';
                    $scope.cacheStorageItem.appointmentid = 0;
                    $scope.cacheStorageItem.appointmentStatus = "";
                    $scope.cacheStorageItem.AppointmentPatientUploads = [];
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                    $scope.PatientsArray = [];
                    
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
                        $scope.cacheStorageItem.IsEditConsultation = true;
                        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
                        $scope.cacheStorageItem.AppointmentDoctorID = resp.data.DoctorId;
                        $scope.cacheStorageItem.appointmentStatus = resp.data.AppointmentStatus;

                    } else if (resp.data.AppointmentStatus === "B") {
                        $scope.cacheStorageItem.appointmentid = resp.data.AppointmentID;
                        $scope.cacheStorageItem.AppointmentDt = resp.data.ConsultationDt;
                        $scope.cacheStorageItem.TreatmentPlanId = 0;
                        $scope.cacheStorageItem.ConsultationID = 0;
                        $scope.cacheStorageItem.IsEditConsultation = false;
                        $scope.cacheStorageItem.IsFollowupConsultation = false;
                        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
                        $scope.cacheStorageItem.AppointmentDoctorID = resp.data.DoctorId;
                        $scope.cacheStorageItem.ConsultationDate = $scope.cacheStorageItem.AppointmentDt;
                        $scope.cacheStorageItem.appointmentStatus = resp.data.AppointmentStatus;
                    }
                    
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
                        $location.url("/ascprofile");
                    } else {
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        $location.url("/profile");
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
                        $location.url("/ascprofile");
                    } else {
                        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                        $location.url("/profile");
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }
    }]);
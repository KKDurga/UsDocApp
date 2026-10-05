eHnoteWebApp.controller("UsPatientParentCtrlv2", ["$scope", "$rootScope", "$route", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", "$http", "downloadpdfService", function ($scope, $rootScope, $route, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate, $http, downloadpdfService) {
 


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
    $scope.isERxVisible = false;
    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();
    var IsNavProfileTechLogin = false;
    if ($scope.selectedApptDates.Screen != "") {
        $scope.PreviousUrl = $scope.selectedApptDates.Screen;
        $scope.PreviousScreen = $scope.selectedApptDates.BacktoProfile || '';
    }

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;
    $scope.allSubSpecializationsArray = [];
    if (doctorinfo !== undefined) {

        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {

                $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;


               
                $scope.lRName = $scope.orgUsersData[0].ExtDetails.RoleName;

                $scope.Name = $scope.userLoginDetails.displayName;
                $rootScope.mainDisplayName = $scope.userLoginDetails.displayName;
                $scope.SpecialityName = doctorinfo.doctordata.User[0].SpecializationName||"";
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

    $scope.ParentObj = {
        'IsIOJParentOrganization': false
    };

    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var brancList = localStorageFactory.getItem("allBranchesData") || [];
    $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.cacheStorageItem.SelectedAppointmentTypeId = $scope.appointmentinfo.AppointmentTypeId;
    $scope.cacheStorageItem.IsInsuranceAvailable = false;

    $scope.mainPatientProfileObj = {
        "MainTab": 0,
        "PatientId": $scope.cacheStorageItem.PatientID || 0,
        "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
        "PatientDetailsSummaryMode":false,
        "PatientClaimId": null,
        "VisitId": 0,
        "VisitStatus":"",
        "AllBranchesList": [],
        "AllUsersList": [],
        "AllDoctorsList": [],
        "AllFacilities": [],
        "OrganizationFacilityList": [],
        "DepositTypes": [],
        "WriteOffReasons": [],
        "PatientDetailSummary": {},
        "patientInsuranceTpasArray": [],
        "AllMasterData": {},
        "FamilySummary": [],
        "TitlesList":[],
        "isAscChartShowInd": false,
        "StatusFlag": '',
        "AppointmentDate": '',
        "CardTypesData": [],
        "IsShowPatientSearch":false,
    };

    console.log($scope.mainPatientProfileObj);
    $scope.cacheStorageItem.IsfromScreen = $scope.cacheStorageItem.IsfromScreen || "";
    
    $scope.languageObj = {
        "selectedLang": "en"
    };

    $scope.languageObj.selectedLang = datapersistanceFactory.getItem("SelectedLanguageKey");

    $scope.activeLanguageChange = function (langKey) {
        $scope.languageObj.selectedLang = langKey;
        $translate.use(langKey);
        datapersistanceFactory.set("SelectedLanguageKey", langKey);
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
   
    $scope.SaveTypeObj = {
        "TypeName": "" //"PatientDetails"
    };


    $scope.CancelAppointmentobj = {
        "Ispopup": false,
        "CancelAppReason": [],
        "sendDocSms": false,
        "sendPatientSms": false,
        "sendDocEmail": false,
        "sendPatientEmail": false,
        "CancelReason": "",
        "CancelReasonId": 0,
        "NoShowReasonRemarks": "",
        "OtherCancelReason": "",
        "SurgeryReferralDoctorId": 0,
        "OtherProviderDoctorID": 0,
        "IsSmsLanguageIdInd": false,
        "SmsLanguageId": "",
        //"IsAddtoRecall": false,
        //"RecallDate": "",

    };
    $scope.ChartObj = {
        "SubMainTab": 1,
        "AppointmentTypeId": null,
        "AppointmentStatus": "",
        "AppointmentId": null,
        "AppointmentDate": null,
        "IsComingFromChart": false,
        "DoctorId": null,
        "DoctorName": "",
        "FacilityTypeId": 0,
        "PatientId": null,
        "EmailID": null
    }

    $scope.getDoctorsbySubSpecializations = function (branchId) {

        console.log(branchId);
        var branchesList = [];
        $scope.BranchDoctorsList = [];
        $scope.filteredBranchDoctorsList = [];
        $scope.allUserList = [];
        $scope.DoctorObj = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            //var bhospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            var bhospitalID = TempAppListdoctoraddress.map(x => x.BranchId).join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
            //var bhospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            var bhospitalID = TempAppListdoctoraddress.map(x => x.BranchId).join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }




      

        var reqObj = {
            "BranchId": $scope.HospitalId,
        }


        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                localStorageFactory.set("allUserList", $scope.allUserList);
                $scope.mainPatientProfileObj.AllUsersList = $scope.allUserList || [];
                $scope.RoleId = $scope.userLoginDetails.RoleID;
                if ($scope.allUserList.length !== 0) {

                    $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                }



                if ($scope.BranchDoctorsList.length > 0) {
                    $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) { return p.DoctorID; });
                    $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 18;
                    });
                    $scope.AllDoctorAnesthesiologist = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 30;
                    });
                    $scope.AllDoctorAssistant = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 29;
                    });
                    $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
                    });

                    $scope.filteredBranchDoctorsList = angular.copy($scope.BranchDoctorsList);
                }

                $scope.mainPatientProfileObj.AllDoctorsList = $scope.BranchDoctorsList || [];


                var DoctorID = doctorinfo.doctordata.User[0].DoctorID;

              /*  var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == DoctorID })[0];*/

             

            } else {
                alertify.error("No Doctors Found in Selected Hospital");

            }


        }

        function onGetUsersFailure(data) {
        }
    }
    
    function InitializeNewBranches(data) {

        if (data.length !== 0) {

            var EmptyClinicObj = {
                "ClinicName": "All Locations",
                "ClinicId": 0,
                "BranchName": "All Locations",
                "BranchId": 0,
                "SubOrganizationId": 0,
                "DefaultBillingProviderId": 0,
                "Address1": "",
                "Address2": "",
                "Location": "",
                "StateId": "",
                "PinCode": "",
                "CountryId": "",
                "CityId": "",
                "DistrictRegion": "",
                "Latitude": "",
                "Longitude": "",
                "BranchEmail": "",
                "CountryCode": "",
                "mobilenum": "",
                "Active": "Y",
                "Doctors": [],
                "CommunicationCountryCode": "",
                "CommunicationMobileNo": ""
            };

            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];
            BrachesList.unshift(EmptyClinicObj);
            $scope.BranchesListArray = BrachesList;

            $scope.mainPatientProfileObj.AllBranchesList = BrachesList || [];

            $scope.selectedBranch = $scope.BranchesListArray[0];
            var RoleID = $scope.userLoginDetails.RoleID;

            $scope.clinicDoctorList = [];

            $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
                return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.HospitalObj = $scope.defaultbranch[0];


            if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                angular.forEach($scope.BranchesListArray, function (item, index) {
                    if (item.ClinicName !== "All Locations") {
                        if (item.ExtDetails.HospitalID === $scope.hospid) {
                            $scope.selectedBranch = item;
                            $scope.HospitalObj = item;
                        }
                    }
                });
            }
        }


        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }
        $scope.getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
       /* GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);*/

    };


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
            "PreviousName": "",
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
            "S3URL": "img/sprite-sheet/user-square.svg",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "DisplayMobileNumber": "",
            "DisplayAlternateNumber": "",
            "SecondLastName": "",
            "SecondLastNameInd": true,
            "IsNoChargePatient": false,
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
            "AgeInYears": "",
            "AgeInMonths": "",
            "AgeInDays": "",
            "EmergencyRelationId": 0,
            "FaxNumber": "",
            "FaxAreacode": "",
            "FaxHomeNumber":"",
            "ExternalComanagerName": "",
            "InternalComanagerName": "",
            "PatientAddress": {},
            "SuffixName": "",
            "RefferalName":""
        //    "PCP": "",
        //    "PCPDoctorName": "",
        //    "Referral": "",
        //    "ReferralName": "",
        }
        return obj;
    };
    $scope.PatientDetailsInfo = GetPatientDetailsInfo();
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
    function GetDesignatedInfo() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientID": 0,
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
            obj.CorporationObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.ParentHospitalId })[0] || [];
            if (obj.CorporationObj != "") {
                obj.Corporation = obj.CorporationObj.ClinicId;
                obj.CorporationName = obj.CorporationObj.ClinicName;
            }
        }

        return obj;
    }
    $scope.PatientDesignatedInfo = GetDesignatedInfo();
    $scope.PatientDesignatedSummary = GetDesignatedInfo();
    $scope.PatientInsuranceSummary = [];
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
    $scope.PatientAddressSummary = GetPatientAddress();
    $scope.PatientProfileStatusId = 3;
    $scope.PatientprofileStatusDetails = [];


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
                "FamilyPhoneNumber": ""
            }]
        }
        return obj;
    }
    $scope.FamilyInfo = GetFamilyInfo();
    $scope.FamilySummary = [];

    function GetRegisterPatientNotes() {
        var obj = {
            "PatientId": $scope.PatientDetailsInfo.PatientID,
            "PatientNotesId": 0,
            "PatientNotes": "",
            "UserId": $scope.UserId,
            "DeleteInd": "N"
        };
        return obj;
    }

    $scope.ReferalPCPDoctorsList = [];

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
            "EligibilityStatusId": 0,
            "IsConnectToFutureAppointment": false,

        }
        return obj;
    }

    $scope.GetPCPObj = function () {
        return {
            "PcpReferalId": 0,
            "FirstName": "",
            'LastName': '',
            'SuffixId': '',
            'Title': 'Mr',
            'Age': '',
            "MobileNo": null,
            "AlternateMobileNo": null,
            "Gender": "Male",
            "EmailId": "",
            'Address1': '',
            'Address2': '',
            'LocationId': null,
            "StateId": null,
            'CityId': null,
            'PinCode': '',
            'NPI': '',
            'SSN': '',
            'EmployeeId': '',
            'ZipCodePlusNo': '',
            "SpecializationId": null,
            "DeleteInd": "N",
            "countrycode": "",
            "OrganizationId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "ZipCode": '',
            "LocationName": "",
            "CityName": "",
            "StateName": "",
            "ContactNo": null,
            "Slicence": "",
            "TaxonomyId": "",
            "Contactcountrycode": "+1",
            "Alternatecountrycode": "+1",
            "Faxcountrycode": '+1',
            'RefaralDr': '',
            'RefaralTypeId': 0,
            'RefaralTypeName': '',
            'CountyName': '',
            'CountyId': '',
            'CountryName': '',
            'CountryId': '',
            'CLIAID': '',
            'EmployeeId': '',
            'LIC': '',
            'PCPOrganization': '',
            'WWW': '',
            'PCPNotes': '',
            'SubSpecializationId': '',
            'Fax': '',
            'Contact': "",
            'PCPSubSpecializations': []

        };
    };
    $scope.PCPObj = angular.copy($scope.GetPCPObj());

    function GetApptPCPInfo() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientID": $scope.PatientId,
            "AppointmentId": $scope.AppointmentId,
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
            "ReferralContact": "",
            "PCPSecondReferenceNumber": "",
            "ReferalSecondReferenceNumber": "",
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

    $scope.searchCountyByZipCode = function (zipcode) {
        eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.countyCodesArray = resp.data.rows || [];
                    $scope.PCPObj.CountyName = resp.data.rows[0].CountyName;
                    $scope.PCPObj.CountyId = resp.data.rows[0].CountyId;
                }
            }
        });
    };
    $scope.searchCountyByZipCode1 = function (zipcode, GetMode) {
        eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.countyCodesPostalArray = resp.data.rows || [];

                if (GetMode === "GetCounty") {
                    if ($scope.PatientAddressSummary.PostalAddress.CountyId != 0 && $scope.PatientAddressSummary.PostalAddress.CountyId != null) {
                        $scope.PatientAddressSummary.PostalAddress.CountyCodeObj = $filter("filter")($scope.countyCodesPostalArray, { "CountyId": $scope.PatientAddressSummary.PostalAddress.CountyId })[0] || "";
                    }
                }

            }
        });
    };
    function GetselectedPatientObj() {
        return {
            "PatientName": "",
            "PatientDisplayId": "",
            "OldPatientDisplayId": "",
            "NewpatSearchType": "1",
            "FollwuppatSearchType": "2",
            "PatientId": 0,
            "PatientDOB": "",
            "PatientAge": "",
            "PatientAgeInYears": "",
            "PatientAgeInMonths": "",
            "PatientAgeInDays": "",
            "PatientMobile": "",
            "AgeInYears": "",
            "AgeInMonths": "",
            "AgeInDays": "",
            "PatientEmail": "",
            "DOB": "",
            "OldMrno": "",
            "AlternateMobileNo": "",
            "DOBSearch": "",
            "SmsLanguageId": ""
        }
    }
    $scope.selectedPatientObj = GetselectedPatientObj();
    function GetApptMaintainfields() {
        return {
            "IsPatientSelected": false,
            "IsAddNewPatientBtn": false,
            "IsAppointmentScreen": false,
            "ShowAddNewInsurance": false,
            "EditAppointmetDate": "",
            "EditAppointmentTime": "",
            "AppointmentTypeDisplay": "",
            "IsFormScreen": ""
        }
    }
    $scope.ApptMaintainfields = GetApptMaintainfields();
    function GetPatientDetailsForRegister() {
        var obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PatientID": 0,
            "PatientTagId": 0,
            "Title": "Mr",
            "TitleId": 1,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "SecondLastName": "",
            "PreviousName": "",
            "SecondLastNameInd": true,
            "DOB": "",
            "SocialSecurityNo": "",
            "FaxNumber": "",
            "Faxcountrycode": "+1",
            "FaxAreacode": "",
            "FaxHomeNumber": "",
            "Gender": "Male",
            "MaritalStatusID": "",
            "BloodGroupId": 0,
            "EmailID": "",
            "HomeCountryCode": "+1",
            "HomeAreaCode": "",
            "HomeNumber": "",
            "DisplayNumber": "",
            "PatientDisplayId": "",
            "OfficeCountryCode": "+1",
            "OfficeAreaCode": "",
            "OfficeNumber": "",
            "DisplayOfficeNumber": "",
            "S3URL": "",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "ageinYears": "",
            "ageinMonths": "",
            "ageinDays": "",
            "AuthorizationId": "",
            "IsPatientSmsInd": false,
            "IsPatientEmailInd": false,
            "OccupationId": "",
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "Emergency": "",
            "EmergencyMobile": "",
            "HospitalEquipmentId": "",
            "FatherName": "",
            "MotherName": "",
            "Guardian": "",
            "Employer": "",
        };

        if (doctorinfo.doctordata.User.length > 0) {
            obj.HomeCountryCode = doctorinfo.doctordata.User[0].CommunicationCountryCode;
            obj.OfficeCountryCode = doctorinfo.doctordata.User[0].CommunicationCountryCode;
        }
        return obj;
    };

    $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
    function GetInsuranceObj() {
        var obj = {
            "CoverageId": 0,
            "PatientInsuranceDetailId": 0,
            "PatientAppointmentInsuranceDetailId": 0,
            "PlanId": 0,
            "PlanObj": "",
            "Payor": "",
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "GlobalPayorId": 0,
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
            "StatusId": 1,
            "IsVerified": false,
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
            "setprimary": false,
            "InsuredPersonMiddleName": "",
            "InsuredPersonLastName": "",
            "PatientFirstName": "",
            "PatientLastName": "",
            "PatientDOB": "",
            "PatientSSN": "",
            "VerifiedBy": 0,
            "EligibilityStatusId": 1,
            "IsInsuranceConnectedAppointment": false,
            "IsGroupIdDiasibleInd": false,
            "IsPolicyIdDiasibleInd": false,
            "IsPayorPlanDiasibleInd": false,
            "IsPalnIdDiasibleInd": false,
            "DeleteInd": "N",
            "IsshowAddnewInsuranceInd": false,
            "IsEditNewInsuranceInd": false
        }
        return obj;
    }
    $scope.PatientInsuranceObj = GetInsuranceObj();
    $scope.SelectedPrimaryInsurance = "";
    $scope.SelectedsecondaryInsurance = "";
    $scope.SelectedOtherInsurance = "";
    $scope.GetTempInsuranceObj = function () {
        return obj = {
            "PatientInsuranceDetailId": 0,
            "GroupId": "",
            "PolicyId": "",
            "PayorId": "",
            "PlanId": ""
        }
    }
    $scope.TempInsuranceObj = $scope.GetTempInsuranceObj();
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    function getnewPaymentObj() {
        var obj = {
            "PaymentTypeId": "1",
            "OrgInsuranceTpaId": 0,
            "SelectPatientInsuranceObj": "",
            "AppointmentNote": "",
            "SelectPatientPrimaryInsuranceObj": "",
            "SelectPatientSecondaryInsuranceObj": "",
            "BillingCategoryType": "Bill Patient",
            "AppointmentNotesList": [],
            "PatientInsuranceList": [],
            "GETPatientInsuranceList": [],
            "IsPaymentTypeInd": true,
        }
        return obj
    }
    $scope.paymentTypeObj = getnewPaymentObj();
    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.FrequentlyAccessedPatientsArray = [];
    $scope.GetPatientVisitHistory = function () {

        let obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
        }

        eHnoteMainAppointmentService.GetPatientVisitHistory(obj).then(function (response) {

            if (response.data.status === 'Success') {
                $scope.FrequentlyAccessedPatientsArray = [];
                let patientpushval = {};
                if (response.data.rows.length > 0) {
                    $scope.IsFevShowIsFevShowIsFevShow = true;
                    angular.forEach(response.data.rows, function (item) {
                        let patientinitval = {};
                        patientinitval.PatientID = item.PatientID;
                        patientinitval.PatientId = item.PatientID;
                        patientinitval.AltCountryCode = item.AltCountryCode || '';
                        patientinitval.DOB = item.DOB;
                        patientinitval.DisplayID = item.DisplayID;
                        patientinitval.EmailID = item.EmailId;
                        patientinitval.FirstName = item.FirstName;
                        patientinitval.FullName = item.FullName;
                        patientinitval.LastName = item.LastName;
                        patientinitval.MiddleName = item.MiddleName;
                        patientinitval.MobileNo = item.MobileNo;
                        patientinitval.OldMrno = item.OldMrno || "";
                        patientinitval.S3URL = item.S3URL || "";
                        patientinitval.SecondLastName = item.SecondLastName;
                        var PhoneNumber = item.MobileNo || 0;
                        if (PhoneNumber.length > 0) {
                            var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                            patientinitval.MobileNo = obj.UsFormatMobileNumber;
                        }
                        //var previouspatval = angular.copy($scope.patientinitval);
                        //$scope.patientpushval.push(previouspatval);
                        $scope.FrequentlyAccessedPatientsArray.push(patientinitval);

                    });
                }
            }
        });
    }
    $scope.AddPatietnDetailsLog = function (PatientId) {

        let obj = {
            "UserHistoryId": 0,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": PatientId || 0,

        };
        eHnoteMainAppointmentService.AddPatientDetailsLog(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                console.log("Added");
            }
        });
    }
    $scope.focusPatientSearchInput = function () {
        // Use $timeout to ensure the DOM is updated before focusing        
        $timeout(function () {
            const inputElement = document.getElementById('single-button');
            if (inputElement) {
                inputElement.focus();
            }
            //const dropdown = document.getElementById('header__Search--');
            //if (dropdown && !dropdown.classList.contains('open')) {
            //    dropdown.classList.add('open');
            //}
        }, 0); // Delay of 0 to allow DOM rendering
        $scope.patients = [];
        $scope.selectedPatientObj.PatientDisplayId = '';
        $scope.selectedPatientObj.PatientName = '';
        $scope.selectedPatientObj.DOBSearch = '';
    //    $scope.GetPatientVisitHistory();
    };
    $scope.IsFevShowIsFevShowIsFevShow = false;
    $scope.focusPatientSearchInput2 = function () {
        // Use $timeout to ensure the DOM is updated before focusing        
        $timeout(function () {
            //const inputElement = document.getElementById('single-button');
            //if (inputElement) {
            //    inputElement.focus();
            //}
            const dropdown = document.getElementById('header__Search--');
            if (dropdown && !dropdown.classList.contains('open')) {
                dropdown.classList.add('open');
            }
        }, 0); // Delay of 0 to allow DOM rendering
        $scope.patients = [];
        $scope.GetPatientVisitHistory();
    };
    $scope.ChangePatientSearch = function (type) {
        //debugger
        $scope.focusPatientSearchInput2();
        $scope.selectedPatientObj = GetselectedPatientObj();
        $scope.selectedPatientObj.NewpatSearchType = type;
        $scope.selectedPatientObj.FollwuppatSearchType = type;
        $scope.patients = [];
        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
    };
    $scope.SearchByText = function (text, type) {
        //debugger
        $scope.patients = [];
        $scope.activeIndex = 0;
        if (type === 'Name') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = text;
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = "";
        }
        else if (type === 'OldDisplayId') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = text;
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = "";
        }
        else if (type === 'DOBSearch') {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientDisplayId = "";
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = text || "";
        }
        else {
            $scope.selectedPatientObj.PatientId = 0;
            $scope.selectedPatientObj.PatientName = "";
            $scope.selectedPatientObj.OldPatientDisplayId = "";
            $scope.selectedPatientObj.PatientDisplayId = text;
            $scope.selectedPatientObj.PatientMobile = "";
            $scope.selectedPatientObj.DOBSearch = "";
        }
        var name = $scope.selectedPatientObj.PatientName;
        var patDispId = "";
        patDispId = $scope.selectedPatientObj.PatientDisplayId ? $scope.selectedPatientObj.PatientDisplayId : "";
        var patOldDispId = "";
        patOldDispId = $scope.selectedPatientObj.OldPatientDisplayId ? $scope.selectedPatientObj.OldPatientDisplayId : "";
        var patMobile = "";
        patMobile = $scope.selectedPatientObj.PatientMobile ? $scope.selectedPatientObj.PatientMobile : "";
        var patDOB = "";
        //if ($scope.selectedPatientObj.DOBSearch.length > 9) {
        //    text = text + " 00:00:00";
        //    /*  patDOB = $filter('date')(new Date(text), "yyyy-MM-dd");*/
        //    /*patDOB = $scope.selectedPatientObj.DOBSearch || "";*/
        //    var parsedDate = new Date(text);
        //    if (!isNaN(parsedDate.getTime())) {
        //        patDOB = $filter('date')(parsedDate, "yyyy-MM-dd");
        //    } else {
        //        // Log an error or handle the invalid date case
        //        alertify.error("Invalid date format:", text);
        //        // Return false or handle the error in another way
        //        return false;
        //    }
        //}
        if (/^\d{8}$/.test(name)) {
            var month = name.substring(0, 2);
            var day = name.substring(2, 4);
            var year = name.substring(4, 8);

            var formattedDate = year + "-" + month + "-" + day;
            var parsedDate = new Date(formattedDate);

            if (!isNaN(parsedDate.getTime())) {
                patDOB = formattedDate;
                var param = {
                    "PageSize": 30,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "SearchText": $scope.selectedPatientObj.PatientName,
                    "PatientDisplayId": $scope.selectedPatientObj.PatientDisplayId,
                    "OldPatientMRNO": $scope.selectedPatientObj.OldPatientDisplayId,
                    "DOBSearch": patDOB || "",
                    "PageNumber": 1,
                    "StartAge": 0,
                    "PhoneNumber": "",
                    "EndAge": 0,
                    "IncludeCommDetails": "Y",
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "SearchMobile": 0,
                    "ParentOrganizationId": $scope.ParenthospitalId
                };
                param.DOBSearch = patDOB;
                param.hasparam = true;
                param.SearchText = "";
                param.PhoneNumber = "";
            } else {
                var param = {
                    "PageSize": 30,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "SearchText": $scope.selectedPatientObj.PatientName,
                    "PatientDisplayId": $scope.selectedPatientObj.PatientDisplayId,
                    "OldPatientMRNO": $scope.selectedPatientObj.OldPatientDisplayId,
                    "DOBSearch": patDOB || "",
                    "PageNumber": 1,
                    "StartAge": 0,
                    "PhoneNumber": "",
                    "EndAge": 0,
                    "IncludeCommDetails": "Y",
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "SearchMobile": 0,
                    "ParentOrganizationId": $scope.ParenthospitalId
                };
                param.patMobile = name;
                param.hasparam = true;
                param.SearchText = "";
            }
        }
        if (name.includes("/") || name.includes("-")) {
            // Replace '/' with '-' for consistency
            text = text.replace(/\//g, "-");

            // Parse the date
            var parsedDate = new Date(text + " 00:00:00");

            // Check if the parsed date is valid
            if (!isNaN(parsedDate.getTime())) {
                // If valid, format it as "yyyy-MM-dd"
                patDOB = $filter('date')(parsedDate, "yyyy-MM-dd");
            } else {
                // Handle invalid date input
                if ($scope.selectedPatientObj.DOBSearch.length > 9) {
                    alertify.error("Invalid date format: " + text);
                    name = "";
                    return false;
                }
            }
        }


        if ((name === "" || name.length < 1) && (patDispId === "") && (patOldDispId === "") && (patMobile === "") && (patDOB === "")) {
            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
            return;
        } else {
            if ($scope.selectedPatientObj.PatientName.length >= 1 || $scope.selectedPatientObj.PatientDisplayId.length >= 3 || $scope.selectedPatientObj.OldPatientDisplayId.length >= 2 || $scope.selectedPatientObj.PatientMobile.length >= 5 || $scope.selectedPatientObj.DOBSearch.length >= 10) {
                var param = {
                    "PageSize": 30,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "SearchText": $scope.selectedPatientObj.PatientName,
                    "PatientDisplayId": $scope.selectedPatientObj.PatientDisplayId,
                    "OldPatientMRNO": $scope.selectedPatientObj.OldPatientDisplayId,
                    "DOBSearch": patDOB || "",
                    "PageNumber": 1,
                    "StartAge": 0,
                    "PhoneNumber": "",
                    "EndAge": 0,
                    "IncludeCommDetails": "Y",
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "SearchMobile": 0,
                    "ParentOrganizationId": $scope.ParenthospitalId
                };
                if (name !== "") {
                    if (!isNaN(name)) {
                        if (name.length < 1) {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                            return;
                        }
                        param.PhoneNumber = name;
                        param.hasparam = true;
                        if (name.length === 5) {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
                        } else {
                            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                        }
                    } else {
                        param.SearchText = name;
                        param.hasparam = true;
                        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                    }
                }
                if (patMobile !== "") {
                    param.SearchText = parseInt(patMobile);
                    param.PhoneNumber = "";
                }
                if ($scope.RoleId === 1) {
                    param.HospitalIDLst = [doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID];

                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText || "",
                    }
                    if (object.SearchText === '') {
                        if (param.PatientDisplayId !== '') {
                            object.SearchText = param.PatientDisplayId;
                        } else {
                            object.SearchText = param.OldPatientMRNO;
                        }

                    }
                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                } else {

                    if ($scope.listval.length > 0) {
                        param.HospitalIDLst = $scope.listval;
                    } else {
                        $scope.listval.push(doctorinfo.doctordata.UserParentBranch[0].OrganizationId);
                    }
                    param.HospitalIDLst = $scope.listval;
                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.SearchText,
                    }
                    if (object.SearchText === '') {
                        if (param.PatientDisplayId !== '') {
                            object.SearchText = param.PatientDisplayId;
                        } else {
                            object.SearchText = param.OldPatientMRNO;
                        }

                    }
                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                }
            } else {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
            }
        }
    };
    function OnGetSearchPatientSuccess(data) {
        //debugger
        if (data.rows !== undefined) {

            $scope.patients = angular.copy(data.rows);

            angular.forEach($scope.patients, function (item) {
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var value = array_list[Math.floor(Math.random() * array_list.length)];
                item.colors = value;

                var PhoneNumber = item.PhoneNumber || 0;
                if (PhoneNumber.length > 0) {
                    var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                    item.UsMobileNoFormate = obj.UsFormatMobileNumber;
                }
                PhoneNumber = PhoneNumber.toString();
                if (PhoneNumber.length > 0) {
                    var number = PhoneNumber;
                    item.HomeNumber = item.HomeNumber || "";
                    if (item.HomeNumber != '') {
                        number = item.AltCountryCode + '-' + item.HomeAreaCode + '-' + item.HomeNumber;
                    } else {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.substring(5, 10);
                    }
                    item.TempPhNumber = number;
                } else {
                    item.TempPhNumber = "";
                }
            });

            $scope.ApptMaintainfields.IsAddNewPatientBtn = false;

            if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
            }

        } else {
            $scope.patients = [];
            if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
                if (!isNaN($scope.selectedPatientObj.PatientName)) {
                    if ($scope.selectedPatientObj.PatientName.length > 10) {
                        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;
                    }
                }
            } else {
                $scope.ApptMaintainfields.IsAddNewPatientBtn = true;
            }
        }
    }
    function OnGetPatientError(err) {
        console.log(err);
    }
    $scope.addNewPatientRegister = function (patientnumber) {
        //debugger
        //   $scope.IsNumberaddPatient = false;
        $scope.PatientDetailsForRegisterObj = GetPatientDetailsForRegister();
        $scope.PatientInsuranceObj = GetInsuranceObj();

        if ($scope.selectedPatientObj.FollwuppatSearchType == 2 || $scope.selectedPatientObj.FollwuppatSearchType == "2") {
            if (!isNaN($scope.selectedPatientObj.PatientName)) {
                var MobileNumber = patientnumber.toString() || "";
                if (MobileNumber != '') {
                    var number = MobileNumber;
                    var Area = number.slice(0, 3);
                    $scope.PatientDetailsForRegisterObj.HomeAreaCode = Area;
                    var contact = number.substring(3, (MobileNumber.toString()).length);
                    $scope.PatientDetailsForRegisterObj.HomeNumber = contact;

                    var phoneNumberString = $scope.PatientDetailsForRegisterObj.HomeAreaCode + $scope.PatientDetailsForRegisterObj.HomeNumber;
                    $scope.formatUSNumber(phoneNumberString);
                }
            } else {
                $scope.PatientDetailsForRegisterObj.FirstName = $scope.selectedPatientObj.PatientName;
            }
        }

        $scope.selectedPatientObj.PatientName = "";
        $scope.IsNoPatienthere = true;
        $scope.ShowAddNewInsurance = true;
        $scope.patientInsuranceTpasArray = [];
        $scope.paymentTypeObj.SelectPatientPrimaryInsuranceObj = "";
        $scope.paymentTypeObj.PaymentTypeId = "2";
        $scope.paymentTypeObj.IsPaymentTypeInd = false;




        $scope.PatientInsuranceObj.IdentifierId = 1;
        //  $scope.PatientInsuranceObj.setprimary = true;
        $scope.ApptMaintainfields.IsPatientSelected = true;
        $scope.ApptMaintainfields.IsAppointmentScreen = false;

        $scope.ApptMaintainfields.IsAddNewPatientBtn = false;

        addNewPatient();

    };
   
    $scope.ClosePopup = function () {
        $scope.ApptMaintainfields.IsPatientSelected = false;
    };

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
   

    $scope.SelectPatient = function (patientId,type) {
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;

                eHnoteMasterDataService.addpatientData(patientitem);
                $scope.patientid = patientitem.Patient[0].PatientID;
                $scope.PatientFullName = patientitem.Patient[0].FullName;
                $scope.PatientDisplayID = patientitem.Patient[0].PatientDisplayId;
             
                $scope.PatientDetailsInfo.PatientID = patientitem.Patient[0].PatientID;

                if (patientitem.Patient[0].TitleId != null && patientitem.Patient[0].TitleId != '') {
                    var filtertitle = $filter("filter")($scope.TitlesList, { "Id": patientitem.Patient[0].TitleId }, true) || [];
                    if (filtertitle.length > 0) {
                        $scope.PatientDetailsInfo.Title = filtertitle[0].Name;
                        $scope.PatientDetailsInfo.TitleId = filtertitle[0].Id;
                    }
                }

                $scope.PatientDetailsInfo.PatientQuestions = patientitem.PatientQuestions || [];
                $scope.PatientDetailsInfo.FirstName = patientitem.Patient[0].FirstName;
                $scope.PatientDetailsInfo.MiddleName = patientitem.Patient[0].MiddleName;
                $scope.PatientDetailsInfo.LastName = patientitem.Patient[0].LastName;
                $scope.PatientDetailsInfo.SecondLastName = patientitem.Patient[0].SecondLastName;
                $scope.PatientDetailsInfo.SuffixName = patientitem.Patient[0].SuffixName;

                $scope.PatientDetailsInfo.FatherName = patientitem.Patient[0].FatherName;
                $scope.PatientDetailsInfo.MotherName = patientitem.Patient[0].MotherName;
                $scope.PatientDetailsInfo.Guardian = patientitem.Patient[0].Guardian;
                $scope.PatientDetailsInfo.Employer = patientitem.Patient[0].Employer;
                $scope.PatientDetailsInfo.BirthSex = patientitem.Patient[0].BirthSex;
                $scope.PatientDetailsInfo.EmergencyRelationId= patientitem.Patient[0].EmergencyRelationId || 0;

                $scope.PatientDetailsInfo.IsDiseased = patientitem.Patient[0].IsDiseased;
                $scope.PatientDetailsInfo.DateOfDeath = patientitem.Patient[0].DateOfDeath;
                $scope.PatientDetailsInfo.CauseOfDeath = patientitem.Patient[0].CauseOfDeath;
                $scope.PatientDetailsInfo.AuthorizedUserFullName = patientitem.Patient[0].AuthorizedUserFullName;
                $scope.PatientDetailsInfo.AuthorizedUserEmailId = patientitem.Patient[0].AuthorizedUserEmailId;
                $scope.PatientDetailsInfo.AuthorizedUserMobileNo = patientitem.Patient[0].AuthorizedUserMobileNo;
                $scope.PatientDetailsInfo.PreviousName = patientitem.Patient[0].PreviousName;
                $scope.PatientDetailsInfo.HospitalReferenceId = patientitem.Patient[0].HospitalReferenceId;
                $scope.PatientDetailsInfo.ReferenceNotes = patientitem.Patient[0].ReferenceNotes;

                patientitem.Patient[0].FaxNumber = patientitem.Patient[0].FaxNumber || "";
                if (patientitem.Patient[0].FaxNumber != "") {
                    $scope.changeFaxNumber(patientitem.Patient[0].FaxNumber);
                } else {
                    $scope.PatientDetailsInfo.FaxNumber = "";
                    $scope.PatientDetailsInfo.FaxAreacode = "";
                    $scope.PatientDetailsInfo.FaxHomeNumber = "";
                }
                

                $scope.PatientDetailsInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;
                $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls = patientitem.Patient[0].IsAllowAiAutomatedCalls || false;
                if (patientitem.Patient[0].DOB != "") {
                    //$scope.PatientDetailsInfo.DOB = $filter('date')(new Date(patientitem.Patient[0].DOB), "MM-dd-yyyy");
                    $scope.PatientDetailsInfo.DOB = $filter('date')(patientitem.Patient[0].DOB, "MM-dd-yyyy");
                } else {
                    $scope.PatientDetailsInfo.DOB = "";
                }
                $scope.ageinYears = patientitem.Patient[0].AgeInYears;
                $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
                $scope.ageinDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
                $scope.PatientDetailsInfo.SocialSecurityNo = patientitem.Patient[0].SocialSecurityNo || "";
                if ($scope.PatientDetailsInfo.SocialSecurityNo == 0 || $scope.PatientDetailsInfo.SocialSecurityNo == "0") {
                    $scope.PatientDetailsInfo.SocialSecurityNo = "";
                }
                $scope.PatientDetailsInfo.Gender = patientitem.Patient[0].Gender || "";

                if (patientitem.Patient[0].PatientOtherDetails.length > 0) {
                    if (patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus != undefined && patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus != "") {
                        var MaritalStatusId = parseInt(patientitem.Patient[0].PatientOtherDetails[0].MaritalStatusId) || '';
                        var MaritalStatusName = patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus || "";
                        $scope.PatientDetailsInfo.MaritalStatusID = parseInt(MaritalStatusId);
                        $scope.PatientDetailsInfo.MaritalStatusName = MaritalStatusName;
                    } else {
                        $scope.PatientDetailsInfo.MaritalStatusID = 0;
                        $scope.PatientDetailsInfo.MaritalStatusName = "";
                    }
                    $scope.PatientDetailsInfo.BloodGroupName = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupName || "";
                    $scope.PatientDetailsInfo.BloodGroupId = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupId || 0;
                }

                $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode = patientitem.Patient[0].PatientHomeCode != '' ? patientitem.Patient[0].PatientHomeCode : '+1';
                $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = patientitem.Patient[0].Altareacode || '';
                $scope.PatientDetailsInfo.ContactInfo.HomeNumber = patientitem.Patient[0].PatientHomeNumber || '';
                patientitem.Patient[0].MobileNo = patientitem.Patient[0].MobileNo || '';
                if (patientitem.Patient[0].MobileNo != "") {
                    var mobile = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].MobileNo);
                    $scope.PatientDetailsInfo.ContactInfo.MobileNumber = mobile.UsFormatMobileNumber;
                }
                if ($scope.PatientDetailsInfo.ContactInfo.HomeNumber === 0 || $scope.PatientDetailsInfo.ContactInfo.HomeNumber === "0" || $scope.PatientDetailsInfo.ContactInfo.HomeNumber === null) {
                    $scope.PatientDetailsInfo.ContactInfo.HomeNumber = "";
                }

                $scope.PatientMNumber = patientitem.Patient[0].Altareacode + patientitem.Patient[0].PatientHomeNumber;

                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.ContactInfo.OfficeCountryCode = patientitem.Patient[0].OfficeCountryCode != '' ? patientitem.Patient[0].OfficeCountryCode : '+1';
                $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = patientitem.Patient[0].OfficeAreaCode || "";
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = patientitem.Patient[0].PatientOfficeNumber || "";
                patientitem.Patient[0].ContactNo = patientitem.Patient[0].ContactNo || "";
                if (patientitem.Patient[0].ContactNo != "") {
                    var contact = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].ContactNo);
                    $scope.PatientDetailsInfo.ContactInfo.ContactNumber = contact.UsFormatMobileNumber;
                }
                if ($scope.PatientDetailsInfo.ContactInfo.OfficeNumber == 0 || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber == "0" || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber == null) {
                    $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = "";
                }

                $scope.PatientOfficeumber = patientitem.Patient[0].OfficeAreaCode + patientitem.Patient[0].PatientOfficeNumber;

                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeumber);
                $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;


                $scope.PatientDetailsInfo.ContactInfo.EmailID = patientitem.Patient[0].EmailId || "";
                if (patientitem.PatientVitals.length > 0) {
                    if (patientitem.PatientVitals[0].Vitals != undefined) {
                        if (patientitem.PatientVitals[0].Vitals.BLGId != undefined && patientitem.PatientVitals[0].Vitals.BLGId != "") {
                            var filterStatus = $filter("filter")($scope.BloodGroupList, { "Id": patientitem.PatientVitals[0].Vitals.BLGId }, true) || [];
                            if (filterStatus.length > 0) {
                                $scope.PatientDetailsInfo.BloodGroupName = filterStatus[0].BloodGroupName || "";
                                $scope.PatientDetailsInfo.BloodGroupId = filterStatus[0].Id || "";
                                $scope.PatientDetailsInfo.BloodGroupObj = filterStatus[0] || "";
                            }
                        }
                    }
                }

                $scope.PatientDetailsInfo.PatientTagId = null;
                if (patientitem.Patient[0].PatientTagId != "" && patientitem.Patient[0].PatientTagId != 0 && patientitem.Patient[0].PatientTagId != null) {
                    var filterStatus = [];
                    var PatientTagId = parseInt(patientitem.Patient[0].PatientTagId) || 0;
                    $scope.PatientDetailsInfo.PatientTagId = PatientTagId;
                    filterStatus = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": PatientTagId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailsInfo.PatientTagName = filterStatus[0].HospitalEquipmentName;
                        $scope.PatientDetailsInfo.PatientTagObj = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": PatientTagId })[0];
                    }
                }

                $scope.PatientDetailsInfo.PatientTagList = [];
                if (patientitem.Patient[0].PatientTagList.length > 0) {
                    $scope.PatientDetailsInfo.PatientTagList = angular.copy(patientitem.Patient[0].PatientTagList);
                }

                $scope.PatientDetailsInfo.Age = patientitem.Patient[0].Age;
                $scope.PatientDetailsInfo.PatientDisplayID = patientitem.Patient[0].PatientDisplayId || "";
                $scope.PatientDetailsInfo.OldMrno = patientitem.Patient[0].OldMrno || "";
                $scope.PatientDetailsInfo.FullName = patientitem.Patient[0].FullName;
                $scope.PatientDetailsInfo.S3URL = patientitem.Patient[0].S3URL || "";

                $scope.PatientDetailsInfo.AgeInDays = patientitem.Patient[0].AgeInDays;
                $scope.PatientDetailsInfo.AgeInMonths = patientitem.Patient[0].AgeInMonths;
                $scope.PatientDetailsInfo.AgeInYears = patientitem.Patient[0].AgeInYears;

                $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = patientitem.Patient[0].IsPatientSmsInd || false;
                $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = patientitem.Patient[0].IsPatientEmailInd || false;
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

                $scope.PatientDetailsInfo.OccupationDescription = patientitem.Patient[0].OccupationDescription;
                $scope.PatientDetailsInfo.OccupationId = patientitem.Patient[0].OccupationId;
                $scope.PatientDetailsInfo.EmployerPhoneNo = patientitem.Patient[0].EmployerPhoneNo;
                $scope.PatientDetailsInfo.EmergencyContactName = patientitem.Patient[0].EmergencyContactName;
                $scope.PatientDetailsInfo.EmeregecyContactNo = patientitem.Patient[0].EmeregecyContactNo;

                $scope.PatientDetailsInfo.CreatedBy = patientitem.Patient[0].CreatedBy;
                $scope.PatientDetailsInfo.CreatedDt = patientitem.Patient[0].CreatedDt;
                $scope.PatientDetailsInfo.ModifiedBy = patientitem.Patient[0].ModifiedBy;
                $scope.PatientDetailsInfo.ModifiedDt = patientitem.Patient[0].ModifiedDt;
                $scope.PatientDetailsInfo.InternalComanagerId = patientitem.Patient[0].InternalComanagerId||0;
                $scope.PatientDetailsInfo.ExternalComanagerId = patientitem.Patient[0].ExternalComanagerId||0;
                $scope.PatientDetailsInfo.InternalComanagerName = patientitem.Patient[0].InternalComanagerName||"";
                $scope.PatientDetailsInfo.ExternalComanagerName = patientitem.Patient[0].ExternalComanagerName||"";
                
                $scope.PatientDetailsInfo.PCPDoctorName = patientitem.Patient[0].PCPDoctorName||"";
                $scope.PatientDetailsInfo.ReferralName = patientitem.Patient[0].ReferralName || "";
                if (patientitem.Patient[0].AdditionalInfo != undefined) {
                    $scope.PatientDetailsInfo.PCP = patientitem.Patient[0].AdditionalInfo.PCP || 0;
                    $scope.PatientDetailsInfo.Referral = patientitem.Patient[0].AdditionalInfo.Referral || 0;
                }
                $scope.PatientDetailsInfo.EmailId = patientitem.Patient[0].EmailId || '';
                $scope.PatientDetailsInfo.PatientAddress = patientitem.PatientAddress || {};
                $scope.PatientDetailsInfo.RefferalName = patientitem.Patient[0].ReferralName || "";
              /*  $scope.mainPatientProfileObj.PatientDetails.EmailId = patientitem.Patient[0].EmailId || '';*/
                $scope.mainPatientProfileObj.PatientDetailSummary = angular.copy($scope.PatientDetailsInfo);
                $scope.FamilySummary = [];
                //$scope.FamilyInfo.FamilyArray = [];
                if (patientitem.FamilyDetails.length > 0) {
                    angular.forEach(patientitem.FamilyDetails, function (fitem) {
                        var input = fitem.ContactNo;
                        var area = input.substring(0, 1);
                        var BranchMNumber = input.substring(2, 12);

                        var obj = eHnoteUserDataService.UsMobileFormatChange(BranchMNumber);
                        var BranchMobilenumber = obj.UsFormatMobileNumber;
                        var objitem = {
                            "PatientId": fitem.FamilyPatientId,
                            "FamilyId": fitem.Familyid || 0,
                            "DeleteInd": "N",
                            "Title": fitem.Title || "",
                            "TitleId": fitem.TitleId || 0,
                            "FirstName": fitem.FirstName,
                            "LastName": fitem.LastName,
                            "FullName": fitem.FullName,
                            "Relation": fitem.RelationName || "",
                            "RelationId": fitem.FamilyRelationShipId || 0,
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
                            "Gender": fitem.Gender || "",
                            "FamilyPhoneNumber": BranchMobilenumber,
                            "AddressLine1": fitem.AddressLine1 ||'',
                            "AddressLine2": fitem.AddressLine2 ||'',
                            "CountyId": fitem.CountyId || 0,
                            "CountyName": fitem.CountyName || '',
                            "CityId": fitem.CityId || 0,
                            "CityName": fitem.CityName || '',
                            "StateId": fitem.StateId || 0,
                            "StateName": fitem.StateName || '',
                            "CountryId": fitem.CountryId || 0,
                            "CountryName": fitem.CountryName ||'',
                            "ZipCode": fitem.ZipCode,
                        }
                        if (fitem.DOB != "" && fitem.DOB != null && fitem.DOB != undefined) {
                            objitem.DOB = $filter("date")(fitem.DOB, "MM-dd-yyyy") || "";
                        }
                        var filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objitem.RelationId }, true) || [];
                        if (filterStatus.length > 0) {
                            objitem.Relation = filterStatus[0].RelationName;
                            objitem.RelationObj = filterStatus[0];
                        }
                        if (objitem.TitleId != null && objitem.TitleId != '') {
                            var filtertitle = $filter("filter")($scope.TitlesList, { "Id": objitem.TitleId }, true) || [];
                            if (filtertitle.length > 0) {
                                objitem.Title = filtertitle[0].Name;
                            }
                        }

                        $scope.FamilySummary.push(objitem);
                    });
                } else {
                    $scope.FamilyInfo = GetFamilyInfo();
                    $scope.FamilySummary = [];
                }

                $scope.mainPatientProfileObj.FamilySummary = angular.copy($scope.FamilySummary);
                $scope.PatientInsuranceSummary = [];
                if (patientitem.patientInsuranceDetails.length > 0) {
                    angular.forEach(patientitem.patientInsuranceDetails, function (initem) {
                        var objectinsurance = {
                            "CoverageId": initem.CoverageId,
                            "CoverageName": "",
                            "CoverageObj": "",
                            "PatientInsuranceDetailId": initem.PatientInsuranceDetailId,
                            "PlanId": initem.PlanId || 0,
                            "PlanName": initem.PlanName || "",
                            "PlanObj": "",
                            "Payor": "",
                            "PayorName": initem.PayorName || "",
                            "PayorId": initem.PayorId || 0,
                            "OrganizationPayorId": initem.OrganizationPayorId,
                            "OrganizationPayorName": initem.OrganizationPayorName,
                            "PayorObj": "",
                            "PlanTypeId": initem.PlanTypeId || 0,
                            "PlanDescription": initem.PlanDescriptionl || "", // initem.PlanTypeName || "",
                            "PolicyId": initem.PolicyId,
                            "GroupId": initem.GroupId || "",
                            "GroupName": initem.GroupName || "",
                            "RelationShipId": initem.RelationShipId || "",
                            "InsuranceRelationShipObj": "",
                            "PolicyHolder": initem.PolicyHolder || "",
                            "PolicyHolderName": initem.PolicyHolderName || "",
                            "Employer": "",
                            "Coinsurance": initem.Coinsurance || "",
                            "VisitCopay": initem.VisitCopay || "",
                            "EffectiveDate": "",
                            "ExpiryDate": "",
                            "ScanDate": "",
                            "VerifiedDate": "",
                            "DeleteInd": false,
                            "IsConnectToFutureAppointment": initem.IsConnectToFutureAppointment || false,
                            "AcceptAssign": initem.AcceptAssign || "",
                            "AssignBenifits": initem.AssignBenifits || "",
                            "ReleaseInfo": initem.ReleaseInfo || "",
                            "LaboratoryId": initem.LaboratoryId || 0,
                            "StatusId": initem.StatusId || 0,
                            "Comments": initem.Comments || "",
                            "MSPTrailerTypeId": initem.MSPTrailerTypeId || 0,
                            "Staff": initem.Staff || "",
                            "PatientDocumentDetails": angular.copy(initem.PatientDocumentDetails) || "",
                            "MsnTyp": "",
                            "IsAcceptAssign": 0,
                            "IsAcceptAssignBenifits": 0,
                            "IsReleaseInfo": 0,
                            "PatientBillingTypeId": 0,
                            "TempInsuranceImagesArray": [],
                            "InsuredPersonFirstName": initem.InsuredPersonFirstName || "",
                            "InsuredPersonGenderID": initem.InsuredPersonGenderID || "",
                            "InsuredPersonDOB": initem.InsuredPersonDOB || "",
                            "InsuredPersonSSN": initem.InsuredPersonSSN || "",
                            "RelationName": initem.RelationName || "",
                            "IdentifierId": initem.IdentifierId,
                            "IsDefaultBillingIns": initem.IsDefaultBillingIns || "",
                            "PCP": initem.PCP || "",
                            "IPA": initem.IPA || "",
                            "AppointmentInsuranceDetailId": initem.AppointmentInsuranceDetailId || 0,
                            "IsVerified": initem.IsVerified || false,
                            "PatientId": initem.PatientId,
                            "InsuredPersonMiddleName": initem.InsuredPersonMiddleName,
                            "InsuredPersonLastName": initem.InsuredPersonLastName,
                            "PatientFirstName": initem.PatientFirstName || "",
                            "PatientLastName": initem.PatientLastName || "",
                            "PatientDOB": initem.PatientDOB || "",
                            "PatientSSN": initem.PatientSSN || "",
                            "EligibilityStatusId": initem.EligibilityStatusId || 0,
                            "IsIdentifier": false,
                            "GlobalPayorId": initem.GlobalPayorId || "",
                            "InsuredPersonSecondLastName": initem.InsuredPersonSecondLastName || "",
                            "InsuredPersonSuffix": initem.InsuredPersonSuffix || "",
                            "PatientMiddleName": initem.PatientMiddleName || "",
                            "PatientSecondLastName": initem.PatientSecondLastName || "",
                            "PatientSuffix": initem.PatientSuffix || "",
                        }
                        objectinsurance.CoverageName = "";
                        var filter1 = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": initem.CoverageId }, true) || [];
                        if (filter1.length > 0) {
                            objectinsurance.CoverageName = filter1[0].CoverageName || "";
                        }

                        objectinsurance.Status = "";
                        var filter1 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": initem.StatusId }, true) || [];
                        if (filter1.length > 0) {
                            objectinsurance.Status = filter1[0].Value || "";
                        }

                        var filterStatus = [];
                        filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objectinsurance.RelationShipId }, true) || [];
                        if (filterStatus.length > 0) {
                            objectinsurance.InsuranceRelationShipObj = filterStatus[0];
                        }

                        if (initem.EffectiveDate != "" && initem.EffectiveDate != null) {
                            var date = initem.EffectiveDate;
                            var data1 = date.split("-").reverse().join("-");
                            objectinsurance.EffectiveDate = $filter("date")(data1, "MM-dd-yyyy") || "";
                        }
                        if (initem.ExpiryDate != "" && initem.ExpiryDate != null) {

                            var date = initem.ExpiryDate;
                            var data2 = date.split("-").reverse().join("-");
                            objectinsurance.ExpiryDate = $filter("date")(data2, "MM-dd-yyyy") || "";
                        }
                        if (initem.ScanDate != "" && initem.ScanDate != null) {
                            objectinsurance.ScanDate = $filter("date")(initem.ScanDate, "MM-dd-yyyy") || "";
                        }
                        if (initem.VerifiedDate != "" && initem.VerifiedDate != null) {
                            objectinsurance.VerifiedDate = $filter("date")(initem.VerifiedDate, "MM-dd-yyyy") || "";
                        }
                        if (initem.InsuredPersonDOB != "" && initem.InsuredPersonDOB != null) {
                            objectinsurance.InsuredPersonDOB = $filter("date")(initem.InsuredPersonDOB, "MM-dd-yyyy") || "";
                        }

                        $scope.PatientInsuranceSummary.push(objectinsurance);
                    });
                }

                $scope.PatientDetailsInfo.AdditionalInfo = patientitem.Patient[0].AdditionalInfo;
                $scope.PatientDetailsInfo.PatientEthnicity = patientitem.PatientEthnicity;
                $scope.PatientDetailsInfo.PatientRace = patientitem.PatientRace;
                $scope.PatientDetailsInfo.PatientLanguage = patientitem.PatientLanguage;


                var DemographicsList = patientitem.Patient[0].AdditionalInfo;
                $scope.DemographicSummary.Ethnicity = angular.copy(patientitem.PatientEthnicity);
                $scope.DemographicSummary.Race = angular.copy(patientitem.PatientRace);
                $scope.DemographicSummary.PreferedLanguage = angular.copy(patientitem.PatientLanguage);

                $scope.DemographicSummary.ExpressionId = DemographicsList.ExpressionId || 0;
                var filter1 = [];
                filter1 = $filter("filter")($scope.PatientLanguageExpressionList, { "LanguageExpressionId": $scope.DemographicSummary.ExpressionId }, true) || [];
                if (filter1.length > 0) {
                    /*$scope.DemographicSummary.Expression = filter1[0].Value || "";*/
                    $scope.DemographicSummary.Expression = filter1[0].LanguageExpression || "";
                } else {
                    $scope.DemographicSummary.Expression = "";
                }
                $scope.DemographicSummary.ProficiencyId = DemographicsList.ProficiencyId || 0;
                var filter1 = [];
                filter1 = $filter("filter")($scope.PatientLanguageProficiencyList, { "LanguageProficiencyId": $scope.DemographicSummary.ProficiencyId }, true) || [];
                if (filter1.length > 0) {
                    $scope.DemographicSummary.Proficiency = filter1[0].LanguageProficiency || "";
                } else {
                    $scope.DemographicSummary.Proficiency = "";
                }
                $scope.DemographicSummary.PatientPrefixListId = DemographicsList.PatientPrefixListId || 0;
                var filter1 = [];
                filter1 = $filter("filter")($scope.PatientPrefixList, { "DropdownId": $scope.DemographicSummary.PatientPrefixListId }, true) || [];
                if (filter1.length > 0) {
                    $scope.DemographicSummary.PatientPrefixListName = filter1[0].Value || "";
                } else {
                    $scope.DemographicSummary.PatientPrefixListName = "";
                }
                $scope.DemographicSummary.PatinetSuffixId = DemographicsList.PatinetSuffixId || 0;
                var filter1 = [];
                filter1 = $filter("filter")($scope.PatientSuffixList, { "SuffixId": $scope.DemographicSummary.PatinetSuffixId }, true) || [];
                if (filter1.length > 0) {
                    $scope.DemographicSummary.PatientSuffixName = filter1[0].Value || "";
                } else {
                    $scope.DemographicSummary.PatientSuffixName = "";
                }
                $scope.DemographicSummary.SexualOrientationId = DemographicsList.SexualOrientationId || 0;
                var filter1 = [];
                filter1 = $filter("filter")($scope.PatientSexualOrientationList, { "SexualOrientationId": $scope.DemographicSummary.SexualOrientationId }, true) || [];
                if (filter1.length > 0) {
                    $scope.DemographicSummary.SexualOrientation = filter1[0].SexualOrientation || "";
                } else {
                    $scope.DemographicSummary.SexualOrientation = "";
                }
                $scope.DemographicSummary.GenderIdentityStatusId = DemographicsList.GenderIdentityId || 0;
                var filter1 = [];
                filter1 = $filter("filter")($scope.PatientGenderIdentityList, { "GenderIdentityId": $scope.DemographicSummary.GenderIdentityStatusId }, true) || [];
                if (filter1.length > 0) {
                    $scope.DemographicSummary.GenderIdentityStatus = filter1[0].GenderIdentity || "";
                } else {
                    $scope.DemographicSummary.GenderIdentityStatus = "";
                }

                $scope.DemographicSummary.FirstName = DemographicsList.FirstName || "";
                $scope.DemographicSummary.LastName = DemographicsList.LastName || "";
                $scope.DemographicSummary.MultipleBirth = DemographicsList.MultipleBirth || "";
                $scope.DemographicSummary.MothersMiddleName = DemographicsList.MothersMiddleName || "";

                $scope.DemographicSummary.EthnicityID = DemographicsList.EthnicityID || "";
                $scope.DemographicSummary.EthnicityName = DemographicsList.EthnicityName || "";
                $scope.DemographicSummary.RaceID = DemographicsList.RaceID || "";
                $scope.DemographicSummary.RaceName = DemographicsList.RaceName || "";
                $scope.DemographicSummary.LanguageID = DemographicsList.LanguageID || "";
                $scope.DemographicSummary.LanguageName = DemographicsList.LanguageName || "";

                $scope.DemographicSummary.LGuardianFirstName = DemographicsList.LGuardianFirstName || "";
                $scope.DemographicSummary.LGuardianMiddleName = DemographicsList.LGuardianMiddleName || "";
                $scope.DemographicSummary.LGuardianLastName = DemographicsList.LGuardianLastName || "";
                $scope.DemographicSummary.PatFatherFirstName = DemographicsList.PatFatherFirstName || "";
                $scope.DemographicSummary.LGuardianFullname = DemographicsList.LGuardianFullname || "";


                $scope.PatientDesignatedSummary.PCP = DemographicsList.PCP || 0;
                $scope.PatientDesignatedSummary.Referral = DemographicsList.Referral || 0;
                $scope.PatientDesignatedSummary.ExternalManager = DemographicsList.ExternalManager || 0;
                $scope.PatientDesignatedSummary.Corporation = DemographicsList.Corporation || 0;
                $scope.PatientDesignatedSummary.Office = DemographicsList.Office || 0;
                $scope.PatientDesignatedSummary.MasterReferralSourceId = DemographicsList.MasterReferralSourceId || 0;
                $scope.PatientDesignatedSummary.ReferralSourceId = DemographicsList.ReferralSourceId || 0;
                $scope.PatientDesignatedSummary.ReferralDate = DemographicsList.ReferralDate || "";
                if ($scope.PatientDesignatedSummary.ReferralDate != '') {
                    $scope.PatientDesignatedSummary.ReferralDate = $filter('date')($scope.PatientDesignatedSummary.ReferralDate, "MM-dd-yyyy");
                }

                $scope.PatientDesignatedSummary.PatientPCPDocuments = angular.copy(patientitem.PatientPCPDocuments) || [];
                $scope.PatientDesignatedSummary.PatientReferalDocuments = angular.copy(patientitem.PatientReferalDocuments) || [];

                $scope.PatientDesignatedSummary.SummaryPcpDocument = angular.copy(patientitem.PatientPCPDocuments) || [];



                $scope.PatientDesignatedSummary.PCPDoctorName = patientitem.Patient[0].PCPDoctorName || "";

                $scope.PatientDesignatedSummary.ReferralName = patientitem.Patient[0].ReferralName || "";
                $scope.PatientDesignatedSummary.ExternalManagerName = patientitem.Patient[0].ExternalManagerName || "";
                $scope.PatientDesignatedSummary.CorporationName = DemographicsList.CorporationName || "";
                $scope.PatientDesignatedSummary.OfficeName = DemographicsList.OfficeName || "";

                if ($scope.PatientDesignatedSummary.MasterReferralSourceId != 0) {
                    var filter1 = [];
                    filter1 = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": $scope.PatientDesignatedSummary.MasterReferralSourceId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.PatientDesignatedSummary.MasterReferralSourceName = filter1[0].MasterReferralSourceName || "";
                    }
                }
                if ($scope.PatientDesignatedSummary.ReferralSourceId != 0) {
                    var filter1 = [];
                    if ($scope.ReferralList != undefined && $scope.ReferralList.length > 0) {
                        filter1 = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedSummary.ReferralSourceId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.ReferralSourceName = filter1[0].ReferralTitle || "";
                        }

                    } else {
                        $scope.PatientDesignatedSummary.ReferralSourceName = patientitem.Patient[0].PatientOtherDetails[0].ReferralName;
                    }
                }
                $scope.PatientDesignatedSummary.EmployerName = DemographicsList.EmployerName || "";
                $scope.PatientDesignatedSummary.EmployerPhoneNo = DemographicsList.EmployerPhoneNo || "";
                $scope.PatientDesignatedSummary.OccupationDescription = DemographicsList.Occupation || "";
                $scope.PatientDesignatedSummary.OccupationId = DemographicsList.OccupationId || null;
                $scope.PatientDesignatedSummary.EmergencyContactName = DemographicsList.EmergencyContactName || "";
                $scope.PatientDesignatedSummary.EmeregecyContactNo = DemographicsList.EmeregecyContactNo || "";
                $scope.PatientDesignatedSummary.PcpNPI = DemographicsList.PcpNPI || "";
                $scope.PatientDesignatedSummary.ReferenceNumber = DemographicsList.ReferenceNumber || "";

                $scope.PatientDesignatedSummary.PCPContactNo = DemographicsList.PCPContactNo || "";
                $scope.PatientDesignatedSummary.IsPCPCoManagerInd = DemographicsList.IsPCPCoManagerInd || false;
                $scope.PatientDesignatedSummary.PCPNotes = DemographicsList.PCPNotes || "";
                $scope.PatientDesignatedSummary.PCPEmailId = DemographicsList.PCPEmailId || "";
                //  $scope.PatientDesignatedSummary.PCPReferralDate = DemographicsList.PCPReferralDate || "";
                $scope.PatientDesignatedSummary.ReferalNotes = DemographicsList.ReferalNotes || "";
                $scope.PatientDesignatedSummary.IsReferalCoManagerInd = DemographicsList.IsReferalCoManagerInd || false;
                $scope.PatientDesignatedSummary.ReferalReferenceNumber = DemographicsList.ReferalReferenceNumber || "";
                $scope.PatientDesignatedSummary.ReferalEmailId = DemographicsList.ReferalEmailId || "";
                $scope.PatientDesignatedSummary.ReferalNPI = DemographicsList.ReferalNPI || "";
                $scope.PatientDesignatedSummary.SourceDesignatedInfoNotes = DemographicsList.SourceDesignatedInfoNotes || "";
                $scope.PatientDesignatedSummary.ReferralContactNo = DemographicsList.ReferralContactNo || 0;
                $scope.PatientDesignatedSummary.PCPReferenceNumber = DemographicsList.PCPReferenceNumber || "";
                $scope.PatientDesignatedSummary.ReferalCheckBox = DemographicsList.ReferalCheckBox || false;
                $scope.PatientDesignatedSummary.SourceCheckBox = DemographicsList.SourceCheckBox || false;
                //  $scope.PatientDesignatedSummary.PCPCheckBox = DemographicsList.PCPCheckBox || true;
                $scope.PatientDesignatedSummary.PCPCheckBox = DemographicsList.PCPCheckBox || false;

                $scope.PatientDesignatedSummary.ReferralContact = DemographicsList.ReferralContact || "";

                $scope.PatientDesignatedSummary.PCPReferralDate = DemographicsList.PCPReferralDate || null;
                if ($scope.PatientDesignatedSummary.PCPReferralDate != null) {
                    $scope.PatientDesignatedSummary.PCPReferralDate = $filter('date')($scope.PatientDesignatedSummary.PCPReferralDate, "MM-dd-yyyy");
                }

                $scope.PatientAddressSummary.PermanentAddress.AddressId = patientitem.PatientAddress.PermanentAddress.AddressId || 0;
                $scope.PatientAddressSummary.PermanentAddress.AddressLine1 = patientitem.PatientAddress.PermanentAddress.AddressLine1 || "";
                $scope.PatientAddressSummary.PermanentAddress.AddressLine2 = patientitem.PatientAddress.PermanentAddress.AddressLine2 || "";
                $scope.PatientAddressSummary.PermanentAddress.ZipCode = patientitem.PatientAddress.PermanentAddress.ZipCode || "";
                $scope.PatientAddressSummary.PermanentAddress.CountyId = patientitem.PatientAddress.PermanentAddress.CountyId;
                $scope.PatientAddressSummary.PermanentAddress.CountyName = patientitem.PatientAddress.PermanentAddress.CountyName;
                $scope.PatientAddressSummary.PermanentAddress.CityName = patientitem.PatientAddress.PermanentAddress.CityName;
                $scope.PatientAddressSummary.PermanentAddress.CityId = patientitem.PatientAddress.PermanentAddress.CityId;
                $scope.PatientAddressSummary.PermanentAddress.StateName = patientitem.PatientAddress.PermanentAddress.StateName;
                $scope.PatientAddressSummary.PermanentAddress.StateId = patientitem.PatientAddress.PermanentAddress.StateId;
                $scope.PatientAddressSummary.PermanentAddress.CountryName = patientitem.PatientAddress.PermanentAddress.CountryName;
                $scope.PatientAddressSummary.PermanentAddress.CountryId = patientitem.PatientAddress.PermanentAddress.CountryId;
                $scope.PatientAddressSummary.PermanentAddress.StateCode = patientitem.PatientAddress.PermanentAddress.StateCode;

                $scope.PatientAddressSummary.PostalAddress.AddressId = patientitem.PatientAddress.PostalAddress.AddressId || 0;
                $scope.PatientAddressSummary.PostalAddress.AddressLine1 = patientitem.PatientAddress.PostalAddress.AddressLine1 || "";
                $scope.PatientAddressSummary.PostalAddress.AddressLine2 = patientitem.PatientAddress.PostalAddress.AddressLine2 || "";
                $scope.PatientAddressSummary.PostalAddress.ZipCode = patientitem.PatientAddress.PostalAddress.ZipCode || "";
                $scope.PatientAddressSummary.PostalAddress.CountyId = patientitem.PatientAddress.PostalAddress.CountyId;
                $scope.PatientAddressSummary.PostalAddress.CountyName = patientitem.PatientAddress.PostalAddress.CountyName;
                $scope.PatientAddressSummary.PostalAddress.CityName = patientitem.PatientAddress.PostalAddress.CityName;
                $scope.PatientAddressSummary.PostalAddress.CityId = patientitem.PatientAddress.PostalAddress.CityId;
                $scope.PatientAddressSummary.PostalAddress.StateName = patientitem.PatientAddress.PostalAddress.StateName;
                $scope.PatientAddressSummary.PostalAddress.StateId = patientitem.PatientAddress.PostalAddress.StateId;
                $scope.PatientAddressSummary.PostalAddress.CountryName = patientitem.PatientAddress.PostalAddress.CountryName;
                $scope.PatientAddressSummary.PostalAddress.CountryId = patientitem.PatientAddress.PostalAddress.CountryId;
                $scope.PatientAddressSummary.PatientAddressDocuments = patientitem.PatientAddress.PatientAddressDocuments || [];
                $scope.PatientAddressSummary.PostalAddress.StateCode = patientitem.PatientAddress.PostalAddress.StateCode;

                

           

                //if ($scope.PatientAddressSummary.PermanentAddress.ZipCode !== "") {
                //    $scope.searchCountyByZipCode($scope.PatientAddressSummary.PermanentAddress.ZipCode, "GetCounty");
                //}
                //if ($scope.PatientAddressSummary.PostalAddress.ZipCode !== "") {
                //    $scope.searchCountyByZipCode1($scope.PatientAddressSummary.PostalAddress.ZipCode, "GetCounty");
                //}

                $scope.RegisterPatientNotes = GetRegisterPatientNotes();
                $scope.RegisterPatientNotesArray = patientitem.PatientNotesArray || [];
             

                $scope.PatientProfileStatusId = patientitem.Patient[0].ProfileStatusMasterId || 3;
                $scope.PatientprofileStatusDetails = {
                    "ProfileStatusName": patientitem.Patient[0].ProfileStatus || "",
                    "ProfileStatusMasterId": patientitem.Patient[0].ProfileStatusMasterId || 3,
                };


               

                if ($scope.PatientDetailsInfo.S3URL != '') {
                    $scope.toDataURL($scope.PatientDetailsInfo.S3URL, function (dataURL) {
                        $scope.PatientProfileImageBase64 = dataURL;
                    });
                } else {
                    $scope.PatientProfileImageBase64 = "";
                }

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

            if (type == 'Rcopia') {
                $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
                if ($scope.selectedPatientData.Patient[0].RcopiaPatientId != '') {
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
                    $scope.addUpdatePatientToRcopiaReqObj = {
                        "UserId": $scope.UserId,
                        "AppointmentId": $scope.cacheStorageItem.appointmentid,
                        "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                        "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                        "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                        "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
                        "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
                        "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
                        "PatientList": [],
                        "OrganizationId": $scope.HospitalId,

                    };

                    $scope.addUpdatePatientToRcopiaReqObj.PatientList = [];
                    $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
                    $scope.RcopiaPatientObj.FirstName = $scope.PatientDetailsInfo.FirstName;
                    $scope.RcopiaPatientObj.LastName = $scope.PatientDetailsInfo.LastName || "";
                    $scope.RcopiaPatientObj.MiddleName = $scope.PatientDetailsInfo.MiddleName || "";
                    $scope.RcopiaPatientObj.ExternalID = $scope.PatientDetailsInfo.PatientID;
                    $scope.RcopiaPatientObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || "";
                    $scope.RcopiaPatientObj.EmailId = $scope.PatientDetailsInfo.EmailId;               
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
                    $scope.RcopiaPatientObj.MobilePhone = $scope.PatientDetailsInfo.ContactInfo.MobileNumber || "";
                    $scope.RcopiaPatientObj.HomePhone = $scope.PatientDetailsInfo.ContactInfo.ContactNumber; // Home Nummber 

                   


                    if ($scope.PatientAddressSummary.PostalAddress.AddressLine1 == '' && $scope.PatientAddressSummary.PostalAddress.AddressLine2 == '') {
                        $scope.RcopiaPatientObj.Address1 = "Unknown";
                    } else {
                        $scope.RcopiaPatientObj.Address1 = $scope.PatientAddressSummary.PostalAddress.AddressLine1;
                        $scope.RcopiaPatientObj.Address2 = $scope.PatientAddressSummary.PostalAddress.AddressLine2;
                    }
                    $scope.RcopiaPatientObj.City = $scope.PatientAddressSummary.PostalAddress.CityName;
                    $scope.RcopiaPatientObj.State = $scope.PatientAddressSummary.PostalAddress.StateCode;
                    $scope.RcopiaPatientObj.Zip = $scope.PatientAddressSummary.PostalAddress.ZipCode;



                  

                    if ($scope.PatientDetailsInfo.AdditionalInfo != undefined) {
                        $scope.RcopiaPatientObj.Ethnicity = $scope.DemographicSummary.EthnicityName;
                        $scope.RcopiaPatientObj.Race = $scope.DemographicSummary.RaceName;
                        $scope.RcopiaPatientObj.PreferredLanguage = $scope.DemographicSummary.LanguageName;
                    }

                  
                    $scope.addUpdatePatientToRcopiaReqObj.PatientList.push($scope.RcopiaPatientObj);


                    eHnoteDiagnosisDataServices.addPatientToRcopia($scope.addUpdatePatientToRcopiaReqObj).then(function (response) {

                        console.log(JSON.stringify(response));

                        if (response.data.status === 'Success') {
                            if (response.data.rows.length > 0) {
                                $scope.RcopiaPatientObj.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                                $scope.selectedPatientData.Patient[0].RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                                $scope.cacheStorageItem.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                                $scope.AddToCache();
                            }
                        };
                    });

                }
            }

            if ($scope.RoleId == 10 || $scope.RoleId == 1 || $scope.RoleId == 43 || $scope.RoleId == 16 || $scope.RoleId == 73) { // Technician Login Visit screen
                if (IsNavProfileTechLogin == false && $scope.cacheStorageItem.IsfromScreen != 'ASC' && $scope.cacheStorageItem.IsfromScreen != 'ascprofile') {
                    $scope.mainPatientProfileObj.MainTab = 2;
                    IsNavProfileTechLogin = true;
                } else {
                    $scope.mainPatientProfileObj.MainTab = 1;
                }
            } else {
                $scope.mainPatientProfileObj.MainTab = 1;
            }
            //$scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            $scope.cacheStorageItem.PatientName = patientitem.Patient[0].FullName;
            $scope.AddToCache();
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
        $scope.getPatientDepositAmountById(patientId);
       
    }

    $scope.PatientProfileImageBase64 = "";
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
    function ongetPatientDetailsError(error) {
        console.log(error);
    }
    function ongetPatientDetailsSuccess(data) {
        if (data !== undefined) {
            var patientitem = data;

            eHnoteMasterDataService.addpatientData(patientitem);
            $scope.patientid = patientitem.Patient[0].PatientID;
            $scope.PatientFullName = patientitem.Patient[0].FullName;
            $scope.PatientDisplayID = patientitem.Patient[0].PatientDisplayId;

            $scope.PatientDetailsInfo.PatientID = patientitem.Patient[0].PatientID;

            if (patientitem.Patient[0].TitleId != null && patientitem.Patient[0].TitleId != '') {
                var filtertitle = $filter("filter")($scope.TitlesList, { "Id": patientitem.Patient[0].TitleId }, true) || [];
                if (filtertitle.length > 0) {
                    $scope.PatientDetailsInfo.Title = filtertitle[0].Name;
                    $scope.PatientDetailsInfo.TitleId = filtertitle[0].Id;
                }
            }

            $scope.PatientDetailsInfo.FirstName = patientitem.Patient[0].FirstName;
            $scope.PatientDetailsInfo.MiddleName = patientitem.Patient[0].MiddleName;
            $scope.PatientDetailsInfo.LastName = patientitem.Patient[0].LastName;
            $scope.PatientDetailsInfo.SecondLastName = patientitem.Patient[0].SecondLastName;
            $scope.PatientDetailsInfo.SuffixName = patientitem.Patient[0].SuffixName;

            $scope.PatientDetailsInfo.FatherName = patientitem.Patient[0].FatherName;
            $scope.PatientDetailsInfo.MotherName = patientitem.Patient[0].MotherName;
            $scope.PatientDetailsInfo.Guardian = patientitem.Patient[0].Guardian;
            $scope.PatientDetailsInfo.Employer = patientitem.Patient[0].Employer;
            $scope.PatientDetailsInfo.BirthSex = patientitem.Patient[0].BirthSex;
            $scope.PatientDetailsInfo.EmergencyRelationId = patientitem.Patient[0].EmergencyRelationId || 0;

            $scope.PatientDetailsInfo.IsDiseased = patientitem.Patient[0].IsDiseased;
            $scope.PatientDetailsInfo.DateOfDeath = patientitem.Patient[0].DateOfDeath;
            $scope.PatientDetailsInfo.CauseOfDeath = patientitem.Patient[0].CauseOfDeath;
            $scope.PatientDetailsInfo.AuthorizedUserFullName = patientitem.Patient[0].AuthorizedUserFullName;
            $scope.PatientDetailsInfo.AuthorizedUserEmailId = patientitem.Patient[0].AuthorizedUserEmailId;
            $scope.PatientDetailsInfo.AuthorizedUserMobileNo = patientitem.Patient[0].AuthorizedUserMobileNo;
            $scope.PatientDetailsInfo.PreviousName = patientitem.Patient[0].PreviousName;

            patientitem.Patient[0].FaxNumber = patientitem.Patient[0].FaxNumber || "";
            if (patientitem.Patient[0].FaxNumber != "") {
                $scope.changeFaxNumber(patientitem.Patient[0].FaxNumber);
            } else {
                $scope.PatientDetailsInfo.FaxNumber = "";
                $scope.PatientDetailsInfo.FaxAreacode = "";
                $scope.PatientDetailsInfo.FaxHomeNumber = "";
            }


            $scope.PatientDetailsInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;
            $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls = patientitem.Patient[0].IsAllowAiAutomatedCalls || false;
            if (patientitem.Patient[0].DOB != "") {
                //$scope.PatientDetailsInfo.DOB = $filter('date')(new Date(patientitem.Patient[0].DOB), "MM-dd-yyyy");
                $scope.PatientDetailsInfo.DOB = $filter('date')(patientitem.Patient[0].DOB, "MM-dd-yyyy");
            } else {
                $scope.PatientDetailsInfo.DOB = "";
            }
            $scope.ageinYears = patientitem.Patient[0].AgeInYears;
            $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
            $scope.ageinDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
            $scope.PatientDetailsInfo.SocialSecurityNo = patientitem.Patient[0].SocialSecurityNo || "";
            if ($scope.PatientDetailsInfo.SocialSecurityNo == 0 || $scope.PatientDetailsInfo.SocialSecurityNo == "0") {
                $scope.PatientDetailsInfo.SocialSecurityNo = "";
            }
            $scope.PatientDetailsInfo.Gender = patientitem.Patient[0].Gender || "";

            if (patientitem.Patient[0].PatientOtherDetails.length > 0) {
                if (patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus != undefined && patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus != "") {
                    var MaritalStatusId = parseInt(patientitem.Patient[0].PatientOtherDetails[0].MaritalStatusId) || '';
                    var MaritalStatusName = patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus || "";
                    $scope.PatientDetailsInfo.MaritalStatusID = parseInt(MaritalStatusId);
                    $scope.PatientDetailsInfo.MaritalStatusName = MaritalStatusName;
                } else {
                    $scope.PatientDetailsInfo.MaritalStatusID = 0;
                    $scope.PatientDetailsInfo.MaritalStatusName = "";
                }
                $scope.PatientDetailsInfo.BloodGroupName = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupName || "";
                $scope.PatientDetailsInfo.BloodGroupId = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupId || 0;
            }

            $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode = patientitem.Patient[0].PatientHomeCode != '' ? patientitem.Patient[0].PatientHomeCode : '+1';
            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = patientitem.Patient[0].Altareacode || '';
            $scope.PatientDetailsInfo.ContactInfo.HomeNumber = patientitem.Patient[0].PatientHomeNumber || '';
            patientitem.Patient[0].MobileNo = patientitem.Patient[0].MobileNo || '';
            if (patientitem.Patient[0].MobileNo != "") {
                var mobile = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].MobileNo);
                $scope.PatientDetailsInfo.ContactInfo.MobileNumber = mobile.UsFormatMobileNumber;
            }
            if ($scope.PatientDetailsInfo.ContactInfo.HomeNumber === 0 || $scope.PatientDetailsInfo.ContactInfo.HomeNumber === "0" || $scope.PatientDetailsInfo.ContactInfo.HomeNumber === null) {
                $scope.PatientDetailsInfo.ContactInfo.HomeNumber = "";
            }

            $scope.PatientMNumber = patientitem.Patient[0].Altareacode + patientitem.Patient[0].PatientHomeNumber;

            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
            $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

            $scope.PatientDetailsInfo.ContactInfo.OfficeCountryCode = patientitem.Patient[0].OfficeCountryCode != '' ? patientitem.Patient[0].OfficeCountryCode : '+1';
            $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = patientitem.Patient[0].OfficeAreaCode || "";
            $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = patientitem.Patient[0].PatientOfficeNumber || "";
            patientitem.Patient[0].ContactNo = patientitem.Patient[0].ContactNo || "";
            if (patientitem.Patient[0].ContactNo != "") {
                var contact = eHnoteUserDataService.UsMobileFormatChange(patientitem.Patient[0].ContactNo);
                $scope.PatientDetailsInfo.ContactInfo.ContactNumber = contact.UsFormatMobileNumber;
            }
            if ($scope.PatientDetailsInfo.ContactInfo.OfficeNumber == 0 || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber == "0" || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber == null) {
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = "";
            }

            $scope.PatientOfficeumber = patientitem.Patient[0].OfficeAreaCode + patientitem.Patient[0].PatientOfficeNumber;

            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeumber);
            $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;


            $scope.PatientDetailsInfo.ContactInfo.EmailID = patientitem.Patient[0].EmailId || "";
            if (patientitem.PatientVitals.length > 0) {
                if (patientitem.PatientVitals[0].Vitals != undefined) {
                    if (patientitem.PatientVitals[0].Vitals.BLGId != undefined && patientitem.PatientVitals[0].Vitals.BLGId != "") {
                        var filterStatus = $filter("filter")($scope.BloodGroupList, { "Id": patientitem.PatientVitals[0].Vitals.BLGId }, true) || [];
                        if (filterStatus.length > 0) {
                            $scope.PatientDetailsInfo.BloodGroupName = filterStatus[0].BloodGroupName || "";
                            $scope.PatientDetailsInfo.BloodGroupId = filterStatus[0].Id || "";
                            $scope.PatientDetailsInfo.BloodGroupObj = filterStatus[0] || "";
                        }
                    }
                }
            }

            $scope.PatientDetailsInfo.PatientTagId = null;
            if (patientitem.Patient[0].PatientTagId != "" && patientitem.Patient[0].PatientTagId != 0 && patientitem.Patient[0].PatientTagId != null) {
                var filterStatus = [];
                var PatientTagId = parseInt(patientitem.Patient[0].PatientTagId) || 0;
                $scope.PatientDetailsInfo.PatientTagId = PatientTagId;
                filterStatus = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": PatientTagId }, true) || [];
                if (filterStatus.length > 0) {
                    $scope.PatientDetailsInfo.PatientTagName = filterStatus[0].HospitalEquipmentName;
                    $scope.PatientDetailsInfo.PatientTagObj = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": PatientTagId })[0];
                }
            }

            $scope.PatientDetailsInfo.PatientTagList = [];
            if (patientitem.Patient[0].PatientTagList.length > 0) {
                $scope.PatientDetailsInfo.PatientTagList = angular.copy(patientitem.Patient[0].PatientTagList);
            }

            $scope.PatientDetailsInfo.Age = patientitem.Patient[0].Age;
            $scope.PatientDetailsInfo.PatientDisplayID = patientitem.Patient[0].PatientDisplayId || "";
            $scope.PatientDetailsInfo.OldMrno = patientitem.Patient[0].OldMrno || "";
            $scope.PatientDetailsInfo.FullName = patientitem.Patient[0].FullName;
            $scope.PatientDetailsInfo.S3URL = patientitem.Patient[0].S3URL || "";

            $scope.PatientDetailsInfo.AgeInDays = patientitem.Patient[0].AgeInDays;
            $scope.PatientDetailsInfo.AgeInMonths = patientitem.Patient[0].AgeInMonths;
            $scope.PatientDetailsInfo.AgeInYears = patientitem.Patient[0].AgeInYears;

            $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = patientitem.Patient[0].IsPatientSmsInd || false;
            $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = patientitem.Patient[0].IsPatientEmailInd || false;
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

            $scope.PatientDetailsInfo.OccupationDescription = patientitem.Patient[0].OccupationDescription;
            $scope.PatientDetailsInfo.OccupationId = patientitem.Patient[0].OccupationId;
            $scope.PatientDetailsInfo.EmployerPhoneNo = patientitem.Patient[0].EmployerPhoneNo;
            $scope.PatientDetailsInfo.EmergencyContactName = patientitem.Patient[0].EmergencyContactName;
            $scope.PatientDetailsInfo.EmeregecyContactNo = patientitem.Patient[0].EmeregecyContactNo;

            $scope.PatientDetailsInfo.CreatedBy = patientitem.Patient[0].CreatedBy;
            $scope.PatientDetailsInfo.CreatedDt = patientitem.Patient[0].CreatedDt;
            $scope.PatientDetailsInfo.ModifiedBy = patientitem.Patient[0].ModifiedBy;
            $scope.PatientDetailsInfo.ModifiedDt = patientitem.Patient[0].ModifiedDt;

            $scope.PatientDetailsInfo.InternalComanagerId = patientitem.Patient[0].InternalComanagerId || 0;
            $scope.PatientDetailsInfo.ExternalComanagerId = patientitem.Patient[0].ExternalComanagerId || 0;
            $scope.PatientDetailsInfo.InternalComanagerName = patientitem.Patient[0].InternalComanagerName || "";
            $scope.PatientDetailsInfo.ExternalComanagerName = patientitem.Patient[0].ExternalComanagerName || "";

            $scope.PatientDetailsInfo.PCPDoctorName = patientitem.Patient[0].PCPDoctorName || '';
            $scope.PatientDetailsInfo.ReferralName = patientitem.Patient[0].ReferralName || '';
            $scope.PatientDetailsInfo.PCP = patientitem.Patient[0].PCP || '';
            $scope.PatientDetailsInfo.Referal = patientitem.Patient[0].Referral || '';
            $scope.PatientDetailsInfo.EmailId = patientitem.Patient[0].EmailId || '';
            $scope.PatientDetailsInfo.HospitalReferenceId = parseInt(patientitem.Patient[0].HospitalReferenceId) || null;
            $scope.PatientDetailsInfo.ReferenceNotes = patientitem.Patient[0].ReferenceNotes || '';
            $scope.PatientDetailsInfo.PatientAddress = patientitem.PatientAddress || {};
            $scope.PatientDetailsInfo.RefferalName = patientitem.Patient[0].ReferralName || '';

            console.log($scope.PatientDetailsInfo);
         /*   $scope.mainPatientProfileObj.PatientDetails = $scope.PatientDetailsInfo || {};*/

            $scope.FamilySummary = [];
            //$scope.FamilyInfo.FamilyArray = [];
            if (patientitem.FamilyDetails.length > 0) {
                angular.forEach(patientitem.FamilyDetails, function (fitem) {
                    var input = fitem.ContactNo;
                    var area = input.substring(0, 1);
                    var BranchMNumber = input.substring(2, 12);

                    var obj = eHnoteUserDataService.UsMobileFormatChange(BranchMNumber);
                    var BranchMobilenumber = obj.UsFormatMobileNumber;
                    var objitem = {
                        "PatientId": fitem.FamilyPatientId,
                        "FamilyId": fitem.Familyid || 0,
                        "DeleteInd": "N",
                        "Title": fitem.Title || "",
                        "TitleId": fitem.TitleId || 0,
                        "FirstName": fitem.FirstName,
                        "LastName": fitem.LastName,
                        "FullName": fitem.FullName,
                        "Relation": fitem.RelationName || "",
                        "RelationId": fitem.FamilyRelationShipId || 0,
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
                        "Gender": fitem.Gender || "",
                        "FamilyPhoneNumber": BranchMobilenumber,
                        "AddressLine1": fitem.AddressLine1 || '',
                        "AddressLine2": fitem.AddressLine2 || '',
                        "CountyId": fitem.CountyId || 0,
                        "CountyName": fitem.CountyName || '',
                        "CityId": fitem.CityId || 0,
                        "CityName": fitem.CityName || '',
                        "StateId": fitem.StateId || 0,
                        "StateName": fitem.StateName || '',
                        "CountryId": fitem.CountryId || 0,
                        "CountryName": fitem.CountryName || '',
                        "ZipCode": fitem.ZipCode,
                    }
                    if (fitem.DOB != "" && fitem.DOB != null && fitem.DOB != undefined) {
                        objitem.DOB = $filter("date")(fitem.DOB, "MM-dd-yyyy") || "";
                    }
                    var filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objitem.RelationId }, true) || [];
                    if (filterStatus.length > 0) {
                        objitem.Relation = filterStatus[0].RelationName;
                        objitem.RelationObj = filterStatus[0];
                    }
                    if (objitem.TitleId != null && objitem.TitleId != '') {
                        var filtertitle = $filter("filter")($scope.TitlesList, { "Id": objitem.TitleId }, true) || [];
                        if (filtertitle.length > 0) {
                            objitem.Title = filtertitle[0].Name;
                        }
                    }

                    $scope.FamilySummary.push(objitem);
                });
            } else {
                $scope.FamilyInfo = GetFamilyInfo();
                $scope.FamilySummary = [];
            }

            $scope.mainPatientProfileObj.FamilySummary = angular.copy($scope.FamilySummary);
            $scope.PatientInsuranceSummary = [];
            if (patientitem.patientInsuranceDetails.length > 0) {
                angular.forEach(patientitem.patientInsuranceDetails, function (initem) {
                    var objectinsurance = {
                        "CoverageId": initem.CoverageId,
                        "CoverageName": "",
                        "CoverageObj": "",
                        "PatientInsuranceDetailId": initem.PatientInsuranceDetailId,
                        "PlanId": initem.PlanId || 0,
                        "PlanName": initem.PlanName || "",
                        "PlanObj": "",
                        "Payor": "",
                        "PayorName": initem.PayorName || "",
                        "PayorId": initem.PayorId || 0,
                        "OrganizationPayorId": initem.OrganizationPayorId,
                        "OrganizationPayorName": initem.OrganizationPayorName,
                        "PayorObj": "",
                        "PlanTypeId": initem.PlanTypeId || 0,
                        "PlanDescription": initem.PlanDescriptionl || "", // initem.PlanTypeName || "",
                        "PolicyId": initem.PolicyId,
                        "GroupId": initem.GroupId || "",
                        "GroupName": initem.GroupName || "",
                        "RelationShipId": initem.RelationShipId || "",
                        "InsuranceRelationShipObj": "",
                        "PolicyHolder": initem.PolicyHolder || "",
                        "PolicyHolderName": initem.PolicyHolderName || "",
                        "Employer": "",
                        "Coinsurance": initem.Coinsurance || "",
                        "VisitCopay": initem.VisitCopay || "",
                        "EffectiveDate": "",
                        "ExpiryDate": "",
                        "ScanDate": "",
                        "VerifiedDate": "",
                        "DeleteInd": false,
                        "IsConnectToFutureAppointment": initem.IsConnectToFutureAppointment || false,
                        "AcceptAssign": initem.AcceptAssign || "",
                        "AssignBenifits": initem.AssignBenifits || "",
                        "ReleaseInfo": initem.ReleaseInfo || "",
                        "LaboratoryId": initem.LaboratoryId || 0,
                        "StatusId": initem.StatusId || 0,
                        "Comments": initem.Comments || "",
                        "MSPTrailerTypeId": initem.MSPTrailerTypeId || 0,
                        "Staff": initem.Staff || "",
                        "PatientDocumentDetails": angular.copy(initem.PatientDocumentDetails) || "",
                        "MsnTyp": "",
                        "IsAcceptAssign": 0,
                        "IsAcceptAssignBenifits": 0,
                        "IsReleaseInfo": 0,
                        "PatientBillingTypeId": 0,
                        "TempInsuranceImagesArray": [],
                        "InsuredPersonFirstName": initem.InsuredPersonFirstName || "",
                        "InsuredPersonGenderID": initem.InsuredPersonGenderID || "",
                        "InsuredPersonDOB": initem.InsuredPersonDOB || "",
                        "InsuredPersonSSN": initem.InsuredPersonSSN || "",
                        "RelationName": initem.RelationName || "",
                        "IdentifierId": initem.IdentifierId,
                        "IsDefaultBillingIns": initem.IsDefaultBillingIns || "",
                        "PCP": initem.PCP || "",
                        "IPA": initem.IPA || "",
                        "AppointmentInsuranceDetailId": initem.AppointmentInsuranceDetailId || 0,
                        "IsVerified": initem.IsVerified || false,
                        "PatientId": initem.PatientId,
                        "InsuredPersonMiddleName": initem.InsuredPersonMiddleName,
                        "InsuredPersonLastName": initem.InsuredPersonLastName,
                        "PatientFirstName": initem.PatientFirstName || "",
                        "PatientLastName": initem.PatientLastName || "",
                        "PatientDOB": initem.PatientDOB || "",
                        "PatientSSN": initem.PatientSSN || "",
                        "EligibilityStatusId": initem.EligibilityStatusId || 0,
                        "IsIdentifier": false,
                        "GlobalPayorId": initem.GlobalPayorId || "",
                        "InsuredPersonSecondLastName": initem.InsuredPersonSecondLastName || "",
                        "InsuredPersonSuffix": initem.InsuredPersonSuffix || "",
                        "PatientMiddleName": initem.PatientMiddleName || "",
                        "PatientSecondLastName": initem.PatientSecondLastName || "",
                        "PatientSuffix": initem.PatientSuffix || "",
                    }
                    objectinsurance.CoverageName = "";
                    var filter1 = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": initem.CoverageId }, true) || [];
                    if (filter1.length > 0) {
                        objectinsurance.CoverageName = filter1[0].CoverageName || "";
                    }

                    objectinsurance.Status = "";
                    var filter1 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": initem.StatusId }, true) || [];
                    if (filter1.length > 0) {
                        objectinsurance.Status = filter1[0].Value || "";
                    }

                    var filterStatus = [];
                    filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objectinsurance.RelationShipId }, true) || [];
                    if (filterStatus.length > 0) {
                        objectinsurance.InsuranceRelationShipObj = filterStatus[0];
                    }

                    if (initem.EffectiveDate != "" && initem.EffectiveDate != null) {
                        var date = initem.EffectiveDate;
                        var data1 = date.split("-").reverse().join("-");
                        objectinsurance.EffectiveDate = $filter("date")(data1, "MM-dd-yyyy") || "";
                    }
                    if (initem.ExpiryDate != "" && initem.ExpiryDate != null) {

                        var date = initem.ExpiryDate;
                        var data2 = date.split("-").reverse().join("-");
                        objectinsurance.ExpiryDate = $filter("date")(data2, "MM-dd-yyyy") || "";
                    }
                    if (initem.ScanDate != "" && initem.ScanDate != null) {
                        objectinsurance.ScanDate = $filter("date")(initem.ScanDate, "MM-dd-yyyy") || "";
                    }
                    if (initem.VerifiedDate != "" && initem.VerifiedDate != null) {
                        objectinsurance.VerifiedDate = $filter("date")(initem.VerifiedDate, "MM-dd-yyyy") || "";
                    }
                    if (initem.InsuredPersonDOB != "" && initem.InsuredPersonDOB != null) {
                        objectinsurance.InsuredPersonDOB = $filter("date")(initem.InsuredPersonDOB, "MM-dd-yyyy") || "";
                    }

                    $scope.PatientInsuranceSummary.push(objectinsurance);
                });
            }

            $scope.PatientDetailsInfo.AdditionalInfo = patientitem.Patient[0].AdditionalInfo;
            $scope.PatientDetailsInfo.PatientEthnicity = patientitem.PatientEthnicity;
            $scope.PatientDetailsInfo.PatientRace = patientitem.PatientRace;
            $scope.PatientDetailsInfo.PatientLanguage = patientitem.PatientLanguage;
            $scope.PatientDetailsInfo.PatientQuestions = patientitem.PatientQuestions || [];
            $scope.mainPatientProfileObj.PatientDetailSummary = angular.copy($scope.PatientDetailsInfo);

            var DemographicsList = patientitem.Patient[0].AdditionalInfo;
            $scope.DemographicSummary.Ethnicity = angular.copy(patientitem.PatientEthnicity);
            $scope.DemographicSummary.Race = angular.copy(patientitem.PatientRace);
            $scope.DemographicSummary.PreferedLanguage = angular.copy(patientitem.PatientLanguage);

            $scope.DemographicSummary.ExpressionId = DemographicsList.ExpressionId || 0;
            var filter1 = [];
            filter1 = $filter("filter")($scope.PatientLanguageExpressionList, { "LanguageExpressionId": $scope.DemographicSummary.ExpressionId }, true) || [];
            if (filter1.length > 0) {
                /*$scope.DemographicSummary.Expression = filter1[0].Value || "";*/
                $scope.DemographicSummary.Expression = filter1[0].LanguageExpression || "";
            } else {
                $scope.DemographicSummary.Expression = "";
            }
            $scope.DemographicSummary.ProficiencyId = DemographicsList.ProficiencyId || 0;
            var filter1 = [];
            filter1 = $filter("filter")($scope.PatientLanguageProficiencyList, { "LanguageProficiencyId": $scope.DemographicSummary.ProficiencyId }, true) || [];
            if (filter1.length > 0) {
                $scope.DemographicSummary.Proficiency = filter1[0].LanguageProficiency || "";
            } else {
                $scope.DemographicSummary.Proficiency = "";
            }
            $scope.DemographicSummary.PatientPrefixListId = DemographicsList.PatientPrefixListId || 0;
            var filter1 = [];
            filter1 = $filter("filter")($scope.PatientPrefixList, { "DropdownId": $scope.DemographicSummary.PatientPrefixListId }, true) || [];
            if (filter1.length > 0) {
                $scope.DemographicSummary.PatientPrefixListName = filter1[0].Value || "";
            } else {
                $scope.DemographicSummary.PatientPrefixListName = "";
            }
            $scope.DemographicSummary.PatinetSuffixId = DemographicsList.PatinetSuffixId || 0;
            var filter1 = [];
            filter1 = $filter("filter")($scope.PatientSuffixList, { "SuffixId": $scope.DemographicSummary.PatinetSuffixId }, true) || [];
            if (filter1.length > 0) {
                $scope.DemographicSummary.PatientSuffixName = filter1[0].Value || "";
            } else {
                $scope.DemographicSummary.PatientSuffixName = "";
            }
            $scope.DemographicSummary.SexualOrientationId = DemographicsList.SexualOrientationId || 0;
            var filter1 = [];
            filter1 = $filter("filter")($scope.PatientSexualOrientationList, { "SexualOrientationId": $scope.DemographicSummary.SexualOrientationId }, true) || [];
            if (filter1.length > 0) {
                $scope.DemographicSummary.SexualOrientation = filter1[0].SexualOrientation || "";
            } else {
                $scope.DemographicSummary.SexualOrientation = "";
            }
            $scope.DemographicSummary.GenderIdentityStatusId = DemographicsList.GenderIdentityId || 0;
            var filter1 = [];
            filter1 = $filter("filter")($scope.PatientGenderIdentityList, { "GenderIdentityId": $scope.DemographicSummary.GenderIdentityStatusId }, true) || [];
            if (filter1.length > 0) {
                $scope.DemographicSummary.GenderIdentityStatus = filter1[0].GenderIdentity || "";
            } else {
                $scope.DemographicSummary.GenderIdentityStatus = "";
            }

            $scope.DemographicSummary.FirstName = DemographicsList.FirstName || "";
            $scope.DemographicSummary.LastName = DemographicsList.LastName || "";
            $scope.DemographicSummary.MultipleBirth = DemographicsList.MultipleBirth || "";
            $scope.DemographicSummary.MothersMiddleName = DemographicsList.MothersMiddleName || "";

            $scope.DemographicSummary.EthnicityID = DemographicsList.EthnicityID || "";
            $scope.DemographicSummary.EthnicityName = DemographicsList.EthnicityName || "";
            $scope.DemographicSummary.RaceID = DemographicsList.RaceID || "";
            $scope.DemographicSummary.RaceName = DemographicsList.RaceName || "";
            $scope.DemographicSummary.LanguageID = DemographicsList.LanguageID || "";
            $scope.DemographicSummary.LanguageName = DemographicsList.LanguageName || "";

            $scope.DemographicSummary.LGuardianFirstName = DemographicsList.LGuardianFirstName || "";
            $scope.DemographicSummary.LGuardianMiddleName = DemographicsList.LGuardianMiddleName || "";
            $scope.DemographicSummary.LGuardianLastName = DemographicsList.LGuardianLastName || "";
            $scope.DemographicSummary.PatFatherFirstName = DemographicsList.PatFatherFirstName || "";
            $scope.DemographicSummary.LGuardianFullname = DemographicsList.LGuardianFullname || "";


            $scope.PatientDesignatedSummary.PCP = DemographicsList.PCP || 0;
            $scope.PatientDesignatedSummary.Referral = DemographicsList.Referral || 0;
            $scope.PatientDesignatedSummary.ExternalManager = DemographicsList.ExternalManager || 0;
            $scope.PatientDesignatedSummary.Corporation = DemographicsList.Corporation || 0;
            $scope.PatientDesignatedSummary.Office = DemographicsList.Office || 0;
            $scope.PatientDesignatedSummary.MasterReferralSourceId = DemographicsList.MasterReferralSourceId || 0;
            $scope.PatientDesignatedSummary.ReferralSourceId = DemographicsList.ReferralSourceId || 0;
            $scope.PatientDesignatedSummary.ReferralDate = DemographicsList.ReferralDate || "";
            if ($scope.PatientDesignatedSummary.ReferralDate != '') {
                $scope.PatientDesignatedSummary.ReferralDate = $filter('date')($scope.PatientDesignatedSummary.ReferralDate, "MM-dd-yyyy");
            }

            $scope.PatientDesignatedSummary.PatientPCPDocuments = angular.copy(patientitem.PatientPCPDocuments) || [];
            $scope.PatientDesignatedSummary.PatientReferalDocuments = angular.copy(patientitem.PatientReferalDocuments) || [];

            $scope.PatientDesignatedSummary.SummaryPcpDocument = angular.copy(patientitem.PatientPCPDocuments) || [];



            $scope.PatientDesignatedSummary.PCPDoctorName = patientitem.Patient[0].PCPDoctorName || "";

            $scope.PatientDesignatedSummary.ReferralName = patientitem.Patient[0].ReferralName || "";
            $scope.PatientDesignatedSummary.ExternalManagerName = patientitem.Patient[0].ExternalManagerName || "";
            $scope.PatientDesignatedSummary.CorporationName = DemographicsList.CorporationName || "";
            $scope.PatientDesignatedSummary.OfficeName = DemographicsList.OfficeName || "";

            if ($scope.PatientDesignatedSummary.MasterReferralSourceId != 0) {
                var filter1 = [];
                filter1 = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": $scope.PatientDesignatedSummary.MasterReferralSourceId }, true) || [];
                if (filter1.length > 0) {
                    $scope.PatientDesignatedSummary.MasterReferralSourceName = filter1[0].MasterReferralSourceName || "";
                }
            }
            if ($scope.PatientDesignatedSummary.ReferralSourceId != 0) {
                var filter1 = [];
                if ($scope.ReferralList != undefined && $scope.ReferralList.length > 0) {
                    filter1 = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedSummary.ReferralSourceId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.PatientDesignatedSummary.ReferralSourceName = filter1[0].ReferralTitle || "";
                    }

                } else {
                    $scope.PatientDesignatedSummary.ReferralSourceName = patientitem.Patient[0].PatientOtherDetails[0].ReferralName;
                }
            }
            $scope.PatientDesignatedSummary.EmployerName = DemographicsList.EmployerName || "";
            $scope.PatientDesignatedSummary.EmployerPhoneNo = DemographicsList.EmployerPhoneNo || "";
            $scope.PatientDesignatedSummary.OccupationDescription = DemographicsList.Occupation || "";
            $scope.PatientDesignatedSummary.OccupationId = DemographicsList.OccupationId || null;
            $scope.PatientDesignatedSummary.EmergencyContactName = DemographicsList.EmergencyContactName || "";
            $scope.PatientDesignatedSummary.EmeregecyContactNo = DemographicsList.EmeregecyContactNo || "";
            $scope.PatientDesignatedSummary.PcpNPI = DemographicsList.PcpNPI || "";
            $scope.PatientDesignatedSummary.ReferenceNumber = DemographicsList.ReferenceNumber || "";

            $scope.PatientDesignatedSummary.PCPContactNo = DemographicsList.PCPContactNo || "";
            $scope.PatientDesignatedSummary.IsPCPCoManagerInd = DemographicsList.IsPCPCoManagerInd || false;
            $scope.PatientDesignatedSummary.PCPNotes = DemographicsList.PCPNotes || "";
            $scope.PatientDesignatedSummary.PCPEmailId = DemographicsList.PCPEmailId || "";
            //  $scope.PatientDesignatedSummary.PCPReferralDate = DemographicsList.PCPReferralDate || "";
            $scope.PatientDesignatedSummary.ReferalNotes = DemographicsList.ReferalNotes || "";
            $scope.PatientDesignatedSummary.IsReferalCoManagerInd = DemographicsList.IsReferalCoManagerInd || false;
            $scope.PatientDesignatedSummary.ReferalReferenceNumber = DemographicsList.ReferalReferenceNumber || "";
            $scope.PatientDesignatedSummary.ReferalEmailId = DemographicsList.ReferalEmailId || "";
            $scope.PatientDesignatedSummary.ReferalNPI = DemographicsList.ReferalNPI || "";
            $scope.PatientDesignatedSummary.SourceDesignatedInfoNotes = DemographicsList.SourceDesignatedInfoNotes || "";
            $scope.PatientDesignatedSummary.ReferralContactNo = DemographicsList.ReferralContactNo || 0;
            $scope.PatientDesignatedSummary.PCPReferenceNumber = DemographicsList.PCPReferenceNumber || "";
            $scope.PatientDesignatedSummary.ReferalCheckBox = DemographicsList.ReferalCheckBox || false;
            $scope.PatientDesignatedSummary.SourceCheckBox = DemographicsList.SourceCheckBox || false;
            //  $scope.PatientDesignatedSummary.PCPCheckBox = DemographicsList.PCPCheckBox || true;
            $scope.PatientDesignatedSummary.PCPCheckBox = DemographicsList.PCPCheckBox || false;

            $scope.PatientDesignatedSummary.ReferralContact = DemographicsList.ReferralContact || "";

            $scope.PatientDesignatedSummary.PCPReferralDate = DemographicsList.PCPReferralDate || null;
            if ($scope.PatientDesignatedSummary.PCPReferralDate != null) {
                $scope.PatientDesignatedSummary.PCPReferralDate = $filter('date')($scope.PatientDesignatedSummary.PCPReferralDate, "MM-dd-yyyy");
            }

            $scope.PatientAddressSummary.PermanentAddress.AddressId = patientitem.PatientAddress.PermanentAddress.AddressId || 0;
            $scope.PatientAddressSummary.PermanentAddress.AddressLine1 = patientitem.PatientAddress.PermanentAddress.AddressLine1 || "";
            $scope.PatientAddressSummary.PermanentAddress.AddressLine2 = patientitem.PatientAddress.PermanentAddress.AddressLine2 || "";
            $scope.PatientAddressSummary.PermanentAddress.ZipCode = patientitem.PatientAddress.PermanentAddress.ZipCode || "";
            $scope.PatientAddressSummary.PermanentAddress.CountyId = patientitem.PatientAddress.PermanentAddress.CountyId;
            $scope.PatientAddressSummary.PermanentAddress.CountyName = patientitem.PatientAddress.PermanentAddress.CountyName;
            $scope.PatientAddressSummary.PermanentAddress.CityName = patientitem.PatientAddress.PermanentAddress.CityName;
            $scope.PatientAddressSummary.PermanentAddress.CityId = patientitem.PatientAddress.PermanentAddress.CityId;
            $scope.PatientAddressSummary.PermanentAddress.StateName = patientitem.PatientAddress.PermanentAddress.StateName;
            $scope.PatientAddressSummary.PermanentAddress.StateId = patientitem.PatientAddress.PermanentAddress.StateId;
            $scope.PatientAddressSummary.PermanentAddress.CountryName = patientitem.PatientAddress.PermanentAddress.CountryName;
            $scope.PatientAddressSummary.PermanentAddress.CountryId = patientitem.PatientAddress.PermanentAddress.CountryId;
            $scope.PatientAddressSummary.PermanentAddress.StateCode = patientitem.PatientAddress.PermanentAddress.StateCode;

            $scope.PatientAddressSummary.PostalAddress.AddressId = patientitem.PatientAddress.PostalAddress.AddressId || 0;
            $scope.PatientAddressSummary.PostalAddress.AddressLine1 = patientitem.PatientAddress.PostalAddress.AddressLine1 || "";
            $scope.PatientAddressSummary.PostalAddress.AddressLine2 = patientitem.PatientAddress.PostalAddress.AddressLine2 || "";
            $scope.PatientAddressSummary.PostalAddress.ZipCode = patientitem.PatientAddress.PostalAddress.ZipCode || "";
            $scope.PatientAddressSummary.PostalAddress.CountyId = patientitem.PatientAddress.PostalAddress.CountyId;
            $scope.PatientAddressSummary.PostalAddress.CountyName = patientitem.PatientAddress.PostalAddress.CountyName;
            $scope.PatientAddressSummary.PostalAddress.CityName = patientitem.PatientAddress.PostalAddress.CityName;
            $scope.PatientAddressSummary.PostalAddress.CityId = patientitem.PatientAddress.PostalAddress.CityId;
            $scope.PatientAddressSummary.PostalAddress.StateName = patientitem.PatientAddress.PostalAddress.StateName;
            $scope.PatientAddressSummary.PostalAddress.StateId = patientitem.PatientAddress.PostalAddress.StateId;
            $scope.PatientAddressSummary.PostalAddress.CountryName = patientitem.PatientAddress.PostalAddress.CountryName;
            $scope.PatientAddressSummary.PostalAddress.CountryId = patientitem.PatientAddress.PostalAddress.CountryId;
            $scope.PatientAddressSummary.PatientAddressDocuments = patientitem.PatientAddress.PatientAddressDocuments || [];
            $scope.PatientAddressSummary.PostalAddress.StateCode = patientitem.PatientAddress.PostalAddress.StateCode;
            //$scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            $scope.cacheStorageItem.PatientName = patientitem.Patient[0].FullName;
            $scope.AddToCache();




            if ($scope.PatientAddressSummary.PermanentAddress.ZipCode !== "") {
                $scope.searchCountyByZipCode($scope.PatientAddressSummary.PermanentAddress.ZipCode, "GetCounty");
            }
            if ($scope.PatientAddressSummary.PostalAddress.ZipCode !== "") {
                $scope.searchCountyByZipCode1($scope.PatientAddressSummary.PostalAddress.ZipCode, "GetCounty");
            }

            $scope.RegisterPatientNotes = GetRegisterPatientNotes();
            $scope.RegisterPatientNotesArray = patientitem.PatientNotesArray || [];


            $scope.PatientProfileStatusId = patientitem.Patient[0].ProfileStatusMasterId || 3;
            $scope.PatientprofileStatusDetails = {
                "ProfileStatusName": patientitem.Patient[0].ProfileStatus || "",
                "ProfileStatusMasterId": patientitem.Patient[0].ProfileStatusMasterId || 3,
            };




            if ($scope.PatientDetailsInfo.S3URL != '') {
                $scope.toDataURL($scope.PatientDetailsInfo.S3URL, function (dataURL) {
                    $scope.PatientProfileImageBase64 = dataURL;
                });
            } else {
                $scope.PatientProfileImageBase64 = "";
            }

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
        
        if (($scope.RoleId == 10 || $scope.RoleId == 1 || $scope.RoleId == 43 || $scope.RoleId == 16 || $scope.RoleId == 73) && ($scope.PreviousUrl == "/op" || ($scope.PreviousUrl == "ASC_PreAdm" && $scope.PreviousScreen == "calendar"))) { // Technician Login Visit screen
            if (IsNavProfileTechLogin == false) {
                $scope.mainPatientProfileObj.MainTab = 2;
                IsNavProfileTechLogin = true;
            } else {
                $scope.mainPatientProfileObj.MainTab = 1;
            }
        } else if (($scope.PreviousUrl == "ASC" || ($scope.PreviousUrl == "ASC_PreAdm" && $scope.PreviousScreen == "")) && $scope.cacheStorageItem.IsfromScreen != 'ascprofile') {
            if ($scope.cacheStorageItem.IsfromScreen == "preauth") {
                //$scope.mainPatientProfileObj.MainTab = 2; 
                //console.log("nav to profile screen");

                if (IsNavProfileTechLogin == false) {
                    $scope.mainPatientProfileObj.MainTab = 2; //1
                    IsNavProfileTechLogin = true;
                }
            } else {
                $scope.cacheStorageItem.SelectedAppointmentTypeId = $scope.cacheStorageItem.SelectedAppointmentTypeId || 0;
                if ($scope.cacheStorageItem.SelectedAppointmentTypeId == 4 || $scope.cacheStorageItem.SelectedAppointmentTypeId == 14 || $scope.cacheStorageItem.SelectedAppointmentTypeId == 7 || $scope.cacheStorageItem.SelectedAppointmentTypeId == 6) {
                    $scope.mainPatientProfileObj.AppointmentTypeId = $scope.cacheStorageItem.SelectedAppointmentTypeId;
                    $scope.mainPatientProfileObj.isAscChartShowInd = true;
                    $scope.mainPatientProfileObj.IsShowPatientSearch = true;
                    $scope.mainPatientProfileObj.MainTab = 8;
                }
            }
        } else {
            $scope.mainPatientProfileObj.MainTab = 1;
        }
    }
    $scope.init = function () {
        $scope.BranchesListArray = [];
        $scope.allUserList = [];
        $scope.patientInsuranceTpasArray = [];
        InitializeNewBranches(brancList);
        $scope.listval = [];
        $scope.checkval = doctorinfo.doctordata.UserParentBranch;
        angular.forEach($scope.checkval, function (item) {
            $scope.listval.push(item.OrganizationId);
        });
        var patientId = $scope.cacheStorageItem.PatientID || 0;

        var bobj = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 20
        };
        var params = {
            "OrganizationId": $scope.HospitalId||0,
            "FacilityName": ""
        }
        $q.all([
            eHnoteSettingsDataService.GetPatientRelatedMasterData(),
            eHnoteInsuranceService.getPatientInsuranceDtls(patientId),
            eHnoteSettingsDataService.GetOrganizationBillingProviders(bobj),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            eHnoteAuditServices.GetPatientDetailsByIdInProfileScreen(patientId),
        ]).then(function (resp) {
           
            if (resp[0].data.status === "Success") {
                $scope.PatientMasterDataArray = resp[0].data.rows;
                $scope.mainPatientProfileObj.AllMasterData = resp[0].data || {};
                $scope.PatientSuffixList = resp[0].data.PatientSuffix;
                $scope.PatientEthnicityList = resp[0].data.PatientEthnicity;
                if ($scope.PatientEthnicityList.length > 0) {
                    angular.forEach($scope.PatientEthnicityList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }
                $scope.PatientRaceList = resp[0].data.PatientRace;
                if ($scope.PatientRaceList.length > 0) {
                    angular.forEach($scope.PatientRaceList, function (kitem) {
                        kitem.IsSelected = false;
                        kitem.Id = 0;
                    });
                }

                $scope.PatientSexualOrientationList = resp[0].data.PatientSexualOrientation;
                $scope.PatientGenderIdentityList = resp[0].data.PatientGenderIdentity;
                $scope.PatientNationalityList = resp[0].data.PatientNationality;
                $scope.PatientLanguageList = resp[0].data.PatientLanguage;
                $scope.InsuranceRelationShipList = resp[0].data.InsuranceRelationShip;
                //$scope.InsuranceCoverageList = resp[8].data.rows;
                $scope.InsurancePlanTypeList = resp[0].data.InsurancePlanType;
                $scope.PatientPrefixList = resp[0].data.PatientTitle;
                $scope.PatientLanguageProficiencyList = resp[0].data.LanguageProficiency;
                $scope.PatientLanguageExpressionList = resp[0].data.LanguageExpression;
                $scope.PatientClassArray = resp[0].data.PatientClass;
                $scope.InsuranceCoverageList = resp[0].data.CoverageArray;
                $scope.InsuranceStatusList = resp[0].data.InsuranceStatus;

                if ($scope.InsuranceStatusList.length > 0) {
                  //  $scope.InsuranceStatusList = $filter("filter")($scope.InsuranceStatusList, function (item, index) { return item.StatusId !== 2 && item.StatusId !== 4 });
                }
                if (resp[0].data.TitleArray.length != 0) {
                    $scope.TitlesList = resp[0].data.TitleArray;
                    $scope.mainPatientProfileObj.TitlesList = $scope.TitlesList || [];
                    $scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
                    $scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;

                    $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id || 1;
                    $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
                }
                $scope.InsuranceStatusList1 = resp[0].data.InsuranceStatus;


                $scope.CoverageList = resp[0].data.InsuranceIdentifierList || [];
                if ($scope.CoverageList.length > 0) {
                    $scope.CoverageList = $filter("filter")($scope.CoverageList, function (item, index) { return item.IdentifierId !== 6 && item.IdentifierId !== 7 });
                    $scope.mainPatientProfileObj.CoverageList = angular.copy(resp[0].data.InsuranceIdentifierList)||[];
                }

                if (resp[0].data.HospitalEquipmentList.length > 0) {
                    angular.forEach(resp[0].data.HospitalEquipmentList, function (item) {
                        item.IsChecked = false;
                    });
                    $scope.HospitalEquipmentList = resp[0].data.HospitalEquipmentList;
                }
                if (resp[0].data.AppointmentTypes.length > 0) {
                    $scope.AppointmentTypes = resp[0].data.AppointmentTypes || [];
                }

            }

            if (resp[4] != undefined) {
                ongetPatientDetailsSuccess(resp[4])
            }
            if (resp[1].data !== undefined) {
                if (resp[1].data.rows.length > 0) {
                    $scope.patientInsuranceTpasArray = resp[1].data.rows;
                    $scope.mainPatientProfileObj.patientInsuranceTpasArray = $scope.patientInsuranceTpasArray || [];
                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                        bitem.isCorporateType = false;
                        if (bitem.BillingCategoryTypeId === 15) {
                            bitem.isCorporateType = true;
                        }
                    });
                    $scope.PatientInsuranceObj = GetInsuranceObj();
                    if ($scope.patientInsuranceTpasArray.length > 0) {
                        if ($scope.patientInsuranceTpasArray.length === 1) {
                            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;

                        }
                        else if ($scope.patientInsuranceTpasArray.length > 1) {
                            var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.setprimary = true;
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            } else {
                                $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            }
                        }

                        if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                            $scope.PatientInsuranceObj.setprimary = true;
                        } else {
                            $scope.PatientInsuranceObj.setprimary = false;
                        }
                    }
                    else {
                        $scope.PatientInsuranceObj.IdentifierId = 1;
                        $scope.PatientInsuranceObj.setprimary = true;
                    }

                    var filterlist = $filter("filter")($scope.patientInsuranceTpasArray, { "StatusId": 1 }, true) || [];
                    if (filterlist.length > 0) {
                        $scope.cacheStorageItem.IsInsuranceAvailable = true;
                    }
                    $scope.AddToCache();
                }
                $scope.ExpiredPatientInsuranceList = resp[1].data.ExpiredPatientInsuranceList || [];
            }
            if (resp[2].data.Status == "Success") {
                $scope.OrganizationBillingProviderList = resp[2].data.rows || [];
            }
            if (resp[3].data.status == "Success") {
                $scope.OrganizationClearingHouseDetails = resp[3].data.ConnectedClearingHouse || [];
                if (resp[3].data.DepositTypes.length > 0) {
                    $scope.mainPatientProfileObj.DepositTypes = resp[3].data.DepositTypes || [];
                }
                if (resp[3].data.WriteOffReasons.length > 0) {
                    $scope.mainPatientProfileObj.WriteOffReasons = resp[3].data.WriteOffReasons || [];
                }
                if (resp[3].data.Cardtype.length > 0) {
                    $scope.mainPatientProfileObj.CardTypesData = resp[3].data.Cardtype || [];
                }

            }
            //if (resp[4].data.status === "Success") {
            //    resp[4].data.rows = resp[4].data.rows || [];
            //    if (resp[4].data.rows.length > 0) {
            //        $scope.mainPatientProfileObj.OrganizationFacilityList = angular.copy(resp[4].data.rows);
            //    }

            //}
            
            //$scope.SelectPatient(patientId);

        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });

    };

    $scope.init();

   
    $scope.navtoVisitListScreen = function () {
        $scope.mainPatientProfileObj.MainTab = 2;
    }


    $scope.currentUrl = $location.url();
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.IsDynamicCheckInMandatory = false;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            if ($scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus === 1) {
                $scope.IsDynamicCheckInMandatory = true;
            }
        }
    }

    console.log($scope.currentUrl);


    $scope.resetAllConsultationArea = function (type) {
        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.AssessmentPlan = [];
        $scope.cacheStorageItem.OrderDetails = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.OccularHistory = [];
        $scope.cacheStorageItem.SystemicHistory = [];
        $scope.cacheStorageItem.VaccinationHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.FunctionalStatusHistory = [];
        $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = [];
        $scope.cacheStorageItem.OcularSurgicalHistory = [];
        $scope.cacheStorageItem.AllergyItems = [];
        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.AppointmentPatientUploads = [];


        $scope.cacheStorageItem.PatientInstructions = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
        $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = false;
        $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = false;
        $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
        $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = false;
        $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = false;
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.masterQuestions = [];
        $scope.cacheStorageItem.ContactLens = [];
        $scope.cacheStorageItem.ContactlensArray = [];
        $scope.cacheStorageItem.LacrimalPatiency = [];
        $scope.cacheStorageItem.PostDilatedExaminationArray = [];
        $scope.cacheStorageItem.VisionDetails = [];
        $scope.cacheStorageItem.GlassPrescription = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.SelectedConsultationType = "";
        $scope.cacheStorageItem.sendPatientEmail = false;
        $scope.cacheStorageItem.ReferalId = 0;
        $scope.cacheStorageItem.ReferalDoctorType = "";
        $scope.cacheStorageItem.ReferalDoctorId = "";
        $scope.cacheStorageItem.RefeRalDoctorNotes = '';
        $scope.cacheStorageItem.ReferalOrgId = "";
        $scope.cacheStorageItem.ReferalDoctorName = "";
        $scope.cacheStorageItem.isSendCaseHistoryMail = "";
        $scope.cacheStorageItem.isSendRefLetterMail = "";
        $scope.cacheStorageItem.isSendRefSms = "";
        $scope.cacheStorageItem.OptomComments = "";
        $scope.cacheStorageItem.DoctorNotesArray = [];
        $scope.cacheStorageItem.ClinicalNotesArray = [];
        $scope.cacheStorageItem.PatientNotesArray = [];
        $scope.cacheStorageItem.OptomNotesArray = [];
        $scope.cacheStorageItem.DoctorComments = "";
        if ($scope.cacheStorageItem.Vitals.length > 0) {
            $scope.ResetAllVitals();
        }
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.FollowUpDuration = "";
        $scope.cacheStorageItem.FollowUpDurationType = "";
        $scope.cacheStorageItem.FollowUpNotes = "";
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.LabtestList = [];
        $scope.cacheStorageItem.GoniscopyList = [];
        $scope.cacheStorageItem.IsVIPInd = false;
        $scope.cacheStorageItem.IsResearchInd = false;
        $scope.cacheStorageItem.IsHighRiskInd = false;
        $scope.cacheStorageItem.IsSendForDilationInd = false;
        $scope.cacheStorageItem.IsSendForInvestigationInd = false;
        $scope.cacheStorageItem.IsSendForLabTestInd = false;
        $scope.cacheStorageItem.IsSendForRecheckInd = false;
        $scope.cacheStorageItem.IsVIPRemarks = "";
        $scope.cacheStorageItem.IsResearchRemarks = "";
        $scope.cacheStorageItem.IsHighRiskRemarks = "";
        $scope.cacheStorageItem.IsSendForDilationRemarks = "";
        $scope.cacheStorageItem.IsSendForInvestigationRemarks = "";
        $scope.cacheStorageItem.IsSendForLabTestRemarks = "";
        $scope.cacheStorageItem.ClinicalNotesComments = "";
        $scope.cacheStorageItem.IsSendForRecheckRemarks = "";
        $scope.cacheStorageItem.PatientInstructionComments = "";
        $scope.cacheStorageItem.FollowUpArray = [];
        $scope.cacheStorageItem.AnteriorRemarks = "";
        $scope.cacheStorageItem.PosteriorRemarks = "";
        $scope.cacheStorageItem.LacrimalPatencyRemarks = "";
        $scope.cacheStorageItem.AnteriorIsNormal = false;
        $scope.cacheStorageItem.PosteriorIsNormal = false;
        $scope.cacheStorageItem.AdviceOrderArray = [];
        $scope.cacheStorageItem.VideoDetails = [];
        $scope.cacheStorageItem.TempImagesArray = [];
        $scope.cacheStorageItem.TempPdfArray = [];
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
    };

    $scope.Technishionsend = function (type, mainitem) {
        $scope.type = type || "";
        $scope.selectedoutPatient = mainitem || "";
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        if (appointmentinfo.CheckinStatusId != undefined) {
            if (type === "BacktoOP") {
                $rootScope.CurrentUrl = "/op";
                $location.url("/op");
                return false;
            } else if (appointmentinfo.CheckinStatusId === 1 && type != "NotCheckIN") {
                alertify.error("Please make sure patient is checked-in");
                return false;
            }
           
        }    
        $scope.IsShowCheckinDeatilsInd = false;
        var PatientObj = {
            "PatientName": $scope.PatientDetailsInfo.FullName,
            "PatientId": $scope.PatientDetailsInfo.PatientID,
            "PhAreaCD": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '',
            "PhCntryCD": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode || '',
            "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber || '',
            "MobileNo": $scope.PatientDetailsInfo.ContactInfo.MobileNumber || '',
            "DOB": $scope.PatientDetailsInfo.DOB || '',
            "OldMRNo": $scope.PatientDetailsInfo.OldMrno || '',
            "PatientDisplayId": $scope.PatientDetailsInfo.PatientDisplayID || '',
            "CheckInBy": "",
            "BookingStatusId": null,
            "ConsultationDt": appointmentinfo.ConsultationDt || '',
            "ConvertDateStartTime": appointmentinfo.ConvertDateStartTime || '',
            "SecondUserFullName": appointmentinfo.SecondUserFullName || '',
            "S3URL": $scope.PatientDetailsInfo.S3URL || '',


        };

        if ($scope.type == "") {
            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
            };
            eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                if (resp.data.Status === 'Success') {
                    if (resp.data.rows.length > 0) {
                        var DynamicStatusarray = resp.data.rows[0];
                        PatientObj.CheckInBy = DynamicStatusarray.CheckInBYName || "";
                        PatientObj.BookingStatusId = DynamicStatusarray.BookingStatusId || null;

                        //$scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                        $scope.DynamicStatusInstanceAdd = $uibModal.open({
                            templateUrl: "sendToPatientTemplate.html",
                            /*   "size": "lg",*/
                            "windowClass": "modal__ninety--",
                            "resolve": {
                                "HospitalId": function () { return $scope.HospitalId; },
                                "subSplArray": function () { return $scope.allSubSpecializationsArray; },
                                "allUserList": function () { return $scope.allUserList; },
                                "DoctorFullName": function () { return $scope.DoctorFullName; },
                                "appointmentid": function () { return $scope.cacheStorageItem.appointmentid; },
                                "AppointmentDoctorID": function () { return $scope.cacheStorageItem.AppointmentDoctorID; },
                                "patientid": function () { return $scope.patientid; },
                                "roleId": function () { return $scope.userLoginDetails.RoleID; },
                                "Type": function () { return $scope.type; },
                                "ProfileStatusMasterId": function () { return $scope.cacheStorageItem.ProfileStatusMasterId; },
                                "HospitalEquipmentList": function () { return $scope.HospitalEquipmentList; },
                                "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; },
                                "PatientObj": function () { return PatientObj || {}; }
                            },
                            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, Type, ProfileStatusMasterId, PatientObj, PatientDetailsInfo, HospitalEquipmentList) {
                                $scope.RoleId = roleId;
                                $scope.Type = Type;
                                $scope.HospitalId = HospitalId;
                                $scope.DoctorFullName = DoctorFullName;
                                $scope.allUserList = allUserList;
                                $scope.allSubSpecializationsArray = subSplArray;
                                $scope.appointmentid = appointmentid;
                                $scope.AppointmentDoctorID = AppointmentDoctorID;
                                $scope.patientid = patientid;
                                $scope.IsShowCheckinDeatilsInd = true;
                                $scope.ProfileStatusMasterId = ProfileStatusMasterId || 3;
                                $scope.PatientObj = PatientObj || {};
                                $scope.PatientDetailsInfo = PatientDetailsInfo || '';
                                $scope.HospitalEquipmentList = HospitalEquipmentList || [];
                                $scope.RoomType = {
                                    "IsSelectedCheckout": false,
                                    "IsSelectedExpressCheckout": false
                                };

                                // $scope.searchfilterforRoom = searchfilterforRoom;

                                // multiple tag patient list
                                let selectedPatientTagList = $scope.PatientDetailsInfo.PatientTagList || [];
                                $scope.SelectedPatientTagList = angular.copy($scope.HospitalEquipmentList);

                                angular.forEach(selectedPatientTagList, function (item) {
                                    angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                                        if (kitem.HospitalEquipmentId === item.HospitalEquipmentId) {
                                            kitem.IsChecked = true;
                                        }
                                    });
                                });

                                $scope.checkAllPatientTags = function (val) {
                                    if (val) {
                                        angular.forEach($scope.SelectedPatientTagList, function (item) {
                                            item.IsChecked = true;
                                        });

                                        $scope.TagPatientObj.SelectTag = 'All';
                                    }
                                    else {
                                        angular.forEach($scope.SelectedPatientTagList, function (item) {
                                            item.IsChecked = false;
                                        });

                                        $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
                                    }

                                };

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

                                $scope.stopClosingDropDown = function (event) {
                                    event.stopPropagation();
                                }

                                if ($scope.allUserList.length !== 0) {
                                    $scope.clinicDoctorList = [];
                                    $scope.Calendardoctorlist1 = [];

                                    //var RoleID = $scope.userLoginDetails.RoleID;
                                    $scope.AllCounsollerList = angular.copy($scope.allUserList);

                                    $scope.AllTechnicianList = angular.copy($scope.allUserList);

                                    $scope.AllDoctorList = angular.copy($scope.allUserList);

                                    $scope.AllBillingList = angular.copy($scope.allUserList);
                                    $scope.AllReceptionList = angular.copy($scope.allUserList);
                                    $scope.AllOpthaList = angular.copy($scope.allUserList);

                                    $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                        /* return item.RoleId === 1 || item.RoleId === 43;*/
                                        return (item.RoleId === 1 && item.SuffixId === 10) || (item.RoleId === 43 && item.SuffixId === 10);
                                    });

                                    $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                                    $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                                        return item.RoleId === 18;
                                    });

                                    $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                                    $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                                        return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                                    });

                                    $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                                    $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                                        return item.RoleId === 2 || item.RoleId === 19;
                                    });

                                    $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
                                    $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                                        return item.RoleId === 2;
                                    });

                                    $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                                    $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                                        /*return (item.RoleId === 1 && item.SuffixName === "OD") || (item.RoleId === 43 && item.SuffixName === "OD");*/
                                        return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13);
                                    });

                                }
                                $scope.searchfilterforRoom = {
                                    "txt1": "",
                                    "txt2": "",
                                    "txt3": "",
                                    "txt4": "",
                                    "txt5": "",
                                    "txt8": "",
                                    "txt9": "",
                                    "txt10": "",
                                    "txt11": "",

                                };
                                $scope.popup_value = 1;
                                eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                                    $scope.RoomTypeList = resp.data;
                                    $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });


                                }, function (err) {
                                    console.log(err);
                                    alertify.error("Getting  Failed");
                                });
                                $scope.switchtonexttab = function (val) {
                                    $scope.popup_value = val;
                                };

                                //$scope.cancel = function () {
                                //    $uibModalInstance.dismiss("cancel");
                                //};

                                $scope.RoomSearchObj = {
                                    "RoomTypeId": 0,
                                    "RoomId": 0,
                                    "RoomTypeobj": "",
                                    "Opthamobj": "",
                                    "OptomId": null,
                                    "Technicianobj": "",
                                    "TechnicianId": null,
                                    "Counsellorobj": "",
                                    "CounsellorId": null,
                                    "DilationAssistantobj": "",
                                    "DilationAssistantId": null,
                                    "DoctorId": null,
                                    "sendtoDoctorRoleId": null,
                                    "Roomobj": "",
                                    "Remarks": "",
                                    "SelectDoctor": "",
                                    "TransferUserId": eHnoteMasterDataService.getLoginId(),
                                    "sendtoDoctorId": "",
                                    "otherDocInd": false,
                                    "SubSpecialityObj": "",
                                    "SubSpecialityId": "",
                                    "NewApptEndTime": "",
                                    "NewApptStartTime": ""
                                }
                                $scope.ChangesSendToUser = function (item) {
                                    $scope.RoomSearchObj.TransferUserId = item.DoctorID;
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;

                                }
                                $scope.ChangesRoomType = function (item) {
                                    $scope.RoomSearchObj.NewApptStartTime = "";
                                    $scope.RoomSearchObj.NewApptEndTime = "";
                                    $scope.RoomSearchObj.otherDocInd = "N";
                                    $scope.RoomSearchObj.RoomTypeId = item;
                                    $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "", "txt9": "", "txt10": "", "txt11": "" };
                                    $scope.RoomSearchObj.SelectDoctor = "";
                                    $scope.RoomSearchObj.TransferUserId = "";

                                    if (item != 7) {
                                        $scope.RoomType.IsSelectedCheckout = false;
                                        $scope.RoomType.IsSelectedExpressCheckout = false;
                                    }

                                    if ($scope.RoomSearchObj.RoomTypeId === 1) {
                                        //  if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                                        //  $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                                        $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                                        $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;
                                        $scope.RoomSearchObj.TransferUserId = $scope.SelectDoctor.DoctorID || null;
                                        // }
                                        //else {
                                        //    $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                                        //}

                                    }

                                    var params = {
                                        "HospitalId": $scope.HospitalId,
                                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                        "SearchText": "",
                                        "PageNumber": 1,
                                        "PageSize": 100
                                    }
                                    eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                                        if (data.Status === "Success") {
                                            $scope.RoomListarray = data.rows || [];
                                        } else {
                                            $scope.RoomListarray = [];
                                        }

                                    }).error(function (error) {

                                    });


                                }

                                $scope.closeRoom = function (item) {
                                    $uibModalInstance.dismiss("cancel");
                                };


                                $scope.ChangesRoom = function (item) {
                                    item = item || null;
                                    if (item !== null) {
                                        $scope.RoomSearchObj.RoomId = item.RoomId || 0;
                                        $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability || 0;
                                        $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity || 0;
                                    } else {
                                        $scope.RoomSearchObj.RoomId = 0;
                                        $scope.RoomSearchObj.RoomAvailability = 0;
                                        $scope.RoomSearchObj.RoomCapacity = 0;
                                    }

                                };

                                $scope.ChangesOptham = function (item) {
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                    $scope.RoomSearchObj.OptomId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                    $scope.RoomSearchObj.CounsellorId = null;
                                    $scope.RoomSearchObj.TechnicianId = null;
                                    $scope.RoomSearchObj.DilationAssistantId = null;
                                    $scope.RoomSearchObj.DoctorId = null;
                                    $scope.RoomSearchObj.ARId = null;
                                    $scope.RoomSearchObj.BillingUserId = null;
                                    $scope.searchfilterforRoom.txt2 = "";
                                };

                                $scope.ChangesBillingUser = function (item) {
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                    $scope.RoomSearchObj.BillingUserId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                    $scope.RoomSearchObj.TechnicianId = null;
                                    $scope.RoomSearchObj.OptomId = null;
                                    $scope.RoomSearchObj.CounsellorId = null;
                                    $scope.RoomSearchObj.DilationAssistantId = null;
                                    $scope.RoomSearchObj.DoctorId = null;
                                    $scope.RoomSearchObj.ARId = null;
                                    $scope.searchfilterforRoom.txt9 = "";
                                };

                                $scope.ChangesReceptionUser = function (item) {
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                    $scope.RoomSearchObj.TechnicianId = null;
                                    $scope.RoomSearchObj.OptomId = null;
                                    $scope.RoomSearchObj.CounsellorId = null;
                                    $scope.RoomSearchObj.DilationAssistantId = null;
                                    $scope.RoomSearchObj.DoctorId = null;
                                    $scope.RoomSearchObj.ARId = null;
                                    $scope.RoomSearchObj.ReceptionId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                    $scope.searchfilterforRoom.txt10 = "";
                                };

                                //$scope.ChangesRoomDoctor = function (item) {
                                //    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                //    $scope.RoomSearchObj.DoctorId = item.DoctorID;
                                //    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                //    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                //    $scope.RoomSearchObj.OptomId = null;
                                //    $scope.RoomSearchObj.CounsellorId = null;
                                //    $scope.RoomSearchObj.DilationAssistantId = null;
                                //    $scope.RoomSearchObj.TechnicianId = null;
                                //    $scope.RoomSearchObj.ARId = null;
                                //    $scope.searchfilterforRoom.txt1 = "";
                                //    $scope.RoomSearchObj.BillingUserId = null;
                                //};
                                function reStructureDoctorSelectedSlots(resp) {
                                    if (resp.IsLeave) {
                                        alertify.error("Doctor is on Leave.Please choose another doctor");
                                        return false;
                                    }
                                    if (resp.UserConsultationNew.length > 0) {
                                        var apptTypeId = parseInt(appointmentinfo.AppointmentTypeId);
                                        resp.UserConsultationNew[0].NewAppointmentMaxSlots = resp.UserConsultationNew[0].NewAppointmentMaxSlots || 0;
                                        resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots = resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || 0;
                                        resp.UserConsultationNew[0].OTAppointmentMaxSlots = resp.UserConsultationNew[0].OTAppointmentMaxSlots || 0;
                                        if (apptTypeId == 1) {
                                            if (resp.UserConsultationNew[0].NewAppointmentMaxSlots != 0) {
                                                if (resp.DoctorNewAppointmentCount > resp.UserConsultationNew[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserConsultationNew[0].NewAppointmentMaxSlots) {
                                                    alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                                    return false;
                                                }
                                            }
                                        } else if (apptTypeId == 2 || apptTypeId == 3) {
                                            if (resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots != 0) {
                                                if (resp.DoctorFollowUpAppointmentCount > resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots) {
                                                    alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                                    return false;
                                                }
                                            }
                                        } else if (apptTypeId == 4 || apptTypeId == 14) {
                                            if (resp.UserConsultationNew[0].OTAppointmentMaxSlots != 0) {
                                                if (resp.DoctorAscAppointmentCount > resp.UserConsultationNew[0].OTAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserConsultationNew[0].OTAppointmentMaxSlots) {
                                                    alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                                                    return false;
                                                }
                                            }
                                        }
                                    }

                                    $scope.timeslots = [];
                                    var GivenDate = resp.Date;
                                    var CurrentDate = new Date();
                                    GivenDate = new Date(GivenDate);

                                    $scope.iscurrentDate = false;


                                    if (GivenDate > CurrentDate) {
                                        $scope.iscurrentDate = false;
                                    } else {
                                        $scope.iscurrentDate = true;
                                    }
                                    $scope.time = $filter('date')(new Date(), 'HH:mm');
                                    angular.forEach(resp.UserConsultationNew, function (item) {

                                        var arr = item.SlotStartTime.split(':');
                                        var shour = $.trim(arr[0]);
                                        var smin = $.trim(arr[1]);


                                        var arr2 = item.SlotEndTime.split(':')
                                        var ehour = $.trim(arr2[0]);
                                        var emin = $.trim(arr2[1]);
                                        var startingTime = moment().hours(shour).minutes(smin);
                                        var endingTime = moment().hours(ehour).minutes(emin);
                                        var currentStartTime = angular.copy(startingTime);
                                        var token = 1;
                                        while (currentStartTime < endingTime) {

                                            var slotObj = {
                                                "StartTime": currentStartTime.format("HH:mm"),
                                                "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                                "TokenNumber": token,
                                                "Available": "Y"
                                            }
                                            token++;
                                            $scope.timeslots.push(slotObj);


                                        }
                                        if ($scope.iscurrentDate === true) {
                                            $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                                        }
                                    });

                                    angular.forEach($scope.timeslots, function (item) {
                                        angular.forEach(resp.NormalSlots, function (item1) {
                                            if (item.StartTime == item1.StartTime) {
                                                item.Available = 'N';
                                            }
                                        });
                                    });

                                    $scope.setValue = [];
                                    if ($scope.timeslots.length > 0) {
                                        angular.forEach($scope.timeslots, function (item1) {
                                            if (item1.Available === 'Y') {
                                                var res = item1.StartTime.split(":");
                                                item1.StartTime = res[0] + ":" + res[1];
                                                $scope.setValue.push(item1);
                                            }
                                        });
                                        if ($scope.setValue.length > 0) {
                                            $scope.patinet_appStarttime = $scope.setValue[0];
                                            $scope.RoomSearchObj.NewApptStartTime = $scope.patinet_appStarttime.StartTime;
                                            $scope.RoomSearchObj.NewApptEndTime = $scope.patinet_appStarttime.EndTime;
                                            $scope.RoomSearchObj.otherDocInd = "Y";
                                        } else {
                                            alertify.error("Doctor Slot is not available.Please choose another doctor");
                                            $scope.setValue = [];
                                            $scope.patinet_appStarttime = "";
                                            $scope.RoomSearchObj.sendtoDoctorId = null;
                                            $scope.RoomSearchObj.NewApptStartTime = "";
                                            $scope.RoomSearchObj.NewApptEndTime = "";
                                            $scope.RoomSearchObj.otherDocInd = "N";

                                        }


                                    } else {
                                        alertify.error("Doctor is not available.Please choose another doctor");
                                        $scope.setValue = [];
                                        $scope.patinet_appStarttime = "";
                                        $scope.EndtimeVAlue = "";
                                        $scope.RoomSearchObj.NewApptStartTime = "";
                                        $scope.RoomSearchObj.NewApptEndTime = "";
                                        $scope.RoomSearchObj.otherDocInd = "N";
                                        $scope.RoomSearchObj.sendtoDoctorId = null;
                                        return;
                                    }
                                }
                                $scope.getUserBranchslots = function (item) {
                                    var SelectedDoctorId = parseInt(item.DoctorID);
                                    var SelectedUserBranchId = parseInt(item.UserBranchId);


                                    var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                                    var params = {
                                        "DoctorId": SelectedDoctorId,
                                        "UserBranchId": SelectedUserBranchId,
                                        "Date": appointmentDate
                                    }
                                    console.log(params);
                                    eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);

                                    function OnGetSuccess(response) {
                                        console.log(JSON.stringify(response));
                                        if (response.status === 'Success') {


                                            angular.forEach(response.NormalSlots, function (item) {
                                                item.StartTime = item.StartTime.substring(0, 5);
                                            });
                                            angular.forEach(response.TeleSlots, function (item) {
                                                item.StartTime = item.StartTime.substring(0, 5);
                                            });

                                            reStructureDoctorSelectedSlots(response);
                                        }

                                    }
                                    function OnGetError(response) {
                                        var MinPerCaseval = SelectedDoctorObj.MinPerCase || 5;
                                        bindDoctorSlots(MinPerCaseval, 'current');
                                    }








                                };
                                $scope.ChangesRoomDoctor = function (item) {

                                    if ($scope.AppointmentDoctorID == item.DoctorID) {
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.DoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.TransferUserId = item.DoctorID;
                                        $scope.RoomSearchObj.OptomId = null;
                                        $scope.RoomSearchObj.CounsellorId = null;
                                        $scope.RoomSearchObj.DilationAssistantId = null;
                                        $scope.RoomSearchObj.TechnicianId = null;
                                        $scope.RoomSearchObj.ARId = null;
                                        $scope.searchfilterforRoom.txt1 = "";
                                        $scope.RoomSearchObj.BillingUserId = null;
                                    } else {

                                        $scope.getUserBranchslots(item);
                                        $scope.RoomSearchObj.DoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                        $scope.RoomSearchObj.TransferUserId = item.DoctorID;
                                    }
                                };

                                $scope.ChangesCounsellor = function (item) {
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                    $scope.RoomSearchObj.CounsellorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                    $scope.RoomSearchObj.OptomId = null;
                                    $scope.RoomSearchObj.TechnicianId = null;
                                    $scope.RoomSearchObj.DilationAssistantId = null;
                                    $scope.RoomSearchObj.DoctorId = null;
                                    $scope.RoomSearchObj.ARId = null;
                                    $scope.searchfilterforRoom.txt4 = "";
                                    $scope.RoomSearchObj.BillingUserId = null;
                                };

                                $scope.ChangesTechnician = function (item) {
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                    $scope.RoomSearchObj.TechnicianId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                    $scope.RoomSearchObj.OptomId = null;
                                    $scope.RoomSearchObj.CounsellorId = null;
                                    $scope.RoomSearchObj.DilationAssistantId = null;
                                    $scope.RoomSearchObj.DoctorId = null;
                                    $scope.RoomSearchObj.ARId = null;
                                    $scope.searchfilterforRoom.txt5 = "";
                                    $scope.RoomSearchObj.BillingUserId = null;
                                };

                                $scope.ChangeOpthaUser = function (item) {
                                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                                    $scope.RoomSearchObj.TechnicianId = null;
                                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                                    $scope.RoomSearchObj.OptomId = item.DoctorID;
                                    $scope.RoomSearchObj.CounsellorId = null;
                                    $scope.RoomSearchObj.DilationAssistantId = null;
                                    $scope.RoomSearchObj.DoctorId = null;
                                    $scope.RoomSearchObj.ARId = null;
                                    $scope.searchfilterforRoom.txt11 = "";
                                    $scope.RoomSearchObj.BillingUserId = null;
                                };

                                $scope.ChangesCheckItem = function (item, checkoutItem) {
                                    if (checkoutItem === true) {
                                        $scope.RoomSearchObj.sendtoDoctorId = null;
                                        $scope.RoomSearchObj.RoomTypeobj = "";
                                        $scope.submitbutton = "Save";
                                        $scope.ChangesRoomType(item);
                                    } else {
                                        $scope.RoomSearchObj.RoomTypeobj = "";
                                        $scope.submitbutton = "Send";
                                    }
                                };

                                $scope.SendToRoom1 = function (item) {

                                    if ($scope.RoomSearchObj.RoomTypeId === 0) {
                                        alertify.error("Select Room Type");
                                        return false;
                                    }
                                    if ($scope.RoomSearchObj.RoomTypeId !== 7) {
                                        if ($scope.RoomSearchObj.RoomId === 0) {
                                            alertify.error("Select Room Type");
                                            return false;
                                        }
                                    }


                                    $scope.Time = $filter("date")(new Date(), "HH:mm");

                                    var params = {
                                        "UserId": eHnoteMasterDataService.getLoginId(),
                                        "PatientId": $scope.patientid,
                                        "AppointmentId": $scope.appointmentid,
                                        "BookingStatusId": $scope.PatientObj.BookingStatusId,
                                        "RoomId": $scope.RoomSearchObj.RoomId,
                                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                        "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
                                        // "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                                        "StartTime": $scope.Time,
                                        "PatientDynamicStatusId": 0,
                                        "status": "Waiting",
                                        "DoctorId": $scope.RoomSearchObj.DoctorId || null,
                                        "TechnicianId": $scope.RoomSearchObj.TechnicianId || null,
                                        "OptomId": $scope.RoomSearchObj.OptomId || null,
                                        "DilationAssistantId": null,
                                        "CounsellorId": $scope.RoomSearchObj.CounsellorId,
                                        "ARId": null,
                                        "IsCheckedOut": 2,
                                        "RoleId": $scope.RoleId
                                    }

                                    console.log($scope.RoleId);
                                    if (params.RoomTypeId === 7) {
                                        params.RoomId = null;
                                        params.IsCheckedOut = 3;
                                        // params.Status = 'Completed';
                                    }
                                    eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                                    }, function (err) {
                                        console.log(err);
                                        alertify.error("Getting Failed");
                                    });

                                    $uibModalInstance.dismiss("cancel");

                                }

                                $scope.SendToRoom = function (item) {
                                    $scope.RoomSearchObj.RoomTypeId = $scope.RoomSearchObj.RoomTypeId || 0;
                                    if ($scope.RoomSearchObj.RoomTypeId === 0) {
                                        alertify.error("Select Room Type");
                                        return false;
                                    }



                                    if ($scope.RoomSearchObj.RoomTypeId == 1 && $scope.RoomSearchObj.otherDocInd === "Y") {
                                        $scope.RoomSearchObj.sendtoDoctorId = $scope.RoomSearchObj.sendtoDoctorId || 0;
                                        if ($scope.RoomSearchObj.sendtoDoctorId === 0) {
                                            alertify.error("Select Doctor");
                                            return false;
                                        }
                                    }
                                    if ($scope.RoomSearchObj.otherDocInd === "Y") {
                                        if ($scope.RoomSearchObj.NewApptStartTime === "") {
                                            alertify.error("Doctor is not available.Please choose another doctor");
                                            return false;
                                        }
                                    }
                                    //if ($scope.RoomSearchObj.RoomTypeId !== 7) {
                                    //    if ($scope.RoomSearchObj.RoomId === 0) {
                                    //        alertify.error("Select Room Type");
                                    //        return false;
                                    //    }
                                    //}

                                    $scope.PatientTagList = [];
                                    let selectedPatientTagList = $filter('filter')($scope.SelectedPatientTagList, { "IsChecked": true }, true);
                                    $scope.PatientTagList = angular.copy(selectedPatientTagList);

                                    $scope.Time = $filter("date")(new Date(), "HH:mm");
                                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                    var params = {
                                        "UserId": eHnoteMasterDataService.getLoginId(),
                                        "TransferUserId": $scope.RoomSearchObj.TransferUserId,
                                        "HospitalId": $scope.HospitalId,
                                        "AppointmentId": $scope.appointmentid,
                                        "AppointmentTrackerDetailId": 0,
                                        "RoleId": $scope.RoleId,
                                        "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                        "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                        "RoomId": $scope.RoomSearchObj.RoomId,
                                        "IsSendTo": "Y",
                                        "IsRollBack": "N",
                                        "IsCheckedIn": "N",
                                        "CurrentTime": $scope.CurrentTime,
                                        "Remarks": $scope.RoomSearchObj.Remarks || '',
                                        "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                                        "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                                        "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                                        "IsCheckedOut": "N",
                                        "IsReCheckIn": "N",
                                        "IsReCheckOut": "N",
                                        "IsExpressCheckedOut": "N",
                                        "BookingStatusId": $scope.PatientObj.BookingStatusId,
                                        "PatientTagList": $scope.PatientTagList || []
                                    }

                                    console.log($scope.RoleId);
                                    if (params.RoomTypeId === 7 && !$scope.RoomType.IsSelectedExpressCheckout) {
                                        params.RoomId = null;
                                        params.IsCheckedOut = "Y";
                                        params.Status = 'Completed';
                                    } else if (params.RoomTypeId === 7 && $scope.RoomType.IsSelectedExpressCheckout) {
                                        params.RoomId = null;
                                        params.IsExpressCheckedOut = "Y";
                                        params.Status = 'Completed';
                                    }
                                    eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                        if (resp.data.Status == "Success") {

                                        } else {
                                            alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                        }
                                    }, function (err) {
                                        console.log(err);
                                        alertify.error("Getting Failed");
                                    });
                                    $uibModalInstance.close();
                                    /*  $uibModalInstance.close("cancel");*/

                                }

                            },



                        });
                        $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
                            if ($scope.type == 'OutPatient') {
                                $scope.SelectPatient($scope.selectedoutPatient.PatientId);
                                $scope.parentProfileTab.MainTab = 1;
                                $scope.showpatientsummary = false;

                                $scope.IsConsultationCompleted = false;
                                $scope.resetAllConsultationArea();
                                $scope.ClickPatientProfile($scope.selectedoutPatient);
                                $scope.ConsultationObj.SummaryView = false;
                                $scope.SaveTypeObj.TypeName = "";
                            } else if ($scope.type == 'BacktoOP') {
                                //  $location.url("/op");
                                console.log($scope.PreviousUrl);


                                if ($scope.currentUrl === '/profile') {
                                    $location.url($scope.PreviousUrl);
                                }
                                if ($scope.currentUrl === '/newbiller') {
                                    $location.url("/Biller");
                                }
                            }
                            else {
                                $location.url($scope.PreviousUrl);
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
        else {
            PatientObj.CheckInBy = "";
            $scope.DynamicStatusInstanceAdd = $uibModal.open({
                templateUrl: "sendToPatientTemplate.html",
                /* "size": "lg",*/
                "windowClass": "modal__ninety--",
                "resolve": {
                    "HospitalId": function () { return $scope.HospitalId; },
                    "subSplArray": function () { return $scope.allSubSpecializationsArray; },
                    "allUserList": function () { return $scope.allUserList; },
                    "DoctorFullName": function () { return $scope.DoctorFullName; },
                    "appointmentid": function () { return $scope.cacheStorageItem.appointmentid; },
                    "AppointmentDoctorID": function () { return $scope.cacheStorageItem.AppointmentDoctorID; },
                    "patientid": function () { return $scope.patientid; },
                    "roleId": function () { return $scope.userLoginDetails.RoleID; },
                    "Type": function () { return $scope.type; },
                    "PatientprofileStatusDetails": function () { return $scope.PatientprofileStatusDetails; },
                    "HospitalEquipmentList": function () { return $scope.HospitalEquipmentList; },
                    "AppointmentObj": function () { return appointmentinfo; },
                    "ProfileStatusMasterId": function () { return $scope.cacheStorageItem.ProfileStatusMasterId; },
                    "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; },
                    "selectedoutPatient": function () { return angular.copy($scope.selectedoutPatient); },
                    "PatientObj": function () { return PatientObj || {}; }

                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMainAdminServices, HospitalId, allUserList, subSplArray, DoctorFullName, appointmentid, patientid, roleId, AppointmentDoctorID, Type, PatientprofileStatusDetails, HospitalEquipmentList, AppointmentObj, ProfileStatusMasterId, PatientDetailsInfo, selectedoutPatient, PatientObj) {
                    $scope.PatientDetailsInfo = PatientDetailsInfo || "";
                    $scope.RoleId = roleId;
                    $scope.Type = Type;
                    $scope.HospitalId = HospitalId;
                    $scope.DoctorFullName = DoctorFullName;
                    $scope.allUserList = allUserList;
                    $scope.allSubSpecializationsArray = subSplArray;
                    $scope.appointmentid = appointmentid;
                    $scope.AppointmentDoctorID = AppointmentDoctorID;
                    $scope.patientid = patientid;
                    $scope.PatientprofileStatusDetails = PatientprofileStatusDetails || {};
                    $scope.HospitalEquipmentList = HospitalEquipmentList || [];
                    $scope.AppointmentObj = AppointmentObj || {};
                    $scope.IsShowCheckinDeatilsInd = true;
                    $scope.ProfileStatusMasterId = ProfileStatusMasterId || 3;
                    $scope.PatientObj = PatientObj || {};

                    $scope.RoomType = {
                        "IsSelectedCheckout": false,
                        "IsSelectedExpressCheckout": false
                    };

                    // multiple tag patient list
                    let selectedPatientTagList = $scope.PatientDetailsInfo.PatientTagList || [];
                    $scope.SelectedPatientTagList = angular.copy($scope.HospitalEquipmentList);

                    angular.forEach(selectedPatientTagList, function (item) {
                        angular.forEach($scope.SelectedPatientTagList, function (kitem) {
                            if (kitem.HospitalEquipmentId === item.HospitalEquipmentId) {
                                kitem.IsChecked = true;
                            }
                        });
                    });

                    $scope.TagPatientObj = {
                        "SelectTag": "Select Tag Patient",
                        "PatientTag": "",
                        "AllPatientTagsCheck": false,
                    };

                    $scope.checkAllPatientTags = function (val) {
                        if (val) {
                            angular.forEach($scope.SelectedPatientTagList, function (item) {
                                item.IsChecked = true;
                            });

                            $scope.TagPatientObj.SelectTag = 'All';
                        }
                        else {
                            angular.forEach($scope.SelectedPatientTagList, function (item) {
                                item.IsChecked = false;
                            });

                            $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
                        }

                    };

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

                    $scope.stopClosingDropDown = function (event) {
                        event.stopPropagation();
                    }

                    $scope.selectedoutPatient = selectedoutPatient || {};
                    if ($scope.Type == 'NotCheckIN') {
                        $scope.ApptObj = {
                            "VisitTypeId": $scope.selectedoutPatient.VisitTypeId || 0,
                            "HospitalEquipmentId": $scope.selectedoutPatient.PatientTagId || "",
                            "Type": Type || "",
                            "SerachText": "",
                            "VisitReasonName": $scope.selectedoutPatient.VisitReason,
                            "AppointmentStatusId": $scope.selectedoutPatient.AppointmentStatusId || null,
                            "BookingStatusId": $scope.selectedoutPatient.BookingStatusId || 2,



                        };
                    } else {
                        $scope.ApptObj = {
                            "VisitTypeId": $scope.AppointmentObj.VisitTypeId || 0,
                            "HospitalEquipmentId": $scope.AppointmentObj.PatientTagId || "",
                            "Type": Type || "",
                            "SerachText": "",
                            "VisitReasonName": $scope.AppointmentObj.VisitReason,
                            "AppointmentStatusId": $scope.AppointmentObj.AppointmentStatusId || null,
                            "BookingStatusId": $scope.AppointmentObj.BookingStatusId || 2,
                        };
                    }

                    $scope.onSelectVisitReason = function (item) {
                        item = item || "";
                        if (item.ReasonId !== "") {
                            $scope.ApptObj.VisitReasonName = item.Reason;
                            $scope.ApptObj.VisitReasonId = item.ReasonId || 0;
                            // $scope.ApptObj.VisitTypeId = item.VisitTypeId;
                            $scope.ApptObj.VisitTypeId = item.ReasonId; // in DB visittypeid means VisitReasonId
                        }
                    }

                    // $scope.searchfilterforRoom = searchfilterforRoom;
                    if ($scope.allUserList.length !== 0) {
                        $scope.clinicDoctorList = [];
                        $scope.Calendardoctorlist1 = [];

                        //var RoleID = $scope.userLoginDetails.RoleID;
                        $scope.AllCounsollerList = angular.copy($scope.allUserList);

                        $scope.AllTechnicianList = angular.copy($scope.allUserList);

                        $scope.AllDoctorList = angular.copy($scope.allUserList);

                        $scope.AllBillingList = angular.copy($scope.allUserList);
                        $scope.AllReceptionList = angular.copy($scope.allUserList);
                        $scope.AllOpthaList = angular.copy($scope.allUserList);

                        $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                        $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                            /*return item.RoleId === 1 || item.RoleId === 43;*/
                            return (item.RoleId === 1 && item.SuffixId === 10) || (item.RoleId === 43 && item.SuffixId === 10);
                        });

                        $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                        $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                            return item.RoleId === 18;
                        });

                        $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                        $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                            return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                        });

                        $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                        $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                            return item.RoleId === 2 || item.RoleId === 19;
                        });

                        $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
                        $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                            return item.RoleId === 2;
                        });

                        $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                        $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                            /*return (item.RoleId === 1 && item.SuffixName === "OD") || (item.RoleId === 43 && item.SuffixName === "OD");*/
                            return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13);
                        });

                    }
                    $scope.searchfilterforRoom = {
                        "txt1": "",
                        "txt2": "",
                        "txt3": "",
                        "txt4": "",
                        "txt5": "",
                        "txt8": "",
                        "txt9": "",
                        "txt10": "",
                        "txt11": "",
                    };
                    $scope.popup_value = 1;
                    eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                        $scope.RoomTypeList = resp.data;
                        $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });

                        if ($scope.Type == 'NotCheckIN') {
                            $scope.RoomTypeList = $filter("filter")($scope.RoomTypeList, function (item, index) { return item.Id !== 7 });
                        }

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting  Failed");
                    });
                    $scope.switchtonexttab = function (val) {
                        $scope.popup_value = val;
                    };

                    $scope.GetVisitReasonfunction = function (val) {
                        var AppointmentTypeId = "";
                        if ($scope.Type == 'NotCheckIN') {
                            AppointmentTypeId = $scope.selectedoutPatient.AppointmentTypeId;
                        } else {
                            AppointmentTypeId = $scope.AppointmentObj.AppointmentTypeId;
                        }

                        var getParams = {
                            "OrganizationId": $scope.HospitalId,
                            "ReasonTypeId": 1,
                            "SearchText": val || "",
                            "VisitTypeId": $scope.selectedoutPatient.AppointmentTypeId || null
                        };
                        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
                            if (resp.data !== undefined) {
                                if (resp.data.rows.length > 0) {
                                    $scope.GetVisitReasonsArray = [];
                                    $scope.GetVisitReasonsArray = $filter("filter")(resp.data.rows, function (kitem) {
                                        return kitem.ActiveIND == "Y";
                                    });
                                }

                            }
                        });
                    }
                    if ($scope.Type == 'NotCheckIN') {
                        $scope.GetVisitReasonfunction();
                    }
                    $scope.GetVisitReasonfunction();
                    //$scope.cancel = function () {
                    //    $uibModalInstance.dismiss("cancel");
                    //};

                    $scope.RoomSearchObj = {
                        "RoomTypeId": 0,
                        "RoomId": 0,
                        "RoomTypeobj": "",
                        "Opthamobj": "",
                        "OptomId": null,
                        "Technicianobj": "",
                        "TechnicianId": null,
                        "Counsellorobj": "",
                        "CounsellorId": null,
                        "DilationAssistantobj": "",
                        "DilationAssistantId": null,
                        "DoctorId": null,
                        "sendtoDoctorRoleId": null,
                        "Roomobj": "",
                        "Remarks": "",
                        "SelectDoctor": "",
                        "sendtoDoctorId": "",
                        "TransferUserId": eHnoteMasterDataService.getLoginId(),
                        "otherDocInd": false,
                        "SubSpecialityObj": "",
                        "SubSpecialityId": "",
                        "NewApptEndTime": "",
                        "NewApptStartTime": ""
                    }

                    $scope.ChangesSendToUser = function (item) {
                        $scope.RoomSearchObj.TransferUserId = item.DoctorID;
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        //$scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        //$scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    }

                    $scope.ChangesRoomType = function (item) {
                        $scope.RoomSearchObj.NewApptStartTime = "";
                        $scope.RoomSearchObj.NewApptEndTime = "";
                        $scope.RoomSearchObj.otherDocInd = "N";
                        $scope.RoomSearchObj.RoomTypeId = item;
                        $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "", "txt9": "", "txt10": "", "txt11": "" };
                        $scope.RoomSearchObj.SelectDoctor = "";
                        $scope.RoomSearchObj.TransferUserId = "";

                        if (item != 7) {
                            $scope.RoomType.IsSelectedCheckout = false;
                            $scope.RoomType.IsSelectedExpressCheckout = false;
                        }

                        if ($scope.RoomSearchObj.RoomTypeId === 1) {
                            //  if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                            //  $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                            $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                            $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;
                            $scope.RoomSearchObj.TransferUserId = $scope.SelectDoctor.DoctorID || null;
                            // }
                            //else {
                            //    $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                            //}

                        }

                        var params = {
                            "HospitalId": $scope.HospitalId,
                            "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                            "SearchText": "",
                            "PageNumber": 1,
                            "PageSize": 100
                        }
                        eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                            if (data.Status === "Success") {
                                $scope.RoomListarray = data.rows || [];
                            } else {
                                $scope.RoomListarray = [];
                            }

                        }).error(function (error) {

                        });


                    }

                    $scope.closeRoom = function (item) {
                        $uibModalInstance.dismiss("cancel");
                    };


                    $scope.ChangesRoom = function (item) {
                        item = item || null;
                        if (item !== null) {
                            $scope.RoomSearchObj.RoomId = item.RoomId || 0;
                            $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability || 0;
                            $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity || 0;
                        } else {
                            $scope.RoomSearchObj.RoomId = 0;
                            $scope.RoomSearchObj.RoomAvailability = 0;
                            $scope.RoomSearchObj.RoomCapacity = 0;
                        }

                    };

                    $scope.ChangesOptham = function (item) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.OptomId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.CounsellorId = null;
                        $scope.RoomSearchObj.TechnicianId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.DoctorId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.RoomSearchObj.BillingUserId = null;
                        $scope.searchfilterforRoom.txt2 = "";
                    };

                    $scope.ChangesBillingUser = function (item) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.BillingUserId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.TechnicianId = null;
                        $scope.RoomSearchObj.OptomId = null;
                        $scope.RoomSearchObj.CounsellorId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.DoctorId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.searchfilterforRoom.txt9 = "";
                    };

                    $scope.ChangesReceptionUser = function (item) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.TechnicianId = null;
                        $scope.RoomSearchObj.OptomId = null;
                        $scope.RoomSearchObj.CounsellorId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.DoctorId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.RoomSearchObj.ReceptionId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.searchfilterforRoom.txt10 = "";
                    };

                    //$scope.ChangesRoomDoctor = function (item) {
                    //    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    //    $scope.RoomSearchObj.DoctorId = item.DoctorID;
                    //    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    //    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    //    $scope.RoomSearchObj.OptomId = null;
                    //    $scope.RoomSearchObj.CounsellorId = null;
                    //    $scope.RoomSearchObj.DilationAssistantId = null;
                    //    $scope.RoomSearchObj.TechnicianId = null;
                    //    $scope.RoomSearchObj.ARId = null;
                    //    $scope.searchfilterforRoom.txt1 = "";
                    //    $scope.RoomSearchObj.BillingUserId = null;
                    //};
                    function reStructureDoctorSelectedSlots(resp) {
                        if (resp.IsLeave) {
                            alertify.error("Doctor is on Leave.Please choose another doctor");
                            return false;
                        }
                        if (resp.UserConsultationNew.length > 0) {
                            var apptTypeId = parseInt(appointmentinfo.AppointmentTypeId);
                            resp.UserConsultationNew[0].NewAppointmentMaxSlots = resp.UserConsultationNew[0].NewAppointmentMaxSlots || 0;
                            resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots = resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || 0;
                            resp.UserConsultationNew[0].OTAppointmentMaxSlots = resp.UserConsultationNew[0].OTAppointmentMaxSlots || 0;
                            if (apptTypeId == 1) {
                                if (resp.UserConsultationNew[0].NewAppointmentMaxSlots != 0) {
                                    if (resp.DoctorNewAppointmentCount > resp.UserConsultationNew[0].NewAppointmentMaxSlots || resp.DoctorNewAppointmentCount == resp.UserConsultationNew[0].NewAppointmentMaxSlots) {
                                        alertify.error("Maximum new appointments are reached for this doctor. Please choose another doctor");
                                        return false;
                                    }
                                }
                            } else if (apptTypeId == 2 || apptTypeId == 3) {
                                if (resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots != 0) {
                                    if (resp.DoctorFollowUpAppointmentCount > resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots || resp.DoctorFollowUpAppointmentCount == resp.UserConsultationNew[0].FollowUpAppointmentMaxSlots) {
                                        alertify.error("Maximum followup appointments are reached for this doctor. Please choose another doctor");
                                        return false;
                                    }
                                }
                            } else if (apptTypeId == 4 || apptTypeId == 14) {
                                if (resp.UserConsultationNew[0].OTAppointmentMaxSlots != 0) {
                                    if (resp.DoctorAscAppointmentCount > resp.UserConsultationNew[0].OTAppointmentMaxSlots || resp.DoctorAscAppointmentCount == resp.UserConsultationNew[0].OTAppointmentMaxSlots) {
                                        alertify.error("Maximum ASC appointments are reached for this doctor. Please choose another doctor");
                                        return false;
                                    }
                                }
                            }
                        }

                        $scope.timeslots = [];
                        var GivenDate = resp.Date;
                        var CurrentDate = new Date();
                        GivenDate = new Date(GivenDate);

                        $scope.iscurrentDate = false;


                        if (GivenDate > CurrentDate) {
                            $scope.iscurrentDate = false;
                        } else {
                            $scope.iscurrentDate = true;
                        }
                        $scope.time = $filter('date')(new Date(), 'HH:mm');
                        angular.forEach(resp.UserConsultationNew, function (item) {

                            var arr = item.SlotStartTime.split(':');
                            var shour = $.trim(arr[0]);
                            var smin = $.trim(arr[1]);


                            var arr2 = item.SlotEndTime.split(':')
                            var ehour = $.trim(arr2[0]);
                            var emin = $.trim(arr2[1]);
                            var startingTime = moment().hours(shour).minutes(smin);
                            var endingTime = moment().hours(ehour).minutes(emin);
                            var currentStartTime = angular.copy(startingTime);
                            var token = 1;
                            while (currentStartTime < endingTime) {

                                var slotObj = {
                                    "StartTime": currentStartTime.format("HH:mm"),
                                    "EndTime": currentStartTime.add(item.MinPerCase, "minute").format("HH:mm"),
                                    "TokenNumber": token,
                                    "Available": "Y"
                                }
                                token++;
                                $scope.timeslots.push(slotObj);


                            }
                            if ($scope.iscurrentDate === true) {
                                $scope.timeslots = $filter("filter")($scope.timeslots, function (kitem, index) { return kitem.StartTime > $scope.time });
                            }
                        });

                        angular.forEach($scope.timeslots, function (item) {
                            angular.forEach(resp.NormalSlots, function (item1) {
                                if (item.StartTime == item1.StartTime) {
                                    item.Available = 'N';
                                }
                            });
                        });

                        $scope.setValue = [];
                        if ($scope.timeslots.length > 0) {
                            angular.forEach($scope.timeslots, function (item1) {
                                if (item1.Available === 'Y') {
                                    var res = item1.StartTime.split(":");
                                    item1.StartTime = res[0] + ":" + res[1];
                                    $scope.setValue.push(item1);
                                }
                            });
                            if ($scope.setValue.length > 0) {
                                $scope.patinet_appStarttime = $scope.setValue[0];
                                $scope.RoomSearchObj.NewApptStartTime = $scope.patinet_appStarttime.StartTime;
                                $scope.RoomSearchObj.NewApptEndTime = $scope.patinet_appStarttime.EndTime;
                                $scope.RoomSearchObj.otherDocInd = "Y";
                            } else {
                                alertify.error("Doctor Slot is not available.Please choose another doctor");
                                $scope.setValue = [];
                                $scope.patinet_appStarttime = "";
                                $scope.RoomSearchObj.sendtoDoctorId = null;
                                $scope.RoomSearchObj.NewApptStartTime = "";
                                $scope.RoomSearchObj.NewApptEndTime = "";
                                $scope.RoomSearchObj.otherDocInd = "N";

                            }


                        } else {
                            alertify.error("Doctor is not available.Please choose another doctor");
                            $scope.setValue = [];
                            $scope.patinet_appStarttime = "";
                            $scope.EndtimeVAlue = "";
                            $scope.RoomSearchObj.NewApptStartTime = "";
                            $scope.RoomSearchObj.NewApptEndTime = "";
                            $scope.RoomSearchObj.otherDocInd = "N";
                            $scope.RoomSearchObj.sendtoDoctorId = null;
                            return;
                        }
                    }
                    $scope.getUserBranchslots = function (item) {
                        var SelectedDoctorId = parseInt(item.DoctorID);
                        var SelectedUserBranchId = parseInt(item.UserBranchId);


                        var appointmentDate = $filter('date')(new Date(), "yyyy-MM-dd");
                        var params = {
                            "DoctorId": SelectedDoctorId,
                            "UserBranchId": SelectedUserBranchId,
                            "Date": appointmentDate
                        }
                        console.log(params);
                        eHnoteMainAppointmentService.GetDoctorBookedslots(params, OnGetSuccess, OnGetError);

                        function OnGetSuccess(response) {
                            console.log(JSON.stringify(response));
                            if (response.status === 'Success') {


                                angular.forEach(response.NormalSlots, function (item) {
                                    item.StartTime = item.StartTime.substring(0, 5);
                                });
                                angular.forEach(response.TeleSlots, function (item) {
                                    item.StartTime = item.StartTime.substring(0, 5);
                                });

                                reStructureDoctorSelectedSlots(response);
                            }

                        }
                        function OnGetError(response) {
                            var MinPerCaseval = SelectedDoctorObj.MinPerCase || 5;
                            bindDoctorSlots(MinPerCaseval, 'current');
                        }








                    };
                    $scope.ChangesRoomDoctor = function (item) {

                        if ($scope.AppointmentDoctorID == item.DoctorID) {
                            $scope.RoomSearchObj.SelectDoctor = item.FullName;
                            $scope.RoomSearchObj.DoctorId = item.DoctorID;
                            $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                            $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                            $scope.RoomSearchObj.OptomId = null;
                            $scope.RoomSearchObj.CounsellorId = null;
                            $scope.RoomSearchObj.DilationAssistantId = null;
                            $scope.RoomSearchObj.TechnicianId = null;
                            $scope.RoomSearchObj.ARId = null;
                            $scope.searchfilterforRoom.txt1 = "";
                            $scope.RoomSearchObj.BillingUserId = null;
                        } else {

                            $scope.getUserBranchslots(item);
                            $scope.RoomSearchObj.DoctorId = item.DoctorID;
                            $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                            $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                            $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        }
                    };

                    $scope.ChangesCounsellor = function (item) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.CounsellorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.OptomId = null;
                        $scope.RoomSearchObj.TechnicianId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.DoctorId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.searchfilterforRoom.txt4 = "";
                        $scope.RoomSearchObj.BillingUserId = null;
                    };

                    $scope.ChangesTechnician = function (item) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.TechnicianId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.OptomId = null;
                        $scope.RoomSearchObj.CounsellorId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.DoctorId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.searchfilterforRoom.txt5 = "";
                        $scope.RoomSearchObj.BillingUserId = null;
                    };

                    $scope.ChangeOpthaUser = function (item) {
                        $scope.RoomSearchObj.SelectDoctor = item.FullName;
                        $scope.RoomSearchObj.TechnicianId = null;
                        $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                        $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                        $scope.RoomSearchObj.OptomId = item.DoctorID;
                        $scope.RoomSearchObj.CounsellorId = null;
                        $scope.RoomSearchObj.DilationAssistantId = null;
                        $scope.RoomSearchObj.DoctorId = null;
                        $scope.RoomSearchObj.ARId = null;
                        $scope.searchfilterforRoom.txt11 = "";
                        $scope.RoomSearchObj.BillingUserId = null;
                    };

                    $scope.ChangesCheckItem = function (item, checkoutItem) {
                        if (checkoutItem === true) {
                            $scope.RoomSearchObj.sendtoDoctorId = null;
                            $scope.RoomSearchObj.RoomTypeobj = "";
                            $scope.submitbutton = "Save";
                            $scope.ChangesRoomType(item);
                        } else {
                            $scope.RoomSearchObj.RoomTypeobj = "";
                            $scope.submitbutton = "Send";
                        }
                    };



                    $scope.SendToRoom = function (item) {
                        if ($scope.Type == 'NotCheckIN') {
                            if ($scope.GetVisitReasonsArray.length > 0) {
                                var filterVisitReasons = $filter('filter')($scope.GetVisitReasonsArray, { "ReasonId": $scope.ApptObj.VisitTypeId }, true);
                                if (filterVisitReasons.length == 0) {
                                    alertify.error("Please Select visit Reason");
                                    return false;
                                }
                            }
                        }
                        $scope.ApptObj.AppointmentStatusId = $scope.ApptObj.AppointmentStatusId || null;
                        $scope.RoomSearchObj.Remarks = $scope.RoomSearchObj.Remarks || '';
                        if ($scope.ApptObj.AppointmentStatusId == 1 && $scope.ApptObj.BookingStatusId == 2 && $scope.RoomSearchObj.Remarks == '') {
                            alertify.error("Please Enter Remarks");
                            return false;
                        }

                        $scope.RoomSearchObj.RoomTypeId = $scope.RoomSearchObj.RoomTypeId || 0;
                        if ($scope.RoomSearchObj.RoomTypeId === 0) {
                            alertify.error("Select Room Type");
                            return false;
                        }



                        if ($scope.RoomSearchObj.RoomTypeId == 1 && $scope.RoomSearchObj.otherDocInd === "Y") {
                            $scope.RoomSearchObj.sendtoDoctorId = $scope.RoomSearchObj.sendtoDoctorId || 0;
                            if ($scope.RoomSearchObj.sendtoDoctorId === 0) {
                                alertify.error("Select Doctor");
                                return false;
                            }
                        }
                        if ($scope.RoomSearchObj.otherDocInd === "Y") {
                            if ($scope.RoomSearchObj.NewApptStartTime === "") {
                                alertify.error("Doctor is not available.Please choose another doctor");
                                return false;
                            }
                        }
                        //if ($scope.RoomSearchObj.RoomTypeId !== 7) {
                        //    if ($scope.RoomSearchObj.RoomId === 0) {
                        //        alertify.error("Select Room Type");
                        //        return false;
                        //    }
                        //}


                        $scope.PatientTagList = [];
                        let selectedPatientTagList = $filter('filter')($scope.SelectedPatientTagList, { "IsChecked": true }, true);
                        $scope.PatientTagList = angular.copy(selectedPatientTagList);
                        if ($scope.RoomType.IsAppointmentConfirmed == true) {
                            $scope.ApptObj.BookingStatusId = 1
                        }

                        $scope.Time = $filter("date")(new Date(), "HH:mm");
                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                        var params = "";
                        if ($scope.Type == 'NotCheckIN') {
                            params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "TransferUserId": $scope.RoomSearchObj.TransferUserId,
                                "HospitalId": $scope.HospitalId,
                                "AppointmentId": $scope.selectedoutPatient.AppointmentID,
                                "AppointmentTrackerDetailId": 0,
                                "RoleId": $scope.RoleId,
                                "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                "RoomId": $scope.RoomSearchObj.RoomId,
                                "IsSendTo": "N",
                                "IsRollBack": "N",
                                "IsCheckedIn": "Y",
                                "Remarks": $scope.RoomSearchObj.Remarks || '',
                                "CurrentTime": $scope.CurrentTime,
                                "IsCheckedOut": "N",
                                "IsReCheckIn": "N",
                                "IsReCheckOut": "N",
                                "IsExpressCheckedOut": "N",
                                "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                "BookingStatusId": $scope.ApptObj.BookingStatusId || null,
                                "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                                "PatientTagList": $scope.PatientTagList || []
                            };
                        } else {
                            params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "TransferUserId": $scope.RoomSearchObj.TransferUserId,
                                "HospitalId": $scope.HospitalId,
                                "AppointmentId": $scope.appointmentid,
                                "AppointmentTrackerDetailId": 0,
                                "RoleId": $scope.RoleId,
                                "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                                "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                                "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                                "RoomId": $scope.RoomSearchObj.RoomId,
                                "Remarks": $scope.RoomSearchObj.Remarks || '',
                                "IsSendTo": "Y",
                                "IsRollBack": "N",
                                "IsCheckedIn": "N",
                                "CurrentTime": $scope.CurrentTime,
                                "NewApptStartTime": $scope.RoomSearchObj.NewApptStartTime || "",
                                "NewApptEndTime": $scope.RoomSearchObj.NewApptEndTime || "",
                                "otherDocInd": $scope.RoomSearchObj.otherDocInd || "N",
                                "IsCheckedOut": "N",
                                "IsReCheckIn": "N",
                                "IsReCheckOut": "N",
                                "IsExpressCheckedOut": "N",
                                "VisitTypeId": $scope.ApptObj.VisitTypeId,
                                "BookingStatusId": $scope.ApptObj.BookingStatusId || null,
                                "HospitalEquipmentId": $scope.ApptObj.HospitalEquipmentId || null,
                                "PatientTagList": $scope.PatientTagList || []
                            };
                        }

                        console.log($scope.RoleId);
                        if (params.RoomTypeId === 7 && !$scope.RoomType.IsSelectedExpressCheckout) {
                            params.RoomId = null;
                            params.IsCheckedOut = "Y";
                            params.Status = 'Completed';
                        } else if (params.RoomTypeId === 7 && $scope.RoomType.IsSelectedExpressCheckout) {
                            params.RoomId = null;
                            params.IsExpressCheckedOut = "Y";
                            params.Status = 'Completed';
                        }
                        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                            if (resp.data.Status == "Success") {

                            } else {
                                alertify.error("Patient is Active at Another User,You Can't Send Patient");
                            }
                        }, function (err) {
                            console.log(err);
                            alertify.error("Getting Failed");
                        });
                        $uibModalInstance.close();
                        /*  $uibModalInstance.close("cancel");*/

                    }

                },



            });
            $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
                if ($scope.type == 'OutPatient') {
                    
                    $scope.showpatientsummary = false;

                    $scope.IsConsultationCompleted = false;
                    $scope.resetAllConsultationArea();
                    $scope.ClickPatientProfile($scope.selectedoutPatient);
                    $scope.ConsultationObj.SummaryView = false;
                    $scope.SaveTypeObj.TypeName = "";
                } else if ($scope.type == 'BacktoOP') {
                    $location.url($scope.PreviousUrl);
                }
                else if ($scope.type == "NotCheckIN") {
                    //$scope.GetUpcomingAppointments($scope.patientid);
                    if ($scope.selectedoutPatient.AppointmentID == appointmentinfo.AppointmentID) {
                        $scope.IsSendtopopupshow = true;
                    }
                    $scope.init(); // for refresh
                }
                else {
                    $location.url($scope.PreviousUrl);
                }
            }, function (cancel) {
            });
        }


    }

    $scope.NavigateToMainScreen = function () {

        if ($scope.mainPatientProfileObj.MainTab == 8) {
            $scope.$broadcast('ActiveUserStatusUpdate',
                {
                    Status: 'Complete'
                }
            );
        }

        if ($scope.PreviousUrl !== '/crm' && $scope.PreviousUrl !== "ASC" && $scope.PreviousUrl !== "ASC_PreAdm" && $scope.PreviousUrl !== "Biller") {
            if ($scope.IsDynamicCheckInMandatory === true && $scope.currentUrl === '/profile') {
                var params = {
                    /*"AppointmentId": $scope.cacheStorageItem.appointmentid || 0,*/
                    "AppointmentId": $scope.mainPatientProfileObj.AppointmentId || 0,
                };
                eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                    if (resp.data.Status === 'Success') {
                        var DynamicStatusarray = resp.data.rows[0];
                        if (resp.data.rows.length > 0) {

                            if (($scope.RoleId === 2 || $scope.RoleId === 62 || $scope.RoleId === 63 || $scope.RoleId === 64 || $scope.RoleId === 65 || $scope.RoleId === 66 || $scope.RoleId === 67 || $scope.RoleId === 68 || $scope.RoleId === 69) && DynamicStatusarray.RoomTypeId == 10 && DynamicStatusarray.Status == 'Active' && (DynamicStatusarray.RoleId == 2 || DynamicStatusarray.RoleId === 62 || DynamicStatusarray.RoleId === 63 || DynamicStatusarray.RoleId === 64 || DynamicStatusarray.RoleId === 65 || DynamicStatusarray.RoleId === 66 || DynamicStatusarray.RoleId === 67 || DynamicStatusarray.RoleId === 68 || DynamicStatusarray.RoleId === 69)) {
                                var r = alertify.confirm(
                                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is Active at your Room, you can send to other Room? </h4>",
                                    function () {
                                        $scope.Technishionsend("", "");
                                        // condition removed by --1616
                                        // $scope.Technishionsend("BacktoOP", "");
                                    }, function () {
                                        $rootScope.CurrentUrl = "/op";
                                        $location.url("/op");
                                        return false;
                                    });
                            }
                            else if ($scope.RoleId === 19 && DynamicStatusarray.RoomTypeId == 9 && DynamicStatusarray.Status == 'Active' && DynamicStatusarray.RoleId == 19) {
                                var r = alertify.confirm(
                                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is Active at your Room, you can send to other Room? </h4>",
                                    function () {
                                        $scope.Technishionsend("BacktoOP", "");

                                    }, function () {
                                        return false;
                                    });
                            }
                            else if ((($scope.RoleId == 1 && DynamicStatusarray.RoleId == 1 && DynamicStatusarray.UserId == $scope.UserId) || ($scope.RoleId == 43 && DynamicStatusarray.RoleId == 43 && DynamicStatusarray.UserId == $scope.UserId) || ($scope.RoleId == 10 && DynamicStatusarray.RoleId == 10 && DynamicStatusarray.UserId == $scope.UserId) || ($scope.RoleId == 16 && DynamicStatusarray.RoleId == 16 && DynamicStatusarray.UserId == $scope.UserId)) && (DynamicStatusarray.RoomTypeId == 1 || DynamicStatusarray.RoomTypeId == 2 || DynamicStatusarray.RoomTypeId == 12) && DynamicStatusarray.Status == 'Active') {
                                var r = alertify.confirm(
                                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is Active at your Room, you can send to other Room? </h4>",
                                    function () {
                                        $scope.Technishionsend("", "");

                                    }, function () {
                                        $rootScope.CurrentUrl = "/op";
                                        $location.url("/op");
                                        return false;
                                    });
                            } else if (($scope.RoleId == 18 && DynamicStatusarray.RoleId == 18) && (DynamicStatusarray.RoomTypeId == 4) && DynamicStatusarray.Status == 'Active') {

                                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Unsaved data will be lost - do you want to continue?   </h4>", function () {

                                    let req = {
                                        "UserId": $scope.UserId,
                                        "HospitalId": $scope.HospitalId,
                                        "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                        "AppointmentTrackerDetailId": DynamicStatusarray.AppointmentTrackerDetailId,
                                        "RoomTypeId": DynamicStatusarray.RoomTypeId,
                                        "IsFromDifferentRoom": $scope.IsFromDifferentRoom,
                                        "CurrentTime": $filter('date')(new Date(), "HH:mm:ss")
                                    };
                                    eHnoteMainAppointmentService.UndoAppointmentTrackerDetails(req).then(function (resp) {
                                        if (resp.data.Status === "Success") {
                                            $location.url("/Coordinator");
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    });
                                }, function () {

                                });
                            }
                            else if (($scope.RoleId == 18) && (DynamicStatusarray.RoomTypeId == 4) && DynamicStatusarray.Status == 'Waiting') {
                                $location.url("/Coordinator");
                            }
                            else {
                                $location.url($scope.PreviousUrl);
                            }
                        } else {
                            $location.url($scope.PreviousUrl);
                        }
                    }
                }, function (err) {
                    console.log(err);
                    alertify.error("Getting Failed");
                });
            }
            else {

                console.log($scope.PreviousUrl + "__$scope.PreviousUrl");
                if ($scope.currentUrl === '/profile') {
                    $rootScope.CurrentUrl = $scope.PreviousUrl;
                    $location.url($scope.PreviousUrl);
                } else if ($scope.currentUrl === '/Biller') {
                    $location.url("/Biller");
                } else {
                    $location.url($scope.PreviousUrl);
                }
            }
        }
        else if ($scope.PreviousUrl === '/crm') {
            $rootScope.CurrentUrl = $scope.PreviousUrl;
            $location.url($scope.PreviousUrl);
        }
        else if ($scope.PreviousUrl === 'ASC') {
            $rootScope.CurrentUrl = $scope.PreviousUrl;
            $scope.cacheStorageItem.AppointmentType = 'ASC';
            $location.url("/OT");
        }
        else if ($scope.PreviousUrl === 'ASC_PreAdm') {
            $rootScope.CurrentUrl = $scope.PreviousUrl;
            $scope.cacheStorageItem.AppointmentType = 'Pre-Op';
            $location.url("/OT");
        }
        else if ($scope.PreviousUrl === 'Biller') {
            $rootScope.CurrentUrl = $scope.PreviousUrl;
            $location.url($scope.PreviousUrl);
        } else {}
        $scope.AddToCache();
    };
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };
    $scope.mainobj = {
        "AppointmentId": '',
        "PatientId": '',
        "Patientlist": [],
        "PatientInsuranceList": [],
        "AppointmentInsuranceList": [],
        "AppointmentNotes": [],
        "PatientCheckIn": {},
        "CoManagement": {},
        "SurgeryStaff": {},

    }
   
    // Communication Logs is hidden once an admin deactivates this user's calling
    // credential. Users who were never given one keep the tab as before.
    $scope.showCommunicationLogsTab = function () {
        return $rootScope.telnyxCredentialActive !== false;
    };

    // deactivated while the user is sitting on Communication Logs -> fall back to Profile
    $scope.$watch($scope.showCommunicationLogsTab, function (canShow) {
        if (!canShow && $scope.mainPatientProfileObj && $scope.mainPatientProfileObj.MainTab === 4) {
            $scope.switchMainProfileTab(1);
        }
    });

    $scope.switchMainProfileTab = function (tabno) {

        if (tabno === 4 && !$scope.showCommunicationLogsTab()) { return; }

        if ($scope.mainPatientProfileObj.MainTab === 8 && tabno !== 8) {
            $scope.$broadcast('ActiveUserStatusUpdate',
                {
                    Status: 'Complete'
                }
            );
        }

        $scope.mainPatientProfileObj.IsShowPatientSearch = false;
        $scope.mainPatientProfileObj.MainTab = tabno;
        if ($scope.mainPatientProfileObj.MainTab === 1) {
            $scope.mainPatientProfileObj.PatientDetailsSummaryMode = false;
            //$scope.SelectPatient($scope.PatientDetailsInfo.PatientID);
        } else {
            $scope.mainPatientProfileObj.PatientDetailsSummaryMode = true;
        }
        if ($scope.mainPatientProfileObj.MainTab === 6) {
            $scope.Patientobj = {
                "PatientId": 1,
                "PatientName": $scope.cacheStorageItem.PatientName,
                "PatientMrNo": "",
                "Gender": "",
                "Age": "",
                "DOB":"",
                "MobileNo": "",

            }
            $scope.GetPatientCurrentActiveMedicationsList();
            $scope.GetLatestErxAppointmentMedications();
        } else if ($scope.mainPatientProfileObj.MainTab === 8) {
            $scope.mainPatientProfileObj.IsShowPatientSearch = true;
        }

        if ($scope.mainPatientProfileObj.MainTab == 3) {
            $scope.claimScreenParentObj = datapersistanceFactory.getItem("IsComingFromClaim");
            //$scope.mainPatientProfileObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId;
            $scope.mainPatientProfileObj.PatientClaimId = 0;
            $scope.claimScreenParentObj.PatientClaimId = 0;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        }

    }
    $scope.newemailReferal = function (item) {

        // $scope.SuperBillPdf();
        $scope.ChartObj.AppointmentId = $scope.mainPatientProfileObj.AppointmentId;
        $scope.ChartObj.FaxNotificationObj = $scope.FaxNotificationObj;
        $scope.ChartObj.PatientId = item.PatientId;
        $scope.ChartObj.AppointmentTypeId = item.AppointmentTypeId;
        $scope.ChartObj.VisitId = item.VisitId;
        $scope.ChartObj.EmailID = (item && item.PatientDetails && item.PatientDetails.EmailId) || "";
        $scope.ChartObj.message = 1;
        $scope.ChartObj.fax = false;
        var pobject = {
            "From": "Patient"
        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/emailReferalpopupNew.html",
            "controller": "USEmailReferalpopupCtrl",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "ChartObj": function () { return angular.copy($scope.ChartObj) },
                "BranchList": function () { return $scope.BranchesListArray || []; },
                "ScreenType": function () { return angular.copy(pobject.From) }
            },
            "windowClass": "modal__popup--1 bottom-to-top-modal",

        });
    }
    // Refills Tab 
    $scope.GetPatientCurrentActiveMedicationsList = function () {
        var obj = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "OrganizationId": $scope.HospitalId,
            "PageSize": 10,
            "PageNumber": 1
        }
        eHnoteDiagnosisDataServices.GetPatientActiveMedicationsList(obj).then(function (resp) {
            console.log(JSON.stringify(resp));
            $scope.PrescriptionsArray = [];
            if (resp.data.Status == "Success") {
                $scope.PrescriptionsArray = resp.data.rows || [];
                angular.forEach($scope.PrescriptionsArray, function (pitem) {
                    pitem.IsSelected = false;
                    pitem.PatientInstructions = pitem.PatientInstructions || null;

                    pitem.Action = pitem.Action || "";
                    pitem.Dose = pitem.Dose || "";
                    pitem.Route = pitem.Route || "";
                    pitem.Frequency = pitem.Frequency || "";
                    pitem.DoseOther = pitem.DoseOther || "";
                    
                });
            }

            $scope.SelectPatientRxTab($scope.cacheStorageItem.PatientID)
        }, function (err) {

        });
    }


    $scope.SelectPatientRxTab = function (patientId, type) {
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;

                eHnoteMasterDataService.addpatientData(patientitem);
                //$scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                $scope.cacheStorageItem.PatientName = patientitem.Patient[0].FullName;
                $scope.AddToCache();
                $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
                $scope.GetPatientRxTab();
            }
        }      
    }

    $scope.PatientPrescriptionDetails = [];
    $scope.GetPatientVisithistroy = function () {

        var object = {
            "AppointmentId": $scope.mainPatientProfileObj.AppointmentId || 0,
            "Type": 0,
            "VisitId": $scope.mainPatientProfileObj.VisitId,
        };
        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                $scope.treatmentData = resp.data;
                $scope.AssessmentPlan = resp.data[0].AssessmentPlan || [];
                $scope.PatientPrescriptionDetails = resp.data[0].PatientPrescription || [];
                $scope.InvestigationsDetails = resp.data[0].InvestigationsDetails || [];
                $scope.SurgeriesDetails = resp.data[0].SurgeriesDetails || [];
                $scope.ProceduresDetails = resp.data[0].ProceduresDetails || [];
                $scope.CurrentMedicationsArray = resp.data[0].CurrentSystemicMedicationsHistory || [];


                angular.forEach($scope.PatientPrescriptionDetails.PrescriptionDetails, function (Pitem) {
                    Pitem.IsSelected = false;
                });

                if ($scope.CurrentMedicationsArray.length > 0) {
                    angular.forEach($scope.CurrentMedicationsArray, function (CSitem) {
                        CSitem.IsSelected = false;
                    });
                }
                $scope.GetPatientCurrentActiveMedicationsList();
            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };
  
    function getnewMedicalRXPrescriptionObj() {
        var obj = {
            "UserId": $scope.UserId,
            "DoctorId": $scope.appointmentinfo.DoctorID || $scope.UserId,
            "PatientId": $scope.appointmentinfo.PatientID,
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "ConsultationId": $scope.cacheStorageItem.PatientVisitId,
            "PatientRcopiaId": null,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "PatientPrescriptionId": 0,
            "PrescribedDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "LastUpdateDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "RcopiaPrescriptionId": "",
            "EncounterDate": $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss"),
            "EncounterActionTaken": "created",
            "EncounterExternalId": doctorinfo.doctordata.UserAddress[0].RcopiaProviderUserExternalId,
            "EncounterUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "EncounterUserRcopiaId": null,
            "EncounterUserExternalId": doctorinfo.doctordata.UserAddress[0].RcopiaProviderUserExternalId,
            "ProviderRcopiaId": null,
            "ProviderUserName": null,
            "ProviderExternalId": null,
            "PreparerRcopiaId": null,
            "PreparerUserName": doctorinfo.doctordata.User[0].RcopiaPreparerUserName || null,
            "PreparerExternalId": doctorinfo.doctordata.User[0].RcopiaPreparerExternalId || null,
            "PharmacyNCPDPID": null,
            "PharmacyRcopiaId": null,
            "PharmacyExternalId": "",
            "PrescriptionList": []
        }

        return obj;
    }

    $scope.AddNewMedicalRxPrescriptionObj = getnewMedicalRXPrescriptionObj();

    $scope.RefillRequest = function () {

        $scope.RefillRequestArray = [];
        $scope.RefillRequestArray = $filter("filter")($scope.PrescriptionsArray, { "IsSelected": true }) || [];

        if ($scope.RefillRequestArray.length > 0) {
            angular.forEach($scope.RefillRequestArray, function (pitem) {

                var scheduletype = "unknown";
                if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                    scheduletype = "unknown";
                } else {
                    scheduletype = pitem.DrugSchedule;
                }

                if (pitem.DrugSchedule === "3" || pitem.DrugSchedule === "2" || pitem.DrugSchedule === "4" || pitem.DrugSchedule === "5" || pitem.DrugSchedule === "scheduled") {
                    pitem.HasScheduledDrug = "y";
                }

                var obj = {
                    "PatientPrescriptionDetailId": 0,
                    "IsDischargePrescription": "y",
                    "Deleted": "n",
                    "RcopiaPrescriptionId": "",
                    "MedicationId": pitem.MedicationId,
                    "DrugNDCID": pitem.DrugNDCID,
                    "DrugRxNormId": pitem.DrugRxNormId,
                    "DrugBrandName": pitem.DrugBrandName,
                    "GenericName": pitem.DrugGenericName,
                    "Supply": "n",
                    "Compound": "n",
                    "Action": pitem.Action,
                    "Dose": pitem.Dose,
                    "Route": pitem.Route,
                    "DoseUnit": pitem.DoseUnit,
                    "DoseTiming": pitem.Frequency,
                    "DoseOther": pitem.DoseOther,
                    "Duration": pitem.DaysSupply,
                    "Quantity": pitem.Quantity,
                    "QuantityUnit": pitem.QuantityUnit,
                    "Refills": pitem.Refills,
                    "SubstitutionPermitted": pitem.SubstitutionPermitted,
                    "OtherNotes": pitem.OtherNotes,
                    "PatientNotes": pitem.PatientInstructions,
                    "MaximumDailyDose": "",
                    "MaximumDailyDoseUnit": "",
                    "Comments": "",
                    "DeleteInd": pitem.DeleteInd,
                    "DiagnosisList": [],
                    "Schedule": scheduletype,
                };

                $scope.AddNewMedicalRxPrescriptionObj.PrescriptionList.push(obj);

            });
            $scope.selectedPatientData.Patient[0].RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || null;
            if ($scope.selectedPatientData.Patient[0].RcopiaPatientId != null) {
                $scope.AddNewMedicalRxPrescriptionObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId;
            } else {
                $scope.AddNewMedicalRxPrescriptionObj.RcopiaPatientId = null;
            }


            console.log($scope.AddNewMedicalRxPrescriptionObj);
            eHnoteDiagnosisDataServices.AddPatientPrescriptionDetailsToRcopia($scope.AddNewMedicalRxPrescriptionObj).then(function (response) {
                if (response.data.status === 'Success') {
                    $scope.openEPrescribe();
                }
            });
        }


    }

    $scope.RcopiaLocalPrescribeObj = {
        "PortalSystemName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
        "PracticeUserName": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
        "RcopiaUserId": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
        "UserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
        "Service": "rcopia",
        "Action": "login",
        "StartUpScreen": "patient",
        "RcopiaPatientId":null,
        "RcopiaPatientName": "",
        "RcopiaPatientExternalId": "",
        "Time": "",
        "SecretKey": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
        "MAC": ""
    };


    var hex_chr = "0123456789abcdef";
    function rhex(num) {
        var str = "";
        for (var j = 0; j <= 3; j++)
            str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                hex_chr.charAt((num >> (j * 8)) & 0x0F);
        return str;
    }

    function str2blks_MD5(str) {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }
    function add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function gmtTime() {

        var GMTTime = new Date();
        var month = GMTTime.getUTCMonth() + 1;
        var day = GMTTime.getUTCDate();
        var year = GMTTime.getUTCFullYear() - 2000;
        var hour = GMTTime.getUTCHours();
        var min = GMTTime.getUTCMinutes();
        var sec = GMTTime.getUTCSeconds();

        if (month < 10) { month = "0" + month; }
        if (day < 10) { day = "0" + day; }
        if (hour < 10) { hour = "0" + hour; }
        if (hour < 1) { hour = "00"; }
        if (min < 10) { min = "0" + min; }
        if (min < 1) { min = "00"; }
        if (sec < 10) { sec = "0" + sec; }
        if (sec < 1) { sec = "00"; }

        var GMTime = month.toString() + day.toString() + year.toString() + hour.toString() + min.toString() + sec.toString();
        return GMTime;
    }
    function calcMD5(str) {
        var x = str2blks_MD5(str);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = ff(c, d, a, b, x[i + 10], 17, -42063);
            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = hh(a, b, c, d, x[i + 5], 4, -378558);
            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }

        var finalstring = rhex(a) + rhex(b) + rhex(c) + rhex(d);
        var capitalFinalString = angular.uppercase(finalstring);
        return capitalFinalString;
    }
    $scope.openEPrescribe = function () {

      

        $scope.RcopiaLocalPrescribeObj.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId || null;
        
        var serviceUrl = "https://web.staging.drfirst.com/sso/portalServices?";

        $scope.RcopiaLocalPrescribeObj.Time = gmtTime();

        var subUrl = "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + $scope.RcopiaLocalPrescribeObj.SecretKey;

        $scope.RcopiaLocalPrescribeObj.MAC = "";
        $scope.RcopiaLocalPrescribeObj.MAC = calcMD5(subUrl);

        var MainUrl = serviceUrl + "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + "&MAC=" + $scope.RcopiaLocalPrescribeObj.MAC;

        $scope.mainIframeSrcUrl = MainUrl;

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/medicalrxRcopia.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "mainIframeSrcUrl": function () { return $scope.mainIframeSrcUrl; },
            },
            "windowClass": "newconsultationpopup overflow-y-hideen",
            "controller": function ($scope, $uibModal, $uibModalInstance, $sce, eHnotePatientPVService, mainIframeSrcUrl) {

                console.log(mainIframeSrcUrl);

                $scope.mainIframeSrcUrl = $sce.trustAsResourceUrl(mainIframeSrcUrl);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.medicalrxrcopiasuibclose = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                    //  $uibModalInstance.dismiss("cancel");

                };

                $scope.medicalrxsuibclose = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                };
                $scope.savePrescription = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                };

            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);

            $scope.getMedicationsFromRcopia();

        }, function (cancel) {
        });


    };

    $scope.getMedicationsRequestObj = {
        "UserId": $scope.UserId,
        "PatientRcopiaId": null,
        "LastUpdatedDate": "08/30/2022 12:00:00"
    };
    $scope.getPrescriptionRequestObj = {
        "UserId": $scope.UserId,
        "RcopiaPatientId": null,
        "LastUpdatedDate": "08/30/2022 12:00:00"
    };
    $scope.getPrescriptionsFromRcopia = function () {

      

        $scope.getPrescriptionRequestObj.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId;

        var lastUpdatedDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
        var MaximumLastUpdateDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");

        var previousDate = new Date()
        previousDate.setDate(previousDate.getDate() - 1)
        var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");


        var params = {
            "UserId": $scope.UserId,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "RcopiaPatientId": $scope.getPrescriptionRequestObj.RcopiaPatientId,
            "LastUpdateDate": PreviousDate,
            "ConsultationId": $scope.cacheStorageItem.PatientVisitId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            //"PatientPrescriptionId": $scope.value || 0,
            "PrescribedDate": lastUpdatedDate,
            "OrganizationId": $scope.HospitalId,
        };

        if ($scope.cacheStorageItem.MedicationLastUpdateDate != null) {

            var update = $scope.cacheStorageItem.MedicationLastUpdateDate || null;
            var UpDate = $filter('date')(update, "MM/dd/yyyy HH:mm:ss");
            params.LastUpdateDate = UpDate;
        }



        eHnoteDiagnosisDataServices.getPatientPrescriptionsFromRcopia(params).then(function (response) {

            if (response.status === 'Success') {
                $scope.GetPatientVisithistroy();
            } else {
                $scope.GetPatientVisithistroy();
            }
        });
    };

    $scope.getMedicationsFromRcopia = function () {
       
        

        $scope.getMedicationsRequestObj.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId;
    

        var lastUpdatedDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
        var MaximumLastUpdateDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");

        var previousDate = new Date()
        previousDate.setDate(previousDate.getDate() - 1)
        var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

        var params = {
            "UserId": $scope.UserId,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "RcopiaPatientId": $scope.getMedicationsRequestObj.RcopiaPatientId,
            "LastUpdateDate": PreviousDate,
            "ConsultationId": $scope.cacheStorageItem.PatientVisitId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            //"PatientPrescriptionId": $scope.value || 0,
            "PrescribedDate": lastUpdatedDate,
            "OrganizationId": $scope.HospitalId,
        }

        if ($scope.cacheStorageItem.MedicationLastUpdateDate != null) {

            var update = $scope.cacheStorageItem.MedicationLastUpdateDate || null;
            var UpDate = $filter('date')(update, "MM/dd/yyyy HH:mm:ss");
            params.LastUpdateDate = UpDate;
        }

        console.log(params.LastUpdateDate + "__LastUpdateDate");

        eHnoteDiagnosisDataServices.getPatientMedicationsFromRcopia(params).then(function (response) {

            var newUpdatedTime = params.LastUpdateDate;
            if (response.data.Status === 'Success') {

                $scope.getPrescriptionsFromRcopia();
            } else {
                $scope.getPrescriptionsFromRcopia();
            }

        });
    };

    // Refills Tab End
    $scope.navtoEditPatientProfilePopup = function (Type, ASCChartingInd) {
        ASCChartingInd = ASCChartingInd || false;
        $scope.ShowInsuranceAddnew = true;
        var obj = {
            "Tab": Type,
            "PatientDetails": $scope.PatientDetailsInfo,
            "HospitalEquipmentList": $scope.HospitalEquipmentList,
            "PatientAddress": $scope.PatientAddressSummary,
            "AllMasterData": $scope.mainPatientProfileObj.AllMasterData || {},
            "FamilySummary": $scope.mainPatientProfileObj.FamilySummary || [],
            "TitlesList": $scope.mainPatientProfileObj.TitlesList || [],
            "PatientInsuranceSummary": $scope.PatientInsuranceSummary || [],
            "ShowInsuranceAddnew": $scope.ShowInsuranceAddnew || false,
            "InsuranceStatusList": $scope.InsuranceStatusList || [],
            "InsuranceEditItem": null,
            "AddEdit": "Edit"
        };

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/UsEditPatientProfilev2.html",
            "backdrop": "static",
            "windowClass": "modal__ninety--",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return obj; }
            },
            "controller": "UsEditPatientProfileCtrlv2",
        });
        $scope.mInstanceAdd.result.then(function (type) {

            if (ASCChartingInd) {
                $scope.mainPatientProfileObj.isAscChartShowInd = false;
                $scope.mainPatientProfileObj.MainTab = 1;
                $scope.mainPatientProfileObj.PatientDetailsSummaryMode = false;
                $scope.mainPatientProfileObj.IsShowPatientSearch = false;
                $scope.SelectPatient($scope.PatientDetailsInfo.PatientID, type);
            } else {
                $scope.init();
                //$scope.SelectPatient($scope.PatientDetailsInfo.PatientID,type);
            }
            

        }, function (cancel) {
        });

    }

    $scope.BookAppointmentPopup = function (type) {
        var OpenType = type || 2;
        $scope.ShowPatientListDrop = false;
        $scope.PageName = "book";
        $rootScope.appointment_type = "1";

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddress = {
            "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID
        };
        var doctorID = {
            "DoctorID": doctorinfo.doctorid
        };
        if (doctorinfo.RoleID === 43) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
        } else if (doctorinfo.RoleID === 1) {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);
        } else {
            eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddress);

            var doctorID1 = {
                "DoctorID": 0
            };
            eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID1);
        }
        $scope.cacheStorageItem.VisitRemarks = $scope.cacheStorageItem.VisitRemarks || "";
        if ($scope.cacheStorageItem.VisitRemarks != "") {
            $scope.cacheStorageItem.VisitRemarks = "";
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }
        else {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        }

        var Obj = {
            "PageName": "book",
            "AppDate": "",
            "ispatientExistsval": false,
            "calenderDate": undefined,
            "AppointmentId": null,
            "DoctorId": null,
            "StartTime": null,
            "EndTime": null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            'IsComingFrom': 'PatientProfile',
            'type': $scope.PreviousUrl === "/op" ? 'op' : $scope.PreviousUrl === "/Biller" ? 'Biller' : ($scope.PreviousUrl === "ASC" ? 'ASC' : 'op')    //$scope.cacheStorageItem.type
        };
        datapersistanceFactory.set('AppointmentDetailsCache', Obj);

        var opencallcenterpopup = "";
        if (($scope.userLoginDetails.RoleID === 20 || $scope.userLoginDetails.RoleID === 70) && $scope.PreviousUrl === "/crm") {
            opencallcenterpopup = "crm";
        }

        if (OpenType == 2) {
            BookApptPopupOpenedV2(opencallcenterpopup);
        } else {
            BookApptPopupOpened(opencallcenterpopup);
        }
    };
    $scope.closeDropdown = function () {
        document.querySelector('#header__Search--').classList.remove('open');
    };

   $scope.$on("telnyxOpenPatient", function (evt, patient) {

        console.log("call initiated from telynx service");
        console.log(patient);
 
        var callPatientId = patient && (patient.PatientId || patient.PatientID);
        if (callPatientId && callPatientId == $scope.cacheStorageItem.PatientID) {
            return;
        }
        $scope.RefreshProfile(patient);
    });
    $scope.RefreshProfile = function (patientitem) {
         console.log(patientitem);
        //debugger;
        console.log('refresh call after patient create')
        $scope.cacheStorageItem.Diagnosis = [];
        $scope.cacheStorageItem.AssessmentPlan = [];
        $scope.cacheStorageItem.OrderDetails = [];
        $scope.cacheStorageItem.Treatments = [];
        $scope.cacheStorageItem.Investigations = [];
        $scope.cacheStorageItem.ChiefComplaints = [];
        $scope.cacheStorageItem.ClinicalNotes = [];
        $scope.cacheStorageItem.Prescriptions = [];
        $scope.cacheStorageItem.Observations = [];
        $scope.cacheStorageItem.LabTest = [];
        $scope.cacheStorageItem.MedicalConditions = [];
        $scope.cacheStorageItem.BirthHistory = [];
        $scope.cacheStorageItem.FamilyHistory = [];
        $scope.cacheStorageItem.OccularHistory = [];
        $scope.cacheStorageItem.SystemicHistory = [];
        $scope.cacheStorageItem.VaccinationHistory = [];
        $scope.cacheStorageItem.NutritionalHistory = [];
        $scope.cacheStorageItem.ImmunisationHistory = [];
        $scope.cacheStorageItem.SurgicalHistory = [];
        $scope.cacheStorageItem.FunctionalStatusHistory = [];
        $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = [];
        $scope.cacheStorageItem.OcularSurgicalHistory = [];
        $scope.cacheStorageItem.AllergyItems = [];
        $scope.cacheStorageItem.MedicalHistory = [];
        $scope.cacheStorageItem.UnaidedArray = [];
        $scope.cacheStorageItem.RefractionArray = [];
        $scope.cacheStorageItem.AcceptenceArray = [];
        $scope.cacheStorageItem.KeretometerArray = [];
        $scope.cacheStorageItem.OcularDominanceArray = [];
        $scope.cacheStorageItem.PinholeArray = [];
        $scope.cacheStorageItem.LCVArray = [];
        $scope.cacheStorageItem.BinocularArray = [];
        $scope.cacheStorageItem.AnteriorSegmentArray = [];
        $scope.cacheStorageItem.PosteriorSegmentArray = [];
        $scope.cacheStorageItem.AdditionalInvestgationArray = [];
        $scope.cacheStorageItem.RestructuredDocInvTemplates = [];
        $scope.cacheStorageItem.ColourVisionArray = [];
        $scope.cacheStorageItem.OcularMotilityArray = [];
        $scope.cacheStorageItem.TonometryTestArray = [];
        $scope.cacheStorageItem.Findings = [];
        $scope.cacheStorageItem.InvestigationDetails = [];
        $scope.cacheStorageItem.chkOldglass = false;
        $scope.cacheStorageItem.IsfindingsDataInitialized = false;
        $scope.cacheStorageItem.FollowUpDuration = '';
        $scope.cacheStorageItem.FollowUpDurationType = 'D';
        $scope.cacheStorageItem.FollowUpDurationTypeName = 'Day(s)';
        $scope.cacheStorageItem.FollowUpNotes = '';
        $scope.cacheStorageItem.SurgeryArray = [];
        $scope.cacheStorageItem.AppointmentPatientUploads = [];
        $scope.cacheStorageItem.PatientInstructions = [];
        $scope.cacheStorageItem.MenstrualHistory = [];
        $scope.cacheStorageItem.IsAnteriorCheckedAll = false;
        $scope.cacheStorageItem.IsAnteriorRightEyeCheckAll = false;
        $scope.cacheStorageItem.IsAnteriorLeftEyeCheckAll = false;
        $scope.cacheStorageItem.IsPosteriorCheckedAll = false;
        $scope.cacheStorageItem.IsPosteriorRightEyeCheckedAll = false;
        $scope.cacheStorageItem.IsPosteriorLeftEyeCheckedAll = false;
        $scope.cacheStorageItem.GonioscopyArray = [];
        $scope.cacheStorageItem.masterQuestions = [];
        $scope.cacheStorageItem.ContactLens = [];
        $scope.cacheStorageItem.ContactlensArray = [];
        $scope.cacheStorageItem.LacrimalPatiency = [];
        $scope.cacheStorageItem.PostDilatedExaminationArray = [];
        $scope.cacheStorageItem.VisionDetails = [];
        $scope.cacheStorageItem.GlassPrescription = [];
        $scope.cacheStorageItem.FileUploadImageArray = [];
        $scope.cacheStorageItem.appointmentStatus = "";
        $scope.cacheStorageItem.SelectedConsultationType = "";
        $scope.cacheStorageItem.sendPatientEmail = false;
        $scope.cacheStorageItem.ReferalId = 0;
        $scope.cacheStorageItem.ReferalDoctorType = "";
        $scope.cacheStorageItem.ReferalDoctorId = "";
        $scope.cacheStorageItem.RefeRalDoctorNotes = '';
        $scope.cacheStorageItem.ReferalOrgId = "";
        $scope.cacheStorageItem.ReferalDoctorName = "";
        $scope.cacheStorageItem.isSendCaseHistoryMail = "";
        $scope.cacheStorageItem.isSendRefLetterMail = "";
        $scope.cacheStorageItem.isSendRefSms = "";
        $scope.cacheStorageItem.OptomComments = "";
        $scope.cacheStorageItem.DoctorNotesArray = [];
        $scope.cacheStorageItem.ClinicalNotesArray = [];
        $scope.cacheStorageItem.PatientNotesArray = [];
        $scope.cacheStorageItem.OptomNotesArray = [];
        $scope.cacheStorageItem.DoctorComments = "";
        $scope.cacheStorageItem.GlassPrescriptionArray = [];
        $scope.cacheStorageItem.ArRefractionArray = [];
        $scope.cacheStorageItem.FollowUpDuration = "";
        $scope.cacheStorageItem.FollowUpDurationType = "";
        $scope.cacheStorageItem.FollowUpNotes = "";
        $scope.cacheStorageItem.PatientSuggestInvestigation = [];
        $scope.cacheStorageItem.PatientInvestigations = [];
        $scope.cacheStorageItem.LabtestList = [];
        $scope.cacheStorageItem.GoniscopyList = [];
        $scope.cacheStorageItem.IsVIPInd = false;
        $scope.cacheStorageItem.IsResearchInd = false;
        $scope.cacheStorageItem.IsHighRiskInd = false;
        $scope.cacheStorageItem.IsSendForDilationInd = false;
        $scope.cacheStorageItem.IsSendForInvestigationInd = false;
        $scope.cacheStorageItem.IsSendForLabTestInd = false;
        $scope.cacheStorageItem.IsSendForRecheckInd = false;
        $scope.cacheStorageItem.IsVIPRemarks = "";
        $scope.cacheStorageItem.IsResearchRemarks = "";
        $scope.cacheStorageItem.IsHighRiskRemarks = "";
        $scope.cacheStorageItem.IsSendForDilationRemarks = "";
        $scope.cacheStorageItem.IsSendForInvestigationRemarks = "";
        $scope.cacheStorageItem.IsSendForLabTestRemarks = "";
        $scope.cacheStorageItem.ClinicalNotesComments = "";
        $scope.cacheStorageItem.IsSendForRecheckRemarks = "";
        $scope.cacheStorageItem.PatientInstructionComments = "";
        $scope.cacheStorageItem.FollowUpArray = [];
        $scope.cacheStorageItem.AnteriorRemarks = "";
        $scope.cacheStorageItem.PosteriorRemarks = "";
        $scope.cacheStorageItem.LacrimalPatencyRemarks = "";
        $scope.cacheStorageItem.AnteriorIsNormal = false;
        $scope.cacheStorageItem.PosteriorIsNormal = false;
        $scope.cacheStorageItem.AdviceOrderArray = [];
        $scope.cacheStorageItem.VideoDetails = [];
        $scope.cacheStorageItem.TempImagesArray = [];
        $scope.cacheStorageItem.TempPdfArray = [];
        $scope.cacheStorageItem.PrescriptionDetails = [];
        $scope.cacheStorageItem.SelectedAppointmentTypeId = 0;
        $scope.cacheStorageItem.PatientVisitId = 0;
        $scope.cacheStorageItem.ConsultationID = 0;
        $scope.cacheStorageItem.appointmentid = 0;
        $scope.cacheStorageItem.RcopiaPatientId = 0;
       // eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.mainPatientProfileObj.PatientDetailsSummaryMode = false;
        $scope.mainPatientProfileObj.isAscChartShowInd = false;
        $scope.mainPatientProfileObj.AppointmentId = 0;
        $scope.mainPatientProfileObj.VisitId = 0;
        $scope.SelectedAppointmentObj = '';
        if (patientitem) {
            $scope.cacheStorageItem.patientid = patientitem.PatientId;
            $scope.cacheStorageItem.PatientID = patientitem.PatientId;
            $scope.cacheStorageItem.PatientName = patientitem.FullName;
            $scope.cacheStorageItem.EmailID = patientitem.EmailID ? patientitem.EmailID : '';
            $scope.cacheStorageItem.CountryCode = patientitem.CountryCode ? patientitem.CountryCode : '';
            $scope.cacheStorageItem.PhoneNumber = patientitem.PhoneNumber ? patientitem.PhoneNumber : '';
            $scope.AddPatietnDetailsLog(patientitem.PatientId);
            $scope.SelectPatient(patientitem.PatientId, "")
        }
        $scope.mainPatientProfileObj.PatientId = $scope.cacheStorageItem.PatientID;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.selectedPatientObj.PatientId = 0;
        $scope.selectedPatientObj.PatientName = "";
        $scope.selectedPatientObj.OldPatientDisplayId = "";
        $scope.selectedPatientObj.PatientDisplayId = "";
        $scope.selectedPatientObj.PatientMobile = "";
        $scope.selectedPatientObj.DOBSearch = "";
        $scope.patients = [];
        $scope.cacheStorageItem.ScribeId = 0;
        $scope.cacheStorageItem.ScribeName = '';
       
        //$scope.PatientDetailsInfo.EmailId = patientitem.EmailID || '';
        //$scope.mainPatientProfileObj.PatientDetailSummary = angular.copy($scope.cacheStorageItem);
        //var Algobj = {};
        //eHnoteMasterDataService.addAllergiesShownQuickAccess(Algobj);
        
        //eHnoteAuditServices.GetPatientDetailsByIdInProfileScreen(patientitem.PatientId),
        $scope.switchMainProfileTab(1);
        $scope.init();
        $scope.GetMedicalHistoriesByPatientId();
        if ($scope.mainPatientProfileObj.MainTab == 1) {
            $scope.$broadcast("RefreshBookedProfileAppts");
        } 
        $scope.closeDropdown();
        
    }
   
    $scope.navtoAddPatientProfilePopup = function (Type) {
        
        $scope.ShowInsuranceAddnew = true;

        var obj = {
            "Tab": Type,
            "PatientDetails": $scope.selectedPatientObj.PatientName,
            "HospitalEquipmentList": $scope.HospitalEquipmentList,
            "PatientAddress": null,
            "PatientInsuranceSummary": [],
            "ShowInsuranceAddnew": false,
            "InsuranceStatusList":  [],
            "InsuranceEditItem": null,
            "AllMasterData": $scope.mainPatientProfileObj.AllMasterData || {},
            "FamilySummary": $scope.mainPatientProfileObj.FamilySummary || [],
            "TitlesList": $scope.mainPatientProfileObj.TitlesList || [],
            "AddEdit": "Add"
        };

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/UsEditPatientProfilev2.html",
            "backdrop": "static",
            "windowClass": "modal__ninety--",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return obj; }
            },
            "controller": "UsEditPatientProfileCtrlv2",
        });
        $scope.mInstanceAdd.result.then(function (result) {
            debugger
            if (result == "Rcopia") {


            } else {
                $scope.RefreshProfile(result);
            }
        }, function (cancel) {
        });

    }
    $scope.FaxNotificationObj = {
        "TotalCount": 0
    };
    $scope.emailReferal = function (item) {
        var pobject = {
            "From": "Patient"
        }
        $scope.ChartObj.AppointmentId = $scope.mainPatientProfileObj.AppointmentId;
        $scope.ChartObj.FaxNotificationObj = $scope.FaxNotificationObj;
        $scope.ChartObj.PatientId = item.PatientId;
        $scope.ChartObj.AppointmentTypeId = item.AppointmentTypeId;
        $scope.ChartObj.VisitId = item.VisitId;
        $scope.ChartObj.EmailID = (item && item.PatientDetails && item.PatientDetails.EmailId) || (item && item.PatientDetailSummary && item.PatientDetailSummary.EmailId) || "";
        $scope.ChartObj.patientclear = 1;
        let mInstanceAdd = $uibModal.open({
            /*"templateUrl": "templates/uibpopups/emailReferalpopup.html",*/
            "templateUrl": "templates/uibpopups/emailReferalpopupNew.html",
            "controller": "USEmailReferalpopupCtrl",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "ChartObj": function () { return angular.copy($scope.ChartObj) },
                "BranchList": function () { return $scope.BranchesListArray || []; },
                "ScreenType": function () { return angular.copy(pobject.From) }

            },
            "windowClass": "modal__popup--1 bottom-to-top-modal",

        });
    }
    function addNewPatient() {
        //debugger
        var openBookAppt = "Profile";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "addNewPatient.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "modal__ninety--",
            "controller": "UsBookAppointmentPopupv2",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; }
            }
        });

        $scope.bookapptSetupPopUp.result.then(function (result) {
           // debugger
            $scope.RefreshProfile(result);
            //$scope.init();
            //$scope.SelectPatient($scope.PatientDetailsInfo.PatientID);

        }, function (cancel) {
        });
        $scope.closeuibpopup = function () {
            $uibModalInstance.dismiss("cancel");
        };

    }
    function BookApptPopupOpenedV2(item) {
        var openBookAppt = item || "";
        $scope.bookapptSetupPopUp = $uibModal.open({
            "templateUrl": "templates/appointment/BookAppointmentPopupv3.html",
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": "UsBookAppointmentPopupv2",
            "resolve": {
                "allUserList": function () { return angular.copy($scope.allUserList); },
                "openBookAppt": function () { return openBookAppt; },
                "BranchList": function () { return $scope.BranchesListArray || []; }
            }
        });

        $scope.bookapptSetupPopUp.result.then(function (resp) {
            if (resp != undefined) {
                let todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
                // if (resp.response.ConsultationDate === todaydate) {
                let tempappointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                tempappointmentinfo.AppointmentStatus = resp.response.AppointmentStatus || "";
                tempappointmentinfo.AppointmentID = resp.response.AppointmentID || 0;
                tempappointmentinfo.AppointmentId = resp.response.AppointmentID || 0;
                tempappointmentinfo.DoctorID = resp.response.DoctorID || 0;
                tempappointmentinfo.DoctorFullName = resp.response.DoctorName || "";
                tempappointmentinfo.HospitalId = resp.response.BranchId || null;
                tempappointmentinfo.TreatmentPlanId = resp.response.TreatmentPlanId || 0;
                tempappointmentinfo.BranchId = resp.response.BranchId || 0;
                tempappointmentinfo.BranchName = resp.response.BranchName || "";
                tempappointmentinfo.ConsultationDt = resp.response.ConsultationDt || "";
                tempappointmentinfo.ConsultationId = resp.response.ConsultationId || 0;
                tempappointmentinfo.StartTime = resp.response.StartTime || "";
                tempappointmentinfo.EndTime = resp.response.EndTime || "";
                tempappointmentinfo.BillingId = resp.response.BillingId || 0;
                tempappointmentinfo.PatientInsuranceList = resp.response.PatientInsuranceList || [];
                tempappointmentinfo.AppointmentTOSCodes = resp.response.AppointmentTOSCodes || [];
                tempappointmentinfo.CheckinStatusId = resp.response.CheckinStatusId;
                tempappointmentinfo.AppointmentStatusId = resp.response.AppointmentStatusId || null;
                tempappointmentinfo.PaymentTypeId = resp.response.PaymentTypeId || 2;
                tempappointmentinfo.VisitRemarks = resp.response.VisitRemarks || "";
                tempappointmentinfo.VisitTypeId = resp.response.VisitTypeId || null;
                tempappointmentinfo.ProfileStatusMasterId = resp.response.ProfileStatusMasterId || "";
                tempappointmentinfo.AppointmentTypeId = resp.response.AppointmentTypeId || null;

                eHnoteMasterDataService.addAppointmentInfo(tempappointmentinfo);
            }

            if ($scope.mainPatientProfileObj.MainTab == 1) {
                $scope.SelectPatient($scope.patientid);
                $scope.$broadcast("RefreshBookedProfileAppts");
            } else if ($scope.mainPatientProfileObj.MainTab == 2) {
                $scope.$broadcast("RefreshBookedVisitAppts");
            } else {}

        }, function () {
            console.log("dismiss");
            $scope.SelectPatient($scope.patientid);
        });

    }

    $scope.getPatientDepositAmountById = function (pageno, type) {
        //$scope.PatientDepositsObj.PageNumber = pageno || 1;
        //var type = (type === undefined || type === '') ? 'All' : type;
        var obj = {
            "DepositFrom": "",
            "DepositTo": "",
            "PatientId": $scope.cacheStorageItem.PatientID,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "PaymentModeId": 0,
            "PageSize": 20,
            "PageNumber": 1,
            "TransactionNumber": "",
            "SortBy": "Asc",
            "SearchType": "Deposit"
        };

        obj.PaymentModeId = parseInt(obj.PaymentModeId);


        if (obj.DepositFrom != "") {
            obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
        }
        if (obj.DepositTo != "") {
            obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
        }


        eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.PatientDepositsListArray = resp.data.rows || [];

                if ($scope.PatientDepositsListArray.length > 0) {
                    angular.forEach($scope.PatientDepositsListArray, function (pitem) {
                        pitem.IsselectedDeposit = false;
                    })

                }
                if ($scope.PatientDepositsListArray.length > 0) {
                    $scope.IsShowDepositScreen = false;
                } else {
                    $scope.IsShowDepositScreen = true;
                }
               // $scope.PatientDepositsObj.Count = resp.data.count || 0;
                $scope.DepositDetails = resp.data;
            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.ShowPatientInfo = function () {

        $scope.mInstanceAdd = $uibModal.open({
            templateUrl: 'templates/uibpopups/ProfileAdditionalinfoPopover.html',
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",

        });

        $scope.closeuibpopup1 = function () {
            $scope.mInstanceAdd.dismiss("cancel");
        };
    }

    // Create RX //

    $scope.medicalrxsUIB = function (type) {
        $scope.isGlobalPrescription = true;
        $scope.MedicalrxObj = {
            "IsRcopiaa": true,
            "IsCurrentEye": true,
            "IsCurrentSystem": true
        }    
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
         $scope.cacheStorageItem.PatientVisitId = $scope.mainPatientProfileObj.VisitId || 0;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);   

        if ($scope.PrescriptionsArray.length> 0) {
            $scope.ActivePrescriptionsArray = $filter("filter")($scope.PrescriptionsArray, { "IsSelected": true }) || [];
        }

        if (doctorinfo.doctordata.User[0].RcopiaProviderUserName == "") {
            alertify.error("This Organization does not have Rcopia credentials !");
            return false;
        }

        if ($scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode == null || $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode == '') {
            alertify.error("Please Add Patient Address to Proceed to Electronic Prescription");
            return false;
        }

        $scope.PrescriptionsArray.forEach(function (item) {
            item.IsSelected = false;
        });
       
        //$scope.isERxVisible = true;

        $scope.CreateRxObj = {
            "PatientId": $scope.selectedPatientData.Patient[0].PatientID,
            "ActivePrescriptionsArray": $scope.ActivePrescriptionsArray || []            
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/medicalrxsuib.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            //"size": "lg",
            // "windowClass": "newconsultationpopup overflow-y-hideen",
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "controller": "USMedicalRxCtrl",
            "resolve": {
                "cache": function () { return angular.copy($scope.cacheStorageItem); },
                "ScreenType": function () { return angular.copy(type); },
                //"ActivePrescriptionsArray": function () { return angular.copy($scope.ActivePrescriptionsArray); },
                "CreateRxObj": function () { return angular.copy($scope.CreateRxObj); },
            },

        });

        $scope.ShowSigFields = function (item) {
            item.SigfieldsShows = !item.SigfieldsShows;
        }
        $scope.Selectedmedic = function (item, val) {
            item.SelectedMedicationHistory = val;
        }

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp.Type == "NormalSave") {
                $scope.cacheStorageItem.IsNKMSelected = resp.response.IsNKMSelected || false;
                if (resp.response.PrescriptionDetails.length > 0) {
                    $scope.GetPatientPrescriptionDetails();

                } else {
                    $scope.GetPatientPrescriptionDetails();
                }
            }
            if (resp.Type == "Close") {
                $scope.isERxVisible = false;
                $scope.GetPatientPrescriptionDetails();
                $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = angular.copy(resp.cache.CurrentSystemicMedicationsHistory) || [];
            }
            if (resp.Type == "CreateErxsave") {
                $scope.GetPatientCreateNewRXPrescriptionDetails(resp);
                $scope.CreatRxInfo = {
                    "AppointmentId": resp.AppointmentId || 0,
                    "PatientVisitId": resp.ConsultationID || 0,
                }

                $scope.cacheStorageItem.appointmentid = resp.AppointmentId || 0;
                $scope.cacheStorageItem.ConsultationID = resp.ConsultationID || 0;
                $scope.cacheStorageItem.PatientVisitId = resp.ConsultationID || 0;

                $scope.AddToCache();
            }

        }, function (cancel) {

        });
    };
    $scope.GetPatientPrescriptionDetails = function () {
        var params = {
            "PatientId": $scope.cacheStorageItem.patientid,
            "AppointmentId": $scope.appointmentinfo.AppointmentID,
            "ConsultationId": $scope.cacheStorageItem.ConsultationID,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": $scope.HospitalId
        }
        eHnotePatientDataService.GetPatientPrescriptionDetails(params).then(function (resp) {
            if (resp.data.rows.length > 0) {

                $scope.cacheStorageItem.PrescriptionDetails = resp.data.rows || [];

                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails, function (bitem) {
                        bitem.CompleteAction = bitem.CompleteAction || null;
                        bitem.PatientInstructions = bitem.PatientInstructions || "";
                    });
                }
            } else {
                $scope.cacheStorageItem.PrescriptionDetails = [];
            }

        });
    }

// Create RX
    $scope.GetPatientCreateNewRXPrescriptionDetails = function (response) {

        $scope.cacheStorageItem.RcopiaPatientId = response.RcopiaPatientId;
        $scope.AddToCache();

        var params = {
            "AppointmentId": response.AppointmentId,
            "ConsultationID": response.ConsultationID,
            "PatientId": response.PatientId,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": $scope.HospitalId
        }
        eHnotePatientDataService.GetPatientCreateNewRXPrescriptionDetails(params).then(function (resp) {

            if (resp.data.rows.length > 0) {



                $scope.PrescriptionArray = [];
                $scope.PrescriptionArray = resp.data.rows[0].PrescriptionDetails || [];

                if ($scope.PrescriptionArray.length > 0) {
                    $scope.AddNewMedicalRxPrescriptionObj.PrescriptionList = [];
                        angular.forEach($scope.PrescriptionArray, function (pitem) {
                            pitem.RcopiaPrescriptionId = pitem.RcopiaPrescriptionId || "";
                         
                                var scheduletype = "unknown";
                                if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                                    scheduletype = "unknown";
                                } else {
                                    scheduletype = pitem.DrugSchedule;
                                }

                                if (pitem.DrugSchedule === "3" || pitem.DrugSchedule === "2" || pitem.DrugSchedule === "4" || pitem.DrugSchedule === "5" || pitem.DrugSchedule === "scheduled") {
                                    pitem.HasScheduledDrug = "y";
                                }

                                var obj = {
                                    "PatientPrescriptionDetailId": pitem.PatientPrescriptionDetailId || 0,
                                    "IsDischargePrescription": "y",
                                    "Deleted": "n",
                                    "RcopiaPrescriptionId": pitem.RcopiaPrescriptionId || "",
                                    "MedicationId": pitem.MedicationId,
                                    "DrugNDCID": pitem.DrugNDCID,
                                    "DrugRxNormId": pitem.DrugRxNormId,
                                    "DrugBrandName": pitem.DrugBrandName,
                                    "GenericName": pitem.DrugGenericName,
                                    "Supply": "n",
                                    "Compound": "n",
                                    "Action": pitem.Action,
                                    "Dose": pitem.Dose,
                                    "Route": pitem.Route,
                                    "DoseUnit": pitem.DoseUnit,
                                    "DoseTiming": pitem.Frequency,
                                    "DoseOther": pitem.DoseOther,
                                    "Duration": pitem.DaysSupply,
                                    "Quantity": pitem.Quantity,
                                    "QuantityUnit": pitem.QuantityUnit,
                                    "Refills": pitem.Refills,
                                    "SubstitutionPermitted": pitem.SubstitutionPermitted,
                                    "OtherNotes": pitem.OtherNotes,
                                    "PatientNotes": pitem.PatientInstructions,
                                    "MaximumDailyDose": "",
                                    "MaximumDailyDoseUnit": "",
                                    "Comments": "",
                                    "DeleteInd": pitem.DeleteInd,
                                    "DiagnosisList": [],
                                    "Schedule": scheduletype,
                                    "HasScheduledDrug": pitem.HasScheduledDrug,
                                    "CompleteAction": pitem.CompleteAction
                                };

                                $scope.AddNewMedicalRxPrescriptionObj.PrescriptionList.push(obj);
                       

                        });

                        $scope.AddNewMedicalRxPrescriptionObj.AppointmentId = response.AppointmentId;
                        $scope.AddNewMedicalRxPrescriptionObj.ConsultationId = response.ConsultationID;
                        $scope.AddNewMedicalRxPrescriptionObj.PatientId = response.PatientId;
                           
                        console.log($scope.AddNewMedicalRxPrescriptionObj);
                        eHnoteDiagnosisDataServices.AddPatientPrescriptionDetailsToRcopia($scope.AddNewMedicalRxPrescriptionObj).then(function (response) {
                            if (response.data.status === 'Success') {
                                $scope.openEPrescribeCreateRX();
                            }
                        });
                    }         
            }
        });
    }


    $scope.GetMedicalHistoriesByPatientId = function () {
        eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.cacheStorageItem.PatientID).then(function (resp) {
            if (resp.data != undefined) {
                $scope.AllergyArray = resp.data.rows[0].Allergy || [];
                if ($scope.AllergyArray.length > 0) {
                    let allergies = $scope.AllergyArray || [];
                    eHnoteMasterDataService.addAllergiesShownQuickAccess(allergies);
                } else {
                     var Algobj = {};
                     eHnoteMasterDataService.addAllergiesShownQuickAccess(Algobj);
                }
            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    }

    $scope.currenturl = $location.absUrl().split('?')[0];
    $scope.CurrentEnv = $scope.currenturl.split('/#')[0];

    $scope.openEPrescribeCreateRX = function () {



        $scope.RcopiaLocalPrescribeObj.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId || null;

        var serviceUrl = "https://web.staging.drfirst.com/sso/portalServices?";

        if ($scope.CurrentEnv == 'https://portal.ehnote.com') {
            serviceUrl = "https://web3.drfirst.com/sso/portalServices?";
        }
        $scope.RcopiaLocalPrescribeObj.Time = gmtTime();

        var subUrl = "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + $scope.RcopiaLocalPrescribeObj.SecretKey;

        $scope.RcopiaLocalPrescribeObj.MAC = "";
        $scope.RcopiaLocalPrescribeObj.MAC = calcMD5(subUrl);

        var MainUrl = serviceUrl + "rcopia_portal_system_name=" + $scope.RcopiaLocalPrescribeObj.PortalSystemName + "&rcopia_practice_user_name=" + $scope.RcopiaLocalPrescribeObj.PracticeUserName + "&rcopia_user_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaUserId + "&rcopia_user_external_id=" + $scope.RcopiaLocalPrescribeObj.UserExternalId + "&service=" + $scope.RcopiaLocalPrescribeObj.Service + "&action=" + $scope.RcopiaLocalPrescribeObj.Action + "&startup_screen=" + $scope.RcopiaLocalPrescribeObj.StartUpScreen + "&rcopia_patient_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientId + "&rcopia_patient_external_id=" + $scope.RcopiaLocalPrescribeObj.RcopiaPatientExternalId + "&time=" + $scope.RcopiaLocalPrescribeObj.Time + "&MAC=" + $scope.RcopiaLocalPrescribeObj.MAC;

        $scope.mainIframeSrcUrl = MainUrl;

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/medicalrxRcopia.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "mainIframeSrcUrl": function () { return $scope.mainIframeSrcUrl; },
            },
            "windowClass": "modal__ninety--",
            "controller": function ($scope, $uibModal, $uibModalInstance, $sce, eHnotePatientPVService, mainIframeSrcUrl) {

                console.log(mainIframeSrcUrl);

                $scope.mainIframeSrcUrl = $sce.trustAsResourceUrl(mainIframeSrcUrl);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.medicalrxrcopiasuibclose = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                    //  $uibModalInstance.dismiss("cancel");

                };

                $scope.medicalrxsuibclose = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                };
                $scope.savePrescription = function () {
                    var responsedata = {
                        "status": "Success"
                    };
                    $uibModalInstance.close(responsedata);
                };

            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);

            $scope.getMedicationsFromRcopiaCreatRX();

        }, function (cancel) {
        });


    };


    $scope.getMedicationsRequestObj = {
        "UserId": $scope.UserId,
        "PatientRcopiaId": null,
        "LastUpdatedDate": "08/30/2022 12:00:00"
    };

    $scope.getPrescriptionRequestObj = {
        "UserId": $scope.UserId,
        "RcopiaPatientId": null,
        "LastUpdatedDate": "08/30/2022 12:00:00"
    };


    $scope.getPrescriptionsFromRcopiaCreateRx = function () {



        $scope.getPrescriptionRequestObj.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId;

        var lastUpdatedDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
        var MaximumLastUpdateDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");

        var previousDate = new Date()
        previousDate.setDate(previousDate.getDate() - 1)
        var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");


        var params = {
            "UserId": $scope.UserId,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "RcopiaPatientId": $scope.getPrescriptionRequestObj.RcopiaPatientId,
            "LastUpdateDate": PreviousDate,
            "ConsultationId": $scope.CreatRxInfo.PatientVisitId,
            "AppointmentId": $scope.CreatRxInfo.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,          
            "PrescribedDate": lastUpdatedDate,
            "OrganizationId": $scope.HospitalId,
        };

        if ($scope.cacheStorageItem.MedicationLastUpdateDate != null) {

            var update = $scope.cacheStorageItem.MedicationLastUpdateDate || null;
            var UpDate = $filter('date')(update, "MM/dd/yyyy HH:mm:ss");
            params.LastUpdateDate = UpDate;
        }

        eHnoteDiagnosisDataServices.getPatientPrescriptionsFromRcopia(params).then(function (response) {

            if (response.status === 'Success') {
                $scope.GetPatientPrescriptionDetailsCreateRX();
            } else {
                $scope.GetPatientPrescriptionDetailsCreateRX();
            }
        });
    };

    $scope.getMedicationsFromRcopiaCreatRX = function () {



        $scope.getMedicationsRequestObj.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId;


        var lastUpdatedDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");
        var MaximumLastUpdateDate = $filter('date')(new Date(), "MM/dd/yyyy HH:mm:ss");

        var previousDate = new Date()
        previousDate.setDate(previousDate.getDate() - 1)
        var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

        var params = {
            "UserId": $scope.UserId,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
            "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
            "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
            "RcopiaPatientId": $scope.getMedicationsRequestObj.RcopiaPatientId,
            "LastUpdateDate": PreviousDate,
            "ConsultationId": $scope.CreatRxInfo.PatientVisitId,
            "AppointmentId": $scope.CreatRxInfo.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,      
            "PrescribedDate": lastUpdatedDate,
            "OrganizationId": $scope.HospitalId,
        }

        if ($scope.cacheStorageItem.MedicationLastUpdateDate != null) {

            var update = $scope.cacheStorageItem.MedicationLastUpdateDate || null;
            var UpDate = $filter('date')(update, "MM/dd/yyyy HH:mm:ss");
            params.LastUpdateDate = UpDate;
        }

        console.log(params.LastUpdateDate + "__LastUpdateDate");

        eHnoteDiagnosisDataServices.getPatientMedicationsFromRcopia(params).then(function (response) {

            var newUpdatedTime = params.LastUpdateDate;
            if (response.data.Status === 'Success') {

                $scope.getPrescriptionsFromRcopiaCreateRx();
            } else {
                $scope.getPrescriptionsFromRcopiaCreateRx();
            }

        });
    };
    $scope.GetPatientVisitCreateRX = function () {

        var object = {
            "AppointmentId": $scope.CreatRxInfo.AppointmentId || 0,
            "Type": 0,
            "VisitId": $scope.CreatRxInfo.PatientVisitId,
          
        };
        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                resp.data = resp.data || [];
                $scope.isERxVisible = false;
                var Todaydate = $filter("date")(new Date(), "yyyy-MM-dd");

                if (resp.data.length > 0) {
                    if (Todaydate == resp.data[0].AppointmentDt) {
                        $scope.cacheStorageItem.PrescriptionDetails = resp.data[0].PatientPrescription || [];
                        $scope.cacheStorageItem.ConsultationID = resp.data[0].VisitId || 0;
                        $scope.cacheStorageItem.appointmentid = resp.data[0].AppointmentId || 0;
                        $scope.AddToCache();
                    }
                }

               
                
            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };
    $scope.GetPatientPrescriptionDetailsCreateRX = function () {
        var params = {
            "PatientId": $scope.cacheStorageItem.patientid,
            "AppointmentId": $scope.CreatRxInfo.AppointmentId,
            "ConsultationId": $scope.CreatRxInfo.PatientVisitId,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": $scope.HospitalId
        }
        eHnotePatientDataService.GetPatientPrescriptionDetails(params).then(function (resp) {
            if (resp.data.rows.length > 0) {

                $scope.cacheStorageItem.PrescriptionDetails = resp.data.rows || [];

                if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.cacheStorageItem.PrescriptionDetails[0].PrescriptionDetails, function (bitem) {
                        bitem.CompleteAction = bitem.CompleteAction || null;
                        bitem.PatientInstructions = bitem.PatientInstructions || "";
                    });
                }
                $scope.AddToCache();
                $scope.GetPatientCurrentActiveMedicationsListCreateRX();
              
            } else {
                $scope.cacheStorageItem.PrescriptionDetails = [];
            }

        });
    }
    $scope.GetPatientCurrentActiveMedicationsListCreateRX = function () {
        var obj = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "OrganizationId": $scope.HospitalId,
            "PageSize": 10,
            "PageNumber": 1
        }
        eHnoteDiagnosisDataServices.GetPatientActiveMedicationsList(obj).then(function (resp) {
            console.log(JSON.stringify(resp));
            $scope.PrescriptionsArray = [];
            if (resp.data.Status == "Success") {
                $scope.PrescriptionsArray = resp.data.rows || [];
                angular.forEach($scope.PrescriptionsArray, function (pitem) {
                    pitem.IsSelected = false;
                    pitem.PatientInstructions = pitem.PatientInstructions || null;
                    pitem.Action = pitem.Action || "";
                    pitem.Dose = pitem.Dose || "";
                    pitem.Route = pitem.Route || "";
                    pitem.Frequency = pitem.Frequency || "";
                    pitem.DoseOther = pitem.DoseOther || "";
                });
            }

            $scope.GetPatientVisitCreateRX();
        }, function (err) {

        });
    }
    // Individual


    $scope.IndividualRefillRequest = function () {


        if (doctorinfo.doctordata.User[0].RcopiaProviderUserName == "") {
            alertify.error("This Organization does not have Rcopia credentials !");
            return false;
        }


        if ($scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode == null || $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode == '') {
            alertify.error("Please Add Patient Address to Proceed to Electronic Prescription");
            return false;
        }

        $scope.cacheStorageItem.RcopiaPatientId = $scope.cacheStorageItem.RcopiaPatientId || "";
        if ($scope.cacheStorageItem.RcopiaPatientId == '') {
            $scope.addUpdatePatientToRcopiaReqObj = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId,
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaProviderUserName": doctorinfo.doctordata.User[0].RcopiaProviderUserName,
                "RcopiaProviderUserExternalId": doctorinfo.doctordata.User[0].RcopiaProviderUserExternalId,
                "RcopiaProviderPassword": doctorinfo.doctordata.User[0].RcopiaProviderPassword,
                "PatientList": []
            };
            function getnewRcopiaPatientObj() {
                var obj = {
                    "FirstName": "",
                    "LastName": "",
                    "ExternalID": "",
                    "DeleteInd": "n",
                    "MiddleName": "",
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
                    "MobilePhone": ""
                };
                return obj;
            }
            $scope.RcopiaPatientObj = getnewRcopiaPatientObj();

            $scope.addUpdatePatientToRcopiaReqObj.PatientList = [];
            $scope.RcopiaPatientObj = getnewRcopiaPatientObj();
            $scope.RcopiaPatientObj.FirstName = $scope.selectedPatientData.Patient[0].FirstName;
            $scope.RcopiaPatientObj.LastName = $scope.selectedPatientData.Patient[0].LastName || "";
            $scope.RcopiaPatientObj.MiddleName = $scope.selectedPatientData.Patient[0].MiddleName || "";
            $scope.RcopiaPatientObj.ExternalID = $scope.selectedPatientData.Patient[0].PatientID;
            $scope.RcopiaPatientObj.RcopiaPatientId = $scope.selectedPatientData.Patient[0].RcopiaPatientId || "";
            $scope.RcopiaPatientObj.EmailId = $scope.selectedPatientData.Patient[0].EmailId;
            $scope.RcopiaPatientObj.DOB = $filter('date')($scope.selectedPatientData.Patient[0].DOB, "MM/dd/yyyy");
            var cGender = "M";
            if ($scope.selectedPatientData.Patient[0].Gender == 'Female') {
                cGender = "F";
            };
            if ($scope.selectedPatientData.Patient[0].Gender == "Unknown" || $scope.selectedPatientData.Patient[0].Gender == "Prefer not to tell") {
                cGender = "U";
            };


            if ($scope.selectedPatientData.Patient[0].IsDiseased) {
                $scope.RcopiaPatientObj.DeleteInd = "y";
            } else {
                $scope.RcopiaPatientObj.DeleteInd = "n";
            }

            $scope.RcopiaPatientObj.Sex = cGender;

            $scope.RcopiaPatientObj.MobilePhone = $scope.selectedPatientData.Patient[0].MobileNo;

            if ($scope.selectedPatientData.Patient[0].ContactNo.length > 3) {
                $scope.RcopiaPatientObj.HomePhone = $scope.selectedPatientData.Patient[0].ContactNo;
            } else {
                $scope.RcopiaPatientObj.HomePhone = "";
            }

            if ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == '' && $scope.PatientAddressInfo.PostalAddress.AddressLine2 == '') {
                $scope.RcopiaPatientObj.Address1 = "Unknown";
            } else {
                $scope.RcopiaPatientObj.Address1 = $scope.PatientAddressInfo.PostalAddress.AddressLine1;
                $scope.RcopiaPatientObj.Address2 = $scope.PatientAddressInfo.PostalAddress.AddressLine2;
            }

            $scope.RcopiaPatientObj.City = $scope.selectedPatientData.PatientAddress.PostalAddress.CityName;
            $scope.RcopiaPatientObj.State = $scope.selectedPatientData.PatientAddress.PostalAddress.StateCode; /*StateName*/
            $scope.RcopiaPatientObj.Zip = $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode;

            if ($scope.selectedPatientData.Patient[0].AdditionalInfo != undefined) {
                $scope.RcopiaPatientObj.Ethnicity = $scope.selectedPatientData.Patient[0].AdditionalInfo.EthnicityName;
                $scope.RcopiaPatientObj.Race = $scope.selectedPatientData.Patient[0].AdditionalInfo.RaceName;
                $scope.RcopiaPatientObj.PreferredLanguage = $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName;
            }
            $scope.addUpdatePatientToRcopiaReqObj.PatientList.push($scope.RcopiaPatientObj);
            eHnoteDiagnosisDataServices.addPatientToRcopia($scope.addUpdatePatientToRcopiaReqObj).then(function (response) {

                if (response.data.status === 'Success') {
                    if (response.data.rows.length > 0) {
                        $scope.RcopiaPatientObj.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.selectedPatientData.Patient[0].RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.cacheStorageItem.RcopiaPatientId = response.data.rows[0].RcopiaPatientId;
                        $scope.AddToCache();
                    }

                    $scope.RefillRequestDataAdded();
                };
            });
        } else {
            $scope.RefillRequestDataAdded();
        }
    }
    $scope.RefillRequestDataAdded = function () {


        function getEmptyPrescriptionObj() {

            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

            var previousDate = new Date()
            previousDate.setDate(previousDate.getDate() - 1)
            var PreviousDate = $filter('date')(previousDate, "MM/dd/yyyy HH:mm:ss");

            $scope.cacheStorageItem.PrescriptionDetails = $scope.cacheStorageItem.PrescriptionDetails || [];
            if ($scope.cacheStorageItem.PrescriptionDetails.length > 0) {
                var LastUpdateDateFormate = $scope.cacheStorageItem.PrescriptionDetails[0].LastUpdateDate;
            } else {
                var LastUpdateDateFormate = PreviousDate;
            }

            var obj = {

                "VisitId": 0,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "RcopiaPatientId": 0,
                "PatientPrescriptionId": 0,
                "AppointmentId": 0,
                "LastUpdateDate": LastUpdateDateFormate,
                "DeleteInd": "N",
                "PrescriptionDetails": [],
            };
            return obj;
        };

        $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

        $scope.PrescriptionMainAddObj.PrescriptionDetails = $filter("filter")($scope.PrescriptionsArray, { "IsSelected": true }) || [];

      
        var CurrentTime = $filter("date")(new Date(), "HH:mm");
        let apptdate = new Date();
        apptdate.setMinutes(apptdate.getMinutes() + parseInt("15"));
        var EndTime = $filter('date')(apptdate, "HH:mm");

        $scope.PrescriptionMainAddObj.VisitId = $scope.cacheStorageItem.ConsultationID || 0;
        $scope.PrescriptionMainAddObj.AppointmentId = $scope.cacheStorageItem.appointmentid || 0;
        $scope.PrescriptionMainAddObj.DoctorId = $scope.UserId;
        $scope.PrescriptionMainAddObj.AppointmentTypeId = 9;
        $scope.PrescriptionMainAddObj.AppointmentType = 'Rx Appointment';

        $scope.PrescriptionMainAddObj.StartTime = CurrentTime;
        $scope.PrescriptionMainAddObj.EndTime = EndTime;


     
        eHnotePatientDataService.AddUpdateCreateNewRXPrescriptionDetails($scope.PrescriptionMainAddObj, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {

            if (response.status === "Success") {
                alertify.success("Medications Added  Successfully");
                if (response.PrescriptionDetails.length > 0) {
                    var Createresponsedata = {
                        "status": "Success",
                        "CreateRX": true,
                        "Type": "CreateErxsave",
                        "AppointmentId": response.AppointmentId,
                        "ConsultationID": response.ConsultationID,
                        "PatientId": response.PatientId,
                        "RcopiaPatientId": $scope.cacheStorageItem.RcopiaPatientId,
                    };
                  

                    $scope.GetPatientCreateNewRXPrescriptionDetails(Createresponsedata);

                    $scope.CreatRxInfo = {
                        "AppointmentId": response.AppointmentId || 0,
                        "PatientVisitId": response.ConsultationID || 0,
                    }
                    $scope.cacheStorageItem.appointmentid = response.AppointmentId || 0;
                    $scope.cacheStorageItem.ConsultationID = response.ConsultationID || 0;
                    $scope.cacheStorageItem.PatientVisitId = response.ConsultationID || 0;

                    $scope.AddToCache();
                }
            } else {
                alertify.error("Appointment already booked !");
            }
        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };

   

    $scope.updateERxButtonVisibility = function () {      
        $scope.isERxVisible = $scope.PrescriptionsArray.some(function (item) {
            return item.IsSelected === true;
        });
    };
    $scope.activeIndex = 0;
    $scope.patients = [];

    $scope.scrollToActiveItem = function () {
        var container = document.querySelector('.overflow-y-auto.slim-scroll');
        if (!container) return;

        var items = container.querySelectorAll('ul.list__unstyled-- li');
        if ($scope.activeIndex >= items.length) return;

        var activeItem = items[$scope.activeIndex];
        if (!activeItem) return;

        container.scrollTop = activeItem.offsetTop;
    };


    $scope.onInputKeydownPatientProfile = function (event) {
        const len = $scope.patients.length;
        switch (event.key) {
            case 'ArrowDown':
                if ($scope.activeIndex < len - 1) {
                    $scope.activeIndex++;
                    $scope.scrollToActiveItem();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                if ($scope.activeIndex > 0) {
                    $scope.activeIndex--;
                    $scope.scrollToActiveItem();
                }
                event.preventDefault();
                break;
            case 'Enter':
                const item = $scope.patients[$scope.activeIndex];
                if (item) $scope.RefreshProfile(item);
                event.preventDefault();
                break;
        }
    };

    // Getoptha
    $scope.GetPatientRxTab = function () {
        var type = 0;
        if ($scope.mainPatientProfileObj.VisitId === 0) {
            type = 1;
        }
        var object = {
            "AppointmentId": $scope.mainPatientProfileObj.AppointmentId || 0,
            "Type": type,
            "VisitId": $scope.mainPatientProfileObj.VisitId || 0,
        };

        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            resp.data = resp.data || [];

            $scope.isERxVisible = false;
            var Todaydate = $filter("date")(new Date(), "yyyy-MM-dd");

            if (resp.data.length > 0) {
                if (Todaydate == resp.data[0].AppointmentDt) {
                    $scope.cacheStorageItem.PrescriptionDetails = resp.data[0].PatientPrescription || [];
                    $scope.cacheStorageItem.ConsultationID = resp.data[0].VisitId || 0;
                    $scope.cacheStorageItem.appointmentid = resp.data[0].AppointmentId || 0;
                    $scope.AddToCache();
                }
            }
                   
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };

    $scope.PrescriptionHistoryinfo = {
        templateUrl: 'Prescriptionlogs.html',
    };

    $scope.PrescriptionlogsArray = [];
    $scope.SelectedHistoryData = function (data) {
        if (data.length > 0) {
            $scope.PrescriptionlogsArray = data || [];
        }

    }
    $scope.GetLatestErxAppointmentMedications = function () {

        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        var params = {
            "PatientId": $scope.cacheStorageItem.patientid,
            "CurrentDate": currentdate,
            "ParentOrganizationId": $scope.ParentHospitalId
        }
        eHnotePatientDataService.GetLatestErxAppointmentMedications(params).then(function (resp) {
            if (resp.data.PatientPrescriptionDetails.length > 0) {

                let itm = resp.data.PatientPrescriptionDetails[0];             
                $scope.cacheStorageItem.appointmentid = itm.AppointmentId || 0;
                $scope.cacheStorageItem.ConsultationID = itm.ConsultationId || 0;
                $scope.cacheStorageItem.VisitId = itm.ConsultationID || 0;
                $scope.AddToCache();
            
            } 

        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };

    $rootScope.isAppointmentOpen = true;
    $scope.toggleAppointment = function () {
        $rootScope.isAppointmentOpen = !$rootScope.isAppointmentOpen;
    };

}]);



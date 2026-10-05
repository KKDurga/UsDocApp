"use strict";
eHnoteWebApp.controller("USRegisterPatientCtrl", ["$scope", "$rootScope", "Upload", "$location", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteDbStaticDataService", "alertify", "eHnoteOrgReferralDataServices", "eHnotePatientAddressDataServices", "eHnoteLoginStatusService", "datacookieFactory", "datapersistanceFactory", "eHnoteCacheStorageService", "eHnoteValidateUsersDataService", "$uibModal", "$timeout", "$filter", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteUserAppointmentDataService", "eHnoteInsuranceService", "eHnoteConditionsDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnotePrintService", "$q", "localStorageFactory", "eHnoteMainAppointmentService", "eHnoteReferalDataService","InventoryService",
    function ($scope, $rootScope, Upload, $location, eHnoteMasterDataService, eHnotePatientDataService, eHnoteDbStaticDataService, alertify, eHnoteOrgReferralDataServices, eHnotePatientAddressDataServices, eHnoteLoginStatusService, datacookieFactory, datapersistanceFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, $uibModal, $timeout, $filter, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteUserAppointmentDataService, eHnoteInsuranceService, eHnoteConditionsDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnotePrintService, $q, localStorageFactory, eHnoteMainAppointmentService, eHnoteReferalDataService, InventoryService) {

        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();


       

        if (userLoginDetails.loggedinStatus) {
            $rootScope.showMainPageHeader = true;
        } else {
            $rootScope.showMainPageHeader = false;
            datapersistanceFactory.clearAll();
            $location.path("/login");
            return;
        }
        $scope.showpatientsummary = false;
        $scope.patientsummary = function () {
            $scope.showpatientsummary = !$scope.showpatientsummary;
        };
        $scope.Showeditpatient = false;
        $rootScope.RegisterPatientScreen = true;
        $scope.ShowpatientsDetails = false;
        $scope.DefaultShowDetails = false;
        $scope.Registeraddpopup = false;
        $scope.ValidateIndictor = false;
        $scope.FocusOnMObileText = true;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
        var emptyArray = [];
        $scope.PatientEthnicityList = [];
        $scope.PatientRaceList = [];
        eHnoteMasterDataService.addAppointmentInfo(emptyArray);

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

        $scope.patientid = 0;
        $scope.PatientFullName = "";
        $scope.PatientDisplayID = 0;

        $scope.familyname = "";
        $scope.HospitalCD = "";
        $scope.familyidchange = "Y";

        $scope.selectedEthnicity = 'Select';
        $scope.selectedRace = 'Select';
        var doctorinfo = eHnoteMasterDataService.getUserInfo();

        $scope.RoleId = doctorinfo.RoleID;

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
        }
        var frmregpatient = eHnoteMasterDataService.getPatientvalConsult();
        $scope.frmEditAppointment = eHnoteMasterDataService.getAddPatientwithoutConsult();
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);
        $scope.MartialStatusList = angular.copy(mObj.masterMartialStatusList);
        $scope.BloodGroupList = angular.copy(mObj.masterBloodGroupList);

        $scope.obj = {
            "IsEthnicitySelected": [],
            "IsRaceSelected": []
        }

        $scope.initPatientEdit = function (obj) {
            console.log(obj);

            var patientitem = {
                "Patient": [{
                    "PatientId": obj.PatientData.PatientID
                }]
            };

            $scope.SelectPatient(patientitem, 1);

        };


        $scope.TitlesList = [];
        $q.all([

            eHnoteSettingsDataService.GetPatientRelatedMasterData()
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                $scope.PatientMasterDataArray = resp[0].data.rows;
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
                $scope.InsurancePlanTypeList = resp[0].data.InsurancePlanType;
                $scope.PatientPrefixList = resp[0].data.PatientTitle;
                $scope.PatientLanguageProficiencyList = resp[0].data.LanguageProficiency;
                $scope.PatientLanguageExpressionList = resp[0].data.LanguageExpression;
                $scope.PatientClassArray = resp[0].data.PatientClass;
                $scope.InsuranceCoverageList = resp[0].data.CoverageArray;
                $scope.InsuranceStatusList = resp[0].data.InsuranceStatus;

                if (resp[0].data.TitleArray.length != 0) {
                    $scope.TitlesList = resp[0].data.TitleArray;
                    $scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
                    $scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;

                    $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
                    $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
                }



            }


         
            
            var opatientApptGet = eHnoteMasterDataService.getPatientApptDataApptList();
            if (opatientApptGet.IsFromApptScreen) {
                $scope.initPatientEdit(opatientApptGet);
            }




        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });

        //$q.all([
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientSuffix'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientEthnicity'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientRace'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientSexualOrientation'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientGenderIdentity'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientNationality'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientLanguage'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('InsuranceRelationship'),
        //    eHnoteSettingsDataService.GetMasterInsuranceCoverageList(),
        //  //  eHnoteSettingsDataService.GetAllDropdownValuesByType('InsuranceCoverage'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('InsuranceStatus'),
        //    eHnoteSettingsDataService.GetAllInsurancePlans(),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('InsurancePlanType'),
           
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientTitle'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('LanguageProficiency'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('LanguageExpression'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('PatientClass'),
        //    eHnoteSettingsDataService.GetAllDropdownValuesByType('BillingType')

        //]).then(function (resp) {
        //    if (resp[0].data.rows.length !== 0) {
        //        $scope.PatientSuffixList = resp[0].data.rows;
        //    }
        //    if (resp[1].data.rows.length !== 0) {
        //        $scope.PatientEthnicityList = resp[1].data.rows;

        //        console.log($scope.PatientEthnicityList);

        //        if ($scope.PatientEthnicityList.length > 0) {
        //            angular.forEach($scope.PatientEthnicityList, function (kitem) {
        //                kitem.IsSelected = false;
        //                kitem.Id = 0;
        //            });
        //        }
        //    }
        //    if (resp[2].data.rows.length !== 0) {
        //        $scope.PatientRaceList = resp[2].data.rows;
        //        if ($scope.PatientRaceList.length > 0) {
        //            angular.forEach($scope.PatientRaceList, function (kitem) {
        //                kitem.IsSelected = false;
        //                kitem.Id = 0;
        //            });
        //        }
        //    }
        //    if (resp[3].data.rows.length !== 0) {
        //        $scope.PatientSexualOrientationList = resp[3].data.rows;
        //    }
        //    if (resp[4].data.rows.length !== 0) {
        //        $scope.PatientGenderIdentityList = resp[4].data.rows;
        //    }
        //    if (resp[5].data.rows.length !== 0) {
        //        $scope.PatientNationalityList = resp[5].data.rows;
        //    }
        //    if (resp[6].data.rows.length !== 0) {
        //        $scope.PatientLanguageList = resp[6].data.rows;
        //    }
        //    if (resp[7].data.rows.length !== 0) {
        //        $scope.InsuranceRelationShipList = resp[7].data.rows;
        //    }
        //    if (resp[8].data.rows.length !== 0) {
        //        $scope.InsuranceCoverageList = resp[8].data.rows;
        //    }
        //    if (resp[9].data.rows.length !== 0) {
        //        $scope.InsuranceStatusList = resp[9].data.rows;
        //    }
        //    if (resp[10].data.length !== 0) {
        //        $scope.InsurancePlanList = resp[10].data;
        //    }
        //    if (resp[11].data.rows.length !== 0) {
        //        $scope.InsurancePlanTypeList = resp[11].data.rows;           
        //    }
        //    if (resp[12].data.rows.length !== 0) {
        //        $scope.PatientPrefixList = resp[12].data.rows;
        //    }
        //    if (resp[13].data.rows.length !== 0) {
        //        $scope.PatientLanguageProficiencyList = resp[13].data.rows;
        //    }
        //    if (resp[14].data.rows.length !== 0) {
        //        $scope.PatientLanguageExpressionList = resp[14].data.rows;
        //    }

        //    if (resp[15].data.rows.length !== 0) {
        //        $scope.PatientClassArray = resp[15].data.rows;
        //    }
        //    if (resp[16].data.rows.length !== 0) {
        //        $scope.PatientBillingTypeArray = resp[16].data.rows;
        //    }


        //    var opatientApptGet = eHnoteMasterDataService.getPatientApptDataApptList();
        //    if (opatientApptGet.IsFromApptScreen) {
        //        InitializeNewBranches();
        //        $scope.initPatientEdit(opatientApptGet);
        //    } else {
        //        InitializeNewBranches();
        //    }

        //}, function (err) {
        //    console.log(err);
        //    alertify.error("Getting Data Failed");
        //});


        $scope.AreaCodeArrayList = [
            { "Id": 1, "CodeName": "+1" },
            { "Id": 2, "CodeName": "+91" },
            { "Id": 3, "CodeName": "+315" },
            { "Id": 4, "CodeName": "+325" }
        ];
        $scope.Patientimage = "";

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
        $scope.Headers.PatientHeader = true;
        $scope.clearHeaderInfo = function () {
            $scope.Headers = $scope.GetHeaderInfo();
        };
        $scope.SaveTypeObj = {
            "TypeName": "PatientDetails"
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
                    "EmailID": ""
                },
                "CurrentAge": "",
                "S3URL": "",
                "LeadSourceInd": "N",
                "PatientDisplayID": "",
                "Age": ""
            }
            return obj;
        }
        $scope.PatientDetailsInfo = GetPatientDetailsInfo();
        $scope.PatientDetailSummary = GetPatientDetailsInfo();
        $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode = $scope.AreaCodeArrayList[0].CodeName;
        $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode = $scope.AreaCodeArrayList[0].CodeName;

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
                    "CountyCodeObj": ""
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
                    "CountyCodeObj": ""
                },
                "IsCheckCopy": false
            }
            return obj;
        }
        $scope.PatientAddressInfo = GetPatientAddress();
        $scope.PatientAddressSummary = GetPatientAddress();

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
                    "AreaCode": $scope.AreaCodeArrayList[0].CodeName,
                    "MobileNumber": "",
                    "ParentPatientId": 0,
                    "RelationObj": "",
                    "Age": "",
                    "DOB": "",
                    "CurrentAge": "",
                    "ageinYears": "",
                    "ageinMonths": "",
                    "ageinDays": ""
                }]
            }
            return obj;
        }
        $scope.FamilyInfo = GetFamilyInfo();
        $scope.FamilySummary = [];

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
                "LastName": "",
                "PatinetSuffixId": 0,
                "PatientSuffixName": "",
                "PatinetSuffixObj": "",
                "SexualOrientation": "",
                "SexualOrientationId": 0,
                "SexualOrientationObj": "",
                "GenderIdentityStatus": "",
                "GenderIdentityStatusId": 0,
                "GenderIdentityStatusObj": ""
            }
            return obj;
        }
        $scope.DemographicInfo = GetDemographicInfo();
        $scope.DemographicSummary = GetDemographicInfo();

        function GetInsuranceInfo() {
            var obj = {
                "PatientId": 0,
                "FullName": "",
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientInsuranceDetails": [
                    {
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
                        "PolicyHolderName" : "",
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
                        "StatusId": 282,  //0,
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
                        "InsuredPersonSSN":""
                    }
                ]
            }

            var filterStatus = [];
            filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": 1}, true) || [];
            if (filterStatus.length > 0) {
                obj.PatientInsuranceDetails[0].InsuranceRelationShipObj = filterStatus[0];
            }

            return obj;
        }
        $scope.PatientInsuranceInfo = GetInsuranceInfo();
        $scope.PatientInsuranceSummary = [];

        function GetDesignatedInfo() {
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientID": 0,
                "PCP": 0,
                "Provider1": 0,
                "Provider2": 0,
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
                "Provider1Obj": "",
                "Provider2Obj": "",
                "CorporationObj": "",
                "OfficeObj": "",
                "PCPDoctorName": "",
                "Provider1Name": "",
                "Provider2Name": "",
                "CorporationName": "",
                "OfficeName": ""
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
        $scope.PatientDesignatedInfo = GetDesignatedInfo();
        $scope.PatientDesignatedSummary = GetDesignatedInfo();

        $scope.ageinYears = "";
        $scope.ageinMonths = "";
        $scope.ageinDays = "";
        $scope.countyCodesPostalArray = [];
        $scope.countyCodesArray = [];

        $scope.GetAllHospitalEquipments = function () {
            //var obj = {
            //    "ParentOrganizationId": $scope.ParenthospitalId || 0
            //}
            $scope.ParenthospitalId = $scope.ParenthospitalId || 0;
            eHnotePatientAddressDataServices.GetAllHospitalEquipments($scope.ParenthospitalId).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    $scope.HospitalEquipmentList = resp.data.rows;
                }
            });
        };
        $scope.GetAllRelationshipTypes = function () {
            eHnoteMainAdminServices.GetAllRelations().then(function (resp) {
                if (resp.data != undefined) {
                    $scope.RelationShipTypeList = resp.data;

                    //$scope.RelationShipTypeList = $filter("filter")(resp.data, function (item) {
                    //    return item.RelationId !== 1;
                    //});
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });
        }
        $scope.PayorAllLIstArray = [];
        $scope.GetOrganizationPayorAllList = function () {
            var param = {
                "SearchText": "",
                "PageSize": 20,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
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
        $scope.GetOrganizationNewPayorAllList = function (val) {
            var param = {
                "SearchText": val,
                "PageSize": 20,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": 1,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "GetAllIndicator": 0,
                "PayorTypeId": 0
            }
            return eHnoteInsuranceService.GetOrganizationPayorsList(param).then(function (response) {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
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
        $scope.init = function () {
            //eHnoteDbStaticDataService.GetAllTitlesByParentId($scope.ParenthospitalId).then(function (resp) {
            //    $scope.TitlesList = resp.data;
            //    $scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
            //    $scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;

            //    $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
            //    $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;

            //}, function (err) {
            //    console.log(err);
            //    alertify.error("Getting Titles Failed");
            //});
        }
        $scope.init();
        $scope.GetAllHospitalEquipments();
        $scope.GetAllRelationshipTypes();
        $scope.GetOrganizationPayorAllList();
        $scope.GetMasterPayorPlanTypes();

        var getplacesParams = { "DoctorID": doctorinfo.doctordata.User[0].DoctorID, "ActiveIND": "Y" };
        eHnoteDbStaticDataService.getCity(getplacesParams, onsuccesscity, onerrorcity);
        function onsuccesscity(data) {
            $scope.cityValues = data;
            $scope.cityDatavalue = [];
            //angular.forEach($scope.cityValues, function (item) {
            //    if (item.StateID === $scope.patientinfo.State) {
            //        $scope.cityDatavalue.push(item);
            //    }
            //});
        }
        function onerrorcity(err) {
            console.log(err);
        }
        $scope.states = eHnotePatientAddressDataServices.getStates($scope.HospitalId, getstatesSuccess, getstatesFailed);
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

        $scope.MasterReferralSource = function () {
            eHnoteOrgReferralDataServices.GetMasterReferralSource(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (response) {
                $scope.ReferralSouceMaster = response.data.rows;
            });
        }

        $scope.MasterReferralSource();


        $scope.getDate = function (Tmpfromdate, patientObj, tempObj) {
            if (Tmpfromdate != "") {
                $scope.BSMSind1 = true;
                //$scope.BSMSind = true;
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
                $scope.ageinYears = ydiff.toString();
                $scope.ageinMonths = mdiff.toString();
                $scope.ageinDays = ddiff.toString();
                if ($scope.ageinMonths === "-1") {
                    $scope.ageinMonths = "";
                }
                var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
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
        $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        $scope.setAgeandMonth = function (year, month, days) {
            $scope.ageinYears = year;
            $scope.ageinMonths = month;
            $scope.ageinDays = days;
            if ($scope.ageinYears != "") {
                $scope.PatientDetailsInfo.BSMSind = false;
            }
            var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
            $scope.PatientDetailsInfo.CurrentAge = curAge;
            var dob = $scope.getDateOfBirth($scope.ageinYears, $scope.ageinMonths, $scope.ageinDays);
            $scope.PatientDetailsInfo.DOB = moment(dob).format('MM-DD-YYYY');
            daysInMonth(month, year);
            if ($scope.ageinYears === "") {
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



        $scope.changeMaritalStatus = function (MaritalStatusId) {
            var filterStatus = $filter("filter")($scope.MartialStatusList, { "Id": MaritalStatusId }, true) || [];
            if (filterStatus.length > 0) {
                $scope.PatientDetailsInfo.MaritalStatusName = filterStatus[0].MaritalStatus;
            }
        }
        $scope.changeBloodgroup = function (item) {
            if (item === null) {

            }
            var filterStatus = $filter("filter")($scope.BloodGroupList, { "Id": item }, true) || [];
            if (filterStatus.length > 0) {
                $scope.PatientDetailsInfo.BloodGroupName = filterStatus[0].BloodGroupName;
                $scope.PatientDetailsInfo.BloodGroupId = filterStatus[0].Id;

            }
        }
        $scope.changeTitle = function (Titleid) {
            if (Titleid != null) {
                var filtertitle = $filter("filter")($scope.TitlesList, { "Id": Titleid }, true) || [];
                if (filtertitle.length > 0) {
                    $scope.PatientDetailsInfo.Title = filtertitle[0].Name;
                    $scope.PatientDetailsInfo.TitleId = filtertitle[0].Id;
                }

                if ($scope.PatientDetailsInfo.Title === "Mr" || $scope.PatientDetailsInfo.Title === "Master" || $scope.PatientDetailsInfo.Title === "Baby Of" || $scope.PatientDetailsInfo.Title === "Dr" || $scope.PatientDetailsInfo.Title === "SMT.") {
                    $scope.PatientDetailsInfo.Gender = 'Male';
                }
                else if ($scope.PatientDetailsInfo.Title === "Mrs" || $scope.PatientDetailsInfo.Title === "Miss" || $scope.PatientDetailsInfo.Title === 'Ms' || $scope.PatientDetailsInfo.Title === "Baby") {
                    $scope.PatientDetailsInfo.Gender = 'Female';
                }
                else {
                    $scope.PatientDetailsInfo.Gender = "";
                }
            }
        }

        $scope.changeTagPatient = function (Tagobj) {
            if (Tagobj != null && Tagobj != "") {
                $scope.PatientDetailsInfo.PatientTagId = Tagobj.HospitalEquipmentId;
                $scope.PatientDetailsInfo.PatientTagName = Tagobj.HospitalEquipmentName;
            } else {
                Tagobj = "";
            }
        }

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
        $scope.onCityChange = function (item) {
            $scope.PatientAddressInfo.PermanentAddress.CityName = item.CityName || "";
            $scope.PatientAddressInfo.PermanentAddress.CityId = item.CityId;
            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.patientList = resp.data;

                    $scope.PatientAddressInfo.PermanentAddress.StateName = $scope.patientList[0].StateName;
                    $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.patientList[0].StateId;
                    $scope.PatientAddressInfo.PermanentAddress.CountryName = $scope.patientList[0].CountryName;
                    $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.patientList[0].CountryId;

                }
            });
            //$scope.locationsArray = [];
            //eHnoteSettingsDataService.getLocationsByCityId(item.CityId).then(function (resp) {
            //    if (resp.data.length > 0) {
            //        $scope.locationsArray = resp.data;
            //    }
            //});
            //$scope.patientinfo.Street = "";
            //$scope.patientinfo.Location = "";
        };
        $scope.ONchangePatientState = function (item, type) {
            if (type === "Permanent") {
                $scope.PatientAddressInfo.PermanentAddress.StateName = item.Name;
                $scope.PatientAddressInfo.PermanentAddress.StateId = item.StateId;
                //$scope.patientinfo.Street = "";
                //$scope.patientinfo.Location = "";
                $scope.PatientAddressInfo.PermanentAddress.CityName = "";
            } else {
                $scope.PatientAddressInfo.PostalAddress.StateName = item.Name;
                $scope.PatientAddressInfo.PostalAddress.StateId = item.StateId;
                $scope.PatientAddressInfo.PostalAddress.CityName = "";
            }
        };
        $scope.OnchangeCountry = function (item, type) {
            if (type === "Permanent") {
                $scope.PatientAddressInfo.PermanentAddress.CountryName = item.Name;
                $scope.PatientAddressInfo.PermanentAddress.CountryId = item.Id;
            } else {
                $scope.PatientAddressInfo.PostalAddress.CountryName = item.Name;
                $scope.PatientAddressInfo.PostalAddress.CountryId = item.Id;
            }
        }

        $scope.ChangeZipCode = function (val) {
            val = val || "";
            $scope.countyCodesArray = [];
            if (val.length >= 5) {

                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {

                        $scope.pincodesarray = resp.data.rows || [];
                        $scope.pincodesarraycount = resp.data.rows.length;
                        if ($scope.pincodesarray.length !== 0) {
                            $scope.PatientAddressInfo.PermanentAddress.CityId = $scope.pincodesarray[0].CityId;
                            $scope.PatientAddressInfo.PermanentAddress.CityName = $scope.pincodesarray[0].CityName;
                            $scope.PatientAddressInfo.PermanentAddress.StateName = $scope.pincodesarray[0].StateName;
                            $scope.PatientAddressInfo.PermanentAddress.StateId = $scope.pincodesarray[0].StateId;
                            $scope.PatientAddressInfo.PermanentAddress.CountryName = $scope.pincodesarray[0].CountryName;
                            $scope.PatientAddressInfo.PermanentAddress.CountryId = $scope.pincodesarray[0].CountryId;

                            $scope.searchCountyByZipCode(val);
                        }
                    }
                });

            }
            else {
                $scope.PatientAddressInfo.PermanentAddress.CityId = 0;
                $scope.PatientAddressInfo.PermanentAddress.CityName = "";
                $scope.PatientAddressInfo.PermanentAddress.StateName = "";
                $scope.PatientAddressInfo.PermanentAddress.StateId = 0;
                $scope.PatientAddressInfo.PermanentAddress.CountryName = "";
                $scope.PatientAddressInfo.PermanentAddress.CountryId = 0;
                $scope.PatientAddressInfo.PermanentAddress.CountyName = 0;
                $scope.PatientAddressInfo.PermanentAddress.CountyId = "";
                $scope.PatientAddressInfo.PermanentAddress.CountyCodeObj = "";
            }
        }
        $scope.searchCountyByZipCode = function (zipcode) {
            eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.countyCodesArray = resp.data.rows || [];
                }
            });
        };

        $scope.selectcounty = function (item, subitem, type) {
            subitem.CountyCodeObj = subitem.CountyCodeObj || "";
            if (type === "Permanent") {
                item.PermanentAddress.CountyName = subitem.CountyCodeObj.CountyName;
                item.PermanentAddress.CountyId = subitem.CountyCodeObj.CountyId;
            } else {
                item.PostalAddress.CountyName = subitem.CountyCodeObj.CountyName;
                item.PostalAddress.CountyId = subitem.CountyCodeObj.CountyId;
            }
        }
        $scope.changeaddressDetails = function (item) {
            if (item == true) {
                $scope.PatientAddressInfo.PostalAddress.AddressLine1 = $scope.PatientAddressInfo.PermanentAddress.AddressLine1;
                $scope.PatientAddressInfo.PostalAddress.AddressLine2 = $scope.PatientAddressInfo.PermanentAddress.AddressLine2;
                $scope.PatientAddressInfo.PostalAddress.ZipCode = $scope.PatientAddressInfo.PermanentAddress.ZipCode;
                $scope.PatientAddressInfo.PostalAddress.CountyName = $scope.PatientAddressInfo.PermanentAddress.CountyName;
                $scope.PatientAddressInfo.PostalAddress.CountyId = $scope.PatientAddressInfo.PermanentAddress.CountyId;
                $scope.PatientAddressInfo.PostalAddress.CityName = $scope.PatientAddressInfo.PermanentAddress.CityName;
                $scope.PatientAddressInfo.PostalAddress.CityId = $scope.PatientAddressInfo.PermanentAddress.CityId;
                $scope.PatientAddressInfo.PostalAddress.StateName = $scope.PatientAddressInfo.PermanentAddress.StateName;
                $scope.PatientAddressInfo.PostalAddress.StateId = $scope.PatientAddressInfo.PermanentAddress.StateId;
                $scope.PatientAddressInfo.PostalAddress.CountryName = $scope.PatientAddressInfo.PermanentAddress.CountryName;
                $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.PatientAddressInfo.PermanentAddress.CountryId;
                $scope.PatientAddressInfo.PostalAddress.CountyCodeObj = $scope.PatientAddressInfo.PermanentAddress.CountyCodeObj;

            } else {
                $scope.clearPostalAddress();
            }
        }
        $scope.clearPostalAddress = function () {
            $scope.PatientAddressInfo.PostalAddress.AddressLine1 = "";
            $scope.PatientAddressInfo.PostalAddress.AddressLine2 = "";
            $scope.PatientAddressInfo.PostalAddress.ZipCode = "";
            $scope.PatientAddressInfo.PostalAddress.CountyName = "";
            $scope.PatientAddressInfo.PostalAddress.CountyId = 0;
            $scope.PatientAddressInfo.PostalAddress.CityName = "";
            $scope.PatientAddressInfo.PostalAddress.CityId = 0;
            $scope.PatientAddressInfo.PostalAddress.StateName = "";
            $scope.PatientAddressInfo.PostalAddress.StateId = 0;
            $scope.PatientAddressInfo.PostalAddress.CountryName = "";
            $scope.PatientAddressInfo.PostalAddress.CountryId = 0;
            $scope.PatientAddressInfo.PostalAddress.CountyCodeObj = "";
            $scope.PatientAddressInfo.IsCheckCopy = false;
        }

        $scope.ChangeZipCode1 = function (val) {
            val = val || "";
            $scope.countyCodesPostalArray = [];
            if (val.length >= 5) {

                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {

                        $scope.pincodesarray = resp.data.rows || [];
                        $scope.pincodesarraycount = resp.data.rows.length;
                        if ($scope.pincodesarray.length !== 0) {
                            $scope.PatientAddressInfo.PostalAddress.CityId = $scope.pincodesarray[0].CityId;
                            $scope.PatientAddressInfo.PostalAddress.CityName = $scope.pincodesarray[0].CityName;
                            $scope.PatientAddressInfo.PostalAddress.StateName = $scope.pincodesarray[0].StateName;
                            $scope.PatientAddressInfo.PostalAddress.StateId = $scope.pincodesarray[0].StateId;
                            $scope.PatientAddressInfo.PostalAddress.CountryName = $scope.pincodesarray[0].CountryName;
                            $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.pincodesarray[0].CountryId;

                            $scope.searchCountyByZipCode1(val);
                        }
                    }
                });

            }
            else {
                $scope.PatientAddressInfo.PostalAddress.CityId = 0;
                $scope.PatientAddressInfo.PostalAddress.CityName = "";
                $scope.PatientAddressInfo.PostalAddress.StateName = "";
                $scope.PatientAddressInfo.PostalAddress.StateId = 0;
                $scope.PatientAddressInfo.PostalAddress.CountryName = "";
                $scope.PatientAddressInfo.PostalAddress.CountryId = 0;
                $scope.PatientAddressInfo.PostalAddress.CountyName = 0;
                $scope.PatientAddressInfo.PostalAddress.CountyId = "";
                $scope.PatientAddressInfo.PostalAddress.CountyCodeObj = "";
            }
        }
        $scope.searchCountyByZipCode1 = function (zipcode) {
            eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.countyCodesPostalArray = resp.data.rows || [];
                }
            });
        };
        $scope.onCityChange1 = function (item) {
            $scope.PatientAddressInfo.PostalAddress.CityName = item.CityName || "";
            $scope.PatientAddressInfo.PostalAddress.CityId = item.CityId;
            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.patientList = resp.data;

                    $scope.PatientAddressInfo.PostalAddress.StateName = $scope.patientList[0].StateName;
                    $scope.PatientAddressInfo.PostalAddress.StateId = $scope.patientList[0].StateId;
                    $scope.PatientAddressInfo.PostalAddress.CountryName = $scope.patientList[0].CountryName;
                    $scope.PatientAddressInfo.PostalAddress.CountryId = $scope.patientList[0].CountryId;

                }
            });
        };

        // family - functions
        $scope.AddOneMoreFamilyMember = function (fitem) {

            if (fitem.FirstName == "" && (fitem.RelationId == "" || fitem.RelationId == 0) &&
                (fitem.MobileNumber == "" || fitem.MobileNumber == 0 || fitem.MobileNumber == undefined)) {
                alertify.error("Enter Above Family Member Details");
                return false;
            }
            if (fitem.FirstName === "" || fitem.FirstName === null || fitem.FirstName === undefined) {
                alertify.error("Please Enter patient Name");
                return false;
            }
            if (fitem.FirstName.length < 3) {
                alertify.error("Please Enter patient Name");
                return false;
            }
            if (fitem.RelationId === "" || fitem.RelationId === null || fitem.RelationId === undefined || fitem.RelationId === 0) {
                alertify.error("Please Enter patient Relation");
                return false;
            }
            if (fitem.MobileNumber === "" || fitem.MobileNumber === null || fitem.MobileNumber === undefined || fitem.MobileNumber === 0) {
                alertify.error("Please Enter MobileNumber");
                return false;
            }
            var FMobileNumber = angular.copy(fitem.MobileNumber) || "";
            FMobileNumber = FMobileNumber.toString();
            if (FMobileNumber.length !== 10) {
                alertify.error("Please Enter MobileNumber");
                return false;
            }
            if (fitem.DOB === "" || fitem.DOB === null) {
                alertify.error("Please Enter DOB");
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
                "AreaCode": $scope.AreaCodeArrayList[0].CodeName,
                "MobileNumber": "",
                "ParentPatientId": 0,
                "RelationObj": "",
                "Age": "",
                "DOB": "",
                "CurrentAge": "",
                "ageinYears": "",
                "ageinMonths": "",
                "ageinDays": ""
            }
            $scope.FamilyInfo.FamilyArray.push(obj);
        }
        $scope.changeRelationship = function (RelationId, Obj) {
            //if (item != null) {
            //    Obj.RelationId = item.RelationId;;
            //    Obj.Relation = item.RelationName;
            //} else {
            //    Obj.RelationId = 0;
            //    Obj.Relation = "";
            //    Obj.RelationObj = "";
            //}
            if (item != null) {
                var filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": RelationId }, true) || [];
                if (filterStatus.length > 0) {
                    Obj.Relation = filterStatus[0].RelationName;
                    Obj.RelationObj = filterStatus[0];
                }
            }
        }
        $scope.RemoveFamilyMember = function (item) {
            if (item.FamilyId === 0) {
                var index = $scope.FamilyInfo.FamilyArray.indexOf(item);
                $scope.FamilyInfo.FamilyArray.splice(index, 1);
            } else {
                item.DeleteInd = "Y";
            }
        }
        $scope.changeTitleId = function (Titleid, obj) {
            if (Titleid != null) {
                var filtertitle = $filter("filter")($scope.TitlesList, { "Id": Titleid }, true) || [];
                if (filtertitle.length > 0) {
                    obj.Title = filtertitle[0].Name;
                    obj.TitleId = filtertitle[0].Id;
                }
            }
        }

        // Demographics
        $scope.ChangeLanguageStatus = function (objitem) {
            if (objitem != null) {
                objitem.PreferedLanguageName = objitem.PreferedLanguageObj.Value;
                objitem.PreferedLanguageId = objitem.PreferedLanguageObj.Languageid;
            } else {
                objitem.PreferedLanguageId = 0;
                objitem.PreferedLanguageName = "";
                objitem.PreferedLanguageObj = "";
            }
        }
        $scope.ChangeExpressionStatus = function (objitem) {
            if (objitem != null) {
                objitem.Expression = objitem.ExpressionObj.Value;
                objitem.ExpressionId = objitem.ExpressionObj.DropdownId;
            } else {
                objitem.ExpressionId = 0;
                objitem.Expression = "";
                objitem.ExpressionObj = "";
            }
        }
        $scope.ChangeProficiencyStatus = function (objitem) {
            if (objitem != null) {
                objitem.Proficiency = objitem.ProficiencyObj.Value;
                objitem.ProficiencyId = objitem.ProficiencyObj.DropdownId;
            } else {
                objitem.ProficiencyId = 0;
                objitem.Proficiency = "";
                objitem.ProficiencyObj = "";
            }
        }
        $scope.ChangePrefixStatus = function (objitem) {
            if (objitem != null) {
                objitem.PatientPrefixListName = objitem.PatientPrefixObj.Value;
                objitem.PatientPrefixListId = objitem.PatientPrefixObj.DropdownId;
            } else {
                objitem.PatientPrefixListId = 0;
                objitem.PatientPrefixListName = "";
                objitem.PatientPrefixObj = "";
            }
        }
        $scope.ChangeSuffixStatus = function (objitem) {
            if (objitem != null) {
                objitem.PatientSuffixName = objitem.PatinetSuffixObj.Value;
                objitem.PatinetSuffixId = objitem.PatinetSuffixObj.SuffixId;
            } else {
                objitem.PatinetSuffixId = 0;
                objitem.PatientSuffixName = "";
                objitem.PatinetSuffixObj = "";
            }
        }
        $scope.ChangeSexualOrientationStatus = function (objitem) {
            if (objitem != null) {
                objitem.SexualOrientation = objitem.SexualOrientationObj.Value;
                objitem.SexualOrientationId = objitem.SexualOrientationObj.DropdownId;
            } else {
                objitem.SexualOrientationId = 0;
                objitem.SexualOrientation = "";
                objitem.SexualOrientationObj = "";
            }
        }
        $scope.ChangeGenderIdentityStatus = function (objitem) {
            if (objitem != null) {
                objitem.GenderIdentityStatus = objitem.GenderIdentityStatusObj.Value;
                objitem.GenderIdentityStatusId = objitem.GenderIdentityStatusObj.DropdownId;
            } else {
                objitem.GenderIdentityStatusId = 0;
                objitem.GenderIdentityStatus = "";
                objitem.GenderIdentityStatusObj = "";
            }
        }

        // Insurance Changes
        $scope.ChangeCoverageStatus = function (item) {
            if (item.CoverageObj == null) {
                item.CoverageId = 0;
                item.CoverageName = "";
                return false;
            }
            item.CoverageObj = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": item.CoverageId }, true)[0];

            item.CoverageObj = item.CoverageObj || "";
            if (item.CoverageObj != "") {
                item.CoverageId = item.CoverageObj.CoverageId;
                item.CoverageName = item.CoverageObj.CoverageName;
            }
        }
        $scope.payorPlansListArray = [];
        $scope.ChangeInsurancePayor = function (obj, mainitem, GetMode) {
            mainitem.payorPlansListArray = [];
            mainitem.PayorId = obj.PayorId;
            var param = {
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "GetAllIndicator": 0,
                "PayorId": obj.PayorId
            }
            eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {
                mainitem.payorPlansListArray = [];
                if (resp.data.Status === "Success") {
                    mainitem.payorPlansListArray = resp.data.rows || [];

                    if (GetMode === "GetPlan") {
                        if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != null) {
                            $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanObj = $filter("filter")(mainitem.payorPlansListArray, { "PlanId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId })[0];
                        }
                    }
                }
            }, function (error) {
                console.log(error);
            });

        }
        $scope.ChangePayorPlan = function (mainitem) {
            if (mainitem.PlanObj == null || mainitem.PlanObj == "") {
                mainitem.PlanId = 0;
                return false;
            }
            mainitem.PlanId = mainitem.PlanObj.PlanId;
            mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
        }
        $scope.ChangeInsuranceRelationShipItem = function (item) {
            //item.InsuranceRelationShipObj = item.InsuranceRelationShipObj || "";
            //if (item.InsuranceRelationShipObj != "") {
            //    item.RelationShipId = item.InsuranceRelationShipObj.RelationId || 1;
            //}

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
         var ScanDate = $scope.getDate();
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
            var ScanDate = $scope.getDate();
            insItem.ScanDate = moment(ScanDate).format('MM-DD-YYYY');
        };
        $scope.removeInsImage = function (type, insItem) {
           // $scope.insItem = angular.copy(insItem);
            if (type === 'front') {
                $scope.frontItemUpload = false;
                $scope.Ffile = null;
                $scope.frontItemS3Url = false;

                if (insItem.PatientDocumentDetails.length > 0) {
                    angular.forEach(insItem.PatientDocumentDetails, function (citem) {
                        if (!citem.IsBackSidefile) {
                            citem.S3URL = citem.S3URL || "";
                            if (citem.S3URL !== "") {
                                citem.DeleteInd = "Y";
                            } else {
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

                if (insItem.PatientDocumentDetails.length > 0) {
                    angular.forEach(insItem.PatientDocumentDetails, function (citem) {
                        if (citem.IsBackSidefile) {
                            citem.S3URL = citem.S3URL || "";
                            if (citem.S3URL !== "") {
                                citem.DeleteInd = "Y";
                            } else {
                                citem.DeleteInd = "Y";
                            }
                        }

                    })
                }
            }
        }
        // Designated chnages
        $scope.file3 = "";
        $scope.selectPCPimagelist = function ($files) {

            $scope.PatientDesignatedInfo.PatientPCPDocuments = [];
            $scope.agreementFiles = [];

            if ($files.length > 0) {
                $scope.agreementFiles = $files;
                if ($scope.agreementFiles != null) {
                    if ($scope.agreementFiles.length > 0) {
                        $scope.PatientDesignatedInfo.PatientPCPDocuments = [];
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
                                "DocumentTypeId": $scope.PatientDesignatedInfo.DocumentTypeId || 0,
                                "DeleteInd": "N",
                                "DocumentId": $scope.PatientDesignatedInfo.DocumentId || 0,
                                "DocumentExt": kitem.type,
                                "PatientPCPDocumentId": 0,
                                "DisplayName": name
                            };
                            if (kitem.type != 'application/pdf') {
                                $scope.PatientDesignatedInfo.PatientPCPDocuments.push(obj);
                            }
                        });
                    }
                }
            }
        };
        $scope.ReferalPCPDoctorsList = [];
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
        $scope.ChangePCPUser = function (doctorobj) {
            if (doctorobj != null) {
                $scope.PatientDesignatedInfo.PCP = doctorobj.PcpReferralId;
            } else {
                $scope.PatientDesignatedInfo.PCPobj = "";
            }
        };
        $scope.getDoctorsbySubSpecializations = function (branchId, type) {

            console.log(branchId);
            var branchesList = [];
            $scope.BranchDoctorsList = [];
            $scope.allUserList = [];


            if (type === "") {
                $scope.PatientDesignatedInfo.PCP = 0;
                $scope.PatientDesignatedInfo.Provider1 = 0;
                $scope.PatientDesignatedInfo.Provider2 = 0;
                $scope.PatientDesignatedInfo.Corporation = 0;
                $scope.PatientDesignatedInfo.Office = 0;
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


                    //if (type === "Edit") {

                    //    $scope.patientinfo.PCP = parseFloat($scope.patientinfo.PCP) || 0;
                    //    $scope.patientinfo.Provider1 = parseFloat($scope.patientinfo.Provider1) || 0;
                    //    $scope.patientinfo.Provider2 = parseFloat($scope.patientinfo.Provider2) || 0;
                    //    $scope.patientinfo.Corporation = parseFloat($scope.patientinfo.Corporation) || 0;
                    //    $scope.patientinfo.Office = parseFloat($scope.patientinfo.Office) || 0;


                    //    if ($scope.patientinfo.PCP !== 0) {
                    //        var DoctorObj = $filter("filter")($scope.ReferalPCPDoctorsList, function (item, index) { return item.PcpReferralId == $scope.patientinfo.PCP })[0];
                    //        $scope.UserObject.DoctorObj = DoctorObj;
                    //    }

                    //    if ($scope.patientinfo.Provider1 !== 0) {
                    //        var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == $scope.patientinfo.Provider1 })[0];
                    //        $scope.UserObject.DoctorObj2 = DoctorObj;
                    //    }

                    //    if ($scope.patientinfo.Provider2 !== 0) {
                    //        var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == $scope.patientinfo.Provider2 })[0];
                    //        $scope.UserObject.DoctorObj3 = DoctorObj;
                    //    }

                    //    if ($scope.patientinfo.Corporation !== 0) {
                    //        var HospObj = $filter("filter")($scope.AllUserBranchesList, function (item, index) { return item.ClinicId == $scope.patientinfo.Corporation })[0];
                    //        $scope.UserObject.ParentHospitalObj = HospObj;
                    //    }

                    //    if ($scope.patientinfo.Office !== 0) {
                    //        var HospObj = $filter("filter")($scope.AllUserBranchesList, function (item, index) { return item.ClinicId == $scope.patientinfo.Office })[0];
                    //        $scope.UserObject.HospitalObj = HospObj;
                    //    }
                    //}

                } else {
                    alertify.error("No Doctors Found in Selected Hospital");

                }


            }

            function onGetUsersFailure(data) {
            }
        }
        $scope.allSubSpecializationsArray = [];
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
                var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];

                $scope.AllUserBranchesList = BrachesList;
                $scope.BranchesListArray = BrachesList;
                $scope.selectedBranch = $scope.BranchesListArray[0];
                var RoleID = userLoginDetails.RoleID;


                $scope.clinicDoctorList = [];

                $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                    return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                });

                $scope.selectedBranch = $scope.defaultbranch[0];
                // $scope.UserObject.HospitalObj = $scope.defaultbranch[0];

                if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                    angular.forEach($scope.BranchesListArray, function (item, index) {
                        if (item.ClinicName !== "All Locations") {
                            if (item.ExtDetails.HospitalID === $scope.hospid) {
                                $scope.selectedBranch = item;
                                // $scope.UserObject.HospitalObj = item;
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
                    }
                }
            }

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
        $scope.AllUserBranchesList = [];
        InitializeNewBranches();
        $scope.ChangeProvider1User = function (Obj) {
            if (Obj != null) {
                $scope.PatientDesignatedInfo.Provider1 = Obj.DoctorID;
            } else {
                Obj = "";
            }
        };
        $scope.ChangeProvider2User = function (Obj) {
            if (Obj != null) {
                $scope.PatientDesignatedInfo.Provider2 = Obj.DoctorID;
            } else {
                Obj = "";
            }
        };
        $scope.ChangeCorporationHospital = function (item) {
            if (item != null) {
                $scope.PatientDesignatedInfo.Corporation = item.ClinicId;
            } else {
                item = "";
            }
        };
        $scope.ChangeOfficeHospital = function (item) {
            if (item != null) {
                $scope.PatientDesignatedInfo.Office = item.ClinicId;
            } else {
                item = "";
            }
        };
        $scope.IsbindindData = false;
        function GetrefferalSource(Searchtext, type) {
            var hospid = undefined;
            var getParams = {
                "DoctorID": doctorinfo.doctorid,
                "USRType": "DOCTOR",
                "PageSize": 1000,
                "SearchText": Searchtext,
                "PageNumber": 1,
                "USRId": doctorinfo.doctorid,
                "MasterReferralSourceId": $scope.PatientDesignatedInfo.MasterReferralSourceObj.MasterReferralSourceId,
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

                    $scope.PatientDesignatedInfo.ReferralSourceObj = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedInfo.ReferralSourceId }, true)[0];

                    if ($scope.PatientDesignatedInfo.ReferralSourceObj !== undefined) {
                        $scope.PatientDesignatedInfo.ReferralSourceId = $scope.PatientDesignatedInfo.ReferralSourceObj.ReferralID;
                        $scope.PatientDesignatedInfo.ReferralSourceName = $scope.PatientDesignatedInfo.ReferralSourceObj.ReferralTitle;
                        $scope.referralTitle = "";
                    }

                    $scope.IsbindindData = false;
                }
                if (type === "Get") {
                    $scope.PatientDesignatedInfo.ReferralSourceObj = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedInfo.ReferralSourceId }, true)[0];

                    if ($scope.PatientDesignatedInfo.ReferralSourceObj !== undefined) {
                        $scope.PatientDesignatedInfo.ReferralSourceName = $scope.PatientDesignatedInfo.ReferralSourceObj.ReferralTitle;
                    }
                }

            }
            function onreadFailed(data) {
            }
        }
        $scope.ChangeRefferalSource = function () {
            $scope.PatientDesignatedInfo.ReferralSourceId = 0;
            $scope.PatientDesignatedInfo.ReferralSourceObj = "";
            $scope.PatientDesignatedInfo.ReferralSourceName = "";
            if ($scope.PatientDesignatedInfo.MasterReferralSourceObj != "") {

                $scope.PatientDesignatedInfo.MasterReferralSourceId = $scope.PatientDesignatedInfo.MasterReferralSourceObj.MasterReferralSourceId;
                $scope.PatientDesignatedInfo.MasterReferralSourceName = $scope.PatientDesignatedInfo.MasterReferralSourceObj.MasterReferralSourceName;

                if ($scope.PatientDesignatedInfo.MasterReferralSourceObj.ShowType == 'D') {
                    GetrefferalSource("");
                }
            }
        };
        $scope.changeReferral = function (selectedReferral) {
            console.log(selectedReferral);

            $scope.ShowRefferallist = false;
            if (selectedReferral === null) {
                $scope.PatientDesignatedInfo.ReferralSourceId = 0;
                $scope.PatientDesignatedInfo.ReferralSourceObj = "";
                $scope.PatientDesignatedInfo.ReferralSourceName = "";
            } else {
                $scope.PatientDesignatedInfo.ReferralSourceId = selectedReferral.ReferralID;
                $scope.PatientDesignatedInfo.ReferralSourceName = selectedReferral.ReferralTitle;
                $scope.PatientDesignatedInfo.ReferralMobileNo = selectedReferral.ReferralMobileNo;
                $scope.PatientDesignatedInfo.ReferralContactNo = selectedReferral.ReferralContactNo;
                $scope.PatientDesignatedInfo.ReferralSourceObj = selectedReferral;
            }

        };










        // register
        $scope.Finalsubmit = "";
        $scope.PatientSave = function (type) {

            if ($scope.PatientDetailsInfo.FirstName === null || $scope.PatientDetailsInfo.FirstName === "" || $scope.PatientDetailsInfo.FirstName === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient First Name");
                return false;
            }
            if ($scope.PatientDetailsInfo.FirstName.length < 3) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient First Name");
                return false;
            }
            if ($scope.PatientDetailsInfo.DOB === null || $scope.PatientDetailsInfo.DOB === "" || $scope.PatientDetailsInfo.DOB === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient DOB");
                return false;
            }
            if ($scope.PatientDetailsInfo.Gender === null || $scope.PatientDetailsInfo.Gender === "" || $scope.PatientDetailsInfo.Gender === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient Gender");
                return false;
            }
            if ($scope.ageinYears === null || $scope.ageinYears === "" || $scope.ageinYears === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Select Patient Age");
                return false;
            }
            if ($scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber === null || $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber === "" || $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber === undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }
            var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber) || "";
            MobileNumber = MobileNumber.toString();
            if (MobileNumber.length !== 10) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }
            var ContactNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber);
            ContactNumber = ContactNumber.toString();
            if (ContactNumber.length !== 0 && ContactNumber.length < 10 ) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }
            //PatientDetailsInfo.SocialSecurityNo
            var SSNno = angular.copy($scope.PatientDetailsInfo.SocialSecurityNo) || "";
            SSNno = SSNno.toString();
            if (SSNno != "" && SSNno.length !== "" && SSNno.length < 9) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid SSN Number");
                return false;
            }
            //EmailID
            if ($scope.PatientDetailsInfo.ContactInfo.EmailID == undefined) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid EmailID");
                return false;
            }

            $scope.Finalsubmit = type || "";
            var param = {
                "UserId": $scope.PatientDetailsInfo.UserId,
                "HospitalId": $scope.PatientDetailsInfo.HospitalId,
                "PatientId": $scope.PatientDetailsInfo.PatientID || 0,
                "TitleId": $scope.PatientDetailsInfo.TitleId,
                "FirstName": $scope.PatientDetailsInfo.FirstName,
                "LastName": $scope.PatientDetailsInfo.LastName,
                "DOB": $filter("date")(new Date($scope.PatientDetailsInfo.DOB), "yyyy-MM-dd") || "",
                "Age": $scope.ageinYears,
                "SSN": $scope.PatientDetailsInfo.SocialSecurityNo,
                "Gender": $scope.PatientDetailsInfo.Gender,
                "PatientTagId": ($scope.PatientDetailsInfo.PatientTagId == 0 || $scope.PatientDetailsInfo.PatientTagId == null) ? null : $scope.PatientDetailsInfo.PatientTagId,
                "MaritalStatusId": $scope.PatientDetailsInfo.MaritalStatusID,
                "BloodGroupId": $scope.PatientDetailsInfo.BloodGroupId !== 0 ? $scope.PatientDetailsInfo.BloodGroupId : null,
                "CountryCode": $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode,
                "MobileNumber": $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber,
                "AreaCode": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode,
                "ContactNumber": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber,
                "LeadSourceInd": "N",
                "PatientS3Url": $scope.PatientDetailsInfo.S3URL != "" ? $scope.PatientDetailsInfo.S3URL : "" ,
                "EmailID": $scope.PatientDetailsInfo.ContactInfo.EmailID,
                "FullName": $scope.PatientDetailsInfo.FirstName + $scope.PatientDetailsInfo.LastName || ""
            }
            var picdetails = {
                "patientProfilePicDetails": ""
            };
            if ($scope.PatientDetailsInfo.PatientProfilePicDetails != undefined && $scope.PatientDetailsInfo.PatientProfilePicDetails.length > 0) {
                picdetails.patientProfilePicDetails = $scope.PatientDetailsInfo.PatientProfilePicDetails;
            }

            eHnotePatientDataService.USRegisterPatient(param, picdetails, OnAddPatientSuccess, OnAddPatientError);
        }
        //Address
        function OnAddPatientSuccess(resp) {
            console.log(resp);
            if (resp.status === "success") {
                var response = resp;
                $scope.patientid = resp.PatientId;
                $scope.PatientDetailsInfo.PatientID = $scope.patientid;
                $scope.PatientDetailSummary = GetPatientDetailsInfo();

                $scope.PatientDetailSummary.PatientID = response.PatientId;
                if (response.TitleId != null && response.TitleId != '') {
                    var filtertitle = $filter("filter")($scope.TitlesList, { "Id": response.TitleId }, true) || [];
                    if (filtertitle.length > 0) {
                        $scope.PatientDetailSummary.Title = filtertitle[0].Name;
                        $scope.PatientDetailSummary.TitleId = filtertitle[0].Id;
                    }
                }

                $scope.PatientDetailSummary.FirstName = response.FirstName;
                $scope.PatientDetailSummary.LastName = response.LastName;
                if (response.DOB != "") {
                    $scope.PatientDetailSummary.DOB = $filter('date')(new Date(response.DOB), "MM-dd-yyyy");
                }
                $scope.PatientDetailSummary.SocialSecurityNo = response.SSN || "";
                $scope.PatientDetailSummary.Gender = response.Gender || "";

                if (response.MaritalStatus != "") {
                    var MaritalStatusId = parseInt(response.MaritalStatus) || 0;
                    $scope.PatientDetailSummary.MaritalStatusID = MaritalStatusId;
                    var filterStatus = $filter("filter")($scope.MartialStatusList, { "Id": MaritalStatusId }, true) || [];
                    if (filterStatus.length > 0) {
                        $scope.PatientDetailSummary.MaritalStatusName = filterStatus[0].MaritalStatus;
                    }
                }
                $scope.PatientDetailSummary.ContactInfo.PatientHomeCode = response.CountryCode != '' ? ('+' + response.CountryCode) : '';
                $scope.PatientDetailSummary.ContactInfo.PatientHomeNumber = response.MobileNumber || '';
                $scope.PatientDetailSummary.ContactInfo.PatientOfficeCode = response.AreaCode != '' ? ('+' + response.AreaCode) : '';
                $scope.PatientDetailSummary.ContactInfo.PatientOfficeNumber = response.ContactNumber || "";
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

                $scope.PatientDetailSummary.Age = response.Age;
                $scope.PatientDetailSummary.PatientDisplayID = response.PatientDisplayId;
                $scope.PatientDetailSummary.FullName = response.FullName;
                $scope.PatientDetailSummary.S3URL = response.S3URL;

                if ($scope.Finalsubmit === "Final") {
                    $scope.Registeraddpopup = true;
                    $scope.cacheValuesBookAppointment();
                    return false;
                }
            }
        }
        function OnAddPatientError(err) {
            console.log(err);
            alertify.error(err);
        }

        $scope.PatientAddressSave = function (type) {
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

            if ($scope.PatientAddressInfo.PermanentAddress.AddressId == 0 && $scope.PatientAddressInfo.PostalAddress.AddressId == 0 &&
                ($scope.PatientAddressInfo.PermanentAddress.AddressLine1 == "") && ($scope.PatientAddressInfo.PostalAddress.AddressLine1 == "") &&
                ($scope.PatientAddressInfo.PermanentAddress.AddressLine2 == "") && ($scope.PatientAddressInfo.PostalAddress.AddressLine2 == "") &&
                ($scope.PatientAddressInfo.PermanentAddress.ZipCode == null || $scope.PatientAddressInfo.PermanentAddress.ZipCode === 0 || $scope.PatientAddressInfo.PermanentAddress.ZipCode == "" || $scope.PatientAddressInfo.PermanentAddress.ZipCode == undefined) &&
                ($scope.PatientAddressInfo.PostalAddress.ZipCode == null || $scope.PatientAddressInfo.PostalAddress.ZipCode === 0 || $scope.PatientAddressInfo.PostalAddress.ZipCode == "" || $scope.PatientAddressInfo.PostalAddress.ZipCode == undefined) &&
                ($scope.PatientAddressInfo.PermanentAddress.CountyId == null) && ($scope.PatientAddressInfo.PostalAddress.CountyId == null) &&
                ($scope.PatientAddressInfo.PermanentAddress.CityId == null) && ($scope.PatientAddressInfo.PostalAddress.CityId == null) &&
                ($scope.PatientAddressInfo.PermanentAddress.StateId == null) && ($scope.PatientAddressInfo.PostalAddress.StateId == null) &&
                ($scope.PatientAddressInfo.PermanentAddress.CountryId == null) && ($scope.PatientAddressInfo.PostalAddress.CountryId == null)) {
                if (type === "Final") {
                    $scope.Registeraddpopup = true;
                    $scope.cacheValuesBookAppointment();
                }
                return false;
            }
            var TempAddress = {
                "PatientId": $scope.patientid,
                "PatientDisplayID": $scope.PatientDisplayID,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AddressDetailsInfo": angular.copy($scope.PatientAddressInfo)
            }

            eHnotePatientDataService.AppUpdatePatientAddressDetails(TempAddress).then(function (resp) {
                console.log(resp);
                if (resp.data.Status == "Success") {
                    var PermanentResponseList = resp.data.PermanentAddress;
                    var PostalResponseList = resp.data.PostalAddress;
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

                    $scope.PatientAddressInfo.PermanentAddress.AddressId = PermanentResponseList.AddressId;
                    $scope.PatientAddressInfo.PostalAddress.AddressId = PostalResponseList.AddressId;

                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                        return false;
                    }
                }

            }, function (error) {
                console.log(error);
                alertify.error(error);
            });
        }

        // FamilyInfo
        $scope.PatientFamilySave = function (type) {

            if ($scope.FamilyInfo.FamilyArray.length === 0) {
                $scope.ValidateIndictor = true;
                return false;
            }
            if ($scope.FamilyInfo.FamilyArray.length === 1) {
                if (($scope.FamilyInfo.FamilyArray[0].FirstName == "" || $scope.FamilyInfo.FamilyArray[0].FirstName == undefined) && ($scope.FamilyInfo.FamilyArray[0].MobileNumber === "" || $scope.FamilyInfo.FamilyArray[0].MobileNumber === 0 || $scope.FamilyInfo.FamilyArray[0].MobileNumber === undefined) &&
                    ($scope.FamilyInfo.FamilyArray[0].RelationId == "" || $scope.FamilyInfo.FamilyArray[0].RelationId == 0 || $scope.FamilyInfo.FamilyArray[0].RelationId == undefined)) {
                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                    }
                    return false;
                }
            }
            var familyarryEmptyString = false;
            if ($scope.FamilyInfo.FamilyArray.length > 0) {
                angular.forEach($scope.FamilyInfo.FamilyArray, function (item) {
                    if (item.FirstName === "" || item.FirstName === null || item.FirstName === undefined) {
                        familyarryEmptyString = true;
                        alertify.error("Please Enter Patient Name");
                        return false;
                    }
                    if (item.FirstName.length < 3) {
                        familyarryEmptyString = true;
                        alertify.error("Please Select Patient Name");
                        return false;
                    }
                    if (item.RelationId === "" || item.RelationId === null || item.RelationId === undefined || item.RelationId === 0) {
                        familyarryEmptyString = true;
                        alertify.error("Please Select Patient Relation");
                        return false;
                    }
                    if (item.MobileNumber === "" || item.MobileNumber === null || item.MobileNumber === undefined || item.MobileNumber === 0) {
                        familyarryEmptyString = true;
                        alertify.error("Please Enter Valid MobileNumber");
                        return false;
                    }
                    var FMobileNumber = angular.copy(item.MobileNumber) || "";
                    FMobileNumber = FMobileNumber.toString();
                    if (FMobileNumber.length !== 10) {
                        familyarryEmptyString = true;
                        alertify.error("Please Enter Valid MobileNumber");
                        return false;
                    }

                    if (item.DOB === "" || item.DOB === null) {
                        familyarryEmptyString = true;
                        alertify.error("Please Enter DOB");
                        return false;
                    } else {
                        item.DOB = $filter("dateFormatter")(item.DOB , "-");
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
                "FamilyInfo": angular.copy($scope.FamilyInfo.FamilyArray)
            }
            angular.forEach(param.FamilyInfo, function (item) {
                item.ParentPatientId = $scope.patientid;
            });

            eHnotePatientDataService.AddUpdatePatientFamilyDetails(param).then(function (resp) {
                console.log(resp);
                $scope.FamilySummary = [];
                if (resp.data.status == "Success") {
                    var Familylist = angular.copy(resp.data.FamilyInfo);
                    angular.forEach(Familylist, function (fitem) {
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
                            "AreaCode": fitem.AreaCode,
                            "MobileNumber": fitem.ContactNo,
                            "ParentPatientId": fitem.ParentPatientId,
                            "RelationObj": "",
                            "Age": fitem.Age,
                            "DOB": "",
                            "CurrentAge": "",
                            "ageinYears": "",
                            "ageinMonths": "",
                            "ageinDays": ""
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

                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                        return false;
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error(err);
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

            $scope.obj.IsEthnicitySelected = $scope.obj.IsEthnicitySelected || [];
            $scope.obj.IsRaceSelected = $scope.obj.IsRaceSelected || [];
            $scope.DemographicInfo.PreferedLanguageObj = $scope.DemographicInfo.PreferedLanguageObj || [];

            if ($scope.obj.IsEthnicitySelected.length == 0 && $scope.obj.IsRaceSelected.length == 0 &&
                $scope.DemographicInfo.PreferedLanguageObj.length == 0 && ($scope.DemographicInfo.MultipleBirth == "" || $scope.DemographicInfo.MultipleBirth == 0 ) &&
                $scope.DemographicInfo.MothersMiddleName == "" && ($scope.DemographicInfo.PatientPrefixListId == null || $scope.DemographicInfo.PatientPrefixListId == 0)&&
                ($scope.DemographicInfo.PatinetSuffixId == null || $scope.DemographicInfo.PatinetSuffixId == 0) && $scope.DemographicInfo.ExpressionId == null &&
                $scope.DemographicInfo.SexualOrientationId == null && $scope.DemographicInfo.ProficiencyId == null &&
                $scope.DemographicInfo.GenderIdentityStatusId == null) {
                if (type === "Final") {
                    $scope.Registeraddpopup = true;
                    $scope.cacheValuesBookAppointment();
                }
                return false;
            }
            var tempObj = $scope.DemographicInfo;
            tempObj.PatientId = $scope.patientid;
            //tempObj.Ethnicity = [];
            //tempObj.Race = [];
        
            if (tempObj.PreferedLanguageObj != undefined && tempObj.PreferedLanguageObj != "" && tempObj.PreferedLanguageObj != null) {
                var filter1 = [];
                if (tempObj.PreferedLanguage.length > 0) {
                    filter1 = $filter("filter")(tempObj.PreferedLanguage, { "LanguageId": tempObj.PreferedLanguageObj.Languageid })[0] || [];
                }
                if (filter1.length === 0) {
                    var obj = {
                        "Id": 0,
                        "LanguageName": tempObj.PreferedLanguageObj.Value,
                        "LanguageId": tempObj.PreferedLanguageObj.Languageid, //tempObj.PreferedLanguageObj.DropdownId,
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
            }
          /*  if ($scope.obj.IsEthnicitySelected != "" && $scope.obj.IsEthnicitySelected != null) {
                var obj1 = {
                    "Id": 0,
                    "EthnicityName": "",
                    "EthnicityId": "",
                    "IsSelected": "Y",
                    "DeleteInd": "N"
                };
                
                angular.forEach($scope.obj.IsEthnicitySelected, function (mitem) {
                //    angular.forEach(tempObj.Ethnicity, function (nitem) {
                //        if (mitem.DropdownId === nitem.EthnicityId) {

                //        }
                //    });

                
                    obj1 = {
                        "Id": 0,
                        "EthnicityName": mitem.Value,
                        "EthnicityId": mitem.DropdownId,
                        "IsSelected": "Y",
                        "DeleteInd": "N"
                    }
                    tempObj.Ethnicity.push(obj1);
                });
                //var obj1 = {
                //    "Id": 0,
                //    "EthnicityName": $scope.obj.IsEthnicitySelected.Value,
                //    "EthnicityId": $scope.obj.IsEthnicitySelected.DropdownId,
                //    "IsSelected": "Y",
                //    "DeleteInd": "N"
                //}
                //tempObj.Ethnicity.push(obj1);
            }*/
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

            //if ($scope.obj.IsRaceSelected != "" && $scope.obj.IsRaceSelected != null) {
            //    var obj2 = {
            //        "Id": 0,
            //        "RaceName": "",
            //        "RaceId": "",
            //        "IsSelected": "Y",
            //        "DeleteInd": "N"
            //    }
            //    angular.forEach($scope.obj.IsRaceSelected, function (mitem) {
            //        obj2 = {
            //            "Id": 0,
            //            "RaceName": mitem.Value,
            //            "RaceId": mitem.DropdownId,
            //            "IsSelected": "Y",
            //            "DeleteInd": "N"
            //        }
            //        tempObj.Race.push(obj2);
            //    });
            //    //var obj2 = {
            //    //    "Id": 0,
            //    //    "RaceName": $scope.obj.IsRaceSelected.Value,
            //    //    "RaceId": $scope.obj.IsRaceSelected.DropdownId,
            //    //    "IsSelected": "Y",
            //    //    "DeleteInd": "N"
            //    //}
            //    //tempObj.Race.push(obj2);
            //}
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
            eHnotePatientDataService.AddUpdatePatientDemographicsDetails(tempObj).then(function (resp) {
                console.log(resp);
                var DemographicsList = "";
                $scope.DemographicSummary = GetDemographicInfo();
                if (resp.data.status == "Success") {
                    DemographicsList = resp.data.DemographicsInfo[0];
                    $scope.DemographicSummary.Ethnicity = angular.copy(DemographicsList.Ethnicity);
                    $scope.DemographicSummary.Race = angular.copy(DemographicsList.Race);
                    $scope.DemographicSummary.PreferedLanguage = angular.copy(DemographicsList.PreferedLanguage);

                    $scope.DemographicSummary.ExpressionId = DemographicsList.ExpressionId || 0;
                    var filter1 = $filter("filter")($scope.PatientLanguageExpressionList, { "DropdownId": DemographicsList.ExpressionId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.Expression = filter1[0].Value || "";
                    }
                    $scope.DemographicSummary.ProficiencyId = DemographicsList.ProficiencyId || 0;
                    var filter1 = $filter("filter")($scope.PatientLanguageProficiencyList, { "DropdownId": DemographicsList.ProficiencyId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.DemographicSummary.Proficiency = filter1[0].Value || "";
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

                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                        return false;
                    }
                }

            }, function (err) {
                console.log(err);
                alertify.error(err);
            });
        }

        ////insurance Info
        $scope.PatientInsuranceDetailsSave = function (type, EditMode) {
            if ($scope.PatientInsuranceInfo.PatientInsuranceDetails.length > 0) {
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].CoverageId == 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId == 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId == 0) {
                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                    }
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].CoverageId === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].CoverageId === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].CoverageId === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].CoverageId === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Select Patient Coverage");
                    return false;
                }
                $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId = $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId || null;
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId === null ) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Select Patient Payor");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Select Patient Plan");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanTypeId === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanTypeId === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanTypeId === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanTypeId === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Select Patient PlanType");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyHolder === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyHolder === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyHolder === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyHolder === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Policy Holder Name");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].GroupId === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].GroupId === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].GroupId === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].GroupId === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter GroupId");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyId === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyId === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyId === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyId === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Policy ID");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].Coinsurance === null || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].Coinsurance === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].Coinsurance === undefined || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].Coinsurance === 0) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Patient Co Insurance");
                    return false;
                }

                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PolicyHolder == 'Others') {
                    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].InsuranceRelationShipObj === "") {
                        $scope.ValidateIndictor = true;
                        alertify.error("Please Select RelationShip");
                        return false;
                    }
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].VisitCopay === "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].VisitCopay == undefined) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Co-Pay");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].ExpiryDate == "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].ExpiryDate == null) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Expiry Date");
                    return false;
                }
                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].EffectiveDate == "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].EffectiveDate == null) {
                    $scope.ValidateIndictor = true;
                    alertify.error("Please Enter Effective Date");
                    return false;
                }
                //if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].ScanDate == "" || $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].ScanDate == null) {
                //    $scope.ValidateIndictor = true;
                //    alertify.error("Please Enter Scan Date");
                //    return false;
                //}


            }
            var TempInsuarance = $scope.PatientInsuranceInfo;
            TempInsuarance.PatientId = $scope.patientid;
            TempInsuarance.FullName = $scope.PatientFullName;
            angular.forEach(TempInsuarance.PatientInsuranceDetails, function (titem) {
                if (titem.PatientInsuranceDetailId === 0) {
                    titem.PatientDocumentDetails = [];
                }
                
                angular.forEach(titem.TempInsuranceImagesArray, function (item) {
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
                      //  titem.PatientDocumentDetails.push(object);
                        if (titem.PatientInsuranceDetailId === 0) {
                            titem.PatientDocumentDetails.push(object);
                        } else {
                            titem.PatientDocumentDetails.unshift(object);
                        }
                       
                    }

                });
                //angular.forEach(titem.PatientDocumentDetails, function (as) {
                //    as.DeleteInd = "Y";
                //});
                if (titem.ExpiryDate != "") {
                    titem.ExpiryDate = $filter("dateFormatter")(titem.ExpiryDate, "-");
                }
                if (titem.EffectiveDate != "") {
                    titem.EffectiveDate = $filter("dateFormatter")(titem.EffectiveDate, "-");
                }
                if (titem.ScanDate != "") {
                    titem.ScanDate = $filter("dateFormatter")(titem.ScanDate, "-");
                }
                if (titem.VerifiedDate != "") {
                    titem.VerifiedDate = $filter("dateFormatter")(titem.VerifiedDate, "-");
                }
                if (titem.RelationShipId!==1) {
                    if (titem.InsuredPersonDOB != "") {
                        titem.InsuredPersonDOB = $filter("dateFormatter")(titem.InsuredPersonDOB, "-");
                    }
                }
              
            });
        
console.log(JSON.stringify(TempInsuarance));

            eHnotePatientDataService.SavePatientInsuranceDetailsById(TempInsuarance, OnAddPatientSuccess, OnAddPatientError);
            function OnAddPatientSuccess(resp) {
                console.log(JSON.stringify(resp));
                $scope.PatientInsuranceSummary = [];
                if (resp.Status === "Success") {
                    $scope.PatientInsuranceInfo = GetInsuranceInfo();
                    if (resp.PatientInsuranceDetails.length > 0) {
                        $scope.PatientInsuranceSummary = angular.copy(resp.PatientInsuranceDetails);

                        angular.forEach($scope.PatientInsuranceSummary, function (initem) {
                            initem.CoverageName = "";
                            var filter1 = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": initem.CoverageId }, true) || [];
                            if (filter1.length > 0) {
                                initem.CoverageName = filter1[0].CoverageName || "";
                            }

                            initem.Status = "";
                            var filter1 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": initem.StatusId }, true) || [];
                            if (filter1.length > 0) {
                                initem.Status = filter1[0].Value || "";
                            }

                            var filterStatus = [];
                            filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": initem.RelationShipId }, true) || [];
                            if (filterStatus.length > 0) {
                                initem.InsuranceRelationShipObj = filterStatus[0];
                            }
                            //initem.Status = "";
                            //var filter1 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": initem.StatusId }, true) || [];
                            //if (filter1.length > 0) {
                            //    initem.Status = filter1[0].Value || "";
                            //}
                            if (initem.EffectiveDate != "" && initem.EffectiveDate != null) {
                                initem.EffectiveDate = $filter("date")(new Date(initem.EffectiveDate), "MM-dd-yyyy") || "";
                            }
                            if (initem.ExpiryDate != "" && initem.ExpiryDate != null) {
                                initem.ExpiryDate = $filter("date")(new Date(initem.ExpiryDate), "MM-dd-yyyy") || "";
                            }
                            if (initem.ScanDate != "" && initem.ScanDate != null) {
                                initem.ScanDate = $filter("date")(new Date(initem.ScanDate), "MM-dd-yyyy") || "";
                            }
                            if (initem.VerifiedDate != "" && initem.VerifiedDate != null) {
                                initem.VerifiedDate = $filter("date")(new Date(initem.VerifiedDate), "MM-dd-yyyy") || "";
                            }
                            initem.DeleteInd = false;
                        });

                        if (EditMode === "Edit") {
                            var tempinsurance = angular.copy($scope.PatientInsuranceSummary[0]);
                            $scope.PatientInsuranceInfo.PatientInsuranceDetails = [];
                            $scope.PatientInsuranceInfo.PatientInsuranceDetails.push(tempinsurance);
                            if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId != null) {
                                $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].InsuranceRelationShipObj = $filter("filter")($scope.RelationShipTypeList, { "RelationId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId })[0];
                            }
                            if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId != null) {
                                $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj = $filter("filter")($scope.PayorAllLIstArray, { "PayorId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId })[0];

                                if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj != undefined) {
                                    $scope.ChangeInsurancePayor($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj, $scope.PatientInsuranceInfo.PatientInsuranceDetails[0], "GetPlan");
                                }
                            }
                            //if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != null) {
                            //    $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanObj = $filter("filter")($scope.payorPlansListArray, { "PlanId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId })[0];
                            //}
                        }

                        else {
                            $scope.PatientInsuranceInfo = GetInsuranceInfo();
                            $scope.frontItemUpload = false;
                            $scope.Ffile = null;
                            $scope.Bfile = null;
                            $scope.frontItemS3Url = false;
                            $scope.backItemUpload = false;
                            $scope.backItemS3Url = false;
                        }
                    }
                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                        return false;
                    }
                }
            }
            function OnAddPatientError() {
                alertify.error("Creating  Failed");
            }
        };
        // Patient Designated details
        $scope.PatientDesignatedSave = function (type) {
            $scope.PatientDesignatedInfo.PCP = $scope.PatientDesignatedInfo.PCP || null;
            $scope.PatientDesignatedInfo.Provider1 = $scope.PatientDesignatedInfo.Provider1 || null;
            $scope.PatientDesignatedInfo.Provider2 = $scope.PatientDesignatedInfo.Provider2 || null;
            $scope.PatientDesignatedInfo.Corporation = $scope.PatientDesignatedInfo.Corporation || null;
            $scope.PatientDesignatedInfo.Office = $scope.PatientDesignatedInfo.Office || null;
            $scope.PatientDesignatedInfo.MasterReferralSourceId = $scope.PatientDesignatedInfo.MasterReferralSourceId || null;
            $scope.PatientDesignatedInfo.ReferralSourceId = $scope.PatientDesignatedInfo.ReferralSourceId || null;
            $scope.PatientDesignatedInfo.ReferralDate = $scope.PatientDesignatedInfo.ReferralDate || null;

            if ($scope.PatientDesignatedInfo.PCP == null && $scope.PatientDesignatedInfo.Provider1 == null &&
                $scope.PatientDesignatedInfo.Provider2 == null &&
                $scope.PatientDesignatedInfo.Office == null && $scope.PatientDesignatedInfo.MasterReferralSourceId == null &&
                $scope.PatientDesignatedInfo.ReferralSourceId == null && $scope.PatientDesignatedInfo.PatientPCPDocuments.length == 0 &&
                ($scope.PatientDesignatedInfo.ReferralDate == "" || $scope.PatientDesignatedInfo.ReferralDate == null || $scope.PatientDesignatedInfo.ReferralDate == undefined)) {
                if (type === "Final") {
                    $scope.Registeraddpopup = true;
                    $scope.cacheValuesBookAppointment();
                }
                return false;
            }
            var TempDesignated= $scope.PatientDesignatedInfo;
            TempDesignated.PatientId = $scope.patientid;
            TempDesignated.ReferralDate = $filter("dateFormatter")(TempDesignated.ReferralDate, "-"); //$scope.patientid;
            TempDesignated.FullName = $scope.PatientFullName;
            TempDesignated.MasterReferralSourceId = TempDesignated.MasterReferralSourceId === 0 ? null : TempDesignated.MasterReferralSourceId;
            TempDesignated.ReferralSourceId = TempDesignated.ReferralSourceId === 0 ? null : TempDesignated.ReferralSourceId;

            eHnotePatientDataService.AddUpdateDesignatedDetails(TempDesignated, OnAddPatientSuccess, OnAddPatientError);
            function OnAddPatientSuccess(resp) {
                console.log(JSON.stringify(resp));
                if (resp.Status === "Success") {
                    $scope.PatientDesignatedSummary = GetDesignatedInfo();
                    $scope.PatientDesignatedSummary.PCP = resp.PCP || 0;
                    $scope.PatientDesignatedSummary.Provider1 = resp.Provider1 || 0;
                    $scope.PatientDesignatedSummary.Provider2 = resp.Provider2 || 0;
                    $scope.PatientDesignatedSummary.Corporation = resp.Corporation || 0;
                    $scope.PatientDesignatedSummary.Office = resp.Office || 0;
                    $scope.PatientDesignatedSummary.ReferralMobileNo = resp.ReferralMobileNo || 0;
                    $scope.PatientDesignatedSummary.ReferralContactNo = resp.ReferralMobileNo || 0;
                    $scope.PatientDesignatedSummary.MasterReferralSourceId = resp.MasterReferralSourceId || 0;
                    $scope.PatientDesignatedSummary.ReferralSourceId = resp.ReferralSourceId || 0;
                    $scope.PatientDesignatedSummary.ReferralDate = resp.ReferralDate != "" ? $filter('date')(new Date(resp.ReferralDate), "MM-dd-yyyy") : '';
                    $scope.PatientDesignatedSummary.PatientPCPDocuments = angular.copy(resp.PatientPCPDocuments) || [];

                    if ($scope.PatientDesignatedSummary.PCP != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.ReferalPCPDoctorsList, { "PcpReferralId": $scope.PatientDesignatedSummary.PCP }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.PCPDoctorName = filter1[0].DoctorName || "";
                        }
                    }
                    if ($scope.PatientDesignatedSummary.Provider1 != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": $scope.PatientDesignatedSummary.Provider1 }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.Provider1Name = filter1[0].FullName || "";
                        }
                    }
                    if ($scope.PatientDesignatedSummary.Provider2 != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": $scope.PatientDesignatedSummary.Provider2 }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.Provider2Name = filter1[0].FullName || "";
                        }
                    }
                    if ($scope.PatientDesignatedSummary.Corporation != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.PatientDesignatedSummary.Corporation }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.CorporationName = filter1[0].ClinicName || "";
                        }
                    }
                    if ($scope.PatientDesignatedSummary.Office != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.PatientDesignatedSummary.Office }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.OfficeName = filter1[0].ClinicName || "";
                        }
                    }
                    if ($scope.PatientDesignatedSummary.MasterReferralSourceId != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": $scope.PatientDesignatedSummary.MasterReferralSourceId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.MasterReferralSourceName = filter1[0].MasterReferralSourceName || "";
                        }
                    }
                    if ($scope.PatientDesignatedSummary.ReferralSourceId != 0) {
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedSummary.ReferralSourceId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.PatientDesignatedSummary.ReferralSourceName = filter1[0].ReferralTitle || "";
                        }
                    }

                    if (type === "Final") {
                        $scope.Registeraddpopup = true;
                        $scope.cacheValuesBookAppointment();
                        return false;
                    }
                }
            }
            function OnAddPatientError() {
                alertify.error("Creating  Failed");
            }
        };

        $scope.ClearAllData = function () {
            $scope.Headers = $scope.GetHeaderInfo();
            $scope.Headers.PatientHeader = true;
            $scope.PatientDetailsInfo = GetPatientDetailsInfo();
            $scope.PatientDetailSummary = GetPatientDetailsInfo();
            $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode = $scope.AreaCodeArrayList[0].CodeName;
            $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode = $scope.AreaCodeArrayList[0].CodeName;
            $scope.PatientAddressInfo = GetPatientAddress();
            $scope.PatientAddressSummary = GetPatientAddress();
            $scope.FamilyInfo = GetFamilyInfo();
            $scope.FamilySummary = [];
            $scope.DemographicInfo = GetDemographicInfo();
            $scope.DemographicSummary = GetDemographicInfo();
            $scope.PatientInsuranceInfo = GetInsuranceInfo();
            $scope.PatientInsuranceSummary = [];
            $scope.PatientDesignatedInfo = GetDesignatedInfo();
            $scope.PatientDesignatedSummary = GetDesignatedInfo();

            $scope.patientid = 0;
            $scope.PatientFullName = "";
            $scope.PatientDisplayID = 0;
        }

        // Get aptient Deatils 
        var patientitem = "";
        $scope.SelectPatient = function (pitem, type) {
            $scope.ClearAllData();
            $scope.DefaultShowDetails = true;
            $scope.ShowpatientsDetails = false;
            $scope.ShowAddNew = false;
            $scope.ageinYears = "";
            $scope.ageinMonths = "";
            $scope.ageinDays = "";
            if (type === 1) {
                var patientID = pitem.Patient[0].PatientId;// 166099; //220520;

                eHnoteAuditServices.getPatientDetailsById(patientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                function ongetPatientDetailsSuccess(data) {
                    if (data !== undefined) {
                        var patientitem = data;

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
                        $scope.PatientDetailsInfo.LastName = patientitem.Patient[0].LastName;
                        if (patientitem.Patient[0].DOB != "") {
                            $scope.PatientDetailsInfo.DOB = $filter('date')(new Date(patientitem.Patient[0].DOB), "MM-dd-yyyy");
                        }
                        $scope.ageinYears = patientitem.Patient[0].AgeInYears;
                        $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
                        $scope.ageinDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
                        $scope.PatientDetailsInfo.SocialSecurityNo = patientitem.Patient[0].SocialSecurityNo || "";
                        $scope.PatientDetailsInfo.Gender = patientitem.Patient[0].Gender || "";

                        if (patientitem.Patient[0].PatientOtherDetails.length > 0) {
                            if (patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus != undefined && patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus != "") {
                                var MaritalStatusId = parseInt(patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus) || 0;
                                $scope.PatientDetailsInfo.MaritalStatusID = MaritalStatusId;
                                var filterStatus = $filter("filter")($scope.MartialStatusList, { "Id": MaritalStatusId }, true) || [];
                                if (filterStatus.length > 0) {
                                    $scope.PatientDetailsInfo.MaritalStatusName = filterStatus[0].MaritalStatus;
                                }
                            }
                        }
                        $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode = patientitem.Patient[0].PatientHomeCode != '' ? ('+' + patientitem.Patient[0].PatientHomeCode) : '';
                        $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber = patientitem.Patient[0].PatientHomeNumber || '';
                        $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode = patientitem.Patient[0].PatientOfficeCode != '' ? ('+' + patientitem.Patient[0].PatientOfficeCode) : '';
                        $scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber = patientitem.Patient[0].PatientOfficeNumber || "";
                        $scope.PatientDetailsInfo.ContactInfo.EmailID = patientitem.Patient[0].EmailId || "";
                        if (patientitem.PatientVitals.length > 0) {
                            if (patientitem.PatientVitals[0].Vitals != undefined) {
                                if (patientitem.PatientVitals[0].Vitals.BLGId != undefined && patientitem.PatientVitals[0].Vitals.BLGId != "") {
                                    var filterStatus = $filter("filter")($scope.BloodGroupList, { "Id": patientitem.PatientVitals[0].Vitals.BLGId }, true) || [];
                                    if (filterStatus.length > 0) {
                                        $scope.PatientDetailsInfo.BloodGroupName = filterStatus[0].BloodGroupName;
                                        $scope.PatientDetailsInfo.BloodGroupId = filterStatus[0].Id;
                                        $scope.PatientDetailsInfo.BloodGroupObj = filterStatus[0];
                                    }
                                }
                            }
                        }
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

                        $scope.PatientDetailsInfo.Age = patientitem.Patient[0].Age;
                        $scope.PatientDetailsInfo.PatientDisplayID = patientitem.Patient[0].PatientDisplayId;
                        $scope.PatientDetailsInfo.FullName = patientitem.Patient[0].FullName;
                        $scope.PatientDetailsInfo.S3URL = patientitem.Patient[0].S3URL;


                        $scope.PatientDetailSummary = angular.copy($scope.PatientDetailsInfo);

                        if (patientitem.FamilyDetails.length > 0) {
                            angular.forEach(patientitem.FamilyDetails, function (fitem) {
                                var objitem = {
                                    "PatientId": fitem.FamilyPatientId,
                                    "FamilyId": fitem.Familyid || 0,
                                    "DeleteInd": "N",
                                    "Title": "",
                                    "TitleId": fitem.TitleId || 0,
                                    "FirstName": fitem.FirstName,
                                    "LastName": fitem.LastName,
                                    "Relation": "",
                                    "RelationId": fitem.FamilyRelationShipId || 0,
                                    "AreaCode": fitem.Areacode != "" ? "+" + fitem.Areacode : "",
                                    "MobileNumber": fitem.ContactNo,
                                    "ParentPatientId": fitem.ParentPatientId,
                                    "RelationObj": "",
                                    "Age": fitem.Age,
                                    "DOB": "",
                                    "CurrentAge": "",
                                    "ageinYears": "",
                                    "ageinMonths": "",
                                    "ageinDays": ""
                                }
                                if (fitem.DOB != "" && fitem.DOB != null && fitem.DOB != undefined) {
                                    objitem.DOB = $filter("date")(new Date(fitem.DOB), "MM-dd-yyyy") || "";
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
                        }

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
                                    "PayorObj": "",
                                    "PlanTypeId": initem.PlanTypeId || 0,
                                    "PlanDescription": initem.PlanDescriptionl || "", // initem.PlanTypeName || "",
                                    "PolicyId": initem.PolicyId,
                                    "GroupId": initem.GroupId || 0,
                                    "GroupName": initem.GroupName || "",
                                    "RelationShipId": initem.RelationShipId || 1,
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
                                    "InsuredPersonSSN": initem.InsuredPersonSSN || ""
                                };

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
                                    objectinsurance.EffectiveDate = $filter("date")(new Date(initem.EffectiveDate), "MM-dd-yyyy") || "";
                                }
                                if (initem.ExpiryDate != "" && initem.ExpiryDate != null) {
                                    objectinsurance.ExpiryDate = $filter("date")(new Date(initem.ExpiryDate), "MM-dd-yyyy") || "";
                                }
                                if (initem.ScanDate != "" && initem.ScanDate != null) {
                                    objectinsurance.ScanDate = $filter("date")(new Date(initem.ScanDate), "MM-dd-yyyy") || "";
                                }
                                if (initem.VerifiedDate != "" && initem.VerifiedDate != null) {
                                    objectinsurance.VerifiedDate = $filter("date")(new Date(initem.VerifiedDate), "MM-dd-yyyy") || "";
                                }

                                if (initem.InsuredPersonDOB != "" && initem.InsuredPersonDOB != null) {
                                    objectinsurance.InsuredPersonDOB = $filter("date")(new Date(initem.InsuredPersonDOB), "MM-dd-yyyy") || "";
                                }

                                $scope.PatientInsuranceSummary.push(objectinsurance);
                            });
                        }

                        var DemographicsList = patientitem.Patient[0].AdditionalInfo;
                        $scope.DemographicSummary.Ethnicity = angular.copy(patientitem.PatientEthnicity);
                        $scope.DemographicSummary.Race = angular.copy(patientitem.PatientRace);
                        $scope.DemographicSummary.PreferedLanguage = angular.copy(patientitem.PatientLanguage);

                        $scope.DemographicSummary.ExpressionId = DemographicsList.ExpressionId || 0;
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.PatientLanguageExpressionList, { "DropdownId": $scope.DemographicSummary.ExpressionId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.DemographicSummary.Expression = filter1[0].Value || "";
                            //$scope.DemographicSummary.ExpressionObj = $filter("filter")($scope.PatientLanguageExpressionList, { "DropdownId": $scope.DemographicSummary.ExpressionId })[0];
                        }
                        $scope.DemographicSummary.ProficiencyId = DemographicsList.ProficiencyId || 0;
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.PatientLanguageProficiencyList, { "DropdownId": $scope.DemographicSummary.ProficiencyId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.DemographicSummary.Proficiency = filter1[0].Value || "";
                        }
                        $scope.DemographicSummary.PatientPrefixListId = DemographicsList.PatientPrefixListId || 0;
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.PatientPrefixList, { "DropdownId": $scope.DemographicSummary.PatientPrefixListId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.DemographicSummary.PatientPrefixListName = filter1[0].Value || "";
                        }
                        $scope.DemographicSummary.PatinetSuffixId = DemographicsList.PatinetSuffixId || 0;
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.PatientSuffixList, { "SuffixId": $scope.DemographicSummary.PatinetSuffixId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.DemographicSummary.PatientSuffixName = filter1[0].Value || "";
                        }
                        $scope.DemographicSummary.SexualOrientationId = DemographicsList.SexualOrientationId || 0;
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.PatientSexualOrientationList, { "DropdownId": $scope.DemographicSummary.SexualOrientationId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.DemographicSummary.SexualOrientation = filter1[0].Value || "";
                        }
                        $scope.DemographicSummary.GenderIdentityStatusId = DemographicsList.GenderIdentityId || 0;
                        var filter1 = [];
                        filter1 = $filter("filter")($scope.PatientGenderIdentityList, { "DropdownId": $scope.DemographicSummary.GenderIdentityStatusId }, true) || [];
                        if (filter1.length > 0) {
                            $scope.DemographicSummary.GenderIdentityStatus = filter1[0].Value || "";
                        }

                        $scope.DemographicSummary.FirstName = DemographicsList.FirstName || "";
                        $scope.DemographicSummary.LastName = DemographicsList.LastName || "";
                        $scope.DemographicSummary.MultipleBirth = DemographicsList.MultipleBirth || "";
                        $scope.DemographicSummary.MothersMiddleName = DemographicsList.MothersMiddleName || "";

                        $scope.PatientDesignatedSummary.PCP = DemographicsList.PCP || 0;
                        $scope.PatientDesignatedSummary.Provider1 = DemographicsList.Provider1 || 0;
                        $scope.PatientDesignatedSummary.Provider2 = DemographicsList.Provider2 || 0;
                        $scope.PatientDesignatedSummary.Corporation = DemographicsList.Corporation || 0;
                        $scope.PatientDesignatedSummary.Office = DemographicsList.Office || 0;
                        $scope.PatientDesignatedSummary.MasterReferralSourceId = DemographicsList.MasterReferralSourceId || 0;
                        $scope.PatientDesignatedSummary.ReferralSourceId = DemographicsList.ReferralSourceId || 0;
                        $scope.PatientDesignatedSummary.ReferralDate = "";
                        $scope.PatientDesignatedSummary.PatientPCPDocuments = angular.copy(patientitem.PatientPCPDocuments) || [];

                        if ($scope.PatientDesignatedSummary.PCP != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.ReferalPCPDoctorsList, { "PcpReferralId": $scope.PatientDesignatedSummary.PCP }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.PCPDoctorName = filter1[0].DoctorName || "";
                            }
                        }
                        if ($scope.PatientDesignatedSummary.Provider1 != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": $scope.PatientDesignatedSummary.Provider1 }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.Provider1Name = filter1[0].FullName || "";
                            }
                        }
                        if ($scope.PatientDesignatedSummary.Provider2 != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": $scope.PatientDesignatedSummary.Provider2 }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.Provider2Name = filter1[0].FullName || "";
                            }
                        }
                        if ($scope.PatientDesignatedSummary.Corporation != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.PatientDesignatedSummary.Corporation }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.CorporationName = filter1[0].ClinicName || "";
                            }
                        }
                        if ($scope.PatientDesignatedSummary.Office != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.PatientDesignatedSummary.Office }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.OfficeName = filter1[0].ClinicName || "";
                            }
                        }
                        if ($scope.PatientDesignatedSummary.MasterReferralSourceId != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": $scope.PatientDesignatedSummary.MasterReferralSourceId }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.MasterReferralSourceName = filter1[0].MasterReferralSourceName || "";
                            }
                        }
                        if ($scope.PatientDesignatedSummary.ReferralSourceId != 0) {
                            var filter1 = [];
                            filter1 = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedSummary.ReferralSourceId }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientDesignatedSummary.ReferralSourceName = filter1[0].ReferralTitle || "";
                            }
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
                    }
                }
                function ongetPatientDetailsError(error) {
                    console.log(error);
                }
            }
            else if (type === 2) {
                //$scope.patientinfo.PhoneType = "Mobile";
                $scope.PatientDetailsInfo.PatientID = 0;
                if ($scope.SerachPatient.SearchByText.length > 0) {
                    $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber = $scope.SerachPatient.SearchByText;
                }
                //  $scope.patientinfo.S3URL = "";
                $scope.ShowSearchAndClear = true;
                //if ($scope.patientinfo.PatientInsuranceDetailsArray.length === 0) {
                //    var insObj = newPatientInsuranceObj();
                //    $scope.patientinfo.PatientInsuranceDetailsArray.push(insObj);
                //}
                $scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
                $scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;

                $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
                $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
            }
            $scope.patients = [];
        };
        //$scope.SelectPatient('', 1);

        // edit patientDetails
        $scope.EditFamilyDetails = function (FamilyDetails) {
            if (FamilyDetails != "") {
                //$scope.Headers = $scope.GetHeaderInfo();
                //$scope.Headers.FamilyMemberHeader = true;
                $scope.FamilyInfo.FamilyArray = [];
                $scope.FamilyInfo.FamilyArray = angular.copy(FamilyDetails);
                $scope.RegisterPatientSave();
                if (!$scope.ValidateIndictor) {
                    $scope.Headers = $scope.GetHeaderInfo();
                    $scope.Headers.FamilyMemberHeader = true;
                    $scope.SaveTypeObj.TypeName = "FamilyDetails";
                }
            }
        }
        $scope.EditPatientDetails = function (PatientDetails) {
            if (PatientDetails != "") {
                //$scope.Headers = $scope.GetHeaderInfo();
                //$scope.Headers.PatientHeader = true;
                $scope.PatientDetailsInfo = "";
                $scope.PatientDetailsInfo = angular.copy(PatientDetails);
                $scope.ageinYears = PatientDetails.Age;
                $scope.RegisterPatientSave();
                if (!$scope.ValidateIndictor) {
                    $scope.Headers = $scope.GetHeaderInfo();
                    $scope.Headers.PatientHeader = true;
                    $scope.SaveTypeObj.TypeName = "PatientDetails";

                    if ($scope.PatientDetailsInfo.PatientTagId != 0 && $scope.PatientDetailsInfo.PatientTagId != null) {
                        $scope.PatientDetailsInfo.PatientTagObj = $filter("filter")($scope.HospitalEquipmentList, { "HospitalEquipmentId": $scope.PatientDetailsInfo.PatientTagId })[0];
                    }
                }

            }
        }
        $scope.EditInsuranceDetails = function (InsuranceDetails) {
            if (InsuranceDetails != null) {
                var TempInsuranceDetails = angular.copy(InsuranceDetails);
                //$scope.Headers = $scope.GetHeaderInfo();
                //$scope.Headers.InsuranceHeader = true;
                //$scope.PatientInsuranceInfo = GetInsuranceInfo();
                //$scope.PatientInsuranceInfo.PatientInsuranceDetails = [];
                //$scope.PatientInsuranceInfo.PatientInsuranceDetails.push(TempInsuranceDetails);
                $scope.RegisterPatientSave('', "Edit");

                if (!$scope.ValidateIndictor) {
                    $scope.Headers = $scope.GetHeaderInfo();
                    $scope.Headers.InsuranceHeader = true;
                $scope.SaveTypeObj.TypeName = "InsuranceDetails";

                //if ($scope.SaveTypeObj.TypeName === "InsuranceDetails") {
                $timeout(function () {
                    $scope.PatientInsuranceInfo = GetInsuranceInfo();
                    $scope.PatientInsuranceInfo.PatientInsuranceDetails = [];
                    $scope.PatientInsuranceInfo.PatientInsuranceDetails.push(TempInsuranceDetails);

                    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId != null) {
                        $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].InsuranceRelationShipObj = $filter("filter")($scope.RelationShipTypeList, { "RelationId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId })[0];
                    }
                    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId != null) {
                        $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj = $filter("filter")($scope.PayorAllLIstArray, { "PayorId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId })[0];



                        if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj != undefined) {
                            $scope.ChangeInsurancePayor($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj, $scope.PatientInsuranceInfo.PatientInsuranceDetails[0], "GetPlan");
                        }
                    }

                    $scope.frontItemUpload = false;
                    $scope.Ffile = null;
                    $scope.Bfile = null;
                    $scope.frontItemS3Url = false;
                    $scope.backItemUpload = false;
                    $scope.backItemS3Url = false;
                    $scope.frontS3Url = "";
                    $scope.backS3Url = "";

                    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PatientDocumentDetails.length > 0) {
                        angular.forEach($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PatientDocumentDetails, function (item) {
                            if (item.IsBackSidefile) {
                                $scope.frontItemUpload = false;
                                $scope.frontItemS3Url = true;
                                $scope.frontS3Url = item.S3URL;
                            }
                            if (!item.IsBackSidefile) {
                                $scope.backItemUpload = false;
                                $scope.backItemS3Url = true;
                                $scope.backS3Url = item.S3URL;
                            }
                        });
                    }
                    $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].TempInsuranceImagesArray = [];
                }, 1000);
                //} else {
                //    $scope.RegisterPatientSave('', "Edit");
                //    $scope.SaveTypeObj.TypeName = "InsuranceDetails";



                //    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PatientDocumentDetails.length > 0) {
                //        angular.forEach($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PatientDocumentDetails, function (item) {
                //            if (item.IsBackSidefile) {
                //                $scope.frontItemUpload = false;
                //                $scope.frontItemS3Url = true;
                //                $scope.frontS3Url = item.S3URL;
                //            }
                //            if (!item.IsBackSidefile) {
                //                $scope.backItemUpload = false;
                //                $scope.backItemS3Url = true;
                //                $scope.backS3Url = item.S3URL;
                //            }
                //        });
                //    }



                //    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId != null) {
                //        $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].InsuranceRelationShipObj = $filter("filter")($scope.RelationShipTypeList, { "RelationId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].RelationShipId })[0];
                //    }

                //    if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId != null) {
                //        $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj = $filter("filter")($scope.PayorAllLIstArray, { "PayorId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorId })[0];

                //        if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj != undefined) {
                //            $scope.ChangeInsurancePayor($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PayorObj, $scope.PatientInsuranceInfo.PatientInsuranceDetails[0], "GetPlan");
                //        }
                //    }
                //    //if ($scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != 0 && $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId != null) {
                //    //    $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanObj = $filter("filter")($scope.payorPlansListArray, { "PlanId": $scope.PatientInsuranceInfo.PatientInsuranceDetails[0].PlanId })[0];
                //    //}
                //}
                    }
            }
        }
        $scope.EditDemographicDetails = function (DemographicDetails) {
            if (DemographicDetails != null) {
                //$scope.Headers = $scope.GetHeaderInfo();
                //$scope.Headers.DemographicsHeader = true;
                $scope.DemographicInfo = angular.copy(DemographicDetails);

                if ($scope.DemographicInfo.ExpressionId != "") {
                    $scope.DemographicInfo.ExpressionObj = $filter("filter")($scope.PatientLanguageExpressionList, { "DropdownId": $scope.DemographicInfo.ExpressionId })[0];
                }
                if ($scope.DemographicInfo.ProficiencyId != "") {
                    $scope.DemographicInfo.ProficiencyObj = $filter("filter")($scope.PatientLanguageProficiencyList, { "DropdownId": $scope.DemographicInfo.ProficiencyId })[0];
                }
                if ($scope.DemographicInfo.PatientPrefixListId != "" && $scope.DemographicInfo.PatientPrefixListId != null) {
                    $scope.DemographicInfo.PatientPrefixObj = $filter("filter")($scope.PatientPrefixList, { "DropdownId": $scope.DemographicInfo.PatientPrefixListId })[0];
                }
                if ($scope.DemographicInfo.PatinetSuffixId != "" && $scope.DemographicInfo.PatinetSuffixId != null) {
                    $scope.DemographicInfo.PatinetSuffixObj = $filter("filter")($scope.PatientSuffixList, { "SuffixId": $scope.DemographicInfo.PatinetSuffixId })[0];
                    $scope.DemographicInfo.PatientSuffixName = $scope.DemographicInfo.PatinetSuffixObj.Value || "";
                }
                if ($scope.DemographicInfo.SexualOrientationId != "") {
                    $scope.DemographicInfo.SexualOrientationObj = $filter("filter")($scope.PatientSexualOrientationList, { "DropdownId": $scope.DemographicInfo.SexualOrientationId })[0];
                }
                if ($scope.DemographicInfo.GenderIdentityStatusId != "") {
                    $scope.DemographicInfo.GenderIdentityStatusObj = $filter("filter")($scope.PatientGenderIdentityList, { "DropdownId": $scope.DemographicInfo.GenderIdentityStatusId })[0];
                }
                $scope.DemographicInfo.Ethnicity = $scope.DemographicInfo.Ethnicity || [];
                if ($scope.DemographicInfo.Ethnicity.length > 0) {
                    var filter1 = [];
                    $scope.obj.IsEthnicitySelected = [];
                   // $scope.obj.IsEthnicitySelected = $filter("filter")($scope.PatientEthnicityList, { "DropdownId": $scope.DemographicInfo.Ethnicity[0].EthnicityId })[0];
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
                //if ($scope.DemographicInfo.Race.length > 0) {
                //    var filter1 = [];
                //    $scope.obj.IsRaceSelected = $filter("filter")($scope.PatientRaceList, { "DropdownId": $scope.DemographicInfo.Race[0].RaceId })[0];
                //}
                $scope.DemographicInfo.Race = $scope.DemographicInfo.Race || [];
                if ($scope.DemographicInfo.Race.length > 0) {
                    var filter1 = [];
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
                $scope.RegisterPatientSave();
               // $scope.SaveTypeObj.TypeName = "DemographicsDetails";
                if (!$scope.ValidateIndictor) {
                    $scope.Headers = $scope.GetHeaderInfo();
                    $scope.Headers.DemographicsHeader = true;
                    $scope.SaveTypeObj.TypeName = "DemographicsDetails";
                }

            }
        }
        $scope.EditDesignatedDetails = function (DesignatedDetails) {
            if (DesignatedDetails != null) {
                //$scope.Headers = $scope.GetHeaderInfo();
                //$scope.Headers.DesignatedHeader = true;
                $scope.PatientDesignatedInfo = angular.copy(DesignatedDetails);
               // $scope.PatientDesignatedInfo.ReferralDate = "";
                if ($scope.PatientDesignatedInfo.PCP != 0) {
                    $scope.PatientDesignatedInfo.PCPobj = $filter("filter")($scope.ReferalPCPDoctorsList, { "PcpReferralId": $scope.PatientDesignatedInfo.PCP })[0] || [];
                }
                if ($scope.PatientDesignatedInfo.Provider1 != 0) {
                    $scope.PatientDesignatedInfo.Provider1Obj = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": $scope.PatientDesignatedInfo.Provider1 })[0] || [];

                }
                if ($scope.PatientDesignatedInfo.Provider2 != 0) {
                    $scope.PatientDesignatedInfo.Provider2Obj = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": $scope.PatientDesignatedInfo.Provider2 })[0] || [];

                }
                if ($scope.PatientDesignatedInfo.Corporation != 0) {
                    $scope.PatientDesignatedInfo.CorporationObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.PatientDesignatedInfo.Corporation })[0] || [];

                }
                if ($scope.PatientDesignatedInfo.Office != 0) {
                    $scope.PatientDesignatedInfo.OfficeObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.PatientDesignatedInfo.Office })[0] || [];

                }
                if ($scope.PatientDesignatedInfo.MasterReferralSourceId != 0) {
                    $scope.PatientDesignatedInfo.MasterReferralSourceObj = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": $scope.PatientDesignatedInfo.MasterReferralSourceId })[0] || [];

                }
                if ($scope.PatientDesignatedInfo.ReferralSourceId != 0) {
                    if ($scope.ReferralList == undefined) {
                        GetrefferalSource("", "Get");
                    } else {
                        $scope.PatientDesignatedInfo.ReferralSourceObj = $filter("filter")($scope.ReferralList, { "ReferralID": $scope.PatientDesignatedInfo.ReferralSourceId })[0] || [];
                    }

                }
                if ($scope.PatientDesignatedInfo.ReferralDate != "" && $scope.PatientDesignatedInfo.ReferralDate != null) {
                    $scope.PatientDesignatedInfo.ReferralDate = $filter('date')(new Date($scope.PatientDesignatedInfo.ReferralDate), "MM-dd-yyyy");
                } else {
                    $scope.PatientDesignatedInfo.ReferralDate = "";
                }

                $scope.RegisterPatientSave();
                //$scope.SaveTypeObj.TypeName = "DesignatedDetails";
                if (!$scope.ValidateIndictor) {
                    $scope.Headers = $scope.GetHeaderInfo();
                    $scope.Headers.DesignatedHeader = true;
                    $scope.SaveTypeObj.TypeName = "DesignatedDetails";
                }
            }
        }
        $scope.EditPatientAddressDetails = function (AddressDetails) {
            //$scope.Headers = $scope.GetHeaderInfo();
            //$scope.Headers.AddresHeader = true;
            $scope.PatientAddressInfo = angular.copy(AddressDetails);
            $scope.RegisterPatientSave();
           // $scope.SaveTypeObj.TypeName = "AddressDetails";
            if (!$scope.ValidateIndictor) {
                $scope.SaveTypeObj.TypeName = "AddressDetails";
                $scope.Headers = $scope.GetHeaderInfo();
                $scope.Headers.AddresHeader = true;
            }
        }

        function GetSearchPatient() {
            var item = {
                "TypeId": 2,
                "SearchByText": ""
            }
            return item;
        }
        $scope.patients = [];
        $scope.SerachPatient = GetSearchPatient();
        $scope.ChangeSearchId = function (typeid) {
            $scope.SerachPatient.TypeId = typeid;
            $scope.SerachPatient.SearchByText = "";
            $scope.DefaultShowDetails = false;
            $scope.ShowpatientsDetails = false;
            $scope.ShowAddNew = false;
        }
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
                    //   $scope.patientinfo.PhoneType = "Mobile";
                    $scope.ShowAddNew = false;
                    $scope.DefaultShowDetails = false;
                    // $scope.ChangepatientSearch();
                }
            }

        };
        function OnGetPatientSuccess(data) {
            $scope.showloading = false;
            if (data.count > 0) {
                $scope.patients = data.rows;

                $scope.ShowpatientsDetails = true;
                $scope.ShowAddNew = true;
                $scope.SaveTypeObj.TypeName = "PatientDetails";

            } else {
                if ($scope.patients.length === 0) {
                    $scope.PatientDetailsInfo.MobileNumber = $scope.mobilenumber || "";
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
        function LoadPatientSearch(object) {
            InventoryService.SearchInvPatient(object).then(function (resp) {
                if (resp.data.data.length !== 0) {
                    if (resp.data.data != undefined) {
                        var patientList = resp.data.data || [];
                        angular.forEach(patientList, function (items) {
                            items.Patient = [];
                            var obj = {
                                "FullName": items.fullname,
                                "PatientId": items.PatientId,
                                "PatientHomeNumber": items.MobileNo,
                                "PatientDisPlayID": items.PatientDisplayId
                            };
                            items.Patient.push(obj);
                        });
                        $scope.patients = patientList;
                        $scope.ShowpatientsDetails = true;
                        $scope.ShowAddNew = false;
                    }
                } else {
                    $scope.patients = [];
                    $scope.ShowpatientsDetails = false;
                }
            }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        }
        $scope.changeSearchByText = function (val, type) {
            var object = {};
            if (type === 1) {
                if (val != undefined && val.length >= 3) {
                    object = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "Name": val,
                        "Mobile": null,
                        "PatientId": null,
                        "PageSize": 30,
                        "PageNo": 1
                    };
                    LoadPatientSearch(object);
                } else {
                    $scope.patients = [];
                    $scope.DefaultShowDetails = false;
                }
            }
            if (type === 3) {
                if (val != undefined && val.length > 9) {
                    object = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "Name": null,
                        "Mobile": null,
                        "PatientId": val,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                    LoadPatientSearch(object);
                } else {
                    $scope.patients = [];
                    $scope.DefaultShowDetails = false;
                }
            }

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
            //if (type === "Final") {
            //    $scope.Registeraddpopup = true;
            //    return false;
            //}
        }
        $scope.CancelAllData = function () {
            $scope.ClearAllData();
            $scope.DefaultShowDetails = false;
            $scope.ShowpatientsDetails = false;
            $scope.ShowAddNew = false;
            $scope.patients = [];
            $scope.SerachPatient = GetSearchPatient();
            $scope.SaveTypeObj.TypeName = "PatientDetails";
            $location.url("/op");
        }

        $scope.closeBookAppPopup = function () {
            var url = "/op";
            $location.url(url);
        };
        var SetupPopUp;
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
        $scope.cacheValuesBookAppointment = function () {
            var tmpPatId = 0;
            $scope.patID = $scope.PatientDetailSummary.PatientID;
            tmpPatId = $scope.PatientDetailSummary.PatientID;
            $scope.showloading = false;
            //if (data !== null && data.Patient !== null && data.Patient.length > 0) {
            //    $scope.newpatient = data;
            //    $scope.AddedPatientData = data;
            //setCacheStorage(data, datapersistanceFactory, eHnoteCacheStorageService, eHnoteMasterDataService);
            eHnoteValidateUsersDataService.RemoveProcessingCookies();
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentinfo.AppointmentID = 0;
            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
            /*}*/


            var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            cacheStorageItem.patientid = $scope.PatientDetailSummary.PatientID;
            cacheStorageItem.EmailID = $scope.PatientDetailSummary.ContactInfo.EmailID != '' ? $scope.PatientDetailSummary.ContactInfo.EmailID : '';
            cacheStorageItem.CountryCode = $scope.PatientDetailSummary.ContactInfo.PatientHomeCode ? $scope.PatientDetailSummary.ContactInfo.PatientHomeCode : '';
            cacheStorageItem.PhoneNumber = $scope.PatientDetailSummary.ContactInfo.PatientHomeNumber ? $scope.PatientDetailSummary.ContactInfo.PatientHomeNumber : '';
            //  cacheStorageItem.PatientTypeId = data.Patient[0].PatientTypeId;
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
            bindDoctorSlot();
        };

        $scope.newcaptureimage = function () {

            // $scope.ClosepatientPhotoUpload();
            $scope.modelIntance = $uibModal.open({
                "size": 'md',
                "templateUrl": 'loadNewpopup.html',
                "scope": $scope,
                "backdrop": "static",
                "keyboard": false
            });
        };
        $scope.ClosepatientPhotoUpload = function () {
            $scope.modelIntance.dismiss("cancel");
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
        $scope.cancelCapturePopup = function () {
            $scope.PatientDetailsInfo.S3URL = '';
            $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
            $scope.modelIntance.dismiss('cancel');

        }
        $scope.PatientClick = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.PatientHeader = true;
                $scope.SaveTypeObj.TypeName = 'PatientDetails';
            }
        }
        $scope.AddressClick= function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.AddresHeader = true;
                $scope.SaveTypeObj.TypeName = 'AddressDetails';
            }
        }
        $scope.DemographicsClick = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.DemographicsHeader = true;
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            }
        }
        $scope.FamilyClick = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.FamilyMemberHeader = true;
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';

                $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
                $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
            }
        }
        $scope.DesignatedClick = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.DesignatedHeader = true;
                $scope.SaveTypeObj.TypeName = 'DesignatedDetails';
            }
        }
        $scope.InsuranceClick = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.InsuranceHeader = true;
                $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
            }
        }

        $scope.PatientSaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.AddresHeader = true;
                $scope.SaveTypeObj.TypeName = 'AddressDetails';
            }
        };
        $scope.AddressSaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.DemographicsHeader = true;
                $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
            }
        };
        $scope.DemographicsSaveAndNext = function () {

            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.FamilyMemberHeader = true;
                $scope.SaveTypeObj.TypeName = 'FamilyDetails';

                $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id;
                $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
            }
        };
        $scope.FamilySaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.DesignatedHeader = true;
                $scope.SaveTypeObj.TypeName = 'DesignatedDetails';
            }
        };

        $scope.DesignatedSaveAndNext = function () {
            $scope.RegisterPatientSave();
            if (!$scope.ValidateIndictor) {
                $scope.clearHeaderInfo();
                $scope.Headers.InsuranceHeader = true;
                $scope.SaveTypeObj.TypeName = 'InsuranceDetails';
            }
        };

        $scope.AddressPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.PatientHeader = true;
            $scope.SaveTypeObj.TypeName = 'PatientDetails';
        };

        $scope.DemographicsPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.AddresHeader = true;
            $scope.SaveTypeObj.TypeName = 'AddressDetails';
        };

        $scope.FamilyPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.DemographicsHeader = true;
            $scope.SaveTypeObj.TypeName = 'DemographicsDetails';
        };

        $scope.DesignatedPrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.FamilyMemberHeader = true;
            $scope.SaveTypeObj.TypeName = 'FamilyDetails';
        };

        $scope.PatientInsurancePrevious = function () {
            $scope.clearHeaderInfo();
            $scope.Headers.DesignatedHeader = true;
        };

        $scope.PatientInfoClear = function (summary) {
            if ($scope.patientid === 0) {
                $scope.PatientDetailsInfo = GetPatientDetailsInfo();
                $scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
                $scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;
                $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode = $scope.AreaCodeArrayList[0].CodeName;
            } else {
                $scope.PatientDetailsInfo = GetPatientDetailsInfo();
                $scope.PatientDetailsInfo.PatientID = summary.PatientID;
                $scope.PatientDetailsInfo.FirstName = summary.FirstName;
                if (summary.DOB != "" && summary.DOB != null && summary.DOB != undefined) {
                    $scope.PatientDetailsInfo.DOB = $filter("date")(new Date(summary.DOB), "MM-dd-yyyy") || "";
                }
                $scope.PatientDetailsInfo.MobileNumber = summary.MobileNumber;
                $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber = summary.ContactInfo.PatientHomeNumber;
                $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode = summary.ContactInfo.PatientHomeCode;
                $scope.PatientDetailsInfo.PatientDisplayID = summary.PatientDisplayID;
                $scope.PatientDetailsInfo.Age = summary.Age;
                $scope.PatientDetailsInfo.TitleId = summary.TitleId;
                $scope.PatientDetailsInfo.Title = summary.Title;
                $scope.PatientDetailsInfo.Gender = summary.Gender;
                $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode = $scope.AreaCodeArrayList[0].CodeName;
            }
          //  $scope.PatientDetailSummary = GetPatientDetailsInfo();
        };

        $scope.AddressInfoClear = function () {
            $scope.PatientAddressInfo = GetPatientAddress();
            $scope.PatientAddressInfo.PermanentAddress.AddressId = $scope.PatientAddressSummary.PermanentAddress.AddressId;
            $scope.PatientAddressInfo.PostalAddress.AddressId == $scope.PatientAddressSummary.PostalAddress.AddressId;
            //$scope.PatientAddressSummary = GetPatientAddress();
        };

        $scope.DemographicsInfoClear = function () {
            $scope.DemographicInfo = GetDemographicInfo();
            $scope.DemographicSummary = GetDemographicInfo();
        };

        $scope.FamilyInfoClear = function () {
            $scope.FamilyInfo = GetFamilyInfo();
            $scope.FamilySummary = [];
        };

        $scope.DesignatedInfoClear = function () {
            $scope.PatientDesignatedInfo = GetDesignatedInfo();
            $scope.PatientDesignatedSummary = GetDesignatedInfo();
        };

        $scope.InsuranceInfoClear = function () {
            $scope.PatientInsuranceInfo = GetInsuranceInfo();
            //$scope.PatientInsuranceSummary = [];
            $scope.frontItemUpload = false;
            $scope.Ffile = null;
            $scope.Bfile = null;
            $scope.frontItemS3Url = false;
            $scope.backItemUpload = false;
            $scope.backItemS3Url = false;
        };

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
            fitem.DOB = moment(dob).format('MM-DD-YYYY');
            //daysInMonth(month, year);
        };

        $scope.changeEthnicity = function (ehnicith) {
            if (ehnicith == null) {
                $scope.obj.IsEthnicitySelected = "";
            }
        }
        $scope.changeRace = function (Race) {
            if (Race == null) {
                $scope.obj.IsRaceSelected = "";
            }
        }

        $scope.SubtabInsuranceClick = function () {
            if ($scope.PatientInsuranceSummary.length === 0) {
                $scope.InsuranceClick();
            }
            else if ($scope.PatientInsuranceSummary.length > 0) {
                $scope.EditInsuranceDetails($scope.PatientInsuranceSummary[0]);
            }
        };
        $scope.SubtabFamilyClick = function () {
            if ($scope.FamilySummary.length === 0) {
                $scope.FamilyClick();
            } else {
                $scope.EditFamilyDetails($scope.FamilySummary);
            }
        }
        $scope.SubtabAddressClick = function () {
            if ($scope.PatientAddressSummary.PermanentAddress.AddressId == 0 && $scope.PatientAddressSummary.PostalAddress.AddressId == 0) {
                $scope.AddressClick();
            } else {
                $scope.EditPatientAddressDetails($scope.PatientAddressSummary);
            }
        }

        $scope.SubtabDemographicsClick = function () {
            $scope.DemographicSummary.MultipleBirth = $scope.DemographicSummary.MultipleBirth || "";
            $scope.DemographicSummary.MothersMiddleName = $scope.DemographicSummary.MothersMiddleName || "";
            $scope.DemographicSummary.PatinetSuffixId = $scope.DemographicSummary.PatinetSuffixId || null;
            $scope.DemographicSummary.PatientPrefixListId = $scope.DemographicSummary.PatientPrefixListId || null;
            $scope.DemographicSummary.ExpressionId = $scope.DemographicSummary.ExpressionId || null;
            $scope.DemographicSummary.SexualOrientationId = $scope.DemographicSummary.SexualOrientationId || null;
            $scope.DemographicSummary.ProficiencyId = $scope.DemographicSummary.ProficiencyId || null;
            $scope.DemographicSummary.GenderIdentityStatusId = $scope.DemographicSummary.GenderIdentityStatusId || null;

            if ($scope.DemographicSummary.Ethnicity.length == 0 && $scope.DemographicSummary.Race.length == 0 &&
                $scope.DemographicSummary.PreferedLanguageObj.length == 0 && ($scope.DemographicSummary.MultipleBirth == "" || $scope.DemographicSummary.MultipleBirth == 0) &&
                $scope.DemographicSummary.MothersMiddleName == "" && ($scope.DemographicSummary.PatientPrefixListId == null || $scope.DemographicSummary.PatientPrefixListId == 0) &&
                ($scope.DemographicSummary.PatinetSuffixId == null || $scope.DemographicSummary.PatinetSuffixId == 0) && $scope.DemographicSummary.ExpressionId == null &&
                $scope.DemographicSummary.SexualOrientationId == null && $scope.DemographicSummary.ProficiencyId == null && $scope.DemographicSummary.GenderIdentityStatusId == null) {
                $scope.DemographicsClick();
            } else {
                $scope.EditDemographicDetails($scope.DemographicSummary);
            }
        }
        $scope.SubtabDesignatedClick = function () {
            $scope.PatientDesignatedSummary.PCP = $scope.PatientDesignatedSummary.PCP || 0;
            $scope.PatientDesignatedSummary.Provider1 = $scope.PatientDesignatedSummary.Provider1 || 0;
            $scope.PatientDesignatedSummary.Provider2 = $scope.PatientDesignatedSummary.Provider2 || 0;
            $scope.PatientDesignatedSummary.Corporation = $scope.PatientDesignatedSummary.Corporation || 0;
            $scope.PatientDesignatedSummary.Office = $scope.PatientDesignatedSummary.Office || 0;
            $scope.PatientDesignatedSummary.MasterReferralSourceId = $scope.PatientDesignatedSummary.MasterReferralSourceId || 0;
            $scope.PatientDesignatedSummary.ReferralSourceId = $scope.PatientDesignatedSummary.ReferralSourceId || 0;
            $scope.PatientDesignatedSummary.ReferralDate = $scope.PatientDesignatedSummary.ReferralDate || "";

            if ($scope.PatientDesignatedSummary.PCP == 0 && $scope.PatientDesignatedSummary.Provider1 == 0 &&
                $scope.PatientDesignatedSummary.Provider2 == 0 && $scope.PatientDesignatedSummary.Corporation == 0 &&
                $scope.PatientDesignatedSummary.Office == 0 && $scope.PatientDesignatedSummary.MasterReferralSourceId == 0 &&
                $scope.PatientDesignatedSummary.ReferralSourceId == 0 && $scope.PatientDesignatedSummary.PatientPCPDocuments.length == 0 &&
                $scope.PatientDesignatedSummary.ReferralDate == "") {
                $scope.DesignatedClick();
            } else {
                $scope.EditDesignatedDetails($scope.PatientDesignatedSummary);
            }
        };

        $scope.changePolicyHolder = function (insuranceitem) {
            if (insuranceitem.PolicyHolder === "Self") {
                insuranceitem.PolicyHolderName = $scope.PatientDetailSummary.FullName;
            } else {
                insuranceitem.PolicyHolderName = "";
            }
        }
        $scope.changepayortext = function (item, insItem) {
            if (item == "" || item == null) {
                insItem.PayorId = 0;
            }
        }
}]);
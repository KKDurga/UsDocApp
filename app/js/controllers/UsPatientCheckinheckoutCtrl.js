eHnoteWebApp.controller("UsPatientCheckinheckoutCtrl", ["$scope", "$uibModalInstance", "obj", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnotePatientAddressDataServices", "eHnotePatientVisitReasonServices", "eHnoteAuditServices", "eHnotePatientVisitReasonServices", "eHnoteDiagnosisDataServices", "$filter", "$uibModal", "$q", "alertify", "eHnoteUserDataService", "datapersistanceFactory", "eHnoteSettingsDataService", "eHnoteInsuranceService", "eHnotePatientDataService", "eHnoteMainAdminServices", "eHnoteUserAppointmentDataService", "$rootScope","$location",
    function ($scope, $uibModalInstance, obj, eHnoteMasterDataService, eHnoteCacheStorageService, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnotePatientAddressDataServices, eHnotePatientVisitReasonServices, eHnoteAuditServices, eHnotePatientVisitReasonServices, eHnoteDiagnosisDataServices, $filter, $uibModal, $q, alertify, eHnoteUserDataService, datapersistanceFactory, eHnoteSettingsDataService, eHnoteInsuranceService, eHnotePatientDataService, eHnoteMainAdminServices, eHnoteUserAppointmentDataService, $rootScope, $location) {
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = doctorinfo.doctordata.User[0].DoctorID;
        $scope.RoleId = doctorinfo.doctordata.User[0].RoleId;
        // checkinout
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
       
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };
        $scope.PatientID = 0; $scope.AppointmentID = 0;
        $scope.parentProfileTab = {
            "MainTab": 1,
            "UpComingApptTab": 1,
            "PatientAndApptTab": 1,
            "AppointmentAdditionalDetails": "",
            "IscheckinOutInd": false
        };
        $scope.isfromresolveObj = {
            "IsfromResolveInd": false,
            "IsResolveitem": ""
        };
        // gettig  resolve information and assigning 
        var resolveobj = obj || {};
        if (resolveobj && Object.keys(resolveobj).length > 0) {
            $scope.allUserList = resolveobj.allUserList || [];
            $scope.PatientID = resolveobj.PatientID || 0;
            $scope.AppointmentID = resolveobj.AppointmentID || 0;
            $scope.AppointmentStatusId = resolveobj.AppointmentStatusId || 0;
            $scope.AppointmentTypeId = resolveobj.AppointmentTypeId || 0;
            $scope.AlertNoteTypeId = resolveobj.AlertNoteTypeId || 0;
            $scope.AllBranchesList = resolveobj.AllBranchesList || 0;
            $scope.IsFromCheckedOut = resolveobj.IsFromCheckedOut || false;
            $scope.ApptConsultationDt = resolveobj.ConsultationDt || $filter('date')(new Date(), "yyyy-MM-dd");
            resolveobj.CloseandOpenFlag = false;
            $scope.patientOnboardingStatus = resolveobj?.PatientOnboardingStatus || "";
            if ($scope.AppointmentStatusId == 1) {
                //not checkin Appt
                $scope.parentProfileTab.IscheckinOutInd = false;
            }
            if ($scope.AppointmentStatusId == 2) {
                // check in patient 
                $scope.parentProfileTab.IscheckinOutInd = true;
            }
            if ($scope.AppointmentStatusId == 4 && $scope.IsFromCheckedOut) {
                // Exp check in patient 
                $scope.parentProfileTab.IscheckinOutInd = true;
            }
            let appointmentinfo = {
                AppointmentID: $scope.AppointmentID || 0,
                PatientID: $scope.PatientID || 0,
                //PatientName: $scope.cacheStorageItem.PatientName || '',
                //DoctorName: $scope.SurgeryDiagnosisObj.SurgeonName || "",
                //ConsultationDt: $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            };
            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
        };

        $scope.PatientAlerts = [];

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.cacheStorageItem.PatientID = $scope.PatientID||0;
        $scope.cacheStorageItem.AppointmentID = $scope.AppointmentID||0;
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.uibclose = function () {
            $uibModalInstance.close(resolveobj);
        };
       
        // empty declarations 
        $scope.Viewall = false;
        $scope.IsInsuranceAvailable = false;
        $scope.allUserList = [];
        $scope.DocumentTypeArray = [];
        $scope.UpcomingAppointmentsArray = [];
        $scope.UpcomingAppointmentsCount = [];
        $scope.patientInsuranceTpasArray = [];
        $scope.OrganizationClearingHouseDetails = [];
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
                "S3URL": "img/Register-patient.png",
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
                "FaxHomeNumber": "",
                "SuffixName": "",

            };
            return obj;
        };
        $scope.PatientDetailsInfo = GetPatientDetailsInfo();
        $scope.mainPatientProfileObj = {
            "MainTab": 1,
            "PatientId": $scope.PatientID || 0,
            "AppointmentId": $scope.AppointmentID || 0,
            "PatientDetailsSummaryMode": false,
            "VisitId": 0,
            "AllBranchesList": $scope.AllBranchesList || [],
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
            "TitlesList": [],
            "isAscChartShowInd": false,
            "StatusFlag": '',
            "AppointmentDate": '',
            "CardTypesData": [],
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
            "PatientId": null
        };
        $scope.consentsMainObj = {
            "OrganizationConsents": [],
            "PatientConsents": [],
            "MainConsents": [],
            "SelectedConsentTemplateId": 0
        };
        $scope.CheckInsubTab = function () {
            return obj = {
                "MainTabId":1,
                "subtabId": 1,
                "AppointmentTab":""
            }
        };
        $scope.CheckInsubTabObj = $scope.CheckInsubTab();
       
        function getnewMainConsentObj() {
            var obj = {
                "PatientConsentFormId": 0,
                "IsPartiallySaved": false,
                "HTMLContent": "",
                "S3URL": "",
                "ConsentFormId": 0,
                "ConsentFormName": "",
                "ConsentTemplateId": 0,
                "ConsentTypeId": 0,
                "ConsentTypeName": "",
                "PDFcontent": "",
                "IsPatientSignRequired": false,
                "IsDoctorSignRequired": false,
                "IsAnesthesistSignRequired": false,
                "IsCounselorSignRequired": false,
                "IsStaffSignRequired": false,
                "IsGuardianSignRequired": false,
                "IsSignRequiredForEachVisit": false,
                "IsPatientSignatureDone": "",
                "IsProviderSignatureDone": "",
                "ProviderUserId": 0,
                "ProviderUserName": "",
                "IsStaffSignatureDone": "",
                "StaffUserId": 0,
                "StaffUserName": "",
                "IsCounselorSignatureDone": "",
                "CounselorUserId": 0,
                "CounselorUserName": "",
                "IsAnesthesistSignatureDone": "",
                "AnesthesistUserId": 0,
                "AnesthesistUserName": "",
                "IsGaurdianSignatureDone": "",
                "GaurdianUserId": 0,
                "GaurdianFirstName": "",
                "GaurdianLastName": "",
                "GaurdianRelationShipId": "",
                "PatientClass": "disabled",
                "ProviderClass": "disabled",
                "StaffClass": "disabled",
                "AnesthesistClass": "disabled",
                "CounselorClass": "disabled",
                "GaurdianClass": "disabled",
                "IsSelected": false,
                "PatientSignedDateTime": "",
                "ProviderSignedDateTime": "",
                "StaffSignedDateTime": "",
                "CounselorSignedDateTime": "",
                "AnesthesistSignedDateTime": "",
                "GaurdianSignedDateTime": "",
                "PatientSignCaptureUserId": 0,
                "ProviderSignCaptureUserId": 0,
                "StaffSignCaptureUserId": 0,
                "CounselorSignCaptureUserId": 0,
                "AnesthesistSignCaptureUserId": 0,
                "GaurdianSignCaptureUserId": 0
            };
            return obj;
        };
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
        $scope.filterValues = function () {
            return obj = {
                "FromDate": "",
                "Todate": "",
                "Type": ""
            }
        };
        $scope.filterValueObj = $scope.filterValues();
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
        };
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

        $scope.filterValueObj.Todate = $filter('date')(new Date(), 'MM-dd-yyyy'); // setting dates
        var threeMonthsBack = new Date();
        threeMonthsBack.setMonth(threeMonthsBack.getMonth() - 3);
        $scope.filterValueObj.FromDate = $filter('date')(threeMonthsBack, 'MM-dd-yyyy');
        $scope.filterValueObj.Type = 'CreatedDate';
        function GetAlertData() {
            return {
                "AlertId": null,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.PatientID||0,
                "StartDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "EndDate": "",
                "PriorityId": 0,
                "PriorityName": "",
                "AlertTagId": 0,
                "AlertTagName": "",
                "AlertMessage": "",
                "StatusId": 1,
                "Status": "Active",
                "UserId": $scope.UserId,
                "DeleteInd": "N",
                "AlertTypesList": [],
                "AlertNoteTypeId": 0,
                "AlertNoteName": "",

            };
        }
        $scope.AlertObj = GetAlertData();
        function getSelectedPatientData() {
            var obj = {
                "CreateAlert": 2,
                "IsShowAlert": false,
            }
            return obj;
        };
        $scope.PatientSearchdata = getSelectedPatientData();

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
        // onloadevents calling  and assinging 



        function OnloadAlluserlist() {
            $scope.allUserList = $scope.allUserList || [];
            if ($scope.allUserList.length > 0) {
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
                                $scope.allUserList = response.rows || [];
                                $scope.OnlyNusrseAnesthetistRoles = [];
                                $scope.OnlyNusrseAnesthetistRoles = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 25);

                                $scope.CheckinChecklistArray = [];
                                $scope.CheckinChecklistArray = $scope.OnlyNusrseAnesthetistRoles;
                                $scope.mainPatientProfileObj.AllUsersList = response.rows || [];
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
        $scope.getOrganizationBillingProviderList = function () {
            $scope.HospitalIds = $scope.AllBranchesList.map(branch => branch.ClinicId).filter(clinicId => clinicId !== 0).join(',');
            $scope.BillingProvidersList = [];
            var params = {
                "OrganizationId": $scope.HospitalId || 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "HospitalIds": $scope.HospitalIds || '',
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 20
            };
            eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    resp.data.rows = resp.data.rows || [];
                    $scope.TotalFacilityCount = resp.data.count || 0;
                    if (resp.data.rows.length > 0) {
                        $scope.BillingProvidersList = resp.data.rows || [];
                    }
                } else {
                    alertify.error(resp.data.Message);
                }

            });
        }

        //calling init 
        $scope.init = function () {
            OnloadAlluserlist();
            $scope.PatientAlerts = [];
            $scope.PatientAlertsList = [];
            $scope.allUserList = $scope.allUserList || [];
            $scope.MasterAlertNoteType = []; $scope.MasterAlertTag = []; $scope.MasterAlertTypes = []; $scope.MasterPriority = []; $scope.SetReminderArray = [];
            //var CurrentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            var CurrentDate = $filter('date')($scope.ApptConsultationDt, "yyyy-MM-dd");
            var obj = {
                "PatientId": $scope.PatientID,
                "OrganizationId": $scope.HospitalId,
                "UpcomingVisitsIndicator": true,
                "CurrentDate": CurrentDate,
                "AllBranchInd": "Y",
                "AppointmentStatusIds": "1,2,3,4,5,6,7,8,9,10,11",
            }
            var params = {
                "OrganizationId": $scope.HospitalId || 0,
                "FacilityName": ""
            }
            let PatientAlertobj = {
                "PatientId": $scope.PatientID,
                "OrganizationId": $scope.HospitalId,
                "StatusId": 1
            }
            var param1 = {
                /*"AppointmentId": $scope.appointmentid || 0,*/
                "AppointmentId": 0,
                "PatientId": $scope.PatientID || 0,
                "IsHistory": false
            }
            $q.all([
                eHnotePatientVisitReasonServices.GetPatientAppointmentVisitsById(obj),
                eHnotePatientAddressDataServices.GetAllDocumentType(),
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),
                eHnoteInsuranceService.GetPatientAlertsNew(PatientAlertobj),
                eHnoteSettingsDataService.GetPatientRelatedMasterData(),
                eHnoteMainAppointmentService.GetSetReminderDetails(param1),
            ]).then(function (resp) {
                if (resp[0].data.Status == "Success") {
                    $scope.UpcomingAppointmentsArray = resp[0].data.rows || [];
                    $scope.UpcomingAppointmentsCount = resp[0].data.count || 0;
                    $scope.mainPatientProfileObj.VisitId = 0;
                    if ($scope.UpcomingAppointmentsArray.length > 0) {
                        angular.forEach($scope.UpcomingAppointmentsArray, function (uitem) {
                            uitem.IsActive = false;

                            angular.forEach(uitem.VisitsArray, function (subitem) {
                                subitem.IsVisitSignedDone = false;
                                if (uitem.AppointmentTypeId == 1) {
                                    if (subitem.VisitStatus == 'D') {
                                        subitem.IsVisitSignedDone = true;
                                    }
                                } else if (uitem.AppointmentTypeId == 7 && uitem.StatusFlag == 'D') {
                                    subitem.IsVisitSignedDone = true;
                                } else {

                                }
                            });
                        });
                        $scope.UpcomingAppointmentsArray[0].IsActive = true;
                        if ($scope.UpcomingAppointmentsArray[0].VisitsArray.length > 0) {
                            $scope.UpcomingAppointmentsArray[0].VisitsArray[0].Isopen = true;
                            $scope.mainPatientProfileObj.VisitId = $scope.UpcomingAppointmentsArray[0].VisitsArray[0].VisitId;
                        }
                        $scope.mainPatientProfileObj.AppointmentId = $scope.UpcomingAppointmentsArray[0].AppointmentId;
                        $scope.mainPatientProfileObj.AppointmentDoctorId = $scope.UpcomingAppointmentsArray[0].AppointmentDoctorId;
                        $scope.mainPatientProfileObj.AppointmentTypeId = $scope.UpcomingAppointmentsArray[0].AppointmentTypeId || 0;
                        $scope.mainPatientProfileObj.AppointmentStatusId = $scope.UpcomingAppointmentsArray[0].AppointmentStatusId || 0;
                        $scope.mainPatientProfileObj.AppointmentVisitReasonName = $scope.UpcomingAppointmentsArray[0].AppointmentVisitReasonName || 0;
                        $scope.mainPatientProfileObj.StatusFlag = $scope.UpcomingAppointmentsArray[0].StatusFlag || '';
                        $scope.mainPatientProfileObj.AppointmentDate = $scope.UpcomingAppointmentsArray[0].AppointmentDate || '';
                        var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                        if (currentdate === $scope.mainPatientProfileObj.AppointmentDate) {
                            $scope.IsASCAppointmentToday = true;
                        } else {
                            $scope.IsASCAppointmentToday = false;
                        }
                        $scope.cacheStorageItem.SurgeryList = $scope.UpcomingAppointmentsArray[0].SurgeryList || [];
                        $scope.mainPatientProfileObj.SurgeryList = $scope.UpcomingAppointmentsArray[0].SurgeryList || [];
                        if (($scope.mainPatientProfileObj.AppointmentId != 0) && ($scope.mainPatientProfileObj.AppointmentTypeId === 4 || $scope.mainPatientProfileObj.AppointmentTypeId === 14 || $scope.mainPatientProfileObj.AppointmentTypeId === 7)) {
                            $scope.cacheStorageItem.AppointmentTypeId = $scope.mainPatientProfileObj.AppointmentTypeId || 0;
                            $scope.cacheStorageItem.AppointmentId = $scope.mainPatientProfileObj.AppointmentId || 0;
                            $scope.AddToCache();

                            let obj = {
                                "SubTab": ($scope.mainPatientProfileObj.AppointmentTypeId == 4 || $scope.mainPatientProfileObj.AppointmentTypeId == 14) ? 7 : 2,
                                "AppointmentTypeId": $scope.mainPatientProfileObj.AppointmentTypeId,
                                "AppointmentId": $scope.mainPatientProfileObj.AppointmentId,
                                /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                                "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                                "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                                "PatientID": $scope.PatientID || 0,
                            }
                            console.log("ASCAllvisits called4");
                            $scope.$broadcast("ASCAllvisits", obj);
                            datapersistanceFactory.set('ASCPastvisits', obj);
                        }
                    }
                    if ($scope.UpcomingAppointmentsArray.length > 0) {
                        //$scope.SelectedAppointmentObj = angular.copy($scope.UpcomingAppointmentsArray[0]);
                        angular.forEach($scope.UpcomingAppointmentsArray, function (vitem) {
                            if (vitem.AppointmentId == $scope.AppointmentID) {
                                vitem.QRCodeUrl = vitem.QRCodeUrl || '';
                                $scope.SelectedAppointmentObj = angular.copy(vitem);
                            }
                        });
                    }
                };
                if (resp[1].data.status == "Success") {
                    let obj;
                    angular.forEach(resp[1].data.NoteFilesTypes, function (item) {
                        obj = {
                            "Id": item.FileTypeId,
                            "Name": item.Filetype,
                            "IsChecked": true
                        };
                        $scope.DocumentTypeArray.push(obj);

                    });
                };
                if (resp[2].data.status == "Success") {
                    if (resp[2].data.MasterPriority.length > 0) {
                        $scope.MasterPriority = resp[2].data.MasterPriority || [];
                    };

                    //if (resp[2].data.MasterAlertTypes.length > 0) {
                    //    $scope.MasterAlertTypes = resp[2].data.MasterAlertTypes || [];
                    //    angular.forEach($scope.MasterAlertTypes, function (item) {
                    //        item.IsChecked = false;
                    //    });
                    //};

                    if (resp[2].data.MasterAlertTypes.length > 0) {
                        $scope.MasterAlertTypes = resp[2].data.MasterAlertTypes || [];
                        angular.forEach($scope.MasterAlertTypes, function (item) {
                            var object = {
                                'AlertDeatilId': 0,
                                'AlertId': 0,
                                'IsChecked': false,
                                'DeleteInd': 'N',
                                'AlertTypeId': item.AlertTypeId,
                                'AlertTypeName': item.AlertName,
                            }
                            $scope.AlertObj.AlertTypesList.push(object);
                        });

                    }

                    if (resp[2].data.MasterAlertTag.length > 0) {
                        $scope.MasterAlertTag = resp[2].data.MasterAlertTag || [];
                    };
                    if (resp[2].data.MasterAlertNoteType.length > 0) {
                        /*$scope.MasterAlertNoteType = resp[2].data.MasterAlertNoteType || [];*/
                        $scope.MasterAlertNoteType = $filter("filter")(resp[2].data.MasterAlertNoteType, function (item) {
                            return item.AlertNoteTypeId !== 6;
                        }) || [];
                    };
                    $scope.OrganizationClearingHouseDetails = resp[2].data.ConnectedClearingHouse || [];
                    if (resp[2].data.DepositTypes.length > 0) {
                        $scope.mainPatientProfileObj.DepositTypes = resp[2].data.DepositTypes || [];
                    };
                    if (resp[2].data.Cardtype.length > 0) {
                        $scope.mainPatientProfileObj.CardTypesData = resp[2].data.Cardtype || [];
                    };
                    if (resp[2].data.WriteOffReasons.length > 0) {
                        $scope.mainPatientProfileObj.WriteOffReasons = resp[2].data.WriteOffReasons || [];
                    };
                    if ($scope.MasterAlertNoteType.length > 0) {
                        $scope.AlertNoteTypeId = $scope.AlertNoteTypeId || 3;
                        if ($scope.AlertNoteTypeId !== 0) {
                            let Id = $scope.AlertNoteTypeId || 3;
                            var NotesTypes = $filter("filter")($scope.MasterAlertNoteType, { "AlertNoteTypeId": Id })[0] || {};
                            $scope.AlertObj.AlertNoteTypeId = NotesTypes.AlertNoteTypeId || 0;
                            $scope.AlertObj.AlertNoteName = NotesTypes.AlertNoteName || "";
                        }
                    };
                };
                if (resp[3].data.status === "Success") {
                    resp[3].data.rows = resp[3].data.rows || [];
                    if (resp[3].data.rows.length > 0) {
                        $scope.mainPatientProfileObj.OrganizationFacilityList = angular.copy(resp[3].data.rows);
                    }
                };
                if (resp[4].data.Status == "Success") {
                    if (resp[4].data.rows.length > 0) {
                        //$scope.PatientAlertsList = resp[4].data.rows || [];
                        $scope.PatientAlertsList = $filter('filter')(resp[4].data.rows, function (item) {
                            return item.NoteTypeId != 6;
                        }) || [];

                        let filterid = 0
                        if ($scope.parentProfileTab.IscheckinOutInd) {
                            filterid = 2
                        }
                        if (!$scope.parentProfileTab.IscheckinOutInd) {
                            filterid = 1
                        }

                        $scope.PatientAlerts = [];
                        if ($scope.PatientAlertsList.length > 0) {
                            angular.forEach($scope.PatientAlertsList, function (item) {
                                var counter = 0;
                                if (item.AlertData !== null) {
                                    if (item.AlertData.AlertTypesList.length > 0) {
                                        angular.forEach(item.AlertData.AlertTypesList, function (Bitem) {
                                            if (Bitem.AlertTypeId == filterid) {
                                                counter++;
                                            }
                                        })
                                    }
                                }
                                if (counter !== 0) {
                                    $scope.PatientAlerts.push(item);
                                }
                            });


                        }
                    }
                };
                if (resp[5].data.status === "Success") {
                   $scope.PatientMasterDataArray = resp[5].data.rows;
                   $scope.mainPatientProfileObj.AllMasterData = resp[5].data || {};
                   $scope.PatientSuffixList = resp[5].data.PatientSuffix;
                   $scope.PatientEthnicityList = resp[5].data.PatientEthnicity;
                   if ($scope.PatientEthnicityList.length > 0) {
                       angular.forEach($scope.PatientEthnicityList, function (kitem) {
                           kitem.IsSelected = false;
                           kitem.Id = 0;
                       });
                   }
                   $scope.PatientRaceList = resp[5].data.PatientRace;
                   if ($scope.PatientRaceList.length > 0) {
                       angular.forEach($scope.PatientRaceList, function (kitem) {
                           kitem.IsSelected = false;
                           kitem.Id = 0;
                       });
                   }

                   $scope.PatientSexualOrientationList = resp[5].data.PatientSexualOrientation;
                   $scope.PatientGenderIdentityList = resp[5].data.PatientGenderIdentity;
                   $scope.PatientNationalityList = resp[5].data.PatientNationality;
                   $scope.PatientLanguageList = resp[5].data.PatientLanguage;
                   $scope.InsuranceRelationShipList = resp[5].data.InsuranceRelationShip;
                   $scope.InsurancePlanTypeList = resp[5].data.InsurancePlanType;
                   $scope.PatientPrefixList = resp[5].data.PatientTitle;
                   $scope.PatientLanguageProficiencyList = resp[5].data.LanguageProficiency;
                   $scope.PatientLanguageExpressionList = resp[5].data.LanguageExpression;
                   $scope.PatientClassArray = resp[5].data.PatientClass;
                   $scope.InsuranceCoverageList = resp[5].data.CoverageArray;
                   $scope.InsuranceStatusList = resp[5].data.InsuranceStatus;
                   if (resp[5].data.TitleArray.length != 0) {
                       $scope.TitlesList = resp[5].data.TitleArray;
                       $scope.mainPatientProfileObj.TitlesList = $scope.TitlesList || [];
                       $scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
                       $scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;

                       $scope.FamilyInfo.FamilyArray[0].TitleId = $scope.TitlesList[0].Id || 1;
                       $scope.FamilyInfo.FamilyArray[0].Title = $scope.TitlesList[0].Name;
                   }
                   $scope.InsuranceStatusList1 = resp[5].data.InsuranceStatus;


                   $scope.CoverageList = resp[5].data.InsuranceIdentifierList || [];
                   if ($scope.CoverageList.length > 0) {
                       $scope.CoverageList = $filter("filter")($scope.CoverageList, function (item, index) { return item.IdentifierId !== 6 && item.IdentifierId !== 7 });
                   }

                   if (resp[5].data.HospitalEquipmentList.length > 0) {
                       angular.forEach(resp[5].data.HospitalEquipmentList, function (item) {
                           item.IsChecked = false;
                       });
                       $scope.HospitalEquipmentList = resp[5].data.HospitalEquipmentList;
                   }
                   if (resp[5].data.AppointmentTypes.length > 0) {
                       $scope.AppointmentTypes = resp[5].data.AppointmentTypes || [];
                   }

                };
                if (resp[6].data.status == "Success") {
                    $scope.SetReminderArray = angular.copy(resp[6].data.rows);
                }
            });
            //GetApptInsurancedetail();
            getPatientDepositAmountById();
            $scope.getOrganizationBillingProviderList();
        };
        $scope.init();

      

        $scope.changeFaxNumber = function (fitem) {
            debugger
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
        };


        $scope.SelectPatient = function (patientId) {
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var patientitem = data;

                    eHnoteMasterDataService.addpatientData(patientitem);
                    $scope.patientid = patientitem.Patient[0].PatientID;
                    $scope.MasterPatientId = patientitem.Patient[0].MasterPatientId;
                    $scope.PatientFullName = patientitem.Patient[0].FullName;
                    $scope.PatientDisplayID = patientitem.Patient[0].PatientDisplayId;
                    $scope.DOB = patientitem.Patient[0].DOB;
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
                    $scope.PatientDetailsInfo.PCPDoctorName = patientitem.Patient[0].PCPDoctorName;
                    $scope.PatientDetailsInfo.ReferralName = patientitem.Patient[0].ReferralName;
                    $scope.PatientDetailsInfo.ExternalComanagerId = patientitem.Patient[0].ExternalComanagerId;
                    $scope.PatientDetailsInfo.InternalComanagerId = patientitem.Patient[0].InternalComanagerId;
                    $scope.PatientDetailsInfo.ExternalComanagerName = patientitem.Patient[0].ExternalComanagerName;
                    $scope.PatientDetailsInfo.InternalComanagerName = patientitem.Patient[0].InternalComanagerName;

                    patientitem.Patient[0].FaxNumber = patientitem.Patient[0].FaxNumber || "";
                    if (patientitem.Patient[0].FaxNumber != "") {
                        $scope.changeFaxNumber(patientitem.Patient[0].FaxNumber);
                    } else {
                        $scope.PatientDetailsInfo.FaxNumber = "";
                        $scope.PatientDetailsInfo.FaxAreacode = "";
                        $scope.PatientDetailsInfo.FaxHomeNumber = "";
                    }


                    $scope.PatientDetailsInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;
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
                    $scope.PatientDetailsInfo.EmailId = patientitem.Patient[0].EmailId || "";
                    //$scope.PatientDetailsInfo.FaxNumber = patientitem.Patient[0].FaxNumber || "";

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
                    $scope.PatientDetailsInfo.AdditionalInfo = patientitem.Patient[0].AdditionalInfo;
                   
                    $scope.PatientDetailsInfo.patientInsuranceDetails = patientitem.patientInsuranceDetails||[];
                    if ($scope.PatientDetailsInfo.AdditionalInfo != undefined) {
                        $scope.PatientDetailsInfo.LanguageName = $scope.PatientDetailsInfo.AdditionalInfo.LanguageName || "";
                        $scope.PatientDetailsInfo.SexualOrientation = $scope.PatientDetailsInfo.AdditionalInfo.SexualOrientation || "";
                        $scope.PatientDetailsInfo.Proficiency = $scope.PatientDetailsInfo.AdditionalInfo.Proficiency || "";
                        $scope.PatientDetailsInfo.GenderIdentityStatus = $scope.PatientDetailsInfo.AdditionalInfo.GenderIdentity || "";
                    }else {
                        $scope.PatientDetailsInfo.LanguageName = "";
                        $scope.PatientDetailsInfo.SexualOrientation = "";
                        $scope.PatientDetailsInfo.Proficiency = "";
                        $scope.PatientDetailsInfo.GenderIdentityStatus = "";
                    }
                    if (patientitem.Patient[0].AdditionalInfo != undefined) {
                        $scope.PatientDetailsInfo.PCP = patientitem.Patient[0].AdditionalInfo.PCP || 0;
                        $scope.PatientDetailsInfo.Referral= patientitem.Patient[0].AdditionalInfo.Referral || 0;
                    }
                    $scope.PatientDetailsInfo.PatientEthnicity = patientitem.PatientEthnicity;
                    $scope.PatientDetailsInfo.PatientRace = patientitem.PatientRace;
                    $scope.PatientDetailsInfo.PatientLanguage = patientitem.PatientLanguage;
                    // insurance 
                    $scope.PatientInsuranceSummary = [];
                    if (patientitem.patientInsuranceDetails.length > 0) {
                        angular.forEach(patientitem.patientInsuranceDetails, function (initem) {
                            var objectinsurance = {
                                "CoverageId": initem.CoverageId,
                                "CoverageName": initem.CoverageName || "",
                                "CoverageObj": "",
                                "PatientInsuranceDetailId": initem.PatientInsuranceDetailId,
                                "PlanId": initem.PlanId || 0,
                                "PlanName": initem.PlanName || "",
                                "PlanObj": initem.PlanName || "",
                                "Payor": "",
                                "PayorName": initem.PayorName || "",
                                "PayorId": initem.PayorId || 0,
                                "OrganizationPayorId": initem.OrganizationPayorId,
                                "OrganizationPayorName": initem.OrganizationPayorName,
                                "PayorObj": initem.PayorName || "",
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
                                "GlobalPayorId": initem.EligibilityPayorId || "",
                                "StatusName": initem.StatusName || "",
                                "IdentifierName": initem.IdentifierName || "",
                                "PatientMiddleName": initem.PatientMiddleName || "",
                                "PatientSecondLastName": initem.PatientSecondLastName || "",
                                "PatientSuffix": initem.PatientSuffix || "",
                                "InsuredPersonSecondLastName": initem.InsuredPersonSecondLastName || "",
                                "InsuredPersonSuffix": initem.InsuredPersonSuffix || "",
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

                    //Address
                    $scope.PatientDetailsInfo.PostalAddress = patientitem.PatientAddress.PostalAddress || {};
                    $scope.PatientDetailsInfo.PermanentAddress = patientitem.PatientAddress.PermanentAddress || {};
                    $scope.PatientDetailsInfo.PermanentAddress.AddressId = patientitem.PatientAddress.PermanentAddress.AddressId || 0;
                    $scope.PatientDetailsInfo.PermanentAddress.AddressLine1 = patientitem.PatientAddress.PermanentAddress.AddressLine1 || "";
                    $scope.PatientDetailsInfo.PermanentAddress.AddressLine2 = patientitem.PatientAddress.PermanentAddress.AddressLine2 || "";
                    $scope.PatientDetailsInfo.PermanentAddress.ZipCode = patientitem.PatientAddress.PermanentAddress.ZipCode || "";
                    $scope.PatientDetailsInfo.PermanentAddress.CountyId = patientitem.PatientAddress.PermanentAddress.CountyId;
                    $scope.PatientDetailsInfo.PermanentAddress.CountyName = patientitem.PatientAddress.PermanentAddress.CountyName;
                    $scope.PatientDetailsInfo.PermanentAddress.CityName = patientitem.PatientAddress.PermanentAddress.CityName;
                    $scope.PatientDetailsInfo.PermanentAddress.CityId = patientitem.PatientAddress.PermanentAddress.CityId;
                    $scope.PatientDetailsInfo.PermanentAddress.StateName = patientitem.PatientAddress.PermanentAddress.StateName;
                    $scope.PatientDetailsInfo.PermanentAddress.StateId = patientitem.PatientAddress.PermanentAddress.StateId;
                    $scope.PatientDetailsInfo.PermanentAddress.CountryName = patientitem.PatientAddress.PermanentAddress.CountryName;
                    $scope.PatientDetailsInfo.PermanentAddress.CountryId = patientitem.PatientAddress.PermanentAddress.CountryId;
                    $scope.PatientDetailsInfo.PermanentAddress.StateCode = patientitem.PatientAddress.PermanentAddress.StateCode;

                    $scope.PatientDetailsInfo.PostalAddress.AddressId = patientitem.PatientAddress.PostalAddress.AddressId || 0;
                    $scope.PatientDetailsInfo.PostalAddress.AddressLine1 = patientitem.PatientAddress.PostalAddress.AddressLine1 || "";
                    $scope.PatientDetailsInfo.PostalAddress.AddressLine2 = patientitem.PatientAddress.PostalAddress.AddressLine2 || "";
                    $scope.PatientDetailsInfo.PostalAddress.ZipCode = patientitem.PatientAddress.PostalAddress.ZipCode || "";
                    $scope.PatientDetailsInfo.PostalAddress.CountyId = patientitem.PatientAddress.PostalAddress.CountyId;
                    $scope.PatientDetailsInfo.PostalAddress.CountyName = patientitem.PatientAddress.PostalAddress.CountyName;
                    $scope.PatientDetailsInfo.PostalAddress.CityName = patientitem.PatientAddress.PostalAddress.CityName;
                    $scope.PatientDetailsInfo.PostalAddress.CityId = patientitem.PatientAddress.PostalAddress.CityId;
                    $scope.PatientDetailsInfo.PostalAddress.StateName = patientitem.PatientAddress.PostalAddress.StateName;
                    $scope.PatientDetailsInfo.PostalAddress.StateId = patientitem.PatientAddress.PostalAddress.StateId;
                    $scope.PatientDetailsInfo.PostalAddress.CountryName = patientitem.PatientAddress.PostalAddress.CountryName;
                    $scope.PatientDetailsInfo.PostalAddress.CountryId = patientitem.PatientAddress.PostalAddress.CountryId;
                    $scope.PatientDetailsInfo.PatientAddressDocuments = patientitem.PatientAddress.PatientAddressDocuments || [];
                    $scope.PatientDetailsInfo.PostalAddress.StateCode = patientitem.PatientAddress.PostalAddress.StateCode;

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
                    //
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
                    } else {
                        $scope.FamilyInfo = GetFamilyInfo();
                        $scope.FamilySummary = [];
                    }

                    $scope.mainPatientProfileObj.FamilySummary = angular.copy($scope.FamilySummary);
                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        };

        $scope.SelectPatient($scope.PatientID);
        $scope.RefreshProfile = function () {
            $scope.init();
        };
        $scope.allupcomingtabchnage = function (tabtype) {
            $scope.CheckInsubTabObj.AppointmentTab = tabtype || "";
            var VisitsIndicator = false;
            if (tabtype == 'All') {
                VisitsIndicator = false;
            }
            if (tabtype == 'Upcoming') {
                VisitsIndicator = true;
            }
            var CurrentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            var reqobj = {
                "PatientId": $scope.PatientID,
                "OrganizationId": $scope.HospitalId,
                "UpcomingVisitsIndicator": VisitsIndicator,
                "CurrentDate": CurrentDate,
                "AllBranchInd": "Y",
                "AppointmentStatusIds": "1,2,3,4,5,6,7,8,9,10,11",
            }
            eHnotePatientVisitReasonServices.GetPatientAppointmentVisitsById(reqobj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.mainPatientProfileObj.AppointmentId = 0;
                    $scope.mainPatientProfileObj.VisitId = 0;
                    $scope.mainPatientProfileObj.StatusFlag = '';
                    $scope.SelectedAppointmentObj = '';
                    if (tabtype == 'Upcoming') {

                        $scope.UpcomingAppointmentsArray = resp.data.rows || [];
                        $scope.UpcomingAppointmentsCount = resp.data.count || 0;
                        if ($scope.UpcomingAppointmentsArray.length > 0) {
                            angular.forEach($scope.UpcomingAppointmentsArray, function (uitem) {
                                angular.forEach(uitem.VisitsArray, function (subitem) {
                                    subitem.Isopen = false;
                                    subitem.IsVisitSignedDone = false;
                                    if (uitem.AppointmentTypeId == 1) {
                                        if (subitem.VisitStatus == 'D') {
                                            subitem.IsVisitSignedDone = true;
                                        }
                                    } else if (uitem.AppointmentTypeId == 7 && uitem.StatusFlag == 'D') {
                                        subitem.IsVisitSignedDone = true;
                                    } else {

                                    }
                                });
                                uitem.IsActive = false;
                            });
                            $scope.UpcomingAppointmentsArray[0].IsActive = true;
                            if ($scope.UpcomingAppointmentsArray[0].VisitsArray.length > 0) {
                                $scope.UpcomingAppointmentsArray[0].VisitsArray[0].Isopen = true;
                                $scope.ChartObj.DoctorId = $scope.UpcomingAppointmentsArray[0].VisitsArray[0].DoctorId || 0;
                            }
                            $scope.SelectedAppointmentObj = angular.copy($scope.UpcomingAppointmentsArray[0]);
                            $scope.SelectedAppointmentObj.QRCodeUrl = $scope.SelectedAppointmentObj.QRCodeUrl || '';
                            $scope.mainPatientProfileObj.AppointmentId = $scope.UpcomingAppointmentsArray[0].AppointmentId || 0;
                            $scope.mainPatientProfileObj.AppointmentDoctorId = $scope.UpcomingAppointmentsArray[0].AppointmentDoctorId;
                            $scope.mainPatientProfileObj.AppointmentVisitReasonName = $scope.UpcomingAppointmentsArray[0].AppointmentVisitReasonName || 0;
                            $scope.mainPatientProfileObj.AppointmentTypeId = $scope.UpcomingAppointmentsArray[0].AppointmentTypeId || 0;
                            $scope.mainPatientProfileObj.StatusFlag = $scope.UpcomingAppointmentsArray[0].StatusFlag || '';
                            $scope.mainPatientProfileObj.AppointmentDate = $scope.UpcomingAppointmentsArray[0].AppointmentDate || '';
                            var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                            if (currentdate === $scope.mainPatientProfileObj.AppointmentDate) {
                                $scope.IsASCAppointmentToday = true;
                            } else {
                                $scope.IsASCAppointmentToday = false;
                            }
                            $scope.mainPatientProfileObj.SurgeryList = $scope.UpcomingAppointmentsArray[0].SurgeryList || [];
                            $scope.ChartObj.AppointmentStatusId = $scope.UpcomingAppointmentsArray[0].AppointmentStatusId || '';
                            $scope.ChartObj.AppointmentStatus = $scope.UpcomingAppointmentsArray[0].AppointmentStatusName || '';
                            if ($scope.UpcomingAppointmentsArray[0].VisitsArray.length > 0) {
                                $scope.mainPatientProfileObj.VisitId = $scope.UpcomingAppointmentsArray[0].VisitsArray[0].VisitId || 0;
                            }
                            if ($scope.mainPatientProfileObj.AppointmentTypeId === 4 || $scope.mainPatientProfileObj.AppointmentTypeId === 14 || $scope.mainPatientProfileObj.AppointmentTypeId === 7) {
                                $scope.cacheStorageItem.AppointmentTypeId = $scope.mainPatientProfileObj.AppointmentTypeId || 0;
                                $scope.cacheStorageItem.AppointmentId = $scope.mainPatientProfileObj.AppointmentId || 0;
                                $scope.cacheStorageItem.SurgeryList = $scope.mainPatientProfileObj.SurgeryList || [];
                                $scope.AddToCache();
                                let obj = {
                                    "SubTab": ($scope.mainPatientProfileObj.AppointmentTypeId == 4 || $scope.mainPatientProfileObj.AppointmentTypeId == 14) ? 7 : 2,
                                    "AppointmentTypeId": $scope.mainPatientProfileObj.AppointmentTypeId,
                                    "AppointmentId": $scope.mainPatientProfileObj.AppointmentId,
                                    /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                                    "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                                    "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                                    "PatientID": $scope.PatientID || 0,
                                }
                                //$scope.$broadcast("ASCAllvisits", obj);
                                datapersistanceFactory.set('ASCPastvisits', obj);

                            }

                            //if ($scope.CheckInsubTabObj.MainTabId == 1) {
                            //    $scope.SelectedAppt($scope.UpcomingAppointmentsArray[0]);
                            //}
                        }

                    } else {
                        $scope.AllAppointmentsArray = resp.data.rows || [];
                        $scope.AllAppointmentsCount = resp.data.count || 0;
                        if ($scope.AllAppointmentsArray.length > 0) {//all
                            angular.forEach($scope.AllAppointmentsArray, function (uitem) {
                                angular.forEach(uitem.VisitsArray, function (subitem) {
                                    subitem.Isopen = false;
                                    subitem.IsVisitSignedDone = false;
                                    if (uitem.AppointmentTypeId == 1) {
                                        if (subitem.VisitStatus == 'D') {
                                            subitem.IsVisitSignedDone = true;
                                        }
                                    }
                                    else if (uitem.AppointmentTypeId == 7 && uitem.StatusFlag == 'D') {
                                        subitem.IsVisitSignedDone = true;
                                    } else {

                                    }
                                });
                                uitem.IsActive = false;
                            });
                            $scope.AllAppointmentsArray[0].IsActive = true;
                            if ($scope.AllAppointmentsArray[0].VisitsArray.length > 0) {
                                $scope.AllAppointmentsArray[0].VisitsArray[0].Isopen = true;
                                $scope.ChartObj.DoctorId = $scope.AllAppointmentsArray[0].VisitsArray[0].DoctorId || 0;
                            }
                            $scope.SelectedAppointmentObj = angular.copy($scope.AllAppointmentsArray[0]);
                            $scope.SelectedAppointmentObj.QRCodeUrl = $scope.SelectedAppointmentObj.QRCodeUrl || '';
                            $scope.mainPatientProfileObj.AppointmentId = $scope.AllAppointmentsArray[0].AppointmentId || 0;
                            $scope.mainPatientProfileObj.AppointmentDoctorId = $scope.AllAppointmentsArray[0].AppointmentDoctorId;
                            $scope.mainPatientProfileObj.AppointmentVisitReasonName = $scope.AllAppointmentsArray[0].AppointmentVisitReasonName || 0;
                            $scope.mainPatientProfileObj.AppointmentTypeId = $scope.AllAppointmentsArray[0].AppointmentTypeId || 0;
                            $scope.mainPatientProfileObj.StatusFlag = $scope.AllAppointmentsArray[0].StatusFlag || '';
                            $scope.mainPatientProfileObj.AppointmentDate = $scope.AllAppointmentsArray[0].AppointmentDate || '';
                            var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                            if (currentdate === $scope.mainPatientProfileObj.AppointmentDate) {
                                $scope.IsASCAppointmentToday = true;
                            } else {
                                $scope.IsASCAppointmentToday = false;
                            }
                            $scope.mainPatientProfileObj.SurgeryList = $scope.AllAppointmentsArray[0].SurgeryList || [];
                            $scope.ChartObj.AppointmentStatusId = $scope.AllAppointmentsArray[0].AppointmentStatusId || '';
                            $scope.ChartObj.AppointmentStatus = $scope.AllAppointmentsArray[0].AppointmentStatusName || '';
                            if ($scope.AllAppointmentsArray[0].VisitsArray.length > 0) {
                                $scope.mainPatientProfileObj.VisitId = $scope.AllAppointmentsArray[0].VisitsArray[0].VisitId || 0;
                            }
                            if ($scope.mainPatientProfileObj.AppointmentTypeId === 4 || $scope.mainPatientProfileObj.AppointmentTypeId === 14 || $scope.mainPatientProfileObj.AppointmentTypeId === 7) {
                                $scope.cacheStorageItem.AppointmentTypeId = $scope.mainPatientProfileObj.AppointmentTypeId || 0;
                                $scope.cacheStorageItem.AppointmentId = $scope.mainPatientProfileObj.AppointmentId || 0;
                                $scope.cacheStorageItem.SurgeryList = $scope.mainPatientProfileObj.SurgeryList || [];
                                $scope.AddToCache();
                                let obj = {
                                    "SubTab": ($scope.mainPatientProfileObj.AppointmentTypeId == 4 || $scope.mainPatientProfileObj.AppointmentTypeId == 14) ? 7 : 2,
                                    "AppointmentTypeId": $scope.mainPatientProfileObj.AppointmentTypeId,
                                    "AppointmentId": $scope.mainPatientProfileObj.AppointmentId,
                                    /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                                    "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                                    "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                                    "PatientID": $scope.PatientID || 0,
                                }
                                //$scope.$broadcast("ASCAllvisits", obj);
                                datapersistanceFactory.set('ASCPastvisits', obj);

                            }

                            //if ($scope.mainVisitObj.MainTab == 1) {
                            //    $scope.SelectedAppt($scope.AllAppointmentsArray[0]);
                            //}
                        }
                    }

                    if ($scope.mainPatientProfileObj.VisitId != 0) {
                        if ($scope.mainPatientProfileObj.AppointmentTypeId === 4 || $scope.mainPatientProfileObj.AppointmentTypeId === 14 || $scope.mainPatientProfileObj.AppointmentTypeId === 7) {
                            let obj = {
                                "SubTab": ($scope.mainPatientProfileObj.AppointmentTypeId == 4 || $scope.mainPatientProfileObj.AppointmentTypeId == 14) ? 7 : 2,
                                "AppointmentTypeId": $scope.mainPatientProfileObj.AppointmentTypeId || 0,
                                "AppointmentId": $scope.mainPatientProfileObj.AppointmentId || 0,
                                /* "AscAppointmentId": cacheStorageItem.AscAppointmentId,*/
                                "SurgeryList": $scope.cacheStorageItem.SurgeryList || [],
                                "PreAdmSurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || [],
                                "PatientID": $scope.PatientID || 0,
                            }
                            //$scope.$broadcast("ASCAllvisits", obj);
                            datapersistanceFactory.set('ASCPastvisits', obj);
                        }
                        //else if ($scope.mainVisitObj.MainTab == 2 || $scope.mainVisitObj.MainTab == 3) {
                        //    $scope.GetPatientVisithistroy();
                        //}
                    }


                }
            }, function (err) {

            });
        };
        function formatToAMPM(timeString) {
            if (!timeString) return null;

            // If the value is already a Date object, use it directly
            let dateObj;
            if (typeof timeString === "string") {
                // Convert string "12:00:00" into a proper Date object
                let [hours, minutes, seconds] = timeString.split(":").map(Number);
                dateObj = new Date();
                dateObj.setHours(hours, minutes, seconds);
            } else {
                dateObj = new Date(timeString);
            }

            // Return formatted time in AM/PM format
            return $filter('date')(dateObj, 'hh:mm a');
        };
        $scope.getpatientconsultationbyId = function () {
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
                if (resp.data !== undefined) {
                    $scope.treatmentData = resp.data;
                    $scope.treatmentArray = [];
                    angular.forEach(resp.data, function (plan) {
                        if ($scope.mainPatientProfileObj.VisitId === plan.VisitId) {
                            $scope.treatmentArray.push(plan);
                            $scope.StatusFlag = plan.StatusFlag || 'B';
                            var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                            if (currentdate === plan.AppointmentDt) {
                                $scope.IsAppointmentToday = true;
                            } else {
                                $scope.IsAppointmentToday = false;
                            }

                            $scope.cacheStorageItem.InvestigationsDetails = plan.InvestigationsDetails || "";
                            //Ros Overall Remarks

                            //Orders

                            //Orders
                            plan.InvestigationsDetails = plan.InvestigationsDetails || [];

                            if (plan.InvestigationsDetails.length > 0) {
                                plan.OrderDetails = plan.OrderDetails || [];


                                let orderDetailsMap = {};
                                if (plan.OrderDetails.length > 0) {

                                    angular.forEach(plan.OrderDetails, function (oitem) {
                                        orderDetailsMap[oitem.PatientOderId] = oitem;
                                    });
                                }

                                angular.forEach(plan.InvestigationsDetails, function (item) {
                                    item.OrderDate = item.OrderDate;
                                    item.InvestigationOrderDetail = {
                                        "PatientImageStudyId": 0
                                    };
                                    //if (plan.OrderDetails.length > 0) {
                                    //    item.InvestigationOrderDetail = orderDetailsMap[item.PatientOderId] || "";
                                    //}
                                });

                                angular.forEach(plan.InvestigationsDetails, function (item) {

                                    item.InvestigationOrderDetail = null;
                                    var TempOrderArray = $filter("filter")($scope.PatientOrderInterpretationList, { "PatientOrderId": item.PatientOrderId }, true) || [];
                                    var TempImgArray = $filter("filter")($scope.PatientImageStudyList, { "PatientOrderId": item.PatientOrderId }, true) || [];
                                    if (TempOrderArray.length > 0) {
                                        item.InvestigationOrderDetail = angular.copy(TempOrderArray[0]);
                                    } else {
                                        item.InvestigationOrderDetail = {
                                            "PatientImageStudyId": 0
                                        };
                                    }
                                    if (TempImgArray.length > 0) {
                                        var Responsedata = TempImgArray[0];
                                        item.InvestigationOrderDetail.DoctorName = Responsedata.DoctorName || "";
                                        item.InvestigationOrderDetail.TechnicianName = Responsedata.TechnicianName || "";
                                        item.InvestigationOrderDetail.AppointmentDate = Responsedata.AppointmentDate || "";
                                        item.InvestigationOrderDetail.SubmitInd = Responsedata.SubmitInd;
                                        item.InvestigationOrderDetail.DoctorNotes = Responsedata.DoctorNotes || "";
                                        item.InvestigationOrderDetail.TechnicianNotes = Responsedata.TechnicianNotes || "";
                                        item.InvestigationOrderDetail.InvestigationName = Responsedata.InvestigationName || "";
                                        item.InvestigationOrderDetail.ImageQuality = Responsedata.ImageQuality || "";
                                        item.InvestigationOrderDetail.ProviderRemarks = Responsedata.ProviderRemarks || "";
                                        item.InvestigationOrderDetail.TechnicianRemarks = Responsedata.TechnicianRemarks || "";
                                        item.InvestigationOrderDetail.IOLLensValue = Responsedata.IOLLensValue || "";
                                        item.InvestigationOrderDetail.IOLPowerValue = Responsedata.IOLPowerValue || "";
                                        item.InvestigationOrderDetail.FrequencyValue = Responsedata.FrequencyValue || "";
                                        item.InvestigationOrderDetail.FindingValue = Responsedata.FindingValue || "";
                                        item.InvestigationOrderDetail.K1Value = Responsedata.K1Value || "";
                                        item.InvestigationOrderDetail.K2Value = Responsedata.K2Value || "";
                                        item.InvestigationOrderDetail.CYLValue = Responsedata.CYLValue || "";
                                        item.InvestigationOrderDetail.LidsValue = Responsedata.LidsValue || "";
                                        item.InvestigationOrderDetail.ConjunctivaValue = Responsedata.ConjunctivaValue || "";
                                        item.InvestigationOrderDetail.ScleraValue = Responsedata.ScleraValue || "";
                                        item.InvestigationOrderDetail.CorneaValue = Responsedata.CorneaValue || "";
                                        item.InvestigationOrderDetail.EndothelialCellCountValue = Responsedata.EndothelialCellCountValue || "";
                                        item.InvestigationOrderDetail.CornealThicknessValue = Responsedata.CornealThicknessValue || "";
                                        item.InvestigationOrderDetail.EndothelialCellDensity = Responsedata.EndothelialCellDensity || "";
                                        //item.InvestigationOrderDetail.ModalityName = Responsedata.ModalityName || "";
                                        //item.InvestigationOrderDetail.ModalityId = Responsedata.ModalityId || 0;

                                        item.InvestigationOrderDetail.ODMacularFindingValue = Responsedata.ODMacularFindingValue || "";
                                        item.InvestigationOrderDetail.ODMacularThickNess = Responsedata.ODMacularThickNess || "";
                                        item.InvestigationOrderDetail.ODONfindingValue = Responsedata.ODONfindingValue || "";
                                        item.InvestigationOrderDetail.ODRHFLThickNess = Responsedata.ODRHFLThickNess || "";
                                        item.InvestigationOrderDetail.OSMacularFindingValue = Responsedata.OSMacularFindingValue || "";
                                        item.InvestigationOrderDetail.OSMacularThickNess = Responsedata.OSMacularThickNess || "";
                                        item.InvestigationOrderDetail.OSONfindingValue = Responsedata.OSONfindingValue || "";
                                        item.InvestigationOrderDetail.OSRHFLThickNess = Responsedata.OSRHFLThickNess || "";
                                        item.InvestigationOrderDetail.ODIOLLensValue = Responsedata.ODIOLLensValue || "";
                                        item.InvestigationOrderDetail.ODIOLPower = Responsedata.ODIOLPower || "";
                                        item.InvestigationOrderDetail.ODToricPower = Responsedata.ODToricPower || "";
                                        item.InvestigationOrderDetail.ODIOLManufacturer = Responsedata.ODIOLManufacturer || "";
                                        item.InvestigationOrderDetail.OSIOLLensValue = Responsedata.OSIOLLensValue || "";
                                        item.InvestigationOrderDetail.OSIOLPower = Responsedata.OSIOLPower || "";
                                        item.InvestigationOrderDetail.OSToricPower = Responsedata.OSToricPower || "";
                                        item.InvestigationOrderDetail.OSIOLManufacturer = Responsedata.OSIOLManufacturer || "";
                                        item.InvestigationOrderDetail.ODFrequenciesValue = Responsedata.ODFrequenciesValue || "";
                                        item.InvestigationOrderDetail.ODFindingValue = Responsedata.ODFindingValue || "";
                                        item.InvestigationOrderDetail.OSFrequenciesValue = Responsedata.OSFrequenciesValue || "";
                                        item.InvestigationOrderDetail.OSFindingValue = Responsedata.OSFindingValue || "";
                                        item.InvestigationOrderDetail.ODK1Value = Responsedata.ODK1Value || "";
                                        item.InvestigationOrderDetail.ODK2Value = Responsedata.ODK2Value || "";
                                        item.InvestigationOrderDetail.ODCYLValue = Responsedata.ODCYLValue || "";
                                        item.InvestigationOrderDetail.ODCornealThicknessValue = Responsedata.ODCornealThicknessValue || "";
                                        item.InvestigationOrderDetail.OSK1Value = Responsedata.OSK1Value || "";
                                        item.InvestigationOrderDetail.OSK2Value = Responsedata.OSK2Value || "";
                                        item.InvestigationOrderDetail.OSCYLValue = Responsedata.OSCYLValue || "";
                                        item.InvestigationOrderDetail.OSCornealThicknessValue = Responsedata.OSCornealThicknessValue || "";

                                        item.InvestigationOrderDetail.ODOCTMACFindings = Responsedata.ODOCTMACFindings || "";
                                        item.InvestigationOrderDetail.ODLidsValue = Responsedata.ODLidsValue || "";
                                        item.InvestigationOrderDetail.ODConjunctivaValue = Responsedata.ODConjunctivaValue || "";
                                        item.InvestigationOrderDetail.ODScleraValue = Responsedata.ODScleraValue || "";
                                        item.InvestigationOrderDetail.ODCorneaValue = Responsedata.ODCorneaValue || "";
                                        item.InvestigationOrderDetail.OSOCTMACFindings = Responsedata.OSOCTMACFindings || "";
                                        item.InvestigationOrderDetail.OSLidsValue = Responsedata.OSLidsValue || "";
                                        item.InvestigationOrderDetail.OSConjunctivaValue = Responsedata.OSConjunctivaValue || "";
                                        item.InvestigationOrderDetail.OSScleraValue = Responsedata.OSScleraValue || "";
                                        item.InvestigationOrderDetail.OSCorneaValue = Responsedata.OSCorneaValue || "";

                                        item.InvestigationOrderDetail.ODEndothelialCellCountValue = Responsedata.ODEndothelialCellCountValue || "";
                                        item.InvestigationOrderDetail.ODEndoCornealThicknessValue = Responsedata.ODEndoCornealThicknessValue || "";
                                        item.InvestigationOrderDetail.ODEndothelialCellDensity = Responsedata.ODEndothelialCellDensity || "";
                                        item.InvestigationOrderDetail.OSEndothelialCellCountValue = Responsedata.OSEndothelialCellCountValue || "";
                                        item.InvestigationOrderDetail.OSEndoCornealThicknessValue = Responsedata.OSEndoCornealThicknessValue || "";
                                        item.InvestigationOrderDetail.OSEndothelialCellDensity = Responsedata.OSEndothelialCellDensity || "";
                                        item.InvestigationOrderDetail.ODFixationLoss = Responsedata.ODFixationLoss || "";
                                        item.InvestigationOrderDetail.ODFalsePositiveErrors = Responsedata.ODFalsePositiveErrors || "";
                                        item.InvestigationOrderDetail.ODFalseNegitiveErrors = Responsedata.ODFalseNegitiveErrors || "";
                                        item.InvestigationOrderDetail.ODTDProbabilityPlot = Responsedata.ODTDProbabilityPlot || "";
                                        item.InvestigationOrderDetail.ODPDProbabilityPlot = Responsedata.ODPDProbabilityPlot || "";
                                        item.InvestigationOrderDetail.ODMeanDeviation = Responsedata.ODMeanDeviation || "";
                                        item.InvestigationOrderDetail.ODPatternStandardDeviation = Responsedata.ODPatternStandardDeviation || "";
                                        item.InvestigationOrderDetail.ODVisualFieldIndex = Responsedata.ODVisualFieldIndex || "";
                                        item.InvestigationOrderDetail.ODGHTValue = Responsedata.ODGHTValue || "";
                                        item.InvestigationOrderDetail.ODHVFFindingValue = Responsedata.ODHVFFindingValue || "";

                                        item.InvestigationOrderDetail.OSFixationLoss = Responsedata.OSFixationLoss || "";
                                        item.InvestigationOrderDetail.OSFalsePositiveErrors = Responsedata.OSFalsePositiveErrors || "";
                                        item.InvestigationOrderDetail.OSFalseNegitiveErrors = Responsedata.OSFalseNegitiveErrors || "";
                                        item.InvestigationOrderDetail.OSTDProbabilityPlot = Responsedata.OSTDProbabilityPlot || "";
                                        item.InvestigationOrderDetail.OSPDProbabilityPlot = Responsedata.OSPDProbabilityPlot || "";
                                        item.InvestigationOrderDetail.OSMeanDeviation = Responsedata.OSMeanDeviation || "";
                                        item.InvestigationOrderDetail.OSPatternStandardDeviation = Responsedata.OSPatternStandardDeviation || "";
                                        item.InvestigationOrderDetail.OSVisualFieldIndex = Responsedata.OSVisualFieldIndex || "";
                                        item.InvestigationOrderDetail.OSGHTValue = Responsedata.OSGHTValue || "";
                                        item.InvestigationOrderDetail.OSHVFFindingValue = Responsedata.OSHVFFindingValue || "";
                                        item.InvestigationOrderDetail.ODFundusFindingValue = Responsedata.ODFundusFindingValue || "";
                                        item.InvestigationOrderDetail.OSFundusFindingValue = Responsedata.OSFundusFindingValue || "";

                                        item.InvestigationOrderDetail.ODASOCTfindingValue = Responsedata.ODASOCTfindingValue || "";
                                        item.InvestigationOrderDetail.OSASOCTfindingValue = Responsedata.OSASOCTfindingValue || "";
                                        item.InvestigationOrderDetail.ODFAFindingValue = Responsedata.ODFAFindingValue || "";
                                        item.InvestigationOrderDetail.OSFAFindingValue = Responsedata.OSFAFindingValue || "";
                                        item.InvestigationOrderDetail.ODICGFindingValue = Responsedata.ODICGFindingValue || "";
                                        item.InvestigationOrderDetail.OSICGFindingValue = Responsedata.OSICGFindingValue || "";

                                        item.InvestigationOrderDetail.ImagestudyReviewedDate = Responsedata.ImagestudyReviewedDate || "";
                                        item.InvestigationOrderDetail.DiagnosisListArray = Responsedata.DiagnosisListArray || [];
                                        item.InvestigationOrderDetail.FundusFindingArray = Responsedata.FundusFindingArray || [];
                                        item.InvestigationOrderDetail.FAFindingArray = Responsedata.FAFindingArray || [];
                                        item.InvestigationOrderDetail.ICGFindingArray = Responsedata.ICGFindingArray || [];
                                        item.InvestigationOrderDetail.MacularFindingArray = Responsedata.MacularFindingArray || [];
                                        item.InvestigationOrderDetail.ONFindingArray = Responsedata.ONFindingArray || [];

                                        item.InvestigationOrderDetail.ODFAFindingObj = Responsedata.ODFAFindingObj || "";
                                        item.InvestigationOrderDetail.OSFAFindingObj = Responsedata.OSFAFindingObj || "";
                                        item.InvestigationOrderDetail.ODICGFindingObj = Responsedata.ODICGFindingObj || "";
                                        item.InvestigationOrderDetail.OSICGFindingObj = Responsedata.OSICGFindingObj || "";
                                        item.InvestigationOrderDetail.OSMaculaShowAddNewBtn = Responsedata.OSMaculaShowAddNewBtn;
                                        item.InvestigationOrderDetail.ODMaculaShowAddNewBtn = Responsedata.ODMaculaShowAddNewBtn;
                                        item.InvestigationOrderDetail.ODDiscShowAddNewBtn = Responsedata.ODDiscShowAddNewBtn;
                                        item.InvestigationOrderDetail.OSDiskShowAddNewBtn = Responsedata.OSDiskShowAddNewBtn;
                                        item.InvestigationOrderDetail.ODCorneaShowAddNewBtn = Responsedata.ODCorneaShowAddNewBtn;
                                        item.InvestigationOrderDetail.OSCorneaShowAddNewBtn = Responsedata.OSCorneaShowAddNewBtn;
                                        item.InvestigationOrderDetail.ODRetinaShowAddNewBtn = Responsedata.ODRetinaShowAddNewBtn;
                                        item.InvestigationOrderDetail.OSRetinaShowAddNewBtn = Responsedata.OSRetinaShowAddNewBtn;
                                        item.InvestigationOrderDetail.ODFAShowAddNewBtn = Responsedata.ODFAShowAddNewBtn;
                                        item.InvestigationOrderDetail.OSFAShowAddNewBtn = Responsedata.OSFAShowAddNewBtn;
                                        item.InvestigationOrderDetail.ODICGShowAddNewBtn = Responsedata.ODICGShowAddNewBtn;
                                        item.InvestigationOrderDetail.OSICGShowAddNewBtn = Responsedata.OSICGShowAddNewBtn;
                                        item.InvestigationOrderDetail.DoctorId = Responsedata.DoctorId || 0;
                                        item.InvestigationOrderDetail.SelectedDiagObj = Responsedata.SelectedDiagObj || [];
                                        item.InvestigationOrderDetail.OCTONFindings = Responsedata.OCTONFindings || "";
                                        item.InvestigationOrderDetail.InvestigationId = Responsedata.InvestigationId || 0;
                                        item.InvestigationOrderDetail.DoctorObj = Responsedata.DoctorObj || "";
                                        item.InvestigationOrderDetail.TechnicianId = Responsedata.TechnicianId || 0;
                                        item.InvestigationOrderDetail.TechnicianObj = Responsedata.TechnicianObj || "";



                                    }
                                });



                                $scope.cacheStorageItem.InvestigationsDetails = plan.InvestigationsDetails;
                            } else {
                                $scope.cacheStorageItem.InvestigationsDetails = [];
                            }




                            if (plan.ProceduresDetails !== undefined) {
                                if (plan.ProceduresDetails.length !== 0) {
                                    angular.forEach(plan.ProceduresDetails, function (item) {
                                        item.OrderDate = item.OrderDate;
                                    });
                                    $scope.cacheStorageItem.ProceduresDetails = plan.ProceduresDetails;
                                } else {
                                    $scope.cacheStorageItem.ProceduresDetails = [];
                                }
                            }

                            if (plan.SurgeriesDetails !== undefined) {
                                if (plan.SurgeriesDetails.length !== 0) {
                                    angular.forEach(plan.SurgeriesDetails, function (item) {
                                        item.OrderDate = item.OrderDate;
                                        item.OrderDetails = item.OrderDetails || [];
                                        if (item.OrderDetails.length > 0) {
                                            angular.forEach(item.OrderDetails, function (orditem) {
                                                orditem.ISSelectedOrderDetailItem = false;
                                                orditem.OrganId = orditem.OrganId || null;
                                                if (orditem.OrganId != null) {
                                                    orditem.OrganId = orditem.OrganId.toString();
                                                }
                                                orditem.DurationDate = orditem.DurationDate || null;
                                                orditem.DurationDate = $filter('date')(orditem.DurationDate, 'MM-dd-yyyy');
                                                orditem.PreAdmissionDate = $filter('date')(orditem.PreAdmissionDate, 'MM-dd-yyyy');
                                                orditem.AscAppointmentDate = $filter('date')(orditem.AscAppointmentDate, 'MM-dd-yyyy');
                                                orditem.FirstFollowupDate = $filter('date')(orditem.FirstFollowupDate, 'MM-dd-yyyy');
                                                orditem.SecondFollowupDate = $filter('date')(orditem.SecondFollowupDate, 'MM-dd-yyyy');
                                                orditem.ThirdFollowupDate = $filter('date')(orditem.ThirdFollowupDate, 'MM-dd-yyyy');
                                                orditem.FollowupDate = $filter('date')(orditem.FollowupDate, 'MM-dd-yyyy');


                                                orditem.AscAppointmentStartTime = orditem.AscAppointmentStartTime || null;
                                                if (orditem.AscAppointmentStartTime != null) {
                                                    orditem.AscAppointmentStartTime = formatToAMPM(orditem.AscAppointmentStartTime);
                                                }
                                                orditem.PreAdmissionStartTime = orditem.PreAdmissionStartTime || null;
                                                if (orditem.PreAdmissionStartTime != null) {
                                                    orditem.PreAdmissionStartTime = formatToAMPM(orditem.PreAdmissionStartTime);
                                                }
                                                orditem.FirstFollowupStartTime = orditem.FirstFollowupStartTime || null;
                                                if (orditem.FirstFollowupStartTime != null) {
                                                    orditem.FirstFollowupStartTime = formatToAMPM(orditem.FirstFollowupStartTime);
                                                }
                                                orditem.SecondFollowupStartTime = orditem.SecondFollowupStartTime || null;
                                                if (orditem.SecondFollowupStartTime != null) {
                                                    orditem.SecondFollowupStartTime = formatToAMPM(orditem.SecondFollowupStartTime);
                                                }
                                                orditem.ThirdFollowupStartTime = orditem.ThirdFollowupStartTime || null;
                                                if (orditem.ThirdFollowupStartTime != null) {
                                                    orditem.ThirdFollowupStartTime = formatToAMPM(orditem.ThirdFollowupStartTime);
                                                }
                                                if (orditem.DurationDate !== null) {
                                                    orditem.ShowDateFormat = true;
                                                } else {
                                                    orditem.ShowDateFormat = false;
                                                }





                                            });
                                        }
                                    });
                                    $scope.cacheStorageItem.SurgeriesDetails = plan.SurgeriesDetails;
                                } else {
                                    $scope.cacheStorageItem.SurgeriesDetails = [];
                                }
                            }
                            if (plan.ReferralDetails !== undefined) {
                                if (plan.ReferralDetails.length !== 0) {
                                    angular.forEach(plan.ReferralDetails, function (item) {
                                        item.OrderDate = item.OrderDate;
                                        item.Description = "Referral";
                                    });
                                    $scope.cacheStorageItem.ReferralDetails = plan.ReferralDetails;
                                } else {
                                    $scope.cacheStorageItem.ReferralDetails = [];
                                }
                            }

                            $scope.cacheStorageItem.RegisterPatientNotesArray = [];
                            plan.PatientNotesArray = plan.PatientNotesArray || [];
                            if (plan.PatientNotesArray.length > 0) {
                                angular.forEach(plan.PatientNotesArray, function (pitem) {
                                    if (pitem.AppointmentId == $scope.cacheStorageItem.appointmentid) {
                                        $scope.cacheStorageItem.RegisterPatientNotesArray.push(pitem);
                                    }
                                });
                            }

                            //AssessmentPlan
                            if (plan.AssessmentPlan !== undefined) {
                                if (plan.AssessmentPlan.length !== 0) {
                                    $scope.cacheStorageItem.AssessmentPlan = [];
                                    plan.AssessmentPlan.forEach(function (diag, index) {
                                        diag.ISAccordianshow = false;
                                        var OrganName = '';
                                        if (diag.OrganId == 1 || diag.OrganId == '1') {
                                            OrganName = "OD";
                                        }
                                        else if (diag.OrganId == 2 || diag.OrganId == '2') {
                                            OrganName = "OS";
                                        }
                                        else if (diag.OrganId == 3 || diag.OrganId == '3') {
                                            OrganName = "OD";
                                        }

                                        $scope.ProceduresArray = [];
                                        if (diag.ProceduresArray !== 0) {
                                            angular.forEach(diag.ProceduresArray, function (item) {

                                                var object = {
                                                    "PatientProcedureId": item.PatientProcedureId,
                                                    "SpecializationId": item.SpecializationId,
                                                    "ProcedureCode": item.ProcedureCode || "",
                                                    "OrgProcedureId": item.OrgProcedureId,
                                                    "ProcedureId": item.ProcedureId,
                                                    "ProcedureName": item.ProcedureName,
                                                    "CreatedDateTime": item.CreatedDateTime,
                                                    "ProceduredDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                                                    "OrganId": item.OrganId,
                                                    "OrganName": GetEyeName(item.OrganId,),
                                                    "ProcedureNotes": item.ProcedureNotes,
                                                    "DeleteInd": "N",
                                                    "StatusId": item.StatusId,
                                                    "Status": item.Status || '',
                                                    "BookingStatusId": item.BookingStatusId || "",
                                                    "Duration": item.Duration || 0,
                                                    "DurationType": item.DurationType || '',
                                                    "DurationDate": item.DurationDate || null,
                                                };
                                                $scope.ProceduresArray.push(object);
                                            });
                                        }

                                        if (diag.ProceduresArray != undefined && diag.ProceduresArray.length > 0) {  //13036
                                            diag.ProceduresArray = [];
                                            diag.ProceduresArray = angular.copy($scope.ProceduresArray);
                                        }

                                        diag.OrganName = OrganName;
                                        diag.ActiveInd = 'Y';
                                        diag.PlanOfcareNotesArray = diag.PlanOfcareNotesArray || [];
                                        diag.SurgeryArray = diag.SurgeryArray || [];
                                        diag.InvestigationsArray = diag.InvestigationsArray || [];
                                        diag.ProceduresArray = diag.ProceduresArray || [];
                                        diag.PrescriptionArray = diag.PrescriptionArray || [];

                                        if (diag.SnomedDescription != "") {
                                            diag.SnomedCodeObject = diag.SnomedDescription + " - " + diag.SnomedCode || "";
                                        }
                                        $scope.cacheStorageItem.AssessmentPlan.push(diag);

                                    });
                                }
                                else {
                                    $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                                }
                            } else {
                                $scope.cacheStorageItem.AssessmentPlan = $scope.cacheStorageItem.AssessmentPlan || [];
                            }
                            $scope.cacheStorageItem.ReturnToOfficeFollowupDetails = (plan.FollowUpDetails || []).map(item => ({
                                FollowUpDate: $filter("date")(item.FollowUpDate, "MM-dd-yyyy") || null,
                                FollowUpDuration: item.FollowUpDuration || "",
                                FollowUpId: item.FollowUpId || 0,
                                FollowUpDurationType: item.FollowUpDurationType || "D",
                                FollowUpNotes: item.FollowUpNotes || "",
                                FollowUpVisitreasonId: item.FollowUpVisitreasonId || 0,
                                FollowUpVisitReasonName: item.FollowUpVisitReasonName || "",
                                FollowupOnsetType: item.FollowupOnsetType || "",
                                VisitReasonObj: item.FollowUpVisitreasonId ? { ReasonId: item.FollowUpVisitreasonId, Reason: item.FollowUpVisitReasonName } : {},
                                ActiveInd: item.ActiveInd || 'Y',
                                DeleteInd: item.DeleteInd || 'N',
                                ShowDateFormat: item.FollowupOnsetType === "Date" || false,
                                IsAddtoRecall: item.IsAddtoRecall || false,
                                ReminderDate: item.ReminderDate || '',
                            }));

                        }
                    });

                    $scope.AddToCache();
                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        };

        $scope.NavToCheckInsubTab = function (tab) {
            $scope.CheckInsubTabObj.subtabId = tab;
            if (tab == 2) {
                $scope.GetAllPatientUploadsNew();
            }
            if (tab == 3) {
                $scope.GetPatientAppointmentConsentsById();
                $scope.getApptAdditionalDetails1();
            }
            if (tab == 4) {
                $scope.getPatientAlertsList();
            }
            if (tab == 5) {
                $scope.getpatientconsultationbyId();
            }
        };
        $scope.ChangeMainTab = function (tab) {
            $scope.CheckInsubTabObj.MainTabId = tab;
            if (tab == 1) { 
                $scope.allupcomingtabchnage('Upcoming');
            }
            if (tab == 2) {
                $scope.GetPcpreferenceApptdoctorsbyId();
            }
            
        };
        //$scope.ChangeMainTab(1);      
        // document tab code start
        $scope.navtoOpenVisitFileUploads = function (item) {

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/visitUploadFilesPopup.html",
                "backdrop": "static",
                "size": "lg",
                "windowClass": "zindexpopup",
                "keyboard": false,
                "resolve": {
                    "mainPatientProfileObj": function () { return $scope.mainPatientProfileObj; },
                    "doctorinfo": function () { return doctorinfo; },
                    "DocumentTypeArray": function () { return $scope.DocumentTypeArray; },
                    "UserAccessRights": function () { return $scope.UserAccessRights; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, mainPatientProfileObj, eHnoteMasterDataService, doctorinfo, DocumentTypeArray, $filter, eHnoteDiagnosisDataServices, UserAccessRights) {
                    let Edititem = item || '';
                    let MainObj = mainPatientProfileObj || '';
                    //let doctorinfo = doctorinfo
                    let PatientId = 0, AppointmentId = 0, VisitId = 0, PatientName = '';
                    $scope.DocumentTypeArray = DocumentTypeArray || [];
                    $scope.UserAccessRights = UserAccessRights || {};
                    if (MainObj != '') {
                        PatientId = MainObj.PatientId || 0
                        AppointmentId = MainObj.AppointmentId || 0
                        VisitId = MainObj.VisitId || 0
                        PatientName = MainObj.PatientDetailSummary.FullName || ''
                    }
                    $scope.PreviousUrl = "/op";
                    $scope.selectedApptDates = eHnoteMasterDataService.getSelectedCrmApptDates();

                    if ($scope.selectedApptDates.Screen != "") {
                        $scope.PreviousUrl = $scope.selectedApptDates.Screen;
                    }
                    $scope.GetFilesObj = function () {
                        return {

                            "UserID": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "PatientID": PatientId || 0,
                            "AppointmentID": AppointmentId || 0,
                            "VisitId": VisitId || 0,
                            "TreatmentPlanId": 0,
                            "PatientName": PatientName || "",
                            "Remarks": "",
                            "SignedDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                            "OrgConsentFormId": "",
                            "FileTypeId": "",
                            "IsPartiallyUploaded": "",
                            "LabTestId": "",
                            "ShowNewConsultation": "N",
                            "DocumentDetails": [],
                            "TempImagesArray": [],

                        };
                    };
                    $scope.FilesObj = angular.copy($scope.GetFilesObj());
                    $scope.GetLogObj = function () {
                        return {
                            "UserId": eHnoteMasterDataService.getLoginId() || null,
                            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null,
                            "AppointmentId": AppointmentId || null,
                            "PatientId": PatientId || null,
                            "LogArray": [],
                            "DocumentDetails": []
                        }
                    }
                    $scope.LogObj = $scope.GetLogObj();
                    if (Edititem != '') {
                        var IsUserEditDeleteReamrksAccess = Edititem.CreatedById == $scope.FilesObj.UserID ? true : false;

                        let obj = {
                            "DocumentID": Edititem.DocumentID,
                            "S3URL": Edititem.DocURL,

                            "DocumentName": Edititem.DocName || "",
                            "FileName": Edititem.FileName || "",
                            "DeleteInd": 'N',
                            "FileExt": Edititem.FileExt || "",
                            "Remarks": Edititem.Remarks || "",
                            "FileTypeId": Edititem.FileTypeId || 1,
                            "OrgConsentFormId": 0,
                            "SignedDate": Edititem.SignedDate || "",
                            "CreatedById": Edititem.CreatedById || 0,
                            "PatientId": Edititem.PatientId || 0,
                            "DisplayName": Edititem.DisplayName || "",
                            "Filetype": Edititem.Filetype || "",
                            "DoctorName": Edititem.DoctorName || "",
                            "IsUserEditDeleteReamrksAccess": IsUserEditDeleteReamrksAccess || false,

                        }
                        $scope.FilesObj.TempImagesArray.push(obj);
                    }
                    $scope.SelectedFile = 1;
                    $scope.file = null;
                    $scope.selectedImgs = function (files) {

                        files = files || [];
                        if (files.length > 0) {
                            angular.forEach(files, function (item) {
                                files = item || [];
                                $scope.file = item;
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
                                        "FileTypeId": parseInt($scope.SelectedFile),
                                        "S3URL": "",
                                        "Remarks": "",
                                        "IsEdit": true,
                                        /* "DeleteInd": false, Db Side Adding as String So Chnaged This*/
                                        "DeleteInd": "N",
                                        "IsShowEditDeleteInd": true,
                                        "DocumentID": 0,
                                        "DisplayName": $scope.file.name || "",
                                        "FileName": $scope.file.name || "",
                                        "DocumentExt": $scope.file.type,
                                        "FileExt": $scope.file.type,
                                        "IsUserEditDeleteReamrksAccess": true
                                    };

                                    $scope.FilesObj.TempImagesArray.push(obj);


                                    angular.element("input[type='file']").val(null);
                                }
                            });
                        }
                        //    $scope.IsDisabled = false;
                    };
                    $scope.ChangeDocumentType = function () {
                        angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                            item.DocumentID = item.DocumentID || 0;
                            if (item.DocumentID == 0) {
                                item.FileTypeId = parseInt($scope.SelectedFile);
                            }
                        });
                    }
                    $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
                        if (item.DocumentID == 0) {
                            $scope.FilesObj.TempImagesArray.splice(index, 1);
                            alertify.success("File deleted successfully");

                        } else {
                            if ($scope.PreviousUrl === '/op') {
                                if (!$scope.UserAccessRights.AllAccessRights.OPFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                                    // alertify.error("you dont have access,please contact manager");
                                    alertify.error("You do not have access. Please contact an administrator");
                                    return false;
                                } else {
                                    $scope.DeletePatientFilesByVisitId(item, index);
                                }
                            }


                            else if ($scope.PreviousUrl === '/crm') {
                                if (!$scope.UserAccessRights.AllAccessRights.CRMFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                                    // alertify.error("you dont have access,please contact manager");
                                    alertify.error("You do not have access. Please contact an administrator");
                                    return false;
                                } else {
                                    $scope.DeletePatientFilesByVisitId(item, index);
                                }
                            }
                            else if ($scope.PreviousUrl === 'ASC') {
                                if (!$scope.UserAccessRights.AllAccessRights.OPFileDelete && !item.IsUserEditDeleteReamrksAccess) {
                                    // alertify.error("you dont have access,please contact manager");
                                    alertify.error("You do not have access. Please contact an administrator");
                                    return false;
                                } else {
                                    $scope.DeletePatientFilesByVisitId(item, index);
                                }
                            }
                            /*item.DeleteInd = 'Y';*/

                        }
                    }

                    $scope.PatientFileUpload = function () {

                        var obj = {
                            "UserID": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "PatientID": PatientId || 0,
                            "PatientName": PatientName || '',
                            "AppointmentID": AppointmentId || 0,
                            "VisitId": VisitId || 0,
                            "TreatmentPlanId": 0,
                            "Remarks": "",
                            "SignedDate": $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd"),
                            "OrgConsentFormId": $scope.SelectedConsertFromId,
                            "FileTypeId": parseInt($scope.SelectedFile),
                            "IsPartiallyUploaded": "N",
                            "LabTestId": 0,
                            "ShowNewConsultation": "N",
                            "DocumentDetails": [],
                            "TempDocumentDetails": [],
                            "Logs": {}
                        };
                        $scope.LogObj.LogArray = [];
                        $scope.FilesObj.TempImagesArray = $scope.FilesObj.TempImagesArray || [];
                        if ($scope.FilesObj.TempImagesArray.length > 0) {
                            angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                                item.DocumentID = item.DocumentID || 0;

                                var object = {
                                    "file": item.file,
                                    "S3URL": item.S3URL || '',
                                    "FileTypeId": parseInt(item.FileTypeId),
                                    "Remarks": item.Remarks || '',
                                    "DeleteInd": item.DeleteInd,
                                    "DocumentID": item.DocumentID,
                                    "DisplayName": item.DisplayName,
                                    "FileName": item.FileName,
                                    "FileExt": item.FileExt,
                                };
                                if (item.DocumentID === 0) {
                                    obj.TempDocumentDetails.push(object);

                                }
                                else {
                                    obj.DocumentDetails.push(object);
                                }
                            });
                            //  here the documentid  =0 and  !=0 are pusing the DocumentDetails in loops  for the s3 url ganarating in api requirement 
                            angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                                item.DocumentID = item.DocumentID || 0;
                                var object = {
                                    "file": item.file,
                                    "S3URL": item.S3URL || '',
                                    "FileTypeId": parseInt($scope.SelectedFile),
                                    "Remarks": item.Remarks || '',
                                    "DeleteInd": item.DeleteInd,
                                    "DocumentID": item.DocumentID,
                                    "DisplayName": item.DisplayName,
                                    "FileName": item.FileName,
                                    "FileExt": item.FileExt,
                                };
                                if (item.DocumentID != 0) {
                                    // obj.DocumentDetails.push(object);
                                }
                            })
                        }


                        $scope.SelectedDate = $filter('date')($scope.FilesObj.SignedDate, "yyyy-MM-dd");
                        console.log(obj);


                        // Logs 
                        if (obj.DocumentDetails.length > 0) {

                            let EditingDocumentList = $filter('filter')(obj.DocumentDetails, function (item) {
                                return item.DocumentID != 0;
                            }) || [];
                            let AddingDocumentsList = $filter('filter')(obj.DocumentDetails, { 'DocumentID': 0 }, true) || [];
                            if (AddingDocumentsList.length > 0) {
                                angular.forEach(AddingDocumentsList, function (item) {
                                    let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': item.FileTypeId }, true);
                                    let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${AppointmentId}`;
                                    let logobj = {
                                        "LogId": 0,
                                        "ModuleId": 2,
                                        "ModuleName": "ASC  ",
                                        "SubModuleId": 24,
                                        "SubModuleName": "Documents",
                                        "ScreenType": "ASC List",
                                        "ActionType": "Imported",
                                        "ActionDescription": ActionDescription,
                                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                    };
                                    $scope.LogObj.LogArray.push(logobj);
                                });
                            }
                            if (EditingDocumentList.length > 0) {

                                let NewValue = EditingDocumentList || [];
                                let OldValue = $scope.LogObj.DocumentDetails || [];
                                NewValue.forEach(function (Newitem) {
                                    var differentItem = OldValue.filter(function (olditem) {
                                        olditem.Value = olditem.Value || "";
                                        return ((olditem.DocumentID == Newitem.DocumentID) && (olditem.FileTypeId == Newitem.FileTypeId) && (olditem.Remarks == Newitem.Remarks))
                                    }) || [];
                                    if (differentItem.length == 0) {
                                        let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': Newitem.FileTypeId }, true);
                                        let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${AppointmentId}`;
                                        let obj = {
                                            "LogId": 0,
                                            "ModuleId": 2,
                                            "ModuleName": "ASC",
                                            "SubModuleId": 24,
                                            "SubModuleName": "Documents",
                                            "ScreenType": "ASC List",
                                            "ActionType": "Edited",
                                            "ActionDescription": ActionDescription,
                                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                        };
                                        $scope.LogObj.LogArray.push(obj);
                                    }
                                });
                            }
                        }

                        obj.Logs = angular.copy($scope.LogObj);

                        eHnoteDiagnosisDataServices.AddPatientfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

                        function OnFilesObjMaterialSuccess(data) {
                            alertify.success("Image uploaded successfully");
                            $scope.FilesObj = angular.copy($scope.GetFilesObj());
                            $uibModalInstance.close("close");
                            $scope.IsDisabled = true;

                        }

                        function OnFilesObjMaterialError(data) {
                            console.log(data);
                            $scope.IsDisabled = false;
                        }
                    };


                    $scope.DeletePatientFilesByVisitId = function (sitem, index) {
                        let DeleteFileUploadArray = { "DocumentID": sitem.DocumentID, "FileName": sitem.FileName, "Remarks": "" };
                        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                            $scope.DeleteDate = sitem.SignedDate;
                            var params = {
                                "AppointmentID": sitem.AppointmentId,
                                "VisitId": sitem.VisitId,
                                "DeleteIndicator": 0,
                                "ImagesArray": [],
                                "UploadType": "Delete",
                                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                                "Remarks": "",
                                "Logs": {}
                            };
                            params.ImagesArray.push(DeleteFileUploadArray);
                            $scope.LogObj.LogArray = [];
                            let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': sitem.FileTypeId }, true);
                            let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${sitem.AppointmentId}`
                            if (params.ImagesArray.length > 0) {
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 24,
                                    "SubModuleName": "Documents",
                                    "ScreenType": "ASC List",
                                    "ActionType": "Deleted",
                                    "ActionDescription": ActionDescription,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                            params.Logs = angular.copy($scope.LogObj);
                            eHnoteDiagnosisDataServices.DeletePatientFilesByVisitId(params, onupdateDeletesuccess, onupdateDelerror);
                        }, function () { });
                        function onupdateDeletesuccess(response) {
                            if (response.Status === 'Success') {
                                alertify.success("File deleted successfully");
                                $scope.FilesObj.TempImagesArray.splice(index, 1);
                                //    $scope.GetAllPatientUploadsNew();
                            }
                        }
                        function onupdateDelerror(errordata) {
                            console.log(errordata);
                        }
                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.close("close");

                    };
                }
            });
            $scope.mInstanceAdd.result.then(function (result) {

                $scope.GetAllPatientUploadsNew();


            }, function (cancel) {
            });
        };
        $scope.GetLogObj = function () {
            return {
                "UserId": eHnoteMasterDataService.getLoginId() || null,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || null,
                "AppointmentId": $scope.AppointmentID || null,
                "PatientId": $scope.PatientID || null,
                "LogArray": [],
                "DocumentDetails": []
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        $scope.DeletePatientFilesByVisitId = function (sitem, index) {
            let DeleteFileUploadArray = { "DocumentID": sitem.DocumentID, "FileName": sitem.FileName, "Remarks": "" };
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                $scope.DeleteDate = sitem.SignedDate;
                var params = {
                    "AppointmentID": sitem.AppointmentId,
                    "VisitId": sitem.VisitId,
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": "",
                    "Logs": {}
                };
                params.ImagesArray.push(DeleteFileUploadArray);
                $scope.LogObj.LogArray = [];
                let filetypeobj = $filter('filter')($scope.DocumentTypeArray, { 'Id': sitem.FileTypeId }, true);
                let ActionDescription = `${filetypeobj[0].Name} Files in Documents  For Appointment ID: ${sitem.AppointmentId}`
                if (params.ImagesArray.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 24,
                        "SubModuleName": "Documents",
                        "ScreenType": "ASC List",
                        "ActionType": "Deleted",
                        "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
                params.Logs = angular.copy($scope.LogObj);
                eHnoteDiagnosisDataServices.DeletePatientFilesByVisitId(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    alertify.success("File deleted successfully");
                    $scope.GetAllPatientUploadsNew();
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }

        $scope.scanFilesForFilesTab = function () {
            var obj = {
                "PatientId": $scope.PatientID || null,
                "AppointmentId": $scope.AppointmentID || null,
                "PatientName": $scope.PatientFullName || '',
                "Tab": "FileUploads",
                "SignedDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                "FileTypeId": 1,
                "IsPartiallyUploaded": "Y",
                "TreatmentPlanId": 0,
                "ShowNewConsultation": "Y",
                "LabTestId": 0,
                "Remarks": '',
                "FileName": '',
                "DisplayName": '',
                "DocumentTypeArray": $scope.DocumentTypeArray || [],
                "VisitId": $scope.mainPatientProfileObj.VisitId || null,
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty--  ",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                $scope.GetAllPatientUploadsNew();
            }, function (cancel) {
            });

        };
        $scope.ClearDocfilters = function () {
            $scope.filterValueObj.Todate = $filter('date')(new Date(), 'MM-dd-yyyy'); // setting dates 
            var threeMonthsBack = new Date();
            threeMonthsBack.setMonth(threeMonthsBack.getMonth() - 3);
            $scope.filterValueObj.FromDate = $filter('date')(threeMonthsBack, 'MM-dd-yyyy');
            $scope.filterValueObj.Type = 'CreatedDate';
        }
        $scope.DocFilterbasedOnDates = function () {
            let FromDate = $filter('date')($scope.filterValueObj.FromDate, 'yyyy-MM-dd');
            let ToDate = $filter('date')($scope.filterValueObj.Todate, 'yyyy-MM-dd');
            var obj = {
                "PatientId": $scope.PatientID,
                "VisitId": $scope.mainPatientProfileObj.VisitId,
                "FileTypeId": null,
                "PageSize": 100,
                "PageNumber": $scope.FilescurrentPage || 1,
                "IsFilterEnabledInd": true,
                "FromDate": FromDate || null,
                "ToDate": ToDate || null,
            }
            eHnoteDiagnosisDataServices.GetPatientFileUploadsByVisitId(obj).then(function (resp) {
                $scope.PatientimageFile = resp.data.rows || [];
            });
        };
        $scope.PatientimageFile = [];
        $scope.GetAllPatientUploadsNew = function () {
            $scope.PatientimageFile = [];
            var obj = {
                "PatientId": $scope.PatientID,
                "VisitId": $scope.mainPatientProfileObj.VisitId,
                "FileTypeId": null,
                "PageSize": 100,
                "PageNumber": $scope.FilescurrentPage || 1,
            }
            eHnoteDiagnosisDataServices.GetPatientFileUploadsByVisitId(obj).then(function (resp) {
                $scope.PatientimageFile = resp.data.rows || [];
            });
        };

        //document tab code end

        // consents form tab start
        function reformAppointmentConsentsandOrgConsents(consentTemplateId) {
            $scope.consentsMainObj.MainConsents = [];



            var filteredOrgConsentTemplateArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "ConsentTemplateId": consentTemplateId }, true);
            if (filteredOrgConsentTemplateArray.length > 0) {


                if ($scope.consentsMainObj.PatientConsents.length === 0) {
                    angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                        var obj = getnewMainConsentObj();
                        obj.ConsentFormId = oitem.OrganisationConsentFormId;
                        obj.ConsentFormName = oitem.DocumentName;
                        obj.ConsentTemplateId = oitem.ConsentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.PDFcontent = oitem.PDFcontent || "";
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = false;
                        obj.IsProviderSignatureDone = false;
                        obj.ProviderUserId = 0;
                        obj.ProviderUserName = "";
                        obj.IsStaffSignatureDone = false;
                        obj.StaffUserId = 0;
                        obj.StaffUserName = "";
                        obj.IsCounselorSignatureDone = false;
                        obj.CounselorUserId = 0;
                        obj.CounselorUserName = "";
                        obj.IsAnesthesistSignatureDone = false;
                        obj.AnesthesistUserId = 0;
                        obj.AnesthesistUserName = "";
                        obj.IsGaurdianSignatureDone = false;
                        obj.GaurdianUserId = 0;
                        obj.GaurdianFirstName = "";
                        obj.GaurdianLastName = "";
                        obj.GaurdianRelationShipId = "";
                        obj.IsSelected = true;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });
                }
                else {
                    angular.forEach($scope.consentsMainObj.PatientConsents, function (item1) {
                        if (filteredOrgConsentTemplateArray[0].ConsentTemplateDetails.length > 0) {
                            angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (item2) {
                                if (item1.ConsentFormId === item2.OrganisationConsentFormId) {
                                    item2.isConsentAddedForPatient = true;
                                }
                            });
                        }

                    });


                    angular.forEach($scope.consentsMainObj.PatientConsents, function (oitem) {
                        var obj = getnewMainConsentObj();
                        obj.PatientConsentFormId = oitem.PatientConsentDocumentId;
                        obj.ConsentFormId = oitem.ConsentFormId;
                        obj.ConsentFormName = oitem.ConsentFormName;
                        obj.ConsentTemplateId = consentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.HTMLContent = oitem.HTMLContent;
                        obj.S3URL = oitem.S3URL;
                        obj.PDFcontent = oitem.HTMLContent;
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = oitem.IsPatientSignatureDone;
                        obj.IsProviderSignatureDone = oitem.IsProviderSignatureDone;
                        obj.ProviderUserId = oitem.ProviderUserId || 0;
                        obj.ProviderUserName = oitem.ProviderUserName || "";
                        obj.IsStaffSignatureDone = oitem.IsStaffSignatureDone;
                        obj.StaffUserId = oitem.StaffUserId || 0;
                        obj.StaffUserName = oitem.StaffUserName || "";
                        obj.IsCounselorSignatureDone = oitem.IsCounselorSignatureDone;
                        obj.CounselorUserId = oitem.CounselorUserId || 0;
                        obj.CounselorUserName = oitem.CounselorUserName || "";
                        obj.IsAnesthesistSignatureDone = oitem.IsAnesthesistSignatureDone;
                        obj.AnesthesistUserId = oitem.AnesthesistUserId || 0;
                        obj.AnesthesistUserName = oitem.AnesthesistUserName;
                        obj.IsGaurdianSignatureDone = oitem.IsGaurdianSignatureDone;
                        obj.GaurdianUserId = oitem.GaurdianUserId;
                        obj.GaurdianFirstName = oitem.GaurdianFirstName || "";
                        obj.GaurdianLastName = oitem.GaurdianLastName || "";
                        obj.GaurdianRelationShipId = oitem.GaurdianRelationShipId || 0;
                        obj.IsScannedDocument = oitem.IsScannedDocument;
                        obj.AppointmentId = oitem.AppointmentId;
                        obj.PatientId = oitem.PatientId;
                        obj.DocumentName = oitem.DocumentName;
                        obj.DeleteInd = oitem.DeleteInd || 'Y';
                        obj.PatientSignedDateTime = oitem.PatientSignedDateTime || "";
                        obj.ProviderSignedDateTime = oitem.ProviderSignedDateTime || "";
                        obj.StaffSignedDateTime = oitem.StaffSignedDateTime || "";
                        obj.CounselorSignedDateTime = oitem.CounselorSignedDateTime || "";
                        obj.AnesthesistSignedDateTime = oitem.AnesthesistSignedDateTime || "";
                        obj.GaurdianSignedDateTime = oitem.GaurdianSignedDateTime || "";
                        obj.PatientSignCaptureUserId = oitem.PatientSignCaptureUserId || 0;
                        obj.ProviderSignCaptureUserId = oitem.ProviderSignCaptureUserId || 0;
                        obj.StaffSignCaptureUserId = oitem.StaffSignCaptureUserId || 0;
                        obj.CounselorSignCaptureUserId = oitem.CounselorSignCaptureUserId || 0;
                        obj.AnesthesistSignCaptureUserId = oitem.AnesthesistSignCaptureUserId || 0;
                        obj.GaurdianSignCaptureUserId = oitem.GaurdianSignCaptureUserId || 0;
                        obj.IsSelected = true;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });

                    angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                        if (!oitem.isConsentAddedForPatient) {
                            var obj = getnewMainConsentObj();
                            obj.ConsentFormId = oitem.OrganisationConsentFormId;
                            obj.ConsentFormName = oitem.DocumentName;
                            obj.ConsentTemplateId = oitem.ConsentTemplateId;
                            obj.ConsentTypeId = oitem.ConsentTypeId;
                            obj.ConsentTypeName = oitem.ConsentTypeName;
                            obj.PDFcontent = oitem.PDFcontent;
                            obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                            obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                            obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                            obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                            obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                            obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                            obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                            obj.IsPatientSignatureDone = false;
                            obj.IsProviderSignatureDone = false;
                            obj.ProviderUserId = 0;
                            obj.ProviderUserName = "";
                            obj.IsStaffSignatureDone = false;
                            obj.StaffUserId = 0;
                            obj.StaffUserName = "";
                            obj.IsCounselorSignatureDone = false;
                            obj.CounselorUserId = 0;
                            obj.CounselorUserName = "";
                            obj.IsAnesthesistSignatureDone = false;
                            obj.AnesthesistUserId = 0;
                            obj.AnesthesistUserName = "";
                            obj.IsGaurdianSignatureDone = false;
                            obj.GaurdianUserId = 0;
                            obj.GaurdianFirstName = "";
                            obj.GaurdianLastName = "";
                            obj.GaurdianRelationShipId = "";
                            obj.IsScannedDocument = false;
                            obj.DeleteInd = oitem.DeleteInd || 'N';
                            obj.IsSelected = true;
                            $scope.consentsMainObj.MainConsents.push(obj);
                        }

                    });
                }


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


                    if (!item.IsDoctorSignRequired) {
                        item.ProviderClass = 'disabled';
                    } else {
                        if (item.IsProviderSignatureDone) {
                            item.ProviderClass = 'complete';
                        } else {
                            item.ProviderClass = 'incomplete';
                        }
                    }


                    if (!item.IsStaffSignRequired) {
                        item.StaffClass = 'disabled';
                    } else {
                        if (item.IsStaffSignatureDone) {
                            item.StaffClass = 'complete';
                        } else {
                            item.StaffClass = 'incomplete';
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


                    if (!item.IsAnesthesistSignRequired) {
                        item.AnesthesistClass = 'disabled';
                    } else {
                        if (item.IsAnesthesistSignatureDone) {
                            item.AnesthesistClass = 'complete';
                        } else {
                            item.AnesthesistClass = 'incomplete';
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
                    item.CanShowPrintButton =
                        (
                            item.PatientConsentFormId > 0 &&
                        (item.PatientClass !== 'incomplete' || item.GaurdianClass !== 'incomplete') &&
                            item.ProviderClass !== 'incomplete' &&
                            item.StaffClass !== 'incomplete' &&
                            item.AnesthesistClass !== 'incomplete' &&
                            item.CounselorClass !== 'incomplete'
                        ) ||
                        (item.S3URL && item.S3URL.trim() !== '');
                    item.CanBulksignconsent = item.ProviderClass == 'incomplete' || item.AnesthesistClass == 'incomplete';
                    //&&
                    if (item.CanBulksignconsent) {
                        $scope.IsshowBulkSignrefreshButton = true;
                    }

                });
            }


        }

        $scope.GetPatientAppointmentConsentsById = function () {
            $scope.consentsMainObj.MainConsents = [];
            $scope.consentsMainObj.OrganizationConsents = [];
            $scope.consentsMainObj.PatientConsents = [];

            console.log($scope.SelectedAppointmentObj);

            var serviceTypeId = $scope.SelectedAppointmentObj.AppointmentVisitReasonId || 0;
            var ApptType = "";
            if ($scope.appointmentinfo.AppointmentTypeId === 7) {
                serviceTypeId = 0;
                ApptType = "PreOp";
            }
          

            var obj = {
                "OrganizationId": $scope.SelectedAppointmentObj.OrganizationId,
                /*"OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
                "PatientId": $scope.mainPatientProfileObj.PatientId,
                "AppointmentId": $scope.mainPatientProfileObj.AppointmentId,
                "ServiceTypeId": serviceTypeId,
                "AppointmentType": ApptType,
                "VisitId": $scope.mainPatientProfileObj.VisitId

            };

            eHnoteSettingsDataService.GetPatientAppointmentConsentsById(obj).then(function (resp) {


                resp.data.OrganizationConsents = resp.data.OrganizationConsents || [];
                if (resp.data.OrganizationConsents.length > 0) {
                    $scope.consentsMainObj.OrganizationConsents = resp.data.OrganizationConsents;
                    angular.forEach($scope.consentsMainObj.OrganizationConsents, function (oitem) {
                        oitem.isConsentAddedForPatient = false;
                    });
                };

                resp.data.PatientAppointmentConsents = resp.data.PatientAppointmentConsents || [];
                var filteredArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "IsPrimary": "Y" }, true);
                if (resp.data.PatientAppointmentConsents.length > 0) {
                    $scope.consentsMainObj.PatientConsents = resp.data.PatientAppointmentConsents;
                    if ($scope.consentsMainObj.PatientConsents.length > 0) {
                        angular.forEach($scope.consentsMainObj.PatientConsents, function (n) {
                            n.PatientSignedDateTime = n.PatientSignedDateTime || '';
                            if (n.PatientSignedDateTime != '') {
                                n.PatientSignedDateTime = angular.copy($filter('date')(new Date(n.PatientSignedDateTime), 'MM-dd-yyyy hh:mm a') || "");
                            }
                        })
                    }
                    $scope.consentsMainObj.SelectedConsentTemplateId = $scope.consentsMainObj.PatientConsents[0].ConsentTemplateId || 0;
                    if ($scope.consentsMainObj.SelectedConsentTemplateId === 0) {
                        if (filteredArray.length > 0) {
                            $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                        }
                    }
                    reformAppointmentConsentsandOrgConsents($scope.consentsMainObj.SelectedConsentTemplateId);
                } else {

                    if (filteredArray.length > 0) {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                        reformAppointmentConsentsandOrgConsents($scope.consentsMainObj.SelectedConsentTemplateId);
                    }
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.getApptAdditionalDetails1 = function () {

            var AppointmentId = $scope.mainPatientProfileObj.AppointmentId
            // "PatientId": $scope.patientid

            eHnoteMainAppointmentService.getAdditionalApptDetailsById(AppointmentId).then(function (resp) {
                resp.data = resp.data || [];
                $scope.AppointmentTypeId = resp.data[0].Patient.AppointmentTypeId || 0;
                $scope.cacheStorageItem.AppointmentId = resp.data[0].Patient.AppointmentId || 0;
                if (resp.data.length > 0) {

                    $scope.parentProfileTab.AppointmentAdditionalDetails = resp.data[0];
                    $scope.parentProfileTab.AppointmentAdditionalDetails.VisitId = $scope.mainPatientProfileObj.VisitId || 0;
                    $scope.AppointmentNotesArray = resp.data[0].AppointmentNotes;
                    if ($scope.AppointmentNotesArray.length > 0) {
                        var count = 0
                        $scope.IsshowNotes = false;
                        angular.forEach($scope.AppointmentNotesArray, function (aitem) {
                            if (aitem.Notes !== '') {
                                aitem.IsNotes = true;
                                count++;
                            }
                            else {
                                aitem.IsNotes = false;
                            }
                        });
                        if (count > 0) {
                            $scope.IsshowNotes = true;
                        }
                    }
                    $scope.SelectedAppointmentObj.PaymentTypeId = resp.data[0].PaymentTypeId;
                    console.log(resp.data);
                } else {
                    $scope.AppointmentNotesArray = [];
                }
                $scope.AddToCache();
            }, function (err) {
                console.log(err);
                alertify.error("Getting data failed");
            });
        };
        function getnewMainConsentObj() {
            var obj = {
                "PatientConsentFormId": 0,
                "IsPartiallySaved": false,
                "HTMLContent": "",
                "S3URL": "",
                "ConsentFormId": 0,
                "ConsentFormName": "",
                "ConsentTemplateId": 0,
                "ConsentTypeId": 0,
                "ConsentTypeName": "",
                "PDFcontent": "",
                "IsPatientSignRequired": false,
                "IsDoctorSignRequired": false,
                "IsAnesthesistSignRequired": false,
                "IsCounselorSignRequired": false,
                "IsStaffSignRequired": false,
                "IsGuardianSignRequired": false,
                "IsSignRequiredForEachVisit": false,
                "IsPatientSignatureDone": "",
                "IsProviderSignatureDone": "",
                "ProviderUserId": 0,
                "ProviderUserName": "",
                "IsStaffSignatureDone": "",
                "StaffUserId": 0,
                "StaffUserName": "",
                "IsCounselorSignatureDone": "",
                "CounselorUserId": 0,
                "CounselorUserName": "",
                "IsAnesthesistSignatureDone": "",
                "AnesthesistUserId": 0,
                "AnesthesistUserName": "",
                "IsGaurdianSignatureDone": "",
                "GaurdianUserId": 0,
                "GaurdianFirstName": "",
                "GaurdianLastName": "",
                "GaurdianRelationShipId": "",
                "PatientClass": "disabled",
                "ProviderClass": "disabled",
                "StaffClass": "disabled",
                "AnesthesistClass": "disabled",
                "CounselorClass": "disabled",
                "GaurdianClass": "disabled",
                "IsSelected": false,
                "PatientSignedDateTime": "",
                "ProviderSignedDateTime": "",
                "StaffSignedDateTime": "",
                "CounselorSignedDateTime": "",
                "AnesthesistSignedDateTime": "",
                "GaurdianSignedDateTime": "",
                "PatientSignCaptureUserId": 0,
                "ProviderSignCaptureUserId": 0,
                "StaffSignCaptureUserId": 0,
                "CounselorSignCaptureUserId": 0,
                "AnesthesistSignCaptureUserId": 0,
                "GaurdianSignCaptureUserId": 0
            };
            return obj;
        }

        function reformAppointmentConsentsandOrgConsents(consentTemplateId) {
            $scope.consentsMainObj.MainConsents = [];



            var filteredOrgConsentTemplateArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "ConsentTemplateId": consentTemplateId }, true);
            if (filteredOrgConsentTemplateArray.length > 0) {


                if ($scope.consentsMainObj.PatientConsents.length === 0) {
                    angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                        var obj = getnewMainConsentObj();
                        obj.ConsentFormId = oitem.OrganisationConsentFormId;
                        obj.ConsentFormName = oitem.DocumentName;
                        obj.ConsentTemplateId = oitem.ConsentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.PDFcontent = oitem.PDFcontent || "";
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = false;
                        obj.IsProviderSignatureDone = false;
                        obj.ProviderUserId = 0;
                        obj.ProviderUserName = "";
                        obj.IsStaffSignatureDone = false;
                        obj.StaffUserId = 0;
                        obj.StaffUserName = "";
                        obj.IsCounselorSignatureDone = false;
                        obj.CounselorUserId = 0;
                        obj.CounselorUserName = "";
                        obj.IsAnesthesistSignatureDone = false;
                        obj.AnesthesistUserId = 0;
                        obj.AnesthesistUserName = "";
                        obj.IsGaurdianSignatureDone = false;
                        obj.GaurdianUserId = 0;
                        obj.GaurdianFirstName = "";
                        obj.GaurdianLastName = "";
                        obj.GaurdianRelationShipId = "";
                        obj.IsSelected = true;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });
                }
                else {
                    angular.forEach($scope.consentsMainObj.PatientConsents, function (item1) {
                        if (filteredOrgConsentTemplateArray[0].ConsentTemplateDetails.length > 0) {
                            angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (item2) {
                                if (item1.ConsentFormId === item2.OrganisationConsentFormId) {
                                    item2.isConsentAddedForPatient = true;
                                }
                            });
                        }

                    });


                    angular.forEach($scope.consentsMainObj.PatientConsents, function (oitem) {
                        var obj = getnewMainConsentObj();
                        obj.PatientConsentFormId = oitem.PatientConsentDocumentId;
                        obj.ConsentFormId = oitem.ConsentFormId;
                        obj.ConsentFormName = oitem.ConsentFormName;
                        obj.ConsentTemplateId = consentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.HTMLContent = oitem.HTMLContent;
                        obj.S3URL = oitem.S3URL;
                        obj.PDFcontent = oitem.HTMLContent;
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = oitem.IsPatientSignatureDone;
                        obj.IsProviderSignatureDone = oitem.IsProviderSignatureDone;
                        obj.ProviderUserId = oitem.ProviderUserId || 0;
                        obj.ProviderUserName = oitem.ProviderUserName || "";
                        obj.IsStaffSignatureDone = oitem.IsStaffSignatureDone;
                        obj.StaffUserId = oitem.StaffUserId || 0;
                        obj.StaffUserName = oitem.StaffUserName || "";
                        obj.IsCounselorSignatureDone = oitem.IsCounselorSignatureDone;
                        obj.CounselorUserId = oitem.CounselorUserId || 0;
                        obj.CounselorUserName = oitem.CounselorUserName || "";
                        obj.IsAnesthesistSignatureDone = oitem.IsAnesthesistSignatureDone;
                        obj.AnesthesistUserId = oitem.AnesthesistUserId || 0;
                        obj.AnesthesistUserName = oitem.AnesthesistUserName;
                        obj.IsGaurdianSignatureDone = oitem.IsGaurdianSignatureDone;
                        obj.GaurdianUserId = oitem.GaurdianUserId;
                        obj.GaurdianFirstName = oitem.GaurdianFirstName || "";
                        obj.GaurdianLastName = oitem.GaurdianLastName || "";
                        obj.GaurdianRelationShipId = oitem.GaurdianRelationShipId || 0;
                        obj.IsScannedDocument = oitem.IsScannedDocument;
                        obj.AppointmentId = oitem.AppointmentId;
                        obj.PatientId = oitem.PatientId;
                        obj.DocumentName = oitem.DocumentName;
                        obj.DeleteInd = oitem.DeleteInd || 'Y';
                        obj.PatientSignedDateTime = oitem.PatientSignedDateTime || "";
                        obj.ProviderSignedDateTime = oitem.ProviderSignedDateTime || "";
                        obj.StaffSignedDateTime = oitem.StaffSignedDateTime || "";
                        obj.CounselorSignedDateTime = oitem.CounselorSignedDateTime || "";
                        obj.AnesthesistSignedDateTime = oitem.AnesthesistSignedDateTime || "";
                        obj.GaurdianSignedDateTime = oitem.GaurdianSignedDateTime || "";
                        obj.PatientSignCaptureUserId = oitem.PatientSignCaptureUserId || 0;
                        obj.ProviderSignCaptureUserId = oitem.ProviderSignCaptureUserId || 0;
                        obj.StaffSignCaptureUserId = oitem.StaffSignCaptureUserId || 0;
                        obj.CounselorSignCaptureUserId = oitem.CounselorSignCaptureUserId || 0;
                        obj.AnesthesistSignCaptureUserId = oitem.AnesthesistSignCaptureUserId || 0;
                        obj.GaurdianSignCaptureUserId = oitem.GaurdianSignCaptureUserId || 0;
                        obj.IsSelected = true;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });

                    angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                        if (!oitem.isConsentAddedForPatient) {
                            var obj = getnewMainConsentObj();
                            obj.ConsentFormId = oitem.OrganisationConsentFormId;
                            obj.ConsentFormName = oitem.DocumentName;
                            obj.ConsentTemplateId = oitem.ConsentTemplateId;
                            obj.ConsentTypeId = oitem.ConsentTypeId;
                            obj.ConsentTypeName = oitem.ConsentTypeName;
                            obj.PDFcontent = oitem.PDFcontent;
                            obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                            obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                            obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                            obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                            obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                            obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                            obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                            obj.IsPatientSignatureDone = false;
                            obj.IsProviderSignatureDone = false;
                            obj.ProviderUserId = 0;
                            obj.ProviderUserName = "";
                            obj.IsStaffSignatureDone = false;
                            obj.StaffUserId = 0;
                            obj.StaffUserName = "";
                            obj.IsCounselorSignatureDone = false;
                            obj.CounselorUserId = 0;
                            obj.CounselorUserName = "";
                            obj.IsAnesthesistSignatureDone = false;
                            obj.AnesthesistUserId = 0;
                            obj.AnesthesistUserName = "";
                            obj.IsGaurdianSignatureDone = false;
                            obj.GaurdianUserId = 0;
                            obj.GaurdianFirstName = "";
                            obj.GaurdianLastName = "";
                            obj.GaurdianRelationShipId = "";
                            obj.IsScannedDocument = false;
                            obj.DeleteInd = oitem.DeleteInd || 'N';
                            obj.IsSelected = true;
                            $scope.consentsMainObj.MainConsents.push(obj);
                        }

                    });
                }


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


                    if (!item.IsDoctorSignRequired) {
                        item.ProviderClass = 'disabled';
                    } else {
                        if (item.IsProviderSignatureDone) {
                            item.ProviderClass = 'complete';
                        } else {
                            item.ProviderClass = 'incomplete';
                        }
                    }


                    if (!item.IsStaffSignRequired) {
                        item.StaffClass = 'disabled';
                    } else {
                        if (item.IsStaffSignatureDone) {
                            item.StaffClass = 'complete';
                        } else {
                            item.StaffClass = 'incomplete';
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


                    if (!item.IsAnesthesistSignRequired) {
                        item.AnesthesistClass = 'disabled';
                    } else {
                        if (item.IsAnesthesistSignatureDone) {
                            item.AnesthesistClass = 'complete';
                        } else {
                            item.AnesthesistClass = 'incomplete';
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


                });
            }


        };

        $scope.navtoOpenSigndocument = function (item) {
            console.log(item);

            $scope.AppointmentPatientdata = [];

            var selectedArray = [], selectedObj = "";

            var filteredArray = $filter("filter")($scope.consentsMainObj.MainConsents, { "IsSelected": true }, true);
            if (filteredArray.length > 0) {
                selectedArray = filteredArray;
                //selectedObj = filteredArray[0];
            }
            selectedObj = item;


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

            $scope.SelectedPatientobj = {
                "FullName": $scope.PatientDetailsInfo.FullName,
                "S3URL": $scope.PatientDetailsInfo.S3URL,
                "PatientDisplayId": $scope.PatientDetailsInfo.PatientDisplayID,
                "Gender": $scope.PatientDetailsInfo.Gender,
                "Age": $scope.PatientDetailsInfo.Age,
                "DOB": $scope.PatientDetailsInfo.DOB,
            };

            $scope.AppointmentPatientdata.push(hospitalobj);


            var sobj = {
                "mainitem": $scope.parentProfileTab.AppointmentAdditionalDetails,
                "UserId": $scope.UserId,
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "AppointmentId": $scope.mainPatientProfileObj.AppointmentId,
                "VisitId": $scope.mainPatientProfileObj.VisitId,
                "AppointmentDate": $scope.SelectedAppointmentObj.AppointmentDate,
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "PatientId": $scope.mainPatientProfileObj.PatientId,
                "HospitalAddress": $scope.AppointmentPatientdata,
                "selectedArray": selectedArray,
                "selectedObj": selectedObj,
                "ConsentTemplateId": $scope.consentsMainObj.SelectedConsentTemplateId,
                "Page": "Sign",
                "PatientDetails": $scope.SelectedPatientobj || '',
                "ApptHospitalId": $scope.SelectedAppointmentObj.BranchId || 0,
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
                "windowClass": "modal__popup--1 bottom-to-top-modal  "
            });
            $scope.mInstanceAdd.result.then(function (result) {
                console.log(result);

                $scope.GetPatientAppointmentConsentsById();
            }, function (cancel) {
            });
        };

        $scope.navtoprintsignedConsent = function (item) {
            console.log(item);
            if (item.S3URL != "") {
                var win = window.open(item.S3URL, '_blank');
                win.onload = function () {
                    win.print();
                };
            }

        };

        $scope.navtoScanDocument = function (item) {

            console.log(item);
            var obj = {
                "PatientId": $scope.mainPatientProfileObj.PatientId || null,
                "AppointmentId": $scope.mainPatientProfileObj.AppointmentId || null,
                "PatientName": $scope.mainPatientProfileObj.PatientDetailSummary.FullName || '',
                "Tab": "ConsentDocuments",
                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "FileTypeId": 4,
                "IsPartiallyUploaded": "Y",
                "ShowNewConsultation": "Y",
                "LabTestId": 0,
                "Remarks": '',
                "FileName": '',
                "DisplayName": '',
                "ParentItem": item,
                "PatientVisitId": $scope.mainPatientProfileObj.VisitId || null,
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                /*"size": "md",*/
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty-- zindexpopup",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                $scope.GetPatientAppointmentConsentsById();

            }, function (cancel) {
            });

        };
        $scope.changeOrganizationTemplate = function (cid) {
            reformAppointmentConsentsandOrgConsents(cid);
        };


        // consents form tab end
      
        //getting comanger details 
        $scope.ComangerList = [];
        $scope.GetPcpreferenceApptdoctorsbyId = function () {
            let appointmentid = $scope.AppointmentID || 0;
            let PatientID = $scope.PatientID || 0;
            const reqobj = {
                "AppointmentId": appointmentid || 0,
                "PatientID": PatientID || 0,
                "OrganizationId": $scope.HospitalId
            }
            eHnotePatientVisitReasonServices.GetPcpreferenceApptdoctorsbyId(reqobj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.ComangerList = resp.data.rows || [];
                }
            });

        };


        // edit PatientDetails 
        $scope.navtoEditPatientProfilePopup = function (Type, InsuranceEditItem) {
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            if (Type == 1) {
                $scope.ShowInsuranceAddnew = true;
            }
            if (Type == 3) {
                $scope.ShowInsuranceAddnew = false;
                if ($scope.IsEditInsuranceInd == true) {
                    InsuranceEditItem = InsuranceEditItem;
                } else {
                    InsuranceEditItem = {};
                }
            }
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            $scope.cacheStorageItem.IsfromcheckinInd = true;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            var obj = {
                "Tab": Type,
                "PatientDetails": $scope.PatientDetailsInfo,
                "HospitalEquipmentList": $scope.HospitalEquipmentList,
                "PatientAddress": $scope.PatientAddressSummary,
                "PatientInsuranceSummary": $scope.PatientInsuranceSummary || [],
                "ShowInsuranceAddnew": $scope.ShowInsuranceAddnew,
                "InsuranceStatusList": $scope.InsuranceStatusList || [],
                "InsuranceEditItem": "",
                "AllMasterData": $scope.mainPatientProfileObj.AllMasterData || {},
                "FamilySummary": $scope.mainPatientProfileObj.FamilySummary || [],
                "TitlesList": $scope.mainPatientProfileObj.TitlesList || [],
                "CoverageList": $scope.CoverageList||[],
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
                $scope.SelectPatient($scope.PatientDetailsInfo.PatientID, type);
                $scope.getPatientInsuranceDetailsOfPatient();
            }, function (cancel) {
            });
        }
        // notes starts 
       
        //$scope.AddPatientAlert = function () {
        //    if ($scope.AlertObj.AlertMessage === "") {
        //        alertify.error("Please Enter the alert Message!");
        //        return false;
        //    }
        //    if ($scope.PatientSearchdata.CreateAlert === 1) {
        //        if ($scope.AlertObj.PriorityName === "") {
        //            alertify.error("Please Enter the Priority!");
        //            return false;
        //        }
        //    }

        //    var AlertTypesList = [];

        //    var TempArray = $filter("filter")($scope.AlertObj.AlertTypesList, function (kitem) { return kitem.AlertDeatilId != 0 || kitem.IsChecked == true });
        //    if (TempArray.length > 0) {
        //        AlertTypesList = angular.copy(TempArray);
        //    };

        //    if ($scope.PatientSearchdata.CreateAlert == 1) {
        //        if (AlertTypesList.length == 0) {
        //            alertify.error("Please Select the Screen!");
        //            return false;
        //        }
        //    }

        //    var obj = {
        //        "UserId": $scope.UserId,
        //        "OrganizationId": $scope.HospitalId,
        //        "PatientNoteId": $scope.PatientNoteId || 0,
        //        "AppointmentNoteId": 0,
        //        "NoteTypeId": $scope.AlertObj.AlertNoteTypeId,
        //        "NoteTypeName": $scope.AlertObj.AlertNoteName,
        //        "PatientId": $scope.PatientID,
        //        "AppointmentId": $scope.AppointmentID,
        //        "DeleteInd": "N",
        //        "Notes": $scope.AlertObj.AlertMessage,
        //        "CreateAlert": $scope.PatientSearchdata.CreateAlert,
        //        "AlertData": null,
        //    };

        //    if ($scope.PatientSearchdata.CreateAlert == 1) {
        //        var AlertObj = {
        //            "AlertId": $scope.AlertObj.AlertId,
        //            "StartDate": $scope.AlertObj.StartDate,
        //            "EndDate": $scope.AlertObj.EndDate,
        //            "PriorityId": $scope.AlertObj.PriorityId,
        //            "PriorityName": $scope.AlertObj.PriorityName,
        //            "AlertTagId": $scope.AlertObj.AlertTagId,
        //            "AlertTagName": $scope.AlertObj.AlertTagName,
        //            "AlertMessage": $scope.AlertObj.AlertMessage,
        //            "StatusId": $scope.AlertObj.StatusId,
        //            "Status": $scope.AlertObj.Status,
        //            "DeleteInd": $scope.AlertObj.DeleteInd,
        //            "AlertTypesList": AlertTypesList,
        //        }
        //        obj.AlertData = AlertObj;
        //    }


        //    eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {
        //        if (resp.data.status == "Success") {
        //            alertify.success("Patient alert added successfully!");
        //            $scope.ClearPatientAlert();
        //            $scope.getPatientAlertsList();
        //        }

        //    },
        //    );
        //};
        //$scope.ClearPatientAlert = function () {
        //    $scope.AlertObj = GetAlertData();
        //    $scope.PatientSearchdata = getSelectedPatientData();
        //    $scope.PatientSearchdata.CreateAlert = 2;
        //    if ($scope.MasterAlertTypes.length > 0) {
        //        angular.forEach($scope.MasterAlertTypes, function (item) {
        //            var object = {
        //                'AlertDeatilId': 0,
        //                'AlertId': 0,
        //                'IsChecked': false,
        //                'DeleteInd': 'N',
        //                'AlertTypeId': item.AlertTypeId,
        //                'AlertTypeName': item.AlertName,
        //            }
        //            $scope.AlertObj.AlertTypesList.push(object);
        //        });
        //    }
        //}
        //$scope.ChangesAlertRadiobtn = function (Id) {
        //    $scope.PatientSearchdata.CreateAlert = Id;

        //    if ($scope.PatientSearchdata.CreateAlert == 1) {
        //        $scope.PatientSearchdata.IsShowAlert = true;
        //    } else {
        //        $scope.PatientSearchdata.IsShowAlert = false;
        //    }

        //}
        //$scope.ChangeAlertNotestype = function (Id) {
        //    Id == Id || 0;
        //    var NotesTypes = $filter("filter")($scope.MasterAlertNoteType, { "AlertNoteTypeId": Id })[0] || {};

        //    $scope.AlertObj.AlertNoteTypeId = NotesTypes.AlertNoteTypeId || 0;
        //    $scope.AlertObj.AlertNoteName = NotesTypes.AlertNoteName || "";
        //}
        //$scope.ChangePrioritylist = function (Id) {
        //    Id == Id || 0;
        //    var PriorityList = $filter("filter")($scope.MasterPriority, { "PriorityId": Id })[0] || {};

        //    $scope.AlertObj.PriorityId = PriorityList.PriorityId || 0;
        //    $scope.AlertObj.PriorityName = PriorityList.PriorityName || "";
        //}
        //$scope.AlertTypesListData = [];
        
        //$scope.updateAlertTypesListData = function (mitem) {
        //    $scope.updateAlertTypesListData = function (mitem) {
        //        if (mitem.IsChecked) {
        //            mitem.DeleteInd = 'N';
        //        } else if (!mitem.IsChecked) {
        //            if (mitem.AlertDeatilId !== 0) {
        //                mitem.DeleteInd = 'Y';
        //            }
        //        }
        //    };
        //};
        //$scope.ChangeAlertTag = function (Id) {
        //    Id == Id || 0
        //    var AlertTagList = $filter("filter")($scope.MasterAlertTag, { "AlertTagId": Id })[0] || {};

        //    $scope.AlertObj.AlertTagId = AlertTagList.AlertTagId || 0;
        //    $scope.AlertObj.AlertTagName = AlertTagList.AlertTagName || "";

        //}
        //$scope.EditAlertList = function (item) {
        //    $scope.AlertObj = GetAlertData();
        //    $scope.PatientSearchdata = getSelectedPatientData();
        //    $scope.AlertObj.AlertMessage = item.PatientNotes || "";
        //    $scope.AlertTypesList = [];
        //    if (item.AlertData !== null) {

        //        $scope.AlertObj.AlertMessage = item.AlertData.AlertMessage || "";
        //        $scope.AlertObj.AlertId = item.AlertData.AlertId || "";
        //        $scope.AlertObj.AlertTagId = item.AlertData.AlertTagId || 0;
        //        $scope.AlertObj.AlertTagName = item.AlertData.AlertTagName || "";
        //        $scope.AlertObj.StatusId = item.AlertData.StatusId || 0;
        //        $scope.AlertObj.PriorityId = item.AlertData.PriorityId || 0;
        //        $scope.AlertObj.PriorityName = item.AlertData.PriorityName || "";
        //        $scope.AlertObj.StartDate = $filter('date')(item.AlertData.StartDate, "MM-dd-yyyy") || "";
        //        $scope.AlertObj.EndDate = $filter('date')(item.AlertData.EndDate, "MM-dd-yyyy") || "";
        //        $scope.AlertObj.Status = item.AlertData.Status || "";
        //        $scope.AlertObj.DeleteInd = item.AlertData.DeleteInd || "N";
        //        $scope.AlertTypesList = item.AlertData.AlertTypesList || [];

        //        if ($scope.AlertObj.PriorityName != '') {
        //            $scope.PatientSearchdata.IsShowAlert = true;
        //            $scope.PatientSearchdata.CreateAlert = 1;
        //        }
        //    }

        //    if ($scope.MasterAlertTypes.length > 0) {
        //        angular.forEach($scope.MasterAlertTypes, function (item) {
        //            var object = {
        //                'AlertDeatilId': 0,
        //                'AlertId': 0,
        //                'IsChecked': false,
        //                'DeleteInd': 'N',
        //                'AlertTypeId': item.AlertTypeId,
        //                'AlertTypeName': item.AlertName,
        //            }
        //            $scope.AlertObj.AlertTypesList.push(object);
        //        });
        //    }

        //    $scope.PatientNoteId = item.PatientNoteId || 0;
        //    $scope.AlertObj.AlertNoteTypeId = item.NoteTypeId;
        //    $scope.AlertObj.AlertNoteName = item.NoteType;

        //    if ($scope.AlertTypesList.length > 0) {
        //        angular.forEach($scope.AlertTypesList, function (pitem) {
        //            var templist = $filter("filter")($scope.AlertObj.AlertTypesList, { "AlertTypeId": pitem.AlertTypeId }, true) || [];
        //            if (templist.length > 0) {
        //                templist[0].IsChecked = true;
        //                templist[0].AlertDeatilId = pitem.AlertDeatilId;
        //                templist[0].AlertId = pitem.AlertId;
        //                templist[0].AlertTypeId = pitem.AlertTypeId;
        //                templist[0].AlertTypeName = pitem.AlertTypeName;
        //                templist[0].DeleteInd = pitem.DeleteInd;
        //            }
        //        });
        //    }

        //    /*$scope.AlertTypesListData = angular.copy($scope.AlertObj.AlertTypesList) || [];*/

        //};
        $scope.DeletePatientAlert = function (item) {

            item = item || null;

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
                var obj = {
                    UserId: $scope.UserId,
                    OrganizationId: $scope.HospitalId,
                    PatientNoteId: item.PatientNoteId || 0,
                    AppointmentNoteId: item.AppointmentNoteId || 0,
                    NoteTypeId: item.NoteTypeId,
                    NoteTypeName: item.NoteType,
                    PatientId: item.PatientId,
                    AppointmentId: item.AppointmentId,
                    DeleteInd: "Y",
                    Notes: item.PatientNotes,
                    CreateAlert: 1,
                    AlertData: null
                };

                // Check if CreateAlert is enabled and AlertData exists
                if (item.AlertData !== null) {
                    obj.AlertData = {
                        AlertId: item.AlertData.AlertId,
                        StartDate: item.AlertData.StartDate,
                        EndDate: item.AlertData.EndDate || null,
                        PriorityId: item.AlertData.PriorityId,
                        PriorityName: item.AlertData.PriorityName,
                        AlertTagId: item.AlertData.AlertTagId,
                        AlertTagName: item.AlertData.AlertTagName,
                        AlertMessage: item.AlertData.AlertMessage,
                        StatusId: item.AlertData.StatusId,
                        Status: item.AlertData.Status,
                        DeleteInd: "Y",
                        AlertTypesList: item.AlertData.AlertTypesList || []
                    };
                    angular.forEach(item.AlertData.AlertTypesList, function (pitem) {
                        pitem.IsChecked = false;
                        pitem.DeleteInd = 'Y';
                    });
                }

                eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {

                    if (resp.data.status == "Success") {
                        alertify.success("Deleted successfully");
                    } else {
                        alertify.error("Failed to delete the patient alert.");
                    }
                    $scope.getPatientAlertsList();

                }, function onerror(err) {
                    console.log(err);
                });

            },
                function () {
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });

        }

        $scope.IsAlertDataAdded = false;

        $scope.getPatientAlertsList = function () {
            $scope.PatientAlertsList = [];
            $scope.PatientAlerts = [];
            let obj = {
                "PatientId": $scope.PatientID,
                "OrganizationId": $scope.HospitalId,
                "StatusId": 1
            }
            $q.all([
                eHnoteInsuranceService.GetPatientAlertsNew(obj),

            ]).then(function (resp) {
           
                if (resp[0].data.Status == "Success") {
                    if (resp[0].data.rows.length > 0) {
                        //$scope.PatientAlertsList = angular.copy(resp[0].data.rows) || [];
                        $scope.PatientAlertsList = $filter('filter')(resp[0].data.rows, function (item) {
                            return item.NoteTypeId != 6;
                        }) || [];

                        //let PatientAlertsarray = angular.copy(resp[0].data.rows) || [];
                        let filterid = 0
                        if ($scope.parentProfileTab.IscheckinOutInd) {
                            filterid = 2
                        }
                        if (!$scope.parentProfileTab.IscheckinOutInd) {
                            filterid = 1
                        }

                        //$scope.PatientAlerts = PatientAlertsarray.filter(function (item) {
                        //    item.AlertData.AlertTypesList = item.AlertData.AlertTypesList.filter(function (aitem) {
                        //        return aitem.AlertTypeId == filterid;
                        //    });
                        //    return item.AlertData.AlertTypesList.length > 0;
                        //});

                        $scope.PatientAlerts = [];

                        if ($scope.PatientAlertsList.length > 0) {
                            angular.forEach($scope.PatientAlertsList, function (item) {
                                var counter = 0;
                                if (item.AlertData !== null) {
                                    if (item.AlertData.AlertTypesList.length > 0) {
                                        angular.forEach(item.AlertData.AlertTypesList, function (Bitem) {
                                            if (Bitem.AlertTypeId == filterid) {
                                                counter++;
                                            }
                                        })
                                    }
                                }
                                if (counter !== 0) {
                                    $scope.PatientAlerts.push(item);
                                }
                            });


                        }

                        //if ($scope.isfromresolveObj.IsfromResolveInd) {
                        //    if ($scope.isfromresolveObj.IsResolveitem != '') {
                        //        let AlertId = $scope.isfromresolveObj.IsResolveitem.AlertId || "";
                        //        if (AlertId != '') {
                        //            let filtervalue = $filter('filter')($scope.PatientAlertsList, { 'AlertId': AlertId })[0] || {};
                        //            $scope.EditAlertList(filtervalue);
                        //        }

                        //    }
                        //}
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
        }
        // notes end 

        // orders
        $scope.NavToOrdersTab = function () {
            var Tab = 2;
            var Focus = ''; type = "Investigations"; Subtype = 'FromPatientProfile'; checkInvArray = []; subVisionArray = []; $scope.PosteriorLensDetails = [], examtab = '';
            $scope.cacheStorageItem.allSubSpecializationsArray = [];
            $scope.cacheStorageItem.PachymetryDetails = $scope.cacheStorageItem.PachymetryDetails || [];
            $scope.cacheStorageItem.DryEyeEvaluationData = $scope.cacheStorageItem.DryEyeEvaluationData || [];
            $scope.cacheStorageItem.ContactLensDetails = $scope.cacheStorageItem.ContactLensDetails || [];
            $scope.cacheStorageItem.PoteriorSegmentArrayNew = $scope.cacheStorageItem.PoteriorSegmentArrayNew || [];
            $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology = $scope.cacheStorageItem.IsPosteriorExtendedOpthalmology || false;
            $scope.BillItemFileUploadList = $scope.BillItemFileUploadList || [];

            $scope.BillItemList = [];
            $scope.cacheStorageItem.GonioscopyDetails = $scope.cacheStorageItem.GonioscopyDetails || [];
            $scope.cacheStorageItem.ManifestRefractionDetails = $scope.cacheStorageItem.ManifestRefractionDetails || [];
            $scope.cacheStorageItem.IsDiabetesMellitus = $scope.cacheStorageItem.IsDiabetesMellitus || false;
            $scope.cacheStorageItem.SuperBillFinalObj = $scope.cacheStorageItem.SuperBillFinalObj || {};
            $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes = $scope.cacheStorageItem.SuperBillFinalObj.SuperBillSuggestedCodes || [];
            $scope.cacheStorageItem.GeneralAssessmentPlan = $scope.cacheStorageItem.GeneralAssessmentPlan || [];
            $scope.cacheStorageItem.appointmentid = $scope.AppointmentID || 0;
            $scope.cacheStorageItem.PatientVisitId = $scope.mainPatientProfileObj.VisitId || '';
            $scope.cacheStorageItem.patientid = $scope.mainPatientProfileObj.PatientId || '';
            var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
            appoint_info.AppointmentId = $scope.AppointmentID || 0;
            appoint_info.AppointmentID = $scope.AppointmentID || 0;
            appoint_info.AppointmentStatusId = $scope.AppointmentStatusId || 0;
            eHnoteMasterDataService.addAppointmentInfo(appoint_info);
            $scope.AssessmentInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/AddUpdateAssessmentpopup.html",
                "controller": "USAddUpdateAssessmentpopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "cache": function () { return angular.copy($scope.cacheStorageItem) },
                    "Focus": function () { return angular.copy(Focus) },
                    "allUserList": function () { return angular.copy($scope.allUserList) },
                    "Tabchange": function () { return Tab; },
                    "Modalities": function () { return angular.copy($scope.Modalities) },
                    "FinalObj": function () { return type; },
                    "checkInvArray": function () { return checkInvArray; },
                    "CategoryList": function () { return angular.copy(subVisionArray); },
                    "PosteriorLensDetails": function () { return $scope.PosteriorLensDetails; },
                    "FocusSubTab": function () { return { "Focus": Focus, 'Subtype': Subtype } },
                    "BillItemFileUploadList": function () { return $scope.BillItemFileUploadList; },
                    "BillItemList": function () { return $scope.BillItemList; },
                    "examtab": function () { return ''; },
                    "BranchList": function () { return $scope.BranchesListArray || []; },
                    "IsInsuranceAvailable": function () { return $scope.IsInsuranceAvailable }
                },
                "windowClass": "modal__ninety--",

            });
            $scope.AssessmentInstanceAdd.result.then(function (resp) {

                $scope.getpatientconsultationbyId();

            });
        }
        $scope.SelectedAppt = function (apptitem) {
            console.log(apptitem);
            $scope.AppointmentID = apptitem.AppointmentId || 0;
            $scope.mainPatientProfileObj.VisitId = apptitem.VisitsArray.length > 0 ? apptitem.VisitsArray[0].VisitId : 0;
            $scope.mainPatientProfileObj.AppointmentId = apptitem.AppointmentId || 0;
        };
        $scope.CheckVerifyEligibity = function (item) {
            if ($scope.patientid === 0) {

            } else {
                $scope.continuetoCheckInsuranceEligibility(item);
            }
        }
        $scope.continuetoCheckInsuranceEligibility = function (item) {
            if ($scope.PatientDetailsInfo.FirstName === "") {
                alertify.error("Please Enter Patient First Name");
                return;
            }
            //if ($scope.PatientDetailsInfo.FirstName.length < 3) {
            //    alertify.error("Please Enter Patient First Name");
            //    return;
            //}
            $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName || "";
            if ($scope.PatientDetailsInfo.LastName === "") {
                alertify.error("Please Enter Patient Last Name");
                return;
            }
            if ($scope.PatientDetailsInfo.DOB === "") {
                alertify.error("Please Enter Patient DOB");
                return;
            }

            if ($scope.PatientDetailsInfo.Gender === "") {
                alertify.error("Please Enter Patient Gender");
                return;
            }
            $scope.PatientDetailsInfo.SocialSecurityNo = $scope.PatientDetailsInfo.SocialSecurityNo || null;
            //if ($scope.PatientDetailsInfo.SocialSecurityNo === null) {
            //    alertify.error("Please Enter Valid SSN Number");
            //    return;
            //}


            //var SSNno = angular.copy($scope.PatientDetailsInfo.SocialSecurityNo) || "";
            //SSNno = SSNno.toString();
            //if ((SSNno == "") || (SSNno != "" && SSNno.length !== "" && SSNno.length < 9)) {
            //    alertify.error("Please Enter Valid SSN Number");
            //    return;
            //}
            if (item.RelationShipId != 1) {
                if (item.InsuredPersonFirstName === "") {
                    alertify.error("Please Enter Insured Person First Name");
                    return;
                }
                if (item.InsuredPersonFirstName.length < 3) {
                    alertify.error("Please Enter Insured Person First Name");
                    return;
                }
                item.InsuredPersonLastName = item.InsuredPersonLastName || "";
                if (item.InsuredPersonLastName === "") {
                    alertify.error("Please Enter Insured Person Last Name");
                    return;
                }
                if (item.EligibleInsuredPersonDOB === "") {
                    alertify.error("Please Enter Insured Person DOB");
                    return;
                }

                if (!item.InsuredPersonGenderID) {
                    alertify.error("Please Enter Insured Person Gender");
                    return;
                }
            }
            item.PlanId = item.PlanId || null;
            if (item.PlanId === null) {
                alertify.error("Please Select Plan");
                return;
            }
            item.PolicyId = item.PolicyId || null;
            if (item.PolicyId === null) {
                alertify.error("Please Enter Policy ID");
                return;
            }
            if (item.EligibilityPayorId === null || item.EligibilityPayorId === undefined || item.EligibilityPayorId === "") {
                alertify.error("Invalid Payer ID. Please check and try again.");
                return;
            }
            //item.GroupId = item.GroupId || null;
            //if (item.GroupId === null) {
            //    alertify.error("Please Enter Group");
            //    return;
            //};

            const isEligible = !!item?.SubmitInsuranceEligibilityElectronically;
            if (!isEligible) {
                alertify.error("Real-Time Eligibility is not supported by this payer.");
                return;
            }

            var params = {
                "UserId": $scope.UserId,
                "SNO": 1,
                "PatientAppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId || 0,
                "AppointmentId": 0,
                "AppointmentDate": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
                "AppointmentInsuranceNumber": 0,
                "DoctorName": $scope.DrFullName,
                "UserProviderId": doctorinfo.doctordata.User[0].UserProviderId,
                "HospitalId": $scope.HospitalId,
                "AppointmentTOSCodes": [

                ],
                "NPI": doctorinfo.doctordata.User[0].NPI,
                "TaxId": doctorinfo.doctordata.User[0].UserTaxId,
                "ProviderCode": "H",
                //"serviceProviderNumber": $scope.selectedDocObject.selectedPerson.serviceProviderNumber,
                "serviceProviderNumber": 0,
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "AppointmentTime": $filter("date")(new Date(), "HH:mm"),
                "AppointmentPatientTypeId": 1,
                "AppointmentPatientType": "New Patient",
                "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
                "PatientId": item.PatientId,
                "PatientMrNo": $scope.PatientDisplayID,
                "Gender": $scope.PatientDetailsInfo.Gender,
                "DOB": $scope.PatientDetailsInfo.DOB,
                "FirstName": $scope.PatientDetailsInfo.FirstName,
                "LastName": $scope.PatientDetailsInfo.LastName,
                "TitleId": 1,
                "Title": "Mr",
                "PatientFirstName": $scope.PatientDetailsInfo.FirstName,
                "PatientLastName": $scope.PatientDetailsInfo.LastName,
                "PatientMobile": $scope.PatientDetailsInfo.DisplayNumber,
                "PatientContact": $scope.PatientDetailsInfo.HomeCountryCode,
                "HomeNumber": $scope.PatientDetailsInfo.HomeNumber,
                "HomeAreaCode": $scope.PatientDetailsInfo.HomeAreaCode,
                "HomeCountryCode": $scope.PatientDetailsInfo.DisplayOfficeNumber,
                "OfficeNumber": $scope.PatientDetailsInfo.OfficeNumber,
                "OfficeAreaCode": $scope.PatientDetailsInfo.OfficeAreaCode,
                "OfficeCountryCode": $scope.PatientDetailsInfo.OfficeCountryCode,
                "PatientGender": $scope.PatientDetailsInfo.Gender,
                "PatientSSN": $scope.PatientDetailsInfo.SocialSecurityNo,
                "PayorId": item.PayorId,
                "PayorName": item.PayorName,
                "PlanName": item.PlanName,
                "PlanTypeId": item.PlanTypeId,
                "PlanTypeName": item.PlanTypeName || "",
                "PlanId": item.PlanId,
                "InsuranceEffectiveDate": item.EffectiveDate || "",
                "InsuranceExpiryDate": item.ExpiryDate || "",
                "RelationShipId": item.RelationShipId,
                "RelationName": item.RelationName,
                "VerifiedDate": item.VerifiedDate || "",
                "Coinsurance": item.Coinsurance || null,
                "VisitCopay": item.VisitCopay || null,
                "CoverageId": item.CoverageId || 1,
                "InsuredPersonSSN": item.InsuredPersonSSN,
                "PolicyHolder": item.PolicyHolder || "",
                "InsuranceStatusId": 1,
                "InsuredPersonFirstName": item.InsuredPersonFirstName,
                "InsuredPersonLastName": item.InsuredPersonLastName,
                "InsuredPersonDOB": item.EligibleInsuredPersonDOB,
                "InsuredPersonGenderID": item.InsuredPersonGenderID,
                "InsuranceStatusName": "Active",
                "PolicyHolderName": item.PolicyHolderName || "",
                "GroupName": item.GroupName || "",
                "StatusId": item.StatusId || 1,
                "StatusName": "Not Verified",
                "MasterPayorId": item.GlobalPayorId,
                "OrgEligibilityClaimNumber": item.PatientInsuranceControlNumber,
                "PatientCoPayAmount": null,
                "PatientCoPayPercentage": null,
                "SocialSecurityNo": $scope.PatientDetailsInfo.SocialSecurityNo,
                "AddressId": null,
                "CityName": null,
                "StateName": null,
                "Pin": null,
                "PlanBeginDate": null,
                "PlanEndDate": null,
                "PolicyId": item.PolicyId,
                "GroupId": item.GroupId,
                "PlanNumber": null,
                "isSelected": false,
                "isVerified": false,
                "IsShowEligibility": false,
                "ProviderID": doctorinfo.doctordata.User[0].UserProviderId,
                "ServiceTypeobj": "",
                "SerciceFrom": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
                "ServiceTo": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
                "MemberId": "",
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "serviceTypeCodes": [

                ],
                "BillingProviderDetails": {
                    "BillingProviderName": "",
                    "BillingProviderId": "",
                    "BillingProviderNPI": "",
                    "BillingProviderTaxId": "",
                    "BillingProviderContactPersonName": "",
                    "BillingProviderContactPhoneNumber": ""
                },
                "ClearingHouseId": 1,
                "ClearingHouseName": "",
                "MasterClearingHouseId": "",
                "ClearingHouseType": "",
                "CHUserName": "",
                "CHPassword": "",
                "CHSubmitterId": "",
                "CHReceiverId": "",
                "CHEligiibilityUrl": "",
                "FTPAddress": "",
                "FTPUserName": "",
                "FTPpassword": "",
                "FTPpath": "",
                "FTPFolder": "",
                "FTPPort": "",
                "EligiBatchSubmitterID": "",
                "EligiBatchReceiverID": "",
                "PatientsList": [],

            };
            var traceNumber = $filter('date')(new Date(), 'yyyyMMddHHmmssfff');
            var traceEntityIdentifier = item.PatientInsuranceDetailId.toString().padStart(10, '0');

            let obj = {
                "PatientFirstName": item.InsuredPersonFirstName,
                "PatientLastName": item.InsuredPersonLastName,
                "Gender": item.InsuredPersonGenderID || ($scope.PatientDetailsInfo.Gender == "Male" ? "M" : "F") || '',
                "InsuredPersonDOB": item.EligibleInsuredPersonDOB,
                "PolicyNo": item.PolicyId,
                "PayorName": item.PayorName,
                "PayorId": item.PayorId,
                "GlobalPayorId": item.EligibilityPayorId,
                "ServiceTypeCode": "98",
                "TraceEntityIdentifier": traceEntityIdentifier,
                "EntityType": "1",
                "DeleteInd": "N",
                "EligibilityStatusId": "5",
                "EligibilityStatusName": "Verification Sent",
                "traceNumber": traceNumber + "_" + item.PatientInsuranceDetailId,
                "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
                "PatientId": item.PatientId,
                "GroupId": item.GroupId,
                "PatientMrNo": $scope.PatientDisplayID,
                "PatientDOB": moment(item.InsuredPersonDOB).format("YYYYMMDD"),
                "PatientContact": $scope.PatientDetailsInfo.HomeCountryCode,
            }

            params.PatientsList.push(obj);

            if ($scope.OrganizationBillingProviderList.length > 0) {

                var OrganizationBillingProviderObj = "";
                var filteredList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": $scope.defaultBillingProviderId }, true) || [];
                if (filteredList.length > 0) {
                    OrganizationBillingProviderObj = filteredList[0];
                } else {
                    OrganizationBillingProviderObj = $scope.OrganizationBillingProviderList[0];
                }

                params.BillingProviderDetails.BillingProviderName = OrganizationBillingProviderObj.BillingProviderName;
                params.BillingProviderDetails.BillingProviderId = OrganizationBillingProviderObj.OrganizationBillingProviderId;
                params.BillingProviderDetails.BillingProviderNPI = OrganizationBillingProviderObj.NPI;
                params.BillingProviderDetails.BillingProviderTaxId = OrganizationBillingProviderObj.TaxId;
                params.BillingProviderDetails.BillingProviderContactPersonName = OrganizationBillingProviderObj.ContactPersonName;
                params.BillingProviderDetails.BillingProviderContactPhoneNumber = OrganizationBillingProviderObj.ContactMobileNumber;
            };

            if ($scope.OrganizationClearingHouseDetails.length > 0) {
                params.ClearingHouseId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseID;
                params.ClearingHouseName = $scope.OrganizationClearingHouseDetails[0].Name;
                params.MasterClearingHouseId = $scope.OrganizationClearingHouseDetails[0].MasterClearingHouseId;
                params.ClearingHouseType = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPType;

                params.FTPAddress = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPHostName || "";
                params.FTPUserName = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPUserName || "";
                params.FTPpassword = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPassword || "";
                params.FTPpath = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
                params.FTPFolder = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
                params.FTPPort = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPortNumber || "";
                params.EligiBatchSubmitterID = $scope.OrganizationClearingHouseDetails[0].SubmitterID || "";
                params.EligiBatchReceiverID = $scope.OrganizationClearingHouseDetails[0].ReceiverID || "";
                params.CHUserName = $scope.OrganizationClearingHouseDetails[0].AuthUserName || "";
                params.CHPassword = $scope.OrganizationClearingHouseDetails[0].AuthPassword || "";
                params.CHSubmitterId = $scope.OrganizationClearingHouseDetails[0].SubmitterID || "";
                params.CHReceiverId = $scope.OrganizationClearingHouseDetails[0].ReceiverID || "";
                params.CHEligiibilityUrl = $scope.OrganizationClearingHouseDetails[0].EligibilityURL || "";
                params.UsageIndicator = $scope.OrganizationClearingHouseDetails[0].UsageIndicator || "";
                var ClearingHouseTypeId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseTypeId || 0;


                if (ClearingHouseTypeId == 2) {
                    if (params.FTPAddress === "" && params.FTPUserName == "" && params.FTPpassword == "" && params.FTPpath == "") {
                        alertify.error("FTP details are missing for the Clearing House please ");
                        return false;
                    }
                }

            }
            eHnoteInsuranceService.CheckPatientRealtimeInsuranceEligibility(params, onSuccess, onError);
            function onSuccess(resp) {



                console.log(JSON.stringify(resp));

                if (resp.Status == 'Success') {
                    item.IsVerified = true;
                    alertify.success("Insurance Eligibility Verified Successfully");
                    $scope.getPatientInsuranceDetailsOfPatient();
                }
                else if (resp.Status == 'Skipped') {
                    alertify.success("Eligibility request already submitted. Please try again later.");
                    $scope.getPatientInsuranceDetailsOfPatient();
                }
                else {
                    alertify.error("Insurance Eligibility Verification Failed");
                    $scope.getPatientInsuranceDetailsOfPatient();
                }
            }
            function onError(reponse) {
            }

        }
        $scope.getPatientInsuranceDetailsOfPatient = function () {
            var includeInactive = true;
            eHnoteInsuranceService.getPatientInsuranceDtls($scope.PatientID, 0, includeInactive).then(function (response) {

                if (response.data !== undefined) {
                    $scope.ExpiredPatientInsuranceList = response.data.ExpiredPatientInsuranceList || [];
                    if (response.data.rows.length > 0) {

                        let ActiveInsuranceList = [];
                        if (response.data.rows.length > 0) {
                            ActiveInsuranceList = $filter('filter')(response.data.rows, { 'StatusId': 1 }, true) || [];
                        }
                        $scope.PatientInsuranceSummary = ActiveInsuranceList;
                        $scope.patientInsuranceTpasArray = response.data.rows;
                        angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                            bitem.isCorporateType = false;
                            if (bitem.BillingCategoryTypeId === 15) {
                                bitem.isCorporateType = true;
                            }
                        });
                        //$scope.PatientInsuranceObj = GetInsuranceObj();
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

                            $scope.patientInsuranceTpasArray = $filter('filter')($scope.patientInsuranceTpasArray, { 'StatusId': 1 }, true) || [];
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


                    }
                    else {
                        $scope.patientInsuranceTpasArray = response.data.rows;
                    }
                }
            });
        }
        $scope.getPatientInsuranceDetailsOfPatient();
        $scope.showEligibilityinPopup1 = function (item) {
            $scope.obj = {
                "AppointmentInsuranceDetailId": item.AppointmentInsuranceDetailId || 0,
                "PatientInsuranceDetailId": item.PatientInsuranceDetailId
            }
            $scope.reverifyitem = item;
            $scope.PatientDetailsInfo = angular.copy($scope.PatientDetailsInfo);


            $scope.modalpayorInstance = $uibModal.open({
                "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
                "backdrop": "static",
                "controller": "UsPatientEligibilityResponseDetailsPopUpCtrl",
                "resolve": {
                    "Selectobj": function () { return $scope.obj; },
                    "ReverifyItem": function () { return $scope.reverifyitem; },
                    "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; }
                },
                "keyboard": false,
                "windowClass": "offcanves-right  ",
            })

            $scope.modalpayorInstance.result.then(function (resp) {
            }, function () {
                $scope.getPatientInsuranceDetailsOfPatient();
            });

        };

        $scope.showEligibilityErrors = function (item) {
            eHnoteInsuranceService.GetPatientInsuranceEligibilityErrorDetails(item.PatientInsuranceDetailId).then(function (response) {
                console.log(JSON.stringify(response));
                //if (response.data.ErrorDetails.length > 0) {
                $scope.openErrorPopup(response.data.ErrorDetails);
                //}
            });
        }
        $scope.openErrorPopup = function (errorsArray) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/PatientInsuranceVerifyError.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "md",
                "windowClass": " ",
                "resolve": {
                    "ErrorArray": function () { return errorsArray; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, ErrorArray) {
                    $scope.closeadvisedItems = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.ErrorsList = ErrorArray || [];

                    $scope.discardProcedures = function () {
                        $scope.selectedProcedures = [];
                        $uibModalInstance.dismiss("cancel");
                    }
                }
            });
        }
        $scope.NavToAddNotesScreen = function (item, type) {
            type = type || 1;
            $scope.ShowPatientListDrop = false;
            var obj = {
                "apptitem": item,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                //"PatientName": $scope.PatientDetailsInfo.FullName || '',
                "PatientDetailsInfo": $scope.PatientDetailsInfo,
                "NotesTab": type,
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/AppointmentNotesOfPatient.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject) {

                    $scope.ApptSubmitText = 'Save';

                    $scope.selectedAppointmentObject = {
                        "NotesTab": 1,
                        "OtherNotes": "",
                        "Routeslipnotes": "",
                        "OtherNotesCreatedBy": "",
                        "OtherNotesCreatedDt": "",
                    }
                    $scope.PatientDetailSummary = {
                        "PatientName":'',
                        "PatientDisplayId":0,
                        "PatientID":0,
                        "S3URL":''
                    };
                    $scope.selectedAppointmentObject.NotesTab = mainObject.NotesTab || 1;
                    $scope.AppointmentId = mainObject.apptitem.AppointmentId;
                    $scope.UserId = mainObject.UserId;

                    $scope.PatientName = mainObject.PatientDetailsInfo.FullName || '';
                    $scope.PatientDisplayId = mainObject.PatientDetailsInfo.PatientDisplayID || '';
                    $scope.PatientGender = mainObject.PatientDetailsInfo.Gender || '';
                    $scope.PatientDOB = mainObject.PatientDetailsInfo.DOB || '';
                    $scope.PatientImageS3URL = mainObject.PatientDetailsInfo.S3URL || '';

                    $scope.VistReasonName = mainObject.apptitem.AppointmentVisitReasonName || '';
                    $scope.DoctorName = mainObject.apptitem.AppointmentDoctorFirstName || '';
                    $scope.PatientDetailSummary.PatientName = mainObject.PatientDetailsInfo.FullName || '';
                    $scope.PatientDetailSummary.PatientDisplayId = mainObject.PatientDetailsInfo.PatientDisplayID || 0;
                    $scope.PatientDetailSummary.PatientID = mainObject.PatientDetailsInfo.PatientID || 0;
                    $scope.PatientDetailSummary.S3URL = mainObject.PatientDetailsInfo.S3URL || '';
                    $scope.cacheStorageItem = $scope.cacheStorageItem || {};
                    $scope.cacheStorageItem.PatientDisplayId = $scope.PatientDisplayId || 0;
                    $scope.cacheStorageItem.PatientName = $scope.PatientName  || '';
                    $scope.cacheStorageItem.PatientImageS3URL =  $scope.PatientImageS3URL || '';

                    $scope.patiendetilsopen = function () {
                        let patientId = $scope.PatientDetailSummary.PatientID  || 0;
                        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                        function ongetPatientDetailsSuccess(data) {
                            if (data !== undefined) {
                                var selectedPatientData = data;
                                $scope.MasterPatientId = selectedPatientData.Patient[0].MasterPatientId;
                                $scope.PaitentDetails = {
                                    "FullName": selectedPatientData.Patient[0].FullName || "",
                                    "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
                                    "MobileNo": selectedPatientData.Patient[0].MobileNo || 0,
                                    "DOB": selectedPatientData.Patient[0].DOB || "",
                                    "AgeInYears": selectedPatientData.Patient[0].AgeInYears || 0,
                                    "AgeInMonths": selectedPatientData.Patient[0].AgeInMonths || 0,
                                    "S3URL": selectedPatientData.Patient[0].S3URL || "",
                                    "SocialSecurityNo": selectedPatientData.Patient[0].SocialSecurityNo || "",
                                    "BloodGroupName": selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                                    "MaritalStatusName": selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                                    "ExternalComanagerName": selectedPatientData.Patient[0].ExternalComanagerName || '',
                                    "InternalComanagerName": selectedPatientData.Patient[0].InternalComanagerName || '',
                                    "PCPDoctorName": selectedPatientData.Patient[0].PCPDoctorName || '',
                                    "RefferalName": selectedPatientData.Patient[0].ReferralName || '',
                                    "ContactInfo": {
                                        "EmailID": selectedPatientData.Patient[0].EmailId || "",
                                    }
                                }

                                $scope.PostalAddressSummaryObj = {
                                    "AddressId": selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                                    "AddressLine1": selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                                    "AddressLine2": selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                                    "ZipCode": selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                                    "CountyId": selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                                    "CountyName": selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                                    "CityName": selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                                    "CityId": selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                                    "StateName": selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                                    "StateId": selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                                    "CountryName": selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                                    "CountryId": selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
                                }

                                $scope.PermanentAddressSummaryObj = {
                                    "AddressId": selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                                    "AddressLine1": selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                                    "AddressLine2": selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                                    "ZipCode": selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                                    "CountyId": selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                                    "CountyName": selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                                    "CityName": selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                                    "CityId": selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                                    "StateName": selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                                    "StateId": selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                                    "CountryName": selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                                    "CountryId": selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
                                }

                                $scope.PatientOfficeNumber = selectedPatientData.Patient[0].OfficeAreaCode + selectedPatientData.Patient[0].PatientOfficeNumber;
                                var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
                                $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

                                $scope.PatientMobileNumber = selectedPatientData.Patient[0].MobileNo;
                                var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
                                $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

                                $scope.DemographicSummaryObj = {
                                    "LanguageName": selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                                    "Proficiency": selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                                    "SexualOrientation": selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                                    "GenderIdentityStatus": selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
                                }

                            }
                        }
                        function ongetPatientDetailsError(error) {
                            console.log(error);
                        }
                    }



                    $scope.AppointmentNotes = "";
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.close("close");

                    };

                    $scope.AppointmentNotesArray = $scope.AppointmentNotesArray || [];
                    if ($scope.AppointmentNotesArray.length > 0) {
                        var count = 0
                        $scope.IsshowNotes = false;
                        angular.forEach($scope.AppointmentNotesArray, function (aitem) {
                            if (aitem.Notes !== '') {
                                aitem.IsNotes = true;
                                count++;
                            }
                            else {
                                aitem.IsNotes = false;
                            }
                        });
                        if (count > 0) {
                            $scope.IsshowNotes = true;
                        }
                    }
                    $scope.addNotestoAppointment = function (Type) {
                        if ($scope.selectedAppointmentObject.NotesTab == 1) {
                            if ($scope.AppointmentNotes === "") {
                                alertify.error("please enter notes");
                                return false;
                            }
                            if ($scope.ApptSubmitText == 'Update') {
                                $scope.obj = {
                                    "AppointmentNoteId": $scope.AppointmentNoteId,
                                    "AppointmentId": mainObject.apptitem.AppointmentId, // $scope.mainPatientProfileObj.AppointmentId,
                                    "Notes": $scope.AppointmentNotes || "",
                                    "DeleteInd": "N",
                                    "CreatedBy": "",
                                    "UserId": $scope.UserId,
                                    "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
                                }

                            } else {
                                $scope.obj = {
                                    "AppointmentNoteId": 0,
                                    "AppointmentId": mainObject.apptitem.AppointmentId , // $scope.mainPatientProfileObj.AppointmentId,
                                    "Notes": $scope.AppointmentNotes || "",
                                    "DeleteInd": "N",
                                    "CreatedBy": "",
                                    "UserId": $scope.UserId,
                                    "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
                                }
                            }
                            $scope.AppointmentNotesArray2 = [];
                            $scope.AppointmentNotesArray2.unshift($scope.obj);

                            var params = {
                                "AppointmentId": mainObject.apptitem.AppointmentId, //$scope.mainPatientProfileObj.AppointmentId,
                                "UserId": $scope.UserId,
                                "AppointmentNotes": $scope.AppointmentNotesArray2,
                                "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || ""
                            };
                        } else {
                            var params = {
                                "AppointmentId": mainObject.apptitem.AppointmentId , // $scope.mainPatientProfileObj.AppointmentId,
                                "UserId": $scope.UserId,
                                "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || ""
                            };
                        }
                        console.log(params);

                        eHnoteMainAppointmentService.AddUpdateAppointmentNotesinPopup(params).then(function (resp) {
                            console.log(resp);
                            if (resp.data.status == "Success") {
                                if (Type == "Delete" && $scope.selectedAppointmentObject.NotesTab == 2) {
                                    alertify.success("Routslip Notes deleted successfully");
                                }
                                else if ($scope.selectedAppointmentObject.NotesTab == 1) {
                                    alertify.success("Appointment Notes Added Successfully");
                                } else if ($scope.selectedAppointmentObject.NotesTab == 2) {
                                    alertify.success("Routslip Notes added successfully");
                                }
                                $scope.AppointmentNotes = "";
                                $scope.getApptAdditionalDetails();
                            }
                            $scope.ApptSubmitText = 'Save';
                        }, function (err) {
                            console.log(err);
                            alertify.error("Getting Failed");
                        });


                    };

                    $scope.ClearDetails = function () {
                        $uibModalInstance.close("save");
                    }

                    $scope.clearNotestoAppointment = function () {
                        $scope.AppointmentNotes = "";
                        $scope.ApptSubmitText = 'Save';
                    }

                    $scope.getApptAdditionalDetails = function () {
                        var Apptid = mainObject.apptitem.AppointmentId
                        eHnoteMainAppointmentService.getAdditionalApptDetailsById(Apptid).then(function (resp) {

                            resp.data = resp.data || [];
                            console.log(resp);

                            if (resp.data.length > 0) {
                                $scope.AppointmentNotesArray = resp.data[0].AppointmentNotes || [];
                                if ($scope.AppointmentNotesArray.length > 0) {
                                    var count = 0
                                    $scope.IsshowNotes = false;
                                    angular.forEach($scope.AppointmentNotesArray, function (aitem) {
                                        if (aitem.Notes !== '') {
                                            aitem.IsNotes = true;
                                            count++;
                                        }
                                        else {
                                            aitem.IsNotes = false;
                                        }
                                    });
                                    if (count > 0) {
                                        $scope.IsshowNotes = true;
                                    }
                                }
                                if (resp.data[0].AppointmentDetails.length > 0) {
                                    $scope.selectedAppointmentObject.OtherNotes = resp.data[0].AppointmentDetails[0].OtherNotes || "";
                                    $scope.selectedAppointmentObject.OtherNotesCreatedBy = resp.data[0].AppointmentDetails[0].ModifiedBy || "";
                                    $scope.selectedAppointmentObject.OtherNotesCreatedDt = resp.data[0].AppointmentDetails[0].ModifiedDt || "";
                                }
                                if (resp.data[0].PatientInsuranceList.length > 0) {
                                    $scope.SelectedAppointmentObj.PatientInsuranceList = resp.data[0].PatientInsuranceList || [];
                                }
                            } else {
                                $scope.AppointmentNotesArray = [];
                            }
                        }, function (err) {
                            alertify.error("Getting data failed");
                        });
                    }
                    $scope.selectedAppointmentObject.OtherNotes = $scope.SelectedAppointmentObj.OtherNotes || "";
                    $scope.selectedAppointmentObject.OtherNotesCreatedBy = $scope.SelectedAppointmentObj.OtherNotesCreatedBy || "";
                    $scope.selectedAppointmentObject.OtherNotesCreatedDt = $scope.SelectedAppointmentObj.OtherNotesCreatedDt || "";
                    $scope.getApptAdditionalDetails();
                    $scope.DeleteApptNote = function (item, index) {

                        if ($scope.UserId == item.UserId) {
                            if (item.AppointmentNoteId == 0) {
                                $scope.AppointmentNotesArray.splice(index, 1);
                            } else {
                                angular.forEach($scope.AppointmentNotesArray, function (Aitem) {
                                    if (Aitem.AppointmentNoteId == item.AppointmentNoteId) {
                                        Aitem.DeleteInd = "Y";
                                    }
                                });
                                var params = {
                                    "AppointmentId": $scope.mainPatientProfileObj.AppointmentId,
                                    "UserId": $scope.UserId,
                                    "AppointmentNotes": $scope.AppointmentNotesArray,
                                    "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || ""
                                };

                                eHnoteMainAppointmentService.AddUpdateAppointmentNotesinPopup(params).then(function (resp) {
                                    if (resp.data.status == "Success") {
                                        alertify.success("Deleted Successfully");
                                        $scope.AppointmentNotes = "";
                                        $scope.getApptAdditionalDetails();
                                    }
                                }, function (err) {
                                    console.log(err);
                                    alertify.error("Getting Failed");
                                });

                            }
                        }
                    }

                    $scope.EditApptNote = function (item, index) {
                        $scope.AppointmentNotes = item.Notes;
                        $scope.AppointmentNoteId = item.AppointmentNoteId
                        $scope.ApptSubmitText = 'Update';
                    }

                    $scope.Notestabchanges = function (Type) {
                        $scope.selectedAppointmentObject.NotesTab = Type || 1;
                    }
                    $scope.AddOtherNotes = function () {
                        if ($scope.selectedAppointmentObject.Routeslipnotes == '') {
                            alertify.error("Please Enter Notes");
                            return false;
                        }

                        $scope.selectedAppointmentObject.OtherNotes = $scope.selectedAppointmentObject.Routeslipnotes || '';
                        $scope.selectedAppointmentObject.OtherNotesCreatedDt = $filter('date')(new Date(), "MM-dd-yyyy h:mm a") || "";
                        $scope.selectedAppointmentObject.OtherNotesCreatedBy = $scope.DoctorName || "";
                        $scope.selectedAppointmentObject.Routeslipnotes = '';
                        $scope.IsOtherUpdate = false;
                        $scope.addNotestoAppointment();
                    }
                    $scope.IsOtherUpdate = false;
                    $scope.Editothernotes = function () {
                        $scope.selectedAppointmentObject.Routeslipnotes = $scope.selectedAppointmentObject.OtherNotes || '';
                        $scope.selectedAppointmentObject.OtherNotes = '';
                        $scope.IsOtherUpdate = true;
                    }
                    $scope.DeleteOtherNotes = function () {
                        $scope.selectedAppointmentObject.OtherNotes = '';
                        $scope.selectedAppointmentObject.Routeslipnotes = '';
                        $scope.selectedAppointmentObject.OtherNotesCreatedDt = '';
                        $scope.selectedAppointmentObject.OtherNotesCreatedBy = '';
                        $scope.IsOtherUpdate = false;
                        $scope.addNotestoAppointment("Delete");
                    }
                    $scope.getOtherNotesLog = function (item) {

                        var obj = {
                            "UserId": $scope.UserId,
                            "AppointmentID": $scope.mainPatientProfileObj.AppointmentId || 0,

                        }
                        eHnoteMainAppointmentService.GetOtherNotesLog(obj).then(function (resp) {
                            console.log(resp);
                            if (resp.data.Status === 'Success') {
                                if (resp.data.rows.length > 0) {
                                    $scope.OtherNotesLogArray = [];
                                    $scope.OtherNotesLogArray = angular.copy(resp.data.rows);
                                }
                            }
                        }, function (err) {
                            console.log(err);
                        });

                    }
                    $scope.OtherNotesLog = {
                        templateUrl: 'OtherNotesLog.html',
                    };

                   

                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
            }, function (cancel) {
            });
        };


        $scope.NavToCancleAppt = function (item) {

            item.PatientDetails = $scope.PatientDetailsInfo;
            var datetime = item.AppointmentDate + "T" + item.StartTime;
            var MobileNumber = (item?.PatientDetails?.ContactInfo?.HomeCountryCode || '') +
                (item?.PatientDetails?.ContactInfo?.HomeAreaCode || '') +
                (item?.PatientDetails?.ContactInfo?.HomeNumber || '');
            let S3URL = item.PatientDetails?.S3URL || '';

            var mobileno = eHnoteUserDataService.UsMobileFormatChange(MobileNumber);
            $scope.DisplayNumber = mobileno.UsFormatMobileNumber;

            let Obj = {
                "PatientDisplayId": item.PatientDisplayId || '',
                "PatientName": item.PatientDetails?.FullName || '',
                "S3URL": S3URL || '',
                "PatientID": item.PatientId || 0,
                "AppointmentID": item.AppointmentId || 0,
                "AppointmentDateTime": datetime || '',
                "ConsultationDt": item.AppointmentDate || '',
                "DoctorFullName": item.AppointmentDoctorFirstName || '',
                "PatientFullName": item.PatientDetails?.FullName || '',
                "AppointmentStatusId": item.AppointmentStatusId || 0,
                "CancelStTime": item.StartTime || '',
                "CancelEdTime": item.EndTime || '',
                "sendPatientSms": item.PatientDetails?.ContactInfo?.IsPatientSmsInd || false,
                "sendPatientEmail": item.PatientDetails?.ContactInfo?.IsPatientEmailInd || false,
                "DoctorID": item.AppointmentDoctorId || 0,
                "DoctorVisitRsnID": item.AppointmentTypeId || 0,
                "MobileNumber": MobileNumber || 0,
                "EmailId": item.PatientDetails?.EmailId || "",
                "CommunicationEmailId": item.CommunicationEmailId || "",
                "DisplayNumber": $scope.DisplayNumber || 0,
                "IsTeleMedicineSlot": item.IsTeleMedicineSlot || false,
                "SubSpecializationId": item.SubSpecializationId || 0,
                "BranchSubSpecializationId": item.BranchSubSpecializationId || 0,
                "CheckinStatusId": item.CheckinStatusId || 1,
                "VisitTypeId": item.VisitTypeId || null,
                "AppointmentPatientTypeId": item.AppointmentPatientTypeId || null,
                "PaymentTypeId": item.PaymentTypeId || null,
                "BookingStatusId": item.BookingStatusId || null,
                "BookingTypeId": item.BookingTypeId || null,
                "OtherProviderDoctorID": 0,
                "SurgeryReferralDoctorId": 0,
                "ReasonTypeId": 0,
                "DoctorEmail": item.DoctorEmail || '',
                "cancelHospitalId": item.BranchId || 0,
                "LanguageID": item.PatientDetails?.AdditionalInfo?.LanguageID || 0,
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/CancelAppointmentPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return Obj; }
                },
                "controller": "CancelAppointmentPopupCtrl",
            });

            $scope.mInstanceAdd.result.then(function (resp) {
                $scope.init();
            }, function () {

            });
        };
        $scope.navtoOpenAddDepositAmount = function () {
            var PatientObj = {
                "PatientFullName": $scope.PatientDetailsInfo.FullName,
                "FirstName": $scope.PatientDetailsInfo.FirstName,
                "LastName": $scope.PatientDetailsInfo.LastName,
                "MiddleName": $scope.PatientDetailsInfo.MiddleName,
                "Gender": $scope.PatientDetailsInfo.Gender,
                "Sex": $scope.PatientDetailsInfo.Gender,
                "PatientId": $scope.PatientDetailsInfo.PatientID,
                "PhAreaCD": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '',
                "PhCntryCD": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode || '',
                "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber || '',
                "MobileNo": $scope.PatientDetailsInfo.ContactInfo.MobileNumber || '',
                "DOB": $scope.PatientDetailsInfo.DOB || '',
                "OldMRNo": $scope.PatientDetailsInfo.OldMrno || '',
                "PatientDisplayId": $scope.PatientDetailsInfo.PatientDisplayID || '',
                "S3URL": $scope.PatientDetailsInfo.S3URL || '',
                "AgeInYears": $scope.PatientDetailsInfo.AgeInYears||0,
                "AgeInMonths": $scope.PatientDetailsInfo.AgeInMonths || 0,
                "Address1": $scope.PatientDetailsInfo.PostalAddress.AddressLine1 || '',
                "Address2": $scope.PatientDetailsInfo.PostalAddress.AddressLine2 || '',
                "CityName": $scope.PatientDetailsInfo.PostalAddress.CityName || '',
                "StateName": $scope.PatientDetailsInfo.PostalAddress.StateName || '',
                "StateCode": $scope.PatientDetailsInfo.PostalAddress.StateCode || '',
                "ZipCode": $scope.PatientDetailsInfo.PostalAddress.ZipCode || '',
                "CheckInBy": "",
                "BookingStatusId": null,

            };

            $scope.AllBranchesList = $scope.AllBranchesList.filter(b => b.ClinicId !== 0);

            $scope.obj = {
                "PatientId": $scope.mainPatientProfileObj.PatientId,
                "ScreenType": '',
                "Incomingfrom": '',
                "Type": '',
                "UsersList": $scope.mainPatientProfileObj.AllUsersList,
                "Patientobj": PatientObj,
                "OrganizationFacilityList": $scope.mainPatientProfileObj.OrganizationFacilityList,
                "DepositTypes": $scope.mainPatientProfileObj.DepositTypes,
                "WriteOffReasons": $scope.mainPatientProfileObj.WriteOffReasons,
                "BillingProviderName": "",
                "FacilityName": "",
                "TotalPatientBalance": 0,
                "AllBranchesList": $scope.AllBranchesList || [],
                "HospitalId": $scope.HospitalId || 0,
                "CardTypesData": $scope.mainPatientProfileObj.CardTypesData || [],
            }

            var modalInstance = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
                "controller": "UsAddPatientDepositsCtrl",
                "resolve": {
                    "Selectobj": function () { return $scope.obj; },
                },
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__ninety--  "

            });
            modalInstance.result.then(function () {
                getPatientDepositAmountById();
            }, function () { });
        }
        function GetApptInsurancedetail() {
            var InsObj =
            {
                "AppointmentId": $scope.AppointmentID||0,
                "PatientId": $scope.PatientID||0,
                "SendPlanDetailsInd": 1
            }
            eHnoteInsuranceService.GetAppointmentInsuranceDetailsListByStatus(InsObj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.patientInsuranceTpasArray = resp.data.rows || [];
                    if ($scope.patientInsuranceTpasArray.length > 0) {
                        $scope.IsInsuranceAvailable = true;
                    }
                }
            }, function (err) {
                alertify.error("Getting Insurance Data Failed");
            });
        }
        $scope.PreviousUrl = "/op";
        $scope.EditAppointmentPopup = function () {
            var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
            let AppointmentDoctorId = 0;
            if ($scope.RoleId == 1 | $scope.RoleId == 43) {
                AppointmentDoctorId = $scope.DoctorId;
            }
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
                "PatientId": $scope.PatientID || null,
                'IsComingFrom': 'PatientProfile',
                'type': $scope.PreviousUrl === "/op" ? 'op' : ($scope.PreviousUrl === "ASC" ? 'ASC' : '')    //$scope.cacheStorageItem.type
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            BookApptPopupOpenedv2();
        }

        $scope.EditAppointmentPopup1 = function (item, ttype) {

            var Sarray = item.StartTime.split(":");
            var stime = Sarray[0] + ":" + Sarray[1];
            var date = moment(item.ConsultationDt).format();
            var earray = item.EndTime.split(":");
            var etime = earray[0] + ":" + earray[1];
            var apptime = item.AppointmentId;
            var VisitTypeId = item.AppointmentVisitReasonId || "";
            VisitTypeId = VisitTypeId != '' ? VisitTypeId : 0;
            var VisitRemarks = item.VisitRemarks || "";

            $scope.AppDate = [stime, etime, apptime, item.AppointmentVisitReasonName ? item.AppointmentVisitReasonName : "", item.ReferralSourceId ? item.ReferralSourceId : "", VisitTypeId, VisitRemarks];

            $scope.calenderDate = moment(date).format("DD-MMM-YYYY" + " " + stime);

            $scope.PageName = "reschedule";

            let surgeryList = [];
            if (item.AppointmentTypeId == 7) {
                surgeryList = angular.copy(item.PreAdmSurgeryList);

            } else if (item.AppointmentTypeId == 4 || item.AppointmentTypeId == 14) {
                surgeryList = angular.copy(item.SurgeryList);
            }

            let AppointmentDoctorId = item.AppointmentDoctorId || 0;
            let OrganizationId = item.OrganizationId || 0;
            var Obj = {
                "PageName": "reschedule",
                "AppDate": $scope.AppDate,
                "ispatientExistsval": true,
                "calenderDate": $scope.calenderDate,
                "AppointmentDate": item.AppointmentDate,
                "AppointmentId": item.AppointmentId || null,
                "PatientId": item.PatientId || null,
                'IsComingFrom': '',
                "DoctorId": AppointmentDoctorId,
                "BranchId": OrganizationId,
                "StartTime": stime || "",
                "EndTime": etime,
                'type': 'op',
                "SurgeryList": surgeryList || []
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);

            if (ttype == 2) {
                BookApptPopupOpenedv2();
            } else {
                BookApptPopupOpened();
            }
        };
        function BookApptPopupOpenedv2() {
            var openBookAppt = "";
            $scope.bookapptSetupPopUp = $uibModal.open({
                "templateUrl": "templates/appointment/BookAppointmentPopupv3.html",
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "controller": "UsBookAppointmentPopupv2",
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },
                    "openBookAppt": function () { return openBookAppt; },
                    "BranchList": function () { return $scope.AppListdoctoraddress || []; }
                }
            });
            $scope.bookapptSetupPopUp.result.then(function (resp) {

            }, function () { });
        }
        function getPatientDepositAmountById() {
            var obj = {
                "DepositFrom": "",
                "DepositTo": "",
                "PatientId": $scope.PatientID,
                "OrganizationId": $scope.HospitalId,
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
        };
        $scope.TransforRoom = function () {
            if ($scope.patientInsuranceTpasArray.length > 0) {
                let currentdate = $filter('date')(new Date(),'yyyy-MM-dd');
                let appointementdate = $scope.mainPatientProfileObj.AppointmentDate;
                if (currentdate == appointementdate) {
                    let primaryFilteredInsurances = $filter('filter')($scope.patientInsuranceTpasArray, { 'IdentifierId': 1 }, true)[0] || {};
                    if (Object.keys(primaryFilteredInsurances).length > 0) {
                        const expiry = primaryFilteredInsurances?.ExpiryDate;
                        if (expiry) {
                            const expiryDate = new Date(expiry);
                            if (expiryDate < new Date()) {
                                alertify.error("The insurance is Expired");
                            }
                        }
                    }
                }
            }
            resolveobj.CloseandOpenFlag = true;
            $scope.uibclose();
        };
        $scope.CheckOutPopup = function () {
            resolveobj.CloseandOpenFlag = true;
            $scope.uibclose();
        };
        // set up recall
        $scope.Navtosetuprecall = function () {
            $scope.mInstancesetuprecall = $uibModal.open({
                "templateUrl": "setuprecall.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "lg",
                "windowClass": "modal__sixty--  ",
                "keyboard": false,
            });
            $scope.mInstancesetuprecall.result.then(function (data) {
                console.log(data);

            }, function (cancel) {
            });
        }
        $scope.closeSetuprecallModal = function () {
            $scope.mInstancesetuprecall.dismiss('cancel');
        };

        $scope.openPoitOfSalePopup = function () {
            let obj = {
                "ScreenType": "PatientPos",
                "PatientId": $scope.PatientID

            }
            $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID = $scope.PatientDetailsInfo.PatientDisplayID;
            $scope.mainPatientProfileObj.PatientDetailSummary.FullName = $scope.PatientDetailsInfo.FirstName + $scope.PatientDetailsInfo.LastName;
            $scope.mainPatientProfileObj.PatientDetailSummary.Gender = $scope.PatientDetailsInfo.Gender;
            $scope.mainPatientProfileObj.PatientDetailSummary.DOB = $scope.PatientDetailsInfo.DOB;
            $scope.mainPatientProfileObj.PatientDetailSummary.S3URL = $scope.PatientDetailsInfo.S3URL;
            $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears = $scope.PatientDetailsInfo.AgeInYears;
            $scope.mainPatientProfileObj.PatientDetailSummary.AgeInMonths = $scope.PatientDetailsInfo.AgeInMonths;
            $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo = $scope.PatientDetailsInfo.ContactInfo;
            $scope.mainPatientProfileObj.BillingProviderList = $scope.BillingProvidersList;
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
                "controller": "UsPointOfSalePopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "mainObj": function () { return obj || null; },
                    "mainBillerDataObj": function () { return $scope.mainPatientProfileObj || null; },
                },
                "windowClass": "modal__popup--1 in",


            });

            mInstanceAdd.result.then(function (resp) {
                $scope.GetOrganizationPOSInvoices();
            }, function () { });
        };

        // reslove functionality
       
        //$scope.ReslovePatientAlert = function (item) {
        //    $scope.isfromresolveObj.IsfromResolveInd = true;
        //    $scope.isfromresolveObj.IsResolveitem = angular.copy(item) || "";
        //    $scope.NavToCheckInsubTab(4);
        //};
        $scope.ReslovePatientAlert = function (item) {

            item = item || null;
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {
                var obj = {
                    UserId: $scope.UserId,
                    OrganizationId: $scope.HospitalId,
                    PatientNoteId: item.PatientNoteId || 0,
                    AppointmentNoteId: item.AppointmentNoteId || 0,
                    NoteTypeId: item.NoteTypeId,
                    NoteTypeName: item.NoteType,
                    PatientId: item.PatientId,
                    AppointmentId: item.AppointmentId,
                    DeleteInd: item.DeleteInd,
                    Notes: item.PatientNotes,
                    CreateAlert: 1,
                    AlertData: null
                };

                if (item.AlertData !== null) {
                    obj.AlertData = {
                        AlertId: item.AlertData.AlertId,
                        StartDate: item.AlertData.StartDate,
                        EndDate: item.AlertData.EndDate || null,
                        PriorityId: item.AlertData.PriorityId,
                        PriorityName: item.AlertData.PriorityName,
                        AlertTagId: item.AlertData.AlertTagId,
                        AlertTagName: item.AlertData.AlertTagName,
                        AlertMessage: item.AlertData.AlertMessage,
                        StatusId: item.AlertData.StatusId,
                        Status: item.AlertData.Status,
                        DeleteInd: "Y",
                        AlertTypesList: item.AlertData.AlertTypesList || []
                    };
                    angular.forEach(item.AlertData.AlertTypesList, function (pitem) {
                        pitem.IsChecked = false;
                        pitem.DeleteInd = 'Y';
                    });
                }

                eHnoteInsuranceService.AddUpdatePatientNoteandAlertData(obj).then(function (resp) {
                    if (resp.data.status == "Success") {
                        alertify.success("Patient alert resolved successfully!");
                        $scope.getPatientAlertsList();
                    }
                }, function onerror(err) {
                    console.log(err);
                });

            },
                function () {
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });
        };

        $scope.navtocreatecaim = function (item) {
            item = item || {};
            let obj = {
                "PatientId": $scope.patientid || 0,
                "PatientFullName": $scope.PatientFullName  || '',
                "PatientDisplayID": $scope.PatientDisplayID || 0,
                "StatusId": 2,
                "AlertNoteTypeId": 3,
                "MasterPriority": $scope.MasterPriority,
                "MasterAlertTypes": $scope.MasterAlertTypes,
                "MasterAlertTag": $scope.MasterAlertTag,
                "MasterAlertNoteType": $scope.MasterAlertNoteType,
                "IsdesiableNotesTypeInd": true,
                "AlertItem": item
            }

            $scope.mInstanceAddalert = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdatePatientAlerts.html",
                "controller": "USPatientAlertsCtrl",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__sixty-- ",
                "resolve": {
                    "PatientAlertsobj": function () { return obj; },
                },
            });
            $scope.mInstanceAddalert.result.then(function () {
                console.log("Modal closed successfully");
                $scope.getPatientAlertsList();
            }, function () {
                console.log("Modal dismissed");
                $scope.getPatientAlertsList();
            });
        };

        $scope.editPatientNotes = function (sitem) {
            sitem = sitem || {};
            $scope.navtocreatecaim(sitem);
        };
        $scope.SelectedPatientNotesPopover = function (item) {
            $scope.PatientNotesLogArray = item || [];

        };
        $scope.PatientNotesAdditionalinfo = {
            templateUrl: 'PatientNotesAdditionalinfo.html',
        };
        $scope.PatientOnBoardingQRCodeViewer = {
            templateUrl: 'PatientOnBoardingQRCodeViewer.html',
        };

        $scope.GetSetReminderId = function (Id) {
            $scope.PatientId = Id || 0;
            $scope.SetReminderArray = [];
            var param = {
                /*"AppointmentId": $scope.appointmentid || 0,*/
                "AppointmentId": 0,
                "PatientId": $scope.PatientId || $scope.appointmentinfo.PatientID || 0,
                "IsHistory": false
            }

            eHnoteMainAppointmentService.GetSetReminderDetails(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.SetReminderArray = angular.copy(resp.data.rows);
                    //$scope.mInstanceAdd.close($scope.SetReminderArray);
                    if ($scope.SetReminderArray.length > 0) {
                        var List = $filter("filter")($scope.SetReminderArray, { "TypeId": 2,"FollowUpId":0, "AppointmentId": $scope.cacheStorageItem.AppointmentID }, true) || [];
                        if (List.length > 0) {
                            //   angular.forEach(List, function (item) {
                            if (List[0].AppointmentId == $scope.cacheStorageItem.AppointmentID) {
                                $scope.ReminderDate = List[0].Date || '';
                            }
                            // });
                        } else {
                            $scope.ReminderDate = '';
                        }
                    } else {
                        $scope.ReminderDate = '';
                    }
                }
            }, function (err) {
                alertify.error("Getting Failed");
            });
        }


        $scope.ClickRemindersPopup = function (RemainderItem, type, item) {
            $scope.IsAddtoRecall = false;
            RemainderItem = RemainderItem || '';
            type = type || 1;
            if (RemainderItem != '') {
                RemainderItem.ReminderDate = RemainderItem.ReminderDate || '';
                RemainderItem.FollowUpId = RemainderItem.FollowUpId || 0;
            }
            var Reminderobj = {
                "TypeId": 2,
                "appointmentid": $scope.cacheStorageItem.AppointmentID || 0,
                "PatientID": $scope.cacheStorageItem.PatientID || $scope.cacheStorageItem.patientid || 0,
                "IsFrom": "",
            }
            if (RemainderItem != '') {
                if ((RemainderItem.ReminderDate != '' && RemainderItem.ReminderDate != undefined) && (RemainderItem.FollowUpId != 0 && RemainderItem.FollowUpId!=undefined) && $scope.SetReminderArray.length > 0) {
                    var filteredItem = $filter("filter")($scope.SetReminderArray, { FollowUpId: RemainderItem.FollowUpId }, true);
                    RemainderItem = filteredItem.length > 0 ? filteredItem[0] : '';
                } else {
                    var filteredItem = $filter("filter")($scope.SetReminderArray, { "TypeId": 2,"FollowUpId":0 ,"AppointmentId": $scope.Cancelappointmentinfo.AppointmentID }, true);
                    RemainderItem = filteredItem.length > 0 ? filteredItem[0] : '';
                }
            }
            //if (RemainderItem != '') {
            //    if (RemainderItem.CreatedById != $scope.UserId) {
            //        alertify.error("User doesn't have access to edit reminder!");
            //        return;
            //    }
            //}
            item = item || '';
        
            $scope.clinicDoctorList = [];
         
            let getParams = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ReasonTypeId": 1,
                "SearchText": "",
                "VisitTypeId": null
            };
            eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(getParams).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.GetVisitReasonsArray = [];
                        $scope.GetVisitReasonsArray = $filter("filter")(resp.data.rows, function (kitem) {
                            return kitem.ActiveIND == "Y";
                        });



                        $scope.reminderModalInstance = $uibModal.open({
                            "templateUrl": "templates/uibpopups/SetReminderPopover.html",
                            "controller": "UsRemindersPopupCtrl",
                            "backdrop": "static",
                            "scope": $scope,
                            "keyboard": false,
                            "size": "lg",
                            /*"windowClass": "modal-full",*/
                            "resolve": {
                                //"UserId": function () { return $scope.UserId; },
                                //"HospitalId": function () { return doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID; },
                                
                                "Reminderobj": function () { return Reminderobj; },
                                "RemainderItem": function () { return RemainderItem; },
                              /*  "clinicDoctorList": function () { return $scope.clinicDoctorList; },*/
                                "ReminderTab": function () { return type; },
                                "ReturntoofficeItem": function () { return item; },
                            },
                        });
                        $scope.reminderModalInstance.result.then(function (resp) {
                            //$scope.SetReminderArray = resp || [];
                            resp = resp || '';
                            $scope.IsAddtoRecall = false;
                            if (resp!='') {
                                $scope.GetSetReminderId(resp);
                            } else {
                                $scope.GetSetReminderId($scope.cacheStorageItem.PatientID);
                            }
                            $scope.getpatientconsultationbyId();

                        }, function () {

                        });

                    }

                }
            });


        };
        $scope.IsQRCodeShow = false;
        $scope.GenerateQRCode = function () {
            let HospitalId = $scope.HospitalId || 0;
            let PatientID = $scope.PatientID || 0;
            let AppointmentID = $scope.AppointmentID || 0;

            $scope.SelectedAppointmentObj = $scope.SelectedAppointmentObj || {};
            $scope.SelectedAppointmentObj.QRCodeUrl = '';
            $scope.IsQRCodeShow = false;
            if (HospitalId == 0) {
                alertify.error("Getting Failed");

                return false;
            }
            if (PatientID == 0) {
                alertify.error("Getting Failed");

                return false;
            }
            if (AppointmentID == 0) {
                alertify.error("Getting Failed");

                return false;
            }
            console.log($scope.MasterPatientId);
            eHnoteUserAppointmentDataService.GenerateAndUploadQRCodeService(HospitalId, PatientID, AppointmentID, $scope.MasterPatientId).then(function (response) {
                if (response.data != undefined) {
                    console.log(response);
                    $scope.IsQRCodeShow = true;
                    $scope.SelectedAppointmentObj.QRCodeUrl = response.data||'';
                }
            });
        }
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

     }]);

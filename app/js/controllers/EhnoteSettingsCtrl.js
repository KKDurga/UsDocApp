"use strict";
eHnoteWebApp.controller("EhnoteSettingsCtrl", ["$scope", "$rootScope", "$location", "datapersistanceFactory", "eHnoteCacheStorageService", "eHnoteValidateUsersDataService", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteSettingsDataService", "alertify", "Upload", "$window", "Lightbox", "eHnoteAdminUserServices", "eHnoteConditionsDataService", "$http", "loginCookieFactory", "eHnoteDiagnosisDataServices", "eHnoteProcedureDataService", "$timeout", "$filter", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteSurgeryService", "InventoryService", "HInventoryService", "eHnoteOrgReferralDataServices", "eHnoteLabService", "$q", "$uibModal", "eHnoteMainAppointmentService", "eHnoteMainAdminServices", "eHnotePatientAddressDataServices", "eHnoteOrgRewardDataServices", "eHnotePatientDataService", "eHnoteUserDataService", "eHnoteInsuranceService", "textAngularManager", "$compile", "eHnoteAdminDepartmentService",
    function ($scope, $rootScope, $location, datapersistanceFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteSettingsDataService, alertify, Upload, $window, Lightbox, eHnoteAdminUserServices, eHnoteConditionsDataService, $http, loginCookieFactory, eHnoteDiagnosisDataServices, eHnoteProcedureDataService, $timeout, $filter, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteSurgeryService, InventoryService, HInventoryService, eHnoteOrgReferralDataServices, eHnoteLabService, $q, $uibModal, eHnoteMainAppointmentService, eHnoteMainAdminServices, eHnotePatientAddressDataServices, eHnoteOrgRewardDataServices, eHnotePatientDataService, eHnoteUserDataService, eHnoteInsuranceService, textAngularManager, $compile, eHnoteAdminDepartmentService) {
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.InvestigationFocus = false;
        $scope.AddCategory = "Add Category";
        $scope.templateSettings = {};
        $scope.templateSettings.pageName = "Billing";
        $scope.selectedItemLetterHeadValue = "No";
        $scope.activeSubTab = 1;
        $scope.letterObj = {};
        $scope.mdcl = {};
        var object = {};
        

        if (userLoginDetails.loggedinStatus) {
            $rootScope.showMainPageHeader = true;
        } else {
            $rootScope.showMainPageHeader = false;
            datapersistanceFactory.clearAll();
            $location.path("/login");
            return;
        }
        $scope.isDeleteMedCondition = "N";
        $scope.RoleId = userLoginDetails.RoleID;
        // $scope.HospitalId = userLoginDetails.HospitalID;
        $scope.UserSettingObject = datapersistanceFactory.getItem("UserSettingsData");
        $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.defaultbranch = [];
        $scope.clearvalidation = function () {
            $scope.$broadcast('RefValidation', {});
        };
        $scope.userBranchesForConsultationFee = [];

        $scope.clearVisitReasonvalidation = function () {
            $scope.$broadcast('VisitValidation', {});
        };
        $scope.MedicineOrgObj = null;
        $scope.searchMedicineHospitalTxt = "";
        $scope.userBranchesForMedicines = [];

        $scope.settingConsultationTab = true;
        $scope.addCategoryId = 0;
        angular.element('.settings-menu-left>ul').css({ 'height': screen.height - 190, 'overflow-y': 'auto', 'overflow-x': 'hidden' });

        $scope.BillItemTabActive = 1;

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.labtabvalues = { "Labpageno": '' };

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || 0;
        }
        function getDefaultLabelSettings() {
            return {
                "PrinterTypeId": 1,
                "OrganizationId": $scope.HospitalId,
                "PrinterTypeName": "DYMO",
                "LabelWidth": 19,
                "Labelheight": 51,
                "Fontsize": 6,
                "LeftStartSize": 10,
                "TopStartSize": 10,
                "SpaceBetweenLine": 10,
                "PrintBarcode": false,
                "Barcodewidth": 200,
                "Barcodeheight": 30,
                "VerticalSpaceOfBarcode": 30,
                "PageOrientation": "Landscape",
                "DeleteInd": 'N'
            };
        }
        $scope.DefacultLabelSizeObj = getDefaultLabelSettings();
        $scope.ChangePrinter = function (type) {
            $scope.DefacultLabelSizeObj.PrinterTypeName = type;
        }

        $scope.onBranchChange = function (selectedClinicId) {
            let selectedBranch = $scope.BranchesListArray.find(branch => branch.ClinicId === selectedClinicId);
            if (selectedBranch) {
                $scope.DefacultLabelSizeObj.OrganizationId = selectedBranch.ClinicId;
                $scope.GetLabelPrintSettingsData($scope.DefacultLabelSizeObj.OrganizationId);
            } else {
                $scope.DefacultLabelSizeObj.OrganizationId = null;
            }
        };

        $scope.IsRosCarrieForwordDisable = false;
        $scope.IsPayorEditable = true;
        $scope.GetOrganizationSettings = function () {
            //eHnoteSettingsDataService.GetOrganizationSettings({ "ParentOrganizationId": $scope.ParentHospitalID }).then(function (resp) {
            eHnoteSettingsDataService.GetOrganizationSettings($scope.ParentHospitalID).then(function (resp) {
                resp.data.SettingDetails.ConsultationSettings.IsRosCarrieForword = resp.data.SettingDetails.ConsultationSettings.IsRosCarrieForword || 0;
                if (resp.data.SettingDetails.ConsultationSettings.IsRosCarrieForword != 0) {
                    $scope.IsRosCarrieForwordDisable = true;
                }

                if (resp.data.SettingDetails.PatientRegistration.IsCoverageNoManadatory != 0) {
                    $scope.IsPayorEditable = false;
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting oganization settings failed");
            });
        };

        $scope.GetOrganizationSettings();

        $scope.GetLabelPrintSettingsData = function (orgId) {
            /*$scope.HospitalId = $scope.DefacultLabelSizeObj.OrganizationId || 0;*/
           /* $scope.HospitalId = $scope.HospitalId || null;*/

            if (orgId === null) {
                alertify.error("Please select an organization.");
                return;
            }

            eHnoteMainAppointmentService.GetLabelPrintSettings(orgId).then(function (resp) {
                if (resp.data.status == "Success" && resp.data.rows.length > 0) {
                    let data = resp.data.rows[0];
                    $scope.DefacultLabelSizeObj = {
                        OrganizationId: data.OrganizationId,
                        PrinterSettingId: data.PrinterSettingId,
                        PrinterTypeId: data.PrinterTypeId,
                        PrinterTypeName: data.PrinterTypeName,
                        LabelWidth: data.LabelWidth,
                        Labelheight: data.Labelheight,
                        Fontsize: data.Fontsize,
                        LeftStartSize: data.LeftStartSize,
                        TopStartSize: data.TopStartSize,
                        SpaceBetweenLine: data.SpaceBetweenLine,
                        PrintBarcode: data.PrintBarcode,
                        Barcodewidth: data.Barcodewidth,
                        Barcodeheight: data.Barcodeheight,
                        VerticalSpaceOfBarcode: data.VerticalSpaceOfBarcode,
                        PageOrientation: data.PageOrientation,
                        DeleteInd: data.DeleteInd
                    };
                } else {
                    $scope.DefacultLabelSizeObj = getDefaultLabelSettings();
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Label Print settings failed");
            });
        };
        
        $scope.GetLabelPrintSettingsData($scope.HospitalId);

        function GetRateListObj() {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "OrganizationPayorId": 0,
                "CPTCODE": "",
                "ProcedureName": "",
                "PayorObj": "",
                "PageNumber": 1,
                "PageSize": 100,
                "TempCount": 0,
                "OrganizationPayorName": "",
                "IsShowGeneral": false
            };
            return obj;
        }
        $scope.RateListObj = GetRateListObj();

        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        console.log("settings Loaded");

        if ($scope.UserAccessRights.SubAccessCategories.SettingReferralSource) {
            $scope.tabno = 1;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingVisitReason) {
            $scope.tabno = 2;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingPatientVitals) {
            $scope.tabno = 3;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingCurrentTreatment) {
            $scope.tabno = 4;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingDiagnosis) {
            $scope.tabno = 5;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingPromoCodes) {
            $scope.tabno = 6;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingFindings) {
            $scope.tabno = 7;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingBillItems) {
            $scope.tabno = 8;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingInsurance) {
            $scope.tabno = 22;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingMedicine) {
            $scope.tabno = 9;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingConsentForms) {
            $scope.tabno = 10;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingPrintSettings) {
            $scope.tabno = 12;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingUser) {
            $scope.tabno = 13;
        } else if ($scope.UserAccessRights.SubAccessCategories.OrganizationalSettings) {
            $scope.tabno = 18;
        } else if ($scope.UserAccessRights.SubAccessCategories.DilationSettings) {
            $scope.tabno = 20;
        } else if ($scope.UserAccessRights.SubAccessCategories.CommunicationSettings) {
            $scope.tabno = 14;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingGeneralNotes) {
            $scope.tabno = 15;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingGeneralHistory) {
            $scope.tabno = 21;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingDoctorReview) {
            $scope.tabno = 16;
        } else if ($scope.UserAccessRights.SubAccessCategories.SettingWaitingRooms) {
            $scope.tabno = 23;
        }
        else if ($scope.UserAccessRights.SubAccessCategories.SettingUSBillItems) {
            $scope.tabno = 25;
        }
        //$scope.hospid = false;
        //if (doctorinfo.doctordata.UserAddress !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.BranchCode !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        //    $scope.hospid = true;
        //}


        $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;


        var access = doctorinfo.isUserHavingAccess;
        var cacheStorageItem = angular.copy(eHnoteCacheStorageService.getCacheStorageStructure());
        cacheStorageItem.USRId = doctorinfo.doctordata.User[0].DoctorID;
        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);
        cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.doctorinfo = doctorinfo;
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;


        $scope.SettingsAccess = {
            "DiagnosisSettingsTabAccess": true,
            "ProcedureSettingsTabAccess": true,
            "ConsentFormsTabAccess": true,
            "PrintSettingsTabAccess": true,
            "ReferralSourceSettingTabAccess": true,
            "VisitReasonTabAccess": true,
            "PatientVitalsTabAccess": true,
            "CurrentTreatmentTabAccess": true,
            "InvestigationsTabAccess": true,
            "SurgeriesTabAccess": true,
            "SurgeryPackagesTabAccess": true,
            "MedicineSettingTabAccess": true,
            "UserSettingTabAccess": true,
            "OrganizationSettingTabAccess": true,
            "DilationMedicineSettingTabAccess": true,
            "CommunicationSettingTabAccess": true,
            "GeneralNotesTabAccess": true,
            "InsuranceTabAccess": true,
            "DoctorReviewTabAccess": true
        };


        $scope.MainSettingObj = {
            "BranchesArray": [],
            "AllUsersList": [],
            "DoctorsList": []
        };



        $scope.UserAccessList = [];
        if (doctorinfo !== "") {
            if (doctorinfo.doctordata.User !== undefined) {
                $rootScope.ParentSpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            }
        }


        $scope.presetColors = [
            { class: "bg__006080--", hex: "#006080" },
            { class: "bg__8077F2--", hex: "#8077F2" },
            { class: "bg__1290E0--", hex: "#1290E0" },
            { class: "bg__EE5F99--", hex: "#EE5F99" },
            { class: "bg__B661E0--", hex: "#B661E0" },
            { class: "bg__6A85FF--", hex: "#6A85FF" },
            { class: "bg__E16B16--", hex: "#E16B16" },
            { class: "bg__119D9F--", hex: "#119D9F" },
            { class: "bg__AB8D80--", hex: "#AB8D80" },
            { class: "bg__595D66--", hex: "#595D66" }
        ];


        function GetPortalBrandingObj() {
            var obj = {
                selectedColor: "",
                hexCode: "",
                logo: null,
                favicon: null,
                practiceName: "",
                subText: "",
                logoFile: null,
                faviconFile: null,
                LogoUrl: null,
                LogoFileName: '',
                FaviconUrl: null,
                FaviconFileName: '',
                isSaved : false
            };
            return obj;
        }
        $scope.portalBranding = GetPortalBrandingObj();
        

        $scope.showMedicalConditions = true;
        $scope.showDiagnosis = true;
        $scope.showProcedure = true;
        $scope.showBilling = true;
        $scope.showDental = true;
        $scope.showOpthalmology = true;
        $scope.showConsent = true;
        $scope.showPrint = true;
        $scope.showIdGenertion = true;
        $scope.showGeneralSettings = true;
        $scope.showCommunicationSettings = true;
        $scope.showGeneralNotesSettings = true;
        $scope.showDoctorReviewSettings = true;

        $scope.pop_generalVal = 1;
        $scope.NotesTypeId = 1;
        $scope.masterComplaintsPageSize = 10;
        $scope.masterComplaintsPageNumber = 1;
        $scope.masterComplaintsLevelType = "O";

        $scope.masterObservationsPageSize = 10;
        $scope.masterObservationPageNumber = 1;
        $scope.masterObservationLevelType = "O";

        $scope.masterClinicalNotesPageSize = 10;
        $scope.masterClinicalNotesPageNumber = 1;
        $scope.masterClinicalNotesLevelType = "O";

        $scope.masterPatientInstructPageSize = 10;
        $scope.masterPatientInstructPageNumber = 1;
        $scope.masterPatientInstructLevelType = "O";

        $scope.showMasterComplaintsDiv = 1;
        $scope.showMasterObservationDiv = 1;
        $scope.showMasterClinicalNotesDiv = 1;
        $scope.showMasterPatientInstructDiv = 1;

        $scope.masterComplaintsIsActive = "Y";
        $scope.complaintsDescription = "";

        $scope.masterGeneralNotesId = 0;
        $scope.MasterComplaintsOrgArray = [];
        $scope.MasterComplaintsUserArray = [];
        $scope.MasterObservationOrgArray = [];
        $scope.MasterObservationUserArray = [];
        $scope.MasterClinicalOrgArray = [];
        $scope.MasterClinicalUserArray = [];
        $scope.MasterPatientInstructOrgArray = [];

        $scope.masterComplaintsBtnName = "Save";
        $scope.masterObservationsBtnName = "Save";
        $scope.masterClinicalNotesBtnName = "Save";
        $scope.masterPatientInstructBtnName = "Save";

        $scope.showModifyMasterComplaintsDiv = false;
        $scope.showModifyMasterObservationsDiv = false;
        $scope.showModifyMasterClinicalNotesDiv = false;
        $scope.showModifyMasterPatientInstructDiv = false;
        $scope.ShowAddInvTabForDoctor = false;
        $scope.selectedDocTemplatesArray = [];
        $scope.selectedOrgTemplatesArray = [];
        $scope.FilterAllHospitalsIndicator = 1;

        $scope.masterSurgerySpecializationArray = [];
        $scope.organizationSurgeriesArray = [];
        $scope.contactLensArray = [];
        $scope.pop_HistoryVal = 6;
        $scope.masterGeneralHistoryId = 0;
        $scope.masterMedicalGeneralHistoryId = 0;
        $scope.masterBirthGeneralHistoryId = 0;
        $scope.masterFamilyGeneralHistoryId = 0;
        $scope.masterNutritionalGeneralHistoryId = 0;
        $scope.masterImmunisationGeneralHistoryId = 0;
        $scope.masterSurgicalGeneralHistoryId = 0;
        $scope.masterMenstrualGeneralHistoryId = 0;
        $scope.MasterBirthHistoryOrgArray = [];
        $scope.MasterFamilyHistoryOrgArray = [];
        $scope.MasterNutritionalHistoryOrgArray = [];
        $scope.MasterImmunisationHistoryOrgArray = [];
        $scope.MasterSurgicalHistoryOrgArray = [];
        $scope.MasterMedicalHistoryOrgArray = [];
        $scope.MasterFunctionalstatusOrgArray = [];
        $scope.MasterOcularSurgicalOrgArray = [];
        $scope.MasterCurrentSystemicOrgArray = [];

        $scope.masterMedicalHistoryPageSize = 10;
        $scope.masterMedicalHistoryPageNumber = 1;

        $scope.masterBirthHistoryPageSize = 10;
        $scope.masterBirthHistoryPageNumber = 1;
        $scope.masterFamilyHistoryPageSize = 10;
        $scope.masterFamilyHistoryPageNumber = 1;
        $scope.masterNutritionalHistoryPageSize = 10;
        $scope.masterNutritionalHistoryPageNumber = 1;
        $scope.masterImmunisationHistoryPageSize = 10;
        $scope.masterImmunisationHistoryPageNumber = 1;
        $scope.masterSurgicalHistoryPageSize = 10;
        $scope.masterSurgicalHistoryPageNumber = 1;
        $scope.masterVaccinactionPageSize = 10;
        $scope.masterVaccinactionPageNumber = 1;
        $scope.masterSystamicPageSize = 10;
        $scope.masterSystamicPageNumber = 1;
        $scope.masterOcularPageSize = 10;
        $scope.masterFunctionalPageSize = 10;
        $scope.masterFunctionalPageNumber = 1;
        $scope.masterOcularSurgicalPageSize = 10;
        $scope.masterOcularSurgicalPageNumber = 1;
        $scope.masterCurrentSystemicPageSize = 10;
        $scope.masterCurrentSystemicPageNumber = 1;
        $scope.masterOcularPageNumber = 1;
        $scope.showModifyMasterBirthHistoryDiv = false;
        $scope.showModifyMasterFamilyHistoryDiv = false;
        $scope.showModifyMasterNutritionalHistoryDiv = false;
        $scope.showModifyMasterImmunisationHistoryDiv = false;
        $scope.showModifyMasterSurgicalHistoryDiv = false;
        $scope.showModifyMasterMenstrualHistoryDiv = false;
        $scope.showModifyMasterLifestyleHistoryDiv = false;
        $scope.showModifyMasterMedicalHistoryDiv = false;
        $scope.showModifyMasterVaccinactionDiv = false;
        $scope.showModifyMasterFunctionalstatusDiv = false;
        $scope.showModifyMasterOcularSurgicalDiv = false;
        $scope.showModifyMasterCurrentSystemicDiv = false;
        $scope.showModifyMasterSystamicDiv = false;
        $scope.showModifyMasterOcularDiv = false;

        $scope.masterBirthHistoryBtnName = "Save";
        $scope.masterFamilyHistoryBtnName = "Save";
        $scope.masterNutritionalHistoryBtnName = "Save";
        $scope.masterImmunisationHistoryBtnName = "Save";
        $scope.masterSurgicalHistoryBtnName = "Save";
        $scope.masterMedicalHistoryBtnName = "Save";
        $scope.masterMenstrualHistoryBtnName = "Save";
        $scope.masterLifestyleHistoryBtnName = "Save";
        $scope.masterAllergyBtnName = "Save";
        $scope.masterVaccinactionBtnName = "Save";
        $scope.masterSystamicBtnName = "Save";
        $scope.masterOcularBtnName = "Save";
        $scope.masterCurrentSystematic = "Save";
        $scope.masterFunctionalBtnName = "Save";
        $scope.masterOcularSurgicalBtnName = "Save";
        $scope.masterCurrentSystemicBtnName = "Save";
        $scope.masterCurrentSystemicBtnName = "Save";





        $scope.BirthHistoryDesc = "";
        $scope.FamilyHistoryDesc = "";
        $scope.NutritionalHistoryDesc = "";
        $scope.ImmunisationHistoryDesc = "";
        $scope.SurgicalHistoryDesc = "";
        $scope.MenstrualHistoryDesc = "";
        $scope.LifestyleHistoryDesc = "";
        $scope.MedicalHistoryDesc = "";
        $scope.MedicalCategory = "";
        $scope.masterBirthHistoryIsActive = false;
        $scope.masterFamilyHistoryIsActive = false;
        $scope.masterNutritionalHistoryIsActive = false;
        $scope.masterImmunisationHistoryIsActive = false;
        $scope.masterSurgicalHistoryIsActive = false;
        $scope.masterMedicalHistoryIsActive = false;
        $scope.masterMenstrualHistoryIsActive = false;
        $scope.masterLifestyleHistoryIsActive = false;
        $scope.masterAllergyIsActive = false;
        $scope.masterVaccinactionIsActive = false;
        $scope.masterSystamicIsActive = false;
        $scope.masterOcularIsActive = false;
        $scope.masterFunctionalIsActive = false;
        $scope.masterOcularSurgicalIsActive = false;
        $scope.masterCurrentSystemicIsActive = false;

        $scope.GetMasterMedicineObject = function () {

            return {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "MedicineId": 0,
                "MedicineName": "",
                "Instructions": "",
                "MedicineTypeId": "",
                "MedicineTypeName": "",
                "MedicineType": "",
                "MedicineStrength": "",
                "MedicineUnitId": 0,
                "MedicineUnitName": "",
                "Manufacturer": "",
                "HospitalObj": "",
                "SourceTypeId": 0,//as we are Adding from Hospital
                "AllHospitalsIndicator":null,
                "SpecializationId": $scope.SpecializationId,
                "ActiveInd": "Y",

                "DrugNDCID": 0,
                "ProcedureId": 0,
                "ProcedureName": '',
                "Procedureobj": '',
                "ParentOrganizationId": $scope.ParentHospitalID || 0,
                "MedicinefullName":'',
                "RXNorm":'',
                "PackageSize":'',
                "PackageUnitsId":null,
                "PackageUnitName":'',
                "AwpPrice":'',
                "PurchasePrice":'',
                "RxQuntity":'',
                "BrandTypeId": 0,
                "BrandTypeName": '',
                "DeleteInd": "N",
                "MedicineNDCId": 0,
                "CPTCode": '',
                "IsMedicine": false,
                

            };
        };

        $scope.masterMedicineObject = angular.copy($scope.GetMasterMedicineObject());









        $scope.cacheStorageItem = cacheStorageItem;
        $scope.popup_value = 1;
        $scope.medicalVitalID = '';
        $scope.switchtonexttab = function (val) {
            if (val === 1) {
                $scope.showModifyMasterTreatDiv = false;
                $scope.addInvestigationButton = "Add";
            } else if (val === 2) {
                $scope.investigationCatPageNumber = 1;
            }
            $scope.popup_value = val;
            if (val === 3) {
                $scope.InvTempplateDetailsObj = {
                    "UserId": $scope.UserId,
                    "TemplateId": 0,
                    "TemplateName": "",
                    "TemplateJson": "",
                    "ActiveInd": "Y",
                    "HospitalId": parentHospitalId,
                    "TemplateDetails": []
                };

                $scope.btnDocInvName = "Save";
                $scope.TempArray = [];
                getAllCategoriesnInestigations();
            }
            if (val === 4) {
                getAllHospitalInvTemplates($scope.newtemplatePageNumber);
            }

        };
        $scope.Main = {
            "labtests": {},
            "medicines": {},
            "treatments": [],
            "billing": [],
            "PatienBillingHistory": [],
            "DisplayID": '',
            "printEamil": '',
            "printAddress1": '',
            "printAddress2": '',
            "casehistory": {},
            "searchDigoTexts": '',
            "searchAnalText": ''
        };
        $scope.main = { "PatientTreatments": [] };
        $scope.Notes = { "treatmentCollection": { "VisitRsn": '', "Diagnostic": [], "Investigation": [], "PastMedicalHistory": [] } };
        $scope.ProcedureManitenance = {
            "AllProcedureInfo": [],
            "BillingProcedureList": []
        };
        $scope.labPrepration = { "labPreprationList": [] };
        $scope.showInventorySetting = !access;
        $scope.showConsent = !access;
        $scope.showCondition = !access;
        $scope.showprintAccess = !access;
        if (access) {
            $scope.addConsult = !access;
            $scope.showMembership = !access;
            $scope.showAccounts = !access;
            $scope.showIncentive = !access;
        }

        $scope.loginInfo = eHnoteLoginStatusService.getUserLoginDetails();

        //if ($scope.loginInfo.RoleID === 1 || $scope.loginInfo.RoleID === 4) {
        //    $scope.tabno = 13;
        //} else {
        //    $scope.tabno = 15;
        //}

        $scope.AllCheck = {};

        $scope.masterDiagPageSize = 10;
        $scope.masterDiagPageNumber = 1;
        $scope.masterDiagSearchText = "";
        $scope.masterDiagLevelType = "O";

        $scope.masterProceduresPageSize = 10;
        $scope.masterProceduresPageNumber = 1;
        $scope.masterProceduresSearchText = "";
        $scope.masterProceduresLevelType = "O";
        $scope.selectedProcedureTypeId = 0;

        $scope.masterMedicinePageSize = 10;
        $scope.masterMedicinePageNumber = 1;
        $scope.masterMedicineSearchText = "";
        $scope.masterMedicineLevelType = "O";

        $scope.showMasterDiagDiv = 2;
        $scope.showMasterTreatDiv = 2;
        $scope.showMasterMedicineDiv = 2;


        $scope.communicationMode = 'doctor';
        $scope.masterCurrentTreatmentPageNumber = 1;
        $scope.masterCurrentTreatmentPageSize = 10;

        $scope.investigationAttrCollection = [];
        $scope.opthalmologysettingslist = [
            {
                "AccessCategoryID": 1,
                "AccessCategoryDesc": "Vision",
                "ActiveTabIND": "Y",
                "AccessRights": [
                    {
                        "AccessID": "UNAIDED",
                        "AccessDesc": "Unaided",
                        "ActiveIND": "Y",
                        "ParentAccessID": "FEEDBCK",
                        "AccessCategoryID": 1,
                        "Order": 6
                    },
                    {
                        "AccessID": "MANBRNS",
                        "AccessDesc": "Pinhole",
                        "ActiveIND": "Y",
                        "ParentAccessID": "MANBRNS",
                        "AccessCategoryID": 1,
                        "Order": 3
                    },
                    {
                        "AccessID": "MANUSRS",
                        "AccessDesc": "Refraction",
                        "ActiveIND": "Y",
                        "ParentAccessID": "MANUSRS",
                        "AccessCategoryID": 1,
                        "Order": 5
                    }
                ]
            },
            {
                "AccessCategoryID": 2,
                "AccessCategoryDesc": "Color Vision Test",
                "ActiveTabIND": "Y",
                "AccessRights": [
                    {
                        "AccessID": "ISHIHARA",
                        "AccessDesc": "Ishihara Colour Vision",
                        "ActiveIND": "Y",
                        "ParentAccessID": "ISHIHARAVISION",
                        "AccessCategoryID": 2,
                        "Order": 6
                    },
                    {
                        "AccessID": "HRR",
                        "AccessDesc": "HRR Colour Vision",
                        "ActiveIND": "Y",
                        "ParentAccessID": "HTTCOLOR",
                        "AccessCategoryID": 2,
                        "Order": 3
                    },
                    {
                        "AccessID": "FRANSWORTH",
                        "AccessDesc": "Fransworth D15 Test",
                        "ActiveIND": "Y",
                        "ParentAccessID": "FRANSWORTHD",
                        "AccessCategoryID": 2,
                        "Order": 5
                    }
                ]
            }
        ];


        $scope.accessCheck = function (item, order) {
            var accessListArray = [];
            var temp_arrayVal = [];
            var getParentVal;
            accessListArray.length = 0;
            temp_arrayVal.length = 0;
            angular.forEach($scope.opthalmologysettingslist, function (list) {
                if (list.AccessCategoryID === order.AccessCategoryID) {
                    getParentVal = list.AccessCategoryDesc;
                }
                angular.forEach(list.AccessRights, function (accessList) {
                    if (order.AccessCategoryID === accessList.AccessCategoryID) {
                        accessListArray.push(accessList);
                    }
                });
            });
            var listLength = accessListArray.length;
            angular.forEach(accessListArray, function (manageList) {
                angular.forEach($scope.investigationAttrCollection, function (keyItem, valItem) {
                    if (manageList.AccessID === valItem) {
                        if (keyItem === "Y") {
                            temp_arrayVal.push(valItem);
                        }
                    }
                });
            });
            if (temp_arrayVal.length === listLength) {
                $scope.AllCheck[getParentVal] = "Y";
            } else {
                $scope.AllCheck[getParentVal] = "N";
            }
        };
        $scope.CheckAll = function (val, check) {
            angular.forEach($scope.opthalmologysettingslist, function (values) {
                if (values.AccessCategoryDesc === check) {
                    angular.forEach(values.AccessRights, function (items) {
                        angular.forEach($scope.AllCheck, function (key, innerval) {
                            if (innerval === check) {
                                $scope.investigationAttrCollection[innerval] = key;
                                $scope.investigationAttrCollection[items.AccessDesc] = key;
                            }
                        });
                    });
                }
            });
        };
        $scope.showInvestigation = true;
        $scope.showInventorySetting = true;
        $scope.addConsult = true;
        $scope.showMembership = true;
        $scope.showConsent = true;
        $scope.showCondition = true;
        $scope.showAccounts = true;
        $scope.showIncentive = true;
        $scope.showprintAccess = true;
        $scope.dntshowmsg = true;
        $("#txt_new_treatment").find("input[type='text']").val("");
        $("#txt_cost").val("");
        $scope.password = "";
        $scope.confirmpassword1 = "";
        $scope.confirmpassword2 = "";
        $scope.kiosk = datapersistanceFactory.getItem("kiosk");
        $scope.printblankline = datapersistanceFactory.getItem("printblankline");
        $scope.medicalVital = {};
        $scope.updateMedical = [];
        $scope.Vital = {};
        $scope.treatmentsArray = [];
        $scope.updateSettingsVitals = [];
        $scope.activeSettingsVitals = [];
        $scope.AllInvCategoriesArray = [];
        $scope.MainInvCategoriesArrayCount = 0;

        $scope.SetMode = function (key, value) {
            datapersistanceFactory.set(key, value);
        };
        $scope.UpdatePrint = function () {
            datapersistanceFactory.set("printblankline", $scope.printblankline);
        };
        $scope.SignOut = function () {
            eHnoteValidateUsersDataService.deleteAllCookies();
            $location.path("/login");
        };
        $scope.numbererrormsg = function () {
            $scope.msg = "";
            $scope.suc = '';
        };
        $scope.UpdatePassword = function (passwordForm, settingsinfo) {
            if (settingsinfo.confirmpassword1.length === settingsinfo.confirmpassword2.length) {
                var a = settingsinfo.confirmpassword1;
                var b = settingsinfo.confirmpassword2;
                if (a === b) {
                    if (settingsinfo.confirmpassword1.length > 5 && settingsinfo.confirmpassword2.length > 5) {
                        eHnoteValidateUsersDataService.ChangeDoctorPassword(doctorinfo.doctorid, doctorinfo.doctordata.User[0].UserLoginID,
                            settingsinfo.password, settingsinfo.confirmpassword2, OnSuccess, OnError);
                    } else {
                        $scope.msg = "";
                        $scope.suc = 'Password must contain minimum 6 characters';
                    }
                } else {
                    $scope.msg = 'Password mismatch';
                    $scope.suc = "";
                }
            } else {
                $scope.suc = "";
                $scope.msg = "Passwords entered does not match";
            }
            $scope.numbererrormsg = function () {
                $scope.msg = "";
                $scope.suc = '';
            };
            function OnSuccess(data) {
                if (data === "Password_Not_Updated") {
                    alertify.success("Password updated successfully");
                    $scope.settingsinfo.confirmpassword1 = '';
                    $scope.settingsinfo.confirmpassword2 = '';
                    $scope.settingsinfo.password = '';
                    $scope.dntshowmsg = false;
                    datapersistanceFactory.set("password", settingsinfo.confirmpassword2);
                    $scope.suc = "";
                    $scope.msg = "";
                } else {
                    $scope.suc = "";
                    $scope.msg = "Incorrect current password entered";
                }
            }
            function OnError(data) {
            }
        };
        $scope.checkboxchecked = function () {
        };
        $scope.MedicalConditionCategories = [];
        eHnoteConditionsDataService.GetMedicalConditionCategory(CategorySuccess, CategoryError);
        function CategorySuccess(resp) {
            $scope.MedicalConditionCategories = resp;
            $scope.selectedCategory = _.where($scope.MedicalConditionCategories, { MedicalConditionCategoryId: 9 })[0];
        }
        function CategoryError(err) {
        }
        $scope.SaveSettings = function () {
        };
        $scope.changeSatus = function (item, status) {
            var index = -1;
            $scope.updateMedicalVitals.some(function (obj, i) {
                return obj.MedConditionId === item.MedConditionId ? index = i : false;
            });
            if (status === "Y") {
                $scope.updateMedicalVitals[index].ActiveIND = "N";
            } else {
                $scope.updateMedicalVitals[index].ActiveIND = "Y";
            }
        };
        function getMedicalHistory() {
            eHnoteSettingsDataService.getMedicalHistoryDetails()
                .success(function (data) {
                    $scope.medicals = data;
                    readDoctorHistorySettingMedical();
                })
                .error(function (error) {
                });
        }
        $scope.updateMedicalVitals = [];
        function readDoctorHistorySettingMedical() {
            eHnoteSettingsDataService.readDoctorHistorySettingMedicalByDoctorId()
                .success(function (data) {
                    angular.forEach(data.rows, function (value1, key) {
                        $scope.updateMedicalVitals.push({
                            HistoryID: value1.HistoryID,
                            Description: value1.Description,
                            ActiveIND: value1.ActiveIND,
                            flag: 0
                        });
                    });
                    var datalength = data.length;
                    var updateMedicallength = $scope.updateMedicalVitals.length;
                    for (var j = 0; j < datalength; j++) {
                        for (var i = 0; i < updateMedicallength; i++) {
                            if ($scope.updateMedicalVitals[i].HistoryID === data[j].HistoryID) {
                                $scope.updateMedicalVitals[i].ActiveIND = data[j].ActiveIND;
                                $scope.updateMedicalVitals[i].flag = 1;
                            } else {
                                if ($scope.updateMedicalVitals[i].flag !== 1) {
                                    $scope.updateMedicalVitals[i].ActiveIND = data[j].ActiveIND;
                                }
                            }
                        }
                    }
                })
                .error(function (error) {
                });
        }
        $scope.medicalVital = {};

        function GetMedicalConditionSettings() {
            var req = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "PageSize": $scope.masterCurrentTreatmentPageSize,
                "PageNumber": $scope.masterCurrentTreatmentPageNumber,
                "SearchKey": null
            };
            //eHnoteConditionsDataService.GetMedicalConditionSettings(req, ConditionSettingsSuccess, ConditionSettingsError);
            eHnoteConditionsDataService.GetMedicalConditionSettings(req).then(function (resp) {
                //   $scope.updateMedicalVitals = resp.data[0].rows;
                $scope.updateMedicalVitals = resp.data.rows;
                $scope.updateMedicalVitalsCount = resp.data.count;
            }, function (err) {
                $scope.updateMedicalVitals = [];
            });
        }

        GetMedicalConditionSettings();


        $scope.masterCurrentTreatmentPagechanged = function (pagenumber) {
            $scope.masterCurrentTreatmentPageNumber = pagenumber;
            GetMedicalConditionSettings();
        };


        $scope.MedicalActiveIND = function (sta, i, index, desc) {
            var id = '#' + i;
            if ($(id).prop('checked')) {
                sta = "Y";
            } else {
                sta = "N";
            }
            $scope.updateMedicalVitals[index].ActiveIND = sta;
            $scope.updateMedicalVitals[index].HistoryID = i;
        };
        function updateMedicalHistoryDetails(values) {
            eHnoteSettingsDataService.updateMedicalHistoryDetails(values)
                .success(function (data) {
                    $scope.updateMedicalVitals = data.rows;
                    alertify.success('Updated Successfully');
                }).error(function (error) {
                });
        }
        $scope.updateMedicalHistory = function () {



            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateCurrentTreatment) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            var req = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": $scope.doctorinfo.doctorid,
                "MedicalConditionId": $scope.medicalVitalID ? $scope.medicalVitalID : 0,
                "MedicalConditionName": $scope.mdcl.medicalVital,
                "ActiveInd": $scope.isDeleteMedCondition === "Y" ? "N" : "Y",
                "CategoryId": $scope.selectedCategory.MedicalConditionCategoryId
            };

            if ($scope.updateMedicalVitals.length > 0) {
                var List = $filter("filter")($scope.updateMedicalVitals, { "MedicalConditionName": $scope.mdcl.medicalVital }, true);
                if (List.length > 0) {
                    alertify.error('Medical Condition is already exists');
                    return;
                }
            }
            eHnoteConditionsDataService.AddUpdateOrgMedicalConditions(req, AddUpdateSuccess, AddUpdateError);
            function AddUpdateSuccess(resp) {
                GetMedicalConditionSettings();
                var alertMsg = $scope.isDeleteMedCondition === "Y" ? 'Deleted' : ($scope.medicalVitalID ? 'Updated' : 'Added');
                alertify.success(alertMsg + ' Successfully');
                $scope.clearMedCondition();
            }
            function AddUpdateError(err) { $scope.updateMedicalVitals = []; alertify.error('Adding Failed'); }
        };


        $scope.navClickVitalItems = function () {
            getPatientVitals();

        };

        function getPatientVitals() {
            getPatientVitalsByDoctorId();
        }
        function getPatientVitalsByDoctorId() {
            eHnoteSettingsDataService.getPatientVitalsByDoctorId(vitalsuccess, vitalerror);
        }
        function vitalsuccess(data) {
            $scope.updateSettingsVitals = [];
            angular.forEach(data, function (value1, key) {
                var vtDesc = value1.VitalDesc;
                $scope.updateSettingsVitals.push({
                    vitalDesc: value1.VitalDesc,
                    vitId: value1.VitalID,
                    vtlActive: value1.ActiveIND
                });
            });
            getActiveVitalsByHospitalID();
        }
        function vitalerror() {
        }
        function getActiveVitalsByHospitalID() {
            getVitalsByHospitalId();
        }
        function getVitalsByHospitalId() {
            var req = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
            };
            eHnoteSettingsDataService.getActivetVitalsByHospitalId(req, activevitalsuccess, activevitalerror);
        }
        function activevitalsuccess(data) {
            $scope.activeSettingsVitals = [];
            angular.forEach(data.rows, function (value1, key) {
                var vtDesc = value1.VitalDesc;
                $scope.activeSettingsVitals.push({
                    vitalDesc: value1.VitalDesc,
                    vitId: value1.VitalID,
                    vtlActive: value1.ActiveIND
                });
            });
            angular.forEach($scope.updateSettingsVitals, function (updateData) {
                angular.forEach($scope.activeSettingsVitals, function (activeData) {
                    if (updateData.vitId === activeData.vitId) {
                        updateData.vtlActive = 'Y';
                    }
                });
            });
        }
        function activevitalerror() {
        }

        $scope.ActiveIND = function (sta, i, index) {
            var id = '#' + i;
            if ($(id).prop('checked')) {
                sta = "Y";
            } else {
                sta = "N";
            }

            $scope.updateSettingsVitals[index].vtlActive = sta;
            $scope.updateSettingsVitals[index].vitId = i;
        };
        $scope.checkallVital = false;
        $scope.CheckallVitals = function (checkallVital) {
            angular.forEach($scope.updateSettingsVitals, function (item) {
                if (checkallVital) {
                    item.vtlActive = 'Y';
                } else {
                    item.vtlActive = 'N';
                }

            });
        };
        $scope.updateDoctorVitals = function () {
            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateOrganizationVitals) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            updateDoctorVitalsSettings($scope.updateSettingsVitals);
        };
        function updateDoctorVitalsSettings(values) {
            var vital_arr = [];
            angular.forEach(values, function (items) {
                vital_arr.push({
                    "VitalID": items.vitId,
                    "ActiveIND": items.vtlActive
                });
            });
            var params = {
                "DoctorID": $scope.doctorinfo.doctorid,
                "USRType": "DOCTOR",
                "UserID": $scope.doctorinfo.doctorid,
                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "VitalInfo": vital_arr
            };
            eHnoteSettingsDataService.updateDoctorVitalsSettings(params)
                .success(function (data) {
                    $scope.vitals = data;
                    alertify.success('Updated Successfully');
                })
                .error(function (error) {
                });
        }
        var docid = doctorinfo.doctorid;
        $scope.ConsentSettingsDataArray = [];
        $scope.addDoctorConsentForm = [];
        $scope.doctorConsentFormList = [];
        $scope.FieldsArray = [];
        $scope.GetMasterConsentFields = function () {
            $scope.FieldCategoriesArray = [];
            $scope.FieldValuesArray = [];
            $scope.FieldsArray = [];
            eHnoteSettingsDataService.GetMasterConsentFields().success(function (data) {
                $scope.FieldCategoriesArray = data.FieldCategoriesArray;
                $scope.FieldValuesArray = data.FieldValuesArray;
                //  $scope.FieldsArray = data.FieldsArray;
            })
                .error(function (error) {
                    alertify.error("Getting MasterConsentFields failed");
                });
        };

        $scope.navClickConsentItems = function () {
            $scope.errorupload = '';
            $scope.errorsize = '';
            GetDoctorsConsentFroms();
            $scope.getSurgerySpecializations();

            $scope.GetMasterConsentFields();

        };


        $scope.navClickCreateConsentNewItems = function () {
            console.log("letter");
        }
        function GetDoctorsConsentFroms() {
            //var request = { "ParentOrganizationId": doctorinfo.hospitalID };
            var request = { "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID };
            request.searchtext = '';
            eHnoteSettingsDataService.GetOrgConsentForms(request).then(function (resp) {
                $scope.doctorConsentFormList = resp.data;
            }, function (err) {
            });
        }
        $scope.GetDoctorConsentInSettings = function (docid, url, filetype) {
            if (filetype === "jpg" || filetype === "PNG" || filetype === "png" || filetype === "jpeg") {
                $scope.arrayImgdoc = [];
                $scope.arrayImgdoc.push({
                    "url": url,
                    "thumbUrl": url
                });
                Lightbox.openModal($scope.arrayImgdoc, 0);
            } else if (filetype === "pdf") {
                window.open(url);
            }
        };
        $scope.selected = {};
        $scope.onFileSelectConsentSettings = function ($files, name) {
            if (angular.element("#txt_ConsentFormSettings").val() === "") {
                angular.element("#fileConcern").val("");
                alert("Enter consent form name");
                return false;
            } else {
                $scope.DoctorConsertFromName = name;
                $scope.files = $files;
            }
        };
        var url = "";
        $scope.uploadConsentfilesInSettings = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateConsentForms) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            $scope.OrganisationConsentFormId = 0;
            if (angular.element("#txt_ConsentFormSettings").val() === "" || $scope.DoctorConsertFromName === "" || $scope.DoctorConsertFromName === undefined) {
                $scope.errorupload = "Enter name for the Consent form and Upload file";
            } else {

                var file = $scope.files;
                var Name = $scope.DoctorConsertFromName;
                // var HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                var ParentOrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                var fd = new FormData();
                fd.append("ParentOrganizationId", ParentOrganizationId);
                fd.append("DoctorID", $scope.doctorinfo.doctorid);
                fd.append("DoctorName", $scope.doctorinfo.doctordata.User[0].FullName);
                fd.append("OrganisationConsentFormId", $scope.OrganisationConsentFormId);
                fd.append("ConsentName", Name);
                fd.append("file", file);
                fd.append("ConsentTypeId", $scope.ConsentFormsData.ConsentTypeId);
                fd.append("ConsentSubTypeId", $scope.ConsentFormsData.ConsentSubTypeId);
                fd.append("ConsentTypeName", $scope.ConsentFormsData.ConsentTypeName);
                fd.append("ConsentSubTypeName", $scope.ConsentFormsData.ConsentSubTypeName);
                fd.append("Type", 1);

                if ($scope.doctorConsentFormList.length > 0) {
                    var List = $filter("filter")($scope.doctorConsentFormList, { "DocumentName": $scope.DoctorConsertFromName }, true);
                    if (List.length > 0) {
                        alertify.error('Consent Name is already exists');
                        return;
                    }
                }
                eHnoteSettingsDataService.consentFormImageUploadInSettings(fd, callbackDocConsentSuccess, callbackDocConsentError);
            }
        };
        function callbackDocConsentSuccess(resp) {
            if (resp.length !== 0) {
                alertify.success("Uploaded Successfully");
                object = {
                    "DocId": resp[0].OrganisationConsentFormId,
                    "DocumentName": resp[0].DocumentName,
                    "FileExtension": resp[0].FileExtension,
                    "URL": resp[0].URL,
                    "HospitalId": resp[0].HospitalId,
                    "ActiveIND": "Y",
                    "ConsentTypeId": 0,
                    "ConsentSubTypeId": 0,
                    "ConsentTypeName": "",
                    "ConsentSubTypeName": ""
                };
                $scope.doctorConsentFormList.push(object);
                GetDoctorsConsentFroms();
                $scope.DoctorConsertFromName = '';
                $('#txt_ConsentFormSettings').val('');

            }
        }
        function callbackDocConsentError(err) {
            alertify.success("Uploading Failed");
        }
        $scope.ChkDoctorConsertActive = function (index, status) {
            if (status === undefined || !status) {
                $scope.doctorConsentFormList[index].ActiveIND = "N";
            } else {
                $scope.doctorConsentFormList[index].ActiveIND = "Y";
            }
        };
        $scope.addUpdateConsent = function () {
            var req = {
                "DoctorID": doctorinfo.doctorid,
                "USRType": "DOCTOR",
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "UserId": $scope.cacheStorageItem.USRId,
                "ConsentForms": []

            };
            angular.forEach($scope.doctorConsentFormList, function (item, index) {
                req.ConsentForms.push({ "DocId": item.DocId, "ActiveIND": item.ActiveIND });
            });
            eHnoteSettingsDataService.UpdateOrgConsentForms(req).then(function (resp) {
                alertify.success("Updated Successfully");
            }, function (err) {
                alertify.success("Updating Failed");
            });
        };

        $scope.DeleteDoctorConsent = function (consent) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                object = {
                    "DocId": consent.DocId,
                    "HospitalId": consent.HospitalId,
                    "FileName": consent.URL === "" ? "" : consent.URL.substring(consent.URL.lastIndexOf('/') + 1),
                    "UserId": $scope.UserId
                };
                eHnoteSettingsDataService.DeleteDoctorConsent(object).then(function (resp) {
                    GetDoctorsConsentFroms();
                    alertify.success("Deleted Successfully");
                }, function (err) {
                    console.log(err);
                    alertify.error("Deleting Failed");
                });
            }, function () {
                return;
            });
        };

        $scope.getAllConditions = function () {
            $scope.selectedPage = "All";
            $scope.sortletterinCondition = "";
            $scope.ConditionscurrentPage = 1;
        };
        $scope.conditions = [];
        $scope.TotalconditionsArray = [];
        function getTotalavailableconditions(pageno, startwith, conditionsPageSize, val) {
            eHnoteSettingsDataService.readAvailableConditionsByDoctorId(pageno, startwith, conditionsPageSize, val)
                .success(function (data) {
                    $scope.totalConditionsItems = data.count;
                    $scope.TotalconditionsArray = [];
                    angular.forEach(data.rows, function (value, key) {
                        if (value.PracticeCondition.IsPrivate === 'N') {
                            $scope.TotalconditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": ""
                                },
                                "PracticeSubCondition": []
                            });
                        } else {
                            $scope.TotalconditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": value.PracticeCondition.AddedBy
                                },
                                "PracticeSubCondition": []
                            });
                        }
                    });
                }).error(function (error) {
                    alertify.error("Getting Conditions failed");
                });
        }
        function readAvailableConditions(pageno, startwith, conditionsPageSize, val) {
            eHnoteSettingsDataService.readAvailableConditionsByDoctorId(pageno, startwith, conditionsPageSize, val)
                .success(function (data) {
                    $scope.totalConditionsItems = data.count;
                    $scope.conditionsArray = [];
                    angular.forEach(data.rows, function (value, key) {
                        if (value.PracticeCondition.IsPrivate === "N") {
                            $scope.conditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": ""
                                },
                                "PracticeSubCondition": []
                            });
                        } else {
                            $scope.conditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": value.PracticeCondition.AddedBy
                                },
                                "PracticeSubCondition": []
                            });
                        }
                    });
                }).error(function (error) {

                    alertify.error("Getting AvailableConditions failed");
                });
        }
        $scope.sortletterinCondition = "";
        $scope.selectedPage = "All";
        $scope.getConditionsBysorting = function (sortletter) {
            $scope.selectedPage = sortletter;
            $scope.sortletterinCondition = sortletter;
            $scope.ConditionscurrentPage = 1;
            eHnoteSettingsDataService.readAvailableConditionsByDoctorId($scope.ConditionscurrentPage, $scope.sortletterinCondition, 10, 1)
                .success(function (data) {
                    $scope.totalConditionsItems = data.count;
                    $scope.conditionsArray = [];
                    angular.forEach(data.rows, function (value, key) {
                        if (value.PracticeCondition.IsPrivate === "N") {
                            $scope.conditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": ""
                                },
                                "PracticeSubCondition": []
                            });
                        } else {
                            $scope.conditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": value.PracticeCondition.AddedBy
                                },
                                "PracticeSubCondition": []
                            });
                        }
                    });
                })
                .error(function (error) {

                    alertify.error("Getting Available Conditions failed");
                });
        };
        $scope.ConditionscurrentPage = 1;
        $scope.ConditionsmaxSize = 10;
        $scope.ConditionspageChanged = function (pageNo) {
            $scope.ConditionscurrentPage = pageNo;
            eHnoteSettingsDataService.readAvailableConditionsByDoctorId(pageNo, $scope.sortletterinCondition, 10, 1)
                .success(function (data) {
                    $scope.totalConditionsItems = data.count;
                    $scope.conditionsArray = [];
                    angular.forEach(data.rows, function (value, key) {
                        if (value.PracticeCondition.IsPrivate === 'N') {
                            $scope.conditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": ""
                                },
                                "PracticeSubCondition": []
                            });
                        } else {
                            $scope.conditionsArray.push({
                                PracticeCondition: {
                                    "CndDesc": value.PracticeCondition.CndDesc,
                                    "CndID": value.PracticeCondition.CndID,
                                    "ActiveIND": value.PracticeCondition.ActiveIND,
                                    "IsPrivate": value.PracticeCondition.IsPrivate,
                                    "AddedBy": value.PracticeCondition.AddedBy
                                },
                                "PracticeSubCondition": []
                            });
                        }
                    });
                })
                .error(function (error) {
                    alertify.error("Getting AvailableConditions By Doctor failed");
                });
        };
        $scope.AddSubConTretment = function (currentpage) {
            var txtvalue = $("#txt_trtmnt").find("input[type='text']").val();
            var newcondvalue = Capitalize(txtvalue);
            $scope.object = [];
            if (newcondvalue === "") {
                $scope.errorcondition = "Enter condition";
                return false;
            } else {
                $scope.object.push({
                    "PracticeCondition": {
                        "CndDesc": newcondvalue,
                        "ActiveIND": "Y",
                        "IsPrivate": "Y"
                    },
                    "PracticeSubCondition": []
                });
            }
            var startswith = newcondvalue[0];
            $scope.sortletterinCondition = startswith;
            $scope.selectedPage = startswith;
            $scope.ConditionscurrentPage = 1;
            $scope.conditionsArray.push({
                "PracticeCondition": {
                    "CndDesc": newcondvalue,
                    "ActiveIND": "Y",
                    "IsPrivate": "Y",
                    "AddedBy": ''
                },
                "PracticeSubCondition": []
            });
            eHnoteSettingsDataService.updateConditionDetailsByDoctorId($scope.object, $scope.ConditionscurrentPage, $scope.sortletterinCondition, 10)
                .success(function (data) {
                    $scope.totalConditionsItems = data.count;
                    $scope.ConditionscurrentPage = 1;
                    $("#txt_trtmnt").find("input[type='text']").val("");
                    $scope.errorcondition = '';
                    alertify.success("Condition added successfully");
                })
                .error(function (error) {
                    alertify.error("updating conditions failed");
                });
        };
        $scope.OpenDeletePop = function (Id, Name, active, docname) {
            $scope.errorcondition = '';
            var pagenumber = $scope.ConditionscurrentPage;
            if (active === 'Y') {
                $scope.ConfirmDeleteCondition(Id, Name, active, pagenumber, docname);
                alertify.success("Status changed successfully");
            } else {
                $scope.ConfirmDeleteCondition(Id, Name, active, pagenumber, docname);
                alertify.success("Status changed successfully");
            }
        };
        $scope.ConfirmDeleteCondition = function (Id, Name, active, pagenumber, docname) {
            var activeInd = '';
            if (active === 'Y') {
                activeInd = "N";
            } else {
                activeInd = "Y";
            }
            var array = [];
            array.push({
                "PracticeCondition": {
                    "CndDesc": Name,
                    "ActiveIND": activeInd,
                    "IsPrivate": "Y",
                    "AddedBy": docname,
                    "CndID": Id
                },
                "PracticeSubCondition": []
            });
            eHnoteSettingsDataService.updateConditionDetailsByDoctorId(array, pagenumber, $scope.sortletterinCondition, 10)
                .success(function (data) {
                    $scope.conditionsArray = data.rows;
                })
                .error(function (error) {
                    alertify.error("Update ConditionDetails By Doctor failed");
                });
        };
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
            $scope.hospID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        Settingstreatment();
        function Settingstreatment() {
            var preferenceValue = eHnoteMasterDataService.getUserPreferences();
            $scope.Discountvalue = { "hidediscount": 'N', "treatmentBill": 'N' };
            if (preferenceValue.Preference !== undefined) {
                if (preferenceValue.Preference.Show_Discount !== undefined && preferenceValue.Preference.Auto_Populate_Billing !== undefined) {
                    $scope.Discountvalue = { "hidediscount": preferenceValue.Preference.Show_Discount, "treatmentBill": preferenceValue.Preference.Auto_Populate_Billing };
                } else if (preferenceValue.Preference.Auto_Populate_Billing !== undefined) {
                    $scope.Discountvalue = { "hidediscount": 'N', "treatmentBill": preferenceValue.Preference.Auto_Populate_Billing };
                } else if (preferenceValue.Preference.Show_Discount !== undefined) {
                    $scope.Discountvalue = { "hidediscount": preferenceValue.Preference.Show_Discount, "treatmentBill": 'N' };
                }
            } else {
                $scope.Discountvalue = { "hidediscount": 'N', "treatmentBill": 'N' };
            }
            $scope.Discountchange = function () {
            };
            $scope.treatBillchange = function () {
            };
        }
        $scope.Savechange = function () {
            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
                $scope.hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            }
            var params = {
                "USRType": "ADMIN",
                "Preference": {
                    "Show_Discount": $scope.Discountvalue.hidediscount,
                    "Auto_Populate_Billing": $scope.Discountvalue.treatmentBill
                },
                "USRId": 0,
                "HospitalAddress": {},
                "HospitalDetails": {
                    "HospitalID": $scope.hospid
                }
            };
            eHnoteAdminUserServices.UpdateBranch(params, onSuccess, onError);
            function onSuccess(data) {
                alertify.success("Changes added successfully");
                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.Preference.Auto_Populate_Billing = $scope.Discountvalue.treatmentBill;
                doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.Preference.Show_Discount = $scope.Discountvalue.hidediscount;
                eHnoteMasterDataService.addUserInfo(doctorinfo);
            }
            function onError(reponse) {
            }
        };
        $scope.changeCategory = function (selectedCategory) {
        };
        $scope.newinvestigationPageNumber = 1;
        $scope.investigationPageSize = 10;
        $scope.invsearchText = "";
        $scope.investigationCatPageNumber = 1;
        $scope.maxSize = 10;

        $scope.MainInvCategoriesArray = [];
        $scope.MainInvestigationsArray = [];
        function isInteger(x) {
            return x % 1 === 0;
        }
        $scope.invpageChanged = function (newinvestigationPageNumber) {
            $scope.newinvestigationPageNumber = newinvestigationPageNumber;
            GetOrgInvestigations('', 10, $scope.newinvestigationPageNumber);
        };
        $scope.InvestigationObject = {
            "SelectedCategoryObj": "",
            "InvestigationName": "",
            "InvestigationId": 0,
            "BillingCode": "",
            "AllHospitalsIndicator": 1,
            "HospitalId": 0,
            "ImageUploadInd": false,
            "RemarksInd": false,
            "SyncImageInd": false,
            "GetTemplateInd": false,
            "FrequencyValuesInd": false,
            "CdRatioValuesInd": false,
            "ProcedureGeneralCost": "",
            "ProcedureCgsCost": "",
            "ProcedureCgsValue": "",
            "CgsType": "true",
            "ProcedureSgsCost": "",
            "ProcedureSgsValue": "",
            "SgsType": "true",
            "PvtInsType": "true",
            "ProcedurePvtInsuranceCost": "",
            "ProcedurePvtInsuranceValue": "",
            "Status_Flg": "New",
            "HospitalObj": {
                "ClinicName": "All Locations",
                "ClinicId": 0
            },
            "ProcedureMaxDiscountValue": 0,
            "ProcedureMaxDiscountCost": 0,
            "ProcedureMaxDiscountType": 'A'

        };
        function getInvCategoriesbyId(pagenumber, type) {
            var pagesize = 0;
            if (type === "All") {
                pagenumber = 1;
                pagesize = 1000;
            }
            if (type === "Page") {
                pagenumber = parseFloat(pagenumber);
                pagesize = 10;
            }
            var getallind = 1;

            if ($scope.RoleId === 1 || $scope.RoleId === 10 || $scope.RoleId === 4 || $scope.RoleId === 43) {
                getallind = 0;
            }
            var params = {
                "HospitalID": $scope.doctorinfo.hospitalID,
                "ParentHospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserID": $scope.doctorinfo.doctorid,
                "ActiveInd": "Y",
                "ShowResultInd": "N",
                "GetAllIndicator": getallind,
                "PageSize": pagesize,
                "PageNumber": pagenumber
            };
            eHnoteSettingsDataService.getInvestigationCategoriesById(params).success(function (data) {
                if (data.status === "Failure") {
                    alertify.error(data.Message);
                } else {

                    $scope.AllInvArray = [];
                    if (data[0].Categories !== undefined) {

                        //data[0].Categories.forEach(function (item)
                        //{
                        //    if(item.CategoryId!=1 && item.CategoryId!=2 && item.CategoryId!=3 && item.CategoryId!=4)
                        //    {
                        //        $scope.AllInvArray.push(item);
                        //    }
                        //});


                        if (type === "All") {
                            $scope.AllInvCategoriesArray = data[0].Categories;
                            // $scope.AllInvCategoriesArray = $scope.AllInvArray;
                        }

                        if (type === "Page") {

                            $scope.MainInvCategoriesArray = [];
                            $scope.MainInvCategoriesArray = data[0].Categories;
                            //$scope.MainInvCategoriesArray = $scope.AllInvArray;
                            $scope.MainInvCategoriesArrayCount = data[0].count;
                        }


                    }
                }
            }).error(function (error) {
                alertify.error(error.Message);
                $scope.MainInvCategoriesArray = [];
                $scope.AllInvCategoriesArray = [];
            });
        }
        $scope.invCatergoryText = "";
        $scope.rightTemplateFile = "";
        $scope.leftTemplateFile = "";
        $scope.addInvCategory = function (val) {
            if (val !== "") {
                var HopistalId = 0;
                //if ($scope.RoleId === 4) {//Admin Doctor
                //    HopistalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                //}
                //if ($scope.RoleId === 1) {//Normal Doctor
                //    HopistalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                //} else {
                //    HopistalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                //}
                HopistalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                var params = {
                    "HospitalID": HopistalId,
                    "DoctorID": $scope.doctorinfo.doctorid,
                    "UsrID": $scope.doctorinfo.doctorid,
                    "PageSize": 100,
                    "PageNumber": 1,
                    "CategoryID": $scope.addCategoryId ? $scope.addCategoryId : 0,
                    "ActiveInd": "Y",
                    "CategoryName": val
                };
                eHnoteSettingsDataService.addUpdateInvCategoryById(params).success(function (data) {
                    if (data.status === "Failure") {
                        alertify.error(data.Message);
                        $scope.AddCategory = "Add Category";
                        $scope.invCatergoryText = "";
                        document.getElementById('invcatText').value = "";
                    } else {
                        if ($scope.addCategoryId === 0 || $scope.addCategoryId === '') {
                            alertify.success("Added Successfully");
                            document.getElementById('invcatText').value = "";
                            //getInvCategoriesbyId(1, "Page");

                        } else {
                            if ($scope.addCategoryId !== 0 || $scope.addCategoryId !== '') {
                                alertify.success("Update Successfully");
                                $scope.AddCategory = "Add Category";
                                document.getElementById('invcatText').value = "";
                                //getInvCategoriesbyId(1, "Page");
                            }
                        }
                        $scope.addCategoryId = '';
                        $scope.invCatergoryText = "";
                        document.getElementById('invcatText').value = "";
                        $scope.MainInvCategoriesArray = data[0].Categories;
                        if ($scope.isedit) {
                            $scope.isedit = false;
                        }


                        var masterdataObj = datapersistanceFactory.getItem("masterDataArrays");
                        if (data[0].Categories && data[0].Categories.length > 0) {
                            masterdataObj.masterInvCategories = data[0].Categories;
                        }

                        loginCookieFactory.set('masterDataArrays', masterdataObj);
                    }
                }).error(function (error) {
                    alertify.success(error.Message);
                    $scope.invCatergoryText = "";
                    document.getElementById('invcatText').value = "";
                    //getInvCategoriesbyId(0, "Page");
                });
            } else {
                alertify.error("Enter CategoryName");
                $scope.invCatergoryText = "";
                document.getElementById('invcatText').value = "";
                //getInvCategoriesbyId(0, "Page");
            }
        };

        $scope.valuecdandFreChange = function (modelname, type) {
            if (modelname && type === 1) {
                $scope.InvestigationObject.CdRatioValuesInd = false;
            } else {
                $scope.InvestigationObject.FrequencyValuesInd = false;
            }

        };
        $scope.addInvestigationButton = "Add";
        function resetInvObject() {
            $scope.InvestigationObject = {
                "SelectedCategoryObj": "",
                "InvestigationName": "",
                "InvestigationId": 0,
                "AllHospitalsIndicator": 1,
                "HospitalId": 0,
                "BillingCode": "",
                "ImageUploadInd": false,
                "RemarksInd": false,
                "SyncImageInd": false,
                "GetTemplateInd": false,
                "FrequencyValuesInd": false,
                "CdRatioValuesInd": false,
                "ProcedureGeneralCost": "",
                "ProcedureCgsCost": "",
                "ProcedureCgsValue": "",
                "CgsType": "true",
                "ProcedureSgsCost": "",
                "ProcedureSgsValue": "",
                "SgsType": "true",
                "PvtInsType": "true",
                "ProcedurePvtInsuranceCost": "",
                "ProcedurePvtInsuranceValue": "",
                "Status_Flg": "New",
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'

            };
            //$scope.rightTemplateFile = null;
            //$scope.leftTemplateFile = null;
            //$scope.rightTemplateFile = "";
            //$scope.leftTemplateFile = "";
            //document.getElementById("imgtag1").src = "";
            //document.getElementById("imgtag2").src = "";
        }


        $scope.LostInvestigation = function () {
            $scope.InvestigationFocus = false;
        };
        $scope.editInvestigation = function (item) {
            $scope.InvestigationFocus = true;
            var activeImageUploadInd = false; if (item.ImageUploadInd === 'Y') { activeImageUploadInd = true; }
            var activeRemarksInd = false; if (item.RemarksInd === 'Y') { activeRemarksInd = true; }
            var activeSyncImageInd = false; if (item.SyncImageInd === 'Y') { activeSyncImageInd = true; }
            var activeGetTemplateInd = false; if (item.GetTemplateInd === 'Y') { activeGetTemplateInd = true; }
            var activeFrequencyValuesInd = false; if (item.FrequencyValuesInd === 'Y') { activeFrequencyValuesInd = true; }
            var activeCdRatioValuesInd = false; if (item.CdRatioValuesInd === 'Y') { activeCdRatioValuesInd = true; }

            if (item.CgsCost === 0) {
                item.ProcedureCgsValue = 0;
            } else {
                var cgsValue = 0; cgsValue = (item.GeneralCost - item.CgsCost); item.ProcedureCgsValue = cgsValue;
            }

            if (item.SgsCost === 0) {
                item.ProcedureSgsValue = 0;
            } else {
                var sgsValue = 0; sgsValue = (item.GeneralCost - item.SgsCost); item.ProcedureSgsValue = sgsValue;
            }

            if (item.InsuranceCost === 0) {
                item.ProcedurePvtInsuranceValue = 0;
            } else {
                var piValue = 0; piValue = (item.GeneralCost - item.InsuranceCost); item.ProcedurePvtInsuranceValue = piValue;
            }





            $scope.showModifyMasterTreatDiv = true;
            $scope.addInvestigationButton = "Update";
            var CatObj = {
                "CategoryId": item.CategoryId,
                "CategoryName": item.CategoryName,
                "ActiveIND": "Y"
            };
            var InvObj = {
                "InvestigationId": item.InvestigationId,
                "InvestigationName": item.InvestigationName
            };
            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.BranchId }, true);



            $scope.InvestigationObject = {
                "SelectedCategoryObj": CatObj,
                "SelectedInvestigationObj": InvObj,
                "InvestigationName": item.InvestigationName,
                "InvestigationId": item.InvestigationId,
                "ImageUploadInd": activeImageUploadInd,
                "BillingCode": item.BillingCode,
                "RemarksInd": activeRemarksInd,
                "SyncImageInd": activeSyncImageInd,
                "GetTemplateInd": activeGetTemplateInd,
                "FrequencyValuesInd": activeFrequencyValuesInd,
                "CdRatioValuesInd": activeCdRatioValuesInd,
                "OrgInvestigationId": item.OrgInvestigationId,
                "Status_Flg": item.Status_Flg,
                "RightTemplateUrl": item.RightTemplateUrl,
                "LeftTemplateUrl": item.LeftTemplateUrl,
                "ProcedureGeneralCost": item.GeneralCost,
                "ProcedureCgsCost": item.CgsCost,
                "ProcedureCgsValue": item.ProcedureCgsValue,
                "CgsType": "true",
                "ProcedureSgsCost": item.SgsCost,
                "ProcedureSgsValue": item.ProcedureSgsValue,
                "SgsType": "true",
                "ProcedurePvtInsuranceCost": item.InsuranceCost,
                "ProcedurePvtInsuranceValue": item.ProcedurePvtInsuranceValue,
                "PvtInsType": "true",
                "ProcedureMaxDiscountValue": item.ProcedureMaxDiscountValue || 0,
                "ProcedureMaxDiscountCost": item.ProcedureMaxDiscountCost || 0,
                "ProcedureMaxDiscountType": item.ProcedureMaxDiscountType.trim() || 'A'
            };

            $scope.InvestigationObject.HospitalObj = SelectedItems[0];
            $scope.InvestigationObject.HospitalId = item.BranchId;
            $scope.InvestigationObject.AllHospitalsIndicator = 0;
            $scope.rightTemplateFile = item.RightTemplateUrl;
            $scope.leftTemplateFile = item.LeftTemplateUrl;

        };
        //$scope.deleteInvestigation = function (item) {
        //    r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure You  want to delete this Investigation ? ", function () {
        //        var params = {
        //            "HospitalID": parentHospitalId,
        //            "DoctorID": $scope.doctorinfo.doctorid,
        //            "UsrID": $scope.doctorinfo.doctorid,
        //            "CategoryID": item.CategoryId,
        //            "Investigation": item.Investigation,
        //            "InvestigationID": item.InvestigationId,
        //            "ActiveInd": "N",
        //            "ImageUploadInd": item.ImageUploadInd,
        //            "RemarksInd": item.RemarksInd,
        //            "SyncImageInd": item.SyncImageInd,
        //            "GetTemplateInd": item.GetTemplateInd,
        //            "FrequencyValuesInd": item.FrequencyValuesInd,
        //            "CdRatioValuesInd": item.CdRatioValuesInd
        //        };
        //        eHnoteSettingsDataService.addUpdateInvestigationsById(params, callbacksuccess, callbackerror);
        //        function callbacksuccess(resp) {
        //            if (resp.status === "Failure") {
        //                alertify.error(resp.Message);
        //            } else {
        //                if (resp.Investigations.length === 0 || resp.Investigations === undefined || resp === undefined) {
        //                    $scope.MainInvestigationsArray = [];
        //                } else {
        //                    alertify.success("Deleted Successfully");
        //                    for (var i = 0; i < resp.Investigations.length; i++) {
        //                        resp.Investigations[i].Status_Flg = "FROM DB";
        //                    }
        //                    $scope.MainInvestigationsArray = resp.Investigations;
        //                    resetInvObject();
        //                }
        //            }
        //        }
        //        function callbackerror(err) {
        //            console.log(error + "error");
        //            $scope.MainInvestigationsArray = [];
        //            alertify.error(err.Message);
        //        }
        //    }, function () {
        //    });
        //};
        $scope.isedit = false;
        $scope.editInvCategoryItem = function (item) {
            $scope.invCatergoryText = item.CategoryName;
            $scope.addCategoryId = item.CategoryId;
            document.getElementById('invcatText').value = item.CategoryName;
            $scope.isedit = true;
            $scope.AddCategory = "Update Category";
        };
        $scope.deleteInvCategoryItem = function (item) {
            var params = {
                "HospitalID": parentHospitalId,
                "DoctorID": $scope.doctorinfo.doctorid,
                "UsrID": $scope.doctorinfo.doctorid,
                "CategoryID": item.CategoryId,
                "PageSize": 10,
                "PageNumber": 1,
                "ActiveInd": "N",
                "CategoryName": item.CategoryName
            };
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you wish to delete This Category?</h4>", function () {
                eHnoteSettingsDataService.addUpdateInvCategoryById(params)
                    .success(function (data) {
                        $scope.MainInvCategoriesArray = data[0].Categories;
                        $scope.AllInvCategoriesArray = data[0].Categories;
                        cacheStorageItem.category = $scope.MainInvCategoriesArray;
                        eHnoteCacheStorageService.addCacheStorage(cacheStorageItem);



                        var masterdataObj = datapersistanceFactory.getItem("masterDataArrays");
                        if (data[0].Categories && data[0].Categories.length > 0) {
                            masterdataObj.masterInvCategories = data[0].Categories;
                        }


                        loginCookieFactory.set('masterDataArrays', masterdataObj);
                        alertify.success("delete Sucessfully");
                    });
            });
        };
        $scope.PopupInvActiveMenu = function (menuno) {
            return (menuno === $scope.popup_value) ? "active" : "";
        };
        $scope.changeInvCat = function (pagenumber) {
            //getInvCategoriesbyId(pagenumber, "Page");
        };
        $scope.showImage = function (url) {
            var downloadDoc = url;
            if (downloadDoc !== undefined) {
                if (downloadDoc.indexOf("http:") > -1 || downloadDoc.indexOf("https:") > -1) {
                    $scope.arrayImgdoc = [];
                    $scope.arrayImgdoc.push({
                        "url": downloadDoc,
                        "thumbUrl": downloadDoc
                    });
                    Lightbox.openModal($scope.arrayImgdoc, 0);
                } else if (downloadDoc.indexOf("data:application/pdf;base64,") > -1) {
                    window.open(downloadDoc);
                }
            }
        };
        $scope.removeImage = function (item, type) {
            if (type === "Right") {
                item.RightTemplateUrl = "";
            } else {
                item.LeftTemplateUrl = "";
            }
        };
        var printsettingDefault = {
            //"HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": $scope.doctorinfo.doctorid,
            "PrintHeaderImgUrl": "",
            "PrintHeaderImgblob": "",
            "PrintHeaderImgAlignment": "center",
            "Language": 1,
            "Printdetails": [
                {
                    "PageName": "Billing",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "Summary",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "Prescription",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "Lab",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "ViewCaseHistory",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "ParthaBilling",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A6',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "Optical",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "Pharmacy",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "Inventory",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                },
                {
                    "PageName": "OT",
                    "LetterHeadValue": "No",
                    "PageSettings": {
                        "PageSize": 'A4',
                        "PageOrientation": 'Portrait',
                        "MarginTop": 10,
                        "MarginBottom": 20,
                        "MarginLeft": 30,
                        "MarginRight": 30
                    },
                    "CustomPrintSettings": {
                        "HeaderSettings": "",
                        "ContentSettings": "",
                        "FooterSettings": ""
                    }
                }
            ]
        };


        $scope.submitHeader = function (obj) {

            var inobj = {
                hospitalName: obj.hospitalName,
                contactNumber: obj.contactNumber,
                letterObj: obj.letterObj,
                address: obj.address
            };


        };

        //$scope.printsettingObj = eHnoteMasterDataService.getPrintSettingInfo() ? eHnoteMasterDataService.getPrintSettingInfo() : printsettingDefault;
        $scope.printsettingObj = eHnoteMasterDataService.getPrintSettingInfo();


        angular.forEach($scope.printsettingObj.Printdetails, function (item, index) {
            if (item.LetterHeadValue === undefined || item.LetterHeadValue === null || item.LetterHeadValue === '') { item.LetterHeadValue = 'No'; }

            if (item.PageName === 'Billing') {
                $scope.selectedItemLetterHeadValue = item.LetterHeadValue;
            }


        });


        $scope.btnSave = function () {


            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdatePrintSettings) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            };



            var params = {
                "ParentOrganizationId": $scope.printsettingObj.ParentOrganizationId,
                "SubOrganizationId": $scope.printsettingObj.SubOrganizationId,
                "BranchId": $scope.printsettingObj.BranchId,
                "UserId": $scope.printsettingObj.UserId,
                "Printdetails": $scope.printsettingObj.Printdetails,
                "PrintHeaderImgUrl": $scope.printsettingObj.PrintHeaderImgUrl,
                "PrintHeaderImgAlignment": "center",
                "PrintImageHeaderUrl": $scope.printsettingObj.PrintImageHeaderUrl,
                "PrintImageFooterUrl": $scope.printsettingObj.PrintImageFooterUrl,
                "PrintOpticalHeaderImgUrl": $scope.printsettingObj.PrintOpticalHeaderImgUrl,
                "PrintOpticalFooterImgUrl": $scope.printsettingObj.PrintOpticalFooterImgUrl,
                "PrintPharmacyHeaderImgUrl": $scope.printsettingObj.PrintPharmacyHeaderImgUrl,
                "PrintPharmacyFooterImgUrl": $scope.printsettingObj.PrintPharmacyFooterImgUrl,
                "Language": 1
            };


            eHnoteSettingsDataService.updatePrintSettings(params)
                .success(function (data) {
                    loginCookieFactory.set('printSettingData', $scope.printsettingObj);
                    alertify.success("print Settings updated successfully");
                })
                .error(function (error) {
                    alertify.error("print Settings updation failed");
                });
        };

        $scope.ChngePrintHeaderSettings = function (val) {
            $scope.EnableDefaultSave();


            var Index = $scope.printsettingObj.Printdetails.findIndex(record => record.PageName === $scope.templateSettings.pageName);
            if (Index > -1) {
                $scope.printsettingObj.Printdetails[Index].LetterHeadValue = val;
                $scope.selectedItemLetterHeadValue = val;
            }

        };

        $scope.editMedCondition = function (item) {
            $scope.currentTreatmentFocus = true;
            $scope.selectedCategory = _.where($scope.MedicalConditionCategories, { MedicalConditionCategoryId: item.CategoryId })[0];
            $scope.mdcl.medicalVital = item.MedicalConditionName;
            $scope.medicalVitalID = item.MedicalConditionId;
        };

        $scope.clearMedCondition = function () {
            $scope.selectedCategory = _.where($scope.MedicalConditionCategories, { MedicalConditionCategoryId: 9 })[0];
            $scope.mdcl.medicalVital = '';
            $scope.medicalVitalID = '';
            $scope.isDeleteMedCondition = "N";
        };

        //$scope.deleteMedicalConditions = function (item) {
        //    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
        //        $scope.isDeleteMedCondition = "Y";
        //        $scope.selectedCategory = { "MedicalConditionCategoryId": item.CategoryId, "MedicalConditionCategoryName": item.CategoryName };
        //        $scope.mdcl.medicalVital = item.MedicalConditionName;
        //        $scope.medicalVitalID = item.MedicalConditionId;
        //        $scope.updateMedicalHistory();
        //    }, function () {
        //        $scope.clearMedCondition();
        //    });
        //};

        $scope.deleteMedicalConditions = function (item) {
            if (item.ActiveIND === 'Y') {
                $scope.selectedCategory = { "MedicalConditionCategoryId": item.CategoryId, "MedicalConditionCategoryName": item.CategoryName };
                $scope.mdcl.medicalVital = item.MedicalConditionName;
                $scope.medicalVitalID = item.MedicalConditionId;
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                    var req = {
                        "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                        "UserId": $scope.doctorinfo.doctorid,
                        "MedicalConditionId": $scope.medicalVitalID ? $scope.medicalVitalID : 0,
                        "MedicalConditionName": $scope.mdcl.medicalVital,
                        "ActiveInd": "N",
                        "CategoryId": $scope.selectedCategory.MedicalConditionCategoryId
                    };
                    eHnoteConditionsDataService.AddUpdateOrgMedicalConditions(req, AddUpdateSuccessList, AddUpdateErrorList);
                    function AddUpdateSuccessList(data) {
                        GetMedicalConditionSettings();
                        alertify.success("Deleted Successfully");
                        $scope.clearMedCondition();

                    }
                    function AddUpdateErrorList(data) {
                    }
                }, function () {
                    r = "You pressed Cancel!";
                });

            }
        };


        //Durga Code For New Diagnosis ,Treatments and Prescription on 18-05-2018


        $scope.changeListSettings = function (ind, Array) {

            angular.forEach(Array, function (item, index) {
                if (ind !== index) {
                    item.Status = false;
                }
            });

            angular.forEach(Array, function (item, index) {
                if (ind === index) {
                    item.Status = true;
                }
            });
        };

        $scope.saveUserSettings = function () {

            if ($scope.tabno === 14) {
                if (!$scope.UserAccessRights.AllAccessRights.SettingsDefaultSmsSettingstoDoctor) {
                    alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                    return false;
                };
            }
            if ($scope.tabno === 13) {
                if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateUserSettings) {
                    alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                    return false;
                };

            }


            object = {
                "UserId": $scope.doctorinfo.doctorid,
                "UserSettingDetails": $scope.UserSettingObject
            };


            eHnoteSettingsDataService.addUpdateUserSettings(object).success(function (data) {

                datapersistanceFactory.set("UserSettingsData", $scope.UserSettingObject);

                //eHnoteSettingsDataService.getUserConsultationdata($scope.doctorinfo.doctorid, $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID).success(function (response) {
                //    if (response.status === "Success") {
                //        loginCookieFactory.set("masterDataArrays", []);
                //        var masterdataObj = {};
                //        if (response.ChiefComplaints && response.ChiefComplaints.length > 0) {
                //            masterdataObj.masterChiefComplaintsArray = response.ChiefComplaints;
                //        }
                //        if (response.ClinicalNotes && response.ClinicalNotes.length > 0) {
                //            masterdataObj.masterClinicalNotesArray = response.ClinicalNotes;
                //        }
                //        if (response.Observations && response.Observations.length > 0) {
                //            masterdataObj.masterObservationsArray = response.Observations;
                //        }
                //        if (response.Diagnosis && response.Diagnosis.length > 0) {
                //            masterdataObj.masterDiagnosisArray = response.Diagnosis;
                //        }
                //        if (response.Procedures && response.Procedures.length > 0) {
                //            masterdataObj.masterProceduresArray = response.Procedures;
                //        }
                //        if (response.Medicines && response.Medicines.length > 0) {
                //            masterdataObj.masterMedicinesArray = response.Medicines;
                //        }
                //        if (response.LabTest && response.LabTest.length > 0) {
                //            masterdataObj.masterLabTestArray = response.LabTest;
                //        }
                //        if (response.Investigations && response.Investigations.length > 0) {
                //            masterdataObj.masterInvestigations = response.Investigations;
                //        }
                //        if (response.InvCategories && response.InvCategories.length > 0) {
                //            masterdataObj.masterInvCategories = response.InvCategories;
                //        }
                //        if (response.MedicineTemplates && response.MedicineTemplates.length > 0) {
                //            masterdataObj.masterMedicineTemplatesArray = response.MedicineTemplates;
                //        }
                //        loginCookieFactory.set("masterDataArrays", masterdataObj);
                //    }
                //}).error(function (error) {
                //    console.log("error log print");
                //});


                alertify.success("User Settings updated successfully");
            }).error(function (error) {
                alertify.error("User Settings updation failed");
            });
        };



        $scope.agingByOptions = [
            { value: "ServiceDate", label: "Service Date" },
            { value: "PostedDate", label: "Posted Date" },
            { value: "CreatedDate", label: "Created Date" }
        ];

        $scope.AllowedPaymentMethodsForConvFee = [
            { PaymentModeId: 2, PaymentModeName: "Credit Card" },
            { PaymentModeId: 3, PaymentModeName: "Debit Card" },
            { PaymentModeId: 16, PaymentModeName: "Text To Pay" },
            { PaymentModeId: 7, PaymentModeName: "ACH/ATH" }
        ];

        $scope.ConvenienceFeeTypeOptions = [
            { Id: 1, Name: "Fixed Amount" },
            { Id: 2, Name: "Percentage" }
        ];

        $scope.ToggleConvenienceFeeSettings = function (isEnabled) {
            if (!$scope.OrganizationSettingsData.ConvenienceFeeSettings) {
                $scope.OrganizationSettingsData.ConvenienceFeeSettings = [];
            }

            if (isEnabled && $scope.OrganizationSettingsData.ConvenienceFeeSettings.length === 0) {
                // Pre-populate one default row so user sees the form structure
                $scope.AddConvenienceFeeRow();
            }
        };

        /**
 * Validates all active convenience fee rows.
 * Returns { isValid: bool, message: string }
 */
        $scope.ValidateConvenienceFeeRows = function () {
            var activeRows = $scope.getActiveConvFeeRows();

            if (activeRows.length === 0) {
                return {
                    isValid: false,
                    message: "Please add at least one Payment Method or disable Convenience Fee."
                };
            }

            for (var i = 0; i < activeRows.length; i++) {
                var row = activeRows[i];
                var rowLabel = "Row " + (i + 1);

                // ── Common validations (apply to ALL fee types) ──
                if (!row.PaymentMethodId) {
                    return { isValid: false, message: rowLabel + ": Please select a Payment Method." };
                }
                if (!row.ConvenienceFeeTypeId) {
                    return { isValid: false, message: rowLabel + ": Please select a Fee Type." };
                }
                if (!row.ConvenienceFeeValue || parseFloat(row.ConvenienceFeeValue) <= 0) {
                    return { isValid: false, message: rowLabel + ": Please enter a valid Fee Value greater than 0." };
                }

                // ── Percentage-only validations ──
                if (row.ConvenienceFeeTypeId === 2) {

                    // Percentage cannot exceed 100
                    if (parseFloat(row.ConvenienceFeeValue) > 100) {
                        return { isValid: false, message: rowLabel + ": Percentage fee cannot exceed 100%." };
                    }

                    // Min > Max check (only for Percentage)
                    var minFee = parseFloat(row.MinimumConvenienceFeeAmount || 0);
                    var maxFee = parseFloat(row.MaximumConvenienceFeeAmount || 0);

                    if (maxFee > 0 && minFee > 0 && minFee > maxFee) {
                        return { isValid: false, message: rowLabel + ": Min Fee cannot exceed Max Fee." };
                    }
                }

                // ── Fixed rows: no Min/Max or percentage cap validation needed ──
            }

            // Duplicate check
            var methodIds = activeRows.map(function (r) { return r.PaymentMethodId; });
            var uniqueIds = methodIds.filter(function (id, idx) { return methodIds.indexOf(id) === idx; });
            if (methodIds.length !== uniqueIds.length) {
                return {
                    isValid: false,
                    message: "Duplicate Payment Method detected. Each payment method can only be configured once."
                };
            }

            return { isValid: true, message: "" };
        };


        $scope.AddConvenienceFeeRow = function () {
            if (!$scope.OrganizationSettingsData.ConvenienceFeeSettings) {
                $scope.OrganizationSettingsData.ConvenienceFeeSettings = [];
            }

            var activeRows = $scope.getActiveConvFeeRows();

            // Allow first row without validation — they need something to start with
            if (activeRows.length > 0) {
                var validation = $scope.ValidateConvenienceFeeRows();
                if (!validation.isValid) {
                    alertify.error(validation.message);
                    return;
                }

                // Stop if all payment methods are already used
                if (activeRows.length >= $scope.AllowedPaymentMethodsForConvFee.length) {
                    alertify.error("All available payment methods have been added.");
                    return;
                }
            }

            $scope.OrganizationSettingsData.ConvenienceFeeSettings.push({
                ConvenienceFeeSettingId: 0,
                OrganizationId: parentHospitalId,
                BillingProviderId: null,
                PaymentMethodId: null,
                PaymentMethodName: "",
                IsConvenienceFeeEnabled: true,
                ConvenienceFeeValue: 0,
                ConvenienceFeeTypeId: 1,
                ConvenienceFeeType: "Fixed Amount",
                MinimumConvenienceFeeAmount: null,
                MaximumConvenienceFeeAmount: null,
                IsActive: true,
                DeleteInd: "N"
            });
        };
        $scope.RemoveConvenienceFeeRow = function (row, index) {
            if (row.ConvenienceFeeSettingId > 0) {
                // Existing row from DB — soft delete
                row.DeleteInd = "Y";
                row.IsActive = false;
            } else {
                // Unsaved row — just remove
                $scope.OrganizationSettingsData.ConvenienceFeeSettings.splice(index, 1);
            }
        };


        // ── Sync PaymentMethodName when method dropdown changes ────────────────
        $scope.OnPaymentMethodChange = function (row) {
            var selected = $scope.AllowedPaymentMethodsForConvFee
                .find(function (m) { return m.PaymentModeId === row.PaymentMethodId; });
            row.PaymentMethodName = selected ? selected.PaymentModeName : "";
        };

        // ── Sync ConvenienceFeeType label when type dropdown changes ───────────
        $scope.OnFeeTypeChange = function (row) {
            var selected = $scope.ConvenienceFeeTypeOptions
                .find(function (t) { return t.Id === row.ConvenienceFeeTypeId; });
            row.ConvenienceFeeType = selected ? selected.Name : "";

            // ── NEW: Clear Min/Max when switching to Fixed ──
            if (row.ConvenienceFeeTypeId === 1) {
                // Fixed — Min/Max not applicable
                row.MinimumConvenienceFeeAmount = null;
                row.MaximumConvenienceFeeAmount = null;
            }
        };

        // ── Helper for empty-state check in the table ──────────────────────────
        $scope.getActiveConvFeeRows = function () {
            return ($scope.OrganizationSettingsData.ConvenienceFeeSettings || [])
                .filter(function (r) { return r.DeleteInd !== "Y"; });
        };

        // ── Ensure the array exists on the settings object ─────────────────────
        $scope.$watch('OrganizationSettingsData', function (settings) {
            if (settings && !settings.ConvenienceFeeSettings) {
                settings.ConvenienceFeeSettings = [];
            }
        });

        $scope.SaveOrganizationSettings = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateParentOrganizationSettings) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            };

            // ── Validate convenience fee config when enabled ──────────────────
            if ($scope.OrganizationSettingsData.IsConvenienceFeeEnabledForPaymentGateway) {
                var validation = $scope.ValidateConvenienceFeeRows();
                if (!validation.isValid) {
                    alertify.error(validation.message);
                    return false;
                }
            }

            object = {
                "UserId": $scope.doctorinfo.doctorid,
                "ParentOrganizationId": parentHospitalId,
                "OrganizationSettingDetails": $scope.OrganizationSettingsData
            };
            eHnoteSettingsDataService.AddUpdateOrganizationSettings(object).success(function (data) {
                datapersistanceFactory.set("OrganizationSettingsData", $scope.OrganizationSettingsData);
                $scope.GetOrganizationSettings();
                alertify.success("Organization Settings updated successfully");
            }).error(function (error) {
                alertify.error("Organization Settings updation failed");
            });
        };

        $scope.SaveLabelPrintSettings = function () {
            if ($scope.DefacultLabelSizeObj.LabelWidth == null) {
                alertify.error("Please enter babel width value");
                return false;
            }
            if ($scope.DefacultLabelSizeObj.Labelheight == null) {
                alertify.error("Please enter label height value");
                return false;
            }
            if ($scope.DefacultLabelSizeObj.Fontsize == null) {
                alertify.error("Please enter font size value");
                return false;
            }
            if ($scope.DefacultLabelSizeObj.TopStartSize == null) {
                alertify.error("Please enter top start size value");
                return false;
            }
            if ($scope.DefacultLabelSizeObj.SpaceBetweenLine == null) {
                alertify.error("Please enter space between line value");
                return false;
            }
            if ($scope.DefacultLabelSizeObj.PrintBarcode) {
                if ($scope.DefacultLabelSizeObj.Barcodewidth == null) {
                    alertify.error("Please enter barcode width value");
                    return false;
                }
                if ($scope.DefacultLabelSizeObj.Barcodeheight == null) {
                    alertify.error("Please enter barcode height value");
                    return false;
                }
                if ($scope.DefacultLabelSizeObj.VerticalSpaceOfBarcode == null) {
                    alertify.error("Please enter vertical space of barcode value");
                    return false;
                }
            }
            
            let requestObj = {
                "PrinterSettingId": $scope.DefacultLabelSizeObj.PrinterSettingId || 0,
                "UserId": $scope.doctorinfo.doctoridm || 0,
                "OrganizationId": $scope.HospitalId || null,
                "ParentOrganizationId": parentHospitalId || 0,
                "PrinterTypeId": $scope.DefacultLabelSizeObj.PrinterTypeId || 0,
                "PrinterTypeName": $scope.DefacultLabelSizeObj.PrinterTypeName || "",
                "LabelWidth": $scope.DefacultLabelSizeObj.LabelWidth || 0,
                "LabelHeight": $scope.DefacultLabelSizeObj.Labelheight || 0,
                "FontSize": $scope.DefacultLabelSizeObj.Fontsize || 0,
                "LeftStartSize": $scope.DefacultLabelSizeObj.LeftStartSize || 0,
                "TopStartSize": $scope.DefacultLabelSizeObj.TopStartSize || 0,
                "SpaceBetweenLine": $scope.DefacultLabelSizeObj.SpaceBetweenLine || 0,
                "PrintBarcode": $scope.DefacultLabelSizeObj.PrintBarcode || false,
                "BarcodeWidth": $scope.DefacultLabelSizeObj.Barcodewidth || 0,
                "BarcodeHeight": $scope.DefacultLabelSizeObj.Barcodeheight || 0,
                "VerticalSpaceOfBarcode": $scope.DefacultLabelSizeObj.VerticalSpaceOfBarcode || 0,
                "PageOrientation": $scope.DefacultLabelSizeObj.PageOrientation || '',
                "DeleteInd":'N'
            }
            eHnoteMainAppointmentService.AddUpdateLabelPrinterSettings(requestObj).success(function (res) {
                alertify.success("Label Print Settings saved successfully");
                $scope.GetLabelPrintSettingsData();
            }).error(function (error) {
                alertify.error("Label Print Settings updation failed");
            });
        };

        $scope.MasterDiagnosisGlobalArray = [];
        $scope.MasterDiagnosisOrgArray = [];
        $scope.MasterDiagnosisUserArray = [];
        $scope.MasterProceduresGlobalArray = [];
        $scope.MasterProceduresOrgArray = [];
        $scope.MasterProceduresUserArray = [];
        $scope.MasterMedicinesGlobalArray = [];
        $scope.MasterMedicinesOrgArray = [];
        $scope.MasterMedicinesUserArray = [];


        $scope.navClickDiagItems = function () {
            getMasterDiagnosisItems();
        };


        $scope.navClickProcedureItems = function () {

            $scope.settingsbillTab = 2;
            $scope.getOrgPromoCodes();

        };
        $scope.UnitsList = [];
        $scope.SchedulesTypes = [];
        $scope.GetUnits = function () {
            InventoryService.GetUnits().then(function (resp) {
                $scope.UnitsList = resp.data.data;
            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };

        $scope.GetScheduleList = function () {
            InventoryService.GetScheduleList().then(function (resp) {
                $scope.SchedulesTypes = resp.data.data;
            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };
        $scope.navClickMedicineItems = function () {
            getAllMedicineTypes();
            getMasterMedicineItems($scope.hospid);
            $scope.GetUnits();
            $scope.GetScheduleList();


            $scope.userBranchesForMedicines = angular.copy($scope.AllUserBranchesList);
            $scope.userBranchesForMedicines = $filter("filter")($scope.userBranchesForMedicines, function (item, index) { return item.ClinicId !== 0; });

            $scope.MedicineOrgObj = $filter("filter")($scope.userBranchesForMedicines, { "ClinicId": $scope.hospid }, true)[0];


        };
        $scope.navClickInvItems = function () {
            //getInvCategoriesbyId($scope.investigationCatPageNumber, "All");
            //getInvestigationsbyId();
            getAllCategoriesnInestigations();
            $scope.MainAllCatInvList = [];
            $scope.SubAllCatInvList = [];
            $scope.btnDocInvName = "Save";
        };


        function getMasterDiagnosisItems() {
            object = {
                "LevelType": $scope.masterDiagLevelType,
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": $scope.masterDiagSearchText,
                "PageSize": $scope.masterDiagPageSize,
                "PageNumber": $scope.masterDiagPageNumber,
                "ParentOrganizationId": $scope.ParentHospitalID || null
            };

            eHnoteSettingsDataService.GetMasterDiagnosis(object).success(function (response) {
                $scope.MasterDiagnosisGlobalArray = [];
                $scope.MasterDiagnosisOrgArray = [];
                $scope.MasterDiagnosisUserArray = [];
                if (response.DiagnosisList !== undefined) {
                    if (response.DiagnosisList.length > 0) {
                        if ($scope.masterDiagLevelType === 'G') {

                            $scope.MasterDiagnosisGlobalArray = response.DiagnosisList;
                        }
                        if ($scope.masterDiagLevelType === 'O') {

                            $scope.MasterDiagnosisOrgArray = response.DiagnosisList;
                        }
                        if ($scope.masterDiagLevelType === 'U') {

                            $scope.MasterDiagnosisUserArray = response.DiagnosisList;
                        }

                        $scope.masterdiagItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        }


        $scope.masterDiagPagechanged = function (pagenumber) {
            $scope.masterDiagPageNumber = pagenumber;
            getMasterDiagnosisItems();
        };


        $scope.showModifyMasterDiagDiv = false;
        $scope.masterDiagnosisId = 0;
        $scope.masterDiagnosisName = "";
        $scope.masterDiagnosisNotes = "";
        $scope.masterDiagnosisIsActive = "Y";
        $scope.masterDiagnosisBtnName = "Save";
        $scope.masterDiagnosisCode = "";
        $scope.masterDiagnosisFullName = "";

        $scope.switchMasterDiagTab = function (val) {

            $scope.showMasterDiagDiv = val;
            //if (val === 1) {
            //    $scope.masterDiagLevelType = "G";
            //    $scope.masterDiagPageNumber = 1;
            //    getMasterDiagnosisItems();
            //}
            if (val === 2) {
                $scope.masterDiagLevelType = "O";
                $scope.masterDiagPageNumber = 1;
                getMasterDiagnosisItems();
            }
            //if (val === 3) {
            //    $scope.masterDiagLevelType = "U";
            //    $scope.masterDiagPageNumber = 1;
            //    getMasterDiagnosisItems();
            //}

        };

        $scope.CancelMasterDiagClick = function () {
            $scope.masterDiagnosisId = 0;
            $scope.masterDiagnosisName = "";
            $scope.masterDiagnosisNotes = "";
            $scope.masterDiagnosisIsActive = "Y";
            $scope.showModifyMasterDiagDiv = false;
            $scope.masterDiagnosisBtnName = "Save";
            $scope.masterDiagnosisCode = "";
        };

        $scope.AddupdateMasteDiag = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateDiagnosis) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.masterDiagnosisName === "" || $scope.masterDiagnosisName === undefined) {
                alertify.error("Add Diagnosis Name");
                return false;
            }

            object = {
                "DiagnosisId": $scope.masterDiagnosisId,
                "DiagnosisName": $scope.masterDiagnosisName,
                "DiagnosisNotes": $scope.masterDiagnosisNotes,
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.masterDiagnosisIsActive,
                "SpecializationId": $scope.SpecializationId,
                "DiagnosisCode": $scope.masterDiagnosisCode,
                "ParentOrganizationId": $scope.ParentHospitalID || null,
            };

            if ($scope.masterDiagnosisId == 0) {
                if ($scope.MasterDiagnosisOrgArray.length > 0) {

                    if (angular.isObject($scope.masterDiagnosisName)) {
                        var List = $filter("filter")($scope.MasterDiagnosisOrgArray, { "DiagnosisName": $scope.masterDiagnosisName.DiagnosisName }, true);
                    }
                    else {
                        var List = $filter("filter")($scope.MasterDiagnosisOrgArray, { "DiagnosisName": $scope.masterDiagnosisName }, true);
                    }

                    if (List.length > 0) {
                        alertify.error('Diagnosis Name is already exists');
                        return;
                    }
                }
            }

            eHnoteSettingsDataService.addUpdateMasterDiagnosis(object).success(function (response) {

                if ($scope.masterDiagnosisIsActive === 'N') {

                    var mObj = datapersistanceFactory.getItem('masterDataArrays');
                    for (var i = 0; i < mObj.masterDiagnosisArray.length; i++) {
                        if (mObj.masterDiagnosisArray[i].DiagnosisId === $scope.masterDiagnosisId) {
                            mObj.masterDiagnosisArray.splice(i, 1);
                        }
                    }
                    loginCookieFactory.set('masterDataArrays', mObj);

                    alertify.success("Diagnosis Deleted Successfully");
                    $scope.CancelMasterDiagClick();
                    getMasterDiagnosisItems();

                } else {
                    if (response.status === 'Success') {
                        if ($scope.masterDiagnosisId === undefined || $scope.masterDiagnosisId === 0) {
                            addToCache('masterDiagnosisArray', response.DiagnosisList[0]);
                            alertify.success("Diagnosis Added Successfully");
                        } else {

                            var mObj = datapersistanceFactory.getItem('masterDataArrays');

                            for (var i = 0; i < mObj.masterDiagnosisArray.length; i++) {
                                if (mObj.masterDiagnosisArray[i].DiagnosisId === response.DiagnosisList[0].DiagnosisId) {
                                    mObj.masterDiagnosisArray[i] = response.DiagnosisList[0];
                                }
                            }

                            loginCookieFactory.set('masterDataArrays', mObj);

                            alertify.success("Diagnosis Updated Successfully");
                        }
                        $scope.CancelMasterDiagClick();
                        getMasterDiagnosisItems();

                    }

                    if (response.status === 'Failure') {
                        if (response.Message === 'DiagnosisName Already exists') {
                            alertify.error("Diagnosis Name already exist");
                            $scope.masterDiagnosisName = "";
                        }
                    }
                }



            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.editMasterDiagItem = function (item, index) {

            $scope.showModifyMasterDiagDiv = true;
            $scope.masterDiagnosisId = item.DiagnosisId;
            $scope.masterDiagnosisName = item.DiagnosisName;
            $scope.masterDiagnosisNotes = item.DiagnosisNotes;
            $scope.masterDiagnosisIsActive = "Y";
            $scope.masterDiagnosisBtnName = "Update";
        };


        $scope.deleteMasterDiagItem = function (item, index) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this diagnosis? </h4>", function () {

                $scope.masterDiagnosisId = item.DiagnosisId;
                $scope.masterDiagnosisName = item.DiagnosisName;
                $scope.masterDiagnosisNotes = item.DiagnosisNotes;
                $scope.masterDiagnosisIsActive = 'N';
                $scope.AddupdateMasteDiag();
            }, function () {
                r = "You pressed Cancel!";
            });
        };
        $scope.EditDiagnosisCode = false;

        $scope.editOrgMasterDiagItem = function (item, index) {
            $scope.showModifyMasterDiagDiv = true;
            $scope.masterDiagnosisId = item.DiagnosisId;
            $scope.masterDiagnosisName = item.DiagnosisName;
            var list = $scope.masterDiagnosisName.split(':');
            $scope.masterDiagnosisName = list[0];
            $scope.masterDiagnosisCode = item.DiagnosisCode;
            var ParentorgId = item.HospitalId;
            //if ($scope.masterDiagnosisCode ==="")
            if (ParentorgId !== 1) {
                $scope.EditDiagnosisCode = true;
            }
            else {
                $scope.EditDiagnosisCode = false;
            }

            $scope.masterDiagnosisNotes = item.DiagnosisNotes;
            $scope.masterDiagnosisIsActive = "Y";
            $scope.masterDiagnosisBtnName = "Update";
        };


        $scope.deleteOrgMasterDiagItem = function (item, index) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this diagnosis? </h4>", function () {

                $scope.masterDiagnosisId = item.DiagnosisId;
                $scope.masterDiagnosisName = item.DiagnosisName;
                $scope.masterDiagnosisNotes = item.DiagnosisNotes;
                $scope.masterDiagnosisIsActive = 'N';
                $scope.AddupdateMasteDiag();
            }, function () {
                r = "You pressed Cancel!";
            });
        };


        $scope.searchMasterDiagnosis = function (val) {
            $scope.masterDiagSearchText = val;
            // getMasterDiagnosisItems();
            var object = {
                "LevelType": $scope.masterDiagLevelType,
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": $scope.masterDiagSearchText,
                "PageSize": 10,
                "PageNumber": 1,
                "ParentOrganizationId": $scope.ParentHospitalID || null,
            };

            eHnoteSettingsDataService.GetMasterDiagnosis(object).success(function (response) {
                $scope.MasterDiagnosisGlobalArray = [];
                $scope.MasterDiagnosisOrgArray = [];
                $scope.MasterDiagnosisUserArray = [];
                if (response.DiagnosisList !== undefined) {
                    if (response.DiagnosisList.length > 0) {
                        if ($scope.masterDiagLevelType === 'G') {

                            $scope.MasterDiagnosisGlobalArray = response.DiagnosisList;
                        }
                        if ($scope.masterDiagLevelType === 'O') {

                            $scope.MasterDiagnosisOrgArray = response.DiagnosisList;
                        }
                        if ($scope.masterDiagLevelType === 'U') {

                            $scope.MasterDiagnosisUserArray = response.DiagnosisList;
                        }

                        $scope.masterdiagItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        };


        $scope.showModifyMasterTreatDiv = false;
        $scope.masterProcedureBtnName = "Save";
        $scope.masterOtherProcedureBtnName = "Save";
        $scope.masterProcedureObj = {
            "HospitalId": parentHospitalId,
            "UserId": $scope.UserId,
            "ProcedureId": 0,
            "OrgProcedureId": 0,
            "ProcedureName": "",
            "ProcedureNotes": "",
            "SpecializationId": $scope.SpecializationId,
            "BillingCode": "",
            "ProcedureCode": "",
            "ProcedureGeneralCost": "",
            "ProcedureCgsCost": 0,
            "ProcedureCgsValue": "",
            "CgsType": "true",
            "ProcedureSgsCost": 0,
            "ProcedureSgsValue": "",
            "SgsType": "true",
            "ProcedurePvtInsuranceCost": 0,
            "ProcedurePvtInsuranceValue": "",
            "PvtInsType": "true",
            "ProcedureTypeId": 1,
            "ActiveInd": "Y",
            "ProcedureMaxDiscountValue": 0,
            "ProcedureMaxDiscountCost": 0,
            "ProcedureMaxDiscountType": 'A',
            "AllHospitalsIndicator": 1
        };



        $scope.masterOtherProcedureObj = {
            "HospitalId": parentHospitalId,
            "UserId": $scope.UserId,
            "ProcedureId": 0,
            "OrgProcedureId": 0,
            "ProcedureName": "",
            "ProcedureNotes": "",
            "SpecializationId": $scope.SpecializationId,
            "BillingCode": "",
            "CPTCode": "",
            "ProcedureGeneralCost": "",
            "ProcedureCgsCost": 0,
            "ProcedureCgsValue": "",
            "CgsType": "true",
            "ProcedureSgsCost": 0,
            "ProcedureSgsValue": "",
            "SgsType": "true",
            "ProcedurePvtInsuranceCost": 0,
            "ProcedurePvtInsuranceValue": "",
            "PvtInsType": "true",
            "ProcedureTypeId": 1,
            "ActiveInd": "Y",
            "ProcedureMaxDiscountValue": 0,
            "ProcedureMaxDiscountCost": 0,
            "ProcedureMaxDiscountType": 'A',
            "AllHospitalsIndicator": 1
        };


        function getMasterProcedureItems() {
            if ($scope.masterProceduresLevelType === "O") {
                var splid = 0;
                if ($scope.SpecializationId === 20) {
                    splid = null;
                } else {
                    splid = $scope.SpecializationId
                }
                object = {
                    "LevelType": $scope.masterProceduresLevelType,
                    "HospitalId": $scope.FilterProcedureHospitalId ? $scope.FilterProcedureHospitalId : parentHospitalId,
                    "UserId": $scope.UserId,
                    "SpecializationId": splid,
                    "SearchText": $scope.masterProceduresSearchText,
                    "PageSize": $scope.masterProceduresPageSize,
                    "PageNumber": $scope.masterProceduresPageNumber,
                    "ServicesTypeId": 0,
                    "AllBranchInd": $scope.FilterAllHospitalsIndicator
                };
            } else {
                object = {
                    "LevelType": $scope.masterProceduresLevelType,
                    //"HospitalId": parentHospitalId,
                    "HospitalId": $scope.FilterProcedureHospitalId ? $scope.FilterProcedureHospitalId : parentHospitalId,
                    "UserId": $scope.UserId,
                    "SpecializationId": $scope.SpecializationId,
                    "SearchText": $scope.masterProceduresSearchText,
                    "PageSize": $scope.masterProceduresPageSize,
                    "PageNumber": $scope.masterProceduresPageNumber,
                    //"ProcedureTypeId": $scope.selectedProcedureTypeId
                    "ServicesTypeId": 0
                };
            }

            eHnoteSettingsDataService.GetMasterProcedures(object).success(function (response) {
                $scope.MasterProceduresGlobalArray = [];
                $scope.MasterProceduresOrgArray = [];
                $scope.MasterProceduresUserArray = [];
                if (response.ProcedureList !== undefined) {
                    if (response.ProcedureList.length > 0) {
                        if ($scope.masterProceduresLevelType === 'G') {

                            $scope.MasterProceduresGlobalArray = response.ProcedureList;
                        }
                        if ($scope.masterProceduresLevelType === 'O') {

                            $scope.MasterProceduresOrgArray = response.ProcedureList;
                        }
                        if ($scope.masterProceduresLevelType === 'U') {

                            $scope.MasterProceduresUserArray = response.ProcedureList;
                        }

                        $scope.masterProcedureItems = response.count;
                    }
                }

            }).error(function (error) {
                console.log(error);
            });
        }
        function getMasterOtherProcedureItems() {
            if ($scope.masterProceduresLevelType === "O") {
                var splid = 0;
                if ($scope.SpecializationId === 20) {
                    splid = null;
                } else {
                    splid = $scope.SpecializationId
                }
                object = {
                    "LevelType": $scope.masterProceduresLevelType,
                    "HospitalId": $scope.FilterProcedureHospitalId ? $scope.FilterProcedureHospitalId : parentHospitalId,
                    "UserId": $scope.UserId,
                    "SpecializationId": splid,
                    "SearchText": $scope.masterProceduresSearchText,
                    "PageSize": $scope.masterProceduresPageSize,
                    "PageNumber": $scope.masterProceduresPageNumber,
                    "ProcedureTypeId": 0,
                    "AllBranchInd": $scope.FilterAllHospitalsIndicator
                };
            } else {
                object = {
                    "LevelType": $scope.masterProceduresLevelType,
                    //"HospitalId": parentHospitalId,
                    "HospitalId": $scope.FilterProcedureHospitalId ? $scope.FilterProcedureHospitalId : parentHospitalId,
                    "UserId": $scope.UserId,
                    "SpecializationId": $scope.SpecializationId,
                    "SearchText": $scope.masterProceduresSearchText,
                    "PageSize": $scope.masterProceduresPageSize,
                    "PageNumber": $scope.masterProceduresPageNumber,
                    //"ProcedureTypeId": $scope.selectedProcedureTypeId
                    "ProcedureTypeId": 0
                };
            }

            eHnoteSettingsDataService.GetMasterOtherProcedures(object).success(function (response) {
                $scope.MasterProceduresGlobalArray = [];
                $scope.MasterProceduresOrgArray = [];
                $scope.MasterProceduresUserArray = [];
                if (response.ProcedureList !== undefined) {
                    if (response.ProcedureList.length > 0) {
                        if ($scope.masterProceduresLevelType === 'G') {

                            $scope.MasterProceduresGlobalArray = response.ProcedureList;
                        }
                        if ($scope.masterProceduresLevelType === 'O') {

                            $scope.MasterProceduresOrgArray = response.ProcedureList;
                        }
                        if ($scope.masterProceduresLevelType === 'U') {

                            $scope.MasterProceduresUserArray = response.ProcedureList;
                        }

                        $scope.masterProcedureItems = response.count;
                    }
                }

            }).error(function (error) {
                console.log(error);
            });
        }


        //$scope.masterProcedurePagechanged = function (pagenumber) {
        //    $scope.masterProceduresPageNumber = pagenumber;
        //    getMasterProcedureItems();
        //};

        $scope.masterOtherProcedurePagechanged = function (pagenumber) {
            $scope.masterProceduresPageNumber = pagenumber;
            getMasterOtherProcedureItems();
        };
        $scope.switchMasterTreatTab = function (val) {

            $scope.showMasterTreatDiv = 2;
            //if (val === 1) {
            //    $scope.masterProceduresLevelType = "G";
            //    $scope.masterProceduresPageNumber = 1;
            //    getMasterProcedureItems();
            //}
            if (val === 2) {
                $scope.masterProceduresLevelType = "O";
                $scope.masterProceduresPageNumber = 1;
                $scope.FilterAllHospitalsIndicator = 1;
                $scope.OrgListObj = $scope.OnlyAllBranchesList[0];
                getMasterProcedureItems();
            }
            //if (val === 3) {
            //    $scope.masterProceduresLevelType = "U";
            //    $scope.masterProceduresPageNumber = 1;
            //    getMasterProcedureItems();
            //}

        };

        /* $scope.addUpdateMasterProcClick = function () {
 
             if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateProcedures) {
                 alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                 return false;
             }
 
             if ($scope.masterProcedureObj.ProcedureName === "" || $scope.masterProcedureObj.ProcedureName === undefined) {
                 alertify.error("Please Enter Procedure Name");
                 return false;
             }
             if ($scope.masterProcedureObj.ProcedureCode == "" || $scope.masterProcedureObj.ProcedureCode == undefined) {
                 alertify.error("Please Enter CPT Code");
                 return false;
             }
 
             if ($scope.masterProcedureObj.ProcedureGeneralCost === "" || $scope.masterProcedureObj.ProcedureGeneralCost === undefined) {
                 alertify.error("GenerelCost Should Not be Empty");
                 return false;
             }
             if ($scope.masterProcedureObj.HospitalId === 0) {
                 $scope.masterProcedureObj.HospitalId = parentHospitalId;
             }
 
 
             console.log(JSON.stringify($scope.masterProcedureObj));
             //return false;
             eHnoteSettingsDataService.AddUpdateMasterProcedures($scope.masterProcedureObj).success(function (response) {
 
 
                 if ($scope.masterProcedureObj.ActiveInd === 'N') {
                     var mObj = datapersistanceFactory.getItem('masterDataArrays');
                     if (mObj.masterProceduresArray != undefined) {
                         for (var i = 0; i < mObj.masterProceduresArray.length; i++) {
                             if (mObj.masterProceduresArray[i].ProcedureId === $scope.masterProcedureObj.ProcedureId) {
                                 mObj.masterProceduresArray.splice(i, 1);
                             }
                         }
                     }
 
                     loginCookieFactory.set('masterDataArrays', mObj);
                     alertify.success("Procedure Deleted Successfully");
                     $scope.btnCancelMasterProcedure();
                     getMasterProcedureItems();
                 } else {
                     if (response.status === 'Success') {
                         if ($scope.masterProcedureObj.ProcedureId === 0) {
                             addToCache('masterProceduresArray', response.ProcedureList[0]);
                             alertify.success("Procedure Added Successfully");
                         } else {
                             var mObj = datapersistanceFactory.getItem('masterDataArrays');
                             for (var i = 0; i < mObj.masterProceduresArray.length; i++) {
                                 if (mObj.masterProceduresArray[i].ProcedureId === response.ProcedureList[0].ProcedureId) {
                                     mObj.masterProceduresArray[i] = response.ProcedureList[0];
                                 }
                             }
                             loginCookieFactory.set('masterDataArrays', mObj);
                             alertify.success("Procedure Updated Successfully");
                         }
                         $scope.btnCancelMasterProcedure();
                         getMasterProcedureItems();
                     }
                     if (response.status === 'Failure') {
                         alertify.error(response.Message);
                         $scope.masterProcedureObj.ProcedureName = "";
                     }
                 }
             }).error(function (error) {
                 alertify.error("Error Occured");
             });
         };*/


        $scope.addUpdateMasterOtherProcClick = function () {

            if ($scope.masterOtherProcedureObj.ProcedureName === "" || $scope.masterOtherProcedureObj.ProcedureName === undefined) {
                alertify.error("Please Enter Procedure Name");
                return false;
            }

            if ($scope.masterOtherProcedureObj.ProcedureGeneralCost === "" || $scope.masterOtherProcedureObj.ProcedureGeneralCost === undefined) {
                alertify.error("GenerelCost Should Not be Empty");
                return false;
            }

            if ($scope.masterOtherProcedureObj.CPTCode == "") {
                alertify.error("Please Enter CPT Code");
                return false;
            }
            if ($scope.masterOtherProcedureObj.HospitalId === 0) {
                $scope.masterOtherProcedureObj.HospitalId = parentHospitalId;
            }


            console.log(JSON.stringify($scope.masterOtherProcedureObj));
            //return false;
            eHnoteSettingsDataService.AddUpdateMasterOtherProcedures($scope.masterOtherProcedureObj).success(function (response) {


                if ($scope.masterOtherProcedureObj.ActiveInd === 'N') {

                    alertify.success("Procedure Deleted Successfully");
                    $scope.btnCancelMasterProcedure();
                    getMasterProcedureItems();
                } else {
                    if (response.status === 'Success') {
                        if ($scope.masterOtherProcedureObj.ProcedureId === 0) {
                            alertify.success("Procedure Added Successfully");
                        } else {
                            alertify.success("Procedure Updated Successfully");
                        }
                        $scope.btnCancelMasterOtherProcedure();
                        getMasterOtherProcedureItems();
                    }
                    if (response.status === 'Failure') {
                        alertify.error(response.Message);
                        $scope.masterOtherProcedureObj.ProcedureName = "";
                    }
                }
            }).error(function (error) {
                alertify.error("Error Occured");
            });
        };


        $scope.btnCancelMasterProcedure = function () {
            $scope.showModifyMasterTreatDiv = false;
            $scope.masterProcedureBtnName = "Save";
            $scope.masterProcedureObj = {
                "HospitalId": 0,
                "UserId": $scope.UserId,
                "ProcedureId": 0,
                "OrgProcedureId": 0,
                "ProcedureName": "",
                "ProcedureNotes": "",
                "SpecializationId": $scope.SpecializationId,
                "BillingCode": "",
                "ProcedureGeneralCost": "",
                "ProcedureCgsCost": 0,
                "ProcedureCgsValue": "",
                "CgsType": "true",
                "ProcedureSgsCost": 0,
                "ProcedureSgsValue": "",
                "SgsType": "true",
                "ProcedurePvtInsuranceCost": 0,
                "ProcedurePvtInsuranceValue": "",
                "PvtInsType": "true",
                "ServicesTypeId": 1,
                "ActiveInd": "",
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'
            };

            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": 0 }, true);


            $scope.masterProcedureObj.HospitalObj = SelectedItems[0];
            $scope.masterProcedureObj.AllHospitalsIndicator = 1;

        };


        $scope.btnCancelMasterOtherProcedure = function () {
            $scope.showModifyMasterTreatDiv = false;
            $scope.masterOtherProcedureBtnName = "Save";
            $scope.masterOtherProcedureObj = {
                "HospitalId": 0,
                "UserId": $scope.UserId,
                "ProcedureId": 0,
                "OrgProcedureId": 0,
                "ProcedureName": "",
                "ProcedureNotes": "",
                "SpecializationId": $scope.SpecializationId,
                "BillingCode": "",
                "CPTCode": "",
                "ProcedureGeneralCost": "",
                "ProcedureCgsCost": 0,
                "ProcedureCgsValue": "",
                "CgsType": "true",
                "ProcedureSgsCost": 0,
                "ProcedureSgsValue": "",
                "SgsType": "true",
                "ProcedurePvtInsuranceCost": 0,
                "ProcedurePvtInsuranceValue": "",
                "PvtInsType": "true",
                "ProcedureTypeId": 1,
                "ActiveInd": "",
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'
            };

            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": 0 }, true);


            $scope.masterOtherProcedureObj.HospitalObj = SelectedItems[0];
            $scope.masterOtherProcedureObj.AllHospitalsIndicator = 1;

        };
        $scope.editMasterTreatItem = function (item, index) {


            if (item.ProcedureCgsCost === 0) {
                item.ProcedureCgsValue = 0;
            } else {
                var cgsValue = 0; cgsValue = (item.ProcedureGeneralCost - item.ProcedureCgsCost); item.ProcedureCgsValue = cgsValue;
            }

            if (item.ProcedureSgsCost === 0) {
                item.ProcedureSgsValue = sgsValue;
            } else {
                var sgsValue = 0; sgsValue = (item.ProcedureGeneralCost - item.ProcedureSgsCost); item.ProcedureSgsValue = sgsValue;
            }

            if (item.ProcedureInsuranceCost === 0) {
                item.ProcedurePvtInsuranceValue = 0;
            } else {
                var piValue = 0; piValue = (item.ProcedureGeneralCost - item.ProcedureInsuranceCost); item.ProcedurePvtInsuranceValue = piValue;
            }




            //if (item.ProcedureMaxDiscountCost === 0) {
            //    item.ProcedureMaxDiscountValue = 0;
            //} else {
            //    var discountValue = item.ProcedureGeneralCost - item.ProcedureMaxDiscountCost;
            //    item.ProcedureMaxDiscountValue = discountValue;
            //}



            $scope.masterProcedureObj = {
                //"HospitalId": parentHospitalId,
                "HospitalId": item.HospitalId,
                //"UserId": item.UserId,
                "UserId": $scope.UserId,
                "ProcedureId": item.ProcedureId,
                "OrgProcedureId": item.OrgProcedureId || 0,
                "ProcedureName": item.ProcedureName,
                "ProcedureNotes": item.ProcedureNotes,
                "SpecializationId": item.SpecializationId,
                "ProcedureGeneralCost": item.ProcedureGeneralCost,
                "ProcedureCgsCost": item.ProcedureCgsCost,
                "ProcedureCgsValue": item.ProcedureCgsValue,
                "BillingCode": item.BillingCode,
                "ProcedureCode": item.ProcedureCode,
                "CgsType": "true",
                "ProcedureSgsCost": item.ProcedureSgsCost,
                "ProcedureSgsValue": item.ProcedureSgsValue,
                "SgsType": "true",
                "ProcedurePvtInsuranceCost": item.ProcedureInsuranceCost,
                "ProcedurePvtInsuranceValue": item.ProcedurePvtInsuranceValue,
                "PvtInsType": "true",
                // "ProcedureTypeId": item.ProcedureTypeId,
                "ServicesTypeId": item.ServicesTypeId,
                "ActiveInd": item.ActiveInd,
                "ProcedureMaxDiscountValue": item.ProcedureMaxDiscountValue || 0,
                "ProcedureMaxDiscountCost": item.ProcedureMaxDiscountCost || 0,
                "ProcedureMaxDiscountType": item.ProcedureMaxDiscountType ? item.ProcedureMaxDiscountType : "A"
            };


            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.HospitalId }, true);


            $scope.masterProcedureObj.HospitalObj = SelectedItems[0];
            $scope.masterProcedureObj.HospitalId = item.HospitalId;
            //$scope.masterProcedureObj.AllHospitalsIndicator = 0;


            $scope.showModifyMasterTreatDiv = true;
            $scope.masterProcedureBtnName = "Update";
        };


        $scope.deleteMasterTreatItem = function (item, index) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this procedure? </h4>", function () {

                $scope.masterProcedureObj = {
                    //  "HospitalId": parentHospitalId,
                    "HospitalId": item.HospitalId,
                    //"UserId": item.UserId,
                    "UserId": $scope.UserId,
                    "OrgProcedureId": item.OrgProcedureId || 0,
                    "ProcedureId": item.ProcedureId,
                    "ProcedureName": item.ProcedureName,
                    "ProcedureNotes": item.ProcedureNotes,
                    "SpecializationId": item.SpecializationId,
                    "ProcedureGeneralCost": item.ProcedureGeneralCost,
                    "BillingCode": item.BillingCode,
                    "ProcedureCode": item.ProcedureCode,
                    "ProcedureCgsCost": item.ProcedureCgsCost,
                    "CgsType": "true",
                    "ProcedureSgsCost": item.ProcedureSgsCost,
                    "SgsType": "true",
                    "ProcedurePvtInsuranceCost": item.ProcedureInsuranceCost,
                    "PvtInsType": "true",
                    // "ProcedureTypeId": item.ProcedureTypeId,
                    "ServicesTypeId": item.ServicesTypeId,
                    "ActiveInd": 'N',
                    "ProcedureMaxDiscountValue": 0,
                    "ProcedureMaxDiscountCost": 0,
                    "ProcedureMaxDiscountType": 'A'
                };
                var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.HospitalId }, true);


                $scope.masterProcedureObj.HospitalObj = SelectedItems[0];
                $scope.masterProcedureObj.HospitalId = item.HospitalId;
                $scope.addUpdateMasterProcClick();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        };


        $scope.editMasterOtherTreatItem = function (item, index) {


            if (item.ProcedureCgsCost === 0) {
                item.ProcedureCgsValue = 0;
            } else {
                var cgsValue = 0; cgsValue = (item.ProcedureGeneralCost - item.ProcedureCgsCost); item.ProcedureCgsValue = cgsValue;
            }

            if (item.ProcedureSgsCost === 0) {
                item.ProcedureSgsValue = sgsValue;
            } else {
                var sgsValue = 0; sgsValue = (item.ProcedureGeneralCost - item.ProcedureSgsCost); item.ProcedureSgsValue = sgsValue;
            }

            if (item.ProcedureInsuranceCost === 0) {
                item.ProcedurePvtInsuranceValue = 0;
            } else {
                var piValue = 0; piValue = (item.ProcedureGeneralCost - item.ProcedureInsuranceCost); item.ProcedurePvtInsuranceValue = piValue;
            }




            //if (item.ProcedureMaxDiscountCost === 0) {
            //    item.ProcedureMaxDiscountValue = 0;
            //} else {
            //    var discountValue = item.ProcedureGeneralCost - item.ProcedureMaxDiscountCost;
            //    item.ProcedureMaxDiscountValue = discountValue;
            //}



            $scope.masterOtherProcedureObj = {
                //"HospitalId": parentHospitalId,
                "HospitalId": item.HospitalId,
                //"UserId": item.UserId,
                "UserId": $scope.UserId,
                "ProcedureId": item.ProcedureId,
                "OrgProcedureId": item.OrgProcedureId || 0,
                "ProcedureName": item.ProcedureName,
                "ProcedureNotes": item.ProcedureNotes,
                "SpecializationId": item.SpecializationId,
                "ProcedureGeneralCost": item.ProcedureGeneralCost,
                "ProcedureCgsCost": item.ProcedureCgsCost,
                "ProcedureCgsValue": item.ProcedureCgsValue,
                "BillingCode": item.BillingCode,
                "CPTCode": item.CPTCode || '',
                "CgsType": "true",
                "ProcedureSgsCost": item.ProcedureSgsCost,
                "ProcedureSgsValue": item.ProcedureSgsValue,
                "SgsType": "true",
                "ProcedurePvtInsuranceCost": item.ProcedureInsuranceCost,
                "ProcedurePvtInsuranceValue": item.ProcedurePvtInsuranceValue,
                "PvtInsType": "true",
                "ProcedureTypeId": item.ProcedureTypeId,
                "ActiveInd": item.ActiveInd,
                "ProcedureMaxDiscountValue": item.ProcedureMaxDiscountValue || 0,
                "ProcedureMaxDiscountCost": item.ProcedureMaxDiscountCost || 0,
                "ProcedureMaxDiscountType": item.ProcedureMaxDiscountType ? item.ProcedureMaxDiscountType : "A"
            };


            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.HospitalId }, true);


            $scope.masterOtherProcedureObj.HospitalObj = SelectedItems[0];
            $scope.masterOtherProcedureObj.HospitalId = item.HospitalId;
            //$scope.masterProcedureObj.AllHospitalsIndicator = 0;


            $scope.showModifyMasterTreatDiv = true;
            $scope.masterOtherProcedureBtnName = "Update";
        };


        $scope.deleteMasterOtherTreatItem = function (item, index) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this procedure? </h4>", function () {

                $scope.masterOtherProcedureObj = {
                    //  "HospitalId": parentHospitalId,
                    "HospitalId": item.HospitalId,
                    //"UserId": item.UserId,
                    "UserId": $scope.UserId,
                    "OrgProcedureId": item.OrgProcedureId || 0,
                    "ProcedureId": item.ProcedureId,
                    "ProcedureName": item.ProcedureName,
                    "ProcedureNotes": item.ProcedureNotes,
                    "SpecializationId": item.SpecializationId,
                    "ProcedureGeneralCost": item.ProcedureGeneralCost,
                    "BillingCode": item.BillingCode,
                    "ProcedureCgsCost": item.ProcedureCgsCost,
                    "CgsType": "true",
                    "ProcedureSgsCost": item.ProcedureSgsCost,
                    "SgsType": "true",
                    "ProcedurePvtInsuranceCost": item.ProcedureInsuranceCost,
                    "PvtInsType": "true",
                    "ProcedureTypeId": item.ProcedureTypeId,
                    "ActiveInd": 'N',
                    "ProcedureMaxDiscountValue": 0,
                    "ProcedureMaxDiscountCost": 0,
                    "ProcedureMaxDiscountType": 'A'
                };
                var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.HospitalId }, true);


                $scope.masterOtherProcedureObj.HospitalObj = SelectedItems[0];
                $scope.masterOtherProcedureObj.HospitalId = item.HospitalId;
                $scope.addUpdateMasterOtherProcClick();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        };

        $scope.changeCgsValue = function (item) {

            if (item.ProcedureCgsValue === undefined) {
                item.ProcedureCgsCost = 0;
            } else {
                if (parseInt(item.ProcedureCgsValue) > parseInt(item.ProcedureGeneralCost)) {
                    alertify.error("CGS value should not be greater than General cost");
                    item.ProcedureCgsValue = "";
                    item.ProcedureCgsCost = 0;
                    return false;
                }

                if (item.CgsType === 'true') {
                    item.ProcedureCgsCost = item.ProcedureGeneralCost - parseInt(item.ProcedureCgsValue);
                } else {
                    item.ProcedureCgsCost = item.ProcedureGeneralCost - (item.ProcedureGeneralCost / 100 * parseInt(item.ProcedureCgsValue));
                }

            }

        };
        $scope.changeSgsValue = function (item) {


            if (item.ProcedureSgsValue === undefined) {
                item.ProcedureSgsCost = 0;
            } else {

                if (parseInt(item.ProcedureSgsValue) > parseInt(item.ProcedureGeneralCost)) {
                    alertify.error("SGS value should not be greater than General cost");
                    item.ProcedureSgsValue = "";
                    item.ProcedureSgsCost = 0;
                    return false;
                }
                if (item.SgsType === 'true') {
                    item.ProcedureSgsCost = item.ProcedureGeneralCost - parseInt(item.ProcedureSgsValue);
                } else {
                    item.ProcedureSgsCost = item.ProcedureGeneralCost - (item.ProcedureGeneralCost / 100 * parseInt(item.ProcedureSgsValue));
                }
            }


        };
        $scope.changePvtInsValue = function (item) {


            if (item.ProcedurePvtInsuranceValue === undefined) {
                item.ProcedurePvtInsuranceCost = 0;
            } else {


                if (parseInt(item.ProcedurePvtInsuranceValue) > parseInt(item.ProcedureGeneralCost)) {
                    alertify.error("PI value should not be greater than General cost");
                    item.ProcedurePvtInsuranceValue = "";
                    item.ProcedurePvtInsuranceCost = 0;
                    return false;
                }
                if (item.PvtInsType === 'true') {
                    item.ProcedurePvtInsuranceCost = item.ProcedureGeneralCost - parseInt(item.ProcedurePvtInsuranceValue);
                } else {
                    item.ProcedurePvtInsuranceCost = item.ProcedureGeneralCost - (item.ProcedureGeneralCost / 100 * parseInt(item.ProcedurePvtInsuranceValue));
                }
            }


        };

        $scope.changeMaxDiscountValue = function (item) {


            if (item.ProcedureMaxDiscountValue === undefined) {
                item.ProcedureMaxDiscountCost = 0;
            } else {

                if (item.ProcedureGeneralCost != undefined) {
                    if (parseInt(item.ProcedureMaxDiscountValue) > parseInt(item.ProcedureGeneralCost)) {
                        alertify.error("Discount value should not be greater than General cost");
                        item.ProcedureMaxDiscountValue = "";
                        item.ProcedureMaxDiscountCost = 0;
                        return false;
                    }
                    if (item.ProcedureMaxDiscountType === 'A') {
                        item.ProcedureMaxDiscountCost = item.ProcedureGeneralCost - parseInt(item.ProcedureMaxDiscountValue);
                    } else {
                        item.ProcedureMaxDiscountCost = item.ProcedureGeneralCost - (item.ProcedureGeneralCost / 100 * parseInt(item.ProcedureMaxDiscountValue));
                    }
                } else {
                    if (parseInt(item.ProcedureMaxDiscountValue) > parseInt(item.GeneralCost)) {
                        alertify.error("Discount value should not be greater than General cost");
                        item.ProcedureMaxDiscountValue = "";
                        item.ProcedureMaxDiscountCost = 0;
                        return false;
                    }
                    if (item.ProcedureMaxDiscountType === 'A') {
                        item.ProcedureMaxDiscountCost = item.GeneralCost - parseInt(item.ProcedureMaxDiscountValue);
                    } else {
                        item.ProcedureMaxDiscountCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.ProcedureMaxDiscountValue));
                    }
                }

            }


        };



        $scope.searchMasterProcedures = function (val) {
            $scope.masterProceduresSearchText = val;
            $scope.masterProceduresPageNumber = 1;
            getMasterProcedureItems();
        };

        $scope.searchMasterOtherProcedures = function (val) {
            $scope.masterProceduresSearchText = val;
            $scope.masterProceduresPageNumber = 1;
            getMasterOtherProcedureItems();
        };

        $scope.MedicineTypes = [];
        $scope.showModifyMasterMedicineDiv = false;
        $scope.masterMedicineBtnName = "Save";
        function getAllMedicineTypes() {
            eHnoteDiagnosisDataServices.GetAllMedicineTypes().then(function (resp) {
                $scope.MedicineTypes = resp.data.MedicineTypes || [];
                $scope.DrugBrandTypes = resp.data.DrugBrandTypes || [];
                $scope.PackageUnitsArray = resp.data.PackageUnits || [];


            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        }


        function getMasterMedicineItems(HospitalId,masterMedicineSearchText) {
            $scope.masterMedicineSearchText = masterMedicineSearchText || '';
            if ($scope.masterMedicineSearchText !== '') {
                $scope.masterMedicinePageNumber = 1;
            }
            object = {
                "LevelType": $scope.masterMedicineLevelType,
                "HospitalId": HospitalId || null,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": $scope.masterMedicineSearchText,
                "PageSize": $scope.masterMedicinePageSize,
                "PageNumber": $scope.masterMedicinePageNumber,
                "ParentOrganizationId": $scope.ParentHospitalID,
            };
            eHnoteSettingsDataService.GetMasterMedicines(object).success(function (response) {
                $scope.MasterMedicinesGlobalArray = [];
                $scope.MasterMedicinesOrgArray = [];
                $scope.MasterMedicinesUserArray = [];
                if (response.MedicineList !== undefined) {
                    if (response.MedicineList.length > 0) {
                        if ($scope.masterMedicineLevelType === 'G') {
                            $scope.MasterMedicinesGlobalArray = response.MedicineList;
                        }
                        if ($scope.masterMedicineLevelType === 'O') {
                            $scope.MasterMedicinesOrgArray = response.MedicineList;
                        }
                        if ($scope.masterMedicineLevelType === 'U') {
                            $scope.MasterMedicinesUserArray = response.MedicineList;
                        }
                        $scope.masterMedicineItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        }
        $scope.masterMedicinePagechanged = function (pagenumber) {
            $scope.masterMedicinePageNumber = pagenumber;
            getMasterMedicineItems($scope.MedicineOrgObj.ClinicId);
        };
        $scope.switchMasterMedicineTab = function (val) {

            $scope.showMasterMedicineDiv = val;
            //if (val === 1) {
            //    $scope.masterMedicineLevelType = "G";
            //    $scope.masterMedicinePageNumber = 1;
            //    getMasterMedicineItems();
            //}
            if (val === 2) {
                $scope.masterMedicineLevelType = "O";
                $scope.masterMedicinePageNumber = 1;
                getMasterMedicineItems($scope.MedicineOrgObj.ClinicId);
            }
            //if (val === 3) {
            //    $scope.masterMedicineLevelType = "U";
            //    $scope.masterMedicinePageNumber = 1;
            //    getMasterMedicineItems();
            //}
        };
        $scope.addUpdateMasterMedicines = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateMedicines) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.masterMedicineObject.MedicineName === "" || $scope.masterMedicineObject.MedicineName === undefined) {
                alertify.error("Please Enter Medicine Name");
                return false;
            } else {
                $scope.masterMedicineObject.MedicineName = $scope.masterMedicineObject.MedicineName.replace("'", "`");
            }
            if ($scope.masterMedicineObject.MedicineTypeId === "") {
                alertify.error("Please Select Medicine Type");
                return false;
            }
            if ($scope.masterMedicineObject.MedicineId === 0) {
                alertify.error("MedicineId is Zero");
                return false;
            }
            $scope.masterMedicineObject.DrugNDCID = $scope.masterMedicineObject.DrugNDCID || null;
            if ($scope.masterMedicineObject.DrugNDCID === null) {
                alertify.error("Please Enter NDC Value");
                return false;
            }


            var params = angular.copy($scope.masterMedicineObject);
            params.HospitalObj = "";

            eHnoteSettingsDataService.AddUpdateMasterMedicines(params).success(function (response) {

                if (response.status === "Success") {
                    $scope.CancelMasterMedicines();
                    alertify.success("Medicine Added Successfully");
                }
                if (response.status === "Failure") {
                    alertify.error("Medicine Already Exists");
                }
                getMasterMedicineItems($scope.MedicineOrgObj.ClinicId);

            }).error(function (error) {
                alertify.error("Error Occured");
            });
        };
        $scope.CancelMasterMedicines = function () {
            $scope.showModifyMasterMedicineDiv = false;
            $scope.masterMedicineBtnName = "Save";
            $scope.masterMedicineObject = angular.copy($scope.GetMasterMedicineObject());
            $scope.masterMedicineObject.HospitalObj = $scope.AllUserBranchesList[0];
        };
        $scope.editMasterMedicineItem = function (item, index) {

            if (item.UserId === null || item.UserId === undefined) { item.UserId = $scope.UserId; }

            $scope.masterMedicineObject = {
                "HospitalId": parentHospitalId,
                "UserId": item.UserId,
                "MedicineId": item.MedicineId,
                "MedicineName": item.MedicineName,
                "Instructions": item.Instructions,
                "MedicineTypeId": "",
                "MedicineType": item.MedicineType,
                "GenericName": item.GenericName,
                "MedicineStrength": "",
                "MedicineUnitId": "",
                "ScheduleTypeId": "",
                "SourceTypeId": 1,
                "HSNcode": "",
                "Manufacturer": "",
                "SpecializationId": $scope.SpecializationId,
                "ActiveInd": "Y"
            };

            $scope.showModifyMasterMedicineDiv = true;
            $scope.masterMedicineBtnName = "Update";

        };
        $scope.addnewMedicineSettings = function (val) {
            $scope.showModifyMasterMedicineDiv = val;
        }

        $scope.showModifyMasterDiag = function () {
            $scope.showModifyMasterDiagDiv = true;
            $scope.EditDiagnosisCode = true;
        };
        $scope.deleteMasterMedicineItem = function (item, index) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this medicine? </h4>", function () {


                $scope.masterMedicineObject = {
                    "HospitalId": parentHospitalId,
                    "UserId": item.UserId,
                    "MedicineId": item.MedicineId,
                    "MedicineName": item.MedicineName,
                    "Instructions": item.Instructions,
                    "MedicineTypeId": "",
                    "MedicineType": item.MedicineType,
                    "GenericName": item.GenericName,
                    "MedicineStrength": "",
                    "MedicineUnitId": "",
                    "ScheduleTypeId": "",
                    "HSNcode": "",
                    "Manufacturer": "",
                    "SourceTypeId": 1,
                    "SpecializationId": $scope.SpecializationId,
                    "ActiveInd": 'N'
                };
                $scope.addUpdateMasterMedicines();
            },
                function () {
                    r = "You pressed Cancel!";
                });
        };
        $scope.searchOrganizationMedicines = function (masterMedicineSearchText) {
            getMasterMedicineItems($scope.MedicineOrgObj.ClinicId, masterMedicineSearchText);
        };

        $scope.registrationObj = {
            "UserId": 0,
            "RegistrationSettingsId": 0,
            "OrganizationId": 0,
            "RegFeeIncludeInd": true,
            "RegistrationFee": '',
            "DurationPeriod": '',
            "DurationType": "D" || "M" || "Y",
            "Status": false
        };

        // getPatientRegSettings();

        function getPatientRegSettings() {
            var param = {
                "OrganizationId": parentHospitalId
            };
            eHnoteSettingsDataService.GetOrgRegfeeSettings(param).success(function (response) {
                $scope.registrationObj.RegFeeIncludeInd = response[0].RegFeeIncludeInd;
                $scope.registrationObj.RegistrationFee = response[0].RegistrationFee || 0;
                $scope.registrationObj.DurationPeriod = response[0].DurationPeriod || 0;
                //  $scope.registrationObj.DurationType = response[0].DurationType;
                $scope.registrationObj.DurationType = "D";
            });
        }

        $scope.changeRegFee = function (item) {
            if (item === 'N') {
                $scope.savePatientRegSettings();
            }
        };

        $scope.savePatientRegSettings = function () {
            if ($scope.registrationObj.RegFeeIncludeInd === 'N') {
                $scope.registrationObj.RegistrationFee = '';
                $scope.registrationObj.DurationPeriod = '';
                $scope.registrationObj.DurationType = 'D';
            }
            $scope.TotalDays = "";
            $scope.durType = "D";
            $scope.durType = $scope.registrationObj.DurationType === "Y" ? "Y" : ($scope.registrationObj.DurationType === "M" ? "M" : ($scope.registrationObj.DurationType === "D" ? "D" : ""));
            switch ($scope.durType) {
                case 'D':
                    $scope.TotalDays = 1 * parseFloat($scope.registrationObj.DurationPeriod);
                    break;
                case 'W':
                    $scope.TotalDays = 7 * parseFloat($scope.registrationObj.DurationPeriod);
                    break;
                case 'M':
                    $scope.TotalDays = 30 * parseFloat($scope.registrationObj.DurationPeriod);
                    break;
                case 'Y':
                    $scope.TotalDays = 365 * parseFloat($scope.registrationObj.DurationPeriod);
                    break;
            }
            object = {
                "UserId": $scope.doctorinfo.doctorid,
                "OrganizationId": parentHospitalId,
                "RegFeeIncludeInd": $scope.registrationObj.RegFeeIncludeInd,
                "RegistrationFee": $scope.registrationObj.RegistrationFee || 0,
                // "DurationPeriod": $scope.registrationObj.DurationPeriod || 0,
                "DurationPeriod": $scope.TotalDays || 0,
                "DurationType": $scope.registrationObj.DurationType,
                "ActiveInd": 'Y',
                "SpecializationId": $scope.SpecializationId
            };
            eHnoteSettingsDataService.AddPatientRegSettings(object).success(function (data) {
                alertify.success('Updated Successfully');
                $scope.registrationObj.RegistrationFee = data[0].RegistrationFee !== 0 ? data[0].RegistrationFee : '';
                $scope.registrationObj.DurationPeriod = data[0].DurationPeriod !== 0 ? data[0].DurationPeriod : '';
                // $scope.registrationObj.DurationType = data[0].DurationType;
                $scope.registrationObj.DurationType = 'D';
            });
        };
        $scope.getMasterDiagnosisItemsSearch = function (val) {
            object = {
                "LevelType": $scope.masterDiagLevelType,
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ParentOrganizationId": $scope.ParentHospitalID || null,
            };
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.DiagnosisList !== undefined) {
                    return response.data.DiagnosisList.map(function (item) {
                        return item;
                    });
                }
            });
        };
        $scope.masterDiagnosisItemSelect = function (obj) {
        };
        $scope.getMasterProcedureItemsSearch = function (val) {
            object = {
                "LevelType": $scope.masterProceduresLevelType,
                "AllBranchInd": 0,
                "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                // "ProcedureTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
                "ServicesTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
            };
            return eHnoteSettingsDataService.GetMasterProcedures(object).then(function (response) {
                if (response.data.ProcedureList !== undefined) {
                    return response.data.ProcedureList.map(function (item) {
                        return item;
                    });
                }
            });
        };


        $scope.getMasterOtherProcedureItemsSearch = function (val) {
            object = {
                "LevelType": $scope.masterProceduresLevelType,
                "AllBranchInd": 0,
                "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": "",
                "CPTSearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ProcedureTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
            };
            return eHnoteSettingsDataService.GetMasterOtherProcedures(object).then(function (response) {
                if (response.data.ProcedureList !== undefined) {
                    return response.data.ProcedureList.map(function (item) {
                        return item;
                    });
                }
            });
        };
        $scope.ChangeProcedure = function (SelectedProcedure) {
            //if (SelectedProcedure === null) {
            //    $scope.masterProcedureObj.ProcedureName = "";
            //    $scope.masterProcedureObj.ProcedureId = 0;
            //} else {
            //    $scope.masterProcedureObj.ProcedureName = SelectedProcedure.ProcedureName;
            //    $scope.masterProcedureObj.ProcedureId = SelectedProcedure.ProcedureId;
            //}
        };
        $scope.getMasterMedicineItemSearch = function (val) {
            object = {
                "LevelType": 'G',
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ParentOrganizationId": $scope.ParentHospitalID,
            };
            return eHnoteSettingsDataService.GetMasterMedicines(object).then(function (response) {
                if (response.data.MedicineList !== undefined) {
                    return response.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            });
        };


        getMasterComplaintsItems();
        getMasterObservationItems();
        getMasterClinicNoteItems();
        getMasterPatientInstructions();


        $scope.onselectMedicine = function (item) {


            item.MedicineId = item.MedicineObj.MedicineId;
            item.MedicineName = item.MedicineObj.OnlyMedicineName;
            item.MedicineTypeId = item.MedicineObj.MedicineTypeId;
            item.MedicineStrength = item.MedicineObj.Strength;
            item.MedicineUnitId = item.MedicineObj.MedicineUnitId;
            item.GenericName = item.MedicineObj.GenericName;
            item.ScheduleTypeId = item.MedicineObj.ScheduleTypeId;
            $scope.masterMedicineObject.MedicinefullName = item.MedicineObj.OnlyMedicineName;

        };

        $scope.changeMasterMedicine = function (item) {
            if (item.MedicineObj === '' || item.MedicineObj === undefined) {
                item.MedicineObj = "";
                item.MedicineId = 0;
                item.MedicineName = "";
            } else {
                item.MedicineName = item.MedicineObj;
                item.MedicineId = 0;
            }
        };


        $scope.showModifyMasterComplaints = function () {
            $scope.showModifyMasterComplaintsDiv = true;
            $scope.showModifyMasterObservationsDiv = false;
            $scope.showModifyMasterClinicalNotesDiv = false;
            $scope.showModifyMasterPatientInstructDiv = false;
        };

        $scope.CancelMasterComplaintsClick = function () {
            $scope.masterGeneralNotesId = 0;
            $scope.complaintsDescription = "";
            $scope.masterComplaintsIsActive = "Y";
            $scope.CheifComplaintsObj.complaintsDescription = '';
            $scope.showModifyMasterComplaintsDiv = false;
            $scope.masterComplaintsBtnName = "Save";
        };

        $scope.showModifyMasterObservations = function () {
            $scope.showModifyMasterObservationsDiv = true;
            $scope.showModifyMasterComplaintsDiv = false;
            $scope.showModifyMasterClinicalNotesDiv = false;
            $scope.showModifyMasterPatientInstructDiv = false;
        };

        $scope.CancelMasterObservationsClick = function () {
            $scope.masterGeneralNotesId = 0;
            $scope.observationDescription = "";
            $scope.masterObservationsIsActive = "Y";
            $scope.showModifyMasterObservationsDiv = false;
            $scope.masterObservationsBtnName = "Save";
        };


        $scope.showModifyMasterClinicalNotes = function () {
            $scope.showModifyMasterClinicalNotesDiv = true;
            $scope.showModifyMasterObservationsDiv = false;
            $scope.showModifyMasterComplaintsDiv = false;
            $scope.showModifyMasterPatientInstructDiv = false;
        };

        $scope.showModifyMasterPatientInstruction = function () {
            $scope.showModifyMasterObservationsDiv = false;
            $scope.showModifyMasterComplaintsDiv = false;
            $scope.showModifyMasterClinicalNotesDiv = false;
            $scope.showModifyMasterPatientInstructDiv = true;
        };

        $scope.CancelMasterClinicalClick = function () {
            $scope.masterGeneralNotesId = 0;
            $scope.clinicalDescription = "";
            $scope.masterClinicalIsActive = "Y";
            $scope.showModifyMasterClinicalNotesDiv = false;
            $scope.masterClinicalNotesBtnName = "Save";
        };


        $scope.CancelMasterPatientInstructClick = function () {
            $scope.masterGeneralNotesId = 0;
            $scope.PatientInstruction = "";
            $scope.masterPatientInstructIsActive = "Y";
            $scope.showModifyMasterPatientInstructDiv = false;
            $scope.masterPatientInstructBtnName = "Save";
        };


        $scope.switchtoGeneraltab = function (val) {
            if (val === 1) {
                $scope.masterComplaintsPageNumber = 1;
                getMasterComplaintsItems();
                $scope.showModifyMasterObservationsDiv = false;
                $scope.showModifyMasterClinicalNotesDiv = false;
                $scope.showModifyMasterPatientInstructDiv = false;
            }
            if (val === 2) {
                $scope.masterObservationPageNumber = 1;
                getMasterObservationItems();
                $scope.showModifyMasterComplaintsDiv = false;
                $scope.showModifyMasterClinicalNotesDiv = false;
                $scope.showModifyMasterPatientInstructDiv = false;
            }
            if (val === 3) {
                $scope.masterClinicalNotesPageNumber = 1;
                getMasterClinicNoteItems();
                $scope.showModifyMasterComplaintsDiv = false;
                $scope.showModifyMasterObservationsDiv = false;
                $scope.showModifyMasterPatientInstructDiv = false;
            }
            if (val === 4) {
                $scope.masterPatientInstructPageNumber = 1;
                getMasterPatientInstructions();
                $scope.showModifyMasterComplaintsDiv = false;
                $scope.showModifyMasterObservationsDiv = false;
                $scope.showModifyMasterClinicalNotesDiv = false;
            }
            $scope.pop_generalVal = val;
        };



        $scope.switchtoHistorytab = function (val) {

            if (val === 1) {
                $scope.masterMedicalHistoryPageNumber = 1;
                getMasterMedicalHistoryItems();
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterMenstrualHistoryDiv = false;
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }

            if (val === 6) {
                $scope.searchObj.BirthHistory = '';
                $scope.masterBirthHistoryPageNumber = 1;
                getMasterBirthHistoryItems();
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterMenstrualHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 2) {
                $scope.searchObj.FamilyHistory = '';
                $scope.masterFamilyHistoryPageNumber = 1;
                getMasterFamilyHistoryItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterMenstrualHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 3) {
                $scope.searchObj.NutritionHistory = '';
                $scope.masterNutritionalHistoryPageNumber = 1;
                getMasterNutritionalHistoryItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterMenstrualHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 4) {
                $scope.masterImmunisationHistoryPageNumber = 1;
                getMasterImmunisationHistoryItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterMenstrualHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 5) {
                $scope.searchObj.SurgicalHistory = '';
                $scope.masterSurgicalHistoryPageNumber = 1;
                getMasterSurgicalHistoryItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMenstrualHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 7) {
                $scope.searchObj.MenstrualHistory = '';
                $scope.masterMenstrualHistoryPageNumber = 1;
                getMasterMenstrualHistoryItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 8) {
                $scope.searchObj.LifestyleHistory = '';
                $scope.masterLifestyleHistoryPageNumber = 1;
                getMasterLifestyleHistoryItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterAllergyDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 9) {
                $scope.searchObj.MasterAllergy = '';
                $scope.masterAllergyPageNumber = 1;
                getMasterAllergyItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 10) {
                $scope.searchObj.VaccinationHistory = '';
                $scope.masterVacinationPageNumber = 1;
                getMasterVaccinactionItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterOcularDiv = false;
            }
            if (val === 11) {
                $scope.searchObj.SystemicHistory = '';
                $scope.masterSystamicPageNumber = 1;
                getMasterSystamicItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterOcularDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
            }
            if (val === 12) {
                $scope.searchObj.OcularOHistory = '';
                $scope.masterVacinationPageNumber = 1;
                getMasterOcularItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
            }
            if (val === 13) {
                $scope.searchObj.FunctionalStatus = '';
                $scope.masterFunctionalstatusDivPageNumber = 1;
                getMasterFunctionalItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
            }
            if (val === 14) {
                $scope.searchObj.OcularSurgical = '';
                $scope.masterOcularSurgicalDivPageNumber = 1;
                getMasterOcularSurgicalItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
            }
            if (val === 15) {
                $scope.searchObj.CurrentSystemic = '';
                $scope.masterCurrentSystemicDivPageNumber = 1;
                getMasterCurrentSystemicItems();
                $scope.showModifyMasterBirthHistoryDiv = false;
                $scope.showModifyMasterFamilyHistoryDiv = false;
                $scope.showModifyMasterNutritionalHistoryDiv = false;
                $scope.showModifyMasterImmunisationHistoryDiv = false;
                $scope.showModifyMasterMedicalHistoryDiv = false;
                $scope.showModifyMasterSurgicalHistoryDiv = false;
                $scope.showModifyMasterLifestyleHistoryDiv = false;
                $scope.showModifyMasterSystamicDiv = false;
                $scope.showModifyMasterVaccinactionDiv = false;
                $scope.showModifyMasterFunctionalstatusDiv = false;
                $scope.showModifyMasterOcularSurgicalDiv = false;
                $scope.showModifyMasterCurrentSystemicDiv = false;
            }
            $scope.pop_HistoryVal = val;
        };



        $scope.switchGeneralComplaintsTab = function (val) {
            $scope.showMasterComplaintsDiv = val;
            if (val === 1) {
                $scope.masterComplaintsLevelType = "O";
                $scope.masterComplaintsPageNumber = 1;
                getMasterComplaintsItems();
            }
            if (val === 2) {
                $scope.masterComplaintsLevelType = "U";
                $scope.masterComplaintsPageNumber = 1;
                getMasterComplaintsItems();
            }
        };
        $scope.switchGeneralObservationsTab = function (val) {
            $scope.showMasterObservationDiv = val;
            if (val === 1) {
                $scope.masterObservationLevelType = "O";
                $scope.masterObservationPageNumber = 1;
                getMasterObservationItems();
            }
            if (val === 2) {
                $scope.masterObservationLevelType = "U";
                $scope.masterObservationPageNumber = 1;
                getMasterObservationItems();
            }
        };
        $scope.switchGeneralClinicalNotesTab = function (val) {
            $scope.showMasterClinicalNotesDiv = val;
            if (val === 1) {
                $scope.masterClinicalNotesLevelType = "O";
                $scope.masterClinicalNotesPageNumber = 1;
                getMasterClinicNoteItems();
            }
            if (val === 2) {
                $scope.masterClinicalNotesLevelType = "U";
                $scope.masterClinicalNotesPageNumber = 1;
                getMasterClinicNoteItems();
            }
        };

        function getMasterComplaintsItems() {
            object = {
                "ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                // "GeneralNotesType": $scope.NotesTypeId,
                "ScreenType": $scope.masterComplaintsLevelType,
                "PageSize": $scope.masterComplaintsPageSize,
                "PageNumber": $scope.masterComplaintsPageNumber,
                "SearchText": "",
                "ChiefComplaintId": $scope.ChiefComplaintId || 0,
                "IsFrequent": "N"

            };
            eHnoteSettingsDataService.GetChiefComplaints(object).success(function (response) {


                if ($scope.masterComplaintsLevelType === 'O') {
                    $scope.MasterComplaintsOrgArray = [];
                }
                else if ($scope.masterComplaintsLevelType === 'U') {

                    $scope.MasterComplaintsUserArray = [];
                }

                if (response.ChiefComplaint !== undefined) {
                    if (response.ChiefComplaint.length > 0) {
                        if ($scope.masterComplaintsLevelType === 'O') {
                            $scope.MasterComplaintsOrgArray = response.ChiefComplaint;
                        }
                        else if ($scope.masterComplaintsLevelType === 'U') {

                            $scope.MasterComplaintsUserArray = response.ChiefComplaint;
                        }
                        $scope.masterComplaintsItems = response.count;
                    }
                }
                if ($scope.MasterComplaintsOrgArray.length > 0) {
                    angular.forEach($scope.MasterComplaintsOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }
            }).error(function (error) {
                console.log(error);
            });
        }




        $scope.masterComplaintsPagechanged = function (pagenumber) {
            $scope.masterComplaintsPageNumber = pagenumber;
            getMasterComplaintsItems();
        };

        function getMasterObservationItems() {
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "GeneralNotesType": 2,
                "ScreenType": $scope.masterObservationLevelType,
                "PageSize": $scope.masterObservationsPageSize,
                "PageNumber": $scope.masterObservationPageNumber,
                "SearchText": ""
            };

            eHnoteSettingsDataService.GetGeneralNotes(object).success(function (response) {
                //$scope.MasterObservationOrgArray = [];
                //$scope.MasterObservationUserArray = [];
                if ($scope.masterObservationLevelType === 'O') {
                    $scope.MasterObservationOrgArray = [];
                }
                else if ($scope.masterObservationLevelType === 'U') {

                    $scope.MasterObservationUserArray = [];
                }
                if (response.GeneralNotes !== undefined) {
                    if (response.GeneralNotes.length > 0) {
                        if ($scope.masterObservationLevelType === 'O') {
                            $scope.MasterObservationOrgArray = response.GeneralNotes;
                        }
                        else if ($scope.masterObservationLevelType === 'U') {

                            $scope.MasterObservationUserArray = response.GeneralNotes;
                        }
                        $scope.masterObservationItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        }

        $scope.masterObservationPagechanged = function (pagenumber) {
            $scope.masterObservationPageNumber = pagenumber;
            getMasterObservationItems();
        };

        function getMasterClinicNoteItems() {
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "GeneralNotesType": 3,
                "ScreenType": $scope.masterClinicalNotesLevelType,
                "PageSize": $scope.masterClinicalNotesPageSize,
                "PageNumber": $scope.masterClinicalNotesPageNumber,
                "SearchText": ""
            };
            eHnoteSettingsDataService.GetGeneralNotes(object).success(function (response) {
                // $scope.MasterClinicalOrgArray = [];
                // $scope.MasterClinicalUserArray = [];

                if ($scope.masterClinicalNotesLevelType === 'O') {
                    $scope.MasterClinicalOrgArray = [];
                }
                else if ($scope.masterClinicalNotesLevelType === 'U') {
                    $scope.MasterClinicalUserArray = [];
                }

                if (response.GeneralNotes !== undefined) {
                    if (response.GeneralNotes.length > 0) {
                        if ($scope.masterClinicalNotesLevelType === 'O') {
                            $scope.MasterClinicalOrgArray = response.GeneralNotes;
                        }
                        else if ($scope.masterClinicalNotesLevelType === 'U') {

                            $scope.MasterClinicalUserArray = response.GeneralNotes;
                        }
                        $scope.masterClinicalItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        }


        $scope.masterClinicalPagechanged = function (pagenumber) {
            $scope.masterClinicalNotesPageNumber = pagenumber;
            getMasterClinicNoteItems();
        };

        //$scope.AddupdateComplaints = function () {
        //    if ($scope.complaintsDescription === "" || $scope.complaintsDescription === undefined) {
        //        alertify.error("Add  Complaints");
        //        return false;
        //    }
        //    var chiefComplaintFlag = false;

        //    var chiefComplaintsFalgArray = _.where($scope.UserSettingObject.ComplaintsListSettings, { Status: true });
        //    if (chiefComplaintsFalgArray && chiefComplaintsFalgArray.length > 0) {
        //        if (chiefComplaintsFalgArray[0].Type === $scope.masterComplaintsLevelType) {
        //            chiefComplaintFlag = true;
        //        }
        //    }

        //    object = {
        //        "HospitalId": parentHospitalId,
        //        "UserId": $scope.UserId,
        //        "ActiveInd": $scope.masterComplaintsIsActive,
        //        "ScreenType": $scope.masterComplaintsLevelType,
        //        "GeneralNotesTypeId": 1,
        //        "GeneralNotes": $scope.complaintsDescription,
        //        "GeneralNotesId": $scope.masterGeneralNotesId
        //    };
        //    eHnoteSettingsDataService.AddUpdateGeneralNotes(object).success(function (response) {
        //        if ($scope.masterComplaintsIsActive === 'N') {

        //            if (chiefComplaintFlag) {
        //                var mObj = datapersistanceFactory.getItem('masterDataArrays');
        //                for (var i = 0; i < mObj.masterChiefComplaintsArray.length; i++) {
        //                    if (mObj.masterChiefComplaintsArray[i].GeneralNotesId === $scope.masterGeneralNotesId) {
        //                        mObj.masterChiefComplaintsArray.splice(i, 1);
        //                    }
        //                }
        //                loginCookieFactory.set("masterDataArrays", mObj);
        //            }
        //            alertify.success("Complaints Deleted Successfully");
        //            $scope.CancelMasterComplaintsClick();
        //            getMasterComplaintsItems();
        //        } else {
        //            if (response.status === "Success") {
        //                if ($scope.masterGeneralNotesId === undefined || $scope.masterGeneralNotesId === 0) {
        //                    if (chiefComplaintFlag) {
        //                        addToCache('masterChiefComplaintsArray', response.GeneralNotes[0]);
        //                    }
        //                    alertify.success("Complaints Added Successfully");
        //                } else {
        //                    if (chiefComplaintFlag) {
        //                        var mObj = datapersistanceFactory.getItem('masterDataArrays');
        //                        for (var i = 0; i < mObj.masterChiefComplaintsArray.length; i++) {
        //                            if (mObj.masterChiefComplaintsArray[i].GeneralNotesId === response.GeneralNotes[0].GeneralNotesId) {
        //                                mObj.masterChiefComplaintsArray[i] = response.GeneralNotes[0];
        //                            }
        //                        }
        //                        loginCookieFactory.set('masterDataArrays', mObj);
        //                    }
        //                    alertify.success("Complaints Updated Successfully");
        //                }

        //                $scope.CancelMasterComplaintsClick();
        //                getMasterComplaintsItems();
        //            }

        //            if (response.status === 'Failure') {
        //                if (response.Message === 'Complaints Already exists') {
        //                    alertify.error("Complaints Name already exist");
        //                    $scope.complaintsDescription = "";
        //                }
        //            }
        //        }
        //    })
        //        .error(function (error) {
        //            alertify.error("Error Occured");
        //        });
        //};


        $scope.AddupdateComplaints = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateCheifComaplaint) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if ($scope.complaintsDescription === "" || $scope.complaintsDescription === undefined) {
                alertify.error("Add  Complaints");
                return false;
            }
            var chiefComplaintFlag = false;

            var chiefComplaintsFalgArray = _.where($scope.UserSettingObject.ComplaintsListSettings, { Status: true });
            if (chiefComplaintsFalgArray && chiefComplaintsFalgArray.length > 0) {
                if (chiefComplaintsFalgArray[0].Type === $scope.masterComplaintsLevelType) {
                    chiefComplaintFlag = true;
                }
            }

            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.masterComplaintsIsActive,
                "ScreenType": $scope.masterComplaintsLevelType,
                "ChiefComplaintId": $scope.masterGeneralNotesId,
                "ChiefComplaintName": $scope.complaintsDescription
            };
            eHnoteSettingsDataService.AddUpdateMasterChiefComplaint(object).success(function (response) {
                if ($scope.masterComplaintsIsActive === 'N') {
                    if (chiefComplaintFlag) {
                        var mObj = datapersistanceFactory.getItem('masterDataArrays');
                        for (var i = 0; i < mObj.masterChiefComplaintsArray.length; i++) {
                            if (mObj.masterChiefComplaintsArray[i].ChiefComplaintId === $scope.masterGeneralNotesId) {
                                mObj.masterChiefComplaintsArray.splice(i, 1);
                            }
                        }
                        loginCookieFactory.set("masterDataArrays", mObj);
                    }
                    alertify.success("Complaints Deleted Successfully");
                    $scope.CancelMasterComplaintsClick();
                    getMasterComplaintsItems();
                } else {
                    if (response.status === "Success") {
                        if ($scope.masterGeneralNotesId === undefined || $scope.masterGeneralNotesId === 0) {
                            if (chiefComplaintFlag) {
                                addToCache('masterChiefComplaintsArray', response.ChiefComplaint[0]);
                            }
                            alertify.success("Complaints Added Successfully");
                        } else {
                            if (chiefComplaintFlag) {
                                var mObj = datapersistanceFactory.getItem('masterDataArrays');
                                for (var i = 0; i < mObj.masterChiefComplaintsArray.length; i++) {
                                    if (mObj.masterChiefComplaintsArray[i].ChiefComplaintId === response.ChiefComplaint[0].ChiefComplaintId) {
                                        mObj.masterChiefComplaintsArray[i] = response.ChiefComplaint[0];
                                    }
                                }
                                loginCookieFactory.set('masterDataArrays', mObj);
                            }
                            alertify.success("Complaints Updated Successfully");
                        }

                        $scope.CancelMasterComplaintsClick();
                        getMasterComplaintsItems();
                    }

                    if (response.status === 'Failure') {
                        if (response.Message === 'Complaints Already exists') {
                            alertify.error("Complaints Name already exist");
                            $scope.complaintsDescription = "";
                        }
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };




        $scope.editMasterComplaints = function (item, index) {
            $scope.showModifyMasterComplaintsDiv = true;
            $scope.masterGeneralNotesId = item.ChiefComplaintId;
            $scope.complaintsDescription = item.ChiefComplaintName;
            $scope.masterComplaintsIsActive = "Y";
            $scope.masterComplaintsBtnName = "Update";
        };

        $scope.deleteMasterComplaints = function (item, index) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Complaints? </h4>", function () {
                $scope.masterGeneralNotesId = item.ChiefComplaintId;
                $scope.complaintsDescription = item.ChiefComplaintName;
                $scope.masterComplaintsIsActive = 'N';
                $scope.AddupdateComplaints();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.masterObservationsIsActive = "Y";
        $scope.observationDescription = "";
        $scope.masterClinicalIsActive = "Y";
        $scope.clinicalDescription = "";
        $scope.masterPatientInstructIsActive = "Y";
        $scope.PatientInstruction = "";

        $scope.AddupdateObservations = function () {
            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateObservation) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.observationDescription === "" || $scope.observationDescription === undefined) {
                alertify.error("Add  Observations");
                return false;
            }

            var ObservationFalgFlag = false;
            var ObservationFalgArray = _.where($scope.UserSettingObject.ObservationListSettings, { Status: true });
            if (ObservationFalgArray && ObservationFalgArray.length > 0) {
                if (ObservationFalgArray[0].Type === $scope.masterObservationLevelType) {
                    ObservationFalgFlag = true;
                }
            }

            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.masterObservationsIsActive,
                "ScreenType": $scope.masterObservationLevelType,
                "GeneralNotesTypeId": 2,
                "GeneralNotes": $scope.observationDescription,
                "OrgGeneralNotesId": $scope.masterGeneralNotesId
            };
            eHnoteSettingsDataService.AddUpdateGeneralNotes(object).success(function (response) {
                if ($scope.masterObservationsIsActive === 'N') {
                    if (ObservationFalgFlag) {
                        var mObj = datapersistanceFactory.getItem('masterDataArrays');
                        for (var i = 0; i < mObj.masterObservationsArray.length; i++) {
                            if (mObj.masterObservationsArray[i].OrgGeneralNotesId === $scope.masterGeneralNotesId) {
                                mObj.masterObservationsArray.splice(i, 1);
                            }
                        }
                        loginCookieFactory.set('masterDataArrays', mObj);
                    }
                    alertify.success("Observations Deleted Successfully");
                    $scope.CancelMasterObservationsClick();
                    getMasterObservationItems();
                } else {
                    if (response.status === 'Success') {
                        if ($scope.masterGeneralNotesId === undefined || $scope.masterGeneralNotesId === 0) {
                            if (ObservationFalgFlag) {
                                addToCache('masterObservationsArray', response.GeneralNotes[0]);
                            }
                            alertify.success("Observations Added Successfully");
                        } else {
                            if (ObservationFalgFlag) {
                                var mObj = datapersistanceFactory.getItem('masterDataArrays');

                                for (var i = 0; i < mObj.masterObservationsArray.length; i++) {
                                    if (mObj.masterObservationsArray[i].GeneralNotesId === response.GeneralNotes[0].GeneralNotesId) {
                                        mObj.masterObservationsArray[i] = response.GeneralNotes[0];
                                    }
                                }
                                loginCookieFactory.set('masterDataArrays', mObj);
                            }
                            alertify.success("Observations Updated Successfully");
                        }

                        $scope.CancelMasterObservationsClick();
                        getMasterObservationItems();
                    }
                    if (response.status === 'Failure') {
                        if (response.Message === 'Observations Already exists') {
                            alertify.error("Observations Name already exist");
                            $scope.observationDescription = "";
                        }
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };


        $scope.editMasterObservations = function (item, index) {
            $scope.showModifyMasterObservationsDiv = true;
            $scope.masterGeneralNotesId = item.OrgGeneralNotesId;
            $scope.observationDescription = item.Notes;
            $scope.masterObservationsIsActive = "Y";
            $scope.masterObservationsBtnName = "Update";
        };


        $scope.deleteMasterObservations = function (item, index) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Observations? </h4>", function () {
                $scope.masterGeneralNotesId = item.OrgGeneralNotesId;
                $scope.observationDescription = item.Notes;
                $scope.masterObservationsIsActive = 'N';
                $scope.AddupdateObservations();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.AddupdateClinicalNotes = function () {


            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateClinicalNotes) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.clinicalDescription === "" || $scope.clinicalDescription === undefined) {
                alertify.error("Add  Clinical Notes");
                return false;
            }

            var clinicalNotesFlag = false;
            var ClinicalNotesFalgArray = _.where($scope.UserSettingObject.ClinicalNotesListSettings, { Status: true });
            if (ClinicalNotesFalgArray && ClinicalNotesFalgArray.length > 0) {
                if (ClinicalNotesFalgArray[0].Type === $scope.masterClinicalNotesLevelType) {
                    clinicalNotesFlag = true;
                }
            }

            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.masterClinicalIsActive,
                "ScreenType": $scope.masterClinicalNotesLevelType,
                "GeneralNotesTypeId": 3,
                "GeneralNotes": $scope.clinicalDescription,
                "OrgGeneralNotesId": $scope.masterGeneralNotesId
            };
            eHnoteSettingsDataService.AddUpdateGeneralNotes(object).success(function (response) {
                if ($scope.masterClinicalNotesLevelType === 'N') {
                    if (clinicalNotesFlag) {
                        var mObj = datapersistanceFactory.getItem('masterDataArrays');
                        for (var i = 0; i < mObj.masterClinicalNotesArray.length; i++) {
                            if (mObj.masterClinicalNotesArray[i].OrgGeneralNotesId === $scope.masterGeneralNotesId) {
                                mObj.masterClinicalNotesArray.splice(i, 1);
                            }
                        }
                        loginCookieFactory.set('masterDataArrays', mObj);
                    }
                    alertify.success("Clinical Notes Deleted Successfully");
                    $scope.CancelMasterClinicalClick();
                    getMasterClinicNoteItems();
                } else {
                    if (response.status === 'Success') {
                        if ($scope.masterGeneralNotesId === undefined || $scope.masterGeneralNotesId === 0) {
                            if (clinicalNotesFlag) {
                                addToCache('masterClinicalNotesArray', response.GeneralNotes[0]);
                            }
                            alertify.success("Clinical Notes Added Successfully");
                        } else {
                            if (clinicalNotesFlag) {
                                var mObj = datapersistanceFactory.getItem('masterDataArrays');
                                for (var i = 0; i < mObj.masterClinicalNotesArray.length; i++) {
                                    if (mObj.masterClinicalNotesArray[i].GeneralNotesId === response.GeneralNotes[0].GeneralNotesId) {
                                        mObj.masterClinicalNotesArray[i] = response.GeneralNotes[0];
                                    }
                                }
                                loginCookieFactory.set('masterDataArrays', mObj);
                            }
                            alertify.success("Clinical Notes Updated Successfully");
                        }

                        $scope.CancelMasterClinicalClick();
                        getMasterClinicNoteItems();
                    }
                    if (response.status === 'Failure') {
                        if (response.Message === 'Clinical Notes Already exists') {
                            alertify.error("Clinical Notes already exist");
                            $scope.clinicalDescription = "";
                        }
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.editMasterClinicNotes = function (item, index) {
            $scope.showModifyMasterClinicalNotesDiv = true;
            $scope.masterGeneralNotesId = item.OrgGeneralNotesId;
            $scope.clinicalDescription = item.Notes;
            $scope.masterClinicalIsActive = "Y";
            $scope.masterClinicalNotesBtnName = "Update";
        };

        $scope.deleteMasterClinicNotes = function (item, index) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this ClinicalNotes? </h4>", function () {
                $scope.masterGeneralNotesId = item.OrgGeneralNotesId;
                $scope.clinicalDescription = item.Notes;
                $scope.masterClinicalIsActive = 'N';
                $scope.AddupdateClinicalNotes();
            }, function () {
                r = "You pressed Cancel!";
            });
        };





        //Doc Investigation Templates Code added by durga as on 28-06-2018

        $scope.TempArray = [];


        $scope.InvTempplateDetailsObj = {
            "UserId": $scope.UserId,
            "TemplateId": 0,
            "TemplateName": "",
            "TemplateJson": "",
            "HospitalId": parentHospitalId,
            "ActiveInd": "Y",
            "TemplateDetails": []
        };
        $scope.addUpdateUserInvestigationTemplate = function () {


            var SelectedItems = $filter("filter")($scope.TempArray, { "ActiveInd": 'Y' }, true);

            if (SelectedItems.length > 0) {
                $scope.selectedTemplatesArray = [];
                $scope.selectedTemplatesArray = SelectedItems;

                $scope.InvTempplateDetailsObj.TemplateDetails = $scope.selectedTemplatesArray;
                $scope.InvTempplateDetailsObj.TemplateJson = [];
                $scope.InvTempplateDetailsObj.HospitalId = parentHospitalId;
                eHnoteSettingsDataService.addUpdateUserInvestigationTemplate($scope.InvTempplateDetailsObj).success(function (res) {

                    if (res.status === "Failure") {
                        alertify.error(res.message);
                        return;
                    }

                    if ($scope.btnDocInvName === "Update") {
                        alertify.success("Template Updated Successfully");
                    } else {
                        alertify.success("Template Added Successfully");
                    }
                    // getAllDocInvTemplates();
                    getAllHospitalInvTemplates($scope.newtemplatePageNumber);
                    $scope.InvTempplateDetailsObj = {
                        "UserId": $scope.UserId,
                        "TemplateId": 0,
                        "TemplateName": "",
                        "TemplateJson": "",
                        "HospitalId": parentHospitalId,
                        "ActiveInd": "Y",
                        "TemplateDetails": []
                    };
                    $scope.SubAllCatInvList = angular.copy($scope.MainAllCatInvList);

                    // $scope.TempArray = angular.copy($scope.MainAllCatInvList);
                    $scope.btnDocInvName = "Save";
                }).error(function (error) {
                    alertify.error("Error Occured");
                });
            } else {
                alertify.error("Select Investigations");
            }


            if ($scope.TempArray.length > 0) {

            }
        };




        function getAllCategoriesnInestigations() {
            var getallind = 1;

            if ($scope.RoleId === 1 || $scope.RoleId === 10 || $scope.RoleId === 4 || $scope.RoleId === 43) {
                getallind = 0;
            }
            object = {
                "ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "GetAllIndicator": getallind
            };
            eHnoteSettingsDataService.getAllCategoriesnInestigations(object).success(function (response) {
                $scope.MainAllCatInvList = [];
                $scope.SubAllCatInvList = [];
                if (response.CompleteInvestigations !== undefined) {
                    if (response.CompleteInvestigations.length > 0) {
                        angular.forEach(response.CompleteInvestigations, function (item) {
                            if (item.InvestigationDetails === undefined) {
                                item.InvestigationDetails = [];
                            }
                        });
                        $scope.MainAllCatInvList = angular.copy(response.CompleteInvestigations);
                        $scope.SubAllCatInvList = angular.copy(response.CompleteInvestigations);
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        }


        function getAllDocInvTemplates() {
            object = {
                "UserId": $scope.UserId,
                "HospitalId": parentHospitalId,
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1
            };


            eHnoteSettingsDataService.getAllDocInvTemplates(object).success(function (data) {
                $scope.selectedDocTemplatesArray = [];
                if (data.count > 0) {
                    if (data.rows !== undefined) {
                        $scope.selectedDocTemplatesArray = data.rows;
                        var docinfo = eHnoteMasterDataService.getUserInfo();
                        $scope.PassTemplateArray = angular.copy(data.rows);
                        $scope.PassTemplateArray = $filter("filter")($scope.PassTemplateArray, { "ActiveInd": 'Y' }, true);
                        docinfo.doctordata.UserInvTemplates = angular.copy($scope.PassTemplateArray);
                        eHnoteMasterDataService.addUserInfo(docinfo);
                    }
                }

            }).error(function (error) {
                console.log(error);
            });
        }
        $scope.newtemplatePageNumber = 1;
        $scope.templatepageChanged = function (newtemplatePageNumber) {
            getAllHospitalInvTemplates(newtemplatePageNumber);
        };
        function getAllHospitalInvTemplates(newtemplatePageNumber) {
            object = {
                "UserId": $scope.UserId,
                "HospitalId": parentHospitalId,
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": newtemplatePageNumber
            };
            eHnoteSettingsDataService.getAllDocInvTemplates(object).success(function (data) {

                $scope.selectedOrgTemplatesArray = [];
                if (data.count > 0) {
                    if (data.rows !== undefined) {
                        $scope.TemaptetotalItems = data.count;
                        $scope.selectedOrgTemplatesArray = data.rows;
                        var docinfo = eHnoteMasterDataService.getUserInfo();
                        $scope.PassTemplateArray = angular.copy(data.rows);
                        $scope.PassTemplateArray = $filter("filter")($scope.PassTemplateArray, { "ActiveInd": 'Y' }, true);
                        docinfo.doctordata.UserInvTemplates = angular.copy($scope.PassTemplateArray);
                        eHnoteMasterDataService.addUserInfo(docinfo);
                    }
                }

            }).error(function (error) {
                console.log(error);
            });
        }


        $scope.checkTemplateInvItem = function (catItem, invitem) {
            //catItem.ActiveInd = 'N';
            //angular.forEach(catItem.InvestigationDetails, function (item) {
            //    if (item.ActiveInd === 'Y') {
            //        catItem.ActiveInd = 'Y';
            //    }
            //});

            //new added
            if (invitem.ActiveInd === 'Y') {
                catItem.ActiveInd = 'Y';
                var object = {
                    "CategoryId": catItem.CategoryId,
                    "InvestigationId": invitem.InvestigationId,
                    "ActiveInd": "Y"
                }
                $scope.TempArray.push(object);
            } else {
                catItem.ActiveInd = 'N';
                angular.forEach(catItem.InvestigationDetails, function (item) {
                    if (item.ActiveInd === 'Y') {
                        catItem.ActiveInd = 'Y';
                    }
                });
                for (var i = $scope.TempArray.length - 1; i >= 0; i--) {
                    if ($scope.TempArray[i].CategoryId === catItem.CategoryId && $scope.TempArray[i].InvestigationId === invitem.InvestigationId) {
                        $scope.TempArray.splice(i, 1);
                    }
                }
            }
        };

        $scope.clearAllAddUpdateInvTemplate = function () {

            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Clear All Selected Data? </h4>", function () {
                $scope.InvTempplateDetailsObj = {
                    "UserId": $scope.UserId,
                    "TemplateId": 0,
                    "TemplateName": "",
                    "TemplateJson": "",
                    "ActiveInd": "Y",
                    "HospitalId": parentHospitalId,
                    "TemplateDetails": []
                };
                $scope.SubAllCatInvList = angular.copy($scope.MainAllCatInvList);
                $scope.btnDocInvName = "Save";
            }, function () {
                return;
            });

        };

        $scope.modifyDocinvTemplate = function (tempObj, type) {



            $scope.InvTempplateDetailsObj = {
                "UserId": $scope.UserId,
                "TemplateId": tempObj.TemplateId,
                "TemplateName": tempObj.TemplateName,
                "TemplateJson": tempObj.TemplateJson,
                "ActiveInd": tempObj.ActiveInd,
                "HospitalId": parentHospitalId,
                "TemplateDetails": tempObj.TemplateDetails
            };
            $scope.TempArray = [];
            angular.forEach($scope.SubAllCatInvList, function (mainitem) {
                angular.forEach(tempObj.TemplateDetails, function (tempitem) {
                    if (tempitem.CategoryId === mainitem.CategoryId) {
                        mainitem.ActiveInd = 'Y';



                        angular.forEach(mainitem.InvestigationDetails, function (childitem) {
                            if (childitem.InvestigationId === tempitem.InvestigationId) {
                                childitem.ActiveInd = 'Y';

                                var object = {
                                    "CategoryId": mainitem.CategoryId,
                                    "InvestigationId": childitem.InvestigationId,
                                    "ActiveInd": "Y"
                                }
                                $scope.TempArray.push(object);
                            }
                        });
                    }
                });
            });



            if (type === 'edit') {
                $scope.popup_value = 3;
                $scope.PopupInvActiveMenu(3);
                $scope.btnDocInvName = "Update";
            }

            if (type === 'delete') {


                $scope.InvTempplateDetailsObj.DeleteIndicator = 1;


                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete? </h4>", function () {
                    $scope.InvTempplateDetailsObj.ActiveInd = 'N';
                    eHnoteSettingsDataService.addUpdateUserInvestigationTemplate($scope.InvTempplateDetailsObj).success(function (response) {


                        if (response.Status === 'Success') {
                            alertify.success("Deleted Successfully");
                            $scope.InvTempplateDetailsObj = {
                                "UserId": $scope.UserId,
                                "TemplateId": 0,
                                "TemplateName": "",
                                "TemplateJson": "",
                                "HospitalId": parentHospitalId,
                                "ActiveInd": "Y",
                                "TemplateDetails": []
                            };
                            $scope.SubAllCatInvList = angular.copy($scope.MainAllCatInvList);
                            getAllHospitalInvTemplates($scope.newtemplatePageNumber);
                            //getAllDocInvTemplates();
                        }



                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });
                }, function () {
                    return;
                });
            }

            if (type === 'status') {



                eHnoteSettingsDataService.addUpdateUserInvestigationTemplate($scope.InvTempplateDetailsObj).success(function (response) {
                    if ($scope.InvTempplateDetailsObj.ActiveInd === 'N') {
                        alertify.success("Deactivated Successfully");
                    } else {
                        alertify.success("Activated Successfully");
                    }

                    $scope.InvTempplateDetailsObj = {
                        "UserId": $scope.UserId,
                        "TemplateId": 0,
                        "TemplateName": "",
                        "TemplateJson": "",
                        "HospitalId": parentHospitalId,
                        "ActiveInd": "Y",
                        "TemplateDetails": []
                    };
                    $scope.SubAllCatInvList = angular.copy($scope.MainAllCatInvList);
                    getAllHospitalInvTemplates($scope.newtemplatePageNumber);
                    // getAllDocInvTemplates();
                }).error(function (error) {
                    alertify.error("Error Occured");
                });
            }

        };


        function addToCache(arrayName, newobj) {
            var mObj = datapersistanceFactory.getItem('masterDataArrays');
            if (mObj[arrayName] === undefined) {
                mObj[arrayName] = [];
            }
            mObj[arrayName].unshift(newobj);
            loginCookieFactory.set('masterDataArrays', mObj);
        }


        $scope.getMasterCategories = function (text) {
            return eHnoteSettingsDataService.getMasterCategories(text).then(function (response) {
                if (response.data.rows !== undefined) {
                    if (response.data.rows.length > 0) {
                        //return  response.data.rows.filter(item => item.CategoryId > 7)

                        var Categories = $filter("filter")(response.data.rows, function (item) {
                            return item.CategoryId !== 1 && item.CategoryId !== 2 &&
                                item.CategoryId !== 3 && item.CategoryId !== 4 &&
                                item.CategoryId !== 7;
                        }, true);

                        return Categories;
                        //return response.data.rows.map(function (item) {
                        //    return item;
                        //});
                    }
                }


                //if (response.data.count !== 0) {
                //    if (response.data.ProcedureList !== undefined) {
                //        return response.data.ProcedureList.map(function (item) {
                //            item.alertDiv = false;
                //            return item;
                //        });
                //    }
                //} else {
                //    item.alertDiv = true;
                //}


            });

        };



        $scope.SelectCatFromAutoComplete = function (SelectedCategoryObj) {
            $scope.InvestigationObject.SelectedCategoryObj = SelectedCategoryObj;
        };
        $scope.SelectInvFromAutoComplete = function (SelectedInvestigationObj) {
            $scope.InvestigationObject.SelectedInvestigationObj = SelectedInvestigationObj;
        };

        $scope.getMasterInvestigations = function (text) {
            return eHnoteSettingsDataService.GetMasterInvestigations(text, $scope.InvestigationObject.SelectedCategoryObj.CategoryId).then(function (response) {
                if (response.data.rows !== undefined) {
                    if (response.data.rows.length > 0) {
                        //return response.data.rows.filter(item => item.CategoryId === 1 || item.CategoryId === 2 || item.CategoryId === 3 || item.CategoryId === 4 || item.CategoryId !== 7)

                        var Investigations = $filter("filter")(response.data.rows, function (item) {
                            return item.CategoryId !== 1 && item.CategoryId !== 2 &&
                                item.CategoryId !== 3 && item.CategoryId !== 4 &&
                                item.CategoryId !== 7;
                        }, true);

                        return Investigations;
                        //return response.data.rows.map(function (item) {
                        //    return item;
                        //});
                    }
                }



                //if (response.data.count !== 0) {
                //    if (response.data.ProcedureList !== undefined) {
                //        return response.data.ProcedureList.map(function (item) {
                //            item.alertDiv = false;
                //            return item;
                //        });
                //    }
                //} else {
                //    item.alertDiv = true;
                //}


            });

        };
        $scope.InvSubTab = 1;
        $scope.switchInvSubTab = function (val) {
            $scope.InvSubTab = val;
            if (val === 1) {
                GetOrgCategories('', 20, 1);

            } else {
                GetOrgInvestigations('', 10, $scope.newinvestigationPageNumber);
            }

        };
        $scope.PopupInvSubTabActiveMenu = function (menuno) {
            return (menuno === $scope.InvSubTab) ? "active" : "";
        };

        function GetOrgCategories(SearchText, pagesize, pagenumber) {

            var params = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "SearchText": SearchText,
                "PageSize": pagesize,
                "PageNumber": pagenumber
            };
            eHnoteSettingsDataService.GetOrgCategories(params.HospitalId, params.SearchText, params.PageSize, params.PageNumber, callbacksuccess1, callbackfailure1);
            function callbacksuccess1(response) {

                $scope.MainInvCategoriesArray = [];
                $scope.MainInvCategoriesArray = response.rows;
                //$scope.MainInvCategoriesArray = $scope.AllInvArray;
                $scope.MainInvCategoriesArrayCount = response.count;
            }

            function callbackfailure1(error) {


            }

        }

        GetOrgCategories('', 10, 1);
        function GetOrgInvestigations(SearchText, pagesize, pagenumber) {
            var params = {
                "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "AllBranchInd": $scope.FilterAllHospitalsIndicator,
                "SearchText": SearchText,
                "PageSize": pagesize,
                "PageNumber": pagenumber
            };
            eHnoteSettingsDataService.GetOrgInvestigations(params.HospitalId, params.AllBranchInd, params.SearchText, params.PageSize, params.PageNumber, callbacksuccess2, callbackfailure2);
            function callbacksuccess2(response) {


                $scope.MainInvestigationsArray = [];
                $scope.invtotalItems = response.Count;
                $scope.MainInvestigationsArray = response.rows;
            }

            function callbackfailure2(error) {

                console.log(error);
            }

        }

        $scope.addCategoryInvestigations = function (Rightfile, LeftFile) {
            var fd = new FormData();
            var Rightfile = Rightfile || null;
            var LeftFile = LeftFile || null;
            if (Rightfile !== null) {
                var value = Rightfile.name;
                var values = value.split(".");
                var finalValue = "RightEye" + "." + values[1];
                fd.append("file", Rightfile, finalValue);
            }
            if (LeftFile !== null) {
                var value = LeftFile.name;
                var values = value.split(".");
                var finalValue = "LeftEye" + "." + values[1];
                fd.append("file", LeftFile, finalValue);
            }
            var activeImageUploadInd = "N"; if ($scope.InvestigationObject.ImageUploadInd) { activeImageUploadInd = "Y"; }
            var activeRemarksInd = "N"; if ($scope.InvestigationObject.RemarksInd) { activeRemarksInd = "Y"; }
            var activeSyncImageInd = "N"; if ($scope.InvestigationObject.SyncImageInd) { activeSyncImageInd = "Y"; }
            var activeGetTemplateInd = "N"; if ($scope.InvestigationObject.GetTemplateInd) { activeGetTemplateInd = "Y"; }
            var activeFrequencyValuesInd = "N"; if ($scope.InvestigationObject.FrequencyValuesInd) { activeFrequencyValuesInd = "Y"; }
            var activeCdRatioValuesInd = "N"; if ($scope.InvestigationObject.CdRatioValuesInd) { activeCdRatioValuesInd = "Y"; }

            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("HospitalId", $scope.InvestigationObject.HospitalId);
            fd.append("ParentHospitalId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("AllBranchInd", $scope.InvestigationObject.AllHospitalsIndicator);
            fd.append("CategoryName", $scope.InvestigationObject.SelectedCategoryObj.CategoryName ? $scope.InvestigationObject.SelectedCategoryObj.CategoryName : $scope.InvestigationObject.SelectedCategoryObj);
            fd.append("CategoryId", $scope.InvestigationObject.SelectedCategoryObj.CategoryId ? $scope.InvestigationObject.SelectedCategoryObj.CategoryId : 0);
            fd.append("InvestigationName", $scope.InvestigationObject.SelectedInvestigationObj.InvestigationName ? $scope.InvestigationObject.SelectedInvestigationObj.InvestigationName : $scope.InvestigationObject.SelectedInvestigationObj);
            fd.append("InvestigationId", $scope.InvestigationObject.SelectedInvestigationObj.InvestigationId ? $scope.InvestigationObject.SelectedInvestigationObj.InvestigationId : 0);
            fd.append("ActiveInd", "Y");
            fd.append("ImageUploadInd", activeImageUploadInd);
            fd.append("RemarksInd", activeRemarksInd);
            fd.append("SyncImageInd", activeSyncImageInd);
            fd.append("GetTemplateInd", activeGetTemplateInd);
            fd.append("FrequencyValuesInd", activeFrequencyValuesInd);
            fd.append("CdRatioValuesInd", activeCdRatioValuesInd);
            fd.append("GeneralCost", $scope.InvestigationObject.ProcedureGeneralCost || 0);
            fd.append("CgsCost", $scope.InvestigationObject.ProcedureCgsCost || 0);
            fd.append("SgsCost", $scope.InvestigationObject.ProcedureSgsCost || 0);
            fd.append("InsCost", $scope.InvestigationObject.ProcedurePvtInsuranceCost || 0);
            fd.append("SpecializationId", $scope.SpecializationId);
            fd.append("ProcedureMaxDiscountValue", $scope.InvestigationObject.ProcedureMaxDiscountValue || 0);
            fd.append("ProcedureMaxDiscountCost", $scope.InvestigationObject.ProcedureMaxDiscountCost || 0);
            fd.append("ProcedureMaxDiscountType", $scope.InvestigationObject.ProcedureMaxDiscountType || 'A');





            eHnoteSettingsDataService.AddOrgCategoryInvestigation(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {

                if (resp.status === "Failure") {
                    alertify.error(resp.Message);
                } else {
                    $scope.InvestigationObject = {
                        "SelectedCategoryObj": "",
                        "InvestigationName": "",
                        "InvestigationId": 0,
                        "AllHospitalsIndicator": 1,
                        "HospitalId": 0,
                        "BillingCode": "",
                        "ImageUploadInd": false,
                        "RemarksInd": false,
                        "SyncImageInd": false,
                        "GetTemplateInd": false,
                        "FrequencyValuesInd": false,
                        "CdRatioValuesInd": false,
                        "ProcedureGeneralCost": "",
                        "ProcedureCgsCost": "",
                        "ProcedureCgsValue": "",
                        "CgsType": "true",
                        "ProcedureSgsCost": "",
                        "ProcedureSgsValue": "",
                        "SgsType": "true",
                        "PvtInsType": "true",
                        "ProcedurePvtInsuranceCost": "",
                        "ProcedurePvtInsuranceValue": "",
                        "Status_Flg": "New",
                        "HospitalObj": {
                            "ClinicName": "All Locations",
                            "ClinicId": 0
                        },
                        "ProcedureMaxDiscountValue": 0,
                        "ProcedureMaxDiscountCost": 0,
                        "ProcedureMaxDiscountType": 'A'
                    };
                    $scope.showModifyMasterTreatDiv = false;
                    $scope.addInvestigationButton = "Add";
                    alertify.success("Investigation Added Successfully");
                    GetOrgInvestigations('', 10, $scope.newinvestigationPageNumber);
                }
            }

            function callbackfailure(error) {


            }

        };

        $scope.updateCategoryInvestigations = function (Rightfile, LeftFile) {
            var fd = new FormData();
            var Rightfile = Rightfile || null;
            var LeftFile = LeftFile || null;
            if (angular.isObject(Rightfile)) {
                if (Rightfile !== null) {
                    var value = Rightfile.name;
                    var values = value.split(".");
                    var finalValue = "RightEye" + "." + values[1];
                    fd.append("file", Rightfile, finalValue);
                }

            }
            else {
                Rightfile = Rightfile || "";
                fd.append("RightTemplateUrl", Rightfile);
            }
            if (angular.isObject(LeftFile)) {
                if (LeftFile !== null) {
                    var value = LeftFile.name;
                    var values = value.split(".");
                    var finalValue = "LeftEye" + "." + values[1];
                    fd.append("file", LeftFile, finalValue);
                }
            }
            else {
                LeftFile = LeftFile || "";
                fd.append("LeftTemplateUrl", LeftFile);
            }
            var activeImageUploadInd = "N"; if ($scope.InvestigationObject.ImageUploadInd) { activeImageUploadInd = "Y"; }
            var activeRemarksInd = "N"; if ($scope.InvestigationObject.RemarksInd) { activeRemarksInd = "Y"; }
            var activeSyncImageInd = "N"; if ($scope.InvestigationObject.SyncImageInd) { activeSyncImageInd = "Y"; }
            var activeGetTemplateInd = "N"; if ($scope.InvestigationObject.GetTemplateInd) { activeGetTemplateInd = "Y"; }
            var activeFrequencyValuesInd = "N"; if ($scope.InvestigationObject.FrequencyValuesInd) { activeFrequencyValuesInd = "Y"; }
            var activeCdRatioValuesInd = "N"; if ($scope.InvestigationObject.CdRatioValuesInd) { activeCdRatioValuesInd = "Y"; }

            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("HospitalId", $scope.InvestigationObject.HospitalId);
            fd.append("ParentHospitalId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("AllBranchInd", $scope.InvestigationObject.AllHospitalsIndicator);
            fd.append("CategoryName", $scope.InvestigationObject.SelectedCategoryObj.CategoryName ? $scope.InvestigationObject.SelectedCategoryObj.CategoryName : $scope.InvestigationObject.SelectedCategoryObj);
            fd.append("CategoryId", $scope.InvestigationObject.SelectedCategoryObj.CategoryId ? $scope.InvestigationObject.SelectedCategoryObj.CategoryId : 0);
            fd.append("InvestigationName", $scope.InvestigationObject.SelectedInvestigationObj.InvestigationName ? $scope.InvestigationObject.SelectedInvestigationObj.InvestigationName : $scope.InvestigationObject.SelectedInvestigationObj);
            fd.append("InvestigationId", $scope.InvestigationObject.SelectedInvestigationObj.InvestigationId ? $scope.InvestigationObject.SelectedInvestigationObj.InvestigationId : 0);
            fd.append("ActiveInd", "Y");
            fd.append("BillingCode", $scope.InvestigationObject.BillingCode);
            fd.append("DeleteCategoryInd", 0);
            fd.append("DeleteInvestigationInd", 0);
            fd.append("OrgInvestigationId", $scope.InvestigationObject.OrgInvestigationId);
            fd.append("ImageUploadInd", activeImageUploadInd);
            fd.append("RemarksInd", activeRemarksInd);
            fd.append("SyncImageInd", activeSyncImageInd);
            fd.append("GetTemplateInd", activeGetTemplateInd);
            fd.append("FrequencyValuesInd", activeFrequencyValuesInd);
            fd.append("CdRatioValuesInd", activeCdRatioValuesInd);
            fd.append("GeneralCost", $scope.InvestigationObject.ProcedureGeneralCost || 0);
            fd.append("CgsCost", $scope.InvestigationObject.ProcedureCgsCost || 0);
            fd.append("SgsCost", $scope.InvestigationObject.ProcedureSgsCost || 0);
            fd.append("InsCost", $scope.InvestigationObject.ProcedurePvtInsuranceCost || 0);
            fd.append("SpecializationId", $scope.SpecializationId);
            fd.append("ProcedureMaxDiscountValue", $scope.InvestigationObject.ProcedureMaxDiscountValue || 0);
            fd.append("ProcedureMaxDiscountCost", $scope.InvestigationObject.ProcedureMaxDiscountCost || 0);
            fd.append("ProcedureMaxDiscountType", $scope.InvestigationObject.ProcedureMaxDiscountType || 'A');



            eHnoteSettingsDataService.UpdateOrgCategoryInvestigation(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(response) {
                $scope.InvestigationObject = {
                    "SelectedCategoryObj": "",
                    "InvestigationName": "",
                    "InvestigationId": 0,
                    "AllHospitalsIndicator": 1,
                    "HospitalId": 0,
                    "BillingCode": "",
                    "ImageUploadInd": false,
                    "RemarksInd": false,
                    "SyncImageInd": false,
                    "GetTemplateInd": false,
                    "FrequencyValuesInd": false,
                    "CdRatioValuesInd": false,
                    "ProcedureGeneralCost": "",
                    "ProcedureCgsCost": "",
                    "ProcedureCgsValue": "",
                    "CgsType": "true",
                    "ProcedureSgsCost": "",
                    "ProcedureSgsValue": "",
                    "SgsType": "true",
                    "PvtInsType": "true",
                    "ProcedurePvtInsuranceCost": "",
                    "ProcedurePvtInsuranceValue": "",
                    "Status_Flg": "New",
                    "HospitalObj": {
                        "ClinicName": "All Locations",
                        "ClinicId": 0
                    },
                    "ProcedureMaxDiscountValue": 0,
                    "ProcedureMaxDiscountCost": 0,
                    "ProcedureMaxDiscountType": 'A'
                };
                $scope.showModifyMasterTreatDiv = false;
                $scope.addInvestigationButton = "Add";
                alertify.success("Investigation Updated Successfully");
                $scope.leftTemplateFile = "";
                $scope.rightTemplateFile = "";
                GetOrgInvestigations('', 10, $scope.newinvestigationPageNumber);
            }

            function callbackfailure(error) {
                console.log(error);
            }
        };

        $scope.AllUserBranchesList = [];
        $scope.OnlyAllBranchesList = [];
        var BrachesList = [];
        $scope.GetLanguage = function () {
            eHnoteSettingsDataService.GetLanguage()
                .success(function (data) {
                    $scope.AllLanguageData = data;
                    //$scope.OrgLabTestArrayCount = response.count;

                })
                .error(function (error) {
                    alertify.error("Getting languages failed");
                });
        };
        $scope.SaveReferral = "Save";
        $scope.MasterReferralSource = function () {
            eHnoteOrgReferralDataServices.GetMasterReferralSource(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (response) {
                $scope.ReferralSouceMaster = response.data.rows;
            });
        };
        $scope.GetMedicalHistoryMasterTypes = function () {
            eHnoteDiagnosisDataServices.GetMedicalHistoryMasterTypes().then(function (response) {
                $scope.MedicalHistoryMasterTypeList = response.data;
            });
        };
        $scope.ReferralcurrentPage = 1;
        $scope.RefferalSource = function () {
            var getParams = {
                "DoctorID": $scope.doctorinfo.doctorid,
                "USRType": "DOCTOR",
                "PageSize": 10,
                "PageNumber": $scope.ReferralcurrentPage,
                "USRId": $scope.doctorinfo.doctorid,
                "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
            };
            if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                var hospid = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
            } else {
                var hospid = undefined;
                eHnoteOrgReferralDataServices.getReferralServicesList(getParams, hospid, onreadSuccess, onreadFailed);
            }
            function onreadSuccess(data) {
                $scope.ReferralList = data[0].rows;
                $scope.totalItems = data[0].count;
            }
            function onreadFailed(data) {
            }
        }

        function getDoctorsbySubSpecializations(branchId) {

            console.log(branchId);
            var branchesList = [];
            $scope.clinicDoctorList = [];
            $scope.allUserList = [];
            $scope.selectedDoctor = "";
            if (branchId === 0) {
                var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId !== 0; });
                var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

                angular.forEach(TempAppListdoctoraddress, function (items) {
                    branchesList.push(items.BranchId);
                });
            } else {


                var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId === branchId; });
                var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
                angular.forEach(TempAppListdoctoraddress, function (items) {
                    branchesList.push(items.BranchId);
                });
            }




            var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
            var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

            var reqObj = {
                "BranchId": hospitalID,
                "SubSpecializationIdArray": subSplArray
            }


            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                console.log(resp);
                if (resp.rows.length > 0) {
                    $scope.allUserList = resp.rows;

                    $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                    $scope.clinicDoctorList = [];



                    angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                        // angular.forEach(Aitem.UserBranchRoles, function (item) {
                        if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                            //if ($scope.selectedBranch.ClinicId === 0) {
                            //    $scope.clinicDoctorList.push(Aitem);
                            //} else {
                            //    if (item.BranchId === $scope.selectedBranch.ClinicId) {
                            //        $scope.clinicDoctorList.push(Aitem);
                            //    }
                            //}
                            $scope.clinicDoctorList.push(Aitem);


                        }

                        //});
                    });
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.clinicDoctorList.unshift(docAll);





















                    var RoleID = userLoginDetails.RoleID;


                    $scope.AllUserBranchesList = BrachesList;

                    $scope.OnlyAllBranchesList = angular.copy(BrachesList);


                    angular.forEach($scope.OnlyAllBranchesList, function (item, mindex) {
                        if (item.ClinicId === 0) {
                            $scope.OnlyAllBranchesList.splice(mindex, 1)
                        }
                    });

                    $scope.InvestigationObject.HospitalObj = $scope.AllUserBranchesList[0];
                    $scope.InvestigationObject.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
                    $scope.InvestigationObject.AllHospitalsIndicator = 1;
                    $scope.masterProcedureObj.HospitalObj = $scope.AllUserBranchesList[0];
                    $scope.masterProcedureObj.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
                    $scope.masterProcedureObj.AllHospitalsIndicator = 1;
                    $scope.masterMedicineObject.HospitalObj = $scope.AllUserBranchesList[0];

                } else {
                    alertify.error("No Users Found in Selected Departments");
                    $scope.mainBookedAppointmentList = [];
                }


            }

            function onGetUsersFailure(data) {
            }
        }
        function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

            eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                    console.log($scope.allSubSpecializationsArray);
                    getDoctorsbySubSpecializations(BranchId);
                } else {
                    $scope.allSubSpecializationsArray = [];
                    $scope.clinicDoctorList = [];
                    $scope.allUserList = [];
                    $scope.selectedDoctor = "";
                    alertify.error("No Departments are been added");
                }


            });
        };
        function initializeNewBranches(data) {

            BrachesList = []

            BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];



            var EmptyClinicObj = {
                "ClinicName": "All Locations",
                "ClinicId": 0,
                "BranchName": "All Locations",
                "BranchId": 0,
                "SubOrganizationId": 0,
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
            BrachesList.unshift(EmptyClinicObj);

            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];
            $scope.AppListselectedclinic = $scope.BranchesListArray[0];

            $scope.MainSettingObj.BranchesArray = angular.copy($scope.BranchesListArray) || [];


            var RoleID = userLoginDetails.RoleID;

            if (RoleID !== 1 && RoleID !== 56) {

                $scope.clinicDoctorList = [];
                $scope.AppListdoctoraddress = BrachesList;

                $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
                    return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                });

                $scope.selectedBranch = $scope.defaultbranch[0];
                $scope.AppListselectedclinic = $scope.defaultbranch[0];
            }

            //if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
            //    angular.forEach($scope.BranchesListArray, function (item, index) {
            //        if (item.ClinicName !== "All Locations") {
            //            if (item.ExtDetails.HospitalID === $scope.hospid) {
            //                $scope.selectedBranch = item;
            //                $scope.AppListselectedclinic = item;
            //            }
            //        }
            //    });
            //}
            if ($scope.selectedBranch.BranchId === 0) {
                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                    $scope.AppListselectedclinic.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                }
            }
            $scope.AllUserBranchesList = [];
            $scope.AllUserBranchesList = BrachesList;

            $scope.OnlyAllBranchesList = angular.copy(BrachesList);


            angular.forEach($scope.OnlyAllBranchesList, function (item, mindex) {
                if (item.ClinicId === 0) {
                    $scope.OnlyAllBranchesList.splice(mindex, 1)
                }

            });

            $scope.InvestigationObject.HospitalObj = $scope.AllUserBranchesList[0];
            $scope.InvestigationObject.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
            $scope.InvestigationObject.AllHospitalsIndicator = 1;
            $scope.masterProcedureObj.HospitalObj = $scope.AllUserBranchesList[0];
            $scope.masterProcedureObj.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
            $scope.masterProcedureObj.AllHospitalsIndicator = 1;
            $scope.masterMedicineObject.HospitalObj = $scope.AllUserBranchesList[0];
            //GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

            $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (item) {
                return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });
            $scope.BranchSurgeryListObj = $scope.defaultbranch[0];
            $scope.surgeryOrgGetAllInd = 0;
            $scope.BranchContactListObj = $scope.defaultbranch[0];
            $scope.GetAllIndictaor = 0;
        }

        $scope.init = function () {
            if (userLoginDetails.RoleID === 1) {
                if (doctorinfo !== null && doctorinfo.doctordata !== null) {
                    if (doctorinfo.doctordata.UserAddress !== null) {
                        var AllUserBranchesList = doctorinfo.doctordata.UserAddress;
                        for (var i = 0; i < AllUserBranchesList.length; i++) {
                            if (AllUserBranchesList[i].Active === "Y") {
                                BrachesList.push(AllUserBranchesList[i]);
                            }
                        }
                    }
                }
                $scope.BranchDoctorsList = [];
                var countryCode = "";
                if (doctorinfo.doctordata.UserPhone !== undefined) {
                    countryCode = doctorinfo.doctordata.UserPhone[0].PhCntryCD;
                }
                var clinicObj = {
                    "FullName": doctorinfo.doctordata.User[0].FullName,
                    "DoctorID": doctorinfo.doctordata.User[0].DoctorID,
                    "EmailId": doctorinfo.doctordata.UserEmail[0].EmailID,
                    "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
                    "CountryCode": countryCode,
                    "Gender": doctorinfo.doctordata.User[0].Gender,
                    "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                    "Active": "Y",
                    "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
                    "MinPerCase": doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                    "RoleId": doctorinfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                    "ClinicName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                    "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail
                };
                $scope.BranchDoctorsList.push(clinicObj);
                //var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');
                //OnGetDoctorSuccess(brancList);

                var data = localStorageFactory.getItem("allBranchesData") || [];
                initializeNewBranches(data);

            } else {
                //var brancList = localStorageFactory.getItem('allHospitalsDoctorsData');
                //OnGetDoctorSuccess(brancList);

                var data = localStorageFactory.getItem("allBranchesData") || [];
                initializeNewBranches(data);
            }

            $scope.GetLanguage();
            $scope.RefferalSource();
            $scope.MasterReferralSource();
            $scope.GetMedicalHistoryMasterTypes();
        };




        $scope.init();

        $scope.EnableSave = false;


        $scope.tabchange = function () {
            $scope.EnableSave = false;
        };


        $scope.EnableDefaultSave = function () {
            $scope.EnableSave = true;
        };

        $scope.changepage = function () {



            //angular.forEach($scope.printsettingObj.Printdetails, function (item) {
            //    if ($scope.templateSettings.pageName === item.PageName) {
            //        $scope.selectedItemLetterHeadValue = item.LetterHeadValue;
            //    }
            //});

            var Index = $scope.printsettingObj.Printdetails.findIndex(record => record.PageName === $scope.templateSettings.pageName);
            if (Index > -1) {
                $scope.selectedItemLetterHeadValue = $scope.printsettingObj.Printdetails[Index].LetterHeadValue;
            }

        };


        function OnGetDoctorSuccess(data) {

            InitializeBranches(data);

        }
        function OnGetDoctorError(msg) {
            alertify.error("Error in Getting Doctors");
        }

        function InitializeBranches(data) {
            BrachesList = [];
            if (data.length !== 0) {

                angular.forEach(data, function (item, index) {
                    if (item.DoctorDetails !== undefined) {
                        if (item.HospitalInfo.HospitalDetails.ActiveIND === "Y" && item.DoctorDetails.length > 0) {
                            item = {
                                "ClinicName": item.HospitalInfo.HospitalDetails.HospitalName,
                                "OrgGSTNO": item.HospitalInfo.HospitalDetails.OrgGSTNO || "",
                                "ClinicId": item.HospitalInfo.HospitalDetails.HospitalID,
                                "Address1": item.HospitalInfo.HospitalAddress.Address1 || "",
                                "Address2": item.HospitalInfo.HospitalAddress.Address2 || "",
                                "Area": item.HospitalInfo.HospitalAddress.Location || "",
                                "Location": item.HospitalInfo.HospitalAddress.Location,
                                "CityTown": item.HospitalInfo.HospitalAddress.CityTown,
                                "State": item.HospitalInfo.HospitalAddress.State,
                                "PinCode": item.HospitalInfo.HospitalAddress.PinCode,
                                "Country": item.HospitalInfo.HospitalAddress.Country,
                                "CountryCode": item.DoctorDetails[0].CountryCode,
                                "mobilenum": item.DoctorDetails[0].MobileNo,
                                "Active": item.HospitalInfo.HospitalDetails.ActiveIND,
                                "Doctors": item.DoctorDetails,
                                "IsRestrictAppointmentSlot": item.HospitalInfo.HospitalDetails.IsRestrictAppointmentSlot,
                                "IsAllowUserStockUsage": item.HospitalInfo.HospitalDetails.IsAllowUserStockUsage,
                                "IsForumApptRequired": item.HospitalInfo.HospitalDetails.IsForumApptRequired,
                                "SMSSenderId": item.HospitalInfo.HospitalDetails.SMSSenderId,
                                "IsSMSInd": item.HospitalInfo.HospitalDetails.IsSMSInd,
                                "FeedBackURL": item.HospitalInfo.HospitalDetails.FeedBackURL,
                                "MaxSMSCount": item.HospitalInfo.HospitalDetails.MaxSMSCount,
                                "SMSPurchased": item.HospitalInfo.HospitalDetails.SMSPurchased,
                                "NavigationURL": item.HospitalInfo.HospitalDetails.NavigationURL,
                                "IsPrintInsturctions": item.HospitalInfo.HospitalDetails.IsPrintInsturctions,
                                "ExtDetails": {
                                    "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                                    "PrimaryIND": "Y",
                                    "AddressCommunication": [],
                                    "HospitalInfo": {
                                        "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                                        "ParentHospitalID": item.HospitalInfo.HospitalDetails.ParentHospitalID,
                                        "HospitalCode": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode,
                                        "BranchCode": "",
                                        "Preference": {}
                                    }
                                },
                                "IsSurgeryCostRestricted": item.HospitalInfo.HospitalDetails.IsSurgeryCostRestricted
                                // "FastTrackFeeType": item.HospitalInfo.HospitalDetails.FastTrackFeeType,
                                //"FastTrackAmount": item.HospitalInfo.HospitalDetails.FastTrackAmount
                            };
                            BrachesList.push(item);
                        }
                    }
                });

                var EmptyClinicObj = {
                    "ClinicName": "All Locations",
                    "ClinicId": 0,
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
                    "Doctors": []

                };
                BrachesList.unshift(EmptyClinicObj);

            }

            InitialiseBranchDoctor();



        }

        function InitialiseBranchDoctor() {
            $scope.AllUserBranchesList = [];
            $scope.OnlyAllBranchesList = [];
            var item = doctorinfo.doctordata.UserAddress[0];


            if ($scope.RoleId === 1) {
                BrachesList = [];

                $scope.OnlyAllBranchesList = angular.copy(BrachesList);

                var EmptyClinicObj = {
                    "ClinicName": "All Locations",
                    "ClinicId": 0,
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
                    "Doctors": []

                };

                BrachesList.unshift(EmptyClinicObj);
                if (doctorinfo !== null && doctorinfo.doctordata !== null) {
                    if (doctorinfo.doctordata.UserAddress !== null) {
                        var appListdoctoraddress = doctorinfo.doctordata.UserAddress;
                        for (var i = 0; i < appListdoctoraddress.length; i++) {
                            if (appListdoctoraddress[i].Active === "Y") {
                                BrachesList.push(appListdoctoraddress[i]);
                            }
                        }
                    }
                }
                $scope.AllUserBranchesList = BrachesList;
            } else {
                $scope.AllUserBranchesList = BrachesList;
            }

            $scope.OnlyAllBranchesList = angular.copy(BrachesList);


            angular.forEach($scope.OnlyAllBranchesList, function (item, mindex) {
                if (item.ClinicId === 0) {
                    $scope.OnlyAllBranchesList.splice(mindex, 1)
                }
            });

            $scope.InvestigationObject.HospitalObj = $scope.AllUserBranchesList[0];
            $scope.InvestigationObject.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
            $scope.InvestigationObject.AllHospitalsIndicator = 1;
            $scope.masterProcedureObj.HospitalObj = $scope.AllUserBranchesList[0];
            $scope.masterProcedureObj.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
            $scope.masterProcedureObj.AllHospitalsIndicator = 1;
            $scope.masterMedicineObject.HospitalObj = $scope.AllUserBranchesList[0];

        }

        $scope.ChangeHospital = function (item) {
            $scope.InvestigationObject.HospitalObj = item;
            $scope.InvestigationObject.HospitalId = item.ClinicId;
            $scope.masterProcedureObj.HospitalObj = item;
            $scope.masterProcedureObj.HospitalId = item.ClinicId;

            $scope.masterOtherProcedureObj.HospitalObj = item;
            $scope.masterOtherProcedureObj.HospitalId = item.ClinicId;
            $scope.masterMedicineObject.HospitalId = item.ClinicId;
            $scope.masterMedicineObject.HospitalObj = item;
            $scope.BillingPackageObject.HospitalId = item.ClinicId;
            $scope.BillingPackageObject.HospitalObj = item;
            $scope.newInvReqObject.HospitalObj.ClinicName = item.ClinicName;
            if (item.ClinicId === 0) {
                $scope.InvestigationObject.AllHospitalsIndicator = 1;
                $scope.masterProcedureObj.AllHospitalsIndicator = 1;
                $scope.masterOtherProcedureObj.AllHospitalsIndicator = 1;
                $scope.masterMedicineObject.AllHospitalsIndicator = 1;
                $scope.BillingPackageObject.AllHospitalsIndicator = 1;
            } else {
                $scope.InvestigationObject.AllHospitalsIndicator = 0;
                $scope.masterProcedureObj.AllHospitalsIndicator = 0;
                $scope.masterOtherProcedureObj.AllHospitalsIndicator = 1;
                $scope.masterMedicineObject.AllHospitalsIndicator = 0;
                $scope.BillingPackageObject.AllHospitalsIndicator = 0;
            }

        };
        //  $scope.FilterAllHospitalsIndicator = 1;
        $scope.FilterHospitalId = 0;
        $scope.FilterProcedureHospitalId = 0;
        $scope.BranchListObj = $scope.AllUserBranchesList[0];
        //$scope.BranchSurgeryListObj = $scope.AllUserBranchesList[0];
        if ($scope.BranchListObj === undefined) {
            $scope.BranchListObj = {};
            $scope.BranchListObj.ClinicName = "All Locations";
            $scope.BranchListObj.ClinicId = 0;
        }
        $scope.GlobalListObj = $scope.AllUserBranchesList[0];
        $scope.OrgListObj = $scope.AllUserBranchesList[0];
        $scope.changeFilterBranch = function (item) {
            $scope.BranchListObj = item;
            $scope.FilterHospitalId = item.ClinicId;
            if (item.ClinicId === 0) {
                $scope.FilterAllHospitalsIndicator = 1;
            } else {
                $scope.FilterAllHospitalsIndicator = 0;
            }
            $scope.newinvestigationPageNumber = 1;
            GetOrgInvestigations('', 10, $scope.newinvestigationPageNumber);
        };
        $scope.invsearchValue = function (invsearchText) {
            $scope.newinvestigationPageNumber = 1;
            GetOrgInvestigations(invsearchText, 10, $scope.newinvestigationPageNumber);
        };
        $scope.ChangeGlobalFilter = function (item) {
            $scope.GlobalListObj = item;
            $scope.FilterHospitalId = item.ClinicId;
            if (item.ClinicId === 0) {
                $scope.FilterAllHospitalsIndicator = 1;
            } else {
                $scope.FilterAllHospitalsIndicator = 0;
            }
            getMasterProcedureItems();
        };
        $scope.changeOtherOrgFilterBranch = function (item) {
            $scope.OrgListObj = item;
            $scope.FilterProcedureHospitalId = item.ClinicId;
            if (item.ClinicId === 0) {
                $scope.FilterAllHospitalsIndicator = 1;
            } else {
                $scope.FilterAllHospitalsIndicator = 0;
            }
            getMasterOtherProcedureItems();
        };



        $scope.CancelAddInvClick = function () {
            $scope.showModifyMasterTreatDiv = false;
            $scope.addInvestigationButton = "Add";
        };
        $scope.ShowInvestigation = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateFindings) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            $scope.InvestigationObject = {
                "SelectedCategoryObj": "",
                "InvestigationName": "",
                "InvestigationId": 0,
                "AllHospitalsIndicator": 1,
                "HospitalId": 0,
                "BillingCode": "",
                "ImageUploadInd": false,
                "RemarksInd": false,
                "SyncImageInd": false,
                "GetTemplateInd": false,
                "FrequencyValuesInd": false,
                "CdRatioValuesInd": false,
                "ProcedureGeneralCost": "",
                "ProcedureCgsCost": "",
                "ProcedureCgsValue": "",
                "CgsType": "true",
                "ProcedureSgsCost": "",
                "ProcedureSgsValue": "",
                "SgsType": "true",
                "PvtInsType": "true",
                "ProcedurePvtInsuranceCost": "",
                "ProcedurePvtInsuranceValue": "",
                "Status_Flg": "New",
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'
            };
            $scope.showModifyMasterTreatDiv = true;
            $scope.addInvestigationButton = "Add";
        };
        $scope.deleteInvestigation = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure You  want to delete this Investigation ? ", function () {
                var params = {
                    "UserId": $scope.doctorinfo.doctorid,
                    "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "AllBranchInd": 1,
                    "CategoryName": item.CategoryName,
                    "CategoryId": item.CategoryId,
                    "InvestigationName": item.InvestigationName,
                    "InvestigationId": item.InvestigationId,
                    "BillingCode": item.BillingCode,
                    "ActiveInd": "N",
                    "DeleteCategoryInd": 0,
                    "DeleteInvestigationInd": 1,
                    "OrgInvestigationId": item.OrgInvestigationId,
                    "ImageUploadInd": item.ImageUploadInd,
                    "RemarksInd": item.RemarksInd,
                    "SyncImageInd": item.SyncImageInd,
                    "GetTemplateInd": item.GetTemplateInd,
                    "FrequencyValuesInd": item.FrequencyValuesInd,
                    "CdRatioValuesInd": item.CdRatioValuesInd,
                    "GeneralCost": item.ProcedureGeneralCost,
                    "CgsCost": item.ProcedureCgsCost,
                    "SgsCost": item.ProcedureSgsCost,
                    "InsCost": item.ProcedurePvtInsuranceCost,
                    "SpecializationId": $scope.SpecializationId

                };
                eHnoteSettingsDataService.DeleteInvestigationsById(params, callbacksuccess, callbackerror);
                function callbacksuccess(resp) {
                    if (resp.status === "Failure") {
                        alertify.error(resp.Message);
                    } else {
                        alertify.success("Deleted Successfully");

                        GetOrgInvestigations("", 10, $scope.newinvestigationPageNumber);


                        //if (resp.Investigations.length === 0 || resp.Investigations === undefined || resp === undefined) {
                        //    $scope.MainInvestigationsArray = [];
                        //} else {
                        //    alertify.success("Deleted Successfully");
                        //    for (var i = 0; i < resp.Investigations.length; i++) {
                        //        resp.Investigations[i].Status_Flg = "FROM DB";
                        //    }
                        //    $scope.MainInvestigationsArray = resp.Investigations;
                        //    resetInvObject();
                        //}
                    }
                }
                function callbackerror(err) {
                    console.log(error + "error");
                    $scope.MainInvestigationsArray = [];
                    alertify.error(err.Message);
                }
            }, function () {
            });
        };


        $scope.ChangeProcedureNameByType = function (value) {
            $scope.selectedProcedureTypeId = value;
            $scope.getMasterProcedureItemsSearch();
        };


        $scope.ChangeOtherProcedureNameByType = function (value) {
            $scope.selectedProcedureTypeId = value;
            $scope.getMasterOtherProcedureItemsSearch();
        };


        //Surgery Settings Added By Durga as on 12-02-2019


        $scope.surgeryTabActive = 4;


        $scope.surgeryMainObject = getnewsurgeryobject();


        function getnewsurgeryobject() {

            object = {
                "UserId": $scope.UserId,
                "SurgerySpecializationObj": "",
                "SurgerySpecializationName": "",
                "SurgerySpecializationId": "",
                "DeleteSurgeryInd": 0,
                "SelectedSurgery": "",
                "SurgeryName": "",
                "CPTCode": "",
                "SurgeryId": 0,
                "OrgSurgeryId": 0,
                "AllHospitalsIndicator": 1,
                "HospitalId": 0,
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "ProcedureGeneralCost": "",
                "ProcedureCgsCost": "",
                "ProcedureCgsValue": "",
                "CgsType": "true",
                "ProcedureSgsCost": "",
                "ProcedureSgsValue": "",
                "SgsType": "true",
                "PvtInsType": "true",
                "ProcedurePvtInsuranceCost": "",
                "ProcedurePvtInsuranceValue": "",
                "Status_Flg": "New",
                "ActiveInd": "Y",
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'
            };
            return object;
        }


        $scope.switchsurgeryTab = function (index) {
            $scope.surgeryTabActive = index;
            $scope.masterconsultationProcedureBtnName = "Add";

            $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (item) {
                return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });
            $scope.BranchSurgeryListObj = $scope.defaultbranch[0];

            $scope.searchObj = {
                "searchTxtSurgery": "",
                "searchTxtSurgeryPackage": "",
                "searchbillingpackagenametxt": "",
                "SurgerysearchText": "",
                "BirthHistory": "",
                "FamilyHistory": "",
                "NutritionHistory": "",
                "SurgicalHistory": "",
                "MenstrualHistory": "",
                "LifestyleHistory": "",
                "MasterAllergy": "",
                "VaccinationHistory": "",
                "SystemicHistory": "",
                "OcularOHistory": "",
                "FunctionalStatus": "",
                "OcularSurgical": "",
                "CurrentSystemic": ""
            };



            $scope.getUserBranchConslFeeObj = {
                "count": 0,
                "PageSize": 20,
                "PageNumber": 1,
                "BranchId": 3,
                "BranchObj": "",
                "DoctorId": 0,
                "DoctorSearchText": "",
                "AppointmentTypeId": ""
            };

            if ($scope.surgeryTabActive === 2 || $scope.surgeryTabActive === 3) {
                $scope.showBillingPackagesList = true;
                $scope.surgeryOrgPageSize = 0;
                $scope.surgeryOrgPageNumber = 1;
                $scope.surgeryOrgSearchText = "";
                $scope.surgeryOrgCPTSearchText = "";
                $scope.orgBillingPackageSearchTxt = "";
                $scope.OrgSurgerySpecializationId = 0;
                $scope.surgeryOrgGetAllInd = 0;
                $scope.orgBillingPackagePageSize = 10;
                $scope.orgBillingPackagePageNumber = 1;
                $scope.userBranchesForBillingPackges = angular.copy($scope.AllUserBranchesList);


                angular.forEach($scope.userBranchesForBillingPackges, function (item, index) {
                    if (item.ClinicId === 0) {
                        $scope.userBranchesForBillingPackges.splice(index, 1);
                    }

                });



                angular.forEach($scope.userBranchesForBillingPackges, function (item, index) {
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID === item.ClinicId) {
                        $scope.BillPackageOrgObj = item;
                    }
                });



                $scope.orgSurgeryOrganizationID = $scope.defaultbranch[0].ClinicId;
                $scope.orgBillingPackageHospitalId = $scope.defaultbranch[0].ClinicId;
                $scope.getOrganizationSurgeriesList();
                $scope.getOrgBillingPackages();
            }

            if ($scope.surgeryTabActive === 1) {
                $scope.surgeryCatergoriesArray = [];
                $scope.orgSurgeryArray = [];
                $scope.surgeryCategoryArrayCount = 0;
                $scope.surgeryCatPageSize = 100;
                $scope.surgeryCatPageNumber = 1;
                $scope.surgeryCatSearchText = "";
                $scope.surgeryOrgPageSize = 10;
                $scope.surgeryOrgPageNumber = 1;
                $scope.surgeryOrgSearchText = "";
                $scope.surgeryaddUpdateBtnName = "Add";
                $scope.orgSurgeryArrayCount = 0;
                $scope.surgeryOrgGetAllInd = 0;

                $scope.orgSurgeryOrganizationID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

                $scope.OrgSurgerySpecializationId = 0;
                $scope.getMasterSurgeryCategoryList();
                $scope.surgeryMainObject = getnewsurgeryobject();
                $scope.getSurgerySpecializations();
                $scope.getOrganizationSurgeriesList();
            }

            if ($scope.surgeryTabActive === 4) {

                eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
                function onsuccessProc(data) {
                    // $scope.ProcedureListTypes = data;
                    $scope.TempProcedureList = [];
                    $scope.TempProcedureList = data.rows;
                    $scope.ProcedureListTypes = [];
                    //angular.forEach($scope.TempProcedureList, function (item) {
                    //    if (item.Id !== 5 && item.Id !== 2 && item.Id !== 6 && item.Id !== 7) {
                    //        $scope.ProcedureListTypes.push(item);
                    //    }
                    //});

                    angular.forEach($scope.TempProcedureList, function (item) {
                        if (item.Id === 1 || item.Id === 3) {
                            $scope.ProcedureListTypes.push(item);
                        }
                    });

                }
                function onfailureProc(data) {
                }

                $scope.masterProceduresLevelType = "O";
                $scope.masterProceduresPageNumber = 1;
                $scope.FilterAllHospitalsIndicator = 0;
                $scope.OrgListObj = $scope.defaultbranch[0];
                $scope.FilterProcedureHospitalId = $scope.defaultbranch[0].ClinicId;
                getMasterProcedureItems();


            }

            if ($scope.surgeryTabActive === 5) {

                $scope.newGetOrgInvestigationsObj = $scope.getNewOrgInvObject();
                $scope.newGetOrgInvestigationsObj.HospitalObj = $scope.defaultbranch[0];
                $scope.newGetOrgInvestigationsObj.HospitalId = $scope.defaultbranch[0].ClinicId;
                $q.all([
                    $scope.GetSpeciality(),
                    $scope.LabGetUnits(),
                    $scope.LabGetSamples(),

                ]).then(function (resp) {
                    if (resp[0].data.length !== 0) {
                        $scope.masterLabSpecializationArray = resp[0].data;
                    }
                    if (resp[1].data.length !== 0) {
                        $scope.masterLabUnitsArray = resp[1].data;
                    }
                    if (resp[2].data.length !== 0) {
                        $scope.masterSamplesArray = resp[2].data;
                    }

                    $scope.getOrgInvestigationsData();
                }, function (err) {
                    console.log(err);
                    alertify.error("Getting Data Failed");
                });


            }

            if ($scope.surgeryTabActive === 6) {
                //$scope.surgeryCatergoriesArray = [];
                //$scope.orgSurgeryArray = [];
                $scope.surgeryCategoryArrayCount = 0;
                $scope.contactLensPageSize = 100;
                $scope.contactLensPageNumber = 1;
                $scope.contactLensSearchText = "";
                $scope.contactLensPageSize = 10;
                $scope.contactLensPageNumber = 1;
                $scope.contactLensSearchText = "";
                $scope.contactLensAddUpdateBtnName = "Add";
                $scope.contactLensArrayCount = 0;
                $scope.GetAllIndicator = 0;

                $scope.orgHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

                //$scope.OrgSurgerySpecializationId = 0;
                $scope.GetAllLensTypes();
                $scope.contactLensMainObject = getnewcontactlensobject();

                $scope.getOrganizationContactLensList();
            }



            if ($scope.surgeryTabActive === 7) {


                eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
                function onsuccessProc(data) {

                    $scope.TempProcedureList = [];
                    $scope.TempProcedureList = data.rows;
                    $scope.OtherProcedureTypes = [];

                    angular.forEach($scope.TempProcedureList, function (item) {
                        if (item.Id === 10) {
                            $scope.OtherProcedureTypes.push(item);
                        }
                    });
                    $scope.masterOtherProcedureObj.ProcedureTypeId = $scope.OtherProcedureTypes[0].Id;

                }
                function onfailureProc(data) {
                }

                $scope.masterProceduresLevelType = "O";
                $scope.masterProceduresPageNumber = 1;
                $scope.FilterAllHospitalsIndicator = 0;
                $scope.OrgListObj = $scope.defaultbranch[0];
                $scope.FilterProcedureHospitalId = $scope.defaultbranch[0].ClinicId;
                getMasterOtherProcedureItems();
            }


            if ($scope.surgeryTabActive === 8) {

                $scope.selectedProcedureTypeId = 3;
                $scope.userBranchesForConsultationFee = angular.copy($scope.AllUserBranchesList);
                angular.forEach($scope.userBranchesForConsultationFee, function (item, index) {
                    if (item.ClinicId === 0) {
                        $scope.userBranchesForConsultationFee.splice(index, 1);
                    }
                });
                angular.forEach($scope.userBranchesForConsultationFee, function (item, index) {
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID === item.ClinicId) {
                        $scope.consultationFeeObj.BranchObj = item;

                        $scope.masterconsultationProcedureObj = getconsultationProcedureObject();
                        $scope.masterconsultationProcedureObj.BranchId = item.ClinicId;
                        $scope.masterconsultationProcedureObj.BranchObj = item;
                        $scope.getBranchAppointmentTypes(item.ClinicId);
                        $scope.changeConsultationOrgFilterBranch(item);
                        $scope.getUserBranchConslFeeObj.BranchId = item.ClinicId;
                        $scope.getUserBranchConslFeeObj.BranchObj = item;
                        $scope.getUserBranchConsultationFeeDetls();
                    }
                });

            }


        };
        $scope.surgeryClassActiveMenu = function (menuno) {
            return (menuno === $scope.surgeryTabActive) ? "active" : "";
        };

        $scope.getOrgSurgeries = function (text, item) {

            var params = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "AllBranchInd": 1,
                "PageSize": 1000,
                "PageNumber": 1,
                "SearchText": '',
                "CPTSearchText": text,
                "SurgeryCategoryId": null
            };
            return eHnoteSurgeryService.GetOrganizationSurgeries(params, "Get").then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        };
        $scope.selectSurgeryItem = function (item) {

            item.SurgeryName = item.SelectedSurgery.SurgeryName;
            item.SurgeryId = item.SelectedSurgery.SurgeryId;
        };

        $scope.changeSurgerySearch = function (item) {

            item.SurgeryName = item.SelectedSurgery;
            item.SurgeryId = 0;
        };

        $scope.SurgerySubTabActive = 2;
        $scope.switchSugreySubTab = function (val) {
            $scope.SurgerySubTabActive = val;
        };
        $scope.PopupSurgerySubTabActiveMenu = function (menuno) {
            return (menuno === $scope.SurgerySubTabActive) ? "active" : "";
        };

        $scope.surgeryCatergoriesArray = [];
        $scope.masterSurgeryCatergoryList = [];

        $scope.surgeryCatPageSize = 100;
        $scope.surgeryCatPageNumber = 1;
        $scope.surgeryCatSearchText = "";

        $scope.getMasterSurgeryCategoryList = function () {
            eHnoteSettingsDataService.getMasterSurgeryCatList(callbacksuccess, callbackerror);
            function callbacksuccess(data) {
                if (data !== undefined) {
                    if (data.length > 0) {
                        $scope.masterSurgeryCatergoryList = data;

                    }
                }
            }
            function callbackerror(error) {
                console.log(error);
            }
        };


        $scope.getOrgSurgeryCatList = function () {
            var params = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "PageSize": $scope.surgeryCatPageSize,
                "PageNumber": $scope.surgeryCatPageNumber,
                "SearchText": $scope.surgeryCatSearchText
            };
            eHnoteSettingsDataService.getOrgSurgeryCatList(params, callbacksuccess, callbackerror);
            function callbacksuccess(data) {
                if (data !== undefined) {
                    if (data.rows.length > 0) {
                        $scope.surgeryCatergoriesArray = data.rows;
                        $scope.surgeryCategoryArrayCount = data.Count;
                    }
                }
            }
            function callbackerror(error) {
                console.log(error);
            }
        };

        $scope.navClickSurgeryItems = function () {
            //$scope.surgeryCatergoriesArray = [];
            //$scope.orgSurgeryArray = [];
            //$scope.surgeryCategoryArrayCount = 0;
            //$scope.surgeryCatPageSize = 100;
            //$scope.surgeryCatPageNumber = 1;
            //$scope.surgeryCatSearchText = "";
            //$scope.surgeryOrgPageSize = 1000;
            //$scope.surgeryOrgPageNumber = 1;
            //$scope.surgeryOrgSearchText = "";
            //$scope.surgeryaddUpdateBtnName = "Add";
            //$scope.orgSurgeryArrayCount = 0;
            //$scope.surgeryOrgGetAllInd = 0;
            //$scope.orgSurgeryOrganizationID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

            //$scope.OrgSurgerySpecializationId = 0;
            //$scope.getMasterSurgeryCategoryList();
            //$scope.surgeryMainObject = getnewsurgeryobject();
            //$scope.getSurgerySpecializations();
            //$scope.getOrganizationSurgeriesList();
            //var mObj = datapersistanceFactory.getItem('masterDataArrays');
            // $scope.TOSCodeList = angular.copy(mObj.masterTOSCODEList) || [];

            eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
            function onsuccessProc(data) {
                // $scope.ProcedureListTypes = data;
                $scope.TempProcedureList = [];
                $scope.TempProcedureList = data.rows;
                $scope.ProcedureListTypes = [];
                $scope.PayorProcedureTypes = data.PayorPlanTypes || [];
                //angular.forEach($scope.TempProcedureList, function (item) {
                //    if (item.Id !== 5 && item.Id !== 2 && item.Id !== 6 && item.Id !== 7) {
                //        $scope.ProcedureListTypes.push(item);
                //    }
                //});
                angular.forEach($scope.TempProcedureList, function (item) {
                    if (item.Id === 1 || item.Id === 3) {
                        $scope.ProcedureListTypes.push(item);
                    }
                });
            }
            function onfailureProc(data) {
            }

            $scope.masterProceduresLevelType = "O";
            $scope.masterProceduresPageNumber = 1;
            $scope.FilterAllHospitalsIndicator = 0;
            $scope.OrgListObj = $scope.defaultbranch[0];
            $scope.FilterProcedureHospitalId = $scope.defaultbranch[0].ClinicId;
            // getMasterProcedureItems();
            //$scope.btnCancelMasterProcedure();

            // 17-11-2022
            $scope.GetOrganizationProcedureObj = getOrgProcedureObj();
            $scope.GetOrganizationProcedureSearch();
            
            $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();

        };

        $scope.getOrgSurgeries = function () {
            var params = {
                "HospitalId": $scope.orgSurgeryOrganizationID,
                "AllBranchInd": $scope.surgeryOrgGetAllInd,
                "PageSize": $scope.surgeryOrgPageSize,
                "PageNumber": $scope.surgeryOrgPageNumber,
                "SearchText": $scope.surgeryOrgSearchText,
                "CPTSearchText": $scope.surgeryOrgCPTSearchText || ""
            };
            eHnoteSettingsDataService.getOrgSurgeries(params, 'CallBack', callbackgetOrgsuccess, callbackgetOrgerror);
        };
        function callbackgetOrgsuccess(resp) {
            $scope.orgSurgeryArray = [];
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    $scope.orgSurgeryArray = resp.data.rows;
                    $scope.orgSurgeryArrayCount = resp.data.Count;

                }

            }
        }
        function callbackgetOrgerror(error) {
            console.log(error);
        }
        $scope.surgeryNameTextBoxIdFocus = false;

        $scope.surgeryNameLength = 0;
        $scope.surgeryCategoryChange = function (item) {
            item.SurgeryName = "";
            if (item.SurgeryCategoryObj) {
                item.SurgeryCategoryName = item.SurgeryCategoryObj.Name;
                item.SurgeryCategoryId = item.SurgeryCategoryObj.CategoryId;
            }
            var textbox = document.getElementById("surgeryNameTextBoxId");
            $timeout(function () {
                textbox.focus();
            }, 200);
        };

        //$scope.checkSurgeryName = function ($event, surgtext) {

        //    var surgeryinputname = surgtext;
        //    var thisLength = surgeryinputname.length;
        //    if ($event.which === 8 && $scope.surgeryNameLength >= thisLength) {
        //        $event.preventDefault();
        //    }
        //}

        $scope.addNewSurgery = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateSurgeries) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if ($scope.surgeryMainObject.SurgerySpecializationId === 0 || $scope.surgeryMainObject.SurgerySpecializationId === "" || $scope.surgeryMainObject.SurgerySpecializationId === undefined) {
                alertify.error("Please Select Surgery Specialization");
                return false;
            }


            if ($scope.surgeryMainObject.SurgeryName === "" || $scope.surgeryMainObject.SurgeryName === undefined) {
                alertify.error("Please Enter Surgery Name");
                return false;
            }

            //var surgeryname=$scope.surgeryMainObject.SurgeryName.split('-');
            //if (surgeryname[1] === " ") {
            //    alertify.error("Please Enter SurgeryName Name");
            //    return false;
            //}
            $scope.surgeryMainObject.CPTCode = $scope.surgeryMainObject.CPTCode || '';
            if ($scope.surgeryMainObject.CPTCode === '') {
                alertify.error("Please Enter CPTCode");
                return false;
            }
            $scope.surgeryMainObject.ProcedureGeneralCost = $scope.surgeryMainObject.ProcedureGeneralCost || 0;
            $scope.surgeryMainObject.ProcedureCgsCost = $scope.surgeryMainObject.ProcedureCgsCost || 0;
            $scope.surgeryMainObject.ProcedureSgsCost = $scope.surgeryMainObject.ProcedureSgsCost || 0;
            $scope.surgeryMainObject.ProcedurePvtInsuranceCost = $scope.surgeryMainObject.ProcedurePvtInsuranceCost || 0;

            //if ($scope.surgeryMainObject.ProcedureGeneralCost === 0) {
            //    alertify.error("Please Enter General Cost");
            //    return false;
            //}


            if ($scope.surgeryMainObject.HospitalId === 0) {
                $scope.surgeryMainObject.HospitalId = parentHospitalId;
            }





            eHnoteSettingsDataService.addSurgerycategorynsurgery($scope.surgeryMainObject, callbacksuccess, callbackerror);
            function callbacksuccess(resp) {


                if (resp.data.status === "Failure") {
                    alertify.error("Surgery Already Exists");
                } else {
                    alertify.success("Added Successfully");
                    $scope.resetSurgeryObject();
                    $scope.getOrganizationSurgeriesList();
                    $scope.surgeryNameTextBoxIdFocus = false;
                }

            }
            function callbackerror(error) {

            }
        };

        $scope.updateExistingSurgery = function () {

            if ($scope.surgeryMainObject.ProcedureGeneralCost === "" || $scope.surgeryMainObject.ProcedureGeneralCost === undefined) {
                alertify.error("GenerelCost Should Not be Empty");
                return false;
            }
            if ($scope.surgeryMainObject.HospitalId === 0) {
                $scope.surgeryMainObject.HospitalId = parentHospitalId;
            }

            eHnoteSettingsDataService.updateSurgerycategorynsurgery($scope.surgeryMainObject, callbacksuccess, callbackerror);
            function callbacksuccess(resp) {

                alertify.success("Updated Successfully");
                $scope.resetSurgeryObject();
                $scope.getOrganizationSurgeriesList();
            }
            function callbackerror(error) {

            }
        };

        $scope.ChangeSurgeryHospital = function (item) {
            $scope.surgeryMainObject.HospitalObj = item;
            $scope.surgeryMainObject.HospitalId = item.ClinicId;
            if (item.ClinicId === 0) {
                $scope.surgeryMainObject.AllHospitalsIndicator = 1;
            } else {
                $scope.surgeryMainObject.AllHospitalsIndicator = 0;
            }

        };

        $scope.editSurgeryItem = function (item, type) {
            $scope.surgeryMainObject = getnewsurgeryobject();

            if (item.ProcedureCgsCost === 0) {
                item.ProcedureCgsValue = 0;
            } else {
                var cgsValue = 0; cgsValue = (item.ProcedureGeneralCost - item.ProcedureCgsCost); item.ProcedureCgsValue = cgsValue;
            }

            if (item.ProcedureSgsCost === 0) {
                item.ProcedureSgsValue = 0;
            } else {
                var sgsValue = 0; sgsValue = (item.ProcedureGeneralCost - item.ProcedureSgsCost); item.ProcedureSgsValue = sgsValue;
            }

            if (item.ProcedurePvtInsuranceCost === 0) {
                item.ProcedurePvtInsuranceValue = 0;
            } else {
                var piValue = 0; piValue = (item.ProcedureGeneralCost - item.ProcedurePvtInsuranceCost); item.ProcedurePvtInsuranceValue = piValue;
            }



            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.BranchId }, true);
            var selectedSpecialization = $filter("filter")($scope.masterSurgerySpecializationArray, { "SurgerySpecializationId": item.SurgerySpecializationId }, true);






            $scope.surgeryaddUpdateBtnName = "Update";
            $scope.surgeryMainObject.SurgerySpecializationId = item.SurgerySpecializationId;
            $scope.surgeryMainObject.SurgerySpecializationName = item.SurgerySpecializationName;
            $scope.surgeryMainObject.SurgerySpecializationObj = selectedSpecialization[0];
            $scope.surgeryMainObject.SurgeryName = item.SurgeryName;
            $scope.surgeryMainObject.SelectedSurgery = item.SurgeryName;
            $scope.surgeryMainObject.SurgeryId = item.SurgeryId;
            $scope.surgeryMainObject.HospitalId = item.BranchId;
            $scope.surgeryMainObject.CPTCode = item.CPTCode;
            $scope.surgeryMainObject.HospitalObj = SelectedItems[0];
            $scope.surgeryMainObject.ProcedureGeneralCost = item.ProcedureGeneralCost;
            $scope.surgeryMainObject.ProcedureCgsCost = item.ProcedureCgsCost;
            $scope.surgeryMainObject.ProcedureSgsCost = item.ProcedureSgsCost;
            $scope.surgeryMainObject.ProcedurePvtInsuranceCost = item.ProcedurePvtInsuranceCost;
            $scope.surgeryMainObject.ProcedureCgsValue = item.ProcedureCgsValue;
            $scope.surgeryMainObject.ProcedureSgsValue = item.ProcedureSgsValue;
            $scope.surgeryMainObject.ProcedurePvtInsuranceValue = item.ProcedurePvtInsuranceValue;
            $scope.surgeryMainObject.OrgSurgeryId = item.OrgSurgeryId;
            $scope.surgeryMainObject.SurgeryId = item.SurgeryId;
            $scope.surgeryMainObject.ProcedureMaxDiscountValue = item.ProcedureMaxDiscountValue || 0;
            $scope.surgeryMainObject.ProcedureMaxDiscountCost = item.ProcedureMaxDiscountCost || 0;
            $scope.surgeryMainObject.ProcedureMaxDiscountType = item.ProcedureMaxDiscountType.trim() || 'A';
            if (type === 'Delete') {
                $scope.surgeryMainObject.DeleteSurgeryInd = 1;
                $scope.updateExistingSurgery();
            }

            $window.scrollTo(0, angular.element('surgeryAddDiv').offsetTop);
        };

        $scope.deleteSurgeryItem = function (item, type) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                $scope.editSurgeryItem(item, type);
            }, function () {
                r = "You pressed Cancel!";
            });

        };




        $scope.getOrganizationSurgeriesList = function () {

            $scope.organizationSurgeriesArray = [];
            $scope.orgSurgeryArrayCount = 0;
            var params = {
                "HospitalId": $scope.orgSurgeryOrganizationID,
                "AllBranchInd": $scope.surgeryOrgGetAllInd,
                "PageSize": $scope.surgeryOrgPageSize,
                //"PageSize":1000,
                "PageNumber": $scope.surgeryOrgPageNumber,
                "SearchText": $scope.surgeryOrgSearchText,
                "CPTSearchText": $scope.surgeryOrgCPTSearchText || "",
                "SurgerySpecializationId": $scope.OrgSurgerySpecializationId
            };
            eHnoteSurgeryService.GetOrganizationSurgeries(params, 'CallBack', callbackgetOrganizationsuccess, callbackgetOrganizationerror);


        };

        $scope.getAllSurgeriesForAutoComplete = function (text, item) {

            var params = {
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": text,
                "SurgerySpecializationId": item.SurgerySpecializationId,
                "AllSurgeriesInd": 1
            };
            return eHnoteSurgeryService.GetOrganizationSurgeries(params, "Get").then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });
        };

        function callbackgetOrganizationsuccess(resp) {

            if (resp.data.Count > 0) {
                $scope.organizationSurgeriesArray = [];
                $scope.organizationSurgeriesArray = angular.copy(resp.data.rows);
                $scope.orgSurgeryArrayCount = resp.data.Count;
            }
        }
        function callbackgetOrganizationerror(error) {
            console.log(error);
        }

        $scope.surgeryOrgpageChanged = function (pageno) {

            $scope.surgeryOrgPageNumber = pageno;
            var params = {
                "HospitalId": $scope.orgSurgeryOrganizationID,
                "AllBranchInd": $scope.surgeryOrgGetAllInd,
                "PageSize": $scope.surgeryOrgPageSize,
                "PageNumber": $scope.surgeryOrgPageNumber,
                "SearchText": $scope.surgeryOrgSearchText,
                "SurgerySpecializationId": $scope.OrgSurgerySpecializationId
            };
            eHnoteSurgeryService.GetOrganizationSurgeries(params, 'CallBack', callbackgetOrganizationsuccess, callbackgetOrganizationerror);

        };
        $scope.changeSurgeryFilterBranch = function (item) {
            var HospitalId = 0;
            $scope.BranchSurgeryListObj = item;
            if (item.ClinicId === 0) {
                $scope.surgeryOrgGetAllInd = 1;
                HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            }
            else {
                $scope.surgeryOrgGetAllInd = 0;
                HospitalId = item.ClinicId;
            }
            $scope.orgSurgeryOrganizationID = HospitalId;
            $scope.surgeryOrgPageNumber = 1;
            $scope.surgeryOrgPageSize = 10;
            $scope.surgeryOrgSearchText = "";
            $scope.surgeryOrgCPTSearchText = "";
            $scope.searchObj.SurgerysearchText = "";
            $scope.getOrganizationSurgeriesList();
        };


        $scope.surgerysearchValue = function (text) {
            $scope.surgeryOrgSearchText = text;
            $scope.surgeryOrgCPTSearchText = text;
            $scope.surgeryOrgGetAllInd = 1;
            $scope.surgeryOrgPageSize = 10;
            $scope.surgeryOrgPageNumber = 1;
            $scope.getOrganizationSurgeriesList();
        };
        $scope.CancelAddSurgeryClick = function () {
            $scope.resetSurgeryObject();
        };
        $scope.resetSurgeryObject = function () {
            $scope.surgeryaddUpdateBtnName = "Add";
            $scope.surgeryMainObject = getnewsurgeryobject();
        };

        //Surgery New Version Code Added By Durga as on 18-04-2019
        $scope.orgbillingpackagescount = 0;
        $scope.orgBillingPackageHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.orgBillingPackageSearchTxt = "";

        $scope.getSurgerySpecializations = function () {
            eHnoteSurgeryService.GetMasterSurgerySpecializations(callbacksuccess, callbackerror);
            function callbacksuccess(data) {

                if (data !== undefined) {
                    if (data.length > 0) {
                        $scope.masterSurgerySpecializationArray = data;

                    }
                }
            }
            function callbackerror(error) {
                console.log(error);
            }
        };



        //$scope.GetAllLensTypes = function () {
        //    return eHnoteDiagnosisDataServices.GetAllLensTypes();
        //};

        $scope.surgerySpecializationChange = function (item) {
            item.SurgeryName = "";
            if (item.SurgerySpecializationObj) {
                item.SurgerySpecializationName = item.SurgerySpecializationObj.Name;
                item.SurgerySpecializationId = item.SurgerySpecializationObj.SurgerySpecializationId;
            }
            var textbox = document.getElementById("surgeryNameTextBoxId");
            $timeout(function () {
                textbox.focus();
            }, 200);
        };






        $scope.settingsbillTab = 2;
        $scope.NavBillActiveTab = function (menuno) {
            return (menuno === $scope.settingsbillTab) ? "active" : "";
        };


        $scope.GetNewOrgBillingPackage = function (text) {


            var object = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "OrgSurgeryId": $scope.mainPackageObject.SurgeryOrgId,
                "SearchText": text || "",
                "PageSize": 10,
                "PageNumber": 1
            };
            return eHnoteSettingsDataService.GetOrgBillingPackage(object, "Get").then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });



        };

        $scope.getOrgBillingPackages = function (orgsurgeryId) {
            var orgsurId = orgsurgeryId || 0;

            $scope.orgBillingPackagesArray = [];
            $scope.orgbillingpackagescount = 0;
            var params = {
                "HospitalId": $scope.orgBillingPackageHospitalId,
                "SearchText": $scope.orgBillingPackageSearchTxt,
                "PageSize": $scope.orgBillingPackagePageSize,
                "PageNumber": $scope.orgBillingPackagePageNumber
            };
            if (orgsurId !== 0) {
                params.OrgSurgeryId = orgsurId;
            }


            eHnoteSettingsDataService.GetOrgBillingPackage(params, 'CallBack', callbackgetOrganizationPkgsuccess, callbackgetOrganizationPkgerror);
        };

        function callbackgetOrganizationPkgsuccess(resp) {

            if (resp.count > 0) {
                if (resp.rows.length > 0) {
                    $scope.orgBillingPackagesArray = angular.copy(resp.rows);
                    $scope.orgbillingpackagescount = resp.count;





                    angular.forEach($scope.orgBillingPackagesArray, function (item) {
                        item.packageItemDetailsArray = [];
                        item.showpackageItemDetails = false;
                    });
                }
            }
        }

        function callbackgetOrganizationPkgerror(error) {
            console.log(error);
        }


        $scope.switchtBillActiveTab = function (val) {
            $scope.settingsbillTab = val;

            if (val === 2) {
                $scope.getOrgPromoCodes();
            }
            if (val === 1) {
                $scope.settingsbillTab = 1;
                eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
                function onsuccessProc(data) {
                    // $scope.ProcedureListTypes = data;
                    $scope.TempProcedureList = [];
                    $scope.TempProcedureList = data.rows;
                    $scope.ProcedureListTypes = [];
                    angular.forEach($scope.TempProcedureList, function (item) {
                        if (item.Id !== 5 && item.Id !== 2 && item.Id !== 6 && item.Id !== 7) {
                            $scope.ProcedureListTypes.push(item);
                        }
                    });

                }
                function onfailureProc(data) {
                }

                $scope.masterProceduresLevelType = "O";
                $scope.masterProceduresPageNumber = 1;
                $scope.FilterAllHospitalsIndicator = 0;
                $scope.OrgListObj = $scope.OnlyAllBranchesList[0];
                $scope.FilterProcedureHospitalId = $scope.OrgListObj.ClinicId;
                getMasterProcedureItems();
            }


        };

        //Billing Package Code Added on 13-05-2018 by Durga
        $scope.orgBillingPackagesArray = [];


        //$scope.orgBillingPackagePageSize = 10;
        //$scope.orgBillingPackagePageNumber = 1;


        $scope.BillingPackageObject = {
            "UserId": $scope.UserId,
            "SurgeryId": "",
            "SurgeryName": "",
            "SurgeryOrgId": "",
            "BillingCode": "",
            "SurgeryObject": "",
            "SurgeryBillName": "",
            "SurgeryBillId": 0,
            "OrgSurgeryBillingPackageId": 0,
            "GeneralCost": "",
            "CgsCost": "",
            "CgsType": "true",
            "CgsValue": "",
            "SgsCost": "",
            "SgsType": "true",
            "SgsValue": "",
            "PvtInsuranceCost": "",
            "PvtInsuranceValue": "",
            "PvtInsType": "true",
            "ActiveInd": "Y",
            "AllHospitalsIndicator": 1,
            "HospitalId": parentHospitalId,
            "HospitalObj": {
                "ClinicName": "All Locations",
                "ClinicId": 0
            },
            "PackageItems": [],
            "ProcedureMaxDiscountValue": 0,
            "ProcedureMaxDiscountCost": 0,
            "ProcedureMaxDiscountType": 'A',
            //"PackageItems": [
            //    {
            //        "Id": "",
            //        "ItemName": "",
            //        "ItemId": "",
            //        "PackageTypeId": 1,
            //        "Quantity": "",
            //        "Cost": "",
            //        "ActiveInd": "Y"
            //    },
            //    {
            //        "Id": "",
            //        "ItemName": "",
            //        "ItemId": "",
            //        "PackageTypeId": 2,
            //        "Quantity": "",
            //        "Cost": "",
            //        "ActiveInd": "Y"
            //    },
            //    {
            //        "Id": "",
            //        "ItemName": "",
            //        "ItemId": "",
            //        "PackageTypeId": 2,
            //        "Quantity": "",
            //        "Cost": "",
            //        "ActiveInd": "Y"
            //    }
            //],
            "IsSameBillNameInd": false
        };

        $scope.onselectOrgSurgery = function (item) {


            $scope.BillingPackageObject.SurgeryName = item.SurgeryName;
            $scope.BillingPackageObject.SurgeryOrgId = item.OrgSurgeryId;
            $scope.BillingPackageObject.SurgeryId = item.SurgeryId;

            var textbox = document.getElementById("surgeryBillNameTextBoxId");
            $timeout(function () {
                textbox.focus();
            }, 200);
        };

        $scope.changeSurgeryBillName = function (item) {
            if (item.IsSameBillNameInd) {
                item.SurgeryBillName = item.SurgeryName;
            } else {
                item.SurgeryBillName = "";
            }
        };

        $scope.ClearAddBillingPackageDtls = function () {
            $scope.BillingPackageObject = {
                "UserId": $scope.UserId,
                "SurgeryId": "",
                "SurgeryName": "",
                "SurgeryOrgId": "",
                "BillingCode": "",
                "SurgeryObject": "",
                "SurgeryBillName": "",
                "SurgeryBillId": 0,
                "OrgSurgeryBillingPackageId": 0,
                "GeneralCost": "",
                "CgsCost": "",
                "CgsType": "true",
                "CgsValue": 0,
                "SgsCost": "",
                "SgsType": "true",
                "SgsValue": 0,
                "PvtInsuranceCost": "",
                "PvtInsuranceValue": 0,
                "PvtInsType": "true",
                "ActiveInd": "Y",
                "AllHospitalsIndicator": 1,
                "HospitalId": parentHospitalId,
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "PackageItems": [],
                "IsSameBillNameInd": false,
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'
            };
        };


        $scope.addsurgeryBillingPackage = function () {

            if ($scope.BillingPackageObject.SurgeryName === "") {
                alertify.error("Please Select A Surgery");
                return;
            }

            if ($scope.BillingPackageObject.SurgeryBillName === "") {
                alertify.error("Please Enter Package Name");
                return;
            }


            if ($scope.BillingPackageObject.GeneralCost === "") {
                alertify.error("Please Enter General Cost");
                return;
            }

            $scope.BillingPackageObject.GeneralCost = $scope.BillingPackageObject.GeneralCost || 0;
            $scope.BillingPackageObject.CgsCost = $scope.BillingPackageObject.CgsCost || 0;
            $scope.BillingPackageObject.SgsCost = $scope.BillingPackageObject.SgsCost || 0;
            $scope.BillingPackageObject.PvtInsuranceCost = $scope.BillingPackageObject.PvtInsuranceCost || 0;


            var params = angular.copy($scope.BillingPackageObject);
            params.GeneralCost = parseInt(params.GeneralCost);









            eHnoteSurgeryService.AddupdateBillingPackageDtls(params, callbacksuccess, callbackerror);

            function callbacksuccess(resp) {

                if (resp.Status === "Failure") {
                    alertify.error("Surgery Package Already Exists");
                } else {
                    if ($scope.packageDeleteMode) {
                        alertify.success("Deleted Successfully");
                    } else {
                        alertify.success("Added Successfully");
                    }
                    $scope.ClearAddBillingPackageDtls();
                    $scope.getOrgBillingPackages();
                    $scope.surgeryPackageaddUpdateBtnName = 'Add';
                    $scope.packageDeleteMode = false;

                }
            }
            function callbackerror(error) {
                console.log(error);
                alertify.error("Something Went Wrong");
            }
        };


        $scope.changeCgsPkgValue = function (item) {

            if (item.CgsValue === undefined) {
                item.CgsCost = 0;
            } else {
                if (parseInt(item.CgsValue) > parseInt(item.GeneralCost)) {
                    alertify.error("CGS value should not be greater than General cost");
                    item.CgsValue = "";
                    item.CgsCost = 0;
                    return false;
                }

                if (item.CgsType === 'true') {
                    item.CgsCost = item.GeneralCost - parseInt(item.CgsValue);
                } else {
                    item.CgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.CgsValue));
                }

            }

        };
        $scope.changeSgsPkgValue = function (item) {


            if (item.SgsValue === undefined) {
                item.SgsCost = 0;
            } else {

                if (parseInt(item.SgsValue) > parseInt(item.GeneralCost)) {
                    alertify.error("SGS value should not be greater than General cost");
                    item.SgsValue = "";
                    item.SgsCost = 0;
                    return false;
                }
                if (item.SgsType === 'true') {
                    item.SgsCost = item.GeneralCost - parseInt(item.SgsValue);
                } else {
                    item.SgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.SgsValue));
                }
            }


        };
        $scope.changePvtInsPkgValue = function (item) {


            if (item.PvtInsuranceValue === undefined) {
                item.PvtInsuranceCost = 0;
            } else {


                if (parseInt(item.PvtInsuranceValue) > parseInt(item.GeneralCost)) {
                    alertify.error("PI value should not be greater than General cost");
                    item.PvtInsuranceValue = "";
                    item.PvtInsuranceCost = 0;
                    return false;
                }
                if (item.PvtInsType === 'true') {
                    item.PvtInsuranceCost = item.GeneralCost - parseInt(item.PvtInsuranceValue);
                } else {
                    item.PvtInsuranceCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.PvtInsuranceValue));
                }
            }


        };

        $scope.orgBillingPackagePagechanged = function (pageno) {

            $scope.orgBillingPackagePageNumber = pageno;

            var params = {
                "HospitalId": $scope.orgBillingPackageHospitalId,
                "SearchText": $scope.orgBillingPackageSearchTxt,
                "PageSize": $scope.orgBillingPackagePageSize,
                "PageNumber": $scope.orgBillingPackagePageNumber
            };
            eHnoteSettingsDataService.GetOrgBillingPackage(params, 'CallBack', callbackgetOrganizationPkgsuccess, callbackgetOrganizationPkgerror);

            //$scope.getOrgBillingPackages();
        };

        $scope.changeBillPackOrgFilterBranch = function (item) {
            $scope.BillPackageOrgObj = item;
            $scope.orgBillingPackageHospitalId = item.ClinicId;
            $scope.orgBillingPackagePageNumber = 1;
            $scope.orgBillingPackageSearchTxt = "";
            $scope.searchObj.searchbillingpackagenametxt = "";
            $scope.getOrgBillingPackages();
        };
        $scope.changeMedicineOrgFilter = function (item) {
            // $scope.MedicineOrgObj = item;
            getMasterMedicineItems($scope.MedicineOrgObj.ClinicId);

        };


        $scope.EditOrgSurgeryBillingPackage = function (item) {


            if (item.CgsCost === 0) {
                item.CgsValue = 0;
            } else {
                var cgsValue = 0; cgsValue = (item.SurgeryCost - item.CgsCost); item.CgsValue = cgsValue;
            }

            if (item.SgsCost === 0) {
                item.SgsValue = 0;
            } else {
                var sgsValue = 0; sgsValue = (item.SurgeryCost - item.SgsCost); item.SgsValue = sgsValue;
            }


            if (item.InsuranceCost === 0) {
                item.PvtInsuranceValue = 0;
            } else {
                var piValue = 0; piValue = (item.SurgeryCost - item.InsuranceCost); item.PvtInsuranceValue = piValue;
            }


            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.OrganizationId }, true);

            $scope.surgeryPackageaddUpdateBtnName = 'Update';



            $scope.BillingPackageObject = {
                "UserId": $scope.UserId,
                "SurgeryId": item.SurgeryId,
                "SurgeryName": item.SurgeryName,
                "SurgeryOrgId": item.OrganizationSurgeryId,
                "BillingCode": item.BillingCode,
                "SurgeryObject": "",
                "SurgeryBillName": item.SurgeryBillingName,
                "SurgeryBillId": item.SurgeryBillingPackageId,
                "OrgSurgeryBillingPackageId": item.OrgSurgeryBillingId,
                "GeneralCost": item.SurgeryCost,
                "CgsCost": item.CgsCost,
                "CgsType": "true",
                "CgsValue": item.CgsValue,
                "SgsCost": item.SgsCost,
                "SgsType": "true",
                "SgsValue": item.SgsValue,
                "PvtInsuranceCost": item.InsuranceCost,
                "PvtInsuranceValue": item.PvtInsuranceValue,
                "PvtInsType": "true",
                "ActiveInd": "Y",
                "AllHospitalsIndicator": 1,
                "HospitalId": item.OrganizationId,
                "HospitalObj": SelectedItems[0],
                "PackageItems": [],
                "IsSameBillNameInd": false,
                "ProcedureMaxDiscountValue": item.ProcedureMaxDiscountValue || 0,
                "ProcedureMaxDiscountCost": item.ProcedureMaxDiscountCost || 0,
                "ProcedureMaxDiscountType": item.ProcedureMaxDiscountType.trim() || 'A'
            };




            $window.scrollTo(0, angular.element('surgeryAddDiv').offsetTop);

        };


        $scope.packageDeleteMode = false;

        $scope.DeleteOrgSurgeryBillingPackage = function (item) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {


                if (item.CgsCost === 0) {
                    item.CgsValue = 0;
                } else {
                    var cgsValue = 0; cgsValue = (item.GeneralCost - item.CgsCost); item.CgsValue = cgsValue;
                }

                if (item.SgsCost === 0) {
                    item.SgsValue = 0;
                } else {
                    var sgsValue = 0; sgsValue = (item.GeneralCost - item.SgsCost); item.SgsValue = sgsValue;
                }


                if (item.PvtInsuranceCost === 0) {
                    item.PvtInsuranceValue = 0;
                } else {
                    var piValue = 0; piValue = (item.GeneralCost - item.PvtInsuranceCost); item.PvtInsuranceValue = piValue;
                }


                var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.OrganizationId }, true);




                $scope.BillingPackageObject = {
                    "UserId": $scope.UserId,
                    "SurgeryId": item.SurgeryId,
                    "SurgeryName": item.SurgeryName,
                    "SurgeryOrgId": item.OrganizationSurgeryId,
                    "BillingCode": item.BillingCode,
                    "SurgeryObject": "",
                    "SurgeryBillName": item.SurgeryBillingName,
                    "SurgeryBillId": item.SurgeryBillingPackageId,
                    "OrgSurgeryBillingPackageId": item.OrgSurgeryBillingId,
                    "GeneralCost": item.SurgeryCost,
                    "CgsCost": item.CgsCost,
                    "CgsType": "true",
                    "CgsValue": item.CgsValue,
                    "SgsCost": item.SgsCost,
                    "SgsType": "true",
                    "SgsValue": item.SgsValue,
                    "PvtInsuranceCost": item.PvtInsuranceCost,
                    "PvtInsuranceValue": item.PvtInsuranceValue,
                    "PvtInsType": "true",
                    "ActiveInd": "N",
                    "AllHospitalsIndicator": 1,
                    "HospitalId": item.OrganizationId,
                    "HospitalObj": SelectedItems[0],
                    "PackageItems": [],
                    "IsSameBillNameInd": false
                };

                $scope.packageDeleteMode = true;
                $scope.addsurgeryBillingPackage();



            }, function () {
                r = "You pressed Cancel!";
            });



        };

        $scope.searchbillingpackage = function (text) {
            $scope.orgBillingPackageSearchTxt = text;
            $scope.orgBillingPackagePageSize = 10;
            $scope.orgBillingPackagePageNumber = 1;
            $scope.getOrgBillingPackages();
        };




        $scope.modifyPrintImgLogo = function (file) {
            var fd = new FormData();

            if (file === null) {
                return;
            }
            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 1);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);

            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintHeaderImgUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintHeaderImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintHeaderImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintHeaderImgblob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };


        $scope.modifyHeaderImgPrintImgLogo = function (file) {
            var fd = new FormData();
            if (file === null) {
                return;
            }
            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 2);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);
            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintImageHeaderUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintImageHeaderUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintImageHeaderUrl, function (dataURL) {
                            $scope.printsettingObj.PrintImageHeaderBlob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };

        $scope.modifyFooterImgPrintImgLogo = function (file) {
            var fd = new FormData();
            if (file === null) {
                return;
            }
            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 3);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);
            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintImageFooterUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintImageFooterUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintImageFooterUrl, function (dataURL) {
                            $scope.printsettingObj.PrintImageFooterBlob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };


        $scope.modifyOpticalHeaderImgPrintImgLogo = function (file) {
            var fd = new FormData();
            if (file === null) {
                return;
            }
            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 4);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);
            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintOpticalHeaderImgUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintOpticalHeaderImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintOpticalHeaderImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintOpticalHeaderImgBlob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };

        $scope.modifyOpticalFooterImgPrintImgLogo = function (file) {
            var fd = new FormData();
            if (file === null) {
                return;
            }
            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 5);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);
            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintOpticalFooterImgUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintOpticalFooterImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintOpticalFooterImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintOpticalFooterImgBlob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };



        $scope.modifyPharmacyHeaderImgPrintImgLogo = function (file) {
            var fd = new FormData();
            if (file === null) {
                return;
            }
            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 6);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);
            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintPharmacyHeaderImgUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintPharmacyHeaderImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintPharmacyHeaderImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintPharmacyHeaderImgBlob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };

        $scope.modifyPharmacyFooterImgPrintImgLogo = function (file) {
            var fd = new FormData();
            if (file === null) {
                return;
            }

            fd.append("file", file);
            fd.append("UserId", $scope.doctorinfo.doctorid);
            fd.append("ImageType", 7);
            fd.append("ParentOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID);
            fd.append("SubOrganizationId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID);
            fd.append("BranchId", $scope.hospid);
            eHnoteSettingsDataService.AddUpdatePrintImageLogo(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                if (resp.status === "Success") {
                    $scope.printsettingObj.PrintPharmacyFooterImgUrl = resp.ImageUrl;
                    if ($scope.printsettingObj.PrintPharmacyFooterImgUrl !== "") {
                        $scope.toDataURL($scope.printsettingObj.PrintPharmacyFooterImgUrl, function (dataURL) {
                            $scope.printsettingObj.PrintPharmacyFooterImgBlob = dataURL;
                        });
                    }
                }
            }

            function callbackfailure(error) {


            }

        };


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




        //New code added for surgery billing package detail by Durga as on 23-10-2019

        $scope.packageItemTypes = [
            {
                "Id": "1",
                "Name": "SurgeryCharges",
                "NotSelectable": true
            },
            {
                "Id": "2",
                "Name": "Consumables",
                "NotSelectable": false
            },
            {
                "Id": "3",
                "Name": "Investigations",
                "NotSelectable": false
            },
            {
                "Id": "4",
                "Name": "Procedures",
                "NotSelectable": false
            },
            {
                "Id": "7",
                "Name": "IOL",
                "NotSelectable": false
            },
            {
                "Id": "9",
                "Name": "HospitalCharges",
                "NotSelectable": false
            },
            {
                "Id": "10",
                "Name": "OtherCharges",
                "NotSelectable": false
            }
        ];

        $scope.packageDetailInit = function () {
            $scope.mainPackageObject = getNewbillingPackageDetailObject();

            $scope.organizationSurgeriesArray = [];
            $scope.orgBillingPackagesArray = [];
            $scope.surgeryOrgGetAllInd = 0;
            $scope.orgSurgeryOrganizationID = $scope.mainPackageObject.HospitalId;
            $scope.surgeryOrgPageNumber = 1;
            $scope.surgeryOrgPageSize = 1000;
            $scope.surgeryOrgSearchText = "";
            $scope.surgeryOrgCPTSearchText = "";
            $scope.OrgSurgerySpecializationId = 0;
            $scope.getOrganizationSurgeriesList();
        };



        function getNewbillingPackageDetailObject() {
            var object = {
                "Userid": $scope.UserId,
                "UserId": $scope.UserId,
                "HospitalId": "",
                "SurgeryName": "",
                "SurgeryId": "",
                "SurgeryOrgId": "",
                "SurgeryCost": "",
                "SurgeryPackageName": "",
                "SurgeryPackageId": "",
                "SurgeryPackageOrgId": 0,
                "SurgeryBillingPackageObj": "",
                "SurgeryPackageCost": "",
                "CurrentTotalPackageCost": "",
                "PackageItemDetails": [],
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                }
            };

            object.HospitalObj = $scope.AllUserBranchesList[0];
            object.HospitalId = $scope.AllUserBranchesList[0].ClinicId;


            $scope.userBranchesOfPackgesDetail = angular.copy($scope.AllUserBranchesList);
            angular.forEach($scope.userBranchesOfPackgesDetail, function (item, index) {
                if (item.ClinicId === 0) {
                    $scope.userBranchesOfPackgesDetail.splice(index, 1);
                }

            });
            angular.forEach($scope.userBranchesOfPackgesDetail, function (item, index) {
                if ($scope.doctorinfo.hospitalID === item.ClinicId) {
                    object.HospitalObj = item;
                    object.HospitalId = item.ClinicId;
                }
            });

            return object;
        }



        $scope.ChangeSurgeryBilling = function (item) {

            if (item.SurgeryBillingPackageObj === "" || item.SurgeryBillingPackageObj === undefined) {
                item.SurgeryPackageOrgId = 0;
                item.SurgeryPackageName = "";
            } else {
                item.SurgeryPackageOrgId = 0;
                item.SurgeryPackageName = item.SurgeryBillingPackageObj;
            }


        };

        $scope.onselectSurgeryBilling = function (mitem) {
            console.log(item);

            var item = mitem.SurgeryBillingPackageObj;

            mitem.SurgeryPackageOrgId = mitem.SurgeryBillingPackageObj.OrgSurgeryBillingId;

            $scope.mainPackageObject.SurgeryPackageName = item.SurgeryBillingName;
            $scope.mainPackageObject.SurgeryPackageId = item.SurgeryBillingPackageId;
            $scope.mainPackageObject.SurgeryPackageOrgId = item.OrgSurgeryBillingId;
            $scope.mainPackageObject.SurgeryPackageCost = item.SurgeryCost;

            $scope.mainPackageObject.PackageItemDetails = [];
            $scope.searchObj.searchTxtSurgeryPackage = "";

            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.ItemTypeId = "2";
            $scope.packageSubObject.ItemTypeName = "Consumables";
            $scope.packageSubObject.ItemId = $scope.mainPackageObject.SurgeryOrgId;
            $scope.packageSubObject.ItemName = item.SurgeryName;
            $scope.packageSubObject.Quantity = 1;
            $scope.packageSubObject.Cost = $scope.mainPackageObject.SurgeryCost;

            $scope.mainPackageObject.PackageItemDetails.push($scope.packageSubObject);
            $scope.calculatePackageCost();
            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.ItemTypeObj = $scope.packageItemTypes[1];

            $scope.getBillingPackageDetailsById(item.OrgSurgeryBillingId);
        };
        $scope.packageSubObject = getpackageSubObject();


        $scope.packageSubObject.ItemTypeObj = $scope.packageItemTypes[1];

        function getpackageSubObject() {
            var object = {
                "PackageDetailItemId": 0,
                "ItemTypeId": "2",
                "OrganId": "0",
                "OrganName": "",
                "ItemTypeName": "Consumables",
                "ItemTypeObj": "",
                "ItemId": "",
                "ItemName": "",
                "ItemObj": "",
                "Quantity": "",
                "Cost": "",
                "ActualCost": "",
                "CategoryId": 0,
                "ActiveInd": "Y",
                "EditMode": false

            };

            return object;
        }


        $scope.searchObj = {
            "searchTxtSurgery": "",
            "searchTxtSurgeryPackage": "",
            "searchbillingpackagenametxt": "",
            "SurgerysearchText": ""
        };

        $scope.changePackageBranch = function (item) {

            $scope.mainPackageObject = getNewbillingPackageDetailObject();
            $scope.mainPackageObject.HospitalObj = item;
            $scope.mainPackageObject.HospitalId = item.ClinicId;

            $scope.mainPackageObject.SurgeryName = "";
            $scope.mainPackageObject.SurgeryOrgId = "";
            $scope.mainPackageObject.SurgeryId = "";
            $scope.mainPackageObject.SurgeryCost = "";
            $scope.searchObj.searchTxtSurgery = "";
            $scope.searchObj.searchTxtSurgeryPackage = "";
            $scope.surgeryOrgGetAllInd = 0;

            $scope.organizationSurgeriesArray = [];
            $scope.orgSurgeryArrayCount = 0;
            var params = {
                "HospitalId": $scope.mainPackageObject.HospitalId,
                "AllBranchInd": 0,
                "PageSize": 1000,
                "PageNumber": 1,
                "SearchText": "",
                "SurgerySpecializationId": 0
            };
            eHnoteSurgeryService.GetOrganizationSurgeries(params, 'CallBack', callbackgetOrganizationsuccess, callbackgetOrganizationerror);


        };




        $scope.onselectSurgeryInPackageDetail = function (item) {
            $scope.mainPackageObject.SurgeryName = item.SurgeryName;
            $scope.mainPackageObject.SurgeryOrgId = item.OrgSurgeryId;
            $scope.mainPackageObject.SurgeryId = item.SurgeryId;
            $scope.mainPackageObject.SurgeryCost = item.ProcedureGeneralCost;

            $scope.orgBillingPackageHospitalId = $scope.mainPackageObject.HospitalId;
            $scope.orgBillingPackageSearchTxt = "";
            $scope.orgBillingPackagePageSize = 1000;
            $scope.orgBillingPackagePageNumber = 1;
            $scope.getOrgBillingPackages($scope.mainPackageObject.SurgeryOrgId);

            $scope.searchObj.searchTxtSurgery = "";
            $scope.searchObj.searchTxtSurgeryPackage = "";
            $scope.mainPackageObject.SurgeryPackageName = "";
            $scope.mainPackageObject.SurgeryPackageId = "";
            $scope.mainPackageObject.SurgeryPackageOrgId = "";
            $scope.mainPackageObject.SurgeryPackageCost = "";
            $scope.mainPackageObject.SurgeryBillingPackageObj = "";
            $scope.mainPackageObject.PackageItemDetails = [];
            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.ItemTypeObj = $scope.packageItemTypes[1];
        };


        $scope.onselectSurgeryPackageInPackageDetail = function (item) {

            $scope.mainPackageObject.SurgeryPackageName = item.SurgeryBillingName;
            $scope.mainPackageObject.SurgeryPackageId = item.SurgeryBillingPackageId;
            $scope.mainPackageObject.SurgeryPackageOrgId = item.OrgSurgeryBillingId;
            $scope.mainPackageObject.SurgeryPackageCost = item.SurgeryCost;

            $scope.mainPackageObject.PackageItemDetails = [];
            $scope.searchObj.searchTxtSurgeryPackage = "";

            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.ItemTypeId = "2";
            $scope.packageSubObject.ItemTypeName = "Consumables";
            $scope.packageSubObject.ItemId = $scope.mainPackageObject.SurgeryOrgId;
            $scope.packageSubObject.ItemName = item.SurgeryName;
            $scope.packageSubObject.Quantity = 1;
            $scope.packageSubObject.Cost = $scope.mainPackageObject.SurgeryCost;

            $scope.mainPackageObject.PackageItemDetails.push($scope.packageSubObject);
            $scope.calculatePackageCost();
            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.ItemTypeObj = $scope.packageItemTypes[1];

            $scope.getBillingPackageDetailsById(item.OrgSurgeryBillingId);



        };

        $scope.addNewPackageItem = function () {

            if ($scope.packageSubObject.PackageDetailItemId === 0) {

                var i = 0;
                if ($scope.mainPackageObject.PackageItemDetails.length > 0) {
                    angular.forEach($scope.mainPackageObject.PackageItemDetails, function (initem) {
                        if (initem.ItemId === $scope.packageSubObject.ItemId && initem.ItemTypeName === $scope.packageSubObject.ItemTypeName) {
                            alertify.error('Item already exist!');
                            i++;
                        }
                    });
                }
                if (i === 0) {

                    $scope.mainPackageObject.PackageItemDetails.push($scope.packageSubObject);
                }

                // $scope.mainPackageObject.PackageItemDetails.push($scope.packageSubObject);
            } else {
                angular.forEach($scope.mainPackageObject.PackageItemDetails, function (mainitem) {
                    if ($scope.packageSubObject.PackageDetailItemId === mainitem.PackageDetailItemId) {
                        mainitem.ItemId = $scope.packageSubObject.ItemId;
                        mainitem.ItemName = $scope.packageSubObject.ItemName;
                        mainitem.ItemObj = $scope.packageSubObject.ItemObj;
                        mainitem.Quantity = parseInt($scope.packageSubObject.Quantity);
                        mainitem.Cost = parseInt($scope.packageSubObject.Cost);
                    }
                });
            }


            angular.forEach($scope.mainPackageObject.PackageItemDetails, function (citem) {
                citem.EditMode = false;
            });

            $scope.calculatePackageCost();
            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.ItemTypeObj = $scope.packageItemTypes[1];
        };


        $scope.calculatePackageCost = function () {

            var total = 0;



            angular.forEach($scope.mainPackageObject.PackageItemDetails, function (item) {
                if (item.ActiveInd === 'Y') {
                    item.Cost = parseFloat(item.Cost) || 0;
                    total += item.Cost;
                }

            });
            $scope.mainPackageObject.CurrentTotalPackageCost = total;

        };


        $scope.changePackageItemType = function (item) {
            item.ItemTypeId = item.ItemTypeObj.Id;
            item.ItemTypeName = item.ItemTypeObj.Name;
            item.ItemObj = "";
            item.ItemId = "";
            item.ItemName = "";
            item.Quantity = "";
            if (item.ItemTypeObj.Id === '1') {
                $scope.getOrgSurgeryCharges();
                item.Quantity = "1";
            }
            if (item.ItemTypeObj.Id === '9') {
                $scope.getOrgHospitalCharges();
                item.Quantity = "1";
            }
        };


        $scope.getInventoryStock = function (val) {

            object = {
                "searchText": val,
                "BarCode": null,
                "Diopter": null,
                "organizationId": $scope.hospid,
                "InventoryOrganizationItemId": null,
                "CategoryId": 0
            };

            return eHnoteSurgeryService.SearchHospitalInventory(object).then(function (resp) {
                if (resp.data.status === "Success") {
                    resp.data.rows = resp.data.rows || [];
                    if (resp.data.rows.length !== 0) {
                        return resp.data.rows;
                    }
                } else {
                    alertify.error("Getting consumables failed");
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting consumables failed");
            });

        };




        $scope.addUpdateBillingPackageDetails = function () {
            $scope.mainPackageObject.SurgeryPackageCost = parseFloat($scope.mainPackageObject.SurgeryPackageCost) || 0;
            if ($scope.mainPackageObject.SurgeryPackageCost === 0) {
                alertify.error("Please Enter Package Cost");
                return false;
            }

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateSurgeriesPackages) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }


            if ($scope.mainPackageObject.SurgeryPackageCost === $scope.mainPackageObject.CurrentTotalPackageCost) {
                continuetoAddPackage();
            } else {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Actual Package Cost and Items Total Cost is not Equal. </br> Do you want to continue.? </h4>", function () {
                    continuetoAddPackage();
                }, function () {
                    r = "You pressed Cancel!";
                });


            }




        };
        $scope.InvSpecialityId = 3;
        $scope.GetAllSpecialityInd = 1;
        $scope.changeInvSpeciality = function (item) {
            if (item === 0) {
                $scope.InvSpecialityId = 0;

                $scope.SelectedEye = 4;
                $scope.GetAllSpecialityInd = 0;
            }
            else {

                $scope.InvSpecialityId = 3;
                $scope.SelectedEye = 3;
                $scope.GetAllSpecialityInd = 1;
            }

        };

        function continuetoAddPackage() {


            var params = angular.copy($scope.mainPackageObject);
            params.HospitalObj = "";


            console.log(JSON.stringify(params));
            //return false;
            eHnoteSurgeryService.AddupdatePackageDetailItems(params, callbacksuccess, callbackerror);

            function callbacksuccess(resp) {


                alertify.success("Added Successfully");

                if (resp.Status === 'Success') {

                    if (resp.rows.length > 0) {
                        $scope.mainPackageObject = getNewbillingPackageDetailObject();
                    }
                }


            }
            function callbackerror(error) {
                console.log(error);
                alertify.error("Something Went Wrong");
            }
        }

        $scope.getBillingPackageDetailsById = function (id) {


            $scope.BillingPackageIdsArray = [];
            var obj = {
                "OrgBillingPackageId": id
            };

            $scope.BillingPackageIdsArray.push(obj);
            var params = {
                "BillingPackageIdsArray": $scope.BillingPackageIdsArray
            };

            eHnoteSurgeryService.GetBillingPackageItemDetailsById(params, callbacksuccess, callbackerror);

            function callbacksuccess(resp) {


                if (resp.rows.length > 0) {
                    $scope.mainPackageObject.PackageItemDetails = [];
                    $scope.mainPackageObject.PackageItemDetails = angular.copy(resp.rows);



                    $scope.calculatePackageCost();
                }


            }
            function callbackerror(error) {
                console.log(error);
                alertify.error("Something Went Wrong");
            }

        };



        $scope.showPackageDetailItems = function (item) {

            item.showpackageItemDetails = !item.showpackageItemDetails;
            item.packageItemDetailsArray = [];
            $scope.BillingPackageIdsArray = [];
            if (item.showpackageItemDetails) {



                var obj = {
                    "OrgBillingPackageId": item.OrgSurgeryBillingId
                };

                $scope.BillingPackageIdsArray.push(obj);
                var params = {
                    "BillingPackageIdsArray": $scope.BillingPackageIdsArray
                };

                eHnoteSurgeryService.GetBillingPackageItemDetailsById(params, callbacksuccess, callbackerror);

                function callbacksuccess(resp) {

                    if (resp.status === 'Success') {
                        if (resp.rows.length > 0) {
                            item.packageItemDetailsArray = angular.copy(resp.rows);
                        }
                    }

                }
                function callbackerror(error) {
                    console.log(error);
                    alertify.error("Something Went Wrong");
                }
            }



        };

        $scope.showBillingPackagesList = true;

        $scope.navClicktoShowPackageDetails = function () {
            $scope.showBillingPackagesList = false;
            $scope.packageDetailInit();
        };
        $scope.cancelBillingPackageAdd = function () {
            $scope.showBillingPackagesList = true;
            $scope.packageDetailInit();
            $scope.switchsurgeryTab(3);
        };


        $scope.editPackageItem = function (item) {


            var mitem = angular.copy(item);
            $scope.packageSubObject = getpackageSubObject();
            $scope.packageSubObject.PackageDetailItemId = mitem.PackageDetailItemId;
            $scope.packageSubObject.ItemId = mitem.ItemId;
            $scope.packageSubObject.ItemName = mitem.ItemName;
            $scope.packageSubObject.ItemObj = mitem.ItemName;
            $scope.packageSubObject.Cost = mitem.Cost;
            $scope.packageSubObject.Quantity = mitem.Quantity;
            $scope.packageSubObject.CategoryId = mitem.CategoryId;
            $scope.packageSubObject.ItemTypeId = mitem.ItemTypeId;
            $scope.packageSubObject.EditMode = true;
            mitem.ItemTypeId = mitem.ItemTypeId.toString();





            angular.forEach($scope.mainPackageObject.PackageItemDetails, function (citem) {
                citem.EditMode = true;
            });



            angular.forEach($scope.packageItemTypes, function (subitem) {
                if (subitem.Id === mitem.ItemTypeId) {
                    $scope.packageSubObject.ItemTypeObj = subitem;
                    $scope.packageSubObject.ItemTypeName = subitem.Name;
                }
            });



            if (item.PackageDetailItemId === 0) {
                var Index = $scope.mainPackageObject.PackageItemDetails.findIndex(record => record.ItemId === item.ItemId && record.ItemName === item.ItemName);
                if (Index > -1) {
                    $scope.mainPackageObject.PackageItemDetails.splice(Index, 1);
                }
            }
        };


        $scope.deletePackageItem = function (item) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {

                if (item.PackageDetailItemId === 0) {
                    var Index = $scope.mainPackageObject.PackageItemDetails.findIndex(record => record.ItemId === item.ItemId && record.ItemName === item.ItemName);
                    if (Index > -1) {
                        $scope.mainPackageObject.PackageItemDetails.splice(Index, 1);
                    }
                } else {
                    item.ActiveInd = 'N';
                }


                $scope.calculatePackageCost();

            }, function () {
                r = "You pressed Cancel!";
            });




        };

        $scope.ChangeOrganInvestigation = function (item) {
            item.OrganId = item.OrganId.toString();
            //item.OrganId = item.OrganId;
            if (item.OrganId === "1") {
                item.OrganName = "Right Eye";
            }
            else if (item.OrganId === "2") {
                item.OrganName = "Left  Eye";
            }
            else if (item.OrganId === "3") {
                item.OrganName = "Both  Eye";
            }
            else if (item.OrganId === "4") {
                item.OrganName = "General";
            }
            console.log(item);
        };
        //function getMasterNewInvestigationItems(pagenumber) {
        //    var object = {
        //        "InvSpecialityId": $scope.InvSpecialityId,
        //        "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        //        "GetAllIndicator": 0,
        //        "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
        //        "PageSize": 10,
        //        "PageNumber": pagenumber,
        //        "SearchText": ""
        //    };
        //    eHnoteLabService.getOrganizationInvestigationData(object).success(function (response) {
        //        if (response.rows !== undefined) {
        //            if (response.rows.length > 0) {
        //                $scope.patientSuggestInvList = angular.copy(response.rows) || [];
        //                $scope.patientSuggestInvListCount = response.count;
        //            }
        //        }
        //    }).error(function (error) {
        //        console.log(error);
        //    });
        //}
        $scope.getInvestigationProcedures = function (val) {



            var object = {
                "InvSpecialityId": $scope.InvSpecialityId,
                "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "GetAllIndicator": 0,
                "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": val,
            };
            return eHnoteLabService.getOrganizationInvestigationData(object).then(function (resp) {

                console.log(resp);
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            });
        };

        //$scope.getInvestigationProcedures = function (val) {
        //    var object = {
        //        "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        //        "SearchText": val
        //    };
        //    return eHnoteSettingsDataService.GetProceduresByType(object).then(function (response) {
        //        if (response.data.ProcedureList !== undefined) {
        //            return response.data.ProcedureList.map(function (item) {
        //                return item;
        //            });
        //        }

        //    });
        //};


        $scope.PreSelectProcedure = function (obj) {

            //obj.ItemId = obj.ItemObj.ProcedureId;
            //obj.ItemName = obj.ItemObj.ProcedureName;
            //obj.Cost = obj.ItemObj.ProcedureGeneralCost;
            //if (obj.Cost === 0 || obj.Cost === undefined) {
            //    obj.Cost = "";
            //}
            obj.OrganId = parseInt(obj.OrganId) || null;

            angular.forEach(obj.ItemObj.InvCostArray, function (mainitem) {
                if (mainitem.OrganId === obj.OrganId) {
                    obj.Cost = mainitem.GeneralCost;
                }
            });

            obj.ItemId = obj.ItemObj.InvestigationId;
            obj.ItemName = obj.ItemObj.InvestigationName;
            //obj.Cost = obj.ItemObj.ProcedureGeneralCost;
            if (obj.Cost === 0 || obj.Cost === undefined) {
                obj.Cost = "";
            }

            obj.Quantity = 1;
        };


        $scope.surgeryPackageaddUpdateBtnName = 'Add';


        $scope.changePackageItemQty = function (obj) {
            obj.Cost = "";
        };

        $scope.getHospitalProducts = function (viewValue) {




            object = {
                "CategoryId": 0,
                "OrganizationId": $scope.mainPackageObject.HospitalId,
                "SearchText": viewValue
            };
            if ($scope.packageSubObject.ItemTypeId == '7') {
                object.CategoryId = 0;
            }

            return HInventoryService.SearchHospitalProductList(object).then(function (resp) {
                if (resp.data.Status === 1) {
                    resp.data.data = resp.data.data || [];
                    if (resp.data.data.length > 0) {
                        return resp.data.data.map(function (item) {
                            return item;
                        });
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {
                alertify.error("Getting products failed");
                console.log(err);
            });
        };

        $scope.ChooseInventoryStock = function (DetailsObj) {

            DetailsObj.ItemId = DetailsObj.ItemObj.InventoryOrganizationItemId;
            DetailsObj.ItemName = DetailsObj.ItemObj.ItemName;
            DetailsObj.Quantity = 1;
            DetailsObj.CategoryId = DetailsObj.ItemObj.CategoryId;
            DetailsObj.Mrp = DetailsObj.ItemObj.BatchList[0].MRP;
            DetailsObj.NoOfItems = DetailsObj.ItemObj.BatchList[0].NoOfItems;
            DetailsObj.Cost = Math.round(DetailsObj.Mrp / DetailsObj.NoOfItems);

            if (DetailsObj.Cost === 0 || DetailsObj.Cost === undefined) {
                DetailsObj.Cost = "";
            }

        };

        $scope.onAutoProductSelect = function (DetailsObj) {

            DetailsObj.ItemId = DetailsObj.ItemObj.InventoryOrganizationItemId;
            DetailsObj.ItemName = DetailsObj.ItemObj.ProductName;
            DetailsObj.Quantity = 1;
            DetailsObj.CategoryId = DetailsObj.ItemObj.CategoryId;
            DetailsObj.Cost = "";

        };


        $scope.getPackageProcedureItemsSearch = function (val) {
            object = {
                "LevelType": $scope.masterProceduresLevelType,
                "AllBranchInd": 1,
                "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                //"ProcedureTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
                "ServicesTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
            };
            return eHnoteSettingsDataService.GetMasterProcedures(object).then(function (response) {
                if (response.data.ProcedureList !== undefined) {
                    return response.data.ProcedureList.map(function (item) {
                        return item;
                    });
                }
            });
        };

        $scope.getPackageOtherProcedureItemsSearch = function (val) {


            object = {
                "LevelType": $scope.masterProceduresLevelType,
                "AllBranchInd": 0,
                // "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : parentHospitalId,
                "HospitalId": $scope.mainPackageObject.HospitalId ? $scope.mainPackageObject.HospitalId : parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ProcedureTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
            };

            if ($scope.packageSubObject.ItemTypeId === '9') {
                object.ProcedureTypeId = 9;
            }

            if ($scope.packageSubObject.ItemTypeId === '10') {
                object.ProcedureTypeId = 10;
            }

            return eHnoteSettingsDataService.GetMasterOtherProcedures(object).then(function (response) {
                if (response.data.ProcedureList !== undefined) {
                    return response.data.ProcedureList.map(function (item) {
                        return item;
                    });
                }
            });
        };


        $scope.OrgSurgeryChargesList = [];
        $scope.OrgHospitalChargesList = [];

        $scope.getOrgSurgeryCharges = function () {


            object = {
                "LevelType": $scope.masterProceduresLevelType,
                "AllBranchInd": 0,
                "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1,
                "ProcedureTypeId": 11
            };
            eHnoteSettingsDataService.GetMasterOtherProcedures(object).then(function (response) {
                if (response.data.ProcedureList !== undefined) {
                    console.log(response.data);

                    if (response.data.status == "Success") {
                        $scope.OrgSurgeryChargesList = response.data.ProcedureList;
                    }
                }
            });
        };

        $scope.getOrgHospitalCharges = function () {
            object = {
                "LevelType": $scope.masterProceduresLevelType,
                "AllBranchInd": 0,
                "HospitalId": $scope.FilterHospitalId ? $scope.FilterHospitalId : parentHospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1,
                "ProcedureTypeId": 9
            };
            eHnoteSettingsDataService.GetMasterOtherProcedures(object).then(function (response) {
                if (response.data.ProcedureList !== undefined) {
                    if (response.data.status == "Success") {
                        $scope.OrgHospitalChargesList = response.data.ProcedureList;
                    }
                }
            });
        };

        $scope.onPackageProductSelect = function (DetailsObj) {
            DetailsObj.ItemId = DetailsObj.ItemObj.ProcedureId;
            DetailsObj.ItemName = DetailsObj.ItemObj.ProcedureName;
            DetailsObj.Quantity = 1;
            DetailsObj.CategoryId = DetailsObj.ItemObj.CategoryId;
            DetailsObj.Cost = DetailsObj.ItemObj.ProcedureGeneralCost;
        }

        $scope.GetIncompletestatus = function () {
            eHnoteSettingsDataService.GetMasterProfileStatusInCompleteDetails(parentHospitalId).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.InCompleteDetailsList = [];
                    if (resp.data.rows.length > 0) {
                        $scope.InCompleteDetailsList = resp.data.rows || [];
                        angular.forEach($scope.InCompleteDetailsList, function (item) {
                            item.IsSelected = false;
                        });
                    }
                } else {
                    alertify.error("Failed");
                }
            }, function (error) {
                alertify.error(error);
            });
        };

        $scope.ActiveOranizationTab = 1;
        $scope.switchtoOrganization = function (tab) {
            $scope.ActiveOranizationTab = tab;
            if (tab == 2) {


                $scope.BranchSettingsData = datapersistanceFactory.getItem("BranchSettingsData");
                console.log($scope.BranchSettingsData);

                $scope.BranchSettingsData.CheckInAvgTime = $scope.BranchSettingsData.CheckInAvgTime.toString();

            }
            else if (tab == 3) {
                $scope.FacilityObj = GetFacilityObj();
                $scope.defaultLoginBranch();

                $scope.UserFacilityBranch = angular.copy($scope.AllUserBranchesList);
                angular.forEach($scope.AllUserBranchesList, function (item, index) {
                    if (item.ClinicId === 0) {
                        $scope.UserFacilityBranch.splice(index, 1);
                    }

                });
                $scope.GetOrganizationFacilities(1);
            }
        }
        $scope.SaveBranchSettings = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateOrganizationSettings) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            };

            object = {
                "HospitalID": $scope.hospid,
                "UserId": $scope.UserId,
                "IsRestrictAppointmentSlot": $scope.BranchSettingsData.IsRestrictAppointmentSlot ? 1 : 0,
                "IsEnableBillinAppointment": $scope.BranchSettingsData.IsEnableBillinAppointment ? 1 : 0,
                "FeedBackURL": $scope.BranchSettingsData.FeedBackURL,
                "NavigationURL": $scope.BranchSettingsData.NavigationURL,
                "IsPrintInsturctions": $scope.BranchSettingsData.IsPrintInsturctions,
                "IsSurgeryCostRestricted": $scope.BranchSettingsData.IsSurgeryCostRestricted ? 1 : 0,
                "IsAllowUserStockUsage": $scope.BranchSettingsData.IsAllowUserStockUsage ? 1 : 0,
                "IsForumApptRequired": $scope.BranchSettingsData.IsForumApptRequired ? 1 : 0,
                "IsEnableQueueManagement": $scope.BranchSettingsData.IsEnableQueueManagement ? 1 : 0,
                "CheckInAvgTime": $scope.BranchSettingsData.CheckInAvgTime,
                "IsTwoWayVarificationInd": $scope.BranchSettingsData.IsTwoWayVarificationInd ? 1 : 0,
                "AgingByType": $scope.BranchSettingsData.AgingByType || 'ServiceDate',
                "StatementDuration": $scope.BranchSettingsData.StatementDuration,
                "IsShowEmptyASCChecklist": $scope.BranchSettingsData.IsShowEmptyASCChecklist ? 1 : 0,
            };

            eHnoteSettingsDataService.UpdateOrganizationBranchSettingsData(object).success(function (data) {
                datapersistanceFactory.set("BranchSettingsData", $scope.BranchSettingsData);
                alertify.success("Branch Settings updated successfully");
            }).error(function (error) {
                alertify.error("Branch Settings updation failed");
            });
        };

        //Patient History

        getMasterMedicalHistoryItems();
        getMasterBirthHistoryItems();
        getMasterFamilyHistoryItems();
        getMasterNutritionalHistoryItems();
        getMasterImmunisationHistoryItems();
        getMasterSurgicalHistoryItems();
        getMasterMenstrualHistoryItems();
        getMasterLifestyleHistoryItems();

        $scope.masterMedicalHistoryPagechanged = function (pagenumber) {
            $scope.masterMedicalHistoryPageNumber = pagenumber;
            getMasterMedicalHistoryItems();
        };

        function getMasterMedicalHistoryItems() {
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "NotesTypeId": 1,
                "HistoryId": 0,
                "PageSize": $scope.masterMedicalHistoryPageSize,
                "PageNumber": $scope.masterMedicalHistoryPageNumber,
                "SearchText": ""
            };
            eHnoteSettingsDataService.GetMasterMedicalHistory(object).success(function (response) {
                $scope.MasterMedicalHistoryOrgArray = [];
                if (response.MedicalHistory !== undefined) {
                    if (response.MedicalHistory.length > 0) {
                        $scope.MasterMedicalHistoryOrgArray = response.MedicalHistory;
                        $scope.masterMedicalHistoryItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterMedicalHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterMedicalHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterMedicalHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }

        $scope.masterBirthHistoryPagechanged = function (pagenumber) {
            $scope.masterBirthHistoryPageNumber = pagenumber;
            getMasterBirthHistoryItems();
        };

        function getMasterBirthHistoryItems() {
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                //"HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "NotesTypeId": 6,
                "HistoryId": 0,
                "PageSize": $scope.masterBirthHistoryPageSize,
                "PageNumber": $scope.masterBirthHistoryPageNumber,
                "SearchText": "",
                "IsFrequent": "N"
            };
            $scope.searchObj.BirthHistory = $scope.searchObj.BirthHistory || '';
            if ($scope.searchObj.BirthHistory != '') {
                object.SearchText = $scope.searchObj.BirthHistory;
                object.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterBirthHistory(object).success(function (response) {
                $scope.MasterBirthHistoryOrgArray = [];
                if (response.BirthHistory !== undefined) {
                    if (response.BirthHistory.length > 0) {
                        $scope.MasterBirthHistoryOrgArray = response.BirthHistory;
                        $scope.masterBirthHistoryItems = response.count;
                    }
                    if ($scope.MasterBirthHistoryOrgArray.length > 0) {
                        angular.forEach($scope.MasterBirthHistoryOrgArray, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentind = true;
                            }
                            else {
                                item.IsFrequentind = false;
                            }
                        });
                    }

                }
            }).error(function (error) {
                console.log(error);
            });

            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterBirthHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterBirthHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterBirthHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }

        $scope.masterFamilyHistoryPagechanged = function (pagenumber) {
            $scope.masterFamilyHistoryPageNumber = pagenumber;
            getMasterFamilyHistoryItems();
        };

        function getMasterFamilyHistoryItems() {
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                //"HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "NotesTypeId": 2,
                "HistoryId": 0,
                "PageSize": $scope.masterFamilyHistoryPageSize,
                "PageNumber": $scope.masterFamilyHistoryPageNumber,
                "SearchText": "",
                "IsFrequent": "N"
            };
            $scope.searchObj.FamilyHistory = $scope.searchObj.FamilyHistory || '';
            if ($scope.searchObj.FamilyHistory != '') {
                object.SearchText = $scope.searchObj.FamilyHistory;
                object.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterFamilyHistory(object).success(function (response) {
                $scope.MasterFamilyHistoryOrgArray = [];
                if (response.FamilyHistory !== undefined) {
                    if (response.FamilyHistory.length > 0) {
                        $scope.MasterFamilyHistoryOrgArray = response.FamilyHistory;
                        $scope.masterFamilyHistoryItems = response.count;
                    }
                    if ($scope.MasterFamilyHistoryOrgArray.length > 0) {
                        angular.forEach($scope.MasterFamilyHistoryOrgArray, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentind = true;
                            }
                            else {
                                item.IsFrequentind = false;
                            }
                        });
                    }


                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterFamilyHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterFamilyHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterFamilyHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }

        $scope.masterNutritionalHistoryPagechanged = function (pagenumber) {
            $scope.masterNutritionalHistoryPageNumber = pagenumber;
            getMasterNutritionalHistoryItems();
        };

        function getMasterNutritionalHistoryItems() {
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /* "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "NotesTypeId": 3,
                "HistoryId": 0,
                "PageSize": $scope.masterNutritionalHistoryPageSize,
                "PageNumber": $scope.masterNutritionalHistoryPageNumber,
                "SearchText": "",
                "IsFrequent": "N"
            };
            $scope.searchObj.NutritionHistory = $scope.searchObj.NutritionHistory || '';
            if ($scope.searchObj.NutritionHistory != '') {
                object.SearchText = $scope.searchObj.NutritionHistory;
                object.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterNutritionalHistory(object).success(function (response) {
                $scope.MasterNutritionalHistoryOrgArray = [];
                if (response.NutritionalHistory !== undefined) {
                    if (response.NutritionalHistory.length > 0) {
                        $scope.MasterNutritionalHistoryOrgArray = response.NutritionalHistory;
                        $scope.masterNutritionalHistoryItems = response.count;
                    }
                    if ($scope.MasterNutritionalHistoryOrgArray.length > 0) {
                        angular.forEach($scope.MasterNutritionalHistoryOrgArray, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentind = true;
                            }
                            else {
                                item.IsFrequentind = false;
                            }
                        });
                    }

                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterNutritionalHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterNutritionalHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterNutritionalHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }

        $scope.masterImmunisationHistoryPagechanged = function (pagenumber) {
            $scope.masterImmunisationHistoryPageNumber = pagenumber;
            getMasterImmunisationHistoryItems();
        };

        function getMasterImmunisationHistoryItems() {
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "NotesTypeId": 4,
                "HistoryId": 0,
                "PageSize": $scope.masterImmunisationHistoryPageSize,
                "PageNumber": $scope.masterImmunisationHistoryPageNumber,
                "SearchText": ""
            };
            eHnoteSettingsDataService.GetMasterImmunisationHistory(object).success(function (response) {
                $scope.MasterImmunisationHistoryOrgArray = [];
                if (response.ImmunisationHistory !== undefined) {
                    if (response.ImmunisationHistory.length > 0) {
                        $scope.MasterImmunisationHistoryOrgArray = response.ImmunisationHistory;
                        $scope.masterImmunisationHistoryItems = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterImmunisationHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterImmunisationHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterImmunisationHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }

        $scope.masterSurgicalHistoryPagechanged = function (pagenumber) {
            $scope.masterSurgicalHistoryPageNumber = pagenumber;
            getMasterSurgicalHistoryItems();
        };
        $scope.masterMenstrualHistoryPagechanged = function (pagenumber) {
            $scope.masterMenstrualHistoryPageNumber = pagenumber;
            getMasterMenstrualHistoryItems();
        };
        $scope.masterLifestyleHistoryPagechanged = function (pagenumber) {
            $scope.masterLifestyleHistoryPageNumber = pagenumber;
            getMasterLifestyleHistoryItems();
        };
        $scope.masterVaccinactionHistoryPagechanged = function (pagenumber) {
            $scope.masterVacinationPageNumber = pagenumber;
            getMasterVaccinactionItems();
        };
        $scope.masterSystamicPagechanged = function (pagenumber) {
            $scope.masterSystamicPageNumber = pagenumber;
            getMasterSystamicItems();
        };
        $scope.masterOcularHistoryPagechanged = function (pagenumber) {
            $scope.masterVacinationPageNumber = pagenumber;
            getMasterOcularItems();
        };
        $scope.masterFunctionalHistoryPagechanged = function (pagenumber) {
            $scope.masterFunctionalPageNumber = pagenumber;
            getMasterFunctionalItems();
        };

        $scope.masterOcularSurgicalHistoryPagechanged = function (pagenumber) {
            $scope.masterOcularSurgicalPageNumber = pagenumber;
            getMasterOcularSurgicalItems();
        };
        $scope.masterCurrentSystemicHistoryPagechanged = function (pagenumber) {
            $scope.masterCurrentSystemicPageNumber = pagenumber;
            getMasterCurrentSystemicItems();
        };
        $scope.masterAllergyPagechanged = function (pagenumber) {
            $scope.masterAllergyPageNumber = pagenumber;
            getMasterAllergyItems();
        };
        function getMasterSurgicalHistoryItems() {
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*"HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "NotesTypeId": 5,
                "HistoryId": 0,
                "PageSize": $scope.masterSurgicalHistoryPageSize,
                "PageNumber": $scope.masterSurgicalHistoryPageNumber,
                "SearchText": "",
                "IsFrequent": "N"
            };
            $scope.searchObj.SurgicalHistory = $scope.searchObj.SurgicalHistory || '';
            if ($scope.searchObj.SurgicalHistory != '') {
                object.SearchText = $scope.searchObj.SurgicalHistory;
                object.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterSurgicalHistory(object).success(function (response) {
                $scope.MasterSurgicalHistoryOrgArray = [];
                if (response.SurgicalHistory !== undefined) {
                    if (response.SurgicalHistory.length > 0) {
                        $scope.MasterSurgicalHistoryOrgArray = response.SurgicalHistory;
                        $scope.masterSurgicalHistoryItems = response.count;
                    }

                    if ($scope.MasterSurgicalHistoryOrgArray.length > 0) {
                        angular.forEach($scope.MasterSurgicalHistoryOrgArray, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentind = true;
                            }
                            else {
                                item.IsFrequentind = false;
                            }
                        });
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterSurgicalHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterSurgicalHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterSurgicalHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }


        function getMasterMenstrualHistoryItems() {
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*"HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "NotesTypeId": 5,
                "HistoryId": 0,
                "PageSize": 10,
                "PageNumber": $scope.masterMenstrualHistoryPageNumber || 1,
                "SearchText": "",
                "IsFrequent": "N"
            };
            $scope.searchObj.MenstrualHistory = $scope.searchObj.MenstrualHistory || '';
            if ($scope.searchObj.MenstrualHistory != '') {
                object.SearchText = $scope.searchObj.MenstrualHistory;
                object.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterMenstrualHistory(object).success(function (response) {
                $scope.MasterMenstrualHistoryOrgArray = [];
                if (response.MenstrualHistory !== undefined) {
                    if (response.MenstrualHistory.length > 0) {
                        $scope.MasterMenstrualHistoryOrgArray = response.MenstrualHistory;
                        $scope.masterMenstrualHistoryItems = response.count;
                    }
                    if ($scope.MasterMenstrualHistoryOrgArray.length > 0) {
                        angular.forEach($scope.MasterMenstrualHistoryOrgArray, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentind = true;
                            }
                            else {
                                item.IsFrequentind = false;
                            }
                        });
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterSurgicalHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterSurgicalHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterSurgicalHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }

        function getMasterLifestyleHistoryItems() {
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "NotesTypeId": 5,
                "HistoryId": 0,
                "PageSize": 10,
                "PageNumber": $scope.masterLifestyleHistoryPageNumber || 1,
                "SearchText": "",
                "IsFrequent": "N"
            };
            $scope.searchObj.LifestyleHistory = $scope.searchObj.LifestyleHistory || '';
            if ($scope.searchObj.LifestyleHistory != '') {
                object.SearchText = $scope.searchObj.LifestyleHistory;
                object.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterLifestyleHistory(object).success(function (response) {
                $scope.MasterLifestyleHistoryOrgArray = [];
                if (response.LifestyleHistory !== undefined) {
                    if (response.LifestyleHistory.length > 0) {
                        $scope.MasterLifestyleHistoryOrgArray = response.LifestyleHistory;
                        $scope.masterLifestyleHistoryItems = response.count;
                    }

                    if ($scope.MasterLifestyleHistoryOrgArray.length > 0) {
                        angular.forEach($scope.MasterLifestyleHistoryOrgArray, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentind = true;
                            }
                            else {
                                item.IsFrequentind = false;
                            }
                        });
                    }

                }
            }).error(function (error) {
                console.log(error);
            });
            //eHnoteSettingsDataService.GetGeneralHistoryNotes(object).success(function (response) {
            //    $scope.MasterSurgicalHistoryOrgArray = [];
            //    if (response.GeneralHistory !== undefined) {
            //        if (response.GeneralHistory.length > 0) {
            //            $scope.MasterSurgicalHistoryOrgArray = response.GeneralHistory;
            //            $scope.masterSurgicalHistoryItems = response.count;
            //        }
            //    }
            //}).error(function (error) {
            //    console.log(error);
            //});
        }


        function getMasterAllergyItems() {
            var req = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*    "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "AllergyType": 0,
                "PageSize": 10,
                "PageNumber": $scope.masterAllergyPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.MasterAllergy = $scope.searchObj.MasterAllergy || '';
            if ($scope.searchObj.MasterAllergy != '') {
                req.SearchText = $scope.searchObj.MasterAllergy;
                req.PageNumber = 1;
            }
            eHnoteConditionsDataService.getListOfAllergies(req).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    $scope.MasterAllergyOrgArray = resp.data.rows;
                    $scope.masterAllergyItems = resp.data.count;
                }
                if ($scope.MasterAllergyOrgArray.length > 0) {
                    angular.forEach($scope.MasterAllergyOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }
            })
        }

        $scope.showModifyMasterMedicalHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = true;
            $scope.masterMedicalGeneralHistoryId = 0;
            $scope.MedicalCategory = "";
            $scope.MedicalHistoryDesc = "";
        };

        $scope.CancelMasterMedicalHistoryClick = function () {
            $scope.masterMedicalGeneralHistoryId = 0;
            $scope.MedicalHistoryDesc = "";
            $scope.MedicalCategory = "";
            $scope.masterMedicalHistoryIsActive = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.masterMedicalHistoryBtnName = "Save";
            $scope.masterMedicalGeneralHistoryId = 0;
        };

        $scope.showModifyMasterBirthHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = true;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterBirthGeneralHistoryId = 0;
        };

        $scope.CancelMasterBirthHistoryClick = function () {
            $scope.masterGeneralHistoryId = 0;
            $scope.BirthHistoryDesc = "";
            $scope.masterBirthHistoryIsActive = false;
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.masterBirthHistoryBtnName = "Save";
            $scope.masterBirthGeneralHistoryId = 0;
            $scope.BirthHistoryObj.IsFrequent = false;
        };

        $scope.showModifyMasterFamilyHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = true;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterFamilyGeneralHistoryId = 0;
        };

        $scope.CancelMasterFamilyHistoryClick = function () {
            $scope.masterGeneralHistoryId = 0;
            $scope.FamilyHistoryDesc = "";
            $scope.masterFamilyHistoryIsActive = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.masterFamilyHistoryBtnName = "Save";
            $scope.masterFamilyGeneralHistoryId = 0;
            $scope.FamilyHistoryObj.IsFrequent = false;

        };

        $scope.showModifyMasterNutritionalHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = true;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterNutritionalGeneralHistoryId = 0;
        };

        $scope.CancelMasterNutritionalHistoryClick = function () {
            $scope.masterGeneralHistoryId = 0;
            $scope.NutritionalHistoryDesc = "";
            $scope.masterNutritionalHistoryIsActive = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.masterNutritionalHistoryBtnName = "Save";
            $scope.masterNutritionalGeneralHistoryId = 0;
            $scope.NutritionalHistoryObj.IsFrequent = false;
        };

        $scope.showModifyMasterImmunisationHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = true;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterImmunisationGeneralHistoryId = 0;
        };

        $scope.CancelMasterImmunisationHistoryClick = function () {
            $scope.masterGeneralHistoryId = 0;
            $scope.ImmunisationHistoryDesc = "";
            $scope.masterImmunisationHistoryIsActive = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.masterImmunisationHistoryBtnName = "Save";
            $scope.masterImmunisationGeneralHistoryId = 0;
        };

        $scope.showModifyMasterSurgicalHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = true;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.masterSurgicalGeneralHistoryId = 0;
            $scope.SurgicalObj.SurgicalHistoryDesc = "";
            $scope.SurgicalObj.CPTObj = "";
            $scope.SurgicalObj.AddNewSurgicalCPT = false;
        };

        $scope.CancelMasterSurgicalHistoryClick = function () {
            $scope.masterSurgicalGeneralHistoryId = 0;
            $scope.SurgicalObj.SurgicalHistoryDesc = "";
            $scope.masterSurgicalHistoryIsActive = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.masterSurgicalHistoryBtnName = "Save";
            $scope.SurgicalObj.AddNewSurgicalCPT = false;
            $scope.SurgicalHistoryObj.IsFrequent = false;

        };


        $scope.CancelMasterMenstrualHistoryClick = function () {
            $scope.masterMenstrualGeneralHistoryId = 0;
            $scope.MenstrualHistoryDesc = "";
            $scope.masterMenstrualHistoryIsActive = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.masterMenstrualHistoryBtnName = "Save";
            $scope.MenstrualHistoryObj.IsFrequent = false;
        }

        $scope.showModifyMasterMenstrualHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = true;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.masterSurgicalGeneralHistoryId = 0;
        };
        $scope.showModifyMasterLifestyleHistory = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = true;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterSurgicalGeneralHistoryId = 0;
        };
        $scope.CancelMasterLifestyleHistoryClick = function () {
            $scope.masterLifestyleGeneralHistoryId = 0;
            $scope.LifestyleHistoryDesc = "";
            $scope.masterLifestyleHistoryIsActive = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.masterLifestyleHistoryBtnName = "Save";
            $scope.LifestyleHistoryObj.IsFrequent = false;
        };
        $scope.showModifyMasterAllergy = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterAllergyDiv = true;
            $scope.masterAllergyId = 0;
            $scope.Allergyobj.AllergyAddNewSNOMED = false;
            $scope.Allergyobj.Snomed = "";

        };
        $scope.CancelMasterAllergyClick = function () {
            $scope.masterAllergyId = 0;
            $scope.AllergyDesc = "";
            $scope.masterAllergyIsActive = false;
            $scope.showModifyMasterAllergyDiv = false;
            $scope.masterAllergyBtnName = "Save";
            $scope.Allergyobj.Snomed = "";
            $scope.Allergyobj.IsFrequent = false;

        };
        $scope.showModifyMasterVaccinaction = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterVaccinactionDiv = true;
            $scope.showModifyMasterSystamicDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterVaccinactionId = 0;
        };
        $scope.showModifyMasterSystamic = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterVaccinactionDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterSystamicDiv = true;
            $scope.masterSystamicId = 0;
            $scope.SystamicObj.SystamicDescription = "";
            $scope.SystamicObj.ICD10CODE = "";
            $scope.SystamicObj.SNOMED = "";
            $scope.SystamicObj.AddNewSystamic = false;
            $scope.SystamicObj.SystamicAddNewSNOMED = false;
        };
        $scope.showModifyMasterOcular = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterVaccinactionDiv = false;
            $scope.showModifyMasterSystamicDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterOcularDiv = true;
            $scope.masterOcularId = 0;
            $scope.OcularObj.OcularDescription = "";
            $scope.OcularObj.ICD10CODE = "";
            $scope.OcularObj.SNOMED = "";
            $scope.OcularObj.AddNewOcular = false;
            $scope.OcularObj.OcularAddNewSNOMED = false;
        };

        $scope.showModifyMasterFunctional = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterVaccinactionDiv = false;
            $scope.showModifyMasterSystamicDiv = false;
            $scope.showModifyMasterOcularDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = true;
            $scope.masterFunctionalId = 0;
            $scope.FunctionalDescription = '';
        };

        $scope.showModifyMasterOcularSurgical = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterVaccinactionDiv = false;
            $scope.showModifyMasterSystamicDiv = false;
            $scope.showModifyMasterOcularDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterOcularSurgicalDiv = true;
            $scope.masterOcularSurgicalId = 0;
            $scope.OcularSurgObj.OcularSurgicalDescription = '';
            $scope.OcularSurgObj.CPTObj = "";
            $scope.OcularSurgObj.AddNewSurgHisCPT = false;
        };

        $scope.showModifyMasterCurrentSystemic = function () {
            $scope.showModifyMasterBirthHistoryDiv = false;
            $scope.showModifyMasterFamilyHistoryDiv = false;
            $scope.showModifyMasterNutritionalHistoryDiv = false;
            $scope.showModifyMasterImmunisationHistoryDiv = false;
            $scope.showModifyMasterSurgicalHistoryDiv = false;
            $scope.showModifyMasterMedicalHistoryDiv = false;
            $scope.showModifyMasterMenstrualHistoryDiv = false;
            $scope.showModifyMasterLifestyleHistoryDiv = false;
            $scope.showModifyMasterVaccinactionDiv = false;
            $scope.showModifyMasterSystamicDiv = false;
            $scope.showModifyMasterOcularDiv = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.showModifyMasterCurrentSystemicDiv = true;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.masterCurrentSystemicId = 0;
            $scope.CurrentSystemicDescription = '';
        };
        $scope.AddupdateMedicalHistory = function () {


            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateMedicalHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.MedicalCategory === "") {
                alertify.error("Select Medical History");
                return false;
            }
            if ($scope.MedicalHistoryDesc === "" || $scope.MedicalHistoryDesc === undefined) {
                alertify.error("Enter Medical History");
                return false;
            }
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterMedicalHistoryIsActive,
                "HistoryName": $scope.MedicalHistoryDesc,
                "HistoryId": $scope.masterMedicalGeneralHistoryId,
                "HistoryTypeId": $scope.MedicalCategory
            };

            eHnoteSettingsDataService.AddUpdateMasterMedicalHistory(object).success(function (response) {
                if (response.Status === "Success") {
                    if ($scope.masterMedicalGeneralHistoryId === 0) {
                        alertify.success("Medical History Added Successfully");
                    }
                    else {
                        if ($scope.masterMedicalHistoryIsActive) {
                            alertify.success("Medical History Deleted Successfully");
                        }
                        else {
                            alertify.success("Medical History Updated!");
                        }
                    }

                    $scope.CancelMasterMedicalHistoryClick();
                    getMasterMedicalHistoryItems();
                }

                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.MedicalHistoryDesc = "";
                    $scope.MedicalCategory = "";
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });

            //eHnoteSettingsDataService.AddUpdateGeneralHistory(object).success(function (response) {
            //    if (response.status === "Success") {
            //        alertify.success("Medical History Added Successfully");
            //        $scope.CancelMasterMedicalHistoryClick();
            //        getMasterMedicalHistoryItems();
            //    }

            //    if (response.status === 'Failure') {
            //        if (response.Message === 'GeneralHistory Already Exists') {
            //            alertify.error("Medical History already exist");
            //            $scope.MedicalHistoryDesc = "";
            //            $scope.MedicalCategory = "";
            //        }
            //    }
            //})
            //    .error(function (error) {
            //        alertify.error("Error Occured");
            //    });
        };

        $scope.BirthHistoryObj = {
            "IsFrequent": false
        }

        $scope.AddupdateBirthHistory = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateBirthHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.BirthHistoryDesc === "" || $scope.BirthHistoryDesc === undefined) {
                alertify.error("Please Enter Birth History");
                return false;
            }

            if ($scope.BirthHistoryObj.IsFrequent == true) {
                $scope.BirthHistoryObj.IsFrequent = "Y";
            } else if ($scope.BirthHistoryObj.IsFrequent == false) {
                $scope.BirthHistoryObj.IsFrequent = "N";
            }

            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*  "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterBirthHistoryIsActive,
                "HistoryName": $scope.BirthHistoryDesc,
                "HistoryId": $scope.masterBirthGeneralHistoryId,
                "IsFrequent": $scope.BirthHistoryObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterBirthHistory(object).success(function (response) {

                if (response.Status === "Success") {
                    if ($scope.masterBirthGeneralHistoryId === 0) {
                        alertify.success("Birth History Added Successfully");
                    }
                    else {
                        if ($scope.masterBirthHistoryIsActive) {
                            alertify.success("Birth History Deleted Successfully");
                        }
                        else {
                            alertify.success("Birth History Updated!");
                        }
                    }

                    $scope.CancelMasterBirthHistoryClick();
                    getMasterBirthHistoryItems();
                }

                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.BirthHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
            //eHnoteSettingsDataService.AddUpdateGeneralHistory(object).success(function (response) {
            //        if (response.status === "Success") {
            //            alertify.success("Birth History Added Successfully");
            //            $scope.CancelMasterBirthHistoryClick();
            //            getMasterBirthHistoryItems();
            //        }
            //        if (response.status === 'Failure') {
            //            if (response.Message === 'GeneralHistory Already Exists') {
            //                alertify.error("Birth History already exist");
            //                $scope.BirthHistoryDesc = "";
            //            }
            //        }
            //})
            //    .error(function (error) {
            //        alertify.error("Error Occured");
            //    });
        };

        $scope.FamilyHistoryObj = {
            "IsFrequent": false
        }


        $scope.AddupdateFamilyHistory = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateFamilyHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.FamilyHistoryDesc === "" || $scope.FamilyHistoryDesc === undefined) {
                alertify.error("Enter Family History");
                return false;
            }
            if ($scope.FamilyHistoryObj.IsFrequent == true) {
                $scope.FamilyHistoryObj.IsFrequent = "Y";
            } else if ($scope.FamilyHistoryObj.IsFrequent == false) {
                $scope.FamilyHistoryObj.IsFrequent = "N";
            }
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /* "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterFamilyHistoryIsActive,
                "HistoryName": $scope.FamilyHistoryDesc,
                "HistoryId": $scope.masterFamilyGeneralHistoryId,
                "IsFrequent": $scope.FamilyHistoryObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterFamilyHistory(object).success(function (response) {
                //if (response.Status === "Success") {
                //    alertify.success("Family History Added Successfully");
                //    $scope.CancelMasterFamilyHistoryClick();
                //    getMasterFamilyHistoryItems();
                //}
                if (response.Status === "Success") {
                    if ($scope.masterFamilyGeneralHistoryId === 0) {
                        alertify.success("Family History Added Successfully");
                    }
                    else {
                        if ($scope.masterFamilyHistoryIsActive) {
                            alertify.success("Family History Deleted Successfully");
                        }
                        else {
                            alertify.success("Family History Updated!");
                        }
                    }

                    $scope.CancelMasterFamilyHistoryClick();
                    getMasterFamilyHistoryItems();
                }
                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.FamilyHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
            //eHnoteSettingsDataService.AddUpdateGeneralHistory(object).success(function (response) {
            //    if (response.Status === "Success") {
            //        alertify.success("Family History Added Successfully");
            //        $scope.CancelMasterFamilyHistoryClick();
            //        getMasterFamilyHistoryItems();
            //    }

            //    if (response.Status === 'Failure') {
            //        if (response.Message === 'GeneralHistory Already Exists') {
            //            alertify.error("Family History already exist");
            //            $scope.FamilyHistoryDesc = "";
            //        }
            //    }
            //})
            //    .error(function (error) {
            //        alertify.error("Error Occured");
            //    });
        };



        $scope.NutritionalHistoryObj = {
            "IsFrequent": false
        }

        $scope.AddupdateNutritionalHistory = function () {
            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateNutritionHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if ($scope.NutritionalHistoryDesc === "" || $scope.NutritionalHistoryDesc === undefined) {
                alertify.error("Enter Nutritional History");
                return false;
            }
            if ($scope.NutritionalHistoryObj.IsFrequent == true) {
                $scope.NutritionalHistoryObj.IsFrequent = "Y";
            } else if ($scope.NutritionalHistoryObj.IsFrequent == false) {
                $scope.NutritionalHistoryObj.IsFrequent = "N";
            }
            object = {

                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*    "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterNutritionalHistoryIsActive,
                "HistoryName": $scope.NutritionalHistoryDesc,
                "HistoryId": $scope.masterNutritionalGeneralHistoryId,
                "IsFrequent": $scope.NutritionalHistoryObj.IsFrequent
            };

            eHnoteSettingsDataService.AddUpdateMasterNutritionalHistory(object).success(function (response) {
                //if (response.Status === "Success") {
                //    alertify.success("Nutritional History Added Successfully");
                //    $scope.CancelMasterNutritionalHistoryClick();
                //    getMasterNutritionalHistoryItems();
                //}
                if (response.Status === "Success") {
                    if ($scope.masterNutritionalGeneralHistoryId === 0) {
                        alertify.success("Nutritional History Added Successfully");
                    }
                    else {
                        if ($scope.masterNutritionalHistoryIsActive) {
                            alertify.success("Nutritional History Deleted Successfully");
                        }
                        else {
                            alertify.success("Nutritional History Updated!");
                        }
                    }

                    $scope.CancelMasterNutritionalHistoryClick();
                    getMasterNutritionalHistoryItems();
                }

                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.NutritionalHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.AddupdateImmunisationHistory = function () {
            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateImmunizationHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.ImmunisationHistoryDesc === "" || $scope.ImmunisationHistoryDesc === undefined) {
                alertify.error("Add ImmunisationHistory");
                return false;
            }
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterImmunisationHistoryIsActive,
                "HistoryName": $scope.ImmunisationHistoryDesc,
                "HistoryId": $scope.masterImmunisationGeneralHistoryId
            };

            eHnoteSettingsDataService.AddUpdateMasterImmunisationHistory(object).success(function (response) {
                //if (response.Status === "Success") {
                //    alertify.success("Immunisation History Added Successfully");
                //    $scope.CancelMasterImmunisationHistoryClick();
                //    getMasterImmunisationHistoryItems();
                //}
                if (response.Status === "Success") {
                    if ($scope.masterImmunisationGeneralHistoryId === 0) {
                        alertify.success("Immunisation History Added Successfully");
                    }
                    else {
                        if ($scope.masterImmunisationHistoryIsActive) {
                            alertify.success("Immunisation History Deleted Successfully");
                        }
                        else {
                            alertify.success("Immunisation History Updated Successfully");
                        }
                    }

                    $scope.CancelMasterImmunisationHistoryClick();
                    getMasterImmunisationHistoryItems();
                }
                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.ImmunisationHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.SurgicalObj = {
            "SurgicalHistoryDesc": "",
            "CPTObj": "",
            "CPTCode": "",
            "ProcedureId": "",
            "AddNewSurgicalCPT": false
        };


        $scope.SurgicalHistoryObj = {
            "IsFrequent": false
        }
        $scope.AddupdateSurgicalHistory = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateSurgicalHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.SurgicalObj.SurgicalHistoryDesc === "" || $scope.SurgicalObj.SurgicalHistoryDesc === undefined) {
                alertify.error("Enter Surgical History");
                return false;
            }
            if ($scope.SurgicalObj.CPTCode === "" || $scope.SurgicalObj.CPTCode === undefined) {
                alertify.error("Select CPT Code From List");
                return false;
            }
            if ($scope.SurgicalHistoryObj.IsFrequent == true) {
                $scope.SurgicalHistoryObj.IsFrequent = "Y";
            } else if ($scope.SurgicalHistoryObj.IsFrequent == false) {
                $scope.SurgicalHistoryObj.IsFrequent = "N";
            }


            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*      "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterSurgicalHistoryIsActive,
                "HistoryName": $scope.SurgicalObj.SurgicalHistoryDesc,
                "HistoryId": $scope.masterSurgicalGeneralHistoryId,
                "CPTCode": $scope.SurgicalObj.CPTCode,
                "ProcedureId": $scope.SurgicalObj.ProcedureId,
                "IsFrequent": $scope.SurgicalHistoryObj.IsFrequent

            };
            eHnoteSettingsDataService.AddUpdateMasterSurgicalHistory(object).success(function (response) {
                //if (response.Status === "Success") {
                //    alertify.success("Surgical History Added Successfully");
                //    $scope.CancelMasterSurgicalHistoryClick();
                //    getMasterSurgicalHistoryItems();
                //}
                if (response.Status === "Success") {
                    if ($scope.masterSurgicalGeneralHistoryId === 0) {
                        alertify.success("Surgical History Added Successfully");
                    }
                    else {
                        if ($scope.masterSurgicalHistoryIsActive) {
                            alertify.success("Surgical History Deleted Successfully");
                        }
                        else {
                            alertify.success("Surgical History Updated!");
                        }
                    }

                    $scope.CancelMasterSurgicalHistoryClick();
                    getMasterSurgicalHistoryItems();
                }
                if (response.Status === 'Failure') {

                    alertify.error(response.Message);
                    $scope.SurgicalObj.SurgicalHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.MenstrualHistoryObj = {
            " IsFrequent": false
        }
        $scope.AddupdateMenstrualHistory = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateMenstrualHistory) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.MenstrualHistoryDesc === "" || $scope.MenstrualHistoryDesc === undefined) {
                alertify.error("Enter Menstrual History");
                return false;
            }
            if ($scope.MenstrualHistoryObj.IsFrequent == true) {
                $scope.MenstrualHistoryObj.IsFrequent = "Y";
            } else if ($scope.MenstrualHistoryObj.IsFrequent == false) {
                $scope.MenstrualHistoryObj.IsFrequent = "N";
            }
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*  "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterMenstrualHistoryIsActive,
                "HistoryName": $scope.MenstrualHistoryDesc,
                "HistoryId": $scope.masterMenstrualGeneralHistoryId,
                "IsFrequent": $scope.MenstrualHistoryObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterMenstrualHistory(object).success(function (response) {
                //if (response.Status === "Success") {
                //    alertify.success("Surgical History Added Successfully");
                //    $scope.CancelMasterSurgicalHistoryClick();
                //    getMasterMenstrualHistoryItems();
                //}
                if (response.Status === "Success") {
                    if ($scope.masterMenstrualGeneralHistoryId === 0) {
                        alertify.success("Menstrual History Added Successfully");
                    }
                    else {
                        if ($scope.masterMenstrualHistoryIsActive) {
                            alertify.success("Menstrual History Deleted Successfully");
                        }
                        else {
                            alertify.success("Menstrual History Updated!");
                        }
                    }

                    $scope.CancelMasterMenstrualHistoryClick();
                    getMasterMenstrualHistoryItems();
                }
                if (response.Status === 'Failure') {

                    alertify.error(response.Message);
                    $scope.MenstrualHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.LifestyleHistoryObj = {
            "IsFrequent": false
        }
        $scope.AddupdateLifestyleHistory = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateLifeStyle) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.LifestyleHistoryDesc === "" || $scope.LifestyleHistoryDesc === undefined) {
                alertify.error("Enter Lifestyle History");
                return false;
            }

            if ($scope.LifestyleHistoryObj.IsFrequent == true) {
                $scope.LifestyleHistoryObj.IsFrequent = "Y";
            } else if ($scope.LifestyleHistoryObj.IsFrequent == false) {
                $scope.LifestyleHistoryObj.IsFrequent = "N";
            }
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterLifestyleHistoryIsActive,
                "HistoryName": $scope.LifestyleHistoryDesc,
                "HistoryId": $scope.masterLifestyleGeneralHistoryId,
                "IsFrequent": $scope.LifestyleHistoryObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterLifestyleHistory(object).success(function (response) {
                //if (response.Status === "Success") {
                //    alertify.success("Surgical History Added Successfully");
                //    $scope.CancelMasterSurgicalHistoryClick();
                //    getMasterMenstrualHistoryItems();
                //}
                if (response.Status === "Success") {
                    if ($scope.masterLifestyleGeneralHistoryId === 0) {
                        alertify.success("Lifestyle History Added Successfully");
                    }
                    else {
                        if ($scope.masterLifestyleHistoryIsActive) {
                            alertify.success("Lifestyle History Deleted Successfully");
                        }
                        else {
                            alertify.success("Lifestyle History Updated!");
                        }
                    }

                    $scope.CancelMasterLifestyleHistoryClick();
                    getMasterLifestyleHistoryItems();
                }
                if (response.Status === 'Failure') {

                    alertify.error(response.Message);
                    $scope.LifestyleHistoryDesc = "";

                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.Allergyobj = {
            "Snomed": "",
            "SnomedId": "",
            "ConceptId": "",
            "SnomedCodeId": "",
            "IsFrequent": false

        }



        $scope.AddupdateAllergy = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateAllergies) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.AllergyDesc === "" || $scope.AllergyDesc === undefined) {
                alertify.error("Enter Allergy");
                return false;
            }
            if ($scope.Allergyobj.IsFrequent == true) {
                $scope.Allergyobj.IsFrequent = "Y";
            } else if ($scope.Allergyobj.IsFrequent == false) {
                $scope.Allergyobj.IsFrequent = "N";
            }
            var reqObj = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*      "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "AllergyId": $scope.masterAllergyId,
                "AllergyName": $scope.AllergyDesc,
                "AllergyTypeId": 13,
                "Reaction": "",
                "DeleteInd": $scope.masterAllergyIsActive,
                "ModifiedBy": "",
                "ModifiedDt": "",
                "SNOMED": $scope.Allergyobj.ConceptId || $scope.Allergyobj.Snomed,
                "SNOMEDId": $scope.Allergyobj.SnomedCodeId || $scope.Allergyobj.SnomedId,
                "IsFrequent": $scope.Allergyobj.IsFrequent

            };
            eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterAllergyId === 0) {
                        alertify.success("Allergy Added Successfully");
                    }
                    else {
                        if ($scope.masterAllergyIsActive) {
                            alertify.success("Allergy Deleted Successfully");
                        }
                        else {
                            alertify.success("Allergy Updated!");
                        }
                    }

                    $scope.CancelMasterAllergyClick();
                    getMasterAllergyItems();
                    $scope.Allergyobj.Snomed = "";
                }
                if (response.data.Status === 'Failure') {

                    alertify.error(response.data.Message);
                    $scope.AllergyDesc = "";
                    $scope.Allergyobj.Snomed = "";

                }
            })



        };

        $scope.masterInstructionsPagechanged = function (pagenumber) {
            $scope.masterPatientInstructPageNumber = pagenumber;
            getMasterPatientInstructions();
        };

        function getMasterPatientInstructions() {
            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "GeneralNotesType": 14,
                "ScreenType": $scope.masterPatientInstructLevelType,
                "PageSize": $scope.masterPatientInstructPageSize,
                "PageNumber": $scope.masterPatientInstructPageNumber,
                "SearchText": ""
            };
            eHnoteSettingsDataService.GetGeneralNotes(object).success(function (response) {

                if ($scope.masterPatientInstructLevelType === 'O') {
                    $scope.MasterPatientInstructOrgArray = [];
                }

                if (response.GeneralNotes !== undefined) {
                    if (response.GeneralNotes.length > 0) {
                        if ($scope.masterPatientInstructLevelType === 'O') {
                            $scope.MasterPatientInstructOrgArray = response.GeneralNotes;
                        }
                        $scope.masterPatientInstructions = response.count;
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
        }

        $scope.AddupdatePatInstructions = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdatePatientInstructions) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.PatientInstruction === "" || $scope.PatientInstruction === undefined) {
                alertify.error("Add  Patient Instruction");
                return false;
            }

            object = {
                "HospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.masterPatientInstructIsActive,
                "ScreenType": $scope.masterPatientInstructLevelType,
                "GeneralNotesTypeId": 14,
                "GeneralNotes": $scope.PatientInstruction,
                "OrgGeneralNotesId": $scope.masterGeneralNotesId
            };
            eHnoteSettingsDataService.AddUpdateGeneralNotes(object).success(function (response) {
                if (response.status === 'Success') {
                    if ($scope.masterGeneralNotesId === undefined || $scope.masterGeneralNotesId === 0) {
                        addToCache('masterPatientInstructionArray', response.GeneralNotes[0]);
                        alertify.success("Patient Instructions Added Successfully");
                    }
                    $scope.CancelMasterPatientInstructClick();
                    getMasterPatientInstructions();
                }
                if (response.status === 'Failure') {
                    if (response.Message === 'Already Exists') {
                        alertify.error("Patient Instructions already exist");
                        $scope.PatientInstruction = "";
                    }
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };
        $scope.ChangeGeneralCost = function (masterProcedureObj) {
            masterProcedureObj.ProcedureCgsCost = 0;
            masterProcedureObj.ProcedureCgsValue = 0;
            masterProcedureObj.ProcedureSgsCost = 0;
            masterProcedureObj.ProcedureSgsValue = 0;
            masterProcedureObj.ProcedurePvtInsuranceCost = 0;
            masterProcedureObj.ProcedurePvtInsuranceValue = 0;
            masterProcedureObj.ProcedureMaxDiscountValue = 0;
            masterProcedureObj.ProcedureMaxDiscountCost = 0;
            masterProcedureObj.ProcedureMaxDiscountType = 'A';
        }
        $scope.ChangePackageGeneralCost = function (masterProcedureObj) {
            masterProcedureObj.CgsCost = 0;
            masterProcedureObj.CgsValue = 0;
            masterProcedureObj.SgsCost = 0;
            masterProcedureObj.SgsValue = 0;
            masterProcedureObj.PvtInsuranceCost = 0;
            masterProcedureObj.PvtInsuranceValue = 0;
            masterProcedureObj.ProcedureMaxDiscountValue = 0;
            masterProcedureObj.ProcedureMaxDiscountCost = 0;
            masterProcedureObj.ProcedureMaxDiscountType = 'A';
        };
        $scope.ChangeMaxDiscount = function (masterProcedureObj) {
            masterProcedureObj.ProcedureMaxDiscountValue = 0;
            masterProcedureObj.ProcedureMaxDiscountCost = 0;
        }
        $scope.referral = {
            "referralTitle": "",
            "referralDescription": "",
            "ReferralID": "",
            "MasterReferralSourceId": "",
            "MasterReferralSourceName": ""
        }
        $scope.EditClick = function (item) {
            $scope.referralFocus = true;
            $scope.addedReferralSource = true;
            $scope.referral.referralTitle = item.ReferralTitle;
            $scope.referral.referralDescription = item.ReferralDesc;
            $scope.referral.ReferralID = item.ReferralID;
            $scope.referral.referralSource = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": item.masterReferralSourceId }, true)[0];
            $scope.editReferral = true;
            $scope.SaveReferral = "Update";
        };
        $scope.RemoveClick = function (item) {
            if (item.ActiveIND === 'Y') {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to Inactivate this referral? ", function () {
                    var params = {
                        "DoctorID": doctorinfo.doctorid,
                        "USRType": "DOCTOR",
                        "ReferralDesc": "Referral Description",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "ActiveIND": "N",
                        "USRId": doctorinfo.doctorid,
                        "ReferralTitle": item.ReferralTitle,
                        "ReferralID": item.ReferralID,
                        "MasterReferralSourceId": item.MasterReferralSourceId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                    };

                    eHnoteOrgReferralDataServices.AddUpdateReferralServicesList(params, onDeleteSuccess, onDeleteFailed);
                    //if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    //    var hospid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;

                    //} else {
                    //    var hospid = undefined;
                    //    eHnoteOrgReferralDataServices.AddUpdateReferralServicesList(params, hospid, onDeleteSuccess, onDeleteFailed);
                    //}
                    function onDeleteSuccess(data) {
                        $scope.ReferralList = data[0].rows;
                        $scope.totalItems = data[0].count;
                        alertify.success('Deleted Successfully');
                        $scope.ReferralcurrentPage = 1;
                        $scope.RefferalSource();
                    }
                    function onDeleteFailed(data) {
                    }
                }, function () {
                    r = "You pressed Cancel!";
                });
            }
        };
        $scope.ReferralpageChanged = function (ReferralcurrentPage) {
            $scope.ReferralcurrentPage = ReferralcurrentPage;
            $scope.RefferalSource();
        }
        $scope.submitClick = function (referralform) {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddEditReferralSource) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if (!referralform.$valid) {
                return;
            } else {
                var params = "";
                if ($scope.editReferral) {
                    params = {
                        "DoctorID": doctorinfo.doctorid,
                        "USRType": "DOCTOR",
                        "ReferralDesc": "Referral Description",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "ActiveIND": "Y",
                        "USRId": doctorinfo.doctorid,
                        "ReferralTitle": $scope.referral.referralTitle,
                        "ReferralID": $scope.referral.ReferralID,
                        "MasterReferralSourceId": $scope.referral.referralSource.MasterReferralSourceId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                    };

                } else {
                    params = {
                        "DoctorID": doctorinfo.doctorid,
                        "USRType": "DOCTOR",
                        "ReferralDesc": "Referral Description",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "ActiveIND": "Y",
                        "USRId": doctorinfo.doctorid,
                        "ReferralTitle": $scope.referral.referralTitle,
                        "MasterReferralSourceId": $scope.referral.referralSource.MasterReferralSourceId,
                        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
                    };
                }

                eHnoteOrgReferralDataServices.AddUpdateReferralServicesList(params, onSuccess, onFailed);
                function onSuccess(data) {
                    if (data.status == "Failure") {
                        alertify.error("Referral Source already exist");
                        $scope.referral = {
                            "referralTitle": "",
                            "referralDescription": "",
                            "ReferralID": "",
                            "MasterReferralSourceId": "",
                            "MasterReferralSourceName": ""
                        }
                    } else {
                        $scope.ReferralList = data[0].rows;
                        $scope.totalItems = data[0].count;
                        if ($scope.referral.ReferralID == "") {
                            alertify.success("Referral Source Saved successfully");
                        } else {
                            alertify.success("Referral Source Updated successfully");
                            //$scope.ReferralID="";
                        }

                        $scope.SaveReferral = "Save";
                        $scope.referral = {
                            "referralTitle": "",
                            "referralDescription": "",
                            "ReferralID": "",
                            "MasterReferralSourceId": "",
                            "MasterReferralSourceName": ""
                        }
                        $scope.editReferral = false;
                        $scope.ReferralcurrentPage = 1;
                        $scope.RefferalSource();
                    }

                }
                function onFailed(data) {
                }
            }
        };

        $scope.EditMedicalHistory = function (item) {
            $scope.showModifyMasterMedicalHistoryDiv = true;
            $scope.MedicalCategory = item.HistoryTypeId;
            $scope.MedicalHistoryDesc = item.HistoryName;
            $scope.masterMedicalHistoryBtnName = "Update";
            $scope.masterMedicalGeneralHistoryId = item.HistoryId;

        };

        $scope.DeleteMedHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Medical History", function () {
                $scope.MedicalCategory = item.HistoryTypeId;
                $scope.MedicalHistoryDesc = item.HistoryName;
                $scope.masterMedicalGeneralHistoryId = item.HistoryId;
                $scope.masterMedicalHistoryIsActive = true;
                $scope.AddupdateMedicalHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        //Birth
        $scope.EditBirthHistory = function (item) {
            $scope.birthFocus = true;
            $scope.showModifyMasterBirthHistoryDiv = true;
            $scope.BirthHistoryDesc = item.HistoryName;
            $scope.masterBirthHistoryBtnName = "Update";
            $scope.masterBirthGeneralHistoryId = item.HistoryId;

            if (item.IsFrequent == "Y") {
                $scope.BirthHistoryObj.IsFrequent = true;
            } else {
                $scope.BirthHistoryObj.IsFrequent = false;
            }

        };

        $scope.DeleteBirthHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Birth History", function () {

                $scope.BirthHistoryDesc = item.HistoryName;
                $scope.masterBirthGeneralHistoryId = item.HistoryId;
                $scope.masterBirthHistoryIsActive = true;
                $scope.BirthHistoryObj.IsFrequent = false;
                $scope.AddupdateBirthHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        //Family 
        $scope.EditFamilyHistory = function (item) {
            $scope.familyFocus = true;
            $scope.showModifyMasterFamilyHistoryDiv = true;
            $scope.FamilyHistoryDesc = item.HistoryName;
            $scope.masterFamilyHistoryBtnName = "Update";
            $scope.masterFamilyGeneralHistoryId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.FamilyHistoryObj.IsFrequent = true;
            } else {
                $scope.FamilyHistoryObj.IsFrequent = false;
            }


        };

        $scope.DeleteFamilyHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Family History", function () {

                $scope.FamilyHistoryDesc = item.HistoryName;
                $scope.masterFamilyGeneralHistoryId = item.HistoryId;
                $scope.masterFamilyHistoryIsActive = true;
                $scope.FamilyHistoryObj.IsFrequent = false;
                $scope.AddupdateFamilyHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        //Nutritional
        $scope.EditNutritionalHistory = function (item) {
            $scope.nutritionalFocus = true;
            $scope.showModifyMasterNutritionalHistoryDiv = true;
            $scope.NutritionalHistoryDesc = item.HistoryName;
            $scope.masterNutritionalHistoryBtnName = "Update";
            $scope.masterNutritionalGeneralHistoryId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.NutritionalHistoryObj.IsFrequent = true;
            } else {
                $scope.NutritionalHistoryObj.IsFrequent = false;
            }

        };
        $scope.DeleteNutritionalHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Nutritional History", function () {

                $scope.NutritionalHistoryDesc = item.HistoryName;
                $scope.masterNutritionalGeneralHistoryId = item.HistoryId;
                $scope.masterNutritionalHistoryIsActive = true;
                $scope.NutritionalHistoryObj.IsFrequent = false;
                $scope.AddupdateNutritionalHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        //Immunisation
        $scope.EditImmunisationHistory = function (item) {
            $scope.showModifyMasterImmunisationHistoryDiv = true;
            $scope.ImmunisationHistoryDesc = item.HistoryName;
            $scope.masterImmunisationHistoryBtnName = "Update";
            $scope.masterImmunisationGeneralHistoryId = item.HistoryId;

        };
        $scope.DeleteImmunisationHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Immunisation History", function () {

                $scope.ImmunisationHistoryDesc = item.HistoryName;
                $scope.masterImmunisationGeneralHistoryId = item.HistoryId;
                $scope.masterImmunisationHistoryIsActive = true;
                $scope.AddupdateImmunisationHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };
        //Surgical
        $scope.EditSurgicalHistory = function (item) {
            $scope.surgicalFocus = true;
            $scope.showModifyMasterSurgicalHistoryDiv = true;
            $scope.SurgicalObj.SurgicalHistoryDesc = item.HistoryName;
            $scope.SurgicalObj.CPTCode = item.CPTCode;
            $scope.SurgicalObj.CPTObj = item.CPTCode;
            $scope.masterSurgicalHistoryBtnName = "Update";
            $scope.masterSurgicalGeneralHistoryId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.SurgicalHistoryObj.IsFrequent = true;
            } else {
                $scope.SurgicalHistoryObj.IsFrequent = false;
            }


        };
        $scope.DeleteSurgicalHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Surgical History", function () {

                $scope.SurgicalObj.SurgicalHistoryDesc = item.HistoryName;
                $scope.masterSurgicalGeneralHistoryId = item.HistoryId;
                $scope.masterSurgicalHistoryIsActive = true;
                $scope.SurgicalHistoryObj.IsFrequent = false;
                $scope.AddupdateSurgicalHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };
        //Menstrual
        $scope.EditMenstrualHistory = function (item) {
            $scope.mensturalFocus = true;
            $scope.showModifyMasterMenstrualHistoryDiv = true;
            $scope.MenstrualHistoryDesc = item.HistoryName;
            $scope.masterMenstrualHistoryBtnName = "Update";
            $scope.masterMenstrualGeneralHistoryId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.MenstrualHistoryObj.IsFrequent = true;
            } else {
                $scope.MenstrualHistoryObj.IsFrequent = false;
            }
        };
        $scope.DeleteMenstrualHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Surgical History", function () {

                $scope.MenstrualHistoryDesc = item.HistoryName;
                $scope.masterMenstrualGeneralHistoryId = item.HistoryId;
                $scope.masterMenstrualHistoryIsActive = true;
                $scope.MenstrualHistoryObj.IsFrequent = false;
                $scope.AddupdateMenstrualHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        //LifeStyle
        $scope.EditLifestyleHistory = function (item) {
            $scope.lifeStyleFocus = true;
            $scope.showModifyMasterLifestyleHistoryDiv = true;
            $scope.LifestyleHistoryDesc = item.HistoryName;
            $scope.masterLifestyleHistoryBtnName = "Update";
            $scope.masterLifestyleGeneralHistoryId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.LifestyleHistoryObj.IsFrequent = true;
            } else {
                $scope.LifestyleHistoryObj.IsFrequent = false;
            }

        };
        $scope.DeleteLifestyleHistory = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Lifestyle History", function () {

                $scope.LifestyleHistoryDesc = item.HistoryName;
                $scope.masterLifestyleGeneralHistoryId = item.HistoryId;
                $scope.masterLifestyleHistoryIsActive = true;
                $scope.LifestyleHistoryObj.IsFrequent = false;
                $scope.AddupdateLifestyleHistory();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.EditAllergy = function (item) {
            $scope.showModifyMasterAllergyDiv = true;
            $scope.AllergyDesc = item.AllergyName;
            $scope.masterAllergyBtnName = "Update";
            $scope.masterAllergyId = item.AllergyId;
            $scope.Allergyobj.Snomed = item.SNOMED;
            $scope.Allergyobj.SnomedId = item.SNOMEDId;
            if (item.IsFrequent == "Y") {
                $scope.Allergyobj.IsFrequent = true;
            } else {
                $scope.Allergyobj.IsFrequent = false;
            }
        };
        $scope.DeleteAllergy = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Allergy ", function () {

                $scope.AllergyDesc = item.AllergyName;
                $scope.masterAllergyId = item.AllergyId;
                $scope.masterAllergyIsActive = true;
                $scope.Allergyobj.IsFrequent = false;
                $scope.AddupdateAllergy();
            }, function () {
                r = "You pressed Cancel!";
            });
        };



        //PromoCode functionality code by Durga as on 24-06-2020

        $scope.masterPromoCodeObj = {
            "PromoCodeTypeId": "",
            "PromoCodeId": 0,
            "PromoCode": "",
            "PromoCodeDesc": "",
            "OfferValueType": "Amount",
            "OfferValue": "",
            "OfferStartDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "OfferExpiry": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "DeleteInd": "N",
            "ActiveInd": "Y",
            "ActiveStatus": true
        };

        $scope.PromoCodeSubmitObj = {
            "UserId": "",
            "HospitalId": "",
            "PromoCodeArray": []
        };

        $scope.tempPromoCodesArray = [];
        $scope.orgPromoCodesArray = [];

        $scope.clearmasterPromoCodeObj = function () {
            $scope.masterPromoCodeObj = {
                "PromoCodeTypeId": 0,
                "PromoCodeId": 0,
                "PromoCode": "",
                "PromoCodeDesc": "",
                "OfferValueType": "Amount",
                "OfferValue": "",
                "OfferStartDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                "OfferExpiry": $filter("date")(new Date(), "dd-MMM-yyyy"),
                "DeleteInd": "N",
                "ActiveInd": "Y",
                "ActiveStatus": true
            };
        }
        $scope.AddUpdatePromoCode = function () {


            console.log($scope.masterPromoCodeObj);

            if ($scope.masterPromoCodeObj.PromoCodeId === 0) {

                if ($scope.masterPromoCodeObj.PromoCode === "") {
                    alertify.error("enter promo code");
                    return false;
                }

                if ($scope.masterPromoCodeObj.OfferValue === "") {
                    alertify.error("enter promo code value");
                    return false;
                }


                $scope.tempPromoCodesArray.push($scope.masterPromoCodeObj);

            } else {
                var array1 = [];
                array1.push($scope.masterPromoCodeObj);
                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": parentHospitalId,
                    "PromoCodeArray": array1
                }


                console.log(JSON.stringify(params));
                //return false;

                eHnoteSettingsDataService.AddUpdatePromoCodes(params).success(function (response) {

                    console.log(JSON.stringify(response));
                    if (response.status === 'Success') {
                        alertify.success("PromoCodes Added Successfully");
                        $scope.tempPromoCodesArray = [];
                        $scope.getOrgPromoCodePageSize = 10;
                        $scope.getOrgPromoCodePageNumber = 1;
                        $scope.totalOrgPromoCodes = 0;
                        $scope.getOrgPromoCodes();
                    }

                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });

            }
            $scope.clearmasterPromoCodeObj();


        }
        $scope.deleteTempPromoCode = function (item, index) {
            $scope.tempPromoCodesArray.splice(index, 1);
        };


        $scope.savePromoCodes = function () {


            angular.forEach($scope.tempPromoCodesArray, function (item) {
                item.OfferExpiry = $filter('date')(new Date(item.OfferExpiry), "yyyy-MM-dd")
            });

            var params = {
                "UserId": $scope.UserId,
                "HospitalId": parentHospitalId,
                "PromoCodeArray": angular.copy($scope.tempPromoCodesArray)
            }


            console.log(JSON.stringify(params));
            //return false;

            eHnoteSettingsDataService.AddUpdatePromoCodes(params).success(function (response) {

                console.log(JSON.stringify(response));
                if (response.status === 'Success') {
                    alertify.success("PromoCodes Added Successfully");
                    $scope.tempPromoCodesArray = [];
                    $scope.getOrgPromoCodePageSize = 10;
                    $scope.getOrgPromoCodePageNumber = 1;
                    $scope.totalOrgPromoCodes = 0;
                    $scope.getOrgPromoCodes();
                }

            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });

        }

        $scope.ModifyPromoCode = function () {


            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdatePromoCodes) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.masterPromoCodeObj.PromoCodeTypeId === "") {
                alertify.error("Select Promo Code Type");
                return false;
            }

            if ($scope.masterPromoCodeObj.PromoCode === "") {
                alertify.error("Enter Promo Code");
                return false;
            }

            if ($scope.masterPromoCodeObj.OfferValue === "") {
                alertify.error("Enter Promo Code Value");
                return false;
            }

            var promoPercent = parseInt($scope.masterPromoCodeObj.OfferValue);

            if ($scope.masterPromoCodeObj.OfferValueType === 'Percent' && promoPercent > 100) {
                alertify.error("Enter Promo Code % Should be less than 100");
                return false;
            }


            var array1 = [];
            array1.push($scope.masterPromoCodeObj);
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": parentHospitalId,
                "PromoCodeArray": array1
            }


            console.log(JSON.stringify(params));
            //return false;

            eHnoteSettingsDataService.AddUpdatePromoCodes(params).success(function (response) {

                console.log(JSON.stringify(response));
                if (response.status === 'Success') {
                    if ($scope.masterPromoCodeObj.PromoCodeId === 0) {
                        alertify.success("PromoCodes Added Successfully");
                    } else {
                        alertify.success("PromoCodes Updated Successfully");
                    }

                    $scope.getOrgPromoCodePageSize = 10;
                    $scope.getOrgPromoCodePageNumber = 1;
                    $scope.totalOrgPromoCodes = 0;
                    $scope.getOrgPromoCodes();
                } else {
                    alertify.error(response.Message);
                }

            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
            $scope.clearmasterPromoCodeObj();
        }

        $scope.changePromoCodeDates = function (item) {

            var sdate = new Date(item.OfferStartDate);
            var edate = new Date(item.OfferExpiry);
            if (sdate > edate) {
                alertify.error("Start Date should not be greater than Expire Date");
                item.OfferStartDate = $filter("date")(new Date(), "dd-MMM-yyyy");
                item.OfferExpiry = $filter("date")(new Date(), "dd-MMM-yyyy");
                return false;
            }


        }


        $scope.getOrgPromoCodePageSize = 10;
        $scope.getOrgPromoCodePageNumber = 1;
        $scope.totalOrgPromoCodes = 0;
        $scope.getOrgpromoCodeSearchText = "";
        $scope.getOrgPromoCodes = function () {


            var params = {
                "HospitalId": parentHospitalId,
                "PageSize": $scope.getOrgPromoCodePageSize,
                "PageNumber": $scope.getOrgPromoCodePageNumber,
                "SearchText": $scope.getOrgpromoCodeSearchText,
                "IsValidPromoCodes": "All"
            }


            eHnoteSettingsDataService.getOrgPromoCodes(params).success(function (response) {

                console.log(JSON.stringify(response));
                if (response.status === 'Success') {
                    $scope.orgPromoCodesArray = angular.copy(response.Result);

                    $scope.totalOrgPromoCodes = response.Count;
                }

            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });

        }

        $scope.searchOrgPromoCode = function (val) {
            $scope.getOrgpromoCodeSearchText = val || "";
            $scope.getOrgPromoCodePageSize = 10;
            $scope.getOrgPromoCodePageNumber = 1;
            $scope.getOrgPromoCodes();
        }
        $scope.promocodesPagechanged = function (pagenumber) {
            $scope.getOrgPromoCodePageNumber = pagenumber;
            $scope.getOrgPromoCodes();
        };

        $scope.editOrgPromoCode = function (item) {
            $scope.promoCodesFocus = true;
            $scope.addedPromoCode = true;
            console.log(item);

            var params = {
                "PromoCodeId": item.PromoCodeId
            }

            eHnoteSettingsDataService.checkIfPromoCodeUsed(params).success(function (response) {

                console.log(JSON.stringify(response));
                if (response.IsPromoCodeUsed) {
                    alertify.error("You Cannot Edit this Promo Code,it has been Used in Billing.")
                } else {
                    $scope.masterPromoCodeObj = {
                        "PromoCodeTypeId": item.PromoCodeTypeId.toString(),
                        "PromoCodeId": item.PromoCodeId,
                        "PromoCode": item.PromoCode,
                        "PromoCodeDesc": item.PromoCodeDesc,
                        "OfferValueType": item.OfferValueType,
                        "OfferValue": item.OfferValue,
                        "OfferExpiry": $filter("date")(new Date(item.OfferExpiry), "dd-MMM-yyyy"),
                        "OfferStartDate": $filter("date")(new Date(item.OfferStartDate), "dd-MMM-yyyy"),
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                        "ActiveStatus": true
                    };

                }

            })
                .error(function (error) {
                    $scope.masterPromoCodeObj = {
                        "PromoCodeTypeId": item.PromoCodeTypeId,
                        "PromoCodeId": item.PromoCodeId,
                        "PromoCode": item.PromoCode,
                        "PromoCodeDesc": item.PromoCodeDesc,
                        "OfferValueType": item.OfferValueType,
                        "OfferValue": item.OfferValue,
                        "OfferExpiry": $filter("date")(new Date(item.OfferExpiry), "dd-MMM-yyyy"),
                        "OfferStartDate": $filter("date")(new Date(item.OfferStartDate), "dd-MMM-yyyy"),
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                        "ActiveStatus": true
                    };

                });





        }


        $scope.deleteOrgPromoCode = function (item) {


            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {


                item.DeleteInd = "Y";
                var array = [];
                array.push(item);
                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": parentHospitalId,
                    "PromoCodeArray": array
                }
                eHnoteSettingsDataService.AddUpdatePromoCodes(params).success(function (response) {

                    console.log(JSON.stringify(response));
                    if (response.status === 'Success') {
                        alertify.success("PromoCodes Deleted Successfully");
                        $scope.tempPromoCodesArray = [];
                        $scope.getOrgPromoCodePageSize = 10;
                        $scope.getOrgPromoCodePageNumber = 1;
                        $scope.totalOrgPromoCodes = 0;
                        $scope.getOrgPromoCodes();
                    }

                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });
            }, function () {
                return;
            });
        }

        $scope.changePStatus = function (item) {
            item.ActiveStatus = !item.ActiveStatus

            if (item.ActiveStatus) {
                item.ActiveInd = 'Y'
            } else {
                item.ActiveInd = 'N'
            }

            var array = [];
            array.push(item);
            var params = {
                "UserId": $scope.UserId,
                "HospitalId": parentHospitalId,
                "PromoCodeArray": array
            }
            eHnoteSettingsDataService.AddUpdatePromoCodes(params).success(function (response) {

                console.log(JSON.stringify(response));
                if (response.status === 'Success') {

                    if (item.ActiveStatus) {
                        alertify.success("PromoCode Activated Successfully");
                    } else {
                        alertify.success("PromoCode InActivated Successfully");
                    }

                    $scope.tempPromoCodesArray = [];
                    $scope.getOrgPromoCodePageSize = 10;
                    $scope.getOrgPromoCodePageNumber = 1;
                    $scope.totalOrgPromoCodes = 0;
                    $scope.getOrgPromoCodes();
                }

            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        }

        $scope.LabaddUpdateBtnName = "Add";
        //test code

        $scope.labTestActiveTab = function (menuno) {
            return (menuno === $scope.labActiveTab) ? "active" : "";
        };
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.labActiveTab = 1;
        $scope.LabTestPageNumber = 1;
        $scope.LabTestOrgPageSize = 10;
        $scope.LabsearchText = "";
        $scope.LabFilterBranch = 0;
        $scope.BranchLabListObj = $scope.AllUserBranchesList[0];

        $scope.switchLabTestTab = function (val) {
            $scope.labActiveTab = val;
            if ($scope.labActiveTab === 2) {
                $scope.GetOrgLabTest();
            } else {
                $scope.LabaddUpdateBtnName = "Add";
                $scope.LabtestObj = angular.copy($scope.getNewLabTestObj());

            }
        };



        $scope.showAddLabButton = false;


        $scope.getNewLabTestObj = function () {
            var obj = {
                "LabSpecialityId": 3,
                "LabGroupObj": "Others",
                "LabGroupName": "",
                "LabGroupId": "",
                "LabTestName": "",
                "LabTestId": 0,
                "LabTestObj": "",
                "OrgLabTestId": 0,
                "AttributeId": "1",
                "AttributeValuesCount": "2",
                "AttributeDetails": [
                    {
                        "FieldId": 1,
                        "FieldName": ""
                    },
                    {
                        "FieldId": 2,
                        "FieldName": ""
                    }
                ],
                "LabUnitId": 1,
                "SampleId": "",
                "SampleName": "",
                "DefaultValue": "",
                "LowerRange": "",
                "UpperRange": "",
                "NormalRangeValues": [{
                    "From": "",
                    "To": "",
                    "GenderId": "",
                    "PatientTypeId": "",
                    "Value": ""
                }],
                "Instructions": "",
                "HospitalId": 0,
                "AllHospitalsIndicator": 1,
                "UserId": $scope.UserId,
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "GeneralCost": "",
                "CgsCost": "",
                "CgsType": "true",
                "CgsValue": "",
                "SgsCost": "",
                "SgsType": "true",
                "SgsValue": "",
                "PvtInsuranceCost": "",
                "PvtInsuranceValue": "",
                "PvtInsType": "true",
                "ActiveInd": "Y",
                "Methods": [],
                "Technologies": [],
                "ProcedureMaxDiscountValue": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A'
            };
            return obj;
        };

        $scope.addNewRangeItem = function (mainitem) {
            var object = {
                "From": "",
                "To": "",
                "GenderId": "",
                "PatientTypeId": "",
                "Value": ""
            };
            mainitem.NormalRangeValues.push(object);
        };

        $scope.deleteNormalRangeItem = function (mainitem, index) {
            for (i = mainitem.NormalRangeValues.length - 1; i >= 0; --i) {
                if (i === index) {
                    mainitem.NormalRangeValues.splice(i, 1);
                }
            }
        };
        $scope.valuecdandFreChange = function (item, value) {
            console.log(item, value);
            $scope.newInvReqObject.IsFrequencyExist = false;
            $scope.newInvReqObject.IsCdRatioExist = false;
            if (item === true && value === 1) {
                $scope.newInvReqObject.IsFrequencyExist = true;
                $scope.newInvReqObject.IsCdRatioExist = false;
            }
            else if (item === true && value === 2) {
                $scope.newInvReqObject.IsCdRatioExist = true;
                $scope.newInvReqObject.IsFrequencyExist = false;
            }
        }
        $scope.clearAddLabTest = function () {
            $scope.LabaddUpdateBtnName = "Add";
            $scope.showAddLabButton = false;
            $scope.LabtestObj = angular.copy($scope.getNewLabTestObj());
            $scope.newInvReqObject = $scope.getNewInvReqObject();
        };
        $scope.LabtestObj = angular.copy($scope.getNewLabTestObj());

        $scope.GetSpeciality = function () {
            return eHnoteLabService.GetSpeciality();
        };

        $scope.LabGetUnits = function () {
            return eHnoteLabService.LabGetUnits();
        };
        $scope.LabGetSamples = function () {
            return eHnoteLabService.LabGetSamples();
        };

        $scope.LabGroupsChange = function (item) {
            item.LabGroupId = item.LabGroupObj.LabGroupId;
            item.LabGroupName = item.LabGroupObj.LabGroupName;
            $scope.LabtestObj.LabGroupObj = item.LabGroupObj.LabGroupName;
        };

        var mInstanceAdd;
        $scope.showAddNewLabGroupPopup = function () {
            // $scope.GrouplabSpecialityId = $scope.LabtestObj.LabSpecialityId;
            $scope.GrouplabSpecialityId = $scope.newInvReqObject.InvSpecialityId;
            //$scope.labGroupName = $scope.LabtestObj.LabGroupName;
            $scope.labGroupName = $scope.newInvReqObject.InvGroupName;
            mInstanceAdd = $uibModal.open({
                "templateUrl": "addLabgroup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "sm"
            });
        };

        $scope.CloseLabGroupPopup = function () {
            mInstanceAdd.dismiss("cancel");
        };
        $scope.AddNewLabGroup = function (GrouplabSpecialityId, labGroupName) {

            if (GrouplabSpecialityId === "") {
                alertify.error("Please Select Speciality");
                return false;
            }
            labGroupName = labGroupName || "";
            if (labGroupName === "") {
                alertify.error("Please Enter Group Name");
                return false;
            }
            var obj = {
                "LabSpecialityId": GrouplabSpecialityId,
                "LabTestGroupId": 0,
                "LabTestGroupName": labGroupName,
                "UserId": $scope.UserId
            };


            eHnoteLabService.AddNewLabGroup(obj).then(function (res) {
                if (res.data.Status === "success") {
                    $scope.LabtestObj.LabGroupId = res.data.LabTestGroupId;
                    $scope.LabtestObj.LabGroupObj = res.data.LabTestGroupName;

                    $scope.newInvReqObject.InvGroupObj = { "LabGroupId": res.data.LabTestGroupId, "LabGroupName": res.data.LabTestGroupName };
                    $scope.newInvReqObject.InvGroupName = res.data.LabTestGroupName;
                    $scope.newInvReqObject.InvGroupId = res.data.LabTestGroupId;

                    alertify.success("Added Sucessfully");
                    mInstanceAdd.dismiss("cancel");
                }
                else if (res.data.Status === "Failure") {
                    alertify.error("Group Name Is Already Exist!");
                }

            }, function (err) {
                console.log(err);
                alertify.error("AddingFailed");
            });
        };
        $scope.getallLabTestGroups = function (text, item) {

            var params = {
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": text,
                "LabSpecialityId": $scope.newInvReqObject.InvSpecialityId,
                "GetAllIndicator": 1
            };
            return eHnoteLabService.getallLabTestGroups(params, "Get").then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });
        };


        $scope.ChangeSpeciality = function (specialityId) {

            console.log(specialityId)
            if (specialityId === 3) {
                $scope.LabtestObj.LabGroupObj = "Others";
            } else {
                $scope.LabtestObj.LabGroupObj = "";
            }

        }

        $scope.onSelectLabGroup = function (item) {
            console.log(item);
        };

        $scope.changeLabGroupSearch = function (item) {
            item.LabGroupName = item.LabGroupObj;
            item.LabGroupId = 0;
        };

        $scope.changeAttributeVal = function (item) {
            var attrCount = item.AttributeValuesCount;
            attrCount = parseInt(attrCount);
            item.AttributeDetails = [];
            for (var i = 0; i < attrCount; i++) {
                var object = {
                    "FieldId": 1,
                    "FieldName": ""
                };
                item.AttributeDetails.push(object);
            }
        };

        //$scope.ChangeHospital = function (item) {
        //    $scope.LabtestObj.HospitalObj = item;
        //    $scope.newInvReqObject.HospitalObj = item;

        //    if (item.ClinicId === 0) {
        //        $scope.LabtestObj.AllHospitalsIndicator = 1;
        //        $scope.LabtestObj.HospitalId = parentHospitalId;
        //        $scope.newInvReqObject.HospitalId = parentHospitalId;
        //    } else {
        //        $scope.newInvReqObject.AllHospitalsIndicator = 0;
        //        $scope.LabtestObj.AllHospitalsIndicator = 0;
        //        $scope.LabtestObj.HospitalId = item.ClinicId;
        //        $scope.newInvReqObject.HospitalId = item.ClinicId;
        //    }

        //};

        $scope.changeCgsValue = function (item) {

            if (item.CgsValue === undefined) {
                item.CgsCost = 0;
            } else {
                if (parseInt(item.CgsValue) > parseInt(item.GeneralCost)) {
                    alertify.error("CGS value should not be greater than General cost");
                    item.CgsValue = "";
                    item.CgsCost = 0;
                    return false;
                }

                if (item.CgsType === 'true') {
                    item.CgsCost = item.GeneralCost - parseInt(item.CgsValue);
                } else {
                    item.CgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.CgsValue));
                }

            }

        };
        $scope.changeSgsValue = function (item) {


            if (item.SgsValue === undefined) {
                item.SgsCost = 0;
            } else {

                if (parseInt(item.SgsValue) > parseInt(item.GeneralCost)) {
                    alertify.error("SGS value should not be greater than General cost");
                    item.SgsValue = "";
                    item.SgsCost = 0;
                    return false;
                }
                if (item.SgsType === 'true') {
                    item.SgsCost = item.GeneralCost - parseInt(item.SgsValue);
                } else {
                    item.SgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.SgsValue));
                }
            }


        };
        $scope.changePvtInsValue = function (item) {


            if (item.PvtInsuranceValue === undefined) {
                item.PvtInsuranceCost = 0;
            } else {


                if (parseInt(item.PvtInsuranceValue) > parseInt(item.GeneralCost)) {
                    alertify.error("PI value should not be greater than General cost");
                    item.PvtInsuranceValue = "";
                    item.PvtInsuranceCost = 0;
                    return false;
                }
                if (item.PvtInsType === 'true') {
                    item.PvtInsuranceCost = item.GeneralCost - parseInt(item.PvtInsuranceValue);
                } else {
                    item.PvtInsuranceCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.PvtInsuranceValue));
                }
            }


        };

        $scope.addLabTest = function () {

            $scope.LabtestObj.LabSpecialityId = $scope.LabtestObj.LabSpecialityId || '';
            if ($scope.LabtestObj.LabSpecialityId === "") {
                alertify.error("Please Select Speciality");
                return false;
            }
            $scope.LabtestObj.LabGroupId = $scope.LabtestObj.LabGroupId || "";
            if ($scope.LabtestObj.LabGroupId === "") {
                alertify.error("Please Enter  Group");
                return false;
            }
            $scope.LabtestObj.LabTestName = $scope.LabtestObj.LabTestName || "";
            if ($scope.LabtestObj.LabTestName === "") {
                alertify.error("Please Enter  Lab Test Name");
                return false;
            }
            if ($scope.LabtestObj.HospitalId === 0) {
                $scope.LabtestObj.HospitalId = parentHospitalId;
            }

            //AddUpdateMasterProcedures
            eHnoteLabService.AddNewLabTest($scope.LabtestObj).success(function (response) {

                if (response.status === "Success") {
                    alertify.success("Added Sucessfully");
                    $scope.LabtestObj = angular.copy($scope.getNewLabTestObj());
                    $scope.labActiveTab = 2;
                    $scope.GetOrgLabTest();
                }
                else if (response.status === "Failure") {
                    alertify.error("LabTest Already Exists");
                }




            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };


        $scope.GetOrgLabTest = function () {

            var params = {
                "PageSize": $scope.LabTestOrgPageSize,
                "PageNumber": $scope.LabTestPageNumber,
                "SearchText": $scope.LabsearchText,
                "LabGroupId": "",
                "HospitalId": $scope.BranchLabListObj.ClinicId === 0 ? parentHospitalId : $scope.BranchLabListObj.ClinicId,
                "GetAllIndicator": $scope.BranchLabListObj.ClinicId === 0 ? 1 : 0
            };
            eHnoteLabService.GetOrgLabTest(params).success(function (response) {
                $scope.OrgLabTestArray = response.rows;
                $scope.OrgLabTestArrayCount = response.count;
            });
        };

        $scope.LabsearchValue = function (LabsearchText) {
            $scope.LabsearchText = LabsearchText;
            $scope.GetOrgLabTest();
        };

        $scope.changeLabFilterBranch = function (item) {
            $scope.BranchLabListObj = item;
            $scope.GetOrgLabTest();
        };


        $scope.editLabItem = function (item) {
            $scope.showAddLabButton = true;
            $scope.LabaddUpdateBtnName = "Update";
            $scope.labActiveTab = 1;
            $scope.LabtestObj = angular.copy($scope.getNewLabTestObj());
            if (item.ProcedureCgsCost === 0) {
                item.ProcedureCgsValue = 0;
            } else {
                var cgsValue = 0; cgsValue = item.ProcedureGeneralCost - item.ProcedureCgsCost; item.ProcedureCgsValue = cgsValue;
            }

            if (item.ProcedureSgsCost === 0) {
                item.ProcedureSgsValue = 0;
            } else {
                var sgsValue = 0; sgsValue = item.ProcedureGeneralCost - item.ProcedureSgsCost; item.ProcedureSgsValue = sgsValue;
            }

            if (item.ProcedurePvtInsuranceCost === 0) {
                item.ProcedurePvtInsuranceValue = 0;
            } else {
                var PiValue = 0; piValue = item.ProcedureGeneralCost - item.ProcedurePvtInsuranceCost; item.ProcedurePvtInsuranceValue = piValue;
            }
            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.HospitalId }, true);

            $scope.LabtestObj.LabSpecialityId = item.LabSpecialityId;
            $scope.LabtestObj.LabGroupId = item.LabGroupId;
            $scope.LabtestObj.LabGroupName = item.LabGroupName;
            $scope.LabtestObj.LabGroupObj = {
                "LabGroupObj": $scope.LabtestObj.LabGroupId,
                "LabGroupName": $scope.LabtestObj.LabGroupName
            };
            $scope.LabtestObj.LabTestName = item.LabTestName;
            $scope.LabtestObj.LabTestId = item.LabTestId;
            $scope.LabtestObj.OrgLabTestId = item.OrgLabTestId;
            $scope.LabtestObj.AttributeId = item.AttributeId.toString();
            $scope.LabtestObj.AttributeValuesCount = item.AttributeValuesCount;
            $scope.LabtestObj.AttributeDetails = item.AttributeDetails;
            $scope.LabtestObj.LabUnitId = item.LabUnitId;
            $scope.LabtestObj.DefaultValue = item.DefaultValue;
            $scope.LabtestObj.LowerRange = item.LowerRange;
            $scope.LabtestObj.UpperRange = item.UpperRange;
            $scope.LabtestObj.Instructions = item.Instructions;
            $scope.LabtestObj.SampleId = item.SampleId;
            $scope.LabtestObj.SampleName = item.SampleName;






            $scope.LabtestObj.HospitalId = item.HospitalId;
            $scope.LabtestObj.HospitalObj = SelectedItems[0];
            $scope.LabtestObj.GeneralCost = item.ProcedureGeneralCost;
            $scope.LabtestObj.CgsCost = item.ProcedureCgsCost;
            $scope.LabtestObj.SgsCost = item.ProcedureSgsCost;
            $scope.LabtestObj.PvtInsuranceCost = item.ProcedurePvtInsuranceCost;
            $scope.LabtestObj.CgsValue = item.ProcedureCgsValue;
            $scope.LabtestObj.SgsValue = item.ProcedureSgsValue;
            $scope.LabtestObj.PvtInsuranceValue = item.ProcedurePvtInsuranceValue;
            $scope.LabtestObj.ProcedureMaxDiscountValue = item.ProcedureMaxDiscountValue || 0;
            $scope.LabtestObj.ProcedureMaxDiscountCost = item.ProcedureMaxDiscountCost || 0;
            $scope.LabtestObj.ProcedureMaxDiscountType = item.ProcedureMaxDiscountType.trim() || 'A';

        };

        $scope.ChangeLabGeneralCost = function (masterProcedureObj) {
            masterProcedureObj.CgsCost = 0;
            masterProcedureObj.CgsValue = 0;
            masterProcedureObj.SgsCost = 0;
            masterProcedureObj.SgsValue = 0;
            masterProcedureObj.PvtInsuranceCost = 0;
            masterProcedureObj.PvtInsuranceValue = 0;
            masterProcedureObj.MaxDiscountValue = 0;
            masterProcedureObj.ProcedureMaxDiscountValue = 0;
            masterProcedureObj.ProcedureMaxDiscountCost = 0;
            masterProcedureObj.MaxDiscountType = 'A';
        }
        $scope.ChangeMaxDiscount = function (masterProcedureObj) {
            masterProcedureObj.ProcedureMaxDiscountValue = 0;
            masterProcedureObj.ProcedureMaxDiscountCost = 0;
        }

        $scope.InvestigationObj = {
            "showTemplateDiv": false
        }
        $scope.showTemplateDiv = false;

        $scope.getNewInvReqObject = function () {
            var obj = {
                "InvSpecialityId": 3,
                "InvGroupObj": "Others",
                "InvGroupName": "Others",
                "InvGroupId": 130,
                "OrgInvestigationId": 0,
                "InvestigationObj": "",
                "InvestigationId": 0,
                "InvestigationName": "",
                "InvestigationCode": "",
                "InvUnitId": 1,
                "IsTemplatesExist": false,
                "IsFrequencyExist": false,
                "IsCdRatioExist": false,
                "IsrightInvestigationEdit": false,
                "IsleftInvestigationEdit": false,
                "RightTemplateUrl": "",
                "LeftTemplateUrl": "",
                "Instructions": "",
                "HospitalId": parentHospitalId,
                "AllHospitalsIndicator": 1,
                "UserId": $scope.UserId,
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "GeneralCost": 0,
                "OrganId": '1',

                //"InvCostArray": [
                //    {

                //        "GeneralCost": "",
                //        "CgsCost": "",
                //        "CgsType": "true",
                //        "CgsValue": 0,
                //        "SgsCost": "",
                //        "SgsType": "true",
                //        "SgsValue": 0,
                //        "PvtInsuranceCost": "",
                //        "PvtInsuranceValue": 0,
                //        "PvtInsType": "true",
                //        "DeleteInd": "N"
                //    },

                //{
                //    "OrganId": 2,
                //    "OrganName": "Left Eye",
                //    "GeneralCost": "",
                //    "CgsCost": "",
                //    "CgsType": "true",
                //    "CgsValue": 0,
                //    "SgsCost": "",
                //    "SgsType": "true",
                //    "SgsValue": 0,
                //    "PvtInsuranceCost": "",
                //    "PvtInsuranceValue": 0,
                //    "PvtInsType": "true",
                //    "DeleteInd": "N"
                //},
                //{
                //    "OrganId": 3,
                //    "OrganName": "Both Eyes",
                //    "GeneralCost": "",
                //    "CgsCost": "",
                //    "CgsType": "true",
                //    "CgsValue": 0,
                //    "SgsCost": "",
                //    "SgsType": "true",
                //    "SgsValue": 0,
                //    "PvtInsuranceCost": "",
                //    "PvtInsuranceValue": 0,
                //    "PvtInsType": "true",
                //    "DeleteInd": "N"
                //}
                //  ],
                "AttributeId": 1,
                "AttributeValuesCount": 2,
                "AttributeDetails": [
                    {
                        "FieldId": 1,
                        "FieldName": ""
                    },
                    {
                        "FieldId": 2,
                        "FieldName": ""
                    }
                ],
                "SampleId": "",
                "SampleName": "",
                "DefaultValue": "",
                "LowerRange": "",
                "UpperRange": "",
                "NormalRangeValues": [{
                    "From": "",
                    "To": "",
                    "GenderId": "",
                    "PatientTypeId": "",
                    "Value": ""
                }],
                "DeleteInd": "N",
                "Methods": [],
                "Technologies": [],
                "MaxDiscountValue": 0,
                "MaxDiscountCost": 0,
                "MaxDiscountType": 'A',
                "CPTCode": ""
            };
            return obj;
        };


        $scope.getNewOrgInvObject = function () {
            var obj = {
                "InvSpecialityId": "",
                "HospitalId": 0,
                "GetAllSpecialityInd": 1,
                "GetAllIndicator": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": "",
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "CPTCodeSearchText": ""
            }
            return obj;
        };

        $scope.newInvReqObject = $scope.getNewInvReqObject();
        $scope.newGetOrgInvestigationsObj = $scope.getNewOrgInvObject();
        console.log($scope.newGetOrgInvestigationsObj);

        $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (item) {
            return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });
        $scope.BranchSurgeryListObj = $scope.defaultbranch[0];
        $scope.newGetOrgInvestigationsObj.HospitalObj = $scope.defaultbranch[0];
        $scope.newGetOrgInvestigationsObj.HospitalId = $scope.defaultbranch[0].ClinicId;
        $scope.newGetOrgInvestigationsObj.GetAllIndicator = 0;

        $scope.ChangeInvSpeciality = function (specialityId, newInvReqObject) {
            console.log(specialityId)

            if (newInvReqObject.InvSpecialityId !== 3) {
                newInvReqObject.InvGroupObj = "";
                newInvReqObject.InvGroupId = "";
                newInvReqObject.InvGroupName = "";
            } else {
                newInvReqObject.InvGroupObj = "Others";
                newInvReqObject.InvGroupName = "Others";
                newInvReqObject.InvGroupId = 130;
            }

            $scope.newInvReqObject.InvCostArray = [];
            if (specialityId === 3) {
                $scope.newInvReqObject.InvCostArray = [
                    //{
                    //    "OrganId": 1,
                    //    "OrganName": "Right Eye",
                    //    "GeneralCost": "",
                    //    "CgsCost": "",
                    //    "CgsType": "true",
                    //    "CgsValue": "",
                    //    "SgsCost": "",
                    //    "SgsType": "true",
                    //    "SgsValue": "",
                    //    "PvtInsuranceCost": "",
                    //    "PvtInsuranceValue": "",
                    //    "PvtInsType": "true",
                    //    "DeleteInd": "N"
                    //},
                    //{
                    //    "OrganId": 2,
                    //    "OrganName": "Left Eye",
                    //    "GeneralCost": "",
                    //    "CgsCost": "",
                    //    "CgsType": "true",
                    //    "CgsValue": "",
                    //    "SgsCost": "",
                    //    "SgsType": "true",
                    //    "SgsValue": "",
                    //    "PvtInsuranceCost": "",
                    //    "PvtInsuranceValue": "",
                    //    "PvtInsType": "true",
                    //    "DeleteInd": "N"
                    //},
                    //{
                    //    "OrganId": 3,
                    //    "OrganName": "Both Eyes",
                    //    "GeneralCost": "",
                    //    "CgsCost": "",
                    //    "CgsType": "true",
                    //    "CgsValue": "",
                    //    "SgsCost": "",
                    //    "SgsType": "true",
                    //    "SgsValue": "",
                    //    "PvtInsuranceCost": "",
                    //    "PvtInsuranceValue": "",
                    //    "PvtInsType": "true",
                    //    "DeleteInd": "N"
                    //}
                    {

                        "GeneralCost": "",
                        "CgsCost": "",
                        "CgsType": "true",
                        "CgsValue": "",
                        "SgsCost": "",
                        "SgsType": "true",
                        "SgsValue": "",
                        "PvtInsuranceCost": "",
                        "PvtInsuranceValue": "",
                        "PvtInsType": "true",
                        "DeleteInd": "N"
                    }
                ]
            } else {
                $scope.newInvReqObject.InvCostArray = [
                    {

                        "GeneralCost": "",
                        "CgsCost": "",
                        "CgsType": "true",
                        "CgsValue": "",
                        "SgsCost": "",
                        "SgsType": "true",
                        "SgsValue": "",
                        "PvtInsuranceCost": "",
                        "PvtInsuranceValue": "",
                        "PvtInsType": "true",
                        "DeleteInd": "N"
                    }
                ]
            }

        }

        $scope.templateFile = {
            "rightTemplateFile": "",
            "leftTemplateFile": ""
        };

        $scope.changesrightimg = function (item) {
            $scope.newInvReqObject.rightTemplateFile = item;
            $scope.newInvReqObject.RightTemplateUrl = "";
            $scope.newInvReqObject.IsrightInvestigationEdit = false;
        };
        $scope.changesleftimg = function (item) {
            $scope.newInvReqObject.leftTemplateFile = item;
            $scope.newInvReqObject.LeftTemplateUrl = "";
            $scope.newInvReqObject.IsleftInvestigationEdit = false;
        };

        $scope.addUpdateOrgInvestigation = function (Rightfile, LeftFile) {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateInvestigations) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if ($scope.newInvReqObject.InvGroupName === "") {
                alertify.error("Select Group Name");
                return false;
            }
            if ($scope.newInvReqObject.InvestigationName === "") {
                alertify.error("Enter Investigation Name");
                return false;
            }
            if ($scope.newInvReqObject.CPTCode === "" || $scope.newInvReqObject.CPTCode === undefined) {
                alertify.error("Enter CPT Code");
                return false;
            }

            if ($scope.newInvReqObject.GeneralCost === 0 || $scope.newInvReqObject.GeneralCost === "") {
                alertify.error("Enter  General Cost");
                return false;
            }

            var InvestigationName = "";
            var OrganId1 = "";
            var OrganId3 = "";
            if ($scope.newInvReqObject.InvestigationId == 0) {
                if ($scope.newInvReqObject.InvSpecialityId === 3) {
                    if ($scope.newInvReqObject.OrganId == 1) {
                        var a = $scope.newInvReqObject.InvestigationName.toString() + ' For One Eye';

                        $scope.newInvReqObject.InvestigationName = a;

                        console.log($scope.newInvReqObject.InvestigationName);
                    }
                    if ($scope.newInvReqObject.OrganId == 2) {
                        var b = $scope.newInvReqObject.InvestigationName.toString() + 'For Both Eye';
                        $scope.newInvReqObject.InvestigationName = b;
                        console.log($scope.newInvReqObject.InvestigationName);
                    }
                } else {
                    if ($scope.newInvReqObject.OrganId == 1) {
                        var a = $scope.newInvReqObject.InvestigationName.toString();

                        $scope.newInvReqObject.InvestigationName = a;
                    }
                    if ($scope.newInvReqObject.OrganId == 2) {
                        var b = $scope.newInvReqObject.InvestigationName.toString();
                        $scope.newInvReqObject.InvestigationName = b;
                    }
                }

            }




            if ($scope.newInvReqObject.OrgInvestigationId !== 0) {
                if ($scope.newInvReqObject.IsTemplatesExist === false) {
                    $scope.newInvReqObject.RightTemplateUrl = "";
                    $scope.newInvReqObject.LeftTemplateUrl = "";
                }
            }
            $scope.newInvReqObject.AllHospitalsIndicator = $scope.LabtestObj.AllHospitalsIndicator;
            $scope.newInvReqObject.InvCostArray = [];

            var fd = new FormData();
            var Rightfile = Rightfile || null;
            var LeftFile = LeftFile || null;
            if (Rightfile !== null) {
                var value = Rightfile.name;
                var values = value.split(".");
                var finalValue = "RightEye" + "." + values[1];
                fd.append("file", Rightfile, finalValue);
            }
            if (LeftFile !== null) {
                var value = LeftFile.name;
                var values = value.split(".");
                var finalValue = "LeftEye" + "." + values[1];
                fd.append("file", LeftFile, finalValue);
            }

            fd.append("model", angular.toJson($scope.newInvReqObject));

            eHnoteSettingsDataService.AddUpdateOrgInvestigationData(fd, callbacksuccess, callbackfailure);
            function callbacksuccess(resp) {
                console.log(resp);
                if (resp.status === 'Success') {
                    if (resp.rows.length !== 0) {

                        if ($scope.newInvReqObject.OrgInvestigationId === 0) {
                            alertify.success("Investigation Added Successfully");
                        } else {
                            alertify.success("Successfully Updated The Investigation");
                        }

                        $scope.newInvReqObject = $scope.getNewInvReqObject();
                        $scope.clearOrgInvSearch();


                        $scope.templateFile = {
                            "rightTemplateFile": "",
                            "leftTemplateFile": ""
                        }
                    }
                } else {
                    alertify.error(resp.Message);
                }
            }

            function callbackfailure(error) {
            }


        }

        $scope.changeInvCgsValue = function (item) {

            if (item.CgsValue === undefined) {
                item.ProcedureCgsCost = 0;
            } else {
                if (parseInt(item.CgsValue) > parseInt(item.GeneralCost)) {
                    alertify.error("CGS value should not be greater than General cost");
                    item.CgsValue = "";
                    item.CgsCost = 0;
                    return false;
                }

                if (item.CgsType === 'true') {
                    item.CgsCost = item.GeneralCost - parseInt(item.CgsValue);
                } else {
                    item.CgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.CgsValue));
                    item.CgsCost = Math.floor(item.CgsCost);
                }

            }

        };
        $scope.changeInvSgsValue = function (item) {


            if (item.SgsValue === undefined) {
                item.SgsCost = 0;
            } else {

                if (parseInt(item.SgsValue) > parseInt(item.GeneralCost)) {
                    alertify.error("SGS value should not be greater than General cost");
                    item.SgsValue = "";
                    item.SgsCost = 0;
                    return false;
                }
                if (item.SgsType === 'true') {
                    item.SgsCost = item.GeneralCost - parseInt(item.SgsValue);
                } else {
                    // item.SgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.SgsValue));
                    item.SgsCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.SgsValue));
                    item.SgsCost = Math.floor(item.SgsCost);
                }
            }


        };
        $scope.changeInvPvtInsValue = function (item) {


            if (item.PvtInsuranceValue === undefined) {
                item.PvtInsuranceCost = 0;
            } else {


                if (parseInt(item.PvtInsuranceValue) > parseInt(item.GeneralCost)) {
                    alertify.error("PI value should not be greater than General cost");
                    item.PvtInsuranceValue = "";
                    item.PvtInsuranceCost = 0;
                    return false;
                }
                if (item.PvtInsType === 'true') {
                    item.PvtInsuranceCost = item.GeneralCost - parseInt(item.PvtInsuranceValue);
                } else {
                    item.PvtInsuranceCost = item.GeneralCost - (item.GeneralCost / 100 * parseInt(item.PvtInsuranceValue));
                    item.PvtInsuranceCost = Math.floor(item.PvtInsuranceCost);
                }
            }


        };

        $scope.ChangeInvGeneralCost = function (obj) {
            obj.CgsCost = 0;
            obj.CgsValue = 0;
            obj.SgsCost = 0;
            obj.SgsValue = 0;
            obj.PvtInsuranceCost = 0;
            obj.PvtInsuranceValue = 0;

        }

        $scope.switchInvestigationTab = function (val) {
            $scope.labActiveTab = val;
            if ($scope.labActiveTab === 2) {
                $scope.getOrgInvestigationsData();
            } else {
                $scope.clearAddLabTest();
            }
        }

        $scope.OrgInvestigationsArray = [];
        $scope.OrgInvestigationArrayCount = 0;
        $scope.getOrgInvestigationsData = function () {

            var obj = {
                "PageSize": $scope.newGetOrgInvestigationsObj.PageSize,
                "PageNumber": $scope.newGetOrgInvestigationsObj.PageNumber,
                "SearchText": $scope.newGetOrgInvestigationsObj.SearchText,
                "InvSpecialityId": $scope.newGetOrgInvestigationsObj.InvSpecialityId,
                "HospitalId": $scope.newGetOrgInvestigationsObj.HospitalId,
                "GetAllIndicator": $scope.newGetOrgInvestigationsObj.GetAllIndicator,
                "GetAllSpecialityInd": $scope.newGetOrgInvestigationsObj.GetAllSpecialityInd,
                "SubOrganizationId": $scope.newGetOrgInvestigationsObj.SubOrganizationId,
                "CPTSearchText": $scope.newGetOrgInvestigationsObj.CPTCodeSearchText || ""
            }
            console.log($scope.newGetOrgInvestigationsObj);
            eHnoteLabService.getOrganizationInvestigationData(obj).success(function (response) {
                console.log(JSON.stringify(response));
                if (response.count > 0) {
                    $scope.OrgInvestigationsArray = response.rows;

                    angular.forEach($scope.OrgInvestigationsArray, function (item) {
                        item.RightTemplateUrl = item.RightTemplateUrl || "";
                        item.LeftTemplateUrl = item.LeftTemplateUrl || "";
                        angular.forEach(item.InvCostArray, function (citem) {
                            citem.PvtInsuranceCost = citem.PrivateInsuranceCost;
                        })
                    });
                    $scope.OrgInvestigationArrayCount = response.count;
                } else {
                    $scope.OrgInvestigationsArray = [];
                    $scope.OrgInvestigationArrayCount = 0;
                }
            });
        }


        $scope.changegetInvFilterBranch = function (item) {
            $scope.newGetOrgInvestigationsObj.HospitalObj = item;
            $scope.newGetOrgInvestigationsObj.HospitalId = item.ClinicId;
            $scope.newGetOrgInvestigationsObj.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            if (item.ClinicId !== 0) {
                $scope.newGetOrgInvestigationsObj.GetAllIndicator = 0;
            } else {
                $scope.newGetOrgInvestigationsObj.GetAllIndicator = 1;
                $scope.newGetOrgInvestigationsObj.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            }

        };

        $scope.searchOrgInvestigation = function () {
            $scope.newGetOrgInvestigationsObj.PageSize = 10;
            $scope.newGetOrgInvestigationsObj.PageNumber = 1;
            console.log($scope.newGetOrgInvestigationsObj)
            $scope.getOrgInvestigationsData();
        };

        $scope.clearOrgInvSearch = function () {
            $scope.newGetOrgInvestigationsObj = $scope.getNewOrgInvObject();
            $scope.newGetOrgInvestigationsObj.HospitalObj = $scope.defaultbranch[0];
            $scope.newGetOrgInvestigationsObj.HospitalId = $scope.defaultbranch[0].ClinicId;
            $scope.getOrgInvestigationsData();
        };



        $scope.getMasterInvestigations = function (text) {
            if ($scope.newInvReqObject.InvGroupName === "") {
                alertify.error("Select Group Name");
                return false;
            }
            text = text.toString();
            // return eHnoteSettingsDataService.GetMasterInvestigations(text, null).then(function (response) {
            return eHnoteSettingsDataService.SeacrhMasterInvestigations(text, $scope.newInvReqObject.InvGroupId, $scope.newInvReqObject.InvSpecialityId).then(function (response) {
                if (response.data.rows !== undefined) {
                    if (response.data.rows.length > 0) {
                        var Investigations = $filter("filter")(response.data.rows, function (item) {
                            return item.CategoryId !== 1 && item.CategoryId !== 2 &&
                                item.CategoryId !== 3 && item.CategoryId !== 4 &&
                                item.CategoryId !== 7;
                        }, true);
                        return Investigations;
                    }
                }
            });

        };
        $scope.SelectInvFromAutoComplete = function (SelectedInvestigationObj) {
            console.log(SelectedInvestigationObj);
            $scope.newInvReqObject.InvestigationName = SelectedInvestigationObj.InvestigationName;
            $scope.newInvReqObject.InvestigationId = SelectedInvestigationObj.InvestigationId;
        };


        $scope.editOrgInvestigation = function (item) {
            console.log(item);
            $scope.labActiveTab = 1;
            // $scope.newInvReqObject = angular.copy(item);
            $scope.newInvReqObject.OrgInvestigationId = item.OrgInvestigationId;
            $scope.newInvReqObject.HospitalObj.ClinicId = item.HospitalId;
            $scope.newInvReqObject.HospitalObj.ClinicName = item.HospitalName;

            $scope.newInvReqObject.InvestigationId = item.InvestigationId;
            $scope.newInvReqObject.InvestigationName = item.InvestigationName;
            $scope.newInvReqObject.InvSpecialityId = item.InvSpecialityId;
            $scope.newInvReqObject.InvSpecialityName = item.InvSpecialityName;
            $scope.newInvReqObject.InvestigationCode = item.InvestigationCode;


            $scope.newInvReqObject.InvGroupName = item.InvGroupName;
            $scope.newInvReqObject.InvGroupId = item.InvGroupId;
            $scope.newInvReqObject.InvGroupObj = item.InvGroupName;


            $scope.newInvReqObject.IsTemplatesExist = item.IsTemplatesExist;
            $scope.newInvReqObject.IsFrequencyExist = item.IsFrequencyExist;
            $scope.newInvReqObject.IsCdRatioExist = item.IsCdRatioExist;
            $scope.newInvReqObject.RightTemplateUrl = item.RightTemplateUrl;

            // $scope.templateFile.rightTemplateFile = item.RightTemplateUrl;
            //  $scope.templateFile.leftTemplateFile = item.LeftTemplateUrl;
            $scope.newInvReqObject.LeftTemplateUrl = item.LeftTemplateUrl;

            $scope.newInvReqObject.NormalRangeValues = item.NormalRangeValues;
            $scope.newInvReqObject.AttributeDetails = item.AttributeDetails;
            $scope.newInvReqObject.DeleteInd = item.DeleteInd;
            $scope.newInvReqObject.AllHospitalsIndicator = 0;
            if ($scope.newInvReqObject.RightTemplateUrl !== "") {
                $scope.newInvReqObject.IsrightInvestigationEdit = true;
            } else {
                $scope.newInvReqObject.IsrightInvestigationEdit = false;
            }
            if ($scope.newInvReqObject.LeftTemplateUrl !== "") {
                $scope.newInvReqObject.IsleftInvestigationEdit = true;
            }
            else {
                $scope.newInvReqObject.IsleftInvestigationEdit = false;
            }


            $scope.newInvReqObject.DeleteInd = 'N';
            $scope.newInvReqObject.GeneralCost = item.GeneralCost;
            $scope.newInvReqObject.OrganId = item.OrganId.toString();
            //$scope.newInvReqObject.OrganId = "N";


            angular.forEach(item.InvCostArray, function (citem) {
                if (citem.CgsCost === 0) {
                    citem.CgsValue = 0;
                } else {
                    var cgsValue = 0; cgsValue = (citem.GeneralCost - citem.CgsCost); citem.CgsValue = cgsValue;
                }

                if (citem.SgsCost === 0) {
                    citem.SgsValue = 0;
                } else {
                    var sgsValue = 0; sgsValue = (citem.GeneralCost - citem.SgsCost); citem.SgsValue = sgsValue;
                }

                if (citem.PvtInsuranceCost === 0) {
                    citem.PvtInsuranceValue = 0;
                } else {
                    var piValue = 0; piValue = (citem.GeneralCost - citem.PvtInsuranceCost); citem.PvtInsuranceValue = piValue;
                }
            });
            $scope.newInvReqObject.InvCostArray = item.InvCostArray;

            $scope.newInvReqObject.CPTCode = item.CPTCode;



        };
        $scope.DeleteOrgInvestigation = function (item, type) {
            r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this Investigation ?", function () {
                $scope.newInvReqObject.OrgInvestigationId = item.OrgInvestigationId;
                $scope.newInvReqObject.HospitalObj.ClinicId = item.HospitalId;
                $scope.newInvReqObject.HospitalObj.ClinicName = item.HospitalName;

                $scope.newInvReqObject.InvestigationId = item.InvestigationId;
                $scope.newInvReqObject.InvestigationName = item.InvestigationName;
                $scope.newInvReqObject.InvSpecialityId = item.InvSpecialityId;
                $scope.newInvReqObject.InvSpecialityName = item.InvSpecialityName;


                $scope.newInvReqObject.InvGroupName = item.InvGroupName;
                $scope.newInvReqObject.InvGroupId = item.InvGroupId;
                $scope.newInvReqObject.InvGroupObj = item.InvGroupName;


                $scope.newInvReqObject.NormalRangeValues = item.NormalRangeValues;
                $scope.newInvReqObject.AttributeDetails = item.AttributeDetails;
                $scope.newInvReqObject.DeleteInd = "Y";
                $scope.newInvReqObject.AllHospitalsIndicator = 0;



                $scope.newInvReqObject.InvCostArray = [];


                var fd = new FormData();
                var Rightfile = Rightfile || null;
                var LeftFile = LeftFile || null;
                if (Rightfile !== null) {
                    var value = Rightfile.name;
                    var values = value.split(".");
                    var finalValue = "RightEye" + "." + values[1];
                    fd.append("file", Rightfile, finalValue);
                }
                if (LeftFile !== null) {
                    var value = LeftFile.name;
                    var values = value.split(".");
                    var finalValue = "LeftEye" + "." + values[1];
                    fd.append("file", LeftFile, finalValue);
                }

                fd.append("model", angular.toJson($scope.newInvReqObject));

                console.log($scope.newInvReqObject);


                // eHnoteSettingsDataService.AddUpdateOrgInvestigationData(Rightfile, LeftFile, $scope.newInvReqObject, callbacksuccess, callbackfailure);
                eHnoteSettingsDataService.AddUpdateOrgInvestigationData(fd, callbacksuccess, callbackfailure);
                function callbacksuccess(resp) {
                    console.log(resp);
                    if (resp.status === "Success") {
                        alertify.success("Investigation Deleted Successfully.");
                        $scope.newInvReqObject = $scope.getNewInvReqObject();
                        $scope.getOrgInvestigationsData();
                        $scope.templateFile = {
                            "rightTemplateFile": "",
                            "leftTemplateFile": ""
                        }
                    } else {
                        alertify.error(resp.Message);
                    }
                }

                function callbackfailure(error) {
                }


            }, function () {
                r = "You pressed Cancel!";
            });








        };

        $scope.showInvImage = function (url) {

            console.log(url)
            var downloadDoc = url;
            if (downloadDoc !== undefined) {
                if (downloadDoc.indexOf("http:") > -1 || downloadDoc.indexOf("https:") > -1) {
                    $scope.arrayImgdoc = [];
                    $scope.arrayImgdoc.push({
                        "url": downloadDoc,
                        "thumbUrl": downloadDoc
                    });
                    Lightbox.openModal($scope.arrayImgdoc, 0);
                } else if (downloadDoc.indexOf("data:application/pdf;base64,") > -1) {
                    window.open(downloadDoc);
                }
            }
        };

        $scope.InvGroupsChange = function (item) {
            item.InvGroupId = item.InvGroupObj.LabGroupId;
            item.InvGroupName = item.InvGroupObj.LabGroupName;
        };

        $scope.changeInvGroupSearch = function (item) {
            item.InvGroupName = item.InvGroupObj;
            item.InvGroupId = 0;
        };
        $scope.GetRoomSearchObj = function () {
            return {

                "HospitalId": "",
                "RoomName": "",
                "RoomId": 0,
                "RoomAvailability": 0,
                "RoomCapacity": "",
                "RoomTypeId": 0,
                "HospitalObj": "",
                "DeleteInd": "N",
                "IsActive": "Y",
                "HospitalName": ""
            };
        };

        $scope.RoomSearchObj = angular.copy($scope.GetRoomSearchObj());
        $scope.obj = {
            "SearchText": "",
            "HospitalObj": "",
            "HospitalId": "",
            "RoomTypeId": 0
        }

        function getAssignRoomObj() {

            var obj = {
                "UserBranchRoomId": "",
                "HospitalId": "",
                "HospitalObj": "",
                "RoomTypeId": "",
                "RoomId": "",
                "DoctorId": 0,
                "DoctorObj": {
                    "FullName": "Select"
                },
                "UserId": $scope.UserId,
                "DeleteInd": "N",
                "ActiveInd": "Y",
                "IsDefaultRoom": false,
                "IsCurrentRoom": true
            };

            return obj;
        }

        $scope.addRoomForUserObj = getAssignRoomObj();


        function getAssignedRoomsListObj() {

            var obj = {
                "HospitalId": "",
                "HospitalObj": "",
                "RoomTypeId": 0,
                "RoomId": "",
                "DoctorId": 0,
                "DoctorObj": {
                    "FullName": "All Users"
                },
                "UserId": $scope.UserId,
                "DeleteInd": "N",
                "ActiveInd": "Y",
                "IsDefaultRoom": "N",
                "PageNumber": 1,
                "PageSize": 10,
                "TotalCount": ""
            };

            return obj;
        }

        $scope.getMainAssignedRoomsListObj = getAssignedRoomsListObj();

        $scope.initroom = function () {
            if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
                $scope.hospitalcd = "";
                $scope.hospid = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                $scope.parenthospId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                var brancList = localStorageFactory.getItem("allBranchesData") || [];
                OnGetDoctorSuccess1(brancList);
            }
            $scope.RoomTypeList = [];
            eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                //$scope.RoomTypeList = resp.data;
                $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 7 });
            }, function (err) {
                console.log(err);
                alertify.error("Getting ClaimTypes Failed");
            });
            // $scope.AllUserBranchesList1 = [];
        };


        function InitializeNewBranches1(data) {
            $scope.AllUserBranchesList1 = [];
            var branchesList = [];
            if (data.length !== 0) {
                var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, $scope.doctorinfo) || [];
                $scope.AllUserBranchesList1 = BrachesList;
                $scope.BranchesListArray = BrachesList;
                $scope.selectedBranch = $scope.BranchesListArray[0];

                $scope.clinicDoctorList = [];

                $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList1, function (item) {
                    return item.BranchId === $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;
                });

                $scope.selectedBranch = $scope.defaultbranch[0];

                $scope.RoomSearchObj.HospitalObj = $scope.defaultbranch[0];
                $scope.obj.HospitalObj = $scope.defaultbranch[0];
                $scope.obj.HospitalId = $scope.defaultbranch[0].BranchId;
                $scope.addRoomForUserObj.HospitalObj = $scope.defaultbranch[0];
                $scope.addRoomForUserObj.HospitalId = $scope.defaultbranch[0].BranchId;

                $scope.getMainAssignedRoomsListObj.HospitalObj = $scope.defaultbranch[0];
                $scope.getMainAssignedRoomsListObj.HospitalId = $scope.defaultbranch[0].BranchId;

                $scope.RoomSearchObj.HospitalId = $scope.defaultbranch[0].BranchId;

            }
        }
        function OnGetDoctorSuccess1(data) {
            InitializeNewBranches1(data);
        }
        $scope.tabRoomchange = function () {
            $scope.RoomSearchObj = angular.copy($scope.GetRoomSearchObj());
            $scope.initroom();
            $scope.GetWaitingRoomList();
        };

        $scope.searchHospital = {
            "txt1": "",
            "txt2": ""
        };
        $scope.ChangeHospitalDetails = function (item) {
            $scope.RoomSearchObj.HospitalObj = item;
            $scope.selectedBranch = item;
            $scope.RoomSearchObj.HospitalId = $scope.selectedBranch.BranchId;
        };

        $scope.RoomListPageNumber = 1;
        // $scope.initroom();
        $scope.RoomListarray = [];

        $scope.GetWaitingRoomList = function () {
            var params = {
                "HospitalId": $scope.obj.HospitalId,
                "RoomTypeId": $scope.obj.RoomTypeId,
                "SearchText": $scope.obj.SearchText,
                "PageNumber": $scope.RoomListPageNumber,
                "PageSize": 10
            }
            eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                if (data.Status === "Success") {
                    $scope.RoomListarray = data.rows || [];
                    $scope.RoomListarrayCount = data.count;
                } else {
                    $scope.RoomListarray = [];
                }


            }).error(function (error) {

            });
        }
        $scope.GetWaitingRoomList();

        $scope.RoomListPagechanged = function (pagenumber) {
            $scope.RoomListPageNumber = pagenumber;
            $scope.GetWaitingRoomList();
        };

        $scope.AssignedRoomListPagechanged = function (pagenumber) {
            $scope.getMainAssignedRoomsListObj.PageNumber = pagenumber;
            $scope.GetAllUsersAssignedRoomsList();
        };

        $scope.ChangeHospitalDetails1 = function (item) {
            $scope.obj.HospitalObj = item;
            $scope.selectedBranch1 = item;
            $scope.obj.HospitalId = $scope.selectedBranch1.BranchId;
            $scope.GetWaitingRoomList();
        };
        $scope.ChangeAssignedHospitalDetails = function (item) {
            $scope.getMainAssignedRoomsListObj.HospitalObj = item;

            $scope.getMainAssignedRoomsListObj.HospitalId = $scope.getMainAssignedRoomsListObj.BranchId;

        };


        $scope.Changeroom = function (item) {
            item.RoomTypeId = item.RoomTypeId || 0;
            $scope.obj.SearchText = "";
            $scope.obj.RoomTypeId = item.RoomTypeId;
            // $scope.GetWaitingRoomList();
        };

        $scope.SearchRoomCrieteria = function () {
            $scope.obj.SearchText = "";
            $scope.GetWaitingRoomList();
        };

        $scope.SearchAssignedRoomCrieteria = function () {

            $scope.GetAllUsersAssignedRoomsList();
        };

        $scope.ClearRoomCrieteria = function () {
            $scope.getMainAssignedRoomsListObj = getAssignedRoomsListObj();
            $scope.GetAllUsersAssignedRoomsList();
        };

        $scope.AddUpdateRoom = function () {


            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateWaitingRoooms) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }
            if ($scope.RoomSearchObj.HospitalId === "") {
                alertify.error("Select Branch");
                return false;
            }
            else if ($scope.RoomSearchObj.RoomName === "") {
                alertify.error("Enter Room Name");
                return false;
            }
            else if ($scope.RoomSearchObj.RoomCapacity === "" || $scope.RoomSearchObj.RoomCapacity === null) {
                alertify.error("Enter Room Capicity");
                return false;
            }

            else if ($scope.RoomSearchObj.RoomTypeId === 0 || $scope.RoomSearchObj.RoomTypeId === null) {
                alertify.error("Enter Room Type");
                return false;
            }
            var params = {
                "HospitalId": $scope.RoomSearchObj.HospitalId,
                "RoomName": $scope.RoomSearchObj.RoomName,
                "RoomId": $scope.RoomSearchObj.RoomId,
                "RoomCapacity": $scope.RoomSearchObj.RoomCapacity,
                "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                "DeleteInd": $scope.RoomSearchObj.DeleteInd,
                "RoomAvailability": $scope.RoomSearchObj.RoomAvailability,
                "UserId": $scope.UserId,
                "IsActive": $scope.RoomSearchObj.IsActive
            }

            eHnoteSettingsDataService.addUpdateWaitingRoom(params).success(function (data) {
                if (data.Status === "Success") {
                    alertify.success('Added Successfully');
                    $scope.GetWaitingRoomList();
                    $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (item) {
                        return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                    });
                    $scope.RoomSearchObj = {
                        "RoomName": "",
                        "RoomId": 0,
                        "RoomCapacity": 0,
                        "RoomAvailability": 0,
                        "RoomTypeId": 0,
                        "IsActive": "Y",
                        "DeleteInd": "N",
                        "HospitalObj": $scope.defaultbranch[0],
                        "HospitalId": $scope.defaultbranch[0].BranchId
                    }
                } else {
                    alertify.error('Room already exists');

                }

            }).error(function (error) {

            });
        }

        $scope.changeRoomStatus = function (item) {


            item.IsActiveStatus = !item.IsActiveStatus

            if (item.IsActiveStatus) {
                item.IsActive = 'Y'
            } else {
                item.IsActive = 'N'
            }
            var params = {
                "HospitalId": item.HospitalId,
                "RoomName": item.RoomName,
                "RoomId": item.RoomId,
                "RoomCapacity": item.RoomCapacity,
                "RoomTypeId": item.RoomTypeId,
                "DeleteInd": "N",
                "RoomAvailability": item.RoomAvailability,
                "UserId": $scope.UserId,
                "IsActive": item.IsActive
            }

            eHnoteSettingsDataService.addUpdateWaitingRoom(params).success(function (data) {
                if (data.Status === "Success") {
                    alertify.success('Updated Successfully');
                    $scope.GetWaitingRoomList();
                    $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (item) {
                        return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                    });
                    //$scope.RoomSearchObj = {
                    //    "RoomName": "",
                    //    "RoomId": 0,
                    //    "RoomCapacity": 0,
                    //    "RoomAvailability": 0,
                    //    "RoomTypeId": 0,
                    //    "ActiveInd": "Y",
                    //    "HospitalObj": $scope.defaultbranch[0],
                    //    "HospitalId": $scope.defaultbranch[0].BranchId
                    //}
                } else {
                    alertify.error('Room already exists');

                }

            }).error(function (error) {

            });
        }

        $scope.DeleteRoom = function (item) {
            var params = {
                "HospitalId": item.HospitalId,
                "RoomName": item.RoomName,
                "RoomId": item.RoomId,
                "RoomCapacity": item.RoomCapacity,
                "RoomTypeId": item.RoomTypeId,
                "DeleteInd": 'Y',
                "IsActive": item.IsActive,
                "UserId": $scope.UserId
            }

            eHnoteSettingsDataService.addUpdateWaitingRoom(params).success(function (data) {
                if (data.Status === "Success") {
                    alertify.success('Deleted Successfully');
                    $scope.GetWaitingRoomList();
                }

            }).error(function (error) {

            });
        }

        $scope.EditRoom = function (item) {
            console.log(item);
            $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity;
            $scope.RoomSearchObj.RoomId = item.RoomId;
            $scope.RoomSearchObj.RoomName = item.RoomName;
            $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability;
            $scope.RoomSearchObj.RoomTypeId = item.RoomTypeId;
            $scope.RoomSearchObj.HospitalId = item.HospitalId;
            $scope.RoomSearchObj.ActiveInd = 'Y';
            $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (Aitem) {
                return Aitem.ClinicId === item.HospitalId;
            });
            $scope.RoomSearchObj.HospitalObj = $scope.defaultbranch[0];
        };

        $scope.GetAllLensTypes = function () {
            eHnoteDiagnosisDataServices.GetAllTypesofLens(callbacksuccess, callbackerror);
            function callbacksuccess(data) {

                if (data !== undefined) {
                    if (data.ContactLensTypes.length > 0) {
                        $scope.LensTypeList = data.ContactLensTypes;
                    }
                }
            }
            function callbackerror(error) {
                console.log(error);
            }
        };
        $scope.ChangeLensType = function (item) {
            console.log(item);
            var List = "";

            List = $filter("filter")($scope.LensTypeList, { "Id": item }, true)[0];
            $scope.contactLensMainObject.ContactLensTypeId = List.Id;

        }

        $scope.ChangeLensHospital = function (item) {
            $scope.contactLensMainObject.HospitalObj = item;
            $scope.contactLensMainObject.HospitalId = item.ClinicId;
            if (item.ClinicId === 0) {
                $scope.contactLensMainObject.GetAllIndictaor = 1;
            } else {
                $scope.contactLensMainObject.GetAllIndictaor = 0;
            }

        };

        $scope.contactLensMainObject = getnewcontactlensobject();
        function getnewcontactlensobject() {
            object = {
                "ActiveInd": "Y",
                "GetAllIndictaor": 0,
                "HospitalId": 0,
                "HospitalObj": {
                    "ClinicName": "All Locations",
                    "ClinicId": 0
                },
                "ContactLensTypeId": 0,
                "OrgContactLensTypeCostId": 0,
                "ProcedureCgsCost": 0,
                "ProcedureCgsValue": 0,
                "ProcedureGeneralCost": 0,
                "ProcedureMaxDiscountCost": 0,
                "ProcedureMaxDiscountType": 'A',
                "ProcedureMaxDiscountValue": 0,
                "ProcedurePvtInsuranceCost": 0,
                "ProcedurePvtInsuranceValue": 0,
                "ProcedureSgsCost": 0,
                "ProcedureSgsValue": 0,
                "UserId": $scope.UserId
            };
            return object;
        }

        $scope.addNewContactLens = function () {
            if ($scope.contactLensMainObject.ContactLensTypeId === 0 || $scope.contactLensMainObject.ContactLensTypeId === "" || $scope.contactLensMainObject.ContactLensTypeId === undefined) {
                alertify.error("Please Select Contact Lens Type");
                return false;
            }
            $scope.contactLensMainObject.ProcedureGeneralCost = $scope.contactLensMainObject.ProcedureGeneralCost || 0;
            if ($scope.contactLensMainObject.ProcedureGeneralCost === 0) {
                alertify.error("Please Enter Cost");
                return false;
            }


            if ($scope.contactLensMainObject.HospitalId === 0) {
                $scope.contactLensMainObject.HospitalId = parentHospitalId;
            }
            eHnoteSettingsDataService.addNewContactLens($scope.contactLensMainObject, callbacksuccess, callbackerror);
            function callbacksuccess(resp) {
                if (resp.data.Status === "Failure") {
                    alertify.error("Contact lens Already Exists");
                } else {
                    alertify.success("Added Successfully");
                    $scope.resetContactLensObject();
                    $scope.getOrganizationContactLensList();
                }
            }
            function callbackerror(error) {

            }
        };


        $scope.getOrganizationContactLensList = function () {

            $scope.contactLensArray = [];
            $scope.contactLensArrayCount = 0;
            //parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            var params = { "HospitalId": $scope.orgHospitalID, "GetAllIndicator": $scope.GetAllIndicator, "ContactLensTypeId": 0 };

            //{
            //    "HospitalId": $scope.orgSurgeryOrganizationID,
            //    "AllBranchInd": $scope.surgeryOrgGetAllInd,
            //    "PageSize": $scope.surgeryOrgPageSize,
            //    //"PageSize":1000,
            //    "PageNumber": $scope.surgeryOrgPageNumber,
            //    "SearchText": $scope.surgeryOrgSearchText,
            //    "SurgerySpecializationId": $scope.OrgSurgerySpecializationId
            //};
            eHnoteSettingsDataService.GetOrgContactLensTypes(params, 'CallBack', callbackgetContactLenssuccess, callbackgetContactLenserror);


        };

        function callbackgetContactLenssuccess(resp) {

            if (resp.data.rows.length > 0) {
                $scope.contactLensArray = [];
                $scope.contactLensArray = angular.copy(resp.data.rows);
                $scope.contactLensArrayCount = resp.data.rows.Count;
            }
        }
        function callbackgetContactLenserror(error) {
            console.log(error);
        }

        $scope.changeContactLensBranch = function (item) {
            var HospitalId = 0;
            $scope.BranchContactListObj = item;
            if (item.ClinicId === 0) {
                $scope.GetAllIndicator = 1;
                $scope.orgHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            }
            else {
                $scope.GetAllIndicator = 0;
                $scope.orgHospitalID = item.ClinicId;
            }
            //var params = { "HospitalId": parentHospitalId, "GetAllIndicator": $scope.GetAllIndicator, "ContactLensTypeId": 0 };
            //eHnoteSettingsDataService.GetOrgContactLensTypes(params, 'CallBack', callbackgetContactLenssuccess, callbackgetContactLenserror);
            //$scope.HospitalId = HospitalId;
            //$scope.surgeryOrgPageNumber = 1;
            //$scope.surgeryOrgPageSize = 10;
            //$scope.surgeryOrgSearchText = "";
            //$scope.searchObj.ContactLenssearchText = "";
            $scope.getOrganizationContactLensList();
        };
        //$scope.contactLenssearchValue = function (text) {
        //    $scope.ContactLensOrgSearchText = text;
        //    $scope.GetAllIndicator = 1;
        //    $scope.surgeryOrgPageSize = 10;
        //    $scope.surgeryOrgPageNumber = 1;
        //    $scope.getOrganizationContactLensList();
        //};

        $scope.CancelAddContactLens = function () {
            $scope.resetContactLensObject();
        };
        $scope.resetContactLensObject = function () {
            $scope.contactLensAddUpdateBtnName = "Add";
            $scope.contactLensMainObject = getnewcontactlensobject();
        };

        $scope.editContactLensItem = function (item, type) {
            $scope.contactLensMainObject = getnewcontactlensobject();


            var SelectedItems = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.HospitalId }, true);
            var selectedContactLens = $filter("filter")($scope.LensTypeList, { "Id": item.ContactLensTypeId }, true);

            $scope.contactLensAddUpdateBtnName = "Update";
            $scope.contactLensMainObject.ContactLensTypeId = item.ContactLensTypeId;
            $scope.contactLensMainObject.HospitalObj = SelectedItems[0];
            $scope.contactLensMainObject.ProcedureMaxDiscountType = item.ProcedureMaxDiscountType.trim() || 'A';
            $scope.contactLensMainObject.ProcedureMaxDiscountValue = item.ProcedureMaxDiscountValue || 0;
            $scope.contactLensMainObject.ProcedureMaxDiscountCost = item.ProcedureMaxDiscountCost || 0;
            $scope.contactLensMainObject.OrgContactLensTypeCostId = item.OrgContactLensTypeCostId || 0;
            $scope.contactLensMainObject.HospitalId = item.HospitalId;
            $scope.contactLensMainObject.ProcedureGeneralCost = item.ProcedureGeneralCost;
            $window.scrollTo(0, angular.element('contactLensAddDiv').offsetTop);


            if (type === 'Delete') {
                $scope.contactLensMainObject.ActiveInd = 'N';
                $scope.updateContactLens();
            }
        };

        $scope.updateContactLens = function () {

            if ($scope.contactLensMainObject.ProcedureGeneralCost === "" || $scope.contactLensMainObject.ProcedureGeneralCost === undefined) {
                alertify.error("GenerelCost Should Not be Empty");
                return false;
            }
            if ($scope.contactLensMainObject.HospitalId === 0) {
                $scope.contactLensMainObject.HospitalId = parentHospitalId;
            }

            eHnoteSettingsDataService.updateContactLens($scope.contactLensMainObject, callbacksuccess, callbackerror);
            function callbacksuccess(resp) {

                alertify.success("Updated Successfully");
                $scope.resetContactLensObject();
                $scope.getOrganizationContactLensList();
            }
            function callbackerror(error) {

            }
        };
        $scope.deleteContactLensItem = function (item, type) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
                $scope.editContactLensItem(item, type);
            }, function () {
                r = "You pressed Cancel!";
            });

        };

        $scope.viewConsultationCharges = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/viewConsultationCharges.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "lg",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                    $scope.closeConsultationCharges = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }



        $scope.consultationFeeObj = {
            "BranchName": "",
            "BranchId": "",
            "BranchObj": "",
            "DoctorName": "",
            "DoctorId": 0,
            "Mode": "Add",
            "branchDoctorsArray": [],
            "userBranchesArray": [],
            "consultationFee": "",
            "teleConsultationFee": "",
            "followupFee": "",
            "fastTrackConsultationFee": "",
            "postSurgeryConsultationFee": ""
        };


        $scope.changeConsultationOrgFilterBranch = function (item) {

            $scope.masterconsultationProcedureObj.BranchObj = item;
            $scope.masterconsultationProcedureObj.BranchId = item.BranchId;
            $scope.masterconsultationProcedureObj.BranchName = item.BranchName;
            $scope.getBranchAppointmentTypes(item.BranchId);
            eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, item.BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });

                    console.log(item.BranchId);
                    var branchesList = [];
                    $scope.clinicDoctorList = [];
                    $scope.allUserList = [];
                    $scope.selectedDoctor = "";


                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                    var reqObj = {
                        "BranchId": item.BranchId,
                        "SubSpecializationIdArray": subSplArray
                    }


                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        console.log(resp);
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;

                            $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                            $scope.masterconsultationProcedureObj.branchDoctorsArray = [];



                            angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                                if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                                    Aitem.isChecked = false;
                                    $scope.masterconsultationProcedureObj.branchDoctorsArray.push(Aitem);
                                }

                            });
                            $scope.masterconsultationProcedureObj.branchDoctorsArray = _.uniq($scope.masterconsultationProcedureObj.branchDoctorsArray, false, function (p) { return p.DoctorID; });
                            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                            $scope.masterconsultationProcedureObj.branchDoctorsArray.unshift(docAll);

                            if ($scope.masterconsultationProcedureObj.Mode === 'Edit') {
                                angular.forEach($scope.masterconsultationProcedureObj.branchDoctorsArray, function (uitem) {
                                    if ($scope.masterconsultationProcedureObj.DoctorId === uitem.DoctorID) {
                                        uitem.isChecked = true;
                                    }
                                });
                            }



                        } else {
                            alertify.error("No Users Found in Selected Departments");
                            $scope.mainBookedAppointmentList = [];
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
        };


        $scope.toggoleDoctors = function (item) {

            if (item.DoctorID === 0) {
                if (item.isChecked) {
                    angular.forEach($scope.masterconsultationProcedureObj.branchDoctorsArray, function (subitem) {
                        subitem.isChecked = true;
                    });
                } else {
                    angular.forEach($scope.masterconsultationProcedureObj.branchDoctorsArray, function (subitem) {
                        subitem.isChecked = false;
                    });
                }
            }
            var checkedArray = _.where($scope.masterconsultationProcedureObj.branchDoctorsArray, { isChecked: true });
            console.log(checkedArray);

            if (checkedArray.length === 0) {
                $scope.masterconsultationProcedureObj.DoctorName = "Select Doctors";
            } else {
                $scope.masterconsultationProcedureObj.DoctorName = "Doctors Selected";
            }


        }


        $scope.clearUserBranchConsultationChagresObj = function () {
            $scope.consultationFeeObj = {
                "BranchName": "",
                "BranchId": "",
                "BranchObj": "",
                "DoctorName": "",
                "DoctorId": 0,
                "Mode": "Add",
                "branchDoctorsArray": [],
                "userBranchesArray": [],
                "consultationFee": "",
                "teleConsultationFee": "",
                "followupFee": "",
                "fastTrackConsultationFee": "",
                "postSurgeryConsultationFee": ""
            };
        };

        $scope.saveUserBranchConsultationCharges = function () {

            var feeDtlsArray = [];

            console.log($scope.consultationFeeObj);


            var checkedArray = _.where($scope.consultationFeeObj.branchDoctorsArray, { isChecked: true });
            console.log(checkedArray);

            if (checkedArray.length === 0) {
                alertify.error("Please Select Doctors");
                return false;
            }


            $scope.consultationFeeObj.consultationFee = $scope.consultationFeeObj.consultationFee || "";
            $scope.consultationFeeObj.teleConsultationFee = $scope.consultationFeeObj.teleConsultationFee || "";
            $scope.consultationFeeObj.followupFee = $scope.consultationFeeObj.followupFee || "";
            $scope.consultationFeeObj.postSurgeryConsultationFee = $scope.consultationFeeObj.postSurgeryConsultationFee || "";
            $scope.consultationFeeObj.fastTrackConsultationFee = $scope.consultationFeeObj.fastTrackConsultationFee || "";

            if ($scope.consultationFeeObj.consultationFee === "" && $scope.consultationFeeObj.teleConsultationFee === "" && $scope.consultationFeeObj.followupFee === "" && $scope.consultationFeeObj.postSurgeryConsultationFee === "" && $scope.consultationFeeObj.fastTrackConsultationFee === "") {
                alertify.error("Please Enter Any Consultation Fee");
                return false;
            }


            angular.forEach(checkedArray, function (item) {
                var obj = {
                    "BranchId": $scope.consultationFeeObj.BranchId,
                    "DoctorId": item.DoctorID,
                    "ConsultationFee": parseFloat($scope.consultationFeeObj.consultationFee) || 0,
                    "TeleConsultationFee": parseFloat($scope.consultationFeeObj.teleConsultationFee) || 0,
                    "FollowUpFee": parseFloat($scope.consultationFeeObj.followupFee) || 0,
                    "PostSurgeryConsultationFee": parseFloat($scope.consultationFeeObj.postSurgeryConsultationFee) || 0,
                    "FastTrackConsultationFee": parseFloat($scope.consultationFeeObj.fastTrackConsultationFee) || 0
                };
                feeDtlsArray.push(obj);
            });






            var params = { "UserId": $scope.UserId, "UserBranchFeeDtls": feeDtlsArray, "Mode": $scope.consultationFeeObj.Mode };




            eHnoteMainAppointmentService.addUpdateUserBranchConsulCharges(params, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                console.log(JSON.stringify(resp));

                $scope.consultationFeeObj = {
                    "BranchName": "",
                    "BranchId": "",
                    "BranchObj": "",
                    "DoctorName": "",
                    "DoctorId": 0,
                    "Mode": "Add",
                    "branchDoctorsArray": [],
                    "userBranchesArray": [],
                    "consultationFee": "",
                    "teleConsultationFee": "",
                    "followupFee": "",
                    "fastTrackConsultationFee": "",
                    "postSurgeryConsultationFee": ""
                };
                $scope.switchsurgeryTab(8);
            }

            function onGetUsersFailure(data) {
            }
        }


        $scope.userBranchCostingList = [];
        $scope.getUserBranchConslFeeObj = {
            "count": 0,
            "PageSize": 20,
            "PageNumber": 1,
            "BranchId": 3,
            "BranchObj": "",
            "DoctorId": 0,
            "DoctorSearchText": ""
        };

        $scope.getUserBranchConsultationFeeDetls = function () {

            var params = {
                "BranchId": $scope.getUserBranchConslFeeObj.BranchId,
                "DoctorId": $scope.getUserBranchConslFeeObj.DoctorId,
                "AppointmentTypeId": parseFloat($scope.getUserBranchConslFeeObj.AppointmentTypeId) || 0,
                "SearchText": $scope.getUserBranchConslFeeObj.DoctorSearchText,
                "CPTSearchText": "",
                "PageSize": $scope.getUserBranchConslFeeObj.PageSize,
                "PageNumber": $scope.getUserBranchConslFeeObj.PageNumber
            };

            eHnoteMainAppointmentService.getUserBranchConsulCharges(params, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                console.log(JSON.stringify(resp));
                $scope.userBranchCostingList = [];

                if (resp.status === "Success") {
                    if (resp.rows.length > 0) {
                        $scope.userBranchCostingList = resp.rows;
                        $scope.getUserBranchConslFeeObj.count = resp.count;
                    }
                }

            }

            function onGetUsersFailure(data) {
            }

        }


        $scope.userbranchConsultPageChanges = function (pagenumber) {
            $scope.getUserBranchConslFeeObj.PageNumber = pagenumber;
            $scope.getUserBranchConsultationFeeDetls();
        }

        $scope.changeGetUserBranchConsultationFeeDtls = function (text) {
            $scope.getUserBranchConslFeeObj.DoctorSearchText = text || "";
            $scope.getUserBranchConsultationFeeDetls();
        };

        $scope.editUserBranchCost = function (item) {
            console.log(item);

            $scope.consultationFeeObj = {
                "BranchName": item.BranchName,
                "BranchId": item.BranchId,
                "BranchObj": "",
                "DoctorName": "",
                "DoctorId": item.DoctorId,
                "Mode": "Update",
                "branchDoctorsArray": [],
                "userBranchesArray": [],
                "consultationFee": item.ConsultationFee,
                "teleConsultationFee": item.TeleConsultationFee,
                "followupFee": item.FollowUpFee,
                "fastTrackConsultationFee": item.FastTrackConsultationFee,
                "postSurgeryConsultationFee": item.PostSurgeryConsultationFee
            };

            $scope.userBranchesForConsultationFee = angular.copy($scope.AllUserBranchesList);
            angular.forEach($scope.userBranchesForConsultationFee, function (item, index) {
                if (item.ClinicId === 0) {
                    $scope.userBranchesForConsultationFee.splice(index, 1);
                }
            });

            angular.forEach($scope.userBranchesForConsultationFee, function (item, index) {
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID === item.ClinicId) {
                    $scope.consultationFeeObj.BranchObj = item;
                    $scope.changeConsultationOrgFilterBranch(item);
                }
            });

        }


        $scope.editUserBranchConsultationCharges = function (item) {
            console.log(item);
            $scope.masterconsultationProcedureObj = getconsultationProcedureObject();
            $scope.masterconsultationProcedureObj.Mode = "Edit";
            $scope.masterconsultationProcedureBtnName = "Update";
            $scope.masterconsultationProcedureObj.DoctorId = item.DoctorId;
            $scope.masterconsultationProcedureObj.DoctorName = "Doctor Selected";
            $scope.masterconsultationProcedureObj.AppointmentTypeId = item.AppointmentTypeId;
            $scope.masterconsultationProcedureObj.ConsultationProcedureName = item.ConsultationProcedureName;
            $scope.masterconsultationProcedureObj.BillingCode = item.BillingCode || "";
            $scope.masterconsultationProcedureObj.CPTCode = item.CPTCode || "";
            $scope.masterconsultationProcedureObj.ConsultationProcedureObj = item.ConsultationProcedureName;
            $scope.masterconsultationProcedureObj.ConsultationProcedureId = item.ConsultationProcedureId;
            $scope.masterconsultationProcedureObj.OrgConsultationProcedureId = item.OrgConsultationProcedureId;
            $scope.masterconsultationProcedureObj.PhysicalConsultationCost = item.PhysicalConsultationCost;
            $scope.masterconsultationProcedureObj.VideoConsultationCost = item.VideoConsultationCost;
            $scope.masterconsultationProcedureObj.FastTrackCharges = item.FastTrackCharges;
            $scope.masterconsultationProcedureObj.NoOfFreeFollowUps = item.NoOfFreeFollowUps;
            $scope.masterconsultationProcedureObj.FollowUpValidityDays = item.FollowUpValidityDays;
            $scope.masterconsultationProcedureObj.UserBranchConsultationProcedureId = item.UserBranchConsultationProcedureId;

            angular.forEach($scope.userBranchesForConsultationFee, function (sitem, index) {
                if (sitem.ClinicId === item.BranchId) {
                    $scope.masterconsultationProcedureObj.BranchId = sitem.ClinicId;
                    $scope.masterconsultationProcedureObj.BranchObj = sitem;
                    $scope.changeConsultationOrgFilterBranch(sitem);
                }
            });

        }

        $scope.deleteUserBranchConsultationCharges = function (item) {



            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {

                $scope.masterconsultationProcedureObj = getconsultationProcedureObject();
                $scope.masterconsultationProcedureObj.Mode = "Edit";
                $scope.masterconsultationProcedureBtnName = "Update";
                $scope.masterconsultationProcedureObj.DoctorId = item.DoctorId;
                $scope.masterconsultationProcedureObj.DoctorName = "Doctor Selected";
                $scope.masterconsultationProcedureObj.AppointmentTypeId = item.AppointmentTypeId;
                $scope.masterconsultationProcedureObj.ConsultationProcedureName = item.ConsultationProcedureName;
                $scope.masterconsultationProcedureObj.BillingCode = item.BillingCode || "";
                $scope.masterconsultationProcedureObj.ConsultationProcedureObj = item.ConsultationProcedureName;
                $scope.masterconsultationProcedureObj.ConsultationProcedureId = item.ConsultationProcedureId;
                $scope.masterconsultationProcedureObj.OrgConsultationProcedureId = item.OrgConsultationProcedureId;
                $scope.masterconsultationProcedureObj.PhysicalConsultationCost = item.PhysicalConsultationCost;
                $scope.masterconsultationProcedureObj.VideoConsultationCost = item.VideoConsultationCost;
                $scope.masterconsultationProcedureObj.FastTrackCharges = item.FastTrackCharges;
                $scope.masterconsultationProcedureObj.NoOfFreeFollowUps = item.NoOfFreeFollowUps;
                $scope.masterconsultationProcedureObj.FollowUpValidityDays = item.FollowUpValidityDays;
                $scope.masterconsultationProcedureObj.UserBranchConsultationProcedureId = item.UserBranchConsultationProcedureId;
                $scope.masterconsultationProcedureObj.BranchId = item.BranchId;




                var obj = {
                    "UserBranchConsultationProcedureId": $scope.masterconsultationProcedureObj.UserBranchConsultationProcedureId,
                    "DoctorId": item.DoctorID,
                    "AppointmentTypeId": $scope.masterconsultationProcedureObj.AppointmentTypeId,
                    "ConsultationProcedureName": $scope.masterconsultationProcedureObj.ConsultationProcedureName,
                    "ConsultationProcedureId": $scope.masterconsultationProcedureObj.ConsultationProcedureId,
                    "BranchId": $scope.masterconsultationProcedureObj.BranchId,
                    "OrgConsultationProcedureId": $scope.masterconsultationProcedureObj.OrgConsultationProcedureId,
                    "PhysicalConsultationCost": $scope.masterconsultationProcedureObj.PhysicalConsultationCost,
                    "VideoConsultationCost": $scope.masterconsultationProcedureObj.VideoConsultationCost,
                    "FastTrackCharges": $scope.masterconsultationProcedureObj.FastTrackCharges,
                    "NoOfFreeFollowUps": $scope.masterconsultationProcedureObj.NoOfFreeFollowUps,
                    "FollowUpValidityDays": $scope.masterconsultationProcedureObj.FollowUpValidityDays,
                    "DeleteInd": "Y",
                    "BillingCode": $scope.masterconsultationProcedureObj.BillingCode
                };
                $scope.masterconsultationProcedureObj.BranchDoctorConsultationDtls.push(obj);



                eHnoteMainAppointmentService.addUpdateUserBranchConsulCharges($scope.masterconsultationProcedureObj, onGetUsersSuccess, onGetUsersFailure);
                function onGetUsersSuccess(resp) {
                    console.log(JSON.stringify(resp));
                    if (resp.status === 'Success') {
                        alertify.success("Added Successfully");
                        $scope.masterconsultationProcedureBtnName = "Save";
                        $scope.switchsurgeryTab(8);
                    }

                    if (resp.status === 'Failure') {
                        alertify.error("Some Error Occured");
                    }


                }

                function onGetUsersFailure(data) {
                }
            }, function () {
                return;
            });





        };

        $scope.changeGETConsultationOrgFilterBranch = function (item) {
            $scope.getUserBranchConslFeeObj.BranchObj = item;
            $scope.getUserBranchConslFeeObj.BranchId = item.BranchId;
            $scope.getUserBranchConslFeeObj.BranchName = item.BranchName;
            $scope.getUserBranchConslFeeObj.DoctorSearchText = "";
            $scope.getUserBranchConslFeeObj.PageNumber = 1;
            $scope.getUserBranchConsultationFeeDetls();
        };






        $scope.masterconsultationProcedureBtnName = "Save";

        function getconsultationProcedureObject() {
            var obj = {
                "UserId": $scope.UserId,
                "AllDoctorsInd": true,
                "BranchId": 0,
                "BranchObj": "",
                "Mode": 'Add',
                "BillingCode": "",
                "CPTCode": "",
                "AppointmentTypeId": "",
                "DoctorName": "",
                "DoctorId": "",
                "ConsultationProcedureName": "",
                "ConsultationProcedureId": "",
                "OrgConsultationProcedureId": "",
                "PhysicalConsultationCost": "",
                "VideoConsultationCost": "",
                "FastTrackCharges": "",
                "NoOfFreeFollowUps": "",
                "FollowUpValidityDays": "",
                "branchDoctorsArray": [],
                "BranchDoctorConsultationDtls": []
            }

            return obj;
        }

        $scope.changeConsultationType = function () {
            $scope.masterconsultationProcedureObj.ConsultationProcedureObj = "";
            $scope.masterconsultationProcedureObj.ConsultationProcedureId = "";
            $scope.masterconsultationProcedureObj.OrgConsultationProcedureId = "";
        }

        $scope.addupdateUserBranchConsultationCharges = function (obj) {






            console.log($scope.masterconsultationProcedureObj);

            if ($scope.masterconsultationProcedureObj.AppointmentTypeId === "") {
                alertify.error("Please Select Appointment type");
                return false;
            }

            if ($scope.masterconsultationProcedureObj.ConsultationProcedureName === "") {
                alertify.error("Please Enter/Select Consultation Procedure");
                return false;
            }

            var checkedArray = _.where($scope.masterconsultationProcedureObj.branchDoctorsArray, { isChecked: true });
            console.log(checkedArray);

            if (checkedArray.length === 0) {
                alertify.error("Please Select Doctors");
                return false;
            }


            if ($scope.masterconsultationProcedureObj.CPTCode === '') {
                alertify.error("Please Select CPT Code");
                return false;
            }


            $scope.masterconsultationProcedureObj.PhysicalConsultationCost = $scope.masterconsultationProcedureObj.PhysicalConsultationCost || "";
            $scope.masterconsultationProcedureObj.VideoConsultationCost = $scope.masterconsultationProcedureObj.VideoConsultationCost || "";



            if ($scope.masterconsultationProcedureObj.PhysicalConsultationCost === "" && $scope.masterconsultationProcedureObj.teleConsultationFee === "") {
                alertify.error("Please Enter Any Consultation Fee");
                return false;
            }

            console.log($scope.masterconsultationProcedureObj.AppointmentTypeId);
            $scope.masterconsultationProcedureObj.BranchDoctorConsultationDtls = [];
            $scope.masterconsultationProcedureObj.branchDoctorsArray = [];

            angular.forEach(checkedArray, function (item) {
                if (item.DoctorID !== 0) {
                    var obj = {
                        "UserBranchConsultationProcedureId": $scope.masterconsultationProcedureObj.UserBranchConsultationProcedureId ? $scope.masterconsultationProcedureObj.UserBranchConsultationProcedureId : 0,
                        "DoctorId": item.DoctorID,
                        "AppointmentTypeId": $scope.masterconsultationProcedureObj.AppointmentTypeId,
                        "ConsultationProcedureName": $scope.masterconsultationProcedureObj.ConsultationProcedureName,
                        "ConsultationProcedureId": $scope.masterconsultationProcedureObj.ConsultationProcedureId,
                        "BranchId": $scope.masterconsultationProcedureObj.BranchId,
                        "OrgConsultationProcedureId": $scope.masterconsultationProcedureObj.OrgConsultationProcedureId,
                        "PhysicalConsultationCost": $scope.masterconsultationProcedureObj.PhysicalConsultationCost,
                        "VideoConsultationCost": $scope.masterconsultationProcedureObj.VideoConsultationCost,
                        "FastTrackCharges": $scope.masterconsultationProcedureObj.FastTrackCharges,
                        "NoOfFreeFollowUps": $scope.masterconsultationProcedureObj.NoOfFreeFollowUps,
                        "FollowUpValidityDays": $scope.masterconsultationProcedureObj.FollowUpValidityDays,
                        "DeleteInd": "N",
                        "BillingCode": $scope.masterconsultationProcedureObj.BillingCode,
                        "CPTCode": $scope.masterconsultationProcedureObj.CPTCode || ''
                    };
                    $scope.masterconsultationProcedureObj.BranchDoctorConsultationDtls.push(obj);
                }

            });




            eHnoteMainAppointmentService.addUpdateUserBranchConsulCharges($scope.masterconsultationProcedureObj, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                console.log(JSON.stringify(resp));
                if (resp.status === 'Success') {
                    alertify.success("Added Successfully");
                    $scope.masterconsultationProcedureBtnName = "Save";
                    $scope.switchsurgeryTab(8);
                }

                if (resp.status === 'Failure') {

                    $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                    $scope.masterconsultationProcedureObj.branchDoctorsArray = [];



                    angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57) {
                                Aitem.isChecked = false;
                                $scope.masterconsultationProcedureObj.branchDoctorsArray.push(Aitem);
                            }

                        });
                    });
                    $scope.masterconsultationProcedureObj.branchDoctorsArray = _.uniq($scope.masterconsultationProcedureObj.branchDoctorsArray, false, function (p) { return p.DoctorID; });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.masterconsultationProcedureObj.branchDoctorsArray.unshift(docAll);
                    alertify.error("Consultation Item Already Exists");
                }


            }

            function onGetUsersFailure(data) {
            }
        };

        $scope.btnCancelUserBranchConsultationCharges = function () {
            $scope.masterconsultationProcedureBtnName = "Add";
            $scope.userBranchesForConsultationFee = angular.copy($scope.AllUserBranchesList);
            angular.forEach($scope.userBranchesForConsultationFee, function (item, index) {
                if (item.ClinicId === 0) {
                    $scope.userBranchesForConsultationFee.splice(index, 1);
                }
            });
            angular.forEach($scope.userBranchesForConsultationFee, function (item, index) {
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID === item.ClinicId) {
                    $scope.consultationFeeObj.BranchObj = item;

                    $scope.masterconsultationProcedureObj = getconsultationProcedureObject();
                    $scope.masterconsultationProcedureObj.BranchId = item.ClinicId;
                    $scope.masterconsultationProcedureObj.BranchObj = item;
                    $scope.getBranchAppointmentTypes(item.ClinicId);
                    $scope.changeConsultationOrgFilterBranch(item);

                }
            });

        };


        $scope.searchMasterConsultationProceduresSearch = function (val) {
            if ($scope.masterconsultationProcedureObj.AppointmentTypeId === 0 || $scope.masterconsultationProcedureObj.AppointmentTypeId == "") {
                $scope.AppointmentTypeId = 0;
            }
            else {
                $scope.AppointmentTypeId = $scope.masterconsultationProcedureObj.AppointmentTypeId;
            }



            var object = { "DoctorId": 0, "BranchId": $scope.masterconsultationProcedureObj.BranchId, "SearchText": val, "PageNumber": 1, "PageSize": 10, "AppointmentTypeId": $scope.AppointmentTypeId };
            //var object = { "DoctorId": 0, "BranchId": $scope.masterconsultationProcedureObj.BranchId, "SearchText": val, "PageNumber": 1, "PageSize": 10, "AppointmentTypeId": 0 };
            return eHnoteMainAppointmentService.searchBranchConsultationCharges(object).then(function (response) {
                console.log(response);
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        item.Formattedname = item.ConsultationProcedureName + "-" + item.AppointmentTypeName;
                        return item;
                    });
                }
            });
        };

        $scope.changemasterConsultationProcedure = function (obj) {
            obj.ConsultationProcedureName = obj.ConsultationProcedureObj;
            obj.ConsultationProcedureId = 0;
            obj.OrgConsultationProcedureId = 0;
        };

        $scope.onConsultationProcedureSelect = function (obj) {
            obj.ConsultationProcedureName = obj.ConsultationProcedureObj.ConsultationProcedureName;
            obj.ConsultationProcedureId = obj.ConsultationProcedureObj.ConsultationProcedureId;
            obj.OrgConsultationProcedureId = obj.ConsultationProcedureObj.OrgConsultationProcedureId;
            obj.ConsultationProcedureObj = obj.ConsultationProcedureName;
        };

        $scope.changeTypeGetUserBranchCharges = function (obj) {
            $scope.getUserBranchConsultationFeeDetls();
        }

        $scope.ViewAddVisitApptType = function () {
            var modalInstance = $uibModal.open({
                "templateUrl": "AddVisitApptType.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "sm",
                "resolve": {
                    "ParentObject": {
                        "allBranches": $scope.userBranchesForConsultationFee,
                        "userId": $scope.UserId,
                        "selectedBranch": $scope.masterconsultationProcedureObj.BranchObj
                    }
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMainAppointmentService, ParentObject, alertify) {

                    $scope.allBranches = ParentObject.allBranches;
                    $scope.UserId = ParentObject.userId;
                    $scope.addNewBranchApptTypeObj = {
                        "UserId": $scope.UserId,
                        "BranchId": 0,
                        "BranchObj": "",
                        "BranchAppointmentTypeId": 0,
                        "AppointmentTypeId": 0,
                        "DeleteInd": "N",
                        "AppointmentTypeName": "",
                    }


                    $scope.addNewBranchApptTypeObj.BranchObj = ParentObject.selectedBranch;
                    $scope.addNewBranchApptTypeObj.BranchId = ParentObject.selectedBranch.BranchId;



                    $scope.closeAddVisitApptType = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.changeApptTypeBranch = function (item) {
                        $scope.addNewBranchApptTypeObj.BranchObj = item;
                        $scope.addNewBranchApptTypeObj.BranchId = item.BranchId;
                        $scope.addNewBranchApptTypeObj.BranchName = item.BranchName;
                    }

                    $scope.addUpdateBranchAppointmentTypes = function () {

                        if ($scope.addNewBranchApptTypeObj.AppointmentTypeName === '') {
                            alertify.error("Please Enter AppointmentType Name");
                            return false;
                        }

                        var params = $scope.addNewBranchApptTypeObj;

                        eHnoteMainAppointmentService.addUpdateBranchAppointmentTypes(params, onGetUsersSuccess, onGetUsersFailure);
                        function onGetUsersSuccess(resp) {
                            console.log(JSON.stringify(resp));
                            if (resp.status === 'Success') {
                                alertify.success("Added Successfully");
                                $uibModalInstance.close('save');
                            }
                            if (resp.status === 'Failure') {
                                alertify.error(resp.Message);
                            }
                        }

                        function onGetUsersFailure(data) {
                        }
                    }

                }
            });
            modalInstance.result.then(function (result) {
                console.log(result);
                $scope.getBranchAppointmentTypes($scope.masterconsultationProcedureObj.BranchId);

            }, function (cancel) {
            });
        }

        $scope.getBranchAppointmentTypes = function (hospitalId) {

            eHnoteMainAppointmentService.getBranchAppointmentTypes(hospitalId).then(function (resp) {
                console.log(resp);
                $scope.appointmentTypes = [];
                if (resp.data.rows != undefined) {
                    $scope.appointmentTypes = resp.data.rows;
                }
            });
        };


        $scope.addUpdateBranchAppointmentTypes = function () {


            var params = {
                "UserId": $scope.UserId
            };
            eHnoteMainAppointmentService.addUpdateBranchAppointmentTypes(params, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                console.log(JSON.stringify(resp));
                if (resp.status === 'Success') {

                }
            }

            function onGetUsersFailure(data) {
            }
        }

        $scope.ChangeDynamicStatus = function (val) {
            if (val === 1) {
                $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted = 1;
            }

        }

        /* $scope.services = ["OT", "OP", "IP", "Emergency"];*/


        //$scope.serviceArray = [
        //    { id: 1, serviceName: "OT" },
        //    { id: 2, serviceName: "OP" },
        //    { id: 3, serviceName: "IP" },
        //    { id: 4, serviceName: "Emergency" }
        //];
        //$scope.selectedServiceObj = {
        //    services: ""
        //};
        //$scope.redeemArray = [
        //    { id: 1, redeemName: "RedeemModule-4" },
        //    { id: 2, redeemName: "RedeemModule-5" },
        //    { id: 3, redeemName: "RedeemModule-6" },
        //    { id: 4, redeemName: "RedeemModule-7" }
        //];
        //$scope.selectedRedeemObj = {
        //    redeempoints: ""
        //}


        //$scope.focusselect = function () {
        //    $scope.$broadcast('UiSelectDemo1');
        //};
        /*-----------code for reward points template-------------*/


        //$scope.reward = {
        //    "UserId": "",
        //    "HospitalId": "",
        //    "OrganizationRewardPointId": 1,
        //    "CurrencyTypeId": "",
        //    "ModulesArray": [
        //        {
        //            "ModuleId": 1,
        //            "ModuleName": ""
        //        }
        //    ],
        //    "AmountSpent": "",
        //    "RewardPoints": "",
        //    "MinimumOrderAmount": "",
        //    "MaximumPointsPerOrder": ""
        //};




        //$scope.selectedRewardObj = {};
        //$scope.selectedRewardObj.rewardmodule = [{ "ModuleId": 1, "ModuleName": "" }];



        $scope.MasterRewardPoints = function () { /// declare the function
            eHnoteOrgRewardDataServices.GetMasterRewardSource().then(function (response) {
                console.log(response); // for check it is working or not 
                $scope.RewardSourcesMaster = response.data.rows; // this is the array to get the response
            });
        };
        $scope.MasterRewardPoints();    /// call the function

        $scope.RewardCurrencyType = function () {
            eHnoteOrgRewardDataServices.GetMasterCurrencySource().then(function (response) {
                $scope.RewardCurrencyMaster = response.data.rows;
            });
        };
        $scope.RewardCurrencyType();
        $scope.reward = {
            SpendAmount: "",
            MaximumPointerOrder: "",
            MinimumOrderAmount: "",
            ModulesArray: "",
            CurrencyType: "",
            RewardPoints: "",
            OrgRewardPointsId: 0
        };

        $scope.SaveRewardPoints = function () {
            if ($scope.reward.ModulesArray.length == 0) {
                alertify.error("Select ModuleName");
                return false;
            }
            if ($scope.reward.MinimumOrderAmount == '' || $scope.reward.MinimumOrderAmount == 0) {
                alertify.error("Enter Minimum Order Amount");
                return false;
            }
            if ($scope.reward.MaximumPointerOrder == '' || $scope.reward.MaximumPointerOrder == 0) {
                alertify.error("Enter Maximum Pointer Order");
                return false;
            }

            var params = {
                "UserId": $scope.doctorinfo.doctorid,
                "HospitalId": $scope.doctorinfo.hospitalID,
                "OrgRewardPointsId": $scope.reward.OrgRewardPointsId || 0,
                "ModulesArray": $scope.reward.ModulesArray,
                "CurrencyType": $scope.reward.CurrencyType,
                "SpendAmount": $scope.reward.SpendAmount,
                "RewardPoints": $scope.reward.RewardPoints,
                "MinimumOrderAmount": $scope.reward.MinimumOrderAmount,
                "MaximumPointsPerOrder": $scope.reward.MaximumPointerOrder
            };
            eHnoteOrgRewardDataServices.AddupdateOrgRewardSource(params).then(function (resp) {
                if (resp.data.status === "Sucess") {
                    alertify.success("Added Successfully");
                } else {
                    alertify.error(resp.data.Message);
                }
            });

        };

        $scope.MasterRewardPoints = function () {
            eHnoteOrgRewardDataServices.GetOrganizationRewards(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID).then(function (response) {
                console.log(response.data.rows);
                response.data.rows = response.data.rows || [];;
                $scope.RedeemPointMaster = response.data.rows;
                if (response.data.rows.length > 0) {
                    $scope.reward.SpendAmount = response.data.rows[0].SpendAmount;
                    $scope.reward.MaximumPointerOrder = response.data.rows[0].MaximumPointerOrder;
                    $scope.reward.MinimumOrderAmount = response.data.rows[0].MinimumOrderAmount;
                    $scope.reward.CurrencyType = response.data.rows[0].CurrencyType;
                    $scope.reward.ModulesArray = response.data.rows[0].ModulesArray;
                    $scope.reward.RewardPoints = response.data.rows[0].RewardPoints;
                    $scope.reward.OrgRewardPointsId = response.data.rows[0].OrgRewardPointsId || 0;
                }

            });
        };
        $scope.MasterRewardPoints();
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.redeems = {
            ModulesArray: "",
            CurrencyId: "",
            RedeeomPointsExpiryValueType: "",
            RedeemPointsExpiryValue: "",
            MinimumOrdertoRedeem: "",
            MinimumRedeemPointsPerOrder: "",
            Amountspent: "",
            MaximumRedeemPointsPerOrder: "",
            OrgRedeemPointsId: 0,
            RedeemPoints: ""
        };


        $scope.DaysType = [{ "Value": "D", "Name": "Days" },
        { "Value": "M", "Name": "Months" },
        { "Value": "Y", "Name": "Years" }];
        $scope.SaveRedeemPoints = function () {

            if ($scope.redeems.ModulesArray.length == 0) {
                alertify.error("Select ModuleName");
                return false;
            }
            $scope.redeems.MinimumOrdertoRedeem = $scope.redeems.MinimumOrdertoRedeem || 0;
            $scope.redeems.MaximumRedeemPointsPerOrder = $scope.redeems.MaximumRedeemPointsPerOrder || 0;
            $scope.redeems.MinimumRedeemPointsPerOrder = $scope.redeems.MinimumRedeemPointsPerOrder || 0;
            if ($scope.redeems.MinimumOrdertoRedeem == 0) {
                alertify.error("Enter Minimum Order to Redeem");
                return false;
            }
            if ($scope.redeems.MinimumRedeemPointsPerOrder == 0) {
                alertify.error("Enter Minimum Redeem PointsPerOrder");
                return false;
            }
            if ($scope.redeems.MaximumRedeemPointsPerOrder == 0) {
                alertify.error("Enter Maximum Redeem PointsPerOrder");
                return false;
            }
            if ($scope.redeems.RedeemPointsExpiryValue == '') {
                alertify.error("Enter Redeem Points Expiry Value");
                return false;
            }
            if ($scope.redeems.RedeeomPointsExpiryValueType == '') {
                alertify.error("Enter Redeeom Points Expiry ValueType");
                return false;
            }

            var params = {
                "UserId": $scope.doctorinfo.doctorid,
                "HospitalId": $scope.doctorinfo.hospitalID,
                "OrgRedeemPointsId": $scope.redeems.OrgRedeemPointsId || 0,
                "RedeemPointsTypeId": 1,
                "CurrencyTypeId": $scope.redeems.CurrencyId,
                "ModuleId": 1,
                "ModulesArray": $scope.redeems.ModulesArray,
                "RedeemPoints": $scope.redeems.RedeemPoints,
                "SpendAmount": $scope.redeems.Amountspent,
                "MinimumOrdertoRedeem": $scope.redeems.MinimumOrdertoRedeem,
                "MaximumRedeemPointsPerOrder": $scope.redeems.MaximumRedeemPointsPerOrder,
                "MinimumRedeemPointsOrder": $scope.redeems.MinimumRedeemPointsPerOrder,
                "RedeemPointsExpiryValue": $scope.redeems.RedeemPointsExpiryValue,
                "RedeemPointsExpiryValueType": $scope.redeems.RedeeomPointsExpiryValueType

            };
            console.log(params);
            eHnoteOrgRewardDataServices.AddupdateOrgRedeemSource(params).then(function (resp) {
                if (resp.data.status === "Sucess") {
                    alertify.success("Added Successfully");
                } else {
                    alertify.error(resp.data.Message);
                }
            });


        };
        $scope.MasterRedeemPointsTotal = function () {
            eHnoteOrgRewardDataServices.GetMasterRedeemPointSource(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID).then(function (response) {
                response.data.rows = response.data.rows || [];
                $scope.RedeemPointTotalMaster = response.data.rows;

                if (response.data.rows.length > 0) {
                    $scope.redeems.ModulesArray = response.data.rows[0].ModulesArray;
                    $scope.redeems.MinimumOrdertoRedeem = response.data.rows[0].MinimumOrdertoRedeem;
                    $scope.redeems.MaximumRedeemPointsPerOrder = response.data.rows[0].MaximumRedeemPointsPerOrder;
                    $scope.redeems.MinimumRedeemPointsPerOrder = response.data.rows[0].MinimumRedeemPointsPerOrder;
                    $scope.redeems.RedeemPointsExpiryValue = response.data.rows[0].RedeemPointsExpiryValue;
                    $scope.redeems.RedeeomPointsExpiryValueType = response.data.rows[0].RedeeomPointExpiryValueType;
                    $scope.redeems.Amountspent = response.data.rows[0].Amountspent;
                    $scope.redeems.CurrencyId = response.data.rows[0].CurrencyId;
                    $scope.redeems.RedeemPoints = response.data.rows[0].RedeemPoints;
                    $scope.redeems.OrgRedeemPointsId = response.data.rows[0].OrgRedeemPointsId || 0;
                }

            });
        };



        $scope.MasterRedeemPointsTotal();


        /*facility screen */

        function GetFacilityObj() {
            var obj = {
                "UserId": $scope.UserId,
                "FacilityId": 0,
                "BranchId": 0,
                "ParentOrganizationId": parentHospitalId,
                "GetAllIndicator": 0,
                "FacilityCode": "",
                "FacilityTypeCode": "",
                "PlaceOfServiceId": 0,
                "Address": "",
                "StateId": 0,
                "StateName": "",
                "CityId": 0,
                "CityName": "",
                "CountryId": 0,
                "CountryName": "",
                "ZipCode": "",
                "DeleteInd": "N",
                "HospitalText": "",
                "HospitalObj": ""
            }
            return obj;
        }
        $scope.FacilityObj = GetFacilityObj();
        $scope.FacilityPlaceOfServiceArray = [];
        $scope.FacilityTypesArray = [];
        $scope.FacilitiesList = [];
        function FacilitiesObj() {
            var obj = {
                "BranchId": $scope.HospitalId,
                "ParentOrganizationId": parentHospitalId,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 10,
                "HospitalText": "",
                "HospitalObj": ""
            }
            return obj;
        }
        $scope.GetFacilitiesObj = FacilitiesObj();
        $scope.TotalFacilityCount = 0;

        $scope.defaultLoginBranch = function () {
            var hospitalid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || 0;
            $scope.FacilityObj.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": hospitalid }, true)[0] || "";
            $scope.GetFacilitiesObj.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": hospitalid }, true)[0] || "";

            if ($scope.FacilityObj.HospitalObj != "") {
                $scope.FacilityObj.BranchId = $scope.FacilityObj.HospitalObj.ClinicId;

                $scope.GetFacilitiesObj.BranchId = $scope.FacilityObj.HospitalObj.ClinicId;
            }
        }
        $scope.GetdefaultLoginBranch = function (hospitalid) {
            //var hospitalid = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || 0;
            $scope.FacilityObj.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": hospitalid }, true)[0] || "";
            if ($scope.FacilityObj.HospitalObj != "") {
                $scope.FacilityObj.BranchId = $scope.FacilityObj.HospitalObj.ClinicId;
            }
        }
        $scope.GetPlaceOfServiceCodes = function () {
            eHnoteSettingsDataService.GetMasterPlaceOfServiceCodes().then(function (response) {
                $scope.FacilityPlaceOfServiceArray = [];
                if (response.data.status == "Success") {
                    if (response.data.rows.length > 0) {
                        $scope.FacilityPlaceOfServiceArray = response.data.rows || [];
                    }
                } else {
                    alertify.error(response.data.Meassage);
                }
            }, function (error) {
                console.log(error);
            });
        }
        $scope.GetFacilityTypes = function () {
            eHnoteSettingsDataService.GetMasterFacilityTypes().then(function (response) {
                $scope.FacilityTypesArray = [];
                if (response.data.status == "Success") {
                    if (response.data.rows.length > 0) {
                        $scope.FacilityTypesArray = response.data.rows || [];
                    }
                } else {
                    alertify.error(response.data.Meassage);
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.OrgnizationFacilityTypesArray = [];
        $scope.GetOrganizationFacilityData = function () {

            var obj = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "FacilityName": ""
            }
            eHnoteAdminDepartmentService.GetOrganizationFacilityData(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.OrgnizationFacilityTypesArray = resp.data.rows || [];
                }
            })

        }
        $scope.GetPlaceOfServiceCodes();
        $scope.GetFacilityTypes();
        $scope.GetOrganizationFacilityData();
        $scope.onClickFacilityHospital = function (item) {
            $scope.FacilityObj.HospitalObj = item;
            $scope.FacilityObj.BranchId = item.ClinicId;
        }
        $scope.ChangeGetFacilityHospital = function (item) {
            $scope.GetFacilitiesObj.HospitalObj = item;
            $scope.GetFacilitiesObj.BranchId = item.ClinicId;

            $scope.GetOrganizationFacilities(1);
        }

        $scope.AddOrganizationFacilities = function () {
            $scope.FacilityObj.FacilityCode = $scope.FacilityObj.FacilityCode || "";
            if ($scope.FacilityObj.FacilityCode === "") {
                alertify.error("Please Enter Facility Code");
                return false;
            }
            $scope.FacilityObj.FacilityTypeCode = $scope.FacilityObj.FacilityTypeCode || "";
            if ($scope.FacilityObj.FacilityTypeCode === "") {
                alertify.error("Please Select Facility Type");
                return false;
            }
            $scope.FacilityObj.PlaceOfServiceId = $scope.FacilityObj.PlaceOfServiceId || 0;
            if ($scope.FacilityObj.PlaceOfServiceId === 0) {
                alertify.error("Please Select Place Of Service");
                return false;
            }

            var params = {
                "UserId": $scope.UserId,
                "FacilityId": $scope.FacilityObj.FacilityId || 0,
                "BranchId": $scope.FacilityObj.BranchId,
                "ParentOrganizationId": parentHospitalId,
                "GetAllIndicator": 0,
                "FacilityCode": $scope.FacilityObj.FacilityCode,
                "FacilityTypeCode": $scope.FacilityObj.FacilityTypeCode,
                "PlaceOfServiceId": $scope.FacilityObj.PlaceOfServiceId,
                "Address": $scope.FacilityObj.Address || "",
                "StateId": $scope.FacilityObj.StateId || 0,
                "CityId": $scope.FacilityObj.CityId || 0,
                "CountryId": $scope.FacilityObj.CountryId || 0,
                "ZipCode": $scope.FacilityObj.ZipCode || 0,
                "DeleteInd": "N"
            };
            // return false;
            eHnoteSettingsDataService.AddUpdateOrganizationFacilities(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    if (params.FacilityId == 0) {
                        alertify.success("Facility Added Successfully");
                    } else {
                        alertify.success("Facility Update Successfully");
                    }
                    $scope.FacilityObj = GetFacilityObj();
                    $scope.GetOrganizationFacilities(1);
                    $scope.GetdefaultLoginBranch($scope.hospid);
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
                console.log(error);
            });

        };
        $scope.GetOrganizationFacilities = function (pagenumber) {
            var params = {
                "BranchId": $scope.GetFacilitiesObj.BranchId || 0,
                "ParentOrganizationId": parentHospitalId,
                "FacilityCode": "",
                "PageNumber": pagenumber,
                "PageSize": 10
            };

            eHnoteSettingsDataService.GetOrganizationFacilities(params).then(function (resp) {
                $scope.FacilitiesList = [];
                if (resp.data.Status == "Success") {
                    resp.data.rows = resp.data.rows || [];
                    $scope.TotalFacilityCount = resp.data.count || 0;
                    if (resp.data.rows.length > 0) {
                        $scope.FacilitiesList = resp.data.rows || [];
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
                console.log(error);
            });
        };

        $scope.GetOrganizationFacilitiesNew = function (pagenumber) {
            var params = {
                //"OrganizationId": $scope.GetFacilitiesObj.BranchId || 0,
                "ParentOrganizationId": parentHospitalId,
                "FacilityCode": "",
                "PageNumber": pagenumber,
                "PageSize": 10
            };

            eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {

                console.log(resp.data);

                $scope.FacilitiesList = [];
                if (resp.data.Status == "Success") {
                    resp.data.rows = resp.data.rows || [];
                    $scope.TotalFacilityCount = resp.data.count || 0;
                    if (resp.data.rows.length > 0) {
                        $scope.FacilitiesList = resp.data.rows || [];
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.GetOrganizationFacilitiesNew(1);
        $scope.showcondition = false;
        $scope.specialitylist = [];
        //$scope.AscTemplateScreenObj = {
        //    "IsShowAddUpdateScreen": false,
        //    "SelectedTempItem": {},
        //    "Pagesize": 10,
        //    "maxsize": 100,
        //    "Pageno": 1,
        //    "searchtext": '',
        //    "Tab": 1,
        //}
        function AscTemplateScreenObj() {
            var obj = {
                "IsShowAddUpdateScreen": false,
                "SelectedTempItem": {},
                "Pagesize": 10,
                "maxsize": 100,
                "Pageno": 1,
                "searchtext": '',
                "Tab": 1,
                "AscOrderTemplateUserId": 0,
                "searchdoc": '',
                "OrderDoctorObj": "",
                "AscCheckListTemplateUserId": 0,
                "searchCheckListdoc": '',
                "CheckListDoctorObj":''

            }
            return obj;
        }
        $scope.AscTemplateScreenObj = angular.copy(AscTemplateScreenObj());
        $scope.NavToAscTemplateTabScreen = function () {
            $scope.tabno = 32;
            if ($scope.tabno == 32) {
                //$scope.AscTemplateScreenObj.IsShowAddUpdateScreen = false;
                $scope.AscTemplateScreenObj = angular.copy(AscTemplateScreenObj());
                $scope.GetDocotorListForAscTemplates();
                $scope.GetAscSurgeryOrderTemplates();
            //    $scope.GetAscSurgeryCheckListTemplates();
            }
        }
        $scope.navtoServiceFacilityTab = function () {
            $scope.GetOrganizationFacilitiesNew(1);
            $scope.showcondition = false;

            eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
            function onspecsuccess(data) {
                console.log(data);
                $scope.specialitylist = data;

            }
            function onspecfailure(error) {
                console.log(error);
            }
            if ($scope.tabno == 32) {
                $scope.AscTemplateScreenObj.IsShowAddUpdateScreen = false;
            }
        };
        $scope.clearFacility = function () {
            $scope.FacilityObj = GetFacilityObj();
            $scope.GetdefaultLoginBranch($scope.hospid);
        }
        $scope.EditFacilityDetails = function (item) {
            $scope.facilityFocus = true;
            $scope.addedFacilityDetails = true;
            $scope.FacilityObj = GetFacilityObj();
            $scope.GetdefaultLoginBranch(item.OrganizationId);
            $scope.FacilityObj.FacilityId = item.FacilityId;
            $scope.FacilityObj.FacilityCode = item.FacilityCode;
            $scope.FacilityObj.FacilityTypeCode = item.FacilityTypeCode;
            $scope.FacilityObj.PlaceOfServiceId = item.PlaceOfServiceId;

            $scope.FacilityObj.Address = item.Address || "";
            $scope.FacilityObj.CityId = item.CityId || 0;
            $scope.FacilityObj.CityName = item.CityName || "";
            $scope.FacilityObj.StateId = item.StateId || 0;
            $scope.FacilityObj.StateName = item.StateName || "";
            $scope.FacilityObj.CountryId = item.CountryId || 0;
            $scope.FacilityObj.CountryName = item.CountryName || "";
            $scope.FacilityObj.ZipCode = item.ZipCode || "";
        }
        $scope.DeleteFacilityDetails = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                var params = {
                    "UserId": $scope.UserId,
                    "FacilityId": item.FacilityId,
                    "BranchId": item.OrganizationId,
                    "ParentOrganizationId": item.ParentOrganizationId,
                    "GetAllIndicator": 0,
                    "FacilityCode": item.FacilityCode,
                    "FacilityTypeCode": item.FacilityTypeCode,
                    "PlaceOfServiceId": item.PlaceOfServiceId,
                    "Address": item.Address,
                    "StateId": item.StateId,
                    "CityId": item.CityId,
                    "CountryId": item.CountryId,
                    "ZipCode": item.ZipCode,
                    "DeleteInd": "Y"
                };

                eHnoteSettingsDataService.AddUpdateOrganizationFacilities(params).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        alertify.success("Facility Deleted Successfully");
                        $scope.FacilityObj = GetFacilityObj();
                        $scope.GetOrganizationFacilities(1);
                        $scope.GetdefaultLoginBranch($scope.hospid);
                    } else {
                        alertify.error(resp.data.Message);
                    }
                }, function (error) {
                    console.log(error);
                });
            }, function () {
                return;
            });
        }
        //Location binding
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
            $scope.FacilityObj.CityName = item.CityName || "";
            $scope.FacilityObj.CityId = item.CityId;
            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.FacilityObj.StateName = resp.data[0].StateName;
                    $scope.FacilityObj.StateId = resp.data[0].StateId;
                    $scope.FacilityObj.CountryName = resp.data[0].CountryName;
                    $scope.FacilityObj.CountryId = resp.data[0].CountryId;

                }
            });
        };
        $scope.ChangeZipCode = function (val) {
            val = val || "";
            if (val.length >= 5) {

                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {
                        var basedZipcode = resp.data.rows || [];
                        if (basedZipcode.length !== 0) {
                            $scope.FacilityObj.CityName = basedZipcode[0].CityName || "";
                            $scope.FacilityObj.CityId = basedZipcode[0].CityId || 0;
                            $scope.FacilityObj.StateName = basedZipcode[0].StateName || "";
                            $scope.FacilityObj.StateId = basedZipcode[0].StateId || 0;
                            $scope.FacilityObj.CountryName = basedZipcode[0].CountryName || "";
                            $scope.FacilityObj.CountryId = basedZipcode[0].CountryId || 0;
                        }
                    }
                });

            }
        }
        $scope.Allstates = [];
        $scope.Allcountries = [];
        $scope.states = eHnotePatientAddressDataServices.getStates($scope.hospid, getstatesSuccess, getstatesFailed);
        function getstatesSuccess(data) {
            $scope.Allstates = data;
        }
        function getstatesFailed(data) {
        }
        $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
        function getcountriesSuccess(data) {
            $scope.Allcountries = data;
        }
        function getcountriesFailed(data) {
        }
        $scope.ONchangePatientState = function (item) {
            if (item != null) {
                $scope.FacilityObj.StateName = item.Name || "";
                $scope.FacilityObj.StateId = item.StateId || 0;
                $scope.FacilityObj.CityName = "";
                $scope.FacilityObj.CityId = 0;
            }
        };
        $scope.OnchangeCountry = function (item, type) {
            if (item != null || item != "") {
                $scope.FacilityObj.CountryName = item.Name || "";
                $scope.FacilityObj.CountryId = item.Id || 0;
            }
        }
        $scope.changefacilitycities = function () {
            $scope.FacilityObj.CityId = 0;
        }
        $scope.changefacilitystates = function () {
            $scope.FacilityObj.StateId = 0;
        }
        $scope.changefacilitycountry = function () {
            $scope.FacilityObj.CountryId = 0;
        }

        $scope.TOSCodeList = [];
        $scope.getOrganizationTOSCodes = function () {
            eHnotePatientAddressDataServices.GetOrganizationTOSCodes(parentHospitalId).then(function (resp) {
                console.log(resp);
                if (resp.data.rows.length > 0) {
                    $scope.TOSCodeList = resp.data.rows || [];
                }
            });
        };
        $scope.getOrganizationTOSCodes();

        /*facility screen End*/

        /*Feedback form Screen */
        function GetFeedBackObj() {
            var obj = {
                "UserId": $scope.UserId,
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "FeedBackTitle": "",
                "FeedBackQuestions": []
            }
            return obj;
        };
        $scope.FeedBackObj = GetFeedBackObj();
        $scope.GetFeedbackDetailObj = function () {
            var obj = {
                "FeedBackId": 0,
                "FeedBackQuestion": "",
                "FieldTypeId": 0,
                "FieldType": "",
                "FieldValues": [],
                "Values": "",
                "DeleteInd": "N"
            };
            return obj;
        };
        $scope.FieldTypeList = [];

        $scope.navToFeedBackForm = function () {
            $scope.GetFeedBack();
        }
        $scope.GetFieldTypeDeatils = function () {
            eHnoteSettingsDataService.GetMasterFieldTypes().then(function (resp) {
                $scope.FieldTypeList = [];
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.FieldTypeList = resp.data.rows;
                    }
                }
            }, function (error) {
                console.log(resp);
            });
        };
        $scope.GetFieldTypeDeatils();
        $scope.OnSelectFeildTitle = function () {
            var filterFeedbacklist = $filter("filter")($scope.FeedBackObj.FeedBackQuestions, { "DeleteInd": "N" }, true) || [];
            if (filterFeedbacklist.length > 4) {
                alertify.error("Maximum Five FeedBack Questions Only");
                return false;
            }

            var index = $scope.FeedBackObj.FeedBackQuestions.length - 1;
            if (index >= 0) {
                if ($scope.FeedBackObj.FeedBackQuestions[index].FieldTypeId === 0) {
                    alertify.error("Select any Field");
                    return false;
                }
            }

            $scope.FeedBackObj.FeedBackQuestions.push($scope.GetFeedbackDetailObj());
        };
        $scope.onSelectField = function (item) {

            console.log($scope.FeedBackObj.FeedBackQuestions);

            var filterFeedbacklist = $filter("filter")($scope.FeedBackObj.FeedBackQuestions, { "DeleteInd": "N" }, true) || [];
            if (filterFeedbacklist.length > 4) {
                alertify.error("Maximum Five FeedBack Questions Only");
                return false;
            }

            var index = $scope.FeedBackObj.FeedBackQuestions.length - 1;
            if (index >= 0) {
                if ($scope.FeedBackObj.FeedBackQuestions[index].FieldTypeId === 0) {
                    alertify.error("Select any Field");
                    return false;
                }
            }

            var questionemptycount = 0;
            if ($scope.FeedBackObj.FeedBackQuestions.length > 0) {
                angular.forEach($scope.FeedBackObj.FeedBackQuestions, function (mitem) {
                    if (mitem.FeedBackQuestion === "") {
                        questionemptycount++;
                    }
                });
            }
            if (questionemptycount > 0) {
                alertify.error("Please Enter Question");
                return false;
            }

            $scope.BlurFeedbacklist = [];
            $scope.BlurFeedback = function (xitem, index) {

                // $scope.questionrepeat = 0;

                $scope.BlurFeedbacklist = $filter("filter")($scope.FeedBackObj.FeedBackQuestions, { "DeleteInd": "N" }, true) || [];
                angular.forEach($scope.BlurFeedbacklist, function (sitem, ind) {
                    if (index != ind) {
                        if (sitem.FeedBackQuestion == xitem.FeedBackQuestion) {
                            alertify.error("Duplicate Question");
                            return false;
                            // $scope.questionrepeat++;
                        }
                    }

                });


                //if (questionrepeat > 0) {
                //    alertify.error("Duplicate Question");
                //    return false;
                //}
            }

            $scope.List2 = [];
            $scope.BlurRadio = function (fitem) {
                if (fitem.Values != "") {
                    $scope.List2 = fitem.Values.split(',') || [];
                    if ($scope.List2.length > 1) {
                        //if ($scope.List2.length === "") {
                        //}
                        //else {
                        //    alertify.error("Please Enter one more Answer");
                        //    return false;
                        //}

                        angular.forEach($scope.List2, function (qitem) {

                            if (qitem === "") {
                                alertify.error("Please Enter one more Answer");
                            }
                        });
                    }
                    else {
                        alertify.error("Please Enter one more Answer");
                        return false;
                    }


                }


                var errorcount = 0;
                angular.forEach($scope.List2, function (zitem, mindex) {
                    angular.forEach($scope.List2, function (yitem, nindex) {
                        if (mindex != nindex) {
                            if (zitem == yitem) {
                                errorcount++;

                            }
                        }

                    });


                });

                if (errorcount > 0) {
                    alertify.error("Duplicates Values");
                    return false;

                }




            }




            //if (item.Values != "") {
            //    var List1 = item.Values.split(',') || [];
            //    if (List1.length > 0) {
            //        item.FieldValues = List1;
            //    }
            //} else {
            //    Anyfield = true;
            //    alertify.error("Enter Values");
            //    return false;
            //}

            //$scope.BlurRadio = function () {
            //    var filterFeedbackArr = $filter("filter")($scope.FeedBackObj.FeedBackQuestions, { "DeleteInd": "N" }, true) || [];
            //    if (filterFeedbackArr.length > 1) {
            //        alertify.error("enter another answer");
            //        return false;
            //    }


            //}





            //$scope.BlurFeedback = function () {

            //    var BlurFeedbacklist = $filter("filter")($scope.FeedBackObj.FeedBackQuestions, { "DeleteInd": "N" }, true) || [] ;

            //    if (BlurFeedbacklist.length > 1) {
            //        alertify.error("Duplicate  Questions");
            //        return false;

            //    }

            //}


            $scope.GetFeedbackDetailObj = function () {
                var obj = {
                    "FeedBackId": 0,
                    "FeedBackQuestion": "",
                    "FieldTypeId": item.FieldTypeId,
                    "FieldType": item.FieldName,
                    "FieldValues": [],
                    "Values": "",
                    "DeleteInd": "N"
                };
                return obj;
            };
            $scope.FeedBackObj.FeedBackQuestions.push($scope.GetFeedbackDetailObj());
            //var index = $scope.FeedBackObj.FeedBackQuestions.length - 1;
            //if (index >= 0) {
            //    $scope.FeedBackObj.FeedBackQuestions[index].FieldTypeId = item.FieldTypeId;
            //    $scope.FeedBackObj.FeedBackQuestions[index].FieldType = item.FieldName;
            //}
        };
        $scope.AddMoreFeedback = function (item) {
            if (item.FieldTypeId === 0) {
                alertify.error("Select any Field");
                return false;
            }

            $scope.FeedBackObj.FeedBackQuestions.push($scope.GetFeedbackDetailObj());
        };


        $scope.AddUpdateFeedBackDetails = function () {
            var Anyfield = false;
            if ($scope.FeedBackObj.FeedBackTitle === "") {
                Anyfield = true;
                alertify.error("Please Enter the Title Text");
                return false;
            }
            if ($scope.FeedBackObj.FeedBackQuestions.length === 0) {
                Anyfield = true;
                alertify.error("Please Add Atleast one FeedBack Question");
                return false;
            }
            if ($scope.FeedBackObj.FeedBackQuestions.length > 0) {
                var errorcount2 = 0;
                angular.forEach($scope.FeedBackObj.FeedBackQuestions, function (item, mainindex) {
                    if (item.DeleteInd == "N") {
                        if (item.FeedBackQuestion == "") {
                            Anyfield = true;
                            alertify.error("Please Enter the Question");
                            return false;
                        }
                        if (item.FieldTypeId != 6 && item.FieldTypeId != 5 && item.FieldTypeId != 1) {
                            if (item.Values != "") {
                                var List1 = item.Values.split(',') || [];
                                if (List1.length > 0) {
                                    item.FieldValues = List1;
                                }
                            } else {
                                Anyfield = true;
                                alertify.error("Enter Values");
                                return false;
                            }
                        } else {
                            item.FieldValues = "";
                        }





                        if (item.Values != "") {
                            $scope.List2 = item.Values.split(',') || [];
                            if ($scope.List2.length > 1) {
                                angular.forEach($scope.List2, function (hitem) {
                                    if (hitem === "") {
                                        Anyfield = true;
                                        alertify.error("Please Enter one more Answer");
                                    }
                                });
                            }
                            else {
                                Anyfield = true;
                                alertify.error("Please Enter one more Answer");
                                return false;
                            }

                        }



                        angular.forEach($scope.FeedBackObj.FeedBackQuestions, function (sitem, subindex) {
                            if (sitem.DeleteInd == "N") {
                                if (mainindex != subindex) {
                                    if (sitem.FeedBackQuestion == item.FeedBackQuestion) {
                                        Anyfield = true;
                                        errorcount2++;

                                    }
                                }
                            }
                        });



                        var errorcount1 = 0;
                        angular.forEach($scope.List2, function (hitem, qindex) {
                            angular.forEach($scope.List2, function (titem, oindex) {
                                if (qindex != oindex) {
                                    if (hitem == titem) {
                                        errorcount1++;
                                        Anyfield = true;
                                    }
                                }
                            });
                        });
                        if (errorcount1 > 0) {
                            alertify.error("Duplicates Values");
                            return false;

                        }

                    }

                });

                if (errorcount2 > 0) {
                    alertify.error("Duplicates Questions");
                    return false;
                }
            }

            if (Anyfield == true) {
                return false;
            }

            eHnoteSettingsDataService.AddUpdateFeedBackDetails($scope.FeedBackObj).then(function (resp) {
                $scope.FeedBackObj = GetFeedBackObj();
                if (resp.data.status == "Success") {
                    alertify.success("FeedBack Details Added Successfully");
                    $scope.GetFeedBack();

                } else {
                    alertify.error(Message);
                }
            }, function (err) {
                console.log(err);
            });
        };
        $scope.GetFeedBack = function () {
            //var obj = {
            //    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
            //}


            $scope.AllFeedbacklist = [];
            eHnoteSettingsDataService.GetFeedBackByParentOrganizationId(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (resp) {
                $scope.FeedBackObj = GetFeedBackObj();
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.FeedBackObj.FeedBackQuestions = resp.data.rows;
                        $scope.FeedBackObj.FeedBackTitle = resp.data.FeedBackTitle;

                        $scope.AllFeedbacklist = angular.copy(resp.data.rows);
                        angular.forEach($scope.FeedBackObj.FeedBackQuestions, function (subitem) {
                            subitem.DeleteInd = "N";
                            subitem.Values = "";
                            if (subitem.FieldTypeId != 6 && subitem.FieldTypeId != 5 && subitem.FieldTypeId != 1) {
                                subitem.FieldValues = subitem.FieldValues || [];
                                if (subitem.FieldValues.length > 0) {
                                    var string1 = JSON.parse(subitem.FieldValues);
                                    //var string2 = angular.fromJson(subitem.FieldValues);

                                    if (string1.length > 0) {
                                        var values = "";
                                        string1.forEach(function (pitem, index) {
                                            if (values != '') {
                                                values = values + "," + pitem;
                                            } else {
                                                values = "" + pitem;
                                            }
                                        });
                                        subitem.Values = values;
                                    }
                                }
                            }
                        });

                        angular.forEach($scope.AllFeedbacklist, function (Aitem) {
                            if (Aitem.FieldTypeId != 6 && Aitem.FieldTypeId != 5 && Aitem.FieldTypeId != 1) {
                                Aitem.FieldValues = Aitem.FieldValues || [];
                                Aitem.FieldArray = [];
                                if (Aitem.FieldValues.length > 0) {
                                    var string2 = JSON.parse(Aitem.FieldValues);
                                    //  Aitem.FieldArray = string2;
                                    if (string2.length > 0) {
                                        string2.forEach(function (pitem, index) {
                                            var obj = {
                                                "Value": pitem
                                            };
                                            Aitem.FieldArray.push(obj);
                                        });
                                    }
                                }
                            }
                        });

                    }
                }
            }, function (err) {
                console.log(err);
            });
        };
        $scope.ClearFeebBabckTitle = function (item) {
            item.FeedBackQuestion = "";
        };
        $scope.RemoveFeebBabckTitle = function (item) {
            var index = $scope.FeedBackObj.FeedBackQuestions.indexOf(item);
            if (item.FeedBackId === 0) {
                if (index > -1) {
                    $scope.FeedBackObj.FeedBackQuestions.splice(index, 1);
                }
            } else {
                $scope.FeedBackObj.FeedBackQuestions[index].DeleteInd = "Y";
            }
        };
        $scope.ClearFeebBabckField = function (item) {
            item.Values = "";
        };


        //$scope.DeleteFeedBackList = function (item) {
        //    console.log(item);
        //    angular.forEach($scope.AllFeedbacklist.FieldArray, function (hitem, index) {
        //        if (hitem.FieldTypeId === 1) {


        //                hitem.DeleteInd = "Y";

        //        }
        //    });
        //}



        /*Feedback form Screen End*/





        $scope.ConsentFormsData = {
            "DoctorID": 3,
            "USRType": "DOCTOR",
            "HospitalId": 3,
            "UserId": 3,
            "ConsentTypeObj": "",
            "ConsentTypeId": 0,
            "ConsentSubTypeId": 0,
            "ConsentTypeName": "",
            "ConsentSubTypeName": "",
            "ConsentForms": [
                {

                }
            ]
        };


        $scope.ConsentFormsDatareq = {
            "ParentOrganizationId": 3,
            "UserId": 3,
            "ConsentTypeId": 0,
            "ConsentSubTypeId": 0,
            "OrganisationConsentFormId": 0,
            "ConsentName": "",
            "PDfcontent": ""
        };

        $scope.Names = [
            { "ConsentName": "Appointment", "id": 1 },
            { "ConsentName": "Surgery", "id": 2 }
        ];


        $scope.ChangeValueConsent = function (id) {

            $scope.Consentid = id;
            $scope.ConsentFormsData.ConsentSubTypeId = 0;
            $scope.ConsentFormsData.ConsentSubTypeName = "";
        }
        $scope.PDFChangeValueConsent = function (id) {

            $scope.Consentid = id;
            $scope.ConsentFormsData.ConsentSubTypeId = 0;
            $scope.ConsentFormsData.ConsentSubTypeName = "";
        }

        $scope.ChangeSurgerySpecial = function (item) {
            if (type === "") {

                item.ConsentSubTypeId = item.SurgerySpecializationId;
                item.ConsentSubTypeName = item.Name;
            }

        }


        $scope.getSurgerySpecializations = function () {
            eHnoteSurgeryService.GetMasterSurgerySpecializations(callbacksuccess, callbackerror);
            function callbacksuccess(data) {
                if (data !== undefined) {
                    if (data.length > 0) {
                        $scope.masterSurgerySpecializationArray = data;

                    }
                }
            }
            function callbackerror(error) {
                console.log(error);
            }
        };




        //$scope.GetNewConsentOrg = function (text) {


        //    var Obj = {
        //        "DoctorID": 3,
        //        "USRType": "DOCTOR",
        //        "HospitalId": 3,
        //        "UserId": 3,
        //        "ConsentTypeId": $scope.ConsentFormsData.ConsentTypeId,
        //        "ConsentSubTypeId": $scope.ConsentFormsData.ConsentSubTypeId,
        //        "ConsentTypeName": $scope.ConsentFormsData.ConsentTypeName,
        //        "ConsentSubTypeName": $scope.ConsentFormsData.ConsentSubTypeName,
        //        "ConsentForms": [
        //            {

        //            }
        //        ]
        //    };
        //    return eHnoteSettingsDataService.GetOrgBillingPackage(Obj, "Get").then(function (resp) {
        //        if (resp.data.count !== 0) {
        //            if (resp.data.rows !== undefined) {
        //                return resp.data.rows.map(function (sitem) {
        //                    return item;
        //                });
        //            }
        //        }
        //    });


        //};









        $scope.consentSubTab = 1;
        $scope.switchConsentSubTab = function (tabno) {
            console.log(tabno);
            $scope.consentSubTab = tabno;
            if ($scope.consentSubTab === 2) {

            }
            //} else {
            //    textAngularManager.unregisterToolbar($scope.editorToolbarButtonConfig);
            //    textAngularManager.unregisterEditor('htmlcontentconsent');
            //    document.getElementById("htmlcontentconsent").remove();
            //}
            if ($scope.consentSubTab === 3) {
                $scope.Consentslist();

                $scope.contentobj = {
                    "ContentName": '',
                    "ContentId": 0,
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "UserId": $scope.UserId,
                    "Contentlist": []

                }
            }

            if ($scope.consentSubTab === 4) {

                $scope.MainConsentObject.htmlconsentNew = "";
                $scope.mainConsentCreateDefaulArray = [
                    {
                        "MainItemId": "1",
                        "MainItemName": "Header",
                        "IsSelected": false,
                        "IsActive": false,
                        "SubItems": [
                            {
                                "SubItemId": 1,
                                "SubItemName": "Date",
                                "Value": "#Date#",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 2,
                                "SubItemName": "PatientName",
                                "Value": "#PatientName#",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 3,
                                "SubItemName": "PatientMrNo",
                                "Value": "#PatientMrNo#",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 4,
                                "SubItemName": "PatientMobile",
                                "Value": "#PatientMobile#",
                                "IsSelected": false
                            }
                        ]
                    },
                    {
                        "MainItemId": "2",
                        "MainItemName": "Body",
                        "IsSelected": false,
                        "IsActive": false,
                        "SubItems": [
                            {
                                "SubItemId": 6,
                                "SubItemName": "Free Text",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 7,
                                "SubItemName": "Consent Templates",
                                "IsSelected": false,
                                "ChildItems": [
                                    //{
                                    //    "ChildItemId": 1,
                                    //    "ChildItemName": "Procedure1",
                                    //    "IsSelected": false
                                    //},
                                    //{
                                    //    "ChildItemId": 2,
                                    //    "ChildItemName": "Procedure3",
                                    //    "IsSelected": false
                                    //}
                                ]
                            },

                        ]
                    },
                    {
                        "MainItemId": "3",
                        "MainItemName": "Footer",
                        "IsSelected": false,
                        "IsActive": false,
                        "SubItems": [
                            {
                                "SubItemId": 8,
                                "SubItemName": "Patient Sign",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 9,
                                "SubItemName": "Guardian Sign",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 10,
                                "SubItemName": "Doctor Sign",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 11,
                                "SubItemName": "Staff Sign",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 12,
                                "SubItemName": "Anaesthetist Sign",
                                "IsSelected": false
                            },
                            {
                                "SubItemId": 12,
                                "SubItemName": "CoOrdinator Sign",
                                "IsSelected": false
                            }
                        ]
                    }
                ];


                $scope.Consentslist();
                $scope.contentobj = {
                    "ContentName": '',
                    "ContentId": 0,
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "UserId": $scope.UserId,
                    "Contentlist": []

                }
            }

            if ($scope.consentSubTab === 5) {
                $scope.getallTablesinfo("");
                $scope.GetConsentFieldsListData();
            }



        };
        $scope.onloadHtml = function () {
            if ($scope.contentobj.Contentlist.length > 0) {
                angular.forEach($scope.contentobj.Contentlist, function (item, $index) {
                    var index = $index;
                    var ContentBody = "#ContentBody" + index;
                    var newmyEl = '';
                    $(ContentBody).empty();
                    newmyEl = angular.element(document.querySelector(ContentBody));
                    newmyEl.append(item.PDFcontent)
                });
            };
        }
        $scope.changecontent = function (item) {
            //    $scope.onloadHtml();
            if (item.isChecked == true) {
                var List = $filter("filter")($scope.contentobj.Contentlist, { "DocId": item.DocId }, true);
                if (List.length > 0) {

                } else {
                    var obj = {
                        "DeleteInd": false,
                        "DocumentName": item.DocumentName,
                        "OrganizationContentId": item.DocId,
                        "PDFcontent": item.PDFcontent,
                    }
                    $scope.contentobj.Contentlist.push(obj);

                }
            } else {
                angular.forEach($scope.contentobj.Contentlist, function (ritem, rindex) {
                    if (item.DocId === ritem.DocId) {
                        $scope.contentobj.Contentlist.splice(rindex, 1);
                    }
                });

            }
            $timeout(function () {
                $scope.onloadHtml();
            }, 200);
        }

        $scope.SavecontentData = function () {
            if ($scope.contentobj.ContentName == '') {
                alertify.error("Enter ContentName");
                return false;
            }
            if ($scope.contentobj.Contentlist.length == 0) {
                alertify.error("Select Consent item");
                return false;
            }
            var req = {
                "ContentName": $scope.contentobj.ContentName || '',
                "ContentId": $scope.contentobj.ContentId || 0,
                "ParentOrganizationId": $scope.contentobj.ParentOrganizationId,
                "UserId": $scope.contentobj.UserId,
                "Contentlist": $scope.contentobj.Contentlist || []

            }
            eHnoteSettingsDataService.AddUpdateOrganizationContents(req).then(function (resp) {
                console.log(resp);
                alertify.success("Added Successfully");
            }, function (err) {
                alertify.success("Updating Failed");
            });
        }


        $scope.MainConsentObject = {
            "htmlcontent": "",
            "htmlconsentNew": ""
        }
        //$scope.$watch("MainConsentObject.htmlcontent", function (newVal, oldVal) {
        //    var myEl = angular.element(document.querySelector('#consentPreviewId'));
        //    myEl.append($scope.MainConsentObject.htmlcontent);
        //}, true);


        $scope.PreviewHtmlConsent = function () {
            var newmyEl = '';
            $("#consentPreviewId").empty();
            newmyEl = angular.element(document.querySelector('#consentPreviewId'));
            newmyEl.append($scope.MainConsentObject.htmlcontent);

            console.log(JSON.stringify($scope.MainConsentObject.htmlcontent));
        }


        //$scope.changeconsenthtml = function () {
        //    //var myEl = angular.element(document.querySelector('#consentPreviewId'));

        //    //myEl.remove();

        //    var newmyEl = angular.element(document.querySelector('#consentPreviewId'));
        //    newmyEl.append($scope.MainConsentObject.htmlcontent);
        //};


        $scope.SaveConsentfilesInSettings = function () {

            if ($scope.ConsentFormsDatareq.ConsentName == "") {
                alertify.error("Entet Consent Form Name");
                return false;
            }
            if ($scope.MainConsentObject.htmlcontent == "") {
                alertify.error("Entet  html content");
                return false;
            }
            var req = {
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": doctorinfo.doctorid,
                "OrganisationConsentFormId": $scope.ConsentFormsDatareq.OrganisationConsentFormId || 0,
                "ConsentName": $scope.ConsentFormsDatareq.ConsentName || '',
                "ConsentTypeId": $scope.ConsentFormsDatareq.ConsentTypeId || null,
                "ConsentSubTypeId": $scope.ConsentFormsDatareq.ConsentSubTypeId || null,
                "DeleteInd": "N",
                "PDfcontent": $scope.MainConsentObject.htmlcontent || "",
                "Type": 1,

            };

            eHnoteSettingsDataService.AddUpdateOrganizationConsents(req).then(function (resp) {
                console.log(resp);
                alertify.success("Updated Successfully");
            }, function (err) {
                alertify.success("Updating Failed");
            });
        };

        $scope.saveConsentObject = {
            "htmlcontent": ""
        }

        $scope.GetConsentsByOrganizationAndType = function () {
            var obj = {
                "ParentOrganizationId": 3,
                "Type": 1,
                "PDfcontent": $scope.saveConsentObject.htmlcontent || "",
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1
            };

            eHnoteSettingsDataService.GetConsentsByOrganizationAndType(obj).then(function (resp) {
                $scope.Consentformlist = [];
                if (resp.data.rows.length > 0) {
                    $scope.Consentformlist = resp.data.rows || [];

                }
            }, function (err) {
                console.log(err);
            });
        }
        $scope.GetConsentsByOrganizationAndType();

        $scope.saveHtmlConsent = function (item) {
            $("#saveId").empty();
            var newsave = '';
            $scope.saveConsentObject.htmlcontent = item.PDFcontent || '';
            newsave = angular.element(document.querySelector('#saveId'));
            newsave.append($scope.saveConsentObject.htmlcontent);
            console.log(JSON.stringify($scope.saveConsentObject.htmlcontent));
        }

        $scope.RoomTabMenu = 1;
        $scope.RoomClassActiveMenu = function (menuno) {
            return (menuno === $scope.RoomTabMenu) ? "active" : "";
        };

        $scope.SwitchRoomTabMenu = function (mno) {
            $scope.RoomTabMenu = mno;
            $scope.RoomListPageNumber = 1;

            if ($scope.RoomTabMenu === 2) {
                $scope.addRoomForUserObj = getAssignRoomObj();
                GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, '');
                $scope.GetAllUsersAssignedRoomsList();
                if ($scope.defaultbranch.length > 0) {
                    $scope.addRoomForUserObj.HospitalObj = $scope.defaultbranch[0];
                    $scope.addRoomForUserObj.HospitalId = $scope.defaultbranch[0].ClinicId;
                }

            }
        };



        $scope.userRoomsArray = [];
        $scope.GetWaitingRoomByType = function (typeid) {

            var params = {
                "HospitalId": $scope.addRoomForUserObj.HospitalId,
                "RoomTypeId": typeid,
                "SearchText": "",
                "PageNumber": 1,
                "PageSize": 100
            }
            eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                if (data.Status === "Success") {
                    $scope.userRoomsArray = data.rows || [];
                } else {
                    $scope.userRoomsArray = [];
                }
            }).error(function (error) {

            });
        }


        $scope.changeBranchToGetUsers = function (item) {
            $scope.selectedBranch = item;
            $scope.AppListselectedclinic = item;
            $scope.userRoomsArray = [];
            if ($scope.selectedBranch.BranchId === 0) {
                if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                    $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                }
            }
            $scope.addRoomForUserObj.DoctorId = 0;
            $scope.addRoomForUserObj.DoctorObj.FullName = "Select";
            GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, '');
        };

        $scope.chooseDoctorforRoomAssign = function (item) {
            console.log(item);
            $scope.userRoomsArray = [];

            $scope.addRoomForUserObj.DoctorId = item.DoctorID;
            $scope.addRoomForUserObj.DoctorObj = item;

        };

        $scope.DeleteAssignedRoom = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                var params = {
                    "UserBranchRoomId": item.UserBranchRoomId,
                    "HospitalId": item.HospitalId,
                    "UserId": $scope.UserId,
                    "DoctorId": item.DoctorId,
                    "RoomTypeId": item.RoomTypeId,
                    "RoomId": item.RoomId,
                    "DeleteInd": "Y",
                    "ActiveInd": item.ActiveInd,
                    "IsDefaultRoom": item.IsDefaultRoom === false ? "N" : "Y",
                    "IsCurrentRoom": item.IsCurrentRoom === false ? "N" : "Y"
                }

                eHnoteSettingsDataService.AddUpdateUserRoomsinBranch(params).success(function (data) {
                    if (data.Status === "Success") {
                        alertify.success("Deleted Successfully");
                        $scope.GetAllUsersAssignedRoomsList();
                        $scope.addRoomForUserObj = getAssignRoomObj();
                        if ($scope.defaultbranch.length > 0) {
                            $scope.addRoomForUserObj.HospitalObj = $scope.defaultbranch[0];
                            $scope.addRoomForUserObj.HospitalId = $scope.defaultbranch[0].ClinicId;
                        }
                    } else {
                        alertify.error('Room already exists');

                    }

                }).error(function (error) {

                });
            }, function () {
                return;
            });
        }

        $scope.AddUpdateAssignRoom = function () {


            if ($scope.addRoomForUserObj.HospitalId === "") {
                alertify.error("Select Branch");
                return false;
            } else if ($scope.addRoomForUserObj.DoctorId === "" || $scope.addRoomForUserObj.DoctorId === 0) {
                alertify.error("Select User");
                return false;
            }
            else if ($scope.addRoomForUserObj.RoomTypeId === "" || $scope.addRoomForUserObj.RoomTypeId === 0) {
                alertify.error("Enter Room Name");
                return false;
            }
            else if ($scope.addRoomForUserObj.RoomId === "" || $scope.addRoomForUserObj.RoomId === 0) {
                alertify.error("Select Room");
                return false;
            }


            var params = {
                "UserBranchRoomId": $scope.addRoomForUserObj.UserBranchRoomId,
                "HospitalId": $scope.addRoomForUserObj.HospitalId,
                "UserId": $scope.UserId,
                "DoctorId": $scope.addRoomForUserObj.DoctorId,
                "RoomTypeId": $scope.addRoomForUserObj.RoomTypeId,
                "RoomId": $scope.addRoomForUserObj.RoomId,
                "DeleteInd": $scope.addRoomForUserObj.DeleteInd,
                "ActiveInd": $scope.addRoomForUserObj.ActiveInd,
                "IsDefaultRoom": $scope.addRoomForUserObj.IsDefaultRoom === false ? "N" : "Y",
                "IsCurrentRoom": $scope.addRoomForUserObj.IsCurrentRoom === false ? "N" : "Y",
            }




            eHnoteSettingsDataService.AddUpdateUserRoomsinBranch(params).success(function (data) {
                if (data.Status === "Success") {
                    alertify.success('Added Successfully');
                    $scope.GetAllUsersAssignedRoomsList();
                    $scope.searchdoctor.txt1 = "";
                    $scope.addRoomForUserObj = getAssignRoomObj();
                    if ($scope.defaultbranch.length > 0) {
                        $scope.addRoomForUserObj.HospitalObj = $scope.defaultbranch[0];
                        $scope.addRoomForUserObj.HospitalId = $scope.defaultbranch[0].ClinicId;
                    }
                } else {
                    alertify.error('Room already exists');

                }

            }).error(function (error) {

            });
        }


        $scope.chooseDoctorforgetRooms = function (item) {
            console.log(item);
            $scope.getMainAssignedRoomsListObj.DoctorId = item.DoctorID;
            $scope.getMainAssignedRoomsListObj.DoctorObj = item;
        };

        $scope.AssignedUserRoomsArray = [];

        $scope.GetAllUsersAssignedRoomsList = function () {
            var params = {
                "HospitalId": $scope.getMainAssignedRoomsListObj.HospitalId,
                "DoctorId": $scope.getMainAssignedRoomsListObj.DoctorId,
                "RoomTypeId": $scope.getMainAssignedRoomsListObj.RoomTypeId,
                "PageSize": $scope.getMainAssignedRoomsListObj.PageSize,
                "PageNumber": $scope.getMainAssignedRoomsListObj.PageNumber
            }
            eHnoteSettingsDataService.GetUsersAssignedRoomsList(params).success(function (resp) {

                console.log(resp);

                if (resp.Status === "Success") {
                    $scope.AssignedUserRoomsArray = resp.rows || [];

                    $scope.getMainAssignedRoomsListObj.TotalCount = resp.count
                } else {
                    $scope.AssignedUserRoomsArray = [];
                }


            }).error(function (error) {

            });
        }


        $scope.changeRoomAssignStatus = function (item) {






            item.IsActiveStatus = !item.IsActiveStatus;


            //if (item.IsDefaultRoom && item.IsActiveStatus) {
            //    var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to disable? </h4>", function () {

            //    }, function () {
            //        return;
            //    });
            //}


            if (item.IsActiveStatus) {
                item.ActiveInd = 'Y'
            } else {
                item.ActiveInd = 'N'
            }

            var params = {
                "UserBranchRoomId": item.UserBranchRoomId,
                "HospitalId": item.HospitalId,
                "UserId": $scope.UserId,
                "DoctorId": item.DoctorId,
                "RoomTypeId": item.RoomTypeId,
                "RoomId": item.RoomId,
                "DeleteInd": item.DeleteInd,
                "ActiveInd": item.ActiveInd,
                "IsDefaultRoom": item.IsDefaultRoom === false ? "N" : "Y",
                "IsCurrentRoom": item.IsCurrentRoom === false ? "N" : "Y"
            }




            eHnoteSettingsDataService.AddUpdateUserRoomsinBranch(params).success(function (data) {
                if (data.Status === "Success") {
                    alertify.success('Added Successfully');
                    $scope.GetAllUsersAssignedRoomsList();

                    $scope.addRoomForUserObj = getAssignRoomObj();
                } else {
                    alertify.error('Room already exists');

                }

            }).error(function (error) {

            });
        }



        $scope.EditAssinedRoom = function (item) {
            console.log(item);

            $scope.addRoomForUserObj = getAssignRoomObj();
            $scope.addRoomForUserObj.UserBranchRoomId = item.UserBranchRoomId;
            $scope.addRoomForUserObj.RoomCapacity = item.RoomCapacity;

            $scope.addRoomForUserObj.RoomName = item.RoomName;
            $scope.addRoomForUserObj.RoomTypeId = item.RoomTypeId;
            $scope.addRoomForUserObj.HospitalId = item.HospitalId;
            $scope.addRoomForUserObj.ActiveInd = 'Y';
            $scope.addRoomForUserObj.DeleteInd = 'N';
            $scope.addRoomForUserObj.IsDefaultRoom = item.IsDefaultRoom;
            $scope.addRoomForUserObj.IsCurrentRoom = item.IsCurrentRoom;
            $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (Aitem) {
                return Aitem.ClinicId === item.HospitalId;
            });
            $scope.addRoomForUserObj.HospitalObj = $scope.defaultbranch[0];

            $scope.selectedUserobj = $filter("filter")($scope.clinicDoctorList, function (Aitem) {
                return Aitem.DoctorID === item.DoctorId;
            });

            $scope.addRoomForUserObj.DoctorObj = $scope.selectedUserobj[0];
            $scope.addRoomForUserObj.DoctorId = item.DoctorId;
            var params = {
                "HospitalId": $scope.addRoomForUserObj.HospitalId,
                "RoomTypeId": item.RoomTypeId,
                "SearchText": "",
                "PageNumber": 1,
                "PageSize": 100
            }
            eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                if (data.Status === "Success") {
                    $scope.userRoomsArray = data.rows || [];

                    $scope.addRoomForUserObj.RoomId = item.RoomId;

                } else {
                    $scope.userRoomsArray = [];
                }
            }).error(function (error) {

            });
        };


        $scope.CheckinAvgTimeArray = [
            {
                "Time": "0",
                "Display": "Select",
                "TimeId": 0
            },
            {
                "Time": "15",
                "Display": "15 mins",
                "TimeId": 1
            },
            {
                "Time": "30",
                "Display": "30 mins",
                "TimeId": 2
            },
            {
                "Time": "45",
                "Display": "45 mins",
                "TimeId": 3
            },
            {
                "Time": "60",
                "Display": "1 hr",
                "TimeId": 4
            },
            {
                "Time": "120",
                "Display": "2 hrs",
                "TimeId": 5
            }
        ]

        $scope.masterAllergyPageSize = 10;

        $scope.masterVaccinactionPagechanged = function (pagenumber) {
            $scope.masterVaccinactionPageNumber = pagenumber;
            getMasterVaccinactionItems();
        };

        $scope.masterOcularPagechanged = function (pagenumber) {
            $scope.masterVaccinactionPageNumber = pagenumber;
            getMasterOcularItems();
        };

        $scope.Vaccinaction = {
            "IsFrequent": false
        }
        $scope.AddupdateVaccinaction = function () {

            //if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateAllergies) {
            //    alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            //    return false;
            //}
            if ($scope.VaccinactionDesc === "" || $scope.VaccinactionDesc === undefined) {
                alertify.error("Enter Vaccinaction");
                return false;
            }
            if ($scope.Vaccinaction.IsFrequent == true) {
                $scope.Vaccinaction.IsFrequent = "Y";
            } else if ($scope.Vaccinaction.IsFrequent == false) {
                $scope.Vaccinaction.IsFrequent = "N";
            }



            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /* "ParentHospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterVaccinactionIsActive,
                "HistoryName": $scope.VaccinactionDesc,
                "HistoryId": $scope.masterVaccinactionId,
                "IsFrequent": $scope.Vaccinaction.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterVaccinationHistory(object).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterVaccinactionId === 0) {
                        alertify.success("Vaccinaction Added Successfully");
                    }
                    else {
                        if ($scope.masterVaccinactionIsActive) {
                            alertify.success("Vaccinaction Deleted Successfully");
                        }
                        else {
                            alertify.success("Vaccinaction Updated!");
                        }
                    }

                    $scope.CancelMasterVaccinactionClick();
                    getMasterVaccinactionItems();
                }
                if (response.data.Status === 'Failure') {

                    alertify.error(response.data.Message);
                    $scope.AllergyDesc = "";

                }
            })



        };
        $scope.SystamicObj = {
            "SystamicDescription": "",
            "ICD10CODE": "",
            "DiagnosisId": "",
            "SNOMED": "",
            "SNOMEDId": "",
            "SnomedCodeId": "",
            "ConceptId": "",
            "AddNewSystamic": false,
            "SystamicAddNewSNOMED": false,
            "IsFrequent": false
        };

        $scope.AddupdateSystamicClick = function () {

            //if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateAllergies) {
            //    alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            //    return false;
            //}
            if ($scope.SystamicObj.SystamicDescription === "" || $scope.SystamicObj.SystamicDescription === undefined) {
                alertify.error("Enter Past Medical History");
                return false;
            }

            if ($scope.SystamicObj.IsFrequent == true) {
                $scope.SystamicObj.IsFrequent = "Y";
            } else if ($scope.SystamicObj.IsFrequent == false) {
                $scope.SystamicObj.IsFrequent = "N";
            }
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*"ParentHospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterSystamicIsActive,
                "DiagnosisId": $scope.SystamicObj.DiagnosisId || null,
                "ICD10CODE": $scope.SystamicObj.ICD10CODE,
                "SNOMED": $scope.SystamicObj.ConceptId || "",      // ConceptId
                "SNOMEDId": $scope.SystamicObj.SnomedCodeId || null,  // SnomedCodeId
                "HistoryName": $scope.SystamicObj.SystamicDescription,
                "HistoryId": $scope.masterSystamicId,
                "IsFrequent": $scope.SystamicObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterSystemicHistory(object).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterSystamicId === 0) {
                        alertify.success("Systemic History Added Successfully");
                    }
                    else {
                        if ($scope.masterVaccinactionIsActive) {
                            alertify.success("Systemic History Deleted Successfully");
                        }
                        else {
                            alertify.success("Systemic History Updated!");
                        }
                    }

                    $scope.CancelMasterSystamicClick();
                    getMasterSystamicItems();
                    $scope.SystamicObj.ICDCODE = "";
                    $scope.SystamicObj.SNOMED = "";
                    $scope.SystamicObj.AddNewSystamic = false;
                    $scope.SystamicObj.SystamicAddNewSNOMED = false;
                }
                if (response.data.Status === 'Failure') {

                    alertify.error(response.data.Message);
                    $scope.AllergyDesc = "";

                }
            })



        };

        $scope.OcularObj = {
            "OcularDescription": "",
            "ICD10CODE": "",
            "DiagnosisId": "",
            "SNOMED": "",
            "SNOMEDId": "",
            "SnomedCodeId": "",
            "ConceptId": "",
            "AddNewOcular": false,
            "OcularAddNewSNOMED": false,
            "IsFrequent": false
        };

        $scope.AddupdateOcular = function () {

            //if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateAllergies) {
            //    alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            //    return false;
            //}
            if ($scope.OcularObj.OcularDescription === "" || $scope.OcularObj.OcularDescription === undefined) {
                alertify.error("Enter Ocular History");
                return false;
            }
            if ($scope.OcularObj.IsFrequent == true) {
                $scope.OcularObj.IsFrequent = "Y";
            } else if ($scope.OcularObj.IsFrequent == false) {
                $scope.OcularObj.IsFrequent = "N";
            }

            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                //"HospitalId": $scope.HospitalId,
                /*    "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterOcularIsActive,
                "DiagnosisId": $scope.OcularObj.DiagnosisId || null,
                "ICD10CODE": $scope.OcularObj.ICD10CODE,
                "SNOMED": $scope.OcularObj.ConceptId || "",       // ConceptId
                "SNOMEDId": $scope.OcularObj.SnomedCodeId || null,  // SnomedCodeId
                "HistoryName": $scope.OcularObj.OcularDescription,
                "HistoryId": $scope.masterOcularId,
                "IsFrequent": $scope.OcularObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterOcularId === 0) {
                        alertify.success("Ocular History Added Successfully");
                    }
                    else {
                        if ($scope.masterVaccinactionIsActive) {
                            alertify.success("Ocular History Deleted Successfully");
                        }
                        else {
                            alertify.success("Ocular History Updated!");
                        }
                    }

                    $scope.CancelMasterOcularClick();
                    getMasterOcularItems();
                    $scope.OcularObj.ICDCODE = "";
                    $scope.OcularObj.SNOMED = "";
                    $scope.OcularObj.AddNewOcular = false;
                    $scope.OcularObj.OcularAddNewSNOMED = false;
                }
                if (response.data.Status === 'Failure') {

                    alertify.error(response.data.Message);
                    $scope.AllergyDesc = "";

                }
            });


        };

        $scope.AddupdateICD10 = function (val, type) {
            $scope.Type = type || '';
            $scope.modalICD10Instance = $uibModal.open({
                "templateUrl": "templates/uibpopups/AddUpdateNewDiagnosispopup.html",
                "controller": "USAddUpdateNewDiagnosisPopupCtrl",
                "resolve": {
                    "Diagnosisval": function () { return val; },
                },
                "backdrop": "static",
                "keyboard": false,
                "size": "lg",
                //"windowClass": "inventory-full-popup",
            });
            $scope.modalICD10Instance.result.then(function (resp) {
                console.log(resp);
                if ($scope.Type == 'Ocular') {
                    if (resp.length > 0) {
                        $scope.OcularObj.DiagnosisId = resp[0].DiagnosisId;
                        $scope.OcularObj.ICD10CODE = resp[0].ICD10CODE;
                        $scope.OcularObj.AddNewOcular = false;
                    }
                }
                if ($scope.Type == 'Systamic') {
                    if (resp.length > 0) {
                        $scope.SystamicObj.DiagnosisId = resp[0].DiagnosisId;
                        $scope.SystamicObj.ICD10CODE = resp[0].ICD10CODE;
                        $scope.SystamicObj.AddNewSystamic = false;
                    }
                }

            }, function () { });
        }
        $scope.AddupdateSNOMED = function (val, type) {
            $scope.Type = type || '';
            $scope.modalICD10Instance = $uibModal.open({
                "templateUrl": "templates/uibpopups/AddUpdateNewSNOMEDpopup.html",
                "controller": "USAddUpdateNewSNOMEDPopupCtrl",
                "resolve": {
                    "SNOMEDval": function () { return val; },
                },
                "backdrop": "static",
                "keyboard": false,
                "size": "lg",
                //"windowClass": "inventory-full-popup",
            });
            $scope.modalICD10Instance.result.then(function (resp) {
                console.log(resp);
                if ($scope.Type == 'Ocular') {
                    if (resp.length > 0) {
                        $scope.OcularObj.SnomedCodeId = resp[0].SnomedCodeId;
                        $scope.OcularObj.ConceptId = resp[0].ConceptId;
                        $scope.OcularObj.OcularAddNewSNOMED = false;
                    }
                }
                if ($scope.Type == 'Systamic') {
                    if (resp.length > 0) {
                        $scope.SystamicObj.SnomedCodeId = resp[0].SnomedCodeId;
                        $scope.SystamicObj.ConceptId = resp[0].ConceptId;
                        $scope.SystamicObj.SystamicAddNewSNOMED = false;
                    }
                }
                if ($scope.Type == 'Allergy') {
                    if (resp.length > 0) {
                        $scope.Allergyobj.SnomedCodeId = resp[0].SnomedCodeId;
                        $scope.Allergyobj.ConceptId = resp[0].ConceptId;
                        $scope.Allergyobj.AllergyAddNewSNOMED = false;
                    }
                }

            }, function () { });
        }

        $scope.FunctionalObj = {
            "IsFrequent": false
        }
        $scope.AddupdateFunctional = function () {
            $scope.FunctionalDescription = $scope.FunctionalDescription || "";
            if ($scope.FunctionalDescription === "") {
                alertify.error("Enter Functional History");
                return false;
            }

            if ($scope.FunctionalObj.IsFrequent == true) {
                $scope.FunctionalObj.IsFrequent = "Y";
            } else if ($scope.FunctionalObj.IsFrequent == false) {
                $scope.FunctionalObj.IsFrequent = "N";
            }
            object = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /* "ParentHospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterFunctionalIsActive,
                "HistoryName": $scope.FunctionalDescription,
                "HistoryId": $scope.masterFunctionalId,
                "IsFrequent": $scope.FunctionalObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterFunctionalstatus(object).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterFunctionalId === 0) {
                        alertify.success("Functional History Added Successfully");
                    }
                    else {
                        if ($scope.masterFunctionalIsActive) {
                            alertify.success("Functional History Deleted Successfully");
                        }
                        else {
                            alertify.success("Functional History Updated!");
                        }
                    }

                    $scope.CancelMasterFunctionalClick();
                    getMasterFunctionalItems();
                }
                if (response.data.Status === 'Failure') {
                    alertify.error(response.data.Message);
                    $scope.FunctionalDescription = "";

                }
            })



        };

        $scope.OcularSurgObj = {
            "OcularDescription": "",
            "CPTObj": "",
            "CPTCode": "",
            "ProcedureId": "",
            "AddNewSurgHisCPT": false,
            "IsFrequent": false
        };

        $scope.AddupdateOcularSurgical = function () {
            $scope.OcularSurgObj.OcularSurgicalDescription = $scope.OcularSurgObj.OcularSurgicalDescription || "";
            if ($scope.OcularSurgObj.OcularSurgicalDescription === "") {
                alertify.error("Enter Ocular Surgical History");
                return false;
            }

            if ($scope.OcularSurgObj.IsFrequent == true) {
                $scope.OcularSurgObj.IsFrequent = "Y";
            } else if ($scope.OcularSurgObj.IsFrequent == false) {
                $scope.OcularSurgObj.IsFrequent = "N";
            }

            object = {

                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                //"ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterOcularSurgicalIsActive,
                "HistoryName": $scope.OcularSurgObj.OcularSurgicalDescription,
                "HistoryId": $scope.masterOcularSurgicalId,
                "CPTCode": $scope.OcularSurgObj.CPTCode,
                "ProcedureId": $scope.OcularSurgObj.ProcedureId,
                "IsFrequent": $scope.OcularSurgObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterOcularSurgicalHistory(object).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterOcularSurgicalId === 0) {
                        alertify.success("OcularSurgical History Added Successfully");
                    }
                    else {
                        if ($scope.masterOcularSurgicalIsActive) {
                            alertify.success("OcularSurgical History Deleted Successfully");
                        }
                        else {
                            alertify.success("OcularSurgical History Updated!");
                        }
                    }

                    $scope.CancelMasterOcularSurgicalClick();
                    getMasterOcularSurgicalItems();
                    $scope.OcularSurgObj.OcularSurgicalDescription = "";
                    $scope.OcularSurgObj.CPTObj = "";
                }
                if (response.data.Status === 'Failure') {
                    alertify.error(response.data.Message);

                }
            })



        };
        $scope.CurrentSystemicObj = {
            "IsFrequent": false
        }


        $scope.AddupdateCurrentSystemic = function () {
            $scope.CurrentSystemicDescription = $scope.CurrentSystemicDescription || "";
            if ($scope.CurrentSystemicDescription === "") {
                alertify.error("Enter Current Systemic History");
                return false;
            }

            if ($scope.CurrentSystemicObj.IsFrequent == true) {
                $scope.CurrentSystemicObj.IsFrequent = "Y";
            } else if ($scope.CurrentSystemicObj.IsFrequent == false) {
                $scope.CurrentSystemicObj.IsFrequent = "N";
            }
            object = {
                "ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "DeleteInd": $scope.masterCurrentSystemicIsActive,
                "HistoryName": $scope.CurrentSystemicDescription,
                "HistoryId": $scope.masterCurrentSystemicId,
                "IsFrequent": $scope.CurrentSystemicObj.IsFrequent
            };
            eHnoteSettingsDataService.AddUpdateMasterCurrentSystemicHistory(object).then(function (response) {
                if (response.data.Status === "Success") {
                    if ($scope.masterCurrentSystemicId === 0) {
                        alertify.success("Current Systemic History Added Successfully");
                    }
                    else {
                        if ($scope.masterCurrentSystemicIsActive) {
                            alertify.success("Current Systemic History Deleted Successfully");
                        }
                        else {
                            alertify.success("Current Systemic History Updated!");
                        }
                    }

                    $scope.CancelMasterCurrentSystemicClick();
                    getMasterCurrentSystemicItems();
                }
                if (response.data.Status === 'Failure') {
                    alertify.error(response.data.Message);
                    $scope.CurrentSystemicDescription = "";

                }
            })



        };

        $scope.CancelMasterVaccinactionClick = function () {
            $scope.masterVaccinactionId = 0;
            $scope.VaccinactionDesc = "";
            $scope.masterVaccinactionIsActive = false;
            $scope.showModifyMasterVaccinactionDiv = false;
            //$scope.masterLifestyleHistoryBtnName = "Save";
            $scope.masterVaccinactionBtnName = "Save";
            $scope.Vaccinaction.IsFrequent = false;
        };

        $scope.CancelMasterSystamicClick = function () {
            $scope.masterSystamicId = 0;
            $scope.SystamicObj.SystamicDescription = "";
            $scope.SystamicObj.ICD10CODE = "";
            $scope.SystamicObj.SNOMED = "";
            $scope.masterSystamicIsActive = false;
            $scope.showModifyMasterSystamicDiv = false;
            $scope.masterSystamicBtnName = "Save";
            $scope.SystamicObj.IsFrequent = false;
        };

        $scope.CancelMasterOcularClick = function () {
            $scope.masterOcularId = 0;
            $scope.OcularObj.OcularDescription = "";
            $scope.OcularObj.ICD10CODE = "";
            $scope.OcularObj.SNOMED = "";
            $scope.masterOcularIsActive = false;
            $scope.showModifyMasterOcularDiv = false;
            $scope.masterOcularBtnName = "Save";
            $scope.OcularObj.IsFrequent = false;
        };
        $scope.CancelMasterOcularSurgicalClick = function () {
            $scope.masterOcularSurgicalId = 0;
            $scope.OcularSurgObj.OcularSurgicalDescription = "";
            $scope.masterOcularSurgicalIsActive = false;
            $scope.showModifyMasterOcularSurgicalDiv = false;
            $scope.masterOcularSurgicalBtnName = "Save";
            $scope.OcularSurgObj.IsFrequent = false;
        };

        $scope.CancelMasterCurrentSystemicClick = function () {
            $scope.masterCurrentSystemicId = 0;
            $scope.CurrentSystemicDescription = "";
            $scope.masterCurrentSystemicIsActive = false;
            $scope.showModifyMasterCurrentSystemicDiv = false;
            $scope.masterCurrentSystemicBtnName = "Save";
            $scope.CurrentSystemicObj.IsFrequent = false;
        };
        $scope.CancelMasterFunctionalClick = function () {
            $scope.masterFunctionalId = 0;
            $scope.FunctionalDescription = "";
            $scope.masterFunctionalIsActive = false;
            $scope.showModifyMasterFunctionalstatusDiv = false;
            $scope.masterFunctionalBtnName = "Save";
            $scope.FunctionalObj.IsFrequent = false;
        };

        function getMasterVaccinactionItems() {
            var req = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /* "ParentHospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "AllergyType": 0,
                "PageSize": $scope.masterVaccinactionPageSize,
                "PageNumber": $scope.masterVaccinactionPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.VaccinationHistory = $scope.searchObj.VaccinationHistory || '';
            if ($scope.searchObj.VaccinationHistory != '') {
                req.SearchText = $scope.searchObj.VaccinationHistory;
                req.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterVaccinationHistory(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.MasterVaccinactionOrgArray = resp.data.VaccinationHistory;
                    $scope.masterVaccinactionItems = resp.data.count;
                }
                if ($scope.MasterVaccinactionOrgArray.length > 0) {
                    angular.forEach($scope.MasterVaccinactionOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }

            })
        }

        function getMasterSystamicItems() {
            var req = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /* "ParentHospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "AllergyType": 0,
                "PageSize": $scope.masterSystamicPageSize,
                "PageNumber": $scope.masterSystamicPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.SystemicHistory = $scope.searchObj.SystemicHistory || '';
            if ($scope.searchObj.SystemicHistory != '') {
                req.SearchText = $scope.searchObj.SystemicHistory;
                req.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterSystemicHistory(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.MasterSystemicOrgArray = resp.data.SystemicHistory;
                    $scope.masterSystemicItems = resp.data.count;
                }
                if ($scope.MasterSystemicOrgArray.length > 0) {
                    angular.forEach($scope.MasterSystemicOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }

            })
        }

        function getMasterOcularItems() {
            var req = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*     "HospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "AllergyType": 0,
                "PageSize": $scope.masterOcularPageSize,
                "PageNumber": $scope.masterVaccinactionPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.OcularOHistory = $scope.searchObj.OcularOHistory || '';
            if ($scope.searchObj.OcularOHistory != '') {
                req.SearchText = $scope.searchObj.OcularOHistory;
                req.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterOccularHistory(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.MasterOccularOrgArray = resp.data.OccularHistory;
                    $scope.masterOccularItems = resp.data.count;
                }

                if ($scope.MasterOccularOrgArray.length > 0) {
                    angular.forEach($scope.MasterOccularOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }
            })
        }
        function getMasterFunctionalItems() {
            var req = {
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                /*   "ParentHospitalId": parentHospitalId,*/
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "Type": 0,
                "PageSize": $scope.masterFunctionalPageSize,
                "PageNumber": $scope.masterFunctionalPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.FunctionalStatus = $scope.searchObj.FunctionalStatus || '';
            if ($scope.searchObj.FunctionalStatus != '') {
                req.SearchText = $scope.searchObj.FunctionalStatus;
                req.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterFunctionalstatus(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.MasterFunctionalstatusOrgArray = [];
                    $scope.MasterFunctionalstatusOrgArray = resp.data.FunctionalStatus;
                    $scope.masterFunctionalItems = resp.data.count;
                }
                if ($scope.MasterFunctionalstatusOrgArray.length > 0) {
                    angular.forEach($scope.MasterFunctionalstatusOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }
            })
        }

        function getMasterOcularSurgicalItems() {
            var req = {

                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": $scope.HospitalId,
                //"ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "Type": 0,
                "PageSize": $scope.masterOcularSurgicalPageSize,
                "PageNumber": $scope.masterOcularSurgicalPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.OcularSurgical = $scope.searchObj.OcularSurgical || '';
            if ($scope.searchObj.OcularSurgical != '') {
                req.SearchText = $scope.searchObj.OcularSurgical;
                req.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterOcularSurgicalHistory(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.MasterOcularSurgicalOrgArray = [];
                    $scope.MasterOcularSurgicalOrgArray = resp.data.OcularSurgicalHistory;
                    $scope.masterOcularSurgicalItems = resp.data.count;
                }
                if ($scope.MasterOcularSurgicalOrgArray.length > 0) {
                    angular.forEach($scope.MasterOcularSurgicalOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }



            })
        }

        function getMasterCurrentSystemicItems() {
            var req = {
                "ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "GetAllIndicator": 1,
                "SearchText": "",
                "Type": 0,
                "PageSize": $scope.masterCurrentSystemicPageSize,
                "PageNumber": $scope.masterCurrentSystemicPageNumber,
                "IsFrequent": "N"
            };
            $scope.searchObj.CurrentSystemic = $scope.searchObj.CurrentSystemic || '';
            if ($scope.searchObj.CurrentSystemic != '') {
                req.SearchText = $scope.searchObj.CurrentSystemic;
                req.PageNumber = 1;
            }
            eHnoteSettingsDataService.GetMasterCurrentSystemicMedications(req).then(function (resp) {

                if (resp.data.Status == "Success") {
                    $scope.MasterCurrentSystemicOrgArray = [];
                    $scope.MasterCurrentSystemicOrgArray = resp.data.CurrentSystemicMedicationsHistory;
                    $scope.masterCurrentSystemicItems = resp.data.count;
                }
                if ($scope.MasterCurrentSystemicOrgArray.length > 0) {
                    angular.forEach($scope.MasterCurrentSystemicOrgArray, function (item) {
                        if (item.IsFrequent == 'Y') {
                            item.IsFrequentind = true;
                        }
                        else {
                            item.IsFrequentind = false;
                        }
                    });
                }
            })
        }

        $scope.EditVaccinaction = function (item) {
            $scope.vaccinationFocus = true;
            $scope.showModifyMasterVaccinactionDiv = true;
            $scope.VaccinactionDesc = item.HistoryName;
            $scope.masterVaccinactionBtnName = "Update";
            $scope.masterVaccinactionId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.Vaccinaction.IsFrequent = true;
            } else {
                $scope.Vaccinaction.IsFrequent = false;
            }
        };

        $scope.EditSystamic = function (item) {
            $scope.systemicFocus = true;
            $scope.showModifyMasterSystamicDiv = true;
            $scope.SystamicObj.SystamicDescription = item.HistoryName;
            $scope.SystamicObj.ICD10CODE = item.ICD10CODE;
            $scope.SystamicObj.DiagnosisId = item.DiagnosisId;
            $scope.SystamicObj.SNOMED = item.SNOMED;
            $scope.SystamicObj.SNOMEDId = item.SNOMEDId;
            $scope.masterSystamicBtnName = "Update";
            $scope.masterSystamicId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.SystamicObj.IsFrequent = true;
            } else {
                $scope.SystamicObj.IsFrequent = false;
            }


        };

        $scope.EditOcular = function (item) {
            $scope.oculerFocus = true;
            $scope.showModifyMasterOcularDiv = true;
            $scope.OcularObj.OcularDescription = item.HistoryName;
            $scope.OcularObj.ICD10CODE = item.ICD10CODE;
            $scope.OcularObj.DiagnosisId = item.DiagnosisId;
            $scope.OcularObj.SNOMED = item.SNOMED;
            $scope.OcularObj.SNOMEDId = item.SNOMEDId;
            $scope.masterOcularBtnName = "Update";
            $scope.masterOcularId = item.HistoryId;
            $scope.masterSystamicId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.OcularObj.IsFrequent = true;
            } else {
                $scope.OcularObj.IsFrequent = false;
            }

        };

        $scope.EditFunctional = function (item) {
            $scope.functionalStatusFocus = true;
            $scope.showModifyMasterFunctionalstatusDiv = true;
            $scope.FunctionalDescription = item.HistoryName;
            $scope.masterFunctionalBtnName = "Update";
            $scope.masterFunctionalId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.FunctionalObj.IsFrequent = true;
            } else {
                $scope.FunctionalObj.IsFrequent = false;
            }
        };
        $scope.EditOcularSurgical = function (item) {
            $scope.oculerSurgicalFocus = true;
            $scope.showModifyMasterOcularSurgicalDiv = true;
            $scope.OcularSurgObj.OcularSurgicalDescription = item.HistoryName;
            $scope.OcularSurgObj.CPTCode = item.CPTCode;
            $scope.OcularSurgObj.CPTObj = item.CPTCode;
            $scope.masterOcularSurgicalBtnName = "Update";
            $scope.masterOcularSurgicalId = item.HistoryId;
            $scope.OcularSurgObj.AddNewSurgHisCPT = false;
            if (item.IsFrequent == "Y") {
                $scope.OcularSurgObj.IsFrequent = true;
            } else {
                $scope.OcularSurgObj.IsFrequent = false;
            }

        };
        $scope.EditCurrentSystemic = function (item) {
            $scope.currentSystemicFocus = true;
            $scope.showModifyMasterCurrentSystemicDiv = true;
            $scope.CurrentSystemicDescription = item.HistoryName;
            $scope.masterCurrentSystemicBtnName = "Update";
            $scope.masterCurrentSystemicId = item.HistoryId;
            if (item.IsFrequent == "Y") {
                $scope.CurrentSystemicObj.IsFrequent = true;
            } else {
                $scope.CurrentSystemicObj.IsFrequent = false;
            }
        };

        $scope.DeleteVaccinaction = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Vaccinaction ", function () {

                $scope.VaccinactionDesc = item.HistoryName;
                $scope.masterVaccinactionId = item.HistoryId;
                $scope.masterVaccinactionIsActive = true;
                $scope.Vaccinaction.IsFrequent = false;
                $scope.AddupdateVaccinaction();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.DeleteSystamic = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Systamic History", function () {

                $scope.SystamicObj.SystamicDescription = item.HistoryName;
                $scope.masterSystamicId = item.HistoryId;
                $scope.masterSystamicIsActive = true;
                $scope.SystamicObj.IsFrequent = false;
                $scope.AddupdateSystamicClick();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.DeleteOcular = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Ocular History", function () {

                $scope.OcularObj.OcularDescription = item.HistoryName;
                $scope.masterOcularId = item.HistoryId;
                $scope.masterOcularIsActive = true;
                $scope.OcularObj.IsFrequent = false;
                $scope.AddupdateOcular();
            }, function () {
                r = "You pressed Cancel!";
            });
        };
        $scope.DeleteFunctional = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Functional History", function () {

                $scope.FunctionalDescription = item.HistoryName;
                $scope.masterFunctionalId = item.HistoryId;
                $scope.masterFunctionalIsActive = true;
                $scope.FunctionalObj.IsFrequent = false;
                $scope.AddupdateFunctional();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.DeleteOcularSurgical = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Ocular Surgical History", function () {

                $scope.OcularSurgObj.OcularSurgicalDescription = item.HistoryName;
                $scope.masterOcularSurgicalId = item.HistoryId;
                $scope.masterOcularSurgicalIsActive = true;
                $scope.OcularSurgObj.IsFrequent = false;
                $scope.AddupdateOcularSurgical();
            }, function () {
                r = "You pressed Cancel!";
            });
        };
        $scope.DeleteCurrentSystemic = function (item) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Delete Current Systemic History", function () {

                $scope.CurrentSystemicDescription = item.HistoryName;
                $scope.masterCurrentSystemicId = item.HistoryId;
                $scope.masterCurrentSystemicIsActive = true;
                $scope.CurrentSystemicObj.IsFrequent = false;
                $scope.AddupdateCurrentSystemic();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.procedure = function () {
            $scope.btnCancelMasterProcedure();
        }
        $scope.changeOrgFilterBranch = function (item) {
            $scope.OrgListObj = item;
            $scope.FilterProcedureHospitalId = item.ClinicId;
            if (item.ClinicId === 0) {
                $scope.FilterAllHospitalsIndicator = 1;
            } else {
                $scope.FilterAllHospitalsIndicator = 0;
            }
            getMasterProcedureItems();
        };

        $scope.getBranchAppointmentTypes();

        $scope.Billingfacilities = 'Save';
        $scope.AddServiceFacilities = function () {
            $scope.showcondition = true;
            $scope.Billingfacilities = 'Save';
            $scope.newServiceFacilities = getServiceFacilities();
        }

        function getServiceFacilities() {
            var obj = {
                "UserId": $scope.UserId,
                "BranchId": doctorinfo.doctordata.UserAddress[0].ClinicId,
                "BranchName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "OrganizationBillingProviderId": 0,
                "OrganizationId": '',
                "FacilityTypeId": 0,
                "FacilityCode": "",
                "FacilityName": "",
                "PostalAddress1": "",
                "PostalAddress2": "",
                "PostalCityId": 0,
                "PostalCityName": "",
                "PostalStateId": 0,
                "PostalStateName": "",
                "PostalZipCode": "",
                "PostalCountryId": 0,
                "IsPostalAndPhysicalAddressSame": false,
                "PhysicalAddress1": "",
                "PhysicalAddress2": "",
                "PhysicalCityId": 0,
                "PhysicalCityName": "",
                "PhysicalStateId": 0,
                "PhysicalStateName": "",
                "PhysicalZipCode": "",
                "PhysicalCountryId": 0,
                "ContactMobileNumber": "",
                "ContactNumber": "",
                "ContactPersonName": "",
                "ContactAreaCode": "",
                "ContactCountryCode": "+1",
                "OtherMobileNumber": "",
                "OtherContactNumber": "",
                "OtherContactAreaCode": "",
                "OtherContactCountryCode": "+1",
                "FaxNumber": "",
                "Email": "",
                "NPI": "",
                "SSN": "",
                "TaxId": "",
                "TaxonomyId": "",
                "CLIAID": "",
                "MamGraphId": "",
                "IPA": "",
                "Notes": "",
                "ActiveInd": "Y",
                "DeleteInd": "N",
                "FromDate": "",
                "ToDate": "",
                "Motto": "",
                "WWW": "",
                "BillingProviderTypeId": "",
                "BillingProviderTypeName": "",
                "FacilityTypeId": "",
                "SpecializationId": $scope.SpecializationId || ""
            }
            return obj;
        }

        $scope.newServiceFacilities = getServiceFacilities();
        $scope.cities = [];
        //eHnotePatientAddressDataServices.getCities(2, getcitiesSuccess, getcitiesFailed);
        //function getcitiesSuccess(data) {
        //    $scope.cities = data;
        //}
        //function getcitiesFailed(data) {

        //}
        $scope.states = [];
        eHnotePatientAddressDataServices.getStates(2, getstatesSuccess, getstatesFailed);
        function getstatesSuccess(data) {
            $scope.states = data;
        }
        function getstatesFailed(data) {
        }
        $scope.changemobilenumber = function (phoneNumberString) {
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
                $scope.newServiceFacilities.ContactMobileNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.newServiceFacilities.ContactAreaCode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.newServiceFacilities.ContactNumber = contact;
                }
            } else {
                $scope.newServiceFacilities.ContactMobileNumber = "";
                $scope.newServiceFacilities.ContactAreaCode = "";
                $scope.newServiceFacilities.ContactNumber = "";
            }
        }


        //$scope.changeotherMobilenumber = function (phoneNumberString) {
        //    $scope.USAlternatenumberString = phoneNumberString || "";
        //    if ($scope.USAlternatenumberString != "") {
        //        console.log($scope.USAlternatenumberString);
        //        const match = phoneNumberString
        //            .replace(/\D+/g, '')
        //            .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
        //        const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
        //        const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
        //        const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
        //        //  return `${part1}${part2}${part3}`;
        //        $scope.newServiceFacilities.Othermobilenumber = part1 + part2 + part3;

        //        if ($scope.USAlternatenumberString.length > 9) {
        //            var Area = $scope.USAlternatenumberString.slice(0, 3);
        //            $scope.newServiceFacilities.OtherContactAreaCode = Area;
        //            var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
        //            $scope.newServiceFacilities.OtherContactNumber = contact;
        //        }
        //    } else {
        //        $scope.newServiceFacilities.Othermobilenumber = "";
        //        $scope.newServiceFacilities.OtherContactAreaCode = "";
        //        $scope.newServiceFacilities.OtherContactNumber = "";
        //    }
        //}

        $scope.changeotherMobilenumber = function (item) {
            item = item.toString() || "";
            if (item != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange(item);
                if (obj != undefined) {
                    if (obj.MobileNumber.length > 9) {
                        var Area = obj.MobileNumber.slice(0, 3);
                        $scope.newServiceFacilities.OtherContactAreaCode = Area;
                        var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                        $scope.newServiceFacilities.OtherContactNumber = contact;
                    }
                    else if (obj.MobileNumber.length <= 9) {
                        var Area = obj.MobileNumber.slice(0, 3);
                        $scope.newServiceFacilities.OtherContactAreaCode = Area;
                        var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                        $scope.newServiceFacilities.OtherContactNumber = contact;
                    }
                    $scope.newServiceFacilities.OtherMobileNumber = obj.UsFormatMobileNumber || "";
                }
            } else {
                $scope.newServiceFacilities.OtherMobileNumber = "";
                $scope.newServiceFacilities.OtherContactAreaCode = "";
                $scope.newServiceFacilities.OtherContactNumber = "";
            }
        }


        $scope.changeUsercity = function (type) {
            if (type == "") {
                $scope.newServiceFacilities.PostalCityName = "";
                $scope.newServiceFacilities.PostalCityId = 0;

            }
        }
        $scope.OnUserCity = function (item) {
            $scope.newServiceFacilities.PostalCityName = item.Name || "";
            $scope.newServiceFacilities.PostalCityId = item.Id;

            eHnotePatientAddressDataServices.SearchCity(item.Name).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.newServiceFacilities.PostalStateName = resp.data[0].StateName;
                    $scope.newServiceFacilities.PostalStateId = resp.data[0].StateId;
                }
            });
        }

        $scope.changeUserState = function (type) {
            if (type == "") {
                $scope.newServiceFacilities.PostalStateName = "";
                $scope.newServiceFacilities.PostalStateId = 0;

            }
        }
        $scope.ONUserchangeState = function (item, type) {
            if (type === "Postal") {
                $scope.newServiceFacilities.PostalStateName = item.Name;
                $scope.newServiceFacilities.PostalStateId = item.StateId;
                $scope.newServiceFacilities.PostalCityName = "";
            } else {
                $scope.newServiceFacilities.PhysicalStateName = item.Name;
                $scope.newServiceFacilities.PhysicalStateId = item.StateId;
                $scope.newServiceFacilities.PhysicalCityName = "";
            }
        }


        $scope.changeUserZipCode = function (val) {
            val = val || "";
            if (val.length >= 5) {
                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {
                        var basedZipcode = resp.data.rows || [];
                        if (basedZipcode.length !== 0) {

                            $scope.newServiceFacilities.PostalCityName = basedZipcode[0].CityName;
                            $scope.newServiceFacilities.PostalCityId = basedZipcode[0].CityId;
                            $scope.newServiceFacilities.PostalStateName = basedZipcode[0].StateName;
                            $scope.newServiceFacilities.PostalStateId = basedZipcode[0].StateId;
                        }
                    }
                });
            }

            else {
                $scope.newServiceFacilities.PostalCityName = "";
                $scope.newServiceFacilities.PostalCityId = 0;
                $scope.newServiceFacilities.PostalStateName = "";
                $scope.newServiceFacilities.PostalStateId = 0;

            }
        }
        $scope.changeUsercity1 = function (type) {
            if (type == "") {
                $scope.newServiceFacilities.PhysicalCityName = "";
                $scope.newServiceFacilities.PhysicalCityId = 0;

            }
        }
        $scope.OnUserCity1 = function (item) {
            $scope.newServiceFacilities.PhysicalCityName = item.Name || "";
            $scope.newServiceFacilities.PhysicalCityId = item.Id;

            eHnotePatientAddressDataServices.SearchCity(item.Name).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.newServiceFacilities.PhysicalStateName = resp.data[0].StateName;
                    $scope.newServiceFacilities.PhysicalStateId = resp.data[0].StateId;
                }
            });
        }
        $scope.changeUserState1 = function (type) {
            if (type == "") {
                $scope.newServiceFacilities.PhysicalStateName = "";
                $scope.newServiceFacilities.PhysicalStateId = 0;

            }
        }
        $scope.ONUserchangeState1 = function (item, type) {
            if (type === "Physical") {
                $scope.newServiceFacilities.PhysicalStateName = item.Name;
                $scope.newServiceFacilities.PhysicalStateId = item.StateId;
                $scope.newServiceFacilities.PhysicalCityName = "";
            } else {
                $scope.newServiceFacilities.PhysicalStateName = item.Name;
                $scope.newServiceFacilities.PhysicalStateId = item.StateId;
                $scope.newServiceFacilities.PhysicalCityName = "";
            }
        }


        $scope.changeUserZipCode1 = function (val) {
            if (val.length >= 5) {
                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {
                        var basedZipcode = resp.data.rows || [];
                        if (basedZipcode.length !== 0) {

                            $scope.newServiceFacilities.PhysicalCityName = basedZipcode[0].CityName;
                            $scope.newServiceFacilities.PhysicalCityId = basedZipcode[0].CityId;
                            $scope.newServiceFacilities.PhysicalStateName = basedZipcode[0].StateName;
                            $scope.newServiceFacilities.PhysicalStateId = basedZipcode[0].StateId;
                        }
                    }
                });
            }

            else {
                $scope.newServiceFacilities.PhysicalCityName = "";
                $scope.newServiceFacilities.PhysicalCityId = 0;
                $scope.newServiceFacilities.PhysicalStateName = "";
                $scope.newServiceFacilities.PhysicalStateId = 0;

            }

        }
        $scope.SameAddress = false;
        $scope.CopyUserPostalAddress = function (SameAddress) {
            if (SameAddress == true) {
                $scope.newServiceFacilities.PhysicalAddress1 = $scope.newServiceFacilities.PostalAddress1;
                $scope.newServiceFacilities.PhysicalAddress2 = $scope.newServiceFacilities.PostalAddress2;
                $scope.newServiceFacilities.PhysicalCityName = $scope.newServiceFacilities.PostalCityName;
                $scope.newServiceFacilities.PhysicalCityId = $scope.newServiceFacilities.PostalCityId;
                $scope.newServiceFacilities.PhysicalStateName = $scope.newServiceFacilities.PostalStateName;
                $scope.newServiceFacilities.PhysicalStateId = $scope.newServiceFacilities.PostalStateId;
                $scope.newServiceFacilities.PhysicalZipCode = $scope.newServiceFacilities.PostalZipCode;

            }
            else {
                $scope.newServiceFacilities.PhysicalAddress1 = "";
                $scope.newServiceFacilities.PhysicalAddress2 = "";
                $scope.newServiceFacilities.PhysicalCityName = "";
                $scope.newServiceFacilities.PhysicalCityId = 0;
                $scope.newServiceFacilities.PhysicalStateName = "";
                $scope.newServiceFacilities.PhysicalStateId = 0;
                $scope.newServiceFacilities.PhysicalZipCode = "";

            }

        }
        $scope.AllUserBranchesList = BrachesList;

        $scope.Clearservicefacilities = function () {
            $scope.showcondition = false;
            $scope.newServiceFacilities = getServiceFacilities();

        };

        $scope.ClickProviderActive = function (obj) {

            if (obj.IsActive) {
                obj.ActiveInd = "Y";
            } else {
                obj.ActiveInd = "N";
            }
        };


        $scope.Saveservicefacilities = function () {

            if ($scope.newServiceFacilities.FacilityTypeCode === "") {
                alertify.error("Please Enter FacilityCode ")
                return false;
            }
            if ($scope.newServiceFacilities.FacilityName === "") {
                alertify.error("Please Enter FacilityName ")
                return false;
            }
            if ($scope.newServiceFacilities.NPI === "") {
                alertify.error("Please Enter NPI ")
                return false;
            }
            if ($scope.newServiceFacilities.TaxId === "") {
                alertify.error("Please Enter TaxId")
                return false;
            }
            if ($scope.newServiceFacilities.TaxonomyId === "") {
                alertify.error("Please Enter TaxonomyId")
                return false;
            }

            if ($scope.newServiceFacilities.PostalAddress1 === "") {
                alertify.error("Please Enter PostalAddress1 ")
                return false;
            }

            if ($scope.newServiceFacilities.PostalAddress2 === "") {
                alertify.error("Please Enter PostalAddress2 ")
                return false;
            }
            if ($scope.newServiceFacilities.PostalCityName === "") {
                alertify.error("Please Enter PostalCityName ")
                return false;
            }
            if ($scope.newServiceFacilities.PostalStateName === "") {
                alertify.error("Please Enter PostalStateName ")
                return false;
            }
            if ($scope.newServiceFacilities.PostalZipCode === "") {
                alertify.error("Please Enter PostalZipCode")
                return false;
            }

            var Contactnumber = angular.copy($scope.newServiceFacilities.ContactMobileNumber) || "";
            if ($scope.newServiceFacilities.ContactMobileNumber != '' || $scope.newServiceFacilities.ContactMobileNumber != '') {
                if ((Contactnumber.toString()).length < 14) {
                    alertify.error("Please Enter Valid Mobile Number");
                    return false;
                }
            }
            var contactnumber = angular.copy($scope.newServiceFacilities.OtherMobileNumber) || "";
            if ($scope.newServiceFacilities.OtherMobileNumber != '' || $scope.newServiceFacilities.OtherMobileNumber != '') {
                if ((contactnumber.toString()).length < 14) {
                    alertify.error("Please Enter Valid Alternate Mobile Number");
                    return false;
                }
            }

            if ($scope.newServiceFacilities.Email == undefined) {
                alertify.error("Please Enter Valid Email");
                return false;
            }


            var params = {
                "UserId": $scope.UserId,
                "OrganizationBillingProviderId": $scope.newServiceFacilities.OrganizationBillingProviderId,
                "OrganizationId": $scope.hospid,
                "FacilityCode": $scope.newServiceFacilities.FacilityCode,
                "FacilityName": $scope.newServiceFacilities.FacilityName,
                "PostalAddress1": $scope.newServiceFacilities.PostalAddress1,
                "PostalAddress2": $scope.newServiceFacilities.PostalAddress2,
                "PostalCityId": $scope.newServiceFacilities.PostalCityId,
                "PostalCityName": $scope.newServiceFacilities.PostalCityName,
                "PostalStateId": $scope.newServiceFacilities.PostalStateId,
                "PostalStateName": $scope.newServiceFacilities.PostalStateName,
                "PostalZipCode": $scope.newServiceFacilities.PostalZipCode,
                "PostalCountryId": 0,
                "IsPostalAndPhysicalAddressSame": $scope.newServiceFacilities.IsPostalAndPhysicalAddressSame,
                "PhysicalAddress1": $scope.newServiceFacilities.PhysicalAddress1,
                "PhysicalAddress2": $scope.newServiceFacilities.PhysicalAddress2,
                "PhysicalCityId": $scope.newServiceFacilities.PhysicalCityId,
                "PhysicalCityName": $scope.newServiceFacilities.PhysicalCityName,
                "PhysicalStateId": $scope.newServiceFacilities.PhysicalStateId,
                "PhysicalStateName": $scope.newServiceFacilities.PhysicalStateName,
                "PhysicalZipCode": $scope.newServiceFacilities.PhysicalZipCode,
                "PhysicalCountryId": 0,
                "FaxNumber": $scope.newServiceFacilities.FaxNumber,
                "Email": $scope.newServiceFacilities.Email,
                "NPI": $scope.newServiceFacilities.NPI,
                "SSN": $scope.newServiceFacilities.SSN,
                "TaxId": $scope.newServiceFacilities.TaxId,
                "TaxonomyId": $scope.newServiceFacilities.TaxonomyId,
                "CLIAID": $scope.newServiceFacilities.CLIAID,
                "MamGraphId": $scope.newServiceFacilities.MamGraphId,
                "IPA": $scope.newServiceFacilities.IPA,
                "Notes": $scope.newServiceFacilities.Notes,
                "ActiveInd": 'Y',
                "DeleteInd": "N",
                "Motto": $scope.newServiceFacilities.Motto,
                "FromDate": $scope.newServiceFacilities.FromDate,
                "ToDate": $scope.newServiceFacilities.ToDate,
                "WWW": $scope.newServiceFacilities.WWW,
                "ContactMobileNumber": $scope.newServiceFacilities.ContactMobileNumber,
                "OtherMobileNumber": $scope.newServiceFacilities.OtherMobileNumber,
                "BillingProviderTypeId": $scope.newServiceFacilities.BillingProviderTypeId,
                "BillingProviderTypeName": $scope.newServiceFacilities.BillingProviderTypeName,
                "FacilityTypeCode": $scope.newServiceFacilities.FacilityTypeCode,
                "FacilityTypeId": $scope.newServiceFacilities.FacilityTypeId,
                "ContactNumber": $scope.newServiceFacilities.ContactNumber,
                "ContactAreaCode": $scope.newServiceFacilities.ContactAreaCode,
                "ContactCountryCode": $scope.newServiceFacilities.ContactCountryCode,
                "OtherContactNumber": $scope.newServiceFacilities.OtherContactNumber,
                "OtherContactAreaCode": $scope.newServiceFacilities.OtherContactAreaCode,
                "OtherContactCountryCode": $scope.newServiceFacilities.OtherContactCountryCode,
                "SpecializationId": $scope.newServiceFacilities.SpecializationId,
                "ContactPersonName": $scope.newServiceFacilities.ContactPersonName || ""
            }
            eHnoteSettingsDataService.AddupdateOrganizationServiceFacilities(params).then(function (resp) {
                console.log(resp.data.Status);

                if (resp.data.Status == "Success") {
                    if ($scope.newServiceFacilities.OrganizationBillingProviderId === 0) {
                        $scope.GetOrganizationFacilitiesNew(1);
                        alertify.success("Saved successfully");
                        $scope.newServiceFacilities = getServiceFacilities();
                    }
                    else {
                        $scope.GetOrganizationFacilitiesNew(1);
                        alertify.success("Updated successfully");
                        $scope.Billingfacilities = 'Save';
                        $scope.newServiceFacilities = getServiceFacilities();

                    }
                }


            }, function (error) {
                console.log(error);
            });


        }

        $scope.editProvidersFacilities = function (item) {
            $scope.billingFocus = true;
            $scope.showcondition = true;
            $scope.newServiceFacilities.OrganizationBillingProviderId = item.OrganizationBillingProviderId;
            $scope.newServiceFacilities.FacilityCode = item.FacilityCode;
            $scope.newServiceFacilities.FacilityName = item.FacilityName;
            $scope.newServiceFacilities.NPI = item.NPI;
            $scope.newServiceFacilities.TaxId = item.TaxId;
            $scope.newServiceFacilities.SSN = item.SSN;
            $scope.newServiceFacilities.TaxonomyId = item.TaxonomyId;
            $scope.newServiceFacilities.CLIAID = item.CLIAID;
            $scope.newServiceFacilities.MamGraphId = item.MamGraphId;
            $scope.newServiceFacilities.WWW = item.WWW;
            $scope.newServiceFacilities.Motto = item.Motto;
            $scope.newServiceFacilities.CLIAID = item.CLIAID;
            $scope.newServiceFacilities.Notes = item.Notes;
            $scope.newServiceFacilities.PostalAddress1 = item.PostalAddress1;
            $scope.newServiceFacilities.PostalAddress2 = item.PostalAddress2;
            $scope.newServiceFacilities.PostalStateName = item.PostalStateName;
            $scope.newServiceFacilities.PostalStateId = item.PostalStateId;
            $scope.newServiceFacilities.PostalCityName = item.PostalCityName;
            $scope.newServiceFacilities.PostalCityId = item.PostalCityId;
            $scope.newServiceFacilities.PostalZipCode = item.PostalZipCode;
            $scope.newServiceFacilities.PhysicalAddress1 = item.PhysicalAddress1;
            $scope.newServiceFacilities.PhysicalAddress2 = item.PhysicalAddress2;
            $scope.newServiceFacilities.PhysicalStateName = item.PhysicalStateName;
            $scope.newServiceFacilities.PhysicalStateId = item.PhysicalStateId;
            $scope.newServiceFacilities.PhysicalCityName = item.PhysicalCityName;
            $scope.newServiceFacilities.PhysicalCityId = item.PhysicalCityId;
            $scope.newServiceFacilities.PhysicalZipCode = item.PhysicalZipCode;
            $scope.newServiceFacilities.ContactMobileNumber = item.ContactMobileNumber;
            $scope.newServiceFacilities.OtherMobileNumber = item.OtherMobileNumber;
            $scope.newServiceFacilities.Email = item.Email;
            $scope.newServiceFacilities.FaxNumber = item.FaxNumber;
            $scope.newServiceFacilities.FromDate = item.FromDate;
            $scope.newServiceFacilities.ToDate = item.ToDate;
            $scope.newServiceFacilities.BillingProviderTypeId = item.BillingProviderTypeId;
            $scope.newServiceFacilities.BillingProviderTypeName = item.BillingProviderTypeName;
            $scope.newServiceFacilities.BillingProvidersType = item.BillingProvidersType;
            $scope.newServiceFacilities.FacilityTypeCode = item.FacilityTypeCode;
            $scope.newServiceFacilities.FacilityTypeId = item.FacilityTypeId
            $scope.newServiceFacilities.ContactNumber = item.ContactNumber;
            $scope.newServiceFacilities.ContactAreaCode = item.ContactAreaCode;
            $scope.newServiceFacilities.ContactCountryCode = item.ContactCountryCode;
            $scope.newServiceFacilities.OtherContactNumber = item.OtherContactNumber;
            $scope.newServiceFacilities.OtherContactAreaCode = item.OtherContactAreaCode;
            $scope.newServiceFacilities.OtherContactCountryCode = item.OtherContactCountryCode;
            $scope.newServiceFacilities.IsActive = false;
            if (item.ActiveInd === 'Y') {
                $scope.newServiceFacilities.IsActive = true;
            }

            $scope.Billingfacilities = 'Update';


            var phoneNumberString = $scope.newServiceFacilities.ContactAreaCode + $scope.newServiceFacilities.ContactNumber;
            $scope.changemobilenumber(phoneNumberString);

            var NumberString = $scope.newServiceFacilities.OtherContactAreaCode + $scope.newServiceFacilities.OtherContactNumber;
            $scope.changeotherMobilenumber(NumberString);
        }

        $scope.deleteProvidersFacilities = function (item) {
            var params = {
                "UserId": $scope.UserId,
                "OrganizationBillingProviderId": item.OrganizationBillingProviderId,
                "OrganizationId": $scope.hospid,
                "BillingProviderTypeId": item.BillingProviderTypeId,
                "FacilityCode": item.FacilityCode,
                "FacilityName": item.FacilityName,
                "NPI": item.NPI,
                "TaxId": item.TaxId,
                "SSN": item.SSN,
                "TaxonomyId": item.TaxonomyId,
                "CLIAID": item.CLIAID,
                "MamGraphId": item.MamGraphId,
                "WWW": item.WWW,
                "Motto": item.Motto,
                "CLIAID": item.CLIAID,
                "Notes": item.Notes,
                "PostalAddress1": item.PostalAddress1,
                "PostalAddress2": item.PostalAddress2,
                "PostalStateName": item.PostalStateName,
                "PostalStateId": item.PostalStateId,
                "PostalCityName": item.PostalCityName,
                "PostalCityId": item.PostalCityId,
                "PostalZipCode": item.PostalZipCode,
                "IsPostalAndPhysicalAddressSame": item.IsPostalAndPhysicalAddressSame,
                "PhysicalAddress1": item.PhysicalAddress1,
                "PhysicalAddress2": item.PhysicalAddress2,
                "PhysicalStateName": item.PhysicalStateName,
                "PhysicalStateId": item.PhysicalStateId,
                "PhysicalCityName": item.PhysicalCityName,
                "PhysicalCityId": item.PhysicalCityId,
                "PhysicalZipCode": item.PhysicalZipCode,
                "ContactMobileNumber": item.ContactMobileNumber,
                "OtherMobileNumber": item.OtherMobileNumber,
                "Email": item.Email,
                "FaxNumber": item.FaxNumber,
                "FromDate": item.FromDate,
                "ToDate": item.ToDate,
                "ActiveInd": item.ActiveInd,
                "DeleteInd": "Y",
                "FacilityTypeId": item.FacilityTypeId

            }
            eHnoteSettingsDataService.AddupdateOrganizationServiceFacilities(params).then(function (resp) {
                console.log(resp.data.Status);

                if (resp.data.Status == "Success") {
                    $scope.GetOrganizationFacilitiesNew(1);
                    alertify.success("Deleted successfully");
                }


            }, function (error) {
                console.log(error);
            });
        }



        $scope.getMasteBillingProviderdeatails = function () {

            eHnoteSettingsDataService.GetMasteBillingProviderTypes().then(function (resp) {
                $scope.BillingFacilityList = [];
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.BillingFacilityList = resp.data.rows;
                    }
                }
            }, function (error) {
                console.log(resp);
            });

        }
        $scope.getMasteBillingProviderdeatails();

        $scope.changeBillingActive = function (item) {
            if (item.ActiveInd == 'N') {
                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": item.OrganizationId,
                    "OrganizationBillingProviderId": item.OrganizationBillingProviderId,
                    "ActiveInd": "Y",
                }
                eHnoteSettingsDataService.UpdateBillingProviderActiveStatus(params).success(function (data) {
                    if (data.Status === "Success") {
                        $scope.GetOrganizationFacilitiesNew(1);
                        alertify.success('Activated Successfully');
                    }
                }).error(function (error) {

                });
            }
            if (item.ActiveInd == 'Y') {
                var params = {
                    "UserId": $scope.UserId,
                    "HospitalId": item.OrganizationId,
                    "OrganizationBillingProviderId": item.OrganizationBillingProviderId,
                    "ActiveInd": "N",
                }
                eHnoteSettingsDataService.UpdateBillingProviderActiveStatus(params).success(function (data) {
                    if (data.Status === "Success") {
                        $scope.GetOrganizationFacilitiesNew(1);
                        alertify.success('Inactivated Successfully');
                    }
                }).error(function (error) {

                });
            }
        }



        $scope.GetFacilityTypesdeatils = function () {
            eHnoteSettingsDataService.GetMasterFacilityTypes().then(function (response) {
                $scope.BillingFacilityTypesArray = [];
                if (response.data.status == "Success") {
                    if (response.data.rows.length > 0) {
                        $scope.BillingFacilityTypesArray = response.data.rows || [];
                    }
                } else {
                    alertify.error(response.data.Meassage);
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.GetFacilityTypesdeatils();

        //---------Bill item -----
        //function getcptmasterprocedureobj() {
        //    var obj = {
        //        "SearchText": "",
        //        "PageSize": 20,
        //        "PageNumber": 1
        //    };
        //    return obj;
        //};
        //$scope.CPTmasterprocedureobj = getcptmasterprocedureobj();
        $scope.GetMasterCPTProcedure = function (val) {
            var param = {
                "SearchText": val || "",
                "PageSize": 10,
                "PageNumber": 1,
                "TypeOfServiceId": 0
            }
            return eHnoteSettingsDataService.GetMasterProceduresNew(param).then(function (response) {
                console.log(response);
                if (response.data.Status == "Success") {
                    var array = response.data.rows || [];
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);

            });
        };
        $scope.getModifier = function (val) {
            val = val || '';
            return eHnoteSettingsDataService.GetMasterModifiers(val).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        }

        function getOrgProcedureObj() {
            var obj = {
                "OrganizationId": $scope.hospid,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": "", // searchtext
                "ServicesTypeId": 0,
                "ProcedurePayorPlanId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "TempCount": 1,
                "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": 0 }, true)[0]
            };
            return obj;
        };
        $scope.GetOrganizationProcedureObj = getOrgProcedureObj();
        $scope.GetOrganizationProcedureList = [];

        $scope.GetOrganizationProcedure = function (pagenumber) {
            if (pagenumber == 1) {
                $scope.GetOrganizationProcedureObj.PageNumber = 1;
            }
            var obj = {
                "OrganizationId": $scope.GetOrganizationProcedureObj.OrganizationId,
                "ProcedureId": 0,
                "CPTCODE": $scope.GetOrganizationProcedureObj.CPTCODE || "",  // cptcode tblorganizationprocedure
                "SearchText": $scope.GetOrganizationProcedureObj.SearchText || "", // searchtext
                "TypeOfServiceId": $scope.GetOrganizationProcedureObj.ServicesTypeId || 0,
                "ProcedurePayorPlanId": $scope.GetOrganizationProcedureObj.ProcedurePayorPlanId || 0,
                "PageNumber": $scope.GetOrganizationProcedureObj.PageNumber || 1,
                "PageSize": $scope.GetOrganizationProcedureObj.PageSize || 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": parentHospitalId,
                "IsFrequent": "N",
                "Status": 0 // All - 0, Active - 1, InActive -2
            };

            if ($scope.GetOrganizationProcedureObj.OrganizationId == 0) {
                obj.GetAllIndicator = 1;
            } else if ($scope.GetOrganizationProcedureObj.OrganizationId != 0) {
                obj.GetAllIndicator = 0;
            }


            eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                console.log(response);
                if (response.data.Status == "Success") {
                    $scope.GetOrganizationProcedureList = response.data.rows || [];
                    $scope.GetOrganizationProcedureObj.TempCount = response.data.count;
                    if ($scope.GetOrganizationProcedureList.length > 0) {
                        angular.forEach($scope.GetOrganizationProcedureList, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentInd = true;
                            }
                            else {
                                item.IsFrequentInd = false;
                            }
                        });
                    }
                }

            }, function (error) {
                console.log(error);

            });
        };

        $scope.GetOrganizationProcedureSearch = function (pagenumber) {
            if (pagenumber == 1) {
                $scope.GetOrganizationProcedureObj.PageNumber = 1;
            }
            var obj = {
                "OrganizationId": $scope.GetOrganizationProcedureObj.OrganizationId,
                "ProcedureId": 0,
                "CPTCODE": $scope.GetOrganizationProcedureObj.CPTCODE || "",  // cptcode tblorganizationprocedure
                "SearchText": $scope.GetOrganizationProcedureObj.SearchText || "", // searchtext
                "TypeOfServiceId": $scope.GetOrganizationProcedureObj.ServicesTypeId || 0,
                "ProcedurePayorPlanId": $scope.GetOrganizationProcedureObj.ProcedurePayorPlanId || 0,
                "PageNumber": $scope.GetOrganizationProcedureObj.PageNumber || 1,
                "PageSize": $scope.GetOrganizationProcedureObj.PageSize || 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": parentHospitalId,
                "IsFrequent": "N",
                "Status": 0 // All - 0, Active - 1, InActive -2
            };

            if ($scope.GetOrganizationProcedureObj.OrganizationId == 0) {
                obj.GetAllIndicator = 1;
            } else if ($scope.GetOrganizationProcedureObj.OrganizationId != 0) {
                obj.GetAllIndicator = 0;
            }


            eHnoteSettingsDataService.GetOrganizationProceduresSearch(obj).then(function (response) {
                console.log(response);
                if (response.data.Status == "Success") {
                    $scope.GetOrganizationProcedureList = response.data.rows || [];
                    $scope.GetOrganizationProcedureObj.TempCount = response.data.count;
                    if ($scope.GetOrganizationProcedureList.length > 0) {
                        angular.forEach($scope.GetOrganizationProcedureList, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentInd = true;
                            }
                            else {
                                item.IsFrequentInd = false;
                            }
                        });
                    }
                }

            }, function (error) {
                console.log(error);

            });
        };
        $scope.ClearOrganizationProcedure = function () {
            $scope.GetOrganizationProcedureObj = getOrgProcedureObj();
            $scope.GetOrganizationProcedureSearch(1);
        }

        function getMainOrganizationProcedureObj() {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationProcedureId": 0,
                "ProcedureId": 0,   //CPTCode Id
                "TypeOfServiceId": 0,  // Type of procedure id
                "OrganizationId": $scope.hospid,
                "ProcedureCode": "",
                "ProcedurePayorPlanId": "",
                "ProcedurePayorPlanName": "",
                "ProcedureName": "",
                "ProcedureDescription": "",
                "Notes": "",
                "ModifierId": 0,
                "IsFrequent": false,
                "CliaIDRequired": false,
                "MamographyCertificateRequired": false,
                "RefferingProviderRequired": false,
                "PatientRecall": false,
                "PatientRecallDays": "",
                "SlidingScaleRequired": false,
                "SlidingScaleAmount": "",
                "ApplyGlobalPeriod": false,
                "ApplyGlobalPeriodDays": "",
                "NDCCode": "",
                "RevenueCode": "",
                "UnitValue": "",
                "AnesthesiaValue": "",
                "GeneralCost": "",
                "IsActive": true,
                "DeleteInd": "N",
                "GetAllIndicator": 0,
                "ParentOrganizationId": parentHospitalId,
                "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId":0}, true)[0],
                "CPTCodeProcedureObj": "",
                "ModifierObj": ""
            };

            return obj;
        }
        $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();

        $scope.changePayorPlanType = function (id) {

            let filterStatus = $filter("filter")($scope.PayorProcedureTypes, { "ProcedurePayorPlanId": id }, true) || [];
            if (filterStatus.length > 0) {
                $scope.MainOrganizationProcedureObj.ProcedurePayorPlanName = filterStatus[0].ProcedurePayorPlanName;

                $scope.MainOrganizationProcedureObj.TypeOfServiceId = filterStatus[0].ProcedurePayorPlanId;
            }

        }

        $scope.addUpdateMasterProcClick = function () {

            $scope.MainOrganizationProcedureObj.ProcedureId = $scope.MainOrganizationProcedureObj.ProcedureId || 0;
            $scope.NewCPTObj.CPTCode = $scope.NewCPTObj.CPTCode || "";
            $scope.MainOrganizationProcedureObj.CPTCode = $scope.NewCPTObj.CPTCode;

            if ($scope.MainOrganizationProcedureObj.ProcedureId == 0 && $scope.NewCPTObj.CPTCode =='') {
                alertify.error("Please Select CPT Code");
                return false;
            }
            $scope.MainOrganizationProcedureObj.TypeOfServiceId = $scope.MainOrganizationProcedureObj.TypeOfServiceId || 0;
            if ($scope.MainOrganizationProcedureObj.TypeOfServiceId == 0) {
                alertify.error("Please Select Type");
                return false;
            }
            $scope.MainOrganizationProcedureObj.ProcedureCode = $scope.MainOrganizationProcedureObj.ProcedureCode || "";
            if ($scope.MainOrganizationProcedureObj.ProcedureCode == "") {
                alertify.error("Please Enter Procedure Code");
                return false;
            }
            $scope.MainOrganizationProcedureObj.ProcedureName = $scope.MainOrganizationProcedureObj.ProcedureName || "";
            if ($scope.MainOrganizationProcedureObj.ProcedureName === "") {
                alertify.error("Please Enter Procedure Name");
                return false;
            }


            $scope.MainOrganizationProcedureObj.PatientRecallDays = parseInt($scope.MainOrganizationProcedureObj.PatientRecallDays) || 0;
            $scope.MainOrganizationProcedureObj.ApplyGlobalPeriodDays = parseInt($scope.MainOrganizationProcedureObj.ApplyGlobalPeriodDays) || 0;

            $scope.MainOrganizationProcedureObj.UnitValue = parseFloat($scope.MainOrganizationProcedureObj.UnitValue) || 0;
            $scope.MainOrganizationProcedureObj.AnesthesiaValue = parseFloat($scope.MainOrganizationProcedureObj.AnesthesiaValue) || 0;
            $scope.MainOrganizationProcedureObj.SlidingScaleAmount = parseFloat($scope.MainOrganizationProcedureObj.SlidingScaleAmount) || 0;
            $scope.MainOrganizationProcedureObj.GeneralCost = parseFloat($scope.MainOrganizationProcedureObj.GeneralCost) || 0;

            if ($scope.MainOrganizationProcedureObj.OrganizationId != 0) {
                $scope.MainOrganizationProcedureObj.GetAllIndicator = 0;
            }
            else if ($scope.MainOrganizationProcedureObj.OrganizationId == 0) {
                $scope.MainOrganizationProcedureObj.GetAllIndicator = 1;
            }
           
            if ($scope.MainOrganizationProcedureObj.IsFrequent == true) {
                $scope.MainOrganizationProcedureObj.IsFrequent = "Y";
            } else if ($scope.MainOrganizationProcedureObj.IsFrequent == false) {
                $scope.MainOrganizationProcedureObj.IsFrequent = "N";
            }

            eHnoteSettingsDataService.AddUpdateOrganizationProceduresNew($scope.MainOrganizationProcedureObj).success(function (response) {

                if (response.Status === 'Success') {
                    if ($scope.MainOrganizationProcedureObj.OrganizationProcedureId == 0) {
                        alertify.success('Procedure Added Successfully');
                    } else {
                        alertify.success('Procedure Updated Successfully');
                    }
                    $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();
                    $scope.GetOrganizationProcedure();
                }
                if (response.status === 'Failure') {
                    alertify.error(response.Message);
                }
            }).error(function (error) {
                alertify.error("Error Occured");
            });
        };

        $scope.NewCPTObj = {
            "CPTCode":'',
        }

        $scope.onSelectCptCodeProcedure = function (Obj, MainObj) {
            if (Obj != undefined) {
                $scope.MainOrganizationProcedureObj.ProcedureId = Obj.ProcedureId;
                $scope.MainOrganizationProcedureObj.TypeOfServiceId = Obj.ServicesTypeId;
                $scope.MainOrganizationProcedureObj.ProcedureCode = Obj.CPTCode;
                $scope.MainOrganizationProcedureObj.ProcedureName = Obj.ProcedureName;
            }
        };
        $scope.ChangeCptCodeProcedure = function (MainObj) {
            $scope.MainOrganizationProcedureObj.ProcedureId = 0;
            $scope.MainOrganizationProcedureObj.TypeOfServiceId = 0;
            $scope.MainOrganizationProcedureObj.ProcedureCode = "";
            $scope.NewCPTObj.CPTCode = MainObj.CPTCodeProcedureObj;
        };

        $scope.onSelectModifier = function (Obj, MainObj) {
            $scope.MainOrganizationProcedureObj.ModifierId = Obj.MODIFIERID;
        };
        $scope.ChangeModifier = function (Obj) {
            $scope.MainOrganizationProcedureObj.ModifierId = 0;
        };
        $scope.CancelOrganProcedure = function () {
            $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();
        };
        $scope.MasterProcedurePagechanged = function (pagenumber) {
            $scope.GetOrganizationProcedureObj.PageNumber = pagenumber;
            $scope.GetOrganizationProcedure();
        };

        $scope.ChangeHospitalinProcedure = function (item) {
            $scope.MainOrganizationProcedureObj.BranchObj = item;
            $scope.MainOrganizationProcedureObj.OrganizationId = item.BranchId;
            if (item.BranchId === 0 && $scope.AllUserBranchesList.length > 0) {
                $scope.MainOrganizationProcedureObj.HospitalIdList = $scope.AllUserBranchesList
                    .map(function (branch) {
                        return branch.BranchId;
                    }).join(',');
            }
        };

        $scope.ChangesGetProcedureBranch = function (item) {
            $scope.GetOrganizationProcedureObj.BranchObj = item;
            $scope.GetOrganizationProcedureObj.OrganizationId = item.BranchId;
        }

        $scope.ChangesActiveStatusForProcedure = function (item, active) {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "OrganizationProcedureId": item.OrganizationProcedureId,
                "IsActive": active,
            };
            eHnoteSettingsDataService.UpdateActiveStatusForProcedures(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status === "Success") {
                    item.IsActive = active;
                    $scope.GetOrganizationProcedure();
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.editMasterTreatItem1 = function (item, index) {
            $scope.proceduresFocus = true;
            $scope.addedNewProcedure = true;
            $scope.MainOrganizationProcedureObj.TypeOfServiceId = item.TypeOfServiceId;
            $scope.MainOrganizationProcedureObj.ProcedureCode = item.ProcedureCode;
            $scope.MainOrganizationProcedureObj.ProcedureName = item.ProcedureName;
            $scope.MainOrganizationProcedureObj.ProcedureDescription = item.ProcedureDescription || "";
            $scope.MainOrganizationProcedureObj.GeneralCost = item.GeneralCost || "";
            $scope.MainOrganizationProcedureObj.ModifierObj = item.ModifierName || "";
            $scope.MainOrganizationProcedureObj.ModifierId = item.ModifierId || 0;
            $scope.MainOrganizationProcedureObj.RevenueCode = item.RevenueCode || "";
            $scope.MainOrganizationProcedureObj.UnitValue = item.UnitValue || "";
            $scope.MainOrganizationProcedureObj.AnesthesiaValue = item.AnesthesiaValue || "";
            $scope.MainOrganizationProcedureObj.NDCCode = item.NDCCode || "";
            $scope.MainOrganizationProcedureObj.OrganizationProcedureId = item.OrganizationProcedureId || "";
            $scope.MainOrganizationProcedureObj.ProcedureId = item.ProcedureId || "";
            $scope.MainOrganizationProcedureObj.ProcedurePayorPlanId = item.ProcedurePayorPlanId || "";
            $scope.MainOrganizationProcedureObj.ProcedurePayorPlanName = item.ProcedurePayorPlanName || "";

            $scope.MainOrganizationProcedureObj.CPTCodeProcedureObj = {
                "ProcedureName": item.CPTCodeProcedureName,
                "CPTCode": item.CPTCode
            }

            //$scope.MainOrganizationProcedureObj.IsFrequent = item.IsFrequent;

            if (item.IsFrequent == "Y") {
                $scope.MainOrganizationProcedureObj.IsFrequent = true;
            } else {
                $scope.MainOrganizationProcedureObj.IsFrequent = false;
            }

            $scope.MainOrganizationProcedureObj.MamographyCertificateRequired = item.MamographyCertificateRequired;
            $scope.MainOrganizationProcedureObj.RefferingProviderRequired = item.RefferingProviderRequired;
            $scope.MainOrganizationProcedureObj.CliaIDRequired = item.CliaIDRequired;
            $scope.MainOrganizationProcedureObj.PatientRecall = item.PatientRecall;
            $scope.MainOrganizationProcedureObj.PatientRecallDays = item.PatientRecallDays || "";
            $scope.MainOrganizationProcedureObj.SlidingScaleRequired = item.SlidingScaleRequired;
            $scope.MainOrganizationProcedureObj.SlidingScaleAmount = item.SlidingScaleAmount || "";
            $scope.MainOrganizationProcedureObj.ApplyGlobalPeriod = item.ApplyGlobalPeriod;
            $scope.MainOrganizationProcedureObj.ApplyGlobalPeriodDays = item.ApplyGlobalPeriodDays || "";
            $scope.MainOrganizationProcedureObj.Notes = item.Notes || "";
            $scope.MainOrganizationProcedureObj.IsActive = item.IsActive;

        };



        $scope.clickhealthplansuibpopup = function (item) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "healthplansuibpopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                //"size": "lg",
                "windowClass": "appointment-full-popup",
                "resolve": {
                    "ViewItem": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, ViewItem) {
                    $scope.GetHealthPlanObj = ViewItem || "";
                    $scope.closehealthplansuibpopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        }

        $scope.ChangeBillItemTab = function (menu) {
            $scope.BillItemTabActive = menu;
            $scope.getModifier1();
        };

        $scope.InsuranceClassActiveMenu1 = function (menu) {
            return (menu === $scope.BillItemTabActive) ? "active" : "";
        };

        $scope.AddCreateFeePopUp = function (item) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/settings/CreateFreePopUp.html",
                //"size": "lg",
                /* "controller": "USAddnewAssessmentpopupCtrl",*/
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__sixty--",
                "resolve": {
                    "EditItem": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, EditItem) {

                    function GetPayorProcedureFeeObj() {
                        var obj = {
                            "UserId": $scope.UserId,
                            "OrganizationProcedurePayorId": 0,
                            "OrganizationProcedureId": 0,
                            "OrganizationPayorId": 0,
                            "OrganizationId": $scope.HospitalId,
                            "ProcedureId": 0,
                            "ModifierId": 0,
                            "RequirePreAuth": false,
                            "ProvedureNotCoveredByInsurance": false,
                            "CapitatedService": false,
                            "ActualCost": null,
                            "PreviousYearCost": null,
                            "InFacilityActualCost": null,
                            "InFacilityPreviousYearCost": null,
                            "UnitValueCost": null,
                            "AnesthesiaCost": null,
                            "Remarks": "",
                            "IsActive": true,
                            "DeleteInd": "N",
                            "PayorObj": "",
                            "ProcedureObj": "",
                            "CptcodeObj": "",
                            "GeneralCost": null,
                            "OfficeActualCost": null,
                            "IsReferralRequired": false,
                            "StartDate": null,
                            "EndDate": null,
                        };
                        return obj;
                    };
                    $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                    if (EditItem != undefined) {
                        $scope.PayorProcedureFeeObj.PayorObj = EditItem.PayorName || "";
                        $scope.PayorProcedureFeeObj.OrganizationProcedurePayorId = EditItem.OrganizationProcedurePayorId;
                        $scope.PayorProcedureFeeObj.OrganizationPayorId = EditItem.OrganizationPayorId || "";
                        $scope.PayorProcedureFeeObj.OrganizationProcedureId = EditItem.OrganizationProcedureId || "";
                        $scope.PayorProcedureFeeObj.ProcedureObj = EditItem.ProcedureName || "";
                        $scope.PayorProcedureFeeObj.ProcedureId = EditItem.ProcedureId;
                        $scope.PayorProcedureFeeObj.CptcodeObj = EditItem.CPTCode || "";
                        $scope.PayorProcedureFeeObj.ModifierId = EditItem.ModifierId || "";
                        $scope.PayorProcedureFeeObj.Remarks = EditItem.Remarks || "";
                        $scope.PayorProcedureFeeObj.ActualCost = EditItem.ActualCost || null;
                        $scope.PayorProcedureFeeObj.PreviousYearCost = EditItem.PreviousYearCost || null;
                        $scope.PayorProcedureFeeObj.UnitValueCost = EditItem.UnitValueCost || null;
                        $scope.PayorProcedureFeeObj.InFacilityActualCost = EditItem.InFacilityActualCost || null;
                        $scope.PayorProcedureFeeObj.InFacilityPreviousYearCost = EditItem.InFacilityPreviousYearCost || null;
                        $scope.PayorProcedureFeeObj.AnesthesiaCost = EditItem.AnesthesiaCost || null;
                        $scope.PayorProcedureFeeObj.RequirePreAuth = EditItem.RequirePreAuth;
                        $scope.PayorProcedureFeeObj.ProvedureNotCoveredByInsurance = EditItem.ProvedureNotCoveredByInsurance;
                        $scope.PayorProcedureFeeObj.CapitatedService = EditItem.CapitatedService;
                        $scope.PayorProcedureFeeObj.IsReferralRequired = EditItem.IsReferralRequired;
                        $scope.PayorProcedureFeeObj.IsActive = EditItem.IsActive;
                        $scope.PayorProcedureFeeObj.GeneralCost = EditItem.GeneralCost || null;
                        $scope.PayorProcedureFeeObj.OfficeActualCost = EditItem.OfficeActualCost || null;
                        $scope.PayorProcedureFeeObj.OfficePreviousYearCost = EditItem.OfficePreviousYearCost || null;
                        $scope.PayorProcedureFeeObj.OfficeValueCost = EditItem.OfficeValueCost || null;
                    }
                    $scope.onClickPayor = function (Obj, MainObj) {
                        MainObj.OrganizationPayorId = Obj.OrganizationPayorId;
                    };
                    $scope.ChangePayor = function (MainObj) {
                        MainObj.OrganizationPayorId = 0;
                    }
                    $scope.SearchPayorByText = function (SearchText) {
                        var param = {
                            "SearchText": SearchText || "",
                            "Status": "Active",
                            "PageSize": 10,
                            "PageNumber": 1,
                            "UserId": $scope.UserId,
                            "SpecializationId": $scope.SpecializationId,
                            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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
                        });
                    };

                    $scope.GetOrganizationProcedure = function (val) {

                        var obj = {
                            "OrganizationId": $scope.PayorProcedureFeeObj.OrganizationId,
                            "ProcedureId": 0,
                            "CPTCODE": "",  // cptcode tblorganizationprocedure
                            "SearchText": val || "", // searchtext
                            "TypeOfServiceId": 0,
                            "PageNumber": 1,
                            "PageSize": 10,
                            "GetAllIndicator": 0,
                            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                            "IsFrequent": "N",
                            "Status": 1
                        };
                        return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                            console.log(response);
                            if (response.data.Status == "Success") {
                                if (response.data.rows !== undefined) {
                                    return response.data.rows.map(function (item) {
                                        return item;
                                    });
                                }
                            }
                        });
                    };
                    $scope.onClickProcedure = function (Obj, MainObj) {
                        MainObj.OrganizationProcedureId = Obj.OrganizationProcedureId;
                        MainObj.ProcedureId = Obj.ProcedureId;
                        MainObj.CptcodeObj = Obj.CPTCode;
                        MainObj.GeneralCost = Obj.GeneralCost;
                        $scope.PayorProcedureFeeObj.ActualCost = Obj.GeneralCost;
                    };
                    $scope.ChangeProcedure = function (MainObj) {
                        MainObj.OrganizationProcedureId = 0;
                        // MainObj.ProcedureId = 0;
                        // MainObj.CptcodeObj = "";
                    };
                    $scope.GetMasterCPTProcedure = function (val) {
                        var param = {
                            "SearchText": val || "",
                            "PageSize": 10,
                            "PageNumber": 1,
                            "TypeOfServiceId": 0
                        }
                        return eHnoteSettingsDataService.GetMasterProceduresNew(param).then(function (response) {
                            console.log(response);
                            if (response.data.Status == "Success") {
                                var array = response.data.rows || [];
                                if (response.data.rows !== undefined) {
                                    return response.data.rows.map(function (item) {
                                        return item;
                                    });
                                }
                            }
                        });
                    };
                    $scope.onSelectCptCodeProcedure = function (Obj, MainObj) {
                        MainObj.ProcedureObj = "";
                        MainObj.OrganizationProcedureId = 0;
                        MainObj.ProcedureId = Obj.ProcedureId;
                        MainObj.CptcodeObj = Obj.CPTCode + '-' + Obj.ProcedureName;
                    };
                    $scope.ChangeCptCodeProcedure = function (MainObj) {
                        MainObj.ProcedureId = 0;
                        MainObj.ProcedureObj = "";
                        MainObj.OrganizationProcedureId = 0;
                    };


                    $scope.SaveFeeDetails = function () {

                        $scope.PayorProcedureFeeObj.ActualCost = $scope.PayorProcedureFeeObj.ActualCost || '';
                        $scope.PayorProcedureFeeObj.InFacilityActualCost = $scope.PayorProcedureFeeObj.InFacilityActualCost || '';
                        $scope.PayorProcedureFeeObj.OfficeActualCost = $scope.PayorProcedureFeeObj.OfficeActualCost || '';
                        $scope.PayorProcedureFeeObj.OfficePreviousYearCost = $scope.PayorProcedureFeeObj.OfficePreviousYearCost || '';
                        $scope.PayorProcedureFeeObj.OfficeValueCost = $scope.PayorProcedureFeeObj.OfficeValueCost || '';
                        if ($scope.PayorProcedureFeeObj.OrganizationPayorId == 0) {
                            alertify.error("Please Select Payor");
                            return false;
                        }
                        if ($scope.PayorProcedureFeeObj.OrganizationProcedureId == 0) {
                            alertify.error("Please Select Procedure");
                            return false;
                        }
                        if ($scope.PayorProcedureFeeObj.ProcedureId == 0) {
                            alertify.error("Please Select CPT Code");
                            return false;
                        }
                        //if ($scope.PayorProcedureFeeObj.StartDate == null) {
                        //    alertify.error("Please Select Start Date");
                        //    return false;
                        //}
                        //if ($scope.PayorProcedureFeeObj.EndDate == null) {
                        //    alertify.error("Please Select End Date");
                        //    return false;
                        //}
                        if ($scope.PayorProcedureFeeObj.ActualCost == "") {
                            alertify.error("Please Enter Actual");
                            return false;
                        }
                        if ($scope.PayorProcedureFeeObj.InFacilityActualCost == "") {
                            alertify.error("Please Enter Facility Actual");
                            return false;
                        }
                        if ($scope.PayorProcedureFeeObj.OfficeActualCost == "") {
                            alertify.error("Please Enter Office Actual");
                            return false;
                        }

                        eHnoteSettingsDataService.AddUpdateOrganizationPayorProcedureFee($scope.PayorProcedureFeeObj).then(function (response) {
                            if (response.data.status == "Success") {
                                $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                                $uibModalInstance.close("Close");
                            } else {
                                alertify.error(response.data.Message);
                            }
                        }, function (error) {

                        });
                    }

                    $scope.ClearDetails = function () {
                        $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                    };


                    $scope.createfeeuibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });

            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp == "Close") {
                    $scope.RateListObj = GetRateListObj();
                    $scope.RateList = [];
                }
            }, function (cancel) {
                console.log(cancel);
            });
        }

        $scope.RateListObj = GetRateListObj();
        $scope.RateList = [];
        $scope.GetPayorProcedureFee = function (click) {
            if (click == 1) {
                $scope.RateListObj.PageNumber = 1;
            }
            if ($scope.RateListObj.IsShowGeneral == false && $scope.RateListObj.OrganizationPayorId == 0) {
                $scope.RateList = [];
                return;
            }

            var req = {
                "OrganizationId": $scope.HospitalId,
                "OrganizationPayorId": $scope.RateListObj.OrganizationPayorId,
                "CPTCODE": $scope.RateListObj.CPTCODE || "",
                "ProcedureName": $scope.RateListObj.ProcedureName || "",
                "PageNumber": $scope.RateListObj.PageNumber || 1,
                "PageSize": $scope.RateListObj.PageSize || 10,
                "Status": 0   // All - 0, Active - 1, InActive -2
            };

            eHnoteSettingsDataService.GetOrganizationPayorProcedureFees(req).then(function (response) {
                if (response.data.Status === "Success") {
                    $scope.RateList = response.data.rows;
                    $scope.RateListObj.TempCount = response.data.count;
                } else {
                    alertify.error(response.data.Message);
                }
            }, function (error) {

            });
        };

        $scope.CancelPayorProcedureFee = function () {
            $scope.RateListObj = GetRateListObj();
            $scope.RateList = [];
        };

        $scope.SearchPayorListByText = function (SearchText) {
            var param = {
                "SearchText": SearchText || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.Status == "Success") {
                    if (resp.data.count !== 0) {
                        if (resp.data.rows !== undefined) {
                            return resp.data.rows.map(function (item) {
                                return item;
                            });
                        }
                    }
                }
            });
        };

        $scope.ChangeOrganizationPayorList = function (mainplanobj) {
            mainplanobj.PayorId = 0;
            mainplanobj.OrganizationPayorId = 0;
        };

        $scope.onSelectOrganizationPayor = function (planobj, mainplanobj) {
            if (planobj != undefined) {
                mainplanobj.PayorId = planobj.PayorId;
                mainplanobj.OrganizationPayorId = planobj.OrganizationPayorId;
                mainplanobj.OrganizationPayorName = planobj.OrganizationPayorName;
            }
        };

        $scope.changeshowgeneral = function (check) {
            if (check == true) {
                $scope.RateListObj.PayorObj = "General";
                $scope.RateListObj.OrganizationPayorId = 0;
                $scope.RateListObj.OrganizationPayorName = "General";
                $scope.RateListObj.CPTCODE = "";
                $scope.RateListObj.ProcedureName = "";
                $scope.RateList = [];
            } else {
                $scope.RateListObj.PayorObj = "";
                $scope.RateListObj.OrganizationPayorId = 0;
                $scope.RateListObj.OrganizationPayorName = "";
                $scope.RateListObj.CPTCODE = "";
                $scope.RateListObj.ProcedureName = "";
                $scope.RateList = [];
            }
        }

        $scope.ChangesActiveStatusForFee = function (item, active) {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "OrganizationProcedurePayorId": item.OrganizationProcedurePayorId,
                "IsActive": active,
            };
            eHnoteInsuranceService.UpdateActiveStatusForPayorProcedureFees(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    item.IsActive = active;
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.EditRateDetails = function (Ritem) {
            $scope.AddCreateFeePopUp(Ritem);


        };

        $scope.getModifier1 = function () {
            var val = "";
            $scope.ModifierList = [];
            eHnoteSettingsDataService.GetMasterModifiers(val).then(function (response) {
                $scope.ModifierList = response.data.rows || [];
            });

        };

        $scope.GetDiagnosisEasyList = function (val) {
            var object = {
                "LevelType": 'O',
                "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "ParentOrganizationId": $scope.ParentHospitalID || null,
            };
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        $scope.OcularObj.AddNewOcular = false;
                        $scope.SystamicObj.AddNewSystamic = false;
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.OcularObj.AddNewOcular = true;
                        $scope.SystamicObj.AddNewSystamic = true;
                    }
                } else {
                    $scope.OcularObj.AddNewOcular = true;
                    $scope.SystamicObj.AddNewSystamic = true;
                }
            });

        };
        $scope.ChangeSNOMED = function (val, type) {
            val = val || '';
            if (val == '') {
                if (type == 'Ocular') {
                    $scope.OcularObj.OcularAddNewSNOMED = false;

                }
                if (type == 'Systamic') {
                    $scope.SystamicObj.SystamicAddNewSNOMED = false;

                }
                if (type == 'Allergy') {
                    $scope.Allergyobj.AllergyAddNewSNOMED = false;
                }
            }
        }
        $scope.ChangeDiagnosis = function (val, type) {
            val = val || '';
            if (val == '') {
                if (type == 'Ocular') {
                    $scope.OcularObj.AddNewOcular = false;

                }
                if (type == 'Systamic') {
                    $scope.SystamicObj.AddNewSystamic = false;

                }
            }

        }
        $scope.GetSearchSnomedCodes = function (val, type) {
            $scope.type = type;
            var object = {
                "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": val,
                "ParentOrganizationId": $scope.ParentHospitalID || null,

            };
            return eHnoteSettingsDataService.GetSearchSnomedCodes(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                    else {
                        if ($scope.type == 'Systamic') {
                            $scope.SystamicObj.SystamicAddNewSNOMED = true;
                        }
                        if ($scope.type == 'Ocular') {
                            $scope.OcularObj.OcularAddNewSNOMED = true;
                        }
                        if ($scope.type == 'Allergy') {
                            $scope.Allergyobj.AllergyAddNewSNOMED = true;
                        }
                    }
                } else {
                    if ($scope.type == 'Systamic') {
                        $scope.SystamicObj.SystamicAddNewSNOMED = true;
                    }
                    if ($scope.type == 'Ocular') {
                        $scope.OcularObj.OcularAddNewSNOMED = true;
                    }
                    if ($scope.type == 'Allergy') {
                        $scope.Allergyobj.AllergyAddNewSNOMED = true;
                    }
                }
            });

        };

        $scope.onSelectOcularICD10 = function (item) {
            item.DiagnosisId = item.ICD10CODE.DiagnosisId;
            item.ICD10CODE = item.ICD10CODE.ICD10CODE;
        }
        $scope.onSelectOcularSnomed = function (item) {
            item.ConceptId = item.SNOMED.ConceptId;
            item.SnomedCodeId = item.SNOMED.SnomedCodeId;
        }

        $scope.onSelectSystamicICD10 = function (item) {
            item.DiagnosisId = item.ICD10CODE.DiagnosisId;
            item.ICD10CODE = item.ICD10CODE.ICD10CODE;
        }
        $scope.onSelectSystamicSnomed = function (item) {
            item.ConceptId = item.SNOMED.ConceptId;
            item.SnomedCodeId = item.SNOMED.SnomedCodeId;
        }

        $scope.GetOrganizationCPTProcedure = function (val) {

            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": val || "", // searchtext
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "IsFrequent": "N",
                "Status": 1
            };
            return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                console.log(response);
                if (response.data.Status == "Success") {
                    /*if (response.data.rows !== undefined) {*/
                    if (response.data.rows.length !== 0) {
                        $scope.OcularSurgObj.AddNewSurgHisCPT = false;
                        $scope.SurgicalObj.AddNewSurgicalCPT = false;
                        return response.data.rows.map(function (item) {
                            return item;
                        });

                    } else {
                        $scope.OcularSurgObj.AddNewSurgHisCPT = true;
                        $scope.SurgicalObj.AddNewSurgicalCPT = true;
                    }
                }
                else {
                    $scope.OcularSurgObj.AddNewSurgHisCPT = true;
                    $scope.SurgicalObj.AddNewSurgicalCPT = true;
                }
            });
        };

        $scope.onClickCPTProcedure = function (item) {
            item.CPTCode = item.CPTObj.CPTCode;
            item.ProcedureId = item.CPTObj.ProcedureId;
        };

        $scope.onClickCPTProcesurg = function (item) {
            item.CPTCode = item.CPTObj.CPTCode;
            item.ProcedureId = item.CPTObj.ProcedureId;
        };

        $scope.onSelectAllergySnomed = function (item) {
            item.ConceptId = item.Snomed.ConceptId;
            item.SnomedCodeId = item.Snomed.SnomedCodeId;
        }

        $scope.ChangeProcedureFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "OrganizationProcedureId": item.OrganizationProcedureId,
                "ProcedureId": item.ProcedureId,
                "IsFrequent": Frequentval
            };
            eHnoteSettingsDataService.UpdateProcedureIsFrequentStatusById(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("IsFrequent Updated successfully");
                    $scope.GetOrganizationProcedure();
                }
            }, function (error) {

            });
        }

        $scope.ChangeBirthHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Birth History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*     "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterBirthHistory(object).success(function (response) {

                        if (response.Status === "Success") {
                            getMasterBirthHistoryItems();
                        }

                        if (response.Status === 'Failure') {
                            alertify.error(response.Message);
                            $scope.BirthHistoryDesc = "";
                            item.IsFrequentind = false;
                        }
                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });


                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }

            if (item.IsFrequent == "N") {

                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*  "HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterBirthHistory(object).success(function (response) {

                    if (response.Status === "Success") {
                        getMasterBirthHistoryItems();
                    }

                    if (response.Status === 'Failure') {
                        alertify.error(response.Message);
                        $scope.BirthHistoryDesc = "";
                        item.IsFrequentind = false;
                    }
                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });

            }


        }

        $scope.ChangeFamilyHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Family History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*     "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterFamilyHistory(object).success(function (response) {

                        if (response.Status === "Success") {
                            getMasterFamilyHistoryItems();
                        }
                        if (response.Status === 'Failure') {
                            alertify.error(response.Message);
                            $scope.FamilyHistoryDesc = "";
                            item.IsFrequentind = false;

                        }
                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }


            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /* "HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterFamilyHistory(object).success(function (response) {

                    if (response.Status === "Success") {
                        getMasterFamilyHistoryItems();
                    }
                    if (response.Status === 'Failure') {
                        alertify.error(response.Message);
                        $scope.FamilyHistoryDesc = "";
                        item.IsFrequentind = false;

                    }
                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });
            }
        }

        $scope.ChangeNutritionalHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Nutritional History", function () {
                    object = {

                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*      "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };

                    eHnoteSettingsDataService.AddUpdateMasterNutritionalHistory(object).success(function (response) {
                        if (response.Status === "Success") {
                            getMasterNutritionalHistoryItems();
                        }
                        if (response.Status === 'Failure') {
                            alertify.error(response.Message);
                            $scope.NutritionalHistoryDesc = "";
                            item.IsFrequentind = false;
                        }
                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }
            if (item.IsFrequent == "N") {
                object = {

                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*"HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };

                eHnoteSettingsDataService.AddUpdateMasterNutritionalHistory(object).success(function (response) {
                    if (response.Status === "Success") {
                        getMasterNutritionalHistoryItems();
                    }
                    if (response.Status === 'Failure') {
                        alertify.error(response.Message);
                        $scope.NutritionalHistoryDesc = "";
                        item.IsFrequentind = false;
                    }
                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });

            }

        }

        $scope.ChangeClinicitemHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Surgical History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*      "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "CPTCode": item.CPTCode,
                        "ProcedureId": item.ProcedureId,
                        "IsFrequent": Frequentval

                    };
                    eHnoteSettingsDataService.AddUpdateMasterSurgicalHistory(object).success(function (response) {
                        if (response.Status === "Success") {
                            getMasterSurgicalHistoryItems();
                        }
                        if (response.Status === 'Failure') {
                            alertify.error(response.Message);
                            $scope.SurgicalObj.SurgicalHistoryDesc = "";
                            item.IsFrequentind = false;

                        }
                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }

            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*    "HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "CPTCode": item.CPTCode,
                    "ProcedureId": item.ProcedureId,
                    "IsFrequent": Frequentval

                };
                eHnoteSettingsDataService.AddUpdateMasterSurgicalHistory(object).success(function (response) {
                    if (response.Status === "Success") {
                        getMasterSurgicalHistoryItems();
                    }
                    if (response.Status === 'Failure') {
                        alertify.error(response.Message);
                        $scope.SurgicalObj.SurgicalHistoryDesc = "";
                        item.IsFrequentind = false;

                    }
                })
            }


        }


        $scope.ChangeMenstrualHistoryHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Menstrual History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*      "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterMenstrualHistory(object).success(function (response) {

                        if (response.Status === "Success") {

                            getMasterMenstrualHistoryItems();
                        }
                        if (response.Status === 'Failure') {

                            alertify.error(response.Message);
                            $scope.MenstrualHistoryDesc = "";
                            item.IsFrequentind = false;

                        }
                    })
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }

            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*   "HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterMenstrualHistory(object).success(function (response) {

                    if (response.Status === "Success") {

                        getMasterMenstrualHistoryItems();
                    }
                    if (response.Status === 'Failure') {

                        alertify.error(response.Message);
                        $scope.MenstrualHistoryDesc = "";
                        item.IsFrequentind = false;

                    }
                })

            }
        }


        $scope.ChangeLifestyleHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Lifestyle History", function () {
                    object = {
                        "HospitalId": parentHospitalId,
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterLifestyleHistory(object).success(function (response) {
                        if (response.Status === "Success") {
                            getMasterLifestyleHistoryItems();
                        }
                        if (response.Status === 'Failure') {

                            alertify.error(response.Message);
                            $scope.LifestyleHistoryDesc = "";
                            item.IsFrequentind = false;

                        }
                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }

            if (item.IsFrequent == "N") {
                object = {
                    "HospitalId": parentHospitalId,
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterLifestyleHistory(object).success(function (response) {
                    if (response.Status === "Success") {
                        getMasterLifestyleHistoryItems();
                    }
                    if (response.Status === 'Failure') {

                        alertify.error(response.Message);
                        $scope.LifestyleHistoryDesc = "";
                        item.IsFrequentind = false;

                    }
                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });

            }

        }

        $scope.ChangeAllergyHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Allergy History", function () {
                    var reqObj = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /* "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "AllergyId": item.AllergyId,
                        "AllergyName": item.AllergyName,
                        "AllergyTypeId": item.AllergyTypeId,
                        "Reaction": "",
                        "DeleteInd": item.DeleteIndicator,
                        "ModifiedBy": "",
                        "ModifiedDt": "",
                        "SNOMED": $scope.Allergyobj.ConceptId || $scope.Allergyobj.Snomed,
                        "SNOMEDId": $scope.Allergyobj.SnomedCodeId || $scope.Allergyobj.SnomedId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
                        if (response.data.Status === "Success") {
                            getMasterAllergyItems();
                            $scope.Allergyobj.Snomed = "";
                        }
                        if (response.data.Status === 'Failure') {

                            alertify.error(response.data.Message);
                            $scope.AllergyDesc = "";
                            $scope.Allergyobj.Snomed = "";
                            item.IsFrequentind = false;

                        }
                    });
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }
            if (item.IsFrequent == "N") {
                var reqObj = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*       "HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "AllergyId": item.AllergyId,
                    "AllergyName": item.AllergyName,
                    "AllergyTypeId": item.AllergyTypeId,
                    "Reaction": "",
                    "DeleteInd": item.DeleteIndicator,
                    "ModifiedBy": "",
                    "ModifiedDt": "",
                    "SNOMED": $scope.Allergyobj.ConceptId || $scope.Allergyobj.Snomed,
                    "SNOMEDId": $scope.Allergyobj.SnomedCodeId || $scope.Allergyobj.SnomedId,
                    "IsFrequent": Frequentval
                };
                eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
                    if (response.data.Status === "Success") {
                        getMasterAllergyItems();
                        $scope.Allergyobj.Snomed = "";
                    }
                    if (response.data.Status === 'Failure') {

                        alertify.error(response.data.Message);
                        $scope.AllergyDesc = "";
                        $scope.Allergyobj.Snomed = "";
                        item.IsFrequentind = false;

                    }
                })
            }

        }


        $scope.ChangeVaccinationHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Vaccination History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /* "ParentHospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterVaccinationHistory(object).then(function (response) {
                        if (response.data.Status === "Success") {
                            $scope.CancelMasterVaccinactionClick();
                            getMasterVaccinactionItems();
                        }
                        if (response.data.Status === 'Failure') {

                            alertify.error(response.data.Message);
                            $scope.AllergyDesc = "";
                            item.IsFrequentind = false;
                        }
                    })
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }
            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*    "ParentHospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterVaccinationHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.CancelMasterVaccinactionClick();
                        getMasterVaccinactionItems();
                    }
                    if (response.data.Status === 'Failure') {

                        alertify.error(response.data.Message);
                        $scope.AllergyDesc = "";
                        item.IsFrequentind = false;
                    }
                })
            }
        }
        $scope.ChangeSystematicHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck  Systematic History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*  "ParentHospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "DiagnosisId": item.DiagnosisId || null,
                        "ICD10CODE": item.ICD10CODE,
                        "SNOMED": item.ConceptId || "",      // ConceptId
                        "SNOMEDId": item.SnomedCodeId || null,  // SnomedCodeId
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterSystemicHistory(object).then(function (response) {
                        if (response.data.Status === "Success") {
                            $scope.CancelMasterSystamicClick();
                            getMasterSystamicItems();
                            $scope.SystamicObj.ICDCODE = "";
                            $scope.SystamicObj.SNOMED = "";
                            $scope.SystamicObj.AddNewSystamic = false;
                            $scope.SystamicObj.SystamicAddNewSNOMED = false;
                        }
                        if (response.data.Status === 'Failure') {
                            alertify.error(response.data.Message);
                            $scope.AllergyDesc = "";
                            item.IsFrequentind = false;

                        }
                    })
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }

            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /* "ParentHospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "DiagnosisId": item.DiagnosisId || null,
                    "ICD10CODE": item.ICD10CODE,
                    "SNOMED": item.ConceptId || "",      // ConceptId
                    "SNOMEDId": item.SnomedCodeId || null,  // SnomedCodeId
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterSystemicHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.CancelMasterSystamicClick();
                        getMasterSystamicItems();
                        $scope.SystamicObj.ICDCODE = "";
                        $scope.SystamicObj.SNOMED = "";
                        $scope.SystamicObj.AddNewSystamic = false;
                        $scope.SystamicObj.SystamicAddNewSNOMED = false;
                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);
                        $scope.AllergyDesc = "";
                        item.IsFrequentind = false;

                    }
                })

            }

        }

        $scope.ChangeOcularHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Ocular History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*    "HospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "DiagnosisId": item.DiagnosisId,
                        "ICD10CODE": item.ICD10CODE,
                        "SNOMED": item.ConceptId,       // ConceptId
                        "SNOMEDId": item.SnomedCodeId,  // SnomedCodeId
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).then(function (response) {
                        if (response.data.Status === "Success") {
                            $scope.CancelMasterOcularClick();
                            getMasterOcularItems();
                            $scope.OcularObj.ICDCODE = "";
                            $scope.OcularObj.SNOMED = "";
                            $scope.OcularObj.AddNewOcular = false;
                            $scope.OcularObj.OcularAddNewSNOMED = false;
                        }
                        if (response.data.Status === 'Failure') {
                            alertify.error(response.data.Message);
                            $scope.AllergyDesc = "";
                            item.IsFrequentind = false;

                        }
                    });
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }


            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /*"HospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "DiagnosisId": item.DiagnosisId,
                    "ICD10CODE": item.ICD10CODE,
                    "SNOMED": item.ConceptId,       // ConceptId
                    "SNOMEDId": item.SnomedCodeId,  // SnomedCodeId
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.CancelMasterOcularClick();
                        getMasterOcularItems();
                        $scope.OcularObj.ICDCODE = "";
                        $scope.OcularObj.SNOMED = "";
                        $scope.OcularObj.AddNewOcular = false;
                        $scope.OcularObj.OcularAddNewSNOMED = false;
                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);
                        $scope.AllergyDesc = "";
                        item.IsFrequentind = false;

                    }
                });

            }
        }


        $scope.ChangeFunctionalFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Functional History", function () {
                    object = {
                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        /*   "ParentHospitalId": parentHospitalId,*/
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterFunctionalstatus(object).then(function (response) {
                        if (response.data.Status === "Success") {
                            $scope.CancelMasterFunctionalClick();
                            getMasterFunctionalItems();
                        }
                        if (response.data.Status === 'Failure') {
                            alertify.error(response.data.Message);
                            item.IsFrequentind = false;


                        }
                    })
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }
            if (item.IsFrequent == "N") {
                object = {
                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    /* "ParentHospitalId": parentHospitalId,*/
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterFunctionalstatus(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.CancelMasterFunctionalClick();
                        getMasterFunctionalItems();
                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);
                        $scope.FunctionalDescription = "";
                        item.IsFrequentind = false;


                    }
                })
            }

        }

        $scope.ChangeOcularSurgicalFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck OcularSurgical  History", function () {
                    object = {

                        "ParentOrganizationId": parentHospitalId,
                        "OrganizationId": $scope.HospitalId,
                        //"ParentHospitalId": parentHospitalId,
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "CPTCode": item.CPTCode,
                        "ProcedureId": item.ProcedureId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterOcularSurgicalHistory(object).then(function (response) {
                        if (response.data.Status === "Success") {
                            $scope.CancelMasterOcularSurgicalClick();
                            getMasterOcularSurgicalItems();
                            $scope.OcularSurgObj.OcularSurgicalDescription = "";
                            $scope.OcularSurgObj.CPTObj = "";
                        }
                        if (response.data.Status === 'Failure') {
                            alertify.error(response.data.Message);
                            item.IsFrequentind = false;

                        }
                    })
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }


            if (item.IsFrequent == "N") {
                object = {

                    "ParentOrganizationId": parentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    //"ParentHospitalId": parentHospitalId,
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "CPTCode": item.CPTCode,
                    "ProcedureId": item.ProcedureId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterOcularSurgicalHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.CancelMasterOcularSurgicalClick();
                        getMasterOcularSurgicalItems();
                        $scope.OcularSurgObj.OcularSurgicalDescription = "";
                        $scope.OcularSurgObj.CPTObj = "";
                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);
                        item.IsFrequentind = false;

                    }
                })

            }


        }


        $scope.ChangeCurrentSystemicFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Current Systemic History", function () {
                    object = {
                        "ParentHospitalId": parentHospitalId,
                        "UserId": $scope.UserId,
                        "DeleteInd": item.DeleteInd,
                        "HistoryName": item.HistoryName,
                        "HistoryId": item.HistoryId,
                        "IsFrequent": Frequentval
                    };
                    eHnoteSettingsDataService.AddUpdateMasterCurrentSystemicHistory(object).then(function (response) {
                        if (response.data.Status === "Success") {
                            $scope.CancelMasterCurrentSystemicClick();
                            getMasterCurrentSystemicItems();
                        }
                        if (response.data.Status === 'Failure') {
                            alertify.error(response.data.Message);
                            $scope.CurrentSystemicDescription = "";
                            item.IsFrequentind = false;

                        }
                    })
                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }
            if (item.IsFrequent == "N") {
                object = {
                    "ParentHospitalId": parentHospitalId,
                    "UserId": $scope.UserId,
                    "DeleteInd": item.DeleteInd,
                    "HistoryName": item.HistoryName,
                    "HistoryId": item.HistoryId,
                    "IsFrequent": Frequentval
                };
                eHnoteSettingsDataService.AddUpdateMasterCurrentSystemicHistory(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.CancelMasterCurrentSystemicClick();
                        getMasterCurrentSystemicItems();
                    }
                    if (response.data.Status === 'Failure') {
                        alertify.error(response.data.Message);
                        $scope.CurrentSystemicDescription = "";
                        item.IsFrequentind = false;

                    }
                })

            }

        }

        //Cheif Complaints//-------------------->

        $scope.showChiefMasterComplaintsDiv = false;

        $scope.CheifComplaintsObj = {
            "complaintsDescription": "",
            "masterComplaintsIsActive": "Y",
            "masterGeneralNotesId": 0,
            "IsFrequent": false,
        }

        $scope.showModifyMasterComplaints = function () {
            $scope.showModifyMasterComplaintsDiv = true;
            $scope.CheifComplaintsObj.IsFrequent = false;
        }
        $scope.CancelMasterComplaintsClick1 = function () {
            $scope.showModifyMasterComplaintsDiv = false;
            $scope.masterComplaintsBtnName = "Save";
            $scope.CheifComplaintsObj.complaintsDescription = "";
            $scope.CheifComplaintsObj.masterGeneralNotesId = 0;
            $scope.CheifComplaintsObj.masterComplaintsIsActive = 'Y';
        }

        $scope.AddupdateComplaints1 = function () {

            if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateCheifComaplaint) {
                alertify.error("Sorry You Dont have Access,Please Contact Administrator");
                return false;
            }

            if ($scope.CheifComplaintsObj.complaintsDescription === "" || $scope.CheifComplaintsObj.complaintsDescription === undefined) {
                alertify.error("Add  Complaints");
                return false;
            }

            if ($scope.CheifComplaintsObj.IsFrequent == true) {
                $scope.CheifComplaintsObj.IsFrequent = "Y";
            } else if ($scope.CheifComplaintsObj.IsFrequent == false) {
                $scope.CheifComplaintsObj.IsFrequent = "N";
            }

            object = {
                "ParentHospitalId": parentHospitalId,
                "UserId": $scope.UserId,
                "ActiveInd": $scope.CheifComplaintsObj.masterComplaintsIsActive,
                "ScreenType": $scope.masterComplaintsLevelType,
                "ChiefComplaintId": $scope.CheifComplaintsObj.masterGeneralNotesId,
                "ChiefComplaintName": $scope.CheifComplaintsObj.complaintsDescription,
                "IsFrequent": $scope.CheifComplaintsObj.IsFrequent,


            };
            eHnoteSettingsDataService.AddUpdateMasterChiefComplaint(object).success(function (response) {

                if (response.status === "Success") {
                    if ($scope.CheifComplaintsObj.masterGeneralNotesId === 0) {

                        alertify.success("Complaints Added Successfully");
                    } else {
                        alertify.success("Complaints Updated Successfully");
                    }

                    $scope.CancelMasterComplaintsClick1();
                    getMasterComplaintsItems();
                }

                if (response.status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.CheifComplaintsObj.complaintsDescription = "";
                }


            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.editMasterComplaints1 = function (item, index) {
            $scope.chiefComplaintsFocus = true;
            $scope.showModifyMasterComplaintsDiv = true;
            $scope.CheifComplaintsObj.masterGeneralNotesId = item.ChiefComplaintId;
            $scope.CheifComplaintsObj.complaintsDescription = item.ChiefComplaintName;
            $scope.CheifComplaintsObj.masterComplaintsIsActive = "Y";
            $scope.masterComplaintsBtnName = "Update";
            if (item.IsFrequent == "Y") {
                $scope.CheifComplaintsObj.IsFrequent = true;
            } else {
                $scope.CheifComplaintsObj.IsFrequent = false;
            }

        };

        $scope.deleteMasterComplaints1 = function (item, index) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this Complaints? </h4>", function () {
                $scope.CheifComplaintsObj.masterGeneralNotesId = item.ChiefComplaintId;
                $scope.CheifComplaintsObj.complaintsDescription = item.ChiefComplaintName;
                $scope.CheifComplaintsObj.masterComplaintsIsActive = "N";
                $scope.CheifComplaintsObj.IsFrequent = false;

                var object = {
                    "ParentHospitalId": parentHospitalId,
                    "UserId": $scope.UserId,
                    "ActiveInd": $scope.CheifComplaintsObj.masterComplaintsIsActive,
                    "ScreenType": $scope.masterComplaintsLevelType,
                    "ChiefComplaintId": item.ChiefComplaintId,
                    "ChiefComplaintName": item.ChiefComplaintName,
                    "IsFrequent": $scope.CheifComplaintsObj.IsFrequent,
                };
                eHnoteSettingsDataService.AddUpdateMasterChiefComplaint(object).success(function (response) {

                    if ($scope.CheifComplaintsObj.masterComplaintsIsActive === 'N') {
                        alertify.success("Complaints Deleted Successfully");
                        $scope.CancelMasterComplaintsClick1();
                        getMasterComplaintsItems();
                    }

                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.ChangeCheifComplaintsHistoryFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to UnCheck Chief Complaints", function () {
                    object = {
                        "ParentHospitalId": parentHospitalId,
                        "UserId": $scope.UserId,
                        "ActiveInd": $scope.CheifComplaintsObj.masterComplaintsIsActive,
                        "ScreenType": $scope.masterComplaintsLevelType,
                        "ChiefComplaintId": item.ChiefComplaintId,
                        "ChiefComplaintName": item.ChiefComplaintName,
                        "IsFrequent": Frequentval,
                    };
                    eHnoteSettingsDataService.AddUpdateMasterChiefComplaint(object).success(function (response) {
                        if (response.status === "Success") {
                            $scope.CancelMasterComplaintsClick1();
                            getMasterComplaintsItems();
                        }

                        if (response.status === 'Failure') {
                            if (response.Message === 'Maximum Frequent Items Reached!') {
                                alertify.error("Maximum Frequent Items Reached!");
                                $scope.CheifComplaintsObj.complaintsDescription = "";
                                item.IsFrequentind = false;
                            }

                        }

                    })
                        .error(function (error) {
                            alertify.error("Error Occured");
                        });



                }, function () {
                    r = "You pressed Cancel!";
                    if (ind == false) {
                        item.IsFrequentind = true;
                    }
                });
            }
            if (item.IsFrequent == "N") {
                object = {
                    "ParentHospitalId": parentHospitalId,
                    "UserId": $scope.UserId,
                    "ActiveInd": $scope.CheifComplaintsObj.masterComplaintsIsActive,
                    "ScreenType": $scope.masterComplaintsLevelType,
                    "ChiefComplaintId": item.ChiefComplaintId,
                    "ChiefComplaintName": item.ChiefComplaintName,
                    "IsFrequent": Frequentval,


                };
                eHnoteSettingsDataService.AddUpdateMasterChiefComplaint(object).success(function (response) {

                    if (response.status === "Success") {
                        $scope.CancelMasterComplaintsClick1();
                        getMasterComplaintsItems();
                    }

                    if (response.status === 'Failure') {
                        if (response.Message === 'Maximum Frequent Items Reached!') {
                            alertify.error("Maximum Frequent Items Reached!");
                            $scope.CheifComplaintsObj.complaintsDescription = "";
                            item.IsFrequentind = false;
                        }
                    }

                })
                    .error(function (error) {
                        alertify.error("Error Occured");
                    });


            }

        }


        /*EducationMaterial start*/

        $scope.EducationObj = {
            "SearchObj": "",
            "Type": "Procedure",
            "OrgProcedureId": 0,
            "SearchProcedureObj": "",
            "PageSize": 10,
            "PageNumber": 1
        }
        $scope.GetEducationMaterialObj = function () {
            return {
                "Type": "Procedure",
                "OrgProcedureId": "",
                "DocumentDetails": [],
                //"VideoDetails": [],
                "VideoDetails": [{
                    "VideoId": 0,
                    "VideoName": "",
                    "VideoURL": "",
                    "DeleteInd": 'N'
                }],
                "TempImagesArray": [],
                "TempPdfArray": [],
                "TempVideoArray": [],
                "IsSendMaterialEmail": false,
                "VideoUrl": "",
                "SelectSurgeryMaterial": ""
            };
        };
        $scope.EducationMaterialObj = angular.copy($scope.GetEducationMaterialObj());
        $scope.OnSelectProcedure = function (item) {
            $scope.EducationMaterialObj.OrgProcedureId = item.OrganizationProcedureId || null;
        }



        $scope.AddVideo = function () {
            $scope.EducationMaterialObj.VideoUrl = $scope.EducationMaterialObj.VideoUrl || "";
            if ($scope.EducationMaterialObj.VideoUrl !== "") {
                var Obj = {
                    "VideoId": 0,
                    "VideoName": $scope.EducationMaterialObj.VideoUrl,
                    "DeleteInd": false
                };
                $scope.EducationMaterialObj.TempVideoArray.push(Obj);
            }
            $scope.EducationMaterialObj.VideoUrl = "";
        };

        $scope.dynamicPopover1 = {
            content: 'Hello, World!',
            templateUrl: 'myPopoverTemplate.html',
            title: 'Title'
        };
        $scope.selectPrintImgLogo = function (files) {
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
                            "DeleteInd": false,
                            "DocumentId": 0,
                            "DocumentName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,
                            "DisplayName": name,
                            "FileName": ""
                        };
                        if ($scope.file.type != 'application/pdf') {
                            $scope.EducationMaterialObj.TempImagesArray.push(obj);
                        }
                        else {
                            $scope.EducationMaterialObj.TempPdfArray.push(obj);
                        }
                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };


        $scope.SendEducation = function (item) {

            $scope.EducationObj.SearchProcedureObj = $scope.EducationObj.SearchProcedureObj || "";
            if ($scope.EducationMaterialObj.Type == 'Procedure') {
                if ($scope.EducationObj.SearchProcedureObj == "") {
                    alertify.error("Please select the Procedure");
                    return false;
                }
            }

            $scope.Varray = item.VideoDetails[item.VideoDetails.length - 1];
            $scope.file = $scope.file || "";
            if ($scope.Varray.VideoURL == '' && $scope.Varray.VideoName == '' && $scope.file == "") {
                if ($scope.Varray.VideoURL == '') {
                    alertify.error("Enter URL");
                    return false;
                }
            }
            else if ($scope.Varray.VideoName !== '' && $scope.Varray.VideoURL == '') {
                if ($scope.Varray.VideoURL == '') {
                    alertify.error("Enter URL");
                    return false;
                }
            }
            else if ($scope.Varray.VideoURL !== '' && $scope.Varray.VideoName == '') {
                if ($scope.Varray.VideoName == '') {
                    alertify.error("Enter Name");
                    return false;
                }
            }
            else if ($scope.Varray.VideoURL == '' && $scope.Varray.VideoName == '' && $scope.file == "") {
                if ($scope.file == "") {
                    alertify.error("Please select the file");
                    return false;
                }
            }
            else if (item.TempImagesArray.length > 0) {
                $scope.Farray = item.TempImagesArray[item.TempImagesArray.length - 1];
                $scope.Farray.FileName = $scope.Farray.FileName || "";
                if ($scope.Farray.FileName == "") {
                    alertify.error("Enter file name");
                    return false;
                }
            }

            var obj = {
                "EducationMaterial": $scope.EducationMaterialObj,
                "Type": $scope.EducationMaterialObj.Type || 'Procedure',
                "PatientID": 0,
                "DoctorID": null, // Surgoen id
                "UserId": eHnoteMasterDataService.getLoginId(), // surgeon id
                "HospitalId": $scope.HospitalId,
                "PatientName": '',
                "OrgProcedureId": $scope.EducationMaterialObj.OrgProcedureId,
                //"CommunicationAddress": {
                //    "PatientEmail": $scope.SelectedParticularPatient.EmailId,
                //    "HospitalName": $scope.CounsellorSearchObj.HospitalObj.ClinicName || "",
                //    "HospitalEmail": $scope.CounsellorSearchObj.HospitalObj.BranchEmail || "",
                //    "HospitalContact": "",
                //    "DoctorName": $scope.SelectedParticularPatient.AppointmentDoctorName || ""
                //},

            };
            obj.EducationMaterial.TempDocumentDetails = obj.EducationMaterial.TempDocumentDetails || [];
            obj.EducationMaterial.VideoDetails = obj.EducationMaterial.VideoDetails || [];
            $scope.EducationMaterialObj.TempPdfArray = $scope.EducationMaterialObj.TempPdfArray || [];
            if ($scope.EducationMaterialObj.TempPdfArray.length > 0) {
                angular.forEach($scope.EducationMaterialObj.TempPdfArray, function (item) {
                    item.DocumentId = item.DocumentId || 0;
                    var object = {
                        "DocumentTypeId": item.DocumentTypeId,
                        "DocumentName": item.DocumentName,
                        "DocumentExt": item.DocumentExt,
                        "S3URL": item.S3URL,
                        "file": item.file,
                        "DeleteInd": item.DeleteInd,
                        "DocumentId": item.DocumentId,
                        "FileName": item.FileName
                    };
                    if (item.DocumentId === 0) {
                        obj.EducationMaterial.TempDocumentDetails.push(object);
                        obj.EducationMaterial.DocumentDetails.push(object);
                    }
                    else {
                        obj.EducationMaterial.DocumentDetails.push(object);
                    }
                });
            }
            $scope.EducationMaterialObj.TempImagesArray = $scope.EducationMaterialObj.TempImagesArray || [];
            if ($scope.EducationMaterialObj.TempImagesArray.length > 0) {
                angular.forEach($scope.EducationMaterialObj.TempImagesArray, function (item) {
                    item.DocumentId = item.DocumentId || 0;

                    var object = {
                        "DocumentTypeId": item.DocumentTypeId,
                        "DocumentName": item.DocumentName,
                        "DocumentExt": item.DocumentExt,
                        "S3URL": item.S3URL,
                        "file": item.file,
                        "DeleteInd": item.DeleteInd,
                        "DocumentId": item.DocumentId,
                        "FileName": item.FileName
                    };
                    if (item.DocumentId === 0) {
                        obj.EducationMaterial.TempDocumentDetails.push(object);
                        obj.EducationMaterial.DocumentDetails.push(object);
                    }
                    else {
                        obj.EducationMaterial.DocumentDetails.push(object);
                    }

                });
            }
            $scope.EducationMaterialObj.VideoUrl = $scope.EducationMaterialObj.VideoUrl || "";
            if ($scope.EducationMaterialObj.VideoUrl !== "") {
                var Obj = {
                    "VideoId": 0,
                    "VideoURL": $scope.EducationMaterialObj.VideoUrl,
                    "VideoName": $scope.EducationMaterialObj.VideoName,
                    "DeleteInd": false
                };
                $scope.EducationMaterialObj.TempVideoArray.push(Obj);
                $scope.EducationMaterialObj.VideoUrl = "";
                $scope.EducationMaterialObj.VideoName = "";
            }

            if ($scope.EducationMaterialObj.TempVideoArray.length > 0) {
                angular.forEach($scope.EducationMaterialObj.TempVideoArray, function (item) {
                    item.VideoId = item.VideoId || 0;
                    var object = {
                        "VideoURL": item.VideoURL,
                        "VideoName": item.VideoName,
                        "DeleteInd": item.DeleteInd,
                        "VideoId": item.VideoId
                    };
                    obj.EducationMaterial.VideoDetails.push(object);

                });
            }


            eHnoteSurgeryService.AddEducationMaterial(obj, OnEducationMaterialSuccess, OnEducationMaterialError);

            function OnEducationMaterialSuccess(data) {
                if (data.Status === "Success") {
                    alertify.success("Education Material added successfully");
                    $scope.EducationObj = {
                        "SearchProcedureObj": "",
                        "PageSize": 10,
                        "PageNumber": 1,
                    }
                    $scope.EducationMaterialObj = angular.copy($scope.GetEducationMaterialObj());

                    $scope.GetOrganizationSurgery();
                    //$scope.EducationObj.SearchProcedureObj = "";
                    //$scope.EducationMaterialList();
                }
            }

            function OnEducationMaterialError(data) {
                console.log(data);
            }
        };

        $scope.DeleteEducationitem = function () {

        }

        $scope.OnSelectProcedureitem = function (item) {
            $scope.EducationObj.OrgProcedureId = item.OrganizationProcedureId || 0;
        }
        $scope.GetOrganizationSurgery = function () {

            var params = {
                // "OrgProcedureId": $scope.EducationObj.OrgProcedureId || 0,
                "OrgProcedureIds": $scope.EducationObj.OrgProcedureId || "",
                "HospitalId": $scope.HospitalId,
                "PageSize": $scope.EducationObj.PageSize || 10,
                "PageNumber": $scope.EducationObj.PageNumber || 1
            };

            eHnoteSurgeryService.GetOrganizationSurgeryDocumentMaterial(params).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        $scope.tempmaterialList = response.data.rows || [];
                        $scope.EducationListCount = [];
                        $scope.EducationListCount = response.data.count;
                        if ($scope.tempmaterialList.length > 0) {
                            angular.forEach($scope.tempmaterialList, function (Item) {
                                Item.TempImagesArray = [];
                                Item.TempPdfArray = [];
                                if (Item.VideoDetails.length > 0) {
                                    angular.forEach(Item.VideoDetails, function (Vitem) {
                                        var videoId = '';
                                        var url = Vitem.VideoURL;
                                        videoId = url.split("=")[1];
                                        Vitem.videoId = videoId || null;

                                    });
                                }
                                if (Item.DocumentDetails.length > 0) {
                                    angular.forEach(Item.DocumentDetails, function (kitem) {
                                        if (kitem.DocumentExt === 'image/jpeg' || kitem.DocumentExt === "image/png") {
                                            kitem.file = kitem.S3URL;
                                            Item.TempImagesArray.push(kitem);
                                        }
                                        if (kitem.DocumentExt === "application/pdf") {
                                            kitem.file = kitem.S3URL;
                                            Item.TempPdfArray.push(kitem);
                                        }
                                    });
                                }
                            });

                        }
                        else {
                            $scope.tempmaterialList = [];

                        }
                    }

                    //if (response.data.rows !== undefined) {
                    //    $scope.tempmaterialList = response.data.rows;
                    //    if ($scope.tempmaterialList.length > 0) {
                    //        if ($scope.tempmaterialList[0].DocumentDetails.length > 0) {
                    //            $scope.SurgeryMaterialList = $scope.tempmaterialList[0].DocumentDetails;
                    //            $scope.EducationMaterialObj.SelectSurgeryMaterial = $scope.SurgeryMaterialList[0];
                    //            $scope.EducationMaterialObj.TempImagesArray = [];
                    //            $scope.EducationMaterialObj.TempPdfArray = [];
                    //            angular.forEach($scope.SurgeryMaterialList, function (kitem) {
                    //                if (kitem.DocumentExt === 'image/jpeg') {
                    //                    kitem.file = kitem.S3URL;
                    //                    $scope.EducationMaterialObj.TempImagesArray.push(kitem);
                    //                }
                    //                if (kitem.DocumentExt === "application/pdf") {
                    //                    kitem.file = kitem.S3URL;
                    //                    $scope.EducationMaterialObj.TempPdfArray.push(kitem);
                    //                }
                    //            });
                    //        }
                    //    }
                    //    else {
                    //        $scope.EducationMaterialObj.TempImagesArray = [];
                    //        $scope.EducationMaterialObj.TempPdfArray = [];
                    //    }
                    //}
                }
                else {
                    $scope.SurgeryMaterialList = [];
                    $scope.EducationMaterialObj.TempImagesArray = [];
                    $scope.EducationMaterialObj.TempPdfArray = [];
                    $scope.tempmaterialList = [];
                }
            });
        };

        $scope.ClearEducation = function () {
            $scope.EducationObj = {
                "SearchObj": "",
                "SurgeryId": 0,
                "SearchProcedureObj": ""
            }
        }



        $scope.mainConsentCreateDefaulArray = [
            {
                "MainItemId": "1",
                "MainItemName": "Header",
                "IsSelected": false,
                "IsActive": false,
                "SubItems": [
                    {
                        "SubItemId": 1,
                        "SubItemName": "Date",
                        "Value": "#Date#",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 2,
                        "SubItemName": "PatientName",
                        "Value": "#PatientName#",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 3,
                        "SubItemName": "PatientMrNo",
                        "Value": "#PatientMrNo#",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 4,
                        "SubItemName": "PatientMobile",
                        "Value": "#PatientMobile#",
                        "IsSelected": false
                    }
                ]
            },
            {
                "MainItemId": "2",
                "MainItemName": "Body",
                "IsSelected": false,
                "IsActive": false,
                "SubItems": [
                    {
                        "SubItemId": 6,
                        "SubItemName": "Free Text",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 7,
                        "SubItemName": "Consent Templates",
                        "IsSelected": false,
                        "ChildItems": [
                            //{
                            //    "ChildItemId": 1,
                            //    "ChildItemName": "Procedure1",
                            //    "IsSelected": false
                            //},
                            //{
                            //    "ChildItemId": 2,
                            //    "ChildItemName": "Procedure3",
                            //    "IsSelected": false
                            //}
                        ]
                    },

                ]
            },
            {
                "MainItemId": "3",
                "MainItemName": "Footer",
                "IsSelected": false,
                "IsActive": false,
                "SubItems": [
                    {
                        "SubItemId": 8,
                        "SubItemName": "Patient Sign",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 9,
                        "SubItemName": "Guardian Sign",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 10,
                        "SubItemName": "Doctor Sign",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 11,
                        "SubItemName": "Staff Sign",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 12,
                        "SubItemName": "Anaesthetist Sign",
                        "IsSelected": false
                    },
                    {
                        "SubItemId": 12,
                        "SubItemName": "CoOrdinator Sign",
                        "IsSelected": false
                    }
                ]
            }
        ];









        $scope.Consentslist = function () {
            var obj = {
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "Type": 1,
                "PDfcontent": "",
                "SearchText": "",
                "PageSize": 10,
                "PageNumber": 1
            };
            eHnoteSettingsDataService.GetConsentsByOrganizationAndType(obj).then(function (resp) {
                $scope.Consentformlist = [];
                if (resp.data.rows.length > 0) {
                    $scope.Consentformlist = resp.data.rows || [];

                    angular.forEach($scope.Consentformlist, function (item) {
                        item.IsSelected = false;
                        item.ChildItemId = item.DocId;
                        item.ChildItemName = item.DocumentName;
                    });

                    angular.forEach($scope.mainConsentCreateDefaulArray, function (mcitem) {
                        angular.forEach(mcitem.SubItems, function (sitem) {
                            if (sitem.SubItemId === 7) {

                                sitem.ChildItems = angular.copy($scope.Consentformlist) || [];
                            }
                        });
                    });
                }
            }, function (err) {
                console.log(err);
            });
        }


        $scope.ActiveCollapseId = 0;
        $scope.ActiveCollapsebar = function (obj) {
            //if ($scope.ActiveCollapseId === id) {
            //    $scope.ActiveCollapseId = 0;
            //} else {
            //    $scope.ActiveCollapseId = id;
            //}
            obj.IsActive = !obj.IsActive;
        };


        $scope.SubActiveCollapseId = 0;
        $scope.SubActiveCollapsebar = function (obj) {
            //if ($scope.SubActiveCollapseId === id) {
            //    $scope.SubActiveCollapseId = 0;
            //} else {
            //    $scope.SubActiveCollapseId = id;
            //}
            obj.IsActive = !obj.IsActive;
        };


        //$scope.CheckSubCategory = function (mainobj, subobj) {
        //    if (subobj.SubItemId !== 6) {

        //        var htmltext = "<span> #" + subobj.SubItemName + "# </span>";
        //        var tsthis = textAngularManager.retrieveEditor('htmlcontents');
        //        var element = $compile(htmltext)(tsthis.scope.$parent);

        //        console.log(element);

        //        console.log(tsthis);

        //        tsthis.scope.displayElements.text[0].focus();

        //        insertNodeAtCursor(element[0]);
        //        return placeCaretAtEnd(element[0]);

        //    }
        //};



        function insertNodeAtCursor(node) {
            var sel, range, html;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    sel.getRangeAt(0).insertNode(node);
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                html = (node.nodeType == 3) ? node.data : node.outerHTML;
                range.pasteHTML(html);
            }

        }


        function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.setStartAfter(el);
                range.setEndAfter(el);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }


        $scope.onloadHtmlNew = function () {
            if ($scope.contentobj.Contentlist.length > 0) {
                angular.forEach($scope.contentobj.Contentlist, function (item, $index) {
                    var index = $index;
                    var ContentBody = "#ContentBodyNew" + index;
                    var newmyEl = '';
                    $(ContentBody).empty();
                    newmyEl = angular.element(document.querySelector(ContentBody));
                    newmyEl.append(item.PDFcontent)
                });
            };
        }
        $scope.changecontentNew = function (item) {


            if (item.IsSelected == true) {
                var List = $filter("filter")($scope.contentobj.Contentlist, { "DocId": item.DocId }, true);
                if (List.length > 0) {

                } else {
                    var obj = {
                        "DeleteInd": false,
                        "DocumentName": item.DocumentName,
                        "OrganizationContentId": item.DocId,
                        "PDFcontent": item.PDFcontent,
                    }
                    $scope.contentobj.Contentlist.push(obj);

                }
            } else {
                angular.forEach($scope.contentobj.Contentlist, function (ritem, rindex) {
                    if (item.DocId === ritem.DocId) {
                        $scope.contentobj.Contentlist.splice(rindex, 1);
                    }
                });

            }
            $timeout(function () {
                $scope.onloadHtmlNew();
            }, 200);

        };


        $scope.previewCompleteConsent = function () {

            $timeout(function () {
                var innerContents = document.getElementById('printconsentpreviewId').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 500);
        }



        $scope.newMainConsentFormObj = {
            "UserId": "",
            "HospitalId": "",
            "OrganizationConsentFormId": "",
            "ConsentFormTypeId": "",
            "ConsentFormDetails": [],
            "ConsentPdfContent": ""
        };

        $scope.saveEntireComeplete = function () {


            var finalPDFContent = "";

            console.log($scope.contentobj.Contentlist);



            angular.forEach($scope.mainConsentCreateDefaulArray, function (mcitem) {
                angular.forEach(mcitem.SubItems, function (sitem) {
                    if (sitem.SubItemId === 6) {

                        finalPDFContent = $scope.MainConsentObject.htmlconsentNew || "";
                    }
                });
            });

            angular.forEach($scope.contentobj.Contentlist, function (pitem) {
                finalPDFContent = finalPDFContent + "" + pitem.PDFcontent;
            });

            console.log(finalPDFContent);


            var newmyEl = '';
            $("#consentsamplePreviewId").empty();
            newmyEl = angular.element(document.querySelector('#consentsamplePreviewId'));
            newmyEl.append(finalPDFContent);


        }


        $scope.clickOnadd = function (subobj) {

            if (subobj.SubItemId !== 6) {
                $scope.vm.variable = subobj.Value;
            }
        }




        $scope.vm = this;
        $scope.vm.variable = "";
        $scope.vm.content = "";
        $scope.getCursorPosition = function () {

            console.log($scope.vm.variable);

            if ($scope.vm.variable) {
                var sel, range;
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    console.log(sel.getRangeAt(0))
                    $scope.vm.rango = sel.getRangeAt(0);
                    $scope.vm.rango.insertNode(document.createTextNode('{' + $scope.vm.variable + '}'));
                    $scope.vm.variable = '';

                    return sel.getRangeAt(0);
                }
            }
        }

        $scope.ChangeConsentFields = function (id) {
            if (id !== null) {
                $scope.ConsentFormFields.FieldTypeId = id;
            }

            if ($scope.ConsentFormFields.FieldTypeId === 1) {
                $scope.getTableColumnsinfo($scope.ConsentFormFields.TableName);
            }
        };


        //$scope.SearchAppTables = function (val) {
        //    return eHnoteSettingsDataService.SearchAppTables(val).then(function (response) {
        //            if (response.data.rows !== undefined) {
        //                return response.data.rows.map(function (item) {
        //                    return item;
        //                });
        //            }
        //    });
        //};


        $scope.ConsentFormFields = {
            "UserId": $scope.UserId,
            "ConsentFieldId": 0,
            "FieldName": "",
            "FieldVariable": "",
            "FieldTypeId": "",
            "FieldCategoryId": "",
            "TableName": "",
            "TableFields": "",
            "DeleteInd": "N"
        };


        $scope.Alltables = [];
        $scope.getallTablesinfo = function (val) {
            var obj = {
                "SearchText": val
            }
            eHnoteSettingsDataService.SearchAppTables(obj).then(function (response) {
                $scope.Alltables = [];
                console.log(response);
                response.data.rows = response.data.rows || [];
                if (response.data.rows.length > 0) {
                    $scope.Alltables = response.data.rows;
                }
            });
        };


        $scope.allColumnsData = [];
        $scope.getTableColumnsinfo = function (val) {
            var obj = {
                "Name": val
            }
            eHnoteSettingsDataService.GetTableColumns(obj).then(function (response) {
                console.log(response);
                $scope.allColumnsData = [];
                response.data.rows = response.data.rows || [];
                if (response.data.rows.length > 0) {
                    $scope.allColumnsData = response.data.rows;
                }
            });
        };



        $scope.saveConsentFieldData = function () {
            var obj = {
                "UserId": $scope.ConsentFormFields.UserId,
                "ConsentFieldId": $scope.ConsentFormFields.ConsentFieldId,
                "FieldName": $scope.ConsentFormFields.FieldName,
                "FieldVariable": $scope.ConsentFormFields.FieldVariable,
                "FieldTypeId": $scope.ConsentFormFields.FieldTypeId,
                "FieldCategoryId": $scope.ConsentFormFields.FieldCategoryId,
                "TableName": $scope.ConsentFormFields.TableName,
                "TableFields": $scope.ConsentFormFields.TableFields,
                "DeleteInd": "N"
            }
            eHnoteSettingsDataService.AddUpdateMasterConsentFields(obj).then(function (response) {
                console.log(response);

                if (response.data.status == "Success") {

                    alertify.success("Added Successfully");

                    $scope.ConsentFormFields = {
                        "UserId": $scope.UserId,
                        "ConsentFieldId": 0,
                        "FieldName": "",
                        "FieldVariable": "",
                        "FieldTypeId": "",
                        "FieldCategoryId": "",
                        "TableName": "",
                        "TableFields": "",
                        "DeleteInd": "N"
                    };
                    $scope.GetConsentFieldsListData();
                }
            });
        };

        $scope.clearConsentFileData = function () {

            $scope.ConsentFormFields = {
                "UserId": $scope.UserId,
                "ConsentFieldId": 0,
                "FieldName": "",
                "FieldVariable": "",
                "FieldTypeId": "",
                "FieldCategoryId": "",
                "TableName": "",
                "TableFields": "",
                "DeleteInd": "N"
            };
        }


        $scope.consentFieldsListobj = {
            "Array": [],
            "Count": 0,
            "PageSize": 10,
            "GetAllIndicator": 0,
            "PageNumber": 1
        }

        $scope.GetConsentFieldsListData = function () {
            var obj = {
                "SearchText": "",
                "GetAllIndicator": $scope.consentFieldsListobj.GetAllIndicator,
                "IsDeleted": "N",
                "PageSize": $scope.consentFieldsListobj.PageSize,
                "PageNumber": $scope.consentFieldsListobj.PageNumber
            };

            eHnoteSettingsDataService.GetConsentFieldsList(obj).then(function (response) {
                console.log(response);

                if (response.data.rows.length > 0) {

                    $scope.consentFieldsListobj.Array = response.data.rows || [];

                    $scope.consentFieldsListobj.Count = response.data.count || 0;
                } else {
                    $scope.consentFieldsListobj.Array = [];

                    $scope.consentFieldsListobj.Count = 0;
                }
            });
        }

        $scope.consentfieldpageChanged = function (pageno) {
            $scope.consentFieldsListobj.PageNumber = pageno;
            $scope.GetConsentFieldsListData();
        };

        $scope.DeleteConsentField = function (citem) {
            var obj = {
                "UserId": $scope.ConsentFormFields.UserId,
                "ConsentFieldId": citem.ConsentFieldId,
                "FieldName": citem.FieldName,
                "FieldVariable": citem.FieldVariable,
                "FieldTypeId": citem.FieldTypeId,
                "FieldCategoryId": citem.FieldCategoryId,
                "TableName": citem.TableName,
                "TableFields": citem.TableFields,
                "DeleteInd": "Y"
            }
            eHnoteSettingsDataService.AddUpdateMasterConsentFields(obj).then(function (response) {
                console.log(response);

                if (response.data.status == "Success") {
                    alertify.success("Deleted Successfully");
                    $scope.ConsentFormFields = {
                        "UserId": $scope.UserId,
                        "ConsentFieldId": 0,
                        "FieldName": "",
                        "FieldVariable": "",
                        "FieldTypeId": "",
                        "FieldCategoryId": "",
                        "TableName": "",
                        "TableFields": "",
                        "DeleteInd": "N"
                    };
                    $scope.GetConsentFieldsListData();
                }
            });

        }

        $scope.Addnew = function (item) {

            $scope.Varray = item.VideoDetails[item.VideoDetails.length - 1];
            if ($scope.Varray.VideoURL == '') {
                alertify.error("Enter URL");
                return false;
            }
            if ($scope.Varray.VideoName == '') {
                alertify.error("Enter Name");
                return false;
            }
            $scope.DeleteVideodetails = false;
            if ($scope.Varray.VideoURL != '' && $scope.Varray.VideoName != '') {
                $scope.DeleteVideodetails = true;
            }
            else {
                $scope.DeleteVideodetails = false;
            }
            var obj = {
                "VideoId": 0,
                "VideoName": "",
                "VideoURL": "",
                "DeleteInd": 'N'
            }
            $scope.EducationMaterialObj.VideoDetails.push(obj);
        }

        $scope.ClearVideoDetails = function (item) {
            var index = $scope.EducationMaterialObj.VideoDetails.indexOf(item);
            if (item.VideoId === 0) {
                if (index > -1) {
                    $scope.EducationMaterialObj.VideoDetails.splice(index, 1);
                }
            } else {
                $scope.EducationMaterialObj.VideoDetails[index].DeleteInd = "N";
            }
        };

        $scope.Removetempimage = function (item) {
            var List = $filter("filter")($scope.EducationMaterialObj.TempImagesArray, { "DeleteInd": item.DeleteInd }, true);
            List = List || [];
            if (List.length > 0) {
                List[0].DeleteInd = true;
                List[0].DocumentId = 0 || '';
                List[0].file = '';
            }
            $scope.file = "";
        }

        $scope.RemoveVideoFile = function (vitem, item, type) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {

                if (type === 'video') {
                    var params = {
                        "OrganizationProcedureId": item.OrgProcedureId || 0,
                        "HospitalId": $scope.HospitalId,
                        "S3URL": vitem.VideoURL,
                        "DocumentMaterialId": vitem.VideoId,
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "DeleteInd": "Y"
                    };
                }
                if (type === 'img') {
                    var params = {
                        "OrganizationProcedureId": item.OrgProcedureId || 0,
                        "HospitalId": $scope.HospitalId,
                        "S3URL": vitem.S3URL,
                        "DocumentMaterialId": vitem.DocumentId,
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "DeleteInd": "Y"
                    };
                }
                eHnoteSurgeryService.DeleteEducationMaterial(params).then(function (resp) {
                    console.log(resp);
                    if (resp.data.Status == "Success") {
                        $scope.GetOrganizationSurgery();

                    }

                    alertify.success("Deleted Successfully");
                }, function (err) {
                    console.log(err);
                    alertify.error("Deleting Failed");
                });
            });
        }

        $scope.EducationListPagechanged = function (pageno) {
            $scope.EducationObj.PageNumber = pageno;
            $scope.GetOrganizationSurgery();
        }

        //$scope.EducationMaterialListview = false;
        //$scope.EducationMaterialList = function () {
        //    if ($scope.tempmaterialList.length>0) {
        //        $scope.EducationMaterialListview = true;
        //    } else {
        //        $scope.EducationMaterialListview = false;
        //    }
        //}

        $scope.ChangeProfileStatus = function (val) {
            if (val === 1) {
                if ($scope.InCompleteDetailsList.length > 0) {
                    angular.forEach($scope.InCompleteDetailsList, function (sitem) {
                        sitem.IsSelected = true;
                    });
                    $scope.OrganizationSettingsData.ProfileStatusSettings.ProfileStatusArray = angular.copy($scope.InCompleteDetailsList);
                }
                $scope.EditProfileStatus(val);
            }
            else {
                if ($scope.InCompleteDetailsList.length > 0) {
                    angular.forEach($scope.InCompleteDetailsList, function (sitem) {
                        sitem.IsSelected = false;
                    });
                    $scope.OrganizationSettingsData.ProfileStatusSettings.ProfileStatusArray = [];
                }
            }
        }

        $scope.ChangeDigitalSignatureType = function (type) {
            console.log(type);
            $scope.OrganizationSettingsData.AppointmentSettings.DigitalSigatureType = type;
        }
        $scope.ChangeIsRosCarrieForword = function (type) {
            $scope.OrganizationSettingsData.ConsultationSettings.IsRosCarrieForword = type;
        }
        $scope.EditProfileStatus = function (val) {
            if (val === 1) {
                $scope.OrganizationSettingsData.ProfileStatusSettings.IsProfileStatusRestricted = val || 1;
                if ($scope.OrganizationSettingsData.ProfileStatusSettings.ProfileStatusArray.length > 0) {
                    angular.forEach($scope.InCompleteDetailsList, function (sitem) {
                        sitem.IsSelected = false;
                    });

                    angular.forEach($scope.OrganizationSettingsData.ProfileStatusSettings.ProfileStatusArray, function (pitem) {
                        angular.forEach($scope.InCompleteDetailsList, function (sitem) {
                            if (pitem.IncompleteStatusId == sitem.IncompleteStatusId) {
                                sitem.IsSelected = true;
                            }
                        });
                    });
                }
                mInstanceAdd = $uibModal.open({
                    "templateUrl": "ProfileStatuspopup.html",
                    "backdrop": "static",
                    "scope": $scope,
                    "keyboard": false,
                    //"size": "sm"
                    "windowClass": "modal__sixty--",
                });
            } else {
                $scope.OrganizationSettingsData.ProfileStatusSettings.IsProfileStatusRestricted = 0;
            }
        }

        $scope.CloseProfileStatuspopup = function () {
            mInstanceAdd.dismiss("cancel");
        };

        $scope.ShowHideAllDays = function (item) {
            item.IsShowAllDays = !item.IsShowAllDays;
        };

        $scope.SaveProfileStatuspopup = function () {
            $scope.InCompleteDetailsList = $scope.InCompleteDetailsList || [];
            if ($scope.InCompleteDetailsList.length > 0) {
                var List = 0;
                $scope.OrganizationSettingsData.ProfileStatusSettings.ProfileStatusArray = [];
                angular.forEach($scope.InCompleteDetailsList, function (item) {
                    if (item.IsSelected == true) {
                        $scope.OrganizationSettingsData.ProfileStatusSettings.ProfileStatusArray.push(item);
                        List++;
                    }
                });
                if (List == 0) {
                    alertify.error("Please choose any One Item in Profile Status");
                    return false;
                }
            }

            mInstanceAdd.dismiss("cancel");
        };

        $scope.SearchBirthHistoryList = function () {
            getMasterBirthHistoryItems();
        }
        $scope.ClearBirthHistoryList = function () {
            $scope.searchObj.BirthHistory = "";
            $scope.SearchBirthHistoryList();
        }

        $scope.SearchFamilyHistoryList = function () {
            getMasterFamilyHistoryItems();
        }
        $scope.ClearFamilyHistoryList = function () {
            $scope.searchObj.FamilyHistory = "";
            getMasterFamilyHistoryItems();
        }

        $scope.SearchNutritionHistoryList = function () {
            getMasterNutritionalHistoryItems();
        }
        $scope.ClearNutritionHistoryList = function () {
            $scope.searchObj.NutritionHistory = "";
            getMasterNutritionalHistoryItems();
        }

        $scope.SearchSurgicalHistoryList = function () {
            getMasterSurgicalHistoryItems();
        }
        $scope.ClearSurgicalHistoryList = function () {
            $scope.searchObj.SurgicalHistory = "";
            getMasterSurgicalHistoryItems();
        }

        $scope.SearchMenstrualHistoryList = function () {
            getMasterMenstrualHistoryItems();
        }
        $scope.ClearMenstrualHistoryList = function () {
            $scope.searchObj.MenstrualHistory = "";
            getMasterMenstrualHistoryItems();
        }

        $scope.SearchLifestyleHistoryList = function () {
            getMasterLifestyleHistoryItems();
        }
        $scope.ClearLifestyleHistoryList = function () {
            $scope.searchObj.LifestyleHistory = "";
            getMasterLifestyleHistoryItems();
        }

        $scope.SearchMasterAllergyList = function () {
            getMasterAllergyItems();
        }
        $scope.ClearMasterAllergyList = function () {
            $scope.searchObj.MasterAllergy = "";
            getMasterAllergyItems();
        }

        $scope.SearchVaccinationHistoryList = function () {
            getMasterVaccinactionItems();
        }
        $scope.ClearVaccinationHistoryList = function () {
            $scope.searchObj.VaccinationHistory = "";
            getMasterVaccinactionItems();
        }

        $scope.SearchSystemicHistoryList = function () {
            getMasterSystamicItems();
        }
        $scope.ClearSystemicHistoryList = function () {
            $scope.searchObj.SystemicHistory = "";
            getMasterSystamicItems();
        }

        $scope.SearchOcularOHistoryList = function () {
            getMasterOcularItems();
        }
        $scope.ClearOcularOHistoryList = function () {
            $scope.searchObj.OcularOHistory = "";
            getMasterOcularItems();
        }

        $scope.SearchFunctionalStatusList = function () {
            getMasterFunctionalItems();
        }
        $scope.ClearFunctionalStatusList = function () {
            $scope.searchObj.FunctionalStatus = "";
            getMasterFunctionalItems();
        }

        $scope.SearchOcularSurgicalList = function () {
            getMasterOcularSurgicalItems();
        }
        $scope.ClearOcularSurgicalList = function () {
            $scope.searchObj.OcularSurgical = "";
            getMasterOcularSurgicalItems();
        }

        $scope.SearchCurrentSystemicList = function () {
            getMasterCurrentSystemicItems();
        }
        $scope.ClearCurrentSystemicList = function () {
            $scope.searchObj.CurrentSystemic = "";
            getMasterCurrentSystemicItems();
        }
        $scope.addedReferralSource = false;
        $scope.addedPromoCode = false;
        $scope.addedNewProcedure = false;
        $scope.addedConsentFormFields = false;
        $scope.addedUploadConsentForm = false;
        $scope.addedFacilityDetails = false;
        $scope.viewAddReferral = function () {
            $scope.addedReferralSource = true;
        };
        $scope.addPromoCode = function () {
            $scope.addedPromoCode = true;
        };
        $scope.addNewProcedure = function () {
            $scope.addedNewProcedure = true;
        };
        $scope.addConsentFormFields = function () {
            $scope.addedConsentFormFields = true;
        };
        $scope.addUploadConsentForm = function () {
            $scope.addedUploadConsentForm = true;
        };
        $scope.addFacilityDetails = function () {
            $scope.addedFacilityDetails = true;
        };
        $scope.closeAddReferral = function () {
            $scope.referral.referralSource = '';
            $scope.referral.referralTitle = '';
            $scope.referral.ReferralID = 0;
            $scope.SaveReferral = "Save";
            $scope.referral.referralSource = 0;
            $scope.editReferral = false;
            $scope.addedReferralSource = false;
        };
        $scope.closeAddPromocode = function () {
            $scope.clearmasterPromoCodeObj();
            $scope.addedPromoCode = false;
        };
        $scope.closeNewProcedure = function () {
            $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();
            $scope.addedNewProcedure = false;
        };
        $scope.closeConsentFormFields = function () {
            $scope.ConsentFormFields = {
                "UserId": $scope.UserId,
                "ConsentFieldId": 0,
                "FieldName": "",
                "FieldVariable": "",
                "FieldTypeId": "",
                "FieldCategoryId": "",
                "TableName": "",
                "TableFields": "",
                "DeleteInd": "N"
            };
            $scope.addedConsentFormFields = false;
        };
        $scope.closeUploadConsentForm = function () {
            $scope.addedUploadConsentForm = false;
        };
        $scope.closeFacilityDetails = function () {
            $scope.FacilityObj = GetFacilityObj();
            $scope.GetdefaultLoginBranch($scope.hospid);
            $scope.addedFacilityDetails = false;
        };
        $scope.LostSettingsFocus = function () {
            $scope.referralFocus = false;
            $scope.promoCodesFocus = false;
            $scope.proceduresFocus = false;
            $scope.facilityFocus = false;
            $scope.chiefComplaintsFocus = false;
            $scope.birthFocus = false;
            $scope.birthFocus = false;
            $scope.birthFocus = false;
            $scope.familyFocus = false;
            $scope.nutritionalFocus = false;
            $scope.surgicalFocus = false;
            $scope.mensturalFocus = false;
            $scope.lifeStyleFocus = false;
            $scope.vaccinationFocus = false;
            $scope.systemicFocus = false;
            $scope.oculerFocus = false;
            $scope.functionalStatusFocus = false;
            $scope.oculerSurgicalFocus = false;
            $scope.currentSystemicFocus = false;
            $scope.diagnosisFocus = false;
            $scope.billingFocus = false;
            $scope.currentTreatmentFocus = false;
        };
        $scope.OpenAscTemplateAdupdateScreen = function (item) {
            $scope.AscTemplateScreenObj.IsShowAddUpdateScreen = true;
            item = item || '';
            $scope.AscTemplateScreenObj.SelectedTempItem = {};
            if (item != '') {
                $scope.AscTemplateScreenObj.SelectedTempItem = item || {};
            }
            //let obj = {

            //}
            //let mInstanceAdd = $uibModal.open({
            //    "templateUrl": "templates/ASC/UsAscSettings.html",
            //    //"size": "lg",
            //    "backdrop": "static",
            //    "keyboard": false,
            //    "scope": $scope,
            //    "windowClass": "modal__popup--1 bottom-to-top-modal",
            //    "controller": "UsAscSettingCtrl",
            //    "resolve": {
            //        "Mainobj": function () { return obj; }

            //    },
            //    //"controller": function ($scope, $uibModal, $uibModalInstance) {
            //    //    $scope.uibclose = function () {
            //    //        $uibModalInstance.dismiss("cancel");
            //    //    };
            //    //}
            //});
            /*$scope.AscTemplateScreenObj.IsShowAddUpdateScreen = true;*/
        }
        $scope.CloseAscTemplateAdupdateScreen = function () {
            $scope.AscTemplateScreenObj.IsShowAddUpdateScreen = false;
        //    $scope.GetAscSurgeryCheckListTemplates();
            if ($scope.AscTemplateScreenObj.Tab == 1) {
                $scope.GetAscSurgeryOrderTemplates();
            } else {
                $scope.GetAscSurgeryCheckListTemplates();
            }
        }
        $scope.changeSurgeryTemplatePage = function () {
        //    $scope.GetAscSurgeryCheckListTemplates()
            if ($scope.AscTemplateScreenObj.Tab == 1) {
                $scope.GetAscSurgeryOrderTemplates();
            } else if ($scope.AscTemplateScreenObj.Tab == 2) {
                $scope.GetAscSurgeryCheckListTemplates();
            } else if ($scope.AscTemplateScreenObj.Tab == 3) {
            //    $scope.GetDischargeTimerTemplateData();
                $scope.GetDoctorWiseDischargeTimerTemplates();
            }
        }

        $scope.SearchProcedures = function (val) {
            //if ($scope.AscTemplateScreenObj.searchtext.length < 3) {
            //    return false;
            //}
            $scope.AscTemplateScreenObj.Pageno = 1;
        //    $scope.GetAscSurgeryCheckListTemplates(val);
            if ($scope.AscTemplateScreenObj.Tab == 1) {
                $scope.GetAscSurgeryOrderTemplates(val);
            } else {
                $scope.GetAscSurgeryCheckListTemplates(val);
            }
        }
        $scope.VerifiedByArray = [];
        $scope.GetDocotorListForAscTemplates = function (val) {
            eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });

                  
                    $scope.clinicDoctorList = [];
                    $scope.allUserList = [];
                    $scope.selectedDoctor = "";


                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                    var reqObj = {
                        "BranchId": $scope.HospitalId,
                        "SubSpecializationIdArray": subSplArray
                    }


                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        console.log(resp);
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;
                            $scope.VerifiedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43);
                            $scope.VerifiedByArray = _.uniq($scope.VerifiedByArray, false, function (p) { return p.DoctorID; });

                            $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                        } else {
                            alertify.error("No Users Found in Selected Departments");
                            $scope.mainBookedAppointmentList = [];
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
        }
        $scope.AscTemplateScreenChange = function (val) {
            //if ($scope.AscTemplateScreenObj.searchtext.length < 3) {
            //    return false;
            //}
            $scope.AscTemplateScreenObj.Tab = val || 1;
            $scope.AscTemplateScreenObj.Pageno = 1;
            $scope.AscTemplateScreenObj.searchtext = '';
            if ($scope.AscTemplateScreenObj.Tab == 1) {
                $scope.GetDocotorListForAscTemplates();
                $scope.GetAscSurgeryOrderTemplates();
            } else if ($scope.AscTemplateScreenObj.Tab == 2) {
                $scope.GetDocotorListForAscTemplates();
                $scope.GetAscSurgeryCheckListTemplates();
            } else if ($scope.AscTemplateScreenObj.Tab == 3) {
                $scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());
                $scope.GetDischargeTimerTemplateData();
                $scope.GetDoctorWiseDischargeTimerTemplates();
            }
            
        //    $scope.GetAscSurgeryCheckListTemplates('');
        }

        $scope.GetAscSurgeryCheckListTemplates = function (val) {
            
            let req = {
                "ParentOrganizationId": $scope.ParentHospitalID,
                "HospitalID": $scope.HospitalId,
                "DoctorId": $scope.UserId,
                "SearchText": $scope.AscTemplateScreenObj.searchtext || "",
                "PageNumber": $scope.AscTemplateScreenObj.Pageno||1,
                "PageSize": $scope.AscTemplateScreenObj.Pagesize,
                //"CPTCODE": val || '',
                "ASCSurgeryTemplateUserId": 0,
                "ASCTemplateUserId": $scope.AscTemplateScreenObj.AscCheckListTemplateUserId,

            }

            eHnoteSurgeryService.GetAscSurgeryCheckListTemplates(req).then(function (resp) {
                if (resp.data != undefined) {
                    $scope.AscTemplateScreenObj.TemplateList = [];
                    $scope.AscTemplateScreenObj.TemplateList = resp.data.TemplateList || [];
                    $scope.AscTemplateScreenObj.count = resp.data.count || 0;
                }

                console.log(resp,'ascsurgerytemp')
            }, function (err) {
                console.log(err);
            });
        }

        $scope.GetAscSurgeryOrderTemplates = function (val) {

            let req = {
                "ParentOrganizationId": $scope.ParentHospitalID,
                "HospitalID": $scope.HospitalId,
                "DoctorId": $scope.UserId,
                "SearchText": $scope.AscTemplateScreenObj.searchtext || "",
                "PageNumber": $scope.AscTemplateScreenObj.Pageno || 1,
                "PageSize": $scope.AscTemplateScreenObj.Pagesize,
                //"CPTCODE": val || '',
                "ASCTemplateUserId": $scope.AscTemplateScreenObj.AscOrderTemplateUserId,
            }

            eHnoteSurgeryService.GetAscSurgeryOrderTemplates(req).then(function (resp) {
                if (resp.data != undefined) {
                    $scope.AscTemplateScreenObj.TemplateList = [];
                    $scope.AscTemplateScreenObj.TemplateList = resp.data.TemplateList || [];
                    $scope.AscTemplateScreenObj.count = resp.data.count || 0;

                    $scope.AscTemplateScreenObj.allTemplates = [];
                    $scope.AscTemplateScreenObj.allTemplates = resp.data.TemplateListForAllCount || [];
                }

                console.log(resp, 'ascOrdertemp')
            }, function (err) {
                console.log(err);
            });
        }

        $scope.$on("AscSurgeryTemplateClose", function (event, data) {
            //$scope.GetAscSurgeryCheckListTemplates();
            if ($scope.AscTemplateScreenObj.Tab == 1) {
                $scope.GetAscSurgeryOrderTemplates();
            } else {
                $scope.GetAscSurgeryCheckListTemplates();
            }
            $scope.AscTemplateScreenObj.IsShowAddUpdateScreen = false;
        });
        $scope.DeleteAscTemplate = function (temp) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

                temp.DeleteInd = 'Y';
                temp.UserId = $scope.UserId;
                eHnoteSurgeryService.AddAscSettingTemplate(temp).then(function (resp) {
                    if (resp.data.status === "Success") {

                        $scope.GetAscSurgeryCheckListTemplates();


                    }


                });
            }, function () {
            });

        }

        $scope.DeleteAscOrdersTemplate = function (temp) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

                temp.DeleteInd = 'Y';
                temp.UserId = $scope.UserId;
                eHnoteSurgeryService.AddUpdateAscSurgeryOrderTemplates(temp).then(function (resp) {
                    if (resp.data.status === "Success") {

                        $scope.GetAscSurgeryOrderTemplates();


                    }


                });
            }, function () {
            });

        }


        $scope.GetOrganizationProcedureCode = function (text) {
            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "Status": 1,
                "IsFrequent": "N",
                "ParentOrganizationId": $scope.ParentHospitalID || null
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

            return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
                if (resp.data.rows !== undefined) {

                    return resp.data.rows
                        .filter(function (item) {
                            return item.IsActive == true;
                        })
                        .map(function (item) {
                            return item;
                        });
                }
            });
        };

        $scope.onselectServiceItem = function (item) {

            item = item || null;

            $scope.masterMedicineObject.ProcedureId = item.ProcedureId || 0;
            $scope.masterMedicineObject.ProcedureName = item.ProcedureName || '';
            $scope.masterMedicineObject.CPTCode = item.CPTCode || '';

        };

        $scope.changePackageUnit = function (PackageUnitsId) {
            var CounselerArray = [];
             CounselerArray = $filter("filter")($scope.PackageUnitsArray, function (Kitem) { return Kitem.PackageUnitsId === PackageUnitsId });

            if (CounselerArray.length > 0) {
                $scope.masterMedicineObject.PackageUnitName = CounselerArray[0].Name || '';
            }
        };

        $scope.changeBrandType = function (BrandTypeId) {
            var BranTypeArray = [];
            BranTypeArray = $filter("filter")($scope.DrugBrandTypes, function (Kitem) { return Kitem.DrugBrandTypeId === BrandTypeId });

            if (BranTypeArray.length > 0) {
                $scope.masterMedicineObject.BrandTypeName = BranTypeArray[0].Name || '';
            }
        };
        
        $scope.changeMedicineTypes = function (MedicineTypeId) {
            var MedicineTypeArray = [];
            MedicineTypeArray = $filter("filter")($scope.MedicineTypes, function (Kitem) { return Kitem.MedicineTypeId === MedicineTypeId });

            if (MedicineTypeArray.length > 0) {
                $scope.masterMedicineObject.MedicineTypeName = MedicineTypeArray[0].Name || '';
            }
        }; 

        $scope.changeMedicineUnits = function (MedicineUnitId) {
            var UnitsArray = [];
            UnitsArray = $filter("filter")($scope.UnitsList, function (Kitem) { return Kitem.UnitsId === MedicineUnitId });

            if (UnitsArray.length > 0) {
                $scope.masterMedicineObject.MedicineUnitName = UnitsArray[0].Units || '';
                if ($scope.masterMedicineObject.MedicineStrength != '') {
                    $scope.masterMedicineObject.MedicinefullName = $scope.masterMedicineObject.MedicineName +" "+ $scope.masterMedicineObject.MedicineStrength +" " + $scope.masterMedicineObject.MedicineUnitName;

                }
             
            }
        }; 
        $scope.changeStrength = function (Strength) {
            $scope.masterMedicineObject.MedicinefullName = $scope.masterMedicineObject.MedicineName + " " + $scope.masterMedicineObject.MedicineStrength + " " + $scope.masterMedicineObject.MedicineUnitName;
           
        };
        $scope.EditMedicineCodes = function (item) {
            $scope.masterMedicineObject = angular.copy($scope.GetMasterMedicineObject());
            $scope.masterMedicineObject.MedicineId = item.MedicineId || null;
            $scope.masterMedicineObject.MedicineObj = item.MedicineName || '';
            $scope.masterMedicineObject.MedicineName = item.MedicineName || '';
            $scope.masterMedicineObject.MedicineNDCId = item.MedicineNDCId || null;
            $scope.masterMedicineObject.IsMedicine = true;
            $scope.masterMedicineBtnName ='Update';
            $scope.masterMedicineObject.MedicinefullName = item.MedicinefullName || '';
            $scope.masterMedicineObject.MedicineStrength = item.MedicineStrength || '';
            $scope.masterMedicineObject.MedicineUnitName = item.MedicineUnitName || '';
            $scope.masterMedicineObject.DrugNDCID = item.DrugNDCID || null;
            $scope.masterMedicineObject.BrandTypeId = item.BrandTypeId ||null;
            $scope.masterMedicineObject.AwpPrice = item.AwpPrice || '';
            $scope.masterMedicineObject.RxQuntity = item.RxQuntity || '';
            $scope.masterMedicineObject.RXNorm = item.RXNorm || '';
            $scope.masterMedicineObject.MedicineTypeId = item.MedicineTypeId || '';
            $scope.masterMedicineObject.BrandTypeId = item.BrandTypeId || null;
            $scope.masterMedicineObject.MedicineUnitId = item.MedicineUnitId ||null;
            $scope.masterMedicineObject.MedicineStrength = item.Strength || '';
            $scope.masterMedicineObject.PurchasePrice = item.PurchasePrice || '';
            $scope.masterMedicineObject.PackageSize = item.PackageSize || '';
            $scope.masterMedicineObject.Instructions = item.NDCInstructions || '';
            $scope.masterMedicineObject.CPTCode = item.CPTCode || '';
            $scope.masterMedicineObject.Procedureobj = item.ProcedureName || '';
            $scope.masterMedicineObject.ProcedureName = item.ProcedureName || '';
            $scope.masterMedicineObject.ProcedureId = item.NDCProcedureId || null;

        }; 

        $scope.DeleteMedicine = function (item) {
            item.DeleteInd = 'Y';

            var params = angular.copy(item);
            params.HospitalObj = "";

            eHnoteSettingsDataService.AddUpdateMasterMedicines(params).success(function (response) {

                if (response.status === "Success") {
                    $scope.CancelMasterMedicines();
                    alertify.success("Medicine Added Successfully");
                    
                }
                if (response.status === "Failure") {
                    alertify.error("Medicine Already Exists");
                }
            }).error(function (error) {
                alertify.error("Error Occured");
            });
        };

        $scope.viewTemplate = function (item) {
            //$scope.AscTemplateScreenObj.IsShowAddUpdateScreen = true;
            item = item || '';
            $scope.AscTemplateScreenObj.SelectedTempItem = {};
            $scope.temp = {};
            if (item != '') {
                $scope.AscTemplateScreenObj.SelectedTempItem = item || {};
                
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/viewOrdersTemplatePopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                //"scope": $scope,
                "windowClass": "modal__ninety--",
                "resolve": {
                    "SelectedItem": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, SelectedItem) {
                    $scope.temp = SelectedItem || {};
                    $scope.temp.IstemplateList = false;

                    $scope.temp.Screen = 'Settings';
                    $scope.AscChecklisttemplateSummuryViewObj = {
                        "Tab":1,
                    }
                    $scope.ChecklisttemplateSummuryTab = function (Tab) {
                        $scope.AscChecklisttemplateSummuryViewObj.Tab = Tab || 1;
                    }
                    $scope.OpenAsctemplateViasummury = function (item) {
                        $uibModalInstance.close(item);

                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
            mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                resp = resp || '';
                if (resp!='') {
                    $scope.AscTemplateScreenObj.SelectedTempItem = resp || {};
                //    $scope.OpenAscTemplateAdupdateScreen(resp);
                    $scope.AscTemplateScreenObj.IsShowAddUpdateScreen = true;
                }
                //if (resp == "Close") {
                //    $scope.RateListObj = GetRateListObj();
                //    $scope.RateList = [];
                //}
            }, function (cancel) {
                console.log(cancel);
            });
        };
      
        $scope.ChangePayorManadatory = function (item) {
            if (item == 1) {
                $scope.OrganizationSettingsData.PatientRegistration.IsCoverageNoManadatory = 1;
                $scope.IsPayorEditable = false;
            } else {
                $scope.OrganizationSettingsData.PatientRegistration.IsCoverageNoManadatory = 0;
                $scope.OrganizationSettingsData.PatientRegistration.IsPlannameNoManadatory = 0;
                $scope.OrganizationSettingsData.PatientRegistration.IsPolicyIDNoManadatory = 0;
                $scope.OrganizationSettingsData.PatientRegistration.IsGroupIDNoManadatory = 0;
                $scope.IsPayorEditable = true;
            }
        }
        $scope.EmrTemplateScreenObj = { IsShowAddUpdateScreen: false };
        $scope.OpenEmrTemplateAdupdateScreen = function () {
            $scope.EmrTemplateScreenObj.IsShowAddUpdateScreen = true;
        }
        $scope.CloseEmrTemplateAdupdateScreen = function () {
            $scope.EmrTemplateScreenObj.IsShowAddUpdateScreen = false;
        }
        $scope.EMRSectionsobj = { TAB: 1 };
        $scope.ExamTab = 1;
        $scope.openPdfFileUploads = function (url) {
            window.open(url);
        };



        $scope.OpenMoreOptions = {
            templateUrl: 'OpenMoreOption.html',
        };

        $scope.GetDischargeTimerTemplateObj = function () {
            return {
                "TemplateId": null,
                "TemplateName": "",
                "DoctorsList": [],
                "SurgeriesList": [],
                "TimesArray": [
                    {
                        "TimeId": 1,
                        "Time": "30"
                    },
                    {
                        "TimeId": 2,
                        "Time": "35"
                    },
                    {
                        "TimeId": 3,
                        "Time": "40"
                    },
                    {
                        "TimeId": 4,
                        "Time": "45"
                    },
                    {
                        "TimeId": 5,
                        "Time": "50"
                    },
                    {
                        "TimeId": 6,
                        "Time": "55"
                    },
                    {
                        "TimeId": 7,
                        "Time": "60"
                    }
                ],
                "SearchText": '',
                "TimeId": null,
                "Time": "",
                "SearchProcedureObj": "",
                "Pagesize": 10,
                //"maxsize": 100,
                "Pageno": 1,
                "count": 0,
                "AllDoctorsSelected": "",
                "AllDoctorsArray": $scope.VerifiedByArray || [],
                "SelectedDoctors": "Select",
                "DischargeTemplatesData": [],
                "UserBasedTemplatesData": [],
                "IsEditData": false,
                "IsShowTemplateAddView": false,
                "AscDischargeTemplateUserId": 0,
                "DoctorObj": "",
                "searchdoc":""
            }
        };
        $scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());

        $scope.SelectDoctorsList = function (value,item) {
            item.IsChecked = value;
            item.DischargeTimerOrderDetailId = item.DischargeTimerOrderDetailId || 0;
            if (item.IsChecked) {
                $scope.DischargeTimerTemplateObj.SelectedDoctors = "Selected";
            } 
            
        };

        $scope.GetOrganizationCPTProcedure = function (val) {
            val = val || "";
            let obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": val || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "IsFrequent": "N",
                "Status": 0,
                "Type": "SurgeriesProcedures",
                "ParentOrganizationId": $scope.ParentHospitalID || null
            };
            if (val == "") {
                obj.IsFrequent = "Y";
            }
            return eHnoteSettingsDataService.GetOrganizationProceduresByType(obj).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.rows.length !== 0) {
                        if (response.data.rows.length > 0) {
                            angular.forEach(response.data.rows, function (item) {
                                if (item.CPTCode == "") {
                                    if (item.LoincCode != '') {
                                        item.CPTCode = item.LoincCode;
                                    }
                                }
                            });
                        }
                        val = val || "";
                        return response.data.rows.map(function (item) {
                            item.OrganName = item.OrganName || "";
                            return item;
                        });
                    }
                }
            });
        };

        $scope.GetOrganizationCPTProcedureSearchEngine = function (val) {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",
                "SearchText": val || "",
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "GetAllIndicator": 0,
                "IsFrequent": "N",
                "Status": 0,
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (val == "") {
                obj.IsFrequent = "Y"
            }
            return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(obj).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.rows.length !== 0) {
                        if (response.data.rows.length > 0) {
                            angular.forEach(response.data.rows, function (item) {
                                if (item.CPTCode == "") {
                                    if (item.LoincCode != '') {
                                        item.CPTCode = item.LoincCode;
                                    }
                                }
                            });
                        }

                        return response.data.rows
                            .filter(function (item) {
                                return item.IsActive == true && item.OrderTypeId === 3;
                            })
                            .map(function (item) {
                                return item;
                            });

                    }
                }
            });
        };

        $scope.OnSelectTimerSurgeries = function (mainitem) {

            var object = {
                "ProcedureId": mainitem.ProcedureId || 0,
                "ProcedureName": mainitem.ProcedureName || "",
                "OrgProcedureId": mainitem.OrganizationProcedureId || 0,
                "CPTCode": mainitem.CPTCode,
                "DeleteInd": "N",
            };
            if ($scope.DischargeTimerTemplateObj.SurgeriesList.length > 0) {
                let TempSurgeryArray = $filter('filter')($scope.DischargeTimerTemplateObj.SurgeriesList, { 'ProcedureId': mainitem.ProcedureId }, true) || [];
                if (TempSurgeryArray.length > 0) {
                    alertify.error("Order Already Added!");
                    $scope.DischargeTimerTemplateObj.SearchProcedureObj = '';
                    return false;
                } else {
                    $scope.DischargeTimerTemplateObj.SurgeriesList.push(object);
                }
            } else {
                $scope.DischargeTimerTemplateObj.SurgeriesList.push(object);
            }
            $scope.DischargeTimerTemplateObj.SearchProcedureObj = '';
           /* $scope.isTypeaheadOpen = true;*/
        };

        $scope.DeleteOrders = function (item) {
            var index = $scope.DischargeTimerTemplateObj.SurgeriesList.indexOf(item);
            item.DischargeTimerOrderDetailId = item.DischargeTimerOrderDetailId || null;
            if (item.DischargeTimerOrderDetailId == null) {
                if (index > -1) {
                    $scope.DischargeTimerTemplateObj.SurgeriesList.splice(index, 1);
                }
            } else {
                $scope.DischargeTimerTemplateObj.SurgeriesList[index].DeleteInd = 'Y';
            }
        };

        $scope.ClearTemplateDetails = function () {
            //$scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());
            $scope.DischargeTimerTemplateObj.TemplateId = null;
            $scope.DischargeTimerTemplateObj.TemplateName = "";
            $scope.DischargeTimerTemplateObj.TimeId = null;
            $scope.DischargeTimerTemplateObj.Time = "";
            
            $scope.DischargeTimerTemplateObj.AllDoctorsArray = $scope.DischargeTimerTemplateObj.AllDoctorsArray || [];
            angular.forEach($scope.DischargeTimerTemplateObj.AllDoctorsArray, function (item) {
                item.IsChecked = false;
            })
            if ($scope.DischargeTimerTemplateObj.SurgeriesList.length > 0) {
                angular.forEach($scope.DischargeTimerTemplateObj.SurgeriesList, function (Aitem) {
                    var index = $scope.DischargeTimerTemplateObj.SurgeriesList.indexOf(Aitem);
                    Aitem.DischargeTimerOrderDetailId = Aitem.DischargeTimerOrderDetailId || 0;
                    if (Aitem.DischargeTimerOrderDetailId == 0) {
                        if (index > -1) {
                            $scope.DischargeTimerTemplateObj.SurgeriesList.splice(index, 1);
                        }
                    } else {
                        Aitem.DeleteInd = 'Y';
                    }
                });
            }
        };
        $scope.CancelEditTemplateDetails = function () {
            $scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());
            $scope.GetDischargeTimerTemplateData();
            $scope.GetDoctorWiseDischargeTimerTemplates();
        };

        $scope.ChangeTimerTime = function (Id) {
            let TempTimeArray = $filter('filter')($scope.DischargeTimerTemplateObj.TimesArray, { 'TimeId': Id }, true) || [];
            if (TempTimeArray.length > 0) {
                $scope.DischargeTimerTemplateObj.TimeId = TempTimeArray[0].TimeId;
                $scope.DischargeTimerTemplateObj.Time = TempTimeArray[0].Time;
            } else {
                $scope.DischargeTimerTemplateObj.TimeId = null;
                $scope.DischargeTimerTemplateObj.Time = "";
            }
        };

        $scope.SaveDischargeTimerTemplateData = function () {
            $scope.DischargeTimerTemplateObj.TemplateName = $scope.DischargeTimerTemplateObj.TemplateName || '';
            if ($scope.DischargeTimerTemplateObj.TemplateName == '') {
                alertify.error('Please Enter TemplateName');
                return;
            }
            
            if ($scope.DischargeTimerTemplateObj.SurgeriesList.length == 0) {
                alertify.error('Please Select Surgery');
                return;
            } else {
                let TempSurgeryArray = $filter('filter')($scope.DischargeTimerTemplateObj.SurgeriesList, { 'DeleteInd': "N" }, true) || [];
                if (TempSurgeryArray.length == 0) {
                    alertify.error('Please Select Surgery');
                    return;
                }
            }
            if ($scope.DischargeTimerTemplateObj.AllDoctorsArray.length >0) {
                let TempDoctorArray = $filter('filter')($scope.DischargeTimerTemplateObj.AllDoctorsArray, { 'IsChecked': true }, true) || [];
                if (TempDoctorArray.length == 0) {
                    alertify.error('Please Select Template Doctor');
                    return;
                }
            } 

            if ($scope.DischargeTimerTemplateObj.TimeId == null) {
                alertify.error('Please Enter Time');
                return;
            }

            var TempAllUserAndSurgeriesArray = [];

            if ($scope.DischargeTimerTemplateObj.DischargeTemplatesData.length > 0) {
                angular.forEach($scope.DischargeTimerTemplateObj.DischargeTemplatesData, function (Uitem) {
                    angular.forEach(Uitem.UserOrderDetails, function (Vitem) {
                        Vitem.DischargeTimerTemplateName = Uitem.DischargeTimerTemplateName;
                        TempAllUserAndSurgeriesArray.push(Vitem);
                    });
                });
            }

            var ErrorList = [];
            var ErrorCounter = 0;
            var UserOrderDetails = [];
            angular.forEach($scope.DischargeTimerTemplateObj.SurgeriesList, function (Aitem) {
                angular.forEach($scope.DischargeTimerTemplateObj.AllDoctorsArray, function (Bitem) {
                    Bitem.DischargeTimerOrderDetailId = Bitem.DischargeTimerOrderDetailId || 0;
                    Bitem.IsChecked = Bitem.IsChecked || false;
                    if (Bitem.IsChecked || Bitem.DischargeTimerOrderDetailId !== 0) {
                        let obj = {
                            "DischargeTimerOrderDetailId": 0,
                            "DoctorID": Bitem.DoctorID,
                            "DoctorFullName": Bitem.UserFullName,
                            "ProcedureId": Aitem.ProcedureId || 0,
                            "ProcedureName": Aitem.ProcedureName || "",
                            "OrgProcedureId": Aitem.OrgProcedureId || 0,
                            "CPTCode": Aitem.CPTCode,
                            "DischargeTimeId": $scope.DischargeTimerTemplateObj.TimeId,
                            "DischargeTime": $scope.DischargeTimerTemplateObj.Time,
                            "DeleteInd": "N"
                        }
                        if ((!Bitem.IsChecked && Bitem.DischargeTimerOrderDetailId !== 0) || (Aitem.DeleteInd == "Y")) {
                            obj.DeleteInd = "Y";
                        }

                        if (TempAllUserAndSurgeriesArray.length > 0) {
                            let TempUserArray = $filter('filter')(TempAllUserAndSurgeriesArray, { 'DoctorID': obj.DoctorID, "ProcedureId": obj.ProcedureId }, true) || [];
                            if (TempUserArray.length > 0) {
                                if (TempUserArray[0].DischargeTimerTemplateId !== $scope.DischargeTimerTemplateObj.TemplateId) {
                                    //    ErrorList.push(`${obj.ProcedureName} + ${obj.DoctorFullName} combination already added in ${TempUserArray[0].DischargeTimerTemplateName}.`);
                                    //if (ErrorList.length == 0) {
                                    //    ErrorList.push(`${obj.ProcedureName} already added in ${TempUserArray[0].DischargeTimerTemplateName}.`);
                                    //}

                                    ErrorCounter++;
                                } else {
                                    UserOrderDetails.push(obj);
                                }
                            } else {
                                UserOrderDetails.push(obj);
                            }
                        } else {
                            UserOrderDetails.push(obj);
                        }
                    }
                })
            })

            if (ErrorCounter !== 0) {
                alertify.error("Surgery name already exists in the template.");
                return false;
            }

            if ($scope.DischargeTimerTemplateObj.DischargeTemplatesData.length > 0) {
                let TempTemplateArray = $filter('filter')($scope.DischargeTimerTemplateObj.DischargeTemplatesData, { 'DischargeTimerTemplateId': $scope.DischargeTimerTemplateObj.TemplateId }, true) || [];
                if (TempTemplateArray.length > 0) {
                    angular.forEach(UserOrderDetails, function (Aitem) {
                        let TempSurgeriesArray = $filter('filter')(TempTemplateArray[0].UserOrderDetails, { 'DoctorID': Aitem.DoctorID, "ProcedureId": Aitem.ProcedureId }, true) || [];
                        if (TempSurgeriesArray.length > 0) {
                            Aitem.DischargeTimerOrderDetailId = TempSurgeriesArray[0].DischargeTimerOrderDetailId || 0;
                        }
                    });
                }
            };

            if ($scope.DischargeTimerTemplateObj.AllDoctorsArray.length > 0) {
                let TempDoctorArray = $filter('filter')($scope.DischargeTimerTemplateObj.AllDoctorsArray, { 'IsChecked': true }, true) || [];
                if (TempDoctorArray.length == 0) {
                    alertify.error('Please Select Template Doctor');
                    return;
                }
            }

            let DeleteInd = "N";
            var TempFilter = $filter('filter')(UserOrderDetails, { 'DeleteInd': "N" }, true) || [];
            if (TempFilter.length == 0) {
                DeleteInd = "Y";
            }

            var ReqObj = {
                "UserId": $scope.UserId,
                "ParentOrganizationId": $scope.ParentHospitalID,
                "HospitalId": $scope.HospitalId,
                "DischargeTimerTemplateId": $scope.DischargeTimerTemplateObj.TemplateId,
                "DischargeTimerTemplateName": $scope.DischargeTimerTemplateObj.TemplateName,
                //"DischargeTimeId": $scope.DischargeTimerTemplateObj.TimeId,
                //"DischargeTime": $scope.DischargeTimerTemplateObj.Time,
                "DeleteInd": DeleteInd,
                "UserOrderDetails": UserOrderDetails || [],
            }
            eHnoteSurgeryService.AddUpdateDischargeTimerTemplateData(ReqObj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());
                    $scope.GetDischargeTimerTemplateData();
                    $scope.GetDoctorWiseDischargeTimerTemplates();
                } else {
                    if (resp.data.Status === "Failure") {
                        alertify.error(resp.data.Message);
                    }
                }
            });
        };

        $scope.GetDischargeTimerTemplateData = function (val) {
            val = val || "";
            var req = {
                "HospitalId": $scope.HospitalId,
                "DoctorId": $scope.UserId,
                "ProcedureId": 0,
                "SearchText": val, //template name
                "PageSize": 10,
                "PageNumber": $scope.DischargeTimerTemplateObj.Pageno || 1
            }
            
            eHnoteSurgeryService.GetDischargeTimerTemplateData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.DischargeTimerTemplateObj.DischargeTemplatesData = resp.data.rows || [];
                        var PeginationArray = [];
                        //$scope.DischargeTimerTemplateObj.UserBasedTemplatesData = resp.data.rows.map(function (template) {
                        //    var doctorGroups = {};

                        //    angular.forEach(template.UserOrderDetails, function (item) {
                        //        if (!doctorGroups[item.DoctorID]) {
                        //            doctorGroups[item.DoctorID] = {
                        //                DischargeTimerOrderDetailId: item.DischargeTimerOrderDetailId,
                        //                DoctorId: item.DoctorID,
                        //                DoctorFullName: item.DoctorFullName,
                        //                ProceduresArray: []
                        //            };
                        //        }

                        //        doctorGroups[item.DoctorID].ProceduresArray.push({
                        //            DischargeTimerOrderDetailId: item.DischargeTimerOrderDetailId,
                        //            OrgProcedureId: item.OrgProcedureId,
                        //            ProcedureId: item.ProcedureId,
                        //            ProcedureName: item.ProcedureName,
                        //            CPTCode: item.CPTCode
                        //        });
                        //    });

                        //    return {
                        //        DischargeTimerTemplateId: template.DischargeTimerTemplateId,
                        //        DischargeTimerTemplateName: template.DischargeTimerTemplateName,
                        //        DischargeTimeId: template.DischargeTimeId,
                        //        DischargeTime: template.DischargeTime,
                        //        DeleteInd: template.DeleteInd,
                        //        DoctorsFilterArray: Object.values(doctorGroups)
                        //    };
                        //    PeginationArray.push(DoctorsFilterArray);
                        //});
                        //$scope.DischargeTimerTemplateObj.count = PeginationArray.length;
                    }
                }
            });
        };
        $scope.ChangeAllDoctorSelect = function (checked) {
            if (checked == true) {
                if ($scope.DischargeTimerTemplateObj.AllDoctorsArray.length > 0) {
                    angular.forEach($scope.DischargeTimerTemplateObj.AllDoctorsArray, function (item) {
                        item.IsChecked = true;
                        item.DeleteInd = "N";
                    });
                }
                $scope.DischargeTimerTemplateObj.SelectedDoctors = "All Doctors Selected";
            } else {
                if ($scope.DischargeTimerTemplateObj.AllDoctorsArray.length > 0) {
                    angular.forEach($scope.DischargeTimerTemplateObj.AllDoctorsArray, function (item) {
                        item.IsChecked = false;
                        if (item.DischargeTimerDoctorDetailId !== null) {
                            item.DeleteInd = "Y";
                        }
                    });
                }
                $scope.DischargeTimerTemplateObj.SelectedDoctors = "Select";
            }
        };

        $scope.EditDischargeTimerTemplate = function (item) {
            $scope.DischargeTimerTemplateObj.TemplateId = item.DischargeTimerTemplateId;
            $scope.DischargeTimerTemplateObj.TemplateName = item.DischargeTimerTemplateName;
            $scope.DischargeTimerTemplateObj.SurgeriesList = [];
            $scope.DischargeTimerTemplateObj.TimeId = item.DischargeTimeId;
            $scope.DischargeTimerTemplateObj.Time = item.DischargeTime;
            $scope.DischargeTimerTemplateObj.IsEditData = true;

            $scope.DischargeTimerTemplateObj.IsShowTemplateAddView = true;

            if (item.OrdersArray.length > 0) {
                angular.forEach(item.OrdersArray, function (Pitem) {
                    let object = {
                        "DischargeTimerOrderDetailId": Pitem.DischargeTimerOrderDetailId || 0,
                        "ProcedureId": Pitem.ProcedureId || 0,
                        "ProcedureName": Pitem.ProcedureName || "",
                        "OrgProcedureId": Pitem.OrgProcedureId || 0,
                        "CPTCode": Pitem.CPTCode,
                        "DeleteInd": "N",
                    };
                    if ($scope.DischargeTimerTemplateObj.SurgeriesList.length > 0) {
                        let TempSurgeryArray = $filter('filter')($scope.DischargeTimerTemplateObj.SurgeriesList, { 'ProcedureId': Pitem.ProcedureId }, true) || [];
                        if (TempSurgeryArray.length == 0) {
                            $scope.DischargeTimerTemplateObj.SurgeriesList.push(object);
                        }
                    } else {
                        $scope.DischargeTimerTemplateObj.SurgeriesList.push(object);
                    }
                });
            }
            if ($scope.DischargeTimerTemplateObj.AllDoctorsArray.length > 0) {
                let TempDoctorsArray = $filter('filter')($scope.DischargeTimerTemplateObj.AllDoctorsArray, { 'DoctorID': item.DoctorID }, true) || [];
                if (TempDoctorsArray.length > 0) {
                    TempDoctorsArray[0].IsChecked = true;
                    TempDoctorsArray[0].DischargeTimerOrderDetailId = 0;
                    $scope.DischargeTimerTemplateObj.SelectedDoctors = TempDoctorsArray[0].SecondUserFullName || "Selected";
                }
            }
        };
        $scope.DeleteDischargeTimerTemplate = function (item) {
            $scope.DischargeTimerTemplateObj.DischargeTemplatesData = $scope.DischargeTimerTemplateObj.DischargeTemplatesData || [];

            let TempTemplateArray = $filter('filter')($scope.DischargeTimerTemplateObj.DischargeTemplatesData, { 'DischargeTimerTemplateId': item.DischargeTimerTemplateId }, true) || [];

            if (TempTemplateArray.length > 0) {

                let SubDoctorArray = $filter('filter')(TempTemplateArray[0].UserOrderDetails, { 'DoctorID': item.DoctorID }, true) || [];
                if (SubDoctorArray.length > 0) {
                    angular.forEach(SubDoctorArray, function (Sitem) {
                        Sitem.DeleteInd = "Y";
                    });
                }

                let DeleteInd = "N";
                var TempFilter = $filter('filter')(TempTemplateArray[0].UserOrderDetails, { 'DeleteInd': "N" }, true) || [];
                if (TempFilter.length == 0) {
                    DeleteInd = "Y";
                }


                var ReqObj = {
                    "UserId": TempTemplateArray[0].UserId,
                    "ParentOrganizationId": $scope.ParentHospitalID,
                    "HospitalId": $scope.HospitalId,
                    "DischargeTimerTemplateId": TempTemplateArray[0].DischargeTimerTemplateId,
                    "DischargeTimerTemplateName": TempTemplateArray[0].DischargeTimerTemplateName,
                    "DischargeTimeId": TempTemplateArray[0].DischargeTimeId,
                    "DischargeTime": TempTemplateArray[0].DischargeTime,
                    "DeleteInd": DeleteInd,
                    "UserOrderDetails": TempTemplateArray[0].UserOrderDetails || [],
                }
                eHnoteSurgeryService.AddUpdateDischargeTimerTemplateData(ReqObj).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        $scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());
                        $scope.GetDischargeTimerTemplateData();
                        $scope.GetDoctorWiseDischargeTimerTemplates();
                    }
                });
            }
        };

        //$scope.stopClosingDropDown = function (event) {
        //    event.stopPropagation();
        //}
        $scope.portalPreview = function () {
            $scope.mInstancePortalPrivewAdd = $uibModal.open({
                "templateUrl": "portalPreview.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "offcanves-right modal__width--70",
                "controller": function ($scope, $uibModal, $uibModalInstance) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.selectBrandColor = function (color) {
            $scope.portalBranding.selectedColor = color.hex;
            $scope.portalBranding.hexCode = color.hex;
            $scope.portalBranding.isSaved = false;
        };

        $scope.enableSavebutton = function () {
            $scope.portalBranding.isSaved = false;
        };

        $scope.onLogoSelect = function (file) {
            if (!file) return;
            $scope.portalBranding.isSaved = false;
            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
            if (!validTypes.includes(file.type)) {
                alertify.error("Only PNG, JPG, JPEG,SVG allowed");
                return;
            }

            const maxSize = 500 * 1024; // 500 KB in bytes
            if (file.size > maxSize) {
                alertify.error("File size must be less than 500 KB");
                return;
            }

            $scope.portalBranding.logoFile = file;

            convertFileToBase64(file, function (base64) {
                $scope.$apply(() => {
                    $scope.portalBranding.logo = base64;
                });
            });
        };

        $scope.onFaviconSelect = function (file) {
            if (!file) return;
            $scope.portalBranding.isSaved = false;
            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
            if (!validTypes.includes(file.type)) {
                alertify.error("Only PNG, JPG, JPEG,SVG allowed");
                return;
            }

            const maxSize = 500 * 1024; // 500 KB in bytes
            if (file.size > maxSize) {
                alertify.error("File size must be less than 500 KB");
                return;
            }

            $scope.portalBranding.faviconFile = file;

            convertFileToBase64(file, function (base64) {
                $scope.$apply(() => {
                    $scope.portalBranding.favicon = base64;
                });
            });
        };

        function convertFileToBase64(file, callback) {
            const reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.onerror = function (err) {
                console.error("File->Base64 conversion error", err);
                callback(null);
            };
            reader.readAsDataURL(file);
        }


        $scope.removeLogo = function () {
            $scope.portalBranding.logoFile = null;
            $scope.portalBranding.logo = null;
            $scope.portalBranding.LogoUrl = null;
            $scope.portalBranding.LogoFileName = '';
            $scope.portalBranding.isSaved = false;
        };

        $scope.removefavicon = function () {
            $scope.portalBranding.faviconFile = null;
            $scope.portalBranding.favicon = null;
            $scope.portalBranding.FaviconUrl = null;
            $scope.portalBranding.FaviconFileName = '';
            $scope.portalBranding.isSaved = false;
        };

        
        $scope.saveBrandChanges = function () {

            if (!$scope.portalBranding.practiceName?.trim()) {
                alertify.error("Practice Name is required");
                return;
            }
            if (!$scope.portalBranding.subText?.trim()) {
                alertify.error("Subtext is required");
                return;
            }
            if (!$scope.portalBranding.hexCode?.trim()) {
                alertify.error("Brand Color is required");
                return;
            }
            if (!$scope.portalBranding.logoFile) {
                alertify.error("Logo upload is required");
                return;
            }
            if (!$scope.portalBranding.faviconFile) {
                alertify.error("Favicon upload is required");
                return;
            }

            let payload = {
                OrganizationId: $scope.HospitalId,
                BrandColor: $scope.portalBranding.hexCode,
                PracticeName: $scope.portalBranding.practiceName || "",
                Subtext: $scope.portalBranding.subText || "",
                UpdatedBy: $scope.UserId || '',
                faviconFile: $scope.portalBranding.faviconFile || null,

                logoFile: $scope.portalBranding.logoFile || null,
                LogoUrl: $scope.portalBranding.LogoUrl || null,
                LogoFileName: $scope.portalBranding.LogoFileName || null,
                FaviconUrl: $scope.portalBranding.FaviconUrl || null,
                FaviconFileName: $scope.portalBranding.FaviconFileName || null,
                LogoBase64: $scope.portalBranding.logo || null,
                FaviconBase64: $scope.portalBranding.favicon || null

                                
            };

            eHnoteSettingsDataService.AddUpdatePortalBranding(payload, PortalBrandingsuccess, PortalBrandingError);

            function PortalBrandingsuccess(data) {
                if (data.Status === "Success") {
                    $scope.portalBranding.isSaved = true;
                    alertify.success("Saved successfully");
                    if ($scope.mInstancePortalPrivewAdd) {
                        $scope.mInstancePortalPrivewAdd.dismiss("cancel");
                    }
                    $scope.getOrgLogoByOrganizationId();
                }
            }
            function PortalBrandingError(data) {
                console.log(data);
            }
        };


        function convertUrlToBase64(url, callback) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => callback(reader.result);
                    reader.readAsDataURL(blob);
                })
                .catch(err => {
                    console.error("Base64 convert error:", err);
                    callback(null);
                });
        }

       

        $scope.getOrgLogoByOrganizationId = function () {

            var params = {
                "OrganizationId": $scope.HospitalId,
            };

            eHnoteSettingsDataService.getOrgLogoByOrganizationId(params.OrganizationId).then(function (resp) {
                if (resp.data.Status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.orgBrandingDetails = resp.data.rows[0];
                        $scope.portalBranding.logo = $scope.orgBrandingDetails.LogoBase64 || null;
                        $scope.portalBranding.favicon = $scope.orgBrandingDetails.FaviconBase64 || null;

                        $scope.portalBranding.logoFile = {
                            name: $scope.orgBrandingDetails.LogoFileName || ""
                        };
                        $scope.portalBranding.faviconFile = {
                            name: $scope.orgBrandingDetails.FaviconFileName || "",
                        };

                        $scope.portalBranding.selectedColor = $scope.orgBrandingDetails.BrandColor || '';
                        $scope.portalBranding.practiceName = $scope.orgBrandingDetails.PracticeName || '';
                        $scope.portalBranding.subText = $scope.orgBrandingDetails.Subtext || '';
                        $scope.portalBranding.hexCode = $scope.orgBrandingDetails.BrandColor || '';
                        $scope.portalBranding.LogoUrl = $scope.orgBrandingDetails.LogoUrl || null;
                        $scope.portalBranding.LogoFileName =$scope.orgBrandingDetails.LogoFileName || '';
                        $scope.portalBranding.FaviconUrl = $scope.orgBrandingDetails.FaviconUrl || null;
                        $scope.portalBranding.FaviconFileName = $scope.orgBrandingDetails.FaviconFileName || '';
                    }

                }
            });
        };


        $scope.NavToPortalBrandingTabScreen = function () {
            $scope.tabno = 36;
            $scope.portalBranding = GetPortalBrandingObj();
            $scope.getOrgLogoByOrganizationId();
        }
        $scope.GetDoctorWiseDischargeTimerTemplates = function (val) {
            val = val || '';
            var req = {
                "HospitalId": $scope.HospitalId,
                "DoctorId": $scope.UserId,
                "ProcedureId": 0,
                "SearchText": $scope.DischargeTimerTemplateObj.SearchText, //template name
                "PageSize": $scope.DischargeTimerTemplateObj.Pagesize || 10,
                "PageNumber": $scope.DischargeTimerTemplateObj.Pageno || 1,
                "ASCTemplateUserId": $scope.DischargeTimerTemplateObj.AscDischargeTemplateUserId,
            }

            eHnoteSurgeryService.GetDischargeTimerTemplateDataForDoctors(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.DischargeTimerTemplateObj.UserBasedTemplatesData = angular.copy(resp.data.rows)
                    } else {
                        $scope.DischargeTimerTemplateObj.UserBasedTemplatesData = [];
                    }
                    $scope.DischargeTimerTemplateObj.count = resp.data.count;
                }
            });

        };
        $scope.OpenTemplateAddView = function () {
            $scope.DischargeTimerTemplateObj.IsShowTemplateAddView = true;
        };
        $scope.CloseTemplateAddView = function () {
            $scope.DischargeTimerTemplateObj.IsShowTemplateAddView = false;
            $scope.DischargeTimerTemplateObj = angular.copy($scope.GetDischargeTimerTemplateObj());
            $scope.GetDoctorWiseDischargeTimerTemplates();
        };

        $scope.ChangeDefalutDoctorList = function (item, Type) {
            if (Type == 'OrderTemplate') {
                $scope.AscTemplateScreenObj.OrderDoctorObj = item;
                $scope.AscTemplateScreenObj.AscOrderTemplateUserId = item.DoctorID;
            }else if (Type == 'CheckListTemplate') {
                $scope.AscTemplateScreenObj.CheckListDoctorObj = item;
                $scope.AscTemplateScreenObj.AscCheckListTemplateUserId = item.DoctorID;
            } else if (Type == 'DischargeTemplate') {
                $scope.DischargeTimerTemplateObj.DoctorObj = item;
                $scope.DischargeTimerTemplateObj.AscDischargeTemplateUserId = item.DoctorID;
            }
            
        };

        $scope.ClickClearDefalutOrderTemplates = function (Type) {
            if (Type == 'OrderTemplate') {
                $scope.AscTemplateScreenObj.AscOrderTemplateUserId = 0;
                $scope.AscTemplateScreenObj.OrderDoctorObj = '';
                $scope.AscTemplateScreenObj.searchdoc = '';
                $scope.AscTemplateScreenObj.searchtext = '';
                $scope.GetAscSurgeryOrderTemplates();
            } else if (Type == 'CheckListTemplate') {
                $scope.AscTemplateScreenObj.AscCheckListTemplateUserId = 0;
                $scope.AscTemplateScreenObj.CheckListDoctorObj = '';
                $scope.AscTemplateScreenObj.searchCheckListdoc = '';
                $scope.AscTemplateScreenObj.searchtext = '';
                $scope.GetAscSurgeryCheckListTemplates();
            } else if (Type == 'DischargeTemplate') {
                $scope.DischargeTimerTemplateObj.AscDischargeTemplateUserId = 0;
                $scope.DischargeTimerTemplateObj.searchdoc = '';
                $scope.DischargeTimerTemplateObj.DoctorObj = '';
                $scope.DischargeTimerTemplateObj.SearchText = '';
                $scope.GetDoctorWiseDischargeTimerTemplates();
            }
            
            
        }
        
    }]);




"use strict";
eHnoteWebApp.controller("USYagPopupCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSurgeryService", "$q", "$timeout", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "USPrintService", "eHnoteAuditServices", "eHnoteConditionsDataService", "$uibModalInstance", "eHnoteUserDataService","$sce",
    function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSurgeryService, $q, $timeout, eHnoteMainAdminServices, eHnoteMainAppointmentService, USPrintService, eHnoteAuditServices, eHnoteConditionsDataService, $uibModalInstance, eHnoteUserDataService, $sce,) {
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };

        $scope.RoleId = userLoginDetails.RoleID;

        $scope.HeaderLogo = '';
        $scope.initOrgLogo = function () {
            var printobj = datapersistanceFactory.getItem("printSettingData");
            console.log(printobj);
            printobj.PrintHeaderImgUrl = printobj.PrintHeaderImgUrl || "";
            if (printobj.PrintHeaderImgUrl !== "") {
                $scope.toDataURL(printobj.PrintHeaderImgUrl, function (dataURL) {
                    $scope.HeaderLogo = dataURL;
                });
            }
        }

        $scope.YagtabObj = {
            "TAB": 1,
        };

        $scope.ValidateIndictor = false;

        $scope.ChangeSubTab = function (val, type) {
            $scope.ValidateIndictor = false;
            if ($scope.YagtabObj.TAB == 1) {
                $scope.savePreOPYagTemplateData();
            } else if ($scope.YagtabObj.TAB == 2) {
                $scope.saveIntraOPYagTemplateData();
            } else if ($scope.YagtabObj.TAB == 3) {
                $scope.savePostOPYagTemplateData();
            }

            if (!$scope.ValidateIndictor) {
                $scope.YagtabObj.TAB = val;
            }
            $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());

        }

        $scope.MedicationShow = {
            "IsPreopMedications": false,
            "IsPreopGenOrders": false,
            "IsIntraOpMedications": false,
            "IsIntraOpGenOrders": false,
        };

        $scope.GetLogObj = function () {
            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "LogArray": [],
                "OrgASCChecklist": [],
                "ProcedureName": '',
                "SiteName": "",
                "PreOPAddedById": null,
                "PreOpAddedByName": '',
                "PreOPNurseReviewedById": null,
                "PreOPNurseReviewedByName": '',
                "IsYagTemplateDataAdded": false,
                "PostOpAddedById": null,
                "PostOpAddedByName": '',
                "PostOpRecoveryNurseById": null,
                "PostOpRecoveryNurseByName": '',
                "PostOpPhysicianReviewedById": null,
                "PostOpPhysicianReviewedByName": '',
                "PostOpDischaredTime": '',
                "PatientDischarge": '',
                "IntraOpNurseReviewedById": null,
                "IntraOpNurseReviewedByName": '',
                "IntraOpNurseAddedById": null,
                "IntraOpNurseAddedByName": '',
                "AssistiveWalkingDevice": '',
                "FallriskBraceletprovided": '',
                "AssistiveWalkingDevice": '',
                "FallRiskLevel": '',
                "FallRiskAssessmentTotalScore": null,
                "IntraOpRoomInTimeOD": '',
                "IntraOpRoomOutTimeOD": '',
                "IntraOpStartTimeOD": '',
                "IntraOpEndTimeOD": '',
                "IntraOpBurstsOD": '',
                "IntraOpMjOD": '',
                "IntraOpRoomInTimeOS": '',
                "IntraOpRoomOutTimeOS": '',
                "IntraOpStartTimeOS": '',
                "IntraOpEndTimeOS": '',
                "IntraOpBurstsOS": '',
                "IntraOpMjOS": '',
                "ImplemetedHighRiskfallprevention": '',
                "IntraOpProcedureName": '',
                "IntraOpSiteName": "",
                "AnesthesiaTypeList": [],
                "PreOpVitalsArray": [],
                "PostOpVitalsArray": [],
                "PreOpOverallNotes": "",
                "IntraOpYagLensId": null,
                "DilationMedications": [],
                "GeneralOrders": [],
                "IntraOpGeneralOrders": [],
                "IntraOpMedications": [],
                "PreOpOrderDetails": [],
                "IntraOpOrderDetails":[],
                "IntraOpYagLensName": "",
                "PreOpLastSignOffUserDetails": [],
                "IntraOpLastSignOffUserDetails": [],
                "PostOpLastSignOffUserDetails": [],
                "AnesthetistFireRiskID": null,
                "AnesthetistFireRiskName": "",
                "AnesthetistFireRiskLicenseNo": null,
                "DoctorFireRiskID": null,
                "DoctorFireRiskName": "",
                "DoctorFireRiskLicenseNo": null,
                "RiskLevel": "",
                "NurseFireRiskID": null,
                "NurseFireRiskName": "",
                "NurseFireRiskLicenseNo": null,
                "NurseFireRiskReviewdDate": null,
                "AnesthetistReviewdDate": null,
                "DoctorReviewdDate": null,

            }
        }
        $scope.LogObj = $scope.GetLogObj();

        $scope.PreOpTemplateobj = {
            "IsOpenOrderTemplate": false,
            "SelectedOrderTemplate": '',
            "TemplateName": '',
            "PreOpTemplateName": '',
            "DilationTemplateName": '',
            "IsOpenPreOpOrderTemplate": false,
            "SelectedPreopOrderTemplate": '',
        };
        $scope.IntraOpTemplateobj = {
            "IsOpenOrderTemplate": false,
            "SelectedOrderTemplate": '',
            "TemplateName": '',
            "IsOpenIntraOpOrderTemplate": false,
            "SelectedIntraopOrderTemplate": '',
        };


        $scope.yagPreOPTempObj = {
            IsClickSaveyagPreOPBtn: false,
            YagTemplateId: null,
            OrgASCChecklist: [],
            ProcedureName: '',
            SiteName: '',
            AssistiveWalkingDevice: '',
            FallriskBraceletprovided: '',
            FallRiskLevel: '',
            FallRiskAssessmentTotalScore: null,
            ImplemetedHighRiskfallprevention: '',
            PreOPAddedById: null,
            PreOpAddedByName: '',
            PreOPNurseReviewedById: null,
            PreOPNurseReviewedByName: '',
            PreOpOrderType: 'Medications',
            PreOpVitalsArray: [],
            PreOpOrderDetails: [
                {
                    UserOrderId: 0,
                    UserId: $scope.UserId,
                    DeleteInd: "N",
                    IsOrderReviewed: false,
                    ReviewedByPassword: '',
                    ReviewedByDateTime: null,
                    ReviewedBy: null,
                    UserType: "Nurse",
                    ScreenType: "YagTemplate",
                    ScreenTypeId: 10,
                    MedTypeId: null,
                    MedTypeName: '',
                    DilationMedications: [],
                    GeneralOrders: []
                }
            ],
            PreOpOverallNotes: '',
            PreOpReviewedByDate: null,
            PreOpReviewedByTime: '',
            IsPreOpDataAdded: false,
            YagPreopChartStatus: 'D',
            LastSignOffUserDetails: []

        }
        $scope.yagIntraOPTempObj = {
            IsClickSaveyagIntraOPBtn: false,
            YagTemplateId: null,
            OrgASCChecklist: [],
            IntraOpNurseReviewedById: null,
            IntraOpNurseReviewedByName: '',
            IntraOpNurseAddedById: null,
            IntraOpNurseAddedByName: '',
            IntraOpRoomInTimeOD: '',
            IntraOpRoomOutTimeOD: '',
            IntraOpStartTimeOD: '',
            IntraOpEndTimeOD: '',
            IntraOpBurstsOD: '',
            IntraOpMjOD: '',
            IntraOpRoomInTimeOS: '',
            IntraOpRoomOutTimeOS: '',
            IntraOpStartTimeOS: '',
            IntraOpEndTimeOS: '',
            IntraOpBurstsOS: '',
            IntraOpMjOS: '',
            IntraOpProcedureName: '',
            IntraOpSiteName: '',
            IntraOpOrderType: 'AnesthesiaMedications',
            IntraOpOrderDetails: [
                {
                    UserOrderId: 0,
                    UserId: $scope.UserId,
                    DeleteInd: "N",
                    IsOrderReviewed: false,
                    ReviewedByPassword: '',
                    ReviewedByDateTime: null,
                    ReviewedBy: null,
                    UserType: "Nurse",
                    ScreenType: "YagTemplate",
                    ScreenTypeId: 10,
                    MedTypeId: null,
                    MedTypeName: '',
                    IntraOpMedications: [],
                    GeneralOrders: []
                }
            ],
            IntraOpReviewedByDate: null,
            IntraOpReviewedByTime: '',
            AnesthesiaTypeList: [{
                    AnesthesiaTypeId: 1,
                    AnesthesiaType: "Topical",
                    IsSelected: false,
                    PatientAnesthesiaPlanId: 0,
                    DeleteInd: "N"
                }],
            IntraOpYagLensId: null,
            IntraOpYagLensName: '',
            YagIntraopNurseChartStatus: 'D',
            YagIntraopDoctorChartStatus: 'D',
            IsIntraOpDataAdded: false,
            LastSignOffUserDetails: [],
            IsShowAnesthetistReviewByinFireRisk: false,
            IsShowDoctorReviewByinFireRisk: false,
            AnesthetistFireRiskID: null,
            AnesthetistFireRiskName: "",
            AnesthetistFireRiskLicenseNo: null,
            DoctorFireRiskID: null,
            DoctorFireRiskName: "",
            DoctorFireRiskLicenseNo: null,
            RiskLevel: "",
            NurseFireRiskID: null,
            NurseFireRiskName: "",
            NurseFireRiskLicenseNo: null,
            AnesthesiologistArray: [],
            NurseArray: [],
            DoctorArray: [],
            NurseFireRiskReviewdDate: null,
            AnesthetistReviewdDate: null,
            DoctorReviewdDate: null,
        }
        $scope.yagPostOPTempObj = {
            IsClickSaveyagPostOPBtn: false,
            YagTemplateId: null,
            OrgASCChecklist: [],
            PostOpAddedById: null,
            PostOpAddedByName: '',
            PostOpRecoveryNurseById: null,
            PostOpRecoveryNurseByName: '',
            PostOpPhysicianReviewedById: null,
            PostOpPhysicianReviewedByName: '',
            PostOpDischaredTime: '',
            PatientDischarge: '',
            PostOpReviewedByDate: null,
            PostOpReviewedByTime: '',
            PostOpVitalsArray: [],
            YagPostopChartStatus: 'D',
            YagPostopNurseChartStatus: '',
            YagPostopDoctorChartStatus: '',
            IsPostOpDataAdded: false,
            LastSignOffUserDetails: []
        }
        $scope.allUserList = $scope.allUserList || [];
      
        if ($scope.RoleId != 1 && $scope.RoleId != 43) {
            $scope.yagIntraOPTempObj.YagIntraopNurseChartStatus = 'D'
            $scope.yagPostOPTempObj.YagPostopNurseChartStatus = 'D'
        } else {
            $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus = 'D'
            $scope.yagPostOPTempObj.YagPostopDoctorChartStatus = 'D'
        }
        if ($scope.allUserList.length > 0) {
            $scope.NurseReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            //$scope.SurgeonArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
            $scope.NurseAnesthetistReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 25 || x.RoleId == 8);
            $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 72 || x.RoleId == 43 || x.RoleId == 18 || x.RoleId == 66 || x.RoleId == 67);
            $scope.MedicationGivenByNurseArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
            $scope.SurgeonArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10) || [];

            $scope.OnlyMDArray = [];
            $scope.OnlyMDArray = angular.copy($scope.ChecklistArray).filter((x) => x.SuffixId == 10);

            $scope.MedicationOnlyMDGivenByArray = $scope.NurseReviewedByArray.concat($scope.OnlyMDArray);
            $scope.MedicationGivenByArray = $scope.allUserList.filter((x) => x.RoleId == 25 || x.RoleId == 30);

            $scope.AnesthesiaMedicationArray = [];
            $scope.OnlyMDArrayForAnesthesia = [];

            $scope.AnesthesiaMedicationArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43 || x.RoleId == 30);
            $scope.OnlyMDArrayForAnesthesia = angular.copy($scope.AnesthesiaMedicationArray).filter((x) => x.SuffixId == 10);
            $scope.AnesthesiaGivenByArray = $scope.NurseReviewedByArray.concat($scope.OnlyMDArrayForAnesthesia);
            $scope.NurseDoctorsReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 1);
            $scope.NurseAndDoctorsArray = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 1 || x.RoleId == 43);

            $scope.AnesthesiologistArray = $scope.allUserList.filter((x) => x.RoleId == 30);


            $scope.yagIntraOPTempObj.NurseArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.yagIntraOPTempObj.DoctorArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
            $scope.yagIntraOPTempObj.AnesthesiologistArray = $scope.allUserList.filter((x) => x.RoleId == 30) || [];

        }

        $scope.TemperatureUnits = [
            {
                "Unit": "°F",
                "UnitId": 1
            },
            {
                "Unit": "°C",
                "UnitId": 2
            }
        ];

        $scope.subVitallist = function () {
            return [
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 11,
                    "VitalDesc": "Temperature",
                    "Value": "",
                    "UnitTypeId": 1,
                    "UnitTypeName": "°F",
                    "OrderType": 1
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 12,
                    "VitalDesc": "Pulse",
                    "Value": "",
                    "UnitTypeId": 3,
                    "UnitTypeName": "BPM",
                    "OrderType": 2
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 4,
                    "VitalDesc": "BP-Systolic",
                    "Value": "",
                    "UnitTypeId": 5,
                    "UnitTypeName": "mmHg",
                    "OrderType": 3
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 5,
                    "VitalDesc": "BP-Diastolic",
                    "Value": "",
                    "UnitTypeId": 5,
                    "UnitTypeName": "mmHg",
                    "OrderType": 4
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 14,
                    "VitalDesc": "Respiratory Rate",
                    "Value": "",
                    "UnitTypeId": 4,
                    "UnitTypeName": "BPM",
                    "OrderType": 5
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 15,
                    "VitalDesc": "SpO2",
                    "Value": "",
                    "UnitTypeId": 6,
                    "UnitTypeName": "%",
                    "OrderType": 6
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 8,
                    "VitalDesc": "Blood Glucose Level",
                    "Value": "",
                    "UnitTypeId": 11,
                    "UnitTypeName": "mg/dL",
                    "OrderType": 8
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 66,
                    "VitalDesc": "PainLevel",
                    "Value": "",
                    "UnitTypeId": null,
                    "UnitTypeName": "",
                    "OrderType": 9
                },
            ]

        }

        $scope.VitalsObj = function () {
            return {
                "VitalSummaryId": 0,
                "AppointmentId": 0,
                "VitalAddDate": moment().format("YYYY-MM-DD"),
                "VitalAddTime": "",
                "DoctorId": 0,
                "UserName": "",
                "DeleteInd": "N",
                "IsEditVitalInd": false,
                "VitalRemarks": "",
                "Vitals": angular.copy($scope.subVitallist()) || []
            };
        }

        let preOpVitals = $scope.VitalsObj();
        let postOpVitals = $scope.VitalsObj();
        $scope.yagPreOPTempObj.PreOpVitalsArray.push(preOpVitals);
        $scope.yagPostOPTempObj.PostOpVitalsArray.push(postOpVitals);

        $scope.GetDilationMedicationObj = function () {
            return {
                "OrderName": "",
                "MedicineObject": "",
                "MedicationId": null,
                "OrganizationMedicationId": null,
                "MedicationName": "",
                "DeleteInd": "N",
                "FrequencyId": null,
                "DoseId": null,
                "DoseUnitId": null,
                "RouteId": null,
                "ActionId": null,

                "Frequency": "",
                "Dose": "",
                "DoseUnit": "",
                "Route": "",
                "Action": "",

                "OrderDescription": "",
                "MedicationNotes": "",
                "maxDose": "",
                "IsChecked": false,
                "EditIndex": -1,
                "OrderTypeId": null,
                "OrderTypeName": "",
                "IsmedSearchDisabled": false
            };
        };
        $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());


        $scope.GetAnesthesiaMedicationObj = function () {
            return {
                "MedicineObject": "",
                "MedicationId": null,
                "OrganizationMedicationId": null,
                "MedicationName": "",

                "DeleteInd": "N",

                "FrequencyId": null,
                "DoseId": null,
                "DoseUnitId": null,
                "RouteId": null,
                "ActionId": null,

                "Frequency": "",
                "Dose": "",
                "DoseUnit": "",
                "Route": "",
                "Action": "",

                "OrderDescription": "",
                "MedicationNotes": "",
                "maxDose": "",
                "IsChecked": false,
                "EditIndex": -1,
                "OrderTypeId": null,
                "OrderTypeName": "",
            };
        };
        $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());


        $scope.uibclose = function () {
            $uibModalInstance.close("cancel");
        };

        $scope.init = function () {

            let req1 = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 1,
                "GetAllIndicator": 1
            };
            let req2 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
            };
            //let reqObj = {
            //    "OrganizationId": $scope.HospitalId
            //};
            let req3 = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ScreenTypeId": 10,
                "PageSize": 100,
                "SearchText": '',
                "PageNumber": 1,

            };

            $q.all([
                eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
                eHnoteSurgeryService.GetPreOPYagTemplateChartData(req2),
                eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId),
                eHnoteSurgeryService.GetAscUserOrderTemplates(req3),
                eHnoteSurgeryService.GetIntraOPYagTemplateChartData(req2),
                eHnoteSurgeryService.GetPostOPYagTemplateChartData(req2),
                /* eHnoteSurgeryService.GetPostOPYagTemplateChartData(req2),*/
                eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    if (resp[0].data.rows.length > 0) {
                        //$scope.yagPostOPTempObj.AnesthesiaTypeList = resp[0].data.AnaesthesiaTypes;

                        //if ($scope.yagPostOPTempObj.AnesthesiaTypeList.length > 0) {
                        //    angular.forEach($scope.yagPostOPTempObj.AnesthesiaTypeList, function (item) {
                        //        item.IsSelected = false;
                        //        item.DeleteInd = 'N';
                        //        item.PatientAnesthesiaPlanId = 0;
                        //    })
                        //}
                        $scope.IntraOpYagLensArray = resp[0].data.YagLens || [];
                        let OrgAscChecklistData = resp[0].data.rows;
                        angular.forEach(OrgAscChecklistData, function (item) {
                            angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                kitem.IsChecked = false;
                                kitem.DeleteInd = 'N';
                            });
                        });

                        $scope.yagPreOPTempObj.OrgASCChecklist = $filter('filter')(OrgAscChecklistData,function (item) {
                                return item.CheckListCategoryId === 21 || item.CheckListCategoryId === 24;
                            }
                        ) || [];

                        $scope.yagIntraOPTempObj.OrgASCChecklist = $filter('filter')(OrgAscChecklistData, function (item) {
                            return item.CheckListCategoryId === 22 || item.CheckListCategoryId === 10;
                        }
                        ) || [];

                        //$scope.yagIntraOPTempObj.OrgASCChecklist = $filter("filter")(OrgAscChecklistData, { "CheckListCategoryId": 22 }, true) || [];
                        $scope.yagPostOPTempObj.OrgASCChecklist = $filter("filter")(OrgAscChecklistData, { "CheckListCategoryId": 23 }, true) || [];

                    }
                }

                if (resp[1].data.status === "Success") {
                    if (resp[1].data.rows.length > 0) {
                        let yagTempData = angular.copy(resp[1].data.rows[0]) || {};
                        $scope.yagPreOPTempObj.LastSignOffUserDetails = resp[1].data.LastSignOffUserDetails || [];
                        $scope.yagPreOPLastSignOffUserDeatils = resp[1].data.LastSignOffUserDetails || [];
                        $scope.LogObj.PreOpLastSignOffUserDetails = resp[1].data.LastSignOffUserDetails || [];
                        preOPYagtempalteResponceData(yagTempData)
                    }
                }

                if (resp[2].data.status === "Success") {
                    angular.forEach(resp[2].data.rows, function (item) {
                        item.AscMedicationId = 0;
                        item.IsChecked = false;
                        item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                    });

                    let tempanesthesiaMedications = $filter('filter')(resp[2].data.rows, { "MedTypeId": 12 }, true);
                    $scope.MasterAnesthesiaMedications = angular.copy(tempanesthesiaMedications);

                    let tempDilationMedications = $filter('filter')(resp[2].data.rows, { "MedTypeId": 11 }, true);
                    $scope.MasterDilationMedications = angular.copy(tempDilationMedications);
                }

                if (resp[3].data.Status === "Success") {
                    $scope.UserOrderList = resp[3].data.rows || [];
                }
                if (resp[4].data.status === "Success") {
                    if (resp[4].data.rows.length > 0) {
                        let data = angular.copy(resp[4].data.rows[0]) || {};
                        $scope.yagIntraOPTempObj.LastSignOffUserDetails = resp[4].data.LastSignOffUserDetails || [];
                        $scope.yagIntraOPLastSignOffUserDeatils = resp[4].data.LastSignOffUserDetails || [];
                        $scope.LogObj.IntraOpLastSignOffUserDetails = resp[4].data.LastSignOffUserDetails || [];
                        intraOPYagTemplateResponseData(data)
                    }
                }
                if (resp[5].data.status === "Success") {
                    if (resp[5].data.rows.length > 0) {
                        let data = angular.copy(resp[5].data.rows[0]) || {};
                        $scope.yagPostOPTempObj.LastSignOffUserDetails = resp[5].data.LastSignOffUserDetails || [];
                        $scope.yagPostOPLastSignOffUserDeatils = resp[5].data.LastSignOffUserDetails || [];
                        $scope.LogObj.PostOpLastSignOffUserDetails = resp[5].data.LastSignOffUserDetails || [];
                        postOPYagTemplateResponseData(data)
                    }
                }

                if (resp[6].data.status === "Success") {
                   

                    $scope.doseArray = resp[6].data.doseArray || [];
                    $scope.doseOtherArray = resp[6].data.doseOtherArray || [];
                    $scope.frequencyArray = resp[6].data.frequencyArray || [];
                    $scope.refillsArray = resp[6].data.refillsArray || [];
                    $scope.durationArray = resp[6].data.durationArray || [];
                    $scope.actionArray = resp[6].data.actionArray || [];
                    $scope.routeArray = resp[6].data.routeArray || [];
                    $scope.doseUnitArray = resp[6].data.doseUnitArray || [];
                    $scope.quantityUnitArray = resp[6].data.quantityUnitArray || [];
                    $scope.MedicationStopReasons = resp[6].data.MedicationStopReasons || [];
                }




                $scope.initOrgLogo();
            });
        };
        $scope.init();

        $scope.ChangePreOpReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.yagPreOPTempObj.PreOpReviewedByDate = $filter('date')(new Date(), "MM-dd-yyyy");
                $scope.yagPreOPTempObj.PreOpReviewedByTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                $scope.yagPreOPTempObj.PreOpReviewedByDate = null;
                $scope.yagPreOPTempObj.PreOpReviewedByTime = '';
            }
        }

        $scope.ChangeIntraOpReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.yagIntraOPTempObj.IntraOpReviewedByDate = $filter('date')(new Date(), "MM-dd-yyyy");
                $scope.yagIntraOPTempObj.IntraOpReviewedByTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                $scope.yagIntraOPTempObj.IntraOpReviewedByDate = null;
                $scope.yagIntraOPTempObj.IntraOpReviewedByTime = '';
            }
        }

        $scope.ChangeYagLensUsed = function (YagLensId) {
            if (YagLensId != null) {
                var YagLensArray = $filter("filter")($scope.IntraOpYagLensArray, function (item) { return item.YagLensId == YagLensId });
                if (YagLensArray.length > 0) {
                    $scope.yagIntraOPTempObj.IntraOpYagLensName = YagLensArray[0].YagLensName;
                }
            } else {
                $scope.yagIntraOPTempObj.IntraOpYagLensName = '';
            }
        }


        $scope.ChangePostOpReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.yagPostOPTempObj.PostOpReviewedByDate = $filter('date')(new Date(), "MM-dd-yyyy");
                $scope.yagPostOPTempObj.PostOpReviewedByTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                $scope.yagPostOPTempObj.PostOpReviewedByDate = null;
                $scope.yagPostOPTempObj.PostOpReviewedByTime = '';
            }
        }
       
        $scope.toggleSite = function (value) {
            if ($scope.yagPreOPTempObj.SiteName === value) {
                $scope.yagPreOPTempObj.SiteName = '';
            } else {
                $scope.yagPreOPTempObj.SiteName = value;
            }
        };

       
        $scope.toggleIntraOpSite = function (value) {
            if ($scope.yagIntraOPTempObj.IntraOpSiteName === value) {
                $scope.yagIntraOPTempObj.IntraOpSiteName = '';
            } else {
                $scope.yagIntraOPTempObj.IntraOpSiteName = value;
            }

            if ($scope.yagIntraOPTempObj.IntraOpSiteName == 'OD') {
                $scope.yagIntraOPTempObj.IntraOpMjOS = '';
                $scope.yagIntraOPTempObj.IntraOpBurstsOS = '';
                $scope.yagIntraOPTempObj.IntraOpEndTimeOS = '';
                $scope.yagIntraOPTempObj.IntraOpStartTimeOS = '';
                $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS = '';
                $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS = '';
            }
            if ($scope.yagIntraOPTempObj.IntraOpSiteName == 'OS') {
                $scope.yagIntraOPTempObj.IntraOpMjOD = '';
                $scope.yagIntraOPTempObj.IntraOpBurstsOD = '';
                $scope.yagIntraOPTempObj.IntraOpEndTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpStartTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD = '';

            }
            if ($scope.yagIntraOPTempObj.IntraOpSiteName == 'OU' || $scope.yagIntraOPTempObj.IntraOpSiteName=='') {
                $scope.yagIntraOPTempObj.IntraOpMjOD = '';
                $scope.yagIntraOPTempObj.IntraOpBurstsOD = '';
                $scope.yagIntraOPTempObj.IntraOpEndTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpStartTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD = '';
                $scope.yagIntraOPTempObj.IntraOpMjOS = '';
                $scope.yagIntraOPTempObj.IntraOpBurstsOS = '';
                $scope.yagIntraOPTempObj.IntraOpEndTimeOS = '';
                $scope.yagIntraOPTempObj.IntraOpStartTimeOS = '';
                $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS = '';
                $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS = '';

            }
        };

        $scope.setPatientDischargeData = function (value) {
            if ($scope.yagPostOPTempObj.PatientDischarge === value) {
                $scope.yagPostOPTempObj.PatientDischarge = '';
            } else {
                $scope.yagPostOPTempObj.PatientDischarge = value;
            }
        };

        $scope.getintraopRoomInTime = function (Id) {
            if (Id === 1) {
                $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 2) {
                $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 3) {
                $scope.yagIntraOPTempObj.IntraOpStartTimeOD = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 4) {
                $scope.yagIntraOPTempObj.IntraOpEndTimeOD = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 5) {
                $scope.yagPostOPTempObj.PostOpDischaredTime = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 6) {
                $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 7) {
                $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 8) {
                $scope.yagIntraOPTempObj.IntraOpStartTimeOS = $filter('date')(new Date(), "hh:mm a");
            } else if (Id === 9) {
                $scope.yagIntraOPTempObj.IntraOpEndTimeOS = $filter('date')(new Date(), "hh:mm a");
            }

        };

        $scope.OnPreOpChecklistSelect = function (obj, parentobj) {
            var CheckListInd = false;
            angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {
                if (obj.IsChecked == true && item.Value == obj.Value) {
                    CheckListInd = true;
                    item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                    if (item.PatientAscCheckListDetailId != null) {
                        item.DeleteInd = "Y";
                    }
                } else {
                    item.IsChecked = false;
                }
            })

            if (CheckListInd == true) {
                obj.IsChecked = false;
                parentobj.IsChecked = false;
                parentobj.shownotes=false


            } else {
                obj.IsChecked = true;
                parentobj.IsChecked = true;
                if (parentobj.Value == "Others") {
                    parentobj.Remarks = "";
                }
                parentobj.Value = obj.Value || '';
                parentobj.ChecklistDate = null;
            }


        };

        $scope.OnClickFallRiskData = function (Type, Value) {
            if (Type == 1) {
                $scope.yagPreOPTempObj.FallriskBraceletprovided = Value;
            } else if (Type == 2) {
                $scope.yagPreOPTempObj.AssistiveWalkingDevice = Value;
            } else if (Type == 3) {
                $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention = Value;
            }
        }

        $scope.toggleAnesthesia = function (obj) {
            if (obj.IsSelected == false) {
                obj.PatientAnesthesiaPlanId = obj.PatientAnesthesiaPlanId || null;
                if (obj.PatientAnesthesiaPlanId != null) {
                    obj.DeleteInd = 'Y';
                }
            } else {
                obj.DeleteInd = 'N';
            }
        };

        $scope.editYagTemplate = function (id) {
            if (id === 1) {
                $scope.yagPreOPTempObj.IsPreOpDataAdded = !$scope.yagPreOPTempObj.IsPreOpDataAdded
            } else if (id === 2) {
                $scope.yagIntraOPTempObj.IsIntraOpDataAdded = !$scope.yagIntraOPTempObj.IsIntraOpDataAdded
            }else if (id === 3) {
                $scope.yagPostOPTempObj.IsPostOpDataAdded = !$scope.yagPostOPTempObj.IsPostOpDataAdded
            }

            $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());
        }

        $scope.yagPreOPTempObj.IsClickSaveyagPreOPBtn = false;
        $scope.savePreOPYagTemplateData = function (str) {  
            $scope.LogObj.LogArray = [];
            let OrgASCChecklist = [];

            //$scope.yagPreOPTempObj.OrgASCChecklist = $filter('filter')(
            //    $scope.yagPreOPTempObj.OrgASCChecklist,
            //    function (item) {
            //        return item.CheckListCategoryId === 21 || item.CheckListCategoryId === 24;
            //    }
            //) || [];

            angular.forEach($scope.yagPreOPTempObj.OrgASCChecklist, function (item) {
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": checkedvalue.DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks || '',
                            "Score": item.Score || null
                        };
                        OrgASCChecklist.push(obj);
                    }

                }

            });

            var PreOpVitalsArray = $scope.yagPreOPTempObj.PreOpVitalsArray.filter(item => {
                item.VitalSummaryId = item.VitalSummaryId || 0;
                const isVitalsAdded = item.Vitals.some(vital => vital.Value);
                return item.VitalRemarks || item.DoctorId || item.VitalAddTime || isVitalsAdded || item.VitalSummaryId != 0;
            });



            var i = 0, K = 0;
            let logdilationmedications = [], GeneralOrders = [];

            let FinalOrderDetails = $filter('filter')($scope.yagPreOPTempObj.PreOpOrderDetails, { 'MedTypeId': 11 }, true) || [];
            if (FinalOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                    Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                    if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                        Mitem.ReviewedByPassword = Mitem.ReviewedByPassword || '';
                        if (Mitem.ReviewedByPassword == '') {
                            K++
                        }
                    }
                    if (Mitem.DilationMedications.length > 0) {
                        angular.forEach(Mitem.DilationMedications, function (item) {
                            item.IsDilationMed = true;
                            item.UserType = "Nurse";
                            if (item.DropTimings.length > 0) {
                                let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                if (tempArray.length > 0) {
                                    i++
                                }
                            };
                            logdilationmedications.push(item);
                        });

                    }

                    if (Mitem.GeneralOrders.length > 0) {
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            if (Mitem.MedTypeId == 11) {
                                GeneralOrders.push(item);
                            }
                        });

                    }
                });
            }

            if (K !== 0) {
                $scope.ValidateIndictor = true;
                alertify.error("Plese Enter Password");
                return false;
            }

            if (i !== 0) {
                $scope.ValidateIndictor = true;
                alertify.error("Plese select Givenby for Medications!");
                return false;
            }


            if (logdilationmedications.length > 0) {
                if ($scope.LogObj.DilationMedications.length > 0) {
                    $scope.CompareDilationMedications(logdilationmedications);
                } else {

                    angular.forEach(logdilationmedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Pre-Op Medications",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description.trim(),
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }
            }
            if (GeneralOrders.length > 0) {
                $scope.LogObj.GeneralOrders = $scope.LogObj.GeneralOrders || [];
                if ($scope.LogObj.GeneralOrders.length > 0) {
                    $scope.CompareGeneralOrders(GeneralOrders);
                } else {
                    angular.forEach(GeneralOrders, function (item) {

                        let description =
                            (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                            (item.Status ? `Status: ${item.Status}\n` : '') +
                            (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Pre-Op Custom Orders",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });

                }
            }

            $scope.LogObj.PreOpOrderDetails = $scope.LogObj.PreOpOrderDetails || [];
            if (FinalOrderDetails.length > 0 || $scope.LogObj.PreOpOrderDetails.length > 0) {
                angular.forEach(FinalOrderDetails, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.PreOpOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 37,
                            SubModuleName: "Yag Template",
                            ScreenType: "Pre-Op Orders",
                            ActionType: actionType,
                            OldActionDescription: '',
                            NewActionDescription: `Pre-Op Orders Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

            let submitObj = {
                "TypeId":1,
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                "YagTemplateId": $scope.yagPreOPTempObj.YagTemplateId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "Logs": $scope.LogObj || {},
                "YagPreopChartStatus": $scope.yagPreOPTempObj.YagPreopChartStatus,
                "PreOpVitalsArray": PreOpVitalsArray || [],
                "PreOpOrderDetails": FinalOrderDetails || [],
                "PreOpOverallNotes": $scope.yagPreOPTempObj.PreOpOverallNotes || '',
                "PreOpReviewedByDate": $scope.yagPreOPTempObj.PreOpReviewedByDate || null,
                "PreOpReviewedByTime": $scope.yagPreOPTempObj.PreOpReviewedByTime || '',
                "PreOPNurseReviewedById": $scope.yagPreOPTempObj.PreOPNurseReviewedById || null,
                //"ProcedureName": $scope.yagPreOPTempObj.ProcedureName || '',
                "SiteName": $scope.yagPreOPTempObj.SiteName || '',
                "OrgASCChecklist": OrgASCChecklist || [],
                "FallRiskLevel": $scope.yagPreOPTempObj.FallRiskLevel || '',
                "FallRiskAssessmentTotalScore": $scope.yagPreOPTempObj.FallRiskAssessmentTotalScore || '',
                "AssistiveWalkingDevice": $scope.yagPreOPTempObj.AssistiveWalkingDevice || '',
                "FallriskBraceletprovided": $scope.yagPreOPTempObj.FallriskBraceletprovided || '',
                "ImplemetedHighRiskfallprevention": $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention || ''
            };


            var sighnoffforlogs = str || '';
            if (sighnoffforlogs == 'SignOff' && $scope.shared.signOffUserId !=0) {
                let givenByUser = '';
                let oldGivenByUser = '';
                let oldValue = '';
                let newValue = '';

                var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.shared.signOffUserId });
                if (ReviewedByArraylist.length > 0) {
                    givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                        (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                }

                // Get previous sign-off nurse 
                if ($scope.LogObj.PreOpLastSignOffUserDetails.length > 0) {
                    let oldNurse = $filter('filter')($scope.allUserList, { DoctorID: $scope.LogObj.PreOpLastSignOffUserDetails[0].UserId }, true);
                    if (oldNurse.length > 0) {
                        oldGivenByUser = angular.copy(oldNurse[0].SecondUserFullName) +
                            (oldNurse[0].LicenseNumber ? " Lic:" + angular.copy(oldNurse[0].LicenseNumber) : "");
                    }
                }

                // Prepare old and new descriptions
                if (oldGivenByUser) {
                    oldValue = `Pre - op signed off by ${oldGivenByUser}`;
                }
                if (givenByUser) {
                    newValue = `Pre - op signed off by ${givenByUser}`;
                }
                if (newValue) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template PreOp",
                        "ScreenType": "Signed off",
                        "ActionType": "Signed off",
                        "OldActionDescription": oldValue,
                        "NewActionDescription": newValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
           
            if (sighnoffforlogs == 'Unsign') {
                let givenByUser = '';
                if ($scope.shared.signOffUserId) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.shared.signOffUserId});
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Unsign",
                        "ActionType": "unsigned",
                        "OldActionDescription": '',
                        "NewActionDescription": `Pre - op Unsigned  by ${givenByUser} In Yag Template`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            let PreOpChecklist = $filter("filter")(submitObj.OrgASCChecklist, { "CheckListCategoryId": 21 }, true) || [];
            let editPreOpChecklist = $filter("filter")($scope.PreOpTempOrgASCChecklistLogs, { "CheckListCategoryId": 21 }, true) || [];

            let UserAlreadyAddedPreOpList = $filter("filter")(editPreOpChecklist, { "CreatedBy": $scope.UserId }, true) || [];

            if (editPreOpChecklist.length > 0) {
                $scope.differences = $scope.findDifferences(PreOpChecklist, editPreOpChecklist) || [];
                if ($scope.differences.length > 0) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';

                    angular.forEach($scope.differences, function (diff) {
                        if (diff.changeType === 'unchecked') {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            if (OldAffecteditem !== '') OldAffecteditem += ', ';
                            NewAffecteditem += `Unchecked ${diff.CheckListName}: ${diff.oldValue}`;
                            OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                        } else {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            if (diff.savedRemarks && diff.savedRemarks.trim() !== '') {
                                NewAffecteditem += `${diff.CheckListName}: ${diff.savedValue} (Notes: ${diff.savedRemarks.trim()})`;
                            } else {
                                NewAffecteditem += `${diff.CheckListName}: ${diff.savedValue}`;
                            }

                            if (diff.oldValue !== undefined && diff.oldValue !== '') {
                                if (OldAffecteditem !== '') OldAffecteditem += ', ';
                                if (diff.oldRemarks && diff.oldRemarks.trim() !== '') {
                                    OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue} (Notes: ${diff.oldRemarks.trim()})`;
                                } else {
                                    OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                                }
                            }
                        }
                    });

                    let ActionType = (UserAlreadyAddedPreOpList.length === 0 && OldAffecteditem === '') ? "Added" : "Edited";

                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 37,
                        SubModuleName: "Yag Template",
                        ScreenType: "PreOp Checklist",
                        ActionType: ActionType,
                        OldActionDescription: OldAffecteditem,
                        NewActionDescription: NewAffecteditem,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    }
                    $scope.LogObj.LogArray.push(obj);
                }

            } else if (PreOpChecklist.length > 0) {
                let NewAffecteditem = '';
                angular.forEach(PreOpChecklist, function (item) {
                    if (item.PatientAscCheckListDetailId === 0) {
                        if (NewAffecteditem !== '') NewAffecteditem += ', ';
                        // Check for remarks
                        if (item.Remarks && item.Remarks.trim() !== '') {
                            NewAffecteditem += `${item.CheckListName}: ${item.Value} (Notes: ${item.Remarks.trim()})`;
                        } else {
                            NewAffecteditem += `${item.CheckListName}: ${item.Value}`;
                        }
                    }
                });

                if (NewAffecteditem !== '') {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 37,
                        SubModuleName: "Yag Template",
                        ScreenType: "PreOp Checklist",
                        ActionType: "Added",
                        OldActionDescription: '',
                        NewActionDescription: NewAffecteditem,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    }
                    $scope.LogObj.LogArray.push(obj);
                }
            }



            $scope.yagPreOPTempObj.SiteName = $scope.yagPreOPTempObj.SiteName || '';
            $scope.LogObj.SiteName = $scope.LogObj.SiteName || '';

            if ($scope.yagPreOPTempObj.SiteName || $scope.LogObj.SiteName) {
                let count = 0;
                let ActionType = $scope.LogObj.SiteName === '' ? 'Added' : 'Edited';

                if ($scope.yagPreOPTempObj.SiteName != $scope.LogObj.SiteName) {
                    count++;
                }

                let Oldvalue = '';
                let Newvalue = '';

                if ($scope.LogObj.SiteName) {
                    Oldvalue = "Site: " + $scope.LogObj.SiteName
                }
                if ($scope.yagPreOPTempObj.SiteName) {
                    Newvalue = "Site: " + $scope.yagPreOPTempObj.SiteName
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PreOp Procedure",
                        "ActionType": ActionType,
                        "OldActionDescription": Oldvalue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }



            let PreOpFallRisk = $filter("filter")(submitObj.OrgASCChecklist, { "CheckListCategoryId": 24 }, true) || [];
            let editPreOpFallRisk = $filter("filter")($scope.PreOpTempOrgASCChecklistLogs, { "CheckListCategoryId": 24 }, true) || [];
           
            $scope.yagPreOPTempObj.AssistiveWalkingDevice = $scope.yagPreOPTempObj.AssistiveWalkingDevice || '';
            $scope.LogObj.AssistiveWalkingDevice = $scope.LogObj.AssistiveWalkingDevice || '';
            $scope.yagPreOPTempObj.FallriskBraceletprovided = $scope.yagPreOPTempObj.FallriskBraceletprovided || '';
            $scope.LogObj.FallriskBraceletprovided = $scope.LogObj.FallriskBraceletprovided || '';
            $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention = $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention || '';
            $scope.LogObj.ImplemetedHighRiskfallprevention = $scope.LogObj.ImplemetedHighRiskfallprevention || '';

            var UserAlreadyAddedPreOpFallRiskList = $filter("filter")(editPreOpFallRisk, { "CreatedBy": $scope.UserId }, true) || [];

            if (editPreOpFallRisk.length > 0 || $scope.LogObj.AssistiveWalkingDevice || $scope.LogObj.FallriskBraceletprovided || $scope.LogObj.ImplemetedHighRiskfallprevention) {
                let count = 0;
                let NewAffecteditem = '';
                let OldAffecteditem = '';
                let differences = $scope.findDifferences(PreOpFallRisk, editPreOpFallRisk) || [];
                if (differences.length > 0) {
                    angular.forEach(differences, function (diff) {
                        if (diff.changeType === 'unchecked') {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            if (OldAffecteditem !== '') OldAffecteditem += ', ';
                            NewAffecteditem += `Unchecked ${diff.CheckListName}: ${diff.oldValue}`;
                            OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                        } else {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            NewAffecteditem += `${diff.CheckListName}: ${diff.savedValue}`;

                            if (diff.oldValue !== undefined && diff.oldValue !== '') {
                                if (OldAffecteditem !== '') OldAffecteditem += ', ';
                                OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                            }
                        }
                    });
                }

                if ($scope.yagPreOPTempObj.AssistiveWalkingDevice != $scope.LogObj.AssistiveWalkingDevice) {
                    if ($scope.yagPreOPTempObj.AssistiveWalkingDevice)
                        NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Use of assistive walking device: ${$scope.yagPreOPTempObj.AssistiveWalkingDevice}`;
                    if ($scope.LogObj.AssistiveWalkingDevice)
                        OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Use of assistive walking device: ${$scope.LogObj.AssistiveWalkingDevice}`;
                    count++;
                }

                if ($scope.yagPreOPTempObj.FallriskBraceletprovided != $scope.LogObj.FallriskBraceletprovided) {
                    if ($scope.yagPreOPTempObj.FallriskBraceletprovided)
                        NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Fall risk bracelet provided: ${$scope.yagPreOPTempObj.FallriskBraceletprovided}`;
                    if ($scope.LogObj.FallriskBraceletprovided)
                        OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Fall risk bracelet provided: ${$scope.LogObj.FallriskBraceletprovided}`;
                    count++;
                }

                if ($scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention != $scope.LogObj.ImplemetedHighRiskfallprevention) {
                    if ($scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention)
                        NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Implemented high risk fall prevention interventions: ${$scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention}`;
                    if ($scope.LogObj.ImplemetedHighRiskfallprevention)
                        OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Implemented high risk fall prevention interventions: ${$scope.LogObj.ImplemetedHighRiskfallprevention}`;
                    count++;
                }


                let ActionType = (UserAlreadyAddedPreOpFallRiskList.length === 0 && OldAffecteditem === '') ? "Added" : "Edited";

                if (differences.length>0 || count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PreOp Morse Fall Risk Score",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (PreOpFallRisk.length > 0 || $scope.yagPreOPTempObj.AssistiveWalkingDevice || $scope.yagPreOPTempObj.FallriskBraceletprovided || $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention) {

                let NewAffecteditem = '';
                if (PreOpFallRisk.length > 0) {
                    angular.forEach(PreOpFallRisk, function (item) {
                        if (NewAffecteditem !== '') {
                            NewAffecteditem += ', ';
                        }
                        NewAffecteditem += `${item.CheckListName}: ${item.Value}`;
                    });
                }
                

                if ($scope.yagPreOPTempObj.AssistiveWalkingDevice) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}use of assistive walking device: ${$scope.yagPreOPTempObj.AssistiveWalkingDevice}`;
                }
                if ($scope.yagPreOPTempObj.FallriskBraceletprovided) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Fall risk Bracelet provided: ${$scope.yagPreOPTempObj.FallriskBraceletprovided}`;
                }
                if ($scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Implemeted high risk fall prevention interventions: ${$scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention}`;
                }
                if (NewAffecteditem !='') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PreOp Morse Fall Risk Score",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }



            $scope.yagPreOPTempObj.PreOPNurseReviewedById = $scope.yagPreOPTempObj.PreOPNurseReviewedById || null;
            $scope.LogObj.PreOPNurseReviewedById = $scope.LogObj.PreOPNurseReviewedById || null;

            if ($scope.yagPreOPTempObj.PreOPNurseReviewedById || $scope.LogObj.PreOPNurseReviewedById) {
                let count = 0;
                
                let ActionType = $scope.LogObj.PreOPNurseReviewedById == null ? 'Added' : 'Edited';

                let OldgivenByUser = '';
                let NewgivenByUser = '';

                var OldReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.PreOPNurseReviewedById });
                if (OldReviewedByArraylist.length > 0) {
                    OldgivenByUser = angular.copy(OldReviewedByArraylist[0].SecondUserFullName) +
                        (OldReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldReviewedByArraylist[0].LicenseNumber) : "");
                }

                var NewReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.yagPreOPTempObj.PreOPNurseReviewedById });
                if (NewReviewedByArraylist.length > 0) {
                    NewgivenByUser = angular.copy(NewReviewedByArraylist[0].SecondUserFullName) +
                        (NewReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(NewReviewedByArraylist[0].LicenseNumber) : "");
                }
                

                if ($scope.yagPreOPTempObj.PreOPNurseReviewedById != $scope.LogObj.PreOPNurseReviewedById) {
                    count++;
                }

                let OldValue = '';
                let NewValue = '';

                if (OldgivenByUser != '') {
                    OldValue = `Pre-Op Reviewed By ${OldgivenByUser} In Yag Template`;
                }
                if (NewgivenByUser != '') {
                    NewValue = `Pre-Op Reviewed By ${NewgivenByUser} In Yag Template`;
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PreOp Pre-Operative Nurse",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ((submitObj.PreOpVitalsArray || []).length > 0) {
                let ActionType = '';
                let OldDescription = '';
                let NewDescription = '';

                if (($scope.LogObj.PreOpVitalsArray || []).length === 0) {
                    // First-time add
                    ActionType = 'Added';
                    let indices = submitObj.PreOpVitalsArray.map((_, i) => i);
                    NewDescription = formatVitalsArray(submitObj.PreOpVitalsArray, indices, true);
                } else {
                    // Edit case
                    const changedIndices = getChangedVitalsIndices($scope.LogObj.PreOpVitalsArray, submitObj.PreOpVitalsArray);

                    if (changedIndices.length > 0) {
                        ActionType = 'Edited';
                        OldDescription = formatVitalsArray($scope.LogObj.PreOpVitalsArray, changedIndices, false, submitObj.PreOpVitalsArray);
                        NewDescription = formatVitalsArray(submitObj.PreOpVitalsArray, changedIndices, false, $scope.LogObj.PreOpVitalsArray);
                    }
                }

                if (ActionType !== '') {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 37,
                        SubModuleName: "Yag Template",
                        ScreenType: "PreOp Vitals",
                        ActionType: ActionType,
                        OldActionDescription: OldDescription,
                        NewActionDescription: NewDescription,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            $scope.yagPreOPTempObj.PreOpOverallNotes = $scope.yagPreOPTempObj.PreOpOverallNotes || '';
            $scope.LogObj.PreOpOverallNotes = $scope.LogObj.PreOpOverallNotes || '';

            if ($scope.yagPreOPTempObj.PreOpOverallNotes || $scope.LogObj.PreOpOverallNotes) {
                let count = 0;
                
                let ActionType = $scope.LogObj.PreOpOverallNotes === '' ? 'Added' : 'Edited';

                if ($scope.yagPreOPTempObj.PreOpOverallNotes != $scope.LogObj.PreOpOverallNotes) {
                    count++;
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PreOp Notes",
                        "ActionType": ActionType,
                        "OldActionDescription": $scope.LogObj.PreOpOverallNotes,
                        "NewActionDescription": $scope.yagPreOPTempObj.PreOpOverallNotes,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.LogObj.LogArray.length > 0) {
                submitObj.Logs = angular.copy($scope.LogObj) || {};
            }
            $scope.yagPreOPTempObj.IsClickSaveyagPreOPBtn = true;
            eHnoteSurgeryService.AddUpdatePreOPYagTemplateData(submitObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (!sighnoffforlogs) {
                        alertify.success("Pre-op saved successfully!");
                    }
                    $scope.yagPreOPTempObj.IsClickSaveyagPreOPBtn = false;
                    GetPreOPYagTemplateChartData()                  
                } else {
                    $scope.yagPreOPTempObj.IsClickSaveyagPreOPBtn = false;
                    alertify.error("Pre-op save is failed!");
                }
            });

        }
        $scope.yagIntraOPTempObj.IsClickSaveyagIntraOPBtn = false;
        $scope.saveIntraOPYagTemplateData = function (str) {
            $scope.LogObj.LogArray = [];
            let OrgASCChecklist = [];

            //$scope.yagIntraOPTempObj.OrgASCChecklist = $filter("filter")($scope.yagIntraOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 22}, true) || [];

            angular.forEach($scope.yagIntraOPTempObj.OrgASCChecklist, function (item) {
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": checkedvalue.DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks || '',
                            "Score": item.Score || null
                        };
                        OrgASCChecklist.push(obj);
                    }

                } else {
                    if (item.IsChecked || (item.PatientAscCheckListDetailId != 0 && item.IsChecked == false)) {
                        let DeleteInd = 'N';
                        if (item.PatientAscCheckListDetailId != 0 && item.IsChecked == false) {
                            DeleteInd = 'Y';
                        }
                        let obj = {
                            "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": item.OrganizationPreOpCheckListValueId || null,
                            "Value": item.Value || "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks,
                            "SubCheckList": [],
                        };
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (hitem) {
                                hitem.PatientAscSubCheckListId = hitem.PatientAscSubCheckListId || 0;
                                if (hitem.IsChecked || (hitem.PatientAscSubCheckListId != 0 && hitem.IsChecked == false)) {
                                    hitem.DeleteInd = 'N';
                                    if (hitem.PatientAscSubCheckListId != 0 && hitem.IsChecked == false) {
                                        hitem.DeleteInd = 'Y';
                                    }
                                    obj.SubCheckList.push(hitem);
                                }
                            });
                        }
                        OrgASCChecklist.push(obj);
                    }
                }
            });


            let AnesthesiaTypelist = [];
            if ($scope.yagIntraOPTempObj.AnesthesiaTypeList.length > 0) {
                AnesthesiaTypelist = $filter("filter")($scope.yagIntraOPTempObj.AnesthesiaTypeList, function (Aitem, index) { return (Aitem.IsSelected == true) || (Aitem.IsSelected == false && Aitem.DeleteInd == 'Y'); });
            }


            var a = 0, b = 0;
            let logIntraOpmedications = [], IntraOpGeneralOrders = [];

            let FinalIntraOpOrderDetails = $filter('filter')($scope.yagIntraOPTempObj.IntraOpOrderDetails, { 'MedTypeId': 12 }, true) || [];
            if (FinalIntraOpOrderDetails.length > 0) {
                angular.forEach(FinalIntraOpOrderDetails, function (Mitem) {
                    Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                    Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                    if (Mitem.ReviewedBy != null && Mitem.IsOrderReviewed == false) {
                        Mitem.ReviewedByPassword = Mitem.ReviewedByPassword || '';
                        if (Mitem.ReviewedByPassword == '') {
                            b++
                        }
                    }
                    if (Mitem.IntraOpMedications.length > 0) {
                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                            item.IsDilationMed = true;
                            item.UserType = "Nurse";
                            if (item.DropTimings.length > 0) {
                                let tempArray = $filter('filter')(item.DropTimings, { 'GivenBy': null }, true);
                                if (tempArray.length > 0) {
                                    a++
                                }
                            };
                            logIntraOpmedications.push(item);
                        });

                    }

                    if (Mitem.GeneralOrders.length > 0) {
                        angular.forEach(Mitem.GeneralOrders, function (item) {
                            if (Mitem.MedTypeId == 12) {
                                IntraOpGeneralOrders.push(item);
                            }
                        });

                    }
                });
            }

            if (b !== 0) {
                $scope.ValidateIndictor = true;
                alertify.error("Plese Enter Password");
                return false;
            }

            if (a !== 0) {
                $scope.ValidateIndictor = true;
                alertify.error("Plese select Givenby for Medications!");
                return false;
            }


            if (logIntraOpmedications.length > 0) {
                if ($scope.LogObj.IntraOpMedications.length > 0) {
                    $scope.CompareIntraOpMedications(logIntraOpmedications);
                } else {
                    angular.forEach(logIntraOpmedications, function (item) {
                        let description = '';
                        let timingDescriptions = [];
                        if (item.DropTimings && item.DropTimings.length > 0) {
                            angular.forEach(item.DropTimings, function (dt) {
                                let medicationTime = dt.MedicationTime || '';
                                let givenById = dt.GivenBy || '';
                                let medicationDosage = dt.MedicationDosage || '';
                                let Remarks = dt.Remarks || '';

                                let givenByUser = '';
                                if (givenById) {
                                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                                    if (user) givenByUser = user.FullName;
                                }

                                let Notes = '';
                                if (Remarks) {
                                    Notes = 'Notes: ' + Remarks;
                                }

                                let timingDescription = `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
                                timingDescriptions.push(timingDescription);
                            });

                            // Build conditional description
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '') +
                                (timingDescriptions.length > 0 ? timingDescriptions.join(', ') : '');
                        } else {
                            description =
                                (item.OrderDescription ? ` ${item.OrderDescription}\n` : '') +
                                (item.MedicationNotes ? `Notes: ${item.MedicationNotes}\n` : '');

                        }
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Intra-Op Medications",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description.trim(),
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });
                }
            }
            if (IntraOpGeneralOrders.length > 0) {
                $scope.LogObj.IntraOpGeneralOrders = $scope.LogObj.IntraOpGeneralOrders || [];
                if ($scope.LogObj.IntraOpGeneralOrders.length > 0) {
                    $scope.CompareIntraOpGeneralOrders(IntraOpGeneralOrders);
                } else {
                    angular.forEach(IntraOpGeneralOrders, function (item) {

                        let description =
                            (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                            (item.Status ? `Status: ${item.Status}\n` : '') +
                            (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Intra-Op Custom Orders",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    });

                }
            }

            $scope.LogObj.IntraOpOrderDetails = $scope.LogObj.IntraOpOrderDetails || [];
            if (FinalIntraOpOrderDetails.length > 0 || $scope.LogObj.IntraOpOrderDetails.length > 0) {
                angular.forEach(FinalIntraOpOrderDetails, function (currentItem) {
                    currentItem.IsOrderReviewed = currentItem.IsOrderReviewed || false;
                    var edited = $scope.LogObj.IntraOpOrderDetails.find(function (prev) {
                        return prev.UserOrderId === currentItem.UserOrderId;
                    });

                    if (currentItem.IsOrderReviewed && (!edited || edited.ReviewedBy !== currentItem.ReviewedBy)) {
                        let actionType = "Added";
                        let obj = {
                            LogId: 0,
                            ModuleId: 2,
                            ModuleName: "ASC",
                            SubModuleId: 37,
                            SubModuleName: "Yag Template",
                            ScreenType: "Intra-Op Orders",
                            ActionType: actionType,
                            OldActionDescription: '',
                            NewActionDescription: `Intra-Op Orders Signed By ${currentItem.ReviewedByName}`,
                            ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                });
            }

            var FireRiskArray = $filter("filter")($scope.LogObj.OrgASCChecklist, { "CheckListCategoryId": 10 }, true) || [];

            var FinalFireRiskArray = $filter("filter")(OrgASCChecklist, { "CheckListCategoryId": 10 }, true) || [];

            if (FireRiskArray.length > 0) {
                var EditCounter = 0;
                let editfireriskassess = $filter("filter")($scope.LogObj.OrgASCChecklist, function (item) {
                    return item.CheckListCategoryId === 10;
                }) || [];

                let addfireriskassess = $filter("filter")(OrgASCChecklist, function (item) {
                    return item.CheckListCategoryId === 10;
                }) || [];

                angular.forEach(addfireriskassess, function (Aitem) {
                    var TempChecklistArray = $filter("filter")(editfireriskassess, { "CheckListId": Aitem.CheckListId }, true) || [];
                    var SubCounter = 0;
                    if (TempChecklistArray.length > 0) {
                        if (TempChecklistArray[0].SubCheckList.length == Aitem.SubCheckList.length) {
                            angular.forEach(Aitem.SubCheckList, function (bitem) {
                                angular.forEach(TempChecklistArray[0].SubCheckList, function (citem) {
                                    citem.DeleteInd = citem.DeleteInd || "N";
                                    if (bitem.DeleteInd !== citem.DeleteInd) {
                                        SubCounter++;
                                    }
                                });
                            });
                        } else {
                            SubCounter++;
                        }
                        if (Aitem.DeleteInd !== TempChecklistArray[0].DeleteInd || SubCounter !== 0) {
                            EditCounter++;
                        }
                    } else {
                        EditCounter++;
                    }
                });

                if (EditCounter !== 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Fire Risk",
                        "ActionType": "Edited",
                        "OldActionDescription": `Fire Risk Assessment  in Yag intra-op For appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            } else {
                if (FinalFireRiskArray.length > 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Fire Risk",
                        "ActionType": "Added",
                        "NewActionDescription": `Fire Risk Assessment  in Yag intra-op For appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.yagIntraOPTempObj.NurseFireRiskID != null) {
                let editStatusReviewedcount = 0;
                let ActionType = ''
                var Newvalue = '';
                var OldValue = '';

                if ($scope.LogObj.NurseFireRiskID == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagIntraOPTempObj.NurseFireRiskID != $scope.LogObj.NurseFireRiskID) {
                    editStatusReviewedcount++;
                }
                if ($scope.yagIntraOPTempObj.NurseFireRiskID != $scope.LogObj.NurseFireRiskID) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';
                    let NewSurgeon = $filter("filter")($scope.yagIntraOPTempObj.NurseArray, function (item) {
                        return item.DoctorID == $scope.yagIntraOPTempObj.NurseFireRiskID;
                    });
                    if (NewSurgeon.length > 0) {
                        NewAffecteditem = `Fire Risk Assessment Nurse Reviewed By : ${NewSurgeon[0].FullName}`;
                        Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                    }
                    let OldSurgeon = $filter("filter")($scope.yagIntraOPTempObj.NurseArray, function (item) {
                        return item.DoctorID == $scope.LogObj.NurseFireRiskID;
                    });
                    if (OldSurgeon.length > 0) {
                        OldAffecteditem = `Fire Risk Assessment Nurse Reviewed By  : ${OldSurgeon[0].FullName}`;
                        OldValue += `${OldValue ? ', ' : ''}${OldAffecteditem}`;
                    }
                }


                if (editStatusReviewedcount != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Fire Risk",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.yagIntraOPTempObj.AnesthetistFireRiskID != null) {
                let editStatusReviewedcount = 0;
                let ActionType = '';
                var Newvalue = '';
                var OldValue = '';

                if ($scope.LogObj.AnesthetistFireRiskID == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagIntraOPTempObj.AnesthetistFireRiskID != $scope.LogObj.AnesthetistFireRiskID) {
                    editStatusReviewedcount++;
                }


                if ($scope.yagIntraOPTempObj.AnesthetistFireRiskID != $scope.LogObj.AnesthetistFireRiskID) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';
                    let NewSurgeon = $filter("filter")($scope.yagIntraOPTempObj.AnesthesiologistArray, function (item) {
                        return item.DoctorID == $scope.yagIntraOPTempObj.AnesthetistFireRiskID;
                    });
                    if (NewSurgeon.length > 0) {
                        NewAffecteditem = `Fire Risk Assessment Anesthesiologist Reviewed By  : ${NewSurgeon[0].FullName}`;
                        Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                    }
                    let OldSurgeon = $filter("filter")($scope.yagIntraOPTempObj.AnesthesiologistArray, function (item) {
                        return item.DoctorID == $scope.LogObj.AnesthetistFireRiskID;
                    });
                    if (OldSurgeon.length > 0) {
                        OldAffecteditem = `Fire Risk Assessment Anesthesiologist Reviewed By : ${OldSurgeon[0].FullName}`;
                        OldValue += `${OldValue ? ', ' : ''}${OldAffecteditem}`;
                    }
                }

                if (editStatusReviewedcount != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Fire Risk",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.yagIntraOPTempObj.DoctorFireRiskID != null) {
                let editStatusReviewedcount = 0;
                let ActionType = '';
                var Newvalue = '';
                var OldValue = '';

                if ($scope.LogObj.DoctorFireRiskID == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagIntraOPTempObj.DoctorFireRiskID != $scope.LogObj.DoctorFireRiskID) {
                    editStatusReviewedcount++;
                }

                if ($scope.yagIntraOPTempObj.DoctorFireRiskID != $scope.LogObj.DoctorFireRiskID) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';
                    let NewSurgeon = $filter("filter")($scope.yagIntraOPTempObj.DoctorArray, function (item) {
                        return item.DoctorID == $scope.yagIntraOPTempObj.DoctorFireRiskID;
                    });
                    if (NewSurgeon.length > 0) {
                        NewAffecteditem = `Fire Risk Assessment Surgeon Reviewed By : ${NewSurgeon[0].FullName}`;
                        Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                    }
                    let OldSurgeon = $filter("filter")($scope.yagIntraOPTempObj.DoctorArray, function (item) {
                        return item.DoctorID == $scope.LogObj.DoctorFireRiskID;
                    });
                    if (OldSurgeon.length > 0) {
                        OldAffecteditem = `Fire Risk Assessment Surgeon Reviewed By : ${OldSurgeon[0].FullName}`;
                        OldValue += `${OldValue ? ', ' : ''}${OldAffecteditem}`;
                    }
                }
                if (editStatusReviewedcount != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Fire Risk",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            let submitObj = {
                "TypeId": 2,
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                "YagTemplateId": $scope.yagIntraOPTempObj.YagTemplateId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "Logs": $scope.LogObj || {},
                "IntraOpRoomInTimeOD": $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD || '',
                "IntraOpRoomOutTimeOD": $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD || '',
                "IntraOpStartTimeOD": $scope.yagIntraOPTempObj.IntraOpStartTimeOD || '',
                "IntraOpEndTimeOD": $scope.yagIntraOPTempObj.IntraOpEndTimeOD || '',
                "IntraOpBurstsOD": $scope.yagIntraOPTempObj.IntraOpBurstsOD || '',
                "IntraOpMjOD": $scope.yagIntraOPTempObj.IntraOpMjOD || '',

                "IntraOpRoomInTimeOS": $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS || '',
                "IntraOpRoomOutTimeOS": $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS || '',
                "IntraOpStartTimeOS": $scope.yagIntraOPTempObj.IntraOpStartTimeOS || '',
                "IntraOpEndTimeOS": $scope.yagIntraOPTempObj.IntraOpEndTimeOS || '',
                "IntraOpBurstsOS": $scope.yagIntraOPTempObj.IntraOpBurstsOS || '',
                "IntraOpMjOS": $scope.yagIntraOPTempObj.IntraOpMjOS || '',
                "IntraOpNurseReviewedById": $scope.yagIntraOPTempObj.IntraOpNurseReviewedById || null,
                //"IntraOpProcedureName": $scope.yagIntraOPTempObj.IntraOpProcedureName || '',
                "IntraOpSiteName": $scope.yagIntraOPTempObj.IntraOpSiteName || '',
                "IntraOpAnesthesiaTypelist": AnesthesiaTypelist || [],
                "IntraOpReviewedByDate": $scope.yagIntraOPTempObj.IntraOpReviewedByDate || null,
                "IntraOpReviewedByTime": $scope.yagIntraOPTempObj.IntraOpReviewedByTime || '',
                "IntraOpYagLensId": $scope.yagIntraOPTempObj.IntraOpYagLensId || null,
                "IntraOpOrderDetails": FinalIntraOpOrderDetails || [],
                "OrgASCChecklist": OrgASCChecklist || [],
                "YagIntraopNurseChartStatus": $scope.yagIntraOPTempObj.YagIntraopNurseChartStatus,
                "YagIntraopDoctorChartStatus": $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus,

                "AnesthetistFireRiskID": $scope.yagIntraOPTempObj.AnesthetistFireRiskID || null,
                "DoctorFireRiskID": $scope.yagIntraOPTempObj.DoctorFireRiskID || null,
                "NurseFireRiskID": $scope.yagIntraOPTempObj.NurseFireRiskID || null,
                "RiskLevel": $scope.yagIntraOPTempObj.RiskLevel || '',
                "NurseFireRiskReviewdDate": $scope.yagIntraOPTempObj.NurseFireRiskReviewdDate || null,
                "AnesthetistReviewdDate": $scope.yagIntraOPTempObj.AnesthetistReviewdDate || null,
                "DoctorReviewdDate": $scope.yagIntraOPTempObj.DoctorReviewdDate || null,
            };

            var sighnoffforlogs = str || '';
            if (sighnoffforlogs == 'SignOff' && $scope.shared.signOffUserId !=0) {
                let givenByUser = '';
                let oldGivenByUser = '';
                let oldValue = '';
                let newValue = '';

                var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.shared.signOffUserId });
                if (ReviewedByArraylist.length > 0) {
                    givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                        (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                }

                // Get previous sign-off 
                //let previousSignOffDetails = $filter('filter')($scope.LogObj.IntraOpLastSignOffUserDetails || [], { UserId: $scope.UserId }, true);
                if ($scope.LogObj.IntraOpLastSignOffUserDetails && $scope.LogObj.IntraOpLastSignOffUserDetails.length > 0) {
                    let oldNurse = $filter('filter')($scope.allUserList, { DoctorID: $scope.LogObj.IntraOpLastSignOffUserDetails[0].UserId }, true);
                    if (oldNurse.length > 0) {
                        oldGivenByUser = angular.copy(oldNurse[0].SecondUserFullName) +
                            (oldNurse[0].LicenseNumber ? " Lic:" + angular.copy(oldNurse[0].LicenseNumber) : "");
                    }
                }

                // Prepare old and new descriptions
                if (oldGivenByUser) {
                    oldValue = `Intra - op signed off by ${oldGivenByUser}`;
                }
                if (givenByUser) {
                    newValue = `Intra - op signed off by ${givenByUser}`;
                }

                if (newValue) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template IntraOp",
                        "ScreenType": "Signed off",
                        "ActionType": "Signed off",
                        "OldActionDescription": oldValue,
                        "NewActionDescription": newValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if (sighnoffforlogs == 'Unsign') {
                let givenByUser = '';
                if ($scope.shared.signOffUserId) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.shared.signOffUserId });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Unsign",
                        "ActionType": "unsigned",
                        "OldActionDescription":'',
                        "NewActionDescription": `Intra - op Unsigned  by ${givenByUser} In Yag Template`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            let IntraOpChecklist = $filter("filter")(submitObj.OrgASCChecklist, { "CheckListCategoryId": 22 }, true) || [];
            let editIntraOpChecklist = $filter("filter")($scope.IntraOpTempOrgASCChecklistLogs, { "CheckListCategoryId": 22 }, true) || [];

            var UserAlreadyAddedIntraOpList = $filter("filter")(editIntraOpChecklist, { "CreatedBy": $scope.UserId }, true) || [];
            
            if (editIntraOpChecklist.length > 0) {
                $scope.differences = $scope.findDifferences(IntraOpChecklist, editIntraOpChecklist) || [];
                if ($scope.differences.length > 0) {

                    let NewAffecteditem = '';
                    let OldAffecteditem = '';

                    angular.forEach($scope.differences, function (diff) {
                        if (diff.changeType === 'unchecked') {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            if (OldAffecteditem !== '') OldAffecteditem += ', ';
                            NewAffecteditem += `Unchecked ${diff.CheckListName}: ${diff.oldValue}`;
                            OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                        } else {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            NewAffecteditem += `${diff.CheckListName}: ${diff.savedValue}`;

                            if (diff.oldValue !== undefined && diff.oldValue !== '') {
                                if (OldAffecteditem !== '') OldAffecteditem += ', ';
                                OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                            }
                        }
                    });

                    let ActionType = (UserAlreadyAddedIntraOpList.length === 0 && OldAffecteditem === '') ? "Added" : "Edited";

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Checklist",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (IntraOpChecklist.length > 0) {

                let NewAffecteditem = '';
                angular.forEach(IntraOpChecklist, function (item) {
                    if (item.PatientAscCheckListDetailId === 0) {
                        if (NewAffecteditem !== '') {
                            NewAffecteditem += ', ';
                        }
                        NewAffecteditem += `${item.CheckListName}: ${item.Value}`;
                    }
                });
                if (NewAffecteditem != '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Checklist",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD = $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD || '';
            $scope.LogObj.IntraOpRoomInTimeOD = $scope.LogObj.IntraOpRoomInTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD = $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD || '';
            $scope.LogObj.IntraOpRoomOutTimeOD = $scope.LogObj.IntraOpRoomOutTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpStartTimeOD = $scope.yagIntraOPTempObj.IntraOpStartTimeOD || '';
            $scope.LogObj.IntraOpStartTimeOD = $scope.LogObj.IntraOpStartTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpEndTimeOD = $scope.yagIntraOPTempObj.IntraOpEndTimeOD || '';
            $scope.LogObj.IntraOpEndTimeOD = $scope.LogObj.IntraOpEndTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpBurstsOD = $scope.yagIntraOPTempObj.IntraOpBurstsOD || ''
            $scope.LogObj.IntraOpBurstsOD = $scope.LogObj.IntraOpBurstsOD || '';

            $scope.yagIntraOPTempObj.IntraOpMjOD = $scope.yagIntraOPTempObj.IntraOpMjOD || '';
            $scope.LogObj.IntraOpMjOD = $scope.LogObj.IntraOpMjOD || '';


            $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS = $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS || '';
            $scope.LogObj.IntraOpRoomInTimeOS = $scope.LogObj.IntraOpRoomInTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS = $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS || '';
            $scope.LogObj.IntraOpRoomOutTimeOS = $scope.LogObj.IntraOpRoomOutTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpStartTimeOS = $scope.yagIntraOPTempObj.IntraOpStartTimeOS || '';
            $scope.LogObj.IntraOpStartTimeOS = $scope.LogObj.IntraOpStartTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpEndTimeOS = $scope.yagIntraOPTempObj.IntraOpEndTimeOS || '';
            $scope.LogObj.IntraOpEndTimeOS = $scope.LogObj.IntraOpEndTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpBurstsOS = $scope.yagIntraOPTempObj.IntraOpBurstsOS || ''
            $scope.LogObj.IntraOpBurstsOS = $scope.LogObj.IntraOpBurstsOS || '';

            $scope.yagIntraOPTempObj.IntraOpMjOS = $scope.yagIntraOPTempObj.IntraOpMjOS || '';
            $scope.LogObj.IntraOpMjOS = $scope.LogObj.IntraOpMjOS || '';


            if ($scope.yagIntraOPTempObj.IntraOpRoomInTimeOD || $scope.LogObj.IntraOpRoomInTimeOD || $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD || $scope.LogObj.IntraOpRoomOutTimeOD || $scope.yagIntraOPTempObj.IntraOpStartTimeOD || $scope.LogObj.IntraOpStartTimeOD || $scope.yagIntraOPTempObj.IntraOpEndTimeOD || $scope.LogObj.IntraOpEndTimeOD || $scope.yagIntraOPTempObj.IntraOpBurstsOD || $scope.LogObj.IntraOpBurstsOD || $scope.yagIntraOPTempObj.IntraOpMjOD || $scope.LogObj.IntraOpMjOD || $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS || $scope.LogObj.IntraOpRoomInTimeOS || $scope.LogObj.IntraOpRoomOutTimeOS || $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS || $scope.LogObj.IntraOpStartTimeOS || $scope.yagIntraOPTempObj.IntraOpStartTimeOS || $scope.LogObj.IntraOpEndTimeOS || $scope.yagIntraOPTempObj.IntraOpEndTimeOS || $scope.yagIntraOPTempObj.IntraOpBurstsOS || $scope.LogObj.IntraOpBurstsOS || $scope.LogObj.IntraOpMjOS || $scope.yagIntraOPTempObj.IntraOpMjOS) {
                let ActionType = '';
                let count = 0;
                if ($scope.LogObj.IntraOpRoomInTimeOD == '' && $scope.LogObj.IntraOpRoomOutTimeOD == '' && $scope.LogObj.IntraOpStartTimeOD == '' && $scope.LogObj.IntraOpEndTimeOD == '' && $scope.LogObj.IntraOpBurstsOD == '' && $scope.LogObj.IntraOpMjOD == '' && $scope.LogObj.IntraOpRoomInTimeOS == '' && $scope.LogObj.IntraOpRoomOutTimeOS == '' && $scope.LogObj.IntraOpStartTimeOS == '' && $scope.LogObj.IntraOpEndTimeOS == '' && $scope.LogObj.IntraOpBurstsOS == '' && $scope.LogObj.IntraOpMjOS == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                let Newvalue = '';
                let Oldvalue = '';

                if ($scope.yagIntraOPTempObj.IntraOpRoomInTimeOD != $scope.LogObj.IntraOpRoomInTimeOD) {
                    if ($scope.yagIntraOPTempObj.IntraOpRoomInTimeOD)
                        Newvalue += `${Newvalue ? ', ' : ''}OD In Room Time : ${$scope.yagIntraOPTempObj.IntraOpRoomInTimeOD}`;
                    if ($scope.LogObj.IntraOpRoomInTimeOD)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OD In Room Time : ${$scope.LogObj.IntraOpRoomInTimeOD}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD != $scope.LogObj.IntraOpRoomOutTimeOD) {
                    if ($scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD)
                        Newvalue += `${Newvalue ? ', ' : ''}OD Time Out : ${$scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD}`;
                    if ($scope.LogObj.IntraOpRoomOutTimeOD)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OD Time Out : ${$scope.LogObj.IntraOpRoomOutTimeOD}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpStartTimeOD != $scope.LogObj.IntraOpStartTimeOD) {
                    if ($scope.yagIntraOPTempObj.IntraOpStartTimeOD)
                        Newvalue += `${Newvalue ? ', ' : ''}OD Start Time : ${$scope.yagIntraOPTempObj.IntraOpStartTimeOD}`;
                    if ($scope.LogObj.IntraOpStartTimeOD)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OD Start Time: ${$scope.LogObj.IntraOpStartTimeOD}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpEndTimeOD != $scope.LogObj.IntraOpEndTimeOD) {
                    if ($scope.yagIntraOPTempObj.IntraOpEndTimeOD)
                        Newvalue += `${Newvalue ? ', ' : ''}OD End Time : ${$scope.yagIntraOPTempObj.IntraOpEndTimeOD}`;
                    if ($scope.LogObj.IntraOpEndTimeOD)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OD End Time: ${$scope.LogObj.IntraOpEndTimeOD}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpBurstsOD != $scope.LogObj.IntraOpBurstsOD) {
                    if ($scope.yagIntraOPTempObj.IntraOpBurstsOD)
                        Newvalue += `${Newvalue ? ', ' : ''}OD Bursts : ${$scope.yagIntraOPTempObj.IntraOpBurstsOD}`;
                    if ($scope.LogObj.IntraOpBurstsOD)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OD Bursts : ${$scope.LogObj.IntraOpBurstsOD}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpMjOD != $scope.LogObj.IntraOpMjOD) {
                    if ($scope.yagIntraOPTempObj.IntraOpMjOD)
                        Newvalue += `${Newvalue ? ', ' : ''}OD MJ : ${$scope.yagIntraOPTempObj.IntraOpMjOD}`;
                    if ($scope.LogObj.IntraOpMjOD)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OD MJ : ${$scope.LogObj.IntraOpMjOD}`;
                    count++;
                }

                if ($scope.yagIntraOPTempObj.IntraOpRoomInTimeOS != $scope.LogObj.IntraOpRoomInTimeOS) {
                    if ($scope.yagIntraOPTempObj.IntraOpRoomInTimeOS)
                        Newvalue += `${Newvalue ? ', ' : ''}OS In Room Time : ${$scope.yagIntraOPTempObj.IntraOpRoomInTimeOS}`;
                    if ($scope.LogObj.IntraOpRoomInTimeOS)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OS In Room Time : ${$scope.LogObj.IntraOpRoomInTimeOS}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS != $scope.LogObj.IntraOpRoomOutTimeOS) {
                    if ($scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS)
                        Newvalue += `${Newvalue ? ', ' : ''}OS Time Out : ${$scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS}`;
                    if ($scope.LogObj.IntraOpRoomOutTimeOS)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OS Time Out : ${$scope.LogObj.IntraOpRoomOutTimeOS}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpStartTimeOS != $scope.LogObj.IntraOpStartTimeOS) {
                    if ($scope.yagIntraOPTempObj.IntraOpStartTimeOS)
                        Newvalue += `${Newvalue ? ', ' : ''}OS Start Time : ${$scope.yagIntraOPTempObj.IntraOpStartTimeOS}`;
                    if ($scope.LogObj.IntraOpStartTimeOS)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OS Start Time: ${$scope.LogObj.IntraOpStartTimeOS}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpEndTimeOS != $scope.LogObj.IntraOpEndTimeOS) {
                    if ($scope.yagIntraOPTempObj.IntraOpEndTimeOS)
                        Newvalue += `${Newvalue ? ', ' : ''}OS End Time : ${$scope.yagIntraOPTempObj.IntraOpEndTimeOS}`;
                    if ($scope.LogObj.IntraOpEndTimeOS)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OS End Time: ${$scope.LogObj.IntraOpEndTimeOS}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpBurstsOS != $scope.LogObj.IntraOpBurstsOS) {
                    if ($scope.yagIntraOPTempObj.IntraOpBurstsOS)
                        Newvalue += `${Newvalue ? ', ' : ''}OS Bursts : ${$scope.yagIntraOPTempObj.IntraOpBurstsOS}`;
                    if ($scope.LogObj.IntraOpBurstsOS)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OS Bursts : ${$scope.LogObj.IntraOpBurstsOS}`;
                    count++;
                }
                if ($scope.yagIntraOPTempObj.IntraOpMjOS != $scope.LogObj.IntraOpMjOS) {
                    if ($scope.yagIntraOPTempObj.IntraOpMjOS)
                        Newvalue += `${Newvalue ? ', ' : ''}OS MJ : ${$scope.yagIntraOPTempObj.IntraOpMjOS}`;
                    if ($scope.LogObj.IntraOpMjOS)
                        Oldvalue += `${Oldvalue ? ', ' : ''}OS MJ : ${$scope.LogObj.IntraOpMjOS}`;
                    count++;
                }



                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Time Tracking",
                        "ActionType": ActionType,
                        "OldActionDescription": Oldvalue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            $scope.yagIntraOPTempObj.IntraOpNurseReviewedById = $scope.yagIntraOPTempObj.IntraOpNurseReviewedById || null;
            $scope.LogObj.IntraOpNurseReviewedById = $scope.LogObj.IntraOpNurseReviewedById || null;

            if ($scope.yagIntraOPTempObj.IntraOpNurseReviewedById || $scope.LogObj.IntraOpNurseReviewedById) {
                let count = 0;
                let ActionType = $scope.LogObj.IntraOpNurseReviewedById == null ? 'Added' : 'Edited';

                let OldgivenByUser = '';
                let NewgivenByUser = '';

                var OldReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.IntraOpNurseReviewedById });
                if (OldReviewedByArraylist.length > 0) {
                    OldgivenByUser = angular.copy(OldReviewedByArraylist[0].SecondUserFullName) +
                        (OldReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldReviewedByArraylist[0].LicenseNumber) : "");
                }

                var NewReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.yagIntraOPTempObj.IntraOpNurseReviewedById });
                if (NewReviewedByArraylist.length > 0) {
                    NewgivenByUser = angular.copy(NewReviewedByArraylist[0].SecondUserFullName) +
                        (NewReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(NewReviewedByArraylist[0].LicenseNumber) : "");
                }


                if ($scope.yagIntraOPTempObj.IntraOpNurseReviewedById != $scope.LogObj.IntraOpNurseReviewedById) {
                    count++;
                }

                let OldValue = '';
                let NewValue = '';

                if (OldgivenByUser != '') {
                    OldValue = `Intra-Op Reviewed By ${OldgivenByUser} In Yag Template`;
                }
                if (NewgivenByUser != '') {
                    NewValue = `Intra-Op Reviewed By ${NewgivenByUser} In Yag Template`;
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Operating Room Nurse",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ((submitObj.IntraOpAnesthesiaTypelist || []).length > 0 || ($scope.LogObj.AnesthesiaTypeList || []).length > 0) {
                let ActionType = '';
                let count = 0;
                let OldValue = '';
                let NewValue = '';

                let submittedList = submitObj.IntraOpAnesthesiaTypelist || [];
                let previousList = $scope.LogObj.AnesthesiaTypeList || [];

                if (previousList.length === 0) {
                    ActionType = 'Added';
                    submittedList.forEach(item => {
                        if (item.IsSelected && item.DeleteInd == 'N') {
                            if (NewValue !== '') NewValue += ', ';
                            NewValue += item.AnesthesiaType;
                        }
                    });
                    count++;
                } else {
                    ActionType = 'Edited';

                    submittedList.forEach(newItem => {
                        const oldItem = previousList.find(p => p.AnesthesiaTypeId === newItem.AnesthesiaTypeId);

                        // Newly selected item
                        if (!oldItem && newItem.IsSelected) {
                            if (NewValue !== '') NewValue += ', ';
                            NewValue += newItem.AnesthesiaType;
                            count++;
                        }

                        // Deselected item
                        if (oldItem && oldItem.IsSelected && !newItem.IsSelected && newItem.DeleteInd === 'Y') {
                            if (OldValue !== '') OldValue += ', ';
                            OldValue += oldItem.AnesthesiaType;

                            if (NewValue !== '') NewValue += ', ';
                            NewValue += `Unchecked ${oldItem.AnesthesiaType}`;
                            count++;
                        }
                    });
                }

                if (count !== 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Anesthesia",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

           


            $scope.yagIntraOPTempObj.IntraOpSiteName = $scope.yagIntraOPTempObj.IntraOpSiteName || '';
            $scope.LogObj.IntraOpSiteName = $scope.LogObj.IntraOpSiteName || '';

            if ($scope.yagIntraOPTempObj.IntraOpSiteName || $scope.LogObj.IntraOpSiteName) {
                let ActionType = '';
                let count = 0;
                if ($scope.LogObj.IntraOpSiteName == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagIntraOPTempObj.IntraOpSiteName != $scope.LogObj.IntraOpSiteName) {
                    count++;
                }

                let Oldvalue = '';
                let Newvalue = '';

                if ($scope.LogObj.IntraOpSiteName) {
                    Oldvalue = 'Site: ' + $scope.LogObj.IntraOpSiteName;
                }
                if ($scope.yagIntraOPTempObj.IntraOpSiteName) {
                    Newvalue = 'Site: ' + $scope.yagIntraOPTempObj.IntraOpSiteName;
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp Procedure",
                        "ActionType": ActionType,
                        "OldActionDescription": Oldvalue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            $scope.yagIntraOPTempObj.IntraOpYagLensId = $scope.yagIntraOPTempObj.IntraOpYagLensId || null;
            $scope.LogObj.IntraOpYagLensId = $scope.LogObj.IntraOpYagLensId || null;

            if ($scope.yagIntraOPTempObj.IntraOpYagLensId || $scope.LogObj.IntraOpYagLensId) {
                let ActionType = '';
                let count = 0;
                if ($scope.LogObj.IntraOpYagLensId == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagIntraOPTempObj.IntraOpYagLensId != $scope.LogObj.IntraOpYagLensId) {
                    count++;
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "IntraOp YAG Lens Used",
                        "ActionType": ActionType,
                        "OldActionDescription": $scope.LogObj.IntraOpYagLensName,
                        "NewActionDescription": $scope.yagIntraOPTempObj.IntraOpYagLensName,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                submitObj.Logs = angular.copy($scope.LogObj) || {};
            }
            $scope.yagIntraOPTempObj.IsClickSaveyagIntraOPBtn = true;
            eHnoteSurgeryService.AddUpdateIntraOPYagTemplateData(submitObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (!sighnoffforlogs) {
                        alertify.success("Intra-op saved successfully!");
                    }
                    $scope.yagIntraOPTempObj.IsClickSaveyagIntraOPBtn = false;
                    GetIntraOPYagTemplateData();
                } else {
                    $scope.yagIntraOPTempObj.IsClickSaveyagIntraOPBtn = false;
                    alertify.error("Intra-op save is failed!");
                }
            }, function (error) {
                console.log(error);
                $scope.yagIntraOPTempObj.IsClickSaveyagIntraOPBtn = false;
                alertify.error("An error occurred while submitting the YAG Template data.");
            });
        }
        $scope.yagPostOPTempObj.IsClickSaveyagPostOPBtn = false;
        $scope.savePostOPYagTemplateData = function (str) {
            $scope.LogObj.LogArray = [];
            let OrgASCChecklist = [];
            //$scope.yagPostOPTempObj.OrgASCChecklist = $filter("filter")($scope.yagPostOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 23 }, true) || [];

            angular.forEach($scope.yagPostOPTempObj.OrgASCChecklist, function (item) {
                let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });
                let checkedvalue;
                if (checkedvaluearray.length > 0) {
                    checkedvalue = checkedvaluearray[0];
                }
                if (checkedvalue !== undefined) {
                    if (checkedvalue.CheckListId === item.CheckListId) {
                        let obj = {
                            "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId || 0,
                            "CheckListId": item.CheckListId,
                            "CheckListName": item.CheckListName,
                            "CheckListModuleId": item.CheckListModuleId,
                            "CheckListCategoryId": item.CheckListCategoryId,
                            "CheckListSubTypeId": item.CheckListSubTypeId,
                            "ParentOrganizationId": item.ParentOrganizationId,
                            "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                            "DeleteInd": checkedvalue.DeleteInd || 'N',
                            "OrganizationPreOpCheckListValueId": (checkedvalue != undefined) ? checkedvalue.OrganizationPreOpCheckListValueId : null,
                            "Value": (checkedvalue != undefined) ? checkedvalue.Value : "",
                            "ChecklistDate": item.ChecklistDate,
                            "Remarks": item.Remarks || '',
                            "Score": item.Score || null
                        };
                        OrgASCChecklist.push(obj);
                    }

                }

            });
            var PostOpVitalsArray = $scope.yagPostOPTempObj.PostOpVitalsArray.filter(item => {
                item.VitalSummaryId = item.VitalSummaryId || 0;
                const isVitalsAdded = item.Vitals.some(vital => vital.Value);
                return item.VitalRemarks || item.DoctorId || item.VitalAddTime || isVitalsAdded || item.VitalSummaryId != 0;
            });
            let submitObj = {
                "TypeId": 3,
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                "YagTemplateId": $scope.yagPostOPTempObj.YagTemplateId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "Logs": $scope.LogObj || {},
                "PatientDischarge": $scope.yagPostOPTempObj.PatientDischarge || '',
                "PostOpDischaredTime": $scope.yagPostOPTempObj.PostOpDischaredTime || '',
                "PostOpRecoveryNurseById": $scope.yagPostOPTempObj.PostOpRecoveryNurseById || null,
                "PostOpReviewedByDate": $scope.yagPostOPTempObj.PostOpReviewedByDate || null,
                "PostOpReviewedByTime": $scope.yagPostOPTempObj.PostOpReviewedByTime || '',
                "PostOpVitalsArray": PostOpVitalsArray || [],
                "OrgASCChecklist": OrgASCChecklist || [],
                "YagPostopNurseChartStatus": $scope.yagPostOPTempObj.YagPostopNurseChartStatus,
                "YagPostopDoctorChartStatus": $scope.yagPostOPTempObj.YagPostopDoctorChartStatus
            }

            var sighnoffforlogs = str || '';
            if (sighnoffforlogs == 'SignOff' && $scope.shared.signOffUserId !=0) {
                let givenByUser = '';
                let oldGivenByUser = '';
                let oldValue = '';
                let newValue = '';

                var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.shared.signOffUserId });
                if (ReviewedByArraylist.length > 0) {
                    givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                        (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                }

                // Get previous sign-off 
                //let previousSignOffDetails = $filter('filter')($scope.LogObj.PostOpLastSignOffUserDetails || [], { UserId: $scope.UserId }, true);
                if ($scope.LogObj.PostOpLastSignOffUserDetails && $scope.LogObj.PostOpLastSignOffUserDetails.length > 0) {
                    let oldNurse = $filter('filter')($scope.allUserList, { DoctorID: $scope.LogObj.PostOpLastSignOffUserDetails[0].UserId }, true);
                    if (oldNurse.length > 0) {
                        oldGivenByUser = angular.copy(oldNurse[0].SecondUserFullName) +
                            (oldNurse[0].LicenseNumber ? " Lic:" + angular.copy(oldNurse[0].LicenseNumber) : "");
                    }
                }

                // Prepare old and new descriptions
                if (oldGivenByUser) {
                    oldValue = `Post - op signed off by ${oldGivenByUser}`;
                }
                if (givenByUser) {
                    newValue = `Post - op signed off by ${givenByUser}`;
                }

                if (newValue) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template PostOp",
                        "ScreenType": "Signed off",
                        "ActionType": "Signed off",
                        "OldActionDescription": oldValue,
                        "NewActionDescription": newValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if (sighnoffforlogs == 'Unsign') {
                let givenByUser = '';
                if ($scope.shared.signOffUserId) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.shared.signOffUserId });
                    if (ReviewedByArraylist.length > 0) {
                        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
                            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
                    }

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PostOp Unsign",
                        "ActionType": "unsigned",
                        "OldActionDescription": '',
                        "NewActionDescription": `Post - op Unsigned  by ${givenByUser} In Yag Template`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            let PostOpChecklist = $filter("filter")(submitObj.OrgASCChecklist, { "CheckListCategoryId": 23 }, true) || [];
            let editPostOpChecklist = $filter("filter")($scope.PostOpTempOrgASCChecklistLogs, { "CheckListCategoryId": 23 }, true) || [];

            var UserAlreadyAddedPostOpList = $filter("filter")(editPostOpChecklist, { "CreatedBy": $scope.UserId }, true) || [];
            

            if (editPostOpChecklist.length > 0) {
                $scope.differences = $scope.findDifferences(PostOpChecklist, editPostOpChecklist) || [];
                if ($scope.differences.length > 0) {

                    let NewAffecteditem = '';
                    let OldAffecteditem = '';

                    angular.forEach($scope.differences, function (diff) {
                        if (diff.changeType === 'unchecked') {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            if (OldAffecteditem !== '') OldAffecteditem += ', ';
                            NewAffecteditem += `Unchecked ${diff.CheckListName}: ${diff.oldValue}`;
                            OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                        } else {
                            if (NewAffecteditem !== '') NewAffecteditem += ', ';
                            NewAffecteditem += `${diff.CheckListName}: ${diff.savedValue}`;

                            if (diff.oldValue !== undefined && diff.oldValue !== '') {
                                if (OldAffecteditem !== '') OldAffecteditem += ', ';
                                OldAffecteditem += `${diff.CheckListName}: ${diff.oldValue}`;
                            }
                        }
                    });

                    let ActionType = (UserAlreadyAddedPostOpList.length === 0 && OldAffecteditem === '') ? "Added" : "Edited";

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PostOp Checklist",
                        "ActionType": ActionType,
                        "OldActionDescription": OldAffecteditem,
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (PostOpChecklist.length > 0) {

                let NewAffecteditem = '';
                angular.forEach(PostOpChecklist, function (item) {
                    if (item.PatientAscCheckListDetailId === 0) {
                        if (NewAffecteditem !== '') {
                            NewAffecteditem += ', ';
                        }
                        NewAffecteditem += `${item.CheckListName}: ${item.Value}`;
                    }
                });
                if (NewAffecteditem != '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PostOp Checklist",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": NewAffecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            $scope.yagPostOPTempObj.PatientDischarge = $scope.yagPostOPTempObj.PatientDischarge || '';
            $scope.LogObj.PatientDischarge = $scope.LogObj.PatientDischarge || '';

            
            if ($scope.yagPostOPTempObj.PatientDischarge || $scope.LogObj.PatientDischarge) {
                let ActionType = '';
                let count = 0;
                if ($scope.LogObj.PatientDischarge == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagPostOPTempObj.PatientDischarge != $scope.LogObj.PatientDischarge) {
                    count++;
                }

                let Oldvalue = '';
                let Newvalue = '';

                if ($scope.yagPostOPTempObj.PatientDischarge) {
                    Newvalue = 'Patient Discharged to ' + $scope.yagPostOPTempObj.PatientDischarge
                }
                if ($scope.LogObj.PatientDischarge) {
                    Oldvalue = 'Patient Discharged to ' + $scope.LogObj.PatientDischarge
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PostOp Discharge Information",
                        "ActionType": ActionType,
                        "OldActionDescription": Oldvalue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            $scope.yagPostOPTempObj.PostOpDischaredTime = $scope.yagPostOPTempObj.PostOpDischaredTime || '';
            $scope.LogObj.PostOpDischaredTime = $scope.LogObj.PostOpDischaredTime || '';

            if ($scope.yagPostOPTempObj.PostOpDischaredTime || $scope.LogObj.PostOpDischaredTime) {
                let ActionType = '';
                let count = 0;
                if ($scope.LogObj.PostOpDischaredTime == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.yagPostOPTempObj.PostOpDischaredTime != $scope.LogObj.PostOpDischaredTime) {
                    count++;
                }

                let Oldvalue = '';
                let Newvalue = '';

                if ($scope.yagPostOPTempObj.PostOpDischaredTime) {
                    Newvalue = 'Time of Discharged ' + $scope.yagPostOPTempObj.PostOpDischaredTime
                }
                if ($scope.LogObj.PostOpDischaredTime) {
                    Oldvalue = 'Time of Discharged ' + $scope.LogObj.PostOpDischaredTime
                }

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PostOp Discharge Information",
                        "ActionType": ActionType,
                        "OldActionDescription": Oldvalue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            $scope.yagPostOPTempObj.PostOpRecoveryNurseById = $scope.yagPostOPTempObj.PostOpRecoveryNurseById || null;
            $scope.LogObj.PostOpRecoveryNurseById = $scope.LogObj.PostOpRecoveryNurseById || null;

            if ($scope.yagPostOPTempObj.PostOpRecoveryNurseById || $scope.LogObj.PostOpRecoveryNurseById) {

                let count = 0;
                let ActionType = $scope.LogObj.PostOpRecoveryNurseById == null ? 'Added' : 'Edited';

                let OldgivenByUser = '';
                let NewgivenByUser = '';

                var OldReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.PostOpRecoveryNurseById });
                if (OldReviewedByArraylist.length > 0) {
                    OldgivenByUser = angular.copy(OldReviewedByArraylist[0].SecondUserFullName) +
                        (OldReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldReviewedByArraylist[0].LicenseNumber) : "");
                }

                var NewReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.yagPostOPTempObj.PostOpRecoveryNurseById });
                if (NewReviewedByArraylist.length > 0) {
                    NewgivenByUser = angular.copy(NewReviewedByArraylist[0].SecondUserFullName) +
                        (NewReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(NewReviewedByArraylist[0].LicenseNumber) : "");
                }

                if ($scope.yagPostOPTempObj.PostOpRecoveryNurseById != $scope.LogObj.PostOpRecoveryNurseById) {
                    count++;
                }

                let OldValue = '';
                let NewValue = '';

                if (OldgivenByUser != '') {
                    OldValue = `Post-Op Reviewed By ${OldgivenByUser} In Yag Template`;
                }
                if (NewgivenByUser != '') {
                    NewValue = `Post-Op Reviewed By ${NewgivenByUser} In Yag Template`;
                }
               

                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "PostOp Discharge Information",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ((submitObj.PostOpVitalsArray || []).length > 0) {
                let ActionType = '';
                let OldDescription = '';
                let NewDescription = '';

                if (($scope.LogObj.PostOpVitalsArray || []).length === 0) {
                    // First-time add
                    ActionType = 'Added';
                    let indices = submitObj.PostOpVitalsArray.map((_, i) => i);
                    NewDescription = formatVitalsArray(submitObj.PostOpVitalsArray, indices, true);
                } else {
                    // Edit case
                    const changedIndices = getChangedVitalsIndices($scope.LogObj.PostOpVitalsArray, submitObj.PostOpVitalsArray);

                    if (changedIndices.length > 0) {
                        ActionType = 'Edited';
                        OldDescription = formatVitalsArray($scope.LogObj.PostOpVitalsArray, changedIndices, false, submitObj.PostOpVitalsArray);
                        NewDescription = formatVitalsArray(submitObj.PostOpVitalsArray, changedIndices, false, $scope.LogObj.PostOpVitalsArray);
                    }
                }

                if (ActionType !== '') {
                    let obj = {
                        LogId: 0,
                        ModuleId: 2,
                        ModuleName: "ASC",
                        SubModuleId: 37,
                        SubModuleName: "Yag Template",
                        ScreenType: "PostOp Vitals",
                        ActionType: ActionType,
                        OldActionDescription: OldDescription,
                        NewActionDescription: NewDescription,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }



            if ($scope.LogObj.LogArray.length > 0) {
                submitObj.Logs = angular.copy($scope.LogObj) || {};
            }
            $scope.yagPostOPTempObj.IsClickSaveyagPostOPBtn = true;
            eHnoteSurgeryService.AddUpdatePostOPYagTemplateData(submitObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (!sighnoffforlogs) {
                        alertify.success("Post-op saved successfully!");
                    }
                    $scope.yagPostOPTempObj.IsClickSaveyagPostOPBtn = false;
                    GetPostOPYagTemplateData()
                } else {
                    $scope.yagPostOPTempObj.IsClickSaveyagPostOPBtn = false;
                    alertify.error("Post-op save is failed!");
                }
            }); 

        }

       


        function getChangedVitalsIndices(array1, array2) {
            let changedIndices = [];

            const length = Math.max(array1.length, array2.length);
            for (let i = 0; i < length; i++) {
                const a = array1[i] || {};
                const b = array2[i] || {};

                if (
                    a.VitalAddTime !== b.VitalAddTime ||
                    a.DoctorId !== b.DoctorId ||
                    a.VitalRemarks !== b.VitalRemarks ||
                    a.DeleteInd !== b.DeleteInd
                ) {
                    changedIndices.push(i);
                    continue;
                }

                const aVitals = a.Vitals || [];
                const bVitals = b.Vitals || [];

                if (aVitals.length !== bVitals.length) {
                    changedIndices.push(i);
                    continue;
                }

                for (let j = 0; j < aVitals.length; j++) {
                    const va = aVitals[j] || {};
                    const vb = bVitals[j] || {};

                    if (va.Value !== vb.Value || va.UnitTypeId !== vb.UnitTypeId) {
                        changedIndices.push(i);
                        break;
                    }
                }
            }

            return [...new Set(changedIndices)];
        }


        function formatVitalsArray(array, indices, isAddCase, compareArray = []) {
            let result = "";

            indices.forEach(index => {
                const current = array[index];
                if (!current) return;

                const compare = compareArray.find((_, i) => i === index) || {};
                let vitalsString = "";

                const currentVitals = current.Vitals || [];
                const compareVitals = compare.Vitals || [];

                const isDeleted = current.DeleteInd === 'Y';

                // Compare individual vital values
                for (let i = 0; i < currentVitals.length; i++) {
                    const v = currentVitals[i] || {};
                    const c = compareVitals[i] || {};

                    const valueChanged = v.Value !== c.Value || v.UnitTypeId !== c.UnitTypeId;

                    if (isAddCase || valueChanged || isDeleted) {
                        if (v.Value !== undefined && v.Value !== null && v.Value !== "") {
                            vitalsString += `${v.VitalDesc}: ${v.Value}, `;
                        }
                    }
                }

                vitalsString = vitalsString.trim().replace(/,\s*$/, '');

                // Construct line
                let line = `(Vitals)V${index + 1}`;
                if (vitalsString) line += ` ${vitalsString}`;

                // Remarks
                if (isAddCase || current.VitalRemarks !== compare.VitalRemarks || isDeleted) {
                    if (current.VitalRemarks) {
                        line += ` | Remarks: ${current.VitalRemarks}`;
                    }
                }

                // Performed By
                if (isAddCase || current.DoctorId !== compare.DoctorId || isDeleted) {
                    if (current.DoctorId) {
                        line += ` | Performed By: ${current.UserName}`;
                    }
                }

                // Time
                if (isAddCase || current.VitalAddTime !== compare.VitalAddTime || isDeleted) {
                    if (current.VitalAddTime) {
                        line += ` | Time: ${current.VitalAddTime}`;
                    }
                }

                // If DeleteInd is 'Y', prefix "Deleted"
                if (isDeleted) {
                    line = `Deleted ${line}`;
                }

                // Only push if meaningful
                if (line !== `(Vitals)V${index + 1}`) {
                    result += line + '\n';
                }
            });

            return result.trim();
        }

        $scope.ChangeFallRisKChecklist = function (bool, MItem) {
            angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
                item.IsChecked = false;
            });
            bool.IsChecked = true;
            MItem.IsChecked = true;
            MItem.Value = bool.Value || '';
            MItem.Score = bool.SubValue;

            $scope.yagPreOPTempObj.FallRiskAssessmentTotalScore = 0;
            angular.forEach($scope.yagPreOPTempObj.OrgASCChecklist, function (Titem) {
                if ((Titem.IsChecked) && (Titem.CheckListCode == 291 || Titem.CheckListCode == 292 || Titem.CheckListCode == 293 || Titem.CheckListCode == 294 || Titem.CheckListCode == 295 || Titem.CheckListCode == 296)) {
                    Titem.Score = Titem.Score || 0;
                    $scope.yagPreOPTempObj.FallRiskAssessmentTotalScore += Titem.Score || 0;
                }
            });

            if ($scope.yagPreOPTempObj.FallRiskAssessmentTotalScore <= 24) {
                $scope.yagPreOPTempObj.FallRiskLevel = 'No Risk';
            } else if ($scope.yagPreOPTempObj.FallRiskAssessmentTotalScore >= 25 && $scope.yagPreOPTempObj.FallRiskAssessmentTotalScore <= 50) {
                $scope.yagPreOPTempObj.FallRiskLevel = 'low Risk';
            } else if ($scope.yagPreOPTempObj.FallRiskAssessmentTotalScore > 50) {
                $scope.yagPreOPTempObj.FallRiskLevel = 'High Risk';
            }
        };

        $scope.getOrgMedicines = function (text, val) {

            val = val || null;
            var req = {
                "HospitalId": $scope.HospitalId,
                "PageSize": 20,
                "SearchText": text || '',
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "IsFrequent": "N",
                "MedTypeId": val,
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };

            return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.MedicineList !== undefined) {
                        var list1 = [];
                        angular.forEach(resp.data.MedicineList, function (item) {
                            if (item.MedTypeId == val || item.MedTypeId == null) {
                                list1.push(item);
                            }
                        });
                        return list1.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        }

        $scope.findDifferences = function (savedArray, editedArray) {
            var differences = [];

            angular.forEach(savedArray, function (item) {
                // Normalize new values
                item.ChecklistDate = item.ChecklistDate || null;
                item.Remarks = item.Remarks || '';
                item.DeleteInd = item.DeleteInd || 'N';
                item.Value = item.Value || '';

                // Find matching item in old array
                var matchedItem = editedArray.find(function (eitem) {
                    eitem.ChecklistDate = eitem.ChecklistDate || null;
                    eitem.Remarks = eitem.Remarks || '';
                    eitem.DeleteInd = eitem.DeleteInd || 'N';
                    eitem.Value = eitem.Value || '';
                    return (
                        eitem.CheckListCategoryId === item.CheckListCategoryId &&
                        eitem.CheckListId === item.CheckListId
                    );
                });

                if (matchedItem) {
                    if (
                        item.Value !== matchedItem.Value ||
                        item.Remarks !== matchedItem.Remarks ||
                        item.ChecklistDate !== matchedItem.ChecklistDate ||
                        item.DeleteInd !== matchedItem.DeleteInd
                    ) {
                        let changeType = '';

                        if ((matchedItem.Value === 'Yes' || matchedItem.Value) &&
                            (item.Value === '' || item.DeleteInd === 'Y')) {
                            changeType = 'unchecked';
                        } else {
                            changeType = 'changed';
                        }

                        differences.push({
                            CheckListCategoryId: item.CheckListCategoryId,
                            CheckListId: item.CheckListId,
                            CheckListName: item.CheckListName,
                            savedValue: item.Value,
                            oldValue: matchedItem.Value,
                            savedRemarks: item.Remarks,
                            oldRemarks: matchedItem.Remarks,
                            changeType: changeType
                        });
                    }
                } else {
                    // New addition
                    differences.push({
                        CheckListCategoryId: item.CheckListCategoryId,
                        CheckListId: item.CheckListId,
                        CheckListName: item.CheckListName,
                        savedValue: item.Value,
                        oldValue: '',
                        savedRemarks: item.Remarks,
                        oldRemarks: '',
                        changeType: 'added'
                    });
                }
            });

            return differences;
        };

        $scope.GetPresentTime = function (index) {
            $scope.yagPreOPTempObj.PreOpVitalsArray[index].VitalAddTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.GetPostOpPresentTime = function (index) {
            $scope.yagPostOPTempObj.PostOpVitalsArray[index].VitalAddTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.changePerformedBy = function (item) {
            var vitallist = [];
            var vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
            if (vitallist.length > 0) {
                item.UserName = angular.copy(vitallist[0].FullName);
            }
        }

        $scope.TimeStamp = function (index, item) {
            let VitalInfo = $filter('filter')(item.Vitals, function (item) {
                return item.Value != ''
            });
            if (VitalInfo.length > 0) {
                item.VitalAddTime = moment().format("hh:mm A");
                if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57 || doctorinfo.RoleID == 66) {
                    item.DoctorId = doctorinfo.doctorid;
                }
                var vitallist = [];
                var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == doctorinfo.doctorid });
                if (vitallist.length > 0) {
                    item.UserName = angular.copy(vitallist[0].FullName);
                }
            }
            else {
                item.DoctorId = null;
                item.VitalAddTime = '';
            }
        }

        $scope.AddVitals = function () {
            if ($scope.yagPreOPTempObj.PreOpVitalsArray.length > 0) {
                let index = $scope.yagPreOPTempObj.PreOpVitalsArray.length - 1;
                let counter = 0;
                angular.forEach($scope.yagPreOPTempObj.PreOpVitalsArray[index].Vitals, function (hitem) {
                    if (hitem.Value != "") {
                        counter++;
                    }
                });
                if (counter == 0) {
                    alertify.error("Please enter vitals!");
                    return;
                }
            }
            let vitalsobj = angular.copy($scope.VitalsObj());
            $scope.yagPreOPTempObj.PreOpVitalsArray.push(vitalsobj);
        };

        $scope.ClearVitals = function (item) {
            item.VitalAddTime = "";
            item.DoctorId = null;
            item.VitalRemarks = "";
            angular.forEach(item.Vitals, function (vitem) {
                if (vitem.VitalId == 11) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 1;
                    vitem.UnitTypeName = "°F";
                }
                if (vitem.VitalId == 12) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 3;
                    vitem.UnitTypeName = "/min";
                }
                if (vitem.VitalId == 4) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 5;
                    vitem.UnitTypeName = "mmHg";
                }
                if (vitem.VitalId == 5) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 5;
                    vitem.UnitTypeName = "mmHg";
                }
                if (vitem.VitalId == 14) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 3;
                    vitem.UnitTypeName = "/min";
                }
                if (vitem.VitalId == 15) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 6;
                    vitem.UnitTypeName = "%";
                }
                if (vitem.VitalId == 8) {
                    vitem.Value = '';
                    vitem.UnitTypeId = 11;
                    vitem.UnitTypeName = "mg/dL";
                }
                if (vitem.VitalId == 66) {
                    vitem.Value = '';
                    vitem.UnitTypeId = null;
                    vitem.UnitTypeName = "";
                }

            });
        }

        $scope.CopyVitals = function (item, index) {
            if (index > 0) {
                index = index - 1;
                let vitallist = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.UserId }, true);
                let TempArray = $filter('filter')($scope.PerformedByArray, { 'DoctorID': $scope.UserId }, true);
                if (TempArray.length > 0) {
                    if (vitallist.length > 0) {
                        item.UserName = angular.copy(vitallist[0].FullName);
                        item.DoctorId = angular.copy(vitallist[0].DoctorID);
                    }
                }
                item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");
                angular.forEach($scope.yagPreOPTempObj.PreOpVitalsArray[index].Vitals, function (hitem) {
                    angular.forEach(item.Vitals, function (vitem) {
                        if (hitem.VitalId == 11 && vitem.VitalId == 11) {
                            vitem.Value = hitem.Value;
                            vitem.UnitTypeId = hitem.UnitTypeId;
                            vitem.UnitTypeName = hitem.UnitTypeName;
                        }
                        if (hitem.VitalId == 12 && vitem.VitalId == 12) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 4 && vitem.VitalId == 4) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 5 && vitem.VitalId == 5) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 14 && vitem.VitalId == 14) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 15 && vitem.VitalId == 15) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 8 && vitem.VitalId == 8) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 66 && vitem.VitalId == 66) {
                            vitem.Value = hitem.Value;
                        }
                    });
                });
            }
        }

        $scope.RemoveVitals = function (item) {
            if (item.VitalSummaryId == 0) {
                var index = $scope.yagPreOPTempObj.PreOpVitalsArray.indexOf(item);
                if (index > -1) {
                    $scope.yagPreOPTempObj.PreOpVitalsArray.splice(index, 1);
                }
            } else {
                var index = $scope.yagPreOPTempObj.PreOpVitalsArray.indexOf(item);
                $scope.yagPreOPTempObj.PreOpVitalsArray[index].DeleteInd = 'Y';
            }
        }

        $scope.onSelectTemperature = function (item, id) {
            if (id == 2) {
                item.UnitTypeName = "°C";
            } else {
                item.UnitTypeName = "°F";
            }
        };

        $scope.AddPostOpVitals = function () {
            if ($scope.yagPostOPTempObj.PostOpVitalsArray.length > 0) {
                let index = $scope.yagPostOPTempObj.PostOpVitalsArray.length - 1;
                let counter = 0;
                angular.forEach($scope.yagPostOPTempObj.PostOpVitalsArray[index].Vitals, function (hitem) {
                    if (hitem.Value != "") {
                        counter++;
                    }
                });
                if (counter == 0) {
                    alertify.error("Please enter vitals!");
                    return;
                }
            }
            let vitalsobj = angular.copy($scope.VitalsObj());
            $scope.yagPostOPTempObj.PostOpVitalsArray.push(vitalsobj);
        };

        $scope.RemovePostOpVitals = function (item) {
            if (item.VitalSummaryId == 0) {
                var index = $scope.yagPostOPTempObj.PostOpVitalsArray.indexOf(item);
                if (index > -1) {
                    $scope.yagPostOPTempObj.PostOpVitalsArray.splice(index, 1);
                }
            } else {
                var index = $scope.yagPostOPTempObj.PostOpVitalsArray.indexOf(item);
                $scope.yagPostOPTempObj.PostOpVitalsArray[index].DeleteInd = 'Y';
            }
        }

        $scope.CopyPostOpVitals = function (item, index) {
            if (index > 0) {
                index = index - 1;
                let vitallist = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.UserId }, true);
                let TempArray = $filter('filter')($scope.PerformedByArray, { 'DoctorID': $scope.UserId }, true);
                if (TempArray.length > 0) {
                    if (vitallist.length > 0) {
                        item.UserName = angular.copy(vitallist[0].FullName);
                        item.DoctorId = angular.copy(vitallist[0].DoctorID);
                    }
                }
                item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");
                angular.forEach($scope.yagPostOPTempObj.PostOpVitalsArray[index].Vitals, function (hitem) {
                    angular.forEach(item.Vitals, function (vitem) {
                        if (hitem.VitalId == 11 && vitem.VitalId == 11) {
                            vitem.Value = hitem.Value;
                            vitem.UnitTypeId = hitem.UnitTypeId;
                            vitem.UnitTypeName = hitem.UnitTypeName;
                        }
                        if (hitem.VitalId == 12 && vitem.VitalId == 12) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 4 && vitem.VitalId == 4) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 5 && vitem.VitalId == 5) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 14 && vitem.VitalId == 14) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId == 15 && vitem.VitalId == 15) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 8 && vitem.VitalId == 8) {
                            vitem.Value = hitem.Value;
                        }
                        if (hitem.VitalId === 66 && vitem.VitalId == 66) {
                            vitem.Value = hitem.Value;
                        }

                    });
                });
            }
        }


        //$scope.SelectDialtionMedicationItems = function (item, type) {

        //    let templist = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "MedTypeId": 11, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);

        //    let i = 0;
        //    angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {
        //        angular.forEach(mitem.DilationMedications, function (Aitem) {
        //            if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
        //                i++;
        //            }
        //        });
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.DilationMedicationObj.MedicineObject = "";
        //        return false;
        //    }
        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.DilationMedicationObj.MedicineObject = '';
        //            return false;
        //        }

        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].DilationMedications.push(obj);
        //            $scope.DilationMedicationObj.MedicineObject = "";

        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].DilationMedications.push(obj);
        //            $scope.DilationMedicationObj.MedicineObject = "";
        //        }

        //    } else {

        //        let templist2 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 11;
        //            templist2[0].MedTypeName = 'Yag PreOp Medications';
        //        } else {
        //            let templist3 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
        //            if (templist3.length > 0) {

        //            } else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByPassword": '',
        //                    "ReviewedByDateTime": null,
        //                    "ReviewedBy": null,
        //                    "UserType": "Nurse",
        //                    "ScreenType": "YagTemplate",
        //                    "ScreenTypeId": 10,
        //                    "MedTypeId": 11,
        //                    "MedTypeName": 'Yag PreOp Medications',
        //                    "DilationMedications": [],
        //                    "GeneralOrders": [],
        //                }
        //                $scope.yagPreOPTempObj.PreOpOrderDetails.push(obj);
        //            }
        //        }
        //        let templist1 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.DilationMedicationObj.MedicineObject = '';
        //                return false;
        //            }

        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].DilationMedications.push(obj);
        //                $scope.DilationMedicationObj.MedicineObject = "";
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].DilationMedications.push(obj);
        //                $scope.DilationMedicationObj.MedicineObject = "";
        //            }

        //        } else {

        //            $scope.yagPreOPTempObj.PreOpOrderDetails = $scope.yagPreOPTempObj.PreOpOrderDetails || [];
        //            $scope.DilationMedications = $scope.DilationMedications || [];
        //            let List1 = $filter("filter")($scope.DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.DilationMedicationObj.MedicineObject = '';
        //                return false;
        //            }

        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                $scope.DilationMedications.push(obj);
        //                $scope.DilationMedicationObj.MedicineObject = "";

        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId":4,
        //                    "DeleteInd": "N"
        //                }
        //                $scope.DilationMedications.push(obj);
        //                $scope.DilationMedicationObj.MedicineObject = "";

        //            }
        //        }
        //    }


        //}

        $scope.GetValidateUserPassword = function (item, type) {

            item.ReviewedBy = item.ReviewedBy || null;
            if (item.ReviewedBy == null) {
                alertify.error("Please Select ReviewedBy");
                return false;
            }
            item.ReviewedByPassword = item.ReviewedByPassword || '';
            if (item.ReviewedByPassword == '') {
                alertify.error("Please Enter Password");
                return false;
            }
            let reqObj = {
                "Password": item.ReviewedByPassword,
                "UserId": $scope.UserId,
                "ReviewedBy": item.ReviewedBy,
                "OrganizationId": $scope.HospitalId
            };
            eHnoteSurgeryService.GetUserValidatePassword(reqObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Successfully Validated!");
                    //$scope.MedicationOrdersReviwedByLogs(item);
                    item.IsOrderReviewed = true;
                    //item.ReviewedByDateTime = $filter("date")(new Date(), "MM-dd-yyyy hh:mm a");
let Admissiondatetime= $scope.cacheStorageItem.Admissiondatetime||null;
let ReviewedByDateTime= $filter("date")(new Date(), "MM-dd-yyyy hh:mm a") || null;
if(Admissiondatetime){
ReviewedByDateTime=$filter('date')(Admissiondatetime, "MM-dd-yyyy hh:mm a")||null;
}
                item.ReviewedByDateTime = ReviewedByDateTime;
                    if (type == 'DilationMedications') {
                        angular.forEach($scope.SurgeonArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    else if (type =='AnesthesiaMedications') {
                        angular.forEach($scope.AnesthesiologistArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                } else {
                    alertify.error("Invalid Password!");
                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });
        };

        $scope.AddPreOpDropsTime = function (obj, type) {
            //let templength = obj.DropTimings.length;

            let activeTimings = obj.DropTimings.filter(x => x.DeleteInd !== "Y");
            let templength = activeTimings.length;

            if (templength > 0) {
                let value = obj.DropTimings[templength - 1].MedicationTime;
                let GivenBy = obj.DropTimings[templength - 1].GivenBy;
                if (value == "") {
                    alertify.error("Please enter time!");
                    return;
                }
                GivenBy = GivenBy || null;
                if (GivenBy == null) {
                    alertify.error("Please Select GivenBy for Medications!");
                    return;
                }
            }
            let selectedGivenBy = null;
            if (type == 'DilationMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    selectedGivenBy = loggedUser[0].DoctorID;
                }
            }else if (type == 'AnesthesiaMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    selectedGivenBy = loggedUser[0].DoctorID;
                }
            }

            let object = {
                "DropTimingId": 0,
                "MedicineId": obj.MedicineId,
                "MedicationName": obj.MedicationName,
                "GivenBy": selectedGivenBy || null,
                "shownotes": false,
                "IsEditDrop": false,
                "IsEditview": false,
                "Remarks": "",
                "MedicationTime": "",
                "DeleteInd": "N",
                "MedicationDosage": ""
            };
            obj.DropTimings.push(object);
        };

        $scope.GetPresentMedicationTime = function (Obj, parentObj, type) {
            Obj.MedicationTime = $filter('date')(new Date(), "hh:mm a");
            if (type == 'DilationMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    Obj.GivenBy = loggedUser[0].DoctorID;
                }
            }else if (type == 'AnesthesiaMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    Obj.GivenBy = loggedUser[0].DoctorID;
                }
            }

        };

        $scope.AddGeneralOrder = function (Type) {
            if (Type == 'Anesthesia') {
                if ($scope.AnesthesiaMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }

                let templist = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "MedTypeId": 12, 'IsOrderReviewed': false }, true);
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.AnesthesiaMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.AnesthesiaMedicationObj.OrderName = "";
                } else {
                    let templist2 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 12;
                        templist2[0].MedTypeName = 'Yag IntraOp Medications';
                    } else {

                        let templist3 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12 }, true) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "ReviewedBy": null,
                                "UserType": "Anesthesia",
                                "ScreenType": "YagTemplate",
                                "ScreenTypeId": 10,
                                "MedTypeId": 12,
                                "MedTypeName": 'Yag IntraOp Medications',
                                "IntraOpMedications": [],
                                "GeneralOrders": [],
                            }
                            $scope.yagIntraOPTempObj.IntraOpOrderDetails.push(obj);
                        }

                    }


                    let templist1 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12 }, true) || [];

                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.AnesthesiaMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.AnesthesiaMedicationObj.OrderName = "";
                    } else {

                    }
                }
            } else {
                if ($scope.DilationMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }
                let templist = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "MedTypeId": 11, 'IsOrderReviewed': false }, true);
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.DilationMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.DilationMedicationObj.OrderName = "";
                } else {
                    let templist2 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 11;
                        templist2[0].MedTypeName = 'Yag PreOp Medications';
                    } else {

                        let templist3 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11 }, true) || [];
                        if (templist3.length > 0) {

                        } else {
                            let obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "IsOrderReviewed": false,
                                "ReviewedByPassword": '',
                                "ReviewedByDateTime": null,
                                "UserType": "Nurse",
                                "ScreenType": "YagTemplate",
                                "ScreenTypeId": 10,
                                "MedTypeId": 11,
                                "MedTypeName": 'Yag PreOp Medications',
                                "DilationMedications": [],
                                "GeneralOrders": [],
                            }
                            $scope.yagPreOPTempObj.PreOpOrderDetails.push(obj);
                        }

                    }


                    let templist1 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11 }, true) || [];

                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.DilationMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.DilationMedicationObj.OrderName = "";
                    } else {

                    }
                }
            }

        }

        $scope.ChangeGeneralMedicationStatus = function (item, Id) {
            if (Id == 1) {
                item.Status = 'Done';
                item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                item.Status = 'NotDone';
                item.MedicationTime = '';
            }
        };

        $scope.DeleteGeneralOrder = function (Mitem, item,type) {
            var index = Mitem.GeneralOrders.indexOf(item);
            item.GeneralOrderId = item.GeneralOrderId || 0;
            if (item.GeneralOrderId === 0) {
                if (index > -1) {
                    Mitem.GeneralOrders.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }
            $scope.PreopOrderinit(type);
        }

        $scope.PreopOrderinit = function (Type) {

            if (Type == 'DilationMedication') {
                let FinalNurseOrderDetails = $filter('filter')($scope.yagPreOPTempObj.PreOpOrderDetails, { 'MedTypeId': 11 }, true) || [];
                if (FinalNurseOrderDetails.length > 0) {
                    angular.forEach(FinalNurseOrderDetails, function (Mitem) {
                        let temp = $filter('filter')(Mitem.DilationMedications, { 'DeleteInd': 'N' }, true) || [];
                        let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                        if (temp.length == 0 && temp1.length == 0) {
                            Mitem.DeleteInd = 'Y';
                        }
                    });
                }
            } else {
                let FinalOrderDetails = $filter('filter')($scope.yagIntraOPTempObj.IntraOpOrderDetails, { 'MedTypeId': 12 }, true) || [];
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        let temp = $filter('filter')(Mitem.IntraOpMedications, { 'DeleteInd': 'N' }, true) || [];
                        let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                        if (temp.length == 0 && temp1.length == 0) {
                            Mitem.DeleteInd = 'Y';
                        }
                    });
                }
            }


        }

        $scope.GetCustomOrdersTime = function (item) {
            item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.DeleteDrop = function (item, Aitem, Type) {
            Aitem.DropTimingId = Aitem.DropTimingId || 0;
            if (Type == 'AnesthesiaMedications') {
                var index = item.DropTimings.indexOf(Aitem);
            }
            else {
                var index = item.DropTimings.indexOf(Aitem);
            }
            if (Aitem.DropTimingId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        Aitem.DeleteInd = 'Y';
                    }
                    $scope.$digest();
                }, function () {

                });
            }
            else {
                if (index > -1) {
                    item.DropTimings.splice(index, 1);
                }
            }
        }

        $scope.DeleteMainMediacation = function (item, Aitem, Type) {
            if (Type == 'DilationMedication') {
                var index = Aitem.DilationMedications.indexOf(item);
            }else if (Type == 'AnesthesiaMedications') {
                var index = Aitem.IntraOpMedications.indexOf(item);
            }

            if (item.AscMedicationId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        item.DeleteInd = 'Y';
                    }
                    $scope.$digest();
                    $scope.PreopOrderinit(Type);
                }, function () {

                });
            }
            else {
                if (index > -1) {
                    if (Type == 'DilationMedication') {
                        Aitem.DilationMedications.splice(index, 1);
                    }else if (Type == 'AnesthesiaMedications') {
                        Aitem.IntraOpMedications.splice(index, 1);
                    }

                }
            }

            $scope.PreopOrderinit(Type);
        }

        $scope.customOrder = function (item) {
            var desiredOrder = [
                36565,
                36863,
            ];
            var index = desiredOrder.indexOf(item.MedicineId);
            return index !== -1 ? index : 9999;
        };

        $scope.AddFrequentlyMed = function (item, MedTypeId) {
            if (item.IsFrequent == "N") {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            let MedTypeName = '';
            if (MedTypeId == 11) {
                MedTypeName = 'Yag PreOp Medications'
            } else {
                MedTypeName = 'Yag IntraOp Medications'
            }

            if (item.IsFrequent == "Y") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to Remove this From the frequently added list", function () {
                    var obj = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "OrganizationId": $scope.HospitalId,
                        "UserId": $scope.UserId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "MedicineId": item.MedicineId,
                        "MedicineName": item.MedicationName,
                        "UserType": "Nurse",
                        "ScreenTypeId": 10,
                        "ScreenTypeName": 'YagTemplate',
                        "MedTypeId": MedTypeId || null,
                        "MedTypeName": MedTypeName || '',
                        "DeleteInd": 'N',
                        "IsFrequent": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }
                    eHnoteSurgeryService.AddUpdateFrequentMedications(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            // console.log(resp);
                            $scope.GetOrganizationPreOpMedications();
                            item.IsFrequent = Frequentval
                        }
                    }, function (err) {
                        console.log(err);
                    });

                }, function () {
                    r = "You pressed Cancel!";

                });
            }
            if (item.IsFrequent == "N") {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to add this to the frequently added list", function () {

                    var obj = {
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "OrganizationId": $scope.HospitalId,
                        "UserId": $scope.UserId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "MedicineId": item.MedicineId,
                        "MedicineName": item.MedicationName,
                        "UserType": "Nurse",
                        "ScreenTypeId": 10,
                        "ScreenTypeName": 'YagTemplate',
                        "MedTypeId": MedTypeId || null,
                        "MedTypeName": MedTypeName || '',
                        "DeleteInd": 'N',
                        "IsFrequent": "Y",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }
                    eHnoteSurgeryService.AddUpdateFrequentMedications(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            // console.log(resp);
                            $scope.GetOrganizationPreOpMedications();
                            item.IsFrequent = Frequentval
                        }
                    }, function (err) {
                        console.log(err);
                    });

                }, function () {
                    r = "You pressed Cancel!";

                });
            }

        }

        $scope.GetOrganizationPreOpMedications = function () {
            //let reqObj = {
            //    "OrganizationId": $scope.HospitalId
            //};
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId).then(function (resp) {
                if (resp.data.status === "Success") {
                    angular.forEach(resp.data.rows, function (item) {
                        item.AscMedicationId = 0;
                        item.IsChecked = false;
                        item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                    });
                    let tempanesthesiaMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 12 }, true);
                    $scope.MasterAnesthesiaMedications = angular.copy(tempanesthesiaMedications);

                    let tempDilationMedications = $filter('filter')(resp.data.rows, { "MedTypeId": 11 }, true);
                    $scope.MasterDilationMedications = angular.copy(tempDilationMedications);

                }
            }, function (err) {
                alertify.error("Fetching data failed!");
            });
        };

        $scope.IsOpenOrderPopup = function () {
            $scope.PreOpTemplateobj.IsOpenOrderTemplate = !$scope.PreOpTemplateobj.IsOpenOrderTemplate;
        }

        $scope.IsOpenIntraopOrderPopup = function () {
            $scope.IntraOpTemplateobj.IsOpenIntraopOrderTemplate = !$scope.IntraOpTemplateobj.IsOpenIntraopOrderTemplate;
        }
        $scope.ClickIntraopOrderTemplate = {
            templateUrl: 'AddIntraopOrderTemplate.html',
        };

        $scope.ClickOrderTemplate = {
            templateUrl: 'AddOrderTemplate.html',
        };

        $scope.AddUpdateOrderTemplate = function (medtype) {
            var TemplateName = '';
            if (medtype == 11) {
                var MedTypeName = 'Yag PreOp Medications'
                TemplateName = $scope.PreOpTemplateobj.TemplateName;
            }
            else {
                var MedTypeName = 'Yag IntraOp Medications'
                TemplateName = $scope.IntraOpTemplateobj.TemplateName;
            }

            if ($scope.PreOpTemplateobj.TemplateName == '' && medtype==11) {
                alertify.error("Please enter template name!");
                return false;
            }

            if ($scope.IntraOpTemplateobj.TemplateName == '' && medtype == 12) {
                alertify.error("Please enter template name!");
                return false;
            }

            let templateReq = {
                "UserId": $scope.UserId || "",
                "HospitalId": $scope.HospitalId || "",
                "RoleId": $scope.RoleId || null,
                "TemplateId": 0,
                "TemplateName": TemplateName || "",
                "DeleteInd": "N",
                "ScreenType": "YagTemplate",
                "ScreenTypeId": 10,
                "MedTypeId": medtype,
                "MedTypeName": MedTypeName,
                "DilationMedications": [],
                "GeneralOrders": [],
                "IntraOpMedications": [],
            };

            let FinalOrderDetails = [];
            if (medtype == 12) {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.yagIntraOPTempObj.IntraOpOrderDetails), { 'MedTypeId': 12 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.IntraOpMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];
                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.IntraOpMedications.length > 0) {
                            angular.forEach(Mitem.IntraOpMedications, function (item) {
                                item.IsIntraMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.IntraOpMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                        }
                    });
                }
            }
            else {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.yagPreOPTempObj.PreOpOrderDetails), { 'MedTypeId': 11 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.DilationMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];

                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.DilationMedications.length > 0) {
                            angular.forEach(Mitem.DilationMedications, function (item) {
                                item.IsPreOPMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.DilationMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });

                        }
                    });
                }
            }

            eHnoteSurgeryService.AddUpdateAscUserOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetOrderTemplates();
                    if (medtype == 12) {
                        $scope.IntraOpTemplateobj.IsOpenOrderTemplate = false;
                        $scope.IntraOpTemplateobj.IsOpenIntraopOrderTemplate = false;
                        $scope.IntraOpTemplateobj.TemplateName = '';
                    }
                    else {
                        $scope.PreOpTemplateobj.IsOpenOrderTemplate = false;
                        $scope.PreOpTemplateobj.TemplateName = '';
                    }
                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        };

        $scope.GetOrderTemplates = function () {

            let req = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ScreenTypeId": 10,
                "PageSize": 100,
                "SearchText": '',
                "PageNumber": 1,

            };
            eHnoteSurgeryService.GetAscUserOrderTemplates(req).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.UserOrderList = resp.data.rows || [];
                }

            }, function (err) {
                console.log(err);
            });
        };
        function processVitalsArray(vitalsArray) {
            let ndate = moment().format("YYYY-MM-DD");
            const vitalOrder = [11, 12, 4, 5, 14, 15, 8, 66];
            return vitalsArray.map(item => {
                const systolicList = item.Vitals.filter(v => v.VitalId === 4);
                const diastolicList = item.Vitals.filter(v => v.VitalId === 5);
                const otherVitals = item.Vitals.filter(v => v.VitalId !== 4 && v.VitalId !== 5);
                const pairCount = Math.min(systolicList.length, diastolicList.length);
                const bpVitals = [];
                for (let i = 0; i < pairCount; i++) {
                    bpVitals.push({
                        VitalDesc: "BP",
                        VitalId: 4,
                        UnitTypeName: systolicList[i].UnitTypeName || diastolicList[i].UnitTypeName || "mmHg",
                        Value: systolicList[i].Value + "/" + diastolicList[i].Value
                    });
                }
                const edate = ndate + " " + item.VitalAddTime;
                item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");
                let normalizedVitals = [...bpVitals, ...otherVitals].map(subitem => ({
                    VitalDesc: subitem.VitalDesc,
                    VitalId: subitem.VitalId,
                    UnitTypeName: subitem.UnitTypeName,
                    Value: subitem.Value
                }));
                normalizedVitals.sort((a, b) => {
                    let aIndex = vitalOrder.indexOf(a.VitalId);
                    let bIndex = vitalOrder.indexOf(b.VitalId);
                    return aIndex - bIndex;
                });

                item.Vitals = normalizedVitals;
                return item;
            });
        }

        /*Individual YagTemplate get request functions */

        function GetPreOPYagTemplateChartData() {
            let req = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
            };
            eHnoteSurgeryService.GetPreOPYagTemplateChartData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {                       
                        let data = angular.copy(resp.data.rows[0]) || {};
                        $scope.yagPreOPTempObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        $scope.yagPreOPLastSignOffUserDeatils = resp.data.LastSignOffUserDetails || [];
                        $scope.LogObj.PreOpLastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        preOPYagtempalteResponceData(data)
                    }
                }
            }, function (err) {
                console.log(err);
            })
        }
        function preOPYagtempalteResponceData(data) {
            $scope.TempOrgASCChecklistDetails = [];
            $scope.yagPreOPTempObj.YagTemplateId = data.YagTemplateId || null;
            $scope.yagPreOPTempObj.YagPreopChartStatus = data.YagPreopChartStatus || 'D';

            if ($scope.yagPreOPTempObj.OrgASCChecklist.length) {
                angular.forEach($scope.yagPreOPTempObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                        kitem.DeleteInd = 'N';
                    });
                });
            }

            if (data.OrgASCChecklist.length > 0) {
                angular.forEach(data.OrgASCChecklist, function (item) {
                    angular.forEach($scope.yagPreOPTempObj.OrgASCChecklist, function (kitem) {
                        if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                            if (kitem.CheckListId === item.CheckListId) {
                                kitem.IsChecked = true;
                                kitem.Score = item.Score || 0;
                                kitem.Value = item.Value || '';
                                kitem.Remarks = item.Remarks || '';
                                if (kitem.Remarks != "") {
                                    kitem.shownotes = true;
                                }
                                kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                if (kitem.OrganizationCheckListDetails.length > 0) {
                                    angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                        Gitem.IsChecked = false;
                                        if (item.Value == Gitem.Value) {
                                            Gitem.IsChecked = true;
                                            Gitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                        }
                                    });
                                }

                            }
                        }
                    });
                });
                
            }

            $scope.PreOpTempOrgASCChecklistLogs = angular.copy(data.OrgASCChecklist) || [];
            if ($scope.PreOpTempOrgASCChecklistLogs.length > 0) {
                angular.forEach($scope.PreOpTempOrgASCChecklistLogs, function (kitem) {
                    kitem.Remarks = kitem.Remarks || "";
                    kitem.Score = kitem.Score || 0;
                    kitem.Value = kitem.Value || '';
                    kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                });
            }
           
            $scope.yagPreOPTempObj.AssistiveWalkingDevice = data.AssistiveWalkingDevice || '';
            $scope.LogObj.AssistiveWalkingDevice = data.AssistiveWalkingDevice || '';

            $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention = data.ImplemetedHighRiskfallprevention || '';
            $scope.LogObj.ImplemetedHighRiskfallprevention = data.ImplemetedHighRiskfallprevention || '';

            $scope.yagPreOPTempObj.FallRiskAssessmentTotalScore = data.FallRiskAssessmentTotalScore || null;
            $scope.LogObj.FallRiskAssessmentTotalScore = data.FallRiskAssessmentTotalScore || null;

            $scope.yagPreOPTempObj.FallRiskLevel = data.FallRiskLevel || '';
            $scope.LogObj.FallRiskLevel = data.FallRiskLevel || '';

            $scope.yagPreOPTempObj.FallriskBraceletprovided = data.FallriskBraceletprovided || '';
            $scope.LogObj.FallriskBraceletprovided = data.FallriskBraceletprovided || '';



            $scope.yagPreOPTempObj.SiteName = data.SiteName || '';
            $scope.LogObj.SiteName = data.SiteName || '';

            $scope.yagPreOPTempObj.PreOPNurseReviewedById = data.PreOPNurseReviewedById || null;
            $scope.LogObj.PreOPNurseReviewedById = data.PreOPNurseReviewedById || null;
            $scope.yagPreOPTempObj.PreOPNurseReviewedByName = data.PreOPNurseReviewedByName || '';

            $scope.yagPreOPTempObj.PreOpOverallNotes = data.PreOpOverallNotes || '';
            $scope.LogObj.PreOpOverallNotes = data.PreOpOverallNotes || '';

            $scope.yagPreOPTempObj.PreOpReviewedByDate = $filter('date')(data.PreOpReviewedByDate, "MM-dd-yyyy") || null;
            $scope.yagPreOPTempObj.PreOpReviewedByTime = data.PreOpReviewedByTime || "";

            let PreOpVitalsArray = angular.copy(data.PreOpVitalsArray) || [];
            if (PreOpVitalsArray.length > 0) {
                angular.forEach(PreOpVitalsArray, function (item) {
                    let ndate = moment().format("YYYY-MM-DD");
                    let edate = ndate + " " + item.VitalAddTime;
                    item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");
                });
                $scope.yagPreOPTempObj.PreOpVitalsArray = angular.copy(PreOpVitalsArray);

                $scope.LogObj.PreOpVitalsArray = angular.copy(PreOpVitalsArray);
            } else {
                $scope.LogObj.PreOpVitalsArray = [];
                $scope.yagPreOPTempObj.PreOpVitalsArray = [];
                let preOpVitals = $scope.VitalsObj();
                $scope.yagPreOPTempObj.PreOpVitalsArray.push(preOpVitals);
            }

            data.PreOpOrderDetails = data.PreOpOrderDetails || [];
            if (data.PreOpOrderDetails.length > 0) {
                $scope.LogObj.DilationMedications = [];
                $scope.LogObj.GeneralOrders = [];
                $scope.LogObj.PreOpOrderDetails = [];
                var PreopMedicationGenCount = 0;
                var PreopMedicationCount = 0;

                $scope.yagPreOPTempObj.PreOpOrderDetails = data.PreOpOrderDetails || [];
                let templogdilations = angular.copy(data.PreOpOrderDetails) || [];

                if (templogdilations.length > 0) {
                    let FinalDilation = $filter('filter')(templogdilations, { 'MedTypeId': 11 }, true) || [];
                    if (FinalDilation.length > 0) {
                        angular.forEach(FinalDilation, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                            if (Mitem.DilationMedications.length > 0) {
                                if (Mitem.DilationMedications.length > 0) {
                                    angular.forEach(Mitem.DilationMedications, function (item) {
                                        angular.forEach(item.DropTimings, function (kitem) {
                                            kitem.IsEditDrop = false;
                                            kitem.IsEditview = true;
                                            kitem.shownotes = false;
                                            if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                kitem.IsEditDrop = true;
                                            }
                                        });
                                        $scope.LogObj.DilationMedications.push(item);
                                    });
                                }

                            }
                            if (Mitem.GeneralOrders.length > 0) {
                                angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                    $scope.LogObj.GeneralOrders.push(gitem);
                                });
                            }

                        });
                    }
                    $scope.LogObj.PreOpOrderDetails=angular.copy(FinalDilation);

                }

                angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (Mitem) {
                    Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                    Mitem.UserOrderId = Mitem.UserOrderId || null;
                    Mitem.UserType = Mitem.UserType || null;
                    Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                    Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                    if (Mitem.ReviewedBy != null) {
                        let ReviewedByName = '';
                        var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == Mitem.ReviewedBy }, true) || [];

                        if (Arraylist.length > 0) {
                            ReviewedByName = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                            Mitem.ReviewedByName = ReviewedByName;
                        }
                    }
                    if (Mitem.DilationMedications.length > 0) {
                        PreopMedicationCount++;
                        angular.forEach(Mitem.DilationMedications, function (item) {
                            angular.forEach(item.DropTimings, function (kitem) {
                                kitem.IsEditDrop = false;
                                kitem.IsEditview = true;
                                kitem.shownotes = false;
                                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                    kitem.IsEditDrop = true;
                                }
                            });

                        });

                    }
                    if (Mitem.GeneralOrders.length > 0) {
                        PreopMedicationGenCount++;
                    };
                });

                if (PreopMedicationCount !== 0) {
                    $scope.MedicationShow.IsPreopMedications = true;
                } else {
                    $scope.MedicationShow.IsPreopMedications = false;
                };

                if (PreopMedicationGenCount !== 0) {
                    $scope.MedicationShow.IsPreopGenOrders = true;
                } else {
                    $scope.MedicationShow.IsPreopGenOrders = false;
                };
            } else {
                $scope.LogObj.DilationMedications = [];
                $scope.LogObj.GeneralOrders = [];
                $scope.LogObj.PreOpOrderDetails = [];
                $scope.yagPreOPTempObj.PreOpOrderDetails = [];
                $scope.MedicationShow.IsPreopGenOrders = false;
                $scope.MedicationShow.IsPreopMedications = false;

            }

            $scope.yagPreOPTemplateSummaryData = data || {};
            console.log($scope.yagPreOPTemplateSummaryData)
            handlePreOPYagTemplateSummary(data);
        }

        function GetIntraOPYagTemplateData() {
            let req = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
            };
            eHnoteSurgeryService.GetIntraOPYagTemplateChartData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        let data = resp.data.rows[0] || {};
                        $scope.yagIntraOPTempObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        $scope.LogObj.IntraOpLastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        $scope.yagIntraOPLastSignOffUserDeatils = resp.data.LastSignOffUserDetails || [];
                        intraOPYagTemplateResponseData(data)
                    }
                }
            }, function (err) {
                console.log(err);
            })
        }
        function intraOPYagTemplateResponseData(data) {
            $scope.yagIntraOPTempObj.YagTemplateId = data.YagTemplateId || null;
            $scope.LogObj.OrgASCChecklist = data.OrgASCChecklist || [];
            if ($scope.yagIntraOPTempObj.OrgASCChecklist.length) {
                angular.forEach($scope.yagIntraOPTempObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                        kitem.DeleteInd = 'N';
                    });
                });
            }

            if (data.OrgASCChecklist.length > 0) {
                angular.forEach(data.OrgASCChecklist, function (item) {
                    angular.forEach($scope.yagIntraOPTempObj.OrgASCChecklist, function (kitem) {
                        if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                            if (kitem.CheckListId === item.CheckListId) {
                                kitem.IsChecked = true;
                                kitem.Score = item.Score || 0;
                                kitem.Value = item.Value || '';
                                kitem.Remarks = item.Remarks || '';
                                if (kitem.Remarks != "") {
                                    kitem.shownotes = true;
                                }
                                kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                if (kitem.OrganizationCheckListDetails.length > 0) {
                                    angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                        Gitem.IsChecked = false;
                                        if (item.Value == Gitem.Value) {
                                            Gitem.IsChecked = true;
                                            Gitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                        }
                                    });
                                }

                                if (item.SubCheckList.length > 0) {
                                    angular.forEach(item.SubCheckList, function (Aitem) {
                                        angular.forEach(kitem.SubCheckList, function (Bitem) {
                                            if (Aitem.SubCheckListId == Bitem.SubCheckListId) {
                                                Bitem.PatientAscCheckListDetailId = Aitem.PatientAscCheckListDetailId || 0;
                                                Bitem.PatientAscSubCheckListId = Aitem.PatientAscSubCheckListId || 0;
                                                Bitem.IsChecked = true;
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    });
                });
            }

            $scope.IntraOpTempOrgASCChecklistLogs = angular.copy(data.OrgASCChecklist) || [];
            if ($scope.IntraOpTempOrgASCChecklistLogs.length > 0) {
                angular.forEach($scope.IntraOpTempOrgASCChecklistLogs, function (kitem) {
                    kitem.Remarks = kitem.Remarks || "";
                    kitem.Score = kitem.Score || 0;
                    kitem.Value = kitem.Value || '';
                    kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                });
            }
            
            $scope.yagIntraOPTempObj.IntraOpBurstsOD = data.IntraOpBurstsOD || '';
            $scope.LogObj.IntraOpBurstsOD = data.IntraOpBurstsOD || '';

            $scope.yagIntraOPTempObj.IntraOpEndTimeOD = data.IntraOpEndTimeOD || '';
            $scope.LogObj.IntraOpEndTimeOD = data.IntraOpEndTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpMjOD = data.IntraOpMjOD || '';
            $scope.LogObj.IntraOpMjOD = data.IntraOpMjOD || '';

            $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD = data.IntraOpRoomInTimeOD || '';
            $scope.LogObj.IntraOpRoomInTimeOD = data.IntraOpRoomInTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD = data.IntraOpRoomOutTimeOD || '';
            $scope.LogObj.IntraOpRoomOutTimeOD = data.IntraOpRoomOutTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpStartTimeOD = data.IntraOpStartTimeOD || '';
            $scope.LogObj.IntraOpStartTimeOD = data.IntraOpStartTimeOD || '';

            $scope.yagIntraOPTempObj.IntraOpBurstsOS = data.IntraOpBurstsOS || '';
            $scope.LogObj.IntraOpBurstsOS = data.IntraOpBurstsOS || '';

            $scope.yagIntraOPTempObj.IntraOpEndTimeOS = data.IntraOpEndTimeOS || '';
            $scope.LogObj.IntraOpEndTimeOS = data.IntraOpEndTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpMjOS = data.IntraOpMjOS || '';
            $scope.LogObj.IntraOpMjOS = data.IntraOpMjOS || '';

            $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS = data.IntraOpRoomInTimeOS || '';
            $scope.LogObj.IntraOpRoomInTimeOS = data.IntraOpRoomInTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS = data.IntraOpRoomOutTimeOS || '';
            $scope.LogObj.IntraOpRoomOutTimeOS = data.IntraOpRoomOutTimeOS || '';

            $scope.yagIntraOPTempObj.IntraOpStartTimeOS = data.IntraOpStartTimeOS || '';
            $scope.LogObj.IntraOpStartTimeOS = data.IntraOpStartTimeOS || '';


            $scope.yagIntraOPTempObj.IntraOpNurseReviewedById = data.IntraOpNurseReviewedById || null;
            $scope.LogObj.IntraOpNurseReviewedById = data.IntraOpNurseReviewedById || null;
            $scope.yagIntraOPTempObj.IntraOpNurseReviewedByName = data.IntraOpNurseReviewedByName || '';



            $scope.yagIntraOPTempObj.IntraOpSiteName = data.IntraOpSiteName || '';
            $scope.LogObj.IntraOpSiteName = data.IntraOpSiteName || '';
            $scope.yagIntraOPTempObj.IntraOpYagLensId = data.IntraOpYagLensId || null;
            $scope.yagIntraOPTempObj.IntraOpYagLensName = data.IntraOpYagLensName || '';
            $scope.LogObj.IntraOpYagLensId = data.IntraOpYagLensId || null;
            $scope.LogObj.IntraOpYagLensName = data.IntraOpYagLensName || '';



            $scope.yagIntraOPTempObj.IntraOpReviewedByDate = $filter('date')(data.IntraOpReviewedByDate, "MM-dd-yyyy") || null;
            $scope.yagIntraOPTempObj.IntraOpReviewedByTime = data.IntraOpReviewedByTime || "";

            $scope.yagIntraOPTempObj.YagIntraopNurseChartStatus = (data.YagIntraopNurseChartStatus || "").trim() || "D";
            $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus = (data.YagIntraopDoctorChartStatus || "").trim() || "D";



            data.AnesthesiaTypelist = data.AnesthesiaTypelist || [];
            $scope.LogObj.AnesthesiaTypeList = data.AnesthesiaTypelist || [];
            if (data.AnesthesiaTypelist.length > 0) {
                let AnesthesiaList = angular.copy($scope.yagIntraOPTempObj.AnesthesiaTypeList) || [];

                angular.forEach(AnesthesiaList, function (zitem) {
                    zitem.IsSelected = false;
                });
                var Anesthelistdata = '';
                var Anesthelistdata = $filter("filter")(data.AnesthesiaTypelist, function (item) { return item.IsSelected == true; });
                angular.forEach(AnesthesiaList, function (item) {
                    angular.forEach(Anesthelistdata, function (Aitem) {
                        if (Aitem.AnesthesiaTypeId == item.AnesthesiaTypeId) {
                            item.IsSelected = Aitem.IsSelected;
                            item.PatientAnesthesiaPlanId = Aitem.PatientAnesthesiaPlanId;
                        }
                    });
                    $scope.yagIntraOPTempObj.AnesthesiaTypeList = angular.copy(AnesthesiaList);
                });
            } else if ($scope.yagIntraOPTempObj.AnesthesiaTypeList.length>0){
                angular.forEach($scope.yagIntraOPTempObj.AnesthesiaTypeList, function (Aitem) {
                    Aitem.PatientAnesthesiaPlanId = 0;
                    Aitem.IsSelected = false;
                    Aitem.DeleteInd = 'N';
                });
            }

            $scope.yagIntraOPTempObj.RiskLevel = data.RiskLevel || "";

            $scope.yagIntraOPTempObj.AnesthetistFireRiskID = data.AnesthetistFireRiskID || null;
            $scope.LogObj.AnesthetistFireRiskID = data.AnesthetistFireRiskID || null;

            $scope.yagIntraOPTempObj.AnesthetistFireRiskName = data.AnesthetistFireRiskName || "";
            $scope.LogObj.AnesthetistFireRiskName = data.AnesthetistFireRiskName || "";

            $scope.yagIntraOPTempObj.AnesthetistFireRiskLicenseNo = data.AnesthetistFireRiskLicenseNo || null;
            $scope.LogObj.AnesthetistFireRiskLicenseNo = data.AnesthetistFireRiskLicenseNo || null;

            $scope.yagIntraOPTempObj.AnesthetistReviewdDate = data.AnesthetistReviewdDate || null;
            $scope.LogObj.AnesthetistReviewdDate = data.AnesthetistReviewdDate || null;

            $scope.yagIntraOPTempObj.DoctorFireRiskID = data.DoctorFireRiskID || null;
            $scope.LogObj.DoctorFireRiskID = data.DoctorFireRiskID || null;

            $scope.yagIntraOPTempObj.DoctorFireRiskName = data.DoctorFireRiskName || "";
            $scope.LogObj.DoctorFireRiskName = data.DoctorFireRiskName || "";

            $scope.yagIntraOPTempObj.DoctorFireRiskLicenseNo = data.DoctorFireRiskLicenseNo || null;
            $scope.LogObj.DoctorFireRiskLicenseNo = data.DoctorFireRiskLicenseNo || null;

            $scope.yagIntraOPTempObj.DoctorReviewdDate = data.DoctorReviewdDate || null;
            $scope.LogObj.DoctorReviewdDate = data.DoctorReviewdDate || null;

            $scope.yagIntraOPTempObj.NurseFireRiskID = data.NurseFireRiskID || null;
            $scope.LogObj.NurseFireRiskID = data.NurseFireRiskID || null;

            $scope.yagIntraOPTempObj.NurseFireRiskName = data.NurseFireRiskName || "";
            $scope.LogObj.NurseFireRiskName = data.NurseFireRiskName || "";

            $scope.yagIntraOPTempObj.NurseFireRiskLicenseNo = data.NurseFireRiskLicenseNo || null;
            $scope.LogObj.NurseFireRiskLicenseNo = data.NurseFireRiskLicenseNo || null;

            $scope.yagIntraOPTempObj.NurseFireRiskReviewdDate = data.NurseFireRiskReviewdDate || null;
            $scope.LogObj.NurseFireRiskReviewdDate = data.NurseFireRiskReviewdDate || null;

            if ($scope.yagIntraOPTempObj.OrgASCChecklist.length > 0) {
                angular.forEach($scope.yagIntraOPTempObj.OrgASCChecklist, function (Item) {
                    if (Item.CheckListId == 571 && Item.IsChecked) {
                        $scope.yagIntraOPTempObj.IsShowAnesthetistReviewByinFireRisk = true;
                    }
                    if (Item.CheckListId == 572 && Item.IsChecked) {
                        $scope.yagIntraOPTempObj.IsShowDoctorReviewByinFireRisk = true;
                    }
                });
            }

            data.IntraOpOrderDetails = data.IntraOpOrderDetails || [];
            if (data.IntraOpOrderDetails.length > 0) {
                $scope.LogObj.IntraOpMedications = [];
                $scope.LogObj.IntraOpGeneralOrders = [];
                $scope.LogObj.IntraOpOrderDetails = [];

                var IntraOpMedicationGenCount = 0;
                var IntraOpMedicationCount = 0;

                $scope.yagIntraOPTempObj.IntraOpOrderDetails = data.IntraOpOrderDetails || [];
                let templogmedications = angular.copy(data.IntraOpOrderDetails) || [];

                if (templogmedications.length > 0) {
                    let FinalDilation = $filter('filter')(templogmedications, { 'MedTypeId': 12 }, true) || [];
                    if (FinalDilation.length > 0) {
                        angular.forEach(FinalDilation, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                            if (Mitem.IntraOpMedications.length > 0) {
                                if (Mitem.IntraOpMedications.length > 0) {
                                    angular.forEach(Mitem.IntraOpMedications, function (item) {
                                        angular.forEach(item.DropTimings, function (kitem) {
                                            kitem.IsEditDrop = false;
                                            kitem.IsEditview = true;
                                            kitem.shownotes = false;
                                            if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                                kitem.IsEditDrop = true;
                                            }
                                        });
                                        $scope.LogObj.IntraOpMedications.push(item);
                                    });
                                }

                            }
                            if (Mitem.GeneralOrders.length > 0) {
                                angular.forEach(Mitem.GeneralOrders, function (gitem) {
                                    $scope.LogObj.IntraOpGeneralOrders.push(gitem);

                                });
                            }

                        });
                    }

                    $scope.LogObj.IntraOpOrderDetails = angular.copy(FinalDilation);
                }

                angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (Mitem) {
                    Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                    Mitem.UserOrderId = Mitem.UserOrderId || null;
                    Mitem.UserType = Mitem.UserType || null;
                    Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                    Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                    if (Mitem.ReviewedBy != null) {
                        let ReviewedByName = '';
                        var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == Mitem.ReviewedBy }, true) || [];

                        if (Arraylist.length > 0) {
                            ReviewedByName = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                            Mitem.ReviewedByName = ReviewedByName;
                        }
                    }
                    if (Mitem.IntraOpMedications.length > 0) {
                        IntraOpMedicationCount++;
                        angular.forEach(Mitem.IntraOpMedications, function (item) {
                            angular.forEach(item.DropTimings, function (kitem) {
                                kitem.IsEditDrop = false;
                                kitem.IsEditview = true;
                                kitem.shownotes = false;
                                if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                                    kitem.IsEditDrop = true;
                                }
                            });

                        });

                    }
                    if (Mitem.GeneralOrders.length > 0) {
                        IntraOpMedicationGenCount++;
                    }
                });

                if (IntraOpMedicationCount !== 0) {
                    $scope.MedicationShow.IsIntraOpMedications = true;
                } else {
                    $scope.MedicationShow.IsIntraOpMedications = false;
                };

                if (IntraOpMedicationGenCount !== 0) {
                    $scope.MedicationShow.IsIntraOpGenOrders = true;
                } else {
                    $scope.MedicationShow.IsIntraOpGenOrders = false;
                };

            } else {
                $scope.LogObj.IntraOpMedications = [];
                $scope.LogObj.IntraOpGeneralOrders = [];
                $scope.LogObj.IntraOpOrderDetails = [];
                $scope.yagIntraOPTempObj.IntraOpOrderDetails = [];
                $scope.MedicationShow.IsIntraOpMedications = false;
                $scope.MedicationShow.IsIntraOpGenOrders = false;
            }
            $scope.yagIntraOPTemplateSummaryData = data || {};
            handleIntraOPYagTemplateSummary(data);
        }

        function GetPostOPYagTemplateData() {
            let req = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
            };
            eHnoteSurgeryService.GetPostOPYagTemplateChartData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        let data = resp.data.rows[0] || {};
                        $scope.yagPostOPTempObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        $scope.yagPostOPLastSignOffUserDeatils = resp.data.LastSignOffUserDetails || [];
                        $scope.LogObj.PostOpLastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                        postOPYagTemplateResponseData(data)
                    }
                }
            }, function (err) {
                console.log(err);
            })
        }
        function postOPYagTemplateResponseData(data) {

            $scope.yagPostOPTempObj.YagTemplateId = data.YagTemplateId || null;
            $scope.yagPostOPTempObj.YagPostopNurseChartStatus = (data.YagPostopNurseChartStatus || "").trim() || 'D';
            $scope.yagPostOPTempObj.YagPostopDoctorChartStatus = (data.YagPostopDoctorChartStatus || "").trim() || 'D';

            if ($scope.yagPostOPTempObj.OrgASCChecklist.length) {
                angular.forEach($scope.yagPostOPTempObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                        kitem.DeleteInd = 'N';
                    });
                });
            }

            if (data.OrgASCChecklist.length > 0) {
                angular.forEach(data.OrgASCChecklist, function (item) {
                    angular.forEach($scope.yagPostOPTempObj.OrgASCChecklist, function (kitem) {
                        if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                            if (kitem.CheckListId === item.CheckListId) {
                                kitem.IsChecked = true;
                                kitem.Score = item.Score || 0;
                                kitem.Value = item.Value || '';
                                kitem.Remarks = item.Remarks || '';
                                if (kitem.Remarks != "") {
                                    kitem.shownotes = true;
                                }
                                kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                if (kitem.OrganizationCheckListDetails.length > 0) {
                                    angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                        Gitem.IsChecked = false;
                                        if (item.Value == Gitem.Value) {
                                            Gitem.IsChecked = true;
                                            Gitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                        }
                                    });
                                }

                            }
                        }
                    });
                });
            }

            $scope.PostOpTempOrgASCChecklistLogs = angular.copy(data.OrgASCChecklist) || [];
            if ($scope.PostOpTempOrgASCChecklistLogs.length > 0) {
                angular.forEach($scope.PostOpTempOrgASCChecklistLogs, function (kitem) {
                    kitem.Remarks = kitem.Remarks || "";
                    kitem.Score = kitem.Score || 0;
                    kitem.Value = kitem.Value || '';
                    kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                });
            }

            $scope.yagPostOPTempObj.PatientDischarge = data.PatientDischarge || '';
            $scope.LogObj.PatientDischarge = data.PatientDischarge || '';

            $scope.yagPostOPTempObj.PostOpDischaredTime = data.PostOpDischaredTime || '';
            $scope.LogObj.PostOpDischaredTime = data.PostOpDischaredTime || '';

            $scope.yagPostOPTempObj.PostOpRecoveryNurseById = data.PostOpRecoveryNurseById || null;
            $scope.LogObj.PostOpRecoveryNurseById = data.PostOpRecoveryNurseById || null;
            $scope.yagPostOPTempObj.PostOpRecoveryNurseByName = data.PostOpRecoveryNurseByName || '';


            $scope.yagPostOPTempObj.PostOpReviewedByDate = $filter('date')(data.PostOpReviewedByDate, "MM-dd-yyyy") || null;
            $scope.yagPostOPTempObj.PostOpReviewedByTime = data.PostOpReviewedByTime || "";

            let PostOpVitalsArray =angular.copy(data.PostOpVitalsArray) || [];
            if (PostOpVitalsArray.length > 0) {
                angular.forEach(PostOpVitalsArray, function (item) {
                    let ndate = moment().format("YYYY-MM-DD");
                    let edate = ndate + " " + item.VitalAddTime;
                    item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");
                });
                $scope.yagPostOPTempObj.PostOpVitalsArray = angular.copy(PostOpVitalsArray);

                $scope.LogObj.PostOpVitalsArray = angular.copy(PostOpVitalsArray);
            } else {
                $scope.LogObj.PostOpVitalsArray = [];
                $scope.yagPostOPTempObj.PostOpVitalsArray = [];
                let postOpVitals = $scope.VitalsObj();
                $scope.yagPostOPTempObj.PostOpVitalsArray.push(postOpVitals);
            }
            $scope.yagPostOPTemplateSummaryData = data || {};
            handlePostOPYagTemplateSummary(data)
        }

        /*Handling yag template summary Data*/

        function handlePreOPYagTemplateSummary(data) {
            $scope.yagPreOPTempObj.YagTemplateId = data.YagTemplateId || null
            $scope.yagPreOpOrgASCChecklist = data.OrgASCChecklist || [];
            $scope.yagPreOpVitalsArray = processVitalsArray(data.PreOpVitalsArray || []);
            $scope.yagPreOpDilationMedications = data.PreOpOrderDetails || [];
            const hasChecklist21 = $scope.yagPreOpOrgASCChecklist.some(item => item.CheckListCategoryId === 21);
            const hasChecklist24 = $scope.yagPreOpOrgASCChecklist.some(item => item.CheckListCategoryId === 24);
            $scope.yagPreOPTempObj.IsPreOpDataAdded = !!(
                $scope.yagPreOPTemplateSummaryData.SiteName ||
                $scope.yagPreOpVitalsArray.length > 0 ||
                hasChecklist21 ||
                hasChecklist24 ||
                $scope.yagPreOpDilationMedications.length > 0 ||
                $scope.yagPreOPTemplateSummaryData.PreOpOverallNotes ||
                $scope.yagPreOPTemplateSummaryData.PreOPNurseReviewedByName ||
                $scope.yagPreOPTemplateSummaryData.YagTemplateId
            );
        }
        function handleIntraOPYagTemplateSummary(data) {
            $scope.yagIntraOpOrgASCChecklist = data.OrgASCChecklist || [];
            $scope.yagAnesthesiaTypelist = data.AnesthesiaTypelist || [];
            $scope.yagIntraOpOrderDetails = data.IntraOpOrderDetails || []
            const hasChecklist22 = $scope.yagIntraOpOrgASCChecklist.some(item => item.CheckListCategoryId === 22);
            $scope.yagIntraOPTempObj.IsIntraOpDataAdded = !!(
                $scope.yagAnesthesiaTypelist.length > 0 ||
                $scope.yagIntraOpOrderDetails.length > 0 ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpYagLensName ||
                hasChecklist22 ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpSiteName ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpRoomInTimeOD ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpRoomOutTimeOD ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpStartTimeOD ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpEndTimeOD ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpBurstsOD ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpMjOD ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpMjOS ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpBurstsOS ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpEndTimeOS ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpStartTimeOS ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpRoomOutTimeOS ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpRoomInTimeOS ||
                $scope.yagIntraOPTemplateSummaryData.IntraOpNurseReviewedByName ||
                $scope.yagIntraOPTemplateSummaryData.YagTemplateId
            );

        }
        function handlePostOPYagTemplateSummary(data) {
            $scope.yagPostOpOrgASCChecklist = data.OrgASCChecklist || [];
            $scope.yagPostOpVitalsArray = processVitalsArray(data.PostOpVitalsArray || []);
            const hasChecklist23 = $scope.yagPostOpOrgASCChecklist.some(item => item.CheckListCategoryId === 23);
            $scope.yagPostOPTempObj.IsPostOpDataAdded = !!(
                $scope.yagPostOpVitalsArray.length > 0 ||
                hasChecklist23 ||
                $scope.yagPostOPTemplateSummaryData.PatientDischarge ||
                $scope.yagPostOPTemplateSummaryData.PostOpDischaredTime ||
                $scope.yagPostOPTemplateSummaryData.PostOpRecoveryNurseByName ||
                $scope.yagPostOPTemplateSummaryData.YagTemplateId
            );
        }


        $scope.OnSelectOrderTemplate = function (mainitem, medtype) {
            console.log(mainitem);
            if (medtype == 12) {

                let templist = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "MedTypeId": 12, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);

                if (templist.length > 0) {
                    if (mainitem.IntraOpMedications.length > 0) {
                        angular.forEach(mainitem.IntraOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {
                                angular.forEach(mitem.IntraOpMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });
                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                if (List.length == 0) {

                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                    

                                    }
                                    templist[0].IntraOpMedications.push(obj);
                                    $scope.AnesthesiaMedicationObj.MedicineObject = "";

                                }
                            }
                        });
                    }
                    if (mainitem.GeneralOrders.length > 0) {
                        angular.forEach(mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }

                }
                else {

                    let templist2 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 12;
                        templist2[0].MedTypeName = 'Yag IntraOp Medications';
                    } else {
                        let templist3 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "IsOrderReviewed": false,
                                "ReviewedByDateTime": null,
                                "ReviewedByPassword": '',
                                "UserType": "Anesthesia",
                                "ScreenType": "YagTemplate",
                                "ScreenTypeId": 10,
                                "MedTypeId": 12,
                                "MedTypeName": 'Yag IntraOp Medications',
                                "IntraOpMedications": [],
                                "GeneralOrders": [],
                            }
                            $scope.yagIntraOPTempObj.IntraOpOrderDetails.push(obj);
                        }

                    }
                    let templist1 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
                    if (templist1.length > 0) {

                        if (mainitem.IntraOpMedications.length > 0) {
                            angular.forEach(mainitem.IntraOpMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {
                                    if (mitem.MedTypeId == 12) {
                                        angular.forEach(mitem.IntraOpMedications, function (citem) {
                                            if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                                i++
                                            }
                                        });
                                    }
                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];

                                    if (List.length == 0) {

                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParenthospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            "TypeId": 4,
                                            "DeleteInd": "N",
                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                        }
                                        templist1[0].IntraOpMedications.push(obj);
                                        $scope.AnesthesiaMedicationObj.MedicineObject = "";


                                    }
                                }
                            });
                        }
                        if (mainitem.GeneralOrders.length > 0) {
                            angular.forEach(mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {

                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });

                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);
                                }
                            });
                        }
                    }


                }
            }
            else {
                let templist = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "MedTypeId": 11, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);

                if (templist.length > 0) {
                    if (mainitem.DilationMedications.length > 0) {
                        angular.forEach(mainitem.DilationMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {

                                angular.forEach(mitem.DilationMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });

                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                if (List.length == 0) {

                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParenthospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                    }
                                    templist[0].DilationMedications.push(obj);
                                    $scope.DilationMedicationObj.MedicineObject = "";
                                }
                            }
                        });
                    }
                    if (mainitem.GeneralOrders.length > 0) {
                        angular.forEach(mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }



                }
                else {

                    let templist2 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 11;
                        templist2[0].MedTypeName = 'Yag PreOp Medications';
                    } else {
                        let templist3 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "YagTemplate",
                                "ScreenTypeId": 10,
                                "MedTypeId": 11,
                                "MedTypeName": 'Yag PreOp Medications',
                                "DilationMedications": [],
                                "GeneralOrders": [],
                            }
                            $scope.yagPreOPTempObj.PreOpOrderDetails.push(obj);
                        }

                    }
                    let templist1 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
                    if (templist1.length > 0) {

                        if (mainitem.DilationMedications.length > 0) {
                            angular.forEach(mainitem.DilationMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {

                                    angular.forEach(mitem.DilationMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });

                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];


                                    if (List.length == 0) {

                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParenthospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            "TypeId": 4,
                                            "DeleteInd": "N",
                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                        }
                                        templist1[0].DilationMedications.push(obj);
                                        $scope.DilationMedicationObj.MedicineObject = "";
                                    }
                                }
                            });
                        }
                        if (mainitem.GeneralOrders.length > 0) {
                            angular.forEach(mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {

                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });

                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);

                                }
                            });
                        }
                    }


                }
            }

        }

        //$scope.SelectAnesthesiaMedicationItems = function (item, type) {
        //    let templist = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "MedTypeId": 12, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
        //    let i = 0;
        //    angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {
        //        if (mitem.MedTypeId == 12) {
        //            angular.forEach(mitem.IntraOpMedications, function (Aitem) {
        //                if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
        //                    i++;
        //                }
        //            });
        //        }
        //    });

        //    if (i > 0) {
        //        alertify.error('You have already entered this Medication');
        //        $scope.IntraOpMedicationObj.MedicineObject = "";
        //        return false;
        //    }


        //    if (templist.length > 0) {

        //        let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //        let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //        if (List.length > 0) {
        //            alertify.error("Medicine name already added!");
        //            $scope.AnesthesiaMedicationObj.MedicineObject = '';
        //            return false;
        //        }

        //        if (type == 'Frequently') {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicationName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 4,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].IntraOpMedications.push(obj);
        //            $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //        } else {
        //            var obj = {
        //                "AscMedicationId": 0,
        //                "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                "ParentOrganizationId": $scope.ParenthospitalId,
        //                "ASCOrganizationMedicationId": 0,
        //                "Strength": item.Strength || '',
        //                "IsFrequent": item.IsFrequent || 'N',
        //                "MedicineId": item.MedicineId,
        //                "MedicationName": item.MedicineName,
        //                "IsChecked": false,
        //                "IsDilationMed": false,
        //                "IsIntraAnesthesiaMed": false,
        //                "IsIntraMed": false,
        //                "IsPreOPMed": false,
        //                "MedicationDosage": "",
        //                "DropTimings": [],
        //                "TypeId": 5,
        //                "DeleteInd": "N"
        //            }
        //            templist[0].IntraOpMedications.push(obj);
        //            $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //        }
        //    } else {

        //        let templist2 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
        //        if (templist2.length > 0) {
        //            templist2[0].MedTypeId = 12;
        //            templist2[0].MedTypeName = 'Yag IntraOp Medications';
        //        } else {

        //            let templist3 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
        //            if (templist3.length > 0) {

        //            } else {
        //                var obj = {
        //                    "UserOrderId": 0,
        //                    "UserId": $scope.UserId,
        //                    "DeleteInd": "N",
        //                    "IsOrderReviewed": false,
        //                    "ReviewedByPassword": '',
        //                    "ReviewedBy": null,
        //                    "UserType": "Nurse",
        //                    "ScreenType": "YagTemplate",
        //                    "ScreenTypeId": 10,
        //                    "MedTypeId": 12,
        //                    "MedTypeName": 'Yag IntraOp Medications',
        //                    "IntraOpMedications": [],
        //                    "GeneralOrders": [],
        //                }
        //                $scope.yagIntraOPTempObj.IntraOpOrderDetails.push(obj);
        //            }

        //        }
        //        let templist1 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
        //        if (templist1.length > 0) {
        //            let List1 = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
        //            let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
        //            if (List.length > 0) {
        //                alertify.error("Medicine name already added!");
        //                $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //                return false;
        //            }


        //            if (type == 'Frequently') {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicationName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].IntraOpMedications.push(obj);
        //                $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //            } else {
        //                var obj = {
        //                    "AscMedicationId": 0,
        //                    "OrganizationMedicationId": item.OrganizationPrescriptionId,
        //                    "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
        //                    "ParentOrganizationId": $scope.ParenthospitalId,
        //                    "ASCOrganizationMedicationId": 0,
        //                    "Strength": item.Strength || '',
        //                    "IsFrequent": item.IsFrequent || 'N',
        //                    "MedicineId": item.MedicineId,
        //                    "MedicationName": item.MedicineName,
        //                    "IsChecked": false,
        //                    "IsDilationMed": false,
        //                    "IsIntraAnesthesiaMed": false,
        //                    "IsIntraMed": false,
        //                    "IsPreOPMed": false,
        //                    "MedicationDosage": "",
        //                    "DropTimings": [],
        //                    "TypeId": 4,
        //                    "DeleteInd": "N"
        //                }
        //                templist1[0].IntraOpMedications.push(obj);
        //                $scope.AnesthesiaMedicationObj.MedicineObject = "";
        //            }
        //        }
        //    }
        //}


        function buildDescription(item, includeTimings = true) {
            let timingDescriptions = includeTimings ? buildTimingDescriptions(item.DropTimings) : [];
            return [
                item.OrderDescription || '',
                item.MedicationNotes ? `Notes: ${item.MedicationNotes}` : '',
                timingDescriptions.length > 0 ? timingDescriptions.join(', ') : ''
            ].filter(Boolean).join('\n');
        }

        function buildTimingDescriptions(dropTimings) {
            if (!dropTimings || dropTimings.length === 0) return [];
            return dropTimings.map(dt => {
                let medicationTime = dt.MedicationTime || '';
                let givenById = dt.GivenBy || '';
                let medicationDosage = dt.MedicationDosage || '';
                let Remarks = dt.Remarks || '';

                let givenByUser = '';
                if (givenById) {
                    let user = $scope.allUserList.find(u => u.DoctorID == givenById);
                    if (user) givenByUser = user.FullName;
                }
                let Notes = '';
                if (Remarks) {
                    Notes = 'Notes: ' + Remarks;
                }

                return `${medicationDosage} at ${medicationTime} by @ ${givenByUser} ${Notes}`;
            });
        }


        $scope.CompareDilationMedications = function (savedArray) {
            angular.forEach(savedArray, function (item) {
                // Case 1: Deleted
                if (item.DeleteInd === 'Y') {
                    let description = buildDescription(item, true);
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Pre-Op Medications",
                        "ActionType": "Deleted",
                        "OldActionDescription": '',
                        "NewActionDescription": description,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }

                // Case 2: Added / Edited
                else {
                    let edited = $scope.LogObj.DilationMedications.filter(eitem =>
                        eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                    );

                    // Newly Added
                    if (edited.length === 0) {
                        let description = buildDescription(item, true);
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Pre-Op Medications",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        }
                        $scope.LogObj.LogArray.push(obj);
                    }

                    // Edited
                    else {
                        edited.forEach(function (editedItem) {
                            if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                                let actiontype = 'Edited';

                                if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                    actiontype = 'Added';
                                }
                                // Check if DropTimings changed
                                let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                    !item.DropTimings.some(ditem =>
                                        ditem.GivenBy == editem.GivenBy &&
                                        ditem.Remarks == editem.Remarks &&
                                        ditem.MedicationDosage == editem.MedicationDosage &&
                                        ditem.MedicationTime == editem.MedicationTime
                                    )
                                );

                                let isFieldEdited =
                                    (editedItem.Action !== item.Action) ||
                                    (editedItem.Dose !== item.Dose) ||
                                    (editedItem.DoseUnit !== item.DoseUnit) ||
                                    (editedItem.Route !== item.Route) ||
                                    (editedItem.Frequency !== item.Frequency) ||
                                    (editedItem.maxDose !== item.maxDose) ||
                                    (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                    (item.DropTimings.length !== editedItem.DropTimings.length);

                                if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                    let oldDescription = buildDescription(editedItem, true);
                                    let newDescription = buildDescription(item, true);

                                    let obj = {
                                        "LogId": 0,
                                        "ModuleId": 2,
                                        "ModuleName": "ASC",
                                        "SubModuleId": 37,
                                        "SubModuleName": "Yag Template",
                                        "ScreenType": "Pre-Op Medications",
                                        "ActionType": actiontype,
                                        "OldActionDescription": oldDescription,
                                        "NewActionDescription": newDescription,
                                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                    }
                                    $scope.LogObj.LogArray.push(obj);
                                }
                            }
                        });
                    }
                }
            });
        }


        $scope.CompareIntraOpMedications = function (savedArray) {

            angular.forEach(savedArray, function (item) {
                // Case 1: Deleted
                if (item.DeleteInd === 'Y') {
                    let description = buildDescription(item, true);
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Intra-Op Medications",
                        "ActionType": "Deleted",
                        "OldActionDescription": '',
                        "NewActionDescription": description,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }

                // Case 2: Added / Edited
                else {
                    let edited = $scope.LogObj.IntraOpMedications.filter(eitem =>
                        eitem.OrganizationPrescriptionId == item.OrganizationPrescriptionId
                    );

                    // Newly Added
                    if (edited.length === 0) {
                        let description = buildDescription(item, true);
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Intra-Op Medications",
                            "ActionType": "Added",
                            "OldActionDescription": '',
                            "NewActionDescription": description,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        }
                        $scope.LogObj.LogArray.push(obj);
                    }

                    // Edited
                    else {
                        edited.forEach(function (editedItem) {
                            if (editedItem.OrganizationPrescriptionId == item.OrganizationPrescriptionId) {

                                let actiontype = 'Edited';

                                if (editedItem.DropTimings.length == 0 && item.DropTimings.length > 0) {
                                    actiontype = 'Added';
                                }
                                // Check if DropTimings changed
                                let dropTimingsEdited = editedItem.DropTimings.filter(editem =>
                                    !item.DropTimings.some(ditem =>
                                        ditem.GivenBy == editem.GivenBy &&
                                        ditem.Remarks == editem.Remarks &&
                                        ditem.MedicationDosage == editem.MedicationDosage &&
                                        ditem.MedicationTime == editem.MedicationTime
                                    )
                                );

                                let isFieldEdited =
                                    (editedItem.Action !== item.Action) ||
                                    (editedItem.Dose !== item.Dose) ||
                                    (editedItem.DoseUnit !== item.DoseUnit) ||
                                    (editedItem.Route !== item.Route) ||
                                    (editedItem.Frequency !== item.Frequency) ||
                                    (editedItem.maxDose !== item.maxDose) ||
                                    (editedItem.MedicationNotes !== item.MedicationNotes) ||
                                    (item.DropTimings.length !== editedItem.DropTimings.length);

                                if (dropTimingsEdited.length > 0 || isFieldEdited) {
                                    let oldDescription = buildDescription(editedItem, true);
                                    let newDescription = buildDescription(item, true);

                                    let obj = {
                                        "LogId": 0,
                                        "ModuleId": 2,
                                        "ModuleName": "ASC",
                                        "SubModuleId": 37,
                                        "SubModuleName": "Yag Template",
                                        "ScreenType": "Intra-Op Medications",
                                        "ActionType": actiontype,
                                        "OldActionDescription": oldDescription,
                                        "NewActionDescription": newDescription,
                                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                    }
                                    $scope.LogObj.LogArray.push(obj);
                                }
                            }
                        });
                    }
                }
            });
        }

        $scope.CompareGeneralOrders = function (savedArray) {
            angular.forEach(savedArray, function (item) {
                // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
                let existingItem = $scope.LogObj.GeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

                // Case 1: Deleted
                if (item.DeleteInd === 'Y') {
                    let oldDesc =
                        (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                        (item.Status ? `Status: ${item.Status}\n` : '') +
                        (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Preo-Op Custom Orders",
                        "ActionType": "Deleted",
                        "OldActionDescription": '',
                        "NewActionDescription": oldDesc.trim(),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }

                // Case 2: Edited (field-by-field comparison)
                else if (existingItem) {
                    let oldDesc = "";
                    let newDesc = "";

                    if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                        if (existingItem.MedicineName) {
                            oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                        }
                        if (item.MedicineName) {
                            newDesc += `Custom Order: ${item.MedicineName}\n`;
                        }
                    }
                    if ((existingItem.Status || "") !== (item.Status || "")) {
                        if (existingItem.Status) {
                            oldDesc += `Status: ${existingItem.Status}\n`;
                        }
                        if (item.Status) {
                            newDesc += `Status: ${item.Status}\n`;
                        }
                    }
                    if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                        if (existingItem.MedicationTime) {
                            oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                        }
                        if (item.MedicationTime) {
                            newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                        }
                    }

                    if (oldDesc || newDesc) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Preo-Op Custom Orders",
                            "ActionType": "Edited",
                            "OldActionDescription": oldDesc.trim(),
                            "NewActionDescription": newDesc.trim(),
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        }
                        $scope.LogObj.LogArray.push(obj);
                    }
                }

                // Case 3: Added
                else {
                    let newDesc =
                        (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                        (item.Status ? `Status: ${item.Status}\n` : '') +
                        (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Preo-Op Custom Orders",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": newDesc.trim(),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }
            });
        }

        $scope.CompareIntraOpGeneralOrders = function (savedArray) {
            angular.forEach(savedArray, function (item) {
                // Find matching item from previous saved GeneralOrders (based on some ID or unique name)
                let existingItem = $scope.LogObj.IntraOpGeneralOrders.find(e => e.GeneralOrderId == item.GeneralOrderId);

                // Case 1: Deleted
                if (item.DeleteInd === 'Y') {
                    let oldDesc =
                        (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                        (item.Status ? `Status: ${item.Status}\n` : '') +
                        (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Intra-Op Custom Orders",
                        "ActionType": "Deleted",
                        "OldActionDescription": '',
                        "NewActionDescription": oldDesc.trim(),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }

                // Case 2: Edited (field-by-field comparison)
                else if (existingItem) {
                    let oldDesc = "";
                    let newDesc = "";

                    if ((existingItem.Status || "") !== (item.Status || "") || (existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                        if (existingItem.MedicineName) {
                            oldDesc += `Custom Order: ${existingItem.MedicineName}\n`;
                        }
                        if (item.MedicineName) {
                            newDesc += `Custom Order: ${item.MedicineName}\n`;
                        }
                    }
                    if ((existingItem.Status || "") !== (item.Status || "")) {
                        if (existingItem.Status) {
                            oldDesc += `Status: ${existingItem.Status}\n`;
                        }
                        if (item.Status) {
                            newDesc += `Status: ${item.Status}\n`;
                        }
                    }
                    if ((existingItem.MedicationTime || "") !== (item.MedicationTime || "")) {
                        if (existingItem.MedicationTime) {
                            oldDesc += `MedicationTime: ${existingItem.MedicationTime}\n`;
                        }
                        if (item.MedicationTime) {
                            newDesc += `MedicationTime: ${item.MedicationTime}\n`;
                        }
                    }

                    if (oldDesc || newDesc) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": 2,
                            "ModuleName": "ASC",
                            "SubModuleId": 37,
                            "SubModuleName": "Yag Template",
                            "ScreenType": "Intra-Op Custom Orders",
                            "ActionType": "Edited",
                            "OldActionDescription": oldDesc.trim(),
                            "NewActionDescription": newDesc.trim(),
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        }
                        $scope.LogObj.LogArray.push(obj);
                    }
                }

                // Case 3: Added
                else {
                    let newDesc =
                        (item.MedicineName ? `Custom Order: ${item.MedicineName}\n` : '') +
                        (item.Status ? `Status: ${item.Status}\n` : '') +
                        (item.MedicationTime ? `MedicationTime: ${item.MedicationTime}\n` : '');

                    let obj = {

                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 37,
                        "SubModuleName": "Yag Template",
                        "ScreenType": "Intra-Op Custom Orders",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": newDesc.trim(),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    }
                    $scope.LogObj.LogArray.push(obj);
                }
            });
        }

        $scope.cacheStorageItem.FullName = $scope.cacheStorageItem.PatientName || '';
        $scope.cacheStorageItem.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || '';

        $scope.patiendetilsopen = function () {
            let patientId = $scope.cacheStorageItem.PatientID || 0;
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var selectedPatientData = data;

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


        $scope.PrintYagTemplateData = function () {

            let obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };
            eHnoteSurgeryService.GetOTQuickAccessDetails(obj).then(function (resp) {
                if (resp.data.status === "Success") {

                    $scope.OrganizationDetails = resp.data.OrganizationDetails || [];
                    if ($scope.OrganizationDetails.length && $scope.OrganizationDetails[0]?.OrganizationLogoUrl) {
                        $scope.toDataURL($scope.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                            $scope.$applyAsync(() => {
                                $scope.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                                $scope.generateYagPrint(resp);
                            });
                        });
                    } else {
                        $scope.generateYagPrint(resp);
                    }
                }
            });
        }

        $scope.generateYagPrint = function (resp) {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                if (doctorinfo.doctordata.User[0].Suffix !== '') {
                    CreatedByName = CreatedByName + doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                } else {
                    CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                }
            }

            let DiagnosisName = "";
            let AnesthesistName = "";
            let SurgeryName = "";
            let CPTCode = "";
            let SurgeryDate = "";
            let AdditionalSurgeryName = "";
            let SurgeonName = "";
            let OrganName = "";
            let ICDCode = "";
            let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
            if (Surgeonlist.length > 0) {
                SurgeonName = Surgeonlist[0].UserFullName;
            } else {
                SurgeonName = '';
            }

            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                SurgeryDate = $filter('date')($scope.cacheStorageItem.SurgeryList[0].SurgeryDate, 'MM-dd-yyyy') || '';
            }
            if (resp.data.SurgeryList.length > 0) {
                angular.forEach(resp.data.SurgeryList, function (item) {
                    if (resp.data.SurgeryList[0].DiagnosisList.length > 0) {
                        angular.forEach(resp.data.SurgeryList[0].DiagnosisList, function (sitem) {
                            var IcdCode = '';
                            sitem.ICDCode = sitem.ICDCode || '';
                            if (sitem.ICDCode !== '') {
                                IcdCode = sitem.ICDCode;
                            }
                            DiagnosisName += ", " + IcdCode + '-' + sitem.DiagnosisName;
                        });
                        if (DiagnosisName.charAt(0) === ",") {
                            DiagnosisName = DiagnosisName.slice(1);
                        }
                    }
                    if (item.AnesthetistId != null) {
                        let Anesthesistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                        if (Anesthesistlist.length > 0) {
                            AnesthesistName = Anesthesistlist[0].UserFullName;
                        } else {
                            AnesthesistName = "";
                        }
                    }
                    item.OrganId = item.OrganId || "";
                    if (item.OrganId !== '') {
                        if (item.OrganId == 1) {
                            OrganName = "OD";
                        } else if (item.OrganId == 2) {
                            OrganName = "OS";
                        } else if (item.OrganId == 3) {
                            OrganName = "OU";
                        } else if (item.OrganId == 4) {
                            OrganName = "General";
                        }
                    }
                });
                SurgeryName = resp.data.SurgeryList[0].SurgeryName || "";
                CPTCode = resp.data.SurgeryList[0].CPTCode || "";
                var Description = "";
                if (resp.data.SurgeryList[0].AdditionalSurgery.length > 0) {
                    angular.forEach(resp.data.SurgeryList[0].AdditionalSurgery, function (sitem) {
                        let OrganName = '';
                        sitem.OrganId = sitem.OrganId || null;
                        if (sitem.OrganId !== null) {
                            if (sitem.OrganId == 1) {
                                OrganName = "(OD)";
                            } else if (sitem.OrganId == 2) {
                                OrganName = "(OS)";
                            } else if (sitem.OrganId == 3) {
                                OrganName = "(OU)";
                            } else if (sitem.OrganId == 4) {
                                OrganName = "General";
                            }
                        }

                        Description += "," + sitem.Description + OrganName;
                    });
                    if (Description.charAt(0) === ",") {
                        Description = Description.slice(1);
                    }
                }
                if (Description != '') {
                    AdditionalSurgeryName += Description;
                }
            }

            let PreOpChecklist = $filter("filter")($scope.yagPreOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 21, "IsChecked": true }, true) || [];
            let IntraOpChecklist = $filter("filter")($scope.yagIntraOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 22, "IsChecked": true }, true) || [];
            let PostOpChecklist = $filter("filter")($scope.yagPostOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 23, "IsChecked": true }, true) || [];
            let PreOpFallRiskAssessment = $filter("filter")($scope.yagPreOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 24, "IsChecked": true }, true) || [];

            let IntraopFireRiskChecklist = $filter("filter")($scope.yagIntraOPTempObj.OrgASCChecklist, { "CheckListCategoryId": 10, "IsChecked": true }, true) || [];

            let AnesthesiaTypelist = [];
            if ($scope.yagIntraOPTempObj.AnesthesiaTypeList.length > 0) {
                AnesthesiaTypelist = $filter("filter")($scope.yagIntraOPTempObj.AnesthesiaTypeList, function (Aitem, index) { return (Aitem.IsSelected == true); });
            }

            let PreOpVitalsArray = [];
            if ($scope.yagPreOPTempObj.PreOpVitalsArray.length > 0) {
                PreOpVitalsArray = $filter('filter')($scope.yagPreOPTempObj.PreOpVitalsArray, { "TypeId": 4 }, true) || [];
            }

            let PostOpVitalsArray = [];
            if ($scope.yagPostOPTempObj.PostOpVitalsArray.length > 0) {
                PostOpVitalsArray = $filter('filter')($scope.yagPostOPTempObj.PostOpVitalsArray, { "TypeId": 6 }, true) || [];
            }

            let FinalOrderDetails = [];
            if ($scope.yagPreOPTempObj.PreOpOrderDetails.length > 0) {
                FinalOrderDetails = $filter('filter')($scope.yagPreOPTempObj.PreOpOrderDetails, { "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
            }


            let FinalIntraOpOrderDetails = [];
            if ($scope.yagIntraOPTempObj.IntraOpOrderDetails.length > 0) {
                FinalIntraOpOrderDetails = $filter('filter')($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
            }

            $timeout(function () {
                var Object = {
                    "CreatedBy": CreatedByName,
                    'Surgeon': SurgeonName || '',
                    "Anesthetist": AnesthesistName || '',
                    "Diagnosis": DiagnosisName || '',
                    "ICDCode": ICDCode || "",
                    "Name": $scope.cacheStorageItem.PatientName || '',
                    "Age": $scope.cacheStorageItem.Age || '',
                    "Gender": $scope.cacheStorageItem.Gender || '',
                    "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                    "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                    "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                    //"VisitReason": $scope.cacheStorageItem.VisitReason || '',
                    "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                    "SurgeryDate": SurgeryDate || '',
                    "VisitReason": $scope.cacheStorageItem.AppointmentVisitReasonName || '',
                    "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                    "SurgeryName": SurgeryName || '',
                    "AdditionalSurgeryName": AdditionalSurgeryName || '',
                    "OrganName": OrganName || '',
                    "IntraOpChecklist": IntraOpChecklist || [],
                    "PreOpChecklist": PreOpChecklist || [],
                    "PostOpChecklist": PostOpChecklist || [],
                    "PreOpFallRiskAssessment": PreOpFallRiskAssessment || [],
                    "EhnoteLogoURL": $scope.HeaderLogo || '',
                    "ProcedureName": SurgeryName || '',
                    "SiteName": $scope.yagPreOPTempObj.SiteName || '',
                    "FallRiskLevel": $scope.yagPreOPTempObj.FallRiskLevel || '',
                    "FallRiskAssessmentTotalScore": $scope.yagPreOPTempObj.FallRiskAssessmentTotalScore || '',
                    "AssistiveWalkingDevice": $scope.yagPreOPTempObj.AssistiveWalkingDevice || '',
                    "FallriskBraceletprovided": $scope.yagPreOPTempObj.FallriskBraceletprovided || '',
                    "IntraOpRoomInTimeOD": $scope.yagIntraOPTempObj.IntraOpRoomInTimeOD || '',
                    "IntraOpRoomOutTimeOD": $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOD || '',
                    "IntraOpStartTimeOD": $scope.yagIntraOPTempObj.IntraOpStartTimeOD || '',
                    "IntraOpEndTimeOD": $scope.yagIntraOPTempObj.IntraOpEndTimeOD || '',
                    "IntraOpBurstsOD": $scope.yagIntraOPTempObj.IntraOpBurstsOD || '',
                    "IntraOpMjOD": $scope.yagIntraOPTempObj.IntraOpMjOD || '',
                    "IntraOpRoomInTimeOS": $scope.yagIntraOPTempObj.IntraOpRoomInTimeOS || '',
                    "IntraOpRoomOutTimeOS": $scope.yagIntraOPTempObj.IntraOpRoomOutTimeOS || '',
                    "IntraOpStartTimeOS": $scope.yagIntraOPTempObj.IntraOpStartTimeOS || '',
                    "IntraOpEndTimeOS": $scope.yagIntraOPTempObj.IntraOpEndTimeOS || '',
                    "IntraOpBurstsOS": $scope.yagIntraOPTempObj.IntraOpBurstsOS || '',
                    "IntraOpMjOS": $scope.yagIntraOPTempObj.IntraOpMjOS || '',
                    "PatientDischarge": $scope.yagPostOPTempObj.PatientDischarge || '',
                    "PostOpDischaredTime": $scope.yagPostOPTempObj.PostOpDischaredTime || '',
                    "IntraOpProcedureName": SurgeryName || '',
                    "IntraOpSiteName": $scope.yagIntraOPTempObj.IntraOpSiteName || '',
                    "IntraOpAnesthesiaTypelist": AnesthesiaTypelist || [],
                    "ImplemetedHighRiskfallprevention": $scope.yagPreOPTempObj.ImplemetedHighRiskfallprevention || '',
                    "PreOpVitalsArray": PreOpVitalsArray || [],
                    "PostOpVitalsArray": PostOpVitalsArray || [],
                    "PreOpOrderDetails": FinalOrderDetails || [],
                    "IntraOpOrderDetails": FinalIntraOpOrderDetails || [],
                    "PreOpOverallNotes": $scope.yagPreOPTempObj.PreOpOverallNotes || '',
                    "PreOpReviewedByDate": $scope.yagPreOPTempObj.PreOpReviewedByDate || null,
                    "PreOpReviewedByTime": $scope.yagPreOPTempObj.PreOpReviewedByTime || '',
                    "IntraOpReviewedByDate": $scope.yagIntraOPTempObj.IntraOpReviewedByDate || null,
                    "IntraOpReviewedByTime": $scope.yagIntraOPTempObj.IntraOpReviewedByTime || '',
                    "PostOpReviewedByDate": $scope.yagPostOPTempObj.PostOpReviewedByDate || null,
                    "PostOpReviewedByTime": $scope.yagPostOPTempObj.PostOpReviewedByTime || '',
                    "PreOPNurseReviewedByName": $scope.yagPreOPTempObj.PreOPNurseReviewedByName || '',
                    "PostOpRecoveryNurseByName": $scope.yagPostOPTempObj.PostOpRecoveryNurseByName || '',
                    "IntraOpNurseReviewedByName": $scope.yagIntraOPTempObj.IntraOpNurseReviewedByName || '',
                    "IntraOpYagLensName": $scope.yagIntraOPTempObj.IntraOpYagLensName || '',
                    "PreOpLastSignOffUserDeatils": $scope.yagPreOPLastSignOffUserDeatils || [],
                    "IntraOpLastSignOffUserDeatils": $scope.yagIntraOPLastSignOffUserDeatils || [],
                    "PostOpLastSignOffUserDeatils": $scope.yagPostOPLastSignOffUserDeatils || [],
                    "AnesthetistFireRiskID": $scope.yagIntraOPTempObj.AnesthetistFireRiskID || null,
                    "AnesthetistFireRiskName": $scope.yagIntraOPTempObj.AnesthetistFireRiskName || '',
                    "AnesthetistFireRiskLicenseNo": $scope.yagIntraOPTempObj.AnesthetistFireRiskLicenseNo || null,
                    "AnesthetistReviewdDate": $scope.yagIntraOPTempObj.AnesthetistReviewdDate || null,
                    "DoctorFireRiskID": $scope.yagIntraOPTempObj.DoctorFireRiskID || null,
                    "DoctorFireRiskName": $scope.yagIntraOPTempObj.DoctorFireRiskName || '',
                    "DoctorFireRiskLicenseNo": $scope.yagIntraOPTempObj.DoctorFireRiskLicenseNo || null,
                    "DoctorReviewdDate": $scope.yagIntraOPTempObj.DoctorReviewdDate || null,
                    "NurseFireRiskID": $scope.yagIntraOPTempObj.NurseFireRiskID || null,
                    "NurseFireRiskName": $scope.yagIntraOPTempObj.NurseFireRiskName || '',
                    "NurseFireRiskLicenseNo": $scope.yagIntraOPTempObj.NurseFireRiskLicenseNo || null,
                    "NurseFireRiskReviewdDate": $scope.yagIntraOPTempObj.NurseFireRiskReviewdDate || null,
                    "RiskLevel": $scope.yagIntraOPTempObj.RiskLevel || '',
                    "IntraopFireRiskChecklist": IntraopFireRiskChecklist || [],

                    "YagPreopChartStatus": $scope.yagPreOPTempObj.YagPreopChartStatus || '',
                    "YagIntraopNurseChartStatus": $scope.yagIntraOPTempObj.YagIntraopNurseChartStatus || '',
                    "YagIntraopDoctorChartStatus": $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus || '',

                    "YagPostopDoctorChartStatus": $scope.yagPostOPTempObj.YagPostopDoctorChartStatus || '',
                    "YagPostopNurseChartStatus": $scope.yagPostOPTempObj.YagPostopNurseChartStatus || '',
                    "OrganizationDetails": $scope.OrganizationDetails || [],
                    "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',

                }
                USPrintService.GenerateYagTemplatePrint(Object);
            }, 500);
        }
        $scope.shared = {
            "signOffUserId":null
        }
        $scope.openYagSignOffpopup = function (type, screenType) {
            let RoleId = userLoginDetails.RoleID;
            /* the consent status shown while signing must be the current one */
            if (type === 'SignOff' && IsPostOpConsentSignOff(screenType)) {
                $scope.GetPatientAppointmentConsentsById();
            }
            var mainObj = {
                "NurseReviewedByArray": $scope.NurseReviewedByArray || [],
                "NurseDoctorsReviewedByArray": $scope.NurseAndDoctorsArray || [],
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientVisitId": $scope.cacheStorageItem.PatientVisitId,
                "yagPreOPTempObj": $scope.yagPreOPTempObj,
                "yagIntraOPTempObj": $scope.yagIntraOPTempObj,
                "yagPostOPTempObj": $scope.yagPostOPTempObj,
                "type": type,
                "RoleId": RoleId || null,
                "screenType": screenType,
                "IsPostOpNurseSignOff": IsPostOpConsentSignOff(screenType),
                "UserId": $scope.UserId || null,
                "shared": $scope.shared
            }
            yagSignOffPopupCommon(mainObj)

        }
        function yagSignOffPopupCommon(mainObj) {
            let signmodalInstance = $uibModal.open({
                "templateUrl": "yagSignOffPopup.html",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "windowClass":' ',
                /* the popup inherits this scope so it can show the consent
                   signature status of the logged-in role and apply the
                   signature without closing the sign-off */
                "scope": $scope,
                "resolve": {
                    "resolveMainObj": mainObj,
                    "savePreOPYagTemplateData": function () { return $scope.savePreOPYagTemplateData },
                    "saveIntraOPYagTemplateData": function () { return $scope.saveIntraOPYagTemplateData },
                    "savePostOPYagTemplateData": function () { return $scope.savePostOPYagTemplateData }
                },
                "controller": function ($scope, $uibModalInstance, resolveMainObj, savePreOPYagTemplateData, saveIntraOPYagTemplateData, savePostOPYagTemplateData) {

                    $scope.NurseReviewedByArray = resolveMainObj.NurseReviewedByArray || [];
                    $scope.NurseDoctorsReviewedByArray = resolveMainObj.NurseDoctorsReviewedByArray || [];
                    $scope.yagScreenType = resolveMainObj.screenType;
                    /* set once - the template reads a flag, not a function, on every digest */
                    $scope.IsPostOpNurseSignOff = resolveMainObj.IsPostOpNurseSignOff;
                    $scope.yagPreOPTempObj = resolveMainObj.yagPreOPTempObj;
                    $scope.yagIntraOPTempObj = resolveMainObj.yagIntraOPTempObj;
                    $scope.yagPostOPTempObj = resolveMainObj.yagPostOPTempObj;
                    $scope.roleId = resolveMainObj.RoleId;
                    $scope.type = resolveMainObj.type;
                    $scope.shared = resolveMainObj.shared;
                    var UserId = resolveMainObj.UserId
                    console.log("$scope.roleId", $scope.roleId)
                    var AppointmentId = resolveMainObj.AppointmentId;
                    var PatientVisitId = resolveMainObj.PatientVisitId;
                    $scope.signOffObj = {
                        "SignOffUserId": null,
                        "SignOffPassword": '',
                        "Remarks": '',
                        "IsIntraOPChecked": false,
                        "IsPostOPChecked": false,
                    }

                    var getSignOffUserId = function (lastUserDetails, reviewersArray) {
                        if (lastUserDetails && lastUserDetails.length > 0) {
                            var lastUser = lastUserDetails[0].SignOffUserName;
                            var matchedUser = reviewersArray.find(function (item) {
                                return item.FullName === lastUser;
                            });
                            return matchedUser ? Number(matchedUser.DoctorID) : null;
                        }
                        return null;
                    };
                    
                    if ($scope.yagScreenType == 'YagPreop') {
                        if ($scope.yagPreOPTempObj.YagPreopChartStatus == 'E') {
                            $scope.signOffObj.SignOffUserId = getSignOffUserId($scope.yagPreOPTempObj.LastSignOffUserDetails, $scope.NurseReviewedByArray);
                        } else {
                            $scope.signOffObj.SignOffUserId = $scope.roleId === 8 ? UserId: null;
                        }
                    } 
                    else if ($scope.yagScreenType == 'YagIntraop') {
                        $scope.signOffObj.SignOffUserId = getSignOffUserId($scope.yagIntraOPTempObj.LastSignOffUserDetails, $scope.NurseDoctorsReviewedByArray) || UserId;
                    } else if ($scope.yagScreenType == 'YagPostop') {
                        $scope.signOffObj.SignOffUserId = getSignOffUserId($scope.yagPostOPTempObj.LastSignOffUserDetails, $scope.NurseDoctorsReviewedByArray) || UserId;
                    }                    
                    if ($scope.roleId == 1 || $scope.roleId == 43) {
                        if ($scope.yagScreenType === 'YagIntraop') {
                            $scope.signOffObj.IsIntraOPChecked = true;
                            $scope.signOffObj.IsPostOPChecked = ($scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'E')
                        } else if ($scope.yagScreenType === 'YagPostop') {
                            $scope.signOffObj.IsPostOPChecked = true;
                            $scope.signOffObj.IsIntraOPChecked = ($scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'E')
                        }
                        if ($scope.yagScreenType === 'YagIntraop') {
                            if ($scope.signOffObj.IsIntraOPChecked && $scope.yagIntraOPTempObj?.YagIntraopDoctorChartStatus === 'E') {
                                $scope.signOffObj.SignOffUserId = getSignOffUserId(
                                    $scope.yagIntraOPTempObj.LastSignOffUserDetails,
                                    $scope.NurseDoctorsReviewedByArray
                                );
                            } else if ($scope.signOffObj.IsIntraOPChecked && $scope.yagIntraOPTempObj?.YagIntraopNurseChartStatus === 'E') {
                                $scope.signOffObj.SignOffUserId = getSignOffUserId(
                                    $scope.yagIntraOPTempObj.LastSignOffUserDetails,
                                    $scope.NurseDoctorsReviewedByArray
                                );
                            }
                        } else if ($scope.yagScreenType === 'YagPostop') {
                            if ($scope.signOffObj.IsPostOPChecked && $scope.yagPostOPTempObj?.YagPostopDoctorChartStatus === 'E') {
                                $scope.signOffObj.SignOffUserId = getSignOffUserId(
                                    $scope.yagPostOPTempObj.LastSignOffUserDetails,
                                    $scope.NurseDoctorsReviewedByArray
                                );
                            }else if ($scope.signOffObj.IsPostOPChecked && $scope.yagPostOPTempObj?.YagPostopNurseChartStatus === 'E') {
                                $scope.signOffObj.SignOffUserId = getSignOffUserId(
                                    $scope.yagPostOPTempObj.LastSignOffUserDetails,
                                    $scope.NurseDoctorsReviewedByArray
                                );
                            }
                        }

                    }


                    $scope.onCheckboxYagChanged = function (type) {
                        if ($scope.roleId != 1 && $scope.roleId != 43) return;

                        if (type === 'IntraOP' && $scope.signOffObj.IsIntraOPChecked) {
                            if ($scope.yagIntraOPTempObj?.YagIntraopDoctorChartStatus === 'E') {
                                $scope.signOffObj.SignOffUserId = getSignOffUserId($scope.yagIntraOPTempObj.LastSignOffUserDetails || [], $scope.NurseDoctorsReviewedByArray);
                            }
                        }

                        if (type === 'PostOP' && $scope.signOffObj.IsPostOPChecked) {
                            if ($scope.yagPostOPTempObj?.YagPostopDoctorChartStatus === 'E') {
                                $scope.signOffObj.SignOffUserId = getSignOffUserId($scope.yagPostOPTempObj.LastSignOffUserDetails || [], $scope.NurseDoctorsReviewedByArray);
                            }
                        }
                    };

                    $scope.ValidatePreOPSignOffPassword = function () {
                        let DoctorId = null;
                        $scope.signOffObj.SignOffUserId = $scope.signOffObj.SignOffUserId || null
                        $scope.shared.signOffUserId = $scope.signOffObj.SignOffUserId || null;
                        DoctorId = $scope.signOffObj.SignOffUserId || null;
                        if (DoctorId == null) {
                            alertify.error("Select User");
                            return false;
                        }

                        $scope.signOffObj.SignOffPassword = $scope.signOffObj.SignOffPassword || "";
                        if ($scope.signOffObj.SignOffPassword == "") {
                            alertify.error("Please Enter Valid Password");
                            return false;
                        }
                        if ($scope.yagScreenType !== 'YagPreop') {
                            if (($scope.roleId === 1 || $scope.roleId === 43) &&
                                (!$scope.signOffObj.IsIntraOPChecked && !$scope.signOffObj.IsPostOPChecked)) {
                                alertify.error("Please check at least Intra OP or Post OP");
                                return false;
                            }
                        }
                        let params = {
                            "VisitId": PatientVisitId,
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "AppointmentId": AppointmentId || 0,
                            "DoctorId": DoctorId || null,
                            "SignOffPassword": $scope.signOffObj.SignOffPassword || "",
                            "IsNurse": false,
                            "IsDoctor": false,
                            "IsPreOPYag": false,
                            "IsIntraOPYag": false,
                            "IsPostOPYag": false,
                            "Screens": [
                                {
                                    "Screen": $scope.yagScreenType,
                                    "Type": resolveMainObj.type || '',
                                    "Remarks": $scope.signOffObj.Remarks || "",
                                }
                            ]

                        }
                        if ($scope.roleId === 1 || $scope.roleId === 43) {
                            params.Screens[0].IsNurse = false;
                            params.Screens[0].IsDoctor = true;
                            params.IsDoctor = true;
                        } else {
                            params.Screens[0].IsNurse = true;
                            params.Screens[0].IsDoctor = false;
                            params.IsNurse = true;
                        }
                        switch ($scope.yagScreenType) {
                            case "YagPreop":
                                params.IsPreOPYag = true;
                                break;
                            case "YagIntraop":
                                params.IsIntraOPYag = true;
                                break;
                            case "YagPostop":
                                params.IsPostOPYag = true;
                                break;
                        }
                        console.log("params",params)
                        const alreadyHasScreen = (screenName) => {
                            return params.Screens.some(item => item.Screen === screenName);
                        };
                        if ($scope.signOffObj.IsIntraOPChecked && $scope.signOffObj.IsPostOPChecked && $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus != 'E' && $scope.yagPostOPTempObj.YagPostopDoctorChartStatus != 'E') {
                            if (!alreadyHasScreen("YagIntraop") && $scope.yagScreenType !== 'YagIntraop') {                                
                                params.IsIntraOPYag = true;
                                params.Screens.push({
                                    Screen: "YagIntraop",
                                    Type: resolveMainObj.type || '',
                                    Remarks: $scope.signOffObj.Remarks || "",
                                    IsNurse: false,
                                    IsDoctor: true
                                });                               
                            }
                            if (!alreadyHasScreen("YagPostop") && $scope.yagScreenType !== 'YagPostop') {                               
                                params.IsPostOPYag = true;
                                params.Screens.push({
                                    Screen: "YagPostop",
                                    Type: resolveMainObj.type || '',
                                    Remarks: $scope.signOffObj.Remarks || "",
                                    IsNurse: false,
                                    IsDoctor: true
                                });                               
                            }
                        }
                        else if ($scope.signOffObj.IsIntraOPChecked && !alreadyHasScreen("YagIntraop")) {
                            if ($scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus != 'E' && resolveMainObj.type == "SinOff") {                               
                                params.IsIntraOPYag = true;
                                params.Screens.push({
                                    Screen: "YagIntraop",
                                    Type: resolveMainObj.type || '',
                                    Remarks: $scope.signOffObj.Remarks || "",
                                    IsNurse: false,
                                    IsDoctor: true
                                });
                            } else if ($scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'E' && resolveMainObj.type == "Unsign" && $scope.yagScreenType == 'YagIntraop') {                               
                                params.IsIntraOPYag = true;
                                params.Screens.push({
                                    Screen: "YagIntraop",
                                    Type: resolveMainObj.type || '',
                                    Remarks: $scope.signOffObj.Remarks || "",
                                    IsNurse: false,
                                    IsDoctor: true
                                });
                            }
                        }
                        else if ($scope.signOffObj.IsPostOPChecked && !alreadyHasScreen("YagPostop")) {
                            if ($scope.yagPostOPTempObj.YagPostopDoctorChartStatus != 'E' && resolveMainObj.type == "SinOff") {                                
                                params.IsPostOPYag = true;
                                params.Screens.push({
                                    Screen: "YagPostop",
                                    Type: resolveMainObj.type || '',
                                    Remarks: $scope.signOffObj.Remarks || "",
                                    IsNurse: false,
                                    IsDoctor: true
                                });
                            } else if ($scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'E' && resolveMainObj.type == "Unsign") {                               
                                params.IsPostOPYag = true;
                                params.Screens.push({
                                    Screen: "YagPostop",
                                    Type: resolveMainObj.type || '',
                                    Remarks: $scope.signOffObj.Remarks || "",
                                    IsNurse: false,
                                    IsDoctor: true
                                });
                            }
                        }
                        eHnoteSettingsDataService.GetValidateYagTemplateSignOffPassword(params, getSignoffPWDSuccess, getSignoffPWDError);
                        function getSignoffPWDSuccess(data) {
                            if (data.status == "Success") {
                                let type = params.Screens[0].Type
                                if (type == "SignOff") {
                                    alertify.success('Successfully Signed Off');
                                    executeSaveBasedOnScreens();
                                } else {
                                    alertify.success('Successfully Unsigned');
                                    executeSaveBasedOnScreens();
                                }
                            } else {
                                alertify.error(data.Message);
                            }
                        }

                        function getSignoffPWDError(err) {
                            console.log(err);
                        }
                    };
                    function executeSaveBasedOnScreens() {
                        const isIntraChecked = $scope.signOffObj.IsIntraOPChecked;
                        const isPostChecked = $scope.signOffObj.IsPostOPChecked;
                        if (isIntraChecked && isPostChecked && $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'D' && $scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'D') {
                            $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus = $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'D' ? 'E' : 'D';
                            saveIntraOPYagTemplateData($scope.type);

                            $scope.yagPostOPTempObj.YagPostopDoctorChartStatus = $scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'D' ? 'E' : 'D';
                            savePostOPYagTemplateData($scope.type);

                            $scope.uibclose();
                        } else if (isIntraChecked && $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'D') {
                            $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus = $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'D' ? 'E' : 'D';
                            saveIntraOPYagTemplateData($scope.type);
                            $scope.uibclose();
                        } else if (isPostChecked && $scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'D') {
                            $scope.yagPostOPTempObj.YagPostopDoctorChartStatus = $scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'D' ? 'E' : 'D';
                            savePostOPYagTemplateData($scope.type);
                            $scope.uibclose();
                        }
                        else {
                            if ($scope.yagScreenType == 'YagPreop') {
                                $scope.yagPreOPTempObj.YagPreopChartStatus = $scope.yagPreOPTempObj.YagPreopChartStatus == 'D' ? 'E' : 'D';
                                savePreOPYagTemplateData($scope.type);
                            } else if ($scope.yagScreenType == 'YagIntraop') {
                                if ($scope.roleId == 1 || $scope.roleId == 43) {
                                    $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus = $scope.yagIntraOPTempObj.YagIntraopDoctorChartStatus == 'D' ? 'E' : 'D';
                                } else {
                                    $scope.yagIntraOPTempObj.YagIntraopNurseChartStatus = $scope.yagIntraOPTempObj.YagIntraopNurseChartStatus == 'D' ? 'E' : 'D';
                                }
                                saveIntraOPYagTemplateData($scope.type);
                            } else if ($scope.yagScreenType == 'YagPostop') {
                                if ($scope.roleId == 1 || $scope.roleId == 43) {
                                    $scope.yagPostOPTempObj.YagPostopDoctorChartStatus = $scope.yagPostOPTempObj.YagPostopDoctorChartStatus == 'D' ? 'E' : 'D';
                                } else {
                                    $scope.yagPostOPTempObj.YagPostopNurseChartStatus = $scope.yagPostOPTempObj.YagPostopNurseChartStatus == 'D' ? 'E' : 'D';
                                }
                                savePostOPYagTemplateData($scope.type);
                            }
                            $scope.uibclose();
                        }
                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.isIntraOPDisabled = function () {
                        return $scope.yagIntraOPTempObj?.YagIntraopDoctorChartStatus === 'E' ||
                            ($scope.yagPostOPTempObj?.YagPostopDoctorChartStatus === 'E' && $scope.yagScreenType !== 'YagIntraop');
                    };

                    $scope.isPostOPDisabled = function () {
                        return $scope.yagPostOPTempObj?.YagPostopDoctorChartStatus === 'E' ||
                            ($scope.yagIntraOPTempObj?.YagIntraopDoctorChartStatus === 'E' && $scope.yagScreenType !== 'YagPostop');
                    };

                    $scope.shouldShowIntraOPCheckbox = function () {
                        const disabled = $scope.isIntraOPDisabled();
                        const checked = $scope.signOffObj?.IsIntraOPChecked;

                        return (!disabled || (disabled && checked && $scope.yagScreenType === 'YagIntraop'));
                    };

                    $scope.shouldShowPostOPCheckbox = function () {
                        const disabled = $scope.isPostOPDisabled();
                        const checked = $scope.signOffObj?.IsPostOPChecked;

                        return (!disabled || (disabled && checked && $scope.yagScreenType === 'YagPostop'));
                    };

                    $scope.shouldShowCheckboxes = function () {
                        return $scope.shouldShowIntraOPCheckbox() || $scope.shouldShowPostOPCheckbox();
                    };

                }
            });
            signmodalInstance.result.then(function (resp) {

            }, function (data) {

            });
        }
        // Medications new Changes 

        $scope.maxDoseList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
        $scope.SelectDialtionMedicationItems = function (item, type) {

            let i = 0;
            angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {
                angular.forEach(mitem.DilationMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.DilationMedicationObj.MedicineObject = {};
                $scope.DilationMedicationObj.MedicationName = '';
                return false;
            }

            $scope.DilationMedicationObj.MedicineObject = item;
            $scope.DilationMedicationObj.MedicationName = item.MedicineName;

            if ($scope.DilationMedicationObj.AscMedicationId != 0) {
                item.AscMedicationId = $scope.DilationMedicationObj.AscMedicationId;
            }


            $scope.updateOrderDescription(11);
        };


        $scope.SelectDialtionMedicationItemsFrequent = function (item, type) {

            let templist = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "MedTypeId": 11, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);

            let i = 0;
            angular.forEach($scope.yagPreOPTempObj.PreOpOrderDetails, function (mitem) {
                angular.forEach(mitem.DilationMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.DilationMedicationObj.MedicineObject = "";
                return false;
            }
            if (templist.length > 0) {

                let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                if (List.length > 0) {
                    alertify.error("Medicine name already added!");
                    $scope.DilationMedicationObj.MedicineObject = '';
                    return false;
                }

                if (type == 'Frequently') {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicationName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],
                        "TypeId": 4,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }
                    templist[0].DilationMedications.push(obj);
                    $scope.DilationMedicationObj.MedicineObject = "";

                } else {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicineName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],
                        "TypeId": 4,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }
                    templist[0].DilationMedications.push(obj);
                    $scope.DilationMedicationObj.MedicineObject = "";
                }

            } else {

                let templist2 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 11;
                    templist2[0].MedTypeName = 'Yag PreOp Medications';
                } else {
                    let templist3 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByPassword": '',
                            "ReviewedByDateTime": null,
                            "ReviewedBy": null,
                            "UserType": "Nurse",
                            "ScreenType": "YagTemplate",
                            "ScreenTypeId": 10,
                            "MedTypeId": 11,
                            "MedTypeName": 'Yag PreOp Medications',
                            "DilationMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.yagPreOPTempObj.PreOpOrderDetails.push(obj);
                    }
                }
                let templist1 = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 11, 'DeleteInd': 'N' }, true) || [];
                if (templist1.length > 0) {
                    let List1 = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                    let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                    if (List.length > 0) {
                        alertify.error("Medicine name already added!");
                        $scope.DilationMedicationObj.MedicineObject = '';
                        return false;
                    }

                    if (type == 'Frequently') {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicationName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes,
                            "maxDose": item.maxDose,
                        }
                        templist1[0].DilationMedications.push(obj);
                        $scope.DilationMedicationObj.MedicineObject = "";
                    } else {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicineName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes,
                            "maxDose": item.maxDose,
                        }
                        templist1[0].DilationMedications.push(obj);
                        $scope.DilationMedicationObj.MedicineObject = "";
                    }

                } else {

                    $scope.yagPreOPTempObj.PreOpOrderDetails = $scope.yagPreOPTempObj.PreOpOrderDetails || [];
                    $scope.DilationMedications = $scope.DilationMedications || [];
                    let List1 = $filter("filter")($scope.DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                    let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                    if (List.length > 0) {
                        alertify.error("Medicine name already added!");
                        $scope.DilationMedicationObj.MedicineObject = '';
                        return false;
                    }

                    if (type == 'Frequently') {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicationName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes,
                            "maxDose": item.maxDose,
                        }
                        $scope.DilationMedications.push(obj);
                        $scope.DilationMedicationObj.MedicineObject = "";

                    } else {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicineName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "TypeId":4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes,
                            "maxDose": item.maxDose,
                        }
                        $scope.DilationMedications.push(obj);
                        $scope.DilationMedicationObj.MedicineObject = "";

                    }
                }
            }

        }

        $scope.AddYagDilationMedication = function () {
            let item = $scope.DilationMedicationObj.MedicineObject;
            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }
            let obj = {           
                "AscMedicationId": item.AscMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.DilationMedicationObj.MedicationName,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": false,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": [],
                "TypeId": 4,
                "DeleteInd": "N",
                "Action": $scope.DilationMedicationObj.Action,
                "Dose": $scope.DilationMedicationObj.Dose,
                "DoseUnit": $scope.DilationMedicationObj.DoseUnit,
                "Route": $scope.DilationMedicationObj.Route,
                "Frequency": $scope.DilationMedicationObj.Frequency,
                "ActionId": $scope.DilationMedicationObj.ActionId,
                "DoseId": $scope.DilationMedicationObj.DoseId,
                "DoseUnitId": $scope.DilationMedicationObj.DoseUnitId,
                "RouteId": $scope.DilationMedicationObj.RouteId,
                "FrequencyId": $scope.DilationMedicationObj.FrequencyId,
                "OrderDescription": $scope.DilationMedicationObj.OrderDescription,
                "MedicationNotes": $scope.DilationMedicationObj.MedicationNotes,
                "maxDose": $scope.DilationMedicationObj.maxDose,

            
            };


            let templist = $filter("filter")($scope.yagPreOPTempObj.PreOpOrderDetails, function (oitem) {
                return oitem.MedTypeId === 11 && oitem.DeleteInd === 'N';
            }) || [];


            if ($scope.DilationMedicationObj.EditIndex >= 0) {

                if (templist.length > 0 && templist[0].DilationMedications.length > $scope.DilationMedicationObj.EditIndex) {
                    templist[0].DilationMedications[$scope.DilationMedicationObj.EditIndex] = obj;
                    alertify.success('Updated successfully');
                }
            } else {

                if (templist.length > 0) {
                    templist[0].DilationMedications.push(obj);
                } else {
               
                    var newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByPassword": '',
                        "ReviewedByDateTime": null,
                        "ReviewedBy": null,
                        "UserType": "Nurse",
                        "ScreenType": "YagTemplate",
                        "ScreenTypeId": 10,
                        "MedTypeId": 11,
                        "MedTypeName": 'Yag PreOp Medications',
                        "DilationMedications": [obj],
                        "GeneralOrders": [],
                    }
                    $scope.yagPreOPTempObj.PreOpOrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }


            $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
        };

        $scope.editDilationMedication = function (item, index) {
            $scope.DilationMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                AscMedicationId: item.AscMedicationId || 0

            };

            $scope.DilationMedicationObj.MedicationName = item.MedicationName;

            $scope.DilationMedicationObj.Action = item.Action;
            $scope.DilationMedicationObj.Dose = item.Dose;
            $scope.DilationMedicationObj.DoseUnit = item.DoseUnit;
            $scope.DilationMedicationObj.Route = item.Route;
            $scope.DilationMedicationObj.Frequency = item.Frequency;

            $scope.DilationMedicationObj.ActionId = item.ActionId;
            $scope.DilationMedicationObj.DoseId = item.DoseId;
            $scope.DilationMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.DilationMedicationObj.RouteId = item.RouteId;
            $scope.DilationMedicationObj.FrequencyId = item.FrequencyId;

            $scope.DilationMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.DilationMedicationObj.maxDose = item.maxDose;

            $scope.DilationMedicationObj.OrderDescription = item.OrderDescription;
            $scope.DilationMedicationObj.DropTimings = item.DropTimings || [];
            $scope.DilationMedicationObj.EditIndex = index;

           
            $scope.DilationMedicationObj.AscMedicationId = item.AscMedicationId;
            $scope.DilationMedicationObj.IsmedSearchDisabled = true;
            $scope.yagPreOPTempObj.PreOpOrderType = 'Medications';


        };


        $scope.ClearYagMedicationData = function (type) {

            if (type == 1) {
                $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            } else if (type == 2) {
                $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());
            } 

        }


        $scope.editIntraOpMedication = function (item, index, Id) {
        
                $scope.AnesthesiaMedicationObj.MedicineObject = {
                    MedicationName: item.MedicationName,
                    MedicineId: item.MedicineId,
                    OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                    Strength: item.Strength || '',
                    IsFrequent: item.IsFrequent || 'N',
                    AscMedicationId: item.AscMedicationId || 0
                };

                $scope.AnesthesiaMedicationObj.MedicationName = item.MedicationName;
                $scope.AnesthesiaMedicationObj.Action = item.Action;
                $scope.AnesthesiaMedicationObj.Dose = item.Dose;
                $scope.AnesthesiaMedicationObj.DoseUnit = item.DoseUnit;
                $scope.AnesthesiaMedicationObj.Route = item.Route;
                $scope.AnesthesiaMedicationObj.Frequency = item.Frequency;

                $scope.AnesthesiaMedicationObj.ActionId = item.ActionId;
                $scope.AnesthesiaMedicationObj.DoseId = item.DoseId;
                $scope.AnesthesiaMedicationObj.DoseUnitId = item.DoseUnitId;
                $scope.AnesthesiaMedicationObj.RouteId = item.RouteId;
                $scope.AnesthesiaMedicationObj.FrequencyId = item.FrequencyId;

                $scope.AnesthesiaMedicationObj.OrderDescription = item.OrderDescription;
                $scope.AnesthesiaMedicationObj.MedicationNotes = item.MedicationNotes;
                $scope.AnesthesiaMedicationObj.maxDose = item.maxDose;
                $scope.AnesthesiaMedicationObj.DropTimings = item.DropTimings || [];


                $scope.AnesthesiaMedicationObj.OrderTypeId = item.OrderTypeId;
                $scope.AnesthesiaMedicationObj.OrderTypeName = item.OrderTypeName;
                $scope.AnesthesiaMedicationObj.AscMedicationId = item.AscMedicationId;

                $scope.AnesthesiaMedicationObj.EditIndex = index;
                $scope.AnesthesiaMedicationObj.IsmedSearchDisabled = true;        
               $scope.yagIntraOPTempObj.IntraOpOrderType = 'AnesthesiaMedications';
            
        };



        $scope.changePreopAction = function (Id, type) {
            if (type == 11) {
                var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.DilationMedicationObj.Action = filteredArray[0].Code;
                    $scope.DilationMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
                };


                $scope.updateOrderDescription(11);

            }  else if (type == 12) {
                var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.AnesthesiaMedicationObj.Action = filteredArray[0].Code;
                    $scope.AnesthesiaMedicationObj.ActionId = filteredArray[0].MedicineDosaageFieldId;
                };

                $scope.updateOrderDescription(12);
            }
        };

        $scope.changePreopDose = function (Id, type) {
            if (type == 11) {
                var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.DilationMedicationObj.Dose = filteredArray[0].Code;
                    $scope.DilationMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
                };

                $scope.updateOrderDescription(11);
            } else if (type == 12) {
                var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.AnesthesiaMedicationObj.Dose = filteredArray[0].Code;
                    $scope.AnesthesiaMedicationObj.DoseId = filteredArray[0].MedicineDosaageFieldId;
                };
                $scope.updateOrderDescription(12);
            }


           
        };

        $scope.changePreopDoseUnit = function (Id, type) {
            if (type == 11) {
                var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.DilationMedicationObj.DoseUnit = filteredArray[0].Code;
                    $scope.DilationMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
                };
                $scope.updateOrderDescription(11);
            } else if (type == 12) {
                var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.AnesthesiaMedicationObj.DoseUnit = filteredArray[0].Code;
                    $scope.AnesthesiaMedicationObj.DoseUnitId = filteredArray[0].MedicineDosaageFieldId;
                };
                $scope.updateOrderDescription(12);
            }

         

        };

        $scope.changePreopRoute = function (Id, type) {
            if (type == 11) {
                var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.DilationMedicationObj.Route = filteredArray[0].Code;
                    $scope.DilationMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
                };
                $scope.updateOrderDescription(11);
            } else if (type == 12) {
                var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.AnesthesiaMedicationObj.Route = filteredArray[0].Code;
                    $scope.AnesthesiaMedicationObj.RouteId = filteredArray[0].MedicineDosaageFieldId;
                };
                $scope.updateOrderDescription(12);
            }


         
        };

        $scope.changePreopFrequency = function (Id, type) {
            if (type == 11) {
                var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.DilationMedicationObj.Frequency = filteredArray[0].Description;
                    $scope.DilationMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
                };

                $scope.updateOrderDescription(11);
            } else if (type == 12) {
                var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": Id }, true);
                if (filteredArray.length > 0) {
                    $scope.AnesthesiaMedicationObj.Frequency = filteredArray[0].Description;
                    $scope.AnesthesiaMedicationObj.FrequencyId = filteredArray[0].MedicineDosaageFieldId;
                };

                $scope.updateOrderDescription(12);
            }


        
        };



        $scope.updateOrderDescription = function (id) {

            if (id == 11) {
                $scope.DilationMedicationObj.OrderDescription = $scope.DilationMedicationObj.Action + " " + $scope.DilationMedicationObj.MedicationName + " " + $scope.DilationMedicationObj.Dose + " " + $scope.DilationMedicationObj.DoseUnit + " " + $scope.DilationMedicationObj.Route + " " + $scope.DilationMedicationObj.Frequency + " " + ($scope.DilationMedicationObj.maxDose ? " for " + $scope.DilationMedicationObj.maxDose + " times." : "");

            } else if (id == 12) {
                $scope.AnesthesiaMedicationObj.OrderDescription = $scope.AnesthesiaMedicationObj.Action + " " + $scope.AnesthesiaMedicationObj.MedicationName + " " + $scope.AnesthesiaMedicationObj.Dose + " " + $scope.AnesthesiaMedicationObj.DoseUnit + " " + $scope.AnesthesiaMedicationObj.Route + " " + $scope.AnesthesiaMedicationObj.Frequency + " " + ($scope.AnesthesiaMedicationObj.maxDose ? " for " + $scope.AnesthesiaMedicationObj.maxDose + " times." : "");

            } 

        }




        $scope.onMaxDoseChange = function (id, item, type) {

           if (type == 11) {
                $scope.DilationMedicationObj.maxDose = id;
                $scope.updateOrderDescription(11);
            } else if (type == 12) {
                $scope.AnesthesiaMedicationObj.maxDose = id;
                $scope.updateOrderDescription(12);
            } 
        };


        $scope.SelectAnesthesiaMedicationItems = function (item, type) {
            let i = 0;

            angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {
                angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                    if (
                        Aitem.MedicineId === item.MedicineId &&
                        Aitem.DeleteInd === 'N'
                    ) {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Anesthesia Medication');
                $scope.AnesthesiaMedicationObj.MedicineObject = {};
                $scope.AnesthesiaMedicationObj.MedicationName = '';
                return false;
            }

            $scope.AnesthesiaMedicationObj.MedicineObject = item;
            $scope.AnesthesiaMedicationObj.MedicationName = item.MedicineName;

            if ($scope.AnesthesiaMedicationObj.AscMedicationId != 0) {
                item.AscMedicationId = $scope.AnesthesiaMedicationObj.AscMedicationId;
            }


            $scope.updateOrderDescription(12);
        };


        $scope.SelectAnesthesiaMedicationItemsFrequently = function (item, type) {
            let templist = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "MedTypeId": 12, 'IsOrderReviewed': false, 'DeleteInd': 'N' }, true);
            let i = 0;
            angular.forEach($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (mitem) {
                if (mitem.MedTypeId == 12) {
                    angular.forEach(mitem.IntraOpMedications, function (Aitem) {
                        if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                            i++;
                        }
                    });
                }
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.IntraOpMedicationObj.MedicineObject = "";
                return false;
            }


            if (templist.length > 0) {

                let List1 = $filter("filter")(templist[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                if (List.length > 0) {
                    alertify.error("Medicine name already added!");
                    $scope.AnesthesiaMedicationObj.MedicineObject = '';
                    return false;
                }

                if (type == 'Frequently') {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicationName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],
                        "TypeId": 4,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }
                    templist[0].IntraOpMedications.push(obj);
                    $scope.AnesthesiaMedicationObj.MedicineObject = "";
                } else {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicineName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],
                        "TypeId": 5,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes,
                        "maxDose": item.maxDose,
                    }
                    templist[0].IntraOpMedications.push(obj);
                    $scope.AnesthesiaMedicationObj.MedicineObject = "";
                }
            } else {

                let templist2 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 12;
                    templist2[0].MedTypeName = 'Yag IntraOp Medications';
                } else {

                    let templist3 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByPassword": '',
                            "ReviewedBy": null,
                            "UserType": "Nurse",
                            "ScreenType": "YagTemplate",
                            "ScreenTypeId": 10,
                            "MedTypeId": 12,
                            "MedTypeName": 'Yag IntraOp Medications',
                            "IntraOpMedications": [],
                            "GeneralOrders": [],
                        }
                        $scope.yagIntraOPTempObj.IntraOpOrderDetails.push(obj);
                    }

                }
                let templist1 = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, { "ReviewedBy": null, "MedTypeId": 12, 'DeleteInd': 'N' }, true) || [];
                if (templist1.length > 0) {
                    let List1 = $filter("filter")(templist1[0].IntraOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                    let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                    if (List.length > 0) {
                        alertify.error("Medicine name already added!");
                        $scope.AnesthesiaMedicationObj.MedicineObject = "";
                        return false;
                    }


                    if (type == 'Frequently') {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicationName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes,
                            "maxDose": item.maxDose,
                        }
                        templist1[0].IntraOpMedications.push(obj);
                        $scope.AnesthesiaMedicationObj.MedicineObject = "";
                    } else {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicineName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes,
                            "maxDose": item.maxDose,
                        }
                        templist1[0].IntraOpMedications.push(obj);
                        $scope.AnesthesiaMedicationObj.MedicineObject = "";
                    }
                }
            }
        }



        $scope.AddYagIntraopAnesthesiaMedication = function () {

            let item = $scope.AnesthesiaMedicationObj.MedicineObject;
            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }
            let obj = {
                "AscMedicationId": item.AscMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.AnesthesiaMedicationObj.MedicationName,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": false,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": [],
                "TypeId": 4,
                "DeleteInd": "N",
                "Action": $scope.AnesthesiaMedicationObj.Action,
                "Dose": $scope.AnesthesiaMedicationObj.Dose,
                "DoseUnit": $scope.AnesthesiaMedicationObj.DoseUnit,
                "Route": $scope.AnesthesiaMedicationObj.Route,
                "Frequency": $scope.AnesthesiaMedicationObj.Frequency,
                "ActionId": $scope.AnesthesiaMedicationObj.ActionId,
                "DoseId": $scope.AnesthesiaMedicationObj.DoseId,
                "DoseUnitId": $scope.AnesthesiaMedicationObj.DoseUnitId,
                "RouteId": $scope.AnesthesiaMedicationObj.RouteId,
                "FrequencyId": $scope.AnesthesiaMedicationObj.FrequencyId,
                "OrderDescription": $scope.AnesthesiaMedicationObj.OrderDescription,
                "MedicationNotes": $scope.AnesthesiaMedicationObj.MedicationNotes,
                "maxDose": $scope.AnesthesiaMedicationObj.maxDose,


            };


            let templist = $filter("filter")($scope.yagIntraOPTempObj.IntraOpOrderDetails, function (oitem) {
                return oitem.MedTypeId === 12  && oitem.DeleteInd === 'N';
            }) || [];


            if ($scope.AnesthesiaMedicationObj.EditIndex >= 0) {

                if (templist.length > 0 && templist[0].IntraOpMedications.length > $scope.AnesthesiaMedicationObj.EditIndex) {
                    templist[0].IntraOpMedications[$scope.AnesthesiaMedicationObj.EditIndex] = obj;
                    alertify.success('Updated successfully');
                }
            } else {

                if (templist.length > 0) {
                    templist[0].IntraOpMedications.push(obj);
                } else {

                    var newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "IsOrderReviewed": false,
                        "ReviewedByPassword": '',
                        "ReviewedByDateTime": null,
                        "ReviewedBy": null,                      
                        "UserType": "Nurse",
                        "ScreenType": "YagTemplate",
                        "ScreenTypeId": 10,
                        "MedTypeId": 12,
                        "MedTypeName": 'Yag IntraOp Medications',
                        "IntraOpMedications": [obj],
                        "GeneralOrders": [],
                    }
                    $scope.yagIntraOPTempObj.IntraOpOrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }


            $scope.AnesthesiaMedicationObj = angular.copy($scope.GetAnesthesiaMedicationObj());
        };
        $scope.OnSelectFireRiskAssesChecklist = function (bool, Item) {
            if (bool) {
                if (Item.CheckListId == 571) {
                    $scope.yagIntraOPTempObj.IsShowAnesthetistReviewByinFireRisk = true;
                }
                if (Item.CheckListId == 572) {
                    $scope.yagIntraOPTempObj.IsShowDoctorReviewByinFireRisk = true;
                }
            } else {
                if (Item.CheckListId == 571) {
                    $scope.yagIntraOPTempObj.IsShowAnesthetistReviewByinFireRisk = false;
                    $scope.yagIntraOPTempObj.AnesthetistFireRiskID = null;
                    $scope.yagIntraOPTempObj.AnesthetistFireRiskName = '';
                }
                if (Item.CheckListId == 572) {
                    $scope.yagIntraOPTempObj.IsShowDoctorReviewByinFireRisk = false;
                    $scope.yagIntraOPTempObj.DoctorFireRiskID = null;
                    $scope.yagIntraOPTempObj.DoctorFireRiskName = '';
                }
                if (!Item.IsChecked && Item.SubCheckList.length > 0) {
                    angular.forEach(Item.SubCheckList, function (sitem) {
                        sitem.IsChecked = false;
                    });
                }
            }

            var FireRisccount = 0;
            angular.forEach($scope.yagIntraOPTempObj.OrgASCChecklist, function (sitem) {
                if (sitem.CheckListCategoryId == 10 && sitem.IsChecked) {
                    FireRisccount++;
                }
            });
            if (FireRisccount == 0) {
                $scope.yagIntraOPTempObj.RiskLevel = '';
                $scope.yagIntraOPTempObj.NurseFireRiskID = null;
                $scope.yagIntraOPTempObj.NurseFireRiskName = '';
            }
            else if (FireRisccount <= 2) {
                $scope.yagIntraOPTempObj.RiskLevel = 'Low Risk';
            } else if (FireRisccount == 3) {
                $scope.yagIntraOPTempObj.RiskLevel = 'Potential to convert to high risk';
            } else if (FireRisccount > 3) {
                $scope.yagIntraOPTempObj.RiskLevel = 'High risk';
            }
            else { }
        };
        $scope.ChangeFireRiskNurseReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.yagIntraOPTempObj.NurseFireRiskReviewdDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                $scope.yagIntraOPTempObj.NurseFireRiskReviewdDate = null;
            }
        }

        $scope.ChangeFireRiskAnesthesiologistReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.yagIntraOPTempObj.AnesthetistReviewdDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                $scope.yagIntraOPTempObj.AnesthetistReviewdDate = null;
            }
        }

        $scope.ChangeFireRiskDoctorReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.yagIntraOPTempObj.DoctorReviewdDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                $scope.yagIntraOPTempObj.DoctorReviewdDate = null;
            }
        }

        $scope.popOverhtmlContent = "";
        $scope.FireRiskAssessmentsublistPopover = {
            templateUrl: 'FireRiskAssessmentsublistPopover.html',
        };

        $scope.FireRiskAssessmentsublistPopoverClick = function (item) {
            $scope.popOverhtmlContent = "";
            item.Description = item.Description || "";
            if (item.Description != "") {
                $scope.popOverhtmlContent = $sce.trustAsHtml(item.Description);
            }
        };

        /* ==================================================================
           Consent form signature status - role based.

           Mirrors the ASC Post-Op sign-off behaviour (USAscPostOpCtrl): while
           signing a template the signer is shown the consent signatures that
           are still pending for their OWN role, and can apply them without
           leaving the sign-off popup. A role with nothing pending is shown
           as complete (green).
           ================================================================== */
        $scope.consentsMainObj = {
            "OrganizationConsents": [],
            "PatientConsents": [],
            "MainConsents": [],
            "SelectedConsentTemplateId": 0
        };
        $scope.IsshowBulkSignrefreshButton = false;
        $scope.ConsentformSignatureIndication = '';
        $scope.ConsentSignStatus = getEmptyConsentSignStatus();

        function getEmptyConsentSignStatus() {
            return {
                "HasConsents": false,
                "PendingConsents": [],
                "PatientRequired": 0,
                "PatientPending": 0,
                "StaffRequired": 0,
                "StaffPending": 0,
                "GaurdianRequired": 0,
                "GaurdianPending": 0,
                "AnesthesistRequired": 0,
                "AnesthesistPending": 0,
                "DoctorRequired": 0,
                "DoctorPending": 0,
                "TotalPending": 0
            };
        }

        /* the roles that own a consent signature - the status is evaluated per
           role, never globally */
        function IsNurseConsentRole() { return $scope.RoleId == 8 || $scope.RoleId == 38; }
        function IsAnesthesiaConsentRole() { return $scope.RoleId == 25 || $scope.RoleId == 30; }
        function IsSurgeonConsentRole() { return $scope.RoleId == 1 || $scope.RoleId == 43; }
        /* consent status is shown only on the Post-Op sign-off, and only to a nurse (8) */
        function IsPostOpConsentSignOff(screenType) { return screenType === 'YagPostop' && $scope.RoleId == 8; }

        /* which role badges this user sees - role based, never global */
        $scope.ConsentRoleAccess = {
            "Nurse": IsNurseConsentRole(),
            "Anesthesia": IsAnesthesiaConsentRole(),
            "Surgeon": IsSurgeonConsentRole()
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
                "IsSelected": false
            };
            return obj;
        }

        $scope.GetPatientAppointmentConsentsById = function () {
            $scope.consentsMainObj.MainConsents = [];
            $scope.consentsMainObj.OrganizationConsents = [];
            $scope.consentsMainObj.PatientConsents = [];
            $scope.ConsentSignStatus = getEmptyConsentSignStatus();
            $scope.IsshowBulkSignrefreshButton = false;
            $scope.ConsentformSignatureIndication = '';

            var obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "ServiceTypeId": $scope.cacheStorageItem.VisitTypeId,
                "VisitId": 0,
                "AppointmentType": $scope.cacheStorageItem.AppointmentType
            };

            return eHnoteSettingsDataService.GetPatientAppointmentConsentsById(obj).then(function (resp) {
                $scope.admissiondatetime = resp.data.Admissiondatetime || null;

                resp.data.OrganizationConsents = resp.data.OrganizationConsents || [];
                if (resp.data.OrganizationConsents.length > 0) {
                    $scope.consentsMainObj.OrganizationConsents = resp.data.OrganizationConsents;
                    angular.forEach($scope.consentsMainObj.OrganizationConsents, function (oitem) {
                        oitem.isConsentAddedForPatient = false;
                    });
                }
                resp.data.PatientAppointmentConsents = resp.data.PatientAppointmentConsents || [];

                var filteredArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "IsPrimary": "Y" }, true);
                if (resp.data.PatientAppointmentConsents.length > 0) {
                    $scope.consentsMainObj.PatientConsents = resp.data.PatientAppointmentConsents;
                    $scope.consentsMainObj.SelectedConsentTemplateId = $scope.consentsMainObj.PatientConsents[0].ConsentTemplateId || 0;
                    if ($scope.consentsMainObj.SelectedConsentTemplateId === 0 && filteredArray.length > 0) {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                    }
                } else {
                    if (filteredArray.length > 0) {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                    }
                }
                reformAppointmentConsentsandOrgConsents($scope.consentsMainObj.SelectedConsentTemplateId);
                return resp;
            }, function (err) {
                console.log(err);
            });
        };

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
                        obj.IsStaffSignatureDone = false;
                        obj.IsCounselorSignatureDone = false;
                        obj.IsAnesthesistSignatureDone = false;
                        obj.IsGaurdianSignatureDone = false;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });
                } else {
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
                            obj.IsStaffSignatureDone = false;
                            obj.IsCounselorSignatureDone = false;
                            obj.IsAnesthesistSignatureDone = false;
                            obj.IsGaurdianSignatureDone = false;
                            obj.IsScannedDocument = false;
                            $scope.consentsMainObj.MainConsents.push(obj);
                        }
                    });
                }
            }

            BuildConsentSignStatusForRole();
        }

        /* Evaluates the consent signature status for the logged-in role only.
           Every role keeps its own required / pending counters, so a role with
           nothing pending is reported complete while another role on the same
           consent may still be pending. */
        function BuildConsentSignStatusForRole() {
            var status = getEmptyConsentSignStatus();
            var consents = $scope.consentsMainObj.MainConsents || [];
            status.HasConsents = consents.length > 0;

            $scope.IsshowBulkSignrefreshButton = false;
            $scope.ConsentformSignatureIndication = '';

            angular.forEach(consents, function (item) {

                if (!item.IsCounselorSignRequired) {
                    item.CounselorClass = 'disabled';
                } else {
                    item.CounselorClass = item.IsCounselorSignatureDone ? 'complete' : 'incomplete';
                }

                item.CanBulksignconsent = false;

                if (IsNurseConsentRole()) {
                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        status.PatientRequired++;
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                            status.PatientPending++;
                        }
                    }

                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        status.GaurdianRequired++;
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                            status.GaurdianPending++;
                        }
                    }

                    if (!item.IsStaffSignRequired) {
                        item.StaffClass = 'disabled';
                    } else {
                        status.StaffRequired++;
                        if (item.IsStaffSignatureDone) {
                            item.StaffClass = 'complete';
                        } else {
                            item.StaffClass = 'incomplete';
                            status.StaffPending++;
                        }
                    }

                    item.CanBulksignconsent = item.StaffClass == 'incomplete' ||
                        item.PatientClass == 'incomplete' ||
                        item.GaurdianClass == 'incomplete';
                }

                if (IsAnesthesiaConsentRole()) {
                    if (!item.IsAnesthesistSignRequired) {
                        item.AnesthesistClass = 'disabled';
                    } else {
                        status.AnesthesistRequired++;
                        if (item.IsAnesthesistSignatureDone) {
                            item.AnesthesistClass = 'complete';
                        } else {
                            item.AnesthesistClass = 'incomplete';
                            status.AnesthesistPending++;
                        }
                    }
                    item.CanBulksignconsent = item.AnesthesistClass == 'incomplete';
                }

                if (IsSurgeonConsentRole()) {
                    if (!item.IsDoctorSignRequired) {
                        item.ProviderClass = 'disabled';
                    } else {
                        status.DoctorRequired++;
                        if (item.IsProviderSignatureDone) {
                            item.ProviderClass = 'complete';
                        } else {
                            item.ProviderClass = 'incomplete';
                            status.DoctorPending++;
                        }
                    }
                    item.CanBulksignconsent = item.ProviderClass == 'incomplete';
                }

                if (item.CanBulksignconsent) {
                    $scope.IsshowBulkSignrefreshButton = true;
                    status.PendingConsents.push(item.ConsentFormName || item.DocumentName || "Consent Form");
                }
            });

            status.TotalPending = status.PatientPending + status.StaffPending +
                status.GaurdianPending + status.AnesthesistPending + status.DoctorPending;

            var messages = [];
            if (status.StaffPending > 0) { messages.push("Staff Sign Is Incomplete in the consent forms."); }
            if (status.PatientPending > 0) { messages.push("Patient Sign Is InComplete In Consents forms."); }
            if (status.GaurdianPending > 0) { messages.push("Gaurdian Sign Is InComplete In Consents forms."); }
            if (status.AnesthesistPending > 0) { messages.push("Anesthesia Sign Is InComplete In Consents Forms."); }
            if (status.DoctorPending > 0) { messages.push("Surgeon Sign Is InComplete In Consents Forms."); }
            $scope.ConsentformSignatureIndication = messages.join("\n");

            $scope.ConsentSignStatus = status;
        }

        /* Apply signature from inside the sign-off popup - opens the consents
           screen and refreshes this role's status when it is closed, so the
           indicator updates without reloading the template. */
        $scope.ApplyConsentsSignature = function (signOffUserId) {
            $scope.ProviderSigBase64 = null;
            var signer = $filter("filter")($scope.allUserList || [], function (item) {
                return item.DoctorID == (signOffUserId || $scope.UserId);
            }) || [];
            if (signer.length > 0 && signer[0].SignatureOfUser) {
                $scope.ProviderSigBase64 = signer[0].SignatureOfUser || null;
            }

            $scope.AppointmentPatientdata = [];
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
            $scope.AppointmentPatientdata.push(hospitalobj);

            var selectedApptObj = $scope.cacheStorageItem.selectedApptObj || {};
            var sobj = {
                "mainitem": selectedApptObj,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "ParentHospitalId": $scope.ParenthospitalId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "HospitalAddress": $scope.AppointmentPatientdata,
                "selectedArray": [],
                "selectedObj": "",
                "Page": "PreOp",
                "PatientDetails": selectedApptObj.Patient || "",
                "ApptHospitalId": selectedApptObj.BranchId || 0
            };

            var consentmodalInstance = $uibModal.open({
                "templateUrl": "templates/uibpopups/DocumentsPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "resolve": {
                    "ParentObject": function () { return sobj; }
                },
                "keyboard": false,
                "controller": "UsPatientDocumentsCtrl",
                "windowClass": "modal__popup--1 bottom-to-top-modal"
            });

            consentmodalInstance.result.then(function (result) {
                if (result && result.MainConsents) {
                    $scope.consentsMainObj.MainConsents = result.MainConsents || [];
                    BuildConsentSignStatusForRole();
                } else {
                    $scope.GetPatientAppointmentConsentsById();
                }
            }, function () {
                $scope.GetPatientAppointmentConsentsById();
            });
        };

        $scope.$on("RefreshAppointmentConsents", function () {
            $scope.GetPatientAppointmentConsentsById();
        });

        $scope.GetPatientAppointmentConsentsById();
    }]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 10);
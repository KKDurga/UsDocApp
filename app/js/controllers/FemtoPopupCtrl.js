"use strict";
eHnoteWebApp.controller("FemtoPopupCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSurgeryService", "$q", "$timeout", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "USPrintService", "eHnoteAuditServices", "eHnoteConditionsDataService", "$uibModalInstance", "eHnoteUserDataService","$sce",
    function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSurgeryService, $q, $timeout, eHnoteMainAdminServices, eHnoteMainAppointmentService, USPrintService, eHnoteAuditServices, eHnoteConditionsDataService, $uibModalInstance, eHnoteUserDataService, $sce,) {
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        console.log($scope.UserAccessRights);
        console.log($scope.allUserList);

        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 18;
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
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
        $scope.GetLogObj = function () {
            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "LogArray": [],

                "OrgASCChecklist": [],
                "FemtoArcuateNotesInd": false,
                "FemtoArcuateIncisions1": '',
                "IsFemtoArcuateIncisions1NA": false,
                "FemtoArcuateIncisions2": '',
                "IsFemtoArcuateIncisions2NA": false,
                "FemtoArcuateIncisionsNotes": '',
                "FemtoTimeOut": '',
                "FemtoStartTime": '',
                "FemtoEndTime": '',
                "FemtoReferenceNo": '',
                "FemtoLotNo": '',
                "FemtoExpiryDate": null,
                "FemtoOverAllNotes": '',
                "FemtNurseReviewedById": null,
                "FemtNurseReviewedByName": '',
                "FemtDoctorReviewedById": null,
                "FemtDoctorReviewedByName": '',
                "FemtDoctorReviewedByDate": null,
                "FemtDoctorReviewedByTime": '',
                "IfFemtoTemplateDataAdded": false,
                "FemtAnesthesiaReviewedById": null,
                "FemtAnesthesiaReviewedByName": '',
                "PatientASCFemtoId": null,
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
        $scope.FemtotabObj = {
            "FemtoTAB": 1,
        };
        $scope.FemtotempObj = {

            "OrgASCChecklist": [],
            "FemtoArcuateNotesInd": false,
            "FemtoArcuateIncisions1": '',
            "IsFemtoArcuateIncisions1NA": false,
            "FemtoArcuateIncisions2": '',
            "IsFemtoArcuateIncisions2NA": false,
            "FemtoArcuateIncisionsNotes": '',
            "FemtoTimeOut": '',
            "FemtoStartTime": '',
            "FemtoEndTime": '',
            "FemtoReferenceNo": '',
            "FemtoLotNo": '',
            "FemtoExpiryDate": null,
            "FemtoOverAllNotes": '',
            "FemtNurseReviewedById": null,
            "FemtNurseReviewedByName": '',
            "FemtDoctorReviewedById": null,
            "FemtDoctorReviewedByName": '',
            "FemtDoctorReviewedByDate": null,
            "FemtDoctorReviewedByTime": '',
            "IfFemtoTemplateDataAdded": false,
            "IfIntraFemtoTemplateDataAdded": false,
            "IsFemtoreviewedby": false,
            "FemtAnesthesiaReviewedById": null,
            "FemtAnesthesiaReviewedByName": '',
            "PatientASCFemtoId": null,
            "IsShowAnesthetistReviewByinFireRisk": false,
            "IsShowDoctorReviewByinFireRisk": false,
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
            "AnesthesiologistArray": [],
            "NurseArray": [],
            "DoctorArray": [],
            "NurseFireRiskReviewdDate": null,
            "AnesthetistReviewdDate": null,
            "DoctorReviewdDate": null,
            "IsClickSaveFemtoBtn": false,

        }
        $scope.allUserList = $scope.allUserList || [];
        if ($scope.allUserList.length > 0) {
            $scope.ReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
            $scope.SurgeonArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10) || [];
            $scope.AnesthetistReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 25);

            $scope.FemtotempObj.NurseArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.FemtotempObj.DoctorArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43) || [];
            $scope.FemtotempObj.AnesthesiologistArray = $scope.allUserList.filter((x) => x.RoleId == 30) || [];



        }

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
           
            $q.all([
                eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
                eHnoteSurgeryService.GetFemtoTemplateChartData(req2),
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    if (resp[0].data.rows.length > 0) {
                            $scope.FemtotempObj.OrgASCChecklist = resp[0].data.rows;
                            angular.forEach($scope.FemtotempObj.OrgASCChecklist, function (item) {
                                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                    kitem.IsChecked = false;
                                });
                            });
                          
                    }

                }

                if (resp[1].data.status === "Success") {
                    if (resp[1].data.rows.length > 0) {
                        $scope.TempOrgASCChecklistDetails = [];
                        if (resp[1].data.rows[0].OrgASCChecklist.length > 0) {
                            $scope.LogObj.OrgASCChecklist = resp[1].data.rows[0].OrgASCChecklist || [];
                                $scope.FemtotempObj.PatientASCPreOPId = resp[1].data.rows[0].PatientASCPreOPId || null;
                                angular.forEach(resp[1].data.rows[0].OrgASCChecklist, function (item) {
                                    angular.forEach($scope.FemtotempObj.OrgASCChecklist, function (kitem) {
                                            if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                                if (kitem.CheckListId === item.CheckListId) {
                                                    kitem.IsChecked = true;
                                                    kitem.Score = item.Score || 0;
                                                    kitem.Value = item.Value || '';
                                                    kitem.Remarks = item.Remarks || '';
                                                    if (kitem.Remarks !== '') {
                                                        kitem.intranotes1 = true;
                                                    }
                                                    kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                                    if (item.CheckListId == 212 || item.CheckListId == 170) {
                                                        item.AscMultiCheckValueArray = item.AscMultiCheckValueArray || [];
                                                        if (item.AscMultiCheckValueArray.length > 0) {
                                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                                    if (hitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                                        hitem.IsChecked = true;
                                                                        hitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                                    }
                                                                });
                                                            });
                                                        }

                                                    }
                                                    else {
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
                                $scope.TempOrgASCChecklistLogs = angular.copy(resp[1].data.rows[0].OrgASCChecklist) || [];
                                angular.forEach($scope.TempOrgASCChecklistLogs, function (kitem) {
                                    kitem.Remarks = kitem.Remarks || "";
                                    kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                                });

                                $scope.TempOrgASCChecklist = angular.copy(resp[1].data.rows[0].OrgASCChecklist) || [];
                                if ($scope.TempOrgASCChecklist.length>0) {
                                    angular.forEach($scope.TempOrgASCChecklist, function (kitem) {
                                        if (kitem.CheckListCategoryId == 18 || kitem.CheckListCategoryId == 19 || kitem.CheckListCategoryId == 20) {
                                            $scope.TempOrgASCChecklistDetails.push(kitem);
                                        }

                                    });
                                }
                            }

                            $scope.FemtotempObj.FemtoArcuateIncisions1 = resp[1].data.rows[0].FemtoArcuateIncisions1 || '';
                            $scope.LogObj.FemtoArcuateIncisions1 = resp[1].data.rows[0].FemtoArcuateIncisions1 || '';

                            $scope.FemtotempObj.IsFemtoArcuateIncisions1NA = resp[1].data.rows[0].IsFemtoArcuateIncisions1NA || false;
                            $scope.LogObj.IsFemtoArcuateIncisions1NA = resp[1].data.rows[0].IsFemtoArcuateIncisions1NA || false;

                            $scope.FemtotempObj.FemtoArcuateIncisions2 = resp[1].data.rows[0].FemtoArcuateIncisions2 || '';
                            $scope.LogObj.FemtoArcuateIncisions2 = resp[1].data.rows[0].FemtoArcuateIncisions2 || '';

                            $scope.FemtotempObj.IsFemtoArcuateIncisions2NA = resp[1].data.rows[0].IsFemtoArcuateIncisions2NA || false;
                            $scope.LogObj.IsFemtoArcuateIncisions2NA = resp[1].data.rows[0].IsFemtoArcuateIncisions2NA || false;

                            $scope.FemtotempObj.FemtoArcuateIncisionsNotes = resp[1].data.rows[0].FemtoArcuateIncisionsNotes || '';
                            $scope.LogObj.FemtoArcuateIncisionsNotes = resp[1].data.rows[0].FemtoArcuateIncisionsNotes || '';

                            $scope.FemtotempObj.FemtoTimeOut = resp[1].data.rows[0].FemtoTimeOut || '';
                            $scope.LogObj.FemtoTimeOut = resp[1].data.rows[0].FemtoTimeOut || '';

                            $scope.FemtotempObj.FemtoStartTime = resp[1].data.rows[0].FemtoStartTime || '';
                            $scope.LogObj.FemtoStartTime = resp[1].data.rows[0].FemtoStartTime || '';

                            $scope.FemtotempObj.FemtoEndTime = resp[1].data.rows[0].FemtoEndTime || '';
                            $scope.LogObj.FemtoEndTime = resp[1].data.rows[0].FemtoEndTime || '';

                            $scope.FemtotempObj.FemtoReferenceNo = resp[1].data.rows[0].FemtoReferenceNo || '';
                            $scope.LogObj.FemtoReferenceNo = resp[1].data.rows[0].FemtoReferenceNo || '';

                            $scope.FemtotempObj.FemtoLotNo = resp[1].data.rows[0].FemtoLotNo || '';
                            $scope.LogObj.FemtoLotNo = resp[1].data.rows[0].FemtoLotNo || '';

                            $scope.FemtotempObj.FemtoExpiryDate = resp[1].data.rows[0].FemtoExpiryDate || null;
                            $scope.LogObj.FemtoExpiryDate = resp[1].data.rows[0].FemtoExpiryDate || null;

                            $scope.FemtotempObj.FemtoOverAllNotes = resp[1].data.rows[0].FemtoOverAllNotes || '';
                            $scope.LogObj.FemtoOverAllNotes = resp[1].data.rows[0].FemtoOverAllNotes || '';

                            $scope.FemtotempObj.FemtNurseReviewedById = resp[1].data.rows[0].FemtNurseReviewedById || null;
                            $scope.LogObj.FemtNurseReviewedById = resp[1].data.rows[0].FemtNurseReviewedById || null;

                            $scope.FemtotempObj.FemtNurseReviewedByName = resp[1].data.rows[0].FemtNurseReviewedByName || '';
                            $scope.LogObj.FemtNurseReviewedByName = resp[1].data.rows[0].FemtNurseReviewedByName || '';

                            $scope.FemtotempObj.FemtDoctorReviewedById = resp[1].data.rows[0].FemtDoctorReviewedById || null;
                            $scope.LogObj.FemtDoctorReviewedById = resp[1].data.rows[0].FemtDoctorReviewedById || null;

                            $scope.FemtotempObj.FemtDoctorReviewedByName = resp[1].data.rows[0].FemtDoctorReviewedByName || '';
                            $scope.LogObj.FemtDoctorReviewedByName = resp[1].data.rows[0].FemtDoctorReviewedByName || '';

                            $scope.FemtotempObj.FemtDoctorReviewedByDate = resp[1].data.rows[0].FemtDoctorReviewedByDate || null;
                            $scope.LogObj.FemtDoctorReviewedByDate = resp[1].data.rows[0].FemtDoctorReviewedByDate || null;

                            $scope.FemtotempObj.FemtDoctorReviewedByTime = resp[1].data.rows[0].FemtDoctorReviewedByTime || '';
                            $scope.LogObj.FemtDoctorReviewedByTime = resp[1].data.rows[0].FemtDoctorReviewedByTime || '';

                            $scope.FemtotempObj.FemtAnesthesiaReviewedById = resp[1].data.rows[0].FemtoAnesthesiaReviewedById || null;
                            $scope.LogObj.FemtAnesthesiaReviewedById = resp[1].data.rows[0].FemtoAnesthesiaReviewedById || null;

                            $scope.FemtotempObj.FemtAnesthesiaReviewedByName = resp[1].data.rows[0].FemtoAnesthesiaReviewedByName || '';
                            $scope.LogObj.FemtAnesthesiaReviewedByName = resp[1].data.rows[0].FemtoAnesthesiaReviewedByName || '';

                            $scope.FemtotempObj.FemtNurseReviewedById = $scope.FemtotempObj.FemtNurseReviewedById || null;
                            $scope.FemtotempObj.FemtDoctorReviewedById = $scope.FemtotempObj.FemtDoctorReviewedById || null;
                            $scope.FemtotempObj.FemtAnesthesiaReviewedById = $scope.FemtotempObj.FemtAnesthesiaReviewedById || null;
                            if ($scope.FemtotempObj.FemtNurseReviewedById == null) {
                                $scope.FemtotempObj.FemtNurseReviewedByName = "";
                                $scope.LogObj.FemtNurseReviewedByName = "";
                            }
                            if ($scope.FemtotempObj.FemtDoctorReviewedById == null) {
                                $scope.FemtotempObj.FemtDoctorReviewedByName = "";
                                $scope.LogObj.FemtDoctorReviewedByName = "";
                            }
                            if ($scope.FemtotempObj.FemtAnesthesiaReviewedById == null) {
                                $scope.FemtotempObj.FemtAnesthesiaReviewedByName = "";
                                $scope.LogObj.FemtAnesthesiaReviewedByName = "";
                            }
                            if ($scope.FemtotempObj.FemtoArcuateIncisionsNotes !== '') {
                                $scope.FemtotempObj.FemtoArcuateNotesInd = true;
                            } else {
                                $scope.FemtotempObj.FemtoArcuateNotesInd = false;
                            }

                            if ($scope.FemtotempObj.FemtoExpiryDate !== null) {
                                $scope.FemtotempObj.FemtoExpiryDate = $filter("date")($scope.FemtotempObj.FemtoExpiryDate, "MM-dd-yyyy") || null;
                            }
                            if ($scope.FemtotempObj.FemtDoctorReviewedByDate !== null) {
                                $scope.FemtotempObj.FemtDoctorReviewedByDate = $filter("date")($scope.FemtotempObj.FemtDoctorReviewedByDate, "MM-dd-yyyy") || null;
                            }

                        $scope.IntraOrgAscChecklist = [];
                        if ($scope.TempOrgASCChecklistDetails.length > 0) {
                            angular.forEach($scope.TempOrgASCChecklistDetails, function (kitem) {
                                if (kitem.CheckListCategoryId == 18) {
                                    $scope.IntraOrgAscChecklist.push(kitem);
                                }

                            });
                        }
                        if ($scope.IntraOrgAscChecklist.length > 0 || $scope.FemtotempObj.FemtoArcuateIncisions1 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || $scope.FemtotempObj.FemtoArcuateIncisions2 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || $scope.FemtotempObj.FemtoTimeOut !== '' || $scope.FemtotempObj.FemtoStartTime !== '' || $scope.FemtotempObj.FemtoEndTime !== '' || $scope.FemtotempObj.FemtoReferenceNo !== ''
                            || $scope.FemtotempObj.FemtoLotNo !== '' || $scope.FemtotempObj.FemtoExpiryDate !== null || $scope.FemtotempObj.DoctorFireRiskID !== null || $scope.FemtotempObj.AnesthetistFireRiskID !== null || $scope.FemtotempObj.NurseFireRiskID !== null || $scope.FemtotempObj.RiskLevel !== '') {
                            $scope.FemtotempObj.IfIntraFemtoTemplateDataAdded = true;
                        } else {
                            $scope.FemtotempObj.IfIntraFemtoTemplateDataAdded = false;
                        }

                        $scope.FemtotempObj.RiskLevel = resp[1].data.rows[0].RiskLevel || "";

                        $scope.FemtotempObj.AnesthetistFireRiskID = resp[1].data.rows[0].AnesthetistFireRiskID || null;
                        $scope.LogObj.AnesthetistFireRiskID = resp[1].data.rows[0].AnesthetistFireRiskID || null;

                        $scope.FemtotempObj.AnesthetistFireRiskName = resp[1].data.rows[0].AnesthetistFireRiskName || "";
                        $scope.LogObj.AnesthetistFireRiskName = resp[1].data.rows[0].AnesthetistFireRiskName || "";

                        $scope.FemtotempObj.AnesthetistFireRiskLicenseNo = resp[1].data.rows[0].AnesthetistFireRiskLicenseNo || null;
                        $scope.LogObj.AnesthetistFireRiskLicenseNo = resp[1].data.rows[0].AnesthetistFireRiskLicenseNo || null;

                        $scope.FemtotempObj.AnesthetistReviewdDate = resp[1].data.rows[0].AnesthetistReviewdDate || null;
                        $scope.LogObj.AnesthetistReviewdDate = resp[1].data.rows[0].AnesthetistReviewdDate || null;

                        $scope.FemtotempObj.DoctorFireRiskID = resp[1].data.rows[0].DoctorFireRiskID || null;
                        $scope.LogObj.DoctorFireRiskID = resp[1].data.rows[0].DoctorFireRiskID || null;

                        $scope.FemtotempObj.DoctorFireRiskName = resp[1].data.rows[0].DoctorFireRiskName || "";
                        $scope.LogObj.DoctorFireRiskName = resp[1].data.rows[0].DoctorFireRiskName || "";

                        $scope.FemtotempObj.DoctorFireRiskLicenseNo = resp[1].data.rows[0].DoctorFireRiskLicenseNo || null;
                        $scope.LogObj.DoctorFireRiskLicenseNo = resp[1].data.rows[0].DoctorFireRiskLicenseNo || null;

                        $scope.FemtotempObj.DoctorReviewdDate = resp[1].data.rows[0].DoctorReviewdDate || null;
                        $scope.LogObj.DoctorReviewdDate = resp[1].data.rows[0].DoctorReviewdDate || null;

                        $scope.FemtotempObj.NurseFireRiskID = resp[1].data.rows[0].NurseFireRiskID || null;
                        $scope.LogObj.NurseFireRiskID = resp[1].data.rows[0].NurseFireRiskID || null;

                        $scope.FemtotempObj.NurseFireRiskName = resp[1].data.rows[0].NurseFireRiskName || "";
                        $scope.LogObj.NurseFireRiskName = resp[1].data.rows[0].NurseFireRiskName || "";

                        $scope.FemtotempObj.NurseFireRiskLicenseNo = resp[1].data.rows[0].NurseFireRiskLicenseNo || null;
                        $scope.LogObj.NurseFireRiskLicenseNo = resp[1].data.rows[0].NurseFireRiskLicenseNo || null;

                        $scope.FemtotempObj.NurseFireRiskReviewdDate = resp[1].data.rows[0].NurseFireRiskReviewdDate || null;
                        $scope.LogObj.NurseFireRiskReviewdDate = resp[1].data.rows[0].NurseFireRiskReviewdDate || null;

                        if ($scope.FemtotempObj.OrgASCChecklist.length > 0) {
                            angular.forEach($scope.FemtotempObj.OrgASCChecklist, function (Item) {
                                if (Item.CheckListId == 571 && Item.IsChecked) {
                                    $scope.FemtotempObj.IsShowAnesthetistReviewByinFireRisk = true;
                                }
                                if (Item.CheckListId == 572 && Item.IsChecked) {
                                    $scope.FemtotempObj.IsShowDoctorReviewByinFireRisk = true;
                                }
                            });
                        }

                        if ($scope.TempOrgASCChecklistDetails.length > 0 || $scope.FemtotempObj.FemtoArcuateIncisions1 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || $scope.FemtotempObj.FemtoArcuateIncisions2 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || $scope.FemtotempObj.FemtoTimeOut !== '' || $scope.FemtotempObj.FemtoStartTime !== '' || $scope.FemtotempObj.FemtoEndTime !== '' || $scope.FemtotempObj.FemtoReferenceNo !== ''
                            || $scope.FemtotempObj.FemtoLotNo !== '' || $scope.FemtotempObj.FemtoExpiryDate !== null || $scope.FemtotempObj.FemtoOverAllNotes !== '' || $scope.FemtotempObj.FemtNurseReviewedById !== null || $scope.FemtotempObj.FemtDoctorReviewedById !== null || $scope.FemtotempObj.FemtDoctorReviewedByDate !== null || $scope.FemtotempObj.FemtDoctorReviewedByTime !== '' || $scope.FemtotempObj.FemtAnesthesiaReviewedById !== null || $scope.FemtotempObj.DoctorFireRiskID !== null || $scope.FemtotempObj.AnesthetistFireRiskID !== null || $scope.FemtotempObj.NurseFireRiskID !== null || $scope.FemtotempObj.RiskLevel !== '') {
                            $scope.FemtotempObj.IfFemtoTemplateDataAdded = true;
                        } else {
                            $scope.FemtotempObj.IfFemtoTemplateDataAdded = false;
                        }

                    }
                }
            });
        };
        $scope.init();

        $scope.GetOrganizationASCCheckListData = function () {
            let req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "CheckListModuleId": 1,
                "GetAllIndicator": 1
            };
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.FemtotempObj.OrgASCChecklist = resp.data.rows;
                    angular.forEach($scope.FemtotempObj.OrgASCChecklist, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                    });


                }

            }, function (err) {
                console.log(err);
            });

        };
     //   $scope.GetOrganizationASCCheckListData();
        $scope.OnClickFemtoNA = function (Type) {
            if (Type == 1) {
                if ($scope.FemtotempObj.IsFemtoArcuateIncisions1NA) {
                    $scope.FemtotempObj.IsFemtoArcuateIncisions1NA = false;
                } else {
                    $scope.FemtotempObj.IsFemtoArcuateIncisions1NA = true;
                    $scope.FemtotempObj.FemtoArcuateIncisions1 = '';
                }
            } else {
                if ($scope.FemtotempObj.IsFemtoArcuateIncisions2NA) {
                    $scope.FemtotempObj.IsFemtoArcuateIncisions2NA = false;
                } else {
                    $scope.FemtotempObj.IsFemtoArcuateIncisions2NA = true;
                    $scope.FemtotempObj.FemtoArcuateIncisions2 = '';
                }
            }
        };

        $scope.ChangeFemtoArcuatedata = function (Type) {
            if (Type == 1) {
                $scope.FemtotempObj.IsFemtoArcuateIncisions1NA = false;
            } else {
                $scope.FemtotempObj.IsFemtoArcuateIncisions2NA = false;
            }
        };
        $scope.ChangeAnesthesiaReviewedBy = function (Id) {
            var TempArray = $filter('filter')($scope.AnesthetistReviewedByArray, { 'DoctorID': Id }, true);
            if (TempArray.length > 0) {
                TempArray[0].SuffixName = TempArray[0].SuffixName || '';
                TempArray[0].LicenseNumber = TempArray[0].LicenseNumber || '';

                var Lic = '';
                if (TempArray[0].LicenseNumber !== '') {
                    Lic = 'Lic : ' + TempArray[0].LicenseNumber;
                }
                $scope.FemtotempObj.FemtAnesthesiaReviewedById = TempArray[0].DoctorID;
                $scope.FemtotempObj.FemtAnesthesiaReviewedByName = TempArray[0].FullName + '  ' + TempArray[0].SuffixName + '   ' + Lic;
            }
        };
        $scope.ChangeNurseReviewedBy = function (Id) {
            var TempArray = $filter('filter')($scope.ReviewedByArray, { 'DoctorID': Id }, true);
            if (TempArray.length > 0) {
                TempArray[0].SuffixName = TempArray[0].SuffixName || '';
                TempArray[0].LicenseNumber = TempArray[0].LicenseNumber || '';

                var Lic = '';
                if (TempArray[0].LicenseNumber !== '') {
                    Lic = 'Lic : ' + TempArray[0].LicenseNumber;
                }
                $scope.FemtotempObj.FemtNurseReviewedById = TempArray[0].DoctorID;
                $scope.FemtotempObj.FemtNurseReviewedByName = TempArray[0].FullName + '  ' + TempArray[0].SuffixName + '   ' + Lic;
            }
        };
        $scope.ChangeDoctorReviewedBy = function (Id) {
            var TempArray = $filter('filter')($scope.SurgeonArray, { 'DoctorID': Id }, true);
            if (TempArray.length > 0) {
                TempArray[0].SuffixName = TempArray[0].SuffixName || '';
                TempArray[0].LicenseNumber = TempArray[0].LicenseNumber || '';
                var Lic = '';
                if (TempArray[0].LicenseNumber !== '') {
                    Lic = 'Lic : ' + TempArray[0].LicenseNumber;
                }

                $scope.FemtotempObj.FemtDoctorReviewedById = TempArray[0].DoctorID;
                $scope.FemtotempObj.FemtDoctorReviewedByName = TempArray[0].FullName + '  ' + TempArray[0].SuffixName + '   ' + Lic;
            }

            if (Id !== null) {
                $scope.FemtotempObj.FemtDoctorReviewedByDate = $filter('date')(new Date(), "MM-dd-yyyy");
                $scope.FemtotempObj.FemtDoctorReviewedByTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                $scope.FemtotempObj.FemtDoctorReviewedByDate = null;
                $scope.FemtotempObj.FemtDoctorReviewedByTime = '';
            }
        };
        $scope.GetFemtoTimeOut = function () {
            $scope.FemtotempObj.FemtoTimeOut = $filter('date')(new Date(), "hh:mm a");
        };
        $scope.GetFemtoStartTime = function () {
            $scope.FemtotempObj.FemtoStartTime = $filter('date')(new Date(), "hh:mm a");
        };
        $scope.GetFemtoEndTime = function () {
            $scope.FemtotempObj.FemtoEndTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.findDifferences = function (savedArray, editedArray) {
            var differences = [];

            angular.forEach(savedArray, function (item) {
                item.ChecklistDate = item.ChecklistDate || null;
                item.Remarks = item.Remarks || '';
                item.DeleteInd = item.DeleteInd || 'N';
                var edited = editedArray.filter(function (eitem) {
                    eitem.ChecklistDate = eitem.ChecklistDate || null;
                    eitem.Remarks = eitem.Remarks || '';
                    eitem.DeleteInd = eitem.DeleteInd || 'N';
                    return ((eitem.CheckListCategoryId == item.CheckListCategoryId) && (item.CheckListId == eitem.CheckListId) && (item.Value == eitem.Value) && (item.Remarks == eitem.Remarks) && (item.ChecklistDate == eitem.ChecklistDate) && (item.DeleteInd == eitem.DeleteInd));
                }) || [];


                if (edited.length == 0) {
                    differences.push({
                        CheckListCategoryId: item.CheckListCategoryId,
                        CheckListId: item.CheckListId,
                        savedValue: item.Value,
                        CheckListName: item.CheckListName,
                        DeleteInd: item.DeleteInd,
                        Remarks: item.Remarks,
                    });
                    /*count++;*/
                }

            });

            return differences;
        };


        $scope.ChangeSubTab = function (val, type) {

            if (type == 'Prefemto') {
                $scope.FemtotabObj.FemtoTAB = 1;
            }

            if (type == 'Intrafemto') {
                $scope.FemtotabObj.FemtoTAB = 2;
            }

            if (type == 'Postfemto') {
                $scope.FemtotabObj.FemtoTAB = 3;
            }
        }
        $scope.OnPreOpChecklistSelect = function (obj, parentobj) {
            var CheckListInd = false;
            angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {
                if (obj.IsChecked == true && item.Value == obj.Value) {
                    CheckListInd = true;
                    parentobj.PatientAscCheckListDetailId = parentobj.PatientAscCheckListDetailId || null;
                    if (parentobj.PatientAscCheckListDetailId != null) {
                        item.DeleteInd = "Y";
                    }
                } else {
                    item.IsChecked = false;
                    //item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                    //if (item.PatientAscCheckListDetailId != null) {
                    //    item.DeleteInd = "Y";
                    //}
                }
            })

            if (CheckListInd == true) {
                obj.IsChecked = false;
                parentobj.IsChecked = false;



            } else {
                obj.IsChecked = true;
              // obj.DeleteInd = 'N';
                parentobj.IsChecked = true;
                if (parentobj.Value == "Others") {
                    parentobj.Remarks = "";
                }
                parentobj.Value = obj.Value || '';
                parentobj.ChecklistDate = null;
            }

            
        };


        $scope.uibclose = function () {
            $uibModalInstance.close("cancel");
        };
        $scope.FemtotempObj.IsClickSaveFemtoBtn = false;
        $scope.SaveFemtoTemplateData = function () {
            $scope.LogObj.LogArray = [];
            let OrgASCChecklist = [];
            angular.forEach($scope.FemtotempObj.OrgASCChecklist, function (item) {
                item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;

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
                            "ChecklistDate": item.ChecklistDate || null,
                            "Remarks": item.Remarks || "",
                            "Score": item.Score || 0,
                            "SubCheckList": [],
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
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Intra-Femto",
                        "ActionType": "Edited",
                        "OldActionDescription": `Fire Risk Assessment  in Femto intra-op For appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
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
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Intra-Femto",
                        "ActionType": "Added",
                        "NewActionDescription": `Fire Risk Assessment  in Femto intra-op  For appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.FemtotempObj.NurseFireRiskID != null) {
                let editStatusReviewedcount = 0;
                let ActionType = ''
                var Newvalue = '';
                var OldValue = '';

                if ($scope.LogObj.NurseFireRiskID == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.FemtotempObj.NurseFireRiskID != $scope.LogObj.NurseFireRiskID) {
                    editStatusReviewedcount++;
                }
                if ($scope.FemtotempObj.NurseFireRiskID != $scope.LogObj.NurseFireRiskID) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';
                    let NewSurgeon = $filter("filter")($scope.FemtotempObj.NurseArray, function (item) {
                        return item.DoctorID == $scope.FemtotempObj.NurseFireRiskID;
                    });
                    if (NewSurgeon.length > 0) {
                        NewAffecteditem = `Fire Risk Assessment Nurse Reviewed By : ${NewSurgeon[0].FullName}`;
                        Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                    }
                    let OldSurgeon = $filter("filter")($scope.FemtotempObj.NurseArray, function (item) {
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
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Intra-Femto",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.FemtotempObj.AnesthetistFireRiskID != null) {
                let editStatusReviewedcount = 0;
                let ActionType = '';
                var Newvalue = '';
                var OldValue = '';

                if ($scope.LogObj.AnesthetistFireRiskID == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.FemtotempObj.AnesthetistFireRiskID != $scope.LogObj.AnesthetistFireRiskID) {
                    editStatusReviewedcount++;
                }


                if ($scope.FemtotempObj.AnesthetistFireRiskID != $scope.LogObj.AnesthetistFireRiskID) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';
                    let NewSurgeon = $filter("filter")($scope.FemtotempObj.AnesthesiologistArray, function (item) {
                        return item.DoctorID == $scope.FemtotempObj.AnesthetistFireRiskID;
                    });
                    if (NewSurgeon.length > 0) {
                        NewAffecteditem = `Fire Risk Assessment Anesthesiologist Reviewed By  : ${NewSurgeon[0].FullName}`;
                        Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                    }
                    let OldSurgeon = $filter("filter")($scope.FemtotempObj.AnesthesiologistArray, function (item) {
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
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Intra-Femto",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.FemtotempObj.DoctorFireRiskID != null) {
                let editStatusReviewedcount = 0;
                let ActionType = '';
                var Newvalue = '';
                var OldValue = '';

                if ($scope.LogObj.DoctorFireRiskID == null) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }

                if ($scope.FemtotempObj.DoctorFireRiskID != $scope.LogObj.DoctorFireRiskID) {
                    editStatusReviewedcount++;
                }

                if ($scope.FemtotempObj.DoctorFireRiskID != $scope.LogObj.DoctorFireRiskID) {
                    let NewAffecteditem = '';
                    let OldAffecteditem = '';
                    let NewSurgeon = $filter("filter")($scope.FemtotempObj.DoctorArray, function (item) {
                        return item.DoctorID == $scope.FemtotempObj.DoctorFireRiskID;
                    });
                    if (NewSurgeon.length > 0) {
                        NewAffecteditem = `Fire Risk Assessment Surgeon Reviewed By : ${NewSurgeon[0].FullName}`;
                        Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                    }
                    let OldSurgeon = $filter("filter")($scope.FemtotempObj.DoctorArray, function (item) {
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
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Intra-Femto",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": Newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            let submitObj = {
                "VisitId": $scope.cacheStorageItem.PatientVisitId,

                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PatientASCPreOPId": $scope.FemtotempObj.PatientASCPreOPId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "UserId": $scope.UserId || null,
                "HospitalId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "OrgASCChecklist": OrgASCChecklist || [],
                "FemtoArcuateIncisions1": $scope.FemtotempObj.FemtoArcuateIncisions1 || '',
                "IsFemtoArcuateIncisions1NA": $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || false,
                "FemtoArcuateIncisions2": $scope.FemtotempObj.FemtoArcuateIncisions2 || '',
                "IsFemtoArcuateIncisions2NA": $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || false,
                "FemtoArcuateIncisionsNotes": $scope.FemtotempObj.FemtoArcuateIncisionsNotes || '',
                "FemtoTimeOut": $scope.FemtotempObj.FemtoTimeOut || '',
                "FemtoStartTime": $scope.FemtotempObj.FemtoStartTime || '',
                "FemtoEndTime": $scope.FemtotempObj.FemtoEndTime || '',
                "FemtoReferenceNo": $scope.FemtotempObj.FemtoReferenceNo || '',
                "FemtoLotNo": $scope.FemtotempObj.FemtoLotNo || '',
                "FemtoExpiryDate": $scope.FemtotempObj.FemtoExpiryDate || null,
                "FemtoOverAllNotes": $scope.FemtotempObj.FemtoOverAllNotes || '',
                "FemtNurseReviewedById": $scope.FemtotempObj.FemtNurseReviewedById || null,
                "FemtNurseReviewedByName": $scope.FemtotempObj.FemtNurseReviewedByName || '',
                "FemtDoctorReviewedById": $scope.FemtotempObj.FemtDoctorReviewedById || null,
                "FemtDoctorReviewedByName": $scope.FemtotempObj.FemtDoctorReviewedByName || '',
                "FemtDoctorReviewedByDate": $scope.FemtotempObj.FemtDoctorReviewedByDate || null,
                "FemtDoctorReviewedByTime": $scope.FemtotempObj.FemtDoctorReviewedByTime || '',
                "FemtAnesthesiaReviewedById": $scope.FemtotempObj.FemtAnesthesiaReviewedById || null,
                "FemtAnesthesiaReviewedByName": $scope.FemtotempObj.FemtAnesthesiaReviewedByName || '',
                "AnesthetistFireRiskID": $scope.FemtotempObj.AnesthetistFireRiskID || null,
                "DoctorFireRiskID": $scope.FemtotempObj.DoctorFireRiskID || null,
                "NurseFireRiskID": $scope.FemtotempObj.NurseFireRiskID || null,
                "RiskLevel": $scope.FemtotempObj.RiskLevel || '',
                "NurseFireRiskReviewdDate": $scope.FemtotempObj.NurseFireRiskReviewdDate || null,
                "AnesthetistReviewdDate": $scope.FemtotempObj.AnesthetistReviewdDate || null,
                "DoctorReviewdDate": $scope.FemtotempObj.DoctorReviewdDate || null,
                "IsFemtoDataAdded": true,
                "Logs": {},
            }
            let editPrefemtoChecklist = [];
            let editIntrafemtoChecklist = [];
            let editPostfemtoChecklist = [];

            let PrefemtoChecklist = [];
            let IntrafemtoChecklist = [];
            let postfemtoChecklist = [];

            PrefemtoChecklist = $filter("filter")(OrgASCChecklist, { "CheckListCategoryId": 19 }, true) || [];
            IntrafemtoChecklist = $filter("filter")(OrgASCChecklist, { "CheckListCategoryId": 18 }, true) || [];
            postfemtoChecklist = $filter("filter")(OrgASCChecklist, { "CheckListCategoryId": 20 }, true) || [];

            editPrefemtoChecklist = $filter("filter")($scope.TempOrgASCChecklistLogs, { "CheckListCategoryId": 19 }, true) || [];
            var IsUserAlreadyAddedthisList = $filter("filter")(editPrefemtoChecklist, { "CreatedBy": $scope.UserId }, true) || [];

            if (editPrefemtoChecklist.length > 0) {
                $scope.differences = $scope.findDifferences(PrefemtoChecklist, editPrefemtoChecklist) || [];
                if ($scope.differences.length > 0) {

                    var NewValue = '';
                    var OldValue = '';
                    angular.forEach($scope.differences, function (itemA) {
                        if (itemA.DeleteInd == 'N') {
                            if (NewValue !== '') {
                                NewValue += '\n ';
                            }
                            NewValue += `${itemA.CheckListName}: ${itemA.savedValue}`;
                        }

                        angular.forEach(editPrefemtoChecklist, function (itemB) {
                            if (itemA.CheckListId === itemB.CheckListId && itemB.DeleteInd == 'N') {
                                if (OldValue !== '') {
                                    OldValue += '\n ';
                                }
                                OldValue += `${itemB.CheckListName}: ${itemB.Value}`;
                            }
                        });
                    });
                    var ActionType = "Edited";
                    if (IsUserAlreadyAddedthisList.length === 0 && OldValue === '') {
                        ActionType = "Added";
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Pre-Femto",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (PrefemtoChecklist.length > 0) {
                var ActionDescription = '';
                angular.forEach(PrefemtoChecklist, function (itemA) {
                    if (itemA.PatientAscCheckListDetailId === 0) {
                        if (ActionDescription !== '') {
                            ActionDescription += ', ';
                        }
                        ActionDescription += `${itemA.CheckListName}: ${itemA.Value}`;
                    }
                });
                if (ActionDescription != '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Pre-Femto",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": ActionDescription,
                        //"ActionDescription": `Femto Template Checklist in Pre-Op For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            editIntrafemtoChecklist = $filter("filter")($scope.TempOrgASCChecklistLogs, { "CheckListCategoryId": 18 }, true) || [];
            $scope.FemtotempObj.FemtoLotNo = $scope.FemtotempObj.FemtoLotNo || '';
            $scope.LogObj.FemtoLotNo = $scope.LogObj.FemtoLotNo || '';
            $scope.FemtotempObj.FemtoArcuateIncisions1 = $scope.FemtotempObj.FemtoArcuateIncisions1 || '';
            $scope.LogObj.FemtoArcuateIncisions1 = $scope.LogObj.FemtoArcuateIncisions1 || '';
            $scope.FemtotempObj.IsFemtoArcuateIncisions1NA = $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || false;
            $scope.LogObj.IsFemtoArcuateIncisions1NA = $scope.LogObj.IsFemtoArcuateIncisions1NA  || false;

            $scope.FemtotempObj.FemtoArcuateIncisions2 = $scope.FemtotempObj.FemtoArcuateIncisions2 || '';
            $scope.LogObj.FemtoArcuateIncisions2 = $scope.LogObj.FemtoArcuateIncisions2|| '';

            $scope.FemtotempObj.IsFemtoArcuateIncisions2NA = $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || false;
            $scope.LogObj.IsFemtoArcuateIncisions2NA = $scope.LogObj.IsFemtoArcuateIncisions2NA || false;
            $scope.FemtotempObj.FemtoArcuateIncisionsNotes = $scope.FemtotempObj.FemtoArcuateIncisionsNotes || '';
            $scope.LogObj.FemtoArcuateIncisionsNotes = $scope.LogObj.FemtoArcuateIncisionsNotes || '';

            $scope.FemtotempObj.FemtoTimeOut = $scope.FemtotempObj.FemtoTimeOut || '';
            $scope.LogObj.FemtoTimeOut = $scope.LogObj.FemtoTimeOut || '';

            $scope.FemtotempObj.FemtoStartTime = $scope.FemtotempObj.FemtoStartTime || '';
            $scope.LogObj.FemtoStartTime = $scope.LogObj.FemtoStartTime  || '';

            $scope.FemtotempObj.FemtoEndTime = $scope.FemtotempObj.FemtoEndTime  || '';
            $scope.LogObj.FemtoEndTime = $scope.LogObj.FemtoEndTime|| '';

            $scope.FemtotempObj.FemtoReferenceNo = $scope.FemtotempObj.FemtoReferenceNo  || '';
            $scope.LogObj.FemtoReferenceNo = $scope.LogObj.FemtoReferenceNo || '';

            $scope.FemtotempObj.FemtoExpiryDate = $scope.FemtotempObj.FemtoExpiryDate || null;
            $scope.LogObj.FemtoExpiryDate = $scope.LogObj.FemtoExpiryDate || null;
            if ($scope.LogObj.FemtoExpiryDate != null) {
                $scope.LogObj.FemtoExpiryDate = $filter('date')(new Date($scope.LogObj.FemtoExpiryDate), 'MM-dd-yyyy');
            }
            var IsUserAlreadyAddedthisIntraList = $filter("filter")(editIntrafemtoChecklist, { "CreatedBy": $scope.UserId }, true) || [];

            if (editIntrafemtoChecklist.length > 0 || $scope.LogObj.FemtoLotNo != '' || $scope.LogObj.FemtoArcuateIncisions1 !== '' || $scope.LogObj.IsFemtoArcuateIncisions1NA !== null || $scope.LogObj.FemtoArcuateIncisions2 !== '' || $scope.LogObj.IsFemtoArcuateIncisions2NA !== null || $scope.LogObj.FemtoArcuateIncisionsNotes != '' || $scope.LogObj.FemtoTimeOut != '' || $scope.LogObj.FemtoStartTime != '' || $scope.LogObj.FemtoEndTime != '' || $scope.LogObj.FemtoReferenceNo != '' || $scope.LogObj.FemtoExpiryDate!=null) {


                $scope.differences = $scope.findDifferences(IntrafemtoChecklist, editIntrafemtoChecklist) || [];
                let PCCount = 0;
                var NewValue = '';
                var OldValue = '';
                if ($scope.differences.length > 0) {
                    angular.forEach($scope.differences, function (itemA) {
                        if (itemA.DeleteInd == 'N') {
                            if (NewValue !== '') {
                                NewValue += '\n ';
                            }
                            NewValue += `${itemA.CheckListName}: ${itemA.savedValue}`;
                        }

                        angular.forEach(editIntrafemtoChecklist, function (itemB) {
                            if (itemA.CheckListId === itemB.CheckListId && itemB.DeleteInd == 'N') {
                                if (OldValue !== '') {
                                    OldValue += '\n ';
                                }
                                OldValue += `${itemB.CheckListName}: ${itemB.Value}`;
                            }
                        });
                    });
                    PCCount++;
                }

                if ($scope.LogObj.FemtoArcuateIncisions1 != $scope.FemtotempObj.FemtoArcuateIncisions1) {
                    if ($scope.FemtotempObj.FemtoArcuateIncisions1)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions1: ${$scope.FemtotempObj.FemtoArcuateIncisions1}`;
                    if ($scope.LogObj.FemtoArcuateIncisions1)
                        OldValue += `${OldValue ? '\n' : ''}Arcuate Incisions1: ${$scope.LogObj.FemtoArcuateIncisions1}`;
                    PCCount++
                }
                if ($scope.LogObj.IsFemtoArcuateIncisions1NA != $scope.FemtotempObj.IsFemtoArcuateIncisions1NA) {
                    if ($scope.FemtotempObj.IsFemtoArcuateIncisions1NA)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions1: N/A `;
                    if ($scope.LogObj.IsFemtoArcuateIncisions1NA)
                        OldValue += `${OldValue ? '\n' : ''}Arcuate Incisions1: N/A :`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoArcuateIncisions2 != $scope.FemtotempObj.FemtoArcuateIncisions2) {
                    if ($scope.FemtotempObj.FemtoArcuateIncisions2)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions2: ${$scope.FemtotempObj.FemtoArcuateIncisions2}`;
                    if ($scope.LogObj.FemtoArcuateIncisions2)
                        OldValue += `${OldValue ? '\n' : ''}Arcuate Incisions2: ${$scope.LogObj.FemtoArcuateIncisions2}`;
                    PCCount++
                }
                if ($scope.LogObj.IsFemtoArcuateIncisions2NA != $scope.FemtotempObj.IsFemtoArcuateIncisions2NA) {
                    if ($scope.FemtotempObj.IsFemtoArcuateIncisions2NA)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions2: N/A `;
                    if ($scope.LogObj.IsFemtoArcuateIncisions2NA)
                        OldValue += `${OldValue ? '\n' : ''}Arcuate Incisions2: N/A :`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoTimeOut != $scope.FemtotempObj.FemtoTimeOut) {
                    if ($scope.FemtotempObj.FemtoTimeOut)
                        NewValue += `${NewValue ? '\n ' : ''}Time Out: ${$scope.FemtotempObj.FemtoTimeOut}`;
                    if ($scope.LogObj.FemtoTimeOut)
                        OldValue += `${OldValue ? '\n' : ''}Time Out: ${$scope.LogObj.FemtoTimeOut}`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoStartTime != $scope.FemtotempObj.FemtoStartTime) {
                    if ($scope.FemtotempObj.FemtoStartTime)
                        NewValue += `${NewValue ? '\n ' : ''}Start Time: ${$scope.FemtotempObj.FemtoStartTime}`;
                    if ($scope.LogObj.FemtoStartTime)
                        OldValue += `${OldValue ? '\n' : ''}Start Time: ${$scope.LogObj.FemtoStartTime}`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoEndTime != $scope.FemtotempObj.FemtoEndTime) {
                    if ($scope.FemtotempObj.FemtoEndTime)
                        NewValue += `${NewValue ? '\n ' : ''}End Time: ${$scope.FemtotempObj.FemtoEndTime}`;
                    if ($scope.LogObj.FemtoEndTime)
                        OldValue += `${OldValue ? '\n' : ''}End Time: ${$scope.LogObj.FemtoEndTime}`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoReferenceNo != $scope.FemtotempObj.FemtoReferenceNo) {
                    if ($scope.FemtotempObj.FemtoReferenceNo)
                        NewValue += `${NewValue ? '\n ' : ''}Reference No: ${$scope.FemtotempObj.FemtoReferenceNo}`;
                    if ($scope.LogObj.FemtoReferenceNo)
                        OldValue += `${OldValue ? '\n' : ''}Reference No: ${$scope.LogObj.FemtoReferenceNo}`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoLotNo != $scope.FemtotempObj.FemtoLotNo) {
                    if ($scope.FemtotempObj.FemtoLotNo)
                        NewValue += `${NewValue ? '\n ' : ''}Lot No: ${$scope.FemtotempObj.FemtoLotNo}`;
                    if ($scope.LogObj.FemtoLotNo)
                        OldValue += `${OldValue ? '\n' : ''}Lot No: ${$scope.LogObj.FemtoLotNo}`;
                    PCCount++
                }
             
                if ($scope.LogObj.FemtoArcuateIncisionsNotes != $scope.FemtotempObj.FemtoArcuateIncisionsNotes) {
                    if ($scope.FemtotempObj.FemtoArcuateIncisionsNotes)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions Notes: ${$scope.FemtotempObj.FemtoArcuateIncisionsNotes}`;
                    if ($scope.LogObj.FemtoArcuateIncisionsNotes)
                        OldValue += `${OldValue ? '\n' : ''}Arcuate Incisions Notes: ${$scope.LogObj.FemtoArcuateIncisionsNotes}`;
                    PCCount++
                }
              
              
                if ($scope.LogObj.FemtoExpiryDate != $scope.FemtotempObj.FemtoExpiryDate) {
                    if ($scope.FemtotempObj.FemtoExpiryDate) {
                        NewValue += `${NewValue ? '\n ' : ''}Expiry Date: ${$filter('date')($scope.FemtotempObj.FemtoExpiryDate, 'MM-dd-yyyy')}`;
                    }
                    if ($scope.LogObj.FemtoExpiryDate) {
                        OldValue += `${OldValue ? '\n' : ''}Expiry Date: ${$filter('date')($scope.LogObj.FemtoExpiryDate, 'MM-dd-yyyy')}`;
                    }
                    PCCount++
                }
                var ActionType = "Edited";
                if (IsUserAlreadyAddedthisIntraList.length === 0 && OldValue === '') {
                    ActionType = "Added";
                }
                if (PCCount != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Intra-Femto",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (IntrafemtoChecklist.length > 0 || $scope.FemtotempObj.FemtoLotNo != '' || $scope.FemtotempObj.FemtoArcuateIncisions1 != '' || $scope.FemtotempObj.IsFemtoArcuateIncisions1NA !== null || $scope.FemtotempObj.FemtoArcuateIncisions2 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions2NA != null || $scope.FemtotempObj.FemtoArcuateIncisionsNotes != '' || $scope.FemtotempObj.FemtoTimeOut != '' || $scope.FemtotempObj.FemtoStartTime != '' || $scope.FemtotempObj.FemtoEndTime != '' || $scope.FemtotempObj.FemtoReferenceNo != '' || $scope.FemtotempObj.FemtoExpiryDate!=null) {
                var NewValue = '';
                angular.forEach(IntrafemtoChecklist, function (itemA) {
                    if (itemA.PatientAscCheckListDetailId === 0) {
                        if (NewValue !== '') {
                            NewValue += '\n ';
                        }
                        NewValue += `${itemA.CheckListName}: ${itemA.Value}`;
                    }
                });

                if ($scope.LogObj.FemtoArcuateIncisions1 != $scope.FemtotempObj.FemtoArcuateIncisions1) {
                    if ($scope.FemtotempObj.FemtoArcuateIncisions1)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions1: ${$scope.FemtotempObj.FemtoArcuateIncisions1}`;
                 
                }
                if ($scope.LogObj.IsFemtoArcuateIncisions1NA != $scope.FemtotempObj.IsFemtoArcuateIncisions1NA) {
                    if ($scope.FemtotempObj.IsFemtoArcuateIncisions1NA)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions1: N/A `;
                }
                if ($scope.LogObj.FemtoArcuateIncisions2 != $scope.FemtotempObj.FemtoArcuateIncisions2) {
                    if ($scope.FemtotempObj.FemtoArcuateIncisions2)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions2: ${$scope.FemtotempObj.FemtoArcuateIncisions2}`;
                }
                if ($scope.LogObj.IsFemtoArcuateIncisions2NA != $scope.FemtotempObj.IsFemtoArcuateIncisions2NA) {
                    if ($scope.FemtotempObj.IsFemtoArcuateIncisions2NA)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions2: N/A `;
                }
                if ($scope.LogObj.FemtoTimeOut != $scope.FemtotempObj.FemtoTimeOut) {
                    if ($scope.FemtotempObj.FemtoTimeOut)
                        NewValue += `${NewValue ? '\n ' : ''}Time Out: ${$scope.FemtotempObj.FemtoTimeOut}`;
                }
                if ($scope.LogObj.FemtoStartTime != $scope.FemtotempObj.FemtoStartTime) {
                    if ($scope.FemtotempObj.FemtoStartTime)
                        NewValue += `${NewValue ? '\n ' : ''}Start Time: ${$scope.FemtotempObj.FemtoStartTime}`;
                }
                if ($scope.LogObj.FemtoEndTime != $scope.FemtotempObj.FemtoEndTime) {
                    if ($scope.FemtotempObj.FemtoEndTime)
                        NewValue += `${NewValue ? '\n ' : ''}End Time: ${$scope.FemtotempObj.FemtoEndTime}`;
                }
                if ($scope.LogObj.FemtoReferenceNo != $scope.FemtotempObj.FemtoReferenceNo) {
                    if ($scope.FemtotempObj.FemtoReferenceNo)
                        NewValue += `${NewValue ? '\n ' : ''}Reference No: ${$scope.FemtotempObj.FemtoReferenceNo}`;
                    if ($scope.LogObj.FemtoReferenceNo)
                        OldValue += `${OldValue ? '\n' : ''}Reference No: ${$scope.LogObj.FemtoReferenceNo}`;
                    PCCount++
                }
                if ($scope.LogObj.FemtoLotNo != $scope.FemtotempObj.FemtoLotNo) {
                    if ($scope.FemtotempObj.FemtoLotNo)
                        NewValue += `${NewValue ? '\n ' : ''}Lot No: ${$scope.FemtotempObj.FemtoLotNo}`;
                }

                if ($scope.LogObj.FemtoArcuateIncisionsNotes != $scope.FemtotempObj.FemtoArcuateIncisionsNotes) {
                    if ($scope.FemtotempObj.FemtoArcuateIncisionsNotes)
                        NewValue += `${NewValue ? '\n ' : ''}Arcuate Incisions Notes: ${$scope.FemtotempObj.FemtoArcuateIncisionsNotes}`;
                }


                if ($scope.LogObj.FemtoExpiryDate != $scope.FemtotempObj.FemtoExpiryDate) {
                    if ($scope.FemtotempObj.FemtoExpiryDate) {
                        NewValue += `${NewValue ? '\n ' : ''}Expiry Date: ${$filter('date')($scope.FemtotempObj.FemtoExpiryDate, 'MM-dd-yyyy')}`;
                    }
                }
                if (NewValue != '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Femto",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": NewValue,
                        //"ActionDescription": `Femto Template Checklist in Intra-Op For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            editPostfemtoChecklist = $filter("filter")($scope.TempOrgASCChecklistLogs, { "CheckListCategoryId": 20 }, true) || [];
            var IsUserAlreadyAddedthispostList = $filter("filter")(editPrefemtoChecklist, { "CreatedBy": $scope.UserId }, true) || [];

            if (editPostfemtoChecklist.length > 0) {
                $scope.differences = $scope.findDifferences(postfemtoChecklist, editPostfemtoChecklist) || [];
                if ($scope.differences.length > 0) {
                    var NewValue = '';
                    var OldValue = '';
                    angular.forEach($scope.differences, function (itemA) {
                        if (itemA.DeleteInd == 'N') {
                            if (NewValue !== '') {
                                NewValue += '\n ';
                            }
                            NewValue += `${itemA.CheckListName}: ${itemA.savedValue}`;
                        }

                        angular.forEach(editPostfemtoChecklist, function (itemB) {
                            if (itemA.CheckListId === itemB.CheckListId && itemB.DeleteInd == 'N') {
                                if (OldValue !== '') {
                                    OldValue += '\n ';
                                }
                                OldValue += `${itemB.CheckListName}: ${itemB.Value}`;
                            }
                        });
                    });
                    var ActionType = "Edited";
                    if (IsUserAlreadyAddedthispostList.length === 0 && OldValue === '') {
                        ActionType = "Added";
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Post-Femto",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else if (postfemtoChecklist.length > 0) {
                var ActionDescription = '';
                angular.forEach(postfemtoChecklist, function (itemA) {
                    if (itemA.PatientAscCheckListDetailId === 0) {
                        if (ActionDescription !== '') {
                            ActionDescription += '\n ';
                        }
                        ActionDescription += `${itemA.CheckListName}: ${itemA.Value}`;
                    }
                });
                if (ActionDescription != '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Post-Femto",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            $scope.FemtotempObj.FemtNurseReviewedById = $scope.FemtotempObj.FemtNurseReviewedById || 0;
            $scope.LogObj.FemtNurseReviewedById = $scope.LogObj.FemtNurseReviewedById || 0;

            $scope.FemtotempObj.FemtDoctorReviewedById = $scope.FemtotempObj.FemtDoctorReviewedById || 0;
            $scope.LogObj.FemtDoctorReviewedById = $scope.LogObj.FemtDoctorReviewedById || 0;

            $scope.FemtotempObj.FemtAnesthesiaReviewedById = $scope.FemtotempObj.FemtAnesthesiaReviewedById || 0;
            $scope.LogObj.FemtAnesthesiaReviewedById = $scope.LogObj.FemtAnesthesiaReviewedById || 0;

            if ($scope.FemtotempObj.FemtNurseReviewedById != 0 || $scope.FemtotempObj.FemtDoctorReviewedById != 0 || $scope.FemtotempObj.FemtAnesthesiaReviewedById != 0 || $scope.LogObj.FemtNurseReviewedById !== 0 || $scope.LogObj.FemtDoctorReviewedById !== 0 || $scope.LogObj.FemtAnesthesiaReviewedById!==0) {
                var NewValue = '';
                var OldValue = '';
                let count = 0;
                let ActionType = ''
                let doctorgivenByUser = '';
                let olddoctorgivenByUser = '';

                var DoctorReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.FemtotempObj.FemtDoctorReviewedById });
                if (DoctorReviewedByArraylist.length > 0) {
                    doctorgivenByUser = angular.copy(DoctorReviewedByArraylist[0].SecondUserFullName) +
                        (DoctorReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(DoctorReviewedByArraylist[0].LicenseNumber) : "");
                }
                var OldDoctorReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.FemtDoctorReviewedById });
                if (OldDoctorReviewedByArraylist.length > 0) {
                    olddoctorgivenByUser = angular.copy(OldDoctorReviewedByArraylist[0].SecondUserFullName) +
                        (OldDoctorReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldDoctorReviewedByArraylist[0].LicenseNumber) : "");
                }

                let anesthesiagivenByUser = '';
                let oldanesthesiagivenByUser = '';

                var AnesthesiaReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.FemtotempObj.FemtAnesthesiaReviewedById });
                if (AnesthesiaReviewedByArraylist.length > 0) {
                    anesthesiagivenByUser = angular.copy(AnesthesiaReviewedByArraylist[0].SecondUserFullName) +
                        (AnesthesiaReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(AnesthesiaReviewedByArraylist[0].LicenseNumber) : "");
                }
                var OldAnesthesiaReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.FemtAnesthesiaReviewedById });
                if (OldAnesthesiaReviewedByArraylist.length > 0) {
                    oldanesthesiagivenByUser = angular.copy(OldAnesthesiaReviewedByArraylist[0].SecondUserFullName) +
                        (OldAnesthesiaReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldAnesthesiaReviewedByArraylist[0].LicenseNumber) : "");
                }


                let nursegivenByUser = '';
                let oldnursegivenByUser = '';

                var NurseReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.FemtotempObj.FemtNurseReviewedById });
                if (NurseReviewedByArraylist.length > 0) {
                    nursegivenByUser = angular.copy(NurseReviewedByArraylist[0].SecondUserFullName) +
                        (NurseReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(NurseReviewedByArraylist[0].LicenseNumber) : "");
                }
                var OldNurseReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.FemtNurseReviewedById});
                if (OldNurseReviewedByArraylist.length > 0) {
                    oldnursegivenByUser = angular.copy(OldNurseReviewedByArraylist[0].SecondUserFullName) +
                        (OldNurseReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldNurseReviewedByArraylist[0].LicenseNumber) : "");
                }

                if ($scope.FemtotempObj.FemtDoctorReviewedById != $scope.LogObj.FemtDoctorReviewedById) {
                    if ($scope.FemtotempObj.FemtDoctorReviewedById)
                        NewValue += `${NewValue ? '\n ' : ''}Surgeon : ${doctorgivenByUser}`;
                    if ($scope.LogObj.FemtDoctorReviewedById)
                        OldValue += `${OldValue ? '\n' : ''}Surgeon : ${olddoctorgivenByUser}`;
                    count++;
                }
                if ($scope.FemtotempObj.FemtAnesthesiaReviewedById != $scope.LogObj.FemtAnesthesiaReviewedById) {
                    if ($scope.FemtotempObj.FemtAnesthesiaReviewedById)
                        NewValue += `${NewValue ? '\n ' : ''}Anesthesia : ${anesthesiagivenByUser}`;
                    if ($scope.LogObj.FemtAnesthesiaReviewedById)
                        OldValue += `${OldValue ? '\n' : ''}Anesthesia : ${oldanesthesiagivenByUser}`;
                    count++;
                }

                if ($scope.FemtotempObj.FemtNurseReviewedById != $scope.LogObj.FemtNurseReviewedById) {
                    if ($scope.FemtotempObj.FemtNurseReviewedById)
                        NewValue += `${NewValue ? '\n ' : ''}Nurse : ${nursegivenByUser}`;
                    if ($scope.LogObj.FemtNurseReviewedById)
                        OldValue += `${OldValue ? '\n' : ''}Nurse : ${oldnursegivenByUser}`;
                    count++;
                }
                if ($scope.LogObj.FemtNurseReviewedById == 0 && $scope.LogObj.FemtAnesthesiaReviewedById == 0 && $scope.LogObj.FemtDoctorReviewedById==0) {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Femto(Reviewd By)",
                        "ActionType": ActionType,
                        //"ActionDescription": ActionDescription,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            }




            //if ($scope.FemtotempObj.FemtNurseReviewedById != 0) {
            //    let ActionType = ''
            //    if ($scope.LogObj.FemtNurseReviewedById == 0) {
            //        ActionType = 'Added';
            //    } else {
            //        ActionType = 'Edited';
            //    }
            //    let givenByUser = '';

            //    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.FemtotempObj.FemtNurseReviewedById });
            //    if (ReviewedByArraylist.length > 0) {
            //        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
            //            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
            //    }
            //    let count = 0;
            //    if ($scope.FemtotempObj.FemtNurseReviewedById != $scope.LogObj.FemtNurseReviewedById) {
            //        count++;
            //    }
              

            //    let ActionDescription = `Femto Template Reviewed by  ${givenByUser}  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
            //    if ($scope.FemtotempObj.FemtNurseReviewedById != $scope.LogObj.FemtNurseReviewedById) {
            //        if (count != 0) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": 2,
            //                "ModuleName": "ASC",
            //                "SubModuleId": 36,
            //                "SubModuleName": "Femto Template",
            //                "ScreenType": "Femto",
            //                "ActionType": ActionType,
            //                "ActionDescription": ActionDescription,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }
            //    }
            //}

            //if ($scope.FemtotempObj.FemtDoctorReviewedById != 0) {
            //    let ActionType = ''
            //    if ($scope.LogObj.FemtDoctorReviewedById == 0) {
            //        ActionType = 'Added';
            //    } else {
            //        ActionType = 'Edited';
            //    }
            //    let givenByUser = '';

            //    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.FemtotempObj.FemtDoctorReviewedById });
            //    if (ReviewedByArraylist.length > 0) {
            //        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
            //            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
            //    }
            //    let count = 0;
            //    if ($scope.FemtotempObj.FemtDoctorReviewedById != $scope.LogObj.FemtDoctorReviewedById) {
            //        count++;
            //    }

            //    let ActionDescription = `Femto Template Reviewed by  ${givenByUser}  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
            //    if ($scope.FemtotempObj.FemtDoctorReviewedById != $scope.LogObj.FemtDoctorReviewedById) {
            //        if (count != 0) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": 2,
            //                "ModuleName": "ASC",
            //                "SubModuleId": 36,
            //                "SubModuleName": "Femto Template",
            //                "ScreenType": "Femto",
            //                "ActionType": ActionType,
            //                "ActionDescription": ActionDescription,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }
            //    }
            //}

            //if ($scope.FemtotempObj.FemtAnesthesiaReviewedById != 0) {
            //    let ActionType = ''
            //    if ($scope.LogObj.FemtAnesthesiaReviewedById == 0) {
            //        ActionType = 'Added';
            //    } else {
            //        ActionType = 'Edited';
            //    }
            //    let givenByUser = '';

            //    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.FemtotempObj.FemtAnesthesiaReviewedById });
            //    if (ReviewedByArraylist.length > 0) {
            //        givenByUser = angular.copy(ReviewedByArraylist[0].SecondUserFullName) +
            //            (ReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(ReviewedByArraylist[0].LicenseNumber) : "");
            //    }
            //    let count = 0;
            //    if ($scope.FemtotempObj.FemtDoctorReviewedById != $scope.LogObj.FemtDoctorReviewedById) {
            //        count++;
            //    }
            //    let ActionDescription = `Femto Template Reviewed by  ${givenByUser}  For Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
            //    if ($scope.FemtotempObj.FemtAnesthesiaReviewedById != $scope.LogObj.FemtAnesthesiaReviewedById) {
            //        if (count != 0) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": 2,
            //                "ModuleName": "ASC",
            //                "SubModuleId": 36,
            //                "SubModuleName": "Femto Template",
            //                "ScreenType": "Femto",
            //                "ActionType": ActionType,
            //                "ActionDescription": ActionDescription,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }
            //    }
            //}

            if ($scope.FemtotempObj.FemtoOverAllNotes != "" || $scope.LogObj.FemtoOverAllNotes != "") {
                var NewValue = '';
                var OldValue = '';
                let ActionType = ''
                if ($scope.LogObj.FemtoOverAllNotes == "") {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                let count = 0;
                if ($scope.FemtotempObj.FemtoOverAllNotes != $scope.LogObj.FemtoOverAllNotes) {
                    if ($scope.FemtotempObj.FemtoOverAllNotes)
                        NewValue += `${NewValue ? '\n ' : ''}Procedure Remarks: ${$scope.FemtotempObj.FemtoOverAllNotes}`;
                    if ($scope.LogObj.FemtoOverAllNotes)
                        OldValue += `${OldValue ? '\n' : ''}Procedure Remarks: ${$scope.LogObj.FemtoOverAllNotes}`;
                    count++;
                }
                //let ActionDescription = "Femto Template Remarks For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 36,
                        "SubModuleName": "Femto Template",
                        "ScreenType": "Femto(Procedure Remarks)",
                        "ActionType": ActionType,
                        "OldActionDescription": OldValue,
                        "NewActionDescription": NewValue,
                       // "ActionDescription": ActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }



            if ($scope.LogObj.LogArray.length > 0) {
                submitObj.Logs = $scope.LogObj || {};
            }
            $scope.FemtotempObj.IsClickSaveFemtoBtn = true;
            eHnoteSurgeryService.AddUpdateFemtoTemplateData(submitObj).then(function (resp) {

                if (resp.data.status === "Success") {
                    alertify.success("Femto Template data successfully submitted!");
                    $scope.FemtotempObj.IsClickSaveFemtoBtn = false;
                      $scope.init();
                    //$scope.GetFemtoTemplateChartData();
                }
            });

        }

        $scope.PrintFemtoTemplateData = function () {

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
                                $scope.generateFemtoPrint(resp);
                            });
                        });
                    } else {
                        $scope.generateFemtoPrint(resp);
                    }

                }
            }); 

        }

        $scope.generateFemtoPrint = function (resp){
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                if (doctorinfo.doctordata.User[0].Suffix !== '') {
                    CreatedByName = CreatedByName + doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                } else {
                    CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                }
            }
            let IntraFemtoChecklist = $filter("filter")($scope.FemtotempObj.OrgASCChecklist, { "CheckListCategoryId": 18, "IsChecked": true }, true) || [];
            let PreFemtoChecklist = $filter("filter")($scope.FemtotempObj.OrgASCChecklist, { "CheckListCategoryId": 19, "IsChecked": true }, true) || [];
            let PostFemtoChecklist = $filter("filter")($scope.FemtotempObj.OrgASCChecklist, { "CheckListCategoryId": 20, "IsChecked": true }, true) || [];

            let FireRiskChecklist = $filter("filter")($scope.FemtotempObj.OrgASCChecklist, { "CheckListCategoryId": 10, "IsChecked": true }, true) || [];

            var FemtotempObj = {
                "FemtoArcuateIncisions1": $scope.FemtotempObj.FemtoArcuateIncisions1 || '',
                "IsFemtoArcuateIncisions1NA": $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || false,
                "FemtoArcuateIncisions2": $scope.FemtotempObj.FemtoArcuateIncisions2 || '',
                "IsFemtoArcuateIncisions2NA": $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || false,
                "FemtoArcuateIncisionsNotes": $scope.FemtotempObj.FemtoArcuateIncisionsNotes || '',
                "FemtoTimeOut": $scope.FemtotempObj.FemtoTimeOut || '',
                "FemtoStartTime": $scope.FemtotempObj.FemtoStartTime || '',
                "FemtoEndTime": $scope.FemtotempObj.FemtoEndTime || '',
                "FemtoReferenceNo": $scope.FemtotempObj.FemtoReferenceNo || '',
                "FemtoLotNo": $scope.FemtotempObj.FemtoLotNo || '',
                "FemtoExpiryDate": $scope.FemtotempObj.FemtoExpiryDate || null,
                "FemtoOverAllNotes": $scope.FemtotempObj.FemtoOverAllNotes || '',
                "FemtNurseReviewedById": $scope.FemtotempObj.FemtNurseReviewedById || null,
                "FemtNurseReviewedByName": $scope.FemtotempObj.FemtNurseReviewedByName || '',
                "FemtDoctorReviewedById": $scope.FemtotempObj.FemtDoctorReviewedById || null,
                "FemtDoctorReviewedByName": $scope.FemtotempObj.FemtDoctorReviewedByName || '',
                "FemtDoctorReviewedByDate": $scope.FemtotempObj.FemtDoctorReviewedByDate || null,
                "FemtDoctorReviewedByTime": $scope.FemtotempObj.FemtDoctorReviewedByTime || '',
                "FemtAnesthesiaReviewedById": $scope.FemtotempObj.FemtAnesthesiaReviewedById || null,
                "FemtAnesthesiaReviewedByName": $scope.FemtotempObj.FemtAnesthesiaReviewedByName || '',
                "AnesthetistFireRiskID": $scope.FemtotempObj.AnesthetistFireRiskID || null,
                "AnesthetistFireRiskName": $scope.FemtotempObj.AnesthetistFireRiskName || '',
                "AnesthetistFireRiskLicenseNo": $scope.FemtotempObj.AnesthetistFireRiskLicenseNo || null,
                "AnesthetistReviewdDate": $scope.FemtotempObj.AnesthetistReviewdDate || null,
                "DoctorFireRiskID": $scope.FemtotempObj.DoctorFireRiskID || null,
                "DoctorFireRiskName": $scope.FemtotempObj.DoctorFireRiskName || '',
                "DoctorFireRiskLicenseNo": $scope.FemtotempObj.DoctorFireRiskLicenseNo || null,
                "DoctorReviewdDate": $scope.FemtotempObj.DoctorReviewdDate || null,
                "NurseFireRiskID": $scope.FemtotempObj.NurseFireRiskID || null,
                "NurseFireRiskName": $scope.FemtotempObj.NurseFireRiskName || '',
                "NurseFireRiskLicenseNo": $scope.FemtotempObj.NurseFireRiskLicenseNo || null,
                "NurseFireRiskReviewdDate": $scope.FemtotempObj.NurseFireRiskReviewdDate || null,
                "RiskLevel": $scope.FemtotempObj.RiskLevel || '',
                "IfFemtoTemplateDataAdded": false,
            }

            if (FemtotempObj.FemtoArcuateIncisions1 !== '' || FemtotempObj.IsFemtoArcuateIncisions1NA || FemtotempObj.FemtoArcuateIncisions2 !== '' || FemtotempObj.IsFemtoArcuateIncisions2NA || FemtotempObj.FemtoTimeOut !== '' || FemtotempObj.FemtoStartTime !== '' || FemtotempObj.FemtoEndTime !== '' || FemtotempObj.FemtoReferenceNo !== ''
                || FemtotempObj.FemtoLotNo !== '' || FemtotempObj.FemtoExpiryDate !== null || FemtotempObj.DoctorFireRiskID !== null || FemtotempObj.AnesthetistFireRiskID !== null || FemtotempObj.NurseFireRiskID !== null || FemtotempObj.RiskLevel !== '') {
                FemtotempObj.IfFemtoTemplateDataAdded = true;
            } else {
                FemtotempObj.IfFemtoTemplateDataAdded = false;
            }
            if (FemtotempObj.FemtoOverAllNotes !== '' || FemtotempObj.FemtNurseReviewedById !== null || FemtotempObj.FemtDoctorReviewedById !== null || FemtotempObj.FemtDoctorReviewedByDate !== null || FemtotempObj.FemtDoctorReviewedByTime !== '' || FemtotempObj.FemtAnesthesiaReviewedById !== null) {
                FemtotempObj.IsFemtoreviewedby = true;
            } else {
                FemtotempObj.IsFemtoreviewedby = false;
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
                // SurgeryDate = $scope.cacheStorageItem.SurgeryList[0].SurgeryDate || '';
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
                    "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                    "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                    "SurgeryDate": SurgeryDate || '',
                    "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                    "SurgeryName": SurgeryName || '',
                    "AdditionalSurgeryName": AdditionalSurgeryName || '',
                    "OrganName": OrganName || '',
                    "FemtoObj": FemtotempObj,
                    "IntraFemtoChecklist": IntraFemtoChecklist || [],
                    "PreFemtoChecklist": PreFemtoChecklist || [],
                    "PostFemtoChecklist": PostFemtoChecklist || [],
                    "FireRiskChecklist": FireRiskChecklist || [],
                    "EhnoteLogoURL": $scope.HeaderLogo || '',
                    "OrganizationDetails": $scope.OrganizationDetails || [],
                    "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
                }
                USPrintService.GenerateFemtoPrint(Object);
            }, 500);
        }

        $scope.cacheStorageItem.PatientName = $scope.cacheStorageItem.PatientName || '';
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
        };

        $scope.OnSelectFireRiskAssesChecklist = function (bool, Item) {
            if (bool) {
                if (Item.CheckListId == 571) {
                    $scope.FemtotempObj.IsShowAnesthetistReviewByinFireRisk = true;
                }
                if (Item.CheckListId == 572) {
                    $scope.FemtotempObj.IsShowDoctorReviewByinFireRisk = true;
                }
            } else {
                if (Item.CheckListId == 571) {
                    $scope.FemtotempObj.IsShowAnesthetistReviewByinFireRisk = false;
                    $scope.FemtotempObj.AnesthetistFireRiskID = null;
                    $scope.FemtotempObj.AnesthetistFireRiskName = '';
                }
                if (Item.CheckListId == 572) {
                    $scope.FemtotempObj.IsShowDoctorReviewByinFireRisk = false;
                    $scope.FemtotempObj.DoctorFireRiskID = null;
                    $scope.FemtotempObj.DoctorFireRiskName = '';
                }
                if (!Item.IsChecked && Item.SubCheckList.length > 0) {
                    angular.forEach(Item.SubCheckList, function (sitem) {
                        sitem.IsChecked = false;
                    });
                }
            }

            var FireRisccount = 0;
            angular.forEach($scope.FemtotempObj.OrgASCChecklist, function (sitem) {
                if (sitem.CheckListCategoryId == 10 && sitem.IsChecked) {
                    FireRisccount++;
                }
            });
            if (FireRisccount == 0) {
                $scope.FemtotempObj.RiskLevel = '';
                $scope.FemtotempObj.NurseFireRiskID = null;
                $scope.FemtotempObj.NurseFireRiskName = '';
            }
            else if (FireRisccount <= 2) {
                $scope.FemtotempObj.RiskLevel = 'Low Risk';
            } else if (FireRisccount == 3) {
                $scope.FemtotempObj.RiskLevel = 'Potential to convert to high risk';
            } else if (FireRisccount > 3) {
                $scope.FemtotempObj.RiskLevel = 'High risk';
            }
            else { }
        };

        $scope.ChangeFireRiskNurseReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.FemtotempObj.NurseFireRiskReviewdDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                $scope.FemtotempObj.NurseFireRiskReviewdDate = null;
            }
        }

        $scope.ChangeFireRiskAnesthesiologistReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.FemtotempObj.AnesthetistReviewdDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                $scope.FemtotempObj.AnesthetistReviewdDate = null;
            }
        }

        $scope.ChangeFireRiskDoctorReviewedBy = function (doctorId) {
            if (doctorId != null) {
                $scope.FemtotempObj.DoctorReviewdDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                $scope.FemtotempObj.DoctorReviewdDate = null;
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

    }]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 10);
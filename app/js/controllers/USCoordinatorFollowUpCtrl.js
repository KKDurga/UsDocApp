"use strict";
eHnoteWebApp.controller("USCoordinatorFollowUpCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteSettingsDataService", "eHnotePatientDataService", "datapersistanceFactory", "eHnoteReferalDataService", "eHnoteLoginStatusService", "USPrintService", "$location", "eHnotePatientAddressDataServices", "eHnotePatientVisitReasonServices","eHnoteUserDataService",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteSettingsDataService, eHnotePatientDataService, datapersistanceFactory, eHnoteReferalDataService, eHnoteLoginStatusService, USPrintService, $location, eHnotePatientAddressDataServices, eHnotePatientVisitReasonServices, eHnoteUserDataService) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.searchPatientTxt = "";
        $scope.searchPatientIdTxt = "";
        $scope.AllUserBranchesList = [];
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.SpecializationId = 0;
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            $scope.hospitalcd = "";
            $scope.hospid = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.parenthospId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }

        $scope.TabObj = {
            "Tab" : 1
        }

        $scope.SelectTab = function (val) {
            $scope.TabObj.Tab = val;

            if ($scope.TabObj.Tab === 2) {
                let reqObj = {
                    "FromDate": $filter('date')(new Date($scope.CounsellorSearchObj.FromDate), "yyyy-MM-dd"),
                    "ToDate": $filter('date')(new Date($scope.CounsellorSearchObj.ToDate), "yyyy-MM-dd"),
                    "HospitalId": $scope.CounsellorSearchObj.HospitalId,
                    "PageSize": $scope.patientPageSize,
                    "PageNumber": $scope.patientPageNumber
                };

                eHnoteSurgeryService.GetPreAdmissionFailedApptList(reqObj).then(function (resp) {
                    if (resp.data.status === "Success") {
                        angular.forEach(resp.data.rows, function (item) {
                            let MobileNumber = item.Patient.PhAreaCD + item.Patient.HomeNumber;
                            let FormattedNumberObj = eHnoteUserDataService.UsMobileFormatChange(MobileNumber);
                            item.UserMobilenumberFormat = FormattedNumberObj.UsFormatMobileNumber;

                            item.ConsultationDt = $filter('date')(item.ConsultationDt, "MM-dd-yyyy");
                            if (item.PreAdmissionStatusId === 1) {
                                item.PreAdmissionStatus = "Approved";
                            } else if (item.PreAdmissionStatusId === 2) {
                                item.PreAdmissionStatus = "Not Fit for surgery";
                            } else {
                                item.PreAdmissionStatus = "Postpone Surgery";
                            }
                        });
                        $scope.PreAdmissionApptsArray = angular.copy(resp.data.rows);
                    }

                }, function (err) {
                    console.log(err);
                });
            }
        };

        $scope.GetCounsellorSearchObj = function () {
            return {
                "FromDate": moment().format("M-DD-YYYY"),
                "ToDate": moment().format("M-DD-YYYY"),
                "HospitalId": $scope.HospitalId,
                "PageSize": "",
                "PageNumber": "",
                "SearchName": "",
                "SearchMrno": "",            
                "Type": "0",
                "HospitalObj": "",
                "HospitalName": ""
            };
        };
        $scope.CounsellorSearchObj = angular.copy($scope.GetCounsellorSearchObj());

        $scope.GetCordinatorFollowUpList = function () {
            var obj = {
                "FromDate": $filter('date')(new Date($scope.CounsellorSearchObj.FromDate), "yyyy-MM-dd"),
                "ToDate": $filter('date')(new Date($scope.CounsellorSearchObj.ToDate), "yyyy-MM-dd"),
                "HospitalId": $scope.CounsellorSearchObj.HospitalId,
                "PageSize": $scope.patientPageSize,
                "PageNumber": $scope.patientPageNumber,
                //"SearchName": $scope.CounsellorSearchObj.SearchName,
                //"SearchMrno": $scope.CounsellorSearchObj.SearchMrno,

            }
            if ($scope.patientsearchType == 1) {
                obj.SearchText = $scope.CounsellorSearchObj.SearchName;
            } else if ($scope.patientsearchType == 2) {
                obj.SearchText = $scope.CounsellorSearchObj.SearchMrno;
            }
            eHnoteSurgeryService.GetCordinatorAppointmentFollowUpList(obj).then(function (resp) {
                $scope.CordinatorFollowUpList = [];
                if (resp.data.Status == "Success") {
                    $scope.CordinatorFollowUpList = resp.data.rows || [];
                    if ($scope.CordinatorFollowUpList.length>0) {
                        $scope.Mobilenumberus = '';
                        angular.forEach($scope.CordinatorFollowUpList, function (item) {
                            $scope.Mobilenumberus = item.PhAreaCD + item.HomeNumber;
                            $scope.Objectusnumber = eHnoteUserDataService.UsMobileFormatChange($scope.Mobilenumberus);
                            item.UserMobilenumberFormat = $scope.Objectusnumber.UsFormatMobileNumber;
                        });
                    }
                }



            });
        }

        $scope.init = function () {
            $scope.patientsearchType = 1;
            $scope.GetCordinatorFollowUpList();
        }
        $scope.init();

        $scope.ChangeFollowUpSubcontent = function (row) {

            row.PatientID = row.PatientId;
            row.AppointmentID = row.AppointmentId;
            row.Patient = {
                "PatientID": row.PatientId
            }
            $scope.ClickPatientProfile(row);
        };


        $scope.ClickPatientProfile = function (item) {
            // $rootScope.$broadcast("CoordinatorToProfile", item);
            item.PatientID = item.PatientID;
            item.Patient.PatientID = item.PatientID;
            item.AppointmentId = item.AppointmentID;
            eHnoteMasterDataService.addPatientDetailsforBarcode(item);
            //eHnoteMasterDataService.addpatientData(item.PatientDetails);
            //eHnoteMasterDataService.setentryConsultationPatientInfo(item);
            eHnoteMasterDataService.addAppointmentInfo(item);



            $scope.cacheStorageItem.patientid = item.PatientID;
            //item.MasterPatientId = item.Patient.MasterPatientId;
            $scope.cacheStorageItem.PatientID = item.PatientID;
            $scope.cacheStorageItem.ProfileStatusMasterId = item.ProfileStatusMasterId;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);         
            datapersistanceFactory.set("CoordinatorToProfile", item);
            $location.url("/profile");




        };

        $scope.OnclickPreAdmissionAppt = function (item) {

            $scope.cacheStorageItem.patientid = item.PatientID;
            $scope.cacheStorageItem.PatientID = item.PatientID;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            datapersistanceFactory.set("CoordinatorToProfile", item);
            $location.url("/profile");
        };

    }]);
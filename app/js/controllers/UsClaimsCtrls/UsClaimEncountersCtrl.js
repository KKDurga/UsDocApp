"use strict";
eHnoteWebApp.controller("UsClaimEncountersCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "datapersistanceFactory", "$q", "$timeout", "$uibModal", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteMainAdminServices", "eHnotePatientVisitReasonServices", "InventoryService", "eHnotePatientDataService", "eHnoteMainAppointmentService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteCacheStorageService", "eHnoteUserDataService", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteAdminDepartmentService", function ($scope, $rootScope, $location, $filter, alertify, datapersistanceFactory, $q, $timeout, $uibModal, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteMainAdminServices, eHnotePatientVisitReasonServices, InventoryService, eHnotePatientDataService, eHnoteMainAppointmentService, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteCacheStorageService, eHnoteUserDataService, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteAdminDepartmentService) {


    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
    $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
    $scope.ClinicId = $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;
    $scope.GetAllIndicator = 0;
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    $scope.HospitalId = 0;
    $scope.ParentHospitalId = 0;
    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
        && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }



    $scope.selectedVisitReason = { "visitRsnName": "", "apptTypename": "", "Selectedtype": 'All Visit Reasons' };

    function getnewSearchEncounterobj() {
        var obj = {
            "OrganizationId": $scope.HospitalId,
            "OrganizationFacilityId": 0,
            "PageSize": 50,
            "PageNumber": 1,
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DoctorId": 0,
            "VisitReasonId": 0,
            "PatientId": 0,
            "PatientMrNo": "",
            "PatientMobile": "",
            "Count": 0,
            "SelectedHospitalId": 0,
            "FacilityListIds": "",
            "Locationids": "",
            "EncounterStatusId": "1",
        };
        return obj;

    }


    $scope.searchClaimEncounterReqObj = getnewSearchEncounterobj();

    $scope.serchobj = {
        "ClaimStatusList": "",
        "OrganizationId": $scope.HospitalId,
        "ClaimNumber": "",
    };

    $scope.LocationTypeObj = {
        "SelectLocationString": "All Locations",
        "Name": "",
        "AllLocationCheck": true
    };

    function getSelectedPatient() {
        var obj = {
            "SearchText": "",
            "PatientId": 0,
            "SearchTypeId": 2
        }
        return obj;
    };
    $scope.PatientSearch = getSelectedPatient();
    $scope.GetClaimResponcibilities = function () {
        return [{
            "ResponcibilityId": 1,
            "ResponcibilityName": "Patient"
        },
        {
            "ResponcibilityId": 2,
            "ResponcibilityName": "Insurance"
        },
        {
            "ResponcibilityId": 3,
            "ResponcibilityName": " Worker comp"
        },
        {
            "ResponcibilityId": 4,
            "ResponcibilityName": "Others"
        }
        ];
    };
    $scope.ClaimResponcibilities = angular.copy($scope.GetClaimResponcibilities());

    $scope.SelectedSuperBillStatus = "Select";
    $scope.GetSuperBillStatusList = function () {
        return [{
            "SuperBillStatusId": 1,
            "SuperBillStatus": "Signed",
            "isChecked": true
        },
        {
            "SuperBillStatusId": 7,
            "SuperBillStatus": "NotSigned",
            "isChecked": true
        },
        {
            "SuperBillStatusId": 8,
            "SuperBillStatus": "No Visit Note",
            "isChecked": true
        }
        ];
    };
    $scope.SuperBillStatusList = angular.copy($scope.GetSuperBillStatusList());

    $scope.AllSelectionObj = {
        "AllDoctorCheck": true,
        "AllVisitReasonsCheck": true,
        "AllAppointmentTypeStatusCheck": true,
        "AllBillingStatusCheck": false,
        "SuperBillStatusCheck": true
    }

    $scope.ShowdateofbirthSearch = false;

    $scope.LoadPatientSearch = function (val) {


        if (val == undefined || val == null || val == "") {
            $scope.AllPatientList = [];
            $scope.PatientSearch.PatientId = 0;
            $scope.ShowPatientListDrop = false;
            return false;
        }
        var param = {
            "PageSize": 21,
            "UserId": "",
            "PageNumber": 1,
            "SearchText": "",
            "Count": 0,
            "SearchDetails": { "listdocpatients": "Y" },
            "EndAge": 0,
            "StartAge": 0,
            "StartDate": "",
            "EndDate": ""
        };

        let doctorInfo = eHnoteMasterDataService.getUserInfo();
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                $scope.HospitalArray = [];
                angular.forEach(doctorInfo.doctordata.UserAddress, function (item) {
                    if (item.ExtDetails !== undefined) {
                        if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                            var Obj = {
                                "HospitalName": item.ClinicName,
                                "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                "ActiveIND": "Y",
                                "isChecked": true,
                                "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                            };
                            $scope.HospitalArray.push(Obj);
                        }
                    }
                });
            }
        }
        var list = [];
        angular.forEach($scope.HospitalArray, function (items) {
            if (items.isChecked) {
                list.push(items.BranchId);
            }
        });
        param["HospitalIDLst"] = list;
        eHnoteMasterDataService.addPatientSearchInfo(param);
        var object = {
            "UserId": $scope.UserId,
            "HospitalID": $scope.HospitalId,
            "HospitalIDLst": param.HospitalIDLst.toString(),
            "SearchText": $scope.PatientSearch.SearchText || "",
            "SearchTypeID": $scope.PatientSearch.SearchTypeId || 0,
        }
        if ($scope.PatientSearch.SearchTypeId == 1) {
            object.Name = val;
        } else if ($scope.PatientSearch.SearchTypeId == 2) {
            object.PatientId = val;
        }
        eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
    };

    $scope.ShowPatientListDrop = false;
    function OnGetopSearchPatientSuccess(data) {

        if (data.count > 0) {
            $scope.count = data.count;
            $scope.AllPatientList = [];
            if (data.rows.length > 0) {
                $scope.AllPatientList = data.rows || [];
            }
            else {
                $scope.count = 0;
                $scope.AllPatientList = [];
            }
        }

        if (data.count > 0) {
            $scope.count = data.count;
            $scope.AllPatientList = [];
            $scope.patientDetailsList = [];
            $scope.patientinitval = {};
            angular.forEach(data.rows, function (item) {
                $scope.patientinitval = {};
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.S3URL = item.S3URL || "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;
                $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                $scope.patientinitval.Altareacode = item.Altareacode || '';
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.OldMrno = item.OldMrno || "";
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                $scope.patientinitval.DisplayID = item.DisplayID || "";
                $scope.patientinitval.Altareacode = item.Altareacode || "";
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientDetailsList.push(previouspatval);
            });
            $scope.AllPatientList = $scope.patientDetailsList;

            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.count = 0;
            $scope.AllPatientList = [];
        }
        if ($scope.PatientSearch.SearchText != "") {
            $scope.ShowPatientListDrop = true;
        }
    }
    function OnGetopPatientSearchError() {
        $scope.count = 0;
        $scope.AllPatientList = [];
        $scope.PatientSearch.SearchText = "";
    }

    $scope.clearPatientSearchData = function () {
        $scope.ShowPatientListDrop = false;
        $scope.PatientSearch.SearchText = "";
        $scope.searchClaimEncounterReqObj.PatientId = 0;
    };

    $scope.SelectedPatient = function (patietnitem) {
        $scope.PatientSearch.PatientId = patietnitem.PatientID;
        $scope.searchClaimEncounterReqObj.PatientId = patietnitem.PatientID;
        $scope.PatientSearch.SearchText = patietnitem.FullName;
        $scope.AllPatientList = [];
        $scope.ShowPatientListDrop = false;
        $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', $scope.selectedEncounterStatusIds);
    };

    $scope.changeCurrentDate = function (cdate, type) {

        var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");

        if (type === 1) {
            if (cdate != currentdate) {
                $scope.showifnotCurrentDate = true;
            } else {
                $scope.showifnotCurrentDate = false;
            }
        } else {
            if (cdate != currentdate) {
                $scope.showifnotTodayDate = true;
            } else {
                $scope.showifnotTodayDate = false;
            }
        }
    }

    $scope.navtoBillingTodayDate = function (type) {
        var refDate = $filter('date')(new Date(), "MM-dd-yyyy");

        $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';

        $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
        if ($scope.selectedEncounterslist != '') {
            var Encounterstatus = $scope.selectedEncounterslist.BillingEncounterStatus || "";
        }
        if (type === 1) {
            $scope.searchClaimEncounterReqObj.FromDate = refDate;
            $scope.showifnotCurrentDate = false;
            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', Encounterstatus);
        } else {
            $scope.searchClaimEncounterReqObj.ToDate = refDate;
            $scope.showifnotTodayDate = false;
            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', Encounterstatus);
        }
    }


    $scope.organizationSuperBillList = [];
    $scope.emptyDoctorCheckCount = 0;

    $scope.SearchCLaimEncounters = function (pageno, claimtype, EncounterStatusId) {
        $scope.searchClaimEncounterReqObj.PageNumber = pageno || 1;

        var Locationids = $scope.mainBillerDataObj.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
            .map(pitem => pitem.ClinicId)
            .join(",");

        var DoctorIds = $scope.mainBillerDataObj.AllDoctorsList
            .filter(pitem => pitem.isChecked)
            .map(pitem => pitem.DoctorID)
            .join(",");

        var VisitReasonIds = $scope.AllVisitReasons
            .filter(pitem => pitem.isChecked)
            .map(pitem => pitem.ParentAppointmentVisitReasonId)
            .join(",");

        var BillingStatusIds = $scope.BillingEncounterStatus
            .filter(pitem => pitem.isChecked)
            .map(pitem => pitem.EncounterStatusId)
            .join(",");

        if (!BillingStatusIds || BillingStatusIds.length === 0) {
            BillingStatusIds = EncounterStatusId || '';
        }
        //var SuperBillStatus = $scope.SuperBillStatusList
        //    .filter(pitem => pitem.isChecked)
        //    .map(pitem => pitem.SuperBillStatus)
        //    .join(",");

        var cacheobj = {
            "FromDate": $scope.searchClaimEncounterReqObj.FromDate,
            "ToDate": $scope.searchClaimEncounterReqObj.ToDate,
            "SelectedBranchesList": Locationids || '',
            "SelectedDoctorsList": DoctorIds || '',
            "Visitreasons": VisitReasonIds || '',
            "BillingEncounterStatus": BillingStatusIds || '',
        };

        eHnoteMasterDataService.addSelectedEncountersList(cacheobj);
        var params = {
            "OrganizationId": $scope.HospitalId,
            "OrganizationFacilityId": $scope.searchClaimEncounterReqObj.OrganizationFacilityId || 0,
            "PageSize": $scope.searchClaimEncounterReqObj.PageSize,
            "PageNumber": $scope.searchClaimEncounterReqObj.PageNumber,
            "FromDate": $scope.searchClaimEncounterReqObj.FromDate,
            "ToDate": $scope.searchClaimEncounterReqObj.ToDate,
            "PatientId": $scope.searchClaimEncounterReqObj.PatientId || 0,
            "PatientMrNo": $scope.searchClaimEncounterReqObj.PatientMrNo || "",
            "SearchText": $scope.searchClaimEncounterReqObj.SearchText || "",
            "PatientMobile": "",
            "FacilityListIds": '',
            "Locationids": Locationids || '',
            "DoctorId": DoctorIds || '',
            "VisitReasonId": VisitReasonIds || '',
            "EncounterStatusId": BillingStatusIds || '',
            //"SuperBillStatus": SuperBillStatus || '',
        };

        params.FromDate = $filter("usdateFormatter")(params.FromDate, "-");
        params.ToDate = $filter("usdateFormatter")(params.ToDate, "-");
        eHnotePatientDataService.GetOrganizationSuperBills(params).then(function (resp) {

            console.log(JSON.stringify(resp));

            $scope.organizationSuperBillList = resp.data.rows || [];
            if ($scope.organizationSuperBillList.length > 0) {
                angular.forEach($scope.organizationSuperBillList, function (item) {
                    item.ResponcibilityId = 0;
                    item.IsResponsibilitySame = false;
                    if (item.SuperBillArray.length > 0) {
                        var firstResponsibilityId = item.SuperBillArray[0].ResponcibilityId || null;
                        var isSame = item.SuperBillArray.every(sitem => sitem.ResponcibilityId === firstResponsibilityId);
                        item.IsResponsibilitySame = isSame;
                        if (item.IsResponsibilitySame) {
                            item.ResponcibilityId = firstResponsibilityId;
                        }

                        var TemppatientClaimno = $filter("filter")(item.SuperBillArray, function (subItem) {
                            return subItem.PatientClaimNumber !== null && subItem.PatientClaimNumber !== 0;
                        });
                        var claimsArray = _.map(TemppatientClaimno, function (subItem) {
                            return {
                                PatientClaimId: subItem.PatientClaimId,
                                PatientClaimNumber: subItem.PatientClaimNumber
                            };
                        });
                        item.uniqueClaimsArray = [];
                        item.uniqueClaimsArray = _.uniq(claimsArray, "PatientClaimNumber");
                        var uniqueClaims = _.uniq(_.map(TemppatientClaimno, "PatientClaimNumber").filter(x => x !== null && x !== undefined && x !== ""));
                        item.PatientClaimNumber = uniqueClaims.length > 1 ? uniqueClaims.join(",") : (uniqueClaims[0] || "");
                    }
                });
            }
            $scope.searchClaimEncounterReqObj.Count = resp.data.count;

            claimtype = claimtype || {};
            if (claimtype.action == 'saveandcreate') {

                if ($scope.claimScreenParentObj.SuperBillId === 0 && $scope.claimScreenParentObj.IsSuperBillInd === true && $scope.organizationSuperBillList.length > 0) {
                    var tempApptlist = $filter("filter")($scope.organizationSuperBillList, { "AppointmentId": $scope.claimScreenParentObj.AppointmentId }, true) || [];
                    if (tempApptlist.length > 0) {
                        var firstRecord = tempApptlist[0] || null;
                        if (firstRecord && Array.isArray(firstRecord.SuperBillArray)) {
                            var match = firstRecord.SuperBillArray.find(function (item) {
                                return item.ResponcibilityId === claimtype.values.key1 || 0;
                            });
                            if (match) {
                                $scope.claimScreenParentObj.SuperBillId = match.SuperBillId;
                            }
                        }
                    }
                }

                var templist = $filter("filter")($scope.organizationSuperBillList, { "SuperBillId": $scope.claimScreenParentObj.SuperBillId }, true) || [];
                if (templist.length > 0) {
                    templist[0].ResponcibilityId = claimtype.values.key1 || 0;
                    $scope.navtoGenerateClaim("AddClaim", templist[0]);
                }
            } else {
                if (typeof claimtype === 'object' && claimtype !== null && claimtype.PatientClaimNumber) {
                    claimtype.TotalPatientBalance = claimtype.TotalPatientBalance || 0;
                    claimtype.CurrentResponsibilityId = claimtype.CurrentResponsibilityId || 0;

                    if (claimtype.TotalPatientBalance !== 0 && claimtype.CurrentResponsibilityId != 3) {
                        $scope.navtoOpenAddDepositAmount(claimtype);
                    }
                }
            }


            $scope.GetSuperBillEncounterStatusCount(BillingStatusIds)
            //if (DoctorIds == "" && $scope.emptyDoctorCheckCount < 2) {
            //    $scope.SearchCLaimEncounters();
            //    $scope.emptyDoctorCheckCount++;
            //}

        }, function (err) { console.log(err); });


    }


    $scope.SearchEncounterfreezing = function () {

        $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';

        $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
        if ($scope.selectedEncounterslist != '') {
            var Encounterstatus = $scope.selectedEncounterslist.BillingEncounterStatus || "";
        }
        $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', Encounterstatus);
    }

    $scope.selectedEncounterStatusIds = '1';
    $scope.activeEncounterTab = null;

    $scope.otherStatuses = [];
    $scope.mainStatuses = [];
    $scope.init = function (type) {
        $scope.isIojOrgEnable = false;
        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
            $scope.isIojOrgEnable = true;
            $scope.selectedEncounterStatusIds = '1,2,3,4,5,6,7,8';
            $scope.activeEncounterTab = 'ALL';
            $scope.searchClaimEncounterReqObj.EncounterStatusId = "";
        };
        $scope.FacilityTypeObj = {
            "SelectStatusString": "All",
            "Name": "",
            "AllStatusCheck": true
        };
        $scope.MasterClaimStatusList = [];
        $scope.OrganizationFacilityList = [];
        $scope.AllVisitReasons = [];
        $scope.ClaimResponsibilities = [];
        $scope.AllDoctorsList = $scope.mainBillerDataObj.AllDoctorsList || [];
        $scope.AllSubSpecializationsArray = $scope.mainBillerDataObj.AllSubSpecializationsArray || [];

        var obj = {
            "OrganizationId": $scope.HospitalId,
            "FacilityName": ""
        }

        type = type || "";
        var Locationids = '';
        if (type === "pageLoad") {
            Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
        } else {
            Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
        }


        let visitreasonParams = {
            "OrganizationId": Locationids || $scope.HospitalId,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };

        $q.all([
            // eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            /*   eHnoteMainAdminServices.GetOrganizationFacilityDetails(obj),*/
            eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(visitreasonParams),



        ]).then(function (resp) {


            //if (resp[0].data.status === "Success") {
            //    if (resp[0].data.row.length > 0) {
            //        $scope.allSubSpecializationsArray = resp[0].data.row||[];
            //        $scope.listSubSplArray = angular.copy(resp[0].data.row);
            //        angular.forEach($scope.allSubSpecializationsArray, function (item) {
            //            item.isChecked = true;
            //        });
            //    }


            //}

            if (resp[0].data.status == "Success") {
                resp[0].data.rows = resp[0].data.rows || [];

                $scope.ClaimResponsibilities = resp[0].data.MasterClaimResponsibility || [];

                if (resp[0].data.ClaimStatus.length > 0) {
                    $scope.MasterClaimStatusList = angular.copy(resp[0].data.ClaimStatus);
                    $scope.serchobj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                        return status.ClaimStatusId;
                    }).join(',');
                    console.log($scope.serchobj.ClaimStatusList);
                }
                if (resp[0].data.BillingEncounterStatus.length !== 0) {
                    $scope.BillingEncounterStatus = resp[0].data.BillingEncounterStatus || [];

                    $scope.mainStatuses = $scope.BillingEncounterStatus.filter(function (s) {
                        return s.EncounterStatusId !== 3 && s.EncounterStatusId !== 8;
                    });

                    $scope.otherStatuses = $scope.BillingEncounterStatus.filter(function (s) {
                        return s.EncounterStatusId === 3 || s.EncounterStatusId === 8;
                    });


                }
                if ($scope.BillingEncounterStatus.length > 0) {
                    if ($scope.isIojOrgEnable == true) {
                        $scope.BillingEncounterStatus.forEach(item => {
                            /*item.isChecked = [1, 6, 7, 8].includes(item.EncounterStatusId);*/
                            item.isChecked = true;// [1].includes(item.EncounterStatusId);
                        });
                    }
                    else {
                        $scope.BillingEncounterStatus.forEach(item => {
                            /*item.isChecked = [1, 6, 7, 8].includes(item.EncounterStatusId);*/
                            item.isChecked = [1].includes(item.EncounterStatusId);
                        });
                    }


                    //var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    //$scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    //if ($scope.AllSelectionObj.AllBillingStatusCheck == true) {
                    //    $scope.selectedstatus = "All";
                    //} else {
                    //    if (checkedArray.length === 1) {
                    //        $scope.selectedstatus = checkedArray[0].EncounterStatus;
                    //    } else {
                    //        $scope.selectedstatus = "Selected";
                    //    }
                    //}
                }


            }

            //if (resp[1].data.status == "Success") {
            //    resp[1].data.rows = resp[1].data.rows || [];
            //    if (resp[1].data.rows.length > 0) {
            //        $scope.OrganizationFacilityList = angular.copy(resp[1].data.rows);

            //        angular.forEach($scope.OrganizationFacilityList, function (kitem) {
            //            kitem.IsChecked = true;
            //        });
            //        $scope.FacilityTypeObj.AllStatusCheck = true;
            //        $scope.FacilityTypeObj.SelectStatusString = 'All';
            //    }
            //}

            if (resp[1].data.status === "Success") {
                $scope.AllVisitReasons = angular.copy(resp[1].data.rows) || [];
                if ($scope.AllVisitReasons.length > 0) {
                    $scope.AllVisitReasons = $filter("filter")($scope.AllVisitReasons, function (item) {
                        return item.ActiveIND === 'Y';
                    });
                    angular.forEach($scope.AllVisitReasons, function (item) {
                        item.isChecked = true;
                    });
                }
            }

            $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
            if ($scope.selectedEncounterslist != '') {
                $scope.searchClaimEncounterReqObj.FromDate = $scope.selectedEncounterslist.FromDate || null;
                $scope.searchClaimEncounterReqObj.ToDate = $scope.selectedEncounterslist.ToDate || null;
                $scope.showifnotCurrentDate = false;
                var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if (CurrentDate !== $scope.searchClaimEncounterReqObj.FromDate) {
                    $scope.showifnotCurrentDate = true;
                }
                $scope.selectedEncounterslist.SelectedBranchesList = $scope.selectedEncounterslist.SelectedBranchesList || '';
                if ($scope.mainBillerDataObj.AllBranchesList.length > 0 && $scope.selectedEncounterslist.SelectedBranchesList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });

                    let allChecked = true;
                    var selectedClinicIds = $scope.selectedEncounterslist.SelectedBranchesList.split(",");
                    // Re-check only those items in the array that match the ClinicIds
                    $scope.mainBillerDataObj.AllBranchesList.forEach(pitem => {
                        if (pitem.ClinicId) {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                            allChecked = allChecked && pitem.IsChecked;
                        }
                    });

                    ($scope.mainBillerDataObj.AllBranchesList.find(p => p.ClinicId === 0) || {}).IsChecked = allChecked;

                    console.log(allChecked + "_IsAllBranchesList Checked");

                    var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
                    var AllLocationIND = checkedArray.length > 0 && $scope.mainBillerDataObj.AllBranchesList.length === checkedArray.length ? true : false;
                    if (AllLocationIND) {
                        $scope.LocationTypeObj.SelectLocationString = "All Locations";
                    } else if (checkedArray.length == 1) {
                        $scope.LocationTypeObj.SelectLocationString = checkedArray[0].ClinicName || "Select";
                    } else {
                        $scope.LocationTypeObj.SelectLocationString = "Selected";
                    }
                }

                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
                    $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedDoctor = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            $scope.selectedDoctor = "Selected";
                        }
                    }
                }

                if ($scope.AllVisitReasons.length > 0 && $scope.selectedEncounterslist.Visitreasons != '') {
                    angular.forEach($scope.AllVisitReasons, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedVrIds = $scope.selectedEncounterslist.Visitreasons.split(",");
                    $scope.AllVisitReasons.forEach(pitem => {
                        pitem.isChecked = selectedVrIds.includes(pitem.ParentAppointmentVisitReasonId.toString());
                    });

                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                    if ($scope.AllSelectionObj.AllVisitReasonsCheck) {
                        $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
                    } else {
                        $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
                    }
                }
              
                if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
                    $scope.selectedEncounterslist.BillingEncounterStatus = "";
                } else {
                    $scope.selectedEncounterslist.BillingEncounterStatus = "1";
                }
                $scope.selectedEncounterslist.BillingEncounterStatus = $scope.selectedEncounterslist.BillingEncounterStatus || '';
                if ($scope.BillingEncounterStatus.length > 0 && $scope.selectedEncounterslist.BillingEncounterStatus != '') {
                    angular.forEach($scope.BillingEncounterStatus, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    // var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.split(",");

                    if ($scope.selectedEncounterslist && $scope.selectedEncounterslist.BillingEncounterStatus) {
                        var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.toString().split(",");
                    }
                    $scope.BillingEncounterStatus.forEach(pitem => {
                        pitem.isChecked = selectedEncounterIds.includes(pitem.EncounterStatusId.toString());
                    });


                    //var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    //$scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    //if (checkedArray.length == 0) {
                    //    $scope.selectedstatus = "Select";
                    //} else {
                    //    if (checkedArray.length === 1) {
                    //        $scope.selectedstatus = checkedArray[0].EncounterStatus;
                    //    } else {
                    //        $scope.selectedstatus = "Select";
                    //    }
                    //}
                }
            } else {
                $scope.searchClaimEncounterReqObj = {
                    FromDate: moment().format("MM-DD-YYYY"),
                    ToDate: moment().format("MM-DD-YYYY"),

                }
            }

            //if ($scope.AllSubSpecializationsArray.length == 0) {
            //    eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
            //        if (resp.data.row.length > 0) {
            //            $scope.allSubSpecializationsArray = resp.data.row;
            //            angular.forEach($scope.allSubSpecializationsArray, function (item) {
            //                item.isChecked = true;
            //            });
            //            $scope.mainBillerDataObj.AllSubSpecializationsArray = $scope.allSubSpecializationsArray || [];

            //        }
            //    });
            //}

            if ($scope.mainBillerDataObj.AllDoctorsList.length == 0) {

                $scope.allUserList = $scope.mainBillerDataObj.AllUsersList;


                if ($scope.allUserList.length !== 0) {

                    $scope.AllDoctorsList = angular.copy($scope.allUserList);
                }

                $scope.AllDoctorsList = _.uniq($scope.AllDoctorsList, false, function (p) { return p.DoctorID; });
                $scope.mainBillerDataObj.AllDoctorsList = angular.copy($scope.AllDoctorsList);

                $scope.mainBillerDataObj.AllDoctorsList = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (ditem) {
                    ditem.isChecked = true;
                });
                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });
                }
                $scope.selectedDoctor = 'All Doctors';
                $scope.AllSelectionObj.AllDoctorCheck = true;
            }

            //$scope.$watch(() => $scope.mainBillerDataObj?.AllDoctorsList?.length,
            //    function (newVal) {
            //        if (newVal > 0) {
            //            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', $scope.searchClaimEncounterReqObj.EncounterStatusId);
            //        }
            //    });
            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', $scope.searchClaimEncounterReqObj.EncounterStatusId);

        });


        $scope.defaultbranch = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.AppListselectedclinic = $scope.mainBillerDataObj.AllBranchesList[0];

        angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (item) {
            item.IsChecked = true;
            //if (item.ClinicId == $scope.doctorinfo.doctordata.UserAddress[0].ClinicId) {
            //    item.IsChecked = true;
            //}

        });

    };

    $scope.init("pageLoad");

    $scope.Changestatus = function (Id) {
        var filtredArray = $filter("filter")($scope.BillingEncounterStatus, { "EncounterStatusId": Id }, true) || [];
        if (filtredArray.length > 0) {
            $scope.searchClaimEncounterReqObj.EncounterStatus = filtredArray[0].EncounterStatus;
        } else {
            $scope.searchClaimEncounterReqObj.EncounterStatus = "";
        }
    }


    $scope.navtoSuperViewpopup = function (visit, item) {
        var obj = {
            "SuperBillId": visit.SuperbillId || 0,
            "AppointmentId": item.AppointmentId || 0,
            "PatientObj": item.Patient || 0,
            "item": item || 0,
        };

        let signmodalInstance = $uibModal.open({
            "templateUrl": "templates/UsClaims/SuperbillViewPopup.html",
            "size": "md",
            "windowClass": "modal__ninety--",
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "obj": function () { return obj; }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, obj, eHnoteInsuranceService, eHnoteMasterDataService) {

                $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.HospitalId = 0;
                $scope.ParentHospitalId = 0;
                if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                    && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                    $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                }
                $scope.IsResponsibilitySame = false;
                $scope.obj = obj;
                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss("cancel");
                }

                $scope.SelectedSuperbillObj = {
                    "PatientDOB": "",
                    "PatientFullName": "",
                    "PatientGender": "",
                    "IsCheckAllPayments": false,
                    "PatientId": null,
                    "VisitId": null,
                    "SuperBillId": null,
                    "AppointmentId": null,
                    "AppointmentDoctorId": null,
                    "PatientMrNo": "",
                    "PatientMobile": "",
                    "AppointmentId": "",
                    "AppointmentTypeId": null,
                    "EncounterStatus": "",
                    "EncounterStatusId": 7,
                    "AppointmentInsuranceList": [],
                    "SuperBillArray": [],
                    "SuperBillDiagnosisArray": [],
                    "AvailableDeposit": 0,
                    "TotalPatientDue": 0,
                    "UnallocatedAmount": 0,
                    "InsuranceBalance": 0,
                    "AppointmentDate": ""


                }

                $scope.ClaimResponsibilityId = null;
                $scope.subinit = function (val) {
                    $scope.Iscmngfrom = val || '';
                    $scope.ResponsibilityArray = [];

                    let obj = {
                        "SuperBillId": $scope.obj.SuperBillId,
                        "AppointmentId": $scope.obj.AppointmentId,
                        "PatientId": $scope.obj.PatientObj.PatientId,
                    }

                    $q.all([

                        eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                        eHnoteInsuranceService.GetOrganizationSuperBillsSuperBillId(obj),



                    ]).then(function (resp) {
                        if (resp[0].data.status == "Success") {
                            resp[0].data.rows = resp[0].data.rows || [];

                            $scope.ClaimResponsibilities = resp[0].data.MasterClaimResponsibility || [];
                            $scope.TempClaimResponsibilities = resp[0].data.MasterClaimResponsibility || [];


                        }
                        if (resp[1].data.status == "Success") {

                            $scope.SelectedSuperbillObj.AvailableDeposit = resp[1].data.TotalDepositAvailable;
                            $scope.SelectedSuperbillObj.TotalPatientDue = resp[1].data.TotalPatientBalance;
                            $scope.SelectedSuperbillObj.UnallocatedAmount = resp[1].data.TotalUnAllocatedAmount;
                            $scope.SelectedSuperbillObj.InsuranceBalance = resp[1].data.TotalPatientInsuranceBalance;
                            if (resp[1].data.rows.length > 0) {
                                $scope.selectedobj = resp[1].data.rows[0];
                                $scope.SelectedSuperbillObj.VisitId = $scope.selectedobj.VisitId;
                                $scope.SelectedSuperbillObj.AppointmentId = $scope.selectedobj.AppointmentId;
                                $scope.SelectedSuperbillObj.AppointmentTypeId = $scope.selectedobj.AppointmentTypeId;
                                $scope.SelectedSuperbillObj.AppointmentDoctorId = $scope.selectedobj.AppointmentDoctorId;
                                $scope.SelectedSuperbillObj.PatientId = $scope.selectedobj.PatientId;
                                $scope.SelectedSuperbillObj.PatientFullName = $scope.selectedobj.PatientFullName;
                                $scope.SelectedSuperbillObj.PatientDOB = $scope.selectedobj.PatientDOB;
                                $scope.SelectedSuperbillObj.PatientMrNo = $scope.selectedobj.PatientMrNo;
                                $scope.SelectedSuperbillObj.PatientGender = $scope.selectedobj.PatientGender;
                                $scope.SelectedSuperbillObj.PatientMobile = $scope.selectedobj.PatientMobile;
                                if ($scope.SelectedSuperbillObj.PatientMobile != '') {
                                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.SelectedSuperbillObj.PatientMobile);
                                    $scope.SelectedSuperbillObj.PatientMobile = obj.UsFormatMobileNumber;
                                }
                                $scope.SelectedSuperbillObj.EncounterStatusId = $scope.selectedobj.EncounterStatusId;
                                $scope.SelectedSuperbillObj.EncounterStatus = $scope.selectedobj.EncounterStatus;
                                $scope.SelectedSuperbillObj.SuperBillRemarks = $scope.selectedobj.SuperBillRemarks;
                                $scope.SelectedSuperbillObj.SuperBillId = $scope.selectedobj.SuperBillId;
                                $scope.SelectedSuperbillObj.SuperBillDiagnosisArray = angular.copy($scope.selectedobj.SuperBillDiagnosisArray) || [];
                                $scope.SelectedSuperbillObj.SuperBillArray = $scope.selectedobj.SuperBillArray || [];
                                $scope.SelectedSuperbillObj.AppointmentDate = $scope.selectedobj.AppointmentDate || "";

                                $scope.SelectedSuperbillObj.AppointmentInsuranceList = $scope.selectedobj.AppointmentInsuranceList || [];
                                if ($scope.SelectedSuperbillObj.SuperBillArray.length > 0) {
                                    angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                                        //item.ResponcibilityId = null;
                                        item.IsChecked = true;

                                        if (item.DiagnosisArray && item.DiagnosisArray.length > 0) {
                                            // Extract all ICD10CODEs and join them with commas
                                            item.diasisgonpointer = item.DiagnosisArray
                                                .map(function (d) { return d.ICD10CODE; })
                                                .join(",");
                                        } else {
                                            item.diasisgonpointer = ""; // No diagnosis codes
                                        }
                                        if (item.Modifiers && item.Modifiers.length > 0) {
                                            item.modifierpointer = item.Modifiers
                                                .map(function (m) { return m.ModifierCode; })
                                                .join(",");
                                        } else {
                                            item.modifierpointer = "";
                                        }
                                    });


                                    $scope.ResponsibilityArray = [];

                                    angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                                        item.ResponcibilityId = item.ResponcibilityId || null;
                                        if (item.ResponcibilityId == null) {
                                            item.ResponcibilityId = 2;
                                            // return;
                                        }
                                        var exists = $scope.ResponsibilityArray.some(function (r) {
                                            return r.ResponcibilityId === item.ResponcibilityId;
                                        });
                                        if (!exists) {
                                            $scope.ResponsibilityArray.push({
                                                ResponcibilityId: item.ResponcibilityId,
                                                ResponcibilityName: item.ResponcibilityName
                                            });
                                        }
                                    });

                                    if ($scope.ResponsibilityArray.length == 1) {
                                        $scope.ClaimResponsibilityId = $scope.ResponsibilityArray[0].ResponcibilityId;
                                    }

                                } else {

                                    if ($scope.Iscmngfrom == "Refresh") {
                                        $uibModalInstance.close("cancel");
                                    }

                                }

                            }
                        }

                    });
                }
                $scope.subinit();


                $scope.onselectResp = function (item) {
                    
                    const activeIns = $filter("filter")($scope.SelectedSuperbillObj.AppointmentInsuranceList, { StatusId: 1 }) || [];

                    if ([2, 3,7].includes(item.ResponcibilityId) && activeIns.length === 0) {
                        item.ResponcibilityId = 1;
                        alertify.error("There is no insurance available");
                        return false;
                    }


                    var filteredArray = $filter("filter")($scope.ClaimResponsibilities, { "ResponcibilityId": item.ResponcibilityId }, true);
                    if (filteredArray.length > 0) {
                        item.ResponcibilityName = filteredArray[0].ResponcibilityName;
                    }
                    $scope.ResponsibilityArray = [];
                    angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                        item.ResponcibilityId = item.ResponcibilityId || null;
                        if (item.ResponcibilityId == null) {
                            item.ResponcibilityId = 2;
                        }
                        var exists = $scope.ResponsibilityArray.some(function (r) {
                            return r.ResponcibilityId === item.ResponcibilityId;
                        });
                        if (!exists) {
                            $scope.ResponsibilityArray.push({
                                ResponcibilityId: item.ResponcibilityId,
                                ResponcibilityName: item.ResponcibilityName
                            });
                        }
                    });
                    if ($scope.ResponsibilityArray.length == 1) {
                        $scope.ClaimResponsibilityId = $scope.ResponsibilityArray[0].ResponcibilityId;
                    }
                }
                //$scope.onselectResponsibility = function (item) {
                //    const claimLines = $scope.SelectedSuperbillObj.SuperBillArray || [];
                //    const activeIns = $filter("filter")($scope.SelectedSuperbillObj.AppointmentInsuranceList, { StatusId: 1 }) || [];

                //    if ([2, 3].includes(item.ResponcibilityId) && activeIns.length === 0) {
                //        item.ResponcibilityId = 0;
                //        alertify.error("There is no insurance available");
                //    }

                //    const firstResId = claimLines[0]?.ResponcibilityId || 0;
                //    const filteredItems = claimLines.filter(cl => cl.ServiceId !== 0);
                //    const isSame = filteredItems.every(cl => cl.ResponcibilityId === firstResId);

                //    $scope.IsResponsibilitySame = isSame;
                //    $scope.ClaimResponsibilityId = firstResId;
                //};

                $scope.Changeitem = function (item) {
                    var checkedArray = _.where($scope.SelectedSuperbillObj.SuperBillArray, { IsChecked: true });
                    $scope.SelectedSuperbillObj.IsCheckAllPayments = checkedArray.length > 0 && $scope.SelectedSuperbillObj.SuperBillArray.length === checkedArray.length ? true : false;
                }







                $scope.SelectAllPayments = function () {
                    angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                        if ($scope.SelectedSuperbillObj.IsCheckAllPayments) {
                            item.IsChecked = true;
                        } else {
                            item.IsChecked = false;
                        }
                    });
                }

                $scope.navtoGenerateClaimPopup = function (type, item, VisitItem, typeid) {
                    item = item || '';
                    typeid = typeid || 0;
                    item.IsFrom = item.IsFrom || "";
                    item.ResponcibilityId = item.ResponcibilityId || 0;
                    if (item.IsFrom === "ManualBill") {
                        item.ResponcibilityId = 1;
                    }
                    VisitItem = VisitItem || '';
                    $scope.filterlist = [];
                    item.SuperBillArray = item.SuperBillArray || [];
                    if (item.SuperBillArray.length > 0) {
                        $scope.filterlist = $filter('filter')(item.SuperBillArray, { 'DeleteInd': 'N' }, true) || [];
                        //if ($scope.filterlist.length > 0 && item.ResponcibilityId == 0) {
                        //    alertify.error("Please select claim responsibility.");
                        //    return false;
                        //}
                    }
                    //else if (item.ResponcibilityId == 0 && typeid == 1) {
                    //    alertify.error("Please select claim responsibility.");
                    //    return false;
                    //}

                    if (VisitItem == undefined || VisitItem == '') {
                        var VisitItem = {
                            "VisitId": item.VisitId
                        }
                    }

                    let AppointmentId = null;
                    let PatientId = null;
                    let OrganizationFacilityId = null;
                    if (item != '') {
                        AppointmentId = item.AppointmentId;
                        PatientId = item.PatientId;
                    }

                    VisitItem.OrganizationFacilityId = null;
                    $scope.ResponcibilityList = [];
                    if (item.ResponcibilityId !== 0 && $scope.filterlist.length > 0) {
                        if ($scope.filterlist.length > 0) {
                            var count = 0;
                            angular.forEach($scope.filterlist, function (mitem) {
                                if (mitem.ResponcibilityId == item.ResponcibilityId) {
                                    count++;
                                    $scope.ResponcibilityList.push(mitem);

                                    if (mitem.DiagnosisArray.length > 0) {
                                        angular.forEach(mitem.DiagnosisArray, function (mitem) {
                                            angular.forEach(item.SuperBillDiagnosisArray, function (sitem) {
                                                if (mitem.DiagnosisId === sitem.DiagnosisId) {
                                                    sitem.IsAvailable = true;
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                            if (count == 0) {
                                //alertify.error("The selected responsibility not existed");
                                //return false;
                            }
                        }
                    } else if (item.ResponcibilityId !== 0 && typeid == 1) {
                        //alertify.error("The selected responsibility not existed");
                        //return false;
                    }
                    if (item.SuperBillArray.length > 0 && $scope.ResponcibilityList.length > 0) {
                        item.SuperBillArray = angular.copy($scope.ResponcibilityList);
                        item.SuperBillDiagnosisArray = $filter("filter")(item.SuperBillDiagnosisArray, function (sitem) {
                            return sitem.IsAvailable === true;
                        }) || [];

                    }
                    $scope.claimScreenParentObj = {
                        "PatientId": PatientId || null,
                        "AppointmentId": AppointmentId || null,
                        "AppointmentTypeId": item.AppointmentTypeId || $scope.SelectedSuperbillObj.AppointmentTypeId,
                        "AppointmentDate": item.AppointmentDate || $scope.obj.item.AppointmentDate,
                        "EncounterStatus": item.EncounterStatus || "Ready To Bill",
                        "EncounterStatusId": item.EncounterStatusId || 1,
                        "PatientFullName": item.PatientFullName || "",
                        "ActionType": type || "AddClaim",
                        "ScreenType": "Popup",
                        "SuperBillId": item.SuperBillId || 0,
                        "ResponcibilityId": item.ResponcibilityId || 0,
                        "VisitId": VisitItem.VisitId || 0,
                        "SuperBillArray": item.SuperBillArray || [],
                        "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
                        "IsCreateSuperBill": item.IsCreateSuperBill,
                        "PatientClaimId": 0,
                        "OrganizationFacilityId": item.OrganizationFacilityId || 0,
                        "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
                        "IsResponsibilitySame": item.IsResponsibilitySame,
                        "SuperBillRemarks": item.SuperBillRemarks
                    };

                    datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
                    item.ScreenType = item.ScreenType || 0;
                    if (item.ScreenType == 3) {
                        $scope.mainBillerDataObj.Tabid = 3;
                    } else {
                        $scope.mainBillerDataObj.Tabid = 1;
                    }


                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                        "controller": "UsAddUpdateClaimPopupCtrl",
                        "keyboard": false,
                        'backdrop': 'static',
                        "windowClass": "modal__popup--1",
                        "resolve": {
                            "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
                        }
                    });
                    $scope.mInstanceAdd.result.then(function (resp) {


                        console.log(resp);
                        $scope.subinit("Refresh");
                    }, function () { });
                }

                $scope.CreateClaim = function (val) {

                    $scope.ClaimResponsibilityId = val || null;

                    if ($scope.ResponsibilityArray.length === 0) {
                        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient has no service line items. Do you still want to create the claim?</h4>", function () {

                            let obj = {
                                "AppointmentDate": $scope.SelectedSuperbillObj.AppointmentDate || null,
                                "ResponcibilityId": $scope.ClaimResponsibilityId || null,
                                "PatientId": $scope.SelectedSuperbillObj.PatientId || null,
                                "PatientFullName": $scope.SelectedSuperbillObj.PatientFullName || "",
                                "AppointmentId": $scope.SelectedSuperbillObj.AppointmentId || null,
                                "AppointmentTypeId": $scope.SelectedSuperbillObj.AppointmentTypeId || null,
                                "AppointmentDoctorId": $scope.SelectedSuperbillObj.AppointmentDoctorId || null,
                                "ScreenType": "saveandcreate",
                                "SuperBillArray": [],
                                "SuperBillId": $scope.SelectedSuperbillObj.SuperBillId || null,
                                "SuperBillDiagnosisArray": [],
                                "IsFrom": ""
                            }

                            $scope.CreateClaimLinkInd = true;
                            $scope.navtoGenerateClaimPopup("AddClaim", obj);
                            $uibModalInstance.dismiss("cancel");
                        }, function () {
                            r = "You pressed Cancel!";
                        });
                        $scope.CreateClaimLinkInd = false;
                        return false;
                    }



                    const typeMap = {};
                    let nextTypeCode = 65;

                    function normalizeDiagnosisTypes(superBillArray) {

                        angular.forEach(superBillArray, function (item) {
                            angular.forEach(item.DiagnosisArray, function (d) {

                                if (!d.DiagnosisId) return;

                                let cleanedType = (d.Type || "").replace(/\u0000/g, "").trim();

                                if (cleanedType && /^[A-Z]$/.test(cleanedType)) {
                                    typeMap[d.DiagnosisId] = cleanedType;
                                }
                            });
                        });

                        angular.forEach(superBillArray, function (item) {
                            angular.forEach(item.DiagnosisArray, function (d) {

                                if (!d.DiagnosisId) return;

                                if (typeMap[d.DiagnosisId]) {
                                    d.Type = typeMap[d.DiagnosisId];
                                } else {
                                    let newType = String.fromCharCode(nextTypeCode++);
                                    typeMap[d.DiagnosisId] = newType;
                                    d.Type = newType;
                                }
                            });
                        });
                    }


                    normalizeDiagnosisTypes($scope.SelectedSuperbillObj.SuperBillArray);

                    if ($scope.SelectedSuperbillObj.SuperBillDiagnosisArray.length === 0) {

                        angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                            angular.forEach(item.DiagnosisArray, function (aitem) {

                                var obj = {
                                    "SuperBillDiagnosisId": aitem.SuperBillDiagnosisId || 0,
                                    "DiagnosisId": aitem.DiagnosisId,
                                    "DiagnosisName": aitem.ICD10DIAGDESCRIPTION,
                                    "DiagnosisNotes": "",
                                    "DiagnosisCode": aitem.ICD10CODE,
                                    "ICD10Code": aitem.ICD10CODE,
                                    "FullName": aitem.ICD10CODE + '-' + aitem.ICD10DIAGDESCRIPTION,
                                    "HospitalId": aitem.HospitalId || $scope.HospitalId,
                                    "UserId": aitem.UserId || $scope.UserId,
                                    "Type": aitem.Type,
                                    "DeleteInd": "N"
                                };

                                var exists = $scope.SelectedSuperbillObj.SuperBillDiagnosisArray
                                    .some(x => x.DiagnosisId === aitem.DiagnosisId);

                                if (!exists) {
                                    $scope.SelectedSuperbillObj.SuperBillDiagnosisArray.push(obj);
                                }
                            });
                        });
                    }

                    else {
                        angular.forEach($scope.SelectedSuperbillObj.SuperBillDiagnosisArray, function (d) {
                            if (!d.DiagnosisId) return;

                            let cleaned = (d.Type || "").replace(/\u0000/g, "").trim();

                            if (!cleaned || !/^[A-Z]$/.test(cleaned)) {
                                d.Type = typeMap[d.DiagnosisId];
                            }
                        });
                    }


                    let reqObj = {
                        "UserId": $scope.UserId,
                        "AppointmentId": $scope.SelectedSuperbillObj.AppointmentId,
                        "VisitId": $scope.SelectedSuperbillObj.VisitId || 0,
                        "OrganizationId": $scope.HospitalId,
                        "SuperBillRemarks": $scope.SelectedSuperbillObj.SuperBillRemarks || "",
                        "SuperBillId": $scope.SelectedSuperbillObj.SuperBillId || null,
                        "SuperBillArray": $scope.SelectedSuperbillObj.SuperBillArray || [],
                        "SuperBillDiagnosisArray": $scope.SelectedSuperbillObj.SuperBillDiagnosisArray || [],
                        "EncounterStatusId": $scope.SelectedSuperbillObj.EncounterStatusId || 0,
                        "EncounterStatus": $scope.SelectedSuperbillObj.EncounterStatus || "",
                        "DeleteInd": "N"
                    }
                    eHnoteDiagnosisDataServices.AddupdateSuperBill(reqObj).then(function (resp) {
                        if (resp.data.Status === "Success") {

                            $scope.selectedobj.SuperBillDiagnosisArray = $scope.selectedobj.SuperBillDiagnosisArray || [];
                            if ($scope.selectedobj.SuperBillDiagnosisArray.length === 0) {
                                angular.forEach($scope.SelectedSuperbillObj.SuperBillDiagnosisArray, function (d) {
                                    d.ICD10CODE = d.ICD10Code;
                                    d.ICD10DIAGDESCRIPTION = d.DiagnosisName;
                                });
                            }

                            let obj = {
                                "AppointmentDate": $scope.SelectedSuperbillObj.AppointmentDate || null,
                                "ResponcibilityId": $scope.ClaimResponsibilityId || null,
                                "PatientId": $scope.SelectedSuperbillObj.PatientId || null,
                                "PatientFullName": $scope.SelectedSuperbillObj.PatientFullName || "",
                                "AppointmentId": $scope.SelectedSuperbillObj.AppointmentId || null,
                                "AppointmentDoctorId": $scope.SelectedSuperbillObj.AppointmentDoctorId || null,
                                "ScreenType": "saveandcreate",
                                "SuperBillArray": $scope.SelectedSuperbillObj.SuperBillArray || [],
                                "SuperBillId": $scope.SelectedSuperbillObj.SuperBillId || null,
                                "SuperBillDiagnosisArray": $scope.SelectedSuperbillObj.SuperBillDiagnosisArray || [],
                                "IsFrom": "",
                            }

                            $scope.navtoGenerateClaimPopup("AddClaim", obj);

                        }
                    }, function (err) {
                        alertify.error("Fetching data failed!");

                    });



                }
            }

        });
        signmodalInstance.result.then(function (resp) {

            //let obj = {
            //    "AppointmentDate": null,
            //    "ResponcibilityId": resp.ResponcibilityId || null,
            //    "PatientId": resp.PatientId || null,
            //    "PatientFullName": resp.SearchText || "",
            //    "AppointmentId": resp.AppointmentId || null,
            //    "ScreenType": "saveandcreate",
            //    "SuperBillArray": resp.SuperBillArray||[],
            //    "SuperBillDiagnosisArray": resp.SuperBillDiagnosisArray || [],
            //    "IsFrom": "",
            //}

            //$scope.navtoGenerateClaim("AddClaim", obj);

        }, function (data) {

        });


    }

    $scope.clicktoNavtoAllAppointments = function () {

        $scope.encountermodelInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AllEncountersPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "resolve": {
                "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                "OrganizationFacilityList": function () { return $scope.OrganizationFacilityList; },
                "AllVisitReasons": function () { return $scope.AllVisitReasons; },
                "allSubSpecializationsArray": function () { return $scope.allSubSpecializationsArray || []; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, AllHospitalData, OrganizationFacilityList, AllVisitReasons, allSubSpecializationsArray, eHnoteAdminDepartmentService) {

                $scope.AllEncounterPatientList = [];
                $scope.OPandOTAppointmentList = [];
                $scope.AppListdoctoraddress = [];
                $scope.clinicDoctorList = [];
                $scope.selectedDoctor = "All Doctors";
                $scope.OPandOTAppointmentListCount = 0;
                $scope.OrganizationFacilityList = OrganizationFacilityList || [];
                $scope.AllVisitReasonsList = AllVisitReasons || [];
                $scope.allSubSpecializationsArray = allSubSpecializationsArray || [];
                /* $scope.clinicDoctorList = AllHospitalData.AllDoctorsList || [];*/

                $scope.clinicDoctorList = $filter("filter")(AllHospitalData.AllDoctorsList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                $scope.SelectedVisitReasonType = 'All';

                let doctorInfo = eHnoteMasterDataService.getUserInfo();
                $scope.DoctorId = doctorinfo.doctordata.User[0].DoctorID;
                $scope.ClinicId = doctorinfo.doctordata.UserAddress[0].ClinicId;


                function getSelectedPatientObj() {
                    var obj = {
                        "SearchText": "",
                        "PatientId": 0,
                        "SearchTypeId": 2,
                        "OrganizationFacilityId": "",
                        "PatientMRNo": "",
                        "DOB": "",
                        "PatientSearchInd": true,
                    }
                    return obj;
                };
                $scope.PatientSearchObj = getSelectedPatientObj();

                $scope.selectedDoctor = {
                    "FullName": "All Doctors"
                }

                $scope.GetExamType = function () {
                    return [{
                        "ExamTypeId": 1,
                        "ExamTypeName": "New Patient"
                    },
                    {
                        "ExamTypeId": 2,
                        "ExamTypeName": "Established Patient"
                    }
                    ];
                };
                $scope.ExamTypeList = angular.copy($scope.GetExamType()) || [];

                $scope.AllEncounterObj = {
                    "AllDoctorCheck": true,
                    "AllVisitReasonsCheck": true,
                    "AllAppointmentTypeStatusCheck": true,
                    "AllBillingStatusCheck": true,
                }

                $scope.LoadPatientListSearch = function (val) {


                    if (val == undefined || val == null || val == "") {
                        $scope.AllPatientList = [];
                        $scope.PatientSearchObj.PatientId = 0;
                        $scope.ShowPatientDetailsDrop = false;
                        return false;
                    }
                    var param = {
                        "PageSize": 21,
                        "UserId": "",
                        "PageNumber": 1,
                        "SearchText": "",
                        "Count": 0,
                        "SearchDetails": { "listdocpatients": "Y" },
                        "EndAge": 0,
                        "StartAge": 0,
                        "StartDate": "",
                        "EndDate": ""
                    };


                    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                            $scope.HospitalArray = [];
                            angular.forEach(doctorInfo.doctordata.UserAddress, function (item) {
                                if (item.ExtDetails !== undefined) {
                                    if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                        var Obj = {
                                            "HospitalName": item.ClinicName,
                                            "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                            "ActiveIND": "Y",
                                            "isChecked": true,
                                            "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                        };
                                        $scope.HospitalArray.push(Obj);
                                    }
                                }
                            });
                        }
                    }
                    var list = [];
                    angular.forEach($scope.HospitalArray, function (items) {
                        if (items.isChecked) {
                            list.push(items.BranchId);
                        }
                    });
                    param["HospitalIDLst"] = list;
                    eHnoteMasterDataService.addPatientSearchInfo(param);
                    var object = {
                        "UserId": $scope.UserId,
                        "HospitalID": $scope.HospitalId,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": $scope.PatientSearchObj.SearchText || "",
                        "SearchTypeID": $scope.PatientSearchObj.SearchTypeId || 0,
                    }
                    if ($scope.PatientSearchObj.SearchTypeId == 1) {
                        object.Name = val;
                    } else if ($scope.PatientSearchObj.SearchTypeId == 2) {
                        object.PatientId = val;
                    }
                    eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
                };

                $scope.ShowPatientDetailsDrop = false;
                function OnGetopSearchPatientSuccess(data) {

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        if (data.rows.length > 0) {
                            $scope.AllPatientList = data.rows || [];
                        }
                        else {
                            $scope.count = 0;
                            $scope.AllPatientList = [];
                        }
                    }

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        $scope.patientDetailsList = [];
                        $scope.patientinitval = {};
                        angular.forEach(data.rows, function (item) {
                            $scope.patientinitval = {};
                            var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                            var val = array_list[Math.floor(Math.random() * array_list.length)];
                            if (item.EmailID !== undefined) {
                                $scope.patientinitval.EmailID = item.EmailID;
                            }

                            $scope.patientinitval.PatientID = item.PatientId;
                            $scope.patientinitval.Title = item.Title;
                            $scope.patientinitval.S3URL = item.S3URL || "";
                            $scope.patientinitval.FullName = item.FullName;
                            $scope.patientinitval.DOB = item.DOB;
                            $scope.patientinitval.AgeInYears = item.AgeInYears;
                            $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                            $scope.patientinitval.AgeInDays = item.AgeInDays;
                            $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                            $scope.patientinitval.Altareacode = item.Altareacode || '';
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                            $scope.patientinitval.Gender = item.Gender;
                            $scope.patientinitval.LastVisited = item.LastVisited;
                            $scope.patientinitval.CountryCode = item.CountryCode;
                            $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                            $scope.patientinitval.CurrentAge = item.CurrentAge;
                            $scope.patientinitval.colors = val;
                            $scope.patientinitval.OldMrno = item.OldMrno || "";
                            $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                            $scope.patientinitval.patientdisplayid = item.DisplayID;
                            $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                            $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                            $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                            $scope.patientinitval.Due = item.Due;
                            $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                            $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                            $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                            $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                            $scope.patientinitval.DisplayID = item.DisplayID || "";
                            $scope.patientinitval.Altareacode = item.Altareacode || "";
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                            $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                            $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                            var previouspatval = angular.copy($scope.patientinitval);
                            $scope.patientDetailsList.push(previouspatval);
                        });
                        $scope.AllPatientList = $scope.patientDetailsList;

                        $scope.noresult = false;
                        $scope.showloading = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $scope.count = 0;
                        $scope.AllPatientList = [];
                    }
                    if ($scope.PatientSearchObj.SearchText != "") {
                        $scope.ShowPatientDetailsDrop = true;
                    }
                }
                function OnGetopPatientSearchError() {
                    $scope.count = 0;
                    $scope.AllPatientList = [];
                    $scope.PatientSearchObj.SearchText = "";
                }

                $scope.clearPatientListData = function () {
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.PatientSearchObj.SearchText = "";
                    $scope.PatientSearchObj.PatientId = 0;
                    $scope.searchClaimEncounterReqObj.PatientId = 0;
                };

                $scope.SelectedPatientData = function (patietnitem) {
                    $scope.PatientSearchObj.PatientId = patietnitem.PatientID;
                    $scope.PatientSearchObj.SearchText = patietnitem.FullName;
                    $scope.AllPatientList = [];
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.SearchAppointmentList();
                };

                $scope.FacilityTypeObj = {
                    "SelectStatusString": "All",
                    "Name": "",
                    "AllStatusCheck": true
                };
                $scope.searchradio = {
                    "PatientSearchType": 2
                };

                $scope.Appointment = {
                    "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                    "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                    "FacilityListIds": "",
                    "LocationIds": "",
                    "SelectedHospitalId": 0,
                };

                $scope.AppointmentType = {
                    "TypeId": "",
                    "VisitTypeId": "",
                };

                $scope.Pagination = { "currentPagePatient": 1, "Patientitemsperpage": 100, "Patientmaxsize": 10 };
                $scope.PageNumber = 1;

                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                };

                $scope.navtocreateEncounter = function (item) {
                    let obj = {
                        "Type": "encounter",
                        "item": item,
                        "VisitItem": "",
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate
                    }
                    $uibModalInstance.close(obj);
                };

                $scope.navtocreateEncounterforVisit = function (visit, item) {


                    let obj = {
                        "Type": "encounter",
                        "item": item,
                        "VisitItem": visit,
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate
                    }
                    $uibModalInstance.close(obj);
                };

                $scope.navtoSuperView = function (visit, item) {
                    let obj = {
                        "Type": "navtoSuperView",
                        "item": item,
                        "VisitItem": visit,
                    }
                    $uibModalInstance.close(obj);
                }




                $scope.navtocreateClaim = function (visit, item) {

                    let obj = {
                        "Type": "navtoclaim",
                        "item": item,
                        "VisitItem": visit,
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate
                    }

                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    appoint_info.AppointmentId = item.AppointmentId || 0;
                    appoint_info.AppointmentID = item.AppointmentId || 0;
                    appoint_info.AppointmentStatus = item.AppointmentStatus || "";
                    appoint_info.AppointmentStatusId = item.AppointmentStatusId || null;


                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);

                    var currentDate = $filter('date')(new Date(), 'MM-dd-yyyy');
                    var appointmentDate = $filter('date')(item.AppointmentDate, 'MM-dd-yyyy');
                    var isTodayAppointment = currentDate === appointmentDate;

                    if ((appoint_info.AppointmentStatusId == 1 || appoint_info.AppointmentStatusId == null) && isTodayAppointment === true) {
                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>The patient isn't Checked In!<br> Do you want to Check In the patient? </h4>", function () {

                            var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");

                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "HospitalId": $scope.HospitalId,
                                "AppointmentId": appoint_info.AppointmentId,
                                "AppointmentTrackerDetailId": 0,
                                "RoleId": $scope.userLoginDetails.RoleID,
                                "VisitReason": "",
                                "AttenderName": "",
                                "DoctorId": null,
                                "DoctorRoleId": null,
                                "RoomTypeId": 9,
                                "RoomId": null,
                                "CurrentTime": CurrentTime,
                                "IsSendTo": "N",
                                "IsCheckedIn": "Y",
                                "IsCheckedOut": "N",
                                "IsReCheckIn": "N",
                                "IsReCheckOut": "N",
                                "AppointmentStatusId": 2,
                                "BookingStatusId": appoint_info.BookingStatusId || 1,
                                "VisitTypeId": appoint_info.VisitTypeId,
                                "HospitalEquipmentId": appoint_info.PatientTagList || []
                            }

                            //if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 16) {
                            //    params.RoomTypeId = 1;
                            //}
                            //if ($scope.userLoginDetails.RoleID === 10) {
                            //    params.RoomTypeId = 2;
                            //}

                            eHnoteMainAppointmentService.AddUpdateAppointmentCheckInTrackerDetails(params).then(function (resp) {
                                if (resp.data.Status == "Success") {
                                    alertify.success("Patient CheckIn Successfully");
                                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                                    appoint_info.AppointmentStatusId = 2;
                                    appoint_info.CheckinStatusId = 2;
                                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                                    $uibModalInstance.close(obj);
                                }
                            }, function (err) {
                                alertify.error("Getting Failed");
                            });

                        }, function () {
                            r = "You pressed Cancel!";
                        });
                    } else {
                        $uibModalInstance.close(obj);
                    }

                };

                $scope.AllHospitalData = AllHospitalData;

                $scope.changePatientSearchType = function (id) {
                    $scope.PatientSearchObj = getSelectedPatientObj();
                    /*$scope.searchradio.PatientSearchType = id;*/
                    $scope.PatientSearchObj.SearchTypeId = id;
                    $scope.AllPatientList = [];
                    $scope.AllEncounterPatientList = [];
                    if ($scope.PatientSearchObj.SearchText == '') {
                        $scope.ShowPatientDetailsDrop = false;
                    }

                }



                $scope.getDoctorsbySubSpecializations = function (hospitalID, val) {


                    $scope.BranchDoctorsList = [];
                    $scope.allUserList = [];
                    $scope.clinicDoctorList = [];
                    $scope.DoctorObj = "";

                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                    var reqObj = {
                        "BranchId": hospitalID,
                        "SubSpecializationIdArray": subSplArray || '',
                    }
                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;


                            if ($scope.allUserList.length !== 0) {

                                $scope.clinicDoctorList = angular.copy($scope.allUserList);
                            }

                            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                                return item.RoleId === 1 || item.RoleId === 43;
                            });

                            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                            angular.forEach($scope.clinicDoctorList, function (ditem) {
                                ditem.isChecked = true;
                            });
                            $scope.SelectedProvider = 'All Doctors';
                            $scope.AllEncounterObj.AllDoctorCheck = true;
                            val = val || 0;
                            if (val == 1) {
                                $scope.getvisitReasons(hospitalID, val);
                            }
                        } else {
                            alertify.error("No Doctors Found in Selected Hospital");

                        }


                    }

                    function onGetUsersFailure(data) {
                    }
                }

                $scope.SelectAllLocations = function (item, val) {

                    $scope.Appointment.SelectedHospitalId = item.ClinicId || 0;
                    $scope.AppListselectedclinic = item || {};

                    if (item.IsChecked) {
                        if (item.ClinicId === 0) {
                            angular.forEach($scope.AllHospitalData.AllBranchesList, function (mitem) {
                                mitem.IsChecked = true;
                            });
                        }
                    } else {
                        if (item.ClinicId === 0) {
                            angular.forEach($scope.AllHospitalData.AllBranchesList, function (mitem) {
                                mitem.IsChecked = false;
                            });
                        }
                    }

                    var Locationids = '';
                    Locationids = $scope.AllHospitalData.AllBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");

                    val = val || 0;
                    if (val == 1) {
                        $scope.getDoctorsbySubSpecializations(Locationids, val);
                    }
                    else {
                        $scope.getDoctorsbySubSpecializations(Locationids);
                        $scope.getvisitReasons(Locationids);
                    }

                    var nonZeroChecked = $scope.AllHospitalData.AllBranchesList
                        .filter(branch => branch.ClinicId !== 0)
                        .every(branch => branch.IsChecked === true);

                    var clinicZeroItem = $scope.AllHospitalData.AllBranchesList.find(branch => branch.ClinicId === 0);
                    if (clinicZeroItem) {
                        clinicZeroItem.IsChecked = nonZeroChecked;
                    }

                    var checkedArray = _.where($scope.AllHospitalData.AllBranchesList, { IsChecked: true });
                    var checkedCount = checkedArray.length;
                    var totalBranches = $scope.AllHospitalData.AllBranchesList.length;

                    if (checkedCount === totalBranches) {
                        $scope.AppListselectedclinic.ClinicName = "All Locations";
                    } else if (checkedCount > 0) {
                        $scope.AppListselectedclinic.ClinicName = "Selected";
                    } else {
                        $scope.AppListselectedclinic.ClinicName = "Select";
                    }

                    if (checkedCount == 1) {
                        var filterlist = $filter("filter")($scope.AllHospitalData.AllBranchesList, function (item) {
                            return item.ClinicId == checkedArray[0].ClinicId;
                        }) || [];
                        if (filterlist.length > 0) {
                            $scope.AppListselectedclinic.ClinicName = filterlist[0].ClinicName || "Select";
                        }
                    }
                }

                $scope.stopClosingDropDown = function ($event) {
                    $event.stopPropagation();
                };

                $scope.getvisitReasons = function (item, val) {

                    $scope.AllVisitReasons = [];
                    var visitreasonParams = {
                        "OrganizationId": item,
                        "ReasonTypeId": 1,
                        "SearchText": "",
                        "VisitTypeId": null
                    };
                    eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(visitreasonParams).then(function (resp) {

                        if (resp.data.status == "Success") {

                            $scope.AllVisitReasonsList = resp.data.rows || [];
                            if ($scope.AllVisitReasonsList.length > 0) {
                                $scope.AllVisitReasonsList = $filter("filter")($scope.AllVisitReasonsList, function (item) {
                                    return item.ActiveIND === 'Y';
                                });

                                angular.forEach($scope.AllVisitReasonsList, function (item) {
                                    if (item.ActiveIND === 'Y') {
                                        item.isChecked = true;
                                    }
                                });
                                $scope.SelectedVisitReasonType = "All";
                                $scope.AllEncounterObj.AllVisitReasonsCheck = true;
                                val = val || 0;
                                if (val == 1) {
                                    $scope.SearchAppointmentList();
                                }
                            }

                        }
                    });
                }

                $scope.CheckAllFacilityType = function (val) {
                    if (val) {
                        angular.forEach($scope.OrganizationFacilityList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.FacilityTypeObj.SelectStatusString = 'All';
                    }
                    else {
                        angular.forEach($scope.OrganizationFacilityList, function (item) {
                            item.IsChecked = false;
                        });

                        $scope.FacilityTypeObj.SelectStatusString = 'Select Status';
                    }

                };
                $scope.FacilityTypeToggle = function () {
                    var checkedArray = _.where($scope.OrganizationFacilityList, { IsChecked: true });
                    $scope.FacilityTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.OrganizationFacilityList.length === checkedArray.length ? true : false;
                    if ($scope.FacilityTypeObj.AllStatusCheck) {
                        $scope.FacilityTypeObj.SelectStatusString = 'All';
                    }

                    if (!$scope.FacilityTypeObj.AllStatusCheck && checkedArray.length > 0) {
                        $scope.FacilityTypeObj.SelectStatusString = 'Selected';
                    }
                };

                $scope.SearchAppointmentList = function (obj) {

                    var Locationids = $scope.AllHospitalData.AllBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");

                    var DoctorIds = $scope.clinicDoctorList
                        .filter(pitem => pitem.isChecked)
                        .map(pitem => pitem.DoctorID)
                        .join(",");

                    var VisitReasonIds = $scope.AllVisitReasonsList
                        .filter(pitem => pitem.isChecked)
                        .map(pitem => pitem.ParentAppointmentVisitReasonId)
                        .join(",");

                    var param = {
                        "AppoitmentDate": "",
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate,
                        "HospitalId": null,
                        "DoctorId": DoctorIds || 0,
                        "GetAllDoctorIndictor": 0,
                        "AppointmentTypeId": $scope.AppointmentType.TypeId || 0,
                        "PatientId": $scope.PatientSearchObj.PatientId || 0,
                        "OrganizationFacilityId": 0,
                        "VisitReasonId": VisitReasonIds || '',
                        "SearchText": "",
                        "PatientMRNo": "",
                        "PatientDOB": "",
                        "PageSize": $scope.Pagination.Patientitemsperpage,
                        "PageNo": $scope.PageNumber,
                        "FacilityListIds": "",
                        "LocationIds": Locationids || '',

                    };

                    if (param.DoctorId == 0) {
                        param.GetAllDoctorIndictor = 1;
                    } else {
                        param.GetAllDoctorIndictor = 0;
                    }

                    eHnoteMainAppointmentService.GetAllOPandOTAppointmentList(param).then(function (respose) {
                        console.log(respose);
                        if (respose.data.status == "Success") {
                            $scope.OPandOTAppointmentListCount = respose.data.count;
                            $scope.OPandOTAppointmentList = respose.data.rows;

                            angular.forEach($scope.OPandOTAppointmentList, function (item) {
                                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Patient.MobileNo);
                                item.Patient.MobileNo = obj.UsFormatMobileNumber;
                                item.IsVisitAvailable = false;
                                item.filterVisitArray = [];
                                item.VisitArray = item.VisitArray || [];
                                if (item.VisitArray.length > 0) {
                                    let filterlist = $filter("filter")(item.VisitArray, { "SuperbillId": 0 }, true) || [];
                                    if (filterlist.length > 0) {
                                        item.IsVisitAvailable = true;
                                    }
                                    item.filterVisitArray = item.VisitArray;
                                }
                            });

                            obj = obj || "";
                            if (obj != "") {
                                if (obj.Type == "Addnewvisit") {
                                    let templist = $filter("filter")($scope.OPandOTAppointmentList, { "AppointmentId": obj.AppointmentId }, true) || [];
                                    if (templist.length > 0) {
                                        let visitlist = $filter("filter")(templist[0].VisitArray, { "SuperbillId": 0 }, true) || [];

                                        let obj = {
                                            //"Type": "encounter",
                                            "Type": "navtoclaim",
                                            "item": templist[0],
                                            "VisitItem": visitlist[0],
                                            "FromDate": $scope.Appointment.FromDate,
                                            "ToDate": $scope.Appointment.ToDate
                                        }
                                        $uibModalInstance.close(obj);
                                    }
                                }
                            }
                        }

                    }, function (error) {
                        console.log(error);
                    });

                };

                var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
                InitializeBranches(NewBranchList, "PageLoad");

                function InitializeBranches(data, pagetype) {
                    var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, $scope.doctorinfo) || [];
                    $scope.BranchesListArray = clinicAddress;
                    $scope.AppListdoctoraddress = clinicAddress;
                    $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

                    var RoleID = $scope.userLoginDetails.RoleID;

                    $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
                        return item.BranchId === $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;
                    });

                    $scope.selectedBranch = $scope.defaultbranch[0];
                    $scope.AppListselectedclinic = $scope.defaultbranch[0];
                    if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                        angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                            if (item.ClinicName !== "All Locations") {
                                if (item.ClinicId === $scope.hospid) {
                                    $scope.selectedBranch = item;
                                    $scope.AppListselectedclinic = item;
                                    eHnoteMasterDataService.addSelectedHospitalinAppList(item);
                                }
                            }
                        });
                    }
                    if ($scope.selectedBranch.BranchId === 0) {
                        if ($scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                            $scope.selectedBranch.SubOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                            $scope.AppListselectedclinic.SubOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                        }
                    }
                }


                $scope.clearAppointmentList = function () {
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.PatientSearchObj = getSelectedPatientObj();
                    $scope.Appointment.Date = "";
                    $scope.Appointment.SelectedHospitalId = 0;
                    $scope.Appointment.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
                    $scope.Appointment.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
                    $scope.AppointmentType.TypeId = "";
                    $scope.AppointmentType.VisitTypeId = "";
                    $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
                    var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                    if (Index > -1) {
                        $scope.selectedDoctor = $scope.clinicDoctorList[Index] || "";
                        if ($scope.selectedDoctor != "") {
                            $scope.selectedDoctor.FullName = "All Doctors";
                        }
                    } else {
                        $scope.selectedDoctor = $scope.clinicDoctorList[0] || "";
                        if ($scope.selectedDoctor.DoctorID == 0) {
                            $scope.DoctorId = 0;
                        }
                    }
                    $scope.AllEncounterObj.AllDoctorCheck = true;
                    $scope.PageNumber = 1;
                    $scope.PageSize = 10;
                    $scope.PatientSearchObj.SearchTypeId = 2;
                    $scope.AppListselectedclinic = $scope.AllHospitalData.AllBranchesList[0];
                    if ($scope.AllHospitalData.AllBranchesList.length > 0) {
                        $scope.AllHospitalData.AllBranchesList[0].IsChecked = true;
                        $scope.SelectAllLocations($scope.AllHospitalData.AllBranchesList[0], 1);
                    }
                }


                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                angular.forEach($scope.clinicDoctorList, function (item) {
                    item.isChecked = true;
                });
                var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                if (Index > -1) {
                    $scope.selectedDoctor = $scope.clinicDoctorList[Index] || "";
                    if ($scope.selectedDoctor != "") {
                        $scope.selectedDoctor.FullName = "All Doctors";
                    }
                } else {
                    $scope.selectedDoctor = $scope.clinicDoctorList[0] || "";
                    if ($scope.selectedDoctor != "") {
                        $scope.selectedDoctor.FullName = "All Doctors";
                    }
                    if ($scope.selectedDoctor.DoctorID == 0) {
                        $scope.DoctorId = 0;
                    }
                }


                $scope.AppListselectedclinic = $scope.AllHospitalData.AllBranchesList[0];
                if ($scope.AllHospitalData.AllBranchesList.length > 0) {
                    if ($scope.AllHospitalData.AllBranchesList[0].IsChecked == false) {
                        $scope.AllHospitalData.AllBranchesList[0].IsChecked = true;
                        $scope.SelectAllLocations($scope.AllHospitalData.AllBranchesList[0], 1);
                    }
                    else {
                        $scope.SearchAppointmentList();
                    }
                }

                $scope.SelectAllProvinders = function (val) {
                    if (val == true) {
                        angular.forEach($scope.clinicDoctorList, function (item) {
                            item.isChecked = true;
                        });

                        $scope.selectedDoctor.FullName = 'All Doctors';
                    } else if (val == false) {
                        angular.forEach($scope.clinicDoctorList, function (item) {
                            item.isChecked = false;
                        });

                        $scope.selectedDoctor.FullName = 'All Doctors';
                    } else {

                        var checkedArray = _.where($scope.clinicDoctorList, { isChecked: true });
                        var totalItems = $scope.clinicDoctorList.length;
                        var checkedCount = checkedArray.length;

                        if (checkedCount === totalItems && totalItems > 0) {
                            $scope.selectedDoctor.FullName = "All Doctors";
                            $scope.AllEncounterObj.AllDoctorCheck = true;
                        } else if (checkedCount > 0 && checkedCount < totalItems) {
                            $scope.selectedDoctor.FullName = "Selected";
                            $scope.AllEncounterObj.AllDoctorCheck = false;
                        } else {
                            $scope.selectedDoctor.FullName = "Select";
                            $scope.AllEncounterObj.AllDoctorCheck = false;
                        }

                        if (checkedCount == 1) {
                            var filterlist = $filter("filter")($scope.clinicDoctorList, function (item) { return item.DoctorID == checkedArray[0].DoctorID; }) || [];
                            if (filterlist.length > 0) {
                                $scope.selectedDoctor.FullName = filterlist[0].SecondUserFullName || "Select";
                            }
                        }
                    }

                };

                $scope.SelectVisitReasons = function (val) {

                    if (val == true) {
                        angular.forEach($scope.AllVisitReasonsList, function (item) {
                            item.isChecked = true;
                        });

                        $scope.SelectedVisitReasonType = 'All';
                    } else if (val == false) {
                        angular.forEach($scope.AllVisitReasonsList, function (item) {
                            item.isChecked = false;
                        });

                        $scope.SelectedVisitReasonType = 'Select';
                    } else {

                        var checkedArray = _.where($scope.AllVisitReasonsList, { isChecked: true });
                        var totalItems = $scope.AllVisitReasonsList.length;
                        var checkedCount = checkedArray.length;

                        if (checkedCount === totalItems && totalItems > 0) {
                            $scope.SelectedVisitReasonType = "All";
                            $scope.AllEncounterObj.AllVisitReasonsCheck = true;
                        } else if (checkedCount > 0 && checkedCount < totalItems) {
                            $scope.SelectedVisitReasonType = "Selected";
                            $scope.AllEncounterObj.AllVisitReasonsCheck = false;
                        } else {
                            $scope.SelectedVisitReasonType = "Select";
                            $scope.AllEncounterObj.AllVisitReasonsCheck = false;
                        }

                        if (checkedCount == 1) {
                            var filterlist = $filter("filter")($scope.AllVisitReasonsList, function (item) { return item.ParentAppointmentVisitReasonId == checkedArray[0].ParentAppointmentVisitReasonId; }) || [];
                            if (filterlist.length > 0) {
                                $scope.SelectedVisitReasonType = filterlist[0].AppointmentVisitReason || "Select";
                            }
                        }
                    };
                }

                $scope.ClickPatientProfile = function (item) {
                    item.PatientDetails = angular.copy(item.Patient);
                    item.PatientDetails.PatientID = item.Patient.PatientId;
                    item.PatientID = item.Patient.PatientId;
                    eHnoteMasterDataService.addPatientDetailsforBarcode(item);
                    eHnoteMasterDataService.addAppointmentInfo(item);
                    $scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;

                    $scope.cacheStorageItem.patientid = item.Patient.PatientId;
                    item.PatientID = item.Patient.PatientId;
                    item.MasterPatientId = item.Patient.MasterPatientId;
                    $scope.cacheStorageItem.PatientID = item.Patient.PatientId;
                    item.Gender = item.Patient.Gender || "";
                    item.PatientGSTNO = item.Patient.GSTNO || "";
                    $scope.cacheStorageItem.PatientName = item.Patient.Fullname;
                    $scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;
                    $scope.cacheStorageItem.appointmentid = item.AppointmentId;
                    $scope.cacheStorageItem.AppointmentID = item.AppointmentId;
                    $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
                    $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
                    $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                    if ($scope.AllHospitalData.AllUsersList != undefined) {
                        $scope.cacheStorageItem.AllDoctorsList = $scope.AllHospitalData.AllUsersList || [];
                    }

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    datapersistanceFactory.set("BillingToProfile", item);

                    var obj = {
                        'IsComingFrom': 'BillerBilling'
                    }
                    $location.url("/newbiller");
                };

                $scope.ChangeSubcontent = function (row) {
                    $scope.ClickPatientProfile(row);
                };

                $scope.changePatientPage = function (pageNo) {
                    $scope.PageNumber = pageNo || 1;
                    $scope.SearchAppointmentList();
                };



                $scope.navtocreateNewVisitandEncounter = function (item, id, Visit) {
                    item.typeId = id || 0;
                    Visit = Visit || "";
                    if (Visit != "") {
                        item.VisitReasonName = Visit.VisitReasonName || "";
                        item.VisitReasonId = Visit.VisitReasonId || 0;
                        item.VisitId = Visit.VisitId || 0;
                    }
                    let mInstanceAdd = $uibModal.open({
                        "templateUrl": "AddVisitPopup.html",
                        "size": "md",
                        "backdrop": "static",
                        "keyboard": false,
                        "scope": $scope,
                        "windowClass": " ",
                        "resolve": {
                            "cache": function () { return angular.copy(item); },
                            "FacilityList": function () { return angular.copy($scope.OrganizationFacilityList) },
                            "clinicDoctorList": function () { return angular.copy($scope.clinicDoctorList) },
                            "ExamTypeList": function () { return angular.copy($scope.ExamTypeList) }
                        },
                        "controller": function ($scope, $uibModal, $uibModalInstance, cache, FacilityList, eHnoteMasterDataService, eHnoteUserAppointmentDataService, clinicDoctorList, ExamTypeList) {
                            $scope.cache = cache || {};
                            $scope.cache.patientid = $scope.cache.Patient.PatientId || 0;
                            $scope.FacilityList = FacilityList || [];
                            $scope.clinicDoctorList = clinicDoctorList || [];
                            $scope.ExamTypeList = ExamTypeList || [];
                            $scope.UserId = eHnoteMasterDataService.getLoginId();
                            $scope.HospitalId = 0;
                            $scope.ParentHospitalId = 0;
                            if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                                && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                                $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                                $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                            }

                            $scope.initvisit = function () {
                                var visitsobj = {
                                    "PatientId": $scope.cache.patientid,
                                }
                                //var getParams = {
                                //    "OrganizationId": $scope.HospitalId,
                                //};
                                $q.all([
                                    eHnoteMainAppointmentService.GetAllPatientsvisits(visitsobj.PatientId),
                                    eHnotePatientVisitReasonServices.GetOrganizationActiveClinicalVisitReasonsById($scope.HospitalId),
                                ]).then(function (resp) {
                                    if (resp[0].data.Status === "Success") {
                                        $scope.PatientAllVisits = resp[0].data.rows || [];
                                    }
                                    if (resp[1].data.Status == "Success") {
                                        $scope.AllVisitReasons = angular.copy(resp[1].data.rows) || [];
                                    }
                                });
                            }
                            $scope.initvisit();

                            $scope.AppointmentDetailsForVist = [];
                            $scope.GetUpcomingAppointments = function (patientId) {

                                if ($scope.cache.patientid == 0) {
                                    return false;
                                }
                                var PHospitID = null;
                                if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                    PHospitID = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                                }
                                eHnoteUserAppointmentDataService.GetPatientUpcomingAppointments($scope.cache.patientid, PHospitID).then(function (response) {
                                    console.log(response);
                                    $scope.AllAppointmentsArray = [];
                                    $scope.FutureAppointmentsArray = [];
                                    $scope.UpcomingAppointmentArray = [];
                                    $scope.IsCompleteandSend = false;
                                    if (response.data.Status == "Success") {
                                        if (response.data.AllAppointments.length > 0) {
                                            $scope.AllAppointmentsArray = angular.copy(response.data.AllAppointments);
                                            if ($scope.AllAppointmentsArray.length > 0) {
                                                angular.forEach($scope.AllAppointmentsArray, function (item) {
                                                    item.ShowAppointmentNotes = false;
                                                    item.ShortStartTime = $filter('date')(new Date(item.AppointmentDate + " " + item.StartTime), "hh:mm a");
                                                });
                                            }
                                        }
                                        if (response.data.rows.length > 0) {

                                            $scope.FutureAppointmentsArray = angular.copy(response.data.rows);
                                            angular.forEach(response.data.rows, function (item, index) {
                                                item.IsVisitcardCheckBox = false;
                                                $scope.UpcomingAppointmentArray.push(item);
                                            });
                                            angular.forEach($scope.UpcomingAppointmentArray, function (item) {
                                                let todaydate = $filter('date')(new Date(), "yyyy-MM-dd");
                                                item.IsCompleteandsendInd = false;
                                                item.IsCheckInInd = false;
                                                item.IsOnlyComplete = true;
                                                item.IsTodayAppointment = false;
                                                if (item.ConsultationDt > todaydate || item.ConsultationDt == todaydate) {
                                                    item.IsHideCheckin = true;
                                                } else {
                                                    item.IsHideCheckin = false;

                                                }
                                                if (item.ConsultationDt == todaydate) {
                                                    item.IsOnlyComplete = false;
                                                    item.IsTodayAppointment = true;
                                                    if (item.AppointmentTypeId != 4 && item.AppointmentTypeId != 14 && item.AppointmentTypeId != 7 && item.AppointmentTypeId != 6) {
                                                        $scope.AppointmentDetailsForVist.push(item);
                                                        $scope.AddVisitObj.DocObj.SecondUserFullName = item.DoctorFullName || '';
                                                        $scope.AddVisitObj.DocObj.DoctorID = item.DoctorId || null;
                                                    }
                                                }

                                            });
                                        }
                                    } else {

                                        alertify.error(Message);
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                            };
                            $scope.GetUpcomingAppointments();
                            $scope.GEtAddVisitObj = function () {
                                let obj = {
                                    "PatientId": $scope.cache.patientid || null,
                                    "AppointmentId": $scope.cache.AppointmentId || null,
                                    "VisitReasonId": null,
                                    "DoctorId": null,
                                    "FacilityId": null,
                                    "ParentVisitId": null,
                                    "ExamTypeId": null,
                                    "DocObj": {},
                                    "doctorSearch": '',
                                    "VisitReasonObj": {
                                        "Reason": '',
                                        "VisitReasonId": ''
                                    },
                                    "OrganizationFacilityId": 0,
                                    "ExamTypeId": 0,
                                    "VisitId": 0,
                                    "StatusFlag": "B",
                                    "FacilityTypeId": 0,
                                }
                                return obj;
                            }
                            $scope.AddVisitObj = $scope.GEtAddVisitObj();

                            $scope.AddVisitObj.OrganizationFacilityId = 0;
                            $scope.AddVisitObj.VisitReasonObj.VisitReason = cache.VisitReasonName || "";
                            $scope.AddVisitObj.VisitReasonObj.VisitReasonId = cache.VisitReasonId || 0;
                            $scope.AddVisitObj.VisitId = cache.VisitId || 0;

                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };
                            $scope.selectDoctor = function (doctor) {
                                $scope.AddVisitObj.DocObj = doctor;
                            };
                            $scope.onSelectVisitReason = function (item, mainitem) {
                                //mainitem.OrganizationFacilityId = item.FacilityTypeId || 0;
                                //if (mainitem.OrganizationFacilityId != 0) {
                                //    var List1 = $filter("filter")($scope.FacilityList, function (Ditem,) { return Ditem.FacilityTypeId === item.FacilityTypeId; }) || [];
                                //    if (List1.length > 0) {
                                //        $scope.AddVisitObj.FacilityTypeId = List1[0].FacilityTypeId || 0;
                                //    } else {
                                //        $scope.AddVisitObj.FacilityTypeId = 0;
                                //    }
                                //}
                            }
                            $scope.ChangeFacility = function (item, mainitem) {
                                var List1 = $filter("filter")($scope.FacilityList, function (Ditem,) { return Ditem.OrganizationFacilityId === $scope.AddVisitObj.OrganizationFacilityId; }) || [];
                                if (List1.length > 0) {
                                    $scope.AddVisitObj.FacilityTypeId = List1[0].FacilityTypeId || 0;
                                } else {
                                    $scope.AddVisitObj.FacilityTypeId = 0;
                                }

                            }
                            $scope.AddVisit = function (typeId) {
                                var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                var CurrentDate = $filter("date")(new Date(), "yyyy-MM-dd");
                                $scope.AddVisitObj.DocObj.DoctorID = $scope.AddVisitObj.DocObj.DoctorID || 0;
                                if ($scope.AddVisitObj.DocObj.DoctorID == 0) {
                                    alertify.error("Select Doctor To  Add Visit");
                                    return false;
                                }
                                if ($scope.AddVisitObj.VisitReasonObj.VisitReasonId == undefined || $scope.AddVisitObj.VisitReasonObj.VisitReasonId == 0) {
                                    alertify.error("Please Select Visit Reason");
                                    return false;
                                }

                                $scope.AppointmentDetailsForVist = $scope.AppointmentDetailsForVist || [];
                                let AppointmentId = 0;
                                if ($scope.AppointmentDetailsForVist.length > 0) {
                                    AppointmentId = $scope.AppointmentDetailsForVist[0].AppointmentID || 0;
                                }

                                var params = {
                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                    "OrganizationId": $scope.HospitalId,
                                    "PatientId": $scope.AddVisitObj.PatientId || null,
                                    "StartTime": CurrentTime || null,
                                    "EndTime": null,
                                    "VisitDate": CurrentDate || null,
                                    "VisitReasonId": $scope.AddVisitObj.VisitReasonObj.VisitReasonId || 0,
                                    "DoctorId": $scope.AddVisitObj.DocObj.DoctorID || null,
                                    "FacilityId": null,
                                    "FacilityTypeId": $scope.AddVisitObj.FacilityTypeId || null,
                                    "ParentVisitId": $scope.AddVisitObj.VisitId || null,
                                    "VisitId": $scope.AddVisitObj.VisitId || 0,
                                    "AppointmentId": AppointmentId || 0,
                                    "ExamTypeId": $scope.AddVisitObj.ExamTypeId || 0,
                                    "StatusFlag": 'B',
                                }

                                eHnoteMainAppointmentService.AddVisit(params).then(function (resp) {
                                    if (resp.data.Status == 'Success') {

                                        $scope.AddVisitObj = $scope.GEtAddVisitObj();
                                        var obj = {
                                            "AppointmentId": $scope.AddVisitObj.AppointmentId,
                                            "Type": "Addnewvisit",
                                        }

                                        typeId = typeId || 0;
                                        if (typeId == 2) {
                                            obj.Type = "Updatevisit";
                                        }

                                        $uibModalInstance.close(obj);
                                    }
                                }, function (err) {
                                    alertify.error("Getting Failed");
                                });

                            }
                        }
                    });
                    mInstanceAdd.result.then(function (resp) {
                        $scope.SearchAppointmentList(resp);
                    }, function () { });
                };

                /* ---- */
                $scope.openAccordion = function (item) {
                    const isCurrentlyOpen = item.isOpen;
                    $scope.OPandOTAppointmentList.forEach(subItem => {
                        subItem.isOpen = false;
                    });
                    item.isOpen = !isCurrentlyOpen;
                };
            }
        });

        $scope.encountermodelInstanceAdd.result.then(function (resp) {

            console.log(resp);

            if (resp.Type === "encounter") {
                resp.item.PatientId = resp.item.Patient.PatientId;
                resp.item.PatientFullName = resp.item.Patient.FullName;
                resp.item.IsCreateSuperBill = false;
                $scope.navtoGenerateClaim("SuperBill", resp.item, resp.VisitItem);
            }
            if (resp.Type === "navtoSuperView") {

                $scope.navtoSuperViewpopup(resp.VisitItem, resp.item);
            }

            if (resp.Type === "navtoclaim") {
                resp.item.PatientId = resp.item.Patient.PatientId;
                resp.item.PatientFullName = resp.item.Patient.FullName;
                resp.item.IsCreateSuperBill = true;
                $scope.navtoGenerateClaim("AddClaim", resp.item, resp.VisitItem);
            }

            if ($scope.organizationSuperBillList.length == 0 && resp === "cancel") {
                /*$scope.clearCLaimEncounters();*/
            }
            $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
            if ($scope.selectedEncounterslist != '') {
                $scope.searchClaimEncounterReqObj.FromDate = $scope.selectedEncounterslist.FromDate || null;
                $scope.searchClaimEncounterReqObj.ToDate = $scope.selectedEncounterslist.ToDate || null;
                $scope.showifnotCurrentDate = false;
                var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if (CurrentDate !== $scope.searchClaimEncounterReqObj.FromDate) {
                    $scope.showifnotCurrentDate = true;
                }

                $scope.selectedEncounterslist.SelectedBranchesList = $scope.selectedEncounterslist.SelectedBranchesList || '';
                if ($scope.mainBillerDataObj.AllBranchesList.length > 0 && $scope.selectedEncounterslist.SelectedBranchesList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });

                    var selectedClinicIds = $scope.selectedEncounterslist.SelectedBranchesList.split(",");
                    $scope.mainBillerDataObj.AllBranchesList.forEach(pitem => {
                        pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
                    var AllLocationIND = checkedArray.length > 0 && $scope.mainBillerDataObj.AllBranchesList.length === checkedArray.length ? true : false;
                    if (AllLocationIND) {
                        $scope.LocationTypeObj.SelectLocationString = "All Locations";
                    } else if (checkedArray.length == 1) {
                        $scope.LocationTypeObj.SelectLocationString = checkedArray[0].ClinicName || "Select";
                    } else {
                        $scope.LocationTypeObj.SelectLocationString = "Selected";
                    }
                }

                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
                    $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedDoctor = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            $scope.selectedDoctor = "Selected";
                        }
                    }
                }

                if ($scope.AllVisitReasons.length > 0 && $scope.selectedEncounterslist.Visitreasons != '') {
                    angular.forEach($scope.AllVisitReasons, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedVrIds = $scope.selectedEncounterslist.Visitreasons.split(",");
                    $scope.AllVisitReasons.forEach(pitem => {
                        pitem.isChecked = selectedVrIds.includes(pitem.ParentAppointmentVisitReasonId.toString());
                    });

                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                    if ($scope.AllSelectionObj.AllVisitReasonsCheck) {
                        $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
                    } else {
                        $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
                    }
                }

                $scope.selectedEncounterslist.BillingEncounterStatus = $scope.selectedEncounterslist.BillingEncounterStatus || '';
                if ($scope.BillingEncounterStatus.length > 0 && $scope.selectedEncounterslist.BillingEncounterStatus != '') {
                    angular.forEach($scope.BillingEncounterStatus, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.split(",");
                    $scope.BillingEncounterStatus.forEach(pitem => {
                        pitem.isChecked = selectedEncounterIds.includes(pitem.EncounterStatusId.toString());
                    });


                    var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    $scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedstatus = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedstatus = checkedArray[0].EncounterStatus;
                        } else {
                            $scope.selectedstatus = "Select";
                        }
                    }
                }
            }
        }, function () { });

    }




    $scope.clearCLaimEncounters = function () {
        $scope.showifnotCurrentDate = false;
        $scope.showifnotTodayDate = false;
        $scope.AllSelectionObj.AllVisitReasonsCheck = true;
        $scope.AllSelectionObj.SuperBillStatusCheck = true;
        $scope.searchClaimEncounterReqObj = getnewSearchEncounterobj();
        $scope.SuperBillStatusList = angular.copy($scope.GetSuperBillStatusList());
        $scope.PatientSearch = getSelectedPatient();
        $scope.selectedDoctor = 'All Doctors';
        $scope.searchtxtb = "";
        $scope.activeEncounterTab = null;
        if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
            $scope.mainBillerDataObj.AllBranchesList[0].IsChecked = true;
            $scope.ChangeApptBranch($scope.mainBillerDataObj.AllBranchesList[0], 1);
        }

        if ($scope.mainBillerDataObj.AllBranchesList.length > 0) {
            var checkedLocationList = $scope.mainBillerDataObj.AllBranchesList
                /*.filter(pitem => pitem.IsChecked)*/
                .map(pitem => pitem.ClinicId)
                .join(",");
        }
        if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
            var checkedDRList = $scope.mainBillerDataObj.AllDoctorsList
                //    .filter(pitem => pitem.isChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");
        }
        if ($scope.AllVisitReasons.length > 0) {
            var checkedvisitsList = $scope.AllVisitReasons
                /*.filter(pitem => pitem.isChecked)*/
                .map(pitem => pitem.ParentAppointmentVisitReasonId)
                .join(",");
        }
        if ($scope.BillingEncounterStatus.length > 0) {



            if ($scope.isIojOrgEnable == true) {
                $scope.BillingEncounterStatus.forEach(item => {
                    item.isChecked = true;// [1].includes(item.EncounterStatusId);
                });
            }
            else {
                $scope.BillingEncounterStatus.forEach(item => {
                    item.isChecked = [1].includes(item.EncounterStatusId);
                });
            }
            var checkedEncounterStatusList = $scope.BillingEncounterStatus
                .filter(pitem => pitem.isChecked)
                .map(pitem => pitem.EncounterStatusId)
                .join(",");
        }

        var cacheobj = {
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "SelectedBranchesList": checkedLocationList || '',
            "SelectedDoctorsList": checkedDRList || '',
            "Visitreasons": checkedvisitsList || '',
            "BillingEncounterStatus": checkedEncounterStatusList || '',
        };

        eHnoteMasterDataService.addSelectedEncountersList(cacheobj);

        $scope.init();
    }

    $scope.changeDoctor = function (item) {
        $scope.searchClaimEncounterReqObj.DoctorId = item.DoctorID;
        $scope.selectedDoctor = item;
    }


    $scope.changeSearchType = function (id) {
        $scope.PatientSearch = getSelectedPatient();
        $scope.PatientSearch.SearchTypeId = id;
        $scope.searchClaimEncounterReqObj.PatientId = 0;
        $scope.AllPatientList = [];
        if ($scope.PatientSearch.SearchText == '') {
            $scope.ShowPatientListDrop = false;
        }
    }


    $scope.$on("RefreshClaimEvent", function (event, data) {
        $uibModalInstance.dismiss("cancel");
        $scope.SearchClaimDashboardDetails();
    });

    $scope.navtoGenerateClaim = function (type, item, VisitItem, typeid) {
        item = item || '';
        typeid = typeid || 0;
        item.IsFrom = item.IsFrom || "";
        item.ResponcibilityId = item.ResponcibilityId || 0;
        if (item.IsFrom === "ManualBill") {
            item.ResponcibilityId = 1;
        }
        VisitItem = VisitItem || '';
        $scope.filterlist = [];
        item.SuperBillArray = item.SuperBillArray || [];
        if (item.SuperBillArray.length > 0) {
            $scope.filterlist = $filter('filter')(item.SuperBillArray, { 'DeleteInd': 'N' }, true) || [];
            //if ($scope.filterlist.length > 0 && item.ResponcibilityId == 0) {
            //    alertify.error("Please select claim responsibility.");
            //    return false;
            //}
        }
        //else if (item.ResponcibilityId == 0 && typeid == 1) {
        //    alertify.error("Please select claim responsibility.");
        //    return false;
        //}

        if (VisitItem == undefined || VisitItem == '') {
            var VisitItem = {
                "VisitId": item.VisitId
            }
        }

        let AppointmentId = null;
        let PatientId = null;
        let OrganizationFacilityId = null;
        if (item != '') {
            AppointmentId = item.AppointmentId;
            PatientId = item.PatientId;
        }

        VisitItem.OrganizationFacilityId = null;
        $scope.ResponcibilityList = [];
        if (item.ResponcibilityId !== 0 && $scope.filterlist.length > 0) {
            if ($scope.filterlist.length > 0) {
                var count = 0;
                angular.forEach($scope.filterlist, function (mitem) {
                    if (mitem.ResponcibilityId == item.ResponcibilityId) {
                        count++;
                        $scope.ResponcibilityList.push(mitem);

                        if (mitem.DiagnosisArray.length > 0) {
                            angular.forEach(mitem.DiagnosisArray, function (mitem) {
                                angular.forEach(item.SuperBillDiagnosisArray, function (sitem) {
                                    if (mitem.DiagnosisId === sitem.DiagnosisId) {
                                        sitem.IsAvailable = true;
                                    }
                                });
                            });
                        }
                    }
                });
                if (count == 0) {
                    //alertify.error("The selected responsibility not existed");
                    //return false;
                }
            }
        } else if (item.ResponcibilityId !== 0 && typeid == 1) {
            //alertify.error("The selected responsibility not existed");
            //return false;
        }
        if (item.SuperBillArray.length > 0 && $scope.ResponcibilityList.length > 0) {
            item.SuperBillArray = angular.copy($scope.ResponcibilityList);
            item.SuperBillDiagnosisArray = $filter("filter")(item.SuperBillDiagnosisArray, function (sitem) {
                return sitem.IsAvailable === true;
            }) || [];

        }
        $scope.claimScreenParentObj = {
            "PatientId": PatientId || null,
            "AppointmentId": AppointmentId || null,
            "AppointmentTypeId": item.AppointmentTypeId || null,
            "AppointmentDate": item.AppointmentDate || null,
            "EncounterStatus": item.EncounterStatus || "Ready To Bill",
            "EncounterStatusId": item.EncounterStatusId || 1,
            "PatientFullName": item.PatientFullName || "",
            "ActionType": type || "AddClaim",
            "ScreenType": "Popup",
            "SuperBillId": item.SuperBillId || 0,
            "ResponcibilityId": item.ResponcibilityId || 0,
            "VisitId": VisitItem.VisitId || 0,
            "SuperBillArray": item.SuperBillArray || [],
            "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
            "IsCreateSuperBill": item.IsCreateSuperBill,
            "PatientClaimId": 0,
            "OrganizationFacilityId": item.OrganizationFacilityId || 0,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame,
            "SuperBillRemarks": item.SuperBillRemarks
        };

        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        item.ScreenType = item.ScreenType || 0;
        if (item.ScreenType == 3) {
            $scope.mainBillerDataObj.Tabid = 3;
        } else {
            $scope.mainBillerDataObj.Tabid = 1;
        }


        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "controller": "UsAddUpdateClaimPopupCtrl",
            "keyboard": false,
            'backdrop': 'static',
            "windowClass": "modal__popup--1",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
            }
        });
        $scope.mInstanceAdd.result.then(function (response) {
            $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
            if ($scope.selectedEncounterslist != '') {
                $scope.searchClaimEncounterReqObj.FromDate = $scope.selectedEncounterslist.FromDate || null;
                $scope.searchClaimEncounterReqObj.ToDate = $scope.selectedEncounterslist.ToDate || null;
                $scope.showifnotCurrentDate = false;
                var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if (CurrentDate !== $scope.searchClaimEncounterReqObj.FromDate) {
                    $scope.showifnotCurrentDate = true;
                }
                $scope.selectedEncounterslist.SelectedBranchesList = $scope.selectedEncounterslist.SelectedBranchesList || '';
                if ($scope.mainBillerDataObj.AllBranchesList.length > 0 && $scope.selectedEncounterslist.SelectedBranchesList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });

                    var selectedClinicIds = $scope.selectedEncounterslist.SelectedBranchesList.split(",");
                    $scope.mainBillerDataObj.AllBranchesList.forEach(pitem => {
                        pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
                    var AllLocationIND = checkedArray.length > 0 && $scope.mainBillerDataObj.AllBranchesList.length === checkedArray.length ? true : false;
                    if (AllLocationIND) {
                        $scope.LocationTypeObj.SelectLocationString = "All Locations";
                    } else if (checkedArray.length == 1) {
                        $scope.LocationTypeObj.SelectLocationString = checkedArray[0].ClinicName || "Select";
                    } else {
                        $scope.LocationTypeObj.SelectLocationString = "Selected";
                    }
                }

                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
                    $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedDoctor = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            $scope.selectedDoctor = "Selected";
                        }
                    }
                }

                if ($scope.AllVisitReasons.length > 0 && $scope.selectedEncounterslist.Visitreasons != '') {
                    angular.forEach($scope.AllVisitReasons, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedVrIds = $scope.selectedEncounterslist.Visitreasons.split(",");
                    $scope.AllVisitReasons.forEach(pitem => {
                        pitem.isChecked = selectedVrIds.includes(pitem.ParentAppointmentVisitReasonId.toString());
                    });

                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                    if ($scope.AllSelectionObj.AllVisitReasonsCheck) {
                        $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
                    } else {
                        $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
                    }
                }

                $scope.selectedEncounterslist.BillingEncounterStatus = $scope.selectedEncounterslist.BillingEncounterStatus || '';
                if ($scope.BillingEncounterStatus.length > 0 && $scope.selectedEncounterslist.BillingEncounterStatus != '') {
                    angular.forEach($scope.BillingEncounterStatus, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.split(",");
                    $scope.BillingEncounterStatus.forEach(pitem => {
                        pitem.isChecked = selectedEncounterIds.includes(pitem.EncounterStatusId.toString());
                    });


                    var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    $scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedstatus = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedstatus = checkedArray[0].EncounterStatus;
                        } else {
                            $scope.selectedstatus = "Select";
                        }
                    }
                }
            }

            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, response, selectedEncounterIds);
            /*$scope.clearCLaimEncounters();*/

        }, function () { });
    }


    $scope.navtoEditSuperBillClaim = function (item) {

        if (item.AppointmentStatusId === 7 || item.AppointmentStatusId === 5 || item.AppointmentStatusId === 6) {
            alertify.error("Appointment Cancelled!");
            return;
        }

        item = item || '';
        let AppointmentId = null;
        let PatientId = null;
        if (item != '') {
            AppointmentId = item.AppointmentId;
            PatientId = item.PatientId;
        }

        var hasZeroResponsibility = false;

        if (item.SuperBillArray && item.SuperBillArray.length > 0) {
            hasZeroResponsibility = item.SuperBillArray.some(function (bill) {
                return (bill.ResponcibilityId || 0) === 0;
            });

            if (hasZeroResponsibility) {

                var hasInsurance = item.AppointmentInsuranceList && item.AppointmentInsuranceList.some(function (ins) {
                    return ins.StatusId === 1;
                });

                var newResponcibilityId = hasInsurance ? 2 : 1;

                item.SuperBillArray.forEach(function (bill) {
                    if ((bill.ResponcibilityId || 0) === 0) {
                        bill.ResponcibilityId = newResponcibilityId;
                    }
                });
            }
        }

        $scope.claimScreenParentObj = {
            "PatientId": PatientId || null,
            "AppointmentId": AppointmentId || null,
            "AppointmentTypeId": item.AppointmentTypeId,
            "AppointmentDate": item.AppointmentDate || null,
            "EncounterStatus": item.EncounterStatus || "Ready To Bill",
            "EncounterStatusId": item.EncounterStatusId || 1,
            "PatientFullName": item.PatientFullName || "",
            "ResponcibilityId": item.ResponcibilityId || 0,
            "VisitId": item.VisitId || 0,
            "ActionType": "SuperBill",
            "ScreenType": "Popup",
            "PatientClaimId": 0,
            "IsCreateSuperBill": false,
            "SuperBillId": item.SuperBillId || 0,
            "SuperBillArray": item.SuperBillArray || [],
            "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
            "OrganizationFacilityId": item.OrganizationFacilityId || 0,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame,
            "SuperBillRemarks": item.SuperBillRemarks,
            "IsSuperBillInd": !!item.IsSuperBillInd
        };
        $scope.mainBillerDataObj.Tabid = 1;
        $scope.mainBillerDataObj.PatientId = PatientId || 0;
        $scope.mainBillerDataObj.HospitalId = $scope.HospitalId || 0;
        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        $scope.$emit('AddUpdateClaimPopup', {});
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "controller": "UsAddUpdateClaimPopupCtrl",
            //"size": "lg",
            'backdrop': 'static',
            "keyboard": false,
            "windowClass": "modal__popup--1 bottom-to-top-modal",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
            }
            //"windowClass": "modal__popup--1 bottom-to-top-modal in  ",


        });

        $scope.mInstanceAdd.result.then(function (response) {
            $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
            if ($scope.selectedEncounterslist != '') {
                $scope.searchClaimEncounterReqObj.FromDate = $scope.selectedEncounterslist.FromDate || null;
                $scope.searchClaimEncounterReqObj.ToDate = $scope.selectedEncounterslist.ToDate || null;
                $scope.showifnotCurrentDate = false;
                var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if (CurrentDate !== $scope.searchClaimEncounterReqObj.FromDate) {
                    $scope.showifnotCurrentDate = true;
                }
                $scope.selectedEncounterslist.SelectedBranchesList = $scope.selectedEncounterslist.SelectedBranchesList || '';
                if ($scope.mainBillerDataObj.AllBranchesList.length > 0 && $scope.selectedEncounterslist.SelectedBranchesList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });

                    var selectedClinicIds = $scope.selectedEncounterslist.SelectedBranchesList.split(",");
                    $scope.mainBillerDataObj.AllBranchesList.forEach(pitem => {
                        pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
                    var AllLocationIND = checkedArray.length > 0 && $scope.mainBillerDataObj.AllBranchesList.length === checkedArray.length ? true : false;
                    if (AllLocationIND) {
                        $scope.LocationTypeObj.SelectLocationString = "All Locations";
                    } else if (checkedArray.length == 1) {
                        $scope.LocationTypeObj.SelectLocationString = checkedArray[0].ClinicName || "Select";
                    } else {
                        $scope.LocationTypeObj.SelectLocationString = "Selected";
                    }
                }

                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
                    $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedDoctor = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            $scope.selectedDoctor = "Selected";
                        }
                    }
                }

                if ($scope.AllVisitReasons.length > 0 && $scope.selectedEncounterslist.Visitreasons != '') {
                    angular.forEach($scope.AllVisitReasons, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedVrIds = $scope.selectedEncounterslist.Visitreasons.split(",");
                    $scope.AllVisitReasons.forEach(pitem => {
                        pitem.isChecked = selectedVrIds.includes(pitem.ParentAppointmentVisitReasonId.toString());
                    });

                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                    if ($scope.AllSelectionObj.AllVisitReasonsCheck) {
                        $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
                    } else {
                        $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
                    }
                }

                $scope.selectedEncounterslist.BillingEncounterStatus = $scope.selectedEncounterslist.BillingEncounterStatus || '';
                if ($scope.BillingEncounterStatus.length > 0 && $scope.selectedEncounterslist.BillingEncounterStatus != '') {
                    angular.forEach($scope.BillingEncounterStatus, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.split(",");
                    $scope.BillingEncounterStatus.forEach(pitem => {
                        pitem.isChecked = selectedEncounterIds.includes(pitem.EncounterStatusId.toString());
                    });


                    var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    $scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedstatus = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedstatus = checkedArray[0].EncounterStatus;
                        } else {
                            $scope.selectedstatus = "Select";
                        }
                    }
                }
            }
            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, response, selectedEncounterIds);
            //$scope.clearCLaimEncounters();

        }, function () { });


    }

    $scope.navtoDelegteSuperBillClaim = function (item) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear  Encounter data? </h4>", function () {
            let reqObj = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "VisitId": item.VisitId || 0,
                "OrganizationId": $scope.HospitalId,
                "SuperBillRemarks": item.SuperBillRemarks || "",
                "SuperBillId": item.SuperBillId || null,
                "SuperBillArray": item.SuperBillArray || [],
                "EncounterStatusId": item.EncounterStatusId || 0,
                "EncounterStatus": item.EncounterStatus || "",
                "DeleteInd": "Y"
            }
            eHnoteDiagnosisDataServices.AddupdateSuperBill(reqObj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Successfully Deleted!");
                    $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', $scope.selectedEncounterStatusIds);

                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });
        }, function () {
            r = "You pressed Cancel!";
        });






    }

    $scope.openEncounterStatusPopup = function (item) {

        if (item.AppointmentStatusId === 7 || item.AppointmentStatusId === 5 || item.AppointmentStatusId === 6) {
            alertify.error("Appointment Cancelled!");
            return;
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "EncounterStatusPopup.html",
            /* "size": "lg",*/
            "backdrop": "static",
            "keyboard": false,
            "windowClass": " modal__style--1 modal__sixty--",
            "resolve": {
                "mainObject": function () { return item; }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, mainObject, $q, eHnoteSettingsDataService, eHnoteInsuranceService, alertify) {

                $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.UserId = eHnoteMasterDataService.getLoginId();

                $scope.HospitalId = 0;
                $scope.ParentHospitalId = 0;
                if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                    && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                    $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                }

                $scope.GetEncounter = function () {
                    var Obj = {

                        "UserId": $scope.UserId,
                        "HospitalId": $scope.HospitalId,
                        "SuperBillId": mainObject.SuperBillId,
                        "AppointmentId": mainObject.AppointmentId,
                        "PatientId": mainObject.PatientId,
                        "BillingEncounterStatusId": null,
                        "EncounterStatusId": null,
                        "EncounterStatus": "",
                        "Remarks": "",
                        "DeleteInd": 'N'
                    }
                    return Obj;
                }


                $scope.Changestatus = function (Id) {
                    var filtredArray = $filter("filter")($scope.BillingEncounterStatus, { "EncounterStatusId": Id }, true);
                    $scope.EncounterStatusobj.EncounterStatus = filtredArray[0].EncounterStatus;
                }
                $scope.initPopup = function () {
                    $scope.EncounterStatusobj = $scope.GetEncounter();
                    $scope.EncounterStatuslist = [];
                    let obj = {
                        "SuperBillId": $scope.EncounterStatusobj.SuperBillId,
                        "AppointmentId": $scope.EncounterStatusobj.AppointmentId,
                    }
                    $q.all([
                        eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                        eHnoteInsuranceService.GetBillingEncounterStatus(obj),
                    ]).then(function (resp) {


                        if (resp[0].data.BillingEncounterStatus.length !== 0) {
                            $scope.BillingEncounterStatus = (resp[0].data.BillingEncounterStatus || []).filter(function (item) {
                                return [1, 2, 3, 4].includes(item.EncounterStatusId);
                            });
                        }

                        if (resp[1].data.rows.length !== 0) {
                            $scope.EncounterStatuslist = resp[1].data.rows || [];
                            if ($scope.EncounterStatuslist.length > 0) {
                                $scope.EncounterStatusobj.EncounterStatusId = $scope.EncounterStatuslist[0].EncounterStatusId || null;
                                $scope.EncounterStatusobj.EncounterStatus = $scope.EncounterStatuslist[0].EncounterStatus || "";
                                $scope.EncounterStatusobj.Remarks = $scope.EncounterStatuslist[0].Remarks || '';
                                $scope.EncounterStatusobj.BillingEncounterStatusId = $scope.EncounterStatuslist[0].BillingEncounterStatusId || null;
                            }

                        } else {
                            mainObject.SuperBillId = mainObject.SuperBillId || 0;
                            if (mainObject.SuperBillId != 0) {

                                var datePart = mainObject.AppointmentDate;
                                var now = new Date();

                                var hours = now.getHours().toString().padStart(2, '0');
                                var minutes = now.getMinutes().toString().padStart(2, '0');
                                var dateTimeString = `${datePart}T${hours}:${minutes}:00`;

                                var obj = {
                                    "EncounterStatus": mainObject.EncounterStatus || "Ready To Bill",
                                    "Remarks": mainObject.SuperBillRemarks || "",
                                    "UserName": mainObject.AppointmentDoctorName || "",
                                    "ModifiedDt": new Date(dateTimeString)
                                }
                                $scope.EncounterStatuslist.push(obj);
                            }
                        }

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Data Failed");
                    });
                }
                $scope.initPopup();
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.SaveEncounterStatus = function () {
                    $scope.EncounterStatusobj.EncounterStatusId = $scope.EncounterStatusobj.EncounterStatusId || null;
                    if ($scope.EncounterStatusobj.EncounterStatusId == null) {
                        alertify.error("Please select Encounter Status");
                        return false;
                    }

                    $scope.EncounterStatusobj.Remarks = $scope.EncounterStatusobj.Remarks || '';
                    if ($scope.EncounterStatusobj.Remarks == '') {
                        alertify.error("Please select Remarks");
                        return false;
                    }

                    let obj = {
                        "UserId": $scope.EncounterStatusobj.UserId,
                        "HospitalId": $scope.EncounterStatusobj.HospitalId,
                        "PatientId": $scope.EncounterStatusobj.PatientId,
                        "SuperBillId": $scope.EncounterStatusobj.SuperBillId,
                        "AppointmentId": $scope.EncounterStatusobj.AppointmentId,
                        "BillingEncounterStatusId": 0,
                        "EncounterStatusId": $scope.EncounterStatusobj.EncounterStatusId,
                        "EncounterStatus": $scope.EncounterStatusobj.EncounterStatus,
                        "Remarks": $scope.EncounterStatusobj.Remarks,
                        "DeleteInd": $scope.EncounterStatusobj.DeleteInd,

                    }
                    eHnoteInsuranceService.AddUpdateBillingEncounterStatus(obj).then(function (resp) {
                        if (resp.data.Status == 'Success') {

                            var EncounterStatusId = $scope.EncounterStatusobj.EncounterStatusId || '';
                            $uibModalInstance.close(EncounterStatusId);
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        });
        mInstanceAdd.result.then(function (EncounterStatusId) {

            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, '', EncounterStatusId);
        }, function (cancel) {
        });

    };
    $scope.SearchPatientwithClaimId = function (pageno, type) {
        var type = (type === undefined || type === '') ? 'All' : type;
        var params = {
            "OrganizationId": $scope.serchobj.OrganizationId,
            "OrganizationFacilityId": 0,
            "FromDate": "",
            "ToDate": "",
            "PatientId": 0,
            "SearchText": "",
            "PatientMRNo": "",
            "PatienClaimNumber": $scope.serchobj.ClaimNumber || "",
            "BatchNumber": "",
            "BillingProviderId": 0,
            "RenderingProviderId": 0,
            "TransmissionTypeId": 0,
            "ClaimTypeId": 0,
            "PayorId": 0,
            "ClaimStatusList": $scope.serchobj.ClaimStatusList,
            "PageSize": 100,
            "PageNumber": 1,
            "Type": type,
            "BillPaymentTypeId": 0,
            "CurrentResponsibilityId": 0,
            "DenialId": 0
        };

        eHnotePatientDataService.GetOrganizationClaimsListData(params).then(function (resp) {
            console.log(resp);

            resp.data.rows = resp.data.rows || [];
            if (resp.data.rows.length > 0) {
                $scope.navtoClaimSummaryPopup(resp.data.rows[0]);
            }
        }, function (err) {

        });
        $scope.serchobj.ClaimNumber = "";
    }

    $scope.navtoClaimSummaryPopup = function (item) {

        item = item || '';
        let AppointmentId = null;
        let PatientId = null;
        if (item != '') {
            AppointmentId = item.AppointmentId;
            PatientId = item.PatientId;
        }

        $scope.claimScreenParentObj = {
            "PatientId": PatientId || null,
            "AppointmentId": AppointmentId || null,
            "AppointmentTypeId": item.AppointmentTypeId || null,
            "AppointmentDate": item.AppointmentDate || null,
            "EncounterStatus": item.EncounterStatus || "Ready To Bill",
            "EncounterStatusId": item.EncounterStatusId || 1,
            "PatientFullName": item.PatientFullName || "",
            "ResponcibilityId": item.ResponcibilityId || 0,
            "VisitId": item.VisitId || 0,
            "ActionType": "EditClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "PatientClaimId": item.PatientClaimId,
            "IsCreateSuperBill": false,
            "SuperBillId": item.SuperBillId || null,
            "SuperBillArray": item.SuperBillArray || [],
            "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
            "OrganizationFacilityId": item.OrganizationFacilityId || 0,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame,
            "SuperBillRemarks": item.SuperBillRemarks
        };
        $scope.mainBillerDataObj.Tabid = 2;
        $scope.mainBillerDataObj.PatientId = $scope.mainBillerDataObj.PatientId || 0;
        $scope.mainBillerDataObj.PatientId = PatientId || 0;
        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "controller": "UsAddUpdateClaimPopupCtrl",
            "size": "lg",
            'backdrop': 'static',
            "keyboard": false,
            "windowClass": "modal__popup--1",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
            }
        });

        $scope.mInstanceAdd.result.then(function (response) {

            console.log(response);

            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, response);

        }, function () { });
    }

    $scope.navtoClaimSummaryPopup1 = function (item,Mitem) {

        item = item || '';
        let AppointmentId = null;
        let PatientId = null;
        if (item != '') {
            AppointmentId = item.AppointmentId;
            PatientId = item.PatientId;
        }

        $scope.claimScreenParentObj = {
            "PatientId": PatientId || null,
            "AppointmentId": AppointmentId || null,
            "AppointmentTypeId": item.AppointmentTypeId || null,
            "AppointmentDate": item.AppointmentDate || null,
            "EncounterStatus": item.EncounterStatus || "Ready To Bill",
            "EncounterStatusId": item.EncounterStatusId || 1,
            "PatientFullName": item.PatientFullName || "",
            "ResponcibilityId": item.ResponcibilityId || 0,
            "VisitId": item.VisitId || 0,
            "ActionType": "EditClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "PatientClaimId": Mitem.PatientClaimId,
            "IsCreateSuperBill": false,
            "SuperBillId": item.SuperBillId || null,
            "SuperBillArray": item.SuperBillArray || [],
            "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
            "OrganizationFacilityId": item.OrganizationFacilityId || 0,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame,
            "SuperBillRemarks": item.SuperBillRemarks
        };
        $scope.mainBillerDataObj.Tabid = 2;
        $scope.mainBillerDataObj.PatientId = $scope.mainBillerDataObj.PatientId || 0;
        $scope.mainBillerDataObj.PatientId = PatientId || 0;
        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "controller": "UsAddUpdateClaimPopupCtrl",
            "size": "lg",
            'backdrop': 'static',
            "keyboard": false,
            "windowClass": "modal__popup--1",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
            }
        });

        $scope.mInstanceAdd.result.then(function (response) {

            console.log(response);
            if ($scope.BillingEncounterStatus.length>0) {
                angular.forEach($scope.BillingEncounterStatus, function (s) {
                    s.isChecked = true;
                });
            }

            $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
            if ($scope.selectedEncounterslist != '') {
                $scope.searchClaimEncounterReqObj.FromDate = $scope.selectedEncounterslist.FromDate || null;
                $scope.searchClaimEncounterReqObj.ToDate = $scope.selectedEncounterslist.ToDate || null;
                $scope.showifnotCurrentDate = false;
                var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if (CurrentDate !== $scope.searchClaimEncounterReqObj.FromDate) {
                    $scope.showifnotCurrentDate = true;
                }
                $scope.selectedEncounterslist.SelectedBranchesList = $scope.selectedEncounterslist.SelectedBranchesList || '';
                if ($scope.mainBillerDataObj.AllBranchesList.length > 0 && $scope.selectedEncounterslist.SelectedBranchesList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });

                    var selectedClinicIds = $scope.selectedEncounterslist.SelectedBranchesList.split(",");
                    $scope.mainBillerDataObj.AllBranchesList.forEach(pitem => {
                        pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
                    var AllLocationIND = checkedArray.length > 0 && $scope.mainBillerDataObj.AllBranchesList.length === checkedArray.length ? true : false;
                    if (AllLocationIND) {
                        $scope.LocationTypeObj.SelectLocationString = "All Locations";
                    } else if (checkedArray.length == 1) {
                        $scope.LocationTypeObj.SelectLocationString = checkedArray[0].ClinicName || "Select";
                    } else {
                        $scope.LocationTypeObj.SelectLocationString = "Selected";
                    }
                }

                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
                    $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedDoctor = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            $scope.selectedDoctor = "Selected";
                        }
                    }
                }

                if ($scope.AllVisitReasons.length > 0 && $scope.selectedEncounterslist.Visitreasons != '') {
                    angular.forEach($scope.AllVisitReasons, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedVrIds = $scope.selectedEncounterslist.Visitreasons.split(",");
                    $scope.AllVisitReasons.forEach(pitem => {
                        pitem.isChecked = selectedVrIds.includes(pitem.ParentAppointmentVisitReasonId.toString());
                    });

                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                    if ($scope.AllSelectionObj.AllVisitReasonsCheck) {
                        $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
                    } else {
                        $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
                    }
                }

                $scope.selectedEncounterslist.BillingEncounterStatus = $scope.selectedEncounterslist.BillingEncounterStatus || '';
                if ($scope.BillingEncounterStatus.length > 0 && $scope.selectedEncounterslist.BillingEncounterStatus != '') {
                    angular.forEach($scope.BillingEncounterStatus, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.split(",");
                    $scope.BillingEncounterStatus.forEach(pitem => {
                        pitem.isChecked = selectedEncounterIds.includes(pitem.EncounterStatusId.toString());
                    });


                    var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    $scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedstatus = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedstatus = checkedArray[0].EncounterStatus;
                        } else {
                            $scope.selectedstatus = "Select";
                        }
                    }
                }
            }
            $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, response, selectedEncounterIds);


          /*  $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber, response);*/

        }, function () { });
    }

    //$scope.navtoOpenAddDepositAmount = function (obj) {

    //    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>There is a patient balance observed in the claim " + obj.PatientClaimNumber + ", do you want to add the payment and settle it?</h4>", function () {

    //        $scope.obj = {
    //            "PatientId": obj.Patientobj.PatientId,
    //            "Type": '',
    //            "UsersList": obj.UsersList,
    //            "Patientobj": obj.Patientobj,
    //            "ClaimDetailsList": obj.ClaimDetailsList,
    //            "OrganizationFacilityList": obj.OrganizationFacilityList,
    //            "DepositTypes": obj.DepositTypes,
    //            "WriteOffReasons": obj.WriteOffReasons,
    //            "BillingProviderName": obj.BillingProviderName || "",
    //            "FacilityName": obj.FacilityName || "",
    //            "PatientClaimNumber": obj.PatientClaimNumber || 0
    //        }

    //        var modalInstance = $uibModal.open({
    //            "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
    //            "controller": "UsAddPatientDepositsCtrl",
    //            "resolve": {
    //                "Selectobj": function () { return $scope.obj; },
    //            },
    //            "size": "lg",
    //            "backdrop": "static",
    //            "keyboard": false,
    //            "windowClass": "modal__ninety--   "

    //        });
    //        modalInstance.result.then(function () {

    //            $scope.switchClaimBillerSubTab(2);

    //        }, function () { });

    //        $scope.$apply();
    //    }, function () {

    //    });
    //}





    $scope.ManualClaimCreation = function () {

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "ManualClaimpopup.html",
            "backdrop": "static",
            "keyboard": false,
            //"size": "lg",
            "windowClass": "modal__ninety-- ",
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService,) {

                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                $scope.ParenthospitalId = 0;
                $scope.HospitalId = 0;
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                };
                $scope.UserRoleId = doctorinfo.doctordata.User[0].RoleId;
                function getSelectedPatientObj() {
                    var obj = {
                        "SearchText": "",
                        "PatientId": 0,
                        "SearchTypeId": 2,
                        "ScreenType": "",
                        "OrganizationFacilityId": "",
                        "PatientMRNo": "",
                        "DOB": ""
                    }
                    return obj;
                };
                $scope.PatientSearchObj = getSelectedPatientObj();
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.LoadPatientListSearch = function (val) {


                    if (val == undefined || val == null || val == "") {
                        $scope.AllPatientList = [];
                        $scope.PatientSearchObj.PatientId = 0;
                        $scope.ShowPatientDetailsDrop = false;
                        return false;
                    }
                    var param = {
                        "PageSize": 21,
                        "UserId": "",
                        "PageNumber": 1,
                        "SearchText": "",
                        "Count": 0,
                        "SearchDetails": { "listdocpatients": "Y" },
                        "EndAge": 0,
                        "StartAge": 0,
                        "StartDate": "",
                        "EndDate": ""
                    };


                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

                        $scope.HospitalArray = [];
                        angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                            if (item.ExtDetails !== undefined) {
                                if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                    var Obj = {
                                        "HospitalName": item.ClinicName,
                                        "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                        "ActiveIND": "Y",
                                        "isChecked": true,
                                        "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                    };
                                    $scope.HospitalArray.push(Obj);
                                }
                            }
                        });

                    }
                    var list = [];
                    angular.forEach($scope.HospitalArray, function (items) {
                        if (items.isChecked) {
                            list.push(items.BranchId);
                        }
                    });
                    param["HospitalIDLst"] = list;
                    eHnoteMasterDataService.addPatientSearchInfo(param);
                    var object = {
                        "UserId": $scope.UserId,
                        "HospitalID": $scope.HospitalId,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": $scope.PatientSearchObj.SearchText || "",
                        "SearchTypeID": $scope.PatientSearchObj.SearchTypeId || 0,
                    }
                    if ($scope.PatientSearchObj.SearchTypeId == 1) {
                        object.Name = val;
                    } else if ($scope.PatientSearchObj.SearchTypeId == 2) {
                        object.PatientId = val;
                    }
                    eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
                };
                $scope.ShowPatientDetailsDrop = false;
                function OnGetopSearchPatientSuccess(data) {

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        if (data.rows.length > 0) {
                            $scope.AllPatientList = data.rows || [];
                        }
                        else {
                            $scope.count = 0;
                            $scope.AllPatientList = [];
                        }
                    }

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        $scope.patientDetailsList = [];
                        $scope.patientinitval = {};
                        angular.forEach(data.rows, function (item) {
                            $scope.patientinitval = {};
                            var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                            var val = array_list[Math.floor(Math.random() * array_list.length)];
                            if (item.EmailID !== undefined) {
                                $scope.patientinitval.EmailID = item.EmailID;
                            }

                            $scope.patientinitval.PatientID = item.PatientId;
                            $scope.patientinitval.Title = item.Title;
                            $scope.patientinitval.S3URL = item.S3URL || "";
                            $scope.patientinitval.FullName = item.FullName;
                            $scope.patientinitval.DOB = item.DOB;
                            $scope.patientinitval.AgeInYears = item.AgeInYears;
                            $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                            $scope.patientinitval.AgeInDays = item.AgeInDays;
                            $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                            $scope.patientinitval.Altareacode = item.Altareacode || '';
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                            $scope.patientinitval.Gender = item.Gender;
                            $scope.patientinitval.LastVisited = item.LastVisited;
                            $scope.patientinitval.CountryCode = item.CountryCode;
                            $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                            $scope.patientinitval.CurrentAge = item.CurrentAge;
                            $scope.patientinitval.colors = val;
                            $scope.patientinitval.OldMrno = item.OldMrno || "";
                            $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                            $scope.patientinitval.patientdisplayid = item.DisplayID;
                            $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                            $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                            $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                            $scope.patientinitval.Due = item.Due;
                            $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                            $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                            $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                            $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                            $scope.patientinitval.DisplayID = item.DisplayID || "";
                            $scope.patientinitval.Altareacode = item.Altareacode || "";
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                            $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                            $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                            var previouspatval = angular.copy($scope.patientinitval);
                            $scope.patientDetailsList.push(previouspatval);
                        });
                        $scope.AllPatientList = $scope.patientDetailsList;

                        $scope.noresult = false;
                        $scope.showloading = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $scope.count = 0;
                        $scope.AllPatientList = [];
                    }
                    if ($scope.PatientSearchObj.SearchText != "") {
                        $scope.ShowPatientDetailsDrop = true;
                    }
                }
                function OnGetopPatientSearchError() {
                    $scope.count = 0;
                    $scope.AllPatientList = [];
                    $scope.PatientSearchObj.SearchText = "";
                }
                $scope.changePatientSearchType = function (id) {
                    $scope.PatientSearchObj = getSelectedPatientObj();
                    $scope.PatientSearchObj.SearchTypeId = id;
                    $scope.AllPatientList = [];
                    $scope.AllEncounterPatientList = [];
                    if ($scope.PatientSearchObj.SearchText == '') {
                        $scope.ShowPatientDetailsDrop = false;
                    }

                }
                $scope.clearPatientListData = function () {
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.PatientSearchObj.SearchText = "";
                    $scope.PatientSearchObj.PatientId = 0;
                };

                $scope.SelectedPatientData = function (patietnitem) {
                    $scope.PatientSearchObj.PatientId = patietnitem.PatientID;
                    $scope.PatientSearchObj.SearchText = patietnitem.FullName;
                    $scope.AllPatientList = [];
                    $scope.ShowPatientDetailsDrop = false;

                };

                $scope.SaveManualClaim = function (type) {
                    $scope.PatientSearchObj.PatientId = $scope.PatientSearchObj.PatientId || 0;
                    if (type == 'POS') {
                        $scope.PatientSearchObj.ScreenType = 3;
                    } else {
                        $scope.PatientSearchObj.ScreenType = 1;
                    }
                    if ($scope.PatientSearchObj.PatientId == 0) {
                        alertify.error("Please Select Patient");
                        return false;
                    }
                    $uibModalInstance.close($scope.PatientSearchObj);
                }


            }

        });
        mInstanceAdd.result.then(function (resp) {
            let obj = {
                "AppointmentDate": null,
                "PatientId": resp.PatientId || null,
                "PatientFullName": resp.SearchText || "",
                "AppointmentId": null,
                "ScreenType": resp.ScreenType || '',
                "SuperBillArray": [],
                "SuperBillDiagnosisArray": [],
                "IsFrom": "ManualBill",
            }

            $scope.navtoGenerateClaim("AddClaim", obj);


        }, function () { });

    }





    $scope.getDoctorsbySubSpecialization = function (hospitalID, testId) {

        hospitalID = hospitalID || "";
        if (hospitalID == "") {
            var Locationids = '';
            Locationids = $scope.mainBillerDataObj.AllBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");

            hospitalID = Locationids || '';
        }
        $scope.mainBillerDataObj.AllDoctorsList = [];
        $scope.BranchDoctorsList = [];
        $scope.allUserList = [];
        $scope.DoctorObj = "";


        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray || '',
        }
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;


                if ($scope.allUserList.length !== 0) {

                    $scope.AllDoctorsList = angular.copy($scope.allUserList);
                }

                $scope.AllDoctorsList = _.uniq($scope.AllDoctorsList, false, function (p) { return p.DoctorID; });
                $scope.mainBillerDataObj.AllDoctorsList = angular.copy($scope.AllDoctorsList);

                $scope.mainBillerDataObj.AllDoctorsList = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (ditem) {
                    ditem.isChecked = true;
                });
                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });
                }
                $scope.selectedDoctor = 'All Doctors';
                $scope.AllSelectionObj.AllDoctorCheck = true;
                testId = testId || 0;
                if (testId == 1) {
                    $scope.SearchCLaimEncounters($scope.searchClaimEncounterReqObj.PageNumber);
                }
            } else {
                alertify.error("No Doctors Found in Selected Hospital");

            }


        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.ChangeApptBranch = function (item, typeId) {

        $scope.searchClaimEncounterReqObj.SelectedHospitalId = item.ClinicId || 0;
        $scope.AppListselectedclinic = item || {};

        if (item.IsChecked) {
            if (item.ClinicId === 0) {
                angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (mitem) {
                    mitem.IsChecked = true;
                });
            }
        } else {
            if (item.ClinicId === 0) {
                angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (mitem) {
                    mitem.IsChecked = false;
                });
            }
        }


        var Locationids = '';
        Locationids = $scope.mainBillerDataObj.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");

        typeId = typeId || 0;
        $scope.getDoctorsbySubSpecialization(Locationids);
        if (typeId == 0) {
            $scope.getvisitReasons(Locationids);
        }

        var nonZeroChecked = $scope.mainBillerDataObj.AllBranchesList
            .filter(branch => branch.ClinicId !== 0)
            .every(branch => branch.IsChecked === true);

        var clinicZeroItem = $scope.mainBillerDataObj.AllBranchesList.find(branch => branch.ClinicId === 0);
        if (clinicZeroItem) {
            clinicZeroItem.IsChecked = nonZeroChecked;
        }

        var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
        var checkedCount = checkedArray.length;
        var totalBranches = $scope.mainBillerDataObj.AllBranchesList.length;

        if (checkedCount === totalBranches) {
            $scope.LocationTypeObj.SelectLocationString = "All Locations";
        } else if (checkedCount > 0) {
            $scope.LocationTypeObj.SelectLocationString = "Selected";
        } else {
            $scope.LocationTypeObj.SelectLocationString = "Select";
        }

        if (checkedCount == 1) {
            var filterlist = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, function (item) {
                return item.ClinicId == checkedArray[0].ClinicId;
            }) || [];
            if (filterlist.length > 0) {
                $scope.LocationTypeObj.SelectLocationString = filterlist[0].ClinicName || "Select";
            }
        }

    }
    $scope.getvisitReasons = function (item) {

        $scope.AllVisitReasons = [];
        var visitreasonParams = {
            "OrganizationId": item,
            "ReasonTypeId": 1,
            "SearchText": "",
            "VisitTypeId": null
        };
        eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(visitreasonParams).then(function (resp) {

            if (resp.data.status == "Success") {
                $scope.AllVisitReasons = resp.data.rows || [];
                if ($scope.AllVisitReasons.length > 0) {
                    $scope.AllVisitReasons = $filter("filter")($scope.AllVisitReasons, function (item) {
                        return item.ActiveIND === 'Y';
                    });
                    angular.forEach($scope.AllVisitReasons, function (item) {
                        item.isChecked = true;
                    });
                }
            }
        });
    }

    $scope.CheckAllFacilityType = function (val) {
        if (val) {
            angular.forEach($scope.OrganizationFacilityList, function (item) {
                item.IsChecked = true;
            });

            $scope.FacilityTypeObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.OrganizationFacilityList, function (item) {
                item.IsChecked = false;
            });

            $scope.FacilityTypeObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.FacilityTypeToggle = function () {
        var checkedArray = _.where($scope.OrganizationFacilityList, { IsChecked: true });
        $scope.FacilityTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.OrganizationFacilityList.length === checkedArray.length ? true : false;
        if ($scope.FacilityTypeObj.AllStatusCheck) {
            $scope.FacilityTypeObj.SelectStatusString = 'All';
        }

        if (!$scope.FacilityTypeObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.FacilityTypeObj.SelectStatusString = 'Selected';
        }
    };

    $scope.clicktoNavPatientSearch = function () {

        $scope.encountermodelInstanceAdd = $uibModal.open({
            "templateUrl": "CreateEncounterPopup.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "resolve": {
                "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                "OrganizationFacilityList": function () { return $scope.OrganizationFacilityList; },
                "AllVisitReasons": function () { return $scope.AllVisitReasons; },
                "allSubSpecializationsArray": function () { return $scope.allSubSpecializationsArray || []; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, AllHospitalData, OrganizationFacilityList, AllVisitReasons, allSubSpecializationsArray, eHnoteAdminDepartmentService) {

                $scope.AllEncounterPatientList = [];
                $scope.OPandOTAppointmentList = [];
                $scope.AppListdoctoraddress = [];
                $scope.clinicDoctorList = [];
                $scope.selectedDoctor = "All Doctors";
                $scope.SelectedProvider = 'All Doctors';
                $scope.SelectedVisittype = 'All Visit Reasons';
                $scope.SelectedBranchName = "All Locations";
                $scope.AllHospitalData = AllHospitalData;
                $scope.OPandOTAppointmentListCount = 0;
                $scope.OrganizationFacilityList = OrganizationFacilityList || [];
                $scope.AllVisitReasonsList = AllVisitReasons || [];
                $scope.allSubSpecializationsArray = allSubSpecializationsArray || [];
                $scope.clinicDoctorList = AllHospitalData.AllUsersList || [];
                $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
                $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
                $scope.ClinicId = $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;

                $scope.UserId = eHnoteMasterDataService.getLoginId();
                $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

                $scope.AllHospitalData.AllDoctorsList = $filter("filter")($scope.AllHospitalData.AllDoctorsList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });

                $scope.HospitalId = 0;
                $scope.ParentHospitalId = 0;
                if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                    && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                    $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                }

                $scope.AllSelectionObj = {
                    "AllDoctorCheck": true,
                    "AllVisitReasonsCheck": true,
                    "AllAppointmentTypeStatusCheck": true,
                    "AllApptSignStatus": true
                }

                function getSelectedPatientObj() {
                    var obj = {
                        "SearchText": "",
                        "PatientId": 0,
                        "SearchTypeId": 2,
                        "OrganizationFacilityId": "",
                        "PatientMRNo": "",
                        "DOB": "",
                        "PatientSearchInd": true,
                    }
                    return obj;
                };
                $scope.PatientSearchObj = getSelectedPatientObj();

                $scope.GetExamType = function () {
                    return [{
                        "ExamTypeId": 1,
                        "ExamTypeName": "New Patient"
                    },
                    {
                        "ExamTypeId": 2,
                        "ExamTypeName": "Established Patient"
                    }
                    ];
                };
                $scope.ExamTypeList = angular.copy($scope.GetExamType()) || [];

                $scope.LoadPatientListSearch = function (val) {


                    if (val == undefined || val == null || val == "") {
                        $scope.AllPatientList = [];
                        $scope.PatientSearchObj.PatientId = 0;
                        $scope.ShowPatientDetailsDrop = false;
                        return false;
                    }
                    var param = {
                        "PageSize": 21,
                        "UserId": "",
                        "PageNumber": 1,
                        "SearchText": "",
                        "Count": 0,
                        "SearchDetails": { "listdocpatients": "Y" },
                        "EndAge": 0,
                        "StartAge": 0,
                        "StartDate": "",
                        "EndDate": ""
                    };

                    let doctorInfo = eHnoteMasterDataService.getUserInfo();
                    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

                        $scope.HospitalArray = [];
                        angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                            if (item.ExtDetails !== undefined) {
                                if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                    var Obj = {
                                        "HospitalName": item.ClinicName,
                                        "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                        "ActiveIND": "Y",
                                        "isChecked": true,
                                        "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                    };
                                    $scope.HospitalArray.push(Obj);
                                }
                            }
                        });

                    }
                    var list = [];
                    angular.forEach($scope.HospitalArray, function (items) {
                        if (items.isChecked) {
                            list.push(items.BranchId);
                        }
                    });
                    param["HospitalIDLst"] = list;
                    eHnoteMasterDataService.addPatientSearchInfo(param);
                    var object = {
                        "UserId": $scope.UserId,
                        "HospitalID": $scope.HospitalId,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": $scope.PatientSearchObj.SearchText || "",
                        "SearchTypeID": $scope.PatientSearchObj.SearchTypeId || 0,
                    }
                    if ($scope.PatientSearchObj.SearchTypeId == 1) {
                        object.Name = val;
                    } else if ($scope.PatientSearchObj.SearchTypeId == 2) {
                        object.PatientId = val;
                    }
                    eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
                };

                $scope.ShowPatientDetailsDrop = false;
                function OnGetopSearchPatientSuccess(data) {

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        if (data.rows.length > 0) {
                            $scope.AllPatientList = data.rows || [];
                        }
                        else {
                            $scope.count = 0;
                            $scope.AllPatientList = [];
                        }
                    }

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        $scope.patientDetailsList = [];
                        $scope.patientinitval = {};
                        angular.forEach(data.rows, function (item) {
                            $scope.patientinitval = {};
                            var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                            var val = array_list[Math.floor(Math.random() * array_list.length)];
                            if (item.EmailID !== undefined) {
                                $scope.patientinitval.EmailID = item.EmailID;
                            }

                            $scope.patientinitval.PatientID = item.PatientId;
                            $scope.patientinitval.Title = item.Title;
                            $scope.patientinitval.S3URL = item.S3URL || "";
                            $scope.patientinitval.FullName = item.FullName;
                            $scope.patientinitval.DOB = item.DOB;
                            $scope.patientinitval.AgeInYears = item.AgeInYears;
                            $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                            $scope.patientinitval.AgeInDays = item.AgeInDays;
                            $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                            $scope.patientinitval.Altareacode = item.Altareacode || '';
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                            $scope.patientinitval.Gender = item.Gender;
                            $scope.patientinitval.LastVisited = item.LastVisited;
                            $scope.patientinitval.CountryCode = item.CountryCode;
                            $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                            $scope.patientinitval.CurrentAge = item.CurrentAge;
                            $scope.patientinitval.colors = val;
                            $scope.patientinitval.OldMrno = item.OldMrno || "";
                            $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                            $scope.patientinitval.patientdisplayid = item.DisplayID;
                            $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                            $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                            $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                            $scope.patientinitval.Due = item.Due;
                            $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                            $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                            $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                            $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                            $scope.patientinitval.DisplayID = item.DisplayID || "";
                            $scope.patientinitval.Altareacode = item.Altareacode || "";
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                            $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                            $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                            var previouspatval = angular.copy($scope.patientinitval);
                            $scope.patientDetailsList.push(previouspatval);
                        });
                        $scope.AllPatientList = $scope.patientDetailsList;

                        $scope.noresult = false;
                        $scope.showloading = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $scope.count = 0;
                        $scope.AllPatientList = [];
                    }
                    if ($scope.PatientSearchObj.SearchText != "") {
                        $scope.ShowPatientDetailsDrop = true;
                    }
                }
                function OnGetopPatientSearchError() {
                    $scope.count = 0;
                    $scope.AllPatientList = [];
                    $scope.PatientSearchObj.SearchText = "";
                }

                $scope.clearPatientListData = function () {
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.PatientSearchObj.SearchText = "";
                    $scope.PatientSearchObj.PatientId = 0;
                    $scope.searchClaimEncounterReqObj.PatientId = 0;
                };

                $scope.SelectedPatientData = function (patietnitem) {
                    $scope.PatientSearchObj.PatientId = patietnitem.PatientID;
                    $scope.PatientSearchObj.SearchText = patietnitem.FullName;
                    $scope.AllPatientList = [];
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.SearchAppointmentList();
                };

                $scope.FacilityTypeObj = {
                    "SelectStatusString": "All",
                    "Name": "",
                    "AllStatusCheck": true
                };
                $scope.searchradio = {
                    "PatientSearchType": 2
                };

                $scope.Appointment = {
                    "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                    "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                    "FacilityListIds": "",
                    "LocationIds": "",
                    "SelectedHospitalId": 0,
                };

                $scope.AppointmentType = {
                    "TypeId": "",
                    "VisitTypeId": "",
                    "SignStatus": ""
                };

                $scope.SelectedSignStatus = "All";

                $scope.GetAllApptSignStatusList = function () {
                    return [
                        {
                            "SignStatusId": 1,
                            "SignStatus": "Signed",
                            "isChecked": true
                        },
                        {
                            "SignStatusId": 7,
                            "SignStatus": "NotSigned",
                            "isChecked": true
                        },
                        {
                            "SignStatusId": 8,
                            "SignStatus": "No Visit Note",
                            "isChecked": true
                        }];
                };
                $scope.AllApptSignStatusList = angular.copy($scope.GetAllApptSignStatusList());

                $scope.Pagination = { "currentPagePatient": 1, "Patientitemsperpage": 100, "Patientmaxsize": 10 };
                $scope.PageNumber = 1;

                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                };

                $scope.navtocreateEncounter = function (item) {
                    let obj = {
                        "Type": "encounter",
                        "item": item,
                        "VisitItem": "",
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate
                    }
                    $uibModalInstance.close(obj);
                };

                $scope.navtocreateEncounterforVisit = function (visit, item) {


                    let obj = {
                        "Type": "encounter",
                        "item": item,
                        "VisitItem": visit,
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate
                    }
                    $uibModalInstance.close(obj);
                };

                $scope.navtocreateSuperBill = function (vitem, item) {
                    item.AppSign = item.AppSign || "";
                    if (item.AppSign == "Signed") {
                        item.EncounterStatus = "Ready To Bill";
                        item.EncounterStatusId = 1;

                    } else {
                        item.EncounterStatus = "NotSigned";
                        item.EncounterStatusId = 7;
                    }
                    //else if (item.AppSign == "NotSigned") {

                    //    item.EncounterStatus = "NotSigned";
                    //    item.EncounterStatusId = 7;
                    //}
                    //else {
                    //    item.EncounterStatus = "No Visit Note";
                    //    item.EncounterStatusId = 8;
                    //}

                    if (item.PaymentTypeId == 2) {
                        item.ResponcibilityId = 2;
                    } else {
                        item.ResponcibilityId = 1;
                    }

                    let obj = {
                        "PatientId": item.Patient.PatientId || null,
                        "AppointmentId": item.AppointmentId || null,
                        "AppointmentTypeId": item.AppointmentTypeId || null,
                        "AppointmentDate": item.AppointmentDate || null,
                        "PatientFullName": item.Patient.FullName || "",
                        "ResponcibilityId": item.ResponcibilityId || 0,
                        "EncounterStatus": item.EncounterStatus,
                        "EncounterStatusId": item.EncounterStatusId,
                        "VisitId": vitem.VisitId || 0,
                        "ActionType": "SuperBill",
                        "ScreenType": "Popup",
                        "PatientClaimId": 0,
                        "IsCreateSuperBill": false,
                        "SuperBillId": vitem.SuperBillId || 0,
                        "SuperBillArray": [],
                        "SuperBillDiagnosisArray": [],
                        "OrganizationFacilityId": item.OrganizationFacilityId || 0,
                        "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
                        "IsResponsibilitySame": true,
                        "IsSuperBillInd": true
                    }

                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                    appoint_info.AppointmentId = item.AppointmentId || 0;
                    appoint_info.AppointmentID = item.AppointmentId || 0;
                    appoint_info.AppointmentStatus = item.AppointmentStatus || "";
                    appoint_info.AppointmentStatusId = item.AppointmentStatusId || null;


                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);

                    var currentDate = $filter('date')(new Date(), 'MM-dd-yyyy');
                    var appointmentDate = $filter('date')(item.AppointmentDate, 'MM-dd-yyyy');
                    var isTodayAppointment = currentDate === appointmentDate;

                    if ((appoint_info.AppointmentStatusId == 1 || appoint_info.AppointmentStatusId == null) && isTodayAppointment === true) {
                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>The patient isn't Checked In!<br> Do you want to Check In the patient? </h4>", function () {

                            var CurrentTime = $filter("date")(new Date(), "HH:mm:ss");

                            var params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "HospitalId": $scope.HospitalId,
                                "AppointmentId": appoint_info.AppointmentId,
                                "AppointmentTrackerDetailId": 0,
                                "RoleId": $scope.userLoginDetails.RoleID,
                                "VisitReason": "",
                                "AttenderName": "",
                                "DoctorId": null,
                                "DoctorRoleId": null,
                                "RoomTypeId": 9,
                                "RoomId": null,
                                "CurrentTime": CurrentTime,
                                "IsSendTo": "N",
                                "IsCheckedIn": "Y",
                                "IsCheckedOut": "N",
                                "IsReCheckIn": "N",
                                "IsReCheckOut": "N",
                                "AppointmentStatusId": 2,
                                "BookingStatusId": appoint_info.BookingStatusId || 1,
                                "VisitTypeId": appoint_info.VisitTypeId,
                                "HospitalEquipmentId": appoint_info.PatientTagList || []
                            }

                            //if ($scope.userLoginDetails.RoleID === 1 || $scope.userLoginDetails.RoleID === 43 || $scope.userLoginDetails.RoleID === 16) {
                            //    params.RoomTypeId = 1;
                            //}
                            //if ($scope.userLoginDetails.RoleID === 10) {
                            //    params.RoomTypeId = 2;
                            //}

                            eHnoteMainAppointmentService.AddUpdateAppointmentCheckInTrackerDetails(params).then(function (resp) {
                                if (resp.data.Status == "Success") {
                                    alertify.success("Patient CheckIn Successfully");
                                    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
                                    appoint_info.AppointmentStatusId = 2;
                                    appoint_info.CheckinStatusId = 2;
                                    eHnoteMasterDataService.addAppointmentInfo(appoint_info);
                                    $uibModalInstance.close(obj);
                                }
                            }, function (err) {
                                alertify.error("Getting Failed");
                            });

                        }, function () {
                            r = "You pressed Cancel!";
                        });
                    } else {
                        $uibModalInstance.close(obj);
                    }
                };

                $scope.changePatientSearchType = function (id) {
                    $scope.PatientSearchObj = getSelectedPatientObj();
                    $scope.PatientSearchObj.SearchTypeId = id;
                    $scope.AllPatientList = [];
                    $scope.AllEncounterPatientList = [];
                    if ($scope.PatientSearchObj.SearchText == '') {
                        $scope.ShowPatientDetailsDrop = false;
                    }
                }


                $scope.getDoctorsbySubSpecializations = function (hospitalID, val) {


                    $scope.BranchDoctorsList = [];
                    $scope.allUserList = [];
                    $scope.DoctorObj = "";
                    $scope.AllHospitalData.AllDoctorsList = [];

                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                    var reqObj = {
                        "BranchId": hospitalID,
                        "SubSpecializationIdArray": subSplArray || '',
                    }
                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;


                            if ($scope.allUserList.length !== 0) {

                                $scope.clinicDoctorList = angular.copy($scope.allUserList);
                            }

                            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                                return item.RoleId === 1 || item.RoleId === 43;
                            });

                            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                            $scope.AllHospitalData.AllDoctorsList = angular.copy($scope.clinicDoctorList);
                            angular.forEach($scope.AllHospitalData.AllDoctorsList, function (ditem) {
                                ditem.isChecked = true;
                            });
                            $scope.SelectedProvider = 'All Doctors';
                            $scope.AllSelectionObj.AllDoctorCheck = true;
                            val = val || 0;
                            if (val == 1) {
                                $scope.getvisitReasons(hospitalID, val);
                            }
                        } else {
                            alertify.error("No Doctors Found in Selected Hospital");

                        }


                    }

                    function onGetUsersFailure(data) {
                    }
                }

                $scope.CheckAllBranches = function (item, val) {

                    $scope.Appointment.SelectedHospitalId = item.ClinicId || 0;
                    $scope.AppListselectedclinic = item || {};

                    if (item.IsChecked) {
                        if (item.ClinicId === 0) {
                            angular.forEach($scope.AllHospitalData.AllBranchesList, function (mitem) {
                                mitem.IsChecked = true;
                            });
                        }
                    } else {
                        if (item.ClinicId === 0) {
                            angular.forEach($scope.AllHospitalData.AllBranchesList, function (mitem) {
                                mitem.IsChecked = false;
                            });
                        }
                    }

                    var Locationids = '';
                    Locationids = $scope.AllHospitalData.AllBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");

                    val = val || 0;
                    if (val == 1) {
                        $scope.getDoctorsbySubSpecializations(Locationids, val);
                    }
                    else {
                        $scope.getDoctorsbySubSpecializations(Locationids);
                        $scope.getvisitReasons(Locationids);
                    }

                    var nonZeroChecked = $scope.AllHospitalData.AllBranchesList
                        .filter(branch => branch.ClinicId !== 0)
                        .every(branch => branch.IsChecked === true);

                    var clinicZeroItem = $scope.AllHospitalData.AllBranchesList.find(branch => branch.ClinicId === 0);
                    if (clinicZeroItem) {
                        clinicZeroItem.IsChecked = nonZeroChecked;
                    }

                    var checkedArray = _.where($scope.AllHospitalData.AllBranchesList, { IsChecked: true });
                    var checkedCount = checkedArray.length;
                    var totalBranches = $scope.AllHospitalData.AllBranchesList.length;

                    if (checkedCount === totalBranches) {
                        $scope.SelectedBranchName = "All Locations";
                    } else if (checkedCount > 0) {
                        $scope.SelectedBranchName = "Selected";
                    } else {
                        $scope.SelectedBranchName = "Select";
                    }

                    if (checkedCount == 1) {
                        var filterlist = $filter("filter")($scope.AllHospitalData.AllBranchesList, function (item) {
                            return item.ClinicId == checkedArray[0].ClinicId;
                        }) || [];
                        if (filterlist.length > 0) {
                            $scope.SelectedBranchName = filterlist[0].ClinicName || "Select";
                        }
                    }
                }

                $scope.getvisitReasons = function (item, val) {

                    $scope.AllVisitReasons = [];
                    var visitreasonParams = {
                        "OrganizationId": item,
                        "ReasonTypeId": 1,
                        "SearchText": "",
                        "VisitTypeId": null
                    };
                    eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(visitreasonParams).then(function (resp) {

                        if (resp.data.status == "Success") {

                            $scope.AllVisitReasonsList = resp.data.rows || [];
                            if ($scope.AllVisitReasonsList.length > 0) {
                                $scope.AllVisitReasonsList = $filter("filter")($scope.AllVisitReasonsList, function (item) {
                                    return item.ActiveIND === 'Y';
                                });
                                angular.forEach($scope.AllVisitReasonsList, function (item) {
                                    if (item.ActiveIND === 'Y') {
                                        item.isChecked = true;
                                    }
                                });
                                $scope.SelectedVisittype = "All Visit Reasons";
                                $scope.AllSelectionObj.AllVisitReasonsCheck = true;
                                val = val || 0;
                                if (val == 1) {
                                    $scope.SearchAppointmentList();
                                }
                            }
                        }
                    });
                }

                $scope.CheckAllFacilityType = function (val) {
                    if (val) {
                        angular.forEach($scope.OrganizationFacilityList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.FacilityTypeObj.SelectStatusString = 'All';
                    }
                    else {
                        angular.forEach($scope.OrganizationFacilityList, function (item) {
                            item.IsChecked = false;
                        });

                        $scope.FacilityTypeObj.SelectStatusString = 'Select Status';
                    }

                };
                $scope.FacilityTypeToggle = function () {
                    var checkedArray = _.where($scope.OrganizationFacilityList, { IsChecked: true });
                    $scope.FacilityTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.OrganizationFacilityList.length === checkedArray.length ? true : false;
                    if ($scope.FacilityTypeObj.AllStatusCheck) {
                        $scope.FacilityTypeObj.SelectStatusString = 'All';
                    }

                    if (!$scope.FacilityTypeObj.AllStatusCheck && checkedArray.length > 0) {
                        $scope.FacilityTypeObj.SelectStatusString = 'Selected';
                    }
                };

                $scope.SearchAppointmentList = function (obj) {

                    var Locationids = $scope.AllHospitalData.AllBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");

                    var DoctorIds = $scope.AllHospitalData.AllDoctorsList
                        .filter(pitem => pitem.isChecked)
                        .map(pitem => pitem.DoctorID)
                        .join(",");

                    var VisitReasonIds = $scope.AllVisitReasonsList
                        .filter(pitem => pitem.isChecked)
                        .map(pitem => pitem.ParentAppointmentVisitReasonId)
                        .join(",");

                    var SignStatusIds = $scope.AllApptSignStatusList
                        .filter(pitem => pitem.isChecked)
                        .map(pitem => pitem.SignStatus === 'No Visit Note' ? 'NoVisitNote' : pitem.SignStatus)
                        .join(",");

                    var param = {
                        "AppoitmentDate": "",
                        "FromDate": $scope.Appointment.FromDate,
                        "ToDate": $scope.Appointment.ToDate,
                        "HospitalId": null,
                        "DoctorId": DoctorIds || 0,
                        "GetAllDoctorIndictor": 0,
                        "AppointmentTypeId": $scope.AppointmentType.TypeId || 0,
                        "PatientId": $scope.PatientSearchObj.PatientId || 0,
                        "OrganizationFacilityId": 0,
                        "VisitReasonId": VisitReasonIds || 0,
                        "SearchText": "",
                        "PatientMRNo": "",
                        "PatientDOB": "",
                        "PageSize": $scope.Pagination.Patientitemsperpage,
                        "PageNo": $scope.PageNumber,
                        "FacilityListIds": "",
                        "LocationIds": Locationids || 0,
                        "SignStatus": SignStatusIds
                    };

                    if (param.DoctorId == 0) {
                        param.GetAllDoctorIndictor = 1;
                    } else {
                        param.GetAllDoctorIndictor = 0;
                    }

                    eHnoteMainAppointmentService.GetAllOPandOTAppointmentList(param).then(function (respose) {
                        console.log(respose);
                        if (respose.data.status == "Success") {
                            $scope.OPandOTAppointmentListCount = respose.data.count;
                            $scope.OPandOTAppointmentList = respose.data.rows;

                            angular.forEach($scope.OPandOTAppointmentList, function (item) {
                                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Patient.MobileNo);
                                item.Patient.MobileNo = obj.UsFormatMobileNumber;
                                item.IsVisitAvailable = false;
                                item.AppSign = item.AppSign || "";
                                item.VisitReason = item.VisitReason || "";
                                item.filterVisitArray = [];
                                item.VisitArray = item.VisitArray || [];
                                if (item.VisitArray.length > 0) {
                                    let filterlist = $filter("filter")(item.VisitArray, { "SuperbillId": 0 }, true) || [];
                                    if (filterlist.length > 0) {
                                        item.IsVisitAvailable = true;
                                    }
                                    item.filterVisitArray = item.VisitArray;
                                }
                            });

                            obj = obj || "";
                            if (obj != "") {
                                if (obj.Type == "Addnewvisit") {
                                    let templist = $filter("filter")($scope.OPandOTAppointmentList, { "AppointmentId": obj.AppointmentId }, true) || [];
                                    if (templist.length > 0) {
                                        let visitlist = $filter("filter")(templist[0].VisitArray, { "SuperbillId": 0 }, true) || [];

                                        let obj = {
                                            //"Type": "encounter",
                                            "Type": "navtoclaim",
                                            "item": templist[0],
                                            "VisitItem": visitlist[0],
                                            "FromDate": $scope.Appointment.FromDate,
                                            "ToDate": $scope.Appointment.ToDate
                                        }
                                        $uibModalInstance.close(obj);
                                    }
                                }
                            }
                        }

                    }, function (error) {
                        console.log(error);
                    });

                };

                var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
                InitializeBranches(NewBranchList, "PageLoad");

                function InitializeBranches(data, pagetype) {
                    var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, $scope.doctorinfo) || [];
                    $scope.BranchesListArray = clinicAddress;
                    $scope.AppListdoctoraddress = clinicAddress;
                    $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

                    var RoleID = $scope.userLoginDetails.RoleID;

                    $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
                        return item.BranchId === $scope.doctorinfo.doctordata.UserAddress[0].ClinicId;
                    });

                    $scope.selectedBranch = $scope.defaultbranch[0];
                    $scope.AppListselectedclinic = $scope.defaultbranch[0];
                    if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                        angular.forEach($scope.AppListdoctoraddress, function (item, index) {
                            if (item.ClinicName !== "All Locations") {
                                if (item.ClinicId === $scope.hospid) {
                                    $scope.selectedBranch = item;
                                    $scope.AppListselectedclinic = item;
                                    eHnoteMasterDataService.addSelectedHospitalinAppList(item);
                                }
                            }
                        });
                    }
                    if ($scope.selectedBranch.BranchId === 0) {
                        if ($scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                            $scope.selectedBranch.SubOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                            $scope.AppListselectedclinic.SubOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                        }
                    }
                }


                $scope.clearAppointmentList = function () {
                    $scope.ShowPatientDetailsDrop = false;
                    $scope.PatientSearchObj = getSelectedPatientObj();
                    $scope.Appointment.Date = "";
                    $scope.Appointment.SelectedHospitalId = 0;
                    $scope.Appointment.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
                    $scope.Appointment.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
                    $scope.AppointmentType.TypeId = "";
                    $scope.AppointmentType.VisitTypeId = "";
                    $scope.SelectedSignStatus = "All";
                    $scope.AllApptSignStatusList = angular.copy($scope.GetAllApptSignStatusList());
                    $scope.AppointmentType.SignStatus = "";
                    $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
                    var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                    if (Index > -1) {
                        $scope.selectedDoctor = $scope.clinicDoctorList[Index];
                    } else {
                        $scope.selectedDoctor = $scope.clinicDoctorList[0];
                        if ($scope.selectedDoctor.DoctorID == 0) {
                            $scope.DoctorId = 0;
                        }
                    }
                    $scope.PageNumber = 1;
                    $scope.PageSize = 10;
                    $scope.PatientSearchObj.SearchTypeId = 2;
                    $scope.AllSelectionObj.AllApptSignStatus = true;
                    $scope.AppListselectedclinic = $scope.AllHospitalData.AllBranchesList[0];
                    if ($scope.AllHospitalData.AllBranchesList.length > 0) {
                        $scope.AllHospitalData.AllBranchesList[0].IsChecked = true;
                        $scope.CheckAllBranches($scope.AllHospitalData.AllBranchesList[0], 1);
                    }
                }


                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                $scope.clinicDoctorList.unshift(docAll);

                var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                if (Index > -1) {
                    $scope.selectedDoctor = $scope.clinicDoctorList[Index];
                    //if ($scope.selectedDoctor != "") {
                    //    $scope.selectedDoctor.FullName = "All Doctors";
                    //}
                    //$scope.SelectedProvider = $scope.clinicDoctorList[Index].SecondUserFullName;
                    angular.forEach($scope.AllHospitalData.AllDoctorsList, function (item) {
                        item.isChecked = true;
                        //item.isChecked = (item.DoctorID === $scope.selectedDoctor.DoctorID);
                    });
                } else {
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                    if ($scope.selectedDoctor != "") {
                        $scope.selectedDoctor.FullName = "All Doctors";
                    }
                    if ($scope.selectedDoctor.DoctorID == 0) {
                        $scope.DoctorId = 0;
                    }
                }


                $scope.AppListselectedclinic = $scope.AllHospitalData.AllBranchesList[0];
                if ($scope.AllHospitalData.AllBranchesList.length > 0) {
                    if ($scope.AllHospitalData.AllBranchesList[0].IsChecked == false) {
                        $scope.AllHospitalData.AllBranchesList[0].IsChecked = true;
                        $scope.CheckAllBranches($scope.AllHospitalData.AllBranchesList[0], 1);
                    }
                    else {
                        $scope.SearchAppointmentList();
                    }
                }

                $scope.changeDoctorName = function (item) {
                    if (item != "") {
                        $scope.selectedDoctor = item;
                        $scope.DoctorId = item.DoctorID;
                    }
                }


                $scope.ClickPatientProfile = function (item) {
                    item.PatientDetails = angular.copy(item.Patient);
                    item.PatientDetails.PatientID = item.Patient.PatientId;
                    item.PatientID = item.Patient.PatientId;
                    eHnoteMasterDataService.addPatientDetailsforBarcode(item);
                    eHnoteMasterDataService.addAppointmentInfo(item);
                    $scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;

                    $scope.cacheStorageItem.patientid = item.Patient.PatientId;
                    item.PatientID = item.Patient.PatientId;
                    item.MasterPatientId = item.Patient.MasterPatientId;
                    $scope.cacheStorageItem.PatientID = item.Patient.PatientId;
                    item.Gender = item.Patient.Gender || "";
                    item.PatientGSTNO = item.Patient.GSTNO || "";
                    $scope.cacheStorageItem.PatientName = item.Patient.Fullname;
                    $scope.cacheStorageItem.PatientTypeId = item.Patient.PatientTypeId;
                    $scope.cacheStorageItem.appointmentid = item.AppointmentId;
                    $scope.cacheStorageItem.AppointmentID = item.AppointmentId;
                    $scope.cacheStorageItem.TreatmentPlanId = item.TreatmentPlanId;
                    $scope.cacheStorageItem.AppointmentDoctorID = item.DoctorID;
                    $scope.cacheStorageItem.appointmentStatus = item.AppointmentStatus;
                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);

                    if ($scope.AllHospitalData.AllUsersList != undefined) {
                        $scope.cacheStorageItem.AllDoctorsList = $scope.AllHospitalData.AllUsersList || [];
                    }

                    eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                    datapersistanceFactory.set("BillingToProfile", item);

                    var obj = {
                        'IsComingFrom': 'BillerBilling'
                    }
                    $location.url("/newbiller");
                };

                $scope.ChangeSubcontent = function (row) {
                    $scope.ClickPatientProfile(row);
                };

                $scope.changePatientPage = function (pageNo) {
                    $scope.PageNumber = pageNo || 1;
                    $scope.SearchAppointmentList();
                };

                $scope.SelectAllVisitReasons = function (val) {

                    if (val == true) {
                        angular.forEach($scope.AllVisitReasonsList, function (item) {
                            item.isChecked = true;
                        });

                        $scope.SelectedVisittype = 'All Visit Reasons';
                    } else if (val == false) {
                        angular.forEach($scope.AllVisitReasonsList, function (item) {
                            item.isChecked = false;
                        });

                        $scope.SelectedVisittype = 'Select';
                    } else {

                        var checkedArray = _.where($scope.AllVisitReasonsList, { isChecked: true });
                        var totalItems = $scope.AllVisitReasonsList.length;
                        var checkedCount = checkedArray.length;

                        if (checkedCount === totalItems && totalItems > 0) {
                            $scope.SelectedVisittype = "All Visit Reasons";
                            $scope.AllSelectionObj.AllVisitReasonsCheck = true;
                        } else if (checkedCount > 0 && checkedCount < totalItems) {
                            $scope.SelectedVisittype = "Selected";
                            $scope.AllSelectionObj.AllVisitReasonsCheck = false;
                        } else {
                            $scope.SelectedVisittype = "Select";
                            $scope.AllSelectionObj.AllVisitReasonsCheck = false;
                        }

                        if (checkedCount == 1) {
                            var filterlist = $filter("filter")($scope.AllVisitReasonsList, function (item) { return item.ParentAppointmentVisitReasonId == checkedArray[0].ParentAppointmentVisitReasonId; }) || [];
                            if (filterlist.length > 0) {
                                $scope.SelectedVisittype = filterlist[0].AppointmentVisitReason || "Select";
                            }
                        }
                    };
                }

                $scope.CheckSignStatus = function (val) {
                    if (val == true) {
                        $scope.SelectedSignStatus = "All";
                        angular.forEach($scope.AllApptSignStatusList, function (item) {
                            item.isChecked = true;
                        });
                    } else if (val == false) {
                        $scope.SelectedSignStatus = "Select";
                        angular.forEach($scope.AllApptSignStatusList, function (item) {
                            item.isChecked = false;
                        });
                    } else {
                        var checkedArray = _.where($scope.AllApptSignStatusList, { isChecked: true });
                        var totalItems = $scope.AllApptSignStatusList.length;
                        var checkedCount = checkedArray.length;

                        if (checkedCount === totalItems && totalItems > 0) {
                            $scope.SelectedSignStatus = "All";
                            $scope.AllSelectionObj.AllApptSignStatus = true;
                        } else if (checkedCount > 0 && checkedCount < totalItems) {
                            $scope.SelectedSignStatus = "Selected";
                            $scope.AllSelectionObj.AllApptSignStatus = false;
                        } else {
                            $scope.SelectedSignStatus = "Select";
                            $scope.AllSelectionObj.AllApptSignStatus = false;
                        }
                    }
                };


                $scope.checkAllProviders = function (val) {
                    if (val == true) {
                        angular.forEach($scope.AllHospitalData.AllDoctorsList, function (item) {
                            item.isChecked = true;
                        });

                        $scope.SelectedProvider = 'All Doctors';
                    } else if (val == false) {
                        angular.forEach($scope.AllHospitalData.AllDoctorsList, function (item) {
                            item.isChecked = false;
                        });

                        $scope.SelectedProvider = 'Select';
                    } else {

                        var checkedArray = _.where($scope.AllHospitalData.AllDoctorsList, { isChecked: true });
                        var totalItems = $scope.AllHospitalData.AllDoctorsList.length;
                        var checkedCount = checkedArray.length;

                        if (checkedCount === totalItems && totalItems > 0) {
                            $scope.SelectedProvider = "All Doctors";
                            $scope.AllSelectionObj.AllDoctorCheck = true;
                        } else if (checkedCount > 0 && checkedCount < totalItems) {
                            $scope.SelectedProvider = "Selected";
                            $scope.AllSelectionObj.AllDoctorCheck = false;
                        } else {
                            $scope.SelectedProvider = "Select";
                            $scope.AllSelectionObj.AllDoctorCheck = false;
                        }

                        if (checkedCount == 1) {
                            var filterlist = $filter("filter")($scope.AllHospitalData.AllDoctorsList, function (item) { return item.DoctorID == checkedArray[0].DoctorID; }) || [];
                            if (filterlist.length > 0) {
                                $scope.SelectedProvider = filterlist[0].SecondUserFullName || "Select";
                            }
                        }
                    }

                };

                $scope.stopClosingDropDown = function ($event) {
                    $event.stopPropagation();
                };


                $scope.openItem = function (item) {
                    const isCurrentlyOpen = item.isOpen;
                    $scope.OPandOTAppointmentList.forEach(subItem => {
                        subItem.isOpen = false;
                    });
                    item.isOpen = !isCurrentlyOpen;
                };
            }
        });
        $scope.encountermodelInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if ($scope.organizationSuperBillList.length == 0 && resp === "cancel") {
                /* $scope.clearCLaimEncounters();*/
            }
            if (resp != "cancel") {
                $scope.navtoEditSuperBillClaim(resp);
            }
            $scope.selectedEncounterslist = eHnoteMasterDataService.getSelectedEncountersList() || '';
            if ($scope.selectedEncounterslist != '') {
                $scope.searchClaimEncounterReqObj.FromDate = $scope.selectedEncounterslist.FromDate || null;
                $scope.searchClaimEncounterReqObj.ToDate = $scope.selectedEncounterslist.ToDate || null;
                $scope.showifnotCurrentDate = false;
                var CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");
                if (CurrentDate !== $scope.searchClaimEncounterReqObj.FromDate) {
                    $scope.showifnotCurrentDate = true;
                }
                $scope.selectedEncounterslist.SelectedBranchesList = $scope.selectedEncounterslist.SelectedBranchesList || '';
                //if ($scope.mainBillerDataObj.AllBranchesList.length > 0 && $scope.selectedEncounterslist.SelectedBranchesList != '') {
                //    angular.forEach($scope.mainBillerDataObj.AllBranchesList, function (Aitem) {
                //        Aitem.IsChecked = false;
                //    });

                //    var selectedClinicIds = $scope.selectedEncounterslist.SelectedBranchesList.split(",");
                //    $scope.mainBillerDataObj.AllBranchesList.forEach(pitem => {
                //        pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                //    });

                //    var checkedArray = _.where($scope.mainBillerDataObj.AllBranchesList, { IsChecked: true });
                //    var AllLocationIND = checkedArray.length > 0 && $scope.mainBillerDataObj.AllBranchesList.length === checkedArray.length ? true : false;
                //    if (AllLocationIND) {
                //        $scope.LocationTypeObj.SelectLocationString = "All Locations";
                //    } else if (checkedArray.length == 1) {
                //        $scope.LocationTypeObj.SelectLocationString = checkedArray[0].ClinicName || "Select";
                //    } else {
                //        $scope.LocationTypeObj.SelectLocationString = "Selected";
                //    }
                //}

                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0 && $scope.selectedEncounterslist.SelectedDoctorsList != '') {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedDrIds = $scope.selectedEncounterslist.SelectedDoctorsList.split(",");
                    $scope.mainBillerDataObj.AllDoctorsList.forEach(pitem => {
                        pitem.isChecked = selectedDrIds.includes(pitem.DoctorID.toString());
                    });

                    var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
                    $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedDoctor = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                        } else {
                            $scope.selectedDoctor = "Selected";
                        }
                    }
                }

                if ($scope.AllVisitReasons.length > 0 && $scope.selectedEncounterslist.Visitreasons != '') {
                    angular.forEach($scope.AllVisitReasons, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedVrIds = $scope.selectedEncounterslist.Visitreasons.split(",");
                    $scope.AllVisitReasons.forEach(pitem => {
                        pitem.isChecked = selectedVrIds.includes(pitem.ParentAppointmentVisitReasonId.toString());
                    });

                    var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
                    $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;
                    if ($scope.AllSelectionObj.AllVisitReasonsCheck) {
                        $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
                    } else {
                        $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
                    }
                }

                $scope.selectedEncounterslist.BillingEncounterStatus = $scope.selectedEncounterslist.BillingEncounterStatus || '';
                if ($scope.BillingEncounterStatus.length > 0 && $scope.selectedEncounterslist.BillingEncounterStatus != '') {
                    angular.forEach($scope.BillingEncounterStatus, function (Aitem) {
                        Aitem.isChecked = false;
                    });

                    var selectedEncounterIds = $scope.selectedEncounterslist.BillingEncounterStatus.split(",");
                    $scope.BillingEncounterStatus.forEach(pitem => {
                        pitem.isChecked = selectedEncounterIds.includes(pitem.EncounterStatusId.toString());
                    });


                    var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
                    $scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

                    if (checkedArray.length == 0) {
                        $scope.selectedstatus = "Select";
                    } else {
                        if (checkedArray.length === 1) {
                            $scope.selectedstatus = checkedArray[0].EncounterStatus;
                        } else {
                            $scope.selectedstatus = "Select";
                        }
                    }
                }
            }
        }, function () { });

    }


    $scope.DoctorToggle = function (item) {
        var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
        $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctor = "Select";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDoctor = "Selected";
            }
        }

    };
    $scope.checkAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctor = 'All Doctors';
        } else {
            angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                item.isChecked = false;
            });

            $scope.selectedDoctor = 'Select';
        }
        var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { isChecked: true });
        $scope.AllSelectionObj.AllDoctorCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

    };


    $scope.checkAllVisitReasons = function (val) {
        if (val) {
            angular.forEach($scope.AllVisitReasons, function (item) {
                item.isChecked = true;
            });
            $scope.selectedVisitReason.Selectedtype = 'All Visit Reasons';
        } else {
            angular.forEach($scope.AllVisitReasons, function (item) {
                item.isChecked = false;
            });
            $scope.selectedVisitReason.Selectedtype = 'Select Visit Reasons';
        }

    };

    $scope.VisitRsnToggle = function (item) {
        var checkedArray = _.where($scope.AllVisitReasons, { isChecked: true });
        $scope.AllSelectionObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.AllVisitReasons.length === checkedArray.length ? true : false;

    };

    $scope.CheckAllStatus = function (val) {
        if (val) {
            angular.forEach($scope.BillingEncounterStatus, function (item) {
                item.isChecked = true;
            });

            $scope.selectedstatus = 'All';
        } else {
            angular.forEach($scope.BillingEncounterStatus, function (item) {
                item.isChecked = false;
            });
            $scope.selectedstatus = "Select";
        }
    }

    $scope.CheckStatus = function (val) {
        var checkedArray = _.where($scope.BillingEncounterStatus, { isChecked: true });
        $scope.AllSelectionObj.AllBillingStatusCheck = checkedArray.length > 0 && $scope.BillingEncounterStatus.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedstatus = "Select";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedstatus = checkedArray[0].EncounterStatus;
            } else {
                $scope.selectedstatus = "Select";
            }
        }
    };

    $scope.CheckSuperBillStatus = function (val) {
        if (val == true) {
            angular.forEach($scope.SuperBillStatusList, function (item) {
                item.isChecked = true;
            });
            $scope.SelectedSuperBillStatus = 'All';
        } else if (val == false) {
            angular.forEach($scope.SuperBillStatusList, function (item) {
                item.isChecked = false;
            });
            $scope.SelectedSuperBillStatus = 'Select';
        } else {
            var checkedArray = _.where($scope.SuperBillStatusList, { isChecked: true });
            var totalItems = $scope.SuperBillStatusList.length;
            var checkedCount = checkedArray.length;

            if (checkedCount === totalItems && totalItems > 0) {
                $scope.SelectedSuperBillStatus = "All";
                $scope.AllSelectionObj.SuperBillStatusCheck = true;
            } else if (checkedCount > 0 && checkedCount < totalItems) {
                $scope.SelectedSuperBillStatus = "Selected";
                $scope.AllSelectionObj.SuperBillStatusCheck = false;
            } else {
                $scope.SelectedSuperBillStatus = "Select";
                $scope.AllSelectionObj.SuperBillStatusCheck = false;
            }

            if (checkedCount == 1) {
                var filterlist = $filter("filter")($scope.SuperBillStatusList, function (item) { return item.SuperBillStatusId == checkedArray[0].SuperBillStatusId; }) || [];
                if (filterlist.length > 0) {
                    $scope.SelectedSuperBillStatus = filterlist[0].SuperBillStatus || "Select";
                }
            }
        };
    }
    $scope.openPanel = function (item) {
        $scope.isOpenEncounterList = item;
    };

    $scope.closePanel = function () {
        $scope.isOpenEncounterList = false;
    };
    $scope.encountersFilterPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "Encountersfilterpopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "right-to-left-modal offcanves-right modal__width--30",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

            }
        });
    };

    // Encounter Count Base Filters


    $scope.searchEncounters = function (pageno) {
        $scope.searchClaimEncounterReqObj.PageNumber = pageno || 1;

        var Locationids = $scope.mainBillerDataObj.AllBranchesList
            .filter(p => p.IsChecked && p.ClinicId !== 0)
            .map(p => p.ClinicId)
            .join(",");

        var DoctorIds = $scope.mainBillerDataObj.AllDoctorsList
            .filter(p => p.isChecked)
            .map(p => p.DoctorID)
            .join(",");

        var VisitReasonIds = $scope.AllVisitReasons
            .filter(p => p.isChecked)
            .map(p => p.ParentAppointmentVisitReasonId)
            .join(",");


        var cacheobj = {
            "FromDate": $scope.searchClaimEncounterReqObj.FromDate,
            "ToDate": $scope.searchClaimEncounterReqObj.ToDate,
            "SelectedBranchesList": Locationids || '',
            "SelectedDoctorsList": DoctorIds || '',
            "Visitreasons": VisitReasonIds || '',
            "BillingEncounterStatus": $scope.selectedEncounterStatusIds || '',
        };

        eHnoteMasterDataService.addSelectedEncountersList(cacheobj);

        var params = {
            OrganizationId: $scope.HospitalId,
            OrganizationFacilityId: $scope.searchClaimEncounterReqObj.OrganizationFacilityId || 0,
            PageSize: 50,
            PageNumber: $scope.searchClaimEncounterReqObj.PageNumber,
            FromDate: $filter("usdateFormatter")($scope.searchClaimEncounterReqObj.FromDate, "-"),
            ToDate: $filter("usdateFormatter")($scope.searchClaimEncounterReqObj.ToDate, "-"),
            PatientId: $scope.searchClaimEncounterReqObj.PatientId || 0,
            PatientMrNo: $scope.searchClaimEncounterReqObj.PatientMrNo || "",
            SearchText: $scope.searchClaimEncounterReqObj.SearchText || "",
            Locationids: Locationids || '',
            DoctorId: DoctorIds || '',
            VisitReasonId: VisitReasonIds || '',
            EncounterStatusId: $scope.selectedEncounterStatusIds || ''
        };

        eHnotePatientDataService.GetOrganizationSuperBills(params)
            .then(function (resp) {
                $scope.organizationSuperBillList = resp.data.rows || [];

                if ($scope.organizationSuperBillList.length > 0) {
                    angular.forEach($scope.organizationSuperBillList, function (item) {
                        item.ResponcibilityId = 0;
                        item.IsResponsibilitySame = false;
                        if (item.SuperBillArray.length > 0) {
                            var firstResponsibilityId = item.SuperBillArray[0].ResponcibilityId || null;
                            var isSame = item.SuperBillArray.every(sitem => sitem.ResponcibilityId === firstResponsibilityId);
                            item.IsResponsibilitySame = isSame;
                            if (item.IsResponsibilitySame) {
                                item.ResponcibilityId = firstResponsibilityId;
                            }

                            var TemppatientClaimno = $filter("filter")(item.SuperBillArray, function (subItem) {
                                return subItem.PatientClaimNumber !== null && subItem.PatientClaimNumber !== 0;
                            });

                            var claimsArray = _.map(TemppatientClaimno, function (subItem) {
                                return {
                                    PatientClaimId: subItem.PatientClaimId,
                                    PatientClaimNumber: subItem.PatientClaimNumber
                                };
                            });
                            item.uniqueClaimsArray = [];
                            item.uniqueClaimsArray = _.uniq(claimsArray, "PatientClaimNumber");

                            var uniqueClaims = _.uniq(_.map(TemppatientClaimno, "PatientClaimNumber").filter(x => x !== null && x !== undefined && x !== ""));
                            item.PatientClaimNumber = uniqueClaims.length > 1 ? uniqueClaims.join(",") : (uniqueClaims[0] || "");
                        }
                    });
                }

                $scope.searchClaimEncounterReqObj.Count = resp.data.count;
                $scope.searchClaimEncounterReqObj.PageNumber = pageno;
                $scope.GetSuperBillEncounterStatusCount($scope.selectedEncounterStatusIds, pageno);
            }, function (err) {
                console.log(err);
            });
    };



    $scope.GetSuperBillEncounterStatusCount = function (Id, pageno) {

        if (Id) {
            $scope.selectedEncounterStatusIds = Id;
        } else {
            $scope.selectedEncounterStatusIds = $scope.selectedEncounterStatusIds || "";
        }

        var Locationids = $scope.mainBillerDataObj.AllBranchesList
            .filter(p => p.IsChecked && p.ClinicId !== 0)
            .map(p => p.ClinicId)
            .join(",");

        var DoctorIds = $scope.mainBillerDataObj.AllDoctorsList
            .filter(p => p.isChecked)
            .map(p => p.DoctorID)
            .join(",");

        var VisitReasonIds = $scope.AllVisitReasons
            .filter(p => p.isChecked)
            .map(p => p.ParentAppointmentVisitReasonId)
            .join(",");


        var cacheobj = {
            "FromDate": $scope.searchClaimEncounterReqObj.FromDate,
            "ToDate": $scope.searchClaimEncounterReqObj.ToDate,
            "SelectedBranchesList": Locationids || '',
            "SelectedDoctorsList": DoctorIds || '',
            "Visitreasons": VisitReasonIds || '',
            "BillingEncounterStatus": $scope.selectedEncounterStatusIds || '',
        };

        eHnoteMasterDataService.addSelectedEncountersList(cacheobj);

        var params = {
            OrganizationId: $scope.HospitalId,
            OrganizationFacilityId: $scope.searchClaimEncounterReqObj.OrganizationFacilityId || 0,
            PageSize: $scope.searchClaimEncounterReqObj.PageSize,
            PageNumber: pageno,
            FromDate: $filter("usdateFormatter")($scope.searchClaimEncounterReqObj.FromDate, "-"),
            ToDate: $filter("usdateFormatter")($scope.searchClaimEncounterReqObj.ToDate, "-"),
            PatientId: $scope.searchClaimEncounterReqObj.PatientId || 0,
            PatientMrNo: $scope.searchClaimEncounterReqObj.PatientMrNo || "",
            SearchText: $scope.searchClaimEncounterReqObj.SearchText || "",
            Locationids: Locationids || '',
            DoctorId: DoctorIds || '',
            VisitReasonId: VisitReasonIds || '',
            EncounterStatusId: $scope.selectedEncounterStatusIds || ''
        };

        eHnotePatientDataService.GetSuperBillEncounterStatusCount(params)
            .then(function (resp) {
                var rows = (resp && resp.data && resp.data.rows) ? resp.data.rows : [];
                var data = rows[0] || {};

                $scope.SuperBillEncounterStatusCount = rows;



                $scope.encounterCountsById = {
                    1: data.ReadyToBill || 0,
                    2: data.OnHold || 0,
                    3: data.PrimaryInsInactive || 0,
                    4: data.PreAuthPending || 0,
                    5: data.ClaimCreated || 0,
                    6: data.PartiallyClaimCreated || 0,
                    7: data.NotSigned || 0,
                    8: data.NoVisitNote || 0
                };


                $scope.encounterCounts = {
                    All: data.TotalCount || 0,
                    Others: (data.PrimaryInsInactive || 0) + (data.NoVisitNote || 0)
                };


            }, function (err) {
                console.log(err);
            });
    };




    $scope.isOtherTabActive = false;
    $scope.onEncounterTabClick = function (status) {

        angular.forEach($scope.BillingEncounterStatus, function (s) {
            s.isChecked = false;
        });

        if (!status) {

            $scope.activeEncounterTab = 'ALL';
            $scope.selectedEncounterStatusIds = '1,2,3,4,5,6,7,8';
        } else {
            $scope.selectedEncounterStatusIds = status.EncounterStatusId.toString();
            $scope.activeEncounterTab = null;
        }

        $scope.isOtherTabActive = false

        $scope.searchClaimEncounterReqObj.PageNumber = 1;
        $scope.searchEncounters($scope.searchClaimEncounterReqObj.PageNumber);
    };

    $scope.applyOtherStatusFilter = function ($event) {
        $event.stopPropagation();

        var ids = $scope.otherStatuses
            .filter(s => s.isChecked)
            .map(s => s.EncounterStatusId)
            .join(',');

        $scope.selectedEncounterStatusIds = ids || '';
        $scope.searchClaimEncounterReqObj.PageNumber = 1;
        $scope.searchEncounters($scope.searchClaimEncounterReqObj.PageNumber);
        //$scope.searchEncounters();
        $scope.isOtherDropdownOpen = false;
        $scope.isOtherTabActive = true;
    };
    $scope.onOtherTabClick = function ($event) {
        $event.stopPropagation();
        $scope.activeEncounterTab = null;
        $scope.selectedEncounterStatusIds = "";
        $scope.isOtherTabActive = true;
    };

}]);
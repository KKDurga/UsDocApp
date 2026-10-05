"use strict";
eHnoteWebApp.controller("UsGeneratePatientStatementCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "InventoryService", "eHnoteUserDataService", "eHnotePatientDataService", "eHnoteUserAppointmentDataService", "localStorageFactory",
    function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteInsuranceService, eHnoteSettingsDataService, InventoryService, eHnoteUserDataService, eHnotePatientDataService, eHnoteUserAppointmentDataService, localStorageFactory) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };
        $scope.HospitalAddressArray = [];
        if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
        }

        console.log($scope.mainBillerDataObj);

        $scope.OrgBillingProvider = [];
        $scope.OrgBillingProvider = $scope.mainBillerDataObj.BillingProviderList || [];

        $scope.AllHospitalData = [];
        $scope.AllHospitalData = $scope.mainBillerDataObj;
        if ($scope.AllHospitalData.AllDoctorsList.length > 0) {
            $scope.AllHospitalData.AllDoctorsList.forEach(function (item) {
                item.selected = false;
                if ($scope.UserId === item.DoctorID) {
                    item.selected = true;
                }

            });
        }

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        $scope.GetStatementsObj = function () {
            return {
                "PatientId": "",
            };
        };
        $scope.SearchStatementListObj = angular.copy($scope.GetStatementsObj());


        function getSelectedPatientData() {
            var obj = {
                "SearchText": "",
                "PatientId": 0,
                "SearchTypeId": 2
            }
            return obj;
        };
        $scope.PatientSearchdata = getSelectedPatientData();


        $scope.changeSearchType = function (id) {
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.PatientSearchdata.SearchTypeId = id;
            $scope.SearchStatementListObj.PatientId = 0;
            $scope.AllPatientList = [];
            $scope.SearchPatientStatementObj.ClaimNumber = '';
            $scope.ShowPatientListDrop = false;
        }


        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
            $scope.SearchStatementListObj.PatientId = patietnitem.PatientID;
            $scope.PatientSearchdata.SearchText = patietnitem.FullName;
            //$scope.SearchStatementListObj.PatientMrNo = patietnitem.patientdisplayid;
            //if ($scope.PatientSearchdata.SearchTypeId == 2) {
            //    $scope.PatientSearchdata.SearchText = patietnitem.patientdisplayid;
            //} else {
            //    $scope.PatientSearchdata.SearchText = patietnitem.FullName;
            //}
            $scope.AllPatientList = [];
            $scope.SearchPatientStatement();
            $scope.ShowPatientListDrop = false;


        };


        //$scope.LoadPatientSearch = function (val) {


        //    if (val == undefined || val == null || val == "") {
        //        $scope.AllPatientList = [];
        //        $scope.PatientSearchdata.PatientId = 0;
        //        return false;
        //    }

        //    var object = {
        //        "ParentOrganizationId": $scope.ParenthospitalId,
        //        "Name": null,
        //        "Mobile": null,
        //        "PatientId": null,
        //       /* "SearchText": $scope.PatientSearchdata.SearchText,*/
        //        "PageSize": 30,
        //        "PageNo": 1,
        //        "DOB": null
        //    };
        //    if ($scope.PatientSearchdata.SearchTypeId == 1) {
        //        object.Name = val;
        //    } else if ($scope.PatientSearchdata.SearchTypeId == 2) {
        //        var templist = $filter("filter")($scope.GetAllPatientBalanceClaims, { "PatientMrNo": val }, true) || [];
        //        if (templist.length > 0) {
        //            object.PatientId = templist[0].PatientId || null;
        //        }
        //    }
        //    InventoryService.SearchInvPatient(object).then(function (resp) {
        //        if (resp.data.data.length !== 0) {
        //            if (resp.data.data != undefined) {
        //                $scope.AllPatientList = [];
        //                var patientList = resp.data.data || [];
        //                angular.forEach(patientList, function (items) {
        //                    var obj = {
        //                        "FullName": items.fullname,
        //                        "PatientId": items.PatientId,
        //                        "PatientHomeNumber": items.MobileNo,
        //                        "PatientDisPlayID": items.PatientDisplayId,
        //                        "HomeCountryCode": items.HomeCountryCode || "",
        //                        "HomeAreaCode": items.HomeAreaCode || "",
        //                        "HomeNumber": items.HomeNumber || ""
        //                    };
        //                    $scope.AllPatientList.push(obj);
        //                });
        //            }
        //        } else {
        //            $scope.AllPatientList = [];
        //        }
        //    }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        //};

        $scope.LoadPatientSearch = function (val) {


            if (val == undefined || val == null || val == "") {
                $scope.AllPatientList = [];
                $scope.PatientSearchdata.PatientId = 0;
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
                "HospitalIDLst": param.HospitalIDLst.toString(),
                "SearchText": $scope.PatientSearchdata.SearchText || "",
                "SearchTypeID": $scope.PatientSearchdata.SearchTypeId || 0,
            }
            if ($scope.PatientSearchdata.SearchTypeId == 1) {
                object.Name = val;
            } else if ($scope.PatientSearchdata.SearchTypeId == 2) {
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
            if ($scope.PatientSearchdata.SearchText != "") {
                $scope.ShowPatientListDrop = true;
            }
        }
        function OnGetopPatientSearchError() {
            $scope.count = 0;
            $scope.AllPatientList = [];
            $scope.PatientSearchdata.SearchText = "";
        }

        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearchdata.SearchText = "";
            $scope.SearchStatementListObj.PatientId = 0;
            $scope.SearchPatientStatementObj.ClaimNumber = '';
        };

        $scope.PrintPatientsInfo = {
            "BatchName": '',
            "StatementCount": 0,
            "TotalStatementAmount": 0,
        };

        $scope.GetPatientStatementsObj = function () {
            var Obj = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
                "PatientId": 0,
                "ClaimNumber": "",
                "PostingFrom": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PostingTo": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PatientConditionId": 0,
                "PatientAgingDataId": 0,
                "SortBy": "",
                "Count": 0,
                "PatientStatementFormat": "",
                "IsChecked": false,
                "PatientAgingList": "",
            }
            return Obj
        }

        $scope.$on('GetBalanceClaims', function (event) {
            /*   $scope.uibclose();*/
            $scope.SearchPatientStatement();
            //$scope.consultationModulePrint($scope.printAll);
        });
        $scope.SearchPatientStatementObj = angular.copy($scope.GetPatientStatementsObj());

          $scope.PatientStatementSelections = {};
        $scope.SearchPatientStatement = function (pageno, type) {
            var type = (type === undefined || type === '') ? 'All' : type;
            $scope.PatientStatementList = [];
            $scope.PatientStatementListcount = 0;
            var Locationids = '';
            Locationids = $scope.AllUserBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
            if ($scope.MasterPatientAginglist.length > 0) {
                var PatientAgingids = $scope.MasterPatientAginglist
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PatientAgingDataId)
                    .join(",");
            }
            var Frezobj = {
                "PostingFrom": $scope.SearchPatientStatementObj.PostingFrom || null,
                "PostingTo": $scope.SearchPatientStatementObj.PostingTo || null,
                'Locations': Locationids,
                'PatientConditionId': $scope.SearchPatientStatementObj.PatientConditionId || 0,
                'PatientAgingids': PatientAgingids || '',
            };
            eHnoteMasterDataService.addPatientBalancefreezingList(Frezobj);

            $scope.SearchPatientStatementObj.PageNumber = pageno || 1;
            var param = {
                "OrganizationId": $scope.HospitalId,
                "LocationIds": Locationids || '',
                "PageSize": $scope.SearchPatientStatementObj.PageSize,
                "PageNumber": $scope.SearchPatientStatementObj.PageNumber,
                "PatientId": $scope.SearchStatementListObj.PatientId,
                "ClaimNumber": $scope.SearchPatientStatementObj.ClaimNumber,
                "PostingFrom": $scope.SearchPatientStatementObj.PostingFrom,
                "PostingTo": $scope.SearchPatientStatementObj.PostingTo,
                "PatientConditionId": $scope.SearchPatientStatementObj.PatientConditionId,
                /*"PatientAgingList": $scope.SearchPatientStatementObj.PatientAgingList,*/
                "PatientAgingList": PatientAgingids,
                "SortBy": $scope.SearchPatientStatementObj.SortBy,
            }

            eHnoteInsuranceService.GetAllPatientBalanceClaims(param).then(function (resp) {

                console.log(JSON.stringify(resp));

                if (resp.data.rows.length > 0) {
                    $scope.PatientStatementList = resp.data.rows || [];
                    $scope.PatientStatementListcount = resp.data.count || 0;
                    console.log($scope.PatientStatementSelections)
                    $scope.SearchPatientStatementObj.Count = resp.data.count;
                    if ($scope.PatientStatementList.length > 0) {
                        angular.forEach($scope.PatientStatementList, function (item) {
                            item.IsShowDetails = false;
                            item.ProcessStatusId = 2;
                            item.ProcessStatus = "Ready To Send";
                            item.IsChecked = $scope.PatientStatementSelections[item.PatientId]?.IsChecked || false;
                            item.PatientMobile = item.PatientMobile || "";
                            if (item.PatientMobile != "") {
                                var obj = eHnoteUserDataService.UsMobileFormatChange(item.PatientMobile);
                                item.PatientMobile = obj.UsFormatMobileNumber;
                            }
                        });
                    }
                    $scope.PrintPatientsInfo.BatchName = '';
                }



            }, function (err) { console.log(err); });


        }
       
            $scope.togglePatientSelection = function(item) {
                $scope.PatientStatementSelections[item.PatientId] = {
                    IsChecked: item.IsChecked,
                    ProcessStatusId: item.ProcessStatusId,
                    data: item
                };
            };
        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };
        $scope.init = function () {
            $scope.PatientStatementList = [];
            $scope.MasterPatientAgingData = [];
            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "PatientId": null,
                "ClaimNumber": '',
                "PostingFrom": $scope.SearchPatientStatementObj.PostingFrom,
                "PostingTo": $scope.SearchPatientStatementObj.PostingTo,
                "PatientConditionId": null,
                "SortBy": '',
                "PatientAgingList": "1,2,3,4,5",
            }
            $scope.MasterPatientStatementProcessStatus = [];
            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                //eHnoteInsuranceService.GetAllPatientBalanceClaims(param),
                // eHnoteInsuranceService.SendPatientStatementsJob(),
            ]).then(function (resp) {
                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    $scope.PatientBalanceConditions = [];
                    if (resp[0].data.PatientBalanceConditions.length > 0) {
                        $scope.PatientBalanceConditions = resp[0].data.PatientBalanceConditions || [];
                    }
                    if (resp[0].data.MasterPatientStatementProcessStatus.length > 0) {
                        $scope.MasterPatientStatementProcessStatus = resp[0].data.MasterPatientStatementProcessStatus || [];
                    }
                    if (resp[0].data.MasterPatientAgingData.length > 0) {
                        $scope.MasterPatientAgingData = resp[0].data.MasterPatientAgingData || [];
                        $scope.MasterPatientAginglist = resp[0].data.MasterPatientAgingData || [];

                        $scope.MasterPatientAginglist.forEach(function (item) {
                            item.IsChecked = true;
                        });
                        $scope.SearchPatientStatementObj.PatientAgingList = $scope.MasterPatientAgingData.map(function (status) {
                            return status.PatientAgingDataId;
                        }).join(',');
                    }

                    if (resp[0].data.MasterPriority.length > 0) {
                        $scope.MasterPriority = resp[0].data.MasterPriority || [];
                    }
                    if (resp[0].data.MasterAlertTypes.length > 0) {
                        $scope.MasterAlertTypes = resp[0].data.MasterAlertTypes || [];
                        angular.forEach($scope.MasterAlertTypes, function (item) {
                            item.IsChecked = false;
                        });

                    }
                    if (resp[0].data.MasterAlertTag.length > 0) {
                        $scope.MasterAlertTag = resp[0].data.MasterAlertTag || [];
                    }
                    if (resp[0].data.MasterAlertNoteType.length > 0) {
                        /*$scope.MasterAlertNoteType = resp[0].data.MasterAlertNoteType || [];*/
                        $scope.MasterAlertNoteType = $filter("filter")(resp[0].data.MasterAlertNoteType, function (item) {
                            return item.AlertNoteTypeId !== 6;
                        }) || [];
                    }

                }

                //if (resp[1].data.rows.length > 0) {
                //    $scope.SearchPatientStatementObj.Count = resp[1].data.count;
                //    $scope.PatientStatementList = resp[1].data.rows || [];
                //    if ($scope.PatientStatementList.length > 0) {
                //        angular.forEach($scope.PatientStatementList, function (item) {
                //            item.IsShowDetails = false;
                //            item.ProcessStatusId = 1;
                //            item.ProcessStatus = "Send";

                //        });
                //    }

                //}

                function InitializeNewBranches(data) {
                    $scope.AllUserBranchesList = [];
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
                        $scope.AllUserBranchesList = BrachesList;
                        $scope.BranchesListArray = BrachesList;
                        $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                        });

                        $scope.selectedBranch = $scope.defaultbranch[0];
                        $scope.HospitalObj = $scope.defaultbranch[0];
                        angular.forEach($scope.AllUserBranchesList, function (item) {
                            item.IsChecked = true;

                        });

                        if ($scope.RoleId === 2 || $scope.RoleId === 10 || $scope.RoleId === 11 || $scope.RoleId === 58) {
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
                }

                var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
                InitializeNewBranches(NewBranchList);

                $scope.selectedPatientBalanceList = eHnoteMasterDataService.getPatientBalancefreezingList();
                if ($scope.selectedPatientBalanceList != '') {
                    $scope.SearchPatientStatementObj.PostingFrom = $scope.selectedPatientBalanceList.PostingFrom || null;
                    $scope.SearchPatientStatementObj.PostingTo = $scope.selectedPatientBalanceList.PostingTo || null;
                    $scope.SearchPatientStatementObj.PatientConditionId = $scope.selectedPatientBalanceList.PatientConditionId || 0;

                    $scope.selectedPatientBalanceList.Locations = $scope.selectedPatientBalanceList.Locations || '';
                    if ($scope.AllUserBranchesList.length > 0 && $scope.selectedPatientBalanceList.Locations != '') {
                        angular.forEach($scope.AllUserBranchesList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedLocationIds = $scope.selectedPatientBalanceList.Locations.split(",");

                        $scope.AllUserBranchesList.forEach(pitem => {
                            pitem.IsChecked = selectedLocationIds.includes(pitem.ClinicId.toString());
                        });
                    }

                    $scope.selectedPatientBalanceList.PatientAgingids = $scope.selectedPatientBalanceList.PatientAgingids || '';
                    $scope.MasterPatientAginglist = $scope.MasterPatientAginglist || [];
                    if ($scope.MasterPatientAginglist.length > 0 && $scope.selectedPatientBalanceList.PatientAgingids != '') {
                        angular.forEach($scope.MasterPatientAginglist, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedAgingids = $scope.selectedPatientBalanceList.PatientAgingids.split(",");

                        $scope.MasterPatientAginglist.forEach(pitem => {
                            pitem.IsChecked = selectedAgingids.includes(pitem.PatientAgingDataId.toString());
                        });
                    }
                }

                $scope.SearchPatientStatement();
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });

        }

        $scope.init();


        $scope.ChangeApptBranch = function (item, typeId) {
            $scope.AppListselectedclinic = item || {};
            if (item.IsChecked) {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.AllUserBranchesList, function (mitem) {
                        mitem.IsChecked = true;
                    });
                }
            } else {
                if (item.ClinicId === 0) {
                    angular.forEach($scope.AllUserBranchesList, function (mitem) {
                        mitem.IsChecked = false;
                    });
                }
            }

            var checkedArray = _.where($scope.AllUserBranchesList, { IsChecked: true });
            var checkedCount = checkedArray.length;
            var totalBranches = $scope.AllUserBranchesList.length;

            if (checkedCount === totalBranches) {
                $scope.LocationTypeObj.SelectLocationString = "All Locations";
            } else if (checkedCount > 0) {
                $scope.LocationTypeObj.SelectLocationString = "Selected";
            } else {
                $scope.LocationTypeObj.SelectLocationString = "Select";
            }

            if (checkedCount == 1) {
                var filterlist = $filter("filter")($scope.AllUserBranchesList, function (item) {
                    return item.ClinicId == checkedArray[0].ClinicId;
                }) || [];
                if (filterlist.length > 0) {
                    $scope.LocationTypeObj.SelectLocationString = filterlist[0].ClinicName || "Select";
                }
            }

        }

        $scope.RefreshPatientstatement = function () {
            $scope.SearchPatientStatementObj = angular.copy($scope.GetPatientStatementsObj());
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.SearchStatementListObj = angular.copy($scope.GetStatementsObj());
            $scope.ShowPatientListDrop = false;

            if ($scope.AllUserBranchesList.length > 0) {
                angular.forEach($scope.AllUserBranchesList, function (mitem) {
                    mitem.IsChecked = true;
                });
            }
            if ($scope.MasterPatientAginglist.length > 0) {
                $scope.PatientAgingObj.AllStatusCheck = true;
                angular.forEach($scope.MasterPatientAginglist, function (mitem) {
                    mitem.IsChecked = true;
                });
            }
            $scope.PatientStatementSelections = {};
            $scope.SearchPatientStatement();
        }

        $scope.GetPatientStatementInfo = function () {
            var Obj = {
                "PatientClaimId": 0,
                "DOSFrom": "",
                "ClaimDate": "",
                "PatientId": "",
                "PatientFirstName": "",
                "PatientLastName": "",
                "PatientMrNo": "",
                "PatientClaimNumber": "",
                "TotalClaimAmount": "",
                "TotalPatientBalance": "",
                "TotalInsuranceBalance": "",
                "TotalBalance": "",
                "TotalInsurancePayment": "",
                "PrimaryInsuranceId": "",
                "PrimaryInsurancePayorName": "",
                "SecondaryInsuranceId": "",
                "SecondaryInsurancePayorName": "",
                "TotalDeductibleAmount": "",
                "TotalCoInsuranceAmount": "",
                "TotalCopayAmount": "",
                "TotalUnAppliedAmount": 0,
                "PatientAddressLine1": '',
                "PatientAddressLine2": '',
                "PatientCityName": '',
                "PatientStateName": '',
                "PatientCountryName": '',
                "PatientPinCode": '',
                "PatientHouseNo": '',
                "Address1": '',
                "Address2": '',
                "ClinicName": '',
                "ContactNo": '',
                "PinCode": '',
                "CityName": '',
                "StateName": '',
                "CountryName": '',
                "TotalPatientPayment": '',
                "TotalPatientAmount": '',
                "TotalPatientPaymentAmount": '',
                "BillingProviderName": '',
                "PostalAddress1": '',
                "PostalAddress2": '',
                "PostalCityName": '',
                "PostalStateName": '',
                "PostalZipCode": '',

            }
            return Obj;
        }

        $scope.PrintPatientInfo = angular.copy($scope.GetPatientStatementInfo());

        $scope.PrintPatientSatementData = function (item) {
            $scope.HospitalAddressArray = $scope.HospitalAddressArray || [];
            item = item || null;
            $scope.PatientClaimLineItemsArray = [];
            $scope.PatientClaimLineItemsArray = item.ClaimLineItems;
            item.TotalPatientPaymentAmount = 0;
            item.OrgBillingProviderListData = {};
            if ($scope.PatientClaimLineItemsArray.length > 0) {
                angular.forEach($scope.PatientClaimLineItemsArray, function (pitem) {
                    pitem.PatientandInsPaymentAmount = 0;
                    pitem.PatientandInsPaymentAmount = parseInt(pitem.PatientPaymentAmount) + parseInt(pitem.InsurancePaymentAmount) || 0;

                    pitem.TotalPatientClaimsAmount = 0;

                    angular.forEach(pitem.ClaimLineItemTransactions, function (mitem) {
                        if (mitem.TransactionTypeId === 24 || mitem.TransactionTypeId === 25 || mitem.TransactionTypeId === 26 || mitem.TransactionTypeId === 27 || mitem.TransactionTypeId === 32 || mitem.TransactionTypeId === 36 || mitem.TransactionTypeId === 40 || mitem.TransactionTypeId === 98 || mitem.TransactionTypeId === 99 || mitem.TransactionTypeId === 100) {
                            pitem.TotalPatientClaimsAmount += -(mitem.TransactionAmount) || 0;
                        }
                    });
                    item.TotalPatientPaymentAmount += pitem.TotalPatientClaimsAmount || 0;

                    item.OrgBillingProviderListData = $filter("filter")($scope.OrgBillingProvider, { OrganizationBillingProviderId: pitem.BillingProviderId })[0] || {};

                })

            }
            $scope.PatientBlanceSummary = [];
            $scope.PatientBlanceSummary = item.PatientBlanceSummary || [];
            $scope.PrintPatientInfo.TotalPatientPaymentAmount = item.TotalPatientPaymentAmount;
            $scope.PrintPatientInfo.PatientClaimId = item.PatientClaimId;
            $scope.PrintPatientInfo.DOSFrom = item.DOSFrom;
            $scope.PrintPatientInfo.ClaimDate = item.ClaimDate;
            $scope.PrintPatientInfo.PatientId = item.PatientId;
            $scope.PrintPatientInfo.PatientFirstName = item.PatientFirstName;
            $scope.PrintPatientInfo.PatientLastName = item.PatientLastName;
            $scope.PrintPatientInfo.PatientMrNo = item.PatientMrNo;
            $scope.PrintPatientInfo.PatientClaimNumber = item.PatientClaimNumber;
            $scope.PrintPatientInfo.TotalClaimAmount = item.TotalClaimAmount;
            $scope.PrintPatientInfo.TotalPatientBalance = item.TotalPatientBalance;
            $scope.PrintPatientInfo.TotalInsuranceBalance = item.TotalInsuranceBalance;
            $scope.PrintPatientInfo.TotalBalance = item.TotalBalance;
            $scope.PrintPatientInfo.TotalInsurancePayment = item.TotalInsurancePayment;
            $scope.PrintPatientInfo.TotalPatientPayment = item.TotalPatientPayment;
            $scope.PrintPatientInfo.PrimaryInsuranceId = item.PrimaryInsuranceId;
            $scope.PrintPatientInfo.PrimaryInsurancePayorName = item.PrimaryInsurancePayorName;
            $scope.PrintPatientInfo.SecondaryInsuranceId = item.SecondaryInsuranceId;
            $scope.PrintPatientInfo.SecondaryInsurancePayorName = item.SecondaryInsurancePayorName;
            $scope.PrintPatientInfo.TotalDeductibleAmount = item.TotalDeductibleAmount;
            $scope.PrintPatientInfo.TotalCoInsuranceAmount = item.TotalCoInsuranceAmount;
            $scope.PrintPatientInfo.TotalCopayAmount = item.TotalCopayAmount;
            $scope.PrintPatientInfo.TotalUnAppliedAmount = item.TotalUnAppliedAmount;
            $scope.PrintPatientInfo.PatientAddressLine1 = item.PatientAddress.AddressLine1;
            $scope.PrintPatientInfo.PatientAddressLine2 = item.PatientAddress.AddressLine2;
            $scope.PrintPatientInfo.PatientCityName = item.PatientAddress.CityName;
            $scope.PrintPatientInfo.PatientStateName = item.PatientAddress.StateName;
            $scope.PrintPatientInfo.PatientCountryName = item.PatientAddress.CountryName;
            $scope.PrintPatientInfo.PatientPinCode = item.PatientAddress.Pin;
            $scope.PrintPatientInfo.PatientHouseNo = item.PatientAddress.HNo;
            $scope.PrintPatientInfo.BillingProviderName = item.OrgBillingProviderListData.BillingProviderName;
            $scope.PrintPatientInfo.PostalAddress1 = item.OrgBillingProviderListData.PostalAddress1;
            $scope.PrintPatientInfo.PostalAddress2 = item.OrgBillingProviderListData.PostalAddress2;
            $scope.PrintPatientInfo.PostalCityName = item.OrgBillingProviderListData.PostalCityName;
            $scope.PrintPatientInfo.PostalStateName = item.OrgBillingProviderListData.PostalStateName;
            $scope.PrintPatientInfo.PostalZipCode = item.OrgBillingProviderListData.PostalZipCode;

            $scope.PrintPatientInfo.Address1 = $scope.HospitalAddressArray.Address1;
            $scope.PrintPatientInfo.Address2 = $scope.HospitalAddressArray.Address2;
            $scope.PrintPatientInfo.ClinicName = $scope.HospitalAddressArray.ClinicName;
            $scope.PrintPatientInfo.ContactNo = $scope.HospitalAddressArray.ContactNo || "";
            $scope.PrintPatientInfo.PinCode = $scope.HospitalAddressArray.PinCode;
            $scope.PrintPatientInfo.CityName = $scope.HospitalAddressArray.CityName;
            $scope.PrintPatientInfo.StateName = $scope.HospitalAddressArray.StateName;
            $scope.PrintPatientInfo.CountryName = $scope.HospitalAddressArray.CountryName;
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PrintPatientInfo.ContactNo);
            $scope.PrintPatientInfo.ContactNo = obj.UsFormatMobileNumber;


            $scope.GetPatientStatementPrint();
        }

        $scope.GetPatientStatementPrint = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PatientSatement_print').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);

        }
        $scope.changeExport = function (type) {
            type = type || "PDF";
            if (type != "PDF") {
                return false;
            }

            var i = 0;
            angular.forEach($scope.PatientStatementList, function (item) {
                if (item.IsChecked === true) {
                    i++;
                }
            });

            if (i === 0) {
                alertify.error("Please select atleast one claim!");
                $scope.SearchPatientStatementObj.PatientStatementFormat = "";
                return false;
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/PrintHTMLPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "offcanves-right",
                "resolve": {
                    "PrintStatementList": function () { return $scope.PatientStatementList; },
                    "HospitalAddressArray": function () { return $scope.HospitalAddressArray; },
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, PrintStatementList, HospitalAddressArray, eHnoteUserDataService, mainBillerDataObj) {

                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
                    $scope.OrgBillingProvider = [];
                    $scope.OrgBillingProvider = mainBillerDataObj.BillingProviderList || [];

                    $scope.GetPatientStatementsInfo = function () {
                        var Obj = {
                            "PatientClaimId": 0,
                            "BatchName": "",
                            "StatementDate": "",
                            "StatementCount": 0,
                            "TotalStatementAmount": 0,
                            "PatientStatementId": 0,
                            "DOSFrom": "",
                            "ClaimDate": "",
                            "PatientId": "",
                            "PatientFirstName": "",
                            "PatientLastName": "",
                            "PatientMrNo": "",
                            "PatientClaimNumber": "",
                            "TotalClaimAmount": "",
                            "TotalPatientBalance": "",
                            "TotalInsuranceBalance": "",
                            "TotalBalance": "",
                            "TotalInsurancePayment": "",
                            "PrimaryInsuranceId": "",
                            "PrimaryInsurancePayorName": "",
                            "SecondaryInsuranceId": "",
                            "SecondaryInsurancePayorName": "",
                            "TotalDeductibleAmount": "",
                            "TotalCoInsuranceAmount": "",
                            "TotalCopayAmount": "",
                            "TotalUnAppliedAmount": 0,
                            "PatientAddressLine1": '',
                            "PatientAddressLine2": '',
                            "PatientCityName": '',
                            "PatientStateName": '',
                            "PatientCountryName": '',
                            "PatientPinCode": '',
                            "PatientHouseNo": '',
                            "Address1": '',
                            "Address2": '',
                            "ClinicName": '',
                            "ContactNo": '',
                            "PinCode": '',
                            "CityName": '',
                            "StateName": '',
                            "CountryName": '',
                            "TotalPatientPayment": '',
                        }
                        return Obj;
                    }

                    $scope.PrintPatientsInfo = angular.copy($scope.GetPatientStatementsInfo());

                    $scope.PrintStatementList = PrintStatementList || [];
                    $scope.PrintPatientStatementList = angular.copy(PrintStatementList);
                    $scope.HospitalAddressDetails = HospitalAddressArray || null;

                    $scope.PrintPatientsInfo.Address1 = $scope.HospitalAddressDetails.Address1;
                    $scope.PrintPatientsInfo.Address2 = $scope.HospitalAddressDetails.Address2;
                    $scope.PrintPatientsInfo.ClinicName = $scope.HospitalAddressDetails.ClinicName;
                    $scope.PrintPatientsInfo.ContactNo = $scope.HospitalAddressDetails.ContactNo || "";
                    $scope.PrintPatientsInfo.PinCode = $scope.HospitalAddressDetails.PinCode;
                    $scope.PrintPatientsInfo.CityName = $scope.HospitalAddressDetails.CityName;
                    $scope.PrintPatientsInfo.StateName = $scope.HospitalAddressDetails.StateName;
                    $scope.PrintPatientsInfo.CountryName = $scope.HospitalAddressDetails.CountryName;
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PrintPatientsInfo.ContactNo);
                    $scope.PrintPatientsInfo.ContactNo = obj.UsFormatMobileNumber;
                    $scope.AddUpdatePatientStatementsDetails = function () {

                        //if ($scope.PrintPatientsInfo.StatementDate === "") {
                        //    alertify.error("Please select the statement export date!");
                        //    return false;
                        //}

                        if ($scope.PrintPatientsInfo.BatchName === "") {
                            alertify.error("Please enter the batch name!");
                            return false;
                        }

                        let ClaimsList = [];

                        var templist = $filter("filter")($scope.PrintStatementList, { "IsChecked": true }, true) || [];

                        if (templist.length > 0) {
                            angular.forEach(templist, function (item) {

                                $scope.PrintPatientsInfo.TotalStatementAmount += item.TotalBalance || 0;

                                if (ClaimsList.length == 0) {
                                    let obj = {
                                        "PatientStatementId": 0,
                                        "PatientId": item.PatientId,
                                        "TotalAmount": item.TotalClaimAmount,
                                        "TotalPatientBalance": item.TotalPatientBalance,
                                        "ClaimLineItems": []
                                        //"TotalInsuranceBalance": item.TotalInsuranceBalance,
                                        //"TotalBalance": item.TotalBalance,
                                        //"TotalPatientPayment": item.TotalPatientPayment,
                                        //"TotalInsurancePayment": item.TotalInsurancePayment,                                      

                                    }

                                    if (item.ClaimLineItems.length > 0) {
                                        angular.forEach(item.ClaimLineItems, function (citem) {
                                            let object = {
                                                "PatientStatementClaimLineItemId": 0,
                                                "ClaimLineItemId": citem.ClaimLineItemId,
                                                "PatientClaimNumber": citem.PatientClaimNumber,
                                                "PatientClaimId": citem.PatientClaimId,
                                                "ServiceId": citem.ServiceId,
                                                "ServiceName": citem.ServiceName,
                                                "ServiceCode": citem.ServiceCode,
                                                "TotalChargeAmount": citem.TotalChargeAmount,
                                                "AllowedAmount": citem.AllowedAmount,
                                                "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                                "CoPaymentAmount": citem.CoPaymentAmount,
                                                "AdjustmentAmount": citem.AdjustmentAmount,
                                                "DeductibleAmount": citem.DeductibleAmount,
                                                "CoInsuranceAmount": citem.CoInsuranceAmount,
                                                "PatientPaymentAmount": citem.PatientPaymentAmount,
                                                "WriteOffAmount": citem.WriteOffAmount,
                                                "InsuranceBalance": citem.InsuranceBalance,
                                                "PatientBalance": citem.PatientBalance,
                                                "TotalBalance": citem.TotalBalance,
                                            }
                                            obj.ClaimLineItems.push(object);
                                        });
                                    }

                                    ClaimsList.push(obj);
                                } else {
                                    var templist1 = $filter("filter")(ClaimsList, { "PatientId": item.PatientId }, true) || [];

                                    if (templist1.length == 0) {
                                        let obj1 = {
                                            "PatientStatementId": 0,
                                            "PatientId": item.PatientId,
                                            "TotalAmount": item.TotalClaimAmount,
                                            "TotalPatientBalance": item.TotalPatientBalance,
                                            "ClaimLineItems": []
                                            //"TotalClaimAmount": item.TotalClaimAmount,
                                            //"TotalPatientBalance": item.TotalPatientBalance,
                                            //"TotalInsuranceBalance": item.TotalInsuranceBalance,
                                            //"TotalBalance": item.TotalBalance,
                                            //"TotalPatientPayment": item.TotalPatientPayment,
                                            //"TotalInsurancePayment": item.TotalInsurancePayment,

                                        }

                                        if (item.ClaimLineItems.length > 0) {
                                            angular.forEach(item.ClaimLineItems, function (citem) {
                                                var object = {
                                                    "PatientStatementClaimLineItemId": 0,
                                                    "ClaimLineItemId": citem.ClaimLineItemId,
                                                    "PatientClaimNumber": citem.PatientClaimNumber,
                                                    "PatientClaimId": citem.PatientClaimId,
                                                    "ServiceId": citem.ServiceId,
                                                    "ServiceName": citem.ServiceName,
                                                    "ServiceCode": citem.ServiceCode,
                                                    "TotalChargeAmount": citem.TotalChargeAmount,
                                                    "AllowedAmount": citem.AllowedAmount,
                                                    "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                                    "CoPaymentAmount": citem.CoPaymentAmount,
                                                    "AdjustmentAmount": citem.AdjustmentAmount,
                                                    "DeductibleAmount": citem.DeductibleAmount,
                                                    "CoInsuranceAmount": citem.CoInsuranceAmount,
                                                    "PatientPaymentAmount": citem.PatientPaymentAmount,
                                                    "WriteOffAmount": citem.WriteOffAmount,
                                                    "InsuranceBalance": citem.InsuranceBalance,
                                                    "PatientBalance": citem.PatientBalance,
                                                    "TotalBalance": citem.TotalBalance,
                                                }
                                                obj1.ClaimLineItems.push(object);
                                            });
                                        }

                                        ClaimsList.push(obj1);
                                    } else {

                                        if (item.ClaimLineItems.length > 0) {
                                            angular.forEach(item.ClaimLineItems, function (citem) {
                                                let object = {
                                                    "PatientStatementClaimLineItemId": 0,
                                                    "ClaimLineItemId": citem.ClaimLineItemId,
                                                    "PatientClaimId": citem.PatientClaimId,
                                                    "ServiceId": citem.ServiceId,
                                                    "ServiceName": citem.ServiceName,
                                                    "ServiceCode": citem.ServiceCode,
                                                    "TotalChargeAmount": citem.TotalChargeAmount,
                                                    "AllowedAmount": citem.AllowedAmount,
                                                    "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                                    "CoPaymentAmount": citem.CoPaymentAmount,
                                                    "AdjustmentAmount": citem.AdjustmentAmount,
                                                    "DeductibleAmount": citem.DeductibleAmount,
                                                    "CoInsuranceAmount": citem.CoInsuranceAmount,
                                                    "PatientPaymentAmount": citem.PatientPaymentAmount,
                                                    "WriteOffAmount": citem.WriteOffAmount,
                                                    "InsuranceBalance": citem.InsuranceBalance,
                                                    "PatientBalance": citem.PatientBalance,
                                                    "TotalBalance": citem.TotalBalance,
                                                }
                                                templist1[0].ClaimLineItems.push(object);
                                            });
                                        }
                                    }
                                }

                            });
                        }

                        $scope.PrintPatientsInfo.StatementCount = ClaimsList.length;

                        var obj = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "BatchName": $scope.PrintPatientsInfo.BatchName,
                            "BatchType": "Pdf",
                            "StatementDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "StatementCount": $scope.PrintPatientsInfo.StatementCount,
                            "TotalStatementAmount": $scope.PrintPatientsInfo.TotalStatementAmount,
                            "PatientStatementBatchId": 0,
                            "ClaimsList": ClaimsList
                        }

                        console.log(JSON.stringify(obj))
                        //return false;
                        eHnoteInsuranceService.AddUpdatePatientStatements(obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close();
                            } else {
                                alertify.error(resp.data.Message);
                            }
                        }, function (error) {

                        });
                    }

                    $scope.ClearInfo = function () {
                        $scope.PrintPatientsInfo.BatchName = "";
                        $scope.PrintPatientsInfo.StatementDate = "";
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.close();
                    };

                    $scope.DownloadPatientStatementPrint = function () {
                        var element = document.getElementById('pdf-content');

                        var options = {
                            margin: 0.1,
                            filename: 'patient_statement.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                        };

                        html2pdf().set(options).from(element).save().then(function () {
                            element.style.display = 'none';
                        });
                    };

                    var tempstatementlist = $filter("filter")($scope.PrintPatientStatementList, { "IsChecked": true }, true) || [];

                    var mergedList = [];
                    angular.forEach(tempstatementlist, function (item) {

                        if (mergedList.length > 0) {
                            var templist = $filter("filter")(mergedList, { "PatientId": item.PatientId }, true) || [];
                            if (templist.length > 0) {

                                angular.forEach(mergedList, function (mitem) {
                                    if (mitem.PatientId === item.PatientId) {
                                        mitem.ClaimLineItems.push(...item.ClaimLineItems);
                                        mitem.TotalBalance += item.TotalBalance || 0;
                                        mitem.TotalPatientBalance += item.TotalPatientBalance || 0;

                                        if (mitem.PatientClaimNumber) {
                                            if (!mitem.PatientClaimNumber.includes(item.PatientClaimNumber)) {
                                                mitem.PatientClaimNumber += "," + item.PatientClaimNumber;
                                            }
                                        }

                                        mitem.PatientBlanceSummary[0].Between0to30Days += item.PatientBlanceSummary[0].Between0to30Days;
                                        mitem.PatientBlanceSummary[0].Between30to60Days += item.PatientBlanceSummary[0].Between30to60Days;
                                        mitem.PatientBlanceSummary[0].Between60to90Days += item.PatientBlanceSummary[0].Between60to90Days;
                                        mitem.PatientBlanceSummary[0].Between90to120Days += item.PatientBlanceSummary[0].Between90to120Days;
                                        mitem.PatientBlanceSummary[0].Morethen120days += item.PatientBlanceSummary[0].Morethen120days;

                                    }
                                });
                            } else {
                                mergedList.push(item);
                            }
                        } else {
                            mergedList.push(item);
                        }

                    });

                    $scope.PrintPatientStatementList = angular.copy(mergedList);


                    angular.forEach($scope.PrintPatientStatementList, function (item) {
                        item.TotalPatientAmountData = 0;
                        item.OrgBillingProviderListData = {};
                        angular.forEach(item.ClaimLineItems, function (citem) {
                            citem.TotalPatientClaimsAmount = 0;
                            angular.forEach(citem.ClaimLineItemTransactions, function (mitem) {
                                if (mitem.TransactionTypeId === 24 || mitem.TransactionTypeId === 25 || mitem.TransactionTypeId === 26 || mitem.TransactionTypeId === 27 || mitem.TransactionTypeId === 32 || mitem.TransactionTypeId === 36 || mitem.TransactionTypeId === 40 || mitem.TransactionTypeId === 98 || mitem.TransactionTypeId === 99 || mitem.TransactionTypeId === 100) {
                                    citem.TotalPatientClaimsAmount += -(mitem.TransactionAmount) || 0;
                                }
                            });
                            item.TotalPatientAmountData += citem.TotalPatientClaimsAmount || 0;

                            item.OrgBillingProviderListData = $filter("filter")($scope.OrgBillingProvider, { OrganizationBillingProviderId: citem.BillingProviderId })[0] || {};


                        });
                    });




                }
            });
            mInstanceAdd.result.then(function (resp) {
                $scope.SearchPatientStatementObj.PatientStatementFormat = "";
                angular.forEach($scope.PatientStatementList, function (item) {
                    item.IsChecked = false;
                });
            }, function () {

            });
        };

        $scope.SelectAllStatements = function () {
            angular.forEach($scope.PatientStatementList, function (item) {
                if ($scope.SearchPatientStatementObj.IsChecked) {
                    item.IsChecked = true;

                    $scope.PatientStatementSelections[item.PatientId] = {
                        IsChecked: item.IsChecked,
                        ProcessStatusId: item.ProcessStatusId,
                        data: item
                    };
                } else {
                    item.IsChecked = false;
                }
            });
        }


        $scope.navtoOpenProfilePopup = function (item, id) {


            item = item || '';
            id = id || 0;
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }
            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                /*"ActionType": "AddClaim",*/
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsClaimPatientProfileCtrl",
                "windowClass": "offcanves-right",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "IshideIndicator": true,
                }

            });

            $scope.mInstanceAdd.result.then(function (resp) {

                $scope.SearchPatientStatement();

            }, function () { });
        }

        $scope.AddUpdatePatientStatementsDetails = function (Value) {
            if ($scope.PrintPatientsInfo.BatchName === "") {
                alertify.error("Please enter the batch name!");
                return false;
            }

            let ClaimsList = [];

            var templist = $filter("filter")($scope.PatientStatementList, { "IsChecked": true }, true) || [];
            if (templist.length > 0) {
                angular.forEach(templist, function (item) {
                    $scope.PatientPostalAddress = item.PatientPostalAddress;
                    $scope.PrintPatientsInfo.TotalStatementAmount += item.TotalBalance || 0;
                    if (ClaimsList.length == 0) {
                        let obj = {
                            "PatientStatementId": 0,
                            "GeneratedModeId": 2,
                            "GeneratedMode": "Manual",
                            "ProcessStatusId": 4,
                            "ProcessStatus": "Completed",
                            "ProcessedVia": "",
                            "StatementSent": false,
                            "ShowInPatientPortal": false,
                            "GeneratedDateTime": false,
                            "PatientId": item.PatientId,
                            "TotalAmount": item.TotalClaimAmount,
                            "TotalPatientBalance": item.TotalPatientBalance,
                            "PatientClaimId": item.PatientClaimId,
                            "DOSFrom": item.DOSFrom,
                            "ClaimDate": item.ClaimDate,
                            "PatientFirstName": item.PatientFirstName,
                            "PatientLastName": item.PatientLastName,
                            "PatientFullName": item.PatientFullName,
                            "PatientMrNo": item.PatientMrNo,
                            "PatientClaimNumber": item.PatientClaimNumber,
                            "TotalInsuranceBalance": item.TotalInsuranceBalance,
                            "TotalBalance": item.TotalBalance,
                            "TotalPatientPayment": item.TotalPatientPayment,
                            "TotalInsurancePayment": item.TotalInsurancePayment,
                            "PrimaryInsuranceId": item.PrimaryInsuranceId,
                            "PrimaryInsurancePayorName": item.PrimaryInsurancePayorName,
                            "SecondaryInsuranceId": item.SecondaryInsuranceId,
                            "SecondaryInsurancePayorName": item.SecondaryInsurancePayorName,
                            "TotalDeductibleAmount": item.TotalDeductibleAmount,
                            "TotalCoInsuranceAmount": item.TotalCoInsuranceAmount,
                            "TotalCopayAmount": item.TotalCopayAmount,
                            "EmailId": item.PatientEmail,
                            "DoctorName": item.DoctorName,
                            "PatientFullName": item.PatientFullName,
                            "PatientAddress": item.PatientAddress,
                            "PatientBlanceSummary": item.PatientBlanceSummary,
                            "ClaimLineItems": []
                        }

                        if (item.ClaimLineItems && item.ClaimLineItems.length > 0) {
                            angular.forEach(item.ClaimLineItems, function (citem) {
                                let object = {
                                    "PatientStatementClaimLineItemId": 0,
                                    "ClaimLineItemId": citem.ClaimLineItemId,
                                    "PatientClaimNumber": citem.PatientClaimNumber,
                                    "PatientClaimId": citem.PatientClaimId,
                                    "ServiceId": citem.ServiceId,
                                    "ServiceName": citem.ServiceName,
                                    "ServiceCode": citem.ServiceCode,
                                    "TotalChargeAmount": citem.TotalChargeAmount,
                                    "AllowedAmount": citem.AllowedAmount,
                                    "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                    "CoPaymentAmount": citem.CoPaymentAmount,
                                    "AdjustmentAmount": citem.AdjustmentAmount,
                                    "DeductibleAmount": citem.DeductibleAmount,
                                    "CoInsuranceAmount": citem.CoInsuranceAmount,
                                    "PatientPaymentAmount": citem.PatientPaymentAmount,
                                    "WriteOffAmount": citem.WriteOffAmount,
                                    "InsuranceBalance": citem.InsuranceBalance,
                                    "PatientBalance": citem.PatientBalance,
                                    "TotalBalance": citem.TotalBalance,
                                    "DOSfrom": citem.DOSfrom,
                                    "ClaimLineItemTransactions": citem.ClaimLineItemTransactions
                                }
                                obj.ClaimLineItems.push(object);
                            });
                        }

                        ClaimsList.push(obj);
                    } else {
                        var templist1 = $filter("filter")(ClaimsList, { "PatientId": item.PatientId }, true) || [];

                        if (templist1.length == 0) {
                            let obj1 = {
                                "PatientStatementId": 0,
                                "GeneratedModeId": 2,
                                "GeneratedMode": "Manual",
                                "ProcessStatusId": 4,
                                "ProcessStatus": "Completed",
                                "ProcessedVia": "",
                                "StatementSent": false,
                                "ShowInPatientPortal": false,
                                "GeneratedDateTime": false,
                                "PatientId": item.PatientId,
                                "TotalAmount": item.TotalClaimAmount,
                                "TotalPatientBalance": item.TotalPatientBalance,
                                "PatientClaimId": item.PatientClaimId,
                                "DOSFrom": item.DOSFrom,
                                "ClaimDate": item.ClaimDate,
                                "PatientFirstName": item.PatientFirstName,
                                "PatientLastName": item.PatientLastName,
                                "PatientFullName": item.PatientFullName,
                                "PatientMrNo": item.PatientMrNo,
                                "PatientClaimNumber": item.PatientClaimNumber,
                                "TotalInsuranceBalance": item.TotalInsuranceBalance,
                                "TotalBalance": item.TotalBalance,
                                "TotalPatientPayment": item.TotalPatientPayment,
                                "TotalInsurancePayment": item.TotalInsurancePayment,
                                "PrimaryInsuranceId": item.PrimaryInsuranceId,
                                "PrimaryInsurancePayorName": item.PrimaryInsurancePayorName,
                                "SecondaryInsuranceId": item.SecondaryInsuranceId,
                                "SecondaryInsurancePayorName": item.SecondaryInsurancePayorName,
                                "TotalDeductibleAmount": item.TotalDeductibleAmount,
                                "TotalCoInsuranceAmount": item.TotalCoInsuranceAmount,
                                "TotalCopayAmount": item.TotalCopayAmount,
                                "EmailId": item.PatientEmail,
                                "DoctorName": item.DoctorName,
                                "PatientFullName": item.PatientFullName,
                                "PatientAddress": item.PatientAddress,
                                "PatientBlanceSummary": item.PatientBlanceSummary,
                                "ClaimLineItems": []
                            }

                            if (item.ClaimLineItems && item.ClaimLineItems.length > 0) {
                                angular.forEach(item.ClaimLineItems, function (citem) {
                                    var object = {
                                        "PatientStatementClaimLineItemId": 0,
                                        "ClaimLineItemId": citem.ClaimLineItemId,
                                        "PatientClaimNumber": citem.PatientClaimNumber,
                                        "PatientClaimId": citem.PatientClaimId,
                                        "ServiceId": citem.ServiceId,
                                        "ServiceName": citem.ServiceName,
                                        "ServiceCode": citem.ServiceCode,
                                        "TotalChargeAmount": citem.TotalChargeAmount,
                                        "AllowedAmount": citem.AllowedAmount,
                                        "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                        "CoPaymentAmount": citem.CoPaymentAmount,
                                        "AdjustmentAmount": citem.AdjustmentAmount,
                                        "DeductibleAmount": citem.DeductibleAmount,
                                        "CoInsuranceAmount": citem.CoInsuranceAmount,
                                        "PatientPaymentAmount": citem.PatientPaymentAmount,
                                        "WriteOffAmount": citem.WriteOffAmount,
                                        "InsuranceBalance": citem.InsuranceBalance,
                                        "PatientBalance": citem.PatientBalance,
                                        "TotalBalance": citem.TotalBalance,
                                        "DOSfrom": citem.DOSfrom,
                                        "ClaimLineItemTransactions": citem.ClaimLineItemTransactions
                                    }
                                    obj1.ClaimLineItems.push(object);
                                });
                            }

                            ClaimsList.push(obj1);
                        } else {

                            if (item.ClaimLineItems && item.ClaimLineItems.length > 0) {
                                angular.forEach(item.ClaimLineItems, function (citem) {
                                    let object = {
                                        "PatientStatementClaimLineItemId": 0,
                                        "ClaimLineItemId": citem.ClaimLineItemId,
                                        "PatientClaimId": citem.PatientClaimId,
                                        "ServiceId": citem.ServiceId,
                                        "ServiceName": citem.ServiceName,
                                        "ServiceCode": citem.ServiceCode,
                                        "TotalChargeAmount": citem.TotalChargeAmount,
                                        "AllowedAmount": citem.AllowedAmount,
                                        "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                        "CoPaymentAmount": citem.CoPaymentAmount,
                                        "AdjustmentAmount": citem.AdjustmentAmount,
                                        "DeductibleAmount": citem.DeductibleAmount,
                                        "CoInsuranceAmount": citem.CoInsuranceAmount,
                                        "PatientPaymentAmount": citem.PatientPaymentAmount,
                                        "WriteOffAmount": citem.WriteOffAmount,
                                        "InsuranceBalance": citem.InsuranceBalance,
                                        "PatientBalance": citem.PatientBalance,
                                        "TotalBalance": citem.TotalBalance,
                                        "DOSfrom": citem.DOSfrom,
                                        "ClaimLineItemTransactions": citem.ClaimLineItemTransactions
                                    }
                                    templist1[0].ClaimLineItems.push(object);
                                });
                            }
                        }
                    }

                });
            }

            $scope.PrintPatientsInfo.StatementCount = ClaimsList.length;

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "BatchName": $scope.PrintPatientsInfo.BatchName,
                "BatchType": "Pdf",
                "Type": "",
                "StatementDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ProcessedDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "StatementCount": $scope.PrintPatientsInfo.StatementCount,
                "TotalStatementAmount": $scope.PrintPatientsInfo.TotalStatementAmount,
                "PatientStatementBatchId": 0,
                "PatientPostalAddress": $scope.PatientPostalAddress,
                "ClaimsList": ClaimsList
            }
            obj.Type = Value;

            $scope.HospitalAddressArray = [];
            if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
                $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];

                obj.Address1 = $scope.HospitalAddressArray.Address1;
                obj.Address2 = $scope.HospitalAddressArray.Address2;
                obj.ClinicName = $scope.HospitalAddressArray.ClinicName;
                obj.ContactNo = $scope.HospitalAddressArray.ContactNo || "";
                obj.PinCode = $scope.HospitalAddressArray.PinCode;
                obj.CityName = $scope.HospitalAddressArray.CityName;
                obj.StateName = $scope.HospitalAddressArray.StateName;
                obj.CountryName = $scope.HospitalAddressArray.CountryName;
                var object = eHnoteUserDataService.UsMobileFormatChange(obj.ContactNo);
                obj.ContactNo = object.UsFormatMobileNumber;
            }
            obj.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;

            console.log(JSON.stringify(obj))

            eHnoteInsuranceService.AddUpdatePatientStatements(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    if (Value == 'Export') {
                        alertify.success("Email sent successfully");
                        $scope.PrintPatientsInfo.BatchName = '';

                    }
                    else {
                        $scope.PrintMultiplePatientSatementData(templist);
                        $scope.PrintPatientsInfo.BatchName = '';
                    }
                }
                else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {

            });
        };
        $scope.PatientStatements3Url = "";
        $scope.sendHtmlAsBase64 = function (Value, Action) {
            if (!$scope.PatientStatementHtml) {
                alert("HTML content not available.");
                return;
            }
            var requestData = {
                Base64Content: $scope.PatientStatementHtml,
                FileName: new Date().getTime() + ".pdf",
                OrganizationId: $scope.HospitalId,
            };
            eHnoteInsuranceService.GeneratePatientStatements3Url(requestData).then(function (resp) {
                console.log(resp)
                if (resp.data) {
                    $scope.PatientStatements3Url = resp.data;
                    $scope.AddUpdatePatientStatementsDetailsnew(Value, Action);
                }
                else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {

            });



        };
        $scope.prepareAndSend = function (Value, Action) {
            $scope.PatientStatementHtml = document.getElementById('statementContent').innerHTML;
            $scope.sendHtmlAsBase64(Value, Action);
        };

        $scope.AddUpdatePatientStatementsDetailsnew = function (Value, Action) {
            if ($scope.PrintPatientsInfo.BatchName === "" && Value != 'Queue') {
                alertify.error("Please enter the batch name!");
                return false;
            }

           
            let IsStatementSent = false;
            let IsStatementPrint = false;

            if (Value != 'Queue') {
                IsStatementSent = true;
            }
            if (Action == 'Print') {
                IsStatementPrint = true;
            }
            let NewStatementsList = [];
            //var templist = $filter("filter")($scope.PatientStatementList, { "IsChecked": true, "ProcessStatusId": 1 }, true) || [];
                var templist = [];
                angular.forEach($scope.PatientStatementSelections, function (value) {
                    if (value.IsChecked && value.ProcessStatusId === 2) {
                        templist.push(value.data);
                    }
                });

            if (templist.length > 0) {
                angular.forEach(templist, function (Aitem) {
                    $scope.PatientPostalAddress = Aitem.PatientPostalAddress;
                    let ClaimsLineItemsList = [];
                    var object1 = eHnoteUserDataService.UsMobileFormatChange(Aitem.PatientMobile);
                    Aitem.PatientMobile = object1.UsFormatMobileNumber;
                    var StatementObj = {
                        "PatientStatementId": 0,
                        "PatientId": Aitem.PatientId,
                        "S3URL": "",
                        "GeneratedModeId": 2,
                        "GeneratedMode": "Manual",
                        "ProcessStatusId": Aitem.ProcessStatusId || 2,
                        "ProcessStatus": Aitem.ProcessStatus || "Ready To Send",
                        "ProcessedVia": "",
                        "StatementSent": IsStatementSent || false,
                        "ShowInPatientPortal": false,
                        "GeneratedDateTime": $filter('date')(new Date(), "MM-dd-yyyy") || "",
                        "PatientFirstName": Aitem.PatientFirstName,
                        "PatientLastName": Aitem.PatientLastName,
                        "PatientFullName": Aitem.PatientFullName,
                        "PatientMrNo": Aitem.PatientMrNo,
                        "TotalAmount": 0,
                        "TotalPatientBalance": 0,
                        "TotalInsuranceBalance":0,
                        "TotalBalance":0,
                        "TotalPatientPayment": 0,
                        "TotalInsurancePayment": 0,
                        "PrimaryInsuranceId": 0,
                        "PrimaryInsurancePayorName": "",
                        "SecondaryInsuranceId": 0,
                        "SecondaryInsurancePayorName": "",
                        "TotalDeductibleAmount": 0,
                        "TotalCoInsuranceAmount": 0,
                        "TotalCopayAmount": 0,
                        "EmailId": Aitem.PatientEmail,
                        "PatientFullName": Aitem.PatientFullName,
                        "PatientDisplayId": Aitem.PatientMrNo || "",
                        "AgeInYears": Aitem.AgeInYears || "",
                        "AgeInMonths": Aitem.AgeInMonths || "",
                        "Gender": Aitem.Gender || "",
                        "MobileNumber": Aitem.PatientMobile || "",
                        "IsStatementPrintedInternal": false,
                        "IsStatementPrintedInPerson": IsStatementPrint,
                        "DoctorName": "",
                        "TotalPaidAmount": 0,
                        "PatientAddress": {},
                        "AllClaimsLineItemsList": [],
                        "PatientBlanceSummary":[],
                    }

                    angular.forEach(Aitem.PatientClaim, function (Bitem) {
                        //let obj = {
                        //    "PatientStatementId": 0,
                        //    "GeneratedModeId": 2,
                        //    "GeneratedMode": "Manual",
                        //    "ProcessStatusId": Aitem.ProcessStatusId || 1,
                        //    "ProcessStatus": Aitem.ProcessStatus || "Send",
                        //    "ProcessedVia": "",
                        //    "StatementSent": IsStatementSent || false,
                        //    "ShowInPatientPortal": false,
                        //    "GeneratedDateTime": "",
                        //    "PatientId": Bitem.PatientId,
                        //    "TotalAmount": Bitem.TotalClaimAmount,
                        //    "TotalPatientBalance": Bitem.TotalPatientBalance,
                        //    "PatientClaimId": Bitem.PatientClaimId,
                        //    "DOSFrom": Bitem.DOSFrom,
                        //    "ClaimDate": Bitem.ClaimDate,
                        //    "PatientFirstName": Bitem.PatientFirstName,
                        //    "PatientLastName": Bitem.PatientLastName,
                        //    "PatientFullName": Bitem.PatientFullName,
                        //    "PatientMrNo": Bitem.PatientMrNo,
                        //    "PatientClaimNumber": Bitem.PatientClaimNumber,
                        //    "TotalInsuranceBalance": Bitem.TotalInsuranceBalance,
                        //    "TotalBalance": Bitem.TotalBalance,
                        //    "TotalPatientPayment": Bitem.TotalPatientPayment,
                        //    "TotalInsurancePayment": Bitem.TotalInsurancePayment,
                        //    "PrimaryInsuranceId": Bitem.PrimaryInsuranceId,
                        //    "PrimaryInsurancePayorName": Bitem.PrimaryInsurancePayorName,
                        //    "SecondaryInsuranceId": Bitem.SecondaryInsuranceId,
                        //    "SecondaryInsurancePayorName": Bitem.SecondaryInsurancePayorName,
                        //    "TotalDeductibleAmount": Bitem.TotalDeductibleAmount,
                        //    "TotalCoInsuranceAmount": Bitem.TotalCoInsuranceAmount,
                        //    "TotalCopayAmount": Bitem.TotalCopayAmount,
                        //    "EmailId": Bitem.EmailId,
                        //    "DoctorName": Bitem.DoctorName,
                        //    "PatientFullName": Bitem.PatientFullName,
                        //    //"PatientAddress": Bitem.PatientAddress,
                        //    //"PatientBlanceSummary": Bitem.PatientBlanceSummary,
                        //    "ClaimLineItems": []
                        //}

                        if (Bitem.ClaimLineItems.length > 0) {
                            angular.forEach(Bitem.ClaimLineItems, function (citem) {

                                let object = {
                                    "PatientStatementClaimLineItemId": 0,
                                    "ClaimLineItemId": citem.ClaimLineItemId,
                                    "PatientClaimNumber": citem.PatientClaimNumber,
                                    "PatientClaimId": citem.PatientClaimId,
                                    "ServiceId": citem.ServiceId,
                                    "ServiceName": citem.ServiceName,
                                    "ServiceCode": citem.ServiceCode,
                                    "TotalChargeAmount": citem.TotalChargeAmount,
                                    "AllowedAmount": citem.AllowedAmount,
                                    "InsurancePaymentAmount": citem.InsurancePaymentAmount,
                                    "CoPaymentAmount": citem.CoPaymentAmount,
                                    "AdjustmentAmount": citem.AdjustmentAmount,
                                    "DeductibleAmount": citem.DeductibleAmount,
                                    "CoInsuranceAmount": citem.CoInsuranceAmount,
                                    "PatientPaymentAmount": citem.PatientPaymentAmount,
                                    "WriteOffAmount": citem.WriteOffAmount,
                                    "InsuranceBalance": citem.InsuranceBalance,
                                    "PatientBalance": citem.PatientBalance,
                                    "TotalBalance": citem.TotalBalance,
                                    "TotalPaymentAmount": citem.InsurancePaymentAmount + citem.PatientPaymentAmount,
                                    "DOSfrom": citem.DOSfrom,
                                    "BillingProviderName": citem.BillingProviderName,
                                    "ClaimLineItemTransactions": citem.ClaimLineItemTransactions
                                }
                                /* obj.ClaimLineItems.push(object);*/
                                ClaimsLineItemsList.push(object);
                            });
                        }

                        if (Bitem.PatientBlanceSummary.length > 0) {
                            if (StatementObj.PatientBlanceSummary.length != 0) {

                                StatementObj.PatientBlanceSummary[0].Between0to30Days += Bitem.PatientBlanceSummary[0].Between0to30Days||0;
                                StatementObj.PatientBlanceSummary[0].Between30to60Days += Bitem.PatientBlanceSummary[0].Between30to60Days||0;
                                StatementObj.PatientBlanceSummary[0].Between60to90Days += Bitem.PatientBlanceSummary[0].Between60to90Days||0;
                                StatementObj.PatientBlanceSummary[0].Between90to120Days += Bitem.PatientBlanceSummary[0].Between90to120Days||0;
                                StatementObj.PatientBlanceSummary[0].Morethan120Days += Bitem.PatientBlanceSummary[0].Morethan120days||0;

                            } else {
                                let Pobj = {
                                    "Between0to30Days": Bitem.PatientBlanceSummary[0].Between0to30Days || 0,
                                    "Between30to60Days": Bitem.PatientBlanceSummary[0].Between30to60Days || 0,
                                    "Between60to90Days": Bitem.PatientBlanceSummary[0].Between60to90Days ||0,
                                    "Between90to120Days": Bitem.PatientBlanceSummary[0].Between90to120Days ||0,
                                    "Morethan120Days": Bitem.PatientBlanceSummary[0].Morethan120days ||0
                                }
                                StatementObj.PatientBlanceSummary.push(Pobj);
                            }
                        }

                       // StatementObj.PatientBlanceSummary = Bitem.PatientBlanceSummary;
                        StatementObj.DoctorName = Bitem.DoctorName;
                        StatementObj.PatientAddress = Bitem.PatientAddress;
                        StatementObj.TotalAmount += Bitem.TotalClaimAmount;
                        StatementObj.TotalPatientBalance += Bitem.TotalPatientBalance;
                        StatementObj.TotalBalance += Bitem.TotalBalance;
                        StatementObj.TotalPatientPayment += Bitem.TotalPatientPayment;
                        StatementObj.TotalInsurancePayment += Bitem.TotalInsurancePayment;
                        StatementObj.TotalPaidAmount += (StatementObj.TotalPatientPayment + StatementObj.TotalInsurancePayment);
                    });
                    StatementObj.AllClaimsLineItemsList = ClaimsLineItemsList || [];
                    NewStatementsList.push(StatementObj);
                });


            }


            $scope.PrintPatientsInfo.StatementCount = NewStatementsList.length;

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "BatchName": $scope.PrintPatientsInfo.BatchName,
                "BatchType": "Pdf",
                "StatementDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                //  "ProcessedDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ProcessedDate": null,
                "StatementCount": $scope.PrintPatientsInfo.StatementCount,
                "TotalStatementAmount": $scope.PrintPatientsInfo.TotalStatementAmount,
                "PatientStatementBatchId": 0,
                "PatientPostalAddress": $scope.PatientPostalAddress,
               /* "ClaimsList": ClaimsList,*/
                "StatementsList": NewStatementsList,
                "S3URL": ""
            }
            obj.Type = Value;

            $scope.HospitalAddressArray = [];
            if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
                $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];

                obj.Address1 = $scope.HospitalAddressArray.Address1;
                obj.Address2 = $scope.HospitalAddressArray.Address2;
                obj.ClinicName = $scope.HospitalAddressArray.ClinicName;
                obj.ContactNo = $scope.HospitalAddressArray.MobileNo || "";
                obj.PinCode = $scope.HospitalAddressArray.PinCode;
                obj.CityName = $scope.HospitalAddressArray.CityName;
                obj.StateName = $scope.HospitalAddressArray.StateName;
                obj.CountryName = $scope.HospitalAddressArray.CountryName;
                var object = eHnoteUserDataService.UsMobileFormatChange(obj.ContactNo);
                obj.ContactNo = object.UsFormatMobileNumber;
                if ($scope.HospitalAddressArray.FaxNumber != "") {
                  var faxobj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.FaxNumber);
                  obj.FaxNumber = faxobj.UsFormatMobileNumber;
                 }
            }
            obj.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;

            console.log(JSON.stringify(obj))
            //   return false;
            eHnoteInsuranceService.AddUpdatePatientStatements(obj).then(function (resp) {
                   
                if (resp.data[0])
                {
                            if (resp.data[0].Status == "Success") {
                            //if (Value == 'Export') {
                            //    alertify.success("Email sent successfully");
                            //    $scope.PrintPatientsInfo.BatchName = '';

                            //}
                            if (Action == 'Print') {
                                //$scope.PrintMultiplePatientSatementData(templist);
                                $scope.printPatientStatements(resp);
                                $scope.PrintPatientsInfo.BatchName = '';

                            }
                        }
                       
                    $scope.PatientStatementSelections = {};
                    $scope.SearchPatientStatement();
                }
                else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {

            });
        };


        $scope.PrintMultiplePatientSatementData = function (templist) {
            $scope.PatientStatementsListData = [];
            $scope.PatientStatementsListData = templist || [];
            var mergedList = [];
            angular.forEach($scope.PatientStatementsListData, function (Mitem) {
                $scope.HospitalAddressArray = $scope.HospitalAddressArray || {};
                Mitem.TotalPatientPaymentAmount = 0;
                Mitem.OrgBillingProviderListData = {};

                angular.forEach(Mitem.PatientClaim, function (item) {
                    if (item.ClaimLineItems.length > 0) {
                        angular.forEach(item.ClaimLineItems, function (pitem) {

                            pitem.PatientandInsPaymentAmount = 0;
                            pitem.PatientandInsPaymentAmount = parseInt(pitem.PatientPaymentAmount) + parseInt(pitem.InsurancePaymentAmount) || 0;

                            pitem.TotalPatientClaimsAmount = 0;

                            angular.forEach(pitem.ClaimLineItemTransactions, function (mitem) {
                                if (mitem.TransactionTypeId === 24 || mitem.TransactionTypeId === 25 || mitem.TransactionTypeId === 26 || mitem.TransactionTypeId === 27 || mitem.TransactionTypeId === 32 || mitem.TransactionTypeId === 36 || mitem.TransactionTypeId === 40 || mitem.TransactionTypeId === 98 || mitem.TransactionTypeId === 99 || mitem.TransactionTypeId === 100) {
                                    pitem.TotalPatientClaimsAmount += -(mitem.TransactionAmount) || 0;
                                }
                            });
                            item.TotalPatientPaymentAmount += pitem.TotalPatientClaimsAmount || 0;

                            item.OrgBillingProviderListData = $filter("filter")($scope.OrgBillingProvider, { OrganizationBillingProviderId: pitem.BillingProviderId })[0] || {};

                        })

                    }

                    if (mergedList.length > 0) {
                        var templist = $filter("filter")(mergedList, { "PatientId": item.PatientId }, true) || [];
                        if (templist.length > 0) {

                            angular.forEach(mergedList, function (mitem) {
                                if (mitem.PatientId === item.PatientId) {
                                    mitem.ClaimLineItems.push(...item.ClaimLineItems);
                                    mitem.TotalBalance += item.TotalBalance || 0;
                                    mitem.TotalPatientBalance += item.TotalPatientBalance || 0;

                                    if (mitem.PatientClaimNumber != '') {
                                        if (!mitem.PatientClaimNumber.includes(item.PatientClaimNumber)) {
                                            mitem.PatientClaimNumber += "," + item.PatientClaimNumber;
                                        }
                                    }

                                    mitem.PatientBlanceSummary[0].Between0to30Days += item.PatientBlanceSummary[0].Between0to30Days;
                                    mitem.PatientBlanceSummary[0].Between30to60Days += item.PatientBlanceSummary[0].Between30to60Days;
                                    mitem.PatientBlanceSummary[0].Between60to90Days += item.PatientBlanceSummary[0].Between60to90Days;
                                    mitem.PatientBlanceSummary[0].Between90to120Days += item.PatientBlanceSummary[0].Between90to120Days;
                                    mitem.PatientBlanceSummary[0].Morethen120days += item.PatientBlanceSummary[0].Morethen120days;

                                }
                            });
                        } else {
                            mergedList.push(item);
                        }
                    } else {
                        mergedList.push(item);
                    }
                });



                $scope.PatientStatementsListData = angular.copy(mergedList);





                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
                $scope.HospitalAddressArray.ContactNo = obj.UsFormatMobileNumber;

                $scope.GetMultiplePatientStatementPrint();
            });
            $scope.SearchPatientStatement();
        }

        $scope.GetMultiplePatientStatementPrint = function () {

            $timeout(function () {
                var innerContents = document.getElementById('MultiplePatientSatement_print').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);

        }

        $scope.PatientAgingObj = {
            "SelectStatusString": "All",
            "PAtientAgingName": "",
            "AllStatusCheck": true
        };

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
        $scope.checkPatientAging = function (val) {
            if (val) {
                angular.forEach($scope.MasterPatientAginglist, function (item) {
                    item.IsChecked = true;
                });
                $scope.SearchPatientStatementObj.PatientAgingList = $scope.MasterPatientAgingData.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
                console.log($scope.SearchPatientStatementObj.PatientAgingList);

                $scope.PatientAgingObj.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.MasterPatientAginglist, function (item) {
                    item.IsChecked = false;
                });

                $scope.PatientAgingObj.SelectStatusString = 'Selected';
            }
            $scope.ClaimStatusToggle1();
        };

        $scope.ClaimStatusToggle1 = function (obj) {
            var checkedArray = _.where($scope.MasterPatientAginglist, { IsChecked: true });
            $scope.PatientAgingObj.AllStatusCheck = checkedArray.length > 0 && $scope.MasterPatientAginglist.length === checkedArray.length ? true : false;
            if ($scope.PatientAgingObj.AllStatusCheck) {
                $scope.PatientAgingObj.SelectStatusString = 'All';
                $scope.SearchPatientStatementObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
            }

            if (!$scope.PatientAgingObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.PatientAgingObj.SelectStatusString = 'Selected';
                $scope.SearchPatientStatementObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
                console.log($scope.SearchPatientStatementObj.PatientAgingList);
            }
            if (!$scope.PatientAgingObj.AllStatusCheck && checkedArray.length === 0) {
                $scope.PatientAgingObj.SelectStatusString = 'Select';
                $scope.SearchPatientStatementObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
                console.log($scope.SearchPatientStatementObj.PatientAgingList);
            }
        };
        $scope.PatientStatementAlert = function (item) {

            let obj = {
                "PatientId": item.PatientId,
                "PatientFullName": item.PatientFullName,
                "PatientDisplayID": item.PatientMrNo,
                "StatusId": 2,
                "MasterPriority": $scope.MasterPriority,
                "MasterAlertTypes": $scope.MasterAlertTypes,
                "MasterAlertTag": $scope.MasterAlertTag,
                "MasterAlertNoteType": $scope.MasterAlertNoteType,
            }

            let mInstanceAdd = $uibModal.open({
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

            mInstanceAdd.result.then(
                function () {

                },
                function () {

                }
            );
        };

        $scope.navtoOpenAddDepositAmount = function (Aitem, Mainitem) {
            $scope.obj = {
                "PatientId": Mainitem.PatientId,
                "Type": '',
                "UsersList": $scope.AllHospitalData.AllUsersList,
                "Patientobj": $scope.Patientobj,
                "ClaimDetailsList": $scope.ClaimDetailsList || [],
                "OrganizationFacilityList": $scope.OrganizationFacilityList || [],
                "DepositTypes": $scope.DepositTypes,
                "WriteOffReasons": $scope.WriteOffReasons,
                "BillingProviderName": $scope.BillingProviderName || "",
                "FacilityName": $scope.FacilityName || "",
                "TotalPatientBalance": 0,
                "PatientClaimNumber": Aitem.PatientClaimNumber || ""
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
                "windowClass": "modal__ninety--"

            });
            modalInstance.result.then(function () {
                //$scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());
                /*$scope.SearchPatientDepositslist("pageLoad");*/

            }, function () { });
        }

        $scope.openAccordianItem = function (item) {
            const isCurrentlyOpen = item.isOpen || false;
            $scope.PatientStatementList.forEach(subItem => {
                subItem.isOpen = false;
            });
            item.isOpen = !isCurrentlyOpen;
        };
        $scope.printPatientStatements = function (resp) {
            angular.forEach(resp.data[0].rows, function (row) {
                if (row.S3URL) {
                    $scope.PrintS3PdfUrl(row.S3URL);
                }
            });
        };
        $scope.PrintS3PdfUrl = function (s3url) {
            if (!s3url) return;
            var printWindow = window.open(s3url, '_blank');

            if (printWindow) {
                printWindow.onload = function () {
                    setTimeout(function () {
                        printWindow.focus();
                        printWindow.print();
                    }, 1000); 
                };
            } else {
                alert('Please allow popups for this site to print the document.');
            }
        };


        $scope.ExportPatientStatementToExcel = function () {

            if (!$scope.PatientStatementList || !$scope.PatientStatementList.length) {
                alertify.error("No data to export");
                return;
            }

            var Locationids = '';
            Locationids = $scope.AllUserBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");
            var PatientAgingids = '';
            if ($scope.MasterPatientAginglist.length > 0) {
                 PatientAgingids = $scope.MasterPatientAginglist
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PatientAgingDataId)
                    .join(",");
            }
            var param = {
                "OrganizationId": $scope.HospitalId,
                "LocationIds": Locationids || '',
                "PageSize": $scope.PatientStatementListcount||0,
                "PageNumber": $scope.SearchPatientStatementObj.PageNumber,
                "PatientId": $scope.SearchStatementListObj.PatientId,
                "ClaimNumber": $scope.SearchPatientStatementObj.ClaimNumber,
                "PostingFrom": $scope.SearchPatientStatementObj.PostingFrom,
                "PostingTo": $scope.SearchPatientStatementObj.PostingTo,
                "PatientConditionId": $scope.SearchPatientStatementObj.PatientConditionId,
                /*"PatientAgingList": $scope.SearchPatientStatementObj.PatientAgingList,*/
                "PatientAgingList": PatientAgingids,
                "SortBy": $scope.SearchPatientStatementObj.SortBy,
            }

            eHnoteInsuranceService.GetAllPatientBalanceClaims(param).then(function (resp) {

                console.log(JSON.stringify(resp));

                //if (resp.data.rows.length > 0) {
                //    $scope.PatientStatementList = resp.data.rows || [];
                //    $scope.PatientStatementListcount = resp.data.count || 0;

                //    if ($scope.PatientStatementList.length>0) {
                //        $scope.isLoadingExport = true;

                //        const money = v => {
                //            if (v === null || v === undefined || v === "") return "";
                //            return `$${parseFloat(v).toFixed(2)}`;
                //        };

                //        let rows = [];

                //        angular.forEach($scope.PatientStatementList, function (p) {
                //            rows.push({
                //                "Patient Name": p.PatientFullName || "",
                //                "MR No": p.PatientMrNo || "",
                //                "Patient Email": p.PatientEmail || "",
                //                "Mobile No": p.PatientMobile || "",
                //                "Billed": money(p.TotalClaimAmount),
                //                /* "Ins Pay": money(p.TotalInsurancePayment),*/
                //                //"Dedut": money(p.TotalDeductibleAmount),
                //                //"Coins": money(p.TotalCoInsuranceAmount),
                //                "Pat Bal": money(p.TotalPatientBalance),
                //                "Ins Bal": money(p.TotalInsuranceBalance),
                //                "Total Bal": money(p.TotalBalance)
                //            });
                //        });

                //        if (!rows.length) {
                //            alertify.error("No claim records found");
                //            $scope.isLoadingExport = false;
                //            return;
                //        }

                //        let ws = XLSX.utils.json_to_sheet(rows);

                //        const headerStyle = {
                //            font: { bold: true, color: { rgb: "FFFFFF" } },
                //            fill: { fgColor: { rgb: "4F81BD" } }, // blue header
                //            alignment: { horizontal: "center", vertical: "center" }
                //        };

                //        const headerKeys = Object.keys(rows[0]);

                //        headerKeys.forEach((key, index) => {
                //            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
                //            if (ws[cellAddress]) {
                //                ws[cellAddress].s = headerStyle;
                //            }
                //        });

                //        ws['!rows'] = [{ hpt: 20 }];
                //        ws['!cols'] = Object.keys(rows[0]).map(k => ({ wch: 20 }));

                //        const today = new Date();
                //        const formattedDate =
                //            (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
                //            today.getDate().toString().padStart(2, '0') + '-' +
                //            today.getFullYear();

                //        setTimeout(function () {
                //            $scope.$apply();
                //            let wb = XLSX.utils.book_new();
                //            XLSX.utils.book_append_sheet(wb, ws, `Patient_Statements_${formattedDate}`);
                //            XLSX.writeFile(wb, 'Patient_Statements_' + $filter('date')(new Date(), 'yyyyMMdd') + '.xlsx');
                //            $scope.isLoadingExport = false;
                //        }, 1000);  // 1 seconds
                //    }
                //}
                if (resp.data.rows.length > 0) {

                    $scope.PatientStatementList = resp.data.rows || [];
                    $scope.PatientStatementListcount = resp.data.count || 0;

                    if ($scope.PatientStatementList.length > 0) {

                        $scope.isLoadingExport = true;

                        let rows = [];

                        angular.forEach($scope.PatientStatementList, function (p) {

                            rows.push({
                                "Patient Name": p.PatientFullName || "",
                                "MR No": p.PatientMrNo || "",
                                "Patient Email": p.PatientEmail || "",
                                "Mobile No": p.PatientMobile || "",
                                "Billed": parseFloat(p.TotalClaimAmount) || 0,
                                "Pat Bal": parseFloat(p.TotalPatientBalance) || 0,
                                "Ins Bal": parseFloat(p.TotalInsuranceBalance) || 0,
                                "Total Bal": parseFloat(p.TotalBalance) || 0
                            });

                        });

                        if (!rows.length) {
                            alertify.error("No claim records found");
                            $scope.isLoadingExport = false;
                            return;
                        }

                        // Create worksheet
                        let ws = XLSX.utils.json_to_sheet(rows);

                        // Column indexes
                        const billedCol = 4;
                        const patBalCol = 5;
                        const insBalCol = 6;
                        const totalBalCol = 7;

                        const dataRowCount = rows.length;

                        const billedLetter = XLSX.utils.encode_col(billedCol);
                        const patBalLetter = XLSX.utils.encode_col(patBalCol);
                        const insBalLetter = XLSX.utils.encode_col(insBalCol);
                        const totalBalLetter = XLSX.utils.encode_col(totalBalCol);

                        const totalRowNumber = dataRowCount + 2; // +1 header, +1 next row

                        // Add TOTAL label
                        ws[`A${totalRowNumber}`] = { t: 's', v: 'TOTAL' };

                        // Add SUM formulas
                        ws[`${billedLetter}${totalRowNumber}`] = {
                            t: 'n',
                            f: `SUM(${billedLetter}2:${billedLetter}${dataRowCount + 1})`
                        };

                        ws[`${patBalLetter}${totalRowNumber}`] = {
                            t: 'n',
                            f: `SUM(${patBalLetter}2:${patBalLetter}${dataRowCount + 1})`
                        };

                        ws[`${insBalLetter}${totalRowNumber}`] = {
                            t: 'n',
                            f: `SUM(${insBalLetter}2:${insBalLetter}${dataRowCount + 1})`
                        };

                        ws[`${totalBalLetter}${totalRowNumber}`] = {
                            t: 'n',
                            f: `SUM(${totalBalLetter}2:${totalBalLetter}${dataRowCount + 1})`
                        };

                        // Apply currency format
                        for (let i = 2; i <= totalRowNumber; i++) {

                            [billedLetter, patBalLetter, insBalLetter, totalBalLetter].forEach(col => {
                                let cell = ws[`${col}${i}`];
                                if (cell) {
                                    cell.z = "$0.00";
                                }
                            });
                        }

                        // Header style
                        const headerStyle = {
                            font: { bold: true, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "4F81BD" } },
                            alignment: { horizontal: "center", vertical: "center" }
                        };

                        const headerKeys = Object.keys(rows[0]);

                        headerKeys.forEach((key, index) => {
                            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
                            if (ws[cellAddress]) {
                                ws[cellAddress].s = headerStyle;
                            }
                        });

                        // Bold TOTAL row
                        headerKeys.forEach((key, index) => {
                            const cellAddress = XLSX.utils.encode_cell({ r: totalRowNumber - 1, c: index });
                            if (ws[cellAddress]) {
                                ws[cellAddress].s = { font: { bold: true } };
                            }
                        });

                        ws['!cols'] = headerKeys.map(() => ({ wch: 20 }));

                        const today = new Date();
                        const formattedDate =
                            (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
                            today.getDate().toString().padStart(2, '0') + '-' +
                            today.getFullYear();

                        setTimeout(function () {

                            $scope.$apply();

                            let wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, `Patient_Statements_${formattedDate}`);

                            XLSX.writeFile(
                                wb,
                                'Patient_Statements_' + $filter('date')(new Date(), 'yyyyMMdd') + '.xlsx'
                            );

                            $scope.isLoadingExport = false;

                        }, 1000);
                    }
                }


            }, function (err) { console.log(err); });




            
        };




    }]);
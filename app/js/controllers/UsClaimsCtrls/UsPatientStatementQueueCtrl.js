
"use strict";
eHnoteWebApp.controller("UsPatientStatementQueueCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "eHnoteUserDataService", "localStorageFactory", "eHnoteUserAppointmentDataService", "datapersistanceFactory", "$uibModal", "eHnotePatientDataService",
    function ($scope, $rootScope, $location, $filter, alertify, $q, $timeout, eHnoteMasterDataService, eHnoteInsuranceService, eHnoteSettingsDataService, eHnoteUserDataService, localStorageFactory, eHnoteUserAppointmentDataService, datapersistanceFactory, $uibModal, eHnotePatientDataService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };

        console.log($scope.mainBillerDataObj);

        $scope.GetPatientQueueObj = function () {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
                "FromDate": null,
                "ToDate": null,
                "PatientId": null,
                "PatientClaimNumber": "",
                "BillingProviderIds": "",
                "PayorIds": "",
                "GenerateModeId": 0,
                "ProcessStatusId": 0,
                "HasPatientEmail": 0, //0 all- 1 true(only patients with email) or 2- false(patients without email)
                "PatientBalanceIndicator": 0,
                "PatientBalanceType": "", // > or  < 
                "PatientBalance": 0,
                "IsStatementSent": false,
                "IsChecked": false,
                "SortBy": "",
                "PatientAgingList": [],


            }
            return obj;
        }
        $scope.PatientQueueObj = $scope.GetPatientQueueObj();

        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };
        $scope.BillingProviderList = [];
        $scope.PatientAgingObj = {
            "SelectStatusString": "All",
            "PAtientAgingName": "",
            "AllStatusCheck": true
        };

        function getSelectedPatientData() {
            var obj = {
                "SearchText": "",
                "PatientId": 0,
                "SearchTypeId": 2
            }
            return obj;
        };
        $scope.PatientSearchdata = getSelectedPatientData();


        $scope.BillingProviderTypeObj = {
            "SelectStatusString": "All",
            "Name": "",
            "AllStatusCheck": true
        };

        $scope.PayorsObj = {
            "SelectStatusString": "All",
            "Name": "",
            "AllStatusCheck": true
        };

        $scope.changeSearchType = function (id) {
            $scope.PatientSearchdata.SearchTypeId = id;
            $scope.PatientQueueObj.PatientId = 0;
            $scope.AllPatientList = [];
            $scope.PatientQueueObj.PatientClaimNumber = '';
            $scope.ShowPatientListDrop = false;
        }
        $scope.BillingTypeToggle = function () {

            var checkedArray = _.where($scope.BillingProviderList, { IsChecked: true });
            $scope.BillingProviderTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.BillingProviderList.length === checkedArray.length ? true : false;
            if ($scope.BillingProviderTypeObj.AllStatusCheck) {
                $scope.BillingProviderTypeObj.SelectStatusString = 'All';
            }

            $scope.PatientQueueObj.BillingProviderIds = checkedArray.map(function (status) {
                return status.OrganizationBillingProviderId;
            }).join(',');

            if (!$scope.BillingProviderTypeObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.BillingProviderTypeObj.SelectStatusString = 'Selected';
            }
        };

        $scope.PayorsToggle = function () {

            var checkedArray = _.where($scope.PayorsList, { IsChecked: true });
            $scope.PayorsObj.AllStatusCheck = checkedArray.length > 0 && $scope.PayorsList.length === checkedArray.length ? true : false;
            if ($scope.PayorsObj.AllStatusCheck) {
                $scope.PayorsObj.SelectStatusString = 'All';
            }

            $scope.PatientQueueObj.PayorIds = checkedArray.map(function (status) {
                return status.PayorId;
            }).join(',');

            if (!$scope.PayorsObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.PayorsObj.SelectStatusString = 'Selected';
            }
        };

        $scope.init = function () {



            $scope.HospitalAddressArray = [];
            if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
                $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
                let obj = {};
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
                $scope.HospitalAddressArray.ContactNo = object.UsFormatMobileNumber;
                obj.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                    doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;

            }


            $scope.PatientQueueObj = $scope.GetPatientQueueObj();
            $scope.PatientStatementsQueueList = [];
            $scope.MasterPriority = [];
            $scope.MasterAlertTypes = [];
            $scope.MasterAlertTag = [];
            $scope.MasterAlertNoteType = [];

            var Locationids = '';
            Locationids = $scope.AllUserBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");



            if ($scope.BillingProviderList.length > 0) {
                var BillingProviderids = $scope.BillingProviderList
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.OrganizationBillingProviderId)
                    .join(",");
            }

            var param = {
                "OrganizationId": $scope.HospitalId,
                "Locationids": Locationids || '',
                "PageSize": $scope.PatientQueueObj.PageSize,
                "PageNumber": $scope.PatientQueueObj.PageNumber,
                "PatientId": $scope.PatientQueueObj.PatientId,
                "ClaimNumber": $scope.PatientQueueObj.PatientClaimNumber,
                "PostingFrom": $scope.PatientQueueObj.FromDate,
                "PostingTo": $scope.PatientQueueObj.ToDate,

            }

            var bilobj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 20
            };
            var obj2 = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "OrganizationId": $scope.HospitalId,
                "PayorId": 0,
                "SearchText": "",
            };

            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                eHnoteSettingsDataService.GetOrganizationBillingProviders(bilobj),
                eHnoteInsuranceService.GetParentOrganizationPayorsList(obj2),
                // eHnoteInsuranceService.GetPatientsWithBalancesForStatements(param),

                //  eHnoteInsuranceService.GetPatientgeneratedStatementsList($scope.PatientQueueObj),
                /*eHnoteInsuranceService.GetAllPatientBalanceClaimsByDuration(param)*/
            ]).then(function (resp) {
                if (resp[0].data.status == "Success") {

                    $scope.MasterPatientStatementProcessStatus = [];
                    $scope.MasterPatientStatementProcessedVia = [];
                    $scope.MasterPatientStatementGeneratedMode = [];
                    $scope.MasterPatientAgingData = [];
                    if (resp[0].data.MasterPatientStatementProcessStatus.length > 0) {
                        $scope.MasterPatientStatementProcessStatus = resp[0].data.MasterPatientStatementProcessStatus || [];
                    }
                    if (resp[0].data.MasterPatientStatementProcessedVia.length > 0) {
                        $scope.MasterPatientStatementProcessedVia = resp[0].data.MasterPatientStatementProcessedVia || [];
                    }

                    if (resp[0].data.MasterPatientStatementGeneratedMode.length > 0) {
                        $scope.MasterPatientStatementGeneratedMode = resp[0].data.MasterPatientStatementGeneratedMode || [];

                    }
                    if (resp[0].data.MasterPatientAgingData.length > 0) {
                        $scope.MasterPatientAgingData = resp[0].data.MasterPatientAgingData || [];
                        $scope.MasterPatientAginglist = resp[0].data.MasterPatientAgingData || [];

                        $scope.MasterPatientAginglist.forEach(function (item) {
                            item.IsChecked = true;
                        });
                        $scope.PatientQueueObj.PatientAgingList = $scope.MasterPatientAgingData.map(function (status) {
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
                        /* $scope.MasterAlertNoteType = resp[0].data.MasterAlertNoteType || [];*/
                        $scope.MasterAlertNoteType = $filter("filter")(resp[0].data.MasterAlertNoteType, function (item) {
                            return item.AlertNoteTypeId !== 6;
                        }) || [];
                    }

                }



                if (resp[1].data.rows.length > 0) {
                    var tempList = resp[1].data.rows || [];
                    if (tempList.length > 0) {
                        var filtredArray = $filter("filter")(tempList, { "ActiveInd": 'Y' }, true) || [];
                        $scope.BillingProviderList = angular.copy(filtredArray);

                        $scope.CheckAllBillingType(true);

                    }
                }

                if (resp[2].data.rows.length > 0) {
                    $scope.PayorsList = resp[2].data.rows || [];
                    $scope.CheckAllPayors(true);
                }

                //if (resp[2].data.rows.length > 0) {
                //    $scope.PatientStatementsQueueList = resp[2].data.rows;
                //    $scope.PatientStatementsQueueListCount = resp[2].data.count;
                //}

                //if (resp[2].data.rows.length > 0) {
                //    $scope.PatientStatementsQueueList = resp[2].data.rows || [];
                //    $scope.PatientQueueObj.Count = resp[2].data.count;
                //    angular.forEach($scope.PatientStatementsQueueList, function (item) {
                //        item.ProcessedViaId = item.ProcessedViaId || 0;
                //        item.PatientMobile = item.PatientMobile || "";
                //        if (item.PatientMobile != '') {
                //            var obj = eHnoteUserDataService.UsMobileFormatChange(item.PatientMobile);
                //            item.PatientMobile = obj.UsFormatMobileNumber;
                //        }
                //        item.IsShowDetails = false;
                //        item.ProcessStatusId = 2;
                //        item.ProcessStatus = "Hold";
                //        if (item.PatientEmail != "") {
                //            item.ProcessedViaId = 1;
                //            item.ProcessVia = "Email";
                //            item.ProcessStatusId = 1;
                //            item.ProcessStatus = "Send";
                //        }
                //    });
                //}

                $scope.selectedPatientStatementList = eHnoteMasterDataService.getPatientStatementfreezingList();
                if ($scope.selectedPatientStatementList != '') {
                    $scope.PatientQueueObj.FromDate = $scope.selectedPatientStatementList.FromDate || null;
                    $scope.PatientQueueObj.ToDate = $scope.selectedPatientStatementList.ToDate || null;

                    $scope.selectedPatientStatementList.Locations = $scope.selectedPatientStatementList.Locations || '';
                    if ($scope.AllUserBranchesList.length > 0 && $scope.selectedPatientStatementList.Locations != '') {
                        angular.forEach($scope.AllUserBranchesList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedLocationIds = $scope.selectedPatientStatementList.Locations.split(",");

                        $scope.AllUserBranchesList.forEach(pitem => {
                            pitem.IsChecked = selectedLocationIds.includes(pitem.ClinicId.toString());
                        });
                    }

                    $scope.selectedPatientStatementList.PatientAgingids = $scope.selectedPatientStatementList.PatientAgingids || '';
                    $scope.MasterPatientAginglist = $scope.MasterPatientAginglist || [];
                    if ($scope.MasterPatientAginglist.length > 0 && $scope.selectedPatientStatementList.PatientAgingids != '') {
                        angular.forEach($scope.MasterPatientAginglist, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedAgingids = $scope.selectedPatientStatementList.PatientAgingids.split(",");

                        $scope.MasterPatientAginglist.forEach(pitem => {
                            pitem.IsChecked = selectedAgingids.includes(pitem.PatientAgingDataId.toString());
                        });
                    }
                }
                $scope.ApplyPatientQueue();
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });


        }


        $scope.CheckAllBillingType = function (val) {

            $scope.PatientQueueObj.BillingProviderIds = 0;

            if (val) {
                angular.forEach($scope.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

                $scope.PayorsObj.SelectStatusString = 'All';
                $scope.PatientQueueObj.BillingProviderIds = $scope.BillingProviderList.map(function (status) {
                    return status.OrganizationBillingProviderId;
                }).join(',');
            }
            else {
                angular.forEach($scope.BillingProviderList, function (item) {
                    item.IsChecked = false;
                });

                $scope.PayorsObj.SelectStatusString = 'Select Status';
                $scope.PatientQueueObj.BillingProviderIds = $scope.BillingProviderList.map(function (status) {
                    return status.OrganizationBillingProviderId;
                }).join(',');
            }
        };

        $scope.CheckAllPayors = function (val) {
            $scope.PatientQueueObj.PayorIds = 0;
            if (val) {
                angular.forEach($scope.PayorsList, function (item) {
                    item.IsChecked = true;
                });

                $scope.PayorsObj.SelectStatusString = 'All';
                $scope.PatientQueueObj.PayorIds = $scope.PayorsList.map(function (status) {
                    return status.PayorId;
                }).join(',');
            }
            else {
                angular.forEach($scope.PayorsList, function (item) {
                    item.IsChecked = false;
                });

                $scope.PayorsObj.SelectStatusString = 'Select Status';
                $scope.PatientQueueObj.BillingProviderIds = $scope.PayorsList.map(function (status) {
                    return status.PayorId;
                }).join(',');
            }
        };

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

        $scope.ClearPatientQueue = function () {
            $scope.PatientQueueObj = $scope.GetPatientQueueObj();
            if ($scope.AllUserBranchesList.length > 0) {
                var Locationids = $scope.AllUserBranchesList

                    .map(pitem => pitem.ClinicId)
                    .join(",");
            }
            if ($scope.MasterPatientAginglist.length > 0) {
                var PatientAgingids = $scope.MasterPatientAginglist

                    .map(pitem => pitem.PatientAgingDataId)
                    .join(",");
            }
            var Frezobj = {
                "FromDate": $scope.PatientQueueObj.FromDate || null,
                "ToDate": $scope.PatientQueueObj.ToDate || null,
                'Locations': Locationids,
                'PatientAgingids': PatientAgingids || '',
            };
            eHnoteMasterDataService.addPatientStatementfreezingList(Frezobj);
            $scope.init();
        }
        //$scope.ApplyPatientQueue = function (pageno, type) {            
        //    $scope.PatientQueueObj.PageNumber = pageno || 1;
        //    var type = (type === undefined || type === '') ? 'All' : type;
        //    var Locationids = '';
        //    Locationids = $scope.AllUserBranchesList
        //        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
        //        .map(pitem => pitem.ClinicId)
        //        .join(",");
        //    $scope.PatientQueueObj.PageNumber = pageno || 1;
        //    var param = {
        //        "OrganizationId": $scope.HospitalId,
        //        "Locationids": Locationids || '',
        //        "PageSize": $scope.PatientQueueObj.PageSize,
        //        "PageNumber": $scope.PatientQueueObj.PageNumber,
        //        "FromDate": $scope.PatientQueueObj.FromDate,
        //        "ToDate": $scope.PatientQueueObj.ToDate,
        //        "PatientId": $scope.PatientQueueObj.PatientId,
        //        "PatientClaimNumber": $scope.PatientQueueObj.PatientClaimNumber,
        //        "GenerateModeId": $scope.PatientQueueObj.GenerateModeId,
        //        "ProcessStatusId": $scope.PatientQueueObj.ProcessStatusId,
        //        "HasPatientEmail": $scope.PatientQueueObj.HasPatientEmail,
        //        "PatientBalanceIndicator": $scope.PatientQueueObj.PatientBalanceIndicator,
        //        "PatientBalanceType": $scope.PatientQueueObj.PatientBalanceType,
        //        "PatientBalance": $scope.PatientQueueObj.PatientBalance,
        //        "IsStatementSent": $scope.PatientQueueObj.IsStatementSent,
        //    }

        //    eHnoteInsuranceService.GetPatientgeneratedStatementsList(param).then(function (resp) {              
        //        if (resp.data.status=="Success") {
        //            $scope.PatientStatementsQueueList = resp.data.rows || [];
        //            $scope.PatientStatementsQueueListCount = resp.data.count;
        //        }
        //    }, function (err) { console.log(err); });


        //}

        $scope.ApplyPatientQueue = function (pageno) {
            $scope.PatientStatementsQueueList = [];

            var Locationids = '';
            Locationids = $scope.AllUserBranchesList
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                .map(pitem => pitem.ClinicId)
                .join(",");


            if ($scope.BillingProviderList.length > 0) {
                var BillingProviderids = $scope.BillingProviderList
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.OrganizationBillingProviderId)
                    .join(",");
            }

            if ($scope.PayorsList.length > 0) {
                var Payorsids = $scope.PayorsList
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PayorId)
                    .join(",");
            }

            if ($scope.MasterPatientAginglist.length > 0) {
                var PatientAgingids = $scope.MasterPatientAginglist
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PatientAgingDataId)
                    .join(",");
            }
            var Frezobj = {
                "FromDate": $scope.PatientQueueObj.FromDate || null,
                "ToDate": $scope.PatientQueueObj.ToDate || null,
                'Locations': Locationids,
                'BillingProviderId': BillingProviderids || "",
                'PatientAgingids': PatientAgingids || '',

            };
            eHnoteMasterDataService.addPatientStatementfreezingList(Frezobj);

            $scope.PatientQueueObj.PageNumber = pageno || 1;
            var param = {
                "OrganizationId": $scope.HospitalId,
                "LocationIds": Locationids || '',
                "PageSize": $scope.PatientQueueObj.PageSize,
                "PageNumber": $scope.PatientQueueObj.PageNumber,
                "PatientId": $scope.PatientQueueObj.PatientId,
                "ClaimNumber": $scope.PatientQueueObj.PatientClaimNumber,
                'BillingProviderId': BillingProviderids || "",
                "PayorId": Payorsids || "",
                "FromDate": $scope.PatientQueueObj.FromDate,
                "ToDate": $scope.PatientQueueObj.ToDate,
                /*"PatientAgingList": $scope.PatientQueueObj.PatientAgingList,*/
                //"PatientAgingList": PatientAgingids,
                //"SortBy": $scope.PatientQueueObj.SortBy,
            }

            eHnoteInsuranceService.GetPatientsWithBalancesForStatements(param).then(function (resp) {

                $scope.PatientStatementsQueueListCount = 0;

                if (resp.data.rows.length > 0) {
                    $scope.PatientStatementsQueueList = resp.data.rows || [];
                    $scope.PatientStatementsQueueListCount = resp.data.count;
                    if ($scope.PatientStatementsQueueList.length > 0) {
                        angular.forEach($scope.PatientStatementsQueueList, function (item) {
                            item.PatientMobile = item.PatientMobile || "";
                            if (item.PatientMobile != '') {
                                var obj = eHnoteUserDataService.UsMobileFormatChange(item.PatientMobile);
                                item.PatientMobile = obj.UsFormatMobileNumber;
                            }
                            item.IsShowDetails = false;
                            //item.ProcessStatusId = 2;
                            //item.ProcessStatus = "Hold";
                            //if (item.PatientEmail != "") {
                            //    item.ProcessedViaId = 1;
                            //    item.ProcessVia = "Email";
                            //    item.ProcessStatusId = 1;
                            //    item.ProcessStatus = "Send";
                            //}
                        });
                    }
                }

            }, function (err) { console.log(err); });
        }

        $scope.UpdateGeneratedStatement = function (item) {
            $scope.PatientStatementsListData = [];
            $scope.PatientStatementsListData.push(item);
            var param = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "PatientId": item.PatientId,
                "PatientStatementIds": item.PatientStatementId,
                "ProcessStatusId": item.ProcessStatusId,
                "ProcessStatus": item.ProcessStatus,
                "ProcessViaId": item.ProcessViaId,
                "ProcessVia": item.ProcessVia,
                "GeneratedMode": item.GeneratedMode,
                "GeneratedModeId": item.GeneratedModeId,
                "StatementSent": 0
            }

            eHnoteInsuranceService.UpdateGeneratedPatientStatementProcessStatus(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    //$scope.ApplyPatientQueue();
                    if (item.ProcessedViaId != 1) {
                        $scope.GetMultiplePatientStatementPrint();
                    }

                }
                console.log(resp);
            }, function (err) { console.log(err); });


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

        $scope.ChangeProcessStatus = function (Id, item) {
            var obj = $filter("filter")($scope.MasterPatientStatementProcessStatus, { "StatusId": Id }, true)[0];
            item.ProcessStatusId = obj.StatusId;
            item.ProcessStatus = obj.StatusName;
        }
        $scope.ChangeProcessVia = function (Id, item) {
            var obj = $filter("filter")($scope.MasterPatientStatementProcessedVia, { "ProcessedViaId": Id }, true)[0];
            item.ProcessViaId = obj.ProcessedViaId;
            item.ProcessVia = obj.ProcessedVia;
        }

        $scope.ClaimStatusToggle = function (obj) {
            var checkedArray = _.where($scope.MasterPatientAginglist, { IsChecked: true });
            $scope.PatientAgingObj.AllStatusCheck = checkedArray.length > 0 && $scope.MasterPatientAginglist.length === checkedArray.length ? true : false;
            if ($scope.PatientAgingObj.AllStatusCheck) {
                $scope.PatientAgingObj.SelectStatusString = 'All';
                $scope.PatientQueueObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
            }

            if (!$scope.PatientAgingObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.PatientAgingObj.SelectStatusString = 'Selected';
                $scope.PatientQueueObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
            }
            if (!$scope.PatientAgingObj.AllStatusCheck && checkedArray.length === 0) {
                $scope.PatientAgingObj.SelectStatusString = 'Select';
                $scope.PatientQueueObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
            }
        };

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
                "windowClass": "offcanves-right z-index-five",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "IshideIndicator": true,
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                if (resp === true) {
                    $scope.ApplyPatientQueue();
                }
            },
                function () {

                });
        }

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
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__eighty--",
                "resolve": {
                    "PatientAlertsobj": function () { return obj; },
                },
            });

            mInstanceAdd.result.then(
                function () {

                },
                function () {

                });
        };

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
            $scope.PatientQueueObj.PatientId = 0;
            $scope.PatientQueueObj.PatientClaimNumber = '';
        };

        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
            $scope.PatientQueueObj.PatientId = patietnitem.PatientID;
            $scope.PatientSearchdata.SearchText = patietnitem.FullName;
            $scope.AllPatientList = [];
            $scope.ApplyPatientQueue();
            $scope.ShowPatientListDrop = false;
        };

        $scope.ClaimStatusToggle = function (obj) {
            var checkedArray = _.where($scope.MasterPatientAginglist, { IsChecked: true });
            $scope.PatientAgingObj.AllStatusCheck = checkedArray.length > 0 && $scope.MasterPatientAginglist.length === checkedArray.length ? true : false;
            if ($scope.PatientAgingObj.AllStatusCheck) {
                $scope.PatientAgingObj.SelectStatusString = 'All';
                $scope.PatientQueueObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
            }

            if (!$scope.PatientAgingObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.PatientAgingObj.SelectStatusString = 'Selected';
                $scope.PatientQueueObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
                console.log($scope.PatientQueueObj.PatientAgingList);
            }
            if (!$scope.PatientAgingObj.AllStatusCheck && checkedArray.length === 0) {
                $scope.PatientAgingObj.SelectStatusString = 'Select';
                $scope.PatientQueueObj.PatientAgingList = checkedArray.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
                console.log($scope.PatientQueueObj.PatientAgingList);
            }
        };

        $scope.checkPatientAging = function (val) {
            if (val) {
                angular.forEach($scope.MasterPatientAginglist, function (item) {
                    item.IsChecked = true;
                });
                $scope.PatientQueueObj.PatientAgingList = $scope.MasterPatientAgingData.map(function (status) {
                    return status.PatientAgingDataId;
                }).join(',');
                console.log($scope.PatientQueueObj.PatientAgingList);

                $scope.PatientAgingObj.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.MasterPatientAginglist, function (item) {
                    item.IsChecked = false;
                });

                $scope.PatientAgingObj.SelectStatusString = 'Selected';
            }
            $scope.ClaimStatusToggle();
        };

        $scope.openAccordianItem = function (item) {
            const isCurrentlyOpen = item.isOpen || false;
            $scope.PatientStatementsQueueList.forEach(subItem => {
                subItem.isOpen = false;
            });
            item.isOpen = !isCurrentlyOpen;
        };




        $scope.openHoldStatusPopup = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "HoldStatusPopup.html",
                /* "size": "lg",*/
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " modal__style--1 modal__sixty--",
                "resolve": {
                    "mainObject": function () { return item; },
                    "ProcessStatus": function () { return $scope.MasterPatientStatementProcessStatus; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, mainObject, ProcessStatus, eHnoteInsuranceService, alertify) {

                    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.MasterProcessStatus = ProcessStatus || [];
                    $scope.MasterProcessStatus = $filter("filter")($scope.MasterProcessStatus, function (item) {
                        return item.StatusId != 1 && item.StatusId != 4;
                    });

                    $scope.mainObject = mainObject || '';

                    $scope.HospitalId = 0;
                    $scope.ParentHospitalId = 0;
                    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                        && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    }

                    $scope.GetHoldobj = function () {
                        var Obj = {

                            "HoldId": $scope.mainObject.HoldId || null,
                            "UserId": $scope.UserId,
                            "PatientId": $scope.mainObject.PatientId || null,
                            "OrganizationId": $scope.HospitalId,
                            "HoldStartDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "HoldEndDate": "",
                            "Reason": "",
                            "DeleteInd": "N",
                            "ProcessStatus": $scope.mainObject.ProcessStatus || "Ready To Send",
                            "ProcessStatusId": $scope.mainObject.ProcessStatusId || 2,
                        }
                        return Obj;
                    }

                    $scope.Holdobj = $scope.GetHoldobj();


                    $scope.ChangeProcessStatus = function (Id, item) {
                        var obj = $filter("filter")($scope.MasterProcessStatus, { "StatusId": Id }, true)[0];
                        item.ProcessStatusId = obj.StatusId;
                        item.ProcessStatus = obj.StatusName;
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.UpdateHoldStatus = function () {
                        $scope.Holdobj.ProcessStatusId = $scope.Holdobj.ProcessStatusId || null;
                        if ($scope.Holdobj.ProcessStatusId == null) {
                            alertify.error("Please select Process Status");
                            return false;
                        }



                        let obj = {
                            "HoldId": $scope.Holdobj.HoldId || null,
                            "UserId": $scope.Holdobj.UserId,
                            "PatientId": $scope.Holdobj.PatientId || null,
                            "OrganizationId": $scope.Holdobj.OrganizationId,
                            "HoldStartDate": $scope.Holdobj.HoldStartDate || "",
                            "HoldEndDate": $scope.Holdobj.HoldEndDate || "",
                            "Reason": $scope.Holdobj.Reason || "",
                            "DeleteInd": $scope.Holdobj.DeleteInd || "N",
                            "ProcessStatus": $scope.Holdobj.ProcessStatus || "",
                            "ProcessStatusId": $scope.Holdobj.ProcessStatusId || "",

                        }
                        eHnoteInsuranceService.HoldPatientForStatement(obj).then(function (resp) {
                            if (resp.data.Status == 'Success') {
                                $uibModalInstance.close();
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }
            });
            mInstanceAdd.result.then(function (resp) {
                $scope.ApplyPatientQueue(1);
            }, function (cancel) {
            });

        };





        $scope.GetPatientJobObj = function () {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ParentOrganizationId": $scope.ParenthospitalId,


            }
            return obj;
        }
        $scope.GetPatientManualJobObj = $scope.GetPatientQueueObj();

        $scope.ApplyPatientJob = function () {
            let obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "OrganizationId": $scope.GetPatientManualJobObj.OrganizationId,
                "FromDate": $scope.GetPatientManualJobObj.FromDate,
                "ToDate": $scope.GetPatientManualJobObj.ToDate,
            }

            eHnoteInsuranceService.GetGeneratedPatientStatementsByDates(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                   
                    alertify.success("Email sent successfully");
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }





        $scope.ChangeFrom = function (date) {
            $scope.GetPatientManualJobObj.FromDate = $scope.PatientQueueObj.FromDate;
        }

        $scope.ChangeTo = function (date) {
            $scope.GetPatientManualJobObj.ToDate = $scope.PatientQueueObj.ToDate;
        }


    }]);
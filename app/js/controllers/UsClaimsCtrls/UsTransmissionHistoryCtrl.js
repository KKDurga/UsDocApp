"use strict";
eHnoteWebApp.controller("UsTransmissionHistoryCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "eHnoteUserDataService", "InventoryService","eHnotePatientDataService",
    function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteInsuranceService, eHnoteSettingsDataService, eHnoteUserDataService, InventoryService, eHnotePatientDataService) {

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

    $scope.UserFullName = doctorinfo.doctordata.User[0].SecondUserFullName;
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

        console.log($scope.mainBillerDataObj);

        $scope.OrgBillingProvider = [];
        $scope.OrgBillingProvider = $scope.mainBillerDataObj.BillingProviderList || [];

    
    $scope.PatientTransmissionprintList = [];

    $scope.GetTransmissionHistoryObj = function() {
        var obj = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 10,
            "PageNumber": 1,
            "PostingFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PostingToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "SearchType": 1,
            "PatientId": null,
            "PatientClaimNumber": "",
            "IsPatientClaimNumber": "",
        }
        return obj;
    }

    $scope.TransmissionHistoryObj = $scope.GetTransmissionHistoryObj();

    $scope.GetPatientTransmissionInfo = function () {
        var Obj = {
            "Address1": '',
            "Address2": '',
            "ClinicName": '',
            "ContactNo": '',
            "PinCode": '',
            "CityName": '',
            "StateName": '',
            "CountryName": '',
            "TotalStatementAmount": '',
            "IsStatementsListInd": false
        }
        return Obj;
    }

    $scope.PatientTransmissionInfo = angular.copy($scope.GetPatientTransmissionInfo());

    function getSelectedPatientData() {
        var obj = {
            "SearchText": "",
            "PatientId": 0,
            "SearchTypeId": 1
        }
        return obj;
    };
    $scope.PatientSearchdata = getSelectedPatientData();


    $scope.changeSearchBy = function (id) {
        $scope.TransmissionHistoryObj.SearchType = id;
        $scope.TransmissionHistoryObj.PatientId = 0;
        $scope.TransmissionHistoryObj.PostingFromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.TransmissionHistoryObj.PostingToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.TransmissionHistoryObj.PatientClaimNumber = "";
        $scope.GetPatientStatementsDetails();
    }

    $scope.changeSearchType = function (id) {
        $scope.PatientSearchdata = getSelectedPatientData();
        $scope.PatientSearchdata.SearchTypeId = id;
        $scope.TransmissionHistoryObj.PatientId = 0;
        $scope.AllPatientList = [];
        $scope.TransmissionHistoryObj.PatientClaimNumber = "";
        $scope.ShowPatientListDrop = false;
        
    }

    $scope.GetPatientStatementsDetails = function () {
        $scope.PatientStatementsList = [];
        var param = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 10,
            "PageNumber": 1,
            "PostingFrom": $scope.TransmissionHistoryObj.PostingFromDate,
            "PostingTo": $scope.TransmissionHistoryObj.PostingToDate,
            "SearchType": $scope.TransmissionHistoryObj.SearchType || "",
            "PatientId": $scope.TransmissionHistoryObj.PatientId || 0,
            "ClaimNumber": $scope.TransmissionHistoryObj.PatientClaimNumber || "",
        }

        eHnoteInsuranceService.GetPatientStatementsList(param).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.PatientStatementsList = angular.copy(resp.data.rows);

                    angular.forEach($scope.PatientStatementsList, function (mainitem) {
                        mainitem.ClaimLineItems = mainitem.ClaimLineItems || [];
                        mainitem.ISallPatientClaimNumber = mainitem.ISallPatientClaimNumber || '';
                        mainitem.TotalPatientBalanceAmount = mainitem.TotalPatientBalanceAmount || 0;
                        var distinctClaimNumbers = []; 

                        if (mainitem.ClaimLineItems.length > 0) {
                            angular.forEach(mainitem.ClaimLineItems, function (subitem) {
                                if (subitem.PatientClaimNumber != '' && distinctClaimNumbers.indexOf(subitem.PatientClaimNumber) === -1) {
                                    distinctClaimNumbers.push(subitem.PatientClaimNumber);

                                    if (mainitem.ISallPatientClaimNumber == '') {
                                        mainitem.ISallPatientClaimNumber = subitem.PatientClaimNumber || '';
                                    } else {
                                        mainitem.ISallPatientClaimNumber += ',' + subitem.PatientClaimNumber;
                                    }
                                }
                            });
                        }
                        else {
                            angular.forEach(mainitem.PatientStatements, function (Pitem) {
                                mainitem.TotalPatientBalanceAmount += Pitem.TotalPatientBalance;
                            });
                        }
                    });

                    console.log($scope.PatientStatementsList);

                }
            }
        });
    }
    $scope.GetPatientStatementsDetails();

    $scope.ApplyTransmission = function () {
        $scope.GetPatientStatementsDetails();
    }

    $scope.ClearTransmission = function () {
        $scope.TransmissionHistoryObj.PatientClaimNumber = "";
        $scope.TransmissionHistoryObj.PostingFromDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.TransmissionHistoryObj.PostingToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.PatientSearchdata.SearchTypeId = "1";
        $scope.PatientSearchdata.SearchText = "";
        $scope.PatientSearchdata.PatientId = 0;
        $scope.TransmissionHistoryObj.PatientId = 0;
        $scope.ShowPatientListDrop = false;
        $scope.GetPatientStatementsDetails();
    }

    $scope.DownloadTransmissionClaimPdf = function (item,Id) {

        $scope.HospitalAddressArray = [];
        if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];

            $scope.PatientTransmissionInfo.Address1 = $scope.HospitalAddressArray.Address1;
            $scope.PatientTransmissionInfo.Address2 = $scope.HospitalAddressArray.Address2;
            $scope.PatientTransmissionInfo.ClinicName = $scope.HospitalAddressArray.ClinicName;
            $scope.PatientTransmissionInfo.ContactNo = $scope.HospitalAddressArray.ContactNo || "";
            $scope.PatientTransmissionInfo.PinCode = $scope.HospitalAddressArray.PinCode;
            $scope.PatientTransmissionInfo.CityName = $scope.HospitalAddressArray.CityName;
            $scope.PatientTransmissionInfo.StateName = $scope.HospitalAddressArray.StateName;
            $scope.PatientTransmissionInfo.CountryName = $scope.HospitalAddressArray.CountryName;
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientTransmissionInfo.ContactNo);
            $scope.PatientTransmissionInfo.ContactNo = obj.UsFormatMobileNumber;
        }

        if (Id == 1) {
            $scope.PatientTransmissionprintList = angular.copy(item.PatientStatements);
            $scope.PatientTransmissionInfo.TotalStatementAmount = item.TotalStatementAmount;
        } else {
            $scope.PatientTransmissionprintList.push(item);
            $scope.PatientTransmissionInfo.TotalStatementAmount = item.TotalPatientBalance;
        }

        angular.forEach($scope.PatientTransmissionprintList, function (item) {
            item.TotalBalance = 0;
            item.TotalPatientAmountData = 0;
            item.OrgBillingProviderListData = {};
            angular.forEach(item.ClaimLineItems, function (citem) {
                item.TotalBalance += citem.TotalBalance;

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

        $scope.PatientTransmissionInfo.IsStatementsListInd = true;

        var element = document.getElementById('transmission-pdf-content');

        var options = {
            margin: 0.1,
            filename: 'TransmissionClaim.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save().then(function () {
            $scope.PatientTransmissionprintList = [];
            $scope.PatientTransmissionInfo.IsStatementsListInd = false;
        });
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
    //        "PageSize": 30,
    //        "PageNo": 1,
    //        "DOB": null
    //    };
    //    if ($scope.PatientSearchdata.SearchTypeId == 1) {
    //        object.Name = val;
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



    $scope.SelectedPatient = function (patietnitem) {
        $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
        $scope.TransmissionHistoryObj.PatientId = patietnitem.PatientID;
        $scope.PatientSearchdata.SearchText = patietnitem.FullName;
        $scope.AllPatientList = [];
        $scope.ShowPatientListDrop = false;
        $scope.GetPatientStatementsDetails();
        };

        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearchdata.SearchText = "";
            $scope.PatientSearchdata.PatientId = 0;
            $scope.TransmissionHistoryObj.PatientId = 0;
        };

}]);